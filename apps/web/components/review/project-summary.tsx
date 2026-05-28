"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Sparkles, Clock, AlertTriangle } from "lucide-react"
import { COMPLEXITY_CONFIG } from "@ai-delivery/core"
import type { ParsedRequirement } from "@ai-delivery/schemas"

export function ProjectSummary({ parsed }: { parsed: ParsedRequirement }) {
  const complexity = COMPLEXITY_CONFIG[parsed.estimatedComplexity] ?? COMPLEXITY_CONFIG.medium

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold tracking-tight">
          We understood your project like this:
        </h2>
      </div>

      <Card className="border-2 border-primary/10 bg-primary/5">
        <CardContent className="pt-6">
          <p className="text-lg leading-relaxed text-foreground/80">{parsed.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm">
              {parsed.projectType}
            </Badge>
            <Badge
              variant="outline"
              className={`text-sm bg-${complexity.color}-50 text-${complexity.color}-700 border-${complexity.color}-200`}
            >
              {complexity.label} · ~{complexity.weeks}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {parsed.coreFeatures.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Core Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2">
              {parsed.coreFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {parsed.suggestedStack && parsed.suggestedStack.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Suggested Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {parsed.suggestedStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="font-mono text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {parsed.suggestedTimeline && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Estimated timeline: {parsed.suggestedTimeline}
        </div>
      )}

      {parsed.riskAreas && parsed.riskAreas.length > 0 && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>Potential risks: {parsed.riskAreas.join(", ")}</span>
        </div>
      )}
    </div>
  )
}
