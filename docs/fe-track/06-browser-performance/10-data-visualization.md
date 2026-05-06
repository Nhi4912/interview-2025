# Data Visualization — Trực Quan Hóa Dữ Liệu

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Core Web Vitals](./01-core-web-vitals.md), [Rendering Optimization](./05-rendering-optimization-theory.md), [Bundle Optimization](./03-bundle-optimization.md)
> **See also**: [React Performance](./02-react-performance.md) | [Bundle Analysis](./07-bundle-analysis-deep-dive.md) | [FE System Design](../08-fe-system-design/) | [Accessibility](../11-accessibility/)

---

## Real-World Scenario / Tình Huống Thực Tế

Interviewer hỏi: _"We're building a real-time analytics dashboard. We need to plot 500,000 metric data points per view, update every second, and it must be accessible. How do you approach this?"_

Hầu hết ứng viên sẽ nói ngay: _"Dùng Chart.js hoặc Recharts"_ — và đây là câu trả lời Junior. Một Senior Engineer sẽ dừng lại và hỏi: "What render target? What update frequency? Do users need to interact with individual points? What's the a11y requirement?" Và sau đó kết luận: **500k points + 1-second refresh → Canvas or WebGL. Recharts will die.**

Dưới đây là context thực tế từ các công ty bạn sẽ phỏng vấn:

- **Grafana** renders dashboards với **1 billion+ data points per time-series panel** — họ dùng WebGL (uPlot + canvas-based backend) để giữ render < 16ms. SVG-based approaches chết ở ~5k points.
- **Stripe Sigma** (analytics SQL UI) render kết quả query dưới dạng bar/line charts tương tác — họ dùng D3 scales cho math nhưng render qua Canvas để handle large result sets mà không block main thread.
- **Grab Partner Dashboard** (Vietnam market) hiển thị driver heatmaps, trip volume theo giờ, revenue trends — kiến trúc là React + ECharts, vì ECharts hỗ trợ Canvas rendering + large dataset API (`dataset` + `large: true`) mà không cần custom WebGL code.
- **Figma** activity graphs (file edit history, multiplayer cursor trails) render qua Canvas — SVG sẽ tạo hàng nghìn DOM nodes, gây layout thrashing mỗi frame khi 100 người edit cùng lúc.
- **Datadog APM heatmaps** (latency distribution) dùng WebGL cho heatmap overlays — pixel-level rendering của 10M+ spans per view không thể làm khác được.
- **Vercel Analytics** (Web Vitals dashboard) dùng Recharts (React + SVG) — dataset nhỏ (~hundreds of data points per chart), interactive hover là priority, và bundle size matters vì dashboard là product itself.

Đây là lý do tại sao data visualization là **senior signal**: library choice phản ánh khả năng phân tích constraint (render target, dataset size, a11y, bundle cost), không phải chỉ biết dùng Chart.js.

---

## Concept Map / Bản Đồ Khái Niệm

```
DATA VISUALIZATION DECISION TREE
─────────────────────────────────────────────────────────────────
START: How many data points? What interaction model?
│
├─── < 1,000 points + rich interaction (hover, click, zoom)?
│    │
│    └── SVG (D3, Recharts, visx)
│         ✅ Each element is a DOM node → CSS hover, ARIA, keyboard
│         ✅ Crisp at any DPR, scales without pixelation
│         ✅ Screen readers can traverse individual data elements
│         ❌ Browser paint limit ~5k SVG nodes before jank
│         └── Pick: Recharts (declarative) | visx (composable) | D3 (full control)
│
├─── 1,000 – 100,000 points + moderate interaction?
│    │
│    └── Canvas 2D (Chart.js, ECharts canvas mode, Recharts + canvas plugin)
│         ✅ Single DOM node → browser paints pixels, not nodes
│         ✅ devicePixelRatio scaling required (or retina blur)
│         ✅ 60fps feasible up to ~50k points on mid-range device
│         ❌ No native a11y — must add data table fallback
│         ❌ Hit-testing (hover) requires manual math (quadtree/R-tree)
│         └── Pick: Chart.js | ECharts large-mode | Canvas + D3-math hybrid
│
└─── > 100,000 points, real-time streaming, or heatmaps?
     │
     └── WebGL (regl, PixiJS, deck.gl, uPlot)
          ✅ GPU-accelerated pixel operations
          ✅ 1M+ points rendered in <16ms on modern GPU
          ✅ Heatmaps, geospatial overlays, particle effects
          ❌ Most complex: GLSL shaders or library abstraction needed
          ❌ Zero native a11y — full fallback strategy required
          ❌ Bundle cost significant (PixiJS ~1MB raw)
          └── Pick: deck.gl (geospatial) | uPlot (time-series) | regl (raw WebGL)

SECONDARY AXES:
─────────────────────────────────────────────────────────────────
A11y required?          → SVG preferred; Canvas/WebGL need hidden data table
Server-side rendering?  → SVG (Satori/Resvg); Canvas headless (Playwright/Puppeteer)
Email / PDF output?     → Resvg (SVG→PNG) | Satori (React→SVG) | headless Chrome
React ecosystem?        → Recharts (easy) | visx (composable) | D3 (escape hatch)
Bundle size critical?   → d3-scale + d3-shape only (~15KB) vs full D3 (~70KB)
Design system token?    → visx (unstyled) > Recharts (styled defaults) > Chart.js
```

---

## Library Comparison Matrix / Bảng So Sánh Thư Viện

| Library                 | Bundle (gzip)               | Declarative?  | Render Target           | Max Points (60fps)    | A11y Built-in | License                          | Learning Curve |
| ----------------------- | --------------------------- | ------------- | ----------------------- | --------------------- | ------------- | -------------------------------- | -------------- |
| **D3.js**               | ~70KB (full)                | ❌ Imperative | SVG / Canvas (manual)   | ~5k SVG / ~50k Canvas | ❌ Manual     | ISC                              | 🔴 High        |
| **d3-scale + d3-shape** | ~15KB                       | ❌ Math only  | N/A (primitives)        | ∞ (render yourself)   | ❌ Manual     | ISC                              | 🟡 Medium      |
| **Recharts**            | ~100KB                      | ✅ Yes        | SVG                     | ~2k–5k                | 🟡 Partial    | MIT                              | 🟢 Low         |
| **visx**                | ~25KB (à la carte)          | 🟡 Composable | SVG                     | ~5k                   | ❌ Manual     | MIT                              | 🟡 Medium      |
| **Chart.js**            | ~60KB                       | 🟡 Config     | Canvas 2D               | ~50k                  | 🟡 Partial    | MIT                              | 🟢 Low         |
| **ECharts**             | ~900KB full / ~300KB subset | 🟡 Config     | Canvas 2D / SVG / WebGL | ~100k+ (large mode)   | 🟡 Partial    | Apache 2.0                       | 🟡 Medium      |
| **Highcharts**          | ~130KB                      | 🟡 Config     | SVG / Canvas            | ~50k                  | ✅ Good       | Commercial (free non-commercial) | 🟢 Low         |
| **uPlot**               | ~15KB                       | ❌ Config     | Canvas 2D               | ~1M (time-series)     | ❌ Minimal    | MIT                              | 🔴 High        |
| **deck.gl**             | ~500KB+                     | 🟡 Layers     | WebGL                   | ~10M                  | ❌ None       | MIT                              | 🔴 High        |
| **PixiJS**              | ~600KB                      | ❌ Imperative | WebGL                   | ~5M                   | ❌ None       | MIT                              | 🔴 High        |

> **🇻🇳 Ghi chú cho interviews VN**: Grab, Tiki, Zalo thường dùng **ECharts** vì hỗ trợ tiếng Trung + tài liệu đầy đủ, large dataset handling tốt, và Apache license. Employment Hero (Úc-based) hay hỏi **Recharts/visx** vì React-native. Microsoft/Google hỏi perf tradeoffs (Canvas vs WebGL) và a11y.

---

## Part 1: Render Targets Deep Dive / Đi Sâu Vào Render Targets

### SVG — Scalable Vector Graphics

SVG là **DOM-based** — mỗi data point là một DOM element (circle, rect, path). Browser layout engine xử lý positioning, stacking, hit-testing.

```typescript
// SVG bar chart — each bar is a DOM element
// D3 + SVG pattern (AVOID in React — see Q2)
const svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height);

// Each rect is a DOM node — interactive by default
svg
  .selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d) => xScale(d.category))
  .attr("y", (d) => yScale(d.value))
  .attr("width", xScale.bandwidth())
  .attr("height", (d) => height - yScale(d.value))
  .attr("aria-label", (d) => `${d.category}: ${d.value}`) // a11y built-in
  .on("click", (event, d) => console.log(d)); // click = native DOM event
```

**SVG strengths:**

- ✅ Native a11y: ARIA attributes, screen reader traversal
- ✅ CSS animations, transitions work natively
- ✅ Resolution-independent (no retina blurring)
- ✅ `<title>` và `<desc>` cho từng element
- ✅ Dễ debug (inspect in DevTools)

**SVG limits:**

- ❌ > 5,000 nodes → browser layout thrashing, CPU paint spikes
- ❌ Hover/tooltip on 1,000 elements = 1,000 mousemove listeners
- ❌ Không phù hợp cho real-time updates > 30fps với large datasets

---

### Canvas 2D

Canvas là **pixel buffer** — browser không có DOM nodes cho từng data point. Bạn vẽ pixels, browser không biết gì về "bars" hay "lines".

```typescript
// Canvas bar chart — correct devicePixelRatio scaling
function drawChart(canvas: HTMLCanvasElement, data: DataPoint[]) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  // CRITICAL: Scale for retina/HiDPI displays
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr); // Scale drawing context

  const xScale = /* d3-scale */ createXScale(data, rect.width);
  const yScale = /* d3-scale */ createYScale(data, rect.height);

  // Draw all bars in one pass — no DOM nodes created
  data.forEach((d) => {
    ctx.fillStyle = d.color;
    ctx.fillRect(
      xScale(d.category),
      yScale(d.value),
      xScale.bandwidth(),
      rect.height - yScale(d.value),
    );
  });
}
```

**Canvas strengths:**

- ✅ Single DOM node → O(1) paint cost for browser layout
- ✅ 60fps feasible with 50k–100k points on modern hardware
- ✅ Pixel manipulation (filters, blending)

**Canvas limits:**

- ❌ No native hit-testing — must implement quadtree or pixel-color lookup
- ❌ No native a11y — **must** provide `<table>` fallback or `aria-label` on canvas
- ❌ Blurry on retina without `devicePixelRatio` scaling (very common anti-pattern)
- ❌ No CSS hover — manual cursor tracking needed

---

### WebGL

WebGL chạy GLSL shaders trực tiếp trên GPU. Không phải CPU render.

```typescript
// regl — WebGL wrapper for data visualization
import createREGL from "regl";

const regl = createREGL(canvas);

// Draw 1M points as WebGL geometry
const drawPoints = regl({
  vert: `
    precision mediump float;
    attribute vec2 position;
    attribute vec3 color;
    uniform vec2 resolution;
    varying vec3 vColor;
    void main() {
      vec2 clipSpace = (position / resolution) * 2.0 - 1.0;
      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      gl_PointSize = 2.0;
      vColor = color;
    }
  `,
  frag: `
    precision mediump float;
    varying vec3 vColor;
    void main() {
      gl_FragColor = vec4(vColor, 1.0);
    }
  `,
  attributes: {
    position: points.map((p) => [p.x, p.y]),
    color: points.map((p) => p.color),
  },
  count: points.length,
  primitive: "points",
});

// Render 1M points in <16ms
regl.frame(() => {
  regl.clear({ color: [0, 0, 0, 1], depth: 1 });
  drawPoints({ resolution: [canvas.width, canvas.height] });
});
```

**WebGL strengths:**

- ✅ 1M+ points at 60fps
- ✅ Parallel pixel computation trên GPU cores
- ✅ Complex shaders: heatmaps, blur, color mapping

**WebGL limits:**

- ❌ GLSL requires specialized knowledge
- ❌ Zero native a11y — complete fallback strategy required
- ❌ Bundle cost significant
- ❌ Context limit (~16 WebGL contexts per page in Chrome)

---

## Part 2: Library Deep Dives / Đi Sâu Vào Từng Library

### D3.js — The Math Engine

D3 (Data-Driven Documents) KHÔNG phải charting library theo nghĩa đúng — nó là **math + DOM manipulation toolkit**. Đây là sự khác biệt quan trọng nhất cần hiểu.

```typescript
// D3 CORRECT usage in React: USE D3 FOR MATH ONLY
// Let React handle DOM — see Q2 for why
import { scaleLinear, scaleTime, line, extent } from "d3";
import type { ScaleLinear, ScaleTime } from "d3";

interface ChartData {
  date: Date;
  value: number;
}

function useChartScales(
  data: ChartData[],
  width: number,
  height: number
) {
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // D3 scales — pure math, no DOM
  const xScale: ScaleTime<number, number> = scaleTime()
    .domain(extent(data, (d) => d.date) as [Date, Date])
    .range([0, innerWidth]);

  const yScale: ScaleLinear<number, number> = scaleLinear()
    .domain([0, Math.max(...data.map((d) => d.value))])
    .range([innerHeight, 0]); // Inverted: SVG y=0 is top

  const linePath = line<ChartData>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value));

  return { xScale, yScale, linePath, padding, innerWidth, innerHeight };
}

// React component renders the DOM — D3 only provides math
function LineChart({ data }: { data: ChartData[] }) {
  const { width, height, ref } = useResizeObserver<SVGSVGElement>();
  const { xScale, yScale, linePath, padding, innerWidth, innerHeight } =
    useChartScales(data, width ?? 600, height ?? 400);

  return (
    <svg ref={ref} width="100%" height="100%" aria-label="Line chart">
      <title>Revenue over time</title>
      <g transform={`translate(${padding.left}, ${padding.top})`}>
        {/* React renders SVG path — D3 only calculated the 'd' attribute */}
        <path
          d={linePath(data) ?? ""}
          fill="none"
          stroke="#2563eb"
          strokeWidth={2}
        />
        {/* React renders axes — D3 computed tick positions */}
        {xScale.ticks(5).map((tick) => (
          <g key={tick.toISOString()} transform={`translate(${xScale(tick)}, ${innerHeight})`}>
            <line y2={6} stroke="#94a3b8" />
            <text y={20} textAnchor="middle" fontSize={12}>
              {tick.toLocaleDateString("vi-VN")}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
```

**D3 scales — must-know cho interviews:**

```typescript
import {
  scaleLinear, // 0 → 100 → pixel range (linear mapping)
  scaleLog, // Logarithmic — for data spanning orders of magnitude (server latency: 1ms–10s)
  scaleTime, // Date objects → pixel positions (time-series)
  scaleBand, // Ordinal + equal-width bands (bar charts: ["Mon","Tue","Wed"])
  scaleOrdinal, // Category → color mapping (series colors)
  scaleSqrt, // Square root — for area-encoded bubbles (population maps)
} from "d3-scale"; // Import only d3-scale (~15KB vs full d3 ~70KB)
```

---

### Recharts — React-First, Declarative

Recharts là React component library — charts được khai báo như JSX, không cần imperative API.

```typescript
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface MetricPoint {
  timestamp: string;
  p50: number;
  p95: number;
  p99: number;
}

function LatencyChart({ data }: { data: MetricPoint[] }) {
  return (
    // ResponsiveContainer = ResizeObserver wrapper — handles width/height
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis
          tickFormatter={(v: number) => `${v}ms`}
          label={{ value: "Latency", angle: -90, position: "insideLeft" }}
        />
        <Tooltip
          formatter={(value: number, name: string) => [`${value}ms`, name]}
        />
        <Legend />
        <Line type="monotone" dataKey="p50" stroke="#2563eb" name="p50 (median)" dot={false} />
        <Line type="monotone" dataKey="p95" stroke="#f59e0b" name="p95" dot={false} />
        <Line type="monotone" dataKey="p99" stroke="#ef4444" name="p99" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

**Recharts strengths:** Declarative, React-native, good defaults, ~2 hours to first chart.
**Recharts limits:** SVG only → performance cap at ~5k points. Customization beyond defaults requires deep source diving. Bundle ~100KB gzip.

---

### visx — Composable Primitives (Airbnb)

visx KHÔNG phải charting library — nó là **primitive SVG + math components** để build charts. Airbnb dùng visx để build design-system-integrated charts với pixel-perfect control.

```typescript
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Tooltip, withTooltip } from "@visx/tooltip";
import type { WithTooltipProvidedProps } from "@visx/tooltip";

interface BarData {
  label: string;
  value: number;
}

type Props = {
  data: BarData[];
  width: number;
  height: number;
} & WithTooltipProvidedProps<BarData>;

// visx: YOU compose the chart from primitives
// No pre-built <BarChart> — you build it from <Bar>, <Group>, <Axis>
const BarChartInner = withTooltip<{ data: BarData[]; width: number; height: number }, BarData>(
  ({ data, width, height, tooltipData, tooltipLeft, tooltipTop,
     showTooltip, hideTooltip }: Props) => {
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = scaleBand({
      domain: data.map((d) => d.label),
      range: [0, innerWidth],
      padding: 0.2,
    });

    const yScale = scaleLinear({
      domain: [0, Math.max(...data.map((d) => d.value))],
      range: [innerHeight, 0],
    });

    return (
      <svg width={width} height={height} role="img" aria-label="Bar chart">
        <title>Monthly Revenue</title>
        <Group top={margin.top} left={margin.left}>
          {data.map((d) => (
            <Bar
              key={d.label}
              x={xScale(d.label)}
              y={yScale(d.value)}
              width={xScale.bandwidth()}
              height={innerHeight - yScale(d.value)}
              fill="var(--color-primary)" // Design system token
              onMouseEnter={() =>
                showTooltip({
                  tooltipData: d,
                  tooltipLeft: (xScale(d.label) ?? 0) + xScale.bandwidth() / 2,
                  tooltipTop: yScale(d.value),
                })
              }
              onMouseLeave={hideTooltip}
            />
          ))}
          <AxisBottom top={innerHeight} scale={xScale} />
          <AxisLeft scale={yScale} tickFormat={(v) => `$${v}`} />
        </Group>
        {tooltipData && (
          <Tooltip top={tooltipTop} left={tooltipLeft}>
            <strong>{tooltipData.label}</strong>: ${tooltipData.value}
          </Tooltip>
        )}
      </svg>
    );
  }
);
```

**visx vs Recharts decision:**

- Need pixel-perfect design system integration → **visx** (unstyled, you control everything)
- Need quick charts with sensible defaults → **Recharts**
- Need to compose unusual chart types (violin plot, chord, sankey) → **visx**

---

### ECharts — Large Dataset + Canvas

ECharts (Apache, originally Baidu) là choice phổ biến ở Đông Nam Á vì large dataset support với `large: true` mode và progressive rendering.

```typescript
import ReactECharts from "echarts-for-react";

function GrabTripVolumeChart({ data }: { data: TripData[] }) {
  const option = {
    tooltip: { trigger: "axis" },
    dataZoom: [{ type: "slider" }, { type: "inside" }], // Zoom/pan built-in
    series: [
      {
        type: "line",
        data: data.map((d) => [d.timestamp, d.trips]),
        large: true,         // Canvas mode for large datasets
        largeThreshold: 2000, // Switch to canvas at 2000 points
        symbol: "none",      // Don't render individual point markers
        sampling: "lttb",    // Largest-Triangle-Three-Buckets downsampling built-in!
      },
    ],
    xAxis: { type: "time" },
    yAxis: { type: "value", name: "Trips" },
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
}
```

**ECharts killer feature cho interviews**: Built-in `sampling: 'lttb'` — LTTB (Largest-Triangle-Three-Buckets) là thuật toán downsampling giữ hình dạng visual của time-series trong khi giảm số điểm. Recharts không có tính năng này natively.

---

## Part 3: Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟢 Q1: SVG vs Canvas vs WebGL — when to pick each?

**A:**

The rule of thumb that interviewers expect you to know instantly:

| Threshold             | Technology | Reason                                               |
| --------------------- | ---------- | ---------------------------------------------------- |
| **< ~1,000 points**   | SVG        | DOM-based → native a11y, CSS, hover, keyboard nav    |
| **~1k – 100k points** | Canvas 2D  | Single DOM node → GPU-composited pixels, fast paint  |
| **> 100k points**     | WebGL      | GPU shader computation → parallel pixel ops at 60fps |

**Real-world mapping:**

- Vercel Analytics (~200 data points/chart) → SVG ✅
- Grafana time-series (1M+ points) → WebGL (uPlot) ✅
- Grab partner dashboard (10k trips/day breakdown) → Canvas (ECharts large mode) ✅

**Critical nuance**: The thresholds depend on update frequency. At 60fps real-time updates, halve the limits — Canvas at real-time becomes < 50k, SVG becomes < 500.

**The a11y counter-argument**: If dataset is SVG-sized, prefer SVG. If you must use Canvas or WebGL for perf, provide a `<table>` or `aria-describedby` fallback — WCAG 1.3.1 (Non-text Content) requires it.

🇻🇳 **Tóm tắt**: Rule of thumb: ~1k → SVG, ~10k → Canvas, 100k+ → WebGL. Threshold giảm đi khi có real-time updates. A11y là tiebreaker: SVG preferred nếu data size cho phép; Canvas/WebGL **bắt buộc** có data table fallback.

**💡 Interview Signal:**

- ✅ Strong: Cites the thresholds, adjusts for update frequency, mentions a11y implication for non-SVG choices, gives real product examples
- ❌ Weak: "Canvas is faster than SVG" — true but without thresholds or a11y awareness, this is a junior answer

---

### 🟢 Q2: Why is D3 alone in a React app fragile? / Tại sao D3 + React dễ vỡ?

**A:**

D3 và React đều muốn **own the DOM** — đây là conflict kiến trúc cốt lõi.

**D3's model**: D3 mutations DOM directly via selections: `d3.select(".chart").append("rect").attr("x", 10)`. D3 stores state IN the DOM.

**React's model**: React maintains a virtual DOM tree. It diffs and patches the real DOM on every render. React assumes IT owns every DOM node in the component tree.

**The conflict**:

```typescript
// ❌ FRAGILE: D3 mutates DOM that React also manages
function BrokenChart({ data }: { data: number[] }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // D3 appends children to the SVG element
    const svg = d3.select(ref.current);
    svg.selectAll("rect").data(data).enter().append("rect"); // D3 owns these nodes

    return () => {
      svg.selectAll("*").remove(); // Cleanup — but React may have already removed them
    };
  }, [data]);
  // PROBLEM: On data change, React re-renders → may unmount/remount SVG
  // D3 re-runs and double-appends, or tries to select removed nodes

  return <svg ref={ref} />;
}
```

**Why this breaks:**

1. `useEffect` dependency array mistakes → D3 appends duplicate elements
2. React StrictMode (dev) runs effects twice → D3 double-appends
3. Concurrent Mode: React can interrupt, abort, replay renders → D3 effects fire out of order
4. Hard to debug: state split between React and DOM

**✅ Correct pattern: D3 for math, React for DOM**

```typescript
// ✅ CORRECT: D3 provides scales/paths; React renders JSX
function LineChart({ data }: { data: DataPoint[] }) {
  // D3 computes geometry — pure functions, no DOM touching
  const xScale = scaleTime().domain(extent(data, d => d.date) as [Date, Date]).range([0, width]);
  const yScale = scaleLinear().domain([0, max(data, d => d.value)!]).range([height, 0]);
  const pathD = line<DataPoint>().x(d => xScale(d.date)).y(d => yScale(d.value))(data);

  // React renders — React owns the DOM
  return (
    <svg width={width} height={height}>
      <path d={pathD ?? ""} fill="none" stroke="steelblue" strokeWidth={2} />
    </svg>
  );
}
```

**Exception**: When you need D3's animation (`d3-transition`) or complex brush/zoom interactions, a carefully isolated `useEffect` + stable ref IS acceptable — but scope D3 to a sub-element React doesn't re-render.

🇻🇳 **Tóm tắt**: D3 và React đều muốn own DOM → conflict. D3 mutations DOM trực tiếp; React assumes nó là owner duy nhất của DOM trong component tree. Giải pháp: **D3 chỉ làm math** (scales, paths, ticks) — React render kết quả. Ngoại lệ: animations/zoom có thể dùng `useEffect` với isolated sub-element.

**💡 Interview Signal:**

- ✅ Strong: Explains virtual DOM vs D3 imperative mutation conflict, mentions React StrictMode double-effect issue, gives the correct pattern
- ❌ Weak: "Just put D3 in useEffect" — works sometimes but misses the root architectural conflict

---

### 🟡 Q3: Recharts vs visx — when to choose which?

**A:**

The key question: **Do you need a charting library or a charting toolkit?**

**Recharts = Charting library**: Pre-built chart types with props-based configuration.

```typescript
// Recharts: 5 lines of code for a complete line chart
<LineChart data={data} width={600} height={300}>
  <Line dataKey="value" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
</LineChart>
```

**visx = Charting toolkit**: Low-level SVG primitives + math hooks. No pre-built chart types — you compose them.

```typescript
// visx: You build the bar yourself from primitives
<Group>
  <Bar x={xScale(d.label)} y={yScale(d.value)}
       width={xScale.bandwidth()} height={innerH - yScale(d.value)}
       fill={colorScale(d.category)} /> {/* Design system color token */}
</Group>
```

**Decision matrix:**

| Scenario                                                     | Choose                                         |
| ------------------------------------------------------------ | ---------------------------------------------- |
| Prototype or product with standard chart types               | **Recharts**                                   |
| Design system integration (custom tokens, exact Figma match) | **visx**                                       |
| Non-standard chart type (violin, sunburst, force-directed)   | **visx**                                       |
| Team with D3 knowledge wanting React-friendly API            | **visx**                                       |
| Team wanting zero charting overhead to learn                 | **Recharts**                                   |
| A/B test: chart bundle size matters                          | **visx** (à la carte ~25KB vs Recharts ~100KB) |

**The Airbnb reason visx exists**: Airbnb's design system required pixel-perfect chart customization that Recharts couldn't provide without fighting defaults. visx lets you use design tokens directly as SVG props.

🇻🇳 **Tóm tắt**: Recharts = library với chart types sẵn có (5 dòng code → chart hoàn chỉnh). visx = toolkit với SVG primitives, bạn tự compose (30+ dòng code → chart hoàn chỉnh, nhưng pixel-perfect). Chọn Recharts cho speed; visx cho design system integration và non-standard charts.

**💡 Interview Signal:**

- ✅ Strong: Frames as library vs toolkit distinction, mentions design system integration as visx's killer use case, knows bundle size difference (~25KB vs ~100KB)
- ❌ Weak: "visx is better than Recharts" — neither is universally better; context determines choice

---

### 🟡 Q4: D3 scales — what are they and why must you know them?

**A:**

D3 scales là **pure functions** that map an input domain to an output range. Đây là building block của mọi chart — without scales, you're manually computing pixel positions.

```typescript
import { scaleLinear, scaleLog, scaleTime, scaleBand, scaleOrdinal } from "d3-scale";

// 1. scaleLinear — most common, linear mapping
const yScale = scaleLinear()
  .domain([0, 10_000]) // input: 0 to 10,000 (data values)
  .range([400, 0]) // output: 400px to 0px (SVG pixels, inverted)
  .nice(); // .nice() rounds domain to clean numbers (0 → 10,000 not 0 → 9,847)

yScale(5000); // → 200 (midpoint)
yScale(0); // → 400 (bottom of chart)

// 2. scaleLog — for data spanning orders of magnitude
// Example: server response times 1ms → 10,000ms
const latencyScale = scaleLog().domain([1, 10_000]).range([0, 500]).base(10);

latencyScale(1); // → 0px
latencyScale(100); // → 250px (visual midpoint, not data midpoint)
latencyScale(10_000); // → 500px
// Without log: p99=10s dominates, p50=20ms invisible on linear scale

// 3. scaleTime — maps Date objects to pixels
const xScale = scaleTime()
  .domain([new Date("2026-01-01"), new Date("2026-12-31")])
  .range([0, 800]);

xScale(new Date("2026-07-01")); // → ~400 (mid-year ≈ mid-chart)
xScale.ticks(12); // → 12 Date objects for axis labels (smart: months)
xScale.ticks(52); // → 52 Date objects (weeks)

// 4. scaleBand — equal-width bands for categorical data (bar charts)
const barScale = scaleBand()
  .domain(["Mon", "Tue", "Wed", "Thu", "Fri"])
  .range([0, 500])
  .padding(0.2); // 20% gap between bars

barScale("Mon"); // → 0 (start of first band)
barScale.bandwidth(); // → 80px (width of each bar at 20% padding)

// 5. scaleOrdinal — category → discrete values (colors)
const colorScale = scaleOrdinal<string>()
  .domain(["series-a", "series-b", "series-c"])
  .range(["#2563eb", "#f59e0b", "#10b981"]); // Brand colors

colorScale("series-a"); // → "#2563eb"
colorScale("series-b"); // → "#f59e0b"
```

**Why interviewers care about scales**: Scales are the most common D3 API used even in React/Canvas setups. Most production chart code uses `d3-scale` + `d3-shape` without the rest of D3. Knowing which scale to use (especially `scaleLog` for latency, `scaleTime` for time-series) signals chart engineering depth.

🇻🇳 **Tóm tắt**: D3 scales là pure functions map domain → range (data values → pixel positions). 5 loại cần biết: `scaleLinear` (linear data), `scaleLog` (latency, spans orders of magnitude), `scaleTime` (Date → pixels), `scaleBand` (bar charts với categorical axis), `scaleOrdinal` (categories → colors). Dùng `d3-scale` alone (~15KB) thay vì toàn bộ D3 (~70KB).

**💡 Interview Signal:**

- ✅ Strong: Explains WHY scaleLog for latency (p99 dominates linear scale), knows `.nice()`, knows `.ticks()`, mentions importing only `d3-scale` not full D3
- ❌ Weak: "D3 scale maps data to pixels" — technically correct but too vague; no specifics on which scale type for which scenario

---

### 🟡 Q5: Responsive charts — how do you handle resize? / Charts responsive thế nào?

**A:**

The correct pattern is **ResizeObserver** — not `window.resize`, not percentage CSS widths alone.

**Why not `window.resize`?** It fires for every window dimension change, not when the chart container changes (a sidebar collapse changes chart width without changing window width).

```typescript
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash-es"; // or implement manually

interface Dimensions {
  width: number;
  height: number;
}

// Custom hook: observe a container element's dimensions
function useResizeObserver<T extends Element>() {
  const ref = useRef<T>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  // Debounce prevents excessive re-renders during drag resize
  const handleResize = useCallback(
    debounce((entries: ResizeObserverEntry[]) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    }, 100), // 100ms debounce — fast enough for UX, prevents thrashing
    []
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(handleResize);
    observer.observe(element);

    return () => {
      observer.disconnect();
      handleResize.cancel(); // Cancel pending debounced call on unmount
    };
  }, [handleResize]);

  return { ref, ...dimensions };
}

// Usage: chart adapts to container width automatically
function ResponsiveChart({ data }: { data: DataPoint[] }) {
  const { ref, width, height } = useResizeObserver<SVGSVGElement>();

  // Responsive breakpoints for chart elements
  const showLegend = width > 480;    // Hide legend on mobile
  const tickCount = width > 768 ? 10 : 5; // Fewer x-axis ticks on mobile

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <svg ref={ref} width="100%" height="100%">
        {width > 0 && (
          <ChartInner data={data} width={width} height={height}
                      showLegend={showLegend} tickCount={tickCount} />
        )}
      </svg>
    </div>
  );
}
```

**Canvas charts + ResizeObserver**: Canvas requires explicit `canvas.width` / `canvas.height` re-assignment (CSS width alone stretches pixels).

```typescript
useEffect(() => {
  if (!canvasRef.current || width === 0) return;
  const canvas = canvasRef.current;
  const dpr = window.devicePixelRatio || 1;

  // Must reset canvas dimensions — NOT just CSS
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr); // Reset transform after dimension change
  drawChart(ctx, data, width, height); // Redraw
}, [width, height, data]);
```

**Mobile breakpoint strategies:**

- < 480px: Single series only, remove legend, enlarge touch targets for tooltips
- 480–768px: Reduce tick labels, show abbreviations (Jan vs January)
- > 768px: Full chart with all features

🇻🇳 **Tóm tắt**: Dùng `ResizeObserver` không phải `window.resize`. Debounce callback 100ms để tránh thrashing. Canvas cần reset `canvas.width/height` khi resize (không chỉ CSS). Responsive breakpoints: ẩn legend < 480px, giảm ticks trên mobile.

**💡 Interview Signal:**

- ✅ Strong: Knows ResizeObserver vs window.resize distinction, mentions debouncing, knows Canvas requires explicit dimension reset + DPR rescaling
- ❌ Weak: "Use ResponsiveContainer from Recharts" — correct for Recharts but misses the underlying mechanism and doesn't help with Canvas charts

---

### 🟡 Q6: Accessibility for charts / Accessibility cho charts?

**A:**

Charts are one of the most commonly inaccessible UI elements. WCAG 1.1.1 (Non-text Content) requires alternatives.

**The 4-layer accessibility strategy:**

**Layer 1: Structural role + label**

```tsx
// SVG chart: native role
<svg role="img" aria-labelledby="chart-title chart-desc">
  <title id="chart-title">Monthly Revenue Q1 2026</title>
  <desc id="chart-desc">
    Bar chart showing revenue: January $120k, February $145k, March $98k.
    March shows a 32% decline due to Tết holiday.
  </desc>
</svg>

// Canvas chart: must use aria-label since canvas is opaque
<canvas
  aria-label="Line chart: website traffic over the past 30 days, peaking at 50,000 visitors on March 15"
  role="img"
/>
```

**Layer 2: Hidden data table fallback** (WCAG 1.3.1)

```tsx
function AccessibleBarChart({ data }: { data: RevenueData[] }) {
  return (
    <figure>
      <figcaption>Monthly Revenue Q1 2026</figcaption>
      {/* Visual chart */}
      <svg aria-hidden="true" focusable="false">
        {" "}
        {/* aria-hidden: table is the a11y artifact */}
        {/* bars... */}
      </svg>
      {/* Data table: visually hidden but screen-reader accessible */}
      <table className="sr-only">
        {" "}
        {/* CSS: position:absolute; width:1px; height:1px; overflow:hidden */}
        <caption>Monthly Revenue Data</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Revenue (VND)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.month}>
              <th scope="row">{d.month}</th>
              <td>{d.revenue.toLocaleString("vi-VN")} VND</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
```

**Layer 3: Color-blind safe palettes**

```typescript
// ❌ Red vs green — invisible to ~8% male users (deuteranopia)
const badColors = ["#ef4444", "#22c55e"];

// ✅ Color-blind safe palette (IBM Carbon accessible palette)
const a11yColors = [
  "#0062FF", // Blue — universally distinguishable
  "#FF6B6B", // Coral
  "#00C3FF", // Cyan
  "#FF8C00", // Orange
  "#6929C4", // Purple
];

// Also add: different line patterns (dashed vs solid) + different markers
// Do NOT rely solely on color to encode meaning
```

**Layer 4: Keyboard navigation for interactive charts**

```tsx
function KeyboardAccessibleChart({ data }: { data: DataPoint[] }) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  return (
    <svg
      role="group"
      aria-label="Revenue chart — use arrow keys to navigate data points"
      tabIndex={0} // Make SVG focusable
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" && focusedIndex !== null)
          setFocusedIndex(Math.min(focusedIndex + 1, data.length - 1));
        if (e.key === "ArrowLeft" && focusedIndex !== null)
          setFocusedIndex(Math.max(focusedIndex - 1, 0));
        if (e.key === "Enter" || e.key === " ") setFocusedIndex(0); // Start navigating
      }}
    >
      {data.map((d, i) => (
        <rect
          key={d.label}
          tabIndex={focusedIndex === i ? 0 : -1}
          role="graphics-dataunit"
          aria-label={`${d.label}: ${d.value.toLocaleString()}`}
          aria-selected={focusedIndex === i}
          onFocus={() => setFocusedIndex(i)}
          fill={focusedIndex === i ? "var(--color-focus)" : "var(--color-primary)"}
          /* rect dimensions */
        />
      ))}
    </svg>
  );
}
```

🇻🇳 **Tóm tắt**: 4-layer a11y: (1) `role="img"` + `<title>` + `<desc>` cho SVG. (2) Hidden `<table>` fallback — mandatory cho Canvas/WebGL (WCAG 1.3.1). (3) Color-blind safe palette + đừng dùng chỉ màu để encode meaning. (4) Keyboard navigation với `tabIndex` và arrow keys. Canvas chart = thêm `aria-label` mô tả summary.

**💡 Interview Signal:**

- ✅ Strong: Knows the 4-layer strategy, mentions WCAG 1.1.1 and 1.3.1 specifically, knows `aria-hidden` should go on the SVG (not table), mentions color-blind % and pattern/marker as supplement
- ❌ Weak: "Add alt text to the chart" — SVGs don't have `alt` attributes; confuses `<img alt>` with SVG a11y model

---

### 🔴 Q7: Rendering 100k+ points — Canvas vs WebGL strategy?

**A:**

100k+ points at 60fps requires GPU-accelerated rendering. The decision tree:

**Option A: Canvas + LTTB downsampling** (100k–500k points)

```typescript
// LTTB: Largest-Triangle-Three-Buckets
// Reduces N points to targetCount while preserving visual shape
function lttbDownsample(data: [number, number][], targetCount: number): [number, number][] {
  if (data.length <= targetCount) return data;

  const result: [number, number][] = [data[0]]; // Always include first point
  const bucketSize = (data.length - 2) / (targetCount - 2);

  let a = 0; // Previous selected point index

  for (let i = 0; i < targetCount - 2; i++) {
    // Calculate bucket bounds
    const bucketStart = Math.floor((i + 1) * bucketSize) + 1;
    const bucketEnd = Math.min(Math.floor((i + 2) * bucketSize) + 1, data.length);

    // Find point in next bucket with largest triangle area
    const nextBucketStart = Math.floor((i + 2) * bucketSize) + 1;
    const nextBucketEnd = Math.min(Math.floor((i + 3) * bucketSize) + 1, data.length);
    const avgX =
      data.slice(nextBucketStart, nextBucketEnd).reduce((s, d) => s + d[0], 0) /
      (nextBucketEnd - nextBucketStart);
    const avgY =
      data.slice(nextBucketStart, nextBucketEnd).reduce((s, d) => s + d[1], 0) /
      (nextBucketEnd - nextBucketStart);

    let maxArea = -1;
    let maxIndex = bucketStart;

    for (let j = bucketStart; j < bucketEnd; j++) {
      const area =
        Math.abs(
          (data[a][0] - avgX) * (data[j][1] - data[a][1]) -
            (data[a][0] - data[j][0]) * (avgY - data[a][1]),
        ) * 0.5;

      if (area > maxArea) {
        maxArea = area;
        maxIndex = j;
      }
    }

    result.push(data[maxIndex]);
    a = maxIndex;
  }

  result.push(data[data.length - 1]); // Always include last point
  return result;
}

// Usage: downsample 500k points to 2000 before Canvas render
const pixelWidth = 1200; // Chart width in pixels
const visiblePoints = lttbDownsample(rawData, pixelWidth * 2); // 2 points per pixel max
```

**Option B: WebGL with regl or PixiJS** (500k–10M points)

```typescript
// PixiJS approach for 1M+ scatter plot points
import * as PIXI from "pixi.js";

class LargeScatterChart {
  private app: PIXI.Application;
  private container: PIXI.ParticleContainer; // GPU-batched rendering

  constructor(canvas: HTMLCanvasElement) {
    this.app = new PIXI.Application({
      view: canvas,
      antialias: false,
      resolution: window.devicePixelRatio,
    });
    // ParticleContainer = single draw call for all points (vs Container = N draw calls)
    this.container = new PIXI.ParticleContainer(1_000_000, {
      vertices: true,
      tint: true,
    });
    this.app.stage.addChild(this.container);
  }

  render(points: { x: number; y: number; color: number }[]) {
    this.container.removeChildren();
    const texture = PIXI.Texture.from("circle"); // Pre-loaded point texture

    // Batch-create sprites — PixiJS batches into single WebGL draw call
    for (const point of points) {
      const sprite = new PIXI.Sprite(texture);
      sprite.x = point.x;
      sprite.y = point.y;
      sprite.tint = point.color;
      sprite.width = sprite.height = 2; // 2px points
      this.container.addChild(sprite);
    }
  }
}
```

**Option C: WebWorker + OffscreenCanvas** (prevents main thread block)

```typescript
// Main thread: send data to worker
const worker = new Worker("/chart-worker.js");
const offscreen = canvas.transferControlToOffscreen();
worker.postMessage({ canvas: offscreen, data: rawData }, [offscreen]);

// chart-worker.js: runs on worker thread — no UI jank
self.onmessage = ({ data: { canvas, data } }) => {
  const ctx = canvas.getContext("2d");
  // Render 100k points without blocking main thread
  data.forEach(([x, y]: [number, number]) => {
    ctx.fillRect(x, y, 1, 1);
  });
};
```

**Decision summary:**

- 1k–10k: SVG (D3/Recharts)
- 10k–500k: Canvas + LTTB downsampling
- 500k–10M: WebGL (PixiJS ParticleContainer or regl)
- 10M+: Server-side tile rendering + client image overlay (like Grafana Mimir)

🇻🇳 **Tóm tắt**: 100k+ points cần GPU rendering. 3 options: (A) Canvas + LTTB downsampling — giảm 500k points xuống 2k điểm visual tương đương, render Canvas; (B) WebGL với PixiJS ParticleContainer — single draw call cho 1M points; (C) WebWorker + OffscreenCanvas — render không block main thread. Grafana Mimir dùng server-side tile rendering cho 1B+ points.

**💡 Interview Signal:**

- ✅ Strong: Knows LTTB algorithm by name, explains WHY it preserves visual shape (triangle area maximization), mentions WebWorker + OffscreenCanvas for non-blocking render, mentions server-side tile rendering at extreme scale
- ❌ Weak: "Use virtualization" — chart virtualization is for list items; data point rendering requires downsampling + render target change, not virtualization

---

### 🔴 Q8: Real-time streaming charts — buffer + RAF strategy?

**A:**

Real-time charts (metrics, trading, live dashboards) cần careful streaming strategy để avoid dropped frames.

**The naive approach (breaks at high frequency):**

```typescript
// ❌ WRONG: Update chart on every WebSocket message
socket.on("metric", (point: MetricPoint) => {
  setData((prev) => [...prev, point]); // setState per message
  // Problem: 1000 messages/second = 1000 setState = 1000 renders
  // React batches in concurrent mode, but still too many commits
});
```

**✅ Correct: Buffer + requestAnimationFrame**

```typescript
function useStreamingChart(socketUrl: string) {
  const [displayData, setDisplayData] = useState<MetricPoint[]>([]);
  const bufferRef = useRef<MetricPoint[]>([]); // Off-screen buffer (not React state)
  const rafRef = useRef<number>();
  const maxPoints = 1000; // Rolling window size

  useEffect(() => {
    const socket = new WebSocket(socketUrl);

    socket.onmessage = (event) => {
      const point: MetricPoint = JSON.parse(event.data);
      bufferRef.current.push(point); // Add to buffer — NO React re-render
    };

    // RAF loop: flush buffer at display frequency (max 60fps)
    function flushBuffer() {
      if (bufferRef.current.length > 0) {
        const newPoints = bufferRef.current.splice(0); // Drain buffer
        setDisplayData((prev) => {
          const combined = [...prev, ...newPoints];
          // Rolling window: keep only last N points
          return combined.length > maxPoints
            ? combined.slice(combined.length - maxPoints)
            : combined;
        });
      }
      rafRef.current = requestAnimationFrame(flushBuffer); // Schedule next frame
    }

    rafRef.current = requestAnimationFrame(flushBuffer);

    return () => {
      socket.close();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [socketUrl]);

  return displayData;
}
```

**Dropping frames gracefully (when GPU can't keep up):**

```typescript
function useAdaptiveChart() {
  const frameTimeRef = useRef<number[]>([]);
  const [renderFps, setRenderFps] = useState(60);

  function measureFrame(timestamp: number) {
    frameTimeRef.current.push(timestamp);
    if (frameTimeRef.current.length > 30) frameTimeRef.current.shift();

    if (frameTimeRef.current.length > 1) {
      const avgFrameTime =
        (frameTimeRef.current[frameTimeRef.current.length - 1] - frameTimeRef.current[0]) /
        (frameTimeRef.current.length - 1);
      setRenderFps(Math.round(1000 / avgFrameTime));
    }
  }

  // Degrade gracefully: if FPS drops below 30, increase downsampling ratio
  const downsampleRatio = renderFps < 30 ? 4 : renderFps < 45 ? 2 : 1;

  return { downsampleRatio, measureFrame };
}
```

**Real-time chart architecture at Datadog scale:**

1. WebSocket streams metric at ~1000 data points/second
2. Client buffers in `ArrayBuffer` (typed arrays, not JS objects — 10x less GC)
3. WebWorker computes LTTB downsampling on incoming stream
4. Main thread receives downsampled points (postMessage from worker)
5. RAF loop flushes to Canvas at 60fps

🇻🇳 **Tóm tắt**: Real-time streaming: (1) Buffer tất cả incoming data vào `useRef` — không setState mỗi message. (2) RAF loop flush buffer tối đa 60fps. (3) Rolling window để tránh memory leak (giữ N điểm cuối cùng). (4) Adaptive downsampling: nếu FPS drop < 30, tăng downsample ratio. (5) Dùng TypedArrays thay JS objects để giảm GC pressure.

**💡 Interview Signal:**

- ✅ Strong: Knows buffer + RAF pattern specifically, mentions TypedArrays for memory efficiency, mentions GC pressure as streaming concern, describes adaptive downsampling
- ❌ Weak: "Use throttle or debounce" — throttle/debounce are for user input; streaming data needs buffer + RAF flush, not throttle (throttle drops data, RAF flushes all buffered data in one frame)

---

### 🔴 Q9: Server-side chart rendering — for emails and PDFs?

**A:**

Emails và PDFs không có browser JavaScript. Charts phải được pre-rendered thành static images (PNG/SVG) trên server.

**Approach 1: Satori + Resvg** (fastest, serverless-compatible)

```typescript
// Satori: React → SVG (runs on Node.js/Edge without browser)
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "fs/promises";

async function renderChartToPNG(data: ChartData[]): Promise<Buffer> {
  // 1. Render React component to SVG string using Satori
  // NOTE: Satori is NOT full React — no hooks, no event handlers
  // It's a static JSX → SVG converter with Tailwind-like styling
  const svg = await satori(
    <div style={{ display: "flex", flexDirection: "column", width: 600, height: 400 }}>
      <h2 style={{ fontFamily: "Inter", fontSize: 18, color: "#1e293b" }}>
        Monthly Revenue
      </h2>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 300, padding: "0 20px" }}>
        {data.map((d) => (
          <div
            key={d.month}
            style={{
              flex: 1,
              height: `${(d.value / maxValue) * 100}%`,
              backgroundColor: "#2563eb",
              borderRadius: 4,
            }}
          />
        ))}
      </div>
    </div>,
    {
      width: 600,
      height: 400,
      fonts: [
        {
          name: "Inter",
          data: await readFile("./fonts/Inter-Regular.ttf"),
          weight: 400,
        },
      ],
    }
  );

  // 2. Convert SVG → PNG using Resvg (Rust-based, fast, correct rendering)
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 600 },
    dpi: 144, // 2x for retina email clients
  });

  return Buffer.from(resvg.render().asPng());
}

// Usage in API route (Next.js)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "30d";
  const data = await fetchRevenueData(period);
  const png = await renderChartToPNG(data);

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600", // Cache chart image
    },
  });
}
```

**Approach 2: Headless Chromium / Playwright** (most accurate, slower)

```typescript
import { chromium } from "playwright";

async function renderChartWithPlaywright(chartUrl: string): Promise<Buffer> {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();

  // Navigate to chart page (could be internal Next.js route)
  await page.goto(chartUrl, { waitUntil: "networkidle" });

  // Wait for chart to finish rendering (Canvas or SVG)
  await page.waitForSelector("[data-testid='chart-ready']");

  const screenshot = await page.locator("#chart-container").screenshot({
    type: "png",
    omitBackground: false,
  });

  await browser.close();
  return screenshot;
}
```

**Tradeoffs:**

| Approach               | Speed  | Accuracy                            | Serverless?       | Cost   |
| ---------------------- | ------ | ----------------------------------- | ----------------- | ------ |
| Satori + Resvg         | ~50ms  | Limited (no Canvas, simple layouts) | ✅ Yes            | Low    |
| node-canvas (Cairo)    | ~100ms | High (Canvas 2D)                    | ❌ Native deps    | Medium |
| Headless Chrome        | ~1–3s  | Perfect (full browser)              | ❌ Heavy (~400MB) | High   |
| Vercel OG (@vercel/og) | ~30ms  | Limited (same as Satori)            | ✅ Edge           | Low    |

**When to use each:**

- Email thumbnails, OG images → Satori + Resvg (fast, serverless)
- PDF reports với complex charts → Headless Chromium (accurate)
- Vercel deployment, OG social cards → `@vercel/og` (Satori under the hood)

🇻🇳 **Tóm tắt**: Server-side chart: (1) Satori + Resvg: React JSX → SVG → PNG, 50ms, serverless-compatible. Giới hạn: không có Canvas API, layouts đơn giản. (2) Headless Chromium/Playwright: full browser rendering, 1–3s, nặng (~400MB). Dùng: email thumbnails → Satori; PDF reports phức tạp → Playwright. Cache kết quả vì render đắt.

**💡 Interview Signal:**

- ✅ Strong: Distinguishes Satori (JSX→SVG, no Canvas) vs Playwright (full browser), knows `@vercel/og` is Satori under the hood, mentions caching, knows DPI setting for retina emails
- ❌ Weak: "Render on server with ReactDOM.renderToString" — `renderToString` produces HTML, not SVG/PNG; doesn't work for email without further processing

---

### 🔴 Q10: Bundle cost — how to keep chart code lean?

**A:**

Chart libraries are some of the heaviest dependencies in frontend. Strategic imports prevent bundle bloat.

**The D3 problem:**

```typescript
// ❌ EXPENSIVE: Full D3 — ~70KB gzipped
import * as d3 from "d3";

// ✅ CHEAP: Import only what you need — ~15KB total for this use case
import { scaleLinear, scaleTime } from "d3-scale"; // ~8KB
import { line, area } from "d3-shape"; // ~5KB
import { extent, max } from "d3-array"; // ~2KB
// Total: ~15KB vs 70KB — 78% reduction
```

**ECharts tree-shaking:**

```typescript
// ❌ EXPENSIVE: Full ECharts — ~900KB gzipped
import * as echarts from "echarts";

// ✅ CHEAP: ECharts manual composition — ~300KB for line+bar
import * as echarts from "echarts/core";
import { LineChart, BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers"; // Canvas vs SVGRenderer

echarts.use([
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer,
]);
```

**Building a design-system chart kit on visx** (ultimate bundle control):

```typescript
// Your own <LineChart> built on visx primitives
// Only imports what's needed — no unused chart types
import { LinePath } from "@visx/shape"; // ~3KB
import { scaleLinear, scaleTime } from "@visx/scale"; // ~2KB
import { AxisBottom, AxisLeft } from "@visx/axis"; // ~4KB
import { Tooltip } from "@visx/tooltip"; // ~3KB
// Total: ~12KB for a complete line chart

// vs Recharts LineChart: ~100KB (includes ALL chart types even if unused)
// Why: Recharts bundles all components; visx you import individually
```

**Lazy loading charts** (Next.js):

```typescript
// charts only load when user navigates to analytics page
import dynamic from "next/dynamic";

const LazyChart = dynamic(
  () => import("./AnalyticsDashboard"), // 300KB chart bundle
  {
    loading: () => <ChartSkeleton />, // Skeleton while loading
    ssr: false, // Charts often use window API — skip SSR
  }
);
```

**Bundle audit:**

```bash
# Analyze what chart library contributes to bundle
npx next build && npx @next/bundle-analyzer
# Or: npx vite-bundle-visualizer

# Expected chart bundle sizes (gzip):
# recharts: ~100KB
# visx (full suite): ~80KB
# visx (line chart only): ~12KB
# echarts (full): ~900KB
# echarts (line only): ~300KB
# chart.js: ~60KB
# d3 (full): ~70KB
# d3 (scale + shape only): ~15KB
```

🇻🇳 **Tóm tắt**: Chart libraries là một trong những dependency nặng nhất. Chiến lược: (1) D3: chỉ import `d3-scale` + `d3-shape` (~15KB) thay vì full D3 (~70KB). (2) ECharts: dùng manual composition để tree-shake ~900KB xuống ~300KB. (3) visx: import từng primitive — line chart chỉ ~12KB vs Recharts ~100KB. (4) Lazy load toàn bộ chart bundle với Next.js dynamic import. (5) Bundle analyzer để đo actual impact.

**💡 Interview Signal:**

- ✅ Strong: Knows specific bundle sizes (~70KB full D3 vs ~15KB d3-scale+d3-shape), knows ECharts manual composition pattern, mentions lazy loading with `ssr: false`, runs bundle analysis
- ❌ Weak: "Use tree shaking" — true but too vague; interviewer expects specific numbers and specific techniques per library

---

## Part 4: Anti-Patterns / Các Anti-Pattern Cần Tránh

---

### ❌ Anti-Pattern 1: D3 managing DOM in React app

```typescript
// ❌ WRONG: D3 appends to SVG that React also manages
useEffect(() => {
  const svg = d3.select(svgRef.current);
  svg.selectAll("rect").data(data).enter().append("rect"); // D3 owns DOM
  // React will fight D3 for ownership → bugs, double renders
}, [data]);

// ✅ CORRECT: D3 = math only; React = DOM
const path = line<DataPoint>().x(d => xScale(d.x)).y(d => yScale(d.y))(data);
return <path d={path ?? ""} />; // React owns the path element
```

**Hậu quả**: Duplicate elements trong React StrictMode, memory leaks từ event listeners D3 gắn vào DOM nodes React đã unmount, không thể SSR.

---

### ❌ Anti-Pattern 2: SVG for > 5,000 elements

```typescript
// ❌ WRONG: Plotting 50k data points as SVG circles
{data.map((point) => (
  <circle key={point.id} cx={xScale(point.x)} cy={yScale(point.y)} r={2} />
))}
// → 50,000 DOM nodes → Chrome DevTools shows 500ms paint, browser scroll jank

// ✅ CORRECT: Canvas for large datasets
useEffect(() => {
  const ctx = canvas.getContext("2d")!;
  data.forEach(({ x, y }) => {
    ctx.fillRect(xScale(x), yScale(y), 2, 2); // pixels, not DOM nodes
  });
}, [data]);
```

**Hậu quả**: Layout thrashing, scroll jank, browser tab may crash trên mobile với ~10k+ SVG nodes.

---

### ❌ Anti-Pattern 3: Canvas without devicePixelRatio scaling

```typescript
// ❌ WRONG: Canvas appears blurry on retina (MacBook, iPhone)
canvas.width = 600;
canvas.height = 400;
// Browser stretches 600×400 physical pixels to 1200×800 logical pixels on 2x DPR display

// ✅ CORRECT: Always scale by devicePixelRatio
const dpr = window.devicePixelRatio || 1;
canvas.width = 600 * dpr; // Physical pixels
canvas.height = 400 * dpr;
canvas.style.width = "600px"; // CSS logical pixels
canvas.style.height = "400px";
const ctx = canvas.getContext("2d")!;
ctx.scale(dpr, dpr); // Scale coordinate system to match logical pixels
```

**Hậu quả**: Charts appear blurry on any HiDPI display (MacBook Pro, iPhone, any Android flagship). Users notice immediately. Classic junior mistake.

---

### ❌ Anti-Pattern 4: No data table fallback for Canvas/WebGL charts

```typescript
// ❌ WRONG: Canvas-only chart — invisible to screen readers
<canvas id="revenue-chart" width={600} height={400} />
// Screen reader: announces nothing meaningful

// ✅ CORRECT: Canvas + hidden data table
<figure>
  <canvas id="revenue-chart" aria-hidden="true" /> {/* Visual-only */}
  <table className="sr-only"> {/* Visually hidden, screen-reader accessible */}
    <caption>Revenue by month, Q1 2026</caption>
    <thead><tr><th>Month</th><th>Revenue</th></tr></thead>
    <tbody>
      {data.map(d => <tr key={d.month}><th>{d.month}</th><td>{d.value}</td></tr>)}
    </tbody>
  </table>
</figure>
```

**Hậu quả**: WCAG 1.1.1 violation — non-text content requires text alternative. Common finding in accessibility audits, especially at Employment Hero, Microsoft.

---

### ❌ Anti-Pattern 5: Global SVG `<defs>` ID collisions

```typescript
// ❌ WRONG: Multiple chart instances share same SVG defs IDs
function Chart() {
  return (
    <svg>
      <defs>
        <linearGradient id="gradient"> {/* id="gradient" — global SVG namespace! */}
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect fill="url(#gradient)" /> {/* References first #gradient found in document */}
    </svg>
  );
}
// If two <Chart> instances on same page → second chart uses first chart's gradient

// ✅ CORRECT: Unique IDs per chart instance (useId hook, React 18+)
import { useId } from "react";

function Chart() {
  const id = useId(); // Stable, unique per component instance
  const gradientId = `gradient-${id}`;

  return (
    <svg>
      <defs>
        <linearGradient id={gradientId}>
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect fill={`url(#${gradientId})`} />
    </svg>
  );
}
```

**Hậu quả**: Wrong gradient/clip/filter applied to wrong chart — visually broken, especially in dashboards with multiple chart instances. Hard to debug vì cross-element SVG reference.

---

## 🧠 Memory Hook

```
"SVG-Canvas-WebGL: 1K-10K-100K
 D3 = Math only in React (never touch DOM)
 LTTB = shape-preserving downsample for large data
 Canvas = always × devicePixelRatio or retina dies
 No data table = a11y WCAG fail
 Recharts = quick; visx = custom; ECharts = big data Asia"
```

**Expanded mnemonic: "S-C-W 1-10-100"**

- **S**VG for **1**k points → **C**anvas for **10**k → **W**ebGL for **100**k
- **D3** = **D**on't touch DOM in React, **D3** = **D**ata math only
- **L**TTB = **L**argest **T**riangle preserves shape during **T**hinning data for **B**ig datasets
- **A**11y: **A**lways add `<table>` fallback for Canvas charts

---

## Q&A Summary Table / Bảng Tổng Kết

| #   | Question               | Level | Core Answer                                                                         | Anti-pattern to mention                              |
| --- | ---------------------- | ----- | ----------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Q1  | SVG vs Canvas vs WebGL | 🟢    | 1k/10k/100k threshold; adjust for update frequency                                  | "Canvas is always faster" — ignores a11y cost        |
| Q2  | D3 fragile in React    | 🟢    | Both want DOM ownership; use D3 for math only                                       | `useEffect` + `d3.select(ref.current).append(...)`   |
| Q3  | Recharts vs visx       | 🟡    | Library (pre-built) vs toolkit (composable primitives)                              | "visx is better" — context-dependent                 |
| Q4  | D3 scales              | 🟡    | scaleLinear/Log/Time/Band/Ordinal; import d3-scale not full D3                      | `scaleLinear` for latency data (should be scaleLog)  |
| Q5  | Responsive charts      | 🟡    | ResizeObserver + debounce; Canvas needs explicit w/h reset                          | `window.resize` listener; CSS width alone for Canvas |
| Q6  | Chart accessibility    | 🟡    | 4-layer: role+title+desc, data table, color-blind palette, keyboard                 | `alt` attribute on SVG (doesn't exist)               |
| Q7  | 100k+ points           | 🔴    | LTTB downsample for Canvas; WebGL (PixiJS/regl) for 1M+; WebWorker for non-blocking | "Use virtualization" (wrong approach)                |
| Q8  | Real-time streaming    | 🔴    | Buffer in useRef, flush at RAF (60fps max), rolling window                          | setState per WebSocket message                       |
| Q9  | Server-side charts     | 🔴    | Satori+Resvg (fast/serverless) vs Playwright (accurate/heavy)                       | `renderToString` produces HTML not image             |
| Q10 | Bundle cost            | 🔴    | d3-scale+shape (~15KB) vs full d3 (~70KB); ECharts manual compose; lazy load        | Import `* from "echarts"` (~900KB)                   |

---

## Cold Call / Câu Hỏi Bất Ngờ

Interviewer hỏi (không báo trước): _"Our chart library renders 200k candles on a stock chart. User drags to zoom. It lags. Fix it."_

**Junior trap**: "Switch to a faster library."

**Senior answer (30 seconds):**

> "First: what's the render target now? If SVG, that's why — switch to Canvas immediately. If Canvas: verify devicePixelRatio scaling. Then: on zoom interaction, compute visible time range, LTTB-downsample to ~2 × pixel-width points, render only those. Debounce the zoom handler at 16ms (one frame). If still slow: offload render to WebWorker + OffscreenCanvas so main thread stays responsive. If we need sub-5ms even on budget devices: migrate to WebGL with uPlot or a regl shader."

🇻🇳: "Trước tiên kiểm tra render target. SVG với 200k nodes → chết. Chuyển Canvas ngay. Canvas: LTTB downsample theo zoom range, chỉ render điểm visible, debounce 16ms. Vẫn lag: WebWorker + OffscreenCanvas. Cần extreme perf: WebGL với uPlot."

---

## Self-Check / Tự Kiểm Tra

Trước khi đi phỏng vấn, hãy tự trả lời không nhìn notes:

- [ ] Tôi có thể giải thích SVG vs Canvas vs WebGL tradeoffs trong 60 giây không? (Q1)
- [ ] Tôi có thể giải thích tại sao D3 + React fragile và pattern đúng là gì không? (Q2)
- [ ] Tôi có thể phân biệt Recharts vs visx và biết khi nào chọn cái nào không? (Q3)
- [ ] Tôi có thể kể tên 5 loại D3 scale và use case của mỗi loại không? (Q4)
- [ ] Tôi biết ResizeObserver pattern và tại sao Canvas cần explicit dimension reset không? (Q5)
- [ ] Tôi có thể mô tả 4-layer a11y strategy cho charts không? (Q6)
- [ ] Tôi biết LTTB là gì và khi nào dùng vs WebGL không? (Q7)
- [ ] Tôi có thể mô tả buffer + RAF streaming pattern không? (Q8)
- [ ] Tôi biết Satori vs Playwright cho server-side charts và khi nào dùng không? (Q9)
- [ ] Tôi biết bundle size của D3, Recharts, visx, ECharts (gzip) không? (Q10)
- [ ] Tôi biết 5 anti-patterns và có thể giải thích hậu quả của từng cái không?

**Score interpretation:**

- 10–11 ✅: Senior-ready — có thể lead chart architecture discussion
- 7–9 ✅: Mid-level — tốt nhưng cần polish ở perf/streaming/a11y edge cases
- < 7 ✅: Junior — review Q7/Q8/Q9 (senior signal questions) kỹ hơn

---

> 💡 **Closing insight for interviews**: Chart engineering is where performance, accessibility, and design system integration collide simultaneously. The candidates who shine don't just know which library to pick — they explain WHY with specific numbers (bundle size, point thresholds, WCAG criteria) and acknowledge the tradeoffs. At Grab Vietnam, Datadog, and Microsoft, "we used Recharts" is a complete non-answer without the context of why that was the right call for that dataset size, interaction model, and a11y requirement.
>
> 🇻🇳 Charts là nơi performance, accessibility, và design system integration va chạm cùng lúc. Ứng viên tốt không chỉ biết chọn library — họ giải thích TẠI SAO với số cụ thể (bundle size, point thresholds, WCAG criteria) và thừa nhận tradeoffs. Tại Grab Vietnam, "dùng ECharts" là câu trả lời không đầy đủ nếu không giải thích tại sao ECharts phù hợp cho dataset size, interaction model, và a11y requirement của dashboard đó.
