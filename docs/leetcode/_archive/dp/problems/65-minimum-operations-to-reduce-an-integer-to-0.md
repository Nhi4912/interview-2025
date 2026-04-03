---
layout: page
title: "Minimum Operations to Reduce an Integer to 0"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming, Greedy, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/minimum-operations-to-reduce-an-integer-to-0"
---

# Minimum Operations to Reduce an Integer to 0 / Số Phép Toán Tối Thiểu Để Đưa Số Nguyên Về 0

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy / Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Integer Replacement](https://leetcode.com/problems/integer-replacement) | [Find the Maximum Sum of Node Values](https://leetcode.com/problems/find-the-maximum-sum-of-node-values)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy nhìn số dưới dạng nhị phân. Mỗi bước bạn được cộng hoặc trừ một lũy thừa của 2. Mục tiêu: xoá hết tất cả các bit 1. Chiến lược tham lam: nếu có **chuỗi bit 1 liền tiếp**, tốt hơn là **carry +1** để gộp chúng thành 1 bit thay vì xoá từng bit.

**Pattern Recognition:**

- Greedy: xét từng run of 1s trong biểu diễn nhị phân
- Nếu bit thấp nhất là 1: so sánh `n & (n-1)` vs `n & (n+1)` — chọn cái có ít bit 1 hơn
- Key insight: 1-run cuối bao giờ cũng xử lý bằng -power (trừ), còn run nhiều bit 1 nên +1 để carry

**Visual — Binary Greedy:**

```
n = 12 = 1100
  → 2 bits set → 2 ops? No! n&(n-1)=8=1000(1 bit), n&(n+1)=...
  12 -4 = 8 (1 op), 8 -8 = 0 (1 op) → 2 ops ✓

n = 7 = 0111 (run of 3 ones)
  → use +1: 7+1=8=1000 (1 op), 8-8=0 (1 op) → 2 ops
  (vs subtracting each: -4,-2,-1 = 3 ops)
```

---

## Problem Description

Given a positive integer `n`, in one operation you can add or subtract any **power of 2** from `n`. Return the minimum number of operations to reduce `n` to `0`. ([LeetCode #2169](https://leetcode.com/problems/minimum-operations-to-reduce-an-integer-to-0))

**Example 1:** `n = 39` → `3` (39 = 32+4+2+1 → 39+1=40, 40-8=32, 32-32=0)
**Example 2:** `n = 54` → `3` (54-32=22, 22+2=24, 24-24=0)

Constraints: `1 <= n <= 10^5`

---

## 📝 Interview Tips

1. **Clarify**: "Có thể cộng lũy thừa 2 (không chỉ trừ)? / Can we add a power of 2, not just subtract?"
2. **Bit thinking**: "Nhìn vào binary — số lần op = số 'run' (nhóm bit 1 liên tiếp) / Count runs of 1-bits"
3. **Greedy key**: "Run 1 bit → trừ thẳng. Run nhiều bit → +1 để carry lên, merge thành 1 bit / Merge multi-bit runs"
4. **n&(n-1)**: "Xoá bit thấp nhất / removes lowest set bit"
5. **n&(n+1)**: "Xoá chuỗi bit 1 thấp nhất (trailing run) / removes trailing run of 1s"
6. **Edge cases**: "n=1 → 1, n=2 → 1, n=3 → 2 (3+1=4, 4-4=0) / Verify small values"

---

## Solutions

```typescript
/**
 * Solution 1: Greedy Bit Manipulation
 * Time: O(log n) — at most 17 iterations for n <= 10^5
 * Space: O(1) — constant space
 *
 * At each step: choose the operation that leaves fewer set bits
 * n & (n-1) removes lowest set bit (good for isolated 1s)
 * n & (n+1) removes trailing run of 1s (good for 111...1 runs)
 */
function minOperations(n: number): number {
  let ops = 0;
  while (n > 0) {
    if ((n & 1) === 0) {
      // Lowest bit is 0 — shift right to find the next set bit
      n >>= 1;
    } else if (n === 1 || (n & 2) === 0) {
      // Isolated 1 at the bottom → subtract it
      n &= n - 1; // clear lowest bit
      ops++;
    } else {
      // Trailing run of at least two 1s → add 1 to carry and merge
      n = (n + 1) >>> 0; // carry propagates, collapses the run
      ops++;
    }
  }
  return ops;
}

/**
 * Solution 2: Count Bit Runs (clean O(log n))
 * Time: O(log n)
 * Space: O(1)
 *
 * Each "run of 1s" requires exactly 1 operation to eliminate.
 * (Either subtract the lowest bit for isolated 1, or +1 to carry for a run)
 * So answer = number of runs of consecutive 1-bits in binary of n.
 */
function minOperationsRuns(n: number): number {
  let ops = 0;
  while (n > 0) {
    if ((n & 1) === 1) {
      // Start of a run of 1s
      ops++;
      // Skip entire run: use n&(n+1) to clear trailing 1s, or n&(n-1) if single
      const cleared = n & (n + 1); // clears trailing run of 1s
      n = cleared === 0 ? 0 : cleared;
    } else {
      n >>= 1; // skip 0 bit
    }
  }
  return ops;
}

// === Test Cases ===
console.log(minOperations(39)); // 3
console.log(minOperations(54)); // 3
console.log(minOperations(1)); // 1
console.log(minOperations(7)); // 2  (7+1=8, 8-8=0)
console.log(minOperations(3)); // 2
```

---

## 🔗 Related Problems

| Problem                                                                                                  | Pattern          | Difficulty |
| -------------------------------------------------------------------------------------------------------- | ---------------- | ---------- |
| [Integer Replacement](https://leetcode.com/problems/integer-replacement)                                 | BFS / Greedy     | Medium     |
| [Find the Maximum Sum of Node Values](https://leetcode.com/problems/find-the-maximum-sum-of-node-values) | Greedy + XOR     | Hard       |
| [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits)                                       | Bit Manipulation | Easy       |
| [Minimum Bit Flips to Convert Number](https://leetcode.com/problems/minimum-bit-flips-to-convert-number) | Bit Manipulation | Easy       |
