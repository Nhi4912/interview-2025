# Frontend Coding Patterns / Mẫu Tư Duy Lập Trình FE


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

[Back to Table of Contents](../../00-table-of-contents.md) | [JavaScript Challenges](./11-interview-practice-01-javascript-challenges.md) | [Web APIs](./00-web-apis-fundamentals.md)

## Overview
Các pattern kinh điển giúp giải bài interview nhanh và có cấu trúc.

## Pattern 1: sliding window
### Overview / Tổng Quan
Pattern sliding window giúp giảm brute-force và tăng khả năng giải thích logic trong interview.
### Explanation / Giải thích
- Gợi ý 1: mô tả invariant, điều kiện dừng, và complexity khi dùng sliding window.
- Gợi ý 2: mô tả invariant, điều kiện dừng, và complexity khi dùng sliding window.
- Gợi ý 3: mô tả invariant, điều kiện dừng, và complexity khi dùng sliding window.
- Gợi ý 4: mô tả invariant, điều kiện dừng, và complexity khi dùng sliding window.
- Gợi ý 5: mô tả invariant, điều kiện dừng, và complexity khi dùng sliding window.
- Gợi ý 6: mô tả invariant, điều kiện dừng, và complexity khi dùng sliding window.
- Gợi ý 7: mô tả invariant, điều kiện dừng, và complexity khi dùng sliding window.
- Gợi ý 8: mô tả invariant, điều kiện dừng, và complexity khi dùng sliding window.
- Gợi ý 9: mô tả invariant, điều kiện dừng, và complexity khi dùng sliding window.
- Gợi ý 10: mô tả invariant, điều kiện dừng, và complexity khi dùng sliding window.
### Example / Ví dụ
```ts
export function maxSumK(nums: number[], k: number): number {
  if (k <= 0 || k > nums.length) return 0;
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    best = Math.max(best, sum);
  }
  return best;
}
```
- Mở rộng 1: liên hệ sliding window với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 2: liên hệ sliding window với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 3: liên hệ sliding window với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 4: liên hệ sliding window với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 5: liên hệ sliding window với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 6: liên hệ sliding window với bài toán FE thực tế (search, rendering, parsing).

## Pattern 2: two pointers
### Overview / Tổng Quan
Pattern two pointers giúp giảm brute-force và tăng khả năng giải thích logic trong interview.
### Explanation / Giải thích
- Gợi ý 1: mô tả invariant, điều kiện dừng, và complexity khi dùng two pointers.
- Gợi ý 2: mô tả invariant, điều kiện dừng, và complexity khi dùng two pointers.
- Gợi ý 3: mô tả invariant, điều kiện dừng, và complexity khi dùng two pointers.
- Gợi ý 4: mô tả invariant, điều kiện dừng, và complexity khi dùng two pointers.
- Gợi ý 5: mô tả invariant, điều kiện dừng, và complexity khi dùng two pointers.
- Gợi ý 6: mô tả invariant, điều kiện dừng, và complexity khi dùng two pointers.
- Gợi ý 7: mô tả invariant, điều kiện dừng, và complexity khi dùng two pointers.
- Gợi ý 8: mô tả invariant, điều kiện dừng, và complexity khi dùng two pointers.
- Gợi ý 9: mô tả invariant, điều kiện dừng, và complexity khi dùng two pointers.
- Gợi ý 10: mô tả invariant, điều kiện dừng, và complexity khi dùng two pointers.
### Example / Ví dụ
```ts
export function hasPairSorted(nums: number[], target: number): boolean {
  let l = 0;
  let r = nums.length - 1;
  while (l < r) {
    const s = nums[l] + nums[r];
    if (s === target) return true;
    if (s < target) l++; else r--;
  }
  return false;
}
```
- Mở rộng 1: liên hệ two pointers với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 2: liên hệ two pointers với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 3: liên hệ two pointers với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 4: liên hệ two pointers với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 5: liên hệ two pointers với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 6: liên hệ two pointers với bài toán FE thực tế (search, rendering, parsing).

## Pattern 3: BFS/DFS in DOM
### Overview / Tổng Quan
Pattern BFS/DFS in DOM giúp giảm brute-force và tăng khả năng giải thích logic trong interview.
### Explanation / Giải thích
- Gợi ý 1: mô tả invariant, điều kiện dừng, và complexity khi dùng BFS/DFS in DOM.
- Gợi ý 2: mô tả invariant, điều kiện dừng, và complexity khi dùng BFS/DFS in DOM.
- Gợi ý 3: mô tả invariant, điều kiện dừng, và complexity khi dùng BFS/DFS in DOM.
- Gợi ý 4: mô tả invariant, điều kiện dừng, và complexity khi dùng BFS/DFS in DOM.
- Gợi ý 5: mô tả invariant, điều kiện dừng, và complexity khi dùng BFS/DFS in DOM.
- Gợi ý 6: mô tả invariant, điều kiện dừng, và complexity khi dùng BFS/DFS in DOM.
- Gợi ý 7: mô tả invariant, điều kiện dừng, và complexity khi dùng BFS/DFS in DOM.
- Gợi ý 8: mô tả invariant, điều kiện dừng, và complexity khi dùng BFS/DFS in DOM.
- Gợi ý 9: mô tả invariant, điều kiện dừng, và complexity khi dùng BFS/DFS in DOM.
- Gợi ý 10: mô tả invariant, điều kiện dừng, và complexity khi dùng BFS/DFS in DOM.
### Example / Ví dụ
```ts
export function bfs(root: Element): string[] {
  const q: Element[] = [root];
  const out: string[] = [];
  while (q.length) {
    const node = q.shift()!;
    out.push(node.tagName.toLowerCase());
    q.push(...Array.from(node.children));
  }
  return out;
}

export function dfs(root: Element, out: string[] = []): string[] {
  out.push(root.tagName.toLowerCase());
  for (const child of Array.from(root.children)) dfs(child, out);
  return out;
}
```
- Mở rộng 1: liên hệ BFS/DFS in DOM với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 2: liên hệ BFS/DFS in DOM với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 3: liên hệ BFS/DFS in DOM với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 4: liên hệ BFS/DFS in DOM với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 5: liên hệ BFS/DFS in DOM với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 6: liên hệ BFS/DFS in DOM với bài toán FE thực tế (search, rendering, parsing).

## Pattern 4: recursion patterns
### Overview / Tổng Quan
Pattern recursion patterns giúp giảm brute-force và tăng khả năng giải thích logic trong interview.
### Explanation / Giải thích
- Gợi ý 1: mô tả invariant, điều kiện dừng, và complexity khi dùng recursion patterns.
- Gợi ý 2: mô tả invariant, điều kiện dừng, và complexity khi dùng recursion patterns.
- Gợi ý 3: mô tả invariant, điều kiện dừng, và complexity khi dùng recursion patterns.
- Gợi ý 4: mô tả invariant, điều kiện dừng, và complexity khi dùng recursion patterns.
- Gợi ý 5: mô tả invariant, điều kiện dừng, và complexity khi dùng recursion patterns.
- Gợi ý 6: mô tả invariant, điều kiện dừng, và complexity khi dùng recursion patterns.
- Gợi ý 7: mô tả invariant, điều kiện dừng, và complexity khi dùng recursion patterns.
- Gợi ý 8: mô tả invariant, điều kiện dừng, và complexity khi dùng recursion patterns.
- Gợi ý 9: mô tả invariant, điều kiện dừng, và complexity khi dùng recursion patterns.
- Gợi ý 10: mô tả invariant, điều kiện dừng, và complexity khi dùng recursion patterns.
### Example / Ví dụ
```ts
export function walkObject(input: unknown, visit: (path: string, value: unknown) => void, path = 'root'): void {
  visit(path, input);
  if (Array.isArray(input)) {
    input.forEach((v, i) => walkObject(v, visit, `${path}[${i}]`));
    return;
  }
  if (input && typeof input === 'object') {
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      walkObject(v, visit, `${path}.${k}`);
    }
  }
}
```
- Mở rộng 1: liên hệ recursion patterns với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 2: liên hệ recursion patterns với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 3: liên hệ recursion patterns với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 4: liên hệ recursion patterns với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 5: liên hệ recursion patterns với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 6: liên hệ recursion patterns với bài toán FE thực tế (search, rendering, parsing).

## Pattern 5: memoization
### Overview / Tổng Quan
Pattern memoization giúp giảm brute-force và tăng khả năng giải thích logic trong interview.
### Explanation / Giải thích
- Gợi ý 1: mô tả invariant, điều kiện dừng, và complexity khi dùng memoization.
- Gợi ý 2: mô tả invariant, điều kiện dừng, và complexity khi dùng memoization.
- Gợi ý 3: mô tả invariant, điều kiện dừng, và complexity khi dùng memoization.
- Gợi ý 4: mô tả invariant, điều kiện dừng, và complexity khi dùng memoization.
- Gợi ý 5: mô tả invariant, điều kiện dừng, và complexity khi dùng memoization.
- Gợi ý 6: mô tả invariant, điều kiện dừng, và complexity khi dùng memoization.
- Gợi ý 7: mô tả invariant, điều kiện dừng, và complexity khi dùng memoization.
- Gợi ý 8: mô tả invariant, điều kiện dừng, và complexity khi dùng memoization.
- Gợi ý 9: mô tả invariant, điều kiện dừng, và complexity khi dùng memoization.
- Gợi ý 10: mô tả invariant, điều kiện dừng, và complexity khi dùng memoization.
### Example / Ví dụ
```ts
export function memoFib() {
  const cache = new Map<number, number>([[0, 0], [1, 1]]);
  const fib = (n: number): number => {
    if (cache.has(n)) return cache.get(n)!;
    const val = fib(n - 1) + fib(n - 2);
    cache.set(n, val);
    return val;
  };
  return fib;
}
```
- Mở rộng 1: liên hệ memoization với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 2: liên hệ memoization với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 3: liên hệ memoization với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 4: liên hệ memoization với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 5: liên hệ memoization với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 6: liên hệ memoization với bài toán FE thực tế (search, rendering, parsing).

## Pattern 6: functional composition
### Overview / Tổng Quan
Pattern functional composition giúp giảm brute-force và tăng khả năng giải thích logic trong interview.
### Explanation / Giải thích
- Gợi ý 1: mô tả invariant, điều kiện dừng, và complexity khi dùng functional composition.
- Gợi ý 2: mô tả invariant, điều kiện dừng, và complexity khi dùng functional composition.
- Gợi ý 3: mô tả invariant, điều kiện dừng, và complexity khi dùng functional composition.
- Gợi ý 4: mô tả invariant, điều kiện dừng, và complexity khi dùng functional composition.
- Gợi ý 5: mô tả invariant, điều kiện dừng, và complexity khi dùng functional composition.
- Gợi ý 6: mô tả invariant, điều kiện dừng, và complexity khi dùng functional composition.
- Gợi ý 7: mô tả invariant, điều kiện dừng, và complexity khi dùng functional composition.
- Gợi ý 8: mô tả invariant, điều kiện dừng, và complexity khi dùng functional composition.
- Gợi ý 9: mô tả invariant, điều kiện dừng, và complexity khi dùng functional composition.
- Gợi ý 10: mô tả invariant, điều kiện dừng, và complexity khi dùng functional composition.
### Example / Ví dụ
```ts
type Fn<T> = (x: T) => T;

export function compose<T>(...fns: Fn<T>[]) {
  return (input: T) => fns.reduceRight((acc, fn) => fn(acc), input);
}

const trim = (s: string) => s.trim();
const lower = (s: string) => s.toLowerCase();
const slug = compose((s: string) => s.replace(/\s+/g, '-'), lower, trim);
```
- Mở rộng 1: liên hệ functional composition với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 2: liên hệ functional composition với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 3: liên hệ functional composition với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 4: liên hệ functional composition với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 5: liên hệ functional composition với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 6: liên hệ functional composition với bài toán FE thực tế (search, rendering, parsing).

## Pattern 7: middleware pattern
### Overview / Tổng Quan
Pattern middleware pattern giúp giảm brute-force và tăng khả năng giải thích logic trong interview.
### Explanation / Giải thích
- Gợi ý 1: mô tả invariant, điều kiện dừng, và complexity khi dùng middleware pattern.
- Gợi ý 2: mô tả invariant, điều kiện dừng, và complexity khi dùng middleware pattern.
- Gợi ý 3: mô tả invariant, điều kiện dừng, và complexity khi dùng middleware pattern.
- Gợi ý 4: mô tả invariant, điều kiện dừng, và complexity khi dùng middleware pattern.
- Gợi ý 5: mô tả invariant, điều kiện dừng, và complexity khi dùng middleware pattern.
- Gợi ý 6: mô tả invariant, điều kiện dừng, và complexity khi dùng middleware pattern.
- Gợi ý 7: mô tả invariant, điều kiện dừng, và complexity khi dùng middleware pattern.
- Gợi ý 8: mô tả invariant, điều kiện dừng, và complexity khi dùng middleware pattern.
- Gợi ý 9: mô tả invariant, điều kiện dừng, và complexity khi dùng middleware pattern.
- Gợi ý 10: mô tả invariant, điều kiện dừng, và complexity khi dùng middleware pattern.
### Example / Ví dụ
```ts
type Ctx = { reqId: string; logs: string[] };
type Next = () => Promise<void>;
type Middleware = (ctx: Ctx, next: Next) => Promise<void>;

export function createPipeline(middlewares: Middleware[]) {
  return async (ctx: Ctx) => {
    let i = -1;
    const run = async (index: number): Promise<void> => {
      if (index <= i) throw new Error('next called twice');
      i = index;
      const mw = middlewares[index];
      if (!mw) return;
      await mw(ctx, () => run(index + 1));
    };
    await run(0);
  };
}
```
- Mở rộng 1: liên hệ middleware pattern với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 2: liên hệ middleware pattern với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 3: liên hệ middleware pattern với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 4: liên hệ middleware pattern với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 5: liên hệ middleware pattern với bài toán FE thực tế (search, rendering, parsing).
- Mở rộng 6: liên hệ middleware pattern với bài toán FE thực tế (search, rendering, parsing).

## Câu Hỏi Phỏng Vấn / Interview Q&A
### 🟢 [Junior] Q1: Khi nào bạn chọn pattern sliding window?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q2: Khi nào bạn chọn pattern two pointers?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q3: Khi nào bạn chọn pattern BFS/DFS in DOM?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q4: Khi nào bạn chọn pattern recursion patterns?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q5: Khi nào bạn chọn pattern memoization?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q6: Khi nào bạn chọn pattern functional composition?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q7: Khi nào bạn chọn pattern middleware pattern?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q8: Khi nào bạn chọn pattern sliding window?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q9: Khi nào bạn chọn pattern two pointers?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q10: Khi nào bạn chọn pattern BFS/DFS in DOM?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q11: Khi nào bạn chọn pattern recursion patterns?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q12: Khi nào bạn chọn pattern memoization?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q13: Khi nào bạn chọn pattern functional composition?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q14: Khi nào bạn chọn pattern middleware pattern?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q15: Khi nào bạn chọn pattern sliding window?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q16: Khi nào bạn chọn pattern two pointers?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q17: Khi nào bạn chọn pattern BFS/DFS in DOM?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q18: Khi nào bạn chọn pattern recursion patterns?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q19: Khi nào bạn chọn pattern memoization?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q20: Khi nào bạn chọn pattern functional composition?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q21: Khi nào bạn chọn pattern middleware pattern?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q22: Khi nào bạn chọn pattern sliding window?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q23: Khi nào bạn chọn pattern two pointers?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q24: Khi nào bạn chọn pattern BFS/DFS in DOM?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q25: Khi nào bạn chọn pattern recursion patterns?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q26: Khi nào bạn chọn pattern memoization?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q27: Khi nào bạn chọn pattern functional composition?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q28: Khi nào bạn chọn pattern middleware pattern?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q29: Khi nào bạn chọn pattern sliding window?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q30: Khi nào bạn chọn pattern two pointers?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q31: Khi nào bạn chọn pattern BFS/DFS in DOM?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q32: Khi nào bạn chọn pattern recursion patterns?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q33: Khi nào bạn chọn pattern memoization?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q34: Khi nào bạn chọn pattern functional composition?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q35: Khi nào bạn chọn pattern middleware pattern?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q36: Khi nào bạn chọn pattern sliding window?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q37: Khi nào bạn chọn pattern two pointers?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q38: Khi nào bạn chọn pattern BFS/DFS in DOM?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q39: Khi nào bạn chọn pattern recursion patterns?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q40: Khi nào bạn chọn pattern memoization?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q41: Khi nào bạn chọn pattern functional composition?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q42: Khi nào bạn chọn pattern middleware pattern?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q43: Khi nào bạn chọn pattern sliding window?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q44: Khi nào bạn chọn pattern two pointers?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q45: Khi nào bạn chọn pattern BFS/DFS in DOM?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q46: Khi nào bạn chọn pattern recursion patterns?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q47: Khi nào bạn chọn pattern memoization?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q48: Khi nào bạn chọn pattern functional composition?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q49: Khi nào bạn chọn pattern middleware pattern?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q50: Khi nào bạn chọn pattern sliding window?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q51: Khi nào bạn chọn pattern two pointers?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q52: Khi nào bạn chọn pattern BFS/DFS in DOM?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q53: Khi nào bạn chọn pattern recursion patterns?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q54: Khi nào bạn chọn pattern memoization?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q55: Khi nào bạn chọn pattern functional composition?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q56: Khi nào bạn chọn pattern middleware pattern?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q57: Khi nào bạn chọn pattern sliding window?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q58: Khi nào bạn chọn pattern two pointers?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q59: Khi nào bạn chọn pattern BFS/DFS in DOM?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q60: Khi nào bạn chọn pattern recursion patterns?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q61: Khi nào bạn chọn pattern memoization?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q62: Khi nào bạn chọn pattern functional composition?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q63: Khi nào bạn chọn pattern middleware pattern?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q64: Khi nào bạn chọn pattern sliding window?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q65: Khi nào bạn chọn pattern two pointers?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q66: Khi nào bạn chọn pattern BFS/DFS in DOM?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q67: Khi nào bạn chọn pattern recursion patterns?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q68: Khi nào bạn chọn pattern memoization?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q69: Khi nào bạn chọn pattern functional composition?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q70: Khi nào bạn chọn pattern middleware pattern?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q71: Khi nào bạn chọn pattern sliding window?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q72: Khi nào bạn chọn pattern two pointers?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q73: Khi nào bạn chọn pattern BFS/DFS in DOM?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q74: Khi nào bạn chọn pattern recursion patterns?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🔴 [Senior] Q75: Khi nào bạn chọn pattern memoization?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟢 [Junior] Q76: Khi nào bạn chọn pattern functional composition?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
### 🟡 [Mid] Q77: Khi nào bạn chọn pattern middleware pattern?
- **Answer (EN):** Choose based on constraints, data shape, and readability.
- **Trả lời (VI):** Chọn pattern theo ràng buộc dữ liệu, tốc độ cần đạt, và khả năng bảo trì.
- **Ví dụ:** Trình bày một case FE thực tế đã dùng pattern này.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
- Study tip: luyện cách so sánh 2 pattern gần nhau và lý do loại trừ.
