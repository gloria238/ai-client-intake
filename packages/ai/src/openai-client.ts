import OpenAI from "openai"
import type { IntakeResult } from "@ai-delivery/schemas"
import { intakeResultSchema } from "@ai-delivery/schemas"

let _openai: OpenAI | null = null

function getClient(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com",
    })
  }
  return _openai
}

const MODEL = process.env.AI_MODEL ?? "deepseek-chat"

export async function parseIntake(rawInput: string): Promise<IntakeResult> {
  const { INTAKE_SYSTEM_PROMPT, INTAKE_USER_PROMPT } = await import("./prompts/intake")

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: INTAKE_SYSTEM_PROMPT },
      { role: "user", content: INTAKE_USER_PROMPT(rawInput) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 4000,
  })

  const raw = response.choices[0]?.message?.content
  if (!raw) throw new Error("No response from AI")

  const parsed = JSON.parse(raw)
  const normalized = normalizeIntakeResult(parsed)
  const validated = intakeResultSchema.parse(normalized)
  return validated
}

function normalizeIntakeResult(obj: unknown): unknown {
  if (!obj || typeof obj !== "object") return obj
  if (Array.isArray(obj)) return obj.map(normalizeIntakeResult)

  const record = obj as Record<string, unknown>
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(record)) {
    if (key === "interactionModel" && typeof value === "string") {
      result[key] = value.replace(/\s+/g, "-").toLowerCase()
    } else if (key === "navigationStyle" && typeof value === "string") {
      result[key] = value.replace(/\s+/g, "-").toLowerCase()
    } else {
      result[key] = normalizeIntakeResult(value)
    }
  }

  return result
}

export async function parseIntakeWithDesign(
  rawInput: string,
  designContext: string,
): Promise<IntakeResult> {
  const { INTAKE_SYSTEM_PROMPT, INTAKE_USER_PROMPT } = await import("./prompts/intake")

  const systemPrompt = designContext
    ? INTAKE_SYSTEM_PROMPT + "\n\n" + designContext
    : INTAKE_SYSTEM_PROMPT

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: INTAKE_USER_PROMPT(rawInput) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 4000,
  })

  const raw = response.choices[0]?.message?.content
  if (!raw) throw new Error("No response from AI")

  const parsed = JSON.parse(raw)
  const normalized = normalizeIntakeResult(parsed)
  const validated = intakeResultSchema.parse(normalized)
  return validated
}
