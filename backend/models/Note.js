import { Schema, model } from "mongoose";

// One note per user per problem — upsert pattern
const noteSchema = new Schema(
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
    content: {
      type: String,
      default: "",
      maxlength: [2000, "Note cannot exceed 2000 characters"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Enforce one note per user+problem
noteSchema.index({ userId: 1, problemId: 1 }, { unique: true });

export const Note = model("Note", noteSchema);
export default Note;