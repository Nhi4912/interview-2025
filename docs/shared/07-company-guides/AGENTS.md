# AGENTS.md — 07-company-guides

## OVERVIEW

Per-company interview tactics: round structure, tech stack, what interviewers actually test, real pass/fail anecdotes. Living docs — update after every real interview loop.

## WHERE TO LOOK

| Company         | File                    | Angle                                                                             |
| --------------- | ----------------------- | --------------------------------------------------------------------------------- |
| Google          | `01-google.md`          | Systems / DSA depth + process-first communication ("thesis defense mode")         |
| Microsoft       | `02-microsoft.md`       | Growth-mindset behavioral (STAR + data-driven) + system design                    |
| Grab            | `03-grab.md`            | Production-scale SEA superapp; geospatial / Go; latency-first SD                  |
| Axon            | `04-axon.md`            | Practical distributed systems; take-home / work-sample heavy; reliability mindset |
| Employment Hero | `05-employment-hero.md` | HR-tech / multi-tenant payroll; ownership + async-first culture fit               |
| Zalo / VNG      | `06-zalo-vng.md`        | VN local giant; realtime messaging at 70M+ users; WebSocket / Redis pub-sub depth |

## LOCAL CONVENTIONS

- **Anecdote opener is mandatory** — every file starts with a real candidate pass/fail story (Vietnamese tech context). Keep it verbatim-ish; don't sanitize or genericize.
- **Internal structure per file**: Company Overview → Tech Stack → Round-by-Round Breakdown → Common Questions → Anti-tips. New files must follow this order.
- **Cross-references are role-specific**: sections inside each guide point to `be-track/` or `fe-track/` topics that company emphasizes (e.g., Grab → Go concurrency in be-track; Google → DSA in shared). Don't flatten these into generic pointers.
- **Language**: body text is bilingual (EN heading / VI explanation). Do not remove VI content; it is interview narrative ammunition, not decoration.

## CROSS-REFERENCES

| What you need                            | Where to go                                    | Note                                                       |
| ---------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------- |
| Backend round tactics (all 6 companies)  | `../../be-track/05-company-guide.md`           | Role-specific addendum; covers Go, system design depth     |
| Frontend round tactics (all 6 companies) | `../../fe-track/10-company-guide.md`           | Role-specific addendum; covers React, perf, DOM            |
| Behavioral / LP answer framework         | `../09-behavioral/02-leadership-principles.md` | Use alongside company-specific behavioral Qs in each guide |
| STAR delivery mechanics                  | `../09-behavioral/01-star-method.md`           | Quantified impact + situation framing                      |

> **Key distinction**: be-track and fe-track each own a `company-guide.md` as a role-specific addendum. This folder (`07-company-guides/`) is the role-agnostic master — it holds round structure, culture, and domain knowledge that applies to both tracks.

## ANTI-PATTERNS

- ❌ Don't merge this folder's guides into be-track or fe-track company guides — those are role-specific addenda, not replacements. Master lives here.
- ❌ Don't drop the candidate anecdote opener — it's what differentiates these guides from generic company-info pages.
- ❌ Don't add a new company file here without also creating or updating role-specific entries in `be-track/05-company-guide.md` and `fe-track/10-company-guide.md` if the company is relevant to that track.
- ❌ Don't include current salary or compensation data — goes stale within months; keep it out entirely.
- ❌ Don't renumber existing files — be-track and fe-track AGENTS.md files reference exact `NN-name.md` filenames; renaming silently breaks all downstream links.
