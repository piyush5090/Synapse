import { nanoid } from 'nanoid';
import supabase from '../config/supabaseClient.js';

/**
 * 1. Create Short Link (Idempotent)
 * Checks if a link already exists for this schedule to prevent duplicates.
 */
export const createShortLink = async (originalUrl, scheduledPostId, userId, platform) => {
  
  // A. First, check if a link already exists for this schedule
  const { data: existingLink } = await supabase
    .from('tracked_links')
    .select('short_code')
    .eq('scheduled_post_id', scheduledPostId)
    .single();

  if (existingLink) {
    console.log(`ℹ️ Link already exists for schedule ${scheduledPostId}, reusing.`);
    return existingLink.short_code;
  }

  // B. If not, create a new one
  const shortCode = nanoid(8); 
  
  const { data, error } = await supabase
    .from('tracked_links')
    .insert({
      original_url: originalUrl,
      short_code: shortCode,
      scheduled_post_id: scheduledPostId,
      user_id: userId,
      platform: platform,
    })
    .select()
    .single();

  if (error) {
    console.error("Link Creation Error:", error);
    throw new Error("Failed to create tracking link");
  }
  
  return shortCode;
};

/**
 * 2. Track Click (Smart Filter)
 * - Checks Bot User-Agent
 * - Checks if Post is actually PUBLISHED
 */
export const trackClick = async (shortCode, userAgent) => {
  // A. Find Link AND the Schedule Status
  const { data: link, error } = await supabase
    .from('tracked_links')
    .select(`
      id, 
      original_url, 
      platform,
      scheduled_posts ( status ) 
    `)
    .eq('short_code', shortCode)
    .single();

  if (error || !link) return null;

  // --- B. Status Check (The Fix) ---
  // If the post failed or is still processing, DO NOT count the click.
  // We still redirect (return url) so debugging works, but we don't log it.
  const postStatus = link.scheduled_posts?.status;
  
  if (postStatus !== 'published') {
    console.log(`⚠️ Link accessed, but post status is '${postStatus}'. Skipping analytics.`);
    return link.original_url;
  }

  // --- C. Bot Detection Logic ---
  const lowerUA = userAgent.toLowerCase();
  const isBot = [
    'facebookexternalhit', 'twitterbot', 'linkedinbot', 'pinterest', 'slackbot', 
    'whatsapp', 'telegrambot', 'discordbot', 'googlebot', 'bingbot', 'applebot'
  ].some(botName => lowerUA.includes(botName));

  if (isBot) {
    console.log(`🤖 Bot detected (${userAgent}). Skipping analytics.`);
    return link.original_url;
  }

  // --- D. Real User & Published Post: Log Event ---
  
  // Log to Analytics Table
  supabase
    .from('analytics_events')
    .insert({
        link_id: link.id,
        platform: link.platform || 'unknown'
    })
    .then(({ error }) => {
        if (error) console.error("Analytics Log Error:", error);
    });

  return link.original_url;
};