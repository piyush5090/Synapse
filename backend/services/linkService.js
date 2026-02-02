import { nanoid } from 'nanoid';
import supabase from '../config/supabaseClient.js';

/**
 * 1. Short Link Create Karna
 * Original URL leta hai aur ek chota code return karta hai.
 */
export const createShortLink = async (originalUrl, scheduledPostId, userId, platform) => {
  // 8 character ka unique code (e.g., "xY1z2A3b")
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
  
  return shortCode; // Sirf code return karenge, poora URL controller banayega
};

/**
 * 2. Click Track Karna
 * Jab user link par click karega, tab yeh chalega.
 */
export const trackClick = async (shortCode, userAgent, referrer, ip) => {
  // A. Link Find karo
  const { data: link, error } = await supabase
    .from('tracked_links')
    .select('id, original_url, platform')
    .eq('short_code', shortCode)
    .single();

  if (error || !link) return null; // Link nahi mila

  // B. Platform Guess karo (Referrer URL se)
  let platform = link.platform;
  const ref = referrer ? referrer.toLowerCase() : '';

  // C. Async Log (User ko wait mat karao, background mein save karo)
  // Hum wait nahi kar rahe (no await) taaki redirect fast ho
  supabase.from('analytics_events').insert({
    link_id: link.id,
    user_agent: userAgent,
    ip_address: ip, // Privacy note: Hash karna better hota hai real app mein
    referrer: referrer,
    platform: platform
  }).then(({ error }) => {
      if (error) console.error("Analytics Log Error:", error);
  });

  return link.original_url;
};