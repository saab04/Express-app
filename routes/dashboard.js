import express from "express";
import { __filename, __dirname} from "../server.js";
import { verifyJWT } from "../middleware/authMiddleware.js";
import path from "path";

const router = express.Router();

router.get("/", verifyJWT, (req, res) => {
    res.sendFile(path.join(__dirname, "./private", "dashboard.html"));
});

export default router;
