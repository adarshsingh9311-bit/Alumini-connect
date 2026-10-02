import React, { useState } from "react";
import SpreadsheetImporter from "../../components/admin/SpreadsheetImporter";
import { INITIAL_IMPORT_HISTORY } from "../../lib/mockData";
import { FileSpreadsheet, Clock, CheckCircle2, History } from "lucide-react";

export default function AdminImportPage() {
  const [history, setHistory] = useState(INITIAL_IMPORT_HISTORY);

  function handleImportComplete(result) {
    const newLog = {
      id: "imp-" + Date.now(),
      filename: result.filename,
      imported_by: "Admin Central Office",
      total_rows: result.total,
      imported_count: result.valid,
      error_count: result.invalid,
      status: result.invalid === 0 ? "Completed Successfully" : "Completed with Conflicts",
      created_at: new Date().toISOString()
    };
    setHistory([newLog, ...history]);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Spreadsheet Batch Data Engine</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Import batches of students or alumni from Excel (.xlsx) and CSV files with duplicate detection, validation preview, and audit history.
        </p>
      </div>

      {/* Spreadsheet Importer Component */}
      <SpreadsheetImporter onImportComplete={handleImportComplete} />

      {/* Import History Table */}
      <div className="bg-white rounded-3xl border border-teal-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <History className="w-4 h-4 text-glgold" />
            <span>Spreadsheet Import History Audit Log</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Logged in `import_history`</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Filename</th>
                <th className="px-6 py-3.5">Imported By</th>
                <th className="px-6 py-3.5">Total Rows</th>
                <th className="px-6 py-3.5">Imported Count</th>
                <th className="px-6 py-3.5">Errors / Conflicts</th>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{h.filename}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{h.imported_by}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{h.total_rows}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">{h.imported_count}</td>
                  <td className="px-6 py-4 font-bold text-red-600">{h.error_count}</td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(h.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="bg-teal-50 text-glblue-750 border border-teal-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
