import { Router } from "express"

import { requireAuth } from "../middleware/auth"
import { asyncHandler } from "../middleware/error"
import { generateAssessment, hasClinicalContent, type ClinicalInput } from "../services/gemini"

const router = Router()

/** POST /api/analyze — de-identified clinical content in, structured assessment out. */
router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const input = req.body as ClinicalInput
    if (!input?.inputMethod || !hasClinicalContent(input)) {
      return res.status(400).json({ error: "No clinical content to analyse" })
    }
    res.json(await generateAssessment(input))
  })
)

export default router
