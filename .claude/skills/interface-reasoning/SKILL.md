# Interface Reasoning Skill

AI-native UI governance. This skill does NOT generate UI — it enforces interface contracts derived from system architecture. Before and after writing UI code, it verifies that every mandatory primitive is present and follows its policy.

## Activation

- User asks to build, design, or generate UI/pages/components
- User asks for a dashboard, landing page, or app layout
- User references design systems, styling, or component architecture

## Core Principle

**UI is not aesthetic. UI is system pressure made visible. Primitive contracts govern what MUST exist, where, and how.**

## Generation Contract Protocol

When generating UI, you MUST follow this protocol:

### Before Writing Any Code

1. **Read the capability graph** — what services are selected? Which ones are v1 (mandatory for launch)?
2. **Identify required contracts** — use `getRequiredContracts(selectedCapabilities)` to list every primitive that MUST exist
3. **Read each contract fully** — placementRules, visibilityRules, interactionRules, accessibilityRules are ALL binding
4. **Identify active pressures** — which of the 10 formal pressures are triggered
5. **Derive the layout archetype** — what zone structure satisfies all contracts?

### While Writing Code

6. **Every required primitive must be implemented** with its full contract — placement + visibility + interaction + accessibility
7. **No anti-patterns** — check each UI decision against the anti-pattern list
8. **Interface constraints govern decisions** — e.g., if "max 2 live regions" is a constraint, count them
9. **Primitive policies are non-negotiable** — "persistent across route changes" means the component must NOT unmount on navigation

### After Writing Code

10. **Verification checklist** — verify every item before declaring done

## Primitive Contract Quick Reference

These are the most critical contracts. Violating any of these creates production incidents.

### sync-status-indicator (realtime-sync) — REQUIRED
- **Placement**: Persistent across routes, fixed top-right, exists on mobile
- **Visibility**: Never hidden behind modals, visible during loading, shows even when healthy
- **Interaction**: Last sync timestamp, Reconnecting state, Degraded state, click for history
- **Accessibility**: Announces connection changes to screen reader, text label (not icon-only)
- **Failure if violated**: Users lose trust in data, stale data decisions cascade, incident diagnosis time doubles

### ai-provenance-panel (ai-agent) — REQUIRED
- **Placement**: Inline with every AI output, collapsible but present by default, never floating
- **Visibility**: Visible for every AI action, never hidden behind 'Advanced' toggles
- **Interaction**: Confidence score, model used, trigger source, fallback path, human override, 'Report incorrect'
- **Accessibility**: Score conveyed by color AND text, provenance chain keyboard-navigable
- **Failure if violated**: AI errors become untraceable, trust erosion within 2 weeks, audit failure

### ai-content-label (ai-chatbot) — REQUIRED
- **Placement**: On every AI message, before content, persists when forwarded/quoted
- **Visibility**: Immediately distinguishable from human, never removed for 'cleaner UI'
- **Interaction**: 'AI' badge with distinct color, human handoff path, composing indicator
- **Accessibility**: Screen reader pre-announces 'AI-generated message', badge has shape AND text
- **Failure if violated**: Attribution failure, regulatory risk, brand damage

### activity-timeline (workflow-auto) — REQUIRED
- **Placement**: Persistent panel/sidebar, not modal, accessible from every relevant view
- **Visibility**: Past/running/queued always visible, failed steps never buried
- **Interaction**: Each step shows trigger/time/duration/status, click for full context, Retry on failure
- **Accessibility**: Keyboard-navigable (up/down arrows), status by icon shape AND color
- **Failure if violated**: Debugging becomes guesswork, failed workflows unnoticed for hours, reconstruction impossible at scale

### inline-capability-indicator (role-access) — REQUIRED
- **Placement**: On every actionable element, inline, not in separate permissions page
- **Visibility**: Disabled elements show WHY, enabled show subtle affordance, never hover-only
- **Interaction**: Disabled = greyed + reason text, NOT modal on click. Enabled = subtle check
- **Accessibility**: Reason text screen-reader-readable, focusable even when disabled
- **Failure if violated**: Permission confusion, admin bloat, users click disabled buttons repeatedly

### confirmation-gate (payment) — REQUIRED
- **Placement**: Before every financial action, modal or dedicated step, must interrupt flow
- **Visibility**: Amount/currency/recipient/action/date all visible before confirm enabled
- **Interaction**: No pre-filled defaults, deliberate confirm (not just Enter), receipt immediately after
- **Accessibility**: Amount read aloud before confirmation, clear next step on failure
- **Failure if violated**: Accidental payments, chargeback rate increases, permanent trust damage

### automation-marker (message-auto) — REQUIRED
- **Placement**: On every automated message, visible before reading content, also in composer
- **Visibility**: Distinct by icon AND color, trigger shown before send, label persists on sent messages
- **Interaction**: Trigger condition, scheduled time, recipient preview, cancel before send
- **Accessibility**: Screen reader announces 'Automated message' before content
- **Failure if violated**: Messages sent during active conversations, brand feels fake, no traceability

### orchestration-status (ai-orchestra) — REQUIRED
- **Placement**: Dedicated panel, auto-expands on multi-agent tasks, integrated into workspace
- **Visibility**: Agent relationship tree, current step highlighted, completed/pending marked
- **Interaction**: Decision tree, human override at every junction, per-agent details, pause/resume all
- **Accessibility**: Actions announced in execution order, override keyboard-accessible
- **Failure if violated**: Multi-agent chains impossible to debug, accountability vacuum, cascading errors unstoppable

### live-region-container (realtime-ui) — REQUIRED
- **Placement**: Max 2 live regions, visually contained, never overlap or nest
- **Visibility**: Each has own sync indicator, pause/resume per region, collapsed shows update count
- **Interaction**: Updates visually throttled, new content highlighted 2s then settles, scrollable without push
- **Accessibility**: aria-live='polite', update rate announced on entry
- **Failure if violated**: Attention fragmentation, motion sensitivity issues, 40% cognitive performance drop at 3+ regions

### session-presence (user-auth) — REQUIRED
- **Placement**: Fixed position top-right/bottom-left, persistent across routes, multi-device indicator
- **Visibility**: Always shows avatar+name+role, expiry warning 5min before, other sessions count
- **Interaction**: Click for session details/sign out/switch account, countdown with extend button
- **Accessibility**: Expiry warning announced with time, avatar has text fallback (initials)
- **Failure if violated**: Lost work on session expiry, multi-device overwrites, security risk

## Anti-Pattern Reference

Before writing UI code, scan this list. If any UI decision matches an anti-pattern, reject it.

- No AI purple/pink gradients — for fintech, healthcare, enterprise, legal
- No chat-first navigation — when realtime + AI are both active (use workspace layout)
- No hidden automation states — every AI action must be traceable to a trigger source
- No floating AI assistants — for trust-sensitive products (payment, healthcare, legal)
- No silent sync failures — connection state must be explicit and visible
- No error modals for permission denial — use inline disabled states with reason text
- No transient notifications for critical events — critical = persistent until acknowledged
- No single-click financial operations — every payment action requires explicit confirmation
- No invisible permission boundaries — users must see what they can and cannot do
- No unstoppable AI chains — every orchestration junction needs human override

## Contract Arbitration — When Primitives Conflict

Contracts compete in real systems. When a conflict is detected, follow this resolution order:

### Conflict: Live regions vs Notification alerts
- **Winner**: Live regions (operational data > awareness)
- **Loser degrades to**: Badge-only when 2+ live regions active. Critical alerts still break through in smaller non-overlapping zone.
- **Mobile**: Max 1 live region. Second collapses to update-count badge.
- **Crisis mode**: Suppress all informational alerts. Only critical + health status remain.

### Conflict: AI provenance vs Cognitive load
- **Winner**: Provenance (trust > cleanliness)
- **Loser degrades to**: Collapsed summary (model + confidence only) by default. Full chain on click. Never fully hidden.
- **Mobile**: Expandable accordion below AI output, not side panel.

### Conflict: Audit timeline vs Mobile space
- **Winner**: Session presence (security > awareness)
- **Loser degrades to**: Timeline as bottom sheet with running/failed count badge on nav bar.
- **Desktop**: Both visible — timeline as right panel, session as top bar.

### Conflict: Live regions vs Dashboard density
- **Resolution**: Group same-domain streams into ONE live region. Not one region per metric.
- **Rule**: 'Max 2 live regions' is a cognitive limit, not a technical one.

### Conflict: Permission indicators vs Visual cleanliness
- **Winner**: Inline indicators (usability > aesthetics)
- **Loser degrades to**: Subtle lock icon only. Text reason only on action-critical disabled elements. Clean default for enabled.

## State Transition Governance

During state transitions, the following rules are NON-NEGOTIABLE:

### reconnecting
- sync-status-indicator shows 'Reconnecting...' with elapsed time
- Stale data visually muted (reduced opacity)
- NEVER silently show cached data as live
- NEVER block user actions during reconnect
- After 60s: show system status link. After 5min: suggest refresh (never auto-refresh).

### degraded
- health-status-bar names the degraded service — never 'Something went wrong'
- Degraded features show 'Service temporarily unavailable'
- Pre-flight check before actions depending on degraded services
- NEVER hide degraded state 'to not worry users'

### ai-processing
- Show 'AI is analyzing...' with estimated time, NOT a generic spinner
- Show what input/context the AI received
- Cancel/stop button always visible
- NEVER block entire UI during processing
- After 30s: show progress. After 60s: suggest simplifying. After 120s: auto-timeout.

### human-override
- Confirmation with reason input required before override applies
- Original AI decision preserved alongside override for audit
- 'Undo override' available for 5 minutes
- Downstream impact warning before cascade

### permission-denied
- Element visibly disabled BEFORE click — never an error modal after
- Shows specific role required — never generic 'Access Denied'
- NEVER redirect or log out — permission denial is not auth failure
- After 3+ denials in 5min: surface role upgrade suggestion

## Verification Checklist

Before declaring UI work complete, verify ALL of these:

- [ ] Every required primitive is present (sync-status-indicator, ai-provenance-panel, ai-content-label, etc.)
- [ ] Each primitive follows its placement rules (position, persistence, responsiveness)
- [ ] Each primitive follows its visibility rules (never hidden, always shown, state coverage)
- [ ] Each primitive follows its interaction rules (required states, user actions, affordances)
- [ ] Each primitive follows its accessibility rules (screen reader, keyboard, non-color-only)
- [ ] No anti-patterns from the reference list are present
- [ ] Interface constraints are enforced (e.g., max 2 live regions)
- [ ] Layout matches the derived archetype (split-pane, dashboard-grid, etc.)
- [ ] Motion strategy matches product emotion (subtle-functional for professional tools)
- [ ] Information density matches operational need
- [ ] WCAG AA: contrast 4.5:1 minimum, keyboard navigation, screen reader labels
- [ ] prefers-reduced-motion respected for all animations
- [ ] Responsive: verified at 375px, 768px, 1024px, 1440px
