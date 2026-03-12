# LLM and Transformers — Mô hình ngôn ngữ lớn và Transformer

> **Track**: Shared | **Difficulty**: 🟡 Mid → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

---

## 1. Large Language Models / LLM là gì

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
    const res = await fetch('https://api.provider.ai/v1/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini', input: req.prompt, temperature: 0.2 }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`LLM upstream failed: ${res.status}`);
    const json = await res.json();
    return { text: json.output_text, model: json.model, usage: { in: json.usage.input_tokens, out: json.usage.output_tokens } };
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
