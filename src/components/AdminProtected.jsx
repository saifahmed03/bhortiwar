// src/components/AdminProtected.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { useAuth } from "../context/AuthContext";

const AdminProtected = ({ children }) => {
  const { admin } = useAdmin();
  const { user, loading } = useAuth();

  // Still loading auth state
  if (loading) {
    return (
      <div className="text-center text-white py-20">
        Checking admin access...
      </div>
    );
  }

  // No user at all → go to login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // User exists but ain't an Admin
  if (!admin?.isAdmin) {
    return (
      <div className="text-center text-red-400 py-20">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="opacity-70">
          You don’t have permission to view this page.
        </p>
      </div>
    );
  }

  // Authorized Admin → welcome inside
  return <>{children}</>;
};

export default AdminProtected;

