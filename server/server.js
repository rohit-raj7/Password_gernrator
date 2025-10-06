import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./configs/mongodb.js";
import helmet from "helmet";
import authRoutes from './routers/authRoutes.js';
import vaultRoutes from "./routers/vaultRoutes.js"; 

const app = express();

// Connect DB
await connectDB();

const allowedOrigins = ["http://localhost:3001","http://localhost:5000",
  "https://password-eta-sand.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// ===== Routes =====

app.get("/", (req, res) => res.send("🔐 Password Vault API is running..."));
app.use("/api/auth", authRoutes);
app.use("/api/vault", vaultRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));






 
