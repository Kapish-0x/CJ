import expressAsyncHandler from "express-async-handler";
import { Module } from "../models/Module.js";

// GET /api/modules — list all modules (lightweight, no full content)
export const getModules = expressAsyncHandler(async (req, res) => {
  const modules = await Module.find()
    .select("slug title icon summary order")
    .sort({ order: 1, title: 1 });
  res.json(modules);
});

// GET /api/modules/:slug — full module detail (content + resources)
export const getModuleBySlug = expressAsyncHandler(async (req, res) => {
  const module = await Module.findOne({ slug: req.params.slug.toLowerCase() });
  if (!module) return res.status(404).json({ message: "Module not found" });
  res.json(module);
});

// POST /api/modules (Admin only)
export const createModule = expressAsyncHandler(async (req, res) => {
  if (req.body.slug) req.body.slug = req.body.slug.toLowerCase().trim();
  const module = await Module.create(req.body);
  res.status(201).json(module);
});

// PUT /api/modules/:id (Admin only)
export const updateModule = expressAsyncHandler(async (req, res) => {
  if (req.body.slug) req.body.slug = req.body.slug.toLowerCase().trim();
  const module = await Module.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!module) return res.status(404).json({ message: "Module not found" });
  res.json(module);
});

// DELETE /api/modules/:id (Admin only)
export const deleteModule = expressAsyncHandler(async (req, res) => {
  const module = await Module.findByIdAndDelete(req.params.id);
  if (!module) return res.status(404).json({ message: "Module not found" });
  res.json({ message: "Module deleted" });
});