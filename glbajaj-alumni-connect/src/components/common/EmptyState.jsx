import React from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "No records found",
  description = "There are no items matching your criteria at the moment.",
  actionLabel,
  onAction
}) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-[#faf6eb] text-[#592106] flex items-center justify-center shadow-inner">
        <Icon className="w-7 h-7 text-[#592106]" />
      </div>
      <h4 className="font-bold text-slate-800 text-base">{title}</h4>
      <p className="text-slate-500 text-xs sm:text-sm max-w-md leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 bg-[#592106] hover:bg-[#472510] text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
