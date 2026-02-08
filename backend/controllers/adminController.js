const supabase = require('../config/supabaseClient');

// --- USER MANAGEMENT ---

// 1. Get All Users (with Pagination)
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Fetch profiles (which mirrors users)
    const { data, count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) throw error;

    res.json({
      status: 'success',
      results: data.length,
      total_users: count,
      total_pages: Math.ceil(count / limit),
      current_page: page,
      data
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 2. Ban / Unban User
const toggleBanUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { banStatus } = req.body; // true = ban, false = unban

    if (typeof banStatus !== 'boolean') {
      return res.status(400).json({ status: 'error', message: 'banStatus must be boolean' });
    }

    // Prevent banning yourself
    if (userId === req.user.id) {
      return res.status(400).json({ status: 'error', message: 'You cannot ban yourself.' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ is_banned: banStatus })
      .eq('id', userId)
      .select();

    if (error) throw error;

    res.json({ 
      status: 'success', 
      message: banStatus ? `User ${userId} has been BANNED.` : `User ${userId} is now Active.`,
      data 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// --- CONTENT MANAGEMENT ---

// 3. Get All Generated Posts (Admin View)
const getAllGeneratedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Join with 'profiles' to show email of the creator
    // NOTE: 'user_id' in generated_posts must reference profiles.id for this to work
    const { data, count, error } = await supabase
      .from('generated_posts')
      .select('*, profiles(email, role, is_banned)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) throw error;

    res.json({
      status: 'success',
      total_posts: count,
      page,
      data
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 4. Get All Scheduled Posts
const getAllScheduledPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, count, error } = await supabase
      .from('scheduled_posts')
      .select('*, profiles(email, role, is_banned)', { count: 'exact' })
      .order('scheduled_at', { ascending: false }) // Show upcoming first
      .range(start, end);

    if (error) throw error;

    res.json({
      status: 'success',
      total_scheduled: count,
      page,
      data
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 5. Delete Any Post (Moderation)
const deleteContent = async (req, res) => {
  try {
    const { type, id } = req.params; // type = 'generated' or 'scheduled'
    let table = '';

    if (type === 'generated') table = 'generated_posts';
    else if (type === 'scheduled') table = 'scheduled_posts';
    else return res.status(400).json({ error: 'Invalid type' });

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ status: 'success', message: 'Content deleted by Admin.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getAllUsers,
  toggleBanUser,
  getAllGeneratedPosts,
  getAllScheduledPosts,
  deleteContent
};