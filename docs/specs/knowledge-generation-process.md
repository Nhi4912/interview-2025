# Knowledge Generation Process / Quy Trình Sinh Nội Dung

> **Purpose**: Specs-driven workflow to systematically grow this knowledge base using AI skills.
> Each piece of content follows the same pipeline: Discover → Spec → Design → Generate → Review.

---

## Overview / Tổng Quan

This repo uses a 5-phase pipeline to add new knowledge content:

```
1. DISCOVER   → /discovery-interview   (find gaps, understand what's needed)
2. SPEC       → content-spec.md        (define exactly what to write)
3. DESIGN     → /interview-system-designer (structure Q&A, difficulty, competency map)
4. GENERATE   → write the content      (follow the standard format)
5. REVIEW     → checklist              (bilingual, difficulty tags, cross-refs)
```

---

## Phase 1: Discover / Khám Phá

**When to trigger**: User says "add content on X", "I want to learn Y", "missing topic Z", or any vague knowledge request.

**Skill to use**: `/discovery-interview`

**What to extract from discovery:**
```yaml
topic_request:       "What exactly do you want to learn?"
track:               shared | fe-track | be-track
difficulty_target:   junior | mid | senior | all
company_context:     google | grab | axon | all
learner_background:  "What do you already know?"
urgency:             "Preparing for interview when?"
gaps_identified:     ["List of specific sub-topics missing"]
```

**Discovery output format** → create `docs/specs/pending/YYYY-MM-DD-{topic}.spec.md`

---

## Phase 2: Content Spec / Đặc Tả Nội Dung

**File**: `docs/specs/pending/{topic}.spec.md`

**Template**:
```markdown
# Content Spec: {Topic Name}

## Identity
- **Topic**: {name}
- **Track**: shared | fe-track | be-track
- **Target file**: `docs/{track}/{section}/{filename}.md`
- **Difficulty**: 🟢 Junior | 🟡 Mid | 🔴 Senior (mark all that apply)
- **Format**: Theory + Q&A | Q&A only | Practice/Coding

## Scope
- **Why needed**: (gap identified in discovery)
- **Audience**: (who is this for — junior dev? senior?)
- **Company relevance**: (Google? Grab? All?)

## Prerequisites
- [ ] `docs/shared/01-cs-fundamentals/...`
- [ ] `docs/fe-track/01-javascript/...`

## Cross-References (bidirectional)
- Must reference: [file that should link TO this]
- Will reference: [files this doc will link FROM]

## Content Outline
### Q&A pairs planned (by difficulty):
- 🟢 Junior: Q1 — {question}
- 🟢 Junior: Q2 — {question}
- 🟡 Mid: Q3 — {question}
- 🟡 Mid: Q4 — {question}
- 🔴 Senior: Q5 — {question}
- 🔴 Senior: Q6 — {question}

## Bilingual Notes
- Key terms to keep in English: [...list technical terms...]
- Sections requiring deeper VI explanation: [...complex concepts...]

## Success Criteria
- [ ] Covers all planned Q&A pairs
- [ ] Each answer has English explanation + Vietnamese reinforcement
- [ ] All difficulty levels represented
- [ ] Added to `docs/00-table-of-contents.md`
- [ ] Cross-references added to related files
```

---

## Phase 3: Design / Thiết Kế

**Skill to use**: `/interview-system-designer` (adapted for knowledge design)

**What to design before writing:**

1. **Competency Map**: What does "knowing this topic" mean at each level?
   ```
   Junior: Can define + basic usage
   Mid: Understands internals + trade-offs
   Senior: Can design systems using this + debug edge cases
   ```

2. **Question Bank Structure** (following interview-system-designer pattern):
   ```
   Round 1 — Foundations:    Define, explain basics, simple code example
   Round 2 — Mechanism:      How it works internally, why it behaves this way
   Round 3 — Trade-offs:     When to use vs. alternative, limitations
   Round 4 — Production:     Real-world debugging, scaling, edge cases
   ```

3. **Company Calibration** (per docs/shared/07-company-guides/):
   ```
   Google:   Focus on algorithmic depth, edge cases, optimization
   Grab:     Focus on SEA-scale production, Go specifics
   Axon:     Focus on practical reliability, mission-critical
   ```

**Design output**: Annotate the spec with confirmed Q&A structure.

---

## Phase 4: Generate / Tạo Nội Dung

**Standard file template** (every content file MUST use this):

```markdown
# {English Title} / {Tiêu đề Tiếng Việt}

> **Track**: {Shared | FE | BE} | **Difficulty**: {🟢 Junior | 🟡 Mid | 🔴 Senior}
> **Prerequisites**: [{topic}]({relative-link})
> **See also**: [{related}]({relative-link}) | [{related}]({relative-link})

---

## Overview / Tổng Quan

{1-3 sentence English summary}

{Giải thích tổng quan bằng tiếng Việt: mục tiêu, vì sao quan trọng với phỏng vấn, trade-off chính cần nhớ}

---

## {Section Name} / {Tên mục tiếng Việt}

### Q: {English question}? / {Câu hỏi tiếng Việt}? 🟢 Junior

**A:** {English answer — clear, concise, with code if essential}

{Giải thích tiếng Việt: nhấn mạnh điểm quan trọng, trade-off, lỗi phổ biến}

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| Question | Level | Key Point |
|----------|-------|-----------|
| {Q1} | 🟢 | {one-liner} |
| {Q2} | 🟡 | {one-liner} |
| {Q3} | 🔴 | {one-liner} |

---

**See also**: [{next topic}]({link}) | [{related}]({link})
```

**Generation rules:**
1. Never write placeholder content ("Tactic 1", "TODO: fill in")
2. Every answer must have both EN explanation + VI reinforcement
3. Code examples only when they clarify — not to pad content
4. Max one code block per Q&A unless demonstrating contrast
5. Vietnamese explanations focus on: WHY it matters + trade-offs + interview tips

---

## Phase 5: Review Checklist / Danh Sách Kiểm Tra

Before marking a spec as done, verify:

```markdown
## Quality Gate

### Format
- [ ] File header has: Track, Difficulty, Prerequisites, See also
- [ ] Title is bilingual: `# English / Tiếng Việt`
- [ ] All H2/H3 section headings are bilingual

### Content Completeness
- [ ] All planned Q&A pairs from spec are written
- [ ] No placeholder content (no "Tactic N", no "TODO", no stub bullets)
- [ ] Code examples are real and runnable (tested mentally)
- [ ] All difficulty levels covered (🟢🟡🔴)

### Bilingual
- [ ] Every Q has both EN and VI phrasing
- [ ] Every A has both EN explanation and VI reinforcement
- [ ] Technical terms kept in English, Vietnamese explanations alongside
- [ ] Company-specific interview tips are bilingual

### Integration
- [ ] File added to `docs/00-table-of-contents.md`
- [ ] Cross-references ADDED to this new file
- [ ] Cross-references UPDATED in related files (bidirectional linking)
- [ ] Spec file moved from `docs/specs/pending/` → `docs/specs/done/`
```

---

## Workflow Triggers / Khi Nào Dùng Gì

| User says... | Action |
|-------------|--------|
| "Add content on {topic}" | → Phase 1: Run `/discovery-interview` |
| "I need to understand {X} for interview" | → Phase 1: Run `/discovery-interview` |
| "Write Q&A about {specific topic}" | → Phase 2: Create spec directly (skip discovery) |
| "Review this content" | → Phase 5: Run review checklist |
| "Design interview questions for {topic}" | → Phase 3: Use `/interview-system-designer` approach |
| "What's missing in the knowledge base?" | → Audit `docs/00-table-of-contents.md` + run gap analysis |

---

## Current Content Gaps / Nội Dung Còn Thiếu

Tracked here so discovery always knows what to prioritize:

### High Priority
- [ ] FE: Frontend Testing (Jest, RTL, Cypress) — no dedicated section
- [x] Shared: Load Balancing theory → `shared/02-system-design/06-load-balancing.md`
- [x] Shared: Message Queues / Event Streaming → `shared/02-system-design/05-message-queues.md`
- [x] BE: gRPC and Protocol Buffers → `be-track/02-backend-knowledge/09-grpc-protobuf.md`
- [ ] FE: Web Performance — Bundle analysis deep dive

### Medium Priority
- [x] Shared: Database — Sharding patterns → `shared/03-database/04-sharding-and-transactions.md`
- [x] Shared: Database — Transaction isolation levels → included in `04-sharding-and-transactions.md`
- [ ] BE: Kubernetes and container orchestration (06-devops is thin)
- [ ] FE: CSS — CSS-in-JS vs CSS Modules vs Tailwind comparison

### Low Priority
- [ ] LeetCode: Add bilingual explanations to problem solutions
- [x] FE: Advanced TypeScript — Mapped Types, Template Literal Types → `fe-track/02-typescript/02-advanced-types.md` (785 lines, comprehensive)
- [ ] Shared: AI — Evaluation and testing AI systems

---

## Example: Full Workflow Run

**User input**: "Add content on Kafka for the backend track"

```
Step 1: /discovery-interview
  → Q: "Is this for Kafka fundamentals or production use?"
  → Q: "Which companies? Grab uses Kafka at scale"
  → Q: "What level — BE junior, mid, or senior?"
  → Output: spec at docs/specs/pending/2026-03-kafka.spec.md

Step 2: Create spec
  → Track: be-track | File: docs/be-track/02-backend-knowledge/08-message-queues.md
  → Difficulty: Mid → Senior
  → Q&A planned: 8 questions, 3 Junior, 3 Mid, 2 Senior

Step 3: Design (interview-system-designer approach)
  → Round 1 Foundation: What is Kafka, why not just a DB queue
  → Round 2 Mechanism: Partitions, offsets, consumer groups
  → Round 3 Trade-offs: Kafka vs RabbitMQ vs Redis streams
  → Round 4 Production: Exactly-once semantics, schema registry

Step 4: Generate
  → Write docs/be-track/02-backend-knowledge/08-message-queues.md
  → Follow standard template, bilingual throughout

Step 5: Review
  → All 8 Q&A written ✓
  → Bilingual ✓
  → Added to TOC ✓
  → Cross-referenced from 03-distributed-systems.md ✓
  → Move spec to docs/specs/done/
```
