import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const JWT_SECRET = process.env.JWT_SECRET;

// middleware
export function verifyJWT(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/auth");
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.clearCookie("token");
        return res.redirect("/auth");
    }
}

export function redirectIfLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (token) {
        try {
            jwt.verify(token, JWT_SECRET);
            return res.redirect("/dashboard");
        } catch {
            res.clearCookie("token");
        }
    }
    next();
}