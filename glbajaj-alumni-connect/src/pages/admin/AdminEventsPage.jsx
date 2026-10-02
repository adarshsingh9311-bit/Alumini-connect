import React, { useState } from "react";
import { INITIAL_EVENTS } from "../../lib/mockData";
import { EVENT_CATEGORIES } from "../../lib/constants";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";
import { Calendar, Plus, Trash2, MapPin, Clock, Users } from "lucide-react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    category: EVENT_CATEGORIES[0]
  });

  function handleCreate(e) {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    const item = {
      id: "ev-" + Date.now(),
      ...newEvent,
      rsvps: []
    };
    setEvents([item, ...events]);
    addToast("Campus event scheduled successfully!", "success");
    setIsModalOpen(false);
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      category: EVENT_CATEGORIES[0]
    });
  }

  function handleDelete(id) {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    addToast("Event removed.", "info");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Manage Campus Events & Meets</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize alumni meets, technical webinars, advisory roundtables, and monitor real-time RSVP counts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-glgold hover:bg-glgold-dark text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="bg-white rounded-2xl p-6 border border-teal-100 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-glblue-750 px-2.5 py-1 rounded">
                  {ev.category}
                </span>
                <button
                  onClick={() => handleDelete(ev.id)}
                  className="text-slate-400 hover:text-red-600 p-1"
                  title="Delete event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-extrabold text-slate-900 text-lg leading-snug">{ev.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{ev.description}</p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-glgold" />
                  <strong>{ev.date}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-glblue-750" />
                  <span>{ev.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>{ev.venue}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-glblue-750" />
                <strong>{ev.rsvps?.length || 0}</strong> Registered Attendees
              </span>
              <span className="text-emerald-600 font-bold">Active Registration</span>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Campus Event / Reunion"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Event Category</label>
            <select
              value={newEvent.category}
              onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
            >
              {EVENT_CATEGORIES.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="e.g. GL Bajaj Annual Alumni Gala 2026"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Date *</label>
              <input
                type="date"
                required
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Time *</label>
              <input
                type="text"
                required
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                placeholder="e.g. 10:30 AM IST"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Venue / Platform *</label>
            <input
              type="text"
              required
              value={newEvent.venue}
              onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
              placeholder="e.g. Main Open-Air Auditorium, Greater Noida Campus / Virtual Zoom"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Description *</label>
            <textarea
              rows="3"
              required
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Provide event details, itinerary, or guest of honor..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs leading-relaxed focus:ring-2 focus:ring-glblue-750 focus:outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-glgold hover:bg-glgold-dark text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-md"
            >
              Save & Broadcast Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
