---
layout: page
title: "Minimum Absolute Difference"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Sorting]
leetcode_url: "https://leetcode.com/problems/minimum-absolute-difference"
---

# Minimum Absolute Difference / Hiệu Tuyệt Đối Nhỏ Nhất

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) | [4Sum](https://leetcode.com/problems/4sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Muốn tìm hai người có chiều cao gần nhau nhất trong một hàng dài — thay vì so sánh mọi cặp, hãy sắp xếp hàng trước: người gần nhau nhất sẽ đứng cạnh nhau.

**Pattern Recognition:**

- Signal: "all pairs with minimum difference" → **Sort + adjacent scan**
- Sau khi sort, hiệu nhỏ nhất luôn xảy ra giữa các phần tử liền kề
- Key insight: `|arr[i] - arr[j]|` nhỏ nhất khi i, j liền kề trong mảng đã sort

**Visual — arr = [4, 2, 1, 3]:**

```
Unsorted: [4, 2, 1, 3]
Sorted:   [1, 2, 3, 4]
           ↑  ↑  ↑  ↑
Gaps:       1  1  1   ← scan adjacent pairs

minDiff = 1
Pairs:   (1,2), (2,3), (3,4)  → all qualify
```

---

## Problem Description

Cho mảng số nguyên `arr`, tìm **hiệu tuyệt đối nhỏ nhất** giữa mọi cặp phần tử, rồi trả về tất cả các cặp có hiệu đó. ([LeetCode](https://leetcode.com/problems/minimum-absolute-difference))

Difficulty: Easy | Acceptance: 70.7%

- `arr = [4,2,1,3]` → `[[1,2],[2,3],[3,4]]`
- `arr = [1,3,6,10,15]` → `[[1,3]]` (min diff = 2)
- `arr = [3,8,-10,23,19,-4,-14,27]` → `[[-14,-10],[19,23],[23,27]]`

Constraints: `2 <= arr.length <= 10^5`, `-10^6 <= arr[i] <= 10^6`

---

## 📝 Interview Tips

1. **Clarify**: "Kết quả cần sorted theo phần tử đầu tiên không?" / Should output pairs be sorted?
2. **Brute force**: "So sánh mọi cặp O(n²), tìm min rồi collect" / O(n²) all pairs then collect
3. **Key insight**: "Sort → min diff chỉ ở adjacent pairs — O(n log n)" / After sort, only check neighbors
4. **Two-pass**: "Pass 1: tìm minDiff; Pass 2: thu thập cặp có diff = minDiff" / Find min then collect
5. **Edge cases**: "Duplicate elements → diff = 0, pair xuất hiện nhiều" / Duplicates give diff 0
6. **Follow-up**: "Tìm cặp trong hai mảng khác nhau?" / Min difference across two different arrays

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — All Pairs
 * Time: O(n²) — nested loops
 * Space: O(1) — excluding output
 */
function minimumAbsoluteDifferenceBrute(arr: number[]): number[][] {
  let minDiff = Infinity;
  const n = arr.length;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) minDiff = Math.min(minDiff, Math.abs(arr[i] - arr[j]));
  const result: number[][] = [];
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      if (Math.abs(arr[i] - arr[j]) === minDiff)
        result.push([Math.min(arr[i], arr[j]), Math.max(arr[i], arr[j])]);
  return result;
}

/**
 * Solution 2: Sort + Adjacent Scan
 * Time: O(n log n) — sort dominates
 * Space: O(1) — excluding output
 */
function minimumAbsoluteDifference(arr: number[]): number[][] {
  arr.sort((a, b) => a - b);
  // Pass 1: find minimum difference between adjacent elements
  let minDiff = Infinity;
  for (let i = 1; i < arr.length; i++) minDiff = Math.min(minDiff, arr[i] - arr[i - 1]);
  // Pass 2: collect all adjacent pairs with that diff
  const result: number[][] = [];
  for (let i = 1; i < arr.length; i++)
    if (arr[i] - arr[i - 1] === minDiff) result.push([arr[i - 1], arr[i]]);
  return result;
}

// === Test Cases ===
console.log(minimumAbsoluteDifference([4, 2, 1, 3]));
// [[1,2],[2,3],[3,4]]
console.log(minimumAbsoluteDifference([1, 3, 6, 10, 15]));
// [[1,3]]
console.log(minimumAbsoluteDifference([3, 8, -10, 23, 19, -4, -14, 27]));
// [[-14,-10],[19,23],[23,27]]
```

---

## 🔗 Related Problems

- [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) — sort/partition based selection
- [4Sum](https://leetcode.com/problems/4sum) — sort + multi-pointer
- [Closest Number in Sorted Array](https://leetcode.com/problems/find-closest-number-to-zero) — adjacent comparison after sort
- [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling) — sort by endpoint + binary search
- [Minimum Absolute Difference — LeetCode](https://leetcode.com/problems/minimum-absolute-difference) — problem page
