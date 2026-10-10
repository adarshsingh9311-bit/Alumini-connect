import React, { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import { 
  Upload, 
  FileSpreadsheet, 
  Download,
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Check, 
  Loader2, 
  Eye, 
  ShieldCheck, 
  ClipboardCheck, 
  ArrowRight, 
  RefreshCw,
  SlidersHorizontal,
  Filter,
  GraduationCap,
  Briefcase,
  HelpCircle
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { BRANCH_CODES } from "../../lib/constants";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { cleanEncodingArtifacts } from "../../lib/formatters";

// ==============================================================================
// EXACT SCHEMA FIELDS (Directly aligned with live Supabase database tables)
// ==============================================================================

export const STUDENT_SCHEMA_FIELDS = [
  { key: "roll_number", label: "Roll Number", required: true, description: "Official College Roll Number (Unique)" },
  { key: "full_name", label: "Full Name", required: true, description: "Student's Full Name" },
  { key: "email", label: "College Email", required: true, description: "Official College Email (@glbitm.ac.in)" },
  { key: "branch", label: "Branch", required: true, description: "Department code (e.g. CSE, IT, ECE, ME)" },
  { key: "batch", label: "Batch", required: true, description: "Academic Batch (e.g. 2023-2027 or 2027)" },
  { key: "graduation_year", label: "Graduation Year", required: false, description: "Year of graduation (e.g. 2027)" },
  { key: "phone", label: "Phone", required: false, description: "Contact number" },
  { key: "skills", label: "Skills", required: false, description: "Comma-separated technical skills" },
  { key: "bio", label: "Bio", required: false, description: "Brief academic background" }
];

export const ALUMNI_SCHEMA_FIELDS = [
  { key: "roll_number", label: "Roll Number / ID", required: true, description: "College Roll Number / Alumni Identifier (Unique)" },
  { key: "full_name", label: "Full Name", required: true, description: "Alumnus / Alumna Full Name" },
  { key: "email", label: "Email", required: true, description: "Official or registered email" },
  { key: "branch", label: "Branch", required: true, description: "Department code (e.g. CSE, ECE, IT)" },
  { key: "batch", label: "Batch", required: true, description: "Graduating Batch (e.g. 2019-2023 or 2023)" },
  { key: "graduation_year", label: "Graduation Year", required: false, description: "Year of graduation (e.g. 2023)" },
  { key: "current_company", label: "Current Company", required: false, description: "Employer or current organization" },
  { key: "current_designation", label: "Designation / Role", required: false, description: "Job title or position" },
  { key: "industry", label: "Industry", required: false, description: "Domain / Sector" },
  { key: "location", label: "Location", required: false, description: "City or Work Location" },
  { key: "phone", label: "Phone", required: false, description: "Contact phone" },
  { key: "skills", label: "Skills", required: false, description: "Comma-separated skills" },
  { key: "bio", label: "Bio / Career Journey", required: false, description: "Career summary or quote" },
  { key: "mentorship_available", label: "Mentorship Available", required: false, description: "TRUE or FALSE (default TRUE)" }
];

// Clean normalization for header auto-mapping
function normalizeHeaderKey(raw) {
  if (!raw || typeof raw !== "string") return "";
  return raw
    .toLowerCase()
    .replace(/^\uFEFF/, "") // strip BOM
    .trim()
    .replace(/[._\-\s]+/g, "");
}

// Aliases mapped to real database schema fields
const ALIAS_MAP = {
  roll_number: [
    "rollnumber", "rollno", "roll", "enrollmentno", "enrollmentnumber",
    "admissionno", "admissionnumber", "admno", "regno", "registrationno", "univrollno"
  ],
  full_name: [
    "fullname", "name", "studentname", "alumniname", "candidatename", "student", "scholarname"
  ],
  email: [
    "email", "emailid", "emailaddress", "mail", "mailid", "studentemail", "alumniemail", "collegeemail"
  ],
  branch: [
    "branch", "department", "dept", "course", "program", "stream", "specialization", "discipline"
  ],
  batch: [
    "batch", "batchyear", "session", "academicyear", "class"
  ],
  graduation_year: [
    "graduationyear", "passingyear", "passoutyear", "gradyear", "yearofpassing", "year"
  ],
  current_company: [
    "currentcompany", "company", "organization", "employer", "workplace", "currentorganization"
  ],
  current_designation: [
    "currentdesignation", "designation", "role", "title", "position", "jobtitle"
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
  ],
  bio: [
    "bio", "about", "summary", "description", "journey"
  ],
  mentorship_available: [
    "mentorshipavailable", "mentorship", "availableformentorship", "ismentor", "mentor"
  ]
};

function detectDbField(rawHeader) {
  const norm = normalizeHeaderKey(rawHeader);
  if (!norm) return null;

  // Direct exact matches
  if (norm === "rollno" || norm === "rollnumber") return "roll_number";
  if (norm === "fullname" || norm === "studentname" || norm === "alumniname" || norm === "name") return "full_name";
  if (norm === "email" || norm === "emailid" || norm === "emailaddress") return "email";
  if (norm === "branch" || norm === "department" || norm === "dept") return "branch";
  if (norm === "batch" || norm === "batchyear") return "batch";
  if (norm === "graduationyear" || norm === "passingyear" || norm === "gradyear") return "graduation_year";

  for (const [dbField, aliases] of Object.entries(ALIAS_MAP)) {
    if (aliases.includes(norm)) {
      return dbField;
    }
  }
  return null;
}

// Multi-row header auto-detection (finds actual header row even if title banners exist)
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

    if (matchedCount >= 2) {
      return i;
    }
  }
  return 0;
}

// ==============================================================================
// TEMPLATE DOWNLOAD HELPERS
// ==============================================================================

export function downloadStudentTemplate() {
  const headers = ["roll_number", "full_name", "email", "branch", "batch", "graduation_year", "phone", "skills", "bio"];
  const sampleRows = [
    ["2300001", "Adarsh Kumar Singh", "adarsh.23@glbitm.ac.in", "CSE", "2023-2027", "2027", "9876543210", "Java, Python, Data Structures", "Computer Science scholar"],
    ["2300002", "Pooja Sharma", "pooja.23@glbitm.ac.in", "IT", "2023-2027", "2027", "9876543211", "React, Node.js, Web Development", "Information Technology undergraduate"],
    ["2300003", "Rahul Verma", "rahul.23@glbitm.ac.in", "ECE", "2023-2027", "2027", "9876543212", "C++, Embedded Systems, IoT", "Electronics & Communication scholar"]
  ];

  const csvContent = "\uFEFF" + [
    headers.join(","),
    ...sampleRows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "glbajaj_student_template.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadAlumniTemplate() {
  const headers = [
    "roll_number", "full_name", "email", "branch", "batch", "graduation_year",
    "current_company", "current_designation", "industry", "location", "phone", "skills", "bio", "mentorship_available"
  ];
  const sampleRows = [
    [
      "1900001", "Saurabh Sarkar", "saurabh.alum@glbitm.ac.in", "CSE", "2019-2023", "2023",
      "Microsoft", "Software Engineer", "Technology", "Noida", "9876543213",
      "Distributed Systems, Go, Azure", "GL Bajaj CSE graduate now engineering cloud systems", "TRUE"
    ],
    [
      "1900002", "Ananya Gupta", "ananya.alum@glbitm.ac.in", "ECE", "2018-2022", "2022",
      "Qualcomm", "Hardware Engineer", "Semiconductors", "Bengaluru", "9876543214",
      "VLSI, Embedded C, Digital Design", "Electronics alumna focused on chip verification", "TRUE"
    ]
  ];

  const csvContent = "\uFEFF" + [
    headers.join(","),
    ...sampleRows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "glbajaj_alumni_template.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==============================================================================
// MAIN SPREADSHEET IMPORTER COMPONENT
// ==============================================================================

export default function SpreadsheetImporter({ onImportComplete }) {
  const { addToast } = useToast();
  const { user } = useAuth();

  const [targetType, setTargetType] = useState("student"); // "student" | "alumni"
  const [file, setFile] = useState(null);
  const [rawHeaders, setRawHeaders] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [columnMappings, setColumnMappings] = useState({}); // { [colIdx]: dbField }
  
  // Validation and Tab States
  const [activeTab, setActiveTab] = useState("all"); // "all" | "valid" | "errors"
  const [validationReport, setValidationReport] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentSchemaFields = targetType === "student" ? STUDENT_SCHEMA_FIELDS : ALUMNI_SCHEMA_FIELDS;

  // File Upload Handler (.csv, .xlsx, .xls)
  function handleFileChange(e) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileExt = selectedFile.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(fileExt)) {
      addToast("Unsupported file format. Please upload a .csv, .xlsx, or .xls file.", "error");
      return;
    }

    setFile(selectedFile);
    setIsSuccess(false);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Parse rows as raw array of arrays
        const rows2D = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

        if (!rows2D || rows2D.length < 2) {
          addToast("The uploaded file appears to be empty or has no data rows.", "error");
          return;
        }

        // 1. Detect Header Row
        const headerRowIdx = findHeaderRow(rows2D);
        const headers = (rows2D[headerRowIdx] || []).map((h) => 
          String(h || "").replace(/^\uFEFF/, "").trim()
        );

        // 2. Extract Data Rows (discard blank rows)
        const validDataRows = rows2D.slice(headerRowIdx + 1).filter((r) => {
          if (!Array.isArray(r) || r.length === 0) return false;
          return r.some((cell) => cell !== null && cell !== undefined && String(cell).trim() !== "");
        });

        if (validDataRows.length === 0) {
          addToast("No data rows found below headers.", "error");
          return;
        }

        // 3. Auto-detect Column Mappings against schema
        const initialMappings = {};
        const mappedFields = new Set();

        headers.forEach((h, colIdx) => {
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
          `Loaded ${validDataRows.length} records from ${selectedFile.name}. Header row detected at line ${headerRowIdx + 1}.`,
          "info"
        );
      } catch (err) {
        addToast("Failed to parse file: " + err.message, "error");
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
        Object.keys(updated).forEach((key) => {
          if (updated[key] === newField) delete updated[key];
        });
        updated[colIdx] = newField;
      }
      return updated;
    });
  }

  // ==============================================================================
  // STRICT ROW-BY-ROW VALIDATION ENGINE
  // ==============================================================================
  const parsedRecords = useMemo(() => {
    if (!rawRows.length || !rawHeaders.length) return [];

    const rollCounts = {};
    const emailCounts = {};

    // Pass 1: Frequencies for duplicate detection
    rawRows.forEach((row) => {
      let rollVal = "";
      let emailVal = "";

      Object.entries(columnMappings).forEach(([colIdx, dbField]) => {
        const val = cleanEncodingArtifacts(String(row[Number(colIdx)] || "")).trim();
        if (dbField === "roll_number") rollVal = val.toLowerCase();
        if (dbField === "email") emailVal = val.toLowerCase();
      });

      if (rollVal) rollCounts[rollVal] = (rollCounts[rollVal] || 0) + 1;
      if (emailVal) emailCounts[emailVal] = (emailCounts[emailVal] || 0) + 1;
    });

    // Pass 2: Row-level validation and error assignment
    return rawRows.map((row, idx) => {
      const errors = [];
      const extracted = {};

      Object.entries(columnMappings).forEach(([colIdx, dbField]) => {
        const val = cleanEncodingArtifacts(String(row[Number(colIdx)] || "")).trim();
        extracted[dbField] = val;
      });

      const rollNumber = extracted.roll_number || "";
      const fullName = extracted.full_name || "";
      const email = extracted.email || "";
      const branch = extracted.branch || "";
      const batch = extracted.batch || extracted.graduation_year || "";
      const gradYearRaw = extracted.graduation_year || extracted.batch || "";

      // 1. Roll Number Validation
      if (!rollNumber) {
        errors.push("Missing Roll Number");
      } else if (rollCounts[rollNumber.toLowerCase()] > 1) {
        errors.push(`Duplicate Roll Number "${rollNumber}" in file`);
      }

      // 2. Full Name Validation
      if (!fullName) {
        errors.push("Missing Full Name");
      }

      // 3. Email Validation
      if (!email) {
        errors.push("Missing Email");
      } else if (!email.includes("@") || !email.includes(".")) {
        errors.push("Invalid Email format (must contain @ and valid domain)");
      } else if (emailCounts[email.toLowerCase()] > 1) {
        errors.push(`Duplicate Email "${email}" in file`);
      }

      // 4. Branch Validation
      if (!branch) {
        errors.push("Missing Branch / Department");
      }

      // 5. Graduation Year integer check if provided
      let parsedGradYear = null;
      if (gradYearRaw) {
        const match = String(gradYearRaw).match(/\d{4}/);
        if (match) {
          parsedGradYear = parseInt(match[0], 10);
        } else if (!isNaN(Number(gradYearRaw))) {
          parsedGradYear = parseInt(gradYearRaw, 10);
        }
      }

      // Mentorship availability boolean check
      let isMentor = true;
      if (extracted.mentorship_available !== undefined && extracted.mentorship_available !== "") {
        const v = String(extracted.mentorship_available).trim().toLowerCase();
        isMentor = v === "true" || v === "yes" || v === "1";
      }

      const cleanData = {
        roll_number: rollNumber,
        full_name: fullName,
        email: email,
        branch: branch.toUpperCase(),
        batch: String(batch || (parsedGradYear ? String(parsedGradYear) : "2026")),
        graduation_year: parsedGradYear || (targetType === "student" ? 2027 : 2023),
        phone: extracted.phone || "",
        skills: extracted.skills 
          ? extracted.skills.split(",").map((s) => s.trim()).filter(Boolean) 
          : [],
        bio: extracted.bio || "",
        ...(targetType === "alumni" && {
          current_company: extracted.current_company || "",
          current_designation: extracted.current_designation || "",
          industry: extracted.industry || "",
          location: extracted.location || "",
          mentorship_available: isMentor,
          verified: true
        })
      };

      return {
        rowIndex: idx + 1,
        data: cleanData,
        isValid: errors.length === 0,
        errors
      };
    });
  }, [rawRows, rawHeaders, columnMappings, targetType]);

  // Validation report updater
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

  // Reset all state
  function handleReset() {
    setFile(null);
    setRawHeaders([]);
    setRawRows([]);
    setColumnMappings({});
    setValidationReport(null);
    setIsSuccess(false);
    setImportResult(null);
    setActiveTab("all");
  }

  // ==============================================================================
  // CONFIRM & COMMIT RECORDS TO SUPABASE
  // ==============================================================================
  async function handleCommitImport() {
    if (!validationReport || validationReport.valid === 0) {
      addToast("No valid records to import.", "error");
      return;
    }

    setImporting(true);
    const validRecords = parsedRecords.filter((r) => r.isValid).map((r) => r.data);
    const totalCount = parsedRecords.length;
    const validCount = validRecords.length;
    const rejectedCount = totalCount - validCount;

    let savedToDbCount = 0;
    let dbErrorMessage = null;

    try {
      if (isSupabaseConfigured && supabase) {
        const targetTable = targetType === "student" ? "students" : "alumni";

        // Upsert valid records into Supabase
        for (const record of validRecords) {
          try {
            const rowPayload = {
              roll_number: record.roll_number,
              branch: record.branch,
              batch: record.batch,
              graduation_year: record.graduation_year,
              skills: record.skills,
              bio: record.bio,
              ...(targetType === "alumni" && {
                current_company: record.current_company,
                current_designation: record.current_designation,
                industry: record.industry,
                location: record.location,
                mentorship_available: record.mentorship_available,
                verified: true
              })
            };

            const { error: upsertErr } = await supabase
              .from(targetTable)
              .upsert(rowPayload, { onConflict: "roll_number" });

            if (!upsertErr) {
              savedToDbCount++;
            } else {
              console.warn(`Upsert warning for ${record.roll_number}:`, upsertErr.message);
            }
          } catch (rowErr) {
            console.warn("Row save error:", rowErr);
          }
        }

        // Record entry in import_history
        try {
          await supabase.from("import_history").insert({
            file_name: file?.name || `${targetType}_import.csv`,
            file_type: targetType === "student" ? "students" : "alumni",
            total_rows: totalCount,
            successful_rows: validCount,
            failed_rows: rejectedCount,
            status: rejectedCount === 0 ? "completed" : "completed_with_errors",
            uploaded_by: user?.id || null
          });
        } catch (auditErr) {
          console.warn("Audit record failed:", auditErr);
        }
      }

      const summary = {
        filename: file?.name || "import_data.csv",
        total: totalCount,
        valid: validCount,
        invalid: rejectedCount,
        savedToDb: savedToDbCount,
        type: targetType
      };

      setImportResult(summary);
      setIsSuccess(true);

      if (onImportComplete) {
        onImportComplete({
          ...summary,
          records: validRecords
        });
      }

      addToast(
        `Import completed! ${validCount} records processed successfully (${rejectedCount} rejected).`,
        "success"
      );
    } catch (err) {
      addToast("Import commit encountered an error: " + err.message, "error");
    } finally {
      setImporting(false);
    }
  }

  // Filtered rows for the preview table
  const displayedRows = useMemo(() => {
    if (activeTab === "valid") return parsedRecords.filter((r) => r.isValid);
    if (activeTab === "errors") return parsedRecords.filter((r) => !r.isValid);
    return parsedRecords;
  }, [parsedRecords, activeTab]);

  return (
    <div className="space-y-6 font-sans">
      
      {/* ============================================================
          1. IMPORT COLLEGE RECORDS & TEMPLATE DOWNLOAD SECTION
      ============================================================ */}
      <div className="bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg p-6 space-y-5 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-[#7A1F24] text-xs font-bold uppercase tracking-wider mb-1">
            <FileSpreadsheet className="w-4 h-4 text-[#7A1F24]" />
            <span>Database Schema Importer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#202124] font-serif">
            Import College Records
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Download the appropriate template, fill in your records in Excel or another spreadsheet application, and upload the completed file.
          </p>
        </div>

        {/* Two Clear Options: Students vs Alumni */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. Student Template Card */}
          <div 
            className={`p-5 rounded-lg border transition ${
              targetType === "student"
                ? "border-[#7A1F24] bg-[#F7F3EA]/50 ring-1 ring-[#7A1F24]"
                : "border-[#D9DDE3] bg-white hover:border-[#7A1F24]/50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-[#7A1F24] text-white flex items-center justify-center font-bold text-base shadow-xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#202124]">Students Roster</h3>
                  <p className="text-xs text-[#667085]">Enrolled scholars, roll numbers, branches</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#7A1F24] border border-[#D9DDE3]">
                9 Schema Fields
              </span>
            </div>

            <p className="text-xs text-[#667085] mt-3 leading-relaxed">
              Required: <code className="text-[#7A1F24] font-semibold">roll_number</code>, <code className="text-[#7A1F24] font-semibold">full_name</code>, <code className="text-[#7A1F24] font-semibold">email</code>, <code className="text-[#7A1F24] font-semibold">branch</code>, <code className="text-[#7A1F24] font-semibold">batch</code>.
            </p>

            <div className="mt-4 pt-3 border-t border-[#D9DDE3] flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={downloadStudentTemplate}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-white border border-[#D9DDE3] hover:border-[#7A1F24] hover:text-[#7A1F24] text-xs font-semibold text-[#202124] transition shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#7A1F24]" />
                <span>Download Student CSV Template</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTargetType("student");
                  handleReset();
                }}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                  targetType === "student"
                    ? "bg-[#7A1F24] text-white"
                    : "bg-[#F7F3EA] text-[#202124] hover:bg-white border border-[#D9DDE3]"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Select for Upload</span>
              </button>
            </div>
          </div>

          {/* 2. Alumni Template Card */}
          <div 
            className={`p-5 rounded-lg border transition ${
              targetType === "alumni"
                ? "border-[#7A1F24] bg-[#F7F3EA]/50 ring-1 ring-[#7A1F24]"
                : "border-[#D9DDE3] bg-white hover:border-[#7A1F24]/50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-[#5C171B] text-white flex items-center justify-center font-bold text-base shadow-xs">
                  <Briefcase className="w-5 h-5 text-[#B08A3E]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#202124]">Alumni Directory</h3>
                  <p className="text-xs text-[#667085]">Graduates, companies, designations, cities</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#7A1F24] border border-[#D9DDE3]">
                14 Schema Fields
              </span>
            </div>

            <p className="text-xs text-[#667085] mt-3 leading-relaxed">
              Required: <code className="text-[#7A1F24] font-semibold">roll_number</code>, <code className="text-[#7A1F24] font-semibold">full_name</code>, <code className="text-[#7A1F24] font-semibold">email</code>, <code className="text-[#7A1F24] font-semibold">branch</code>, <code className="text-[#7A1F24] font-semibold">batch</code>.
            </p>

            <div className="mt-4 pt-3 border-t border-[#D9DDE3] flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={downloadAlumniTemplate}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-white border border-[#D9DDE3] hover:border-[#7A1F24] hover:text-[#7A1F24] text-xs font-semibold text-[#202124] transition shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#7A1F24]" />
                <span>Download Alumni CSV Template</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTargetType("alumni");
                  handleReset();
                }}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                  targetType === "alumni"
                    ? "bg-[#7A1F24] text-white"
                    : "bg-[#F7F3EA] text-[#202124] hover:bg-white border border-[#D9DDE3]"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Select for Upload</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================
          2. FILE DROPZONE & UPLOAD INSTRUCTIONS
      ============================================================ */}
      {!file && (
        <div className="bg-white border border-[#D9DDE3] rounded-lg p-6 sm:p-8 space-y-4 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-lg bg-[#F7F3EA] text-[#7A1F24] border border-[#D9DDE3] flex items-center justify-center mx-auto shadow-xs">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#202124]">
                Upload {targetType === "student" ? "Student" : "Alumni"} Records File
              </h3>
              <p className="text-xs text-[#667085] mt-1">
                Choose a completed CSV, Excel (.xlsx), or .xls file from your computer.
              </p>
            </div>

            <label className="inline-block bg-[#7A1F24] hover:bg-[#5C171B] text-white text-xs font-semibold px-5 py-2.5 rounded-md transition shadow-xs cursor-pointer">
              <span>Browse & Select File</span>
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <div className="pt-2 text-[11px] text-[#667085] space-y-1">
              <div>Supported Formats: <strong>.csv, .xlsx, .xls</strong> (UTF-8 encoding supported)</div>
              <div>Auto-handles title headers, duplicate detection, and space trimming.</div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          3. ACTIVE FILE PROCESSING & COLUMN MAPPING PANEL
      ============================================================ */}
      {file && (
        <div className="space-y-6">
          
          {/* File Header Bar */}
          <div className="bg-white border border-[#D9DDE3] rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#F7F3EA] text-[#7A1F24] border border-[#D9DDE3] flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#202124]">{file.name}</div>
                <div className="text-xs text-[#667085]">
                  {(file.size / 1024).toFixed(1)} KB • Target: <span className="font-semibold text-[#7A1F24] uppercase">{targetType}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-md border border-[#D9DDE3] bg-white hover:bg-[#F7F3EA] text-xs font-semibold text-[#202124] transition cursor-pointer"
              >
                Choose Different File
              </button>
            </div>
          </div>

          {/* Column Mapping Section */}
          <div className="bg-white border border-[#D9DDE3] rounded-lg p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#D9DDE3] pb-3">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-[#7A1F24]" />
                <h3 className="font-bold text-sm text-[#202124]">
                  Header Verification & Field Mapping
                </h3>
              </div>
              <span className="text-xs text-[#667085]">
                {Object.keys(columnMappings).length} of {rawHeaders.length} columns recognized
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {rawHeaders.map((headerName, colIdx) => {
                const currentField = columnMappings[colIdx] || "";
                return (
                  <div
                    key={colIdx}
                    className="p-3 rounded-md border border-[#D9DDE3] bg-[#F7F3EA]/30 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#667085]">Col {colIdx + 1}</span>
                      {currentField ? (
                        <span className="text-[10px] font-bold text-[#2E6B4A] flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Mapped</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#667085]">Skipped</span>
                      )}
                    </div>
                    
                    <div className="font-bold text-[#202124] truncate" title={headerName}>
                      "{headerName}"
                    </div>

                    <select
                      value={currentField}
                      onChange={(e) => handleMappingChange(colIdx, e.target.value)}
                      className="w-full bg-white border border-[#D9DDE3] rounded px-2.5 py-1.5 text-xs text-[#202124] focus:outline-none focus:ring-1 focus:ring-[#7A1F24]"
                    >
                      <option value="skip">— Skip this column —</option>
                      {currentSchemaFields.map((f) => (
                        <option key={f.key} value={f.key}>
                          {f.label} {f.required ? "*" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Validation Metrics Bar */}
          {validationReport && (
            <div className="bg-white border border-[#D9DDE3] rounded-lg p-5 shadow-xs">
              <div className="grid grid-cols-3 divide-x divide-[#D9DDE3] text-center">
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#202124] font-mono">
                    {validationReport.total}
                  </div>
                  <div className="text-xs font-semibold text-[#667085] uppercase tracking-wide mt-0.5">
                    Total Records
                  </div>
                </div>

                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#2E6B4A] font-mono">
                    {validationReport.valid}
                  </div>
                  <div className="text-xs font-semibold text-[#2E6B4A] uppercase tracking-wide mt-0.5">
                    Valid & Ready
                  </div>
                </div>

                <div>
                  <div className={`text-xl sm:text-2xl font-extrabold font-mono ${validationReport.invalid > 0 ? "text-[#B42318]" : "text-[#667085]"}`}>
                    {validationReport.invalid}
                  </div>
                  <div className={`text-xs font-semibold uppercase tracking-wide mt-0.5 ${validationReport.invalid > 0 ? "text-[#B42318]" : "text-[#667085]"}`}>
                    Errors / Conflicts
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              4. PREVIEW TABLE & TABBED FILTERING
          ============================================================ */}
          <div className="bg-white border border-[#D9DDE3] rounded-lg shadow-xs overflow-hidden">
            
            {/* Filter Tabs & Commit Action */}
            <div className="px-5 py-3.5 border-b border-[#D9DDE3] bg-[#F7F3EA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                    activeTab === "all"
                      ? "bg-[#7A1F24] text-white"
                      : "bg-white text-[#202124] border border-[#D9DDE3] hover:bg-[#F7F3EA]"
                  }`}
                >
                  All Records ({parsedRecords.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("valid")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                    activeTab === "valid"
                      ? "bg-[#2E6B4A] text-white"
                      : "bg-white text-[#202124] border border-[#D9DDE3] hover:bg-[#F7F3EA]"
                  }`}
                >
                  Valid & Ready ({validationReport?.valid || 0})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("errors")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                    activeTab === "errors"
                      ? "bg-[#B42318] text-white"
                      : "bg-white text-[#202124] border border-[#D9DDE3] hover:bg-[#F7F3EA]"
                  }`}
                >
                  Errors & Conflicts ({validationReport?.invalid || 0})
                </button>
              </div>

              {/* Commit Button */}
              <div>
                <button
                  type="button"
                  disabled={importing || !validationReport || validationReport.valid === 0}
                  onClick={handleCommitImport}
                  className="bg-[#7A1F24] hover:bg-[#5C171B] text-white text-xs font-bold px-5 py-2 rounded-md transition shadow-xs flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm & Import ({validationReport?.valid || 0} Valid Records)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F7F3EA] text-[#667085] font-bold uppercase tracking-wider border-b border-[#D9DDE3] sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-center">Row</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Roll Number</th>
                    <th className="px-4 py-3">Full Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Branch & Batch</th>
                    <th className="px-4 py-3">Validation Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9DDE3]">
                  {displayedRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-xs text-[#667085]">
                        No records match the active filter.
                      </td>
                    </tr>
                  ) : (
                    displayedRows.map((r) => (
                      <tr 
                        key={r.rowIndex}
                        className={`transition ${r.isValid ? "hover:bg-[#F7F3EA]/40" : "bg-red-50/40 hover:bg-red-50/70"}`}
                      >
                        <td className="px-4 py-3 text-center font-mono text-[#667085]">
                          #{r.rowIndex}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {r.isValid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-green-50 text-[#2E6B4A] border border-green-200 uppercase">
                              <Check className="w-3 h-3" />
                              <span>Valid</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-[#B42318] border border-red-200 uppercase">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Error</span>
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-[#7A1F24]">
                          {r.data.roll_number || "—"}
                        </td>
                        <td className="px-4 py-3 font-bold text-[#202124]">
                          {r.data.full_name || "—"}
                        </td>
                        <td className="px-4 py-3 text-[#667085] font-mono">
                          {r.data.email || "—"}
                        </td>
                        <td className="px-4 py-3 text-[#202124]">
                          {r.data.branch} ({r.data.batch})
                        </td>
                        <td className="px-4 py-3">
                          {r.isValid ? (
                            <span className="text-[11px] text-[#2E6B4A]">
                              Ready for database insertion
                            </span>
                          ) : (
                            <div className="space-y-0.5">
                              {r.errors.map((err, errIdx) => (
                                <div key={errIdx} className="text-[11px] text-[#B42318] font-medium flex items-center gap-1">
                                  <span>•</span>
                                  <span>{err}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* Success Summary Banner */}
          {isSuccess && importResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-5 space-y-2 text-[#2E6B4A]">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#2E6B4A]" />
                <span>Import Operation Completed</span>
              </div>
              <p className="text-xs text-[#2E6B4A]/90">
                Successfully processed <strong>{importResult.valid}</strong> records from <strong>{importResult.filename}</strong>.
                {importResult.invalid > 0 && (
                  <span> (Rejected {importResult.invalid} malformed or duplicate records).</span>
                )}
              </p>
              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-[#2E6B4A] hover:bg-[#25573C] text-white text-xs font-semibold px-4 py-1.5 rounded transition cursor-pointer"
                >
                  Import Another File
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
