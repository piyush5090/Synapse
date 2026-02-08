import Brevo from '@getbrevo/brevo';
import { decryptPassword } from '../utils/encryption.js';

// Helper: Sleep function for rate limiting
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const executeEmailCampaign = async (campaign) => {
  const sender = campaign.sender_emails; // This contains your Brevo API Key now
  const template = campaign.email_templates;
  const recipients = campaign.recipients;

  if (!sender || !template || !recipients || recipients.length === 0) {
    throw new Error("Invalid campaign data structure.");
  }

  // 1. Decrypt the API Key
  // NOTE: In your frontend "Add Sender" modal, paste the Brevo API Key (xkeysib-...) 
  // into the "App Password" field.
  let apiKey;
  try {
    apiKey = decryptPassword(sender.passkey);
  } catch (e) {
    throw new Error("API Key decryption failed.");
  }

  // 2. Configure Brevo Client
  const apiInstance = new Brevo.TransactionalEmailsApi();
  const apiKeyAuth = apiInstance.authentications['apiKey'];
  apiKeyAuth.apiKey = apiKey;

  // 3. Prepare Content
  let finalHtml = template.content;
  if (template.image_url) {
    const imageHtml = `
      <div style="width: 100%; max-width: 600px; margin: 0 auto 20px auto;">
        <img src="${template.image_url}" alt="Header" style="width: 100%; border-radius: 8px; display: block;" />
      </div>`;
    finalHtml = `${imageHtml}${finalHtml}`;
  }

  let successCount = 0;
  let failCount = 0;

  console.log(`🚀 Sending via Brevo HTTP API to ${recipients.length} recipients...`);

  // 4. Send Loop
  for (const recipientEmail of recipients) {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    // Sender: Must be the email you verified in Brevo dashboard
    sendSmtpEmail.sender = { email: sender.email }; 
    sendSmtpEmail.to = [{ email: recipientEmail }];
    sendSmtpEmail.subject = template.subject;
    sendSmtpEmail.htmlContent = finalHtml;

    try {
      await apiInstance.sendTransacEmail(sendSmtpEmail);
      successCount++;
    } catch (error) {
      console.error(`❌ Brevo Error for ${recipientEmail}:`, error.body || error.message);
      failCount++;
    }

    // Rate Limit: Sleep 200ms to be safe
    await sleep(200);
  }

  return { successCount, failCount };
};