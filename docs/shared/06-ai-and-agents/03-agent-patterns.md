# Agent Patterns — Mẫu thiết kế AI Agents

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Shopee customer service agent (thực tế):** LLM-powered agent có thể: (1) check order status via API tool, (2) initiate refund via payment tool, (3) escalate to human if confidence < 80%. Vấn đề ban đầu: agent loop vô hạn khi API timeout — agent cứ retry refund tool mà không có step limit. Fix: max 5 tool calls per conversation, timeout cho mỗi tool call, human handoff khi uncertain. Result: 70% queries resolved automatically, 0 infinite loop incidents.

**Bài học:** Agent patterns không phải "just call LLM with tools" — cần: step limits, error handling, observability, và human-in-the-loop. Production agents fail in creative ways that need systematic safeguards.

## What & Why / Cái Gì & Tại Sao

**Analogy:** AI Agent giống robot thực hiện task: LLM là "não" (reasoning), tools là "tay" (actions), memory là "sổ tay" (context). ReAct pattern là "nghĩ → hành động → quan sát → nghĩ lại" — như người giải quyết vấn đề step by step. Không có guardrails, robot có thể đi vào vòng lặp vô tận.

**Why it matters:** Agent-based AI features đang được build tại mọi tech company. Backend developer được expect biết ReAct pattern, tool calling, và failure modes để implement và debug agent workflows.

---

## 1. What is an AI Agent? / AI Agent là gì

> 🧠 **Memory Hook:** Agent AI như xe ôm GrabBike: có não (LLM) biết đường, có tay (tools) cầm điện thoại, có sổ (memory) ghi địa chỉ — nhưng không có giới hạn thì cứ chạy vòng mãi không về!

**Tại sao tồn tại? / Why does this exist?**

LLM thuần (pure LLM) chỉ trả lời câu hỏi một lần dựa trên kiến thức đã học — nó không thể tự đặt câu hỏi tiếp theo, gọi API, hay lưu trạng thái. Task thực tế thường gồm nhiều bước liên kết cần lặp lại.
→ **Why?** Task thực tế cần nhiều bước liên kết: tìm thông tin → xử lý → ra quyết định → thực thi → kiểm tra kết quả — không thể hoàn thành trong một lần generate.
→ **Why?** Con người làm việc qua vòng lặp "nhận thông tin → suy nghĩ → hành động → quan sát kết quả"; AI cũng cần cơ chế tương tự để xử lý task phức tạp trong thế giới thực.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng bạn nhờ một người bạn thông minh giúp đặt vé máy bay. Thay vì chỉ nói "tôi biết cách đặt vé", người bạn đó sẽ: mở máy tính (tool), tra lịch bay (search), điền form (action), rồi báo lại kết quả (output). AI Agent làm đúng như vậy — không chỉ "biết" mà còn "làm" được. Nhưng nếu không có người kiểm soát, anh bạn đó có thể cứ refresh trang mãi khi không tìm thấy vé!

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Agent = LLM (não) + Tools (tay) + Memory (sổ tay)

Lilian Weng Framework:
┌──────────────────────────────────────────────┐
│                  AI AGENT                    │
│                                              │
│  Planning        Memory         Tool Use     │
│  ──────────     ──────────     ──────────    │
│  Goal→Steps     Short-term:    APIs          │
│  Prioritize     Context        DB queries    │
│  Re-plan        Long-term:     Browser       │
│                 Vector DB      Code Exec     │
└──────────────────────────────────────────────┘

Workflow vs Agent:
Workflow: A → B → C → D  (developer lập trình từng bước)
Agent:    A → ?          (agent tự quyết bước tiếp theo)
                ↓
         Autonomy spectrum:
         [Workflow] ──────────────────── [Full Agent]
          Predictable               Flexible
          Low risk                  High risk
          Easy test                 Hard to predict
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Agent với full autonomy có thể đưa ra quyết định sai mà không có cơ chế kiểm tra (hallucination + action)
- Context window có giới hạn — agent chạy lâu cần memory management strategy hoặc sẽ "quên" context đầu
- Anthropic khuyến nghị: bắt đầu workflow đơn giản, chỉ tăng autonomy khi có evidence cần — đừng over-engineer
- Tool với side effects (xóa file, gửi email, charge thẻ) cần human approval trước khi thực thi trong production

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                       | Tại sao sai                                                         | Đúng là                                                                               |
| ----------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Coi agent = LLM + tools là đủ | Thiếu memory và planning → agent không nhớ context, lặp lại bước cũ | Agent = Planning + Memory + Tool Use, cả 3 phải cân bằng                              |
| Dùng agent cho mọi task       | Agent thêm latency, cost, failure modes không cần thiết             | Chỉ dùng agent khi task có branching/long-horizon; dùng simple prompt cho task 1 bước |
| Không set autonomy boundary   | Agent có thể thực thi action nguy hiểm (xóa DB, spam email)         | Phân biệt rõ workflow (fixed) và agent (autonomous) dựa trên risk level của từng task |

**🎯 Interview Pattern:**

- Khi thấy: câu hỏi "explain AI agent" hoặc "what is the difference between workflow and agent"
- Nhớ đến: Lilian Weng's 3-component framework (Planning + Memory + Tool Use) + Anthropic's autonomy spectrum
- Mở đầu: "An AI agent combines an LLM as the reasoning core with three key capabilities: planning to decompose goals, memory to retain context, and tool use to act on the world — the key distinction from a workflow is that the agent decides its own next steps rather than following a fixed path."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [LLM & Transformers](./02-llm-and-transformers.md) — LLM là reasoning engine của agent
- ➡️ Để hiểu tiếp: [Anthropic Canonical Patterns](#2-anthropic-canonical-patterns--5-mẫu-agentic-chuẩn) — các mẫu thiết kế cụ thể để implement agent

### 🟢 Q: What is the difference between workflows and agents (Anthropic framing)? `[Junior]`

**A:** Workflow là luồng cố định do developer lập trình; agent có mức tự chủ để quyết định bước tiếp theo.

- **Workflow:** predictable, dễ test, tốt cho quy trình ổn định.
- **Agent:** linh hoạt khi nhiệm vụ mơ hồ, nhiều nhánh, cần tool use động.
- Anthropic khuyến nghị bắt đầu từ workflow đơn giản trước khi tăng autonomy.

### 🟡 Q: Explain Lilian Weng's agent framework: Planning + Memory + Tool Use. `[Mid]`

**A:** Khung này xem agent như một hệ thống gồm ba năng lực lõi.

- **Planning:** phân rã mục tiêu lớn thành bước nhỏ có thứ tự.
- **Memory:** lưu ngắn hạn (context) và dài hạn (knowledge/state) để tránh lặp.
- **Tool Use:** gọi API, DB, code executor, browser để tác động thế giới bên ngoài.
- Hệ tốt cần cân bằng cả ba, không chỉ “prompt dài hơn”.

---

## 2. Anthropic Canonical Patterns / 5 mẫu agentic chuẩn

> 🧠 **Memory Hook:** 5 mẫu Anthropic như 5 kiểu bếp ăn Việt Nam: nấu từng món theo thứ tự (prompt chaining), chọn bếp theo loại món (routing), nấu song song nhiều nồi (parallelization), bếp trưởng phân công phụ bếp (orchestrator-workers), thử nếm → chỉnh → thử lại (evaluator-optimizer)!

**Tại sao tồn tại? / Why does this exist?**

LLM đơn lẻ có giới hạn token và không tự nhiên chia nhỏ task phức tạp — prompt dài hơn không phải lúc nào cũng cho kết quả tốt hơn. Cần các pattern có cấu trúc để xử lý bài toán đa bước, đa nhánh, yêu cầu chất lượng cao.
→ **Why?** Không có một cách làm duy nhất — task tuyến tính, phân nhánh, song song, và lặp lại cần chiến lược kiến trúc riêng phù hợp.
→ **Why?** Anthropic đúc kết 5 pattern từ production experience để team chọn đúng pattern ngay từ đầu, tránh over-engineer hay under-engineer hệ thống.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Coi 5 pattern như 5 cách tổ chức công việc trong một văn phòng. Đôi khi bạn làm tuần tự từng bước (prompt chaining). Đôi khi bạn chuyển task cho người phù hợp (routing). Đôi khi cả nhóm cùng làm song song (parallelization). Đôi khi quản lý phân công cho phụ và tổng hợp lại (orchestrator-workers). Đôi khi bạn viết → sếp sửa → bạn viết lại (evaluator-optimizer) — mỗi tình huống cần cách tổ chức khác nhau.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
1. Prompt Chaining (tuần tự có gate):
   Input → [LLM-1] → Gate? ──FAIL──→ Stop/Retry
                        │ PASS
                        ↓
                    [LLM-2] → Gate? ──FAIL──→ Stop/Retry
                        │ PASS
                        ↓
                     Output

2. Routing (phân loại → chuyên gia):
   Input → [Classifier] → billing? → [Billing Agent]
                        → bug?     → [Code Agent]
                        → other?   → [Fallback Agent]

3. Parallelization:
   Sectioning: BigDoc → [Part1][Part2][Part3] → Merge
   Voting:     Query  → [Run1][Run2][Run3]    → Consensus

4. Orchestrator-Workers:
   Task → [Orchestrator] → spawn [W1][W2][W3]
                        ← collect + validate results
                        → synthesize final output

5. Evaluator-Optimizer (vòng lặp):
   Draft → [Evaluator] → score < threshold?
                        → [Refine] ──────────┐
                        ↑ score OK            │
                        └─────────────────────┘
                        → Output (khi đạt hoặc max_iter)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Prompt chaining: gate quá strict → reject input hợp lệ; gate quá lỏng → lỗi lan truyền và khuếch đại qua từng step
- Routing: confidence threshold sai → nhầm route; không có fallback route → crash khi gặp edge case không biết
- Parallelization: merge strategy phải deterministic, nếu không output sẽ không ổn định giữa các lần chạy
- Orchestrator-workers: cần contract rõ (input/output JSON schema) cho mỗi worker, không thì orchestrator không parse được kết quả
- Evaluator-optimizer: không có max_iterations → infinite loop và cost bùng nổ; evaluator tệ → optimize sai hướng mà không biết

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                  | Tại sao sai                                                                                | Đúng là                                                                                 |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Mặc định dùng orchestrator-workers cho mọi task phức tạp | Tăng cost và latency không cần thiết, phức tạp hóa vấn đề                                  | Chọn pattern đơn giản nhất đủ dùng: prompt chaining trước, escalate khi thực sự cần     |
| Không có gate trong prompt chaining                      | Lỗi bước 1 lan truyền và khuếch đại qua các bước sau, output cuối sai không rõ nguyên nhân | Mỗi step cần validation criterion rõ ràng trước khi pass sang step tiếp theo            |
| Evaluator-optimizer không có stop condition              | Agent loop vô hạn khi evaluator và optimizer không converge, cost bùng nổ                  | Luôn set max_iterations và định nghĩa fallback behavior khi không converge trong N vòng |

**🎯 Interview Pattern:**

- Khi thấy: "design an agent to handle [complex task]" hoặc "how would you structure this multi-step workflow"
- Nhớ đến: 5 Anthropic patterns + khi nào dùng cái nào (complexity vs cost vs latency trade-off)
- Mở đầu: "I'd start by identifying whether this task is sequential, has branching decisions, benefits from parallelism, or needs iterative refinement — then map it to the appropriate Anthropic pattern. The principle is always start simple and add complexity only when there's evidence it's needed."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [AI Agent là gì](#1-what-is-an-ai-agent--ai-agent-là-gì) — hiểu agent trước khi chọn pattern thiết kế
- ➡️ Để hiểu tiếp: [Reasoning Patterns](#3-reasoning-patterns--mẫu-suy-luận) — cơ chế suy luận bên trong mỗi pattern

### 🟡 Q: Pattern 1: What is prompt chaining with gates? `[Mid]`

**A:** Prompt chaining chia bài toán thành chuỗi bước tuần tự, mỗi bước có tiêu chí đạt/chưa đạt.

- B1: tóm tắt yêu cầu.
- B2: tạo phương án.
- B3: kiểm tra chính sách/format.
- Gate giúp chặn lỗi lan truyền và tăng reliability.

### 🟡 Q: Pattern 2: What is routing? `[Mid]`

**A:** Routing phân loại yêu cầu rồi chuyển đến prompt/model/tool phù hợp.

- Ví dụ: câu hỏi billing → policy agent; bug code → coding agent.
- Lợi ích: giảm cost vì không cần model “to” cho mọi request.
- Cần fallback route khi confidence thấp.

### 🟡 Q: Pattern 3: What is parallelization (sectioning and voting)? `[Mid]`

**A:** Parallelization chạy nhiều nhánh đồng thời để giảm thời gian hoặc tăng chất lượng.

- **Sectioning:** chia tài liệu lớn thành phần nhỏ để xử lý song song.
- **Voting:** nhiều lời giải độc lập, rồi chọn đáp án đồng thuận.
- Cần deterministic merge strategy để tránh output không ổn định.

### 🔴 Q: Pattern 4: How does orchestrator-workers work? `[Senior]`

**A:** Orchestrator phân tích nhiệm vụ, spawn workers chuyên trách, rồi tổng hợp kết quả.

- Hợp với bài toán phức tạp có nhiều subtask độc lập.
- Cần contract rõ: input/output schema cho từng worker.
- Quản lý retry, timeout, budget theo worker để tránh runaway cost.

### 🔴 Q: Pattern 5: What is evaluator-optimizer loop? `[Senior]`

**A:** Đây là vòng generate → evaluate → refine cho đến khi đạt tiêu chí dừng.

- Evaluator có thể là model khác hoặc rule-based checker.
- Dùng tốt cho coding, writing, reasoning cần chất lượng cao.
- Cần max-iterations để tránh loop vô hạn và bùng chi phí.

---

## 3. Reasoning Patterns / Mẫu suy luận

> 🧠 **Memory Hook:** ReAct như học sinh thi toán: Nghĩ ("cần tính diện tích") → Làm ("tra công thức hình thang") → Xem kết quả → Nghĩ tiếp. CoT đi thẳng một đường giải; ToT thử nhiều nhánh như tìm đường trong mê cung Bến Thành!

**Tại sao tồn tại? / Why does this exist?**

LLM không có bộ nhớ ngắn hạn hay khả năng tự sửa lỗi tự nhiên — nó tạo output một lần rồi thôi, không biết kết quả đúng hay sai. Cần reasoning patterns để LLM "suy nghĩ có hệ thống" và kết hợp thông tin từ tools thay vì hallucinate.
→ **Why?** Bài toán phức tạp cần nhiều bước suy luận trung gian — một lần generate duy nhất không đủ độ chính xác, đặc biệt với toán học và multi-hop reasoning.
→ **Why?** Kết hợp reasoning với action (thu thập data thật qua tools) giúp giảm hallucination vì LLM phải dựa trên observation thực tế thay vì "bịa" câu trả lời từ training data.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

CoT như làm bài toán trên giấy nháp: viết từng bước tính ra để tránh nhầm, thầy cô cũng thấy được quá trình. ToT như chơi cờ tướng: thử nhiều nước đi có thể, đánh giá nước nào tốt nhất rồi mới đi. ReAct như thám tử Conan: suy luận → đi thu thập bằng chứng thật → suy luận lại dựa trên bằng chứng → đưa ra kết luận — không "đoán mò" mà phải có evidence.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Chain of Thought (CoT) — một đường suy luận:
Q: "Shopee có 100 đơn. 30% bị delay. Bao nhiêu đơn đúng hạn?"
→ Step 1: 30% bị delay = 100 × 0.3 = 30 đơn bị delay
→ Step 2: Đúng hạn = 100 - 30 = 70 đơn
→ Answer: 70 đơn giao đúng hạn

Tree of Thoughts (ToT) — nhiều nhánh + đánh giá:
                    [Problem]
                   /    |    \
             [Path A] [Path B] [Path C]
             score:5  score:3  score:9  ← đánh giá
                                  |
                         [Path C1][Path C2]
                         score:6  score:10 ← đánh giá
                                     |
                                 [Solution] ✅

ReAct Loop — reasoning + grounded action:
  Thought:  "Cần so sánh giá Grab vs Gojek tại TP.HCM"
  Action:   search("Grab vs Gojek price HCM 2024")
  Obs:      "Grab: 12k/km, Gojek: 10k/km theo Tiki blog"
  Thought:  "Gojek rẻ hơn 17%, cần kiểm tra rating"
  Action:   search("Gojek rating HCM user review")
  Obs:      "Gojek: 4.2★, Grab: 4.7★ trên App Store"
  Thought:  "Đã có đủ dữ liệu để so sánh toàn diện"
  Answer:   "Gojek rẻ hơn 17% nhưng Grab có rating tốt hơn"
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- ReAct có thể lặp vô tận nếu tool không trả về kết quả hữu ích — cần max_steps và graceful degradation
- CoT tốt cho toán học và logic nhưng không giúp nếu model không có kiến thức cần thiết trong training data
- ToT chi phí compute tăng exponentially với depth và branching factor — thực tế hiếm khi dùng depth > 3
- ToT cần scoring heuristic tốt — heuristic sai thì prune nhầm nhánh đúng, kết quả tệ hơn CoT đơn giản

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                  | Tại sao sai                                                                                  | Đúng là                                                                                      |
| ---------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Dùng ToT cho mọi bài toán phức tạp       | ToT cực kỳ tốn kém, chỉ hợp khi search space lớn và có nhiều lời giải đối lập cần đánh giá   | Mặc định CoT, chỉ dùng ToT khi bài toán có nhiều lời giải đối lập và cost chấp nhận được     |
| Không kiểm soát ReAct loop               | Agent retry mãi khi tool lỗi hoặc trả về kết quả không hữu ích, gây infinite loop tốn token  | Đặt max_steps, timeout per tool call, và fallback response rõ ràng khi không resolve được    |
| Nhầm "Let's think step by step" = đủ CoT | Prompt đó trigger CoT nhưng không guarantee chất lượng reasoning, đặc biệt với task phức tạp | Dùng few-shot examples với reasoning chain rõ ràng để guide model theo đúng format mong muốn |

**🎯 Interview Pattern:**

- Khi thấy: "how does the agent reason step by step" hoặc "what is ReAct pattern"
- Nhớ đến: Thought→Action→Observation loop, grounded trong real tool results thay vì pure parametric knowledge
- Mở đầu: "ReAct interleaves reasoning traces with tool actions — the LLM thinks about what it needs, calls a tool to get real data, observes the result, then reasons again. This grounds the reasoning in real observations and significantly reduces hallucination compared to chain-of-thought alone."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Anthropic Canonical Patterns](#2-anthropic-canonical-patterns--5-mẫu-agentic-chuẩn) — patterns là outer structure, reasoning patterns là inner mechanism
- ➡️ Để hiểu tiếp: [Tool Use and Function Calling](#4-tool-use-and-function-calling--gọi-công-cụ) — ReAct cần tools để thực hiện Action steps

### 🟡 Q: What is ReAct (Thought → Action → Observation)? `[Mid]`

**A:** ReAct kết hợp suy nghĩ và hành động tool trong cùng vòng lặp.

- Thought: agent lập kế hoạch bước kế.
- Action: gọi tool (search, DB, API).
- Observation: đọc kết quả tool rồi điều chỉnh.
- Ưu điểm: giảm hallucination vì dựa vào dữ kiện thu thập thật.

### 🟡 Q: Chain of Thought vs Tree of Thoughts? `[Mid]`

**A:** CoT đi theo một chuỗi suy luận; ToT mở nhiều nhánh rồi đánh giá nhánh tốt.

- CoT đơn giản, rẻ hơn, phù hợp đa số task vừa phải.
- ToT mạnh ở bài toán tìm kiếm không gian lời giải lớn.
- ToT cần scoring heuristic và beam width để kiểm soát compute.

---

## 4. Tool Use and Function Calling / Gọi công cụ

> 🧠 **Memory Hook:** Function calling như đặt đồ ăn qua ShopeeFood: bạn chọn món theo menu (schema), bếp nấu theo đơn (executor), app validate đơn trước khi gửi bếp — không validate thì bếp nhận order "phở + pizza" mà không biết làm gì!

**Tại sao tồn tại? / Why does this exist?**

LLM chỉ có kiến thức đã học (parametric knowledge), không thể truy cập real-time data hay thực thi action thật trong thế giới. Cần interface có cấu trúc để model tương tác với hệ thống bên ngoài một cách an toàn.
→ **Why?** Task thực tế cần data mới nhất (giá cổ phiếu, trạng thái đơn hàng), tính toán chính xác, hay side effects thật (gửi email, update DB) — LLM không thể "bịa" những thứ này.
→ **Why?** Nếu LLM tự hallucinate data thay vì gọi tool, kết quả sẽ sai và không thể verify — function calling tạo structured interface để model tương tác có kiểm soát, và validation trước execute ngăn input rác vào hệ thống.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng bạn là quản lý nhà hàng. Khi khách gọi "một tô phở", bạn không tự nấu mà viết phiếu đặt (tool call schema) và chuyển cho bếp (executor). Bếp nấu xong báo lại (observation), bạn mang ra bàn (final response). Nếu phiếu đặt viết sai hay thiếu thông tin (invalid args), bếp không làm được — vì vậy phải validate phiếu trước khi gửi vào bếp, không phải sau.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Function Calling Flow (4 bước chuẩn):

Step 1: Developer cung cấp tool schema cho LLM
  { "name": "check_order",
    "description": "Check Shopee order status",
    "params": { "order_id": "string", "user_id": "string" } }

Step 2: User gửi request
  "Đơn hàng #VN12345 của tôi đến đâu rồi?"

Step 3: LLM quyết định gọi tool + fill args
  { "tool": "check_order",
    "args": { "order_id": "VN12345", "user_id": "usr_789" } }

Step 4: Backend VALIDATE args TRƯỚC khi execute ✅
  ✅ order_id: string, matches pattern VN[0-9]+ → OK
  ✅ user_id:  string, exists in DB              → OK
  ❌ nếu invalid → trả error message cho LLM để retry

Step 5: Execute tool → result
  { "status": "Đang giao", "eta": "15:30", "carrier": "Ninja Van" }

Step 6: LLM nhận kết quả, tạo câu trả lời tự nhiên
  "Đơn hàng #VN12345 đang được giao, dự kiến đến lúc 15:30 hôm nay."

Best Practices:
  ├── One tool = one responsibility (SRP)
  ├── Idempotent writes: safe to retry without side effects
  ├── Read tools ≠ Write tools (separate authorization)
  └── Attach trace ID mỗi tool call → observability
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Tool schema quá phức tạp hoặc quá nhiều tools → model không biết chọn tool nào, fill args sai
- Không validate args trước execute → lỗi runtime với input rác từ model, khó debug nguyên nhân
- Write tools không idempotent → retry khi network lỗi gây double-charge, duplicate email, duplicate DB insert
- Thiếu observability (trace ID, latency, status) → không debug được khi agent fail ở step nào trong chuỗi

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                                                       | Đúng là                                                                                        |
| -------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Trust raw model output trực tiếp vào execute | Model có thể hallucinate args ngoài range hợp lệ (enum sai, số âm, SQL injection) | Luôn validate schema (type, range, enum, format) trước khi call executor                       |
| Một "God tool" làm nhiều việc                | Model khó chọn đúng action, args phức tạp, lỗi khó isolate khi debug              | Mỗi tool một trách nhiệm rõ ràng — single responsibility principle áp dụng cho tools           |
| Không phân biệt read/write tools             | Write tool bị call accidental → side effects nguy hiểm không reversible           | Read tools cho phép tự do; write tools cần explicit confirmation hoặc restricted authorization |

**🎯 Interview Pattern:**

- Khi thấy: "how do agents interact with external systems" hoặc "what is function calling and how does it work"
- Nhớ đến: schema → model decides → **validate** → execute → observe → synthesize (validation là bước critical nhất)
- Mở đầu: "Function calling gives the LLM a structured interface to external systems. The critical step people miss is validating args before execution — never trust the model's output directly into your system. You also want to separate read tools from write tools and make writes idempotent for safe retries."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Reasoning Patterns](#3-reasoning-patterns--mẫu-suy-luận) — tool use là "Action" step trong vòng lặp ReAct
- ➡️ Để hiểu tiếp: [Multi-Agent Systems](#5-multi-agent-systems--hệ-đa-tác-nhân) — nhiều agent cùng share và call tools trong hệ phức tạp

### 🟢 Q: How does function calling flow work? `[Junior]`

**A:** Luồng chuẩn gồm 4 bước: schema → model chọn tool → executor chạy tool → model tổng hợp.

- Bạn cung cấp JSON schema rõ ràng cho mỗi tool.
- Model trả về tool name + arguments đã parse.
- Backend validate arguments trước khi thực thi.
- Kết quả tool quay lại context để model tạo câu trả lời cuối.

### 🔴 Q: What are best practices for tool design? `[Senior]`

**A:** Thiết kế tool tốt làm giảm hallucination và giảm lỗi runtime.

- Interface nhỏ, rõ ràng, một trách nhiệm.
- Strong schema validation + enum/range constraints.
- Idempotent operations cho action có thể retry.
- Attach trace IDs để observability xuyên suốt vòng agent.
- Tách read tools và write tools để kiểm soát quyền.

### 🟡 Q: TypeScript example for tool execution guardrails? `[Mid]`

**A:** Ví dụ sau minh họa parse an toàn trước khi gọi hệ thống thật.

- Dùng schema validation để chặn input xấu từ model.
- Log đầy đủ tool name, args hash, latency, status.

```ts
type WeatherArgs = { city: string; unit: "C" | "F" };

function validateWeatherArgs(raw: unknown): WeatherArgs {
  if (!raw || typeof raw !== "object") throw new Error("invalid args");
  const v = raw as Record<string, unknown>;
  if (typeof v.city !== "string" || !v.city.trim()) throw new Error("city required");
  if (v.unit !== "C" && v.unit !== "F") throw new Error("unit invalid");
  return { city: v.city, unit: v.unit };
}

export async function runWeatherTool(rawArgs: unknown) {
  const args = validateWeatherArgs(rawArgs);
  return fetchWeatherFromProvider(args.city, args.unit);
}
```

---

## 5. Multi-Agent Systems / Hệ đa tác nhân

> 🧠 **Memory Hook:** Hệ đa agent như bệnh viện Chợ Rẫy: bác sĩ tổng quát (orchestrator) tiếp nhận bệnh nhân rồi chuyển chuyên khoa tim mạch, X-quang, xét nghiệm (workers) — hiệu quả hơn một bác sĩ làm hết, nhưng cần điều phối và giao tiếp chuẩn!

**Tại sao tồn tại? / Why does this exist?**

Một agent duy nhất bị giới hạn bởi context window, không thể chuyên sâu vào nhiều lĩnh vực cùng lúc, và không thể tự kiểm tra chéo output của chính mình một cách độc lập. Task phức tạp vượt quá giới hạn này.
→ **Why?** Task phức tạp thường có nhiều subtask độc lập có thể chạy song song — một agent tuần tự mất nhiều thời gian hơn cần thiết và bị giới hạn bởi context window đơn lẻ.
→ **Why?** Phân công chuyên môn (researcher vs writer vs critic) giúp mỗi agent có prompt ngắn, rõ, ít nhiễu — tăng chất lượng output tổng thể vì mỗi agent không bị "confuse" bởi nhiều vai trò cùng lúc.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Nghĩ về một dự án làm báo cáo lớn cho công ty. Thay vì một người làm tất cả (thu thập data, phân tích, viết, kiểm tra lỗi), bạn có một nhóm: người research, người phân tích, người viết, người review. Mỗi người chuyên việc của mình, làm song song khi có thể, và team lead (orchestrator) tổng hợp kết quả. Nhanh hơn và chất lượng cao hơn — nhưng cần coordinator giỏi và communication chuẩn.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
3 Kiến trúc đa agent:

1. Orchestrator-Workers (phổ biến nhất):
   User
    ↓
   [Orchestrator] ← phân tích task, tạo subtasks
    ├──→ [Worker 1: Research]  ──┐
    ├──→ [Worker 2: Analysis]  ──┼→ [Orchestrator] → Synthesis
    └──→ [Worker 3: Writing]   ──┘
   Dùng khi: task có nhiều subtask độc lập, cần budget control

2. Peer Debate (chất lượng reasoning cao):
   [Agent A] ──propose──→ [Agent B]
   [Agent A] ←──critique── [Agent B]
   [Agent A] ──refine───→ [Agent B]
   ... → Consensus answer
   Dùng khi: cần quality cao, bài toán phức tạp, catch errors

3. Role-Based Team (gần giống tổ chức):
   [PM Agent] → requirements
       ↓
   [Engineer Agent] → implementation
       ↓
   [Reviewer Agent] → feedback
       ↑___________________|
   Dùng khi: workflow gần giống business process thật

Trade-offs vs Single Agent:
  Latency:   sequential pipeline tệ nhất; parallel tốt hơn
  Cost:      3-10x đắt hơn single agent
  Quality:   specialized > generalist for complex tasks
  Complexity: coordination hard; deadlocks; error propagation
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Error propagation: lỗi ở worker đầu pipeline khuếch đại qua các bước sau, output cuối sai rất khó trace nguồn gốc
- Deadlock: Worker A chờ B, B chờ A — cần timeout và fallback mechanism cho mọi inter-agent communication
- Duplicate work: nhiều workers làm cùng subtask nếu orchestrator không track state đúng cách
- Cost blow-up: multi-agent 3-10x đắt hơn single agent — cần token budget per worker và kill switch

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                          | Tại sao sai                                                              | Đúng là                                                                                |
| ------------------------------------------------ | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| Dùng multi-agent vì nghe "hay" mà không đo lường | Tăng cost và latency mà không guarantee quality tốt hơn single agent     | A/B test: single agent vs multi-agent trên bài toán thật trước khi commit architecture |
| Không định nghĩa contract rõ cho worker          | Worker trả output format khác → orchestrator parse lỗi, cả pipeline fail | Mỗi worker cần JSON schema rõ ràng cho input/output, validate trước khi consume        |
| Không giới hạn budget per worker                 | Một worker rơi vào loop → cost bùng nổ cả system, không có kill switch   | Đặt max_steps, timeout, và token budget riêng cho từng worker, monitor realtime        |

**🎯 Interview Pattern:**

- Khi thấy: "how would you scale an agent to handle complex tasks" hoặc "when to use multi-agent vs single agent"
- Nhớ đến: chỉ dùng multi-agent khi task vượt context window, cần chuyên môn hóa, hoặc cần kiểm tra chéo; trade-off là 3-10x cost
- Mở đầu: "Multi-agent systems make sense when a task has truly independent subtasks that benefit from specialization, or needs cross-validation. But the key trade-off is 3-10x cost increase and coordination complexity — so I'd always benchmark single-agent first and only add agents when there's clear evidence of improvement."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Tool Use and Function Calling](#4-tool-use-and-function-calling--gọi-công-cụ) — mỗi agent trong hệ đa agent đều dựa trên tool use
- ➡️ Để hiểu tiếp: [Frameworks 2025](#6-frameworks-2025--hệ-sinh-thái-framework) — CrewAI, LangGraph giúp implement multi-agent patterns cụ thể

### 🟡 Q: Why use multi-agent systems? `[Mid]`

**A:** Đa agent hữu ích khi cần chuyên môn hóa, song song hóa, và kiểm tra chéo kết quả.

- Andrew Ng từng chia sẻ ví dụ benchmark: agentic decomposition có thể vượt zero-shot mạnh hơn.
- Worker chuyên biệt giúp prompt ngắn, rõ, ít nhiễu hơn “siêu agent”.
- Tuy nhiên complexity orchestration tăng: state sync, deadlock, duplicate work.

### 🔴 Q: Compare orchestrator-workers, peer debate, and role-based teams. `[Senior]`

**A:** Ba kiến trúc đa agent phù hợp mục tiêu khác nhau.

- **Orchestrator-workers:** điều phối tập trung, dễ kiểm soát budget.
- **Peer debate:** nhiều agent tranh luận, tốt cho reasoning quality.
- **Role-based team:** ổn cho workflow gần giống tổ chức thật (PM, engineer, reviewer).
- Quyết định dựa vào latency SLA, khả năng kiểm thử, và yêu cầu audit.

---

## 6. Frameworks 2025 / Hệ sinh thái framework

> 🧠 **Memory Hook:** 5 framework như 5 loại xe ở Việt Nam: LangChain là xe máy (phổ biến, linh hoạt đi mọi ngõ), LangGraph là tàu hỏa (đường ray graph cố định, đúng giờ), CrewAI là xe buýt (có tuyến role sẵn, dễ lên), AutoGen là xe thử nghiệm (nghiên cứu linh hoạt), Semantic Kernel là xe công vụ enterprise (tích hợp hệ thống lớn)!

**Tại sao tồn tại? / Why does this exist?**

Build agent từ scratch mỗi lần rất tốn kém — cần reinvent tool calling, state management, error handling, memory, và observability. Framework cung cấp abstractions giải quyết các vấn đề phổ biến này để team tập trung vào business logic.
→ **Why?** Mỗi framework được thiết kế cho use case khác nhau (simple chain vs complex graph vs enterprise) — không có one-size-fits-all, cần hiểu trade-off để chọn đúng thay vì chọn theo trend.
→ **Why?** Chọn sai framework ngay từ đầu dẫn đến lock-in khó thoát, abstraction leak khi scale, và debugging khó khi framework "magic" ẩn đi details quan trọng.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Giống như bạn không tự làm bánh từ bột mì thô mà mua bột pha sẵn. Tuy nhiên, mỗi loại bột có đặc điểm riêng: bột đa năng (LangChain — làm được nhiều thứ), bột cho bánh nhiều lớp theo quy trình chặt (LangGraph — structured flows), bột cho bánh nhóm nhanh (CrewAI — role-based), bột thử nghiệm vị mới (AutoGen — research), bột cho nhà hàng lớn tích hợp bếp công nghiệp (Semantic Kernel — enterprise). Bột sai → bánh hỏng.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Framework Selection Matrix:

Framework       │ Mạnh nhất           │ State      │ Best For
────────────────┼─────────────────────┼────────────┼──────────────────────
LangChain       │ Rich ecosystem,     │ Basic      │ Quick prototypes,
                │ many integrations   │            │ simple RAG/chain
────────────────┼─────────────────────┼────────────┼──────────────────────
LangGraph       │ Graph-based flows,  │ ✅ Full    │ Complex flows với
                │ checkpointing       │ checkpoint │ branching + state
────────────────┼─────────────────────┼────────────┼──────────────────────
CrewAI          │ Role-based team,    │ Basic      │ Multi-agent
                │ fast setup          │            │ prototyping nhanh
────────────────┼─────────────────────┼────────────┼──────────────────────
AutoGen         │ Flexible multi-     │ Basic      │ Research, dynamic
                │ agent conversation  │            │ agent dialogue
────────────────┼─────────────────────┼────────────┼──────────────────────
Semantic Kernel │ Enterprise ready,   │ Full       │ .NET/TS enterprise,
                │ planner+connectors  │            │ existing org infra

Decision Tree:
  Need state + checkpoint? → LangGraph
  Enterprise .NET/TS?      → Semantic Kernel
  Quick multi-agent MVP?   → CrewAI
  Research/flexible loop?  → AutoGen
  Default start?           → LangChain (hoặc plain API calls)

Rule: có cần framework không?
  Task 1-2 bước → plain API calls đơn giản và dễ debug hơn
  Task phức tạp → framework giúp nhiều hơn
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Framework lock-in: LangChain abstraction leak khi debug — khi under-the-hood thay đổi, code của bạn break không rõ lý do
- Over-abstraction: framework che giấu token cost, latency per call — developer mất awareness về actual resource usage
- Version instability: LangChain đặc biệt có breaking changes thường xuyên ở giai đoạn phát triển nhanh
- Over-engineering: simple task + heavy framework = unnecessary complexity và overhead; đôi khi plain API calls tốt hơn nhiều

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                             | Tại sao sai                                                                              | Đúng là                                                                                 |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Chọn framework vì trending (ví dụ: LangChain) mà không xét use case | Tốt cho prototype nhưng có abstraction leak khi scale; breaking changes thường xuyên     | Đánh giá framework theo: state management need, team language, enterprise requirements  |
| Dùng framework nặng cho task đơn giản                               | Overhead, learning curve, và debug complexity không justify; framework "magic" ẩn errors | Với task 1-2 bước, plain function + OpenAI/Anthropic API call đơn giản và dễ debug hơn  |
| Không biết khi nào KHÔNG dùng agent/framework                       | Agent thêm latency 3-5x và cost; nếu task deterministic thì agent là lãng phí            | Rule: bắt đầu simple prompt → workflow → agent, chỉ tăng complexity khi có evidence cần |

**🎯 Interview Pattern:**

- Khi thấy: "what agent frameworks do you know" hoặc "compare LangChain vs LangGraph"
- Nhớ đến: mỗi framework có trade-off riêng; chọn dựa trên state management need, team ecosystem, và complexity level
- Mở đầu: "The framework choice depends primarily on the complexity of state management. For complex flows with branching and checkpointing I'd reach for LangGraph; for enterprise .NET/TypeScript shops, Semantic Kernel makes sense. But I'd always ask first: do we actually need a framework, or can plain API calls handle this more transparently?"

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Multi-Agent Systems](#5-multi-agent-systems--hệ-đa-tác-nhân) — framework implement các multi-agent patterns đã học
- ➡️ Để hiểu tiếp: [AI System Design](./06-ai-system-design.md) — đưa agent + framework vào production architecture thực tế

### 🟡 Q: How do LangChain, LangGraph, CrewAI, AutoGen, and Semantic Kernel differ? `[Mid]`

**A:** Nên nhìn các framework theo mức trừu tượng và cách quản lý state graph.

- **LangChain:** abstraction nhiều thành phần prompt/tool/retriever, dễ bắt đầu.
- **LangGraph:** graph-based orchestration mạnh cho flows có state và checkpoint.
- **CrewAI:** role-based multi-agent patterns nhanh cho prototyping.
- **AutoGen:** hội thoại nhiều agent linh hoạt, hợp nghiên cứu/automation.
- **Semantic Kernel:** mạnh ở enterprise integration, planner + connectors, .NET/TS ecosystem.

### 🔴 Q: When should you avoid agents and use simple prompts? `[Senior]`

**A:** Theo khuyến nghị thực dụng, nếu task đơn bước và deterministic thì không cần agent.

- Agent thêm latency, cost, và failure modes orchestration.
- Chỉ dùng agent khi bài toán có branching, tool interaction, hoặc long-horizon planning.
- Rule ngắn gọn: bắt đầu đơn giản, đo lường, rồi tăng autonomy khi có bằng chứng.

---

## 7. Interview Q&A Bank / Ngân hàng câu hỏi phỏng vấn

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #1? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #2? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #3? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #4? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #5? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #6? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #7? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #8? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #9? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #10? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #11? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #12? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #13? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #14? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #15? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #16? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #17? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #18? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #19? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #20? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #21? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #22? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #23? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #24? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #25? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #26? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #27? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #28? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #29? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #30? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #31? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #32? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #33? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #34? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #35? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #36? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #37? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #38? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #39? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #40? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #41? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #42? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #43? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #44? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #45? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #46? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #47? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #48? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #49? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #50? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #51? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #52? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #53? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #54? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #55? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #56? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #57? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #58? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #59? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #60? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #61? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #62? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #63? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #64? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #65? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #66? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #67? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #68? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #69? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #70? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #71? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #72? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #2 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #73? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #3 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟡 Q: What is one practical engineering trade-off in agent patterns scenario #74? `[Mid]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #4 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🔴 Q: What is one practical engineering trade-off in agent patterns scenario #75? `[Senior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #5 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

### 🟢 Q: What is one practical engineering trade-off in agent patterns scenario #76? `[Junior]`

**A:** Trong phỏng vấn, bạn nên nêu trade-off theo cấu trúc **benefit → cost → mitigation**.

- **Benefit:** phương án #1 giúp tăng tốc delivery và giảm cognitive load cho team.
- **Cost:** có thể tăng độ phức tạp vận hành, chi phí inference, hoặc độ trễ tail latency.
- **Mitigation:** thêm monitoring, đặt guardrails, và rollout theo canary trước khi mở rộng.
- **KPI nên theo dõi:** p95 latency, success rate, quality score, token cost/request.
- **Sai lầm thường gặp:** chỉ nói công nghệ mà không nói tác động đến business metric.
- **Câu chốt an toàn:** `I would run an A/B experiment and pick the lowest-cost option that still meets quality SLO.`

---

## Interview Q&A Summary / Tổng hợp câu hỏi phỏng vấn

### Q: What is an LLM agent and how does ReAct work? / LLM agent là gì và ReAct hoạt động như thế nào? 🟡 Mid

**A:** An LLM agent = LLM + tools + memory + planning, able to take multi-step actions autonomously.

```
ReAct Pattern (Reason + Act):
┌────────────────────────────────────────────────┐
│  Thought: I need to find the current weather    │
│  Action: search("weather Tokyo today")          │
│  Observation: "Tokyo: 18°C, partly cloudy"      │
│                                                  │
│  Thought: I have the weather, now format reply  │
│  Action: respond("The weather in Tokyo is...")  │
│  Final Answer: "Tokyo is 18°C, partly cloudy"  │
└────────────────────────────────────────────────┘

Loop: Thought → Action → Observation → Thought → ...
      until Final Answer or max_steps reached
```

**Agent components:**

```
┌─────────────────────────────────────────────┐
│                   Agent                      │
│  ┌──────────┐  ┌────────┐  ┌─────────────┐ │
│  │  LLM     │  │ Tools  │  │   Memory    │ │
│  │(planner) │  │────────│  │─────────────│ │
│  │          │  │search  │  │short-term:  │ │
│  │          │  │calc    │  │conversation │ │
│  │          │  │code    │  │             │ │
│  │          │  │API     │  │long-term:   │ │
│  └──────────┘  │files   │  │vector store │ │
│                └────────┘  └─────────────┘ │
└─────────────────────────────────────────────┘
```

**Tool calling (function calling) flow:**

```json
1. User: "What's 3456 * 789?"
2. LLM → { "tool": "calculator", "args": {"expr": "3456 * 789"} }
3. System executes calculator → 2726784
4. LLM receives result → "3456 × 789 = 2,726,784"
```

**Điểm then chốt:** ReAct = ngôn ngữ + hành động + quan sát kết hợp. LLM không chỉ trả lời mà còn quyết định WHAT to do và sử dụng tools để gather info. Key insight: interleave reasoning traces with actions.

### Q: What is the difference between single-agent and multi-agent architectures? / Khi nào dùng multi-agent? 🔴 Senior

**A:**

```
Single Agent:
  User → [Agent] → Tools → Response
  ├── Simple, low latency
  ├── Limited by single context window
  └── Best for: straightforward tasks, clear tool use

Multi-Agent Architectures:

1. Orchestrator + Workers (Hierarchical)
   User → [Orchestrator] → [Worker1] [Worker2] [Worker3]
                          (researcher) (writer)  (critic)
   ├── Orchestrator plans, delegates, aggregates
   └── Best for: complex tasks needing specialization

2. Parallel Agents
   User → [Agent1, Agent2, Agent3] → Aggregator → Response
   ├── All run same task independently, vote/merge
   └── Best for: high-stakes decisions (self-consistency)

3. Pipeline (Sequential)
   User → [Researcher] → [Analyst] → [Writer] → Response
   ├── Each agent processes previous output
   └── Best for: data pipeline tasks, content generation

4. Debate / Reflection
   [Agent1] ←→ [Agent2] (critique each other) → Consensus
   └── Best for: complex reasoning, catching errors
```

**When to use multi-agent:**

- Task too complex for single context window
- Parallel subtasks (research different topics simultaneously)
- Need specialization (researcher vs writer vs code generator)
- Need verification (critic agent reviewing writer agent output)

**Challenges:**

- Cost: multiple LLM calls → 3-10x more expensive
- Latency: especially sequential pipelines
- Error propagation: early agent mistakes compound
- Coordination complexity: orchestrator prompt engineering hard

**Cách giải thích:** Multi-agent = chia nhỏ vấn đề phức tạp cho nhiều "chuyên gia" xử lý song song hoặc tuần tự. Trade-off chính là cost và latency tăng lên. Chỉ dùng khi single agent không đủ capability.

### Q: How do you handle agent reliability and error recovery? / Làm thế nào để tăng reliability cho agents? 🔴 Senior

**A:**

```
Reliability challenges:
├── LLM non-determinism → different tool calls each run
├── Tool failures → network errors, API limits
├── Infinite loops → agent keeps calling same tool
├── Context overflow → conversation too long for context window
└── Prompt injection via tool outputs → tool returns malicious instructions

Mitigation strategies:

1. Structured outputs
   ├── Force JSON schema: { "tool": "...", "args": {...}, "reason": "..." }
   ├── Validate before executing
   └── Retry with error message if invalid

2. Step limits & timeouts
   ├── max_steps=20, max_time=60s
   └── Graceful degradation: return partial result with explanation

3. Tool call validation
   ├── Whitelist allowed tools and parameters
   ├── Sandbox code execution (subprocess, container)
   └── Rate limit tool calls (prevent runaway loops)

4. Checkpointing & resumability
   ├── Save agent state at each step
   ├── Resume from last checkpoint on failure
   └── Critical for long-running agents (research tasks)

5. Observability
   ├── Log every Thought/Action/Observation
   ├── Trace IDs across all agent steps
   └── Alert on error rate, step count, token spend

6. Human-in-the-loop (HITL)
   ├── High-stakes actions require human approval
   ├── "Before I delete these files, confirm?"
   └── Async approval via webhook/UI
```

**Production agent stack:**

```
Request → [Input validation] → [Agent + ReAct loop]
                                        ↓
                               [Tool executor + sandbox]
                                        ↓
                               [Output validator]
                                        ↓
                          [Observability: traces, metrics]
                                        ↓
                               Response (or HITL gate)
```

**Điểm senior phải biết:** Production agents cần structured outputs, step limits, observability, và human-in-the-loop cho high-stakes actions. Tool execution phải được sandboxed (đặc biệt code execution). Logging every ReAct step là critical cho debugging.

---

## Self-Check / Tự Kiểm Tra

| #   | Loại           | Câu hỏi                                                                                                                                                            |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 🔍 Retrieval   | Nêu 3 thành phần cốt lõi trong Lilian Weng's agent framework và giải thích vai trò của từng thành phần.                                                            |
| 2   | 🎨 Visual      | Vẽ sơ đồ vòng lặp ReAct (Thought → Action → Observation) với ví dụ cụ thể: agent check trạng thái đơn hàng Shopee cho khách hàng.                                  |
| 3   | 🛠️ Application | Thiết kế một customer service agent cho Shopee xử lý: check order status + initiate refund, với step limit, tool validation, và human handoff khi confidence thấp. |
| 4   | 🐛 Debug       | Một agent cứ gọi lại cùng một search tool trong vòng lặp, không dừng — nguyên nhân là gì và bạn sẽ fix như thế nào?                                                |
| 5   | 🎓 Teach       | Giải thích cho junior engineer tại sao phải validate tool arguments TRƯỚC khi execute, dùng một ví dụ analogy từ cuộc sống hàng ngày.                              |

💬 **Feynman Prompt:** Giải thích tại sao "infinite loop" là a common agent failure — và design một stop condition mechanism that catches both obvious loops and subtle ones.

## Connections / Liên Kết

- ⬅️ **Built on**: [LLM & Transformers](./02-llm-and-transformers.md) — LLM is the reasoning engine
- ⬅️ **Built on**: [RAG & Embeddings](./04-rag-and-embeddings.md) — agents use RAG for knowledge retrieval
- ➡️ **Applied in**: [AI System Design](./06-ai-system-design.md) — agent architecture in production systems
- 🔗 **Related**: [AI Production Challenges](./07-ai-production-challenges.md) — production deployment of agents
