import express from "express";
import cors from "cors";
import path from "path"
import { fileURLToPath } from "url";
import "dotenv/config";
import mongoose from "mongoose"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express();

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI).then(console.log("Connected to database sucessfully!"));

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));



app.listen(PORT, () => {
    console.log(`Server runs on http://localhost:${PORT}`)
})



