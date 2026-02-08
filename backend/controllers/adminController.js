const supabase = require('../config/supabaseClient');

// ==========================================
//              USER MANAGEMENT
// ==========================================

// 1. Get All Users
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) throw error;

    res.json({ status: 'success', total_users: count, page, data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 2. Ban / Unban User
const toggleBanUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { banStatus } = req.body; 

    if (userId === req.user.id) {
      return res.status(400).json({ status: 'error', message: 'You cannot ban yourself.' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ is_banned: banStatus })
      .eq('id', userId)
      .select();

    if (error) throw error;
    res.json({ status: 'success', message: 'User status updated', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 3. Delete User
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (userId === req.user.id) {
      return res.status(400).json({ status: 'error', message: 'You cannot delete yourself.' });
    }

    // Deleting from profiles triggers cascade to other tables
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    res.json({ status: 'success', message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


// ==========================================
//           CONTENT MANAGEMENT
// ==========================================

// 4. Get Generated Posts (Social)
const getAllGeneratedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Join with profiles to get email
    const { data, count, error } = await supabase
      .from('generated_posts')
      .select('*, profiles(id, email, role, is_banned)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) throw error;

    res.json({ status: 'success', total: count, page, data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 5. Get Email Templates (Mails)
const getAllEmailTemplates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Join with profiles to get email
    const { data, count, error } = await supabase
      .from('email_templates')
      .select('*, profiles(id, email, role, is_banned)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) throw error;

    res.json({ status: 'success', total: count, page, data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 6. Generic Delete Content (Handles both tables)
const deleteContent = async (req, res) => {
  try {
    const { type, id } = req.params; 
    let table = '';

    if (type === 'social') table = 'generated_posts';
    else if (type === 'mail') table = 'email_templates';
    else return res.status(400).json({ error: 'Invalid content type' });

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ status: 'success', message: 'Content deleted.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getAllUsers,
  toggleBanUser,
  deleteUser,
  getAllGeneratedPosts,
  getAllEmailTemplates,
  deleteContent
};