---
layout: page
title: "Set Mismatch"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Hash Table, Bit Manipulation, Sorting]
leetcode_url: "https://leetcode.com/problems/set-mismatch"
---

# Set Mismatch / Set Mismatch

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Missing Number](https://leetcode.com/problems/missing-number) | [Majority Element](https://leetcode.com/problems/majority-element)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như điểm danh học sinh trong lớp — một học sinh xuất hiện hai lần (trùng) trong khi một học sinh khác vắng mặt. Đếm tần suất và so sánh với danh sách lý tưởng [1..n] là đủ.

**Pattern Recognition:**

- Signal: array [1..n] với một phần tử trùng, một phần tử mất → đếm tần suất
- Key insight: dùng hash count để tìm duplicate (count=2) và missing (count=0)

**Visual — Set Mismatch example:**

```
nums = [1, 2, 2, 4]
Expected: [1, 2, 3, 4]

Count freq:
  1 → 1  ✓
  2 → 2  ← duplicate!
  3 → 0  ← missing!
  4 → 1  ✓

Answer: [2, 3]

Sorted approach:
Sort → [1, 2, 2, 4]
Compare with [1, 2, 3, 4]:
  idx=2: nums[2]=2 ≠ 3 → duplicate=2, missing=3
  idx=3: gap 2→4 means 3 was missing
```

---

## Problem Description

You have a set of integers `s` that originally contains all numbers from `1` to `n`. Unfortunately, due to some error, one number `dup` got duplicated to another number in the set and that results in the loss of `missing`. Return the array `[dup, missing]`.

Difficulty: Easy | Acceptance: 45.0%

```
Example 1:
  Input:  nums = [1, 2, 2, 4]
  Output: [2, 3]

Example 2:
  Input:  nums = [1, 1]
  Output: [1, 2]

Example 3:
  Input:  nums = [2, 2]
  Output: [2, 1]
```

Constraints:

- `2 <= nums.length <= 10^4`
- `1 <= nums[i] <= n` where `n = nums.length`

---

## 📝 Interview Tips

1. **Clarify**: "nums có đúng n phần tử không? Phần tử nằm trong [1,n]?" / Confirm nums has exactly n elements in range [1,n].
2. **Brute force**: "Hash count O(n) time/space là đơn giản nhất" / Hash frequency count is the most intuitive O(n) solution.
3. **Optimize**: "Có thể dùng toán học: sum_expected - sum_actual = missing - dup; sum_sq cũng tương tự" / Math trick: two equations, two unknowns.
4. **In-place**: "Sắp xếp tại chỗ O(n log n) → duyệt tìm chỗ lệch" / Sort in-place O(n log n) then scan for mismatch.
5. **Edge cases**: "n=2 với [1,1] hoặc [2,2]" / Minimal case n=2.
6. **Follow-up**: "Nếu k phần tử trùng? Hash count vẫn hoạt động" / What if multiple duplicates? Hash map still works.

---

## Solutions

```typescript
/**
 * Solution 1: Hash Count
 * Time: O(n) — one pass to count, one pass over [1..n]
 * Space: O(n) — frequency array
 */
function findErrorNumsHash(nums: number[]): number[] {
  const n = nums.length;
  const count = new Array(n + 1).fill(0);
  for (const x of nums) count[x]++;
  let dup = -1,
    missing = -1;
  for (let i = 1; i <= n; i++) {
    if (count[i] === 2) dup = i;
    if (count[i] === 0) missing = i;
  }
  return [dup, missing];
}

/**
 * Solution 2: Sorting
 * Time: O(n log n) — sort dominates
 * Space: O(1) — in-place sort (ignoring sort stack)
 */
function findErrorNums(nums: number[]): number[] {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  let dup = -1,
    missing = -1;
  for (let i = 0; i < n; i++) {
    const expected = i + 1;
    if (nums[i] === nums[i - 1] && i > 0) {
      dup = nums[i];
    } else if (nums[i] !== expected && dup === -1) {
      // nums[i] skipped expected → expected is missing
      missing = expected;
    }
  }
  // edge: missing might be n if everything else aligned
  if (missing === -1) missing = n;
  return [dup, missing];
}

/**
 * Solution 3: Math (Two Equations)
 * Time: O(n) — two passes
 * Space: O(1) — only variables
 *
 * Let d=dup, m=missing
 *   sum(nums) - n*(n+1)/2  = d - m
 *   sumSq(nums) - n*(n+1)*(2n+1)/6 = d^2 - m^2 = (d-m)(d+m)
 *   → d+m = sumSqDiff / (d-m)
 *   → d = ((d-m)+(d+m))/2, m = ((d+m)-(d-m))/2
 */
function findErrorNumsMath(nums: number[]): number[] {
  const n = nums.length;
  let sumDiff = 0,
    sumSqDiff = 0;
  for (let i = 0; i < n; i++) {
    sumDiff += nums[i] - (i + 1);
    sumSqDiff += nums[i] * nums[i] - (i + 1) * (i + 1);
  }
  // sumDiff = d - m, sumSqDiff = d^2 - m^2 = (d-m)(d+m)
  const sumPlus = sumSqDiff / sumDiff; // d + m
  const dup = (sumDiff + sumPlus) / 2;
  const missing = (sumPlus - sumDiff) / 2;
  return [dup, missing];
}

// === Test Cases ===
console.log(findErrorNums([1, 2, 2, 4])); // [2, 3]
console.log(findErrorNums([1, 1])); // [1, 2]
console.log(findErrorNums([2, 2])); // [2, 1]
console.log(findErrorNumsMath([1, 2, 2, 4])); // [2, 3]
console.log(findErrorNumsHash([3, 2, 3, 4, 6, 5])); // [3, 1]
```

---

## 🔗 Related Problems

- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: find missing in [0..n]
- [Majority Element](https://leetcode.com/problems/majority-element) — same pattern: frequency counting
- [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays) — same pattern: set/hash
- [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number) — harder variant: Floyd's cycle
- [Set Mismatch — LeetCode](https://leetcode.com/problems/set-mismatch) — problem page
