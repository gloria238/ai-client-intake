1. Think Before Coding
   Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

State your assumptions explicitly. If uncertain, ask.
If multiple interpretations exist, present them - don't pick silently.
If a simpler approach exists, say so. Push back when warranted.
If something is unclear, stop. Name what's confusing. Ask.

2. Simplicity First
   Minimum code that solves the problem. Nothing speculative.

No features beyond what was asked.
No abstractions for single-use code.
No "flexibility" or "configurability" that wasn't requested.
No error handling for impossible scenarios.
If you write 200 lines and it could be 50, rewrite it.
Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

3. Surgical Changes
   Touch only what you must. Clean up only your own mess.

When editing existing code:

Don't "improve" adjacent code, comments, or formatting.
Don't refactor things that aren't broken.
Match existing style, even if you'd do it differently.
If you notice unrelated dead code, mention it - don't delete it.
When your changes create orphans:

Remove imports/variables/functions that YOUR changes made unused.
Don't remove pre-existing dead code unless asked.
The test: Every changed line should trace directly to the user's request.

4. Goal-Driven Execution
   Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

"Add validation" → "Write tests for invalid inputs, then make them pass"
"Fix the bug" → "Write a test that reproduces it, then make it pass"
"Refactor X" → "Ensure tests pass before and after"
For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
   Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.


This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


# Blueprint — Requirement Protocol Layer

> AI-native product architecture advisor. 4-stage progressive architecture experience.
> Translates business anxiety into executable capability units.

## Setup

```bash
pnpm install
pnpm dev        # starts apps/web on :3000
```

## Environment

Copy `apps/web/.env.local.example` → `apps/web/.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `DEEPSEEK_API_KEY` — DeepSeek API key

## Tech Stack

- **Frontend**: Next.js 16 App Router, TypeScript, Tailwind v4, shadcn/ui, Framer Motion, Inter font
- **Backend**: Supabase (Postgres + REST API), schema: `clientintake`
- **AI**: DeepSeek API (`deepseek-chat`), UI UX Pro Max skill (design system generation)
- **Monorepo**: pnpm workspaces + Turborepo
- **Design**: International Klein Blue (#002FA7) primary, bold minimal style

## Architecture: 5-Layer Stack

```
Layer 1 — Intent Profile       WHY (business anxiety vector)
Layer 2 — Capability Graph      WHAT (4 modules, 39 services, v1/later)
Layer 3 — Experience Profile    HOW (10 pressures, 16 contracts, constraints)
Layer 4 — Landing Layer         BRIDGE (design tokens, component priorities, IA)
Layer 5 — Governed Generation   CODE (SKILL.md contract protocol)
```

## The 4-Stage Page Structure

```
Stage 1 — Problem Understanding
  Product direction · What makes this challenging · Primary pressures

Stage 2 — System Architecture
  Capability topology · Dependencies · Critical risks · Pressure warnings

Stage 3 — Product Structure
  Interface blueprint · Layout zones · Constraints · Experience direction

Stage 4 — Delivery Strategy
  Phased rollout (V1 core → Later expansion) · Warnings · Our take
```

## Key Files

| File | Purpose |
|---|---|
| `apps/web/app/page.tsx` | 4-stage progressive architecture page |
| `apps/web/app/api/intake/parse/route.ts` | POST — AI parsing + UI UX Pro Max skill integration |
| `apps/web/app/admin/page.tsx` | Admin pipeline dashboard |
| `apps/web/components/blocks/capability-topology.tsx` | Stage 2 — capability relationships + risk |
| `apps/web/components/blocks/interface-blueprint.tsx` | Stage 3 — layout zones, not fake screenshot |
| `apps/web/components/blocks/rollout-plan.tsx` | Stage 4 — phased delivery plan |
| `apps/web/components/blocks/experience-card.tsx` | Collapsible full experience intelligence |
| `apps/web/lib/design-skill.ts` | Server-side UI UX Pro Max skill integration |
| `packages/ai/src/openai-client.ts` | DeepSeek API client + normalizeIntakeResult() normalization layer |
| `packages/ai/src/prompts/intake.ts` | System prompt — full reasoning pipeline |
| `packages/schemas/src/intake.ts` | Zod schemas — IntakeResult, experience profile enums |
| `packages/core/src/index.ts` | SERVICE_CATALOG, PRIMITIVE_CONTRACTS, generators |
| `.claude/skills/interface-reasoning/SKILL.md` | UI governance skill — 10-step contract protocol |
| `.claude/skills/ui-ux-pro-max/` | Design system generation skill |

## Run Commands

```bash
pnpm install              # Install all dependencies
pnpm dev                  # Start dev server on :3000
pnpm build                # Production build
pnpm lint                 # Lint all packages
```

## Deployment

### Vercel
```bash
cd apps/web && npx vercel --prod
```
Env vars: `DEEPSEEK_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Supabase
Schema `clientintake` with `projects` + `clarifications` tables. RLS: anon + authenticated.

## Conventions

- Schema name: `clientintake` — always use `.schema("clientintake")`
- No `asChild` on shadcn Buttons — use styled `<Link>` (React 19 compat)
- Client-facing text: outcome language, no developer jargon
- Every service: `outcome` (client) + `capability` (system) + `implementation` (tech)
- Primitive contracts: `existence: "required"` means non-negotiable in code generation
- Design: Klein Blue (#002FA7), Inter font, bold minimal, clear hierarchy
- AI output normalization: `normalizeIntakeResult()` in `packages/ai/src/openai-client.ts` normalizes AI enum fields (spaces→hyphens, lowercase) before Zod validation. When adding new enum fields to the experience profile schema, add them to the normalizer too.

## Security

- `.gitignore` excludes all `*.env` files — never commit API keys
- `DEEPSEEK_API_KEY` server-side only (not NEXT_PUBLIC_)
- Supabase anon key public by design — RLS enforces access
- Zod validation on all API endpoints
- React auto-escaping (no dangerouslySetInnerHTML in source)
- Admin routes unprotected — HIGH priority to add auth
