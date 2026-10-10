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
      <div className="h-96 flex flex-col items-center justify-center text-[#667085] bg-[#F7F3EA] rounded-xl border border-dashed border-[#D9DDE3] p-6 text-center">
        <MessageSquare className="w-10 h-10 mb-2 text-[#667085]/60" />
        <p className="text-sm font-semibold text-[#202124]">No active conversation selected</p>
        <p className="text-xs text-[#667085] mt-1">Select an accepted mentorship connection to chat</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#D9DDE3] shadow-xs flex flex-col h-[520px] overflow-hidden font-sans">
      {/* Chat Header */}
      <div className="px-5 py-3.5 border-b border-[#D9DDE3] bg-[#7A1F24] text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-sm font-serif">
            {(mentorship.alumni_name || mentorship.student_name || "M")[0]}
          </div>
          <div>
            <h4 className="font-bold text-sm leading-tight text-white font-serif">
              {mentorship.alumni_name || mentorship.student_name}
            </h4>
            <p className="text-[11px] text-[#F7F3EA]/80 truncate">
              {mentorship.topic || "Mentorship Session"}
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-white/20 border border-white/30 text-white px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
          Connected
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F7F3EA]/30">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-[#667085] text-xs">
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
                    className={`p-3 rounded-xl text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? "bg-[#7A1F24] text-white rounded-br-none"
                        : "bg-white text-[#202124] border border-[#D9DDE3] rounded-bl-none shadow-2xs"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
                <span className="text-[10px] text-[#667085] mt-1 px-1">
                  {msg.sender_name || (isMe ? "You" : "Mentor")} • {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#D9DDE3] flex items-center space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-[#F7F3EA]/40 border border-[#D9DDE3] rounded-lg px-4 py-2.5 text-xs sm:text-sm text-[#202124] focus:outline-none focus:ring-1 focus:ring-[#7A1F24] focus:border-[#7A1F24]"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-[#7A1F24] hover:bg-[#5C171B] text-white p-2.5 rounded-lg transition shadow-2xs disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

