import type { NextFunction, Request, Response } from "express"

import { UserModel, type UserDocument } from "../models/User"
import { COOKIE_NAME, verifySession } from "../utils/jwt"

declare module "express-serve-static-core" {
  interface Request {
    user?: UserDocument
  }
}

const tokenFrom = (req: Request): string | null => {
  const cookie = req.cookies?.[COOKIE_NAME]
  if (typeof cookie === "string" && cookie) return cookie
  const header = req.headers.authorization
  if (header?.startsWith("Bearer ")) return header.slice(7)
  return null
}

/** Attaches `req.user` when a valid session exists; does not reject. */
export async function attachUser(req: Request, _res: Response, next: NextFunction) {
  const token = tokenFrom(req)
  const session = token ? verifySession(token) : null
  if (session) {
    const user = await UserModel.findById(session.sub)
    if (user) req.user = user
  }
  next()
}

/** Rejects with 401 unless `attachUser` found a signed-in user. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" })
  next()
}
