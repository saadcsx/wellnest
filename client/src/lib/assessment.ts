import type { Patient } from "@/lib/types"

export type InputMethod = "form" | "text" | "audio"

/** Identifiers that stay in the browser and are never sent to the model. */
export interface PersonalInfo {
  patientId: string
  fullName: string
  age: string
  gender: string
  arrivalDateTime: string
}

/** Shape returned by /api/analyze. Every field is optional because the model may omit some. */
export interface Assessment {
  specialty?: string
  timestamp?: string
  inputMethod?: InputMethod
  chiefComplaint?: string
  historyOfPresentIllness?: string
  pastMedicalHistory?: string
  physicalExamination?: string
  investigations?: string[] | string
  primaryDiagnosis?: string
  impression?: string[]
  severity?: "High" | "Moderate" | "Low" | string
  immediateActions?: string[]
  plan?: string[]
  followUp?: string
  redFlags?: string[]
  specialistRecommendations?: string[]
  briefSummary?: string
  history?: string
  summary?: string
  error?: string
}

/** Clinical payload sent for analysis — identifiers already removed. */
export interface ClinicalInput extends Record<string, unknown> {
  inputMethod: InputMethod
  specialty?: string
  rawText?: string
  transcript?: string
}

export const generatePatientId = () => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 8)
  return `PAT-${timestamp}-${random}`.toUpperCase()
}

export const localDateTimeNow = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export const emptyPersonalInfo = (): PersonalInfo => ({
  patientId: generatePatientId(),
  fullName: "",
  age: "",
  gender: "",
  arrivalDateTime: localDateTimeNow(),
})

const IDENTIFIER_KEYS = ["fullName", "nhsNumber", "age", "gender", "arrivalDateTime", "patientId", "audioBlob"] as const

/** Remove anything that could identify the patient before the payload leaves the browser. */
export function stripIdentifiers<T extends Record<string, unknown>>(data: T): Omit<T, (typeof IDENTIFIER_KEYS)[number]> {
  const copy: Record<string, unknown> = { ...data }
  for (const key of IDENTIFIER_KEYS) delete copy[key]
  return copy as Omit<T, (typeof IDENTIFIER_KEYS)[number]>
}

export function personalInfoFromPatient(p: Patient): PersonalInfo {
  return {
    patientId: p.patientId,
    fullName: p.fullName ?? "",
    age: p.age?.toString() ?? "",
    gender: p.gender ?? "",
    arrivalDateTime: p.arrivalDateTime ? p.arrivalDateTime.slice(0, 16) : localDateTimeNow(),
  }
}

export const severityVariant = (severity?: string): "destructive" | "warning" | "accent" | "outline" => {
  switch (severity?.toLowerCase()) {
    case "high":
      return "destructive"
    case "moderate":
      return "warning"
    case "low":
      return "accent"
    default:
      return "outline"
  }
}

export const asList = (value?: string[] | string): string[] => {
  if (!value) return []
  return Array.isArray(value) ? value.filter(Boolean) : [value]
}
