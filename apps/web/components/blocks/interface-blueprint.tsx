"use client"

import { motion } from "framer-motion"
import { Layout, Eye, Shield, Clock } from "lucide-react"
import type { ExperienceProfile } from "@ai-delivery/schemas"

interface BlueprintProps {
  profile: ExperienceProfile
}

export function InterfaceBlueprint({ profile }: BlueprintProps) {
  const layout = profile.layoutArchetype || "sidebar + workspace"
  const pages = profile.pageHierarchy?.pages ?? []
  const hasAI = profile.componentPriorities?.some((c) => c.component === "AIProvenance")
  const hasRealtime = profile.componentPriorities?.some((c) => c.component === "SyncStatusIndicator")
  const hasTimeline = profile.componentPriorities?.some((c) => c.component === "ActivityTimeline")
  const constraints = profile.interfaceConstraints ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl border-2 border-[#002FA7]/10 bg-[#F7F8FA] overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#D1D5DB]/50 flex items-center gap-3">
        <Layout className="h-5 w-5 text-[#002FA7]" />
        <div>
          <h3 className="text-base font-bold text-[#0A0A0D]">Interface Blueprint</h3>
          <p className="text-sm text-[#5A5F6B]">Structure derived from your capability topology</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Layout diagram */}
        <div className="bg-white rounded-xl border border-[#D1D5DB]/50 p-4">
          {/* Top bar */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#D1D5DB]/30">
            <div className="flex items-center gap-1.5 flex-1">
              {pages.slice(0, 4).map((p, i) => (
                <span key={p.path} className={`text-xs font-medium px-2 py-0.5 rounded ${i === 0 ? "bg-[#002FA7] text-white" : "text-[#5A5F6B]"}`}>
                  {p.label}
                </span>
              ))}
            </div>
            {hasRealtime && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live
              </span>
            )}
          </div>

          {/* Main layout zones */}
          <div className="flex gap-2" style={{ minHeight: "120px" }}>
            {/* Sidebar */}
            <div className="w-[100px] shrink-0 bg-[#F7F8FA] rounded-lg border border-[#D1D5DB]/30 p-2 flex flex-col gap-1">
              <div className="h-3 w-3 bg-[#002FA7] rounded-sm mb-1" />
              {pages.slice(0, 4).map((p, i) => (
                <div key={p.path} className={`text-[10px] px-1.5 py-0.5 rounded ${i === 0 ? "bg-[#002FA7]/10 text-[#002FA7] font-semibold" : "text-[#9399A3]"}`}>
                  {p.label}
                </div>
              ))}
              <div className="mt-auto flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#002FA7]" />
                <div className="text-[9px] text-[#9399A3]">Admin</div>
              </div>
            </div>

            {/* Workspace */}
            <div className="flex-1 bg-white rounded-lg border border-[#D1D5DB]/30 p-2.5">
              <div className="text-[10px] font-semibold text-[#0A0A0D] mb-2">Workspace</div>
              <div className="space-y-1.5">
                {hasTimeline && (
                  <div className="bg-[#F7F8FA] rounded p-1.5 border border-[#D1D5DB]/20 text-[9px] text-[#5A5F6B] flex items-center gap-1.5">
                    <Clock className="h-2.5 w-2.5 text-[#9399A3]" />
                    Activity timeline — past · running · queued
                  </div>
                )}
                {hasAI && (
                  <div className="bg-[#E8F0FF] rounded p-1.5 border border-[#002FA7]/10 text-[9px] text-[#002FA7] flex items-center gap-1.5">
                    <Eye className="h-2.5 w-2.5" />
                    AI response · confidence 94% · source: knowledge base
                  </div>
                )}
                <div className="bg-[#F7F8FA] rounded p-1.5 border border-[#D1D5DB]/20 text-[9px] text-[#5A5F6B]">
                  Primary content area — adapts to active page
                </div>
              </div>
            </div>

            {/* Context Rail (if split-pane) */}
            {(layout.includes("split-pane") || layout.includes("right")) && (
              <div className="w-[110px] shrink-0 bg-[#F7F8FA] rounded-lg border border-[#D1D5DB]/30 p-2">
                <div className="text-[9px] font-semibold text-[#5A5F6B] mb-1.5">Context</div>
                <div className="space-y-1 text-[9px] text-[#9399A3]">
                  {hasAI && <div>AI insight panel</div>}
                  {hasRealtime && <div className="text-emerald-600">Sync status</div>}
                  <div>Quick actions</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Why this structure */}
        {profile.why && (
          <div className="flex items-start gap-3 px-1">
            <Shield className="h-4 w-4 text-[#002FA7] shrink-0 mt-0.5" />
            <p className="text-sm text-[#5A5F6B] leading-relaxed">{profile.why}</p>
          </div>
        )}

        {/* Constraints — show top 4 */}
        {constraints.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {constraints.slice(0, 4).map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-xs bg-white rounded-lg border border-[#D1D5DB]/30 px-3 py-2">
                <span className="text-[#002FA7] font-mono text-[10px] shrink-0 mt-0.5">0{i + 1}</span>
                <span className="text-[#5A5F6B]">{c}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
