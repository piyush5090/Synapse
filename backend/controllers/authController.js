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
