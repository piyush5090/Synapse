// controllers/emailTemplateController.js
import supabase from '../config/supabaseClient.js';
import { generateEmailContent, generateImage } from '../services/aiService.js';
import { uploadImage } from '../services/cloudinaryService.js';

/* =========================================
   1. AI GENERATION (Text & Image)
   ========================================= */

export const generateAiTemplate = async (req, res) => {
  try {
    const { topic, tone, businessDetails } = req.body;
    // Generate Subject + HTML Content
    const result = await generateEmailContent(topic, tone, businessDetails);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const generateEmailImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) return res.status(400).json({ error: "Image prompt is required" });

    // 1. Generate Image Buffer (AI)
    const enhancedPrompt = `cinematic email newsletter header image, ${prompt}, high quality, professional lighting, wide shot, 16:9 aspect ratio`;
    const imageBuffer = await generateImage(enhancedPrompt);

    if (!imageBuffer) throw new Error("Failed to generate image from AI");

    // 2. Upload to Cloudinary
    const imageUrl = await uploadImage(imageBuffer, "synapse_email_banners");

    res.json({ success: true, imageUrl });

  } catch (error) {
    console.error("Email Image Gen Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


/* =========================================
   2. MANUAL UPLOAD (From System)
   ========================================= */

export const uploadEmailImage = async (req, res) => {
  try {
    const file = req.file; // From Multer middleware

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // 1. Upload Buffer directly to Cloudinary
    const imageUrl = await uploadImage(file.buffer, "synapse_manual_uploads");

    res.json({ success: true, imageUrl });

  } catch (error) {
    console.error("Manual Upload Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


/* =========================================
   3. TEMPLATE CRUD (Database Only)
   ========================================= */

export const createTemplate = async (req, res) => {
  try {
    // Note: We ignore 'name' from body since DB doesn't have it
    const { subject, text_content, image_url } = req.body;
    const userId = req.user.id;

    if (!subject || !text_content) {
      return res.status(400).json({ error: "Subject and Content are required" });
    }

    // Insert into DB
    const { data, error } = await supabase
      .from('email_templates')
      .insert([{ 
        user_id: userId, 
        subject, 
        content: text_content, // <--- MAPPING FIX: Frontend sends 'text_content', DB gets 'content'
        image_url: image_url || null 
      }])
      .select();

    if (error) {
      console.error("Supabase Insert Error:", error);
      throw error;
    }

    res.status(201).json({ success: true, data: data[0] });

  } catch (error) {
    console.error("Create Template Server Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, text_content } = req.body;
    const userId = req.user.id;

    if (!subject && !text_content) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    const { data, error } = await supabase
      .from('email_templates')
      .update({ 
        subject, 
        content: text_content // <--- MAPPING FIX
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (error) throw error;
    res.json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTemplates = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};