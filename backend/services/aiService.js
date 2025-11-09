// Load environment variables
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetch = require('node-fetch'); // Make sure node-fetch is installed (npm install node-fetch)

// --- Initialize Google Gemini ---
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    console.error("Error: Missing GEMINI_API_KEY in .env file.");
}

// Add this near the top of aiService.js
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let genAI;
let textModel;
try {
    genAI = new GoogleGenerativeAI(geminiApiKey);
    // Use the model confirmed to work (or the one you intend to use)
    textModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // <<-- Make sure this is the model you want to use (e.g., gemini-flash)
    console.log(`Google Gemini client initialized with model: ${textModel.model}`);
} catch (error) {
    console.error("Failed to initialize Google Gemini client:", error);
}


/**
 * Generates post content (caption, hashtags, image prompt) using Gemini.
 * @param {string} userPrompt - The initial prompt from the user.
 * @param {object} [businessDetails={}] - Optional details about the business (name, description).
 * @returns {Promise<object|null>} Object containing caption, hashtags, imagePrompt, or null if error.
 */
async function generatePostContent(userPrompt, businessDetails = {}) {
    if (!textModel) {
        console.error("Gemini text model not initialized.");
        return null;
    }

    let caption = "";
    let hashtags = [];
    let imagePrompt = "";

    // --- CALL 1: Get Caption and Hashtags ---
    try {
        console.log("Sending prompt for Caption/Hashtags...");
        const textPrompt = `
            You are a social media expert.
            User idea: "${userPrompt}"
            Business: ${businessDetails.name || 'Not provided'}
            
            Write an engaging 2-4 sentence caption with emojis.
            Then, on a *brand new line*, write *exactly* this marker:
            HASHTAGS:
            Followed by a list of 5 relevant hashtags (e.g., #tag1 #tag2 #tag3).
        `;

        const result = await textModel.generateContent(textPrompt);
        const rawTextResponse = result.response.text();
        
        console.log("Raw Gemini Response (Call 1):", rawTextResponse);

        const marker = "\nHASHTAGS:";
        // Find the marker (case-insensitive, just in case)
        const markerIndex = rawTextResponse.toUpperCase().indexOf(marker);

        if (markerIndex === -1) {
            console.error("Gemini response did not contain HASHTAGS: marker.");
            // Fallback: Use the whole text as caption, generate dummy hashtags
            caption = rawTextResponse.trim();
            hashtags = ["#generated"]; // Provide a fallback
        } else {
            // Everything before the marker is the caption
            caption = rawTextResponse.substring(0, markerIndex).trim();
            // Everything after the marker is the hashtag string
            const hashtagString = rawTextResponse.substring(markerIndex + marker.length).trim();
            // Split hashtags by space, comma, or newline and filter for valid tags
            hashtags = hashtagString.split(/[\s,]+/).filter(h => h.startsWith("#"));
        }
        
        console.log("Successfully parsed caption and hashtags.");

    } catch (error) {
        console.error("Error in Gemini Call 1 (Caption/Hashtags):", error);
        // We still get the 404 error here because the model name is wrong.
        // We MUST fix the model name first.
        // Let's assume the error is the model name for now.
        return null; // Stop if first call fails
    }

    // --- ADDED DELAY as requested ---
    console.log("Waiting 7 seconds before next Gemini call...");
    await sleep(7000); // Wait for 7 seconds (6-7 sec range)
    // --- END DELAY ---

    // --- CALL 2: Get Image Prompt ---
    try {
        console.log("Sending prompt for Image Prompt...");
        const imagePromptPrompt = `
            You are an expert prompt engineer for AI image generators.
            Base your prompt on this user idea: "${userPrompt}"
            And this caption: "${caption}"
            
            Write a detailed, descriptive prompt (about 2-3 sentences) for an AI image generator (like Stable Diffusion).
            Describe the scene, objects, style (e.g., photorealistic, illustration), mood.
            Crucially, include any text that should be visibly written on the image, enclosed in single quotes like 'Your Text Here'.
            
            Respond *only* with the prompt. Do not add any other text like "Here is the prompt:".
        `;

        const result = await textModel.generateContent(imagePromptPrompt);
        imagePrompt = result.response.text().trim();
        
        // Basic cleanup for any stray quotes
        imagePrompt = imagePrompt.replace(/^"|"$/g, ''); 

        console.log("Successfully generated image prompt.");

    } catch (error) {
        console.error("Error in Gemini Call 2 (Image Prompt):", error);
        return null; // Stop if second call fails
    }

    // --- Final Check and Return ---
    if (caption && hashtags.length > 0 && imagePrompt) {
        console.log("Successfully generated all post content.");
        
        const finalResult = {
            caption: caption,
            hashtags: hashtags,
            imagePrompt: imagePrompt
        };

        // --- Log the final object to the console ---
        console.log(finalResult);
        console.log(JSON.stringify(finalResult, null, 2)); // Pretty-print the object
        console.log("---------------------------------");
        
        return finalResult; // Return the final object
    } else {
        console.error("Failed to generate all required components.");
        return null;
    }
}


// --- Hugging Face Configuration ---
const hfApiToken = process.env.HF_API_TOKEN;
const hfImageUrl = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3-medium-diffusers";

if (!hfApiToken) {
    console.error("Error: Missing HF_API_TOKEN in .env file.");
} else {
    console.log("Hugging Face configuration loaded.");
}
// --- End Hugging Face Configuration ---


/**
 * Generates an image using the Hugging Face Inference API.
 * @param {string} imagePrompt - The detailed prompt for image generation.
 * @returns {Promise<Buffer|null>} A Buffer containing the image data, or null if error.
 */
async function generateImage(imagePrompt) {
    if (!hfApiToken) {
        console.error("Hugging Face API token not configured.");
        return null;
    }
    if (!imagePrompt) {
        console.error("Image prompt cannot be empty.");
        return null;
    }

    console.log(`Sending prompt to Hugging Face: "${imagePrompt.substring(0, 50)}..."`);

    try {
        const response = await fetch(hfImageUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${hfApiToken}`,
                'Content-Type': 'application/json',
                'Accept': 'image/png' // Request image directly
            },
            body: JSON.stringify({
                inputs: imagePrompt,
                options: {
                    wait_for_model: true, // Ask API to wait if model is loading
                    use_cache: false      // Don't reuse results for identical prompts
                }
            }),
            // Add a timeout (e.g., 90 seconds) as HF can sometimes be slow
            // signal: AbortSignal.timeout(90000) // Requires Node 16+ or polyfill
        });

        if (!response.ok) {
            let errorBody = await response.text();
            try { errorBody = JSON.parse(errorBody); } catch (e) { /* Ignore */ }
            console.error(`Hugging Face API error: ${response.status} ${response.statusText}`, errorBody);
            // Specific check for model loading error
             if (response.status === 503 && errorBody && typeof errorBody.estimated_time === 'number') {
                 console.warn(`Hugging Face model is loading, estimated time: ${errorBody.estimated_time.toFixed(1)}s. Consider retrying.`);
                 // You could implement a retry mechanism here if desired
             }
            throw new Error(`Hugging Face API responded with status ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.startsWith('image/')) {
            let errorBody = await response.text();
            try { errorBody = JSON.parse(errorBody); } catch (e) {}
            console.error("Hugging Face API did not return an image. Content-Type:", contentType, "Body:", errorBody);
            throw new Error("Hugging Face API did not return image data.");
        }

        const imageBuffer = await response.buffer();
        console.log("Successfully received image buffer from Hugging Face.");
        return imageBuffer;

    } catch (error) {
        console.error("Error calling Hugging Face API:", error.message);
        return null;
    }
}


/**
 * Lists the models available to the current API key.
 */
async function listAvailableModels() {
    if (!genAI) {
        console.error("Gemini client not initialized.");
        return null;
    }
    console.log("Attempting to list available Gemini models...");
    try {
        const result = await genAI.listModels();
        console.log("Raw listModels result:", JSON.stringify(result, null, 2));

        const availableModels = result.models
            .filter(m => m.supportedGenerationMethods.includes('generateContent'))
            .map(m => m.name);

        console.log("Successfully listed models.");
        return availableModels;

    } catch (error) {
        console.error("Error listing Gemini models:", error);
        return null;
    }
}


// --- Export all functions ---
module.exports = {
    generatePostContent,
    generateImage,
    listAvailableModels
};