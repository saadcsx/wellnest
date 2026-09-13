import { useDraggable } from "@dnd-kit/core"
import { Calendar, CheckSquare, CircleDot, Clock, FileText, Hash, List, Mail, Type } from "lucide-react"

import { cn } from "@/lib/utils"

const fieldTypes = [
  { type: "text", label: "Text", icon: Type, description: "Single line" },
  { type: "textarea", label: "Paragraph", icon: FileText, description: "Multi-line" },
  { type: "number", label: "Number", icon: Hash, description: "Numeric value" },
  { type: "email", label: "Email", icon: Mail, description: "Email address" },
  { type: "select", label: "Dropdown", icon: List, description: "Choose one" },
  { type: "radio", label: "Radio", icon: CircleDot, description: "Choose one, visible" },
  { type: "checkbox", label: "Checkboxes", icon: CheckSquare, description: "Choose many" },
  { type: "date", label: "Date", icon: Calendar, description: "Date picker" },
  { type: "time", label: "Time", icon: Clock, description: "Time picker" },
]

function PaletteItem({ type, label, description, icon: Icon }: (typeof fieldTypes)[number]) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type: "palette-item", fieldType: type },
  })

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      className={cn(
        "flex w-full cursor-grab select-none items-center gap-3 rounded-xl border border-hairline bg-white/60 px-3 py-2.5 text-left transition-colors hover:border-foreground/20 hover:bg-white active:cursor-grabbing",
        isDragging && "opacity-40"
      )}
    >
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/60 text-primary">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-medium">{label}</span>
        <span className="block text-[11px] text-muted-foreground">{description}</span>
      </span>
    </button>
  )
}

export function FieldPalette() {
  return (
    <div className="p-4">
      <h2 className="text-[13px] font-semibold tracking-tight">Field types</h2>
      <p className="mb-3 mt-0.5 text-xs text-muted-foreground">Drag a type into the form.</p>
      <div className="space-y-2">
        {fieldTypes.map((f) => (
          <PaletteItem key={f.type} {...f} />
        ))}
      </div>
    </div>
  )
}
