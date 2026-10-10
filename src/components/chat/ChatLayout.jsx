import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import EmptyState from "../common/EmptyState";
import { 
  Send, 
  Search, 
  MessageSquare, 
  Clock, 
  User, 
  Loader2 
} from "lucide-react";

export default function ChatLayout({ currentUserRole }) {
  const { user, profile } = useAuth();
  const { addToast } = useToast();

  const [mentorships, setMentorships] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeConversation]);

  // Fetch accepted mentorship conversations
  useEffect(() => {
    async function fetchConversations() {
      if (!user?.id || !isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error: fetchErr } = await supabase
          .from("mentorship_requests")
          .select("*, student:profiles!student_id(id, full_name, avatar_url, email), alumni:profiles!alumni_id(id, full_name, avatar_url, email)")
          .or(`student_id.eq.${user.id},alumni_id.eq.${user.id}`)
          .eq("status", "accepted")
          .order("updated_at", { ascending: false });

        if (!fetchErr && data) {
          const formatted = data.map((item) => ({
            id: item.id,
            student_id: item.student_id,
            alumni_id: item.alumni_id,
            student_name: item.student?.full_name || "GLB Student",
            alumni_name: item.alumni?.full_name || "GLB Mentor",
            partner_id: item.student_id === user.id ? item.alumni_id : item.student_id,
            partner_name: item.student_id === user.id ? (item.alumni?.full_name || "GLB Mentor") : (item.student?.full_name || "GLB Student"),
            partner_avatar: item.student_id === user.id ? item.alumni?.avatar_url : item.student?.avatar_url,
            topic: item.topic || "Career Guidance",
            created_at: item.created_at
          }));
          setMentorships(formatted);
          if (formatted.length > 0 && !activeConversation) {
            setActiveConversation(formatted[0]);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch mentorship conversations:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, [user?.id]);

  // Fetch messages for active conversation
  useEffect(() => {
    async function fetchMessages() {
      if (!activeConversation || !user?.id || !isSupabaseConfigured || !supabase) {
        return;
      }

      const partnerId = activeConversation.partner_id;
      if (!partnerId) return;

      try {
        const { data, error: msgErr } = await supabase
          .from("messages")
          .select("*")
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
          .order("created_at", { ascending: true });

        if (!msgErr && data) {
          setMessages(data);
        }
      } catch (err) {
        console.warn("Failed to fetch messages:", err);
      }
    }

    fetchMessages();
  }, [activeConversation, user?.id]);

  // Supabase Realtime Subscription
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !activeConversation || !user?.id) return;

    const partnerId = activeConversation.partner_id;

    const channel = supabase
      .channel(`chat_${user.id}_${partnerId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages"
        },
        (payload) => {
          const newMsg = payload.new;
          if (
            (newMsg.sender_id === user.id && newMsg.receiver_id === partnerId) ||
            (newMsg.sender_id === partnerId && newMsg.receiver_id === user.id)
          ) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversation, user?.id]);

  // Send message
  async function handleSendMessage(e) {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation || !user?.id) return;

    const textToSend = inputText.trim();
    const partnerId = activeConversation.partner_id;
    setInputText("");

    const localMsg = {
      id: "msg-" + Date.now(),
      sender_id: user.id,
      receiver_id: partnerId,
      content: textToSend,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, localMsg]);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error: insertErr } = await supabase.from("messages").insert({
          sender_id: user.id,
          receiver_id: partnerId,
          content: textToSend
        });
        if (insertErr) throw insertErr;
      } catch (err) {
        console.warn("Failed to persist message to Supabase:", err);
        setError("Message delivered locally. Could not sync to remote server.");
      }
    }
  }

  // Filter conversations
  const filteredConversations = mentorships.filter((c) => {
    return c.partner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           c.topic?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-white overflow-hidden">
      
      {/* Left Pane: Conversations List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50">
        
        {/* Header & Search */}
        <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#C29B38]" />
              <span>Mentorship Messages</span>
            </h3>
            <span className="text-xs bg-[#FAF8F5] text-[#0C1929] font-bold px-2 py-0.5 rounded-full border border-[#E7E1D4]">
              {mentorships.length} Active
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0C1929]"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C29B38] mb-2" />
              <p className="text-xs">Loading conversations...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No active conversations</p>
              <p className="mt-1 leading-relaxed">
                {currentUserRole === "student"
                  ? "When an alumnus accepts your mentorship request, 1-on-1 messaging unlocks here."
                  : "Accept pending mentorship requests from students to begin 1-on-1 guidance."}
              </p>
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isSelected = activeConversation?.id === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => { setActiveConversation(c); setError(null); }}
                  className={`p-4 flex items-start space-x-3 cursor-pointer transition ${
                    isSelected
                      ? "bg-[#F7F3EA] border-l-4 border-[#7A1F24]"
                      : "hover:bg-[#F7F3EA]/50 bg-white"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-[#7A1F24] text-white font-bold text-sm flex items-center justify-center font-serif shadow-2xs">
                      {c.partner_name ? c.partner_name[0] : "U"}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-600 rounded-full border-2 border-white"></span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs sm:text-sm text-[#202124] truncate">
                        {c.partner_name}
                      </h4>
                      <span className="text-[10px] text-[#667085]">
                        {c.created_at ? new Date(c.created_at).toLocaleDateString([], { month: "short", day: "numeric" }) : "Active"}
                      </span>
                    </div>
                    <p className="text-xs text-[#7A1F24] font-semibold truncate mt-0.5">
                      {c.topic}
                    </p>
                    <p className="text-[11px] text-[#667085] truncate mt-0.5">
                      {currentUserRole === "student"
                        ? "GLB Alumni Mentor"
                        : "GLB Student Mentee"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Active Chat Window */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {activeConversation ? (
          <>
            {/* Chat Top Bar */}
            <div className="p-4 border-b border-[#D9DDE3] bg-white flex items-center justify-between shadow-2xs z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-[#7A1F24] text-white font-bold text-sm flex items-center justify-center font-serif shadow-2xs">
                  {activeConversation.partner_name ? activeConversation.partner_name[0] : "U"}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#202124] leading-tight font-serif">
                    {activeConversation.partner_name}
                  </h3>
                  <div className="flex items-center space-x-2 text-[11px] text-[#667085] mt-0.5">
                    <span className="font-semibold text-[#7A1F24]">
                      {activeConversation.topic}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center text-[#2E6B4A] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B4A] mr-1"></span>
                      Mentorship Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F7F3EA]/30">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#667085]">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#D9DDE3] flex items-center justify-center text-[#7A1F24] mb-3 shadow-2xs">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-[#202124] text-sm">No messages exchanged yet</h4>
                  <p className="text-xs text-[#667085] max-w-sm mt-1">
                    Begin the mentorship conversation by introducing yourself and discussing your guidance goals.
                  </p>
                </div>
              ) : (
                messages.map((m) => {
                  const isMine = m.sender_id === user?.id;

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-md rounded-xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                          isMine
                            ? "bg-[#7A1F24] text-white rounded-br-xs"
                            : "bg-white text-[#202124] border border-[#D9DDE3] rounded-bl-xs shadow-2xs"
                        }`}
                      >
                        {m.content}
                      </div>
                      <div className="flex items-center space-x-1 text-[10px] text-[#667085] mt-1 px-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-[#D9DDE3] bg-white flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-[#F7F3EA]/40 border border-[#D9DDE3] rounded-lg px-4 py-2.5 text-xs sm:text-sm text-[#202124] focus:outline-none focus:ring-1 focus:ring-[#7A1F24] focus:border-[#7A1F24] transition"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-[#7A1F24] hover:bg-[#5C171B] text-white p-2.5 sm:px-4 sm:py-2.5 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </>
        ) : (
          <div className="h-full flex items-center justify-center p-8 bg-[#F7F3EA]/30">
            <EmptyState
              title="No Conversation Selected"
              message="Choose a mentorship connection from the list on the left to start chatting."
              actionLabel="Explore Alumni Directory"
              actionLink="/student/alumni"
            />
          </div>
        )}
      </div>

    </div>
  );
}
