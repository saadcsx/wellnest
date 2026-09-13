import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const order = ["patient", "capture", "report"] as const
export type Step = (typeof order)[number]

const steps: { id: Step; label: string }[] = [
  { id: "patient", label: "Patient" },
  { id: "capture", label: "Capture" },
  { id: "report", label: "Report" },
]

/** Horizontal progress for the assessment flow. `current` is the active step id. */
export function StepIndicator({
  current,
  onSelect,
  reportAvailable,
}: {
  current: Step
  onSelect?: (step: Step) => void
  reportAvailable: boolean
}) {
  const currentIndex = order.indexOf(current)

  return (
    <ol className="glass inline-flex items-center gap-1 rounded-full p-1 text-[13px]">
      {steps.map((s, i) => {
        const done = i < currentIndex || (s.id === "report" && reportAvailable && current !== "report")
        const active = s.id === current
        const clickable = onSelect && (s.id !== "report" || reportAvailable)
        return (
          <li key={s.id} className="flex items-center">
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onSelect(s.id)}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors",
                active ? "bg-white text-foreground shadow-sm" : "text-muted-foreground",
                clickable && !active && "hover:text-foreground",
                !clickable && "cursor-default"
              )}
            >
              <span
                className={cn(
                  "flex h-4.5 w-4.5 items-center justify-center rounded-full border text-[10px] font-semibold",
                  active && "border-primary bg-primary text-primary-foreground",
                  done && !active && "border-primary/40 bg-accent text-primary",
                  !active && !done && "border-foreground/20"
                )}
                style={{ width: 18, height: 18 }}
              >
                {done && !active ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : i + 1}
              </span>
              <span className="font-medium">{s.label}</span>
            </button>
            {i < steps.length - 1 && <span aria-hidden className="mx-0.5 h-px w-3 bg-foreground/15" />}
          </li>
        )
      })}
    </ol>
  )
}
