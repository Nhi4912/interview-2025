---
layout: page
title: "Find Occurrences of an Element in an Array"
difficulty: Medium
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/find-occurrences-of-an-element-in-an-array"
---

# Find Occurrences of an Element in an Array / Tìm Lần Xuất Hiện Thứ K Của Phần Tử

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Index Collection + Query
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Tưởng tượng bạn có danh sách tên học sinh và muốn tìm "học sinh tên An xuất hiện lần thứ 3 tại vị trí nào". Bạn chỉ cần **một lần duyệt** để ghi lại tất cả chỉ số có tên An, sau đó với mỗi truy vấn `queries[j]`, trả về chỉ số thứ `queries[j]-1` trong danh sách (hoặc -1 nếu không đủ).

**Pattern Recognition:**

- Tiền xử lý: thu thập tất cả indices có `nums[i] == x` vào mảng `positions`
- Mỗi query `q`: trả về `positions[q-1]` nếu `q-1 < positions.length`, else `-1`
- O(n) build + O(1) per query

**Visual:**

```
nums=[1,3,1,7], queries=[1,3,2,4], x=1

Scan: positions = [0, 2]  (indices where nums[i]=1)

Query q=1: positions[0] = 0  ✅
Query q=3: 3-1=2 ≥ positions.length=2 → -1
Query q=2: positions[1] = 2  ✅
Query q=4: 4-1=3 ≥ 2 → -1

Output: [0, -1, 2, -1]
```

## Problem Description

Given a 0-indexed integer array `nums`, integer `x`, and integer array `queries`. For each `queries[i]`, find the index of the `queries[i]`-th occurrence of `x` in `nums`. Return an array of answers, where answer is `-1` if the occurrence doesn't exist.

**Example 1:** `nums=[1,3,1,7], queries=[1,3,2,4], x=1` → `[0,-1,2,-1]`

**Example 2:** `nums=[1,2,3], queries=[10], x=5` → `[-1]`

**Constraints:** `1 <= nums.length, queries.length <= 100`, `1 <= nums[i], queries[i], x <= 100`.

## 📝 Interview Tips

1. **Clarify**: queries[i] là thứ tự (1-indexed) hay index (0-indexed)? — 1-indexed ordinal (1st, 2nd, 3rd occurrence).
2. **Approach**: Collect all occurrence indices in one pass, then answer each query in O(1).
3. **Edge cases**: x không có trong nums → all queries return -1; query > total occurrences → -1.
4. **Optimize**: This is already optimal O(n + q) — can't avoid scanning nums at least once.
5. **Test**: `nums=[5,5,5], queries=[1,2,3,4], x=5` → `[0,1,2,-1]`.
6. **Follow-up**: If queries arrive online (streaming)? — Binary search on sorted positions array for each query.

## Solutions

```typescript
/** Solution 1: Brute Force — scan nums for each query
 * Time: O(n * q) | Space: O(1)
 */
function occurrencesOfElement1(nums: number[], queries: number[], x: number): number[] {
  return queries.map((q) => {
    let count = 0;
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] === x && ++count === q) return i;
    }
    return -1;
  });
}

/** Solution 2: Precompute indices array — O(n + q) optimal
 * Time: O(n + q) | Space: O(occurrences)
 */
function occurrencesOfElement(nums: number[], queries: number[], x: number): number[] {
  // Collect all positions where nums[i] == x
  const positions: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === x) positions.push(i);
  }

  // Answer each query: q-th occurrence (1-indexed) → positions[q-1]
  return queries.map((q) => (q <= positions.length ? positions[q - 1] : -1));
}

/** Solution 3: Hash Map of indices — generalized for multiple x values
 * Time: O(n + q) | Space: O(n)
 */
function occurrencesOfElement3(nums: number[], queries: number[], x: number): number[] {
  const indexMap = new Map<number, number[]>();
  for (let i = 0; i < nums.length; i++) {
    if (!indexMap.has(nums[i])) indexMap.set(nums[i], []);
    indexMap.get(nums[i])!.push(i);
  }

  const positions = indexMap.get(x) ?? [];
  return queries.map((q) => (q - 1 < positions.length ? positions[q - 1] : -1));
}

// Test cases
console.log(occurrencesOfElement([1, 3, 1, 7], [1, 3, 2, 4], 1)); // [0, -1, 2, -1]
console.log(occurrencesOfElement([1, 2, 3], [10], 5)); // [-1]
console.log(occurrencesOfElement([5, 5, 5], [1, 2, 3, 4], 5)); // [0, 1, 2, -1]
console.log(occurrencesOfElement([1, 1, 1, 1, 1], [1, 5], 1)); // [0, 4]
console.log(occurrencesOfElement1([1, 3, 1, 7], [1, 3, 2, 4], 1)); // [0, -1, 2, -1]
console.log(occurrencesOfElement3([1, 3, 1, 7], [1, 3, 2, 4], 1)); // [0, -1, 2, -1]
```

## 🔗 Related Problems

| Problem                                                                                                                                          | Relationship                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| [Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array) | Find boundary occurrences using binary search          |
| [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array)                                                 | k-th occurrence pattern with ordering                  |
| [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k)                                                                     | Prefix sum with index collection for efficient queries |
