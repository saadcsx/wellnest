import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

export const BRAND = {
  name: "Wellnest",
  tagline: "Clinical assessments, clearly documented.",
  description:
    "Wellnest turns structured forms, free-text notes and voice dictation into a consistent, review-ready clinical assessment in seconds.",
} as const

/**
 * Brand mark: a rounded tile carrying a single continuous line — a nod to a
 * vitals trace. Drawn inline so it inherits the accent colour and stays crisp
 * at any size.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-primary text-primary-foreground",
        className
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-[60%] w-[60%]" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h4l2.5-6 3.5 12 2.5-6H21" stroke="currentColor" />
      </svg>
    </span>
  )
}

export function Logo({
  href = "/",
  className,
  markClassName,
  textClassName,
}: {
  href?: string
  className?: string
  markClassName?: string
  textClassName?: string
}) {
  return (
    <Link to={href} className={cn("group inline-flex items-center gap-2.5", className)} aria-label={`${BRAND.name} home`}>
      <LogoMark className={markClassName} />
      <span className={cn("text-[17px] font-semibold tracking-tight text-foreground", textClassName)}>{BRAND.name}</span>
    </Link>
  )
}
