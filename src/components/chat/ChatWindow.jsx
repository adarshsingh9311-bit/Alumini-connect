import React, { useState, useEffect, useRef } from "react";
import { Send, User, MessageSquare } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ChatWindow({ mentorship, messages = [], onSendMessage }) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e) {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  }

  if (!mentorship) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 text-center">
        <MessageSquare className="w-10 h-10 mb-2 text-slate-300" />
        <p className="text-sm font-semibold text-slate-600">No active conversation selected</p>
        <p className="text-xs text-slate-400 mt-1">Select an accepted mentorship connection to chat</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-teal-100 shadow-sm flex flex-col h-[520px] overflow-hidden">
      {/* Chat Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-glblue-750 to-teal-800 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
            {(mentorship.alumni_name || mentorship.student_name || "M")[0]}
          </div>
          <div>
            <h4 className="font-bold text-sm leading-tight">
              {mentorship.alumni_name || mentorship.student_name}
            </h4>
            <p className="text-[11px] text-teal-200 truncate">
              {mentorship.topic || "Mentorship Session"}
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-2 py-0.5 rounded-full font-bold uppercase">
          Connected
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Start the conversation! Share your questions or scheduling preferences.
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user?.id || msg.sender_id === "user-stu-1" || msg.sender_id === "user-alum-1";
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-end space-x-1.5 max-w-[80%]">
                  <div
                    className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isMe
                        ? "bg-glblue-750 text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.sender_name || (isMe ? "You" : "Mentor")} • {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-glblue-750"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-glgold hover:bg-glgold-dark text-white p-2.5 rounded-xl transition shadow-sm disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
