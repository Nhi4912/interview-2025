---
layout: page
title: "K-diff Pairs in an Array"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Two Pointers, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/k-diff-pairs-in-an-array"
---

# K-diff Pairs in an Array / Các Cặp Hiệu K Trong Mảng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Set / Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Giống đếm số cặp học sinh có **chênh lệch điểm đúng bằng k**. Cách nhanh nhất: dùng bảng tra cứu — với mỗi điểm `x`, kiểm tra xem `x+k` có tồn tại không. Đối với k=0, cần ít nhất 2 người có cùng điểm. Cặp là **tập hợp** (unordered, unique) nên không đếm trùng.

**Pattern Recognition:**

- "Count unique pairs with |a-b| = k" → Hash Set or Two Pointers on sorted array
- k=0 special case: need elements with frequency ≥ 2
- k<0 is always 0 (absolute difference can't be negative)

**Visual:**

```
nums=[3,1,4,1,5], k=2

k > 0: for each unique x, check if x+k exists
  Unique: {1,3,4,5}
  x=1: 1+2=3 ✓ → pair (1,3)
  x=3: 3+2=5 ✓ → pair (3,5)
  x=4: 4+2=6 ✗
  x=5: 5+2=7 ✗
  Answer: 2 ✅

Two Pointers (sorted=[1,1,3,4,5]):
  L=0,R=1: |1-1|=0 < 2 → R++
  L=0,R=2: |3-1|=2 ✓, count=1, L++
  L=1,R=2: |3-1|=2, but same pair as before after dedup → skip, L++
  ...
```

## Problem Description

Given integer array `nums` and integer `k`, return the number of **unique** k-diff pairs `(nums[i], nums[j])` where `i ≠ j` and `|nums[i] - nums[j]| = k`. A pair `(a,b)` and `(b,a)` count as one. `-10^8 ≤ nums[i] ≤ 10^8`, `0 ≤ k ≤ 10^8`.

**Example 1:** `nums=[3,1,4,1,5]`, `k=2` → `2` (pairs: (1,3), (3,5))
**Example 2:** `nums=[1,2,3,4,5]`, `k=1` → `4` (pairs: (1,2),(2,3),(3,4),(4,5))
**Example 3:** `nums=[1,3,1,5,4]`, `k=0` → `1` (pair: (1,1))

## 📝 Interview Tips

1. **Clarify**: k=0 nghĩa là tìm duplicate? Cặp có thứ tự hay không thứ tự? / k=0 means find duplicates; pairs are unordered
2. **Approach**: Hash Set: O(n) time. Two Pointers: O(n log n) nhưng dễ giải thích / Hash set is faster; two pointers easier to explain
3. **Edge cases**: k<0 → return 0; k=0 → count values with freq≥2; empty array / Negative k impossible
4. **Optimize**: Hash set approach O(n); avoid counting same pair twice by only checking x+k / One-directional check prevents duplicates
5. **Test**: `[1,1,1,1]`, k=0 → 1 (only one unique pair (1,1)); `[1,1]`, k=2 → 0 / Test k=0 with many duplicates
6. **Follow-up**: Nếu cần liệt kê tất cả các cặp? / What if you need to list all pairs, not just count?

## Solutions

```typescript
/** Solution 1: Hash Set — O(n) time, handles all k cases cleanly
 * Time: O(n) | Space: O(n)
 */
function findPairs1(nums: number[], k: number): number {
  if (k < 0) return 0;

  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

  let count = 0;
  for (const [num] of freq) {
    if (k === 0) {
      // Pair (num, num): need frequency >= 2
      if (freq.get(num)! >= 2) count++;
    } else {
      // Pair (num, num+k): check if num+k exists
      if (freq.has(num + k)) count++;
    }
  }
  return count;
}

/** Solution 2: Two Pointers on sorted array
 * Time: O(n log n) | Space: O(1) extra (or O(n) for sort copy)
 */
function findPairs2(nums: number[], k: number): number {
  if (k < 0) return 0;

  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  // For k=0, we need freq check; for k>0 use two distinct pointers

  if (k === 0) {
    const freq = new Map<number, number>();
    for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);
    let cnt = 0;
    for (const [, f] of freq) if (f >= 2) cnt++;
    return cnt;
  }

  // k > 0: sorted unique values, find pairs with diff = k
  const uniq = [...new Set(nums)].sort((a, b) => a - b);
  let lo = 0,
    hi = 1,
    count = 0;
  while (hi < uniq.length) {
    const diff = uniq[hi] - uniq[lo];
    if (diff === k) {
      count++;
      lo++;
      hi++;
    } else if (diff < k) {
      hi++;
    } else {
      lo++;
      if (lo === hi) hi++;
    }
  }
  return count;
}

/** Solution 3: Brute Force — for reference
 * Time: O(n²) | Space: O(n)
 */
function findPairsBrute(nums: number[], k: number): number {
  if (k < 0) return 0;
  const pairs = new Set<string>();
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (Math.abs(nums[i] - nums[j]) === k) {
        const a = Math.min(nums[i], nums[j]);
        const b = Math.max(nums[i], nums[j]);
        pairs.add(`${a},${b}`);
      }
    }
  }
  return pairs.size;
}

// Test cases
console.log(findPairs1([3, 1, 4, 1, 5], 2)); // 2
console.log(findPairs2([3, 1, 4, 1, 5], 2)); // 2
console.log(findPairs1([1, 2, 3, 4, 5], 1)); // 4
console.log(findPairs1([1, 3, 1, 5, 4], 0)); // 1
console.log(findPairsBrute([3, 1, 4, 1, 5], 2)); // 2
console.log(findPairs1([1, 1, 1, 1], 0)); // 1
```

## 🔗 Related Problems

| Problem                                                                                      | Relationship                                               |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [Two Sum](https://leetcode.com/problems/two-sum)                                             | Find pairs with target sum; hash map pattern               |
| [3Sum](https://leetcode.com/problems/3sum)                                                   | Count/list triplets with zero sum; two pointers after sort |
| [Intersection of Two Arrays II](https://leetcode.com/problems/intersection-of-two-arrays-ii) | Count matching pairs across two arrays                     |
