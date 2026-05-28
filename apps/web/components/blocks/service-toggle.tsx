"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface ServiceToggleProps {
  outcome: string
  capability: string
  implementation: string
  selected: boolean
  phase: "v1" | "later"
  index: number
  onToggle: () => void
}

export function ServiceToggle({ outcome, capability, implementation, selected, phase, index, onToggle }: ServiceToggleProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: index * 0.02 }}
    >
      <div
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150 select-none ${
          selected ? "bg-[#E8F0FF]" : "hover:bg-[#F7F8FA]"
        }`}
        onClick={onToggle}
      >
        {/* Toggle */}
        <button type="button" role="switch" aria-checked={selected}
          className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${
            selected ? "bg-[#002FA7]" : "bg-[#D1D5DB]"
          }`}
        >
          <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm ${selected ? "ml-[18px]" : "ml-[2px]"}`}
          />
        </button>

        {/* Outcome */}
        <span className={`text-base flex-1 leading-snug ${selected ? "text-[#0A0A0D] font-semibold" : "text-[#5A5F6B]"}`}>
          {outcome}
        </span>

        {/* Phase badge */}
        <span className={`text-xs font-bold px-2 py-0.5 rounded-md shrink-0 ${
          phase === "v1" ? "bg-[#002FA7] text-white" : "bg-[#D1D5DB] text-[#5A5F6B]"
        }`}>
          {phase === "v1" ? "V1" : "LATER"}
        </span>

        {/* Expand */}
        <button type="button" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
          className="shrink-0 text-[#9399A3] hover:text-[#002FA7] transition-colors"
        >
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="block">
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </button>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
            <div className="ml-[44px] pb-2 pt-1 space-y-0.5">
              <p className="text-sm text-[#5A5F6B]"><span className="text-[#9399A3]">Capability: </span>{capability}</p>
              <p className="text-sm text-[#9399A3]"><span className="text-[#9399A3]">Stack: </span>{implementation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
