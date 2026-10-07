import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { INITIAL_ALUMNI, INITIAL_MENTORSHIPS, INITIAL_EVENTS, INITIAL_NOTICES } from "../../lib/mockData";
import AchievementSubmitModal from "../../components/alumni/AchievementSubmitModal";
import DailyThoughtCard from "../../components/alumni/DailyThoughtCard";
import { 
  Briefcase, 
  MessageSquare, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  UserCheck, 
  ArrowRight,
  Bell,
  MapPin,
  Heart,
  Users,
  Clock
} from "lucide-react";

export default function AlumniDashboard() {
  const { profile, user } = useAuth();
  const { addToast } = useToast();

  const currentAlumni = profile || INITIAL_ALUMNI[0];
  const [isAvailable, setIsAvailable] = useState(currentAlumni.is_available_for_mentorship ?? true);
  const [mentorships, setMentorships] = useState(INITIAL_MENTORSHIPS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);

  // College Invitations
  const [invitations, setInvitations] = useState([
    {
      id: 301,
      programTitle: "GL Bajaj Silver Jubilee Convocation & Annual Gala 2026",
      inviter: "Director General & Alumni Relations Cell",
      date: "November 12, 2026",
      time: "10:30 AM IST onwards",
      venue: "Main Open-Air Auditorium, GL Bajaj Campus, Greater Noida",
      guestOfHonor: "Shri Pankaj Agarwal (Vice Chairman) & Industry Leaders",
      description: "You are cordially invited as our esteemed alumnus to grace the Silver Jubilee Convocation. Join us to celebrate institutional milestones, network with faculty leadership, and inspire graduating batch scholars.",
      benefits: ["VIP Seating Pass", "Exclusive Alumni Networking Lunch", "Institutional Memento & Silver Jubilee Kit"],
      status: "Pending",
      deadline: "Nov 05, 2026"
    }
  ]);

  // Students actively seeking mentors
  const studentsSeekingMentors = [
    {
      id: "stu-sq-1",
      name: "Tanmay Singhal",
      roll: "230192010055",
      branch: "CSE (3rd Year)",
      topic: "Google Off-Campus & System Design Prep",
      note: "Hi senior! Aspiring for SDE intern roles. Would love guidance on solving distributed systems questions."
    },
    {
      id: "stu-sq-2",
      name: "Ananya Dixit",
      roll: "230192013012",
      branch: "IT (Final Year)",
      topic: "Resume Review & Microsoft Referrals",
      note: "Looking for feedback on my full-stack projects before applying for 2026 graduate openings."
    }
  ];

  function toggleAvailability() {
    const next = !isAvailable;
    setIsAvailable(next);
    addToast(next ? "You are now OPEN for student mentorship requests." : "Mentorship availability paused.", "info");
  }

  function handleInviteResponse(inviteId, status) {
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === inviteId ? { ...inv, status } : inv))
    );
    addToast(`Invitation ${status.toLowerCase()} successfully.`, "success");
  }

  function handleAcceptMentorship(id) {
    setMentorships((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "accepted", response_note: "Accepted! Looking forward to guiding you." } : m))
    );
    addToast("Mentorship request accepted. Mentee added to chat!", "success");
  }

  function handleRejectMentorship(id) {
    setMentorships((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "rejected", response_note: "Currently unavailable for this topic." } : m))
    );
    addToast("Mentorship request declined.", "info");
  }

  function handleAchievementSubmit(achData) {
    addToast(`Achievement "${achData.title}" submitted to Admin for verification!`, "success");
  }

  const pendingRequests = mentorships.filter((m) => m.status === "pending");
  const activeMenteesCount = mentorships.filter((m) => m.status === "accepted").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Alumni Hero Header */}
      <div className="bg-gradient-to-r from-glblue-750 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-teal-600/30">
        <div className="flex items-center space-x-5">
          <img
            src={currentAlumni.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
            alt={currentAlumni.full_name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-glgold shadow-lg"
          />
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-glgold text-slate-950 text-[11px] px-3 py-0.5 rounded-full font-bold">
              <Briefcase className="w-3 h-3" />
              <span>Alumni Portal • Roll No: {currentAlumni.roll_number || "220192010001"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome Back, {currentAlumni.full_name || "Alumnus"}
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm">
              Batch {currentAlumni.batch_year || "2022"} ({currentAlumni.branch || "CSE"}) • <span className="text-white font-semibold">{currentAlumni.current_designation || "Senior Software Engineer"}</span> at <span className="text-white font-semibold">{currentAlumni.current_company || "Google"}</span>
            </p>
          </div>
        </div>

        {/* Mentorship Toggle & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-2 px-3 rounded-2xl flex items-center space-x-3">
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-teal-200">Mentorship Status</div>
              <div className="text-xs font-bold text-white">
                {isAvailable ? "Available to Mentor" : "Currently Unavailable"}
              </div>
            </div>
            <button
              onClick={toggleAvailability}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                isAvailable ? "bg-emerald-500 text-white" : "bg-slate-600 text-slate-200"
              }`}
            >
              {isAvailable ? "Active" : "Paused"}
            </button>
          </div>

          <button
            onClick={() => setIsAchievementModalOpen(true)}
            className="bg-glgold hover:bg-glgold-dark text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5"
          >
            <Award className="w-4 h-4" />
            <span>Share Achievement</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-glgold flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{pendingRequests.length}</div>
            <div className="text-xs text-slate-500 font-medium">Pending Requests</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-glblue-750 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{activeMenteesCount}</div>
            <div className="text-xs text-slate-500 font-medium">Active Mentees</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{invitations.length}</div>
            <div className="text-xs text-slate-500 font-medium">College Invitations</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600">3 Pledges</div>
            <div className="text-xs text-slate-500 font-medium">My GLB Impact</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Mentorship & Students Looking For Mentors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          {/* Pending Requests Queue */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-glgold" />
                  <span>Incoming Mentorship Inquiries</span>
                </h3>
                <p className="text-xs text-slate-500">Current students requesting 1-on-1 career guidance from you</p>
              </div>
              <Link to="/alumni/mentorship" className="text-xs font-bold text-glblue-750 hover:underline">
                View All
              </Link>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-2xl">
                No pending mentorship requests at this time.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{req.student_name}</h4>
                        <p className="text-xs text-slate-500">Roll: {req.student_roll} • {req.student_branch}</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-glgold px-2.5 py-0.5 rounded-full border border-glgold/30">
                        {req.topic}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-100 leading-relaxed italic">
                      "{req.message}"
                    </p>

                    <div className="flex items-center justify-end space-x-2 pt-1">
                      <button
                        onClick={() => handleRejectMentorship(req.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-200"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAcceptMentorship(req.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-1.5 rounded-xl shadow-sm flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept & Chat</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Students Looking for Mentors Widget */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600" />
                  <span>Students Looking for Mentors</span>
                </h3>
                <p className="text-xs text-slate-500">GLB scholars who could benefit from your expertise in {currentAlumni.current_company}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentsSeekingMentors.map(stu => (
                <div key={stu.id} className="p-4 rounded-2xl bg-teal-50/40 border border-teal-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{stu.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{stu.branch}</span>
                  </div>
                  <div className="text-[11px] font-bold text-glblue-750">{stu.topic}</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed italic">"{stu.note}"</p>
                  <div className="pt-2">
                    <Link
                      to="/alumni/messages"
                      className="inline-flex items-center space-x-1 text-xs font-bold text-glgold hover:text-amber-700"
                    >
                      <span>Reach Out via Chat</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official College Invitations */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-glgold" />
                <span>Official College Program Invitations</span>
              </h3>
            </div>

            <div className="space-y-4">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className={`bg-slate-50 rounded-2xl p-6 border-2 transition space-y-3 ${
                    inv.status === "Accepted" ? "border-emerald-500/60" : "border-teal-200"
                  }`}
                >
                  <div className="text-xs font-semibold text-glblue-750">ISSUED BY: {inv.inviter}</div>
                  <h4 className="text-base font-extrabold text-slate-900">{inv.programTitle}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed italic">"{inv.description}"</p>
                  <div className="text-xs text-slate-500">
                    <strong>Date & Venue:</strong> {inv.date}, {inv.time} • {inv.venue}
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    {inv.status === "Accepted" ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> RSVP Confirmed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleInviteResponse(inv.id, "Accepted")}
                        className="bg-glgold hover:bg-glgold-dark text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
                      >
                        RSVP to Attend
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar: My GLB Impact & Quick Links */}
        <div className="space-y-6">
          {/* Daily GLB Positivity & Motivation Card */}
          <DailyThoughtCard />
          
          {/* My GLB Impact Summary Widget */}
          <div className="bg-gradient-to-br from-glblue-750 to-teal-950 text-white rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-glgold text-xs font-bold uppercase tracking-wider">
              <Heart className="w-4 h-4 fill-glgold text-glgold" />
              <span>My GLB Impact</span>
            </div>
            <h4 className="text-xl font-black">Giving Back to GLB</h4>
            <p className="text-xs text-teal-100 leading-relaxed">
              Every hour spent mentoring, referral posted, or guest lecture given directly shapes the future of GL Bajaj scholars.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center justify-between bg-white/10 p-2.5 rounded-xl">
                <span>Mentorship Sessions</span>
                <strong className="text-glgold font-mono">14 Completed</strong>
              </div>
              <div className="flex items-center justify-between bg-white/10 p-2.5 rounded-xl">
                <span>Referrals Shared</span>
                <strong className="text-teal-300 font-mono">4 Candidates</strong>
              </div>
              <div className="flex items-center justify-between bg-white/10 p-2.5 rounded-xl">
                <span>Guest Lectures</span>
                <strong className="text-glgold font-mono">2 Sessions</strong>
              </div>
            </div>

            <Link
              to="/alumni/give-back"
              className="block text-center w-full bg-glgold hover:bg-glgold-dark text-slate-950 font-bold text-xs py-2.5 rounded-xl transition shadow-md"
            >
              Update Giving Back Pledges
            </Link>
          </div>

          {/* Quick Hub */}
          <div className="bg-white rounded-3xl p-6 border border-teal-100 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-100">
              Alumni Quick Actions
            </h4>
            <Link to="/alumni/opportunities" className="block py-2 px-3 rounded-xl hover:bg-slate-50 font-semibold text-slate-700 hover:text-glblue-750 transition">
              + Post Job or Internship Referral
            </Link>
            <Link to="/alumni/career-journey" className="block py-2 px-3 rounded-xl hover:bg-slate-50 font-semibold text-slate-700 hover:text-glblue-750 transition">
              Manage Career History & Milestones
            </Link>
            <Link to="/alumni/profile" className="block py-2 px-3 rounded-xl hover:bg-slate-50 font-semibold text-slate-700 hover:text-glblue-750 transition">
              Update Professional Profile & Socials
            </Link>
          </div>

        </div>

      </div>

      <AchievementSubmitModal
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        onSubmit={handleAchievementSubmit}
      />
    </div>
  );
}
