import React, { useState, useEffect } from "react";
import SpreadsheetImporter from "../../components/admin/SpreadsheetImporter";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { FileSpreadsheet, Clock, CheckCircle2, History, Loader2 } from "lucide-react";

export default function AdminImportPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("import_history")
          .select("*, profiles(full_name)")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setHistory(data.map(h => ({
            id: h.id,
            filename: h.file_name,
            imported_by: h.profiles?.full_name || "Admin Central Office",
            total_rows: h.record_count,
            imported_count: h.record_count,
            error_count: 0,
            status: "Completed Successfully",
            created_at: h.created_at
          })));
        }
      } catch (err) {
        console.warn("Error fetching import history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  async function handleImportComplete(result) {
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

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("import_history").insert({
          file_name: result.filename,
          record_count: result.valid,
          imported_by: user?.id || null
        });
      } catch (err) {
        console.warn("Failed to record import history:", err);
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0C1929] font-serif">Spreadsheet Batch Data Engine</h1>
        <p className="text-xs sm:text-sm text-[#718096] mt-1">
          Import batches of students or alumni from Excel (.xlsx) and CSV files with duplicate detection, validation preview, and audit history.
        </p>
      </div>

      {/* Spreadsheet Importer Component */}
      <SpreadsheetImporter onImportComplete={handleImportComplete} />

      {/* Import History Table */}
      <div className="bg-white rounded-3xl border border-[#E7E1D4] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E7E1D4] flex justify-between items-center bg-[#FAF8F5]">
          <h3 className="font-bold text-[#0C1929] text-sm flex items-center gap-2 font-serif">
            <History className="w-4 h-4 text-[#C29B38]" />
            <span>Spreadsheet Import History Audit Log</span>
          </h3>
          <span className="text-xs text-[#718096] font-medium">Recorded in Database</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C29B38] mb-2" />
            <p className="text-xs">Loading import audit history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No spreadsheet batch imports recorded yet. Upload a roster above to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#FAF8F5] text-slate-600 font-bold uppercase tracking-wider border-b border-[#E7E1D4]">
                <tr>
                  <th className="px-6 py-3.5">Filename</th>
                  <th className="px-6 py-3.5">Imported By</th>
                  <th className="px-6 py-3.5 text-center">Total Rows</th>
                  <th className="px-6 py-3.5 text-center">Imported</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E1D4]">
                {history.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAF8F5]/60 transition">
                    <td className="px-6 py-4 font-mono font-bold text-[#0C1929]">{log.filename}</td>
                    <td className="px-6 py-4 text-slate-600">{log.imported_by}</td>
                    <td className="px-6 py-4 text-center font-mono">{log.total_rows}</td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-emerald-700">{log.imported_count}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{log.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
