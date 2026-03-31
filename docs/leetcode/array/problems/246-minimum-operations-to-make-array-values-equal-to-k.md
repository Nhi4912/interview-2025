---
layout: page
title: "Minimum Operations to Make Array Values Equal to K"
difficulty: Easy
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/minimum-operations-to-make-array-values-equal-to-k"
---

# Minimum Operations to Make Array Values Equal to K / Số Thao Tác Tối Thiểu Để Mảng Bằng K

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map (Distinct Count)
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Minimum Number of Operations to Make Array Empty](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-empty) | [Reduction Operations to Make the Array Elements Equal](https://leetcode.com/problems/reduction-operations-to-make-the-array-elements-equal)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như hạ thang lương — mỗi lần chỉ được xóa một "mức lương" cao nhất (tất cả người có mức đó về mức liền dưới). Số thao tác = số mức lương khác nhau nằm trên mức K. Nếu có ai đang dưới K, không thể nâng lên → trả về -1.

**Pattern Recognition:**

- Operation: choose `h`, set all elements > h to h (one "level" collapses per operation)
- To bring all elements to `k`: need one operation per distinct value above k
- If any element < k: impossible → return -1
- Answer = count of distinct values strictly greater than k

**Visual — Level collapsing:**

```
nums = [5,2,5,4,5], k = 2

Values: {2, 4, 5}
Values > k=2: {4, 5} → 2 distinct levels

Op 1: choose h=4 → all 5s become 4 → [4,2,4,4,4]
Op 2: choose h=2 → all 4s become 2 → [2,2,2,2,2] ✅

Answer = 2

nums = [2,1,2], k = 2
Values: {1,2}. nums[1]=1 < k=2 → impossible → -1

nums = [3,3,3], k = 3
Values > k=3: {} → 0 distinct levels → Answer = 0
```

---

## Problem Description

In one operation, choose integer `h` (where at least one element > h exists), and replace every element > h with h. Return the **minimum number of operations** to make all elements equal to `k`. If any element is less than `k`, return **-1**. ([LeetCode 3375](https://leetcode.com/problems/minimum-operations-to-make-array-values-equal-to-k))

Difficulty: Easy | Acceptance: 73.5%

```
Example 1: nums=[5,2,5,4,5], k=2 → 2  (two distinct values above k: {4,5})
Example 2: nums=[2,1,2],     k=2 → -1  (1 < k=2, impossible)
Example 3: nums=[3,3,3],     k=3 → 0   (already all equal to k)
```

Constraints:

- `1 <= nums.length <= 100`
- `1 <= nums[i] <= 100`
- `1 <= k <= 100`

---

## 📝 Interview Tips

1. **Impossible case first**: "Nếu bất kỳ nums[i] < k → return -1 ngay" / Check for any element below k before anything else
2. **One op per level**: "Mỗi thao tác xóa đúng một giá trị phân biệt > k" / Each op collapses exactly one distinct value level above k
3. **Why distinct?**: "Tất cả phần tử có cùng giá trị sập cùng lúc trong một op" / All elements with same value collapse together in one operation
4. **Set trick**: "Dùng Set để đếm giá trị distinct > k" / Use Set to count distinct values above k
5. **Edge k in array**: "Nếu k có trong array, không cần op cho k (đã ở mức target)" / Elements equal to k need 0 ops
6. **Follow-up**: "Nếu k không nằm trong array? Vẫn cần đưa tất cả về k" / Even if k not in array, we still target k

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — sort and count distinct levels above k
 * Time: O(n log n) — sort for clarity
 * Space: O(n) — sorted copy
 */
function minimumOperationsBrute(nums: number[], k: number): number {
  for (const n of nums) {
    if (n < k) return -1;
  }
  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  let ops = 0;
  for (const v of sorted) {
    if (v > k) ops++;
  }
  return ops;
}

/**
 * Solution 2: Hash Set — count distinct values > k (optimal)
 * Time: O(n) — single pass
 * Space: O(n) — set of distinct values
 */
function minimumOperationsToMakeArrayValuesEqualToK(nums: number[], k: number): number {
  const distinctAboveK = new Set<number>();

  for (const num of nums) {
    if (num < k) return -1; // impossible: can't raise elements
    if (num > k) distinctAboveK.add(num);
  }

  // Each distinct level above k requires exactly one operation
  return distinctAboveK.size;
}

/**
 * Solution 3: Combined check + count (same complexity, slightly cleaner)
 * Time: O(n) | Space: O(n)
 */
function minimumOperationsClean(nums: number[], k: number): number {
  // If min(nums) < k → impossible
  if (Math.min(...nums) < k) return -1;
  // Count distinct values strictly above k
  return new Set(nums.filter((n) => n > k)).size;
}

// === Test Cases ===
console.log(minimumOperationsToMakeArrayValuesEqualToK([5, 2, 5, 4, 5], 2)); // 2
console.log(minimumOperationsToMakeArrayValuesEqualToK([2, 1, 2], 2)); // -1
console.log(minimumOperationsToMakeArrayValuesEqualToK([3, 3, 3], 3)); // 0
console.log(minimumOperationsToMakeArrayValuesEqualToK([1], 1)); // 0
console.log(minimumOperationsToMakeArrayValuesEqualToK([9, 7, 5, 3], 1)); // 4
```

---

## 🔗 Related Problems

- [Reduction Operations to Make the Array Elements Equal](https://leetcode.com/problems/reduction-operations-to-make-the-array-elements-equal) — same pattern: count distinct levels
- [Minimum Number of Operations to Make Array Empty](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-empty) — operations to reduce to target
- [Minimum Operations to Reduce X to Zero](https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero) — operations with constraint
- [Minimum Operations to Make Array Values Equal to K — LeetCode](https://leetcode.com/problems/minimum-operations-to-make-array-values-equal-to-k) — problem page
