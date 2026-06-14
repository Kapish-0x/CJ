import express from "express";
import { askMentor } from "../controllers/aiController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";

const aiRouter = express.Router();

// Logged-in users only — guides the student, never gives the full solution
aiRouter.post("/mentor", VerifyToken("user", "admin"), askMentor);

export default aiRouter;