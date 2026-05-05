# AI-Augmented Engineering — Phỏng Vấn Kỹ Sư Thời AI Coding Assistant

> **Track**: Shared (FE + BE) | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Updated**: 2026 | **See also**: [Table of Contents](../00-table-of-contents.md), [AI System Design](../shared/06-ai-and-agents/06-ai-system-design.md), [Senior Engineer in AI Era](./10-senior-engineer-ai-era.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Stripe (2026, thực tế):** Một engineer dùng Cursor + Claude Code để ship payment retry logic mới trong 2 ngày — code review của senior phát hiện rằng AI-generated retry không có **idempotency key** đúng cách, dẫn đến nguy cơ double-charge khi network jitter. Bug không bị catch bởi tests vì AI cũng generate luôn tests theo cùng giả định sai. Sau incident, Stripe ban hành quy tắc: **"AI viết được, nhưng human phải hiểu mọi dòng đủ để defend trong post-mortem"**. Hiring bar cũng đổi: thay vì hỏi "code function X trên whiteboard", interview hỏi "đây là PR do AI sinh — review nó, tìm 5 vấn đề".

**Bài học:** AI coding assistants không thay thế kỹ sư — nó **thay đổi kỹ năng cần thiết**. 2026 interview kiểm tra: (1) khả năng prompt/context engineer, (2) judgment khi nào tin AI khi nào không, (3) review chất lượng code AI sinh, (4) debug khi AI dẫn lạc đường.

---

## What & Why / Cái Gì & Tại Sao

**Analogy:** AI coding assistant giống như một **thực tập sinh siêu nhanh nhưng thiếu kinh nghiệm production**: gõ code 100x nhanh hơn bạn, nhớ syntax mọi ngôn ngữ, nhưng không biết hệ thống của công ty bạn, không hiểu tradeoff bạn đã thảo luận tuần trước, và đôi khi tự tin sai. Senior engineer thời AI là **tech lead của thực tập sinh đó** — phải biết delegate đúng việc, review đúng chỗ, và chịu trách nhiệm cuối cùng.

**Why it matters:** Đến 2026, ~76% engineers (Stack Overflow Survey 2025) dùng AI coding tool hàng ngày. Top companies (Google, Stripe, Vercel, Anthropic, Shopify) đã thay đổi interview: ít focus vào "có thể type out code không", nhiều hơn vào "có thể work with AI hiệu quả không". Không hiểu AI-augmented workflow = mất 50% productivity vs. peer + fail interview ở mid-senior level.

---

## 1. AI-Augmented Workflow Spectrum / Phổ Hợp Tác Với AI

> 🧠 **Memory Hook:** Nhớ **"TASC"** — **T**ab-complete (Copilot), **A**sk (chat), **S**uggest (cursor agent), **C**omplete-task (autonomous agent). Càng đi xa hơn → human ít can thiệp hơn → risk càng cao → review càng quan trọng.

**Tại sao tồn tại? / Why does this exist?**

Trước 2022, AI trong dev chỉ là autocomplete syntax (IntelliSense). Sau ChatGPT/Copilot, AI có thể hiểu intent và sinh function/file/PR hoàn chỉnh.
→ **Why?** LLM đủ mạnh để hiểu context code (codebase, comments, naming) → output không còn là "guess next token" mà là "synthesize plausible solution".
→ **Why?** Không phải mọi task cần cùng level autonomy — tab-complete cho boilerplate, autonomous agent cho refactor lớn — nên cần **spectrum** thay vì on/off.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng bạn xây nhà. Bạn có thể: (1) tự đóng từng cái đinh — chậm, full control; (2) thuê thợ phụ đóng theo chỉ dẫn — nhanh hơn nhưng phải kiểm tra; (3) thuê đội thi công xây cả phòng — nhanh nhất nhưng nếu sai thì đập làm lại tốn nhiều. AI tools cũng có 4 mức tự chủ tương tự — chọn sai mức = lãng phí hoặc rủi ro.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
SPECTRUM OF AI AUTONOMY (2026)

Level 0: Tab Completion           Level 1: Chat-Assisted
─────────────────────────         ─────────────────────────
Tool: Copilot, Codeium            Tool: ChatGPT, Claude
Trigger: typing                   Trigger: ask question
Scope: 1-10 lines                 Scope: function/file
Review: visual scan               Review: copy-paste, test
Risk: low                         Risk: medium

Level 2: Inline Agent             Level 3: Autonomous Agent
─────────────────────────         ─────────────────────────
Tool: Cursor Agent, Cody          Tool: Devin, OpenCode, Claude Code
Trigger: highlight + cmd-K        Trigger: "implement feature X"
Scope: multi-file refactor        Scope: full PR, multi-hour task
Review: diff review               Review: PR review + manual test
Risk: medium-high                 Risk: high (needs guardrails)

      ┌──────────────────────────────────────────┐
      │  TASK SUITABILITY MATRIX                 │
      │                                          │
      │              │ L0 │ L1 │ L2 │ L3         │
      │  Boilerplate │ ✅ │ ✅ │ ⚠️ │ ❌          │
      │  Algorithm   │ ⚠️ │ ✅ │ ✅ │ ⚠️          │
      │  Refactor    │ ❌ │ ⚠️ │ ✅ │ ✅          │
      │  Bug fix     │ ❌ │ ✅ │ ✅ │ ⚠️          │
      │  Security    │ ❌ │ ⚠️ │ ❌ │ ❌          │
      │  Architecture│ ❌ │ ⚠️ │ ❌ │ ❌          │
      └──────────────────────────────────────────┘
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- L3 (autonomous) tiêu cost cao + chạy ~10 phút/task — không phù hợp cho task < 5 phút manual
- L0/L1 dễ dẫn đến **"AI muscle memory loss"** — junior dev mất khả năng viết code không có AI
- L2/L3 không thấy được trong **air-gapped/regulated env** (banking, defense) — vẫn phải code thủ công
- AI nhớ context hạn chế (~200k tokens 2026) — codebase >1M LOC vẫn cần human architecture
- Một số code AI sinh có **license contamination** (training data từ GPL repos) — enterprise cần policy

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                | Tại sao sai                                                       | Đúng là                                                           |
| -------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| Dùng autonomous agent cho mọi task     | Cost cao, latency cao, hard to review — không phù hợp task nhỏ    | Match autonomy level với task complexity (matrix ở trên)          |
| Accept Copilot suggestion mù quáng     | Suggestion có thể đúng syntax nhưng sai business logic / security | Always read suggestion trước khi Tab; reject nếu không hiểu       |
| Chat với AI mà không cho context       | AI guess intent → output generic, không match codebase convention | Dùng @file/@folder mention; paste related code; nói rõ constraint |
| Không version-control AI conversations | Mất reasoning trace → không reproduce được decision sau 3 tháng   | Save key prompts vào `.cursor/prompts/` hoặc PR description       |
| Skip tests vì "AI test rồi"            | AI test cùng assumption sai như code → false confidence           | Human review test cases độc lập; chạy mutation testing            |

**🎯 Interview Pattern:**

- Khi thấy: câu hỏi "how do you use AI coding tools" hoặc "show me your Copilot workflow" hoặc PR review task
- Nhớ đến: TASC spectrum + task-suitability matrix + judgment bar ("would I defend this in post-mortem?")
- Mở đầu: "I match autonomy level to task risk: tab-complete for boilerplate, chat for unfamiliar APIs, inline agent for refactors I can review diff, but never autonomous agent for security-critical or architecture decisions. Every AI output goes through the same code review bar as human PR — I have to understand it before merging."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [LLM & Transformers](../shared/06-ai-and-agents/02-llm-and-transformers.md), [Code Review](../shared/05-software-engineering/05-code-quality-and-review.md)
- ➡️ Để hiểu tiếp: [Context Engineering](#3-context-engineering--ngh%E1%BB%87-thu%E1%BA%ADt-cung-c%E1%BA%A5p-context), [AI Code Review](#5-reviewing-ai-generated-code--review-code-do-ai-sinh)

### 🟢 Q: What are the 4 levels of AI coding autonomy and when to use each? `[Junior]`

**A:** TASC spectrum: **Tab-complete, Ask, Suggest (inline), Complete-task (autonomous)**.

- **L0 Tab (Copilot):** boilerplate, repetitive syntax, getter/setter — review = visual scan.
- **L1 Ask (ChatGPT/Claude chat):** unfamiliar API, debug error, learn concept — review = copy-paste + test.
- **L2 Inline agent (Cursor cmd-K):** refactor file, rename across module, generate test suite — review = diff review.
- **L3 Autonomous (Devin/Claude Code):** full PR, multi-file feature — review = treat as junior dev's PR.
- **Strong signal:** mention judgment of when NOT to use AI (security, novel architecture, regulated env).
- **Weak signal:** "I just use Copilot for everything" — shows no risk awareness.

### 🟡 Q: Your team adopts Cursor agent. Walk me through your workflow on a new feature ticket. `[Mid]`

**A:** Workflow 5 bước:

1. **Read ticket + explore code manually** trước khi prompt AI — tôi cần own the mental model, không để AI define problem.
2. **Write a brief design doc** (3-5 lines): goal, constraints, files affected, test strategy. Paste vào agent context.
3. **Use inline agent for scaffolding** (L2): generate file structure, types, function signatures. Review diff, reject parts không match convention.
4. **Implement core logic with chat** (L1): chia thành sub-questions, ask per piece. Tôi viết tests trước, AI implement to pass.
5. **Manual review + adversarial thinking:** chạy linter, type-check, edge-case tests. Hỏi "what would break this?" — bug nullability, race condition, error path AI hay miss.

- **Commit message + PR description:** ghi rõ "AI-assisted" + key prompts. Reviewer biết phần nào cần soi kỹ hơn.

### 🔴 Q: How do you prevent "AI muscle memory loss" in your team while maximizing productivity? `[Senior]`

**A:** Đây là **organizational/cultural problem**, không phải tool problem. Approach 4 hướng:

- **Hiring bar:** interview vẫn test core CS (algorithms, system design) **without AI** — đảm bảo dev có foundation, không chỉ là "AI proxy".
- **Pairing rotation:** mỗi sprint có 1 ngày "no-AI Friday" cho complex tasks — buộc dev exercise muscle.
- **AI literacy training:** workshop định kỳ về **prompt engineering, context engineering, evals** — treat AI như tool kỹ thuật, không phải magic.
- **Promotion rubric:** L4+ (senior) phải demonstrate **judgment** (when to override AI, architecture taste) không chỉ throughput. L3 (mid) có thể lean nhiều hơn vào AI cho velocity.
- **Knowledge artifacts:** mọi major decision phải có ADR (Architecture Decision Record) viết bởi human — AI có thể draft nhưng human own reasoning.
- **Anti-pattern to fight:** "AI cargo cult" — adopt tool vì hype, không có metrics. Track DORA metrics + bug escape rate before/after AI adoption.

---

## 2. Prompt Engineering for Coding / Prompt Engineering Cho Lập Trình

> 🧠 **Memory Hook:** Prompt code = **"GRRRC"**: **G**oal (mục tiêu rõ), **R**ole (xưng vai trò), **R**eference (paste code/docs), **R**estriction (constraint), **C**heck (acceptance criteria). Thiếu bước nào → output lệch hướng.

**Tại sao tồn tại? / Why does this exist?**

LLM là probabilistic — cùng input có thể ra output khác nhau, và output phụ thuộc nặng vào framing. Code có **semantics nghiêm ngặt** — sai 1 ký tự = bug. Nên prompt cho code khác prompt cho creative writing.
→ **Why?** Codebase mỗi nơi có convention riêng (naming, architecture, test framework). AI không tự biết — phải được dạy qua context.
→ **Why?** Sai prompt → AI confidently sinh code sai (hallucination) → tốn time review/debug nhiều hơn tự code.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Prompt cho AI giống như brief cho freelancer trên Fiverr: nếu bạn nói "design a logo", bạn nhận được logo random; nếu bạn nói "design a minimalist logo for a coffee shop named 'Bean & Code', target audience: tech workers, color palette: brown + dark green, must work in 16x16 favicon", bạn nhận được logo dùng được. Code prompt cũng vậy — specificity quyết định 80% chất lượng.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
GRRRC PROMPT TEMPLATE
─────────────────────

Goal:        "Implement rate limiter for /api/login endpoint"
Role:        "You are a senior backend engineer at a payment company"
Reference:   @express-middleware.ts @redis-client.ts
             [paste existing rate limiter for /api/signup]
Restriction: - Use sliding window algorithm
             - Redis as backing store
             - Must be idempotent on retry
             - No new dependencies
Check:       - Returns 429 with Retry-After header
             - Unit test covers: under limit, at limit, over limit, redis-down
             - p99 latency < 5ms

WEAK PROMPT vs STRONG PROMPT
─────────────────────────────

❌ "write rate limiter"
   → AI guesses: which framework? algorithm? storage?
   → Output: generic in-memory token bucket, won't work in cluster

✅ "Implement Express middleware rateLimitLogin() using sliding-window
   with Redis (see @redis-client.ts). 5 requests/min per IP. Return 429
   with Retry-After header. Match the style of rateLimitSignup() in
   @signup-middleware.ts. Add tests in __tests__/."
   → AI has: framework, algo, storage, limits, error format, style ref, test loc
   → Output: matches codebase convention, fewer review iterations
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Context window limit** (~200k tokens 2026): không thể paste entire codebase. Phải curate: relevant files + interfaces + test examples.
- **Prompt injection risk:** nếu paste user input vào prompt, attacker có thể hijack instructions. Sanitize hoặc dùng structured input.
- **Over-specification:** prompt quá chi tiết → AI mất khả năng suggest improvement (e.g., better algorithm). Balance prescription vs exploration.
- **Token cost:** dài prompt = $$$. Cho task lặp lại, build prompt template + fill-in variables.
- **Non-deterministic:** chạy lại cùng prompt → output khác. Set `temperature=0` cho code-gen task; cao hơn cho brainstorm.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                           | Tại sao sai                                                         | Đúng là                                                                  |
| --------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Prompt 1 dòng "fix bug X"         | AI không có context → guess solution → fix sai                      | Paste error log + relevant code + steps to reproduce + expected behavior |
| Không paste codebase convention   | Output dùng style khác (camelCase vs snake_case, async vs callback) | Paste 1 example file as style reference                                  |
| Hỏi câu hỏi mở "best way to do X" | Nhận philosophical answer, không actionable                         | Hỏi "given constraints A,B,C, recommend implementation"                  |
| Trust output mà không verify      | Hallucination: AI sinh API method không tồn tại                     | Run code; check imports; type-check; test                                |
| Một prompt làm 5 việc             | Output dài, mỗi phần qualité giảm                                   | Chia nhỏ: 1 prompt = 1 deliverable                                       |

**🎯 Interview Pattern:**

- Khi thấy: live-coding với AI cho phép, hoặc câu "show me how you prompt for X"
- Nhớ đến: GRRRC framework + acceptance criteria first
- Mở đầu: "I structure prompts with Goal-Role-Reference-Restriction-Check. Before writing code, I clarify acceptance criteria — that becomes both my prompt and my test cases. I paste relevant code as style reference, not just describe it."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [LLM & Transformers](../shared/06-ai-and-agents/02-llm-and-transformers.md)
- ➡️ Để hiểu tiếp: [Context Engineering](#3-context-engineering--ngh%E1%BB%87-thu%E1%BA%ADt-cung-c%E1%BA%A5p-context)

### 🟢 Q: What is the GRRRC prompt template? `[Junior]`

**A:** GRRRC = **Goal, Role, Reference, Restriction, Check**.

- **Goal:** what to build, in 1 sentence.
- **Role:** persona AI should adopt (senior backend, security engineer, etc.) — sets quality bar.
- **Reference:** paste/mention existing code, docs, examples for style consistency.
- **Restriction:** constraints (no new deps, must be idempotent, lang version).
- **Check:** acceptance criteria + test scenarios.
- Following this template gives AI enough context to produce **review-ready** code, not just plausible code.

### 🟡 Q: How do you handle prompts when the codebase exceeds AI context window? `[Mid]`

**A:** 4 strategies:

1. **Curate context:** chỉ paste relevant files + interfaces. Dùng tool như `aider` repo map để generate compressed code summary.
2. **Use code-aware tools:** Cursor/OpenCode index codebase + retrieve relevant chunks per query (RAG over code).
3. **Hierarchical decomposition:** chia task thành sub-tasks fits trong context. Mỗi sub-task có own context window.
4. **Knowledge artifacts:** maintain `ARCHITECTURE.md`, `CONVENTIONS.md`, `GLOSSARY.md` — paste these as constant context. Cheaper than re-explaining.

- **Trade-off:** more curation = better output but more prep time. For long codebases, invest in good repo structure + AGENTS.md/CLAUDE.md files.

### 🔴 Q: Design a prompt versioning + evaluation system for your team's AI workflows. `[Senior]`

**A:** Treat prompts như code: version-control + evaluation pipeline.

- **Versioning:** store prompts in `prompts/` directory, semver each (e.g., `code-review-v1.2.md`). Reference via ID, not inline strings. Same review bar as code.
- **Evaluation harness:** for each prompt, define **golden dataset** (10-50 input-output pairs from real PRs). Run prompt against dataset, score output (LLM-as-judge or heuristic).
- **Metrics:** accuracy (does output match golden?), token cost, latency, defect rate (% prompts producing buggy code).
- **A/B testing:** when promoting v1.2 → v2.0, run both in shadow mode for 1 week, compare metrics. Roll back if regression.
- **Observability:** log every prompt + output + cost in OpenTelemetry. Alert on cost spikes or accuracy drops.
- **Drift detection:** model providers update underlying LLM (GPT-4 → GPT-4-turbo) silently — re-run eval suite weekly.
- **Tooling:** PromptLayer, LangSmith, Helicone, or build internal. For team-critical prompts (PR review bot, on-call summarizer), this infrastructure pays off.

---

## 3. Context Engineering / Nghệ Thuật Cung Cấp Context

> 🧠 **Memory Hook:** Context engineering = **"5 lớp context"**: System (rules), Project (codebase shape), Task (immediate goal), Example (style), Working memory (recent decisions). Thiếu lớp nào → AI mò mẫm.

**Tại sao tồn tại? / Why does this exist?**

Prompt = câu hỏi cụ thể; context = toàn bộ thông tin bao quanh giúp LLM hiểu prompt đúng cách. Đến 2026, **context engineering** vượt **prompt engineering** thành kỹ năng quan trọng nhất khi work với AI.
→ **Why?** LLM stateless — mỗi request là independent. Phải tự bootstrap mọi thứ AI cần biết.
→ **Why?** Tốt context = ít prompt iteration, ít hallucination, output match team convention. Cùng model, cùng prompt, khác context → khác chất lượng output 10x.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng bạn thuê freelancer remote. Họ có IQ 200 nhưng chưa biết gì về công ty bạn. Bạn có thể: (1) trả lời câu hỏi mỗi ngày — chậm; hoặc (2) gửi onboarding pack: org chart, codebase guide, design doc, example PRs — họ làm việc độc lập tốt hơn nhiều. Context engineering là **xây onboarding pack cho AI**, mỗi conversation.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
5 LAYERS OF CONTEXT (2026 mental model)
────────────────────────────────────────

┌───────────────────────────────────────────────┐
│ Layer 5: Working Memory (this conversation)   │  ← Recent decisions, errors, user feedback
├───────────────────────────────────────────────┤
│ Layer 4: Example (style + patterns)           │  ← Few-shot examples, similar PRs
├───────────────────────────────────────────────┤
│ Layer 3: Task (immediate goal)                │  ← Ticket, acceptance criteria
├───────────────────────────────────────────────┤
│ Layer 2: Project (codebase shape)             │  ← AGENTS.md, ARCHITECTURE.md, deps
├───────────────────────────────────────────────┤
│ Layer 1: System (rules + persona)             │  ← System prompt, coding standards
└───────────────────────────────────────────────┘

REAL EXAMPLE: Cursor agent doing PR review
──────────────────────────────────────────

L1: System prompt   = "You are a senior code reviewer focused on security"
L2: Project context = AGENTS.md + .cursor/rules/ + repo file tree
L3: Task            = "Review PR #1234, focus on auth changes"
L4: Examples        = 3 past PR reviews with comments (good + bad)
L5: Working memory  = Reviewer's notes from prior comments in this PR

Result: review feels like senior teammate, not generic linter
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Context layers **compete for tokens** — more L4 examples = less L5 working memory. Budget consciously.
- **Context decay:** trong long conversation, model "forget" early instructions. Re-state critical rules every ~10 turns.
- **Conflicting layers:** L1 says "use TypeScript strict", L2 codebase has `any` everywhere. AI confused. Resolve in system prompt explicitly.
- **Context poisoning:** nếu AI sai 1 lần, output sai có thể stay trong context và affect subsequent turns. Reset conversation khi detect.
- **Tool descriptions count:** mỗi tool definition tiêu ~500 tokens. Quá nhiều tool → less room for actual work.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                 | Tại sao sai                                         | Đúng là                                                              |
| --------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------- |
| Chỉ care prompt, ignore project context | AI không biết codebase convention → output generic  | Setup AGENTS.md/CLAUDE.md trong repo root cho mọi conversation       |
| Paste cả file 5000 dòng cho 1 fix       | Tốn tokens + dilute attention → output quality giảm | Paste only relevant function + interfaces; reference rest by import  |
| Không dùng few-shot examples            | AI guess style → output không consistent            | Show 1-2 example "input → output" pairs trước task thật              |
| Forget Layer 5 khi switch task          | Context cũ leak vào task mới → confused output      | Start fresh conversation OR explicit reset: "ignore previous, now X" |
| Define 20 tools nhưng dùng 3            | Token waste + AI có thể chọn wrong tool             | Curate tools per task; lazy-load definitions                         |

**🎯 Interview Pattern:**

- Khi thấy: "how do you make AI consistent across team" hoặc "your AI output is inconsistent"
- Nhớ đến: 5-layer context model, AGENTS.md/CLAUDE.md as project layer
- Mở đầu: "Output quality is 80% context, 20% prompt. I structure context in 5 layers — system rules, project shape (AGENTS.md), task spec, examples, working memory. Most consistency issues come from missing Layer 2; investing in repo-level context files pays back compounding."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Prompt Engineering](#2-prompt-engineering-for-coding--prompt-engineering-cho-l%E1%BA%ADp-tr%C3%ACnh)
- ➡️ Để hiểu tiếp: [RAG & Embeddings](../shared/06-ai-and-agents/04-rag-and-embeddings.md), [Reviewing AI code](#5-reviewing-ai-generated-code--review-code-do-ai-sinh)

### 🟢 Q: What is `AGENTS.md` / `CLAUDE.md` and why does it matter? `[Junior]`

**A:** Repo-level markdown file convention (2025-2026) chứa **persistent context** AI tools đọc tự động cho mọi session.

- Nội dung: tech stack, architecture summary, coding conventions, common gotchas, test/build commands, deployment process.
- Tools support: Claude Code, Cursor, OpenCode, GitHub Copilot Workspace.
- **Why important:** mỗi conversation không phải re-explain project. AI output match team convention from turn 1.
- **Strong signal:** mention specific sections (commands, conventions, gotchas) + maintenance discipline (review quarterly).
- **Weak signal:** "I just write `README.md`" — `AGENTS.md` is for AI consumption, different optimization.

### 🟡 Q: How do you balance context tokens between examples and current task? `[Mid]`

**A:** Token budget là zero-sum — chia thành 4 buckets:

1. **System + tool definitions:** 5-15% (fixed overhead). Curate tools per task để giảm.
2. **Project context (AGENTS.md + relevant code):** 20-40%. Use compression: paste interfaces over impls, summaries over full text.
3. **Task spec + examples:** 10-30%. Few-shot 2-3 examples là sweet spot; nhiều hơn diminishing returns.
4. **Working memory + AI output:** 30-50%. Reserve room for multi-turn refinement.

- **Heuristic:** for novel task, lean on examples (more L4); for repeat task, lean on project context (more L2). Monitor token usage in tool — adjust if hitting >80% context limit.

### 🔴 Q: Design a context strategy for an AI agent doing autonomous code migration across 200+ files. `[Senior]`

**A:** Naive approach (paste all files) fails — context overflow. Real strategy:

- **Phase 1 — Indexing (offline):** build searchable index of codebase. Store: file paths, AST summaries, dependency graph, test coverage map. Use embeddings for semantic search + grep for exact match.
- **Phase 2 — Migration plan (one-shot):** agent reads ARCHITECTURE.md + sample 5-10 representative files → produces migration plan as DAG of file groups. Human approves plan.
- **Phase 3 — Per-group execution:**
  - Load only files in current group + their direct dependencies into context.
  - Provide `read_file`, `write_file`, `run_tests`, `grep` tools — agent retrieves more on demand.
  - After each group, **commit + run tests** before moving to next group (checkpoint).
- **Phase 4 — Memory management:** persist learnings ("we changed pattern X to Y in module Z") to **scratchpad file** read at start of each group. Prevents drift.
- **Phase 5 — Verification:** agent generates migration report (files changed, tests run, manual review needed). Human reviews report, not every diff.
- **Guardrails:** budget per group (max tokens, max tool calls). Halt + escalate on test failure. No direct push to main — open PR per group.
- **Real example:** Vercel did Pages Router → App Router migration on internal apps using this pattern with Claude. Time: weeks of human work → hours of agent + 1 day human review.

---

## 4. AI in Live Coding Interview / Sử Dụng AI Trong Phỏng Vấn Live Coding

> 🧠 **Memory Hook:** Interview với AI = **"DTAR"** — **D**isclose use, **T**hink aloud, **A**udit output, **R**eflect on tradeoffs. Quên bước nào → bị nghi cargo-cult.

**Tại sao tồn tại? / Why does this exist?**

2026: nhiều companies (Stripe, Vercel, Shopify, Anthropic) cho phép — even encourage — dùng AI trong interview. Nhưng evaluator không đánh giá "code có chạy không" mà đánh giá **"engineer dùng AI có hiệu quả + có judgment không"**.
→ **Why?** Reality of work changed → interview phải reflect work environment thật.
→ **Why?** Engineers thiếu judgment → ship buggy AI-code → cost lớn. Hire phải filter người có judgment.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Như thi lái xe được dùng GPS: examiner không quan tâm bạn nhớ đường không, mà bạn có biết GPS đang dẫn vào đường cấm và override không, có tự lái được khi GPS hết pin không. Interview AI cũng vậy — không phải "AI làm được không", mà "bạn judgment có tốt không khi AI sai".

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
INTERVIEW EVALUATION RUBRIC (Vercel/Anthropic style 2026)
─────────────────────────────────────────────────────────

Dimension              | Weight | What evaluator looks for
───────────────────────|────────|──────────────────────────────────
Problem decomposition  |  25%   | Did you understand problem before prompting?
                       |        | Did you ask clarifying questions?
AI collaboration       |  25%   | Quality of prompts (GRRRC)
                       |        | When you trusted vs overrode AI
Code quality + review  |  20%   | Did you read AI output critically?
                       |        | Caught bugs/edge cases AI missed?
Communication          |  15%   | Think-aloud reasoning
                       |        | Disclosed AI use openly
Tradeoff analysis      |  15%   | Discussed alternatives, perf, security
                       |        | Knew what AI doesn't know

GREEN FLAGS                          RED FLAGS
───────────────────────────────────  ────────────────────────────────────
"Let me first understand X..."       Paste problem → Tab Tab Tab → submit
"AI suggested Y, but it doesn't      "It works, ship it"
 handle edge case Z, let me fix"
"I'd verify this with a test for..."  Can't explain own code when asked
"Tradeoff: simpler vs more perf..."   "AI said it's the best way"
"In production I'd add monitoring"    No mention of failure modes
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Some companies (Google, Citadel, Jane Street) **still ban AI** — practice fundamentals enough to interview both ways.
- **Take-home interviews:** AI use blurs the signal. Companies countering with onsite verification round.
- **Model differences:** practicing with GPT-4 then interviewing with Claude → different ergonomics. Be tool-agnostic.
- **Latency anxiety:** AI thinking 30s feels long in 60-min interview. Practice parallel work (write tests while AI generates impl).
- **Prompt injection in interview prompts:** rare but possible — questions might contain instructions to confuse your AI. Read problems with skeptical eye.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                         | Tại sao sai                                     | Đúng là                                                              |
| ----------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| Paste problem statement, accept first AI output | Shows no judgment, no problem understanding     | Read problem, ask clarifying Qs, decompose, then prompt              |
| Hide AI use from interviewer                    | Caught = instant reject. Honesty signal matters | Disclose openly: "I'll use Cursor for the boilerplate, then..."      |
| Can't explain code AI generated                 | Fails "would I defend in post-mortem" test      | Read every line, think aloud about why, refactor if don't understand |
| Skip tests because "AI works"                   | Same assumption bug → silent failures           | Write tests yourself OR review AI tests independently                |
| No tradeoff discussion                          | Looks like cargo-cult coder                     | Always discuss: alternatives, perf, security, when this would break  |

**🎯 Interview Pattern:**

- Khi thấy: live coding round with AI tool allowed
- Nhớ đến: DTAR (Disclose, Think aloud, Audit, Reflect) + evaluation rubric
- Mở đầu: "I'll start by clarifying the problem and constraints, then decompose before prompting. I'll use [tool] for [specific subtask] but verify outputs against tests I write. Let me know if you'd prefer I narrate prompts aloud."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Prompt Engineering](#2-prompt-engineering-for-coding--prompt-engineering-cho-l%E1%BA%ADp-tr%C3%ACnh)
- ➡️ Để hiểu tiếp: [Reviewing AI Code](#5-reviewing-ai-generated-code--review-code-do-ai-sinh), [Senior in AI Era](./10-senior-engineer-ai-era.md)

### 🟢 Q: Should you disclose AI use in an interview? `[Junior]`

**A:** **Yes, always disclose** — preferably proactively at start.

- "I'd like to use Cursor/ChatGPT for parts of this — is that okay with your interview policy?"
- Companies allowing AI: explicit signal. Companies banning: don't try to sneak.
- **Honesty signal** is itself evaluated — hiding/lying = instant reject at most companies.
- If unsure of policy: ask first 30 seconds; default to no AI if unclear.
- **Strong signal:** shows professional norm awareness + integrity.
- **Weak signal:** secretly Tab-completing while pretending to think.

### 🟡 Q: An interviewer gives a problem, you have 45 min and AI tools allowed. Walk through your first 10 minutes. `[Mid]`

**A:** First 10 min = **understand + plan**, NOT code.

1. **Min 0-2:** Read problem twice. Identify ambiguities.
2. **Min 2-5:** Ask clarifying questions out loud — input format, edge cases, scale (10 items vs 10M), latency requirements, error handling expectations.
3. **Min 5-7:** Sketch approach on paper/whiteboard — data structures, algorithm choice, complexity. Discuss tradeoffs verbally.
4. **Min 7-9:** Decompose into 3-5 sub-tasks. Decide: which I'll code by hand (core logic), which I'll prompt AI (boilerplate, tests).
5. **Min 9-10:** Set up code skeleton — file structure, function signatures, type definitions. This serves as my prompt scaffold.

- **Only at min 10+** do I start prompting AI for first sub-task. By then, interviewer sees clear thinking, not desperate prompting.

### 🔴 Q: How would you design an evaluation rubric for AI-allowed coding interviews at your company? `[Senior]`

**A:** Goal: signal **judgment + collaboration**, NOT typing speed. 5 dimensions, weighted:

1. **Problem decomposition (25%):** Did candidate clarify before coding? Decompose into sub-tasks? Identify edge cases? Score 1-5.
2. **AI collaboration quality (25%):** Prompt structure (GRRRC), iteration efficiency, when overrode AI, when accepted. Recorded prompts reviewed.
3. **Code quality + review (20%):** Did candidate read AI output critically? Catch bugs? Refactor for readability? Add tests? Score on PR-quality.
4. **Communication (15%):** Think-aloud reasoning, disclosed AI use, explained tradeoffs.
5. **Production thinking (15%):** Discussed monitoring, failure modes, security, scalability.

- **Calibration:** 3 interviewers per candidate, scores aggregated. Quarterly review of rubric vs hire performance.
- **Anti-cheat:** screen recording, follow-up "explain this code" question, on-site verification round for take-home.
- **Counter-balance:** still maintain 1 interview round **without AI** for fundamentals (algorithms, system design).
- **Iterate:** measure correlation between scores and 1-year on-job performance. Adjust weights.

---

## 5. Reviewing AI-Generated Code / Review Code Do AI Sinh

> 🧠 **Memory Hook:** Review AI code = **"SHIELD"** — **S**ecurity, **H**allucination, **I**diom match, **E**dge cases, **L**ogic, **D**ependency. Skip checklist → ship bug.

**Tại sao tồn tại? / Why does this exist?**

AI code looks plausible nhưng có failure modes khác human code: hallucinated APIs, subtle off-by-one, copy-paste from training data with bugs, security oversights. Reviewing AI code requires **different mental checklist** than reviewing human code.
→ **Why?** Human code reflects developer mental model — review tests "did they think correctly?". AI code is statistical pattern match — review tests "did patterns hold for THIS case?".
→ **Why?** AI doesn't surface uncertainty by default. Confidently wrong output = highest risk. Reviewer must be **adversarial reader**.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Review code AI giống review bài essay viết bởi học sinh thông minh nhưng dễ bịa đặt nguồn: chữ đẹp, ngữ pháp chuẩn, lập luận trôi chảy — nhưng đôi khi citation là sách không tồn tại, fact là số liệu sai. Phải kiểm tra fact, không chỉ form.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
SHIELD CHECKLIST FOR AI CODE REVIEW
────────────────────────────────────

S - SECURITY
  □ Input validation? SQL/command injection?
  □ Auth checks present?
  □ Secrets not hardcoded?
  □ Crypto: correct algorithm, not deprecated?
  □ Race conditions in shared state?

H - HALLUCINATION
  □ All imported APIs exist? (run import resolution)
  □ Function signatures match docs? (verify with type-check)
  □ Library versions compatible with installed?
  □ Made-up config keys / env vars?

I - IDIOM MATCH
  □ Naming convention matches codebase?
  □ Error handling pattern consistent?
  □ Logging style consistent?
  □ Uses team's preferred libraries?

E - EDGE CASES
  □ Null / undefined / empty inputs?
  □ Boundary values (0, max, negative)?
  □ Concurrent calls / race conditions?
  □ Network failures / timeouts?
  □ Large inputs (memory blow up)?

L - LOGIC
  □ Reads sequentially without surprise?
  □ No dead code / unreachable branches?
  □ Complexity matches expectation?
  □ Tests cover happy + sad path?

D - DEPENDENCY
  □ New deps justified? (don't add lib for 5-line problem)
  □ License compatible?
  □ Active maintenance? (last commit < 6 months)
  □ Vulnerability scan clean?

REAL FAILURE PATTERNS (collected from 2024-2025 incidents)
──────────────────────────────────────────────────────────

Pattern 1: "Phantom API"
  AI calls db.upsert() — method doesn't exist on this ORM.
  Catches at runtime, not type-check (dynamic language).

Pattern 2: "Wrong default"
  AI uses bcrypt.hash(pw, 10) — older default.
  Team standard is 12 (security policy).

Pattern 3: "Missing error path"
  AI handles success case beautifully.
  No catch on async call → unhandled rejection in prod.

Pattern 4: "Test mirrors impl"
  AI writes test using same wrong assumption as impl.
  Test passes, prod fails.

Pattern 5: "Innocuous dep"
  AI imports `left-pad` for trim(). Adds maintenance + supply chain risk.
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Review fatigue:** if 80% of PRs are AI-generated, reviewers stop reading carefully. Counter with tooling (auto-flag AI PRs for extra check).
- **AI reviewing AI:** tools like Greptile, CodeRabbit use AI for review. Helpful for low-level checks but **don't substitute human judgment** on architecture.
- **Speed/quality tradeoff:** SHIELD review takes 30+ min for non-trivial PR. Time-boxed reviews skip checks → bugs ship.
- **False sense of security:** type-check + tests pass ≠ correct. Logic bugs slip through. Need critical reading.
- **Trust gradient:** code touching $$$ flows (payments, auth) needs deeper review than internal admin tools.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                           | Tại sao sai                                                   | Đúng là                                                       |
| --------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| Review AI code same as human code | Misses AI-specific failure modes (hallucination, idiom drift) | Use SHIELD checklist explicitly; spend more time on H + E     |
| Trust because tests pass          | Tests by AI mirror AI bugs                                    | Add adversarial tests yourself; use mutation testing          |
| Skip review on small AI PRs       | Small change can break critical path                          | Risk-based review: small auth change = full review            |
| Use AI to review AI               | Compounds same blind spots                                    | Use AI for L0 checks (typos, lint); human for L1+ judgment    |
| Don't track AI-attributed bugs    | Can't improve workflow without data                           | Tag bugs with `ai-assisted` label; analyze patterns quarterly |

**🎯 Interview Pattern:**

- Khi thấy: "review this PR" exercise, especially noted "AI-generated"
- Nhớ đến: SHIELD checklist + adversarial reading mindset
- Mở đầu: "For AI-generated code I add specific checks beyond normal review: hallucinated APIs, idiom drift from our codebase, and edge cases AI tends to miss like null handling and concurrent access. Let me walk through SHIELD: Security, Hallucination, Idiom, Edge cases, Logic, Dependency."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Code Review](../shared/05-software-engineering/05-code-quality-and-review.md), [Security Fundamentals](../shared/04-security/01-security-fundamentals.md)
- ➡️ Để hiểu tiếp: [AI Production Challenges](../shared/06-ai-and-agents/07-ai-production-challenges.md)

### 🟢 Q: What are 3 failure modes specific to AI-generated code? `[Junior]`

**A:** Three common patterns:

1. **API Hallucination:** AI invents method/function that doesn't exist on the library. Looks plausible, fails at import or runtime.
2. **Idiom Drift:** Code style doesn't match team convention (camelCase vs snake_case, async pattern, error handling). Reviewable but creates cognitive load over time.
3. **Edge Case Blindness:** Happy path coded well, error/null/concurrent paths often missing or wrong. Tests written by AI mirror these gaps.

- Mitigation: SHIELD checklist + adversarial review + own tests independent of AI tests.

### 🟡 Q: You receive a PR labeled "AI-assisted". What additional checks do you run beyond normal review? `[Mid]`

**A:** SHIELD checklist with extra weight on H (Hallucination) + E (Edge cases):

1. **Run imports resolution** — verify all imported symbols exist (catches phantom APIs).
2. **Type-check strict mode** — `tsc --noEmit --strict` or equivalent.
3. **Read tests adversarially** — if tests pass, ask "what assumptions are tests sharing with impl?". Add property-based tests.
4. **Grep for team-banned patterns** — `eval`, `setTimeout(fn, 0)`, manual SQL string concat, etc.
5. **Check dependency diff** — any new packages added? License? Maintainer? Vulnerability?
6. **Behavioral diff vs description** — does PR title/description match what code does? AI sometimes overshoots scope.
7. **Run mutation testing** on critical changes — verifies tests catch real bugs, not just present.

- Tooling: configure CI to auto-run these for PRs with `ai-assisted` label.

### 🔴 Q: Design a code review process for a 50-person team where 80% of PRs use AI assistance. `[Senior]`

**A:** Goal: scale review without burnout, maintain quality bar.

- **Tiered review:**
  - **Tier 1 (auto):** lint, type-check, security scan, dep audit, mutation testing — must pass before human review.
  - **Tier 2 (AI reviewer):** Greptile/CodeRabbit comments on style, common bugs, missing tests — non-blocking suggestions.
  - **Tier 3 (peer review):** required human reviewer focuses on architecture, business logic, security implications. Skip lint/style nits (handled by Tier 1).
  - **Tier 4 (senior review):** required for PRs touching auth, payments, infra, or > 500 LOC.
- **PR template:** mandatory fields — `AI-assisted: Y/N`, prompts used, tests added, security considerations. Forces author reflection.
- **Risk-based depth:** internal tool change = Tier 1+2 sufficient; payment flow = all 4 tiers.
- **Reviewer load tracking:** dashboard showing review time per dev, bug-escape rate per reviewer. Rotate reviewers to avoid hotspots.
- **Feedback loop:** monthly review of bugs that escaped to prod, tag root cause (AI-generated? missed in review? testing gap?). Update SHIELD checklist + AI tooling configs.
- **Culture:** celebrate finding bugs in AI code, not penalize. "Caught a hallucinated API in PR #X" = recognition.
- **Metrics:** time-to-review p50/p95, bug escape rate, reviewer NPS, PR cycle time. Watch for degradation when AI adoption grows.

---

## 6. Anti-Patterns & Risk Management / Anti-Patterns Và Quản Lý Rủi Ro

> 🧠 **Memory Hook:** Anti-pattern AI = **"4 cám dỗ chết người"**: Velocity-blind (chỉ care speed), Trust-default (tin AI trước), Skill-decay (mất foundation), Cargo-cult (adopt vì hype). Mỗi cái = career trap.

**Tại sao tồn tại? / Why does this exist?**

AI tools tạo **short-term wins** (ship feature nhanh) nhưng **long-term costs** (skill atrophy, tech debt, audit failures). Senior engineers phải biết spot anti-patterns trong bản thân + team.
→ **Why?** Reward systems (sprint velocity, story points) reward short-term, ignore long-term costs.
→ **Why?** Without explicit anti-pattern awareness, teams slowly degrade engineering culture without noticing. By the time symptoms visible (junior can't debug, prod incidents spike), recovery takes years.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

AI tool như xe ga so với xe đạp: nhanh hơn nhiều, nhưng nếu suốt ngày đi xe ga, cơ bắp teo dần — đến khi xe hỏng giữa đường, bạn không đạp xe được nữa. Senior engineer phải biết khi nào đi xe ga (deadline gấp) và khi nào đạp xe (giữ skill).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
4 ANTI-PATTERNS WITH WARNING SIGNS
───────────────────────────────────

1. VELOCITY-BLIND
   Symptom: PR velocity ↑ 3x, but bug escape rate ↑ 2x
   Cause: Optimizing for ship speed, ignoring quality signals
   Fix: Add quality KPIs (escape rate, MTTR) alongside velocity

2. TRUST-DEFAULT
   Symptom: "AI said so" appears in code reviews / discussions
   Cause: Outsourcing judgment to AI, abdicating responsibility
   Fix: "Why" questions for every AI suggestion; cite reasoning, not tool

3. SKILL-DECAY
   Symptom: Devs can't debug without AI; pair programming with no AI feels paralyzing
   Cause: Over-reliance, no deliberate practice without AI
   Fix: No-AI Friday, fundamentals interview rotations, mentoring loops

4. CARGO-CULT
   Symptom: Tools adopted because "everyone uses Cursor", no measurement
   Cause: FOMO + vendor marketing + no evaluation framework
   Fix: Pilot with metrics; A/B test; kill if no value

DETECTION DASHBOARD
───────────────────

Metric                     | Healthy    | Warning    | Critical
───────────────────────────|────────────|────────────|───────────
PR velocity (PRs/dev/wk)   | 3-5        | > 8        | > 12
Bug escape to prod (%)     | < 5%       | 5-10%      | > 10%
Time to debug (no AI)      | -          | 2x slower  | 5x slower
PR review depth (comments) | 3-5/PR     | 1-2/PR     | 0-1/PR
Architecture decisions     | doc'd ADR  | verbal     | "AI suggested"
Test coverage trend        | flat/up    | slow drop  | fast drop
Junior promotion rate      | normal     | slowed     | stalled
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Survivorship bias:** vendors cite success stories; rarely hear about teams that adopted AI poorly. Demand evidence.
- **Reverse anti-pattern:** **AI-aversion** equally bad — refusing AI = 2x slower than peers, fails interview.
- **Org politics:** anti-patterns easier to spot in others. Self-audit harder. External coaching helps.
- **Generational divide:** juniors hired post-2023 may have NEVER coded without AI heavily — skill foundation question.
- **Recovery cost:** teams in critical zone take 6-12 months to recover. Prevention > recovery.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                              | Tại sao sai                                            | Đúng là                                                                  |
| ------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------ |
| "AI tools mean we can hire less"     | False — need MORE senior judgment to manage AI work    | Hire mix: more seniors for review, mid for execution, juniors for growth |
| Track only velocity post-AI adoption | Misses quality regression                              | Track velocity AND quality (escape rate, MTTR, NPS)                      |
| Ban AI entirely after one incident   | Throws baby with bathwater                             | Root-cause incident; add specific guardrails (e.g., no AI for crypto)    |
| Adopt every new AI tool              | Tool fatigue + integration tax                         | Pilot with clear hypothesis + kill criteria (3 months)                   |
| Assume AI replaces design review     | Architecture decisions need human accountability + ADR | AI drafts ADR; humans approve. Same for security review                  |

**🎯 Interview Pattern:**

- Khi thấy: "How has AI changed your team?" or "What concerns you about AI tools?"
- Nhớ đến: 4 anti-patterns + dashboard metrics
- Mở đầu: "AI is a force multiplier — both for productivity and for anti-patterns. The 4 I watch for: velocity-blind decision making, trust-default to AI, skill atrophy in juniors, and cargo-cult adoption. We measure with both velocity AND quality KPIs (escape rate, MTTR) so the tradeoffs are visible."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Project Management](../shared/05-software-engineering/06-project-management.md), [L5 Competencies](../shared/08-l5-competencies/00-l5-self-assessment.md)
- ➡️ Để hiểu tiếp: [Senior in AI Era](./10-senior-engineer-ai-era.md)

### 🟢 Q: Name 3 anti-patterns of AI tool adoption in engineering teams. `[Junior]`

**A:** Three high-frequency anti-patterns:

1. **Velocity-blind:** chasing PR throughput, ignoring quality (bug escape, MTTR rise).
2. **Trust-default:** developers say "AI said so" instead of reasoning. Abdication of judgment.
3. **Skill-decay:** juniors hired with AI, never built foundation; can't debug or design without it.

- Bonus: cargo-cult (adopting because hype, no measurement).

### 🟡 Q: How do you measure if AI tools are net-positive for your team? `[Mid]`

**A:** Track **balanced scorecard**, both leading and lagging indicators:

- **Velocity (leading):** PRs/dev/week, story points per sprint, time to first commit on new project.
- **Quality (lagging):** bug escape rate, MTTR, customer-reported bugs, security incidents, p99 latency regressions.
- **Cost:** AI API spend per dev, tool subscriptions, training time.
- **Skill health:** junior promotion velocity, no-AI debug time, code review depth (comments per PR), ADR completion rate.
- **Sentiment:** dev NPS for AI tools, surveyed quarterly.
- **Decision rule:** velocity gain > 30% AND quality stable AND cost < 5% of dev TC. If quality drops > 10% with velocity gain, halt expansion until root-caused.
- Use existing observability (DORA + custom). Resist vanity metrics like "AI suggestions accepted %".

### 🔴 Q: Your CTO wants to mandate AI tools company-wide based on competitor PR. How do you respond as engineering lead? `[Senior]`

**A:** Push back with **structured proposal**, not flat refusal. Key moves:

1. **Acknowledge pressure:** "Agreed AI is strategic. Question is HOW to adopt for sustained gain, not whether."
2. **Propose pilot:** 3-team pilot, 3 months, with clear hypothesis: "AI tools will improve velocity by 30% with no quality regression."
3. **Define metrics upfront:** baseline existing dashboards; success = velocity ↑ ≥ 20% AND quality ≥ baseline AND dev NPS ≥ 4/5.
4. **Risk register:** identify failure modes (skill decay, security leaks via prompt injection, license contamination, vendor lock-in). Mitigations for each.
5. **Governance proposal:** AI usage policy (no AI for X), prompt versioning, code review checklist, training program. Treat as new SDLC stage.
6. **Recommendation tiers:** L0 (mandatory tools — Copilot, type-check assist), L1 (encouraged, opt-in), L2 (sandbox only, requires approval).
7. **Compare to peers:** show competitor data (e.g., GitHub Octoverse, Stack Overflow Survey) — reality is mixed, not pure positive.
8. **Close with shared goal:** "We can hit AI strategic goal AND avoid 6-12 month recovery from bad adoption. Pilot tells us how."

- This shows: business savvy + engineering judgment + risk management = senior+ behavior.

---

## 🎯 Block C — Real-World Study Cases

### Study Case 1: Stripe's "AI-Defensible Code" Policy (2026)

**Scenario:** After payment retry incident (described in Real-World Scenario), Stripe instituted policy: every PR author must be able to defend every line in a 5-minute walkthrough with senior reviewer. AI-assisted PRs flagged with `ai-attributed` label, randomly sampled 20% for deep audit.

**Outcomes after 6 months:**

- AI-attributed bugs in production dropped 60%.
- PR cycle time increased 15% (acceptable tradeoff).
- Engineer NPS for AI tools rose (less anxiety about quality).
- 12 engineers found unable to defend their AI code → moved to mentorship plan.

**Lesson:** Process > policy. "Defensibility" is concrete, measurable, fair. Avoids both AI-aversion and AI-overreliance.

### Study Case 2: Vercel's Pages-to-App-Router Migration (2025-2026)

**Scenario:** Vercel migrated 50+ internal apps from Pages Router to App Router. Manual estimate: 3 quarters. Used Claude Code in autonomous mode with custom guardrails.

**Approach:**

- Built migration agent with: file index, dependency graph, test runner tool, git tool.
- Per-app phases: analyze → plan → execute → test → PR.
- Human review at each PR — agent never merged directly.
- Scratchpad memory for learnings shared across apps.

**Outcomes:**

- Migration completed in 2 sprints (12x speedup).
- Caught 4 patterns agent kept getting wrong (server actions in client components) → added to system prompt → fixed for remaining apps.
- 3 incidents post-deploy (1.5% rate) — within historical norm for human migration.

**Lesson:** Autonomous agents work for **scoped, repetitive transformations** with strong test coverage. Don't apply pattern to greenfield design.

### Study Case 3: Anthropic Internal Hiring (2026)

**Scenario:** Anthropic redesigned coding interview to allow Claude usage. Goal: hire engineers who collaborate well with AI, not those who avoid it.

**New format:**

- 60 min, 2-part problem: implement + extend feature.
- Candidate uses Claude (or any AI). Screen recorded, prompts logged.
- Evaluator scores on 5-dim rubric (decomposition, collaboration, code quality, comm, production thinking).
- One additional 45-min round: NO AI, fundamentals only.

**Findings after 1 year:**

- New format more predictive of on-job performance than old whiteboard.
- Candidates who only used AI well but failed no-AI round had higher on-call incident rate.
- Candidates who used AI poorly (e.g., paste-accept-submit) self-selected out.

**Lesson:** Both AI fluency AND fundamentals matter. Interview must test both.

---

## 📋 Interview Q&A Summary

| #   | Question                                                     | Difficulty | Core Concept              | Key Signal                                         |
| --- | ------------------------------------------------------------ | ---------- | ------------------------- | -------------------------------------------------- |
| 1   | 4 levels of AI coding autonomy and when to use               | 🟢 Junior  | TASC spectrum             | Match autonomy to task risk; know when NOT to use  |
| 2   | Workflow on new feature ticket using Cursor agent            | 🟡 Mid     | AI-augmented SDLC         | Read+plan first, AI for scaffold, human for review |
| 3   | Prevent AI muscle memory loss while maximizing productivity  | 🔴 Senior  | Org culture + AI          | Hiring bar, training, ADRs, no-AI Friday           |
| 4   | GRRRC prompt template explanation                            | 🟢 Junior  | Prompt structure          | Goal-Role-Reference-Restriction-Check              |
| 5   | Handle prompts when codebase exceeds context window          | 🟡 Mid     | Context curation          | Index, RAG, hierarchical decomp, AGENTS.md         |
| 6   | Design prompt versioning + evaluation system                 | 🔴 Senior  | LLMOps                    | Version-control, eval harness, A/B, observability  |
| 7   | What is AGENTS.md/CLAUDE.md and why it matters               | 🟢 Junior  | Project context           | Persistent context, team consistency               |
| 8   | Balance context tokens between examples and task             | 🟡 Mid     | Token budget              | 4-bucket allocation, novel vs repeat tradeoff      |
| 9   | Context strategy for autonomous code migration of 200+ files | 🔴 Senior  | Agent context engineering | Index, plan, per-group execution, scratchpad       |
| 10  | Should you disclose AI use in interview                      | 🟢 Junior  | Interview ethics          | Always disclose, professional norm                 |
| 11  | First 10 min of AI-allowed live coding interview             | 🟡 Mid     | Interview strategy        | Understand+plan first, code at min 10+             |
| 12  | Design AI-allowed interview rubric                           | 🔴 Senior  | Hiring signal             | 5-dim weighted, anti-cheat, calibration            |
| 13  | 3 failure modes specific to AI code                          | 🟢 Junior  | AI failure patterns       | Hallucination, idiom drift, edge case blindness    |
| 14  | Additional checks for AI-assisted PR                         | 🟡 Mid     | SHIELD review             | Type-check strict, mutation test, dep audit, etc.  |
| 15  | Code review process for 50-person team, 80% AI PRs           | 🔴 Senior  | Org-scale review          | Tiered review, risk-based depth, metrics, culture  |
| 16  | 3 anti-patterns of AI adoption                               | 🟢 Junior  | Anti-patterns             | Velocity-blind, trust-default, skill-decay         |
| 17  | Measure if AI tools are net-positive                         | 🟡 Mid     | KPIs + balanced scorecard | Velocity, quality, cost, skill health, sentiment   |
| 18  | Respond to CTO mandating AI tools company-wide               | 🔴 Senior  | Leadership + judgment     | Pilot, metrics, governance, tiers, risk register   |

---

## ⚡ Cold Call Simulation / Mô Phỏng Trả Lời Chớp Nhoáng

**Q:** "How has AI changed how you work as an engineer?"

**4-sentence 30-second answer:**

> "AI shifted my time from typing code to reviewing intent and verifying outputs. I match autonomy to task: tab-complete for boilerplate, chat for unfamiliar APIs, inline agents for refactors I can review by diff, but never autonomous for security or novel architecture. The bigger shift is upstream — I invest more in context engineering: project-level AGENTS.md files, GRRRC-style prompts, and SHIELD review checklists for AI-generated code. The skill that matters most now is judgment about when to trust the output, not the typing speed."

**Follow-up nếu interviewer hỏi tiếp:**

- "Walk me through your last AI-assisted PR" → use STAR + show prompts + caught bugs
- "What's the biggest risk you see?" → skill decay in juniors + over-trusting AI on security-critical code

---

## ✅ Self-Check / Tự Kiểm Tra (Đóng Doc)

**Đóng tài liệu, tự trả lời:**

1. **Retrieval:** Kể tên 4 levels của AI coding autonomy (TASC). Cho 1 ví dụ task phù hợp mỗi level.
2. **Visual:** Vẽ ra task suitability matrix — autonomy level x task type. Đánh dấu ✅/⚠️/❌ cho mỗi cell.
3. **Application:** Bạn được giao implement rate limiter mới. Viết prompt theo GRRRC. Liệt kê 3 SHIELD checks bạn sẽ làm trên output.
4. **Debug:** PR AI-generated test pass nhưng prod báo NullPointerException. Trace 3 hypothesis cho gốc rễ vấn đề.
5. **Teach:** Giải thích cho fresh grad: tại sao "AI nói thế" không bao giờ là valid reason trong code review.

**💬 Feynman Prompt:** Giải thích "context engineering" cho non-coder bằng analogy onboarding nhân viên mới — họ cần 5 lớp thông tin gì, mỗi lớp ví dụ thực tế là gì.

---

## 🔁 Spaced Repetition Schedule / Lịch Ôn Tập

| Lần | Khi nào | Trọng tâm                                                                              |
| --- | ------- | -------------------------------------------------------------------------------------- |
| 1   | Day 0   | Đọc full file, làm Self-Check                                                          |
| 2   | Day 3   | Review TASC spectrum + GRRRC + SHIELD. Practice prompt cho 1 task thật                 |
| 3   | Day 7   | Review 4 anti-patterns + study cases. Review last week's AI-assisted PRs adversarially |
| 4   | Day 14  | Mock interview: AI-allowed live coding, 45 min. Self-grade theo rubric                 |
| 5   | Day 30  | Apply context engineering — write AGENTS.md cho 1 project; measure output quality      |

---

## 🔗 Connections / Liên Kết

**Same track (2026 trends):**

- [LLM System Design](./02-llm-system-design.md) — building products that USE LLMs
- [AI Agent Evaluation](./09-ai-agent-evaluation-production.md) — eval frameworks
- [Senior Engineer in AI Era](./10-senior-engineer-ai-era.md) — judgment + leadership

**Cross-track:**

- [LLM & Transformers](../shared/06-ai-and-agents/02-llm-and-transformers.md) — how AI works under hood
- [Agent Patterns](../shared/06-ai-and-agents/03-agent-patterns.md) — when AI tools become products
- [Code Quality & Review](../shared/05-software-engineering/05-code-quality-and-review.md) — review fundamentals
- [L5 Self-Assessment](../shared/08-l5-competencies/00-l5-self-assessment.md) — senior+ judgment dimension
- [Behavioral STAR](../shared/09-behavioral/01-star-method.md) — narrating AI workflow in interview

---

**Last Updated:** 2026 | **Format:** Bilingual EN+VI | Phase 2 Pedagogical Treatment Complete
