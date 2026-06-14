import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const StarIcon = ({ filled }) => (
  <svg className="w-4 h-4" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const BOILERPLATES = {
  python: `# Read from stdin using input()
# Print your answer using print()

line = input()

# Your code here

print()`,
  javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
  // Your code here

  console.log();
});`,
  java: `import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);

    // Your code here

    System.out.println();
  }
}`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
  ios_base::sync_with_stdio(false);
  cin.tie(NULL);

  // Your code here

  return 0;
}`,
  c: `#include <stdio.h>

int main() {
  // Your code here

  return 0;
}`,
};

const MONACO_LANG = {
  python: "python",
  javascript: "javascript",
  java: "java",
  cpp: "cpp",
  c: "c",
};

const difficultyColor = {
  Easy: "text-green-400 bg-green-400/10 border-green-400/20",
  Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Hard: "text-[#E31B23] bg-[#E31B23]/10 border-[#E31B23]/20",
};

const statusColor = {
  Accepted: "text-green-400 bg-green-400/10 border-green-400/30",
  "Wrong Answer": "text-red-400 bg-red-400/10 border-red-400/30",
  "Time Limit Exceeded": "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  "Runtime Error": "text-orange-400 bg-orange-400/10 border-orange-400/30",
  "Compilation Error": "text-purple-400 bg-purple-400/10 border-purple-400/30",
  Pending: "text-gray-400 bg-gray-400/10 border-gray-400/30",
  Executed: "text-blue-400 bg-blue-400/10 border-blue-400/30",
};

const statusEmoji = {
  Accepted: "✅",
  "Wrong Answer": "❌",
  "Time Limit Exceeded": "⏱️",
  "Runtime Error": "💥",
  "Compilation Error": "🔴",
  Pending: "⏳",
  Executed: "▶️",
};

// ── Notes panel ───────────────────────────────────────────────────────────────
function NotesPanel({ problemId, isDark }) {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/notes/${problemId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setNote(data.content || ""))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [problemId]);

  const saveNote = useCallback(async (content) => {
    setSaving(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/notes/${problemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });
      setSaved(true);
    } catch (_) {}
    setSaving(false);
  }, [problemId]);

  const handleChange = (e) => {
    const val = e.target.value;
    setNote(val);
    setSaved(false);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveNote(val), 1500);
  };

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center justify-between px-4 py-2 border-b ${isDark ? "border-white/8" : "border-gray-200"}`}>
        <span className={`text-xs font-bold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          📝 My Notes
        </span>
        <span className={`text-[10px] font-semibold ${saved ? "text-green-400" : saving ? "text-yellow-400" : isDark ? "text-gray-500" : "text-gray-400"}`}>
          {saving ? "Saving..." : saved ? "✓ Saved" : "Unsaved"}
        </span>
      </div>
      {loading ? (
        <div className={`flex-1 m-4 rounded-xl animate-pulse ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
      ) : (
        <textarea
          value={note}
          onChange={handleChange}
          placeholder="Jot down your approach, edge cases, or things to remember…"
          maxLength={2000}
          className={`flex-1 w-full p-4 text-sm resize-none outline-none font-mono leading-relaxed ${
            isDark ? "bg-transparent text-gray-200 placeholder-gray-600" : "bg-transparent text-gray-800 placeholder-gray-400"
          }`}
        />
      )}
      <div className={`px-4 py-1.5 text-right border-t ${isDark ? "border-white/5 text-gray-700" : "border-gray-100 text-gray-400"}`}>
        <span className="text-[10px]">{note.length}/2000</span>
      </div>
    </div>
  );
}

// ── Example test cases in description ────────────────────────────────────────
function ExampleTestCases({ testCases, isDark }) {
  // Only show the first 2 as "examples" — the rest are hidden
  const examples = testCases?.slice(0, 2) || [];
  if (examples.length === 0) return null;

  return (
    <div className="space-y-3">
      {examples.map((tc, i) => (
        <div key={i} className={`rounded-xl border overflow-hidden ${isDark ? "border-white/8" : "border-gray-200"}`}>
          <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide border-b ${isDark ? "bg-white/3 border-white/8 text-gray-400" : "bg-gray-50 border-gray-200 text-gray-500"}`}>
            Example {i + 1}
          </div>
          <div className="grid grid-cols-2 divide-x divide-white/8">
            <div className="p-3">
              <p className={`text-[10px] font-bold uppercase mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Input</p>
              <pre className={`text-xs font-mono whitespace-pre-wrap break-all ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {tc.input || "(empty)"}
              </pre>
            </div>
            <div className="p-3">
              <p className={`text-[10px] font-bold uppercase mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Output</p>
              <pre className={`text-xs font-mono whitespace-pre-wrap break-all ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {tc.expectedOutput || "(empty)"}
              </pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Result panel at bottom of editor ─────────────────────────────────────────
function ResultPanel({ result, running, submitting, isDark }) {
  if (!result && !running && !submitting) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`border-t overflow-hidden ${isDark ? "border-white/8 bg-[#0D0D1A]" : "border-gray-200 bg-white"}`}
      >
        <div className="px-5 py-4">
          {(running || submitting) && !result ? (
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-[#E31B23] border-t-transparent rounded-full shrink-0"
              />
              <span className={`text-sm font-semibold ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {submitting ? "Running against all test cases…" : "Executing your code…"}
              </span>
            </div>
          ) : result ? (
            <div>
              {/* Status badge */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className={`text-sm font-bold px-3 py-1 rounded-lg border ${statusColor[result.status] || statusColor.Pending}`}>
                  {statusEmoji[result.status]} {result.status}
                </span>
                {result.executionTime !== undefined && (
                  <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    {result.executionTime}ms
                  </span>
                )}
                {/* Test cases passed (only on submit) */}
                {result.totalTestCases !== undefined && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                    result.status === "Accepted"
                      ? "bg-green-400/10 text-green-400"
                      : "bg-white/5 text-gray-400"
                  }`}>
                    {result.testCasesPassed}/{result.totalTestCases} tests passed
                  </span>
                )}
              </div>

              {/* Big accepted message */}
              {result.status === "Accepted" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-xl border p-4 mb-3 ${isDark ? "bg-green-400/5 border-green-400/20" : "bg-green-50 border-green-200"}`}
                >
                  <p className="text-green-400 font-black text-base">🎉 Code Successfully Accepted!</p>
                  <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    All {result.totalTestCases} test cases passed — including the hidden ones.
                  </p>
                </motion.div>
              )}

              {/* Output / error display */}
              {result.output && result.status !== "Accepted" && (
                <div>
                  <p className={`text-[10px] font-bold uppercase mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    {result.status === "Executed" ? "Output" : "Details"}
                  </p>
                  <pre className={`text-xs p-3 rounded-lg font-mono overflow-x-auto max-h-32 ${
                    isDark ? "bg-black/30 text-gray-300" : "bg-gray-50 text-gray-700"
                  }`}>
                    {result.output}
                  </pre>
                </div>
              )}
              {/* Show run output even on success */}
              {result.status === "Executed" && result.output && (
                <div>
                  <p className={`text-[10px] font-bold uppercase mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Output</p>
                  <pre className={`text-xs p-3 rounded-lg font-mono overflow-x-auto max-h-32 ${
                    isDark ? "bg-black/30 text-gray-300" : "bg-gray-50 text-gray-700"
                  }`}>
                    {result.output}
                  </pre>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── AI Mentor chat panel ─────────────────────────────────────────────────────
function MentorPanel({ problemId, isDark, isOpen }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const userMsg = { role: "user", content: trimmed };
    const history = messages.slice(-12); // for backend context
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/mentor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ problemId, message: trimmed, history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "AI Mentor failed to respond");

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`flex flex-col h-72 border-t ${isDark ? "border-white/8 bg-[#0D0D1A]" : "border-gray-200 bg-white"}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b shrink-0 ${isDark ? "border-white/8" : "border-gray-200"}`}>
        <span className={`text-xs font-bold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          🧠 AI Mentor
        </span>
        <span className={`text-[10px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>
          Guides you — won't give the full solution
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className={`text-xs leading-relaxed ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            👋 Hey! I'm your DSA mentor for this problem. Tell me what you're thinking —
            your approach so far, where you're stuck, or what data structure you're considering —
            and I'll help you reason it through. I won't just hand you the code, but I'll
            help you get there yourself.
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-[#E31B23] text-white"
                  : isDark
                  ? "bg-white/5 text-gray-200"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className={`rounded-xl px-3 py-2 text-xs flex items-center gap-2 ${isDark ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-3 h-3 border-2 border-[#E31B23] border-t-transparent rounded-full"
              />
              Thinking…
            </div>
          </div>
        )}

        {error && (
          <div className="text-xs text-[#E31B23] font-semibold">{error}</div>
        )}
      </div>

      {/* Input */}
      <div className={`flex items-end gap-2 px-3 py-2 border-t shrink-0 ${isDark ? "border-white/8" : "border-gray-200"}`}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. I'm thinking of using a hashmap to track seen numbers — is that the right idea?"
          rows={1}
          maxLength={1500}
          className={`flex-1 resize-none px-3 py-2 text-xs rounded-lg border outline-none transition-colors ${
            isDark
              ? "bg-white/5 border-white/10 text-gray-200 placeholder-gray-600 focus:border-[#E31B23]/50"
              : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#E31B23]/50"
          }`}
        />
        <button
          onClick={sendMessage}
          disabled={sending || !input.trim()}
          className="px-3 py-2 rounded-lg bg-[#E31B23] text-white text-xs font-bold hover:bg-[#c41520] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProblemDetailPage() {
  const { id } = useParams();
  const { isDark } = useTheme();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(BOILERPLATES["python"]);

  // separate state for run vs submit so spinners are independent
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Custom test input for Run
  const [customInput, setCustomInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // AI Mentor panel toggle (replaces result panel when open)
  const [showMentor, setShowMentor] = useState(false);

  const [activeTab, setActiveTab] = useState("description");
  const [mySubmissions, setMySubmissions] = useState([]);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/problems/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Problem not found");
        const data = await res.json();
        setProblem(data);
        // Pre-fill custom input with first example test case if available
        if (data.testCases?.[0]?.input) setCustomInput(data.testCases[0].input);
        if (data.boilerplate) setCode(data.boilerplate);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(BOILERPLATES[lang]);
    setResult(null);
  };

  const toggleStar = async () => {
    if (!user) { navigate("/login"); return; }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/star/${id}`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) updateUser({ starredProblems: data.starredProblems });
    } catch (_) {}
  };

  // ── Run against custom input ──
  const handleRun = async () => {
    if (!user) { navigate("/login"); return; }
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/submissions/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code, language, input: customInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Run failed");
      setResult(data);
    } catch (err) {
      setResult({ status: "Runtime Error", output: err.message });
    } finally {
      setRunning(false);
    }
  };

  // ── Submit against all hidden test cases ──
  const handleSubmit = async () => {
    if (!user) { navigate("/login"); return; }
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/submissions/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ problemId: id, code, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");
      setResult(data);

      // Update local user stats so dashboard/profile reflect new solve without page reload
      if (data.status === "Accepted") {
        updateUser({
          solvedProblems: [...(user.solvedProblems || []), id],
          totalSubmissions: (user.totalSubmissions || 0) + 1,
        });
      } else {
        updateUser({ totalSubmissions: (user.totalSubmissions || 0) + 1 });
      }
    } catch (err) {
      setResult({ status: "Runtime Error", output: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const fetchMySubmissions = async () => {
    setSubLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/submissions/my`, {
        credentials: "include",
      });
      const data = await res.json();
      const forThis = data.filter((s) => s.problemId?._id === id || s.problemId === id);
      setMySubmissions(forThis);
    } catch (_) {}
    setSubLoading(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "submissions" && mySubmissions.length === 0) fetchMySubmissions();
  };

  const isStarred = user?.starredProblems?.some((p) => p === id || p?._id === id || p?.toString() === id);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center pt-16 ${isDark ? "bg-[#0D0D1A]" : "bg-[#F8F8FC]"}`}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-[#E31B23] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center pt-16 ${isDark ? "bg-[#0D0D1A] text-white" : "bg-[#F8F8FC]"}`}>
        <div className="text-center">
          <div className="text-5xl mb-4">🕸️</div>
          <p className="text-[#E31B23] font-bold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-16 flex flex-col ${isDark ? "bg-[#0D0D1A] text-white" : "bg-[#F8F8FC] text-[#0D0D1A]"}`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#E31B23]" />

      {/* ── Top bar ── */}
      <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isDark ? "border-white/8 bg-[#0D0D1A]" : "border-gray-200 bg-white"}`}>
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate("/problems")}
            className={`text-sm font-semibold flex items-center gap-1 shrink-0 ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-[#0D0D1A]"}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Problems
          </button>
          <span className={`text-sm ${isDark ? "text-gray-600" : "text-gray-300"}`}>/</span>
          <h1 className="text-sm font-bold truncate">{problem?.title}</h1>
          <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-bold shrink-0 ${difficultyColor[problem?.difficulty]}`}>
            {problem?.difficulty}
          </span>
          <button
            onClick={toggleStar}
            title={isStarred ? "Remove from revision list" : "Add to revision list"}
            className={`shrink-0 p-1 rounded-lg transition-colors ${
              isStarred ? "text-yellow-400 hover:text-yellow-300" : isDark ? "text-gray-600 hover:text-gray-400" : "text-gray-300 hover:text-gray-500"
            }`}
          >
            <StarIcon filled={isStarred} />
          </button>
        </div>

        {/* Language selector + Run + Submit */}
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border outline-none transition-colors ${
              isDark ? "bg-white/5 border-white/10 text-gray-300" : "bg-white border-gray-200 text-gray-600"
            }`}
          >
            {Object.keys(BOILERPLATES).map((lang) => (
              <option key={lang} value={lang}>{lang.toUpperCase()}</option>
            ))}
          </select>

          {/* Run button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => { setShowCustomInput(true); handleRun(); }}
            disabled={running || submitting}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
              isDark
                ? "border-white/15 text-gray-300 hover:border-white/30 hover:text-white"
                : "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900"
            }`}
          >
            {running ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Running…
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                </svg>
                Run
              </>
            )}
          </motion.button>

          {/* Submit button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSubmit}
            disabled={submitting || running}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#E31B23] text-white text-xs font-bold hover:bg-[#c41520] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Judging…
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 104px)" }}>

        {/* LEFT: tabs + content */}
        <div className={`w-full md:w-[42%] flex flex-col border-r overflow-hidden ${isDark ? "border-white/8" : "border-gray-200"}`}>
          {/* Tab bar */}
          <div className={`flex border-b ${isDark ? "border-white/8" : "border-gray-200"}`}>
            {["description", "notes", "submissions"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-2.5 text-xs font-bold capitalize tracking-wide transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "text-[#E31B23] border-[#E31B23]"
                    : `border-transparent ${isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`
                }`}
              >
                {tab === "notes" ? "📝 Notes" : tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className={`flex-1 overflow-y-auto ${activeTab === "notes" ? "p-0 flex flex-col" : "p-5"}`}>

            {/* ── Description tab ── */}
            {activeTab === "description" && (
              <div className="space-y-5">
                {/* Title + tags */}
                <div>
                  <h2 className="text-xl font-black">{problem?.title}</h2>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-xs font-bold ${difficultyColor[problem?.difficulty]}`}>
                      {problem?.difficulty}
                    </span>
                    {problem?.tags?.map((tag) => (
                      <span key={tag} className={`px-2 py-0.5 rounded border text-xs ${isDark ? "border-white/10 text-gray-400" : "border-gray-200 text-gray-500"}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description text */}
                <div>
                  <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {problem?.description}
                  </p>
                </div>

                {/* Example test cases */}
                {problem?.testCases?.length > 0 && (
                  <div>
                    <h3 className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Examples
                    </h3>
                    <ExampleTestCases testCases={problem.testCases} isDark={isDark} />
                    {problem.testCases.length > 2 && (
                      <p className={`text-xs mt-2 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                        + {problem.testCases.length - 2} more hidden test cases
                      </p>
                    )}
                  </div>
                )}

                {/* Constraints */}
                <div className={`rounded-xl p-4 border ${isDark ? "bg-white/2 border-white/8" : "bg-gray-50 border-gray-200"}`}>
                  <h3 className="text-xs font-bold mb-2 text-[#E31B23] uppercase tracking-wide">Constraints</h3>
                  <div className="space-y-1">
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      ⏱ Time limit: <span className="font-semibold">{(problem?.timeLimit || 2000) / 1000}s</span>
                    </p>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      💾 Memory limit: <span className="font-semibold">{problem?.memoryLimit || 256} MB</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Notes tab ── */}
            {activeTab === "notes" && <NotesPanel problemId={id} isDark={isDark} />}

            {/* ── Submissions tab ── */}
            {activeTab === "submissions" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold">My Submissions</h3>
                  <button
                    onClick={fetchMySubmissions}
                    className={`text-xs font-semibold ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`}
                  >
                    ↻ Refresh
                  </button>
                </div>
                {subLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`h-12 rounded-lg animate-pulse ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
                    ))}
                  </div>
                ) : mySubmissions.length === 0 ? (
                  <div className="text-center py-10">
                    <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>No submissions yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {mySubmissions.map((sub) => (
                      <div key={sub._id} className={`px-4 py-3 rounded-xl border ${isDark ? "bg-white/2 border-white/8" : "bg-white border-gray-200"}`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded border ${statusColor[sub.status] || statusColor.Pending}`}>
                            {statusEmoji[sub.status]} {sub.status}
                          </span>
                          <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                            {sub.language?.toUpperCase()} · {sub.executionTime}ms
                          </span>
                        </div>
                        <p className={`text-xs mt-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                          {new Date(sub.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Editor + custom input + result */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Monaco Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={MONACO_LANG[language]}
              value={code}
              onChange={(val) => setCode(val || "")}
              theme={isDark ? "vs-dark" : "light"}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                lineNumbers: "on",
                renderLineHighlight: "line",
                tabSize: 2,
                wordWrap: "on",
                automaticLayout: true,
                scrollbar: { verticalScrollbarSize: 4 },
                cursorBlinking: "smooth",
                smoothScrolling: true,
              }}
            />
          </div>

          {/* Custom test input area (collapsible) */}
          <div className={`border-t ${isDark ? "border-white/8" : "border-gray-200"}`}>
            <div className={`flex items-stretch divide-x ${isDark ? "divide-white/8" : "divide-gray-200"}`}>
              <button
                onClick={() => setShowCustomInput((v) => !v)}
                className={`flex-1 flex items-center justify-between px-4 py-2 text-xs font-bold transition-colors ${
                  isDark ? "text-gray-400 hover:text-white hover:bg-white/3" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>🧪 Custom Test Input</span>
                <svg className={`w-3.5 h-3.5 transition-transform ${showCustomInput ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <button
                onClick={() => setShowMentor((v) => !v)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold transition-colors ${
                  showMentor
                    ? "text-[#E31B23]"
                    : isDark ? "text-gray-400 hover:text-white hover:bg-white/3" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>🧠 AI Mentor</span>
                <svg className={`w-3.5 h-3.5 transition-transform ${showMentor ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <AnimatePresence>
              {showCustomInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className={`px-4 pb-3 ${isDark ? "bg-[#0D0D1A]" : "bg-white"}`}>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Type your custom stdin input here…"
                      rows={3}
                      className={`w-full px-3 py-2 text-xs font-mono rounded-lg border outline-none resize-none transition-colors ${
                        isDark
                          ? "bg-white/5 border-white/10 text-gray-200 placeholder-gray-600 focus:border-[#E31B23]/50"
                          : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#E31B23]/50"
                      }`}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={handleRun}
                        disabled={running || submitting}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors disabled:opacity-60 ${
                          isDark ? "border-white/15 text-gray-300 hover:border-white/30" : "border-gray-300 text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        {running ? "Running…" : "▶ Run with this input"}
                      </button>
                      {problem?.testCases?.[0] && (
                        <button
                          onClick={() => setCustomInput(problem.testCases[0].input)}
                          className={`text-xs font-semibold ${isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}
                        >
                          Reset to example
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Mentor panel (replaces result panel when open) */}
          <MentorPanel problemId={id} isDark={isDark} isOpen={showMentor} />

          {/* Result panel */}
          {!showMentor && (
            <ResultPanel
              result={result}
              running={running}
              submitting={submitting}
              isDark={isDark}
            />
          )}
        </div>
      </div>
    </div>
  );
}