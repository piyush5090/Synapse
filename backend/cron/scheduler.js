import cron from 'node-cron';
import supabase from '../config/supabaseClient.js';
import { publishPost } from '../services/socialPostService.js';
import { createShortLink } from '../services/linkService.js';

// Run every minute
const task = cron.schedule('* * * * *', async () => {
  console.log('⏳ Cron Job: Checking for scheduled posts...');
  
  const now = new Date().toISOString();

  try {
    // 1. Fetch Due Posts
    const { data: duePosts, error } = await supabase
      .from('scheduled_posts')
      .select(`
        id,
        scheduled_time,
        generated_posts ( caption, image_url, user_id ),
        social_accounts ( 
          platform, 
          account_id, 
          access_token,
          businesses ( website_url ) 
        )
      `)
      .eq('status', 'pending')
      .lte('scheduled_time', now);

    if (error) {
      console.error('Error fetching due posts:', error.message);
      return;
    }

    if (!duePosts || duePosts.length === 0) {
      return;
    }

    console.log(`Found ${duePosts.length} posts due. Locking them now...`);

    // --- 2. LOCKING STEP (Fix for Double Posting) ---
    // Mark as 'processing' IMMEDIATELY so the next cron run ignores them
    const postIds = duePosts.map(p => p.id);
    await supabase
      .from('scheduled_posts')
      .update({ status: 'processing' })
      .in('id', postIds);

    // 3. Process Each Post
    for (const post of duePosts) {
      const { generated_posts: content, social_accounts: account, id: scheduleId } = post;

      if (!content || !account) {
        console.error(`Invalid data for schedule ${scheduleId}. Skipping.`);
        await updateStatus(scheduleId, 'failed', 'Missing data');
        continue;
      }

      console.log(`🚀 Publishing to ${account.platform} (ID: ${scheduleId})...`);

      try {
        // --- STEP A: Short Link Logic ---
        let finalCaption = content.caption;
        const websiteUrl = account.businesses?.website_url;
        const userId = content.user_id;
        const platform = account.platform;

        if (websiteUrl) {
            // Using the idempotent createShortLink (checks for dupes internally)
            const shortCode = await createShortLink(websiteUrl, scheduleId, userId, platform);
            
            // Domain selection logic
            const domain = process.env.BASE_URL || 'https://synapse-backend-uuoe.onrender.com'; 
            const shortUrl = `${domain}/r/${shortCode}`;

            finalCaption = `${content.caption}\n\n🔗 ${shortUrl}`;
            console.log(`   Attached Tracking Link: ${shortUrl}`);
        }

        // --- STEP B: Publish ---
        const postData = { 
            ...content, 
            caption: finalCaption 
        };
        
        const result = await publishPost(account, postData);

        if (result.success) {
          // Success: Final Status update
          await updateStatus(scheduleId, 'published', null, result.postId);
          console.log(`✅ Success! Schedule ${scheduleId} published.`);
        } else {
           throw new Error("Publishing function returned false");
        }

      } catch (err) {
        // Failure: Error log and revert status
        console.error(`❌ Failed schedule ${scheduleId}:`, err.message);
        await updateStatus(scheduleId, 'failed', err.message);
      }
    }

  } catch (err) {
    console.error('Cron Job Fatal Error:', err);
  }
});

// Helper function to update status
async function updateStatus(id, status, errorMessage = null, platformPostId = null) {
  await supabase
    .from('scheduled_posts')
    .update({
      status,
      posted_at: status === 'published' ? new Date().toISOString() : null,
      error_message: errorMessage,
      platform_post_id: platformPostId
    })
    .eq('id', id);
}

export const startScheduler = () => {
  console.log("⏰ Scheduler Cron Job started (Double-Post Protection Enabled).");
  task.start();
};