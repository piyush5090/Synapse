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

// ... keep trackClick as is ...
export const trackClick = async (shortCode) => {
  // ... existing code ...
  const { data: link, error } = await supabase
    .from('tracked_links')
    .select('id, original_url, platform')
    .eq('short_code', shortCode)
    .single();

  if (error || !link) return null;

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