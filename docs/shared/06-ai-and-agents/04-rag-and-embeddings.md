# RAG and Embeddings — Retrieval Augmented Generation và Embedding

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Tiki product search với RAG (thực tế):** User search "tai nghe không dây chống ồn tốt cho gaming" — full-text search chỉ match từ khóa, miss sản phẩm có mô tả "noise-cancelling wireless headset for gamers" (khác từ khóa, cùng nghĩa). Sau khi implement embedding-based search: embed query và product descriptions vào vector space, tìm nearest neighbors bằng cosine similarity. Search relevancy (NDCG@10) tăng 35%.

**Bài học:** Embeddings "hiểu" ngữ nghĩa, keyword search chỉ match text. RAG = embeddings + context injection vào LLM prompt — giải quyết cả hallucination (factual grounding) và semantic search (relevancy).

## What & Why / Cái Gì & Tại Sao

**Analogy:** Embedding giống tọa độ GPS cho từ ngữ: "king" và "queen" ở gần nhau trong không gian 1536 chiều, "cat" và "dog" gần nhau, "cat" và "king" xa nhau. RAG giống "cheat sheet" trong phòng thi: trước khi LLM trả lời, hệ thống tìm tài liệu liên quan nhất và đưa vào prompt — LLM viết câu trả lời dựa trên cheat sheet.

**Why it matters:** RAG là pattern #1 để build production AI features. Embedding-based search là foundation cho semantic search, recommendation systems, và duplicate detection.

---

## 1. Embeddings Basics / Nền tảng embedding

> 🧠 **Memory Hook:** Embedding như tọa độ GPS cho từ ngữ — "mèo" và "chó" ở cùng khu phố thú cưng, còn "mèo" và "máy bay phản lực" ở hai tỉnh khác nhau hoàn toàn.

**Tại sao tồn tại? / Why does this exist?**

Máy tính chỉ hiểu số, không hiểu nghĩa của từ — keyword search bỏ lỡ mọi từ đồng nghĩa. Cần cách biểu diễn "tai nghe gaming" và "noise-cancelling headset for gamers" ở gần nhau trong không gian số. Embedding giải quyết điều này bằng cách nén ngữ nghĩa thành vector.
→ **Why?** Semantic similarity phải có thể tính toán — bản đồ ý nghĩa dạng số mới làm được điều đó.
→ **Why?** Nếu không có embedding, mọi AI feature đều bị giới hạn ở exact match — không đủ cho production-grade search hay recommendation.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng thành phố với bản đồ có khu vực: khu hoàng gia ("vua", "hoàng hậu"), khu thú cưng ("mèo", "chó"), khu giao thông ("xe hơi", "máy bay"). Embedding là tọa độ GPS của từng từ trên bản đồ đó. Từ cùng "khu phố" thì nghĩa gần nhau. Khoảng cách trên bản đồ = khoảng cách ngữ nghĩa.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Text "king"
  → Tokenizer → Token IDs [1234, 567, ...]
  → Transformer encoder (BERT/GPT hidden states)
  → Mean pool → Dense vector [0.21, -0.13, 0.87, ..., 0.44]  (768–1536 dims)

Semantic closeness:
  sim("king",  "queen")  = 0.89  ← HIGH (same domain)
  sim("cat",   "kitten") = 0.94  ← VERY HIGH (near synonyms)
  sim("cat",   "king")   = 0.23  ← LOW (different domains)
  sim("bank",  "river bank") vs sim("bank", "Wells Fargo") ← context matters!
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Embedding model trained on English degrades for Vietnamese — dùng multilingual model (BGE-M3, LaBSE)
- Domain mismatch: general model hiểu "injection" là tiêm vaccine, không phải SQL injection
- Long text (>512 tokens) bị truncate — phải chunk trước khi embed
- Polysemy: "bank" (ngân hàng) vs "bank" (bờ sông) → context-aware embeddings (vs static word2vec)

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                           | Tại sao sai                                               | Đúng là                                                  |
| ------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------- |
| Embed toàn bộ document dài trong một lần          | Transformer có max token limit, thông tin bị truncate mất | Chunk document trước, embed từng chunk riêng             |
| Dùng embedding model khác nhau khi index và query | Vector space không consistent, cosine score vô nghĩa      | Luôn dùng cùng một model cho cả index lẫn query          |
| Bỏ qua domain mismatch của model                  | General model hiểu sai thuật ngữ chuyên ngành             | Evaluate model trên domain data thật, cân nhắc fine-tune |

**🎯 Interview Pattern:**

- Khi thấy: semantic search, recommendation engine, duplicate detection
- Nhớ đến: "embedding = GPS coordinate of meaning in N-dimensional vector space"
- Mở đầu: "An embedding is a dense vector that encodes semantic meaning so similar concepts cluster nearby in vector space — it's how we give machines a sense of meaning beyond keyword matching."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [LLM & Transformers](./02-llm-and-transformers.md) — embeddings are outputs of transformer encoder layers
- ➡️ Để hiểu tiếp: [Similarity Metrics](#2-similarity-metrics--độ-tương-đồng-vector) — how to measure closeness between embedding vectors

### 🟢 Q: What is an embedding? `[Junior]`

**A:** Embedding là vector dense biểu diễn ý nghĩa ngữ nghĩa của text/image/code trong không gian nhiều chiều.

- Các nội dung giống nghĩa sẽ có vector gần nhau.
- Dùng cho semantic search, recommendation, clustering, dedup.
- Developer coi embedding như “index key ngữ nghĩa” thay vì keyword thô.

### 🟡 Q: Which embedding models are common in 2025? `[Mid]`

**A:** Thị trường gồm API managed và open-source tự host.

- OpenAI `text-embedding-3` family: phổ biến, chất lượng ổn định.
- Voyage models: mạnh ở retrieval và reranking use cases.
- Google Gecko line: tích hợp hệ Gemini ecosystem.
- Open-source (e5/bge/nomic) phù hợp yêu cầu kiểm soát dữ liệu và chi phí.

---

## 2. Similarity Metrics / Độ tương đồng vector

> 🧠 **Memory Hook:** Cosine similarity như hai người bạn chỉ tay về cùng một hướng — không quan tâm ai có cánh tay dài hay ngắn, chỉ quan tâm hướng chỉ có giống nhau không.

**Tại sao tồn tại? / Why does this exist?**

Sau khi có embedding vectors, cần cách đo "gần nhau" là bao nhiêu để rank kết quả search. Nhưng vectors có độ dài khác nhau (magnitude) phụ thuộc vào chiều dài text — cần metric chuẩn hóa điều đó. Cosine, dot product, L2 mỗi cái có giả định khác nhau.
→ **Why?** Tài liệu dài tự nhiên có vector magnitude lớn hơn, không phải vì "có nghĩa hơn".
→ **Why?** Ta muốn measure semantic direction (orientation), không phải size — cosine giải quyết chính xác điều đó.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hai người đứng chỉ tay về cùng một hướng — một người cánh tay dài 1m, người kia 2m. Hướng chỉ là giống nhau (cosine = 1.0). Ngược lại, hai người chỉ vuông góc nhau hoàn toàn (cosine = 0). Cosine similarity đo góc giữa hai vector, bỏ qua hoàn toàn độ dài — đúng với semantic comparison.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Cosine Similarity:
  cos(θ) = (A · B) / (|A| × |B|)    Range: -1 (opposite) → +1 (identical)

  A = [1, 2, 3]   B = [2, 4, 6]   ← same direction, 2× scale
  cos(A, B) = 1.0  ✅ perfect match despite different magnitude

  A = [1, 0, 0]   C = [0, 1, 0]   ← perpendicular
  cos(A, C) = 0.0  no semantic overlap

Dot Product:    A · B = Σ(aᵢ × bᵢ)
  → Faster; equals cosine when vectors are unit-normalized
  → Sensitive to magnitude otherwise

L2 Distance:    √Σ(aᵢ - bᵢ)²
  → Euclidean distance; intuitive but scale-sensitive

Decision table:
  Text embeddings (raw)  → Cosine   (normalize magnitude)
  Unit-normalized vectors → Dot product (same result, 2× faster)
  Image pixel features   → L2       (magnitude may carry info)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Cosine fails with zero vectors (0/0 = undefined) — guard against all-zero embeddings
- If model outputs unit-normalized vectors (L2 norm = 1), dot product = cosine — use dot for speed
- Different vector DBs default to different metrics — verify config matches your choice
- Negative cosine values (−1 to 0) rare in practice for text but possible — don't assume scores are always positive

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                       | Tại sao sai                                                   | Đúng là                                                  |
| --------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------- |
| Dùng L2 distance cho text embeddings          | Text cần normalize magnitude; L2 nhạy với kích thước vector   | Dùng cosine similarity cho text embeddings               |
| Mix metric giữa lúc index và lúc query        | Ranking sai hoàn toàn — documents được retrieve sẽ không đúng | Chọn một metric, cấu hình nhất quán từ đầu đến cuối      |
| Assume score 0.8 là "good" mà không calibrate | Threshold tối ưu phụ thuộc vào model và domain                | Calibrate minScore threshold trên validation set thực tế |

**🎯 Interview Pattern:**

- Khi thấy: vector search, nearest neighbor, similarity ranking
- Nhớ đến: "cosine measures angle = semantic direction, ignores magnitude"
- Mở đầu: "For text embeddings I use cosine similarity because we care about semantic direction, not vector magnitude — document length shouldn't inflate similarity scores."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Embeddings Basics](#1-embeddings-basics--nền-tảng-embedding) — cần hiểu vector là gì trước
- ➡️ Để hiểu tiếp: [ANN Index Algorithms](#3-ann-index-algorithms--thuật-toán-tìm-gần-đúng) — how to find similar vectors at scale efficiently

### 🟢 Q: Cosine similarity, dot product, and L2 distance differ how? `[Junior]`

**A:** Ba metric đều đo “gần nhau” nhưng giả định khác nhau.

- **Cosine:** đo góc, bỏ qua độ lớn vector, phổ biến nhất cho text embedding.
- **Dot product:** nhanh, có tính cả magnitude, hợp khi vector đã chuẩn hóa chiến lược riêng.
- **L2 distance:** khoảng cách Euclidean, trực quan nhưng nhạy scale.
- Cần đồng nhất metric giữa indexing và truy vấn để tránh mismatch.

---

## 3. ANN Index Algorithms / Thuật toán tìm gần đúng

> 🧠 **Memory Hook:** HNSW như mạng lưới bạn bè nhiều tầng — tìm người quen nhanh hơn bằng cách hỏi người quen "cấp cao" trước, rồi zoom dần xuống khu vực cụ thể.

**Tại sao tồn tại? / Why does this exist?**

Với 1 triệu vectors, brute-force cosine similarity phải so sánh cả 1 triệu lần mỗi query — O(n) → quá chậm cho production. ANN (Approximate Nearest Neighbor) đánh đổi một chút recall để đạt tốc độ sublinear.
→ **Why?** Production yêu cầu <100ms p95 latency; linear scan không thể scale.
→ **Why?** Người dùng không cần kết quả perfect — cần kết quả đủ tốt trong milliseconds.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tìm nhà hàng gần nhất trong thành phố triệu dân: thay vì gõ cửa từng nhà (brute force), bạn hỏi người quen "quận nào có nhiều nhà hàng?", rồi hỏi người trong quận đó "phường nào?", rồi đi cụ thể đường phố. HNSW làm đúng như vậy: nhảy từ cấp thô (ít node) xuống cấp mịn (nhiều node) theo hướng gần nhất.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
HNSW (Hierarchical Navigable Small World):

  Level 2 (sparse):   A ────────── E
  Level 1:            A──B────C──D──E
  Level 0 (dense):    A-B-C-D-E-F-G-H-I-J...

  Query Q: find nearest
  1. Start at Level 2, greedy navigate to closest node
  2. Drop to Level 1, continue greedy search from there
  3. Drop to Level 0, find final top-k

Algorithm comparison:
  ┌─────────┬────────────┬─────────────┬────────┬────────┐
  │ Algo    │ Build time │ Search time │ Memory │ Recall │
  ├─────────┼────────────┼─────────────┼────────┼────────┤
  │ HNSW    │ Slow       │ Very fast   │ High   │ 95%+   │
  │ FAISS   │ Medium     │ Fast        │ Medium │ 85-95% │
  │ LSH     │ Fast       │ Medium      │ Low    │ 70-90% │
  │ ANNOY   │ Fast       │ Medium      │ Low    │ 80-90% │
  └─────────┴────────────┴─────────────┴────────┴────────┘
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- HNSW: thêm vector nhanh nhưng xóa vector yêu cầu rebuild toàn bộ index
- FAISS GPU: speedup cực lớn cho batch embedding, ít lợi ích cho single-query latency
- LSH: quality phụ thuộc mạnh vào data distribution — đôi khi kém hơn mong đợi
- Tất cả ANN algorithms đều có recall < 100% — chấp nhận được vì RAG không cần exact NN

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                          | Tại sao sai                                              | Đúng là                                                        |
| ------------------------------------------------ | -------------------------------------------------------- | -------------------------------------------------------------- |
| Chọn HNSW vì "nổi tiếng nhất" mà không benchmark | Recall và latency phụ thuộc vào data distribution cụ thể | Benchmark trên production data thật với recall@k + p95 latency |
| Assume HNSW luôn tốt nhất                        | HNSW tốn nhiều RAM; không phù hợp memory-constrained env | Cân nhắc FAISS IVF nếu RAM là bottleneck                       |
| Quên rằng ANN ≠ exact NN                         | Có thể miss top result → ảnh hưởng RAG faithfulness      | Tăng ef_search/nprobe parameter để tăng recall khi cần         |

**🎯 Interview Pattern:**

- Khi thấy: scaling semantic search, vector DB performance, millions of documents
- Nhớ đến: "ANN = approximate nearest neighbor — trade small recall loss for orders-of-magnitude speed"
- Mở đầu: "For production scale I'd use HNSW-based ANN — it gives ~95% recall at millisecond latency vs linear scan, which is an acceptable trade-off for RAG use cases."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Similarity Metrics](#2-similarity-metrics--độ-tương-đồng-vector) — ANN là cách tìm cosine/dot-product similarity hiệu quả
- ➡️ Để hiểu tiếp: [Vector Databases](#4-vector-databases--cơ-sở-dữ-liệu-vector) — databases that wrap these ANN algorithms with full CRUD + filtering

### 🟡 Q: Compare HNSW, FAISS, LSH, and ANNOY. `[Mid]`

**A:** Mỗi ANN algorithm có trade-off giữa latency, recall, memory, và build time.

- **HNSW:** recall cao, latency thấp, memory tương đối cao.
- **FAISS:** thư viện đa thuật toán, mạnh ở scale lớn/GPU.
- **LSH:** hashing gần đúng, phù hợp một số phân phối dữ liệu cụ thể.
- **ANNOY:** đơn giản, tốt cho read-heavy và static index.
- Trong interview nên nhấn mạnh benchmark theo dữ liệu thật của hệ thống.

---

## 4. Vector Databases / Cơ sở dữ liệu vector

> 🧠 **Memory Hook:** Chọn vector DB như chọn chỗ ở: Pinecone là căn hộ dịch vụ 5 sao (đắt, tiện, không cần lo), pgvector là phòng trong nhà mình đang ở (tiện gần cơ quan Postgres, setup tí là xong).

**Tại sao tồn tại? / Why does this exist?**

FAISS thuần túy là công cụ tìm đường — không có persistence, không có filtering theo metadata, không có API. Production cần full database: CRUD, ANN search, và filter "chỉ tìm trong tenant X" đồng thời.
→ **Why?** Vector search + metadata filter (ngày tháng, user_id, category) là yêu cầu cốt lõi của mọi production RAG.
→ **Why?** Pure FAISS không thể làm hybrid query (vector + SQL-like conditions) — cần database layer thực sự.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

FAISS giống la bàn: giỏi tìm hướng, không lưu được thông tin về địa điểm. Vector database giống Google Maps: vừa tìm đường (ANN search), vừa lưu thông tin địa điểm (metadata), vừa filter (chỉ mở lúc 8h sáng, chỉ nhà hàng Việt). Không ai dùng la bàn để quản lý cả thành phố.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Write path:
  Document → embed → { vector, metadata } → stored + ANN-indexed

Read path (query):
  Question → embed → ANN search (top-100)
           → filter metadata (tenant_id = X, date > 2024)
           → return top-k chunks

Feature comparison:
  ┌─────────────┬──────────┬────────────┬───────────────┬──────────┐
  │ Database    │ Managed  │ Hybrid     │ Transactional │ Scale    │
  ├─────────────┼──────────┼────────────┼───────────────┼──────────┤
  │ Pinecone    │ ✅ Full  │ ✅ Good    │ ❌            │ ✅ High  │
  │ Weaviate    │ ✅/Self  │ ✅ Best    │ ❌            │ ✅ High  │
  │ Qdrant      │ ✅/Self  │ ✅ Good    │ ❌            │ ✅ High  │
  │ Chroma      │ ❌ Local │ ❌         │ ❌            │ ❌ Small │
  │ pgvector    │ Via PG   │ ✅ Good    │ ✅ Full ACID  │ Medium   │
  └─────────────┴──────────┴────────────┴───────────────┴──────────┘
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- pgvector HNSW (v0.5+): đủ tốt cho hầu hết use cases nếu đã dùng Postgres — tránh thêm infra
- Pinecone: vendor lock-in rủi ro; không có on-prem option; tốt cho teams không muốn ops
- Chroma: tuyệt vời cho local dev/prototype, không phù hợp production HA
- Weaviate: GraphQL API phong phú nhất; learning curve cao hơn; tốt cho complex schema

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                               | Tại sao sai                                       | Đúng là                                                     |
| ------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| Dùng Chroma cho production            | Không có HA, replication, production ops support  | Dùng Qdrant/Weaviate/Pinecone cho production workloads      |
| Không dùng metadata filtering         | ANN alone trả về kết quả cross-tenant, cross-date | Luôn filter metadata để đảm bảo data isolation và freshness |
| Thêm vector DB mới khi đã có Postgres | Tăng infra complexity không cần thiết             | pgvector + Postgres thường đủ cho hầu hết use cases         |

**🎯 Interview Pattern:**

- Khi thấy: system design cho RAG, semantic search, knowledge base
- Nhớ đến: "choose based on: managed vs self-host, hybrid search, existing Postgres stack"
- Mở đầu: "For vector storage I'd evaluate on three axes: do we need fully managed, do we need hybrid search, and are we already on Postgres — if yes to Postgres, pgvector is often the simplest win."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [ANN Index Algorithms](#3-ann-index-algorithms--thuật-toán-tìm-gần-đúng) — vector DBs implement these algorithms internally
- ➡️ Để hiểu tiếp: [RAG Pipeline](#5-rag-pipeline--pipeline-rag) — vector DBs are the retrieval backbone of RAG

### 🟡 Q: How do Pinecone, Weaviate, Qdrant, Chroma, and pgvector differ? `[Mid]`

**A:** Chọn vector DB dựa vào managed level, hybrid search, ops skill, và nhu cầu transactional.

- **Pinecone:** managed/serverless, dễ vận hành.
- **Weaviate:** open-source mạnh, hỗ trợ hybrid và schema features.
- **Qdrant:** hiệu năng cao, API sạch, phổ biến self-host/managed.
- **Chroma:** tiện dev/prototype local nhanh.
- **pgvector:** dùng ngay trong Postgres, thuận lợi join transactional data.

---

## 5. RAG Pipeline / Pipeline RAG

> 🧠 **Memory Hook:** RAG như học sinh được phép mang "phao thi" hợp lệ vào phòng — trước khi trả lời, tìm tờ phao liên quan nhất, đọc rồi viết câu trả lời dựa trên đó, không được bịa.

**Tại sao tồn tại? / Why does this exist?**

LLM có knowledge cutoff và không biết dữ liệu private của công ty. Fine-tuning tốn kém hàng triệu USD và không cập nhật được realtime. RAG giải quyết cả hai: inject context vào prompt mà không cần retrain.
→ **Why?** Giá sản phẩm, chính sách công ty thay đổi hàng ngày — model không thể keep up.
→ **Why?** Training cost cho 1B-token model = millions USD và weeks; RAG re-index = vài giây/phút với cost infra thông thường.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Trước kỳ thi, thầy giáo cho phép mang một tờ A4 ghi chú vào phòng. Khi gặp câu hỏi khó, bạn nhìn tờ giấy (context) rồi viết câu trả lời — không được bịa thêm gì không có trong tờ giấy đó. RAG làm y như vậy cho LLM: tìm tài liệu liên quan nhất, đưa vào prompt, LLM viết câu trả lời chỉ dựa trên đó.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
OFFLINE — Ingestion (chạy một lần hoặc khi có doc mới):
  Documents → Parse → Clean
           → Chunk (512 tokens, 20% overlap)
           → Embed each chunk
           → Store {vector, metadata} in Vector DB

ONLINE — Query (mỗi user request):
  User Question
       ↓
  Embed Question → ANN Search → Top-K chunks
       ↓
  Build Prompt:
  ┌──────────────────────────────────────────────┐
  │ Context:                                     │
  │ [1] Chính sách hoàn tiền trong 7 ngày...    │
  │ [2] Sản phẩm lỗi được đổi trong 30 ngày... │
  │                                              │
  │ Q: Tôi có thể hoàn tiền không?              │
  │ Answer ONLY from context. Cite [N].          │
  └──────────────────────────────────────────────┘
       ↓
  LLM → Answer + Citations [1][2]

Chunking strategies:
  Fixed    → ████████|████████|████████  (may cut sentence midway)
  Sentence → [sentence.][sentence.]       (natural boundaries)
  Recursive→ Paragraph → Sentence → Word  (best quality)
  Overlap  → add 10-20% overlap to prevent context loss at boundaries
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Chunk quá nhỏ (<128 tokens): thiếu context, nhiều chunks cần để answer
- Chunk quá lớn (>1024 tokens): noise loãng signal, LLM dễ bị distract
- Không có overlap: context quan trọng có thể bị cắt đúng biên giới chunk
- Hallucination vẫn xảy ra nếu LLM "sáng tạo" ngoài context — phải enforce trong prompt

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                                        | Đúng là                                                       |
| -------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------- |
| Dùng fixed chunk 2000 tokens không benchmark | Quá lớn = noise; quá nhỏ = missing context; optimal phụ thuộc data | Test 256/512/1024 trên eval set, chọn theo NDCG@10            |
| Không có citation enforcement trong prompt   | LLM có thể hallucinate ngoài context được cung cấp                 | Thêm "Answer ONLY from context. If unsure, say I don't know." |
| Re-embed toàn bộ index mỗi đêm               | Tốn kém, chậm — 90% docs không thay đổi                            | Incremental indexing: chỉ embed documents đã thay đổi         |

**🎯 Interview Pattern:**

- Khi thấy: chatbot dùng private data, internal knowledge base Q&A, support bot
- Nhớ đến: "5 stages: ingest → chunk → embed → retrieve → augment+generate"
- Mở đầu: "RAG solves LLM's knowledge cutoff and hallucination by grounding answers in retrieved context — the pipeline is: chunk documents offline, embed them into a vector store, then at query time retrieve top-k by cosine similarity and inject into the prompt."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Vector Databases](#4-vector-databases--cơ-sở-dữ-liệu-vector) — RAG dùng vector DB để lưu và retrieve chunks
- ➡️ Để hiểu tiếp: [Advanced RAG](#6-advanced-rag--rag-nâng-cao) — khi basic RAG chưa đủ tốt

### 🟢 Q: Why do we use RAG? `[Junior]`

**A:** RAG giúp LLM trả lời dựa trên dữ liệu ngoài model weights.

- Giảm vấn đề knowledge cutoff.
- Dùng dữ liệu private nội bộ không cần full fine-tuning.
- Có thể giảm hallucination khi ép model “cite context”.
- Dễ cập nhật tri thức mới chỉ bằng re-index.

### 🟡 Q: What are the core RAG stages? `[Mid]`

**A:** Pipeline chuẩn: ingestion → indexing → retrieval → augmentation → generation.

- Ingestion: parse, clean, chunk, metadata enrichment.
- Indexing: embed chunks và lưu vào vector store.
- Retrieval: truy xuất top-k theo query embedding/hybrid.
- Augmentation: xây prompt có context + citation rule.
- Generation: model trả lời + trích nguồn.

### 🟡 Q: How do chunking strategies impact quality? `[Mid]`

**A:** Chunking là đòn bẩy lớn nhất của RAG quality.

- **Fixed-size:** đơn giản, nhanh, nhưng có thể cắt gãy ngữ cảnh.
- **Recursive:** ưu tiên cắt theo đoạn/tiêu đề trước khi fallback ký tự.
- **Semantic chunking:** dựa embedding boundary, chất lượng cao hơn nhưng tốn compute.
- Thường cần overlap để giữ continuity.

---

## 6. Advanced RAG / RAG nâng cao

> 🧠 **Memory Hook:** Advanced RAG như thủ thư giỏi nghề: không chỉ tìm đúng từ khóa mà còn hỏi lại câu hỏi, tìm theo nhiều cách, và xếp loại kết quả kỹ hơn trước khi đưa cho bạn.

**Tại sao tồn tại? / Why does this exist?**

Basic RAG thất bại khi câu hỏi user mơ hồ, dùng từ khác với từ trong tài liệu (vocabulary gap), hoặc cần context từ nhiều tài liệu liên kết nhau. Một lần retrieve không đủ.
→ **Why?** User nghĩ theo khái niệm cao cấp ("hoàn tiền"), tài liệu viết theo thuật ngữ cụ thể ("refund policy section 3.2") — embedding không luôn bridge được gap này.
→ **Why?** Production RAG cần recall cao hơn basic → hybrid search + reranking là standard practice tại các công ty tech lớn.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Khi bạn hỏi thư viện viên "sách về nấu ăn nhanh cho người bận", người giỏi sẽ không chỉ tìm đúng từ "nấu ăn nhanh" — họ cũng tìm "quick meal prep", "30-minute recipes", hỏi thêm "bận bao nhiêu, gia đình mấy người?" rồi xếp loại kết quả kỹ hơn. Advanced RAG: rewrite query → search nhiều cách → rerank kết quả.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Hybrid Search:
  Query ──► Dense (embedding) ──► top-50 candidates ──┐
        └─► Sparse (BM25)     ──► top-50 candidates ──┤
                                                       ▼
                               Reciprocal Rank Fusion (RRF) → merged top-50
                                                       ▼
                               Cross-encoder Reranker → final top-5

HyDE (Hypothetical Document Embedding):
  "What causes memory leaks in Node.js?"
        ↓ LLM generates hypothetical answer
  "Memory leaks in Node.js occur when event listeners..."
        ↓ embed hypothetical answer
  → Search: hypothetical doc embedding ≈ real doc embedding!

Parent-Child Retrieval:
  Index small child chunks (precise matching)
  Retrieve → return parent chunk (full context)
  [small][small][small]  ← indexed, searched
  [=====PARENT SECTION=====]  ← returned to LLM

Agentic RAG:
  Question → Draft → Detect uncertainty → Retrieve more → Repeat
  (loop until confident or max iterations reached)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- HyDE: LLM có thể generate hypothetical doc sai hướng cho edge-case topics → giảm chất lượng
- Reranking: cross-encoder chậm hơn bi-encoder 10–100× → thêm 100–500ms latency
- Agentic RAG loop: không có max_iterations guard → cost/latency unbounded
- Multi-query: union of results tăng recall nhưng cũng tăng noise trong context

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                               | Tại sao sai                                                  | Đúng là                                                             |
| ------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------- |
| Chỉ dùng dense retrieval, bỏ qua BM25 | Miss exact keyword matches (mã sản phẩm, tên riêng, số hiệu) | Hybrid search: dense + sparse + RRF fusion                          |
| Thêm reranker mà không đo latency     | Cross-encoder chậm hơn 10–100×, có thể break SLO             | Benchmark p95 latency với và không có reranker trước khi ship       |
| Dùng Agentic RAG cho mọi query        | Over-engineering; basic RAG đủ cho phần lớn questions        | Dùng Agentic RAG chỉ cho complex multi-hop questions cần nhiều bước |

**🎯 Interview Pattern:**

- Khi thấy: "RAG quality not good enough", complex Q&A, multi-document reasoning
- Nhớ đến: "hybrid search → RRF → reranking → query rewriting → HyDE → parent-child"
- Mở đầu: "When basic RAG underperforms, my first move is hybrid search combining dense embeddings with BM25 sparse retrieval, then add a cross-encoder reranker on the top-50 candidates — that typically recovers most recall issues."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [RAG Pipeline](#5-rag-pipeline--pipeline-rag) — phải hiểu basic RAG trước khi optimize
- ➡️ Để hiểu tiếp: [RAG Evaluation](#7-rag-evaluation--đánh-giá-rag) — measure whether improvements actually help

### 🔴 Q: What is hybrid search and reranking? `[Senior]`

**A:** Hybrid search kết hợp dense retrieval với sparse BM25 để cân bằng semantic + exact keyword.

- Bước 1: lấy candidate từ cả hai nguồn.
- Bước 2: fusion/rank merge.
- Bước 3: cross-encoder reranker chấm điểm sâu để chọn context cuối.
- Mẫu này thường cải thiện recall lẫn precision cho enterprise docs.

### 🔴 Q: Explain query rewriting, HyDE, and parent-child retrieval. `[Senior]`

**A:** Đây là kỹ thuật tăng khả năng retrieve đúng tài liệu khi câu hỏi user mơ hồ.

- **Query rewriting:** chuẩn hóa hoặc mở rộng query trước khi search.
- **HyDE:** tạo “hypothetical answer doc”, embed nó để tìm tài liệu gần nghĩa.
- **Parent-child retrieval:** index chunk nhỏ nhưng trả về parent lớn hơn để đủ context.
- Cần guard để tránh query drift và injection qua rewrite step.

### 🔴 Q: What is Agentic RAG? `[Senior]`

**A:** Agentic RAG cho phép agent chủ động quyết định khi nào cần retrieve thêm và retrieve từ nguồn nào.

- Không chỉ một lần retrieve cố định.
- Có thể loop: answer draft → detect uncertainty → retrieve bổ sung.
- Mạnh hơn cho task phức tạp nhưng cost/latency cao hơn pipeline RAG tĩnh.

---

## 7. RAG Evaluation / Đánh giá RAG

> 🧠 **Memory Hook:** Chấm RAG như chấm bài thí nghiệm khoa học: em có lấy đúng dụng cụ không (context relevance), em có trả lời đúng câu hỏi không (answer relevance), và câu trả lời có dựa trên thí nghiệm hay bịa (faithfulness)?

**Tại sao tồn tại? / Why does this exist?**

Không đo được → không cải thiện được. Kỹ sư thường "cảm nhận" RAG tốt hơn sau khi tweak nhưng không biết thực sự bao nhiêu phần trăm queries thất bại, và thất bại ở bước nào.
→ **Why?** RAG có nhiều bước có thể fail: chunking sai, retrieval miss, generation hallucinate — cần biết bottleneck ở đâu.
→ **Why?** Fix retrieval vs fix prompt engineering là hai công việc hoàn toàn khác nhau — phải đo trước mới chọn đúng action.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Chấm học sinh làm thí nghiệm: (1) em có lấy đúng dụng cụ không? (context relevance — đúng tài liệu), (2) em có trả lời đúng câu hỏi của thầy không? (answer relevance — đúng topic), (3) câu trả lời có dựa trên thí nghiệm hay em tự bịa thêm? (faithfulness — không hallucinate). Ba tiêu chí đó là 3 metric cốt lõi của RAG evaluation.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
RAGAS Framework — 3 Core Metrics:

  Metric 1: Context Relevance
  Question + Retrieved Chunks → LLM judge
  "Là các chunk này có liên quan câu hỏi không?"  → score 0–1

  Metric 2: Answer Relevance
  Question + Generated Answer → LLM judge
  "Câu trả lời có đúng trọng tâm câu hỏi không?"  → score 0–1

  Metric 3: Faithfulness
  Generated Answer → Extract claims → Check each vs Context
  "Mỗi claim có được context support không?"       → score 0–1

Evaluation pipeline:
  Golden Q&A dataset (100–500 pairs)
       ↓
  Run RAG system → get answers + retrieved chunks
       ↓
  RAGAS / TruLens / DeepEval → score matrix
       ↓
  Dashboard: identify which stage is the bottleneck

RAG vs Fine-tune decision:
  ┌────────────────────────────┬─────────────────────────┐
  │ Scenario                   │ Recommended approach    │
  ├────────────────────────────┼─────────────────────────┤
  │ Knowledge changes daily    │ RAG                     │
  │ Private company docs       │ RAG                     │
  │ Specific output style/fmt  │ Fine-tune               │
  │ Short context, data ready  │ Long-context prompt     │
  │ Production hybrid          │ RAG + light fine-tune   │
  └────────────────────────────┴─────────────────────────┘
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- LLM-as-judge có thể bias toward verbose hoặc confident-sounding answers
- Faithfulness = 1.0 không có nghĩa answer đúng — chỉ nghĩa là không hallucinate ngoài context
- Context relevance cao nhưng answer quality thấp: retrieved đúng docs nhưng generation fail
- Business KPIs (ticket deflection, user satisfaction) thường lag 1–2 tuần sau technical metrics

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                         | Đúng là                                                      |
| -------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| Chỉ check "answer trông ổn" thủ công         | Không scale, không reproducible, bỏ sót edge cases  | Dùng RAGAS/DeepEval + golden test set automated evaluation   |
| Dùng fine-tuning để "add new knowledge"      | Chậm, tốn kém triệu USD, không cập nhật realtime    | Fine-tuning cho style/behavior; RAG cho knowledge            |
| Đo retrieval recall@k mà bỏ qua faithfulness | High recall nhưng LLM vẫn hallucinate ngoài context | Đo cả 3: context relevance + answer relevance + faithfulness |

**🎯 Interview Pattern:**

- Khi thấy: "how do you know your RAG is working?", "how to improve RAG quality?"
- Nhớ đến: "RAGAS triangle: context relevance + answer relevance + faithfulness"
- Mở đầu: "I evaluate RAG with three metrics from RAGAS: context relevance — did we retrieve the right docs, answer relevance — did we answer the right question, and faithfulness — did we hallucinate beyond the retrieved context."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Advanced RAG](#6-advanced-rag--rag-nâng-cao) — cần biết những gì cần evaluate
- ➡️ Để hiểu tiếp: [AI System Design](./06-ai-system-design.md) — evaluation feeds into architectural decisions

### 🟡 Q: How do we evaluate a RAG system? `[Mid]`

**A:** Đánh giá RAG cần tách retrieval quality và generation quality.

- **Context relevance:** tài liệu lấy về có liên quan câu hỏi không.
- **Answer relevance:** câu trả lời có đúng trọng tâm user ask không.
- **Faithfulness:** câu trả lời có bám nguồn hay bịa thêm.
- Có thể dùng RAGAS + human spot-check + business KPI.

### 🔴 Q: RAG vs fine-tuning vs long-context: how to choose? `[Senior]`

**A:** Dùng khung quyết định theo loại tri thức và tần suất thay đổi.

- Tri thức thay đổi nhanh/private docs: ưu tiên RAG.
- Hành vi chuyên biệt lặp lại (format/style/task): cân nhắc fine-tuning.
- Bối cảnh ngắn hạn lớn, dữ liệu đã sẵn trong prompt: long-context có thể đủ.
- Nhiều hệ thống production dùng hybrid: prompt engineering + RAG + nhẹ fine-tune.

---

## 8. TypeScript Integration Example / Ví dụ TypeScript cho RAG

> 🧠 **Memory Hook:** TypeScript RAG như hợp đồng công ty có chữ ký rõ ràng — type `Chunk` là invoice: ai giao hàng phải kèm đầy đủ id, nội dung, score, và nguồn gốc, không nhận hàng không có chứng từ.

**Tại sao tồn tại? / Why does this exist?**

Engineers cần implement RAG trong TypeScript/Node.js stack thực tế với pattern rõ ràng, type-safe, và dễ debug. RAG có nhiều điểm failure: embedding API timeout, vector DB lỗi, LLM hallucinate — cần contract rõ giữa retriever và generator.
→ **Why?** Production code cần observability: phải biết chunk nào được dùng, score bao nhiêu, source là gì để debug khi answer sai.
→ **Why?** Nếu không có type contract, retriever và generator có thể drift — silent bugs trong production không phát hiện được.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Khi đặt đồ ăn online, app hiển thị: tên món, tên nhà hàng, thời gian giao — không phải chỉ "đồ ăn đang đến". RAG code tốt cũng vậy: trả về câu trả lời + danh sách sources + scores từng chunk — không phải black box. `type Chunk` là cái contract đó.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```typescript
// Type contract — interface rõ ràng giữa retriever & generator
type Chunk = {
  id: string; // for deduplication & tracing
  text: string; // content injected into prompt
  score: number; // cosine similarity (0–1), minScore filter
  source: string; // citation: URL or filename
};

// Flow diagram:
// User question
//      ↓
// retrieve() → vector DB ANN search (topK=6, minScore=0.32)
//      ↓
// Build context string: "[1] chunk text\n[2] chunk text..."
//      ↓
// Prompt: "Use ONLY context below. If unsure say I don't know.\n{context}\nQ: {question}"
//      ↓
// callLLM(temperature=0) → grounded answer
//      ↓
// Append "Sources: policy.pdf, faq.md" for transparency

// Example call:
answerWithRAG("Chính sách hoàn tiền?");
// → "Bạn có thể hoàn tiền trong 7 ngày...\nSources: policy.pdf"
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- `minScore` threshold: quá cao → 0 results; quá thấp → irrelevant noise in context
- Token budget: `context.length + question.length` phải fit trong LLM context window
- Concurrent requests: cần connection pooling cho vector DB, không tạo new connection mỗi request
- Prompt injection: malicious document content có thể manipulate LLM behavior — phải sanitize

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                               | Tại sao sai                                                    | Đúng là                                                       |
| ----------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------- |
| Không sanitize chunk text trước khi concat vào prompt | Prompt injection qua nội dung document độc hại                 | Sanitize hoặc escape chunk text; thêm prompt isolation        |
| Không log chunks và scores mỗi request                | Khi answer sai không biết retrieval có đúng không để debug     | Log chunk IDs, scores, sources — lưu vào trace/observability  |
| `temperature > 0` cho RAG generation                  | High temperature → model "sáng tạo" ngoài context, hallucinate | `temperature: 0` để grounded, deterministic, factual response |

**🎯 Interview Pattern:**

- Khi thấy: "implement RAG in TypeScript", system design với Node.js backend
- Nhớ đến: "typed Chunk contract + minScore threshold + citation sources + temperature=0"
- Mở đầu: "I'd start by defining a typed Chunk interface to create a clear contract between retrieval and generation — then wire them with explicit citation sources so every answer is traceable and debuggable."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [RAG Pipeline](#5-rag-pipeline--pipeline-rag) — understand the conceptual pipeline before implementing
- ➡️ Để hiểu tiếp: [Agent Patterns](./03-agent-patterns.md) — agents extend RAG with dynamic retrieval decisions and tool use

### 🟡 Q: How to implement a minimal retrieval + generation flow in TypeScript? `[Mid]`

**A:** Ví dụ dưới đây cho thấy contract rõ giữa retriever và generator.

- Quan trọng: sanitize context, giới hạn token, và lưu trace để debug.

```ts
type Chunk = { id: string; text: string; score: number; source: string };

async function retrieve(query: string): Promise<Chunk[]> {
  // giả lập: gọi vector DB
  return searchVectorStore(query, { topK: 6, minScore: 0.32 });
}

export async function answerWithRAG(question: string): Promise<string> {
  const chunks = await retrieve(question);
  const context = chunks.map((c, i) => `[${i + 1}] ${c.text}`).join("\n");
  const prompt = `Use only context below. If unsure, say I don't know.\n${context}\nQ: ${question}`;
  const out = await callLLM({ model: "claude-3-5-sonnet", prompt, temperature: 0 });
  return `${out.text}\n\nSources: ${chunks.map((c) => c.source).join(", ")}`;
}
```

---

## 9. Interview Q&A Bank / Ngân hàng câu hỏi phỏng vấn

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #1? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #2? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #3? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #4? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #5? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #6? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #7? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #8? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #9? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #10? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #11? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #12? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #13? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #14? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #15? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #16? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #17? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #18? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #19? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #20? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #21? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #22? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #23? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #24? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #25? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #26? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #27? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #28? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #29? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #30? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #31? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #32? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #33? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #34? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #35? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #36? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #37? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #38? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #39? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #40? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #41? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #42? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #43? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #44? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #45? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #46? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #47? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #48? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #49? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #50? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #51? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #52? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #53? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #54? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #55? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #56? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #57? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #58? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #59? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #60? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #61? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #62? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #63? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #64? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #65? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #66? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #67? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #68? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #69? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #70? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #71? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #72? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #73? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in RAG and embeddings scenario #74? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in RAG and embeddings scenario #75? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in RAG and embeddings scenario #76? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

---

## Interview Q&A Summary / Tổng hợp câu hỏi phỏng vấn

### Q: How does RAG work end-to-end? / RAG hoạt động như thế nào từ đầu đến cuối? 🟡 Mid

**A:** RAG (Retrieval-Augmented Generation) = retrieve relevant context → augment prompt → generate.

```
RAG Pipeline:

INDEXING (offline):
Documents → [Chunking] → [Embedding Model] → Vectors → [Vector Store]
  "User manual"    512 tokens      text→float[]     FAISS/Pinecone

QUERYING (online):
User Query → [Embedding] → [Vector Search] → Top-K chunks
                 ↓
         [Prompt Assembly]
         "Context: {chunks}\nQuestion: {query}\nAnswer:"
                 ↓
              [LLM] → Response

Architecture:
                    ┌──────────────────┐
   Documents ──────►│  Vector Database  │
                    │  (FAISS/Pinecone/ │
   Query ──embed──► │   Weaviate/Chroma)│
                    └────────┬─────────┘
                             │ top-K chunks
                             ▼
   Query ───────────► [Prompt Template] ──► LLM ──► Answer
```

**Chunking strategies:**

```
Fixed-size: split every N tokens (simple, may cut sentences)
Sentence: split on sentence boundaries (better coherence)
Recursive: try paragraph → sentence → word (Langchain default)
Semantic: cluster semantically similar sentences (best quality, slower)

Chunk overlap: add 10-20% overlap between chunks
└── Prevents losing context at chunk boundaries
```

**Điểm then chốt:** RAG giải quyết 2 vấn đề của LLM: (1) knowledge cutoff — model không biết thông tin mới; (2) hallucination — grounding answer trong retrieved facts giảm hallucination đáng kể.

### Q: How do embeddings work and what makes a good embedding model? / Embeddings hoạt động như thế nào? 🟡 Mid

**A:**

```
Embedding = dense vector representation capturing semantic meaning

"king"   → [0.21, -0.13, 0.87, ..., 0.44]  (1536 dimensions)
"queen"  → [0.19, -0.11, 0.84, ..., 0.46]  (very similar!)
"banana" → [-0.78, 0.92, -0.31, ..., 0.12] (very different)

Similarity measure:
  Cosine similarity = (A·B) / (|A| × |B|)
  Range: -1 (opposite) to 1 (identical)
  Efficient: can precompute norms, just dot product at query time

How embeddings are trained:
  Contrastive learning:
  ├── Positive pairs (similar): "dog" + "puppy" → vectors should be close
  ├── Negative pairs (different): "dog" + "algebra" → vectors should be far
  └── Loss = maximize similarity of positives, minimize negatives
```

**Embedding model comparison:**

```
Model              Dims    Speed    Quality   Cost
OpenAI ada-002     1536    Fast     Good      API ($)
OpenAI text-3-small 1536  Fast     Better    API ($)
sentence-transformers 768 Fast     Good      Free (local)
BGE-M3             1024    Medium   SOTA      Free (local)
Cohere Embed v3    1024    Fast     Great     API ($)

Domain matters: general vs code vs legal vs medical embeddings
```

**Evaluation metrics:**

```
MTEB (Massive Text Embedding Benchmark):
├── Retrieval: NDCG@10 on MS MARCO, BEIR
├── STS: Spearman correlation
└── Classification, clustering, reranking tasks
```

**Điểm quan trọng:** Embedding model selection ảnh hưởng lớn đến RAG quality. Cần evaluate trên domain-specific data của mình. Multilingual RAG cần multilingual embedding models (BGE-M3 supports 100+ languages).

### Q: What are the main RAG failure modes and how do you improve RAG quality? / Cách cải thiện chất lượng RAG? 🔴 Senior

**A:**

```
RAG Failure Modes:

1. Retrieval failures
   ├── Wrong chunks retrieved (semantic mismatch)
   ├── Relevant chunk not retrieved (threshold too high)
   └── Fix: hybrid search (dense + sparse BM25), reranking

2. Context quality issues
   ├── Chunks too small → missing context
   ├── Chunks too large → noise dilutes signal
   └── Fix: parent-child chunking, sentence window retrieval

3. Generation failures
   ├── LLM ignores retrieved context → hallucination anyway
   ├── LLM contradicts context ("based on the docs... actually...")
   └── Fix: stronger system prompt, citation enforcement

4. Indexing issues
   ├── Stale documents → outdated answers
   ├── Duplicate content → wastes context window
   └── Fix: document versioning, deduplication pipeline

Advanced RAG techniques:
                     Basic RAG → Advanced RAG → Modular RAG

Hybrid search:
  dense (embedding) + sparse (BM25/TF-IDF) → reciprocal rank fusion
  └── Captures both semantic and keyword matches

Reranking:
  Query + top-50 chunks → Cross-encoder reranker → top-5 best chunks
  └── Cross-encoder: reads query+doc together → more accurate but slower

HyDE (Hypothetical Document Embedding):
  Query → LLM generates "hypothetical answer" → embed that → search
  └── Bridges vocabulary gap between query and indexed documents

Multi-query retrieval:
  "How to optimize DB?" → LLM generates 3 variations → retrieve for each → union
  └── Increases recall for queries that can be phrased multiple ways

Parent-child chunking:
  Small child chunks (indexed) → retrieve → return parent chunk (more context)
  └── Precision of small chunks + context of large chunks
```

**RAG evaluation:**

```
Metrics:
  Faithfulness: is the answer supported by the context? (no hallucination)
  Answer relevance: does the answer address the question?
  Context relevance: is the retrieved context relevant?

Tools: RAGAS, TruLens, DeepEval
```

**Điểm senior phải biết:** RAG không phải chỉ "embed + search". Production RAG cần hybrid search + reranking cho retrieval quality, evaluation pipeline để measure faithfulness, và document pipeline để keep index fresh. HyDE và multi-query là advanced tricks hay được hỏi.

---

## Self-Check / Tự Kiểm Tra

| #   | Loại           | Câu hỏi                                                                                                                          |
| --- | -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Tại sao cosine similarity được dùng cho embedding comparison thay vì Euclidean distance?                                         |
| 2   | 🎨 Visual      | Vẽ sơ đồ RAG pipeline đầy đủ (ingestion offline + query online) với tên từng bước.                                               |
| 3   | 🛠️ Application | Bạn có 1M product descriptions cần semantic search với <50ms p95 latency — chọn vector DB và ANN algorithm nào? Tại sao?         |
| 4   | 🐛 Debug       | RAG chatbot trả lời sai dù tài liệu có chứa thông tin đúng — bạn debug từ metric nào trước: context relevance hay faithfulness?  |
| 5   | 🎓 Teach       | Giải thích với người không biết kỹ thuật tại sao RAG giảm hallucination tốt hơn fine-tuning khi knowledge thay đổi thường xuyên. |

- 💬 **Feynman Prompt:** Giải thích tại sao RAG giải quyết hallucination better than "just fine-tuning" — dùng ví dụ product price to show khi nào mỗi approach fails.

## Connections / Liên Kết

- ⬅️ **Built on**: [LLM & Transformers](./02-llm-and-transformers.md) — embeddings come from transformer models
- ➡️ **Applied in**: [AI System Design](./06-ai-system-design.md) — semantic search architecture using RAG
- 🔗 **Related**: [Agent Patterns](./03-agent-patterns.md) — agents use RAG for knowledge retrieval
- 🔗 **Related**: [NoSQL & NewSQL](../03-database/03-nosql-and-newsql.md) — vector databases are a new DB type
