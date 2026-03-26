# Bundle Optimization / Tối Ưu Bundle

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Browser Performance - Chapter 3 / Hiệu Suất Trình Duyệt - Chương 3


---

## Overview / Tổng Quan
- Tài liệu này tập trung vào tối ưu bundle cho ứng dụng Frontend hiện đại (Webpack/Vite/Rollup/esbuild).
- Mục tiêu phỏng vấn: hiểu rõ trade-off giữa kích thước JS, số lượng request, thời gian parse/execute và trải nghiệm người dùng.
- Trọng tâm thực chiến: code splitting, tree shaking, lazy loading, preload/prefetch, CDN, compression, performance budget.

## Related Reading / Tài Liệu Liên Quan
- [Core Web Vitals](./01-core-web-vitals.md)
- [Web Performance Comprehensive](./04-web-performance-comprehensive.md)
- [Caching Patterns (Shared)](../../shared/02-system-design/caching-patterns.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1. What is a bundle in modern frontend build pipelines?
**Tổng Quan:**
- Bundle là artifact JavaScript/CSS đã được gom từ nhiều module để browser tải và chạy.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Mô tả bundle như một artifact có trade-off — fewer requests vs larger parse cost; đề cập content hashing cho cache invalidation.
❌ Weak: Chỉ nói "bundle là gom nhiều file JS lại thành một file" mà không nêu tại sao cần tách hoặc hậu quả của bundle quá lớn.

### 🟢 [Junior] Q2. Compare Webpack and Vite bundling models.
**Tổng Quan:**
- Webpack thiên về build graph + plugin ecosystem lâu năm; Vite dev dùng native ESM, build production dựa trên Rollup.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích Vite dùng native ESM trong dev (không bundle) → HMR nhanh hơn; còn prod build dùng Rollup → output nhỏ hơn. Nêu trade-off: Webpack có hệ sinh thái plugin rộng hơn, phù hợp monorepo phức tạp.
❌ Weak: Chỉ nói "Vite nhanh hơn Webpack" mà không giải thích tại sao, hoặc không biết Vite prod build dùng Rollup.

### 🟢 [Junior] Q3. Why does large JavaScript hurt performance even on fast networks?
**Tổng Quan:**
- Chi phí parse/compile/execute trên main thread thường gây chậm hơn thời gian tải mạng ở thiết bị yếu.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Nêu được ba giai đoạn: download → parse/compile → execute; giải thích parse/compile block main thread và ảnh hưởng TBT/INP; đề cập thiết bị mid-range thực tế ở Việt Nam/Đông Nam Á.
❌ Weak: Tập trung vào download size mà không nhắc parse cost, hoặc không biết TBT/INP bị ảnh hưởng thế nào.

### 🟢 [Junior] Q4. Explain route-based code splitting.
**Tổng Quan:**
- Mỗi route tạo chunk riêng để chỉ tải khi người dùng điều hướng tới route đó.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.
```tsx
// Route-based splitting with React Router
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ReportsPage = lazy(() => import('../pages/ReportsPage'));
export function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading route...</div>}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </Suspense>
  );
}
```
- Đo lại bằng Lighthouse + RUM để xác nhận tối ưu thật sự cải thiện trải nghiệm.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Mô tả được React.lazy + Suspense pattern, giải thích tại sao cần Suspense fallback để tránh blank screen, và nêu rủi ro waterfall nếu lazy load quá nhiều tầng lồng nhau.
❌ Weak: Chỉ biết "dùng React.lazy" mà không giải thích cơ chế dynamic import hoặc không nêu Suspense boundary cần đặt ở đâu.

### 🟢 [Junior] Q5. Explain component-based code splitting.
**Tổng Quan:**
- Tách các component nặng (chart/editor/map) thành chunk độc lập, import động khi thật sự cần.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Đưa ví dụ cụ thể như tách Monaco Editor hoặc Chart.js (100–300 KB) ra khỏi initial bundle; giải thích khi nào nên trigger load (user click, hover, viewport intersection).
❌ Weak: Không thể nêu ngưỡng kích thước nào đáng lazy load, hoặc nhầm giữa component splitting và route splitting.

### 🟢 [Junior] Q6. When should dynamic import() be used?
**Tổng Quan:**
- Dùng khi dependency không cần thiết ở initial render hoặc phụ thuộc ngữ cảnh runtime.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Nêu ba điều kiện dùng dynamic import: (1) không cần ở first paint, (2) phụ thuộc user action, (3) phụ thuộc feature flag. Đề cập magic comment `/* webpackChunkName */` hoặc Vite hint để đặt tên chunk.
❌ Weak: Nghĩ dynamic import chỉ dùng cho route, không biết có thể dùng cho utility library theo điều kiện runtime.

### 🟢 [Junior] Q7. What is tree shaking and when does it fail?
**Tổng Quan:**
- Tree shaking loại bỏ export không dùng, nhưng thất bại khi module có side effects hoặc dùng CommonJS động.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích tree shaking cần static ES module analysis; liệt kê các trường hợp thất bại: `require()` động, `sideEffects: true`, barrel file re-export, class method không được analyzed tĩnh.
❌ Weak: Chỉ nói "tree shaking xóa code không dùng" mà không giải thích tại sao CommonJS không tree-shakable hay khi nào `sideEffects` flag cần được set.

### 🟢 [Junior] Q8. How does dead code elimination differ from tree shaking?
**Tổng Quan:**
- Tree shaking ở mức module/export; dead code elimination ở mức biểu thức/nhánh điều kiện sau minification.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Phân biệt rõ: tree shaking = module-level (bundler phase), DCE = expression/branch-level (minifier phase như Terser/esbuild). Ví dụ: `if (process.env.NODE_ENV === 'production')` → Terser xóa nhánh dev trong prod build.
❌ Weak: Dùng "tree shaking" và "dead code elimination" như từ đồng nghĩa, không biết đây là hai bước riêng biệt trong build pipeline.

### 🟢 [Junior] Q9. How to configure sideEffects in package.json?
**Tổng Quan:**
- Khai báo sideEffects chính xác giúp bundler mạnh tay loại bỏ file không cần, tránh mất code runtime quan trọng.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.
```json
{
  "name": "my-app",
  "sideEffects": [
    "**/*.css",
    "src/polyfills/**"
  ]
}
```
- Đo lại bằng Lighthouse + RUM để xác nhận tối ưu thật sự cải thiện trải nghiệm.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích `sideEffects: false` cho phép bundler loại bỏ toàn bộ file nếu không có named import nào được dùng; giải thích tại sao CSS files phải luôn được liệt kê (CSS import có side effect — thêm style vào DOM).
❌ Weak: Không biết `sideEffects` field là gì, hoặc set `sideEffects: false` mà không kiểm tra CSS/polyfill import bị xóa nhầm.

### 🟢 [Junior] Q10. Why are source maps useful in optimization?
**Tổng Quan:**
- Source map giúp phân tích thành phần bundle theo source gốc để tìm dependency nặng.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Nêu hai use case: (1) debug minified code trong DevTools, (2) dùng với source-map-explorer/webpack-bundle-analyzer để trace kích thước về package gốc. Đề cập trade-off bảo mật: không nên ship source map ra prod publicly.
❌ Weak: Chỉ biết source map dùng để debug, không biết dùng để phân tích bundle composition.

### 🟢 [Junior] Q11. How to read webpack-bundle-analyzer treemap?
**Tổng Quan:**
- Xem block lớn nhất theo parsed/gzip size, truy ngược package và đánh giá có thể lazy load hoặc thay thế.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Mô tả quy trình: bật analyzer → xem stat/parsed/gzip view → tìm block chiếm >10% → hỏi "có thể lazy load không?" hoặc "có alternative nhẹ hơn không?". Biết phân biệt stat size vs parsed size vs gzip size.
❌ Weak: Chưa bao giờ dùng webpack-bundle-analyzer, hoặc không biết sự khác nhau giữa các size modes trong treemap.

### 🟢 [Junior] Q12. What does source-map-explorer provide?
**Tổng Quan:**
- Cung cấp bức tranh package-level trên từng bundle file, tiện cho pipeline CI nhanh.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: So sánh được với webpack-bundle-analyzer: source-map-explorer nhẹ hơn, chạy trên file đã build + source map, phù hợp CI report; webpack-bundle-analyzer có interactive UI tốt hơn cho investigation.
❌ Weak: Không biết tool này tồn tại, hoặc nhầm với webpack-bundle-analyzer.

### 🟢 [Junior] Q13. What is vendor chunk and why separate it?
**Tổng Quan:**
- Tách dependency ít đổi khỏi app code để tận dụng cache lâu dài sau các lần deploy.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích cơ chế cache: vendor chunk có content hash ổn định qua nhiều deploy → browser cache hit; app chunk thay đổi thường xuyên → invalidate riêng mà không làm mất vendor cache.
❌ Weak: Không giải thích được tại sao tách vendor giúp cache, hoặc không biết rằng vendor chunk quá lớn (>500KB) lại gây vấn đề khác.

### 🟢 [Junior] Q14. How does long-term caching relate to chunk hashing?
**Tổng Quan:**
- Filename có content hash giúp cache-busting chính xác theo nội dung thay đổi.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.
```html
<!-- preload for immediate render dependency -->
<link rel="preload" href="/assets/hero.chunk.js" as="script" />
<!-- prefetch for likely next navigation -->
<link rel="prefetch" href="/assets/settings.chunk.js" as="script" />
```
- Đo lại bằng Lighthouse + RUM để xác nhận tối ưu thật sự cải thiện trải nghiệm.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích content hash vs chunkhash vs fullhash; tại sao cần runtime chunk riêng (tránh vendor hash thay đổi khi app code thay đổi); kết hợp với `Cache-Control: immutable`.
❌ Weak: Chỉ biết "thêm hash vào tên file" mà không giải thích tại sao runtime chunk ảnh hưởng đến hash của vendor chunk nếu không tách.

### 🟢 [Junior] Q15. Difference between preload and prefetch.
**Tổng Quan:**
- preload ưu tiên cao cho resource sắp dùng ngay; prefetch ưu tiên thấp cho khả năng dùng ở lần điều hướng sau.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Phân biệt: preload = "tôi cần resource này ngay bây giờ" (high priority, same navigation), prefetch = "tôi có thể cần ở trang sau" (low priority, idle time). Nêu hậu quả: preload sai resource = bandwidth wasted + LCP bị push xuống.
❌ Weak: Nhầm lẫn hai khái niệm hoặc không biết preload có thể làm hại nếu dùng sai (competing with critical resources).

### 🟢 [Junior] Q16. How to avoid over-prefetching?
**Tổng Quan:**
- Giới hạn prefetch theo hành vi người dùng, network condition, và không prefetch cho nhóm chunk hiếm dùng.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Đề cập `navigator.connection.saveData` và `effectiveType` để skip prefetch trên slow/metered connections; chỉ prefetch top-N routes theo analytics data; tránh prefetch toàn bộ route tree.
❌ Weak: Không biết `saveData` API, hoặc prefetch toàn bộ app routes mà không dựa vào dữ liệu hành vi người dùng.

### 🟡 [Mid] Q17. Explain compression: gzip vs brotli.
**Tổng Quan:**
- Brotli thường nén tốt hơn gzip cho text assets nhưng chi phí nén server cao hơn nếu nén on-the-fly.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: So sánh tỷ lệ nén (Brotli level 11 ~15-20% nhỏ hơn gzip); giải thích best practice: pre-compress at build time + CDN serve, không nén on-the-fly với Brotli level cao. Biết Brotli chỉ qua HTTPS.
❌ Weak: Không biết Brotli chỉ hoạt động qua HTTPS, hoặc không biết pre-compression là cần thiết để tận dụng Brotli mà không tốn CPU server.

### 🟡 [Mid] Q18. How image optimization affects bundle strategy?
**Tổng Quan:**
- Giảm ảnh inline/base64 quá mức, ưu tiên modern formats và responsive images để giảm transfer + decode cost.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích base64 inline tăng JS bundle size và không cache được riêng; ưu tiên WebP/AVIF + `srcset`; lazy load ảnh below-fold bằng `loading="lazy"`; tránh nhúng ảnh lớn vào CSS modules.
❌ Weak: Không thấy mối liên hệ giữa image optimization và bundle size, hoặc không biết base64 ảnh làm tăng JS bundle.

### 🟡 [Mid] Q19. How font loading impacts JS performance?
**Tổng Quan:**
- Font blocking có thể che lấp lợi ích tối ưu JS; nên dùng subset + font-display để giảm layout delay.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích FOIT/FOUT; `font-display: swap` vs `optional`; preload critical font variant; unicode-range subsetting để giảm font file size; self-hosting vs Google Fonts trade-off về privacy/cache.
❌ Weak: Chỉ biết "dùng font-display: swap" mà không giải thích FOIT/FOUT, hoặc không biết font blocking ảnh hưởng CLS/LCP.

### 🟡 [Mid] Q20. What is chunk graph optimization?
**Tổng Quan:**
- Điều chỉnh splitChunks/manualChunks để tránh chunk quá nhỏ hoặc duplicate dependency giữa chunks.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.
```js
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        reactVendor: { test: /[\/]node_modules[\/](react|react-dom)[\/]/, name: 'react-vendor', priority: 20 },
        chartVendor: { test: /[\/]node_modules[\/](d3|echarts)[\/]/, name: 'chart-vendor', priority: 15 },
      },
    },
    runtimeChunk: "single",
  },
};
```
- Đo lại bằng Lighthouse + RUM để xác nhận tối ưu thật sự cải thiện trải nghiệm.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Nêu vấn đề duplicate module (khi module dùng bởi nhiều async chunks → được bundle vào từng chunk thay vì chia sẻ); giải thích `minChunks` threshold; biết dùng analyzer để kiểm tra duplicate.
❌ Weak: Không biết chunk graph là gì, hoặc chỉ biết copy-paste splitChunks config mà không hiểu `priority`, `minChunks`, `minSize` làm gì.

### 🟡 [Mid] Q21. How to detect duplicate dependencies in bundle?
**Tổng Quan:**
- Dùng analyzer + lockfile audit để phát hiện nhiều version cùng package trong output.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Nêu tool cụ thể: `webpack-bundle-analyzer` (visual), `duplicate-package-checker-webpack-plugin` (CI warning), `npm dedupe` / `yarn dedupe`. Giải thích tại sao multiple React versions là critical — hooks không hoạt động đúng.
❌ Weak: Không biết cách detect duplicate, hoặc không biết hậu quả của multiple React/lodash versions trong bundle.

### 🟡 [Mid] Q22. What is module federation in Webpack 5?
**Tổng Quan:**
- Cho phép nhiều app chia sẻ module runtime giữa host và remote để giảm coupling khi scale team.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích host/remote/shared concept; nêu use case: micro-frontend deployment độc lập; nêu trade-off: versioning conflict, runtime error nếu remote unavailable, khó debug cross-app.
❌ Weak: Mô tả module federation như "chia sẻ code giữa app" mà không giải thích runtime loading hay shared singleton dependency management.

### 🟡 [Mid] Q23. Bundle optimization for micro-frontends?
**Tổng Quan:**
- Chuẩn hóa shared deps, semver policy và budget riêng cho từng remote để tránh bùng nổ kích thước tổng.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Nêu vấn đề thực tế: 5 micro-frontend mỗi cái load React riêng = 5x React bundle. Giải thích shared singleton qua module federation hoặc import map; nêu governance: mỗi team có budget limit, CI gate.
❌ Weak: Không thấy được vấn đề bundle bloat trong micro-frontend, hoặc không biết shared dependency cần được quản lý qua shared singleton.

### 🟡 [Mid] Q24. How does HTTP/2 change bundling decisions?
**Tổng Quan:**
- HTTP/2 giảm penalty nhiều request nên có thể tách nhỏ hơn, nhưng vẫn phải cân bằng parse overhead JS.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: HTTP/2 multiplexing giảm connection overhead → có thể tách nhiều chunk nhỏ hơn mà không bị penalty. Nhưng vẫn phải chú ý: nhiều file nhỏ = nhiều parse overhead riêng lẻ, cache invalidation phức tạp hơn.
❌ Weak: Kết luận "HTTP/2 nên bundle ít lại" mà không nhắc CPU parse cost, hoặc không biết HTTP/2 server push đã bị deprecated.

### 🟡 [Mid] Q25. What are performance budgets?
**Tổng Quan:**
- Budget là ngưỡng định lượng (KB/TTI/LCP) dùng để chặn regression trong CI.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Nêu được ba loại budget: quantity (file size), timing (LCP, TTI), rule (no new render-blocking resource). Giải thích cách enforce trong CI với Lighthouse CI hoặc bundlesize; phân biệt budget per route vs global budget.
❌ Weak: Nghĩ performance budget chỉ là "file phải nhỏ hơn X KB" mà không biết timing budget hay cách tích hợp CI gate.

### 🟡 [Mid] Q26. How to set realistic JS budget per route?
**Tổng Quan:**
- Dựa trên thiết bị mục tiêu, mạng phổ biến, và baseline hiện tại; thường thiết lập initial JS theo route quan trọng.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Dùng công thức: TTI target → network time budget → parse/exec budget → JS size budget; nêu số cụ thể (ví dụ: ~130KB gzipped initial JS cho mid-range device + 4G); điều chỉnh theo RUM data thực.
❌ Weak: Đặt budget tùy tiện không dựa trên device/network data, hoặc không biết cách tính ngược từ TTI target.

### 🟡 [Mid] Q27. How to optimize third-party scripts?
**Tổng Quan:**
- Audit giá trị kinh doanh, lazy load theo consent/interaction, self-host khi cần, và đo INP/LCP ảnh hưởng.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.
```tsx
// Lazy load third-party only after user interaction
async function openSupportChat() {
  const { mountChat } = await import('./chat-widget');
  mountChat();
}
```
- Đo lại bằng Lighthouse + RUM để xác nhận tối ưu thật sự cải thiện trải nghiệm.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Mô tả quy trình: audit tất cả third-party bằng Network tab → categorize by business value → defer/lazy load những cái không critical → đo INP/TBT impact trước và sau. Đề cập `dns-prefetch` cho domains của 3rd party.
❌ Weak: Chỉ biết "lazy load third-party", không biết cách đo impact hoặc không biết cách negotiate với business về việc remove script không cần thiết.

### 🟡 [Mid] Q28. What is critical rendering path in bundling context?
**Tổng Quan:**
- Chỉ nên để resource cần cho first paint ở critical path; còn lại defer/async/lazy.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích render-blocking resource (sync script/CSS trong `<head>`); phân biệt `defer` vs `async` behavior; nêu inline critical CSS cho above-fold; mô tả waterfall diagram trong DevTools để visualize critical path.
❌ Weak: Nhầm critical rendering path với critical CSS, hoặc không biết `defer` vs `async` khác nhau thế nào trong execution order.

### 🟡 [Mid] Q29. How to optimize CSS chunks?
**Tổng Quan:**
- Tách critical CSS, loại unused CSS, giảm cascade complexity và inline phần nhỏ cần first render.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Mô tả MiniCssExtractPlugin + PurgeCSS/UnCSS pipeline; inline critical CSS với Critters; per-route CSS chunk để chỉ load CSS cần thiết; cảnh báo về PurgeCSS false positive với dynamic class names.
❌ Weak: Không biết CSS cũng có thể tách thành chunk, hoặc không biết về PurgeCSS false positive khi dùng dynamic class names.

### 🟡 [Mid] Q30. How does SSR/SSG interact with bundle optimization?
**Tổng Quan:**
- SSR giảm JS cần để hiển thị ban đầu nhưng hydration bundle vẫn phải tối ưu để tránh main-thread spike.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích SSR cải thiện FCP/LCP nhưng hydration vẫn tốn JS; đề cập partial hydration/islands architecture (Astro, Qwik) để giảm hydration cost; nêu bundle strategy cho client vs server bundle khác nhau.
❌ Weak: Nghĩ SSR/SSG tự động giải quyết bundle size, không biết hydration cost vẫn là vấn đề thực sự.

### 🟡 [Mid] Q31. What is hydration cost and how to reduce?
**Tổng Quan:**
- Hydration là chi phí gắn event/state lên HTML SSR; giảm bằng partial hydration/islands và component nhẹ.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Mô tả "uncanny valley" — page trông đã render nhưng chưa interactive vì hydration chưa xong; đề cập progressive/deferred hydration; React Server Components để loại bỏ client JS hoàn toàn cho static parts.
❌ Weak: Không biết hydration khác rendering thế nào, hoặc không biết islands architecture là gì.

### 🟡 [Mid] Q32. How to prioritize route chunks?
**Tổng Quan:**
- Ưu tiên chunk cho funnel chính, checkout/login/dashboard trước các trang phụ trợ ít traffic.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Dùng analytics data (traffic, conversion funnel) để quyết định route nào nên prefetch; chỉ preload immediate next-step chunk; nêu `<link rel="prefetch">` placement strategy dựa trên user journey.
❌ Weak: Prefetch tất cả routes mà không dựa vào data, hoặc không phân biệt được route nào quan trọng hơn từ góc nhìn business.

### 🟡 [Mid] Q33. What is cache-control strategy for chunks?
**Tổng Quan:**
- Chunk hashed dùng immutable max-age dài; HTML dùng no-cache để luôn lấy manifest mới.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.
```http
Cache-Control: public, max-age=31536000, immutable
```
```http
Cache-Control: no-cache
```
- Đo lại bằng Lighthouse + RUM để xác nhận tối ưu thật sự cải thiện trải nghiệm.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích đầy đủ: hashed JS/CSS = `immutable` (không bao giờ revalidate); HTML entry = `no-cache` (luôn check server); `no-store` vs `no-cache` khác nhau thế nào; rolling deploy stale chunk error handling.
❌ Weak: Set `max-age=31536000` cho cả HTML entry → users không thấy update sau deploy; hoặc không biết `immutable` directive nghĩa là gì.

### 🟡 [Mid] Q34. How does CDN edge caching support bundle delivery?
**Tổng Quan:**
- CDN giảm RTT và offload origin, đặc biệt hiệu quả cho static assets hashed.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích CDN pop geography → giảm RTT; edge cache hit rate phụ thuộc cache key và content-hash stability; nêu CDN purge strategy khi có emergency rollback; S3+CloudFront vs Cloudflare trade-off.
❌ Weak: Nghĩ CDN chỉ dùng để "tăng tốc" mà không biết cache key, TTL, purge API, hay origin shield là gì.

### 🟡 [Mid] Q35. What is differential serving?
**Tổng Quan:**
- Phân phối bundle theo capability trình duyệt (modern/legacy) để tránh polyfill dư thừa.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích `type="module"` (modern) vs `nomodule` (legacy) pattern; modern bundle nhỏ hơn vì không cần polyfill ES5; nêu build complexity tăng nhưng ROI lớn khi legacy browser < 5%.
❌ Weak: Không biết `module`/`nomodule` pattern, hoặc vẫn polyfill toàn bộ cho tất cả browser mà không phân biệt user agent.

### 🟡 [Mid] Q36. How to manage polyfills efficiently?
**Tổng Quan:**
- Dùng polyfill theo usage-targeted, tránh import toàn bộ core-js khi chỉ cần vài feature.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Phân biệt `useBuiltIns: 'usage'` vs `'entry'` trong Babel; đề cập polyfill.io CDN approach (serve theo UA); nêu core-js 3 tree-shaking; cảnh báo về duplicate polyfill từ multiple dependencies.
❌ Weak: Import `import 'core-js/stable'` toàn bộ, hoặc không biết `useBuiltIns: 'usage'` và `targets` trong Babel config liên quan thế nào đến bundle size.

### 🔴 [Senior] Q37. Explain lazy loading anti-patterns.
**Tổng Quan:**
- Lazy quá mức tạo waterfall request hoặc jank khi interaction; cần preload có chọn lọc.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Liệt kê ít nhất 3 anti-pattern: (1) lazy load component được dùng ngay trên critical path, (2) lazy load tạo waterfall (A lazy-loads B, B lazy-loads C), (3) không có Suspense fallback → blank/flash. Nêu cách khắc phục: preload on hover/focus.
❌ Weak: Chỉ biết "không nên lazy load quá nhiều" mà không mô tả được waterfall problem hay cách detect nó trong DevTools.

### 🔴 [Senior] Q38. How to avoid chunk load failures in production?
**Tổng Quan:**
- Implement retry/backoff + graceful fallback UI + versioning strategy cho deploy rolling.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.
```ts
const chunkLoadWithRetry = async (loader: () => Promise<unknown>, retries = 2) => {
  let lastError: unknown;
  for (let i = 0; i <= retries; i += 1) {
    try {
      return await loader();
    } catch (error) {
      lastError = error;
      await new Promise((r) => setTimeout(r, 300 * (i + 1)));
    }
  }
  throw lastError;
};
```
- Đo lại bằng Lighthouse + RUM để xác nhận tối ưu thật sự cải thiện trải nghiệm.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Nêu đầy đủ ba nguyên nhân chunk load failure: network flakiness, stale URL sau deploy, CDN propagation lag. Giải thích: retry với backoff, fallback UI (ErrorBoundary), và `window.location.reload()` sau deploy detection.
❌ Weak: Chỉ biết "retry" mà không biết root cause (deploy invalidation vs network), hoặc không biết ErrorBoundary là nơi catch chunk load errors.

### 🔴 [Senior] Q39. What metrics validate bundle optimization success?
**Tổng Quan:**
- Theo dõi JS transfer, parse/exec time, TBT/INP/LCP theo route và thiết bị thực.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Phân biệt lab metrics (Lighthouse) vs field metrics (CrUX/RUM); nêu JS parse time từ DevTools Performance tab; đề cập per-route bundle size delta tracking trong CI; và long-task count trước/sau optimization.
❌ Weak: Chỉ nói "Lighthouse score tăng" mà không phân biệt lab vs field, hoặc không biết làm sao đo parse time JS trên thiết bị thực.

### 🔴 [Senior] Q40. How to optimize npm dependency footprint?
**Tổng Quan:**
- Chọn package ESM/tree-shakable, so sánh alternative nhẹ hơn, và loại bỏ transitive không dùng.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Đề cập bundlephobia.com để so sánh trước khi install; kiểm tra `module` / `exports` field trong package.json để xác nhận ESM support; nêu ví dụ cụ thể: `date-fns` thay `moment`, `nanoid` thay `uuid`.
❌ Weak: Install package mà không kiểm tra size impact, hoặc không biết package có ESM export hay không ảnh hưởng tree-shaking như thế nào.

### 🔴 [Senior] Q41. What is import cost review in PR process?
**Tổng Quan:**
- PR nên hiển thị delta bundle size để reviewer phát hiện import nặng trước khi merge.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Nêu công cụ cụ thể: `size-limit` (threshold CI fail), `bundlemon` (PR comment với delta), VS Code Import Cost extension (inline size warning). Giải thích workflow: build artifact comparison giữa base branch và PR branch.
❌ Weak: Không có quy trình kiểm soát bundle trong PR, hoặc chỉ review bằng mắt mà không có tool tự động.

### 🔴 [Senior] Q42. How to tune splitChunks in Webpack?
**Tổng Quan:**
- Cân chỉnh minSize, maxAsyncRequests, cacheGroups để tránh both mega-chunks và micro-chunks.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích `minSize` (min KB để tách), `minChunks` (min số entry dùng module), `maxAsyncRequests` (max parallel chunk load), `priority` (khi module match nhiều cacheGroup). Nêu quá trình iterate: build → analyze → adjust → verify.
❌ Weak: Copy-paste config từ Stack Overflow mà không hiểu từng parameter, hoặc không biết cách verify kết quả tách chunk có đúng ý định không.

### 🔴 [Senior] Q43. How Vite manualChunks helps optimization?
**Tổng Quan:**
- manualChunks cho phép group dependency theo domain để caching ổn định và debug rõ ràng.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích Vite/Rollup default chunking đôi khi không tối ưu cho caching; `manualChunks` như function (nhận module ID, return chunk name) cho phép fine-grained control; nêu circular dependency risk khi split sai.
❌ Weak: Chỉ biết `manualChunks` là object config mà không biết function form, hoặc không biết khi nào nên dùng vs để Rollup tự quyết định.

### 🔴 [Senior] Q44. How to optimize Web Workers bundling?
**Tổng Quan:**
- Đẩy tác vụ nặng khỏi main thread và tách worker bundle riêng, chỉ tải khi cần.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.
```ts
// vite.config.ts
import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'editor-vendor': ['monaco-editor'],
        },
      },
    },
  },
});
```
- Đo lại bằng Lighthouse + RUM để xác nhận tối ưu thật sự cải thiện trải nghiệm.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích `new Worker(new URL('./worker.ts', import.meta.url))` syntax trong Vite; worker bundle được tree-shaken riêng; comlink để type-safe communication; nêu use case: image processing, CSV parsing, crypto.
❌ Weak: Không biết cách bundle worker trong Vite/Webpack, hoặc không biết worker không share DOM API nên cần import riêng.

### 🔴 [Senior] Q45. What is runtime chunk and why isolate it?
**Tổng Quan:**
- Runtime chunk chứa mapping module/chunk; tách riêng giúp cache vendor/app ổn định hơn.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích runtime chunk = module registry (biết chunk ID nào ở URL nào); khi embed vào vendor chunk → mọi app code change làm hash vendor thay đổi → cache miss toàn bộ. Tách runtime = chỉ runtime nhỏ (<5KB) bị invalidate.
❌ Weak: Không biết runtime chunk là gì, hoặc không hiểu tại sao `runtimeChunk: 'single'` lại quan trọng cho cache stability.

### 🔴 [Senior] Q46. How to build a bundle governance process?
**Tổng Quan:**
- Thiết lập owner, budget, CI gate, dashboard theo route/team để duy trì performance dài hạn.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Mô tả quy trình đầy đủ: (1) budget per route, (2) CI gate với size-limit, (3) weekly dashboard cho eng leads, (4) budget approval process khi cần tăng, (5) quarterly audit. Nêu org challenge: ai là owner khi route có nhiều team cùng contribute.
❌ Weak: Chỉ có CI gate mà không có ownership model, hoặc không có process review budget định kỳ.

### 🔴 [Senior] Q47. How to answer trade-off questions in interviews?
**Tổng Quan:**
- Luôn nêu context người dùng, dữ liệu đo đạc, phương án A/B và rủi ro vận hành.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Dùng framework STAR-P (Situation → Trade-off → Action → Result → Prevent regression): nêu context, đo baseline, so sánh options, implement + verify, CI gate để không regress. Dùng số thực tế thay vì "khoảng", "tầm".
❌ Weak: Trả lời một chiều ("chỉ cần làm X"), không nêu downside, hoặc không có dữ liệu chứng minh quyết định.

---

## Practical Checklist / Checklist Thực Chiến
- Đặt performance budget cho từng route trọng yếu (Home, Search, Checkout).
- Bật bundle analyzer trong CI để fail build khi vượt ngưỡng.
- Kiểm soát third-party scripts theo business value.
- Chuẩn hóa cache headers cho static assets qua CDN.
- Theo dõi real-user metrics để tránh tối ưu "đẹp trên lab nhưng kém ngoài đời thực".

## Cross References / Điều Hướng Kiến Thức
- [Web Performance Comprehensive](./04-web-performance-comprehensive.md)
- [Core Web Vitals](./01-core-web-vitals.md)
- [Caching Patterns (Shared)](../../shared/02-system-design/caching-patterns.md)


## Advanced Drill Q&A / Bộ Câu Hỏi Nâng Cao

### 🟡 [Mid] Extra Q1. How to prevent vendor chunk from becoming too large?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Đề xuất split vendor thành nhiều cacheGroups theo domain (react-vendor, ui-vendor, chart-vendor); nêu ngưỡng cụ thể (ví dụ: không chunk nào vượt 200KB parsed); biết dùng `maxSize` để auto-split chunk quá lớn.
❌ Weak: Chỉ nói "tách vendor ra" mà không có chiến lược grouping hay threshold cụ thể.

### 🟡 [Mid] Extra Q2. How to evaluate CPU cost vs transfer size trade-off?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích dùng DevTools CPU throttling (6x slowdown) để simulate mid-range device; so sánh parse time trên V8 vs JavaScriptCore; nêu khi nào transfer size quan trọng hơn (slow network) và khi nào CPU cost quan trọng hơn (fast network, old device).
❌ Weak: Chỉ tối ưu file size mà không đo parse/execute time, hoặc không biết cách dùng Performance tab để phân tích.

### 🟡 [Mid] Extra Q3. When to split by feature flags?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Nêu use case: feature chỉ enabled cho 10% users → dynamic import theo flag → 90% users không download code. Nêu complexity: cần server-side flag injection hoặc client-side runtime check; flag cleanup debt.
❌ Weak: Không biết feature flag có thể kết hợp với dynamic import để tránh ship code cho user không cần, hoặc không nêu được cleanup strategy.

### 🟡 [Mid] Extra Q4. How to manage locale bundles for i18n-heavy apps?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Dynamic import locale file theo detected language; lazy load non-default locales; split per-namespace (common, checkout, profile) thay vì một file locale lớn; CDN cache per-locale.
❌ Weak: Bundle tất cả locales vào initial bundle, hoặc không biết cách split locale file theo namespace.

### 🟡 [Mid] Extra Q5. How to optimize analytics SDK loading?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Load analytics async sau LCP event; queue events trước khi SDK load; dùng `requestIdleCallback` để init SDK; nêu trade-off: quá lazy → mất first-session events; quá eager → block LCP.
❌ Weak: Load analytics synchronously trong `<head>`, hoặc không biết event queuing pattern khi SDK chưa load xong.

### 🟡 [Mid] Extra Q6. How to bundle web workers for data-heavy apps?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích `?worker` suffix trong Vite; worker pool pattern để reuse; `SharedArrayBuffer` + `Atomics` cho high-frequency communication; nêu OffscreenCanvas cho rendering-heavy workers.
❌ Weak: Không biết cách import worker trong Vite/Webpack modern syntax, hoặc không biết worker không thể access DOM.

### 🔴 [Senior] Extra Q7. How to choose image CDN transformations safely?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Giải thích URL-based transformation (Cloudinary/Imgix); cần allowlist transform parameters để tránh cache bombing attack; signed URLs cho sensitive images; nêu trade-off: on-the-fly transform cost vs pre-generate at upload time.
❌ Weak: Không biết URL-based transformation có thể bị abuse, hoặc không biết cần allowlist dimensions để tránh cache thrashing.

### 🔴 [Senior] Extra Q8. How to detect preload misuse in production?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Dùng Lighthouse "Avoid unused preloads" audit; Network tab lọc "Initiator: preload" và check nếu resource không được dùng trong 3s sau load; RUM custom metric: preloaded resource usage rate.
❌ Weak: Không biết cách detect unused preload, hoặc không biết preload không dùng gây bandwidth waste và Lighthouse penalty.

### 🔴 [Senior] Extra Q9. How to prioritize above-the-fold JS modules?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Xác định component nào render above-fold bằng DevTools; preload JS chunk của những component đó; tránh lazy-load component ở hero section; nêu `fetchpriority="high"` attribute cho critical script tags.
❌ Weak: Lazy load tất cả components bao gồm cả hero section, hoặc không biết `fetchpriority` attribute tồn tại.

### 🔴 [Senior] Extra Q10. How to keep bundle strategy stable across many teams?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Centralized webpack/vite config package (shared tooling); linting rules cấm import toàn bộ library (`import _ from 'lodash'`); automated PR comment với bundle delta; platform team owns budget governance.
❌ Weak: Mỗi team tự cấu hình bundler riêng mà không có shared baseline, hoặc không có automated enforcement nào.

### 🔴 [Senior] Extra Q11. How to optimize source map policy for prod security?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
✅ Strong: Đề xuất: generate source maps nhưng không deploy publicly — upload riêng lên Sentry/Datadog. Dùng `hidden-source-map` mode (có sourceMappingURL comment bị xóa). Nêu IP leakage risk nếu ship full source map ra prod.
❌ Weak: Deploy source map ra public URL không bảo vệ, hoặc không generate source map nào cho prod khiến error monitoring không thể symbolicate.

---

## ⚡ Cold Call Simulation

**Câu hỏi khó nhất / Hardest Question:** Q42 — How to tune splitChunks in Webpack for a large production app?

**4-step 30-second answer / Trả lời 30 giây theo 4 bước:**

**Step 1 — Anchor with a real problem (3s):**
"Trước đây app chúng tôi có một vendor chunk 2MB — mọi deploy đều invalidate cache của toàn bộ user."

"Previously our app had a 2MB vendor chunk — every deploy invalidated cache for all users."

**Step 2 — Core mechanism (10s):**
"splitChunks hoạt động theo graph: `minSize` kiểm soát chunk nhỏ nhất được tách, `minChunks` xác định module phải được dùng bao nhiêu entry point trước khi tách, `cacheGroups` cho phép group theo pattern. `runtimeChunk: 'single'` tách runtime manifest riêng để vendor hash không đổi khi app code thay đổi."

"splitChunks works on the module graph: `minSize` controls minimum chunk size, `minChunks` sets how many entry points must use a module before splitting, `cacheGroups` lets you group by regex pattern. `runtimeChunk: 'single'` isolates the runtime manifest so vendor hashes stay stable across app deploys."

**Step 3 — Decision with trade-off (12s):**
"Chúng tôi tách thành 3 cacheGroups: `react-vendor` (react + react-dom, ~130KB), `ui-vendor` (MUI, ~200KB), `chart-vendor` (recharts, ~150KB). Mỗi group đổi độc lập. Trade-off: nhiều file hơn → nhiều request hơn, nhưng HTTP/2 + cache hit rate cao hơn bù đắp hoàn toàn."

"We split into 3 cacheGroups: `react-vendor` (~130KB), `ui-vendor` (~200KB), `chart-vendor` (~150KB). Each group invalidates independently. Trade-off: more files but HTTP/2 multiplexing plus higher cache hit rate more than compensates."

**Step 4 — Verify + prevent regression (5s):**
"Sau mỗi thay đổi, chạy `webpack-bundle-analyzer` để verify split đúng và `size-limit` trong CI để chặn regression về bundle size."

"After each change, run `webpack-bundle-analyzer` to verify the split is correct and `size-limit` in CI to prevent bundle size regression."

---

## Study Cases / Tình Huống Thực Tế Sâu

### Case 1: Webpack → Vite Migration at Scale / Di Chuyển Webpack → Vite Quy Mô Lớn

**Tình huống / Situation:**
Một công ty fintech có monorepo với 3 apps (customer portal, admin dashboard, agent tool), tổng cộng ~450 npm packages, build time với Webpack là 8 phút cold start, HMR 12-18 giây. Team frontend có 40 engineers trên 6 squads. Webpack config dài 800 dòng với nhiều custom plugin. Áp lực từ leadership: "dev velocity đang chậm vì build".

A fintech company has a monorepo with 3 apps, ~450 npm packages, 8-minute cold build with Webpack, and 12-18s HMR. 40 frontend engineers across 6 squads. Webpack config is 800 lines with custom plugins. Leadership pressure: "dev velocity is slow because of builds."

**Quyết định / Decision:**
Thay vì migrate toàn bộ ngay lập tức, team thực hiện phân tích rủi ro:
- Inventory toàn bộ Webpack plugin tự viết — 3/7 không có Vite equivalent → phải rewrite
- Identify environment-specific polyfill cần thiết (legacy browser support policy: IE11 đã drop 6 tháng trước → safe to move)
- Pilot trên `agent-tool` (app nhỏ nhất, 1 squad) trước
- Vite không bundle dev → cần đảm bảo dev server proxy rules được replicate

Tiêu chí thành công được định nghĩa trước: cold start <30s, HMR <2s, prod bundle ≤ Webpack output size, zero new prod incidents trong 2 tuần.

Rather than big-bang migration, the team did risk analysis: inventoried custom Webpack plugins (3/7 had no Vite equivalent → needed rewriting), confirmed IE11 support was dropped 6 months prior, piloted on the smallest app first.

Success criteria defined upfront: cold start <30s, HMR <2s, prod bundle ≤ Webpack output, zero new prod incidents for 2 weeks.

**Kết quả / Result:**
- `agent-tool`: cold start 8 phút → 4 giây (120x), HMR 15s → 280ms
- Prod bundle: Webpack 1.8MB gzip → Vite/Rollup 1.6MB gzip (11% nhỏ hơn, nhờ Rollup tree-shaking tốt hơn)
- Phát hiện issue: một số CSS Modules dùng `:global` selector không được process đúng → fix trong Vite config
- Migration `customer-portal` (app lớn nhất) mất 3 tuần vì cần rewrite 2 custom Webpack loader

**Bài học / Lessons:**
1. Pilot trên app nhỏ trước để phát hiện edge case mà không ảnh hưởng critical path.
2. Định nghĩa success criteria bằng số đo cụ thể trước khi bắt đầu — tránh "cảm giác nhanh hơn" không có bằng chứng.
3. Custom Webpack plugin/loader là nguồn rủi ro lớn nhất trong migration — inventory trước, budgeting thêm thời gian.
4. HMR improvement có tác động morale và productivity lớn hơn nhiều so với prod bundle size reduction.
5. Không phải mọi team cần migrate cùng lúc — feature flag để coexist Webpack và Vite trong monorepo trong thời gian chuyển tiếp.

---

### Case 2: Bundle Reduction tại E-commerce Scale / Giảm Bundle tại Quy Mô Thương Mại Điện Tử

**Tình huống / Situation:**
Một platform thương mại điện tử lớn tại Đông Nam Á (tương tự Shopee/Grab) có trang Product Detail Page (PDP) với initial JS bundle 980KB gzip. LCP trên thiết bị Android tầm trung ở mạng 4G là 4.8s (target <2.5s). 60% traffic đến từ mobile, 40% là thiết bị dưới 3 tuổi. Team nhận được pressure: mỗi 100ms cải thiện LCP = +0.8% conversion rate (dữ liệu RUM 6 tháng).

A large SEA e-commerce platform has a Product Detail Page with 980KB gzip initial JS. LCP on mid-range Android on 4G is 4.8s (target <2.5s). 60% mobile traffic, 40% on devices under 3 years old. Team data: every 100ms LCP improvement = +0.8% conversion rate.

**Quyết định / Decision:**
Ưu tiên theo impact/effort matrix:

1. **Route-based split + lazy load non-critical components** (effort: thấp, impact: cao): Tách Review Section (~120KB), Related Products carousel (~85KB), Seller Info widget (~60KB) ra khỏi initial bundle.

2. **Replace moment.js với date-fns** (effort: thấp, impact: trung bình): moment.js 230KB gzip → date-fns chỉ import functions dùng = 18KB.

3. **Image optimization pipeline** (effort: cao, impact: cao): Migrate từ PNG/JPEG sang AVIF/WebP với responsive srcset. Product images trung bình giảm từ 280KB → 85KB.

4. **Third-party audit**: Identify 4 analytics scripts không ai dùng từ 8 tháng trước → remove hoàn toàn. Remaining scripts load sau LCP event.

**Kết quả / Result:**
- Initial JS bundle: 980KB → 340KB gzip (65% reduction)
- LCP median: 4.8s → 2.1s (được đo trên thiết bị thực via RUM, không chỉ Lighthouse)
- Conversion rate: +4.2% trong 2 tuần A/B test
- Time to Interactive: 6.2s → 2.8s
- Chi phí CDN bandwidth giảm 28% (bonus: ảnh nhỏ hơn)

**Bài học / Lessons:**
1. Dùng impact/effort matrix thay vì tối ưu theo cảm tính — moment.js replacement mất 2 ngày nhưng tiết kiệm 212KB.
2. RUM data thực tế quan trọng hơn Lighthouse lab score — LCP trên Pixel 3a khác hẳn MacBook với throttling.
3. Third-party audit là "quick win" thường bị bỏ qua — 4 scripts không ai dùng chiếm ~80KB và gây 3 long tasks.
4. Performance improvement cần được đo bằng business metric (conversion), không chỉ technical metric (bundle size).
5. Governance quan trọng sau optimization: implement `size-limit` CI gate để tránh regress về 980KB sau 3 tháng khi team thêm features mới.

---

## Self-Check / Tự Kiểm Tra ⚡

**Đóng tài liệu trước khi làm / Close this document before attempting.**

---

### 5 Retrieval Prompts / 5 Câu Hỏi Gợi Nhớ

**1. Retrieval — Nhớ lại:**
Kể tên 4 điều kiện khiến tree shaking thất bại. Không được nhìn lại tài liệu.

Name 4 conditions that cause tree shaking to fail. No looking back.

**2. Visual — Vẽ sơ đồ:**
Vẽ sơ đồ flow: từ `import { Button } from 'react'` → bundler → output chunk. Đánh dấu điểm nào tree shaking xảy ra, điểm nào dead code elimination xảy ra.

Draw a flow diagram: from `import { Button } from 'react'` → bundler → output chunk. Mark where tree shaking happens vs where DCE happens.

**3. Application — Áp dụng:**
Bạn vừa join một project và phát hiện vendor chunk là 1.8MB. Bạn sẽ làm gì trong 2 giờ đầu để tìm nguyên nhân và đề xuất plan?

You just joined a project and found the vendor chunk is 1.8MB. What would you do in the first 2 hours to find the root cause and propose a plan?

**4. Debug — Tìm lỗi:**
User report: sau deploy mới, một số user thấy lỗi "ChunkLoadError: Loading chunk X failed". Bạn debug thế nào? Root cause là gì và fix ra sao?

Users report: after a new deploy, some users see "ChunkLoadError: Loading chunk X failed". How do you debug? What's the root cause and fix?

**5. Teach — Giải thích cho người mới:**
Giải thích cho một junior developer tại sao tách `runtimeChunk: 'single'` trong Webpack lại giúp cache vendor chunk ổn định hơn. Dùng ví dụ cụ thể, không dùng jargon.

Explain to a junior developer why setting `runtimeChunk: 'single'` in Webpack helps vendor chunk caching stay stable. Use a concrete example, no jargon.

---

### Feynman Prompt / Kiểm Tra Hiểu Sâu

Giải thích toàn bộ chiến lược bundle optimization — từ tree shaking đến chunk strategy đến CDN caching — như thể bạn đang thuyết trình cho một Product Manager không có background kỹ thuật. Mục tiêu: họ phải hiểu tại sao đây là investment đáng làm, không phải yêu cầu kỹ thuật trừu tượng.

Explain the entire bundle optimization strategy — from tree shaking to chunk strategy to CDN caching — as if you are presenting to a Product Manager with no technical background. Goal: they must understand why this is a worthwhile investment, not an abstract technical requirement.

---

### 🔁 Spaced Repetition Schedule / Lịch Ôn Tập Cách Quãng

**Ngày 3 / Day 3:** Làm lại 5 retrieval prompts trên. Đặc biệt chú ý Q7 (tree shaking failures) và Q42 (splitChunks tuning) — hai câu hay bị quên chi tiết nhất.

Redo the 5 retrieval prompts. Focus on Q7 (tree shaking failures) and Q42 (splitChunks tuning) — the two most commonly forgotten in detail.

**Ngày 7 / Day 7:** Mở một project thực, chạy `webpack-bundle-analyzer` hoặc `vite-bundle-visualizer`, áp dụng ít nhất 1 optimization từ tài liệu này, đo kết quả trước/sau.

Open a real project, run `webpack-bundle-analyzer` or `vite-bundle-visualizer`, apply at least 1 optimization from this document, measure before/after.

**Ngày 14 / Day 14:** Giải thích toàn bộ nội dung file này cho một người khác (hoặc rubber duck) trong 10 phút. Nếu có chỗ nào phải "giả vờ" giải thích được, đó là gap cần đọc lại.

Explain the entire content of this file to another person (or rubber duck) in 10 minutes. Any place where you have to "fake" an explanation is a gap to revisit.
