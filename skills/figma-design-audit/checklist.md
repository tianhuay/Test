# Figma audit run checklist

## Pre-run

- [ ] MCP is connected (`figma` or `figma-desktop`)
- [ ] Correct frame(s) selected in Figma
- [ ] `get_design_context` payload captured
- [ ] `get_variable_defs` payload captured
- [ ] Rule file validated for current token mode

## Run

- [ ] Execute `npm run figma:audit -- ...`
- [ ] Confirm report generated in `reports/figma-audit`
- [ ] Verify high-severity issues are populated

## Post-run

- [ ] Share markdown report with design + dev leads
- [ ] Track high severity fixes with owners
- [ ] Re-run audit after remediation
- [ ] Archive final report for release record
