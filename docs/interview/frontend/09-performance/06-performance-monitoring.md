# Performance Monitoring - Measure & Track

> "You can't improve what you don't measure." Lighthouse, RUM, và continuous monitoring.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE MONITORING                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    LAB DATA                              │   │
│   │            (Simulated, Controlled)                       │   │
│   │                                                           │   │
│   │   • Lighthouse                                           │   │
│   │   • PageSpeed Insights                                   │   │
│   │   • WebPageTest                                          │   │
│   │   • Chrome DevTools                                      │   │
│   │                                                           │   │
│   │   Pro: Reproducible, detailed                            │   │
│   │   Con: May not reflect real users                        │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    FIELD DATA                            │   │
│   │              (Real User Monitoring)                      │   │
│   │                                                           │   │
│   │   • Chrome UX Report (CrUX)                             │   │
│   │   • web-vitals library                                   │   │
│   │   • RUM services (Datadog, New Relic)                   │   │
│   │                                                           │   │
│   │   Pro: Real user experience                              │   │
│   │   Con: Noisy, harder to debug                           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   BEST PRACTICE: Use both for complete picture                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔦 Lighthouse

### Running Lighthouse

```bash
# CLI
npx lighthouse https://example.com --output html --output-path ./report.html

# With specific categories
npx lighthouse https://example.com --only-categories=performance,accessibility

# Chrome DevTools
# Open DevTools → Lighthouse tab → Generate report

# PageSpeed Insights (includes CrUX data)
# https://pagespeed.web.dev/
```

### Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build
        run: npm run build

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: './lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true
```

```javascript
// lighthouserc.json
{
    "ci": {
        "collect": {
            "url": ["http://localhost:3000/", "http://localhost:3000/about"],
            "startServerCommand": "npm run start"
        },
        "assert": {
            "assertions": {
                "categories:performance": ["error", { "minScore": 0.9 }],
                "categories:accessibility": ["warn", { "minScore": 0.9 }],
                "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
                "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
                "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
            }
        },
        "upload": {
            "target": "temporary-public-storage"
        }
    }
}
```

---

## 📊 Web Vitals Measurement

### Using web-vitals Library

```javascript
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';

// Report to analytics
function sendToAnalytics(metric) {
    const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating, // 'good', 'needs-improvement', 'poor'
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType
    });

    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
        navigator.sendBeacon('/analytics', body);
    } else {
        fetch('/analytics', { body, method: 'POST', keepalive: true });
    }
}

// Collect all metrics
onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);

// Next.js - pages/_app.js
export function reportWebVitals(metric) {
    console.log(metric);
    sendToAnalytics(metric);
}
```

### Custom Performance Marks

```javascript
// Mark and measure custom metrics
performance.mark('app-init-start');

// ... initialization code ...

performance.mark('app-init-end');
performance.measure('app-init', 'app-init-start', 'app-init-end');

// Get the measurement
const measures = performance.getEntriesByName('app-init');
console.log('Init time:', measures[0].duration);

// React component timing
function ExpensiveComponent() {
    useEffect(() => {
        performance.mark('component-mount-start');

        return () => {
            performance.mark('component-mount-end');
            performance.measure(
                'component-mount',
                'component-mount-start',
                'component-mount-end'
            );
        };
    }, []);
}
```

---

## 🛠️ Chrome DevTools Performance Panel

### Recording Performance

```
1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record (Ctrl+E)
4. Perform actions to test
5. Stop recording
6. Analyze results

KEY AREAS:
─────────────────────────────────────────────────────────────
Summary: Time breakdown (Script, Render, Paint, etc.)
Main: Main thread activity timeline
Network: Resource loading
Frames: Frame rate graph
Timings: Web vitals markers

LOOK FOR:
• Long Tasks (red flags) - blocks over 50ms
• Layout Shifts - CLS issues
• Forced Reflows - layout thrashing
• Heavy Paint - expensive rendering
```

### Memory Panel

```javascript
// Take heap snapshot
// DevTools → Memory → Heap snapshot

// Timeline allocation
// DevTools → Memory → Allocation instrumentation on timeline

// Common memory issues:
// 1. Detached DOM nodes
// 2. Event listener leaks
// 3. Closures holding references
// 4. Timers not cleared

// Example: Finding memory leaks
class Component {
    constructor() {
        this.data = new Array(10000).fill('data');
        window.addEventListener('resize', this.handler);
    }

    handler = () => {
        console.log(this.data.length);
    }

    // ❌ Missing cleanup - memory leak!

    // ✅ Proper cleanup
    destroy() {
        window.removeEventListener('resize', this.handler);
        this.data = null;
    }
}
```

---

## 📈 Real User Monitoring (RUM)

### Custom RUM Implementation

```javascript
// Simple RUM collector
class PerformanceCollector {
    constructor(endpoint) {
        this.endpoint = endpoint;
        this.metrics = {};
        this.init();
    }

    init() {
        // Navigation timing
        window.addEventListener('load', () => {
            const timing = performance.timing;
            this.metrics.pageLoad = timing.loadEventEnd - timing.navigationStart;
            this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
            this.metrics.ttfb = timing.responseStart - timing.requestStart;

            this.report();
        });

        // Core Web Vitals
        import('web-vitals').then(({ onLCP, onINP, onCLS }) => {
            onLCP(metric => this.metrics.lcp = metric.value);
            onINP(metric => this.metrics.inp = metric.value);
            onCLS(metric => this.metrics.cls = metric.value);
        });

        // Report on page unload
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.report();
            }
        });
    }

    report() {
        const data = {
            url: window.location.href,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            connection: navigator.connection?.effectiveType,
            ...this.metrics
        };

        navigator.sendBeacon(this.endpoint, JSON.stringify(data));
    }
}

new PerformanceCollector('/api/rum');
```

### RUM Services

```javascript
// Datadog RUM
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
    applicationId: 'YOUR_APP_ID',
    clientToken: 'YOUR_CLIENT_TOKEN',
    site: 'datadoghq.com',
    service: 'my-web-app',
    env: 'production',
    version: '1.0.0',
    sampleRate: 100,
    trackInteractions: true,
    trackResources: true,
    trackLongTasks: true
});

// New Relic Browser
// <script> in HTML head with license key

// Sentry Performance
import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
    dsn: 'YOUR_DSN',
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0
});
```

---

## 📋 Performance Budgets

### Setting Budgets

```javascript
// webpack.config.js
module.exports = {
    performance: {
        maxAssetSize: 100000, // 100 KB per asset
        maxEntrypointSize: 300000, // 300 KB total
        hints: 'error' // Fail build if exceeded
    }
};

// package.json with bundlesize
{
    "bundlesize": [
        {
            "path": "./dist/*.js",
            "maxSize": "100 KB"
        },
        {
            "path": "./dist/*.css",
            "maxSize": "20 KB"
        }
    ]
}

// Lighthouse CI budgets
{
    "ci": {
        "assert": {
            "budgets": [{
                "resourceSizes": [
                    { "resourceType": "script", "budget": 150 },
                    { "resourceType": "stylesheet", "budget": 30 },
                    { "resourceType": "image", "budget": 300 },
                    { "resourceType": "total", "budget": 500 }
                ],
                "resourceCounts": [
                    { "resourceType": "third-party", "budget": 10 }
                ]
            }]
        }
    }
}
```

### Budget Types

```
┌─────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE BUDGETS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   QUANTITY BUDGETS:                                              │
│   • Max JavaScript: 300 KB (gzipped)                            │
│   • Max CSS: 50 KB (gzipped)                                    │
│   • Max images per page: 10                                     │
│   • Max third-party requests: 5                                 │
│                                                                   │
│   TIMING BUDGETS:                                                │
│   • LCP: < 2.5s                                                 │
│   • INP: < 200ms                                                │
│   • CLS: < 0.1                                                  │
│   • Time to Interactive: < 5s                                   │
│                                                                   │
│   CUSTOM BUDGETS:                                                │
│   • Search results render: < 1s                                 │
│   • Cart add response: < 300ms                                  │
│   • Checkout page load: < 3s                                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Continuous Monitoring

### Alerting

```javascript
// Example: Alert on performance regression
async function checkPerformance() {
    const metrics = await getRUMMetrics();

    const thresholds = {
        lcp: 2500,
        inp: 200,
        cls: 0.1
    };

    Object.entries(thresholds).forEach(([metric, threshold]) => {
        const p75 = metrics[metric].p75;
        if (p75 > threshold) {
            sendAlert({
                metric,
                value: p75,
                threshold,
                message: `${metric} p75 (${p75}) exceeds threshold (${threshold})`
            });
        }
    });
}

// Schedule daily checks
setInterval(checkPerformance, 24 * 60 * 60 * 1000);
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What is Lighthouse?**

A: Google's automated tool for auditing web page quality. Measures performance, accessibility, SEO, and best practices. Gives scores 0-100 with specific recommendations.

**Q: Lab data vs field data?**

A:
- **Lab**: Controlled environment (Lighthouse). Reproducible, detailed.
- **Field**: Real users (RUM, CrUX). Reflects actual experience.

Use both - lab for debugging, field for real impact.

### 🟡 Mid-level

**Q: How do you set up performance monitoring?**

A:
1. Lighthouse CI in CI/CD for lab data
2. web-vitals library for Core Web Vitals
3. RUM service (Datadog, Sentry) for field data
4. Performance budgets with alerts
5. Regular performance reviews

**Q: What metrics would you track?**

A:
- Core Web Vitals (LCP, INP, CLS)
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Bundle sizes
- API response times
- Error rates

### 🔴 Senior

**Q: Design performance monitoring strategy**

A:
```
1. Collection Layer:
   - web-vitals for Core Web Vitals
   - Custom marks for business metrics
   - Error tracking integration
   - Network timing API

2. Processing Layer:
   - Aggregate by percentile (p50, p75, p95)
   - Segment by device, connection, region
   - Correlate with user actions

3. Alerting:
   - Threshold-based (p75 > target)
   - Regression detection
   - Anomaly detection

4. Reporting:
   - Real-time dashboard
   - Weekly performance reports
   - Budget compliance tracking

5. Integration:
   - PR comments with bundle size
   - Lighthouse in CI
   - Performance regression tests
```

---

## 📚 Active Recall

1. [ ] Lab vs field data differences
2. [ ] Core Web Vitals thresholds
3. [ ] web-vitals library usage
4. [ ] Performance budget types
5. [ ] RUM implementation basics

---

> **Module hoàn thành!** Xem [mindmap-performance.md](./mindmap-performance.md) để tổng hợp kiến thức.
