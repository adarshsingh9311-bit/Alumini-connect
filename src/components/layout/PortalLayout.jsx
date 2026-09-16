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
  Users
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
      accent: "bg-glgold",
      badge: "bg-amber-50 text-glgold border-glgold/30",
      activeNav: "bg-glgold text-white font-bold shadow-md shadow-glgold/20",
      pill: "bg-glgold/10 text-glgold"
    },
    alumni: {
      accent: "bg-glblue-750",
      badge: "bg-teal-50 text-glblue-750 border-teal-200",
      activeNav: "bg-glblue-750 text-white font-bold shadow-md shadow-glblue-750/20",
      pill: "bg-teal-50 text-glblue-750"
    },
    admin: {
      accent: "bg-teal-900",
      badge: "bg-slate-100 text-slate-800 border-slate-300",
      activeNav: "bg-teal-900 text-white font-bold shadow-md shadow-teal-950/20",
      pill: "bg-slate-100 text-slate-700"
    }
  }[portalRole] || {
    accent: "bg-glblue-750",
    badge: "bg-teal-50 text-glblue-750 border-teal-200",
    activeNav: "bg-glblue-750 text-white font-bold shadow-md",
    pill: "bg-teal-50 text-glblue-750"
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-slate-800 bg-slate-950/50">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-glgold text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition">
              GL
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base leading-tight tracking-wide text-white flex items-center gap-1.5">
                <span>GL BAJAJ</span>
              </h1>
              <p className="text-[10px] text-glgold font-bold tracking-widest uppercase">
                "Once GLB, Always GLB."
              </p>
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
        <div className="px-5 py-3 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Active Workspace
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleTheme.badge}`}>
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
                      isActive ? "bg-white text-slate-900" : "bg-glgold text-white"
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
            className="block p-3 rounded-xl bg-gradient-to-r from-glblue-750/30 to-teal-800/30 border border-teal-700/50 hover:border-glgold transition group"
          >
            <div className="flex items-center space-x-2 text-glgold text-xs font-bold">
              <Heart className="w-3.5 h-3.5" />
              <span>GLB Family Network</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Celebrating the lifelong bond between scholars & alumni.
            </p>
          </Link>
        </div>

        {/* User Mini Profile Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 truncate">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-8 h-8 rounded-xl object-cover border border-glgold"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-glgold text-white font-bold flex items-center justify-center text-xs">
                  {(profile?.full_name || user?.email || "U")[0]}
                </div>
              )}
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate max-w-[110px]">
                  {profile?.full_name || user?.email || "GLB Member"}
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate">
                  {profile?.roll_number ? `Roll: ${profile.roll_number}` : (profile?.designation || portalRole)}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/10 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main App Canvas */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
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
                  <Sparkles className="w-3.5 h-3.5 text-glgold" />
                  <span>Switch Portal</span>
                </button>
                <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 hidden group-hover:block z-50">
                  <button
                    onClick={() => handleSwitchDemo(USER_ROLES.STUDENT)}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-glgold font-semibold"
                  >
                    Student Portal
                  </button>
                  <button
                    onClick={() => handleSwitchDemo(USER_ROLES.ALUMNI)}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-glblue-750 font-semibold"
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
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-glgold rounded-full ring-2 ring-white"></span>
              </button>
            )}

            {/* Tagline Pill */}
            <div className="hidden md:flex items-center space-x-1 bg-amber-50 border border-glgold/30 text-glgold text-[11px] font-bold px-2.5 py-1 rounded-full">
              <Heart className="w-3 h-3" />
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
