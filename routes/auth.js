import express from "express";
import { __filename, __dirname } from "../server.js";
import path from "path"
import { signUpUser, loginUser, logoutUser, checkAuthStatus } from "../controllers/authController.js";


const router = express.Router();

router.get("/", (req, res) => {
    res.redirect("/auth/login");
})

router.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "./public", "signup.html"));
});

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "./public", "login.html"));
});

router.get("/user", checkAuthStatus);

router.post("/signup", signUpUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);


export default router;