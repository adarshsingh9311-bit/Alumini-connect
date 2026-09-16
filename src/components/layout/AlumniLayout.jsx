import React from "react";
import PortalLayout from "./PortalLayout";
import { 
  LayoutDashboard, 
  User, 
  MessageSquare, 
  MessagesSquare, 
  TrendingUp, 
  HeartHandshake, 
  Briefcase, 
  Calendar, 
  Bell, 
  Settings 
} from "lucide-react";

export default function AlumniLayout({ onOpenNotifications }) {
  const navItems = [
    { label: "Dashboard", to: "/alumni/dashboard", icon: LayoutDashboard },
    { label: "My Profile", to: "/alumni/profile", icon: User },
    { label: "Mentorship", to: "/alumni/mentorship", icon: MessageSquare },
    { label: "Messages", to: "/alumni/messages", icon: MessagesSquare, badge: "Live" },
    { label: "My Career Journey", to: "/alumni/career", icon: TrendingUp },
    { label: "Give Back to GLB", to: "/alumni/give-back", icon: HeartHandshake },
    { label: "Opportunities", to: "/alumni/opportunities", icon: Briefcase },
    { label: "Events", to: "/alumni/events", icon: Calendar },
    { label: "Notices", to: "/alumni/notices", icon: Bell },
    { label: "Settings", to: "/alumni/settings", icon: Settings }
  ];

  return (
    <PortalLayout
      portalTitle="Alumni Portal"
      portalRole="alumni"
      navItems={navItems}
      onOpenNotifications={onOpenNotifications}
    />
  );
}
