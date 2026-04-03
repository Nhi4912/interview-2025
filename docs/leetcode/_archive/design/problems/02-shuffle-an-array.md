---
layout: page
title: "Shuffle an Array"
difficulty: Medium
category: Design
tags: [Design, Randomized]
leetcode_url: "https://leetcode.com/problems/shuffle-an-array/"
---

# Shuffle an Array / Xáo Trộn Mảng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Fisher-Yates Shuffle
> **Frequency**: 📘 Tier 3
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese)**: Tưởng tượng bạn đang trộn một bộ bài. Bạn lấy lá bài cuối cùng, chọn ngẫu nhiên một lá bài ở vị trí bất kỳ (kể cả chính nó), rồi hoán đổi. Lặp lại từ cuối về đầu. Mỗi hoán vị đều có xác suất bằng nhau.

**Pattern Recognition**: Khi bài yêu cầu "equally likely permutation" → Fisher-Yates. **Không** dùng `.sort(() => Math.random() - 0.5)` vì comparator phải nhất quán — random comparisons vi phạm tính bắc cầu, dẫn đến phân phối bị lệch.

**ASCII Visual**:

```
Array: [A, B, C, D]
i=3: swap(D, arr[rand 0..3]) → e.g. [A, D, C, B]
i=2: swap(C, arr[rand 0..2]) → e.g. [C, D, A, B]
i=1: swap(D, arr[rand 0..1]) → e.g. [D, C, A, B]
Result: one of 4! = 24 equally likely permutations
```

## Problem Description

Given integer array `nums`, design an algorithm to randomly shuffle it where all permutations are equally likely.

Implement: `Solution(nums)` — init; `reset()` — return original; `shuffle()` — return random permutation.

**Example**:

```
Input:  ["Solution","shuffle","reset","shuffle"]
        [[[1,2,3]],  [],       [],     []]
Output: [null,       [3,1,2],  [1,2,3],[1,3,2]]
```

**Constraints**: `1 ≤ nums.length ≤ 200`, all elements unique, ≤ 5×10⁴ calls.

## 📝 Interview Tips

- **Thuật toán đúng**: Luôn dùng Fisher-Yates — `sort` trick cho kết quả bị lệch vì comparator phải có tính bắc cầu nhưng random thì không.
- **Use Fisher-Yates, not sort**: Random comparators violate transitivity — sort-based shuffle is provably biased.
- **Reset efficiently**: Giữ bản sao `original` trong constructor; `reset()` chỉ cần copy lại — O(n).
- **Shuffle on copy**: Làm việc trên `[...original]` mỗi lần shuffle để không làm hỏng bản gốc.
- **Complexity**: `constructor` O(n), `reset` O(n), `shuffle` O(n) — tất cả đều tuyến tính.
- **Verification**: Để kiểm tra tính uniform, chạy N lần và đếm tần suất mỗi hoán vị — nên xấp xỉ 1/n!.

## Solutions

```typescript
/**

- Shuffle an Array — LeetCode #384
-
- Fisher-Yates algorithm: for each position i from end to 1,
- swap arr[i] with arr[rand(0..i)].
- Each of the n! permutations has equal probability.
-
- Time: O(n) shuffle, O(n) reset | Space: O(n) for original copy
  */
  class Solution {
  private original: number[];
  private current: number[];

constructor(nums: number[]) {
this.original = [...nums];
this.current = [...nums];
}

/**

- Reset to original configuration.
- Đặt lại về cấu hình ban đầu.
  */
  reset(): number[] {
  this.current = [...this.original];
  return this.current;
  }

/**

- Return a uniformly random permutation using Fisher-Yates.
- Trả về hoán vị ngẫu nhiên đều đặn dùng Fisher-Yates.
  _/
  shuffle(): number[] {
  this.current = [...this.original];
  for (let i = this.current.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() _ (i + 1));
  [this.current[i], this.current[j]] = [this.current[j], this.current[i]];
  }
  return this.current;
  }
  }

// Inline tests
const sol = new Solution([1, 2, 3]);
console.assert(sol.reset().join(',') === '1,2,3', 'reset returns original');
const shuffled = sol.shuffle();
console.assert(shuffled.length === 3, 'shuffle preserves length');
console.assert(new Set(shuffled).size === 3, 'shuffle preserves elements');
console.assert(sol.reset().join(',') === '1,2,3', 'reset after shuffle still works');
// Single-element array: shuffle is identity
const single = new Solution([42]);
console.assert(single.shuffle().join(',') === '42');
```

## 🔗 Related Problems

- [LC 470 — Implement rand10() using rand7()](https://leetcode.com/problems/implement-rand10-using-rand7/) — randomized algorithms
- [LC 398 — Random Pick Index](https://leetcode.com/problems/random-pick-index/) — reservoir sampling
- [LC 382 — Linked List Random Node](https://leetcode.com/problems/linked-list-random-node/) — uniform random over stream
- [LC 528 — Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight/) — weighted random selection
