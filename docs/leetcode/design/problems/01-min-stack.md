---
layout: page
title: "Min Stack"
difficulty: Medium
category: Design
tags: [Stack, Design]
leetcode_url: "https://leetcode.com/problems/min-stack/"
---

# Min Stack / Stack Tối Thiểu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Auxiliary Stack / State Tracking
> **Frequency**: ⭐ Tier 2 — Gặp ~45% interviews, phổ biến trong vòng design
> **See also**: [Max Stack](https://leetcode.com/problems/max-stack/) | [Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng nhân viên kho hàng xếp thùng lên pallet — mỗi khi đặt thêm thùng, một trợ lý viết lên bảng ghi nhớ "số lô nhỏ nhất tính đến nay". Khi lấy thùng ra, trợ lý cũng xóa mục đó nếu chính thùng đó là lô nhỏ nhất. Nhờ vậy, hỏi "lô nhỏ nhất hiện tại?" luôn trả lời ngay được — O(1).

**Pattern Recognition:**

- Signal: "getMin() in O(1)", "design a stack that also retrieves minimum" → **Stack phụ theo dõi min**
- Stack thông thường không biết min sau khi pop — cần lưu trạng thái min tại mỗi thời điểm
- Duy trì `minStack` song song: chỉ push khi value ≤ min hiện tại; pop cùng lúc khi giá trị bằng min

**Visual — Two Stacks State:**

```
Operations: push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()

           stack         minStack
push(-2): [-2]           [-2]     ← -2 ≤ empty → push both
push(0):  [-2, 0]        [-2]     ← 0 > -2 → skip minStack
push(-3): [-2, 0, -3]    [-2,-3]  ← -3 ≤ -2 → push both
getMin():                [-2,-3]  → top = -3 ✅
pop():    [-2, 0]        [-2]     ← -3 == minStack.top → pop both
top():    [-2, 0]                 → 0 ✅
getMin():                [-2]    → -2 ✅
```

---

## Problem Description

Design a stack that supports push, pop, top, and retrieving the minimum element in **constant time O(1)** for all operations.

```
Operations: ["MinStack","push","push","push","getMin","pop","top","getMin"]
Values:     [[],        [-2],  [0],   [-3],  [],      [],   [],   []]
Output:     [null,      null,  null,  null,  -3,      null, 0,    -2]
```

Constraints:

- -2^31 <= val <= 2^31 - 1
- pop, top, getMin are always called on non-empty stack
- At most 3 × 10^4 calls to each method

---

## 📝 Interview Tips

1. **Clarify**: Confirm all four operations must be O(1), especially getMin / Xác nhận tất cả operations đều phải O(1), đặc biệt getMin
2. **Brute force**: Single stack + scan all elements for min → O(n) getMin — explain why this violates the requirement / Stack đơn + quét tìm min → O(n), không đủ yêu cầu
3. **Approach**: "Track the running minimum at each push using an auxiliary stack — when we pop, we automatically restore the previous minimum" / Dùng stack phụ lưu min từng thời điểm
4. **Edge cases**: Push same value as current min — must use `<=` not `<` when deciding to push to minStack / Push giá trị bằng min hiện tại — phải dùng `<=` không phải `<`
5. **Follow-up**: Store pairs `[value, minAtThisPoint]` in one stack to halve the number of data structures / Lưu cặp `[val, min]` để chỉ dùng một stack
6. **Trade-off**: Two stacks: O(k) extra where k = number of times min changes; Pairs: always 2× space / Hai stacks: O(k) thêm; Pairs: luôn 2× dung lượng

---

## Solutions

```typescript

/**

- Solution 1: Brute Force — Single Stack with O(n) getMin
- Time: O(1) push/pop/top, O(n) getMin — violates the requirement
- Space: O(n)
  */
  class MinStackBrute {
  private stack: number[] = [];

push(val: number): void { this.stack.push(val); }
pop(): void { this.stack.pop(); }
top(): number { return this.stack[this.stack.length - 1]; }
getMin(): number { return Math.min(...this.stack); } // O(n) ← does NOT meet requirement
}

/**

- Solution 2: Two Stacks — Auxiliary Min Tracking (Optimal)
- Time: O(1) for all operations
- Space: O(n) — minStack stores at most n elements
  */
  class MinStack {
  private stack: number[] = [];
  private minStack: number[] = [];

push(val: number): void {
this.stack.push(val);
// Push to minStack only when val is a new minimum (use <= to handle duplicate mins)
if (this.minStack.length === 0 || val <= this.minStack[this.minStack.length - 1]) {
this.minStack.push(val);
}
}

pop(): void {
const popped = this.stack.pop()!;
// If the popped value was the current minimum, restore the previous minimum
if (popped === this.minStack[this.minStack.length - 1]) {
this.minStack.pop();
}
}

top(): number { return this.stack[this.stack.length - 1]; }
getMin(): number { return this.minStack[this.minStack.length - 1]; }
}

// === Test Cases ===
const ms = new MinStack();
ms.push(-2); ms.push(0); ms.push(-3);
console.log(ms.getMin()); // -3 ✅
ms.pop();
console.log(ms.top()); // 0 ✅
console.log(ms.getMin()); // -2 ✅

const ms2 = new MinStack();
ms2.push(1); ms2.push(1); // equal value edge case
console.log(ms2.getMin()); // 1 ✅
ms2.pop();
console.log(ms2.getMin()); // 1 ✅ (still 1, not undefined)

```

---

## 🔗 Related Problems

- [Max Stack](https://leetcode.com/problems/max-stack/) — same pattern but tracking maximum
- [Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/) — another stack design problem
- [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) — stack usage prerequisite
- [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) — monotonic stack pattern
