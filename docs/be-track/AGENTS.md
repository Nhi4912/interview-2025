# BE-TRACK KNOWLEDGE BASE

**Generated:** 2026-05-05 | **Commit:** 4e25273 | **Branch:** main

## OVERVIEW

Go Backend interview prep — bilingual (EN/VI) study notes targeting Mid/Senior roles at Zalo (VNG), Grab VN, Axon, Employment Hero, Microsoft, Google. Pure markdown; no code build artifacts.

## STRUCTURE

```
docs/be-track/
├── 00-study-roadmap.md          # Phase-ordered learning path (entry point)
├── 01-golang/                   # Language-level (syntax → advanced patterns)
├── 02-backend-knowledge/        # Systems (API, microservices, networking, MQ, gRPC)
├── 03-database-advanced/        # SQL, indexing, NoSQL, caching
├── 04-be-system-design/         # SD framework + classic/advanced problems + case study
├── 05-company-guide.md          # Per-company interview formats & focus areas
├── 06-devops-infrastructure.md  # Docker / k8s / CI-CD / observability for BE
├── 07-data-and-workflows/       # EMPTY — placeholder, do not populate without plan
├── mindmaps/                    # Visual review sheets per domain (pre-interview cram)
└── payment-service-notes.md     # Manabie payment-service case-study (project-specific)
```

## WHERE TO LOOK

| Task                                | Location                                  |
| ----------------------------------- | ----------------------------------------- |
| Plan study order                    | `00-study-roadmap.md`                     |
| Go language / concurrency questions | `01-golang/`                              |
| API/microservice/distributed Qs     | `02-backend-knowledge/`                   |
| SQL / index / cache Qs              | `03-database-advanced/`                   |
| System-design interview prep        | `04-be-system-design/` (start with `01-`) |
| Company-specific tactics            | `05-company-guide.md`                     |
| DevOps for BE engineers             | `06-devops-infrastructure.md`             |
| Last-minute review                  | `mindmaps/`                               |
| Real-system case study              | `payment-service-notes.md`                |
| Repo-wide TOC                       | `../00-table-of-contents.md`              |

## CONVENTIONS

- **Bilingual content**: every doc mixes EN headings + VI explanations. Keep both — VI is primary audience.
- **File naming**: zero-padded `NN-kebab-case.md` (e.g. `03-concurrency.md`). Numbering = study order within folder.
- **Header metadata** (top of every topic file):
  ```
  > **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
  > **See also**: [Table of Contents](../00-table-of-contents.md)
  ```
- **Difficulty tags inline**: `[Junior]` `[Mid]` `[Senior]` after each Q heading.
- **Q&A format**: `### 🟢/🟡/🔴 Q: ...` followed by `**A:**` block. Color = difficulty.
- **Each subdir has `README.md`** acting as navigation index with file table + study order.
- **Code samples**: Go-only unless topic demands otherwise (SQL, protobuf).

## ANTI-PATTERNS (THIS PROJECT)

- ❌ Don't drop VI text — bilingual is intentional, not legacy.
- ❌ Don't add files to `07-data-and-workflows/` without a roadmap entry first (folder reserved, scope undefined).
- ❌ Don't renumber existing files — links across docs use exact `NN-name.md`.
- ❌ Don't add a new top-level subdir without updating `00-study-roadmap.md` AND repo `00-table-of-contents.md`.
- ❌ Don't duplicate Q&A across folders — cross-link instead (e.g. concurrency lives in `01-golang/03-`, not in backend-knowledge).
- ❌ Don't promote `payment-service-notes.md` content into general docs — it's NDA-adjacent project context.

## UNIQUE STYLES

- **Mindmaps as ASCII/markdown trees** (not images) — grep-friendly for AI context.
- **Company guide is opinionated**: mentions specific companies' tech stacks and interview rounds; treat as living doc — update after real interviews.
- **Roadmap references files outside this folder** (`01-cs-fundamentals/...`) — those live under `docs/shared/` or `docs/`. Do not move them into `be-track/`.

## NOTES

- No build/test commands — pure markdown. Lint via repo-level tools only.
- When extending: add file → update local `README.md` table → update `00-study-roadmap.md` if it changes phase ordering.
- `payment-service-notes.md` is the only "applied" doc; everything else is theory + interview Q&A.
