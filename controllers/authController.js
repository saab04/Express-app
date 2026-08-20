import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET;

export async function signUpUser(req, res) {
    const { username, email, password, confirmedPassword} = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({message: "Username, email and password are required"});
    }

    if (confirmedPassword !== password) {
        return res.status(400).json({message: "Password does not match confirmation"})
    }

    try {
        const userExist = await User.findOne({ username });
        if (userExist) {
            return res.status(400).json({message: "Username is already taken"});
        }

        const newUser = await User.create({ username, email, password });

        const token = jwt.sign({userId: newUser._id}, JWT_SECRET, {expiresIn: "1d"});
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(201).json({message: "User created", user: {username: newUser.username, email: newUser.email}});
    
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "A problem with registration occured on the server"});
    }

}

export async function loginUser(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({message: "Invalid username or password"});
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);

        if (!passwordCorrect) {
            return res.status(401).json({message: "Invalid username or password"});
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: "1d"});

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({message: "Logged in successfully", user: { username: user.username, email: user.email}});

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "A problem with login occured on the server"});
    }
}

export function logoutUser(req, res) {
    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0 
    });

    return res.status(200).json({message: "Logged out successfully"});
}

export async function checkAuthStatus(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ loggedIn: false, message: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId).select("username");

        if (!user) {
            return res.status(404).json({loggedIn: false, message: "User not found" });
        }

        return res.status(200).json({loggedIn: true, username: user.username});
    
    } catch (error) {
        console.error(error);
        return res.status(401).json({loggedIn: false, message: "Invalid token"});
    }
}