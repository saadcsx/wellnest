import jwt from "jsonwebtoken"
import type { Response } from "express"

import { env } from "../config/env"
import { HttpError } from "../middleware/error"

export const COOKIE_NAME = "wellnest_session"

export interface SessionPayload {
  sub: string
}

const secret = () => {
  if (!env.jwtSecret) throw new HttpError(503, "JWT_SECRET is not configured on the server")
  return env.jwtSecret
}

export const signSession = (userId: string) =>
  jwt.sign({ sub: userId } satisfies SessionPayload, secret(), { expiresIn: env.jwtExpiresIn } as jwt.SignOptions)

export const verifySession = (token: string): SessionPayload | null => {
  if (!env.jwtSecret) return null
  try {
    const payload = jwt.verify(token, env.jwtSecret)
    return typeof payload === "object" && typeof payload.sub === "string" ? { sub: payload.sub } : null
  } catch {
    return null
  }
}

/** httpOnly cookie: the browser sends it automatically but scripts can't read it. */
export const setSessionCookie = (res: Response, token: string) =>
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  })

export const clearSessionCookie = (res: Response) =>
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "lax", secure: env.isProduction, path: "/" })
