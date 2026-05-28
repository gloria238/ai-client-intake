"use client"

import { motion } from "framer-motion"
import { Eye, Layout, Search, Bell, ChevronDown } from "lucide-react"
import type { ExperienceProfile } from "@ai-delivery/schemas"

interface UIPreviewProps {
  profile: ExperienceProfile
  projectName?: string
}

export function UIPreview({ profile, projectName }: UIPreviewProps) {
  const tokens = profile.designTokens
  const pages = profile.pageHierarchy?.pages ?? []
  const layout = profile.pageHierarchy?.layout ?? "sidebar + workspace"
  const hasRightPanel = layout.includes("split-pane") || layout.includes("right")
  const hasSidebar = layout.includes("sidebar")

  const primaryPages = pages.filter((p) => p.priority === "primary")
  const secondaryPages = pages.filter((p) => p.priority === "secondary")
  const navPages = [...primaryPages, ...secondaryPages].slice(0, 5)

  const isDense = tokens.density === "compact"
  const isSpacious = tokens.density === "spacious"

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="border border-[#D1D5DB] bg-white overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-3 border-b border-[#D1D5DB]/50">
        <Eye className="h-4 w-4 text-[#002FA7] shrink-0" />
        <div className="flex-1">
          <span className="text-sm font-medium text-[#0A0A0D]  tracking-tight">
            Product Preview
          </span>
          <span className="text-xs text-[#5A5F6B] ml-3 font-normal">
            Generated from your capability map
          </span>
        </div>
        <span className="text-[10px] text-[#9399A3] tracking-wide">
          {tokens.motionDuration} · {tokens.density} · {tokens.fontScale}
        </span>
      </div>

      {/* Mini Browser Frame */}
      <div className="px-4 py-4 bg-[#E8F0FF]/50">
        <div
          className="mx-auto border border-[#D1D5DB] bg-white overflow-hidden"
          style={{
            maxWidth: "640px",
            borderRadius: tokens.radius === "12px" ? "6px" : tokens.radius === "8px" ? "4px" : "3px",
          }}
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 px-2.5 py-2 bg-[#F7F8FA] border-b border-[#D1D5DB]/50">
            <span className="w-2 h-2 rounded-full bg-[#D1D5DB]" />
            <span className="w-2 h-2 rounded-full bg-[#D1D5DB]" />
            <span className="w-2 h-2 rounded-full bg-[#D1D5DB]" />
            <span className="text-[9px] text-[#9399A3] ml-2 font-normal truncate">
              {projectName?.toLowerCase().replace(/\s+/g, "-") ?? "app"} — {profile.emotion}
            </span>
          </div>

          <div className="flex" style={{ minHeight: "200px" }}>
            {/* Sidebar */}
            {hasSidebar && (
              <div
                className="shrink-0 border-r border-[#D1D5DB]/50 bg-[#FFFFFF] flex flex-col"
                style={{ width: isDense ? "90px" : isSpacious ? "130px" : "110px" }}
              >
                {/* Logo area */}
                <div className="px-2.5 py-3 border-b border-[#D1D5DB]/30">
                  <div className="h-2.5 w-2.5 rounded-sm bg-[#0A0A0D]" />
                </div>
                {/* Nav items */}
                <div className="flex-1 px-1.5 py-2 space-y-0.5">
                  {navPages.slice(0, 5).map((p, i) => (
                    <div
                      key={p.path}
                      className={`text-[7px] px-2 py-1.5 ${
                        i === 0
                          ? "bg-[#0A0A0D] text-[#FFFFFF] font-medium"
                          : "text-[#5A5F6B] hover:bg-[#E8F0FF]"
                      }`}
                      style={{
                        borderRadius: tokens.radius === "12px" ? "3px" : tokens.radius === "8px" ? "2px" : "1px",
                      }}
                    >
                      {p.label.length > 10 ? p.label.slice(0, 10) : p.label}
                    </div>
                  ))}
                </div>
                {/* Bottom user area */}
                <div className="px-2.5 py-2 border-t border-[#D1D5DB]/30 flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#002FA7]" />
                  <div className="text-[6px] text-[#9399A3] leading-tight">
                    <div className="font-medium text-[#1A1D23]">Admin</div>
                    <div>owner</div>
                  </div>
                </div>
              </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Top bar */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-[#D1D5DB]/30">
                {profile.componentPriorities?.some((c) => c.component === "CommandPalette") && (
                  <div className="flex items-center gap-1.5 flex-1 max-w-[180px] bg-[#F7F8FA]/50 px-2 py-1 rounded-sm border border-[#D1D5DB]/30">
                    <Search className="h-2 w-2 text-[#9399A3]" />
                    <span className="text-[6px] text-[#9399A3] font-normal">Search anything...</span>
                    <span className="text-[5px] text-[#9399A3] ml-auto font-mono">⌘K</span>
                  </div>
                )}
                {profile.componentPriorities?.some((c) => c.component === "AlertTier") && (
                  <Bell className="h-2.5 w-2.5 text-[#9399A3]" />
                )}
                {profile.componentPriorities?.some((c) => c.component === "SyncStatusIndicator") && (
                  <div className="flex items-center gap-1 ml-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[6px] text-[#9399A3] font-normal">Live</span>
                  </div>
                )}
              </div>

              {/* Content area */}
              <div className="flex-1 p-3 space-y-2.5" style={{ minHeight: hasRightPanel ? "130px" : "160px" }}>
                {/* Page title */}
                <div>
                  <div className="h-1.5 w-24 bg-[#0A0A0D]/10 mb-1" style={{ borderRadius: "1px" }} />
                  <div className="h-1 w-16 bg-[#9399A3]/30" style={{ borderRadius: "1px" }} />
                </div>

                {/* Metric cards */}
                {pages.some((p) => p.label.toLowerCase().includes("dashboard")) && (
                  <div className={`grid gap-1.5 ${isDense ? "grid-cols-4" : "grid-cols-3"}`}>
                    {Array.from({ length: isDense ? 4 : 3 }).map((_, i) => (
                      <div key={i} className="bg-[#F7F8FA]/30 border border-[#D1D5DB]/30 px-2 py-2" style={{ borderRadius: "2px" }}>
                        <div className="text-[6px] text-[#9399A3] font-normal mb-1">
                          {["Active", "Pending", "Completed", "Total"][i]}
                        </div>
                        <div className="text-[11px] font-medium text-[#0A0A0D] ">
                          {[284, 16, 892, 1192][i]}
                        </div>
                        <div className="text-[6px] text-emerald-500 mt-0.5">
                          +{[12, 3, 8, 5][i]}%
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Activity timeline (if workflow) */}
                {profile.componentPriorities?.some((c) => c.component === "ActivityTimeline") && (
                  <div className="space-y-1.5">
                    <div className="text-[7px] font-medium text-[#1A1D23] ">Recent Activity</div>
                    {[
                      "Order #4821 confirmed — 2m ago",
                      "AI agent: lead scored 87 — 5m ago",
                      "Workflow 'Onboarding' completed — 12m ago",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-[6px] text-[#5A5F6B] font-normal">
                        <span className="w-1 h-1 rounded-full bg-[#002FA7] shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                )}

                {/* AI provenance (if AI agent) */}
                {profile.componentPriorities?.some((c) => c.component === "AIProvenance") && (
                  <div className="border border-[#D1D5DB]/30 bg-[#F7F8FA]/30 px-2 py-1.5" style={{ borderRadius: "2px" }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[6px] font-medium text-[#0A0A0D]">AI Response</span>
                      <span className="text-[5px] text-emerald-500 font-medium">Confidence 94%</span>
                    </div>
                    <div className="text-[6px] text-[#1A1D23] font-normal leading-relaxed mb-1">
                      Based on the customer&apos;s purchase history and current query, I recommend offering the annual plan with a 15% discount...
                    </div>
                    <div className="flex items-center gap-2 text-[5px] text-[#9399A3]">
                      <span>Model: deepseek-chat</span>
                      <span>·</span>
                      <span>Source: order history + FAQ</span>
                      <span>·</span>
                      <span className="text-[#002FA7] cursor-pointer">Override</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right panel */}
            {hasRightPanel && (
              <div
                className="shrink-0 border-l border-[#D1D5DB]/50 bg-[#FFFFFF] flex flex-col"
                style={{ width: "130px" }}
              >
                <div className="px-2.5 py-2 border-b border-[#D1D5DB]/30 text-[7px] font-medium text-[#1A1D23] ">
                  Context
                </div>
                <div className="flex-1 px-2.5 py-2 space-y-2 text-[6px]">
                  {profile.componentPriorities?.some((c) => c.component === "AIProvenance") && (
                    <div>
                      <div className="text-[#9399A3] mb-0.5 font-normal">AI Insight</div>
                      <div className="text-[#1A1D23] font-normal leading-relaxed">
                        Customer likely to convert. 3 previous interactions, all positive sentiment.
                      </div>
                    </div>
                  )}
                  {profile.componentPriorities?.some((c) => c.component === "ActivityTimeline") && (
                    <div>
                      <div className="text-[#9399A3] mb-0.5 font-normal">Timeline</div>
                      <div className="space-y-1">
                        {["12:01 Order placed", "12:03 Payment OK", "12:05 AI replied"].map((t, i) => (
                          <div key={i} className="flex items-start gap-1 text-[#5A5F6B] font-normal">
                            <span className="w-1 h-1 rounded-full bg-[#002FA7] mt-0.5 shrink-0" />
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="px-6 py-2.5 border-t border-[#D1D5DB]/30 flex items-center justify-between text-[9px] text-[#9399A3] font-normal">
        <span>Layout: {profile.layoutArchetype || layout}</span>
        <div className="flex items-center gap-3">
          {profile.motionStrategy && <span>Motion: {profile.motionStrategy}</span>}
          {profile.interactionModel && <span>Interaction: {profile.interactionModel}</span>}
        </div>
      </div>
    </motion.div>
  )
}
