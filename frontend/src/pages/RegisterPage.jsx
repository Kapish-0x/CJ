import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const WebBackground = ({ isDark }) => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="web-reg" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 40 80 M 0 40 L 80 40" stroke="#E31B23" strokeWidth="0.5" />
        <path d="M 0 0 L 80 80 M 80 0 L 0 80" stroke="#E31B23" strokeWidth="0.3" />
        <circle cx="40" cy="40" r="1" fill="#E31B23" />
        <circle cx="0" cy="0" r="1" fill="#E31B23" />
        <circle cx="80" cy="0" r="1" fill="#E31B23" />
        <circle cx="0" cy="80" r="1" fill="#E31B23" />
        <circle cx="80" cy="80" r="1" fill="#E31B23" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#web-reg)" />
  </svg>
);

export default function RegisterPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (isDark) =>
    `w-full px-4 py-3 rounded-xl text-sm outline-none border transition-colors ${
      isDark
        ? "bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#E31B23]/60"
        : "bg-gray-50 border-gray-200 text-[#0D0D1A] placeholder-gray-400 focus:border-[#E31B23]/60"
    }`;

  const labelClass = (isDark) =>
    `block text-xs font-semibold mb-1.5 tracking-wide ${isDark ? "text-gray-400" : "text-gray-600"}`;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden ${
      isDark ? "bg-[#0D0D1A] text-white" : "bg-[#F8F8FC] text-[#0D0D1A]"
    }`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#E31B23]" />
      <WebBackground isDark={isDark} />

      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-[#E31B23] blur-[120px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative z-10 w-full max-w-md rounded-2xl border p-8 ${
          isDark ? "bg-[#13131F] border-white/8" : "bg-white border-gray-200 shadow-lg"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🕸️</div>
          <h1 className="text-2xl font-black">Join the Web</h1>
          <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Start your coding journey today
          </p>
        </div>

        {/* Error / Success */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 px-4 py-3 rounded-lg bg-[#E31B23]/10 border border-[#E31B23]/30 text-[#E31B23] text-sm"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm"
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className={labelClass(isDark)}>FULL NAME</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Peter Parker"
              className={inputClass(isDark)}
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelClass(isDark)}>EMAIL</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="peter@dailybugle.com"
              className={inputClass(isDark)}
            />
          </div>

          {/* Password */}
          <div>
            <label className={labelClass(isDark)}>PASSWORD</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Min. 6 characters"
                className={`${inputClass(isDark)} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold ${
                  isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {showPass ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className={labelClass(isDark)}>CONFIRM PASSWORD</label>
            <input
              type={showPass ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Same as above"
              className={inputClass(isDark)}
            />
          </div>

          {/* Password strength indicator */}
          {form.password.length > 0 && (
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    form.password.length >= level * 3
                      ? level <= 2 ? "bg-[#E31B23]" : level === 3 ? "bg-yellow-400" : "bg-green-400"
                      : isDark ? "bg-white/10" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full py-3 rounded-xl bg-[#E31B23] text-white font-bold text-sm tracking-wide hover:bg-[#c41520] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Creating account...
              </span>
            ) : "Create Account →"}
          </motion.button>
        </form>

        <p className={`text-center text-sm mt-6 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          Already have an account?{" "}
          <Link to="/login" className="text-[#E31B23] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}