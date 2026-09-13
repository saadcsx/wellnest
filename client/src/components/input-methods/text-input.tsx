import { useState } from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SampleButton } from "@/components/SampleButton"
import type { InputMethod } from "@/lib/assessment"
import { SAMPLE_NOTES, pick } from "@/lib/sample-data"

interface TextInputMethodProps {
  onDataSubmit: (data: Record<string, unknown>, method: InputMethod) => void
}

const EXAMPLE =
  "65-year-old male, central crushing chest pain for 2 hours radiating to the left arm, associated shortness of breath. BP 150/90, HR 95, RR 18, SpO₂ 96% on air. Smoker, hypertensive, no prior cardiac history…"

export function TextInputMethod({ onDataSubmit }: TextInputMethodProps) {
  const [text, setText] = useState("")
  const trimmed = text.trim()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="clinical-text">Clinical notes</Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {trimmed.length ? `${trimmed.length} characters` : "Natural language is fine"}
            </span>
            <SampleButton onClick={() => setText(pick(SAMPLE_NOTES))} />
          </div>
        </div>
        <Textarea
          id="clinical-text"
          placeholder={EXAMPLE}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[220px]"
        />
        <p className="text-xs text-muted-foreground">
          Include presenting complaint, relevant history, observations and any findings. Leave out the patient’s name.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => onDataSubmit({ rawText: trimmed }, "text")} disabled={trimmed.length < 20}>
          Generate assessment
          <ArrowRight />
        </Button>
      </div>
    </div>
  )
}
