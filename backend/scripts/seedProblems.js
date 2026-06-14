import mongoose from "mongoose";
import dotenv from "dotenv";
import { Problem } from "../models/Problem.js";

dotenv.config();

const problems = [
  {
    title: "Two Sum",
    description:
      "Given an array of integers and a target value, find two numbers such that they add up to the target.\n\nInput Format:\nFirst line: n (size of array)\nSecond line: n space-separated integers\nThird line: target\n\nOutput Format:\nIndices (0-based) of the two numbers, space-separated.",
    difficulty: "Easy",
    timeLimit: 2000,
    memoryLimit: 256,
    tags: ["Array", "Hash Table"],
    boilerplate: "",
    testCases: [
      { input: "4\n2 7 11 15\n9", expectedOutput: "0 1" },
      { input: "3\n3 2 4\n6", expectedOutput: "1 2" },
      { input: "2\n3 3\n6", expectedOutput: "0 1" },
    ],
  },
  {
    title: "Reverse a String",
    description:
      "Given a string, print it reversed.\n\nInput Format:\nA single line containing the string (no spaces).\n\nOutput Format:\nThe reversed string.",
    difficulty: "Easy",
    timeLimit: 2000,
    memoryLimit: 256,
    tags: ["String"],
    boilerplate: "",
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "spiderman", expectedOutput: "namredips" },
      { input: "a", expectedOutput: "a" },
    ],
  },
  {
    title: "Fibonacci Number",
    description:
      "Given an integer n, return the nth Fibonacci number (0-indexed, F(0)=0, F(1)=1).\n\nInput Format:\nA single integer n.\n\nOutput Format:\nThe nth Fibonacci number.",
    difficulty: "Medium",
    timeLimit: 2000,
    memoryLimit: 256,
    tags: ["Dynamic Programming", "Math"],
    boilerplate: "",
    testCases: [
      { input: "0", expectedOutput: "0" },
      { input: "1", expectedOutput: "1" },
      { input: "10", expectedOutput: "55" },
      { input: "20", expectedOutput: "6765" },
    ],
  },
  {
    title: "Valid Parentheses",
    description:
      "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nInput Format:\nA single line string of brackets.\n\nOutput Format:\nPrint 'true' or 'false'.",
    difficulty: "Medium",
    timeLimit: 2000,
    memoryLimit: 256,
    tags: ["Stack", "String"],
    boilerplate: "",
    testCases: [
      { input: "()", expectedOutput: "true" },
      { input: "()[]{}", expectedOutput: "true" },
      { input: "(]", expectedOutput: "false" },
      { input: "([)]", expectedOutput: "false" },
    ],
  },
  {
    title: "Merge Intervals",
    description:
      "Given a collection of intervals, merge all overlapping intervals.\n\nInput Format:\nFirst line: n (number of intervals)\nNext n lines: two integers start and end\n\nOutput Format:\nMerged intervals, one per line, as 'start end', sorted by start.",
    difficulty: "Hard",
    timeLimit: 3000,
    memoryLimit: 256,
    tags: ["Array", "Sorting"],
    boilerplate: "",
    testCases: [
      { input: "4\n1 3\n2 6\n8 10\n15 18", expectedOutput: "1 6\n8 10\n15 18" },
      { input: "2\n1 4\n4 5", expectedOutput: "1 5" },
    ],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Problem.deleteMany({});
    console.log("🗑️  Cleared existing problems");

    const inserted = await Problem.insertMany(problems);
    console.log(`🕷️  Inserted ${inserted.length} problems`);

    await mongoose.disconnect();
    console.log("✅ Done");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();