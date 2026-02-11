# Skill: Figma Design System Audit (AI + Rules)

This skill helps you audit Figma screens (via MCP) against your design system and token rules, then generate a visual report of violations and suggested fixes.

## When to use this skill

- You need compliance checks for banking journeys (login, account management, card management, payments).
- You want rule-based detection for spacing, radius, typography, grid alignment, brand colors, and token references.
- You need report artifacts for handoff to design and engineering teams.

## Inputs

1. **Design selection/context payload**
   - Source: Figma MCP `get_design_context` and/or `get_metadata`.
   - Save as JSON file (raw copy/paste is okay).

2. **Variable definitions payload**
   - Source: Figma MCP `get_variable_defs`.
   - Save as JSON file.

3. **Rule file**
   - Use default: `skills/figma-design-audit/rules/default-rules.json`
   - Or create project-specific variant.

## MCP setup options (official first)

### Official remote MCP

Use:

`https://mcp.figma.com/mcp`

### Official desktop MCP

Use:

`http://127.0.0.1:3845/mcp`

Desktop mode supports selection-driven workflows from your active Figma selection.

### No MCP client available (IT restriction fallback)

Use Figma REST helper in this repo:

```bash
export FIGMA_ACCESS_TOKEN=your_figma_pat
npm run figma:fetch -- \
  --figma-link "https://www.figma.com/design/<fileKey>/<name>?node-id=5-1229" \
  --out-dir ./inputs/figma \
  --prefix dashboard
```

This generates selection/variables JSON files compatible with `npm run figma:audit`.

## Audit command

```bash
npm run figma:audit -- \
  --selection ./inputs/login-selection.json \
  --variables ./inputs/login-variables.json \
  --rules ./skills/figma-design-audit/rules/default-rules.json \
  --output-dir ./reports/figma-audit \
  --report-name login-journey
```

Disable AI narrative section:

```bash
npm run figma:audit -- --selection ./inputs/login-selection.json --no-ai
```

## Report outputs

- `*.json` machine-readable audit findings
- `*.md` visual summary with:
  - severity table
  - pie chart (Mermaid)
  - violation table
  - before/after fix snippets
  - optional AI remediation priorities
- `*.figjam.md` FigJam-ready paste pack

To publish in FigJam quickly:

1. Open the `*.figjam.md` file from the audit output.
2. Copy sections into FigJam frames.
3. Convert bullets into sticky notes/cards.

## Prompt snippets for MCP extraction

Use these prompts in your MCP-enabled client:

1. **Design context**
   - `Use #get_design_context for this selected frame and return the output in JSON.`

2. **Variable usage**
   - `Use #get_variable_defs for this selected frame and return variable names, ids, and values in JSON.`

3. **Scope reduction for large pages**
   - `Use #get_metadata first, then return design context for only the critical login frame and its children.`

## Acceptance checklist

- [ ] All audited screens are grouped by user journey.
- [ ] Every high-severity issue has an owner and ETA.
- [ ] Unknown variable references are resolved first.
- [ ] Color and typography violations are remediated before QA signoff.
- [ ] Reports are archived per release candidate.
