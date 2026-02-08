import fetch from "node-fetch";
import { decryptPassword } from "../utils/encryption.js";

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

  // 🔐 Decrypt API key (instead of email password)
  let apiKey;
  try {
    apiKey = decryptPassword(sender.passkey);
  } catch (e) {
    throw new Error("API key decryption failed.");
  }

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

  console.log(
    `✉️ Sending "${template.subject}" to ${recipients.length} people via Resend (${sender.email})...`
  );

  for (const recipientEmail of recipients) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: sender.email, // must be verified in Resend
          to: recipientEmail,
          subject: template.subject,
          html: finalHtml,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      successCount++;
    } catch (error) {
      console.error(`Failed to send to ${recipientEmail}:`, error.message);
      failCount++;
    }

    await sleep(500); // keep your rate-limit
  }

  return { successCount, failCount };
};
