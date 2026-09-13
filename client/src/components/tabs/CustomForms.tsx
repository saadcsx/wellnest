import { useCallback, useEffect, useState } from "react"
import { LayoutTemplate, Loader2, Plus, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FormBuilder } from "@/components/form-builder/FormBuilder"
import { api, type CustomFormRecord } from "@/lib/api"

export default function CustomForms() {
  const [forms, setForms] = useState<CustomFormRecord[]>([])
  const [selected, setSelected] = useState<CustomFormRecord | null>(null)
  const [showBuilder, setShowBuilder] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      setForms(await api.forms.list())
    } catch (err) {
      console.error("Failed to load forms:", err)
      toast.error("Could not load your forms")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const handleSave = async (form: CustomFormRecord) => {
    await api.forms.save(form)
    toast.success(form.id ? "Form updated" : "Form created")
    setShowBuilder(false)
    setSelected(null)
    await load()
  }

  const handleDelete = async (form: CustomFormRecord) => {
    if (!form.id || !window.confirm(`Delete “${form.name}”? This can’t be undone.`)) return
    try {
      await api.forms.remove(form.id)
      toast.success("Form deleted")
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete the form")
    }
  }

  if (showBuilder) {
    return (
      <FormBuilder
        form={selected ?? undefined}
        onSave={handleSave}
        onCancel={() => {
          setShowBuilder(false)
          setSelected(null)
        }}
      />
    )
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
      <div className="mx-auto max-w-6xl space-y-5 p-4 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Custom forms</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Build intake forms for the specialties and situations the defaults don’t cover.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setSelected(null)
              setShowBuilder(true)
            }}
          >
            <Plus />
            New form
          </Button>
        </div>

        {isLoading ? (
          <div className="surface flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading forms…
          </div>
        ) : forms.length === 0 ? (
          <div className="surface flex flex-col items-center gap-3 px-6 py-16 text-center">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-accent/60 text-primary">
              <LayoutTemplate className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h2 className="text-[15px] font-semibold tracking-tight">No custom forms yet</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Drag field types into a form, set labels and validation, and it will be ready for the next assessment.
            </p>
            <Button size="sm" variant="outline" onClick={() => setShowBuilder(true)}>
              <Plus />
              Create your first form
            </Button>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <li key={form.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(form)
                    setShowBuilder(true)
                  }}
                  className="surface group flex h-full w-full flex-col p-5 text-left transition-colors hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[15px] font-semibold tracking-tight">{form.name}</h3>
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label={`Delete ${form.name}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        void handleDelete(form)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          e.stopPropagation()
                          void handleDelete(form)
                        }
                      }}
                      className="rounded-full p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive focus:opacity-100 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-muted-foreground">
                    {form.description || "No description"}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <Badge variant="outline">{form.fields?.length ?? 0} fields</Badge>
                    {form.updatedAt && <span>Edited {new Date(form.updatedAt).toLocaleDateString()}</span>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
