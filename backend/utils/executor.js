import { spawn, execSync } from "child_process";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Detect available Python and Node commands once at startup
const detectCmd = (candidates) => {
  for (const cmd of candidates) {
    try {
      execSync(`${cmd} --version`, { stdio: "ignore" });
      return cmd;
    } catch (_) {}
  }
  return null;
};

const PYTHON_CMD = detectCmd(["python3", "python", "py"]);
const NODE_CMD   = detectCmd(["node", "nodejs"]);

console.log(`[executor] Python command: ${PYTHON_CMD || "NOT FOUND"}`);
console.log(`[executor] Node command:   ${NODE_CMD || "NOT FOUND"}`);

const CMD_MAP = {
  python:     PYTHON_CMD,
  javascript: NODE_CMD,
};

export const runCodeLocally = async (language, code, input, timeLimit = 5000) => {
  const cmd = CMD_MAP[language];

  if (!cmd) {
    return {
      stdout: "",
      stderr: `Runtime for "${language}" not found on this server. Install ${language === "python" ? "Python" : "Node.js"} first.`,
      code: 1,
    };
  }

  const ext = language === "python" ? "py" : "js";
  const filename = `${uuidv4()}.${ext}`;
  const filePath = path.join(process.cwd(), "temp", filename);

  // Ensure temp dir exists
  await fs.mkdir(path.join(process.cwd(), "temp"), { recursive: true });

  try {
    await fs.writeFile(filePath, code);

    return new Promise((resolve) => {
      const child = spawn(cmd, [filePath]);

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (data) => (stdout += data));
      child.stderr.on("data", (data) => (stderr += data));

      // Prevent unhandled 'error' on stdin (EPIPE) from crashing the process
      // if the child exits before/while we write to its stdin.
      child.stdin.on("error", () => {});

      if (input) {
        try {
          child.stdin.write(input);
          child.stdin.end();
        } catch (_) {}
      } else {
        child.stdin.end();
      }

      const timer = setTimeout(() => {
        child.kill();
        resolve({ stdout: "", stderr: "Time Limit Exceeded", code: 1 });
      }, timeLimit);

      child.on("close", async (exitCode) => {
        clearTimeout(timer);
        await fs.unlink(filePath).catch(() => {});
        resolve({ stdout: stdout.trim(), stderr: stderr.trim(), code: exitCode ?? 0 });
      });

      child.on("error", async (err) => {
        clearTimeout(timer);
        await fs.unlink(filePath).catch(() => {});
        resolve({ stdout: "", stderr: err.message, code: 1 });
      });
    });
  } catch (err) {
    await fs.unlink(filePath).catch(() => {});
    return { stdout: "", stderr: err.message, code: 1 };
  }
};