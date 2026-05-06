# Web Typography and Font Loading / Typography Web và Tải Font

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [HTML & CSS Fundamentals](./00-html-semantics-and-accessibility.md), [Browser Performance](../06-browser-performance/), [Core Web Vitals](../06-browser-performance/01-core-web-vitals.md)
> **See also**: [CSS Layout & Rendering](./05-css-layout-rendering.md) | [Browser Performance](../06-browser-performance/) | [Next.js Architecture](../04-nextjs/03-nextjs-architecture.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Interviewer hỏi: _"Your Lighthouse audit shows a 3-second FOIT on mobile and a CLS of 0.28 from font swap — how do you fix both without breaking the design?"_

Hầu hết ứng viên sẽ trả lời ngay: _"Add `font-display: swap`"_ — và đây chính xác là câu trả lời **sai cho vấn đề này**. `font-display: swap` giải quyết FOIT bằng cách biến nó thành FOUT, nhưng **nó chính là nguyên nhân của CLS 0.28** khi fallback font có metrics khác với web font.

Một Senior Engineer sẽ phân tích: "FOIT và CLS không thể đồng thời fix bằng một property. Đây là tension cơ bản của font loading. Giải pháp đúng là `font-display: optional` cho LCP font kết hợp với `size-adjust` + `ascent-override` + `descent-override` để align fallback font metrics — hoặc dùng `next/font` tự động làm tất cả việc này."

Đây chính xác là lý do tại sao **web typography là senior signal**: không phải chỉ biết `@font-face` mà là hiểu toàn bộ lifecycle từ format → loading strategy → fallback metrics → render → CLS measurement.

Thực tế từ Google: **85% of top 10,000 websites** đang ship fonts không được tối ưu. Interviewers ở Grab, Axon, Employment Hero đặc biệt hỏi về font loading vì nó ảnh hưởng trực tiếp đến Core Web Vitals LCP và CLS — hai metric được Google dùng trong ranking algorithm.

---

## What & Why / Cái Gì & Tại Sao

**Web typography** là tập hợp quyết định kỹ thuật kiểm soát cách text được tải, render, và hiển thị trên browser — từ format file đến CSS descriptors đến loading API đến fallback strategy.

```
Tại sao nó quan trọng với engineers?
→ Font files thường là 50–300KB mỗi file — lớn hơn nhiều JS components
→ Font render blocking = user thấy màn hình trắng hoặc invisible text
→ Font swap = layout shift (CLS) khi fallback metric khác web font
→ Mỗi quyết định font loading ảnh hưởng trực tiếp đến LCP, CLS, FID
```

**Tại sao interviewer hỏi điều này:**

- Font performance là **proxy test** cho hiểu biết về browser rendering pipeline
- Nó giao thoa với Core Web Vitals, privacy (Google Fonts GDPR), Next.js tooling, và i18n
- Câu trả lời về `font-display` ngay lập tức lộ rõ level: Junior biết syntax, Senior biết tradeoffs

---

## Concept Map / Bản Đồ Khái Niệm

```
WEB TYPOGRAPHY & FONT LOADING LIFECYCLE
│
├── FONT FORMATS
│   ├── WOFF2 ← primary format (Brotli-compressed, universal support 2024+)
│   ├── WOFF  ← fallback for very old browsers (IE9+)
│   ├── TTF/OTF ← raw desktop formats, no compression, larger
│   ├── EOT ← Internet Explorer only, DEAD (do not use)
│   └── Variable Fonts ← single file, multiple axes (weight/width/optical-size)
│
├── @FONT-FACE DESCRIPTORS
│   ├── font-family        ← logical name used in CSS
│   ├── src                ← format() hint, local() fallback
│   ├── font-weight        ← range: 100 900 (variable) or single value
│   ├── font-style         ← normal | italic | oblique
│   ├── font-display       ← auto | block | swap | fallback | optional
│   ├── unicode-range      ← subset loading (U+0000-00FF for Latin)
│   └── CSS Fonts Level 4 metric overrides:
│       ├── size-adjust        ← scale glyph to match fallback
│       ├── ascent-override    ← top space above baseline
│       ├── descent-override   ← space below baseline
│       └── line-gap-override  ← inter-line spacing
│
├── FONT LOADING PIPELINE
│   │
│   ├── 1. PARSE CSS → find @font-face declarations
│   ├── 2. CHECK — is font used by visible text?
│   ├── 3. IF YES → initiate network request (or read cache)
│   ├── 4. WHILE LOADING → font-display determines behavior:
│   │       block    → invisible text (FOIT)
│   │       swap     → fallback text shown (FOUT) → CLS risk
│   │       fallback → 100ms block, 3s swap window, then lock
│   │       optional → 100ms block, browser decides (good for CLS)
│   ├── 5. FONT ARRIVES → swap in (or not, depending on display)
│   └── 6. RENDER final glyphs
│
├── FONT LOADING API
│   ├── document.fonts.ready         ← Promise, resolves when all fonts load
│   ├── document.fonts.load(font)    ← load specific font on demand
│   ├── document.fonts.check(font)   ← sync check if font available
│   └── new FontFace(family, source) ← programmatic @font-face
│
├── PRELOAD STRATEGY
│   ├── <link rel="preload" as="font" type="font/woff2" crossorigin>
│   ├── Tells browser: fetch this font BEFORE parsing CSS
│   └── Most effective for LCP hero text fonts
│
├── HOSTING STRATEGIES
│   ├── Self-hosted   ← control, privacy, GDPR safe, HTTP/2 push possible
│   ├── Google Fonts  ← convenience, CDN, privacy concerns (GDPR), 3rd-party
│   ├── Adobe Fonts   ← subscription, quality library, similar privacy tradeoffs
│   └── next/font     ← auto-self-hosts Google Fonts at build time, generates size-adjust
│
├── SUBSETTING
│   ├── unicode-range CSS  ← browser only loads matching character range
│   ├── glyphhanger CLI    ← analyze HTML, extract used codepoints, subset
│   └── pyftsubset         ← Python fonttools, precise glyph control
│
├── VARIABLE FONTS
│   ├── wght axis  ← replace 6-8 weight files with one variable file
│   ├── opsz axis  ← optical size adjusts letterform at small/large sizes
│   ├── custom axes ← type foundry-defined (slant, grade, width)
│   └── Tradeoff: single file ~80–120KB vs 6 static files ~6 × 30KB = 180KB
│
├── CLS REDUCTION
│   ├── size-adjust + metric overrides  ← CSS-level font metric matching
│   ├── font-display: optional          ← never causes layout shift (optional skip)
│   └── next/font automatic override    ← generates overrides from font data
│
├── FLUID TYPOGRAPHY
│   ├── clamp(min, preferred, max)  ← responsive font-size without breakpoints
│   ├── CSS locks                   ← linear interpolation between viewport sizes
│   └── cqi / cqb                   ← container query units for component-level scaling
│
├── TEXT RENDERING
│   ├── text-rendering: optimizeLegibility   ← kerning, ligatures (slower)
│   ├── -webkit-font-smoothing: antialiased  ← macOS subpixel → grayscale AA
│   ├── font-feature-settings                ← OpenType features (liga, kern, tnum)
│   └── font-variant-*                       ← high-level OpenType property
│
└── INTERNATIONALIZATION
    ├── CJK fonts → typically 5–8MB unsubsetted, unicode-range critical
    ├── RTL → writing-mode, direction, logical properties (margin-inline-*)
    └── line-height → CJK requires ~1.6–1.8 vs Latin ~1.4–1.5
```

---

## Part 1: Font Formats / Định Dạng Font

### WOFF2 — The Universal Choice / Lựa Chọn Phổ Quát

WOFF2 là định dạng duy nhất bạn cần lo về năm 2024+. Nó dùng **Brotli compression** thay vì zlib (WOFF), cho compression ratio tốt hơn 26–30%.

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

**Browser support**: 97%+ globally. Không cần fallback cho browsers hiện đại. Nếu bạn vẫn đang ship WOFF hoặc TTF làm primary format — đó là anti-pattern.

**File size comparison cho Inter Regular:**

```
TTF (raw):    ~260KB
WOFF:         ~140KB (zlib)
WOFF2:        ~100KB (Brotli)
```

### Variable Fonts / Font Biến Số

Variable font đóng gói nhiều weights/styles vào một file dùng **design axes**. Axis phổ biến nhất: `wght` (weight), `wdth` (width), `opsz` (optical size), `ital` (italic).

```css
/* Một file thay cho 8 weight files riêng lẻ */
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-variable.woff2") format("woff2-variations");
  font-weight: 100 900; /* range, không phải single value */
  font-style: normal;
  font-display: optional;
}

/* Sử dụng: CSS interpolate bất kỳ weight nào */
.heading {
  font-weight: 650;
} /* Không thể với static fonts */
.body {
  font-weight: 390;
} /* Fine-grained control */
```

**Tradeoffs:**

```
Variable font (Inter):     ~320KB — một request, tất cả weights
Static fonts (6 weights):  ~6 × 50KB = ~300KB — 6 requests, parallel
Static fonts (2 weights):  ~2 × 50KB = ~100KB — 2 requests
```

> Variable font thắng khi dùng 4+ weights. Thua khi chỉ dùng 1–2 weights.

**Optical size (`opsz`)**: Adjusts letterform design cho readability ở sizes khác nhau. `Inter Display` vs `Inter Text` là cùng một typeface với `opsz` khác nhau — thông tin thiết kế letterforms cho context size.

### EOT — Dead Format / Định Dạng Đã Chết

EOT (Embedded OpenType) là format của Microsoft cho IE 4–8. Không có browser nào hiện đại hỗ trợ. Nếu bạn thấy EOT trong codebase, đó là legacy code từ pre-2010.

```css
/* ❌ Anti-pattern — never write this in 2024+ */
@font-face {
  src:
    url("font.eot") format("embedded-opentype"),
    url("font.woff2") format("woff2");
}
```

---

## Part 2: @font-face Descriptors Deep Dive / Chi Tiết Descriptors

### The Complete @font-face Declaration

```css
@font-face {
  /* Required descriptors */
  font-family: "Brand Sans";
  src:
    local("Brand Sans"),
    /* Check if installed locally first */ url("/fonts/brand-sans.woff2") format("woff2");

  /* Weight and style */
  font-weight: 400;
  font-style: normal;

  /* Loading strategy */
  font-display: optional;

  /* Subset: only load for Latin characters */
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074,
    U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;

  /* CSS Fonts Level 4 — CLS reduction */
  size-adjust: 105%;
  ascent-override: 90%;
  descent-override: normal;
  line-gap-override: 0%;
}
```

### unicode-range — Selective Loading / Tải Có Chọn Lọc

`unicode-range` nói với browser: "Chỉ download font này nếu trang có ký tự trong range này."

```css
/* Latin Basic */
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-latin.woff2") format("woff2");
  unicode-range: U+0000-00FF;
}

/* Vietnamese — Cần thêm diacritics */
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-vietnamese.woff2") format("woff2");
  unicode-range:
    U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301,
    U+0303-0304, U+0308-0309, U+0323, U+1EA0-1EF9;
}

/* CJK — chỉ load nếu page có Chinese/Japanese/Korean */
@font-face {
  font-family: "Noto Sans SC";
  src: url("/fonts/noto-sans-sc.woff2") format("woff2");
  unicode-range: U+4E00-9FFF; /* CJK Unified Ideographs */
}
```

**Kết quả**: Browser chỉ download file nào chứa glyph thực sự được dùng trên trang.

---

## Part 3: font-display Values — The Core Tradeoff

Đây là kiến thức quan trọng nhất trong interview về font loading. `font-display` kiểm soát behavior trong hai khoảng thời gian: **block period** (browser chờ font trước khi hiển thị text) và **swap period** (thời gian browser chấp nhận thay thế bằng web font).

```
font-display timeline:
              │← block period →│← swap period →│← failure period →│
              0ms           100ms             3s                  ∞

auto      :   block (FOIT)  ←→ browser decides behavior
block     :   block up to 3s → swap if arrives, invisible if not
swap      :   0ms block → immediately show fallback → swap FOREVER
fallback  :   100ms block → 3s swap window → lock (no more swap)
optional  :   100ms block → browser decides based on connection speed
```

### Detailed Comparison / So Sánh Chi Tiết

| `font-display` | Block period    | Swap period     | FOIT risk             | FOUT risk           | CLS risk | Best use case                           |
| -------------- | --------------- | --------------- | --------------------- | ------------------- | -------- | --------------------------------------- |
| `auto`         | browser decides | browser decides | medium                | medium              | medium   | Defer to browser                        |
| `block`        | up to 3s        | short (3s)      | HIGH — invisible text | Low                 | Low      | Icon fonts, critical brand              |
| `swap`         | 0ms             | infinite        | None                  | HIGH — flash always | HIGH     | Body text where readability > stability |
| `fallback`     | 100ms           | 3s              | Low                   | Medium              | Medium   | Balanced — recommended for headings     |
| `optional`     | 100ms           | none            | None                  | None                | None     | LCP font, perf-critical                 |

**The FOIT vs FOUT vs CLS triangle:**

```
FOIT (Flash of Invisible Text):
  → font-display: block
  → User sees blank space for up to 3s
  → Bad for readability, bad for LCP

FOUT (Flash of Unstyled Text):
  → font-display: swap
  → User sees fallback font immediately, then web font replaces it
  → Can cause CLS if fallback and web font have different metrics

CLS from font swap:
  → Happens when fallback font (Arial, Georgia) has different
    x-height, cap-height, line-height than web font
  → Layout reflows — text takes different vertical space
  → CLS threshold: > 0.1 = needs improvement, > 0.25 = poor
```

### font-display: optional — The Performance Choice

`optional` là lựa chọn tốt nhất cho **Core Web Vitals** khi dùng đúng:

- Browser có 100ms để quyết định
- Nếu font **đã có trong cache hoặc tải rất nhanh** → dùng web font
- Nếu font chưa sẵn sàng sau 100ms → dùng fallback **và không bao giờ swap**
- Kết quả: zero CLS, zero FOIT sau lần tải đầu tiên

```css
/* Pattern: critical LCP font với optional + preload */
/* HTML */
<link rel="preload" href="/fonts/hero-font.woff2"
      as="font" type="font/woff2" crossorigin>

/* CSS */
@font-face {
  font-family: "HeroFont";
  src: url("/fonts/hero-font.woff2") format("woff2");
  font-display: optional;
}
```

---

## Part 4: CSS Fonts Level 4 — CLS Reduction Overrides

Đây là tính năng **2022–2023** ít được biết đến nhưng cực kỳ quan trọng cho senior interviews.

### The Problem / Vấn Đề

Khi browser swap từ fallback font (Arial, ~1.15 line-height, specific x-height) sang web font (Inter, khác x-height và spacing) → layout reflow → CLS spike.

```
Arial "Hello":     width: 48px, height: 20px
Inter  "Hello":    width: 44px, height: 19px  ← different dimensions
                            ↑
                  This difference causes layout shift
```

### The Solution / Giải Pháp

CSS Fonts Level 4 cho phép override font metrics để **align fallback font với web font trước khi web font tải**:

```css
/* Step 1: Measure your web font metrics (use font-metrics tool) */
/* Step 2: Define adjusted fallback */
@font-face {
  font-family: "Inter-Fallback";
  src: local("Arial"); /* Use system Arial as base */
  size-adjust: 107%; /* Scale Arial to match Inter's glyph width */
  ascent-override: 90.2%; /* Adjust top space */
  descent-override: 22.7%; /* Adjust bottom space */
  line-gap-override: 0%; /* Remove extra line gap */
}

/* Step 3: Use adjusted fallback in font stack */
body {
  font-family: "Inter", "Inter-Fallback", sans-serif;
}

/* Step 4: Define actual web font */
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-regular.woff2") format("woff2");
  font-display: swap; /* Now swap causes near-zero CLS */
}
```

**Kết quả**: Khi web font tải và swap xảy ra, glyph layout gần như **không thay đổi** vì fallback đã được scale để match. CLS từ 0.28 → 0.02.

### next/font Automates This / next/font Tự Động Hóa

Next.js `next/font` tính toán và inject các overrides này **tự động**:

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  // next/font automatically generates:
  // size-adjust, ascent-override, descent-override
  // AND self-hosts the font at build time
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

**What next/font does automatically:**

1. Downloads Google Font at **build time** → self-hosts on your domain
2. No third-party request → GDPR safe, faster, no DNS lookup
3. Generates `size-adjust` + override values from font data
4. Injects `<link rel="preload">` for the critical font
5. Uses `font-display: optional` by default (can override)

---

## Part 5: Font Loading API / API Tải Font

### document.fonts — The FontFaceSet

```javascript
// Check if font is available (sync)
const fontAvailable = document.fonts.check("16px Inter");

// Wait for ALL fonts to load
document.fonts.ready.then(() => {
  console.log("All fonts loaded, safe to measure layout");
  initCanvasTextRendering(); // Canvas API requires fonts to be loaded
});

// Load specific font on demand
await document.fonts.load("bold 16px Inter");
// Now font is guaranteed available

// Programmatic @font-face (dynamic font loading)
const face = new FontFace("DynamicFont", "url(/fonts/dynamic.woff2)", {
  weight: "400",
  style: "normal",
});
await face.load();
document.fonts.add(face);
```

### Use Cases / Trường Hợp Dùng

```javascript
// Use case 1: Canvas text rendering (fonts must be loaded before drawText)
async function renderCanvas(canvas) {
  await document.fonts.ready;
  const ctx = canvas.getContext("2d");
  ctx.font = "24px Brand Sans";
  ctx.fillText("Hello", 10, 50); // Font guaranteed present
}

// Use case 2: Measure text dimensions accurately
async function measureText(text, fontSize) {
  await document.fonts.load(`${fontSize}px Inter`);
  const span = document.createElement("span");
  span.style.font = `${fontSize}px Inter`;
  span.textContent = text;
  document.body.appendChild(span);
  const width = span.offsetWidth;
  span.remove();
  return width;
}

// Use case 3: Progressive enhancement — show content before font loads
document.fonts.ready.then(() => {
  document.documentElement.classList.add("fonts-loaded");
});
```

---

## Part 6: Preload Strategy / Chiến Lược Preload

### `<link rel="preload">` — Highest Priority Fetch

```html
<!-- Preload critical font — browser fetches BEFORE CSS is parsed -->
<link rel="preload" href="/fonts/inter-regular.woff2" as="font" type="font/woff2" crossorigin />

<!-- Critical points:
     1. crossorigin is REQUIRED even for same-origin fonts
        (fonts always use CORS mode)
     2. type="font/woff2" prevents double-download
     3. Preload only the fonts used in above-the-fold text
     4. Too many preloads = bandwidth contention = slower LCP
-->
```

**Tại sao `crossorigin` bắt buộc**: Browser fetch fonts dùng CORS mode ngay cả khi same-origin. Thiếu `crossorigin` khiến font bị fetch hai lần — một lần từ preload (wrong mode) và một lần từ CSS (CORS mode).

### Preload Prioritization / Ưu Tiên Hóa

```html
<!-- ✅ DO: Preload only the LCP/above-fold critical font -->
<link rel="preload" href="/fonts/hero-display.woff2" as="font" type="font/woff2" crossorigin />

<!-- ❌ DON'T: Preload every font weight -->
<!-- This creates bandwidth contention and can HURT LCP -->
<link rel="preload" href="/fonts/inter-100.woff2" ... />
<link rel="preload" href="/fonts/inter-200.woff2" ... />
<link rel="preload" href="/fonts/inter-300.woff2" ... />
<link rel="preload" href="/fonts/inter-400.woff2" ... />
```

---

## Part 7: Self-Hosting vs Google Fonts vs Adobe Fonts

### Comparison Matrix / Bảng So Sánh

| Strategy         | Performance                               | Privacy/GDPR                                 | Control                | Cost               | Maintenance            |
| ---------------- | ----------------------------------------- | -------------------------------------------- | ---------------------- | ------------------ | ---------------------- |
| **Self-hosted**  | Best — same domain, HTTP/2, preload works | Fully safe                                   | Full                   | Hosting cost       | Must update manually   |
| **Google Fonts** | Good CDN but 3rd-party DNS + connection   | Risk — IPs logged, German courts fined sites | Limited                | Free               | Auto-updated by Google |
| **Adobe Fonts**  | Good CDN, 3rd-party                       | Risk — similar to Google Fonts               | Medium                 | Subscription       | Auto-updated           |
| **next/font**    | Best — auto-self-hosted at build time     | Safe (downloaded at build)                   | Full                   | Bundled in Next.js | next upgrade handles   |
| **System fonts** | Zero network cost                         | Safe                                         | None (can't customize) | Free               | Zero                   |

### Google Fonts GDPR Issue / Vấn Đề GDPR

Năm 2022, một tòa án Đức (LG München) **phạt một website** vì dùng Google Fonts theo kiểu truyền thống — Google nhận IP address của người dùng mà không có consent rõ ràng.

**Options để fix:**

```html
<!-- Option 1: Self-host (download fonts từ Google Fonts và serve từ domain mình) -->
<!-- Use google-webfonts-helper.herokuapp.com để download -->

<!-- Option 2: Dùng next/font — tự động self-host -->

<!-- Option 3: Nếu phải dùng Google Fonts CDN: consent gate trước khi load -->
```

### Self-Hosting Recipe / Công Thức Self-Host

```css
/* Step 1: Download WOFF2 files từ Google Fonts hoặc Fontsource */
/* npm install @fontsource/inter */

/* Step 2: CSS in Next.js / app stylesheet */
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-display: optional;
  src: url("/fonts/inter-400-latin.woff2") format("woff2");
  unicode-range: U+0000-00FF;
}
```

---

## Part 8: Font Subsetting / Cắt Giảm Font

### Why Subsetting / Tại Sao Cần Subset

Một font đầy đủ có thể chứa 2,000–10,000 glyphs. Trang Latin-only chỉ cần ~200–300. CJK font chứa 20,000+ glyphs — unsubsetted là 5–8MB.

```
Full Noto Sans:          8MB   (all scripts)
Noto Sans SC subset:   350KB   (Chinese: unicode-range U+4E00-9FFF)
Latin subset:           60KB   (U+0000-00FF)
```

### CSS-Level Subsetting (unicode-range)

Đây là cách đơn giản nhất — browser tự quyết định có download không:

```css
/* Google Fonts tự động tạo multi-file với unicode-range */
/* Đây là generated CSS từ Google Fonts API: */

/* [1] latin-ext */
@font-face {
  font-family: "Inter";
  src: url("/.../inter-latin-ext.woff2") format("woff2");
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF;
}

/* [2] vietnamese */
@font-face {
  font-family: "Inter";
  src: url("/.../inter-vietnamese.woff2") format("woff2");
  unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9;
}

/* [3] latin */
@font-face {
  font-family: "Inter";
  src: url("/.../inter-latin.woff2") format("woff2");
  unicode-range: U+0000-00FF;
}
```

Browser chỉ download file `inter-vietnamese.woff2` khi trang có Vietnamese characters.

### Build-Time Subsetting với glyphhanger

```bash
# Install
npm install -g glyphhanger

# Analyze what characters your site actually uses
glyphhanger https://yoursite.com --spider --subset="./fonts/Brand.woff2"

# Output: Brand-subset.woff2 — chỉ chứa glyphs thực sự dùng
# Thường giảm file size 60–80%

# Manual subset với pyftsubset (Python fonttools)
pip install fonttools brotli
pyftsubset Brand.ttf \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153" \
  --layout-features="*" \
  --flavor=woff2 \
  --output-file=Brand-latin-subset.woff2
```

---

## Part 9: System Font Stack / Font Hệ Thống

System fonts = zero network request, instant render, native-feel UI.

```css
/* Modern system font stack */
body {
  font-family:
    system-ui,
    /* CSS standard — resolves to OS default UI font */ -apple-system,
    /* macOS/iOS: San Francisco */ BlinkMacSystemFont,
    /* Chrome on macOS: San Francisco */ "Segoe UI",
    /* Windows 10+: Segoe UI */ Roboto,
    /* Android: Roboto */ "Helvetica Neue",
    /* macOS fallback */ Arial,
    /* Cross-platform fallback */ sans-serif; /* Generic fallback */
}

/* system-ui alone covers 95%+ of modern browsers */
/* The rest are fallbacks for specific edge cases */
```

**Khi nào dùng system fonts:**

- Internal tools, dashboards, admin panels — where brand fonts aren't critical
- Performance-sensitive pages where any network cost matters
- Components that need to feel "native" to OS (toasts, modals, alerts)

**Khi nào KHÔNG dùng:**

- Brand-critical marketing sites
- Sites where typography is core design element
- When cross-platform consistency is required (system fonts look different on every OS)

---

## Part 10: CLS from Fonts — Measurement and Fix

### Measuring CLS / Đo CLS

```javascript
// Performance Observer — measure CLS in real-time
const observer = new PerformanceObserver((list) => {
  let cumulativeScore = 0;
  for (const entry of list.getEntries()) {
    // Only count shifts without recent user input
    if (!entry.hadRecentInput) {
      cumulativeScore += entry.value;
      console.log("Layout shift:", entry.value, "from:", entry.sources);
    }
  }
  console.log("Current CLS:", cumulativeScore);
});

observer.observe({ type: "layout-shift", buffered: true });

// In Chrome DevTools:
// Performance tab → record → look for Layout Shift events (red bars)
// Or: Lighthouse audit → CLS score with attribution
```

### CLS Score Thresholds / Ngưỡng Điểm

```
CLS < 0.1   → Good (green)
CLS 0.1-0.25 → Needs Improvement (yellow)
CLS > 0.25  → Poor (red)

Font swap contribution to CLS:
- Fallback → Web font (same metrics): CLS ≈ 0
- Fallback → Web font (different metrics): CLS 0.05–0.3+
  (depends on amount of text above fold)
```

### Font-Specific CLS Fix Flowchart / Luồng Sửa CLS Do Font

```
CLS spike detected from font swap?
│
├── Is it the LCP/hero font?
│   └── YES → font-display: optional + preload
│              → If still misses: add size-adjust overrides
│
├── Is it body text (critical readability)?
│   └── YES → Calculate size-adjust for fallback
│              → @font-face override + font-display: swap
│              → CLS near-zero with matching metrics
│
└── Using Next.js?
    └── YES → Switch to next/font — handles everything automatically
```

---

## Part 11: Fluid Typography / Typography Linh Hoạt

### clamp() — Responsive Without Breakpoints

```css
/* Syntax: clamp(minimum, preferred, maximum) */
/* Font scales smoothly from 320px to 1440px viewport */

h1 {
  /* At 320px viewport: 1.5rem (24px)
     At 1440px viewport: 3rem (48px)
     Between: linear interpolation */
  font-size: clamp(1.5rem, 2vw + 1rem, 3rem);
}

p {
  font-size: clamp(1rem, 1.5vw + 0.5rem, 1.25rem);
  line-height: clamp(1.4, 1.2 + 0.5vw, 1.6);
}
```

### CSS Locks / Khóa CSS

CSS lock = font size chỉ thay đổi trong một khoảng viewport nhất định:

```css
/* Lock: scale font only between 480px and 1200px */
/* Below 480px: fixed small, above 1200px: fixed large */
h2 {
  /* Formula:
     min + (max - min) * (viewport - min-viewport) / (max-viewport - min-viewport)
     = 1.25rem + (2rem - 1.25rem) * (100vw - 30rem) / (75rem - 30rem)
  */
  font-size: clamp(1.25rem, 1.25rem + (2 - 1.25) * ((100vw - 30rem) / (75 - 30)), 2rem);
}
```

### Container Query Units / Đơn Vị Container Query

```css
/* cqi = container query inline size (width-based) */
/* cqb = container query block size (height-based) */
.card-title {
  font-size: clamp(1rem, 4cqi, 1.5rem);
  /* Font scales with card width, not viewport */
}
```

**Khi nào dùng container units vs viewport units:**

- Viewport units (`vw`, `vh`) → page-level typography (headings, hero text)
- Container units (`cqi`, `cqb`) → component-level typography (card titles, widget labels)

---

## Part 12: Text Rendering / Render Chữ

### text-rendering

```css
/* optimizeLegibility — enables kerning and ligatures, SLOWER */
/* Use for headings where readability matters more than speed */
h1,
h2,
h3 {
  text-rendering: optimizeLegibility;
}

/* optimizeSpeed — skip advanced features, faster on large blocks */
/* Use for data-dense UIs with lots of text */
.data-table td {
  text-rendering: optimizeSpeed;
}

/* geometricPrecision — mathematical precision over readability */
/* Rarely needed in practice */
```

### Font Smoothing / Làm Mịn Font

```css
/* macOS/iOS antialiasing — subpixel vs grayscale */
body {
  /* Grayscale antialiasing — thinner, higher contrast appearance on Retina */
  -webkit-font-smoothing: antialiased;
  /* Firefox equivalent */
  -moz-osx-font-smoothing: grayscale;
}

/* When NOT to use antialiased:
   - Non-retina screens: grayscale AA looks thinner/lighter than subpixel
   - Dark text on light bg on non-retina: subpixel is clearer */
```

### OpenType Features / Tính Năng OpenType

```css
/* font-feature-settings — low-level OpenType control */
body {
  /* Enable common ligatures (fi, fl, ff) + kerning */
  font-feature-settings:
    "liga" 1,
    "kern" 1;
}

.price {
  /* Tabular numerals — fixed-width numbers for tables */
  font-feature-settings: "tnum" 1;
  /* Or high-level equivalent: */
  font-variant-numeric: tabular-nums;
}

.small-caps-heading {
  /* True small caps from font, not scaled capitals */
  font-variant-caps: small-caps;
}

/* font-variant-* is preferred over font-feature-settings
   for better browser compatibility and readability */
```

---

## Part 13: Internationalization / Quốc Tế Hóa

### CJK Font Strategy / Chiến Lược Font CJK

CJK (Chinese, Japanese, Korean) fonts là thách thức lớn nhất trong typography:

```css
/* Strategy 1: Separate declarations with unicode-range */
@font-face {
  font-family: "Noto Sans";
  src: url("/fonts/noto-sans-latin.woff2") format("woff2");
  unicode-range: U+0000-00FF;
}

@font-face {
  font-family: "Noto Sans SC";
  src: url("/fonts/noto-sans-sc-subset.woff2") format("woff2");
  /* Subset to most common 3500 characters (HSK 6 level) */
  unicode-range: U+4E00-9FA5;
}

/* Strategy 2: System CJK fallback (zero network cost) */
body {
  font-family:
    "Brand Font",
    /* Custom web font for Latin */ "PingFang SC",
    /* macOS/iOS Chinese */ "Microsoft YaHei",
    /* Windows Chinese */ "Noto Sans SC",
    /* Android/Linux Chinese */ sans-serif;
}
```

### RTL Typography / Typography Phải-sang-Trái

```css
/* HTML attribute for RTL languages */
/* <html dir="rtl" lang="ar"> */

/* CSS logical properties — adapt to writing direction */
.content {
  /* Instead of: margin-left, margin-right */
  margin-inline-start: 1rem; /* Left in LTR, right in RTL */
  margin-inline-end: 1rem;

  /* Instead of: padding-left, padding-right */
  padding-inline: 1.5rem;

  /* Text alignment */
  text-align: start; /* Left in LTR, right in RTL */
}

/* RTL-specific adjustments */
[dir="rtl"] {
  font-size: 110%; /* Arabic/Hebrew fonts often need slight size increase */
  line-height: 1.8; /* Arabic script typically needs more line-height */
}
```

### line-height for Different Scripts / line-height Cho Scripts Khác

```css
/* Latin: 1.4–1.5 is standard */
.latin-text {
  line-height: 1.5;
}

/* CJK: needs more space due to square glyph density */
.cjk-text {
  line-height: 1.7;
}

/* Arabic/Hebrew: needs space for diacritics above/below baseline */
.arabic-text {
  line-height: 1.8;
}

/* Devanagari (Hindi): upper marks need extra space */
.devanagari-text {
  line-height: 1.6;
}
```

---

## Comparison Matrix / Bảng So Sánh

### font-display Values

| Value      | Block period          | Swap window | FOIT      | FOUT   | CLS    | Recommended for                       |
| ---------- | --------------------- | ----------- | --------- | ------ | ------ | ------------------------------------- |
| `auto`     | Browser default (~3s) | Short       | High      | Low    | Low    | Not recommended explicitly            |
| `block`    | 3s                    | ~3s         | Very high | Low    | Low    | Icon fonts only                       |
| `swap`     | 0ms                   | Infinite    | None      | High   | High   | Body text if CLS addressed separately |
| `fallback` | 100ms                 | 3s          | Low       | Medium | Medium | General headings/UI text              |
| `optional` | 100ms                 | None        | None      | None   | None   | LCP critical fonts                    |

### Hosting Strategies

| Strategy           | TTFB impact            | Privacy  | GDPR | Control | Complexity |
| ------------------ | ---------------------- | -------- | ---- | ------- | ---------- |
| Self-hosted        | Lowest (same origin)   | Safe     | Safe | Full    | High       |
| Google Fonts (CDN) | Medium (3rd party DNS) | Logs IPs | Risk | Limited | Low        |
| Adobe Fonts        | Medium                 | Logs IPs | Risk | Medium  | Low        |
| next/font          | Lowest (build-time DL) | Safe     | Safe | Full    | Very Low   |
| System fonts       | Zero                   | Perfect  | Safe | None    | None       |

### Font Format Comparison

| Format         | Compression          | Browser support | Use case              | Status            |
| -------------- | -------------------- | --------------- | --------------------- | ----------------- |
| WOFF2          | Brotli (~30% better) | 97%+            | Primary format        | Current           |
| WOFF           | zlib                 | 95%+            | Old browser fallback  | Declining         |
| TTF/OTF        | None                 | 90%+            | Desktop; web fallback | Not ideal for web |
| Variable WOFF2 | Brotli               | 90%+            | Multi-weight/axis     | Current           |
| EOT            | Proprietary          | IE only         | Dead format           | Dead              |

---

## Part 14: Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟢 Q1: What is FOIT and FOUT, and how does `font-display` control them?

**A:**

**FOIT (Flash of Invisible Text)**: Browser hides text completely while the web font loads. User sees blank/invisible text — sometimes for up to 3 seconds. Caused by `font-display: block` (the historical default behavior).

**FOUT (Flash of Unstyled Text)**: Browser immediately shows text in a fallback font (Arial, Times New Roman), then swaps to the web font when it loads. User sees a visible "flash" as font changes. Caused by `font-display: swap`.

`font-display` controls two time windows:

1. **Block period**: How long browser holds text invisible waiting for the font
2. **Swap period**: After block period, how long browser accepts the web font as a swap

```css
/* FOIT: 3-second invisible text */
@font-face {
  font-family: "Heading";
  src: url("heading.woff2") format("woff2");
  font-display: block; /* Invisible for up to 3s */
}

/* FOUT: immediate fallback, swap forever */
@font-face {
  font-family: "Heading";
  src: url("heading.woff2") format("woff2");
  font-display: swap; /* Fallback shown immediately */
}

/* Balanced: 100ms hide, 3s swap window, then lock */
@font-face {
  font-family: "Heading";
  src: url("heading.woff2") format("woff2");
  font-display: fallback; /* Best balance for most use cases */
}
```

> 🇻🇳 **Tóm tắt**: FOIT = text vô hình khi đang tải font (font-display: block). FOUT = text hiện ngay bằng fallback rồi bị thay (font-display: swap). `font-display` kiểm soát hai khoảng thời gian: block period (bao lâu giữ vô hình) và swap period (bao lâu chấp nhận swap). `fallback` = 100ms block + 3s swap window là cân bằng tốt nhất cho hầu hết trường hợp.

**💡 Interview Signal:**

- ✅ Strong: Defines both FOIT and FOUT clearly, explains the block/swap period model, knows all 5 `font-display` values with tradeoffs, links to CLS impact
- ❌ Weak: "font-display: swap fixes FOIT" — partially correct but misses that swap causes FOUT and CLS

---

### 🟢 Q2: What font format should you use in 2024 and why?

**A:**

**WOFF2 is the only format you need** for modern browsers (97%+ global support as of 2024).

```css
/* Modern @font-face — WOFF2 only */
@font-face {
  font-family: "Brand";
  src: url("/fonts/brand.woff2") format("woff2");
  font-weight: 400;
  font-display: optional;
}

/* If you need IE11 support (< 1% traffic in 2024): */
@font-face {
  font-family: "Brand";
  src:
    url("/fonts/brand.woff2") format("woff2"),
    url("/fonts/brand.woff") format("woff"); /* IE11 fallback */
  font-weight: 400;
}
```

WOFF2 uses **Brotli compression** — 26–30% smaller than WOFF (zlib). Compared to raw TTF, WOFF2 is typically 40–60% smaller.

**Variable fonts**: If using 4+ font weights, a variable WOFF2 can be more efficient than multiple static files:

```css
@font-face {
  font-family: "Brand";
  src: url("/fonts/brand-variable.woff2") format("woff2-variations");
  font-weight: 100 900; /* Range declaration */
}
```

EOT is completely dead (IE-only format). TTF/OTF should not be served to web browsers directly — always convert to WOFF2 first.

> 🇻🇳 **Tóm tắt**: Năm 2024, chỉ cần WOFF2 — 97% browser support, dùng Brotli compression, nhỏ hơn TTF 40–60%. Variable font (`font-weight: 100 900`) thay thế 6–8 file weight riêng lẻ khi dùng nhiều weights. EOT đã chết. Không serve TTF/OTF trực tiếp ra web — convert sang WOFF2 trước.

**💡 Interview Signal:**

- ✅ Strong: Knows Brotli vs zlib distinction, explains variable font tradeoff (file count vs file size), dismisses EOT confidently
- ❌ Weak: "Use WOFF2 and WOFF as fallback" — unnecessary for modern browsers, shows outdated knowledge

---

### 🟡 Q3: How does `unicode-range` improve font loading performance?

**A:**

`unicode-range` tells the browser to only download a font file if the page contains characters within that Unicode range. This enables **conditional/selective loading** — browser inspects the actual text on the page, compares against the declared range, and skips the download if there's no match.

```css
/* Without unicode-range: Browser downloads ALL font files */
@font-face {
  font-family: "Brand";
  src: url("/fonts/brand-full.woff2") format("woff2");
  /* No unicode-range = always downloaded if font-family is referenced */
}

/* With unicode-range: Browser downloads only needed subsets */
@font-face {
  font-family: "Brand";
  src: url("/fonts/brand-latin.woff2") format("woff2");
  unicode-range: U+0000-00FF; /* Only for Latin pages */
}

@font-face {
  font-family: "Brand";
  src: url("/fonts/brand-vi.woff2") format("woff2");
  unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9; /* Vietnamese */
}

@font-face {
  font-family: "Brand";
  src: url("/fonts/brand-cjk.woff2") format("woff2");
  unicode-range: U+4E00-9FFF; /* CJK — only loads on Chinese pages */
}
```

**Real-world impact**: A CJK font without subsetting is 5–8MB. With `unicode-range`, an English-only page in a multilingual app skips that 8MB download entirely. Google Fonts uses this pattern automatically when you embed their API — it generates 3–6 separate `@font-face` blocks per font with distinct `unicode-range` values.

> 🇻🇳 **Tóm tắt**: `unicode-range` nói với browser: "Chỉ download file này nếu trang có ký tự trong range này." Browser scan text trên trang, so với range khai báo, và skip download nếu không match. Cực kỳ quan trọng cho CJK fonts (5–8MB nếu không subset). Google Fonts tự động tạo pattern này khi dùng API của họ.

**💡 Interview Signal:**

- ✅ Strong: Explains the browser inspection mechanism (not just "lazy loads"), gives CJK size example, knows Google Fonts uses this automatically
- ❌ Weak: "It loads fonts for specific languages" — correct but doesn't explain the browser's inspection behavior or why it matters for performance

---

### 🟡 Q4: What is CLS from font swap and how do you measure and fix it?

**A:**

**CLS from font swap** occurs when a web font replaces a fallback font that has different **font metrics** (cap height, x-height, ascender/descender ratios, line-gap). The layout reflowing to accommodate the new font dimensions causes a measurable Cumulative Layout Shift.

**Measuring:**

```javascript
// Performance Observer for CLS attribution
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      for (const source of entry.sources) {
        console.log("Shift source:", source.node, "delta:", entry.value);
      }
    }
  }
});
observer.observe({ type: "layout-shift", buffered: true });

// Chrome DevTools: Performance tab → record → Layout Shift markers (red)
// Lighthouse: "Avoid large layout shifts" → CLS score with font attribution
```

**Fix 1 — CSS Fonts Level 4 metric overrides:**

```css
/* Step 1: Create adjusted fallback */
@font-face {
  font-family: "Inter-Fallback";
  src: local("Arial");
  size-adjust: 107%; /* Scale to match Inter glyph width */
  ascent-override: 90%; /* Align cap-height */
  descent-override: 22%; /* Align descenders */
  line-gap-override: 0%; /* Remove extra gap */
}

/* Step 2: Use in font stack */
body {
  font-family: "Inter", "Inter-Fallback", sans-serif;
}
```

**Fix 2 — font-display: optional (no swap at all):**

```css
@font-face {
  font-family: "HeroFont";
  src: url("/fonts/hero.woff2") format("woff2");
  font-display: optional; /* Never swaps → zero CLS */
}
/* Combined with <link rel="preload"> → font loads fast enough on cache hit */
```

**Fix 3 — next/font (automated):**

```tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
// next/font calculates size-adjust automatically from font binary
```

> 🇻🇳 **Tóm tắt**: CLS do font swap = fallback font có metrics khác web font → layout reflow khi swap. Đo bằng PerformanceObserver hoặc Lighthouse. Fix: (1) CSS Fonts L4: `size-adjust` + `ascent-override` + `descent-override` để align fallback metrics với web font — CLS gần 0 khi swap. (2) `font-display: optional` — không bao giờ swap → zero CLS. (3) `next/font` tự động tính overrides từ font binary.

**💡 Interview Signal:**

- ✅ Strong: Explains WHY shift happens (metric differences), knows all 3 fix approaches with tradeoffs, mentions CSS Fonts Level 4 descriptors by name
- ❌ Weak: "Remove font-display: swap" — correct effect but doesn't explain the proper solutions (overrides, optional)

---

### 🟡 Q5: How does Next.js `next/font` improve font performance compared to manual Google Fonts embedding?

**A:**

Traditional Google Fonts embedding has three problems:

```html
<!-- ❌ Traditional: 3 issues -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
  rel="stylesheet"
/>

<!-- Issue 1: Extra DNS lookup + TLS handshake for googleapis.com -->
<!-- Issue 2: User IP sent to Google → GDPR risk -->
<!-- Issue 3: No automatic CLS optimization (size-adjust not generated) -->
```

`next/font` solves all three at **build time**:

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
  display: "swap", // or 'optional' for CLS
  variable: "--font-inter", // For CSS variable usage
});

export default function RootLayout({ children }) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

**What next/font does at build time:**

1. **Downloads fonts from Google** → stores them locally in `.next/` output
2. **Serves from your domain** → no 3rd-party DNS, no Google IP logging
3. **Generates `size-adjust` + metric overrides** from the actual font binary
4. **Injects `<link rel="preload">`** for the critical subset automatically
5. **Generates `font-display` correctly** → can achieve near-zero CLS

**For local fonts:**

```tsx
import localFont from "next/font/local";

const brandFont = localFont({
  src: [
    { path: "./fonts/brand-400.woff2", weight: "400" },
    { path: "./fonts/brand-700.woff2", weight: "700" },
  ],
  display: "optional",
  variable: "--font-brand",
});
```

> 🇻🇳 **Tóm tắt**: `next/font` vs Google Fonts CDN: (1) Download font tại build time → serve từ domain mình → không DNS lookup, không gửi IP người dùng đến Google. (2) Tự động generate `size-adjust` + metric overrides → CLS gần 0. (3) Inject `<link rel="preload">` tự động. Kết quả: nhanh hơn, GDPR-safe, CLS tốt hơn — với ít code hơn.

**💡 Interview Signal:**

- ✅ Strong: Explains the build-time download mechanism (not runtime), mentions GDPR improvement specifically, knows about automatic size-adjust generation, shows local font usage too
- ❌ Weak: "next/font is just easier to use" — misses the performance and privacy mechanisms

---

### 🟡 Q6: Explain variable fonts — when do they help and when do they hurt performance?

**A:**

Variable fonts store multiple design variations in a single file using **axes** — continuous ranges instead of discrete files. The `wght` (weight) axis is most common.

```css
/* Static fonts: 6 separate files, 6 separate requests */
/* inter-100.woff2, inter-200.woff2, ..., inter-700.woff2 */

/* Variable font: 1 file, 1 request */
@font-face {
  font-family: "Inter Variable";
  src: url("/fonts/inter-variable.woff2") format("woff2-variations");
  font-weight: 100 900; /* Continuous range */
  font-style: oblique 0deg 10deg; /* If italic axis present */
}

/* Usage: any value in range */
.heading {
  font-weight: 750;
} /* Only possible with variable fonts */
.body {
  font-weight: 390;
}
```

**When variable fonts WIN:**

```
Scenario: Using 4+ font weights
  Static: 4 × 40KB = 160KB (4 requests, can parallelize)
  Variable: 1 × 120KB (1 request)

  Variable wins: smaller total, 1 request vs 4, cache efficiency

Scenario: Design needs fine-grained weight interpolation (brand animation)
  → Only variable fonts support fractional weights
```

**When variable fonts LOSE:**

```
Scenario: Using only 1–2 weights
  Static (2 weights): 2 × 40KB = 80KB
  Variable:           1 × 120KB

  Static wins: 40KB less data for same result

Scenario: Browser needs to process woff2-variations format
  → Slightly more CPU for rendering (negligible on modern hardware)
```

**Advanced axes:**

```css
/* opsz — optical size: letterform design changes for size context */
h1 {
  font-variation-settings: "opsz" 36;
} /* Display size → wider letterforms */
p {
  font-variation-settings: "opsz" 14;
} /* Text size → tighter letterforms */

/* Custom axes (type foundry specific) */
.grade-high {
  font-variation-settings: "GRAD" 150;
} /* Heavier stroke weight */
```

> 🇻🇳 **Tóm tắt**: Variable font = 1 file chứa nhiều weight/style. Thắng khi dùng 4+ weights (1 request vs nhiều request). Thua khi chỉ dùng 1–2 weights (variable file lớn hơn 2 static file). `font-variation-settings` cho phép fine-grained control: `"opsz"` (optical size), `"wght"`, các custom axes của type foundry. Cho phép animation smooth weight (không thể với static fonts).

**💡 Interview Signal:**

- ✅ Strong: Gives the "4+ weights" breakeven rule, knows `opsz` axis and its purpose, can calculate file size comparison, mentions animation use case
- ❌ Weak: "Variable fonts are always better" — incorrect, ignores the size tradeoff for low-weight-count usage

---

### 🔴 Q7: A designer wants to eliminate FOUT completely on the hero heading. Walk through your complete strategy.

**A:**

This requires **layering multiple techniques** — no single property solves it. Here is the complete strategy:

**Step 1: Identify the exact font file needed**

```css
/* Hero heading = large display text, likely 32–72px, single weight */
/* Only need: display weight WOFF2, Latin subset */
/* File size target: < 30KB */
```

**Step 2: Preload the font at highest priority**

```html
<!-- In <head>, before all other resources -->
<link rel="preload" href="/fonts/hero-display.woff2" as="font" type="font/woff2" crossorigin />
```

**Step 3: Use `font-display: optional`**

```css
@font-face {
  font-family: "HeroDisplay";
  src: url("/fonts/hero-display.woff2") format("woff2");
  font-display: optional; /* 100ms block; if not ready → use fallback forever */
}
```

**Step 4: Align fallback metrics to eliminate visual difference**

```css
/* Measure font metrics: use fontdrop.info or font-tools */
@font-face {
  font-family: "HeroDisplay-Fallback";
  src: local("Georgia"); /* Fallback with similar proportions */
  size-adjust: 112%;
  ascent-override: 86%;
  descent-override: 20%;
  line-gap-override: 0%;
}

h1 {
  font-family: "HeroDisplay", "HeroDisplay-Fallback", Georgia, serif;
}
```

**Step 5: Subset to absolute minimum**

```bash
# Only Latin capitals + common punctuation for hero heading
pyftsubset HeroDisplay.ttf \
  --unicodes="U+0041-005A,U+0061-007A,U+0020-0040" \
  --flavor=woff2 \
  --output-file=hero-display-min.woff2
# Result: 8–15KB instead of 60KB — loads before 100ms window closes
```

**Step 6: Measure and validate**

```javascript
// Verify: on fast connection, font always loads before 100ms optional window
performance.mark("font-load-start");
document.fonts.load("72px HeroDisplay").then(() => {
  performance.mark("font-load-end");
  performance.measure("font-load", "font-load-start", "font-load-end");
  // Aim for < 80ms on fast connection, < 100ms on 4G
});

// CLS validation
const observer = new PerformanceObserver((list) => {
  const cls = list.getEntries().reduce((sum, e) => (!e.hadRecentInput ? sum + e.value : sum), 0);
  console.assert(cls < 0.05, `CLS too high: ${cls}`);
});
observer.observe({ type: "layout-shift", buffered: true });
```

**The complete effect**: On first load, if preloaded font arrives within 100ms optional window — perfect, web font used, zero FOUT. If connection is slow — fallback is used, metrics aligned so CLS ≈ 0. On second load — font cached, always wins the 100ms window.

> 🇻🇳 **Tóm tắt**: Loại bỏ FOUT hoàn toàn cho hero heading = kết hợp 5 kỹ thuật: (1) `<link rel="preload">` để font tải trước CSS. (2) `font-display: optional` — browser dùng web font nếu có trong 100ms, nếu không thì dùng fallback mãi mãi (không swap). (3) `size-adjust` + metric overrides để fallback trông gần giống web font — CLS ≈ 0. (4) Subset font xuống còn 8–15KB để fit trong 100ms window. (5) Measure: font.load() timing + CLS PerformanceObserver.

**💡 Interview Signal:**

- ✅ Strong: Layers all 5 techniques with reasoning for each, knows `font-display: optional` + preload pattern, calculates file size impact of subsetting, includes measurement/validation
- ❌ Weak: "Use font-display: block" — this causes FOIT, opposite of what was asked; "font-display: swap" — this shows FOUT then eliminates it which is the exact problem

---

### 🔴 Q8: How would you handle typography for a multilingual app serving Latin, Vietnamese, and Chinese users from one codebase?

**A:**

This requires a **font loading strategy that scales per locale** without downloading unnecessary font data for any language.

**Architecture overview:**

```
Latin users  → download ~60KB (Latin subset)
Vietnamese   → download ~90KB (Latin + Vietnamese diacritics)
Chinese      → download ~350KB (Chinese subset, smart-subsetted)
All users    → download system font immediately (zero flash)
```

**Step 1: System font stack as base (always available, zero FOIT)**

```css
body {
  font-family:
    "Brand",
    /* Custom web font — will load */ system-ui,
    /* Immediate system font while loading */ "PingFang SC",
    /* macOS/iOS Chinese (system) */ "Microsoft YaHei",
    /* Windows Chinese (system) */ sans-serif;
}
```

**Step 2: Locale-split @font-face declarations**

```css
/* Latin — small file, fast load */
@font-face {
  font-family: "Brand";
  src: url("/fonts/brand-latin.woff2") format("woff2");
  font-display: optional;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153;
}

/* Vietnamese — additional diacritics */
@font-face {
  font-family: "Brand";
  src: url("/fonts/brand-vietnamese.woff2") format("woff2");
  font-display: optional;
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+1EA0-1EF9, U+1EB8-1EBF, U+1EC0-1ECF;
}

/* Chinese — subset to 3500 most common characters */
@font-face {
  font-family: "Brand CJK";
  src: url("/fonts/brand-cjk-subset.woff2") format("woff2");
  font-display: swap; /* CJK users expect readable text immediately */
  unicode-range: U+4E00-9FA5, U+3400-4DBF;
}
```

**Step 3: Per-locale preload strategy (HTML, dynamically injected by server/framework)**

```tsx
// Next.js: per-locale preload in root layout
export default function RootLayout({ children, params: { locale } }) {
  return (
    <html lang={locale}>
      <head>
        {locale === "zh" && (
          <link
            rel="preload"
            href="/fonts/brand-cjk-subset.woff2"
            as="font"
            type="font/woff2"
            crossorigin
          />
        )}
        {locale === "vi" && (
          <link
            rel="preload"
            href="/fonts/brand-vietnamese.woff2"
            as="font"
            type="font/woff2"
            crossorigin
          />
        )}
        {/* Latin always preloaded */}
        <link
          rel="preload"
          href="/fonts/brand-latin.woff2"
          as="font"
          type="font/woff2"
          crossorigin
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Step 4: Line-height and layout adjustments per locale**

```css
:lang(zh),
:lang(ja),
:lang(ko) {
  line-height: 1.7; /* CJK needs more breathing room */
  font-size: 1.05em; /* CJK looks slightly smaller at same px */
  word-break: break-all; /* CJK has no spaces between words */
}

:lang(vi) {
  line-height: 1.6; /* Vietnamese diacritics need extra space */
}

[dir="rtl"] {
  font-family: "RTL Brand", "Arabic Fallback", sans-serif;
  line-height: 1.8;
}
```

**Step 5: CJK font size calculation**

The issue: at 16px body size, CJK fonts look 10–15% smaller than Latin fonts at the same `px` size due to different baseline-to-ascender ratios. Fix with `@font-face` `size-adjust` or per-locale size rules.

> 🇻🇳 **Tóm tắt**: App đa ngôn ngữ (Latin + Vietnamese + Chinese) = chiến lược phân lớp: (1) System font stack làm base — zero FOIT cho mọi ngôn ngữ. (2) `unicode-range` tách font theo ngôn ngữ — mỗi người dùng chỉ download gì họ cần. (3) Server-side per-locale preload — inject `<link rel="preload">` đúng file theo `locale` param. (4) Điều chỉnh `line-height`, `word-break`, `font-size` theo `:lang()` selector. CJK cần `font-display: swap` (người dùng muốn đọc được ngay) còn Latin/VI dùng `optional` (CLS sensitivity cao hơn).

**💡 Interview Signal:**

- ✅ Strong: Proposes per-locale preload injection (server-side), knows CJK needs `swap` not `optional`, addresses line-height differences by script, mentions word-break: break-all for CJK
- ❌ Weak: "Use Google Fonts with all subsets" — massive download for every user, no per-locale optimization

---

### 🔴 Q9: Your team is migrating to `next/font` from manual Google Fonts embeds. What are the migration steps and what could go wrong?

**A:**

**Migration steps:**

**Step 1: Identify current font usage**

```bash
# Find all Google Fonts links
grep -r "fonts.googleapis.com" src/ --include="*.tsx" --include="*.html"
grep -r "font-family" src/ --include="*.css" --include="*.scss"

# Document: font names, weights used, subsets needed
# Example: Inter 400, 500, 700 — latin + vietnamese
```

**Step 2: Replace @import / <link> with next/font**

```tsx
// BEFORE: _app.tsx or layout.tsx
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700" ...>

// AFTER: app/layout.tsx
import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
  display: "optional", // Upgrade from 'swap' to fix CLS
  variable: "--font-inter",
});

const mono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "optional",
  variable: "--font-mono",
});

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${mono.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

**Step 3: Update CSS custom properties usage**

```css
/* Using variable approach (recommended for design tokens) */
:root {
  --font-body: var(--font-inter), system-ui, sans-serif;
  --font-code: var(--font-mono), monospace;
}

body {
  font-family: var(--font-body);
}

code,
pre {
  font-family: var(--font-code);
}
```

**Potential problems and fixes:**

```
Problem 1: Font variant not available in next/font
→ next/font supports all Google Fonts; check exact name at fonts.google.com
→ For custom/purchased fonts: use next/font/local

Problem 2: CLS regression (display: swap → optional changes behavior)
→ On first visit, some users may see fallback font instead of web font
→ Fix: add explicit size-adjust overrides OR keep display: 'swap'
   and verify CLS is acceptable with new metric overrides

Problem 3: Variable font support
→ next/font supports variable fonts: weight: "100 900" (range not array)
→ Check: font must have variable font variant on Google Fonts

Problem 4: SSG pages with font preloads
→ next/font injects preload in <head> per-page — should work automatically
→ Verify: run Lighthouse on static export pages to confirm preload present

Problem 5: Third-party components using their own font imports
→ Check: any UI libraries importing fonts independently
→ Fix: override in your CSS or configure library to use CSS variables
```

**Validation after migration:**

```bash
# 1. Check no googleapis.com requests in Network tab
# 2. Verify fonts served from same origin (Network > Filter: font)
# 3. Run Lighthouse: CLS should improve (fewer swap-related shifts)
# 4. Check font preload in <head> source
# 5. Test in Chrome Devtools > Network > Slow 3G to verify behavior
```

> 🇻🇳 **Tóm tắt**: Migration next/font: (1) Grep tìm tất cả Google Fonts links. (2) Thay bằng `import { FontName } from "next/font/google"` với đúng subsets/weights. (3) Dùng `variable` option để có CSS custom property. (4) Update CSS dùng `var(--font-*)`. Risks: font variant không có trong next/font (dùng local thay), CLS behavior thay đổi khi đổi `display` value, third-party components import font riêng. Validate: không còn googleapis.com request, fonts từ same origin, CLS giảm trên Lighthouse.

**💡 Interview Signal:**

- ✅ Strong: Proposes systematic audit (grep), knows variable approach for design tokens, enumerates specific migration risks with solutions, includes validation checklist
- ❌ Weak: "Just change the import" — misses CSS variable pattern, misses CLS behavior change, misses third-party font imports

---

### 🔴 Q10: How do you implement fluid typography with `clamp()` and what are the limits of the approach?

**A:**

Fluid typography scales font sizes continuously with viewport width — no breakpoints needed.

**The `clamp()` pattern:**

```css
/* Syntax: clamp(minimum, fluid-value, maximum) */
/* fluid-value = linear interpolation using vw units */

/* Formula: value = slope × viewport + intercept
   slope     = (max-size - min-size) / (max-viewport - min-viewport)
   intercept = min-size - slope × min-viewport
*/

/* Example: 1rem at 320px, 2rem at 1200px viewport */
/* slope = (2 - 1) / (75 - 20) = 0.018rem/rem */
/* intercept = 1 - 0.018 × 20 = 0.636rem */
h1 {
  font-size: clamp(1rem, 0.636rem + 1.818vw, 2rem);
}

/* Use CSS lock tool (utopia.fyi) to generate these values */
h1 {
  font-size: clamp(1.802rem, 1.601rem + 1.003vw, 2.441rem);
}
h2 {
  font-size: clamp(1.602rem, 1.424rem + 0.888vw, 1.953rem);
}
h3 {
  font-size: clamp(1.424rem, 1.266rem + 0.789vw, 1.563rem);
}
p {
  font-size: clamp(1rem, 0.913rem + 0.435vw, 1.25rem);
}
```

**Type scale with modular ratio:**

```css
/* Modular scale: each step = previous × ratio */
/* 1.25 Major Third scale from 1rem base */
:root {
  --step--1: clamp(0.8rem, 0.779rem + 0.106vw, 0.875rem);
  --step-0: clamp(1rem, 0.952rem + 0.239vw, 1.125rem);
  --step-1: clamp(1.25rem, 1.185rem + 0.326vw, 1.5rem);
  --step-2: clamp(1.563rem, 1.465rem + 0.489vw, 2rem);
  --step-3: clamp(1.953rem, 1.807rem + 0.728vw, 2.667rem);
  --step-4: clamp(2.441rem, 2.228rem + 1.065vw, 3.556rem);
  --step-5: clamp(3.052rem, 2.742rem + 1.551vw, 4.741rem);
}

h1 {
  font-size: var(--step-4);
}
h2 {
  font-size: var(--step-3);
}
body {
  font-size: var(--step-0);
}
```

**Container query units (cqi) for component-level scaling:**

```css
.card-title {
  /* Scale with container width, not viewport */
  font-size: clamp(1rem, 5cqi, 1.5rem);
}
```

**Limits of `clamp()` approach:**

```
Limitation 1: Math is hard to reason about
→ Use generator tools (utopia.fyi, fluid-type-scale.com)
→ Document the min/max values explicitly in comments

Limitation 2: No axis-specific control
→ clamp() scales font-size proportionally
→ It doesn't automatically adjust letter-spacing, line-height, font-weight
→ Must add corresponding clamp() for each property:
   line-height: clamp(1.4, 1.2 + 0.5vw, 1.6);
   letter-spacing: clamp(-0.01em, -0.005em + 0.05vw, 0.02em);

Limitation 3: Accessibility — text must remain readable
→ Users with browser zoom: clamp() doesn't override user zoom
→ But: very small minimum sizes can be hard to read
→ Never set minimum below 1rem for body text

Limitation 4: Variable fonts + fluid weights
→ Want weight to also vary with viewport? Possible but complex:
   font-weight: clamp(400, 300 + 20vw, 700);
   → Works only with variable fonts

Limitation 5: Container queries are more appropriate for component-scale
→ Viewport-based clamp() is wrong for reusable card components
→ Solution: cqi units inside @container contexts
```

> 🇻🇳 **Tóm tắt**: Fluid typography với `clamp(min, fluid-val, max)` cho phép font scale liên tục theo viewport mà không cần breakpoints. Công thức: `slope × vw + intercept` với slope = (max-size - min-size) / (max-vw - min-vw). Dùng tool utopia.fyi để tính sẵn. Giới hạn: (1) Math phức tạp — dùng tool. (2) Phải clamp() từng property riêng (line-height, letter-spacing). (3) Accessibility: minimum size không dưới 1rem. (4) Component-level scaling cần `cqi` units, không phải `vw`. Variable fonts cho phép fluid font-weight animation kết hợp với clamp.

**💡 Interview Signal:**

- ✅ Strong: Knows the slope/intercept formula, mentions utopia.fyi as tool, addresses line-height needing separate clamp, knows container query units for component typography, flags accessibility minimum
- ❌ Weak: "Use vw for font-size" — no clamping = tiny text on mobile, huge on desktop; doesn't know the clamp formula or its limits

---

## Anti-Patterns / Lỗi Thường Gặp

### Anti-Pattern 1: font-display: swap as the Default Answer

```css
/* ❌ Common advice but WRONG if CLS is a concern */
@font-face {
  font-family: "Brand";
  src: url("brand.woff2") format("woff2");
  font-display: swap; /* Infinite swap window → CLS spike */
}

/* ✅ Correct: Match strategy to goal */
/* LCP font: optional + preload */
/* Body text with CLS fix: swap + size-adjust overrides */
/* Icon fonts: block (FOIT acceptable, FOUT breaks icons) */
```

### Anti-Pattern 2: Preloading Every Font Weight

```html
<!-- ❌ Creates bandwidth contention, hurts LCP -->
<link rel="preload" href="/fonts/inter-100.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/inter-200.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/inter-300.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/inter-500.woff2" as="font" type="font/woff2" crossorigin />

<!-- ✅ Correct: Preload only the critical above-fold font -->
<link rel="preload" href="/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin />
```

### Anti-Pattern 3: Missing `crossorigin` on Font Preload

```html
<!-- ❌ Causes double download — browser fetches twice with wrong/right mode -->
<link rel="preload" href="/fonts/brand.woff2" as="font" type="font/woff2" />

<!-- ✅ crossorigin REQUIRED for fonts even when same-origin -->
<link rel="preload" href="/fonts/brand.woff2" as="font" type="font/woff2" crossorigin />
```

### Anti-Pattern 4: Serving TTF/OTF to Web Browsers

```css
/* ❌ Uncompressed, 2–3× larger than WOFF2 */
@font-face {
  font-family: "Brand";
  src: url("/fonts/brand.ttf") format("truetype");
}

/* ✅ Always convert to WOFF2 */
@font-face {
  font-family: "Brand";
  src: url("/fonts/brand.woff2") format("woff2");
}
```

### Anti-Pattern 5: Loading Full CJK Font Without Subsetting

```css
/* ❌ Noto Sans SC (full) = 8MB — catastrophic for page load */
@font-face {
  font-family: "Noto Sans SC";
  src: url("/fonts/noto-sans-sc-full.woff2") format("woff2");
}

/* ✅ Subset + unicode-range → only characters used */
@font-face {
  font-family: "Noto Sans SC";
  src: url("/fonts/noto-sans-sc-subset.woff2") format("woff2");
  unicode-range: U+4E00-9FA5;
  font-display: swap;
}
```

### Anti-Pattern 6: Using `font-display: block` for Text Fonts

```css
/* ❌ Users see blank text for up to 3s */
@font-face {
  font-family: "BodyText";
  src: url("body.woff2") format("woff2");
  font-display: block; /* Intended for icon fonts, not text */
}

/* ✅ Use block ONLY for icon fonts where fallback would be unreadable */
@font-face {
  font-family: "Icons";
  src: url("icons.woff2") format("woff2");
  font-display: block; /* Icon fonts: FOUT shows random glyphs — acceptable FOIT */
}
```

### Anti-Pattern 7: Google Fonts CDN in GDPR-Regulated Regions Without Consent

```html
<!-- ❌ Without consent flow in EU/Germany — legal risk after LG München 2022 -->
<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" />

<!-- ✅ Self-host or use next/font (downloads at build time) -->
```

### Anti-Pattern 8: `text-rendering: optimizeLegibility` on Body Text

```css
/* ❌ Causes significant rendering slowdown on large blocks of text */
body {
  text-rendering: optimizeLegibility;
}

/* ✅ Only on headings where visual quality matters over performance */
h1,
h2,
h3 {
  text-rendering: optimizeLegibility;
}
```

### Anti-Pattern 9: `font-size` in `px` Without Scaling

```css
/* ❌ Breaks browser default font size preferences and zoom behavior */
body {
  font-size: 14px;
}

/* ✅ Use rem for scalable, accessible font sizes */
body {
  font-size: 1rem;
} /* Respects browser user preference (default 16px) */

/* Or fluid: */
body {
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
}
```

### Anti-Pattern 10: Skipping Fallback font-family

```css
/* ❌ If web font fails to load: no fallback, browser uses Times New Roman */
body {
  font-family: "BrandFont";
}

/* ✅ Always provide fallback chain */
body {
  font-family:
    "BrandFont",
    system-ui,
    -apple-system,
    sans-serif;
}
```

---

## Memory Hook / Mẹo Ghi Nhớ

**"FOBS-P-CV"** — Mnemonic cho font loading strategy decision tree:

```
F — Format first: WOFF2 only (2024+), Variable if 4+ weights
O — Optional vs Swap: CLS-critical = optional, readability-critical = swap
B — Block period: only icon fonts need block (text = 100ms max)
S — Size-adjust: match fallback metrics → near-zero CLS
P — Preload: critical font only, must have crossorigin
C — CJK: subset + unicode-range, system font fallback
V — Variable font: 4+ weights = variable wins, 1–2 = static wins
```

**Simplified for interviews:**

> "WOFF2 + optional + preload + size-adjust = zero FOIT, zero FOUT, zero CLS. Everything else is a tradeoff."

---

## Q&A Summary Table / Bảng Tóm Tắt

| #   | Question                                                    | Level | One-Line Answer                                                                                      |
| --- | ----------------------------------------------------------- | ----- | ---------------------------------------------------------------------------------------------------- |
| 1   | What is FOIT/FOUT and how does `font-display` control them? | 🟢    | FOIT = invisible text (block), FOUT = fallback then swap (swap). 5 values control block/swap windows |
| 2   | What font format should you use in 2024?                    | 🟢    | WOFF2 only (Brotli compression, 97% support). Variable WOFF2 if 4+ weights                           |
| 3   | How does `unicode-range` improve performance?               | 🟡    | Browser only downloads font file if page contains matching characters — critical for CJK             |
| 4   | What is CLS from font swap and how do you fix it?           | 🟡    | Fallback/web font metric mismatch → reflow. Fix: size-adjust overrides OR font-display: optional     |
| 5   | How does `next/font` improve on manual Google Fonts?        | 🟡    | Build-time download (self-host) + auto size-adjust generation + auto preload injection + GDPR safe   |
| 6   | When do variable fonts help vs hurt?                        | 🟡    | Help: 4+ weights, fine-grained weight. Hurt: 1–2 weights (variable file larger than 2 statics)       |
| 7   | Strategy to eliminate FOUT on hero heading                  | 🔴    | preload + optional + size-adjust + subset to < 30KB = zero FOUT/FOIT/CLS                             |
| 8   | Multilingual app: Latin + Vietnamese + Chinese              | 🔴    | System font base + unicode-range split + per-locale server-side preload + `:lang()` overrides        |
| 9   | Migrate manual Google Fonts to next/font                    | 🔴    | Audit → replace with next/font → CSS variables → validate no googleapis.com requests + CLS           |
| 10  | Fluid typography with clamp() and its limits                | 🔴    | `clamp(min, slope×vw + intercept, max)`. Limits: line-height not auto-scaled, cqi for components     |

---

## Cold Call — Rapid-Fire Scenarios / Câu Hỏi Nhanh

**"Your Lighthouse shows CLS 0.28. DevTools attribution says it's caused by font swap on a paragraph above the fold. Walk me through your debugging and fix."**

→ Font metrics mismatch. Check: what fallback font is being used (Arial? Georgia?), measure its metrics vs web font with fontdrop.info. Apply `size-adjust` + `ascent-override` + `descent-override` to a new `@font-face` using `local()` source for the fallback. Re-test CLS with `PerformanceObserver`. If still > 0.1, switch to `font-display: optional` + `<link rel="preload">`.

---

**"Designer wants to use the typeface 'Clarendon' which isn't on Google Fonts. It's a purchased TTF. What's your process?"**

→ Convert TTF → WOFF2 using `fonttools` (`pyftsubset` with `--flavor=woff2`). Subset to needed characters. Self-host in `/public/fonts/`. Write proper `@font-face` declaration. Check license: some fonts prohibit web embedding (check EULA). Set `font-display: optional` with metric-adjusted fallback.

---

**"What happens if you add `rel="preload"` for a font but forget `crossorigin`?"**

→ Double download. Browser fetches the font twice: once from preload (non-CORS mode) and once when CSS @font-face is encountered (CORS mode, as required for fonts). The preload fetch is wasted. Network tab shows font requested twice with different modes. Fix: always add `crossorigin` attribute — required even for same-origin fonts.

---

**"When would you choose `font-display: block` over `font-display: swap`?"**

→ Only for **icon fonts**. With icon fonts, the fallback glyph (a letter or symbol from a different font) is visually meaningless — showing 'A' where there should be a checkmark icon is worse than showing nothing briefly. `block` keeps it invisible until the icon font loads. For regular text fonts, `block` is nearly always wrong — users can't read invisible text.

---

**"A CLS spike appears on mobile but not desktop. Same font, same CSS. Why?"**

→ Font load time on mobile exceeds `font-display: optional`'s 100ms window → fallback is used. Desktop (fast connection) loads font within 100ms → web font used directly, no swap. On mobile: when web font eventually arrives, it's past the swap window → fallback stays → no CLS. But if using `swap` instead of `optional`: mobile's slower connection means swap happens after content render → CLS spike. Fix: preload + optional combination or ensure font file size < 30KB for 100ms on 4G.

---

**"Team is about to ship a redesign. The new typeface has a very different x-height from the old one. How do you prevent CLS during the transition?"**

→ During the transition window, both fonts may be in use (A/B test or rolling deploy). Measure metrics of both fonts. Create adjusted `@font-face` fallback definitions for both. Use feature flags to apply correct font-family + fallback overrides per variant. After full rollout: keep only new font's overrides. Monitor CLS in RUM (Real User Monitoring) during rollout, not just Lighthouse.

---

**"You're building an e-commerce product page where price numbers must always align vertically in a comparison table. What CSS do you use?"**

→ `font-variant-numeric: tabular-nums` (high-level) or `font-feature-settings: "tnum" 1` (low-level OpenType). Tabular numerals have equal width for all digits (0–9) — proportional numerals have varying widths ('1' narrower than '8') which causes columns to misalign. Most display/body fonts default to proportional. Only apply to the data column, not decorative numbers.

---

**"What is `size-adjust` in @font-face and how is it different from `transform: scale()`?"**

→ `size-adjust` scales the glyph metrics intrinsically without affecting layout box size. `transform: scale()` scales the visual output but the element still occupies its original layout space. `size-adjust: 107%` makes Arial glyphs 7% larger but the letter-spacing, word-spacing, and line-height calculations all reflect the new size — so text wraps correctly and line counts match the web font. Scale() would cause overflow and misalignment.

---

**"Can you use clamp() for font-weight in fluid typography? When would you?"**

→ Yes, but only with variable fonts. `font-weight: clamp(400, 300 + 20vw, 700)` — weight increases with viewport. Use case: display headings that get bolder as they get larger (matching conventional display typography conventions where larger type often uses slightly heavier weight). Without variable font, `clamp()` on `font-weight` has no effect — non-variable fonts snap to nearest available weight.

---

## Self-Check Checklist / Danh Sách Tự Kiểm Tra

Before shipping a page with custom web fonts, verify:

**Format & Files**

- [ ] Font files are WOFF2 format (not TTF, OTF, or EOT)
- [ ] Variable fonts used if 4+ weights are needed
- [ ] Font files are subsetted (only needed glyphs, not full typeface)
- [ ] File size per font file < 60KB Latin, < 350KB CJK subset

**@font-face Declarations**

- [ ] `font-family` name is consistent across all declarations
- [ ] `src` includes `format("woff2")` hint
- [ ] `font-weight` and `font-style` match the actual file contents
- [ ] `unicode-range` used for multilingual font splits
- [ ] `font-display` value matches the use case (not always `swap`)

**CLS Prevention**

- [ ] CLS measured with PerformanceObserver or Lighthouse
- [ ] CLS from fonts < 0.1 (ideally < 0.05)
- [ ] `size-adjust` + metric overrides applied if using `font-display: swap`
- [ ] OR `font-display: optional` used for critical above-fold fonts

**Loading Strategy**

- [ ] `<link rel="preload">` for critical font(s) only (not all weights)
- [ ] `crossorigin` attribute present on every font preload
- [ ] No more than 2 font preloads per page (bandwidth contention)
- [ ] Font CSS loaded non-blocking (in `<head>` but not render-blocking)

**Hosting & Privacy**

- [ ] Fonts served from same origin (self-hosted or next/font)
- [ ] No direct Google Fonts CDN embedding without consent mechanism (GDPR)
- [ ] Font files included in HTTP/2 or HTTP/3 multiplexed connection
- [ ] Font files have appropriate cache headers (immutable or long max-age)

**Performance Validation**

- [ ] Lighthouse audit passes CLS (< 0.1) and LCP not blocked by fonts
- [ ] WebPageTest waterfall shows no font-blocking LCP
- [ ] Chrome DevTools Network tab: no duplicate font requests (crossorigin issue)
- [ ] Fonts load from memory cache on second visit

**Accessibility & i18n**

- [ ] `font-size` base in `rem`, not `px` (respects user preferences)
- [ ] Fluid typography minimum not below `1rem` for body text
- [ ] CJK pages: `line-height: 1.7+`, correct `unicode-range` subset
- [ ] Fallback font stack defined for when web font fails
- [ ] `text-rendering: optimizeLegibility` limited to headings, not body

**Code Quality**

- [ ] No duplicate `@font-face` declarations for same font/weight/style
- [ ] No EOT format references in any CSS
- [ ] CSS `local()` hint used where applicable (saves network if already installed)
- [ ] `font-feature-settings` used for tabular numerals in data tables
