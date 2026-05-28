import { createServerSupabase } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { STATUS_LABELS, MODULE_META, SERVICE_CATALOG } from "@ai-delivery/core"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { ParsedRequirement, Clarification, IntakeResult } from "@ai-delivery/schemas"

type AnyParsed = ParsedRequirement | IntakeResult

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let project: {
    raw_input: string
    parsed_output: AnyParsed | null
    status: string
    created_at: string
  } | null = null
  let clarifications: Clarification[] = []

  try {
    const supabase = await createServerSupabase()
    const { data: p } = await supabase
      .schema("clientintake")
      .from("projects")
      .select("*")
      .eq("id", id)
      .single()
    project = p as typeof project

    const { data: c } = await supabase
      .schema("clientintake")
      .from("clarifications")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: true })
    clarifications = (c as Clarification[]) ?? []
  } catch {
    // ignore
  }

  if (!project) {
    return (
      <main className="p-6 md:p-8 max-w-4xl mx-auto text-center py-24">
        <p className="text-muted-foreground mb-4">Project not found.</p>
        <Link href="/admin" className="text-primary hover:underline">
          Back to pipeline
        </Link>
      </main>
    )
  }

  const parsed = project.parsed_output
  const isNewFormat = parsed && "intentProfile" in parsed

  return (
    <main className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to pipeline
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Project Detail</h1>
        <Badge>{STATUS_LABELS[project.status] ?? project.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Raw Input</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans">
            {project.raw_input}
          </pre>
        </CardContent>
      </Card>

      {parsed && isNewFormat && (
        <NewFormatView parsed={parsed as IntakeResult} />
      )}

      {parsed && !isNewFormat && (
        <OldFormatView parsed={parsed as ParsedRequirement} />
      )}

      {clarifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clarifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {clarifications.map((c) => (
                <li key={c.id} className="text-sm">
                  <p className="font-medium">{c.question}</p>
                  <p className="text-muted-foreground">
                    {c.answer || "(no answer yet)"}
                  </p>
                  {c.category && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {c.category}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </main>
  )
}

function NewFormatView({ parsed }: { parsed: IntakeResult }) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Understanding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{parsed.projectSummary}</p>

          <div className="flex flex-wrap gap-2">
            {Object.entries(parsed.intentProfile).map(([k, v]) => (
              <Badge key={k} variant="outline" className="text-xs">
                {k}: {v}
              </Badge>
            ))}
          </div>

          <Separator />

          <div>
            <p className="font-medium mb-1">Review Note</p>
            <p className="text-sm text-muted-foreground">{parsed.reviewNote}</p>
          </div>
        </CardContent>
      </Card>

      {parsed.modules.map((mod) => {
        const meta = MODULE_META[mod.moduleId as keyof typeof MODULE_META]
        const selected = mod.services.filter((s) => s.selected)
        if (selected.length === 0) return null
        return (
          <Card key={mod.moduleId}>
            <CardHeader>
              <CardTitle className="text-base">
                {meta?.emoji} {meta?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {selected.map((svc) => {
                  const def = SERVICE_CATALOG.find((d) => d.id === svc.serviceId)
                  return (
                    <li key={svc.serviceId} className="text-sm flex items-center gap-2">
                      <Badge variant={svc.phase === "v1" ? "default" : "outline"} className="text-[10px]">
                        {svc.phase}
                      </Badge>
                      <span>{def?.outcome ?? svc.serviceId}</span>
                      <span className="text-muted-foreground/50 text-xs">
                        ({def?.implementation ?? svc.serviceId})
                      </span>
                    </li>
                  )
                })}
              </ul>
              <p className="text-[11px] text-muted-foreground/50 mt-2 italic">{mod.summary}</p>
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}

function OldFormatView({ parsed }: { parsed: ParsedRequirement }) {
  const complexityColors: Record<string, string> = {
    simple: "emerald", medium: "amber", complex: "rose",
  }
  const complexityLabels: Record<string, string> = {
    simple: "Simple", medium: "Medium", complex: "Complex",
  }
  const color = complexityColors[parsed.estimatedComplexity] ?? "amber"
  const label = complexityLabels[parsed.estimatedComplexity] ?? "Medium"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI-Structured Understanding (Legacy)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="font-medium">Project Type:</span>{" "}
          <Badge variant="secondary">{parsed.projectType}</Badge>
          <Badge variant="outline" className={`ml-2 bg-${color}-50 text-${color}-700`}>
            {label}
          </Badge>
        </div>
        <div>
          <p className="font-medium mb-1">Summary</p>
          <p className="text-sm text-muted-foreground">{parsed.summary}</p>
        </div>
        <Separator />
        <div>
          <p className="font-medium mb-1">Core Features</p>
          <ul className="grid grid-cols-2 gap-1">
            {parsed.coreFeatures.map((f) => (
              <li key={f} className="text-sm flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
