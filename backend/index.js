// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Core packages
import express from "express";
import cors from "cors";

// Services (executed on import)
import { initGemini } from "./services/aiService.js";
import { initCloudinary } from "./services/cloudinaryService.js";
import { startScheduler } from "./cron/scheduler.js"; // Import scheduler starter

// Supabase client
import supabase from "./config/supabaseClient.js";

// Routes
import businessRoutes from "./routes/businessRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import metaRoutes from "./routes/meta_routes.js";
import schedulerRoutes from "./routes/schedulerRoutes.js";
import redirectRoutes from "./routes/redirectRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

// Initialize the Express app
const app = express();

async function startServer() {
  try {
    // initialize services before starting the server
    await initGemini();
    initCloudinary();
    console.log("All services initialized.");
    
    // Start the cron job
    startScheduler();
    
  } catch (err) {
    console.error("Service initialization failed. Exiting.", err);
    process.exit(1);
  }
}
        
// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow app to parse JSON request bodies
        

// --- Mount API Routers ---
app.use('/api/business', businessRoutes); 
app.use('/api/content', contentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/meta', metaRoutes);
app.use('/api/scheduler', schedulerRoutes);
app.use('/api/analytics',analyticsRoutes); 

// --- Mount Redirect Router (NEW) ---
// Note: Isse hum '/r' par mount karenge, '/api/r' par nahi, taaki link short dikhe.
app.use('/r', redirectRoutes); // <--- 2. MOUNT KIYA
        
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
    const { data, error } = await supabase
      .from('businesses') 
      .select('id')
      .limit(1);

    if (error) {
      throw error; 
    }
    res.json({ message: "DB connected", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

startServer();