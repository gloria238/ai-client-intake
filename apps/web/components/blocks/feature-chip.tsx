"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

interface FeatureChipProps {
  label: string
  emoji?: string
  index: number
}

export function FeatureChip({ label, emoji, index }: FeatureChipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-sm"
    >
      <span className="text-base">{emoji ?? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}</span>
      <span className="text-foreground/70">{label}</span>
    </motion.div>
  )
}
