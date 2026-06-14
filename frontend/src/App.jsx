import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemDetailPage from "./pages/ProblemDetailPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPanel from "./pages/AdminPanel";
import LearnPage from "./pages/LearnPage";
import ModuleDetailPage from "./pages/ModuleDetailPage";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/problems/:id" element={
          <ProtectedRoute><ProblemDetailPage /></ProtectedRoute>
        } />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/:slug" element={<ModuleDetailPage />} />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute><AdminPanel /></AdminRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}