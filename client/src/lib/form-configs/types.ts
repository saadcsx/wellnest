export interface FormField {
  id: string
  label: string
  type: "text" | "number" | "radio" | "checkbox" | "select" | "textarea" | "dateTime" | "slider"
  placeholder?: string
  required?: boolean
  options?: Array<{ label: string; value: string }>
  min?: number
  max?: number
  step?: number
  description?: string
}

export interface FormSection {
  id: number
  title: string
  description?: string
  fields: FormField[]
}

export interface PatientForm {
  specialty: string
  sections: FormSection[]
}

export interface Specialty {
  id: string
  name: string
  description: string
  form: PatientForm
}
