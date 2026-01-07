const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { protect } = require('../middleware/authMiddleware');

/**
 * POST /api/scheduler/create
 * Protected endpoint: Schedules a previously generated post to a social account.
 * Requires: generated_post_id, social_account_id, scheduled_time in req.body
 */
router.post('/create', protect, async (req, res, next) => {
  const { generated_post_id, social_account_id, scheduled_time } = req.body;
  const userId = req.user.id; // User ID from protect middleware

  try {
    // 1. Validate input
    if (!generated_post_id || !social_account_id || !scheduled_time) {
      return res.status(400).json({ status: 'Error', message: 'Missing required fields: generated_post_id, social_account_id, and scheduled_time.' });
    }

    const scheduleDate = new Date(scheduled_time);
    if (isNaN(scheduleDate.getTime()) || scheduleDate <= new Date()) {
      return res.status(400).json({ status: 'Error', message: 'Invalid or past scheduled_time provided.' });
    }

    // 2. Authorization Checks: Ensure generated_post and social_account belong to the user
    const { data: generatedPost, error: postError } = await supabase
      .from('generated_posts')
      .select('id')
      .eq('id', generated_post_id)
      .eq('user_id', userId)
      .single();

    if (postError || !generatedPost) {
      console.error('Authorization failed for generated_post_id:', postError);
      return res.status(403).json({ status: 'Error', message: 'Unauthorized or generated post not found.' });
    }

    const { data: socialAccount, error: accountError } = await supabase
      .from('social_accounts')
      .select('id')
      .eq('id', social_account_id)
      .eq('business_id', (await supabase.from('businesses').select('id').eq('user_id', userId).single()).data.id) // Assuming business_id for social account is tied to user's business
      .single();

    if (accountError || !socialAccount) {
      console.error('Authorization failed for social_account_id:', accountError);
      return res.status(403).json({ status: 'Error', message: 'Unauthorized or social account not found.' });
    }

    // 3. Insert into scheduled_posts
    const { data, error } = await supabase
      .from('scheduled_posts')
      .insert([
        {
          generated_post_id: generated_post_id,
          social_account_id: social_account_id,
          scheduled_time: scheduled_time,
          status: 'pending' // Default status
        },
      ])
      .select(); // Return the inserted data

    if (error) {
      console.error('Error inserting into scheduled_posts:', error);
      throw new Error('Database error when scheduling post.');
    }

    return res.status(201).json({ status: 'Success', message: 'Post scheduled successfully.', data: data[0] });

  } catch (error) {
    console.error('Error during scheduled post creation:', error.message);
    return next(error); // Pass error to central error handler
  }
});

module.exports = router;
