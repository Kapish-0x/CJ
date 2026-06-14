import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const WebBackground = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="web-module" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 40 80 M 0 40 L 80 40" stroke="#E31B23" strokeWidth="0.5" />
        <path d="M 0 0 L 80 80 M 80 0 L 0 80" stroke="#E31B23" strokeWidth="0.3" />
        <circle cx="40" cy="40" r="1" fill="#E31B23" />
        <circle cx="0" cy="0" r="1" fill="#E31B23" />
        <circle cx="80" cy="0" r="1" fill="#E31B23" />
        <circle cx="0" cy="80" r="1" fill="#E31B23" />
        <circle cx="80" cy="80" r="1" fill="#E31B23" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#web-module)" />
  </svg>
);

export default function ModuleDetailPage() {
  const { isDark } = useTheme();
  const { slug } = useParams();

  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchModule = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/modules/${slug}`);
        if (!res.ok) throw new Error("Module not found");
        const data = await res.json();
        setModule(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchModule();
  }, [slug]);

  return (
    <div className={`min-h-screen pt-20 relative ${isDark ? "bg-[#0D0D1A] text-white" : "bg-[#F8F8FC] text-[#0D0D1A]"}`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#E31B23]" />
      <WebBackground />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        <Link to="/learn" className="text-xs font-bold text-[#E31B23] hover:underline">
          ← Back to Learning Modules
        </Link>

        {loading ? (
          <div className="mt-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`h-12 rounded-xl animate-pulse ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🕸️</div>
            <p className="text-[#E31B23] font-semibold">{error}</p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 mb-8"
            >
              <div className="text-5xl mb-3"></div>
              <h1 className="text-3xl sm:text-4xl font-black">
                {module.title}
              </h1>
              {module.summary && (
                <p className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {module.summary}
                </p>
              )}
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className={`rounded-2xl border p-6 mb-10 whitespace-pre-line leading-relaxed text-sm ${
                isDark ? "bg-white/2 border-white/8 text-gray-300" : "bg-white border-gray-200 shadow-sm text-gray-700"
              }`}
            >
              {module.content || "Content coming soon."}
            </motion.div>

            {/* Mentor video resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-lg font-black mb-4">Recommended Videos</h2>
              {module.resources?.length === 0 || !module.resources ? (
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>No videos added yet.</p>
              ) : (
                <div className="space-y-2">
                  {module.resources.map((r, i) => (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors hover:border-[#E31B23]/40 ${
                        isDark ? "bg-white/2 border-white/8 hover:bg-white/4" : "bg-white border-gray-200 hover:bg-gray-50 shadow-sm"
                      }`}
                    >
                      <span className="text-xl shrink-0">▶️</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-[#0D0D1A]"}`}>
                          {r.title}
                        </p>
                        <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{r.channel}</p>
                      </div>
                      <span className="text-xs font-bold text-[#E31B23] shrink-0">Watch →</span>
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}