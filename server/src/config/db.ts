import mongoose from "mongoose"
import type { NextFunction, Request, Response } from "express"

import { env } from "./env"

// Serialise documents the way the client expects: `id` instead of `_id`, no `__v`, never the password hash.
mongoose.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret._id
    delete ret.passwordHash
    return ret
  },
})

let pending: Promise<typeof mongoose> | null = null

/**
 * Connects once and caches the promise. On a long-running server this runs at
 * boot; on serverless hosts it runs on the first request of each warm instance.
 * A failed attempt is forgotten so the next request retries instead of being
 * stuck with a rejected promise forever.
 */
export function connectDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose)
  if (pending) return pending

  pending = (async () => {
    if (!env.mongoUri) throw new Error("MONGODB_URI is not set")

    let uri = env.mongoUri
    if (uri === "memory") {
      // Zero-install mode: spin up an in-process MongoDB. Data is discarded on exit.
      // Non-literal specifier so bundlers don't try to inline this dev-only package.
      const specifier = "mongodb-memory-server"
      const { MongoMemoryServer } = (await import(specifier)) as typeof import("mongodb-memory-server")
      uri = (await MongoMemoryServer.create()).getUri("wellnest")
      console.log("[db] using in-memory MongoDB (MONGODB_URI=memory)")
    }

    // Fail fast: an unreachable cluster (e.g. IP not allow-listed on Atlas) should
    // produce an error message, not a hang that hits the host's request timeout.
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 })
    console.log(`[db] connected to ${conn.connection.host}/${conn.connection.name}`)
    return conn
  })()

  pending.catch(() => {
    pending = null
  })
  return pending
}

const READY_STATES: Record<number, string> = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" }

export const databaseStatus = () => READY_STATES[mongoose.connection.readyState] ?? "unknown"

/** Route guard: make sure the database is reachable before handling a data request. */
export async function ensureDatabase(_req: Request, res: Response, next: NextFunction) {
  try {
    await connectDatabase()
    next()
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error"
    console.error("[db] connection failed:", message)
    res.status(503).json({ success: false, error: `Database unavailable: ${message}` })
  }
}
