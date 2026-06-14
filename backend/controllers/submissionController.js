import { Problem } from "../models/Problem.js";
import { Submission } from "../models/Submission.js";
import { User } from "../models/User.js";
import { runCodeLocally } from "../utils/executor.js";
import expressAsyncHandler from "express-async-handler";

// POST /api/submissions/run  — run against custom input, no DB save
export const runCode = expressAsyncHandler(async (req, res) => {
  const { code, language, input } = req.body;

  if (!["python", "javascript"].includes(language)) {
    return res.status(400).json({ message: `Unsupported language: ${language}` });
  }
  if (!code || code.trim().length === 0) {
    return res.status(400).json({ message: "Code cannot be empty" });
  }

  // Give run mode a generous 10s — no test cases to loop through
  const result = await runCodeLocally(language, code, input ?? "", 10000);

  if (result.code !== 0) {
    return res.json({
      status: "Runtime Error",
      output: result.stderr || "Unknown error",
    });
  }

  res.json({ status: "Executed", output: result.stdout });
});

// POST /api/submissions/submit
export const submitCode = expressAsyncHandler(async (req, res) => {
  const { problemId, code, language } = req.body;
  const userId = req.user.id;

  if (!["python", "javascript"].includes(language)) {
    return res.status(400).json({ message: `Unsupported language: ${language}` });
  }
  if (!code || code.trim().length === 0) {
    return res.status(400).json({ message: "Code cannot be empty" });
  }

  const problem = await Problem.findById(problemId);
  if (!problem) return res.status(404).json({ message: "Problem not found" });
  if (!problem.testCases?.length) {
    return res.status(400).json({ message: "Problem has no test cases" });
  }

  const submission = await Submission.create({
    userId, problemId, code, language, status: "Pending",
  });

  // Per-test-case time limit: use the problem's timeLimit (ms), min 5s
  const perCaseLimit = Math.max(problem.timeLimit || 5000, 5000);

  let finalStatus = "Accepted";
  let lastOutput  = "";
  let testCasesPassed = 0;
  const totalTestCases = problem.testCases.length;
  const startTime = Date.now();

  for (const testCase of problem.testCases) {
    const result = await runCodeLocally(language, code, testCase.input ?? "", perCaseLimit);

    if (result.stderr === "Time Limit Exceeded" || result.code !== 0 && result.stderr?.includes("Time Limit")) {
      finalStatus = "Time Limit Exceeded";
      lastOutput  = "Time Limit Exceeded";
      break;
    }

    if (result.code !== 0) {
      finalStatus = "Runtime Error";
      lastOutput  = result.stderr || "Runtime error";
      break;
    }

    const actual   = result.stdout.trim();
    const expected = testCase.expectedOutput.trim();

    if (actual !== expected) {
      finalStatus = "Wrong Answer";
      lastOutput  = actual;
      break;
    }

    testCasesPassed++;
  }

  const executionTime = Date.now() - startTime;

  submission.status        = finalStatus;
  submission.output        = lastOutput;
  submission.executionTime = executionTime;
  await submission.save();

  if (finalStatus === "Accepted") {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { solvedProblems: problemId },
      $inc:      { totalSubmissions: 1 },
    });
  } else {
    await User.findByIdAndUpdate(userId, { $inc: { totalSubmissions: 1 } });
  }

  res.json({
    status: finalStatus,
    output: lastOutput,
    executionTime,
    testCasesPassed,
    totalTestCases,
    submissionId: submission._id,
  });
});

// GET /api/submissions/my
export const getMySubmissions = expressAsyncHandler(async (req, res) => {
  const submissions = await Submission.find({ userId: req.user.id })
    .populate("problemId", "title difficulty")
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(submissions);
});

// GET /api/submissions/problem/:problemId (admin)
export const getSubmissionsByProblem = expressAsyncHandler(async (req, res) => {
  const submissions = await Submission.find({ problemId: req.params.problemId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  res.json(submissions);
});