# AGENTS.md — 05-software-engineering

## OVERVIEW

Engineering practice + process — universally applicable, language-agnostic.
Targets behavioral/system-design rounds where SOLID, architecture patterns, testing principles, and delivery practices come up.

---

## WHERE TO LOOK

| Topic                                                    | File                              |
| -------------------------------------------------------- | --------------------------------- |
| SOLID principles, GoF patterns, Clean Code, OOP design   | `01-solid-and-design-patterns.md` |
| Monolith / microservices / event-driven / hexagonal arch | `02-architecture-styles.md`       |
| Agile / Scrum / Kanban / CI-CD / branching strategies    | `03-sdlc-and-practices.md`        |
| Unit / integration / E2E / TDD / test pyramid / mocking  | `04-testing-theory.md`            |
| PR review checklist / code smells / refactoring tactics  | `05-code-quality-and-review.md`   |
| Estimation / risk identification / stakeholder comms     | `06-project-management.md`        |

---

## CROSS-REFERENCES

- **BE-specific testing** (Go test patterns, benchmarks, pprof) → `../../be-track/01-golang/05-testing-profiling.md`
- **FE testing tools** (Jest/Vitest/RTL/Cypress configs) → `../../fe-track/14-frontend-testing.md`
- **Architecture applied to real systems** (caching, MQ, consensus, CQRS) → `../02-system-design/`
- **Architecture applied to BE services** (design framework, trade-offs) → `../../be-track/04-be-system-design/`
- **L5 ownership signals / execution quality** → `../08-l5-competencies/06-ownership-and-execution.md`
- **L5 quality gates / risk management** → `../08-l5-competencies/07-quality-and-risk.md`

---

## ANTI-PATTERNS

- ❌ Don't add framework-specific testing tooling (Jest config, Vitest setup, testify/ginkgo specifics) here — this dir is language-agnostic theory only; tooling lives in track-specific files.
- ❌ Don't put L5 leadership content into `06-project-management.md` — PM here = process mechanics (estimation, risk, scope); leadership/influence lives in `../08-l5-competencies/`.
- ❌ Don't conflate `02-architecture-styles.md` (pattern catalog: hexagonal, CQRS, event-driven as code-level choices) with `../02-system-design/` (infrastructure primitives: MQ, consensus, replication at system scale).
- ❌ Don't renumber files — be-track and fe-track AGENTS.md files link by exact filename; renumbering breaks cross-refs silently.
- ❌ Don't duplicate SDLC content between `03-sdlc-and-practices.md` and `06-project-management.md` — SDLC = team engineering workflow; PM = delivery ownership, estimation, stakeholder communication.
