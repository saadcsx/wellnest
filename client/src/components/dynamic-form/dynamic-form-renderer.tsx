import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { SampleButton } from "@/components/SampleButton"
import { DynamicField } from "./dynamic-field"
import type { PatientForm } from "@/lib/form-configs/types"
import { sampleFormValues } from "@/lib/sample-data"

interface DynamicFormRendererProps {
  formConfig: PatientForm
  onSubmit: (data: Record<string, unknown>) => void
}

const buildSchema = (formConfig: PatientForm) => {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const section of formConfig.sections) {
    for (const field of section.fields) {
      let schema: z.ZodTypeAny
      switch (field.type) {
        case "number":
          schema = field.required ? z.number({ required_error: `${field.label} is required` }) : z.number().optional()
          break
        case "checkbox":
          schema = z.array(z.string()).default([])
          break
        case "slider":
          schema = z
            .number()
            .min(field.min ?? 0)
            .max(field.max ?? 10)
            .default(field.min ?? 0)
          break
        default:
          schema = field.required ? z.string().min(1, `${field.label} is required`) : z.string().default("")
      }
      shape[field.id] = schema
    }
  }

  return z.object(shape)
}

const buildDefaults = (formConfig: PatientForm) =>
  formConfig.sections.reduce<Record<string, unknown>>((acc, section) => {
    for (const field of section.fields) {
      acc[field.id] = field.type === "checkbox" ? [] : field.type === "slider" ? field.min ?? 0 : ""
    }
    return acc
  }, {})

export function DynamicFormRenderer({ formConfig, onSubmit }: DynamicFormRendererProps) {
  const schema = useMemo(() => buildSchema(formConfig), [formConfig])
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: buildDefaults(formConfig),
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit({ ...data, specialty: formConfig.specialty }))}
        className="space-y-4"
      >
        <div className="flex justify-end">
          <SampleButton onClick={() => form.reset({ ...buildDefaults(formConfig), ...sampleFormValues(formConfig) })}>
            Fill sample data
          </SampleButton>
        </div>

        {formConfig.sections.map((section, index) => (
          <fieldset key={section.id} className="rounded-2xl border border-hairline bg-white/50 p-5">
            <legend className="sr-only">{section.title}</legend>
            <header className="mb-4 flex items-baseline gap-3">
              <span className="font-mono text-[11px] text-primary">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-[14px] font-semibold tracking-tight">{section.title}</h3>
                {section.description && <p className="mt-0.5 text-xs text-muted-foreground">{section.description}</p>}
              </div>
            </header>
            <div className="grid gap-4 md:grid-cols-2">
              {section.fields.map((field) => (
                <div key={field.id} className={field.type === "textarea" ? "md:col-span-2" : undefined}>
                  <DynamicField field={field} form={form} />
                </div>
              ))}
            </div>
          </fieldset>
        ))}

        <div className="flex justify-end pt-1">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Generate assessment
            <ArrowRight />
          </Button>
        </div>
      </form>
    </Form>
  )
}
