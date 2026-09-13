import type { NextFunction, Request, Response } from "express"

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
  }
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ success: false, error: "Not found" })
}

// Express identifies error middleware by arity, so `next` must stay even though it's unused.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) return res.status(err.status).json({ success: false, error: err.message })

  // Mongo duplicate key (e.g. registering an email twice).
  if (typeof err === "object" && err && (err as { code?: number }).code === 11000) {
    return res.status(409).json({ success: false, error: "That record already exists" })
  }

  console.error(err)
  res.status(500).json({ success: false, error: "Something went wrong" })
}

/** Wraps an async route so rejections reach `errorHandler`. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
