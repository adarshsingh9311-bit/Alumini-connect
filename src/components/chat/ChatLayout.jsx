import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { INITIAL_MENTORSHIPS, INITIAL_MESSAGES } from "../../lib/mockData";
import { 
  Send, 
  Search, 
  CheckCircle2, 
  Circle, 
  MessageSquare, 
  Clock, 
  User, 
  AlertCircle,
  Loader2 
} from "lucide-react";

export default function ChatLayout({ currentUserRole }) {
  const { user, profile } = useAuth();
  const { addToast } = useToast();

  const [mentorships, setMentorships] = useState(
    INITIAL_MENTORSHIPS.filter((m) => m.status === "accepted")
  );
  const [activeConversation, setActiveConversation] = useState(mentorships[0] || null);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeConversation]);

  // Supabase Realtime Subscription (when configured)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !activeConversation) return;

    const channel = supabase
      .channel(`chat_${activeConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `mentorship_id=eq.${activeConversation.id}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversation]);

  // Send message
  async function handleSendMessage(e) {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    const textToSend = inputText.trim();
    setInputText("");

    const newMsg = {
      id: "msg-" + Date.now(),
      mentorship_id: activeConversation.id,
      sender_id: user?.id || (currentUserRole === "student" ? "user-stu-1" : "user-alum-1"),
      sender_name: profile?.full_name || (currentUserRole === "student" ? "Student" : "Alumnus"),
      content: textToSend,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, newMsg]);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error: insertErr } = await supabase.from("messages").insert({
          mentorship_id: activeConversation.id,
          sender_id: user?.id,
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
  const filteredConversations = mentorships.filter((m) => {
    const targetName = currentUserRole === "student" ? m.alumni_name : m.student_name;
    return targetName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeMessages = messages.filter(
    (msg) => msg.mentorship_id === activeConversation?.id
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-white overflow-hidden">
      
      {/* Left Pane: Conversations List (340px) */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50">
        
        {/* Header & Search */}
        <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-glgold" />
              <span>Mentorship Messages</span>
            </h3>
            <span className="text-xs bg-teal-50 text-glblue-750 font-bold px-2 py-0.5 rounded-full border border-teal-200">
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
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-glblue-750"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <p className="font-semibold text-slate-600">No conversations found</p>
              <p className="mt-1">
                {currentUserRole === "student"
                  ? "Send mentorship requests to alumni to unlock chat channels."
                  : "Accept pending mentorship requests to begin chatting with students."}
              </p>
            </div>
          ) : (
            filteredConversations.map((c) => {
              const partnerName = currentUserRole === "student" ? c.alumni_name : c.student_name;
              const isSelected = activeConversation?.id === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => { setActiveConversation(c); setError(null); }}
                  className={`p-4 flex items-start space-x-3 cursor-pointer transition ${
                    isSelected
                      ? "bg-teal-50/70 border-l-4 border-glblue-750"
                      : "hover:bg-slate-100/70 bg-white"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-glblue-750 to-teal-800 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                      {partnerName ? partnerName[0] : "U"}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-300"></span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {partnerName}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {new Date(c.created_at).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="text-xs text-glblue-750 font-semibold truncate mt-0.5">
                      {c.topic}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {currentUserRole === "student"
                        ? "Connected Alumnus Mentor"
                        : `${c.student_branch || "Student"} • Roll: ${c.student_roll || "N/A"}`}
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
            <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white shadow-sm shrink-0">
              <div className="flex items-center space-x-3 truncate">
                <div className="w-10 h-10 rounded-2xl bg-glgold text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {(currentUserRole === "student" ? activeConversation.alumni_name : activeConversation.student_name)[0]}
                </div>
                <div className="truncate">
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 truncate">
                    <span>{currentUserRole === "student" ? activeConversation.alumni_name : activeConversation.student_name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-glgold shrink-0" />
                  </h3>
                  <p className="text-xs text-glblue-750 font-medium truncate flex items-center gap-2">
                    <span>Topic: {activeConversation.topic}</span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
                      <span>Active Now</span>
                    </span>
                  </p>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400 hidden sm:block">
                <span>Mentorship Connection</span>
                <div className="font-semibold text-slate-600">GLB 1-on-1 Chat</div>
              </div>
            </div>

            {/* Error Notification banner if any */}
            {error && (
              <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
              {activeMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-6">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-glblue-750 flex items-center justify-center mb-2">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-slate-700 text-sm">Conversation Initiated</p>
                  <p className="max-w-sm text-slate-500 mt-1">
                    Send a greeting to break the ice! Ask questions about interview prep, tech stacks, or guidance for upcoming campus drives.
                  </p>
                </div>
              ) : (
                activeMessages.map((msg) => {
                  const isMe =
                    msg.sender_id === user?.id ||
                    (currentUserRole === "student" && msg.sender_id === "user-stu-1") ||
                    (currentUserRole === "alumni" && msg.sender_id === "user-alum-1");

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-end space-x-1.5 max-w-[80%] sm:max-w-[70%]">
                        <div
                          className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                            isMe
                              ? "bg-glblue-750 text-white rounded-br-none"
                              : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                        <span>{msg.sender_name || (isMe ? "You" : "Partner")}</span>
                        <span>•</span>
                        <span>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Footer */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white border-t border-slate-200 flex items-center space-x-3 shrink-0"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message here... (Press Enter to send)"
                className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-glblue-750"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-glgold hover:bg-glgold-dark text-white p-3 rounded-2xl transition shadow-md disabled:opacity-40 flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <MessageSquare className="w-14 h-14 mb-3 text-slate-300" />
            <h3 className="font-bold text-slate-700 text-base">Select a conversation</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Choose an accepted mentorship from the left menu to start direct messaging.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
