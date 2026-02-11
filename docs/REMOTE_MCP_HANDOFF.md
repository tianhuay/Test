# Remote MCP Handoff Guide (What to send to run audits)

This guide shows exactly how to provide Figma data when using the **official remote MCP server**.

## 1) Configure remote MCP

In Cursor MCP settings, add:

```json
{
  "mcpServers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

## 2) What to send me each audit cycle

For each journey/screen (login, account management, cards, payments), provide:

1. **Frame link** (Figma URL with node-id)
2. **Selection payload** from MCP `get_design_context` (or `get_metadata` for large frames)
3. **Variable payload** from MCP `get_variable_defs`
4. **Rule/guideline source payload** (if rules are in a separate Figma page)

You can provide the data in either way:

- Paste JSON directly in chat, or
- Save JSON files in the repo and share paths

Recommended file naming:

- `inputs/figma/login-selection.json`
- `inputs/figma/login-variables.json`
- `inputs/figma/rules-page-typography.json`
- `inputs/figma/rules-page-spacing.json`

## 3) Prompt snippets to capture payloads

For a selected frame:

```text
Use #get_design_context for this frame and return JSON only.
```

```text
Use #get_variable_defs for this frame and return variable ids, names, values, and modes in JSON only.
```

For rule pages / guideline pages:

```text
Use #get_metadata for this page/section and return JSON/XML with all text layers and node hierarchy.
Then use #get_design_context for the guideline section.
```

## 4) Minimum handoff table to fill

Copy and fill this table:

| Journey | Figma Frame Link | Selection JSON | Variables JSON | Notes |
|---|---|---|---|---|
| Login & Access | <paste-link> | <path-or-paste> | <path-or-paste> | |
| Account Management | <paste-link> | <path-or-paste> | <path-or-paste> | |
| Card Management | <paste-link> | <path-or-paste> | <path-or-paste> | |
| Payments | <paste-link> | <path-or-paste> | <path-or-paste> | |

## 5) If your rules are inside Figma pages

Provide:

- links to rule pages/frames
- MCP outputs for those pages (`get_metadata` + `get_design_context`)

I will map those into machine-checkable rules in:

`skills/figma-design-audit/rules/default-rules.json`

## 6) If you do not have a severity policy yet

The toolkit uses a starter default:

- **High:** missing/unknown variable refs, off-brand colors
- **Medium:** spacing/radius/typography scale/family/weight issues
- **Low:** grid alignment issues

We can tune this later per your governance model.

## 7) Publishing to FigJam

Official MCP currently exposes **read-oriented FigJam metadata** (`get_figjam`) but not a direct write/publish tool.

Current workflow:

1. Run audit.
2. Open generated `*.figjam.md` paste pack.
3. Paste sections into FigJam frames (Summary, Critical+High, Medium+Low, Backlog).

This gives a fast repeatable publishing flow until direct write APIs are available.

## 8) If you cannot run Cursor app due IT policy

You can bypass MCP and fetch directly via Figma REST API from this repo:

```bash
export FIGMA_ACCESS_TOKEN=your_figma_pat
npm run figma:fetch -- \
  --figma-link "https://www.figma.com/design/<fileKey>/<name>?node-id=5-1229" \
  --out-dir ./inputs/figma \
  --prefix dashboard
```

Then run:

```bash
npm run figma:audit -- \
  --selection ./inputs/figma/dashboard-selection.json \
  --variables ./inputs/figma/dashboard-variables.json \
  --report-name dashboard
```

If your workspace blocks PAT sharing, ask your design ops team to provide exported JSON files from a secure runner.
