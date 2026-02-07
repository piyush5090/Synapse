import cron from 'node-cron';
import supabase from '../config/supabaseClient.js';
import { publishPost } from '../services/socialPostService.js';
import { createShortLink } from '../services/linkService.js';
import { executeEmailCampaign } from '../services/emailSendService.js';

/* =========================================
   MAIN CRON TRIGGER
   ========================================= */
const task = cron.schedule('* * * * *', async () => {
  const now = new Date().toISOString();
  
  // Optional: distinct divider for logs
  // console.log(`\n--- ⏳ [${now}] Scheduler Tick ---`); 

  await Promise.all([
    processSocialPosts(now),
    processEmailCampaigns(now)
  ]);
});

/* =========================================
   1. EMAIL CAMPAIGN PROCESSOR
   ========================================= */
async function processEmailCampaigns(now) {
  try {
    // Fetch Pending Campaigns Due Now
    const { data: campaigns, error } = await supabase
      .from('email_campaigns')
      .select(`
        id,
        scheduled_at,
        recipients,
        status,
        sender_emails ( email, passkey, provider ), 
        email_templates ( subject, content, image_url ) 
      `)
      .eq('status', 'pending')
      .lte('scheduled_at', now);

    if (error) {
      console.error('❌ Email Fetch Error:', error.message);
      return;
    }

    if (!campaigns || campaigns.length === 0) return;

    console.log(`📧 Processing ${campaigns.length} email campaigns...`);

    // Lock them immediately
    const campaignIds = campaigns.map(c => c.id);
    await supabase.from('email_campaigns').update({ status: 'processing' }).in('id', campaignIds);

    // Process
    for (const campaign of campaigns) {
      try {
        const stats = await executeEmailCampaign(campaign);
        
        console.log(`✅ Campaign ${campaign.id} Done. Sent: ${stats.successCount}`);
        
        // Update Status to Success
        await supabase
          .from('email_campaigns')
          .update({ status: 'success' }) // You could add sent_count column later
          .eq('id', campaign.id);

      } catch (err) {
        console.error(`❌ Campaign ${campaign.id} Failed:`, err.message);
        await supabase
          .from('email_campaigns')
          .update({ status: 'failed' })
          .eq('id', campaign.id);
      }
    }

  } catch (err) {
    console.error('Email Scheduler Fatal Error:', err);
  }
}

/* =========================================
   2. SOCIAL MEDIA PROCESSOR
   ========================================= */
async function processSocialPosts(now) {
  try {
    // A. Fetch Due Posts
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
      console.error('❌ Social Fetch Error:', error.message);
      return;
    }

    if (!duePosts || duePosts.length === 0) return;

    console.log(`📱 Found ${duePosts.length} social posts due.`);

    // B. Lock Posts
    const postIds = duePosts.map(p => p.id);
    await supabase.from('scheduled_posts').update({ status: 'processing' }).in('id', postIds);

    // C. Process Each
    for (const post of duePosts) {
      const { generated_posts: content, social_accounts: account, id: scheduleId } = post;

      if (!content || !account) {
        console.error(`Skipping invalid social post ${scheduleId}`);
        await updateSocialStatus(scheduleId, 'failed', 'Missing data');
        continue;
      }

      try {
        // --- Short Link Logic ---
        let finalCaption = content.caption;
        const websiteUrl = account.businesses?.website_url;

        if (websiteUrl) {
          // Idempotent short link creation
          const shortCode = await createShortLink(websiteUrl, scheduleId, content.user_id, account.platform);
          
          // Construct URL
          const domain = process.env.BASE_URL || 'https://synapse-backend-uuoe.onrender.com';
          finalCaption = `${content.caption}\n\n🔗 ${domain}/r/${shortCode}`;
        }

        // --- Publish ---
        const result = await publishPost(account, { ...content, caption: finalCaption });

        if (result.success) {
          await updateSocialStatus(scheduleId, 'published', null, result.postId);
          console.log(`✅ Social Post Published: ${scheduleId} to ${account.platform}`);
        } else {
          throw new Error("Publishing function returned false");
        }

      } catch (err) {
        console.error(`❌ Social Post Failed ${scheduleId}:`, err.message);
        await updateSocialStatus(scheduleId, 'failed', err.message);
      }
    }
  } catch (err) {
    console.error('Social Scheduler Fatal Error:', err);
  }
}

/* =========================================
   HELPERS
   ========================================= */

async function updateSocialStatus(id, status, errorMessage = null, platformPostId = null) {
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

async function updateEmailStatus(id, status) {
  // You might want to save sent_count/failed_count here in the future
  await supabase
    .from('email_campaigns')
    .update({ status })
    .eq('id', id);
}

export const startScheduler = () => {
  console.log("⏰ Master Scheduler Started (Social + Email).");
  task.start();
};