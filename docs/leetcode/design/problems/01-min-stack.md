---
layout: page
title: "Min Stack"
difficulty: Medium
category: Design
tags: [Stack, Design]
leetcode_url: "https://leetcode.com/problems/min-stack/"
leetcode_number: 155
pattern: "Auxiliary Stack"
frequency_tier: 2
companies: [Amazon, Google, Bloomberg, Microsoft]
target_time_minutes: 15
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
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

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                              |
| ---------------- | --------------------------------------------------------------------- |
| **When you see** | "getMin() in O(1)", "stack with minimum retrieval"                    |
| **Think**        | Auxiliary min-stack — track running minimum at each push              |
| **Template**     | `if (val <= minStack.top) minStack.push(val); pop both when equal`    |
| **Time target**  | ⏱️ 15 min (Medium)                                                   |

> 💡 **Memory hook / Móc nhớ:** "Stack phụ = bóng của stack chính — chỉ ghi lại các giá trị nhỏ nhất từng thời điểm!"

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

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "We need to design a stack with push, pop, top, and getMin — all in O(1). Let me confirm: getMin must be O(1) too, not just push/pop?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2 min)

> "A naive approach uses a single stack and scans for the minimum — that's O(n). To get O(1), I need to remember the minimum at every state. I'll use an auxiliary minStack that mirrors the main stack, only storing values when a new minimum is reached. That keeps getMin O(1) at the cost of O(k) extra space where k is the number of minimum changes."

### Step 3 — Implement / Viết Code (5 min)

> "For push: I push to the main stack always. I push to minStack only when val ≤ current min — using ≤ not < to handle duplicate minimums. For pop: I pop from main stack, and if the popped value equals the top of minStack, I pop minStack too."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Let me trace: push(-2), push(0), push(-3). Main=[-2,0,-3], minStack=[-2,-3]. getMin()=-3 ✓. Pop: main=[-2,0], -3 equals minStack top → pop both, minStack=[-2]. getMin()=-2 ✓."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "All operations O(1). Space O(n) worst case, O(k) for minStack where k = number of distinct minimums. Edge case: duplicate values like push(1), push(1) — using ≤ ensures we push both to minStack so pop correctly restores the minimum."

---

## 📝 Interview Tips

1. **Clarify**: Confirm all four operations must be O(1), especially getMin / Xác nhận tất cả operations đều phải O(1), đặc biệt getMin
2. **Brute force**: Single stack + scan all elements for min → O(n) getMin — explain why this violates the requirement / Stack đơn + quét tìm min → O(n), không đủ yêu cầu
3. **Approach**: "Track the running minimum at each push using an auxiliary stack — when we pop, we automatically restore the previous minimum" / Dùng stack phụ lưu min từng thời điểm
4. **Edge cases**: Push same value as current min — must use `<=` not `<` when deciding to push to minStack / Push giá trị bằng min hiện tại — phải dùng `<=` không phải `<`
5. **Follow-up**: Store pairs `[value, minAtThisPoint]` in one stack to halve the number of data structures / Lưu cặp `[val, min]` để chỉ dùng một stack
6. **Trade-off**: Two stacks: O(k) extra where k = number of times min changes; Pairs: always 2× space / Hai stacks: O(k) thêm; Pairs: luôn 2× dung lượng

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                          | Why Wrong / Tại sao sai                                          | Fix / Cách sửa                                     |
| --- | ------------------------------------------ | ---------------------------------------------------------------- | -------------------------------------------------- |
| 1   | Using `<` instead of `<=` for minStack push | Duplicate minimums: push(1),push(1) — second pop loses min=1    | Use `val <= minStack.top` to handle equal values   |
| 2   | Scanning stack for min on every getMin()   | O(n) per getMin call — violates requirement                      | Maintain auxiliary minStack for O(1)               |
| 3   | Popping minStack only when main value < min | If equal duplicates exist, minStack gets out of sync             | Pop minStack whenever `popped === minStack.top`    |

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

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | ___ min (target: 15 min)                 |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
