// Import necessary modules for the application
import express from "express"; 
import dotenv from "dotenv"; 
import cors from "cors"; 
import cookieParser from "cookie-parser"; 
import path from "path"; 
import axios from "axios"; // Import axios to send requests

// Import the database connection function
import { connectDB } from "./db/connectDB.js";

// Import authentication routes
import authRoutes from "./routes/auth.route.js"; 
import studentRoutes from "./routes/student.route.js"; // Import student routes

// Load environment variables from .env file
dotenv.config(); 

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000; 

// Resolve the directory name for serving static files
const __dirname = path.resolve(); 

// Use CORS middleware with specific origin
app.use(cors({ origin: "http://localhost:5173", credentials: true })); 

// Middleware to parse JSON data
app.use(express.json()); 

// Middleware to parse cookies
app.use(cookieParser()); 

// Route for handling authentication-related requests
app.use("/api/auth", authRoutes); 
app.use("/api", studentRoutes); // This sets the base path for student, subjects, and marks routes

// Serve static files in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend", "dist")));

    // Handle all other routes by serving the main index.html file
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// Start the server and listen on the specified port
const startServer = async () => {
    try {
        await connectDB(); // Connect to the database

        app.listen(PORT, () => {
            console.log("Server is running on port:", PORT);  
        });
    } catch (error) {
        console.error("Error connecting to the database:", error.message); 
    }
};

startServer();
