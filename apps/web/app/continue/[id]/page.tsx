"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { QuestionCard } from "@/components/clarification"
import { AnimatedContainer } from "@ai-delivery/ui"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, ArrowLeft, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import type { Clarification } from "@ai-delivery/schemas"
import Link from "next/link"

export default function ContinuePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [clarifications, setClarifications] = useState<Clarification[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/intake/${id}/export`)
        if (!res.ok) throw new Error("Failed to load")
        const data = await res.json()
        setClarifications((data.clarifications as Clarification[]) ?? [])
      } catch {
        toast.error("Could not load questions.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleContinue() {
    setSaving(true)
    try {
      const answered = Object.entries(answers)
        .filter(([, v]) => v.trim())
        .map(([clarificationId, answer]) => ({ id: clarificationId, answer }))

      await fetch(`/api/intake/${id}/clarify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answered }),
      })

      router.push(`/export/${id}`)
    } catch {
      toast.error("Could not save answers. You can skip.")
      router.push(`/export/${id}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="flex-1 flex flex-col px-4 py-12">
        <div className="w-full max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 flex flex-col px-4 py-8 md:py-12">
      <AnimatedContainer className="w-full max-w-2xl mx-auto space-y-8">
        <Link href={`/review/${id}`} className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-9 px-3 -ml-2 w-fit transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to review
        </Link>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            Let&apos;s think through a few details
          </h1>
          <p className="mt-2 text-muted-foreground">
            These are gentle prompts to help clarify your project. Everything is
            optional — skip what you&apos;re unsure about.
          </p>
        </div>

        {clarifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No clarification questions needed. Your project looks clear.
            </p>
            <Button
              size="lg"
              className="rounded-2xl px-6"
              onClick={() => router.push(`/export/${id}`)}
            >
              View your summary
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {clarifications.map((c) => (
              <QuestionCard
                key={c.id ?? c.question}
                question={c.question}
                category={c.category}
                value={answers[c.id ?? c.question] ?? ""}
                onChange={(v) =>
                  setAnswers((prev) => ({ ...prev, [c.id ?? c.question]: v }))
                }
              />
            ))}
          </div>
        )}

        {clarifications.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              size="lg"
              className="rounded-2xl px-6 group"
              onClick={handleContinue}
              disabled={saving}
            >
              {saving ? "Saving..." : "Continue to summary"}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl px-6"
              onClick={() => router.push(`/export/${id}`)}
            >
              Skip all questions
            </Button>
          </div>
        )}
      </AnimatedContainer>
    </main>
  )
}
