import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const WebBackground = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="web-learn" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 40 80 M 0 40 L 80 40" stroke="#E31B23" strokeWidth="0.5" />
        <path d="M 0 0 L 80 80 M 80 0 L 0 80" stroke="#E31B23" strokeWidth="0.3" />
        <circle cx="40" cy="40" r="1" fill="#E31B23" />
        <circle cx="0" cy="0" r="1" fill="#E31B23" />
        <circle cx="80" cy="0" r="1" fill="#E31B23" />
        <circle cx="0" cy="80" r="1" fill="#E31B23" />
        <circle cx="80" cy="80" r="1" fill="#E31B23" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#web-learn)" />
  </svg>
);

export default function LearnPage() {
  const { isDark } = useTheme();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/modules`);
        if (!res.ok) throw new Error("Failed to load learning modules");
        const data = await res.json();
        setModules(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  return (
    <div className={`min-h-screen pt-20 relative ${isDark ? "bg-[#0D0D1A] text-white" : "bg-[#F8F8FC] text-[#0D0D1A]"}`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#E31B23]" />
      <WebBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="text-5xl mb-3">📘</div>
          <h1 className="text-3xl sm:text-4xl font-black">
            Learning <span className="text-[#E31B23]">Modules</span>
          </h1>
          <p className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Build your fundamentals — pick a topic to get started
          </p>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`h-32 rounded-2xl animate-pulse ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-[#E31B23] font-semibold">{error}</p>
            <p className={`text-xs mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Make sure <code className="text-[#E31B23]">GET /api/modules</code> is implemented in your backend
            </p>
          </div>
        ) : modules.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🕸️</div>
            <p className={isDark ? "text-gray-400" : "text-gray-500"}>No modules yet — check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((m, i) => (
              <motion.div
                key={m._id || m.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link to={`/learn/${m.slug}`}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className={`h-full rounded-2xl border p-6 transition-colors group ${
                      isDark
                        ? "bg-white/2 border-white/8 hover:border-[#E31B23]/40"
                        : "bg-white border-gray-200 hover:border-[#E31B23]/40 shadow-sm"
                    }`}
                  >
                    <div className="text-3xl mb-3">{m.icon || "📘"}</div>
                    <h3 className="font-bold text-base mb-1.5 group-hover:text-[#E31B23] transition-colors">
                      {m.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {m.summary}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-[#E31B23]">
                      Start learning →
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}