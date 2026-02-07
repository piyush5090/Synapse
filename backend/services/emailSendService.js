import nodemailer from 'nodemailer';
import { decryptPassword } from '../utils/encryption.js';

// Helper: Sleep function for rate limiting
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Executes a single email campaign.
 * Handles decryption, transporter setup, and sending loop.
 * @param {Object} campaign - The campaign object from Supabase (with joined tables)
 * @returns {Promise<Object>} - Returns stats { successCount, failCount }
 */
export const executeEmailCampaign = async (campaign) => {
  // Destructure joined data
  // Note: Supabase joins return objects like 'sender_emails': { email: ... }
  const sender = campaign.sender_emails;
  const template = campaign.email_templates;
  const recipients = campaign.recipients; // Now this is ["a@b.com", ...]

  // 1. Validate Data
  if (!sender || !template || !recipients || recipients.length === 0) {
    console.error(`❌ Campaign ${campaign.id} missing data.`);
    throw new Error("Invalid campaign data structure.");
  }

  // 2. Decrypt Password
  let realPassword;
  try {
    realPassword = decryptPassword(sender.passkey);
  } catch (e) {
    throw new Error("Password decryption failed. Check encryption key.");
  }

  // 3. Setup Transporter
  const transporter = nodemailer.createTransport({
    service: sender.provider || 'gmail',
    auth: {
      user: sender.email,
      pass: realPassword,
    },
  });

  // Verify Credentials Once
  await transporter.verify(); 

  // --- 4. PREPARE HTML CONTENT (The Fix) ---
  let finalHtml = template.content;

  // If there is an image, inject it at the top of the email
  if (template.image_url) {
    const imageHtml = `
      <div style="width: 100%; max-width: 600px; margin: 0 auto 20px auto;">
        <img 
          src="${template.image_url}" 
          alt="Header Image" 
          style="width: 100%; height: auto; border-radius: 8px; display: block;" 
        />
      </div>
    `;
    // Prepend image to the content
    finalHtml = `${imageHtml}${finalHtml}`;
  }

  let successCount = 0;
  let failCount = 0;

  console.log(`✉️ Sending "${template.subject}" to ${recipients.length} people via ${sender.email}...`);

  // 5. Send Loop
  for (const recipientEmail of recipients) {
    try {
      await transporter.sendMail({
        from: `"${sender.email}" <${sender.email}>`,
        to: recipientEmail,
        subject: template.subject,
        html: finalHtml, // ✅ Sends Image + Text now
      });
      
      successCount++;
    } catch (error) {
      console.error(`Failed to send to ${recipientEmail}:`, error.message);
      failCount++;
    }

    // Rate Limit: 500ms sleep
    await sleep(500);
  }

  return { successCount, failCount };
};