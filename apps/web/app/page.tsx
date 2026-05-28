"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Sparkles, Loader2, Copy, Check, Wand2, ArrowUp, ExternalLink } from "lucide-react"
import Link from "next/link"
import { MODULE_META, SERVICE_CATALOG, checkComplexityPressure, type IntentProfile } from "@ai-delivery/core"
import type { IntakeResult } from "@ai-delivery/schemas"
import { Textarea } from "@/components/ui/textarea"
import { CapabilityTopology } from "@/components/blocks/capability-topology"
import { InterfaceBlueprint } from "@/components/blocks/interface-blueprint"
import { ExperienceCard } from "@/components/blocks/experience-card"
import { RolloutPlan } from "@/components/blocks/rollout-plan"

/* ── helpers ─────────────────────────────────── */

function intentLabel(level: string): string {
  switch (level) { case "high": return "High"; case "medium": return "Mid"; case "low": return "Low"; default: return "" }
}

/* ── page ────────────────────────────────────── */

export default function HomePage() {
  const [rawInput, setRawInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<IntakeResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [showIntent, setShowIntent] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const hasResults = !!result

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
      if (!res.ok) { const err = await res.json(); throw new Error(err.error ?? "Something went wrong") }
      const data = await res.json()
      setResult(data.result)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Try again?")
    } finally { setLoading(false) }
  }

  const allSelectedIds = result
    ? result.modules.flatMap((m) => m.services.filter((s) => s.selected).map((s) => s.serviceId))
    : []
  const pressureWarnings = result ? checkComplexityPressure(allSelectedIds) : []

  async function handleCopy() {
    if (!result) return
    const lines: string[] = []
    for (const mod of result.modules) {
      const meta = MODULE_META[mod.moduleId as keyof typeof MODULE_META]
      const selected = mod.services.filter((s) => s.selected)
      if (selected.length === 0) continue
      lines.push(`${meta.emoji} ${meta.title}`)
      for (const svc of selected) {
        const def = SERVICE_CATALOG.find((d) => d.id === svc.serviceId)
        lines.push(`  ${svc.phase === "v1" ? "V1" : "Later"} · ${def?.outcome ?? svc.serviceId} → ${def?.implementation ?? svc.serviceId}`)
      }
      lines.push("")
    }
    await navigator.clipboard.writeText(lines.join("\n"))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Copied to clipboard")
  }

  return (
    <main className="flex-1 flex flex-col">

      {/* ═══ NAV ═══ */}
      <nav className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-[#002FA7]">Blueprint</Link>
        <Link href="/admin" className="text-sm font-medium text-[#5A5F6B] hover:text-[#002FA7] transition-colors flex items-center gap-1">
          Admin <ExternalLink className="h-3 w-3" />
        </Link>
      </nav>

      <div className="flex-1 w-full max-w-4xl mx-auto px-6 pb-40">

        {/* ═══ HERO + INPUT ═══ */}
        <motion.div
          animate={{ paddingTop: hasResults ? "0px" : "10vh" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="space-y-8"
        >
          <AnimatePresence mode="wait">
            {!hasResults && (
              <motion.header
                key="hero"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, height: 0, marginBottom: 0 }}
                className="space-y-6"
              >
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-[#0A0A0D]">
                  Your product,{" "}
                  <span className="text-[#002FA7]">clearly understood.</span>
                </h1>
                <p className="text-xl text-[#5A5F6B] max-w-xl leading-relaxed">
                  Paste what your client sent, a job post, or just describe freely.
                  We map business intent to technical capability — bold, clear, no jargon.
                </p>
              </motion.header>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className={`rounded-2xl transition-all duration-300 border-2 ${
              hasResults
                ? "border-[#D1D5DB] bg-[#F7F8FA]"
                : "border-[#D1D5DB] bg-white hover:border-[#002FA7]/30 focus-within:border-[#002FA7] focus-within:shadow-[0_0_0_4px_rgba(0,47,167,0.08)]"
            }`}>
              <Textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                disabled={loading}
                placeholder="I need an AI customer support platform handling thousands of users simultaneously, with automated email follow-ups, a real-time admin dashboard, and role-based access for different teams..."
                className={`border-0 bg-transparent resize-y placeholder:text-[#9399A3] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300 ${
                  hasResults ? "min-h-[72px] text-base px-6 py-4" : "min-h-[200px] text-lg px-6 py-5 leading-relaxed"
                }`}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#9399A3]">{hasResults ? "Edit and submit again to re-analyze" : "No account needed · No pressure"}</p>
              <button type="submit" disabled={loading || rawInput.trim().length < 10}
                className="shrink-0 inline-flex items-center gap-2.5 px-8 h-12 bg-[#002FA7] text-white text-base font-semibold rounded-xl hover:bg-[#0028A0] active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 shadow-[0_4px_24px_rgba(0,47,167,0.25)] hover:shadow-[0_8px_32px_rgba(0,47,167,0.35)]"
              >
                {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing</> : <><Wand2 className="h-5 w-5" /> Understand</>}
              </button>
            </div>
          </form>
        </motion.div>

        {/* ═══ LOADING ═══ */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-16 space-y-6">
              <div className="h-8 w-48 bg-[#F7F8FA] rounded-lg animate-pulse" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-[160px] rounded-2xl bg-[#F7F8FA] animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ RESULTS — 4 STAGES ═══ */}
        {hasResults && !loading && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-16 space-y-20"
          >

            {/* ─────────────────────────────────────
                STAGE 1 — PROBLEM UNDERSTANDING
                ───────────────────────────────────── */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#002FA7] text-white text-sm font-bold">1</span>
                <span className="text-sm font-bold text-[#002FA7] uppercase tracking-[0.15em]">Problem Understanding</span>
              </div>

              {/* Product direction */}
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-[#0A0A0D] tracking-tight leading-tight">
                  {result.projectSummary}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* What makes this difficult */}
                <div className="rounded-2xl border-2 border-[#D1D5DB] bg-white p-5">
                  <h3 className="text-sm font-bold text-[#5A5F6B] uppercase tracking-wide mb-3">What makes this challenging</h3>
                  <ul className="space-y-2">
                    {result.modules.flatMap((m) =>
                      m.services.filter((s) => s.selected).slice(0, 2).map((s) => {
                        const def = SERVICE_CATALOG.find((d) => d.id === s.serviceId)
                        return def ? { outcome: def.outcome, id: s.serviceId } : null
                      })
                    ).filter(Boolean).slice(0, 4).map((item) => item && (
                      <li key={item.id} className="flex items-start gap-2 text-sm text-[#1A1D23]">
                        <span className="text-[#002FA7] mt-0.5">—</span>
                        <span>{item.outcome} — requires careful architecture</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Primary pressures */}
                <div className="rounded-2xl border-2 border-[#D1D5DB] bg-white p-5">
                  <h3 className="text-sm font-bold text-[#5A5F6B] uppercase tracking-wide mb-3">Primary Pressures</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(result.intentProfile) as (keyof IntentProfile)[]).map((k) => {
                      const level = result.intentProfile[k]
                      if (level === "low") return null
                      return (
                        <span key={k} className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg ${
                          level === "high" ? "bg-red-50 text-red-600 border border-red-200" :
                          "bg-amber-50 text-amber-600 border border-amber-200"
                        }`}>
                          {k} · {intentLabel(level)}
                        </span>
                      )
                    })}
                  </div>
                  {result.experienceProfile?.activePressures && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {result.experienceProfile.activePressures.slice(0, 4).map((p) => (
                        <span key={p} className="text-xs text-[#5A5F6B] bg-[#F7F8FA] px-2 py-0.5 rounded-md">
                          {p.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ─────────────────────────────────────
                STAGE 2 — SYSTEM ARCHITECTURE
                ───────────────────────────────────── */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#002FA7] text-white text-sm font-bold">2</span>
                <span className="text-sm font-bold text-[#002FA7] uppercase tracking-[0.15em]">System Architecture</span>
              </div>

              <h2 className="text-3xl font-extrabold text-[#0A0A0D] tracking-tight mb-6">Capability topology</h2>

              <CapabilityTopology
                modules={result.modules}
                catalog={SERVICE_CATALOG}
              />

              {/* Pressure warnings */}
              {pressureWarnings.length > 0 && (
                <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 px-5 py-4 space-y-2">
                  {pressureWarnings.map((pw) => (
                    <p key={pw.dimension} className="text-sm text-amber-800 flex items-start gap-2">
                      <span className="text-amber-500 font-bold shrink-0">!</span>
                      {pw.note}
                    </p>
                  ))}
                </div>
              )}

              {/* Intent profile collapsed */}
              <div className="mt-4">
                <button onClick={() => setShowIntent(!showIntent)} className="text-sm font-medium text-[#9399A3] hover:text-[#002FA7] transition-colors">
                  {showIntent ? "Hide" : "Show"} full analysis profile
                </button>
                <AnimatePresence>
                  {showIntent && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <div className="flex flex-wrap gap-2 pt-3">
                        {(Object.keys(result.intentProfile) as (keyof IntentProfile)[]).map((k) => (
                          <span key={k} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg bg-[#F7F8FA] text-[#5A5F6B] border border-[#D1D5DB]">
                            {k} <span className="text-[#002FA7]">{intentLabel(result.intentProfile[k])}</span>
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* ─────────────────────────────────────
                STAGE 3 — PRODUCT STRUCTURE
                ───────────────────────────────────── */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#002FA7] text-white text-sm font-bold">3</span>
                <span className="text-sm font-bold text-[#002FA7] uppercase tracking-[0.15em]">Product Structure</span>
              </div>

              <h2 className="text-3xl font-extrabold text-[#0A0A0D] tracking-tight mb-6">Interface blueprint</h2>

              {result.experienceProfile && (
                <InterfaceBlueprint profile={result.experienceProfile} />
              )}

              {/* Experience direction — secondary, collapsible */}
              {result.experienceProfile && (
                <div className="mt-6">
                  <ExperienceCard profile={result.experienceProfile} />
                </div>
              )}
            </section>

            {/* ─────────────────────────────────────
                STAGE 4 — DELIVERY STRATEGY
                ───────────────────────────────────── */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#002FA7] text-white text-sm font-bold">4</span>
                <span className="text-sm font-bold text-[#002FA7] uppercase tracking-[0.15em]">Delivery Strategy</span>
              </div>

              <h2 className="text-3xl font-extrabold text-[#0A0A0D] tracking-tight mb-6">How to build this</h2>

              <RolloutPlan
                modules={result.modules}
                reviewNote={result.reviewNote}
                pressureWarnings={pressureWarnings}
              />
            </section>

            {/* ── BOTTOM BAR ── */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-[#D1D5DB]">
              <p className="text-base text-[#9399A3]">AI suggestions are a starting point. Copy and share with your team.</p>
              <button onClick={handleCopy}
                className="inline-flex items-center gap-2 px-6 h-12 rounded-xl border-2 border-[#D1D5DB] bg-white text-base font-semibold text-[#1A1D23] hover:border-[#002FA7] hover:text-[#002FA7] transition-all duration-200"
              >
                {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Back to top */}
            <div className="text-center pb-8">
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-2 text-base text-[#9399A3] hover:text-[#002FA7] transition-colors font-medium"
              >
                <ArrowUp className="h-4 w-4" /> Edit input
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══ EMPTY STATE ═══ */}
        <AnimatePresence>
          {!hasResults && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-24">
              <div className="text-center mb-16">
                <span className="text-sm font-bold text-[#002FA7] uppercase tracking-[0.15em]">How it works</span>
                <h2 className="text-4xl font-extrabold text-[#0A0A0D] mt-3">Three steps. Zero friction.</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                {[
                  { step: "01", title: "Describe", desc: "Paste any project description — raw, AI-generated, or a job post. No structure required." },
                  { step: "02", title: "Analyze", desc: "Our AI extracts business intent, maps 39 capabilities across 4 modules, and flags complexity risks." },
                  { step: "03", title: "Decide", desc: "Review the architecture, blueprint, and phased rollout plan. Copy and share with your team." },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="text-center space-y-3">
                    <span className="text-6xl font-extrabold text-[#002FA7]/10">{step}</span>
                    <h3 className="text-xl font-extrabold text-[#0A0A0D]">{title}</h3>
                    <p className="text-base text-[#5A5F6B] leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-[#D1D5DB] w-full mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-[#9399A3]">
          <span className="font-bold text-[#002FA7]">Blueprint</span>
          <div className="flex items-center gap-8">
            <Link href="/admin" className="hover:text-[#002FA7] transition-colors font-medium">Admin</Link>
            <span>Product architecture for the AI era</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
