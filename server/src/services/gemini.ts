import { GoogleGenerativeAI } from "@google/generative-ai"

import { env } from "../config/env"
import { HttpError } from "../middleware/error"

export type InputMethod = "form" | "text" | "audio"

/** Clinical payload sent for analysis — identifiers already removed client-side. */
export interface ClinicalInput extends Record<string, unknown> {
  inputMethod: InputMethod
  specialty?: string
  rawText?: string
  transcript?: string
}

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
  severity?: string
  immediateActions?: string[]
  plan?: string[]
  followUp?: string
  redFlags?: string[]
  specialistRecommendations?: string[]
  briefSummary?: string
}

const RESPONSE_SHAPE = `{
  "chiefComplaint": "string",
  "historyOfPresentIllness": "string",
  "pastMedicalHistory": "string",
  "physicalExamination": "string",
  "investigations": ["string"],
  "primaryDiagnosis": "string",
  "impression": ["primary diagnosis first, then differentials"],
  "severity": "High" | "Moderate" | "Low",
  "immediateActions": ["string"],
  "plan": ["string"],
  "followUp": "string",
  "redFlags": ["string"],
  "specialistRecommendations": ["string"],
  "briefSummary": "one or two sentence handover line"
}`

/** Build the prompt from whichever input method produced the payload. */
function buildPrompt(input: ClinicalInput) {
  const role = `You are a senior ${input.specialty ?? "medical"} clinician producing a structured clinical assessment.`

  let source: string
  switch (input.inputMethod) {
    case "text":
      source = `Clinical notes:\n"""${input.rawText ?? ""}"""`
      break
    case "audio":
      source = `Transcribed dictation:\n"""${input.transcript ?? ""}"""`
      break
    default: {
      const fields: Record<string, unknown> = { ...input }
      delete fields.inputMethod
      source = `Structured intake data:\n${JSON.stringify(fields, null, 2)}`
    }
  }

  return `${role}

${source}

Respond with a single JSON object matching this shape exactly. Use plain clinical language, be specific and actionable, and leave a field as an empty string or empty array when the information is not available. Do not invent patient identifiers.

${RESPONSE_SHAPE}`
}

export const hasClinicalContent = (input: ClinicalInput) => {
  if (input.inputMethod === "text") return typeof input.rawText === "string" && input.rawText.trim().length > 0
  if (input.inputMethod === "audio") return typeof input.transcript === "string" && input.transcript.trim().length > 0
  return Object.keys(input).length > 1
}

export async function generateAssessment(input: ClinicalInput): Promise<Assessment> {
  if (!env.geminiApiKey) throw new HttpError(503, "Analysis is not configured on this server (GEMINI_API_KEY).")

  const model = new GoogleGenerativeAI(env.geminiApiKey).getGenerativeModel({
    model: env.geminiModel,
    generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
  })

  let text: string
  try {
    const result = await model.generateContent(buildPrompt(input))
    text = result.response.text()
  } catch (error) {
    console.error("Gemini error:", error)
    // A 404 from Google means the configured model no longer exists — a configuration problem, not a transient one.
    if ((error as { status?: number })?.status === 404) {
      throw new HttpError(503, `The AI model "${env.geminiModel}" is not available. Set GEMINI_MODEL to a current model.`)
    }
    throw new HttpError(502, "Analysis failed. Please try again.")
  }

  let analysis: Assessment
  try {
    analysis = JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new HttpError(502, "The model returned no JSON")
    analysis = JSON.parse(match[0])
  }

  return {
    ...analysis,
    specialty: input.specialty ?? analysis.specialty ?? "General",
    inputMethod: input.inputMethod,
    timestamp: new Date().toISOString(),
  }
}
