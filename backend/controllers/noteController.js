import expressAsyncHandler from "express-async-handler";
import { Note } from "../models/Note.js";

// GET /api/notes/:problemId  — get the current user's note for a problem
export const getNote = expressAsyncHandler(async (req, res) => {
  const note = await Note.findOne({
    userId: req.user.id,
    problemId: req.params.problemId,
  });
  // Return empty string if no note yet — not a 404
  res.json({ content: note?.content || "" });
});

// PUT /api/notes/:problemId  — upsert note (create or overwrite)
export const upsertNote = expressAsyncHandler(async (req, res) => {
  const { content } = req.body;
  if (content === undefined) return res.status(400).json({ message: "content is required" });

  const note = await Note.findOneAndUpdate(
    { userId: req.user.id, problemId: req.params.problemId },
    { content },
    { new: true, upsert: true, runValidators: true }
  );
  res.json({ content: note.content });
});