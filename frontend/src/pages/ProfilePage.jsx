import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Github, Linkedin, Globe } from "lucide-react";

const WebBackground = ({ isDark }) => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="web-profile" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 40 80 M 0 40 L 80 40" stroke="#E31B23" strokeWidth="0.5" />
        <path d="M 0 0 L 80 80 M 80 0 L 0 80" stroke="#E31B23" strokeWidth="0.3" />
        <circle cx="40" cy="40" r="1" fill="#E31B23" />
        <circle cx="0" cy="0" r="1" fill="#E31B23" />
        <circle cx="80" cy="0" r="1" fill="#E31B23" />
        <circle cx="0" cy="80" r="1" fill="#E31B23" />
        <circle cx="80" cy="80" r="1" fill="#E31B23" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#web-profile)" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg className="w-4 h-4" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const difficultyColor = {
  Easy: "text-green-400 bg-green-400/10 border-green-400/20",
  Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Hard: "text-[#E31B23] bg-[#E31B23]/10 border-[#E31B23]/20",
};

const statusColor = {
  Accepted: "text-green-400",
  "Wrong Answer": "text-red-400",
  "Time Limit Exceeded": "text-yellow-400",
  "Runtime Error": "text-orange-400",
  "Compilation Error": "text-purple-400",
  Pending: "text-gray-400",
};

// ── Heatmap ───────────────────────────────────────────────────────────────────
function SubmissionHeatmap({ isDark }) {
  const [heatmap, setHeatmap] = useState({});
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState(null); // { date, count, accepted, x, y }

  useEffect(() => {
    const tzOffset = new Date().getTimezoneOffset();
    fetch(`${import.meta.env.VITE_API_URL}/api/users/heatmap?tzOffset=${tzOffset}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setHeatmap(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Build a grid of the last 52 weeks (364 days) starting on the nearest past Sunday
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDay = new Date(today);
  startDay.setDate(startDay.getDate() - 363); // 364 days back
  // Rewind to the previous Sunday
  startDay.setDate(startDay.getDate() - startDay.getDay());

  // Format a Date as YYYY-MM-DD using LOCAL date parts (avoids UTC off-by-one
  // for timezones ahead of UTC, e.g. IST, where toISOString() rolls back a day)
  const toLocalKey = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const weeks = [];
  let current = new Date(startDay);
  while (current <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      if (current <= today) {
        const key = toLocalKey(current);
        week.push({ date: key, ...(heatmap[key] || { count: 0, accepted: 0 }) });
      } else {
        week.push(null);
      }
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  const cellColor = (count, accepted) => {
    if (count === 0) return isDark ? "bg-white/5" : "bg-gray-100";
    if (accepted > 0) {
      if (count >= 5) return "bg-green-400";
      if (count >= 3) return "bg-green-500/80";
      if (count >= 2) return "bg-green-600/70";
      return "bg-green-700/60";
    }
    // submissions but no accepted
    if (count >= 4) return "bg-[#E31B23]/80";
    if (count >= 2) return "bg-[#E31B23]/50";
    return "bg-[#E31B23]/25";
  };

  const monthLabels = [];
  weeks.forEach((week, wi) => {
    const firstDay = week.find(Boolean);
    if (firstDay) {
      const d = new Date(firstDay.date);
      if (d.getDate() <= 7) {
        monthLabels.push({ wi, label: d.toLocaleString("default", { month: "short" }) });
      }
    }
  });

  if (loading) {
    return (
      <div className={`h-28 rounded-xl animate-pulse ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
    );
  }

  const totalSubmissions = Object.values(heatmap).reduce((s, v) => s + v.count, 0);
  const totalAccepted = Object.values(heatmap).reduce((s, v) => s + v.accepted, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-black">Submission Activity</h2>
        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          {totalSubmissions} submissions · {totalAccepted} accepted (past year)
        </span>
      </div>

      <div className={`rounded-2xl border p-4 overflow-x-auto ${isDark ? "bg-[#13131F] border-white/8" : "bg-white border-gray-200 shadow-sm"}`}>
        {/* Month labels */}
        <div className="flex gap-0.75 mb-1 pl-0">
          {weeks.map((_, wi) => {
            const label = monthLabels.find((m) => m.wi === wi);
            return (
              <div key={wi} className="w-2.5 shrink-0">
                {label ? (
                  <span className={`text-[9px] font-semibold ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    {label.label}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Grid: 7 rows (days) × N cols (weeks) */}
        <div className="flex gap-0.75">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.75">
              {week.map((day, di) =>
                day ? (
                  <div
                    key={di}
                    className={`w-2.5 h-2.5 rounded-xs cursor-pointer transition-opacity hover:opacity-80 ${cellColor(day.count, day.accepted)}`}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({ ...day, x: rect.left, y: rect.top });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ) : (
                  <div key={di} className="w-2.5 h-2.5" />
                )
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3">
          <span className={`text-[9px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <div
              key={l}
              className={`w-2.5 h-2.5 rounded-2.5 ${
                l === 0
                  ? isDark ? "bg-white/5" : "bg-gray-100"
                  : l === 1 ? "bg-green-700/60"
                  : l === 2 ? "bg-green-600/70"
                  : l === 3 ? "bg-green-500/80"
                  : "bg-green-400"
              }`}
            />
          ))}
          <span className={`text-[9px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>More</span>
        </div>
      </div>

      {/* Tooltip rendered via fixed position */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", left: tooltip.x - 60, top: tooltip.y - 56, zIndex: 50 }}
            className={`px-3 py-2 rounded-lg text-xs pointer-events-none shadow-lg border ${
              isDark ? "bg-[#1A1A2E] border-white/10 text-white" : "bg-white border-gray-200 text-gray-700"
            }`}
          >
            <p className="font-bold">{tooltip.date}</p>
            <p>{tooltip.count} submission{tooltip.count !== 1 ? "s" : ""}</p>
            {tooltip.accepted > 0 && <p className="text-green-400">{tooltip.accepted} accepted</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Social Links Editor ───────────────────────────────────────────────────────
const SOCIAL_FIELDS = [
  { key: "github",   label: "GitHub",   placeholder: "https://github.com/yourname",   icon: Github },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourname", icon: Linkedin },
  { key: "website",  label: "Website",  placeholder: "https://yoursite.com",           icon: Globe },
];

function SocialLinksEditor({ isDark, user, updateUser }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    github: user?.socialLinks?.github || "",
    linkedin: user?.socialLinks?.linkedin || "",
    website: user?.socialLinks?.website || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        updateUser({ socialLinks: data.socialLinks });
        setSaved(true);
        setEditing(false);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (_) {}
    setSaving(false);
  };

  const hasAnyLink = SOCIAL_FIELDS.some((f) => user?.socialLinks?.[f.key]);

  return (
    <div className={`rounded-2xl border p-6 mb-6 ${isDark ? "bg-[#13131F] border-white/8" : "bg-white border-gray-200 shadow-sm"}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-sm uppercase tracking-wide text-[#E31B23]">Social Links</h3>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-colors ${
              isDark ? "border-white/10 text-gray-400 hover:text-white hover:border-white/20" : "border-gray-200 text-gray-500 hover:text-gray-700"
            }`}
          >
            {hasAnyLink ? "Edit" : "+ Add Links"}
          </button>
        )}
        {saved && <span className="text-xs font-semibold text-green-400">✓ Saved</span>}
      </div>

      {editing ? (
        <div className="space-y-3">
          {SOCIAL_FIELDS.map(({ key, label, placeholder, icon }) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-base w-6 shrink-0">{icon}</span>
              <input
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className={`flex-1 px-3 py-2 rounded-xl text-xs border outline-none transition-colors ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#E31B23]/50"
                    : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#E31B23]/50"
                }`}
              />
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 rounded-xl bg-[#E31B23] text-white text-xs font-bold hover:bg-[#c41520] transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                isDark ? "border-white/10 text-gray-400 hover:text-white" : "border-gray-200 text-gray-500"
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : hasAnyLink ? (
        <div className="flex flex-wrap gap-3">
          {SOCIAL_FIELDS.map(({ key, label, icon }) =>
            user?.socialLinks?.[key] ? (
              <a
                key={key}
                href={user.socialLinks[key]}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                  isDark
                    ? "border-white/10 text-gray-300 hover:border-[#E31B23]/40 hover:text-white"
                    : "border-gray-200 text-gray-600 hover:border-[#E31B23]/40 hover:text-gray-900"
                }`}
              >
                <span>{icon}</span> {label}
              </a>
            ) : null
          )}
        </div>
      ) : (
        <p className={`text-xs ${isDark ? "text-gray-600" : "text-gray-400"}`}>
          No social links added yet.
        </p>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { isDark } = useTheme();
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [subLoading, setSubLoading] = useState(true);

  const [starred, setStarred] = useState([]);
  const [starredLoading, setStarredLoading] = useState(true);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const solved = user?.solvedProblems?.length || 0;
  const total = user?.totalSubmissions || 0;
  const acceptRate = total > 0 ? Math.round((solved / total) * 100) : 0;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/submissions/my`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setSubmissions(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setSubLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users/starred`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setStarred(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setStarredLoading(false));
  }, []);

  const handleUnstar = async (problemId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/star/${problemId}`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        updateUser({ starredProblems: data.starredProblems });
        setStarred((prev) => prev.filter((p) => p._id !== problemId));
      }
    } catch (_) {}
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className={`min-h-screen pt-20 relative ${isDark ? "bg-[#0D0D1A] text-white" : "bg-[#F8F8FC] text-[#0D0D1A]"}`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#E31B23]" />
      <WebBackground isDark={isDark} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">

        {/* ── Profile card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl border p-8 mb-6 ${isDark ? "bg-[#13131F] border-white/8" : "bg-white border-gray-200 shadow-sm"}`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-[#E31B23] flex items-center justify-center text-white text-2xl font-black shrink-0">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black">{user?.name}</h1>
                {user?.role === "admin" && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#E31B23]/20 text-[#E31B23] uppercase tracking-wide">Admin</span>
                )}
              </div>
              <p className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{user?.email}</p>
              <p className={`text-xs mt-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "—"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                isDark ? "border-white/10 text-gray-400 hover:border-red-500/40 hover:text-red-400" : "border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-3 gap-4 mt-6 pt-6 border-t ${isDark ? "border-white/8" : "border-gray-100"}`}>
            {[
              { label: "Solved", value: solved, color: "text-green-400" },
              { label: "Submissions", value: total, color: "text-[#E31B23]" },
              { label: "Accept Rate", value: `${acceptRate}%`, color: "text-blue-400" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                <div className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── #3 Social links ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.5 }}>
          <SocialLinksEditor isDark={isDark} user={user} updateUser={updateUser} />
        </motion.div>

        {/* ── #3 Heatmap ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.5 }} className="mb-10">
          <SubmissionHeatmap isDark={isDark} />
        </motion.div>

        {/* ── #2 Revision List ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400"><StarIcon filled /></span>
            <h2 className="text-lg font-black">Revision List</h2>
          </div>

          {starredLoading ? (
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className={`h-14 rounded-xl animate-pulse ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
              ))}
            </div>
          ) : starred.length === 0 ? (
            <div className={`rounded-2xl border p-6 text-center ${isDark ? "bg-white/2 border-white/8" : "bg-white border-gray-200"}`}>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Star problems you want to revisit and they'll appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {starred.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border ${isDark ? "bg-white/2 border-white/8" : "bg-white border-gray-200 shadow-sm"}`}
                >
                  <Link to={`/problems/${p._id}`} className="flex-1 min-w-0">
                    <span className={`text-sm font-semibold hover:text-[#E31B23] transition-colors truncate block ${isDark ? "text-white" : "text-[#0D0D1A]"}`}>
                      {p.title}
                    </span>
                  </Link>
                  <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-lg border ${difficultyColor[p.difficulty]}`}>
                    {p.difficulty}
                  </span>
                  <button
                    onClick={() => handleUnstar(p._id)}
                    title="Remove from revision list"
                    className="shrink-0 p-1 rounded-lg text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    <StarIcon filled />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Recent Submissions ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-lg font-black mb-4">Recent Submissions</h2>

          {subLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-14 rounded-xl animate-pulse ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div className={`rounded-2xl border p-10 text-center ${isDark ? "bg-white/2 border-white/8" : "bg-white border-gray-200"}`}>
              <div className="text-4xl mb-3">🕸️</div>
              <p className={`font-semibold mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>No submissions yet</p>
              <Link to="/problems">
                <button className="px-5 py-2 rounded-xl bg-[#E31B23] text-white text-sm font-bold hover:bg-[#c41520] transition-colors">
                  Start Solving →
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {submissions.map((sub, i) => (
                <motion.div
                  key={sub._id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className={`flex items-center gap-4 px-5 py-3.5 rounded-xl border ${isDark ? "bg-white/2 border-white/8" : "bg-white border-gray-200 shadow-sm"}`}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${sub.status === "Accepted" ? "bg-green-400" : sub.status === "Pending" ? "bg-gray-400" : "bg-red-400"}`} />
                  <div className="flex-1 min-w-0">
                    <Link to={`/problems/${sub.problemId?._id || sub.problemId}`}>
                      <span className={`text-sm font-semibold hover:text-[#E31B23] transition-colors truncate block ${isDark ? "text-white" : "text-[#0D0D1A]"}`}>
                        {sub.problemId?.title || "Unknown Problem"}
                      </span>
                    </Link>
                    <p className={`text-xs ${isDark ? "text-gray-600" : "text-gray-400"}`}>{new Date(sub.createdAt).toLocaleString()}</p>
                  </div>
                  {sub.problemId?.difficulty && (
                    <span className={`hidden sm:inline-flex text-xs font-bold px-2 py-0.5 rounded-lg border shrink-0 ${difficultyColor[sub.problemId.difficulty]}`}>
                      {sub.problemId.difficulty}
                    </span>
                  )}
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-bold ${statusColor[sub.status] || "text-gray-400"}`}>{sub.status}</span>
                    <p className={`text-[10px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                      {sub.language?.toUpperCase()} · {sub.executionTime}ms
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}