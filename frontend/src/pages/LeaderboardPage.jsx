import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const WebBackground = ({ isDark }) => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="web-lb" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 40 80 M 0 40 L 80 40" stroke="#E31B23" strokeWidth="0.5" />
        <path d="M 0 0 L 80 80 M 80 0 L 0 80" stroke="#E31B23" strokeWidth="0.3" />
        <circle cx="40" cy="40" r="1" fill="#E31B23" />
        <circle cx="0" cy="0" r="1" fill="#E31B23" />
        <circle cx="80" cy="0" r="1" fill="#E31B23" />
        <circle cx="0" cy="80" r="1" fill="#E31B23" />
        <circle cx="80" cy="80" r="1" fill="#E31B23" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#web-lb)" />
  </svg>
);

const RANK_STYLES = [
  { bg: "bg-yellow-400/10 border-yellow-400/30", text: "text-yellow-400", medal: "🥇" },
  { bg: "bg-gray-300/10 border-gray-300/30", text: "text-gray-300", medal: "🥈" },
  { bg: "bg-orange-400/10 border-orange-400/30", text: "text-orange-400", medal: "🥉" },
];

export default function LeaderboardPage() {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch all users via problems endpoint workaround — use the users leaderboard endpoint
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/leaderboard`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load leaderboard");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className={`min-h-screen pt-20 relative ${isDark ? "bg-[#0D0D1A] text-white" : "bg-[#F8F8FC] text-[#0D0D1A]"}`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#E31B23]" />
      <WebBackground isDark={isDark} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl sm:text-4xl font-black">
            Hall of <span className="text-[#E31B23]">Heroes</span>
          </h1>
          <p className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Top coders in the Spider-Verse
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`h-16 rounded-xl animate-pulse ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-[#E31B23] font-semibold">{error}</p>
            <p className={`text-xs mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Make sure <code className="text-[#E31B23]">GET /api/users/leaderboard</code> is implemented in your backend
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🕸️</div>
            <p className={isDark ? "text-gray-400" : "text-gray-500"}>No heroes yet — be the first!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((u, i) => {
              const rankStyle = RANK_STYLES[i] || null;
              const isMe = user && u._id === user._id;
              const initials = u.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
              const solvedCount = u.solvedProblems?.length || 0;
              const acceptRate = u.totalSubmissions > 0
                ? Math.round((solvedCount / u.totalSubmissions) * 100)
                : 0;

              return (
                <motion.div
                  key={u._id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all ${
                    isMe
                      ? "border-[#E31B23]/40 bg-[#E31B23]/5"
                      : rankStyle
                      ? `${rankStyle.bg} border`
                      : isDark
                      ? "bg-white/2 border-white/8"
                      : "bg-white border-gray-200 shadow-sm"
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 text-center shrink-0">
                    {i < 3 ? (
                      <span className="text-xl">{rankStyle.medal}</span>
                    ) : (
                      <span className={`text-sm font-black ${isDark ? "text-gray-500" : "text-gray-400"}`}>#{i + 1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-black ${
                    isMe ? "bg-[#E31B23]" : "bg-linear-to-br from-[#E31B23] to-[#7B2D8B]"
                  }`}>
                    {initials}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm truncate ${isDark ? "text-white" : "text-[#0D0D1A]"}`}>
                        {u.name}
                      </span>
                      {isMe && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E31B23]/20 text-[#E31B23] uppercase tracking-wide shrink-0">
                          You
                        </span>
                      )}
                    </div>
                    <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      {u.totalSubmissions || 0} submissions · {acceptRate}% accept rate
                    </p>
                  </div>

                  {/* Solved count */}
                  <div className="text-right shrink-0">
                    <div className={`text-lg font-black ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-orange-400" : "text-[#E31B23]"}`}>
                      {solvedCount}
                    </div>
                    <div className={`text-[10px] font-semibold ${isDark ? "text-gray-500" : "text-gray-400"}`}>solved</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}