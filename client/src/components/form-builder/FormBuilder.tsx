import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { ArrowLeft, Eye, Loader2, Save } from "lucide-react"
import toast from "react-hot-toast"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SampleButton } from "@/components/SampleButton"
import type { CustomFormField, CustomFormRecord } from "@/lib/api"
import { sampleCustomForm } from "@/lib/sample-data"

import { DroppableArea } from "./DroppableArea"
import { FieldEditor } from "./FieldEditor"
import { FieldPalette } from "./FieldPalette"
import { FormPreview } from "./FieldPreview"
import { SortableField } from "./SortableField"

interface FormBuilderProps {
  form?: CustomFormRecord
  onSave: (form: CustomFormRecord) => Promise<void> | void
  onCancel: () => void
}

const OPTION_TYPES = new Set(["select", "radio", "checkbox"])

const newFieldOfType = (type: string): CustomFormField => ({
  id: `field_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
  type,
  label: `${type.charAt(0).toUpperCase()}${type.slice(1)} field`,
  required: false,
  ...(OPTION_TYPES.has(type) ? { options: ["Option 1", "Option 2"] } : {}),
})

export function FormBuilder({ form, onSave, onCancel }: FormBuilderProps) {
  const [draft, setDraft] = useState<CustomFormRecord>({
    id: form?.id,
    name: form?.name ?? "",
    description: form?.description ?? "",
    fields: form?.fields ?? [],
  })
  const [activeField, setActiveField] = useState<CustomFormField | null>(null)
  const [dragged, setDragged] = useState<CustomFormField | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Require a small movement before a drag starts so clicks on palette items still work.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const setFields = (updater: (fields: CustomFormField[]) => CustomFormField[]) =>
    setDraft((d) => ({ ...d, fields: updater(d.fields) }))

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (active.data.current?.type === "palette-item") {
      setDragged(newFieldOfType(active.data.current.fieldType))
    } else {
      setDragged(draft.fields.find((f) => f.id === active.id) ?? null)
    }
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const incoming = dragged
    setDragged(null)
    if (!over) return

    if (active.data.current?.type === "palette-item" && incoming) {
      setFields((fields) => {
        const overIndex = fields.findIndex((f) => f.id === over.id)
        if (overIndex < 0) return [...fields, incoming]
        const next = [...fields]
        next.splice(overIndex + 1, 0, incoming)
        return next
      })
      setActiveField(incoming)
      return
    }

    setFields((fields) => {
      const from = fields.findIndex((f) => f.id === active.id)
      const to = fields.findIndex((f) => f.id === over.id)
      return from >= 0 && to >= 0 && from !== to ? arrayMove(fields, from, to) : fields
    })
  }

  const updateField = (updated: CustomFormField) => {
    setFields((fields) => fields.map((f) => (f.id === updated.id ? updated : f)))
    setActiveField(updated)
  }

  const deleteField = (id: string) => {
    setFields((fields) => fields.filter((f) => f.id !== id))
    setActiveField((f) => (f?.id === id ? null : f))
  }

  const handleSave = async () => {
    if (!draft.name.trim()) return toast.error("Give the form a name")
    if (draft.fields.length === 0) return toast.error("Add at least one field")
    setIsSaving(true)
    try {
      await onSave({ ...draft, name: draft.name.trim() })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save the form")
    } finally {
      setIsSaving(false)
    }
  }

  if (showPreview) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
        <FormPreview form={draft} onClose={() => setShowPreview(false)} />
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-hairline bg-white/40 scrollbar-thin md:block">
          <FieldPalette />
        </aside>

        <div className="min-w-0 flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto max-w-3xl space-y-4 p-4 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <ArrowLeft />
                All forms
              </Button>
              <div className="flex gap-2">
                {draft.fields.length === 0 && (
                  <SampleButton onClick={() => setDraft((d) => ({ ...d, ...sampleCustomForm() }))}>Sample form</SampleButton>
                )}
                <Button variant="outline" size="sm" onClick={() => setShowPreview(true)} disabled={draft.fields.length === 0}>
                  <Eye />
                  Preview
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                  {isSaving ? "Saving…" : "Save form"}
                </Button>
              </div>
            </div>

            <section className="surface grid gap-4 p-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="form-name">Form name</Label>
                <Input
                  id="form-name"
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  placeholder="e.g. Paediatric triage"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="form-description">Description</Label>
                <Input
                  id="form-description"
                  value={draft.description}
                  onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                  placeholder="When should this form be used?"
                />
              </div>
            </section>

            <section className="surface p-5">
              <header className="mb-4 flex items-center justify-between">
                <h2 className="text-[15px] font-semibold tracking-tight">Fields</h2>
                <Badge variant="outline">{draft.fields.length} {draft.fields.length === 1 ? "field" : "fields"}</Badge>
              </header>

              <SortableContext items={draft.fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2.5">
                  {draft.fields.map((field) => (
                    <SortableField
                      key={field.id}
                      field={field}
                      isActive={activeField?.id === field.id}
                      onEdit={() => setActiveField(field)}
                      onDelete={() => deleteField(field.id)}
                    />
                  ))}
                  <DroppableArea id="form-droppable-end" compact={draft.fields.length > 0} />
                </div>
              </SortableContext>
            </section>
          </div>
        </div>

        {activeField && (
          <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-hairline bg-white/40 scrollbar-thin lg:block">
            <FieldEditor key={activeField.id} field={activeField} onUpdate={updateField} onClose={() => setActiveField(null)} />
          </aside>
        )}

        <DragOverlay>
          {dragged && (
            <div className="glass rounded-xl px-4 py-3 shadow-glass">
              <div className="text-sm font-medium">{dragged.label}</div>
              <div className="text-xs capitalize text-muted-foreground">{dragged.type} field</div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
