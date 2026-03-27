# HTML5 Fundamentals / Nền tảng HTML5

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [CSS Fundamentals](./00-css-fundamentals.md) | [Grid & Flexbox](./01-grid-flexbox.md) | [Responsive Design](./03-responsive-design.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn build một trang blog. Designer hài lòng, trông đẹp trên màn hình. Nhưng:

- Người dùng mù đọc trang bằng screen reader: nghe thấy "div div div div button" — không hiểu gì
- Google không index bài viết vì không biết đâu là tiêu đề, đâu là nội dung
- SEO score thấp, traffic organic = 0

**Nguyên nhân**: Toàn bộ layout dùng `<div>` và `<span>`. Browser không biết đây là header, nav, hay article. HTML5 semantic elements giải quyết vấn đề này.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng — Tòa nhà văn phòng:**
Một tòa nhà không có biển chỉ dẫn: tất cả các phòng đều ghi "PHÒNG". Bạn phải vào từng phòng để biết đó là reception, phòng họp hay toilet.

HTML không có semantic = `<div>` soup. HTML có semantic = biển chỉ dẫn rõ ràng:

- `<header>` = lễ tân tầng trệt
- `<nav>` = bảng hướng dẫn tầng
- `<main>` = khu làm việc chính
- `<article>` = một tài liệu/bài viết độc lập
- `<aside>` = thông tin phụ (sidebar)
- `<footer>` = thông tin liên hệ

**Tại sao HTML5 quan trọng hơn bạn nghĩ:**

- **Accessibility (a11y)**: Screen readers dùng semantic elements để navigate — ảnh hưởng trực tiếp đến 1 tỷ người khuyết tật
- **SEO**: Google dùng HTML structure để hiểu content — `<h1>` một lần, `<article>` đúng chỗ
- **Web APIs mới**: HTML5 mang đến `<video>`, `<canvas>`, Web Storage, Geolocation, Web Workers

---

## Concept Map / Bản Đồ Khái Niệm

```
      [HTML5 FUNDAMENTALS]  ← bạn đang ở đây
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
[Semantic] [Forms]  [APIs]
<header>   <input>  Web Storage
<nav>      types    Canvas
<main>     validation Geolocation
<article>  <form>   Web Workers
<section>           WebSocket
<footer>
    │
    ▼
[Accessibility]
ARIA roles | alt text | tab order
    │
    ▼
[CSS Fundamentals] → [JavaScript DOM]
```

---

## Core Concepts Overview / Tổng Quan Khái Niệm

### 1. Semantic HTML & Accessibility

> 🧠 **Memory Hook**: "Semantic HTML = labels on every room in a building. Without them, a blind visitor (screen reader) hears 'room room room room' — with them, they hear 'entrance, meeting room, kitchen, exit.'"

**Why does semantic HTML exist?** Pre-HTML5, all layout used `<div>` soup. Screen readers, search engines, and browser reader modes had no way to distinguish navigation from content from footnotes. HTML5 semantic elements standardize intent — you write once, every parser understands.

**Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Using multiple `<h1>` per page | HTML5 outline algorithm was never implemented | One `<h1>` per page, hierarchy from h2 onward |
| `<section>` for every block | `<section>` requires an accessible name (heading) to be meaningful | Use `<div>` for generic grouping, `<section>` only for named sections |
| Wrapping everything in `<article>` | `<article>` = self-contained syndicate-able content | Only for blog posts, product cards, comments |

**🎯 Interview Pattern:**

- Khi thấy: "How would you improve accessibility / SEO of this page?"
- → Think: Semantic HTML audit (div soup → semantic elements) + ARIA for custom widgets
- → Answer opens with: "I'd start with a semantic audit: replace generic divs with `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>` where appropriate, then check heading hierarchy has one `<h1>` with no skipped levels."

---

### 2. Script Loading & Performance

> 🧠 **Memory Hook**: "No attr = STOP. async = GO when ready (no guarantee order). defer = GO after parking (ordered). module = defer + ES modules."

```
Normal:  HTML [===========STOP====BLOCKED===STOP==] parse continues
                          ↑fetch        ↑exec
async:   HTML [===========================] parse continues
                    ↑fetch parallel  ↑exec immediately (interrupts!)
defer:   HTML [===========================] parse complete → exec ordered
module:  Same as defer + ES module features + strict mode
```

**Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `async` for scripts that depend on each other | async order is non-deterministic | Use `defer` for inter-dependent scripts |
| `<script>` in `<head>` without defer/async | Blocks HTML parsing → slower FCP | Always use `defer` or move to end of `<body>` |

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: What is semantic HTML and why does it matter? / Semantic HTML là gì và tại sao quan trọng? 🟢 Junior

**A:** Semantic HTML means using elements that convey meaning about their content rather than just presentation. Elements like `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, and `<footer>` describe the role of their content, while `<div>` and `<span>` are generic containers with no semantic value.

Semantic HTML matters for three reasons: (1) **Accessibility** -- screen readers use semantic elements to build a navigable page outline, allowing visually impaired users to jump between sections; (2) **SEO** -- search engine crawlers understand page structure better when semantics are correct; (3) **Maintainability** -- developers reading the markup instantly understand the purpose of each section.

Vietnamese: Semantic HTML là việc dùng đúng thẻ mang ý nghĩa thay vì chỉ dùng `<div>` cho mọi thứ. Ví dụ `<nav>` cho navigation, `<article>` cho nội dung độc lập, `<aside>` cho sidebar. Ba lợi ích chính: screen reader đọc được cấu trúc trang (accessibility), Google hiểu nội dung tốt hơn (SEO), và developer đọc code dễ hiểu hơn (maintainability).

**💡 Interview Signal:**

- ✅ Strong: Distinguishes `<section>` (named region, needs heading) vs `<article>` (self-contained, syndicatable) vs `<div>` (generic grouping with no semantics), and mentions the real-world impact on 1 billion+ screen reader users
- ❌ Weak: "Use semantic elements like header and footer instead of divs" (correct but doesn't show understanding of WHEN each element is appropriate or WHY it matters for accessibility)

```html
<!-- Bad: div soup -->
<div class="header">
  <div class="nav">...</div>
</div>
<div class="content">
  <div class="post">...</div>
  <div class="sidebar">...</div>
</div>

<!-- Good: semantic HTML -->
<header>
  <nav aria-label="Main navigation">...</nav>
</header>
<main>
  <article>...</article>
  <aside>...</aside>
</main>
<footer>...</footer>
```

---

### Q: Explain the HTML document outline and heading hierarchy / Giải thích document outline và thứ tự heading 🟡 Mid

**A:** The document outline is the hierarchical structure created by heading elements (`<h1>` through `<h6>`) and sectioning elements. The key rule is: each page should have exactly one `<h1>`, and heading levels should not be skipped (e.g., jumping from `<h1>` to `<h3>` without an `<h2>` in between).

The HTML5 outline algorithm originally proposed that each sectioning element (`<section>`, `<article>`, `<nav>`, `<aside>`) could reset the heading hierarchy, allowing multiple `<h1>` elements. However, **no browser or assistive technology ever implemented this algorithm**, and the spec was updated in 2022 to remove it. The practical rule remains: use a single heading hierarchy across the entire page.

Vietnamese: Document outline là cấu trúc phân cấp được tạo bởi các thẻ heading. Quy tắc quan trọng: mỗi trang chỉ nên có 1 `<h1>`, không nhảy level (h1 xuống h3 mà bỏ h2). HTML5 từng đề xuất mỗi section có thể reset heading level, nhưng không trình duyệt nào implement, nên vẫn phải dùng heading hierarchy truyền thống.

**💡 Interview Signal:**

- ✅ Strong: Knows the HTML5 outline algorithm was proposed but never implemented (common misconception that multiple `<h1>` are OK inside sections), explains practical impact: screen reader "headings list" navigation breaks if hierarchy is wrong
- ❌ Weak: "One h1 per page, then h2, h3..." (correct rule but doesn't explain WHY or the HTML5 algorithm misconception that trips people up)

```html
<body>
  <h1>Site Title</h1>
  <nav>
    <h2>Navigation</h2>
  </nav>
  <main>
    <article>
      <h2>Article Title</h2>
      <section>
        <h3>Section within Article</h3>
      </section>
    </article>
    <aside>
      <h2>Related Links</h2>
    </aside>
  </main>
</body>
```

---

### Q: What are HTML5 form features and how do they reduce JavaScript? / HTML5 form có những tính năng gì giúp giảm JavaScript? 🟢 Junior

**A:** HTML5 introduced built-in form capabilities that previously required JavaScript: new input types (`email`, `url`, `tel`, `date`, `number`, `range`, `color`, `search`), validation attributes (`required`, `pattern`, `min`, `max`, `minlength`, `maxlength`, `step`), and the Constraint Validation API.

The `<datalist>` element provides native autocomplete suggestions. The `<output>` element displays calculation results. The `<progress>` and `<meter>` elements show progress bars and gauges without JavaScript.

Vietnamese: HTML5 thêm nhiều input type mới (email, date, number...) và validation attributes (required, pattern, min/max...) giúp giảm đáng kể JavaScript. Trình duyệt tự validate và hiển thị error message. Tuy nhiên trong production thường vẫn cần custom validation vì giao diện native khác nhau giữa các browser và không đủ linh hoạt về UX.

**💡 Interview Signal:**

- ✅ Strong: Mentions native validation reduces JS but browser UI is inconsistent → production code uses `novalidate` + Constraint Validation API; knows `<datalist>` for native autocomplete without a JS library
- ❌ Weak: "HTML5 has email and number input types" (lists features without explaining the design decision: when native is enough vs when JS validation is needed)

```html
<form novalidate>
  <label for="email">Email:</label>
  <input
    type="email"
    id="email"
    required
    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
    placeholder="user@example.com"
  />

  <label for="age">Age (18-99):</label>
  <input type="number" id="age" min="18" max="99" step="1" />

  <label for="birthday">Birthday:</label>
  <input type="date" id="birthday" min="1900-01-01" />

  <label for="framework">Framework:</label>
  <input list="frameworks" id="framework" />
  <datalist id="frameworks">
    <option value="React"></option>
    <option value="Vue"></option>
    <option value="Angular"></option>
    <option value="Svelte"></option>
  </datalist>

  <button type="submit">Submit</button>
</form>
```

---

### Q: How does HTML5 native form validation work vs custom validation? / So sánh native validation và custom validation 🟡 Mid

**A:** Native validation uses built-in browser validation triggered on form submission. It checks `required`, `type`, `pattern`, `min`/`max`, etc. and shows browser-styled error tooltips. The Constraint Validation API provides `checkValidity()`, `reportValidity()`, and `setCustomValidity()` methods on form elements, plus a `validity` object with boolean flags (`valueMissing`, `typeMismatch`, `patternMismatch`, `tooShort`, `tooLong`, `rangeUnderflow`, `rangeOverflow`, `stepMismatch`, `customError`).

The trade-off: native validation is zero-JS but inconsistent across browsers and not styleable. Production apps typically use `novalidate` on the form to disable native UI, then use the Constraint Validation API or libraries (Formik, React Hook Form, Zod) for custom styling and behavior.

Vietnamese: Native validation dùng attribute HTML, trình duyệt tự kiểm tra và hiện error. Ưu điểm: không cần JS. Nhược điểm: UI error khác nhau giữa browser, không style được. Trong production thường thêm `novalidate` rồi dùng JS validation (Constraint Validation API hoặc thư viện) để kiểm soát UX hoàn toàn.

**💡 Interview Signal:**

- ✅ Strong: Explains the `validity` object flags (valueMissing, typeMismatch, patternMismatch...), knows `setCustomValidity('')` must be called to clear custom errors, recommends `novalidate` on form + Constraint Validation API for production
- ❌ Weak: "Use required and pattern attributes for validation" (input attributes only — misses the programmatic API that actually makes it production-usable)

```js
const form = document.querySelector("form");
const email = document.querySelector("#email");

// Custom validation message
email.addEventListener("input", () => {
  if (email.validity.typeMismatch) {
    email.setCustomValidity("Please enter a valid company email");
  } else {
    email.setCustomValidity(""); // Clear custom error
  }
});

// Prevent native validation UI, validate manually
form.addEventListener("submit", (e) => {
  if (!form.checkValidity()) {
    e.preventDefault();
    // Show custom error UI
    highlightInvalidFields(form);
  }
});
```

---

### Q: What is ARIA and when should you use it? / ARIA là gì và khi nào nên dùng? 🟡 Mid

**A:** ARIA (Accessible Rich Internet Applications) is a set of HTML attributes that provide additional semantics for assistive technologies. ARIA has three categories: **roles** (define what an element is, e.g., `role="dialog"`, `role="tablist"`), **properties** (define characteristics, e.g., `aria-label`, `aria-describedby`, `aria-required`), and **states** (define current conditions, e.g., `aria-expanded`, `aria-selected`, `aria-hidden`).

The first rule of ARIA: **do not use ARIA if a native HTML element or attribute already provides the semantics**. For example, use `<button>` instead of `<div role="button">`, use `<nav>` instead of `<div role="navigation">`. ARIA does not add behavior -- a `<div role="button">` still needs `tabindex="0"` and keyboard event handlers.

Vietnamese: ARIA thêm ngữ nghĩa cho screen reader khi HTML native không đủ. Ba loại: roles (vai trò), properties (thuộc tính), states (trạng thái). Quy tắc quan trọng nhất: **không dùng ARIA nếu HTML native đã đủ**. ARIA chỉ thêm semantic, không thêm behavior -- nghĩa là `<div role="button">` vẫn cần thêm tabindex và xử lý keyboard events thủ công.

**💡 Interview Signal:**

- ✅ Strong: Leads with "Rule 1 of ARIA: don't use ARIA if native HTML works", knows ARIA adds semantics not behavior (must add `tabindex="0"` + keyboard events to `<div role="button">`), and uses `aria-label` to distinguish multiple `<nav>` landmarks
- ❌ Weak: "ARIA makes elements accessible" (misleading — ARIA only changes semantic meaning, a `<div role="button">` is still not keyboard-focusable without `tabindex`)

```html
<!-- Bad: ARIA where native element suffices -->
<div role="button" tabindex="0" onclick="submit()">Submit</div>

<!-- Good: native element -->
<button onclick="submit()">Submit</button>

<!-- Good: ARIA for custom widget with no native equivalent -->
<div role="tablist" aria-label="Product tabs">
  <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">Details</button>
  <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2">Reviews</button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">Product details here...</div>
<div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>Reviews here...</div>
```

---

### Q: How do you optimize a page for SEO using HTML? / Tối ưu SEO bằng HTML như thế nào? 🔴 Senior

**A:** HTML-level SEO optimization involves several layers:

1. **Meta tags**: `<title>` (50-60 chars), `<meta name="description">` (150-160 chars), canonical URL (`<link rel="canonical">`), Open Graph tags for social sharing, `robots` meta tag for crawl control.
2. **Structured data**: JSON-LD scripts with Schema.org vocabulary (Product, Article, FAQ, BreadcrumbList) help search engines display rich snippets.
3. **Semantic structure**: proper heading hierarchy, `<main>` for primary content, `<article>` for self-contained content, `<nav>` for navigation.
4. **Performance signals**: `<link rel="preload">` for critical resources, `<link rel="preconnect">` for third-party origins, lazy loading images (`loading="lazy"`), proper image `alt` text.
5. **Internationalization**: `<html lang="en">`, `<link rel="alternate" hreflang="vi">` for multilingual sites.

Vietnamese: SEO qua HTML có nhiều tầng: meta tags (title, description, canonical), structured data (JSON-LD với Schema.org giúp Google hiện rich snippet), semantic structure (heading đúng thứ tự, dùng article/main/nav), performance hints (preload, preconnect, lazy loading), và i18n (lang, hreflang). Senior cần biết cả cách debug SEO issues bằng Lighthouse, Google Search Console, và structured data testing tool.

**💡 Interview Signal:**

- ✅ Strong: Distinguishes canonical URL (prevents duplicate content penalty), JSON-LD structured data for rich snippets (separate from meta tags), `hreflang` for multilingual sites, and `fetchpriority="high"` for LCP image optimization
- ❌ Weak: "Add title and meta description tags" (junior-level — senior SEO requires knowing structured data, canonical, hreflang, and performance signals)

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Best Running Shoes 2024 | ShoeStore</title>
  <meta
    name="description"
    content="Compare top-rated running shoes with expert reviews. Free shipping on orders over $50."
  />
  <link rel="canonical" href="https://shoestore.com/running-shoes" />

  <!-- Open Graph -->
  <meta property="og:title" content="Best Running Shoes 2024" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://shoestore.com/og-image.jpg" />

  <!-- Preconnect to CDN -->
  <link rel="preconnect" href="https://cdn.shoestore.com" />
  <link rel="preload" as="image" href="/hero-banner.webp" />

  <!-- Structured Data -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "UltraBoost Runner",
      "image": "https://shoestore.com/ultraboost.jpg",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.6",
        "reviewCount": "234"
      }
    }
  </script>
</head>
```

---

### Q: What are HTML meta tags and which ones are essential? / Meta tags nào là thiết yếu? 🟢 Junior

**A:** Meta tags provide metadata about the HTML document to browsers, search engines, and social media platforms. The essential ones are:

- `<meta charset="UTF-8">` -- character encoding (must be within first 1024 bytes)
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` -- responsive design on mobile
- `<title>` -- page title shown in browser tab and search results
- `<meta name="description">` -- search result snippet text

Other important meta tags: `<meta name="robots" content="noindex, nofollow">` (crawl control), `<meta http-equiv="X-UA-Compatible" content="IE=edge">` (IE rendering mode, less relevant now), `<meta name="theme-color">` (browser UI color on mobile).

Vietnamese: Meta tags cung cấp thông tin cho trình duyệt và search engine. Bắt buộc phải có: charset (encoding), viewport (responsive), title (tiêu đề trang), description (mô tả cho search result). Ngoài ra còn robots (kiểm soát crawl), theme-color (màu thanh địa chỉ trên mobile). Lưu ý charset phải nằm trong 1024 byte đầu tiên của document.

**💡 Interview Signal:**

- ✅ Strong: Knows charset must be within first 1024 bytes (security requirement to prevent charset sniffing attacks), explains `width=device-width` prevents mobile browsers from scaling down, mentions `theme-color` for PWA-like browser chrome
- ❌ Weak: "Add charset and viewport meta tags" (knows what but not why — the 1024-byte charset rule and mobile viewport zoom prevention are the interesting details)

---

### Q: What are ARIA landmarks and how do they map to HTML5 elements? / ARIA landmarks tương ứng với HTML5 elements như thế nào? 🟡 Mid

**A:** ARIA landmarks are regions of a page that assistive technologies use for navigation. HTML5 semantic elements implicitly map to ARIA landmark roles:

| HTML5 Element                      | Implicit ARIA Role | Purpose              |
| ---------------------------------- | ------------------ | -------------------- |
| `<header>` (page-level)            | `banner`           | Site-wide header     |
| `<nav>`                            | `navigation`       | Navigation links     |
| `<main>`                           | `main`             | Primary content      |
| `<aside>`                          | `complementary`    | Sidebar content      |
| `<footer>` (page-level)            | `contentinfo`      | Site-wide footer     |
| `<section>` (with accessible name) | `region`           | Generic landmark     |
| `<form>` (with accessible name)    | `form`             | Form landmark        |
| None                               | `search`           | Search functionality |

Key nuance: `<header>` and `<footer>` only map to `banner`/`contentinfo` when they are direct children of `<body>`. Inside an `<article>` or `<section>`, they have no implicit landmark role.

Vietnamese: ARIA landmarks giúp screen reader nhảy nhanh giữa các vùng trang. HTML5 elements tự động map sang ARIA roles, nên không cần thêm role thủ công. Lưu ý: `<header>` chỉ là `banner` khi nằm trực tiếp trong `<body>`, nếu nằm trong `<article>` thì không có landmark role. Khi có nhiều `<nav>`, dùng `aria-label` để phân biệt ("Main navigation", "Footer navigation").

**💡 Interview Signal:**

- ✅ Strong: Knows `<header>/<footer>` only map to `banner/contentinfo` as direct `<body>` children (not inside `<article>`), uses `aria-label` to differentiate multiple same-type landmarks, knows the landmark table from memory
- ❌ Weak: "HTML5 elements have implicit ARIA roles" (true but surface — the context-dependency of `<header>` is the key nuance that shows real depth)

```html
<body>
  <header>
    <!-- implicit role="banner" -->
    <nav aria-label="Main">...</nav>
    <!-- implicit role="navigation" -->
  </header>
  <main>
    <!-- implicit role="main" -->
    <article>
      <header>
        <!-- NO implicit landmark role here -->
        <h2>Article Title</h2>
      </header>
    </article>
    <aside>
      <!-- implicit role="complementary" -->
      <search>
        <!-- role="search" in HTML5.2+ -->
        <input type="search" aria-label="Search site" />
      </search>
    </aside>
  </main>
  <footer>
    <!-- implicit role="contentinfo" -->
    <nav aria-label="Footer">...</nav>
  </footer>
</body>
```

---

### Q: How do you handle images, video, and audio in HTML5? / Xử lý media (hình ảnh, video, audio) trong HTML5 như thế nào? 🟡 Mid

**A:** HTML5 provides native media elements that replaced Flash/plugin dependencies:

**Images**: Use `<picture>` with `<source>` for art direction and format negotiation. Use `srcset` and `sizes` attributes on `<img>` for resolution switching. Always include `alt` text (empty `alt=""` for decorative images). Use `loading="lazy"` for below-fold images and `fetchpriority="high"` for LCP images.

**Video**: The `<video>` element supports multiple sources for format fallback. Use `preload="metadata"` to load only duration/dimensions without downloading the full file. Provide `<track>` elements for captions and subtitles (accessibility requirement).

**Audio**: Similar to video with `<audio>` element and multiple `<source>` elements.

Vietnamese: HTML5 media: Ảnh dùng `<picture>` + `<source>` để serve WebP/AVIF cho browser hỗ trợ, fallback PNG/JPEG. Dùng `srcset` cho responsive images theo resolution. Video dùng `<video>` với `preload="metadata"` để không tải hết file, thêm `<track>` cho subtitle. Quan trọng: luôn có `alt` text cho ảnh, dùng `loading="lazy"` cho ảnh dưới fold.

**💡 Interview Signal:**

- ✅ Strong: Distinguishes `<picture>` (art direction — different images for different breakpoints) vs `srcset` on `<img>` (resolution switching — same image, different sizes), uses `fetchpriority="high"` for LCP images and `loading="lazy"` for below-fold, adds `<track>` for video captions (legal requirement in many countries)
- ❌ Weak: "Use srcset for responsive images" (misses art direction use case, AVIF/WebP format negotiation with `<picture>`, and the LCP optimization with fetchpriority)

```html
<!-- Responsive image with format negotiation -->
<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img
    src="hero.jpg"
    alt="Runner crossing finish line"
    width="1200"
    height="600"
    loading="eager"
    fetchpriority="high"
    decoding="async"
  />
</picture>

<!-- Responsive image with resolution switching -->
<img
  srcset="photo-400w.jpg 400w, photo-800w.jpg 800w, photo-1200w.jpg 1200w"
  sizes="(max-width: 600px) 100vw,
            (max-width: 1024px) 50vw,
            33vw"
  src="photo-800w.jpg"
  alt="Product photo"
  loading="lazy"
/>

<!-- Video with captions -->
<video controls preload="metadata" width="640" height="360">
  <source src="demo.webm" type="video/webm" />
  <source src="demo.mp4" type="video/mp4" />
  <track kind="captions" src="captions-en.vtt" srclang="en" label="English" default />
  <track kind="captions" src="captions-vi.vtt" srclang="vi" label="Tiếng Việt" />
</video>
```

---

### Q: When should you use HTML tables and how to make them accessible? / Khi nào nên dùng table HTML và cách làm accessible? 🟢 Junior

**A:** Tables should be used **only for tabular data** -- data that naturally has rows and columns (e.g., financial data, comparison charts, schedules). Never use tables for page layout (that is what CSS Grid/Flexbox is for).

For accessibility: use `<caption>` to describe the table's purpose, `<thead>`/`<tbody>`/`<tfoot>` for structure, `<th>` with `scope="col"` or `scope="row"` to identify header cells, and `headers` attribute for complex tables with merged cells.

Vietnamese: Table chỉ dùng cho dữ liệu dạng bảng (tài chính, so sánh, lịch trình), không bao giờ dùng cho layout trang. Accessibility: dùng `<caption>` mô tả bảng, `<th scope="col/row">` để screen reader biết header, `<thead>/<tbody>/<tfoot>` cho cấu trúc. Với bảng phức tạp có merged cells, dùng attribute `headers` để liên kết data cell với header cell.

**💡 Interview Signal:**

- ✅ Strong: Immediately says "tables are for tabular data, never for layout", knows `scope="col"` vs `scope="row"` for accessibility, mentions `<caption>` as the table's accessible name
- ❌ Weak: Just mentioning that tables exist for data (everyone knows this — the signal is knowing `scope` attribute and `<caption>` for screen reader support)

```html
<table>
  <caption>
    Q3 2024 Revenue by Region
  </caption>
  <thead>
    <tr>
      <th scope="col">Region</th>
      <th scope="col">Q1</th>
      <th scope="col">Q2</th>
      <th scope="col">Q3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">North America</th>
      <td>$1.2M</td>
      <td>$1.4M</td>
      <td>$1.8M</td>
    </tr>
    <tr>
      <th scope="row">Europe</th>
      <td>$0.8M</td>
      <td>$0.9M</td>
      <td>$1.1M</td>
    </tr>
  </tbody>
</table>
```

---

### Q: What are custom data attributes and when should you use them? / data-\* attributes dùng khi nào? 🟡 Mid

**A:** Custom data attributes (`data-*`) allow you to store arbitrary data on HTML elements. They are accessed in JavaScript via `element.dataset` (e.g., `data-user-id` becomes `element.dataset.userId`) and can be targeted in CSS with attribute selectors (`[data-state="active"]`).

**Good use cases**: storing metadata for JavaScript behavior (component state, configuration), creating hooks for automated testing (`data-testid`), passing data from server-rendered HTML to client-side JS.

**Avoid**: storing sensitive data (visible in DOM), replacing proper ARIA attributes, storing large amounts of data (use a JS data store instead), or using them when a semantic attribute already exists.

Vietnamese: `data-*` cho phép gắn dữ liệu tùy ý lên element. Truy cập qua `element.dataset` trong JS hoặc `[data-*]` selector trong CSS. Nên dùng cho: metadata cho JS behavior, testing hooks (`data-testid`), truyền data từ server HTML sang client JS. Không nên: lưu data nhạy cảm (visible trong DOM), thay thế ARIA attributes, lưu data lớn.

**💡 Interview Signal:**

- ✅ Strong: Knows `data-user-id` becomes `element.dataset.userId` (camelCase conversion), uses `[data-state]` CSS selectors for state-driven styling without JavaScript class manipulation, warns against storing sensitive data (visible in browser DevTools)
- ❌ Weak: "data attributes store custom data on elements" (knows the feature but not the patterns: CSS selector targeting, dataset camelCase, and security considerations)

```html
<!-- Good: component configuration -->
<div class="carousel" data-autoplay="true" data-interval="5000" data-slides-to-show="3">...</div>

<!-- Good: testing hooks -->
<button data-testid="submit-button">Submit</button>

<!-- CSS targeting -->
<style>
  [data-state="loading"] {
    opacity: 0.5;
    pointer-events: none;
  }
  [data-state="error"] {
    border-color: red;
  }
</style>
```

```js
const carousel = document.querySelector(".carousel");
const autoplay = carousel.dataset.autoplay === "true"; // boolean
const interval = parseInt(carousel.dataset.interval); // 5000
const slidesToShow = parseInt(carousel.dataset.slidesToShow); // 3
```

---

### Q: Explain script loading strategies: async, defer, and module / So sánh async, defer, và module khi load script 🔴 Senior

**A:** Script loading strategies control how JavaScript files are fetched and executed relative to HTML parsing:

- **No attribute** (`<script src="...">`) -- blocks HTML parsing while script is fetched and executed. Worst for performance.
- **`async`** -- script is fetched in parallel with HTML parsing, then **executes immediately** when downloaded (pausing parsing). Execution order is **not guaranteed**. Best for independent scripts (analytics, ads).
- **`defer`** -- script is fetched in parallel with HTML parsing, then **executes after parsing completes** but **before `DOMContentLoaded`**. Execution order is **guaranteed** (in document order). Best for scripts that depend on DOM or each other.
- **`type="module"`** -- behaves like `defer` by default. Also enables ES module syntax (`import`/`export`), strict mode, and CORS. Module scripts are only executed once even if referenced multiple times.

Vietnamese: Chiến lược load script ảnh hưởng lớn đến performance. Không attribute: block parsing (tệ nhất). `async`: tải song song, chạy ngay khi xong (không đảm bảo thứ tự) -- dùng cho analytics. `defer`: tải song song, chạy sau khi parse xong HTML, đảm bảo thứ tự -- dùng cho hầu hết scripts. `type="module"`: giống defer + hỗ trợ ES modules. Trong production, hầu hết script nên dùng `defer`.

**💡 Interview Signal:**

- ✅ Strong: Explains async execution order is non-deterministic (dangerous for dependent scripts), knows `defer` executes after HTML parsing but before `DOMContentLoaded`, and that `type="module"` auto-defers + adds CORS/strict mode
- ❌ Weak: "Use async or defer to avoid blocking" (knows the concept but not when to choose which — the key is async for independent scripts, defer for ordered execution)

```
Regular <script>:     HTML parsing ──|BLOCKED (fetch)──|BLOCKED (exec)──| parsing
async:                HTML parsing ──────────────────|exec|──────────── parsing
                                     (fetch in parallel) ↗
defer:                HTML parsing ────────────────────────────────────| exec |
                                     (fetch in parallel)               ↗
module:               Same as defer + ES module features
```

```html
<head>
  <!-- Critical: inline or preloaded -->
  <script>
    /* inline critical JS */
  </script>

  <!-- Main app: defer to maintain order -->
  <script defer src="/vendor.js"></script>
  <script defer src="/app.js"></script>

  <!-- Independent: async since no dependencies -->
  <script async src="https://analytics.example.com/track.js"></script>

  <!-- ES Module -->
  <script type="module" src="/components/header.js"></script>
</head>
```

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                                           | Difficulty | Core Concept    | Key Signal                                                                 |
| --- | ------------------------------------------------- | ---------- | --------------- | -------------------------------------------------------------------------- |
| 1   | Semantic HTML là gì và tại sao quan trọng?        | 🟢         | Semantic HTML   | section vs article vs div, a11y impact                                     |
| 2   | Document outline và heading hierarchy?            | 🟡         | HTML structure  | HTML5 outline algorithm never implemented                                  |
| 3   | HTML5 form features giảm JavaScript thế nào?      | 🟢         | Forms           | novalidate + Constraint Validation API                                     |
| 4   | Native form validation vs custom validation?      | 🟡         | Form validation | validity object flags, setCustomValidity('')                               |
| 5   | ARIA là gì và khi nào nên dùng?                   | 🟡         | Accessibility   | Rule 1: prefer native HTML; ARIA adds semantics not behavior               |
| 6   | Tối ưu SEO bằng HTML như thế nào?                 | 🔴         | SEO             | Canonical URL, JSON-LD, hreflang, fetchpriority                            |
| 7   | Meta tags nào là thiết yếu?                       | 🟢         | Meta tags       | charset within 1024 bytes, viewport prevents zoom                          |
| 8   | ARIA landmarks tương ứng với HTML5 elements?      | 🟡         | ARIA landmarks  | header/footer only landmark as direct body children                        |
| 9   | Xử lý media (hình ảnh, video, audio) trong HTML5? | 🟡         | Media elements  | picture (art direction) vs srcset (resolution switching)                   |
| 10  | Khi nào dùng table HTML và cách làm accessible?   | 🟢         | Tables          | scope="col/row", caption as accessible name                                |
| 11  | data-\* attributes dùng khi nào?                  | 🟡         | Data attributes | dataset camelCase, CSS [data-*] selectors                                  |
| 12  | So sánh async, defer, và module?                  | 🔴         | Script loading  | async = non-deterministic; defer = ordered after parse; module = defer+ESM |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"I added 5 `<script>` tags in `<head>` and the page is slow to load. How do you fix it?"**

**30 giây đầu — mở đầu lý tưởng:**

1. "Scripts in `<head>` without `defer` or `async` block HTML parsing — the browser stops building the DOM until each script is fetched and executed."
2. "The fix: add `defer` to all scripts that need the DOM or depend on each other — they'll download in parallel with parsing and execute in order after parsing completes."
3. "For truly independent scripts like analytics, use `async` — but NOT for scripts that depend on each other, since async execution order is non-deterministic."
4. "Modern bundlers output `type='module'` which defers by default, so this is mostly a legacy issue — but the `defer` mental model is still important for any third-party scripts you inject."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                                    |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 🔍 Retrieval   | Viết từ trí nhớ sự khác biệt giữa `async` và `defer` — thứ tự execution, khi nào nên dùng cái nào — không nhìn lại.                        |
| 2   | 🎨 Visual      | Vẽ timeline HTML parsing cho 3 trường hợp: `<script>` thường, `async`, và `defer` — chỉ rõ khi nào parsing bị block.                       |
| 3   | 🛠️ Application | Form với `<input type="email" required>` — khi user submit email không hợp lệ, validation chạy hay không? Làm sao để custom error message? |
| 4   | 🐛 Debug       | `<header role="banner">` — `role="banner"` có cần thiết không? Khi nào thì `<header>` KHÔNG tự động là landmark `banner`?                  |
| 5   | 🎓 Teach       | Giải thích sự khác biệt giữa `<section>` và `<div>` cho một junior developer bằng một câu liên tưởng cụ thể.                               |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `async`: tải song song, chạy ngay khi tải xong (có thể trước DOMContentLoaded, không đảm bảo thứ tự); `defer`: tải song song, chạy sau khi HTML parse xong, trước DOMContentLoaded, theo đúng thứ tự trong HTML.   |
| 2   | `<script>` thường: block parse ngay lập tức; `async`: download song song, parse tiếp tục, block ngắn khi chạy script; `defer`: download song song, parse không bị block, chạy sau khi toàn bộ HTML parse xong.     |
| 3   | Browser tự chạy HTML5 constraint validation khi submit; dùng `setCustomValidity("message")` và `reportValidity()` để custom error message, hoặc CSS `:invalid` để style.                                           |
| 4   | `role="banner"` KHÔNG cần nếu `<header>` là con trực tiếp của `<body>` (tự động là banner landmark); CẦN khi `<header>` nằm trong `<article>`, `<section>`, `<aside>`, `<nav>` — lúc đó không tự động là landmark. |
| 5   | `<section>` là landmark có ngữ nghĩa (screen reader đọc như chapter/region); `<div>` là container thuần túy không có semantic meaning — như ngăn kéo có nhãn vs hộp carton trống.                                  |

> 🎯 **Feynman Prompt:** Giải thích tại sao "semantic HTML" quan trọng. Dùng ví dụ về người mù đang dùng screen reader navigate trang web của bạn.

🔁 **Spaced Repetition reminder:** Review file này lại sau 3 ngày, sau đó 7 ngày, sau đó 14 ngày.

---

## Connections / Liên Kết

- ⬅️ **Built on:** Hiểu biết cơ bản về web browser (DOM, request/response) — không cần file cụ thể, đây là điểm khởi đầu
- ➡️ **Enables:** [CSS Fundamentals](./00-css-fundamentals.md) — cần HTML structure để apply CSS
- 🔗 **Related:** [Web Accessibility (a11y)](../07-web-security/) | ARIA roles | Screen reader testing
