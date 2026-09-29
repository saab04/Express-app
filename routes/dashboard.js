import express from "express";
import { __filename, __dirname} from "../server.js";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { claimReward, rewardInfo, playCoinFlip } from "../controllers/balanceController.js";
import path from "path";

const router = express.Router();

router.get("/", verifyJWT, (req, res) => {
    res.render("dashboard", {title: "Home", user: req.user});
});

router.get("/coin-flip", verifyJWT, (req, res) => {
    res.render("coin_flip", {title: "Coin Flip", user: req.user});
})

router.post("/coin-flip", verifyJWT, playCoinFlip);

router.get("/account", verifyJWT, (req, res) => {
    res.render("account", {title: "My Account", user: req.user});
})

router.get("/reward-info", verifyJWT, rewardInfo);

router.post("/claim-reward", verifyJWT, claimReward);

export default router;
