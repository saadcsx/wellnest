import { Lock, RefreshCw, UserRound } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SampleButton } from "@/components/SampleButton"
import { generatePatientId, type PersonalInfo } from "@/lib/assessment"
import { samplePatient } from "@/lib/sample-data"

/**
 * Identifier fields for the current patient. Kept deliberately compact so the
 * capture step stays above the fold. Everything here stays client-side.
 */
export function PatientDetails({
  value,
  onChange,
  isExisting,
  locked,
}: {
  value: PersonalInfo
  onChange: (next: PersonalInfo) => void
  isExisting: boolean
  locked?: boolean
}) {
  const set = (patch: Partial<PersonalInfo>) => onChange({ ...value, ...patch })

  return (
    <section className="surface p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-hairline bg-accent/60 text-primary">
            <UserRound className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">Patient</h2>
            <p className="text-xs text-muted-foreground">Identifiers stay in your workspace and are not analysed.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExisting && <Badge variant="accent">Existing record</Badge>}
          <Badge variant="outline">
            <Lock className="h-3 w-3" />
            Local only
          </Badge>
          {!locked && !isExisting && <SampleButton onClick={() => set(samplePatient())} />}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.5fr_0.8fr_1.1fr]">
        <Field label="Full name">
          <Input
            value={value.fullName}
            onChange={(e) => set({ fullName: e.target.value })}
            placeholder="e.g. Amina Rahman"
            disabled={locked}
            autoComplete="off"
          />
        </Field>

        <Field label="Patient ID">
          <div className="flex gap-1.5">
            <Input value={value.patientId} readOnly className="font-mono text-xs" />
            {!isExisting && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-xl"
                title="Generate a new ID"
                onClick={() => set({ patientId: generatePatientId() })}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </Field>

        <Field label="Age">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            max={130}
            value={value.age}
            onChange={(e) => set({ age: e.target.value })}
            placeholder="0"
            disabled={locked}
          />
        </Field>

        <Field label="Sex">
          <Select value={value.gender} onValueChange={(gender) => set({ gender })} disabled={locked}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Arrival">
          <Input
            type="datetime-local"
            value={value.arrivalDateTime}
            onChange={(e) => set({ arrivalDateTime: e.target.value })}
            disabled={locked}
          />
        </Field>
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}
