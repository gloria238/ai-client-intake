import { createServerSupabase } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { STATUS_LABELS } from "@ai-delivery/core"
import Link from "next/link"
import { ArrowRight, LayoutDashboard } from "lucide-react"
import type { ParsedRequirement, IntakeResult } from "@ai-delivery/schemas"

type AnyParsed = (ParsedRequirement & IntakeResult) | ParsedRequirement | IntakeResult

interface ProjectRow {
  id: string
  raw_input: string
  parsed_output: AnyParsed | null
  status: string
  created_at: string
}

export default async function AdminDashboard() {
  let projects: ProjectRow[] = []

  try {
    const supabase = await createServerSupabase()
    const { data } = await supabase
      .schema("clientintake")
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
    projects = (data as ProjectRow[]) ?? []
  } catch {
    // Supabase not configured — show empty state
  }

  const counts = {
    total: projects.length,
    pending: projects.filter((p) => p.status === "pending").length,
    parsed: projects.filter((p) => p.status === "parsed").length,
    clarifying: projects.filter((p) => p.status === "clarifying").length,
    reviewed: projects.filter((p) => p.status === "reviewed").length,
    exported: projects.filter((p) => p.status === "exported").length,
    contacted: projects.filter((p) => p.status === "contacted").length,
  }

  return (
    <main className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Project Pipeline</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {Object.entries(counts).map(([key, count]) => (
          <Card key={key} className="text-center">
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs text-muted-foreground capitalize">{key}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground text-lg mb-2">No projects yet</p>
            <p className="text-sm text-muted-foreground">
              When clients submit their project ideas, they&apos;ll appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/admin/projects/${project.id}`}>
              <Card className="hover:border-primary/30 transition-colors cursor-pointer group">
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="font-medium truncate">
                      {(project.parsed_output as any)?.projectType ?? (project.parsed_output as any)?.projectSummary ?? "Unparsed Project"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {project.raw_input.slice(0, 120)}
                      {project.raw_input.length > 120 ? "..." : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <Badge variant="outline">
                      {STATUS_LABELS[project.status] ?? project.status}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
