# AI System Design — Thiết kế hệ thống AI cho phỏng vấn

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**VinAI document search system:** Build internal search cho 500,000 legal documents. Naive approach: embed all documents + vector search → GPT-4 cost $0.10/query × 10,000 queries/day = $1,000/day. Optimization: (1) smaller embedding model (text-embedding-3-small, 5x cheaper), (2) semantic caching (same-meaning queries reuse result), (3) route simple queries to smaller model (GPT-3.5), GPT-4 only for complex ones. Result: cost giảm từ $1,000 → $85/day với same quality.

**Bài học:** AI system design không chỉ là "architecture" mà là cost optimization. Model routing, caching, và right-sizing là skills phân biệt AI engineer với "just call GPT-4 for everything".

## What & Why / Cái Gì & Tại Sao

**Analogy:** AI system design giống thiết kế nhà hàng: không phải mọi món đều cần head chef (GPT-4) — một số có thể do cook thông thường làm (smaller model), và những món đã làm rồi có thể serve từ tủ (semantic cache). Quan trọng: know which dish needs which chef.

**Why it matters:** "Design an AI-powered feature" là câu hỏi phổ biến ở Senior interviews tại AI-heavy companies (VinAI, Grab AI, Shopee AI). Không có framework → câu trả lời vague và không thực tế.

---

## 1. Pattern 1: Semantic Search Architecture / Kiến trúc tìm kiếm ngữ nghĩa

> 🧠 **Memory Hook:** Tìm kiếm ngữ nghĩa như hỏi bà hàng xóm thạo chợ "tìm nhà bán bánh mì ngon gần đây" — bà hiểu **ý**, không cần bạn đọc đúng địa chỉ từng chữ.

**Tại sao tồn tại? / Why does this exist?**

Keyword search thất bại khi người dùng dùng từ khác với văn bản gốc: tìm "cách chữa đau bụng" không ra tài liệu về "điều trị rối loạn tiêu hóa". Semantic search mã hóa ý nghĩa thành vector số và tìm theo khoảng cách vector thay vì đếm từ trùng.
→ **Why?** Ngôn ngữ tự nhiên có vô số cách nói cùng một ý — embedding model học ánh xạ này từ hàng tỷ câu văn.
→ **Why?** Cosine similarity đo "gần nghĩa" hiệu quả hơn đếm từ chung vì nó nắm bắt quan hệ ngữ nghĩa ẩn trong biểu diễn vector.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Thư viện cũ sắp xếp sách theo tiêu đề — bạn phải nhớ đúng tên mới tìm được. Thư viện mới có thủ thư thông minh: bạn chỉ cần nói "muốn đọc sách về cách nấu bún bò kiểu Huế", thủ thư hiểu ý và chỉ đúng kệ sách. Embedding model chính là người thủ thư đó, vector database là toàn bộ thư viện đã được lập chỉ mục theo nghĩa.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
[Offline — Indexing Pipeline]
Documents
  └─► [Chunker] (chunk_size + overlap)
        └─► [Embedding Model] → vector[1536]
              └─► [Vector DB] — HNSW index (Pinecone / Weaviate / pgvector)

[Online — Query Pipeline]
User Query
  └─► [Embed Query] → vector[1536]
        └─► [ANN Search] → top-k candidates (by cosine similarity)
              └─► [Reranker] (cross-encoder) → top-m final results
                    └─► Results returned to user / LLM prompt
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Chunk quá lớn**: nhiều chủ đề trong 1 chunk → embedding bị "pha loãng" → retrieval kém precision.
- **Chunk quá nhỏ**: mất ngữ cảnh liên tục → câu trả lời bị cắt ngang giữa ý.
- **Embedding model sai domain**: model tiếng Anh general không hiểu thuật ngữ y khoa/pháp luật tiếng Việt → retrieval miss.
- **Index stale**: tài liệu cập nhật nhưng vector DB chưa re-index → trả kết quả lỗi thời cho người dùng.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                          | Tại sao sai                                     | Đúng là                               |
| -------------------------------- | ----------------------------------------------- | ------------------------------------- |
| Dùng 1 chunk cho cả tài liệu dài | Embedding bị diluted, mất precision             | Chunk theo paragraph, overlap 10–20%  |
| Không đặt similarity threshold   | Trả về chunks không liên quan vào prompt        | Min score ≥ 0.75, lọc trước khi dùng  |
| Bỏ qua bước reranker             | Top-k ANN search chưa là final ranking tốt nhất | Dùng cross-encoder reranker cho top-k |

**🎯 Interview Pattern:**

- Khi thấy: "Design a search system for a document knowledge base"
- Nhớ đến: Chunk → Embed → Vector DB → ANN Search → Rerank pipeline
- Mở đầu: "I'd use semantic search over keyword search because users rarely phrase queries the same way documents are written — let me walk through the indexing and query pipeline."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [RAG & Embeddings](./04-rag-and-embeddings.md) — hiểu cơ chế embedding vector và similarity search
- ➡️ Để hiểu tiếp: [Pattern 2: RAG Chatbot](#2-pattern-2-rag-chatbot-architecture--kiến-trúc-chatbot-rag) — semantic search là retrieval layer trong RAG

### 🟡 Q: How does semantic search architecture work end-to-end? `[Mid]`

**A:** Luồng chuẩn: Documents → Chunk → Embed → Vector DB → Query Embed → Retrieve → Rerank → Results.

- Chọn chunk size theo cấu trúc tài liệu và intent truy vấn.
- Overlap giúp giữ ngữ cảnh liên tục nhưng làm tăng index size.
- Similarity threshold giúp giảm kết quả nhiễu.
- Rerank tăng precision ở top kết quả hiển thị.

### 🔴 Q: What key decisions should be justified in interview? `[Senior]`

**A:** Phải nêu rõ lý do kỹ thuật cho mỗi biến kiến trúc.

- Chunk size/overlap dựa trên phân bố độ dài câu hỏi.
- Embedding model dựa trên domain language và latency budget.
- ANN index chọn theo yêu cầu recall vs memory.
- Cơ chế refresh index và consistency model khi dữ liệu cập nhật.

---

## 2. Pattern 2: RAG Chatbot Architecture / Kiến trúc chatbot RAG

> 🧠 **Memory Hook:** RAG chatbot như học sinh giỏi: trước khi trả lời câu hỏi khó, em tra đúng trang sách giáo khoa rồi mới viết — không đoán mò từ trí nhớ.

**Tại sao tồn tại? / Why does this exist?**

LLM thuần túy hallucinate vì chúng không có thông tin mới nhất và không biết context nội bộ của tổ chức bạn. RAG kết nối LLM với knowledge base thực để câu trả lời có căn cứ và có thể verify được.
→ **Why?** LLM chỉ biết những gì được train — không biết tài liệu nội bộ hay thông tin sau cutoff date.
→ **Why?** Grounding LLM trong retrieved context thực giảm hallucination và cho phép citation — người dùng có thể kiểm tra nguồn.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Học sinh giỏi không trả lời theo trí nhớ mơ hồ — em mở đúng trang sách, đọc đoạn liên quan, rồi viết câu trả lời dựa vào đó. Nếu sách không có câu trả lời, em nói thẳng "không tìm thấy" thay vì bịa. RAG làm đúng vậy: retrieve trước, generate sau, không đoán mò.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
User Query
  └─► [Query Rewrite] — expand/clarify intent, resolve coreference
        └─► [Semantic Retrieval] → top-k relevant chunks
              └─► [Prompt Builder]
                    ├── system prompt
                    ├── conversation history (last-k turns)
                    ├── retrieved context chunks
                    └── user query
                          └─► [LLM] → stream response token-by-token
                                └─► [Post-process] → store turn in Conversation History
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Context window overflow**: quá nhiều lịch sử + retrieved chunks → vượt token limit → cần truncation strategy.
- **Query rewrite diverge**: LLM rewrites query quá khác original intent → retrieve sai tài liệu hoàn toàn.
- **History drift**: tóm tắt lịch sử nhiều lần → mất chi tiết quan trọng (summary-of-summary problem).
- **Citation hallucination**: LLM trích dẫn source nhưng chunk không thực sự nói vậy → cần faithfulness check.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                          | Tại sao sai                                   | Đúng là                                    |
| -------------------------------- | --------------------------------------------- | ------------------------------------------ |
| Nhét toàn bộ tài liệu vào prompt | Token limit bị vượt, cost tăng, quality giảm  | Chỉ đưa top-k relevant chunks vào context  |
| Không có streaming               | UX tệ — người dùng chờ 10s+ không có feedback | Dùng SSE/WebSocket streaming ngay từ đầu   |
| Không có conversation memory     | Mỗi turn như người mới gặp, mất ngữ cảnh      | Last-k raw turns + summarize older history |

**🎯 Interview Pattern:**

- Khi thấy: "Build a chatbot that answers questions from our internal documentation"
- Nhớ đến: Query Rewrite → Retrieve → Prompt Build (token budget) → LLM Stream → History Store
- Mở đầu: "This calls for a RAG architecture — the key insight is that we retrieve before we generate, and we need to manage the context window carefully in multi-turn conversations."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [RAG & Embeddings](./04-rag-and-embeddings.md) — nền tảng retrieval augmentation và embedding
- ➡️ Để hiểu tiếp: [Pattern 3: Agent Pipeline](#3-pattern-3-agent-pipeline-architecture--pipeline-agent) — RAG chatbot có thể dùng agent cho complex multi-step queries

### 🟡 Q: What is the RAG chatbot request flow? `[Mid]`

**A:** Flow điển hình: query rewrite → retrieve → build prompt → LLM generate/stream → store history.

- Query rewriting giúp tăng recall tài liệu.
- Prompt builder phải quản lý token budget theo conversation state.
- Streaming cải thiện UX perceived latency.
- Lưu lịch sử cần policy retention và xóa dữ liệu nhạy cảm.

### 🔴 Q: How to manage context window in multi-turn chatbot? `[Senior]`

**A:** Dùng chiến lược memory phân tầng thay vì nhét toàn bộ lịch sử.

- Keep last-k turns raw cho ngữ cảnh gần.
- Summarize older turns thành memory note.
- Retrieve episodic memory theo intent hiện tại.
- Cần chống summary drift bằng periodic refresh từ raw logs.

---

## 3. Pattern 3: Agent Pipeline Architecture / Pipeline agent

> 🧠 **Memory Hook:** Agent pipeline như sản xuất phim: đạo diễn (orchestrator) chia cảnh, giao cho diễn viên chuyên nghề (workers) quay song song, biên tập viên (synthesis) ghép lại, nhà sản xuất (evaluation) duyệt trước khi chiếu rạp.

**Tại sao tồn tại? / Why does this exist?**

Một câu hỏi phức tạp như "Research 5 competitors, write a comparison table, and suggest pricing strategy" không thể giải bằng một LLM call duy nhất. Agent pipeline phân rã task thành sub-tasks độc lập, thực thi song song, rồi tổng hợp thành kết quả hoàn chỉnh.
→ **Why?** LLM có context window giới hạn và giảm chất lượng khi xử lý quá nhiều việc cùng lúc — chuyên môn hóa cho kết quả tốt hơn.
→ **Why?** Song song hóa với specialized workers giảm total latency và tăng độ sâu xử lý mỗi sub-task.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Đặt tiệc buffet cho 100 người không thể chỉ có 1 đầu bếp. Bếp trưởng (orchestrator) phân công: team gỏi, team nướng, team tráng miệng nấu song song. Cuối bữa, manager (synthesis) sắp đĩa hài hòa, health inspector (evaluation) kiểm tra chất lượng trước khi bày ra bàn.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
User Task (complex, multi-step)
  └─► [Planner] — task decomposition + cost/time estimate
        ├─► [Worker A] (search specialist)   ─┐
        ├─► [Worker B] (analysis specialist) ─┤ parallel execution
        └─► [Worker C] (writing specialist)  ─┘
              └─► [Synthesizer] — merge outputs, resolve conflicts
                    └─► [Evaluator] — quality gate
                          ├── PASS → return Final Output
                          └── FAIL → retry specific workers (with budget check)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Worker timeout**: một worker chậm làm toàn pipeline chờ → cần per-worker timeout + graceful fallback.
- **Synthesis conflict**: hai workers trả output mâu thuẫn → synthesizer phải chọn hoặc hòa giải, không im lặng.
- **Budget exhaustion**: agent lặp vô hạn hoặc dùng quá nhiều token → cần hard limit on iterations + cost.
- **Planning error**: planner phân rã sai → tất cả workers làm đúng nhưng kết quả sai hướng hoàn toàn.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                           | Tại sao sai                                  | Đúng là                                                       |
| --------------------------------- | -------------------------------------------- | ------------------------------------------------------------- |
| Không có retry policy             | Lỗi tạm thời làm fail toàn bộ task vĩnh viễn | Exponential backoff + jitter cho transient errors             |
| Retry vô hạn cho lỗi logic/policy | Vòng lặp vô hạn tốn token và chi phí         | Phân biệt transient vs permanent error, hard limit iterations |
| Không có quality gate (evaluator) | Kết quả tệ được trả thẳng cho user           | Evaluator check trước khi return, retry nếu fail              |

**🎯 Interview Pattern:**

- Khi thấy: "Design an AI system for complex, multi-step tasks like research, code generation, or report writing"
- Nhớ đến: Planning → Orchestration → Parallel Workers → Synthesis → Evaluation (với safety rails)
- Mở đầu: "Complex tasks like this need an agent pipeline — a single LLM call won't give us the depth or parallelism needed. Let me start with the planning and orchestration layer."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Agent Patterns](./03-agent-patterns.md) — nền tảng về ReAct, tool use, và multi-agent coordination
- ➡️ Để hiểu tiếp: [Pattern 4: Content Moderation](#4-pattern-4-content-moderation-pipeline--pipeline-kiểm-duyệt-nội-dung) — agent output cần moderation trước khi serve cho user

### 🟡 Q: Describe planning → orchestrator → workers → synthesis → evaluation pattern. `[Mid]`

**A:** Đây là mẫu phù hợp cho task phức tạp có nhiều subproblem độc lập.

- Planning: phân rã nhiệm vụ và ước lượng chi phí.
- Orchestrator: phân công worker theo chuyên môn.
- Workers: thực hiện song song, trả kết quả theo schema.
- Synthesis: hợp nhất output, xử lý mâu thuẫn.
- Evaluation: quality gate trước khi trả kết quả cuối.

### 🔴 Q: How to design retries, error handling, and budget limits? `[Senior]`

**A:** Agent pipeline cần safety rails như hệ distributed system.

- Retry với exponential backoff + jitter cho lỗi tạm thời.
- Không retry vô hạn cho lỗi logic/policy.
- Thiết lập budget token/time per request.
- Circuit breaker để ngắt khi upstream suy giảm.
- Ghi trace theo task-id để postmortem.

---

## 4. Pattern 4: Content Moderation Pipeline / Pipeline kiểm duyệt nội dung

> 🧠 **Memory Hook:** Lọc nước máy có 2 tầng: màng lọc thô loại cặn bẩn nhanh trong 1ms, màng vi lọc xử lý vi khuẩn tinh tế hơn — không ai lọc vi khuẩn trước khi loại cát sỏi.

**Tại sao tồn tại? / Why does this exist?**

Gửi mọi nội dung trực tiếp lên LLM để kiểm duyệt cực tốn kém và chậm. 90% vi phạm rõ ràng (keyword, regex) có thể bắt được trong dưới 1ms. LLM chỉ cần xử lý 10% trường hợp còn lại cần hiểu ngữ cảnh sâu.
→ **Why?** Cost của một LLM call gấp 1000x rule-based check — với 1M nội dung/ngày, tiết kiệm 90% là vài chục nghìn đô mỗi tháng.
→ **Why?** Latency cũng là vấn đề — user upload cần feedback dưới 200ms, LLM không thể đáp ứng cho mọi request đồng thời.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Sân bay có 3 tầng bảo vệ: máy scan hành lý (nhanh, tự động, bắt dao/súng rõ ràng), kiểm tra hộ chiếu (xác minh danh tính), và kiểm tra an ninh tay cho người đáng ngờ. Không phải mọi hành khách đều cần tầng 3 — chỉ những ai qua tầng 1-2 còn nghi vấn. Chi phí và thời gian tập trung đúng chỗ.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
User Content (text / image / video)
  │
  └─► [Stage 1: Rule Engine] — regex / keyword / heuristic  (< 1ms)
        ├── BLOCK (obvious violation) → reject immediately + log
        ├── PASS  (clearly safe)      → allow immediately
        └── AMBIGUOUS                 → escalate to Stage 2
              │
              └─► [Stage 2: LLM Classifier] — context-aware  (100–500ms)
                    ├── BLOCK → reject + reason
                    ├── PASS  → allow
                    └── HIGH-RISK / uncertain
                          │
                          └─► [Stage 3: Human Review Queue] — async human decision
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Adversarial evasion**: "h.a.t.e" hay leet-speak để bypass keyword filter → cần text normalization trước Stage 1.
- **Context-dependent violation**: câu bình thường nhưng kết hợp với lịch sử chat 10 turns trước trở thành vi phạm.
- **False positive rate quá cao**: ngưỡng quá thấp → block nội dung hợp lệ → mất user tin tưởng.
- **Threshold drift**: luật/chính sách thay đổi → ngưỡng cũ không còn phù hợp → cần regular recalibration.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                            | Tại sao sai                                | Đúng là                                                      |
| ---------------------------------- | ------------------------------------------ | ------------------------------------------------------------ |
| Chỉ dùng LLM cho tất cả            | Chi phí tăng 100x, latency không chấp nhận | Rule engine trước cho obvious cases, LLM sau                 |
| Không có human review queue        | High-risk cases bị xử lý hoàn toàn tự động | Escalate ambiguous/high-risk lên human review                |
| Ngưỡng không căn cứ business/legal | Block sai nhiều hoặc miss vi phạm thực sự  | Thiết lập threshold dựa trên precision-recall target rõ ràng |

**🎯 Interview Pattern:**

- Khi thấy: "Design a content moderation system for a social platform / UGC product"
- Nhớ đến: Two-stage pipeline — rules first (cheap/fast), LLM second (accurate), human third (edge cases)
- Mở đầu: "I'd design a cascaded pipeline: a fast rule-based stage to catch obvious violations at near-zero cost, then an LLM classifier only for ambiguous cases needing context — this keeps both cost and latency acceptable."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Pattern 2: RAG Chatbot](#2-pattern-2-rag-chatbot-architecture--kiến-trúc-chatbot-rag) — LLM classifier trong Stage 2 dùng prompt engineering tương tự RAG
- ➡️ Để hiểu tiếp: [Pattern 5: Recommendation](#5-pattern-5-recommendation-with-embeddings--gợi-ý-bằng-embedding) — moderation cần tích hợp để filter toxic items khỏi recommendations

### 🟡 Q: Why use two-stage moderation (rules first, LLM second)? `[Mid]`

**A:** Hai tầng giúp tối ưu chi phí và tốc độ.

- Stage 1 rule-based: regex/keyword/heuristic cực nhanh, chặn case rõ ràng.
- Stage 2 LLM classifier: xử lý ngữ cảnh mơ hồ cần hiểu sâu.
- Case high-risk đẩy vào human review queue.
- Thiết kế threshold theo precision-recall mục tiêu pháp lý/sản phẩm.

---

## 5. Pattern 5: Recommendation with Embeddings / Gợi ý bằng embedding

> 🧠 **Memory Hook:** Shopee gợi ý quần short vì bạn vừa mua áo phông — embedding "biết" hai item này là "hàng xóm" trong không gian vector vì hàng triệu người mua thường mua cả hai cùng lúc.

**Tại sao tồn tại? / Why does this exist?**

Rule-based recommendation ("nếu mua A thì gợi ý B") không scale và không bắt được semantic similarity. Collaborative filtering thuần gặp cold-start. Embedding-based recommendation giải quyết cả hai: encode ý nghĩa nội dung và behavior người dùng trong cùng vector space.
→ **Why?** Item embeddings học từ hàng triệu transaction — tự động phát hiện pattern mà human không thể viết rule thủ công được.
→ **Why?** User embedding và item embedding trong cùng space → tìm top-k items gần nhất với user vector = personalized recommendation at scale.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Bạn hỏi người bạn thân nghe nhạc gì hay. Họ biết gu nhạc của bạn sau nhiều năm nên gợi ý đúng điệu, không cần bạn giải thích từng bài. Recommendation system làm vậy: học "gu" của bạn từ lịch sử clicks/mua sắm, rồi tìm items "đúng gu" trong kho hàng triệu sản phẩm chỉ trong vài milliseconds.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
[Offline Training]
User Behavior (clicks, purchases, watch time)
  └─► [Two-Tower Model]
        ├── User Tower → user_embedding[256]
        └── Item Tower → item_embedding[256]
              └─► [Vector DB] — ANN index of all item embeddings

[Online Serving]
User Request
  └─► [User Embedding] (from model or real-time cache)
        └─► [ANN Search] → top-K candidate items  (fast, ~5ms)
              └─► [Reranker] (business rules + lightweight ML)
                    └─► [Diversity Injector] → avoid echo chamber
                          └─► Final Recommendations (top-N displayed)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Cold start (new user)**: không có history → không có embedding → dùng popularity/demographics fallback.
- **Cold start (new item)**: item mới chưa có interaction → dùng content embedding từ title/description.
- **Popularity bias**: embedding thiên về item phổ biến → ít exposure cho long-tail items có giá trị.
- **Echo chamber**: gợi ý mãi cùng category → giảm long-term satisfaction, user bored và churn.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                              | Tại sao sai                                              | Đúng là                                                                  |
| ------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------ |
| Không inject diversity vào reranking | User bị nhốt trong "filter bubble", long-term churn tăng | Thêm diversity score (intra-list diversity) vào reranker                 |
| Chỉ optimize CTR                     | CTR cao nhưng long-term retention và satisfaction giảm   | Track CTR + retention + long-term satisfaction metrics                   |
| Không xử lý cold start               | New users nhận recommendation tệ → churn ngay lần đầu    | Fallback strategy rõ ràng: popularity → demographics → content embedding |

**🎯 Interview Pattern:**

- Khi thấy: "Design a recommendation system for e-commerce / streaming / news platform"
- Nhớ đến: Two-tower embedding → ANN retrieval (candidates) → lightweight reranker → diversity injection
- Mở đầu: "I'd use a two-stage embedding-based approach: fast ANN retrieval for candidate generation, then a reranker to apply business rules and diversity — let me explain why pure collaborative filtering won't scale here."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [RAG & Embeddings](./04-rag-and-embeddings.md) — hiểu embedding space, similarity search, và ANN indexing
- ➡️ Để hiểu tiếp: [AI Production Challenges](./07-ai-production-challenges.md) — serving recommendations at scale cần production-grade infrastructure

### 🟡 Q: How does embedding-based recommendation work? `[Mid]`

**A:** Kết hợp content embedding và user behavior embedding để tìm item phù hợp.

- Candidate generation bằng ANN search.
- Reranking bằng model nhẹ + business rules.
- Inject diversity/novelty để tránh echo chamber.
- Theo dõi CTR, retention, long-term satisfaction.

---

## 6. Interview Storytelling Framework / Khung trình bày dự án AI

### 🟢 Q: How to present an AI project in interview clearly? `[Junior]`

**A:** Dùng khung: Problem → Architecture → Technical choices → Evaluation → Challenges → Outcome.

- Problem: pain point business + success metric.
- Architecture: data flow và components chính.
- Choices: vì sao chọn model/index/tool đó.
- Evaluation: offline + online metrics.
- Challenges: failure modes và cách xử lý.
- Outcome: tác động định lượng.

### 🔴 Q: What are red flags and green flags interviewers look for? `[Senior]`

**A:** Phỏng vấn senior thường đánh giá chiều sâu trade-off và ownership.

- **Red flags:** chỉ nói benchmark chung, không có metric production, né rủi ro bảo mật.
- **Red flags:** không phân biệt POC và production readiness.
- **Green flags:** nói được failure cases, rollback plan, cost controls, observability.
- **Green flags:** mô tả rõ quyết định kỹ thuật gắn với KPI business.

---

## 7. Quick Reference Card / Thẻ ghi nhớ 15 khái niệm

### 🟢 Q: Quick term 1: What does 'Embedding' mean in system design discussion? `[Junior]`

**A:** `Embedding` là khái niệm quan trọng cần định nghĩa ngắn gọn và gắn với kiến trúc cụ thể.

- Nêu định nghĩa 1 câu.
- Nêu 1 quyết định kỹ thuật chịu ảnh hưởng bởi khái niệm này.
- Nêu 1 metric để theo dõi hiệu quả.
- Cách trả lời này giúp bạn thể hiện tư duy thực chiến trong interview.

### 🟢 Q: Quick term 2: What does 'Vector DB' mean in system design discussion? `[Junior]`

**A:** `Vector DB` là khái niệm quan trọng cần định nghĩa ngắn gọn và gắn với kiến trúc cụ thể.

- Nêu định nghĩa 1 câu.
- Nêu 1 quyết định kỹ thuật chịu ảnh hưởng bởi khái niệm này.
- Nêu 1 metric để theo dõi hiệu quả.
- Cách trả lời này giúp bạn thể hiện tư duy thực chiến trong interview.

### 🟢 Q: Quick term 3: What does 'ANN' mean in system design discussion? `[Junior]`

**A:** `ANN` là khái niệm quan trọng cần định nghĩa ngắn gọn và gắn với kiến trúc cụ thể.

- Nêu định nghĩa 1 câu.
- Nêu 1 quyết định kỹ thuật chịu ảnh hưởng bởi khái niệm này.
- Nêu 1 metric để theo dõi hiệu quả.
- Cách trả lời này giúp bạn thể hiện tư duy thực chiến trong interview.

### 🟢 Q: Quick term 4: What does 'HNSW' mean in system design discussion? `[Junior]`

**A:** `HNSW` là khái niệm quan trọng cần định nghĩa ngắn gọn và gắn với kiến trúc cụ thể.

- Nêu định nghĩa 1 câu.
- Nêu 1 quyết định kỹ thuật chịu ảnh hưởng bởi khái niệm này.
- Nêu 1 metric để theo dõi hiệu quả.
- Cách trả lời này giúp bạn thể hiện tư duy thực chiến trong interview.

### 🟢 Q: Quick term 5: What does 'Reranker' mean in system design discussion? `[Junior]`

**A:** `Reranker` là khái niệm quan trọng cần định nghĩa ngắn gọn và gắn với kiến trúc cụ thể.

- Nêu định nghĩa 1 câu.
- Nêu 1 quyết định kỹ thuật chịu ảnh hưởng bởi khái niệm này.
- Nêu 1 metric để theo dõi hiệu quả.
- Cách trả lời này giúp bạn thể hiện tư duy thực chiến trong interview.

### 🟡 Q: Quick term 6: What does 'Query Rewrite' mean in system design discussion? `[Mid]`

**A:** `Query Rewrite` là khái niệm quan trọng cần định nghĩa ngắn gọn và gắn với kiến trúc cụ thể.

- Nêu định nghĩa 1 câu.
- Nêu 1 quyết định kỹ thuật chịu ảnh hưởng bởi khái niệm này.
- Nêu 1 metric để theo dõi hiệu quả.
- Cách trả lời này giúp bạn thể hiện tư duy thực chiến trong interview.

### 🟡 Q: Quick term 7: What does 'Hallucination' mean in system design discussion? `[Mid]`

**A:** `Hallucination` là khái niệm quan trọng cần định nghĩa ngắn gọn và gắn với kiến trúc cụ thể.

- Nêu định nghĩa 1 câu.
- Nêu 1 quyết định kỹ thuật chịu ảnh hưởng bởi khái niệm này.
- Nêu 1 metric để theo dõi hiệu quả.
- Cách trả lời này giúp bạn thể hiện tư duy thực chiến trong interview.

### 🟡 Q: Quick term 8: What does 'Faithfulness' mean in system design discussion? `[Mid]`

**A:** `Faithfulness` là khái niệm quan trọng cần định nghĩa ngắn gọn và gắn với kiến trúc cụ thể.

- Nêu định nghĩa 1 câu.
- Nêu 1 quyết định kỹ thuật chịu ảnh hưởng bởi khái niệm này.
- Nêu 1 metric để theo dõi hiệu quả.
- Cách trả lời này giúp bạn thể hiện tư duy thực chiến trong interview.

### 🟡 Q: Quick term 9: What does 'Prompt Injection' mean in system design discussion? `[Mid]`

**A:** `Prompt Injection` là khái niệm quan trọng cần định nghĩa ngắn gọn và gắn với kiến trúc cụ thể.

- Nêu định nghĩa 1 câu.
- Nêu 1 quyết định kỹ thuật chịu ảnh hưởng bởi khái niệm này.
- Nêu 1 metric để theo dõi hiệu quả.
- Cách trả lời này giúp bạn thể hiện tư duy thực chiến trong interview.

### 🟡 Q: Quick term 10: What does 'Tool Calling' mean in system design discussion? `[Mid]`

**A:** `Tool Calling` là khái niệm quan trọng cần định nghĩa ngắn gọn và gắn với kiến trúc cụ thể.

- Nêu định nghĩa 1 câu.
- Nêu 1 quyết định kỹ thuật chịu ảnh hưởng bởi khái niệm này.
- Nêu 1 metric để theo dõi hiệu quả.
- Cách trả lời này giúp bạn thể hiện tư duy thực chiến trong interview.

### 🔴 Q: Quick term 11: What does 'KV Cache' mean in system design discussion? `[Senior]`

**A:** `KV Cache` là khái niệm quan trọng cần định nghĩa ngắn gọn và gắn với kiến trúc cụ thể.

- Nêu định nghĩa 1 câu.
- Nêu 1 quyết định kỹ thuật chịu ảnh hưởng bởi khái niệm này.
- Nêu 1 metric để theo dõi hiệu quả.
- Cách trả lời này giúp bạn thể hiện tư duy thực chiến trong interview.

### 🔴 Q: Quick term 12: What does 'MoE' mean in system design discussion? `[Senior]`

**A:** `MoE` là khái niệm quan trọng cần định nghĩa ngắn gọn và gắn với kiến trúc cụ thể.

- Nêu định nghĩa 1 câu.
- Nêu 1 quyết định kỹ thuật chịu ảnh hưởng bởi khái niệm này.
- Nêu 1 metric để theo dõi hiệu quả.
- Cách trả lời này giúp bạn thể hiện tư duy thực chiến trong interview.

### 🔴 Q: Quick term 13: What does 'Latency SLO' mean in system design discussion? `[Senior]`

**A:** `Latency SLO` là khái niệm quan trọng cần định nghĩa ngắn gọn và gắn với kiến trúc cụ thể.

- Nêu định nghĩa 1 câu.
- Nêu 1 quyết định kỹ thuật chịu ảnh hưởng bởi khái niệm này.
- Nêu 1 metric để theo dõi hiệu quả.
- Cách trả lời này giúp bạn thể hiện tư duy thực chiến trong interview.

### 🔴 Q: Quick term 14: What does 'Cost per Request' mean in system design discussion? `[Senior]`

**A:** `Cost per Request` là khái niệm quan trọng cần định nghĩa ngắn gọn và gắn với kiến trúc cụ thể.

- Nêu định nghĩa 1 câu.
- Nêu 1 quyết định kỹ thuật chịu ảnh hưởng bởi khái niệm này.
- Nêu 1 metric để theo dõi hiệu quả.
- Cách trả lời này giúp bạn thể hiện tư duy thực chiến trong interview.

### 🔴 Q: Quick term 15: What does 'A/B Eval' mean in system design discussion? `[Senior]`

**A:** `A/B Eval` là khái niệm quan trọng cần định nghĩa ngắn gọn và gắn với kiến trúc cụ thể.

- Nêu định nghĩa 1 câu.
- Nêu 1 quyết định kỹ thuật chịu ảnh hưởng bởi khái niệm này.
- Nêu 1 metric để theo dõi hiệu quả.
- Cách trả lời này giúp bạn thể hiện tư duy thực chiến trong interview.

---

## 8. TypeScript System Design Snippet / Mẫu code TypeScript

### 🟡 Q: How do you structure a service boundary for AI pipeline in TypeScript? `[Mid]`

**A:** Nên tách interface từng stage để test độc lập và thay provider dễ dàng.

- Ví dụ dưới đây mô tả retrieval + generation + moderation theo hợp đồng rõ ràng.

```ts
type RetrievalHit = { text: string; score: number; source: string };
type Answer = { text: string; citations: string[]; blocked: boolean };

interface Retriever {
  search(query: string): Promise<RetrievalHit[]>;
}
interface Generator {
  generate(prompt: string): Promise<string>;
}
interface Moderator {
  check(text: string): Promise<{ blocked: boolean; reason?: string }>;
}

export async function handleQuestion(
  q: string,
  retriever: Retriever,
  generator: Generator,
  moderator: Moderator,
): Promise<Answer> {
  const hits = await retriever.search(q);
  const prompt = `Answer from context only.\n${hits.map((h) => h.text).join("\n")}\nQ:${q}`;
  const draft = await generator.generate(prompt);
  const verdict = await moderator.check(draft);
  return {
    text: verdict.blocked ? "Content blocked by policy." : draft,
    citations: hits.map((h) => h.source),
    blocked: verdict.blocked,
  };
}
```

---

## 9. Interview Q&A Bank / Ngân hàng câu hỏi phỏng vấn

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #1? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #2? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #3? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #4? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #5? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #6? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #7? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #8? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #9? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #10? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #11? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #12? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #13? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #14? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #15? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #16? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #17? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #18? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #19? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #20? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #21? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #22? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #23? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #24? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #25? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #26? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #27? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #28? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #29? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #30? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #31? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #32? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #33? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #34? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #35? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #36? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #37? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #38? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #39? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #40? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #41? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #42? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #43? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #44? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #45? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #46? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #47? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #48? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #49? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #50? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #51? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #52? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #53? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #54? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #55? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #56? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #57? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #58? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #59? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #60? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #61? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #62? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #63? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #64? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #65? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #66? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #67? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #68? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #69? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #70? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #71? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #72? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #73? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #74? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #75? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #76? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #77? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #78? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #79? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in AI system design scenario #80? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in AI system design scenario #81? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in AI system design scenario #82? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

---

## Interview Q&A Summary / Tổng hợp câu hỏi phỏng vấn

### Q: Design a RAG-based customer support chatbot / Thiết kế hệ thống chatbot hỗ trợ khách hàng dùng RAG 🔴 Senior

**A:**

```
System Design: Customer Support Chatbot

Requirements:
  Functional: answer questions from knowledge base, escalate complex cases
  Non-functional: <2s latency, 99.9% uptime, 10k concurrent users

High-Level Architecture:
┌─────────┐    ┌──────────────┐    ┌───────────────┐    ┌──────────┐
│  User   │───►│  API Gateway │───►│  Chat Service │───►│   LLM    │
│(web/app)│    │  (rate limit,│    │  (stateless)  │    │  (GPT-4/ │
└─────────┘    │   auth)      │    └───────┬───────┘    │   Claude)│
               └──────────────┘            │            └──────────┘
                                           │
                              ┌────────────┼────────────┐
                              ▼            ▼            ▼
                        ┌──────────┐ ┌─────────┐ ┌──────────┐
                        │ Vector   │ │ Convo   │ │ Ticket   │
                        │   DB     │ │ History │ │  System  │
                        │(Pinecone)│ │(Redis)  │ │(Zendesk) │
                        └──────────┘ └─────────┘ └──────────┘

Request flow:
1. User sends message
2. API Gateway: auth + rate limit (100 req/min/user)
3. Chat Service: load conversation history from Redis (last 10 turns)
4. Embed user query → search Vector DB → retrieve top-5 chunks
5. Assemble prompt: system + history + context + query
6. Call LLM → stream response back to user
7. Post-process: extract any required actions (escalate, create ticket)
8. Store turn in Redis + log to analytics

Indexing pipeline (offline):
Documents → [Parser] → [Chunker] → [Embedder] → [Vector DB]
                                                 + [BM25 index]

Hybrid retrieval: dense + sparse → reranker → top-5 final chunks

Escalation logic:
├── Confidence threshold: if LLM uncertainty detected → escalate
├── Sentiment: negative sentiment 3+ turns → human handoff
├── Explicit keywords: "speak to human", "supervisor"
└── Fallback: after 2 failed attempts → create ticket
```

**Scale considerations:**

```
Bottlenecks & solutions:
├── LLM latency: streaming + async, response caching for common Q&As
├── Vector search: approximate NN (HNSW in Pinecone/Weaviate), partition by tenant
├── Context window: limit history to last 10 turns, summarize older history
└── Cost: cache embeddings, use smaller model for simple queries (routing)

Caching strategy:
├── Semantic cache: if query embedding similar to cached query → return cached answer
├── Embedding cache: cache embedding computation for repeated queries
└── Tools: GPTCache, LangChain cache
```

**Điểm senior interview:** Design bài này cần cover: latency (streaming), scale (async, caching), reliability (fallback, HITL), cost (model routing, semantic cache), và observability (every turn logged). Biết trade-off giữa Pinecone (managed, expensive) vs Weaviate (self-hosted, cheaper).

### Q: How do you design an AI system that's cost-efficient at scale? / Tối ưu cost cho AI system at scale? 🔴 Senior

**A:**

```
Cost drivers in LLM systems:
├── Token count: input + output tokens × price/token
├── Model choice: GPT-4 ≈ 30× more expensive than GPT-3.5
├── API calls per request: agents with many tool calls → high cost
└── Embedding calls: N documents × embedding cost

Optimization strategies:

1. Model routing (cascade)
   Simple query → cheap model (GPT-3.5/Haiku) → if uncertain → expensive model
   ├── Classify query complexity first (small classifier)
   ├── Route 80% simple queries to cheap model → ~5× cost reduction
   └── Tools: RouteLLM, LiteLLM router

2. Prompt optimization
   ├── Reduce input tokens: remove unnecessary instructions, compress context
   ├── Reduce output tokens: "Answer in 1 sentence" vs open-ended
   └── Few-shot → chain-of-thought only when needed (CoT uses 2-3× tokens)

3. Caching
   ├── Exact cache: hash(prompt) → cached response (Redis, 24h TTL)
   ├── Semantic cache: similar queries → reuse response (GPTCache)
   └── Prompt prefix caching: static system prompt → Claude/GPT cache it (50% discount)

4. Batching
   ├── Batch embedding requests (reduce API calls)
   ├── Async processing: queue non-realtime requests
   └── OpenAI Batch API: 50% discount for async processing

5. Fine-tuning smaller models
   ├── Fine-tune GPT-3.5 on GPT-4 outputs → similar quality, 10× cheaper
   ├── Distillation: small model learns from large model
   └── For specific tasks: fine-tuned 7B >> general 70B

Cost monitoring:
├── Track tokens/request by user, feature, model
├── Alert on cost anomalies (runaway agents)
└── Set per-user/per-tenant budget limits
```

**Rule of thumb:** Start with expensive model to establish quality bar → measure → optimize with cheaper model → iterate. Never optimize cost before having correct output.

**Điểm interview:** Biết model routing là key insight — không phải mọi query đều cần GPT-4. Semantic caching và prompt caching có thể giảm 30-60% cost. Fine-tuning cheaper model là long-term investment khi volume đủ lớn.

---

## Self-Check / Tự Kiểm Tra

| #   | Loại           | Câu hỏi                                                                                                                                                            |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 🔍 Retrieval   | Can I design a semantic search system end-to-end (data ingestion → chunking → embedding → vector DB → ANN query → rerank → response)?                              |
| 2   | 🎨 Visual      | Can I draw the full RAG chatbot request flow — query rewrite, retrieval, prompt build with token budget, LLM stream, history store — from memory without notes?    |
| 3   | 🛠️ Application | Can I explain 3 cost optimization strategies for production LLM systems (model routing, semantic caching, prompt compression) and give a concrete example of each? |
| 4   | 🐛 Debug       | If a RAG chatbot consistently returns hallucinated answers despite having the right documents indexed, what are 3 possible root causes to investigate first?       |
| 5   | 🎓 Teach       | Can I explain model routing architecture and routing criteria to a junior engineer so they understand _when NOT to call GPT-4_ — and why that matters for cost?    |

💬 **Feynman Prompt:** Giải thích tại sao "establish quality bar first, optimize cost later" là đúng — và ví dụ khi cost optimization trước dẫn đến technical debt.

## Connections / Liên Kết

- ⬅️ **Built on**: [RAG & Embeddings](./04-rag-and-embeddings.md) — semantic search uses RAG pattern
- ⬅️ **Built on**: [Agent Patterns](./03-agent-patterns.md) — complex AI systems often use agents
- ➡️ **Applied in**: [AI Production Challenges](./07-ai-production-challenges.md) — production-specific design concerns
- 🔗 **Related**: [Design Framework](../../be-track/04-be-system-design/01-design-framework.md) — same 5-step framework applies to AI system design
