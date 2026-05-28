import { z } from "zod"

/* ── Intent profile ── */

export const intentLevelEnum = z.enum(["low", "medium", "high"])

export const intentProfileSchema = z.object({
  speed: intentLevelEnum,
  automation: intentLevelEnum,
  scalability: intentLevelEnum,
  security: intentLevelEnum,
  collaboration: intentLevelEnum,
})

export type IntentProfile = z.infer<typeof intentProfileSchema>

/* ── Service selection ── */

export const phaseEnum = z.enum(["v1", "later"])

export const serviceSelectionSchema = z.object({
  serviceId: z.string(),
  selected: z.boolean(),
  phase: phaseEnum,
})

export type ServiceSelection = z.infer<typeof serviceSelectionSchema>

/* ── Module result ── */

export const moduleResultSchema = z.object({
  moduleId: z.enum(["frontend", "database", "ai-workflow", "deploy-ops"]),
  services: z.array(serviceSelectionSchema),
  summary: z.string(), // 1-line why-these-matter for this specific module
})

export type ModuleResult = z.infer<typeof moduleResultSchema>

/* ── Experience profile ── */

export const experiencePressureEnum = z.enum([
  "attention_fragmentation",
  "state_ambiguity",
  "trust_uncertainty",
  "workflow_opacity",
  "control_instability",
  "navigation_entropy",
  "decision_fatigue",
  "notification_anxiety",
  "sync_disorientation",
  "permission_friction",
])

export const experienceProfileSchema = z.object({
  emotion: z.string(),
  interactionModel: z.enum(["guided-workflow", "exploratory", "task-focused", "immersive", "direct-manipulation"]),
  informationDensity: z.enum(["low", "medium", "high"]),
  navigationStyle: z.enum(["sidebar+workspace", "top-nav", "dashboard-grid", "wizard-steps", "split-pane", "single-panel"]),
  motionStrategy: z.enum(["subtle-functional", "playful-engaging", "minimal-none", "content-driven"]),
  style: z.string(),
  palette: z.string(),
  typography: z.string(),
  layoutArchetype: z.string(),
  why: z.string(),
  activePressures: z.array(experiencePressureEnum),
  interfaceConstraints: z.array(z.string()),
  decisionProvenance: z.array(z.string()),
  requiredPrimitives: z.array(z.string()),
  stateContracts: z.array(z.string()),
  designTokens: z.object({
    radius: z.string(),
    spacingScale: z.array(z.number()),
    shadowStyle: z.enum(["soft-low", "soft-medium", "flat-none", "crisp-hard"]),
    surfaceHierarchy: z.number(),
    motionDuration: z.string(),
    chartStyle: z.enum(["muted-grid", "bold-contrast", "minimal-line", "glass-cards"]),
    density: z.enum(["compact", "comfortable", "spacious"]),
    fontScale: z.enum(["minor-second", "major-second", "perfect-fourth"]),
  }),
  componentPriorities: z.array(z.object({
    component: z.string(),
    priority: z.enum(["critical", "high", "medium", "low"]),
    reason: z.string(),
  })),
  pageHierarchy: z.object({
    pages: z.array(z.object({
      path: z.string(),
      label: z.string(),
      priority: z.enum(["primary", "secondary"]),
    })),
    layout: z.string(),
    globalFeatures: z.array(z.string()),
  }),
  antiPatterns: z.array(z.string()),
  uxRisks: z.array(z.string()),
  uxRecommendations: z.array(z.string()),
  uxDebt: z.array(z.string()),
})

export type ExperienceProfile = z.infer<typeof experienceProfileSchema>

/* ── Top-level intake result ── */

export const intakeResultSchema = z.object({
  projectSummary: z.string(),
  modules: z.array(moduleResultSchema),
  intentProfile: intentProfileSchema,
  experienceProfile: experienceProfileSchema.optional(),
  reviewNote: z.string(),
})

export type IntakeResult = z.infer<typeof intakeResultSchema>

/* ── API request ── */

export const intakeRequestSchema = z.object({
  rawInput: z
    .string()
    .min(10, "Please provide a bit more detail about your project.")
    .max(10000, "Please keep your project description under 10,000 characters."),
})

export type IntakeRequest = z.infer<typeof intakeRequestSchema>
