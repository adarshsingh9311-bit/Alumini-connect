import React from "react";

export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <div className="w-10 h-10 border-3 border-teal-200 border-t-glblue-750 rounded-full animate-spin"></div>
      <p className="text-xs font-semibold text-slate-500">{text}</p>
    </div>
  );
}
