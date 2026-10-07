import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { USER_ROLES } from "./lib/constants";
import { supabase, isSupabaseConfigured } from "./lib/supabase";

// Common & Layouts
import ProtectedRoute from "./components/common/ProtectedRoute";
import Modal from "./components/common/Modal";
import StudentLayout from "./components/layout/StudentLayout";
import AlumniLayout from "./components/layout/AlumniLayout";
import AdminLayout from "./components/layout/AdminLayout";

// Public Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import GLBFamilyNetwork from "./pages/common/GLBFamilyNetwork";

// Student Portal Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAlumniDirectory from "./pages/student/StudentAlumniDirectory";
import StudentMentorshipPage from "./pages/student/StudentMentorshipPage";
import StudentMessagesPage from "./pages/student/StudentMessagesPage";
import StudentOpportunitiesPage from "./pages/student/StudentOpportunitiesPage";
import StudentEventsPage from "./pages/student/StudentEventsPage";
import StudentNoticesPage from "./pages/student/StudentNoticesPage";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import StudentSettingsPage from "./pages/student/StudentSettingsPage";

// Alumni Portal Pages
import AlumniDashboard from "./pages/alumni/AlumniDashboard";
import AlumniProfilePage from "./pages/alumni/AlumniProfilePage";
import AlumniMentorshipPage from "./pages/alumni/AlumniMentorshipPage";
import AlumniMessagesPage from "./pages/alumni/AlumniMessagesPage";
import AlumniCareerJourneyPage from "./pages/alumni/AlumniCareerJourneyPage";
import AlumniGiveBackPage from "./pages/alumni/AlumniGiveBackPage";
import AlumniOpportunitiesPage from "./pages/alumni/AlumniOpportunitiesPage";
import AlumniEventsPage from "./pages/alumni/AlumniEventsPage";
import AlumniSettingsPage from "./pages/alumni/AlumniSettingsPage";

// Admin Portal Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudentsPage from "./pages/admin/AdminStudentsPage";
import AdminAlumniPage from "./pages/admin/AdminAlumniPage";
import AdminMentorshipPage from "./pages/admin/AdminMentorshipPage";
import AdminNoticesWishesPage from "./pages/admin/AdminNoticesWishesPage";
import AdminEventsPage from "./pages/admin/AdminEventsPage";
import AdminAchievementsPage from "./pages/admin/AdminAchievementsPage";
import AdminVerificationPage from "./pages/admin/AdminVerificationPage";
import AdminOpportunitiesPage from "./pages/admin/AdminOpportunitiesPage";
import AdminImportPage from "./pages/admin/AdminImportPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminDailyThoughtsPage from "./pages/admin/AdminDailyThoughtsPage";

function AppContent() {
  const { user } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      if (!user?.id || !isSupabaseConfigured || !supabase) {
        setNotifications([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setNotifications(data.map(n => ({
            id: n.id,
            title: n.title,
            text: n.message,
            time: n.created_at ? new Date(n.created_at).toLocaleDateString() : "Recent",
            read: n.is_read
          })));
        }
      } catch (err) {
        console.warn("Failed to fetch notifications:", err);
      }
    }

    fetchNotifications();
  }, [user?.id]);

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (user?.id && isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("user_id", user.id);
      } catch (err) {
        console.warn("Error updating notifications read status:", err);
      }
    }
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/:role" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 1. STUDENT PORTAL (Nested under StudentLayout with Sidebar) */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT, USER_ROLES.ADMIN]}>
              <StudentLayout onOpenNotifications={() => setNotificationsOpen(true)} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="alumni" element={<StudentAlumniDirectory />} />
          <Route path="mentorship" element={<StudentMentorshipPage />} />
          <Route path="messages" element={<StudentMessagesPage />} />
          <Route path="stories" element={<GLBFamilyNetwork />} />
          <Route path="opportunities" element={<StudentOpportunitiesPage />} />
          <Route path="events" element={<StudentEventsPage />} />
          <Route path="notices" element={<StudentNoticesPage />} />
          <Route path="profile" element={<StudentProfilePage />} />
          <Route path="settings" element={<StudentSettingsPage />} />
        </Route>

        {/* 2. ALUMNI PORTAL (Nested under AlumniLayout with Sidebar) */}
        <Route
          path="/alumni"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ALUMNI, USER_ROLES.ADMIN]}>
              <AlumniLayout onOpenNotifications={() => setNotificationsOpen(true)} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AlumniDashboard />} />
          <Route path="profile" element={<AlumniProfilePage />} />
          <Route path="mentorship" element={<AlumniMentorshipPage />} />
          <Route path="messages" element={<AlumniMessagesPage />} />
          <Route path="career" element={<AlumniCareerJourneyPage />} />
          <Route path="give-back" element={<AlumniGiveBackPage />} />
          <Route path="opportunities" element={<AlumniOpportunitiesPage />} />
          <Route path="events" element={<AlumniEventsPage />} />
          <Route path="notices" element={<StudentNoticesPage />} />
          <Route path="stories" element={<GLBFamilyNetwork />} />
          <Route path="settings" element={<AlumniSettingsPage />} />
        </Route>

        {/* 3. ADMIN PORTAL (Nested under AdminLayout with Sidebar) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <AdminLayout onOpenNotifications={() => setNotificationsOpen(true)} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudentsPage />} />
          <Route path="alumni" element={<AdminAlumniPage />} />
          <Route path="mentorship" element={<AdminMentorshipPage />} />
          <Route path="notices-wishes" element={<AdminNoticesWishesPage />} />
          <Route path="daily-thoughts" element={<AdminDailyThoughtsPage />} />
          <Route path="notices" element={<AdminNoticesWishesPage />} />
          <Route path="events" element={<AdminEventsPage />} />
          <Route path="achievements" element={<AdminAchievementsPage />} />
          <Route path="verification" element={<AdminVerificationPage />} />
          <Route path="opportunities" element={<AdminOpportunitiesPage />} />
          <Route path="import" element={<AdminImportPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="stories" element={<GLBFamilyNetwork />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Notifications Modal */}
      <Modal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        title="GL Bajaj Ecosystem Notifications"
        maxWidth="max-w-md"
      >
        <div className="space-y-3 font-sans">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  n.read ? "bg-slate-50 border-slate-200" : "bg-amber-50/50 border-[#C29B38]/40"
                }`}
              >
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{n.title}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{n.text}</p>
              </div>
            ))
          )}

          {notifications.length > 0 && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={markAllRead}
                className="text-xs text-[#8C7138] font-bold hover:underline"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
