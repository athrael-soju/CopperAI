import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import User from "../models/User.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: `You've reached the /auth server route, running on port ${process.env.SERVER_PORT}`,
  });
});

router.post("/register", async (req, res) => {
  const { username, userdomain, email, birthdate, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User or email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      userdomain,
      email,
      birthdate,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error("Error:", error.message);

    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.firstLogin) {
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    let userdomain = user.userdomain;
    res.status(200).json({
      message: "User logged in successfully",
      token,
      username,
      userdomain,
    });
  } catch (error) {
    console.error("Error:", error);

    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
});

router.get("/guest", async (req, res) => {
  try {
    res.status(200).json({ username: "guest", userdomain: "basic" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
