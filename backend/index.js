// Load environment variables from .env file
require('dotenv').config(); 
const supabase = require('./config/supabaseClient');
require('./services/aiService');     // This will run the Gemini setup code and logs
require('./services/cloudinaryService'); // This will run the Cloudinary setup code and logs
const businessRoutes = require('./routes/businessRoutes'); // Import the router
const contentRoutes = require('./routes/contentRoutes');
        
// Import necessary packages
const express = require('express');
const cors = require('cors');
        
// Initialize the Express app
const app = express();
        
// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow app to parse JSON request bodies
        

// --- Mount API Routers ---
app.use('/api/business', businessRoutes); // Use it for paths starting with /api/business
app.use('/api/content', contentRoutes);

// Keep the test-db route for now if you like, or remove it
// app.get('/test-db', async (req, res) => { ... });


// --- Define API Routes ---
        
// Simple health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Synapse backend is running!' });
});
        
// --- Start the Server ---
        
// Get port from environment variables or default to 3001
// We use 3001 to avoid conflict with React's default 3000
const PORT = process.env.PORT || 3001; 
        
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

app.get('/test-db', async (req, res) => {
  try {
    // ... Supabase query logic ...
    const { data, error } = await supabase
      .from('businesses') 
      .select('id')
      .limit(1);

    if (error) {
      throw error; 
    }
    // ... success response ...
  } catch (error) {
    // ... error response ...
  }
});