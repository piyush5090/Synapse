const supabase = require('../config/supabaseClient');

const protect = async (req, res, next) => {
    let token;

    // 1. Check if token exists in the Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract the token from the header (format: "Bearer token")
            token = req.headers.authorization.split(' ')[1];
            
            if (!token) {
                 return res.status(401).json({ status: 'Error', message: 'Not authorized, token missing.' });
            }

            // 2. Verify the token using Supabase
            // Note: Supabase's getSessionFromCookie() is used for browser cookies, 
            // but for a Bearer token, we use the global setAuth().
            
            const { data, error } = await supabase.auth.getUser(token);

            if (error) throw error;

            // 3. Attach the validated user object (UID) to the request object
            // This allows subsequent route handlers to know WHO the user is.
            req.user = data.user;
            
            // 4. Proceed to the next middleware or route handler
            next();

        } catch (error) {
            console.error('JWT verification failed:', error.message);
            // Common errors: Expired token, invalid signature
            res.status(401).json({ status: 'Error', message: 'Not authorized, invalid token or token expired.' });
        }
    } else {
        // No token found in header
        res.status(401).json({ status: 'Error', message: 'Not authorized, no token found in header.' });
    }
};

module.exports = { protect };