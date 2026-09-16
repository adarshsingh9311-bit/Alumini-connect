/**
 * Format academic branch and batch year information gracefully.
 * Never outputs dangling separators or rogue '?' marks.
 *
 * @param {string} branch - e.g. "CSE", "B.Tech CSE", "Electronics"
 * @param {string} batchYear - e.g. "2024", "Batch 2022", "Alumna"
 * @param {string} separator - default "•"
 * @returns {string} Formatted education string
 */
export function formatEducation(branch, batchYear, separator = "•") {
  const cleanBranch = (branch || "")
    .replace(/\s*\?\s*/g, " ")
    .replace(/[•|]/g, "")
    .trim();

  let cleanBatch = (batchYear || "")
    .replace(/\s*\?\s*/g, " ")
    .replace(/[•|]/g, "")
    .trim();

  if (cleanBranch && cleanBatch) {
    return `${cleanBranch} ${separator} ${cleanBatch}`;
  }

  if (cleanBranch) {
    return cleanBranch;
  }

  if (cleanBatch) {
    return cleanBatch;
  }

  return "";
}

/**
 * Clean corrupted replacement characters or mojibake artifacts from strings.
 * Preserves genuine English question marks.
 *
 * @param {string} text - Raw string
 * @returns {string} Sanitized string
 */
export function cleanEncodingArtifacts(text) {
  if (!text || typeof text !== "string") return "";

  return text
    // Replace \uFFFD replacement character with a clean bullet or dash
    .replace(/\uFFFD/g, "•")
    // Replace corrupted separators like "Word ? AnotherWord" or "Word ? 2024"
    .replace(/([a-zA-Z0-9\)])\s+\?\s+([a-zA-Z0-9\(])/g, "$1 • $2")
    // Replace corrupted time ranges like "10:00 AM ? 5:00 PM"
    .replace(/(\d{1,2}:\d{2}\s*(?:AM|PM))\s+\?\s+(\d{1,2}:\d{2}\s*(?:AM|PM))/gi, "$1 – $2")
    // Replace corrupted button arrow "Text ?" at the end of an action string
    .replace(/([a-zA-Z]+)\s+\?$/g, "$1 →")
    .trim();
}
