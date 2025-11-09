/**
 * testLLM.js
 * 
 * Tests multiple free LLM APIs:
 * - Google Gemini (gemini-2.5-flash)
 * - OpenAI (gpt-5-search-api)
 * - Hugging Face (several free models)
 * 
 * Requirements:
 *   npm install dotenv openai @google/generative-ai node-fetch
 *   Add your API keys in a .env file:
 *     GEMINI_API_KEY=your_gemini_key
 *     OPENAI_API_KEY=your_openai_key
 *     HF_TOKEN=your_huggingface_token
 */

import dotenv from "dotenv";
import fetch from "node-fetch";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const HF_TOKEN = process.env.HF_TOKEN;

const prompt = "Explain quantum computing in one short paragraph.";

console.log("🚀 Starting LLM API Tests...\n");

/* -------------------- GEMINI TEST -------------------- */
async function testGemini() {
  console.log("🧠 Testing Gemini API (gemini-2.5-flash)...");
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    console.log("✅ Gemini output:\n", result.response.text(), "\n");
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message, "\n");
  }
}

/* -------------------- OPENAI TEST -------------------- */
async function testOpenAI() {
  console.log("🧠 Testing OpenAI API (gpt-5-search-api)...");
  try {
    const client = new OpenAI({ apiKey: OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: "gpt-5-search-api",
      messages: [{ role: "user", content: prompt }],
    });
    console.log("✅ OpenAI output:\n", completion.choices[0].message.content, "\n");
  } catch (error) {
    console.error("❌ OpenAI API Error:", error.message, "\n");
  }
}

/* -------------------- HUGGING FACE TEST -------------------- */
async function testHuggingFace() {
  console.log("🧠 Testing Hugging Face API (several models)...");

  const models = [
    "mistralai/Mistral-7B-Instruct-v0.3",
    "HuggingFaceH4/zephyr-7b-beta",
    "tiiuae/falcon-7b-instruct",
  ];

  for (const model of models) {
    const url = `https://api-inference.huggingface.co/models/${model}`;
    console.log(`\n🔹 Testing ${model}...`);
    try {
      const bodyData = JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 80, temperature: 0.8 },
        options: { wait_for_model: true },
      });

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: bodyData,
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`❌ HF API Error ${res.status}:`, errText, "\n");
        continue;
      }

      const data = await res.json();
      if (Array.isArray(data) && data[0]?.generated_text) {
        console.log("✅ HF output:\n", data[0].generated_text, "\n");
      } else {
        console.log("⚠️ HF response (raw):", JSON.stringify(data).slice(0, 300), "\n");
      }
    } catch (error) {
      console.error(`💥 HF Exception for ${model}:`, error.message, "\n");
    }
  }
}

/* -------------------- RUN TESTS -------------------- */
(async () => {
  await testGemini();
  await testOpenAI();
  await testHuggingFace();

  console.log("🏁 Tests complete.\n");
})();
