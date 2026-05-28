"use client"

import { motion } from "framer-motion"
import { MODULE_META, type ServiceDef } from "@ai-delivery/core"
import type { ServiceSelection } from "@ai-delivery/schemas"

interface TopologyProps {
  modules: { moduleId: string; services: ServiceSelection[]; summary: string }[]
  catalog: ServiceDef[]
}

type RiskLevel = "critical" | "elevated" | "standard"

function assessRisk(serviceId: string): RiskLevel {
  const highRisk = ["cache-layer", "realtime-sync", "ai-orchestra", "payment", "auto-scaling"]
  const mediumRisk = ["ai-agent", "workflow-auto", "role-access", "audit-trail", "realtime-ui"]
  if (highRisk.includes(serviceId)) return "critical"
  if (mediumRisk.includes(serviceId)) return "elevated"
  return "standard"
}

function riskBadge(risk: RiskLevel): string {
  if (risk === "critical") return "border-l-2 border-red-300 bg-red-50/30"
  if (risk === "elevated") return "border-l-2 border-amber-300 bg-amber-50/20"
  return ""
}

function dependencyChain(serviceId: string, catalog: ServiceDef[]): string[] {
  const service = catalog.find((s) => s.id === serviceId)
  return service?.affinity?.requires ?? []
}

export function CapabilityTopology({ modules, catalog }: TopologyProps) {
  return (
    <div className="space-y-8">
      {modules.map((mod, modIdx) => {
        const meta = MODULE_META[mod.moduleId as keyof typeof MODULE_META]
        const selected = mod.services.filter((s) => s.selected)
        const v1Selected = selected.filter((s) => s.phase === "v1")
        const laterSelected = selected.filter((s) => s.phase === "later")
        if (selected.length === 0) return null

        const criticalCount = selected.filter((s) => assessRisk(s.serviceId) === "critical").length

        return (
          <motion.div
            key={mod.moduleId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: modIdx * 0.08 }}
          >
            {/* Module header */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">{meta.emoji}</span>
              <div>
                <h3 className="text-base font-bold text-[#0A0A0D] tracking-tight">{meta.title}</h3>
                <p className="text-sm text-[#5A5F6B]">{meta.subtitle}</p>
              </div>
              {criticalCount > 0 && (
                <span className="ml-auto text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
                  {criticalCount} critical
                </span>
              )}
            </div>

            {/* Capability list — topology style, not checkboxes */}
            <div className="space-y-1.5">
              {v1Selected.map((svc) => {
                const def = catalog.find((d) => d.id === svc.serviceId)
                if (!def) return null
                const risk = assessRisk(svc.serviceId)
                const deps = dependencyChain(svc.serviceId, catalog)
                  .map((did) => catalog.find((d) => d.id === did))
                  .filter(Boolean) as ServiceDef[]

                return (
                  <div
                    key={svc.serviceId}
                    className={`pl-4 pr-3 py-2.5 rounded-lg text-sm ${riskBadge(risk)}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[#0A0A0D] font-medium">{def.outcome}</span>
                      <span className="text-xs font-semibold text-[#002FA7] bg-[#E8F0FF] px-1.5 py-0.5 rounded shrink-0">
                        V1
                      </span>
                    </div>
                    {deps.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-1 text-xs text-[#9399A3]">
                        <span className="text-[10px]">depends on</span>
                        {deps.map((d) => (
                          <span key={d.id} className="px-1.5 py-0.5 bg-[#F7F8FA] rounded text-[#5A5F6B] font-medium">
                            {d.outcome}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Later items — collapsed by default feel */}
            {laterSelected.length > 0 && (
              <div className="mt-2 ml-4 pl-4 border-l-2 border-dashed border-[#D1D5DB] space-y-1">
                <p className="text-xs font-semibold text-[#9399A3] uppercase tracking-wide mb-1">Later</p>
                {laterSelected.slice(0, 3).map((svc) => {
                  const def = catalog.find((d) => d.id === svc.serviceId)
                  if (!def) return null
                  return (
                    <div key={svc.serviceId} className="text-sm text-[#9399A3] pl-2">
                      {def.outcome}
                    </div>
                  )
                })}
                {laterSelected.length > 3 && (
                  <p className="text-xs text-[#9399A3] pl-2">+{laterSelected.length - 3} more</p>
                )}
              </div>
            )}

            {/* Module insight */}
            <p className="mt-2 text-xs text-[#9399A3] italic">{mod.summary}</p>
          </motion.div>
        )
      })}
    </div>
  )
}
