# JavaScript Interview Practice 01 / Thử Thách JavaScript 01


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

[Back to Table of Contents](../../00-table-of-contents.md) | [Web APIs](./00-web-apis-fundamentals.md) | [Practice 01B](./11-interview-practice-01-javascript-coding-challenges.md)

## Overview
Tài liệu này tập trung vào các bài coding challenge kinh điển được hỏi nhiều trong phỏng vấn Frontend/JavaScript.

## Overview / Tổng Quan
- Mỗi bài gồm: statement, hướng tiếp cận, code TypeScript, và phân tích độ phức tạp.
- Mục tiêu: biết cách nói thành tiếng trong interview, không chỉ viết code chạy được.

## Challenge 1: debounce
### Overview / Tổng Quan
Bài toán debounce xuất hiện thường xuyên vì kiểm tra tư duy API design và edge cases. Giới hạn số lần gọi hàm khi user input liên tục.
### Explanation / Giải thích
- Step 1: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 2: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 3: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 4: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 5: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 6: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 7: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 8: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 9: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 10: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
### Example / Ví dụ
```ts
export function debounce<T extends (...args: unknown[]) => void>(fn: T, wait = 200) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
```
### Discussion
- Interview tip 1: nêu trade-off của giải pháp debounce với readability và hiệu năng.
- Interview tip 2: nêu trade-off của giải pháp debounce với readability và hiệu năng.
- Interview tip 3: nêu trade-off của giải pháp debounce với readability và hiệu năng.
- Interview tip 4: nêu trade-off của giải pháp debounce với readability và hiệu năng.
- Interview tip 5: nêu trade-off của giải pháp debounce với readability và hiệu năng.
- Interview tip 6: nêu trade-off của giải pháp debounce với readability và hiệu năng.
- Interview tip 7: nêu trade-off của giải pháp debounce với readability và hiệu năng.
- Interview tip 8: nêu trade-off của giải pháp debounce với readability và hiệu năng.

## Challenge 2: throttle
### Overview / Tổng Quan
Bài toán throttle xuất hiện thường xuyên vì kiểm tra tư duy API design và edge cases. Đảm bảo hàm chạy tối đa một lần trong mỗi khoảng thời gian.
### Explanation / Giải thích
- Step 1: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 2: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 3: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 4: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 5: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 6: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 7: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 8: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 9: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 10: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
### Example / Ví dụ
```ts
export function throttle<T extends (...args: unknown[]) => void>(fn: T, wait = 200) {
  let last = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      last = now;
      fn(...args);
      return;
    }
    if (!timeout) {
      timeout = setTimeout(() => {
        last = Date.now();
        timeout = null;
        fn(...args);
      }, remaining);
    }
  };
}
```
### Discussion
- Interview tip 1: nêu trade-off của giải pháp throttle với readability và hiệu năng.
- Interview tip 2: nêu trade-off của giải pháp throttle với readability và hiệu năng.
- Interview tip 3: nêu trade-off của giải pháp throttle với readability và hiệu năng.
- Interview tip 4: nêu trade-off của giải pháp throttle với readability và hiệu năng.
- Interview tip 5: nêu trade-off của giải pháp throttle với readability và hiệu năng.
- Interview tip 6: nêu trade-off của giải pháp throttle với readability và hiệu năng.
- Interview tip 7: nêu trade-off của giải pháp throttle với readability và hiệu năng.
- Interview tip 8: nêu trade-off của giải pháp throttle với readability và hiệu năng.

## Challenge 3: deep clone
### Overview / Tổng Quan
Bài toán deep clone xuất hiện thường xuyên vì kiểm tra tư duy API design và edge cases. Sao chép object lồng nhau và xử lý circular reference.
### Explanation / Giải thích
- Step 1: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 2: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 3: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 4: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 5: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 6: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 7: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 8: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 9: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 10: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
### Example / Ví dụ
```ts
export function deepClone<T>(input: T, seen = new WeakMap<object, unknown>()): T {
  if (input === null || typeof input !== 'object') return input;
  if (seen.has(input as object)) return seen.get(input as object) as T;
  const output: unknown = Array.isArray(input) ? [] : {};
  seen.set(input as object, output);
  for (const key of Object.keys(input as Record<string, unknown>)) {
    (output as Record<string, unknown>)[key] = deepClone((input as Record<string, unknown>)[key], seen);
  }
  return output as T;
}
```
### Discussion
- Interview tip 1: nêu trade-off của giải pháp deep clone với readability và hiệu năng.
- Interview tip 2: nêu trade-off của giải pháp deep clone với readability và hiệu năng.
- Interview tip 3: nêu trade-off của giải pháp deep clone với readability và hiệu năng.
- Interview tip 4: nêu trade-off của giải pháp deep clone với readability và hiệu năng.
- Interview tip 5: nêu trade-off của giải pháp deep clone với readability và hiệu năng.
- Interview tip 6: nêu trade-off của giải pháp deep clone với readability và hiệu năng.
- Interview tip 7: nêu trade-off của giải pháp deep clone với readability và hiệu năng.
- Interview tip 8: nêu trade-off của giải pháp deep clone với readability và hiệu năng.

## Challenge 4: Promise.all
### Overview / Tổng Quan
Bài toán Promise.all xuất hiện thường xuyên vì kiểm tra tư duy API design và edge cases. Tổng hợp nhiều promise và fail-fast đúng chuẩn.
### Explanation / Giải thích
- Step 1: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 2: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 3: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 4: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 5: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 6: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 7: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 8: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 9: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 10: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
### Example / Ví dụ
```ts
export function customPromiseAll<T>(promises: Array<Promise<T> | T>): Promise<T[]> {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) return resolve([]);
    const out: T[] = new Array(promises.length);
    let completed = 0;
    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then((value) => {
          out[index] = value;
          completed += 1;
          if (completed === promises.length) resolve(out);
        })
        .catch(reject);
    });
  });
}
```
### Discussion
- Interview tip 1: nêu trade-off của giải pháp Promise.all với readability và hiệu năng.
- Interview tip 2: nêu trade-off của giải pháp Promise.all với readability và hiệu năng.
- Interview tip 3: nêu trade-off của giải pháp Promise.all với readability và hiệu năng.
- Interview tip 4: nêu trade-off của giải pháp Promise.all với readability và hiệu năng.
- Interview tip 5: nêu trade-off của giải pháp Promise.all với readability và hiệu năng.
- Interview tip 6: nêu trade-off của giải pháp Promise.all với readability và hiệu năng.
- Interview tip 7: nêu trade-off của giải pháp Promise.all với readability và hiệu năng.
- Interview tip 8: nêu trade-off của giải pháp Promise.all với readability và hiệu năng.

## Challenge 5: EventEmitter
### Overview / Tổng Quan
Bài toán EventEmitter xuất hiện thường xuyên vì kiểm tra tư duy API design và edge cases. Hệ thống subscribe/emit/off đơn giản.
### Explanation / Giải thích
- Step 1: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 2: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 3: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 4: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 5: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 6: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 7: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 8: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 9: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 10: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
### Example / Ví dụ
```ts
type Handler<T = unknown> = (payload: T) => void;

export class EventEmitter {
  private events = new Map<string, Set<Handler>>();

  on(event: string, handler: Handler): () => void {
    if (!this.events.has(event)) this.events.set(event, new Set());
    this.events.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  off(event: string, handler: Handler): void {
    this.events.get(event)?.delete(handler);
  }

  emit(event: string, payload?: unknown): void {
    this.events.get(event)?.forEach((h) => h(payload));
  }
}
```
### Discussion
- Interview tip 1: nêu trade-off của giải pháp EventEmitter với readability và hiệu năng.
- Interview tip 2: nêu trade-off của giải pháp EventEmitter với readability và hiệu năng.
- Interview tip 3: nêu trade-off của giải pháp EventEmitter với readability và hiệu năng.
- Interview tip 4: nêu trade-off của giải pháp EventEmitter với readability và hiệu năng.
- Interview tip 5: nêu trade-off của giải pháp EventEmitter với readability và hiệu năng.
- Interview tip 6: nêu trade-off của giải pháp EventEmitter với readability và hiệu năng.
- Interview tip 7: nêu trade-off của giải pháp EventEmitter với readability và hiệu năng.
- Interview tip 8: nêu trade-off của giải pháp EventEmitter với readability và hiệu năng.

## Challenge 6: curry
### Overview / Tổng Quan
Bài toán curry xuất hiện thường xuyên vì kiểm tra tư duy API design và edge cases. Biến hàm nhiều tham số thành chuỗi hàm một tham số.
### Explanation / Giải thích
- Step 1: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 2: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 3: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 4: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 5: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 6: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 7: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 8: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 9: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 10: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
### Example / Ví dụ
```ts
export function curry<A, B, C>(fn: (a: A, b: B, c: C) => unknown) {
  return (a: A) => (b: B) => (c: C) => fn(a, b, c);
}

const sum3 = (a: number, b: number, c: number) => a + b + c;
const curried = curry(sum3);
const value = curried(1)(2)(3);
```
### Discussion
- Interview tip 1: nêu trade-off của giải pháp curry với readability và hiệu năng.
- Interview tip 2: nêu trade-off của giải pháp curry với readability và hiệu năng.
- Interview tip 3: nêu trade-off của giải pháp curry với readability và hiệu năng.
- Interview tip 4: nêu trade-off của giải pháp curry với readability và hiệu năng.
- Interview tip 5: nêu trade-off của giải pháp curry với readability và hiệu năng.
- Interview tip 6: nêu trade-off của giải pháp curry với readability và hiệu năng.
- Interview tip 7: nêu trade-off của giải pháp curry với readability và hiệu năng.
- Interview tip 8: nêu trade-off của giải pháp curry với readability và hiệu năng.

## Challenge 7: flatten
### Overview / Tổng Quan
Bài toán flatten xuất hiện thường xuyên vì kiểm tra tư duy API design và edge cases. Làm phẳng mảng lồng nhau theo depth.
### Explanation / Giải thích
- Step 1: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 2: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 3: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 4: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 5: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 6: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 7: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 8: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 9: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 10: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
### Example / Ví dụ
```ts
export function flatten(arr: unknown[], depth = 1): unknown[] {
  if (depth === 0) return arr.slice();
  const out: unknown[] = [];
  for (const item of arr) {
    if (Array.isArray(item)) out.push(...flatten(item, depth - 1));
    else out.push(item);
  }
  return out;
}
```
### Discussion
- Interview tip 1: nêu trade-off của giải pháp flatten với readability và hiệu năng.
- Interview tip 2: nêu trade-off của giải pháp flatten với readability và hiệu năng.
- Interview tip 3: nêu trade-off của giải pháp flatten với readability và hiệu năng.
- Interview tip 4: nêu trade-off của giải pháp flatten với readability và hiệu năng.
- Interview tip 5: nêu trade-off của giải pháp flatten với readability và hiệu năng.
- Interview tip 6: nêu trade-off của giải pháp flatten với readability và hiệu năng.
- Interview tip 7: nêu trade-off của giải pháp flatten với readability và hiệu năng.
- Interview tip 8: nêu trade-off của giải pháp flatten với readability và hiệu năng.

## Challenge 8: memoize
### Overview / Tổng Quan
Bài toán memoize xuất hiện thường xuyên vì kiểm tra tư duy API design và edge cases. Cache kết quả hàm để tăng tốc tính toán lặp lại.
### Explanation / Giải thích
- Step 1: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 2: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 3: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 4: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 5: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 6: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 7: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 8: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 9: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
- Step 10: Trình bày giả định input/output, complexity, và behavior khi gặp case biên.
### Example / Ví dụ
```ts
export function memoize<T extends (...args: number[]) => number>(fn: T): T {
  const cache = new Map<string, number>();
  return ((...args: number[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}
```
### Discussion
- Interview tip 1: nêu trade-off của giải pháp memoize với readability và hiệu năng.
- Interview tip 2: nêu trade-off của giải pháp memoize với readability và hiệu năng.
- Interview tip 3: nêu trade-off của giải pháp memoize với readability và hiệu năng.
- Interview tip 4: nêu trade-off của giải pháp memoize với readability và hiệu năng.
- Interview tip 5: nêu trade-off của giải pháp memoize với readability và hiệu năng.
- Interview tip 6: nêu trade-off của giải pháp memoize với readability và hiệu năng.
- Interview tip 7: nêu trade-off của giải pháp memoize với readability và hiệu năng.
- Interview tip 8: nêu trade-off của giải pháp memoize với readability và hiệu năng.

## Câu Hỏi Phỏng Vấn / Interview Q&A
### 🟢 [Junior] Q1: How would you test debounce implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q2: How would you test throttle implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q3: How would you test deep clone implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q4: How would you test Promise.all implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q5: How would you test EventEmitter implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q6: How would you test curry implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q7: How would you test flatten implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q8: How would you test memoize implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q9: How would you test debounce implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q10: How would you test throttle implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q11: How would you test deep clone implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q12: How would you test Promise.all implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q13: How would you test EventEmitter implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q14: How would you test curry implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q15: How would you test flatten implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q16: How would you test memoize implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q17: How would you test debounce implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q18: How would you test throttle implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q19: How would you test deep clone implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q20: How would you test Promise.all implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q21: How would you test EventEmitter implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q22: How would you test curry implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q23: How would you test flatten implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q24: How would you test memoize implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q25: How would you test debounce implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q26: How would you test throttle implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q27: How would you test deep clone implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q28: How would you test Promise.all implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q29: How would you test EventEmitter implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q30: How would you test curry implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q31: How would you test flatten implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q32: How would you test memoize implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q33: How would you test debounce implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q34: How would you test throttle implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q35: How would you test deep clone implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q36: How would you test Promise.all implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q37: How would you test EventEmitter implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q38: How would you test curry implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q39: How would you test flatten implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q40: How would you test memoize implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q41: How would you test debounce implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q42: How would you test throttle implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q43: How would you test deep clone implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q44: How would you test Promise.all implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q45: How would you test EventEmitter implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q46: How would you test curry implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q47: How would you test flatten implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q48: How would you test memoize implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q49: How would you test debounce implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q50: How would you test throttle implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q51: How would you test deep clone implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q52: How would you test Promise.all implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q53: How would you test EventEmitter implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q54: How would you test curry implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q55: How would you test flatten implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q56: How would you test memoize implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q57: How would you test debounce implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q58: How would you test throttle implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q59: How would you test deep clone implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q60: How would you test Promise.all implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q61: How would you test EventEmitter implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q62: How would you test curry implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q63: How would you test flatten implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q64: How would you test memoize implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q65: How would you test debounce implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q66: How would you test throttle implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q67: How would you test deep clone implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q68: How would you test Promise.all implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q69: How would you test EventEmitter implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q70: How would you test curry implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q71: How would you test flatten implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q72: How would you test memoize implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q73: How would you test debounce implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q74: How would you test throttle implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q75: How would you test deep clone implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q76: How would you test Promise.all implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q77: How would you test EventEmitter implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q78: How would you test curry implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q79: How would you test flatten implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q80: How would you test memoize implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q81: How would you test debounce implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q82: How would you test throttle implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q83: How would you test deep clone implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q84: How would you test Promise.all implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q85: How would you test EventEmitter implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q86: How would you test curry implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q87: How would you test flatten implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q88: How would you test memoize implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q89: How would you test debounce implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q90: How would you test throttle implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q91: How would you test deep clone implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟡 [Mid] Q92: How would you test Promise.all implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🔴 [Senior] Q93: How would you test EventEmitter implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
### 🟢 [Junior] Q94: How would you test curry implementation?
- **Answer (EN):** Cover happy path, edge cases, timing behavior, and memory behavior.
- **Trả lời (VI):** Kiểm tra case chuẩn, case biên, hành vi bất đồng bộ, và khả năng cleanup.
- **Ví dụ:** Viết test với fake timers khi xử lý debounce/throttle.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
- Practice note: giải thích thành tiếng từng bước để interviewer thấy reasoning rõ ràng.
