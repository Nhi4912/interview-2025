---
layout: page
title: "Make Lexicographically Smallest Array by Swapping Elements"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Union Find, Sorting]
leetcode_url: "https://leetcode.com/problems/make-lexicographically-smallest-array-by-swapping-elements"
---

# Make Lexicographically Smallest Array by Swapping Elements / Tạo Mảng Nhỏ Nhất Theo Thứ Tự Từ Điển Bằng Cách Hoán Đổi

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sorting + Group Assignment
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Giống nhóm học sinh được phép đổi chỗ cho nhau — nhưng chỉ khi điểm số của hai bạn **chênh nhau không quá limit**. Các bạn có thể "chuyền" giá trị qua nhau trong cùng một nhóm kết nối, vì A↔B và B↔C ngụ ý A↔C (qua trung gian). Bên trong mỗi nhóm, hoán vị tự do để xếp nhỏ nhất.

**Pattern Recognition:**

- Two elements can swap if `|a-b| ≤ limit`; transitive → connected groups
- Sort by value → consecutive elements within `limit` are in same group
- Within each group: sort values, sort original indices → assign sorted values to sorted positions

**Visual:**

```
nums = [1,5,3,9,8], limit = 2

Sort by value: [(1,0),(3,2),(5,1),(8,4),(9,3)]
  1→3: diff=2 ≤ 2 → same group
  3→5: diff=2 ≤ 2 → same group
  5→8: diff=3 > 2 → new group
  8→9: diff=1 ≤ 2 → same group

Groups: {0,1,2} with values {1,3,5}, {3,4} with values {8,9}

Group {0,1,2}: sort indices=[0,1,2], sort values=[1,3,5]
  → result[0]=1, result[1]=3, result[2]=5

Group {3,4}: sort indices=[3,4], sort values=[8,9]
  → result[3]=8, result[4]=9

Result: [1,3,5,8,9] ✅
```

## Problem Description

Given `nums[]` and integer `limit`, you may swap `nums[i]` and `nums[j]` any number of times if `|nums[i] - nums[j]| ≤ limit`. Return the **lexicographically smallest** array after any swaps. `1 ≤ nums.length ≤ 10^5`, `1 ≤ nums[i] ≤ 10^9`, `1 ≤ limit ≤ 10^9`.

**Example 1:** `nums=[1,5,3,9,8]`, `limit=2` → `[1,3,5,8,9]`
**Example 2:** `nums=[1,7,6,18,2,1]`, `limit=3` → `[1,6,7,2,1,18]`

## 📝 Interview Tips

1. **Clarify**: Hoán đổi bất kỳ số lần, chỉ cần |a-b| ≤ limit / Unlimited swaps, only constraint is value difference ≤ limit
2. **Approach**: Sort by value → group consecutive within limit → sort indices in group → assign sorted values / Sort-group-reassign
3. **Edge cases**: limit rất lớn → tất cả là một nhóm; mảng đã sorted / Large limit → one big group
4. **Optimize**: Không cần Union-Find thật sự — sort by value, group by gap > limit / No explicit UF needed
5. **Test**: Trace `[1,7,6,18,2,1]`, limit=3 — nhóm {1,7,6} không hoạt động vì 7-1=6>3 / Check grouping carefully
6. **Follow-up**: Nếu cần Union-Find thật sự? → standard UF with path compression / When would UF be cleaner?

## Solutions

```typescript
/** Solution 1: Sort by value, group by consecutive diff > limit, reassign
 * Time: O(n log n) | Space: O(n)
 */
function lexicographicallySmallestArray(nums: number[], limit: number): number[] {
  const n = nums.length;
  // Pair each value with its original index, sort by value
  const sorted = nums.map((v, i) => [v, i] as [number, number]);
  sorted.sort((a, b) => a[0] - b[0]);

  const result = new Array<number>(n);

  let i = 0;
  while (i < n) {
    // Find the group: consecutive elements where diff <= limit
    let j = i + 1;
    while (j < n && sorted[j][0] - sorted[j - 1][0] <= limit) j++;

    // Group is sorted[i..j-1]
    // Collect original indices, sort them
    const groupIndices = sorted.slice(i, j).map(([, idx]) => idx);
    groupIndices.sort((a, b) => a - b);

    // Values are already sorted (sorted[i..j-1][0])
    const groupValues = sorted.slice(i, j).map(([val]) => val);
    // groupValues is sorted ascending since sorted[] is sorted by value

    // Assign sorted values to sorted positions
    for (let k = 0; k < groupIndices.length; k++) {
      result[groupIndices[k]] = groupValues[k];
    }

    i = j;
  }

  return result;
}

/** Solution 2: Same approach, slightly more explicit
 * Time: O(n log n) | Space: O(n)
 */
function lexicographicallySmallestArray2(nums: number[], limit: number): number[] {
  const n = nums.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  indices.sort((a, b) => nums[a] - nums[b]);

  const result = new Array<number>(n);
  let start = 0;

  while (start < n) {
    let end = start + 1;
    while (end < n && nums[indices[end]] - nums[indices[end - 1]] <= limit) end++;

    const group = indices.slice(start, end);
    const sortedPositions = [...group].sort((a, b) => a - b);
    const sortedValues = group.map((i) => nums[i]); // already value-sorted

    for (let k = 0; k < group.length; k++) {
      result[sortedPositions[k]] = sortedValues[k];
    }
    start = end;
  }

  return result;
}

// Test cases
console.log(lexicographicallySmallestArray([1, 5, 3, 9, 8], 2)); // [1,3,5,8,9]
console.log(lexicographicallySmallestArray([1, 7, 6, 18, 2, 1], 3)); // [1,6,7,2,1,18]
console.log(lexicographicallySmallestArray2([1, 5, 3, 9, 8], 2)); // [1,3,5,8,9]
```

## 🔗 Related Problems

| Problem                                                                                                                    | Relationship                                           |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| [Smallest String With Swaps](https://leetcode.com/problems/smallest-string-with-swaps)                                     | Same pattern: group by connectivity, sort within group |
| [Accounts Merge](https://leetcode.com/problems/accounts-merge)                                                             | Union-Find to merge connected components               |
| [Sort Items by Groups Respecting Dependencies](https://leetcode.com/problems/sort-items-by-groups-respecting-dependencies) | Group-based sorting with constraints                   |
