import { Schema, model } from "mongoose";

// Each module = one learning topic (Arrays, Strings, Linked List, Trees, etc.)
const resourceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    channel: { type: String, required: true, trim: true }, // e.g. "Apna College", "Striver"
    url: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const moduleSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    icon: {
      type: String,
      default: "📘",
    },
    summary: {
      type: String,
      default: "",
    },
    content: {
      type: String, // markdown / plain text basic explanation
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    resources: {
      type: [resourceSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Module = model("Module", moduleSchema);
export default Module;