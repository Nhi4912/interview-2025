# Frontend Data Layer & Client-side Database Design


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Tổng Quan / Overview
Tài liệu bao phủ thiết kế dữ liệu phía client: lưu trữ, đồng bộ offline, cache chuẩn hóa, phân trang và real-time.
Mục tiêu interview: giải thích được dữ liệu nào lưu ở đâu, cách sync/conflict resolution, và cách bảo đảm UX đáng tin cậy.
Tỷ lệ nội dung ưu tiên lý thuyết hệ thống, code snippets dùng để làm rõ cơ chế vận hành và quyết định kỹ thuật.
Khi trả lời, cần phân biệt rõ UI state, server state và persisted state để tránh thiết kế lẫn trách nhiệm.

## Related Links / Tài Liệu Liên Quan
- Xem thêm: `../../shared/03-database/database-theory.md`
- Xem thêm: `../../shared/02-system-design/caching-patterns.md`
- Xem thêm: `../06-browser-performance/04-web-performance-comprehensive.md`

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q01. What is client-side storage options and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `client-side storage options` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `localStorage/sessionStorage/IndexedDB/cookies` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Lưu theme ở localStorage, draft lớn ở IndexedDB.

### Q02. How do you design client-side storage options for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `client-side storage options` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Chọn storage theo data shape, size, security sensitivity.

### Q03. What are trade-offs of client-side storage options at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `client-side storage options` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q04. What is storage security boundaries and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `storage security boundaries` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `XSS risk and HttpOnly cookies` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** JWT trong localStorage dễ bị lộ nếu XSS.

### Q05. How do you design storage security boundaries for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `storage security boundaries` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Ưu tiên HttpOnly cookie cho token phiên đăng nhập.

### Q06. What are trade-offs of storage security boundaries at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `storage security boundaries` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q07. What is browser quota mechanics and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `browser quota mechanics` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `origin quota and eviction` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** PWA media app có thể bị eviction khi đầy quota.

### Q08. How do you design browser quota mechanics for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `browser quota mechanics` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Theo dõi `navigator.storage.estimate()` để cảnh báo sớm.

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

### Q09. What are trade-offs of browser quota mechanics at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `browser quota mechanics` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q10. What is quota-aware persistence and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `quota-aware persistence` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `priority-based data retention` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Dữ liệu ít quan trọng bị xóa trước khi đạt ngưỡng.

### Q11. How do you design quota-aware persistence for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `quota-aware persistence` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Gắn priority cho từng object store để dọn dẹp có kiểm soát.

### Q12. What are trade-offs of quota-aware persistence at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `quota-aware persistence` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q13. What is normalized frontend data model and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `normalized frontend data model` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `entity maps and references` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** User cập nhật một lần phản ánh nhiều màn hình.

### Q14. How do you design normalized frontend data model for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `normalized frontend data model` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Dùng id map để tránh duplicate object trong state.

### Q15. What are trade-offs of normalized frontend data model at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `normalized frontend data model` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q16. What is denormalized read models and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `denormalized read models` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `view-optimized projections` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Feed cần denormalized để render nhanh.

### Q17. How do you design denormalized read models for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `denormalized read models` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Sync lại từ normalized source khi mutation xảy ra.

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

### Q18. What are trade-offs of denormalized read models at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `denormalized read models` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q19. What is offline-first architecture and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `offline-first architecture` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `local-first reads + deferred sync` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** User tạo task offline vẫn thấy ngay trong UI.

### Q20. How do you design offline-first architecture for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `offline-first architecture` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Sync queue chạy nền khi mạng trở lại.

### Q21. What are trade-offs of offline-first architecture at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `offline-first architecture` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q22. What is sync queue design and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `sync queue design` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `idempotent retries + backoff` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Request thất bại được retry exponential backoff.

### Q23. How do you design sync queue design for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `sync queue design` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Gắn idempotency key để tránh ghi trùng.

### Q24. What are trade-offs of sync queue design at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `sync queue design` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q25. What is conflict resolution strategies and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `conflict resolution strategies` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `LWW/merge/manual resolution` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Hai thiết bị sửa cùng profile gây conflict.

### Q26. How do you design conflict resolution strategies for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `conflict resolution strategies` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Hiển thị conflict UI khi merge tự động không an toàn.

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

### Q27. What are trade-offs of conflict resolution strategies at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `conflict resolution strategies` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q28. What is CRDT basics and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `CRDT basics` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `commutative operations` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Collaborative note merge thao tác không mất chữ.

### Q29. How do you design CRDT basics for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `CRDT basics` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Giải thích CRDT phù hợp dữ liệu collaborative real-time.

### Q30. What are trade-offs of CRDT basics at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `CRDT basics` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q31. What is eventual consistency UX and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `eventual consistency UX` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `pending/synced indicators` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Badge Pending giúp user hiểu trạng thái chưa sync.

### Q32. How do you design eventual consistency UX for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `eventual consistency UX` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Cung cấp action retry thủ công khi sync fail kéo dài.

### Q33. What are trade-offs of eventual consistency UX at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `eventual consistency UX` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q34. What is real-time via WebSocket and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `real-time via WebSocket` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `bidirectional low-latency updates` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Chat app nhận tin nhắn tức thời.

### Q35. How do you design real-time via WebSocket for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `real-time via WebSocket` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Fallback sang SSE/polling khi WebSocket bị chặn.

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

### Q36. What are trade-offs of real-time via WebSocket at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `real-time via WebSocket` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q37. What is real-time via SSE and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `real-time via SSE` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `server push one-way stream` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Thông báo system status push qua SSE.

### Q38. How do you design real-time via SSE for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `real-time via SSE` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Tự động reconnect với jitter để ổn định.

### Q39. What are trade-offs of real-time via SSE at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `real-time via SSE` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q40. What is long polling trade-offs and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `long polling trade-offs` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `compatibility vs efficiency` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Legacy env không hỗ trợ WS thì dùng polling.

### Q41. How do you design long polling trade-offs for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `long polling trade-offs` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Điều chỉnh interval theo activity để giảm tải.

### Q42. What are trade-offs of long polling trade-offs at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `long polling trade-offs` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q43. What is pagination: offset and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `pagination: offset` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `simple SQL-friendly pagination` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Trang admin dùng offset cho bảng ổn định.

### Q44. How do you design pagination: offset for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `pagination: offset` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Không phù hợp feed thay đổi liên tục vì dễ duplicate.

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

### Q45. What are trade-offs of pagination: offset at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `pagination: offset` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q46. What is pagination: cursor and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `pagination: cursor` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `stable forward traversal` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Feed social dùng cursor để mượt hơn.

### Q47. How do you design pagination: cursor for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `pagination: cursor` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Giải thích cursor token encode vị trí dữ liệu.

### Q48. What are trade-offs of pagination: cursor at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `pagination: cursor` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q49. What is pagination: keyset and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `pagination: keyset` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `high-performance deep pagination` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Dataset lớn dùng keyset theo created_at,id.

### Q50. How do you design pagination: keyset for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `pagination: keyset` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Phân tích index requirement để keyset hiệu quả.

### Q51. What are trade-offs of pagination: keyset at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `pagination: keyset` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q52. What is optimistic mutation flow and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `optimistic mutation flow` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `predictive write + rollback` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Comment hiển thị ngay trước khi server xác nhận.

### Q53. How do you design optimistic mutation flow for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `optimistic mutation flow` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Rollback và toast lỗi nếu server reject.

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

### Q54. What are trade-offs of optimistic mutation flow at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `optimistic mutation flow` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q55. What is compensating actions and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `compensating actions` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `rollback + conflict patch` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Failed payment status cần revert local UI.

### Q56. How do you design compensating actions for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `compensating actions` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Lưu snapshot trước mutation để phục hồi chính xác.

### Q57. What are trade-offs of compensating actions at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `compensating actions` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q58. What is client validation and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `client validation` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `UX-fast validation` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Kiểm tra format email trước submit.

### Q59. How do you design client validation for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `client validation` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Server vẫn là nguồn sự thật cuối cùng.

### Q60. What are trade-offs of client validation at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `client validation` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q61. What is schema validation in client and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `schema validation in client` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `zod/yup runtime contracts` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Decode API response trước khi ghi cache.

### Q62. How do you design schema validation in client for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `schema validation in client` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Nếu schema fail, đánh dấu data corrupt và refetch.

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

### Q63. What are trade-offs of schema validation in client at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `schema validation in client` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q64. What is Apollo normalized cache and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `Apollo normalized cache` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `InMemoryCache identities` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** `__typename:id` cho phép cập nhật entity chuẩn.

### Q65. How do you design Apollo normalized cache for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `Apollo normalized cache` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Dùng field policies để merge phân trang an toàn.

### Q66. What are trade-offs of Apollo normalized cache at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `Apollo normalized cache` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q67. What is Apollo cache persistence and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `Apollo cache persistence` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `persist and rehydrate` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Persist cache giúp app mở lại nhanh hơn.

### Q68. How do you design Apollo cache persistence for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `Apollo cache persistence` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Version hóa cache để invalidate sau schema change.

### Q69. What are trade-offs of Apollo cache persistence at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `Apollo cache persistence` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q70. What is React Query key design and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `React Query key design` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `stable serialized query keys` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** `['orders', userId, {status}]` rõ phạm vi dữ liệu.

### Q71. How do you design React Query key design for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `React Query key design` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Tránh object key không ổn định gây miss cache.

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

### Q72. What are trade-offs of React Query key design at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `React Query key design` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q73. What is React Query invalidation and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `React Query invalidation` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `targeted invalidation patterns` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Mutation order invalidate list + detail liên quan.

### Q74. How do you design React Query invalidation for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `React Query invalidation` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Dùng partial key invalidation để giảm refetch dư thừa.

### Q75. What are trade-offs of React Query invalidation at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `React Query invalidation` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q76. What is state persistence patterns and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `state persistence patterns` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `selective persistence` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Persist filter preferences, không persist sensitive payload.

### Q77. How do you design state persistence patterns for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `state persistence patterns` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Migrate persisted state khi app version đổi.

### Q78. What are trade-offs of state persistence patterns at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `state persistence patterns` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q79. What is hydration order and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `hydration order` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `boot sequence correctness` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Hydrate auth trước rồi mới hydrate data queries.

### Q80. How do you design hydration order for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `hydration order` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Tránh flash unauthorized do hydration sai thứ tự.

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

### Q81. What are trade-offs of hydration order at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `hydration order` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q82. What is data retention and cleanup and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `data retention and cleanup` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `TTL + logout purge` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Logout phải xóa dữ liệu user khỏi local stores.

### Q83. How do you design data retention and cleanup for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `data retention and cleanup` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Thiết lập scheduled cleanup khi app idle.

### Q84. What are trade-offs of data retention and cleanup at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `data retention and cleanup` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q85. What is privacy compliance on client and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `privacy compliance on client` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `GDPR-like minimization` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Chỉ lưu dữ liệu cần thiết cho chức năng.

### Q86. How do you design privacy compliance on client for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `privacy compliance on client` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Cung cấp nút xóa dữ liệu local theo yêu cầu user.

### Q87. What are trade-offs of privacy compliance on client at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `privacy compliance on client` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q88. What is data-layer observability and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `data-layer observability` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `sync lag/conflict/cache hit metrics` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Theo dõi conflict rate tăng sau release.

### Q89. How do you design data-layer observability for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `data-layer observability` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Alert khi sync lag p95 vượt ngưỡng SLA.

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

### Q90. What are trade-offs of data-layer observability at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `data-layer observability` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
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
