import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Settings2, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { CustomFormField } from "@/lib/api"
import { cn } from "@/lib/utils"

interface SortableFieldProps {
  field: CustomFormField
  isActive: boolean
  onEdit: () => void
  onDelete: () => void
}

export function SortableField({ field, isActive, onEdit, onDelete }: SortableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 rounded-xl border bg-white/70 py-2.5 pl-2 pr-2 transition-colors",
        isActive ? "border-primary/40 bg-accent/40" : "border-hairline hover:border-foreground/15",
        isDragging && "opacity-50"
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Reorder"
        className="cursor-grab rounded-md p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <button type="button" onClick={onEdit} className="min-w-0 flex-1 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-medium">{field.label}</span>
          <Badge variant="outline" className="capitalize">
            {field.type}
          </Badge>
          {field.required && <Badge variant="accent">Required</Badge>}
        </div>
        {field.options && <p className="mt-0.5 truncate text-xs text-muted-foreground">{field.options.join(" · ")}</p>}
      </button>

      <div className="flex shrink-0 gap-0.5">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit} aria-label="Edit field">
          <Settings2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={onDelete}
          aria-label="Delete field"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
