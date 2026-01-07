import cron from 'node-cron';
import supabase from '../config/supabaseClient.js';
import { publishPost } from '../services/socialPostService.js';

// Run every minute
const task = cron.schedule('* * * * *', async () => {
  console.log('⏳ Cron Job: Checking for scheduled posts...');
  
  const now = new Date().toISOString();

  try {
    // 1. Fetch Due Posts
    // We need: Post Data, Account Credentials, and the Schedule ID
    const { data: duePosts, error } = await supabase
      .from('scheduled_posts')
      .select(`
        id,
        scheduled_time,
        generated_posts ( caption, image_url ),
        social_accounts ( platform, account_id, access_token )
      `)
      .eq('status', 'pending')
      .lte('scheduled_time', now); // Less than or Equal to NOW

    if (error) {
      console.error('Error fetching due posts:', error.message);
      return;
    }

    if (!duePosts || duePosts.length === 0) {
      // console.log('No posts due.');
      return;
    }

    console.log(`Found ${duePosts.length} posts due for publishing.`);

    // 2. Process Each Post
    for (const post of duePosts) {
      const { generated_posts: content, social_accounts: account, id: scheduleId } = post;

      if (!content || !account) {
        console.error(`Invalid data for schedule ${scheduleId}. Skipping.`);
        await updateStatus(scheduleId, 'failed', 'Missing content or account data');
        continue;
      }

      console.log(`🚀 Publishing to ${account.platform} (${account.account_id})...`);

      try {
        // CALL THE SERVICE
        const result = await publishPost(account, content);

        if (result.success) {
          // Success: Update status and save the platform's post ID
          await updateStatus(scheduleId, 'published', null, result.postId);
          console.log(`✅ Successfully published schedule ${scheduleId}`);
        }
      } catch (err) {
        // Failure: Update status and save error message
        console.error(`❌ Failed to publish schedule ${scheduleId}:`, err.message);
        await updateStatus(scheduleId, 'failed', err.message);
      }
    }

  } catch (err) {
    console.error('Cron Job Fatal Error:', err);
  }
});

// Helper to update Supabase
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
  console.log("⏰ Scheduler Cron Job started.");
  task.start();
};