import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES, COLLEGE_NAME } from "../../lib/constants";
import { 
  Menu, 
  X, 
  LogOut, 
  Bell, 
  ChevronRight,
  User,
  Heart
} from "lucide-react";

export default function PortalLayout({ portalTitle, portalRole, navItems, onOpenNotifications }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, role, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen flex bg-[#F7F5F0] text-[#202124] antialiased font-sans">
      
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        ></div>
      )}

      {/* Sidebar: Deep Institutional Navy (#102235) with Warm Gold Accents */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#102235] text-white flex flex-col border-r border-[#0B1724] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-5 flex items-center justify-between border-b border-white/10 bg-[#0B1724]">
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/assets/glb-crest-clean.png"
              alt="GL Bajaj Seal"
              className="w-9 h-9 object-contain shrink-0"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/assets/glb-crest.png";
              }}
            />
            <div className="flex flex-col justify-center truncate">
              <span className="font-bold text-sm tracking-wide text-white leading-tight font-serif">
                GL BAJAJ
              </span>
              <span className="text-[9px] font-semibold text-[#D6A34D] uppercase tracking-widest leading-none mt-0.5">
                ALUMNI CONNECT
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/80 hover:text-white p-1"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portal Identifier Badge */}
        <div className="px-5 py-2.5 bg-[#152C43] border-b border-white/10 flex items-center justify-between text-xs">
          <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">
            Portal
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#D6A34D] text-[#102235]">
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
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? "bg-[#D6A34D] text-[#102235] font-bold shadow-xs"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#102235]" : "text-white/70"}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isActive ? "bg-[#102235] text-white" : "bg-[#D6A34D] text-[#102235]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* GLB Family Network Link */}
        <div className="p-3 border-t border-white/10">
          <Link
            to={`/${portalRole}/stories`}
            onClick={() => setSidebarOpen(false)}
            className="block p-2.5 rounded-lg bg-[#0B1724] border border-white/10 hover:border-[#D6A34D] transition"
          >
            <div className="flex items-center space-x-2 text-[#D6A34D] text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 shrink-0 fill-[#D6A34D]" />
              <span>GLB Family Network</span>
            </div>
            <p className="text-[11px] text-white/70 mt-1 leading-snug">
              "Once GLB, Always GLB."
            </p>
          </Link>
        </div>

        {/* User Mini Profile Footer */}
        <div className="p-3 border-t border-white/10 bg-[#0B1724]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 truncate">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-8 h-8 rounded-lg object-cover border border-[#D6A34D]"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-white/15 text-white font-bold flex items-center justify-center text-xs border border-white/20">
                  {(profile?.full_name || user?.email || "U")[0].toUpperCase()}
                </div>
              )}
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate max-w-[110px]">
                  {profile?.full_name || user?.email || "GLB Member"}
                </div>
                <div className="text-[10px] text-white/70 truncate capitalize">
                  {profile?.roll_number ? `Roll: ${profile.roll_number}` : (profile?.role || portalRole)}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Canvas */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-[#FFFFFF] border-b border-[#D9DDE3] sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#202124] hover:bg-[#F7F5F0] transition"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Top-left Branding on Mobile / Small screens when sidebar is hidden */}
            <div className="flex items-center space-x-2.5 lg:hidden">
              <img
                src="/assets/glb-crest-clean.png"
                alt="GL Bajaj Seal"
                className="w-7 h-7 object-contain shrink-0"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/glb-crest.png";
                }}
              />
              <div className="flex flex-col">
                <span className="font-bold text-xs tracking-wide text-[#102235] font-serif leading-none">
                  GL BAJAJ
                </span>
                <span className="text-[8px] font-semibold text-[#D6A34D] uppercase tracking-widest leading-none mt-0.5">
                  ALUMNI CONNECT
                </span>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-2 text-xs sm:text-sm">
              <span className="text-[#667085]">GL Bajaj Institute</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#D9DDE3]" />
              <h2 className="font-semibold text-[#102235] capitalize">
                {portalTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notification Button */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="p-2 rounded-lg text-[#667085] hover:text-[#102235] hover:bg-[#F7F5F0] relative transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D6A34D] rounded-full"></span>
              </button>
            )}

            {/* Academic Motto Badge */}
            <div className="hidden md:flex items-center space-x-1.5 bg-[#F7F5F0] border border-[#D9DDE3] text-[#102235] text-[11px] font-semibold px-3 py-1 rounded-md">
              <span className="text-[#D6A34D] font-serif">"Once GLB, Always GLB."</span>
            </div>
          </div>
        </header>

        {/* Page Content Area with Cream Background & White Containers */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#F7F5F0]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
