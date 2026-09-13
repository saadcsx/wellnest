import { useEffect, useRef, useState } from "react"
import { ArrowRight, Loader2, Mic, Square, Upload } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SampleButton } from "@/components/SampleButton"
import { api } from "@/lib/api"
import type { InputMethod } from "@/lib/assessment"
import { SAMPLE_TRANSCRIPTS, pick } from "@/lib/sample-data"
import { cn } from "@/lib/utils"

interface AudioInputMethodProps {
  onDataSubmit: (data: Record<string, unknown>, method: InputMethod) => void
}

const formatDuration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`

export function AudioInputMethod({ onDataSubmit }: AudioInputMethodProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [audio, setAudio] = useState<{ blob: Blob; name: string } | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [transcript, setTranscript] = useState("")
  const [isTranscribing, setIsTranscribing] = useState(false)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Create one object URL per blob and revoke it when the blob changes or the component unmounts.
  useEffect(() => {
    if (!audio) {
      setAudioUrl(null)
      return
    }
    const url = URL.createObjectURL(audio.blob)
    setAudioUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [audio])

  useEffect(() => () => stopTimer(), [])

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : ""
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      chunksRef.current = []

      recorder.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" })
        setAudio({ blob, name: `recording.${blob.type.includes("webm") ? "webm" : "wav"}` })
        setTranscript("")
        stream.getTracks().forEach((t) => t.stop())
      }

      recorder.start()
      recorderRef.current = recorder
      setIsRecording(true)
      setSeconds(0)
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } catch (err) {
      console.error("Microphone access failed:", err)
      toast.error("Microphone access was denied.")
    }
  }

  const stopRecording = () => {
    recorderRef.current?.stop()
    recorderRef.current = null
    setIsRecording(false)
    stopTimer()
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudio({ blob: file, name: file.name })
      setTranscript("")
    }
  }

  const transcribe = async () => {
    if (!audio) return
    setIsTranscribing(true)
    try {
      const { transcript } = await api.transcribe(audio.blob, audio.name)
      setTranscript(transcript)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Transcription failed")
    } finally {
      setIsTranscribing(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Record */}
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-6 text-center transition-colors",
            isRecording ? "border-destructive/40 bg-destructive/[0.04]" : "border-foreground/15 bg-muted/30"
          )}
        >
          {isRecording ? (
            <>
              <span className="flex items-center gap-2 text-sm font-medium text-destructive">
                <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
                Recording · {formatDuration(seconds)}
              </span>
              <Button variant="destructive" size="sm" onClick={stopRecording}>
                <Square />
                Stop
              </Button>
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground">Dictate directly from the bedside</span>
              <Button variant="outline" size="sm" onClick={startRecording}>
                <Mic />
                Start recording
              </Button>
            </>
          )}
        </div>

        {/* Upload */}
        <label
          htmlFor="audio-upload"
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-foreground/15 bg-muted/30 p-6 text-center transition-colors hover:border-foreground/30 hover:bg-white/60"
        >
          <span className="text-sm text-muted-foreground">Or upload an existing recording</span>
          <span className="inline-flex h-8 items-center gap-2 rounded-full border border-input bg-white/60 px-3.5 text-[13px] font-medium">
            <Upload className="h-4 w-4" />
            Choose file
          </span>
          <input id="audio-upload" type="file" accept="audio/*" onChange={handleFile} className="sr-only" />
        </label>
      </div>

      {audio && audioUrl && (
        <div className="space-y-3 rounded-2xl border border-hairline bg-white/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <Label className="truncate text-xs text-muted-foreground">{audio.name}</Label>
            <Button size="sm" onClick={transcribe} disabled={isTranscribing}>
              {isTranscribing && <Loader2 className="animate-spin" />}
              {isTranscribing ? "Transcribing…" : transcript ? "Re-transcribe" : "Transcribe"}
            </Button>
          </div>
          <audio controls src={audioUrl} className="h-10 w-full" />
        </div>
      )}

      {!transcript && (
        <div className="flex justify-end">
          <SampleButton onClick={() => setTranscript(pick(SAMPLE_TRANSCRIPTS))}>Sample transcript</SampleButton>
        </div>
      )}

      {transcript && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="transcript">Transcript</Label>
            <SampleButton onClick={() => setTranscript(pick(SAMPLE_TRANSCRIPTS))} />
          </div>
          <Textarea id="transcript" value={transcript} onChange={(e) => setTranscript(e.target.value)} className="min-h-[160px]" />
          <p className="text-xs text-muted-foreground">Correct anything the transcription missed before generating the assessment.</p>
          <div className="flex justify-end pt-1">
            <Button onClick={() => onDataSubmit({ transcript: transcript.trim() }, "audio")} disabled={transcript.trim().length < 20}>
              Generate assessment
              <ArrowRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
