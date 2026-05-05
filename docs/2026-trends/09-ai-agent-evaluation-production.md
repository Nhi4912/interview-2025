# 09. AI Agent Evaluation & Production

> **Track**: Shared (AI/ML + Backend) | **Difficulty**: 🟢 Junior → 🔴 Senior
> [← Back to TOC](../00-table-of-contents.md) | [← Previous: Rust for Backend](./08-rust-for-backend-engineers.md) | [Next: Senior in AI Era →](./10-senior-engineer-ai-era.md)

---

## 🌍 Real-World Scenario — Why This Topic Matters

**Intercom Fin AI Agent (2024 → 2025 production lessons).**

Intercom's Fin agent answers ~50% of customer support tickets autonomously. Their public engineering blog (March 2025) and Klarna's testimony at Y Combinator AI Demo Day (Feb 2025) reveal the same hard truth: **shipping an LLM demo takes a weekend; running an LLM agent in production takes an evaluation pipeline**.

Three numbers from Intercom's case study:

- **89%** of regressions in their first 6 months came from prompt edits, **not** model upgrades.
- **$2.1M/year** saved by a regression eval suite that runs on every PR (~12 min, 1,400 golden cases).
- **34% reduction** in hallucinated refund promises after adding LLM-as-judge for "policy adherence" + a deterministic guardrail layer.

Meanwhile, the failures dominate the news cycle:

- **Air Canada chatbot** (Feb 2024): hallucinated bereavement refund policy → tribunal forced payout, set legal precedent.
- **DPD chatbot** (Jan 2024): jailbroken into swearing at customers in 24 hours, shut down within a day.
- **NYC MyCity bot** (March 2024): told business owners to break the law (firing for reporting harassment, taking tips). Still running months later because there was no eval gate.

**The gap is not capability — it's verification.** A senior AI engineer in 2026 is not someone who can prompt; it's someone who can **prove** an agent works before users see it, and **detect** when it stops working after they do.

> 🇻🇳 Khoảng cách giữa "demo chạy được" và "agent chạy production" không phải là model — mà là **evaluation pipeline**. Intercom Fin tiết kiệm $2.1M/năm nhờ regression suite, còn Air Canada/DPD/MyCity mất tiền + uy tín vì thiếu evaluation gate.

---

## A. THEORY (Lý thuyết cốt lõi)

### A1. 🧠 Memory Hook

> **"GETS-G: Goldens, Evals, Traces, Scorecards — Guardrails."**
> _Bạn không thể ship agent nếu thiếu 1 trong 5 chữ này._

Five layers, in order of when you build them:

1. **G**oldens — A frozen test set of inputs + expected behavior (NOT expected text).
2. **E**vals — Automated scorers (deterministic + LLM-as-judge) that run on goldens.
3. **T**races — Per-request capture of inputs, tool calls, intermediate steps, outputs, tokens, latency.
4. **S**corecards — Aggregated dashboards: pass rate, regression delta, cost, P95 latency, hallucination rate.
5. **G**uardrails — Runtime filters that block bad outputs **before** the user sees them (policy, PII, jailbreak, schema).

Mnemonic image: imagine a soccer goalkeeper (Guardrail) standing in front of a goal made of 4 posts (Goldens, Evals, Traces, Scorecards). Miss any post and the ball goes in.

> 🇻🇳 **GETS-G** = Goldens + Evals + Traces + Scorecards + Guardrails. 4 cột + 1 thủ môn. Thiếu cái nào agent cũng "thủng".

---

### A2. ❓ Why does this exist? (2 levels of why)

**Why 1 — Why can't we just write unit tests?**
Because LLM outputs are **non-deterministic, semantic, and open-ended**. `expect(output).toBe("Refund $42")` fails on `"Your refund of $42 has been issued."` even though both are correct. We need scorers that judge **meaning + behavior + policy**, not string equality.

**Why 2 — Why can't we just trust the model + good prompts?**
Because **prompts drift, models update, retrieval rots, users adapt**. Three real failure modes:

- **Prompt drift**: Engineer adds "be concise" → agent stops asking clarifying questions → resolution rate drops 8%.
- **Silent model upgrade**: Vendor swaps `claude-3.5-sonnet` minor version → tool-call format slightly changes → 3% of tool calls fail to parse.
- **Retrieval rot**: New docs added to vector DB → embeddings from 6 months ago return stale chunks → answers cite outdated policy.

Without evals + traces + guardrails, you find out from **angry users on Twitter**, not from a dashboard.

> 🇻🇳 Lý do tồn tại: (1) output non-deterministic nên unit test không đủ; (2) prompt/model/retrieval/user đều drift theo thời gian — không có eval thì phát hiện qua Twitter, không phải dashboard.

---

### A3. 🧒 Layer 1 — Simple Analogy

**Agent evaluation = Restaurant kitchen QA.**

Imagine you run a restaurant chain (Phở 24). Every chef can cook phở, but you need to guarantee **every bowl tastes the same** across 200 stores.

| Restaurant concept                                  | Agent eval equivalent                             |
| --------------------------------------------------- | ------------------------------------------------- |
| **Recipe card** (5g salt, 200ml broth)              | Prompt + tool definitions + system message        |
| **Trained tasters** with checklist                  | Eval scorers (deterministic + LLM-as-judge)       |
| **Sample bowls from each store, daily**             | Golden test set, run on every PR                  |
| **Hidden mystery diners**                           | Online evals on production traffic (sampled)      |
| **Health inspector** rejecting bad food at the pass | Guardrails (block before serving customer)        |
| **Dashboard at HQ**                                 | Scorecards (pass rate, latency, cost per request) |

A new sous chef (engineer) tweaks the recipe ("less salt") → tasters score it → if 5 of 50 sample bowls fail → recipe rejected. **You catch it in the kitchen, not at the customer's table.**

> 🇻🇳 Eval agent = QA bếp Phở 24. Recipe (prompt) + tasters (scorers) + sample bowls (goldens) + mystery diner (online eval) + thanh tra (guardrail) + dashboard. Phát hiện trong bếp, không phải khi khách phàn nàn.

---

### A4. ⚙️ Layer 2 — How It Works (Technical)

**The Agent Eval Stack — 5 layers:**

```
┌──────────────────────────────────────────────────────────────┐
│  USER REQUEST                                                │
└──────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│  L5: GUARDRAILS (input)        ← block jailbreak, PII, abuse │
│      • Llama Guard / Prompt Shield / regex                   │
│      • Schema validators on tool args                        │
└──────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│  L4: AGENT EXECUTION                                         │
│      LLM → Tool → LLM → Tool → ... → Final answer            │
│                                                              │
│  L3: TRACING (passive)                                       │
│      Capture: inputs, every tool call, tokens, latency,      │
│              cost, model version, prompt version, user_id    │
│      Tools: LangSmith / Langfuse / Arize / Honeycomb         │
└──────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│  L5: GUARDRAILS (output)       ← block hallucination, leak   │
│      • LLM-as-judge (policy adherence)                       │
│      • Citation verifier (URL exists in source corpus)       │
│      • PII redactor                                          │
└──────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│  USER RESPONSE                                               │
└──────────────────────────────────────────────────────────────┘

Offline (CI):                       Online (production):
┌──────────────┐                    ┌──────────────────┐
│  L1: GOLDENS │   ──run──►         │  L3: TRACES      │
│  1,400 cases │                    │  100% sampled    │
└──────────────┘                    └──────────────────┘
        │                                   │
        ▼                                   ▼
┌──────────────┐                    ┌──────────────────┐
│  L2: EVALS   │                    │  L2: ONLINE EVAL │
│  scorers run │                    │  (1-10% sampled) │
└──────────────┘                    └──────────────────┘
        │                                   │
        └───────► L4: SCORECARDS ◄──────────┘
                  (Grafana / vendor dashboard)
                  Pass rate, regressions, $/req, P95
```

**The four scorer families:**

| Scorer type                      | Example                                                               | When to use                                       | Cost                     |
| -------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------- | ------------------------ |
| **Deterministic / programmatic** | "Output is valid JSON matching schema X", "contains citation [doc:N]" | Format, structure, must-have keywords             | ~free                    |
| **Reference-based (string)**     | BLEU, ROUGE, exact-match, embedding similarity vs reference           | Translation, summarization with golden answers    | cheap                    |
| **LLM-as-judge**                 | "Score 1-5: is the answer faithful to the retrieved context?"         | Faithfulness, helpfulness, tone, policy adherence | $$ (1 LLM call per case) |
| **Human eval**                   | SME labels 50 cases/week                                              | Calibrating LLM-judge, edge cases, final sign-off | $$$                      |

**Golden set construction (Intercom Fin pattern):**

1. **Seed**: 50 cases hand-written by domain experts covering top intents.
2. **Mine production traces**: sample 200 real conversations, label outcomes.
3. **Adversarial**: 100 cases designed to break the agent (jailbreak, ambiguous, multi-turn flip).
4. **Regression**: every production bug → add a golden that would have caught it.
5. **Versioned**: `goldens/v1.4.2.jsonl` in git, never edit existing cases (only add).

Target sizes: **300–500 cases minimum** for a single-task agent, **1,000+** for a multi-tool customer-facing agent.

**LLM-as-judge calibration (the part everyone gets wrong):**

```python
# WRONG: trust the judge blindly
score = llm_judge("Is this answer correct?", answer, reference)

# RIGHT: calibrate against humans first
# 1. Sample 100 cases, get human labels (ground truth)
# 2. Run 3 candidate judge prompts
# 3. Compute Cohen's kappa between judge and humans
# 4. Pick the judge with κ > 0.7 (substantial agreement)
# 5. Re-calibrate quarterly (model drift)
```

If your judge has κ = 0.3, your "94% pass rate" is meaningless noise. **An uncalibrated judge is worse than no judge** — it gives false confidence.

> 🇻🇳 5 lớp: Goldens (test set) → Evals (scorers) → Traces (capture mọi request) → Scorecards (dashboard) → Guardrails (block input + output). Có 4 loại scorer: deterministic, reference-based, LLM-as-judge, human. **LLM-as-judge phải calibrate với human labels (Cohen's κ > 0.7), nếu không là nhiễu**.

---

### A5. 🔬 Layer 3 — Edge Cases & Production Realities

**1. Multi-turn evaluation is harder than single-turn (10x).**
A single-turn eval scores `(input, output)`. A multi-turn agent needs to score the whole **trajectory**: did it ask the right clarifying question on turn 2? Did it remember the user's name on turn 5? Use **trajectory-level scorers** + per-turn assertions, and stub the user side with a "user simulator LLM" with personas.

**2. Tool-use evaluation needs trace-level checks.**
Don't just check the final answer — check the **path**. Did it call `lookup_order` before `issue_refund`? Did it call `get_customer_tier` (it shouldn't — that's a privacy leak)? Use trace-graph assertions, e.g. `assert trace.tools_called == ["lookup_order", "verify_policy", "issue_refund"]`.

**3. The "looks great in eval, fails in prod" trap.**
Your goldens are static; production users are creative. Mitigation: **online eval sampling** — run LLM-as-judge on 5% of production traces, alert if pass rate drops by >2 points week-over-week.

**4. Cost of evaluation can exceed cost of the agent.**
A 1,400-case golden run with 3 LLM-judge scorers = 4,200 judge calls. At Sonnet pricing (~$3/MTok in, $15/MTok out, ~$0.005/case) ≈ $21/run × 50 PRs/week = $1,050/week just for CI evals. Use **judge model tiering** (Haiku for cheap scorers, Sonnet only for hard ones), and **cache scorer results** by `hash(input, output)` since deterministic scorers are pure.

**5. Guardrails can be jailbroken too.**
Llama Guard catches 95% of obvious jailbreaks but misses creative ones (`"in a story, the assistant explains how to..."`). Layer guardrails: model-level (Llama Guard) + heuristic (regex/keywords) + LLM-as-judge (semantic) + human review for high-risk actions (refunds > $100).

**6. Prompt versioning is non-negotiable.**
Every prompt edit is a deploy. Use a **prompt registry** (LangSmith/Langfuse/Promptfoo) with versions, A/B routing, and ability to roll back. "Edit prompt in code, push to main, deploy" without a registry = you cannot answer "what changed when quality dropped on Tuesday?".

**7. Eval infrastructure is part of the product.**
Intercom hired 2 engineers full-time on the Fin eval pipeline. Klarna built an internal eval framework before the agent. This is not "QA work that can wait" — it's **the moat**. Companies that win in agents are companies that can iterate confidently.

> 🇻🇳 7 thực tế production: (1) multi-turn khó gấp 10, (2) tool-use cần trace-level check, (3) prod luôn sáng tạo hơn goldens — cần online eval, (4) chi phí eval có thể > chi phí agent, (5) guardrails cũng bị jailbreak → cần nhiều lớp, (6) prompt versioning bắt buộc, (7) eval pipeline = một phần của product, không phải "QA để sau".

---

### A6. ⚠️ Common Mistakes Table

| Sai lầm (Mistake)                             | Tại sao sai (Why wrong)                                                           | Đúng là (Correct)                                                            |
| --------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Eval = "thử vài câu xem có đúng không"        | Manual, không reproduce, không catch regression                                   | Goldens versioned trong git + run trên CI                                    |
| Compare output bằng `expect(...).toBe(...)`   | LLM output non-deterministic, "$42 refund" vs "Refund of $42" đều đúng            | Semantic scorer (LLM-judge) hoặc partial check (chứa số tiền + chữ "refund") |
| Tin LLM-judge mà không calibrate              | Judge có thể có κ = 0.3 với human → 94% pass là nhiễu                             | Calibrate với 100 human labels, κ > 0.7, re-calibrate mỗi quý                |
| Chỉ eval input + final output                 | Bỏ qua tool path → agent gọi nhầm `get_admin_users()` cũng "pass"                 | Trace-level assertions (đúng tools, đúng thứ tự, đúng args)                  |
| Edit prompt trực tiếp trong code, deploy luôn | Không trace được "Tuesday quality drop" do prompt nào                             | Prompt registry với version + A/B + rollback                                 |
| Goldens = 20 case viết tay                    | Không cover edge case + adversarial → prod fail                                   | 300-1000+ cases: hand + mined production + adversarial + regression          |
| Guardrail = 1 model duy nhất (Llama Guard)    | Bị jailbreak qua "story mode" → leak                                              | Layer: model + regex + LLM-judge + human-in-loop cho high-risk               |
| "Eval xong rồi, không cần online check"       | Goldens static, users creative — drift xuất hiện sau 2 tuần                       | Online eval sampling (5-10% traffic) + alert on regression                   |
| Dùng cùng 1 model làm agent + làm judge       | Self-bias: model thiên vị output của chính nó                                     | Judge phải khác model agent (hoặc khác family)                               |
| Đo "accuracy" duy nhất                        | Bỏ qua hallucination rate, citation faithfulness, policy adherence, cost, latency | Multi-metric scorecard: 5-7 metrics tracked together                         |

---

### A7. 🎯 Interview Pattern — Trigger Keywords

**Trigger phrases that mean "they want to test if you understand agent evaluation":**

- "How would you ship an LLM/agent feature to production?"
- "How do you know your agent isn't getting worse?"
- "How would you test an LLM-based feature?"
- "What's the difference between evaluating a chatbot and evaluating a classifier?"
- "How do you prevent hallucinations in production?"
- "Walk me through your prompt iteration workflow."

**Opening 1-2 sentences (use this template):**

> _"Production LLM systems need a five-layer evaluation stack — goldens, evals, traces, scorecards, and guardrails. The non-obvious part is that LLM-as-judge scorers must be calibrated against human labels (Cohen's kappa > 0.7) before you can trust their pass rates, and online eval sampling on production traffic catches the drift that static goldens miss."_

This signals: you've shipped this, you know the failure modes, you separate offline from online, and you understand calibration.

---

### A8. 🔑 Knowledge Chain

📚 **Prerequisites (read first):**

- [LLM System Design](./02-llm-system-design.md) — RPMECG stack including Eval layer
- [Agent Patterns](../shared/06-ai-and-agents/03-agent-patterns.md) — what an agent is, tool-use loop
- [AI Engineering](../shared/06-ai-and-agents/05-ai-engineering.md) — prompt engineering, context window
- [Software Testing fundamentals](../shared/05-software-engineering/03-testing-strategies.md) — golden tests, regression tests

➡️ **Enables (these depend on this):**

- [Senior Engineer in AI Era](./10-senior-engineer-ai-era.md) — judgment about when AI is ready to ship
- [AI Production Challenges](../shared/06-ai-and-agents/07-ai-production-challenges.md) — operational concerns
- [Modern Observability](./11-modern-observability.md) — traces feed into eval scorecards
- [AI Evaluation & Testing](../shared/06-ai-and-agents/08-ai-evaluation-testing.md) — deeper dive on scorer math

---

## B. INTERVIEW Q&A (Câu hỏi phỏng vấn)

### 🟢 B1. What is an "eval" in the LLM agent context, and how is it different from a unit test?

> 💡 **Interview Signal**:
> ✅ Strong: "Eval scores semantic + behavioral correctness on a versioned golden set; unit tests check exact behavior on deterministic code. Evals use scorers (deterministic, reference-based, LLM-judge), not equality."
> ❌ Weak: "It's like a test but for AI."

**EN:** An **eval** is an automated assessment that runs an LLM/agent against a curated **golden set** (input + expected behavior, NOT expected exact text) and produces a **score** using one or more **scorers**. Scorers come in four families: deterministic (regex, schema, must-contain), reference-based (BLEU, embedding similarity), LLM-as-judge (a separate LLM rates the output), and human eval. Unlike a unit test which asserts exact equality on deterministic code, an eval handles non-determinism by judging **meaning, structure, and policy adherence**, and reports aggregate metrics (pass rate, hallucination rate) across hundreds of cases rather than a binary pass/fail per case.

**🇻🇳 VI:** Eval là kiểm tra tự động chạy LLM/agent trên **golden set** (input + behavior mong muốn, KHÔNG phải text chính xác) và cho điểm bằng **scorers**: deterministic, reference-based, LLM-as-judge, human. Khác unit test ở chỗ chấp nhận output non-deterministic — chấm theo nghĩa + cấu trúc + policy, và báo cáo metric tổng (pass rate, hallucination rate) trên hàng trăm case.

---

### 🟢 B2. What goes into a "trace" for an LLM agent, and why do you need it?

> 💡 **Interview Signal**:
> ✅ Strong: Lists inputs, every tool call (name + args + result), intermediate LLM messages, tokens, latency, cost, model version, prompt version, user_id; explains traces enable debugging, online eval sampling, and cost attribution.
> ❌ Weak: "Logs of what the AI said."

**EN:** A trace captures the **full execution graph** of one agent request: (1) user input + system prompt + prompt version, (2) every LLM call (model, version, input tokens, output tokens, latency, cost), (3) every tool call (name, args, result, error), (4) intermediate reasoning/messages, (5) final output, (6) metadata (user_id, session_id, feature flags, deployment SHA). You need traces because (a) **debugging**: when a user complains, you need to see exactly what the agent did; (b) **online evals**: sample 5% of traces and run LLM-judge to detect drift; (c) **cost attribution**: which prompt/feature is burning tokens; (d) **regression mining**: turn bad traces into new golden cases. Tools: LangSmith, Langfuse (open source), Arize, Helicone.

**🇻🇳 VI:** Trace = đồ thị thực thi đầy đủ của 1 request: input + system prompt + prompt version, mọi LLM call (model/tokens/latency/cost), mọi tool call (name/args/result), reasoning trung gian, output cuối, metadata (user/session/deploy SHA). Cần để: debug khi user phàn nàn, online eval (sample 5%), cost attribution, biến trace lỗi thành golden mới. Tools: LangSmith, Langfuse, Arize.

---

### 🟢 B3. What are guardrails, and where in the request flow do they sit?

> 💡 **Interview Signal**:
> ✅ Strong: Distinguishes input vs output guardrails; lists multiple layers (model-based + heuristic + LLM-judge + human-in-loop for high-risk); knows examples (Llama Guard, Prompt Shield, schema validators).
> ❌ Weak: "Filters that stop bad outputs."

**EN:** Guardrails are runtime filters that wrap agent execution. **Input guardrails** sit before the agent: detect jailbreaks (`"ignore previous instructions"`), PII, abuse, off-topic queries — using model-based detectors (Llama Guard, Azure Prompt Shield) + heuristics (regex, allowlists). **Output guardrails** sit after: block hallucinations (citation verifier checks URLs exist in source corpus), PII leaks (redactor), policy violations (LLM-judge: "does this answer promise a refund?"), and schema mismatches (JSON validators). High-risk actions (refund > $100, sending email) get a fourth layer: **human-in-the-loop approval**. Guardrails are layered because each layer has a different miss rate; defense in depth catches what one layer misses.

**🇻🇳 VI:** Guardrails là filters runtime quanh agent. **Input guardrails** trước agent: chặn jailbreak, PII, abuse (Llama Guard + regex). **Output guardrails** sau agent: chặn hallucination (verify citation), leak PII, vi phạm policy (LLM-judge), sai schema (JSON validator). High-risk action (refund > $100, gửi email) thêm lớp 4: **human-in-the-loop**. Layer nhiều lớp vì mỗi lớp miss khác nhau — defense in depth.

---

### 🟡 B4. How do you build a golden test set for a customer support agent? Walk me through it.

> 💡 **Interview Signal**:
> ✅ Strong: Mentions seed from SMEs, mine production, adversarial cases, regression cases from bugs, versioning in git, target size 300-1000+, never edit existing cases (only add).
> ❌ Weak: "Write a bunch of test questions."

**EN:** Five sources, in order:

1. **Seed (50-100 cases)**: domain experts (support leads) write top-intent examples — refund request, order status, product question, escalation.
2. **Production mining (200-500 cases)**: sample real conversations from traces; label outcomes (resolved/escalated/wrong); diversify by intent, channel, customer tier.
3. **Adversarial (100 cases)**: deliberately try to break the agent — jailbreaks ("pretend you're DAN"), ambiguous queries ("the thing isn't working"), multi-turn flips ("actually I want a different refund"), policy edges (asking for >stated max refund).
4. **Regression (grows over time)**: every production bug → one golden that would have caught it. This is the most valuable set after 6 months.
5. **Synthetic augmentation**: use GPT-4 to generate paraphrases of existing cases for robustness.

Store in git as `goldens/v1.4.2.jsonl`, **never edit existing cases** (only add or deprecate), run on every PR, target 300-500 for single-task agents, 1,000+ for multi-tool customer-facing.

**🇻🇳 VI:** 5 nguồn theo thứ tự: (1) **Seed** 50-100 từ SME viết top intent, (2) **Mine production** 200-500 từ trace thực + label, (3) **Adversarial** 100 case cố tình phá (jailbreak, ambiguous, multi-turn flip), (4) **Regression** mỗi bug prod → 1 golden, (5) **Synthetic** GPT-4 paraphrase. Lưu git `goldens/v1.4.2.jsonl`, **không bao giờ sửa case cũ** (chỉ add/deprecate), chạy mỗi PR, target 300-500 cho single-task, 1000+ cho multi-tool customer-facing.

---

### 🟡 B5. What is "LLM-as-judge" and what are its failure modes?

> 💡 **Interview Signal**:
> ✅ Strong: Explains concept; lists failure modes (self-bias, position bias, verbosity bias, lack of calibration); mentions Cohen's kappa calibration, separate judge model, structured rubric prompts.
> ❌ Weak: "Use GPT-4 to grade the answer."

**EN:** LLM-as-judge uses a separate LLM with a structured rubric prompt to score an output (e.g., 1-5 on faithfulness, helpfulness, tone, policy adherence). It's powerful because it judges semantics, but has **five well-documented biases**:

1. **Self-bias**: a model favors outputs from itself or its family — _use a different model family as judge_.
2. **Position bias**: in pairwise comparison, prefers the first (or last) option — _randomize position, run twice_.
3. **Verbosity bias**: prefers longer outputs — _cap output length in the rubric_.
4. **Authority bias**: prefers confident-sounding answers regardless of correctness — _include "is this hedge justified?" in rubric_.
5. **No calibration**: people assume "judge says 4/5" means quality is 80% — _calibrate against 100 human labels, compute Cohen's kappa, require κ > 0.7 (substantial agreement) before trusting_.

Re-calibrate quarterly because model versions drift. **An uncalibrated LLM-judge is worse than no judge** — it produces false confidence.

**🇻🇳 VI:** LLM-judge = dùng LLM khác chấm điểm theo rubric. 5 bias: (1) **self-bias** — model thiên vị output của mình (dùng model khác family); (2) **position bias** — thích option đầu/cuối (randomize); (3) **verbosity bias** — thích dài (cap length); (4) **authority bias** — thích giọng tự tin (rubric hỏi "có justify không?"); (5) **không calibrate** — phải có 100 human label, Cohen's κ > 0.7 mới tin. Re-calibrate mỗi quý. **Judge chưa calibrate tệ hơn không có judge** — false confidence.

---

### 🟡 B6. Difference between offline evals and online evals — when do you use each?

> 💡 **Interview Signal**:
> ✅ Strong: Offline = CI on goldens (deterministic, reproducible, blocks bad PRs); online = sampled production traffic (catches drift, real distribution); both needed.
> ❌ Weak: "Online is faster."

**EN:**

| Dimension             | Offline eval                         | Online eval                                 |
| --------------------- | ------------------------------------ | ------------------------------------------- |
| **Where**             | CI pipeline                          | Production runtime                          |
| **Input**             | Golden set (frozen)                  | Sampled live traffic (1-10%)                |
| **Goal**              | Block bad PRs, regression detection  | Drift detection, real-distribution coverage |
| **Scorers**           | Full suite (slow OK, ~12 min budget) | Cheap subset (LLM-judge on Haiku)           |
| **Latency tolerance** | Minutes (CI)                         | Async (don't block user response)           |
| **Catches**           | "This change breaks 30 known cases"  | "Production quality dropped 3% this week"   |
| **Misses**            | Novel real-world inputs              | Edge cases not in current traffic           |

**Use both**: offline gates every deploy; online detects what offline missed. Intercom found 67% of regressions caught by offline alone, but the remaining 33% (highest-impact) needed online.

**🇻🇳 VI:** Offline = CI trên goldens (chặn PR xấu, ~12 min); Online = sample 1-10% traffic prod, async, scorer rẻ (Haiku), bắt drift. Phải có **cả hai**: offline catch 67% regression, 33% còn lại (impact cao nhất) cần online.

---

### 🟡 B7. How do you evaluate a multi-tool agent (where the LLM picks which tool to call)?

> 💡 **Interview Signal**:
> ✅ Strong: Trace-level assertions (correct tools called, correct order, correct args, no leaked tools); per-step scorers; trajectory-level scorer; mentions tool-call accuracy as separate metric from final-answer accuracy.
> ❌ Weak: "Same as single-turn but with more steps."

**EN:** Multi-tool eval needs **trace-graph scorers** beyond final-answer scoring:

1. **Tool selection accuracy**: did it pick the right tools? `assert "lookup_order" in trace.tools_called`.
2. **Tool order**: `assert trace.tool_order == ["lookup_order", "verify_policy", "issue_refund"]` (order matters for security: verify before action).
3. **Tool argument correctness**: `assert trace.calls["lookup_order"].args["order_id"] == golden.order_id`.
4. **Forbidden tools not called**: `assert "get_admin_users" not in trace.tools_called` (privacy).
5. **No infinite loops**: `assert trace.tool_call_count < 10`.
6. **Final answer scoring**: still needed — tools could be right but synthesis wrong.

Track **tool-call accuracy** as a separate metric from **answer accuracy**: an agent that calls all the right tools but writes a bad summary is fixable (prompt); an agent that calls wrong tools is broken (architecture).

**🇻🇳 VI:** Multi-tool cần **trace-graph scorers**: (1) đúng tools, (2) đúng thứ tự (verify trước action), (3) đúng args, (4) không gọi tool cấm (`get_admin_users`), (5) không loop vô tận (<10 calls), (6) vẫn chấm final answer. Track **tool-call accuracy** tách khỏi **answer accuracy** — sai tools = kiến trúc hỏng (khó); sai answer mà tools đúng = chỉ cần sửa prompt (dễ).

---

### 🔴 B8. Design end-to-end: ship an AI agent that handles refund requests for a 10M-user e-commerce platform. What's your eval + guardrail stack?

> 💡 **Interview Signal (Senior, Bloom L5 — Synthesis)**:
> ✅ Strong: Layered stack (input guardrails → agent → tool guardrails → output guardrails → human-in-loop for refunds > $100); offline goldens 1500+ cases; online eval 5% sample; trace-level + answer-level scorers; prompt + golden versioning in git; rollout plan (shadow → canary 1% → 10% → 100%); kill switch; cost ~$X/req with model routing.
> ❌ Weak: "Use GPT-4 with a good prompt and add some checks."

**EN — Full design:**

**Architecture:**

```
User → Input Guardrails → Agent (LLM + Tools) → Output Guardrails → User
                                                       │
                                              ┌────────┴────────┐
                                              │  Refund > $100? │
                                              └────────┬────────┘
                                                       │ yes
                                                       ▼
                                              Human-in-Loop Queue
                                                       │
                                              SLA: 5 min response
```

**Tool inventory (whitelist):**

- `lookup_order(order_id)` — read-only
- `verify_refund_policy(order_id, reason)` — pure function
- `check_customer_tier(user_id)` — read-only
- `issue_refund(order_id, amount, reason)` — **side effect, requires verify call first**
- `escalate_to_human(reason)` — fallback

**Input guardrails (all must pass):**

1. Llama Guard 3 — jailbreak/abuse classifier (P99 < 50ms).
2. Regex — block SSN, credit card patterns.
3. Topic classifier (small model) — refuse if intent ≠ refund/order/return.
4. Rate limit per user (10 req/min).

**Agent execution:**

- Model routing: Haiku for simple ("where's my order") → Sonnet for refund decisions → Opus only on escalation.
- Max 8 tool calls per request (loop guard).
- Tool args validated by Zod/Pydantic schema before call.
- All tool results logged to trace.

**Output guardrails:**

1. **Citation verifier**: if agent claims "policy says X", check the policy doc actually contains X (embedding match + LLM verify).
2. **Promise detector** (LLM-judge Haiku): "Does this output promise a specific refund amount?" — if yes AND no `issue_refund` tool call yet → block.
3. **PII redactor**: scrub any leaked email/phone from response.
4. **Tone classifier**: block hostile/swearing outputs (DPD lesson).

**Human-in-loop:** any `issue_refund` with amount > $100 queues for human approval (5-min SLA, fallback to "we'll email you in 24h").

**Eval stack:**

- **Goldens**: 1,500 cases — 500 hand (top intents) + 600 mined production + 300 adversarial + 100 regression.
- **Offline scorers** (run on every PR, ~14 min):
  - Deterministic: tool-call sequence, JSON schema, citation present.
  - LLM-judge (Sonnet, calibrated κ=0.78 vs SME labels): faithfulness, policy adherence, tone.
  - Reference embedding similarity for "expected resolution category".
  - **Block PR if pass rate drops > 1.5 points or any P0 case fails.**
- **Online evals**: sample 5% of production traces, run cheap judges (Haiku), alert if WoW pass drops > 2 points.
- **Scorecard metrics tracked**: pass rate, hallucination rate, refund accuracy, P95 latency, $/request, escalation rate, CSAT (post-conversation survey).

**Rollout plan:**

1. **Shadow mode** (1 week): agent runs on 100% traffic but answers go to log only, humans still respond. Compare answers to human gold standard.
2. **Canary 1%** (3 days): real users, monitor scorecard hourly, kill switch ready (feature flag).
3. **Canary 10%** (1 week): A/B test vs human-only baseline; primary metrics: CSAT, resolution rate, escalation rate.
4. **Ramp 25% → 50% → 100%** over 2 weeks if metrics hold.
5. **Kill switch**: any of (hallucination > 0.5%, refund accuracy < 99%, P95 > 5s, CSAT drop > 3 points) → instant rollback to human-only.

**Cost estimate:** Haiku $0.001 + Sonnet $0.012 + tool calls + Llama Guard $0.0005 ≈ **$0.015/request avg** vs $4.50/human-handled = **300x cheaper** at automation rate of 50%.

**🇻🇳 VI tóm tắt:** Stack đầy đủ: Input guardrails (Llama Guard + regex + topic + rate limit) → Agent (model routing Haiku/Sonnet, tool whitelist, schema validate, max 8 calls) → Output guardrails (citation verifier + promise detector + PII redactor + tone) → Human-in-loop cho refund > $100. Eval: 1500 goldens (hand + production + adversarial + regression), offline + online (5% sample), 7 metrics scorecard. Rollout: shadow → canary 1% → 10% → 25% → 50% → 100%, kill switch trên 4 SLO. Cost $0.015/req vs human $4.50 = 300x rẻ hơn ở 50% automation.

---

### 🔴 B9. Your agent has 94% pass rate on goldens but production CSAT drops 6 points after launch. Diagnose and fix.

> 💡 **Interview Signal (Senior, Bloom L4 — Analysis)**:
> ✅ Strong: Hypothesizes goldens-prod distribution gap; checks online eval; checks LLM-judge calibration drift; mines bad CSAT conversations; identifies missing personas/intents; updates goldens; checks for prompt drift; doesn't blame the model first.
> ❌ Weak: "Switch to a better model."

**EN — Systematic diagnosis (5 hypotheses, ranked by likelihood):**

**H1 (40% likely): Goldens-production distribution gap.**

- Action: pull 200 conversations with low CSAT from traces, label intent + topic, compare distribution to goldens.
- Common finding: goldens overweight "refund" (40%) but production has 25% "shipping delay" (which agent fumbles).
- Fix: mine 200 low-CSAT traces → add to goldens → re-eval → patch prompt for the missing intents.

**H2 (25% likely): LLM-judge drift / miscalibration.**

- Action: re-run human calibration on 50 fresh cases. Did κ drop from 0.78 to 0.45?
- Common finding: model vendor pushed minor version → judge now scores 4/5 on outputs that humans rate 2/5.
- Fix: pin judge model version; re-calibrate; possibly switch judge family.

**H3 (15% likely): Prompt drift in production.**

- Action: diff current production prompt vs the one used during eval. Did someone hot-fix a typo and remove a critical instruction?
- Common finding: PM asked engineer to "make it friendlier", they added "be casual" which removed structured output → tools fail to parse.
- Fix: prompt registry with mandatory PR review; revert; re-eval.

**H4 (10% likely): Tool / data drift.**

- Action: check if tool APIs changed (slow new endpoint causing timeouts), if vector DB has new docs causing wrong retrievals.
- Common finding: shipping tracking API now returns `null` for international orders → agent says "I don't know".
- Fix: tool integration tests; SLO alerts on tool latency/error rate.

**H5 (10% likely): User adversarial behavior / seasonality.**

- Action: did launch coincide with Black Friday / new product launch / influencer mention? Are users now testing the bot ("is this a real person")?
- Fix: add seasonal adversarial goldens; deploy "I'm an AI assistant" framing.

**Process:**

1. **Stop the bleed first**: if CSAT drop is > 5 points, route 50% back to humans while diagnosing (kill switch partial).
2. **Triage 50 worst conversations** in 24h.
3. **Form one hypothesis per pattern**, test independently.
4. **Update goldens + scorers** to detect this class of failure (regression — must never recur).
5. **Postmortem**: why didn't offline catch this? What new scorer/online check should we add?

**🇻🇳 VI tóm tắt:** 5 giả thuyết theo xác suất: (H1 40%) goldens lệch distribution prod — mine 200 trace CSAT thấp, add vào goldens; (H2 25%) judge drift/miscalibrate — re-calibrate human 50 case; (H3 15%) prompt drift — diff prompt prod vs eval, revert; (H4 10%) tool/data drift — check API + vector DB; (H5 10%) user adversarial / seasonality. Process: kill switch 50% trước → triage 50 trace tệ nhất 24h → 1 hypothesis 1 pattern → update goldens (regression) → postmortem "tại sao offline không catch?".

---

### 🔴 B10. Compare three approaches to evaluate "is this answer faithful to the retrieved context?": (a) deterministic, (b) LLM-as-judge, (c) human eval. Build a hybrid recommendation.

> 💡 **Interview Signal (Senior, Bloom L6 — Evaluation)**:
> ✅ Strong: Multi-axis comparison (cost, latency, accuracy, scalability, calibration need); identifies hybrid (deterministic gate → LLM-judge for nuance → human spot-check) with clear thresholds; cites real numbers; handles edge cases.
> ❌ Weak: "LLM-judge is best."

**EN:**

**Comparison matrix (faithfulness scoring of `(answer, retrieved_context)`):**

| Axis                                      | (a) Deterministic                                                  | (b) LLM-as-judge                                                            | (c) Human eval                     |
| ----------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------- | ---------------------------------- |
| **Method**                                | Citation present, regex on numbers, embedding similarity threshold | LLM with rubric: "Score 1-5: every claim in answer is supported by context" | SME reads answer + context, labels |
| **Cost / case**                           | ~$0                                                                | $0.003-0.02                                                                 | $0.50-5                            |
| **Latency / case**                        | < 50ms                                                             | 1-3s                                                                        | 2-10 min                           |
| **Recall (catches faithful issues)**      | Low (~50%)                                                         | High (~90% if calibrated)                                                   | Highest (~98%)                     |
| **Precision (false positives)**           | High (deterministic)                                               | Medium (judge bias)                                                         | Highest                            |
| **Scalable to 10K cases?**                | Yes                                                                | Yes ($30-200)                                                               | No (5,000-50,000 hours)            |
| **Detects subtle hallucination?**         | No                                                                 | Yes                                                                         | Yes                                |
| **Calibration needed**                    | None                                                               | Cohen's κ > 0.7 quarterly                                                   | Inter-annotator agreement > 0.8    |
| **Catches "made up citation"**            | If verifying URL exists                                            | Yes                                                                         | Yes                                |
| **Catches "right facts wrong synthesis"** | No                                                                 | Sometimes                                                                   | Yes                                |

**Hybrid recommendation (3-tier funnel):**

```
All answers (100%)
    │
    ▼
┌─────────────────────────────────────────────────────┐
│ TIER 1: DETERMINISTIC (every request, prod runtime) │
│  • Citation present? (regex)                        │
│  • All citation IDs exist in source corpus?         │
│  • Numbers/dates in answer appear in context?       │
│  • Embedding(answer) sim with context > 0.6?        │
│  → Fail: block + log; Pass: continue                │
└─────────────────────────────────────────────────────┘
    │ ~95% pass
    ▼
┌─────────────────────────────────────────────────────┐
│ TIER 2: LLM-JUDGE (sampled 5-10% in prod, 100% CI)  │
│  • Sonnet calibrated κ = 0.78 vs SME              │
│  • Rubric: 5-point per-claim faithfulness           │
│  • Run twice with claim order swapped (position)    │
│  → Score < 4: alert + queue for human review        │
└─────────────────────────────────────────────────────┘
    │ ~3% flagged
    ▼
┌─────────────────────────────────────────────────────┐
│ TIER 3: HUMAN EVAL (50 cases/week + flagged ones)   │
│  • SME panel labels                                 │
│  • Use to: re-calibrate judge, mine new goldens,    │
│    final QA on high-risk decisions                  │
└─────────────────────────────────────────────────────┘
```

**Why hybrid is correct:**

- **Deterministic** is cheap + runs everywhere → catches gross failures (made-up citations) at $0.
- **LLM-judge** scales to thousands of cases for nuance → catches subtle hallucinations.
- **Human eval** is the **ground truth** that calibrates the judge → without it the judge eventually drifts.

**Numbers (Intercom-style):** for 1M production requests/month: deterministic costs $0; LLM-judge on 5% sample = 50K × $0.005 = $250/month; human eval 200 cases/month = $400 → **total $650/month for full QA on $50K worth of agent traffic**. Skip any tier and you either miss errors (no deterministic), can't scale (no LLM-judge), or can't trust the judge (no human).

**Edge case:** for high-risk decisions (refund > $100, medical info, legal advice), invert the funnel — **human-in-loop FIRST**, then learn from the human decisions to improve automated tiers.

**🇻🇳 VI tóm tắt:** Hybrid 3 tier: (T1) **Deterministic** trên 100% request prod — citation tồn tại, số/ngày match, embedding sim > 0.6 — chặn 95% lỗi grossly tại $0. (T2) **LLM-judge** sample 5% prod + 100% CI — Sonnet calibrate κ=0.78, rubric 5-point, swap order — flag 3% cho review. (T3) **Human eval** 50 case/tuần + flagged — ground truth để re-calibrate judge + mine goldens. Cho 1M req/tháng: $0 + $250 + $400 = **$650/tháng full QA**. Edge case: refund > $100 / y tế / pháp lý → invert funnel, human-in-loop TRƯỚC, dùng decision của human để cải thiện tier tự động.

---

## C. STUDY CASES (Tình huống thực tế)

### 📚 C1. Overview / Tổng Quan

This file covered the **GETS-G stack** for shipping LLM agents to production: Goldens (versioned test sets), Evals (deterministic + LLM-judge + human), Traces (full execution capture), Scorecards (multi-metric dashboards), and Guardrails (input + output + human-in-loop). The hard parts are **calibrating LLM-judge against humans** (Cohen's κ > 0.7), **distinguishing offline vs online evals** (both needed), and **trace-level scoring for multi-tool agents** (not just final answer). Real winners (Intercom, Klarna) treat eval infrastructure as the product moat, not as QA-after-the-fact.

> 🇻🇳 GETS-G: Goldens + Evals + Traces + Scorecards + Guardrails. Khó nhất là calibrate LLM-judge với human (κ > 0.7), phân biệt offline vs online eval, và scoring trace-level cho multi-tool agent. Winner thực sự (Intercom, Klarna) coi eval pipeline là **moat**, không phải "QA để sau".

---

### 📚 C2. Interview Q&A Summary Table

| #   | Question                                       | Difficulty | Core Concept                               | Key Signal                                                |
| --- | ---------------------------------------------- | ---------- | ------------------------------------------ | --------------------------------------------------------- |
| B1  | What is an eval (vs unit test)?                | 🟢         | Scorers + goldens + non-determinism        | Names 4 scorer families                                   |
| B2  | What's in a trace, why need it?                | 🟢         | Trace structure + use cases                | Lists tool-call + cost + version + uses                   |
| B3  | What are guardrails, where?                    | 🟢         | Input/output layers, defense in depth      | Distinguishes input vs output, 4+ layers                  |
| B4  | How to build a golden set?                     | 🟡         | Seed + mine + adversarial + regression     | 5 sources, target size, never edit                        |
| B5  | LLM-as-judge failure modes                     | 🟡         | Self/position/verbosity bias + calibration | Cohen's κ > 0.7, separate model                           |
| B6  | Offline vs online evals                        | 🟡         | Both needed, different roles               | Matrix comparison, "67/33 split"                          |
| B7  | Multi-tool agent eval                          | 🟡         | Trace-graph scorers + tool accuracy        | Tool order, args, forbidden tools, infinite loop          |
| B8  | Design refund agent + eval stack               | 🔴         | End-to-end synthesis                       | Layered guardrails + 1500 goldens + rollout + kill switch |
| B9  | 94% goldens, prod CSAT drops 6pts              | 🔴         | Diagnostic reasoning                       | 5 hypotheses ranked, kill switch first                    |
| B10 | Hybrid faithfulness eval (det + judge + human) | 🔴         | Multi-axis trade-off + funnel design       | 3-tier funnel with $/numbers, edge case inversion         |

---

### ⚡ C3. Cold Call Simulation (30-second answer)

**Q (interviewer):** "How do you evaluate an LLM agent in production?"

**A (you, 30 seconds):**

> "I use a five-layer stack — GETS-G: **Goldens** versioned in git (hand + mined production + adversarial + regression, 300-1000+ cases), **Evals** with three scorer families (deterministic, LLM-as-judge calibrated against humans with Cohen's κ > 0.7, and SME human eval for ground truth), **Traces** capturing every tool call + tokens + cost + prompt version, **Scorecards** tracking 5-7 metrics together (pass rate, hallucination, latency, $/req), and **Guardrails** layered before AND after the agent with human-in-loop for high-risk actions. The non-obvious part: offline goldens catch ~67% of regressions, but online eval sampling on 5% of production traffic catches the drift static goldens can't see — you need both."

**Follow-up (interviewer):** "What's the hardest part?"

> "Calibrating LLM-as-judge. People run Sonnet as a judge, see 94% pass rate, ship it — but Cohen's kappa with humans might be 0.3, which means the score is noise. You need 100 SME-labeled cases per quarter to verify κ > 0.7, and you have to use a different model family as judge to avoid self-bias."

---

### 🔍 C4. Self-Check Retrieval (close the doc, answer in 60s)

1. **Retrieval**: What does GETS-G stand for, in order?
2. **Visual**: Sketch the request flow showing input guardrails, agent execution with tracing, output guardrails, and human-in-loop branch.
3. **Application**: Given a multi-turn customer support agent, list 3 trace-level assertions you'd add (beyond final-answer correctness).
4. **Debug**: Eval pass rate is 94% but production CSAT dropped 6 points. Name the top 2 hypotheses and how you'd test each in < 24 hours.
5. **Teach**: Explain to a junior engineer why "test the AI with 10 examples" is not enough — use a concrete failure mode.

(If you can't answer 4/5 in 60s each, re-read sections A4 + B4 + B5 + B9.)

---

### 💬 C5. Feynman Prompt

> _Explain GETS-G to a backend engineer who has shipped REST APIs but never touched LLM evaluation._
>
> Cover:
>
> - Why unit tests aren't enough (concrete example).
> - What a "golden" looks like as a JSON record.
> - Why LLM-as-judge needs calibration (with the kitchen analogy or your own).
> - Why both offline AND online evals are necessary (the 67/33 number).
> - One trap that an engineer migrating from REST testing would fall into.

If you can't deliver this in 5 minutes without notes, you don't yet own the topic. Re-teach until you can.

---

### 🔁 C6. Spaced Repetition Schedule

| Interval      | What to do                                                                         |
| ------------- | ---------------------------------------------------------------------------------- |
| **Day 1**     | Read whole file, write GETS-G mnemonic from memory + 3 scorer types                |
| **Day 3**     | Re-do C4 self-check; write golden JSON schema + LLM-judge rubric example           |
| **Day 7**     | Mock interview B8 (refund agent design) out loud, 8 minutes                        |
| **Day 14**    | Mock interview B9 (CSAT drop diagnosis) + B10 (hybrid faithfulness)                |
| **Day 30**    | Re-derive offline-vs-online matrix from scratch + 5 LLM-judge biases               |
| **Quarterly** | Re-read; check for new tooling (LangSmith/Langfuse releases, OpenAI Evals updates) |

---

### 🔗 C7. Connections / Liên kết kiến thức

**Same-track (2026 trends):**

- **← Built on:** [02 LLM System Design](./02-llm-system-design.md) (Eval is the E in RPMECG)
- **← Built on:** [03 Vector Databases](./03-vector-databases-embeddings.md) (faithfulness checks need to verify retrievals)
- **→ Enables:** [10 Senior in AI Era](./10-senior-engineer-ai-era.md) (judgment about ship-readiness)
- **→ Enables:** [11 Modern Observability](./11-modern-observability.md) (traces feed both eval scorecards and SRE dashboards)

**Cross-track (existing docs):**

- [Agent Patterns](../shared/06-ai-and-agents/03-agent-patterns.md) — what you're evaluating
- [AI Engineering](../shared/06-ai-and-agents/05-ai-engineering.md) — prompt + context engineering
- [AI Evaluation & Testing](../shared/06-ai-and-agents/08-ai-evaluation-testing.md) — deeper scorer math
- [AI Production Challenges](../shared/06-ai-and-agents/07-ai-production-challenges.md) — operational concerns
- [RAG](../shared/06-ai-and-agents/04-rag.md) — faithfulness + citation evaluation
- [Testing Strategies](../shared/05-software-engineering/03-testing-strategies.md) — how golden tests differ from unit/integration
- [Software Architecture](../shared/05-software-engineering/01-software-architecture.md) — eval pipeline as part of system architecture
- [System Design 101](../shared/02-system-design/01-system-design-fundamentals.md) — applying SD principles to ML systems

---

> _"You can't ship what you can't measure. You can't measure LLMs with `assertEquals`."_
> — The lesson Air Canada, DPD, and NYC MyCity learned the expensive way.

🇻🇳 _"Không đo được thì không ship được. LLM không đo bằng `assertEquals` được."_ — Bài học Air Canada, DPD, NYC MyCity đã trả giá đắt.
