import React, { useState } from "react";
import { INITIAL_ACHIEVEMENTS } from "../../lib/mockData";
import { useToast } from "../../context/ToastContext";
import { Award, CheckCircle2, Trash2 } from "lucide-react";

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState(INITIAL_ACHIEVEMENTS);
  const { addToast } = useToast();

  function handleDelete(id) {
    setAchievements(achievements.filter((a) => a.id !== id));
    addToast("Achievement entry removed.", "info");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Alumni Achievements & Accolades</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review alumni milestone submissions, verified whitepapers, patents, and featured success stories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="bg-white rounded-3xl p-6 border border-teal-100 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-glblue-750">{ach.alumni_name} ({ach.alumni_batch})</span>
                <button
                  onClick={() => handleDelete(ach.id)}
                  className="text-slate-400 hover:text-red-600 p-1"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base">{ach.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl">
                {ach.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified by Admin</span>
              </span>
              <span className="text-slate-400">{ach.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
