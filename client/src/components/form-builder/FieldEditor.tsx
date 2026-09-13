import { Plus, Trash2, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { CustomFormField } from "@/lib/api"

interface FieldEditorProps {
  field: CustomFormField
  onUpdate: (field: CustomFormField) => void
  onClose: () => void
}

const OPTION_TYPES = new Set(["select", "radio", "checkbox"])
const RANGE_TYPES = new Set(["text", "number"])

const toInt = (value: string) => (value === "" ? undefined : Number.parseInt(value, 10))

/** Controlled editor — the parent owns the field, so edits flow straight back up. */
export function FieldEditor({ field, onUpdate, onClose }: FieldEditorProps) {
  const patch = (updates: Partial<CustomFormField>) => onUpdate({ ...field, ...updates })
  const patchValidation = (updates: Partial<NonNullable<CustomFormField["validation"]>>) =>
    patch({ validation: { ...field.validation, ...updates } })

  const options = field.options ?? []
  const setOptions = (next: string[]) => patch({ options: next })

  const rangeLabels =
    field.type === "number" ? { min: "Minimum value", max: "Maximum value" } : { min: "Minimum length", max: "Maximum length" }

  return (
    <div className="space-y-6 p-4">
      <header className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-[13px] font-semibold tracking-tight">Field settings</h2>
          <Badge variant="outline" className="mt-1.5 capitalize">
            {field.type}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} aria-label="Close editor">
          <X className="h-4 w-4" />
        </Button>
      </header>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="field-label">Label</Label>
          <Input id="field-label" value={field.label} onChange={(e) => patch({ label: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="field-placeholder">Placeholder</Label>
          <Input
            id="field-placeholder"
            value={field.placeholder ?? ""}
            onChange={(e) => patch({ placeholder: e.target.value })}
            placeholder="Shown when empty"
          />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-hairline bg-white/60 px-3 py-2.5">
          <Label htmlFor="field-required" className="cursor-pointer">
            Required
          </Label>
          <Switch id="field-required" checked={Boolean(field.required)} onCheckedChange={(required) => patch({ required })} />
        </div>
      </div>

      {OPTION_TYPES.has(field.type) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Options</Label>
            <Button size="sm" variant="outline" onClick={() => setOptions([...options, `Option ${options.length + 1}`])}>
              <Plus />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {options.map((option, i) => (
              <div key={i} className="flex gap-1.5">
                <Input
                  value={option}
                  onChange={(e) => setOptions(options.map((o, j) => (j === i ? e.target.value : o)))}
                  placeholder={`Option ${i + 1}`}
                  className="h-9"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => setOptions(options.filter((_, j) => j !== i))}
                  aria-label="Remove option"
                  disabled={options.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {RANGE_TYPES.has(field.type) && (
        <div className="space-y-3">
          <Label>Validation</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground">{rangeLabels.min}</span>
              <Input
                type="number"
                className="h-9"
                value={field.validation?.min ?? ""}
                onChange={(e) => patchValidation({ min: toInt(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground">{rangeLabels.max}</span>
              <Input
                type="number"
                className="h-9"
                value={field.validation?.max ?? ""}
                onChange={(e) => patchValidation({ max: toInt(e.target.value) })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
