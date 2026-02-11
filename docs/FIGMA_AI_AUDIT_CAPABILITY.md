# Figma AI Audit Capability (Design System Compliance)

This document defines the implementation and rollout approach for auditing Figma designs (internet banking platform) against design-system and token rules.

## Goals supported

1. **Copy/paste design context from Figma via MCP**
2. **Audit using documented rules**
   - variable references
   - spacing scale
   - brand colors
   - corner radius
   - typography
   - token usage and layout alignment
3. **Output clear report**
   - concise summary
   - visual table/chart
   - before/after suggested fixes

## Implemented in this repository

- Audit engine CLI: `scripts/figma-audit/run.mjs`
- Reusable skill pack: `skills/figma-design-audit/`
- Default rules file: `skills/figma-design-audit/rules/default-rules.json`
- Sample test fixtures: `skills/figma-design-audit/fixtures/*`

## Data ingestion options (investigation)

### Option A (recommended): Official Figma MCP server

Figma provides official MCP endpoints:

- **Remote MCP:** `https://mcp.figma.com/mcp`
- **Desktop MCP:** `http://127.0.0.1:3845/mcp`

Relevant tool coverage includes:

- `get_design_context`
- `get_metadata`
- `get_variable_defs`
- `get_screenshot`

Why this is preferred:

- up-to-date context from current selected nodes
- direct variable usage extraction
- no custom scraper needed

### Option B: Figma desktop MCP selection workflow

Best for high-fidelity review loops while designing:

- select frame in desktop app
- invoke MCP tools from IDE agent
- copy payload directly into audit input

### Option C (fallback): Figma REST API + export pipeline

Use when MCP is unavailable in your environment:

- fetch file node metadata/screens via REST API
- fetch variable/token data from variables endpoints
- feed exported JSON into the same audit CLI

This fallback preserves the same report format but requires API token management and scheduled exports.

Helper command included in this repo:

```bash
export FIGMA_ACCESS_TOKEN=your_figma_pat
npm run figma:fetch -- \
  --figma-link "https://www.figma.com/design/<fileKey>/<name>?node-id=5-1229" \
  --out-dir ./inputs/figma \
  --prefix dashboard
```

## Recommended operating model

1. **Per journey run**
   - login/access
   - account management
   - card management
   - payments

2. **Shift-left checks**
   - run audit before design QA signoff
   - run again before engineering handoff

3. **Governance**
   - resolve high severity issues first
   - store reports by release candidate

## Command examples

```bash
npm run figma:audit -- \
  --selection ./inputs/login-selection.json \
  --variables ./inputs/login-variables.json \
  --rules ./skills/figma-design-audit/rules/default-rules.json \
  --report-name login-journey
```

```bash
npm run figma:audit -- \
  --selection ./inputs/payment-flow-selection.json \
  --variables ./inputs/payment-flow-variables.json \
  --report-name payment-journey \
  --model gemini-2.5-flash
```

## Output artifacts

For each run:

- `reports/figma-audit/<report>-<timestamp>.json`
- `reports/figma-audit/<report>-<timestamp>.md`
- `reports/figma-audit/<report>-<timestamp>.figjam.md`

Markdown includes:

- severity summary
- mermaid pie chart
- impacted journeys table
- detailed violations table
- before/after fix snippets
- optional AI remediation summary

FigJam paste pack includes:

- summary cards
- severity-grouped finding cards
- backlog and sprint card suggestions

## Details needed from you for production rollout

Please share:

1. **Figma access model**
   - remote MCP, desktop MCP, or both
2. **Workspace/account constraints**
   - seat type and rate-limit expectations
3. **Primary token collections/modes**
   - e.g., light/dark, brand A/brand B
4. **Rule policy source**
   - where spacing/radius/type/color standards are documented today
5. **Severity policy**
   - what should be considered critical vs high in your release gates
6. **Preferred report destination**
   - markdown in repo, Jira attachment, Confluence, or another system

If you do not have a severity policy yet, use the baseline in `default-rules.json` and tune after 1-2 audit cycles.

## Remote MCP handoff details

See `docs/REMOTE_MCP_HANDOFF.md` for the exact payloads and link formats to provide.

## Security and compliance notes for banking products

- Avoid sending confidential customer data to AI prompts.
- Use sanitized design payloads for external AI services.
- Keep variable and design exports in access-controlled repos/workspaces.
- Configure model/provider based on your internal security policy.
