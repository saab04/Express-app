import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import User from "../models/User.js";

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

        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(201).json({message: "User created", user: {usename: newUser.username, email: newUser.email}});
    
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "A problem with registration occured on the server"});
    }

}