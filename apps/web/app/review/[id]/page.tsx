"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, ExternalLink } from "lucide-react"

export default function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/intake/${id}/export`)
        if (!res.ok) throw new Error("Failed to load project")
        const data = await res.json()
        setProject(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <main className="flex-1 flex flex-col px-4 py-12">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </main>
    )
  }

  if (error || !project) {
    return (
      <main className="flex-1 flex flex-col px-4 py-24 items-center justify-center text-center">
        <p className="text-muted-foreground mb-4">
          {error ?? "Project not found."}
        </p>
        <Link href="/" className="inline-flex items-center justify-center rounded-md border bg-background text-sm font-medium hover:bg-accent h-10 px-4 transition-colors">
          Start over
        </Link>
      </main>
    )
  }

  const parsed = project.parsed_output
  const isNewFormat = parsed && "intentProfile" in parsed

  return (
    <main className="flex-1 flex flex-col px-4 py-8 md:py-12">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium hover:bg-accent h-9 px-3 -ml-2 w-fit transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Project Review</h1>
          <p className="text-muted-foreground">
            {isNewFormat ? parsed.projectSummary : parsed?.summary ?? "Parsed project"}
          </p>
        </div>

        <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 p-6">
          <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans">
            {project.raw_input}
          </pre>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/export/${id}`}
            className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            View Export
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </main>
  )
}
