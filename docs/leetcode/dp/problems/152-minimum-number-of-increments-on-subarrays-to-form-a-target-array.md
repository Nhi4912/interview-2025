---
layout: page
title: "Minimum Number of Increments on Subarrays to Form a Target Array"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Stack, Greedy, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-increments-on-subarrays-to-form-a-target-array"
---

# Minimum Number of Increments on Subarrays to Form a Target Array / Số Lần Tăng Mảng Con Tối Thiểu

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Monotonic Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Minimum Cost Tree From Leaf Values](https://leetcode.com/problems/minimum-cost-tree-from-leaf-values) | [Maximum Array Hopping Score I](https://leetcode.com/problems/maximum-array-hopping-score-i)

---

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Như vẽ đồ thị — số lần tô màu tối thiểu bằng số "bước lên" trong histogram. Mỗi khi giá trị tăng so với trước, ta cần thêm thao tác mới; khi giảm, ta dùng lại thao tác cũ.

```
target = [3, 1, 5, 4, 2]
          3
              5
            4
  3
                2
          1

Differences (max(0, target[i] - target[i-1])):
  i=0: 3         → +3
  i=1: max(0,1-3)= 0 → +0 (reuse operations from level 1)
  i=2: max(0,5-1)= 4 → +4 (need 4 new operations to climb from 1 to 5)
  i=3: max(0,4-5)= 0 → +0 (going down, existing ops cover it)
  i=4: max(0,2-4)= 0 → +0

Answer = 3 + 0 + 4 + 0 + 0 = 7
```

**Key insight:** The answer is `target[0] + Σ max(0, target[i] - target[i-1])` for `i ≥ 1`. Each upward step requires new increment operations; downward steps reuse existing ones.

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Greedy insight**: Count only "rises" — each rise needs fresh operations / chỉ đếm phần tăng
- 🔑 **Formula**: `ans = target[0] + Σ max(0, target[i] - target[i-1])` / công thức O(n) đơn giản
- 🔑 **Why it works**: A subarray increment op that starts at some position covers all positions to its right / một thao tác bao phủ một đoạn liên tiếp
- 🔑 **Brute-force intuition**: Simulate "painting" histogram rows — answer = total rows painted = total height increases / số hàng vẽ = số bước tăng
- 🔑 **No need for stack**: The formula is purely O(n) greedy; monotonic stack connection is conceptual / stack chỉ là cách hiểu
- 🔑 **Edge case**: Single element `[5]` → answer is 5 / phần tử đơn bằng chính nó

---

## Solutions / Giải Pháp

### Solution 1: Greedy O(n) — Count Increases

```typescript
/**
 * Minimum Increments to Form Target — Greedy
 *
 * Key observation: each "upward step" target[i] - target[i-1] > 0 requires
 * that many new increment operations starting at i (or earlier).
 * Downward steps are free because existing operations can just stop earlier.
 *
 * Answer = target[0] + sum of max(0, target[i]-target[i-1]) for i >= 1
 *
 * Time:  O(n)
 * Space: O(1)
 */
function minNumberOperations(target: number[]): number {
  let operations = target[0]; // First element needs target[0] ops (from zero)
  for (let i = 1; i < target.length; i++) {
    const rise = target[i] - target[i - 1];
    if (rise > 0) operations += rise;
  }
  return operations;
}

console.log(minNumberOperations([3, 1, 5, 4, 2])); // 7
console.log(minNumberOperations([1, 1, 1, 1])); // 1
console.log(minNumberOperations([3, 1, 1, 2])); // 4
console.log(minNumberOperations([5])); // 5
console.log(minNumberOperations([1, 2, 3, 2, 1])); // 3
```

### Solution 2: Simulation / Visual Proof

```typescript
/**
 * Minimum Increments to Form Target — Explicit Simulation
 *
 * Think of building the histogram by layers.
 * Layer 1 covers all positions ≥ 1 → 1 operation per "connected segment at height ≥ 1".
 * But we can merge connected regions, so we count contiguous "raises".
 *
 * This simulation explicitly shows the staircase structure.
 *
 * Time:  O(n)
 * Space: O(1)
 */
function minNumberOperationsExplain(target: number[]): number {
  const n = target.length;
  let total = 0;

  // Visualize: current "floor" is what operations from left already cover
  let floor = 0;
  for (let i = 0; i < n; i++) {
    if (target[i] > floor) {
      // Need target[i]-floor new increment operations that "start" here or extend from left
      total += target[i] - floor;
    }
    // floor becomes max(floor, target[i]) conceptually? No — floor resets at each position
    // Actually: floor IS target[i-1] for adjacent reasoning
    floor = target[i];
  }

  return total;
}

console.log(minNumberOperationsExplain([3, 1, 5, 4, 2])); // 7
console.log(minNumberOperationsExplain([1, 1, 1, 1])); // 1
console.log(minNumberOperationsExplain([3, 1, 1, 2])); // 4
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                                | Difficulty | Pattern              |
| ------------------------------------------------------------------------------------------------------ | ---------- | -------------------- |
| [Minimum Cost Tree From Leaf Values](https://leetcode.com/problems/minimum-cost-tree-from-leaf-values) | 🟡 Medium  | Monotonic Stack      |
| [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram)         | 🔴 Hard    | Monotonic Stack      |
| [Sum of Subarray Minimums](https://leetcode.com/problems/sum-of-subarray-minimums)                     | 🟡 Medium  | Monotonic Stack      |
| [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water)                               | 🔴 Hard    | Two Pointers / Stack |
