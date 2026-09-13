import type { Assessment, ClinicalInput } from "@/lib/assessment"

/** Shapes returned by the Express API. Mongoose documents are serialised with `id` (no `_id`/`__v`). */

export interface User {
  id: string
  name: string
  email: string
  plan: "free" | "premium"
  createdAt: string
}

export interface Patient {
  id: string
  patientId: string
  fullName: string | null
  age: number | null
  gender: string | null
  arrivalDateTime: string | null
  specialty: string | null
  inputMethod: string | null
  chiefComplaint: string | null
  primaryDiagnosis: string | null
  severity: string | null
  clinicalData: ClinicalInput | null
  aiAnalysis: Assessment | null
  createdAt: string
  updatedAt: string
}

export interface CustomFormField {
  id: string
  type: string
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  validation?: { min?: number; max?: number; pattern?: string }
}

export interface CustomFormRecord {
  id?: string
  name: string
  description: string
  fields: CustomFormField[]
  createdAt?: string
  updatedAt?: string
}
