import React from "react";
import PortalLayout from "./PortalLayout";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  MessageSquare, 
  BellRing, 
  Calendar, 
  Award, 
  Briefcase, 
  FileSpreadsheet, 
  BarChart3, 
  Settings
} from "lucide-react";

export default function AdminLayout({ onOpenNotifications }) {
  const navItems = [
    { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Students", to: "/admin/students", icon: GraduationCap },
    { label: "Alumni", to: "/admin/alumni", icon: Users },
    { label: "Mentorship", to: "/admin/mentorship", icon: MessageSquare },
    { label: "Notices", to: "/admin/notices-wishes", icon: BellRing },
    { label: "Events", to: "/admin/events", icon: Calendar },
    { label: "Achievements", to: "/admin/achievements", icon: Award },
    { label: "Opportunities", to: "/admin/opportunities", icon: Briefcase },
    { label: "Data Import", to: "/admin/import", icon: FileSpreadsheet },
    { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
    { label: "Settings", to: "/admin/settings", icon: Settings }
  ];

  return (
    <PortalLayout
      portalTitle="Admin Portal"
      portalRole="admin"
      navItems={navItems}
      onOpenNotifications={onOpenNotifications}
    />
  );
}
