# FigJam Paste Pack · Figma Design Audit Report · Internet Banking Platform Design System

Generated: 2026-02-11T05:11:15.482Z
Source report: /workspace/inputs/figma/dashboard-selection.json

Paste guidance:
1. Create a FigJam board with frames: Summary, Critical+High, Medium+Low, Backlog.
2. Copy each section below into the matching frame.
3. Convert each bullet into a sticky note/card.

## Summary cards

- [SUMMARY] Nodes audited: 630
- [SUMMARY] Total violations: 360
- [SUMMARY] Critical: 0
- [SUMMARY] High: 281
- [SUMMARY] Medium: 79
- [SUMMARY] Low: 0

- [SUMMARY] Most impacted journeys:
  - Dashboard default - Transaction and savings - lg: 360

## HIGH findings

### V-0001 · color_off_brand
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg
- Issue: layoutGrids.0.color is #FF00001A
- Expected: Approved brand color token/value
- Fix: Replace this color with a brand-approved token from the active theme/mode.
- Before: layoutGrids.0.color: #FF00001A
- After: layoutGrids.0.color: {color/brand/...}

### V-0037 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card
- Issue: background.0.color is #FFFFFF
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: background.0.color: #FFFFFF
- After: background.0.color: {color/semantic/...}

### V-0038 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0039 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card
- Issue: fills.0.color is #FFFFFF
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: fills.0.color: #FFFFFF
- After: fills.0.color: {color/semantic/...}

### V-0109 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card
- Issue: background.0.color is #FFFFFF
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: background.0.color: #FFFFFF
- After: background.0.color: {color/semantic/...}

### V-0110 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0111 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card
- Issue: fills.0.color is #FFFFFF
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: fills.0.color: #FFFFFF
- After: fills.0.color: {color/semantic/...}

### V-0040 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0041 · color_off_brand
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item
- Issue: effects.0.color is #26344503
- Expected: Approved brand color token/value
- Fix: Replace this color with a brand-approved token from the active theme/mode.
- Before: effects.0.color: #26344503
- After: effects.0.color: {color/brand/...}

### V-0042 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item
- Issue: effects.0.color is #26344503
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: effects.0.color: #26344503
- After: effects.0.color: {color/semantic/...}

### V-0112 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0113 · color_off_brand
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item
- Issue: effects.0.color is #26344503
- Expected: Approved brand color token/value
- Fix: Replace this color with a brand-approved token from the active theme/mode.
- Before: effects.0.color: #26344503
- After: effects.0.color: {color/brand/...}

### V-0114 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item
- Issue: effects.0.color is #26344503
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: effects.0.color: #26344503
- After: effects.0.color: {color/semantic/...}

### V-0082 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > .Input message item
- Issue: background.0.color is #FFFFFF
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: background.0.color: #FFFFFF
- After: background.0.color: {color/semantic/...}

### V-0083 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > .Input message item
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0084 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > .Input message item
- Issue: fills.0.color is #FFFFFF
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: fills.0.color: #FFFFFF
- After: fills.0.color: {color/semantic/...}

### V-0154 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > .Input message item
- Issue: background.0.color is #FFFFFF
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: background.0.color: #FFFFFF
- After: background.0.color: {color/semantic/...}

### V-0155 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > .Input message item
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0156 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > .Input message item
- Issue: fills.0.color is #FFFFFF
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: fills.0.color: #FFFFFF
- After: fills.0.color: {color/semantic/...}

### V-0085 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > .Input message item > Icon
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0157 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > .Input message item > Icon
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0086 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > .Input message item > Icon > info
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0158 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > .Input message item > Icon > info
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0087 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > .Input message item > Message
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0159 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > .Input message item > Message
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0088 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > .Input message item > Message > Message
- Issue: style.letterSpacing is 0
- Expected: Variable reference for spacing
- Fix: Bind spacing value to the spacing token in your variable collection.
- Before: style.letterSpacing: 0
- After: style.letterSpacing: {spacing/token-name}

### V-0089 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > .Input message item > Message > Message
- Issue: style.paragraphSpacing is 14
- Expected: Variable reference for spacing
- Fix: Bind spacing value to the spacing token in your variable collection.
- Before: style.paragraphSpacing: 14
- After: style.paragraphSpacing: {spacing/token-name}

### V-0160 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > .Input message item > Message > Message
- Issue: style.letterSpacing is 0
- Expected: Variable reference for spacing
- Fix: Bind spacing value to the spacing token in your variable collection.
- Before: style.letterSpacing: 0
- After: style.letterSpacing: {spacing/token-name}

### V-0161 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > .Input message item > Message > Message
- Issue: style.paragraphSpacing is 14
- Expected: Variable reference for spacing
- Fix: Bind spacing value to the spacing token in your variable collection.
- Before: style.paragraphSpacing: 14
- After: style.paragraphSpacing: {spacing/token-name}

### V-0056 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0128 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0057 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0129 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0062 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Amount
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0134 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Amount
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0063 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Amount > Amount
- Issue: style.letterSpacing is 0
- Expected: Variable reference for spacing
- Fix: Bind spacing value to the spacing token in your variable collection.
- Before: style.letterSpacing: 0
- After: style.letterSpacing: {spacing/token-name}

### V-0065 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Amount > Amount
- Issue: style.paragraphSpacing is 22
- Expected: Variable reference for spacing
- Fix: Bind spacing value to the spacing token in your variable collection.
- Before: style.paragraphSpacing: 22
- After: style.paragraphSpacing: {spacing/token-name}

### V-0135 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Amount > Amount
- Issue: style.letterSpacing is 0
- Expected: Variable reference for spacing
- Fix: Bind spacing value to the spacing token in your variable collection.
- Before: style.letterSpacing: 0
- After: style.letterSpacing: {spacing/token-name}

### V-0137 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Amount > Amount
- Issue: style.paragraphSpacing is 22
- Expected: Variable reference for spacing
- Fix: Bind spacing value to the spacing token in your variable collection.
- Before: style.paragraphSpacing: 22
- After: style.paragraphSpacing: {spacing/token-name}

### V-0058 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Label
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0130 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Label
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0059 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Label > Label
- Issue: style.letterSpacing is 0
- Expected: Variable reference for spacing
- Fix: Bind spacing value to the spacing token in your variable collection.
- Before: style.letterSpacing: 0
- After: style.letterSpacing: {spacing/token-name}

### V-0060 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Label > Label
- Issue: style.paragraphSpacing is 12
- Expected: Variable reference for spacing
- Fix: Bind spacing value to the spacing token in your variable collection.
- Before: style.paragraphSpacing: 12
- After: style.paragraphSpacing: {spacing/token-name}

### V-0131 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Label > Label
- Issue: style.letterSpacing is 0
- Expected: Variable reference for spacing
- Fix: Bind spacing value to the spacing token in your variable collection.
- Before: style.letterSpacing: 0
- After: style.letterSpacing: {spacing/token-name}

### V-0132 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Label > Label
- Issue: style.paragraphSpacing is 12
- Expected: Variable reference for spacing
- Fix: Bind spacing value to the spacing token in your variable collection.
- Before: style.paragraphSpacing: 12
- After: style.paragraphSpacing: {spacing/token-name}

### V-0068 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Balance
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0140 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Balance
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0073 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Balance > Amount
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0145 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Balance > Amount
- Issue: backgroundColor is #00000000
- Expected: Variable reference for color
- Fix: Bind color to a published semantic token.
- Before: backgroundColor: #00000000
- After: backgroundColor: {color/semantic/...}

### V-0074 · missing_variable_reference
- Priority: HIGH
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Balance > Amount > Amount
- Issue: style.letterSpacing is 0
- Expected: Variable reference for spacing
- Fix: Bind spacing value to the spacing token in your variable collection.
- Before: style.letterSpacing: 0
- After: style.letterSpacing: {spacing/token-name}


## MEDIUM findings

### V-0090 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > .Input message item > Message > Message
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0162 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > .Input message item > Message > Message
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0064 · spacing_off_scale
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Amount > Amount
- Issue: style.paragraphSpacing is 22
- Expected: 20
- Fix: Use nearest spacing token/value 20.
- Before: style.paragraphSpacing: 22
- After: style.paragraphSpacing: 20

### V-0066 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Amount > Amount
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0067 · typography_scale_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Amount > Amount
- Issue: style.fontSize+lineHeight is 22/28
- Expected: 20/28
- Fix: Switch to a supported font-size/line-height pair from your typography scale.
- Before: fontSize: 22, lineHeight: 28
- After: fontSize: 20, lineHeight: 28

### V-0136 · spacing_off_scale
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Amount > Amount
- Issue: style.paragraphSpacing is 22
- Expected: 20
- Fix: Use nearest spacing token/value 20.
- Before: style.paragraphSpacing: 22
- After: style.paragraphSpacing: 20

### V-0138 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Amount > Amount
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0139 · typography_scale_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Amount > Amount
- Issue: style.fontSize+lineHeight is 22/28
- Expected: 20/28
- Fix: Switch to a supported font-size/line-height pair from your typography scale.
- Before: fontSize: 22, lineHeight: 28
- After: fontSize: 20, lineHeight: 28

### V-0061 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Label > Label
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0133 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Available > Label > Label
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0076 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Balance > Amount > Amount
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0077 · typography_scale_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Balance > Amount > Amount
- Issue: style.fontSize+lineHeight is 14/18
- Expected: 14/20
- Fix: Switch to a supported font-size/line-height pair from your typography scale.
- Before: fontSize: 14, lineHeight: 18
- After: fontSize: 14, lineHeight: 20

### V-0148 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Balance > Amount > Amount
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0149 · typography_scale_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Balance > Amount > Amount
- Issue: style.fontSize+lineHeight is 14/18
- Expected: 14/20
- Fix: Switch to a supported font-size/line-height pair from your typography scale.
- Before: fontSize: 14, lineHeight: 18
- After: fontSize: 14, lineHeight: 20

### V-0072 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Balance > Label > Label
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0144 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Balances > Balance > Label > Label
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0053 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Header > Account Summary > Account Names and Number > Account Name
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0125 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card > Header > Account Summary > Account Names and Number > Account Name
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0046 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card group header > Group header
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0118 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Card group header > Group header
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0081 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Description > Description
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0153 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card > .Account card item > Description > Description
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0098 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card action > Labels > Or join an existing application
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0108 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card action > Labels > Or join an existing application
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0095 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card action > Labels > Sign up for a new account
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0105 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Account card action > Labels > Sign up for a new account
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0002 · spacing_off_scale
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Page header
- Issue: paddingBottom is 80
- Expected: 64
- Fix: Use nearest spacing token/value 64.
- Before: paddingBottom: 80
- After: paddingBottom: 64

### V-0014 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Page header > Content > Breadcrumb > Breadcrumb > .Breadcrumb item > Breadcrumb
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0019 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Page header > Content > Breadcrumb > Breadcrumb > .Breadcrumb item > Breadcrumb
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0024 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Page header > Content > Breadcrumb > Breadcrumb > .Breadcrumb item > Breadcrumb
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0029 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Page header > Content > Breadcrumb > Breadcrumb > .Breadcrumb item > Breadcrumb
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0030 · spacing_off_scale
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Page header > Content > Title
- Issue: paddingTop is 80
- Expected: 64
- Fix: Use nearest spacing token/value 64.
- Before: paddingTop: 80
- After: paddingTop: 64

### V-0033 · spacing_off_scale
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Page header > Content > Title > Hi Alexander.
- Issue: style.paragraphSpacing is 72
- Expected: 64
- Fix: Use nearest spacing token/value 64.
- Before: style.paragraphSpacing: 72
- After: style.paragraphSpacing: 64

### V-0035 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Page header > Content > Title > Hi Alexander.
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0036 · typography_scale_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Content > Page header > Content > Title > Hi Alexander.
- Issue: style.fontSize+lineHeight is 72/86
- Expected: 32/40
- Fix: Switch to a supported font-size/line-height pair from your typography scale.
- Before: fontSize: 72, lineHeight: 86
- After: fontSize: 32, lineHeight: 40

### V-0331 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Sidenav > Bottom > Button > .Button item > Button
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0305 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Sidenav > Bottom > Menu > .Menu item > Leading > Label > Label
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0306 · typography_scale_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Sidenav > Bottom > Menu > .Menu item > Leading > Label > Label
- Issue: style.fontSize+lineHeight is 14/18
- Expected: 14/20
- Fix: Switch to a supported font-size/line-height pair from your typography scale.
- Before: fontSize: 14, lineHeight: 18
- After: fontSize: 14, lineHeight: 20

### V-0323 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Sidenav > Bottom > Menu > .Menu item > Trailing > Badge > .Badge item > Label
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0324 · typography_scale_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Sidenav > Bottom > Menu > .Menu item > Trailing > Badge > .Badge item > Label
- Issue: style.fontSize+lineHeight is 14/18
- Expected: 14/20
- Fix: Switch to a supported font-size/line-height pair from your typography scale.
- Before: fontSize: 14, lineHeight: 18
- After: fontSize: 14, lineHeight: 20

### V-0312 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Sidenav > Bottom > Menu > .Menu item > Trailing > Label
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0313 · typography_scale_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Sidenav > Bottom > Menu > .Menu item > Trailing > Label
- Issue: style.fontSize+lineHeight is 14/18
- Expected: 14/20
- Fix: Switch to a supported font-size/line-height pair from your typography scale.
- Before: fontSize: 14, lineHeight: 18
- After: fontSize: 14, lineHeight: 20

### V-0174 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Sidenav > Top > Menu > .Menu item > Leading > Label > Label
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0175 · typography_scale_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Sidenav > Top > Menu > .Menu item > Leading > Label > Label
- Issue: style.fontSize+lineHeight is 14/18
- Expected: 14/20
- Fix: Switch to a supported font-size/line-height pair from your typography scale.
- Before: fontSize: 14, lineHeight: 18
- After: fontSize: 14, lineHeight: 20

### V-0200 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Sidenav > Top > Menu > .Menu item > Leading > Label > Label
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0201 · typography_scale_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Sidenav > Top > Menu > .Menu item > Leading > Label > Label
- Issue: style.fontSize+lineHeight is 14/18
- Expected: 14/20
- Fix: Switch to a supported font-size/line-height pair from your typography scale.
- Before: fontSize: 14, lineHeight: 18
- After: fontSize: 14, lineHeight: 20

### V-0225 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Sidenav > Top > Menu > .Menu item > Leading > Label > Label
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0226 · typography_scale_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Sidenav > Top > Menu > .Menu item > Leading > Label > Label
- Issue: style.fontSize+lineHeight is 14/18
- Expected: 14/20
- Fix: Switch to a supported font-size/line-height pair from your typography scale.
- Before: fontSize: 14, lineHeight: 18
- After: fontSize: 14, lineHeight: 20

### V-0251 · typography_family_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Sidenav > Top > Menu > .Menu item > Leading > Label > Label
- Issue: style.fontFamily is Montserrat
- Expected: Inter, Roboto, system-ui
- Fix: Use one of the approved design-system typefaces.
- Before: fontFamily: Montserrat
- After: fontFamily: Inter

### V-0252 · typography_scale_violation
- Priority: MEDIUM
- Journey: Dashboard default - Transaction and savings - lg
- Node: Dashboard default - Transaction and savings - lg > Sidenav > Top > Menu > .Menu item > Leading > Label > Label
- Issue: style.fontSize+lineHeight is 14/18
- Expected: 14/20
- Fix: Switch to a supported font-size/line-height pair from your typography scale.
- Before: fontSize: 14, lineHeight: 18
- After: fontSize: 14, lineHeight: 20

## Backlog cards

- [BACKLOG] Track each violation ID in Jira/Linear with owner + due date.
- [BACKLOG] Re-run audit after fixes and compare severity totals.
