# Concurrency Patterns in JavaScript and Frontend Runtime

**Tổng Quan / Overview:** Event-loop-aware concurrency, workers, shared memory, and scheduler patterns in frontend apps.
**Giải thích:** Concurrency theo event loop, workers, shared memory và mẫu scheduler trong ứng dụng frontend.

## Mục Tiêu Học Tập / Learning Goals
- Understand interview-grade theory in frontend systems.
- Nắm được cách giải thích bằng tiếng Anh ngắn gọn và tiếng Việt rõ ràng.
- Practice with JavaScript/TypeScript examples for implementation discussion.

## Liên Kết Liên Quan / Related Files
- [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)
- [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)
- [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)
- [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)
- [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q1. Event loop internals and task queues — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Event loop internals and task queues** in a concise system-level way before diving into details.
- VI: Trình bày **Event loop internals and task queues** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for event loop internals and task queues.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho event loop internals and task queues.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runEventLoopInternalsAndTaskQueues(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q2. Event loop internals and task queues — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Event loop internals and task queues** in a concise system-level way before diving into details.
- VI: Trình bày **Event loop internals and task queues** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for event loop internals and task queues.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho event loop internals and task queues.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runEventLoopInternalsAndTaskQueues(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

### Q3. Microtask vs macrotask ordering — Concept and core mental model
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Microtask vs macrotask ordering** in a concise system-level way before diving into details.
- VI: Trình bày **Microtask vs macrotask ordering** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for microtask vs macrotask ordering.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho microtask vs macrotask ordering.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runMicrotaskVsMacrotaskOrdering(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)

### Q4. Microtask vs macrotask ordering — Practical trade-offs and debugging in production
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Microtask vs macrotask ordering** in a concise system-level way before diving into details.
- VI: Trình bày **Microtask vs macrotask ordering** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for microtask vs macrotask ordering.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho microtask vs macrotask ordering.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runMicrotaskVsMacrotaskOrdering(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

### Q5. Starvation and fairness issues — Concept and core mental model
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Starvation and fairness issues** in a concise system-level way before diving into details.
- VI: Trình bày **Starvation and fairness issues** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for starvation and fairness issues.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho starvation and fairness issues.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runStarvationAndFairnessIssues(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

### Q6. Starvation and fairness issues — Practical trade-offs and debugging in production
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Starvation and fairness issues** in a concise system-level way before diving into details.
- VI: Trình bày **Starvation and fairness issues** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for starvation and fairness issues.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho starvation and fairness issues.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runStarvationAndFairnessIssues(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

### Q7. Promise pool and bounded concurrency — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Promise pool and bounded concurrency** in a concise system-level way before diving into details.
- VI: Trình bày **Promise pool and bounded concurrency** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for promise pool and bounded concurrency.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho promise pool and bounded concurrency.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runPromisePoolAndBoundedConcurrency(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q8. Promise pool and bounded concurrency — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Promise pool and bounded concurrency** in a concise system-level way before diving into details.
- VI: Trình bày **Promise pool and bounded concurrency** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for promise pool and bounded concurrency.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho promise pool and bounded concurrency.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runPromisePoolAndBoundedConcurrency(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

### Q9. Cancellation with AbortController — Concept and core mental model
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Cancellation with AbortController** in a concise system-level way before diving into details.
- VI: Trình bày **Cancellation with AbortController** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for cancellation with abortcontroller.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho cancellation with abortcontroller.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runCancellationWithAbortcontroller(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)

### Q10. Cancellation with AbortController — Practical trade-offs and debugging in production
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Cancellation with AbortController** in a concise system-level way before diving into details.
- VI: Trình bày **Cancellation with AbortController** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for cancellation with abortcontroller.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho cancellation with abortcontroller.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runCancellationWithAbortcontroller(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

### Q11. Retry with backoff and jitter — Concept and core mental model
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Retry with backoff and jitter** in a concise system-level way before diving into details.
- VI: Trình bày **Retry with backoff and jitter** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for retry with backoff and jitter.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho retry with backoff and jitter.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runRetryWithBackoffAndJitter(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

### Q12. Retry with backoff and jitter — Practical trade-offs and debugging in production
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Retry with backoff and jitter** in a concise system-level way before diving into details.
- VI: Trình bày **Retry with backoff and jitter** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for retry with backoff and jitter.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho retry with backoff and jitter.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runRetryWithBackoffAndJitter(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

### Q13. Web Worker communication patterns — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Web Worker communication patterns** in a concise system-level way before diving into details.
- VI: Trình bày **Web Worker communication patterns** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for web worker communication patterns.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho web worker communication patterns.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runWebWorkerCommunicationPatterns(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q14. Web Worker communication patterns — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Web Worker communication patterns** in a concise system-level way before diving into details.
- VI: Trình bày **Web Worker communication patterns** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for web worker communication patterns.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho web worker communication patterns.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runWebWorkerCommunicationPatterns(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

### Q15. SharedArrayBuffer memory model — Concept and core mental model
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **SharedArrayBuffer memory model** in a concise system-level way before diving into details.
- VI: Trình bày **SharedArrayBuffer memory model** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for sharedarraybuffer memory model.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho sharedarraybuffer memory model.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runSharedarraybufferMemoryModel(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)

### Q16. SharedArrayBuffer memory model — Practical trade-offs and debugging in production
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **SharedArrayBuffer memory model** in a concise system-level way before diving into details.
- VI: Trình bày **SharedArrayBuffer memory model** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for sharedarraybuffer memory model.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho sharedarraybuffer memory model.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runSharedarraybufferMemoryModel(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

### Q17. Atomics operations and correctness — Concept and core mental model
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Atomics operations and correctness** in a concise system-level way before diving into details.
- VI: Trình bày **Atomics operations and correctness** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for atomics operations and correctness.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho atomics operations and correctness.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runAtomicsOperationsAndCorrectness(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

### Q18. Atomics operations and correctness — Practical trade-offs and debugging in production
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Atomics operations and correctness** in a concise system-level way before diving into details.
- VI: Trình bày **Atomics operations and correctness** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for atomics operations and correctness.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho atomics operations and correctness.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runAtomicsOperationsAndCorrectness(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

### Q19. Lock-free queue in JS shared memory — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Lock-free queue in JS shared memory** in a concise system-level way before diving into details.
- VI: Trình bày **Lock-free queue in JS shared memory** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for lock-free queue in js shared memory.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho lock-free queue in js shared memory.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runLockFreeQueueInJsSharedMemory(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q20. Lock-free queue in JS shared memory — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Lock-free queue in JS shared memory** in a concise system-level way before diving into details.
- VI: Trình bày **Lock-free queue in JS shared memory** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for lock-free queue in js shared memory.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho lock-free queue in js shared memory.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runLockFreeQueueInJsSharedMemory(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

### Q21. Scheduler design for UI responsiveness — Concept and core mental model
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Scheduler design for UI responsiveness** in a concise system-level way before diving into details.
- VI: Trình bày **Scheduler design for UI responsiveness** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for scheduler design for ui responsiveness.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho scheduler design for ui responsiveness.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runSchedulerDesignForUiResponsivene(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)

### Q22. Scheduler design for UI responsiveness — Practical trade-offs and debugging in production
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Scheduler design for UI responsiveness** in a concise system-level way before diving into details.
- VI: Trình bày **Scheduler design for UI responsiveness** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for scheduler design for ui responsiveness.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho scheduler design for ui responsiveness.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runSchedulerDesignForUiResponsivene(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

### Q23. Work stealing and priority scheduling — Concept and core mental model
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Work stealing and priority scheduling** in a concise system-level way before diving into details.
- VI: Trình bày **Work stealing and priority scheduling** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for work stealing and priority scheduling.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho work stealing and priority scheduling.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runWorkStealingAndPrioritySchedulin(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

### Q24. Work stealing and priority scheduling — Practical trade-offs and debugging in production
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Work stealing and priority scheduling** in a concise system-level way before diving into details.
- VI: Trình bày **Work stealing and priority scheduling** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for work stealing and priority scheduling.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho work stealing and priority scheduling.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runWorkStealingAndPrioritySchedulin(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

### Q25. Producer-consumer pipelines — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Producer-consumer pipelines** in a concise system-level way before diving into details.
- VI: Trình bày **Producer-consumer pipelines** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for producer-consumer pipelines.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho producer-consumer pipelines.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runProducerConsumerPipelines(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q26. Producer-consumer pipelines — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Producer-consumer pipelines** in a concise system-level way before diving into details.
- VI: Trình bày **Producer-consumer pipelines** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for producer-consumer pipelines.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho producer-consumer pipelines.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runProducerConsumerPipelines(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

### Q27. Actor-like message isolation — Concept and core mental model
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Actor-like message isolation** in a concise system-level way before diving into details.
- VI: Trình bày **Actor-like message isolation** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for actor-like message isolation.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho actor-like message isolation.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runActorLikeMessageIsolation(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)

### Q28. Actor-like message isolation — Practical trade-offs and debugging in production
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Actor-like message isolation** in a concise system-level way before diving into details.
- VI: Trình bày **Actor-like message isolation** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for actor-like message isolation.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho actor-like message isolation.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runActorLikeMessageIsolation(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

### Q29. Reactive stream backpressure — Concept and core mental model
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Reactive stream backpressure** in a concise system-level way before diving into details.
- VI: Trình bày **Reactive stream backpressure** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for reactive stream backpressure.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho reactive stream backpressure.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runReactiveStreamBackpressure(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

### Q30. Reactive stream backpressure — Practical trade-offs and debugging in production
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Reactive stream backpressure** in a concise system-level way before diving into details.
- VI: Trình bày **Reactive stream backpressure** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for reactive stream backpressure.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho reactive stream backpressure.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runReactiveStreamBackpressure(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

### Q31. React concurrent rendering interplay — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **React concurrent rendering interplay** in a concise system-level way before diving into details.
- VI: Trình bày **React concurrent rendering interplay** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for react concurrent rendering interplay.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho react concurrent rendering interplay.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runReactConcurrentRenderingInterplay(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q32. React concurrent rendering interplay — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **React concurrent rendering interplay** in a concise system-level way before diving into details.
- VI: Trình bày **React concurrent rendering interplay** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for react concurrent rendering interplay.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho react concurrent rendering interplay.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runReactConcurrentRenderingInterplay(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

### Q33. Cooperative yielding strategies — Concept and core mental model
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Cooperative yielding strategies** in a concise system-level way before diving into details.
- VI: Trình bày **Cooperative yielding strategies** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for cooperative yielding strategies.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho cooperative yielding strategies.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runCooperativeYieldingStrategies(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)

### Q34. Cooperative yielding strategies — Practical trade-offs and debugging in production
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Cooperative yielding strategies** in a concise system-level way before diving into details.
- VI: Trình bày **Cooperative yielding strategies** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for cooperative yielding strategies.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho cooperative yielding strategies.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runCooperativeYieldingStrategies(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

### Q35. Race condition debugging in FE — Concept and core mental model
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Race condition debugging in FE** in a concise system-level way before diving into details.
- VI: Trình bày **Race condition debugging in FE** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for race condition debugging in fe.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho race condition debugging in fe.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runRaceConditionDebuggingInFe(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

### Q36. Race condition debugging in FE — Practical trade-offs and debugging in production
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Race condition debugging in FE** in a concise system-level way before diving into details.
- VI: Trình bày **Race condition debugging in FE** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for race condition debugging in fe.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho race condition debugging in fe.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runRaceConditionDebuggingInFe(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

### Q37. Performance metrics for concurrent UI — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Performance metrics for concurrent UI** in a concise system-level way before diving into details.
- VI: Trình bày **Performance metrics for concurrent UI** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for performance metrics for concurrent ui.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho performance metrics for concurrent ui.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runPerformanceMetricsForConcurrentU(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q38. Performance metrics for concurrent UI — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Performance metrics for concurrent UI** in a concise system-level way before diving into details.
- VI: Trình bày **Performance metrics for concurrent UI** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for performance metrics for concurrent ui.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho performance metrics for concurrent ui.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
export async function runPerformanceMetricsForConcurrentU(tasks: Array<() => Promise<void>>, limit = 2) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await queue.shift()?.();
  });
  await Promise.all(workers);
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

## Tổng Kết / Summary
- EN: Use this file as a speaking map for advanced interviews: concept → trade-off → metrics → code path.
- VI: Dùng tài liệu này như bản đồ trả lời phỏng vấn nâng cao: khái niệm → đánh đổi → chỉ số → luồng code.
- EN: Pair with neighboring advanced theory files for cross-topic system design discussion.
- VI: Kết hợp với các file advanced khác để luyện phần liên kết nhiều chủ đề trong system design frontend.

