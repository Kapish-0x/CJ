import express from "express";
import {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
} from "../controllers/problemController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

// Public: Anyone can view problems
router.get("/", getProblems);
router.get("/:id", getProblemById);

// Admin Only
router.post("/", VerifyToken("admin"), createProblem);
router.put("/:id", VerifyToken("admin"), updateProblem);
router.delete("/:id", VerifyToken("admin"), deleteProblem);

export default router;  