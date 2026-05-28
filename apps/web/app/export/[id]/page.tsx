"use client"

import { useEffect, useState, use } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { MODULE_META, SERVICE_CATALOG } from "@ai-delivery/core"
import Link from "next/link"

export default function ExportPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/intake/${id}/export`)
        if (!res.ok) throw new Error("Failed to load")
        const data = await res.json()
        setProject(data)
      } catch {
        toast.error("Could not load project summary.")
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
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </main>
    )
  }

  const parsed = project?.parsed_output
  const isNewFormat = parsed && "intentProfile" in parsed

  if (!project) {
    return (
      <main className="flex-1 flex flex-col px-4 py-24 items-center justify-center text-center">
        <p className="text-muted-foreground mb-4">Project not found.</p>
        <Link href="/" className="inline-flex items-center justify-center rounded-md border bg-background text-sm font-medium hover:bg-accent h-10 px-4 transition-colors">
          Start over
        </Link>
      </main>
    )
  }

  return (
    <main className="flex-1 flex flex-col px-4 py-8 md:py-12">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium hover:bg-accent h-9 px-3 -ml-2 w-fit transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Your project, structured
          </h1>
          <p className="mt-2 text-muted-foreground">
            A clean summary you can share with a developer. Copy it, email it, or screenshot it.
          </p>
        </div>

        <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 p-6 space-y-6">
          {isNewFormat ? (
            <>
              <p className="text-lg font-medium">{parsed.projectSummary}</p>

              {parsed.modules.map((mod: any) => {
                const meta = MODULE_META[mod.moduleId as keyof typeof MODULE_META]
                const selected = mod.services.filter((s: any) => s.selected)
                if (selected.length === 0) return null
                return (
                  <div key={mod.moduleId} className="space-y-2">
                    <h3 className="text-sm font-semibold">{meta?.emoji} {meta?.title}</h3>
                    <p className="text-[11px] text-muted-foreground italic">{mod.summary}</p>
                    <ul className="space-y-1">
                      {selected.map((svc: any) => {
                        const def = SERVICE_CATALOG.find((d) => d.id === svc.serviceId)
                        return (
                          <li key={svc.serviceId} className="text-sm flex items-center gap-2">
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${svc.phase === "v1" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                              {svc.phase}
                            </span>
                            {def?.outcome ?? svc.serviceId}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}

              <div className="pt-4 border-t border-black/5">
                <p className="text-sm text-amber-700 bg-amber-50/60 rounded-xl px-4 py-3">
                  {parsed.reviewNote}
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-lg font-medium">{parsed?.projectType ?? "Project"}</p>
              <p className="text-sm text-muted-foreground">{parsed?.summary}</p>
              {parsed?.coreFeatures && (
                <ul className="space-y-1">
                  {parsed.coreFeatures.map((f: string) => (
                    <li key={f} className="text-sm flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Link href="/" className="inline-flex items-center justify-center gap-1.5 rounded-md border bg-background text-sm font-medium hover:bg-accent h-10 px-4 transition-colors">
            Start another project
          </Link>
        </div>
      </div>
    </main>
  )
}
