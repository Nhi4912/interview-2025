# SPECS — KNOWLEDGE GENERATION PROCESS

**Generated:** 2026-05-05 | Meta-folder: how content gets created

## OVERVIEW

**Process docs**, not study content. Defines the 5-phase pipeline (Discover → Spec → Design → Generate → Review) for adding new knowledge to this repo. Used by AI agents (`/discovery-interview`, `/interview-system-designer` skills) and humans alike.

## STRUCTURE

```
specs/
├── knowledge-generation-process.md          # ⭐ 5-phase pipeline definition (565 lines)
└── pending/
    └── 2026-03-19-pedagogical-full-treatment.md   # Active spec awaiting generation
```

## WHERE TO LOOK

| Intent                             | Read                                                    |
| ---------------------------------- | ------------------------------------------------------- |
| Adding a new topic to the repo     | `knowledge-generation-process.md` (follow all 5 phases) |
| What spec is currently in progress | `pending/*.md`                                          |
| Spec template / format             | `knowledge-generation-process.md` Phase 2 section       |

## CONVENTIONS

- **Spec filename** — `pending/YYYY-MM-DD-{topic-kebab}.spec.md` while active.
- **Lifecycle** — `pending/` → (content generated) → archive or delete the spec; spec is NOT permanent docs.
- **Spec YAML header** — always includes: `topic_request`, `track`, `difficulty_target`, `company_context`, `learner_background`, `urgency`, `gaps_identified` (see process doc).
- **Each phase has a designated skill/command** — listed in process doc; respect that mapping.

## ANTI-PATTERNS

- ❌ Don't put study content here — this folder is META (process about process).
- ❌ Don't skip the spec phase to "just write content" — review checklist depends on it.
- ❌ Don't leave specs in `pending/` after content lands — move/delete to keep folder small.
- ❌ Don't version the process doc by copying — edit in place; git tracks history.

## NOTES

- Process integrates with `/discovery-interview` and `/interview-system-designer` skills (see `.opencode/skill/` if present).
- Repo-wide conventions: `../AGENTS.md`.
