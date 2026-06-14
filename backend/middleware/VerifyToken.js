import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { User } from "../models/User.js";

const { verify } = jwt;
config();

export const VerifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // 1. Check for token in cookies first, then Authorization header
      let token = req.cookies?.token;

      if (!token && req.headers?.authorization) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return res.status(401).json({ message: "Please login first" });
      }

      // 2. Verify token
      const decodedToken = verify(token, process.env.JWT_SECRET);

      // 3. Check if user still exists in DB
      const freshUser = await User.findById(decodedToken.id).select("-password");

      if (!freshUser) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      if (!freshUser.isActive) {
        return res.status(403).json({ message: "Account is deactivated" });
      }

      // 4. Role-based Authorization
      if (allowedRoles.length > 0 && !allowedRoles.includes(freshUser.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      // 5. Attach user to request
      req.user = freshUser;
      next();
    } catch (err) {
      console.error("Auth Middleware Error:", err.message);
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};