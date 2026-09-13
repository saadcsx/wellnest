import "dotenv/config"

/**
 * All configuration in one place. Nothing here throws at import time: a
 * missing variable surfaces as a clear JSON error from the route that needs
 * it (and in /api/health), which is far easier to diagnose on a host than a
 * function that dies before it can answer.
 */
export const env = {
  port: Number(process.env.PORT ?? 5000),
  isProduction: process.env.NODE_ENV === "production",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  mongoUri: process.env.MONGODB_URI ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
  assemblyAiApiKey: process.env.ASSEMBLYAI_API_KEY ?? "",
} as const

/** Which secrets are present — booleans only, safe to expose on /api/health. */
export const envStatus = () => ({
  MONGODB_URI: Boolean(env.mongoUri),
  JWT_SECRET: Boolean(env.jwtSecret),
  GEMINI_API_KEY: Boolean(env.geminiApiKey),
  ASSEMBLYAI_API_KEY: Boolean(env.assemblyAiApiKey),
})
