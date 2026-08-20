import express from "express";
import cors from "cors";
import path from "path"
import { fileURLToPath } from "url";
import "dotenv/config";
import jwt from "jsonwebtoken";
import cookieparser from "cookie-parser";
import mongoose from "mongoose";

import authRouter from "./routes/auth.js";
import dashboardRouter from "./routes/dashboard.js";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename)

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(process.env.MONGODB_URI).then(console.log("Connected to database sucessfully!"));

app.use(cookieparser());
app.use(express.json());
app.use(cors({
    credentials: true
}));
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);


app.get("/", (req, res) => {
    res.redirect("/auth");
})

// middleware
export function verifyJWT(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({message: "Access denied. No token provided"});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.clearCookie("token");
        res.res.status(403).json({message: "Invalid or expired token"});
    }
}


app.listen(PORT, () => {
    console.log(`Server runs on http://localhost:${PORT}`)
})



