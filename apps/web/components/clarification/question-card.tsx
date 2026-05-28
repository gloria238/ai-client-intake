"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { HelpCircle } from "lucide-react"

interface QuestionCardProps {
  question: string
  category?: string
  value: string
  onChange: (value: string) => void
}

export function QuestionCard({ question, category, value, onChange }: QuestionCardProps) {
  return (
    <Card className="transition-all duration-200 hover:border-primary/20">
      <CardContent className="pt-6 space-y-3">
        <div className="flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <p className="text-base">{question}</p>
            {category && (
              <Badge variant="outline" className="text-xs">
                {category}
              </Badge>
            )}
          </div>
        </div>
        <Textarea
          placeholder="Your answer (optional — feel free to skip)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="resize-y min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground">
          This is optional. Skip anything you&apos;re not sure about.
        </p>
      </CardContent>
    </Card>
  )
}
