import { createApp } from "./app"
import { connectDatabase } from "./config/db"
import { env } from "./config/env"

async function main() {
  // Connect eagerly on a long-running server so misconfiguration shows up at boot, not on first request.
  await connectDatabase()
  const app = createApp()
  app.listen(env.port, () => {
    console.log(`[api] listening on http://localhost:${env.port} (${env.isProduction ? "production" : "development"})`)
  })
}

main().catch((err) => {
  console.error("Failed to start server:", err)
  process.exit(1)
})
