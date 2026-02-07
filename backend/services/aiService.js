// services/aiService.js
import dotenv from "dotenv";
dotenv.config();

// Note: Ensure you are using the correct package. 
// Standard is "@google/generative-ai", but if you are using the new "@google/genai" SDK, keep your import.
import { GoogleGenAI } from "@google/genai"; 

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let geminiClient = null;
let initialized = false;

export async function initGemini() {
  if (initialized) return;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error("❌ Missing GEMINI_API_KEY in .env");
    throw new Error("Missing GEMINI_API_KEY");
  }

  try {
    console.log("Initializing Gemini client...");
    geminiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    initialized = true;
    console.log("✅ Gemini initialized");
  } catch (err) {
    console.error("❌ Failed to initialize Gemini:", err);
    throw err;
  }
}

// --- SOCIAL MEDIA GENERATION ---
export async function generatePostContent(userPrompt, businessDetails = {}) {
  if (!geminiClient) {
    console.error("❌ Gemini client not initialized.");
    throw new Error("AI client not initialized");
  }

  const textPrompt = `
You are a creative social media strategist and AI prompt engineer.

Task:
Based on the user's idea below, generate:
1. A short, engaging caption (2–4 sentences, include emojis if appropriate).
2. A list of 5-10 relevant hashtags.
3. A detailed image prompt (5–6 sentences) describing a scene for an AI image generator.

Return your answer strictly in JSON format:
{
  "caption": "Your caption text here",
  "hashtags": ["#example", "#fun"],
  "imagePrompt": "A detailed description..."
}

User idea: "${userPrompt}"
Business details: ${JSON.stringify(businessDetails)}
`;

  try {
    const response = await geminiClient.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: textPrompt,
    });

    const rawText =
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!rawText) throw new Error("Empty response from Gemini");

    const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.caption || !parsed.hashtags || !parsed.imagePrompt) {
      throw new Error("Incomplete Gemini response");
    }

    return {
      user_prompt: userPrompt,
      caption: parsed.caption,
      hashtags: parsed.hashtags,
      image_prompt: parsed.imagePrompt,
    };
  } catch (err) {
    console.error("Generate Post Error:", err);
    throw err;
  }
}

// --- EMAIL MARKETING GENERATION (NEW) ---
export async function generateEmailContent(topic, tone = "professional", businessDetails = {}) {
  if (!geminiClient) {
    console.error("❌ Gemini client not initialized.");
    throw new Error("AI client not initialized");
  }

  const textPrompt = `
You are an expert Email Marketing Copywriter.

Task:
Write a high-conversion email based on the topic below.
Tone: ${tone}

Context:
Business Name: ${businessDetails.name || 'Our Company'}
Business Desc: ${businessDetails.description || ''}

Requirements:
1. Subject Line: Catchy, click-worthy, under 60 chars.
2. Content: The email body in valid HTML format.
   - Use <p>, <br>, <strong>, <ul>, <li> tags.
   - Do NOT use <html>, <head>, or <body> tags.
   - Use inline CSS for styling if needed.
   - Include a placeholder "[Name]" for the recipient's name.

Return strictly in JSON format:
{
  "subject": "Your Subject Line",
  "content": "<p>Hi [Name], ...</p>"
}

Topic: "${topic}"
`;

  try {
    const response = await geminiClient.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: textPrompt,
    });

    const rawText =
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!rawText) throw new Error("Empty response from Gemini");

    const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.subject || !parsed.content) {
      throw new Error("Incomplete Gemini response for Email");
    }

    return {
      subject: parsed.subject,
      content: parsed.content
    };
  } catch (err) {
    console.error("Generate Email Error:", err);
    throw err;
  }
}

// --- IMAGE GENERATION ---
export async function generateImage(imagePrompt) {
  if (!process.env.HF_API_TOKEN) throw new Error("Missing HF_API_TOKEN");
  if (!imagePrompt) throw new Error("imagePrompt is required");

  let InferenceClient;
  try {
    ({ InferenceClient } = await import("@huggingface/inference"));
  } catch (err) {
    console.error("Failed to import @huggingface/inference:", err);
    throw err;
  }

  const client = new InferenceClient(process.env.HF_API_TOKEN);
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Note: Depending on HF model, inputs might need to be just the string
      // or an object { inputs: string }. Adjust based on your specific HF model.
      const response = await client.textToImage({
        model: process.env.IMAGE_GEN_MODEL,
        inputs: imagePrompt, 
        parameters: { num_inference_steps: 50, guidance_scale: 7.5 },
      });

      // HF often returns a Blob or ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (err) {
      console.warn(`HF attempt ${attempt} failed: ${err.message}`);
      if (attempt < maxAttempts) await sleep(4000);
      else throw err;
    }
  }
  return null;
}

export async function listAvailableModels() {
  if (!geminiClient) throw new Error("AI client not initialized");
  const result = await geminiClient.models.list();
  // Adjust filter logic based on the specific SDK version response structure
  return result.models?.map((m) => m.name) || [];
}