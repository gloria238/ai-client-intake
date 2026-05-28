import { z } from "zod"
import { intakeResultSchema } from "./intake"

export const projectStatusEnum = z.enum([
  "pending",
  "parsed",
  "reviewed",
  "exported",
  "contacted",
])

export type ProjectStatus = z.infer<typeof projectStatusEnum>

export const projectSchema = z.object({
  id: z.string(),
  rawInput: z.string(),
  parsedOutput: intakeResultSchema.optional(),
  status: projectStatusEnum.default("pending"),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Project = z.infer<typeof projectSchema>
