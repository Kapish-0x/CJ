import express from "express";
import {
  getModules,
  getModuleBySlug,
  createModule,
  updateModule,
  deleteModule,
} from "../controllers/moduleController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";

const moduleRouter = express.Router();

// Public: anyone can browse learning modules
moduleRouter.get("/", getModules);
moduleRouter.get("/:slug", getModuleBySlug);

// Admin only: manage modules
moduleRouter.post("/", VerifyToken("admin"), createModule);
moduleRouter.put("/:id", VerifyToken("admin"), updateModule);
moduleRouter.delete("/:id", VerifyToken("admin"), deleteModule);

export default moduleRouter;