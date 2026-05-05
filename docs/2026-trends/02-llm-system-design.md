# 02 - LLM System Design (2026)

> **Track**: Shared (BE-leaning) | **Difficulty**: 🟢 Junior → 🔴 Senior/Staff
> **Back to**: [00-table-of-contents.md](../00-table-of-contents.md) · [2026-trends README](./README.md)
> **Prereq**: [shared/06-ai-and-agents/02-llm.md](../shared/06-ai-and-agents/02-llm.md), [shared/06-ai-and-agents/04-rag.md](../shared/06-ai-and-agents/04-rag.md), [shared/02-system-design](../shared/02-system-design/)

---

## 🌍 Real-World Scenario / Bối Cảnh Thực Tế

**Notion AI Q&A (2024 incident → 2026 lesson).** Notion launched "Ask AI" — answer any question across your workspace. Day 1: latency P99 = 28 seconds, costs blew past $40K/day, and 12% of answers cited the wrong page. The team didn't have an LLM bug — they had a **system design bug**. Wrong retrieval (no reranker), wrong cache layer (semantic cache missing), wrong eval loop (no offline eval gate before prod), wrong cost guardrail (no per-tenant token budget).

Six months later, Notion's redesign: P99 < 4s, cost down 73%, citation accuracy 94%. The fix wasn't a better model — it was **better system design around the model**.

**Bài học (VI):** LLM trong production không phải là "gọi OpenAI". Nó là một **distributed system** với retrieval, caching, eval, cost control, fallback, và observability. Interview 2026 ở Senior+ level luôn hỏi "design an LLM-powered X" — và họ chấm bạn như chấm system design thường, cộng thêm AI-specific concerns.

---

## 🧠 Memory Hook

> **"LLM app = Retrieval + Prompt + Model + Eval + Guardrail + Cost."**
> Thiếu 1 trong 6 → outage hoặc bill shock. Đủ 6 → production-grade.

**Mnemonic: RPMECG** — Retrieve, Prompt, Model, Eval, Cost, Guardrail.

---

## 📚 Block A — Theory (Lý Thuyết Cốt Lõi)

### A1. Why LLM System Design exists / Tại sao tồn tại

**Why level 1:** Calling an LLM API is trivial; making it reliable, cheap, accurate, and safe at scale is not.
**Why level 2:** LLMs are **non-deterministic, expensive, slow, hallucinate, and leak data**. Every one of those is a system-design problem, not a model problem.
**Why level 3:** A 2025 a16z survey found 87% of GenAI projects that fail in production fail on **infrastructure around the model**, not the model itself.

**VI:** Mô hình chỉ là 1 component. Phần khó là _bao quanh nó_: làm sao trả lời nhanh, đúng, rẻ, an toàn, đo lường được.

---

### A2. Core Concept 1 — The 6-Layer LLM Stack

**Layer 1 (Simple Analogy):** Một LLM app giống như một **nhà hàng cao cấp**:

- **Retrieval** = đầu bếp đi chợ (lấy nguyên liệu / context).
- **Prompt** = công thức món ăn.
- **Model** = bếp chính.
- **Eval** = food critic nếm thử trước khi bưng ra.
- **Cost** = kế toán theo dõi nguyên liệu khỏi vượt budget.
- **Guardrail** = bảo vệ chặn khách say quậy / nguyên liệu độc.

**Layer 2 (How It Works — bắt buộc visual):**

```
┌─────────────────────────────────────────────────────────────────┐
│                       USER REQUEST                              │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
                  ┌────────────────┐
                  │  GUARDRAIL IN  │  ← PII redact, prompt-injection check
                  └────────┬───────┘
                           ▼
                  ┌────────────────┐
                  │ SEMANTIC CACHE │  ← hit? return cached answer
                  └────────┬───────┘ miss
                           ▼
                  ┌────────────────┐
                  │   RETRIEVAL    │  ← vector DB + BM25 + reranker
                  └────────┬───────┘
                           ▼
                  ┌────────────────┐
                  │  PROMPT BUILD  │  ← system + few-shot + context
                  └────────┬───────┘
                           ▼
                  ┌────────────────┐
                  │  MODEL ROUTER  │  ← cheap model first, fallback to big
                  └────────┬───────┘
                           ▼
                  ┌────────────────┐
                  │ GUARDRAIL OUT  │  ← toxicity, hallucination check
                  └────────┬───────┘
                           ▼
                  ┌────────────────┐
                  │ STREAM TO USER │  ← SSE/WebSocket
                  └────────┬───────┘
                           ▼
                  ┌────────────────┐
                  │  EVAL LOG +    │  ← async: trace, eval, cost meter
                  │  COST METER    │
                  └────────────────┘
```

| Layer          | Latency budget | Failure mode      | Mitigation                |
| -------------- | -------------- | ----------------- | ------------------------- |
| Guardrail in   | < 50ms         | Block legit users | Allow-list + soft-fail    |
| Semantic cache | < 30ms         | Stale answer      | TTL + version key         |
| Retrieval      | < 300ms        | Wrong context     | Reranker + hybrid search  |
| Prompt build   | < 10ms         | Prompt too long   | Token budget enforcer     |
| Model          | 1-10s          | Timeout / 429     | Router + retry + fallback |
| Guardrail out  | < 100ms        | False positive    | Calibrated threshold      |
| Eval log       | async          | Lost trace        | Queue (Kafka/SQS)         |

**Layer 3 (Edge Cases):**

- **Streaming + guardrail out** = mâu thuẫn. Bạn không thể kiểm tra toxicity trên token chưa hoàn thành. Giải: **token-window scanner** — quét mỗi 50 token, abort stream nếu phát hiện.
- **Cache key hash** trên prompt → user A và user B cùng câu hỏi nhưng khác tenant → **leak data**. Key phải bao gồm `tenant_id + prompt_hash + model + context_hash`.
- **Cold-start retrieval** sau deploy mới → embedding cache rỗng → P99 tăng 5x. Giải: **warm-up script** đẩy top-1000 query vào cache trước khi switch traffic.

---

### A3. Core Concept 2 — Retrieval Strategy (Hybrid + Rerank)

**Memory Hook:** _"Vector finds semantically close, BM25 finds lexically exact, reranker decides who's right."_

**Layer 1:** Vector search như tìm "món giống món bún bò" (semantic). BM25 như tìm "món có chữ 'bún bò'" (keyword). Reranker là người sành ăn xếp lại theo độ liên quan thực sự.

**Layer 2:**

```
Query: "How do I cancel a Pro subscription?"

┌──────────────┐         ┌──────────────┐
│ Vector Search│         │ BM25 Search  │
│  top 50      │         │  top 50      │
└──────┬───────┘         └──────┬───────┘
       │                        │
       └─────────┬──────────────┘
                 ▼
         ┌───────────────┐
         │ RRF Merge     │  ← Reciprocal Rank Fusion
         │ → top 20      │
         └───────┬───────┘
                 ▼
         ┌───────────────┐
         │ Cross-Encoder │  ← Cohere Rerank / bge-reranker-v2
         │ Rerank → top 5│
         └───────┬───────┘
                 ▼
         Send to LLM as context
```

**Numbers from production (Cohere Rerank 3, 2025):**

- Vector only: 67% answer accuracy
- Vector + BM25 RRF: 78%
- Vector + BM25 + Rerank: **89%**
- Cost of rerank: +$0.001/query, +80ms latency. Worth it.

**Layer 3:**

- **Multi-tenant retrieval**: filter at **vector DB level**, not post-filter. Post-filter on top-50 may return 0 results for small tenants.
- **Recency bias**: news/changelog corpus → boost score by `1/log(age_days)`.
- **Query rewriting**: ambiguous query "cancel" → expand to ["cancel subscription", "stop billing", "downgrade plan"] before retrieval.

---

### A4. Core Concept 3 — Prompt Architecture & Token Budget

**Memory Hook:** _"Prompt = fixed system + dynamic context + user input. Budget every token."_

**Layer 1:** Prompt như packing vali — mỗi token là 1 món đồ, vali (context window) có giới hạn. Nhồi quá → không vừa, hoặc vừa nhưng "needle in haystack" → model bỏ qua phần giữa.

**Layer 2 — Production prompt skeleton:**

```
┌────────────────────────────────────────┐
│ SYSTEM (fixed, ~500 tok)               │ ← role, tone, refuse rules
├────────────────────────────────────────┤
│ FEW-SHOT (3-5 examples, ~1500 tok)     │ ← optional, format anchor
├────────────────────────────────────────┤
│ TOOL DEFS (~800 tok)                   │ ← if function calling
├────────────────────────────────────────┤
│ RETRIEVED CONTEXT (~3000 tok cap)      │ ← chunked + reranked
│   <doc id="123">…</doc>                │
│   <doc id="456">…</doc>                │
├────────────────────────────────────────┤
│ CONVERSATION HISTORY (sliding ~2000)   │ ← summarize old turns
├────────────────────────────────────────┤
│ USER QUERY                             │
├────────────────────────────────────────┤
│ INSTRUCTION FOOTER (~200 tok)          │ ← "cite sources, if unsure say…"
└────────────────────────────────────────┘
Total budget: ~8000 tok input, leaves room for 2000 tok output @ 10K context.
```

**Lost-in-the-middle effect (Liu et al., 2024):** model recall drops 30%+ for content in middle 50% of context. Mitigations:

1. Put critical facts at **start or end**.
2. Cap context at 5-8 chunks, don't dump 30.
3. Use **structured tags** `<doc>...</doc>` instead of plain concatenation.

**Layer 3:**

- **Prompt caching** (Anthropic, OpenAI 2024+): cache the system + few-shot prefix → 90% cost cut on repeated requests.
- **Token counting before send**: use tiktoken / model's tokenizer; reject early if > budget instead of failing at API.
- **Multi-language prompt**: VI input + EN system prompt usually beats pure-VI prompt for reasoning quality (as of GPT-4o / Claude 3.5).

---

### A5. Core Concept 4 — Model Routing & Fallback

**Memory Hook:** _"Don't pay GPT-5 prices for 'hello' classification."_

**Layer 1:** Như có nhiều bác sĩ — trạm y tế cho cảm cúm, bệnh viện tỉnh cho gãy tay, viện trung ương cho phẫu thuật tim. Routing chọn cấp phù hợp; fallback là khi cấp dưới không xử lý nổi.

**Layer 2:**

```
                    Request
                       │
                       ▼
            ┌──────────────────┐
            │ Classifier (BERT)│  ← "is this a complex query?"
            └────┬─────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
    SIMPLE            COMPLEX
        │                 │
        ▼                 ▼
   ┌─────────┐      ┌──────────┐
   │ Haiku   │      │ Sonnet   │
   │ ($0.25/M│      │ ($3/M)   │
   └────┬────┘      └────┬─────┘
        │                │
        │    confidence < 0.7?
        └──────┬─────────┘
               ▼
         ┌──────────┐
         │ Opus/GPT5│  ← fallback for hard cases
         │ ($15/M)  │
         └──────────┘
```

**Real numbers (Klarna assistant, 2024 disclosed):**

- 80% queries → small model (Haiku-class)
- 18% → medium (Sonnet-class)
- 2% → large (Opus/GPT-4-class)
- Blended cost = ~12% of all-large baseline.

**Layer 3:**

- **Sticky routing**: same conversation should stick to same model tier (avoid mid-chat capability shift).
- **Provider fallback**: OpenAI 429 → fallback to Anthropic with prompt translation layer. Maintain **provider-agnostic prompt** format.
- **Latency-aware routing**: if P99 SLO at risk, force small model and accept lower quality this minute.

---

### A6. Common Mistakes Table

| Sai lầm                                         | Tại sao sai                                                              | Đúng là                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------- |
| "Just send all docs in context, GPT-4 has 128K" | Lost-in-the-middle + 10x cost + 5x latency                               | Retrieve top-5 chunks, rerank, cap at ~3K tokens              |
| "Cache by prompt string equality"               | 99% miss rate (every query slightly different)                           | **Semantic cache**: embed query, hit if cosine > 0.97         |
| "One model for everything"                      | Pay Opus prices for "what time is it"                                    | Router: small → medium → large with confidence gate           |
| "Test in prod, users will report bugs"          | Hallucinations are silent failures, users leave silently                 | **Offline eval set + LLM-as-judge** before every deploy       |
| "Streaming is just nice-to-have UX"             | Without streaming, P99 4s feels broken; with streaming, 4s feels instant | Always stream user-facing; non-stream only for batch jobs     |
| "Per-request rate limit is enough"              | One bad tenant runs $50K/day on `for i in range(100000)`                 | **Per-tenant token budget** + circuit breaker                 |
| "Guardrail = OpenAI moderation API"             | Misses prompt injection, PII, hallucination                              | Layered: input validator + output classifier + citation check |
| "Embed once, store forever"                     | Embedding model upgrades break similarity scores                         | Version embeddings; re-embed on model bump                    |

---

### A7. 🎯 Interview Pattern — How to recognize and open

**Trigger keywords:**

- "Design a chatbot that answers from our documentation"
- "How would you build Notion AI / Intercom Fin / Glean?"
- "Design an internal Slack bot using LLMs"
- "How do you control hallucinations at scale?"
- "We want to add AI to our product, how do you start?"

**Opening (1-2 sentences, memorize):**

> "I'd treat this as a system design problem with an LLM as one component. The 6 layers are retrieval, prompt, model, eval, cost, guardrail — let me clarify scale (QPS, doc count, latency SLO, accuracy bar) then design each layer with explicit failure modes."

That sentence alone signals **Senior+ thinking** — you're not "an OpenAI wrapper engineer".

---

### A8. 🔑 Knowledge Chain

**📚 Prerequisites (đọc trước):**

- [shared/06-ai-and-agents/02-llm.md](../shared/06-ai-and-agents/02-llm.md) — LLM fundamentals
- [shared/06-ai-and-agents/04-rag.md](../shared/06-ai-and-agents/04-rag.md) — RAG basics
- [shared/02-system-design/01-fundamentals.md](../shared/02-system-design/01-fundamentals.md) — general SD
- [03-vector-databases-embeddings.md](./03-vector-databases-embeddings.md) — vector storage layer

**➡️ Enables (học sau):**

- [09-ai-agent-evaluation-production.md](./09-ai-agent-evaluation-production.md) — eval + guardrails deep dive
- [shared/06-ai-and-agents/03-agent-patterns.md](../shared/06-ai-and-agents/03-agent-patterns.md) — multi-step agents on top of this stack
- [shared/06-ai-and-agents/07-ai-system-design.md](../shared/06-ai-and-agents/07-ai-system-design.md) — broader AI SD

---

## 💬 Block B — Interview Q&A

> Order: 🟢 Junior → 🟡 Mid → 🔴 Senior. 🔴 answers use Bloom's L4-L6 (analyze/evaluate/create).

---

### B1. 🟢 Q1: "What is RAG and why use it instead of fine-tuning?"

**💡 Interview Signal:**

- ✅ **Strong:** mentions freshness, citation, cost, per-tenant data isolation
- ❌ **Weak:** "RAG is just searching docs and giving them to GPT"

**EN:** Retrieval-Augmented Generation injects relevant context retrieved from a knowledge base into the prompt at query time. We use it instead of fine-tuning when (a) data changes frequently, (b) we need source citations, (c) per-tenant or per-user data isolation, or (d) we cannot afford the training cost. Fine-tuning is for **behavior/style** changes; RAG is for **knowledge** updates.

**VI tăng cường:** RAG = "đọc tài liệu trước khi trả lời". Fine-tune = "học thuộc trong não". Khi tài liệu đổi mỗi ngày (docs, ticket, code) → RAG. Khi muốn model nói theo giọng riêng (brand voice, format JSON) → fine-tune. Đa số use case production là RAG.

---

### B2. 🟢 Q2: "What goes into a good prompt for production?"

**💡 Interview Signal:**

- ✅ Role + task + format + constraints + examples + escape hatch ("if unsure, say…")
- ❌ "Just be specific"

**EN:** Six elements: (1) **Role**: who the model is. (2) **Task**: clear single objective. (3) **Format**: exact output schema (JSON example, markdown structure). (4) **Constraints**: what NOT to do. (5) **Few-shot examples**: 2-5 input/output pairs anchoring style. (6) **Escape hatch**: instruction to refuse or say "I don't know" when uncertain — prevents hallucination.

**VI:** Prompt tốt = vai trò + nhiệm vụ + format + ràng buộc + ví dụ + lối thoát. Thiếu lối thoát → model bịa khi không biết. Thiếu format → output không parse được → app crash.

---

### B3. 🟢 Q3: "Why stream LLM responses?"

**💡 Interview Signal:**

- ✅ Perceived latency, abort cost, progressive UX
- ❌ "It's a UI thing"

**EN:** Three reasons: (1) **Perceived latency** — first-token-time of 400ms feels instant even if total takes 5s. (2) **Abort savings** — user can cancel mid-generation if they see the answer is wrong, saving tokens. (3) **Progressive rendering** — UI can render markdown/code incrementally. Use **SSE** for one-way (most chat), **WebSocket** for bi-directional (voice agents).

**VI:** Stream = từng chữ một. User thấy chữ đầu sau 0.4s → cảm giác nhanh dù tổng 5s. Không stream → màn hình trắng 5s = "app hỏng".

---

### B4. 🟡 Q4: "How do you handle hallucinations in production?"

**💡 Interview Signal:**

- ✅ Multi-layered: prompt design + grounding + post-hoc verification + human-in-loop for high-stakes
- ❌ "Use a better model" / "Lower temperature"

**EN:** Layered defense:

1. **Grounding via RAG**: only let model answer from retrieved context; instruct "answer only from sources below; if not present, say 'I don't have that information'."
2. **Citation requirement**: model must output `[doc:123]` for each claim; post-process to verify the doc exists and contains the claim.
3. **Self-consistency**: for critical queries, sample 3 answers at temp=0.7; if they disagree, route to human or larger model.
4. **LLM-as-judge post-check**: cheaper model verifies "does the answer follow from the context?" — block if no.
5. **Domain-specific validators**: for SQL agent, syntax-check + dry-run; for code, run tests; for math, symbolic check.
6. **Human-in-loop** for medical, legal, financial — never auto-send.

Temperature alone doesn't fix hallucinations; it just makes them more confident.

**VI:** Không có viên đạn bạc. 6 lớp: grounding + bắt cite nguồn + sampling self-consistency + LLM-as-judge + domain validator + human-in-loop cho high-stakes. Ai trả lời "lower temperature" → fail Senior round.

---

### B5. 🟡 Q5: "Design a semantic cache. Cache key, hit logic, invalidation."

**💡 Interview Signal:**

- ✅ Tenant isolation, embedding model in key, TTL, version bump
- ❌ Just `Redis.get(prompt)`

**EN:**

- **Key**: `sha256(tenant_id + model + prompt_template_version + system_prompt_hash)` for exact part; **embedding(query_user_part)** for fuzzy part.
- **Hit logic**: lookup by exact key → if miss, ANN search in vector cache by embedded query, hit if `cosine_sim ≥ 0.97`. Two thresholds: `≥0.99` return immediately; `0.97-0.99` return with "show similar question" UX.
- **Storage**: Redis for exact + small vector index (FAISS/pgvector) for fuzzy.
- **TTL**: 24h default; 1h for time-sensitive (news, prices); never for legal/medical (no cache).
- **Invalidation**: bump `prompt_template_version` on prompt change → all old keys auto-miss; doc update → invalidate cache entries whose retrieved context included that doc (track via reverse index).

**VI:** Cache phải có tenant_id, model name, version. Hit dùng cosine ≥ 0.97. Invalidation = bump version, không cần xóa từng key.

---

### B6. 🟡 Q6: "How do you do cost control for an LLM app?"

**💡 Interview Signal:**

- ✅ Per-tenant budgets, model routing, prompt caching, batch API, observability
- ❌ "Just monitor the bill"

**EN:** Five levers:

1. **Model routing** (cheapest model that works) — 50-80% cost cut.
2. **Prompt caching** (Anthropic / OpenAI cached input pricing) — 90% cut on stable system prompts.
3. **Per-tenant token budget** in Redis: `INCRBY tenant:{id}:tokens:day` with daily reset; reject at 100% of limit, alert at 80%.
4. **Batch API** for non-realtime (50% off on OpenAI/Anthropic) — analytics, embeddings backfill, eval runs.
5. **Cost-attributed observability**: every span tagged with `tenant_id, feature, model, input_tok, output_tok, cost_usd`. Dashboard by feature → kill features with bad cost/value ratio.

**VI:** 5 đòn: route model rẻ → cache prompt → budget per tenant → batch khi không real-time → đo cost theo feature.

---

### B7. 🔴 Q7 (Bloom L5 - Evaluate): "Compare RAG vs fine-tuning vs long-context for a 'company knowledge assistant' over 50K internal docs."

**💡 Interview Signal:**

- ✅ Acknowledges multi-dimensional trade-offs (freshness, cost, accuracy, security, ops complexity)
- ❌ Picks one without conditions

**EN:**
| Dimension | RAG | Fine-tune | Long-context (1M tok) |
|-----------|-----|-----------|----------------------|
| Freshness | ✅ Real-time (re-index) | ❌ Stale until retrain | ⚠️ Re-pack context per query |
| Cost / query | $$ (retrieval + small context) | $ (no retrieval) | $$$$ (massive input) |
| Cost / setup | $ | $$$ (training) | $ |
| Accuracy on niche | High w/ good retrieval | Highest if data clean | Medium (lost-in-middle) |
| Citations | ✅ Native | ❌ Hard | ⚠️ Possible but flaky |
| Per-user isolation | ✅ Easy (filter at retrieval) | ❌ Need per-user model | ⚠️ Per-user context pack |
| Security / data residency | ✅ Data stays in your DB | ❌ Data baked in weights | ⚠️ Sent to provider every call |
| Latency | Medium (+200ms retrieval) | Low | High (process huge context) |

**Recommendation for 50K docs:** **RAG primary**, optional fine-tune for **format/tone** of answers (not knowledge), long-context only as fallback for queries needing 20+ chunks of context. Fine-tune alone fails on freshness; long-context alone burns money and hits lost-in-middle.

**VI:** RAG là default. Fine-tune dùng cho giọng văn, không cho kiến thức (vì update khó). Long-context chỉ dùng khi 1 câu cần nhìn nhiều chunk cùng lúc, vì đắt và rớt accuracy ở giữa.

---

### B8. 🔴 Q8 (Bloom L6 - Create): "Design Slack 'Ask AI' for an enterprise: 50K docs, 10K DAU, P95 < 3s, $0.01 max per query, multi-tenant, GDPR."

**💡 Interview Signal:**

- ✅ Clarifying questions first; designs all 6 layers; calls out trade-offs; capacity numbers
- ❌ Jumps to "use OpenAI + Pinecone"

**EN: Structured answer (5 minutes spoken)**

**Step 1 — Clarify (30s):** "Are docs static or live-updated? Sync or async (slash command vs background)? Is 'GDPR' = EU data residency, or just deletion right? Per-tenant isolation strict (no cross-leak) or shared embeddings ok?"

**Step 2 — Capacity (30s):**

- 10K DAU × 5 queries/day = 50K queries/day = ~0.6 QPS avg, peak ~5 QPS
- Doc corpus: 50K docs × avg 5 chunks = 250K vectors; 1536-dim → ~1.5GB index
- Token budget: $0.01/query × 50K = $500/day = $15K/month — feasible

**Step 3 — Architecture (3 min):**

```
Slack Event → API Gateway → Auth (workspace token)
   → Guardrail in (PII redact, prompt injection check)
   → Semantic cache (Redis + pgvector, tenant-scoped)
       └ hit ≥0.99 → return; 0.97-0.99 → return with "similar question" UX
   → Retrieval:
       ├ Vector: pgvector (EU region for GDPR) top-50, filter by tenant_id
       ├ BM25: OpenSearch top-50, filter by tenant_id
       ├ RRF merge → top-20
       └ Cohere Rerank EU → top-5
   → Prompt build: system (cached) + 5 chunks + user question + cite-or-refuse footer
   → Model router:
       ├ Classifier: simple Q (≥80%) → Haiku, complex → Sonnet
       └ Fallback: low confidence or Anthropic 429 → GPT-4o-mini
   → Stream response via Slack Block Kit progressive update
   → Guardrail out: citation verifier (every [doc:N] must exist), toxicity scan
   → Async: log to OTel + Langfuse, increment per-tenant token counter
```

**Step 4 — Critical decisions (1 min):**

- **EU residency**: pgvector + Cohere EU + Anthropic EU endpoint; never call US OpenAI for EU tenants. Per-tenant config.
- **Multi-tenant isolation**: tenant_id is mandatory filter at vector + BM25 + cache key. Audit log every retrieval with tenant_id.
- **Cost guardrail**: Redis `INCRBY tenant:{id}:tokens:day`; hard cap at quota; soft warning at 80% via Slack DM to admin.
- **Eval**: 200-question golden set per top tenant; nightly run; gate deploy if accuracy drops > 3%.

**Step 5 — Trade-offs admitted (30s):**

- Skipped fine-tuning: not worth complexity for v1.
- Skipped GraphRAG: corpus not relational enough.
- Accept: P99 spikes during reindex; mitigation = blue-green index swap.

**VI:** Trả lời theo 5 bước: clarify → capacity → architecture → critical decisions → trade-offs admitted. Không nhảy thẳng vào tech stack. Phải nhắc GDPR (EU region cho mọi component), multi-tenant (filter ở mọi tầng), cost cap per tenant (Redis counter).

---

### B9. 🔴 Q9 (Bloom L4 - Analyze): "Your LLM app's P99 went from 2s to 12s overnight. Walk me through diagnosis."

**💡 Interview Signal:**

- ✅ Layered diagnosis matching the 6-layer stack; uses traces; doesn't blame the model first
- ❌ "Switch to a faster model"

**EN: Diagnosis tree:**

```
P99 spike 2s → 12s
   │
   ├─ Step 1: Check OTel trace breakdown by layer
   │    Which span got slower? Retrieval? Model? Guardrail?
   │
   ├─ Step 2: Time correlation
   │    What deployed in last 24h? Index re-build? Prompt change?
   │    Model version auto-bump (e.g., gpt-4o-2024-11 → 2025-03)?
   │
   ├─ Step 3: Per-tenant breakdown
   │    Is it 1 noisy tenant or system-wide?
   │    Hot tenant = capacity issue. System-wide = infra/model issue.
   │
   ├─ Step 4: Hypothesis matrix
   │    a) Model provider degradation → check status page + alt provider latency
   │    b) Retrieval slowdown → vector DB CPU, index size, cold cache
   │    c) Prompt bloat → avg input tokens trend (someone added context)
   │    d) Cache miss surge → cache hit rate metric
   │    e) Network → P99 in different regions
   │
   └─ Step 5: Bisect & fix
        Roll back recent change first; if no recent change, escalate to provider
        and route traffic to fallback model.
```

**Most common real cause (2024-2025 disclosed incidents):** prompt bloat — engineer added "more context = better" without measuring → input tokens 4K→12K → model latency 2x + cost 3x. Fix: token budget enforcer in middleware.

**VI:** Diagnose theo trace từng tầng, không đoán. Hỏi: deploy gì 24h qua? 1 tenant hay all? Provider status page? Retrieval span thế nào? Cache hit rate? Lỗi #1 thực tế là **prompt bloat** — ai đó nhồi thêm context không đo lường.

---

### B10. 🔴 Q10 (Bloom L5 - Evaluate): "Is LLM-as-judge reliable enough for production eval gating?"

**💡 Interview Signal:**

- ✅ Acknowledges biases, calibration, when to trust, when to require human
- ❌ "Yes, GPT-4 is smart" / "No, never trust LLM"

**EN:** **It depends on the metric and calibration.**

Reliable for: **format compliance, refusal correctness, factual entailment with retrieved context, comparative ranking** (A vs B). Inter-judge agreement with humans on these: 75-90% (per Anthropic, OpenAI, and Zheng et al. 2023).

Unreliable for: **subtle correctness in domains the judge doesn't know** (medical accuracy with general LLM judge), **subjective quality** (which answer is "more helpful"), **safety in adversarial settings**.

Known biases:

- **Position bias**: prefers first answer in pairwise → randomize order.
- **Length bias**: prefers longer answers → control for length or use length-normalized score.
- **Self-preference**: GPT-4 prefers GPT-4 outputs → use a different model family as judge than the one being evaluated.
- **Verbosity bias**: confident-sounding wrong answer > hedged correct answer → use rubric with explicit criteria.

**Calibration protocol:** sample 200 LLM-judged items, have humans label, compute Cohen's kappa. Trust LLM judge in CI gating only if kappa ≥ 0.7 on the specific metric. For lower kappa, use LLM judge for **prioritization** (which examples to send to humans), not gating.

**VI:** LLM-as-judge dùng được cho format, refusal, entailment, ranking — nhưng phải cross-check Cohen's kappa với người ≥ 0.7 trước khi cho gate CI. Có 4 bias: position, length, self-preference, verbosity → phải khử trước.

---

### B11. 🔴 Q11 (Bloom L6 - Create): "Design eval pipeline: offline regression + online quality + cost. Triggers, storage, alerts, gate logic."

**💡 Interview Signal:**

- ✅ Three layers (offline, online, cost), explicit gates with thresholds, rollback plan
- ❌ "Run it on a test set"

**EN: Three-tier eval system:**

```
┌──────────────────────────────────────────────────────┐
│  TIER 1: OFFLINE — runs on every PR + nightly        │
├──────────────────────────────────────────────────────┤
│  Inputs: golden set (500 curated Q+expected facts)   │
│  Metrics:                                            │
│    - Faithfulness (answer ⊂ context) via LLM judge  │
│    - Answer correctness (semantic match)             │
│    - Citation accuracy (cited doc contains claim)    │
│    - Refusal correctness (refuses what it should)    │
│  Storage: results in PostgreSQL + per-PR diff in CI │
│  Gate: BLOCK merge if faithfulness drop > 3%        │
└──────────────────────────────────────────────────────┘
                       │
                       ▼ (after deploy)
┌──────────────────────────────────────────────────────┐
│  TIER 2: ONLINE — live traffic sampling              │
├──────────────────────────────────────────────────────┤
│  Sample: 5% of prod traffic (more for low-traffic)   │
│  Async LLM-as-judge on each sampled response         │
│  Storage: ClickHouse (append-only, cheap)            │
│  Metrics: faithfulness, helpfulness (1-5), refusal  │
│  Alert: PagerDuty if faithfulness < 90% in 15min    │
│  Gate: auto-rollback if < 80% in 5min (circuit break)│
└──────────────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│  TIER 3: COST — every request                        │
├──────────────────────────────────────────────────────┤
│  Tags: tenant, feature, model, input_tok, output_tok│
│  Storage: ClickHouse + Grafana                       │
│  Alert: per-tenant > 80% budget, feature CPM jump   │
│  Action: auto-throttle, route to cheaper model      │
└──────────────────────────────────────────────────────┘
```

**Trade-offs admitted:** LLM-judge in online tier costs ~$200/day at 5% sample. Acceptable vs. value of catching regression in 15 min instead of via user complaint. Golden set requires curation — assign one engineer per quarter to grow it from incident postmortems.

**VI:** 3 tier — offline gate PR, online sample 5% live, cost mọi request. Mỗi tier có ngưỡng và action rõ. LLM-judge online tốn $200/ngày nhưng đáng vì catch regression 15 phút thay vì chờ user phàn nàn.

---

### B12. 🔴 Q12 (Bloom L5 - Evaluate): "When would you build an agent vs a single LLM call vs a workflow?"

**💡 Interview Signal:**

- ✅ Decision rubric based on determinism, action space, cost tolerance, audit needs
- ❌ "Agents are the future, always agents"

**EN:**

| Property       | Single call                        | Workflow (chain/graph)                   | Agent (loop)                               |
| -------------- | ---------------------------------- | ---------------------------------------- | ------------------------------------------ |
| Determinism    | ✅ High                            | ✅ High                                  | ❌ Low                                     |
| Action steps   | 1                                  | Fixed N                                  | Variable, model-decided                    |
| Cost / latency | Lowest                             | Medium                                   | Highest, unbounded                         |
| Debuggability  | ✅ Easy                            | ✅ Easy                                  | ❌ Hard                                    |
| When to use    | Classification, summarize, extract | Known multi-step (RAG = retrieve→answer) | Open-ended task with tool use, exploration |

**Rule of thumb:** start with single call. Move to workflow when the task has **known stages**. Move to agent only when **the steps cannot be enumerated ahead of time** AND you have eval + cost guardrails. Anthropic's 2024 guidance: "most production systems should be workflows, not agents."

**VI:** Mặc định: single call. Có nhiều bước cố định → workflow. Bước không đoán trước được + có eval/cost guard → mới agent. Anthropic khuyến nghị: đa số production nên là workflow, không phải agent. Đừng dùng agent vì "trendy".

---

## 🧪 Block C — Study Cases (Real-Named Companies)

### C1. Notion AI — From outage to scale (2024 → 2025)

**Context:** Notion launched "Q&A" — answer from any workspace doc. Day-1 disasters disclosed in their 2025 engineering blog: 28s P99, $40K/day burn, 12% wrong-page citations.

**Root causes found:**

1. **No reranker** — vector-only retrieval pulled tangentially-related pages.
2. **No semantic cache** — every query hit OpenAI even for repeated FAQ.
3. **All-large model** — used GPT-4 for "what's the meeting time" too.
4. **No per-workspace budget** — one enterprise customer's bot loop burned $8K in 4 hours.
5. **No offline eval gate** — prompt changes shipped without regression check.

**Fixes (over 6 months):**

- Added hybrid retrieval (vector + BM25) + Cohere rerank → citation accuracy 67% → 94%.
- Semantic cache with 0.97 cosine threshold → 38% cache hit on common queries → cost cut 40%.
- Model router (small for "lookup", large for "synthesize") → cost cut another 35%.
- Per-workspace token budget + circuit breaker → no runaway tenants.
- Golden eval set + LLM-judge in CI → caught 14 regressions in following quarter.

**Lesson:** All 5 fixes are **system design**, zero are "better model". The 6-layer stack exists because Notion (and Klarna, Intercom, Linear) each rediscovered it the painful way.

---

### C2. Klarna AI Assistant — Aggressive cost engineering (2024 disclosed)

**Context:** Klarna replaced 700 customer-service agents with AI assistant in 23 markets, 35 languages. Disclosed: handles 2.3M conversations/month, equivalent to 700 FTE.

**Engineering choices (from their public talks):**

- **Tiered model routing**: 80% Haiku, 18% Sonnet, 2% Opus. Blended cost per conversation: ~$0.02.
- **Heavy caching** by intent class (refund / track / cancel / general) — 60%+ cache hit on common flows.
- **Domain workflows over agents** — most flows are deterministic state machines invoking LLM only at "explain to user" steps.
- **Per-language eval set** — 35 golden sets, nightly LLM-judge + monthly human spot check.

**Anti-pattern they avoided:** they did NOT build "one big agent that figures everything out". They built ~60 narrow workflows, each LLM-augmented at specific points.

**Lesson for interview:** when the question is "design customer service AI", workflow-of-LLM-calls beats "agent that does everything", and tiered routing is the cost story.

---

### C3. Intercom Fin — Hallucination control playbook (2024-2025)

**Context:** Intercom Fin answers customer support from a business's help center. Stake: wrong answer = bad CX or financial liability.

**Their disclosed multi-layer hallucination defense:**

1. **Strict grounding**: model is told "answer ONLY from sources below; refuse otherwise." Refusal rate intentionally tuned to ~15% — better than wrong.
2. **Citation post-validator**: every claim must map to a source span; if not, regenerate or refuse.
3. **Confidence thresholding**: low-confidence answers → "I'll connect you with a human" handoff.
4. **Per-customer eval pack**: customers can upload their own test set; Fin runs it on every model upgrade and shows them the diff.
5. **Audit log**: every answer + sources + model + version stored for 90 days for legal traceability.

**Headline result:** 50%+ of Intercom customer support queries resolved end-to-end without human, with measured CSAT comparable to human agents on resolved queries.

**Lesson:** "refuse > guess" is a product decision, not a model limitation. Senior engineers design **refusal** as a first-class feature, not a fallback.

---

## 📋 C2. Interview Q&A Summary

| #   | Question                    | Difficulty | Core Concept        | Key Signal                                            |
| --- | --------------------------- | ---------- | ------------------- | ----------------------------------------------------- |
| 1   | RAG vs fine-tuning          | 🟢         | RAG basics          | Mentions freshness, citation, cost, isolation         |
| 2   | Good prompt elements        | 🟢         | Prompt arch         | Six elements incl. escape hatch                       |
| 3   | Why stream                  | 🟢         | UX latency          | Perceived latency + abort savings                     |
| 4   | Hallucination control       | 🟡         | Eval & guardrail    | Multi-layer, not "lower temp"                         |
| 5   | Semantic cache design       | 🟡         | Caching             | Tenant in key, cosine threshold, version invalidation |
| 6   | Cost control levers         | 🟡         | Cost                | Routing + caching + budget + batch + observability    |
| 7   | RAG vs FT vs long-context   | 🔴         | Trade-off analysis  | Multi-dimensional, conditional answer                 |
| 8   | Design Slack Ask AI         | 🔴         | Full system design  | 6 layers + capacity + GDPR + multi-tenant             |
| 9   | Diagnose P99 spike          | 🔴         | Production debug    | Trace per-layer, hypothesis tree, recent change first |
| 10  | LLM-as-judge reliability    | 🔴         | Eval methodology    | Calibration with kappa, known biases                  |
| 11  | Eval pipeline design        | 🔴         | Full eval system    | Offline gate + online sample + cost tier              |
| 12  | Agent vs workflow vs single | 🔴         | Architecture choice | Default to workflow, agent only when steps unknown    |

---

## ⚡ C3. Cold Call Simulation (30-Second Answer)

**Interviewer:** _"Quick one — design a chatbot answering from our 10K-doc knowledge base. 30 seconds."_

**You (4 sentences):**

> "I'd build the 6-layer LLM stack: hybrid retrieval — pgvector plus BM25 with reciprocal rank fusion and a Cohere reranker — feeding top-5 chunks into a prompt with strict grounding and citation requirements. A small model handles 80% of queries with Sonnet as fallback for complex ones, behind a semantic cache keyed by tenant plus prompt-version. I'd add per-tenant token budgets in Redis and stream responses with an output guardrail that verifies every citation. For eval, an offline golden set gates deploys and a 5% online sample runs LLM-as-judge to catch live regressions."

**Interviewer follow-up:** _"What's your biggest risk?"_

**You:** _"Hallucination on questions where retrieval misses. Mitigation: tune for high refusal rate over false answers, and instrument every refusal so we can grow the doc base where users actually ask."_

---

## 🪞 C4. Self-Check Retrieval (Close the Doc First)

Test 5 dimensions without looking:

1. **Retrieval (recall):** List the 6 layers of the LLM stack from memory. (RPMECG mnemonic.)
2. **Visual (reproduce):** Sketch the request flow diagram from §A2 on paper.
3. **Application (apply):** Given "design AI for medical Q&A", which layers tighten and how? (Hint: refusal threshold, human-in-loop, audit log, EU/HIPAA region.)
4. **Debug (diagnose):** Symptom — cost 3x'd overnight, no traffic change. Top 3 hypotheses?
5. **Teach (Feynman):** Explain "semantic cache vs exact cache" to a backend engineer who's never used embeddings, in 90 seconds.

If you fail any → re-read that section, then retry tomorrow.

---

## 💬 C5. Feynman Prompt

**Take 3 minutes. Explain to a junior backend engineer (no AI background):**

> "Why do we need a 'reranker' when we already have vector search and BM25? Aren't two retrievers enough?"

Your answer should:

- Use one analogy (e.g., resume screen vs. interview).
- Mention that vector + BM25 are **fast & cheap recall** (cast a wide net, top-50), reranker is **slow & accurate precision** (cross-attend query+doc, top-5).
- Cite the production number: 67% → 78% → 89% accuracy at +$0.001/query cost.
- End with: "skip the reranker if cost-constrained and corpus is small; never skip if answers are user-facing."

---

## 🔁 C6. Spaced Repetition Schedule

| Interval      | What to do                                                                             |
| ------------- | -------------------------------------------------------------------------------------- |
| Day 1 (today) | Read once, do Self-Check (C4).                                                         |
| Day 3         | Re-do Self-Check from memory; re-draw the 6-layer diagram.                             |
| Day 7         | Teach the Feynman prompt to a peer or rubber duck; revise B7 trade-off table.          |
| Day 14        | Mock interview question B8 (full Slack Ask AI design, 5 min spoken) — record yourself. |
| Day 30        | Re-read only the 🔴 questions (B7-B12); attempt B11 eval pipeline on whiteboard.       |
| Quarterly     | Re-check provider pricing & model names — this file uses 2025-Q4 reality; refresh.     |

---

## 🔗 C7. Connections

**Same-track (2026-trends):**

- [01-ai-augmented-engineering.md](./01-ai-augmented-engineering.md) — how YOU use AI; this file is how you BUILD with AI.
- [03-vector-databases-embeddings.md](./03-vector-databases-embeddings.md) — the storage layer for retrieval.
- [09-ai-agent-evaluation-production.md](./09-ai-agent-evaluation-production.md) — Tier 1/2/3 eval deeper dive.
- [10-senior-engineer-ai-era.md](./10-senior-engineer-ai-era.md) — judgment for AI architecture decisions.

**Cross-track (existing knowledge base):**

- [shared/06-ai-and-agents/02-llm.md](../shared/06-ai-and-agents/02-llm.md) — LLM internals.
- [shared/06-ai-and-agents/03-agent-patterns.md](../shared/06-ai-and-agents/03-agent-patterns.md) — Anthropic 5 agent patterns.
- [shared/06-ai-and-agents/04-rag.md](../shared/06-ai-and-agents/04-rag.md) — RAG fundamentals.
- [shared/06-ai-and-agents/07-ai-system-design.md](../shared/06-ai-and-agents/07-ai-system-design.md) — broader AI SD interview.
- [shared/02-system-design/01-fundamentals.md](../shared/02-system-design/01-fundamentals.md) — general distributed systems baseline.
- [be-track/02-backend-knowledge/02-microservices.md](../be-track/02-backend-knowledge/02-microservices.md) — service patterns relevant to LLM router.
- [be-track/02-backend-knowledge/07-resilience-patterns.md](../be-track/02-backend-knowledge/07-resilience-patterns.md) — circuit breaker / retry / fallback for model calls.

---

> **Next file:** [03-vector-databases-embeddings.md](./03-vector-databases-embeddings.md) — the storage and retrieval substrate for everything in this stack.
