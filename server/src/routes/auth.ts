import { Router } from "express"
import bcrypt from "bcryptjs"
import { z } from "zod"

import { UserModel } from "../models/User"
import { requireAuth } from "../middleware/auth"
import { validateBody } from "../middleware/validate"
import { HttpError, asyncHandler } from "../middleware/error"
import { clearSessionCookie, setSessionCookie, signSession } from "../utils/jwt"

const router = Router()

const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(200),
})

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

const updateSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8).max(200).optional(),
  })
  .refine((v) => !v.newPassword || v.currentPassword, {
    message: "Current password is required to set a new one",
    path: ["currentPassword"],
  })

/** POST /api/auth/register — create an account and start a session. */
router.post(
  "/register",
  validateBody(registerSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body as z.infer<typeof registerSchema>

    if (await UserModel.exists({ email })) throw new HttpError(409, "An account with that email already exists")

    const user = await UserModel.create({ name, email, passwordHash: await bcrypt.hash(password, 12) })
    setSessionCookie(res, signSession(user.id))
    res.status(201).json({ user })
  })
)

/** POST /api/auth/login */
router.post(
  "/login",
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body as z.infer<typeof loginSchema>

    const user = await UserModel.findOne({ email })
    // Same message for unknown email and wrong password so the endpoint can't be used to enumerate accounts.
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new HttpError(401, "Incorrect email or password")
    }

    setSessionCookie(res, signSession(user.id))
    res.json({ user })
  })
)

/** POST /api/auth/logout */
router.post("/logout", (_req, res) => {
  clearSessionCookie(res)
  res.json({ success: true })
})

/** GET /api/auth/me — current user, or null when signed out (never 401, so the client can bootstrap quietly). */
router.get("/me", (req, res) => {
  res.json({ user: req.user ?? null })
})

/** PATCH /api/auth/me — update display name and/or password. */
router.patch(
  "/me",
  requireAuth,
  validateBody(updateSchema),
  asyncHandler(async (req, res) => {
    const user = req.user!
    const { name, currentPassword, newPassword } = req.body as z.infer<typeof updateSchema>

    if (name) user.name = name

    if (newPassword) {
      if (!(await bcrypt.compare(currentPassword ?? "", user.passwordHash))) {
        throw new HttpError(400, "Current password is incorrect")
      }
      user.passwordHash = await bcrypt.hash(newPassword, 12)
    }

    await user.save()
    res.json({ user })
  })
)

export default router
