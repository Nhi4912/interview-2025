# Polyfills and Transpilation Strategy / Chiến Lược Polyfill và Transpile

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md) · [JavaScript README](./README.md) · [Modern JavaScript Features](./22-modern-javascript-features.md) · [Bundle Optimization](../06-browser-performance/03-bundle-optimization.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Tháng 6 năm 2024. Domain `cdn.polyfill.io` — một CDN polyfill "tiện lợi" được dùng bởi hàng trăm nghìn website — **bị bán cho một bên thứ ba không rõ danh tính**. Trong vòng vài giờ, script inject malicious code nhắm vào mobile users, redirecting sang các trang lừa đảo. **~100,000 trang web bị ảnh hưởng trực tiếp** — bao gồm cả nhiều trang chính phủ Anh và các trang thương mại điện tử lớn.

Câu hỏi phỏng vấn từ incident này:

_"Tại sao `polyfill.io` có thể gây ra supply-chain attack nghiêm trọng đến vậy?"_

Câu trả lời không phải chỉ là "vì nó bị hack". Câu trả lời là: **kiến trúc phụ thuộc vào một external CDN cho runtime JS** là anti-pattern về bảo mật. Khi bạn `<script src="https://cdn.polyfill.io/v3/polyfill.min.js">`, bạn đang trao quyền thực thi JavaScript tùy ý trên domain của bạn cho một bên thứ ba — và không có SRI hash nào có thể bảo vệ bạn nếu CDN origin bị compromise.

Sau sự kiện này, cộng đồng chuyển sang **bundler-managed polyfills**: polyfill được bundle vào code của bạn tại build time, không load từ CDN lúc runtime.

Nhưng còn một vấn đề khác — một câu hỏi bạn có thể sẽ bị hỏi:

> _"Bundle của bạn nặng 400KB và 60% là polyfill mà user không cần. Tại sao xảy ra và bạn debug như thế nào?"_

Câu trả lời đúng bắt đầu từ hiểu rõ: **polyfill là gì, transpile là gì, browserslist đang nói gì, và core-js đang làm gì trong bundle của bạn**.

---

## What & Why / Cái Gì & Tại Sao

### Polyfill vs Transpilation vs Shim / Ba Khái Niệm Cốt Lõi

Ba thuật ngữ này thường bị dùng lẫn lộn. Trong interview, phân biệt được ba cái này là **Mid-level signal**.

---

**Polyfill** = Runtime implementation của một **API** mà browser thiếu.

```js
// Polyfill cho Array.prototype.flat (ES2019)
// Nếu browser không có .flat(), ta tự implement
if (!Array.prototype.flat) {
  Array.prototype.flat = function (depth = 1) {
    return depth > 0
      ? this.reduce((acc, val) => acc.concat(Array.isArray(val) ? val.flat(depth - 1) : val), [])
      : this.slice();
  };
}

// Sau khi polyfill chạy, code này hoạt động ở MỌI browser:
[1, [2, [3]]].flat(2); // [1, 2, 3]
```

Polyfill **chạy lúc runtime**, thêm API vào environment. Nếu browser đã có API đó, polyfill không làm gì (hoặc bị skip).

---

**Transpilation** = Compile **syntax** mới sang syntax cũ hơn tại **build time**.

```js
// Source code: async/await (ES2017)
async function fetchUser(id) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

// Sau khi Babel transpile sang ES5 (generator-based):
function fetchUser(id) {
  return _asyncToGenerator(function* () {
    const res = yield fetch(`/api/users/${id}`);
    return res.json();
  })();
}
```

Transpiler không chạy lúc runtime — nó **thay đổi code trước khi ship**. `async/await` → generators → callbacks là ví dụ cổ điển.

---

**Shim** = Thin compatibility layer thay đổi **behavior** của một API để match với spec mới, không nhất thiết tạo ra API hoàn toàn mới.

```js
// Shim cho Custom Elements (Web Components)
// Không tạo ra CustomElementRegistry từ đầu,
// mà wrap native API để normalize behavior khác nhau giữa browsers
(function () {
  const originalDefine = customElements.define.bind(customElements);
  customElements.define = function (name, constructor, options) {
    // Normalize options, add missing lifecycle callbacks
    return originalDefine(name, constructor, options);
  };
})();
```

Shim khác polyfill ở chỗ: polyfill thêm API **không tồn tại**, shim **sửa/chuẩn hóa** API đã tồn tại nhưng hành xử sai.

---

**Bảng so sánh nhanh:**

| Khái niệm | Khi nào chạy | Thêm gì                 | Ví dụ                             |
| --------- | ------------ | ----------------------- | --------------------------------- |
| Polyfill  | Runtime      | API thiếu               | `Array.prototype.flat`, `Promise` |
| Transpile | Build time   | Thay syntax             | `async/await` → generators        |
| Shim      | Runtime      | Fix behavior API có sẵn | Custom Elements normalization     |

> 🇻🇳 **Tóm tắt**: Polyfill = thêm API bị thiếu lúc runtime. Transpile = đổi syntax lúc build time. Shim = chuẩn hóa behavior API hiện có. Ba thứ khác nhau — đừng dùng lẫn lộn trong interview.

---

## Concept Map / Bản Đồ Khái Niệm

```
POLYFILL & TRANSPILATION PIPELINE
═══════════════════════════════════════════════════════════════

  Source Code (.ts / .js)
       │
       │  ① Syntax Check
       ▼
  ┌─────────────────┐
  │   TypeScript    │  Strips types, validates
  │   Compiler      │  (tsc / tsgo)
  └────────┬────────┘
           │
           │  ② Syntax Transpilation (NEW syntax → OLD syntax)
           ▼
  ┌─────────────────────────────────────────┐
  │   Babel / SWC / esbuild                 │
  │                                         │
  │   Input:  async/await, optional chain,  │
  │           class fields, nullish coalesce│
  │                                         │
  │   Output: ES5/ES2015/ES2020 depending   │
  │           on build.target or preset-env │
  │                                         │
  │   ← browserslist drives target ──────── │
  └────────────┬────────────────────────────┘
               │
               │  ③ API Polyfill Injection (MISSING APIs → added)
               ▼
  ┌─────────────────────────────────────────┐
  │   core-js v3                            │
  │                                         │
  │   useBuiltIns: 'usage' → scans your     │
  │   code, injects only what you use       │
  │                                         │
  │   useBuiltIns: 'entry' → injects ALL    │
  │   polyfills for your browserslist target│
  │                                         │
  │   ← browserslist drives target ──────── │
  └────────────┬────────────────────────────┘
               │
               │  ④ Bundle
               ▼
  ┌─────────────────────────────────────────┐
  │   Bundler (Vite / webpack / Rollup)     │
  │                                         │
  │   Tree-shakes unused core-js modules    │
  │   Minifies output                       │
  │   Splits chunks                         │
  └────────────┬────────────────────────────┘
               │
               │  ⑤ CSS Polyfills (PostCSS pipeline runs in parallel)
               ▼
  ┌─────────────────────────────────────────┐
  │   PostCSS                               │
  │   ├── autoprefixer (vendor prefixes)    │
  │   ├── postcss-preset-env (modern CSS)   │
  │   └── browserslist → drives prefixes    │
  └─────────────────────────────────────────┘
               │
               ▼
  dist/ output — served to browser

═══════════════════════════════════════════════════════════════
Key: browserslist is the SINGLE SOURCE OF TRUTH for all tools.
     Change .browserslistrc → all tools recalibrate automatically.
```

> 🇻🇳 **Tóm tắt**: Pipeline gồm 5 bước: TypeScript → syntax transpile (Babel/SWC) → API polyfill (core-js) → bundle → CSS polyfill (PostCSS). `browserslist` điều khiển cả bước 2, 3, và 5.

---

## Part 1: Baseline 2024 / Trạng Thái Web Platform

### What is Baseline? / Baseline là gì?

[web.dev/baseline](https://web.dev/baseline) là initiative của Google, Apple, Mozilla, và Microsoft để định nghĩa **khi nào một tính năng web đủ widely supported** để dùng an toàn mà không cần polyfill.

Có hai tầng:

| Level                         | Nghĩa                                                      | Hành động                                            |
| ----------------------------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| **Baseline Newly Available**  | Supported trong tất cả major browsers phiên bản mới nhất   | Có thể dùng — nhưng users trên older release chưa có |
| **Baseline Widely Available** | Supported >= 30 tháng (2.5 năm) trên tất cả major browsers | Dùng tự do, không cần polyfill cho > 95% users       |

### APIs đạt Baseline Widely Available vào cuối 2024 (không cần polyfill nữa):

```
CSS Container Queries         — Chrome 105, Safari 16, Firefox 110 → Widely Available 2024
CSS :has() selector           — Chrome 105, Safari 15.4, Firefox 121 → Widely Available late 2024
CSS @layer (cascade layers)   — Chrome 99, Safari 15.4, Firefox 97 → Widely Available 2024
CSS nesting (native)          — Chrome 112, Safari 17.2, Firefox 117 → Newly Available 2024
Array.prototype.at()          — Chrome 92, Safari 15.4, Firefox 90 → Widely Available 2024
structuredClone()             — Chrome 98, Safari 15.4, Firefox 94 → Widely Available 2024
Object.hasOwn()               — Chrome 93, Safari 15.4, Firefox 92 → Widely Available 2024
Error.cause                   — Chrome 93, Safari 15.4, Firefox 91 → Widely Available 2024
```

### APIs đạt Baseline Newly Available 2024 (dùng được nhưng chú ý older releases):

```
Set methods (union, intersection, difference)  — Chrome 122, Safari 17, Firefox 127
Promise.withResolvers()                        — Chrome 119, Safari 17.4, Firefox 121
Temporal (partial) — KHÔNG — còn stage 3, chưa ship
```

### Ý nghĩa thực tế trong 2025–2026:

Nếu bạn target `defaults` trong browserslist (tức là > 0.5% + not dead), rất nhiều polyfill bạn đang ship là **lãng phí**. Ví dụ:

- `Promise.allSettled` → Baseline Widely Available từ 2020 — không cần polyfill nếu target modern browsers
- `Array.prototype.flat` → Baseline từ 2019 — không cần polyfill cho bất kỳ browser được support nào
- `CSS Container Queries` → Widely Available 2024 — không cần PostCSS polyfill nếu target browsers sau Q1 2023

> 🇻🇳 **Tóm tắt**: Baseline là signal quan trọng nhất để quyết định có cần polyfill không. "Baseline Widely Available" = dùng tự do, không polyfill. "Newly Available" = dùng được nhưng check target của bạn. Xem web.dev/baseline trước khi thêm polyfill bất kỳ feature nào.

---

## Part 2: browserslist — Nguồn Sự Thật Duy Nhất

### What is browserslist? / browserslist là gì?

`browserslist` là một query language để define **tập hợp browsers** bạn muốn support. Nó được đọc bởi:

- **Babel** (via `@babel/preset-env`) — quyết định syntax nào cần transpile
- **core-js** (via `useBuiltIns`) — quyết định API nào cần polyfill
- **Autoprefixer** — quyết định vendor prefix CSS nào cần thêm
- **postcss-preset-env** — quyết định CSS transforms nào cần apply
- **Vite** (`build.target`) — ảnh hưởng gián tiếp
- **ESLint** (eslint-plugin-compat) — warn về API không supported

Tất cả tools đọc cùng một config file: `.browserslistrc` hoặc `package.json → "browserslist"` field.

### Real `.browserslistrc` examples:

```ini
# .browserslistrc — Production app targeting modern users (recommended 2025)
[production]
defaults
not IE 11
not dead
> 0.5%

[development]
last 2 chrome versions
last 2 firefox versions
```

```ini
# .browserslistrc — Aggressive modern (Baseline Widely Available focus)
last 2 years
not dead
```

```ini
# .browserslistrc — Legacy enterprise intranet (still supporting old IE-based systems)
> 1%
last 4 versions
IE 11
not dead
```

```ini
# .browserslistrc — Mobile-first (targeting Southeast Asia market)
> 0.5% in VN
last 2 versions
not dead
```

### Queries phổ biến và ý nghĩa:

| Query                    | Nghĩa                                            |
| ------------------------ | ------------------------------------------------ |
| `defaults`               | `> 0.5%, last 2 versions, Firefox ESR, not dead` |
| `> 0.5%`                 | Browsers với > 0.5% global usage share           |
| `last 2 versions`        | 2 phiên bản mới nhất của mỗi browser             |
| `not dead`               | Loại browsers không còn được vendor support      |
| `last 2 chrome versions` | Chỉ 2 Chrome versions mới nhất                   |
| `> 1% in VN`             | Browsers > 1% usage ở Việt Nam                   |

### Debug command:

```bash
# Xem danh sách browsers cụ thể browserslist target của bạn
npx browserslist

# Output ví dụ cho 'defaults':
# chrome 124, chrome 123, edge 124, firefox 125, firefox esr 115,
# ios_saf 17.4, ios_saf 17.0-17.3, safari 17.4, safari 17.0,
# samsung 24, samsung 23, ...

# Xem cho một query cụ thể:
npx browserslist "last 2 years, not dead"
```

> 🇻🇳 **Tóm tắt**: `.browserslistrc` là single source of truth cho tất cả tools. Thay đổi một file, Babel + Autoprefixer + core-js + PostCSS đều recalibrate. Dùng `npx browserslist` để verify chính xác browsers nào đang được target.

---

## Part 3: core-js v3 Strategy

### What is core-js? / core-js là gì?

`core-js` là thư viện polyfill JavaScript chuẩn nhất — cover hầu hết ES2015+ APIs, từ `Promise` đến `Array.prototype.at` đến `structuredClone`. Được dùng bởi Babel, và được maintain bởi Denis Pushkarev.

### Hai modes: `entry` vs `usage`

**`useBuiltIns: 'entry'`** — Import toàn bộ polyfill cần thiết cho browserslist target của bạn:

```js
// babel.config.js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: 3,
        targets: ".browserslistrc",
      },
    ],
  ],
};
```

```js
// Trong entry file của bạn (index.js), bạn phải import:
import "core-js/stable";
import "regenerator-runtime/runtime";
// Babel sẽ replace dòng này bằng hàng trăm import cụ thể
// dựa trên browserslist target — BẤT KỂ bạn có dùng feature đó không
```

**Kết quả**: Bundle chứa TẤT CẢ polyfills cho target browsers, kể cả những API bạn không dùng. Với `defaults` target, đây có thể là **120KB+ core-js** trong bundle.

---

**`useBuiltIns: 'usage'`** — Babel scan code của bạn và chỉ inject polyfill cho APIs bạn thực sự dùng:

```js
// babel.config.js (recommended)
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage", // ← key change
        corejs: {
          version: 3,
          proposals: false, // chỉ ship/stable proposals
        },
        targets: ".browserslistrc",
      },
    ],
  ],
};
```

```js
// Source code:
const result = [1, [2, 3]].flat();
const users = await Promise.allSettled([fetch("/a"), fetch("/b")]);

// Babel output (nếu target browser thiếu .flat và .allSettled):
import "core-js/modules/es.array.flat.js";
import "core-js/modules/es.promise.all-settled.js";

const result = [1, [2, 3]].flat();
const users = await Promise.allSettled([fetch("/a"), fetch("/b")]);
```

Chỉ inject những gì code của bạn dùng VÀ target browser thiếu — không gì hơn.

### Tại sao bundle có thể explode với `entry` mode?

```
Target: 'defaults' (includes Safari 16.0, Chrome 100, Firefox 105, ...)

useBuiltIns: 'entry' bundle:
  core-js complete polyfill set for defaults: ~120KB (unminified: ~400KB)
  + regenerator-runtime: ~24KB

useBuiltIns: 'usage' bundle (real app using ~15 ES2022+ features):
  core-js selective imports: ~8–15KB
  + regenerator-runtime (if async/await used): ~24KB

Difference: 120KB → 8KB = 93% reduction
```

### Anti-pattern: `entry` mode tanpa version pinning

```js
// ❌ WRONG — corejs version tidak di-pin
{
  useBuiltIns: "entry",
  corejs: 3  // này sẽ dùng patch version bất kỳ của corejs@3
}

// ✅ CORRECT — pin exact minor version
{
  useBuiltIns: "entry",
  corejs: { version: "3.37", proposals: false }
}
```

Nếu không pin version, upgrade `core-js` minor có thể change behavior. Pin `3.X` để reproducible builds.

> 🇻🇳 **Tóm tắt**: Dùng `useBuiltIns: 'usage'` (không phải `'entry'`) để Babel chỉ inject polyfill cho APIs bạn thực sự dùng. Pin `corejs: { version: "3.37" }`. Kết quả: bundle nhỏ hơn 90%+ so với `'entry'` mode.

---

## Part 4: The polyfill.io Incident / Sự Cố polyfill.io 2024

### Timeline của supply-chain attack:

```
Feb 2024 — cdn.polyfill.io domain được bán cho Funnull, một công ty Trung Quốc
           (theo báo cáo của Sansec và Andrew Betts — người tạo ra polyfill.io ban đầu)

June 25, 2024 — Sansec phát hiện domain đang serve malicious JavaScript:
   - Chỉ inject code cho MOBILE users (để tránh detection)
   - Fake Google Analytics overlay
   - Redirect sang trang cờ bạc và người lớn
   - Code obfuscated để tránh detection

Scope: ~100,000 websites bị ảnh hưởng
       Bao gồm: UK government sites, JSTOR, Warner Bros., Hulu, và nhiều trang VN

June 26, 2024 — Cloudflare, Fastly ra mirror sạch
               Namecheap tắt domain cdn.polyfill.io
               Andrew Betts (creator) tweet cảnh báo toàn cộng đồng
```

### Tại sao hosted CDN polyfill là kiến trúc nguy hiểm:

```html
<!-- Pattern này là anti-pattern về security: -->
<script src="https://cdn.polyfill.io/v3/polyfill.min.js?features=es6,fetch"></script>

<!-- Vấn đề:
  1. Bạn không kiểm soát nội dung của URL này
  2. Nếu có SRI hash → khi CDN thay đổi file, tag bị broken (không load)
  3. Nếu không có SRI hash → bất kỳ content nào cũng được execute
  4. CDN bị compromise → mọi visitor của bạn bị attack
  5. Không có audit trail trong git của bạn
-->
```

**SRI hash không giải quyết vấn đề**: Vì content polyfill.io thay đổi theo user agent, bạn không thể hash một response cố định.

### Giải pháp đúng — Bundler-managed polyfills:

```js
// ✅ Polyfills được bundle vào code của bạn tại build time
// Không có runtime external dependency

// babel.config.js
module.exports = {
  presets: [
    ["@babel/preset-env", {
      useBuiltIns: "usage",
      corejs: { version: "3.37", proposals: false },
    }],
  ],
};

// package.json
{
  "dependencies": {
    "core-js": "3.37.1"  // pinned, audited, in your supply chain
  }
}
```

### Nếu bạn vẫn muốn CDN delivery:

Fastly và Cloudflare đã ra các mirrors sạch:

```html
<!-- Fastly mirror (verified, open source) -->
<script src="https://polyfill-fastly.net/v3/polyfill.min.js"></script>

<!-- Cloudflare mirror -->
<script src="https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js"></script>
```

Nhưng lời khuyên tốt nhất trong 2025–2026: **đừng dùng hosted polyfill CDN bất kỳ**. Bundle nó.

> 🇻🇳 **Tóm tắt**: Incident polyfill.io (June 2024) = ~100K sites bị inject malicious code do domain bị bán. Hosted CDN polyfill = anti-pattern bảo mật vì bạn không control content. Giải pháp: dùng `core-js` + Babel, bundle polyfill vào code của bạn. Đây là câu hỏi top trong interview 2026.

---

## Part 5: Modern Toolchain — SWC + esbuild Reality

### Vite không dùng Babel theo default:

Kể từ Vite 2.x, **Vite dùng esbuild** cho transpilation (không phải Babel). Điều này thay đổi polyfill story đáng kể.

```js
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // esbuild target — quyết định syntax transpilation
    // KHÔNG inject polyfills — chỉ transpile syntax
    target: "es2020",
    // hoặc array:
    // target: ['chrome90', 'firefox88', 'safari14', 'edge90']
  },
});
```

**Quan trọng**: `build.target` trong Vite/esbuild điều khiển **syntax transpilation** (như `??=` hay `?.`), KHÔNG inject API polyfills. Nếu bạn dùng `Array.prototype.at()` và target Safari 14 (không có `.at()`), Vite/esbuild **không tự polyfill**.

### Vite polyfill story thực tế:

```bash
# Plugin phổ biến nhất cho polyfills trong Vite
npm install -D vite-plugin-legacy
```

```js
// vite.config.ts
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"],
      // Tự động inject core-js polyfills cho legacy browsers
      // Tạo ra hai bundles: modern + legacy (nomodule fallback)
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
  ],
});
```

### Next.js và SWC:

Next.js 12+ dùng **SWC** (Rust-based compiler) thay Babel theo default:

```json
// next.config.js
{
  "swcMinify": true, // SWC minifier (default true từ Next.js 13)
  "compiler": {
    // SWC transforms
    "removeConsole": { "exclude": ["error"] }
  }
}
```

**Next.js polyfill policy**:

- Next.js **tự động polyfill** một số APIs quan trọng: `fetch`, `URL`, `Object.assign`, `Promise`
- Danh sách đầy đủ: [nextjs.org/docs/basic-features/supported-browsers-and-features](https://nextjs.org/docs/basic-features/supported-browsers-and-features)
- Custom polyfills: import trong `pages/_app.js` hoặc `app/layout.tsx`

```js
// app/layout.tsx — custom polyfills trong Next.js
// Import trực tiếp, không dùng polyfill.io CDN
import "core-js/features/array/at"; // nếu cần specific polyfill
```

### esbuild polyfill story — nó không polyfill:

esbuild là **syntax transpiler**, không phải polyfill injector. Nó hạ syntax xuống nhưng **không thêm missing APIs**.

```bash
# esbuild sẽ transpile syntax nhưng KHÔNG polyfill Array.at()
esbuild app.js --target=chrome80 --bundle

# Kết quả: optional chaining ?. được transpile, nhưng Array.prototype.at
# không được inject → runtime error trên Chrome 80
```

> 🇻🇳 **Tóm tắt**: Vite/esbuild chỉ transpile SYNTAX, không inject API polyfills. Nếu cần polyfills trong Vite project, dùng `@vitejs/plugin-legacy`. Next.js tự polyfill một số APIs cơ bản qua SWC pipeline. Hiểu ranh giới này là Senior signal.

---

## Part 6: The module / nomodule Pattern

### Cơ chế hoạt động:

```html
<!-- Modern bundle — chỉ browsers hiểu ES modules mới download -->
<script type="module" src="/dist/app.modern.js"></script>

<!-- Legacy bundle — IE11 và old browsers -->
<!-- Browsers hiểu `type="module"` sẽ BỎ QUA tag này -->
<script nomodule src="/dist/app.legacy.js"></script>
```

Pattern này cho phép **differential serving**: modern browsers nhận bundle nhỏ không có polyfills không cần thiết, legacy browsers nhận bundle đầy đủ.

### Trạng thái năm 2026:

Câu hỏi interview thực tế: _"module/nomodule pattern có còn cần thiết không?"_

**Trả lời ngắn**: Gần như không, cho public-facing apps.

- **IE11 EOL**: Microsoft chính thức kết thúc support IE11 vào tháng 6/2022. Market share < 0.5% globally.
- **All baseline browsers support ES modules**: Chrome, Firefox, Safari, Edge — tất cả support `type="module"`.
- **caniuse.com/es6-module**: 97.5%+ global support.

**Khi nào vẫn còn relevant**:

- **Intranet apps** với locked-down Windows environments vẫn chạy IE11
- **Kiosk/embedded** displays với browser bị freeze ở phiên bản cũ
- **Southeast Asian markets** với legacy Android browsers (UC Browser, Samsung Browser phiên bản cũ)
- **Government/banking apps** ở Việt Nam với strict compliance browsers

```js
// @vitejs/plugin-legacy tự động generate module/nomodule pattern:
// dist/
//   assets/index-[hash].js          ← modern (type="module")
//   assets/index-legacy-[hash].js   ← legacy (nomodule)
//   assets/polyfills-legacy-[hash].js
```

> 🇻🇳 **Tóm tắt**: module/nomodule pattern gần như không cần thiết cho public apps 2026 (IE11 chết, tất cả baseline browsers support modules). Vẫn relevant cho intranet/kiosk/legacy Android. Plugin `@vitejs/plugin-legacy` tự handle nếu bạn cần.

---

## Part 7: CSS Polyfills via PostCSS

### Autoprefixer — Vendor Prefix Automation:

```css
/* Source CSS */
.box {
  display: grid;
  user-select: none;
  backdrop-filter: blur(10px);
}

/* Autoprefixer output (cho target: Safari 13) */
.box {
  display: -ms-grid;
  display: grid;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
```

```js
// postcss.config.js
module.exports = {
  plugins: [
    require("autoprefixer"),
    // autoprefixer đọc .browserslistrc tự động
  ],
};
```

### postcss-preset-env — CSS Features Polyfill:

```css
/* Source: modern CSS (stage 3+) */
:root {
  --primary: oklch(60% 0.2 250);
}

.card {
  color: color(display-p3 0.2 0.5 0.8);
  background: oklch(95% 0.05 250);
}

/* postcss-preset-env transform (cho older browsers) */
:root {
  --primary: #5580c0; /* fallback hex */
}

.card {
  color: rgb(39, 120, 202); /* fallback rgb */
  color: color(display-p3 0.2 0.5 0.8);
  background: rgb(228, 236, 248); /* fallback */
  background: oklch(95% 0.05 250);
}
```

```js
// postcss.config.js
module.exports = {
  plugins: [
    require("postcss-preset-env")({
      stage: 3, // include features at stage 3+ of CSS proposal process
      features: {
        "nesting-rules": true, // CSS nesting (native nesting)
        "custom-media-queries": true, // @custom-media
        "oklab-function": true, // oklch/oklab colors
      },
    }),
    require("autoprefixer"),
  ],
};
```

### CSS Polyfill decision: khi nào polyfill, khi nào graceful degradation?

| CSS Feature              | Baseline Status 2024       | Approach                                       |
| ------------------------ | -------------------------- | ---------------------------------------------- |
| CSS Grid                 | Widely Available 2018      | Không cần polyfill                             |
| CSS Variables            | Widely Available 2017      | Không cần polyfill                             |
| Container Queries        | Widely Available 2024      | Không cần polyfill nếu target modern           |
| `:has()` selector        | Widely Available late 2024 | postcss-preset-env nếu cần older support       |
| CSS Nesting (native)     | Newly Available 2024       | postcss-preset-env stage:3 cho older Safari    |
| `@layer` cascade         | Widely Available 2023      | postcss-preset-env cho Safari < 15.4           |
| `color-mix()`            | Newly Available 2023       | Graceful degradation hoặc fallback variable    |
| `oklch()`                | Newly Available 2023       | postcss-preset-env với fallback                |
| Scroll-driven animations | Newly Available 2024       | Graceful degradation — JS fallback too complex |

**Rule of thumb**: Nếu CSS feature là **purely visual enhancement** và browser không support chỉ hiển thị khác một chút → graceful degradation. Nếu feature là **functional requirement** (như `:has()` driving layout logic) → polyfill.

> 🇻🇳 **Tóm tắt**: Autoprefixer tự động add vendor prefixes. `postcss-preset-env` polyfill CSS features mới. Nhưng không phải mọi CSS feature đều cần polyfill — nếu chỉ là visual enhancement, graceful degradation (không có feature = vẫn OK nhìn) thường tốt hơn ship JS/CSS overhead.

---

## Part 8: Web Components Polyfills

### `@webcomponents/webcomponentsjs` — Legacy polyfill:

```html
<!-- Chỉ cần cho browsers không support Web Components -->
<!-- 2025: Custom Elements, Shadow DOM, templates supported in all major browsers -->
<script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
```

**Status 2025**: Web Components (Custom Elements v1, Shadow DOM v1, HTML Templates, ES Modules) đều **Baseline Widely Available**. `@webcomponents/webcomponentsjs` chỉ cần cho:

- IE11 (EOL 2022 — không cần nữa trừ legacy intranet)
- Very old Safari (< 12.1)
- Android Chrome < 67

### ElementInternals polyfill (vẫn còn relevant):

`ElementInternals` cho phép custom elements participate trong form validation. Safari 16.0 mới ship — tức là Safari 15.x trở xuống không có.

```bash
npm install element-internals-polyfill
```

```js
// Trong custom element project targeting Safari 15:
import "element-internals-polyfill";
```

**Target audience**: Teams build Web Component libraries cần support Safari 15 (phổ biến tại doanh nghiệp dùng macOS Monterey với Safari pinned).

> 🇻🇳 **Tóm tắt**: Web Components polyfills phần lớn không cần nữa (2025). Custom Elements, Shadow DOM, Templates đều Baseline. Ngoại lệ: `ElementInternals` polyfill nếu target Safari 15.x. `@webcomponents/webcomponentsjs` chỉ cần cho legacy IE11/Android.

---

## Part 9: Polyfill Loading Strategies

### Bốn chiến lược và tradeoffs:

**Strategy 1: Bundled (recommended cho most cases)**

```js
// Polyfill được bundle vào app bundle tại build time
// Babel/core-js handle tự động với useBuiltIns: 'usage'

// Pros: No extra network round-trip, always available before code runs
// Cons: Increases bundle size for all users (kể cả modern browsers)
```

**Strategy 2: Feature Detection + Conditional Import**

```js
// Inline detection — load polyfill only if needed
if (!Array.prototype.at) {
  import("core-js/features/array/at").then(() => {
    // Now safe to use Array.prototype.at
    console.log([1, 2, 3].at(-1)); // 3
  });
}

// Pros: Modern browsers tải zero polyfill bytes
// Cons: Code complexity, potential FOUC/delay for legacy users
```

**Strategy 3: Polyfill.io-style Dynamic CDN (NOT recommended 2026)**

```html
<!-- ❌ Tránh pattern này sau incident 2024 -->
<script src="https://cdn.polyfill.io/v3/polyfill.min.js?features=Promise,fetch"></script>

<!-- Nếu bắt buộc dùng CDN: dùng self-hosted hoặc Fastly mirror -->
<!-- + thêm SRI hash cho từng feature set cụ thể -->
```

**Strategy 4: Two-tier bundle (module/nomodule)**

```html
<!-- Modern users: nhỏ hơn, không có polyfills không cần -->
<script type="module" src="/dist/modern.js"></script>
<!-- Legacy users: đầy đủ polyfills -->
<script nomodule src="/dist/legacy.js"></script>
```

### Loading Order — critical gotcha:

```html
<!-- ❌ WRONG — polyfill load AFTER code that uses it -->
<script src="/app.js"></script>
<script src="/polyfills.js"></script>

<!-- ✅ CORRECT — polyfills ALWAYS before app code -->
<script src="/polyfills.js"></script>
<script src="/app.js"></script>

<!-- ✅ Bundled approach tránh được vấn đề này hoàn toàn -->
<!-- Babel/core-js inject import ở đầu mỗi file tự động -->
```

Nếu polyfill load sau code dùng nó: `TypeError: [API] is not a function` ngay lập tức.

> 🇻🇳 **Tóm tắt**: Bundled polyfills (core-js + Babel `usage` mode) là approach mặc định tốt nhất. Conditional import tốt hơn cho optimized cases nhưng phức tạp hơn. Không bao giờ load polyfill sau code dùng nó.

---

## Part 10: Cost Analysis / Phân Tích Chi Phí Thực Tế

### Bundle sizes của các polyfills phổ biến:

```
core-js (full, unminified):          ~2.4MB
core-js (full, minified + gzipped):  ~120KB

core-js cho 'defaults' browserslist (usage mode, real app):
  — Typical medium app (~50 ES2022+ features used):  ~15–25KB gzipped
  — Typical large app (~100+ features):              ~35–50KB gzipped

core-js specific modules (gzipped):
  es.promise.js:                     ~3KB
  es.array.flat.js:                  ~0.8KB
  es.array.at.js:                    ~0.5KB
  es.object.has-own.js:              ~0.3KB
  es.promise.all-settled.js:         ~0.7KB
  es.string.replace-all.js:          ~0.4KB

regenerator-runtime (async/await):
  Unminified:                        ~85KB
  Minified + gzipped:                ~6KB

object-rest-spread polyfill:         ~3KB gzipped
whatwg-fetch (fetch polyfill):       ~1.5KB gzipped
```

### Scenario: "400KB bundle, 60% polyfills" — debug order:

```bash
# Step 1: Analyze bundle composition
npx webpack-bundle-analyzer dist/stats.json
# hoặc cho Vite:
npx vite-bundle-visualizer

# Step 2: Check core-js usage
# Tìm trong bundle analysis: 'core-js/modules/' entries
# Nếu thấy hàng trăm module → likely 'entry' mode, not 'usage'

# Step 3: Verify browserslist
npx browserslist
# Nếu output bao gồm IE11 hoặc browsers cũ 5+ năm → review target

# Step 4: Check babel config
cat babel.config.js | grep useBuiltIns
# Nếu 'entry' → đổi sang 'usage'

# Step 5: Check for duplicate polyfill
# Đôi khi cả core-js VÀ một polyfill riêng lẻ đều fill cùng API
grep -r "Array.prototype.flat" node_modules/

# Step 6: Remove dead polyfills
# Nếu target là 'last 2 years, not dead' → nhiều Promise/Array methods
# đã là Baseline → không cần polyfill nữa
```

**Kết quả điển hình sau optimization**:

```
Before: 400KB total, 240KB polyfills (60%)
After:
  - Changed 'entry' → 'usage': 400KB → 280KB (-30%)
  - Updated browserslist to 'last 2 years, not dead': 280KB → 180KB (-36%)
  - Removed unnecessary polyfill deps: 180KB → 150KB (-17%)
Final: 150KB total, 15KB polyfills (10%)
```

> 🇻🇳 **Tóm tắt**: Full core-js ~120KB gzipped, nhưng với `usage` mode + modern browserslist target, typical app chỉ cần 15–35KB. Khi bundle nặng bất thường: check `entry` vs `usage` mode, verify browserslist target, dùng bundle analyzer để xác định.

---

## Part 11: What NOT to Polyfill / Không Nên Polyfill Gì

### APIs không thể polyfill đúng nghĩa:

**`requestIdleCallback`** — Có polyfill đơn giản dùng `setTimeout`, nhưng không reflect browser's actual idle time:

```js
// Polyfill này KHÔNG phải real requestIdleCallback behavior
window.requestIdleCallback =
  window.requestIdleCallback ||
  function (cb, options) {
    const start = Date.now();
    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };
// Safari không có requestIdleCallback → polyfill này OK cho graceful fallback
// nhưng không có browser-level idle scheduling
```

**`WebAssembly` streaming compilation** — Không thể polyfill. Graceful degradation: load .wasm as ArrayBuffer thay vì streaming.

**`SharedArrayBuffer`** — Yêu cầu COOP/COEP headers. Không thể polyfill tính năng cross-origin isolation.

**`Atomics`** — Requires SharedArrayBuffer. Không polyfill được.

**`OffscreenCanvas`** — Không polyfill được, nhưng có fallback: regular canvas trên main thread.

**CSS Houdini (Paint API, Layout API)** — Không polyfill được. Safari/Firefox không có. Sử dụng graceful degradation.

**`Scroll-driven Animations` (CSS)** — Không polyfill được đúng nghĩa. JS-based scroll listeners là replacement, không phải polyfill.

### Decision framework:

```
Trước khi polyfill, hỏi:
1. Baseline status? → web.dev/baseline
2. Có thể polyfill đúng behavior không?
3. Cost (KB) vs benefit (% users affected)?
4. Graceful degradation có OK không?

Nếu API không thể polyfill → graceful degradation
Nếu cost > benefit → graceful degradation
Nếu feature là visual enhancement → graceful degradation
Nếu feature là functional necessity + polyfillable → polyfill
```

> 🇻🇳 **Tóm tắt**: Không phải mọi API đều polyfill được. `requestIdleCallback` có fake polyfill nhưng không đúng semantics. WebAssembly streaming, SharedArrayBuffer, CSS Houdini không polyfill được. Graceful degradation là câu trả lời đúng cho các trường hợp này.

---

## Part 12: Comparison Matrix / Bảng So Sánh

### Transpiler comparison (2026):

| Tool        | Speed   | Polyfill injection | Browserslist support | Used by               | Notes                                     |
| ----------- | ------- | ------------------ | -------------------- | --------------------- | ----------------------------------------- |
| **Babel**   | Slow    | ✅ via core-js     | ✅ native            | Legacy projects, Jest | Most mature, highest config flexibility   |
| **SWC**     | Fast    | ⚠️ partial         | ✅ via swcrc         | Next.js 12+, Vite     | Needs `@swc/helpers` + explicit core-js   |
| **esbuild** | Fastest | ❌ no              | ⚠️ target only       | Vite (dev), tsc       | Syntax only, no API polyfills             |
| **tsc**     | Medium  | ❌ no              | ❌ no                | TypeScript projects   | Type checking + emit, not a polyfill tool |

### CSS polyfill tools:

| Tool                   | What it polyfills       | Required .browserslistrc? | Notes                       |
| ---------------------- | ----------------------- | ------------------------- | --------------------------- |
| **Autoprefixer**       | Vendor prefixes         | ✅ yes                    | Included in most frameworks |
| **postcss-preset-env** | CSS spec proposals      | ✅ yes                    | Stage 3+ features           |
| **lightningcss**       | Modern CSS (Rust-based) | ✅ yes                    | Fast alternative to PostCSS |

---

## Part 13: Decision Framework / Khung Quyết Định

```
POLYFILL DECISION FLOWCHART
═══════════════════════════════════════════════

Feature X cần hỗ trợ
         │
         ▼
Is it in Baseline Widely Available (>2.5 years)?
   YES → No polyfill needed. Ship it.
   NO  ↓
         ▼
What % of your users would be affected?
   < 1% → Graceful degradation (don't ship KB for 1%)
   > 1% ↓
         ▼
Can the API be correctly polyfilled?
   NO → Graceful degradation
   YES ↓
         ▼
What does polyfill cost? (use bundle analyzer)
   > 10KB for < 5% gain → Graceful degradation
   Reasonable cost ↓
         ▼
Use core-js 'usage' mode — it will auto-inject
if your code uses the feature AND target needs it

═══════════════════════════════════════════════
```

---

## Part 14: Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟡 Q1: Polyfill vs transpilation vs shim — define and give examples. / Định nghĩa và ví dụ.

**A:**

Three distinct mechanisms — often conflated in conversation, never in senior answers.

**Polyfill** = runtime implementation of a **missing API**. Runs in the browser, checks if the API exists, provides it if not. Example: `Array.prototype.flat` — IE11 and old Edge don't have it. A polyfill adds the method to `Array.prototype` at runtime.

**Transpilation** = compile-time transformation of **new syntax** to older equivalent syntax. Happens at build time, before the browser sees the code. Example: `async/await` → Babel converts to generator functions + `_asyncToGenerator` helper, or `class` → ES5 prototype chain. The browser never sees the original syntax.

**Shim** = runtime layer that **normalizes or adjusts behavior** of an API that exists but behaves differently across environments. Example: The `@webcomponents/webcomponentsjs` shim doesn't create Custom Elements from scratch — it normalizes the lifecycle callback behavior between Chrome and older Safari.

Key rule for interviews: **"Polyfill = add API, Transpile = change syntax at build, Shim = normalize existing API."**

> 🇻🇳 **Tóm tắt**: Polyfill = thêm API thiếu lúc runtime. Transpile = đổi syntax tại build time. Shim = chuẩn hóa behavior API đã có. Đây là định nghĩa phân biệt rõ ràng, không dùng lẫn lộn.

**💡 Interview Signal:**

- ✅ Strong: Gives concrete API example for polyfill, syntax example for transpile, behavioral normalization example for shim. Knows polyfill runs at runtime, transpile at build time.
- ❌ Weak: "Polyfill and shim are the same thing" or "Babel polyfills your code" (Babel transpiles, core-js polyfills — they're different tools).

---

### 🟡 Q2: What is browserslist and how do Babel/Vite use it? / browserslist là gì?

**A:**

`browserslist` is a query-language config that defines your **browser support target**. Stored in `.browserslistrc` or `package.json` `"browserslist"` key.

```ini
# .browserslistrc
defaults
not IE 11
not dead
```

Every tool that cares about browser compatibility reads this config:

- **Babel + @babel/preset-env**: Determines which syntax transforms to apply and (via core-js) which API polyfills to inject
- **Autoprefixer**: Determines which vendor prefixes to add to CSS
- **postcss-preset-env**: Determines which CSS feature transforms to apply
- **Vite's `@vitejs/plugin-legacy`**: Uses browserslist to build the legacy bundle
- **ESLint's compat plugin**: Warns about APIs not supported in your target

If you don't set browserslist, tools use their own defaults — often too broad, shipping polyfills for browsers you don't need to support.

Debug with `npx browserslist` — it outputs the exact browser list your config resolves to.

> 🇻🇳 **Tóm tắt**: browserslist là config file duy nhất để định nghĩa target browsers. Babel, Autoprefixer, PostCSS đều đọc nó. `npx browserslist` để debug. Nếu không set → tools dùng defaults riêng, thường quá broad.

**💡 Interview Signal:**

- ✅ Strong: Names multiple tools that read it (Babel, Autoprefixer, PostCSS), knows the debug command, understands "not setting it" means each tool uses its own default
- ❌ Weak: "It's a Babel config" — browserslist is cross-tool, not Babel-specific

---

### 🟡 Q3: What is core-js's `useBuiltIns: 'usage'` and what's the alternative? / useBuiltIns usage là gì?

**A:**

`useBuiltIns: 'usage'` is a Babel preset-env option that scans your **source code** and injects core-js polyfill imports **only for the APIs you actually use** AND only if the target browsers in browserslist don't already support them.

```js
// Your source code:
const arr = [1, [2, 3]].flat(); // uses Array.prototype.flat

// Babel injects at the top of this file (if target browser lacks .flat):
import "core-js/modules/es.array.flat.js";

// If target browser already has .flat → nothing injected
```

The alternative is `useBuiltIns: 'entry'`, which requires you to manually add `import "core-js/stable"` to your entry file. Babel replaces that single line with **all polyfills needed for your entire browserslist target** — regardless of what your code actually uses. This is why bundles become 120KB+ of polyfills for features you never call.

Recommendation: **Always use `'usage'`** unless you have a specific reason not to (e.g., dynamically evaluated code that Babel can't statically analyze).

> 🇻🇳 **Tóm tắt**: `usage` mode: scan code → inject polyfill chỉ cho APIs bạn thực sự dùng VÀ target thiếu. `entry` mode: inject TẤT CẢ polyfills cho target dù có dùng không. Usage mode = bundle nhỏ hơn ~90%. Luôn dùng `usage`.

**💡 Interview Signal:**

- ✅ Strong: Explains the static analysis mechanism of `usage`, contrasts with `entry`'s blanket approach, quantifies the size difference, mentions pinning corejs version
- ❌ Weak: "Usage mode loads polyfills when you need them" — this conflates build-time with runtime; it injects imports at build time, not dynamic runtime loading

---

### 🟡 Q4: What happened with polyfill.io in 2024? / Sự kiện polyfill.io 2024 là gì?

**A:**

In February 2024, the domain `cdn.polyfill.io` was sold to Funnull, a Chinese company with no affiliation to the original project creator (Andrew Betts). By June 2024, Sansec (a web security firm) discovered the domain was serving **malicious JavaScript** targeting mobile users — redirecting to gambling and adult sites via obfuscated code that impersonated Google Analytics.

Approximately 100,000 websites were affected, including UK government sites, JSTOR, Warner Bros., and Hulu.

**Why this was architecturally predictable**: When you include `<script src="https://cdn.polyfill.io/...">`, you're granting that domain **arbitrary JavaScript execution rights** on your site. There's no SRI hash protection possible because polyfill.io dynamically generates responses based on user-agent. Any compromise of that domain = compromise of every site using it.

**The fix**: Bundle polyfills into your application at build time using `core-js` + Babel. The polyfill is a dependency in your `package.json`, pinned, audited, and versioned — not a runtime CDN request.

> 🇻🇳 **Tóm tắt**: polyfill.io domain bị bán tháng 2/2024, tháng 6/2024 bắt đầu serve malicious JS, ~100K sites bị ảnh hưởng. Nguyên nhân gốc: CDN polyfill là anti-pattern bảo mật vì bạn không control content. Giải pháp: bundle polyfill vào code với core-js + Babel.

**💡 Interview Signal:**

- ✅ Strong: Knows the timeline (sold Feb, malicious June), explains WHY it was dangerous (arbitrary JS execution, no SRI protection), gives the correct architectural fix (bundled core-js)
- ❌ Weak: "polyfill.io got hacked" — technically incomplete; it was a domain sale, not a hack. The architecture enabled the attack.

---

### 🟡 Q5: What is Baseline 2024 and how does it change polyfill decisions? / Baseline 2024 là gì?

**A:**

Baseline is a cross-browser consensus initiative by Google, Apple, Mozilla, and Microsoft (via web.dev/baseline) that tracks when browser features reach sufficient cross-browser support.

Two levels:

- **Baseline Newly Available**: Supported in the latest version of all major browsers (Chrome, Edge, Firefox, Safari). Can be used — but users on older releases may not have it.
- **Baseline Widely Available**: Supported for 30+ months across all major browsers (>2.5 years). Safe to use for nearly all users without polyfilling.

**How it changes polyfill decisions in 2024–2026**:

Before Baseline, the decision was ambiguous: "Is this safe to use without polyfilling?" required checking caniuse for every browser/version combination. Baseline gives a clear, maintained signal.

Practical examples of what you **don't need to polyfill** if targeting last 2 years:

- `Array.prototype.at()` — Widely Available 2022
- `structuredClone()` — Widely Available 2022
- `Object.hasOwn()` — Widely Available 2022
- CSS Container Queries — Widely Available 2024
- CSS `:has()` — Widely Available late 2024
- `Array.prototype.flat()` — Widely Available 2019 (never needed polyfilling for modern targets)

> 🇻🇳 **Tóm tắt**: Baseline = signal rõ ràng về khi nào feature đủ safe dùng. "Widely Available" = 30+ tháng → không cần polyfill cho > 95% users. Thực tế 2024-2026: nhiều APIs bạn đang polyfill đã là Baseline từ 2–4 năm trước. Check web.dev/baseline trước khi thêm polyfill.

**💡 Interview Signal:**

- ✅ Strong: Knows both levels (Newly vs Widely Available), explains the 30-month threshold, gives concrete examples of Baseline 2024 APIs that no longer need polyfilling
- ❌ Weak: "Baseline means it's supported everywhere" — oversimplified; Widely Available ≠ 100%, and Newly Available still has gaps in older releases

---

### 🔴 Q6: Your bundle is 400KB, 60% polyfills. Debugging order? / Bundle 400KB, 60% polyfill — debug thế nào?

**A:**

Systematic debugging approach — this is a Senior performance debugging question:

**Step 1: Visualize the bundle (2 min)**

```bash
# Vite
npx vite-bundle-visualizer

# Webpack
npx webpack-bundle-analyzer stats.json

# General
npx source-map-explorer dist/bundle.js
```

Look for `core-js/modules/` entries — if there are hundreds, you're in `entry` mode.

**Step 2: Check `useBuiltIns` mode (1 min)**

```bash
grep -r "useBuiltIns" babel.config.js .babelrc
```

If `entry` → switch to `usage`. This alone often cuts 80% of polyfill bloat.

**Step 3: Check browserslist target (2 min)**

```bash
npx browserslist
```

If IE11 or Safari < 12 is in the list — you're likely polyfilling for browsers you don't target anymore. Update `.browserslistrc` to `last 2 years, not dead`.

**Step 4: Look for duplicate polyfilling**

Some polyfills appear from multiple sources: `core-js` + a standalone package (e.g., `whatwg-fetch` + `core-js/modules/web.fetch`). Remove duplicates.

**Step 5: Audit Baseline status**

Cross-reference what's being polyfilled against web.dev/baseline. Anything Widely Available 2022 or earlier for your target → should not be polyfilled.

**Step 6: Consider module/nomodule split**

If legacy browsers are real users: use `@vitejs/plugin-legacy` to ship a small modern bundle + larger legacy bundle. Modern users don't pay the legacy tax.

Expected result from these steps: 400KB → typically 120–200KB (50–70% reduction).

> 🇻🇳 **Tóm tắt**: Debug order: (1) bundle visualizer → xem core-js có bao nhiêu modules. (2) `entry` vs `usage` mode → đổi sang `usage`. (3) `npx browserslist` → update target. (4) tìm duplicate polyfills. (5) check Baseline. (6) xem xét module/nomodule split. Kết quả điển hình: giảm 50-70% bundle.

**💡 Interview Signal:**

- ✅ Strong: Starts with bundle visualizer (evidence-based), knows `entry` vs `usage` distinction, uses `npx browserslist` to check target, mentions Baseline as reference, knows the module/nomodule option
- ❌ Weak: "Remove some polyfills" — not actionable, doesn't have systematic approach

---

### 🔴 Q7: Module/nomodule pattern in 2026 — necessary or legacy cargo cult? / Còn cần thiết không?

**A:**

For **public-facing apps targeting modern users**: mostly legacy cargo cult in 2026.

**Why it's mostly obsolete**:

- IE11 reached end-of-life in June 2022, now < 0.3% global market share
- `type="module"` support: 97.5%+ of all global browser usage (caniuse.com/es6-module)
- All Baseline browsers support ES modules, optional chaining, nullish coalescing, async/await
- If you target `last 2 years, not dead` in browserslist, no browser in that set requires the nomodule fallback

**When it's still valid**:

- Intranet apps with locked IE11 or pre-Chromium Edge
- Kiosk displays with frozen browser versions
- Government/banking in Southeast Asia with regulatory browser requirements
- Legacy Android with UC Browser or Samsung Browser < 15

**The correct 2026 answer**: Set your browserslist to `last 2 years, not dead`. Use Vite with `build.target: 'es2020'`. If you identify real user agents in your analytics showing legacy browsers > 1% of traffic — then add `@vitejs/plugin-legacy` for that segment. Don't ship the complexity by default.

> 🇻🇳 **Tóm tắt**: Module/nomodule gần như không cần cho public apps 2026. IE11 chết 2022, tất cả modern browsers support ES modules. Vẫn relevant cho intranet/kiosk/legacy Android. Check analytics của bạn: nếu legacy browsers < 1% → không cần pattern này. Thêm `@vitejs/plugin-legacy` chỉ khi có evidence.

**💡 Interview Signal:**

- ✅ Strong: Doesn't dismiss it entirely (acknowledges intranet/kiosk/SEA use cases), gives the "check your analytics first" advice, knows `@vitejs/plugin-legacy` as the implementation tool
- ❌ Weak: "Yes, always needed for IE11 support" — IE11 is EOL; or "Never needed anymore" — dismisses the legitimate legacy edge cases

---

### 🔴 Q8: You target Safari 14+ baseline. What polyfills do you actually need? / Target Safari 14+ thì cần polyfill gì?

**A:**

Safari 14 shipped in September 2020. Let's audit what's supported:

**APIs Safari 14 DOES support (no polyfill needed)**:

```
Promise, async/await, fetch (basic), Web Animations API
Array.prototype.flat, flatMap, Array.from
Object.entries, Object.fromEntries
Optional chaining (?.), nullish coalescing (??)
ES Modules (import/export)
CSS Grid, CSS Variables, Flexbox
CSS @media queries
```

**APIs Safari 14 DOES NOT support (polyfill or avoid)**:

```
Array.prototype.at()           → Added Safari 15.4
structuredClone()              → Added Safari 15.4
Object.hasOwn()                → Added Safari 15.4
CSS Container Queries          → Added Safari 16.0
CSS :has()                     → Added Safari 15.4
CSS @layer                     → Added Safari 15.4
CSS nesting                    → Added Safari 17.2
ElementInternals               → Added Safari 16.0
dialog element                 → Added Safari 15.4
Error.cause                    → Added Safari 15.4
```

**Practical polyfill list for Safari 14+ target**:

```js
// babel.config.js with useBuiltIns: 'usage' will auto-inject:
// — Array.prototype.at (if you use it)
// — structuredClone (if you use it)
// — Object.hasOwn (if you use it)

// For CSS, use postcss-preset-env:
// — Container Queries fallback
// — :has() fallback
// — @layer fallback
```

**Real cost estimate**: If your app uses 10–15 of the missing APIs, expect ~5–10KB gzipped of core-js polyfills for Safari 14.

> 🇻🇳 **Tóm tắt**: Safari 14 support cơ bản Promise/fetch/flat/optional chaining đầy đủ. Thiếu: Array.at, structuredClone, Object.hasOwn, CSS Container Queries, :has(), @layer (những thứ này chỉ có từ Safari 15.4+). Dùng `usage` mode, core-js tự inject. Chi phí ~5-10KB cho app điển hình.

**💡 Interview Signal:**

- ✅ Strong: Knows concrete Safari 14 API support matrix, distinguishes what's available vs not, estimates polyfill cost, knows CSS polyfills are handled separately by PostCSS
- ❌ Weak: "Safari 14 needs lots of polyfills" without specifics — vague answer, not evidence-based

---

### 🔴 Q9: CSS polyfill via PostCSS vs progressive enhancement — when each? / PostCSS polyfill vs progressive enhancement — khi nào dùng?

**A:**

The decision comes down to: **is the feature functional or purely aesthetic?**

**Use PostCSS polyfill when**:

- Feature drives **layout or functionality** that breaks without it
- The polyfill output is semantically equivalent (not just approximate)
- The CSS transform is stable and widely used

```css
/* Example: CSS Nesting — postcss-preset-env can correctly transform */
/* Source: */
.card {
  &:hover {
    opacity: 0.9;
  }
  & .title {
    font-size: 1.25rem;
  }
}
/* → transforms correctly to equivalent CSS for older browsers */
```

**Use progressive enhancement (graceful degradation) when**:

- Feature is **visual enhancement only** (different, not broken)
- The polyfill would be heavy or approximated
- The fallback state is still functionally correct

```css
/* Example: oklch() colors — graceful degradation */
.button {
  background: hsl(210, 60%, 50%); /* fallback, older browsers */
  background: oklch(55% 0.2 250); /* modern, better color gamut */
  /* If browser doesn't know oklch → it ignores that line, uses hsl */
}

/* Example: Scroll-driven animations — no polyfill exists */
/* Just don't animate on unsupported browsers */
@supports (animation-timeline: scroll()) {
  .progress-bar {
    animation: progress linear;
    animation-timeline: scroll();
  }
}
```

**CSS `@supports` + `@layer` pattern for layered enhancement**:

```css
/* Base styles work everywhere */
.grid {
  display: flex;
  flex-wrap: wrap;
}

/* Progressive enhancement — no polyfill needed */
@supports (display: grid) {
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
```

> 🇻🇳 **Tóm tắt**: PostCSS polyfill khi feature là functional necessity và transform chính xác (CSS nesting, @layer, :has()). Progressive enhancement khi feature là visual/aesthetic và graceful fallback vẫn ok (oklch, scroll-driven animations, Houdini). Dùng `@supports` để layer enhancement không có runtime cost.

**💡 Interview Signal:**

- ✅ Strong: Uses "functional vs aesthetic" as the decision axis, knows `@supports` for progressive enhancement without PostCSS, gives concrete example of when NOT to polyfill (scroll-driven animations), understands `oklch` fallback pattern
- ❌ Weak: "Always use PostCSS for CSS features" — ignores cost/benefit and graceful degradation options

---

### 🔴 Q10: You inherit a Babel-only project in 2026. Migrate to SWC? What breaks? / Migrate Babel sang SWC — cái gì break?

**A:**

Not always worth migrating. Here's a structured evaluation:

**Why you'd migrate to SWC**:

- Babel is 20–100x slower than SWC for large projects
- If build times are a pain point (>30s transform time)
- Next.js and many modern stacks have moved; SWC is well-supported

**What breaks (not trivially)**:

1. **Babel plugins with no SWC equivalent**: If the project uses custom Babel plugins or macros (e.g., `babel-plugin-macros`, `babel-plugin-transform-imports`, `babel-plugin-module-resolver` with complex logic), these have no SWC equivalent. Must be replaced or kept in Babel.

2. **`@babel/plugin-proposal-*` plugins**: Many legacy projects use Babel for stage-2/3 proposal transforms. SWC supports some but not all. Check each plugin.

3. **core-js polyfill injection**: Babel injects core-js via `@babel/preset-env`. SWC needs explicit configuration via `@swc/core` options or you need to keep a separate polyfill step.

4. **Test runner**: If Jest uses Babel transformer (`babel-jest`), switching to SWC requires migrating to `@swc/jest` — test behavior is usually identical but edge cases exist.

**Migration checklist**:

```bash
# 1. Audit all Babel plugins in use
cat babel.config.js | grep "plugins"

# 2. Check SWC equivalents at swc.rs/docs/configuration/compilation
# For each Babel plugin, verify SWC has equivalent or it's now baseline

# 3. Handle polyfills explicitly (SWC doesn't auto-inject)
npm install core-js
# Add explicit imports or use @vitejs/plugin-legacy

# 4. Migrate tests
npm install -D @swc/jest @swc/core
# Update jest.config.js transform

# 5. Validate output parity
# Run both Babel and SWC on same input, diff output
```

**Recommendation**: Migrate for build performance IF your Babel plugin list is small and standard. Keep Babel IF you have custom plugins or complex macro usage. Hybrid: use SWC for production builds, Babel for tests.

> 🇻🇳 **Tóm tắt**: Migrate Babel → SWC: lợi về speed (20-100x nhanh hơn). Cái break: custom Babel plugins không có SWC equivalent, polyfill injection phải handle riêng, test runner cần migrate. Audit plugins trước. Hybrid approach (SWC prod + Babel test) là compromise hợp lý.

**💡 Interview Signal:**

- ✅ Strong: Knows SWC doesn't auto-inject core-js (unlike preset-env), names specific plugin categories that break, suggests the hybrid migration approach, mentions `@swc/jest`
- ❌ Weak: "Just replace Babel with SWC" — misses the polyfill injection gap and plugin compatibility issues

---

## Anti-Patterns / Lỗi Thường Gặp

### Anti-Pattern 1: Loading `cdn.polyfill.io` in 2026

```html
<!-- ❌ Supply chain risk + domain is effectively dead/malicious -->
<script src="https://cdn.polyfill.io/v3/polyfill.min.js"></script>

<!-- ✅ Bundle with core-js at build time -->
<!-- .browserslistrc + babel.config.js with useBuiltIns: 'usage' -->
```

**Tại sao nguy hiểm**: Domain bị sell năm 2024, served malicious code cho ~100K sites. External CDN polyfills là attack vector. Không có SRI protection vì response là dynamic per-user-agent.

---

### Anti-Pattern 2: Polyfilling for IE11 in a 2026 product

```ini
# ❌ .browserslistrc targeting dead browsers
> 0.2%
last 4 versions
IE 11

# → Babel/core-js sẽ generate ES5 output, inject hàng trăm polyfills
# → Bundle tăng 200-400% cho < 0.3% of users
```

```ini
# ✅ Drop IE11 (EOL June 2022)
last 2 years
not dead
# → modern output, minimal polyfills, 3x smaller bundle
```

---

### Anti-Pattern 3: `useBuiltIns: 'entry'` without core-js version pinning

```js
// ❌ Version không được pin
{
  useBuiltIns: "entry",
  corejs: 3  // sẽ pick latest 3.x patch
}

// ✅ Pin minor version
{
  useBuiltIns: "entry",
  corejs: { version: "3.37", proposals: false }
}
```

**Hậu quả**: Không pin version → upgrade `core-js` minor có thể thêm/bỏ polyfills, thay đổi bundle content mà không có explicit change trong code. Non-reproducible builds.

---

### Anti-Pattern 4: Polyfilling APIs that can't be correctly polyfilled

```js
// ❌ requestIdleCallback "polyfill" với setTimeout không phản ánh idle time
window.requestIdleCallback =
  window.requestIdleCallback ||
  function (cb) {
    return setTimeout(() => cb({ timeRemaining: () => 50 }), 1);
  };
// Code dùng này sẽ KHÔNG tận dụng được browser idle scheduling
// Worst case: gây performance issues khi "idle" callback fire lúc browser bận

// ✅ Feature detect + degrade gracefully
if ("requestIdleCallback" in window) {
  requestIdleCallback(() => {
    /* non-critical work */
  });
} else {
  // Don't do the non-critical work, or do it with a delay
  setTimeout(() => {
    /* lower-priority alternative */
  }, 2000);
}
```

---

### Anti-Pattern 5: Not setting browserslist (defaulting to tool's own defaults)

```js
// ❌ No .browserslistrc file
// Babel uses its own default: may include very old browsers
// Autoprefixer uses its own default: may add unnecessary prefixes
// Each tool makes independent, potentially inconsistent decisions

// ✅ Explicit .browserslistrc
// defaults
// not dead
// not IE 11
// → All tools calibrate to the same target
```

**Hậu quả thực tế**: Babel default không có browserslistrc có thể target ES5 → tất cả arrow functions, const/let bị transpile xuống var/function. Bundle tăng 30–50% so với ES2020 target mà không cần.

---

### Anti-Pattern 6: Polyfill loaded after the code that uses it

```html
<!-- ❌ Runtime error: Cannot read properties of undefined -->
<script>
  const arr = [1, [2, 3]].flat(); // flat không tồn tại → TypeError
</script>
<script src="polyfills.js"></script>

<!-- ✅ Polyfills phải load TRƯỚC code dùng chúng -->
<script src="polyfills.js"></script>
<script>
  const arr = [1, [2, 3]].flat(); // OK
</script>

<!-- ✅ Tốt nhất: dùng bundled approach, không phải separate scripts -->
<!-- Babel inject import statements ở đầu mỗi file tự động -->
```

---

## Memory Hook / Ghi Nhớ

**"P-T-S, B-C-B"** — Polyfill (runtime API) → Transpile (build syntax) → Shim (normalize) | Browserslist (target) → core-js Usage (inject) → Bundle (ship minimum)

Hoặc: **"Polyfill là cái vá lúc chạy, Transpile là cái đổi lúc build, Shim là cái chuẩn hóa sẵn có."**

Nhớ cho polyfill.io: **"CDN polyfill = trao quyền JS execution cho bên thứ ba. Đừng làm vậy."**

Nhớ cho bundle bloat: **`entry` mode = ALL polyfills, `usage` mode = ONLY your polyfills.** Switch `entry` → `usage` là fix đơn giản nhất cho bundle bloat.

---

## Q&A Summary Table / Bảng Tóm Tắt

| #   | Difficulty | Question (EN)                                     | Signal Keyword                               |
| --- | ---------- | ------------------------------------------------- | -------------------------------------------- |
| 1   | 🟡 Mid     | Polyfill vs transpile vs shim — define + examples | runtime API / build syntax / normalize       |
| 2   | 🟡 Mid     | What is browserslist, how do tools use it?        | single source of truth, npx browserslist     |
| 3   | 🟡 Mid     | core-js `useBuiltIns: 'usage'` vs `'entry'`       | static analysis, 90% smaller, pin version    |
| 4   | 🟡 Mid     | polyfill.io incident 2024                         | domain sold, supply chain, bundled core-js   |
| 5   | 🟡 Mid     | Baseline 2024 — two levels                        | Widely Available 30 months, web.dev/baseline |
| 6   | 🔴 Senior  | Bundle 400KB, 60% polyfills — debug order         | bundle visualizer, entry→usage, browserslist |
| 7   | 🔴 Senior  | module/nomodule 2026 — necessary?                 | IE11 EOL, analytics-driven, plugin-legacy    |
| 8   | 🔴 Senior  | Safari 14+ target — which polyfills needed?       | Array.at, structuredClone, Container Queries |
| 9   | 🔴 Senior  | CSS PostCSS polyfill vs progressive enhancement   | functional vs aesthetic, @supports           |
| 10  | 🔴 Senior  | Migrate Babel → SWC — what breaks?                | custom plugins, core-js gap, @swc/jest       |

---

## Cold Call Simulation / Mô Phỏng Cold Call

**Interviewer**: "Without looking anything up — you're adding a new feature that uses `Array.prototype.at()`. Your team targets Safari 14+. Walk me through your decision process."

**Strong answer (30 seconds)**:

"First I'd check — `Array.prototype.at` shipped in Safari 15.4, and my target is Safari 14+, so Safari 14.0–15.3 don't have it. I check web.dev/baseline: it's Widely Available since 2022, so for most browsers it's fine. Since I need it for Safari 14 specifically, I use `useBuiltIns: 'usage'` in my Babel config with core-js 3.37. Babel will scan my code, find `.at()` usage, and inject the core-js import only for browsers in my browserslist that lack it — Safari 14 in this case. The polyfill itself is about 0.5KB gzipped — negligible cost. I'd also add a comment in the PR noting Safari 14 support will be dropped once our analytics show < 0.5% Safari < 15.4 traffic."

**Weak answer**: "I'd just add a polyfill to the entry file." — No decision process, doesn't know the specific gap, doesn't know the size cost.

---

## Self-Check / Tự Kiểm Tra

Sau khi đọc xong tài liệu này, bạn có thể trả lời:

- [ ] Phân biệt polyfill / transpile / shim với ví dụ cụ thể không nhìn gợi ý
- [ ] Giải thích incident polyfill.io 2024 và tại sao CDN polyfill là anti-pattern
- [ ] Viết một file `.browserslistrc` hợp lệ cho app targeting modern users 2025
- [ ] Giải thích `useBuiltIns: 'usage'` vs `'entry'` và khi nào mỗi cái phù hợp
- [ ] Biết Baseline Widely Available nghĩa là gì và cho ví dụ 3 APIs đạt Baseline 2024
- [ ] Debug bundle 400KB có 60% polyfills — liệt kê 5 steps theo thứ tự
- [ ] Giải thích tại sao Vite/esbuild không inject API polyfills (chỉ transpile syntax)
- [ ] Nêu 3 APIs không thể polyfill đúng nghĩa và cách graceful degradation
- [ ] Đánh giá module/nomodule pattern — khi nào còn cần thiết trong 2026
- [ ] Xác định ít nhất 2 thứ "break" khi migrate Babel sang SWC

---

_Tài liệu này được thiết kế cho Mid → Senior Frontend Interview prep. Stance: polyfill tối thiểu, target Baseline, đo cost. Nguồn: Frontend Masters Handbook 2024 §6.45 + 2025-2026 ecosystem reality._
