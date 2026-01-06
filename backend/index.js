// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Core packages
import express from "express";
import cors from "cors";

// Services (executed on import)
//import "./services/aiService.js";
import { initAI } from "./services/aiService.js";
import { initCloudinary } from "./services/cloudinaryService.js";

// Supabase client
import supabase from "./config/supabaseClient.js";

// Routes
import businessRoutes from "./routes/businessRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import metaRoutes from "./routes/meta_routes.js";
//import * as metaHelper from "../utils/metaHelper.js";

// Initialize the Express app
const app = express();

async function startServer() {
  try {
    // initialize services before starting the server
    await initAI();
    initCloudinary();
    console.log("All services initialized.");
  } catch (err) {
    console.error("Service initialization failed. Exiting.", err);
    process.exit(1);
  }
}
        
// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow app to parse JSON request bodies
        

// --- Mount API Routers ---
app.use('/api/business', businessRoutes); // Use it for paths starting with /api/business
app.use('/api/content', contentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/meta',metaRoutes);
        
// Simple Backend check route
app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Synapse backend is running!' });
});
        
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

startServer();