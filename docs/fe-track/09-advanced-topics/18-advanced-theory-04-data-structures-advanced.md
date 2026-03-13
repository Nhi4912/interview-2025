# Advanced Data Structures for Frontend Systems


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

**Tổng Quan / Overview:** Persistent and specialized data structures used by editors, frameworks, and large-scale UIs.
**Giải thích:** Cấu trúc dữ liệu persistent/chuyên dụng dùng trong editor, framework và UI quy mô lớn.

## Mục Tiêu Học Tập / Learning Goals
- Understand interview-grade theory in frontend systems.
- Nắm được cách giải thích bằng tiếng Anh ngắn gọn và tiếng Việt rõ ràng.
- Practice with JavaScript/TypeScript examples for implementation discussion.

## Liên Kết Liên Quan / Related Files
- [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)
- [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)
- [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)
- [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)
- [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q1. Immutability and structural sharing — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Immutability and structural sharing** in a concise system-level way before diving into details.
- VI: Trình bày **Immutability and structural sharing** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for immutability and structural sharing.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho immutability and structural sharing.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class ImmutabilityAndStructuralSharingStore1<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q2. Immutability and structural sharing — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Immutability and structural sharing** in a concise system-level way before diving into details.
- VI: Trình bày **Immutability and structural sharing** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for immutability and structural sharing.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho immutability and structural sharing.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class ImmutabilityAndStructuralSharingStore2<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

### Q3. Persistent vector fundamentals — Concept and core mental model
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Persistent vector fundamentals** in a concise system-level way before diving into details.
- VI: Trình bày **Persistent vector fundamentals** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for persistent vector fundamentals.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho persistent vector fundamentals.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class PersistentVectorFundamentalsStore3<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)

### Q4. Persistent vector fundamentals — Practical trade-offs and debugging in production
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Persistent vector fundamentals** in a concise system-level way before diving into details.
- VI: Trình bày **Persistent vector fundamentals** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for persistent vector fundamentals.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho persistent vector fundamentals.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class PersistentVectorFundamentalsStore4<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

### Q5. Persistent map internals — Concept and core mental model
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Persistent map internals** in a concise system-level way before diving into details.
- VI: Trình bày **Persistent map internals** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for persistent map internals.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho persistent map internals.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class PersistentMapInternalsStore5<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

### Q6. Persistent map internals — Practical trade-offs and debugging in production
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Persistent map internals** in a concise system-level way before diving into details.
- VI: Trình bày **Persistent map internals** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for persistent map internals.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho persistent map internals.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class PersistentMapInternalsStore6<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

### Q7. HAMT node layout and hashing — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **HAMT node layout and hashing** in a concise system-level way before diving into details.
- VI: Trình bày **HAMT node layout and hashing** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for hamt node layout and hashing.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho hamt node layout and hashing.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class HamtNodeLayoutAndHashingStore7<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q8. HAMT node layout and hashing — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **HAMT node layout and hashing** in a concise system-level way before diving into details.
- VI: Trình bày **HAMT node layout and hashing** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for hamt node layout and hashing.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho hamt node layout and hashing.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class HamtNodeLayoutAndHashingStore8<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

### Q9. Rope for text editor workloads — Concept and core mental model
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Rope for text editor workloads** in a concise system-level way before diving into details.
- VI: Trình bày **Rope for text editor workloads** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for rope for text editor workloads.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho rope for text editor workloads.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class RopeForTextEditorWorkloadsStore9<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)

### Q10. Rope for text editor workloads — Practical trade-offs and debugging in production
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Rope for text editor workloads** in a concise system-level way before diving into details.
- VI: Trình bày **Rope for text editor workloads** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for rope for text editor workloads.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho rope for text editor workloads.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class RopeForTextEditorWorkloadsStore10<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

### Q11. Gap buffer vs rope trade-offs — Concept and core mental model
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Gap buffer vs rope trade-offs** in a concise system-level way before diving into details.
- VI: Trình bày **Gap buffer vs rope trade-offs** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for gap buffer vs rope trade-offs.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho gap buffer vs rope trade-offs.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class GapBufferVsRopeTradeOffsStore11<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

### Q12. Gap buffer vs rope trade-offs — Practical trade-offs and debugging in production
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Gap buffer vs rope trade-offs** in a concise system-level way before diving into details.
- VI: Trình bày **Gap buffer vs rope trade-offs** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for gap buffer vs rope trade-offs.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho gap buffer vs rope trade-offs.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class GapBufferVsRopeTradeOffsStore12<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

### Q13. Skip list for ordered index — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Skip list for ordered index** in a concise system-level way before diving into details.
- VI: Trình bày **Skip list for ordered index** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for skip list for ordered index.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho skip list for ordered index.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class SkipListForOrderedIndexStore13<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q14. Skip list for ordered index — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Skip list for ordered index** in a concise system-level way before diving into details.
- VI: Trình bày **Skip list for ordered index** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for skip list for ordered index.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho skip list for ordered index.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class SkipListForOrderedIndexStore14<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

### Q15. Bloom filter for membership checks — Concept and core mental model
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Bloom filter for membership checks** in a concise system-level way before diving into details.
- VI: Trình bày **Bloom filter for membership checks** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for bloom filter for membership checks.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho bloom filter for membership checks.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class BloomFilterForMembershipChecksStore15<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)

### Q16. Bloom filter for membership checks — Practical trade-offs and debugging in production
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Bloom filter for membership checks** in a concise system-level way before diving into details.
- VI: Trình bày **Bloom filter for membership checks** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for bloom filter for membership checks.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho bloom filter for membership checks.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class BloomFilterForMembershipChecksStore16<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

### Q17. Disjoint set union for grouping — Concept and core mental model
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Disjoint set union for grouping** in a concise system-level way before diving into details.
- VI: Trình bày **Disjoint set union for grouping** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for disjoint set union for grouping.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho disjoint set union for grouping.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class DisjointSetUnionForGroupingStore17<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

### Q18. Disjoint set union for grouping — Practical trade-offs and debugging in production
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Disjoint set union for grouping** in a concise system-level way before diving into details.
- VI: Trình bày **Disjoint set union for grouping** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for disjoint set union for grouping.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho disjoint set union for grouping.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class DisjointSetUnionForGroupingStore18<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

### Q19. Segment tree for range query UI — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Segment tree for range query UI** in a concise system-level way before diving into details.
- VI: Trình bày **Segment tree for range query UI** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for segment tree for range query ui.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho segment tree for range query ui.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class SegmentTreeForRangeQueryUiStore19<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q20. Segment tree for range query UI — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Segment tree for range query UI** in a concise system-level way before diving into details.
- VI: Trình bày **Segment tree for range query UI** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for segment tree for range query ui.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho segment tree for range query ui.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class SegmentTreeForRangeQueryUiStore20<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

### Q21. Fenwick tree for prefix aggregates — Concept and core mental model
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Fenwick tree for prefix aggregates** in a concise system-level way before diving into details.
- VI: Trình bày **Fenwick tree for prefix aggregates** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for fenwick tree for prefix aggregates.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho fenwick tree for prefix aggregates.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class FenwickTreeForPrefixAggregatesStore21<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)

### Q22. Fenwick tree for prefix aggregates — Practical trade-offs and debugging in production
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Fenwick tree for prefix aggregates** in a concise system-level way before diving into details.
- VI: Trình bày **Fenwick tree for prefix aggregates** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for fenwick tree for prefix aggregates.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho fenwick tree for prefix aggregates.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class FenwickTreeForPrefixAggregatesStore22<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

### Q23. Deque and ring buffer for schedulers — Concept and core mental model
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Deque and ring buffer for schedulers** in a concise system-level way before diving into details.
- VI: Trình bày **Deque and ring buffer for schedulers** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for deque and ring buffer for schedulers.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho deque and ring buffer for schedulers.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class DequeAndRingBufferForSchedulersStore23<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

### Q24. Deque and ring buffer for schedulers — Practical trade-offs and debugging in production
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Deque and ring buffer for schedulers** in a concise system-level way before diving into details.
- VI: Trình bày **Deque and ring buffer for schedulers** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for deque and ring buffer for schedulers.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho deque and ring buffer for schedulers.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class DequeAndRingBufferForSchedulersStore24<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

### Q25. Priority queue for task orchestration — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Priority queue for task orchestration** in a concise system-level way before diving into details.
- VI: Trình bày **Priority queue for task orchestration** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for priority queue for task orchestration.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho priority queue for task orchestration.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class PriorityQueueForTaskOrchestratioStore25<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q26. Priority queue for task orchestration — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Priority queue for task orchestration** in a concise system-level way before diving into details.
- VI: Trình bày **Priority queue for task orchestration** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for priority queue for task orchestration.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho priority queue for task orchestration.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class PriorityQueueForTaskOrchestratioStore26<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

### Q27. LRU/LFU cache data structures — Concept and core mental model
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **LRU/LFU cache data structures** in a concise system-level way before diving into details.
- VI: Trình bày **LRU/LFU cache data structures** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for lru/lfu cache data structures.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho lru/lfu cache data structures.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class LruLfuCacheDataStructuresStore27<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)

### Q28. LRU/LFU cache data structures — Practical trade-offs and debugging in production
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **LRU/LFU cache data structures** in a concise system-level way before diving into details.
- VI: Trình bày **LRU/LFU cache data structures** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for lru/lfu cache data structures.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho lru/lfu cache data structures.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class LruLfuCacheDataStructuresStore28<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

### Q29. CRDT-friendly structures in collaborative UI — Concept and core mental model
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **CRDT-friendly structures in collaborative UI** in a concise system-level way before diving into details.
- VI: Trình bày **CRDT-friendly structures in collaborative UI** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for crdt-friendly structures in collaborative ui.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho crdt-friendly structures in collaborative ui.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class CrdtFriendlyStructuresInCollaborStore29<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

### Q30. CRDT-friendly structures in collaborative UI — Practical trade-offs and debugging in production
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **CRDT-friendly structures in collaborative UI** in a concise system-level way before diving into details.
- VI: Trình bày **CRDT-friendly structures in collaborative UI** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for crdt-friendly structures in collaborative ui.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho crdt-friendly structures in collaborative ui.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class CrdtFriendlyStructuresInCollaborStore30<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

### Q31. Snapshotting and versioned state — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Snapshotting and versioned state** in a concise system-level way before diving into details.
- VI: Trình bày **Snapshotting and versioned state** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for snapshotting and versioned state.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho snapshotting and versioned state.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class SnapshottingAndVersionedStateStore31<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q32. Snapshotting and versioned state — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Snapshotting and versioned state** in a concise system-level way before diving into details.
- VI: Trình bày **Snapshotting and versioned state** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for snapshotting and versioned state.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho snapshotting and versioned state.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class SnapshottingAndVersionedStateStore32<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

### Q33. Memory locality in JS data structures — Concept and core mental model
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Memory locality in JS data structures** in a concise system-level way before diving into details.
- VI: Trình bày **Memory locality in JS data structures** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for memory locality in js data structures.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho memory locality in js data structures.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class MemoryLocalityInJsDataStructureStore33<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)

### Q34. Memory locality in JS data structures — Practical trade-offs and debugging in production
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Memory locality in JS data structures** in a concise system-level way before diving into details.
- VI: Trình bày **Memory locality in JS data structures** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for memory locality in js data structures.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho memory locality in js data structures.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class MemoryLocalityInJsDataStructureStore34<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

### Q35. Serialization costs and transferability — Concept and core mental model
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Serialization costs and transferability** in a concise system-level way before diving into details.
- VI: Trình bày **Serialization costs and transferability** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for serialization costs and transferability.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho serialization costs and transferability.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class SerializationCostsAndTransferabilStore35<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

### Q36. Serialization costs and transferability — Practical trade-offs and debugging in production
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Serialization costs and transferability** in a concise system-level way before diving into details.
- VI: Trình bày **Serialization costs and transferability** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for serialization costs and transferability.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho serialization costs and transferability.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class SerializationCostsAndTransferabilStore36<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

### Q37. Data-structure choice in FE frameworks — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Data-structure choice in FE frameworks** in a concise system-level way before diving into details.
- VI: Trình bày **Data-structure choice in FE frameworks** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for data-structure choice in fe frameworks.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho data-structure choice in fe frameworks.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class DataStructureChoiceInFeFrameworStore37<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q38. Data-structure choice in FE frameworks — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Data-structure choice in FE frameworks** in a concise system-level way before diving into details.
- VI: Trình bày **Data-structure choice in FE frameworks** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for data-structure choice in fe frameworks.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho data-structure choice in fe frameworks.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
class DataStructureChoiceInFeFrameworStore38<T> {
  private versions: readonly T[] = [];
  push(value: T) { this.versions = [...this.versions, value]; }
  snapshot() { return this.versions; }
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

