const supabase = require("../config/supabaseClient");

/**
 * GET /api/analytics/platform-performance
 * Returns: { facebook: { '2026-02-06': 12 }, instagram: { '2026-02-06': 5 } }
 */
exports.getPlatformPerformance = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from("analytics_events")
      .select(`
        platform,
        created_at,
        tracked_links!inner ( user_id )
      `)
      .eq("tracked_links.user_id", userId);

    if (error) throw error;

    // Process Data
    const platformStats = {};

    for (const row of data) {
      const platform = row.platform || "unknown";
      const date = row.created_at.split("T")[0]; // YYYY-MM-DD

      if (!platformStats[platform]) platformStats[platform] = {};
      if (!platformStats[platform][date]) platformStats[platform][date] = 0;

      platformStats[platform][date]++;
    }

    return res.json({
      status: "Success",
      data: platformStats,
    });
  } catch (error) {
    console.error("Platform performance error:", error.message);
    return next(error);
  }
};

/**
 * GET /api/analytics/top-posts?limit=5
 * Returns posts ranked by count of rows in analytics_events
 */
exports.getTopPerformingPosts = async (req, res, next) => {
  const userId = req.user.id;
  const limit = parseInt(req.query.limit, 10) || 5;

  try {
    // 1. Get all events for this user
    const { data, error } = await supabase
      .from("analytics_events")
      .select(`
        link_id,
        tracked_links!inner (
          id,
          short_code,
          user_id,
          created_at,
          scheduled_posts (
             posted_at,
             social_accounts ( platform ),
             generated_posts ( caption, image_url )
          )
        )
      `)
      .eq("tracked_links.user_id", userId);

    if (error) throw error;

    // 2. Aggregate manually (Supabase doesn't support easy COUNT GROUP BY in JS client yet)
    const clickMap = {};

    for (const row of data) {
        const linkId = row.link_id;
        if (!clickMap[linkId]) {
            const link = row.tracked_links;
            clickMap[linkId] = {
                link_id: linkId,
                clicks: 0,
                short_code: link.short_code,
                platform: link.scheduled_posts?.social_accounts?.platform || 'Unknown',
                caption: link.scheduled_posts?.generated_posts?.caption,
                image_url: link.scheduled_posts?.generated_posts?.image_url,
                published_at: link.scheduled_posts?.posted_at,
                created_at: link.created_at,
            };
        }
        clickMap[linkId].clicks++;
    }

    // 3. Sort and Limit
    const rankedPosts = Object.values(clickMap)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);

    return res.json({
      status: "Success",
      data: rankedPosts,
    });
  } catch (error) {
    console.error("Top posts error:", error.message);
    return next(error);
  }
};