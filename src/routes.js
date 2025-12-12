import React from "react";
import { Navigate } from "react-router-dom";

// Admin Pages
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminPanel from "./pages/Admin/AdminPanel";


// Public Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import GoogleRedirect from "./pages/Auth/GoogleRedirect";

// Student Pages
import Dashboard from "./pages/Student/Dashboard";
import Profile from "./pages/Student/Profile";
import AcademicInfo from "./pages/Student/AcademicInfo";
import Essays from "./pages/Student/Essays";
import Documents from "./pages/Student/Documents";
import Applications from "./pages/Student/Applications";
import UniversityBrowse from "./pages/Student/UniversityBrowse";

// Error Pages
import NotFound from "./pages/Error/NotFound";

// Route Protection
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtected from "./components/AdminProtected";

// helper wrapper so code stays clean
const withAuth = (component) => <ProtectedRoute>{component}</ProtectedRoute>;
const withAdmin = (component) => <AdminProtected>{component}</AdminProtected>;

const routes = [
  // Public
  { path: "/", element: <Home /> },
  { path: "/auth/login", element: <Login /> },
  { path: "/auth/signup", element: <Signup /> },
  { path: "/auth/google-redirect", element: <GoogleRedirect /> },
  { path: "/auth/callback", element: <GoogleRedirect /> },

  // Student Protected Routes
  { path: "/student/dashboard", element: withAuth(<Dashboard />) },
  { path: "/student/profile", element: withAuth(<Profile />) },
  { path: "/student/academic-info", element: withAuth(<AcademicInfo />) },
  { path: "/student/essays", element: withAuth(<Essays />) },
  { path: "/student/essays/:applicationId", element: withAuth(<Essays />) },
  { path: "/student/documents", element: withAuth(<Documents />) },
  { path: "/student/applications", element: withAuth(<Applications />) },
  { path: "/student/universities", element: withAuth(<UniversityBrowse />) },

  // Admin Protected
  // Admin
  { path: "/admin", element: <Navigate to="/admin/login" replace /> },
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/dashboard", element: <AdminPanel /> },

  // Catch All
  { path: "*", element: <NotFound /> },
];

export default routes;

                                                              
