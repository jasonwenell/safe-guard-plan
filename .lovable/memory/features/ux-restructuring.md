---
name: Quote-Centric UX Restructuring
description: Replaced 14 standalone pages with QuoteWorkspace tabbed page at /quote/:id, role-filtered tabs, simplified sidebar
type: feature
---
- QuoteWorkspace at /quote/:id replaces /rfps/:id and 12 standalone pages
- 15 tabs: intake, documents, census, benefits, plan-stack, claims, risk, ai-package, rating, proposals, binding, comms, win-loss, renewal, workflow
- Tab visibility filtered by role via tabConfig.ts
- Tab status icons (✅⏳⬜⚠️✨) from workflow step status
- Auto-opens to first incomplete tab when no ?tab= param
- Footer actions: Save + role-specific handoff/approve buttons
- Sidebar reduced: Assistant 4 items, Associate 3, UW 6, Admin 10
- All route maps in Dashboard, RoleQueue, PipelineDashboard, RFPQuoteLog updated to /quote/:id?tab=X
- Old standalone pages kept as files (imported by tab wrappers) but removed from routes
