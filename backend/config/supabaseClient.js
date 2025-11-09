// Import the Supabase client library
const { createClient } = require('@supabase/supabase-js');
        
// Load Supabase URL and Service Key from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
        
// Check if the environment variables are loaded correctly
if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase URL or Service Key in .env file.');
    // Optionally exit the process if critical credentials are missing
    // process.exit(1); 
}
        
// Create and export the Supabase client instance
// We use the service key here for backend operations, bypassing Row Level Security (RLS)
// Ensure RLS is properly configured in Supabase for any public-facing access if needed later.
const supabase = createClient(supabaseUrl, supabaseKey);
        
console.log('Supabase client initialized.'); // Log initialization
module.exports = supabase;