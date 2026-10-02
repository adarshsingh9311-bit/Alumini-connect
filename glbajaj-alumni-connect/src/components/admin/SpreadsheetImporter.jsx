import React, { useState } from "react";
import * as XLSX from "xlsx";
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Check, 
  Loader2, 
  Eye, 
  ShieldCheck, 
  ClipboardCheck, 
  CheckCheck 
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

export default function SpreadsheetImporter({ onImportComplete }) {
  const { addToast } = useToast();
  const [file, setFile] = useState(null);
  const [targetType, setTargetType] = useState("alumni"); // alumni | student
  const [parsedRows, setParsedRows] = useState([]);
  const [validationReport, setValidationReport] = useState(null);
  const [importing, setImporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 6-step state
  // 1: Upload, 2: Preview, 3: Validate, 4: Show Errors, 5: Confirm, 6: Success
  let currentStep = 1;
  if (isSuccess) currentStep = 6;
  else if (importing) currentStep = 5;
  else if (validationReport && validationReport.invalid > 0) currentStep = 4;
  else if (validationReport) currentStep = 3;
  else if (parsedRows.length > 0) currentStep = 2;

  const steps = [
    { num: 1, label: "Upload", icon: Upload },
    { num: 2, label: "Preview", icon: Eye },
    { num: 3, label: "Validate", icon: ShieldCheck },
    { num: 4, label: "Show Errors", icon: AlertTriangle },
    { num: 5, label: "Confirm", icon: ClipboardCheck },
    { num: 6, label: "Success", icon: CheckCheck }
  ];

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    setIsSuccess(false);
    setFile(selected);
    processFile(selected);
  }

  function processFile(selectedFile) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (!json || json.length === 0) {
          addToast("Uploaded spreadsheet appears to be empty.", "error");
          return;
        }

        // Validate records
        const validated = json.map((row, idx) => {
          const errors = [];
          const roll = String(row.roll_number || row["Roll No"] || row.RollNumber || "").trim();
          const name = String(row.full_name || row.Name || row["Full Name"] || "").trim();
          const email = String(row.email || row.Email || "").trim();

          if (!roll) errors.push("Missing Roll Number");
          if (!name) errors.push("Missing Full Name");
          if (!email || !email.includes("@")) errors.push("Invalid Email format");

          return {
            rowIndex: idx + 1,
            data: {
              roll_number: roll || "MISSING",
              full_name: name || "MISSING",
              email: email || "MISSING",
              branch: String(row.branch || row.Branch || "CSE").toUpperCase(),
              batch_year: String(row.batch_year || row.Batch || "2024"),
              current_company: String(row.current_company || row.Company || ""),
              current_designation: String(row.current_designation || row.Designation || "")
            },
            isValid: errors.length === 0,
            errors
          };
        });

        const validCount = validated.filter((r) => r.isValid).length;
        const errorCount = validated.length - validCount;

        setParsedRows(validated);
        setValidationReport({
          total: validated.length,
          valid: validCount,
          invalid: errorCount
        });

        addToast(`Parsed ${validated.length} records (${validCount} valid, ${errorCount} errors)`, "info");
      } catch (err) {
        addToast("Failed to parse spreadsheet file: " + err.message, "error");
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  }

  function handleCommitImport() {
    if (!validationReport || validationReport.valid === 0) {
      addToast("No valid records to import.", "error");
      return;
    }
    setImporting(true);

    setTimeout(() => {
      const validRecords = parsedRows.filter((r) => r.isValid).map((r) => r.data);
      onImportComplete({
        filename: file?.name || "import_data.xlsx",
        total: validationReport.total,
        valid: validationReport.valid,
        invalid: validationReport.invalid,
        records: validRecords,
        type: targetType
      });

      addToast(`Successfully imported ${validRecords.length} ${targetType} records!`, "success");
      setImporting(false);
      setIsSuccess(true);
    }, 1200);
  }

  function handleReset() {
    setFile(null);
    setParsedRows([]);
    setValidationReport(null);
    setIsSuccess(false);
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-8">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-glgold" />
          <span>Excel & CSV Bulk Data Import Engine</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload alumni or student rosters to preview records, validate roll numbers, flag formatting issues, and sync to the central roster.
        </p>
      </div>

      {/* 6-Step Visual Progress Stepper */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.num || (step.num === 6 && isSuccess);
            const isCurrent = currentStep === step.num;

            return (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs font-bold transition shadow-sm ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                        ? "bg-glgold text-slate-950 font-black ring-4 ring-amber-100"
                        : "bg-white text-slate-400 border border-slate-200"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[10px] sm:text-xs mt-1.5 font-bold ${
                    isCurrent ? "text-glgold" : isCompleted ? "text-emerald-700" : "text-slate-400"
                  }`}>
                    {step.label}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 sm:mx-2 transition ${
                      currentStep > step.num ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Target Type Selector */}
      <div className="flex items-center space-x-6">
        <span className="text-xs font-bold text-slate-700 uppercase">Target Directory:</span>
        <label className="flex items-center space-x-2 text-xs font-semibold text-slate-800 cursor-pointer">
          <input
            type="radio"
            name="targetType"
            value="alumni"
            checked={targetType === "alumni"}
            onChange={() => setTargetType("alumni")}
            className="text-glgold focus:ring-glgold"
          />
          <span>Alumni Records</span>
        </label>
        <label className="flex items-center space-x-2 text-xs font-semibold text-slate-800 cursor-pointer">
          <input
            type="radio"
            name="targetType"
            value="student"
            checked={targetType === "student"}
            onChange={() => setTargetType("student")}
            className="text-glblue-750 focus:ring-glblue-750"
          />
          <span>Student Records</span>
        </label>
      </div>

      {/* Upload Zone */}
      {!parsedRows.length && !isSuccess && (
        <div
          onClick={() => document.getElementById("excel-file-input").click()}
          className="border-2 border-dashed border-slate-300 hover:border-glgold rounded-2xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-amber-50/20 transition space-y-3"
        >
          <input
            id="excel-file-input"
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-14 h-14 bg-teal-50 text-glblue-750 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">Click to upload or drag & drop spreadsheet</h4>
            <p className="text-xs text-slate-500 mt-0.5">Supports Microsoft Excel (.xlsx, .xls) or comma-separated (.csv)</p>
          </div>
          <div className="inline-block bg-glblue-750 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm">
            Select Spreadsheet File
          </div>
        </div>
      )}

      {/* Success State Screen */}
      {isSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <CheckCheck className="w-7 h-7" />
          </div>
          <h4 className="font-black text-slate-900 text-lg">Batch Import Completed Successfully!</h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            All validated records have been synced with the GLB Alumni central directory. Audit logs have been recorded.
          </p>
          <button
            onClick={handleReset}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-md"
          >
            Import Another Batch
          </button>
        </div>
      )}

      {/* Validation Summary Bar */}
      {validationReport && !isSuccess && (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-6 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Total Records</span>
              <strong className="text-slate-900 text-sm">{validationReport.total}</strong>
            </div>
            <div>
              <span className="text-emerald-600 block font-semibold uppercase text-[10px]">Valid & Ready</span>
              <strong className="text-emerald-700 text-sm flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{validationReport.valid}</span>
              </strong>
            </div>
            <div>
              <span className="text-red-500 block font-semibold uppercase text-[10px]">Errors / Conflicts</span>
              <strong className="text-red-600 text-sm flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                <span>{validationReport.invalid}</span>
              </strong>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Reset
            </button>
            <button
              onClick={handleCommitImport}
              disabled={importing || validationReport.valid === 0}
              className="bg-glgold hover:bg-glgold-dark text-white text-xs font-bold px-6 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5 disabled:opacity-50"
            >
              {importing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Commit {validationReport.valid} Records</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Spreadsheet Live Preview Table */}
      {parsedRows.length > 0 && !isSuccess && (
        <div className="overflow-x-auto border border-slate-200 rounded-2xl max-h-80 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase sticky top-0">
              <tr className="border-b border-slate-200">
                <th className="px-4 py-2.5">Row</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Roll Number</th>
                <th className="px-4 py-2.5">Full Name</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Branch</th>
                <th className="px-4 py-2.5">Batch</th>
                {targetType === "alumni" && <th className="px-4 py-2.5">Company & Role</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parsedRows.map((r) => (
                <tr
                  key={r.rowIndex}
                  className={`hover:bg-slate-50 ${!r.isValid ? "bg-red-50/50" : "bg-white"}`}
                >
                  <td className="px-4 py-2.5 text-slate-400 font-mono">{r.rowIndex}</td>
                  <td className="px-4 py-2.5">
                    {r.isValid ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Valid
                      </span>
                    ) : (
                      <span
                        className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        title={r.errors.join(", ")}
                      >
                        {r.errors[0]}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-mono font-bold text-slate-800">{r.data.roll_number}</td>
                  <td className="px-4 py-2.5 font-semibold text-slate-900">{r.data.full_name}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r.data.email}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r.data.branch}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r.data.batch_year}</td>
                  {targetType === "alumni" && (
                    <td className="px-4 py-2.5 text-slate-600">
                      {r.data.current_designation ? `${r.data.current_designation} @ ${r.data.current_company}` : "-"}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
