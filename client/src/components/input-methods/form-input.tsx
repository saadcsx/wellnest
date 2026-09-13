import { useState } from "react"

import { SpecialtySelector } from "@/components/dynamic-form/specialty-selector"
import { DynamicFormRenderer } from "@/components/dynamic-form/dynamic-form-renderer"
import type { InputMethod } from "@/lib/assessment"
import type { Specialty } from "@/lib/form-configs/types"

interface FormInputMethodProps {
  onDataSubmit: (data: Record<string, unknown>, method: InputMethod) => void
}

export function FormInputMethod({ onDataSubmit }: FormInputMethodProps) {
  const [specialty, setSpecialty] = useState<Specialty>()

  return (
    <div className="space-y-5">
      <SpecialtySelector onSpecialtySelect={setSpecialty} selectedSpecialty={specialty} />
      {specialty && (
        <DynamicFormRenderer
          key={specialty.id}
          formConfig={specialty.form}
          onSubmit={(data) => onDataSubmit(data, "form")}
        />
      )}
    </div>
  )
}
