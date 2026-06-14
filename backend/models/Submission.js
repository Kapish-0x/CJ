import { Schema, model } from "mongoose";

const submissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["python", "javascript", "java", "cpp", "c"],
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Wrong Answer",
        "Time Limit Exceeded",
        "Runtime Error",
        "Compilation Error",
      ],
      default: "Pending",
    },
    executionTime: {
      type: Number,
      default: 0,
    },
    memory: {
      type: Number,
      default: 0,
    },
    output: {
      type: String,
      default: "",
    },
    judge0Token: {
      type: String, // Store Judge0 submission token for reference
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

submissionSchema.index({ problemId: 1, status: 1 });
submissionSchema.index({ userId: 1, createdAt: -1 });

// ✅ Named export to match: import { Submission } from '../models/Submission.js'
export const Submission = model("Submission", submissionSchema);
export default Submission;