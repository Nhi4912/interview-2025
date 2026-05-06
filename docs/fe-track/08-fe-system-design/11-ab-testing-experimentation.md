# A/B Testing & Frontend Experimentation / A/B Testing & Thực Nghiệm Frontend

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md) · [FE System Design README](./README.md) · [Core Web Vitals](../06-browser-performance/01-core-web-vitals.md) · [SEO for Frontend](../04-nextjs/06-seo-for-frontend.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Interviewer hỏi: _"Your PM wants to A/B test a button color. What do you ask first?"_

Hầu hết ứng viên sẽ trả lời ngay: _"I'll set up a 50/50 split test in Optimizely."_ Đây là câu trả lời của Junior. Một Senior Engineer sẽ dừng lại và hỏi ngược lại:

> "Where is this button — above or below the fold? Is it critical path? What's the hypothesis — 'more contrast improves CTR' or just 'PM wants orange'? What metric defines success? How many users/day does this page get? Do we have enough traffic to reach statistical significance in a reasonable time window?"

**Tại sao điều này quan trọng:**

- **Booking.com** chạy hơn **1,000 concurrent experiments** tại bất kỳ thời điểm nào. Mọi pixel trên site đều có thể đang trong một experiment. Điều này chỉ khả thi vì có một experimentation platform được thiết kế kỹ, không phải vì họ "A/B test mọi thứ" một cách tùy tiện.

- **Airbnb** xây dựng ERF (Experiment Reporting Framework) nội bộ sau khi nhận ra rằng các team đang đo lường metrics khác nhau cho cùng một experiment — dẫn đến conflicting decisions. Architecture của assignment layer trực tiếp ảnh hưởng đến tính toàn vẹn của data.

- **Uber** A/B-tested một homepage redesign. Conversion tăng **+8%**. Họ ship. Ba tháng sau, churn tăng **+15%** — những user mới từ experiment có lower lifetime value. Win ngắn hạn, loss dài hạn. **Lesson: metric selection là engineering decision, không chỉ là product decision.**

- **Microsoft** internal research: **2/3 of features that pass internal review fail controlled experiments** với real users. Những features tưởng chừng rõ ràng là "improvement" thực tế làm hại user. Experimentation là safety net.

Đây là lý do A/B testing là **senior engineering topic**: không phải vì nó khó implement, mà vì làm sai nó — flicker, SRM, peeking, conflating flags with experiments — sinh ra bad data dẫn đến bad product decisions.

---

## What & Why / Cái Gì & Tại Sao

**A/B Testing (Controlled Experiment)** = so sánh có kiểm soát giữa hai hoặc nhiều variants của một feature, với user được assign ngẫu nhiên và metrics đo lường causal effect.

```
Control (A): Current experience  →  Measure outcome metric
Treatment (B): New variant       →  Measure outcome metric
                                    ↑
                              Compare statistically
```

**Business case — tại sao không chỉ "trust your gut":**

- **HiPPO problem** (Highest Paid Person's Opinion): Without experiments, product decisions bị dominated bởi authority, không phải evidence. Experimentation democratizes decision-making bằng data.
- **Causal inference**: Web analytics (pageviews, funnels) cho correlation. Experiment cho causation — thứ duy nhất justify việc ship.
- **Microsoft số liệu cụ thể**: Teams dùng experimentation gắn với ship velocity cao hơn 3× vì confident hơn khi rollback hay advance.

**Nơi Frontend Engineer sở hữu experimentation:**

| Layer              | FE Ownership                                                         |
| ------------------ | -------------------------------------------------------------------- |
| Assignment         | Đọc variant từ cookie/header/localStorage hoặc gọi SDK               |
| Variant rendering  | Render đúng UI variant mà không gây flicker/CLS                      |
| Exposure tracking  | Fire "experiment exposed" event đúng lúc, đúng điều kiện             |
| Performance impact | Đảm bảo SDK init không block render, variant code không bloat bundle |
| Flag lifecycle     | Cleanup dead code sau khi experiment kết thúc                        |

> 🇻🇳 **Tóm tắt**: A/B Testing = so sánh có kiểm soát giữa variants. FE engineer không chỉ "hiển thị variant" mà sở hữu toàn bộ assignment → rendering → tracking → performance impact chain. Làm sai ở bất kỳ layer nào → bad data → bad decisions.

---

## Concept Map / Bản Đồ Khái Niệm

```
A/B TESTING LIFECYCLE (FE PERSPECTIVE)
│
├── 1. HYPOTHESIS
│   ├── "Changing CTA from 'Submit' to 'Get Started' will increase CTR"
│   ├── Primary metric: CTR on CTA button
│   └── Guardrail metrics: Page load time, bounce rate, revenue
│
├── 2. ASSIGNMENT  ←── WHERE YOU ARE ASSIGNED TO CONTROL OR TREATMENT
│   ├── Hash-based bucketing (userId → deterministic bucket)
│   ├── Random per session (sessionId based)
│   ├── Server-side (cookie set at request time)
│   ├── Edge-side (middleware, Vercel/Cloudflare)
│   └── Client-side (after hydration — flicker risk!)
│
├── 3. VARIANT RENDERING  ←── WHERE ASSIGNMENT IS APPLIED TO UI
│   ├── Server-side (SSR/RSC) — no FOUC, best for above-fold
│   ├── Edge middleware — geographic, fast, no server round-trip
│   ├── Client-side post-hydration — easy, but flicker
│   └── CSS-only (flag → class toggle) — fastest, limited
│
├── 4. EXPOSURE TRACKING  ←── WHEN USER ACTUALLY SEES THE VARIANT
│   ├── NOT when assigned — when actually rendered/visible
│   ├── Fire analytics event: experiment_exposed { experiment_id, variant }
│   └── Misfire = SRM, broken attribution, bad stats
│
├── 5. METRIC COLLECTION
│   ├── Primary (what you're optimizing): CTR, conversion, revenue
│   ├── Secondary (what you're watching): engagement, session length
│   └── Guardrail (what you're protecting): LCP, CLS, error rate
│
├── 6. STATISTICAL ANALYSIS
│   ├── Frequentist: p-value < α (0.05), power (1-β) > 0.8
│   ├── Bayesian: P(B > A | data)
│   ├── Sample size: calculated upfront, not peeked mid-run
│   └── Multiple testing correction if running multi-variant
│
└── 7. DECISION
    ├── Ship: statistically significant + guardrails OK + business sense
    ├── Iterate: directional positive but underpowered
    ├── Kill: no effect or negative
    └── Flag cleanup: remove dead code path after decision
```

> 🇻🇳 **Tóm tắt**: Lifecycle gồm 7 bước: Hypothesis → Assignment → Rendering → Exposure tracking → Metric collection → Statistical analysis → Decision. FE engineer directly owns bước 2, 3, 4 và performance impact của toàn bộ chain.

---

## Part 1: Assignment Strategies / Chiến Lược Assignment

### 1.1 Hash-Based Bucketing / Phân Nhóm Dựa Trên Hash

```typescript
// Deterministic assignment: same userId always gets same bucket
function getBucket(userId: string, experimentId: string, bucketCount = 100): number {
  const key = `${experimentId}:${userId}`;
  // MurmurHash or similar — fast, uniform distribution
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit int
  }
  return Math.abs(hash) % bucketCount;
}

function getVariant(userId: string, experimentId: string): "control" | "treatment" {
  const bucket = getBucket(userId, experimentId);
  return bucket < 50 ? "control" : "treatment"; // 50/50 split
}
```

**Tại sao hash-based quan trọng:**

- **Stickiness**: Cùng user luôn nhận cùng variant — không có variant switching giữa sessions
- **No storage needed**: Không cần lưu assignment trong DB hay cookie
- **Reproducible**: Có thể debug offline bằng cách replay `(userId, experimentId)`

**Khi hash-based KHÔNG đủ:**

- Cross-device: `userId` = device ID → same person trên phone và desktop có thể nhận different variants
- Anonymous users: Nếu dùng session ID (non-persistent) → user bị re-assigned sau khi clear cookie

### 1.2 Stickiness vs Cross-Device Identity

```
STICKINESS PROBLEM:
User on desktop (userId: "device-abc") → Treatment variant
Same user on mobile (userId: "device-xyz") → Control variant
                                            ↑ BROKEN — user sees inconsistent experience
                                            ↑ AND pollutes metrics (counted in both)

SOLUTION OPTIONS:
1. Logged-in users: Hash by authenticated userId → cross-device consistent
2. Anonymous: Best-effort using persistent cookie (not cross-device but stable per-device)
3. Accept inconsistency for anonymous — document as known limitation
```

### 1.3 Sample Ratio Mismatch (SRM) / Tỷ Lệ Mẫu Không Khớp

**SRM = khi tỷ lệ thực tế của users trong variants khác với tỷ lệ đặt ra.**

```
Expected: 50% Control / 50% Treatment
Actual:   52% Control / 48% Treatment  ← SRM!
                                         Data is compromised
```

**Nguyên nhân SRM thường gặp:**

| Nguyên nhân                      | Ví dụ                                                         |
| -------------------------------- | ------------------------------------------------------------- |
| Bot filtering không uniform      | Bots bị filter ở Control nhưng không ở Treatment              |
| Browser redirect trong Treatment | Treatment redirect thêm 1 step → một số user bị lost          |
| Caching inconsistency            | Control page được cache, Treatment không → khác traffic level |
| Assignment bug                   | Hash function có bug → không uniform distribution             |
| SDK version mismatch             | Different SDK versions trên Control vs Treatment              |

**Phát hiện SRM:**

```typescript
// Chi-squared test on assignment counts
function detectSRM(controlCount: number, treatmentCount: number, expectedRatio = 0.5): boolean {
  const total = controlCount + treatmentCount;
  const expectedControl = total * expectedRatio;
  const expectedTreatment = total * (1 - expectedRatio);

  const chiSquared =
    Math.pow(controlCount - expectedControl, 2) / expectedControl +
    Math.pow(treatmentCount - expectedTreatment, 2) / expectedTreatment;

  // p < 0.001 threshold for SRM detection (more conservative than p < 0.05)
  return chiSquared > 10.83; // df=1, p=0.001
}
```

**Nếu phát hiện SRM: STOP. Đừng interpret kết quả. Fix assignment logic trước.**

### 1.4 Multi-Armed Bandit vs Fixed-Split A/B

| Aspect            | Fixed-Split A/B                               | Multi-Armed Bandit                                                      |
| ----------------- | --------------------------------------------- | ----------------------------------------------------------------------- |
| Allocation        | Fixed (e.g. 50/50) throughout                 | Dynamic — winning variant gets more traffic                             |
| Objective         | **Measure causal effect precisely**           | **Maximize reward during experiment**                                   |
| Regret            | High (50% on potential loser)                 | Low (adaptively allocates)                                              |
| Statistical rigor | High — clean causal inference                 | Lower — confounded by adaptive allocation                               |
| When to use       | Feature experiments where you need clean data | Optimizing user-facing content (headlines, images) where regret matters |
| Peeking risk      | Controlled with fixed runtime                 | Structural — bandit IS always peeking                                   |

**Rule of thumb**: Dùng fixed A/B khi bạn cần hiểu **WHY** variant wins (causal). Dùng bandit khi bạn chỉ cần **optimize quickly** và don't care about causal inference (content optimization, recommendation ranking).

> 🇻🇳 **Tóm tắt**: Hash-based bucketing cho stickiness và reproducibility. SRM là signal cho broken assignment — phát hiện bằng chi-squared test trên counts. Cross-device identity chỉ reliable với authenticated users. Multi-armed bandit trade statistical rigor cho lower regret — dùng đúng context.

---

## Part 2: Where Variants Render — Tradeoffs Matrix / Nơi Variant Được Render

### 2.1 Server-Side (SSR / RSC)

**Cơ chế**: Assignment xảy ra trên server. HTML được generated với đúng variant built-in. Client nhận HTML với variant đã applied — không có second render.

```typescript
// Next.js App Router — Server Component with server-side variant assignment
// app/landing/page.tsx
import { cookies } from 'next/headers';
import { getVariantFromStatsig } from '@/lib/statsig-server';

export default async function LandingPage() {
  const cookieStore = cookies();
  const userId = cookieStore.get('user_id')?.value ?? generateAnonymousId();

  // Assignment happens on server — no client JS needed
  const variant = await getVariantFromStatsig(userId, 'hero_cta_experiment');

  return (
    <main>
      <HeroSection>
        {variant === 'treatment' ? (
          <button className="cta-primary">Get Started Free</button>
        ) : (
          <button className="cta-primary">Sign Up</button>
        )}
      </HeroSection>
    </main>
  );
}
```

| Pros                                          | Cons                                                          |
| --------------------------------------------- | ------------------------------------------------------------- |
| No FOUC (Flash of Unstyled Content)           | Experiment config must be available at request time           |
| No CLS from variant swap                      | Harder to change without redeploy (unless config is external) |
| SEO-safe — crawler sees correct variant       | Cold start: SDK init adds latency to TTFB                     |
| Best for layout, copy, above-the-fold changes | Caching complexity: different users need different HTML       |

**Best for**: Above-the-fold content, layout changes, copy experiments, anything where flicker would degrade UX.

### 2.2 Edge-Side (Middleware — Vercel / Cloudflare)

**Cơ chế**: Assignment và variant selection xảy ra tại edge node, gần user nhất. Middleware rewrite requests hoặc set headers trước khi request hits origin.

```typescript
// middleware.ts — Next.js Edge Middleware for A/B assignment
import { NextRequest, NextResponse } from "next/server";

const EXPERIMENT_COOKIE = "ab_hero_variant";
const VARIANTS = ["control", "treatment"] as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname !== "/") return NextResponse.next();

  const response = NextResponse.next();

  // Check existing assignment (sticky)
  let variant = request.cookies.get(EXPERIMENT_COOKIE)?.value as (typeof VARIANTS)[number];

  if (!variant || !VARIANTS.includes(variant)) {
    // Assign: hash-based on IP + random seed (anonymous) or userId cookie
    const userId = request.cookies.get("user_id")?.value ?? crypto.randomUUID();
    variant = hashBucket(userId, "hero_cta_v1") < 50 ? "control" : "treatment";

    // Persist assignment — 30 days
    response.cookies.set(EXPERIMENT_COOKIE, variant, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "lax",
    });
  }

  // Pass variant to page via header — page reads this without client JS
  response.headers.set("x-ab-variant", variant);

  // Optionally: rewrite to variant-specific route
  // if (variant === 'treatment') {
  //   return NextResponse.rewrite(new URL('/landing-v2', request.url));
  // }

  return response;
}

export const config = { matcher: ["/"] };

function hashBucket(userId: string, experimentId: string): number {
  let hash = 0;
  const key = `${experimentId}:${userId}`;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash) % 100;
}
```

```typescript
// app/page.tsx — reads variant from header set by middleware
import { headers } from 'next/headers';

export default function HomePage() {
  const headersList = headers();
  const variant = headersList.get('x-ab-variant') ?? 'control';

  return <HeroSection variant={variant} />;
}
```

| Pros                                                | Cons                                                |
| --------------------------------------------------- | --------------------------------------------------- |
| Geographically close to user — low latency overhead | Edge runtime limitations (no Node.js APIs)          |
| No origin server round-trip for assignment          | Cookie-based sticky, not userId-based (anonymous)   |
| Works before any React code runs                    | Complex caching — must vary cache by variant cookie |
| No FOUC                                             | Debugging harder (distributed edge nodes)           |

**Best for**: Geographic personalization, cookie-based assignment for anonymous users, A/B tests across entire page routes.

**Critical caching note**: Set `Vary: Cookie` or use cache keys that include the variant cookie. Otherwise CDN serves Control HTML to Treatment users.

```typescript
// Cache configuration for edge-assigned pages
export const revalidate = 0; // Don't cache — vary by user
// OR use cache tags with variant-aware key
```

### 2.3 Client-Side (Post-Hydration)

**Cơ chế**: Assignment SDK loads in browser after hydration. Variant applied via React state update. User sees control state briefly before variant renders.

```tsx
// Using Statsig React SDK — client-side assignment
"use client";
import { useExperiment } from "@statsig/react-bindings";

export function HeroCTA() {
  const experiment = useExperiment("hero_cta_experiment");
  const ctaText = experiment.get("cta_text", "Sign Up"); // default = 'Sign Up'

  // First render: 'Sign Up' (default/control)
  // After SDK init (~50ms): correct variant value
  // → FLICKER: user sees 'Sign Up' flash to 'Get Started Free'

  return <button className="cta">{ctaText}</button>;
}
```

```tsx
// Mitigating flicker: hide until SDK ready
"use client";
import { useExperiment, useStatsigClient } from "@statsig/react-bindings";

export function HeroCTA() {
  const { isLoading } = useStatsigClient();
  const experiment = useExperiment("hero_cta_experiment");
  const ctaText = experiment.get("cta_text", "Sign Up");

  if (isLoading) {
    // Render invisible placeholder to hold layout
    return (
      <button className="cta" style={{ visibility: "hidden" }}>
        Sign Up
      </button>
    );
  }

  return <button className="cta">{ctaText}</button>;
}
```

| Pros                                                  | Cons                                                |
| ----------------------------------------------------- | --------------------------------------------------- |
| Easy to change experiment config without redeploy     | **FOUC / CLS** — user sees variant swap             |
| SDK manages assignment, targeting, analytics          | SDK init cost: Statsig ~50ms, Optimizely ~100–200ms |
| Rich targeting (user properties, custom attributes)   | Bad for above-the-fold, SEO-critical content        |
| Good for non-visible experiments (algorithm, ranking) | Bundle size: SDKs add 20–80KB gzipped               |

**Best for**: Below-the-fold interactive features, experiments on authenticated dashboards (no SEO concern), recommendation algorithm variants, anything not visible on initial paint.

### 2.4 CSS-Only (Feature Flag → Class Toggle)

```tsx
// Server sets class name — no JS required for rendering
// app/landing/page.tsx (Server Component)
async function HeroSection({ userId }: { userId: string }) {
  const flags = await getFeatureFlags(userId);

  return (
    <section className={flags.newHeroDesign ? "hero hero--variant-b" : "hero"}>
      <h1>Ship faster.</h1>
    </section>
  );
}
```

```css
/* CSS handles visual difference */
.hero {
  background: white;
}
.hero--variant-b {
  background: linear-gradient(135deg, #667eea, #764ba2);
}
```

| Pros                                         | Cons                                                      |
| -------------------------------------------- | --------------------------------------------------------- |
| Zero flicker — class present in initial HTML | Limited to CSS-expressible differences                    |
| No additional JS                             | Variant logic still needs server-side flag evaluation     |
| Fastest possible — no runtime overhead       | Cannot test behavioral differences (different components) |

**Best for**: Theme variants, color experiments, spacing experiments, font experiments. Not for structural or behavioral changes.

> 🇻🇳 **Tóm tắt**: Server-side và edge-side assignment = no FOUC, best for above-fold. Client-side = easy nhưng flicker risk và SDK cost. CSS-only = nhanh nhất, chỉ cho visual changes. Rule: **càng above-the-fold và SEO-critical, càng cần server/edge assignment.**

### 2.5 Tool-Specific Patterns

**GrowthBook — SSR with Node.js SDK:**

```typescript
// lib/growthbook-server.ts
import { GrowthBook } from '@growthbook/growthbook';

export async function getGrowthBookInstance(userId: string) {
  const gb = new GrowthBook({
    apiHost: 'https://cdn.growthbook.io',
    clientKey: process.env.GROWTHBOOK_CLIENT_KEY!,
    attributes: { id: userId },
    trackingCallback: (experiment, result) => {
      // Fire exposure event to your analytics
      trackExperimentExposure(experiment.key, result.variationId);
    },
  });

  await gb.loadFeatures({ timeout: 500 }); // Fetch feature config with timeout
  return gb;
}

// app/page.tsx
export default async function Page() {
  const userId = await getUserId();
  const gb = await getGrowthBookInstance(userId);

  const variant = gb.getFeatureValue('hero_cta', 'control');
  gb.destroy(); // Cleanup

  return <Hero variant={variant} />;
}
```

---

## Part 3: Tool Comparison / So Sánh Công Cụ

| Tool             | Type                                         | Self-Hosted        | Edge Support          | Statistical Engine                     | Pricing                  | When to Choose                                                                     |
| ---------------- | -------------------------------------------- | ------------------ | --------------------- | -------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------- |
| **Statsig**      | Feature flags + experiments + analytics      | No (cloud)         | ✅ Edge SDK           | Frequentist (CUPED variance reduction) | Free tier + usage-based  | Best-in-class for teams wanting turnkey experiment platform with strong stats      |
| **GrowthBook**   | Feature flags + experiments                  | ✅ Yes (OSS)       | ✅ Edge SDK           | Frequentist + Bayesian                 | Free OSS / Cloud paid    | Best for orgs needing full data control, privacy constraints, or GDPR-heavy        |
| **LaunchDarkly** | Feature flags primary, experiments secondary | No (cloud)         | ✅ Edge SDK           | Frequentist (Experimentation add-on)   | Expensive — per seat     | Enterprise feature flag management; experiment is add-on, not primary use case     |
| **Optimizely**   | Experiments primary                          | No (cloud)         | ✅ Edge (Full Stack)  | Frequentist (Stats Accelerator™)       | Premium / enterprise     | Legacy enterprise; large existing integration; stats acceleration for low-traffic  |
| **PostHog**      | Product analytics + experiments + flags      | ✅ Yes (OSS)       | Partial               | Frequentist (Bayesian in beta)         | Free OSS / Cloud + usage | All-in-one product analytics + experiments; avoids stitching multiple tools        |
| **Vercel Flags** | Feature flags (no native stats)              | No (Vercel-native) | ✅ Native Edge Config | None built-in (wire to analytics)      | Vercel plan included     | Pure Next.js/Vercel shops wanting zero-latency flag reads at edge; no stats engine |
| **Split.io**     | Feature flags + experiments                  | No (cloud)         | ✅                    | Frequentist                            | Per MAU                  | Strong enterprise CI/CD integration; feature flag-as-code workflow                 |

**Decision shortcut:**

```
Need OSS / self-hosted?                    → GrowthBook or PostHog
Already on Vercel, simple flags?           → Vercel Flags + custom stats
Product analytics + experiments together?  → PostHog
Enterprise, need strong SLA + support?    → LaunchDarkly or Optimizely
Want best-in-class stats + simple setup?  → Statsig
```

> 🇻🇳 **Tóm tắt**: Không có silver bullet. GrowthBook cho data privacy/OSS. PostHog cho all-in-one. Statsig cho stats quality. Vercel Flags cho Next.js-native simplicity không có stats engine. LaunchDarkly/Optimizely cho enterprise.

---

## Part 4: Statistics for Frontend Engineers / Thống Kê Cho FE Engineers

_Đây không phải statistics course. Đây là những gì bạn cần biết để nói chuyện credibly trong interview._

### 4.1 The Core Test Setup

```
NULL HYPOTHESIS (H₀): Variant B has no effect. Observed difference is due to chance.
ALTERNATIVE HYPOTHESIS (H₁): Variant B has a real effect.

α (alpha) = 0.05  → Acceptable false positive rate (Type I error)
             "5% chance we incorrectly conclude B is better when it isn't"

β (beta) = 0.20  → Acceptable false negative rate (Type II error)
Power = 1 - β = 0.80 → "80% chance we detect a real effect if it exists"

p-value: Probability of observing this result (or more extreme) IF H₀ is true
If p < α → reject H₀ → result is "statistically significant"
```

### 4.2 Minimum Detectable Effect (MDE)

**MDE = smallest effect size you care about detecting.**

```
Practical MDE reasoning:
- Current conversion: 5%
- MDE: 0.5% absolute (i.e. 5% → 5.5%)
- Smaller MDE → need MORE users to detect it
- Larger MDE → fewer users needed but you might miss small-but-real improvements

Rule of thumb: MDE should be the SMALLEST improvement that's worth shipping.
If +0.1% conversion isn't worth building cost, don't set MDE = 0.1%.
```

**Sample Size Calculation:**

```typescript
// Simplified sample size estimator (two-proportion z-test)
function estimateSampleSize(
  baselineRate: number, // e.g. 0.05 (5% conversion)
  mde: number, // e.g. 0.005 (0.5% absolute improvement)
  alpha = 0.05,
  power = 0.8,
): number {
  const p1 = baselineRate;
  const p2 = baselineRate + mde;
  const pBar = (p1 + p2) / 2;

  // z-scores for α/2 (two-tailed) and β
  const zAlpha = 1.96; // for α = 0.05
  const zBeta = 0.842; // for power = 0.80

  const numerator = Math.pow(
    zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)),
    2,
  );
  const denominator = Math.pow(mde, 2);

  return Math.ceil(numerator / denominator); // Per variant
}

// Example: 5% baseline, 0.5% MDE, 95% confidence, 80% power
// → ~7,700 users per variant → 15,400 total
```

**Implication cho FE engineers**: Trước khi thiết kế experiment, tính sample size. Nếu landing page có 500 users/day và cần 15,000 per variant → **60 days** để complete experiment. Một số experiments không viable với low-traffic pages.

### 4.3 The Peeking Problem / Vấn Đề Nhìn Trộm Kết Quả

**Peeking = xem p-value trong khi experiment đang chạy và stop sớm khi p < 0.05.**

```
Why this inflates false positive rate:

If you check results every day for 20 days:
- Probability of seeing p < 0.05 by chance at least ONCE = ~65%
- Not 5%!

This is called "repeated significance testing" problem.

Analogy: Flip a fair coin 100 times.
Check after every 10 flips for "significant" deviation from 50/50.
You'll likely find one sub-run that looks significant — but coin is fair.
```

**Solutions:**

- **Sequential testing / Always-Valid Inference**: Use statistical methods designed for continuous monitoring (Statsig uses this)
- **Pre-register runtime**: Decide upfront "run for 14 days, check once"
- **Bonferroni correction for planned interim checks**: If checking at 50% and 100%, use α = 0.025 per check

### 4.4 Multiple Testing Correction

**Problem**: Running 5 experiments simultaneously? Probability of at least one false positive ≈ 1 - (0.95)^5 = 23%.

**Bonferroni correction** (simplest):

```
Adjusted α = α / number_of_tests
Running 5 tests simultaneously: use α = 0.05/5 = 0.01 per test
```

**Practical FE implication**: Nếu PM muốn test 5 things at once, bạn cần hoặc: (a) separate experiments với Bonferroni correction, (b) factorial design nếu independent, (c) accept higher false positive risk và plan for replication.

### 4.5 Frequentist vs Bayesian (Interview Level)

|                   | Frequentist                                      | Bayesian                                   |
| ----------------- | ------------------------------------------------ | ------------------------------------------ |
| Question answered | "Is this result unlikely if H₀ is true?"         | "What's P(B is better than A given data)?" |
| Output            | p-value + reject/fail-to-reject                  | Probability: "87% chance B > A"            |
| Peeking           | Invalid — inflates false positive                | Can be valid with correct priors           |
| Interpretation    | More nuanced                                     | Intuitive for non-statisticians            |
| Common tools      | Most A/B platforms (Optimizely, Statsig default) | Optimizely Stats Accelerator, GrowthBook   |

**Interview answer**: "I default to frequentist for clean experiments with pre-determined runtime. I'd consider Bayesian if we need to monitor continuously or explain results to non-technical stakeholders who understand probability better than p-values."

### 4.6 Novelty Effect & Primacy Effect

```
NOVELTY EFFECT: Users interact more with NEW things simply because they're new.
→ Treatment variant gets inflated early engagement
→ Effect decays after novelty wears off
→ Mitigation: Run experiment long enough to outlast novelty (~2–4 weeks)
→ Segment analysis: Compare week 1 vs week 3+ behavior

PRIMACY EFFECT: Users are accustomed to the EXISTING experience.
→ Control variant gets inflated early engagement
→ Users who see Treatment first adjust; Control users resist change
→ Common in navigation/layout experiments
→ Mitigation: Same as novelty — run longer, analyze by cohort exposure date
```

> 🇻🇳 **Tóm tắt**: α = 5% false positive threshold. Power = 80% chance detect real effect. MDE tính trước — không guessing. Peeking vô hiệu hóa thống kê. Multiple tests → Bonferroni. Novelty effect inflate treatment early — run đủ dài. Đây là **những gì FE engineer cần biết để credible trong A/B testing discussion.**

---

## Part 5: Performance Impact of Experimentation / Tác Động Hiệu Năng

### 5.1 The Flicker Problem (FOUC + CLS)

```
TIMELINE: Client-side A/B experiment on above-the-fold CTA

t=0ms    HTML arrives → "Sign Up" button renders (control default)
t=0ms    LCP candidate: "Sign Up" button recorded
t=50ms   Statsig SDK init completes
t=51ms   Variant applied → "Get Started Free" renders
t=51ms   CLS event fired (layout shift from text change)
t=51ms   LCP re-evaluated

RESULT:
- CLS: 0.05–0.15 depending on text length difference
- User sees flash from "Sign Up" to "Get Started Free"
- Degraded UX + potential Core Web Vitals impact
```

**Real CLS numbers from text-swap flicker**: Changing button text mid-render typically causes CLS of 0.02–0.08. Changing from a short CTA to a long CTA (different line wrapping) can cause CLS > 0.1 (threshold for "poor").

**Mitigation strategies:**

```typescript
// Strategy 1: Hide until SDK ready (avoids CLS, adds FID delay)
function CTAButton() {
  const [ready, setReady] = useState(false);
  const [ctaText, setCTAText] = useState('');

  useEffect(() => {
    statsig.initialize(STATSIG_KEY).then(() => {
      const exp = statsig.getExperiment('cta_experiment');
      setCTAText(exp.get('cta_text', 'Sign Up'));
      setReady(true);
    });
  }, []);

  if (!ready) return <button style={{ visibility: 'hidden', minWidth: '120px' }}>Sign Up</button>;
  return <button>{ctaText}</button>;
}

// Strategy 2: Reserve layout space with skeleton
function CTAButton() {
  const [ctaText, setCTAText] = useState<string | null>(null);
  // ... SDK init in useEffect

  if (ctaText === null) return <button className="cta cta--skeleton" aria-hidden />;
  return <button className="cta">{ctaText}</button>;
}

// Strategy 3: Best — use server-side assignment (no flicker at all)
// See Part 2.1 for SSR pattern
```

### 5.2 SDK Init Cost — Real Numbers

| SDK                   | Init Time (cold) | Bundle Size (gzip) | Notes                            |
| --------------------- | ---------------- | ------------------ | -------------------------------- |
| Statsig browser SDK   | ~30–80ms         | ~25KB              | Async feature config fetch       |
| Optimizely Full Stack | ~100–200ms       | ~50KB              | Larger SDK, more features        |
| LaunchDarkly browser  | ~50–100ms        | ~30KB              | SSE streaming support            |
| GrowthBook browser    | ~20–50ms         | ~18KB              | Smaller, less features           |
| PostHog JS            | ~100–300ms       | ~80KB              | Includes analytics               |
| Vercel Edge Config    | <1ms             | 0KB client         | Edge reads, no client SDK needed |

**Vercel Edge Config là outlier** — config giá trị đọc ở edge, zero client cost, latency < 1ms. Nhưng không có statistical engine.

### 5.3 Bundle Bloat from Variant Code

```typescript
// BAD: Ship both variants to all users
function HeroSection() {
  const variant = useExperiment('hero_v2');

  return variant === 'treatment' ? (
    <NewHeroDesign />    // 15KB component
  ) : (
    <OldHeroDesign />    // 12KB component
    // Both components ship in bundle — 27KB instead of 12-15KB
  );
}

// BETTER: Dynamic import for treatment
function HeroSection() {
  const variant = useExperiment('hero_v2');
  const [TreatmentComponent, setTreatmentComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (variant === 'treatment') {
      import('./NewHeroDesign').then(m => setTreatmentComponent(() => m.NewHeroDesign));
    }
  }, [variant]);

  if (variant === 'treatment') {
    return TreatmentComponent ? <TreatmentComponent /> : <OldHeroDesign />;
  }
  return <OldHeroDesign />;
}

// BEST: Server-side assignment → static import of correct variant
// No dynamic loading, no bundle bloat, correct component only shipped
```

### 5.4 Blocking Script Tags — The Old Way

**Never do this (legacy Optimizely / VWO pattern):**

```html
<!-- BLOCKS RENDERING — synchronous script before </head> -->
<script src="https://cdn.optimizely.com/js/12345678.js"></script>
<!-- Page is BLOCKED until this 80KB script downloads, parses, and executes -->
<!-- P50 blocking time: 200–500ms on slow 3G -->
```

**Modern approach**: All SDK inits should be async. Use server-side or edge assignment for above-the-fold to avoid any script blocking.

> 🇻🇳 **Tóm tắt**: Flicker = FOUC + CLS. Statsig SDK init ~50ms. Client-side A/B for above-fold = CLS risk. Bundle bloat = ship cả hai variants nếu không careful. Blocking scripts = death penalty cho LCP. **Server/edge assignment là gold standard cho performance-critical experiments.**

---

## Part 6: Feature Flags vs Experiments vs Rollouts

```
SAME INFRASTRUCTURE — DIFFERENT INTENT:

FEATURE FLAG
└── Intent: On/off control for code deployment
└── Analytics: Not required
└── Exposure tracking: Not required
└── Example: "dark_mode_enabled" — either on or off per user segment
└── Lifecycle: Exists as long as feature needs a kill switch

EXPERIMENT (A/B Test)
└── Intent: Measure CAUSAL effect of change on metrics
└── Analytics: REQUIRED — this is the entire point
└── Exposure tracking: REQUIRED — only count users who saw variant
└── Statistical engine: REQUIRED
└── Example: "new_checkout_flow_v2" — measure conversion lift
└── Lifecycle: Fixed runtime → decision → REMOVE winner from flag system

ROLLOUT (Progressive Delivery)
└── Intent: Gradual release with monitoring, not measurement
└── Analytics: Monitoring (errors, latency), not causal metrics
└── Exposure tracking: Optional
└── Statistical engine: Not required
└── Example: "new_payment_gateway" — roll to 1% → 10% → 50% → 100%
└── Lifecycle: Completes when 100% rolled out → flag deleted
```

**Why conflating them causes bad data:**

```
ANTIPATTERN: Using feature flag as experiment

Feature flag "new_search_ui" enabled for 50% users.
PM says "let's measure if search conversion improved."

PROBLEM 1: No proper exposure tracking → denominator is wrong
PROBLEM 2: No pre-registered metrics → post-hoc metric selection (p-hacking risk)
PROBLEM 3: No defined runtime → peeking problem
PROBLEM 4: Users may have self-selected into flag cohort (not random) → confounding

The data you get is not trustworthy for causal inference.
```

**Correct mental model:**

```
Feature Flag System
├── Feature Flags  (deployment control, kill switches)
├── Experiments    (causal measurement, needs stats layer)
└── Rollouts       (progressive deployment, needs monitoring)

All share assignment/targeting infrastructure.
But experiments ADDITIONALLY require:
  - Proper randomization
  - Pre-registered metrics
  - Exposure tracking
  - Statistical analysis
  - Fixed runtime
```

> 🇻🇳 **Tóm tắt**: Feature flag = deployment control. Experiment = causal measurement. Rollout = gradual release with monitoring. Ba cái này share infrastructure nhưng khác intent hoàn toàn. Dùng feature flag như experiment = bad data. Luôn hỏi: "Chúng ta đang measure hay control?"

---

## Part 7: 10 Interview Q&As / 10 Câu Hỏi Phỏng Vấn

---

### 🟡 Q1: What's the difference between a feature flag and an A/B test?

**A:**

Feature flags and A/B tests share the same assignment infrastructure — but they have fundamentally different intents and requirements.

A **feature flag** is an on/off control switch: you can enable or disable a feature for specific users, segments, or percentages without deploying new code. It requires no analytics, no exposure tracking, and no statistical engine. The goal is operational control and safe deployment.

An **A/B test (experiment)** is a controlled measurement tool. Its sole purpose is measuring the causal effect of a change on a metric. This requires: (1) proper randomization so assignment is independent of user characteristics, (2) pre-registered success metrics before the experiment starts, (3) exposure tracking to count only users who actually saw the variant, (4) a statistical engine to determine if differences are real or due to chance, and (5) a fixed runtime determined by power analysis — not "until we see p < 0.05."

The dangerous mistake is treating a feature flag as an experiment: enabling a flag for 50% of users and then checking if conversion improved. The assignment may not be truly random, there's no power analysis, you'll peek at results, and you have no pre-registered metrics. The data looks like experiment data but isn't trustworthy for causal inference.

> 🇻🇳 **Tóm tắt**: Feature flag = kill switch, on/off control, không cần stats. A/B test = causal measurement, cần randomization + pre-registered metrics + exposure tracking + stats engine + fixed runtime. Dùng flag như experiment = invalid data vì thiếu tất cả những điều kiện kia.

**💡 Interview Signal:**

- ✅ Strong: Distinguishes intent (control vs measurement), lists the 5 requirements of a proper experiment, warns against using flags as experiments
- ❌ Weak: "A flag is on/off, A/B test is 50/50" — misses the causal inference requirements entirely

---

### 🟡 Q2: Where do you put variant assignment logic — client, server, or edge? Why?

**A:**

The answer depends on what you're testing and what tradeoffs are acceptable. There's no single right answer — but there is a clear decision framework.

**Server-side (SSR/RSC)**: For anything above the fold, SEO-critical, or layout-changing. Assignment happens during HTML generation — the browser receives a single correct HTML with no second render. No flicker, no CLS. Cost: adds to TTFB if SDK call is synchronous; caching complexity (different users need different HTML).

**Edge (Middleware)**: For route-level experiments, geographic personalization, or when you want low-latency assignment without hitting an origin server. Cookie-based stickiness. Works before React code runs. Cost: edge runtime limitations, must invalidate CDN cache correctly by variant.

**Client-side**: Only for below-the-fold interactive components, authenticated dashboards, or experiments where the user doesn't notice the delay. SDK initializes after hydration (~50ms for Statsig), variant applied via state update. Risk: FOUC and CLS for any visible content. Cost: SDK bundle size, SDK init time, flicker mitigation complexity.

**Decision rule**: The higher above the fold, the more SEO-critical, the more visible — use server or edge assignment. Client-side is acceptable for experiments that don't touch the initial paint.

> 🇻🇳 **Tóm tắt**: Above-fold + SEO-critical → server/edge. Below-fold + authenticated → client-side OK. Rule: càng visible và above-fold → càng cần server/edge để tránh flicker và CLS.

**💡 Interview Signal:**

- ✅ Strong: Frames by use case (above/below fold, SEO, auth), mentions CLS and FOUC as client risks, discusses caching complexity for server/edge
- ❌ Weak: "Server is better, always use server" — ignores legitimate client-side use cases and caching tradeoffs

---

### 🟡 Q3: What is "flicker" in A/B testing and how do you prevent it?

**A:**

Flicker (FOUC — Flash of Unstyled/Incorrect Content) happens in client-side A/B testing when the page renders with the control/default state first, then updates to the assigned variant after the SDK initializes. The user visually sees the content change, typically within 50–200ms of page load.

This causes two problems: (1) bad UX — users perceive the UI as "breaking" or loading slowly; (2) CLS (Cumulative Layout Shift) — if the variant change shifts elements, it degrades Core Web Vitals.

**Prevention strategies, in order of effectiveness:**

1. **Move assignment server-side or to edge** — the HTML renders with the correct variant from the start. No second render, no flicker. This is the gold standard.

2. **Anti-flicker snippet** (legacy approach, poor for performance): Inject a synchronous blocking script that hides the page (`document.documentElement.style.visibility = 'hidden'`) until the SDK loads, then restores visibility. This prevents visual flicker but blocks rendering — bad for LCP.

3. **Hide the specific component until SDK ready** — render the component with `visibility: hidden` but preserving layout. When SDK init completes, apply variant and make visible. This prevents layout shift while the component reserves its space.

4. **Use SSR-baked default that matches likely variant**: If 90% of users get Treatment, render Treatment as default — only 10% will see a brief "correction." This reduces flicker incidence but doesn't eliminate it.

The correct answer for any above-the-fold experiment: use server-side assignment.

> 🇻🇳 **Tóm tắt**: Flicker = user thấy control flash rồi switch sang treatment sau SDK init (~50ms). Gây bad UX + CLS. Fix tốt nhất: server/edge assignment. Fix client-side: hide component cho đến khi SDK ready, không dùng blocking anti-flicker script vì sẽ hurt LCP.

**💡 Interview Signal:**

- ✅ Strong: Explains WHY flicker happens (SDK async init), mentions CLS impact on Core Web Vitals, gives the server-side solution as primary, explains why anti-flicker snippet is bad for LCP
- ❌ Weak: "Use the anti-flicker snippet" — this is the textbook wrong answer; it trades flicker for blocking render

---

### 🟡 Q4: What is Sample Ratio Mismatch (SRM) and how do you detect it?

**A:**

Sample Ratio Mismatch (SRM) occurs when the actual distribution of users between experiment variants differs from the intended split. If you set up a 50/50 experiment but observe 52% Control / 48% Treatment, that's an SRM — and it means your data is compromised.

SRM is significant because it indicates something systematic is different between how Control and Treatment users are being counted or assigned. If the populations are systematically different before they even experience the variant, any metric difference you measure could be due to that population difference rather than the experiment itself.

Common causes: (1) A redirect in the Treatment variant that causes some users to drop out before being counted; (2) Bot filtering that only applies to one variant; (3) Cache serving the Control response to some Treatment users; (4) A bug in the hash function that doesn't produce uniform distribution; (5) Different SDK versions on different server instances.

Detection is via a chi-squared test on assignment counts:

```typescript
function hasSRM(controlN: number, treatmentN: number, expectedRatio = 0.5): boolean {
  const total = controlN + treatmentN;
  const expectedControl = total * expectedRatio;
  const expectedTreatment = total * (1 - expectedRatio);
  const chiSq =
    Math.pow(controlN - expectedControl, 2) / expectedControl +
    Math.pow(treatmentN - expectedTreatment, 2) / expectedTreatment;
  return chiSq > 10.83; // p < 0.001 threshold
}
```

If SRM is detected: **stop interpreting the experiment results**. Fix the assignment or counting issue, then re-run. Never ship based on data with SRM.

> 🇻🇳 **Tóm tắt**: SRM = tỷ lệ users thực tế giữa các variants khác với tỷ lệ thiết kế. Data bị compromise. Nguyên nhân: redirect bug, bot filter, cache mismatch, hash bug. Detect: chi-squared test. Nếu SRM → stop, fix, re-run. Đừng bao giờ ship dựa trên data có SRM.

**💡 Interview Signal:**

- ✅ Strong: Explains why SRM invalidates results (systematic population difference), gives at least 3 causes, mentions chi-squared detection, states the correct action (stop and re-run)
- ❌ Weak: "Just check if percentages are close enough" — without statistical test, you can't distinguish signal from noise

---

### 🟡 Q5: Variant ships, +5% conversion, p=0.04. Should you ship it?

**A:**

Not automatically — p=0.04 passes the α=0.05 threshold but several other checks need to pass before shipping.

**The checklist before shipping:**

1. **Was the runtime pre-determined?** If you ran the experiment for 7 days and planned for 14, stopping early because p just crossed 0.05 is peeking — the effective false positive rate is much higher than 5%.

2. **Did guardrail metrics stay healthy?** Check LCP, CLS, error rate, revenue per user, session length. The Uber homepage story: +8% conversion but +15% churn later. +5% on the primary metric with regressions on guardrail metrics = do not ship.

3. **Is there SRM?** Run the chi-squared check on assignment counts. If SRM exists, p=0.04 is meaningless.

4. **Practical significance?** Is +5% conversion meaningful for the business? A +5% lift on a checkout page driving $10M/year = $500K incremental — clearly significant. A +5% lift on a secondary CTA with negligible downstream revenue — maybe not worth the code complexity.

5. **Novelty effect?** If the experiment only ran for 5 days, some of the lift may be novelty. Consider extending to 2+ weeks for behavioral changes.

6. **Multiple testing?** If this is one of 5 concurrent experiments, the effective false positive rate is higher. Apply Bonferroni or accept higher replication standard.

**The answer**: p=0.04 is necessary but not sufficient. All of the above must also pass.

> 🇻🇳 **Tóm tắt**: p=0.04 pass threshold nhưng chưa đủ để ship. Phải check thêm: (1) đã chạy đủ thời gian chưa hay peeking? (2) guardrail metrics OK không? (3) SRM không? (4) practical significance có không? (5) novelty effect? Tất cả 5 điều kiện phải pass.

**💡 Interview Signal:**

- ✅ Strong: Immediately goes to the guardrail metrics and novelty concerns, mentions peeking risk, brings up practical significance, references Uber-style cautionary story
- ❌ Weak: "p < 0.05 means ship" — misses the entire secondary analysis required before a safe shipping decision

---

### 🔴 Q6: Hash-based bucketing vs random — when does the choice matter?

**A:**

Both achieve ~uniform distribution at scale, but they differ critically in stickiness.

**Random assignment** (e.g., `Math.random() < 0.5`): A user is randomly assigned each time the function is called with no memory of previous assignments. Without persisting this to a cookie or database, the same user will get different variants on different page loads. Suitable only when you explicitly persist assignment externally, or for experiments where re-assignment per session is intentional.

**Hash-based bucketing**: Deterministic function of `(userId, experimentId)` → bucket. Same inputs always produce same output. No storage needed. Inherently sticky across sessions, devices (if using authenticated userId), and time.

**When the choice matters:**

1. **Cross-session consistency**: If your experiment affects user behavior over time (e.g., a new onboarding flow), you need hash-based stickiness. Random per session means users see a different flow each visit — not just bad UX, it pollutes the metric with users who experienced both variants.

2. **Experiment isolation**: When running multiple experiments, using `(userId, experimentId)` as the hash input ensures the bucket for experiment A is independent of the bucket for experiment B. Pure random also achieves this if independently seeded, but hash-based makes it auditable and reproducible.

3. **Cross-device (logged-in users)**: If hashing on authenticated `userId`, the same user on mobile and desktop gets the same variant. Random with session cookie cannot do this.

4. **Debugging and reproducibility**: With hash-based, you can reproduce exactly which variant any user received at any point in time — invaluable for investigating anomalous user reports.

**When it doesn't matter**: Single-session experiments where variant is stored in cookie on first assignment — once stored, both approaches are equally sticky for that session.

> 🇻🇳 **Tóm tắt**: Hash-based = deterministic, sticky, reproducible, không cần storage. Random = nếu không persist → re-assignment mỗi session. Hash-based quan trọng khi: (1) cross-session consistency cần thiết, (2) cross-device (authenticated users), (3) debugging reproducibility. Random OK nếu assignment được persist ngay sau đó.

**💡 Interview Signal:**

- ✅ Strong: Identifies cross-session consistency and cross-device as the key scenarios, explains that random without persistence causes variant re-assignment pollution, mentions reproducibility for debugging
- ❌ Weak: "Hash is more random" — incorrect; both are equally "random" in distribution; the difference is determinism, not randomness quality

---

### 🔴 Q7: You're A/B testing a recommendation algorithm. The model output differs by user but you want clean variants. How do you design assignment?

**A:**

This is a nuanced experiment design problem. The challenge: the recommendation algorithm is inherently personalized, but the experiment requires isolating the causal effect of the algorithm itself — not confounding with user-specific factors.

**The core design:**

Assignment must happen at the **user level, not the request level**. Every recommendation request from the same user must use the same algorithm variant throughout the experiment.

```typescript
// Assignment: user-level, hash-based, persistent for experiment duration
function getAlgorithmVariant(userId: string): "control_collab_filter" | "treatment_neural_net" {
  const bucket = hashBucket(userId, "recommendation_algo_v3_experiment");
  return bucket < 50 ? "control_collab_filter" : "treatment_neural_net";
}

// In recommendation service:
async function getRecommendations(userId: string, context: RecommendationContext) {
  const variant = getAlgorithmVariant(userId);

  // Fire exposure ONLY when recommendations are actually shown
  // Not when getAlgorithmVariant is called (they might call and not render)

  if (variant === "treatment_neural_net") {
    const recs = await neuralNetModel.recommend(userId, context);
    trackExposure(userId, "recommendation_algo_v3_experiment", "treatment");
    return recs;
  } else {
    const recs = await collaborativeFilter.recommend(userId, context);
    trackExposure(userId, "recommendation_algo_v3_experiment", "control");
    return recs;
  }
}
```

**Key design decisions:**

1. **Exposure at render time, not assignment time**: Only count a user as "exposed" when recommendations are actually shown. Some users may be assigned but never reach the page — counting them inflates denominator and dilutes effect.

2. **Holdout period**: Run a "cookie stuffing" analysis — verify assigned users are balanced across feature distributions (age, tenure, past click rate) before experiment starts. Algorithm experiments are particularly sensitive to user mix imbalances.

3. **Primary metric for algorithm experiment**: Not just CTR on recommendations. Track downstream metrics: 7-day engagement, session length, return visit rate. Algorithm quality is a long-horizon signal.

4. **Network effects**: If recommendations surface content that gets more engagement, it may affect organic discovery for ALL users (not just Treatment). Plan for network contamination analysis.

5. **Cache invalidation**: Recommendation results may be cached. Ensure cache keys include the variant: `cache_key = ${userId}:${variant}:${context_hash}`.

> 🇻🇳 **Tóm tắt**: Assignment ở user level, hash-based, persistent. Exposure tracking khi recs thực sự render (không khi assign). Verify user cohort balance trước khi start. Primary metric = downstream (7-day engagement), không chỉ CTR. Cache phải bao gồm variant trong key.

**💡 Interview Signal:**

- ✅ Strong: Distinguishes exposure tracking from assignment, identifies downstream metrics as primary, mentions cache key contamination, raises network effects concern
- ❌ Weak: "Randomly assign each recommendation request" — this re-assigns users per-request, mixing algorithms for the same user and invalidating causal measurement

---

### 🔴 Q8: Multi-armed bandit vs fixed-split A/B test — when do you use which?

**A:**

The fundamental trade-off is **statistical rigor vs optimization regret**.

**Fixed-split A/B test**: Allocate a predetermined percentage to each variant (e.g., 50/50) for a predetermined duration. Provides clean causal inference. If Treatment is worse, you accept paying the "regret" cost (50% of users got the worse experience) in exchange for an unbiased measurement of the effect size.

**Multi-armed bandit (MAB)**: Adaptively allocates more traffic to the better-performing variant as evidence accumulates. Regret is lower — fewer users experience the worse variant. But statistical properties are different: the adaptive allocation is correlated with outcomes, making causal inference harder.

**When to use fixed-split A/B:**

- When you need to understand **why** the variant won, not just that it won — causal inference requires clean randomization
- When the experiment will inform future decisions (a learnable insight, not just a one-time optimization)
- When you have enough traffic that regret isn't a primary concern
- Regulatory environments where you must demonstrate clean experimental methodology

**When to use Multi-Armed Bandit:**

- Optimizing content that changes frequently: headlines, images, push notification copy
- Low-traffic experiments where regret is disproportionately costly
- When you don't care about causal understanding — just "which variant is better"
- Short-horizon decisions that won't generalize (promotion banner for a 3-day sale)

**The Booking.com lens**: Their 1,000+ concurrent experiments use fixed-split A/B for feature experiments (they need to learn). They use MAB-adjacent techniques for content optimization (headlines, images) where the goal is pure performance, not learning.

**Specific MAB algorithms by context:**

- **Epsilon-greedy**: Simple, works; explore 10% randomly, exploit 90% best
- **Thompson Sampling**: Bayesian, better at balancing exploration; Statsig and Optimizely offer this
- **UCB (Upper Confidence Bound)**: Mathematically proven optimality; higher implementation complexity

> 🇻🇳 **Tóm tắt**: Fixed-split = clean causal inference, higher regret. MAB = lower regret, weaker causal inference. Rule: dùng fixed-split khi cần **hiểu why** (feature experiments, learnable insights). Dùng MAB khi chỉ cần **optimize quickly** (content, headlines, không cần causal understanding).

**💡 Interview Signal:**

- ✅ Strong: Frames the regret vs causal inference tradeoff explicitly, gives concrete examples (feature vs content), names MAB algorithms, understands Booking.com-scale context
- ❌ Weak: "MAB is better because it's more efficient" — misses the causal inference tradeoff and specific use case constraints

---

### 🔴 Q9: PM wants to test 5 things at once. What are the risks and how do you handle them?

**A:**

This is a multiple testing, interaction effects, and organizational alignment problem.

**Risk 1: Multiple Testing Inflation**

Running 5 independent tests with α=0.05 each: probability of at least one false positive = 1 - (0.95)^5 = 22.6%. You'll "find" a winner by chance in roughly 1 in 4 such batches.

Mitigation: Apply Bonferroni correction (α = 0.05/5 = 0.01 per test), or use False Discovery Rate correction (Benjamini-Hochberg) which is less conservative for many tests.

**Risk 2: Interaction Effects**

If experiments share the same users and same UI surface, they may interact: the effect of Experiment A may differ depending on which variant of Experiment B the user is in. This creates confounding that neither test can account for.

Mitigation option A: Run as factorial design — assign all combinations (2×2×2×2×2 = 32 cells for binary variants). Requires 32× more users to power all main effects and interactions. Usually not feasible.

Mitigation option B: Run sequentially, not simultaneously. Lose velocity but gain clean data.

Mitigation option C: If you have evidence the experiments are **independent** (test different surfaces, non-overlapping user flows), accept the interaction risk and document it.

**Risk 3: Traffic Fragmentation**

With 5 concurrent experiments, if any share the same user population, each gets a smaller slice. If you need 10,000 users per variant per experiment, that's 100,000 unique users. At 5,000 DAU, that's 20 days per test — or 100 days if sequential.

Mitigation: Prioritize experiments by expected value and run the highest-impact first.

**The conversation to have with PM:**

> "I can run all 5, but I need to explain the tradeoffs. If they're on separate surfaces, interaction risk is low — let's confirm that first. If they're on the same page, we risk false positives and confounded results. My recommendation: rank the 5 by expected impact, run the top 2 now, queue the others. We'll have cleaner data and make better decisions."

> 🇻🇳 **Tóm tắt**: 3 risks: (1) Multiple testing inflation — 22.6% chance of false positive across 5 tests, fix: Bonferroni. (2) Interaction effects — experiments on same surface interfere, fix: factorial design (expensive) hoặc sequential. (3) Traffic fragmentation — insufficient sample per test. Conversation với PM: prioritize top 2, queue the rest.

**💡 Interview Signal:**

- ✅ Strong: Quantifies the false positive rate (22.6%), explains interaction effects with a concrete example, proposes the PM conversation as a structured trade-off discussion, not a "no"
- ❌ Weak: "Running 5 at once is fine" — ignores all three risks; or "never run concurrent experiments" — overly conservative, impractical for fast-moving product teams

---

### 🔴 Q10: Experiment "wins" on conversion but Core Web Vitals tank. Decision framework?

**A:**

This is a classic guardrail metrics failure — a case where the experiment shouldn't ship despite a primary metric win.

**First: quantify both sides.**

- Conversion lift: +5% on primary conversion. Calculate revenue impact: if $10M/year baseline, that's +$500K.
- CWV degradation: LCP went from 2.1s to 3.2s (crosses the "needs improvement" threshold). INP increased by 50ms. CLS increased by 0.08.

**Why this matters beyond user experience:**

Core Web Vitals are a Google ranking signal. LCP > 2.5s and CLS > 0.1 can materially affect organic search ranking. If this page depends on SEO traffic, a CWV regression reduces the traffic pool that feeds your conversion funnel — potentially more than offsetting the +5% conversion rate lift.

**The decision framework:**

```
1. Identify the root cause of the CWV regression.
   - Is it the variant's additional JavaScript? (SDK overhead? Heavier component?)
   - Is it unoptimized images in the treatment variant?
   - Is it a render-blocking element?
   → Can we fix the CWV issue while keeping the conversion improvement?

2. Quantify the SEO risk.
   - What % of page traffic comes from organic search?
   - What's the estimated traffic loss from crossing LCP threshold?
   - Use Google Search Console + PageSpeed Insights to estimate.

3. Time-horizon analysis.
   - Conversion lift is immediate.
   - SEO ranking impact is 2–8 weeks delayed.
   - A/B test measured 14 days; SEO impact not yet reflected.

4. Decision options:
   a. FIX THEN SHIP: Investigate CWV regression. Optimize the variant to fix it.
      Then re-run with both metrics passing. Best outcome.
   b. HOLD: If CWV fix is complex, hold the ship. A $500K gain with potential
      $2M SEO traffic loss is a bad trade.
   c. SHIP WITH MONITORING: Only if CWV regression is minimal (LCP 2.1→2.3, not 2.1→3.2)
      and organic traffic is <10% of total. Ship with 30-day CWV monitoring plan.
   d. KILL: If conversion lift is small (practical significance low) and CWV regression
      is significant. The experiment failed on guardrails.

5. Never ship if:
   - LCP crosses from "Good" (<2.5s) to "Needs Improvement" (>2.5s)
   - CLS crosses 0.1 threshold
   - Error rate increased in treatment
```

**The answer for interview**: "Guardrail metrics exist for this reason. I'd first investigate whether the CWV regression is fixable without losing the conversion lift. If yes, fix and re-run. If not, I'd quantify the SEO traffic risk — CWV affect ranking, which affects the denominator of conversions. A 5% conversion rate lift that causes 10% organic traffic loss is a net negative. I'd hold or kill."

> 🇻🇳 **Tóm tắt**: Guardrail metrics failure = đừng ship dù primary metric win. Framework: (1) identify CWV root cause — có fix được không? (2) quantify SEO risk — CWV ảnh hưởng ranking. (3) time-horizon analysis — SEO effect delayed 2–8 weeks. (4) Options: Fix then ship / Hold / Ship with monitoring / Kill. Never ship khi LCP vượt 2.5s threshold hoặc CLS vượt 0.1.

**💡 Interview Signal:**

- ✅ Strong: Immediately identifies this as a guardrail failure, explains the SEO→traffic→conversion cascading risk, proposes the root cause investigation before kill/ship decision, gives concrete CWV thresholds
- ❌ Weak: "Ship it — conversion is the primary metric" — misses the systemic risk and the time-delayed SEO impact

---

## Anti-Patterns / Các Lỗi Thường Gặp

### Anti-Pattern 1: Client-Side Assignment for Above-the-Fold Content

```
SYMPTOM: A/B experiment uses React SDK, variant applied in useEffect
RESULT: User sees "Sign Up" button flash to "Get Started Free" 50ms after load
IMPACT: CLS score increases, bad UX, LCP candidate may change

WHY IT'S TEMPTING: Easy to set up, fast to iterate, no backend changes
WHY IT'S WRONG: Flicker degrades Core Web Vitals. Above-fold content
                 should be correct on first paint.

FIX: Move assignment to server (RSC) or edge (middleware).
     Reserve client-side SDK for below-fold or non-visual experiments.
```

### Anti-Pattern 2: Peeking at P-Value and Stopping Early

```
SYMPTOM: Check results daily. On day 8, p=0.04. Ship it.
RESULT: False positive — actual effect may not exist
IMPACT: Feature shipped based on noise. Potential regression goes unnoticed.

WHY IT'S TEMPTING: "It's significant! Why wait?"
WHY IT'S WRONG: Repeated significance testing inflates false positive rate.
                 Checking daily for 14 days ≈ 40–50% chance of false positive.

FIX: Pre-register runtime via power analysis. Check ONCE at predetermined endpoint.
     Or use tools with sequential testing (Statsig's Always-Valid Inference).
```

### Anti-Pattern 3: Treating Feature Flag as Experiment

```
SYMPTOM: Enable flag for 50% users. Check analytics dashboard 2 weeks later.
         "Looks like conversion went up. Ship the flag."
RESULT: Causal inference invalid — no pre-registration, no power analysis,
        likely peeked, may have SRM.

WHY IT'S TEMPTING: No extra setup required. Feels like an experiment.
WHY IT'S WRONG: Missing all experiment requirements: no pre-registered metrics,
                no power calculation, no exposure tracking, no SRM check.

FIX: Explicitly create an experiment (not just a flag) with registered metrics,
     power-based sample size, exposure tracking, and fixed runtime.
```

### Anti-Pattern 4: 50+ Flags Without Lifecycle Management

```
SYMPTOM: Codebase has 60+ feature flags. Developers unsure which are active.
         Dead code paths everywhere. Flag state unknown in prod.

IMPACT: - Dead code shipped to all users forever
        - "if (flags.oldFeature)" branches that always evaluate false
        - Performance: SDK fetches config for all flags including dead ones
        - Cognitive overhead: engineers afraid to delete flags

FIX: Flag TTL policy — every flag has an expiry date set at creation.
     Quarterly flag audit. Delete flags within 2 weeks of experiment decision.
     Tools: LaunchDarkly has built-in stale flag detection.
```

### Anti-Pattern 5: Mismatched Bucket Logic Between Exposure and Metric

```
SYMPTOM: Assignment SDK uses userId. Analytics uses sessionId.
RESULT: Users counted in multiple variants in metric system.
        User assigned to Treatment, but their conversion fires under Control bucket.

IMPACT: Both variants show inflated conversion (double-counting).
        Actual lift is diluted. Experiment appears to have no effect.

FIX: Ensure the identifier used for assignment is the SAME identifier
     used for metric attribution throughout the pipeline.
     Document and enforce this in experiment setup checklist.
```

### Anti-Pattern 6: Running A/B Test Without Baseline Period / Novelty Bias

```
SYMPTOM: Ship experiment immediately after feature launch.
         Treatment gets spike in early engagement. "It won!"
RESULT: Novelty effect — users engage with new things.
        Effect decays after 1–2 weeks.

IMPACT: Ship feature that actually has neutral/negative long-term effect.

FIX: For behavioral changes (new UI patterns, layout changes),
     run experiment for minimum 2 weeks — ideally 4 weeks.
     Segment analysis: compare week 1 vs week 3+ cohorts.
     If effect size decreases over time, it's novelty. Don't ship.
```

> 🇻🇳 **Tóm tắt**: 6 anti-patterns: (1) Client-side assignment for above-fold → flicker. (2) Peeking → false positive. (3) Flag as experiment → invalid causal inference. (4) Flag graveyard → dead code. (5) Mismatched identifiers → double-counting. (6) No baseline period → novelty bias. Biết 6 cái này = biết experimentation pitfalls ở production level.

---

## Memory Hook / Gợi Nhớ

**🧠 "HAREST" — The A/B Testing Checklist**

```
H — Hypothesis: Is there a clear, falsifiable hypothesis?
A — Assignment: Server/edge for above-fold. Client only for below-fold.
R — Runtime: Pre-calculate via power analysis. Don't peek.
E — Exposure: Track when user SEES variant, not when assigned.
S — SRM: Run chi-squared check on assignment counts before interpreting.
T — Today's guardrails: Conversion up but CWV tanked? Fix first.
```

**One-liner**: _"Experiments are causal questions. Flags are operational controls. Peeking breaks the causal question. Flicker breaks the UX. SRM breaks the data."_

> 🇻🇳 **Gợi nhớ**: **HAREST** = Hypothesis, Assignment (server/edge), Runtime (pre-set), Exposure (khi thấy, không khi assign), SRM check, Today's guardrails. Câu one-liner: "Experiment = causal question. Flag = operational control. Peeking phá causal. Flicker phá UX. SRM phá data."

---

## Q&A Summary Table / Bảng Tóm Tắt Q&A

| #   | Level | Question                           | Core Answer Signal                                                                                     |
| --- | ----- | ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1   | 🟡    | Feature flag vs A/B test?          | Flag = deployment control. Test = causal measurement with 5 requirements.                              |
| 2   | 🟡    | Client/server/edge assignment?     | Above-fold → server/edge. Below-fold authenticated → client OK.                                        |
| 3   | 🟡    | What is flicker, how to prevent?   | SDK async init causes FOUC+CLS. Fix: server assignment. Not anti-flicker snippet.                      |
| 4   | 🟡    | What is SRM, how to detect?        | Assignment ratio mismatch. Chi-squared test. If detected: stop, fix, re-run.                           |
| 5   | 🟡    | p=0.04, +5% conversion. Ship?      | Check peeking, guardrails, SRM, practical significance, novelty effect first.                          |
| 6   | 🔴    | Hash vs random assignment?         | Hash = deterministic, sticky, reproducible. Matters for cross-session/cross-device.                    |
| 7   | 🔴    | A/B test recommendation algorithm? | User-level assignment. Exposure at render, not assign. Downstream metrics. Cache key includes variant. |
| 8   | 🔴    | MAB vs fixed-split A/B?            | Fixed = causal inference. MAB = lower regret, weaker causality. Feature→fixed. Content→MAB.            |
| 9   | 🔴    | PM wants 5 simultaneous tests?     | Multiple testing inflation. Interaction effects. Traffic fragmentation. Prioritize top 2.              |
| 10  | 🔴    | Wins on conversion, CWV tanks?     | Guardrail failure. Investigate root cause. SEO ranking risk. Fix then ship or hold.                    |

---

## Cold Call Simulation / Mô Phỏng Phỏng Vấn Nhanh

**Interviewer:** "Your team wants to test a new checkout flow. PM says 'just set a feature flag for 50% of users and check conversion next week.' What do you do?"

**Strong answer framework:**

1. "I'd align on whether this is a feature flag (deployment control) or an experiment (causal measurement). If we want to learn whether the new flow improves conversion, it's an experiment — and that requires more than a flag."

2. "First question: how much traffic does checkout get? We need to calculate sample size before starting. If we need 15,000 users per variant and have 3,000 checkout initiations/day, that's 10 days minimum."

3. "I'd set up proper exposure tracking: fire an event when users actually enter the checkout flow, not when they're assigned. Assignment and exposure are different."

4. "Pre-register the primary metric (checkout completion rate), secondary metrics (cart abandonment step by step), and guardrail metrics (LCP/CLS on checkout page, error rate, revenue per completed order)."

5. "Define the runtime upfront — say 14 days — and commit to reading results once at the end, not daily. Run SRM check before interpreting."

6. "On rendering: if the new flow affects above-the-fold checkout elements, I'd push assignment to server-side to avoid flicker. Client-side SDK is fine for below-fold interactive changes."

**Interviewer:** "What if PM says we don't have time for all that?"

**Senior answer:** "The PM is optimizing for shipping speed; I'm optimizing for decision quality. Without proper setup, we might ship based on a false positive, or miss a real regression. I'd propose a middle ground: use Statsig or PostHog which automate most of this — sample size calculation, SRM detection, proper exposure tracking, sequential testing to avoid peeking. Setup time is 2 hours, not 2 days. The 'overhead' is mostly automated."

---

## Self-Check / Tự Kiểm Tra

Sau khi học xong topic này, bạn nên trả lời được:

- [ ] Giải thích sự khác biệt giữa feature flag, A/B experiment, và rollout — cùng infra, khác intent
- [ ] Vẽ được lifecycle của một A/B test: Hypothesis → Assignment → Rendering → Exposure → Metrics → Stats → Decision
- [ ] Giải thích tại sao client-side A/B testing gây FOUC/CLS và 3 cách mitigate
- [ ] Viết hash-based bucketing function và giải thích tại sao dùng nó thay vì `Math.random()`
- [ ] Giải thích SRM: là gì, tại sao invalidate experiment, cách phát hiện bằng chi-squared test
- [ ] Giải thích peeking problem: tại sao stopping early khi p=0.04 không valid về mặt thống kê
- [ ] So sánh Statsig, GrowthBook, Vercel Flags, PostHog: khi nào chọn cái nào
- [ ] Giải thích Next.js middleware pattern để assign variants at edge — bao gồm cache header requirements
- [ ] Biết số thực tế: Statsig SDK init ~50ms, Optimizely ~100–200ms, Vercel Edge Config <1ms
- [ ] Nếu experiment wins on conversion nhưng CWV tệ đi — framework quyết định có ship không
- [ ] Giải thích novelty effect vs primacy effect và tại sao chúng ảnh hưởng đến experiment duration
- [ ] Biết 6 anti-patterns: client assignment above-fold, peeking, flag-as-experiment, flag graveyard, mismatched identifiers, no baseline period

---

_Last updated: 2026-05-06 | Source: Frontend Masters Handbook 2024 §6.1 + 2025–2026 production experimentation patterns (Statsig, GrowthBook, Vercel Edge Config, PostHog)_
