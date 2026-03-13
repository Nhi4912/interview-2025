# Next.js App Router Data Fetching / Lấy Dữ Liệu Trong Next.js App Router

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Overview

Data fetching trong Next.js App Router là sự kết hợp giữa React Server Components, caching semantics của `fetch()`, streaming, và chiến lược revalidation.
Tài liệu này tập trung góc nhìn phỏng vấn: hiểu đúng cơ chế trước khi tối ưu.

### Overview / Tổng Quan
- Trọng tâm server-side trước: RSC, cache, ISR, static params.
- Mở rộng sang client-side: SWR, React Query cho trạng thái tương tác cao.
- Bao gồm mutation path: Route Handlers và Server Actions.

### Explanation / Giải thích
Sai lầm phổ biến là coi mọi data fetching giống nhau.
Thực tế cần phân loại:
1. Dữ liệu public ổn định (cache lâu).
2. Dữ liệu cá nhân hoá (cache cẩn thận).
3. Dữ liệu realtime/interactive (client cache).
4. Mutation cần consistency (invalidate + revalidate đúng nơi).

### Example / Ví dụ
Trang blog marketing có thể pre-render + ISR.
Trang dashboard người dùng cần fetch động và kiểm soát cache theo session.

## Server-side Data Fetching in App Router

### Overview / Tổng Quan
Trong App Router, page/layout là Server Components mặc định, nên có thể `await fetch()` trực tiếp.

### Explanation / Giải thích
Lợi ích:
- giảm JS gửi xuống client,
- truy cập data source ở server,
- phối hợp tốt với streaming và cache.

### Example / Ví dụ
```tsx
export default async function Page() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 300 },
  })

  if (!res.ok) throw new Error('Failed to fetch posts')

  const posts = await res.json()
  return <pre>{JSON.stringify(posts, null, 2)}</pre>
}
```

## `fetch()` Caching Options in Next.js

### Overview / Tổng Quan
`fetch()` trong Next.js mở rộng cache behavior qua `cache` và `next`.

### Explanation / Giải thích
- `cache: 'force-cache'`: ưu tiên static/cache.
- `cache: 'no-store'`: luôn lấy mới (dynamic).
- `next: { revalidate: seconds }`: ISR theo thời gian.
- `next: { tags: ['posts'] }`: revalidate theo tag.

### Example / Ví dụ
```tsx
await fetch(url, { cache: 'no-store' })
await fetch(url, { next: { revalidate: 60 } })
await fetch(url, { next: { tags: ['profile', 'dashboard'] } })
```

## React Server Components Data Patterns

### Overview / Tổng Quan
RSC ưu tiên data-fetch gần nơi render, giảm prop drilling từ client.

### Explanation / Giải thích
Pattern thường dùng:
- fetch trực tiếp trong page segment,
- tách helper function server-only,
- dùng `Promise.all` cho fetch song song,
- wrap vùng chậm bằng Suspense.

### Example / Ví dụ
```tsx
async function getUser(id: string) {
  const res = await fetch(`https://api.example.com/users/${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('User fetch failed')
  return res.json()
}
```

## `generateStaticParams`

### Overview / Tổng Quan
Dùng để tạo danh sách dynamic params tại build time cho static routes.

### Explanation / Giải thích
Phù hợp với nội dung có tập slug biết trước hoặc giới hạn.
Kết hợp tốt với ISR để cập nhật incremental sau build.

### Example / Ví dụ
```tsx
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return posts.map((post: { slug: string }) => ({ slug: post.slug }))
}
```

## Incremental Static Regeneration (ISR)

### Overview / Tổng Quan
ISR cho phép page tĩnh được cập nhật định kỳ mà không rebuild toàn bộ site.

### Explanation / Giải thích
Với `revalidate`, Next.js phục vụ bản cache cũ rồi tạo bản mới ở background khi hết hạn.
Đây là trade-off giữa freshness và cost.

### Example / Ví dụ
```tsx
await fetch('https://api.example.com/guides', {
  next: { revalidate: 600 },
})
```

## Streaming with Suspense

### Overview / Tổng Quan
Streaming gửi HTML từng phần, giúp người dùng thấy nội dung sớm hơn.

### Explanation / Giải thích
Tách vùng chậm vào component async + Suspense fallback.
Người dùng tương tác sớm với phần đã sẵn sàng.

### Example / Ví dụ
```tsx
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <>
      <Summary />
      <Suspense fallback={<p>Loading chart...</p>}>
        <SlowChart />
      </Suspense>
    </>
  )
}
```

## Parallel vs Sequential Data Fetching

### Overview / Tổng Quan
Fetch song song giảm tổng thời gian chờ nếu các request độc lập.

### Explanation / Giải thích
- Sequential: request B đợi request A.
- Parallel: chạy đồng thời bằng `Promise.all`.

### Example / Ví dụ
```tsx
const [user, stats] = await Promise.all([getUser(userId), getStats(userId)])
```

## Error Handling in Data Fetching

### Overview / Tổng Quan
Error handling cần rõ ràng giữa expected errors và unexpected failures.

### Explanation / Giải thích
- Dùng `if (!res.ok)` để xử lý HTTP errors.
- Dùng `error.tsx` cho segment-level boundary.
- Có logging/monitoring cho lỗi production.

### Example / Ví dụ
Trong page server:
```tsx
if (res.status === 404) {
  notFound()
}
```

## Client-side Fetching (SWR, React Query)

### Overview / Tổng Quan
Client-side fetching phù hợp dữ liệu tương tác cao: polling, optimistic update, local cache sync.

### Explanation / Giải thích
- **SWR**: API gọn, stale-while-revalidate.
- **React Query**: query/mutation orchestration mạnh, cache lifecycle rõ.

### Example / Ví dụ
```tsx
'use client'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function ProfileWidget() {
  const { data, isLoading } = useSWR('/api/profile', fetcher)
  if (isLoading) return <p>Loading...</p>
  return <p>{data.name}</p>
}
```

## Revalidation Strategies

### Time-based Revalidation
#### Overview / Tổng Quan
Cập nhật theo khoảng thời gian cố định.

#### Explanation / Giải thích
Dễ vận hành, phù hợp dữ liệu thay đổi theo chu kỳ.

#### Example / Ví dụ
`next: { revalidate: 300 }`

### On-demand Revalidation
#### Overview / Tổng Quan
Kích hoạt revalidate khi có sự kiện (CMS publish, admin update).

#### Explanation / Giải thích
Giảm fetch không cần thiết, freshness tốt hơn cho event-driven content.

#### Example / Ví dụ
Dùng `revalidateTag('posts')` sau mutation.

## Route Handlers for APIs

### Overview / Tổng Quan
Route Handler (`app/api/.../route.ts`) cung cấp endpoint server-side trong App Router.

### Explanation / Giải thích
Dùng khi cần API trung gian: auth gate, aggregation, webhooks, hoặc che private upstream.

### Example / Ví dụ
```ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ ok: true })
}
```

## Server Actions for Mutations

### Overview / Tổng Quan
Server Actions cho phép mutation chạy ở server, gọi trực tiếp từ form/action.

### Explanation / Giải thích
Ưu điểm:
- giảm boilerplate API cho action đơn giản,
- giữ secret logic ở server,
- tích hợp tốt với revalidation.

### Example / Ví dụ
```tsx
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost(_: unknown, formData: FormData) {
  const title = String(formData.get('title') ?? '')
  // save to db ...
  revalidateTag('posts')
  return { ok: true, title }
}
```

## Decision Framework: Which Fetching Pattern to Choose?

### Overview / Tổng Quan
Không có một pattern cho mọi route.

### Explanation / Giải thích
- SEO + cacheable content: Server fetch + ISR.
- Personalized content: dynamic fetch (`no-store`) + auth-aware boundary.
- Highly interactive widgets: client cache (SWR/React Query).
- Mutation-heavy flows: Server Actions + targeted revalidation.

### Example / Ví dụ
Trang product detail dùng ISR, còn giỏ hàng/notification panel dùng client fetch.

## Common Pitfalls

### Overview / Tổng Quan
- Accidentally caching personalized data.
- N+1 fetch giữa nested components.
- Blocking waterfalls do fetch tuần tự không cần thiết.
- Revalidate quá rộng gây tăng load server.

### Explanation / Giải thích
Pitfall thường xuất phát từ thiếu phân loại dữ liệu theo freshness/security requirements.

### Example / Ví dụ
Nếu profile API trả dữ liệu user nhưng fetch bằng `force-cache` tại route công khai, có thể gây leak cache.

## Related References / Tài Liệu Liên Quan
- [App Router & Server Components](./01-app-router-server-components.md)
- [Next.js Architecture](./03-nextjs-architecture.md)
- [Caching Patterns](../../shared/02-system-design/caching-patterns.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q1. 🟢 [Junior] What changed with data fetching in App Router compared to Pages Router?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
App Router cho phép fetch trực tiếp trong Server Component, kết hợp streaming/cache semantics tốt hơn, giảm phụ thuộc vào getServerSideProps/getStaticProps.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q2. 🟢 [Junior] When should you use `cache: "no-store"`?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
Khi dữ liệu cá nhân hoá hoặc cần luôn mới theo request (ví dụ dashboard user, admin real-time state).

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q3. 🟢 [Junior] How does `next: { revalidate }` work conceptually?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
Nó định nghĩa TTL cho cached response; khi hết hạn, request mới kích hoạt background regeneration.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q4. 🟢 [Junior] What is the role of `generateStaticParams`?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
Tạo danh sách params cho route động ở build time để pre-render và tăng tốc truy cập ban đầu.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q5. 🟢 [Junior] How to avoid data waterfall in RSC?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
Tách fetch độc lập và chạy song song bằng Promise.all; chỉ để sequential khi có dependency thực sự.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q6. 🟢 [Junior] Why use Suspense with streaming?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
Để chia trang thành vùng ưu tiên, giảm time-to-first-meaningful-content cho user.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q7. 🟢 [Junior] How do you handle 404/500 in fetch flow?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
Check `res.ok`, map 404 sang `notFound()`, còn lỗi khác để error boundary xử lý và log.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q8. 🟡 [Mid] When choose SWR over server fetch?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
Khi component cần auto revalidate phía client, tương tác nhẹ, và không cần orchestration mutation phức tạp.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q9. 🟡 [Mid] When React Query is a better fit?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
Khi app có nhiều mutation, optimistic update, cache invalidation graph phức tạp, và cần devtools mạnh.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q10. 🟡 [Mid] What are tag-based revalidation benefits?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
Invalidate theo domain dữ liệu (posts, profile) chính xác hơn so với revalidate toàn route.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q11. 🟡 [Mid] How Route Handlers fit in architecture?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
Chúng đóng vai trò BFF/API boundary trong Next app, thêm auth/aggregation/rate-limit ở server.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q12. 🟡 [Mid] Server Actions vs API routes for mutation?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
Server Actions giảm boilerplate cho form flows; API routes phù hợp public API hoặc integration đa client.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q13. 🟡 [Mid] How to prevent caching private data accidentally?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
Phân loại endpoint rõ ràng, set `no-store` cho dữ liệu nhạy cảm, và review cache policy trong PR.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q14. 🟡 [Mid] How do you design revalidation strategy at scale?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
Kết hợp TTL theo domain + event-driven invalidation + observability để cân bằng freshness và cost.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q15. 🟡 [Mid] What is a good interview answer for data fetching trade-offs?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
Nêu matrix theo SEO/freshness/personalization/interaction rồi map từng route vào pattern phù hợp.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q16. 🔴 [Senior] How to reason about ISR consistency?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
ISR là eventual consistency; cần xác định chấp nhận stale bao lâu và luồng critical nào cần no-store.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q17. 🔴 [Senior] How to debug stale data issues in Next.js?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
Kiểm tra cache options, tags, TTL, route segment config và log timestamp response theo environment.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q18. 🔴 [Senior] What is the impact of fetch location in component tree?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
Fetch đặt sâu giúp scope rõ nhưng có thể khó tổng hợp; fetch đặt cao dễ điều phối nhưng tăng coupling.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q19. 🔴 [Senior] How to combine Server Actions with optimistic UI?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
Dùng optimistic state ở client rồi sync lại bằng revalidateTag/path để đảm bảo eventual correctness.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Q20. 🔴 [Senior] Senior-level architecture call for mixed fetching?
**Tổng Quan**
Câu hỏi đánh giá khả năng chọn đúng pattern data fetching theo yêu cầu business và kỹ thuật.

**Giải thích**
Tách route theo domain: marketing static/ISR, app shell dynamic, widgets realtime client cache, mutation via actions.

**Ví dụ**
- Trình bày theo khung: loại dữ liệu → freshness target → cache policy → invalidation.
- Nêu 1 risk và 1 biện pháp giám sát (logging/metrics).
- Nếu có trải nghiệm production, thêm ví dụ migration cụ thể.


### Data Fetching Drill 1: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 2: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 3: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 4: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 5: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 6: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 7: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 8: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 9: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 10: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 11: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 12: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 13: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 14: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 15: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 16: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 17: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 18: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 19: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 20: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 21: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 22: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 23: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 24: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 25: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 26: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 27: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 28: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 29: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 30: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 31: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 32: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


### Data Fetching Drill 33: Architecture Scenario
**Tổng Quan**
Scenario nhằm luyện tư duy chọn chiến lược data fetching trong Next.js App Router.

**Giải thích**
- Xác định route này thuộc marketing, product, hay authenticated app.
- Đánh giá yêu cầu SEO, độ mới dữ liệu, và mức cá nhân hoá.
- Quyết định server/client fetch và policy cache tương ứng.
- Thiết kế fallback/loading/error boundary.
- Định nghĩa revalidation trigger theo thời gian hoặc sự kiện.

**Ví dụ**
Case mẫu:
1. Trang danh sách bài viết: ISR `revalidate: 300` + tag `posts`.
2. Trang profile: `no-store` vì dữ liệu private.
3. Widget notification: client polling bằng SWR.
4. Form tạo bài viết: Server Action + `revalidateTag('posts')`.
5. Error strategy: segment-level `error.tsx` + centralized logging.


## Summary / Tóm Tắt

Data fetching trong Next.js App Router là bài toán kiến trúc, không chỉ là gọi API.
Trả lời phỏng vấn tốt khi bạn thể hiện được cách cân bằng SEO, freshness, personalization, và complexity vận hành.
