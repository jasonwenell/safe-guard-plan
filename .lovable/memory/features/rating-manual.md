---
name: Rating Manual Management
description: Admin UI for managing carrier rating manuals with factor tables, versioning, and UW factor lookup tool
type: feature
---
- Rating Manual Manager at /admin/rating-manuals — upload, version, activate/archive manuals per carrier
- Factor Lookup at /rating-manual — UW-facing tool to look up age-gender, area, industry, plan relativity, leveraged trend, and contract factors
- Mock data in src/data/ratingManualMockData.ts with Pan American, TMHCC, BHSI, SLAIC manuals
- 9 factor tables: base rates, age-gender, area, plan relativity, industry, trend, leveraged trend, contract adjustments, expense loads
- Underwriter and Master roles have access to Factor Lookup; only Master/Admin has access to Rating Manuals admin
