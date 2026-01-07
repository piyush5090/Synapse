const express = require('express');
const router = express.Router();

const { generatePostContent, generateImage } = require('../services/aiService'); // AI functions
const { uploadImage } = require('../services/cloudinaryService'); // Cloudinary upload
const streamifier = require('streamifier'); // kept for compatibility (unused here)
const { protect } = require('../middleware/authMiddleware');

/**
 * POST /api/content/generate-ad
 * Protected endpoint: generates caption, hashtags and an image for a given user prompt.
 * NOTE: Logic preserved exactly — only formatting / small readability tweaks applied.
 */
router.post('/generate-ad', protect, async (req, res, next) => {
  const { userPrompt, businessDetails } = req.body;

  if (!userPrompt) {
    return res
      .status(400)
      .json({ status: 'Error', message: 'userPrompt is required in the request body.' });
  }

  console.log(`Received generation request with prompt: "${userPrompt}"`);

  try {
    // --- Step 1: Generate Text Content & Image Prompt (Gemini) ---
    console.log('Calling Gemini for text content...');
    const textContent = await generatePostContent(userPrompt, businessDetails);

    if (!textContent || !textContent.imagePrompt || !textContent.caption) {
      console.error('Failed to get valid content structure from Gemini.');
      throw new Error('Gemini failed to generate required content components.');
    }

    console.log('Received text content from Gemini.');
    console.log('Image Prompt for HF:', textContent.imagePrompt);

    // --- Step 2: Generate Image (Hugging Face) ---
    console.log('Calling Hugging Face for image generation...');
    const imageBuffer = await generateImage(textContent.imagePrompt);

    if (!imageBuffer) {
      console.error('Failed to generate image from Hugging Face.');
      throw new Error('AI failed to generate the image.');
    }

    console.log('Received image buffer from Hugging Face.');

    // --- Step 3: Upload Image to Cloudinary ---
    console.log('Uploading image buffer to Cloudinary...');
    const imageUrl = await uploadImage(imageBuffer);

    if (!imageUrl) {
      console.error('Failed to upload image to Cloudinary.');
      throw new Error('Failed to store the generated image.');
    }

    console.log('Image uploaded to Cloudinary:', imageUrl);

    // --- Step 4: Send Success Response ---
    const finalResult = {
      caption: textContent.caption,
      hashtags: textContent.hashtags,
      imageUrl, // already a string returned by uploadImage
    };

    return res.status(200).json({ status: 'Success', data: finalResult });
  } catch (error) {
    console.error('Error during content generation process:', error.message);
    // forward to centralized error handler if present
    return next(error);
    // If you don't have a central handler, uncomment next line instead of next(error):
    // return res.status(500).json({ status: 'Error', message: error.message || 'Content generation failed.' });
  }
});

module.exports = router;
