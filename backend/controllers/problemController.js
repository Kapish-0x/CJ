import { Problem } from "../models/Problem.js";
import expressAsyncHandler from "express-async-handler";

// GET /api/problems
export const getProblems = expressAsyncHandler(async (req, res) => {
  const { difficulty, tag } = req.query;
  const filter = {};

  if (difficulty) filter.difficulty = difficulty;
  if (tag) filter.tags = tag;

  const problems = await Problem.find(filter).select("-testCases"); // Hide test cases from list view
  res.json(problems);
});

// GET /api/problems/:id
export const getProblemById = expressAsyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id).select("-testCases"); // Hide test cases from user view
  if (!problem) return res.status(404).json({ message: "Problem not found" });
  res.json(problem);
});

// POST /api/problems (Admin only)
export const createProblem = expressAsyncHandler(async (req, res) => {
  const problem = await Problem.create(req.body);
  res.status(201).json(problem);
});

// PUT /api/problems/:id (Admin only)
export const updateProblem = expressAsyncHandler(async (req, res) => {
  const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!problem) return res.status(404).json({ message: "Problem not found" });
  res.json(problem);
});

// DELETE /api/problems/:id (Admin only)
export const deleteProblem = expressAsyncHandler(async (req, res) => {
  const problem = await Problem.findByIdAndDelete(req.params.id);
  if (!problem) return res.status(404).json({ message: "Problem not found" });
  res.json({ message: "Problem deleted" });
});