import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const { sign } = jwt;

export const registerUser = expressAsyncHandler(async (req, res) => {
  const newUser = req.body;
  const allowedRoles = ["user", "admin"];

  if (!allowedRoles.includes(newUser.role || "user")) {
    return res.status(400).json({ message: "Invalid Role" });
  }

  const existingUser = await User.findOne({ email: newUser.email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already exists, please Login." });
  }

  newUser.password = await bcrypt.hash(newUser.password, 12);
  const newUserDoc = new User(newUser);
  await newUserDoc.save();

  res.status(201).json({ message: "User Created Successfully" });
});

export const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "No user found. Please register." });
  }

  if (!user.isActive) {
    return res.status(403).json({ message: "Account is deactivated" });
  }

  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  const signedToken = sign(
    { id: user._id, email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", signedToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  const userObj = user.toObject();
  delete userObj.password;

  res.status(200).json({ message: "Login success", payload: userObj });
});

export const logoutUser = expressAsyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  res.status(200).json({ message: "Logged out successfully" });
});