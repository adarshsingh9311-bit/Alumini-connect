import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { INITIAL_ALUMNI } from "../../lib/mockData";
import CareerHistoryManager from "../../components/alumni/CareerHistoryManager";
import { TrendingUp, Briefcase } from "lucide-react";

export default function AlumniCareerJourneyPage() {
  const { profile } = useAuth();
  const current = profile || INITIAL_ALUMNI[0];
  const [careerHistory, setCareerHistory] = useState(current.career_history || []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200 text-glblue-750 text-xs px-3 py-1 rounded-full font-bold uppercase mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Professional Timeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">My Career Journey</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Chronicle your career milestones from graduation to leadership roles. Inspires juniors and informs faculty.
        </p>
      </div>

      <CareerHistoryManager
        careerHistory={careerHistory}
        onUpdate={setCareerHistory}
      />
    </div>
  );
}
