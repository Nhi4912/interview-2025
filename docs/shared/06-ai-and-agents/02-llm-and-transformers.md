# LLM and Transformers — Mô hình ngôn ngữ lớn và Transformer

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Momo chatbot hallucination incident:** Momo deploy LLM-powered customer support chatbot. User hỏi "Phí chuyển tiền sang ngân hàng ABC là bao nhiêu?" — chatbot trả lời "0.1%" (hallucinated từ training data của bank khác). User chuyển tiền và bị tính phí 0.5%. Complaint, refund request. Fix: implement RAG (Retrieval Augmented Generation) — chatbot search real-time fee schedule trước khi trả lời. Hallucination về fees giảm từ 15% → 2%.

**Bài học:** LLMs generate plausible-sounding text, không guarantee accurate text. Production LLM systems cần guardrails: RAG cho factual queries, output validation, human escalation cho edge cases.

## What & Why / Cái Gì & Tại Sao

**Analogy:** LLM giống một người rất giỏi đọc và viết — đọc hàng tỷ trang sách và có thể viết về bất kỳ chủ đề nào. Nhưng họ đôi khi "nhớ sai" (hallucinate) vì đã đọc quá nhiều. Transformer architecture là cơ chế "đọc và hiểu" — attention mechanism giống việc highlight phần quan trọng khi đọc một câu dài.

**Why it matters:** LLM integration là skill mới bắt buộc cho backend/fullstack developers. Biết tokenization, context window, temperature, và RAG là baseline để build AI-powered features đúng cách.

---

## 1. Large Language Models / LLM là gì

> 🧠 **Memory Hook:** LLM như sinh viên đọc hết 10 triệu cuốn sách rồi giỏi đoán từ tiếp theo — nhưng không biết mình đang đoán hay đang nhớ sai.

**Tại sao tồn tại? / Why does this exist?**

Trước LLM, mỗi NLP task cần một mô hình riêng: chatbot riêng, dịch thuật riêng, tóm tắt riêng — tốn kém và không generalize. LLM giải quyết bằng cách học "ngôn ngữ nói chung" từ hàng tỷ token, rồi thích nghi với nhiều task qua prompting.
→ **Why?** Vì RNN/LSTM không scale được để học pattern từ corpus đủ lớn để có emergent capabilities.
→ **Why?** Vì chỉ cần một objective đơn giản — dự đoán token tiếp theo — nhưng ở scale đủ lớn thì nảy sinh khả năng reasoning, coding, translation tự nhiên.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng bạn đọc hết 10 triệu cuốn sách và giỏi đến mức khi ai nói "Hôm nay trời...", bạn biết từ tiếp theo rất có thể là "nắng" hay "mưa". LLM làm đúng việc đó — dự đoán từ tiếp theo. Nhưng sau hàng tỷ câu, nó học được cấu trúc, ngữ nghĩa, thậm chí cách lập luận — tất cả chỉ từ việc đoán từ tiếp theo.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Training Data (hàng tỷ token từ web, sách, code)
        ↓
   Objective: Predict next token
   "The cat sat on the ___" → "mat" (99.2%), "floor" (0.5%)...
        ↓
   Backpropagation: adjust billions of weights
        ↓
   Scale: 7B → 70B → 405B parameters
        ↓
   Emergent capabilities: translation, coding, reasoning, math
        ↓
   RLHF / Instruction tuning → align to follow instructions safely
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- LLM không "biết" sự thật — chỉ học pattern; hallucination là hậu quả tất yếu
- Token count ≠ word count: "ChatGPT" có thể là 2-3 token tùy tokenizer, ảnh hưởng billing
- Context window là hard limit: vượt qua thì truncation hoặc error — phải quản lý token budget
- Stochastic by default: cùng prompt, temperature > 0 → kết quả khác nhau mỗi lần

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                             | Tại sao sai                                                 | Đúng là                                               |
| ----------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------- |
| "LLM biết mọi thứ và luôn đúng"     | LLM sinh text plausible, không có knowledge base kiểm chứng | Luôn cần RAG hoặc validation cho factual queries      |
| "Model nhiều tham số hơn = tốt hơn" | Tradeoff: latency, cost, memory tăng phi tuyến              | Chọn model phù hợp task, latency SLA, và budget       |
| "Cùng prompt → cùng output"         | Temperature > 0 gây stochastic sampling                     | Dùng temperature=0 cho tasks cần deterministic output |

**🎯 Interview Pattern:**

- Khi thấy: "Explain LLM" hoặc "How do you use AI in your backend?"
- Nhớ đến: next-token prediction + emergent capabilities + token budget + hallucination risk
- Mở đầu: "An LLM is a neural network trained to predict the next token at scale — the interesting part is what emerges from that simple objective, and the engineering challenge is managing its failure modes."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [ML Fundamentals](./01-ml-fundamentals.md) — neural networks và backpropagation
- ➡️ Để hiểu tiếp: Section 2 bên dưới — Transformer Basics (cơ chế attention)

### 🟢 Q: What is a Large Language Model (LLM)? `[Junior]`

**A:** LLM là mô hình neural network rất lớn được huấn luyện để dự đoán token tiếp theo trên corpora khổng lồ.

- Từ góc nhìn engineering, LLM là engine sinh text/code/tool-call từ context đầu vào.
- Khả năng emergent đến từ scale dữ liệu + tham số + compute + alignment.
- LLM hiện đại đa số là Transformer decoder-only hoặc biến thể MoE.

### 🟡 Q: Why are tokens important for LLM systems? `[Mid]`

**A:** Token là đơn vị tính toán và đơn vị billing trong đa số API LLM.

- Prompt tokens + completion tokens quyết định cost.
- Context window giới hạn tổng token có thể “nhìn thấy” mỗi request.
- Tokenization khác nhau giữa model nên cùng chuỗi text có số token khác nhau.
- Kỹ sư cần quản lý token budget như quản lý memory budget.

---

## 2. Transformer Basics / Cơ chế Transformer

> 🧠 **Memory Hook:** Attention như học sinh highlight từng đoạn quan trọng khi đọc đề bài — mỗi từ hỏi "từ nào trong câu này giúp tôi hiểu mình hơn?" rồi tổng hợp câu trả lời theo trọng số.

**Tại sao tồn tại? / Why does this exist?**

RNN/LSTM phải xử lý tuần tự từng token — không song song được và "quên" thông tin ở xa trong chuỗi dài. Transformer giải quyết bằng cách cho mỗi token "nhìn" tất cả token khác song song thông qua attention.
→ **Why?** Vì RNN không có cơ chế để từ cuối câu trực tiếp attend đến từ đầu câu mà không đi qua nhiều bước trung gian.
→ **Why?** Vì sequential processing là bottleneck tuyến tính — không tận dụng được GPU parallel processing, làm chậm cả training lẫn inference.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Bạn đọc câu "Con mèo đang nằm trên ghế màu đỏ, nó trông rất thoải mái." Từ "nó" cần biết "nó" là gì. Attention mechanism cho phép "nó" nhìn lại toàn bộ câu và tính điểm cho từng từ: "con mèo" được điểm cao nhất. "Đỏ" được điểm thấp. Output là thông tin tổng hợp có trọng số — "nó" hấp thụ ngữ nghĩa từ "con mèo" nhiều nhất.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Câu: "The cat sat on the mat"
      [T1]  [T2] [T3] [T4] [T5] [T6]

Với token "sat" (T3), self-attention tính:
  Q_sat  = WQ × embed(sat)    ← "Tôi đang tìm gì?"
  K_Ti   = WK × embed(Ti)     ← "Mỗi token chứa thông tin gì?"
  V_Ti   = WV × embed(Ti)     ← "Nội dung sẽ được truyền đi"

  Score_i  = Q_sat · K_Ti / √d_k
  Weights  = softmax([Score_1..6])
           → [0.05, 0.65, 0.10, 0.05, 0.10, 0.05]
               (cat chiếm trọng số cao vì "sat" phụ thuộc "cat")

  Output_sat = Σ (weight_i × V_i)   ← weighted sum

Multi-head (chạy song song 8-32 heads):
  Head 1 → học cú pháp (subject-verb dependency)
  Head 2 → học coreference (pronoun → noun)
  Head 3 → học positional pattern (adjacent words)
  ...
  Concat all heads → Linear projection → final representation
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- O(n²) complexity: chuỗi 1000 token → 1,000,000 attention scores — bottleneck với long context
- Không có thứ tự mặc định: "dog bites man" = "man bites dog" nếu không có positional encoding
- Head collapse: các head đôi khi học cùng pattern — waste capacity, khó diagnose
- Causal masking bắt buộc cho decoder: phải mask future tokens để không "nhìn trộm" khi generate

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                           | Tại sao sai                                                           | Đúng là                                                               |
| --------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| "Attention = similarity search"   | Chỉ đúng một phần — Q và K có projection riêng biệt với mục đích khác | Q hỏi, K là nhãn, V là nội dung — ba vector với weights riêng         |
| "Multi-head chỉ tốn thêm compute" | Mỗi head học relationship khác nhau, không redundant                  | Multi-head tăng expressiveness, mỗi head chuyên một loại pattern      |
| "Positional encoding có thể bỏ"   | Không có PE thì "dog bites man" và "man bites dog" ra cùng output     | Positional encoding (hay RoPE) là bắt buộc cho sequence understanding |

**🎯 Interview Pattern:**

- Khi thấy: "Explain self-attention" hoặc "Why Transformer replaced RNN?"
- Nhớ đến: Q·K^T/√d_k → softmax → ×V + parallel processing + O(n²) tradeoff
- Mở đầu: "Self-attention lets each token ask 'which other tokens are most relevant to me?' and weighted-aggregate their values — this replaces the sequential bottleneck of RNNs and enables full parallel training."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [ML Fundamentals](./01-ml-fundamentals.md) — neural networks, backprop, matrix multiplication
- ➡️ Để hiểu tiếp: Section 4 bên dưới — Inference Concepts (KV cache được build trực tiếp từ K và V này)

### 🟡 Q: Explain self-attention with Q, K, V intuitively. `[Mid]`

**A:** Self-attention cho mỗi token “nhìn” các token khác để quyết định thông tin nào quan trọng.

- **Query (Q):** token hiện tại đang tìm loại thông tin nào.
- **Key (K):** nhãn mô tả mỗi token có thông tin gì.
- **Value (V):** nội dung thật sẽ được trộn theo trọng số attention.
- Trọng số = softmax(Q·K^T / sqrt(d_k)); output = trọng số nhân V.
- Hiểu đơn giản: Q là câu hỏi, K là chỉ mục, V là nội dung tài liệu.

### 🟡 Q: What is multi-head attention? `[Mid]`

**A:** Multi-head attention chạy nhiều attention “đầu” song song để học nhiều quan hệ khác nhau.

- Mỗi head có projection riêng cho Q/K/V.
- Một head có thể học dependency cú pháp, head khác học quan hệ ngữ nghĩa xa.
- Ghép các head lại giúp biểu diễn phong phú hơn single-head.
- Đổi lại chi phí compute/memory tăng đáng kể.

### 🟡 Q: Why do transformers need positional encoding? `[Mid]`

**A:** Attention thuần túy không có khái niệm thứ tự, nên cần cơ chế mã hóa vị trí.

- **Sinusoidal encoding:** công thức cố định, không học tham số thêm.
- **Learned positional embedding:** học trực tiếp từ dữ liệu.
- **RoPE:** quay vector theo vị trí, hỗ trợ extrapolation context tốt hơn trong nhiều model hiện đại.
- Không có positional info, câu “dog bites man” và “man bites dog” có thể bị hiểu sai thứ tự.

### 🟢 Q: Encoder-only vs decoder-only vs encoder-decoder? `[Junior]`

**A:** Ba họ kiến trúc phục vụ mục tiêu khác nhau.

- **Encoder-only (BERT):** mạnh cho hiểu ngôn ngữ (classification, retrieval embeddings).
- **Decoder-only (GPT):** mạnh cho generation tự hồi quy token-by-token.
- **Encoder-decoder (T5):** tốt cho tasks seq2seq như translation, summarization có conditioning rõ.
- Chọn kiến trúc theo task và hạ tầng inference.

---

## 3. LLM Landscape 2025 / Bức tranh LLM 2025

> 🧠 **Memory Hook:** So sánh LLM như chọn xe máy ở Việt Nam — Honda Wave đáng tin dùng hàng ngày, Vespa sang nhưng đắt, xe đạp điện rẻ tự xài — mỗi cái phù hợp túi tiền và nhu cầu khác nhau.

**Tại sao tồn tại? / Why does this exist?**

Không có một LLM nào tốt nhất cho mọi use case. Mỗi model có trade-off khác nhau về capability, cost, latency, data privacy, và deployment constraints — engineer cần framework để chọn đúng.
→ **Why?** Vì training và serving LLM tốn cực kỳ nhiều compute — không thể tối ưu tất cả dimensions cùng lúc.
→ **Why?** Vì tổ chức có nhu cầu khác nhau: startup cần nhanh và rẻ, fintech cần data residency, enterprise cần auditability và enterprise SLA.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng chọn nhà hàng cho tiệc công ty. Nhà hàng 5 sao (GPT-4o) ngon nhất nhưng đắt, phải đặt trước và dữ liệu menu được lưu bởi họ. Quán bình dân tự nấu (Llama self-host) kiểm soát được nguyên liệu, nhưng cần đầu bếp riêng. Bạn chọn theo ngân sách, số lượng khách, và yêu cầu đặc biệt — không phải lúc nào cũng cần nhà hàng đắt nhất.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
LLM Selection Matrix 2025:
┌─────────────────┬─────────────────┬──────────┬─────────────────┐
│ Model           │ Điểm mạnh       │ Cost     │ Deploy          │
├─────────────────┼─────────────────┼──────────┼─────────────────┤
│ GPT-4o / o1     │ Multimodal/Reas.│ $$$$     │ API only        │
│ Claude 3.5/4    │ Coding/Long ctx │ $$$      │ API only        │
│ Gemini 1.5/2.0  │ 1M ctx, vision  │ $$$      │ API only        │
│ Llama 3.x       │ Open-weight     │ $ + GPU  │ Self-host OK    │
│ Mistral/Mixtral │ Cost/perf MoE   │ $$       │ API / Self-host │
│ DeepSeek        │ Reasoning, rẻ  │ $        │ API / Self-host │
└─────────────────┴─────────────────┴──────────┴─────────────────┘

Decision Framework:
  1. Data privacy / residency required?
     └─ YES → Self-host: Llama 3.x, Mistral
  2. Long document (>100K tokens)?
     └─ YES → Gemini 1.5 Pro (1M ctx)
  3. Best coding quality?
     └─ YES → Claude 3.5 Sonnet
  4. Cost-sensitive at scale?
     └─ YES → GPT-4o-mini / Gemini Flash / DeepSeek
  5. Max control + fine-tuning?
     └─ YES → Open-weight (Llama, Mistral)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Model mạnh nhất trong benchmark ≠ tốt nhất cho task cụ thể — luôn eval trên data thực của bạn
- Constitutional AI của Anthropic ảnh hưởng refusal behavior — cần test trước với use case nhạy cảm
- Open-weight license: Llama có commercial restrictions cho một số tier — đọc kỹ trước khi deploy
- Benchmark contamination: model có thể train trên test set — leaderboard scores đôi khi không reflect thực tế

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                              | Tại sao sai                                         | Đúng là                                                          |
| ------------------------------------ | --------------------------------------------------- | ---------------------------------------------------------------- |
| "Dùng GPT-4 cho mọi thứ"             | Overkill cho simple tasks, chi phí rất cao          | Dùng GPT-4o-mini hay Gemini Flash cho tasks đơn giản — thường đủ |
| "Open-source = miễn phí"             | Self-host cần GPU servers, MLOps team, on-call      | TCO của self-host thường cao hơn API khi chưa đủ scale           |
| "Benchmark score = production score" | Task-specific performance khác với public benchmark | Luôn benchmark trên dataset thực tế và task distribution của bạn |

**🎯 Interview Pattern:**

- Khi thấy: "Which LLM would you choose for [use case]?" hoặc "How do you evaluate LLMs?"
- Nhớ đến: compliance → control → TCO → task-specific benchmark → speed-to-market
- Mở đầu: "My decision framework starts with data residency and compliance requirements, then I'd benchmark candidates on our actual task distribution before comparing total cost of ownership."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: Section 1 bên trên — LLM Basics (hiểu LLM là gì trước khi so sánh)
- ➡️ Để hiểu tiếp: [AI Engineering Practice](./05-ai-engineering-practice.md) — deploying và operating LLMs in production

### 🟡 Q: How should developers compare major LLM families in 2025? `[Mid]`

**A:** So sánh theo capability, latency, cost, context window, safety policy, và deployment constraints.

- **OpenAI GPT-4o/o1/o3:** mạnh đa phương thức, reasoning tier khác nhau, API ecosystem rộng.
- **Anthropic Claude 3.5/4:** coding + long-context mạnh, nhấn mạnh Constitutional AI.
- **Google Gemini 1.5/2.0:** long context rất lớn (đến 1M ở một số tier), multimodal sâu.
- **Meta Llama 3.x:** open-weight, linh hoạt self-hosting/commercial integration theo license.
- **Mistral/Mixtral:** MoE hiệu quả cost/performance.
- **DeepSeek:** nổi bật về cost efficiency và reasoning trong nhiều benchmark công khai.

### 🔴 Q: What is Constitutional AI in practical terms? `[Senior]`

**A:** Constitutional AI là cách align model bằng bộ nguyên tắc rõ ràng thay vì chỉ dựa vào nhãn người ở mọi bước.

- Model tự critique/ revise theo “hiến pháp” hành vi mong muốn.
- Mục tiêu: tăng harmlessness/helpfulness/honesty có hệ thống.
- Với engineering team, nó ảnh hưởng output style, refusal behavior, và risk profile.

---

## 4. Inference Concepts / Khái niệm inference quan trọng

> 🧠 **Memory Hook:** KV cache như tờ nháp khi làm toán — thay vì tính lại từ đầu mỗi bước, giữ kết quả trung gian; tiết kiệm thời gian nhưng cần nhiều giấy (VRAM) hơn.

**Tại sao tồn tại? / Why does this exist?**

LLM generate text token-by-token (autoregressive). Không có cache, mỗi token mới phải tính lại attention cho toàn bộ sequence từ đầu — O(n²) total cost cho response n token. KV cache cắt giảm điều này xuống O(n) per step.
→ **Why?** Vì attention cần Q·K^T cho tất cả token pairs — tính lại K,V cho các token cũ là lãng phí hoàn toàn.
→ **Why?** Vì latency trực tiếp ảnh hưởng user experience: 5s để generate 200 token là chấp nhận được, 50s thì không.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Bạn làm bài điền từ, mỗi câu phải đọc lại toàn bài từ đầu trước khi điền từ tiếp theo — mệt và chậm! KV cache giống viết tóm tắt từng câu vào tờ nháp: lần sau chỉ đọc tóm tắt, không đọc lại cả bài. Tốc độ tăng vọt nhưng cần nhiều giấy nháp hơn (VRAM). Nếu hết giấy, phải dùng giấy nhỏ hơn (quantization) hoặc cho nhiều người dùng chung một tệp giấy (paged attention).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Autoregressive generation — WITHOUT KV cache:
  Step 1: [Hello]            → recalc all → "World"
  Step 2: [Hello, World]     → recalc all → "!"
  Step 3: [Hello, World, !]  → recalc all → next...
  Cost: O(n²) total — tăng nhanh với response dài

WITH KV cache:
  Step 1: Compute K₁,V₁ for "Hello" → cache → "World"
  Step 2: Compute K₂,V₂ for "World" → reuse K₁,V₁ → "!"
  Step 3: Compute K₃,V₃ for "!" → reuse K₁,V₁,K₂,V₂ → next
  Cost: O(n) per step — chỉ tính K,V cho token mới

Tradeoffs:
┌──────────────────────┬────────────────────────────────┐
│ Benefit              │ Cost                           │
├──────────────────────┼────────────────────────────────┤
│ Fast decode latency  │ VRAM grows linearly w/ seq len │
│ Predictable per-step │ Limits batch size              │
│ Low compute overhead │ Cache invalidated on prompt Δ  │
└──────────────────────┴────────────────────────────────┘

Optimizations:
  Paged Attention (vLLM) → manage cache like virtual memory pages
  Prefix Caching         → reuse KV for identical prompt prefix
  Cache Quantization     → INT8 KV cache, 2× memory saving
  MoE (Mixtral)          → activate only top-k experts per token
                           → large capacity, sparse compute
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- KV cache bị invalidate khi system prompt thay đổi → prefix caching quan trọng khi system prompt cố định
- Paged attention (vLLM): chia cache thành pages, tăng batching efficiency và reduce fragmentation
- MoE load balancing: nếu router chọn cùng một expert cho tất cả token → expert overload, bottleneck
- "Lost in the middle": long-context model attend kém đến thông tin ở giữa context — ưu tiên đặt thông tin quan trọng ở đầu/cuối

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                             | Tại sao sai                                                          | Đúng là                                                            |
| ----------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| "Temperature=0 → không hallucinate" | Deterministic ≠ factual; model vẫn generate sai một cách nhất quán   | Temperature kiểm soát randomness, không kiểm soát factual accuracy |
| "KV cache = free performance"       | Cache tốn VRAM, giới hạn batch size, cần invalidation logic          | Phải balance cache size vs. batch size để tối ưu throughput        |
| "MoE luôn tốt hơn dense model"      | MoE phức tạp hơn khi deploy, load balancing khó, latency khó predict | MoE phù hợp khi cần large capacity với limited compute budget      |

**🎯 Interview Pattern:**

- Khi thấy: "How do you optimize LLM inference?" hoặc "Why is token generation slow?"
- Nhớ đến: prefill phase (O(n²)) → decode phase (O(n) với KV cache) + paged attention + quantization
- Mở đầu: "LLM inference has two phases — prefill processes the full prompt, and decode generates tokens one-by-one where KV cache reduces the per-step cost from O(n²) to O(n)."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: Section 2 bên trên — Transformer Basics (KV cache lưu Key và Value từ attention layers)
- ➡️ Để hiểu tiếp: [AI Engineering Practice](./05-ai-engineering-practice.md) — serving infrastructure và cost optimization

### 🟡 Q: What is KV cache and why does it matter? `[Mid]`

**A:** KV cache lưu key/value của các token đã xử lý để không tính lại attention toàn chuỗi mỗi bước.

- Giảm độ phức tạp thực tế khi generate autoregressive dài.
- Tăng tốc đáng kể latency token tiếp theo.
- Đổi lại tốn memory lớn, đặc biệt với batch và context dài.
- Kỹ thuật tối ưu: cache quantization, paged attention, prefix caching.

### 🟡 Q: What is Mixture of Experts (MoE)? `[Mid]`

**A:** MoE là kiến trúc sparse: chỉ kích hoạt một số expert cho mỗi token thay vì toàn bộ tham số.

- Router chọn top-k experts theo token.
- Lợi ích: tăng capacity mà không tăng compute tuyến tính tương ứng.
- Rủi ro: load balancing experts, độ ổn định train, và complexity triển khai.

### 🟢 Q: How do temperature, top-p, and top-k affect output? `[Junior]`

**A:** Đây là các tham số sampling điều khiển độ đa dạng và độ ổn định output.

- **Temperature thấp:** output bảo thủ, lặp ít lỗi nhưng có thể khô cứng.
- **Temperature cao:** sáng tạo hơn nhưng tăng rủi ro hallucination.
- **Top-k:** chỉ chọn từ k token xác suất cao nhất.
- **Top-p (nucleus):** chọn tập token có tổng xác suất đạt p.

---

## 5. Scaling and Trade-offs / Quy luật scale và đánh đổi

> 🧠 **Memory Hook:** Scaling laws như quy luật tập gym — tập thêm 1 tiếng mỗi ngày rõ hiệu quả, tập 24 tiếng không giúp gì thêm; phải biết điểm tới hạn và chi phí cơ hội trước khi đầu tư.

**Tại sao tồn tại? / Why does this exist?**

Trước khi có scaling laws, không ai biết chắc liệu "làm model to hơn" có thực sự đáng không. Training một large model tốn hàng triệu USD — cần framework định lượng để ra quyết định trước khi commit compute.
→ **Why?** Vì engineering decisions (tự host 70B hay dùng API GPT-4?) cần cơ sở so sánh định lượng chứ không phải cảm tính.
→ **Why?** Vì cost không tăng tuyến tính — training cost tăng O(N×D), inference cost tăng theo parameter count, nhưng quality improvement giảm dần (diminishing returns).

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Học tiếng Anh: học 1 tiếng/ngày tiến bộ rõ, học 4 tiếng/ngày nhanh hơn nhưng không gấp 4 lần, học 16 tiếng/ngày thì não mệt và tiến bộ chậm lại. Scaling laws của LLM cũng vậy — thêm tham số và data giúp model tốt hơn theo quy luật power-law, không phải tuyến tính. Và đổi lại, chi phí tăng rất nhanh trong khi improvement nhỏ dần.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Chinchilla Scaling Law: Loss ≈ f(N, D)
  N = model parameters | D = training tokens
  Chinchilla optimal: D ≈ 20 × N
  (Llama 3 8B train trên 15T tokens — well over Chinchilla ratio
   → over-trained small model → better for inference)

Practical Decision Matrix:
┌─────────────────┬──────────┬──────────┬───────────┬──────────┐
│ Strategy        │ Quality  │ Cost     │ Latency   │ Control  │
├─────────────────┼──────────┼──────────┼───────────┼──────────┤
│ Big model API   │ ★★★★★   │ $$$$     │ Medium    │ Low      │
│ Small + RAG     │ ★★★★    │ $$       │ Medium    │ Medium   │
│ Fine-tuned 7B   │ ★★★★    │ $ + GPU  │ Low       │ High     │
│ Distilled 3B    │ ★★★      │ $        │ Very Low  │ High     │
└─────────────────┴──────────┴──────────┴───────────┴──────────┘

Open vs Closed decision:
  Closed API  → fast start, high quality, data leaves org
  Open-weight → full control, data stays, need MLOps team
  Hybrid      → open-weight for sensitive data + API for complex tasks
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Scaling laws không áp dụng đều cho mọi task: reasoning tasks có thể plateau sớm, coding scale tốt hơn
- Instruction tuning và RLHF thay đổi behavior mà không cần scale thêm — alignment ≠ raw capability
- "Smaller but aligned" models (Claude Haiku, GPT-4o-mini) thường đủ cho 80% production use cases
- Carbon footprint tăng phi tuyến theo model size — sustainability đang trở thành yếu tố consideration

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                 | Tại sao sai                                           | Đúng là                                                                |
| --------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| "Model lớn hơn luôn tốt hơn"            | Diminishing returns + cost/latency tăng phi tuyến     | Optimal model phụ thuộc vào task, SLA, budget — thường small+RAG thắng |
| "Self-host open-source là miễn phí"     | GPU servers + MLOps engineer + on-call có chi phí lớn | TCO analysis cần tính đủ: GPU, infra, engineering time, reliability    |
| "Scaling giải quyết được hallucination" | Hallucination và reliability không tự hết khi scale   | Cần RAG, guardrails, fine-tuning riêng biệt — scale chỉ giúp một phần  |

**🎯 Interview Pattern:**

- Khi thấy: "Why not just use a bigger model?" hoặc "How do you choose model size for production?"
- Nhớ đến: Chinchilla optimal + TCO + diminishing returns + start small then scale
- Mở đầu: "I'd start with the smallest model that meets our quality SLO — scaling has super-linear cost increases, so I'd exhaust RAG and prompt engineering before jumping to larger models."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: Section 3 bên trên — LLM Landscape 2025 (context về các model options và pricing)
- ➡️ Để hiểu tiếp: [AI Engineering Practice](./05-ai-engineering-practice.md) — production cost optimization và monitoring

### 🔴 Q: What are scaling laws and why should engineers care? `[Senior]`

**A:** Scaling laws quan sát rằng performance thường cải thiện có quy luật khi tăng model/data/compute.

- Giúp ước lượng ROI khi nâng cấp model size.
- Không có “free lunch”: cost, latency, và carbon footprint tăng mạnh.
- Với sản phẩm thật, đôi khi model nhỏ + retrieval + caching hiệu quả hơn model cực lớn.

### 🔴 Q: Open-source vs closed-source LLM: how to decide? `[Senior]`

**A:** Dùng khung quyết định gồm compliance, control, TCO, speed-to-market, và talent capacity.

- **Closed-source API:** triển khai nhanh, chất lượng cao, vận hành đơn giản.
- **Open-source/self-host:** kiểm soát dữ liệu và tuning tốt hơn, nhưng gánh MLOps lớn.
- Cân nhắc lock-in, residency, auditability, và đàm phán enterprise contract.

---

## 6. TypeScript Integration Example / Ví dụ tích hợp TypeScript

> 🧠 **Memory Hook:** Gọi LLM API như order đồ ăn online — cần đặt đồng hồ timeout để tránh chờ mãi, cần retry khi mạng xấu, và kiểm tra đơn hàng đúng chưa trước khi trả cho khách.

**Tại sao tồn tại? / Why does this exist?**

LLM API calls khác với REST API thông thường: latency cao (5-30s), rate limits nghiêm ngặt, response có thể malformed, và cost tính theo token. Không wrap đúng cách dẫn đến production incidents, runaway costs, hoặc unhappy users.
→ **Why?** Vì LLM là external dependency với higher variance và cost implications hơn database calls — cần circuit breaker và observability riêng.
→ **Why?** Vì team thường swap provider (OpenAI → Anthropic) hoặc A/B test models — cần abstraction layer để không phải refactor toàn bộ code.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Khi gọi điện đặt hàng, bạn đặt đồng hồ 2 phút — nếu không nghe máy thì thôi (timeout). Bạn ghi lại giá tiền để đối chiếu hóa đơn (token logging). Nếu đường dây bận, bạn gọi lại sau vài phút, không gọi liên tục (retry with backoff). Code gọi LLM API cần làm đúng những việc đó — plus kiểm tra sản phẩm giao đúng quy cách trước khi trả cho khách (output validation).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
LLM Service Layer — Request Flow:

  Client Request
       │
       ▼
  [Input Validation + PII check]
       │
       ▼
  [Prompt Builder → add system prompt, format user input]
       │
       ▼
  [AbortController timeout = 12s]
  [fetch() → LLM Provider API]
       │
       ├─ 429 Rate Limit → exponential backoff + retry
       ├─ Network error → circuit breaker
       └─ Success → parse response
                │
                ▼
         [Validate res.ok, parse JSON]
         [Type-check response schema]
         [Log { model, input_tokens, output_tokens }]
                │
                ▼
         [Output Guardrails: toxicity, format check]
                │
                ▼
  Typed ChatResponse → Client

Key patterns in code below:
  1. AbortController → prevents hanging on slow upstream
  2. try/finally → always clearTimeout, prevent memory leak
  3. Typed return value → compiler enforces response schema
  4. Token usage logging → cost observability at request level
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Streaming responses (SSE): cần handle khác — buffer chunks, detect `[DONE]` sentinel, partial JSON
- Rate limit (429): phải implement exponential backoff + jitter, không retry ngay lập tức
- Context window exceeded: phải truncate prompt hoặc split document — cần estimate token count trước
- Model deprecation: vendor báo trước 3-6 tháng — service layer giúp swap model mà không đụng business logic

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                   | Tại sao sai                                                    | Đúng là                                                                  |
| ----------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `await fetch(url)` không có timeout       | LLM call có thể hang 60s+ → user experience xấu, resource leak | Luôn dùng AbortController với timeout 10-15s, clearTimeout trong finally |
| Hard-code model name trong business logic | Model thay đổi thường xuyên, khó A/B test, khó rollback        | Đưa model name vào config/env — service layer nhận model as parameter    |
| Không log token usage                     | Không biết cost tăng khi traffic tăng → surprise billing       | Log `{ input_tokens, output_tokens }` mỗi request → cost dashboard       |

**🎯 Interview Pattern:**

- Khi thấy: "How would you integrate an LLM into your backend?" hoặc "How do you handle LLM reliability?"
- Nhớ đến: service layer + timeout + retry/circuit breaker + type safety + token logging + provider abstraction
- Mở đầu: "I'd wrap the provider SDK in a service layer with typed schemas, AbortController timeout, token usage logging, and a circuit breaker — this isolates LLM concerns from business logic and makes provider swaps trivial."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: Section 4 bên trên — Inference Concepts (hiểu tokens, latency, và rate limits)
- ➡️ Để hiểu tiếp: [AI Engineering Practice](./05-ai-engineering-practice.md) — full production patterns, monitoring, và guardrails stack

### 🟡 Q: How to call an LLM API safely from TypeScript backend? `[Mid]`

**A:** Nên chuẩn hóa request/response schema, timeout, retry, và logging token usage.

- Bọc provider SDK qua service layer để dễ thay model.
- Áp dụng circuit breaker cho lỗi rate limit hoặc upstream degradation.
- Thêm input/output guardrails trước khi trả về client.

```ts
type ChatRequest = { userId: string; prompt: string };
type ChatResponse = { text: string; model: string; usage: { in: number; out: number } };

export async function runLLM(req: ChatRequest): Promise<ChatResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const res = await fetch("https://api.provider.ai/v1/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-4o-mini", input: req.prompt, temperature: 0.2 }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`LLM upstream failed: ${res.status}`);
    const json = await res.json();
    return {
      text: json.output_text,
      model: json.model,
      usage: { in: json.usage.input_tokens, out: json.usage.output_tokens },
    };
  } finally {
    clearTimeout(timeout);
  }
}
```

---

## 7. Interview Q&A Bank / Ngân hàng câu hỏi phỏng vấn

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #1? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #2? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #3? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #4? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #5? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #6? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #7? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #8? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #9? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #10? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #11? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #12? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #13? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #14? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #15? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #16? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #17? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #18? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #19? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #20? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #21? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #22? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #23? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #24? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #25? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #26? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #27? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #28? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #29? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #30? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #31? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #32? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #33? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #34? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #35? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #36? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #37? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #38? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #39? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #40? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #41? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #42? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #43? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #44? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #45? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #46? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #47? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #48? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #49? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #50? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #51? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #52? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #53? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #54? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #55? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #56? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #57? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #58? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #59? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #60? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #61? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #62? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #63? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #64? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #65? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #66? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #67? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #68? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #69? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #70? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #71? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #72? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #73? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in LLM and transformer scenario #74? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in LLM and transformer scenario #75? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in LLM and transformer scenario #76? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

---

## Interview Q&A Summary / Tổng hợp câu hỏi phỏng vấn

### Q: How does the Transformer attention mechanism work? / Cơ chế attention trong Transformer hoạt động như thế nào? 🟡 Mid

**A:** Self-attention allows each token to attend to all other tokens in the sequence.

```
Input: "The cat sat on the mat"
         ↓ Embed each token

For each token, compute 3 vectors:
  Q (Query)  = "What am I looking for?"
  K (Key)    = "What do I contain?"
  V (Value)  = "What information do I pass forward?"

Attention Score = softmax(Q·Kᵀ / √d_k) · V

Step by step for token "cat":
1. Q_cat · K_sat → score (how much "cat" should attend to "sat")
2. Q_cat · K_the → score
3. ... for all tokens
4. softmax(scores) → attention weights (sum to 1.0)
5. Weighted sum of V vectors → new representation of "cat"

√d_k scaling: prevents dot products from getting too large
  → which would push softmax into saturation (near-zero gradients)
```

**Multi-Head Attention:**

```
Instead of 1 attention head, use H heads in parallel:
├── Each head learns different relationship types
│   - Head 1: syntactic dependencies ("cat" ← "sat")
│   - Head 2: coreference ("it" ← "cat")
│   - Head 3: positional relationships
├── Concatenate all heads → linear projection
└── d_model = H × d_head (e.g., 512 = 8 × 64)
```

**Complexity:** O(n²) in sequence length — bottleneck for long contexts. Solutions: sparse attention (Longformer), linear attention, sliding window (Mistral).

**Điểm then chốt:** Attention = "weighted lookup" — mỗi token tổng hợp thông tin từ tất cả token khác dựa trên relevance. Multi-head cho phép model học nhiều loại relationship song song.

### Q: What is the difference between GPT, BERT, and T5 architectures? / Sự khác biệt giữa GPT, BERT, T5? 🟡 Mid

**A:**

```
Architecture Comparison:
              GPT            BERT           T5
Type:         Decoder-only   Encoder-only   Encoder-Decoder
Attention:    Causal (mask   Bidirectional  Both
              future tokens)
Pretraining:  Next-token     Masked LM      Text-to-Text
              prediction     + NSP          ("prefix: input → output")
Best for:     Generation     Classification All NLP tasks (unified)
              (chat, code)   (sentiment,    (translation, QA,
                             NER, QA)       summarization)

Examples:
  GPT family: GPT-4, Claude, Llama, Mistral, Gemini
  BERT family: BERT, RoBERTa, DistilBERT, DeBERTa
  T5 family: T5, FLAN-T5, mT5

Why decoder-only dominates now:
├── Simpler training objective (just predict next token)
├── Scales better with data and compute
├── In-context learning emerges at scale
└── Can do classification, QA etc via prompting
```

**Cách nhớ:** GPT = generate text left-to-right (biết past, không thấy future). BERT = understand context fully (thấy cả past và future, nhưng không generate tốt). T5 = unify mọi task thành text→text. Modern LLMs mostly GPT-style decoder-only.

### Q: What is fine-tuning vs prompt engineering vs RAG? When to use each? / Khi nào dùng fine-tuning vs prompt engineering vs RAG? 🔴 Senior

**A:**

```
Approach Comparison:
                  Prompt Eng    RAG              Fine-tuning
Cost:             Very low      Medium           High (GPU, data)
Latency:          Low           Medium (+retrieval) Low
Data needed:      None          Documents        100s-10000s examples
Knowledge:        Baked in LLM  External DB      Baked into weights
Updates:          Instant       Update docs      Retrain/re-finetune
Best for:         Format/style  Fresh knowledge  Tone/domain adapt
                  instructions  (docs, KB)       task-specific behavior

Decision flowchart:
  Can the base model do the task with good prompting?
  → YES: use prompt engineering
  → NO: Does the model need access to specific documents/data?
         → YES: use RAG
         → NO: Does the model need to behave differently (tone, format, domain)?
                → YES: fine-tune
                → NO: re-evaluate the problem
```

**Fine-tuning techniques:**

```
Full fine-tuning: update ALL parameters — expensive, risk of catastrophic forgetting
LoRA (Low-Rank Adaptation):
├── Insert low-rank matrices ΔW = A·B (r << d)
├── Only train A, B (millions vs billions params)
├── Merge back at inference: W' = W + ΔW (no latency cost)
└── QLoRA: quantize base model to 4-bit, LoRA adapters in fp16 → fits on 1 GPU
```

**RAG vs Fine-tuning in production:**

- RAG for frequently changing information (news, product catalog)
- Fine-tune for consistent behavior, style, format (customer service bot with specific tone)
- Often combine both: fine-tune for behavior + RAG for knowledge

**Điểm senior quan trọng:** Start with prompting, move to RAG if knowledge gap, fine-tune only when behavior/style needs to change permanently. LoRA/QLoRA là standard cho fine-tuning với budget giới hạn.

### Q: What are common LLM failure modes and how do you handle them? / Các failure mode của LLM và cách xử lý? 🔴 Senior

**A:**

```
Failure Mode 1: Hallucination
├── Definition: model generates factually incorrect but confident-sounding text
├── Causes: training data errors, knowledge gaps, over-extrapolation
├── Mitigations:
│   - RAG: ground answers in retrieved documents
│   - Self-consistency: sample multiple responses, take majority
│   - Citation requirement: force model to cite sources
│   - Confidence calibration: ask model to express uncertainty
└── Eval: factuality benchmarks (TruthfulQA, FActScorE)

Failure Mode 2: Context window limits
├── Problem: long documents exceed context length
├── Mitigations:
│   - Chunking + RAG (most common)
│   - Hierarchical summarization
│   - Long-context models (128k-1M tokens) — but attend poorly to middle
└── "Lost in the middle" phenomenon: info at beginning/end recalled better

Failure Mode 3: Prompt injection
├── Malicious input overrides system prompt ("ignore previous instructions...")
├── Mitigations:
│   - Input sanitization
│   - Separate system/user prompts clearly
│   - Output validation + guardrails (Llama Guard, NeMo Guardrails)
└── Defense in depth: multiple layers of validation

Failure Mode 4: Inconsistency / Non-determinism
├── Same prompt → different outputs
├── Mitigations: temperature=0 for deterministic tasks
└── Self-consistency voting for reasoning tasks

Failure Mode 5: Prompt sensitivity
├── Small wording changes → dramatically different outputs
├── Mitigation: few-shot examples, chain-of-thought, structured output (JSON mode)
```

**Production guardrails stack:**

```
Input → [Prompt injection check] → [PII redaction] → LLM
                                                        ↓
Output ← [Factuality check] ← [Toxicity filter] ← [Format validation]
```

**Điểm interview:** Hallucination là failure mode phổ biến nhất được hỏi. RAG + citation + self-consistency là bộ 3 giải pháp chính. Biết rõ lost-in-the-middle problem khi dùng long context.

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **Interviewer:** "Explain how the attention mechanism works in transformers — explain it in 30 seconds."

**Ideal 30-second answer / Câu trả lời 30 giây:**

1. Attention mechanism cho phép mỗi token "attend" đến tất cả các token khác trong sequence để capture context theo cách động.
2. Cơ chế: mỗi token tạo Query, Key, Value vectors → dot product Q·Kᵀ → softmax → weighted sum of Values.
3. Ví dụ: trong "The cat sat on the mat", khi process "sat", attention focus vào "cat" (subject) với trọng số cao nhất.
4. Trade-off: self-attention là O(n²) theo sequence length — tốn memory với long contexts, nhưng fully parallelizable (nhanh hơn RNN).

---

## Self-Check / Tự Kiểm Tra

| #   | Loại           | Câu hỏi                                                                                                                                    |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 🔍 Retrieval   | Attention mechanism làm gì? Giải thích bằng ngôn ngữ đời thường không dùng công thức toán học.                                             |
| 2   | 🎨 Visual      | Vẽ sơ đồ Q, K, V attention flow cho token "cat" trong câu "the cat sat on the mat" — chỉ ra token nào nhận trọng số cao nhất.              |
| 3   | 🛠️ Application | In-context learning (few-shot prompting) khác fine-tuning ở điểm nào? Cho ví dụ khi nào nên dùng cái nào trong production.                 |
| 4   | 🐛 Debug       | User báo chatbot Momo trả lời sai phí ngân hàng. Debug bằng cách nào, root cause là gì, và fix ra sao để tránh tái phát?                   |
| 5   | 🎓 Teach       | Giải thích "lost-in-the-middle" problem cho junior developer chưa biết về LLM — và tại sao nó ảnh hưởng cách bạn thiết kế RAG chunk order. |

💬 **Feynman Prompt:** Giải thích tại sao LLM không thể "just search the internet" to answer — và tại sao RAG là better architecture than training model on live data.

---

## 🔁 Spaced Repetition / Lịch Ôn Tập

| Review | Date     | Focus                                        |
| ------ | -------- | -------------------------------------------- |
| Day 1  | Today    | Full read + highlight Memory Hooks           |
| Day 3  | +3 days  | Cold Call + Self-Check only                  |
| Day 7  | +7 days  | Q&A bank (cover answers, recall from memory) |
| Day 14 | +14 days | Teach someone / Feynman technique            |
| Day 30 | +30 days | Mock interview practice                      |

## Connections / Liên Kết

- ⬅️ **Built on**: [ML Fundamentals](./01-ml-fundamentals.md) — neural networks are the foundation
- ➡️ **Applied in**: [RAG & Embeddings](./04-rag-and-embeddings.md) — RAG is the primary hallucination mitigation
- ➡️ **Applied in**: [AI Engineering Practice](./05-ai-engineering-practice.md) — prompt engineering for LLMs
- 🔗 **Related**: [Agent Patterns](./03-agent-patterns.md) — LLMs are the reasoning engine for agents
