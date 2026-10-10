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
    <div className="min-h-screen flex bg-[#F7F3EA] text-[#202124] antialiased font-sans">
      
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        ></div>
      )}

      {/* Sidebar: Institutional Maroon & Solid Academic Design */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#7A1F24] text-white flex flex-col border-r border-[#5C171B] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#5C171B] bg-[#5C171B]">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-[#FFFFFF] text-[#7A1F24] w-9 h-9 rounded-lg flex items-center justify-center font-bold text-base shadow-xs shrink-0">
              GL
            </div>
            <div className="truncate">
              <h1 className="font-bold text-sm tracking-wide text-white leading-tight">
                GL BAJAJ
              </h1>
              <p className="text-[10px] text-[#B08A3E] font-bold tracking-widest uppercase truncate">
                Alumni Connect
              </p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/80 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portal Identifier Badge */}
        <div className="px-5 py-2.5 bg-[#6B1B20] border-b border-[#5C171B] flex items-center justify-between text-xs">
          <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">
            Portal
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/15 text-[#FFFFFF] border border-white/20">
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
                    ? "bg-[#FFFFFF] text-[#7A1F24] font-bold shadow-xs"
                    : "text-white/90 hover:bg-[#5C171B] hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#7A1F24]" : "text-white/80"}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isActive ? "bg-[#7A1F24] text-white" : "bg-[#B08A3E] text-white"
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
        <div className="p-3 border-t border-[#5C171B]">
          <Link
            to={`/${portalRole}/stories`}
            onClick={() => setSidebarOpen(false)}
            className="block p-2.5 rounded-lg bg-[#5C171B] border border-white/10 hover:border-[#B08A3E] transition"
          >
            <div className="flex items-center space-x-2 text-[#B08A3E] text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 shrink-0" />
              <span>GLB Family Network</span>
            </div>
            <p className="text-[11px] text-white/70 mt-1 leading-snug">
              "Once GLB, Always GLB."
            </p>
          </Link>
        </div>

        {/* User Mini Profile Footer */}
        <div className="p-3 border-t border-[#5C171B] bg-[#5C171B]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 truncate">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-8 h-8 rounded-lg object-cover border border-[#B08A3E]"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-white/20 text-white font-bold flex items-center justify-center text-xs">
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
              className="lg:hidden p-2 rounded-lg text-[#202124] hover:bg-[#F7F3EA] transition"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <span className="text-[#667085] hidden sm:inline-block">GL Bajaj Institute</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#D9DDE3] hidden sm:inline-block" />
              <h2 className="font-semibold text-[#202124] capitalize">
                {portalTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notification Button */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="p-2 rounded-lg text-[#667085] hover:text-[#202124] hover:bg-[#F7F3EA] relative transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7A1F24] rounded-full"></span>
              </button>
            )}

            {/* Academic Motto Badge */}
            <div className="hidden md:flex items-center space-x-1.5 bg-[#F7F3EA] border border-[#D9DDE3] text-[#7A1F24] text-[11px] font-semibold px-3 py-1 rounded-md">
              <span>"Once GLB, Always GLB."</span>
            </div>
          </div>
        </header>

        {/* Page Content Area with Cream Background & White Containers */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#F7F3EA]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
