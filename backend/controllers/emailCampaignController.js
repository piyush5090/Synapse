import supabase  from '../config/supabaseClient.js';

/* =========================================
   CREATE CAMPAIGN
   ========================================= */
export const createCampaign = async (req, res) => {
  try {
    // Frontend sends 'recipientIds', we need to resolve them to emails
    const { templateId, senderId, recipientIds, scheduledAt } = req.body;
    const userId = req.user.id;

    // 1. Validation
    if (!recipientIds || !Array.isArray(recipientIds) || recipientIds.length === 0) {
      return res.status(400).json({ error: "Campaign must have at least one recipient" });
    }
    if (recipientIds.length > 400) {
      return res.status(400).json({ error: "Max 400 recipients allowed per campaign." });
    }

    // 2. Resolve Recipient IDs to Email Strings
    const { data: recipientRows, error: recipError } = await supabase
      .from('recipient_emails')
      .select('email')
      .in('id', recipientIds)
      .eq('user_id', userId);

    if (recipError || !recipientRows || recipientRows.length === 0) {
      throw new Error("Failed to resolve recipient emails. Please check your selection.");
    }

    // Extract just the strings: ["a@b.com", "c@d.com"]
    const emailList = recipientRows.map(r => r.email);

    // 3. Create Campaign
    const { data, error } = await supabase
      .from('email_campaigns')
      .insert([{
        user_id: userId,
        template_id: templateId,    // Fixed column name (matches schema)
        sender_email_id: senderId,  // Fixed column name (matches schema)
        scheduled_at: scheduledAt,
        recipients: emailList,      // Storing actual emails now!
        status: 'pending'
      }])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, message: "Campaign scheduled", data: data[0] });

  } catch (error) {
    console.error("Create Campaign Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/* =========================================
   GET CAMPAIGNS (History)
   ========================================= */
export const getCampaigns = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Join with Templates (Removed 'name' as it doesn't exist in your schema)
    const { data, count, error } = await supabase
      .from('email_campaigns')
      .select(`
        *,
        email_templates ( subject ),
        sender_emails ( email )
      `, { count: 'exact' })
      .eq('user_id', userId)
      .order('scheduled_at', { ascending: true }) // Upcoming first
      .range(from, to);

    if (error) throw error;
    
    res.json({ success: true, data, count, page, limit });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Only allow deleting pending or failed campaigns
    const { error } = await supabase
      .from('email_campaigns')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};