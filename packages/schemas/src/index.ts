export * from "./intake"
export * from "./project"

/* ── Backward-compat: old types mapped to new structure ── */

import { z } from "zod"

export const complexityEnum = z.enum(["simple", "medium", "complex"])
export type ComplexityLevel = z.infer<typeof complexityEnum>

export const parsedRequirementSchema = z.object({
  projectType: z.string(),
  coreFeatures: z.array(z.string()),
  targetUsers: z.array(z.string()),
  unclearAreas: z.array(z.string()),
  estimatedComplexity: complexityEnum,
  suggestedStack: z.array(z.string()).optional(),
  recommendedModules: z.array(z.string()),
  summary: z.string(),
  suggestedTimeline: z.string().optional(),
  riskAreas: z.array(z.string()).optional(),
})

export type ParsedRequirement = z.infer<typeof parsedRequirementSchema>

export const clarificationSchema = z.object({
  id: z.string().optional(),
  projectId: z.string().optional(),
  question: z.string(),
  answer: z.string().optional(),
  category: z.string().optional(),
  optional: z.boolean().default(true),
})

export type Clarification = z.infer<typeof clarificationSchema>
