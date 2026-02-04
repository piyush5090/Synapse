const supabase = require("../config/supabaseClient");
const { generatePostContent, generateImage } = require("../services/aiService");
const { uploadImage } = require("../services/cloudinaryService");

/**
 * POST /api/content/generate-ad
 * Generate AI caption + hashtags + image
 */
exports.generateAd = async (req, res, next) => {
  const { userPrompt, businessDetails } = req.body;

  if (!userPrompt) {
    return res
      .status(400)
      .json({ status: "Error", message: "userPrompt is required." });
  }

  try {
    // 1. Generate text content
    const textContent = await generatePostContent(
      userPrompt,
      businessDetails
    );

    if (
      !textContent ||
      !textContent.image_prompt ||
      !textContent.caption
    ) {
      throw new Error("AI failed to generate required content.");
    }

    // 2. Generate image
    const imageBuffer = await generateImage(textContent.image_prompt);
    if (!imageBuffer) throw new Error("Image generation failed.");

    // 3. Upload image
    const imageUrl = await uploadImage(imageBuffer);
    if (!imageUrl) throw new Error("Image upload failed.");

    return res.status(200).json({
      status: "Success",
      data: {
        user_prompt: textContent.user_prompt,
        caption: textContent.caption,
        hashtags: textContent.hashtags,
        image_prompt: textContent.image_prompt,
        image_url: imageUrl,
      },
    });
  } catch (error) {
    console.error("Generate Ad Error:", error.message);
    return next(error);
  }
};

/**
 * POST /api/content
 * Save AI generated post
 */
exports.createPost = async (req, res, next) => {
  const { user_prompt, caption, hashtags, image_prompt, image_url } = req.body;
  const userId = req.user.id;

  if (
    !user_prompt ||
    !caption ||
    !hashtags ||
    !image_prompt ||
    !image_url
  ) {
    return res
      .status(400)
      .json({ status: "Error", message: "Missing required fields." });
  }

  try {
    const { data, error } = await supabase
      .from("generated_posts")
      .insert([
        {
          user_id: userId,
          user_prompt,
          caption,
          hashtags,
          image_prompt,
          image_url,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      status: "Success",
      message: "Post saved successfully.",
      data,
    });
  } catch (error) {
    console.error("Create Post Error:", error.message);
    return next(error);
  }
};

/**
 * GET /api/content?page=1&limit=5
 * Paginated posts for logged-in user
 */
exports.getPosts = async (req, res, next) => {
  const userId = req.user.id;

  // Defaults
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    const { data, error, count } = await supabase
      .from("generated_posts")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
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
    console.error("Get Posts Error:", error.message);
    return next(error);
  }
};

/**
 * GET /api/content/:id
 * Get single post
 */
exports.getPostById = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from("generated_posts")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    return res.json({ status: "Success", data });
  } catch (error) {
    console.error("Get Post Error:", error.message);
    return next(error);
  }
};

/**
 * PUT /api/content/:id
 * Update saved post
 */
exports.updatePost = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const updates = req.body;

  try {
    const { data, error } = await supabase
      .from("generated_posts")
      .update(updates)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    return res.json({
      status: "Success",
      message: "Post updated successfully.",
      data,
    });
  } catch (error) {
    console.error("Update Post Error:", error.message);
    return next(error);
  }
};

/**
 * DELETE /api/content/:id
 * Delete Single post
 */
exports.deletePost = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const { error } = await supabase
      .from("generated_posts")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;

    return res.json({
      status: "Success",
      message: "Post deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Post Error:", error.message);
    return next(error);
  }
};


/**
 * POST /api/content/manual
 * Manually upload post (no AI)
 */
exports.createManualPost = async (req, res, next) => {
  const { caption, hashtags } = req.body;
  const userId = req.user.id;
  const imageFile = req.file;

  if (!caption || !hashtags || !imageFile) {
    return res.status(400).json({
      status: "Error",
      message: "Caption, hashtags and image are required.",
    });
  }

  try {
    // Upload image buffer to Cloudinary
    const imageUrl = await uploadImage(imageFile.buffer);

    if (!imageUrl) {
      throw new Error("Failed to upload image to Cloudinary.");
    }

    // Save to DB
    const { data, error } = await supabase
      .from("generated_posts")
      .insert([
        {
          user_id: userId,
          user_prompt: "manual",
          caption,
          hashtags,
          image_prompt: null,
          image_url: imageUrl,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      status: "Success",
      message: "Post uploaded manually.",
      data,
    });
  } catch (error) {
    console.error("Manual Post Error:", error.message);
    return next(error);
  }
};
