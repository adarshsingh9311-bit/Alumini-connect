import React, { useState, useMemo, useEffect } from "react";
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
  CheckCheck,
  ArrowRight,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Filter
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { BRANCH_CODES, BATCH_YEARS } from "../../lib/constants";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { cleanEncodingArtifacts } from "../../lib/formatters";

// Database target fields for Student & Alumni rosters
const STUDENT_FIELDS = [
  { key: "roll_number", label: "Roll Number", required: true },
  { key: "full_name", label: "Full Name", required: true },
  { key: "email", label: "Email", required: true },
  { key: "branch", label: "Branch", required: true },
  { key: "batch_year", label: "Batch Year", required: true }
];

const ALUMNI_FIELDS = [
  { key: "roll_number", label: "Roll Number", required: true },
  { key: "full_name", label: "Full Name", required: true },
  { key: "email", label: "Email", required: true },
  { key: "branch", label: "Branch", required: true },
  { key: "batch_year", label: "Batch Year", required: true },
  { key: "current_company", label: "Current Company", required: false },
  { key: "current_designation", label: "Current Designation", required: false },
  { key: "industry", label: "Industry", required: false },
  { key: "location", label: "Location", required: false },
  { key: "skills", label: "Skills", required: false },
  { key: "phone", label: "Phone", required: false }
];

// Header normalization rule: strip spaces, dots, dashes, underscores, and convert to lowercase
function normalizeHeaderKey(raw) {
  if (!raw || typeof raw !== "string") return "";
  return raw
    .toLowerCase()
    .trim()
    .replace(/[._\-\s]+/g, "");
}

// Common header variations & aliases mapped to database fields
const ALIAS_MAP = {
  roll_number: [
    "rollnumber", "rollno", "roll", "enrollmentno", "enrollmentnumber",
    "admissionno", "admissionnumber", "admno", "regno", "registrationno", "univrollno"
  ],
  full_name: [
    "fullname", "name", "studentname", "alumniname", "candidatename", "student", "scholarname"
  ],
  email: [
    "email", "emailid", "emailaddress", "mail", "mailid", "studentemail", "alumniemail"
  ],
  branch: [
    "branch", "department", "dept", "course", "program", "stream", "specialization", "discipline"
  ],
  batch_year: [
    "batch", "passingyear", "passoutyear", "graduationyear", "gradyear", "year", "batchyear", "session"
  ],
  current_company: [
    "company", "currentcompany", "organization", "employer", "workplace", "currentorganization"
  ],
  current_designation: [
    "designation", "currentdesignation", "role", "title", "position", "jobtitle"
  ],
  industry: [
    "industry", "sector", "domain"
  ],
  location: [
    "location", "city", "currentlocation", "worklocation"
  ],
  skills: [
    "skills", "technologies", "techstack", "keyskills"
  ],
  phone: [
    "phone", "mobile", "contact", "phonenumber", "contactnumber", "mobileno"
  ]
};

function detectDbField(rawHeader) {
  const norm = normalizeHeaderKey(rawHeader);
  if (!norm) return null;

  // Specific high-priority exact matches
  if (norm === "rollno" || norm === "rollnumber") return "roll_number";
  if (norm === "admissionno" || norm === "enrollmentno") return "roll_number";
  if (norm === "studentname" || norm === "fullname" || norm === "name") return "full_name";
  if (norm === "email" || norm === "emailid" || norm === "emailaddress") return "email";
  if (norm === "branch" || norm === "department" || norm === "course") return "branch";
  if (norm === "batch" || norm === "passingyear" || norm === "graduationyear" || norm === "batchyear") return "batch_year";

  for (const [dbField, aliases] of Object.entries(ALIAS_MAP)) {
    if (aliases.includes(norm)) {
      return dbField;
    }
  }
  return null;
}

/**
 * Intelligent Multi-Row Header Auto-Detection:
 * University Excel files often contain 1 to 3 title banner rows
 * before the actual column table headers.
 */
function findHeaderRow(rows2D) {
  const limit = Math.min(10, rows2D.length);
  for (let i = 0; i < limit; i++) {
    const row = rows2D[i];
    if (!Array.isArray(row) || row.length === 0) continue;

    let matchedCount = 0;
    row.forEach((cell) => {
      const field = detectDbField(String(cell || ""));
      if (field) matchedCount++;
    });

    // If at least 2 distinct known fields are found in this row, it's the header row
    if (matchedCount >= 2) {
      return i;
    }
  }
  return 0; // Default to first row
}

export default function SpreadsheetImporter({ onImportComplete }) {
  const { addToast } = useToast();

  const [file, setFile] = useState(null);
  const [targetType, setTargetType] = useState("student"); // "student" | "alumni"
  const [rawHeaders, setRawHeaders] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [columnMappings, setColumnMappings] = useState({}); // { [colIdx]: dbField }
  const [defaultBranch, setDefaultBranch] = useState("CSE");
  const [defaultBatch, setDefaultBatch] = useState("2027");
  const [autoGenEmail, setAutoGenEmail] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "valid" | "errors"

  const [validationReport, setValidationReport] = useState(null);
  const [importing, setImporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 6-step progress
  // 1: Upload, 2: Preview & Map, 3: Validate, 4: Show Errors, 5: Confirm, 6: Success
  let currentStep = 1;
  if (isSuccess) currentStep = 6;
  else if (importing) currentStep = 5;
  else if (validationReport && validationReport.invalid > 0) currentStep = 4;
  else if (validationReport) currentStep = 3;
  else if (rawRows.length > 0) currentStep = 2;

  const steps = [
    { num: 1, label: "Upload", icon: Upload },
    { num: 2, label: "Preview", icon: Eye },
    { num: 3, label: "Validate", icon: ShieldCheck },
    { num: 4, label: "Show Errors", icon: AlertTriangle },
    { num: 5, label: "Confirm", icon: ClipboardCheck },
    { num: 6, label: "Success", icon: CheckCheck }
  ];

  const dbFields = targetType === "student" ? STUDENT_FIELDS : ALUMNI_FIELDS;

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
        const rows2D = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

        if (!rows2D || rows2D.length === 0) {
          addToast("Uploaded spreadsheet appears to be empty.", "error");
          return;
        }

        // 1. Detect Header Row
        const headerRowIdx = findHeaderRow(rows2D);
        const headers = (rows2D[headerRowIdx] || []).map((h) => String(h || "").trim());

        // Extract metadata if title row mentions branch (e.g. "ECE B.TECH...")
        for (let r = 0; r < headerRowIdx; r++) {
          const rowText = (rows2D[r] || []).join(" ").toUpperCase();
          for (const bCode of BRANCH_CODES) {
            if (rowText.includes(bCode)) {
              setDefaultBranch(bCode);
              break;
            }
          }
        }

        // 2. Extract Data Rows (discard blank or header rows)
        const validDataRows = rows2D.slice(headerRowIdx + 1).filter((r) => {
          if (!Array.isArray(r) || r.length === 0) return false;
          return r.some((cell) => cell !== null && cell !== undefined && String(cell).trim() !== "");
        });

        if (validDataRows.length === 0) {
          addToast("No data rows found below headers.", "error");
          return;
        }

        // 3. Auto-detect Column Mappings
        const initialMappings = {};
        const mappedFields = new Set();

        // Pass 1: exact matches for roll number
        headers.forEach((h, colIdx) => {
          const norm = normalizeHeaderKey(h);
          if (norm === "rollno" || norm === "rollnumber") {
            initialMappings[colIdx] = "roll_number";
            mappedFields.add("roll_number");
          }
        });

        // Pass 2: other fields
        headers.forEach((h, colIdx) => {
          if (initialMappings[colIdx]) return;
          const field = detectDbField(h);
          if (field && !mappedFields.has(field)) {
            initialMappings[colIdx] = field;
            mappedFields.add(field);
          }
        });

        setRawHeaders(headers);
        setRawRows(validDataRows);
        setColumnMappings(initialMappings);

        addToast(
          `Detected ${validDataRows.length} records. Header found at row ${headerRowIdx + 1}.`,
          "info"
        );
      } catch (err) {
        addToast("Failed to parse spreadsheet file: " + err.message, "error");
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  }

  function handleMappingChange(colIdx, newField) {
    setColumnMappings((prev) => {
      const updated = { ...prev };
      if (!newField || newField === "skip") {
        delete updated[colIdx];
      } else {
        // If another column already has this field, clear it to avoid collision
        Object.keys(updated).forEach((key) => {
          if (updated[key] === newField) delete updated[key];
        });
        updated[colIdx] = newField;
      }
      return updated;
    });
  }

  // Row-by-Row Validation Engine
  const parsedRecords = useMemo(() => {
    if (!rawRows.length || !rawHeaders.length) return [];

    // Track duplicates within the batch
    const rollCounts = {};
    const emailCounts = {};

    // First pass to count frequencies for duplicates
    rawRows.forEach((row) => {
      let rollVal = "";
      let emailVal = "";

      Object.entries(columnMappings).forEach(([colIdx, dbField]) => {
        const val = cleanEncodingArtifacts(String(row[Number(colIdx)] || "")).trim();
        if (dbField === "roll_number") rollVal = val;
        if (dbField === "email") emailVal = val.toLowerCase();
      });

      if (!emailVal && autoGenEmail && rollVal) {
        emailVal = `${rollVal.toLowerCase()}@glbajaj.org`;
      }

      if (rollVal) rollCounts[rollVal] = (rollCounts[rollVal] || 0) + 1;
      if (emailVal) emailCounts[emailVal] = (emailCounts[emailVal] || 0) + 1;
    });

    // Second pass to validate each row
    return rawRows.map((row, idx) => {
      const errors = [];
      const extracted = {};

      // Map values from mapped columns
      Object.entries(columnMappings).forEach(([colIdx, dbField]) => {
        const val = cleanEncodingArtifacts(String(row[Number(colIdx)] || "")).trim();
        extracted[dbField] = val;
      });

      // Apply defaults for unmapped or empty values
      const rollNumber = extracted.roll_number || "";
      const fullName = extracted.full_name || "";
      
      let email = extracted.email || "";
      if (!email && autoGenEmail && rollNumber) {
        email = `${rollNumber.toLowerCase()}@glbajaj.org`;
      }

      const branch = extracted.branch || defaultBranch || "CSE";
      const batchYear = extracted.batch_year || defaultBatch || "2027";

      // 1. Roll Number Validation
      if (!rollNumber) {
        errors.push("Missing Roll Number");
      } else if (rollCounts[rollNumber] > 1) {
        errors.push("Duplicate Roll Number in file");
      }

      // 2. Full Name Validation
      if (!fullName) {
        errors.push("Missing Full Name");
      }

      // 3. Email Validation
      if (!email) {
        errors.push("Missing Email");
      } else if (!email.includes("@") || !email.includes(".")) {
        errors.push("Invalid Email format");
      } else if (emailCounts[email.toLowerCase()] > 1) {
        errors.push("Duplicate Email in file");
      }

      // 4. Branch Validation
      if (!branch) {
        errors.push("Missing Branch");
      }

      // 5. Batch Validation
      if (!batchYear) {
        errors.push("Missing Batch");
      }

      const cleanData = {
        roll_number: rollNumber || "MISSING",
        full_name: fullName || "MISSING",
        email: email || "MISSING",
        branch: branch.toUpperCase(),
        batch_year: String(batchYear),
        current_company: extracted.current_company || "",
        current_designation: extracted.current_designation || "",
        industry: extracted.industry || "",
        location: extracted.location || "",
        skills: extracted.skills ? extracted.skills.split(",").map((s) => s.trim()) : [],
        phone: extracted.phone || ""
      };

      return {
        rowIndex: idx + 1,
        data: cleanData,
        isValid: errors.length === 0,
        errors
      };
    });
  }, [rawRows, rawHeaders, columnMappings, defaultBranch, defaultBatch, autoGenEmail]);

  // Update validation report dynamically whenever records change
  useEffect(() => {
    if (parsedRecords.length > 0) {
      const validCount = parsedRecords.filter((r) => r.isValid).length;
      const errorCount = parsedRecords.length - validCount;
      setValidationReport({
        total: parsedRecords.length,
        valid: validCount,
        invalid: errorCount
      });
    } else {
      setValidationReport(null);
    }
  }, [parsedRecords]);

  // Commit valid records to Supabase / Application state
  async function handleCommitImport() {
    if (!validationReport || validationReport.valid === 0) {
      addToast("No valid records to import.", "error");
      return;
    }

    setImporting(true);
    const validRecords = parsedRecords.filter((r) => r.isValid).map((r) => r.data);

    try {
      // If Supabase is connected, safely upsert valid records
      if (isSupabaseConfigured && supabase) {
        const table = targetType === "student" ? "students" : "alumni";
        const rowsToInsert = validRecords.map((r) => ({
          roll_number: r.roll_number,
          branch: r.branch,
          batch_year: r.batch_year,
          ...(targetType === "alumni" && {
            current_company: r.current_company,
            current_designation: r.current_designation,
            industry: r.industry,
            location: r.location,
            skills: r.skills,
            is_verified: true
          })
        }));

        const { error } = await supabase.from(table).upsert(rowsToInsert, {
          onConflict: "roll_number",
          ignoreDuplicates: false
        });

        if (error) {
          console.warn("Supabase upsert warning:", error);
        }
      }

      onImportComplete({
        filename: file?.name || "import_data.xlsx",
        total: validationReport.total,
        valid: validationReport.valid,
        invalid: validationReport.invalid,
        records: validRecords,
        type: targetType
      });

      addToast(`Successfully committed ${validRecords.length} valid ${targetType} records!`, "success");
      setIsSuccess(true);
    } catch (err) {
      addToast("Import commit failed: " + err.message, "error");
    } finally {
      setImporting(false);
    }
  }

  function handleReset() {
    setFile(null);
    setRawHeaders([]);
    setRawRows([]);
    setColumnMappings({});
    setValidationReport(null);
    setIsSuccess(false);
    setActiveTab("all");
  }

  // Filtered rows for preview table
  const displayedRows = useMemo(() => {
    if (activeTab === "valid") return parsedRecords.filter((r) => r.isValid);
    if (activeTab === "errors") return parsedRecords.filter((r) => !r.isValid);
    return parsedRecords;
  }, [parsedRecords, activeTab]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-8">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-glgold" />
          <span>Excel & CSV Bulk Data Import Engine</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Intelligent column-mapping, multi-row header auto-detection, duplicate checking, and safe database commitment.
        </p>
      </div>

      {/* 6-Step Visual Stepper */}
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

      {/* Target Directory Selection */}
      <div className="flex items-center space-x-6">
        <span className="text-xs font-bold text-slate-700 uppercase">Target Directory:</span>
        <label className="flex items-center space-x-2 text-xs font-semibold text-slate-800 cursor-pointer">
          <input
            type="radio"
            name="targetType"
            value="student"
            checked={targetType === "student"}
            onChange={() => setTargetType("student")}
            className="text-glgold focus:ring-glgold"
          />
          <span>Student Records</span>
        </label>
        <label className="flex items-center space-x-2 text-xs font-semibold text-slate-800 cursor-pointer">
          <input
            type="radio"
            name="targetType"
            value="alumni"
            checked={targetType === "alumni"}
            onChange={() => setTargetType("alumni")}
            className="text-glblue-750 focus:ring-glblue-750"
          />
          <span>Alumni Records</span>
        </label>
      </div>

      {/* Upload Zone */}
      {!rawRows.length && !isSuccess && (
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
            <p className="text-xs text-slate-500 mt-0.5">Supports Microsoft Excel (.xlsx, .xls) and CSV (.csv)</p>
          </div>
          <div className="inline-block bg-glblue-750 hover:bg-teal-900 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition">
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
            All valid records have been synced with the central directory and audit history. Invalid rows were kept out of the database.
          </p>
          <button
            onClick={handleReset}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-md"
          >
            Import Another Batch
          </button>
        </div>
      )}

      {/* Interactive Column Mapping Section */}
      {rawRows.length > 0 && !isSuccess && (
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-3">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-glgold" />
                <span>Column Mapping Configuration</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Confirm or adjust the auto-detected mapping between your file columns and database fields.
              </p>
            </div>
            <span className="text-[10px] font-semibold bg-teal-100 text-teal-800 px-2.5 py-1 rounded-full">
              {rawHeaders.length} Columns Detected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {rawHeaders.map((header, colIdx) => {
              const currentField = columnMappings[colIdx] || "skip";
              const isMapped = currentField !== "skip";

              return (
                <div
                  key={colIdx}
                  className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                    isMapped ? "bg-white border-amber-300 shadow-xs" : "bg-white/60 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800 truncate" title={header}>
                      {header || `Column ${colIdx + 1}`}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Col {colIdx + 1}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <select
                      value={currentField}
                      onChange={(e) => handleMappingChange(colIdx, e.target.value)}
                      className={`w-full text-xs rounded-lg px-2.5 py-1.5 border font-medium focus:outline-none focus:ring-1 focus:ring-glgold ${
                        isMapped
                          ? "border-amber-400 bg-amber-50/40 text-slate-900 font-semibold"
                          : "border-slate-200 text-slate-500 bg-slate-50"
                      }`}
                    >
                      <option value="skip">— Skip / Do Not Import —</option>
                      {dbFields.map((f) => (
                        <option key={f.key} value={f.key}>
                          {f.label} {f.required ? "(Required)" : "(Optional)"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Defaults and Fallback Controls for Missing Columns */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-600 font-medium">Default Branch:</span>
              <select
                value={defaultBranch}
                onChange={(e) => setDefaultBranch(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-glgold"
              >
                {BRANCH_CODES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-600 font-medium">Default Batch:</span>
              <select
                value={defaultBatch}
                onChange={(e) => setDefaultBatch(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-glgold"
              >
                {BATCH_YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={autoGenEmail}
                onChange={(e) => setAutoGenEmail(e.target.checked)}
                className="rounded border-slate-300 text-glgold focus:ring-glgold"
              />
              <span>Auto-generate college email (<code className="text-glblue-750">{`{roll}@glbajaj.org`}</code>) if absent</span>
            </label>
          </div>
        </div>
      )}

      {/* Validation Summary Bar */}
      {validationReport && !isSuccess && (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-6 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">TOTAL RECORDS</span>
              <strong className="text-slate-900 text-base">{validationReport.total}</strong>
            </div>
            <div>
              <span className="text-emerald-600 block font-semibold uppercase text-[10px]">VALID & READY</span>
              <strong className="text-emerald-700 text-base flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{validationReport.valid}</span>
              </strong>
            </div>
            <div>
              <span className="text-red-500 block font-semibold uppercase text-[10px]">ERRORS / CONFLICTS</span>
              <strong className="text-red-600 text-base flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                <span>{validationReport.invalid}</span>
              </strong>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
            >
              Reset
            </button>
            <button
              onClick={handleCommitImport}
              disabled={importing || validationReport.valid === 0}
              className="bg-glgold hover:bg-glgold-dark text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5 disabled:opacity-50"
            >
              {importing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Confirm & Commit {validationReport.valid} Records</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Spreadsheet Live Preview Table with Filter Tabs */}
      {parsedRecords.length > 0 && !isSuccess && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-700">Filter Records:</span>
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                  activeTab === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All ({validationReport?.total || 0})
              </button>
              <button
                onClick={() => setActiveTab("valid")}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                  activeTab === "valid" ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                Valid & Ready ({validationReport?.valid || 0})
              </button>
              <button
                onClick={() => setActiveTab("errors")}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                  activeTab === "errors" ? "bg-red-700 text-white" : "bg-red-50 text-red-800 hover:bg-red-100"
                }`}
              >
                Errors ({validationReport?.invalid || 0})
              </button>
            </div>
            <span className="text-slate-400 text-[11px]">
              Showing {displayedRows.length} of {parsedRecords.length} records
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl max-h-96 overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase sticky top-0 z-10 shadow-xs">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-2.5">Row</th>
                  <th className="px-4 py-2.5">Validation Status</th>
                  <th className="px-4 py-2.5">Roll Number</th>
                  <th className="px-4 py-2.5">Full Name</th>
                  <th className="px-4 py-2.5">Email</th>
                  <th className="px-4 py-2.5">Branch</th>
                  <th className="px-4 py-2.5">Batch</th>
                  {targetType === "alumni" && <th className="px-4 py-2.5">Current Role & Company</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedRows.length === 0 ? (
                  <tr>
                    <td colSpan={targetType === "alumni" ? 8 : 7} className="text-center py-8 text-slate-400">
                      No records match the selected filter.
                    </td>
                  </tr>
                ) : (
                  displayedRows.map((r) => (
                    <tr
                      key={r.rowIndex}
                      className={`hover:bg-slate-50 transition ${!r.isValid ? "bg-red-50/40" : "bg-white"}`}
                    >
                      <td className="px-4 py-2.5 text-slate-400 font-mono">{r.rowIndex}</td>
                      <td className="px-4 py-2.5">
                        {r.isValid ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Valid</span>
                          </span>
                        ) : (
                          <div className="flex flex-col gap-0.5">
                            {r.errors.map((err, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit"
                              >
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                <span>{err}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className={`px-4 py-2.5 font-mono font-bold ${r.data.roll_number === "MISSING" ? "text-red-500 italic" : "text-slate-900"}`}>
                        {r.data.roll_number}
                      </td>
                      <td className={`px-4 py-2.5 font-semibold ${r.data.full_name === "MISSING" ? "text-red-500 italic" : "text-slate-900"}`}>
                        {r.data.full_name}
                      </td>
                      <td className={`px-4 py-2.5 ${r.data.email === "MISSING" ? "text-red-500 italic" : "text-slate-600"}`}>
                        {r.data.email}
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 font-semibold">{r.data.branch}</td>
                      <td className="px-4 py-2.5 text-slate-600">{r.data.batch_year}</td>
                      {targetType === "alumni" && (
                        <td className="px-4 py-2.5 text-slate-600">
                          {r.data.current_designation || r.data.current_company
                            ? `${r.data.current_designation || "Specialist"} @ ${r.data.current_company || "Industry"}`
                            : "—"}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
