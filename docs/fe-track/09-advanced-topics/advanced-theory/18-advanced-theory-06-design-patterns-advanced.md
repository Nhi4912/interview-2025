# Advanced Design Patterns for Frontend Architecture

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

**Tổng Quan / Overview:** Behavioral and architectural patterns applied to component systems, micro-frontends, and plugin platforms.
**Giải thích:** Behavioral pattern và pattern kiến trúc áp dụng cho component system, micro-frontend, và nền tảng plugin.

## Mục Tiêu Học Tập / Learning Goals
- Understand interview-grade theory in frontend systems.
- Nắm được cách giải thích bằng tiếng Anh ngắn gọn và tiếng Việt rõ ràng.
- Practice with JavaScript/TypeScript examples for implementation discussion.

## Liên Kết Liên Quan / Related Files
- [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)
- [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)
- [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)
- [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)
- [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q1. Observer pattern in state propagation — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Observer pattern in state propagation** in a concise system-level way before diving into details.
- VI: Trình bày **Observer pattern in state propagation** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for observer pattern in state propagation.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho observer pattern in state propagation.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context1 { state: string }

export function applyObserverPatternInStatePropagatio(ctx: Context1) {
  return { ...ctx, state: `${ctx.state}->observer_pattern_in_state_propagatio` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q2. Observer pattern in state propagation — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Observer pattern in state propagation** in a concise system-level way before diving into details.
- VI: Trình bày **Observer pattern in state propagation** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for observer pattern in state propagation.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho observer pattern in state propagation.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context2 { state: string }

export function applyObserverPatternInStatePropagatio(ctx: Context2) {
  return { ...ctx, state: `${ctx.state}->observer_pattern_in_state_propagatio` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

### Q3. Mediator in complex UI workflows — Concept and core mental model
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Mediator in complex UI workflows** in a concise system-level way before diving into details.
- VI: Trình bày **Mediator in complex UI workflows** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for mediator in complex ui workflows.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho mediator in complex ui workflows.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context3 { state: string }

export function applyMediatorInComplexUiWorkflows(ctx: Context3) {
  return { ...ctx, state: `${ctx.state}->mediator_in_complex_ui_workflows` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)

### Q4. Mediator in complex UI workflows — Practical trade-offs and debugging in production
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Mediator in complex UI workflows** in a concise system-level way before diving into details.
- VI: Trình bày **Mediator in complex UI workflows** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for mediator in complex ui workflows.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho mediator in complex ui workflows.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context4 { state: string }

export function applyMediatorInComplexUiWorkflows(ctx: Context4) {
  return { ...ctx, state: `${ctx.state}->mediator_in_complex_ui_workflows` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

### Q5. Strategy pattern for runtime behavior — Concept and core mental model
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Strategy pattern for runtime behavior** in a concise system-level way before diving into details.
- VI: Trình bày **Strategy pattern for runtime behavior** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for strategy pattern for runtime behavior.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho strategy pattern for runtime behavior.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context5 { state: string }

export function applyStrategyPatternForRuntimeBehavio(ctx: Context5) {
  return { ...ctx, state: `${ctx.state}->strategy_pattern_for_runtime_behavio` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

### Q6. Strategy pattern for runtime behavior — Practical trade-offs and debugging in production
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Strategy pattern for runtime behavior** in a concise system-level way before diving into details.
- VI: Trình bày **Strategy pattern for runtime behavior** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for strategy pattern for runtime behavior.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho strategy pattern for runtime behavior.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context6 { state: string }

export function applyStrategyPatternForRuntimeBehavio(ctx: Context6) {
  return { ...ctx, state: `${ctx.state}->strategy_pattern_for_runtime_behavio` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

### Q7. State machine modeling in forms — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **State machine modeling in forms** in a concise system-level way before diving into details.
- VI: Trình bày **State machine modeling in forms** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for state machine modeling in forms.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho state machine modeling in forms.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context7 { state: string }

export function applyStateMachineModelingInForms(ctx: Context7) {
  return { ...ctx, state: `${ctx.state}->state_machine_modeling_in_forms` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q8. State machine modeling in forms — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **State machine modeling in forms** in a concise system-level way before diving into details.
- VI: Trình bày **State machine modeling in forms** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for state machine modeling in forms.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho state machine modeling in forms.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context8 { state: string }

export function applyStateMachineModelingInForms(ctx: Context8) {
  return { ...ctx, state: `${ctx.state}->state_machine_modeling_in_forms` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

### Q9. Command pattern for undo/redo — Concept and core mental model
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Command pattern for undo/redo** in a concise system-level way before diving into details.
- VI: Trình bày **Command pattern for undo/redo** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for command pattern for undo/redo.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho command pattern for undo/redo.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context9 { state: string }

export function applyCommandPatternForUndoRedo(ctx: Context9) {
  return { ...ctx, state: `${ctx.state}->command_pattern_for_undo_redo` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)

### Q10. Command pattern for undo/redo — Practical trade-offs and debugging in production
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Command pattern for undo/redo** in a concise system-level way before diving into details.
- VI: Trình bày **Command pattern for undo/redo** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for command pattern for undo/redo.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho command pattern for undo/redo.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context10 { state: string }

export function applyCommandPatternForUndoRedo(ctx: Context10) {
  return { ...ctx, state: `${ctx.state}->command_pattern_for_undo_redo` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

### Q11. Interpreter pattern for rules engine — Concept and core mental model
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Interpreter pattern for rules engine** in a concise system-level way before diving into details.
- VI: Trình bày **Interpreter pattern for rules engine** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for interpreter pattern for rules engine.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho interpreter pattern for rules engine.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context11 { state: string }

export function applyInterpreterPatternForRulesEngine(ctx: Context11) {
  return { ...ctx, state: `${ctx.state}->interpreter_pattern_for_rules_engine` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

### Q12. Interpreter pattern for rules engine — Practical trade-offs and debugging in production
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Interpreter pattern for rules engine** in a concise system-level way before diving into details.
- VI: Trình bày **Interpreter pattern for rules engine** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for interpreter pattern for rules engine.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho interpreter pattern for rules engine.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context12 { state: string }

export function applyInterpreterPatternForRulesEngine(ctx: Context12) {
  return { ...ctx, state: `${ctx.state}->interpreter_pattern_for_rules_engine` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

### Q13. Visitor pattern for AST/UI trees — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Visitor pattern for AST/UI trees** in a concise system-level way before diving into details.
- VI: Trình bày **Visitor pattern for AST/UI trees** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for visitor pattern for ast/ui trees.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho visitor pattern for ast/ui trees.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context13 { state: string }

export function applyVisitorPatternForAstUiTrees(ctx: Context13) {
  return { ...ctx, state: `${ctx.state}->visitor_pattern_for_ast_ui_trees` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q14. Visitor pattern for AST/UI trees — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Visitor pattern for AST/UI trees** in a concise system-level way before diving into details.
- VI: Trình bày **Visitor pattern for AST/UI trees** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for visitor pattern for ast/ui trees.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho visitor pattern for ast/ui trees.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context14 { state: string }

export function applyVisitorPatternForAstUiTrees(ctx: Context14) {
  return { ...ctx, state: `${ctx.state}->visitor_pattern_for_ast_ui_trees` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

### Q15. Adapter for third-party integration — Concept and core mental model
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Adapter for third-party integration** in a concise system-level way before diving into details.
- VI: Trình bày **Adapter for third-party integration** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for adapter for third-party integration.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho adapter for third-party integration.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context15 { state: string }

export function applyAdapterForThirdPartyIntegration(ctx: Context15) {
  return { ...ctx, state: `${ctx.state}->adapter_for_third_party_integration` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)

### Q16. Adapter for third-party integration — Practical trade-offs and debugging in production
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Adapter for third-party integration** in a concise system-level way before diving into details.
- VI: Trình bày **Adapter for third-party integration** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for adapter for third-party integration.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho adapter for third-party integration.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context16 { state: string }

export function applyAdapterForThirdPartyIntegration(ctx: Context16) {
  return { ...ctx, state: `${ctx.state}->adapter_for_third_party_integration` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

### Q17. Facade for domain boundary APIs — Concept and core mental model
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Facade for domain boundary APIs** in a concise system-level way before diving into details.
- VI: Trình bày **Facade for domain boundary APIs** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for facade for domain boundary apis.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho facade for domain boundary apis.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context17 { state: string }

export function applyFacadeForDomainBoundaryApis(ctx: Context17) {
  return { ...ctx, state: `${ctx.state}->facade_for_domain_boundary_apis` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

### Q18. Facade for domain boundary APIs — Practical trade-offs and debugging in production
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Facade for domain boundary APIs** in a concise system-level way before diving into details.
- VI: Trình bày **Facade for domain boundary APIs** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for facade for domain boundary apis.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho facade for domain boundary apis.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context18 { state: string }

export function applyFacadeForDomainBoundaryApis(ctx: Context18) {
  return { ...ctx, state: `${ctx.state}->facade_for_domain_boundary_apis` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

### Q19. Decorator for cross-cutting concerns — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Decorator for cross-cutting concerns** in a concise system-level way before diving into details.
- VI: Trình bày **Decorator for cross-cutting concerns** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for decorator for cross-cutting concerns.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho decorator for cross-cutting concerns.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context19 { state: string }

export function applyDecoratorForCrossCuttingConcerns(ctx: Context19) {
  return { ...ctx, state: `${ctx.state}->decorator_for_cross_cutting_concerns` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q20. Decorator for cross-cutting concerns — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Decorator for cross-cutting concerns** in a concise system-level way before diving into details.
- VI: Trình bày **Decorator for cross-cutting concerns** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for decorator for cross-cutting concerns.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho decorator for cross-cutting concerns.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context20 { state: string }

export function applyDecoratorForCrossCuttingConcerns(ctx: Context20) {
  return { ...ctx, state: `${ctx.state}->decorator_for_cross_cutting_concerns` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

### Q21. Dependency injection in frontend modules — Concept and core mental model
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Dependency injection in frontend modules** in a concise system-level way before diving into details.
- VI: Trình bày **Dependency injection in frontend modules** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for dependency injection in frontend modules.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho dependency injection in frontend modules.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context21 { state: string }

export function applyDependencyInjectionInFrontendMod(ctx: Context21) {
  return { ...ctx, state: `${ctx.state}->dependency_injection_in_frontend_mod` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)

### Q22. Dependency injection in frontend modules — Practical trade-offs and debugging in production
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Dependency injection in frontend modules** in a concise system-level way before diving into details.
- VI: Trình bày **Dependency injection in frontend modules** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for dependency injection in frontend modules.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho dependency injection in frontend modules.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context22 { state: string }

export function applyDependencyInjectionInFrontendMod(ctx: Context22) {
  return { ...ctx, state: `${ctx.state}->dependency_injection_in_frontend_mod` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

### Q23. Module federation in micro-frontends — Concept and core mental model
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Module federation in micro-frontends** in a concise system-level way before diving into details.
- VI: Trình bày **Module federation in micro-frontends** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for module federation in micro-frontends.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho module federation in micro-frontends.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context23 { state: string }

export function applyModuleFederationInMicroFrontends(ctx: Context23) {
  return { ...ctx, state: `${ctx.state}->module_federation_in_micro_frontends` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

### Q24. Module federation in micro-frontends — Practical trade-offs and debugging in production
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Module federation in micro-frontends** in a concise system-level way before diving into details.
- VI: Trình bày **Module federation in micro-frontends** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for module federation in micro-frontends.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho module federation in micro-frontends.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context24 { state: string }

export function applyModuleFederationInMicroFrontends(ctx: Context24) {
  return { ...ctx, state: `${ctx.state}->module_federation_in_micro_frontends` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

### Q25. Backend-for-frontend composition pattern — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Backend-for-frontend composition pattern** in a concise system-level way before diving into details.
- VI: Trình bày **Backend-for-frontend composition pattern** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for backend-for-frontend composition pattern.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho backend-for-frontend composition pattern.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context25 { state: string }

export function applyBackendForFrontendCompositionPat(ctx: Context25) {
  return { ...ctx, state: `${ctx.state}->backend_for_frontend_composition_pat` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q26. Backend-for-frontend composition pattern — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Backend-for-frontend composition pattern** in a concise system-level way before diving into details.
- VI: Trình bày **Backend-for-frontend composition pattern** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for backend-for-frontend composition pattern.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho backend-for-frontend composition pattern.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context26 { state: string }

export function applyBackendForFrontendCompositionPat(ctx: Context26) {
  return { ...ctx, state: `${ctx.state}->backend_for_frontend_composition_pat` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

### Q27. Plugin lifecycle and extension points — Concept and core mental model
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Plugin lifecycle and extension points** in a concise system-level way before diving into details.
- VI: Trình bày **Plugin lifecycle and extension points** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for plugin lifecycle and extension points.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho plugin lifecycle and extension points.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context27 { state: string }

export function applyPluginLifecycleAndExtensionPoint(ctx: Context27) {
  return { ...ctx, state: `${ctx.state}->plugin_lifecycle_and_extension_point` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)

### Q28. Plugin lifecycle and extension points — Practical trade-offs and debugging in production
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Plugin lifecycle and extension points** in a concise system-level way before diving into details.
- VI: Trình bày **Plugin lifecycle and extension points** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for plugin lifecycle and extension points.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho plugin lifecycle and extension points.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context28 { state: string }

export function applyPluginLifecycleAndExtensionPoint(ctx: Context28) {
  return { ...ctx, state: `${ctx.state}->plugin_lifecycle_and_extension_point` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

### Q29. Event-driven plugin contracts — Concept and core mental model
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Event-driven plugin contracts** in a concise system-level way before diving into details.
- VI: Trình bày **Event-driven plugin contracts** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for event-driven plugin contracts.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho event-driven plugin contracts.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context29 { state: string }

export function applyEventDrivenPluginContracts(ctx: Context29) {
  return { ...ctx, state: `${ctx.state}->event_driven_plugin_contracts` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

### Q30. Event-driven plugin contracts — Practical trade-offs and debugging in production
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Event-driven plugin contracts** in a concise system-level way before diving into details.
- VI: Trình bày **Event-driven plugin contracts** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for event-driven plugin contracts.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho event-driven plugin contracts.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context30 { state: string }

export function applyEventDrivenPluginContracts(ctx: Context30) {
  return { ...ctx, state: `${ctx.state}->event_driven_plugin_contracts` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

### Q31. CQRS-inspired UI command/query split — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **CQRS-inspired UI command/query split** in a concise system-level way before diving into details.
- VI: Trình bày **CQRS-inspired UI command/query split** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for cqrs-inspired ui command/query split.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho cqrs-inspired ui command/query split.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context31 { state: string }

export function applyCqrsInspiredUiCommandQuerySplit(ctx: Context31) {
  return { ...ctx, state: `${ctx.state}->cqrs_inspired_ui_command_query_split` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q32. CQRS-inspired UI command/query split — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **CQRS-inspired UI command/query split** in a concise system-level way before diving into details.
- VI: Trình bày **CQRS-inspired UI command/query split** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for cqrs-inspired ui command/query split.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho cqrs-inspired ui command/query split.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context32 { state: string }

export function applyCqrsInspiredUiCommandQuerySplit(ctx: Context32) {
  return { ...ctx, state: `${ctx.state}->cqrs_inspired_ui_command_query_split` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-03-advanced-algorithms-frontend.md](./18-advanced-theory-03-advanced-algorithms-frontend.md)

### Q33. Hexagonal architecture at frontend edge — Concept and core mental model
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Hexagonal architecture at frontend edge** in a concise system-level way before diving into details.
- VI: Trình bày **Hexagonal architecture at frontend edge** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for hexagonal architecture at frontend edge.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho hexagonal architecture at frontend edge.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context33 { state: string }

export function applyHexagonalArchitectureAtFrontendE(ctx: Context33) {
  return { ...ctx, state: `${ctx.state}->hexagonal_architecture_at_frontend_e` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-04-data-structures-advanced.md](./18-advanced-theory-04-data-structures-advanced.md)

### Q34. Hexagonal architecture at frontend edge — Practical trade-offs and debugging in production
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Hexagonal architecture at frontend edge** in a concise system-level way before diving into details.
- VI: Trình bày **Hexagonal architecture at frontend edge** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for hexagonal architecture at frontend edge.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho hexagonal architecture at frontend edge.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context34 { state: string }

export function applyHexagonalArchitectureAtFrontendE(ctx: Context34) {
  return { ...ctx, state: `${ctx.state}->hexagonal_architecture_at_frontend_e` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-05-concurrency-patterns.md](./18-advanced-theory-05-concurrency-patterns.md)

### Q35. Anti-patterns and over-engineering signals — Concept and core mental model
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Anti-patterns and over-engineering signals** in a concise system-level way before diving into details.
- VI: Trình bày **Anti-patterns and over-engineering signals** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for anti-patterns and over-engineering signals.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho anti-patterns and over-engineering signals.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context35 { state: string }

export function applyAntiPatternsAndOverEngineeringS(ctx: Context35) {
  return { ...ctx, state: `${ctx.state}->anti_patterns_and_over_engineering_s` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-06-design-patterns-advanced.md](./18-advanced-theory-06-design-patterns-advanced.md)

### Q36. Anti-patterns and over-engineering signals — Practical trade-offs and debugging in production
**Difficulty:** 🟢 [Junior]

**Tổng Quan (Overview):**
- EN: Explain **Anti-patterns and over-engineering signals** in a concise system-level way before diving into details.
- VI: Trình bày **Anti-patterns and over-engineering signals** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for anti-patterns and over-engineering signals.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho anti-patterns and over-engineering signals.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context36 { state: string }

export function applyAntiPatternsAndOverEngineeringS(ctx: Context36) {
  return { ...ctx, state: `${ctx.state}->anti_patterns_and_over_engineering_s` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-01-compiler-design-frontend.md](./18-advanced-theory-01-compiler-design-frontend.md)

### Q37. Pattern selection matrix for interviews — Concept and core mental model
**Difficulty:** 🟡 [Mid]

**Tổng Quan (Overview):**
- EN: Explain **Pattern selection matrix for interviews** in a concise system-level way before diving into details.
- VI: Trình bày **Pattern selection matrix for interviews** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for pattern selection matrix for interviews.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho pattern selection matrix for interviews.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context37 { state: string }

export function applyPatternSelectionMatrixForIntervi(ctx: Context37) {
  return { ...ctx, state: `${ctx.state}->pattern_selection_matrix_for_intervi` };
}
```

**Follow-up Interview Angles / Góc hỏi thêm:**
- EN: What breaks first under scale, and how would you instrument it?
- VI: Thành phần nào vỡ trước khi tải tăng, và bạn sẽ gắn đo đạc (instrumentation) ở đâu?
- EN: Which assumptions become invalid when requirements change?
- VI: Giả định nào không còn đúng khi yêu cầu sản phẩm thay đổi?

**Cross-reference / Tham chiếu:**
- See related theory: [./18-advanced-theory-02-virtual-dom-reconciliation.md](./18-advanced-theory-02-virtual-dom-reconciliation.md)

### Q38. Pattern selection matrix for interviews — Practical trade-offs and debugging in production
**Difficulty:** 🔴 [Senior]

**Tổng Quan (Overview):**
- EN: Explain **Pattern selection matrix for interviews** in a concise system-level way before diving into details.
- VI: Trình bày **Pattern selection matrix for interviews** theo tư duy hệ thống, rồi mới đi vào tối ưu cụ thể.

**Giải thích (Explanation):**
- EN: Start from invariants, then describe lifecycle, bottlenecks, and measurable outcomes for pattern selection matrix for interviews.
- VI: Bắt đầu từ bất biến (invariant), mô tả vòng đời xử lý, điểm nghẽn, và chỉ số cần đo cho pattern selection matrix for interviews.
- EN: Mention complexity (time/space), memory behavior, and edge cases interviewers often probe.
- VI: Nêu độ phức tạp thời gian/bộ nhớ, hành vi cache/memory, và các edge case hay bị hỏi sâu.
- EN: Connect theory to tooling and framework behavior in real frontend projects.
- VI: Liên kết lý thuyết với công cụ build, runtime framework, và trải nghiệm người dùng thực tế.

**Ví dụ (Example):**
```ts
interface Context38 { state: string }

export function applyPatternSelectionMatrixForIntervi(ctx: Context38) {
  return { ...ctx, state: `${ctx.state}->pattern_selection_matrix_for_intervi` };
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

