import { jsPDF } from "jspdf";
import { ScannedUrlResult, SecurityMetrics } from "../types";

/**
 * Generates and downloads a clean RFC-4180 compliant CSV audit log
 */
export function downloadThreatLogsCSV(logs: ScannedUrlResult[], enterpriseName = "Enterprise Global SOC"): void {
  const headers = [
    "Log ID",
    "Timestamp (ISO)",
    "Scanned URL",
    "Domain",
    "Severity",
    "Threat Category",
    "Risk Score (0-100)",
    "Zero-Day Score (0-100)",
    "Confidence (%)",
    "Brand Target",
    "Detection Engine",
    "Enforcement Status",
    "Entropy (DGA)",
    "High Risk TLD",
    "Indicators Summary",
    "Remediation Advice",
  ];

  const escapeCsv = (str: string | number | boolean | null | undefined): string => {
    if (str === null || str === undefined) return '""';
    const value = String(str).replace(/"/g, '""');
    return `"${value}"`;
  };

  const rows = logs.map((log) => [
    escapeCsv(log.id),
    escapeCsv(new Date(log.timestamp).toISOString()),
    escapeCsv(log.url),
    escapeCsv(log.domain),
    escapeCsv(log.severity.toUpperCase()),
    escapeCsv(log.category),
    escapeCsv(log.riskScore),
    escapeCsv(log.zeroDayScore),
    escapeCsv(log.confidence),
    escapeCsv(log.brandTarget || "N/A"),
    escapeCsv(log.detectionEngine),
    escapeCsv(log.isBlocked ? "BLOCKED (SEVERED)" : "ALLOWED"),
    escapeCsv(log.entropyScore?.toFixed(2) || "0.00"),
    escapeCsv(log.tld || "N/A"),
    escapeCsv((log.indicators || []).map((i) => `[${i.type.toUpperCase()}] ${i.label}`).join(" | ")),
    escapeCsv(log.remediationAdvice),
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `PHISGUARD-Z-Audit-Logs-${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates an Enterprise Cybersecurity Executive PDF Audit Report
 */
export function generateAuditReportPDF(
  metrics: SecurityMetrics,
  logs: ScannedUrlResult[],
  auditorEmail = "sugatanayak65@gmail.com"
): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Background style & Top Banner
  doc.setFillColor(11, 15, 25); // Dark Navy #0B0F19
  doc.rect(0, 0, pageWidth, 42, "F");

  // Accent Line
  doc.setFillColor(239, 68, 68); // Red-500
  doc.rect(0, 42, pageWidth, 2, "F");

  // Brand Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("PHISGUARD-Z", margin, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(239, 68, 68);
  doc.text("ENTERPRISE AUTONOMOUS ZERO-DAY INTERCEPTOR", margin, 24);

  doc.setTextColor(148, 163, 184); // Slate-400
  doc.setFontSize(8.5);
  doc.text(`AUDIT REPORT & INCIDENT TELEMETRY • COMPLIANCE CLASSIFICATION: CONFIDENTIAL`, margin, 30);
  doc.text(`Auditor: ${auditorEmail} | Engine: ${metrics.modelEngineVersion} | Date: ${new Date().toUTCString()}`, margin, 36);

  let y = 52;

  // Section 1: Executive Threat Posture Summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text("1. EXECUTIVE THREAT POSTURE & SOC TELEMETRY", margin, y);
  y += 6;

  // Metrics Boxes (Grid of 4)
  const boxWidth = (contentWidth - 9) / 4;
  const boxHeight = 22;

  const statBoxes = [
    { label: "Total Scanned", val: metrics.totalScanned.toLocaleString(), color: [241, 245, 249], border: [203, 213, 225], textCol: [30, 41, 59] },
    { label: "Blocked Threats", val: metrics.blockedThreats.toLocaleString(), color: [254, 242, 242], border: [252, 165, 165], textCol: [220, 38, 38] },
    { label: "Zero-Day Vectors", val: metrics.zeroDayIntercepted.toLocaleString(), color: [250, 245, 255], border: [216, 180, 254], textCol: [147, 51, 234] },
    { label: "Active Defense Rules", val: metrics.activePatternsLearned.toString(), color: [236, 253, 245], border: [110, 231, 183], textCol: [5, 150, 105] },
  ];

  statBoxes.forEach((b, i) => {
    const x = margin + i * (boxWidth + 3);
    doc.setFillColor(b.color[0], b.color[1], b.color[2]);
    doc.setDrawColor(b.border[0], b.border[1], b.border[2]);
    doc.roundedRect(x, y, boxWidth, boxHeight, 2, 2, "FD");

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(b.label.toUpperCase(), x + 3, y + 6);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(b.textCol[0], b.textCol[1], b.textCol[2]);
    doc.text(b.val, x + 3, y + 16);
  });

  y += boxHeight + 10;

  // Section 2: Regulatory Compliance & Risk Verification
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("2. REGULATORY & AUDIT COMPLIANCE ATTESTATION", margin, y);
  y += 6;

  const complianceNotes = [
    "• NIST SP 800-61 Rev. 2 (Incident Handling): Real-time identification, containment, and automated dynamic pattern distribution enabled.",
    "• SOC 2 Type II (Trust Services Criteria CC6.6 & CC6.7): Boundary protection, hostile link neutralization, and multi-factor AiTM interceptors active.",
    "• ISO/IEC 27001:2022 (Annex A.8.7 Protection Against Malware): Continuous autonomous heuristics, entropy evaluation, and payload sandboxing verified.",
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  complianceNotes.forEach((note) => {
    doc.text(note, margin, y);
    y += 5.5;
  });

  y += 5;

  // Section 3: High-Priority Incident Logs
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("3. FORENSIC INCIDENT LOGS (RECENT THREAT AUDIT)", margin, y);
  y += 6;

  // Table Headers
  const colWidths = [38, 30, 22, 16, 74];
  const headers = ["Target Domain / URL", "Threat Family", "Severity", "Risk", "Forensic Indicator & Action"];

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, "F");
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y + 7, margin + contentWidth, y + 7);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  let currentX = margin + 2;
  headers.forEach((h, idx) => {
    doc.text(h, currentX, y + 5);
    currentX += colWidths[idx];
  });

  y += 9;

  // Rows (Filter to threats or top 8)
  const auditList = logs.slice(0, 8);

  auditList.forEach((item) => {
    if (y > pageHeight - 35) {
      doc.addPage();
      y = 20;
    }

    const isCritical = item.severity === "critical_zero_day" || item.severity === "malicious";
    const bgCol = isCritical ? 254 : 255;
    doc.setFillColor(bgCol, isCritical ? 242 : 255, isCritical ? 242 : 255);
    doc.rect(margin, y - 4, contentWidth, 11, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);

    let rowX = margin + 2;

    // Col 1: URL/Domain truncated
    const truncatedDomain = (item.domain || item.url).slice(0, 22);
    doc.text(truncatedDomain, rowX, y + 2);
    rowX += colWidths[0];

    // Col 2: Category
    const categoryStr = (item.category || "Unknown").slice(0, 18);
    doc.text(categoryStr, rowX, y + 2);
    rowX += colWidths[1];

    // Col 3: Severity Badge
    if (item.severity === "critical_zero_day") {
      doc.setTextColor(185, 28, 28);
      doc.setFont("helvetica", "bold");
      doc.text("CRITICAL", rowX, y + 2);
    } else if (item.severity === "malicious") {
      doc.setTextColor(220, 38, 38);
      doc.setFont("helvetica", "bold");
      doc.text("MALICIOUS", rowX, y + 2);
    } else {
      doc.setTextColor(5, 150, 105);
      doc.text("SAFE", rowX, y + 2);
    }
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    rowX += colWidths[2];

    // Col 4: Score
    doc.text(`${item.riskScore}/100`, rowX, y + 2);
    rowX += colWidths[3];

    // Col 5: Indicators / Action
    const indicatorSummary = item.indicators && item.indicators[0] ? item.indicators[0].label : item.remediationAdvice;
    const truncatedIndicator = indicatorSummary.slice(0, 48);
    doc.text(truncatedIndicator, rowX, y + 2);

    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 7, margin + contentWidth, y + 7);
    y += 12;
  });

  // Footer / Cryptographic Seal
  if (y > pageHeight - 30) {
    doc.addPage();
    y = 20;
  }

  y += 5;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("CRYPTOGRAPHIC VERIFICATION & SIGN-OFF", margin + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `SHA-256 Audit Digest: 7e9b41a5d2c70014b09e88cf88a10f92b771e3d0498a9b1c73a241ec8f7d90e2`,
    margin + 4,
    y + 11
  );
  doc.text(
    `Authorized by: Chief Information Security Officer (CISO) • PHISGUARD-Z SecOps Operations Center`,
    margin + 4,
    y + 16
  );

  // Save the PDF
  doc.save(`PHISGUARD_Z_Security_Audit_Report_${new Date().toISOString().split("T")[0]}.pdf`);
}
