import React from "react";
import PortalLayout from "./PortalLayout";
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  MessagesSquare, 
  BookOpen, 
  Briefcase, 
  Calendar, 
  Bell, 
  User, 
  Settings 
} from "lucide-react";

export default function StudentLayout({ onOpenNotifications }) {
  const navItems = [
    { label: "Dashboard", to: "/student/dashboard", icon: LayoutDashboard },
    { label: "Find Alumni", to: "/student/alumni", icon: Users },
    { label: "Mentorship", to: "/student/mentorship", icon: MessageSquare },
    { label: "Messages", to: "/student/messages", icon: MessagesSquare, badge: "Live" },
    { label: "Alumni Stories", to: "/student/stories", icon: BookOpen },
    { label: "Jobs & Internships", to: "/student/opportunities", icon: Briefcase },
    { label: "Events", to: "/student/events", icon: Calendar },
    { label: "Notices", to: "/student/notices", icon: Bell },
    { label: "Profile", to: "/student/profile", icon: User },
    { label: "Settings", to: "/student/settings", icon: Settings }
  ];

  return (
    <PortalLayout
      portalTitle="Student Portal"
      portalRole="student"
      navItems={navItems}
      onOpenNotifications={onOpenNotifications}
    />
  );
}
