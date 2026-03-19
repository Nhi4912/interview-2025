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

---

## Gap Tracking

Current content gaps: `docs/specs/knowledge-generation-process.md` → "Current Content Gaps" section
