const supabase = require("../config/supabaseClient");

/**
 * GET /api/analytics/platform-performance
 * High-level comparison: Facebook vs Instagram traffic over time
 */
exports.getPlatformPerformance = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from("analytics_events")
      .select(`
        platform,
        created_at,
        tracked_links (
          user_id
        )
      `)
      .eq("tracked_links.user_id", userId);

    if (error) throw error;

    /**
     * Result shape:
     * {
     *   facebook: { '2026-02-01': 10, '2026-02-02': 15 },
     *   instagram: { '2026-02-01': 5, '2026-02-02': 20 }
     * }
     */
    const platformStats = {};

    for (const row of data) {
      const platform = row.platform || "unknown";
      const date = row.created_at.split("T")[0]; // YYYY-MM-DD

      if (!platformStats[platform]) {
        platformStats[platform] = {};
      }

      if (!platformStats[platform][date]) {
        platformStats[platform][date] = 0;
      }

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
 * Ranked list of posts/links driving most traffic
 */
exports.getTopPerformingPosts = async (req, res, next) => {
  const userId = req.user.id;
  const limit = parseInt(req.query.limit, 10) || 5;

  try {
    const { data, error } = await supabase
      .from("analytics_events")
      .select(`
        tracked_links (
          id,
          short_code,
          original_url,
          scheduled_post_id,
          user_id,
          scheduled_posts (
            generated_posts (
              caption,
              image_url
            )
          )
        )
      `)
      .eq("tracked_links.user_id", userId);

    if (error) throw error;

    /**
     * Aggregate clicks per tracked link
     */
    const clickMap = {};

    for (const row of data) {
      const link = row.tracked_links;
      if (!link) continue;

      if (!clickMap[link.id]) {
        clickMap[link.id] = {
          link_id: link.id,
          short_code: link.short_code,
          original_url: link.original_url,
          scheduled_post_id: link.scheduled_post_id,
          caption: link.scheduled_posts?.generated_posts?.caption || null,
          image_url: link.scheduled_posts?.generated_posts?.image_url || null,
          clicks: 0,
        };
      }

      clickMap[link.id].clicks++;
    }

    const rankedPosts = Object.values(clickMap)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);

    return res.json({
      status: "Success",
      data: rankedPosts,
    });
  } catch (error) {
    console.error("Top performing posts error:", error.message);
    return next(error);
  }
};
