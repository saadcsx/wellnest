import { useDroppable } from "@dnd-kit/core"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"

interface DroppableAreaProps {
  id?: string
  /** Render a slim strip instead of the large empty state. */
  compact?: boolean
}

export function DroppableArea({ id = "form-droppable", compact }: DroppableAreaProps) {
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl border border-dashed text-center text-sm transition-colors",
        compact ? "py-3" : "flex-col py-12",
        isOver ? "border-primary/50 bg-accent/50 text-primary" : "border-foreground/15 text-muted-foreground"
      )}
    >
      <Plus className={compact ? "h-4 w-4" : "h-6 w-6 opacity-60"} />
      <span>{isOver ? "Release to add" : compact ? "Drop another field here" : "Drag field types here to start the form"}</span>
    </div>
  )
}
