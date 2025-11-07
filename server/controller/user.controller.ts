import type { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token";
import validator from "validator";
export async function register(req: Request, res: Response) {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    if (password.length < 8) {
      return res
        .status(401)
        .json({ error: "Password must be at least 8 characters long" });
    }

    if (password !== confirmPassword) {
      return res
        .status(401)
        .json({ error: "Password and confirmation do not match" });
    }

    const existsUser = await User.findOne({ email });
    if (existsUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 13);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id.toString());
    return res.status(201).json({
      success: "Account created successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating an account" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Email Invalid" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Password Invalid" });
    }
    const token = generateToken(user._id.toString());
    return res.status(200).json({
      success: "You have logged in successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "A login error occurred" });
  }
}

export async function me(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    res.status(200).json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user data" });
  }
}
