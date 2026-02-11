<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/115ITgqnryamJi9THfSjKibFHv0FUBMxW

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Figma design system audit capability

This repository now includes a reusable CLI and skill pack to audit Figma designs against design-system rules (spacing, color, radius, typography, variable/token usage, and grid alignment).

### Quick start

1. Capture Figma payloads (via MCP):
   - `get_design_context` (or `get_metadata`)
   - `get_variable_defs`
2. Save them as JSON files.
3. Run:

```bash
npm run figma:audit -- \
  --selection ./inputs/login-selection.json \
  --variables ./inputs/login-variables.json \
  --allowed-variables ./inputs/figma/design-system-variables.json \
  --rules ./skills/figma-design-audit/rules/default-rules.json \
  --report-name login-journey
```

Outputs are generated in `reports/figma-audit` as both JSON and Markdown.
Each run also produces a FigJam-ready paste pack (`*.figjam.md`).

See:
- `docs/FIGMA_AI_AUDIT_CAPABILITY.md`
- `docs/REMOTE_MCP_HANDOFF.md`
- `skills/figma-design-audit/SKILL.md`

### If you cannot use an MCP client (IT restriction)

Use Figma REST fetch helper:

```bash
export FIGMA_ACCESS_TOKEN=your_figma_pat
npm run figma:fetch -- \
  --figma-link "https://www.figma.com/design/<fileKey>/<name>?node-id=5-1229" \
  --out-dir ./inputs/figma \
  --prefix dashboard
```

Then run audit with generated files.

If only your design-system library is allowed, pass that variables file as an allow-list:

```bash
npm run figma:audit -- \
  --selection ./inputs/figma/dashboard-selection.json \
  --variables ./inputs/figma/dashboard-variables.json \
  --allowed-variables ./inputs/figma/design-system-variables.json \
  --report-name dashboard
```
