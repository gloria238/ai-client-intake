"use client"

import { motion } from "framer-motion"
import type { ServiceDef } from "@ai-delivery/core"
import type { ServiceSelection } from "@ai-delivery/schemas"
import { ServiceToggle } from "./service-toggle"

interface ModuleCardProps {
  moduleId: string
  meta: { title: string; emoji: string; subtitle: string }
  services: ServiceSelection[]
  catalog: ServiceDef[]
  summary: string
  index: number
  onToggleService: (serviceId: string) => void
}

export function ModuleCard({ meta, services, catalog, summary, index, onToggleService }: ModuleCardProps) {
  const selectedCount = services.filter((s) => s.selected).length
  const v1Count = services.filter((s) => s.selected && s.phase === "v1").length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      className="rounded-2xl border-2 border-[#D1D5DB] bg-white hover:border-[#002FA7]/20 transition-colors duration-200 overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <span className="text-2xl">{meta.emoji}</span>
        <div className="flex-1">
          <h3 className="text-lg font-extrabold text-[#0A0A0D] tracking-tight">{meta.title}</h3>
          <p className="text-sm text-[#9399A3]">{meta.subtitle}</p>
        </div>
        {selectedCount > 0 && (
          <span className="text-sm font-semibold text-[#002FA7] shrink-0">
            {selectedCount} · <span className="text-[#5A5F6B]">{v1Count} V1</span>
          </span>
        )}
      </div>

      {/* Toggles */}
      <div className="px-2 pb-2 space-y-px">
        {services.map((svc, i) => {
          const def = catalog.find((d) => d.id === svc.serviceId)
          if (!def) return null
          return (
            <ServiceToggle
              key={svc.serviceId}
              outcome={def.outcome}
              capability={def.capability}
              implementation={def.implementation}
              selected={svc.selected}
              phase={svc.phase}
              index={i}
              onToggle={() => onToggleService(svc.serviceId)}
            />
          )
        })}
      </div>

      {/* Summary */}
      <div className="px-5 py-3 border-t border-[#D1D5DB]/50 bg-[#F7F8FA]/50">
        <p className="text-sm text-[#5A5F6B] leading-relaxed italic">{summary}</p>
      </div>
    </motion.div>
  )
}
