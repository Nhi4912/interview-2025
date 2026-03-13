# AI System Evaluation & Testing / Đánh Giá và Kiểm Thử Hệ Thống AI

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [ML Fundamentals](./01-ml-fundamentals.md) | [LLMs & Transformers](./02-llm-and-transformers.md)
> **See also**: [AI Engineering Practice](./05-ai-engineering-practice.md) | [AI Production Challenges](./07-ai-production-challenges.md)

---

## Overview / Tổng Quan

Evaluating AI systems is fundamentally different from evaluating traditional software:
- Traditional software: deterministic → `assert output == expected`
- AI/LLM: probabilistic → outputs vary, quality is subjective, "correctness" is fuzzy

2025 expectation: **Engineers integrating LLMs must know how to evaluate them** — this is now a standard interview topic.

---

## 1. Evaluation Framework / Khung Đánh Giá

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

| Dimension | What it measures | Example metric |
|-----------|-----------------|----------------|
| **Accuracy** | Is the output factually correct? | % correct answers on test set |
| **Relevance** | Does output address the question? | Cosine similarity to ideal response |
| **Coherence** | Is the output well-structured? | Human rating 1-5 |
| **Safety** | Does output avoid harmful content? | % harmful responses in adversarial test set |
| **Groundedness** | Is output supported by context (RAG)? | Citation accuracy |
| **Latency** | How fast? | p50/p95/p99 response time |
| **Cost** | $ per query | Tokens × $/token |

---

## 2. LLM Testing Patterns / Mẫu Kiểm Thử LLM

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

| Question | Level | Key Answer |
|----------|-------|-----------|
| How do you test LLM outputs? | 🟡 | Golden set + structural assertions; avoid exact string matching |
| What is LLM-as-Judge? | 🟡 | Use strong LLM to score another LLM's outputs at scale |
| How to prevent regression when changing prompts? | 🔴 | Versioned prompts + golden eval set + CI gate on score threshold |
| What metrics matter for AI in prod? | 🔴 | Latency, cost, user feedback, fallback rate, hallucination flags |
| How to handle non-determinism in tests? | 🟡 | Test structure/properties not exact output; use threshold-based pass rates |
| Evaluation vs monitoring difference? | 🟡 | Eval = offline quality assessment; monitoring = online production health |
| What is RAGAS? | 🔴 | RAG eval framework: faithfulness, answer relevancy, context precision/recall |
| How to build AI regression suite? | 🔴 | Golden dataset + threshold scoring + CI gate + trend tracking |

---

**See also**: [AI Engineering Practice](./05-ai-engineering-practice.md) | [AI Production Challenges](./07-ai-production-challenges.md) | [Agent Patterns](./03-agent-patterns.md)
