# Frontend Quality & Observability — Production-Grade Monitoring / Chất Lượng & Quan Sát Frontend

> **Track**: FE | **L5 Weight**: Quality & Risk (10pts), Technical Mastery (20pts)
> **L5 Competencies**: Quality & Risk (10pts), Technical Mastery (20pts)
> **See also**: [Core Web Vitals](../06-browser-performance/01-core-web-vitals.md) | [Testing Strategy](../06-browser-performance/06-frontend-testing-strategy.md) | [Architecture Patterns](./01-architecture-patterns.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Tiki deploy feature mới lên production — conversion rate giảm 15% trong 2 ngày nhưng không ai biết. Không có RUM (Real User Monitoring), không có alerting trên CWV regression. Team phát hiện khi PM hỏi tại sao revenue giảm. Root cause: bundle mới tăng LCP từ 2.1s → 4.3s trên 3G mobile.

Một team khác có Sentry + Datadog RUM + bundle budget CI check. Cùng loại regression bị catch trong 15 phút — alert fire, auto-rollback trigger, postmortem viết cùng ngày.

Khác biệt không phải kỹ năng code — mà là **observability infrastructure** và **quality culture**.

---

## What & Why / Cái Gì & Tại Sao

**Frontend Observability là gì (Feynman)?** Như hệ thống camera + sensor trong nhà máy — bạn không đứng cạnh từng máy mà theo dõi dashboard. Khi nhiệt độ bất thường → alarm kêu trước khi máy hỏng. Frontend observability = thu thập signals (errors, performance, user behavior) từ browser thực tế → visualize → alert khi bất thường.

**Tại sao L5 cần quan tâm?** L4 viết code chạy đúng. L5 **đảm bảo code chạy đúng trong production** — dưới mọi network, device, và user behavior. Không có observability = flying blind.

---

## Core Concepts / Khái Niệm Cốt Lõi

### Concept 1: Error Monitoring & Tracking

🪝 **Memory Hook:** Error monitoring như **hệ thống báo cháy** trong tòa nhà — bạn không chờ cháy xong rồi đi kiểm tra. Sensor detect khói (error) → alarm (alert) → fire department (on-call engineer). Không có sensor = cháy âm ỉ không ai biết.

**Why exists / Tại sao tồn tại:**

- Level 1: Catch unhandled exceptions trước khi user reports
- Level 2: Group errors by root cause, track frequency, identify regression
- Level 3: Correlate errors with deployments, A/B tests, user segments

**Layer 1 — Core Architecture / Lớp 1:**

```
Browser Runtime
│
├── Global Error Handlers
│   ├── window.onerror          → Uncaught exceptions
│   ├── window.onunhandledrejection → Unhandled Promise rejections
│   └── React Error Boundary    → Component tree crashes
│
├── SDK Integration (Sentry/Datadog)
│   ├── Automatic breadcrumbs   → User actions before crash
│   ├── Source map upload        → Readable stack traces (not minified)
│   ├── Release tracking        → Which deploy introduced the error?
│   └── Session replay          → Video of what user saw
│
└── Alert Pipeline
    ├── New error type           → Slack alert immediately
    ├── Error spike (>5x normal) → PagerDuty on-call
    └── Error budget exceeded    → Deploy freeze
```

**Layer 2 — Sentry Setup Pattern / Lớp 2:**

```javascript
// Next.js + Sentry setup pattern
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_RELEASE_SHA,

  // Performance
  tracesSampleRate: 0.1,        // 10% of transactions
  profilesSampleRate: 0.1,

  // Error filtering
  beforeSend(event) {
    // Ignore browser extension errors
    if (event.exception?.values?.[0]?.stacktrace?.frames
        ?.some(f => f.filename?.includes('extension://'))) {
      return null;
    }
    // Ignore network errors from ad blockers
    if (event.message?.includes('blocked:mixed-content')) {
      return null;
    }
    return event;
  },

  // Sensitive data scrubbing
  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.category === 'xhr') {
      // Remove auth tokens from breadcrumbs
      delete breadcrumb.data?.headers?.Authorization;
    }
    return breadcrumb;
  },
});
```

**Layer 3 — Error Budget Model / Lớp 3:**

```
Error Budget = (1 - SLO) × total_sessions

Example: SLO = 99.5% error-free sessions
Monthly sessions: 1,000,000
Error budget: 0.5% × 1M = 5,000 error sessions/month

Current: 3,200 error sessions → 1,800 remaining
Status: ✅ Safe to deploy

If budget < 500 remaining → deploy freeze
If budget exhausted → rollback + postmortem mandatory
```

| Sai lầm | Tại sao sai | Đúng là |
|---------|-------------|---------|
| Log mọi error không filter | Alert fatigue → team ignore alerts | Filter noise (extensions, bots), focus on actionable errors |
| Không upload source maps | Stack traces unreadable: "main.js:1:23456" | CI pipeline phải upload source maps mỗi deploy |
| Chỉ track errors, không track impact | "100 errors" có thể là 100 users hoặc 1 user refresh 100 lần | Track affected users, not just error count |

🎯 **Interview Pattern:** "How would you set up error monitoring for a production React app?" — describe Sentry setup, source maps, error budgets, and alert tiers.

🔗 **Knowledge Chain:** Error Boundary → Sentry SDK → Source Maps → Error Budget → SLO/SLI → Incident Response

---

### Concept 2: Real User Monitoring (RUM) & Performance Observability

🪝 **Memory Hook:** RUM như **khảo sát giao thông thực tế** — không phải đo tốc độ xe trên đường test (Lighthouse/lab) mà đo tốc độ thực trên đường phố giờ cao điểm (real users, real networks, real devices).

**Why exists / Tại sao tồn tại:**

- Level 1: Lab metrics ≠ field metrics. Lighthouse score 95 nhưng real users on 3G India = LCP 8s
- Level 2: Segment by device, geography, connection → identify WHO is affected
- Level 3: Correlate performance with business metrics (conversion, bounce rate, revenue)

**Layer 1 — RUM vs Synthetic Monitoring / Lớp 1:**

```
                    RUM (Real User)         Synthetic (Lab)
─────────────────────────────────────────────────────────────
Data source         Real user browsers      Controlled bot
Network             Real (3G, 4G, WiFi)     Simulated
Device              Real (old phones, etc)   Standardized
Sample              All users (sampled)      Specific URLs
When                Continuous               Scheduled
Use for             Ground truth             Regression detection
Limitations         Sampling noise           Doesn't reflect reality
─────────────────────────────────────────────────────────────
Tools               Datadog RUM             Lighthouse CI
                    SpeedCurve              WebPageTest
                    Vercel Analytics        Calibre
                    web-vitals library      PageSpeed Insights
```

**Layer 2 — web-vitals Integration / Lớp 2:**

```javascript
// Collect Core Web Vitals from real users
import { onCLS, onFID, onLCP, onFCP, onTTFB, onINP } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,     // 'good' | 'needs-improvement' | 'poor'
    delta: metric.delta,
    id: metric.id,
    // Context for segmentation
    page: window.location.pathname,
    connection: navigator.connection?.effectiveType,
    deviceMemory: navigator.deviceMemory,
    userAgent: navigator.userAgent,
  };

  // Use sendBeacon for reliability (survives page unload)
  navigator.sendBeacon('/api/vitals', JSON.stringify(body));
}

onCLS(sendToAnalytics);
onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

**Layer 3 — Performance SLOs / Lớp 3:**

```
Frontend Performance SLOs (example):

┌──────────────┬─────────────────┬──────────────┬──────────────┐
│ Metric       │ Target (p75)    │ Warning      │ Critical     │
├──────────────┼─────────────────┼──────────────┼──────────────┤
│ LCP          │ < 2.5s          │ > 2.5s       │ > 4.0s       │
│ INP          │ < 200ms         │ > 200ms      │ > 500ms      │
│ CLS          │ < 0.1           │ > 0.1        │ > 0.25       │
│ TTFB         │ < 800ms         │ > 800ms      │ > 1.8s       │
│ Error rate   │ < 0.5%          │ > 0.5%       │ > 2%         │
│ JS bundle    │ < 200KB gzip    │ > 200KB      │ > 350KB      │
└──────────────┴─────────────────┴──────────────┴──────────────┘

Alert rules:
- Warning: Slack notification to #frontend-perf
- Critical: PagerDuty alert to on-call FE engineer
- 3 consecutive critical: Auto-rollback candidate
```

| Sai lầm | Tại sao sai | Đúng là |
|---------|-------------|---------|
| Chỉ dùng Lighthouse score | Lab ≠ field. Lighthouse chạy trên máy mạnh, WiFi nhanh | RUM = ground truth. Lighthouse = regression detection tool |
| Track p50 (median) only | p50 = 1.5s nhưng p95 = 8s → 5% users rất chậm | Track p75 (Google standard) + p95 (tail latency) |
| Không segment by dimension | "Average LCP = 2s" hides that mobile India = 6s | Segment: device, geo, connection, page type |

🎯 **Interview Pattern:** "How do you ensure your app performs well for ALL users?" — RUM + segmentation + SLOs + performance budgets.

🔗 **Knowledge Chain:** Core Web Vitals → web-vitals library → RUM Dashboard → Performance SLOs → Performance Budget → CI Enforcement

---

### Concept 3: Feature Flags, A/B Testing & Progressive Rollouts

🪝 **Memory Hook:** Feature flags như **công tắc đèn trong nhà** — wiring (code) đã xong nhưng bạn có thể bật/tắt từng đèn (feature) mà không cần thợ điện (deploy). A/B testing = thử 2 loại bóng đèn khác nhau ở 2 phòng → xem phòng nào sáng hơn.

**Why exists / Tại sao tồn tại:**

- Level 1: Decouple deployment from release — deploy code nhưng chưa expose cho users
- Level 2: Progressive rollout — 1% → 10% → 50% → 100% with monitoring
- Level 3: Data-driven decisions — A/B test features, measure impact, roll back losers

**Layer 1 — Feature Flag Architecture / Lớp 1:**

```
Feature Flag Lifecycle:

   Deploy code ─────► Flag OFF (dormant)
                           │
                    Enable for internal ──► Dogfooding
                           │
                    Enable 5% users ──► Canary monitoring
                           │
                    Enable 50% ──► A/B test analysis
                           │
                    ┌──────┴──────┐
                    │             │
              Winner ✅      Loser ❌
              100% rollout   Flag OFF + cleanup
                    │
              Remove flag ──► Code cleanup (CRITICAL!)
```

**Layer 2 — Implementation Patterns / Lớp 2:**

```javascript
// Feature flag with LaunchDarkly/Unleash pattern
// 1. Simple boolean flag
function CheckoutPage() {
  const showNewPayment = useFeatureFlag('new-payment-flow');

  return showNewPayment
    ? <NewPaymentFlow />
    : <LegacyPaymentFlow />;
}

// 2. Progressive rollout with percentage
// Server-side (flag service):
// { key: 'new-payment-flow', strategy: 'gradualRollout', percentage: 10 }
// → Consistent: same user always sees same variant (by userId hash)

// 3. A/B test with metrics tracking
function ProductPage({ product }) {
  const variant = useExperiment('product-layout-2024');
  // variant = 'control' | 'variant-a' | 'variant-b'

  useEffect(() => {
    trackExposure('product-layout-2024', variant);
  }, [variant]);

  // Track conversion when user adds to cart
  const handleAddToCart = () => {
    trackConversion('product-layout-2024', variant, 'add_to_cart');
    addToCart(product);
  };

  switch (variant) {
    case 'variant-a': return <ProductLayoutA onAdd={handleAddToCart} />;
    case 'variant-b': return <ProductLayoutB onAdd={handleAddToCart} />;
    default:          return <ProductLayoutControl onAdd={handleAddToCart} />;
  }
}
```

**Layer 3 — Flag Hygiene & Tech Debt / Lớp 3:**

```
Feature Flag Lifecycle Rules:

1. Every flag has an OWNER and EXPIRY DATE
2. After full rollout → remove flag within 2 sprints (tech debt!)
3. Maximum active flags per service: ~20 (beyond = combinatorial testing hell)
4. Flag naming: {team}-{feature}-{year} → "checkout-new-payment-2024"
5. Audit: quarterly flag review → stale flags → cleanup sprint

Risk: 20 boolean flags = 2^20 = 1,048,576 possible states
→ Impossible to test all combinations
→ Minimize active flags, test critical interactions

Monitoring per flag:
├── Error rate comparison (flag ON vs OFF)
├── Performance impact (LCP, INP delta)
├── Business metric (conversion, revenue per session)
└── Rollback trigger: any metric degrades > 5% → auto-disable
```

| Sai lầm | Tại sao sai | Đúng là |
|---------|-------------|---------|
| Flags without expiry | Accumulate forever → untestable combinatorial states | Every flag has owner + expiry. Quarterly cleanup sprint |
| A/B test without sample size calc | "We ran it for 2 days" — insufficient data → wrong conclusion | Statistical significance calculator before starting |
| Flag in hot path without caching | Flag evaluation per render = performance hit | Cache flag values, refresh on interval (not per-render) |

🎯 **Interview Pattern:** "How would you safely release a major feature?" — feature flags + canary + metrics + auto-rollback.

🔗 **Knowledge Chain:** Feature Flags → Canary Release → A/B Testing → Statistical Significance → Progressive Rollout → Auto-Rollback

---

## Anti-patterns / Sai Lầm Thường Gặp

| Anti-pattern | Why it fails | Better approach |
|-------------|-------------|----------------|
| "It works on my machine" | No production monitoring → no visibility | RUM + error monitoring from day 1 |
| Alert on every error | Alert fatigue → team ignores all alerts | Tiered alerts: info/warning/critical with escalation |
| Manual rollback only | Slow response → hours of user impact | Auto-rollback on error budget/CWV breach |
| Observability as afterthought | Added post-incident → missing context | Build observability INTO the feature (not after) |
| Dashboard without SLOs | "Numbers go up and down" → no actionable insight | Define targets, alert on breach, not just visualize |
| No source maps in production | Unreadable errors: "e is not a function at main.js:1:9999" | Upload source maps to error service every deploy |

---

## Q&A Section — Interview Questions

### Q: How would you set up frontend observability for a new production app? / Bạn setup observability cho FE app mới thế nào? 🟢 Junior

**A:** Three pillars: (1) Error monitoring — Sentry with source maps, error boundaries, and breadcrumbs. (2) Performance — web-vitals library collecting CWV from real users, sent to analytics. (3) Logging — structured console logs shipped to centralized service for debugging.

"Minimum viable observability: Sentry cho errors + web-vitals cho performance. Hai cái này cover 80% vấn đề production. Thêm RUM dashboard khi scale lên."

**💡 Interview Signal:**
- ✅ Strong: Names specific tools, explains three pillars, mentions source maps
- ❌ Weak: "I use console.log to debug" or "We check if users complain"

---

### Q: Explain the difference between RUM and synthetic monitoring. When would you use each? / Phân biệt RUM và synthetic monitoring? 🟡 Mid

**A:** Synthetic = controlled bot testing specific URLs on schedule (Lighthouse CI, WebPageTest). RUM = collecting metrics from real user browsers continuously (web-vitals, Datadog RUM).

Use synthetic for: CI regression detection ("did this PR make the page slower?"), baseline benchmarks, competitive analysis.

Use RUM for: understanding real user experience across devices/networks/geos, setting SLOs, identifying which user segments suffer most, correlating performance with business metrics.

"Synthetic tells you 'your code is fast.' RUM tells you 'your users experience fast.' These are different questions — a page that Lighthouse scores 98 can still be slow for users on 3G in rural areas."

**💡 Interview Signal:**
- ✅ Strong: Distinguishes lab vs field, explains when each matters, mentions segmentation
- ❌ Weak: "Lighthouse is enough" or "We just test on Chrome DevTools"

---

### Q: Your team's app has no observability. You're tasked with building it from scratch. Walk me through your approach and priorities. / App chưa có observability, bạn build từ đầu thế nào? 🔴 Senior

**A:** Phased approach based on ROI:

**Phase 1 (Week 1-2) — Stop the Bleeding:**
- Sentry integration with source maps + error boundaries → catch crashes immediately
- web-vitals → start collecting CWV baseline
- Define SLOs with PM: error rate < 0.5%, LCP p75 < 2.5s

**Phase 2 (Week 3-4) — Understand Users:**
- RUM dashboard with segmentation (device, geo, connection)
- Synthetic monitoring in CI (Lighthouse CI with performance budgets)
- Bundle size tracking with alerts on regression

**Phase 3 (Month 2) — Proactive Quality:**
- Feature flag infrastructure for progressive rollouts
- A/B testing framework with statistical rigor
- Error budget model → auto deploy-freeze when budget exhausted
- On-call rotation with runbooks

**Phase 4 (Ongoing) — Culture:**
- Performance review in every PR (bundle impact, CWV impact)
- Monthly observability review meeting
- Postmortem template: every P1 incident → actionable improvement

"The key insight: observability is not a tool — it's a practice. Tools are phase 1. The real value comes from building a culture where 'how does this affect users in production?' is asked in every PR review."

**💡 Interview Signal:**
- ✅ Strong: Phased approach with clear priorities, connects tools to culture, mentions SLOs and error budgets
- ❌ Weak: Lists tools without strategy, no mention of SLOs or progressive rollout

🔗 **Follow-up Chain:**
1. → "How would you convince leadership to invest in observability when there's feature pressure?"
2. → "Your error budget is exhausted mid-sprint. What do you do? How do you communicate this to stakeholders?"
3. → "Design an auto-rollback system. What signals trigger it? How do you prevent false positives?"

---

## Cold Call Simulation / Mô Phỏng Cold Call

> **Interviewer**: "Your team ships a Next.js e-commerce app. After a deploy, you notice conversion rate dropped 12%. How do you investigate and prevent this in the future?"

💬 **Expected answer structure:**
1. **Immediate**: Check Sentry for new errors post-deploy. Check RUM dashboard for CWV regression. Compare metrics before/after deploy timestamp
2. **Root cause**: Identify which metric degraded (LCP? INP? Error rate?). Segment by page, device, and variant. Correlate with the specific code changes in the deploy
3. **Remediation**: If CWV regression → rollback or fix-forward. If error spike → rollback immediately
4. **Prevention**: Add bundle budget in CI. Add CWV regression detection. Use feature flags for progressive rollout. Implement error budget with auto-freeze

---

## Self-Check / Tự Kiểm Tra

> **Đóng file này lại trước khi làm.**

- [ ] **Retrieval**: Viết 3 pillars of frontend observability từ trí nhớ + 1 tool cho mỗi pillar.
- [ ] **Visual**: Vẽ feature flag lifecycle diagram từ trí nhớ (deploy → canary → rollout → cleanup).
- [ ] **Application**: Mở production app bạn đang làm. Liệt kê: (a) dùng error monitoring gì? (b) có RUM không? (c) có feature flags không? (d) có performance SLOs không? Mỗi "không" = action item.
- [ ] **Debug**: Error budget model — nếu SLO = 99.9%, 500K sessions/month, đã có 400 error sessions — còn bao nhiêu budget? Có nên deploy feature mới không?
- [ ] **Teach**: Giải thích cho PM tại sao cần feature flags thay vì "just deploy it" — dùng ngôn ngữ business (risk, revenue, user impact).

💬 **Feynman Prompt:** Giải thích "observability" cho người không biết tech — tại sao "không có bug report" KHÔNG có nghĩa là "không có bug"?

🔁 **Spaced Repetition:** Ôn lại sau **3 ngày → 7 ngày → 14 ngày**.

---

## Connections / Liên Kết

- ⬅️ **Built on**: [Core Web Vitals](../06-browser-performance/01-core-web-vitals.md) — metrics that RUM collects
- ⬅️ **Built on**: [Testing Strategy](../06-browser-performance/06-frontend-testing-strategy.md) — quality before production
- ➡️ **Enables**: [Scalability](./02-scalability.md) — observability enables confident scaling
- 🔗 **BE perspective**: [System Design Theory](../../shared/02-system-design/system-design-theory.md) — backend monitoring patterns
- 🔗 **L5 Competency**: [Quality & Risk](../../shared/08-l5-competencies/00-l5-self-assessment.md) — observability is how L5 engineers demonstrate quality ownership
