import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import ChatWindow from "../../components/chat/ChatWindow";
import EmptyState from "../../components/common/EmptyState";
import { MessageSquare, CheckCircle2, Clock, XCircle, Loader2, MessageCircle } from "lucide-react";

export default function StudentMentorshipPage() {
  const { profile, user } = useAuth();
  const { addToast } = useToast();

  const [mentorships, setMentorships] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChatMentorship, setActiveChatMentorship] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyRequests() {
      if (!user?.id || !isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("mentorship_requests")
          .select("*, alumni:profiles!alumni_id(id, full_name, avatar_url, email)")
          .eq("student_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          const formatted = data.map((item) => ({
            id: item.id,
            student_id: item.student_id,
            alumni_id: item.alumni_id,
            alumni_name: item.alumni?.full_name || "GLB Mentor",
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
        console.warn("Failed to fetch mentorship requests:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyRequests();
  }, [user?.id]);

  // Load messages for active chat
  useEffect(() => {
    async function fetchMessages() {
      if (!activeChatMentorship?.alumni_id || !user?.id || !isSupabaseConfigured || !supabase) {
        return;
      }

      try {
        const mentorId = activeChatMentorship.alumni_id;
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${mentorId}),and(sender_id.eq.${mentorId},receiver_id.eq.${user.id})`)
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

  async function handleSendMessage(content) {
    if (!activeChatMentorship || !user?.id) return;
    const mentorId = activeChatMentorship.alumni_id;

    const newMsg = {
      id: "msg-" + Date.now(),
      sender_id: user.id,
      receiver_id: mentorId,
      sender_name: profile?.full_name || "Student",
      content,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, newMsg]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("messages").insert({
          sender_id: user.id,
          receiver_id: mentorId,
          content
        });
        addToast("Message delivered to mentor.", "success");
      } catch (err) {
        console.warn("Failed to persist message:", err);
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0C1929] font-serif">Mentorship Hub & Messaging</h1>
        <p className="text-xs sm:text-sm text-[#718096] mt-1">
          Track your mentorship requests, review alumni feedback, and chat directly with connected mentors.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#E7E1D4] pb-3">
        {["all", "accepted", "pending", "rejected"].map((tab) => (
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

      {/* Two Column Layout: Requests List & Chat Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Requests List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-bold text-sm text-[#0C1929] uppercase tracking-wide">
            Your Mentorship Connections ({filteredRequests.length})
          </h3>

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C29B38] mb-2" />
              <p className="text-xs">Loading mentorship requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <EmptyState
              title="No mentorship requests yet"
              message="Explore the verified Alumni Directory and request guidance from seniors in your domain."
              actionLabel="Find Mentors"
              actionLink="/student/alumni"
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
                        <h4 className="font-bold text-[#0C1929] text-sm">{req.alumni_name}</h4>
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

                    <p className="text-xs text-slate-600 bg-[#FAF8F5] p-2.5 rounded-xl mt-3 line-clamp-2 italic border border-[#E7E1D4]">
                      "{req.message}"
                    </p>

                    {req.response_note && (
                      <div className="mt-2 text-xs bg-emerald-50 text-emerald-900 p-2 rounded-lg border border-emerald-200 font-medium">
                        <strong>Mentor Response:</strong> {req.response_note}
                      </div>
                    )}

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{req.created_at ? new Date(req.created_at).toLocaleDateString() : ""}</span>
                      {isAccepted && (
                        <span className="text-[#8C7138] font-bold flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Click to Chat</span>
                        </span>
                      )}
                    </div>
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
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
