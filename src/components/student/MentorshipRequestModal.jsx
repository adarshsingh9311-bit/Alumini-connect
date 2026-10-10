import React, { useState } from "react";
import Modal from "../common/Modal";
import { MENTORSHIP_TOPICS } from "../../lib/constants";
import { MessageSquare, Send, Loader2 } from "lucide-react";

export default function MentorshipRequestModal({ isOpen, onClose, alumni, onSubmitRequest }) {
  const [topic, setTopic] = useState(MENTORSHIP_TOPICS[0]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!alumni) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    try {
      await onSubmitRequest({
        alumni_id: alumni.id,
        alumni_name: alumni.full_name,
        topic,
        message
      });
      setMessage("");
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Mentorship" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        {/* Mentor Info Banner */}
        <div className="bg-[#F7F3EA] border border-[#D9DDE3] p-4 rounded-xl flex items-center space-x-3.5">
          <img
            src={alumni.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
            alt={alumni.full_name}
            className="w-12 h-12 rounded-lg object-cover border border-[#D9DDE3]"
          />
          <div>
            <h4 className="font-bold text-[#202124] text-sm font-serif">{alumni.full_name}</h4>
            <p className="text-xs text-[#7A1F24] font-semibold">{alumni.current_designation}</p>
            <p className="text-[11px] text-[#667085]">at {alumni.current_company} • {alumni.branch} ({alumni.batch_year})</p>
          </div>
        </div>

        {/* Mentorship Area */}
        <div>
          <label className="block text-xs font-semibold text-[#202124] uppercase mb-1">
            Mentorship Guidance Category <span className="text-[#B42318]">*</span>
          </label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-[#F7F3EA]/30 border border-[#D9DDE3] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-[#202124] focus:outline-none focus:ring-1 focus:ring-[#7A1F24] focus:border-[#7A1F24]"
          >
            {MENTORSHIP_TOPICS.map((t, idx) => (
              <option key={idx} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Personal Note */}
        <div>
          <label className="block text-xs font-semibold text-[#202124] uppercase mb-1">
            Message to Alumnus / Specific Goals <span className="text-[#B42318]">*</span>
          </label>
          <textarea
            rows="4"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Introduce yourself, your semester/branch, and specifically what you would like advice on (e.g. preparation strategy, resume feedback, tech stack insights)..."
            className="w-full bg-[#F7F3EA]/30 border border-[#D9DDE3] rounded-lg p-3 text-xs sm:text-sm text-[#202124] focus:outline-none focus:ring-1 focus:ring-[#7A1F24] focus:border-[#7A1F24]"
          ></textarea>
        </div>

        <div className="pt-2 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#667085] hover:bg-black/5 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="bg-[#7A1F24] hover:bg-[#5C171B] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition shadow-2xs flex items-center space-x-1.5 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Request</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

