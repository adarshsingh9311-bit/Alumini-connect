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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202124] font-serif">Mentorship Hub & Messaging</h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Track your mentorship requests, review alumni feedback, and chat directly with connected mentors.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#D9DDE3] pb-3">
        {["all", "accepted", "pending", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
              statusFilter === tab
                ? "bg-[#7A1F24] text-white shadow-2xs"
                : "bg-[#F7F3EA] text-[#667085] hover:text-[#202124] border border-[#D9DDE3]"
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
          <h3 className="font-bold text-sm text-[#202124] uppercase tracking-wide font-serif">
            Your Mentorship Connections ({filteredRequests.length})
          </h3>

          {loading ? (
            <div className="p-12 text-center text-[#667085]">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#7A1F24] mb-2" />
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
                    className={`p-4 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? "border-[#7A1F24] bg-[#F7F3EA]/70 shadow-2xs"
                        : "border-[#D9DDE3] bg-white hover:border-[#7A1F24]/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-[#202124] text-sm font-serif">{req.alumni_name}</h4>
                        <p className="text-xs font-semibold text-[#7A1F24]">{req.topic}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                          isAccepted
                            ? "bg-[#2E6B4A]/10 text-[#2E6B4A]"
                            : isPending
                            ? "bg-[#A66A00]/10 text-[#A66A00]"
                            : "bg-[#B42318]/10 text-[#B42318]"
                        }`}
                      >
                        {isAccepted && <CheckCircle2 className="w-3 h-3" />}
                        {isPending && <Clock className="w-3 h-3" />}
                        {isRejected && <XCircle className="w-3 h-3" />}
                        <span>{req.status}</span>
                      </span>
                    </div>

                    <p className="text-xs text-[#202124] bg-[#F7F3EA] p-2.5 rounded-lg mt-3 line-clamp-2 italic border border-[#D9DDE3]">
                      "{req.message}"
                    </p>

                    {req.response_note && (
                      <div className="mt-2 text-xs bg-[#2E6B4A]/10 text-[#2E6B4A] p-2 rounded-lg border border-[#2E6B4A]/20 font-medium">
                        <strong>Mentor Response:</strong> {req.response_note}
                      </div>
                    )}

                    <div className="mt-3 pt-2 border-t border-[#D9DDE3] flex items-center justify-between text-[11px] text-[#667085]">
                      <span>{req.created_at ? new Date(req.created_at).toLocaleDateString() : ""}</span>
                      {isAccepted && (
                        <span className="text-[#7A1F24] font-bold flex items-center gap-1">
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
