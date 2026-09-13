import { useEffect, useMemo, useState } from "react"
import { Loader2, PanelLeftClose, Plus, Search, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { severityVariant } from "@/lib/assessment"
import type { Patient } from "@/lib/types"
import { cn } from "@/lib/utils"

interface PatientSidebarProps {
  onClose: () => void
  onPatientSelect: (patient: Patient) => void
  onCreateNew: () => void
  selectedPatientId?: string
  /** Bump to refetch (e.g. after a save). */
  refreshToken: number
}

export function PatientSidebar({ onClose, onPatientSelect, onCreateNew, selectedPatientId, refreshToken }: PatientSidebarProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    api.patients
      .list()
      .then((data) => !cancelled && setPatients(data))
      .catch((err) => console.error("Failed to load patients:", err))
      .finally(() => !cancelled && setIsLoading(false))
    return () => {
      cancelled = true
    }
  }, [refreshToken])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patients
    return patients.filter(
      (p) =>
        p.fullName?.toLowerCase().includes(q) ||
        p.patientId.toLowerCase().includes(q) ||
        p.primaryDiagnosis?.toLowerCase().includes(q)
    )
  }, [patients, query])

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3 border-b border-hairline p-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <Users className="h-4 w-4 text-primary" strokeWidth={1.75} />
            Records
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Hide records">
            <PanelLeftClose />
          </Button>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, ID or diagnosis"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 pl-9 text-[13px]"
          />
        </div>

        <Button onClick={onCreateNew} className="w-full" size="sm">
          <Plus />
          New patient
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading records…
          </div>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            {query ? "No matching records." : "No saved records yet."}
          </p>
        ) : (
          <ul className="space-y-1.5 p-3">
            {filtered.map((p) => {
              const selected = selectedPatientId === p.patientId
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onPatientSelect(p)}
                    className={cn(
                      "block w-full min-w-0 overflow-hidden rounded-xl border p-3 text-left transition-colors",
                      selected
                        ? "border-primary/30 bg-accent/60"
                        : "border-transparent hover:border-hairline hover:bg-white/70"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="min-w-0 truncate text-[13px] font-medium">{p.fullName || "Unnamed patient"}</span>
                      {p.severity && (
                        <Badge variant={severityVariant(p.severity)} className="shrink-0">
                          {p.severity}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">{p.patientId}</p>
                    {p.primaryDiagnosis && (
                      <p className="mt-1 truncate text-xs text-foreground/75">{p.primaryDiagnosis}</p>
                    )}
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                      {p.specialty && (
                        <>
                          <span aria-hidden>·</span>
                          <span>{p.specialty}</span>
                        </>
                      )}
                    </p>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
