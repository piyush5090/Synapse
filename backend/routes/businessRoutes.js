import express from 'express';
import supabase from '../config/supabaseClient.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Get the authenticated user's business profile
// Endpoint: GET /api/business
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the business linked to this user
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId) 
      .maybeSingle();

    if (error) {
      console.error("Error fetching business:", error);
      return res.status(500).json({ error: error.message });
    }

    // If no business found, return null (frontend should show "Create Business" form)
    if (!data) {
      return res.json({ business: null });
    }

    return res.json({ business: data });
  } catch (err) {
    console.error("Server error in GET /api/business:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. Create or Update the authenticated user's business profile
// Endpoint: POST /api/business
router.post('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, website_url} = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Business name is required.' });
    }

    // Check if business already exists for this user
    const { data: existingBusiness } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

    let result;
    
    if (existingBusiness) {
        // Update existing
        const { data, error } = await supabase
            .from('businesses')
            .update({
                name,
                description,
                website_url,
                // store additional fields in a jsonb column if you have one, or add columns to schema
                // for now we stick to the schema you provided: name, description, website_url
            })
            .eq('user_id', userId)
            .select()
            .single();
            
         if (error) throw error;
         result = data;
    } else {
        // Insert new
        const { data, error } = await supabase
            .from('businesses')
            .insert({
                user_id: userId,
                name,
                description,
                website_url
            })
            .select()
            .single();

        if (error) throw error;
        result = data;
    }

    return res.json({ 
        message: existingBusiness ? 'Business updated' : 'Business created', 
        business: result 
    });

  } catch (err) {
    console.error("Error in POST /api/business:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;