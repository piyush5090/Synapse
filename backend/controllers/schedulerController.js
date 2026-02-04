const supabase = require("../config/supabaseClient");

/**
 * POST /api/scheduler
 * Create schedule(s) for multiple social accounts
 */
exports.createSchedule = async (req, res, next) => {
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
        status: "Error",
        message:
          "Missing required fields: generated_post_id, social_account_ids[], scheduled_time.",
      });
    }

    const scheduleDate = new Date(scheduled_time);
    if (isNaN(scheduleDate.getTime()) || scheduleDate <= new Date()) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid or past scheduled_time provided.",
      });
    }

    // 2️⃣ Authorize generated post
    const { data: generatedPost } = await supabase
      .from("generated_posts")
      .select("id")
      .eq("id", generated_post_id)
      .eq("user_id", userId)
      .single();

    if (!generatedPost) {
      return res.status(403).json({
        status: "Error",
        message: "Unauthorized or generated post not found.",
      });
    }

    // 3️⃣ Get user's business
    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!business) {
      return res.status(403).json({
        status: "Error",
        message: "Business not found for user.",
      });
    }

    // 4️⃣ Authorize social accounts
    const { data: accounts } = await supabase
      .from("social_accounts")
      .select("id")
      .in("id", social_account_ids)
      .eq("business_id", business.id);

    if (!accounts || accounts.length !== social_account_ids.length) {
      return res.status(403).json({
        status: "Error",
        message: "One or more social accounts are unauthorized.",
      });
    }

    // 5️⃣ Create one schedule per account
    const rows = social_account_ids.map((accountId) => ({
      generated_post_id,
      social_account_id: accountId,
      scheduled_time,
      status: "pending",
    }));

    const { data, error } = await supabase
      .from("scheduled_posts")
      .insert(rows)
      .select("id");

    if (error) throw error;

    return res.status(201).json({
      status: "Success",
      message: `Scheduled ${data.length} posts successfully.`,
      scheduled_ids: data.map((r) => r.id),
    });
  } catch (error) {
    console.error("Create schedule error:", error.message);
    return next(error);
  }
};

/**
 * GET /api/scheduler?page=1&limit=5
 * Get paginated scheduled posts for logged-in user
 */
exports.getScheduledPosts = async (req, res, next) => {
  const userId = req.user.id;

  // Defaults
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    const { data, error, count } = await supabase
      .from("scheduled_posts")
      .select("*",{ count: "exact" })
      .in(
        "generated_post_id",
        supabase
          .from("generated_posts")
          .select("id")
          .eq("user_id", userId)
      )
      .order("scheduled_time", { ascending: true })
      .range(from, to);

    if (error) throw error;

    return res.json({
      status: "Success",
      data,
      pagination: {
        page,
        limit,
        total: count,
        hasMore: to + 1 < count,
      },
    });
  } catch (error) {
    console.error("Get scheduled posts error:", error.message);
    return next(error);
  }
};


/**
 * PUT /api/scheduler/:id
 * Edit ONLY scheduled_time
 */
exports.updateScheduleTime = async (req, res, next) => {
  const { id } = req.params;
  const { scheduled_time } = req.body;
  const userId = req.user.id;

  try {
    if (!scheduled_time) {
      return res.status(400).json({
        status: "Error",
        message: "scheduled_time is required.",
      });
    }

    const newDate = new Date(scheduled_time);
    if (isNaN(newDate.getTime()) || newDate <= new Date()) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid or past scheduled_time.",
      });
    }

    // Ensure ownership via generated_posts
    const { data, error } = await supabase
      .from("scheduled_posts")
      .update({ scheduled_time })
      .eq("id", id)
      .in(
        "generated_post_id",
        supabase
          .from("generated_posts")
          .select("id")
          .eq("user_id", userId)
      )
      .select()
      .single();

    if (error || !data) {
      return res.status(403).json({
        status: "Error",
        message: "Unauthorized or schedule not found.",
      });
    }

    return res.json({
      status: "Success",
      message: "Schedule time updated successfully.",
      data,
    });
  } catch (error) {
    console.error("Update schedule error:", error.message);
    return next(error);
  }
};

/**
 * DELETE /api/scheduler/:id
 * Delete schedule
 */
exports.deleteSchedule = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const { error } = await supabase
      .from("scheduled_posts")
      .delete()
      .eq("id", id)
      .in(
        "generated_post_id",
        supabase
          .from("generated_posts")
          .select("id")
          .eq("user_id", userId)
      );

    if (error) {
      return res.status(403).json({
        status: "Error",
        message: "Unauthorized or schedule not found.",
      });
    }

    return res.json({
      status: "Success",
      message: "Schedule deleted successfully.",
    });
  } catch (error) {
    console.error("Delete schedule error:", error.message);
    return next(error);
  }
};
