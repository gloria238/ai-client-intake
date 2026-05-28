# Blueprint — Architecture Document

> AI-native product architecture advisor. 4-stage progressive architecture experience.
> 39 services across 4 modules. 5-layer intelligence stack. Klein Blue design system.

---

## 1. System Overview

### Product Identity

**What we are**: A requirement compression protocol. Clients paste unstructured project descriptions. The AI outputs a 4-stage architecture analysis: Problem Understanding → System Architecture → Product Structure → Delivery Strategy.

**What we are NOT**: AI form builder, no-code platform, project management tool, website generator.

### Page Architecture (4 Stages)

```
Stage 1 — Problem Understanding
  Product direction · What makes this challenging · Primary pressures

Stage 2 — System Architecture
  Capability topology with dependencies and risk levels · Pressure warnings

Stage 3 — Product Structure
  Interface blueprint (layout zones, not fake screenshot) · Constraints · Experience direction

Stage 4 — Delivery Strategy
  Phased rollout (V1 core → Later expansion) · Warnings · AI recommendation
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind v4, shadcn/ui, Framer Motion, Inter font |
| AI | DeepSeek API (`deepseek-chat`), UI UX Pro Max skill |
| Database | Supabase PostgreSQL, schema `clientintake` |
| Monorepo | pnpm workspaces, Turborepo |
| Design | Klein Blue (#002FA7), bold minimal, clear hierarchy |

---

## 2. Intelligence Stack

```
Layer 1 — Intent Profile       WHY they're building
          5-axis: speed, automation, security, scalability, collaboration

Layer 2 — Capability Graph      WHAT the system needs
          4 modules, 39 services, v1/later phasing
          Affinity graph: requires, recommends, scalingSensitive, futureSensitive
          Complexity pressure detection

Layer 3 — Experience Profile    HOW it should feel
          10 formal pressures, interface constraints
          16 primitive contracts (placement, visibility, interaction, a11y, failure)
          5 contract arbitration rules, 5 state transition contracts

Layer 4 — Landing Layer         BRIDGE to code
          Design tokens (radius, spacing, shadow, motion, density, font scale)
          Component priority graph, page hierarchy / IA

Layer 5 — Governed Generation   CODE
          SKILL.md contract protocol, anti-pattern enforcement
```

---

## 3. The 4 Capability Modules (39 services)

### Frontend Experience 🎨 (10)
| Service | Outcome |
|---|---|
| landing-page | A professional landing page that converts |
| dashboard | See key metrics at a glance — no digging required |
| admin-console | Admins can manage content and users themselves |
| responsive | Works on mobile, tablet, and desktop |
| branding | Your brand colors and visual style stay consistent |
| interactions | Smooth, polished interactions that feel premium |
| i18n | Support for multiple languages |
| realtime-ui | Changes appear on screen without manual refresh |
| user-auth | Users can sign up, log in, and securely access their data |
| ui-design | Professional UI/UX design service |

### Data & Storage 🗄️ (9)
| Service | Outcome |
|---|---|
| relational-db | Customer data, orders, and records stored safely |
| cache-layer | System stays fast under heavy traffic — no crashes |
| file-storage | Files, images, and documents uploaded and accessed securely |
| realtime-sync | Multiple people work simultaneously — data stays in sync |
| search | Users can instantly search and find anything |
| payment | Users can pay online and subscribe to plans |
| data-io | Import and export data in bulk |
| backups | Data backs up automatically — never lose anything |
| flexible-schema | Data structure adapts as your business evolves |

### AI Intelligence 🧠 (9)
| Service | Outcome |
|---|---|
| ai-agent | AI works like an employee — completing tasks autonomously |
| ai-knowledge | AI remembers your business knowledge and answers accurately |
| ai-chatbot | AI auto-replies to customer questions and messages |
| doc-processing | AI processes documents, PDFs, and spreadsheets automatically |
| smart-classify | AI automatically filters, classifies, and prioritizes |
| message-auto | Auto follow-ups: email, messages, and reminders |
| workflow-auto | Business processes run automatically — no manual step-by-step |
| ai-persona | AI speaks in your brand voice and tone |
| ai-orchestra | Complex tasks auto-coordinated across multiple AIs |

### Launch & Operations 🚀 (11)
| Service | Outcome |
|---|---|
| auto-deploy | Deploy automatically — never worry about servers |
| domain-ssl | Users access your site securely via your domain |
| monitoring | System health visible in real-time |
| error-tracking | Instant alerts when something goes wrong |
| role-access | Different roles see different content — clear permissions |
| auto-scaling | Handles sudden traffic spikes without breaking |
| maintenance | Ongoing maintenance and updates — someone has your back |
| email-infra | System sends verification emails, notifications, and receipts |
| notification-system | Users get important alerts via email, in-app, and push |
| audit-trail | Every important action is logged — who did what and when |
| api-layer | Connects and integrates with other systems |

---

## 4. Experience Intelligence

### 10 Formal Pressures
attention_fragmentation · state_ambiguity · trust_uncertainty · workflow_opacity · control_instability · navigation_entropy · decision_fatigue · notification_anxiety · sync_disorientation · permission_friction

### 16 Primitive Contracts
10 required: sync-status-indicator, ai-provenance-panel, ai-content-label, activity-timeline, inline-capability-indicator, confirmation-gate, automation-marker, orchestration-status, live-region-container, session-presence
6 recommended: alert-hierarchy, optimistic-state-handler, audit-log-viewer, health-status-bar, command-palette, capacity-indicator

### 5 State Transition Contracts
reconnecting · degraded · ai-processing · human-override · permission-denied

### 5 Contract Arbitration Rules
Live regions vs Alerts · AI provenance vs Cognitive load · Audit timeline vs Mobile space · Live region limit vs Dashboard density · Permission indicators vs Cleanliness

---

## 5. Frontend Components

```
components/blocks/
  capability-topology.tsx   Stage 2 — capability relationships + risk levels
  interface-blueprint.tsx   Stage 3 — layout zone diagram, not fake screenshot
  rollout-plan.tsx          Stage 4 — phased delivery plan
  experience-card.tsx       Collapsible full experience intelligence
  service-toggle.tsx        Outcome toggle with 3-layer expand
  module-card.tsx           Legacy module card (backward compat)
  ui-preview.tsx            Legacy UI preview (replaced by interface-blueprint)
```

---

## 6. AI Pipeline

```
Client raw text → POST /api/intake/parse
  → lib/design-skill.ts (UI UX Pro Max → designContext)
  → packages/ai/src/openai-client.ts
    → DeepSeek API (deepseek-chat, json_object mode)
    → normalizeIntakeResult() — spaces→hyphens, lowercase for enum fields
    → Zod validation (intakeResultSchema)
    → IntakeResult returned
```

### Normalization layer

`normalizeIntakeResult()` in `packages/ai/src/openai-client.ts` normalizes AI output before Zod validation. It recursively walks the parsed JSON and, for known enum fields (`interactionModel`, `navigationStyle`), replaces spaces with hyphens and lowercases. This prevents validation failures when the AI returns semantically correct but syntactically mismatched values (e.g. `"direct manipulation"` → `"direct-manipulation"`).

### Experience profile enums

| Field | Valid values |
|---|---|
| `interactionModel` | `guided-workflow`, `exploratory`, `task-focused`, `immersive`, `direct-manipulation` |
| `navigationStyle` | `sidebar+workspace`, `top-nav`, `dashboard-grid`, `wizard-steps`, `split-pane`, `single-panel` |
| `motionStrategy` | `subtle-functional`, `playful-engaging`, `minimal-none`, `content-driven` |
| `informationDensity` | `low`, `medium`, `high` |

---

## 7. API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/intake/parse` | POST | Parse raw text → full IntakeResult (all layers) |
| `/api/intake/[id]/export` | GET | Export project data |
| `/admin` | GET | Admin pipeline dashboard |
| `/admin/projects/[id]` | GET | Project detail |

---

## 8. Skills

### UI UX Pro Max (`.claude/skills/ui-ux-pro-max/`)
Design system generation. Called server-side via `lib/design-skill.ts` → `scripts/search.py`. Injects style/palette/typography context into AI prompt.

### Interface Reasoning (`.claude/skills/interface-reasoning/`)
UI governance skill. 10-step contract protocol. Enforces primitive contracts, constraints, and anti-patterns during code generation.

---

## 9. Deployment

### Vercel
```bash
cd apps/web && npx vercel --prod
```
Env: `DEEPSEEK_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Supabase
Schema `clientintake`. Tables: `projects` (jsonb parsed_output), `clarifications` (legacy). RLS: anon + authenticated.

---

## 10. Security Posture

### Implemented
| Threat | Mitigation |
|---|---|
| AI prompt injection | User text in user message only, not system prompt position |
| SQL injection | Prisma parameterized queries |
| XSS | React auto-escaping, no dangerouslySetInnerHTML |
| Input validation | Zod on all API endpoints |
| API key exposure | `DEEPSEEK_API_KEY` server-side only |
| Env file leak | `.gitignore` excludes all `*.env` files |

### To Address
| Item | Priority |
|---|---|
| Admin authentication | HIGH |
| CSP headers | Medium |
| Dependency scanning | Medium |
| Rate limiting | Low |
