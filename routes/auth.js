import express from "express";
import { __filename, __dirname } from "../server.js";
import { redirectIfLoggedIn } from "../middleware/authMiddleware.js";
import path from "path"
import { signUpUser, loginUser, logoutUser, checkAuthStatus } from "../controllers/authController.js";


const router = express.Router();

router.get("/", (req, res) => {
    res.redirect("/auth/login");
})

router.get("/signup", redirectIfLoggedIn, (req, res) => {
    res.render("signup", {title: "Sign up"})
});

router.get("/login", redirectIfLoggedIn, (req, res) => {
    res.render("login", {title: "Login"});
});

router.get("/user", checkAuthStatus);

router.post("/signup", signUpUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);


export default router;