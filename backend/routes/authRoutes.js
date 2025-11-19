const express = require('express');
const router = express.Router();
const supabase = require("../config/supabaseClient");

// /api/auth/signup
router.post('/signup',async (req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({status: 'Error', message: "Email and Password are Required."});
    }

    try{
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if(error) throw error;

        // If email confirmation is enabled in Supabase (default), user won't be able to login immediately
        // You can disable "Confirm email" in Supabase Dashboard > Authentication > Providers > Email
        // for easier testing.
        
        console.log("User signed up: ", data.user);

        if(data.user){
            await supabase.from('businesses').insert([{
                // We can use the auth user's ID as a reference if we add a column for it later
                // For now, just creating a placeholder business
                name: "My New Business",
                description: "Default description"
            }]);
        }

        res.status(201).json({
            status: "Success",
            message: 'User created successfully! Please check your email to confirm',
            user: data.user
        });

    }catch(err){
        console.log('Signup Error:', err.message);
        res.status(400).json({status: 'Error', message: err.message});
    }
});

// /api/auth/login
router.post('/login', async (req,res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400).json({status: 'Error', message: "Email and Password are Requrired"});
    }

    try{
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if(error) throw error;

        console.log('User Logged in: ', data.user.email);

        // Return the Access Token (JWT) to the frontend
        res.status(200).json({
            status: "Sucess",
            message: 'Login successful.',
            token: data.session.access_token,
            user: data.user
        });

    }catch(err){
        console.error('Login Failed: ', err.message);
        res.status(401).json({status: "Error", message: "Invalid Email Id or Password."});
    }
});

// /api/auth/logout
router.post("/logout",async (req,res)=>{
    const { error } = await supabase.auth.signOut();
    
    if(error){
        return res.status(500).json({status: "Error", message: error.message});
    }
    return res.status(200).json({status: "Success", message: "Logged out successfully"});
});

module.exports = router;