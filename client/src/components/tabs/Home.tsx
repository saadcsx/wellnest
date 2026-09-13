import { useCallback, useState } from "react"
import { AlertCircle, FileText, LayoutList, Loader2, Mic, PanelLeftOpen, Sparkles } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormInputMethod } from "@/components/input-methods/form-input"
import { TextInputMethod } from "@/components/input-methods/text-input"
import { AudioInputMethod } from "@/components/input-methods/audio-input"
import { PatientSidebar } from "@/components/PatientSidebar"
import { PatientDetails } from "@/components/assessment/PatientDetails"
import { ReportView } from "@/components/assessment/ReportView"
import { StepIndicator } from "@/components/assessment/StepIndicator"
import { api } from "@/lib/api"
import {
  emptyPersonalInfo,
  personalInfoFromPatient,
  stripIdentifiers,
  type Assessment,
  type ClinicalInput,
  type InputMethod,
  type PersonalInfo,
} from "@/lib/assessment"
import type { Patient } from "@/lib/types"
import { cn } from "@/lib/utils"

type Stage = "capture" | "analyzing" | "report" | "error"

export default function Home() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(emptyPersonalInfo)
  const [clinicalData, setClinicalData] = useState<ClinicalInput | null>(null)
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [stage, setStage] = useState<Stage>("capture")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [isExisting, setIsExisting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [refreshToken, setRefreshToken] = useState(0)

  const resetForNewPatient = useCallback(() => {
    setPersonalInfo(emptyPersonalInfo())
    setClinicalData(null)
    setAssessment(null)
    setIsExisting(false)
    setStage("capture")
    setErrorMessage(null)
  }, [])

  const loadPatient = useCallback((patient: Patient) => {
    setPersonalInfo(personalInfoFromPatient(patient))
    setIsExisting(true)
    setClinicalData(patient.clinicalData ?? null)
    setAssessment(patient.aiAnalysis ?? null)
    setStage(patient.aiAnalysis ? "report" : "capture")
    setErrorMessage(null)
    toast.success(`Opened ${patient.fullName || patient.patientId}`)
  }, [])

  const runAnalysis = useCallback(async (input: ClinicalInput) => {
    setStage("analyzing")
    setErrorMessage(null)
    try {
      const result = await api.analyze(input)
      if (result.error) throw new Error(result.error)
      setAssessment(result)
      setStage("report")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Analysis failed"
      setErrorMessage(message)
      setStage("error")
    }
  }, [])

  const handleSubmit = useCallback(
    (data: Record<string, unknown>, method: InputMethod) => {
      // Build the payload once and pass it straight to the request — never read it back from state.
      const input: ClinicalInput = { ...stripIdentifiers(data), inputMethod: method }
      setClinicalData(input)
      void runAnalysis(input)
    },
    [runAnalysis]
  )

  const handleSave = useCallback(async () => {
    if (!assessment || !clinicalData) {
      toast.error("Complete an assessment before saving.")
      return
    }
    setIsSaving(true)
    try {
      const result = await api.patients.save({ personalInfo, clinicalData, aiAnalysis: assessment, isUpdate: isExisting })
      toast.success(result.updated ? "Record updated" : "Saved to records")
      setIsExisting(true)
      setRefreshToken((n) => n + 1)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save the record")
    } finally {
      setIsSaving(false)
    }
  }, [assessment, clinicalData, personalInfo, isExisting])

  const currentStep = stage === "report" ? "report" : "capture"

  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden">
      {/* Records sidebar: in-flow on large screens, overlay below */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-[2px] lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="glass absolute inset-y-0 left-0 z-40 w-80 border-y-0 border-l-0 shadow-glass lg:static lg:z-auto lg:shadow-none">
            <PatientSidebar
              onClose={() => setSidebarOpen(false)}
              onPatientSelect={loadPatient}
              onCreateNew={resetForNewPatient}
              selectedPatientId={personalInfo.patientId}
              refreshToken={refreshToken}
            />
          </aside>
        </>
      )}

      <main className="min-w-0 flex-1 overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-6xl space-y-4 p-4 md:p-6">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {!sidebarOpen && (
                <Button variant="outline" size="sm" onClick={() => setSidebarOpen(true)}>
                  <PanelLeftOpen />
                  Records
                </Button>
              )}
              <StepIndicator
                current={currentStep}
                reportAvailable={Boolean(assessment)}
                onSelect={(step) => setStage(step === "report" ? "report" : "capture")}
              />
            </div>
            {isExisting && (
              <Button variant="ghost" size="sm" onClick={resetForNewPatient}>
                Start new patient
              </Button>
            )}
          </div>

          {stage !== "report" && (
            <PatientDetails value={personalInfo} onChange={setPersonalInfo} isExisting={isExisting} locked={stage === "analyzing"} />
          )}

          {stage === "capture" && <CaptureStep onSubmit={handleSubmit} />}

          {stage === "analyzing" && (
            <StatusPanel
              icon={<Loader2 className="h-5 w-5 animate-spin text-primary" />}
              title="Generating the assessment"
              body="De-identified clinical content is being analysed. This usually takes a few seconds."
            />
          )}

          {stage === "error" && (
            <StatusPanel
              tone="error"
              icon={<AlertCircle className="h-5 w-5 text-destructive" />}
              title="The analysis didn’t complete"
              body={errorMessage ?? "Something went wrong."}
              action={
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setStage("capture")}>
                    Edit input
                  </Button>
                  {clinicalData && (
                    <Button size="sm" onClick={() => runAnalysis(clinicalData)}>
                      Try again
                    </Button>
                  )}
                </div>
              }
            />
          )}

          {stage === "report" && assessment && (
            <ReportView
              assessment={assessment}
              personalInfo={personalInfo}
              isSaving={isSaving}
              isExisting={isExisting}
              onSave={handleSave}
              onBack={() => setStage("capture")}
            />
          )}
        </div>
      </main>
    </div>
  )
}

/* ---------- Capture step ---------- */

function CaptureStep({ onSubmit }: { onSubmit: (data: Record<string, unknown>, method: InputMethod) => void }) {
  return (
    <section className="surface p-5">
      <header className="mb-4 flex items-start gap-2.5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-hairline bg-accent/60 text-primary">
          <Sparkles className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight">Capture the encounter</h2>
          <p className="text-xs text-muted-foreground">
            Choose whichever input is fastest. The result is the same structured assessment.
          </p>
        </div>
      </header>

      <Tabs defaultValue="form" className="w-full">
        <TabsList className="h-11 w-full justify-start sm:w-auto">
          <TabsTrigger value="form" className="flex-1 sm:flex-none">
            <LayoutList className="mr-2 h-4 w-4" />
            Specialty form
          </TabsTrigger>
          <TabsTrigger value="text" className="flex-1 sm:flex-none">
            <FileText className="mr-2 h-4 w-4" />
            Free text
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex-1 sm:flex-none">
            <Mic className="mr-2 h-4 w-4" />
            Dictation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="mt-5">
          <FormInputMethod onDataSubmit={onSubmit} />
        </TabsContent>
        <TabsContent value="text" className="mt-5">
          <TextInputMethod onDataSubmit={onSubmit} />
        </TabsContent>
        <TabsContent value="audio" className="mt-5">
          <AudioInputMethod onDataSubmit={onSubmit} />
        </TabsContent>
      </Tabs>
    </section>
  )
}

function StatusPanel({
  icon,
  title,
  body,
  action,
  tone = "neutral",
}: {
  icon: React.ReactNode
  title: string
  body: string
  action?: React.ReactNode
  tone?: "neutral" | "error"
}) {
  return (
    <section
      className={cn(
        "surface flex flex-col items-center gap-3 px-6 py-14 text-center",
        tone === "error" && "border-destructive/20"
      )}
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-white">{icon}</span>
      <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{body}</p>
      {action && <div className="mt-2">{action}</div>}
    </section>
  )
}
