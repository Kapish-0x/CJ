import { Schema, model } from "mongoose";

const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    timeLimit: {
      type: Number,
      default: 2000, // in milliseconds
    },
    memoryLimit: {
      type: Number,
      default: 256, // in MB
    },
    testCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
      },
    ],
    boilerplate: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ✅ Named export to match: import { Problem } from '../models/Problem.js'
export const Problem = model("Problem", problemSchema);
export default Problem;