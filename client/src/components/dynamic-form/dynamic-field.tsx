import type { FieldValues, UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import type { FormField as FormFieldType } from "@/lib/form-configs/types"

interface DynamicFieldProps {
  field: FormFieldType
  form: UseFormReturn<FieldValues>
}

export function DynamicField({ field, form }: DynamicFieldProps) {
  const renderField = () => {
    switch (field.type) {
      case "text":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="ml-1 text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <Input placeholder={field.placeholder} {...formField} />
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "number":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="ml-1 text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={field.placeholder}
                    step={field.step}
                    min={field.min}
                    max={field.max}
                    {...formField}
                    onChange={(e) => formField.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "textarea":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="ml-1 text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <Textarea placeholder={field.placeholder} {...formField} />
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "dateTime":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="ml-1 text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...formField} />
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "radio":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="ml-1 text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={formField.onChange}
                    defaultValue={formField.value}
                    className="flex flex-col space-y-2"
                  >
                    {field.options?.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                        <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "checkbox":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={() => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="ml-1 text-destructive">*</span>}
                </FormLabel>
                <div className="space-y-2">
                  {field.options?.map((option) => (
                    <FormField
                      key={option.value}
                      control={form.control}
                      name={field.id}
                      render={({ field: formField }) => {
                        return (
                          <FormItem key={option.value} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={formField.value?.includes(option.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? formField.onChange([...(formField.value ?? []), option.value])
                                    : formField.onChange(
                                        formField.value?.filter((value: string) => value !== option.value),
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{option.label}</FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "select":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="ml-1 text-destructive">*</span>}
                </FormLabel>
                <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "slider":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}: {formField.value || field.min || 0}
                  {field.required && <span className="ml-1 text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <Slider
                    min={field.min || 0}
                    max={field.max || 10}
                    step={field.step || 1}
                    value={[formField.value || field.min || 0]}
                    onValueChange={(vals) => formField.onChange(vals[0])}
                    className="w-full"
                  />
                </FormControl>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{field.min || 0}</span>
                  <span>{field.max || 10}</span>
                </div>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      default:
        return null
    }
  }

  return renderField()
}
