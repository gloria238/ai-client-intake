import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { parseIntakeWithDesign } from "@ai-delivery/ai"
import { createProject, updateProjectParsed } from "@/lib/db"
import { buildDesignContext } from "@/lib/design-skill"
import { checkRateLimit } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    // Rate limit by IP
    const headersList = await headers()
    const forwardedFor = headersList.get("x-forwarded-for")
    const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown"

    const { allowed, remaining } = checkRateLimit(ip)
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        {
          status: 429,
          headers: { "Retry-After": "60" },
        },
      )
    }

    const { rawInput } = await request.json()

    if (!rawInput || rawInput.trim().length < 10) {
      return NextResponse.json(
        { error: "Please share a bit more detail about your project — even a few sentences helps." },
        { status: 400 },
      )
    }

    // Input size limit
    if (rawInput.length > 10000) {
      return NextResponse.json(
        { error: "Please keep your project description under 10,000 characters." },
        { status: 400 },
      )
    }

    // Create project record
    const projectId = await createProject(rawInput.trim())

    // Get design system from UI UX Pro Max skill
    const designContext = buildDesignContext(rawInput.trim())

    // AI parsing with design intelligence
    const result = await parseIntakeWithDesign(rawInput.trim(), designContext)

    // Save parsed output
    await updateProjectParsed(projectId, result)

    return NextResponse.json(
      { projectId, result },
      {
        headers: { "X-RateLimit-Remaining": String(remaining) },
      },
    )
  } catch (error) {
    console.error("Intake parse error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
