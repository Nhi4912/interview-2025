---
layout: page
title: "Convert an Array Into a 2D Array With Conditions"
difficulty: Medium
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/convert-an-array-into-a-2d-array-with-conditions"
---

# Convert an Array Into a 2D Array With Conditions / Chuyển Mảng Thành Mảng 2D Theo Điều Kiện

> **Difficulty**: 🟡 Medium | **Category**: Array | **Pattern**: Greedy + Hash Map Bucketing

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Như phân loại sinh viên vào các phòng thi — mỗi phòng không được có hai thí sinh trùng tên. Mỗi sinh viên vào phòng đầu tiên chưa có người cùng tên.

**Pattern Recognition:**

- Each row must have distinct elements → frequency determines min rows needed
- Greedy: assign each element to the first row that doesn't already contain it
- Answer rows = max frequency of any element

**Visual:**

```
nums = [1,3,4,1,2,3,1]
freq: 1→3, 3→2, 4→1, 2→1

Process each num:
1 → row[0] (no 1 yet)        rows=[[1]]
3 → row[0] (no 3 yet)        rows=[[1,3]]
4 → row[0] (no 4 yet)        rows=[[1,3,4]]
1 → row[1] (1 in row[0])     rows=[[1,3,4],[1]]
2 → row[0] (no 2 yet)        rows=[[1,3,4,2],[1]]
3 → row[1] (3 in row[0])     rows=[[1,3,4,2],[1,3]]
1 → row[2] (1 in 0,1)        rows=[[1,3,4,2],[1,3],[1]]
```

## Problem Description

Given a 0-indexed integer array `nums`, convert it to a 2D array where each row contains only distinct integers. Use a minimum number of rows. The order within rows doesn't matter, but each element of `nums` must appear exactly once.

**Example 1:** `nums = [1,3,4,1,2,3,1]` → `[[1,3,4,2],[1,3],[1]]`
**Example 2:** `nums = [1,2,3,4]` → `[[1,2,3,4]]`

**Constraints:** `1 ≤ nums.length ≤ 200`, `1 ≤ nums[i] ≤ nums.length`

## 📝 Interview Tips

1. **Clarify**: Can rows have different lengths? (Yes — fill greedily)
2. **Approach**: Track how many times each number has appeared = its row index
3. **Edge cases**: All identical elements → one per row; all distinct → single row
4. **Optimize**: Use count map to directly index which row to append to
5. **Follow-up**: Minimize total rows while also minimizing longest row?
6. **Complexity**: Time O(n), Space O(n)

## Solutions

```typescript
// Solution 1: Greedy with frequency count — Time: O(n) | Space: O(n)
function findMatrix(nums: number[]): number[][] {
  const result: number[][] = [];
  const count = new Map<number, number>();

  for (const num of nums) {
    const freq = count.get(num) ?? 0;
    // The num's occurrence count tells us which row index to use
    if (freq >= result.length) {
      result.push([]);
    }
    result[freq].push(num);
    count.set(num, freq + 1);
  }

  return result;
}

// Solution 2: Row-set approach (explicit uniqueness check) — Time: O(n^2) | Space: O(n)
function findMatrix2(nums: number[]): number[][] {
  const rows: number[][] = [];
  const rowSets: Set<number>[] = [];

  for (const num of nums) {
    let placed = false;
    for (let i = 0; i < rows.length; i++) {
      if (!rowSets[i].has(num)) {
        rows[i].push(num);
        rowSets[i].add(num);
        placed = true;
        break;
      }
    }
    if (!placed) {
      rows.push([num]);
      rowSets.push(new Set([num]));
    }
  }

  return rows;
}

// Solution 3: One-liner using reduce — Time: O(n) | Space: O(n)
function findMatrix3(nums: number[]): number[][] {
  const freq = new Map<number, number>();
  const res: number[][] = [];
  for (const n of nums) {
    const r = freq.get(n) ?? 0;
    if (r === res.length) res.push([]);
    res[r].push(n);
    freq.set(n, r + 1);
  }
  return res;
}

// Tests
console.log(findMatrix([1, 3, 4, 1, 2, 3, 1])); // [[1,3,4,2],[1,3],[1]]
console.log(findMatrix([1, 2, 3, 4])); // [[1,2,3,4]]
console.log(findMatrix([1, 1, 1])); // [[1],[1],[1]]
console.log(findMatrix2([1, 3, 4, 1, 2, 3, 1])); // [[1,3,4,2],[1,3],[1]]
console.log(findMatrix3([2, 1, 2, 1, 2])); // [[2,1],[2,1],[2]]
```

## 🔗 Related Problems

| Problem                                                                                                    | Relationship                            |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [Group Anagrams (LeetCode 49)](https://leetcode.com/problems/group-anagrams/)                              | Group elements by property into buckets |
| [Find Duplicate Number (LeetCode 287)](https://leetcode.com/problems/find-the-duplicate-number/)           | Frequency tracking in arrays            |
| [Longest Consecutive Sequence (LeetCode 128)](https://leetcode.com/problems/longest-consecutive-sequence/) | Hash map for array element analysis     |
