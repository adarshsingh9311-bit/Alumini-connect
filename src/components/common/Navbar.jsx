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
    <header className="bg-[#7A1F24] text-white sticky top-0 z-40 border-b border-[#5C171B] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="bg-[#FFFFFF] text-[#7A1F24] w-9 h-9 rounded-lg flex items-center justify-center font-bold text-base shadow-xs shrink-0">
            GL
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-base leading-tight tracking-tight flex items-center gap-2">
              <span>GL BAJAJ</span>
              <span className="text-[10px] bg-[#5C171B] text-[#FFFFFF] px-1.5 py-0.5 rounded font-mono hidden sm:inline-block">
                ALUMNI CONNECT
              </span>
            </h1>
            <p className="text-[11px] text-white/80 truncate max-w-[200px] sm:max-w-none">
              "Once GLB, Always GLB."
            </p>
          </div>
        </Link>

        {/* Portal Switcher Nav (Desktop) */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link
            to="/student"
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center space-x-1.5 ${
              isStudentActive
                ? "bg-[#5C171B] text-[#FFFFFF]"
                : "text-white/90 hover:bg-[#5C171B] hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Portal</span>
          </Link>

          <Link
            to="/alumni"
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center space-x-1.5 ${
              isAlumniActive
                ? "bg-[#5C171B] text-[#FFFFFF]"
                : "text-white/90 hover:bg-[#5C171B] hover:text-white"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Alumni Portal</span>
          </Link>

          <Link
            to="/admin"
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center space-x-1.5 ${
              isAdminActive
                ? "bg-[#5C171B] text-[#FFFFFF]"
                : "text-white/90 hover:bg-[#5C171B] hover:text-white"
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
              className="p-2 rounded-md hover:bg-[#5C171B] text-white transition relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 bg-[#B08A3E] w-2 h-2 rounded-full"></span>
            </button>
          )}

          {/* User Account State */}
          {user ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-[#5C171B] px-3 py-1.5 rounded-md border border-white/10 text-xs">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-3.5 h-3.5 text-white/80" />
                )}
                <span className="font-semibold max-w-[120px] truncate text-white">
                  {profile?.full_name || user.email}
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/20 text-white">
                  {role || "user"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-md hover:bg-[#5C171B] text-white/80 hover:text-white transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-white hover:bg-[#5C171B] transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#FFFFFF] text-[#7A1F24] hover:bg-[#F7F3EA] transition shadow-xs"
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
              className="p-2 rounded-md hover:bg-[#5C171B] text-white"
            >
              <Bell className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-white hover:bg-[#5C171B] transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#5C171B] border-t border-[#7A1F24] px-4 pt-3 pb-5 space-y-2">
          <div className="text-[10px] uppercase tracking-wider font-bold text-white/70 px-2">
            Select Portal
          </div>
          <Link
            to="/student"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              isStudentActive ? "bg-white text-[#7A1F24] font-bold" : "text-white hover:bg-white/10"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Portal</span>
          </Link>

          <Link
            to="/alumni"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              isAlumniActive ? "bg-white text-[#7A1F24] font-bold" : "text-white hover:bg-white/10"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Alumni Portal</span>
          </Link>

          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              isAdminActive ? "bg-white text-[#7A1F24] font-bold" : "text-white hover:bg-white/10"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Portal</span>
          </Link>

          <div className="pt-3 border-t border-white/10">
            {user ? (
              <div className="space-y-2">
                <div className="px-2 text-xs text-white/80 font-medium">
                  Signed in as <strong className="text-white">{profile?.full_name || user.email}</strong> ({role})
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 bg-black/20 text-white py-2 rounded-md text-xs font-semibold"
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
                  className="text-center py-2 rounded-md text-xs font-semibold bg-white/10 text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-md text-xs font-semibold bg-[#FFFFFF] text-[#7A1F24]"
                >
                  Join Network
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
