import React, { useState, useEffect } from "react";
import { EVENT_CATEGORIES } from "../../lib/constants";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import { Calendar, Plus, Trash2, MapPin, Clock, Loader2 } from "lucide-react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    event_type: "offline",
    registration_link: ""
  });

  useEffect(() => {
    async function fetchEvents() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setEvents(data);
        }
      } catch (err) {
        console.warn("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("events")
          .insert({
            title: newEvent.title,
            description: newEvent.description,
            date: newEvent.date,
            time: newEvent.time,
            location: newEvent.location,
            event_type: newEvent.event_type || "offline",
            registration_link: newEvent.registration_link || null,
            is_published: true
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setEvents([data, ...events]);
      } catch (err) {
        addToast(err.message || "Failed to create event.", "error");
        return;
      }
    } else {
      const item = { id: "ev-" + Date.now(), ...newEvent };
      setEvents([item, ...events]);
    }

    addToast("Campus event scheduled successfully!", "success");
    setIsModalOpen(false);
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      event_type: "offline",
      registration_link: ""
    });
  }

  async function handleDelete(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("events").delete().eq("id", id);
      } catch (err) {
        console.warn("Error deleting event:", err);
      }
    }
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    addToast("Event removed.", "info");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0C1929] font-serif">Campus Events & Reunions</h1>
          <p className="text-xs sm:text-sm text-[#718096] mt-1">
            Schedule official alumni reunions, convocations, webinar sessions, and campus visits.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#C29B38] hover:bg-[#B57C34] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Event</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#C29B38] mb-3" />
          <p className="text-sm">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="No events scheduled"
          message="Schedule reunions, convocations and workshops for GL Bajaj alumni and students."
          actionLabel="Schedule First Event"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-2xl p-6 border border-[#E7E1D4] shadow-xs hover:border-[#C29B38]/50 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FAF8F5] text-[#8C7138] px-2.5 py-1 rounded border border-[#E7E1D4]">
                    {ev.event_type || "Event"}
                  </span>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="text-slate-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-extrabold text-[#0C1929] text-lg leading-snug font-serif">{ev.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ev.description}</p>

                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E7E1D4] text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#C29B38] shrink-0" />
                    <strong>{ev.date}</strong>
                  </div>
                  {ev.time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#0C1929] shrink-0" />
                      <span>{ev.time}</span>
                    </div>
                  )}
                  {ev.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{ev.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Official Campus Event"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreate} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Title</label>
            <input
              type="text"
              required
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="e.g. Annual Alumni Convocation 2026"
              className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-4 py-2 text-xs sm:text-sm text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
              <input
                type="text"
                required
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                placeholder="e.g. Nov 15, 2026"
                className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-4 py-2 text-xs text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Time</label>
              <input
                type="text"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                placeholder="e.g. 10:00 AM - 4:00 PM"
                className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-4 py-2 text-xs text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Venue / Platform</label>
            <input
              type="text"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              placeholder="e.g. Main Auditorium, GL Bajaj Campus"
              className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-4 py-2 text-xs sm:text-sm text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Description</label>
            <textarea
              rows={3}
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Brief summary of event objectives and agenda..."
              className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl p-3 text-xs text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#718096] hover:bg-[#FAF8F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0C1929] hover:bg-[#1A2C42] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs"
            >
              Schedule Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
