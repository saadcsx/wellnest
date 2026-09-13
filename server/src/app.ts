import path from "node:path"
import { existsSync } from "node:fs"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import { env, envStatus } from "./config/env"
import { databaseStatus, ensureDatabase } from "./config/db"
import { attachUser } from "./middleware/auth"
import { errorHandler, notFound } from "./middleware/error"
import authRoutes from "./routes/auth"
import patientRoutes from "./routes/patients"
import customFormRoutes from "./routes/customForms"
import analyzeRoutes from "./routes/analyze"
import transcribeRoutes from "./routes/transcribe"

export function createApp() {
  const app = express()

  app.disable("x-powered-by")
  app.set("trust proxy", 1)

  app.use(cors({ origin: env.clientOrigin, credentials: true }))
  app.use(express.json({ limit: "2mb" }))
  app.use(cookieParser())

  // Health never touches the database, so it can report why the rest of the API might be failing.
  app.get("/api/health", (_req, res) =>
    res.json({ ok: true, service: "wellnest-api", db: databaseStatus(), env: envStatus() })
  )

  // Everything below needs a database connection and (possibly) a session.
  app.use("/api", ensureDatabase, attachUser)
  app.use("/api/auth", authRoutes)
  app.use("/api/patients", patientRoutes)
  app.use("/api/custom-forms", customFormRoutes)
  app.use("/api/analyze", analyzeRoutes)
  app.use("/api/transcribe", transcribeRoutes)
  app.all("/api/*", notFound)

  // In production, serve the built React app from the same origin so cookies need no cross-site setup.
  const clientDist = path.resolve(process.cwd(), "../client/dist")
  if (env.isProduction && existsSync(clientDist)) {
    app.use(express.static(clientDist))
    app.get("*", (_req, res) => res.sendFile(path.join(clientDist, "index.html")))
  }

  app.use(errorHandler)
  return app
}
