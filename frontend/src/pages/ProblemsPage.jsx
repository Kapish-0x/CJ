// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useTheme } from "../context/ThemeContext";
// import { useAuth } from "../context/AuthContext";

// const WebBackground = ({ isDark }) => (
//   <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
//     <defs>
//       <pattern id="web-problems" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
//         <path d="M 40 0 L 40 80 M 0 40 L 80 40" stroke="#E31B23" strokeWidth="0.5" />
//         <path d="M 0 0 L 80 80 M 80 0 L 0 80" stroke="#E31B23" strokeWidth="0.3" />
//         <circle cx="40" cy="40" r="1" fill="#E31B23" />
//         <circle cx="0" cy="0" r="1" fill="#E31B23" />
//         <circle cx="80" cy="0" r="1" fill="#E31B23" />
//         <circle cx="0" cy="80" r="1" fill="#E31B23" />
//         <circle cx="80" cy="80" r="1" fill="#E31B23" />
//       </pattern>
//     </defs>
//     <rect width="100%" height="100%" fill="url(#web-problems)" />
//   </svg>
// );

// const difficultyColor = {
//   Easy: "text-green-400 bg-green-400/10 border-green-400/20",
//   Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
//   Hard: "text-[#E31B23] bg-[#E31B23]/10 border-[#E31B23]/20",
// };

// const difficultyDot = {
//   Easy: "bg-green-400",
//   Medium: "bg-yellow-400",
//   Hard: "bg-[#E31B23]",
// };

// export default function ProblemsPage() {
//   const { isDark } = useTheme();
//   const { user } = useAuth();

//   const [problems, setProblems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [difficulty, setDifficulty] = useState("All");
//   const [tag, setTag] = useState("All");

//   useEffect(() => {
//     const fetchProblems = async () => {
//       setLoading(true);
//       try {
//         const params = new URLSearchParams();
//         if (difficulty !== "All") params.set("difficulty", difficulty);
//         if (tag !== "All") params.set("tag", tag);

//         const res = await fetch(
//           `${import.meta.env.VITE_API_URL}/api/problems?${params}`,
//           { credentials: "include" }
//         );
//         if (!res.ok) throw new Error("Failed to load problems");
//         const data = await res.json();
//         setProblems(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProblems();
//   }, [difficulty, tag]);

//   // Collect all unique tags from fetched problems
//   const allTags = ["All", ...new Set(problems.flatMap((p) => p.tags || []))];

//   const filtered = problems.filter((p) =>
//     p.title.toLowerCase().includes(search.toLowerCase())
//   );

//   const solved = user?.solvedProblems || [];

//   return (
//     <div className={`min-h-screen pt-20 relative ${isDark ? "bg-[#0D0D1A] text-white" : "bg-[#F8F8FC] text-[#0D0D1A]"}`}>
//       <div className="absolute top-0 left-0 right-0 h-1 bg-[#E31B23]" />
//       <WebBackground isDark={isDark} />

//       <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mb-10"
//         >
//           <div className="flex items-center gap-2 mb-2">
//             <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23] animate-pulse" />
//             <span className="text-xs font-bold tracking-widest text-[#E31B23] uppercase">Problems</span>
//           </div>
//           <h1 className="text-3xl sm:text-4xl font-black">
//             Choose Your <span className="text-[#E31B23]">Challenge</span>
//           </h1>
//           <p className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
//             {problems.length} problems available — from warm-up to villain-level
//           </p>
//         </motion.div>

//         {/* Filters */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1, duration: 0.4 }}
//           className="flex flex-wrap gap-3 mb-6"
//         >
//           {/* Search */}
//           <div className="relative flex-1 min-w-[200px]">
//             <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//             <input
//               type="text"
//               placeholder="Search problems..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none border transition-colors ${
//                 isDark
//                   ? "bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#E31B23]/50"
//                   : "bg-white border-gray-200 text-[#0D0D1A] placeholder-gray-400 focus:border-[#E31B23]/50"
//               }`}
//             />
//           </div>

//           {/* Difficulty filter */}
//           <div className="flex gap-1.5">
//             {["All", "Easy", "Medium", "Hard"].map((d) => (
//               <button
//                 key={d}
//                 onClick={() => setDifficulty(d)}
//                 className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
//                   difficulty === d
//                     ? "bg-[#E31B23] text-white border-[#E31B23]"
//                     : isDark
//                     ? "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
//                     : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
//                 }`}
//               >
//                 {d}
//               </button>
//             ))}
//           </div>

//           {/* Tag filter */}
//           {allTags.length > 1 && (
//             <select
//               value={tag}
//               onChange={(e) => setTag(e.target.value)}
//               className={`px-3 py-2 rounded-xl text-xs font-bold border outline-none transition-colors ${
//                 isDark
//                   ? "bg-white/5 border-white/10 text-gray-300"
//                   : "bg-white border-gray-200 text-gray-600"
//               }`}
//             >
//               {allTags.map((t) => (
//                 <option key={t} value={t}>{t}</option>
//               ))}
//             </select>
//           )}
//         </motion.div>

//         {/* Stats bar */}
//         {user && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className={`mb-6 px-4 py-3 rounded-xl border flex gap-6 text-sm ${
//               isDark ? "bg-white/2 border-white/8" : "bg-white border-gray-200"
//             }`}
//           >
//             <div>
//               <span className={isDark ? "text-gray-400" : "text-gray-500"}>Solved: </span>
//               <span className="font-bold text-green-400">{solved.length}</span>
//             </div>
//             <div>
//               <span className={isDark ? "text-gray-400" : "text-gray-500"}>Total: </span>
//               <span className="font-bold">{problems.length}</span>
//             </div>
//             <div>
//               <span className={isDark ? "text-gray-400" : "text-gray-500"}>Submissions: </span>
//               <span className="font-bold text-[#E31B23]">{user.totalSubmissions || 0}</span>
//             </div>
//           </motion.div>
//         )}

//         {/* Problem List */}
//         {loading ? (
//           <div className="space-y-3">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className={`h-16 rounded-xl animate-pulse ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
//             ))}
//           </div>
//         ) : error ? (
//           <div className="text-center py-20">
//             <p className="text-[#E31B23] font-semibold">{error}</p>
//             <p className={`text-sm mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Make sure the backend is running</p>
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="text-center py-20">
//             <div className="text-4xl mb-3">🕸️</div>
//             <p className={`font-semibold ${isDark ? "text-gray-400" : "text-gray-500"}`}>No problems match your filters</p>
//           </div>
//         ) : (
//           <div className="space-y-2">
//             {filtered.map((problem, i) => {
//               const isSolved = solved.includes(problem._id);
//               return (
//                 <motion.div
//                   key={problem._id}
//                   initial={{ opacity: 0, x: -16 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: i * 0.04, duration: 0.3 }}
//                 >
//                   <Link to={`/problems/${problem._id}`}>
//                     <div className={`group flex items-center gap-4 px-5 py-4 rounded-xl border transition-all hover:border-[#E31B23]/40 ${
//                       isDark
//                         ? "bg-white/2 border-white/8 hover:bg-white/4"
//                         : "bg-white border-gray-200 hover:bg-gray-50 shadow-sm"
//                     }`}>
//                       {/* Solved indicator */}
//                       <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
//                         isSolved
//                           ? "border-green-400 bg-green-400"
//                           : isDark ? "border-white/20" : "border-gray-300"
//                       }`}>
//                         {isSolved && (
//                           <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                           </svg>
//                         )}
//                       </div>

//                       {/* Title */}
//                       <div className="flex-1 min-w-0">
//                         <span className={`font-semibold text-sm group-hover:text-[#E31B23] transition-colors ${isDark ? "text-white" : "text-[#0D0D1A]"}`}>
//                           {problem.title}
//                         </span>
//                         {problem.tags?.length > 0 && (
//                           <div className="flex gap-1.5 mt-1 flex-wrap">
//                             {problem.tags.slice(0, 3).map((t) => (
//                               <span key={t} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
//                                 isDark ? "border-white/10 text-gray-500" : "border-gray-200 text-gray-400"
//                               }`}>{t}</span>
//                             ))}
//                           </div>
//                         )}
//                       </div>

//                       {/* Difficulty */}
//                       <span className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${difficultyColor[problem.difficulty]}`}>
//                         <span className={`w-1.5 h-1.5 rounded-full ${difficultyDot[problem.difficulty]}`} />
//                         {problem.difficulty}
//                       </span>

//                       {/* Arrow */}
//                       <svg className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1 ${isDark ? "text-gray-600" : "text-gray-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                       </svg>
//                     </div>
//                   </Link>
//                 </motion.div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const StarIcon = ({ filled }) => (
  <svg className="w-4 h-4" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const WebBackground = ({ isDark }) => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="web-problems" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 40 80 M 0 40 L 80 40" stroke="#E31B23" strokeWidth="0.5" />
        <path d="M 0 0 L 80 80 M 80 0 L 0 80" stroke="#E31B23" strokeWidth="0.3" />
        <circle cx="40" cy="40" r="1" fill="#E31B23" />
        <circle cx="0" cy="0" r="1" fill="#E31B23" />
        <circle cx="80" cy="0" r="1" fill="#E31B23" />
        <circle cx="0" cy="80" r="1" fill="#E31B23" />
        <circle cx="80" cy="80" r="1" fill="#E31B23" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#web-problems)" />
  </svg>
);

const difficultyColor = {
  Easy: "text-green-400 bg-green-400/10 border-green-400/20",
  Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Hard: "text-[#E31B23] bg-[#E31B23]/10 border-[#E31B23]/20",
};

const difficultyDot = {
  Easy: "bg-green-400",
  Medium: "bg-yellow-400",
  Hard: "bg-[#E31B23]",
};

export default function ProblemsPage() {
  const { isDark } = useTheme();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [tag, setTag] = useState("All");

  const toggleStar = async (e, problemId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/star/${problemId}`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) updateUser({ starredProblems: data.starredProblems });
    } catch (_) {}
  };

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (difficulty !== "All") params.set("difficulty", difficulty);
        if (tag !== "All") params.set("tag", tag);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/problems?${params}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to load problems");
        const data = await res.json();
        setProblems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [difficulty, tag]);

  // Collect all unique tags from fetched problems
  const allTags = ["All", ...new Set(problems.flatMap((p) => p.tags || []))];

  const filtered = problems.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const solved = user?.solvedProblems || [];

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
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23] animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-[#E31B23] uppercase">Problems</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            Choose Your <span className="text-[#E31B23]">Challenge</span>
          </h1>
          <p className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {problems.length} problems available — from warm-up to villain-level
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          {/* Search */}
          <div className="relative flex-1 min-w-50">
            <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none border transition-colors ${
                isDark
                  ? "bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#E31B23]/50"
                  : "bg-white border-gray-200 text-[#0D0D1A] placeholder-gray-400 focus:border-[#E31B23]/50"
              }`}
            />
          </div>

          {/* Difficulty filter */}
          <div className="flex gap-1.5">
            {["All", "Easy", "Medium", "Hard"].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  difficulty === d
                    ? "bg-[#E31B23] text-white border-[#E31B23]"
                    : isDark
                    ? "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Tag filter */}
          {allTags.length > 1 && (
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border outline-none transition-colors ${
                isDark
                  ? "bg-white/5 border-white/10 text-gray-300"
                  : "bg-white border-gray-200 text-gray-600"
              }`}
            >
              {allTags.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}
        </motion.div>

        {/* Stats bar */}
        {user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`mb-6 px-4 py-3 rounded-xl border flex gap-6 text-sm ${
              isDark ? "bg-white/2 border-white/8" : "bg-white border-gray-200"
            }`}
          >
            <div>
              <span className={isDark ? "text-gray-400" : "text-gray-500"}>Solved: </span>
              <span className="font-bold text-green-400">{solved.length}</span>
            </div>
            <div>
              <span className={isDark ? "text-gray-400" : "text-gray-500"}>Total: </span>
              <span className="font-bold">{problems.length}</span>
            </div>
            <div>
              <span className={isDark ? "text-gray-400" : "text-gray-500"}>Submissions: </span>
              <span className="font-bold text-[#E31B23]">{user.totalSubmissions || 0}</span>
            </div>
          </motion.div>
        )}

        {/* Problem List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`h-16 rounded-xl animate-pulse ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-[#E31B23] font-semibold">{error}</p>
            <p className={`text-sm mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Make sure the backend is running</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🕸️</div>
            <p className={`font-semibold ${isDark ? "text-gray-400" : "text-gray-500"}`}>No problems match your filters</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((problem, i) => {
              const isSolved = solved.includes(problem._id);
              const isStarred = user?.starredProblems?.includes(problem._id);
              return (
                <motion.div
                  key={problem._id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <Link to={`/problems/${problem._id}`}>
                    <div className={`group flex items-center gap-4 px-5 py-4 rounded-xl border transition-all hover:border-[#E31B23]/40 ${
                      isDark
                        ? "bg-white/2 border-white/8 hover:bg-white/4"
                        : "bg-white border-gray-200 hover:bg-gray-50 shadow-sm"
                    }`}>
                      {/* Solved indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                        isSolved
                          ? "border-green-400 bg-green-400"
                          : isDark ? "border-white/20" : "border-gray-300"
                      }`}>
                        {isSolved && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>

                      {/* Title */}
                      <div className="flex-1 min-w-0">
                        <span className={`font-semibold text-sm group-hover:text-[#E31B23] transition-colors ${isDark ? "text-white" : "text-[#0D0D1A]"}`}>
                          {problem.title}
                        </span>
                        {problem.tags?.length > 0 && (
                          <div className="flex gap-1.5 mt-1 flex-wrap">
                            {problem.tags.slice(0, 3).map((t) => (
                              <span key={t} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                                isDark ? "border-white/10 text-gray-500" : "border-gray-200 text-gray-400"
                              }`}>{t}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Difficulty */}
                      <span className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${difficultyColor[problem.difficulty]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${difficultyDot[problem.difficulty]}`} />
                        {problem.difficulty}
                      </span>

                      {/* Star / Revision toggle */}
                      <button
                        onClick={(e) => toggleStar(e, problem._id)}
                        title={isStarred ? "Remove from revision list" : "Add to revision list"}
                        className={`shrink-0 p-1 rounded-lg transition-colors ${
                          isStarred
                            ? "text-yellow-400 hover:text-yellow-300"
                            : isDark
                            ? "text-gray-600 hover:text-gray-400"
                            : "text-gray-300 hover:text-gray-400"
                        }`}
                      >
                        <StarIcon filled={isStarred} />
                      </button>

                      {/* Arrow */}
                      <svg className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1 ${isDark ? "text-gray-600" : "text-gray-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}