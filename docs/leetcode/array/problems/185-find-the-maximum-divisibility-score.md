---
layout: page
title: "Find the Maximum Divisibility Score"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/find-the-maximum-divisibility-score"
---

# Find the Maximum Divisibility Score / Tìm Điểm Chia Hết Lớn Nhất

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Array Counting
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Count Operations to Obtain Zero](https://leetcode.com/problems/count-operations-to-obtain-zero) | [Divisor Game](https://leetcode.com/problems/divisor-game)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống chấm bài — mỗi "giám khảo" (divisors[i]) cho điểm bằng số học sinh (nums) mà nó chia hết. Tìm giám khảo đạt điểm cao nhất; nếu hòa, chọn người có giá trị nhỏ hơn.

**Visual:**

```
nums=[4,7,9,3,9], divisors=[5,2,3]

divisor=5: 4%5≠0, 7%5≠0, 9%5≠0, 3%5≠0, 9%5≠0 → score=0
divisor=2: 4%2=0✓, 7%2≠0, 9%2≠0, 3%2≠0, 9%2≠0 → score=1
divisor=3: 4%3≠0, 7%3≠0, 9%3=0✓, 3%3=0✓, 9%3=0✓ → score=3 ← max

Answer: 3
```

---

## Problem Description

Given arrays `nums` and `divisors`, the **divisibility score** of `divisors[i]` = count of elements in `nums` divisible by `divisors[i]`. Return the divisor with the **maximum score**; if there's a tie, return the **smallest** divisor.

- Example 1: `nums=[4,7,9,3,9], divisors=[5,2,3]` → `3` (score 3)
- Example 2: `nums=[20,14,21,10], divisors=[5,7,5]` → `5` (tie between two 5s, but distinct values: 5 wins)

**Constraints:** `1 <= nums.length, divisors.length <= 1000`, `1 <= nums[i], divisors[i] <= 10^9`

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Tie-break: trả về divisor nhỏ nhất, không phải index nhỏ nhất" / Tie-break is by value, not index.
2. **Brute force is optimal**: "O(n*m) với n=|nums|, m=|divisors| — không có cách tốt hơn" / No better than O(n*m) for general case.
3. **Update condition**: "Cập nhật khi score lớn hơn, hoặc bằng nhau nhưng divisor nhỏ hơn" / Update on strictly better score or equal score with smaller divisor.
4. **Modulo check**: "`nums[i] % d == 0` là điều kiện chia hết" / Use modulo operator for divisibility test.
5. **Edge case**: "Divisor lớn hơn tất cả nums → score = 0 cho divisor đó" / Large divisor scores 0 if none divide evenly.
6. **Complexity**: "O(n * m) — thường đủ với n,m ≤ 1000" / O(n*m) = O(10^6) which is fine.

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Sort Divisors First for Easy Tie-break
 * Time: O(m log m + n*m) — sort divisors + nested loop
 * Space: O(m) — copy of sorted divisors
 *
 * Sort divisors ascending so the first max found is smallest in tie.
 */
function maxDivisibilityScoreSorted(nums: number[], divisors: number[]): number {
  const sorted = [...divisors].sort((a, b) => a - b); // ascending
  let best = -1;
  let bestScore = -1;

  for (const d of sorted) {
    let score = 0;
    for (const n of nums) {
      if (n % d === 0) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      best = d;
    }
    // Skip equal: since sorted ascending, first max seen is smallest
  }
  return best;
}

console.log(maxDivisibilityScoreSorted([4, 7, 9, 3, 9], [5, 2, 3])); // 3
console.log(maxDivisibilityScoreSorted([20, 14, 21, 10], [5, 7, 5])); // 5
console.log(maxDivisibilityScoreSorted([1, 2, 3], [10])); // 10

/**
 * Solution 2: Inline — No Sort, Compare on Both Criteria
 * Time: O(n * m) — nested loop over nums × divisors
 * Space: O(1)
 */
function maxDivisibilityScore(nums: number[], divisors: number[]): number {
  let bestDiv = divisors[0];
  let bestScore = 0;

  for (const d of divisors) {
    let score = 0;
    for (const n of nums) {
      if (n % d === 0) score++;
    }
    // Update if better score, or same score but smaller divisor
    if (score > bestScore || (score === bestScore && d < bestDiv)) {
      bestScore = score;
      bestDiv = d;
    }
  }

  return bestDiv;
}

console.log(maxDivisibilityScore([4, 7, 9, 3, 9], [5, 2, 3])); // 3
console.log(maxDivisibilityScore([20, 14, 21, 10], [5, 7, 5])); // 5
console.log(maxDivisibilityScore([1, 2, 3], [10])); // 10
console.log(maxDivisibilityScore([3, 6, 9], [3, 3])); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                                                            | Pattern            | Difficulty |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ---------- |
| [Divisor Game](https://leetcode.com/problems/divisor-game)                                                                                         | Math / DP          | Easy       |
| [Count Operations to Obtain Zero](https://leetcode.com/problems/count-operations-to-obtain-zero)                                                   | Simulation         | Easy       |
| [Smallest Value After Replacing With Sum of Prime Factors](https://leetcode.com/problems/smallest-value-after-replacing-with-sum-of-prime-factors) | Number Theory      | Easy       |
| [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array)                                                   | Quickselect / Heap | Medium     |
