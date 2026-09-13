import { Router } from "express"
import { z } from "zod"

import { PatientModel } from "../models/Patient"
import { requireAuth } from "../middleware/auth"
import { validateBody } from "../middleware/validate"
import { asyncHandler } from "../middleware/error"

const router = Router()
router.use(requireAuth)

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/** GET /api/patients?search= — the signed-in clinician's records, newest first. */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : ""
    const filter: Record<string, unknown> = { user: req.user!._id }

    if (search) {
      const rx = new RegExp(escapeRegex(search), "i")
      filter.$or = [{ fullName: rx }, { patientId: rx }, { primaryDiagnosis: rx }]
    }

    const data = await PatientModel.find(filter).sort({ createdAt: -1 }).limit(100)
    res.json({ success: true, data })
  })
)

const saveSchema = z.object({
  patientId: z.string().trim().min(1).max(50),
  personalInfo: z.object({
    fullName: z.string().optional(),
    age: z.union([z.string(), z.number()]).optional(),
    gender: z.string().optional(),
    arrivalDateTime: z.string().optional(),
  }),
  specialty: z.string().nullish(),
  inputMethod: z.string().nullish(),
  chiefComplaint: z.string().nullish(),
  primaryDiagnosis: z.string().nullish(),
  severity: z.string().nullish(),
  clinicalData: z.unknown().nullish(),
  aiAnalysis: z.unknown().nullish(),
})

/** POST /api/patients — upsert on (user, patientId). */
router.post(
  "/",
  validateBody(saveSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as z.infer<typeof saveSchema>
    const age = Number.parseInt(String(body.personalInfo.age ?? ""), 10)

    const record = {
      fullName: body.personalInfo.fullName || null,
      age: Number.isFinite(age) ? age : null,
      gender: body.personalInfo.gender || null,
      arrivalDateTime: body.personalInfo.arrivalDateTime || null,
      specialty: body.specialty ?? null,
      inputMethod: body.inputMethod ?? null,
      chiefComplaint: body.chiefComplaint ?? null,
      primaryDiagnosis: body.primaryDiagnosis ?? null,
      severity: body.severity ?? null,
      clinicalData: body.clinicalData ?? null,
      aiAnalysis: body.aiAnalysis ?? null,
    }

    const existing = await PatientModel.findOne({ user: req.user!._id, patientId: body.patientId })

    if (existing) {
      existing.set(record)
      await existing.save()
      return res.json({ success: true, data: existing, updated: true })
    }

    const data = await PatientModel.create({ ...record, user: req.user!._id, patientId: body.patientId })
    res.status(201).json({ success: true, data, created: true })
  })
)

/** DELETE /api/patients/:id */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const result = await PatientModel.deleteOne({ _id: req.params.id, user: req.user!._id })
    if (result.deletedCount === 0) return res.status(404).json({ success: false, error: "Record not found" })
    res.json({ success: true })
  })
)

export default router
