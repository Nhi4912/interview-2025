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
> **Prerequisites**: [{prior topic}]({relative-link})
> **See also**: [{related}]({relative-link}) | [{related}]({relative-link})

---

## Real-World Scenario / Tình Huống Thực Tế

{Concrete problem that motivates learning this concept. 3-5 sentences. Must answer: "why does this exist?"}
{Tình huống thực tế cụ thể — vấn đề mà learner gặp nếu không biết khái niệm này}

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng:**
{Plain-language Feynman explanation — an analogy a non-programmer could follow}
{Giải thích bằng liên tưởng đơn giản — không cần biết lập trình cũng hiểu được}

{Table, diagram, or bullet points showing key insight}

**Tại sao phải học topic này?**
- {Reason 1: interview frequency / practical impact}
- {Reason 2: connects to X which enables Y}
- {Reason 3: prevents common bugs/mistakes}

---

## Concept Map / Bản Đồ Khái Niệm

```
{ASCII diagram showing:
  [prerequisites] → [THIS TOPIC] → [what it enables]
  Plus key sub-concepts branching from the center}
```

**Bạn đang ở đây trong lộ trình học:**
```
{Learning path: prior concept → [THIS] → next concept}
```

---

## Overview / Tổng Quan

{1-3 sentence English summary — topic-specific, not generic}

{Giải thích tổng quan bằng tiếng Việt: mục tiêu, vì sao quan trọng với phỏng vấn, trade-off chính cần nhớ}

---

## Core Concepts / Khái Niệm Cốt Lõi

### {Concept Name} / {Tên Khái Niệm}

> 🧠 **Memory Hook**: {killer sentence OR mnemonic OR one visual sketch — must be memorable alone}

**Tại sao tồn tại? / Why does this exist?**
{1-2 sentences: what problem was being solved when this concept was invented}
→ **Why?** {Level 2: why was that problem important?}
→ **Why?** {Level 3: what fundamental constraint makes this necessary?}

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản
{Explain to a curious 12-year-old. No jargon. One paragraph max.}

#### Layer 2: How It Works / Cơ Chế Hoạt Động
{Technical: internals, algorithm, data structure involved.}

```
[VISUAL: ASCII diagram, comparison table, or memory sketch — MANDATORY]
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên
{When it breaks, performance limits, version differences, common gotchas.}

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| {wrong mental model} | {reason it's wrong} | {correct understanding} |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: {trigger keywords in the question}
- → Nhớ đến: {this concept/approach}
- → Mở đầu trả lời: *"{strong opening 1-2 sentences}"*

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**
- 📚 Cần biết trước: [{prereq concept}]({link})
- ➡️ Để hiểu tiếp: [{next concept}]({link})

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### Q: {English question}? / {Câu hỏi tiếng Việt}? 🟢 Junior

**A:** {English answer — clear, concise, with code if essential}

{Giải thích tiếng Việt: nhấn mạnh điểm quan trọng, trade-off, lỗi phổ biến}

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: {what a strong candidate includes — specific detail that shows real understanding}
- ❌ Weak: {what a weak candidate says — the surface-level answer that misses the key point}

*(Continue 🟡 Mid then 🔴 Senior — strictly ascending. 🔴 must reach Bloom's L4 Analysis or L5 Evaluation)*

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| Question | Level | Key Point |
|----------|-------|-----------|
| {Q1} | 🟢 | {one-liner} |
| {Q2} | 🟡 | {one-liner} |
| {Q3} | 🔴 | {one-liner} |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"{the single hardest / most common question on this topic}"**

**30 giây đầu — mở đầu lý tưởng / Ideal 30-second opening:**
1. {Scope confirmation + define — 1 sentence}
2. {Core mechanism — 1 sentence}
3. {Concrete example from real production — 1 sentence}
4. {Trade-off or edge case — 1 sentence}

*Sau đó mở rộng theo hướng interviewer dẫn dắt.*

---

## Self-Check / Tự Kiểm Tra ⚡
> **Đóng tài liệu lại trước khi làm — Close the doc before attempting.**

- [ ] **Retrieval**: Viết định nghĩa của {concept} từ trí nhớ, không nhìn lại. So sánh với Layer 2.
- [ ] **Visual**: Vẽ {key diagram} ra giấy từ trí nhớ. So sánh với ASCII diagram trên.
- [ ] **Application**: {Concrete scenario A} vs {Concrete scenario B} — bạn dùng cách nào? Tại sao?
- [ ] **Debug**: {Describe a common bug caused by misunderstanding this concept} — nguyên nhân? Fix?
- [ ] **Teach**: Giải thích {concept} cho người không biết lập trình bằng 1 câu liên tưởng.

💬 **Feynman Prompt:** {Explain [concept] to someone who doesn't code, using [specific analogy from Layer 1]. No jargon allowed.}

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày** để chuyển vào long-term memory.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [{prerequisite}]({link}) — {why it's needed to understand THIS}
- ➡️ **Enables:** [{next topic}]({link}) — {what becomes possible after mastering THIS}
- 🔗 **Applied in:** {framework/language/pattern where this shows up most}
```

**Generation rules:**
1. **Motivation before definition** — file MUST start with Real-World Scenario, not a definition (Harvard Case Method)
2. **Feynman-first** — "What & Why" section uses analogy/metaphor, technical precision comes in Core Concepts
3. **Root-cause tracing** — every Core Concept starts with "Why does this exist?" — 2+ levels of why before defining
4. **Dual coding mandatory** — every Core Concept MUST have both text + visual (ASCII/table/diagram). No exceptions.
5. **Memory hook required** — every Core Concept has a killer sentence, mnemonic, or visual sketch
6. **Spiral depth** — each Core Concept has 3 layers: Analogy → How It Works → Edge Cases
7. **Common mistakes mandatory** — every Core Concept has ❌ wrong model → ✅ correct with reason
8. **Interview pattern** — every Core Concept has 🎯 trigger + concept + opening sentence template
9. **Knowledge chain** — every Core Concept ends with 📚 prereq + ➡️ enables
10. **Kumon ordering** — Q&A items MUST progress 🟢→🟡→🔴, each builds on previous
11. **Bloom's L4-L6 for Senior** — 🔴 questions MUST require Analysis/Evaluation/Creation, not recall
12. **Interview signal** — every Q&A has 💡 ✅ strong answer + ❌ weak answer markers
13. **Cold call simulation** — after Q&A Summary, add ⚡ section with 4-sentence 30-second answer
14. **Retrieval Self-Check** — close-doc instruction + Retrieval/Visual/Application/Debug/Teach items
15. **Spaced repetition** — Self-Check ends with 🔁 3 → 7 → 14 day reminder
16. Never write placeholder content ("Tactic 1", "TODO: fill in")
17. Every answer must have both EN explanation + VI reinforcement
18. Code examples only when they clarify — not to pad content
19. **No generic overviews** — Overview must be specific to the file's topic
20. **No duplicate Q&A answers** — every answer must be unique within the file
21. **3-Block Learning Flow** — Core Concepts section MUST follow: Block A (Theory Foundation) → Block B (Interview Q&A) → Block C (Study Cases). Never start Q&A before theory layers are complete. Study Cases must name a real company/system/incident.
22. **L5 Competency Tagging** — Every file header includes `> **L5 Competencies**: ...` mapping to 10-category L5 framework
23. **Cross-Track Linking** — Files relevant to both FE and BE must include `## Cross-Track / Liên Kết Chéo` section
24. **LeetCode Integration** — Algorithm/DS theory files link ≥3 LeetCode problems; LeetCode indices link back to theory
25. **Follow-up Chain for Senior** — Every 🔴 Senior Q&A includes 3 progressive follow-up questions simulating L5 interviewer probing

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

### Pedagogy — Intro Sections (Phase 1)
- [ ] File starts with Real-World Scenario (not a definition) — Harvard Case Method
- [ ] "What & Why" section uses analogy/metaphor a non-programmer understands — Feynman check
- [ ] Concept Map (ASCII diagram) shows learning path context
- [ ] No generic overview text (test: could this paragraph appear identically in another file?)

### Pedagogy — Deep Content (Phase 2)
- [ ] Each Core Concept has Memory Hook (🧠 killer sentence / mnemonic / visual sketch)
- [ ] Each Core Concept has "Why does this exist?" with 2+ levels of "why" — First Principles
- [ ] Each Core Concept has a visual (ASCII / table / diagram) — Dual Coding mandatory
- [ ] Each Core Concept has Common Mistakes table (❌ wrong model → ✅ correct)
- [ ] Each Core Concept has 🎯 Interview Pattern (trigger → concept → opening sentence)
- [ ] Each Core Concept has 🔑 Knowledge Chain (📚 prereq + ➡️ enables)
- [ ] 🔴 Senior Q&A reaches Bloom's L4-L6 (Analyze/Evaluate/Create — NOT just definitions)
- [ ] Each Q&A has 💡 Interview Signal (✅ strong answer vs ❌ weak answer)
- [ ] Q&A strictly ordered 🟢→🟡→🔴, each builds on previous — Kumon check
- [ ] ⚡ Cold Call Simulation section after Q&A Summary (4-sentence 30-second answer)
- [ ] Self-Check uses retrieval format with close-doc instruction — not passive "can I explain?"
- [ ] Self-Check has Retrieval + Visual + Application + Debug + Teach items
- [ ] 🔁 Spaced repetition reminder (3 → 7 → 14 days)
- [ ] No duplicate Q&A answers within the same file
- [ ] Core Concepts follow 3-Block order: Theory Foundation → Interview Q&A → Study Cases (Rule 21)
- [ ] Study Cases name a real company/system/incident (not generic "example:")

### Bilingual
- [ ] Every Q has both EN and VI phrasing
- [ ] Every A has both EN explanation and VI reinforcement
- [ ] Technical terms kept in English, Vietnamese explanations alongside
- [ ] Company-specific interview tips are bilingual

### L5 Readiness
- [ ] L5 Competency mapping in header: `> **L5 Competencies**: Technical Mastery (20pts), ...` (Rule 19)
- [ ] Cross-track links present if topic is relevant to both FE and BE (Rule 20)
- [ ] LeetCode cross-references for algorithm/data-structure content (Rule 21)
- [ ] 🔴 Senior Q&A includes Follow-up Chain — 3 progressive follow-up questions (Rule 22)
- [ ] ≥1 Study Case involves L5-level decision-making (architectural choice, team-level impact)

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
