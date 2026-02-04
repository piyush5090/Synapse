import axios from "axios";
import supabase from "../config/supabaseClient.js";


// Connet Meta Accounts Controller
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

      // Insert base row (FB only) into meta_accounts
      const { data: insertedMetaAccount, error: insertMetaError } = await supabase
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

      if (insertMetaError) {
        console.error("Error inserting into meta_accounts:", insertMetaError);
        continue;
      }

      const row_id = insertedMetaAccount.id;

      // Upsert Facebook Page into social_accounts
      const { data: upsertedFbSocialAccount, error: upsertFbSocialError } = await supabase
        .from("social_accounts")
        .upsert(
          {
            business_id,
            platform: "facebook",
            account_name: page_name,
            account_id: page_id,
            access_token: page_token,
            meta: page,
          },
          { onConflict: "business_id,platform" }
        )
        .select()
        .single();

      if (upsertFbSocialError) {
        console.error("Error upserting Facebook social account:", upsertFbSocialError);
      }

      // Fetch Instagram Business ID from Page
      let instagram_business_account_id = null;
      try {
        const igResp = await axios.get(
          `https://graph.facebook.com/v21.0/${page_id}?fields=instagram_business_account&access_token=${page_token}`
        );
        instagram_business_account_id = igResp.data?.instagram_business_account?.id ?? null;
      } catch (igError) {
        console.warn(`Could not fetch Instagram Business Account for page ${page_id}:`, igError.message);
      }

      // Fetch IG username if IG account exists
      let ig_username = null;
      if (instagram_business_account_id) {
        try {
          const igUserResp = await axios.get(
            `https://graph.facebook.com/v21.0/${instagram_business_account_id}?fields=username&access_token=${page_token}`
          );
          ig_username = igUserResp.data?.username ?? null;
        } catch (igUserError) {
          console.warn(`Could not fetch Instagram username for ID ${instagram_business_account_id}:`, igUserError.message);
        }

        // Upsert Instagram Business Account into social_accounts
        const { data: upsertedIgSocialAccount, error: upsertIgSocialError } = await supabase
          .from("social_accounts")
          .upsert(
            {
              business_id,
              platform: "instagram",
              account_name: ig_username,
              account_id: instagram_business_account_id,
              access_token: page_token, 
              meta: { instagram_business_account_id, instagram_username: ig_username },
            },
            { onConflict: "business_id,platform" }
          )
          .select()
          .single();

        if (upsertIgSocialError) {
          console.error("Error upserting Instagram social account:", upsertIgSocialError);
        }
      }

      // Update meta_accounts row with IG details
      const { error: updateMetaError } = await supabase
        .from("meta_accounts")
        .update({
          instagram_business_account_id,
          instagram_username: ig_username,
        })
        .eq("id", row_id);

      if (updateMetaError) {
        console.error("Error updating meta_accounts with IG details:", updateMetaError);
      }

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


// Controller Get already saved Meta Accounts where business_id matches 
export const getMetaAccounts = async (req, res) => {
  try {
    const { businessId } = req.params;

    const { data, error } = await supabase
      .from("meta_accounts")
      .select("*")
      .eq("business_id", businessId);

    if (error) {
      console.error("Error fetching meta accounts:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      accounts: data || [],
    });
  } catch (err) {
    console.error("Error in getMetaAccounts:", err);
    return res.status(500).json({ error: err.message });
  }
};


// Controller to Delete the already save Meta Accounts where business_id matches
export const deleteMetaAccounts = async (req, res) => {
  try {
    const { businessId } = req.params;

    // Delete from social_accounts
    const { error: socialError } = await supabase
      .from("social_accounts")
      .delete()
      .eq("business_id", businessId);

    if (socialError) throw socialError;

    // Delete from meta_accounts
    const { error: metaError } = await supabase
      .from("meta_accounts")
      .delete()
      .eq("business_id", businessId);

    if (metaError) throw metaError;

    return res.json({
      message: "Meta accounts disconnected successfully",
    });
  } catch (err) {
    console.error("Error in deleteMetaAccounts:", err);
    return res.status(500).json({ error: err.message });
  }
};
