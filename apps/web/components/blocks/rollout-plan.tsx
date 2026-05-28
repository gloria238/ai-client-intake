"use client"

import { motion } from "framer-motion"
import { Calendar, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react"
import type { ServiceSelection } from "@ai-delivery/schemas"
import { SERVICE_CATALOG } from "@ai-delivery/core"

interface RolloutProps {
  modules: { moduleId: string; services: ServiceSelection[] }[]
  reviewNote: string
  pressureWarnings: { dimension: string; note: string }[]
}

export function RolloutPlan({ modules, reviewNote, pressureWarnings }: RolloutProps) {
  const allSelected = modules.flatMap((m) => m.services.filter((s) => s.selected))
  const v1Services = allSelected.filter((s) => s.phase === "v1")
  const laterServices = allSelected.filter((s) => s.phase === "later")

  // Group later services by module for phase suggestions
  const laterByModule = modules.map((m) => {
    const later = m.services.filter((s) => s.selected && s.phase === "later")
    return { moduleId: m.moduleId, services: later }
  }).filter((m) => m.services.length > 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-2xl border-2 border-[#D1D5DB] bg-white overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-[#D1D5DB]/50 flex items-center gap-3">
        <Calendar className="h-5 w-5 text-[#002FA7]" />
        <div>
          <h3 className="text-base font-bold text-[#0A0A0D]">Delivery Strategy</h3>
          <p className="text-sm text-[#5A5F6B]">Phased rollout based on risk and dependencies</p>
        </div>
        <span className="ml-auto text-sm font-semibold text-[#002FA7]">
          {v1Services.length} V1 · {laterServices.length} Later
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Phase 1 — V1 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#002FA7] text-white text-xs font-bold">1</span>
            <h4 className="text-sm font-bold text-[#0A0A0D]">Phase 1 — Launch Core</h4>
            <span className="text-xs text-[#9399A3]">{v1Services.length} services</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {v1Services.slice(0, 8).map((svc) => {
              const def = SERVICE_CATALOG.find((d) => d.id === svc.serviceId)
              return (
                <div key={svc.serviceId} className="flex items-center gap-2 text-sm bg-[#F7F8FA] rounded-lg px-3 py-2">
                  <CheckCircle className="h-3.5 w-3.5 text-[#002FA7] shrink-0" />
                  <span className="text-[#1A1D23]">{def?.outcome ?? svc.serviceId}</span>
                </div>
              )
            })}
          </div>
          {v1Services.length > 8 && (
            <p className="text-xs text-[#9399A3] mt-1.5">+{v1Services.length - 8} more core services</p>
          )}
        </div>

        {/* Phase 2 — Later */}
        {laterByModule.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#D1D5DB] text-[#5A5F6B] text-xs font-bold">2</span>
              <h4 className="text-sm font-bold text-[#0A0A0D]">Phase 2 — Expand</h4>
              <span className="text-xs text-[#9399A3]">{laterServices.length} services</span>
            </div>
            <div className="space-y-2">
              {laterByModule.map((m) => (
                <div key={m.moduleId} className="flex items-center gap-2 text-sm">
                  <ArrowRight className="h-3.5 w-3.5 text-[#9399A3] shrink-0" />
                  <span className="text-[#5A5F6B]">
                    {m.services.slice(0, 3).map((s) => {
                      const def = SERVICE_CATALOG.find((d) => d.id === s.serviceId)
                      return def?.outcome ?? s.serviceId
                    }).join(" · ")}
                    {m.services.length > 3 && ` +${m.services.length - 3} more`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {pressureWarnings.length > 0 && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 space-y-1.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <p className="text-sm font-bold text-amber-800">Watch out for</p>
            </div>
            {pressureWarnings.map((pw) => (
              <p key={pw.dimension} className="text-sm text-amber-700">{pw.note}</p>
            ))}
          </div>
        )}

        {/* Review note */}
        <div className="bg-[#E8F0FF] rounded-xl px-4 py-3 flex items-start gap-3">
          <span className="text-[#002FA7] font-bold text-sm shrink-0">Our take</span>
          <p className="text-sm text-[#1A1D23] leading-relaxed">{reviewNote}</p>
        </div>
      </div>
    </motion.div>
  )
}
