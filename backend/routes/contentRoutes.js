const express = require('express');
const router = express.Router();

const { generatePostContent, generateImage } = require('../services/aiService'); // AI functions
const { uploadImage } = require('../services/cloudinaryService'); // Cloudinary upload
const supabase = require('../config/supabaseClient'); // Supabase client
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
    // textContent now includes user_prompt and image_prompt due to aiService.js modification
    const textContent = await generatePostContent(userPrompt, businessDetails);

    if (!textContent || !textContent.image_prompt || !textContent.caption) {
      console.error('Failed to get valid content structure from Gemini.');
      throw new Error('Gemini failed to generate required content components.');
    }

    console.log('Received text content from Gemini.');
    console.log('Image Prompt for HF:', textContent.image_prompt);

    // --- Step 2: Generate Image (Hugging Face) ---
    console.log('Calling Hugging Face for image generation...');
    const imageBuffer = await generateImage(textContent.image_prompt);

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
      user_prompt: textContent.user_prompt, // Include original user prompt
      caption: textContent.caption,
      hashtags: textContent.hashtags,
      image_prompt: textContent.image_prompt, // Include generated image prompt
      image_url: imageUrl, // Use the correct key
    };

    return res.status(200).json({ status: 'Success', data: finalResult });
  } catch (error) {
    console.error('Error during content generation process:', error.message);
    // forward to centralized error handler if present
    return next(error);
  }
});

/**
 * POST /api/content/save-generated-post
 * Protected endpoint: saves previously generated content to the database.
 */
router.post('/save-generated-post', protect, async (req, res, next) => {
  const { user_prompt, caption, hashtags, image_prompt, image_url } = req.body;
  const userId = req.user.id; // Assuming userId is available from protect middleware

  // Basic validation
  if (!user_prompt || !caption || !hashtags || !image_prompt || !image_url || !userId) {
    return res.status(400).json({ status: 'Error', message: 'Missing required fields to save the post.' });
  }

  try {
    const { data, error } = await supabase
      .from('generated_posts')
      .insert([
        {
          user_id: userId,
          user_prompt: user_prompt,
          caption: caption,
          hashtags: hashtags,
          image_prompt: image_prompt,
          image_url: image_url,
        },
      ])
      .select(); // .select() to return the inserted data

    if (error) {
      console.error('Error saving generated post:', error);
      throw new Error('Database error when saving post.');
    }

    return res.status(201).json({ status: 'Success', message: 'Post saved successfully.', data: data[0] });
  } catch (error) {
    console.error('Error during saving generated post process:', error.message);
    return next(error);
  }
});

module.exports = router;
