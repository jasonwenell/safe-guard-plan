---
name: Persona-based role system
description: 4 roles (Assistant, Associate, Underwriter, Master) with filtered nav, role-specific dashboards, and switchable personas
type: feature
---
- Roles: ASSISTANT, ASSOCIATE, UNDERWRITER, MASTER (admin sees everything)
- PersonaContext at src/contexts/PersonaContext.tsx manages current role state
- Role switcher in sidebar footer — click user avatar to switch personas
- Navigation filtered per role via ROLE_NAV_ACCESS map
- Each role has a tailored dashboard with to-do tasks derived from workflow data
- Assistant: intake focus (emails, docs, RFP logging)
- Associate: setup focus (census, plan design, benefits entry)
- Underwriter: rating focus (underwriting, rating engine, proposals, analytics)
- Master: full platform overview with all modules and team throughput
