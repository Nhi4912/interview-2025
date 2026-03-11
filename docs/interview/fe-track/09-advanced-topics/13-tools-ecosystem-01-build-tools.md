# Build Tools Ecosystem / Hệ Sinh Thái Công Cụ Build
## Tools & Ecosystem - Chapter 1 / Công Cụ & Hệ Sinh Thái - Chương 1
[Back to Table of Contents](../00-table-of-contents.md)

---

## Tổng Quan / Overview
- Build tools hiện đại giải quyết 3 bài toán lớn: tốc độ phát triển, tối ưu runtime, và tính lặp lại của pipeline.
- Hầu hết framework FE đều xoay quanh bundler/dev server nên hiểu bản chất công cụ giúp debug nhanh hơn.
- Trong phỏng vấn senior, interviewer thường hỏi trade-off giữa Webpack, Vite, Turbopack, Rspack thay vì chỉ “thuộc lệnh”.
- Cross-reference tối ưu bundle: [Bundle Optimization](../06-browser-performance/03-bundle-optimization.md).
- Cross-reference hệ sinh thái dev tools: [Modern Development Tools](./13-tools-ecosystem-05-modern-development-tools.md).

## 1) Build Tools Evolution / Tiến Hóa Công Cụ Build
### Make
- **Era:** Unix era.
- **English:** Rule-based build from file dependencies.
- **Tiếng Việt:** Đặt nền móng tư duy DAG và incremental build.
- **Interview angle:** Đừng chỉ kể lịch sử; hãy nêu lý do vì sao công cụ mới giải quyết pain-point cũ.

### Ant/Gulp predecessors
- **Era:** Early web tooling.
- **English:** Task automation cho compile/copy/minify.
- **Tiếng Việt:** Giải quyết automation nhưng chưa hiểu module graph JS phức tạp.
- **Interview angle:** Đừng chỉ kể lịch sử; hãy nêu lý do vì sao công cụ mới giải quyết pain-point cũ.

### Grunt
- **Era:** 2012+.
- **English:** Config-driven task runner với plugin ecosystem.
- **Tiếng Việt:** Dễ bắt đầu nhưng chậm khi pipeline dài và I/O nặng.
- **Interview angle:** Đừng chỉ kể lịch sử; hãy nêu lý do vì sao công cụ mới giải quyết pain-point cũ.

### Gulp
- **Era:** 2013+.
- **English:** Code-first streaming task runner.
- **Tiếng Việt:** Nhanh hơn Grunt ở nhiều case nhờ stream, nhưng vẫn thiên task orchestration.
- **Interview angle:** Đừng chỉ kể lịch sử; hãy nêu lý do vì sao công cụ mới giải quyết pain-point cũ.

### Browserify
- **Era:** 2011+.
- **English:** Bundle CommonJS modules cho browser.
- **Tiếng Việt:** Bước chuyển quan trọng trước Webpack cho module-based FE.
- **Interview angle:** Đừng chỉ kể lịch sử; hãy nêu lý do vì sao công cụ mới giải quyết pain-point cũ.

### Webpack
- **Era:** 2014+.
- **English:** Universal module bundler với loaders/plugins/chunks.
- **Tiếng Việt:** Trở thành chuẩn de-facto nhiều năm trong enterprise FE.
- **Interview angle:** Đừng chỉ kể lịch sử; hãy nêu lý do vì sao công cụ mới giải quyết pain-point cũ.

### Rollup
- **Era:** 2016+.
- **English:** ESM-focused bundler tối ưu library build/tree-shaking.
- **Tiếng Việt:** Mạnh cho package publishing và output gọn.
- **Interview angle:** Đừng chỉ kể lịch sử; hãy nêu lý do vì sao công cụ mới giải quyết pain-point cũ.

### Parcel
- **Era:** 2017+.
- **English:** Zero-config bundler tập trung DX.
- **Tiếng Việt:** Giảm friction setup cho project nhỏ/vừa.
- **Interview angle:** Đừng chỉ kể lịch sử; hãy nêu lý do vì sao công cụ mới giải quyết pain-point cũ.

### Vite
- **Era:** 2020+.
- **English:** Native ESM dev server + Rollup production build.
- **Tiếng Việt:** Tạo bước nhảy lớn về HMR latency và cold start.
- **Interview angle:** Đừng chỉ kể lịch sử; hãy nêu lý do vì sao công cụ mới giải quyết pain-point cũ.

### esbuild/SWC era
- **Era:** 2020+.
- **English:** Ultra-fast transforms bằng Go/Rust.
- **Tiếng Việt:** Đổi kỳ vọng ngành về tốc độ transpile/minify.
- **Interview angle:** Đừng chỉ kể lịch sử; hãy nêu lý do vì sao công cụ mới giải quyết pain-point cũ.

### Turbopack
- **Era:** 2022+.
- **English:** Incremental Rust bundler tối ưu Next.js workflows.
- **Tiếng Việt:** Nhắm latency thấp cho dự án lớn và dev loop dày đặc.
- **Interview angle:** Đừng chỉ kể lịch sử; hãy nêu lý do vì sao công cụ mới giải quyết pain-point cũ.

### Rspack
- **Era:** 2023+.
- **English:** Rust bundler tương thích phần lớn Webpack API.
- **Tiếng Việt:** Giảm migration cost cho codebase Webpack legacy.
- **Interview angle:** Đừng chỉ kể lịch sử; hãy nêu lý do vì sao công cụ mới giải quyết pain-point cũ.

## 2) Webpack Architecture / Kiến Trúc Webpack
### 2.1 Entry, Output, Module Graph
- Entry xác định root nodes của dependency graph.
- Webpack resolve import/require qua resolver rules (extensions, alias, mainFields).
- Output kiểm soát naming, hashing, publicPath, chunk file placement.
- Module graph là trung tâm quyết định splitting, optimization và runtime bootstrap.

### 2.2 Loaders
- `ts-loader`/`babel-loader` biến TS/JSX thành JS runtime-compatible.
- `css-loader` đọc `@import/url()` và biến CSS thành module.
- `style-loader` inject CSS vào DOM ở runtime dev.
- `postcss-loader` chạy autoprefixer hoặc plugins CSS pipeline.
- `asset modules` thay thế file/url-loader đời cũ cho ảnh/font.

### 2.3 Plugins
- HtmlWebpackPlugin tạo HTML shell và inject bundles.
- MiniCssExtractPlugin tách CSS file cho production caching.
- DefinePlugin inject compile-time constants (ví dụ `process.env.NODE_ENV`).
- ModuleFederationPlugin cho remote module loading runtime.
- BundleAnalyzerPlugin giúp đọc cấu trúc artifact khi tối ưu.

### 2.4 Chunks
- Initial chunks tải cùng entry, async chunks tải qua dynamic import.
- Runtime chunk chứa mapping logic để load async chunks đúng URL.
- `splitChunks` cấu hình grouping vendor/common để tận dụng caching dài hạn.

### 2.5 Compiler vs Compilation
- **Compiler**: đại diện toàn bộ build run, phát event lifecycle lớn.
- **Compilation**: đại diện một lần xử lý module/chunk cụ thể trong run.
- Interview senior hay hỏi điểm khác nhau để đánh giá hiểu plugin APIs.

### 2.6 Sample Config / Cấu Hình Mẫu
```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: { app: "./src/main.tsx" },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[contenthash:8].js",
    chunkFilename: "js/[name].[contenthash:8].chunk.js",
    assetModuleFilename: "assets/[name].[hash:8][ext]",
    clean: true,
    publicPath: "/"
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
      { test: /\.(png|svg|jpg|webp)$/i, type: "asset/resource" }
    ]
  },
  optimization: {
    splitChunks: { chunks: "all" },
    runtimeChunk: "single"
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    new MiniCssExtractPlugin({ filename: "css/[name].[contenthash:8].css" })
  ]
};
```

## 3) Vite Architecture / Kiến Trúc Vite
### 3.1 Native ESM Dev Server
- Browser request theo module URL thay vì bundle khối lớn.
- Vite transform file on-demand thông qua plugin pipeline.
- Cơ chế invalidation tinh gọn giúp HMR update rất nhanh.

### 3.2 Dev vs Prod
| Môi trường | Engine chính | Mục tiêu |
|---|---|---|
| Dev | Native ESM + esbuild pre-bundle deps | Feedback loop nhanh |
| Prod | Rollup bundling + optimization | Artifact ổn định, tối ưu tải |

### 3.3 Dependency Pre-bundling
- esbuild convert dependency CJS/UMD sang ESM để browser import mượt.
- Giảm số request lắt nhắt cho dependencies lớn chia nhiều file nội bộ.
- Thường cache theo lockfile + vite config nên lần chạy sau rất nhanh.

### 3.4 Vite Config Mẫu
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  optimizeDeps: { include: ["react", "react-dom"] },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          charts: ["d3"]
        }
      }
    }
  }
});
```

## 4) Turbopack & Rspack / Bundler Rust
### Turbopack
- Tập trung incremental graph computation cho Next.js scale lớn.
- Mục tiêu chính: giảm cold start và update latency khi codebase có hàng nghìn modules.
- Cần theo dõi mức độ parity features với Webpack theo phiên bản framework.

### Rspack
- Tương thích config/plugin Webpack ở mức thực dụng để migration ít rủi ro.
- Dựa trên Rust core cho tốc độ parse/transform/build cao hơn JS bundler truyền thống.
- Phù hợp tổ chức có legacy Webpack config lớn và muốn nâng hiệu suất dần.

## 5) Build Optimization / Tối Ưu Build
### Code Splitting
- Route-based splitting giảm JS initial route.
- Dynamic import cho module hiếm dùng (editor/map/chart).
- Tách vendor ít đổi để cache tốt hơn qua nhiều release.

### Tree Shaking
- Dựa vào static ESM analysis để loại export không dùng.
- Khai báo `sideEffects` đúng trong package để tránh retain code thừa.
- Tránh pattern dynamic quá mức làm tree-shaking mất hiệu lực.

### Minification
- Minify JS/CSS/HTML để giảm transfer size.
- Cân nhắc readability/debug bằng source maps phù hợp.
- So sánh gzip/brotli output chứ không chỉ raw bytes.

### Source Maps
- Dev ưu tiên tốc độ rebuild + trace dễ đọc.
- Prod thường dùng hidden map và upload lên error tracker.
- Giới hạn truy cập source map trong môi trường nhạy cảm.

### Caching
- Filename content hash để cache busting chính xác.
- Immutable caching cho assets fingerprinted.
- Runtime chunk tách riêng để giảm invalidation dây chuyền.

### Compression
- Brotli cho static assets nếu CDN hỗ trợ.
- Pre-compress trong CI cho predictable latency.
- Theo dõi CPU overhead server khi nén on-the-fly.

## 6) HMR Mechanics / Cơ Chế Hot Module Replacement
- Bước 1: File watcher phát hiện thay đổi trên hệ thống file.
- Bước 2: Bundler/dev server xác định impacted modules trong graph.
- Bước 3: Server gửi update payload qua WebSocket channel.
- Bước 4: Client runtime apply patch vào module cache.
- Bước 5: Framework boundary (React Fast Refresh) quyết định giữ hay reset state.
- Bước 6: Nếu không thể patch an toàn, fallback sang full reload.

```ts
if (import.meta.hot) {
  import.meta.hot.accept((next) => {
    console.log("HMR applied", next);
  });
}
```

## 7) Module Federation / Liên Kết Module Runtime
- Cho phép host app nạp remote modules khi runtime, giảm coupling release giữa teams.
- Concepts: host, remote, exposes, remotes map, shared singleton dependencies.
- Rủi ro: incompatible contracts, duplicated framework runtime, latency từ remote entry fetch.
- Cần governance version và health check remote endpoints trong production.

```js
new ModuleFederationPlugin({
  name: "shell",
  remotes: {
    profile: "profile@https://cdn.example.com/profile/remoteEntry.js"
  },
  shared: {
    react: { singleton: true, requiredVersion: "18.x" },
    "react-dom": { singleton: true, requiredVersion: "18.x" }
  }
});
```

## 8) Development Server Architecture / Kiến Trúc Dev Server
- **HTTP layer:** Phục vụ module/assets và xử lý URL rewriting cho SPA.
- **Transform middleware:** Transpile TS/JSX/CSS theo plugin chain.
- **Graph store:** Lưu dependency graph + metadata cache cho invalidation.
- **Watcher:** Theo dõi file change events cross-platform.
- **HMR channel:** WebSocket hoặc SSE gửi update signal.
- **Proxy:** Forward API requests để tránh CORS trong local dev.
- **Error overlay:** Hiển thị compile/runtime errors trực tiếp trên browser.

## 9) Build Pipeline Design / Thiết Kế Pipeline
### 9.1 Principles
- Fail-fast checks: lint/typecheck/test smoke chạy sớm.
- Deterministic artifacts: lockfile + pinned Node/tool versions.
- Incremental execution: chỉ build/test phần bị ảnh hưởng.
- Observability: đo build duration, cache hit ratio, artifact size trend.
- Rollback-ready: artifact versioning + deploy metadata rõ ràng.

### 9.2 CI/CD Pipeline Example
```yaml
steps:
  - checkout
  - setup-node: 20.x
  - install: pnpm install --frozen-lockfile
  - lint: pnpm lint
  - typecheck: pnpm typecheck
  - test: pnpm test --run
  - build: pnpm build
  - bundle-budget: pnpm analyze:bundle
  - upload-artifacts
```

## 10) Architecture Decision Heuristics / Heuristic Chọn Công Cụ
### H1. Codebase có legacy Webpack plugins nặng không?
- Nếu có, ưu tiên Rspack hoặc Webpack incremental migration.
- Nếu không, cân nhắc Vite cho DX nhanh.

### H2. Team cần SSR framework integration sâu?
- Nếu Next.js-centric, đánh giá Turbopack roadmap của framework.
- Nếu framework-agnostic, Vite/Rollup có tính linh hoạt cao.

### H3. Project là app hay library?
- Library thường hợp Rollup/tsup vì output control tốt.
- App thường tối ưu workflow với Vite/Webpack/Rspack.

### H4. CI bottleneck nằm ở install hay build?
- Nếu build bottleneck: benchmark Rust bundlers.
- Nếu install bottleneck: tối ưu package manager/cache trước.

### H5. Mức chấp nhận rủi ro migration?
- Rủi ro thấp: tiến hóa dần từ config hiện tại.
- Rủi ro vừa/cao: rewrite build stack theo chuẩn mới.

## 11) Troubleshooting Playbook / Sổ Tay Xử Lý Sự Cố
- Build chậm đột biến: kiểm tra plugin mới thêm, sourcemap mode, và cache invalidation.
- HMR full reload liên tục: tìm module side effects toàn cục hoặc circular dependencies.
- Bundle size tăng bất thường: chạy analyzer để tìm duplicate dependencies.
- Sourcemap mismatch: xác minh path rewriting và deploy artifact/source map đồng bộ.
- Prod crash nhưng local ổn: kiểm tra minification assumptions và NODE_ENV branching.
- Module Federation runtime error: xác minh shared versions và remote availability.

## 12) Comparative Matrix / Bảng So Sánh
| Tool | Dev Speed | Build Speed | Ecosystem | Best Fit |
|---|---|---|---|---|
| Webpack | Trung bình | Trung bình | Rất lớn | Enterprise legacy apps |
| Rollup | Nhanh (lib) | Nhanh | Tốt | Library/package publishing |
| Vite | Rất nhanh | Nhanh | Rộng | Modern SPA/SSR adapters |
| Turbopack | Rất nhanh (mục tiêu) | Nhanh | Đang mở rộng | Next.js-heavy org |
| Rspack | Nhanh | Nhanh | Tốt với Webpack migration | Large Webpack codebases |

## 13) Practical Interview Frames / Khung Trả Lời Thực Tế
### Frame 1
- **English Prompt:** Explain one build decision with metrics.
- **Giải thích:** Trả lời tốt nên gồm bối cảnh, tiêu chí đo, lựa chọn, trade-off, và kết quả đo được.
- **Ví dụ:** "Chúng tôi chuyển từ Webpack sang Vite, cold start từ 22s xuống 2.8s, HMR p95 từ 1.4s xuống 120ms".

### Frame 2
- **English Prompt:** Explain one build decision with metrics.
- **Giải thích:** Trả lời tốt nên gồm bối cảnh, tiêu chí đo, lựa chọn, trade-off, và kết quả đo được.
- **Ví dụ:** "Chúng tôi chuyển từ Webpack sang Vite, cold start từ 22s xuống 2.8s, HMR p95 từ 1.4s xuống 120ms".

### Frame 3
- **English Prompt:** Explain one build decision with metrics.
- **Giải thích:** Trả lời tốt nên gồm bối cảnh, tiêu chí đo, lựa chọn, trade-off, và kết quả đo được.
- **Ví dụ:** "Chúng tôi chuyển từ Webpack sang Vite, cold start từ 22s xuống 2.8s, HMR p95 từ 1.4s xuống 120ms".

### Frame 4
- **English Prompt:** Explain one build decision with metrics.
- **Giải thích:** Trả lời tốt nên gồm bối cảnh, tiêu chí đo, lựa chọn, trade-off, và kết quả đo được.
- **Ví dụ:** "Chúng tôi chuyển từ Webpack sang Vite, cold start từ 22s xuống 2.8s, HMR p95 từ 1.4s xuống 120ms".

### Frame 5
- **English Prompt:** Explain one build decision with metrics.
- **Giải thích:** Trả lời tốt nên gồm bối cảnh, tiêu chí đo, lựa chọn, trade-off, và kết quả đo được.
- **Ví dụ:** "Chúng tôi chuyển từ Webpack sang Vite, cold start từ 22s xuống 2.8s, HMR p95 từ 1.4s xuống 120ms".

### Frame 6
- **English Prompt:** Explain one build decision with metrics.
- **Giải thích:** Trả lời tốt nên gồm bối cảnh, tiêu chí đo, lựa chọn, trade-off, và kết quả đo được.
- **Ví dụ:** "Chúng tôi chuyển từ Webpack sang Vite, cold start từ 22s xuống 2.8s, HMR p95 từ 1.4s xuống 120ms".

### Frame 7
- **English Prompt:** Explain one build decision with metrics.
- **Giải thích:** Trả lời tốt nên gồm bối cảnh, tiêu chí đo, lựa chọn, trade-off, và kết quả đo được.
- **Ví dụ:** "Chúng tôi chuyển từ Webpack sang Vite, cold start từ 22s xuống 2.8s, HMR p95 từ 1.4s xuống 120ms".

### Frame 8
- **English Prompt:** Explain one build decision with metrics.
- **Giải thích:** Trả lời tốt nên gồm bối cảnh, tiêu chí đo, lựa chọn, trade-off, và kết quả đo được.
- **Ví dụ:** "Chúng tôi chuyển từ Webpack sang Vite, cold start từ 22s xuống 2.8s, HMR p95 từ 1.4s xuống 120ms".

### Frame 9
- **English Prompt:** Explain one build decision with metrics.
- **Giải thích:** Trả lời tốt nên gồm bối cảnh, tiêu chí đo, lựa chọn, trade-off, và kết quả đo được.
- **Ví dụ:** "Chúng tôi chuyển từ Webpack sang Vite, cold start từ 22s xuống 2.8s, HMR p95 từ 1.4s xuống 120ms".

### Frame 10
- **English Prompt:** Explain one build decision with metrics.
- **Giải thích:** Trả lời tốt nên gồm bối cảnh, tiêu chí đo, lựa chọn, trade-off, và kết quả đo được.
- **Ví dụ:** "Chúng tôi chuyển từ Webpack sang Vite, cold start từ 22s xuống 2.8s, HMR p95 từ 1.4s xuống 120ms".

### Frame 11
- **English Prompt:** Explain one build decision with metrics.
- **Giải thích:** Trả lời tốt nên gồm bối cảnh, tiêu chí đo, lựa chọn, trade-off, và kết quả đo được.
- **Ví dụ:** "Chúng tôi chuyển từ Webpack sang Vite, cold start từ 22s xuống 2.8s, HMR p95 từ 1.4s xuống 120ms".

### Frame 12
- **English Prompt:** Explain one build decision with metrics.
- **Giải thích:** Trả lời tốt nên gồm bối cảnh, tiêu chí đo, lựa chọn, trade-off, và kết quả đo được.
- **Ví dụ:** "Chúng tôi chuyển từ Webpack sang Vite, cold start từ 22s xuống 2.8s, HMR p95 từ 1.4s xuống 120ms".

### Frame 13
- **English Prompt:** Explain one build decision with metrics.
- **Giải thích:** Trả lời tốt nên gồm bối cảnh, tiêu chí đo, lựa chọn, trade-off, và kết quả đo được.
- **Ví dụ:** "Chúng tôi chuyển từ Webpack sang Vite, cold start từ 22s xuống 2.8s, HMR p95 từ 1.4s xuống 120ms".

### Frame 14
- **English Prompt:** Explain one build decision with metrics.
- **Giải thích:** Trả lời tốt nên gồm bối cảnh, tiêu chí đo, lựa chọn, trade-off, và kết quả đo được.
- **Ví dụ:** "Chúng tôi chuyển từ Webpack sang Vite, cold start từ 22s xuống 2.8s, HMR p95 từ 1.4s xuống 120ms".

### Frame 15
- **English Prompt:** Explain one build decision with metrics.
- **Giải thích:** Trả lời tốt nên gồm bối cảnh, tiêu chí đo, lựa chọn, trade-off, và kết quả đo được.
- **Ví dụ:** "Chúng tôi chuyển từ Webpack sang Vite, cold start từ 22s xuống 2.8s, HMR p95 từ 1.4s xuống 120ms".

## 14) Interview Checklist / Checklist Ôn Phỏng Vấn
- [ ] Giải thích được timeline tiến hóa Make -> Rspack/Turbopack.
- [ ] Nói rõ loader/plugin/chunk/entry/output trong Webpack.
- [ ] Mô tả cơ chế Vite dev/prod và vai trò esbuild + Rollup.
- [ ] Hiểu HMR path từ file change đến runtime patch.
- [ ] Trình bày code splitting/tree shaking/source maps có ví dụ.
- [ ] Nêu được use case và rủi ro Module Federation.
- [ ] Thiết kế pipeline có build budget và observability.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Build tool khác task runner như thế nào?

**Tổng Quan**
Build tool hiểu dependency graph và tạo artifacts tối ưu.

**Giải thích**
Task runner chủ yếu orchestrate lệnh theo thứ tự, ít phân tích module graph.

**Ví dụ**
Gulp chạy lint -> transpile -> minify; Vite/Webpack còn quản lý chunks/HMR.

### 🟢 [Junior] Vì sao cần content hash?

**Tổng Quan**
Để cache busting chính xác theo nội dung file.

**Giải thích**
Nếu không hash, browser có thể giữ asset cũ sau deploy.

**Ví dụ**
`app.1a2b.js` đổi thành `app.9f0e.js` khi nội dung đổi.

### 🟢 [Junior] Code splitting là gì?

**Tổng Quan**
Chia code thành chunk tải theo nhu cầu.

**Giải thích**
Giảm initial payload, cải thiện first load và TTI.

**Ví dụ**
Trang admin dùng dynamic import thay vì tải ngay từ homepage.

### 🟢 [Junior] Tree shaking hoạt động dựa trên gì?

**Tổng Quan**
Dựa trên static analysis của ESM imports/exports.

**Giải thích**
Bundler loại bỏ export không dùng khi side effects rõ ràng.

**Ví dụ**
Import `lodash-es/pick` thay vì import toàn lodash.

### 🟢 [Junior] Source map để làm gì?

**Tổng Quan**
Map code minified về source code gốc khi debug.

**Giải thích**
Giúp đọc stack trace production dưới dạng TypeScript/source file thật.

**Ví dụ**
Upload source map lên Sentry để symbolicate lỗi.

### 🟡 [Mid] Loader và plugin khác nhau ra sao?

**Tổng Quan**
Loader transform từng module; plugin hook vào lifecycle build tổng thể.

**Giải thích**
Loader xử lý file-level, plugin xử lý compile-level concern.

**Ví dụ**
`ts-loader` là loader, `HtmlWebpackPlugin` là plugin.

### 🟡 [Mid] Tại sao Vite dev nhanh?

**Tổng Quan**
Vì native ESM + transform on-demand thay vì bundle full trước.

**Giải thích**
Chỉ module được request mới được xử lý, giảm công việc ban đầu.

**Ví dụ**
Mở route A không cần build toàn bộ route B/C ngay.

### 🟡 [Mid] Vai trò esbuild trong Vite là gì?

**Tổng Quan**
Pre-bundle dependencies và transform nhanh trong một số bước.

**Giải thích**
Nó giảm chi phí xử lý deps CJS/legacy trước khi browser load.

**Ví dụ**
`react` và `react-dom` được pre-bundle để giảm overhead.

### 🟡 [Mid] HMR giữ state bằng cách nào?

**Tổng Quan**
Bằng boundary runtime chấp nhận update module.

**Giải thích**
Nếu boundary hợp lệ (ví dụ Fast Refresh), state UI vẫn giữ được.

**Ví dụ**
Sửa text component vẫn giữ form input value.

### 🟡 [Mid] Khi nào nên split vendor chunk?

**Tổng Quan**
Khi dependencies lớn và thay đổi ít hơn app code.

**Giải thích**
Tách vendor tăng khả năng cache reuse qua nhiều deploy.

**Ví dụ**
`react`, `react-dom`, `lodash` vào chunk vendor riêng.

### 🟡 [Mid] Minification có thể gây bug không?

**Tổng Quan**
Có, nếu code dựa vào behavior không an toàn khi tối ưu.

**Giải thích**
Một số assumptions về names/reflection có thể vỡ sau minify.

**Ví dụ**
Thư viện cũ dùng function.name có thể hỏng khi mangle.

### 🟡 [Mid] Public source map có rủi ro gì?

**Tổng Quan**
Có thể lộ logic/implementation nội bộ.

**Giải thích**
Nên dùng hidden source maps nếu ứng dụng có IP nhạy cảm.

**Ví dụ**
Prod map upload private lên monitoring thay vì public URL.

### 🟡 [Mid] Module Federation dùng khi nào?

**Tổng Quan**
Khi nhiều team cần deploy frontend độc lập nhưng tích hợp runtime.

**Giải thích**
Nó giảm coupling release nhưng tăng complexity version governance.

**Ví dụ**
Shell app tải remote checkout/profile module theo URL.

### 🟡 [Mid] Development server gồm những phần nào?

**Tổng Quan**
HTTP serving, transform middleware, file watcher, HMR channel, proxy.

**Giải thích**
Mỗi phần phục vụ một giai đoạn trong feedback loop local dev.

**Ví dụ**
Vite/webpack-dev-server đều có ws channel cho HMR.

### 🟡 [Mid] Làm sao đo quality của build setup?

**Tổng Quan**
Đo cold start, HMR latency, full build time, bundle size, CI duration.

**Giải thích**
Không đo thì khó chứng minh quyết định công cụ là đúng.

**Ví dụ**
Dashboard weekly theo dõi p95 HMR và bundle budget.

### 🔴 [Senior] Thiết kế migration Webpack -> Vite như thế nào?

**Tổng Quan**
Chạy song song, so sánh parity outputs, rồi cắt dần plugins cũ.

**Giải thích**
Nên audit alias/env/css pipeline/test runner trước để tránh regress.

**Ví dụ**
2 sprint đầu dual-build, sprint 3 chuyển default Vite.

### 🔴 [Senior] Khi nào chọn Rspack thay vì Vite?

**Tổng Quan**
Khi cần compatibility Webpack cao và migration risk thấp.

**Giải thích**
Rspack giữ mental model Webpack nên team enterprise chuyển dễ hơn.

**Ví dụ**
Repo có 40+ custom webpack plugins ưu tiên Rspack trước.

### 🔴 [Senior] Làm sao kiểm soát regress bundle size liên tục?

**Tổng Quan**
Đặt budget gate trong CI + artifact diff analyzer.

**Giải thích**
Cần fail PR khi vượt ngưỡng và chỉ ra module gây tăng.

**Ví dụ**
`main.js` > 200KB gzip sẽ fail build và đính kèm treemap.

### 🔴 [Senior] Bạn tối ưu pipeline cho monorepo FE lớn thế nào?

**Tổng Quan**
Dùng affected-only tasks + remote cache + deterministic lockfile installs.

**Giải thích**
Mục tiêu giảm thời gian phản hồi PR và chi phí CI.

**Ví dụ**
PR đổi package utils chỉ test/build apps phụ thuộc trực tiếp.

### 🔴 [Senior] Giải quyết HMR flaky ở quy mô lớn ra sao?

**Tổng Quan**
Bật debug graph invalidation và xác định module side effects.

**Giải thích**
Thường gốc lỗi là mutable singleton, circular deps, hoặc plugin nondeterministic transform.

**Ví dụ**
Tách side effect khỏi module UI và thêm accept boundary rõ ràng.

### 🔴 [Senior] Trade-off Module Federation lớn nhất là gì?

**Tổng Quan**
Được độc lập deploy nhưng tăng governance/version/runtime complexity.

**Giải thích**
Cần ownership contract, observability, và fallback khi remote lỗi.

**Ví dụ**
Remote profile down thì shell phải có UI fallback graceful.

### 🔴 [Senior] Nên benchmark build tools như thế nào cho công bằng?

**Tổng Quan**
Cố định machine, cache state, project snapshot, và bộ metric chung.

**Giải thích**
Benchmark thiếu kiểm soát dễ dẫn đến quyết định sai.

**Ví dụ**
So sánh 10 lần chạy cold/warm, lấy median + p95.

### 🔴 [Senior] Build optimization có liên quan runtime perf không?

**Tổng Quan**
Có, rất trực tiếp qua parse/compile/execute cost của JS.

**Giải thích**
Bundle nhỏ hơn không phải lúc nào cũng nhanh hơn nếu chia chunk quá vụn.

**Ví dụ**
Tối ưu cần cân bằng request overhead và parse cost.

### 🔴 [Senior] Bạn trình bày quyết định toolchain với management ra sao?

**Tổng Quan**
Nói bằng số liệu thời gian dev/CI và risk migration, không chỉ cảm nhận.

**Giải thích**
Lãnh đạo quan tâm ROI, rủi ro rollout, và impact productivity.

**Ví dụ**
Đề xuất migration theo phase với KPI từng phase.

### 🔴 [Senior] Khi nào không nên đổi build tool?

**Tổng Quan**
Khi pain-point không nằm ở bundler hoặc rủi ro migration cao hơn lợi ích.

**Giải thích**
Nhiều vấn đề do kiến trúc app hoặc dependency governance, không phải tool.

**Ví dụ**
CI chậm do test integration nặng thì đổi bundler không giúp nhiều.

## Kết Luận / Summary
- Build tools là lớp nền ảnh hưởng trực tiếp DX, chi phí CI, và performance production.
- Kỹ năng phỏng vấn tốt là trả lời bằng mô hình hệ thống + số liệu thực nghiệm + trade-off rõ ràng.
- Hãy liên kết quyết định toolchain với mục tiêu sản phẩm và cấu trúc tổ chức, không tách rời.

---

[Back to Table of Contents](../00-table-of-contents.md)
