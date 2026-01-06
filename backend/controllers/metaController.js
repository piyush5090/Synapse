import axios from "axios";
import supabase from "../config/supabaseClient.js";

export const connectMetaAccounts = async (req, res) => {
  try {
    const { business_id, system_token } = req.body;

    // Fetch all Facebook pages
    const fbPagesResp = await axios.get(
      `https://graph.facebook.com/v21.0/me/accounts?access_token=${system_token}`
    );

    const pages = fbPagesResp.data.data;

    if (!pages || pages.length === 0) {
      return res.status(400).json({ error: "No pages found for this system token." });
    }

    const results = [];

    for (const page of pages) {
      const {
        id: page_id,
        name: page_name,
        access_token: page_token
      } = page;

      // Insert base row (FB only)
      const { data: inserted, error: insertError } = await supabase
        .from("meta_accounts")
        .insert({
          business_id,
          system_token,
          facebook_page_id: page_id,
          facebook_page_username: page_name,
          page_access_token: page_token,
          meta: page
        })
        .select()
        .single();

      if (insertError) {
        console.log(insertError);
        continue;
      }

      const row_id = inserted.id;

      // Fetch Instagram Business ID from Page
      let instagram_business_account_id = null;
      try {
        const igResp = await axios.get(
          `https://graph.facebook.com/v21.0/${page_id}?fields=instagram_business_account&access_token=${page_token}`
        );
        instagram_business_account_id = igResp.data?.instagram_business_account?.id ?? null;
      } catch {}

      // Fetch IG username if IG account exists
      let ig_username = null;
      if (instagram_business_account_id) {
        try {
          const igUserResp = await axios.get(
            `https://graph.facebook.com/v21.0/${instagram_business_account_id}?fields=username&access_token=${page_token}`
          );
          ig_username = igUserResp.data?.username ?? null;
        } catch {}
      }

      // Update DB row with IG details
      await supabase
        .from("meta_accounts")
        .update({
          instagram_business_account_id,
          instagram_username: ig_username,
        })
        .eq("id", row_id);

      results.push({
        facebook_page_id: page_id,
        facebook_page_username: page_name,
        instagram_business_account_id,
        instagram_username: ig_username,
      });
    }

    return res.json({ status: "ok", accounts: results });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
