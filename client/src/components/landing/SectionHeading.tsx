import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "center",
}: {
  eyebrow: string
  title: string
  body?: string
  align?: "center" | "left"
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl">{title}</h2>
      {body && <p className="mt-4 text-balance text-base leading-relaxed text-muted-foreground md:text-lg">{body}</p>}
    </div>
  )
}
