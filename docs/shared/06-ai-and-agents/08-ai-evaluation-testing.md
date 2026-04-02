# AI System Evaluation & Testing / Đánh Giá và Kiểm Thử Hệ Thống AI

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [ML Fundamentals](./01-ml-fundamentals.md) | [LLMs & Transformers](./02-llm-and-transformers.md)
> **See also**: [AI Engineering Practice](./05-ai-engineering-practice.md) | [AI Production Challenges](./07-ai-production-challenges.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Shopee review summarization feature:** Team deploy LLM to summarize product reviews. "Looks good" in manual testing. 1 week later, user complaints: summaries biased toward negative reviews (hallucinated negatives even for good products). Root cause: no systematic evaluation — only 5 manual test cases. Fix: build eval dataset of 200 product+reviews pairs with gold-standard summaries, measure factuality (RAGAS), run eval on every prompt change. Caught next regression in 3 days.

**Bài học:** "Looks good to me" is not an evaluation strategy. LLM outputs are probabilistic — need systematic eval pipeline with metrics to detect regressions before production.

## What & Why / Cái Gì & Tại Sao

**Analogy:** AI eval giống food safety testing: không thể chỉ taste-test 5 mẫu và gọi đó là "safe for production". Cần systematic testing với diverse samples, defined quality criteria, và regression detection. Khác biệt: AI "test failures" không throw exceptions — output vẫn trả về, chỉ sai về mặt quality.

**Why it matters:** Eval is the foundation of responsible AI deployment. Companies that deploy LLM features without evals get surprised by quality regressions. Senior AI engineers design eval pipelines as part of the feature, not after the fact.

---

## Overview / Tổng Quan

Evaluating AI systems is fundamentally different from evaluating traditional software:

- Traditional software: deterministic → `assert output == expected`
- AI/LLM: probabilistic → outputs vary, quality is subjective, "correctness" is fuzzy

2025 expectation: **Engineers integrating LLMs must know how to evaluate them** — this is now a standard interview topic.

---

## 1. Evaluation Framework / Khung Đánh Giá

> 🧠 **Memory Hook:** Đây như kiểm định thực phẩm của Chi cục An toàn vệ sinh thực phẩm — không thể chỉ nếm thử 5 mẫu phở rồi kết luận cả kho nguyên liệu "an toàn cho production"!

**Tại sao tồn tại? / Why does this exist?**

LLM outputs không deterministic — không thể viết `assert output == expected` như software thường. Không có framework đánh giá, bạn không biết AI feature đang tốt hay đang âm thầm tệ đi mỗi ngày.
→ **Why?** Vì "looks good to me" bias — con người không thể tự tay review hàng nghìn outputs khách quan
→ **Why?** Vì AI models degrade silently — một thay đổi prompt nhỏ có thể phá vỡ quality trên edge cases mà không ai hay

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Giống như bếp trưởng nhà hàng không thể chỉ nếm 1–2 món rồi kết luận bếp đang nấu ngon. Cần có bảng tiêu chí rõ ràng (độ chín, vị mặn ngọt, nhiệt độ), thử nghiệm nhiều mẫu khác nhau từ nhiều ca khác nhau, và kiểm tra lại mỗi ngày. Nếu không, hôm nay ngon, ngày mai bị phàn nàn mà không biết tại sao.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
EVALUATION PYRAMID (chi phí tăng dần, độ tin cậy tăng dần):

Level 1 — Unit Evals (tự động, rẻ)
  Input → LLM → Check structure/properties
  ✓ nhanh  ✓ rẻ  ✗ không đánh giá "chất lượng" open-ended

Level 2 — LLM-as-Judge (tự động, trung bình)
  LLM mạnh chấm điểm LLM yếu hơn
  ✓ scalable  ✓ có thể giải thích  ✗ có bias

Level 3 — Human Evaluation (chậm, đắt)
  A/B test + real user thumbs up/down
  ✓ ground truth  ✗ chậm tuần/tháng

Level 4 — Business Metrics (thực tế nhất)
  Ticket deflection, conversion, time-on-task
  ✓ ROI rõ ràng  ✗ lag vài tuần mới thấy
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- LLM-as-Judge bị "verbosity bias" — câu trả lời dài hơn thường được chấm điểm cao hơn dù không tốt hơn
- Golden sets bị stale sau 3–6 tháng khi hành vi người dùng thay đổi
- Business metrics lag quá lâu — không dùng được để iterate nhanh
- Human evaluators có inter-rater reliability thấp nếu không có rubrics rõ ràng

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                              | Tại sao sai                                   | Đúng là                                                                                    |
| ------------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Chỉ manual test 5–10 cases           | Không đủ diversity, miss edge cases hoàn toàn | 200+ golden cases với diverse inputs và adversarial cases                                  |
| Assert exact string output           | LLM non-deterministic, test sẽ fail random    | Test structure/properties: `assert "Paris" in response`                                    |
| Chỉ đo accuracy, bỏ qua latency/cost | LLM chậm và đắt — đây cũng là chất lượng      | Track cả 7 dimensions: accuracy, relevance, coherence, safety, groundedness, latency, cost |

**🎯 Interview Pattern:**

- Khi thấy: "How do you ensure the quality of an AI feature?"
- Nhớ đến: 4-level evaluation framework (unit → LLM-judge → human → business)
- Mở đầu: "I start with a golden eval dataset and automated unit evals, then layer in LLM-as-judge for scalable quality scoring — and only go to human eval for high-stakes decisions."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [ML Fundamentals](./01-ml-fundamentals.md) — precision, recall, F1 là nền tảng của eval metrics
- ➡️ Để hiểu tiếp: [LLM Testing Patterns](#2-llm-testing-patterns--mẫu-kiểm-thử-llm) — cách code cụ thể cho eval framework này

### Q: How do you evaluate an LLM-powered feature? 🟡 Mid

**A:**

```
EVALUATION LEVELS:

Level 1 — Unit Evals (automated):
  Input: test prompts → LLM → Output
  Check: does output contain expected elements?
  Tools: pytest + regex/string matching

Level 2 — Model-as-Judge (LLM grades LLM):
  Use a stronger LLM (GPT-4, Claude) to grade your model's outputs
  Judge prompt: "Rate this response 1-5 for helpfulness/accuracy/safety"
  Tools: BrainTrust, LangSmith, Athina AI

Level 3 — Human Evaluation:
  A/B test different prompts on real users
  Track engagement, thumbs up/down, task completion
  Gold standard but expensive and slow

Level 4 — Business Metrics:
  Does the AI feature improve business KPIs?
  (Support ticket deflection rate, conversion rate, time-on-task)
```

### Key Evaluation Dimensions

| Dimension        | What it measures                      | Example metric                              |
| ---------------- | ------------------------------------- | ------------------------------------------- |
| **Accuracy**     | Is the output factually correct?      | % correct answers on test set               |
| **Relevance**    | Does output address the question?     | Cosine similarity to ideal response         |
| **Coherence**    | Is the output well-structured?        | Human rating 1-5                            |
| **Safety**       | Does output avoid harmful content?    | % harmful responses in adversarial test set |
| **Groundedness** | Is output supported by context (RAG)? | Citation accuracy                           |
| **Latency**      | How fast?                             | p50/p95/p99 response time                   |
| **Cost**         | $ per query                           | Tokens × $/token                            |

---

## 2. LLM Testing Patterns / Mẫu Kiểm Thử LLM

> 🧠 **Memory Hook:** Test LLM giống chấm bài văn học sinh — giáo viên không cần bài viết y hệt đáp án mẫu, chỉ cần: có đủ ý chính, không sai thực tế, đủ độ dài, không chép bài bạn (hallucinate).

**Tại sao tồn tại? / Why does this exist?**

LLM outputs là non-deterministic — cùng một input, mỗi lần gọi ra output khác nhau. Viết `assert output == "The capital is Paris"` sẽ fail ngẫu nhiên, tạo ra flaky tests vô dụng.
→ **Why?** Vì điều quan trọng không phải _từng chữ_ của câu trả lời, mà là _tính chất_ của nó
→ **Why?** Vì brittle tests làm team mất niềm tin vào CI và bắt đầu ignore failures — đây là anti-pattern nguy hiểm

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Giống như kiểm tra đầu bếp mới — không hỏi "anh nấu phở theo đúng công thức từng bước này không?" mà hỏi "nước dùng có trong không? thịt có chín không? không có mùi lạ không?" Đó chính là cách test LLM — kiểm tra tính chất (properties), không kiểm tra từng chữ.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
3 TESTING PATTERNS:

Pattern 1 — Deterministic (cho structured outputs):
  Input: "Order 2 pizzas"
  ✓ output["intent"] == "order"         ← test structure
  ✓ output["quantity"] == 2             ← test value
  ✗ output["text"] == "Sure, I'll..."  ← test exact wording (WRONG)

Pattern 2 — Golden Set (cho batch quality):
  200 curated (input, expected_properties) pairs
      ↓
  Run all → score each (0 or 1)
      ↓
  pass_rate = sum/total
      ↓
  assert pass_rate >= 0.85  ← threshold, not exact

Pattern 3 — LLM-as-Judge (cho open-ended quality):
  User question → Your LLM → Response
                                   ↓
  Judge LLM: "Rate 1-5 for helpfulness"
                                   ↓
  assert score >= 4
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Pattern 1 chỉ hoạt động cho structured outputs (JSON extraction, classification) — không dùng được cho free-form text
- Golden set drift: test cases viết 6 tháng trước có thể không còn phản ánh real user queries
- LLM-as-Judge "positional bias" — judge thường prefer response nào được show trước
- Judge LLM không nên là cùng model đang test (self-evaluation bias inflate scores)

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                             | Tại sao sai                                          | Đúng là                                             |
| ----------------------------------- | ---------------------------------------------------- | --------------------------------------------------- |
| `assert response == "exact answer"` | LLM non-deterministic → test fail random             | `assert "Paris" in response` hoặc dùng threshold    |
| Golden set chỉ 5–10 cases           | Không phát hiện edge cases, pass rate không có nghĩa | Tối thiểu 50 cases, aim 200+ với diverse inputs     |
| Dùng cùng model làm judge           | Self-evaluation bias — model tự chấm cao cho mình    | Judge phải là model mạnh hơn (GPT-4 judges GPT-3.5) |

**🎯 Interview Pattern:**

- Khi thấy: "How do you write tests for LLM-powered code?"
- Nhớ đến: 3 patterns — deterministic assertions, golden set evaluation, LLM-as-judge
- Mở đầu: "For LLM testing, I use three complementary patterns: deterministic assertions on structured outputs, golden set evaluation with threshold scoring, and LLM-as-judge for open-ended quality assessment."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Evaluation Framework](#1-evaluation-framework--khung-đánh-giá) — hiểu 4 levels trước khi code
- ➡️ Để hiểu tiếp: [Regression Testing for LLMs](#3-regression-testing-for-llms--kiểm-thử-hồi-quy) — dùng patterns này trong CI pipeline

### Q: How do you write tests for LLM-powered code? 🟢 Junior → 🔴 Senior

**A:**

**Pattern 1: Deterministic tests (for structured outputs)**

```python
import pytest
from app.services.ai import extract_intent

def test_extract_order_intent():
    """LLM should extract structured data reliably for well-defined inputs"""
    result = extract_intent("I want to order 2 large pizzas")

    # Don't test exact wording — test structure
    assert result["intent"] == "order"
    assert result["quantity"] == 2
    assert "pizza" in result["item"].lower()
    # Don't assert: result["message"] == "I'll order 2 large pizzas for you!"
    # (exact wording varies between calls)
```

**Pattern 2: Golden set evaluation**

```python
# Curate a set of input → expected_output pairs
GOLDEN_SET = [
    {
        "input": "Summarize: The weather in Hanoi is hot and humid in summer.",
        "expected_contains": ["hot", "humid", "Hanoi"],
        "expected_not_contains": ["cold", "snowy"],
        "min_length": 10,
        "max_length": 100,
    },
    # ... more test cases
]

def evaluate_summarizer(model_fn, dataset=GOLDEN_SET, threshold=0.85):
    scores = []
    for case in dataset:
        output = model_fn(case["input"])
        score = grade_output(output, case)
        scores.append(score)

    pass_rate = sum(scores) / len(scores)
    assert pass_rate >= threshold, f"Model quality dropped: {pass_rate:.2%}"
    return pass_rate

def grade_output(output, case):
    # Check all expected phrases present
    for phrase in case.get("expected_contains", []):
        if phrase.lower() not in output.lower():
            return 0
    # Check forbidden phrases absent
    for phrase in case.get("expected_not_contains", []):
        if phrase.lower() in output.lower():
            return 0
    # Check length
    if not (case["min_length"] <= len(output) <= case["max_length"]):
        return 0
    return 1
```

**Pattern 3: LLM-as-Judge**

```python
import anthropic

client = anthropic.Anthropic()

def llm_judge(question: str, response: str, criteria: str) -> dict:
    """Use Claude to evaluate another LLM's response"""
    judge_prompt = f"""You are an expert evaluator. Rate this AI response.

Question: {question}
Response: {response}

Evaluate based on: {criteria}

Respond with JSON:
{{
  "score": 1-5,
  "reasoning": "brief explanation",
  "issues": ["list of problems if any"]
}}"""

    result = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=500,
        messages=[{"role": "user", "content": judge_prompt}]
    )

    import json
    return json.loads(result.content[0].text)

# Usage in test
def test_customer_service_quality():
    question = "How do I cancel my subscription?"
    response = ai_service.answer(question)

    judgment = llm_judge(
        question=question,
        response=response,
        criteria="helpfulness, accuracy, and clarity"
    )

    assert judgment["score"] >= 4, f"Quality too low: {judgment}"
```

---

## 3. Regression Testing for LLMs / Kiểm Thử Hồi Quy

> 🧠 **Memory Hook:** Regression testing LLM như kiểm tra sức khỏe định kỳ sau khi thay thuốc — mỗi lần đổi prompt (thay thuốc), phải xét nghiệm lại đủ chỉ số để chắc bệnh cũ không tái phát và thuốc mới không gây tác dụng phụ.

**Tại sao tồn tại? / Why does this exist?**

Prompts thay đổi liên tục trong development, và mỗi thay đổi có thể âm thầm phá vỡ quality trên các cases đã hoạt động tốt trước đó. Không có regression testing, team chỉ biết quality drop khi users phàn nàn — đã quá muộn.
→ **Why?** Vì LLMs rất nhạy cảm với wording — di chuyển một câu trong prompt có thể break unrelated capabilities
→ **Why?** Vì trust damage từ quality regression rất khó recover — users đã bad experience sẽ không quay lại

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Giống như kỹ sư xây cầu — mỗi khi sửa một thanh dầm, phải kiểm tra lại toàn bộ cầu có còn chịu tải được không. Không ai nói "tôi chỉ sửa một chỗ nhỏ, chắc không sao đâu" — cầu sập thì cả thành phố chịu. Prompt change nhỏ mà không test lại toàn bộ golden set = rủi ro cầu sập với users.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
PROMPT REGRESSION CI PIPELINE:

  Developer changes prompt (v1 → v2)
           │
           ▼
  ┌──────────────────────────────────┐
  │  CI auto-runs 200 golden cases   │
  │  against BOTH v1 and v2          │
  └──────────────┬───────────────────┘
                 │
                 ▼
  ┌──────────────────────────────────┐
  │  Compare scores:                 │
  │    v1 baseline:  0.87            │
  │    v2 candidate: 0.82            │
  │    Δ degradation: -5.7%          │
  │    Threshold: > 5% → BLOCK ❌    │
  └──────────────────────────────────┘
           │                  │
     Blocked → fix       Passed → merge ✅
     and retry            + post score diff
                            to PR comment
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- "Ratchet effect": luôn dùng current baseline làm threshold, không phải original — tránh slow drift tích lũy
- Flaky evals: LLM-as-judge tự nó cũng vary → chạy mỗi case 3 lần và lấy average score
- Golden set contamination: nếu test cases leak vào training data, eval scores sẽ inflate ảo
- Language/locale coverage: regression suite phải include tất cả ngôn ngữ feature hỗ trợ

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                           | Tại sao sai                                               | Đúng là                                                             |
| --------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------- |
| Chỉ manual test trước khi release | Không catch edge cases, subjective, chậm                  | Automated eval suite chạy trong CI/CD mỗi PR                        |
| Binary pass/fail như unit tests   | LLM outputs fuzzy → quá nhiều false negatives             | Threshold-based: fail nếu score drop > 5% so với baseline           |
| Không version control prompts     | Không biết prompt nào gây regression, không rollback được | Store prompts as versioned files trong git (prompts/v1.txt, v2.txt) |

**🎯 Interview Pattern:**

- Khi thấy: "How do you prevent quality regression when updating prompts?"
- Nhớ đến: Versioned prompts + golden dataset + CI gate on score threshold
- Mở đầu: "I treat prompts like code — versioned in git, with a golden eval dataset that runs in CI and blocks any merge that degrades quality by more than 5% from baseline."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [LLM Testing Patterns](#2-llm-testing-patterns--mẫu-kiểm-thử-llm) — golden set và threshold scoring
- ➡️ Để hiểu tiếp: [Monitoring AI in Production](#4-monitoring-ai-in-production--giám-sát-ai-trong-production) — sau khi deploy, tiếp tục watch production signals

### Q: How do you prevent LLM quality regression when updating prompts? 🔴 Senior

**A:**

```
PROMPT VERSIONING + REGRESSION PIPELINE:

1. Store prompts as versioned files (prompts/v1.txt, prompts/v2.txt)
2. Maintain golden dataset (200-500 curated test cases)
3. On every prompt change → run full eval → compare to baseline
4. Gate deployments on eval score threshold

CI/CD Pipeline:
  PR: change prompt v1 → v2
  │
  ▼
  Eval job runs automatically:
    - Run 200 test cases against new prompt
    - Compare scores to v1 baseline
    - If degradation > 5% → block PR
    - If improvement → show diff in PR comment

Tools:
  BrainTrust (braintrustdata.com) — tracks evals over time, A/B prompt testing
  LangSmith (Smith.langchain.com) — LLM observability + eval
  Weave (wandb.ai/weave) — Weights & Biases for LLMs
  Promptfoo (open source) — run evals from CLI
```

---

## 4. Monitoring AI in Production / Giám Sát AI trong Production

> 🧠 **Memory Hook:** Monitor AI trong production giống theo dõi bệnh nhân ICU — không chỉ đo nhịp tim (latency), mà còn đo ý thức (user feedback), nhiệt độ (error rate), và chi phí truyền dịch (cost/token) — thiếu bất kỳ chỉ số nào là nguy hiểm.

**Tại sao tồn tại? / Why does this exist?**

Evals kiểm tra model trong lab; monitoring kiểm tra model ngoài đời thực. Production có input distribution khác hoàn toàn với golden set — real users hỏi những thứ bạn chưa từng nghĩ đến.
→ **Why?** Vì distribution shift xảy ra liên tục — model API update, prompt injection attacks, seasonal user behavior change
→ **Why?** Vì một prompt loop bug không được monitor có thể tốn $10,000+ trong vài giờ trước khi ai phát hiện

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Giống như quản lý nhà hàng không chỉ kiểm tra món ăn trước khi mở cửa (evaluation), mà còn đọc Google Reviews mỗi ngày, theo dõi tỷ lệ hoàn trả món, và để ý khi nào khách gọi bếp ra phàn nàn nhiều hơn bình thường. Evaluation = trước khi mở cửa; Monitoring = khi nhà hàng đang chạy.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
3 MONITORING CATEGORIES:

OPERATIONAL          AI-SPECIFIC           SAFETY
──────────────────   ─────────────────── ──────────────────────
Latency p50/p95/p99  User thumbs up/down  PII scan in outputs
Error rate (timeout) Task completion %    Harmful content %
Token count/request  Fallback rate        Prompt injection %
Cost $/request/day   Hallucination flags
                     Response length ←
                     (too short/long =
                      quality signal)
         ↓
  OpenTelemetry traces → Grafana / Datadog
         ↓
  Alerts: error spike | cost spike | quality drop
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Thumbs up/down signal là sparse — hầu hết users không rating → selection bias nặng
- "Regenerate" button click là strong negative signal mạnh hơn thumbs down — track separately
- Production input distribution drift theo thời gian → cần update golden set định kỳ
- PII logging risk: không log raw prompts/responses trước khi strip PII — GDPR violation

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                            | Tại sao sai                                     | Đúng là                                                                   |
| ---------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------- |
| Chỉ monitor latency và error rate  | Miss quality degradation hoàn toàn              | Monitor cả AI-specific: feedback rate, fallback rate, hallucination flags |
| Không alert khi cost tăng đột biến | Prompt loop bug tốn $10K+/ngày trước khi ai hay | Set cost alerts, budget caps, và rate limits per user                     |
| Log toàn bộ prompts/responses      | Privacy violation, GDPR risk                    | Log aggregated metrics; sample logs sau khi PII đã được remove            |

**🎯 Interview Pattern:**

- Khi thấy: "What metrics do you monitor for an LLM in production?"
- Nhớ đến: 3 categories — operational, AI-specific quality, safety
- Mở đầu: "I monitor three categories: operational metrics like latency and cost, AI-specific metrics like user feedback rate and fallback rate, and safety metrics like PII leakage detection and prompt injection attempts."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Regression Testing for LLMs](#3-regression-testing-for-llms--kiểm-thử-hồi-quy) — offline eval; monitoring là online counterpart
- ➡️ Để hiểu tiếp: [Advanced Eval Frameworks](#5-advanced-eval-frameworks--framework-đánh-giá-nâng-cao) — tools chuyên biệt cho RAG evaluation

### Q: What metrics do you monitor for an LLM in production? 🔴 Senior

**A:**

```
OPERATIONAL METRICS (standard infra):
  - Latency: p50=800ms, p95=2s, p99=5s (LLMs are slow!)
  - Error rate: API timeouts, rate limits, invalid JSON
  - Token usage: prompt tokens + completion tokens per request
  - Cost: $/request, $/day by feature

QUALITY METRICS (AI-specific):
  - User feedback: thumbs up/down, regenerate rate
  - Task completion: did user accomplish goal? (session analytics)
  - Fallback rate: % requests that fell back to non-AI path
  - Hallucination flags: % responses flagged by safety classifier
  - Response length: unusually short/long = quality signal

SAFETY METRICS:
  - PII in output: scan outputs for names/emails/phone numbers
  - Harmful content rate: % flagged by content moderation
  - Prompt injection attempts: % requests matching injection patterns
```

```python
# Production monitoring with OpenTelemetry
from opentelemetry import trace, metrics

tracer = trace.get_tracer("ai-service")
meter = metrics.get_meter("ai-service")

llm_latency = meter.create_histogram("llm.latency.ms")
llm_tokens = meter.create_counter("llm.tokens.total")
llm_errors = meter.create_counter("llm.errors.total")

def call_llm(prompt: str, user_id: str) -> str:
    with tracer.start_as_current_span("llm.call") as span:
        span.set_attribute("user.id", user_id)
        span.set_attribute("prompt.length", len(prompt))

        start = time.time()
        try:
            response = client.messages.create(...)
            latency = (time.time() - start) * 1000

            llm_latency.record(latency)
            llm_tokens.add(response.usage.input_tokens + response.usage.output_tokens)

            span.set_attribute("response.tokens", response.usage.output_tokens)
            span.set_attribute("latency.ms", latency)
            return response.content[0].text

        except Exception as e:
            llm_errors.add(1, {"error.type": type(e).__name__})
            span.record_exception(e)
            raise
```

---

## 5. Advanced Eval Frameworks / Framework Đánh Giá Nâng Cao

> 🧠 **Memory Hook:** RAGAS như bộ tứ thám tử chuyên nghiệp — Faithfulness (có bịa đặt không?), Answer Relevancy (có trả lời đúng câu không?), Context Precision (có kéo rác về không?), Context Recall (có bỏ sót manh mối không?) — mỗi người chuyên một loại tội.

**Tại sao tồn tại? / Why does this exist?**

RAG systems có nhiều điểm thất bại độc lập — retrieval có thể tệ, generation có thể tệ, hoặc cả hai. Dùng accuracy tổng thể không giúp bạn biết cần fix chỗ nào, gây lãng phí weeks of engineering effort.
→ **Why?** Vì "câu trả lời sai" không cho bạn biết đó là lỗi của retriever hay của generator
→ **Why?** Vì fix sai component (rewrite prompts khi thực ra retrieval đang hỏng) tốn thời gian mà không giải quyết gốc rễ

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Giống như khám bệnh toàn diện — bác sĩ không hỏi "bạn có khỏe không?" rồi kê thuốc ngay. Bác sĩ đo riêng: huyết áp (Faithfulness), nhịp tim (Answer Relevancy), xét nghiệm máu (Context Precision), chụp phổi (Context Recall). Mỗi chỉ số chỉ ra đúng cơ quan bị vấn đề và cách điều trị khác nhau.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
RAGAS DIAGNOSTIC MAP:

User Question → [Retriever] → Retrieved Chunks → [Generator] → Answer
                    │                                  │
             Context Precision              Faithfulness
             Context Recall                Answer Relevancy

DIAGNOSIS TABLE:
  Faithfulness LOW     → Generator đang hallucinate
                          Fix: stronger system prompt, reduce temperature
  Answer Relevancy LOW → Generator off-topic / incomplete
                          Fix: prompt engineering, few-shot examples
  Context Precision LOW→ Retriever kéo về chunks vô dụng
                          Fix: better embedding model, add reranker
  Context Recall LOW   → Retriever bỏ sót chunks quan trọng
                          Fix: chunking strategy, hybrid search (BM25 + dense)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- RAGAS dùng LLM-as-judge internally → không free, mỗi eval run tốn tiền
- Context Recall đòi hỏi ground truth labels — rất khó có ở scale lớn
- **Faithfulness ≠ Factual accuracy**: answer có thể faithful với context nhưng context bị sai → answer sai (garbage in, garbage out)
- RAGAS scores có thể bị "game" bằng cách return toàn bộ context làm answer — high faithfulness, low relevancy

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                     | Tại sao sai                                              | Đúng là                                                                     |
| ------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------- |
| Chỉ đo end-to-end accuracy tổng hợp của RAG | Không biết retrieval hay generation bị lỗi, fix sai chỗ  | Đo riêng từng RAGAS metric để diagnose đúng layer                           |
| Faithfulness = Factual accuracy             | Answer faithful với context sai → vẫn sai                | Faithfulness chỉ đo grounding; factual accuracy cần external knowledge base |
| Bỏ qua Context Precision vì khó đo          | Retrieval noise tăng cost và giảm quality của generation | Track precision, dùng reranker để lọc chunks không liên quan                |

**🎯 Interview Pattern:**

- Khi thấy: "How do you debug a RAG system that's giving poor answers?"
- Nhớ đến: RAGAS 4 metrics để pinpoint đúng layer đang fail
- Mở đầu: "I'd start with RAGAS metrics — they let me diagnose whether it's a retrieval problem (low Context Precision/Recall) or a generation problem (low Faithfulness/Answer Relevancy) because the fixes are completely different."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Monitoring AI in Production](#4-monitoring-ai-in-production--giám-sát-ai-trong-production) — offline eval tools cho RAG
- ➡️ Để hiểu tiếp: [AI Production Challenges](./07-ai-production-challenges.md) — các challenges RAGAS giúp detect

### Q: What is RAGAS and when do you use it for RAG evaluation? / RAGAS là gì và dùng khi nào? 🔴 Senior

**A:** RAGAS (Retrieval Augmented Generation Assessment) is a framework for evaluating RAG pipelines across four metrics: faithfulness (answer grounded in context), answer relevancy (answer addresses question), context precision (retrieved chunks are relevant), and context recall (all relevant info was retrieved).

```
RAGAS metrics:
  Faithfulness:       Does answer only say things supported by retrieved context?
                      Score 0–1 (1 = fully grounded, 0 = hallucinated)

  Answer Relevancy:   Does the answer actually address the question asked?
                      Score 0–1 (penalizes off-topic/incomplete answers)

  Context Precision:  Of retrieved chunks, how many were actually useful?
                      High = low noise in retrieval (good embedding/reranker)

  Context Recall:     Did retrieval surface ALL relevant information?
                      Requires ground truth — hard to compute without labels

Typical RAGAS CI pipeline:
  1. Curate 50–200 question/ground-truth pairs
  2. Run RAG pipeline on each question
  3. Compute RAGAS scores (uses LLM-as-judge internally)
  4. Fail CI if faithfulness < 0.8 or answer_relevancy < 0.75
  5. Track score trends over time in dashboard
```

Vietnamese: RAGAS đặc biệt hữu ích khi debug RAG system: nếu Faithfulness thấp → model đang hallucinate (không bám context) → fix prompt hoặc retrieval. Nếu Context Precision thấp → retrieval đang kéo về nhiều chunks không liên quan → fix embedding hoặc reranker. Nếu Context Recall thấp → missing relevant chunks → fix chunking strategy hoặc hybrid search. RAGAS dùng LLM để tính score → không free, nhưng nhanh hơn human evaluation và reproducible.

---

### Q: How do you build a regression test suite for an AI feature? / Xây dựng regression test suite cho AI feature thế nào? 🔴 Senior

**A:** Create a golden dataset of (input, expected_output) pairs, define pass/fail criteria as thresholds (not exact match), run the suite in CI on every prompt or model change, and track score trends over time to detect gradual degradation.

```
Regression suite structure:
  golden_set/
    qa_pairs.jsonl         # {input, expected, tags: ["accuracy", "safety"]}
    eval_config.yaml       # thresholds per metric per tag

  CI pipeline:
    1. On PR with prompt/model change:
       run_eval(golden_set, new_config) → scores
    2. Compare to baseline scores (main branch)
    3. Fail if any metric degrades > 5% from baseline
    4. Block merge until regression is addressed

  Key principle: test PROPERTIES, not exact outputs
    ✗ assert response == "The capital is Paris"
    ✓ assert contains_city_name(response, "Paris")
    ✓ assert faithfulness_score(response, context) > 0.8
    ✓ assert response_length_tokens < 500
    ✓ assert not contains_pii(response)
```

Vietnamese: Regression test cho AI khác software test thông thường vì: (1) outputs không deterministic — cần threshold, không so sánh exact. (2) "Correct" thường là fuzzy — dùng LLM-as-judge để score thay vì binary pass/fail. (3) Gradual degradation khó phát hiện — track trend theo thời gian, không chỉ point-in-time. (4) Test case phải có diversity — edge cases, adversarial inputs, different languages. Thực tế: Anthropic, OpenAI đều dùng eval suite hàng nghìn test cases chạy mỗi khi model update.

---

## 5. Interview Q&A Summary / Tổng Kết

| Question                                         | Level | Key Answer                                                                   |
| ------------------------------------------------ | ----- | ---------------------------------------------------------------------------- |
| How do you test LLM outputs?                     | 🟡    | Golden set + structural assertions; avoid exact string matching              |
| What is LLM-as-Judge?                            | 🟡    | Use strong LLM to score another LLM's outputs at scale                       |
| How to prevent regression when changing prompts? | 🔴    | Versioned prompts + golden eval set + CI gate on score threshold             |
| What metrics matter for AI in prod?              | 🔴    | Latency, cost, user feedback, fallback rate, hallucination flags             |
| How to handle non-determinism in tests?          | 🟡    | Test structure/properties not exact output; use threshold-based pass rates   |
| Evaluation vs monitoring difference?             | 🟡    | Eval = offline quality assessment; monitoring = online production health     |
| What is RAGAS?                                   | 🔴    | RAG eval framework: faithfulness, answer relevancy, context precision/recall |
| How to build AI regression suite?                | 🔴    | Golden dataset + threshold scoring + CI gate + trend tracking                |

---

**See also**: [AI Engineering Practice](./05-ai-engineering-practice.md) | [AI Production Challenges](./07-ai-production-challenges.md) | [Agent Patterns](./03-agent-patterns.md)

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **Interviewer:** "Explain LLM-as-judge for AI evaluation — explain it in 30 seconds."

**Ideal 30-second answer / Câu trả lời 30 giây:**

1. LLM-as-judge dùng một LLM mạnh (GPT-4, Claude) để evaluate output của LLM khác theo structured rubric, thay thế human annotation tốn kém.
2. Cơ chế: evaluator LLM nhận (question, answer, reference context) → score theo criteria (accuracy, relevance, safety) → return score + reasoning.
3. Ví dụ: thay vì thuê annotator check 10,000 chatbot responses, dùng GPT-4 judge với structured rubric → ~85% agreement với human raters ở ~1/100 chi phí.
4. Trade-off: scalable và rẻ, nhưng có position bias (favor đáp án đứng trước) và self-serving bias (GPT-4 favor GPT-4-style outputs).

---

## Self-Check / Tự Kiểm Tra

| #   | Loại           | Câu hỏi                                                                                                                                                        |
| --- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Kể tên 4 RAGAS metrics và ý nghĩa của từng metric trong việc diagnose RAG pipeline?                                                                            |
| 2   | 🎨 Visual      | Vẽ sơ đồ CI pipeline cho prompt regression testing: từ "developer changes prompt" đến "merge blocked hoặc approved"?                                           |
| 3   | 🛠️ Application | Thiết kế minimal eval dataset (input, expected properties) cho một customer service chatbot của ngân hàng — cần bao nhiêu cases và cover những loại input nào? |
| 4   | 🐛 Debug       | RAGAS cho thấy Faithfulness = 0.95 nhưng users vẫn phàn nàn câu trả lời sai — nguyên nhân có thể là gì và bạn sẽ debug thế nào?                                |
| 5   | 🎓 Teach       | Giải thích cho junior engineer tại sao "LLM-as-judge" có thể cost-effective hơn human evaluation, và khi nào nó fail (ít nhất 2 failure modes)?                |

💬 **Feynman Prompt:** Giải thích tại sao factuality và faithfulness là different metrics in RAG evaluation — ví dụ khi answer là faithful but not factual (hay ngược lại).

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

- ⬅️ **Built on**: [ML Fundamentals](./01-ml-fundamentals.md) — evaluation metrics (precision, recall) apply to AI evals too
- ⬅️ **Built on**: [AI Engineering Practice](./05-ai-engineering-practice.md) — eval suite is part of prompt engineering workflow
- ⬅️ **Built on**: [AI Production Challenges](./07-ai-production-challenges.md) — evals catch the challenges described there
- 🔗 **Related**: [Testing Theory](../05-software-engineering/04-testing-theory.md) — AI eval is a specialized form of software testing
