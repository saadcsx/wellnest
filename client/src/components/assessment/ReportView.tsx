import { AlertTriangle, ArrowLeft, Database, FileDown, Loader2, Lock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { asList, severityVariant, type Assessment, type PersonalInfo } from "@/lib/assessment"
import { cn } from "@/lib/utils"

import { printReport } from "../PdfGenerator"

interface ReportViewProps {
  assessment: Assessment
  personalInfo: PersonalInfo
  isSaving: boolean
  isExisting: boolean
  onSave: () => void
  onBack: () => void
}

export function ReportView({ assessment: a, personalInfo, isSaving, isExisting, onSave, onBack }: ReportViewProps) {
  const differentials = (a.impression ?? []).slice(a.primaryDiagnosis ? 0 : 1)
  const generated = a.timestamp ? new Date(a.timestamp).toLocaleString() : null

  return (
    <div className="space-y-4">
      {/* Header */}
      <section className="surface flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight">Clinical assessment</h2>
            {a.specialty && <Badge variant="accent">{a.specialty}</Badge>}
            {a.severity && <Badge variant={severityVariant(a.severity)}>{a.severity} risk</Badge>}
          </div>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">{personalInfo.fullName || "Unnamed patient"}</span>
            <span aria-hidden>·</span>
            <span className="font-mono">{personalInfo.patientId}</span>
            {generated && (
              <>
                <span aria-hidden>·</span>
                <span>Generated {generated}</span>
              </>
            )}
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Lock className="h-3 w-3" /> De-identified analysis
            </span>
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft />
            Edit input
          </Button>
          <Button variant="outline" size="sm" onClick={() => printReport(a, personalInfo)}>
            <FileDown />
            Export PDF
          </Button>
          <Button size="sm" onClick={onSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" /> : <Database />}
            {isSaving ? "Saving…" : isExisting ? "Update record" : "Save to records"}
          </Button>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* Left column: narrative */}
        <div className="space-y-4">
          <Panel title="Presentation">
            <Block label="Presenting complaint" text={a.chiefComplaint || a.history} emphasis />
            <Block label="History of present illness" text={a.historyOfPresentIllness || a.summary} />
            <Block label="Past medical history" text={a.pastMedicalHistory} />
          </Panel>

          {a.physicalExamination && (
            <Panel title="Examination">
              <Block text={a.physicalExamination} />
            </Panel>
          )}

          {asList(a.investigations).length > 0 && (
            <Panel title="Investigations">
              <List items={asList(a.investigations)} />
            </Panel>
          )}

          {asList(a.specialistRecommendations).length > 0 && (
            <Panel title="Specialist recommendations">
              <List items={asList(a.specialistRecommendations)} />
            </Panel>
          )}

          <Panel title="Summary for the record" subtitle="Concise handover line, suitable for the notes.">
            <p className="rounded-xl border border-dashed border-foreground/15 bg-muted/40 p-4 font-mono text-[13px] leading-relaxed">
              {a.briefSummary ||
                `${a.specialty ?? "Clinical"} assessment completed. Primary concern: ${
                  a.primaryDiagnosis ?? "under investigation"
                }. Management plan initiated with follow-up arranged.`}
            </p>
          </Panel>
        </div>

        {/* Right column: assessment and plan */}
        <div className="space-y-4">
          <Panel title="Assessment">
            <Block
              label="Primary diagnosis"
              text={a.primaryDiagnosis || a.impression?.[0]}
              emphasis
              tone={severityVariant(a.severity) === "destructive" ? "critical" : "primary"}
            />
            {differentials.length > 0 && (
              <div>
                <Eyebrow>Differential</Eyebrow>
                <List items={differentials} ordered />
              </div>
            )}
          </Panel>

          <Panel title="Management plan">
            {asList(a.immediateActions).length > 0 && (
              <div>
                <Eyebrow>Immediate actions</Eyebrow>
                <List items={asList(a.immediateActions)} check />
              </div>
            )}
            {asList(a.plan).length > 0 && (
              <div>
                <Eyebrow>Treatment plan</Eyebrow>
                <List items={asList(a.plan)} ordered />
              </div>
            )}
            <Block label="Follow-up" text={a.followUp || "Review in 24–48 hours or sooner if symptoms worsen."} />
          </Panel>

          {asList(a.redFlags).length > 0 && (
            <section className="rounded-2xl border border-destructive/20 bg-destructive/[0.04] p-5">
              <h3 className="flex items-center gap-2 text-[14px] font-semibold text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Red flags: return immediately if
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-foreground/85">
                {asList(a.redFlags).map((flag, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-destructive" />
                    {flag}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---------- small presentational helpers ---------- */

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="surface p-5">
      <header className="mb-4">
        <h3 className="text-[14px] font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow mb-2">{children}</p>
}

function Block({
  label,
  text,
  emphasis,
  tone = "neutral",
}: {
  label?: string
  text?: string
  emphasis?: boolean
  tone?: "neutral" | "primary" | "critical"
}) {
  if (!text) return null
  return (
    <div>
      {label && <Eyebrow>{label}</Eyebrow>}
      <p
        className={cn(
          "rounded-xl p-3.5 text-sm leading-relaxed",
          tone === "neutral" && "bg-muted/50 text-foreground/90",
          tone === "primary" && "border border-primary/15 bg-accent/50 text-foreground",
          tone === "critical" && "border border-destructive/15 bg-destructive/[0.05] text-foreground",
          emphasis && "font-medium"
        )}
      >
        {text}
      </p>
    </div>
  )
}

function List({ items, ordered, check }: { items: string[]; ordered?: boolean; check?: boolean }) {
  const Tag = ordered ? "ol" : "ul"
  return (
    <Tag className="space-y-1.5 text-sm leading-relaxed text-foreground/90">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 rounded-xl bg-muted/50 px-3.5 py-2.5">
          <span
            className={cn(
              "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
              ordered && "bg-foreground/[0.07] text-foreground/70",
              check && "border border-primary/40 text-primary",
              !ordered && !check && "text-muted-foreground"
            )}
          >
            {ordered ? i + 1 : check ? "✓" : "•"}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </Tag>
  )
}
