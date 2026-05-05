# AGENTS.md — 05-html-css

## OVERVIEW

HTML semantics + full CSS layout stack (Flexbox/Grid/animations/modern features); Microsoft/Axon probe deep here — do not underestimate.

## WHERE TO LOOK

| Topic                                    | File(s)                                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------- |
| HTML semantics, forms, Web APIs          | `00-html5-fundamentals.md`                                                                        |
| ARIA basics (surface only — see warning) | `00-html5-fundamentals.md` §Accessibility                                                         |
| CSS specificity, cascade, box model      | `00-css-fundamentals.md`                                                                          |
| Flexbox + Grid (practical)               | `01-grid-flexbox.md`                                                                              |
| Grid/Flexbox theory, mental models       | `05-css-grid-flexbox-theory.md`                                                                   |
| Positioning, stacking context            | `00-css-fundamentals.md`                                                                          |
| Animations, transitions                  | `06-modern-css-features.md`                                                                       |
| Responsive design, media queries         | `03-responsive-design.md`                                                                         |
| Container queries, custom properties     | `06-modern-css-features.md`                                                                       |
| CSS architecture (BEM, OOCSS, ITCSS)     | `02-css-architecture.md`, `04-css-architecture-comprehensive.md`, `07-css-architecture-theory.md` |
| CSS-in-JS (concept + comparison)         | `09-css-in-js-comparison.md`                                                                      |
| Framework comparison (Tailwind etc.)     | `08-css-framework-comparison.md`                                                                  |

## LOCAL CONVENTIONS

- Grid preferred over Flexbox for 2D layout; floats absent.
- Files bilingual (EN headings + Vietnamese explanation) — scan English headers to navigate fast.
- Duplicate coverage across `02/04/07-css-architecture*` — `04` is most comprehensive.
- Container queries and custom properties treated as production-ready, not experimental.

## CROSS-REFERENCES

- **Deep ARIA / WCAG** → `11-accessibility/` (do not expand here)
- **Rendering perf, paint/layout costs** → `06-browser-performance/`
- **Tailwind, CSS Modules, styled-components in React context** → `03-react/` (overlap with `08/09` here)
- **CSS-in-JS runtime vs zero-runtime trade-offs** → `09-css-in-js-comparison.md` covers concept; framework wiring lives in `03-react/`

## ANTI-PATTERNS

- Do NOT add full WCAG criteria or screen-reader testing guides here — belongs in `11-accessibility/`.
- Do NOT conflate CSS-in-JS _concept_ (this folder) with framework-specific usage (React, Next.js — `03-react/`).
- Do NOT treat `04-css-architecture-comprehensive.md` and `07-css-architecture-theory.md` as non-overlapping — prefer `04` as source of truth, use `07` for theory-only questions.
- `<section>` ≠ generic grouping block — a common interview trap covered in `00-html5-fundamentals.md`.
