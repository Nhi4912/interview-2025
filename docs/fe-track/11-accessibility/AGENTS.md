# 11-ACCESSIBILITY

## OVERVIEW

WCAG 2.1/2.2 AA compliance, ARIA roles/states/properties, keyboard navigation patterns, and screen reader compatibility (NVDA, VoiceOver, JAWS).

## WHERE TO LOOK

| Topic                                              | File                                                |
| -------------------------------------------------- | --------------------------------------------------- |
| WCAG principles (POUR)                             | `01-wcag-fundamentals.md`                           |
| ARIA roles / states / properties                   | `02-aria-attributes.md`                             |
| Keyboard nav patterns + focus management           | `03-keyboard-navigation.md`                         |
| Screen reader testing (NVDA / VoiceOver / JAWS)    | `04-screen-readers.md`                              |
| Color contrast, axe tooling, audit checklists      | `05-testing-accessibility.md`                       |
| Semantic HTML, accessible forms, live regions      | `01-wcag-fundamentals.md` + `02-aria-attributes.md` |
| Modal / dialog patterns (focus trap, `aria-modal`) | `03-keyboard-navigation.md`                         |
| Full topic map                                     | `mindmap-accessibility.md`                          |

## LOCAL CONVENTIONS

- **Baseline:** WCAG 2.2 AA (2026 standard; note 2.1 AA still widely cited in job specs — know both).
- **Test order:** real screen reader → keyboard-only → axe/Lighthouse; axe alone is insufficient.
- **Semantic HTML > ARIA:** always prefer native elements; ARIA only where semantics cannot be expressed in HTML.
- Notes are bilingual (EN/VI); code examples are EN only.

## CROSS-REFERENCES

- Semantic HTML foundations → `../05-html-css/` (forms, landmark elements, heading hierarchy).
- Deep-dive accessibility patterns → `../09-advanced-topics/accessibility/` (senior-level).
- FE system design must include a11y requirements → `../08-fe-system-design/` (component API design, design systems).
- Testing tooling (axe-core, jest-axe) → `../../14-frontend-testing.md`.

## ANTI-PATTERNS

- ❌ `<div role="button">` — use `<button>` instead; native semantics are free.
- ❌ Recommending ARIA as the first solution — it's the last resort, not the default.
- ❌ Claiming "a11y-compliant" because axe shows 0 violations — axe catches ~30–40% of real issues.
- ❌ Shipping UI changes without a keyboard-only walkthrough (Tab / Shift+Tab / Enter / Escape / Arrow keys).
- ❌ Conflating visual focus ring removal (`:focus { outline: none }`) with "cleaner UI" — always provide visible focus indicators.
