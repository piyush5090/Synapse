import supabase from '../config/supabaseClient.js'; // Ensure correct named import
import { encryptPassword } from '../utils/encryption.js';

/* =========================================
   SENDER EMAILS (SMTP)
   ========================================= */

export const addSenderEmail = async (req, res) => {
  try {
    const { email, passkey, provider } = req.body;
    const userId = req.user.id;

    const encryptedPass = encryptPassword(passkey);

    const { data, error } = await supabase
      .from('sender_emails')
      .insert([{ 
        user_id: userId, 
        email, 
        passkey: encryptedPass, 
        provider: provider || 'gmail' 
      }])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSenderEmails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('sender_emails')
      .select('id, email, provider, created_at') // Exclude passkey for security
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteSenderEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { error } = await supabase
      .from('sender_emails')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


/* =========================================
   RECIPIENTS (CONTACTS) - WITH PAGINATION
   ========================================= */

export const addRecipients = async (req, res) => {
  try {
    const { emails } = req.body; 
    const userId = req.user.id;

    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: "No emails provided" });
    }

    // Prepare rows
    const rows = emails.map(email => ({ 
      user_id: userId, 
      email: email.trim().toLowerCase() 
    }));

    // Upsert (Ignore duplicates if email already exists for this user)
    const { data, error } = await supabase
      .from('recipient_emails')
      .upsert(rows, { onConflict: 'user_id, email', ignoreDuplicates: true })
      .select();

    if (error) throw error;
    
    // Return count of actually added/affected rows
    res.status(201).json({ 
      success: true, 
      count: data ? data.length : 0, 
      message: "Contacts added" 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getRecipients = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 1. Get Pagination Params (Default: Page 1, Limit 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // 2. Calculate Supabase Range (0-based index)
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 3. Query with Range and Count
    const { data, count, error } = await supabase
      .from('recipient_emails')
      .select('*', { count: 'exact' }) // 'exact' returns total row count
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to); // <--- Pagination Magic

    if (error) throw error;

    // 4. Return Data + Metadata
    res.json({ 
      success: true, 
      data, 
      count, // Total available in DB (e.g., 145)
      page,
      limit
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteRecipient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const { error } = await supabase
      .from('recipient_emails')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};