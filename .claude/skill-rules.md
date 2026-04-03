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

## Pedagogical Rules (always apply)

1. **Motivation before definition / Tình huống trước định nghĩa** — Every file starts with a real-world scenario showing WHY this concept matters, before explaining WHAT it is. (Harvard Case Method)

2. **Feynman-first explanations / Giải thích đơn giản trước** — First explanation uses an analogy or metaphor a non-programmer could follow. Technical precision comes in deeper layers. Nếu không giải thích được bằng ngôn ngữ đơn giản, bạn chưa thực sự hiểu khái niệm đó.

3. **Spiral depth / Độ sâu xoắn ốc** — Each core concept has 3 progressive layers:
   - Layer 1 / Tầng 1: Simple analogy (Liên tưởng đơn giản)
   - Layer 2 / Tầng 2: How it works (Cơ chế hoạt động)
   - Layer 3 / Tầng 3: Edge cases & trade-offs (Trường hợp biên & đánh đổi)
   Reader can stop at any layer with a complete mental model for that depth.

4. **Kumon difficulty ordering / Thứ tự tăng dần** — Q&A items progress strictly 🟢→🟡→🔴. Each question builds on understanding from the previous one. Không đặt câu hỏi Senior trước khi Junior đã được giải thích đầy đủ.

5. **Active recall required / Ôn tập chủ động** — Every file ends with a "Self-Check / Tự Kiểm Tra" section: 3-5 checkbox items + 1 "explain in your own words / giải thích bằng lời của bạn" prompt. (Cambridge Supervision)

6. **Concept map for connected topics / Bản đồ khái niệm** — Files with prerequisites include an ASCII diagram showing where this topic fits in the learning path. Giúp người học thấy được bức tranh toàn cảnh trước khi đi vào chi tiết.

7. **No generic overviews / Không dùng text chung chung** — Overview must be specific to the file's topic.
   BANNED: "JavaScript interview prep should be bilingual and practical" or any text that could appear identically in another file.

8. **No duplicate Q&A answers / Không trùng lặp câu trả lời** — If an answer repeats text from another Q&A in the same file, it is invalid. Every answer must be unique and specific to its question.

## Deep Content Rules (apply to Core Concepts + Q&A body)

9.  **Root-cause tracing / Truy Nguyên Gốc Rễ** — Before defining any concept, answer:
    "What problem was being solved when this was invented?" Trace at least 2 levels of
    "why" (e.g., "Why closures? → Because functions need persistent state. Why that?
    → Because global variables cause bugs at scale."). BANNED: starting with a definition.

10. **Dual coding required / Song Mã Bắt Buộc** — Every Core Concept MUST have both:
    - Text explanation (verbal channel)
    - Visual: ASCII diagram, comparison table, or memory sketch (visual channel)
    Research shows 89% better transfer performance vs text-only (Mayer 2009). No exceptions.

11. **Memory hook per concept / Móc Nhớ** — Every Core Concept has ONE of:
    - Killer sentence: "Closure = function + snapshot of its birth environment"
    - Mnemonic/acronym: e.g., "VLETC" for JS declaration types
    - Visual sketch: box diagram, timeline, state machine
    This replaces generic "note:" callouts — must be memorable in isolation.

12. **Common mistakes mandatory / Sai Lầm Bắt Buộc** — Every Core Concept includes:
    ```
    ❌ Sai lầm thường gặp: [the wrong mental model most people have]
    ✅ Đúng là: [correction + one-sentence reason why]
    ```
    Highest-ROI content for interview prep — don't skip it.

13. **Bloom's Level L4-L6 for Senior Q&A** — 🔴 Senior questions MUST reach:
    - L4 Analyze: "Compare X vs Y in production scenario..."
    - L5 Evaluate: "Which approach would you choose for [constraint]? Defend it."
    - L6 Create: "Design a system that solves [problem] using this concept."
    BANNED: 🔴 questions that only ask for definitions or mechanisms.

14. **Interview pattern template / Mẫu Nhận Dạng** — For each core concept, include:
    ```
    🎯 Interview Pattern: [one-line pattern name]
    When you see: [trigger condition in an interview question]
    → Think: [the concept/approach to apply]
    → Answer opens with: "[first 2 sentences of a strong answer]"
    ```

15. **30-second answer structure / Cấu Trúc Trả Lời** — After Q&A summary, add Cold Call section:
    ```
    ⚡ 30-giây mở đầu lý tưởng cho "[hardest question on this topic]":
    1. [Define/confirm scope — 1 sentence]
    2. [State the mechanism — 1 sentence]
    3. [Give concrete example — 1 sentence]
    4. [Mention trade-off or edge case — 1 sentence]
    ```

16. **Knowledge chain explicit / Chuỗi Kiến Thức** — At end of each Core Concept:
    - 📚 Cần biết trước: [prerequisite concept with link]
    - 🔑 Học cái này để hiểu: [next concept with link]
    Makes the learning graph visible and motivates studying the current topic.

17. **Retrieval-based Self-Check / Kiểm Tra Truy Hồi** — Self-Check MUST be true retrieval
    (learner closes doc, writes from memory). BANNED: "Can I explain X?" (passive confirmation).
    REQUIRED: "Write the definition of X from memory, then check." Include at least 1 close-the-doc
    instruction. Add spaced repetition reminder: review in 3 days → 7 days → 14 days.

18. **3-Block Learning Flow / Luồng Học 3 Bước** — Every content file MUST follow this
    top-level structure within Core Concepts:

    **Block A — Theory Foundation / Nền Tảng Lý Thuyết**
    (What it is, why it exists, how it works — Feynman + Spiral layers 1-2-3.
    Học viên xây dựng mental model trước khi gặp câu hỏi phỏng vấn.)

    **Block B — Interview Q&A / Câu Hỏi Phỏng Vấn**
    (🟢→🟡→🔴 progression with Interview Signals per Q&A.
    Chỉ bắt đầu Q&A sau khi lý thuyết đã được giải thích đầy đủ.)

    **Block C — Study Cases / Tình Huống Thực Tế Sâu**
    (1-2 real production scenarios applying the concept — named company,
    what went wrong, what decision was made, what trade-off was accepted.
    Khác với Real-World Scenario đầu file: Block C đi sâu vào kết quả và bài học.)

    Reader builds mental model (A) → tests it verbally (B) → sees it in context (C).
    BANNED: jumping to Q&A before theory is established.
    BANNED: generic "example:" without a named company/system/incident.

## L5 Competency Rules (apply to all new content)

19. **L5 Competency Tagging / Gắn Thẻ Năng Lực L5** — Every content file header MUST include:
    ```
    > **L5 Competencies**: Technical Mastery (20pts), Problem-Solving (15pts)
    ```
    Map to relevant competencies from the L5 framework (10 categories, 100 points total):
    Scope & Impact (15) | Problem-Solving (15) | Technical Mastery (20) |
    Communication (10) | Leadership (10) | Ownership (10) | Quality & Risk (10) |
    Team Multiplier (5) | Behaviour (3) | Business Awareness (2).
    Giúp learner thấy mỗi file đóng góp vào năng lực nào khi phỏng vấn L5.

20. **Cross-Track Linking Mandatory / Liên Kết Chéo Bắt Buộc** — When a file in fe-track or
    be-track covers a topic also relevant to the other track, add at end of file:
    ```
    ## Cross-Track / Liên Kết Chéo
    - 🔗 BE perspective: [related BE file](path)
    - 🔗 FE perspective: [related FE file](path)
    - 🔗 Shared theory: [shared file](path)
    ```
    Giúp learner thấy cùng một concept từ nhiều góc nhìn khác nhau.

21. **LeetCode Integration / Tích Hợp LeetCode** — Every algorithm/data-structure theory file
    MUST end with a "Practice Problems / Bài Tập Thực Hành" table linking ≥3 relevant LeetCode
    problems from `docs/leetcode/`. Every LeetCode category index MUST link back to the relevant
    theory file. Lý thuyết không có bài tập = kiến thức chưa được củng cố.

22. **Follow-up Chain for Senior Q&A / Chuỗi Câu Hỏi Nối Tiếp** — Every 🔴 Senior Q&A MUST
    include a Follow-up Chain: 3 progressively harder questions an interviewer would ask after
    the initial answer. Format:
    ```
    🔗 **Follow-up Chain:**
    1. → "If [constraint changes], how would your answer change?"
    2. → "How would you debug this in production with [limitation]?"
    3. → "Design a system that handles [edge case at scale]."
    ```
    Mô phỏng cách interviewer L5 đào sâu — nếu chỉ trả lời câu đầu thì chưa đủ Senior.

---

## L5 Competency File Format (Hybrid)

Files in `docs/shared/08-l5-competencies/` use a hybrid format (not full technical template):

```markdown
# Title / Tiêu đề

> **Track**: Shared | **L5 Weight**: Xpts/100
> **See also**: [related]

## Real-World Scenario / Tình Huống Thực Tế
{Concrete situation showing why this competency matters at L5}

## Framework / Khung Năng Lực
{Actionable frameworks instead of Core Concept layers}
- Framework name + when to apply
- Step-by-step process
- Visual: comparison table or decision matrix

## Examples / Ví Dụ Thực Tế
{2-3 STAR-format examples}
- Situation → Task → Action → Result
- ✅ Strong signal vs ❌ Weak signal per example

## Anti-patterns / Sai Lầm Thường Gặp
| Anti-pattern | Why it fails | Better approach |

## Q&A Section — Interview Questions
{Same Q&A format: 🟢→🟡→🔴, Interview Signals, Follow-up Chains}

## Self-Check / Tự Kiểm Tra
{Retrieval-based: close doc, write from memory}
```

---

## Gap Tracking

Current content gaps: `docs/specs/knowledge-generation-process.md` → "Current Content Gaps" section

---

## LeetCode Skills

### `/leetcode`

**Trigger when**: User asks to create, improve, or review a LeetCode problem file — e.g., "create Two Sum", "upgrade this problem to v2.0", "add interview script to this file"
**Purpose**: Generate or enhance LeetCode problem files following RULES.md v2.0 (12-section template)
**Template**: `docs/leetcode/RULES.md` Section 7 (Format Template)

**Process**:
1. Check if problem already exists — search `docs/leetcode/` by problem number or name
2. Determine category from signal keywords (see RULES.md Section 2.3)
3. Determine pattern from problem description
4. Generate all 12 sections in exact order from the v2.0 template
5. Fill YAML frontmatter with all 16 fields including `companies`, `target_time_minutes`, `status: "unsolved"`
6. Verify all quality gates before finishing

**Quality gates** (must ALL pass before done):
- Vietnamese analogy is real-life, not a technical restatement
- 🎯 Pattern Trigger has: When you see / Think / Template / Memory hook
- 🗣️ Interview Script has all 5 UMPIRE steps with quoted speech
- ❌ Common Mistakes has ≥ 3 problem-specific entries (not generic advice)
- 📊 Self-Assessment has metrics table + SRS schedule + review log
- ASCII visual diagram shows step-by-step execution with labeled steps
- 2-3 solutions only (brute → optimal), no test harness/class wrappers/exports
- File is 120-250 lines total

**Anti-patterns to enforce** (from RULES.md Section 8):
- No more than 3 solutions
- No `testFunction()`, `performanceComparison()`, `class Wrapper`, `export { ... }`
- No generic common mistakes ("don't forget edge cases")
- No English-only content (bilingual required throughout)

---

### `/leetcode-review`

**Trigger when**: User asks "what should I review today", "SRS check", "show my review queue", or "which problems are due"
**Purpose**: Surface problems due for spaced repetition review based on `srs_dates` in YAML frontmatter and `last_reviewed` field
**Output**: Prioritized review queue for today's study session

**Process**:
1. Scan YAML frontmatter of all problem files in `docs/leetcode/` categories
2. Collect problems where: any date in `srs_dates` <= today AND `status` is `solved` or `needs-review`
3. Sort by: lowest `confidence` first, then oldest `last_reviewed`
4. Group by: Overdue (past due) | Due Today | Coming Soon (next 3 days)
5. Present queue with: problem name, category, pattern, confidence, days overdue

**Output format**:
```
## 📅 SRS Review Queue — {today's date}

### 🔴 Overdue ({n} problems)
| Problem | Category | Pattern | Confidence | Due |
|---------|----------|---------|------------|-----|
| ...     | ...      | ...     | 3/5        | 2 days ago |

### 🟡 Due Today ({n} problems)
...

### 🟢 Coming Soon — Next 3 Days ({n} problems)
...

Total review time estimate: ~{n × 5} minutes
```

**After user completes review**:
- Ask for new confidence score (1-5) for each reviewed problem
- Calculate next SRS date: confidence 1-2 → +1d, confidence 3 → +3d, confidence 4 → +7d, confidence 5 → +14d
- Update `last_reviewed` and `srs_dates` in YAML frontmatter
- Update `status` to `needs-review` if confidence dropped below 3
