import cron from 'node-cron';
import supabase from '../config/supabaseClient.js';
import { publishPost } from '../services/socialPostService.js';
import { createShortLink } from '../services/linkService.js'; // Import Link Service

// Run every minute
const task = cron.schedule('* * * * *', async () => {
  console.log('⏳ Cron Job: Checking for scheduled posts...');
  
  const now = new Date().toISOString();

  try {
    // 1. Fetch Due Posts
    // NOTE: Humne businesses se website_url fetch kiya hai aur user_id bhi
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

    console.log(`Found ${duePosts.length} posts due for publishing.`);

    // 2. Process Each Post
    for (const post of duePosts) {
      const { generated_posts: content, social_accounts: account, id: scheduleId } = post;

      if (!content || !account) {
        console.error(`Invalid data for schedule ${scheduleId}. Skipping.`);
        await updateStatus(scheduleId, 'failed', 'Missing data');
        continue;
      }

      console.log(`🚀 Publishing to ${account.platform}...`);

      try {
        // --- STEP A: Short Link Logic ---
        let finalCaption = content.caption;
        const websiteUrl = account.businesses?.website_url; // Business URL uthaya
        const userId = content.user_id;

        if (websiteUrl) {
            // 1. Short code generate kiya
            const shortCode = await createShortLink(websiteUrl, scheduleId, userId);
            
            // 2. Full URL banaya (Domain environment variable se lena better hai)
            const domain = process.env.BASE_URL || 'http://localhost:3001'; 
            const shortUrl = `${domain}/r/${shortCode}`;

            // 3. Caption mein jod diya
            finalCaption = `${content.caption}\n\n🔗 ${shortUrl}`;
            console.log(`   Attached Tracking Link: ${shortUrl}`);
        } else {
            console.log('   No website URL found for business, skipping link attachment.');
        }

        // --- STEP B: Publish ---
        // Hum modified caption ke saath post kar rahe hain
        const postData = { 
            ...content, 
            caption: finalCaption 
        };
        
        // Asli function call kar rahe hain (Uncommented)
        const result = await publishPost(account, postData);

        if (result.success) {
          // Success: Status update karo
          await updateStatus(scheduleId, 'published', null, result.postId);
          console.log(`✅ Success! Schedule ${scheduleId} published.`);
        }
      } catch (err) {
        // Failure: Error log karo
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
  console.log("⏰ Scheduler Cron Job started (Analytics Enabled).");
  task.start();
};