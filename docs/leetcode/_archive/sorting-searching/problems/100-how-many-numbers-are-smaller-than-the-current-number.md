---
layout: page
title: "How Many Numbers Are Smaller Than the Current Number"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Hash Table, Sorting, Counting Sort]
leetcode_url: "https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number"
---

# How Many Numbers Are Smaller Than the Current Number / Đếm Số Phần Tử Nhỏ Hơn Phần Tử Hiện Tại

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sorting + Prefix Count
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Giống bảng xếp hạng học sinh — sau khi sắp xếp điểm từ thấp đến cao, **vị trí đầu tiên** xuất hiện của mỗi điểm chính là số học sinh đạt điểm thấp hơn. Không cần đếm từng người!

**Pattern Recognition:**

- "How many smaller" + array → Sort, then first-occurrence index = rank
- Values ≤ 100 → Counting sort O(n) is possible
- Brute force O(n²) → Optimize to O(n log n) via sort + hash map

**Visual:**

```
nums = [8, 1, 2, 2, 3]
Sort:  [1, 2, 2, 3, 8]
Index:  0  1  2  3  4

Map first-occurrence: { 1→0, 2→1, 3→3, 8→4 }

8 → rank[8] = 4   (four numbers smaller)
1 → rank[1] = 0   (zero numbers smaller)
2 → rank[2] = 1   (one number smaller)
Result: [4, 0, 1, 1, 3] ✅
```

## Problem Description

Given array `nums`, for each `nums[i]` return how many numbers in the array are **strictly smaller** than it. Constraints: `2 ≤ nums.length ≤ 500`, `0 ≤ nums[i] ≤ 100`.

**Example 1:** `nums = [8,1,2,2,3]` → `[4,0,1,1,3]`
**Example 2:** `nums = [6,5,4,8]` → `[2,1,0,3]`

## 📝 Interview Tips

1. **Clarify**: Strictly smaller hay ≤? Duplicates được tính thế nào? / Strictly smaller or ≤? How are duplicates counted?
2. **Approach**: Sort + first-occurrence index cho O(n log n); values ≤ 100 → dùng counting sort O(n) / Sort or count
3. **Edge cases**: Tất cả bằng nhau → toàn 0; giá trị = 0 → đặc biệt trong counting / All equal → all zeros
4. **Optimize**: Counting sort là O(n + M) — gần như O(n) với M = 101 / Near-linear with counting sort
5. **Test**: `[8,1,2,2,3]` → `[4,0,1,1,3]`; `[7,7,7,7]` → `[0,0,0,0]` / Always test duplicates
6. **Follow-up**: Nếu values lên tới 10^9? → nén tọa độ (coordinate compression) / Large values need coord compression

## Solutions

```typescript
/** Solution 1: Sort + Hash Map — first-occurrence index = rank
 * Time: O(n log n) | Space: O(n)
 */
function smallerNumbersThanCurrent1(nums: number[]): number[] {
  const sorted = [...nums].sort((a, b) => a - b);
  const rank = new Map<number, number>();
  for (let i = 0; i < sorted.length; i++) {
    if (!rank.has(sorted[i])) rank.set(sorted[i], i);
  }
  return nums.map((n) => rank.get(n)!);
}

/** Solution 2: Counting Sort — optimal when values ≤ 100
 * Time: O(n + M) | Space: O(M) where M = 101
 */
function smallerNumbersThanCurrent2(nums: number[]): number[] {
  const count = new Array(102).fill(0);
  for (const n of nums) count[n]++;
  // Build prefix sum: count[v] = how many numbers are < v
  for (let i = 1; i <= 101; i++) count[i] += count[i - 1];
  return nums.map((n) => (n === 0 ? 0 : count[n - 1]));
}

/** Solution 3: Brute Force — for reference
 * Time: O(n²) | Space: O(1) extra
 */
function smallerNumbersThanCurrentBrute(nums: number[]): number[] {
  return nums.map((cur) => nums.filter((x) => x < cur).length);
}

// Test cases
console.log(smallerNumbersThanCurrent1([8, 1, 2, 2, 3])); // [4, 0, 1, 1, 3]
console.log(smallerNumbersThanCurrent2([8, 1, 2, 2, 3])); // [4, 0, 1, 1, 3]
console.log(smallerNumbersThanCurrent1([6, 5, 4, 8])); // [2, 1, 0, 3]
console.log(smallerNumbersThanCurrent2([7, 7, 7, 7])); // [0, 0, 0, 0]
console.log(smallerNumbersThanCurrentBrute([0, 100])); // [0, 1]
```

## 🔗 Related Problems

| Problem                                                                                                  | Relationship                                      |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| [Relative Sort Array](https://leetcode.com/problems/relative-sort-array)                                 | Sort by custom rank mapping                       |
| [Rank Transform of an Array](https://leetcode.com/problems/rank-transform-of-an-array)                   | Nearly identical — assign rank by sorted position |
| [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self) | Harder variant: only count elements to the right  |
