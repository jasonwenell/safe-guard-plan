---
name: AI Underwriting Engine Addendum
description: Full PRD addendum for AI-native underwriting — quotability scoring, magic button, UW review dashboard, risk flags, laser detection
type: feature
---

## AI Underwriting Engine (Module 11)
Source: SLEQ_AI_Underwriting_Addendum_v1.md

### Core Components Built
1. **Quotability Score (0-100)** — Pre-qualification scoring on RFPs
   - 5 weighted factors: Risk Appetite (25%), Win Probability (20%), Demographics (20%), Claims (20%), Market (15%)
   - Routing: AUTO_QUOTE (90+), FAST_TRACK (70-89), STANDARD (50-69), CAUTION (30-49), RECOMMEND_SKIP (0-29)
   - Shown as badge on RFP Quote Log + full card on detail views

2. **Magic Button** — One-click AI underwriting pipeline (9 steps, ~30-90 sec)
   - Pre-flight → Data Enrichment → Manual Rate → Experience Rate → Blending → Risk Intelligence → Quotability Update → Confidence → Package Assembly

3. **UW Review Dashboard** — Human-in-the-loop review of AI quote packages
   - Tabs: Overview, Scenarios, Risk & Lasers, Explainability, Decision Points
   - Editable final rates per scenario, UW notes, approve/decline workflow

4. **Risk Flags & Laser Detection** — Severity-based risk indicators
   - Categories: Large Claimant, GCT Exposure, Specialty Rx, Adverse Selection, SIC Mismatch, etc.

5. **Confidence & Explainability** — Per-field confidence scores + AI risk narrative

### Routes
- `/underwriting` — AI scoring queue (prioritized by quotability)
- `/underwriting/:rfpId` — AI underwriting review for specific RFP

### Future Phases (from PRD)
- Third-party data enrichment (HealthVerity, Milliman, Verisk, CMS, BLS)
- Pricing manual digitization with version-controlled rate tables
- UW override tracking and AI calibration
- AI performance tracking (predicted vs actual outcomes)
