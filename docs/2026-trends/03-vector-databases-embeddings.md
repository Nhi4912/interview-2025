# 03 - Vector Databases & Embeddings (2026)

> **Track**: Shared (BE-leaning) | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Back to**: [00-table-of-contents.md](../00-table-of-contents.md) · [2026-trends README](./README.md)
> **Prereq**: [02-llm-system-design.md](./02-llm-system-design.md), [shared/06-ai-and-agents/04-rag.md](../shared/06-ai-and-agents/04-rag.md), [shared/03-database](../shared/03-database/)

---

## 🌍 Real-World Scenario / Bối Cảnh Thực Tế

**Shopify Sidekick (2024 → 2025).** Shopify's merchant assistant needed to answer "which of my products sold best in December?" plus "find me a hero image for sneakers". The first is **structured SQL** over orders, the second is **semantic search** over product images and descriptions. Their 2024 v1 used a separate Pinecone cluster + Postgres; ops complexity exploded — schema drift between two systems, dual-writes, eventual consistency bugs leaking wrong recommendations to merchants.

In 2025 they consolidated to **pgvector inside their existing Postgres** for ~95% of workloads, keeping a dedicated vector store only for the highest-QPS image search. Result: 1 system to operate, ACID guarantees on writes, $X00K/year saved, P99 retrieval well under SLO.

**Bài học (VI):** Vector DB không phải "đồ chơi mới ngầu" — nó là một database. 2026, câu hỏi interview không còn là "Pinecone hay Weaviate" mà là **"khi nào dùng pgvector, khi nào dùng dedicated, và embedding strategy của bạn là gì?"**. Trả lời sai = lộ junior.

---

## 🧠 Memory Hook

> **"Embed once, search many — but version your embeddings like code."**
> Embedding model = compiler; vectors = compiled artifacts. Bump compiler → recompile everything.

**Mnemonic: HNSW** (the dominant index) = **H**ighway **N**etwork for **S**imilarity **W**alking — multi-layer skip-list trong không gian vector.

---

## 📚 Block A — Theory (Lý Thuyết Cốt Lõi)

### A1. Why Vector DBs exist / Tại sao tồn tại

**Why level 1:** Traditional DBs (Postgres, MySQL) compare values for **equality / range**. They cannot answer "find rows whose 1536-dim vector is closest to this query vector" in less than O(N) without specialized indexes.
**Why level 2:** LLM apps need **semantic search** — meaning-based, not keyword-based. Semantic = vector cosine similarity. At 1M+ vectors, brute-force cosine is too slow (>1s); we need **Approximate Nearest Neighbor (ANN)** indexes.
**Why level 3:** ANN trades a tiny bit of recall (95-99%) for 100-1000x speedup. That trade-off requires a different storage engine + index structure → vector DB category.

**VI:** DB cũ chỉ biết so sánh `=`, `<`, `>`, `LIKE`. Không thể trả lời "tìm dòng có vector gần với query này" nhanh trên 1M dòng. Vector DB sinh ra để giải quyết bài toán đó với index ANN — đổi 1-5% recall lấy tốc độ 100-1000 lần.

---

### A2. Core Concept 1 — Embeddings (the "vector" in vector DB)

**Memory Hook:** _"Embedding = lossy compression of meaning into a fixed-length number list."_

**Layer 1 (Analogy):** Embedding như tọa độ GPS cho ý nghĩa. Mỗi câu/đoạn/ảnh được đặt vào một điểm trong không gian 768/1024/1536 chiều. Câu cùng ý nghĩa = điểm gần nhau. "King" - "man" + "woman" ≈ "queen" — cổ điển nhưng minh họa được.

**Layer 2 (How It Works):**

```
Text: "How do I cancel my subscription?"
   │
   ▼
┌──────────────────────────┐
│ Tokenizer                │  ← BPE / SentencePiece
│ → [1234, 56, 7890, ...]  │
└──────┬───────────────────┘
       ▼
┌──────────────────────────┐
│ Embedding Model          │  ← e.g., text-embedding-3-large
│ (transformer encoder)    │     OpenAI / Cohere / BGE / E5
│ → [0.012, -0.43, ..., 0.78]
│   (1536-dim vector)      │
└──────┬───────────────────┘
       ▼
┌──────────────────────────┐
│ L2 normalize (optional)  │  ← so cosine == dot product
└──────┬───────────────────┘
       ▼
   Store in vector DB
```

**Embedding model leaderboard reality (MTEB, late 2025):**

| Model                         | Dim                       | Cost / 1M tok | Best for                      |
| ----------------------------- | ------------------------- | ------------- | ----------------------------- |
| OpenAI text-embedding-3-large | 3072 (or 256-1536 reduce) | $0.13         | General, strong baseline      |
| OpenAI text-embedding-3-small | 1536 (or down)            | $0.02         | Cost-sensitive, very good     |
| Cohere embed-v3               | 1024                      | $0.10         | Multilingual, EU residency    |
| BGE-M3 (open)                 | 1024                      | self-host     | Multilingual + sparse + dense |
| Voyage-3                      | 1024                      | $0.06         | Code, finance domains         |
| OSS: nomic-embed, gte-large   | 768                       | self-host     | Privacy / on-prem             |

**Matryoshka embeddings (2024+):** new models support **dim truncation** (e.g., 3072 → 256) with minimal accuracy loss → store small, search fast, re-rank top-K with full dim if needed. **Massive cost saver.**

**Layer 3 (Edge Cases):**

- **Multilingual mismatch**: embedding "khách hàng" with English-only model → poor results vs. Vietnamese docs. Use multilingual model (Cohere multilingual, BGE-M3) or translate at index time.
- **Domain shift**: general embeddings on legal/medical/code → poor. Solutions: fine-tune embedding (rare, hard) OR add lexical search (BM25) OR use domain-specific models (Voyage-code, BGE-finance).
- **Asymmetry**: query vs. document have different shapes. Some models (E5, BGE) require prefix `"query: "` vs `"passage: "` — forgetting drops recall 10%+.

---

### A3. Core Concept 2 — ANN Index (HNSW, IVF, ScaNN, DiskANN)

**Memory Hook:** _"HNSW = skip-list in vector space. Build slow, query fast, RAM-hungry."_

**Layer 1:** Tìm láng giềng gần như tìm đường — brute-force là đi bộ kiểm tra từng nhà; HNSW xây "đường cao tốc" giữa các cụm để nhảy nhanh đến vùng đúng, rồi đi bộ ngắn ở cuối.

**Layer 2:**

**HNSW (Hierarchical Navigable Small World)** — used by pgvector, Qdrant, Weaviate, Milvus:

```
Layer 3 (sparsest): ●────────────●────────────●
                    │            │            │
Layer 2:            ●──●─────●───●─────●──●───●
                    │  │     │   │     │  │   │
Layer 1:            ●──●──●──●──●●●──●─●──●─●─●
                    │  │  │  │  │││  │ │  │ │ │
Layer 0 (all pts):  ●●●●●●●●●●●●●●●●●●●●●●●●●●

Search: enter at top, greedy walk to closest, descend.
Build: probabilistic level assignment, link to M nearest at each level.
```

| Param                | Meaning                  | Trade-off                          |
| -------------------- | ------------------------ | ---------------------------------- |
| `M`                  | Edges per node per layer | High M = better recall, more RAM   |
| `efConstruction`     | Build-time search width  | High = better index, slower build  |
| `ef` (or `efSearch`) | Query-time search width  | High = better recall, slower query |

**IVF (Inverted File)** — used by FAISS, older Milvus: cluster vectors with k-means; at query, search only nearest C clusters. Lower RAM, lower recall ceiling.

**DiskANN / SPANN (Microsoft, 2024+)** — index lives mostly on **NVMe SSD**, RAM holds only navigation graph → 10x cheaper for billion-scale. Now in Milvus, Vespa, and Postgres extension `vectorscale` (Timescale).

**Quantization:**

- **Scalar quantization (SQ)**: float32 → int8, 4x size cut, ~1% recall loss.
- **Product quantization (PQ)**: split vector into sub-vectors, codebook each, 8-32x cut, more loss.
- **Binary quantization** (2024+): 1 bit per dim, 32x cut, surprisingly OK with reranking.

**Layer 3:**

- **Build cost matters**: HNSW build for 100M vectors = hours-days. Plan for **incremental insert** (HNSW supports) vs. rebuild (some IVF setups need).
- **Filtered search hardness**: vector DB needs to filter by `tenant_id` AND find nearest. Naive post-filter on top-K may miss results if K is small for filtered subset. Solutions: pre-filter with metadata index (Qdrant, Weaviate do well), partition by tenant (one index per tenant if N is small).
- **Recall@K vs. K**: report `recall@10` not `recall@1` — you usually rerank top 10-50 anyway.

---

### A4. Core Concept 3 — pgvector vs Dedicated Vector DBs

**Memory Hook:** _"Default to pgvector. Switch to dedicated only when you've proven you need to."_

**Layer 1:** Có Postgres rồi thêm `CREATE EXTENSION vector` là xong → tiết kiệm 1 hệ thống vận hành. Dedicated như Pinecone/Qdrant hơn ở scale rất lớn (>50M vectors, >1K QPS) hoặc cần feature đặc biệt.

**Layer 2 — Decision matrix:**

| Criterion                   | pgvector (PG 16+ with HNSW)                     | Qdrant / Weaviate         | Pinecone (managed)                   |
| --------------------------- | ----------------------------------------------- | ------------------------- | ------------------------------------ |
| Vectors handled comfortably | up to ~10M                                      | ~100M+                    | ~billion                             |
| QPS                         | hundreds                                        | thousands                 | thousands+                           |
| Filtered search             | OK with `pgvector` 0.7+ + IVFFlat/HNSW + B-tree | Excellent (payload index) | Excellent (metadata)                 |
| Hybrid (vector + BM25)      | ✅ in same DB (`tsvector`)                      | ✅ (Qdrant 1.10+)         | ⚠️ separate or via integration       |
| ACID with relational data   | ✅ Native — same transaction                    | ❌ Eventual               | ❌ Eventual                          |
| Ops complexity              | 0 (you already run PG)                          | 1 extra system            | 0 (managed) but vendor lock          |
| Cost (for 5M vectors)       | ~existing PG                                    | ~$200-500/mo self-host    | ~$70-300/mo managed                  |
| Data residency / on-prem    | ✅ wherever PG runs                             | ✅ self-host              | ❌ cloud only (Serverless EU exists) |

**pgvector minimum config for production (PG 16, pgvector 0.7+):**

```sql
CREATE EXTENSION vector;

CREATE TABLE doc_chunks (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  doc_id UUID NOT NULL,
  chunk_idx INT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536) NOT NULL,
  embedding_model TEXT NOT NULL DEFAULT 'text-embedding-3-small',
  embedding_version INT NOT NULL DEFAULT 1,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- HNSW index (build slow, query fast)
CREATE INDEX ON doc_chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Filter index for multi-tenant
CREATE INDEX ON doc_chunks (tenant_id);

-- Hybrid: full-text
ALTER TABLE doc_chunks ADD COLUMN content_tsv tsvector
  GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;
CREATE INDEX ON doc_chunks USING gin(content_tsv);
```

**Query pattern (filtered + hybrid):**

```sql
-- Set ef at query time
SET hnsw.ef_search = 100;

WITH vec AS (
  SELECT id, content, 1 - (embedding <=> $1::vector) AS vec_score
  FROM doc_chunks
  WHERE tenant_id = $2 AND embedding_version = 1
  ORDER BY embedding <=> $1::vector
  LIMIT 50
),
bm AS (
  SELECT id, ts_rank(content_tsv, plainto_tsquery('english', $3)) AS bm_score
  FROM doc_chunks
  WHERE tenant_id = $2 AND content_tsv @@ plainto_tsquery('english', $3)
  LIMIT 50
)
SELECT id,
       COALESCE(vec_score, 0) * 0.6 + COALESCE(bm_score, 0) * 0.4 AS hybrid_score
FROM vec FULL OUTER JOIN bm USING (id)
ORDER BY hybrid_score DESC
LIMIT 20;
```

(Then send top-20 to a reranker; final top-5 into LLM.)

**Layer 3:**

- **HNSW index size**: roughly `4 * dim * num_vectors + M * 8 * num_vectors` bytes. For 1M vectors at 1536 dim, M=16 → ~6 GB RAM. Plan accordingly.
- **VACUUM and HNSW**: deletes don't reclaim graph slots immediately; periodic `REINDEX CONCURRENTLY` on heavy-churn tables.
- **Connection pooling for vector queries**: large vector parameters bloat pgbouncer in transaction mode; use session pooling or direct.

---

### A5. Core Concept 4 — Chunking Strategy

**Memory Hook:** _"Chunking is where most RAG quality is won or lost. Below 200 tokens too noisy, above 1000 too unfocused."_

**Layer 1:** Cắt tài liệu thành miếng vừa miệng cho model. Cắt quá nhỏ = mất ngữ cảnh ("nó" trỏ về cái gì?). Cắt quá to = nhồi rác vào prompt.

**Layer 2 — Strategies (in order of typical quality):**

| Strategy                    | How                                                         | When                                  |
| --------------------------- | ----------------------------------------------------------- | ------------------------------------- |
| Fixed-size + overlap        | 500 tokens, 50 overlap                                      | Default, easy, OK quality             |
| Sentence/paragraph aware    | Split on `.`, `\n\n`; pack to ~500 tok                      | Better than fixed, almost free        |
| Markdown/code aware         | Split on `##` headings, function defs                       | Excellent for docs / code             |
| Semantic chunking           | Embed sentences, split where embedding distance jumps       | Highest quality, slow & expensive     |
| Hierarchical (parent-child) | Index small chunks; on hit, return parent chunk for context | Best for QA over long structured docs |

**Production rule of thumb (2025 industry):**

- **Docs / wiki / help center**: markdown-aware, 400-600 tokens, 10% overlap, **add doc title + section headers as prefix to each chunk** (huge win).
- **Code**: function-level chunking; include file path + class context.
- **Long PDFs**: hierarchical — child = paragraph, parent = section.
- **Conversations**: turn-pair (user+assistant) as chunk.

**Metadata to store with EVERY chunk:**

```
{
  doc_id, doc_title, doc_url,
  chunk_idx, chunk_total,
  section_path: "Billing > Subscriptions > Cancel",
  source_type: "help_doc",
  updated_at,
  tenant_id,
  embedding_model, embedding_version
}
```

The `section_path` and `doc_title` enable **rich citations** ("From _Billing > Cancel Subscription_: …") and let the model reason about doc structure.

**Layer 3:**

- **Chunk-level dedup**: large doc bases have near-duplicate paragraphs (boilerplate). Hash chunks; deduplicate before embedding to save cost and avoid retrieval noise.
- **Updated docs**: when a doc changes, re-chunk and re-embed only changed sections (diff at section level), not whole doc.
- **Cross-chunk references**: "see section above" loses meaning when retrieved alone. Resolve in chunking pass or include parent context.

---

### A6. Common Mistakes Table

| Sai lầm                                     | Tại sao sai                                                                            | Đúng là                                                             |
| ------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| "Just dump whole docs as one vector each"   | Lost-in-the-middle inside the doc; can't pinpoint source                               | Chunk to 400-600 tokens with metadata                               |
| "Use OpenAI ada-002 (the famous one)"       | Deprecated, replaced by text-embedding-3-\* (better + cheaper)                         | Use text-embedding-3-small as default 2026 baseline                 |
| "Mix embedding models in same index"        | Vectors from different models live in different spaces — similarity scores meaningless | One model per index; tag `embedding_version` and migrate atomically |
| "Use Pinecone because the blog said so"     | Adds 1 system to operate; pgvector handles 90% of workloads                            | Default pgvector; switch only on measured need                      |
| "Vector search alone is enough"             | Misses exact-keyword queries (product codes, error messages, names)                    | Hybrid: vector + BM25 + RRF + rerank                                |
| "Forget the `query: ` / `passage: ` prefix" | E5/BGE recall drops 10%+ silently                                                      | Read model card; apply prefix at index AND query                    |
| "Filter after vector search"                | If filtered subset is rare, top-K returns nothing                                      | Pre-filter at DB level (pgvector WHERE, Qdrant payload index)       |
| "Embed once, never re-embed"                | Embedding models improve; old vectors become inferior                                  | Track `embedding_version`; plan re-embed for major upgrades         |
| "Dim 3072 for everything"                   | Storage + RAM blow up, search slower; small dim often within 1-2% recall               | Use Matryoshka 256-1024 dim; rerank with full dim if needed         |

---

### A7. 🎯 Interview Pattern

**Trigger keywords:**

- "Build a search over our help center / wiki / codebase"
- "Recommend similar products / similar customers"
- "Why vector DB instead of Elasticsearch / Postgres?"
- "How would you scale RAG to 100M documents?"
- "Pinecone vs pgvector vs Weaviate?"

**Opening (memorize):**

> "I'd start by clarifying corpus size, QPS, freshness, and whether queries need filters or hybrid lexical+semantic. Default storage is pgvector if I already run Postgres — it's one less system to operate. I'd switch to a dedicated vector DB only when I've measured a specific need: scale beyond ~10M vectors, sustained QPS in thousands, or features pgvector lacks."

This signals: pragmatic, not hype-driven, knows the trade-offs.

---

### A8. 🔑 Knowledge Chain

**📚 Prerequisites:**

- [shared/06-ai-and-agents/04-rag.md](../shared/06-ai-and-agents/04-rag.md) — RAG basics
- [shared/03-database/01-fundamentals.md](../shared/03-database/01-fundamentals.md) — DB indexing concepts
- [02-llm-system-design.md](./02-llm-system-design.md) — where vector DB fits in the stack

**➡️ Enables:**

- [09-ai-agent-evaluation-production.md](./09-ai-agent-evaluation-production.md) — eval recall@K, precision@K of your retrieval
- [shared/06-ai-and-agents/07-ai-system-design.md](../shared/06-ai-and-agents/07-ai-system-design.md) — full AI SD interviews

---

## 💬 Block B — Interview Q&A

---

### B1. 🟢 Q1: "What is an embedding?"

**💡 Signal:** ✅ "lossy meaning compression to fixed-length vector + similar items end up close" / ❌ "it's an array"

**EN:** A fixed-length numeric vector (e.g., 1536 floats) produced by a neural network from text/image/audio, designed so that **semantically similar inputs map to nearby points** under a similarity metric (usually cosine). Embeddings let us do "find similar" in sub-linear time using ANN indexes.

**VI:** Vector số chiều cố định, sinh bởi model, có tính chất nội dung giống nhau → vector gần nhau (cosine cao). Đây là viên gạch của semantic search và RAG.

---

### B2. 🟢 Q2: "Cosine similarity vs dot product vs Euclidean — which to use?"

**💡 Signal:** ✅ Knows that L2-normalized vectors make cosine == dot product / ❌ "Cosine because it's standard"

**EN:** Choose by **what your model outputs** and **whether vectors are normalized**:

- **Cosine**: angle between vectors, ignores magnitude. Default for most text embeddings.
- **Dot product**: faster (no division), but cares about magnitude. Equivalent to cosine **if vectors are L2-normalized** — most modern embedding APIs already L2-normalize.
- **Euclidean (L2)**: distance in space. Used in some image embedding setups (CLIP variants).

**Practical:** If your model is L2-normalized (OpenAI 3-\* are by default), use **inner product** in your DB — fastest, identical results to cosine. pgvector: `<#>` operator (negative inner product).

**VI:** Vector đã chuẩn hoá L2 → inner product == cosine, mà inner product nhanh hơn. Default text embedding hiện đại đều L2-norm sẵn → dùng `<#>`.

---

### B3. 🟢 Q3: "What is HNSW and why is it the dominant ANN index?"

**💡 Signal:** ✅ Skip-list analogy, recall/latency trade-off via `ef`, RAM cost / ❌ "It's just fast"

**EN:** Hierarchical Navigable Small World — a multi-layer graph where top layers are sparse (long-range edges) and bottom layer contains all points (short-range). Search starts at the top, greedily walks toward the query, descends layer by layer. Achieves logarithmic search complexity in practice.

It dominates because: (a) high recall (95-99%) at low latency, (b) supports incremental insert, (c) tunable via `M`, `efConstruction`, `efSearch`. Trade-off: RAM-heavy (graph in memory) and slow build.

**VI:** Đồ thị nhiều tầng kiểu skip-list trong không gian vector. Tìm logarit, recall 95-99%, support insert dần. Đổi lại: tốn RAM và build chậm.

---

### B4. 🟡 Q4: "Vector DB returns top 10 by similarity — why isn't that enough? Why rerank?"

**💡 Signal:** ✅ "Embedding similarity ≠ relevance; cross-encoder evaluates query+doc jointly" / ❌ "More results = better"

**EN:** Embedding similarity is **bi-encoder**: the embedding of query and doc are computed _independently_, then compared by cosine. This loses query-doc interaction signal — two docs may both be "about the topic" but only one actually answers the question.

A **cross-encoder reranker** (Cohere Rerank, BGE-reranker, Voyage-rerank) takes `(query, doc)` as a single input and outputs a relevance score with full attention between them. Much more accurate, but ~100x slower per pair → use only on top 20-50 candidates from cheap retrieval.

Production numbers (Cohere Rerank 3, 2025 disclosed): vector-only 67% → vector+BM25 78% → +rerank 89% answer accuracy. Cost: +$0.001/query, +80ms.

**VI:** Vector tìm nhanh nhưng chỉ đo "gần nghĩa", không đo "trả lời đúng". Reranker là cross-encoder — đọc query và doc cùng lúc, chấm điểm chính xác hơn nhiều. Chậm nên chỉ dùng cho top 20-50.

---

### B5. 🟡 Q5: "How do you handle multi-tenant filtering with vector search?"

**💡 Signal:** ✅ Pre-filter at index level + tenant in cache key + audit / ❌ Post-filter top-K

**EN:** Three approaches:

1. **Pre-filter (preferred):** push `WHERE tenant_id = $1` into the vector DB so HNSW search only walks vectors matching the filter. pgvector + B-tree on `tenant_id`, Qdrant/Weaviate/Pinecone all have payload/metadata index for this.
2. **Index-per-tenant:** if N tenants is small (<1000) and corpus per tenant large, give each its own collection/index. Pros: clean isolation, simpler queries. Cons: ops overhead.
3. **Post-filter (avoid):** retrieve top-K globally, filter in app. Fails for small tenants — top-K may have 0 matching rows.

Always: include `tenant_id` in cache key, log every retrieval with tenant_id for audit, periodically test cross-tenant isolation with red-team queries.

**VI:** Lọc _trước khi_ tìm vector (DB-level filter). Tenant nhỏ và nhiều → pre-filter; tenant lớn và ít → 1 index/tenant. Đừng post-filter — top-K có thể trống.

---

### B6. 🟡 Q6: "Quantization (PQ, SQ, binary) — when to use, what do you lose?"

**💡 Signal:** ✅ Trade-off: storage/RAM cost vs recall, rerank with full precision / ❌ "always use it" or "never use it"

**EN:**

- **Scalar Quantization (SQ, int8)**: 4x size reduction, ~1% recall loss. **Almost free win.** Use by default at scale.
- **Product Quantization (PQ)**: 8-32x reduction, 5-15% recall loss. Use when storage/RAM is binding constraint.
- **Binary Quantization**: 32x reduction, 10-30% recall loss alone, **but** combined with full-precision rerank of top-100, recall can recover to 95%+. Used by Qdrant, Weaviate, pgvector (`vectorscale`).

**Pattern**: store both quantized (fast search) and full-precision (rerank) — `binary search top 100 → full-precision rerank to top 10 → cross-encoder rerank to top 5`.

**VI:** Nén vector để tiết kiệm RAM/disk. SQ gần như miễn phí (mất 1% recall, giảm 4x). Binary quantization cực gọn nhưng phải rerank lại bằng full-precision. Pattern hai tầng: search nén → rerank full → cross-encoder.

---

### B7. 🔴 Q7 (Bloom L5 - Evaluate): "Compare pgvector vs Pinecone vs Qdrant for a Series-B SaaS with 5M vectors, 50 QPS, multi-tenant, EU residency."

**💡 Signal:** ✅ Multi-criteria with explicit recommendation conditional on context / ❌ Single answer

**EN: Decision matrix:**

| Criterion                  | pgvector (PG 16+)        | Qdrant (self-host EU)               | Pinecone Serverless EU   |
| -------------------------- | ------------------------ | ----------------------------------- | ------------------------ |
| Handles 5M @ 50 QPS        | ✅ Yes (with HNSW)       | ✅ Yes easily                       | ✅ Yes easily            |
| Multi-tenant filter        | ✅ Good (PG indexes)     | ✅ Excellent (payload index)        | ✅ Excellent             |
| EU residency               | ✅ Wherever your PG is   | ✅ Self-hosted in EU                | ✅ Pinecone EU regions   |
| ACID with relational data  | ✅ Same DB, same txn     | ❌ Eventual                         | ❌ Eventual              |
| Hybrid (vector + BM25)     | ✅ `tsvector` in same DB | ✅ Built-in                         | ⚠️ Via integration       |
| Ops cost                   | 0 extra system           | 1 extra system to monitor & upgrade | 0 ops, vendor managed    |
| $ cost (rough, 5M vectors) | included in PG           | $200-500/mo VM                      | $70-300/mo               |
| Vendor lock                | ❌ Open standard         | ❌ Open source                      | ⚠️ Pinecone-specific API |

**Recommendation for the scenario:** **pgvector** is the right default. Reasons specific to scenario:

- 5M @ 50 QPS is well within pgvector capacity on a beefy PG instance.
- Multi-tenant + EU residency satisfied by where you already run Postgres.
- ACID with billing/user tables matters for SaaS — embeddings + relational rows in one transaction.
- One less system on the org's incident page.

**Switch to Qdrant if:** you need very fast filtered search at scale, or sustained P99 < 50ms is hard on PG, or you're scaling to 50M+ vectors. **Switch to Pinecone if:** team capacity for ops is zero and vendor lock is acceptable.

**VI:** pgvector mặc định cho 5M / 50 QPS / EU / multi-tenant — vì đỡ 1 hệ thống và transaction chung với DB chính. Đổi qua Qdrant nếu cần filtered search siêu nhanh ở scale lớn; Pinecone nếu team không có capacity ops.

---

### B8. 🔴 Q8 (Bloom L6 - Create): "Design retrieval for a 100M-doc legal research platform. P95 < 800ms, hybrid, multi-tenant, with re-embedding capability for model upgrades."

**💡 Signal:** ✅ Layered retrieval, sharding strategy, embedding versioning migration plan, eval / ❌ "Just use Pinecone"

**EN:**

**Step 1 — Capacity:** 100M docs × ~5 chunks = 500M vectors. At 1024 dim float32 = ~2 TB raw. With HNSW + scalar quant: ~700 GB index. P95 < 800ms means retrieval ≤ 400ms (leaving budget for rerank + LLM).

**Step 2 — Architecture:**

```
Query
  │
  ▼
[Query rewriter] (LLM small, expand legal terms, generate alt phrasings)
  │
  ▼
[Two-stage retrieval]
  ├── Stage A: Sharded ANN search
  │     - Shard by jurisdiction (US/EU/UK/...) — natural partition
  │     - Within shard: Qdrant or Vespa, HNSW + binary quant for speed
  │     - Pre-filter: tenant_subscription, jurisdiction, date_range
  │     - Top 200 per shard, ~1000 candidates merged
  ├── Stage B: BM25 (Vespa or OpenSearch)
  │     - Same shard, top 200
  │     - Boost exact citations, statute numbers, case names
  └── RRF merge → top 100
  │
  ▼
[Cross-encoder rerank] (legal-domain reranker, e.g., fine-tuned BGE)
  Top 100 → top 10
  │
  ▼
[Citation expansion]
  For each top-10, fetch parent context (full case headnote)
  │
  ▼
LLM with grounded context + citation requirement
```

**Step 3 — Embedding versioning & re-embed strategy:**

```
Tables (per shard):
  doc_chunks (id, content, metadata, ...)
  embeddings (chunk_id, model_version, vector, created_at)
    -- one chunk can have multiple model versions during migration

Read path: WHERE model_version = current_version

Migration: blue/green
  1. Set up new model = 'v3' (e.g., text-embedding-3-large → bge-legal-v1)
  2. Background job re-embeds all chunks → embeddings(v=3 rows)
  3. Build new HNSW index on v=3 vectors (concurrent)
  4. Eval on golden legal Q set; gate switch
  5. Flip read path to v=3
  6. After 30-day soak, drop v=2 rows + index
```

**Step 4 — Sharding rationale:** legal queries almost always have a jurisdiction filter, so sharding by it is **selectivity-aligned**. Within shard, no need for complex resharding.

**Step 5 — Eval:** golden set of 500 legal Q-A pairs per major jurisdiction; metrics: recall@10, citation precision (cited case actually contains the cited proposition), answer correctness via human-graded sample. Re-run on every model/index change.

**Trade-offs admitted:** rerank adds 100ms; binary quant loses some recall (recovered by full-precision rerank). Re-embed migration takes weeks for 500M vectors — plan resource & timeline.

**VI:** Shard theo jurisdiction (lọc tự nhiên), 2 tầng retrieval (vector binary-quant + BM25, RRF merge), reranker domain-specific. Embedding versioning bằng bảng riêng + blue/green re-embed. Eval bằng golden set có recall@10 + citation precision.

---

### B9. 🔴 Q9 (Bloom L4 - Analyze): "Recall dropped from 89% to 71% after we added 5M new docs. What happened?"

**💡 Signal:** ✅ Hypothesis tree covering distribution shift, index params, model drift / ❌ "Add more index params"

**EN: Diagnosis tree:**

1. **Distribution shift in new corpus**: new docs from a different domain (e.g., added legal docs to product-doc corpus). Embedding model's representation quality varies by domain. Action: stratified eval per source — see if recall dropped uniformly or only in new docs.
2. **HNSW `efSearch` too low for larger graph**: as N grew, default `ef` no longer covers enough of the graph. Action: increase `efSearch` (e.g., 100 → 200), measure recall vs latency.
3. **Build params too aggressive**: if new docs were inserted with lower `efConstruction`, graph quality is worse. Action: rebuild index with consistent `M` and `efConstruction`.
4. **Embedding model version drift**: maybe new docs were embedded with a different model version (auto-bumped by API provider). Action: check `embedding_model` column distribution; re-embed mismatches.
5. **Filter selectivity changed**: more docs per tenant → more candidates filtered out → top-K coverage drops. Action: if pre-filter is in app, switch to DB-level pre-filter.
6. **Eval set staleness**: golden set was tuned to old corpus; new docs' "right answer" not yet curated. Action: refresh golden set with new-doc questions.

Most common in practice (2024-2025 disclosed cases): #1 and #4. Treat #4 as a release management bug — pin embedding model version explicitly, never depend on "latest".

**VI:** 6 nghi vấn: domain shift, efSearch quá thấp, build params không nhất quán, version embedding bị drift, filter làm rỗng top-K, golden set lạc hậu. Hai lỗi phổ biến nhất là domain shift và version drift. Pin model version, đừng tin "latest".

---

### B10. 🔴 Q10 (Bloom L5 - Evaluate): "When NOT to use a vector DB?"

**💡 Signal:** ✅ Knows alternatives — keyword search, structured filters, knowledge graphs / ❌ "Always use vector DB"

**EN:** Don't use vector search when:

- **Query intent is exact-match / structured**: order ID lookup, SKU search, status filter — use a B-tree or inverted text index.
- **Corpus is small** (<1000 docs) and you can fit them all in the LLM's context with prompt caching — sometimes "long context" + "no retrieval" wins.
- **Domain is highly relational**: "find researchers who published with X and worked at Y after 2020" — knowledge graph (Neo4j, RDF) beats vector. Or **GraphRAG** as a hybrid.
- **Strict, citable answers required and answers are deterministic**: regulations lookup → exact text matching + structured indexing.
- **Tabular numeric Q&A**: "what's our MRR last month?" → SQL agent, not vector RAG.

Senior signal: vector DB is one tool. The interview-winning answer is _"this query is X-shaped, the right tool is Y, here's why."_

**VI:** Vector DB không phải búa cho mọi đinh. Câu hỏi structured / lookup → SQL/inverted index. Quan hệ phức tạp → graph. Tabular numeric → SQL agent. Corpus rất nhỏ → cứ nhồi vào prompt với caching. Senior là biết chọn đúng tool.

---

## 🧪 Block C — Study Cases

### C1. Shopify Sidekick — pgvector consolidation (2024 → 2025)

**Context:** Started with Pinecone for product semantic search + Postgres for transactional. Two systems → schema drift, dual-write bugs leaked wrong recommendations to merchants.

**Pivot:** moved ~95% of vector workloads into pgvector, kept dedicated only for the highest-QPS image search.

**Why it worked:** 5M product corpus, modest QPS per merchant, multi-tenant filter + ACID with order data mattered more than vector-DB-specific features. Result: 1 system, ACID writes, lower cost, simpler ops.

**Lesson:** "default to boring tech you already operate." Switch only when measured constraint binds.

---

### C2. Anthropic's docs search — hybrid + rerank (2024 disclosed)

**Context:** Anthropic's developer docs search was vector-only initially; users complained that exact API names ("Messages API beta header") returned conceptually similar but wrong sections.

**Fix:** added BM25 alongside vector (RRF merge), then a cross-encoder reranker. Reported answer accuracy lift from ~70% → ~89%, similar to Cohere's published benchmarks.

**Lesson:** even AI-native companies don't skip BM25. Lexical + semantic + rerank is the production trifecta.

---

### C3. Glean — enterprise multi-tenant search at scale (publicly described)

**Context:** Glean indexes documents from Google Drive, Slack, Jira, Confluence, etc., per company tenant. Permissions are strict — you must never see a doc you don't have access to in the source.

**Architecture highlights:**

- Per-tenant indexes (sharding by tenant) for isolation + simpler permission filtering.
- Permission cache mirrored from source systems; **filter at retrieval time** using the calling user's permission set (not just tenant_id, but per-document ACL).
- Continuous re-index from source change events.
- Hybrid retrieval + LLM-based reranking.

**Lesson:** in enterprise search, **permissions are part of retrieval correctness**, not an afterthought. Vector DB choice must support fast metadata-rich filtering at scale.

---

## 📋 C2. Interview Q&A Summary

| #   | Question                       | Difficulty | Core Concept       | Key Signal                                      |
| --- | ------------------------------ | ---------- | ------------------ | ----------------------------------------------- |
| 1   | What is an embedding           | 🟢         | Embedding basics   | Lossy meaning compression, similar→close        |
| 2   | Cosine vs dot vs L2            | 🟢         | Similarity metrics | L2-normalized → dot == cosine                   |
| 3   | What is HNSW                   | 🟢         | ANN index          | Skip-list in vector space, recall/latency knob  |
| 4   | Why rerank                     | 🟡         | Cross-encoder      | Bi-encoder loses interaction; rerank top 20-50  |
| 5   | Multi-tenant filter            | 🟡         | Filtered search    | Pre-filter at DB; index-per-tenant when N small |
| 6   | Quantization trade-offs        | 🟡         | Storage/recall     | SQ ~free; binary + rerank recovers recall       |
| 7   | pgvector vs Pinecone vs Qdrant | 🔴         | Tool selection     | Conditional matrix, default pgvector            |
| 8   | 100M-doc legal retrieval       | 🔴         | Full design        | Shard, hybrid, rerank, embedding versioning     |
| 9   | Recall dropped after growth    | 🔴         | Diagnosis          | Domain shift / efSearch / version drift         |
| 10  | When NOT to use vector DB      | 🔴         | Tool boundary      | SQL/graph/long-context alternatives             |

---

## ⚡ C3. Cold Call Simulation

**Interviewer:** _"Quick — I have 2M wiki articles, want semantic search, 20 QPS, on-prem. What's your stack?"_

**You (4 sentences):**

> "Default to pgvector since you likely already run Postgres on-prem — 2M @ 20 QPS is well within its envelope, and you avoid operating a second system. I'd embed with `text-embedding-3-small` (or BGE-M3 if multilingual / fully self-hosted), chunk to 400-600 tokens with section headers in metadata, and build an HNSW index `M=16, ef_construction=64`. Retrieval is hybrid — pgvector ANN top-50 plus `tsvector` BM25 top-50, RRF merged, then a Cohere reranker (or BGE-reranker if on-prem) cuts to top 5. Tenant_id and embedding_version are required filter columns from day one so future migrations are safe."

**Follow-up:** _"What if it grows to 50M and 500 QPS?"_

> _"Then I'd reconsider: shard pgvector, or move the vector layer to Qdrant/Vespa keeping Postgres for relational. Decision triggered by measured P99 violation, not speculation."_

---

## 🪞 C4. Self-Check Retrieval

1. **Retrieval:** Recite the 3 dominant ANN index families and one DB that uses each.
2. **Visual:** Sketch HNSW layers + greedy descent from §A3.
3. **Application:** You have product images + product titles. Design retrieval that handles both "find similar-looking shoes" and "find shoes named _Air Pegasus 40_".
4. **Debug:** New embedding model deployed, recall down 30%. Top 3 hypotheses, in order of likelihood?
5. **Teach:** Explain "why HNSW > brute force at 1M vectors" to a frontend engineer in 60 seconds.

---

## 💬 C5. Feynman Prompt

**Take 3 minutes. Explain to a backend engineer who's never done AI:**

> "Why can't I just use `LIKE '%query%'` in Postgres for semantic search? Why do I need this whole vector thing?"

Your answer should:

- Name the failure: `LIKE` is keyword-based; "cancel my plan" won't match a doc titled "Subscription Termination."
- Introduce embeddings as **meaning coordinates**.
- Mention that vector DBs are just Postgres-with-special-index — pgvector literally is.
- Land on: "use both — semantic for meaning, keyword (BM25) for exact terms, merge them."

---

## 🔁 C6. Spaced Repetition

| Day       | Action                                                                           |
| --------- | -------------------------------------------------------------------------------- |
| 1         | Read once, do Self-Check (C4).                                                   |
| 3         | Re-derive HNSW & RRF mentally; rewrite the pgvector schema from §A4 from memory. |
| 7         | Mock B7 (pgvector vs Pinecone vs Qdrant) in 3 minutes spoken.                    |
| 14        | Mock B8 (100M legal retrieval design) on whiteboard, 7 minutes.                  |
| 30        | Re-read 🔴 only; do B9 diagnosis exercise on a fresh fictional symptom.          |
| Quarterly | Refresh embedding model leaderboard (MTEB) and pricing — table in §A2 changes.   |

---

## 🔗 C7. Connections

**Same-track (2026-trends):**

- [02-llm-system-design.md](./02-llm-system-design.md) — where this retrieval feeds into the LLM stack.
- [09-ai-agent-evaluation-production.md](./09-ai-agent-evaluation-production.md) — how to evaluate retrieval quality (recall@K, MRR).
- [11-modern-observability.md](./11-modern-observability.md) — instrument retrieval latency per layer.

**Cross-track:**

- [shared/06-ai-and-agents/04-rag.md](../shared/06-ai-and-agents/04-rag.md) — RAG fundamentals.
- [shared/03-database/01-fundamentals.md](../shared/03-database/01-fundamentals.md) — DB indexing.
- [shared/03-database](../shared/03-database/) — broader DB knowledge for capacity & ops.
- [be-track/02-backend-knowledge/01-api-design.md](../be-track/02-backend-knowledge/01-api-design.md) — API patterns for retrieval services.
- [shared/02-system-design/01-fundamentals.md](../shared/02-system-design/01-fundamentals.md) — sharding & capacity reasoning.

---

> **Next file:** [04-edge-computing-serverless-2026.md](./04-edge-computing-serverless-2026.md) — runtime where many AI inference & retrieval frontends now live.
