"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Sparkles, AlertTriangle, Lightbulb, Layout, Ruler, Shield, ListTree, Gauge, Navigation } from "lucide-react"
import type { ExperienceProfile } from "@ai-delivery/schemas"

const interactionLabels: Record<string, string> = {
  "guided-workflow": "Step-by-step guidance",
  "exploratory": "Free exploration",
  "task-focused": "Efficiency-first",
  "immersive": "Full immersion",
}

const navigationLabels: Record<string, string> = {
  "sidebar+workspace": "Sidebar + Workspace",
  "top-nav": "Top Navigation",
  "dashboard-grid": "Dashboard Grid",
  "wizard-steps": "Wizard Steps",
  "split-pane": "Split Pane",
}

const motionLabels: Record<string, string> = {
  "subtle-functional": "Subtle & Functional",
  "playful-engaging": "Playful & Engaging",
  "minimal-none": "Minimal",
  "content-driven": "Content-Driven",
}

const densityLabels: Record<string, string> = {
  "low": "Spacious",
  "medium": "Balanced",
  "high": "Data-rich",
}

interface ExperienceCardProps {
  profile: ExperienceProfile
}

export function ExperienceCard({ profile }: ExperienceCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.35 }}
      className="border border-[#D1D5DB] bg-white"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-4 flex items-center gap-3 hover:bg-[#F7F8FA]/30 transition-colors"
      >
        <Sparkles className="h-4 w-4 text-[#002FA7] shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-[#0A0A0D]  tracking-tight">
            Product Experience Direction
          </span>
          <span className="text-xs text-[#5A5F6B] ml-3 font-normal">
            {profile.emotion}
          </span>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-[#9399A3]" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-5 border-t border-[#D1D5DB]/50 pt-5">
              {/* Core direction */}
              <div>
                <p className="text-[10px] font-medium text-[#002FA7] uppercase tracking-[0.15em] mb-2">Users should feel</p>
                <p className="text-sm text-[#0A0A0D] font-medium capitalize ">{profile.emotion}</p>
              </div>

              {/* Grid: Interaction + Density + Navigation + Motion */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Interaction", value: interactionLabels[profile.interactionModel] ?? profile.interactionModel },
                  { label: "Density", value: densityLabels[profile.informationDensity] ?? profile.informationDensity },
                  { label: "Navigation", value: navigationLabels[profile.navigationStyle] ?? profile.navigationStyle },
                  { label: "Motion", value: motionLabels[profile.motionStrategy] ?? profile.motionStrategy },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] text-[#9399A3] uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-xs text-[#1A1D23] font-normal">{value}</p>
                  </div>
                ))}
              </div>

              {/* Style + Palette + Type */}
              <div className="text-xs space-y-1 text-[#1A1D23] font-normal">
                <p><span className="text-[#9399A3]">Style:</span> {profile.style}</p>
                <p><span className="text-[#9399A3]">Palette:</span> {profile.palette}</p>
                <p><span className="text-[#9399A3]">Type:</span> {profile.typography}</p>
              </div>

              {/* Layout */}
              {profile.layoutArchetype && (
                <div className="border border-[#D1D5DB]/50 bg-[#F7F8FA]/30 px-4 py-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Layout className="h-3.5 w-3.5 text-[#002FA7]" />
                    <p className="text-[10px] font-medium text-[#5A5F6B] uppercase tracking-[0.1em]">Layout</p>
                  </div>
                  <p className="text-xs text-[#1A1D23] font-normal">{profile.layoutArchetype}</p>
                </div>
              )}

              {/* Why */}
              {profile.why && (
                <div className="border border-[#D1D5DB]/50 bg-[#F7F8FA]/30 px-4 py-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-[#002FA7]" />
                    <p className="text-[10px] font-medium text-[#5A5F6B] uppercase tracking-[0.1em]">Why this direction</p>
                  </div>
                  <p className="text-xs text-[#1A1D23] leading-relaxed font-normal">{profile.why}</p>
                </div>
              )}

              {/* Active Pressures */}
              {profile.activePressures && profile.activePressures.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {profile.activePressures.map((p) => (
                    <span key={p} className="text-[10px] font-medium tracking-wide px-2 py-0.5 bg-[#E8F0FF] text-[#5A5F6B]">
                      {p.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              )}

              {/* Interface Constraints */}
              {profile.interfaceConstraints && profile.interfaceConstraints.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium text-[#002FA7] uppercase tracking-[0.15em]">Interface Constraints</p>
                  {profile.interfaceConstraints.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <Shield className="h-3 w-3 text-[#002FA7] shrink-0 mt-0.5" />
                      <span className="text-[#1A1D23] font-normal">{c}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Decision Provenance */}
              {profile.decisionProvenance && profile.decisionProvenance.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium text-[#002FA7] uppercase tracking-[0.15em]">Decision Provenance</p>
                  {profile.decisionProvenance.map((dp, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="text-[#9399A3] mt-0.5">→</span>
                      <span className="text-[#1A1D23] font-normal">{dp}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* State Contracts */}
              {profile.stateContracts && profile.stateContracts.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium text-[#002FA7] uppercase tracking-[0.15em]">State Transition Contracts</p>
                  {profile.stateContracts.map((sc, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="text-[#002FA7] font-mono text-[10px] mt-0.5">↻</span>
                      <span className="text-[#1A1D23] font-normal">{sc}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Required Primitives */}
              {profile.requiredPrimitives && profile.requiredPrimitives.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium text-[#002FA7] uppercase tracking-[0.15em]">Required Primitives</p>
                  {profile.requiredPrimitives.map((p, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="text-[#002FA7] font-mono text-[10px] mt-0.5">◆</span>
                      <span className="text-[#1A1D23] font-normal">{p}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Design Tokens */}
              {profile.designTokens && (
                <div>
                  <p className="text-[10px] font-medium text-[#002FA7] uppercase tracking-[0.15em] mb-2">Design Tokens</p>
                  <div className="grid grid-cols-4 gap-1.5 text-[10px]">
                    {[
                      { label: "Radius", value: profile.designTokens.radius },
                      { label: "Motion", value: profile.designTokens.motionDuration },
                      { label: "Depth", value: `${profile.designTokens.surfaceHierarchy} levels` },
                      { label: "Density", value: profile.designTokens.density },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-[#F7F8FA]/50 px-2 py-1.5 text-center">
                        <p className="text-[#9399A3]">{label}</p>
                        <p className="font-medium text-[#1A1D23]">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-[10px] text-[#9399A3] font-normal">
                    <span>Shadow: {profile.designTokens.shadowStyle}</span>
                    <span>·</span>
                    <span>Chart: {profile.designTokens.chartStyle}</span>
                    <span>·</span>
                    <span>Font scale: {profile.designTokens.fontScale}</span>
                    <span>·</span>
                    <span>Spacing: [{profile.designTokens.spacingScale.join(", ")}]</span>
                  </div>
                </div>
              )}

              {/* Component Priorities */}
              {profile.componentPriorities && profile.componentPriorities.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-[#002FA7] uppercase tracking-[0.15em] mb-1.5">Component Priority</p>
                  {profile.componentPriorities.map((cp, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        cp.priority === "critical" ? "bg-[#0A0A0D]" :
                        cp.priority === "high" ? "bg-[#5A5F6B]" :
                        cp.priority === "medium" ? "bg-[#9399A3]" : "bg-[#D1D5DB]"
                      }`} />
                      <span className="font-medium text-[#1A1D23]">{cp.component}</span>
                      <span className="text-[#9399A3] truncate font-normal">{cp.reason}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Page Hierarchy */}
              {profile.pageHierarchy && profile.pageHierarchy.pages.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-[#002FA7] uppercase tracking-[0.15em] mb-2">Application Structure</p>
                  <p className="text-[10px] text-[#9399A3] mb-2 font-normal">{profile.pageHierarchy.layout}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.pageHierarchy.pages.map((p, i) => (
                      <span key={i} className={`text-[10px] px-2 py-0.5 tracking-wide ${
                        p.priority === "primary"
                          ? "bg-[#0A0A0D] text-[#FFFFFF] font-medium"
                          : "bg-[#E8F0FF] text-[#5A5F6B]"
                      }`}>
                        {p.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* UX Debt */}
              {profile.uxDebt && profile.uxDebt.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium text-[#002FA7] uppercase tracking-[0.15em]">Future UX Debt</p>
                  {profile.uxDebt.map((debt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <AlertTriangle className="h-3 w-3 text-[#5A5F6B] shrink-0 mt-0.5" />
                      <span className="text-[#1A1D23] font-normal">{debt}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* UX Risks + Recommendations */}
              {profile.uxRisks && profile.uxRisks.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-medium text-[#002FA7] uppercase tracking-[0.15em]">Risks & Mitigations</p>
                  {profile.uxRisks.map((risk, i) => (
                    <div key={i} className="border border-[#D1D5DB]/50 bg-[#F7F8FA]/30 px-4 py-2.5">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-[#002FA7] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-[#1A1D23] font-normal">{risk}</p>
                          {profile.uxRecommendations && profile.uxRecommendations[i] && (
                            <p className="text-[11px] text-[#5A5F6B] mt-1 flex items-start gap-1 font-normal">
                              <Lightbulb className="h-3 w-3 shrink-0 mt-0.5 text-[#002FA7]" />
                              {profile.uxRecommendations[i]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Anti-patterns */}
              {profile.antiPatterns && profile.antiPatterns.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium text-[#002FA7] uppercase tracking-[0.15em]">Avoid</p>
                  {profile.antiPatterns.map((ap, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <AlertTriangle className="h-3 w-3 text-[#002FA7] shrink-0 mt-0.5" />
                      <span className="text-[#1A1D23] font-normal">{ap}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
