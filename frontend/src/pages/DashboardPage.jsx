import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const WebBackground = ({ isDark }) => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="web-dash" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 40 80 M 0 40 L 80 40" stroke="#E31B23" strokeWidth="0.5" />
        <path d="M 0 0 L 80 80 M 80 0 L 0 80" stroke="#E31B23" strokeWidth="0.3" />
        <circle cx="40" cy="40" r="1" fill="#E31B23" />
        <circle cx="0" cy="0" r="1" fill="#E31B23" />
        <circle cx="80" cy="0" r="1" fill="#E31B23" />
        <circle cx="0" cy="80" r="1" fill="#E31B23" />
        <circle cx="80" cy="80" r="1" fill="#E31B23" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#web-dash)" />
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

export default function DashboardPage() {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const solved = user?.solvedProblems || [];
  const total = user?.totalSubmissions || 0;
  const acceptRate = total > 0 ? Math.round((solved.length / total) * 100) : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, sRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/problems`, { credentials: "include" }),
          fetch(`${import.meta.env.VITE_API_URL}/api/submissions/my`, { credentials: "include" }),
        ]);
        const pData = await pRes.json();
        const sData = await sRes.json();
        setProblems(Array.isArray(pData) ? pData : []);
        setSubmissions(Array.isArray(sData) ? sData : []);
      } catch (_) {}
      setLoading(false);
    };
    fetchData();
  }, []);

  // Suggest unsolved problems, easiest first
  const difficultyRank = { Easy: 0, Medium: 1, Hard: 2 };
  const recommended = problems
    .filter((p) => !solved.includes(p._id))
    .sort((a, b) => difficultyRank[a.difficulty] - difficultyRank[b.difficulty])
    .slice(0, 4);

  const recentSubmissions = submissions.slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className={`min-h-screen pt-20 relative ${isDark ? "bg-[#0D0D1A] text-white" : "bg-[#F8F8FC] text-[#0D0D1A]"}`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#E31B23]" />
      <WebBackground isDark={isDark} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#E31B23] flex items-center justify-center text-white text-lg font-black shrink-0">
            {initials}
          </div>
          <div>
            <p className={`text-sm font-semibold ${isDark ? "text-gray-400" : "text-gray-500"}`}>{greeting},</p>
            <h1 className="text-2xl sm:text-3xl font-black">
              {user?.name?.split(" ")[0]} <span className="text-[#E31B23]"></span>
            </h1>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
        >
          {[
            { label: "Solved", value: solved.length, color: "text-green-400" },
            { label: "Submissions", value: total, color: "text-[#E31B23]" },
            { label: "Accept Rate", value: `${acceptRate}%`, color: "text-blue-400"},
            { label: "Total Problems", value: problems.length, color: "text-purple-400" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border p-4 ${isDark ? "bg-white/2 border-white/8" : "bg-white border-gray-200 shadow-sm"}`}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className={`text-2xl font-black ${s.color}`}>{loading ? "—" : s.value}</div>
              <div className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="grid sm:grid-cols-3 gap-3 mb-10"
        >
          <Link to="/problems">
            <motion.div whileHover={{ y: -2 }} className={`rounded-2xl border p-5 transition-colors group ${isDark ? "bg-white/2 border-white/8 hover:border-[#E31B23]/40" : "bg-white border-gray-200 hover:border-[#E31B23]/40 shadow-sm"}`}>
              <div className="text-2xl mb-2"></div>
              <h3 className="font-bold text-sm group-hover:text-[#E31B23] transition-colors">Browse Problems</h3>
              <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Explore the full problem set</p>
            </motion.div>
          </Link>
          <Link to="/leaderboard">
            <motion.div whileHover={{ y: -2 }} className={`rounded-2xl border p-5 transition-colors group ${isDark ? "bg-white/2 border-white/8 hover:border-[#E31B23]/40" : "bg-white border-gray-200 hover:border-[#E31B23]/40 shadow-sm"}`}>
              <div className="text-2xl mb-2"></div>
              <h3 className="font-bold text-sm group-hover:text-[#E31B23] transition-colors">Leaderboard</h3>
              <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>See top coders</p>
            </motion.div>
          </Link>
          <Link to="/profile">
            <motion.div whileHover={{ y: -2 }} className={`rounded-2xl border p-5 transition-colors group ${isDark ? "bg-white/2 border-white/8 hover:border-[#E31B23]/40" : "bg-white border-gray-200 hover:border-[#E31B23]/40 shadow-sm"}`}>
              <div className="text-2xl mb-2"></div>
              <h3 className="font-bold text-sm group-hover:text-[#E31B23] transition-colors">My Profile</h3>
              <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>View stats & submissions</p>
            </motion.div>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recommended problems */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black">Pick up where you left off</h2>
              <Link to="/problems" className="text-xs font-bold text-[#E31B23] hover:underline">View all →</Link>
            </div>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`h-16 rounded-xl animate-pulse ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
                ))}
              </div>
            ) : recommended.length === 0 ? (
              <div className={`rounded-2xl border p-8 text-center ${isDark ? "bg-white/2 border-white/8" : "bg-white border-gray-200"}`}>
                <div className="text-3xl mb-2"></div>
                <p className={`text-sm font-semibold ${isDark ? "text-gray-400" : "text-gray-500"}`}>You've solved everything!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recommended.map((p) => (
                  <Link key={p._id} to={`/problems/${p._id}`}>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors hover:border-[#E31B23]/40 ${isDark ? "bg-white/2 border-white/8 hover:bg-white/4" : "bg-white border-gray-200 hover:bg-gray-50 shadow-sm"}`}>
                      <span className={`flex-1 text-sm font-semibold truncate ${isDark ? "text-white" : "text-[#0D0D1A]"}`}>{p.title}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border shrink-0 ${difficultyColor[p.difficulty]}`}>{p.difficulty}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent submissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black">Recent Activity</h2>
              <Link to="/profile" className="text-xs font-bold text-[#E31B23] hover:underline">View all →</Link>
            </div>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`h-16 rounded-xl animate-pulse ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
                ))}
              </div>
            ) : recentSubmissions.length === 0 ? (
              <div className={`rounded-2xl border p-8 text-center ${isDark ? "bg-white/2 border-white/8" : "bg-white border-gray-200"}`}>
                <div className="text-3xl mb-2">🕸️</div>
                <p className={`text-sm font-semibold mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>No submissions yet</p>
                <Link to="/problems">
                  <button className="px-4 py-2 rounded-xl bg-[#E31B23] text-white text-xs font-bold hover:bg-[#c41520] transition-colors">
                    Start Solving →
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentSubmissions.map((sub) => (
                  <div key={sub._id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${isDark ? "bg-white/2 border-white/8" : "bg-white border-gray-200 shadow-sm"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${sub.status === "Accepted" ? "bg-green-400" : sub.status === "Pending" ? "bg-gray-400" : "bg-red-400"}`} />
                    <span className={`flex-1 text-sm font-semibold truncate ${isDark ? "text-white" : "text-[#0D0D1A]"}`}>
                      {sub.problemId?.title || "Unknown"}
                    </span>
                    <span className={`text-xs font-bold shrink-0 ${statusColor[sub.status] || "text-gray-400"}`}>{sub.status}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}