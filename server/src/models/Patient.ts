import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose"

/**
 * One saved assessment per (user, patientId). Identifiers live here, in the
 * clinician's own database — they are never part of what is sent for analysis.
 */
const patientSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    patientId: { type: String, required: true, trim: true, maxlength: 50 },
    fullName: { type: String, default: null, trim: true, maxlength: 255 },
    age: { type: Number, default: null, min: 0, max: 130 },
    gender: { type: String, default: null, maxlength: 20 },
    arrivalDateTime: { type: String, default: null },
    specialty: { type: String, default: null, maxlength: 100 },
    inputMethod: { type: String, default: null, maxlength: 50 },
    chiefComplaint: { type: String, default: null },
    primaryDiagnosis: { type: String, default: null },
    severity: { type: String, default: null, maxlength: 20 },
    clinicalData: { type: Schema.Types.Mixed, default: null },
    aiAnalysis: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
)

patientSchema.index({ user: 1, patientId: 1 }, { unique: true })
patientSchema.index({ user: 1, createdAt: -1 })

export type Patient = InferSchemaType<typeof patientSchema>
export type PatientDocument = HydratedDocument<Patient>

export const PatientModel = model("Patient", patientSchema)
