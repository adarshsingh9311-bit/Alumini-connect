import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { INITIAL_ALUMNI, INITIAL_MENTORSHIPS, INITIAL_EVENTS, INITIAL_NOTICES } from "../../lib/mockData";
import AchievementSubmitModal from "../../components/alumni/AchievementSubmitModal";
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
  Clock,
  FileText,
  Upload
} from "lucide-react";

export default function AlumniDashboard() {
  const { profile, user } = useAuth();
  const { addToast } = useToast();

  const currentAlumni = profile || INITIAL_ALUMNI[0];
  const [isAvailable, setIsAvailable] = useState(currentAlumni?.is_available_for_mentorship ?? true);
  const [mentorships, setMentorships] = useState(INITIAL_MENTORSHIPS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [alumniCv, setAlumniCv] = useState(currentAlumni?.cv_name || "");

  function handleQuickAlumniCvUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        addToast("File size exceeds 10MB limit. Please upload a smaller PDF/DOCX file.", "error");
        return;
      }
      setAlumniCv(file.name);
      addToast(`Executive CV "${file.name}" uploaded successfully!`, "success");
    }
  }

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
      <div className="bg-gradient-to-r from-[#592106] via-[#472510] to-[#2f1508] border-b-4 border-[#ffcc4e] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center space-x-5">
          <img
            src={currentAlumni.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
            alt={currentAlumni.full_name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#ffcc4e] shadow-lg"
          />
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-[#ffcc4e] text-[#472510] text-[11px] px-3 py-0.5 rounded-full font-black">
              <Briefcase className="w-3 h-3" />
              <span>Alumni Portal | Roll No: {currentAlumni.roll_number || "220192010001"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white !text-white">
              Welcome Back, {currentAlumni.full_name || "Alumnus"}!
            </h1>
            <p className="text-[#faf6eb]/90 text-xs sm:text-sm">
              Batch {currentAlumni.batch_year || "2022"} ({currentAlumni.branch || "CSE"}) • <span className="text-[#ffcc4e] font-semibold">{currentAlumni.current_designation || "Senior Software Engineer"}</span> at <span className="text-white font-semibold">{currentAlumni.current_company || "Google"}</span>
            </p>
          </div>
        </div>

        {/* Mentorship Toggle & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-2 px-3 rounded-2xl flex items-center space-x-3">
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-amber-200">Mentorship Status</div>
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
            className="bg-[#ffcc4e] hover:bg-[#e0b23d] text-[#472510] text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5"
          >
            <Award className="w-4 h-4" />
            <span>Share Achievement</span>
          </button>
        </div>
      </div>

      {/* Optional Alumni Executive CV Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#faf6eb] text-[#592106] border border-[#ffcc4e]/40 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <FileText className="w-5 h-5 text-[#592106]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-wide">
                Executive CV / Professional Resume
              </h3>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                Optional
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Share your latest resume or executive bio with GL Bajaj institution leadership, guest speaker cell, and student mentees.
            </p>
            <div className="mt-2 text-xs font-mono text-slate-700 flex items-center gap-2">
              <span className="font-semibold text-slate-800">Attached Resume:</span>
              <span className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-semibold truncate max-w-xs">
                {alumniCv || "No CV attached yet (optional)"}
              </span>
              {alumniCv && (
                <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Uploaded</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <label className="cursor-pointer bg-[#592106] hover:bg-[#472510] text-[#ffcc4e] font-bold text-xs px-4 py-2.5 rounded-xl transition shadow flex items-center justify-center gap-1.5 w-full md:w-auto">
            <Upload className="w-4 h-4 text-[#ffcc4e]" />
            <span>{alumniCv ? "Update / Replace CV" : "Upload CV (Optional)"}</span>
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleQuickAlumniCvUpload}
              className="hidden"
            />
          </label>
          <Link
            to="/alumni/profile"
            className="bg-white hover:bg-slate-50 text-[#592106] border border-slate-300 font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center justify-center shrink-0"
          >
            Manage in Profile
          </Link>
        </div>
      </div>

      {/* 4 Summary Cards (Interactive Navigational Links) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/alumni/mentorship"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:border-[#ffcc4e] hover:shadow-md hover:-translate-y-0.5 transition duration-200 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#faf6eb] text-[#592106] border border-[#ffcc4e]/40 group-hover:scale-105 flex items-center justify-center transition">
            <MessageSquare className="w-6 h-6 text-[#592106]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#592106] transition">{pendingRequests.length}</div>
            <div className="text-xs text-slate-500 font-semibold flex items-center gap-1 group-hover:text-[#592106] transition">Pending Requests &rarr;</div>
          </div>
        </Link>

        <Link
          to="/alumni/messages"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:border-[#ffcc4e] hover:shadow-md hover:-translate-y-0.5 transition duration-200 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#faf6eb] text-[#c87e35] border border-[#ffcc4e]/40 group-hover:scale-105 flex items-center justify-center transition">
            <UserCheck className="w-6 h-6 text-[#c87e35]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#592106] transition">{activeMenteesCount}</div>
            <div className="text-xs text-slate-500 font-semibold flex items-center gap-1 group-hover:text-[#592106] transition">Active Mentees &rarr;</div>
          </div>
        </Link>

        <Link
          to="/alumni/events"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:border-[#ffcc4e] hover:shadow-md hover:-translate-y-0.5 transition duration-200 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#faf6eb] text-[#472510] border border-[#ffcc4e]/40 group-hover:scale-105 flex items-center justify-center transition">
            <Calendar className="w-6 h-6 text-[#472510]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#592106] transition">{invitations.length}</div>
            <div className="text-xs text-slate-500 font-semibold flex items-center gap-1 group-hover:text-[#592106] transition">College Invitations &rarr;</div>
          </div>
        </Link>

        <Link
          to="/alumni/stories"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:border-[#ffcc4e] hover:shadow-md hover:-translate-y-0.5 transition duration-200 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#faf6eb] text-[#592106] border border-[#ffcc4e]/40 group-hover:scale-105 flex items-center justify-center transition">
            <Heart className="w-6 h-6 text-[#592106]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-[#592106]">Impact &amp; Stories</div>
            <div className="text-xs text-slate-500 font-semibold flex items-center gap-1 group-hover:text-[#592106] transition">My GLB Impact &rarr;</div>
          </div>
        </Link>
      </div>

      {/* Main Grid: Pending Mentorship & Students Looking For Mentors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          {/* Pending Requests Queue */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#ffcc4e]" />
                  <span>Incoming Mentorship Inquiries</span>
                </h3>
                <p className="text-xs text-slate-500">Current students requesting 1-on-1 career guidance from you</p>
              </div>
              <Link to="/alumni/mentorship" className="text-xs font-bold text-[#592106] hover:underline">
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
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#faf6eb] text-[#ffcc4e] px-2.5 py-0.5 rounded-full border border-[#ffcc4e]/30">
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
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
                <div key={stu.id} className="p-4 rounded-2xl bg-[#faf6eb]/40 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{stu.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{stu.branch}</span>
                  </div>
                  <div className="text-[11px] font-bold text-[#592106]">{stu.topic}</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed italic">"{stu.note}"</p>
                  <div className="pt-2">
                    <Link
                      to="/alumni/messages"
                      className="inline-flex items-center space-x-1 text-xs font-bold text-[#ffcc4e] hover:text-amber-700"
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ffcc4e]" />
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
                  <div className="text-xs font-semibold text-[#592106]">ISSUED BY: {inv.inviter}</div>
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
                        className="bg-[#ffcc4e] hover:bg-[#e0b23d] text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
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
          
          {/* My GLB Impact Summary Widget */}
          <div className="bg-gradient-to-br from-glblue-750 to-[#2f1508] text-white rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-[#ffcc4e] text-xs font-bold uppercase tracking-wider">
              <Heart className="w-4 h-4 fill-glgold text-[#ffcc4e]" />
              <span>My GLB Impact</span>
            </div>
            <h4 className="text-xl font-black">Giving Back to GLB</h4>
            <p className="text-xs text-teal-100 leading-relaxed">
              Every hour spent mentoring, referral posted, or guest lecture given directly shapes the future of GL Bajaj scholars.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center justify-between bg-white/10 p-2.5 rounded-xl">
                <span>Mentorship Sessions</span>
                <strong className="text-[#ffcc4e] font-mono">14 Completed</strong>
              </div>
              <div className="flex items-center justify-between bg-white/10 p-2.5 rounded-xl">
                <span>Referrals Shared</span>
                <strong className="text-teal-300 font-mono">4 Candidates</strong>
              </div>
              <div className="flex items-center justify-between bg-white/10 p-2.5 rounded-xl">
                <span>Guest Lectures</span>
                <strong className="text-[#ffcc4e] font-mono">2 Sessions</strong>
              </div>
            </div>

            <Link
              to="/alumni/give-back"
              className="block text-center w-full bg-[#ffcc4e] hover:bg-[#e0b23d] text-slate-950 font-bold text-xs py-2.5 rounded-xl transition shadow-md"
            >
              Update Giving Back Pledges
            </Link>
          </div>

          {/* Quick Hub */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-100">
              Alumni Quick Actions
            </h4>
            <Link to="/alumni/opportunities" className="block py-2 px-3 rounded-xl hover:bg-slate-50 font-semibold text-slate-700 hover:text-[#592106] transition">
              + Post Job or Internship Referral
            </Link>
            <Link to="/alumni/career-journey" className="block py-2 px-3 rounded-xl hover:bg-slate-50 font-semibold text-slate-700 hover:text-[#592106] transition">
              Manage Career History & Milestones
            </Link>
            <Link to="/alumni/profile" className="block py-2 px-3 rounded-xl hover:bg-slate-50 font-semibold text-slate-700 hover:text-[#592106] transition">
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
