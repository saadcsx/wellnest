/**
 * Vercel entry point. Vercel turns this file into a single serverless function
 * that receives every /api/* request (see vercel.json rewrites) and hands it to
 * the same Express app used by `npm run dev` and Render.
 *
 * The database connection is opened lazily by the app's `ensureDatabase`
 * middleware and cached on the module scope, so warm instances reuse it.
 */
import type { IncomingMessage, ServerResponse } from "node:http"

import { createApp } from "../server/src/app"

const app = createApp()

export default function handler(req: IncomingMessage, res: ServerResponse) {
  app(req, res)
}
