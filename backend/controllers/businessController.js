import supabase from '../config/supabaseClient.js';

/**
 * GET /api/business
 * Get authenticated user's business
 */
export const getBusiness = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching business:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({ business: data || null });
  } catch (err) {
    console.error('Server error in getBusiness:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * POST /api/business
 * Create business
 */
export const createBusiness = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, website_url } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Business name is required.' });
    }

    const { data, error } = await supabase
      .from('businesses')
      .insert({
        user_id: userId,
        name,
        description,
        website_url,
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: 'Business created',
      business: data,
    });
  } catch (err) {
    console.error('Error in createBusiness:', err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /api/business
 * Edit / Update business
 */
export const updateBusiness = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, website_url } = req.body;

    const { data, error } = await supabase
      .from('businesses')
      .update({
        name,
        description,
        website_url,
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return res.json({
      message: 'Business updated',
      business: data,
    });
  } catch (err) {
    console.error('Error in updateBusiness:', err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /api/business
 * Delete business
 */
export const deleteBusiness = async (req, res) => {
  try {
    const userId = req.user.id;

    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    return res.json({ message: 'Business deleted successfully' });
  } catch (err) {
    console.error('Error in deleteBusiness:', err);
    return res.status(500).json({ error: err.message });
  }
};
