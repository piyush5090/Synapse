const supabase = require('../config/supabaseClient');

const protect = async (req, res, next) => {
    let token;

    // 1. Check if token exists in the Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract the token
            token = req.headers.authorization.split(' ')[1];
            
            if (!token) {
                 return res.status(401).json({ status: 'Error', message: 'Not authorized, token missing.' });
            }

            // 2. Verify the token using Supabase Auth
            const { data: { user }, error: authError } = await supabase.auth.getUser(token);

            if (authError || !user) {
                throw new Error('Invalid token');
            }

            // --- NEW SECTION: CHECK BAN STATUS ---
            
            // 3. Check public.profiles for ban status & role
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('is_banned, role')
                .eq('id', user.id)
                .single();

            // If profile doesn't exist yet (rare race condition), we typically allow it or error out.
            // Here we proceed but log a warning.
            if (profileError) {
                console.warn(`Profile missing for user ${user.id}`);
            }

            // 4. BLOCK BANNED USERS
            if (profile && profile.is_banned) {
                return res.status(403).json({ 
                    status: 'Forbidden', 
                    message: 'Account suspended. Please contact support.' 
                });
            }

            // 5. Attach user & role to request
            req.user = user;
            req.user.role = profile?.role || 'user'; // Attach role for future admin checks
            
            next();

        } catch (error) {
            console.error('Auth verification failed:', error.message);
            res.status(401).json({ status: 'Error', message: 'Not authorized, invalid token.' });
        }
    } else {
        res.status(401).json({ status: 'Error', message: 'Not authorized, no token found.' });
    }
};

const requireAdmin = (req, res, next) => {
  // We assume authMiddleware has already run and attached req.user
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      status: 'Forbidden', 
      message: 'Access denied. Admin privileges required.' 
    });
  }
};

module.exports = { requireAdmin, protect };