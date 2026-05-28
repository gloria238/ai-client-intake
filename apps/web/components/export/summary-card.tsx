"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, HelpCircle, Clock, Send, Copy, Check } from "lucide-react"
import { COMPLEXITY_CONFIG, APP_NAME } from "@ai-delivery/core"
import type { ParsedRequirement, Clarification } from "@ai-delivery/schemas"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SummaryCardProps {
  parsed: ParsedRequirement
  clarifications: Clarification[]
}

export function SummaryCard({ parsed, clarifications }: SummaryCardProps) {
  const [copied, setCopied] = useState(false)
  const complexity = COMPLEXITY_CONFIG[parsed.estimatedComplexity] ?? COMPLEXITY_CONFIG.medium

  const text = [
    `# Project Summary — ${APP_NAME}`,
    "",
    `## Project Type`,
    parsed.projectType,
    "",
    `## Core Features`,
    ...parsed.coreFeatures.map((f) => `- ${f}`),
    "",
    `## Target Users`,
    ...parsed.targetUsers.map((u) => `- ${u}`),
    "",
    `## Suggested Stack`,
    ...(parsed.suggestedStack ?? []).map((s) => `- ${s}`),
    "",
    `## Recommended Modules`,
    ...parsed.recommendedModules.map((m) => `- ${m}`),
    "",
    `## Timeline`,
    parsed.suggestedTimeline ?? `${complexity.weeks} weeks`,
    "",
    `## Complexity`,
    complexity.label,
    "",
    `## Open Questions & Answers`,
    ...clarifications.map(
      (c) => `- ${c.question}\n  Answer: ${c.answer || "(skipped)"}`,
    ),
  ].join("\n")

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            Project Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-1">Project Type</h3>
            <Badge className="text-sm">{parsed.projectType}</Badge>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Core Features</h3>
            <ul className="grid gap-1">
              {parsed.coreFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {parsed.suggestedStack && parsed.suggestedStack.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Suggested Stack</h3>
              <div className="flex flex-wrap gap-2">
                {parsed.suggestedStack.map((s) => (
                  <Badge key={s} variant="secondary" className="font-mono text-xs">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 text-sm">
            {parsed.suggestedTimeline && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {parsed.suggestedTimeline}
              </div>
            )}
            <Badge
              variant="outline"
              className={`bg-${complexity.color}-50 text-${complexity.color}-700 border-${complexity.color}-200`}
            >
              {complexity.label}
            </Badge>
          </div>

          {parsed.recommendedModules.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Recommended Modules</h3>
              <div className="flex flex-wrap gap-2">
                {parsed.recommendedModules.map((m) => (
                  <Badge key={m} variant="outline" className="text-xs">
                    {m}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {clarifications.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                Questions &amp; Answers
              </h3>
              <ul className="space-y-2">
                {clarifications.map((c) => (
                  <li key={c.id} className="text-sm">
                    <span className="text-muted-foreground">{c.question}</span>
                    <br />
                    <span className="font-medium">
                      {c.answer || "(skipped)"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button size="lg" className="rounded-2xl px-6" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Summary
            </>
          )}
        </Button>
        <a
          href={`mailto:?subject=Project%20Summary&body=${encodeURIComponent(text)}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-input bg-background px-6 h-11 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Send className="h-4 w-4" />
          Send to Developer
        </a>
      </div>
    </div>
  )
}
