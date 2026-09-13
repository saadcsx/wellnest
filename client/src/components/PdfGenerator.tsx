import { BRAND } from "@/components/brand/Logo"
import { asList, type Assessment, type PersonalInfo } from "@/lib/assessment"

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

const block = (label: string, text?: string, cls = "") =>
  text ? `<div class="sub"><div class="sub-title">${escapeHtml(label)}</div><div class="box ${cls}">${escapeHtml(text)}</div></div>` : ""

const list = (label: string, items: string[], ordered = false, cls = "") =>
  items.length
    ? `<div class="sub"><div class="sub-title">${escapeHtml(label)}</div><div class="box ${cls}"><${ordered ? "ol" : "ul"}>${items
        .map((i) => `<li>${escapeHtml(i)}</li>`)
        .join("")}</${ordered ? "ol" : "ul"}></div></div>`
    : ""

/** Opens a print-ready report in a new tab and triggers the browser print dialog. */
export function printReport(a: Assessment, p: PersonalInfo) {
  const win = window.open("", "_blank")
  if (!win) return

  const severity = (a.severity ?? "").toLowerCase()
  const differentials = (a.impression ?? []).slice(a.primaryDiagnosis ? 0 : 1)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(BRAND.name)} | Assessment ${escapeHtml(p.patientId)}</title>
<style>
  :root { color-scheme: light; }
  body { font-family: -apple-system, "Segoe UI", Inter, system-ui, sans-serif; color: #1b1f22; margin: 0; padding: 32px; line-height: 1.55; font-size: 13px; }
  h1 { font-size: 20px; margin: 0 0 4px; letter-spacing: -0.01em; }
  .brand { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: #6b7076; margin-bottom: 18px; }
  .meta { color: #6b7076; font-size: 12px; }
  .patient { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px 16px; border: 1px solid rgba(0,0,0,.08); border-radius: 10px; padding: 12px 14px; margin: 18px 0 24px; }
  .patient div { font-size: 12px; } .patient b { display:block; font-size: 10px; text-transform: uppercase; letter-spacing: .1em; color: #6b7076; margin-bottom: 2px; }
  .section { margin-bottom: 20px; page-break-inside: avoid; }
  .section-title { font-size: 14px; font-weight: 600; padding-bottom: 6px; border-bottom: 1px solid rgba(0,0,0,.08); margin-bottom: 10px; }
  .sub { margin-bottom: 10px; } .sub-title { font-size: 10.5px; text-transform: uppercase; letter-spacing: .1em; color: #6b7076; margin-bottom: 4px; }
  .box { background: #f6f6f4; border-radius: 8px; padding: 9px 12px; }
  .box.primary { background: #eef5f1; border: 1px solid rgba(27,107,80,.18); }
  .box.critical { background: #fbeeed; border: 1px solid rgba(190,52,46,.18); }
  ul, ol { margin: 0; padding-left: 18px; } li { margin: 2px 0; }
  .badge { display:inline-block; padding: 2px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; margin-left: 6px; }
  .badge-high { background:#fbeeed; color:#a8322c; } .badge-moderate { background:#fdf3e2; color:#8a5a0f; } .badge-low { background:#eef5f1; color:#1b6b50; }
  .footer { margin-top: 28px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,.08); font-size: 10.5px; color: #6b7076; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="brand">${escapeHtml(BRAND.name)}</div>
  <h1>Clinical assessment report ${severity ? `<span class="badge badge-${escapeHtml(severity)}">${escapeHtml(a.severity)} risk</span>` : ""}</h1>
  <div class="meta">${escapeHtml(a.specialty ?? "General")} · Generated ${escapeHtml(a.timestamp ? new Date(a.timestamp).toLocaleString() : new Date().toLocaleString())}</div>

  <div class="patient">
    <div><b>Name</b>${escapeHtml(p.fullName || "Not recorded")}</div>
    <div><b>Patient ID</b>${escapeHtml(p.patientId)}</div>
    <div><b>Age / Sex</b>${escapeHtml(p.age || "n/a")} / ${escapeHtml(p.gender || "n/a")}</div>
    <div><b>Arrival</b>${escapeHtml(p.arrivalDateTime ? new Date(p.arrivalDateTime).toLocaleString() : "n/a")}</div>
  </div>

  <div class="section">
    <div class="section-title">Presentation</div>
    ${block("Presenting complaint", a.chiefComplaint || a.history)}
    ${block("History of present illness", a.historyOfPresentIllness || a.summary)}
    ${block("Past medical history", a.pastMedicalHistory)}
  </div>

  ${a.physicalExamination ? `<div class="section"><div class="section-title">Examination</div><div class="box">${escapeHtml(a.physicalExamination)}</div></div>` : ""}
  ${asList(a.investigations).length ? `<div class="section"><div class="section-title">Investigations</div>${list("Requested / results", asList(a.investigations))}</div>` : ""}

  <div class="section">
    <div class="section-title">Assessment</div>
    ${block("Primary diagnosis", a.primaryDiagnosis || a.impression?.[0], severity === "high" ? "critical" : "primary")}
    ${list("Differential", differentials, true)}
  </div>

  <div class="section">
    <div class="section-title">Management plan</div>
    ${list("Immediate actions", asList(a.immediateActions))}
    ${list("Treatment plan", asList(a.plan), true)}
    ${block("Follow-up", a.followUp || "Review in 24–48 hours or sooner if symptoms worsen.")}
    ${list("Red flags: return immediately if", asList(a.redFlags), false, "critical")}
    ${list("Specialist recommendations", asList(a.specialistRecommendations))}
  </div>

  ${a.briefSummary ? `<div class="section"><div class="section-title">Summary for the record</div><div class="box">${escapeHtml(a.briefSummary)}</div></div>` : ""}

  <div class="footer">Generated with ${escapeHtml(BRAND.name)} as clinical decision support. Review by a qualified clinician is required before use.</div>
  <script>window.addEventListener("load", () => { window.print(); });</script>
</body>
</html>`

  win.document.open()
  win.document.write(html)
  win.document.close()
}
