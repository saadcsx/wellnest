import type { Assessment, ClinicalInput, PersonalInfo } from "@/lib/assessment"
import type { CustomFormRecord, Patient, User } from "@/lib/types"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
  }
}

/**
 * Thin fetch wrapper. The session is an httpOnly cookie, so every request
 * sends credentials; in development Vite proxies /api to the Express server.
 */
async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { credentials: "include", ...init })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(body?.error || `Request failed (${res.status})`, res.status)
  return body as T
}

const json = (data: unknown, method = "POST"): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
})

export const api = {
  auth: {
    me: () => request<{ user: User | null }>("/api/auth/me").then((r) => r.user),
    register: (data: { name: string; email: string; password: string }) =>
      request<{ user: User }>("/api/auth/register", json(data)).then((r) => r.user),
    login: (data: { email: string; password: string }) =>
      request<{ user: User }>("/api/auth/login", json(data)).then((r) => r.user),
    logout: () => request<{ success: boolean }>("/api/auth/logout", { method: "POST" }),
    update: (data: { name?: string; currentPassword?: string; newPassword?: string }) =>
      request<{ user: User }>("/api/auth/me", json(data, "PATCH")).then((r) => r.user),
  },

  analyze: (input: ClinicalInput) => request<Assessment>("/api/analyze", json(input)),

  transcribe: async (audio: Blob, filename = "recording.webm") => {
    const form = new FormData()
    form.append("audio", audio, filename)
    return request<{ transcript: string }>("/api/transcribe", { method: "POST", body: form })
  },

  patients: {
    list: () => request<{ success: boolean; data: Patient[] }>("/api/patients").then((r) => r.data ?? []),

    save: (payload: { personalInfo: PersonalInfo; clinicalData: ClinicalInput; aiAnalysis: Assessment; isUpdate: boolean }) =>
      request<{ success: boolean; created?: boolean; updated?: boolean }>(
        "/api/patients",
        json({
          patientId: payload.personalInfo.patientId,
          personalInfo: payload.personalInfo,
          specialty: payload.aiAnalysis.specialty,
          inputMethod: payload.clinicalData.inputMethod,
          chiefComplaint: payload.aiAnalysis.chiefComplaint,
          primaryDiagnosis: payload.aiAnalysis.primaryDiagnosis,
          severity: payload.aiAnalysis.severity,
          clinicalData: payload.clinicalData,
          aiAnalysis: payload.aiAnalysis,
          isUpdate: payload.isUpdate,
        })
      ),
  },

  forms: {
    list: () => request<{ success: boolean; data: CustomFormRecord[] }>("/api/custom-forms").then((r) => r.data ?? []),
    save: (form: Partial<CustomFormRecord>) => request<{ success: boolean }>("/api/custom-forms", json(form)),
    remove: (id: string) =>
      request<{ success: boolean }>(`/api/custom-forms/${encodeURIComponent(id)}`, { method: "DELETE" }),
  },
}

export type { CustomFormField, CustomFormRecord } from "@/lib/types"
