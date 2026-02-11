# Prompt template: Run Figma design audit

Use this prompt with an AI assistant after you have copied MCP outputs.

---

You are auditing an internet banking design system.

Audit this Figma selection and report all design-system violations:

1. Variable binding correctness
2. Spacing scale compliance
3. Corner radius scale compliance
4. Typography family/weight/size-lineHeight compliance
5. Brand color compliance
6. Grid alignment compliance

Constraints:
- Prioritize high severity issues first.
- Include suggested fixes with before/after values.
- Group findings by journey/screen.
- Return concise markdown with tables and an executive summary.

Selection payload:
```json
{PASTE_GET_DESIGN_CONTEXT_OR_METADATA_JSON_HERE}
```

Variable payload:
```json
{PASTE_GET_VARIABLE_DEFS_JSON_HERE}
```

Rules payload:
```json
{PASTE_RULES_JSON_HERE}
```

---

Output format:
- Summary table (severity counts)
- Top impacted journeys
- Detailed violations table
- Before/after fix examples
- Priority remediation plan for next sprint
