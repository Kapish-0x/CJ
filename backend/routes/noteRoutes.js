import express from "express";
import { getNote, upsertNote } from "../controllers/noteController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";

const noteRouter = express.Router();

// Both behind auth — users can only see/edit their own notes
noteRouter.get("/:problemId", VerifyToken("user", "admin"), getNote);
noteRouter.put("/:problemId", VerifyToken("user", "admin"), upsertNote);

export default noteRouter;