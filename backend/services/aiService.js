// ===============================================
// AI Service - Gemini (Caption + Hashtags + ImagePrompt)
//              + Hugging Face (Image Generation)
// ===============================================

// Load environment variables
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const fetch = require('node-fetch'); // npm install node-fetch

// --- Helper Function ---
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Initialize Google Gemini ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("❌ Error: Missing GEMINI_API_KEY in .env file.");
}

let ai;//Initializing a new Gemini Client
try {
  ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  console.log("✅ Google Gemini client initialized successfully.");
} catch (error) {
  console.error("❌ Failed to initialize Google Gemini client:", error);
}

/**
 * Generates post content (caption, hashtags, imagePrompt) using Gemini in JSON format.
 * @param {string} userPrompt - The initial prompt from the user.
 * @param {object} [businessDetails={}] - Optional business info.
 * @returns {Promise<object|null>} Object with caption, hashtags, and imagePrompt.
 */
async function generatePostContent(userPrompt, businessDetails = {}) {
  if (!ai) {
    console.error("❌ Gemini AI client not initialized.");
    return null;
  }

  try {
    console.log("🧠 Generating all content (caption, hashtags, image prompt) in one Gemini call...");

    const textPrompt = `
You are a creative social media strategist and AI prompt engineer.

Task:
Based on the user's idea below, generate:
1. A short, engaging caption (2–4 sentences, include emojis if appropriate).
2. A list of 5-10 relevant hashtags.
3. A detailed image prompt (5–6 sentences) describing a scene for an AI image generator, based on the idea and caption. The image prompt should mention style (e.g., photorealistic, digital illustration) and mood.

Return your answer **strictly in JSON format** with this structure:
{
  "caption": "Your caption text here",
  "hashtags": ["#example", "#fun", "#creative"],
  "imagePrompt": "A detailed description for image generation..."
}

User idea: "${userPrompt}"
Business details: ${JSON.stringify(businessDetails)}
`;

    // --- Gemini Call ---
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: textPrompt,
    });

    // ✅ Handle both possible response shapes
    const rawText =
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!rawText) {
      console.error("❌ Gemini did not return any text output:", JSON.stringify(response, null, 2));
      return null;
    }

    console.log("🧾 Raw Gemini Response (JSON expected):", rawText);

    // --- Clean and Parse JSON ---
    const cleaned = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch (err) {
      console.error("⚠️ Failed to parse JSON from Gemini:", err.message);
      console.error("Raw cleaned text:", cleaned);
      return null;
    }

    // --- Validate Fields ---
    if (!result.caption || !result.hashtags || !result.imagePrompt) {
      console.error("❌ Missing required fields in Gemini response:", result);
      return null;
    }

    console.log("✅ Successfully generated structured content:", result);
    return result;

  } catch (error) {
    console.error("❌ Error during Gemini content generation:", error);
    return null;
  }
}

// ===============================================
// --- Hugging Face Configuration ---
// ===============================================

const HF_API_TOKEN = process.env.HF_API_TOKEN;
const HF_IMAGE_URL = process.env.HF_IMAGE_URL;

if (!HF_API_TOKEN) {
  console.error("⚠️ Missing HF_API_TOKEN in .env file.");
} else {
  console.log("✅ Hugging Face configuration loaded.");
}

/**
 * Generates an image using Hugging Face Inference API.
 * @param {string} imagePrompt - The detailed prompt for image generation.
 * @returns {Promise<Buffer|null>} Image buffer or null.
 */
async function generateImage(imagePrompt) {
  if (!process.env.HF_API_TOKEN) {
    console.error("❌ Missing HF_API_TOKEN in .env file.");
    return null;
  }
  if (!imagePrompt) {
    console.error("❌ Image prompt cannot be empty.");
    return null;
  }

  console.log(`🖼️ Sending image prompt to Hugging Face: "${imagePrompt.substring(0, 80)}..."`);

  // Import dynamically (since @huggingface/inference is ESM-only)
  let InferenceClient;
  try {
    ({ InferenceClient } = await import("@huggingface/inference"));
  } catch (err) {
    console.error("❌ Failed to import @huggingface/inference. Did you run `npm install @huggingface/inference`?", err);
    return null;
  }

  // ✅ Correct property name: accessToken (NOT apiKey)
  const client = new InferenceClient(process.env.HF_API_TOKEN);

  const maxAttempts = 3;
  const retryDelayMs = 4000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await client.textToImage({
        model: process.env.IMAGE_GEN_MODEL,
        provider: "hf-inference",
        inputs: imagePrompt,
        parameters: {
          num_inference_steps: 25,
          guidance_scale: 7.5,
        },
        options: { wait_for_model: true },
      });

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      console.log(`✅ Hugging Face returned an image (attempt ${attempt}).`);
      return buffer;

    } catch (err) {
      console.warn(`⚠️ Hugging Face image generation attempt ${attempt} failed: ${err.message}`);
      if (attempt < maxAttempts) {
        console.log(`⏳ Retrying in ${retryDelayMs / 1000}s...`);
        await new Promise(r => setTimeout(r, retryDelayMs));
      } else {
        console.error("❌ All attempts to generate image failed.");
        return null;
      }
    }
  }

  return null;
}


/**
 * Lists available Gemini models.
 */
async function listAvailableModels() {
  if (!ai) {
    console.error("❌ Gemini client not initialized.");
    return null;
  }
  console.log("📜 Listing available Gemini models...");
  try {
    const result = await ai.models.list();
    console.log("Raw model list:", result);
    const models = result.models
      ?.filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .map(m => m.name);
    console.log("✅ Available models:", models);
    return models;
  } catch (error) {
    console.error("❌ Error listing Gemini models:", error);
    return null;
  }
}

// --- Exports ---
module.exports = {
  generatePostContent,
  generateImage,
  listAvailableModels
};
