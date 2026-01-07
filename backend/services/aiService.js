// services/aiService.js
// Minimal ESM version: async init + functions, uses console for logs

import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let aiClient = null;
let initialized = false;

export async function initAI() {
  if (initialized) return;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error("❌ Missing GEMINI_API_KEY in .env");
    throw new Error("Missing GEMINI_API_KEY");
  }

  try {
    console.log("Initializing Gemini client...");
    aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    initialized = true;
    console.log("✅ Gemini initialized");
  } catch (err) {
    console.error("❌ Failed to initialize Gemini:", err);
    throw err;
  }
}

export async function generatePostContent(userPrompt, businessDetails = {}) {
  if (!aiClient) {
    console.error("❌ Gemini client not initialized.");
    throw new Error("AI client not initialized");
  }

  const textPrompt = `
You are a creative social media strategist and AI prompt engineer.

Task:
Based on the user's idea below, generate:
1. A short, engaging caption (2–4 sentences, include emojis if appropriate).
2. A list of 5-10 relevant hashtags.
3. A detailed image prompt (5–6 sentences) describing a scene for an AI image generator, based on the idea and caption. The image prompt should mention style (e.g., photorealistic, digital illustration) and mood.

Return your answer strictly in JSON format with this structure:
{
  "caption": "Your caption text here",
  "hashtags": ["#example", "#fun", "#creative"],
  "imagePrompt": "A detailed description for image generation..."
}

User idea: "${userPrompt}"
Business details: ${JSON.stringify(businessDetails)}
`;

  try {
    const response = await aiClient.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: textPrompt,
    });

    const rawText =
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!rawText) {
      console.error("Gemini returned no text:", JSON.stringify(response));
      throw new Error("Empty response from Gemini");
    }

    const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse JSON from Gemini:", parseErr.message);
      console.error("Cleaned output:", cleaned.substring(0, 1000));
      throw parseErr;
    }

    if (!parsed.caption || !parsed.hashtags || !parsed.imagePrompt) {
      console.error("Gemini response missing fields:", parsed);
      throw new Error("Incomplete Gemini response");
    }

    return {
      user_prompt: userPrompt, // Include original prompt for the caller
      caption: parsed.caption,
      hashtags: parsed.hashtags,
      image_prompt: parsed.imagePrompt,
    };
  } catch (err) {
    throw err;
  }
}

export async function generateImage(imagePrompt) {
  if (!process.env.HF_API_TOKEN) {
    console.error("Missing HF_API_TOKEN in .env");
    throw new Error("Missing HF_API_TOKEN");
  }
  if (!imagePrompt) {
    throw new Error("imagePrompt is required");
  }

  let InferenceClient;
  try {
    ({ InferenceClient } = await import("@huggingface/inference"));
  } catch (err) {
    console.error("Failed to import @huggingface/inference:", err);
    throw err;
  }

  //Creating Image Generation model's client
  const client = new InferenceClient(process.env.HF_API_TOKEN);

  const maxAttempts = 3;
  const retryDelayMs = 4000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await client.textToImage({
        model: process.env.IMAGE_GEN_MODEL,
        provider: "hf-inference",
        inputs: imagePrompt,
        parameters: { num_inference_steps: 70, guidance_scale: 10 },
        options: { wait_for_model: true },
      });

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return buffer;
    } catch (err) {
      console.warn(`HF attempt ${attempt} failed: ${err.message || err}`);
      if (attempt < maxAttempts) {
        await sleep(retryDelayMs);
      } else {
        throw err;
      }
    }
  }
  // unreachable code
  return null;
}

export async function listAvailableModels() {
  if (!aiClient) throw new Error("AI client not initialized");
  const result = await aiClient.models.list();
  const models =
    result.models
      ?.filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
      .map((m) => m.name) || [];
  return models;
}