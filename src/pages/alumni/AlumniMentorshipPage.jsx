import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import ChatWindow from "../../components/chat/ChatWindow";
import EmptyState from "../../components/common/EmptyState";
import { MessageSquare, CheckCircle2, Clock, XCircle, MessageCircle, Loader2 } from "lucide-react";

export default function AlumniMentorshipPage() {
  const { profile, user } = useAuth();
  const { addToast } = useToast();

  const [mentorships, setMentorships] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChatMentorship, setActiveChatMentorship] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      if (!user?.id || !isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("mentorship_requests")
          .select("*, student:profiles!student_id(id, full_name, email, avatar_url)")
          .eq("alumni_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          const formatted = data.map((item) => ({
            id: item.id,
            student_id: item.student_id,
            alumni_id: item.alumni_id,
            student_name: item.student?.full_name || "GLB Student",
            topic: item.topic || "Career Guidance",
            message: item.message,
            status: item.status,
            response_note: item.response_note,
            created_at: item.created_at
          }));
          setMentorships(formatted);

          const firstAccepted = formatted.find((m) => m.status === "accepted");
          if (firstAccepted) setActiveChatMentorship(firstAccepted);
        }
      } catch (err) {
        console.warn("Failed to load requests:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, [user?.id]);

  // Load messages for active chat
  useEffect(() => {
    async function fetchMessages() {
      if (!activeChatMentorship?.student_id || !user?.id || !isSupabaseConfigured || !supabase) {
        return;
      }

      try {
        const studentId = activeChatMentorship.student_id;
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${studentId}),and(sender_id.eq.${studentId},receiver_id.eq.${user.id})`)
          .order("created_at", { ascending: true });

        if (!error && data) {
          setMessages(data);
        }
      } catch (err) {
        console.warn("Error fetching messages:", err);
      }
    }

    fetchMessages();
  }, [activeChatMentorship, user?.id]);

  const filteredRequests = mentorships.filter((m) => {
    if (statusFilter === "all") return true;
    return m.status === statusFilter;
  });

  async function handleAccept(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("mentorship_requests")
          .update({
            status: "accepted",
            response_note: "Accepted! Looking forward to guiding you."
          })
          .eq("id", id);
      } catch (err) {
        console.warn("Error accepting request:", err);
      }
    }

    setMentorships((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: "accepted", response_note: "Accepted! Looking forward to guiding you." }
          : m
      )
    );
    addToast("Mentorship request accepted. Scholar added to chat!", "success");
  }

  async function handleReject(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("mentorship_requests")
          .update({
            status: "rejected",
            response_note: "Currently unavailable for this topic."
          })
          .eq("id", id);
      } catch (err) {
        console.warn("Error rejecting request:", err);
      }
    }

    setMentorships((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: "rejected", response_note: "Currently unavailable for this topic." }
          : m
      )
    );
    addToast("Mentorship request declined.", "info");
  }

  async function handleSendMessage(content) {
    if (!activeChatMentorship || !user?.id) return;
    const studentId = activeChatMentorship.student_id;

    const newMsg = {
      id: "msg-" + Date.now(),
      sender_id: user.id,
      receiver_id: studentId,
      sender_name: profile?.full_name || "Mentor",
      content,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, newMsg]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("messages").insert({
          sender_id: user.id,
          receiver_id: studentId,
          content
        });
        addToast("Message delivered to student.", "success");
      } catch (err) {
        console.warn("Failed to persist message:", err);
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0C1929] font-serif">Alumni Mentorship Console</h1>
        <p className="text-xs sm:text-sm text-[#718096] mt-1">
          Review incoming student requests, provide guidance notes, and conduct 1-on-1 mentorship conversations.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#E7E1D4] pb-3">
        {["all", "pending", "accepted", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
              statusFilter === tab
                ? "bg-[#0C1929] text-white shadow-xs"
                : "bg-[#FAF8F5] text-[#718096] hover:text-[#0C1929] border border-[#E7E1D4]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Requests List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-bold text-sm text-[#0C1929] uppercase tracking-wide">
            Student Guidance Inquiries ({filteredRequests.length})
          </h3>

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C29B38] mb-2" />
              <p className="text-xs">Loading mentorship inquiries...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <EmptyState
              title="No mentorship requests yet"
              message="When GL Bajaj students submit mentorship requests to you, they will appear here for review."
            />
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((req) => {
                const isAccepted = req.status === "accepted";
                const isPending = req.status === "pending";
                const isRejected = req.status === "rejected";
                const isSelected = activeChatMentorship?.id === req.id;

                return (
                  <div
                    key={req.id}
                    onClick={() => {
                      if (isAccepted) setActiveChatMentorship(req);
                    }}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? "border-[#C29B38] bg-amber-50/40 shadow-xs"
                        : "border-[#E7E1D4] bg-white hover:border-[#C29B38]/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-[#0C1929] text-sm">{req.student_name}</h4>
                        <p className="text-xs font-semibold text-[#8C7138]">{req.topic}</p>
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
                        {isRejected && <XCircle className="w-3 h-3" />}
                        <span>{req.status}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-[#FAF8F5] p-3 rounded-xl mt-3 line-clamp-3 italic border border-[#E7E1D4]">
                      "{req.message}"
                    </p>

                    {isPending && (
                      <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 mt-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleReject(req.id); }}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100"
                        >
                          Decline
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAccept(req.id); }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-xs flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Accept Mentorship</span>
                        </button>
                      </div>
                    )}

                    {isAccepted && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#8C7138] font-bold">
                        <span>Connected Mentee</span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Open Chat</span>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Active Chat Window (7 cols) */}
        <div className="lg:col-span-7">
          <div className="sticky top-24">
            <ChatWindow
              mentorship={activeChatMentorship}
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
