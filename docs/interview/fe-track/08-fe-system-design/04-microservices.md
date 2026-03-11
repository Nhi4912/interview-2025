# Micro-frontends & Frontend Microservices Design

## Tổng Quan / Overview
Tài liệu mô tả kiến trúc micro-frontends cho bối cảnh nhiều team cùng phát triển và phát hành frontend.
Trọng tâm interview là giải thích động lực áp dụng, mô hình tích hợp, governance, và cách giảm rủi ro vận hành.
Ứng viên nên nêu rõ trade-off: autonomy cao hơn nhưng complexity runtime/test/monitoring cũng tăng.
Code examples chỉ để minh họa contract và integration pattern, không thay thế lập luận kiến trúc.

## Related Links / Tài Liệu Liên Quan
- Xem thêm: `./06-microservices-patterns.md`
- Xem thêm: `./02-scalability.md`
- Xem thêm: `../../shared/05-software-engineering/02-architecture-styles.md`

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q01. What is micro-frontends motivation and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `micro-frontends motivation` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `team autonomy + bounded contexts` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Mỗi domain team tự release không block lẫn nhau.

### Q02. How do you design micro-frontends motivation for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `micro-frontends motivation` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Bắt đầu khi frontend monolith trở thành bottleneck release.

### Q03. What are trade-offs of micro-frontends motivation at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `micro-frontends motivation` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q04. What is micro-frontends domain boundaries and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `micro-frontends domain boundaries` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `DDD-inspired UI ownership` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Catalog/Checkout/Account tách theo domain business.

### Q05. How do you design micro-frontends domain boundaries for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `micro-frontends domain boundaries` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Định nghĩa owner rõ cho route, component, API contracts.

### Q06. What are trade-offs of micro-frontends domain boundaries at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `micro-frontends domain boundaries` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q07. What is Module Federation host/remote and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `Module Federation host/remote` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `runtime composition` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Host shell tải remote checkout từ CDN URL.

### Q08. How do you design Module Federation host/remote for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `Module Federation host/remote` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Dùng remote fallback khi remote chính lỗi tải.

```ts
// pseudo configuration used in interviews
const policy = {
  staleTime: 60_000,
  cacheTime: 10 * 60_000,
  retry: 2,
  revalidateOnFocus: true,
};

function shouldUseFallback(isOnline: boolean, hasCache: boolean) {
  return !isOnline && hasCache;
}
```

### Q09. What are trade-offs of Module Federation host/remote at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `Module Federation host/remote` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q10. What is Module Federation shared libs and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `Module Federation shared libs` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `singleton dependency management` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** React được share singleton để tránh duplicate runtime.

### Q11. How do you design Module Federation shared libs for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `Module Federation shared libs` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Pin version range và kiểm tra compatibility trong CI.

### Q12. What are trade-offs of Module Federation shared libs at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `Module Federation shared libs` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q13. What is Single-SPA lifecycle and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `Single-SPA lifecycle` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `bootstrap/mount/unmount` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** App mount theo route active để tối ưu resources.

### Q14. How do you design Single-SPA lifecycle for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `Single-SPA lifecycle` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Clean side effects khi unmount để tránh memory leak.

### Q15. What are trade-offs of Single-SPA lifecycle at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `Single-SPA lifecycle` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q16. What is Web Components integration and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `Web Components integration` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `framework-agnostic composition` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Remote từ Vue expose custom element dùng trong React shell.

### Q17. How do you design Web Components integration for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `Web Components integration` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Đóng gói style bằng shadow DOM khi cần isolation.

```ts
// pseudo configuration used in interviews
const policy = {
  staleTime: 60_000,
  cacheTime: 10 * 60_000,
  retry: 2,
  revalidateOnFocus: true,
};

function shouldUseFallback(isOnline: boolean, hasCache: boolean) {
  return !isOnline && hasCache;
}
```

### Q18. What are trade-offs of Web Components integration at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `Web Components integration` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q19. What is build-time integration and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `build-time integration` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `compile-time contracts` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Monorepo build-time cho type-safety cao.

### Q20. How do you design build-time integration for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `build-time integration` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Phù hợp team ít, release cadence đồng bộ.

### Q21. What are trade-offs of build-time integration at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `build-time integration` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q22. What is runtime integration and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `runtime integration` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `independent deploy + remote loading` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Remote deploy độc lập không cần rebuild host.

### Q23. How do you design runtime integration for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `runtime integration` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Thêm version pin và fallback để giảm rủi ro runtime.

### Q24. What are trade-offs of runtime integration at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `runtime integration` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q25. What is cross-microfrontend routing and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `cross-microfrontend routing` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `shell owns top-level routes` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Shell quyết định route chính, child app giữ nested routes.

### Q26. How do you design cross-microfrontend routing for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `cross-microfrontend routing` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Chuẩn hóa route contracts tránh trùng path giữa team.

```ts
// pseudo configuration used in interviews
const policy = {
  staleTime: 60_000,
  cacheTime: 10 * 60_000,
  retry: 2,
  revalidateOnFocus: true,
};

function shouldUseFallback(isOnline: boolean, hasCache: boolean) {
  return !isOnline && hasCache;
}
```

### Q27. What are trade-offs of cross-microfrontend routing at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `cross-microfrontend routing` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q28. What is navigation handoff and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `navigation handoff` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `route ownership and transitions` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Từ catalog sang checkout vẫn giữ session context.

### Q29. How do you design navigation handoff for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `navigation handoff` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Dùng shared navigation service để theo dõi transition metrics.

### Q30. What are trade-offs of navigation handoff at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `navigation handoff` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q31. What is custom event communication and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `custom event communication` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `event-driven decoupling` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Cart app phát event cập nhật badge header.

### Q32. How do you design custom event communication for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `custom event communication` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Version hóa event payload để tránh breaking changes.

### Q33. What are trade-offs of custom event communication at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `custom event communication` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q34. What is shared state constraints and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `shared state constraints` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `minimal global state` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Chỉ chia sẻ auth/session, không chia sẻ state domain sâu.

### Q35. How do you design shared state constraints for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `shared state constraints` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Nếu cần state chung, đặt ownership và SLA rõ ràng.

```ts
// pseudo configuration used in interviews
const policy = {
  staleTime: 60_000,
  cacheTime: 10 * 60_000,
  retry: 2,
  revalidateOnFocus: true,
};

function shouldUseFallback(isOnline: boolean, hasCache: boolean) {
  return !isOnline && hasCache;
}
```

### Q36. What are trade-offs of shared state constraints at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `shared state constraints` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q37. What is pub/sub event bus and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `pub/sub event bus` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `typed contracts and observability` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Analytics subscribe sự kiện từ nhiều app.

### Q38. How do you design pub/sub event bus for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `pub/sub event bus` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Gắn correlation id để trace event chain.

### Q39. What are trade-offs of pub/sub event bus at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `pub/sub event bus` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q40. What is API gateway/BFF alignment and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `API gateway/BFF alignment` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `backend contracts per domain` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Mỗi micro-frontend dùng BFF riêng cho domain.

### Q41. How do you design API gateway/BFF alignment for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `API gateway/BFF alignment` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Chuẩn hóa auth headers để giảm coupling client.

### Q42. What are trade-offs of API gateway/BFF alignment at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `API gateway/BFF alignment` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q43. What is independent deployment and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `independent deployment` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `CI/CD per app` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Checkout deploy nóng mà không ảnh hưởng catalog.

### Q44. How do you design independent deployment for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `independent deployment` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Thêm smoke test sau deploy để kiểm tra integration.

```ts
// pseudo configuration used in interviews
const policy = {
  staleTime: 60_000,
  cacheTime: 10 * 60_000,
  retry: 2,
  revalidateOnFocus: true,
};

function shouldUseFallback(isOnline: boolean, hasCache: boolean) {
  return !isOnline && hasCache;
}
```

### Q45. What are trade-offs of independent deployment at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `independent deployment` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q46. What is feature flags in micro-frontends and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `feature flags in micro-frontends` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `safe progressive rollout` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Bật remote mới cho 5% user trước.

### Q47. How do you design feature flags in micro-frontends for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `feature flags in micro-frontends` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Rollback nhanh bằng tắt flag thay vì rollback full deploy.

### Q48. What are trade-offs of feature flags in micro-frontends at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `feature flags in micro-frontends` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q49. What is contract testing and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `contract testing` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `consumer/provider tests` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Host kiểm tra contract import của remote.

### Q50. How do you design contract testing for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `contract testing` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Chặn publish remote khi phá vỡ contract cũ.

### Q51. What are trade-offs of contract testing at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `contract testing` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q52. What is integration testing and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `integration testing` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `shell + remotes verification` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** E2E xác nhận checkout flow xuyên 3 micro-app.

### Q53. How do you design integration testing for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `integration testing` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Tạo môi trường staging compose giống production.

```ts
// pseudo configuration used in interviews
const policy = {
  staleTime: 60_000,
  cacheTime: 10 * 60_000,
  retry: 2,
  revalidateOnFocus: true,
};

function shouldUseFallback(isOnline: boolean, hasCache: boolean) {
  return !isOnline && hasCache;
}
```

### Q54. What are trade-offs of integration testing at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `integration testing` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q55. What is visual consistency and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `visual consistency` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `design system governance` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Button/spacing đồng nhất dù app khác framework.

### Q56. How do you design visual consistency for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `visual consistency` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Platform team phát hành token package versioned.

### Q57. What are trade-offs of visual consistency at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `visual consistency` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q58. What is performance budget and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `performance budget` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `bundle and CPU budget per remote` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** CI fail nếu remote vượt ngân sách bundle.

### Q59. How do you design performance budget for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `performance budget` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Theo dõi long tasks theo từng remote trên RUM.

### Q60. What are trade-offs of performance budget at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `performance budget` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q61. What is SSR/CSR strategy and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `SSR/CSR strategy` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `rendering boundaries across remotes` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Shell SSR, remotes hydrate dần theo priority.

### Q62. How do you design SSR/CSR strategy for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `SSR/CSR strategy` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Đảm bảo hydration order tránh mismatch.

```ts
// pseudo configuration used in interviews
const policy = {
  staleTime: 60_000,
  cacheTime: 10 * 60_000,
  retry: 2,
  revalidateOnFocus: true,
};

function shouldUseFallback(isOnline: boolean, hasCache: boolean) {
  return !isOnline && hasCache;
}
```

### Q63. What are trade-offs of SSR/CSR strategy at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `SSR/CSR strategy` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q64. What is shared dependency drift and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `shared dependency drift` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `version skew risk` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Remote A dùng React 18.2, remote B dùng 18.3 gây xung đột.

### Q65. How do you design shared dependency drift for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `shared dependency drift` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Thiết lập allowed version matrix và cảnh báo sớm.

### Q66. What are trade-offs of shared dependency drift at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `shared dependency drift` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q67. What is security boundaries and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `security boundaries` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `CSP, trusted origins, sandbox` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Remote scripts chỉ được load từ allowlist.

### Q68. How do you design security boundaries for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `security boundaries` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Thêm integrity checks và audit third-party libs.

### Q69. What are trade-offs of security boundaries at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `security boundaries` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q70. What is error isolation and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `error isolation` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `failure containment per remote` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Remote lỗi không được làm sập whole shell.

### Q71. How do you design error isolation for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `error isolation` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Bọc từng remote bằng error boundary độc lập.

```ts
// pseudo configuration used in interviews
const policy = {
  staleTime: 60_000,
  cacheTime: 10 * 60_000,
  retry: 2,
  revalidateOnFocus: true,
};

function shouldUseFallback(isOnline: boolean, hasCache: boolean) {
  return !isOnline && hasCache;
}
```

### Q72. What are trade-offs of error isolation at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `error isolation` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q73. What is observability standards and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `observability standards` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `logs, traces, RUM by domain` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Mỗi remote emit log với app-name tag.

### Q74. How do you design observability standards for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `observability standards` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Tập trung telemetry vào dashboard thống nhất.

### Q75. What are trade-offs of observability standards at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `observability standards` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q76. What is incident response model and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `incident response model` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `ownership + runbook` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Lỗi checkout được route thẳng team checkout.

### Q77. How do you design incident response model for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `incident response model` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Runbook mô tả bước triage theo correlation id.

### Q78. What are trade-offs of incident response model at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `incident response model` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q79. What is migration from monolith and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `migration from monolith` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `strangler fig pattern` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Tách page account trước, giữ phần còn lại monolith.

### Q80. How do you design migration from monolith for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `migration from monolith` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Đo lead time change để chứng minh hiệu quả migration.

```ts
// pseudo configuration used in interviews
const policy = {
  staleTime: 60_000,
  cacheTime: 10 * 60_000,
  retry: 2,
  revalidateOnFocus: true,
};

function shouldUseFallback(isOnline: boolean, hasCache: boolean) {
  return !isOnline && hasCache;
}
```

### Q81. What are trade-offs of migration from monolith at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `migration from monolith` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q82. What is governance vs autonomy and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `governance vs autonomy` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `platform rules with local freedom` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Team tự chọn framework nhưng phải tuân design tokens.

### Q83. How do you design governance vs autonomy for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `governance vs autonomy` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Golden path giúp giảm cognitive load cho team mới.

### Q84. What are trade-offs of governance vs autonomy at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `governance vs autonomy` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q85. What is organizational prerequisites and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `organizational prerequisites` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `team maturity and DevOps readiness` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Không có CI/CD mạnh thì micro-frontends dễ thất bại.

### Q86. How do you design organizational prerequisites for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `organizational prerequisites` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Đầu tư platform tooling trước khi scale mô hình.

### Q87. What are trade-offs of organizational prerequisites at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `organizational prerequisites` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q88. What is trade-off analysis and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `trade-off analysis` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `autonomy vs complexity` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Release nhanh hơn nhưng debug runtime phức tạp hơn.

### Q89. How do you design trade-off analysis for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `trade-off analysis` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Nêu rõ điều kiện dừng hoặc quay lại monolith nếu cần.

```ts
// pseudo configuration used in interviews
const policy = {
  staleTime: 60_000,
  cacheTime: 10 * 60_000,
  retry: 2,
  revalidateOnFocus: true,
};

function shouldUseFallback(isOnline: boolean, hasCache: boolean) {
  return !isOnline && hasCache;
}
```

### Q90. What are trade-offs of trade-off analysis at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `trade-off analysis` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

## Practical Checklist / Checklist Thực Chiến
- Định nghĩa freshness requirement theo từng loại dữ liệu trước khi chọn chiến lược.
- Luôn có cơ chế quan sát: hit/miss ratio, stale-read rate, fallback frequency.
- Thiết kế invalidation và rollback ngay từ đầu để tránh kỹ thuật chữa cháy.
- Chuẩn hóa conventions cho đa team: naming, versioning, contract testing.
- Viết tài liệu runbook để xử lý incident liên quan dữ liệu stale/conflict.

## Interview Tips / Mẹo Trả Lời
- Trình bày theo format: bối cảnh → lựa chọn → trade-off → quyết định → chỉ số đo lường.
- Luôn nêu giả định business: latency target, consistency level, mức chịu stale data.
- Đưa 1 tình huống production và cách bạn xử lý sau incident để tăng tính thuyết phục.
