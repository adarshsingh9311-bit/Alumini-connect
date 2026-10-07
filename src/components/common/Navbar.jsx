import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES, COLLEGE_NAME } from "../../lib/constants";
import { 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Bell 
} from "lucide-react";

export default function Navbar({ onOpenNotifications }) {
  const { user, profile, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  }

  const isStudentActive = location.pathname.startsWith("/student");
  const isAlumniActive = location.pathname.startsWith("/alumni");
  const isAdminActive = location.pathname.startsWith("/admin");

  return (
    <header className="bg-glblue-750 text-white shadow-md sticky top-0 z-40 border-b border-teal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-glgold text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-inner group-hover:scale-105 transition">
            GL
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg leading-tight tracking-wide flex items-center gap-1.5">
              <span>GL BAJAJ</span>
              <span className="text-xs bg-teal-800/80 text-glgold px-2 py-0.5 rounded font-mono font-semibold hidden sm:inline-block">ALUMNI CONNECT</span>
            </h1>
            <p className="text-[11px] text-glgold font-medium tracking-wider truncate max-w-[200px] sm:max-w-none">
              {COLLEGE_NAME}
            </p>
          </div>
        </Link>

        {/* Portal Switcher Nav (Desktop) */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link
            to="/student"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
              isStudentActive
                ? "bg-white/20 text-glgold font-bold shadow-sm"
                : "text-slate-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Portal</span>
          </Link>

          <Link
            to="/alumni"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
              isAlumniActive
                ? "bg-white/20 text-glgold font-bold shadow-sm"
                : "text-slate-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Alumni Portal</span>
          </Link>

          <Link
            to="/admin"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
              isAdminActive
                ? "bg-white/20 text-glgold font-bold shadow-sm"
                : "text-slate-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Portal</span>
          </Link>
        </nav>

        {/* Right side utilities: notifications, role selector, user profile */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Notifications Button */}
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-glgold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                2
              </span>
            </button>
          )}

          {/* User Account State */}
          {user ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-6 h-6 rounded-full object-cover border border-glgold"
                  />
                ) : (
                  <User className="w-4 h-4 text-glgold" />
                )}
                <span className="text-xs font-semibold max-w-[120px] truncate">
                  {profile?.full_name || user.email}
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-glgold/20 text-glgold border border-glgold/40">
                  {role || "user"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-slate-300 hover:text-red-300 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-glgold hover:bg-glgold-dark text-white transition shadow-sm"
              >
                Join Network
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <div className="md:hidden flex items-center space-x-2">
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="p-2 rounded-lg bg-white/10 text-white"
            >
              <Bell className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-white hover:bg-white/10 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-glblue-900 border-t border-teal-800 px-4 pt-3 pb-5 space-y-2">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-2">
            Select Portal
          </div>
          <Link
            to="/student"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
              isStudentActive ? "bg-glgold text-white font-bold" : "text-slate-200 hover:bg-white/10"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Portal</span>
          </Link>

          <Link
            to="/alumni"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
              isAlumniActive ? "bg-glgold text-white font-bold" : "text-slate-200 hover:bg-white/10"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Alumni Portal</span>
          </Link>

          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
              isAdminActive ? "bg-glgold text-white font-bold" : "text-slate-200 hover:bg-white/10"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Portal</span>
          </Link>

          <div className="pt-3 border-t border-teal-800/80">
            {user ? (
              <div className="space-y-2">
                <div className="px-2 text-xs text-slate-300 font-medium">
                  Signed in as <strong className="text-white">{profile?.full_name || user.email}</strong> ({role})
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 bg-red-900/40 border border-red-500/40 text-red-200 py-2 rounded-xl text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl text-xs font-semibold bg-white/10 text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl text-xs font-bold bg-glgold text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
