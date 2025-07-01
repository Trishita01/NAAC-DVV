// app.js
import express from "express";
import dotenv from "dotenv";


dotenv.config();          // Load .env vars

const app = express();    // Create Express app

// Built-in middleware
app.use(express.json());  

export default app;
