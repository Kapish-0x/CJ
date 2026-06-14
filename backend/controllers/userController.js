import expressAsyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import { Submission } from "../models/Submission.js";

// ─── #2 ── Star / Revision list ──────────────────────────────────────────────

// PATCH /api/users/star/:problemId
export const toggleStarProblem = expressAsyncHandler(async (req, res) => {
  const { problemId } = req.params;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const idx = user.starredProblems.findIndex((p) => p.toString() === problemId);
  let starred;
  if (idx > -1) {
    user.starredProblems.splice(idx, 1);
    starred = false;
  } else {
    user.starredProblems.push(problemId);
    starred = true;
  }
  await user.save();
  res.json({ starred, starredProblems: user.starredProblems });
});

// GET /api/users/starred
export const getStarredProblems = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "starredProblems",
    select: "-testCases",
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user.starredProblems || []);
});

// ─── #3 ── Social links + heatmap ────────────────────────────────────────────

// PATCH /api/users/profile  — update name + socialLinks
export const updateProfile = expressAsyncHandler(async (req, res) => {
  const { name, github, linkedin, twitter, website } = req.body;

  // Build update object — only include provided fields
  const update = {};
  if (name !== undefined) update.name = name.trim();
  if (github !== undefined) update["socialLinks.github"] = github.trim();
  if (linkedin !== undefined) update["socialLinks.linkedin"] = linkedin.trim();
  if (twitter !== undefined) update["socialLinks.twitter"] = twitter.trim();
  if (website !== undefined) update["socialLinks.website"] = website.trim();

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: update },
    { new: true, runValidators: true, select: "-password" }
  );

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// GET /api/users/heatmap  — submission counts per day for past 365 days
// Accepts ?tzOffset=<minutes> (value of JS Date.getTimezoneOffset() on the client)
// so "today" lines up with the user's local calendar date instead of UTC.
export const getHeatmap = expressAsyncHandler(async (req, res) => {
  const since = new Date();
  since.setFullYear(since.getFullYear() - 1);

  const submissions = await Submission.find({
    userId: req.user.id,
    createdAt: { $gte: since },
  }).select("createdAt status");

  // tzOffset is minutes to ADD to UTC to get local time (Date.getTimezoneOffset()
  // returns the negative of that, e.g. IST = -330 => offset = +330)
  const tzOffsetMin = -Number(req.query.tzOffset || 0);

  // Build a map: "YYYY-MM-DD" -> { count, accepted }
  const map = {};
  for (const sub of submissions) {
    const local = new Date(sub.createdAt.getTime() + tzOffsetMin * 60 * 1000);
    const key = local.toISOString().slice(0, 10);
    if (!map[key]) map[key] = { count: 0, accepted: 0 };
    map[key].count++;
    if (sub.status === "Accepted") map[key].accepted++;
  }

  res.json(map);
});