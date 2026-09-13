import { Wand2 } from "lucide-react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { SAMPLE_DATA_ENABLED } from "@/lib/sample-data"

/**
 * Developer helper: fills the surrounding input with realistic sample data.
 * Renders nothing in production unless VITE_SAMPLE_DATA=true.
 */
export function SampleButton({ children = "Sample", className, ...props }: ButtonProps) {
  if (!SAMPLE_DATA_ENABLED) return null
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      title="Fill with sample data (development helper)"
      className={className}
      {...props}
    >
      <Wand2 className="text-primary" />
      {children}
    </Button>
  )
}
