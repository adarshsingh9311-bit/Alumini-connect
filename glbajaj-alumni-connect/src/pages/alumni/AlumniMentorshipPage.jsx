import React, { useState } from "react";
import { INITIAL_MENTORSHIPS, INITIAL_MESSAGES } from "../../lib/mockData";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import ChatWindow from "../../components/chat/ChatWindow";
import EmptyState from "../../components/common/EmptyState";
import { MessageSquare, CheckCircle2, Clock, XCircle, Send, MessageCircle, User } from "lucide-react";

export default function AlumniMentorshipPage() {
  const { profile, user } = useAuth();
  const { addToast } = useToast();

  const [mentorships, setMentorships] = useState(INITIAL_MENTORSHIPS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [activeChatMentorship, setActiveChatMentorship] = useState(INITIAL_MENTORSHIPS[0]);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRequests = mentorships.filter((m) => {
    if (statusFilter === "all") return true;
    return m.status === statusFilter;
  });

  const activeMessages = messages.filter((msg) => msg.mentorship_id === activeChatMentorship?.id);

  function handleAccept(id) {
    setMentorships((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: "accepted", response_note: "Accepted! Looking forward to chatting with you." }
          : m
      )
    );
    addToast("Mentorship request accepted. Scholar added to chat stream!", "success");
  }

  function handleReject(id) {
    setMentorships((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: "rejected", response_note: "Currently occupied with active work commitments." }
          : m
      )
    );
    addToast("Mentorship request declined.", "info");
  }

  function handleSendMessage(content) {
    if (!activeChatMentorship) return;
    const newMsg = {
      id: "msg-" + Date.now(),
      mentorship_id: activeChatMentorship.id,
      sender_id: user?.id || "user-alum-1",
      sender_name: profile?.full_name || "Rahul Sharma",
      content,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, newMsg]);
    addToast("Message delivered to student.", "success");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Student Mentorship Management</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review incoming student mentorship applications, accept/reject requests, and chat directly with your mentees.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        {["all", "pending", "accepted", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
              statusFilter === tab
                ? "bg-glblue-750 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Requests List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wide">
            Student Applications ({filteredRequests.length})
          </h3>

          {filteredRequests.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No mentorship applications"
              description="No incoming requests under this filter category."
            />
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((req) => {
                const isAccepted = req.status === "accepted";
                const isPending = req.status === "pending";
                const isSelected = activeChatMentorship?.id === req.id;

                return (
                  <div
                    key={req.id}
                    onClick={() => {
                      if (isAccepted) setActiveChatMentorship(req);
                    }}
                    className={`p-4 rounded-2xl border transition ${
                      isSelected
                        ? "border-glblue-750 bg-teal-50/40 shadow-sm cursor-pointer"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{req.student_name}</h4>
                        <p className="text-xs text-glblue-750 font-semibold">{req.student_branch} • Roll: {req.student_roll}</p>
                        <p className="text-xs font-semibold text-slate-800 mt-1">Topic: {req.topic}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                          isAccepted
                            ? "bg-emerald-100 text-emerald-800"
                            : isPending
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isAccepted && <CheckCircle2 className="w-3 h-3" />}
                        {isPending && <Clock className="w-3 h-3" />}
                        <span>{req.status}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl mt-3 italic">
                      "{req.message}"
                    </p>

                    {isPending ? (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleReject(req.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAccept(req.id)}
                          className="bg-glgold hover:bg-glgold-dark text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition shadow-sm flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept Request</span>
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{new Date(req.created_at).toLocaleDateString()}</span>
                        {isAccepted && (
                          <span className="text-glgold font-bold flex items-center gap-1 cursor-pointer">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Select to Chat</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Direct Chat Window (7 cols) */}
        <div className="lg:col-span-7">
          <div className="sticky top-24">
            <ChatWindow
              mentorship={activeChatMentorship}
              messages={activeMessages}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
