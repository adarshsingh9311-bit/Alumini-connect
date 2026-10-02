import React, { useState } from "react";
import Modal from "../common/Modal";
import { Send, Heart, Sparkles, Loader2 } from "lucide-react";

export default function BroadcastModal({ isOpen, onClose, onSendBroadcast }) {
  const [broadcastType, setBroadcastType] = useState("wishes"); // wishes | invitation | announcement
  const [targetBatch, setTargetBatch] = useState("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !message) return;
    setLoading(true);
    try {
      await onSendBroadcast({
        type: broadcastType,
        target_batch: targetBatch,
        title,
        message,
        sent_at: new Date().toISOString()
      });
      setTitle("");
      setMessage("");
      onClose();
    } finally {
      setLoading(false);
    }
  }

  function handleTemplateSelect(type) {
    setBroadcastType(type);
    if (type === "wishes") {
      setTitle("Warm Festive Greetings & Best Wishes from GL Bajaj Alma Mater!");
      setMessage("Dear Alumnus, The Management, Faculty, and Students of G.L. Bajaj Institute of Technology & Management wish you immense joy, success, and prosperity. We take tremendous pride in your journey!");
    } else if (type === "invitation") {
      setTitle("Special Invitation: Distinguished Alumni Keynote & Honors");
      setMessage("Dear Alumnus, We cordially invite you to return to GL Bajaj campus to share your career milestones with graduating scholars and receive our institutional honors token.");
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Broadcast Wishes & Direct Messages to Alumni" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Template shortcuts */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Quick Templates:</span>
          <button
            type="button"
            onClick={() => handleTemplateSelect("wishes")}
            className="text-[11px] bg-amber-50 text-glgold hover:bg-amber-100 px-2.5 py-1 rounded-lg font-bold border border-glgold/30"
          >
            Festive Wishes
          </button>
          <button
            type="button"
            onClick={() => handleTemplateSelect("invitation")}
            className="text-[11px] bg-teal-50 text-glblue-750 hover:bg-teal-100 px-2.5 py-1 rounded-lg font-bold border border-teal-200"
          >
            Alumni Keynote Invite
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Target Audience Batch
          </label>
          <select
            value={targetBatch}
            onChange={(e) => setTargetBatch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-glblue-750"
          >
            <option value="all">All Alumni Batches (2005 - 2026)</option>
            <option value="2024">Batch of 2024</option>
            <option value="2023">Batch of 2023</option>
            <option value="2022">Batch of 2022</option>
            <option value="2021">Batch of 2021</option>
            <option value="2020">Batch of 2020</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Subject / Greeting Header *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Heartiest Congratulations on Foundation Day!"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-glblue-750"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Personalized Message Content *
          </label>
          <textarea
            rows="4"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your wishes or message from the college administration..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-glblue-750 leading-relaxed"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-glgold hover:bg-glgold-dark text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Broadcast to Alumni</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
