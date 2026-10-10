import React, { useState, useEffect } from "react";
import SpreadsheetImporter from "../../components/admin/SpreadsheetImporter";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { FileSpreadsheet, History, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

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
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setHistory(data.map(h => ({
            id: h.id,
            filename: h.file_name,
            file_type: h.file_type || "Roster",
            total_rows: h.total_rows || 0,
            successful_rows: h.successful_rows || 0,
            failed_rows: h.failed_rows || 0,
            status: h.status || "completed",
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
      file_type: result.type,
      total_rows: result.total,
      successful_rows: result.valid,
      failed_rows: result.invalid,
      status: result.invalid === 0 ? "completed" : "completed_with_errors",
      created_at: new Date().toISOString()
    };
    setHistory(prev => [newLog, ...prev]);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-[#7A1F24] text-xs font-bold uppercase tracking-wider mb-1">
          <FileSpreadsheet className="w-4 h-4 text-[#7A1F24]" />
          <span>Central Administration • Record Enrollment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#202124] font-serif">
          Student & Alumni Data Importer
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Download standardized CSV templates generated directly from the college database schema, validate records with duplicate detection, and import student/alumni rosters.
        </p>
      </div>

      {/* Spreadsheet Importer Component */}
      <SpreadsheetImporter onImportComplete={handleImportComplete} />

      {/* Import History Audit Log */}
      <div className="bg-white rounded-lg border border-[#D9DDE3] shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#D9DDE3] flex justify-between items-center bg-[#F7F3EA]">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-[#7A1F24]" />
            <h3 className="font-bold text-[#202124] text-xs sm:text-sm uppercase tracking-wide">
              Import History & Audit Log
            </h3>
          </div>
          <span className="text-xs text-[#667085] font-medium">Recorded in Database</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[#667085]">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#7A1F24] mb-2" />
            <p className="text-xs">Loading import history from database...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="p-8 text-center text-[#667085] text-xs bg-[#F7F3EA]/30">
            No batch imports recorded yet. Select a roster above to download the template and import records.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F7F3EA] text-[#667085] font-bold uppercase tracking-wider border-b border-[#D9DDE3]">
                <tr>
                  <th className="px-4 py-3">File Name</th>
                  <th className="px-4 py-3">Roster Type</th>
                  <th className="px-4 py-3 text-center">Total Rows</th>
                  <th className="px-4 py-3 text-center">Imported</th>
                  <th className="px-4 py-3 text-center">Rejected</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DDE3]">
                {history.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F7F3EA]/50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-[#202124]">{log.filename}</td>
                    <td className="px-4 py-3 text-[#667085] uppercase font-semibold text-[11px]">
                      {log.file_type}
                    </td>
                    <td className="px-4 py-3 text-center font-mono">{log.total_rows}</td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-[#2E6B4A]">
                      {log.successful_rows}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-[#B42318]">
                      {log.failed_rows || 0}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        log.status === "completed"
                          ? "bg-green-50 text-[#2E6B4A] border border-green-200"
                          : "bg-amber-50 text-[#A66A00] border border-amber-200"
                      }`}>
                        {log.status === "completed" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        <span>{log.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#667085] font-mono text-[11px]">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : "Recent"}
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
