import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const WebBackground = ({ isDark }) => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="web-admin" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 40 80 M 0 40 L 80 40" stroke="#E31B23" strokeWidth="0.5" />
        <path d="M 0 0 L 80 80 M 80 0 L 0 80" stroke="#E31B23" strokeWidth="0.3" />
        <circle cx="40" cy="40" r="1" fill="#E31B23" />
        <circle cx="0" cy="0" r="1" fill="#E31B23" />
        <circle cx="80" cy="0" r="1" fill="#E31B23" />
        <circle cx="0" cy="80" r="1" fill="#E31B23" />
        <circle cx="80" cy="80" r="1" fill="#E31B23" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#web-admin)" />
  </svg>
);

const difficultyColor = {
  Easy: "text-green-400 bg-green-400/10 border-green-400/20",
  Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Hard: "text-[#E31B23] bg-[#E31B23]/10 border-[#E31B23]/20",
};

const emptyForm = {
  title: "",
  description: "",
  difficulty: "Easy",
  timeLimit: 2000,
  memoryLimit: 256,
  tags: "",
  boilerplate: "",
  testCases: [{ input: "", expectedOutput: "" }],
};

export default function AdminPanel() {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/problems`, {
        credentials: "include",
      });
      const data = await res.json();
      setProblems(data);
    } catch (err) {
      setError("Failed to load problems");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchProblems();
  }, [user]);

  // Redirect non-admins
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (problem) => {
    setForm({
      title: problem.title || "",
      description: problem.description || "",
      difficulty: problem.difficulty || "Easy",
      timeLimit: problem.timeLimit || 2000,
      memoryLimit: problem.memoryLimit || 256,
      tags: (problem.tags || []).join(", "),
      boilerplate: problem.boilerplate || "",
      testCases: problem.testCases?.length ? problem.testCases : [{ input: "", expectedOutput: "" }],
    });
    setEditingId(problem._id);
    setShowForm(true);
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...form.testCases];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, testCases: updated });
  };

  const addTestCase = () => {
    setForm({ ...form, testCases: [...form.testCases, { input: "", expectedOutput: "" }] });
  };

  const removeTestCase = (index) => {
    if (form.testCases.length === 1) return;
    setForm({ ...form, testCases: form.testCases.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      difficulty: form.difficulty,
      timeLimit: Number(form.timeLimit),
      memoryLimit: Number(form.memoryLimit),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      boilerplate: form.boilerplate,
      testCases: form.testCases.filter((tc) => tc.input.trim() && tc.expectedOutput.trim()),
    };

    if (!payload.title || !payload.description) {
      setError("Title and description are required");
      setSaving(false);
      return;
    }
    if (payload.testCases.length === 0) {
      setError("At least one valid test case is required");
      setSaving(false);
      return;
    }

    try {
      const url = editingId
        ? `${import.meta.env.VITE_API_URL}/api/problems/${editingId}`
        : `${import.meta.env.VITE_API_URL}/api/problems`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save problem");

      setSuccess(editingId ? "Problem updated!" : "Problem created!");
      resetForm();
      fetchProblems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/problems/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setProblems((prev) => prev.filter((p) => p._id !== id));
      setSuccess("Problem deleted");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const inputClass = `w-full px-3 py-2 rounded-lg text-sm outline-none border transition-colors ${
    isDark
      ? "bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#E31B23]/50"
      : "bg-white border-gray-200 text-[#0D0D1A] placeholder-gray-400 focus:border-[#E31B23]/50"
  }`;
  const labelClass = `block text-xs font-bold mb-1 tracking-wide uppercase ${isDark ? "text-gray-400" : "text-gray-500"}`;

  return (
    <div className={`min-h-screen pt-20 relative ${isDark ? "bg-[#0D0D1A] text-white" : "bg-[#F8F8FC] text-[#0D0D1A]"}`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#E31B23]" />
      <WebBackground isDark={isDark} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23] animate-pulse" />
              <span className="text-xs font-bold tracking-widest text-[#E31B23] uppercase">Admin Panel</span>
            </div>
            <h1 className="text-3xl font-black">Manage Problems</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={openCreate}
            className="px-5 py-2.5 rounded-xl bg-[#E31B23] text-white text-sm font-bold hover:bg-[#c41520] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Problem
          </motion.button>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 px-4 py-3 rounded-lg bg-[#E31B23]/10 border border-[#E31B23]/30 text-[#E31B23] text-sm font-semibold"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-semibold"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <form
                onSubmit={handleSubmit}
                className={`rounded-2xl border p-6 space-y-4 ${isDark ? "bg-[#13131F] border-white/8" : "bg-white border-gray-200 shadow-sm"}`}
              >
                <h2 className="text-lg font-black mb-2">
                  {editingId ? "Edit Problem" : "Create New Problem"} 🕷️
                </h2>

                {/* Title */}
                <div>
                  <label className={labelClass}>Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Two Sum"
                    className={inputClass}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Problem statement, input/output format, examples..."
                    rows={5}
                    className={`${inputClass} font-mono resize-y`}
                    required
                  />
                </div>

                {/* Difficulty / Time / Memory */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Difficulty</label>
                    <select
                      value={form.difficulty}
                      onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                      className={inputClass}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Time Limit (ms)</label>
                    <input
                      type="number"
                      value={form.timeLimit}
                      onChange={(e) => setForm({ ...form, timeLimit: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Memory Limit (MB)</label>
                    <input
                      type="number"
                      value={form.memoryLimit}
                      onChange={(e) => setForm({ ...form, memoryLimit: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className={labelClass}>Tags (comma separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="Array, Hash Table, Dynamic Programming"
                    className={inputClass}
                  />
                </div>

                {/* Boilerplate */}
                <div>
                  <label className={labelClass}>Boilerplate (optional)</label>
                  <textarea
                    value={form.boilerplate}
                    onChange={(e) => setForm({ ...form, boilerplate: e.target.value })}
                    placeholder="Starter code shown to the user (optional)"
                    rows={3}
                    className={`${inputClass} font-mono resize-y`}
                  />
                </div>

                {/* Test Cases */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass}>Test Cases</label>
                    <button
                      type="button"
                      onClick={addTestCase}
                      className={`text-xs font-bold flex items-center gap-1 ${isDark ? "text-[#E31B23]" : "text-[#E31B23]"}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Test Case
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.testCases.map((tc, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border grid grid-cols-2 gap-3 ${isDark ? "border-white/8 bg-white/2" : "border-gray-100 bg-gray-50"}`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-bold uppercase ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                              Input #{i + 1}
                            </span>
                            {form.testCases.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTestCase(i)}
                                className="text-[10px] font-bold text-[#E31B23]"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <textarea
                            value={tc.input}
                            onChange={(e) => handleTestCaseChange(i, "input", e.target.value)}
                            rows={2}
                            className={`${inputClass} font-mono text-xs resize-y`}
                            placeholder="stdin input"
                          />
                        </div>
                        <div>
                          <span className={`text-[10px] font-bold uppercase block mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                            Expected Output #{i + 1}
                          </span>
                          <textarea
                            value={tc.expectedOutput}
                            onChange={(e) => handleTestCaseChange(i, "expectedOutput", e.target.value)}
                            rows={2}
                            className={`${inputClass} font-mono text-xs resize-y`}
                            placeholder="expected stdout"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={{ scale: saving ? 1 : 1.02 }}
                    whileTap={{ scale: saving ? 1 : 0.98 }}
                    className="px-6 py-2.5 rounded-xl bg-[#E31B23] text-white text-sm font-bold hover:bg-[#c41520] transition-colors disabled:opacity-60"
                  >
                    {saving ? "Saving..." : editingId ? "Update Problem" : "Create Problem"}
                  </motion.button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className={`px-6 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                      isDark ? "border-white/10 text-gray-400 hover:text-white" : "border-gray-200 text-gray-500 hover:text-black"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Problems list */}
        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`h-16 rounded-xl animate-pulse ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {problems.map((p) => (
              <div
                key={p._id}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-xl border ${isDark ? "bg-white/2 border-white/8" : "bg-white border-gray-200 shadow-sm"}`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-[#0D0D1A]"}`}>{p.title}</p>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    {p.tags?.join(", ") || "No tags"}
                  </p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border shrink-0 ${difficultyColor[p.difficulty]}`}>
                  {p.difficulty}
                </span>
                <button
                  onClick={() => openEdit(p)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors shrink-0 ${
                    isDark ? "border-white/10 text-gray-300 hover:border-white/30" : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  disabled={deletingId === p._id}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg border border-[#E31B23]/30 text-[#E31B23] hover:bg-[#E31B23]/10 transition-colors shrink-0 disabled:opacity-50"
                >
                  {deletingId === p._id ? "..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}