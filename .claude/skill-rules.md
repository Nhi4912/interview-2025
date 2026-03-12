# Skill Rules — Interview Knowledge Base

## Active Skills

### `/discovery-interview`
**Source**: parcadei/continuous-claude-v3
**Trigger when**: User request is vague — "add content on X", "I want to learn Y", "fill in missing content", "create Q&A for Z"
**Purpose**: Transform vague requests into concrete content specs
**Output**: `docs/specs/pending/YYYY-MM-DD-{topic}.spec.md`
**Process**: See `docs/specs/knowledge-generation-process.md` Phase 1

### `/interview-system-designer`
**Source**: alirezarezvani/claude-skills
**Trigger when**: User asks to structure Q&A, design interview questions, calibrate difficulty progression for a topic
**Purpose**: Design the Q&A structure — round-by-round depth, competency map, scoring rubric
**Output**: Annotated spec with Q&A plan
**Process**: See `docs/specs/knowledge-generation-process.md` Phase 3

## Content Rules (always apply)

1. **Never start writing without a spec** — always create `docs/specs/pending/{topic}.spec.md` first
2. **Never write placeholder content** — if you can't write real content yet, leave the spec in pending
3. **Bilingual always** — every section needs EN explanation + VI reinforcement
4. **Standard file header** — Track + Difficulty + See also (see process spec for template)
5. **Review before done** — run Phase 5 checklist before marking complete

## Gap Tracking

Current content gaps: `docs/specs/knowledge-generation-process.md` → "Current Content Gaps" section
