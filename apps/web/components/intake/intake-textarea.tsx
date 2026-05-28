"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface IntakeTextareaProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function IntakeTextarea({ value, onChange, disabled }: IntakeTextareaProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="project-input" className="text-sm text-muted-foreground">
        Describe your project in plain language — or paste a job posting below.
      </Label>
      <Textarea
        id="project-input"
        placeholder={`Example: "I need an AI SaaS where students can upload PDFs, get AI summaries, and save their history. Users should be able to pay monthly."`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="min-h-[220px] resize-y text-base leading-relaxed"
      />
    </div>
  )
}
