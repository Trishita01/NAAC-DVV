// app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import criteriaMasterRoutes from "./routes/criteriaMaster.routes.js";
import criteria1Routes from "./routes/criteria1.routes.js";
import criteria2Routes from "./routes/criteria2.routes.js";
import authRoutes from "./routes/auth.routes.js";
import iiqaRoutes from "./routes/iiqa.routes.js";
import extendedprofileRoutes from "./routes/extendedprofile.routes.js";
dotenv.config();          // Load .env vars

const app = express();    // Create Express app

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1/criteria', criteriaMasterRoutes);
app.use('/api/v1/criteria1', criteria1Routes);
app.use('/api/v1/criteria2', criteria2Routes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/iiqa', iiqaRoutes);
app.use('/api/v1/extendedprofile', extendedprofileRoutes);
// Health Checks
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    error: `Cannot ${req.method} ${req.url}`
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

export default app;
