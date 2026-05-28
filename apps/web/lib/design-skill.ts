/**
 * Server-side integration with UI UX Pro Max skill.
 * Calls the search.py script to get design system recommendations
 * based on the client's project description.
 */
import { spawnSync } from "child_process"
import path from "path"

const SKILL_DIR = path.resolve(process.cwd(), "../../.claude/skills/ui-ux-pro-max")

export interface SkillDesignSystem {
  pattern: string
  style: string
  primaryColor: string
  secondaryColor: string
  ctaColor: string
  backgroundColor: string
  textColor: string
  headingFont: string
  bodyFont: string
  typographyMood: string
  keyEffects: string
  antiPatterns: string[]
}

function parseMarkdownTable(md: string): Record<string, string> {
  const result: Record<string, string> = {}
  const rows = md.match(/\| ([^*|]+) \| ([^*|]+) \|/g)
  if (rows) {
    for (const row of rows) {
      const cells = row.split("|").map((c) => c.trim()).filter(Boolean)
      if (cells.length >= 2 && !cells[0].includes("---") && cells[0] !== "Role") {
        const key = cells[0].toLowerCase().replace(/[^a-z]/g, "")
        result[key] = cells[1]
      }
    }
  }
  return result
}

function safeArg(value: string): string {
  return value.replace(/[^a-zA-Z0-9 .,;:!?()\-_/@+]/g, "").trim()
}

export function getDesignSystem(query: string, projectName?: string): SkillDesignSystem | null {
  try {
    const searchQuery = safeArg(query.slice(0, 80))
    const project = safeArg((projectName || query.slice(0, 40)))

    if (!searchQuery || !project) return null

    const args = [
      path.join(SKILL_DIR, "scripts", "search.py"),
      searchQuery,
      "--design-system",
      "-f", "markdown",
      "-p", project,
    ]

    const result = spawnSync("python", args, {
      encoding: "utf8",
      timeout: 15000,
      windowsHide: true,
    })

    const output = result.stdout || ""

    const patternMatch = output.match(/\*\*Name:\*\*\s*(.+)/)
    const styleMatch = output.match(/### Style[\s\S]*?\*\*Name:\*\*\s*(.+)/)
    const headingMatch = output.match(/\*\*Heading:\*\*\s*(.+)/)
    const bodyMatch = output.match(/\*\*Body:\*\*\s*(.+)/)
    const moodMatch = output.match(/\*\*Mood:\*\*\s*(.+)/)
    const effectsMatch = output.match(/### Key Effects\s*\n(.+)/)
    const avoidMatch = output.match(/### Avoid[^(]*\s*\n- (.+)/)

    const colorTable = parseMarkdownTable(output)

    return {
      pattern: patternMatch?.[1] ?? "Minimal Single Column",
      style: styleMatch?.[1] ?? "Flat Design",
      primaryColor: colorTable.primary ?? "#1A1A1A",
      secondaryColor: colorTable.secondary ?? "#4A423D",
      ctaColor: colorTable.cta ?? "#B8975A",
      backgroundColor: colorTable.background ?? "#FAF9F6",
      textColor: colorTable.text ?? "#1A1A1A",
      headingFont: headingMatch?.[1] ?? "Bodoni Moda",
      bodyFont: bodyMatch?.[1] ?? "Jost",
      typographyMood: moodMatch?.[1] ?? "professional, refined",
      keyEffects: effectsMatch?.[1]?.trim() ?? "Smooth transitions, 200ms ease",
      antiPatterns: avoidMatch
        ? [avoidMatch[1].trim()]
        : ["No neon gradients", "No excessive animation"],
    }
  } catch (err) {
    console.warn("UI UX Pro Max skill unavailable:", (err as Error).message)
    return null
  }
}

/**
 * Enrich the AI prompt with design system context.
 * Called before the AI parse call to inject style intelligence.
 */
export function buildDesignContext(query: string): string {
  const ds = getDesignSystem(query)
  if (!ds) return ""

  return `
[DESIGN SYSTEM REFERENCE — use this to inform your experienceProfile outputs]
Pattern: ${ds.pattern}
Style: ${ds.style}
Color palette: primary=${ds.primaryColor}, secondary=${ds.secondaryColor}, accent=${ds.ctaColor}, bg=${ds.backgroundColor}, text=${ds.textColor}
Typography: ${ds.headingFont} (headings) + ${ds.bodyFont} (body) — ${ds.typographyMood}
Effects: ${ds.keyEffects}
Anti-patterns to avoid: ${ds.antiPatterns.join(", ")}
[/DESIGN SYSTEM REFERENCE]
`.trim()
}
