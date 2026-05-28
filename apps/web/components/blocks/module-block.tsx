"use client"

import { motion } from "framer-motion"
import { MODULE_EMOJI, MODULE_LABEL } from "@ai-delivery/core"

interface ModuleBlockProps {
  moduleId: string
  index: number
  active?: boolean
}

export function ModuleBlock({ moduleId, index, active = true }: ModuleBlockProps) {
  const emoji = MODULE_EMOJI[moduleId] ?? "📦"
  const label = MODULE_LABEL[moduleId] ?? moduleId

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: active ? 1 : 0.3, y: 0, scale: active ? 1 : 0.96 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      whileHover={active ? { y: -4, scale: 1.03 } : {}}
      className={`
        relative flex flex-col items-center justify-center gap-1.5
        w-[100px] h-[100px] rounded-2xl
        bg-white/70 backdrop-blur-xl
        border border-white/50
        shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.02)]
        transition-shadow duration-300
        hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.03)]
        ${!active ? "filter blur-[2px]" : ""}
      `}
    >
      <span className="text-3xl leading-none select-none">{emoji}</span>
      <span className="text-xs font-medium text-foreground/70 select-none tracking-tight">
        {label}
      </span>
    </motion.div>
  )
}
