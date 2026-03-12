# Quick Reference Cheat Sheet / Bảng Ghi Nhớ Nhanh
## Interview Preparation (FE + BE) / Chuẩn Bị Phỏng Vấn (FE + BE)
[← Back to Table of Contents](./00-table-of-contents.md)
---
## Tổng Quan / Overview
### Mục tiêu / Goals
- Tài liệu tra cứu nhanh trước phỏng vấn.
- Tập trung vào điểm rơi thường hỏi: DSA, JS/TS/React, Go backend, system design.
- Có phần nhắc nhớ theo mức độ: 🟢 [Junior], 🟡 [Mid], 🔴 [Senior].
### Cách dùng / How to Use
- Đọc mục bạn yếu nhất trước.
- Mỗi phần có 3 khối: **Tổng Quan**, **Giải thích**, **Ví dụ**.
- Cuối tài liệu có **## Câu Hỏi Phỏng Vấn / Interview Q&A** để luyện trả lời.
### Difficulty Legend / Chú thích độ khó
- 🟢 [Junior]: Nền tảng, định nghĩa, thao tác cơ bản.
- 🟡 [Mid]: Vận dụng, trade-off, tối ưu.
- 🔴 [Senior]: Thiết kế hệ thống, scale, reliability, leadership kỹ thuật.
---
## 1) JavaScript Fundamentals / Nền Tảng JavaScript
### Overview / Tổng Quan
- JS là single-threaded với event loop.
- Hỏi nhiều về scope, hoisting, closure, async.
### Explanation / Giải thích
- `var`: function scope, hoisted, có thể redeclare.
- `let`: block scope, có TDZ, không redeclare cùng scope.
- `const`: block scope, không reassign binding.
- `==` có coercion, `===` strict.
- Microtask (`Promise.then`) chạy trước macrotask (`setTimeout`).
### Example / Ví dụ
```js
console.log(a); // undefined
var a = 1;
// console.log(b); // ReferenceError
let b = 2;
```
```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
// A D C B
```
```js
function outer(x) {
  return function inner(y) {
    return x + y;
  };
}
const add5 = outer(5);
console.log(add5(3)); // 8
```
### Quick Notes
- `typeof null === 'object'` (legacy quirk).
- Spread clone là shallow copy.
- `Array.prototype.sort()` mặc định sort string.
---
## 2) TypeScript Essentials / Cốt Lõi TypeScript
### Overview / Tổng Quan
- TypeScript giúp model domain và giảm runtime bug.
### Explanation / Giải thích
- `unknown` an toàn hơn `any`.
- Union + type narrowing là kỹ năng bắt buộc.
- Generics giúp tái sử dụng code type-safe.
- Utility types (`Pick`, `Omit`, `Partial`, `Required`) rất hay gặp.
### Example / Ví dụ
```ts
type Result<T> = { ok: true; data: T } | { ok: false; error: string };
function unwrap<T>(r: Result<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.data;
}
```
```ts
interface User {
  id: string;
  name: string;
  email?: string;
}
type UserPatch = Partial<User>;
type UserPreview = Pick<User, 'id' | 'name'>;
```
```ts
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
```
### Common Checks
- Có đang dùng `any` dư thừa?
- Union đã exhaustively handled chưa?
- API response có runtime validation không?
---
## 3) React Quick Recall / Ghi Nhớ Nhanh React
### Overview / Tổng Quan
- Trọng tâm: render cycle, state, hooks, memoization.
### Explanation / Giải thích
- State update có thể được batch.
- Hook rules: gọi ở top-level và trong function component/custom hook.
- `key` ổn định giúp reconciliation đúng.
- Memoization chỉ dùng khi đo được lợi ích.
### Example / Ví dụ
```tsx
function Counter() {
  const [count, setCount] = React.useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```
```tsx
function Search({ list, q }: { list: string[]; q: string }) {
  const filtered = React.useMemo(() => list.filter((x) => x.includes(q)), [list, q]);
  return <div>{filtered.length}</div>;
}
```
```tsx
function Input() {
  const [value, setValue] = React.useState('');
  React.useEffect(() => {
    const id = setTimeout(() => {}, 300);
    return () => clearTimeout(id);
  }, [value]);
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```
### React Pitfalls
- Dùng `index` làm key cho danh sách thay đổi động.
- Duplicate source of truth.
- Effect thiếu dependency.
---
## 4) Next.js App Router / Tổng Hợp Next.js
### Overview / Tổng Quan
- Mặc định Server Components, Client Components cho interactivity.
### Explanation / Giải thích
- Server Components: giảm JS gửi về client.
- Client Components: cần cho state/effect/browser API.
- Data fetching cần rõ cache policy.
### Example / Ví dụ
```tsx
export default async function Page() {
  const data = await fetch('https://api.example.com/posts', {
    next: { revalidate: 300 },
  }).then((r) => r.json());
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```
```ts
export async function GET() {
  return Response.json({ ok: true });
}
```
```tsx
export const metadata = {
  title: 'Interview 2025',
  description: 'Bilingual prep',
};
```
### Quick Cache Guide
- Data tĩnh: mặc định cache.
- Data cập nhật định kỳ: `revalidate`.
- Data realtime: `cache: 'no-store'`.
---
## 5) Go Backend Snapshot / Tóm Tắt Go Backend
### Overview / Tổng Quan
- Điểm mạnh: concurrency model rõ ràng, binary gọn, runtime hiệu quả.
### Explanation / Giải thích
- Goroutine nhẹ, channel giao tiếp đồng bộ.
- `context.Context` là tiêu chuẩn để timeout/cancel.
- Interface nhỏ giúp giảm coupling.
### Example / Ví dụ
```go
func worker(ctx context.Context, jobs <-chan int, out chan<- int) {
	for {
		select {
		case <-ctx.Done():
			return
		case j, ok := <-jobs:
			if !ok { return }
			out <- j * 2
		}
	}
}
```
```go
func Fetch(ctx context.Context, url string) error {
	rctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()
	req, _ := http.NewRequestWithContext(rctx, http.MethodGet, url, nil)
	_, err := http.DefaultClient.Do(req)
	return err
}
```
### Backend Pitfalls
- Quên cancel context.
- Goroutine leak khi channel không close đúng ownership.
- Retry không giới hạn gây thác lũ request.
---
## 6) Complexity Table / Bảng Độ Phức Tạp
### Overview / Tổng Quan
- Luôn chốt time + space complexity khi trình bày lời giải.
### Explanation / Giải thích
| Complexity | Name | Typical Example | Note |
| --- | --- | --- | --- |
| O(1) | Constant | Hash lookup | Trung bình |
| O(log n) | Logarithmic | Binary search | Cần sorted/monotonic |
| O(n) | Linear | Single pass | Baseline tốt |
| O(n log n) | Linearithmic | Merge sort | Sorting chuẩn |
| O(n²) | Quadratic | Nested loop | Dễ timeout |
| O(2^n) | Exponential | Subset recursion | Chỉ n nhỏ |
| O(n!) | Factorial | Permutations | Rất tốn |
### Example / Ví dụ
- Nếu n = 100,000:
  - O(n), O(n log n): thường ổn.
  - O(n²): thường không ổn.
---
## 7) Data Structure Cheat Sheet / Bảng Cấu Trúc Dữ Liệu
### Overview / Tổng Quan
- Chọn cấu trúc dữ liệu theo thao tác chính: read/write/search/order.
### Explanation / Giải thích
| DS | Lookup | Insert | Delete | Use Case |
| --- | --- | --- | --- | --- |
| Array | O(1) idx | O(n) mid | O(n) mid | sequence, random access |
| Linked List | O(n) | O(1) head | O(1) head | frequent head ops |
| Stack | O(n) search | O(1) push | O(1) pop | DFS, undo |
| Queue | O(n) search | O(1) enq | O(1) deq | BFS, buffering |
| Hash Map | O(1)* | O(1)* | O(1)* | dictionary, counting |
| Heap | O(1) top | O(log n) | O(log n) | top-k, scheduler |
| BST balanced | O(log n) | O(log n) | O(log n) | ordered set/map |
| Trie | O(L) | O(L) | O(L) | prefix search |
### Example / Ví dụ
```ts
function hasDup(nums: number[]): boolean {
  const s = new Set<number>();
  for (const n of nums) {
    if (s.has(n)) return true;
    s.add(n);
  }
  return false;
}
```
---
## 8) Algorithm Pattern Cheat Sheet / Bảng Pattern Giải Thuật
### Overview / Tổng Quan
- Pattern recognition thường quan trọng hơn trick riêng lẻ.
### Explanation / Giải thích
#### 8.1 Two Pointers
- Chuỗi/mảng, tiến từ 2 đầu.
#### 8.2 Sliding Window
- Subarray/substring liên tục.
#### 8.3 Fast-Slow Pointer
- Cycle detection, middle node.
#### 8.4 Binary Search on Answer
- Hàm kiểm tra monotonic.
#### 8.5 DFS/Backtracking
- Tổ hợp, hoán vị, duyệt không gian trạng thái.
#### 8.6 BFS
- Shortest path unweighted.
#### 8.7 Prefix Sum
- Range sum nhanh.
#### 8.8 Monotonic Stack
- Next greater/smaller.
#### 8.9 Heap Top-K
- Truy vấn top-k hiệu quả.
#### 8.10 Union-Find
- Connected components.
### Example / Ví dụ
```ts
function isPalindrome(s: string): boolean {
  let l = 0;
  let r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++;
    r--;
  }
  return true;
}
```
```ts
function maxSumK(nums: number[], k: number): number {
  let cur = 0;
  for (let i = 0; i < k; i++) cur += nums[i];
  let best = cur;
  for (let i = k; i < nums.length; i++) {
    cur += nums[i] - nums[i - k];
    best = Math.max(best, cur);
  }
  return best;
}
```
```ts
function nextGreater(nums: number[]): number[] {
  const res = Array(nums.length).fill(-1);
  const st: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    while (st.length && nums[i] > nums[st[st.length - 1]]) {
      res[st.pop()!] = nums[i];
    }
    st.push(i);
  }
  return res;
}
```
---
## 9) Sorting & Searching / Sắp Xếp & Tìm Kiếm
### Overview / Tổng Quan
- Biết complexity + stability + in-place là điểm cộng lớn.
### Explanation / Giải thích
| Sort | Avg | Worst | Stable | In-place |
| --- | --- | --- | --- | --- |
| Bubble | O(n²) | O(n²) | Yes | Yes |
| Insertion | O(n²) | O(n²) | Yes | Yes |
| Selection | O(n²) | O(n²) | No | Yes |
| Merge | O(n log n) | O(n log n) | Yes | No |
| Quick | O(n log n) | O(n²) | No | Yes |
| Heap | O(n log n) | O(n log n) | No | Yes |
| Counting | O(n+k) | O(n+k) | Yes | No |
| Radix | O(d(n+k)) | O(d(n+k)) | Yes | No |
| Bucket | avg O(n+k) | depends | depends | No |
### Example / Ví dụ
```ts
function binarySearch(arr: number[], target: number): number {
  let l = 0;
  let r = arr.length - 1;
  while (l <= r) {
    const m = (l + r) >> 1;
    if (arr[m] === target) return m;
    if (arr[m] < target) l = m + 1;
    else r = m - 1;
  }
  return -1;
}
```
---
## 10) SQL & Database / SQL & Cơ Sở Dữ Liệu
### Overview / Tổng Quan
- Backend interview thường vào index, lock, transaction, consistency.
### Explanation / Giải thích
- ACID cần hiểu cả định nghĩa lẫn trade-off.
- Isolation levels ảnh hưởng dirty/non-repeatable/phantom reads.
- Composite index theo left-prefix.
- Explain plan là công cụ bắt buộc khi tối ưu query.
### Example / Ví dụ
```sql
SELECT user_id, COUNT(*) AS total
FROM orders
GROUP BY user_id
ORDER BY total DESC
LIMIT 10;
```
```sql
CREATE INDEX idx_orders_user_created_at
ON orders(user_id, created_at DESC);
```
```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```
### DB Quick Rules
- Query trước, index sau.
- Index nhiều quá làm write chậm.
- Batch writes khi phù hợp.
---
## 11) System Design Checklist / Checklist Thiết Kế Hệ Thống
### Overview / Tổng Quan
- Mục tiêu: không bỏ sót yêu cầu quan trọng trong 45-60 phút.
### Explanation / Giải thích
#### 11.1 Requirement Clarification / Làm rõ yêu cầu
- Functional: user actions, APIs, flows.
- Non-functional: latency, throughput, availability, consistency.
- Constraints: budget, compliance, region, retention.
#### 11.2 Estimation / Ước lượng
- DAU, QPS avg/peak.
- Payload size.
- Storage growth.
- Bandwidth.
#### 11.3 High-Level Architecture / Kiến trúc mức cao
- Client → LB/API Gateway → Services → DB/Cache/Queue.
- Stateless app servers.
- Async workers cho tác vụ chậm.
#### 11.4 Data Model / Mô hình dữ liệu
- SQL vs NoSQL theo access pattern.
- Indexing strategy.
- Partition/shard key.
#### 11.5 Caching / Bộ nhớ đệm
- Cache-aside là baseline phổ biến.
- TTL + invalidation policy.
- Hot key mitigation.
#### 11.6 Async + Reliability / Bất đồng bộ + Độ tin cậy
- Queue, retry with backoff, DLQ.
- Idempotency key cho thao tác ghi quan trọng.
- Circuit breaker, rate limiting.
#### 11.7 Observability / Quan sát
- Metrics: p50/p95/p99, error rate, throughput.
- Structured logging.
- Distributed tracing.
- Alert theo SLO.
#### 11.8 Security / Bảo mật
- AuthN/AuthZ.
- Secret management.
- Input validation.
- Encryption at rest/in transit.
#### 11.9 Trade-offs / Đánh đổi
- Consistency vs availability.
- Cost vs performance.
- Complexity vs delivery speed.
### Ví dụ: URL Shortener Mini Design
- APIs:
  - `POST /shorten`
  - `GET /:code`
- Components:
  - API service.
  - Key generator.
  - Redis cache.
  - Persistent store.
- Scale:
  - CDN redirect.
  - Cache hot keys.
  - Read replica.
---
## 12) Security Quick Reference / Bảng Ghi Nhớ Bảo Mật
### Overview / Tổng Quan
- Mục tiêu: tránh lỗ hổng phổ biến trong web/backend systems.
### Explanation / Giải thích
- XSS: output encoding + sanitize.
- CSRF: same-site cookies + anti-CSRF token.
- SQL injection: parameterized query.
- SSRF: outbound allowlist + metadata endpoint block.
- AuthZ: kiểm tra quyền ở server, không tin UI.
### Example / Ví dụ
```ts
// bad
const query = `SELECT * FROM users WHERE email = '${email}'`;
// good
await db.query('SELECT * FROM users WHERE email = ?', [email]);
```
```html
<!-- CSRF token example -->
<input type="hidden" name="csrf_token" value="{{token}}" />
```
```ts
// sanitize HTML before render
import DOMPurify from 'dompurify';
const safe = DOMPurify.sanitize(userHtml);
```
---
## 13) Performance Quick Reference / Bảng Ghi Nhớ Hiệu Năng
### Overview / Tổng Quan
- FE và BE đều cần nhìn vào tail latency (p95/p99) thay vì chỉ average.
### Explanation / Giải thích
- FE:
  - LCP < 2.5s, CLS < 0.1, INP thấp.
  - Code split, image optimization, lazy load.
- BE:
  - Caching, pooling, batching.
  - Avoid N+1 query.
  - Profile trước khi tối ưu.
### Example / Ví dụ
```tsx
const Chart = React.lazy(() => import('./Chart'));
```
```ts
// naive N+1 pattern -> replace with JOIN/batch query
```
```go
// reuse http client
var client = &http.Client{Timeout: 2 * time.Second}
```
---
## 14) Behavioral STAR Template / Mẫu STAR Hành Vi
### Overview / Tổng Quan
- Trả lời behavioral nên ngắn, có số liệu, có kết quả.
### Explanation / Giải thích
- Situation: bối cảnh.
- Task: vai trò/trách nhiệm.
- Action: hành động kỹ thuật cụ thể.
- Result: outcome định lượng.
### Example / Ví dụ
- S: Incident làm checkout timeout tăng 3x.
- T: Bạn on-call owner.
- A: Rollback, thêm alert p95, tối ưu query.
- R: p95 giảm 60%, error rate về baseline.
---
## 15) Communication Prompts / Câu Mẫu Giao Tiếp
### Overview / Tổng Quan
- Truyền đạt rõ ràng giúp tăng điểm mạnh ngay cả khi chưa ra tối ưu nhất.
### Explanation / Giải thích
- Clarify: "I’ll confirm constraints before coding."
- Structure: "I’ll start with brute force, then optimize."
- Trade-off: "This reduces latency but increases write complexity."
### Example / Ví dụ
- "Given n can be up to 1e5, O(n²) may timeout, so I’ll target O(n log n)."
- "I’ll first design for correctness, then discuss scale and reliability."
---
## 16) Interview-Day Checklist / Checklist Ngày Phỏng Vấn
### Overview / Tổng Quan
- Giữ mindshare cho vấn đề kỹ thuật, giảm lỗi do môi trường.
### Explanation / Giải thích
#### Before
- [ ] Test camera/mic/network.
- [ ] Chuẩn bị môi trường yên tĩnh.
- [ ] Mở editor + scratchpad.
- [ ] Chuẩn bị câu hỏi cho interviewer.
#### During
- [ ] Nghĩ thành tiếng.
- [ ] Hỏi rõ assumptions.
- [ ] Test edge cases.
- [ ] Chốt complexity.
- [ ] Nêu trade-offs.
#### After
- [ ] Gửi thank-you note ngắn gọn.
- [ ] Ghi lại câu hỏi chưa làm tốt để ôn lại.
### Example / Ví dụ
- 3 câu nên hỏi recruiter/interviewer:
  - "How is technical impact measured for this role?"
  - "What does a successful first 90 days look like?"
  - "What are the biggest reliability challenges today?"
---
## 17) One-Page Formula Sheet / Bảng Công Thức 1 Trang
### Overview / Tổng Quan
- Công thức để estimation nhanh trong system design.
### Explanation / Giải thích
- `QPS = total requests / seconds`
- `daily storage = writes/day * avg payload`
- `availability = uptime / total time`
- `latency total = network + app + db + cache`
### Example / Ví dụ
- 10M requests/day:
  - `QPS avg ≈ 10,000,000 / 86,400 ≈ 116`
  - peak 10x => ~1,160 QPS.
---
## 18) Edge Cases Bank / Ngân Hàng Edge Cases
### Overview / Tổng Quan
- Edge-case coverage giúp tránh bug trong live coding.
### Explanation / Giải thích
- Arrays/Strings: empty, one item, duplicates, huge input.
- Numbers: negative, zero, overflow.
- Graphs: disconnected, cycle, self-loop.
- APIs: timeout, retries, partial failure.
### Example / Ví dụ
```ts
// edge case template
if (!input || input.length === 0) return defaultValue;
```
---
## 19) Git & Tooling Quick Commands / Lệnh Nhanh Git & Tooling
### Overview / Tổng Quan
- Không phải trọng tâm interview, nhưng giúp thao tác mượt.
### Explanation / Giải thích
- `git status`, `git add -p`, `git commit -m`.
- `git stash`, `git rebase -i`, `git log --oneline --graph`.
### Example / Ví dụ
```bash
git status
git add -p
git commit -m "fix: handle edge case"
git log --oneline --graph --decorate -n 10
```
---
## 20) Rapid Revision Plan (30-60m) / Kế Hoạch Ôn Nhanh (30-60p)
### Overview / Tổng Quan
- Dành cho trước buổi interview.
### Explanation / Giải thích
- 0-10m: complexity + pattern.
- 10-25m: JS/TS/React traps.
- 25-45m: system design checklist.
- 45-60m: behavioral STAR recap.
### Example / Ví dụ
- Chọn 1 câu coding + 1 system design + 1 behavioral để warm-up.
---
## Câu Hỏi Phỏng Vấn / Interview Q&A
### JavaScript
- 🟢 [Junior] Q: `var`, `let`, `const` khác gì?
  - A: Scope + hoisting + khả năng redeclare/reassign khác nhau.
- 🟢 [Junior] Q: Closure là gì?
  - A: Function giữ lexical environment khi chạy ngoài scope gốc.
- 🟡 [Mid] Q: Event loop xử lý microtask/macrotask ra sao?
  - A: Flush microtask trước, sau đó chạy macrotask.
- 🟡 [Mid] Q: Debounce vs throttle?
  - A: Debounce gom burst cuối; throttle giới hạn tần suất đều.
- 🔴 [Senior] Q: Cách giảm memory leak ở SPA?
  - A: Cleanup subscriptions/listeners/timers + profile heap snapshots.
### TypeScript
- 🟢 [Junior] Q: `unknown` và `any`?
  - A: `unknown` buộc narrow trước khi dùng; `any` bỏ type safety.
- 🟢 [Junior] Q: Utility types dùng để làm gì?
  - A: Compose type nhanh cho DTO/view models.
- 🟡 [Mid] Q: Discriminated union giúp gì?
  - A: Exhaustive handling cho state machine/API result.
- 🟡 [Mid] Q: Khi nào cần generic constraint?
  - A: Khi function yêu cầu shape tối thiểu.
- 🔴 [Senior] Q: Thiết kế API client type-safe thế nào?
  - A: Shared schema + runtime parsing + typed error union.
### React
- 🟢 [Junior] Q: Controlled component là gì?
  - A: Input do state React điều khiển.
- 🟢 [Junior] Q: `useEffect` chạy khi nào?
  - A: Sau render; phụ thuộc dependency array.
- 🟡 [Mid] Q: Vì sao key ổn định quan trọng?
  - A: Đảm bảo identity element khi reconcile.
- 🟡 [Mid] Q: Khi nào dùng `useMemo`?
  - A: Tính toán nặng hoặc cần stable reference có đo đạc.
- 🔴 [Senior] Q: Tối ưu danh sách 50k items?
  - A: Virtualization + memo row + pagination/windowing.
### Next.js
- 🟢 [Junior] Q: Server vs Client Components?
  - A: Server giảm bundle client; Client cho interactivity/hooks.
- 🟢 [Junior] Q: Route Handler dùng khi nào?
  - A: API endpoint nội bộ/webhooks.
- 🟡 [Mid] Q: `revalidate` dùng cho gì?
  - A: Làm mới cache theo chu kỳ.
- 🟡 [Mid] Q: Khi nào `no-store`?
  - A: Dữ liệu realtime/không cache.
- 🔴 [Senior] Q: Caching strategy cho news app?
  - A: ISR + event invalidation + CDN + segmented cache keys.
### Go Backend
- 🟢 [Junior] Q: Goroutine là gì?
  - A: Lightweight concurrent task do Go runtime quản lý.
- 🟢 [Junior] Q: Channel giúp gì?
  - A: Giao tiếp và đồng bộ giữa goroutines.
- 🟡 [Mid] Q: Vì sao luôn truyền context?
  - A: Propagate timeout/cancel/deadline xuyên service chain.
- 🟡 [Mid] Q: Interface nhỏ có lợi ích gì?
  - A: Tăng testability, giảm coupling.
- 🔴 [Senior] Q: Ngăn goroutine leak thế nào?
  - A: Respect ctx.Done, close channels đúng owner, bounded workers.
### Database
- 🟢 [Junior] Q: Index là gì?
  - A: Cấu trúc dữ liệu tăng tốc query, đổi lại tốn ghi và lưu trữ.
- 🟢 [Junior] Q: Transaction là gì?
  - A: Nhóm thao tác đảm bảo ACID.
- 🟡 [Mid] Q: Composite index hoạt động sao?
  - A: Theo left-prefix, thứ tự cột quyết định hiệu quả.
- 🟡 [Mid] Q: N+1 query xử lý sao?
  - A: JOIN/batch loading/caching.
- 🔴 [Senior] Q: Deadlock mitigation?
  - A: Consistent lock ordering + short tx + retry backoff.
### System Design
- 🟢 [Junior] Q: Load balancer có vai trò gì?
  - A: Phân phối tải và tăng availability.
- 🟢 [Junior] Q: Cache-aside là gì?
  - A: Read cache trước, miss thì DB rồi set cache.
- 🟡 [Mid] Q: Idempotency key dùng khi nào?
  - A: Request retry cho thao tác ghi quan trọng.
- 🟡 [Mid] Q: Queue hữu ích gì?
  - A: Tách async processing và absorb traffic spikes.
- 🔴 [Senior] Q: Thiết kế notification cho 10M users?
  - A: Fanout async, per-channel workers, retry + DLQ, observability.
### Security
- 🟢 [Junior] Q: XSS là gì?
  - A: Chèn script độc vào nội dung hiển thị.
- 🟢 [Junior] Q: CSRF là gì?
  - A: Lợi dụng phiên đăng nhập để gửi request trái phép.
- 🟡 [Mid] Q: JWT nên lưu ở đâu trên web?
  - A: Thường ưu tiên HttpOnly secure cookie.
- 🟡 [Mid] Q: SQL injection chống thế nào?
  - A: Parameterized queries + validation.
- 🔴 [Senior] Q: Defense-in-depth gồm gì?
  - A: Validation, authz, headers, monitoring, incident response.
### Behavioral
- 🟢 [Junior] Q: Kể về bug khó bạn xử lý.
  - A: Trình bày theo STAR, có metric kết quả.
- 🟢 [Junior] Q: Bạn học công nghệ mới thế nào?
  - A: Learning loop: docs -> mini project -> shareback.
- 🟡 [Mid] Q: Khi bất đồng kỹ thuật trong team?
  - A: Đưa dữ liệu, thử nghiệm nhỏ, thống nhất tiêu chí.
- 🟡 [Mid] Q: Cách bạn mentor junior?
  - A: Pairing, review theo rubric, growth plan rõ ràng.
- 🔴 [Senior] Q: Dẫn migration lớn ra sao?
  - A: Milestones, risk matrix, rollback plan, stakeholder sync.
### Bonus Lightning Q&A
- 🟢 [Junior] Q: HTTP 401 vs 403?
  - A: 401 chưa xác thực, 403 không đủ quyền.
- 🟢 [Junior] Q: `map` vs `forEach`?
  - A: `map` trả array mới; `forEach` side effects.
- 🟢 [Junior] Q: REST vs GraphQL?
  - A: REST endpoint-centric, GraphQL query-centric.
- 🟡 [Mid] Q: p95/p99 quan trọng vì sao?
  - A: Phản ánh trải nghiệm tail latency.
- 🟡 [Mid] Q: Blue-green deploy là gì?
  - A: Chuyển traffic giữa 2 env để giảm rủi ro.
- 🟡 [Mid] Q: Feature flag lợi ích gì?
  - A: Controlled rollout, kill switch nhanh.
- 🔴 [Senior] Q: Active-active multi-region trade-off?
  - A: HA cao hơn nhưng consistency/conflict resolution phức tạp.
- 🔴 [Senior] Q: SLI/SLO/SLA khác nhau thế nào?
  - A: SLI metric, SLO target nội bộ, SLA cam kết khách hàng.
---
## Final Quick Notes / Ghi Nhớ Cuối
- Trả lời ngắn, có cấu trúc, có trade-off.
- Khi code: nói rõ complexity + edge cases.
- Khi design: clarify requirements trước.
- Khi behavioral: dùng STAR + kết quả định lượng.
---
[← Back to Table of Contents](./00-table-of-contents.md)
