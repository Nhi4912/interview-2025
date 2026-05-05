# AGENTS.md — 08-l5-competencies

## OVERVIEW

Senior Engineer (L5) self-assessment + competency rubric. 100-point weighted scoring across 6
competencies (0–4 scale per competency × per-competency weight). Targets candidates evaluating
readiness gap before L5 interview rounds.

## ENTRY POINT

**Always start with `00-l5-self-assessment.md`** — it defines the scoring formula, weight table, and
links every per-competency file. Reading a competency file in isolation loses the rubric context.

## WHERE TO LOOK

| Competency                                              | File                               | Weight  |
| ------------------------------------------------------- | ---------------------------------- | ------- |
| Rubric definition + scoring formula + gap analysis      | `00-l5-self-assessment.md`         | 100 pts |
| Scope of impact, influence radius, end-to-end ownership | `01-scope-and-impact.md`           | 15 pts  |
| Structured thinking: 5-Whys, MECE, first principles     | `02-problem-solving-frameworks.md` | 15 pts  |
| _(slot 03 intentionally absent — see NUMBERING GAP)_    | —                                  | —       |
| Written + verbal + cross-functional communication       | `04-communication.md`              | 10 pts  |
| Mentoring + tech leadership without formal authority    | `05-leadership-and-mentoring.md`   | 10 pts  |
| Project ownership, execution discipline, follow-through | `06-ownership-and-execution.md`    | 10 pts  |
| Quality bar, risk identification, engineering tradeoffs | `07-quality-and-risk.md`           | 10 pts  |

> Weights verified from each file's `> **L5 Weight**` header. Remaining 30 pts are distributed
> across other dimensions defined inside `00-l5-self-assessment.md`.

## NUMBERING GAP

**`03-*.md` is intentionally absent.** The original rubric reserved slot 03 for a competency that
was subsequently rolled into `02-problem-solving-frameworks.md` and `04-communication.md` before
publication. The slot was retired rather than renumbered.

**Do NOT create `03-*.md` or renumber existing files to close the gap.** The rubric table in
`00-l5-self-assessment.md` and all external trackers reference exact filenames. Renaming breaks
those links.

## CROSS-REFERENCES

| Need                                             | Go to                                                      |
| ------------------------------------------------ | ---------------------------------------------------------- |
| Delivering competency answers via STAR structure | `../09-behavioral/01-star-method.md`                       |
| LP-aligned answers (Microsoft / Amazon style)    | `../09-behavioral/02-leadership-principles.md`             |
| Engineering practice context: testing            | `../05-software-engineering/04-testing-theory.md`          |
| Engineering practice context: code quality       | `../05-software-engineering/05-code-quality-and-review.md` |

> Distinction: **08-l5-competencies** = _what_ to demonstrate (rubric + scoring). **09-behavioral**
> = _how_ to deliver it (storytelling technique). Keep them separate.

## ANTI-PATTERNS

- ❌ **Don't fill slot 03** — the gap is intentional; creating `03-*.md` corrupts rubric indexing.
- ❌ **Don't merge this directory with `../09-behavioral/`** — L5 competencies define _what_ is
  scored; behavioral files define _how_ to answer. Different purpose, different audience phase.
- ❌ **Don't change weight percentages in `00-l5-self-assessment.md` in isolation** — every
  per-competency file has a `> **L5 Weight**` header that must stay in sync.
- ❌ **Don't add a new competency file without** (a) expanding the rubric table in
  `00-l5-self-assessment.md`, (b) updating cross-track AGENTS.md in `be-track/` and `fe-track/`
  to reference it, and (c) verifying total weight still sums to 100.
- ❌ **Don't substitute company-specific LP language** (e.g. Amazon "Bias for Action") for the
  generic L5 vocabulary used here — LP-to-L5 mapping lives in `../09-behavioral/02-leadership-principles.md`,
  not in these competency files.
