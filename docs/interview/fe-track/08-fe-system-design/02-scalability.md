# Frontend Scalability / Khả Năng Mở Rộng Frontend
## FE System Design - Chapter 2 / Thiết Kế Hệ Thống FE - Chương 2


---

## Overview / Tổng Quan
- Khả năng mở rộng frontend không chỉ là hiệu năng runtime mà còn là khả năng mở rộng team, codebase, quy trình release, và vận hành.
- Đây là chủ đề trọng điểm cho phỏng vấn Mid/Senior khi hệ thống nhiều domain nghiệp vụ, nhiều squad, nhiều vùng địa lý.

## Related Reading / Tài Liệu Liên Quan
- [Architecture Patterns](./01-architecture-patterns.md)
- [Microservices Patterns](./06-microservices-patterns.md)
- [System Design Theory (Shared)](../../shared/02-system-design/system-design-theory.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1. What does frontend scalability mean beyond traffic growth?
**Tổng Quan:**
- Bao gồm scale người dùng, team, miền nghiệp vụ, tốc độ release, độ tin cậy vận hành và chi phí thay đổi.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟢 [Junior] Q2. How to identify scalability bottlenecks in frontend organizations?
**Tổng Quan:**
- Đánh giá theo 4 lớp: kiến trúc code, build pipeline, runtime performance, và governance giữa các team.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟢 [Junior] Q3. When should a team consider micro-frontends?
**Tổng Quan:**
- Khi domain lớn, release độc lập là bắt buộc, team tự chủ cao và monolith frontend gây tắc nghẽn phối hợp.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟢 [Junior] Q4. Module Federation core concepts?
**Tổng Quan:**
- Host tải remote modules runtime, chia sẻ dependency versioned để giảm duplicate và cho phép deploy độc lập.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.
```js
// webpack module federation (host)
new ModuleFederationPlugin({
  name: 'host',
  remotes: { billing: 'billing@https://cdn.example.com/billing/remoteEntry.js' },
  shared: {
    react: { singleton: true, requiredVersion: '^18.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
  },
});
```
- Code chỉ là minh họa; trọng tâm là nguyên tắc thiết kế và vận hành lâu dài.

### 🟢 [Junior] Q5. Single-SPA use cases and trade-offs?
**Tổng Quan:**
- Tốt cho orchestrate đa framework nhưng tăng complexity lifecycle, routing, style isolation và observability.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟢 [Junior] Q6. Web Components as micro-frontend boundary?
**Tổng Quan:**
- Chuẩn web giúp interoperability cao, nhưng DX/state sharing/theming có thể khó hơn React-native boundary.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟢 [Junior] Q7. How to choose between monolith FE and micro-frontends?
**Tổng Quan:**
- Dựa trên coupling nghiệp vụ, cadence release, maturity platform team và chi phí vận hành bổ sung.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟢 [Junior] Q8. Monorepo benefits for large frontend codebases?
**Tổng Quan:**
- Tăng tái sử dụng package, chuẩn hóa tooling, atomic refactor và visibility dependency toàn cục.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟢 [Junior] Q9. Turborepo vs Nx in practice?
**Tổng Quan:**
- Cả hai hỗ trợ task graph + cache; Nx mạnh về plugin/project graph governance, Turborepo đơn giản và nhẹ hơn.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.
```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test": { "dependsOn": ["build"], "outputs": [] }
  }
}
```
- Code chỉ là minh họa; trọng tâm là nguyên tắc thiết kế và vận hành lâu dài.

### 🟢 [Junior] Q10. How to design scalable component library?
**Tổng Quan:**
- Phải có API ổn định, semantic versioning, test visual/regression, accessibility và performance budget cho component.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟢 [Junior] Q11. Design system architecture for multi-product organizations?
**Tổng Quan:**
- Tách token -> primitive -> composite -> product overrides để cân bằng consistency và flexibility.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟢 [Junior] Q12. How to avoid design system becoming bottleneck?
**Tổng Quan:**
- Thiết lập contribution model, RFC nhẹ, release train rõ ràng và ownership phân lớp component.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟡 [Mid] Q13. Performance at scale: virtualization fundamentals?
**Tổng Quan:**
- Chỉ render vùng nhìn thấy (windowing) cho list lớn để giảm DOM node và main-thread workload.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.
```tsx
import { FixedSizeList } from 'react-window';
export function VirtualizedList({ items }: { items: string[] }) {
  return (
    <FixedSizeList height={400} width={600} itemCount={items.length} itemSize={36}>
      {({ index, style }) => <div style={style}>{items[index]}</div>}
    </FixedSizeList>
  );
}
```
- Code chỉ là minh họa; trọng tâm là nguyên tắc thiết kế và vận hành lâu dài.

### 🟡 [Mid] Q14. Pagination vs infinite scroll trade-offs?
**Tổng Quan:**
- Pagination dễ SEO/navigation; infinite scroll tăng engagement nhưng khó footer access/state restore.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟡 [Mid] Q15. How to architect state management at scale?
**Tổng Quan:**
- Phân tầng state: server state, UI state cục bộ, global workflow state; tránh single store phình to.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟡 [Mid] Q16. When to use React Query/TanStack Query in large apps?
**Tổng Quan:**
- Phù hợp quản lý server state, caching, dedupe request, background revalidation theo domain data.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟡 [Mid] Q17. How to enforce boundaries between frontend domains?
**Tổng Quan:**
- Dùng package boundary rules, lint constraints, code owners và contract tests giữa domain modules.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟡 [Mid] Q18. Build system optimization for large codebases?
**Tổng Quan:**
- Bật incremental build, remote cache, task graph parallelism, và giảm type-check scope bằng project references.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟡 [Mid] Q19. How to scale CI for hundreds of frontend packages?
**Tổng Quan:**
- Chạy affected-only pipeline, test selection thông minh, shard jobs và cache artifacts.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟡 [Mid] Q20. Feature flags architecture in frontend?
**Tổng Quan:**
- Flag evaluation client/server hybrid, targeting rules, kill switch và lifecycle cleanup để tránh tech debt.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.
```ts
type FeatureFlags = { newCheckout: boolean; quickFilter: boolean };
export function isEnabled(flags: FeatureFlags, key: keyof FeatureFlags): boolean {
  return Boolean(flags[key]);
}
```
- Code chỉ là minh họa; trọng tâm là nguyên tắc thiết kế và vận hành lâu dài.

### 🟡 [Mid] Q21. A/B testing infrastructure considerations?
**Tổng Quan:**
- Randomization ổn định, exposure logging chuẩn, guardrail metrics, và tránh flicker do late experiment assignment.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟡 [Mid] Q22. How CDN strategy supports frontend scalability?
**Tổng Quan:**
- Offload static delivery toàn cầu, giảm origin load, tối ưu TTFB với edge caching và image optimization.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟡 [Mid] Q23. Edge computing use cases for frontend delivery?
**Tổng Quan:**
- Personalization nhẹ, geo-routing, auth pre-check, header manipulation gần user để giảm latency.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.
```ts
// Edge middleware pseudo-code
export default async function middleware(request: Request) {
  const country = request.headers.get("cf-ipcountry") ?? "US";
  const variant = country === "VN" ? "asia-endpoint" : "global-endpoint";
  return fetch(new URL(`/config?variant=${variant}`, request.url));
}
```
- Code chỉ là minh họa; trọng tâm là nguyên tắc thiết kế và vận hành lâu dài.

### 🟡 [Mid] Q24. How to design i18n at scale for many locales?
**Tổng Quan:**
- Chuẩn hóa key naming, translation pipeline, fallback policy và pseudo-localization trong CI.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟡 [Mid] Q25. How to prevent translation drift in large teams?
**Tổng Quan:**
- Version hóa message catalog, review workflow với linguist, và ownership theo domain.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟡 [Mid] Q26. How to keep bundles controlled across many teams?
**Tổng Quan:**
- Mỗi domain có budget riêng, PR size check, shared dependency policy và dashboard minh bạch.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟡 [Mid] Q27. How to manage shared dependencies safely in micro-frontends?
**Tổng Quan:**
- Định nghĩa compatibility matrix và fallback version để tránh runtime conflict giữa remotes.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟡 [Mid] Q28. What is platform team responsibility in scalable frontend?
**Tổng Quan:**
- Cung cấp golden path: tooling, templates, CI standards, observability, security guardrails.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟡 [Mid] Q29. How to introduce architecture changes incrementally?
**Tổng Quan:**
- Adopt strangler pattern: carve-out dần domain, đo kết quả, rollback plan rõ ràng.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🟡 [Mid] Q30. How to structure frontend observability at scale?
**Tổng Quan:**
- Thu thập RUM, logs, traces theo user journey; correlation ID từ edge -> browser -> API.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🔴 [Senior] Q31. How to govern API contracts with many frontend teams?
**Tổng Quan:**
- Dùng schema-first (OpenAPI/GraphQL contracts), mocking chuẩn và breaking-change policy nghiêm ngặt.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.
```yaml
breaking-change-policy:
  require-rfc: true
  deprecation-window-days: 90
  communication-channel: "#fe-platform-announcements"
```
- Code chỉ là minh họa; trọng tâm là nguyên tắc thiết kế và vận hành lâu dài.

### 🔴 [Senior] Q32. How to handle dependency upgrades in monorepo?
**Tổng Quan:**
- Automate update batches, canary testing, codemods và ownership rõ để giảm upgrade freeze.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🔴 [Senior] Q33. How to scale frontend security practices?
**Tổng Quan:**
- Security linting, dependency scanning, CSP baseline, threat modeling theo release milestones.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🔴 [Senior] Q34. How to avoid CSS conflicts in micro-frontends?
**Tổng Quan:**
- Dùng design tokens + scoped styles + naming convention hoặc shadow DOM cho isolation.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🔴 [Senior] Q35. How to design rollout strategies for risky frontend changes?
**Tổng Quan:**
- Canary theo cohort, feature flag progressive rollout, rollback one-click và synthetic checks.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.
```txt
Rollout Plan:
1) Internal users 5%
2) Public users 10%
3) Public users 50%
4) Public users 100%
```
- Code chỉ là minh họa; trọng tâm là nguyên tắc thiết kế và vận hành lâu dài.

### 🔴 [Senior] Q36. How to keep UX consistent across independent squads?
**Tổng Quan:**
- Design system governance + UX council + shared quality bar cho accessibility/performance/content.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🔴 [Senior] Q37. How to manage runtime configuration in global deployments?
**Tổng Quan:**
- Config từ edge/env endpoint, cache hợp lý, versioned schema và fallback an toàn.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🔴 [Senior] Q38. How to scale accessibility in big frontend organizations?
**Tổng Quan:**
- A11y checklist in PR, automated axe tests, training định kỳ và accountable ownership.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🔴 [Senior] Q39. How to model ownership for scalable FE architecture?
**Tổng Quan:**
- Map ownership theo business capability, tránh shared mutable modules không rõ chủ sở hữu.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🔴 [Senior] Q40. How to answer senior scalability interview questions?
**Tổng Quan:**
- Trình bày theo framework: context -> constraints -> options -> decision -> migration -> metrics.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🔴 [Senior] Q41. What are warning signs of over-engineering scalability?
**Tổng Quan:**
- Áp dụng micro-frontends quá sớm, nhiều abstraction không giá trị, tăng lead time mà không cải thiện outcome.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

### 🔴 [Senior] Q42. How to create a long-term scalability roadmap?
**Tổng Quan:**
- Xác định baseline, ưu tiên bottleneck lớn nhất, đặt milestone đo lường và cơ chế governance bền vững.
**Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
**Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì “big-bang rewrite”.

---

## Scalability Checklist / Checklist Mở Rộng
- Có architecture decision record (ADR) cho các quyết định lớn.
- Có chuẩn package boundary + ownership + code owners.
- Có CI affected builds + cache + release guardrails.
- Có performance/security/accessibility budgets theo domain.
- Có roadmap migration và sunset plan cho kỹ thuật cũ.

## Cross References / Điều Hướng Kiến Thức
- [Architecture Patterns](./01-architecture-patterns.md)
- [Microservices Patterns](./06-microservices-patterns.md)
- [System Design Theory (Shared)](../../shared/02-system-design/system-design-theory.md)


## Advanced Drill Q&A / Bộ Câu Hỏi Nâng Cao

### 🟡 [Mid] Extra Q1. How to scale documentation for large frontend platforms?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q2. How to design architecture review process without slowing teams?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q3. How to standardize error handling across micro-frontends?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q4. How to scale frontend testing strategy (unit/integration/e2e)?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q5. How to make performance ownership visible per squad?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q6. How to govern npm package publishing in monorepo?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q7. How to prevent circular dependencies at scale?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q8. How to scale frontend onboarding for new engineers?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q9. How to run design system migrations safely?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q10. How to coordinate cross-team release calendars?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q11. How to scale experimentation governance ethically?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q12. How to scale personalization without hurting cache hit ratio?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q13. How to architect search-heavy frontend experiences at scale?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q14. How to scale realtime features (notifications, collaboration)?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q15. How to manage websocket connection limits in browser fleets?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q16. How to scale offline sync conflict handling in frontend?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q17. How to model frontend domain events for analytics consistency?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q18. How to keep type safety across many shared packages?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q19. How to scale content platforms with MDX-like pipelines?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q20. How to plan deprecation lifecycle for frontend APIs/components?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q21. How to avoid platform lock-in in frontend infrastructure?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q22. How to measure ROI of scalability investments?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

[Back to Table of Contents](../00-table-of-contents.md)
