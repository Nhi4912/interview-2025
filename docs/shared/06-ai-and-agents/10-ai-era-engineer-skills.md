# AI-Era Engineer Skills / Kỹ Năng Kỹ Sư Thời Đại AI

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior | **L5 Competencies**: Technical Mastery (20pts), Adaptability (15pts), Innovation (10pts)
> **Prerequisites**: [ML Fundamentals](./01-ml-fundamentals.md) | [LLM & Transformers](./02-llm-and-transformers.md) | [AI Engineering Practice](./05-ai-engineering-practice.md)
> **See also**: [Claude & Anthropic Deep Dive](./09-claude-and-anthropic-deep-dive.md) | [Agent Patterns](./03-agent-patterns.md)

---

## 🌍 Real-World Scenario / Tình Huống Thực Tế

> **Scenario**: Bạn đang phỏng vấn vị trí Senior Engineer tại một công ty startup Series B ở TP.HCM. Sau 45 phút làm bài leetcode quen thuộc, interviewer hỏi: _"Tell me about the last time you used AI tools in your workflow. What did you build, how did you evaluate it, and what were the failure modes?"_
>
> Candidate A: _"Tôi dùng Copilot để autocomplete code."_ ← 🔴 Weak signal
>
> Candidate B: _"Tôi integrate Claude API vào một internal tool: dùng RAG để search codebase, implement semantic cache giảm 60% API cost, viết LLM-as-judge evals để catch regression khi team update prompt. Khi tôi fail, thường do context window overflow hoặc hallucination với domain-specific logic — tôi handle bằng cách add structured output schema và golden test set."_ ← ✅ Strong signal — L5 competency visible

**Tại sao file này quan trọng?** StackOverflow 2024 Developer Survey: 76% developers đã dùng AI tools. Big tech (Google, Meta) bây giờ require AI system design cho L5+. Việc biết _sử dụng_ AI là baseline; biết _xây dựng, đánh giá, và failure modes_ của AI features mới là competitive advantage.

---

## 💡 What & Why / Cái Gì & Tại Sao

### Feynman-First Analogy

Hãy tưởng tượng bạn được trao một **cộng sự siêu thông minh nhưng đôi khi phịa số liệu, không nhớ hôm qua làm gì, và không biết codebase của bạn**. Kỹ năng AI-era engineer là học cách làm việc hiệu quả với người cộng sự đặc biệt đó:

- **Nói chuyện rõ ràng** (prompt engineering) — cộng sự không đọc được ý bạn
- **Cho context đầy đủ** (RAG, codebase indexing) — cộng sự có amnesia
- **Verify kết quả** (evals, testing) — cộng sự hay tự tin khi sai
- **Biết khi nào KHÔNG dùng** (ethics, safety) — cộng sự không có judgment

**Tại sao NOW?** Ba yếu tố hội tụ vào 2023–2025:

1. **API access**: GPT-4, Claude 3.5, Gemini — production-grade LLMs available as API
2. **Cost collapse**: GPT-4 cost giảm 99% từ 2023 → 2025 (từ $0.06/1K tokens → $0.0005/1K)
3. **Tooling maturity**: Vercel AI SDK, LangChain, LlamaIndex — engineering patterns đã established

---

## 🗺️ Concept Map / Bản Đồ Khái Niệm

```
                        AI-ERA ENGINEER SKILLS
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
    AUGMENTED DEV         AI SYSTEMS            RESPONSIBLE AI
    (Day-to-day work)    (Architecture)         (Ethics/Safety)
          │                    │                    │
    ┌─────┴─────┐        ┌─────┴─────┐        ┌─────┴─────┐
  Copilot    Claude    RAG Pipeline  Agent   Bias      Guardrails
  Cursor     v0        Vector Store  Loop    Detection  Filtering
    │                    │                    │
    └────────────────────┴────────────────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
        INTEGRATION               EVALUATION
        (LLM APIs,               (LLM-as-Judge,
         Streaming,               Golden Sets,
         Caching,                 A/B Testing,
         Cost Mgmt)               Regression)
              │                       │
              └───────────┬───────────┘
                          │
                  PROMPT ENGINEERING
                  (Zero-shot, Few-shot,
                   CoT, ReAct, System Prompts,
                   Structured Output)
                          │
                  T-SHAPED ENGINEER
                  (Junior → Mid → Senior → Staff)
                  (Use → Build → Design → Strategize)
```

---

## 📚 Block A — Theory / Nền Tảng Lý Thuyết

---

### Concept 1: AI-Augmented Development / Phát Triển Hỗ Trợ Bởi AI

#### 🧠 Memory Hook

> **"AI is a 10× junior who codes instantly, never sleeps, but always needs review."**
> AI là junior coder thần tốc — không mệt, không ngủ, nhưng luôn cần review.

#### Why does this exist?

1. **Why does AI coding help?** → Neural models trained on billions of lines of code học được patterns, idioms, API signatures — thứ mà developer phải mất năm trời để hấp thụ.
2. **Why can't we just trust it blindly?** → Models predict next token, không _hiểu_ logic — chúng không biết business rule của bạn, security constraints, hay side effects. Cần human judgment như "senior reviewing junior's PR."

#### Layer 1 — Simple Analogy / Ẩn Dụ Đơn Giản

Dùng AI coding tool như dùng **GPS**: nó gợi ý đường tốt nhất, nhưng bạn vẫn quyết định có theo không, và đôi khi nó dẫn vào đường cụt. Bạn vẫn là lái xe — AI là navigation assistant.

#### Layer 2 — How It Works / Cách Hoạt Động

**GitHub Copilot**: FIM (Fill-In-the-Middle) model — nhận prefix + suffix code, fill vào giữa. Workspace agent có thể index toàn bộ codebase, call tools, run tests.

**Cursor**: Editor-level context injection. Composer mode gửi cả conversation + file context → model. Codebase @-mentions index via treesitter + embeddings.

**Claude Code**: Agentic loop — Claude nhận task, plan steps, call bash/edit/read tools, iterate. Multi-file edits. Test-driven by default. Research: Google internal study 2023 → 25% faster task completion with AI assistance.

**v0 by Vercel**: Diffusion-style UI generation. Input: text description → Output: React + Tailwind JSX. Uses Anthropic models under the hood.

```typescript
// Example: Using Vercel AI SDK for streaming
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

async function generateCode(prompt: string) {
  const { textStream } = await streamText({
    model: anthropic("claude-3-5-sonnet-20241022"),
    system: `You are an expert TypeScript engineer. 
             Output clean, type-safe code with error handling.`,
    prompt,
    maxTokens: 2000,
  });

  for await (const chunk of textStream) {
    process.stdout.write(chunk);
  }
}
```

#### Layer 3 — Edge Cases / Gotchas

- **Security-critical code**: NEVER let AI write crypto primitives, auth logic, or SQL without expert review. Models learn from public repos including bad patterns.
- **Novel algorithms**: AI giỏi pattern-matching, không giỏi _discovery_. Dynamic programming với novel constraints → AI sẽ hallucinate solutions.
- **Understanding code**: Nếu bạn không hiểu code AI viết, bạn không thể debug nó. "Vibe coding" → technical debt accumulation.
- **Context poisoning**: Stale context trong long sessions → AI đề xuất code inconsistent với current state.

#### Common Mistakes Table

| ❌ Sai lầm                              | ✅ Đúng                                          | Lý do                                               |
| --------------------------------------- | ------------------------------------------------ | --------------------------------------------------- |
| Accept mọi suggestion của Copilot       | Review từng suggestion như reviewing junior PR   | Copilot không biết business logic                   |
| Dùng AI viết toàn bộ feature không hiểu | Dùng AI cho boilerplate, tự viết business logic  | Ownership & debuggability                           |
| Không test AI-generated code            | Write tests FIRST, dùng AI để pass tests         | AI code có thể pass happy path nhưng fail edge case |
| Paste sensitive data vào AI chat        | Dùng placeholder/anonymized data                 | Data privacy, potential training leakage            |
| Dùng AI cho security implementations    | Consult security experts + established libraries | Subtle bugs có thể không visible đến khi exploit    |

#### 🎯 Interview Pattern

**Câu hỏi**: "How do you use AI tools in your development workflow?"

**Framework — STAR+Limitation**:

1. **Situation**: Specific task/project
2. **Tool choice**: Why this tool, not another
3. **Result**: Measurable outcome
4. **Limitation acknowledged**: When you DIDN'T use AI and why
5. **Growth**: What you learned

**Red flag answer**: "I use Copilot for everything." → No critical thinking, no limitation awareness.

#### 🔑 Knowledge Chain

- **Requires**: Basic coding skills, ability to review code, understanding of your codebase
- **Enables**: Faster prototyping → [LLM Integration Patterns](#concept-4), [AI System Design](#concept-3)

---

### Concept 2: Prompt Engineering Mastery / Thành Thạo Prompt Engineering

#### 🧠 Memory Hook

> **"Prompts are function calls to a trillion-parameter brain — precision matters."**
> Prompt là function call đến bộ não nghìn tỷ tham số — càng chính xác, càng tốt kết quả.

#### Why does this exist?

1. **Why can't we just say what we want?** → LLMs are next-token predictors — họ respond theo statistical patterns learned during training. Framing, examples, và constraints shift the probability distribution toward better outputs.
2. **Why is this a skill and not a feature?** → Same model, different prompts → wildly different quality. Prompt engineering đang dần evolve thành "programming in natural language" — it requires precision, iteration, và understanding model behavior.

#### Layer 1 — Simple Analogy

Prompt engineering là viết **brief cho designer**: "Make it nice" → bad brief. "Design a mobile-first landing page with hero image, 3 feature callouts, CTA button in primary blue (#0070F3), inspired by Linear's clean aesthetic" → great brief. Level of specificity = quality of output.

#### Layer 2 — How It Works

**Zero-shot**: Không có ví dụ. Works for simple tasks.

```
"Translate this English text to Vietnamese: {{text}}"
```

**Few-shot**: Provide 2–5 examples để guide format/behavior.

```
"Classify sentiment:
Text: 'Amazing product!' → Positive
Text: 'Terrible experience.' → Negative
Text: 'It works fine.' → {{output}}"
```

**Chain-of-Thought (CoT)**: Instruct model to reason step-by-step trước khi answer. Dramatically improves multi-step reasoning.

```
"Solve this problem. Think step by step before giving the final answer."
```

**ReAct Pattern** (Reason + Act): Model interleaves reasoning với tool calls.

```
Thought: I need to find current stock price of AAPL
Action: search("AAPL current stock price")
Observation: AAPL is $189.30
Thought: Now I can answer the question
Answer: AAPL is currently $189.30
```

**Structured Output** — JSON mode để get parseable responses:

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface ExtractedData {
  entities: Array<{ name: string; type: string }>;
  sentiment: "positive" | "negative" | "neutral";
  summary: string;
}

async function extractStructured(text: string): Promise<ExtractedData> {
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    system: `You are a text analysis API. Always respond with valid JSON matching this schema:
{
  "entities": [{"name": "string", "type": "PERSON|ORG|LOCATION"}],
  "sentiment": "positive|negative|neutral",
  "summary": "string (max 100 words)"
}`,
    messages: [{ role: "user", content: text }],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Expected text response");
  return JSON.parse(content.text) as ExtractedData;
}
```

**System Prompts** — Role + Constraints + Format:

```
You are a senior TypeScript engineer reviewing code for a fintech app.
CONSTRAINTS:
- Flag any security issues as CRITICAL
- Only suggest changes that improve readability or correctness
- Reference TypeScript handbook sections when relevant
FORMAT: Respond as JSON: {"issues": [...], "overall_score": 1-10}
```

#### Layer 3 — Edge Cases / Gotchas

- **Prompt injection**: User input có thể override system prompt. Mitigation: input sanitization, delimiters (`user_input`), output validation.
- **Hallucination cascade**: CoT có thể "reason" confidently đến wrong answer. Mitigation: require citations, fact-check against retrieved context.
- **Context overflow**: Long prompts + long outputs > context window → truncation, coherence loss. Mitigation: dynamic context management, summarization.
- **Prompt brittleness**: Small wording changes → large output changes. Mitigation: A/B test prompts, maintain golden eval set.
- **Token cost explosion**: Verbose prompts × high traffic = significant cost. Mitigation: cache common prompts, use cheaper models for simple tasks.

#### Common Mistakes Table

| ❌ Sai lầm                              | ✅ Đúng                                                                           | Lý do                                       |
| --------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------- |
| Viết prompt vague: "Fix this code"      | "Fix the TypeScript type error on line 42. Do not change the function signature." | Specificity = predictability                |
| Không version control prompts           | Store prompts in git như code, track changes                                      | Prompt changes can silently break features  |
| Use same prompt cho tất cả tasks        | Match prompt technique to task complexity                                         | Zero-shot cho simple, CoT cho complex       |
| Không handle structured output failures | Validate JSON, retry on parse error                                               | Models don't always follow format perfectly |
| Ignore few-shot examples format         | Examples phải match desired output format exactly                                 | Model learns format from examples           |

#### 🎯 Interview Pattern

**Live prompt engineering** ngày càng phổ biến trong interviews. Interviewer cho một task, yêu cầu bạn viết prompt. Checklist:

1. Define role/persona
2. Specify constraints
3. Define output format
4. Provide 1-2 examples nếu needed
5. Think aloud về tradeoffs

#### 🔑 Knowledge Chain

- **Requires**: Understanding of LLM behavior, familiarity with use case
- **Enables**: Better RAG retrieval prompts → [AI System Design](#concept-3), Agent tool prompts → [Agent Patterns](./03-agent-patterns.md)

---

### Concept 3: AI System Design / Thiết Kế Hệ Thống AI

#### 🧠 Memory Hook

> **"RAG = Give the LLM amnesia medication — it can't remember your docs, so you fetch them."**
> RAG = Thuốc chữa mất trí nhớ cho LLM — nó không nhớ docs của bạn, nên bạn fetch cho nó.

#### Why does this exist?

1. **Why can't LLMs just know everything?** → Training cutoff, private data, hallucination về specific facts. LLM không biết Q3 2025 revenue của công ty bạn, hay nội dung codebase nội bộ.
2. **Why RAG instead of fine-tuning?** → Fine-tuning teaches _style/behavior_, không _knowledge_. Fine-tuning tốn $$$, chậm, cần re-train khi data thay đổi. RAG là real-time, dynamic, cheaper.

#### Layer 1 — Simple Analogy

RAG như **open-book exam**: thay vì yêu cầu student học thuộc mọi thứ (fine-tuning), bạn cho phép mang sách. Student (LLM) vẫn phải biết cách đọc, tìm thông tin, và synthesize — nhưng answers được grounded trong actual documents.

#### Layer 2 — How It Works

**RAG Pipeline** (5 bước):

```
1. CHUNKING: Split docs → chunks (512-1024 tokens, overlap 10-20%)
2. EMBEDDING: chunks → dense vectors (OpenAI text-embedding-3-small, Cohere, local)
3. INDEXING: Store vectors in vector DB (Pinecone, Qdrant, pgvector)
4. RETRIEVAL: Query → embed → similarity search → top-k chunks
5. GENERATION: [system prompt] + [retrieved chunks] + [user query] → LLM → response
```

```typescript
import { OpenAI } from "openai";
import { QdrantClient } from "@qdrant/js-client-rest";

const openai = new OpenAI();
const qdrant = new QdrantClient({ url: "http://localhost:6333" });

// Step 1: Embed query
async function embedText(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

// Step 2: Retrieve relevant chunks
async function retrieve(query: string, topK = 5) {
  const queryVector = await embedText(query);

  const results = await qdrant.search("my-collection", {
    vector: queryVector,
    limit: topK,
    with_payload: true,
  });

  return results.map((r) => r.payload?.text as string);
}

// Step 3: Generate with context
async function ragQuery(userQuery: string): Promise<string> {
  const chunks = await retrieve(userQuery);
  const context = chunks.join("\n\n---\n\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Answer based ONLY on the provided context. 
                  If the context doesn't contain the answer, say "I don't know."
                  Context:\n${context}`,
      },
      { role: "user", content: userQuery },
    ],
  });

  return response.choices[0].message.content ?? "";
}
```

**Hybrid Search** (BM25 + Dense Vectors): Kết hợp keyword matching (tốt cho proper nouns, IDs) với semantic search (tốt cho conceptual queries). Reranker (Cohere Rerank, cross-encoder) để merge results.

**Vector Store Comparison**:
| Store | Best For | Notes |
|-------|----------|-------|
| pgvector | Existing Postgres stack | No infra overhead |
| Qdrant | Production, high scale | Rust-based, fast |
| Pinecone | Managed cloud | Serverless option |
| Chroma | Prototyping | In-memory option |
| Weaviate | Multi-modal | GraphQL interface |

#### Layer 3 — Edge Cases / Gotchas

- **Chunking strategy matters**: Fixed-size chunking cuts sentences mid-thought. Better: semantic chunking (split on headings, paragraph boundaries) or recursive chunking.
- **Embedding model mismatch**: Embed với model A, query với model B → garbage results. Always use same model for indexing and retrieval.
- **Retrieval ≠ Relevance**: Top-k by cosine similarity ≠ most useful for answering. Reranking step dramatically improves precision.
- **Context window overload**: Retrieve too many chunks → LLM "lost in middle" phenomenon — information in middle of long context is often ignored.
- **Stale index**: Documents update but index doesn't → outdated answers. Need upsert pipeline triggered on document changes.

#### Common Mistakes Table

| ❌ Sai lầm                                  | ✅ Đúng                            | Lý do                                                         |
| ------------------------------------------- | ---------------------------------- | ------------------------------------------------------------- |
| Chunk size quá nhỏ (100 tokens)             | 512-1024 tokens với 10-20% overlap | Too small → no context; overlap preserves cross-chunk meaning |
| Only use semantic search                    | Hybrid search (BM25 + dense)       | Semantic misses exact matches (names, codes)                  |
| Skip reranking step                         | Add cross-encoder reranker         | Initial retrieval recall-focused, reranker precision-focused  |
| Embed queries và docs with different models | Same model for both                | Embedding spaces must align                                   |
| No source attribution                       | Include doc source in response     | Enables verification, builds trust                            |

#### 🎯 Interview Pattern

**"Design an AI-powered search system for our codebase"** — Common L5 system design.

**Framework — C.R.A.F.T.**:

- **C**ontext: What are users searching? Code, docs, both?
- **R**etrieval: Chunking strategy, embedding model choice, vector DB
- **A**ugmentation: How to inject retrieved context into prompt
- **F**allback: What if retrieval finds nothing relevant?
- **T**esting: How to evaluate search quality? (MRR, NDCG, LLM-as-judge)

#### 🔑 Knowledge Chain

- **Requires**: [LLM & Transformers](./02-llm-and-transformers.md) — embedding concepts, attention
- **Enables**: Production AI features, [Agent Patterns](./03-agent-patterns.md) — agents use RAG for memory

---

### Concept 4: LLM Integration Patterns / Mẫu Tích Hợp LLM

#### 🧠 Memory Hook

> **"LLMs in production = 3 enemies: latency, cost, unreliability. Every pattern fights one."**
> LLMs trong production = 3 kẻ thù: độ trễ, chi phí, không đáng tin. Mỗi pattern chiến đấu với một kẻ.

#### Why does this exist?

1. **Why can't we just call the API directly?** → Direct API calls: no caching (pay for same request 1000×), no fallback (one provider outage = your feature down), no streaming (30-second wait = bad UX), no cost control (token explosion = billing nightmare).
2. **Why are patterns standardized?** → Teams discovered same problems independently; patterns are battle-tested solutions. Vercel AI SDK, LangChain encode these patterns as abstractions.

#### Layer 1 — Simple Analogy

LLM integration patterns như **patterns trong restaurant kitchen**: mise en place (caching), expediter checking tickets (routing), backup stations (fallback), running orders to tables (streaming). Each pattern exists because someone learned the hard way.

#### Layer 2 — How It Works

**Streaming** — Real-time token delivery:

```typescript
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

// Next.js App Router API route
export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: anthropic("claude-3-5-sonnet-20241022"),
    messages,
  });

  // Returns ReadableStream — browser can render tokens as they arrive
  return result.toDataStreamResponse();
}
```

**Semantic Caching** — Cache by meaning, not exact match:

```typescript
import { createHash } from "crypto";

interface CacheEntry {
  response: string;
  embedding: number[];
  timestamp: number;
}

class SemanticCache {
  private cache: Map<string, CacheEntry> = new Map();

  // Cache hit if cosine similarity > threshold
  async get(queryEmbedding: number[], threshold = 0.95): Promise<string | null> {
    for (const entry of this.cache.values()) {
      const similarity = cosineSimilarity(queryEmbedding, entry.embedding);
      if (similarity > threshold) return entry.response;
    }
    return null;
  }

  set(key: string, response: string, embedding: number[]) {
    this.cache.set(key, { response, embedding, timestamp: Date.now() });
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (magA * magB);
}
```

**Fallback Pattern** — Primary → Fallback → Graceful degradation:

```typescript
async function callWithFallback(prompt: string): Promise<string> {
  const providers = [
    () => callClaude(prompt), // Primary: best quality
    () => callGPT4(prompt), // Fallback: alternative
    () => callGPT4Mini(prompt), // Cheap fallback: degraded quality
  ];

  for (const provider of providers) {
    try {
      return await provider();
    } catch (err) {
      console.warn("Provider failed, trying next:", err);
    }
  }

  // Graceful degradation: return cached/static response
  return getCachedResponse(prompt) ?? "Service temporarily unavailable.";
}
```

**Model Routing** — Cheap model first, expensive if needed:

```typescript
type TaskComplexity = "simple" | "moderate" | "complex";

function assessComplexity(prompt: string): TaskComplexity {
  const tokenCount = prompt.split(" ").length;
  const hasCodeRequest = /write|implement|debug|refactor/.test(prompt.toLowerCase());

  if (tokenCount < 50 && !hasCodeRequest) return "simple";
  if (tokenCount < 200) return "moderate";
  return "complex";
}

async function routedCall(prompt: string): Promise<string> {
  const complexity = assessComplexity(prompt);

  const model = {
    simple: "gpt-4o-mini", // $0.15/1M tokens
    moderate: "claude-3-haiku", // $0.25/1M tokens
    complex: "claude-3-5-sonnet", // $3/1M tokens
  }[complexity];

  return callModel(model, prompt);
}
```

#### Layer 3 — Edge Cases / Gotchas

- **Streaming + error handling**: Stream errors arrive mid-stream — client already started rendering. Need error boundary in UI + server-side stream abort.
- **Cache invalidation**: Semantic cache với high similarity threshold có thể serve stale response. TTL + versioning cần thiết.
- **Rate limiting across fallbacks**: All providers có rate limits. Circuit breaker pattern để avoid retry storms.
- **Token budget overflow**: Long conversation history + RAG context → exceed context window. Implement rolling window or summarization.
- **Cost attribution**: Log model + token counts per request per user/feature → identify expensive operations, set budget alerts.

#### Common Mistakes Table

| ❌ Sai lầm                              | ✅ Đúng                                       | Lý do                                      |
| --------------------------------------- | --------------------------------------------- | ------------------------------------------ |
| Wait for full response before streaming | Use streaming API from the start              | UX: 30s spinner vs progressive reveal      |
| No caching on expensive prompts         | Implement semantic cache for repeated queries | Same question asked 1000×/day = 1000× cost |
| Single provider dependency              | Multi-provider fallback                       | Single provider outage = feature outage    |
| No token budgeting                      | Track + alert on token usage per feature      | Cost surprises at month-end billing        |
| Retry immediately on failure            | Exponential backoff + jitter                  | Retry storms amplify provider failures     |

#### 🎯 Interview Pattern

**"How would you build a production LLM feature that handles 100K requests/day?"**

Answer framework:

1. Streaming for UX
2. Semantic cache for cost (target 40-60% hit rate)
3. Model routing (cheap for simple, expensive for complex)
4. Fallback chain (3+ providers)
5. Rate limiting + quota management
6. Cost monitoring dashboard

#### 🔑 Knowledge Chain

- **Requires**: REST API design, async programming, caching fundamentals
- **Enables**: Production-ready AI features, [AI Testing](#concept-5) — need metrics to validate patterns

---

### Concept 5: AI Testing & Evaluation / Kiểm Thử & Đánh Giá AI

#### 🧠 Memory Hook

> **"You can't unit test a vibe — LLM outputs need judges, golden sets, and metrics."**
> Không thể unit test một cảm giác — LLM outputs cần judges, golden sets, và metrics.

#### Why does this exist?

1. **Why is AI testing different from regular testing?** → `expect(result).toBe(expected)` không work — LLM outputs non-deterministic, paraphrased, context-sensitive. Need probabilistic evaluation.
2. **Why automated evals?** → Manual review không scale. Model updates, prompt changes, RAG corpus changes có thể silently degrade quality. Need automated regression detection.

#### Layer 1 — Simple Analogy

Testing LLMs như **grading essay exams**: không có một answer duy nhất, bạn cần rubric (criteria), ví dụ tốt (golden examples), và grader (LLM-as-judge). Bạn track grades over time để phát hiện regression.

#### Layer 2 — How It Works

**LLM-as-Judge** — Dùng một LLM mạnh để evaluate output của LLM khác:

```typescript
interface EvalResult {
  score: number; // 1-5
  reasoning: string;
  passed: boolean;
}

async function llmJudge(
  input: string,
  actualOutput: string,
  criteria: string,
): Promise<EvalResult> {
  const response = await callClaude(`
    You are an expert evaluator. Score this AI response on a scale of 1-5.
    
    CRITERIA: ${criteria}
    
    INPUT: ${input}
    
    AI RESPONSE: ${actualOutput}
    
    Respond as JSON: {"score": 1-5, "reasoning": "...", "passed": true/false}
    Score 4+ = passed.
  `);

  return JSON.parse(response) as EvalResult;
}

// Usage: evaluate factual accuracy
const result = await llmJudge(
  "What is the capital of France?",
  modelOutput,
  "Response must be factually accurate, concise, and directly answer the question.",
);
```

**Golden Set Testing** — Curated input/output pairs:

```typescript
interface GoldenExample {
  id: string;
  input: string;
  expectedOutput: string;
  tags: string[];
}

async function runGoldenSetEval(
  goldenSet: GoldenExample[],
  model: string,
): Promise<{ passRate: number; failures: string[] }> {
  const results = await Promise.all(
    goldenSet.map(async (example) => {
      const actual = await callModel(model, example.input);
      const evalResult = await llmJudge(
        example.input,
        actual,
        `Expected output style: ${example.expectedOutput}`,
      );
      return { id: example.id, passed: evalResult.passed };
    }),
  );

  const failures = results.filter((r) => !r.passed).map((r) => r.id);
  const passRate = results.filter((r) => r.passed).length / results.length;

  return { passRate, failures };
}
```

**Key Metrics**:
| Metric | What it measures | How to compute |
|--------|-----------------|----------------|
| Faithfulness | LLM sticks to retrieved context | LLM judge: does answer contradict sources? |
| Relevance | Answer relevant to question | LLM judge: semantic similarity |
| Accuracy | Factually correct | Golden set + LLM judge |
| Latency | P50, P95, P99 response time | APM tools |
| Cost | $/request, $/feature | Token count × price |

**CI/CD for AI**:

```yaml
# .github/workflows/ai-evals.yml
name: AI Regression Tests
on: [push, pull_request]
jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run evals
      env:
        OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        PASS_RATE_THRESHOLD: '0.85'
```

#### Layer 3 — Edge Cases / Gotchas

- **LLM judge bias**: GPT-4 judging GPT-4 outputs có biases (verbosity bias, self-preference bias). Use different model family as judge.
- **Golden set drift**: User expectations change over time. Review golden set quarterly.
- **Cost of evals**: Running full golden set on every commit → expensive. Stratify: fast/cheap subset on every commit, full suite nightly.
- **Temperature sensitivity**: Non-deterministic outputs at temp > 0 → same prompt might pass 80% of the time. Run each eval multiple times, take majority vote.
- **Distribution shift**: Eval set ≠ production distribution. Monitor production samples, pull into eval set periodically.

#### Common Mistakes Table

| ❌ Sai lầm                           | ✅ Đúng                                     | Lý do                                  |
| ------------------------------------ | ------------------------------------------- | -------------------------------------- |
| Only manual testing for LLM features | Automated eval suite với CI/CD              | Manual không scale, misses regressions |
| Use same model as judge and subject  | Different model family as judge             | Self-preference bias inflates scores   |
| Golden set never updated             | Review + refresh quarterly                  | User expectations and use cases evolve |
| Binary pass/fail only                | Score + reasoning                           | Enables tracking gradual degradation   |
| Eval only on happy path              | Include adversarial, edge cases, jailbreaks | Production has unexpected inputs       |

#### 🎯 Interview Pattern

**"How would you detect if a prompt change broke your AI feature?"**

Answer:

1. Maintain golden test set (100-500 curated pairs)
2. Run LLM-as-judge evaluation on every prompt change
3. Fail CI if pass rate drops below threshold (e.g., 85%)
4. Track latency and cost metrics alongside quality
5. Shadow mode: run new prompt in parallel with old, compare before rollout

#### 🔑 Knowledge Chain

- **Requires**: Testing fundamentals, LLM output characteristics, statistical thinking
- **Enables**: Production confidence → deploy AI features safely → [AI Ethics](#concept-6)

---

### Concept 6: AI Ethics & Safety / Đạo Đức & An Toàn AI

#### 🧠 Memory Hook

> **"Guardrails are seatbelts — nobody notices them until they prevent a disaster."**
> Guardrails là dây an toàn — không ai để ý đến chúng cho đến khi chúng ngăn thảm họa.

#### Why does this exist?

1. **Why do AI systems have safety issues?** → Models trained on internet data → inherit biases, stereotypes, harmful content. Models optimize for next-token prediction, not human values. Misalignment between "sounds confident" and "is correct."
2. **Why is this an engineering concern, not just ethics?** → EU AI Act (2024) — legal requirements. Brand risk (one viral harmful output = PR crisis). Technical debt: retrofitting safety is 10× harder than building in from start.

#### Layer 1 — Simple Analogy

AI safety như **food safety in a restaurant**: you need input inspection (fresh ingredients = input guardrails), cooking standards (proper handling = model choice + prompting), and output check (taste before serving = output guardrails). Skipping any step risks harming customers.

#### Layer 2 — How It Works

**Input Guardrails** — Validate và sanitize before sending to LLM:

```typescript
import { z } from "zod";

const UserInputSchema = z.object({
  message: z
    .string()
    .max(2000, "Message too long")
    .refine((msg) => !containsPII(msg), "PII detected — please remove personal information")
    .refine((msg) => !isPromptInjection(msg), "Invalid input format"),
  userId: z.string().uuid(),
});

function containsPII(text: string): boolean {
  const piiPatterns = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, // Email
    /\b(?:\d{4}[\s-]?){3}\d{4}\b/, // Credit card
  ];
  return piiPatterns.some((pattern) => pattern.test(text));
}

function isPromptInjection(text: string): boolean {
  const injectionPatterns = [
    /ignore (previous|above|all) instructions/i,
    /you are now/i,
    /system prompt/i,
    /\[INST\]/i, // Common injection marker
  ];
  return injectionPatterns.some((p) => p.test(text));
}
```

**Output Guardrails** — Filter/validate LLM output:

```typescript
interface ContentPolicy {
  allowHarmfulContent: boolean;
  allowPII: boolean;
  maxLength: number;
  requiredTopics?: string[];
}

async function applyOutputGuardrails(
  output: string,
  policy: ContentPolicy,
): Promise<{ safe: boolean; filtered: string; flags: string[] }> {
  const flags: string[] = [];
  let filtered = output;

  // Check content moderation (OpenAI moderation API or custom)
  const modResult = await checkModeration(output);
  if (modResult.flagged) {
    flags.push(`Content flagged: ${modResult.categories.join(", ")}`);
    if (!policy.allowHarmfulContent) {
      return { safe: false, filtered: "", flags };
    }
  }

  // Redact PII in output
  if (!policy.allowPII) {
    filtered = redactPII(filtered);
  }

  // Truncate if needed
  if (filtered.length > policy.maxLength) {
    filtered = filtered.slice(0, policy.maxLength) + "...";
    flags.push("Output truncated");
  }

  return { safe: true, filtered, flags };
}
```

**Bias Detection** — Systematic testing across demographic groups:

```typescript
async function detectBias(
  prompt: string,
  groups: string[],
  attribute: string,
): Promise<Record<string, string>> {
  // Test same prompt with different demographic attributes
  const results: Record<string, string> = {};

  for (const group of groups) {
    const filledPrompt = prompt.replace("{{GROUP}}", group);
    results[group] = await callLLM(filledPrompt);
  }

  // Analyze for differential treatment
  return results;
}

// Example: Test if AI loan advisor treats genders differently
const biasTest = await detectBias(
  "Should {{GROUP}} take out a home loan at age 35 with $80K salary?",
  ["a man", "a woman", "a non-binary person"],
  "gender",
);
```

**Regulatory Context**:

- **EU AI Act** (effective 2024–2026): Risk-based classification. High-risk AI (healthcare, finance, hiring) → mandatory transparency, human oversight.
- **California SB 1047** (2024): Requires safety evaluations for frontier models.
- **GDPR + AI**: Personal data used in AI training → consent, right to explanation.

#### Layer 3 — Edge Cases / Gotchas

- **Jailbreak arms race**: New jailbreaks emerge daily. No static filter is complete. Layered defense: input + output + monitoring.
- **False positive rate**: Over-zealous content filter blocks legitimate requests → user frustration. Calibrate thresholds per use case.
- **Bias amplification in RAG**: If retrieval corpus is biased, RAG amplifies bias with false confidence. Audit corpus.
- **GDPR + LLM**: Sending user data to third-party LLM API → data processor agreement needed. PII redaction before API call.
- **Adversarial inputs**: Carefully crafted inputs that cause LLM to output harmful content, exfiltrate context, or act against user interests.

#### Common Mistakes Table

| ❌ Sai lầm                         | ✅ Đúng                                      | Lý do                                                            |
| ---------------------------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| Ship AI feature, add safety later  | Safety by design, built in from day 1        | Retroactive safety is 10× harder + costly                        |
| Only input filtering               | Input + output guardrails + monitoring       | Multi-layer defense; output can be harmful even with clean input |
| Ignore GDPR for LLM features       | Data processing agreement + PII redaction    | Legal liability, data breach risk                                |
| No bias testing before launch      | Systematic bias evaluation across groups     | Differential harm is invisible without testing                   |
| Opacity about AI-generated content | Disclosure: "This response was AI-generated" | EU AI Act requirement, user trust                                |

#### 🎯 Interview Pattern

**"How would you handle bias in an AI-powered hiring feature?"**

1. **Audit training data**: Source distribution, demographic representation
2. **Test systematically**: Same resume with different names (traditional male/female, ethnic-coded names)
3. **Metrics**: Equal opportunity, demographic parity, individual fairness
4. **Mitigation**: Adversarial debiasing, counterfactual augmentation
5. **Human oversight**: AI score + human review for high-stakes decisions
6. **Monitoring**: Ongoing bias metrics in production, periodic audits

#### 🔑 Knowledge Chain

- **Requires**: Understanding of LLM behavior, legal/regulatory awareness, testing
- **Enables**: Responsible AI deployment, regulatory compliance → production trust

---

### Concept 7: The T-Shaped AI Engineer / Kỹ Sư AI Hình Chữ T

#### 🧠 Memory Hook

> **"T-shape: one deep vertical + broad horizontal = the engineer companies compete to hire in 2025."**
> Hình chữ T: một chuyên sâu + rộng AI literacy = kỹ sư mà công ty cạnh tranh để tuyển dụng.

#### Why does this exist?

1. **Why T-shaped?** → Pure AI specialists lack software engineering discipline (debugging, scalability, testing). Pure SWEs can't build AI features effectively. T-shape = best of both worlds.
2. **Why is this a career strategy?** → AI is horizontal technology — it cuts across every domain. An engineer who combines AI literacy with deep domain expertise (backend, frontend, mobile, data) becomes a force multiplier for their team.

#### Layer 1 — Simple Analogy

T-shape như **bilingual professional**: Doctor who speaks fluent English AND Cantonese treats significantly more patients than one who speaks only English. You + AI fluency treats significantly more problems than you without it.

#### Layer 2 — How It Works

**Career Progression Matrix**:

| Level         | AI Competency                            | Core Engineering                 | What They Build                 |
| ------------- | ---------------------------------------- | -------------------------------- | ------------------------------- |
| **Junior** 🟢 | Use AI tools (Copilot, ChatGPT)          | CRUD apps, basic APIs            | Features with AI assistance     |
| **Mid** 🟡    | Build AI features (RAG, chatbots)        | Systems design basics            | Production AI integrations      |
| **Senior** 🔴 | Design AI systems (architecture, evals)  | Distributed systems, reliability | AI platform, team enablement    |
| **Staff** 🟣  | AI strategy (build vs buy, org patterns) | Org-level impact                 | AI roadmap, capability building |

**Skills Matrix** (what to learn at each level):

```
JUNIOR: ────────────────────────────────────────────────
  ✓ Use Copilot/Cursor effectively (not blindly)
  ✓ Understand what LLMs can/cannot do
  ✓ Basic prompt engineering (few-shot, structured output)
  ✓ Call LLM API with proper error handling

MID: ───────────────────────────────────────────────────
  ✓ Build and deploy RAG pipelines
  ✓ Implement streaming, caching, fallback patterns
  ✓ Write LLM evals and golden test sets
  ✓ Choose between RAG vs fine-tuning vs prompting

SENIOR: ────────────────────────────────────────────────
  ✓ Design multi-agent systems
  ✓ Own AI feature quality metrics + incident response
  ✓ Evaluate AI vendors, models, frameworks
  ✓ Mentor team on AI best practices

STAFF: ─────────────────────────────────────────────────
  ✓ Define AI strategy (build vs buy vs partner)
  ✓ Navigate AI ethics + legal + regulatory
  ✓ Cross-org AI enablement
  ✓ Stay ahead of rapidly evolving landscape
```

**Vietnamese Market Context** (2025):

- **Zalo/VNG**: AI in content moderation, recommendation, customer service automation. Seeking engineers with LLM integration experience.
- **Grab Vietnam**: AI for demand forecasting, driver matching optimization, fraud detection. Python + ML background valued alongside SWE skills.
- **Shopee/Sea**: AI-powered search, recommendation, seller tools. Strong demand for NLP engineers in Vietnamese language context.
- **FPT Software**: AI consulting and delivery for enterprise clients. Need engineers who can explain AI to non-technical stakeholders.

#### Layer 3 — Edge Cases / Gotchas

- **AI hype vs reality**: Avoid FOMO-driven learning. Not every project needs an LLM. Deep SWE fundamentals (systems, algorithms, testing) still matter enormously.
- **Breadth without depth**: Collecting AI certifications without building real systems → shallow. Interviewers can tell.
- **Depth without AI**: Excellent but no AI fluency → ceiling effect as AI becomes ambient. Even backend engineers need to understand LLM integration patterns.
- **Learning pace trap**: AI landscape changes every 6 months. Focus on fundamentals (transformers, evaluation, system design) not specific tools (they'll change).

#### Common Mistakes Table

| ❌ Sai lầm                            | ✅ Đúng                                           | Lý do                                                   |
| ------------------------------------- | ------------------------------------------------- | ------------------------------------------------------- |
| List AI tools on resume without depth | Describe specific AI systems built + impact       | Interviewer will probe for depth                        |
| Learn AI at expense of core skills    | AI + strong fundamentals                          | AI amplifies, doesn't replace, engineering depth        |
| Follow hype (latest framework weekly) | Master fundamentals + selectively adopt tools     | Fundamentals stable; tools change                       |
| Only learn from courses               | Build real projects, contribute to open source AI | Project portfolio >> certificates                       |
| Ignore soft skills for AI roles       | Communication, stakeholder management critical    | AI features require explaining tradeoffs to PM/business |

#### 🎯 Interview Pattern

**"Where do you see AI in your career growth?"**

Level-appropriate answers:

- **Junior**: "I'm building AI-literacy — learning to integrate LLMs and evaluate their outputs. I used [Copilot/Claude] to [specific result]."
- **Mid**: "I want to specialize in AI systems design. I've built [RAG pipeline/chatbot] that handles [X] requests with [metrics]."
- **Senior**: "I see my role as enabling the team — establishing evaluation frameworks, choosing right tools, mentoring on AI engineering practices."

#### 🔑 Knowledge Chain

- **Requires**: Any existing engineering depth + growth mindset
- **Enables**: Career advancement, breadth of impact, cross-domain collaboration

---

## 🎤 Block B — Interview Q&A / Câu Hỏi Phỏng Vấn

> **Ordering**: 🟢 Junior → 🟡 Mid → 🔴 Senior (Kumon principle: mastery before advancement)

---

### 🟢 Junior Level (Bloom's L1-L2: Remember + Understand)

---

**Q1**: What is an LLM, and how does it generate text?
**LLM là gì và nó tạo ra text như thế nào?**

**A**: An LLM (Large Language Model) is a neural network trained on massive text datasets to predict the next token given prior context. During inference, it samples from a probability distribution over the vocabulary at each step — this is called **autoregressive generation**. Temperature controls randomness (0 = deterministic, 1 = more creative). Models like GPT-4 and Claude have billions of parameters encoding statistical patterns from training data.

> ✅ **Signal mạnh**: Mentions tokenization, temperature, autoregressive. Shows understanding beyond "it's a chatbot."
> ❌ **Signal yếu**: "It understands text and writes responses." — surface-level, no mechanism.

---

**Q2**: What is RAG and when would you use it?
**RAG là gì và khi nào bạn dùng nó?**

**A**: RAG (Retrieval-Augmented Generation) extends LLMs with external knowledge retrieval. Instead of relying on the model's training data (which has a cutoff and doesn't include private data), RAG: (1) embeds the query, (2) searches a vector database for relevant chunks, (3) injects those chunks into the prompt context. Use RAG when: data changes frequently, you have domain-specific knowledge the model wasn't trained on, or you need source attribution.

> ✅ **Signal mạnh**: Explains the mechanism clearly, gives concrete use cases.
> ❌ **Signal yếu**: "RAG helps LLMs answer questions better." — vague, no mechanism.

---

**Q3**: How do you use AI coding tools in your day-to-day work?
**Bạn dùng AI coding tools như thế nào trong công việc hằng ngày?**

**A**: I use [Copilot/Cursor/Claude Code] for: boilerplate generation (test scaffolding, CRUD endpoints), documentation, explaining unfamiliar code, and refactoring. I'm deliberate about when NOT to use AI: security-sensitive code, business logic I need to own deeply, and learning new concepts where AI shortcuts would prevent understanding. I treat AI output like a junior's PR — always review before accepting.

> ✅ **Signal mạnh**: Shows agency, critical thinking, specific use cases AND limitations.
> ❌ **Signal yếu**: "I use Copilot to write code faster." — no judgment, sounds dependent.

---

**Q4**: What is prompt engineering?
**Prompt engineering là gì?**

**A**: Prompt engineering is the practice of crafting LLM inputs to reliably produce desired outputs. Key techniques: zero-shot (direct instruction), few-shot (include examples), chain-of-thought (ask model to reason step by step), and structured output (specify JSON format). System prompts define role and constraints. Good prompt engineering increases consistency, reduces hallucination, and enables model behavior customization without fine-tuning.

> ✅ **Signal mạnh**: Names multiple techniques, explains purpose.
> ❌ **Signal yếu**: "It's writing good prompts." — no specific techniques.

---

**Q5**: What are embedding vectors and what are they used for?
**Embedding vectors là gì và được dùng để làm gì?**

**A**: Embeddings are dense numerical representations of text in high-dimensional vector space, where semantic similarity maps to geometric proximity (cosine similarity). They're the foundation of: semantic search (find similar documents), RAG (match query to relevant chunks), clustering (group similar content), and recommendation systems. Popular embedding models: OpenAI `text-embedding-3-small`, Cohere Embed, or local models like `all-MiniLM-L6-v2`.

> ✅ **Signal mạnh**: Mentions cosine similarity, multiple use cases, specific models.
> ❌ **Signal yếu**: "Vectors that represent text as numbers." — too basic.

---

**Q6**: What is the difference between fine-tuning and prompting an LLM?
**Sự khác biệt giữa fine-tuning và prompting một LLM là gì?**

**A**: **Prompting** changes model behavior at inference time through instructions/examples — fast, cheap, reversible, no training data needed. **Fine-tuning** updates model weights with task-specific data — teaches style/behavior/format, but requires labeled data, is expensive, and results in a static model that needs retraining when requirements change. Rule of thumb: use prompting first; fine-tune only when prompting consistently falls short AND you have 1000+ high-quality examples.

> ✅ **Signal mạnh**: Explains mechanism, gives decision rule.
> ❌ **Signal yếu**: "Fine-tuning makes the model smarter." — imprecise.

---

### 🟡 Mid Level (Bloom's L3: Apply + Analyze)

---

**Q7**: Design a caching strategy for an LLM-powered feature serving 50K requests/day.
**Thiết kế caching strategy cho một LLM feature phục vụ 50K requests/ngày.**

**A**: Three-layer cache strategy:

1. **Exact cache** (Redis, TTL 1h): Hash of exact prompt → if identical request, serve cached response. High hit rate for FAQ-type queries.
2. **Semantic cache** (Redis + embeddings, TTL 24h): Embed query → find cached entry with cosine similarity >0.95 → serve. Catches rephrased duplicates.
3. **Prompt prefix cache**: Many providers (Anthropic, OpenAI) cache system prompt tokens automatically. Structure prompts so the static system prompt is always at the beginning.

At 50K requests/day, target 40-60% cache hit rate → reduces API calls to 20-30K/day. Track cache metrics (hit rate, eviction rate, stale serve rate) in APM.

> ✅ **Signal mạnh**: Multi-layer approach, specific thresholds, mentions provider-side caching, ties to metrics.
> ❌ **Signal yếu**: "Use Redis to cache responses." — incomplete.

---

**Q8**: How would you evaluate if a RAG pipeline is performing well?
**Làm thế nào để đánh giá một RAG pipeline đang hoạt động tốt?**

**A**: Evaluate at two levels:

- **Retrieval quality**: Recall@K (relevant docs in top K?), MRR (mean reciprocal rank), NDCG. Use a golden set of query → relevant doc pairs.
- **Generation quality**: Faithfulness (answer grounded in retrieved context — LLM judge), Relevance (answer addresses the question), Completeness (no important info missed).

Tools: RAGAS framework automates these metrics. Run as CI check on prompt/retrieval changes. Also track latency (P95 < 3s) and cost ($/query). Red flag: high retrieval recall but low faithfulness → prompt issue. Low retrieval recall → chunking or embedding issue.

> ✅ **Signal mạnh**: Separates retrieval vs generation evaluation, names specific metrics and tools, debugging intuition.
> ❌ **Signal yếu**: "Ask users if the answers are good." — not scalable or systematic.

---

**Q9**: A user is bypassing your AI chatbot's safety filters through prompt injection. How do you handle it?
**User đang bypass safety filters của AI chatbot của bạn qua prompt injection. Bạn xử lý như thế nào?**

**A**: Defense-in-depth approach:

1. **Input layer**: Detect injection patterns (regex + LLM classifier), use delimiters to separate system context from user input.
2. **Architecture layer**: Principle of least privilege for AI — chatbot only has access to what it needs (don't give it DB credentials in context).
3. **Output layer**: Validate output against allowed topic/action space before serving.
4. **Monitoring**: Log suspected injections, alert on patterns, update classifier.
5. **Red team**: Regular adversarial testing with known injection techniques.

No single defense is complete — layered defense catches what individual layers miss. Also consider: if feature is high-risk, add human review layer.

> ✅ **Signal mạnh**: Multi-layer defense, names specific techniques, mentions monitoring + red team.
> ❌ **Signal yếu**: "I would add better content filtering." — single-layer, vague.

---

**Q10**: Explain the trade-offs between different vector databases for a production RAG system.
**Giải thích trade-offs giữa các vector databases cho một RAG system production.**

**A**: Key dimensions: scale, query latency, filtering support, operational complexity.

- **pgvector** (Postgres extension): Zero new infra if you already run Postgres. Good for <1M vectors, approximate nearest neighbor via IVFFlat or HNSW. Trade-off: Postgres as bottleneck, scaling is standard Postgres scaling.
- **Qdrant**: Rust-based, excellent performance, HNSW index, rich filtering via payload. Good to 100M+ vectors. Slightly more operational overhead.
- **Pinecone**: Fully managed, serverless tier, zero ops. Trade-off: vendor lock-in, cost at scale.
- **Chroma**: Great for prototyping, in-memory or local SQLite. Not production-grade for high scale.

Decision: Start with pgvector (no new infra). Migrate to Qdrant when query latency becomes issue at scale.

> ✅ **Signal mạnh**: Multiple options with concrete trade-offs, decision framework.
> ❌ **Signal yếu**: "I would use Pinecone because it's popular." — no trade-off analysis.

---

**Q11**: How do you handle LLM output that doesn't match your expected JSON schema?
**Bạn xử lý LLM output không match expected JSON schema như thế nào?**

**A**: Defensive parsing strategy:

1. **Prefer native JSON mode** when available (OpenAI, Anthropic tool use / structured outputs).
2. **Extract JSON from markdown**: LLMs often wrap JSON in ```json blocks — use regex to extract.
3. **Retry with feedback**: On parse failure, re-prompt with the error: "Your previous response was not valid JSON. Here's the error: [error]. Try again."
4. **Partial validation with Zod**: Parse what you can, fill defaults for missing optional fields.
5. **Circuit breaker**: After 3 retries, return error — don't loop indefinitely.

````typescript
async function safeJsonParse<T>(schema: z.ZodType<T>, text: string, retries = 2): Promise<T> {
  // Extract JSON from markdown code blocks
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) ?? [null, text];
  const jsonStr = jsonMatch[1].trim();

  const parsed = JSON.parse(jsonStr);
  return schema.parse(parsed);
}
````

> ✅ **Signal mạnh**: Specific techniques, code intuition, failure handling strategy.
> ❌ **Signal yếu**: "I would catch the JSON parse error." — incomplete.

---

**Q12**: How would you implement A/B testing for two versions of an AI feature?
**Bạn sẽ implement A/B testing cho hai versions của một AI feature như thế nào?**

**A**: Two dimensions to test: prompt version AND model version.

**Infrastructure**:

1. User segmentation: hash(userId) % 100 → assign to A or B bucket (sticky assignment — same user always gets same variant)
2. Feature flags: LaunchDarkly / custom flag service controls assignment
3. Logging: log `{userId, variant, latency, tokens, timestamp, requestId}` per request
4. LLM eval: Run LLM-as-judge on sampled outputs from each variant

**Metrics to compare**:

- Primary: Task completion rate, user satisfaction (thumb up/down), downstream conversion
- Secondary: Latency P95, cost/request, refusal rate

**Pitfalls**: Don't conclude from 1 day of data (novelty effect). Run for minimum 1 week. Ensure variants don't cross-contaminate (shared cache must be variant-aware).

> ✅ **Signal mạnh**: Sticky assignment, LLM eval integration, pitfall awareness.
> ❌ **Signal yếu**: "Show different prompts to different users and compare results." — missing mechanism.

---

### 🔴 Senior Level (Bloom's L4-L6: Analyze + Evaluate + Create)

---

**Q13**: Design an AI-powered code review system for a 200-person engineering org. Include evaluation strategy, failure modes, and rollout plan.
**Thiết kế một AI-powered code review system cho một org 200 kỹ sư. Bao gồm evaluation strategy, failure modes, và rollout plan.**

**A**:

**Architecture**:

- **Input**: PR diff + changed files + PR description + linked issues
- **Context retrieval**: RAG over codebase conventions docs, past PR comments for same files, team style guide
- **Multi-agent pipeline**: Parallel agents for (a) security review, (b) style/convention check, (c) logic/correctness, (d) test coverage assessment
- **Output**: Structured review with severity (CRITICAL/WARNING/SUGGESTION) + reasoning + code snippets
- **Integration**: GitHub App → webhook → async job → post PR comment

**Evaluation Strategy**:

1. Golden set: 200 past PRs where humans made good catches — AI should find same issues
2. LLM-as-judge: "Given this diff, is this comment accurate and actionable?"
3. Engineer satisfaction survey (NPS for each comment)
4. False positive rate tracking (engineers dismissing comments without acting)
5. Weekly regression run: alert if catch rate drops >10% or false positive rate increases

**Failure Modes & Mitigations**:

- _Hallucinated issues_: AI reports bug that doesn't exist → false positive fatigue → engineers ignore all comments. Mitigation: require code citation, human escalation for CRITICAL.
- _Context window limits on large PRs_: Chunked review loses cross-file reasoning. Mitigation: limit review to changed files + direct dependencies.
- _Security false confidence_: AI misses subtle vulnerability. Mitigation: human security review gate for sensitive paths (auth/, crypto/).
- _Model degradation_: Provider updates model, behavior changes. Mitigation: automated eval on every week, alert on regression.

**Rollout Plan**:

1. Shadow mode (week 1-2): AI runs but doesn't post comments — only log internally
2. Opt-in beta (week 3-6): 10 volunteer engineers receive AI comments alongside human review
3. Staged rollout: 20% → 50% → 100% teams over 2 months
4. Kill switch: Feature flag to disable instantly if issues emerge
5. Human oversight: CRITICAL severity → always escalate to human reviewer

> ✅ **Signal mạnh**: Multi-agent design, complete eval strategy, specific failure modes with mitigations, phased rollout.
> Follow-up chains: "How would you handle a model provider outage mid-review?" → fallback model + queue. "How would you handle an AI comment that contained sensitive data?" → output guardrails + PII scan.

---

**Q14**: How would you build an evaluation framework for LLMs that can detect subtle quality regressions — not just obvious failures?
**Làm thế nào để xây dựng eval framework cho LLMs để phát hiện subtle quality regressions — không chỉ obvious failures?**

**A**:

Subtle regressions are where most teams fail — the model still answers, just slightly worse. Framework:

**1. Multi-Dimensional Scoring** (not binary pass/fail):

- Factual accuracy (0-5), Coherence (0-5), Conciseness (0-5), Instruction following (0-5)
- Track average score per dimension — a drop in "Conciseness" alone is a signal

**2. Behavioral Assertions** — beyond correctness:

```typescript
const assertions = [
  { name: "no_hallucination", fn: (out) => !containsUnsupportedClaims(out) },
  { name: "cites_sources", fn: (out) => out.includes("[Source:") },
  { name: "appropriate_length", fn: (out) => out.split(" ").length < 500 },
  { name: "follows_format", fn: (out) => JSON.parse(out) !== null },
];
```

**3. Comparative Eval** (not absolute):

- Compare new vs baseline on identical inputs
- LLM judge: "Which response is better and why?"
- Track win rate: alert if new model wins < 45% (statistically significant regression)

**4. Stratified Testing**:

- Separate eval sets by: task type, input length, domain
- A regression might affect only long inputs or specific domains — catch it early

**5. Canary Inputs** — adversarial probes:

- Ambiguous questions (tests hedging behavior)
- Out-of-domain queries (tests refusal/graceful handling)
- Edge cases from past incidents

**6. Statistical significance**: Run each eval multiple times (temp > 0), use bootstrap confidence intervals, don't call regression on single run.

> ✅ **Signal mạnh**: Multi-dimensional, comparative not just absolute, stratified, statistical rigor.
> Follow-up: "How do you avoid eval dataset overfitting?" → refresh golden set, add production-sampled inputs, don't let team see test inputs during development.

---

**Q15**: A critical AI feature in production is producing increasingly biased outputs against a demographic group. You're the senior engineer on-call. Walk me through your incident response.
**Một AI feature critical đang produce outputs ngày càng biased hơn chống lại một demographic group. Bạn là senior engineer on-call. Walk me through incident response.**

**A**:

**Immediate (0-30 min)**:

1. **Assess severity**: Quantify bias — how many users affected? What severity? Sample 50 recent outputs, run bias metric.
2. **Containment decision**: If clearly biased and harmful → kill switch (disable feature or route to fallback). Don't wait for perfect information.
3. **Alert stakeholders**: Eng lead, product, legal/compliance (within 30 min for serious demographic bias — legal risk).
4. **Preserve evidence**: Export logs, outputs, user feedback with timestamps — needed for post-mortem.

**Short-term (1-24 hrs)**: 5. **Root cause**: What changed? Model update from provider? Prompt change? New data in RAG corpus? Check deploy history. Run diff between current and last-known-good behavior. 6. **Hotfix**: Add output-level bias guardrail (LLM judge for bias) as temporary measure while investigating root cause. 7. **User communication**: If users received biased outputs → consider notification strategy with legal/comms.

**Medium-term (24 hrs - 1 week)**: 8. **Fix root cause**: If model update → test against previous model version. If prompt → revert + redesign. If RAG corpus → audit and curate. 9. **Rebuild evals**: Add bias test cases to golden set so this regression is caught in CI going forward. 10. **Post-mortem**: Blameless, with: what happened, contributing factors, timeline, action items. Share with org.

**Prevention**:

- Pre-launch bias audit for all demographic-touching features
- Ongoing bias metrics in production monitoring dashboards
- Quarterly third-party audit for high-risk AI features

> ✅ **Signal mạnh**: Clear priority (contain first), legal awareness, evidence preservation, prevention not just reaction.
> Follow-up: "What if killing the feature harms users who depend on it?" → calibrated response: degrade gracefully, disable only the biased path, parallel path to human agent.

---

**Q16**: Compare the architectural trade-offs between a single powerful LLM versus a multi-agent pipeline for a complex software engineering task.
**So sánh architectural trade-offs giữa một powerful LLM đơn lẻ so với multi-agent pipeline cho một complex software engineering task.**

**A**:

**Single LLM** ✓ Pros:

- Latency: one network call, typically 2-15s
- Coherence: one context window → no inter-agent coordination failures
- Cost: predictable, lower
- Debuggability: single input/output pair to inspect
- Works well for: tasks with unified context that fit in context window

**Single LLM** ✗ Cons:

- Context limit: 200K tokens sounds like a lot until you have large codebase
- Attention degradation: long context → "lost in middle" — model attends poorly to middle of context
- One model can't parallelize — sequential bottleneck
- All-or-nothing: if model fails the task, whole thing fails

**Multi-Agent Pipeline** ✓ Pros:

- Parallel execution: specialized agents run concurrently (3× throughput possible)
- Specialization: agent per domain → better focused prompts
- Checkpointing: intermediate results allow partial recovery
- Scale: distribute load across multiple model calls

**Multi-Agent Pipeline** ✗ Cons:

- Coordination overhead: agents must communicate results — serialization, handoffs
- Error accumulation: each agent's error compounds (if Agent A misunderstands, Agent B inherits the error)
- Latency (if serial): 5 agents × 5s each = 25s
- Cost multiplier: 5× model calls
- Harder to debug: error in Agent 3's output needs tracing through Agents 1-2's context

**Decision Framework**:

- Task fits in context window + needs coherence → Single LLM
- Task parallelizable + needs specialized reasoning → Multi-Agent
- Cost-sensitive → Single LLM (cheaper)
- Quality-critical + latency tolerant → Multi-Agent with verification

Real example: GitHub Copilot Workspace uses multi-agent (planning agent, editing agent, test agent) because tasks span multiple files and benefit from specialization.

> ✅ **Signal mạnh**: Concrete trade-offs both ways, decision framework, real example.
> Follow-up: "How would you test a multi-agent pipeline?" → unit test each agent, integration test the pipeline, chaos engineering (agent failure injection), eval on end-to-end outcomes.

---

**Q17**: How would you approach building a cost-efficient AI platform that serves 10 different product teams?
**Bạn sẽ approach như thế nào để xây dựng một cost-efficient AI platform phục vụ 10 teams sản phẩm khác nhau?**

**A**:

**Platform Architecture** (AI Gateway pattern):

```
Teams → AI Gateway → [Router → {Claude | GPT-4o | Gemini | Local}]
                   → [Cache Layer]
                   → [Rate Limiter / Budget Controller]
                   → [Logging / Observability]
                   → [Eval Framework]
```

**Cost Efficiency Levers**:

1. **Model routing by complexity**: Classify request → route to cheapest model that meets quality bar. 60% of requests are "simple" → route to GPT-4o-mini or Claude Haiku. 30% moderate → Claude Sonnet. 10% complex → Claude Opus / GPT-4o.

2. **Shared semantic cache**: Across 10 teams, many duplicate queries. Shared cache with team-namespaced keys → 30-50% cost reduction.

3. **Prompt prefix caching**: Structure all team prompts with static system prompt at the top — providers cache this → saves input tokens.

4. **Budget per team**: Hard limit per team per day/month. Cost attribution → teams make better decisions when they see their bill.

5. **Async queue for non-latency-critical**: Batch jobs → reduce peak API load, enable request coalescing.

**Governance**:

- Self-service onboarding for teams (SDK + docs)
- Usage dashboards per team
- Central alert on anomalous spend
- Security review gate for new AI features before they hit production

**Build vs Buy**: Likely start with a lightweight internal gateway (500 LoC) over LiteLLM or similar. Don't build scheduling, routing, caching from scratch — OSS tools exist.

> ✅ **Signal mạnh**: Platform thinking, concrete cost levers with estimates, governance, build vs buy judgment.

---

**Q18**: Evaluate the technical and ethical implications of deploying an AI system for automated performance reviews of engineers at your company.
**Đánh giá các implications kỹ thuật và đạo đức của việc deploy một AI system cho automated performance reviews của engineers tại công ty bạn.**

**A**:

**Technical Implications**:

_Challenges_:

- **Measurement problem**: Quantifiable signals (commits, PR count, code coverage) are proxies, not ground truth of impact. LLM parsing qualitative peer feedback → subjective, context-dependent.
- **Context blindness**: AI doesn't know the engineer was on-call, supporting team, or cleaning tech debt. Visible output ≠ actual contribution.
- **Data sparsity**: Engineers have limited data points (few promotions, few performance cycles) → models can't generalize well.
- **Feedback loops**: If AI score influences who gets high-visibility projects, it can create reinforcing disadvantages.

_Mitigations_: Multi-source signals, human-in-the-loop for all consequential decisions, confidence intervals on AI scores.

**Ethical Implications**:

_EU AI Act classification_: "Employment and workers management" = HIGH RISK AI system → mandatory:

- Human oversight (AI supports, human decides)
- Transparency (employees must know AI is involved)
- Right to explanation
- Bias audit before deployment

_Demographic bias risk_: Models trained on past data reflect past biases. If senior engineers historically skewed one demographic, model may associate that demographic's communication style with "high performance."

_Power imbalance_: Opaque AI score vs. employee with no recourse. Fundamental fairness concern.

**My Recommendation**:
AI can assist (surface patterns, flag missing feedback, ensure consistency in rubrics) but should never autonomously determine performance rating or promotion decision. Human manager owns the final judgment, with AI as analytical tool. Require bias audit, transparency to employees, and appeal process.

**Signal**: This answer shows technical depth + ethical reasoning + regulatory awareness + principled judgment. That's Staff+ level thinking.

> ✅ **Signal mạnh**: Identifies technical challenges AND ethical dimensions AND regulatory context AND reaches a principled recommendation.
> Follow-up: "Your manager says the board wants to cut HR costs by automating it fully. What do you do?" → Document risks in writing, escalate to legal/compliance, propose alternative (AI-assisted not AI-decided), resign if pushed past ethical line.

---

## 📖 Block C — Study Cases / Tình Huống Thực Tế Sâu

---

### Case 1: How Vercel Uses AI — Building AI-First Developer Tools

**Context**: Vercel is both a platform company AND now an AI tooling company. Their bet: if AI changes how software is built, the infrastructure and tools must be AI-native.

**v0 (UI Generation)**:

- Product: Generate React + Tailwind UI from natural language descriptions
- Architecture: Multi-turn conversation → Claude models → JSX + shadcn/ui components → live preview
- Engineering challenges: Ensuring generated code is valid React, accessible, mobile-responsive; handling ambiguity in user requests; incremental editing (change one component without regenerating all)
- Business insight: v0 lowered the barrier for designers and PMs to prototype UIs → expanded their total addressable market beyond developers

**Vercel AI SDK**:

- Engineering insight: "LLM integration patterns are now commodity infrastructure — abstract them." The SDK provides streaming, structured output, tool calling, multi-provider support as first-class primitives.
- Design decision: Provider-agnostic interface → teams can switch from OpenAI to Anthropic to Google without rewriting app code
- Key patterns encoded: streamText, generateObject (structured output with Zod schema), tool use, multi-step tool chains

```typescript
// Vercel AI SDK — structured output example
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

const { object } = await generateObject({
  model: anthropic("claude-3-5-sonnet-20241022"),
  schema: z.object({
    components: z.array(
      z.object({
        name: z.string(),
        props: z.record(z.string()),
        children: z.array(z.string()),
      }),
    ),
  }),
  prompt: "Design a hero section for a SaaS landing page",
});
```

**Lessons for engineers**:

1. AI tools become moats when deeply embedded in workflow (Copilot → Cursor → v0 progression)
2. DX (Developer Experience) for AI tools matters as much as capability
3. Open-source SDK + hosted service = developer trust + enterprise conversion

---

### Case 2: How Stripe Uses LLMs — AI for Fraud Detection and Developer Experience

**Context**: Stripe processes $817B in payments annually (2023). They've integrated LLMs across two very different use cases: fraud detection (high-stakes, needs explainability) and developer tools (productivity, creative).

**Stripe Radar (Fraud Detection)**:

- NOT a pure LLM problem: fraud detection relies on classic ML (gradient boosting, network analysis for fraud rings) + business rules
- LLM role: Assist fraud analysts in explaining _why_ a transaction was flagged → natural language explanation of ML model decision (explainability layer)
- Engineering constraint: decisions must be auditable (financial regulations), explainable (chargebacks), sub-100ms latency (payment flow) → LLM is offline assistant, not in payment critical path

**Stripe Docs + Stripe Assist**:

- Challenge: Stripe API has 500+ endpoints, 5000+ pages of docs. Even experienced developers struggle to find the right API pattern.
- Solution: LLM-powered docs search + code generation. User asks "how do I implement subscription with trial period?" → system retrieves relevant docs chunks (RAG) + generates code example in user's language/framework
- Key design: Answer grounded in actual Stripe docs → reduced hallucination on API details
- Result: Significantly reduced developer time-to-first-API-call

**Lessons for engineers**:

1. High-stakes decisions (fraud, finance, medical) → LLM assists human, doesn't replace human
2. RAG dramatically improves LLM accuracy for domain-specific APIs
3. Latency constraints determine where in pipeline LLM can live (never in sub-100ms critical path)
4. Developer tools + AI = compound moat (Stripe is both payments API and developer platform)

---

### Case 3: Zalo/VNG and Grab Vietnam — AI Adoption in the Vietnamese Market

**Context**: Vietnam's tech ecosystem is undergoing rapid AI adoption, driven by two distinct forces: local champions (Zalo/VNG) building for Vietnamese language/culture, and regional leaders (Grab, Shopee) deploying global AI capabilities with local adaptation.

**Zalo (VNG) — AI in Scale**:

- **Vietnamese NLP challenge**: Vietnamese is morphologically complex, tonal (6 tones), contextual ambiguity. English-trained models perform poorly → VNG built own Vietnamese language models (Zalo-E2E, ViT5)
- **Use cases**: Content moderation at scale (100M+ messages/day via Zalo), recommendation system for ZaloPay merchants, customer service automation for B2B products
- **Engineering approach**: Hybrid → global model (GPT/Claude) for complex generation, custom Vietnamese model for classification/moderation
- **Hiring signal**: VNG now actively seeks engineers who can integrate LLM APIs, build evaluation pipelines for Vietnamese language outputs, and understand multilingual model trade-offs

**Grab Vietnam — Operations AI**:

- **Demand forecasting**: ML models predict driver supply needed by zone/time → reduce wait time. AI-generated insights for driver-partners ("Drive to Quận 1 now — demand spike expected")
- **Safety AI**: Real-time trip monitoring — anomaly detection if trip deviates from route → alert safety team
- **GenAI for driver/merchant support**: LLM-powered FAQ bot in Vietnamese + English → deflect 60% of support tickets
- **Key insight**: AI succeeds when it augments human judgment in operations (driver decisions, safety ops) and automates high-volume, low-complexity support interactions

**Lessons for Vietnamese market engineers**:

1. English-centric AI tools need local adaptation for Vietnamese language tasks
2. Operations + AI = competitive moat for O2O (online-to-offline) platforms
3. Vietnam has large dataset advantage for user behavior (large, young, mobile-first population) — valuable for training local models
4. Interview signal for local companies: demonstrate awareness of Vietnamese NLP challenges + practical experience with multilingual models

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

**Question**: "How has AI changed your development workflow?" (30-second answer)

---

**🟢 Junior version** (30 seconds):

> "AI has made me 20–30% faster on boilerplate-heavy tasks. I use Copilot for test scaffolding and Cursor for refactoring. The biggest shift is how I handle unfamiliar APIs — instead of scanning docs for 20 minutes, I ask Claude, verify the output, then go deeper in docs if needed. What hasn't changed: I still write all business logic myself and review every AI suggestion before accepting it."

---

**🔴 Senior version** (30 seconds):

> "Three shifts: First, I use AI tools to compress the explore-prototype cycle — what took a sprint now takes a day for initial validation. Second, I've rebuilt how I evaluate code quality — I now ship AI features with eval pipelines, not just unit tests. Third, I think differently about system design — when designing features, I now ask 'what data do we need for future fine-tuning?' and 'where does this need human oversight?' AI literacy is now a prerequisite for system design conversations at my level."

---

## ✅ Self-Check / Tự Kiểm Tra

> **Hãy đóng file này lại và trả lời các câu hỏi sau từ trí nhớ:**

1. **Recall**: Name 4 AI coding tools and one specific use case + limitation for each.
2. **Understand**: Explain RAG to a colleague who only knows SQL databases. Use an analogy.
3. **Apply**: You're building an LLM feature that costs $500/day. Name 3 strategies to reduce cost to $200/day.
4. **Analyze**: A RAG system has high retrieval recall but users still say answers are wrong. What's the most likely root cause?
5. **Evaluate**: Your team wants to use AI to automate hiring screening. What are the technical challenges AND ethical concerns you'd raise before agreeing?
6. **Create**: Design a T-shaped skill development plan for a Mid-level engineer who wants to reach Senior within 18 months, specifically incorporating AI skills.

> _Nếu bạn không trả lời được ≥4/6 câu, đọc lại Block A tương ứng._

---

## 🧠 Feynman Prompt

> **"Explain to a non-tech CEO why engineers need AI skills in 2025"**

---

**Sample answer** (practice adapting this):

"CEO, imagine your competitors just hired 10 extra engineers for every 10 they already have — at no additional cost. That's what AI tools do for engineering teams that know how to use them. But there's a catch: the AI is very smart but also confident when wrong, forgets your company's specifics, and needs constant supervision.

Engineers with AI skills are like pilots who've trained on advanced autopilot systems: they let the autopilot handle routine tasks, stay alert for when it drifts, and immediately take control in complex situations. Engineers WITHOUT AI skills are like pilots who've never touched the autopilot — they'll fly more slowly and get exhausted on long routes.

In practical terms: an AI-skilled engineer can prototype a feature in one day instead of one week. They can build an AI-powered customer support bot that handles 60% of tickets automatically. They can evaluate whether the AI feature is actually working, or silently making things worse. Without these skills, your team will build slower AND build worse AI products than competitors.

The cost of not investing in AI skills now? 12 months from now, your competitors' engineers will be operating at 3× efficiency on AI-augmented work. That's a gap that's very hard to close."

---

## 🔁 Spaced Repetition / Lịch Ôn Tập

> Based on Ebbinghaus forgetting curve + Active Recall (Karpicke 2008) + Interleaving (Rohrer 2012)

| Day        | Activity                                                                                                                                         | Focus                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| **Day 1**  | Read Blocks A1-A3. Do Self-Check Q1-3.                                                                                                           | AI tools, Prompt Engineering, RAG     |
| **Day 3**  | Read Blocks A4-A7. Review Q1-3 from memory first. Do Self-Check Q4-6.                                                                            | Integration, Testing, Ethics, T-Shape |
| **Day 7**  | Attempt all 18 Q&A without reading answers. Check which ones you struggled with. Re-read those concepts only.                                    | Full B block retrieval                |
| **Day 14** | Read Study Cases (Block C). For each case, write 3 lessons in your own words. Practice Cold Call simulation aloud.                               | Cases + verbal articulation           |
| **Day 30** | Teach one concept (your choice) to a colleague or rubber duck. Do Feynman prompt aloud. Re-read only the concepts you couldn't explain fluently. | Active recall + teaching              |

**Interleaving tip**: Mix this file's review with [ML Fundamentals](./01-ml-fundamentals.md) and [Agent Patterns](./03-agent-patterns.md) review sessions — alternating topics accelerates long-term retention.

---

## 🔗 Connections / Liên Kết

| Related File                                                                   | Connection                                                                               |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| [01-ml-fundamentals.md](./01-ml-fundamentals.md)                               | Foundation for understanding why LLMs work — backprop, gradient descent, neural networks |
| [02-llm-and-transformers.md](./02-llm-and-transformers.md)                     | Deep dive into transformer architecture — attention, tokenization, training              |
| [03-agent-patterns.md](./03-agent-patterns.md)                                 | Agent design patterns referenced throughout: ReAct, planning, tool use                   |
| [05-ai-engineering-practice.md](./05-ai-engineering-practice.md)               | Production AI engineering practices — observability, incident response                   |
| [09-claude-and-anthropic-deep-dive.md](./09-claude-and-anthropic-deep-dive.md) | Claude-specific capabilities referenced in tools and integration patterns                |

**External Resources**:

- [Anthropic: Building effective agents](https://www.anthropic.com/research/building-effective-agents) — 5 canonical agent patterns
- [Vercel AI SDK docs](https://sdk.vercel.ai/docs) — streaming, structured output, tool use in TypeScript
- [RAGAS](https://docs.ragas.io/) — RAG evaluation framework
- [LangSmith](https://www.langchain.com/langsmith) — LLM observability and eval platform
- Stanford CS229: ML, MIT 6.S191: Deep Learning, CMU 11-711: Advanced NLP
- StackOverflow 2024 Developer Survey — AI tool adoption statistics

---

> _File maintained by interview-2025 knowledge base. Last reviewed: AI landscape evolves rapidly — validate tool-specific details quarterly._
