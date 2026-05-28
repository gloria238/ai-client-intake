"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IntakeTextarea, SubmitButton } from "@/components/intake"
import { AnimatedContainer } from "@/components/ui/animated-container"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export default function IntakePage() {
  const [rawInput, setRawInput] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rawInput.trim().length < 10) {
      toast.error("Tell us a bit more — even a few sentences helps.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/intake/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput: rawInput.trim() }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Something went wrong")
      }

      const data = await res.json()
      router.push(`/review/${data.projectId}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong. Try again?")
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 flex flex-col px-4 py-8 md:py-16">
      <AnimatedContainer className="w-full max-w-2xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-9 px-3 -ml-2 w-fit transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Tell us about your project
          </h1>
          <p className="mt-2 text-muted-foreground">
            You can write casually, paste a job posting, or share rough notes —
            we&apos;ll make sense of it.
          </p>
        </div>

        <Separator />

        <form onSubmit={handleSubmit} className="space-y-4">
          <IntakeTextarea
            value={rawInput}
            onChange={setRawInput}
            disabled={loading}
          />
          <SubmitButton loading={loading} disabled={rawInput.trim().length < 10} />
        </form>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>No account needed. No pressure. No required fields beyond this.</p>
          <p>Your project description will be processed by AI to extract a structured understanding.</p>
        </div>
      </AnimatedContainer>
    </main>
  )
}
