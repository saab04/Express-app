import express from "express";
import { __filename, __dirname } from "../server.js";
import path from "path"
import { signUpUser } from "../controllers/authController.js";


const router = express.Router();

router.get("/", (req, res) => {
    res.redirect("/auth/signup");
})

router.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "./public", "signup.html"));
});

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "./public", "login.html"));
});

router.post("/signup", signUpUser);


export default router;