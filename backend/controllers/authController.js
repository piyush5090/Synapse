import supabase from "../config/supabaseClient.js";

/**
 * POST /api/auth/signup
 */
export const signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "Error", message: "Email and Password are required." });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    console.log("User signed up:", data.user);

    // Optional: create placeholder business
    if (data.user) {
      await supabase.from("businesses").insert({
        name: "My New Business",
        description: "Default description",
        user_id: data.user.id, // ✅ good practice
      });
    }

    return res.status(201).json({
      status: "Success",
      message: "User created successfully! Please check your email to confirm.",
      user: data.user,
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    return res
      .status(400)
      .json({ status: "Error", message: err.message });
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "Error", message: "Email and Password are required." });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    console.log("User logged in:", data.user.email);

    return res.status(200).json({
      status: "Success",
      message: "Login successful.",
      token: data.session.access_token,
      user: data.user,
    });
  } catch (err) {
    console.error("Login Failed:", err.message);
    return res
      .status(401)
      .json({ status: "Error", message: "Invalid email or password." });
  }
};

/**
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return res.status(200).json({
      status: "Success",
      message: "Logged out successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "Error", message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    // 1. req.user is already verified by the 'protect' middleware
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Not authorized' });

    // 2. Fetch Public Profile (Role, Ban Status)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
        console.warn("Profile fetch error:", profileError.message);
    }

    // 3. Fetch Business Details
    const { data: business } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // 4. Fetch Social Accounts
    const { data: socialAccounts } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', user.id);

    // 5. Return Consolidated Object
    // This structure matches exactly what your userSlice.js -> loginSuccess expects
    res.status(200).json({
      id: user.id,
      email: user.email,
      role: profile?.role || 'user',         // Critical for Admin Check
      is_banned: profile?.is_banned || false,
      business: business || null,
      social_accounts: socialAccounts || []
    });

  } catch (err) {
    console.error("GetMe Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
