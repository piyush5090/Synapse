const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient'); // Adjust path as needed
const { protect } = require('../middleware/authMiddleware');
        
// --- Business API Endpoints ---
        
// GET /api/business - Fetch business details (assuming only one for now)
router.get('/',protect, async (req, res) => {
    console.log('GET /api/business request received');
    try {
        // Fetch the first business found (simple approach for single business)
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .limit(1) // Get only one record
            .maybeSingle(); // Returns null instead of an error if no rows found
        
        if (error) throw error;
        
        if (data) {
            res.status(200).json({ status: 'OK', data: data });
        } else {
            res.status(404).json({ status: 'Not Found', message: 'No business profile found.' });
        }
    } catch (error) {
        console.error('Error fetching business:', error.message);
                res.status(500).json({ status: 'Error', message: 'Failed to fetch business profile.', error: error.message });
    }
});
        
// POST /api/business - Create a new business profile (or update if exists - simple approach)
router.post('/', protect, async (req, res) => {
    const { name, description, website_url } = req.body;
    console.log('POST /api/business request received with body:', req.body);
        
    if (!name) {
        return res.status(400).json({ status: 'Error', message: 'Business name is required.' });
    }
        
    try {
         // Simple approach: Upsert (insert or update if exists based on some criteria,
         // here we just insert, assuming only one business for simplicity)
         // A real app might check if one exists first or use upsert with a specific ID.
        
        const { data, error } = await supabase
            .from('businesses')
            .insert([
                { name: name, description: description, website_url: website_url }
            ])
            .select() // Return the inserted data
            .single(); // Expecting a single row inserted
        
        if (error) throw error;
        
        console.log('Business created/updated:', data);
        res.status(201).json({ status: 'Created', data: data }); // 201 Created status
        
    } catch (error) {
         // Handle potential duplicate name errors or other DB errors
        console.error('Error creating/updating business:', error.message);
         if (error.code === '23505') { // Postgres unique violation code
             res.status(409).json({ status: 'Conflict', message: 'A business profile might already exist.', error: error.message });
        } else {
            res.status(500).json({ status: 'Error', message: 'Failed to create/update business profile.', error: error.message });
        }
    }
});
        
// TODO: Add PUT (update) and DELETE endpoints later if needed for full CRUD
        
module.exports = router;
        
