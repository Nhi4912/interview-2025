# Bundle Optimization / Tối Ưu Bundle
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

### 🟢 [Junior] Q2. Compare Webpack and Vite bundling models.
**Tổng Quan:**
- Webpack thiên về build graph + plugin ecosystem lâu năm; Vite dev dùng native ESM, build production dựa trên Rollup.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟢 [Junior] Q3. Why does large JavaScript hurt performance even on fast networks?
**Tổng Quan:**
- Chi phí parse/compile/execute trên main thread thường gây chậm hơn thời gian tải mạng ở thiết bị yếu.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

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

### 🟢 [Junior] Q5. Explain component-based code splitting.
**Tổng Quan:**
- Tách các component nặng (chart/editor/map) thành chunk độc lập, import động khi thật sự cần.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟢 [Junior] Q6. When should dynamic import() be used?
**Tổng Quan:**
- Dùng khi dependency không cần thiết ở initial render hoặc phụ thuộc ngữ cảnh runtime.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟢 [Junior] Q7. What is tree shaking and when does it fail?
**Tổng Quan:**
- Tree shaking loại bỏ export không dùng, nhưng thất bại khi module có side effects hoặc dùng CommonJS động.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟢 [Junior] Q8. How does dead code elimination differ from tree shaking?
**Tổng Quan:**
- Tree shaking ở mức module/export; dead code elimination ở mức biểu thức/nhánh điều kiện sau minification.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

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

### 🟢 [Junior] Q10. Why are source maps useful in optimization?
**Tổng Quan:**
- Source map giúp phân tích thành phần bundle theo source gốc để tìm dependency nặng.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟢 [Junior] Q11. How to read webpack-bundle-analyzer treemap?
**Tổng Quan:**
- Xem block lớn nhất theo parsed/gzip size, truy ngược package và đánh giá có thể lazy load hoặc thay thế.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟢 [Junior] Q12. What does source-map-explorer provide?
**Tổng Quan:**
- Cung cấp bức tranh package-level trên từng bundle file, tiện cho pipeline CI nhanh.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟢 [Junior] Q13. What is vendor chunk and why separate it?
**Tổng Quan:**
- Tách dependency ít đổi khỏi app code để tận dụng cache lâu dài sau các lần deploy.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

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

### 🟢 [Junior] Q15. Difference between preload and prefetch.
**Tổng Quan:**
- preload ưu tiên cao cho resource sắp dùng ngay; prefetch ưu tiên thấp cho khả năng dùng ở lần điều hướng sau.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟢 [Junior] Q16. How to avoid over-prefetching?
**Tổng Quan:**
- Giới hạn prefetch theo hành vi người dùng, network condition, và không prefetch cho nhóm chunk hiếm dùng.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟡 [Mid] Q17. Explain compression: gzip vs brotli.
**Tổng Quan:**
- Brotli thường nén tốt hơn gzip cho text assets nhưng chi phí nén server cao hơn nếu nén on-the-fly.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟡 [Mid] Q18. How image optimization affects bundle strategy?
**Tổng Quan:**
- Giảm ảnh inline/base64 quá mức, ưu tiên modern formats và responsive images để giảm transfer + decode cost.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟡 [Mid] Q19. How font loading impacts JS performance?
**Tổng Quan:**
- Font blocking có thể che lấp lợi ích tối ưu JS; nên dùng subset + font-display để giảm layout delay.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

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

### 🟡 [Mid] Q21. How to detect duplicate dependencies in bundle?
**Tổng Quan:**
- Dùng analyzer + lockfile audit để phát hiện nhiều version cùng package trong output.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟡 [Mid] Q22. What is module federation in Webpack 5?
**Tổng Quan:**
- Cho phép nhiều app chia sẻ module runtime giữa host và remote để giảm coupling khi scale team.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟡 [Mid] Q23. Bundle optimization for micro-frontends?
**Tổng Quan:**
- Chuẩn hóa shared deps, semver policy và budget riêng cho từng remote để tránh bùng nổ kích thước tổng.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟡 [Mid] Q24. How does HTTP/2 change bundling decisions?
**Tổng Quan:**
- HTTP/2 giảm penalty nhiều request nên có thể tách nhỏ hơn, nhưng vẫn phải cân bằng parse overhead JS.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟡 [Mid] Q25. What are performance budgets?
**Tổng Quan:**
- Budget là ngưỡng định lượng (KB/TTI/LCP) dùng để chặn regression trong CI.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟡 [Mid] Q26. How to set realistic JS budget per route?
**Tổng Quan:**
- Dựa trên thiết bị mục tiêu, mạng phổ biến, và baseline hiện tại; thường thiết lập initial JS theo route quan trọng.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

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

### 🟡 [Mid] Q28. What is critical rendering path in bundling context?
**Tổng Quan:**
- Chỉ nên để resource cần cho first paint ở critical path; còn lại defer/async/lazy.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟡 [Mid] Q29. How to optimize CSS chunks?
**Tổng Quan:**
- Tách critical CSS, loại unused CSS, giảm cascade complexity và inline phần nhỏ cần first render.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟡 [Mid] Q30. How does SSR/SSG interact with bundle optimization?
**Tổng Quan:**
- SSR giảm JS cần để hiển thị ban đầu nhưng hydration bundle vẫn phải tối ưu để tránh main-thread spike.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟡 [Mid] Q31. What is hydration cost and how to reduce?
**Tổng Quan:**
- Hydration là chi phí gắn event/state lên HTML SSR; giảm bằng partial hydration/islands và component nhẹ.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟡 [Mid] Q32. How to prioritize route chunks?
**Tổng Quan:**
- Ưu tiên chunk cho funnel chính, checkout/login/dashboard trước các trang phụ trợ ít traffic.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

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

### 🟡 [Mid] Q34. How does CDN edge caching support bundle delivery?
**Tổng Quan:**
- CDN giảm RTT và offload origin, đặc biệt hiệu quả cho static assets hashed.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟡 [Mid] Q35. What is differential serving?
**Tổng Quan:**
- Phân phối bundle theo capability trình duyệt (modern/legacy) để tránh polyfill dư thừa.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🟡 [Mid] Q36. How to manage polyfills efficiently?
**Tổng Quan:**
- Dùng polyfill theo usage-targeted, tránh import toàn bộ core-js khi chỉ cần vài feature.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🔴 [Senior] Q37. Explain lazy loading anti-patterns.
**Tổng Quan:**
- Lazy quá mức tạo waterfall request hoặc jank khi interaction; cần preload có chọn lọc.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

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

### 🔴 [Senior] Q39. What metrics validate bundle optimization success?
**Tổng Quan:**
- Theo dõi JS transfer, parse/exec time, TBT/INP/LCP theo route và thiết bị thực.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🔴 [Senior] Q40. How to optimize npm dependency footprint?
**Tổng Quan:**
- Chọn package ESM/tree-shakable, so sánh alternative nhẹ hơn, và loại bỏ transitive không dùng.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🔴 [Senior] Q41. What is import cost review in PR process?
**Tổng Quan:**
- PR nên hiển thị delta bundle size để reviewer phát hiện import nặng trước khi merge.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🔴 [Senior] Q42. How to tune splitChunks in Webpack?
**Tổng Quan:**
- Cân chỉnh minSize, maxAsyncRequests, cacheGroups để tránh both mega-chunks và micro-chunks.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🔴 [Senior] Q43. How Vite manualChunks helps optimization?
**Tổng Quan:**
- manualChunks cho phép group dependency theo domain để caching ổn định và debug rõ ràng.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

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

### 🔴 [Senior] Q45. What is runtime chunk and why isolate it?
**Tổng Quan:**
- Runtime chunk chứa mapping module/chunk; tách riêng giúp cache vendor/app ổn định hơn.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🔴 [Senior] Q46. How to build a bundle governance process?
**Tổng Quan:**
- Thiết lập owner, budget, CI gate, dashboard theo route/team để duy trì performance dài hạn.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

### 🔴 [Senior] Q47. How to answer trade-off questions in interviews?
**Tổng Quan:**
- Luôn nêu context người dùng, dữ liệu đo đạc, phương án A/B và rủi ro vận hành.
**Giải thích:**
- Trong phỏng vấn, bạn nên diễn giải bằng ngôn ngữ hiệu năng thực tế: network cost + CPU cost + cache behavior + DX/ops.
- Cần nêu điều kiện áp dụng và anti-pattern liên quan để thể hiện tư duy hệ thống thay vì mẹo rời rạc.
**Ví dụ:**
- Tình huống điển hình: tối ưu trang có nhiều dependency bằng cách tách chunk theo route và chỉ preload cho luồng chuyển đổi chính.

---

## Practical Checklist / Checklist Thực Chiến
- Đặt performance budget cho từng route trọng yếu (Home, Search, Checkout).
- Bật bundle analyzer trong CI để fail build khi vượt ngưỡng.
- Kiểm soát third-party scripts theo business value.
- Chuẩn hóa cache headers cho static assets qua CDN.
- Theo dõi real-user metrics để tránh tối ưu “đẹp trên lab nhưng kém ngoài đời thực”.

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

### 🟡 [Mid] Extra Q2. How to evaluate CPU cost vs transfer size trade-off?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q3. When to split by feature flags?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q4. How to manage locale bundles for i18n-heavy apps?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q5. How to optimize analytics SDK loading?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q6. How to bundle web workers for data-heavy apps?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q7. How to choose image CDN transformations safely?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q8. How to detect preload misuse in production?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q9. How to prioritize above-the-fold JS modules?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q10. How to keep bundle strategy stable across many teams?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q11. How to optimize source map policy for prod security?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q12. How to communicate bundle regressions to product stakeholders?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

[Back to Table of Contents](../../00-table-of-contents.md)
