import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { specialties } from "@/lib/form-configs/specialties"
import type { Specialty } from "@/lib/form-configs/types"

interface SpecialtySelectorProps {
  onSpecialtySelect: (specialty: Specialty) => void
  selectedSpecialty?: Specialty
}

export function SpecialtySelector({ onSpecialtySelect, selectedSpecialty }: SpecialtySelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-[260px_1fr] sm:items-end">
      <div className="space-y-1.5">
        <Label htmlFor="specialty">Specialty</Label>
        <Select
          value={selectedSpecialty?.id ?? ""}
          onValueChange={(id) => {
            const s = specialties.find((x) => x.id === id)
            if (s) onSpecialtySelect(s)
          }}
        >
          <SelectTrigger id="specialty">
            <SelectValue placeholder="Choose a specialty form" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground sm:pb-2.5">
        {selectedSpecialty?.description ?? "Each specialty ships a focused intake form. Required fields are marked."}
      </p>
    </div>
  )
}
