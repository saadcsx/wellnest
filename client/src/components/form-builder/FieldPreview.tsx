import { useState } from "react"
import { ArrowLeft } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { CustomFormField, CustomFormRecord } from "@/lib/api"

interface FormPreviewProps {
  form: Pick<CustomFormRecord, "name" | "description" | "fields">
  onClose: () => void
}

type Values = Record<string, string | string[] | undefined>

export function FormPreview({ form, onClose }: FormPreviewProps) {
  const [values, setValues] = useState<Values>({})
  const set = (id: string, value: string | string[]) => setValues((v) => ({ ...v, [id]: value }))

  const renderField = (field: CustomFormField) => {
    const value = values[field.id]
    const str = typeof value === "string" ? value : ""
    const arr = Array.isArray(value) ? value : []

    switch (field.type) {
      case "text":
      case "email":
      case "date":
      case "time":
        return <Input id={field.id} type={field.type} placeholder={field.placeholder} value={str} onChange={(e) => set(field.id, e.target.value)} />
      case "number":
        return (
          <Input
            id={field.id}
            type="number"
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
            value={str}
            onChange={(e) => set(field.id, e.target.value)}
          />
        )
      case "textarea":
        return <Textarea id={field.id} placeholder={field.placeholder} value={str} onChange={(e) => set(field.id, e.target.value)} />
      case "select":
        return (
          <Select value={str} onValueChange={(v) => set(field.id, v)}>
            <SelectTrigger id={field.id}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "radio":
        return (
          <RadioGroup value={str} onValueChange={(v) => set(field.id, v)}>
            {field.options?.map((o, i) => (
              <div key={o} className="flex items-center gap-2">
                <RadioGroupItem value={o} id={`${field.id}-${i}`} />
                <Label htmlFor={`${field.id}-${i}`} className="font-normal">
                  {o}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((o, i) => (
              <div key={o} className="flex items-center gap-2">
                <Checkbox
                  id={`${field.id}-${i}`}
                  checked={arr.includes(o)}
                  onCheckedChange={(checked) => set(field.id, checked ? [...arr, o] : arr.filter((x) => x !== o))}
                />
                <Label htmlFor={`${field.id}-${i}`} className="font-normal">
                  {o}
                </Label>
              </div>
            ))}
          </div>
        )
      default:
        return <p className="text-sm text-muted-foreground">Unsupported field type: {field.type}</p>
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft />
          Back to builder
        </Button>
        <Badge variant="accent">Preview</Badge>
      </div>

      <section className="surface p-6">
        <header className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight">{form.name || "Untitled form"}</h1>
          {form.description && <p className="mt-1 text-sm text-muted-foreground">{form.description}</p>}
        </header>

        <div className="space-y-5">
          {form.fields.map((field) => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={field.id}>
                {field.label}
                {field.required && <span className="ml-1 text-destructive">*</span>}
              </Label>
              {renderField(field)}
            </div>
          ))}
          <Button type="button" className="w-full" disabled>
            Submit (disabled in preview)
          </Button>
        </div>
      </section>
    </div>
  )
}
