"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, ChevronDown } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface ClarifyPillProps {
  question: string
  category?: string
  index: number
  value: string
  onChange: (v: string) => void
}

export function ClarifyPill({ question, category, index, value, onChange }: ClarifyPillProps) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.1 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`
          w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl
          transition-all duration-200
          ${open
            ? "bg-white/80 shadow-sm border-white/60"
            : "bg-white/40 backdrop-blur-sm border-white/30 hover:bg-white/60"
          }
          border
        `}
      >
        <HelpCircle className="h-4 w-4 text-amber-400 shrink-0" />
        <span className="text-sm text-foreground/70 flex-1 line-clamp-1">{question}</span>
        {category && (
          <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wide shrink-0">
            {category}
          </span>
        )}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/40" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pt-1">
              <Textarea
                placeholder="Totally optional — skip if unsure"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="resize-none h-16 text-sm bg-white/40 border-white/30"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
