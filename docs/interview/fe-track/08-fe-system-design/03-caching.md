# Frontend Caching Strategies (Browser, SW, App Cache, CDN)

## Tổng Quan / Overview
Tài liệu tập trung vào chiến lược caching frontend từ tầng browser đến CDN để tối ưu tốc độ tải và độ ổn định.
Mục tiêu interview: trình bày đúng nguyên lý cache, invalidation, và trade-off giữa freshness với performance.
Nội dung giữ tỷ trọng lý thuyết cao, bổ sung code minh họa tại các điểm quyết định kỹ thuật quan trọng.
Nên liên hệ nhiều tầng cache đồng thời để thể hiện tư duy system design frontend toàn diện.

## Related Links / Tài Liệu Liên Quan
- Xem thêm: `../../shared/02-system-design/caching-patterns.md`
- Xem thêm: `../06-browser-performance/04-web-performance-comprehensive.md`

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q01. What is browser cache and HTTP cache and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `browser cache and HTTP cache` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `Cache-Control + validator headers` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Asset tĩnh được cache dài hạn bằng filename hash.

### Q02. How do you design browser cache and HTTP cache for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `browser cache and HTTP cache` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Áp dụng no-cache cho HTML để luôn revalidate trước khi render shell.

### Q03. What are trade-offs of browser cache and HTTP cache at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `browser cache and HTTP cache` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q04. What is Cache-Control directives and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `Cache-Control directives` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `max-age, s-maxage, private, no-store` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Response chứa dữ liệu nhạy cảm dùng `private` để tránh shared proxy cache.

### Q05. How do you design Cache-Control directives for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `Cache-Control directives` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Xây matrix policy theo resource type: HTML/API/JS/CSS/Image.

### Q06. What are trade-offs of Cache-Control directives at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `Cache-Control directives` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q07. What is ETag and conditional requests and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `ETag and conditional requests` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `If-None-Match + 304` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Client gửi ETag để giảm payload khi dữ liệu không đổi.

### Q08. How do you design ETag and conditional requests for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `ETag and conditional requests` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Theo dõi tỉ lệ 304 để đánh giá hiệu quả revalidation.

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

### Q09. What are trade-offs of ETag and conditional requests at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `ETag and conditional requests` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q10. What is Last-Modified validation and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `Last-Modified validation` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `If-Modified-Since` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** API danh sách tin tức dùng Last-Modified khi không có ETag.

### Q11. How do you design Last-Modified validation for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `Last-Modified validation` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Kết hợp Last-Modified với TTL ngắn để giảm request không cần thiết.

### Q12. What are trade-offs of Last-Modified validation at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `Last-Modified validation` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q13. What is Service Worker Cache API and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `Service Worker Cache API` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `cache put/match, versioned cache names` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** App đọc shell từ Cache API khi offline.

### Q14. How do you design Service Worker Cache API for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `Service Worker Cache API` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Khi deploy bản mới, xóa cache version cũ trong activate event.

### Q15. What are trade-offs of Service Worker Cache API at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `Service Worker Cache API` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q16. What is Workbox cache-first strategy and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `Workbox cache-first strategy` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `static assets optimization` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Fonts/icons dùng cache-first để giảm thời gian paint.

### Q17. How do you design Workbox cache-first strategy for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `Workbox cache-first strategy` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Đặt expiration plugin để tránh cache phình to.

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

### Q18. What are trade-offs of Workbox cache-first strategy at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `Workbox cache-first strategy` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q19. What is Workbox network-first strategy and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `Workbox network-first strategy` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `freshness-first dynamic data` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Profile endpoint ưu tiên network-first để dữ liệu mới hơn.

### Q20. How do you design Workbox network-first strategy for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `Workbox network-first strategy` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Khi timeout network, fallback cache để tránh blank UI.

### Q21. What are trade-offs of Workbox network-first strategy at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `Workbox network-first strategy` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q22. What is stale-while-revalidate strategy and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `stale-while-revalidate strategy` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `fast response + background refresh` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Feed hiển thị nhanh từ cache rồi update ngầm.

### Q23. How do you design stale-while-revalidate strategy for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `stale-while-revalidate strategy` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Hiển thị badge 'Updated' khi background refresh thành công.

### Q24. What are trade-offs of stale-while-revalidate strategy at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `stale-while-revalidate strategy` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q25. What is background sync queue and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `background sync queue` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `offline write recovery` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Request tạo comment được queue khi offline.

### Q26. How do you design background sync queue for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `background sync queue` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Replay queue khi online và thông báo trạng thái đồng bộ.

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

### Q27. What are trade-offs of background sync queue at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `background sync queue` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q28. What is React Query cache lifecycle and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `React Query cache lifecycle` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `staleTime/gcTime/invalidate` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Mutation thành công thì invalidate query tương ứng.

### Q29. How do you design React Query cache lifecycle for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `React Query cache lifecycle` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Tune staleTime theo business domain thay vì dùng một giá trị chung.

### Q30. What are trade-offs of React Query cache lifecycle at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `React Query cache lifecycle` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q31. What is React Query prefetch and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `React Query prefetch` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `prefetchQuery + hydration` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Prefetch dữ liệu trang kế tiếp khi user hover link.

### Q32. How do you design React Query prefetch for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `React Query prefetch` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Hydrate dữ liệu prefetched để tránh loading flash.

### Q33. What are trade-offs of React Query prefetch at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `React Query prefetch` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q34. What is SWR cache model and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `SWR cache model` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `revalidate on focus/reconnect` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Khi user quay lại tab, SWR tự làm mới dữ liệu.

### Q35. How do you design SWR cache model for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `SWR cache model` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Dùng dedupingInterval để tránh spam request.

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

### Q36. What are trade-offs of SWR cache model at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `SWR cache model` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q37. What is Apollo normalized cache and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `Apollo normalized cache` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `entity identity + field policy` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Entity User cập nhật một chỗ phản ánh toàn app.

### Q38. How do you design Apollo normalized cache for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `Apollo normalized cache` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Định nghĩa merge policy cho pagination fields.

### Q39. What are trade-offs of Apollo normalized cache at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `Apollo normalized cache` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q40. What is Apollo cache invalidation and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `Apollo cache invalidation` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `evict + gc + refetch` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Evict item bị xóa để danh sách không hiển thị ghost data.

### Q41. How do you design Apollo cache invalidation for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `Apollo cache invalidation` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Dùng cache.modify cho update cục bộ tránh refetch nặng.

### Q42. What are trade-offs of Apollo cache invalidation at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `Apollo cache invalidation` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q43. What is IndexedDB persistence and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `IndexedDB persistence` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `large structured client storage` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Lưu draft form lớn và attachment metadata ở IndexedDB.

### Q44. How do you design IndexedDB persistence for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `IndexedDB persistence` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Thiết kế schema version để hỗ trợ migrate dữ liệu cũ.

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

### Q45. What are trade-offs of IndexedDB persistence at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `IndexedDB persistence` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q46. What is cache invalidation in SPA and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `cache invalidation in SPA` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `event-driven and key-based invalidation` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Đổi organization thì invalidate toàn bộ query phụ thuộc orgId.

### Q47. How do you design cache invalidation in SPA for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `cache invalidation in SPA` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Phân nhóm query keys để invalidation theo domain rõ ràng.

### Q48. What are trade-offs of cache invalidation in SPA at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `cache invalidation in SPA` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q49. What is optimistic updates and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `optimistic updates` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `predictive UI update + rollback` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Like tăng ngay để UX mượt rồi rollback nếu lỗi.

### Q50. How do you design optimistic updates for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `optimistic updates` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Gắn mutation id để nhận diện update pending.

### Q51. What are trade-offs of optimistic updates at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `optimistic updates` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q52. What is prefetching strategies and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `prefetching strategies` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `route/data prefetch` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Prefetch route checkout khi gần hoàn tất giỏ hàng.

### Q53. How do you design prefetching strategies for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `prefetching strategies` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Giới hạn prefetch theo network condition để tránh lãng phí.

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

### Q54. What are trade-offs of prefetching strategies at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `prefetching strategies` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q55. What is preloading critical resources and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `preloading critical resources` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `rel=preload/preconnect` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Preconnect CDN font để giảm handshake delay.

### Q56. How do you design preloading critical resources for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `preloading critical resources` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Chỉ preload tài nguyên thực sự critical cho above-the-fold.

### Q57. What are trade-offs of preloading critical resources at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `preloading critical resources` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q58. What is memory caching patterns and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `memory caching patterns` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `LRU + TTL in memory maps` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Cache transform nặng để giảm CPU render.

### Q59. How do you design memory caching patterns for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `memory caching patterns` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Dọn cache theo size limit để tránh memory leak.

### Q60. What are trade-offs of memory caching patterns at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `memory caching patterns` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q61. What is request deduplication and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `request deduplication` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `coalescing concurrent requests` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Nhiều component mount cùng query chỉ phát 1 request.

### Q62. How do you design request deduplication for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `request deduplication` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Dùng shared promise map cho window thời gian ngắn.

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

### Q63. What are trade-offs of request deduplication at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `request deduplication` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q64. What is CDN edge caching and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `CDN edge caching` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `s-maxage + edge TTL` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** JS/CSS hash file cache dài ở CDN edge.

### Q65. How do you design CDN edge caching for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `CDN edge caching` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Tách policy CDN cho static và API để tránh cache nhầm.

### Q66. What are trade-offs of CDN edge caching at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `CDN edge caching` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q67. What is surrogate key purge and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `surrogate key purge` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `targeted CDN invalidation` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Chỉ purge nhóm sản phẩm vừa cập nhật thay vì purge all.

### Q68. How do you design surrogate key purge for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `surrogate key purge` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Tạo mapping content→surrogate key để purge chính xác.

### Q69. What are trade-offs of surrogate key purge at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `surrogate key purge` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q70. What is cache busting techniques and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `cache busting techniques` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `content hash + manifest version` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Deploy mới đổi hash filename để browser tải file mới.

### Q71. How do you design cache busting techniques for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `cache busting techniques` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Tăng app version để ép SW cập nhật asset set mới.

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

### Q72. What are trade-offs of cache busting techniques at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `cache busting techniques` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q73. What is multi-layer cache consistency and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `multi-layer cache consistency` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `browser+SW+app+CDN alignment` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** TTL tầng trên dài hơn tầng dưới gây stale chéo lớp.

### Q74. How do you design multi-layer cache consistency for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `multi-layer cache consistency` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Thiết kế thứ tự TTL hợp lý và version propagation.

### Q75. What are trade-offs of multi-layer cache consistency at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `multi-layer cache consistency` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q76. What is security in caching and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `security in caching` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `avoid caching secrets/PII` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Không cache response chứa token trong shared cache.

### Q77. How do you design security in caching for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `security in caching` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Thiết lập no-store cho endpoint chứa dữ liệu nhạy cảm.

### Q78. What are trade-offs of security in caching at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `security in caching` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q79. What is cache poisoning prevention and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `cache poisoning prevention` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `Vary headers and strict keying` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Sai Vary header có thể trả nhầm locale/theme.

### Q80. How do you design cache poisoning prevention for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `cache poisoning prevention` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Chuẩn hóa cache key gồm locale, auth scope nếu cần.

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

### Q81. What are trade-offs of cache poisoning prevention at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `cache poisoning prevention` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q82. What is runtime cache observability and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `runtime cache observability` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `hit ratio, revalidate latency` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Dashboard theo dõi hit/miss theo route.

### Q83. How do you design runtime cache observability for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `runtime cache observability` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Đặt alert khi stale-read rate tăng đột biến.

### Q84. What are trade-offs of runtime cache observability at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `runtime cache observability` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

```ts
type Meta = { version: string; expiresAt: number; etag?: string };
const isExpired = (meta: Meta, now = Date.now()) => now > meta.expiresAt;

function isCompatible(meta: Meta, expectedVersion: string) {
  return meta.version === expectedVersion;
}
```

### Q85. What is cache warm-up and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `cache warm-up` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `idle-time and post-login warmup` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Sau login prefetch dashboard critical endpoints.

### Q86. How do you design cache warm-up for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `cache warm-up` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Warm cache trong idle callback để không chặn tương tác.

### Q87. What are trade-offs of cache warm-up at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `cache warm-up` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
- **Giải thích:** Ứng viên senior nên nêu được failure modes, cách thiết kế guardrails, quy trình incident response, cũng như chiến lược migration khi policy hiện tại không còn phù hợp.
- **Ví dụ:** Nếu quyết định thiên về tốc độ, cần bổ sung cảnh báo khi dữ liệu stale vượt ngưỡng SLA và cơ chế rollback policy bằng feature flags.

### Q88. What is rollback cache policies and when should FE teams use it?
**Độ khó / Difficulty:** 🟢 [Junior]
- **Tổng Quan:** `rollback cache policies` là kỹ thuật quan trọng để cải thiện hiệu năng, độ ổn định và trải nghiệm người dùng ở frontend.
- **Giải thích:** Interviewer kỳ vọng ứng viên mô tả đúng mục tiêu cốt lõi, giới hạn áp dụng, và liên hệ với `feature flags for caching rules` như một tiêu chí kỹ thuật để ra quyết định.
- **Ví dụ:** Policy sai có thể rollback nhanh bằng config flag.

### Q89. How do you design rollback cache policies for a production SPA?
**Độ khó / Difficulty:** 🟡 [Mid]
- **Tổng Quan:** Khi thiết kế `rollback cache policies` cho production, cần tách concern thành kiến trúc, policy, observability, và quy trình rollout.
- **Giải thích:** Câu trả lời tốt nên nêu lifecycle đầy đủ: khởi tạo, sử dụng, đồng bộ, invalidation, fallback khi lỗi, và đánh giá qua metrics thực tế. Đồng thời nêu rủi ro khi scale multi-team.
- **Ví dụ:** Tách config cache ra khỏi release code để đổi linh hoạt.

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

### Q90. What are trade-offs of rollback cache policies at scale?
**Độ khó / Difficulty:** 🔴 [Senior]
- **Tổng Quan:** Ở quy mô lớn, `rollback cache policies` luôn là bài toán cân bằng giữa performance, correctness, security, và chi phí vận hành.
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
