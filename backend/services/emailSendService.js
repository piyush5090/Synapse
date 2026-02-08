import nodemailer from 'nodemailer';
import { decryptPassword } from '../utils/encryption.js';

// Helper: Sleep function for rate limiting
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const executeEmailCampaign = async (campaign) => {
  const sender = campaign.sender_emails;
  const template = campaign.email_templates;
  const recipients = campaign.recipients; 

  if (!sender || !template || !recipients || recipients.length === 0) {
    console.error(`❌ Campaign ${campaign.id} missing data.`);
    throw new Error("Invalid campaign data structure.");
  }

  let realPassword;
  try {
    realPassword = decryptPassword(sender.passkey);
  } catch (e) {
    throw new Error("Password decryption failed.");
  }

  // 👇 CHANGED SECTION: Explicit Configuration
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    //secure: true,           // Must be true for port 465
    auth: {
      user: sender.email,
      pass: realPassword,
    },
    // // Network Settings
    // family: 4,              // ⚠️ FORCE IPv4 (Fixes ENETUNREACH)
    // connectionTimeout: 10000, // Fail fast if connection hangs
  });

  // Verify Credentials
  //await transporter.verify(); 

  // --- PREPARE HTML CONTENT ---
  let finalHtml = template.content;

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
    finalHtml = `${imageHtml}${finalHtml}`;
  }

  let successCount = 0;
  let failCount = 0;

  console.log(`✉️ Sending "${template.subject}" to ${recipients.length} people via ${sender.email}...`);

  for (const recipientEmail of recipients) {
    try {
      await transporter.sendMail({
        from: `"${sender.email}" <${sender.email}>`,
        to: recipientEmail,
        subject: template.subject,
        html: finalHtml, 
      });
      
      successCount++;
    } catch (error) {
      console.error(`Failed to send to ${recipientEmail}:`, error.message);
      failCount++;
    }

    await sleep(500);
  }

  return { successCount, failCount };
};