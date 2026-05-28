export const APP_NAME = "Blueprint"

/* ───────────────────────────────────────────────
   4-module service catalog — Industrial Grade
   ───────────────────────────────────────────────

   Every service is defined in 3 layers:
   Layer 1 — outcome:    Pure client language. What they get.
   Layer 2 — capability: System capability. Internal reasoning layer.
   Layer 3 — implementation: Technical stack. Expandable detail only.

   Affinity weights (soft, not a DAG):
   - requires:        Can't exist without (hard)
   - recommends:      Strongly benefits from (soft)
   - scalingSensitive: Combining these multiplies infra complexity
   - futureSensitive:  Likely needed later if this is selected
   ─────────────────────────────────────────────── */

export interface ServiceAffinity {
  requires?: string[]
  recommends?: string[]
  scalingSensitive?: string[]
  futureSensitive?: string[]
}

export interface ServiceDef {
  id: string
  moduleId: ModuleId
  outcome: string           // Layer 1: client language
  capability: string        // Layer 2: system capability (internal reasoning)
  implementation: string    // Layer 3: technical stack
  phase: "v1" | "later"
  affinity?: ServiceAffinity
}

export const MODULE_IDS = ["frontend", "database", "ai-workflow", "deploy-ops"] as const
export type ModuleId = (typeof MODULE_IDS)[number]

export const MODULE_META: Record<ModuleId, { title: string; emoji: string; subtitle: string }> = {
  frontend:    { title: "Frontend Experience", emoji: "🎨", subtitle: "What users see and touch" },
  database:    { title: "Data & Storage",      emoji: "🗄️", subtitle: "Where data lives, how it scales, whether it's safe" },
  "ai-workflow": { title: "AI Intelligence",    emoji: "🧠", subtitle: "AI doing work — your automated workforce" },
  "deploy-ops":   { title: "Launch & Operations", emoji: "🚀", subtitle: "How to ship and keep it running" },
}

/* ── SERVICE_CATALOG ── */

export const SERVICE_CATALOG: ServiceDef[] = [

  /* ═══════════════════════════════════════════
     Module 1: Frontend Experience
     ═══════════════════════════════════════════ */

  { id: "landing-page",  moduleId: "frontend", phase: "v1",
    outcome:        "A professional landing page that converts",
    capability:     "Landing page + marketing site",
    implementation: "Next.js, Tailwind, copywriting, SEO",
  },
  { id: "dashboard",     moduleId: "frontend", phase: "v1",
    outcome:        "See key metrics at a glance — no digging required",
    capability:     "Dashboard + data visualization",
    implementation: "Chart library, analytics cards, KPI widgets",
  },
  { id: "admin-console", moduleId: "frontend", phase: "v1",
    outcome:        "Admins can manage content and users themselves",
    capability:     "Admin console (CRUD, user management)",
    implementation: "Admin panel with role-based views, search, filters",
  },
  { id: "responsive",    moduleId: "frontend", phase: "v1",
    outcome:        "Works on mobile, tablet, and desktop",
    capability:     "Responsive / mobile-first design",
    implementation: "Tailwind responsive breakpoints, mobile nav",
  },
  { id: "branding",      moduleId: "frontend", phase: "later",
    outcome:        "Your brand colors and visual style stay consistent",
    capability:     "Design system + theming",
    implementation: "CSS custom properties, dark/light mode, brand tokens",
  },
  { id: "interactions",  moduleId: "frontend", phase: "later",
    outcome:        "Smooth, polished interactions that feel premium",
    capability:     "Animation + micro-interactions",
    implementation: "Framer Motion, CSS transitions, gesture feedback",
  },
  { id: "i18n",          moduleId: "frontend", phase: "later",
    outcome:        "Support for multiple languages",
    capability:     "Internationalization",
    implementation: "i18n library, translation pipeline, locale routing",
  },
  { id: "realtime-ui",   moduleId: "frontend", phase: "later",
    outcome:        "Changes appear on screen without manual refresh",
    capability:     "Live UI updates",
    implementation: "SSE / WebSocket subscription hooks",
    affinity: { recommends: ["realtime-sync"] },
  },
  { id: "user-auth",     moduleId: "frontend", phase: "v1",
    outcome:        "Users can sign up, log in, and securely access their data",
    capability:     "Authentication + session management",
    implementation: "JWT, OAuth, bcrypt, session cookies, email verification",
    affinity: { requires: ["relational-db"] },
  },
  { id: "ui-design",     moduleId: "frontend", phase: "v1",
    outcome:        "Professional UI/UX design service",
    capability:     "Design service",
    implementation: "Figma, user research, design system",
  },

  /* ═══════════════════════════════════════════
     Module 2: Database & Data
     ═══════════════════════════════════════════ */

  { id: "relational-db",  moduleId: "database", phase: "v1",
    outcome:        "Customer data, orders, and records stored safely",
    capability:     "Relational data persistence",
    implementation: "PostgreSQL, Prisma ORM, connection pooling",
  },
  { id: "cache-layer",    moduleId: "database", phase: "v1",
    outcome:        "System stays fast under heavy traffic — no crashes",
    capability:     "High-concurrency handling",
    implementation: "Redis (cache, rate limiting, job queues)",
  },
  { id: "file-storage",   moduleId: "database", phase: "v1",
    outcome:        "Files, images, and documents uploaded and accessed securely",
    capability:     "File / object storage",
    implementation: "S3/R2 compatible storage, signed URLs, CDN",
  },
  { id: "realtime-sync",  moduleId: "database", phase: "later",
    outcome:        "Multiple people work simultaneously — data stays in sync",
    capability:     "Real-time data synchronization",
    implementation: "Supabase Realtime, Pub/Sub, CRDT merge",
    affinity: { recommends: ["cache-layer"] },
  },
  { id: "search",         moduleId: "database", phase: "later",
    outcome:        "Users can instantly search and find anything",
    capability:     "Full-text search",
    implementation: "Meilisearch / Elasticsearch, indexing pipeline",
  },
  { id: "payment",        moduleId: "database", phase: "v1",
    outcome:        "Users can pay online and subscribe to plans",
    capability:     "Payment processing + billing",
    implementation: "Stripe, invoices, subscription management",
    affinity: { requires: ["user-auth", "relational-db"] },
  },
  { id: "data-io",        moduleId: "database", phase: "v1",
    outcome:        "Import and export data in bulk",
    capability:     "Data import / export pipelines",
    implementation: "CSV/JSON parsing, streaming export, validation",
  },
  { id: "backups",        moduleId: "database", phase: "v1",
    outcome:        "Data backs up automatically — never lose anything",
    capability:     "Automated backup + recovery",
    implementation: "Scheduled pg_dump, point-in-time recovery, off-site storage",
  },
  { id: "flexible-schema", moduleId: "database", phase: "v1",
    outcome:        "Data structure adapts as your business evolves",
    capability:     "Flexible data model + migrations",
    implementation: "Prisma migrations, extensible JSON fields, versioned schema",
  },

  /* ═══════════════════════════════════════════
     Module 3: AI Intelligence
     ═══════════════════════════════════════════ */

  { id: "ai-agent",       moduleId: "ai-workflow", phase: "v1",
    outcome:        "AI works like an employee — completing tasks autonomously",
    capability:     "Autonomous AI agent",
    implementation: "Agent config (personality, goals, tools, memory)",
    affinity: { recommends: ["ai-knowledge", "workflow-auto"] },
  },
  { id: "ai-knowledge",   moduleId: "ai-workflow", phase: "v1",
    outcome:        "AI remembers your business knowledge and answers accurately",
    capability:     "Knowledge-grounded AI (RAG)",
    implementation: "Vector embeddings, semantic retrieval, chunking strategy",
    affinity: { recommends: ["file-storage", "doc-processing"] },
  },
  { id: "ai-chatbot",     moduleId: "ai-workflow", phase: "v1",
    outcome:        "AI auto-replies to customer questions and messages",
    capability:     "Customer-facing AI chatbot",
    implementation: "Conversational AI, streaming responses, chat history",
    affinity: { recommends: ["ai-knowledge", "ai-persona"] },
  },
  { id: "doc-processing", moduleId: "ai-workflow", phase: "later",
    outcome:        "AI processes documents, PDFs, and spreadsheets automatically",
    capability:     "Document intelligence",
    implementation: "OCR, PDF parsing, table extraction, structured output",
  },
  { id: "smart-classify", moduleId: "ai-workflow", phase: "later",
    outcome:        "AI automatically filters, classifies, and prioritizes",
    capability:     "AI classification + scoring",
    implementation: "Intent detection, lead scoring, sentiment analysis",
    affinity: { recommends: ["ai-knowledge"] },
  },
  { id: "message-auto",   moduleId: "ai-workflow", phase: "later",
    outcome:        "Auto follow-ups: email, messages, and reminders",
    capability:     "Automated messaging + follow-up",
    implementation: "Email sequences, template engine, scheduling, tracking",
    affinity: { requires: ["email-infra"] },
  },
  { id: "workflow-auto",  moduleId: "ai-workflow", phase: "later",
    outcome:        "Business processes run automatically — no manual step-by-step",
    capability:     "Workflow automation",
    implementation: "DAG engine, triggers, conditions, delays, retry logic",
    affinity: { recommends: ["cache-layer"] },
  },
  { id: "ai-persona",     moduleId: "ai-workflow", phase: "v1",
    outcome:        "AI speaks in your brand voice and tone",
    capability:     "AI persona + tone alignment",
    implementation: "System prompt engineering, few-shot examples, tone calibration",
  },
  { id: "ai-orchestra",   moduleId: "ai-workflow", phase: "later",
    outcome:        "Complex tasks auto-coordinated across multiple AIs",
    capability:     "Multi-model orchestration",
    implementation: "Model routing, fallback chains, ensemble, cost optimization",
    affinity: {
      recommends: ["workflow-auto"],
      scalingSensitive: ["ai-agent", "ai-chatbot"],
    },
  },

  /* ═══════════════════════════════════════════
     Module 4: Launch & Operations
     ═══════════════════════════════════════════ */

  { id: "auto-deploy",    moduleId: "deploy-ops", phase: "v1",
    outcome:        "Deploy automatically — never worry about servers",
    capability:     "Automated deployment pipeline",
    implementation: "CI/CD (GitHub Actions), Vercel / Railway, Docker",
  },
  { id: "domain-ssl",     moduleId: "deploy-ops", phase: "v1",
    outcome:        "Users access your site securely via your domain",
    capability:     "Domain + HTTPS setup",
    implementation: "DNS configuration, SSL/TLS certificates, auto-renewal",
  },
  { id: "monitoring",     moduleId: "deploy-ops", phase: "v1",
    outcome:        "System health visible in real-time",
    capability:     "System monitoring + health checks",
    implementation: "Uptime dashboard, metrics collection, status page",
    affinity: { recommends: ["error-tracking"] },
  },
  { id: "error-tracking", moduleId: "deploy-ops", phase: "v1",
    outcome:        "Instant alerts when something goes wrong",
    capability:     "Error tracking + alerting",
    implementation: "Sentry, log aggregation, alert routing (email/Slack/SMS)",
  },
  { id: "role-access",    moduleId: "deploy-ops", phase: "v1",
    outcome:        "Different roles see different content — clear permissions",
    capability:     "Role-based access control",
    implementation: "RBAC (owner/admin/operator/viewer), permission matrix",
    affinity: { requires: ["user-auth"] },
  },
  { id: "auto-scaling",   moduleId: "deploy-ops", phase: "later",
    outcome:        "Handles sudden traffic spikes without breaking",
    capability:     "Auto-scaling + elastic infrastructure",
    implementation: "Horizontal scaling, load balancing, CDN, edge caching",
    affinity: {
      recommends: ["monitoring", "cache-layer"],
      scalingSensitive: ["realtime-sync", "cache-layer"],
    },
  },
  { id: "maintenance",    moduleId: "deploy-ops", phase: "later",
    outcome:        "Ongoing maintenance and updates — someone has your back",
    capability:     "Ongoing maintenance + support",
    implementation: "Monthly check-ins, dependency updates, security patches",
  },
  { id: "email-infra",    moduleId: "deploy-ops", phase: "v1",
    outcome:        "System sends verification emails, notifications, and receipts",
    capability:     "Transactional email delivery",
    implementation: "Resend / SES, email templates, delivery tracking",
  },
  { id: "notification-system", moduleId: "deploy-ops", phase: "later",
    outcome:        "Users get important alerts via email, in-app, and push",
    capability:     "Multi-channel notifications",
    implementation: "Push notifications, in-app notifications, email digests",
    affinity: { recommends: ["email-infra"] },
  },
  { id: "audit-trail",    moduleId: "deploy-ops", phase: "later",
    outcome:        "Every important action is logged — who did what and when",
    capability:     "Audit trail + compliance logging",
    implementation: "Immutable audit logs, retention policy, export",
    affinity: { requires: ["relational-db"] },
  },
  { id: "api-layer",      moduleId: "deploy-ops", phase: "v1",
    outcome:        "Connects and integrates with other systems",
    capability:     "API + webhook system",
    implementation: "REST API design, webhook triggers, API docs, rate limiting",
    affinity: { recommends: ["cache-layer", "role-access"] },
  },
]

/* ── Complexity pressure triggers ──

   Certain capability combinations create non-linear complexity.
   These are used by the AI prompt to detect when to warn the client.

   Pressure dimensions:
   - infra:     cache + realtime + scaling combined
   - ai:        agent + orchestra + workflow combined
   - pipeline:  storage + doc-processing + knowledge combined
   - security:  payment + auth + role-access combined
   ─────────────────────────────────────────────── */

export interface ComplexityPressure {
  dimension: "infra" | "ai" | "pipeline" | "security" | "maintenance"
  triggerIds: string[]
  pressure: "medium" | "high" | "critical"
  note: string // Client-facing warning
}

export const COMPLEXITY_PRESSURE_TRIGGERS: ComplexityPressure[] = [
  {
    dimension: "infra", pressure: "high",
    triggerIds: ["cache-layer", "realtime-sync", "auto-scaling"],
    note: "High-concurrency + real-time sync + auto-scaling together significantly increase infrastructure complexity. Phase your rollout: cache + monitoring first, add realtime and scaling after traffic is proven.",
  },
  {
    dimension: "ai", pressure: "high",
    triggerIds: ["ai-agent", "ai-orchestra", "workflow-auto"],
    note: "AI Agent + multi-model orchestration + workflow engine together make the AI layer very heavy. Start with one agent + basic workflow, then expand after proving value.",
  },
  {
    dimension: "pipeline", pressure: "medium",
    triggerIds: ["file-storage", "doc-processing", "ai-knowledge"],
    note: "The full document pipeline (upload → parse → vectorize → retrieve) has latency and accuracy loss at each stage. Validate with small batches before full investment.",
  },
  {
    dimension: "security", pressure: "medium",
    triggerIds: ["payment", "user-auth", "role-access"],
    note: "Payment + auth + role access combined is a security-sensitive zone. Requires extra attention to compliance, encryption, and audit logging.",
  },
  {
    dimension: "maintenance", pressure: "medium",
    triggerIds: ["ai-agent", "ai-orchestra", "auto-scaling", "realtime-sync"],
    note: "AI + realtime + auto-scaling combined have high long-term operational costs. Inference fees, concurrent connections, and elastic resources all scale linearly with users. Reserve ops budget.",
  },
]

/* ── Lookup helpers ── */

export function getServiceById(id: string): ServiceDef | undefined {
  return SERVICE_CATALOG.find((s) => s.id === id)
}

export function getServicesByModule(moduleId: ModuleId): ServiceDef[] {
  return SERVICE_CATALOG.filter((s) => s.moduleId === moduleId)
}

export function getAllServiceIds(): string[] {
  return SERVICE_CATALOG.map((s) => s.id)
}

export function checkComplexityPressure(selectedIds: string[]): ComplexityPressure[] {
  return COMPLEXITY_PRESSURE_TRIGGERS.filter((trigger) => {
    const matches = trigger.triggerIds.filter((id) => selectedIds.includes(id))
    // Pressure triggers when >= 2 of the trigger IDs are selected
    return matches.length >= 2
  })
}

/* ── Intent profile ── */

export interface IntentProfile {
  speed: "low" | "medium" | "high"
  automation: "low" | "medium" | "high"
  scalability: "low" | "medium" | "high"
  security: "low" | "medium" | "high"
  collaboration: "low" | "medium" | "high"
}

export const DEFAULT_INTENT_PROFILE: IntentProfile = {
  speed: "low",
  automation: "low",
  scalability: "low",
  security: "low",
  collaboration: "low",
}

/* ── Experience Pressure — formalized cognitive/systemic pressure types ──

   These emerge from capability topology. They are NOT visual preferences.
   They describe how the system's ARCHITECTURE creates human cognitive load.
   ─────────────────────────────────────────────── */

export type ExperiencePressure =
  | "attention_fragmentation"    // too many things competing for user attention
  | "state_ambiguity"            // user can't tell what state the system is in
  | "trust_uncertainty"          // user doubts whether system output is correct
  | "workflow_opacity"           // user can't see what automated processes are doing
  | "control_instability"        // user feels they might lose control of the system
  | "navigation_entropy"         // user gets lost in the information architecture
  | "decision_fatigue"           // too many choices, not enough guidance
  | "notification_anxiety"       // too many alerts, can't distinguish signal from noise
  | "sync_disorientation"        // realtime data creates temporal confusion
  | "permission_friction"        // access control creates workflow interruption

export const PRESSURE_LABELS: Record<ExperiencePressure, string> = {
  attention_fragmentation: "Attention fragmentation — too many things competing for focus",
  state_ambiguity: "State ambiguity — user can't tell what's happening right now",
  trust_uncertainty: "Trust uncertainty — user doubts whether output is correct",
  workflow_opacity: "Workflow opacity — automated processes are invisible",
  control_instability: "Control instability — user fears losing control",
  navigation_entropy: "Navigation entropy — user gets lost in the structure",
  decision_fatigue: "Decision fatigue — too many choices, not enough guidance",
  notification_anxiety: "Notification anxiety — can't distinguish signal from noise",
  sync_disorientation: "Sync disorientation — realtime creates temporal confusion",
  permission_friction: "Permission friction — access control interrupts workflow",
}

/* ── Interface Constraint — capability-driven interaction governance ── */

export interface InterfaceConstraint {
  /** What this constraint governs */
  domain: "layout" | "state" | "feedback" | "navigation" | "automation" | "trust" | "attention"
  /** The constraint rule */
  rule: string
  /** Which capability pressure creates this constraint */
  drivenBy: ExperiencePressure[]
  /** Why this constraint exists */
  because: string
}

/* ── Decision Provenance — causal chain from capability to interface ── */

export interface DecisionProvenance {
  /** The capability that demands this */
  capability: string
  /** What it requires from the interface */
  requires: string
  /** The interface consequence */
  therefore: string
}

/* ── Interface Primitive Contracts ──

   Machine-enforceable interface law. Not recommendations.
   These contracts govern what MUST exist on screen for the system
   to be operable. Claude Code reads these BEFORE generating UI.

   Contract dimensions:
   - existence:      Is this element required or recommended?
   - placement:      Where must it live? Does it survive navigation?
   - visibility:     When must it be visible? What can never hide it?
   - interaction:    What states must it show? What user actions?
   - accessibility:  Screen reader, keyboard, contrast requirements
   - failure:        What breaks if this contract is violated?
   ─────────────────────────────────────────────── */

export interface PrimitiveContract {
  /** The required interaction element */
  primitive: string
  /** Which capability demands this */
  capability: string
  /** Is this element required for the system to function? */
  existence: "required" | "recommended"
  /** Where this element lives and how it persists */
  placementRules: string[]
  /** When this element must be visible and what may never obscure it */
  visibilityRules: string[]
  /** What states it must show and what user interactions it supports */
  interactionRules: string[]
  /** Screen reader, keyboard, contrast requirements */
  accessibilityRules: string[]
  /** What breaks in production if this contract is violated */
  failureConsequences: string[]
}

export const PRIMITIVE_CONTRACTS: PrimitiveContract[] = [
  {
    primitive: "sync-status-indicator",
    capability: "realtime-sync",
    existence: "required",
    placementRules: [
      "Persistent across all route changes — never unmounts",
      "Fixed position: top-right corner or integrated into top bar",
      "Must exist on mobile at every breakpoint",
    ],
    visibilityRules: [
      "Never hidden behind modals, drawers, or overlays",
      "Must remain visible during loading states",
      "Shows even when connection is healthy (reassurance)",
    ],
    interactionRules: [
      "Displays last successful sync timestamp at all times",
      "Shows explicit 'Reconnecting...' state on connection loss",
      "Shows 'Degraded — delayed sync' when operating in degraded mode",
      "Click to reveal sync history (last 5 events)",
    ],
    accessibilityRules: [
      "Announces connection state changes to screen readers",
      "Status icon has text label (not icon-only)",
    ],
    failureConsequences: [
      "Users lose trust in data freshness — they will refresh 'just to be sure'",
      "Stale data decisions cascade: operators act on outdated information",
      "During incidents, lack of sync visibility doubles time-to-diagnosis",
    ],
  },
  {
    primitive: "ai-provenance-panel",
    capability: "ai-agent",
    existence: "required",
    placementRules: [
      "Inline with each AI-generated output — never in a separate 'AI settings' page",
      "Collapsible but present by default for every AI action",
      "Persists within the content flow, not as a floating overlay",
    ],
    visibilityRules: [
      "Visible for every AI-generated decision, reply, or action",
      "Never hidden behind 'Advanced' or 'Details' toggles by default",
      "Remains visible when the AI output is scrolled into view",
    ],
    interactionRules: [
      "Shows: confidence score, model used, trigger that invoked AI, fallback path",
      "Each data source used by AI is listed and clickable",
      "Human override button present at every provenance point",
      "'Report incorrect' affordance for every AI output",
    ],
    accessibilityRules: [
      "Confidence score conveyed both visually (color) and textually (percentage)",
      "Provenance chain navigable by keyboard",
    ],
    failureConsequences: [
      "AI errors become untraceable — no one knows which model decided what",
      "Trust erosion: users stop relying on AI output within 2 weeks of opaque decisions",
      "Audit failure: cannot reconstruct why the system took a specific action",
    ],
  },
  {
    primitive: "ai-content-label",
    capability: "ai-chatbot",
    existence: "required",
    placementRules: [
      "Directly attached to every AI-generated message",
      "Positioned before or above message content — never after",
      "Must be visible before user reads the AI content",
    ],
    visibilityRules: [
      "Immediately distinguishable from human messages at a glance",
      "Persists when message is scrolled, quoted, or forwarded",
      "Never removed or minimized for 'cleaner UI'",
    ],
    interactionRules: [
      "Clear 'AI' badge with distinct color from user/human badges",
      "Human handoff path visible: 'Not satisfied? Talk to a person →'",
      "Shows when AI is currently composing (typing indicator)",
    ],
    accessibilityRules: [
      "Screen reader pre-announces 'AI-generated message' before reading content",
      "Badge color not the only differentiator — shape and text label both present",
    ],
    failureConsequences: [
      "Users mistake AI errors for human errors — attribution failure",
      "Regulatory risk: undisclosed AI communication violates emerging AI transparency laws",
      "Brand damage: customers feel 'tricked' when they discover they talked to AI",
    ],
  },
  {
    primitive: "activity-timeline",
    capability: "workflow-auto",
    existence: "required",
    placementRules: [
      "Persistent panel or sidebar — not a modal or temporary view",
      "Accessible from every view where automated workflows are relevant",
      "Dedicated zone, not squeezed into a notification dropdown",
    ],
    visibilityRules: [
      "Always shows current state: past (completed), present (running), future (queued)",
      "Automatically scrolls to currently running step on open",
      "Failed steps surface immediately — never buried in history",
    ],
    interactionRules: [
      "Each step shows: trigger source, start time, duration, status",
      "Click any step to reveal full input/output/decision context",
      "Failed steps carry a 'Retry' and 'Investigate' action",
      "Filterable by workflow type, status, time range",
    ],
    accessibilityRules: [
      "Timeline navigable by keyboard (up/down arrows between steps)",
      "Status conveyed by both icon shape and color",
    ],
    failureConsequences: [
      "Operators cannot reconstruct what automated processes did — debugging becomes guesswork",
      "Failed workflows go unnoticed for hours or days",
      "At scale (50+ workflows/day), manual reconstruction becomes impossible",
    ],
  },
  {
    primitive: "inline-capability-indicator",
    capability: "role-access",
    existence: "required",
    placementRules: [
      "On every actionable UI element (buttons, links, inputs, toggles)",
      "Inline — co-located with the element, not in a separate permissions page",
      "Present on both enabled and disabled elements",
    ],
    visibilityRules: [
      "Disabled elements show WHY disabled ('Requires Admin role')",
      "Never hidden — even elements the user CAN access show subtle affordance",
      "Never revealed only on hover or focus",
    ],
    interactionRules: [
      "Disabled state: greyed out with inline reason text, not a modal on click",
      "Enabled state: subtle check or indicator that action is available",
      "Hover on disabled element: tooltip with specific role requirement",
    ],
    accessibilityRules: [
      "Disabled reason text readable by screen readers",
      "Focusable even when disabled (for explanation access)",
    ],
    failureConsequences: [
      "Users click disabled buttons repeatedly, then blame the system",
      "Permission confusion: users don't know what they CAN do",
      "Admin bloat: everyone requests admin access because permissions are invisible",
    ],
  },
  {
    primitive: "confirmation-gate",
    capability: "payment",
    existence: "required",
    placementRules: [
      "Before every financial action — no single-click payments",
      "Modal or dedicated confirmation step — not an inline toast",
      "Must interrupt the flow (by design) — financial actions should never be casual",
    ],
    visibilityRules: [
      "Shows: amount, currency, recipient, action description, effective date",
      "Never pre-filled with defaults — user must actively confirm each field",
      "Visible in full before the confirm button is enabled",
    ],
    interactionRules: [
      "Confirm button requires deliberate action (not just Enter key)",
      "Undo/cancel prominently available at confirmation stage",
      "Post-confirmation: receipt view with transaction ID immediately shown",
    ],
    accessibilityRules: [
      "Amount read aloud by screen reader before confirmation",
      "Error state: insufficient funds / payment failed shown with clear next step",
    ],
    failureConsequences: [
      "Accidental payments — users lose money, trust is permanently damaged",
      "Chargeback rate increases — payment processor may suspend account",
      "One financial error destroys credibility more than 100 successful transactions build it",
    ],
  },
  {
    primitive: "automation-marker",
    capability: "message-auto",
    existence: "required",
    placementRules: [
      "On every automated message in any list, thread, or timeline view",
      "Adjacent to the message timestamp — visible before reading content",
      "Also shown in the composer when scheduling automated messages",
    ],
    visibilityRules: [
      "Distinct from manually-sent messages by both icon AND color",
      "Shows trigger condition and scheduled time BEFORE the message sends",
      "Persists on sent messages — automation origin is permanent metadata",
    ],
    interactionRules: [
      "Shows: trigger condition, scheduled time, recipient list preview",
      "'Cancel scheduled send' available until transmission",
      "Post-send: links to the workflow or rule that triggered it",
    ],
    accessibilityRules: [
      "Screen reader announces 'Automated message' before reading content",
      "Scheduled status conveyed by both text label and icon",
    ],
    failureConsequences: [
      "Automated messages sent at wrong times during active human conversations",
      "Recipients cannot distinguish personal outreach from automation — brand feels fake",
      "No way to trace which automation rule sent which message",
    ],
  },
  {
    primitive: "orchestration-status",
    capability: "ai-orchestra",
    existence: "required",
    placementRules: [
      "Visible in a dedicated panel when multiple AI agents are coordinating",
      "Collapsible when only one agent is active, auto-expands on multi-agent tasks",
      "Integrated into the workspace, not a separate page",
    ],
    visibilityRules: [
      "Shows agent relationship: which agent called which, handoff points",
      "Current step highlighted, completed steps marked, pending steps shown",
    ],
    interactionRules: [
      "Decision tree visualization: agent roles, actions, handoffs",
      "Human override available at every orchestration junction",
      "Each agent shows: model, confidence, action taken, next handoff",
      "Pause/resume the entire orchestration from this panel",
    ],
    accessibilityRules: [
      "Agent actions announced to screen readers in execution order",
      "Override button accessible by keyboard from any step",
    ],
    failureConsequences: [
      "Multi-agent chains become impossible to debug — which agent errored where?",
      "Accountability vacuum: when AI agents delegate to each other, no human can trace responsibility",
      "Without manual override, a cascading agent error cannot be stopped mid-chain",
    ],
  },
  {
    primitive: "live-region-container",
    capability: "realtime-ui",
    existence: "required",
    placementRules: [
      "Maximum 2 competing live regions on screen at any time",
      "Each live region visually contained with clear boundaries",
      "Live regions must not overlap or nest within each other",
    ],
    visibilityRules: [
      "Each live region carries its own sync-status-indicator",
      "Pause/resume available per region (user may need to freeze one to read it)",
      "Regions can be collapsed but not removed — collapsed state shows update count",
    ],
    interactionRules: [
      "Updates are visually throttled (no flicker at >3 updates/second)",
      "New content highlighted briefly (2s fade), then settles",
      "User can scroll within a live region without being pushed by new content",
    ],
    accessibilityRules: [
      "Live regions use aria-live='polite' — never 'assertive' unless critical",
      "Update rate announced on first entry: 'This region updates every 5 seconds'",
    ],
    failureConsequences: [
      "Attention fragmentation: users cannot focus on any single data stream",
      "Motion sensitivity issues: rapid updates cause physical discomfort for some users",
      "At 3+ live regions, cognitive performance drops 40% (vigilance decrement)",
    ],
  },
  {
    primitive: "session-presence",
    capability: "user-auth",
    existence: "required",
    placementRules: [
      "Fixed position: top-right or bottom-left, never moves",
      "Persistent across all routes and views",
      "Multi-device indicator when user has other active sessions",
    ],
    visibilityRules: [
      "Always shows: avatar, name, role",
      "Session expiry warning: visible 5 minutes before timeout",
      "Multi-device: shows '2 other sessions active' when applicable",
    ],
    interactionRules: [
      "Click to reveal: session details, last active time, sign out, switch account",
      "Session expiry: countdown with 'Extend session' button",
      "Sign out requires confirmation but not a gate",
    ],
    accessibilityRules: [
      "Session expiry warning announced to screen reader with time remaining",
      "Avatar always has text fallback (initials)",
    ],
    failureConsequences: [
      "Users lose work when session expires without warning",
      "Multi-device confusion: changes on one device silently overwrite another",
      "Security risk: users don't know if other devices are accessing their account",
    ],
  },
  {
    primitive: "alert-hierarchy",
    capability: "notification-system",
    existence: "recommended",
    placementRules: [
      "Critical alerts: top-center, cannot be dismissed without action",
      "Informational alerts: top-right, auto-dismiss or user dismiss",
      "Ambient alerts: inline only, no interruption",
    ],
    visibilityRules: [
      "Three visually distinct tiers by color, position, and persistence",
      "Critical: red, requires action, persists until addressed",
      "Informational: blue, awareness only, auto-dismiss 8s or user dismiss",
      "Ambient: grey, inline badge only, no toast, no interruption",
    ],
    interactionRules: [
      "Critical: must be acknowledged (not just dismissed) — 'I understand' or 'Take action'",
      "Informational: click to navigate to source, dismiss to ignore",
      "Ambient: badge count only, click to expand, no push notification",
    ],
    accessibilityRules: [
      "Critical alerts use aria-live='assertive', others use 'polite'",
      "Alert count announced: '3 critical, 5 informational'",
    ],
    failureConsequences: [
      "Alert fatigue: users dismiss all notifications without reading — critical issues missed",
      "Notification anxiety: users feel overwhelmed and turn off all notifications",
      "Flat hierarchy: a server-down alert looks the same as 'new comment' — dangerous",
    ],
  },
  {
    primitive: "optimistic-state-handler",
    capability: "cache-layer",
    existence: "recommended",
    placementRules: [
      "Inline with the data being updated — not in a separate status area",
      "Near the action that triggered the optimistic update",
    ],
    visibilityRules: [
      "Shows optimistic state immediately on user action",
      "Rollback visible: if the server rejects, show the reverted state with explanation",
      "Stale data carries a subtle timestamp and manual refresh affordance",
    ],
    interactionRules: [
      "Optimistic update: immediate visual feedback (checkmark animation)",
      "On rollback: brief red flash on reverted data + toast explanation",
      "Stale data: 'Last updated 3m ago · Refresh' affordance on hover",
    ],
    accessibilityRules: [
      "Rollback announced to screen reader: 'Change could not be saved — reverted to previous value'",
      "Stale data timestamp accessible without hover (focus-visible)",
    ],
    failureConsequences: [
      "Users act on stale data — places orders, sends messages, makes decisions on outdated info",
      "Silent cache serving: users never know they're seeing old data",
      "Optimistic failures without rollback create 'phantom state' — user thinks action succeeded",
    ],
  },
  {
    primitive: "audit-log-viewer",
    capability: "audit-trail",
    existence: "recommended",
    placementRules: [
      "Dedicated view, accessible from settings or admin panel",
      "Not a modal — full-page with filters and search",
    ],
    visibilityRules: [
      "Each entry shows: timestamp, actor, action, target, previous value, new value",
      "Filterable by: actor, action type, target type, date range",
      "Exportable as CSV/JSON for compliance",
    ],
    interactionRules: [
      "Search across all fields with highlighted matches",
      "Click any entry to see full context (related entries, actor session info)",
      "Immutable records — no edit or delete affordance",
    ],
    accessibilityRules: [
      "Table structure with proper column headers for screen readers",
      "Date/time in user's local timezone with UTC label",
    ],
    failureConsequences: [
      "Compliance audit failure: cannot produce required activity records",
      "Insider threat: malicious actions invisible without audit trail",
      "Customer dispute: cannot prove who did what when — legal exposure",
    ],
  },
  {
    primitive: "health-status-bar",
    capability: "monitoring",
    existence: "recommended",
    placementRules: [
      "Fixed position: bottom bar or top bar, always visible",
      "Never inside a dropdown or settings page — must be ambient",
    ],
    visibilityRules: [
      "Green: all systems healthy — subtle, low-opacity",
      "Amber: degraded service — more visible, names affected service",
      "Red: incident — prominent, links to incident details",
    ],
    interactionRules: [
      "Click to expand: shows per-service status, uptime, incident timeline",
      "Amber/Red states link to incident response (status page, runbook)",
      "Subscribe to incident updates from this bar",
    ],
    accessibilityRules: [
      "Status conveyed by both color and text label (never color-only)",
      "Screen reader: 'System healthy' / '2 services degraded' on status change",
    ],
    failureConsequences: [
      "Incidents discovered by customers before the operations team",
      "No ambient awareness: ops team has to actively check dashboards",
      "During outages, support team has no system status visibility — gives wrong answers",
    ],
  },
  {
    primitive: "command-palette",
    capability: "search",
    existence: "recommended",
    placementRules: [
      "Global: available from every view via Cmd+K / Ctrl+K",
      "Centered overlay, not a sidebar or inline input",
    ],
    visibilityRules: [
      "Opens on keyboard shortcut, closes on Escape or click-outside",
      "Recent items surfaced by default before user types",
      "Results grouped by type: pages, actions, records, people",
    ],
    interactionRules: [
      "Keyboard-first: arrow keys navigate, Enter selects, Escape closes",
      "Fuzzy search across all indexed content",
      "Each result shows: title, type icon, subtitle, shortcut if available",
    ],
    accessibilityRules: [
      "Announced to screen reader: 'Command palette opened, start typing to search'",
      "Result count announced as user types",
    ],
    failureConsequences: [
      "Navigation friction: users spend 30%+ of session time finding things",
      "Power users abandon the product for tools with keyboard navigation",
      "New users cannot discover features buried in nested menus",
    ],
  },
  {
    primitive: "capacity-indicator",
    capability: "auto-scaling",
    existence: "recommended",
    placementRules: [
      "Integrated into the health-status-bar or monitoring view",
      "Not a standalone primitive — co-located with system status",
    ],
    visibilityRules: [
      "Shows during high-load events: current load % vs capacity",
      "Auto-scaling events: 'Scaling up — +2 instances (triggered 2m ago)'",
      "Degraded mode: 'Operating at reduced capacity — ETA recovery 5m'",
    ],
    interactionRules: [
      "Load bar: green <60%, amber 60-85%, red >85%",
      "Scaling history: last 10 scaling events with trigger reason",
      "Estimated recovery time when in degraded mode",
    ],
    accessibilityRules: [
      "Load percentage announced as text, not just visual bar",
    ],
    failureConsequences: [
      "Users experience slowdowns with no explanation — assume the product is broken",
      "Ops team unaware of near-capacity situations until crash",
      "Auto-scaling events create billing surprises without visibility",
    ],
  },
]

/** @deprecated Use PRIMITIVE_CONTRACTS instead */
export interface InterfacePrimitive {
  capability: string
  primitive: string
  policy: string
  priority: "mandatory" | "recommended"
}

/** @deprecated Use PRIMITIVE_CONTRACTS instead */
export const CAPABILITY_PRIMITIVE_MAP: InterfacePrimitive[] = PRIMITIVE_CONTRACTS.map((c) => ({
  capability: c.capability,
  primitive: c.primitive,
  policy: c.interactionRules.join("; "),
  priority: c.existence === "required" ? "mandatory" : "recommended",
}))

export function getContractsForCapability(capabilityId: string): PrimitiveContract[] {
  return PRIMITIVE_CONTRACTS.filter((p) => p.capability === capabilityId)
}

export function getRequiredContracts(selectedCapabilities: string[]): PrimitiveContract[] {
  return PRIMITIVE_CONTRACTS.filter(
    (p) => selectedCapabilities.includes(p.capability) && p.existence === "required"
  )
}

/* ── Contract Arbitration Engine ──

   Primitive contracts conflict in real systems.
   This engine resolves those conflicts — which contract wins,
   how the loser degrades, and how enforcement adapts per environment.
   ─────────────────────────────────────────────── */

export interface ContractConflict {
  /** Human-readable description of the tension */
  tension: string
  /** The two contracts (or contract groups) that compete */
  contracts: [string, string]
  /** Which contract has priority and WHY */
  resolution: string
  /** How the lower-priority contract degrades instead of being fully suppressed */
  degradation: string
  /** How this changes per viewport */
  viewportAdaptation?: { mobile: string; desktop: string }
  /** How this changes in crisis/incident mode */
  crisisAdaptation?: string
}

export const CONTRACT_CONFLICTS: ContractConflict[] = [
  {
    tension: "Realtime live regions compete with notification alerts for visual attention",
    contracts: ["live-region-container", "alert-hierarchy"],
    resolution: "Live regions take priority — they carry operational data. Alerts shift to ambient mode when 2+ live regions are active.",
    degradation: "Notifications degrade from toast to badge-only when live region count >= 2. Critical alerts still break through but use a smaller non-overlapping zone.",
    viewportAdaptation: {
      mobile: "Maximum 1 live region on mobile. Second region collapses to update-count badge. Alerts use bottom sheet instead of top toast.",
      desktop: "2 live regions permitted in split layout. Alerts use top-right zone distinct from live regions.",
    },
    crisisAdaptation: "During active incidents: suppress all informational alerts. Only critical alerts and live region health status remain visible.",
  },
  {
    tension: "AI provenance transparency competes with cognitive load reduction",
    contracts: ["ai-provenance-panel", "live-region-container"],
    resolution: "Provenance is non-negotiable for trust. Reduce provenance display density instead of hiding it — show summary by default, full detail on click.",
    degradation: "AI provenance panel shows collapsed summary (model + confidence only) by default. Full rationale, data sources, and trigger chain expand on click. Never fully hidden.",
    viewportAdaptation: {
      mobile: "Provenance as expandable inline accordion below each AI output — not a side panel. One-line summary visible, tap to expand.",
      desktop: "Provenance as a side panel, visible alongside AI output. Summary line always visible, detail scrollable.",
    },
  },
  {
    tension: "Audit timeline persistence competes with mobile screen real estate",
    contracts: ["activity-timeline", "session-presence"],
    resolution: "Timeline is critical for operational awareness but adapts density. Session presence is non-negotiable for security. Timeline collapses, session stays fixed.",
    degradation: "On mobile: timeline collapses to a bottom-sheet accessible via a persistent badge showing '3 running, 1 failed'. Session presence stays fixed top-right. Desktop: both visible, timeline as side panel.",
    viewportAdaptation: {
      mobile: "Timeline as bottom sheet (swipe up). Badge on nav bar shows running/failed counts. Session presence fixed top-right.",
      desktop: "Timeline as persistent right panel. Session presence integrated into top bar.",
    },
  },
  {
    tension: "Maximum live regions vs dashboard data density requirements",
    contracts: ["live-region-container", "sync-status-indicator"],
    resolution: "The 'max 2 live regions' rule is a cognitive limit, not a technical one. When dashboards require more data streams, group them: multiple metrics in ONE live region, not one region per metric.",
    degradation: "Data streams within the same semantic domain (e.g., 'Sales metrics') group into a single live region with a shared sync indicator. Individual metrics update within that region, not as separate live regions.",
  },
  {
    tension: "Permission indicators on every element compete with UI cleanliness",
    contracts: ["inline-capability-indicator", "live-region-container"],
    resolution: "Inline indicators win — invisible permissions cause more harm than visual noise. However, indicators use minimal footprint: a subtle lock/unlock icon, not a text label on every element.",
    degradation: "Enabled elements show no indicator (clean default). Disabled elements show a subtle lock icon with tooltip-on-hover explaining why. Only action-critical disabled elements show inline text reason.",
  },
]

/* ── State Transition Contracts ──

   Complex systems break during state transitions.
   These contracts govern what MUST be visible, what MUST NOT happen,
   and how to recover, during critical state changes.
   ─────────────────────────────────────────────── */

export interface StateContract {
  /** The state being transitioned through */
  state: string
  /** What triggers this state */
  trigger: string
  /** What must ALWAYS be visible during this state */
  requiredVisibility: string[]
  /** What must NEVER happen during this state */
  forbiddenBehaviors: string[]
  /** How the user can recover or escalate */
  recoveryUX: string[]
  /** How long before this state escalates */
  escalationPolicy: string
}

export const STATE_CONTRACTS: StateContract[] = [
  {
    state: "reconnecting",
    trigger: "WebSocket/SSE connection lost or unstable",
    requiredVisibility: [
      "sync-status-indicator: must show 'Reconnecting...' with elapsed time since disconnect",
      "Last known data timestamp: prominently displayed, with a warning that data may be stale",
      "Stale data regions: visually muted (reduced opacity) to distinguish from live data",
    ],
    forbiddenBehaviors: [
      "Never silently show cached data as live — always indicate staleness",
      "Never block user actions during reconnect — allow optimistic updates queued for sync",
      "Never retry without backoff — show retry count and next attempt time",
    ],
    recoveryUX: [
      "Manual 'Retry now' button after 3 failed auto-retries",
      "'Work offline' option if reconnect exceeds 30 seconds",
      "Clear path to check network status / system status page",
    ],
    escalationPolicy: "After 60 seconds disconnected: show system status link. After 5 minutes: suggest page refresh. Never auto-refresh (may lose user work).",
  },
  {
    state: "degraded",
    trigger: "Partial system failure — some services unavailable but core operational",
    requiredVisibility: [
      "health-status-bar: must show which services are degraded and impact summary",
      "Degraded features: visually indicated as unavailable with 'Service temporarily unavailable' reason",
      "Estimated recovery time if known, otherwise 'Investigating — no ETA yet'",
    ],
    forbiddenBehaviors: [
      "Never show generic 'Something went wrong' — name the degraded service",
      "Never allow actions that depend on a degraded service to fail silently — pre-flight check",
      "Never hide the degraded state to 'not worry users' — transparency builds trust",
    ],
    recoveryUX: [
      "'Notify me when recovered' subscription on each degraded feature",
      "Access to incident timeline and status page from the health bar",
      "Workaround paths: if service X is down, suggest alternative workflow if available",
    ],
    escalationPolicy: "Degraded state auto-clears when health checks pass. If degraded > 30 minutes: escalate to incident with full status page update.",
  },
  {
    state: "ai-processing",
    trigger: "AI agent or chatbot is actively computing a response",
    requiredVisibility: [
      "Processing indicator: distinct from loading spinner. Show 'AI is analyzing...' with estimated time if available.",
      "What the AI is processing: show the input/context the AI received (transparency of trigger)",
      "Cancel/stop affordance: user must be able to abort AI processing at any time",
    ],
    forbiddenBehaviors: [
      "Never show a generic spinner — always indicate AI-specific processing (not page loading)",
      "Never block the entire UI during AI processing — user must be able to do other things",
      "Never submit the AI response without showing it first for review (unless explicitly auto-send mode)",
    ],
    recoveryUX: [
      "'Stop generating' button always visible during processing",
      "If processing exceeds 30 seconds: offer to notify when complete",
      "If processing fails: show what was attempted, what failed, and a retry option with edited input",
    ],
    escalationPolicy: "After 30 seconds: show progress estimate. After 60 seconds: suggest simplifying the request. After 120 seconds: auto-timeout with clear failure message and retry option.",
  },
  {
    state: "human-override",
    trigger: "Operator overrides an AI decision or automated workflow step",
    requiredVisibility: [
      "Override confirmation: what was overridden, by whom, timestamp, reason (required input)",
      "Rollback path: 'Undo override' available for a configurable window (default 5 minutes)",
      "Downstream impact: what subsequent automated steps are affected by this override",
    ],
    forbiddenBehaviors: [
      "Never silently apply an override — confirmation with reason is mandatory",
      "Never lose the original AI decision — preserve both the override and the original for audit",
      "Never let an override cascade into other automated steps without warning",
    ],
    recoveryUX: [
      "'Undo override' button visible in activity timeline for 5 minutes post-override",
      "Override history: filterable view of all manual overrides with reasons",
      "Bulk revert: if an override caused downstream issues, revert the entire chain",
    ],
    escalationPolicy: "Override is recorded in audit trail immediately. If an override triggers 3+ downstream failures within 1 hour: surface to admin with 'Review override chain' prompt.",
  },
  {
    state: "permission-denied",
    trigger: "User attempts an action they lack permission for",
    requiredVisibility: [
      "Inline indicator on the disabled element: shows lock icon and 'Requires [Role]' tooltip",
      "Current role display: session-presence must be visible so user knows their current role",
      "Request path: if the organization allows, show 'Request access' or 'Contact [Admin Name]'",
    ],
    forbiddenBehaviors: [
      "Never show an error modal after the user clicks — the element should be visibly disabled BEFORE click",
      "Never show a generic 'Access Denied' page — always show what specific role is needed",
      "Never log the user out or redirect — permission denial is not an auth failure",
    ],
    recoveryUX: [
      "'Request access' button if the org has access request flows enabled",
      "Visible admin contact for permission requests",
      "Keyboard-navigable: disabled element is focusable and reads reason to screen reader",
    ],
    escalationPolicy: "If user clicks 3+ disabled elements within 5 minutes: surface a 'You may need additional permissions' suggestion with role upgrade path.",
  },
]

/* ── Experience Profile — cognitive orchestration layer ──

   NOT an aesthetic layer. This is product psychology → interaction architecture.
   Pressures and constraints are EMERGENT from capability topology.
   ─────────────────────────────────────────────── */

export interface ExperienceProfile {
  /* Core emotional + cognitive direction */
  emotion: string
  interactionModel: "guided-workflow" | "exploratory" | "task-focused" | "immersive"
  informationDensity: "low" | "medium" | "high"
  navigationStyle: "sidebar+workspace" | "top-nav" | "dashboard-grid" | "wizard-steps" | "split-pane"
  motionStrategy: "subtle-functional" | "playful-engaging" | "minimal-none" | "content-driven"

  /* Visual direction (derived, not primary) */
  style: string
  palette: string
  typography: string

  /* Layout archetype — derived from capability topology */
  layoutArchetype: string

  /* Design causality — WHY this direction, not just WHAT */
  why: string

  /* Active experience pressures — which pressures are triggered */
  activePressures: ExperiencePressure[]

  /* Interface constraints — capability-driven interaction governance */
  interfaceConstraints: string[]

  /* Decision provenance — causal chain from capability to interface consequence */
  decisionProvenance: string[]

  /* Required interface primitives — mandatory interaction elements */
  requiredPrimitives: string[]

  /* State transition contracts — critical state change governance */
  stateContracts: string[]

  /* Anti-patterns: what NOT to do */
  antiPatterns: string[]

  /* Compositional UX risks — emergent from capability combinations */
  uxRisks: string[]
  uxRecommendations: string[]

  /* UX debt warnings — what will break if ignored */
  uxDebt: string[]

  /* Design tokens — bridge reasoning to actual CSS values */
  designTokens: DesignTokens

  /* Component priority graph — capability-driven component importance */
  componentPriorities: ComponentPriority[]

  /* Generated IA — page structure derived from capability topology */
  pageHierarchy: PageHierarchy
}

/* ── Design Tokens — reasoning → CSS bridge ── */

export interface DesignTokens {
  radius: string
  spacingScale: number[]
  shadowStyle: "soft-low" | "soft-medium" | "flat-none" | "crisp-hard"
  surfaceHierarchy: number
  motionDuration: string
  chartStyle: "muted-grid" | "bold-contrast" | "minimal-line" | "glass-cards"
  density: "compact" | "comfortable" | "spacious"
  fontScale: "minor-second" | "major-second" | "perfect-fourth"
}

export function deriveDesignTokens(style: string, density: string, motion: string): DesignTokens {
  const isFlat = style.toLowerCase().includes("flat") || style.toLowerCase().includes("minimal")
  const isSoft = style.toLowerCase().includes("soft") || style.toLowerCase().includes("premium")
  const isDense = density === "high"
  const isSubtle = motion.includes("subtle") || motion.includes("minimal")

  return {
    radius: isFlat ? "8px" : isSoft ? "12px" : "10px",
    spacingScale: isDense ? [2, 4, 8, 12, 20, 32] : [4, 8, 16, 24, 40, 64],
    shadowStyle: isFlat ? "flat-none" : isSoft ? "soft-low" : "soft-medium",
    surfaceHierarchy: isFlat ? 2 : 3,
    motionDuration: isSubtle ? "150ms" : "200ms",
    chartStyle: isFlat ? "minimal-line" : "muted-grid",
    density: isDense ? "compact" : "comfortable",
    fontScale: isDense ? "minor-second" : "major-second",
  }
}

export const DEFAULT_DESIGN_TOKENS: DesignTokens = {
  radius: "10px",
  spacingScale: [4, 8, 16, 24, 40, 64],
  shadowStyle: "soft-medium",
  surfaceHierarchy: 3,
  motionDuration: "180ms",
  chartStyle: "muted-grid",
  density: "comfortable",
  fontScale: "major-second",
}

/* ── Component Priority Graph ── */

export interface ComponentPriority {
  component: string
  priority: "critical" | "high" | "medium" | "low"
  reason: string
}

export function deriveComponentPriorities(selectedCapabilities: string[]): ComponentPriority[] {
  const priorities: ComponentPriority[] = []

  const isSelected = (id: string) => selectedCapabilities.includes(id)

  // Critical: system inoperable without these
  if (isSelected("realtime-sync") || isSelected("realtime-ui"))
    priorities.push({ component: "SyncStatusIndicator", priority: "critical", reason: "Realtime capabilities demand persistent state visibility" })
  if (isSelected("ai-agent") || isSelected("ai-chatbot") || isSelected("ai-orchestra"))
    priorities.push({ component: "AIProvenance", priority: "critical", reason: "AI capabilities require trust through transparency" })
  if (isSelected("workflow-auto"))
    priorities.push({ component: "ActivityTimeline", priority: "critical", reason: "Automation requires execution traceability" })

  // High: essential for daily operation
  if (isSelected("user-auth"))
    priorities.push({ component: "SessionPresence", priority: "high", reason: "Authentication requires identity visibility" })
  if (isSelected("role-access"))
    priorities.push({ component: "PermissionIndicator", priority: "high", reason: "Role-based access requires inline visibility" })
  if (isSelected("dashboard"))
    priorities.push({ component: "MetricCards", priority: "high", reason: "Dashboard is the primary operational view" })
  if (isSelected("search"))
    priorities.push({ component: "CommandPalette", priority: "high", reason: "Search requires global keyboard access" })
  if (isSelected("notification-system"))
    priorities.push({ component: "AlertTier", priority: "high", reason: "Notifications require priority hierarchy" })

  // Medium: important but deferrable
  if (isSelected("payment"))
    priorities.push({ component: "ConfirmationGate", priority: "medium", reason: "Payment requires explicit confirmation" })
  if (isSelected("message-auto"))
    priorities.push({ component: "AutomationMarker", priority: "medium", reason: "Automated messages require distinction" })
  if (isSelected("monitoring"))
    priorities.push({ component: "HealthStatus", priority: "medium", reason: "Monitoring requires ambient visibility" })
  if (isSelected("audit-trail"))
    priorities.push({ component: "AuditViewer", priority: "medium", reason: "Audit trail requires dedicated view" })

  // Low: nice to have
  if (isSelected("file-storage"))
    priorities.push({ component: "FileUpload", priority: "low", reason: "File storage requires upload interface" })
  if (isSelected("data-io"))
    priorities.push({ component: "ImportExport", priority: "low", reason: "Data I/O requires import/export interface" })
  if (isSelected("i18n"))
    priorities.push({ component: "LocaleSwitcher", priority: "low", reason: "i18n requires locale selection" })
  if (isSelected("branding"))
    priorities.push({ component: "ThemeProvider", priority: "low", reason: "Branding requires theme system" })

  return priorities.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 }
    return order[a.priority] - order[b.priority]
  })
}

/* ── Page Hierarchy / IA Generator ── */

export interface PageHierarchy {
  pages: { path: string; label: string; priority: "primary" | "secondary" }[]
  layout: string
  globalFeatures: string[]
}

export function derivePageHierarchy(selectedCapabilities: string[]): PageHierarchy {
  const isSelected = (id: string) => selectedCapabilities.includes(id)
  const pages: PageHierarchy["pages"] = []
  const globalFeatures: string[] = []

  // Primary pages — core navigation
  if (isSelected("dashboard"))
    pages.push({ path: "/dashboard", label: "Dashboard", priority: "primary" })
  if (isSelected("ai-chatbot") || isSelected("ai-agent"))
    pages.push({ path: "/inbox", label: "Inbox", priority: "primary" })
  if (isSelected("workflow-auto"))
    pages.push({ path: "/workflows", label: "Workflows", priority: "primary" })
  if (isSelected("ai-orchestra"))
    pages.push({ path: "/agents", label: "AI Agents", priority: "primary" })
  if (isSelected("search"))
    pages.push({ path: "/records", label: "Records", priority: "primary" })

  // Secondary pages
  if (isSelected("audit-trail"))
    pages.push({ path: "/audit-log", label: "Audit Log", priority: "secondary" })
  if (isSelected("monitoring"))
    pages.push({ path: "/system", label: "System Health", priority: "secondary" })
  if (isSelected("role-access") || isSelected("user-auth"))
    pages.push({ path: "/settings/team", label: "Team", priority: "secondary" })
  if (isSelected("payment"))
    pages.push({ path: "/settings/billing", label: "Billing", priority: "secondary" })
  pages.push({ path: "/settings", label: "Settings", priority: "secondary" })

  // Global features
  if (isSelected("search"))
    globalFeatures.push("Command palette (Cmd+K) — global search across all views")
  if (isSelected("realtime-sync") || isSelected("realtime-ui"))
    globalFeatures.push("Sync status indicator — persistent, all routes")
  if (isSelected("notification-system"))
    globalFeatures.push("Alert hierarchy — 3-tier notification system")
  if (isSelected("user-auth"))
    globalFeatures.push("Session presence — avatar + role, fixed position")

  // Layout derivation
  const hasAI = isSelected("ai-agent") || isSelected("ai-chatbot") || isSelected("ai-orchestra")
  const hasRealtime = isSelected("realtime-sync") || isSelected("realtime-ui")
  const hasWorkflow = isSelected("workflow-auto")

  let layout = "sidebar + workspace"
  if (hasAI && hasRealtime) layout = "split-pane: sidebar nav, center workspace, right context panel"
  else if (hasWorkflow) layout = "sidebar + workspace with bottom activity bar"
  else if (hasAI) layout = "sidebar + workspace with AI panel"

  return { pages, layout, globalFeatures }
}

export const DEFAULT_EXPERIENCE_PROFILE: ExperienceProfile = {
  emotion: "professional and capable",
  interactionModel: "task-focused",
  informationDensity: "medium",
  navigationStyle: "sidebar+workspace",
  motionStrategy: "subtle-functional",
  style: "Flat Design",
  palette: "Indigo primary, neutral background",
  typography: "Modern geometric (Inter, Plus Jakarta Sans)",
  layoutArchetype: "sidebar workspace with data panels",
  why: "",
  activePressures: [],
  interfaceConstraints: [],
  decisionProvenance: [],
  requiredPrimitives: [],
  stateContracts: [],
  antiPatterns: [],
  uxRisks: [],
  uxRecommendations: [],
  uxDebt: [],
  designTokens: DEFAULT_DESIGN_TOKENS,
  componentPriorities: [],
  pageHierarchy: { pages: [], layout: "sidebar + workspace", globalFeatures: [] },
}

/* ── Compositional UX Pressure Reference ──

   The AI prompt uses compositional reasoning, not static matching.
   This data serves as REFERENCE for the AI — it describes how
   risks EMERGE as capabilities compose together.

   Layer 1 — Single capability: what each brings alone
   Layer 2 — Pair composition: two together create new risks
   Layer 3 — Domain pressure: capability weight direction
   ─────────────────────────────────────────────── */

export interface UxPressureLayer {
  /** Which capabilities are involved */
  capabilities: string[]
  /** What level of composition this is */
  layer: "single" | "pair" | "triple" | "domain"
  /** Emergent UX risks at this composition level */
  risks: string[]
  /** Concrete mitigations */
  recommendations: string[]
  /** What layout pattern this suggests */
  layoutSignal?: string
  /** What UX debt this creates if ignored */
  debtWarning?: string
}

export const UX_PRESSURE_REFERENCE: UxPressureLayer[] = [

  /* ── Layer 1: Single capability baseline risks ── */

  {
    capabilities: ["realtime-sync"], layer: "single",
    risks: ["Stale data anxiety — users can't trust what they see is current"],
    recommendations: ["Explicit sync status — never hide connection state"],
    layoutSignal: "status bar or indicator row",
  },
  {
    capabilities: ["ai-agent"], layer: "single",
    risks: ["Automation opacity — users don't know what AI decided or why"],
    recommendations: ["Show AI rationale inline — explain decisions in plain language"],
    layoutSignal: "AI explanation panel",
  },
  {
    capabilities: ["workflow-auto"], layer: "single",
    risks: ["Temporal confusion — what ran when, what's running now, what's next"],
    recommendations: ["Execution timeline — show past, present, and queued steps"],
    layoutSignal: "timeline or activity log",
  },
  {
    capabilities: ["ai-chatbot"], layer: "single",
    risks: ["AI/human confusion — user can't tell who they're talking to"],
    recommendations: ["Always label AI-generated content, provide human handoff path"],
    layoutSignal: "sender identity badges",
  },
  {
    capabilities: ["payment"], layer: "single",
    risks: ["Trust fragility — any ambiguity in financial flows erodes confidence"],
    recommendations: ["Explicit confirmation for every financial action"],
    layoutSignal: "confirmation dialogs",
  },

  /* ── Layer 2: Pair composition — two together create NEW risks ── */

  {
    capabilities: ["realtime-sync", "ai-agent"], layer: "pair",
    risks: [
      "Cognitive overload — live AI stream + live data stream compete for attention",
      "Trust erosion — realtime AI output with no quality signal",
    ],
    recommendations: [
      "Show AI confidence scores inline — let users calibrate trust",
      "Separate AI output spatially from raw data — distinct visual zones",
    ],
    layoutSignal: "split-pane: data zone + AI zone",
    debtWarning: "Chat-first navigation may collapse when both streams are live",
  },
  {
    capabilities: ["realtime-sync", "user-auth"], layer: "pair",
    risks: ["Ownership ambiguity — concurrent edits, unclear who changed what"],
    recommendations: ["Clear ownership indicators — show who's editing what in realtime"],
    layoutSignal: "presence indicators + edit locks",
  },
  {
    capabilities: ["ai-agent", "workflow-auto"], layer: "pair",
    risks: [
      "Attention fragmentation — multiple automated processes running simultaneously",
      "Debug difficulty — hard to trace which agent triggered which workflow",
    ],
    recommendations: [
      "Unified activity feed showing agent actions + workflow state",
      "Traceability: each workflow step links back to the agent decision that triggered it",
    ],
    layoutSignal: "unified timeline with agent attribution",
    debtWarning: "Without traceability, debugging becomes impossible at scale",
  },
  {
    capabilities: ["ai-chatbot", "message-auto"], layer: "pair",
    risks: ["Automation feels impersonal — templated messages at wrong moments"],
    recommendations: ["Context-aware scheduling — don't send automated follow-ups during active conversations"],
    layoutSignal: "message timeline with automation markers",
  },
  {
    capabilities: ["payment", "ai-agent"], layer: "pair",
    risks: ["Financial hallucination — AI making incorrect billing statements"],
    recommendations: ["AI must never touch financial numbers directly — always route through verified calculation"],
    layoutSignal: "AI advisory panel separate from transaction view",
    debtWarning: "One AI billing error can destroy customer trust permanently",
  },

  /* ── Layer 3: Triple composition — three+ create systemic risks ── */

  {
    capabilities: ["realtime-sync", "ai-agent", "workflow-auto"], layer: "triple",
    risks: [
      "Automation opacity at scale — users can't track what's automated, what needs attention, what failed silently",
      "Temporal confusion — realtime updates + delayed workflows + async AI create a time-perception problem",
    ],
    recommendations: [
      "System health dashboard — single view of all automated processes and their state",
      "Attention hierarchy: urgent (red), automated (blue), informational (grey)",
      "Every automated action must link back to a human-auditable trigger",
    ],
    layoutSignal: "operations console with status zones",
    debtWarning: "At scale, opaque automation becomes a liability — users will stop trusting the system",
  },
  {
    capabilities: ["ai-agent", "ai-orchestra", "workflow-auto"], layer: "triple",
    risks: [
      "AI decision chain opacity — orchestrated agents making cascading decisions no human can trace",
      "Accountability vacuum — when something goes wrong, no clear 'who decided what'",
    ],
    recommendations: [
      "Decision provenance: every AI action must carry its trigger, model, confidence, and fallback path",
      "Human override at every orchestration junction — don't let AI chains run without checkpoints",
    ],
    layoutSignal: "decision tree with human checkpoints",
    debtWarning: "Without decision provenance, this system will be un-auditable within 6 months",
  },

  /* ── Layer: Domain pressure — capability weight pushes layout direction ── */

  {
    capabilities: ["ai-agent", "ai-chatbot", "ai-orchestra"], layer: "domain",
    risks: ["Interface becomes a 'black box' — users feel like passengers, not operators"],
    recommendations: ["Operator-first design: the human commands, AI executes, results are inspectable"],
    layoutSignal: "command center: split-pane workspace with persistent side context + state inspector",
  },
  {
    capabilities: ["dashboard", "realtime-ui", "search"], layer: "domain",
    risks: ["Data density fatigue — too many metrics, not enough meaning"],
    recommendations: ["Hierarchical data: top-level KPIs → drill-down → raw data. Progressive disclosure of complexity."],
    layoutSignal: "dense dashboard with drill-down hierarchy + comparison panels",
  },
  {
    capabilities: ["workflow-auto", "message-auto", "ai-agent"], layer: "domain",
    risks: ["Guided workflow feels constraining — power users feel trapped in a wizard"],
    recommendations: ["Dual-mode: wizard for onboarding/first-time, workspace for daily use. Never force one mode."],
    layoutSignal: "guided wizard with milestone tracking, upgradeable to workspace",
  },
  {
    capabilities: ["payment", "user-auth", "role-access", "audit-trail"], layer: "domain",
    risks: [
      "Trust chain vulnerability — any weak link in auth→permission→payment→audit breaks the whole chain",
      "Over-permissioned by default — complex role setup leads to admin bloat",
    ],
    recommendations: [
      "Conservative defaults: least privilege. Escalate only with explicit approval.",
      "Every permission change must be auditable and reversible.",
    ],
    layoutSignal: "security console with role visualization + audit timeline",
    debtWarning: "Permission complexity grows quadratically with team size — plan role hierarchy early",
  },
]

export interface CapabilityUxPressure {
  triggerIds: string[]
  uxRisks: string[]
  recommendations: string[]
}

/** @deprecated Use UX_PRESSURE_REFERENCE for compositional reasoning */
export const CAPABILITY_UX_PRESSURE: CapabilityUxPressure[] = UX_PRESSURE_REFERENCE
  .filter((p) => p.layer !== "domain")
  .map((p) => ({
    triggerIds: p.capabilities,
    uxRisks: p.risks,
    recommendations: p.recommendations,
  }))

/* ── Backward-compat ── */

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending", parsed: "AI Parsed", clarifying: "Clarifying",
  reviewed: "Reviewed", exported: "Exported", contacted: "Contacted",
}

/** @deprecated Legacy complexity config — retained for backward compat */
export const COMPLEXITY_CONFIG: Record<string, { label: string; color: string; weeks: string }> = {
  simple: { label: "Simple", color: "emerald", weeks: "2-4 weeks" },
  medium: { label: "Medium", color: "amber", weeks: "4-8 weeks" },
  complex: { label: "Complex", color: "rose", weeks: "8-16 weeks" },
}

export const MODULE_EMOJI: Record<string, string> = {
  auth: "🔐", payments: "💳", "ai-chat": "🤖", "file-upload": "📤",
  dashboard: "📊", analytics: "📈", "web3-wallet": "👛", "admin-panel": "⚙️",
  notifications: "🔔", search: "🔍", "api-integrations": "🔗", "social-login": "👥",
  frontend: "🎨", database: "🗄️", "ai-workflow": "🧠", "deploy-ops": "🚀",
}

export const MODULE_LABEL: Record<string, string> = {
  auth: "Auth", payments: "Payments", "ai-chat": "AI Chat", "file-upload": "Upload",
  dashboard: "Dashboard", analytics: "Analytics", "web3-wallet": "Web3", "admin-panel": "Admin",
  notifications: "Notify", search: "Search", "api-integrations": "API", "social-login": "Social",
  frontend: "Frontend", database: "Database", "ai-workflow": "AI Workflow", "deploy-ops": "Deploy & Ops",
}

export const FEATURE_EMOJI_MAP: Record<string, string> = {
  auth: "🔐", authentication: "🔐", login: "🔐", "user accounts": "👤",
  payment: "💳", billing: "💳", subscription: "🔄",
  ai: "🤖", chat: "💬", messaging: "💬", upload: "📤", "file upload": "📤",
  dashboard: "📊", analytics: "📈", wallet: "👛", web3: "⛓️", blockchain: "⛓️",
  admin: "⚙️", notification: "🔔", search: "🔍", api: "🔗", integration: "🔗",
  social: "👥", profile: "👤", booking: "📅", scheduling: "📅", calendar: "📅",
  video: "🎥", audio: "🎤", map: "🗺️", location: "📍", ecommerce: "🛒",
  shop: "🛒", review: "⭐", rating: "⭐", export: "📥", import: "📤",
  pdf: "📄", email: "✉️", sms: "📱", report: "📋", settings: "⚙️",
  security: "🛡️", privacy: "🔒", "dark mode": "🌙", theme: "🎨",
  language: "🌐", translation: "🌐", mobile: "📱", responsive: "💻",
  realtime: "⚡", "real-time": "⚡", offline: "📶",
}
