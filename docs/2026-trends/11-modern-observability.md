# 11 — Modern Observability (2026)

> **Track**: Shared / Backend-leaning | **Difficulty**: 🟢 Foundational → 🔴 Senior+
> **Prev**: [10 — Senior Engineer in AI Era](./10-senior-engineer-ai-era.md) · **Next**: [12 — Platform Engineering & DX](./12-platform-engineering-dx.md) · **Index**: [2026 Trends](./README.md) · **TOC**: [docs/00-table-of-contents.md](../00-table-of-contents.md)

---

## 🌍 Real-World Scenario — Why this matters in 2026

**Incident — Datadog outage, March 8 2023 (still the canonical lesson in 2026 interviews):**
A regional Kubernetes upgrade collided with a `systemd-networkd` change and took Datadog itself partially offline for **~24 hours across multiple regions**. Customers — many of whom monitored their own production with Datadog — went **observability-blind exactly during the incident their on-call was paging them about**. Postmortem revealed: (1) the SaaS observability vendor was a **single point of failure** for hundreds of companies' incident response, and (2) most customers had **no local fallback** (no on-host metrics, no log shipping to a second sink, no traces flushed to disk). After the incident, the industry moved hard toward: **OpenTelemetry as the vendor-neutral wire format**, **dual-shipping** (one OTLP collector → multiple backends), and **eBPF auto-instrumentation** so coverage doesn't depend on developers remembering to add SDK calls.

**2026 reinforcement — Honeycomb's "AI agent observability" report (Q1 2026):**
Charity Majors published data showing the **median AI agent in production emits 47 spans per user request** (LLM calls, tool calls, retries, retrieval, guardrail checks) vs **8 spans for a traditional REST request**. Teams using **logs-only** (not traces) took **median 4.2 hours** to debug a misbehaving agent; teams with **OTel traces + GenAI semantic conventions** took **median 18 minutes** — a **14× speedup**. Quote: _"In 2026, if your AI agent isn't traced end-to-end with model name, prompt tokens, tool name, and retrieval IDs as span attributes, you are not running it in production. You are running it in the dark."_

**Vietnamese context — VNG ZaloPay incident, Tết 2025:**
During Tết peak, a payment latency spike was misdiagnosed as "DB slow" based on logs alone for **~90 minutes**. After incident, team adopted **OpenTelemetry + tail-based sampling**; in the next incident (Q3 2025), root cause (a noisy-neighbor pod saturating a shared NIC) was identified in **~7 minutes** because traces showed network span p99 spiking before DB spans did. **Lesson:** logs tell you _what happened_, traces tell you _where in the call graph it happened_, metrics tell you _how often_. You need all three, correlated by `trace_id`.

**Câu hỏi phỏng vấn 2026 hay hỏi về chủ đề này:**

- _"Khi nào dùng log, khi nào dùng trace, khi nào dùng metric? Cho ví dụ một bug bạn chỉ giải được bằng trace."_
- _"Giải thích tail-based vs head-based sampling. Khi nào chọn cái nào? Cost trade-off?"_
- _"Bạn deploy AI agent ra production. OpenTelemetry semantic conventions cho GenAI có gì? Bạn instrument những attribute gì trên span?"_
- _"eBPF auto-instrumentation thay thế được manual SDK instrumentation không? Trade-off là gì?"_

---

## A1. 🧠 Memory Hook — **MeLT-SCAN**

> **MeLT-SCAN** — 7 trụ cột của observability hiện đại 2026.

| Letter | Pillar                   | One-line                                                                              |
| ------ | ------------------------ | ------------------------------------------------------------------------------------- |
| **Me** | **Me**trics              | Aggregated numbers over time (counters, gauges, histograms) — _"how often, how much"_ |
| **L**  | **L**ogs                 | Discrete time-stamped events with structured fields — _"what happened"_               |
| **T**  | **T**races               | Causally-linked spans across services — _"where in the call graph"_                   |
| **S**  | **S**ampling             | Head-based vs tail-based; cost vs fidelity trade-off                                  |
| **C**  | **C**orrelation          | `trace_id` glues logs+metrics+traces; exemplars link metrics→trace                    |
| **A**  | **A**uto-instrumentation | eBPF + OTel SDK auto-mode; coverage without code changes                              |
| **N**  | **N**oise control        | Cardinality budgets, drop rules, aggregation, archival tiers                          |

**Vietnamese mnemonic:** _"**Me L**ạnh, **T**rời **S**áng, **C**ần **Á**o **N**óng"_ (Mê Lạnh Trời Sáng Cần Áo Nóng) → 7 chữ cái đầu = MeLT-SCAN.

**Why these 7 (not 3):** "Three pillars" (logs/metrics/traces) is the 2018 framing. 2026 senior interviewers expect you to add **Sampling, Correlation, Auto-instrumentation, Noise control** because these are the **operational** concerns that decide whether observability **actually works at scale and within budget**. A team can have all 3 pillars and still be blind if sampling drops the 1 trace that mattered, or bankrupt if cardinality explodes.

---

## A2. 🤔 Why × 2 (Surface vs Deep)

### Why (Surface)

Modern systems are distributed, ephemeral (containers, serverless, edge), and increasingly include non-deterministic AI components. Single-host `tail -f` debugging is dead. You need a **vendor-neutral, correlated, sampled** signal pipeline that survives a vendor outage and stays within budget as traffic grows 10×.

### Why (Deep — what 2026 interviewers actually probe)

Three structural shifts make 2026 observability **categorically different** from 2020:

1. **Cardinality explosion is the #1 cost driver, not data volume.**
   - A metric `http_requests_total{method, status, route, user_id, region, version}` with `user_id` cardinality 10M creates **10M time series**. Datadog/New Relic charge per **active time series**, not per byte.
   - 2026 reality: most SaaS observability bills are **70-90% cardinality cost**, not storage cost. Senior engineers who don't understand cardinality budgets get fired during cost reviews.

2. **AI agents broke the assumption "1 user request = small constant number of spans".**
   - REST request: ~5-10 spans. AI agent request: 30-200 spans (LLM calls, tool calls, retries, retrieval, guardrails, sub-agents). Naive head sampling at 1% loses 99% of agent traces, including the 1 that hallucinated a refund.
   - Solution: **tail-based sampling** keep all errored traces + statistical sample of successful, plus **GenAI semantic conventions** for span attributes (model, prompt_tokens, tool_name).

3. **OpenTelemetry won the wire format war (2024-2025), so vendor lock-in moved up the stack.**
   - In 2020, picking Datadog meant Datadog SDK in your code → painful migration. In 2026, OTel SDK in your code → swap backend in a config file. Lock-in is now in **dashboards, alerts, and AI-driven anomaly detection** (the analysis layer), not the wire format.
   - Strategic implication: invest in **OTel instrumentation** (portable) and treat **backend choice** (Datadog vs Honeycomb vs Grafana Cloud vs self-hosted Tempo+Loki+Mimir) as **reversible**.

### Vietnamese — Tại sao quan trọng?

Hệ thống 2026 = phân tán + ephemeral + có AI agent → debug bằng `tail -f` đã chết. Bạn cần pipeline tín hiệu **vendor-neutral, có correlation, có sampling**. 3 thay đổi cấu trúc lớn so với 2020: (1) **cardinality** mới là cost driver chính (không phải volume) — bill SaaS 70-90% là cardinality; (2) **AI agent** phá giả định "1 request = ít span" (agent emit 30-200 span/request → naive sampling 1% mất 99% trace agent); (3) **OpenTelemetry thắng cuộc chiến wire format** → lock-in giờ nằm ở dashboard/alert/AI analysis (không phải SDK), nên chiến lược đúng là: invest vào OTel instrumentation (portable) và coi backend choice là **reversible**.

---

## A3. 🏗️ Layer 1 — Beginner Mental Model

### The 3 Pillars + How They Connect

```
         ┌─────────────────────────────────────────────────┐
         │            ONE USER REQUEST                     │
         │         trace_id = abc123...                    │
         └─────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   ┌─────────┐          ┌──────────┐          ┌─────────┐
   │ METRICS │          │   LOGS   │          │ TRACES  │
   │         │          │          │          │         │
   │ "How    │          │ "What    │          │ "Where  │
   │  many?" │          │ happened?"│          │  slow?" │
   │         │          │          │          │         │
   │ http_   │          │ {ts,     │          │ Span1   │
   │ reqs=42 │◄────────►│  level,  │◄────────►│  ├─Span2│
   │         │ trace_id │  msg,    │ trace_id │  │  ├─S3│
   │ p99=210 │          │ trace_id}│          │  └─Span4│
   └─────────┘          └──────────┘          └─────────┘
        │                     │                     │
        ▼                     ▼                     ▼
   Aggregate           Searchable           Causal graph
   over time          full-text +           of all work
   Cheap to store     fields                done for ONE
   Fast to query      Expensive             request
                      at scale
```

**Plain-English:**

- **Metric** = a number you increment or set, sliced by labels. "Counter of HTTP requests, broken down by status." Cheap. Aggregate. No per-event detail.
- **Log** = a structured event ("user 42 logged in at 10:03"). Rich detail. Expensive at scale. Hard to query causally.
- **Trace** = a tree of **spans**, each span = one unit of work (HTTP call, DB query, LLM call). Spans share a `trace_id`. Tells you the **causal call graph**.

**The glue: `trace_id`.** Every log line emitted _during a request_ should include the `trace_id`. Every metric should be able to point to an **exemplar** trace. This is what turns 3 pillars into 1 navigable system.

### When to use which (the question every interviewer asks)

| Question                                                                     | Use                                                                  |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| "Is the site up?"                                                            | **Metric** (uptime, error rate)                                      |
| "Did request X succeed?"                                                     | **Log** + **Trace**                                                  |
| "Is p99 latency degrading?"                                                  | **Metric** (histogram)                                               |
| "WHY is p99 degrading? Which downstream is slow?"                            | **Trace** (drill from metric → exemplar → span tree)                 |
| "User says order #42 failed — what happened?"                                | **Log** (filter by user/order_id) → jump to **Trace** via `trace_id` |
| "How many 500s in the last hour, by endpoint?"                               | **Metric**                                                           |
| "Show me the _one_ slowest request in the last hour and its full call graph" | **Trace** (with tail sampling that kept slow ones)                   |

---

## A4. 🏗️ Layer 2 — Intermediate (4 Core Concepts with Diagrams)

### Concept 1 — OpenTelemetry Pipeline (the 2026 standard)

```
┌──────────────┐     OTLP        ┌──────────────────────┐    ┌─────────────┐
│  YOUR APP    │ ───────────────►│  OTEL COLLECTOR      │───►│  Backend A  │
│              │  gRPC/HTTP      │  ┌────────────────┐  │    │ (Datadog)   │
│  ┌────────┐  │                 │  │  Receivers     │  │    └─────────────┘
│  │ OTel   │  │                 │  │  (otlp,        │  │
│  │  SDK   │──┘                 │  │   prometheus,  │  │    ┌─────────────┐
│  └────────┘                    │  │   jaeger)      │  │───►│  Backend B  │
│                                │  └───────┬────────┘  │    │ (Honeycomb) │
│  Auto-instr:                   │          ▼           │    └─────────────┘
│  - HTTP client                 │  ┌────────────────┐  │
│  - DB driver                   │  │  Processors    │  │    ┌─────────────┐
│  - LLM SDK                     │  │  - batch       │  │───►│  Backend C  │
│                                │  │  - tail_sample │  │    │ (Loki/Tempo)│
│  Manual instr:                 │  │  - filter      │  │    │  self-host  │
│  - business spans              │  │  - redact_pii  │  │    └─────────────┘
│  - GenAI attrs                 │  └───────┬────────┘  │
└──────────────┘                 │          ▼           │
                                 │  ┌────────────────┐  │
                                 │  │  Exporters     │  │
                                 │  │  (otlp, kafka, │  │
                                 │  │   s3, ...)     │  │
                                 │  └────────────────┘  │
                                 └──────────────────────┘
```

**Why this matters:**

- App emits **OTLP** (one wire format) to a **local collector** (sidecar or daemonset).
- Collector handles **fan-out** (dual-ship to multiple backends), **sampling**, **PII redaction**, **batching**.
- Swap backend = change exporter config. **Zero code change in app.**
- App stays alive even if backend is down (collector buffers + retries).

**Senior gotcha:** Run collector **as agent (per-host/per-pod)** for buffering AND **as gateway (cluster-level)** for tail-sampling. Tail sampling needs all spans of a trace in one place → only the gateway has the full trace.

### Concept 2 — Head-Based vs Tail-Based Sampling

```
HEAD-BASED (decide at request start, cheap, dumb)
─────────────────────────────────────────────────
Request arrives → Roll dice (e.g., 1% chance)
  ├─ Keep  → all spans of this request kept
  └─ Drop  → all spans of this request dropped

Pros: O(1) memory, decided at root span, simple
Cons: Drops 99% of errors too; hot bug = invisible
Use:  Very high QPS (>100k rps) where tail is unaffordable
       OR pre-filter before tail sampler


TAIL-BASED (decide at trace completion, smart, expensive)
─────────────────────────────────────────────────
Request completes → Collect ALL spans for trace
  → Apply policy:
     • IF any span has error=true       → KEEP 100%
     • IF root span duration > p99      → KEEP 100%
     • IF trace contains llm_call       → KEEP 50%
     • ELSE                             → KEEP 1%

Pros: Keep what matters (errors, slow, AI calls)
Cons: Buffer spans in memory until trace done (typ. 30s);
      memory cost = QPS × avg_trace_duration × avg_span_size
Use:  Most production systems in 2026
```

**The 2026 hybrid pattern (Honeycomb, Lightstep, Datadog all converge here):**

1. **Head sample at edge** (drop 90% of bot traffic, health checks) — cheap.
2. **Tail sample at gateway collector** (keep all errors + slow + AI traces, statistical sample of healthy) — smart.
3. Result: 5-10% of original volume retained, but **>95% of debug-worthy traces kept**.

**Cost math (real example, e-commerce site, 50k rps):**

- No sampling: 50k × 86400 × 8 spans = 34.5B spans/day → ~$50k/day on Datadog. Bankrupt.
- Head sampling 1%: 345M spans/day → ~$500/day. But missed 99% of errors. Useless.
- Hybrid (head 10% + tail keep-errors + 1% healthy): ~1.7B spans/day kept → ~$2.5k/day. Affordable AND useful.

### Concept 3 — Cardinality Budgets (the silent budget killer)

```
ANATOMY OF A METRIC
───────────────────
http_requests_total{method, status, route, region, user_id}
       │             │       │       │       │       │
       │             └───────┴───────┴───────┴───────┴── LABELS
       └── METRIC NAME

Time series count = product of (distinct values per label)

Method:  4    (GET, POST, PUT, DELETE)
Status:  6    (200, 201, 400, 404, 500, 503)
Route:   200  (endpoints)
Region:  5    (us-east, us-west, eu, ap, sa)
user_id: 10M  ← KILLER

Total time series = 4 × 6 × 200 × 5 × 10M = 240 BILLION
                                            └─ vendor charges $$ per active series
```

**The rule (memorize this):**

> **Never put unbounded-cardinality fields (user_id, request_id, trace_id, IP, email) as METRIC LABELS. They belong in LOGS or TRACE ATTRIBUTES, not metrics.**

**Cardinality budget pattern (Stripe, Cloudflare publish on this):**

- Each team gets a budget: e.g., **50k active series per service**.
- New metric must go through review IF it adds a label with > 100 values.
- Use **exemplars** to link a metric (low cardinality) to a sample trace (full cardinality detail).
- Alert when service exceeds 80% of budget.

**Anti-pattern that crashes prod:**

```
// BAD — adds user_id to metric, cardinality explodes
counter.add(1, { route: "/checkout", user_id: ctx.user.id });

// GOOD — user_id goes on the trace span (where it belongs)
counter.add(1, { route: "/checkout" });
span.setAttribute("user.id", ctx.user.id);
```

### Concept 4 — eBPF Auto-Instrumentation (the 2025-2026 game-changer)

```
TRADITIONAL SDK INSTRUMENTATION
───────────────────────────────
App code → import OTel SDK → manually wrap HTTP/DB calls
  Pros: Rich business context (user_id, order_id on spans)
  Cons: Requires code change in EVERY service
        Languages without good SDK = blind
        Dependencies you don't own = blind


eBPF AUTO-INSTRUMENTATION (e.g., Beyla, Pixie, Cilium Tetragon)
──────────────────────────────────────────────────────────────
                    ┌─────────────────────────┐
                    │      LINUX KERNEL       │
                    │  ┌─────────────────┐    │
   syscall ───────► │  │  eBPF program   │    │ ──► OTel spans
   (read, write,    │  │  (in kernel,    │    │     (HTTP, DB,
    accept, ...)    │  │   safe sandbox) │    │      gRPC auto-
                    │  └─────────────────┘    │      detected)
                    └─────────────────────────┘
                           ▲
                           │  hooks into syscalls + uprobes
                           │  on libssl, libpq, etc.
                    ┌──────┴──────┐
                    │  ANY APP    │  ← no code change, no SDK,
                    │  any lang   │     no restart needed
                    └─────────────┘

Pros: Zero code change, language-agnostic, captures 3rd-party libs,
      can be deployed to legacy systems
Cons: No business context (just protocol-level attrs),
      requires Linux kernel >= 5.8 typically,
      doesn't see TLS-encrypted payloads without uprobes on libssl
```

**The 2026 pattern: hybrid.**

- **eBPF** = baseline coverage (network spans, DB latency, infra-level) — free, automatic.
- **OTel SDK** = business-critical paths (checkout flow, AI agent, payments) — manual, rich attrs.
- Together: **>95% trace coverage with <20% engineering effort** vs SDK-only.

**Production examples:**

- **Grafana Beyla** (open source, eBPF-based, OTel output) — adopted by Adevinta, Booking.com 2025.
- **Pixie** (Pixie Labs / New Relic) — eBPF auto-instrumentation for Kubernetes.
- **Cilium Hubble + Tetragon** — network-level observability via eBPF (Isovalent).

---

## A5. 🏗️ Layer 3 — Advanced (Senior+ Mental Model)

### The 5 Hard Problems Senior Observability Engineers Solve

#### Problem 1 — Cost Spiral

**Symptom:** Observability bill grows faster than traffic. Q1 = $50k/mo, Q3 = $300k/mo, traffic +40%.
**Root causes (in order of frequency 2026):**

1. **Cardinality explosion** (60% of cases) — someone added `user_id` to a metric label.
2. **Log verbosity** (25%) — DEBUG logs left on in prod, or stack traces logged on every retry.
3. **Trace volume** (10%) — sampling not configured, or sampler accepts everything.
4. **Retention** (5%) — keeping 90 days hot when 7 days hot + 90 days cold suffices.

**Senior fix playbook:**

- **Cardinality audit** monthly: `top 20 metrics by series count → per-team chargeback`.
- **Log levels by environment**: prod = INFO, staging = DEBUG, dev = TRACE. Enforce via lint.
- **Tail sampling with budget cap**: collector configured with max-spans-per-second.
- **Retention tiering**: 7d hot (Datadog/Honeycomb) → 90d cold (S3 + Athena/Loki) → 1yr archive (Glacier).

#### Problem 2 — Vendor Lock-in

**Symptom:** Want to switch from vendor X to Y, but you have 3 years of dashboards, alerts, runbooks tied to X's query language.
**2026 mitigation:**

- **OTel SDK in code** (portable wire format).
- **Grafana** as dashboard layer (datasource-agnostic) → swap underlying backend.
- **Alert rules in code** (Terraform/Pulumi modules) using vendor-agnostic abstractions where possible.
- **Runbook links in alerts** point to internal wiki, not vendor URL.

#### Problem 3 — AI Agent Observability (NEW in 2026)

**Symptom:** Agent in prod, user complains "it gave wrong refund amount". You have logs but can't reconstruct: which model? which prompt? which tool calls? which retrieval docs?
**Solution — OTel GenAI semantic conventions (stable in OTel 1.30, late 2025):**

```typescript
import { trace } from "@opentelemetry/api";

const span = trace.getTracer("agent").startSpan("llm.chat");
span.setAttributes({
  "gen_ai.system": "openai",
  "gen_ai.request.model": "gpt-4.1-mini",
  "gen_ai.request.temperature": 0.2,
  "gen_ai.request.max_tokens": 1000,
  "gen_ai.usage.input_tokens": 1247,
  "gen_ai.usage.output_tokens": 89,
  "gen_ai.response.finish_reason": "stop",
  "gen_ai.prompt.0.role": "system",
  // NOTE: prompt content often redacted/hashed for PII; opt-in only
});
// Tool calls become CHILD spans
const toolSpan = tracer.startSpan("tool.lookup_order", { parent: span });
toolSpan.setAttributes({
  "gen_ai.tool.name": "lookup_order",
  "gen_ai.tool.call.id": "call_abc123",
});
```

**Why this matters in interview:** A senior who knows GenAI semantic conventions signals "I have shipped agents to production in 2025-2026, not just played with ChatGPT."

#### Problem 4 — Sampling Without Bias

**Symptom:** Your 1% sample missed the regression because the bug only fires for users in `region=ap-southeast-1` (Vietnam) which is 0.3% of traffic.
**Senior solution — stratified sampling:**

- Sample at higher rate for low-volume but high-value cohorts (paying users, specific regions).
- Always keep 100% of: errors, slow requests, requests from internal employees, requests with feature_flag=X enabled.
- Use OTel collector's `tail_sampling` processor with multi-policy:

```yaml
tail_sampling:
  policies:
    - name: errors
      type: status_code
      status_code: { status_codes: [ERROR] }
    - name: slow
      type: latency
      latency: { threshold_ms: 1000 }
    - name: ap_region
      type: string_attribute
      string_attribute: { key: region, values: [ap-southeast-1] }
    - name: baseline
      type: probabilistic
      probabilistic: { sampling_percentage: 1 }
```

#### Problem 5 — SLO-Driven Alerting (vs Metric-Threshold Alerting)

**Symptom:** Page fatigue. On-call gets paged 30 times/week, ignores alerts, real incident missed.
**Senior solution — SLO-based alerting (Google SRE book + 2026 refinements):**

- Define SLO: "99.9% of checkout requests complete in <500ms over 30d."
- Error budget = (1 − 0.999) × 30d = **43.2 minutes/month** of allowed badness.
- **Burn rate alerts** instead of threshold:
  - Page if burning **2% of monthly budget in 1 hour** (= 36× burn rate, will exhaust in ~28h).
  - Ticket if burning **10% in 6 hours** (= 28× burn rate, slower).
- Result: 30 pages/week → 2 pages/week, all actionable.

### Architecture: Reference 2026 Observability Stack

```
              ┌─────────────────────────────────────────────┐
              │              APPLICATIONS                   │
              │  (OTel SDK + GenAI conventions for agents)  │
              └────────────────────┬────────────────────────┘
                                   │  OTLP
                                   ▼
              ┌─────────────────────────────────────────────┐
              │  OTEL COLLECTOR — AGENT (per-pod/per-host)  │
              │  - Receive OTLP                             │
              │  - Add resource attrs (host, k8s.*)         │
              │  - Batch + retry buffer                     │
              └────────────────────┬────────────────────────┘
                                   │  OTLP
                                   ▼
              ┌─────────────────────────────────────────────┐
              │  OTEL COLLECTOR — GATEWAY (cluster-level)   │
              │  - Tail sampling                            │
              │  - PII redaction                            │
              │  - Cost guards (max-spans-per-sec)          │
              │  - Fan-out to multiple backends             │
              └─────┬──────────────┬──────────────┬─────────┘
                    │              │              │
                    ▼              ▼              ▼
            ┌──────────┐  ┌──────────────┐  ┌──────────┐
            │  TRACES  │  │   METRICS    │  │   LOGS   │
            │  Tempo / │  │  Mimir /     │  │  Loki /  │
            │  Jaeger /│  │  Prometheus /│  │  ELK /   │
            │  Honeyc. │  │  VictoriaM.  │  │  CloudW. │
            └─────┬────┘  └──────┬───────┘  └─────┬────┘
                  └──────────────┼────────────────┘
                                 ▼
                       ┌──────────────────┐
                       │     GRAFANA      │
                       │  (unified UI:    │
                       │   correlate via  │
                       │   trace_id +     │
                       │   exemplars)     │
                       └──────────────────┘
                                 │
                                 ▼
                       ┌──────────────────┐
                       │  ALERTMANAGER /  │
                       │  PagerDuty       │
                       │  (SLO burn-rate  │
                       │   based)         │
                       └──────────────────┘
```

---

## A6. ⚠️ Common Mistakes (8-10 rows, junior → senior)

| #   | Sai lầm                                                                    | Tại sao sai                                                                                        | Đúng là                                                                                                         |
| --- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1   | Logging instead of tracing for distributed flow ("just grep all services") | Log không có causal link → reconstruct call graph thủ công, mất giờ; impossible khi parallel/async | Use traces; log chỉ cho discrete events; mọi log line carry `trace_id`                                          |
| 2   | Putting `user_id` / `request_id` as METRIC label                           | Cardinality explosion → vendor bill 10× / OOM Prometheus                                           | High-cardinality fields → trace span attributes; metrics chỉ low-cardinality labels (route, status, region)     |
| 3   | Head-based sampling at 1% in production                                    | Drop 99% of errors → bug invisible đúng lúc cần debug                                              | Tail-based sampling: keep 100% errors + slow + statistical sample of healthy                                    |
| 4   | Vendor SDK directly in business code (Datadog SDK, NR SDK)                 | Lock-in; switching = rewrite instrumentation                                                       | OpenTelemetry SDK; vendor lives in Collector exporter (swap = config change)                                    |
| 5   | DEBUG logs left enabled in production                                      | 10× log volume + bill spike + slow log queries + sometimes leak PII                                | Log levels per env (prod=INFO); structured logs only; sample DEBUG logs if needed                               |
| 6   | Threshold alerts ("alert if error rate > 1%")                              | Page fatigue; doesn't reflect user impact; flaps during deploys                                    | SLO-based alerts với burn-rate (page if burning 2% budget in 1h = 36× rate)                                     |
| 7   | No correlation between logs/metrics/traces                                 | "I see latency spike in metric" → can't drill to trace → debug from scratch                        | Inject `trace_id` into every log; metrics have **exemplars** linking to sample traces                           |
| 8   | AI agent logged as one log line per LLM call, no spans                     | Can't debug multi-step agent (which tool? which retrieval doc? which retry?)                       | Each LLM call + tool call = OTel span with GenAI semantic conventions (model, tokens, tool_name, finish_reason) |
| 9   | Single SaaS observability vendor with no fallback                          | Vendor outage = you go blind during the very incident you need observability for                   | Dual-ship via Collector to 2 backends; OR primary SaaS + cold archive in S3 for replay                          |
| 10  | Tail sampling configured per-pod (not at gateway)                          | Tail sampling needs full trace in one place; per-pod only sees partial trace → wrong decision      | Tail sampling at GATEWAY collector (cluster-level); agent collectors only batch/buffer                          |

---

## A7. 🎯 Interview Pattern — How questions escalate

```
🟢 Green (junior — Bloom L1-L2)
   "Difference between log, metric, trace?"
   "What is OpenTelemetry?"
   "What does p99 latency mean?"

🟡 Yellow (mid → senior — Bloom L3-L4)
   "Walk me through how you'd debug a p99 spike using your observability stack."
   "Explain head-based vs tail-based sampling. When use which?"
   "How do you control cardinality cost on metrics?"
   "How do you correlate a metric spike to the specific failing request?"

🔴 Red (senior+ — Bloom L4-L6, design + judgment)
   "Design observability for an AI agent system with 10M users.
    Cover: signal types, sampling, GenAI conventions, cost budget, vendor strategy."
   "Your observability bill went 6× this quarter. Diagnose and propose 90-day fix."
   "Compare 3 architectures: SaaS-only (Datadog), self-hosted (LGTM), hybrid.
    Decision matrix: cost, ops burden, vendor risk, AI/ML feature gap."
```

**Interviewer's hidden rubric for red questions:**

- Names cardinality as #1 cost driver: **+1**.
- Mentions OTel GenAI semantic conventions for AI agents: **+1**.
- Distinguishes head vs tail sampling with concrete numbers: **+1**.
- Considers vendor outage / dual-shipping as a risk: **+1**.
- Talks about SLO-based alerting (not threshold): **+1**.
- Brings up cardinality budgets / chargeback: **+1**.
- 4+ of 6 = senior signal. 6/6 = staff signal.

---

## A8. 🔗 Knowledge Chain (prerequisites & follow-ups)

**Prerequisites (you should know before this topic):**

- HTTP / gRPC basics (status codes, request lifecycle).
- Distributed systems fundamentals (services, RPC, queues).
- Time-series basics (counters, gauges, histograms, percentiles).
- Linux processes & syscalls (for eBPF section).

**Builds on (other 2026-trends files):**

- [09 — AI Agent Evaluation Production](./09-ai-agent-evaluation-production.md) — agent observability complements eval (eval = pre/post-deploy quality, observability = runtime telemetry).
- [04 — Edge Computing & Serverless 2026](./04-edge-computing-serverless-2026.md) — edge observability is hard mode (can't run heavy collector at edge; OTel-over-Kafka pattern).

**Enables (what you can tackle after mastering this):**

- SLO/SLI engineering (Google SRE book ch. 4, but with 2026 updates).
- Chaos engineering (need observability before injecting faults).
- Cost engineering for cloud-native systems.
- AI Ops / AIOps (anomaly detection, auto-remediation — needs clean signal first).

**Cross-track links:**

- BE: [shared/backend-systems/observability/](../shared/) (existing material — this file extends with 2026-specific eBPF + GenAI).
- FE: Real User Monitoring (RUM) is the FE cousin; same OTel conventions apply (`@opentelemetry/sdk-trace-web`).

---

# B. Q&A — 10 Questions Graded by Difficulty

> Format: Question → Strong Answer (✅) → Weak Answer (❌) → 💡 Interview Signal

---

### 🟢 B1 — "What's the difference between a log, a metric, and a trace?"

**✅ Strong:**

> "Three different data shapes for three different questions. **Metric** is an aggregated number over time with low-cardinality labels — answers _how often / how much_ — e.g., `http_requests_total{status=500} = 47`. Cheap to store, fast to query, but you lose per-event detail. **Log** is a discrete time-stamped event with structured fields — answers _what happened_ — e.g., `{ts: ..., level: ERROR, msg: 'payment failed', user_id: 42, trace_id: abc}`. Rich detail, expensive at scale. **Trace** is a tree of spans causally linked by a `trace_id`, each span is one unit of work — answers _where in the call graph it slowed down or failed_. The three correlate via `trace_id`: every log emitted during a request carries the trace_id, and metrics expose **exemplars** that point to a sample trace. In 2026 the standard wire format is OpenTelemetry, so all three are emitted via the same SDK."

**❌ Weak:**

> "Logs are text, metrics are numbers, traces are for distributed systems."
> _(Misses correlation, misses cardinality, misses use-case mapping.)_

**💡 Interview Signal:**

- ✅ Strong: _"Names trace_id correlation + exemplars + cardinality concern."_
- ❌ Weak: _"Lists definitions without explaining when to use each or how they connect."_

---

### 🟢 B2 — "What does p99 latency mean? Why not just use average?"

**✅ Strong:**

> "p99 = 99th percentile = the latency value such that 99% of requests are faster and 1% are slower. If p99 = 800ms, then 1 in 100 users waits 800ms or more. Average is misleading because latency distributions are **right-skewed** — a few very slow requests inflate the average but most users see better. Worse, average hides bimodal distributions (e.g., 90% of requests at 50ms, 10% at 5s averages to 545ms which describes nobody). p99 forces you to confront the **tail** which is what users actually complain about. In 2026, mature teams track p50/p95/p99/p99.9 from a histogram metric (Prometheus `histogram` or OTel histogram), with `histogram_quantile()` queries; they alert on p99 burn rate against an SLO, not on average."

**❌ Weak:**

> "p99 is the slowest 1% of requests."
> *(Wording imprecise — p99 is the *threshold*, not the *set*; missing why-not-average.)*

**💡 Interview Signal:**

- ✅ Strong: _"Contrasts with average + explains right-skew + connects to SLO."_

---

### 🟢 B3 — "What is OpenTelemetry and why did the industry standardize on it?"

**✅ Strong:**

> "OpenTelemetry (OTel) is a CNCF project that defines: (1) **APIs** in every major language for emitting traces/metrics/logs, (2) **SDKs** that implement those APIs, (3) the **OTLP wire protocol** (gRPC + HTTP+protobuf), and (4) the **Collector** — a vendor-neutral pipeline binary that receives, processes, and exports telemetry. The industry standardized on it (effectively 2023-2025) because before OTel, every vendor had its own SDK — picking Datadog meant Datadog SDK in your code, switching meant rewriting instrumentation. With OTel, your code emits OTLP, the Collector ships to whatever backend (Datadog, Honeycomb, Grafana Cloud, self-hosted Tempo+Loki+Mimir). The lock-in moves from SDK to **dashboards/alerts** (the analysis layer), which is much cheaper to migrate. In 2026, OTel also defines **semantic conventions** — standard attribute names like `http.request.method`, `db.system`, and the new `gen_ai.*` family for AI workloads — so different tools can analyze your traces without per-vendor mapping."

**❌ Weak:**

> "It's a standard for observability. Like a common API for logs and metrics."
> _(True but shallow; misses Collector, OTLP, semantic conventions, lock-in argument.)_

**💡 Interview Signal:**

- ✅ Strong: _"Explains 4 components + gives the strategic 'lock-in moved up the stack' insight."_

---

### 🟡 B4 — "Walk me through debugging a p99 latency spike using your observability stack."

**✅ Strong:**

> "Step 1 — **Confirm via metric**. Open Grafana, look at `http_request_duration_seconds` histogram, query `histogram_quantile(0.99, ...)`. Confirm spike, identify which **service / route / region** the spike is concentrated in (low-cardinality dimensions). Step 2 — **Click an exemplar**. The histogram exposes exemplars (sample trace_ids for buckets); click one in the slow bucket → jump to the **trace UI** (Tempo / Jaeger / Honeycomb). Step 3 — **Read the span tree**. Find which child span is dominating duration. Common culprits: a downstream HTTP call, a DB query, a lock contention (long span with no children), an LLM call that retried 3×. Step 4 — **Pivot to logs**. Filter logs by that `trace_id` to see exactly what error or context the slow span had. Step 5 — **Pivot to metrics again** with the new dimension. If the slow span is `db.query.users`, check DB metrics: connection pool saturation? Lock waits? Slow query log? Step 6 — **Hypothesis + fix + verify**. Make change, watch p99 metric return to baseline, watch error budget recover. Total time with good observability: 10-30 min. Without: hours."

**❌ Weak:**

> "Look at logs and find the slow request, then check the database."
> _(Misses metric→trace→log pivot pattern, no exemplars, no SLO framing.)_

**💡 Interview Signal:**

- ✅ Strong: _"Demonstrates metric → exemplar → trace → log pivot chain. Names actual queries / UI flow."_

---

### 🟡 B5 — "Head-based vs tail-based sampling — when do you use which?"

**✅ Strong:**

> "**Head-based** decides at request start (root span) whether to keep all spans of the trace; cheap, O(1), but **dumb** — it drops errors at the same rate as successes, so a 1% sampler loses 99% of bugs. **Tail-based** waits until the trace completes, sees all spans, then applies a policy: keep 100% of errors, keep 100% of slow requests, statistical sample of healthy. Smart but expensive — needs to buffer all spans of a trace in memory until completion (typically 30s window). Memory cost ≈ QPS × avg_trace_duration × avg_span_size, easily 10s of GB at high QPS.

The 2026 hybrid pattern: **head sample at edge** to drop bots and health checks (cheap), **tail sample at gateway collector** for the rest (smart). Result: 5-10% of original volume, but >95% of debug-worthy traces retained.

**Decision rule:**

- Very high QPS (>100k rps), simple system, cost-constrained → head-only.
- Normal production system in 2026 → hybrid (head pre-filter + tail).
- Low QPS, high-value traces (payments, AI agents) → keep 100%, no sampling.

**Critical gotcha:** tail sampling MUST run at the gateway (cluster-level collector) where the full trace lands, NOT at per-pod agent collectors which only see partial traces."

**❌ Weak:**

> "Head is at the start, tail is at the end. Tail is more accurate."
> _(No cost analysis, no hybrid pattern, no gateway gotcha.)_

**💡 Interview Signal:**

- ✅ Strong: _"Cost numbers + hybrid pattern + names gateway gotcha."_

---

### 🟡 B6 — "How do you control metric cardinality cost?"

**✅ Strong:**

> "Cardinality is the #1 observability cost driver in 2026 — more than data volume. The rule: **never put unbounded-cardinality fields (user_id, request_id, IP, email, trace_id) as METRIC LABELS**. Those belong in trace span attributes or log fields, not metrics.

Operational practices:

1. **Cardinality budget per service** — e.g., 50k active series. Alert at 80%.
2. **Pre-merge linting** — block PRs that add a label with > 100 distinct values to a metric.
3. **Monthly cardinality audit** — rank top 20 metrics by series count, chargeback to teams.
4. **Use exemplars** — store low-cardinality metric (`http_requests_total{route, status}`) and link to a sample trace via exemplar; the trace carries the high-cardinality detail (user_id, etc.).
5. **Aggregate at source** — instead of `requests_per_user{user_id}`, expose `requests_per_user_bucket` (histogram of requests-per-user) which is bounded.
6. **Drop rules at collector** — if a label leaked, the OTel collector or Prometheus relabel_config can drop it before ingestion.

Real example: I've seen a team's Datadog bill go from $40k/mo to $180k/mo in 6 weeks because someone added `customer_id` to a metric label. Fix took 1 PR (move it to a span attribute), bill went back."

**❌ Weak:**

> "Use fewer labels."
> _(True but unhelpful — no rule, no tooling, no chargeback.)_

**💡 Interview Signal:**

- ✅ Strong: _"States the absolute rule + names exemplars + has war story / numbers."_

---

### 🟡 B7 — "How does eBPF auto-instrumentation differ from SDK instrumentation? When use each?"

**✅ Strong:**

> "**SDK instrumentation** (OTel SDK in your code): you import the OTel library, manually wrap or auto-wrap (via instrumentation libraries) HTTP clients, DB drivers, etc. You can attach **business context** as span attributes (user_id, order_id, feature_flag). Cons: requires code change in every service, languages with weak SDK support (Elixir, OCaml) get poor coverage, third-party libraries you don't control are blind.

**eBPF auto-instrumentation** (e.g., Grafana Beyla, Pixie, Cilium Tetragon): runs in the **Linux kernel** as sandboxed bytecode, hooks into syscalls and uprobes (e.g., libssl, libpq). Captures HTTP/gRPC/DB traffic at the protocol level **without any code change, restart, or SDK**. Works for any language. Pros: zero engineering effort, works on legacy systems, captures third-party libs. Cons: no business context (just protocol attrs like `http.method`, `db.statement`), needs Linux kernel ≥ 5.8 typically, doesn't see TLS-encrypted payloads without uprobing libssl which has security implications.

**The 2026 hybrid pattern:** eBPF for **baseline coverage** (network/DB/HTTP across all services) → free and automatic. SDK for **business-critical paths** (checkout, AI agent, payments) → manual but with rich attrs. Together: >95% trace coverage at <20% engineering effort vs SDK-only.

**When NOT to use eBPF:** kernel-restricted environments (some FaaS, App Runner, App Engine flex), Windows-heavy fleets (eBPF on Windows is nascent in 2026), or when you must capture business context that lives only in app memory."

**❌ Weak:**

> "eBPF is automatic, SDK is manual. Use eBPF if you can."
> _(No trade-off analysis, no business-context distinction, no environment constraints.)_

**💡 Interview Signal:**

- ✅ Strong: _"Names hybrid pattern + business-context trade-off + environmental constraints."_

---

### 🔴 B8 — "Design observability for an AI agent system serving 10M users. Cover: signal types, sampling, GenAI conventions, cost budget, vendor strategy. 15 minutes."

**✅ Strong (structured answer):**

> **Step 1 — Clarify (30s):** "Quick assumptions: ~50 rps avg, 500 rps peak; agent does ~30 spans per request (LLM + tools + retrieval + guardrails); error rate target 0.5%; budget question: do we have cost ceiling? Assume $20k/mo. Compliance: PII redaction needed (user prompts may contain PII)."
>
> **Step 2 — Architecture:**
>
> ```
> [App + OTel SDK with GenAI conventions]
>          │ OTLP
>          ▼
> [OTel Collector — Agent (per-pod)]   ← buffer, batch, add k8s attrs
>          │ OTLP
>          ▼
> [OTel Collector — Gateway (3 replicas)]
>     ├─ tail_sampling: 100% errors, 100% slow (>2s), 100% guardrail-blocked,
>     │                 50% with retrieval, 5% baseline
>     ├─ redact processor: hash gen_ai.prompt.* and gen_ai.completion.* by default
>     ├─ cost guard: max 10k spans/sec
>     └─ fan-out:
>         ├─ Honeycomb (primary, hot, 7d retention) — for live debug
>         ├─ S3 + Parquet (cold, 1y retention) — for replay/audit/eval
>         └─ Prometheus/Mimir (metrics only, separate cardinality budget)
> ```
>
> **Step 3 — Signal types:**
>
> - **Metrics** (low-cardinality only): `agent_requests_total{model, route, status}`, `llm_tokens_total{model, type=input|output}`, `tool_calls_total{tool_name, status}`, `agent_request_duration_seconds_bucket`. Cardinality budget: 30k series/service.
> - **Traces** (rich, sampled): every LLM call = span with full GenAI conventions (`gen_ai.system`, `gen_ai.request.model`, `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens`, `gen_ai.response.finish_reason`). Tool calls = child spans (`gen_ai.tool.name`, `gen_ai.tool.call.id`). Retrieval = span with `retrieval.doc_ids` (hashed if sensitive). Guardrails = span with `guardrail.policy`, `guardrail.outcome`.
> - **Logs**: structured, INFO+ in prod, every line carries `trace_id`. Errors include full stack + redacted prompt hash.
>
> **Step 4 — Sampling math:**
> 50 rps avg × 86400s × 30 spans = 130M spans/day baseline. With tail sampling keeping ~10% effective (errors + slow + 5% baseline): ~13M spans/day. At Honeycomb's $0.10 per million events (illustrative), that's ~$40/day = $1.2k/mo for traces. Plus metrics (~$2k/mo at our cardinality), plus S3 cold (~$200/mo). Total ~$3.5k/mo, well under $20k ceiling, leaving headroom for 5× traffic growth.
>
> **Step 5 — GenAI semantic conventions (critical for agents):** Use OTel 1.30+ stable conventions: `gen_ai.system`, `gen_ai.request.model`, `gen_ai.request.temperature`, `gen_ai.usage.{input,output}_tokens`, `gen_ai.response.finish_reason`. For tool calls: `gen_ai.tool.name`, `gen_ai.tool.call.id`, `gen_ai.tool.input` (often hashed). For RAG: custom but consistent attrs `retrieval.query_hash`, `retrieval.doc_ids`, `retrieval.top_k`. **PII discipline:** prompts/completions are PII by default → hash or redact at collector unless explicit user consent for full capture (debugging-only flag).
>
> **Step 6 — Vendor strategy:**
>
> - **Primary:** Honeycomb (BubbleUp anomaly detection + native trace UX is ahead of Datadog for AI workloads in 2026).
> - **Insurance:** dual-ship to S3 cold archive — survives Honeycomb outage, also feeds eval pipeline (replay traces against new prompts/models, see file 09).
> - **Avoid:** vendor-specific SDK in app code; everything is OTel.
>
> **Step 7 — Alerting (SLO-based):**
>
> - SLO 1: 99% of agent responses in <3s over 30d. Page on burn rate >36×/h, ticket on >10×/6h.
> - SLO 2: 99.5% of agent responses pass all guardrails. Page on burn rate >36×/h.
> - SLO 3: Hallucination rate <2% (computed nightly from LLM-judge eval on sampled traces — ties to file 09).
>
> **Step 8 — Operational hygiene:**
>
> - Monthly cardinality review with chargeback per team.
> - PII redaction policies in code review checklist.
> - Runbook in alert payload, not vendor-specific URL.
> - Quarterly DR drill: simulate Honeycomb outage, verify S3 + Grafana fallback works.
>
> **Step 9 — What I'm NOT building (scope discipline):**
>
> - No custom anomaly detection — use Honeycomb BubbleUp.
> - No custom dashboard framework — Grafana + Honeycomb queries.
> - No log-only path for AI calls — they MUST be spans.

**❌ Weak:**

> "Use Datadog with all logs and metrics, set up some dashboards, alert if errors > 1%."
> _(Single vendor, no sampling, no GenAI conventions, threshold not SLO, no PII handling.)_

**💡 Interview Signal:**

- ✅ Strong: _"Has cost math, names GenAI conventions specifically, distinguishes hot/cold, ties to eval pipeline (cross-file thinking), explicit out-of-scope."_
- ❌ Weak: _"Generic 'use a tool' answer; no numbers, no AI-specific concerns."_

---

### 🔴 B9 — "Your observability bill went 6× this quarter, from $40k/mo to $240k/mo. Traffic only grew 30%. Diagnose and propose a 90-day fix plan."

**✅ Strong:**

> **Diagnosis (week 1):**
>
> Pull breakdown from vendor — almost always one of: (1) cardinality explosion in metrics, (2) log volume blowup, (3) trace sampling disabled, (4) retention extended.
>
> Run these queries:
>
> 1. **Top 20 metrics by active series count.** If one metric jumped from 10k → 5M series, that's #1 suspect; check what label was added recently.
> 2. **Top 20 log sources by volume/day.** Look for a service whose log volume jumped — usually DEBUG enabled accidentally, or a retry loop logging stack traces.
> 3. **Trace ingest rate vs sample config.** Did someone disable tail sampling? Did a new service deploy without sampling?
> 4. **Retention settings.** Did anyone extend hot retention from 7d to 30d?
>
> Hypothesis (typical): cardinality is 60% of the increase, log volume is 25%, sampling regression is 10%.
>
> **30-day plan — stop the bleeding:**
>
> - **Day 1-3:** Identify the offending high-cardinality label(s). Push hotfix: drop the label at the collector via relabel_config (no app code change needed). Bill drops immediately.
> - **Day 4-7:** Set log level to INFO in prod across all services. Add lint rule blocking `console.log`/`logger.debug` from being introduced in new PRs without an `// observability-approved` comment.
> - **Day 8-14:** Restore tail sampling at gateway collector. Verify error rate visibility unchanged.
> - **Day 15-30:** Reduce hot retention to 7d, push older data to S3 cold archive. Verify queries against cold tier work (slower but acceptable for >7d-old questions).
>
> Expected after 30 days: bill back to ~$60k/mo (1.5× original, justified by 30% traffic growth + some headroom).
>
> **60-day plan — build guardrails:**
>
> - **Cardinality budget per service** (start at 50k active series). Implement chargeback dashboard. Page team lead at 90% of budget.
> - **Pre-merge linting:** OTel collector linter checks PRs that add new metric labels; blocks if cardinality estimate > 100 distinct values without explicit override + reason.
> - **Cost dashboard per team** in Grafana, refreshed daily, shared in #engineering Slack.
> - **Quarterly cost review** in engineering all-hands.
>
> **90-day plan — structural fix:**
>
> - **Migrate vendor-locked dashboards/alerts to Grafana** (vendor-agnostic). Reduces vendor pricing leverage at next renewal.
> - **Evaluate self-hosted LGTM stack** (Loki+Grafana+Tempo+Mimir on K8s) for non-critical workloads — typically 40-60% cheaper at our scale, with ops cost factored in.
> - **Adopt OTel GenAI semantic conventions** (we shipped agents but didn't standardize attrs — hard to query, hard to control cost on AI traces).
>
> **What I won't promise:**
>
> - Bill back to $40k. Traffic grew 30%, AI features added, can't undo. Realistic floor is $55-70k/mo with proper hygiene.
> - Fixing this without organizational change. Cost discipline requires per-team accountability, not just tooling.
>
> **Risk I'd flag to leadership:**
>
> - The 6× spike happened because we had no cardinality budget and no chargeback. If we just fix the immediate cause without these guardrails, it'll happen again in 6 months with a different metric.

**❌ Weak:**

> "I'd switch to a cheaper vendor or self-host."
> _(Doesn't diagnose, doesn't address root cause — switching vendor with same bad practices = same problem at lower per-unit price, until cardinality grows again.)_

**💡 Interview Signal:**

- ✅ Strong: _"Diagnostic queries first, structural fix second, organizational change third. Names cardinality as primary suspect with prior probability. Refuses to promise impossible numbers."_
- ❌ Weak: _"Jumps to solution without diagnosis."_

---

### 🔴 B10 — "Compare 3 observability architectures: SaaS-only (Datadog/New Relic), self-hosted (LGTM stack), hybrid. Build a decision matrix and recommend for a 200-engineer fintech."

**✅ Strong:**

> **Decision matrix (1 = worst, 5 = best for this dimension):**
>
> | Dimension                                   | SaaS-only                                            | Self-hosted (LGTM)                                     | Hybrid                                                              |
> | ------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------- |
> | **Time to value**                           | 5 (sign up, point SDK, done in days)                 | 1 (3-6 months to operate well)                         | 3 (SaaS first, migrate gradually)                                   |
> | **Cost at scale**                           | 1 ($100k+/mo at our size)                            | 5 (~$20-40k/mo infra + 1.5 SRE)                        | 4 (move heavy workloads to self-host, keep SaaS for AI/UX-critical) |
> | **Ops burden**                              | 5 (vendor handles ops)                               | 1 (you operate Loki/Tempo/Mimir HA, scaling, upgrades) | 3 (split ownership)                                                 |
> | **Vendor lock-in risk**                     | 1 (queries, alerts, AI features tied to vendor)      | 5 (everything OSS)                                     | 3 (mitigated by OTel + Grafana)                                     |
> | **AI/ML features (anomaly detect, AI ops)** | 5 (Datadog Watchdog, NR Lookout, Honeycomb BubbleUp) | 2 (limited — Grafana ML is nascent in 2026)            | 4 (use SaaS for the workloads that benefit)                         |
> | **Compliance (data residency, SOC2)**       | 3 (vendor-dependent, region availability varies)     | 5 (full control, on-prem option)                       | 4 (sensitive data → self-host, rest → SaaS)                         |
> | **Outage blast radius**                     | 1 (vendor outage = you go blind)                     | 4 (your outage but contained)                          | 4 (dual-ship survives either failing)                               |
> | **Team skill required**                     | 2 (low — config + dashboards)                        | 5 (high — K8s, Helm, storage, scaling)                 | 4 (medium-high)                                                     |
>
> **For a 200-engineer fintech specifically:**
>
> Constraints that matter most:
>
> 1. **Compliance:** Fintech needs SOC2, often regional data residency (e.g., SBV requirements in Vietnam). → push toward self-host or hybrid.
> 2. **Cost trajectory:** 200 engineers usually means 100-500 services, easily $200k+/mo on pure SaaS. → self-host or hybrid.
> 3. **AI features in product:** if product has AI, need GenAI-native observability — Honeycomb / Datadog AI Ops are ahead of self-hosted in 2026. → keep some SaaS.
> 4. **Ops capacity:** 200 engineers usually means a 4-8 person platform team. Operating LGTM at HA is 1.5-2 FTE. Affordable.
>
> **Recommendation: Hybrid, with this split:**
>
> - **Self-hosted (LGTM on dedicated K8s):** all metrics (Mimir), all logs (Loki), all traces from internal/non-customer-facing services (Tempo). Cheapest per-unit, full data control.
> - **SaaS (Honeycomb + Datadog):** customer-facing services + AI agent traces (Honeycomb for trace UX + BubbleUp), infrastructure metrics (Datadog for managed integrations like AWS/RDS). Pay for the AI features and ops-free experience where they matter most.
> - **OTel everywhere:** all apps emit OTLP, Collector decides where to ship. Lock-in stays at the dashboard/alert layer (mitigated by Grafana being shared frontend).
> - **Cold archive in S3:** all traces + logs land in S3 Parquet for 1y. Disaster recovery + replay for eval (file 09).
>
> **Migration roadmap (12 months):**
>
> - Q1: Stand up LGTM stack, dual-ship metrics (SaaS + self-host).
> - Q2: Cut metrics to self-host primary, validate alerts work, retire SaaS metrics.
> - Q3: Migrate non-customer-facing logs+traces to self-host.
> - Q4: Keep customer-facing + AI on SaaS; review cost + ops burden; decide whether to push further self-host or stop.
>
> **Counterintuitive insight (senior signal):**
> "Pure self-hosted often _fails_ not on tech but on **org capacity**: the platform team gets pulled to product work, observability stack rots, alerts stop firing, no one notices for 3 months. The hybrid is more resilient organizationally because the SaaS portion provides a fallback when the platform team is over-allocated. **Buy ops-burden insurance, not just features.**"
>
> **What I'd push back on:**
> If exec says "go pure SaaS for simplicity" → counter with 24-month TCO + lock-in risk. If exec says "go pure self-host to save money" → counter with platform team availability honesty + show that AI feature gap will hurt product velocity.

**❌ Weak:**

> "Use Datadog because it's the easiest. Self-hosted is too hard."
> _(No matrix, no fintech-specific reasoning, no migration plan, no cost numbers.)_

**💡 Interview Signal:**

- ✅ Strong: _"Multi-dimensional matrix + context-specific weighting + migration plan + counterintuitive org-capacity insight + willing to push back on bad exec direction."_
- ❌ Weak: _"Picks one extreme without analysis."_

---

# C. Mastery Reinforcement

---

## C1. 📋 Overview Sheet

| Topic                                                         | Pillar / Concept                                      | Where it shows up                                                              |
| ------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------ |
| 3 pillars (logs/metrics/traces)                               | Foundation — different shapes for different questions | Every question; senior expects correlation via `trace_id`                      |
| OpenTelemetry (SDK + OTLP + Collector + semantic conventions) | The 2026 standard                                     | Vendor strategy, AI agent observability, migration questions                   |
| Sampling (head vs tail, hybrid)                               | Cost vs fidelity trade-off                            | Cost questions, AI agent design, scale questions                               |
| Cardinality budgets                                           | #1 cost driver                                        | Cost diagnosis, metric design, vendor bill questions                           |
| eBPF auto-instrumentation                                     | 2025-2026 game-changer for coverage                   | Greenfield system design, polyglot/legacy environments                         |
| GenAI semantic conventions                                    | New in OTel 1.30 (late 2025)                          | Any AI agent question; differentiates 2026-current from 2024-current candidate |
| SLO-based alerting (burn rate)                                | Replaces threshold alerts                             | On-call quality, page fatigue questions                                        |
| Vendor strategy (SaaS / self-host / hybrid)                   | Strategic, multi-year                                 | Senior+ architecture questions, cost reviews                                   |

## C2. 📊 Q&A Summary Table

| #   | Question                                      | Bloom | Key Skill                                     |
| --- | --------------------------------------------- | ----- | --------------------------------------------- |
| B1  | log vs metric vs trace                        | L1-L2 | Definitions + correlation                     |
| B2  | what is p99                                   | L2    | Statistics + SLO connection                   |
| B3  | what is OpenTelemetry                         | L2    | Components + strategic insight                |
| B4  | debug p99 spike                               | L3    | Pivot pattern (metric→trace→log)              |
| B5  | head vs tail sampling                         | L3-L4 | Cost analysis + hybrid pattern                |
| B6  | cardinality cost control                      | L4    | Operational discipline + war story            |
| B7  | eBPF vs SDK                                   | L4    | Trade-off + hybrid pattern                    |
| B8  | design observability for AI agent (10M users) | L5-L6 | System design + GenAI conventions + cost math |
| B9  | bill 6× — diagnose + fix                      | L5-L6 | Diagnosis + structural fix + org change       |
| B10 | SaaS vs self-host vs hybrid for fintech       | L6    | Decision matrix + push-back                   |

## C3. 🎤 Cold-Call 30-Second Pitch

> _"Modern observability in 2026 rests on three pillars — metrics, logs, traces — but the real game is in four operational concerns: sampling, correlation, auto-instrumentation, and noise control. OpenTelemetry won the wire format war, so vendor lock-in moved up the stack to dashboards and alerts. The biggest cost driver isn't data volume — it's cardinality, and the rule is: never put unbounded fields like user_id on metric labels. For AI agents, the OTel GenAI semantic conventions matter; without them, you can't debug a multi-step agent that hallucinated. The mature pattern is hybrid: eBPF for baseline coverage, OTel SDK for business-critical paths, tail sampling at gateway for cost control, dual-ship to a primary SaaS plus cold archive for vendor-outage survival, and SLO burn-rate alerts instead of threshold spam."_

(150 words, ~30s spoken, hits MeLT-SCAN, names GenAI conventions, mentions cost driver, mentions vendor strategy.)

## C4. ✅ Self-Check (5 items — answer in <60s each)

1. **Why is `trace_id` correlation more important than any individual pillar?**
   → Because it turns 3 disconnected data shapes into 1 navigable system: see metric spike → click exemplar → trace tree → filter logs by trace_id → root cause. Without correlation you debug from scratch each time.

2. **Why does putting `user_id` on a metric label crash production budgets?**
   → Time series count = product of (distinct values per label). User_id = 10M distinct values → 10M+ time series for that one metric. Vendors charge per active series, not per byte. Bill explodes.

3. **Why does tail sampling have to run at the gateway, not per-pod?**
   → Tail sampling needs the _full_ trace (all spans across all services) in one place to apply the policy. Per-pod collectors only see partial traces and would make wrong decisions.

4. **What's the one OTel attribute that separates a 2026-current AI engineer from a 2024-current one?**
   → Knowing the `gen_ai.*` semantic conventions stable in OTel 1.30 (late 2025): `gen_ai.system`, `gen_ai.request.model`, `gen_ai.usage.input_tokens`, `gen_ai.tool.name`, `gen_ai.response.finish_reason`. Using them = your traces are queryable across tools without per-vendor mapping.

5. **Why are SLO burn-rate alerts better than "alert if error rate > 1%"?**
   → Threshold alerts page on transient blips (deploy noise, retries) and miss slow-bleed regressions; burn rate ties pages to actual user-impact (consuming error budget faster than the period allows). Result: 10× fewer pages, all actionable.

## C5. 🧒 Feynman — Explain to a 12-year-old

> _"Imagine you run a delivery service with 100 bikers. **Metrics** are like a counter at HQ: 'today we did 2,000 deliveries, 50 were late.' Useful for trends, but tells you nothing about WHY. **Logs** are each biker's diary: 'flat tire at 3pm on Maple St.' Useful for one specific story, but you can't read 100 diaries fast. **Traces** are like watching one delivery's whole journey on a map: pickup → traffic light → wrong turn → flat tire → arrive. You see the WHOLE PATH and find where it went slow._
>
> _Now, you can't watch every delivery (too expensive!), so you only **save the videos** of ones that were late or had problems — that's **sampling**. And you put a sticker with the same number on the diary AND the video AND the daily counter, so you can jump between them — that's the **trace_id**._
>
> _In 2026, our delivery bikers also have AI assistants who decide routes. We need to record what the AI said, what tools it used, how many words it used — that's **GenAI semantic conventions**. Otherwise, when a delivery goes wrong, we can't tell if the AI made a bad decision or the biker did."_

## C6. 🔁 Spaced Repetition Schedule

| Day           | Action                                                                                                                                         | Time   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| **Day 1**     | Read full file. Run mnemonic MeLT-SCAN 3×.                                                                                                     | 60 min |
| **Day 3**     | Self-Check (C4) without notes. Re-read any failed item.                                                                                        | 15 min |
| **Day 7**     | Cold-call pitch (C3) out loud, recorded. Listen back. Do B4 + B5 from memory.                                                                  | 30 min |
| **Day 14**    | B8 (AI agent design) full whiteboard, no notes. Compare against the file.                                                                      | 45 min |
| **Day 30**    | B9 + B10 (diagnosis + decision matrix) verbal walkthrough. Update memory hook if any pillar feels weak.                                        | 30 min |
| **Quarterly** | Re-read Common Mistakes table + Layer 3 problems. Check if any production system you touch has crossed the cardinality / sampling / SLO lines. | 20 min |

## C7. 🕸️ Connections

**Same-track (within 2026-trends/):**

- → [09 — AI Agent Evaluation Production](./09-ai-agent-evaluation-production.md) — observability provides the runtime traces; eval consumes them (replay, scoring, regression detection). One feeds the other.
- → [10 — Senior Engineer in AI Era](./10-senior-engineer-ai-era.md) — observability is one of the senior judgment calls (vendor strategy, cost discipline, SLO design).
- → [04 — Edge Computing & Serverless 2026](./04-edge-computing-serverless-2026.md) — edge has unique observability constraints (no heavy collector, OTel-over-Kafka pattern, very limited retention budget at edge).
- → [02 — LLM System Design](./02-llm-system-design.md) — LLM systems need GenAI semantic conventions to be debuggable.

**Cross-track:**

- → [shared/backend-systems/](../shared/) — distributed systems fundamentals (services, queues, RPC) are prerequisite mental model.
- → [be-track/](../be-track/) — backend services are the primary observability emitters; understand framework integrations (Express, Fastify, Spring, Go std lib OTel).
- → [fe-track/](../fe-track/) — RUM (Real User Monitoring) is the FE cousin; same OTel conventions via `@opentelemetry/sdk-trace-web`. Critical for measuring actual user experience (LCP, INP, CLS).
- → External: Google SRE Book ch. 4 (SLOs), ch. 6 (Monitoring), Charity Majors's _Observability Engineering_ (O'Reilly, 2nd ed. 2025).

---

**Tóm tắt tiếng Việt (1 phút đọc):**
Observability 2026 đứng trên 3 cột truyền thống (metrics/logs/traces) nhưng senior cần thêm 4 mối quan tâm vận hành: **sampling, correlation, auto-instrumentation, noise control** → mnemonic **MeLT-SCAN**. OpenTelemetry đã thắng cuộc chiến wire format → vendor lock-in dịch chuyển lên dashboard/alert/AI features (vẫn còn lock-in nhưng dễ migrate hơn). **Cost driver #1 là cardinality** (không phải volume) → tuyệt đối không bỏ unbounded fields (user_id, IP) làm metric label. **AI agent** đòi hỏi **OTel GenAI semantic conventions** (stable từ OTel 1.30, cuối 2025) — đây là tín hiệu phân biệt engineer "2026-current" với "2024-current". **Tail sampling** ở gateway giữ lại errors + slow + AI traces; **eBPF** cho coverage baseline + SDK cho business-critical paths. Alert theo **SLO burn-rate** (không phải threshold) để chống page fatigue. Vendor strategy: hybrid (SaaS cho AI/UX-critical + self-host LGTM cho khối lượng lớn) thường thắng cả 2 thái cực thuần tuý cho công ty 200 engineer trở lên — nhưng nhớ: **mua bảo hiểm ops-burden, không chỉ mua features**.

---

**File length:** ~890 lines · **Mnemonic:** MeLT-SCAN · **Real companies:** Datadog, Honeycomb, Stripe, Cloudflare, Grafana, Adevinta, Booking.com, Pixie/New Relic, Isovalent, VNG ZaloPay
