import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const WebIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" stroke="#E31B23" strokeWidth="2" />
    <path d="M16 2 C16 2 10 10 10 16 C10 22 16 30 16 30" stroke="#E31B23" strokeWidth="1.5" />
    <path d="M16 2 C16 2 22 10 22 16 C22 22 16 30 16 30" stroke="#E31B23" strokeWidth="1.5" />
    <path d="M2 16 C2 16 10 12 16 12 C22 12 30 16 30 16" stroke="#E31B23" strokeWidth="1.5" />
    <path d="M3 10 C3 10 10 14 16 14 C22 14 29 10 29 10" stroke="#E31B23" strokeWidth="1" opacity="0.6" />
    <path d="M3 22 C3 22 10 18 16 18 C22 18 29 22 29 22" stroke="#E31B23" strokeWidth="1" opacity="0.6" />
    <circle cx="16" cy="16" r="2.5" fill="#E31B23" />
  </svg>
);

export default function Navbar() {
  const { isDark, setIsDark } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    ...(user ? [{ to: "/dashboard", label: "Dashboard" }] : []),
    { to: "/problems", label: "Problems" },
    { to: "/learn", label: "Learn" },
    { to: "/leaderboard", label: "Leaderboard" },
  ];

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 border-b ${
        isDark
          ? "bg-[#0D0D1A]/90 border-[#E31B23]/20 text-white"
          : "bg-white/90 border-red-200 text-[#0D0D1A]"
      } backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div whileHover={{ rotate: 20 }} transition={{ type: "spring", stiffness: 300 }}>
            <WebIcon />
          </motion.div>
          <span className="text-xl font-black tracking-tight">
            Code<span className="text-[#E31B23]">Judge</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-semibold tracking-wide transition-colors relative group ${
                location.pathname === link.to
                  ? "text-[#E31B23]"
                  : isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-[#0D0D1A]"
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#E31B23] transition-all duration-300 ${
                location.pathname === link.to ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? "bg-white/10 hover:bg-white/20" : "bg-black/5 hover:bg-black/10"
            }`}
          >
            {isDark ? (
              <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-[#1A1A2E]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </motion.button>

          {user ? (
            /* Logged-in: avatar + dropdown */
            <div className="hidden md:block relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors group"
                style={{
                  borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                }}
              >
                <div className="w-7 h-7 rounded-full bg-[#E31B23] flex items-center justify-center text-white text-xs font-black">
                  {initials}
                </div>
                <span className={`text-sm font-semibold max-w-22.5 truncate ${isDark ? "text-white" : "text-[#0D0D1A]"}`}>
                  {user.name}
                </span>
                <svg className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""} ${isDark ? "text-gray-400" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 mt-2 w-48 rounded-xl border shadow-xl overflow-hidden ${
                      isDark ? "bg-[#13131F] border-white/10" : "bg-white border-gray-200"
                    }`}
                  >
                    <div className={`px-4 py-3 border-b ${isDark ? "border-white/8" : "border-gray-100"}`}>
                      <p className={`text-xs font-semibold truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {user.email}
                      </p>
                      {user.role === "admin" && (
                        <span className="mt-1 inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E31B23]/20 text-[#E31B23] uppercase tracking-wide">
                          Admin
                        </span>
                      )}
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                        isDark ? "text-gray-300 hover:bg-white/5 hover:text-white" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      My Profile
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                          isDark ? "text-gray-300 hover:bg-white/5 hover:text-white" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.397-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a7.48 7.48 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors text-left ${
                        isDark ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Logged-out: login + register */
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-lg border transition-colors ${
                    isDark ? "border-white/20 text-white hover:bg-white/10" : "border-gray-300 text-[#0D0D1A] hover:bg-gray-100"
                  }`}
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-4 py-1.5 text-sm font-bold rounded-lg bg-[#E31B23] text-white hover:bg-[#c41520] transition-colors"
                >
                  Register
                </motion.button>
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 h-0.5 bg-current mb-1" />
            <div className="w-5 h-0.5 bg-current mb-1" />
            <div className="w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`md:hidden px-4 pb-4 flex flex-col gap-3 ${isDark ? "bg-[#0D0D1A]" : "bg-white"}`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-semibold py-2 border-b ${
                  isDark ? "border-white/10 text-gray-300" : "border-gray-100 text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  <button className={`w-full py-2 rounded-lg border text-sm font-semibold ${
                    isDark ? "border-white/20 text-white" : "border-gray-300 text-[#0D0D1A]"
                  }`}>My Profile</button>
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full py-2 rounded-lg bg-[#E31B23] text-white text-sm font-bold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link to="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                  <button className={`w-full py-2 rounded-lg border text-sm font-semibold ${
                    isDark ? "border-white/20 text-white" : "border-gray-300 text-[#0D0D1A]"
                  }`}>Login</button>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setMenuOpen(false)}>
                  <button className="w-full py-2 rounded-lg bg-[#E31B23] text-white text-sm font-bold">Register</button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}