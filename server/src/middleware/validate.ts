import type { NextFunction, Request, Response } from "express"
import type { ZodSchema } from "zod"

/** Validates `req.body` against a zod schema and replaces it with the parsed value. */
export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const issue = result.error.issues[0]
      const path = issue?.path.join(".")
      return res.status(400).json({ success: false, error: path ? `${path}: ${issue.message}` : issue?.message ?? "Invalid request" })
    }
    req.body = result.data
    next()
  }
