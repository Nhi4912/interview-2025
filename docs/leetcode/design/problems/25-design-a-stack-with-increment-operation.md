---
layout: page
title: "Design a Stack With Increment Operation"
difficulty: Medium
category: Design
tags: [Array, Stack, Design]
leetcode_url: "https://leetcode.com/problems/design-a-stack-with-increment-operation"
---

# Design a Stack With Increment Operation / Thiết Kế Stack Với Thao Tác Tăng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack Design — Lazy Propagation
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Min Stack](https://leetcode.com/problems/min-stack) | [Maximum Frequency Stack](https://leetcode.com/problems/maximum-frequency-stack)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống cộng thêm tiền cho N người đứng dưới cùng trong hàng — thay vì đến từng người, bạn ghi nhớ "số tiền cộng thêm" vào vị trí thứ N, chỉ cộng khi họ ra khỏi hàng (lazy propagation).

**Pattern Recognition:**

- Signal: "increment bottom k elements efficiently" → **Lazy Increment Array**
- Brute force O(k) per increment → optimize to O(1) using lazy array
- Key insight: `inc[k-1] += val`, khi pop thì propagate `inc[i]` xuống `inc[i-1]`

**Visual — Lazy increment trick:**

```
stack = [1, 2, 3, 4, 5]  maxSize=5
increment(3, 100)  →  inc = [0, 0, 100, 0, 0]  (mark at index 2)

pop() → val = stack[4]=5, carry inc[4]=0 → return 5
         inc unchanged: [0, 0, 100, 0, 0]
pop() → val = stack[3]=4, carry inc[3]=0 → return 4
pop() → val = stack[2]=3, carry inc[2]=100 → return 103
         propagate: inc[1] += 100 → inc = [0, 100, 0, 0, 0]
pop() → val = stack[1]=2, carry inc[1]=100 → return 102
         propagate: inc[0] += 100 → inc = [100, 0, 0, 0, 0]
pop() → val = stack[0]=1, carry inc[0]=100 → return 101
```

---

## Problem Description

Design a stack supporting `push(x)`, `pop()`, and `increment(k, val)` where increment adds `val` to the bottom `k` elements. `pop` returns -1 if empty. ([LeetCode 1381](https://leetcode.com/problems/design-a-stack-with-increment-operation))

**Example:** `push(1), push(2), increment(2, 100), pop()` → `102` (2 was one of bottom 2)

Constraints: `1 <= maxSize <= 1000`, `0 <= x <= 1000`, `1 <= k <= 1000`, `0 <= val <= 100`

---

## 📝 Interview Tips

1. **Brute force first**: "Brute: increment O(k), push/pop O(1) — có thể chấp nhận với maxSize ≤ 1000" / Brute force acceptable given constraints
2. **Lazy key insight**: "Thay vì update k phần tử, lưu `inc[k-1] += val` và propagate khi pop" / Amortize increment cost via lazy array
3. **Propagation**: "Khi pop index i, chuyển inc[i] → inc[i-1] để carry forward" / Pass increment down on pop
4. **Boundary**: "increment(k, val) với k > size → chỉ cộng cho min(k, size) phần tử" / Cap k at current stack size
5. **Complexity**: "Lazy approach: push/pop/increment đều O(1)" / All operations O(1) with lazy array

---

## Solutions

```typescript
/**
 * Solution 1: Brute force — simple array stack, O(k) increment
 * Time: push O(1), pop O(1), increment O(k)
 * Space: O(maxSize)
 */
class CustomStackBrute {
  private stack: number[];
  private max: number;

  constructor(maxSize: number) {
    this.stack = [];
    this.max = maxSize;
  }

  push(x: number): void {
    if (this.stack.length < this.max) this.stack.push(x);
  }

  pop(): number {
    return this.stack.pop() ?? -1;
  }

  increment(k: number, val: number): void {
    const limit = Math.min(k, this.stack.length);
    for (let i = 0; i < limit; i++) this.stack[i] += val;
  }
}

/**
 * Solution 2: Lazy increment array — O(1) all operations
 * Time: push O(1), pop O(1), increment O(1)
 * Space: O(maxSize) — inc[] same size as stack
 */
class CustomStack {
  private stack: number[];
  private inc: number[]; // lazy increment buffer
  private max: number;

  constructor(maxSize: number) {
    this.stack = [];
    this.inc = [];
    this.max = maxSize;
  }

  push(x: number): void {
    if (this.stack.length < this.max) {
      this.stack.push(x);
      this.inc.push(0);
    }
  }

  pop(): number {
    const i = this.stack.length - 1;
    if (i < 0) return -1;
    // Propagate lazy increment to element below
    if (i > 0) this.inc[i - 1] += this.inc[i];
    const val = this.stack[i] + this.inc[i];
    this.stack.pop();
    this.inc.pop();
    return val;
  }

  increment(k: number, val: number): void {
    const i = Math.min(k, this.stack.length) - 1;
    if (i >= 0) this.inc[i] += val; // mark at boundary index
  }
}

// === Test Cases ===
const s = new CustomStack(3);
s.push(1);
s.push(2);
s.push(3);
s.increment(2, 100);
console.log(s.pop()); // 3   (top element, not in bottom 2)
console.log(s.pop()); // 102 (was 2, +100)
console.log(s.pop()); // 101 (was 1, +100)
console.log(s.pop()); // -1  (empty)

const s2 = new CustomStack(2);
s2.push(1);
s2.push(2);
s2.push(3); // 3 ignored (max=2)
s2.increment(5, 10); // increment all (only 2 elements)
console.log(s2.pop()); // 12
console.log(s2.pop()); // 11
```

---

## 🔗 Related Problems

- [Min Stack](https://leetcode.com/problems/min-stack) — augmented stack design
- [Maximum Frequency Stack](https://leetcode.com/problems/maximum-frequency-stack) — complex stack with frequency tracking
- [Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks) — data structure design
- [Online Stock Span](https://leetcode.com/problems/online-stock-span) — monotonic stack pattern
- [Design a Stack With Increment Operation — LeetCode](https://leetcode.com/problems/design-a-stack-with-increment-operation) — problem page
