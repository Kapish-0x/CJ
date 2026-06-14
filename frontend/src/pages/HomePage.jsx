import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// Animated web strand SVG background
const WebBackground = ({ isDark }) => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="web" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 40 80 M 0 40 L 80 40" stroke={isDark ? "#E31B23" : "#E31B23"} strokeWidth="0.5" />
        <path d="M 0 0 L 80 80 M 80 0 L 0 80" stroke={isDark ? "#E31B23" : "#E31B23"} strokeWidth="0.3" />
        <circle cx="40" cy="40" r="1" fill="#E31B23" />
        <circle cx="0" cy="0" r="1" fill="#E31B23" />
        <circle cx="80" cy="0" r="1" fill="#E31B23" />
        <circle cx="0" cy="80" r="1" fill="#E31B23" />
        <circle cx="80" cy="80" r="1" fill="#E31B23" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#web)" />
  </svg>
);

const features = [
  {
    icon: "⚡",
    title: "Real-Time Execution",
    desc: "Submit code in Python, JavaScript, Java, C++ and get instant results with test case validation.",
  },
  {
    icon: "🕸️",
    title: "Curated Challenges",
    desc: "Problems ranging from Easy to Hard — each with clear descriptions, constraints, and hidden test cases.",
  },
  {
    icon: "🏆",
    title: "Leaderboard",
    desc: "Compete with others. Track your acceptance rate, solve count, and climb the rankings.",
  },
  {
    icon: "🔐",
    title: "Secure Sandbox",
    desc: "All code runs in an isolated environment. Safe, fair, and consistent for everyone.",
  },
];

const stats = [
  { value: "5+", label: "Languages" },
  { value: "100+", label: "Problems" },
  { value: "Fast", label: "Execution" },
  { value: "Free", label: "Forever" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function HomePage() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#0D0D1A] text-white" : "bg-[#F8F8FC] text-[#0D0D1A]"}`}>
      
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 overflow-hidden">
        <WebBackground isDark={isDark} />

        {/* Red top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#E31B23]" />

        {/* Floating red orb */}
        <motion.div
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-1/4 w-64 h-64 rounded-full bg-[#E31B23] blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 14, 0], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-32 left-1/4 w-48 h-48 rounded-full bg-[#1A1A6E] blur-[80px] pointer-events-none"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-4xl"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E31B23]/30 bg-[#E31B23]/10 text-[#E31B23] text-xs font-bold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23] animate-pulse" />
            With Great Code Comes Great Responsibility
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-7xl font-black leading-[1.05] tracking-tight mb-6"
          >
            Code Like
            <br />
            <span className="text-[#E31B23] relative">
              Pro
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-[#E31B23] origin-left rounded-full"
              />
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className={`text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Solve algorithmic challenges, run code in real-time, and swing to the top of the leaderboard. Your friendly neighbourhood code judge.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-xl bg-[#E31B23] text-white font-bold text-base tracking-wide shadow-lg shadow-red-900/30 hover:bg-[#c41520] transition-colors"
              >
                Start Solving →
              </motion.button>
            </Link>
            <Link to="/problems">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`px-8 py-3.5 rounded-xl font-bold text-base border transition-colors ${
                  isDark
                    ? "border-white/20 text-white hover:bg-white/10"
                    : "border-gray-300 text-[#0D0D1A] hover:bg-gray-100"
                }`}
              >
                Browse Problems
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-[#E31B23]/40 flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-[#E31B23]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className={`py-12 border-y ${isDark ? "border-white/5 bg-white/2" : "border-gray-200 bg-white"}`}>
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="text-3xl font-black text-[#E31B23]">{s.value}</div>
              <div className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Everything You Need to <span className="text-[#E31B23]">Level Up</span>
          </h2>
          <p className={`text-base max-w-xl mx-auto ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Built for competitive programmers, interview preppers, and curious coders alike.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className={`rounded-2xl p-6 border transition-colors group ${
                isDark
                  ? "bg-white/3 border-white/8 hover:border-[#E31B23]/40"
                  : "bg-white border-gray-200 hover:border-[#E31B23]/40 shadow-sm"
              }`}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-base mb-2 group-hover:text-[#E31B23] transition-colors">{f.title}</h3>
              <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 relative overflow-hidden">
        <WebBackground isDark={isDark} />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`rounded-3xl p-10 border ${
              isDark ? "bg-[#E31B23]/10 border-[#E31B23]/20" : "bg-[#E31B23]/5 border-[#E31B23]/20"
            }`}
          >
            <div className="text-5xl mb-4">🕷️</div>
            <h2 className="text-3xl font-black mb-3">Ready to Swing?</h2>
            <p className={`mb-8 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Join CodeJudge and start solving problems today. No credit card. No BS.
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-xl bg-[#E31B23] text-white font-bold tracking-wide hover:bg-[#c41520] transition-colors"
              >
                Create Free Account
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={`py-8 text-center text-xs border-t ${
        isDark ? "border-white/5 text-gray-600" : "border-gray-200 text-gray-400"
      }`}>
        <span>© 2025 CodeJudge</span>
      </footer>
    </div>
  );
}