import axios from 'axios';

/**
 * Publishes content to a Facebook Page.
 * Endpoint: POST /{page-id}/photos
 */
export const postToFacebook = async (pageId, accessToken, message, imageUrl) => {
  try {
    const url = `https://graph.facebook.com/v21.0/${pageId}/photos`;
    
    const response = await axios.post(url, {
      url: imageUrl,
      caption: message,
      access_token: accessToken,
      published: true
    });

    console.log(`✅ Posted to Facebook Page ${pageId}: ${response.data.id}`);
    return { success: true, postId: response.data.id, platform: 'facebook' };
  } catch (error) {
    console.error("❌ Facebook Posting Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || "Failed to post to Facebook");
  }
};

/**
 * Publishes content to an Instagram Business Account.
 * Process: 
 * 1. Create Media Container
 * 2. WAIT for Container Status = FINISHED (Crucial Step!)
 * 3. Publish the Container
 */
export const postToInstagram = async (igUserId, accessToken, caption, imageUrl) => {
  try {
    // --- Step 1: Create Media Container ---
    const containerUrl = `https://graph.facebook.com/v21.0/${igUserId}/media`;
    const containerResponse = await axios.post(containerUrl, {
      image_url: imageUrl,
      caption: caption,
      access_token: accessToken
    });

    const creationId = containerResponse.data.id;
    if (!creationId) {
        throw new Error("Failed to create Instagram media container.");
    }

    console.log(`[IG] Container created (${creationId}). Waiting for processing...`);

    // --- Step 2: The Fix - POLL for Status ---
    let isReady = false;
    let attempt = 0;
    const maxRetries = 10; // Try for 30 seconds (10 * 3s)

    while (!isReady && attempt < maxRetries) {
      attempt++;
      
      // Wait 3 seconds before checking status
      await new Promise(resolve => setTimeout(resolve, 3000));

      const statusUrl = `https://graph.facebook.com/v21.0/${creationId}`;
      const statusRes = await axios.get(statusUrl, {
        params: {
          fields: 'status_code,status', // Ask for specific fields
          access_token: accessToken
        }
      });

      const statusCode = statusRes.data.status_code; // 'FINISHED', 'IN_PROGRESS', or 'ERROR'
      console.log(`[IG] Attempt ${attempt}/${maxRetries} - Status: ${statusCode}`);

      if (statusCode === 'FINISHED') {
        isReady = true;
      } else if (statusCode === 'ERROR') {
        throw new Error(`Instagram Processing Failed: ${JSON.stringify(statusRes.data)}`);
      }
      // If 'IN_PROGRESS', the loop continues automatically
    }

    if (!isReady) {
      throw new Error("Instagram processing timed out. Image might be too large or format unsupported.");
    }

    // --- Step 3: Publish Media ---
    console.log(`[IG] Processing complete. Publishing now...`);
    const publishUrl = `https://graph.facebook.com/v21.0/${igUserId}/media_publish`;
    const publishResponse = await axios.post(publishUrl, {
      creation_id: creationId,
      access_token: accessToken
    });

    console.log(`✅ Posted to Instagram ${igUserId}: ${publishResponse.data.id}`);
    return { success: true, postId: publishResponse.data.id, platform: 'instagram' };

  } catch (error) {
    console.error("❌ Instagram Posting Error:", error.response?.data || error.message);
    const apiMsg = error.response?.data?.error?.message;
    throw new Error(apiMsg || error.message || "Failed to post to Instagram");
  }
};

/**
 * Universal Router
 */
export const publishPost = async (socialAccount, postData) => {
    const { platform, account_id, access_token } = socialAccount;
    const { caption, image_url } = postData;

    if (!platform || !account_id || !access_token) {
        throw new Error("Invalid social account data provided.");
    }

    if (platform === 'facebook') {
        return await postToFacebook(account_id, access_token, caption, image_url);
    } else if (platform === 'instagram') {
        return await postToInstagram(account_id, access_token, caption, image_url);
    } else {
        throw new Error(`Unsupported platform: ${platform}`);
    }
};