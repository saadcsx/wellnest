import { Router } from "express"
import multer from "multer"

import { requireAuth } from "../middleware/auth"
import { asyncHandler } from "../middleware/error"
import { transcribeAudio } from "../services/assemblyai"

const router = Router()

// Keep uploads in memory: they're forwarded straight to AssemblyAI and never written to disk.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype.startsWith("audio/") || file.mimetype === "video/webm"),
})

/** POST /api/transcribe — multipart field "audio". */
router.post(
  "/",
  requireAuth,
  upload.single("audio"),
  asyncHandler(async (req, res) => {
    if (!req.file || req.file.size === 0) return res.status(400).json({ error: "No audio file provided" })
    res.json({ transcript: await transcribeAudio(req.file.buffer) })
  })
)

export default router
