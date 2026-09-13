import { env } from "../config/env"
import { HttpError } from "../middleware/error"

const BASE = "https://api.assemblyai.com/v2"
const POLL_INTERVAL_MS = 2500
const MAX_POLLS = 60 // ~2.5 minutes

/** Upload audio to AssemblyAI, request a transcript, and poll until it completes. */
export async function transcribeAudio(audio: Buffer): Promise<string> {
  if (!env.assemblyAiApiKey) throw new HttpError(503, "Transcription is not configured on this server (ASSEMBLYAI_API_KEY).")
  const headers = { authorization: env.assemblyAiApiKey }

  const uploadRes = await fetch(`${BASE}/upload`, { method: "POST", headers, body: audio })
  if (!uploadRes.ok) throw new HttpError(502, `Upload failed (${uploadRes.status})`)
  const { upload_url } = (await uploadRes.json()) as { upload_url: string }

  const createRes = await fetch(`${BASE}/transcript`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({ audio_url: upload_url }),
  })
  if (!createRes.ok) throw new HttpError(502, `Transcript request failed (${createRes.status})`)
  const { id } = (await createRes.json()) as { id: string }

  for (let attempt = 0; attempt < MAX_POLLS; attempt++) {
    const pollRes = await fetch(`${BASE}/transcript/${id}`, { headers })
    const data = (await pollRes.json()) as { status: string; text?: string; error?: string }

    if (data.status === "completed") return data.text ?? ""
    if (data.status === "error") throw new HttpError(502, data.error ?? "Transcription failed")

    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
  }

  throw new HttpError(504, "Transcription timed out")
}
