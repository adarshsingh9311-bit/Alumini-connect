import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES, COLLEGE_NAME } from "../../lib/constants";
import { 
  Menu, 
  X, 
  LogOut, 
  Bell, 
  Heart, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  Users,
  UserCheck,
  UserPlus
} from "lucide-react";

export default function PortalLayout({ portalTitle, portalRole, navItems, onOpenNotifications }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, role, logout, setDemoPortal, isConfigured } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleSwitchDemo(targetRole) {
    setDemoPortal(targetRole);
    if (targetRole === USER_ROLES.STUDENT) navigate("/student/dashboard");
    else if (targetRole === USER_ROLES.ALUMNI) navigate("/alumni/dashboard");
    else if (targetRole === USER_ROLES.ADMIN) navigate("/admin/dashboard");
  }

  const roleTheme = {
    student: {
      accent: "bg-[#ffcc4e]",
      badge: "bg-[#faf6eb] text-[#592106] border-[#ffcc4e]/50 font-bold",
      activeNav: "bg-[#592106] text-[#ffcc4e] font-bold shadow-md shadow-[#592106]/20 border-l-4 border-[#ffcc4e]",
      pill: "bg-[#faf6eb] text-[#592106]"
    },
    alumni: {
      accent: "bg-[#592106]",
      badge: "bg-[#faf6eb] text-[#592106] border-[#ffcc4e]/50 font-bold",
      activeNav: "bg-[#592106] text-[#ffcc4e] font-bold shadow-md shadow-[#592106]/20 border-l-4 border-[#ffcc4e]",
      pill: "bg-[#faf6eb] text-[#592106]"
    },
    admin: {
      accent: "bg-[#472510]",
      badge: "bg-amber-100 text-[#472510] border-[#c87e35]/50 font-bold",
      activeNav: "bg-[#472510] text-[#ffcc4e] font-bold shadow-md shadow-[#472510]/30 border-l-4 border-[#ffcc4e]",
      pill: "bg-[#faf6eb] text-[#472510]"
    }
  }[portalRole] || {
    accent: "bg-[#592106]",
    badge: "bg-[#faf6eb] text-[#592106] border-[#ffcc4e]/50 font-bold",
    activeNav: "bg-[#592106] text-[#ffcc4e] font-bold shadow-md",
    pill: "bg-[#faf6eb] text-[#592106]"
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 antialiased font-sans">
      
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        ></div>
      )}

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#2f1508] text-[#faf6eb] flex flex-col border-r border-[#ffcc4e]/20 transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-[#ffcc4e]/20 bg-[#1e0e05]">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#ffcc4e]/10 border border-[#ffcc4e]/30 flex items-center justify-center p-1 shadow-sm shrink-0 group-hover:border-[#ffcc4e] transition">
              <img
                src="/assets/glb-gold-crest.png"
                alt="GL Bajaj Seal"
                className="w-full h-full object-contain drop-shadow"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-wide text-white uppercase group-hover:text-[#ffcc4e] transition">
                GL BAJAJ
              </span>
              <span className="text-[10px] text-[#ffcc4e] font-semibold tracking-wider italic opacity-90">
                Alumni Network
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portal Identifier Badge */}
        <div className="px-5 py-2.5 bg-[#241006] border-b border-[#ffcc4e]/20 flex items-center justify-center">
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${roleTheme.badge} w-full text-center`}>
            {portalTitle}
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? roleTheme.activeNav
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? "bg-white text-slate-900" : "bg-[#ffcc4e] text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* GLB Family Network Link Card */}
        <div className="p-3">
          <Link
            to={`/${portalRole}/stories`}
            onClick={() => setSidebarOpen(false)}
            className="block p-3 rounded-xl bg-gradient-to-r from-[#592106]/40 to-[#472510]/50 border border-[#ffcc4e]/30 hover:border-[#ffcc4e] transition group"
          >
            <div className="flex items-center space-x-2 text-[#ffcc4e] text-xs font-bold">
              <Heart className="w-3.5 h-3.5" />
              <span>GLB Family Network</span>
            </div>
            <p className="text-[11px] text-amber-100/70 mt-1 leading-snug">
              Celebrating the lifelong bond between scholars & alumni.
            </p>
          </Link>
        </div>

        {/* User Mini Profile Footer */}
        <div className="p-3 border-t border-[#ffcc4e]/20 bg-[#1e0e05]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 truncate">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-8 h-8 rounded-xl object-cover border border-[#ffcc4e]"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-[#ffcc4e] text-[#472510] font-bold flex items-center justify-center text-xs">
                  {(profile?.full_name || user?.email || "U")[0]}
                </div>
              )}
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate max-w-[110px]">
                  {profile?.full_name || user?.email || "GLB Member"}
                </div>
                <div className="text-[10px] font-mono text-amber-200/60 truncate">
                  {profile?.roll_number ? `Roll: ${profile.roll_number}` : (profile?.designation || portalRole)}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-amber-200/70 hover:text-red-400 hover:bg-white/10 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main App Canvas */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 bg-[#fdfbf7]">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b-2 border-[#ffcc4e]/40 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">GLB Ecosystem</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline-block" />
              <h2 className="text-sm sm:text-base font-bold text-slate-800 capitalize">
                {portalTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Demo Portal Switcher */}
            {!isConfigured && (
              <div className="relative group hidden sm:block">
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition">
                  <Sparkles className="w-3.5 h-3.5 text-[#ffcc4e]" />
                  <span>Switch Portal</span>
                </button>
                <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 hidden group-hover:block z-50">
                  <button
                    onClick={() => handleSwitchDemo(USER_ROLES.STUDENT)}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-[#faf6eb] hover:text-[#ffcc4e] font-semibold"
                  >
                    Student Portal
                  </button>
                  <button
                    onClick={() => handleSwitchDemo(USER_ROLES.ALUMNI)}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-[#faf6eb] hover:text-[#592106] font-semibold"
                  >
                    Alumni Portal
                  </button>
                  <button
                    onClick={() => handleSwitchDemo(USER_ROLES.ADMIN)}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 font-semibold"
                  >
                    Admin Portal
                  </button>
                </div>
              </div>
            )}

            {/* Notification Center */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 relative transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ffcc4e] rounded-full ring-2 ring-white"></span>
              </button>
            )}

{/* Login & Register Direct Navigation Links */}
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="inline-flex items-center space-x-1 bg-[#472510] hover:bg-[#381a0b] text-[#faf6eb] text-xs font-bold px-3 py-1.5 rounded-xl border border-[#ffcc4e]/30 transition shadow-xs"
                title="Go to Login Portal"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#ffcc4e]" />
                <span className="hidden sm:inline">Login</span>
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center space-x-1 bg-[#ffcc4e] hover:bg-[#e0b23d] text-[#472510] text-xs font-black px-3 py-1.5 rounded-xl transition shadow-sm"
                title="Register New Account"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#472510]" />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </div>

            {/* Tagline Pill */}
            <div className="hidden xl:flex items-center space-x-1 bg-[#faf6eb] border border-[#ffcc4e]/50 text-[#592106] text-[11px] font-bold px-2.5 py-1 rounded-full">
              <Heart className="w-3 h-3 text-[#c87e35]" />
              <span>Once GLB, Always GLB.</span>
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
