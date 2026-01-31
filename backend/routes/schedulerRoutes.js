const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { protect } = require('../middleware/authMiddleware');

/**
 * POST /api/scheduler/create
 * Supports MULTIPLE social accounts
 */
router.post('/create', protect, async (req, res, next) => {
  const { generated_post_id, social_account_ids, scheduled_time } = req.body;
  const userId = req.user.id;

  try {
    // 1️⃣ Validation
    if (
      !generated_post_id ||
      !Array.isArray(social_account_ids) ||
      social_account_ids.length === 0 ||
      !scheduled_time
    ) {
      return res.status(400).json({
        status: 'Error',
        message:
          'Missing required fields: generated_post_id, social_account_ids[], scheduled_time.'
      });
    }

    const scheduleDate = new Date(scheduled_time);
    if (isNaN(scheduleDate.getTime()) || scheduleDate <= new Date()) {
      return res.status(400).json({
        status: 'Error',
        message: 'Invalid or past scheduled_time provided.'
      });
    }

    // 2️⃣ Authorize generated post
    const { data: generatedPost } = await supabase
      .from('generated_posts')
      .select('id')
      .eq('id', generated_post_id)
      .eq('user_id', userId)
      .single();

    if (!generatedPost) {
      return res.status(403).json({
        status: 'Error',
        message: 'Unauthorized or generated post not found.'
      });
    }

    // 3️⃣ Get user's business
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!business) {
      return res.status(403).json({
        status: 'Error',
        message: 'Business not found for user.'
      });
    }

    // 4️⃣ Authorize social accounts (bulk)
    const { data: accounts } = await supabase
      .from('social_accounts')
      .select('id')
      .in('id', social_account_ids)
      .eq('business_id', business.id);

    if (!accounts || accounts.length !== social_account_ids.length) {
      return res.status(403).json({
        status: 'Error',
        message: 'One or more social accounts are unauthorized.'
      });
    }

    // 5️⃣ Create ONE schedule PER account
    const rows = social_account_ids.map((accountId) => ({
      generated_post_id,
      social_account_id: accountId,
      scheduled_time,
      status: 'pending'
    }));

    const { data, error } = await supabase
      .from('scheduled_posts')
      .insert(rows)
      .select('id');

    if (error) {
      throw error;
    }

    return res.status(201).json({
      status: 'Success',
      message: `Scheduled ${data.length} posts successfully.`,
      scheduled_ids: data.map((r) => r.id)
    });

  } catch (error) {
    console.error('Scheduler create error:', error.message);
    return next(error);
  }
});

module.exports = router;
