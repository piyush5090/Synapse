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
    // Return a structured error to save in the database logs later
    throw new Error(error.response?.data?.error?.message || "Failed to post to Facebook");
  }
};

/**
 * Publishes content to an Instagram Business Account.
 * Process: 
 * 1. Create Media Container (uploaded image + caption)
 * 2. Publish the Container
 */
export const postToInstagram = async (igUserId, accessToken, caption, imageUrl) => {
  try {
    // Step 1: Create Media Container
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

    // Step 2: Publish Media
    const publishUrl = `https://graph.facebook.com/v21.0/${igUserId}/media_publish`;
    const publishResponse = await axios.post(publishUrl, {
      creation_id: creationId,
      access_token: accessToken
    });

    console.log(`✅ Posted to Instagram ${igUserId}: ${publishResponse.data.id}`);
    return { success: true, postId: publishResponse.data.id, platform: 'instagram' };
  } catch (error) {
    console.error("❌ Instagram Posting Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || "Failed to post to Instagram");
  }
};

/**
 * Universal Router: Automatically detects platform and sends the post.
 * * @param {object} socialAccount - From 'social_accounts' table: { platform, account_id, access_token }
 * @param {object} postData - From 'generated_posts' table: { caption, image_url }
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