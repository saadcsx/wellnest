import { Router } from "express"
import { z } from "zod"

import { CustomFormModel } from "../models/CustomForm"
import { requireAuth } from "../middleware/auth"
import { validateBody } from "../middleware/validate"
import { asyncHandler } from "../middleware/error"

const router = Router()
router.use(requireAuth)

const fieldSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  label: z.string().min(1),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  validation: z.object({ min: z.number().optional(), max: z.number().optional(), pattern: z.string().optional() }).optional(),
})

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().max(2000).optional().default(""),
  fields: z.array(fieldSchema).min(1, "Add at least one field"),
})

/** GET /api/custom-forms — the signed-in clinician's forms, most recently edited first. */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const data = await CustomFormModel.find({ user: req.user!._id }).sort({ updatedAt: -1 })
    res.json({ success: true, data })
  })
)

/** POST /api/custom-forms — create, or update when `id` is present. */
router.post(
  "/",
  validateBody(formSchema),
  asyncHandler(async (req, res) => {
    const { id, ...record } = req.body as z.infer<typeof formSchema>

    if (id) {
      const data = await CustomFormModel.findOneAndUpdate({ _id: id, user: req.user!._id }, record, { new: true })
      if (!data) return res.status(404).json({ success: false, error: "Form not found" })
      return res.json({ success: true, data, updated: true })
    }

    const data = await CustomFormModel.create({ ...record, user: req.user!._id })
    res.status(201).json({ success: true, data, created: true })
  })
)

/** DELETE /api/custom-forms/:id */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const result = await CustomFormModel.deleteOne({ _id: req.params.id, user: req.user!._id })
    if (result.deletedCount === 0) return res.status(404).json({ success: false, error: "Form not found" })
    res.json({ success: true })
  })
)

export default router
