import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // 1. Loading state while checking session or resolving role from database
  if (loading || (user && !role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0C1929] text-white">
        <div className="text-center space-y-3">
          <LoadingSpinner text="Verifying GLB Portal authorization..." />
          <p className="text-xs text-slate-400">Validating role access and security credentials...</p>
        </div>
      </div>
    );
  }

  // 2. Logged-out user: redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Unauthorized role access: redirect each user strictly to their own portal
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "student") return <Navigate to="/student" replace />;
    if (role === "alumni") return <Navigate to="/alumni" replace />;
    if (role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
