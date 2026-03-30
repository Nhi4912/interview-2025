---
layout: page
title: "Intersection of Two Arrays II"
difficulty: Easy
category: Array
tags: [Array, Two Pointers, Hash Table, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/intersection-of-two-arrays-ii/"
---

# Intersection of Two Arrays II / Giao Của Hai Mảng II

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map / Two Pointers  
> **Frequency**: 📘 Tier 3 — Hash map fundamentals, follow-up questions common  
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Contains Duplicate](05-contains-duplicate.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Bạn có hai danh sách hàng mua sắm. Muốn tìm các mặt hàng có trong cả hai danh sách, kể cả số lượng. Đếm tần suất từng mặt hàng ở danh sách 1, rồi đi qua danh sách 2: mỗi mặt hàng tìm được → lấy, giảm số đếm đi 1. Đây là bài tìm giao tập **có tính số lần xuất hiện**.

- **Pattern Recognition:**
  - "Intersection with duplicates" → **frequency map** (not Set — Set loses count)
  - Nếu mảng đã sắp xếp → **Two Pointers** (O(1) extra space)
  - Một mảng nhỏ, một mảng rất lớn → dùng mảng nhỏ cho map, tiết kiệm bộ nhớ

- **Visual — Hash Map Approach:**

```
nums1 = [1, 2, 2, 1],  nums2 = [2, 2]

Step 1: Count nums1 → freq = {1:2, 2:2}

Step 2: Walk nums2:
  2 → freq[2]=2 > 0 → result=[2], freq={1:2, 2:1}
  2 → freq[2]=1 > 0 → result=[2,2], freq={1:2, 2:0}

Output: [2, 2]  ✓

Two Pointers (sorted):
  nums1 sorted: [1,1,2,2]
  nums2 sorted: [2,2]
  i=0,j=0: 1<2 → i++
  i=1,j=0: 1<2 → i++
  i=2,j=0: 2=2 → result=[2], i++, j++
  i=3,j=1: 2=2 → result=[2,2], done ✓
```

## Problem Description

Given two arrays `nums1` and `nums2`, return their intersection where each element appears **as many times as it shows in both arrays**.

```
Input:  nums1=[1,2,2,1], nums2=[2,2]      → [2,2]
Input:  nums1=[4,9,5],   nums2=[9,4,9,8,4] → [4,9] (any order)
Input:  nums1=[1,2,3],   nums2=[4,5,6]     → []
```

## 📝 Interview Tips

1. **Phân biệt với Intersection I**: Bài I dùng Set → unique; Bài II cần đếm tần suất → Map / **vs Part I**: Set loses frequency; Map preserves counts
2. **Tối ưu space**: Dùng mảng ngắn hơn cho map → tiết kiệm bộ nhớ / **Optimization**: build map on smaller array — mention this proactively
3. **Follow-up — nếu đã sắp xếp?**: Two Pointers, O(1) extra space — không cần map / **If sorted**: two pointers saves space entirely
4. **Follow-up — một mảng không vừa RAM?**: External merge sort hoặc stream từng chunk / **If nums2 too large**: chunk it, hash map stays small (nums1 in memory)
5. **Sai lầm phổ biến**: Dùng Set thay Map → mất thông tin số lần xuất hiện / **Trap**: `new Set()` loses frequency — use Map with counts
6. **Output thứ tự**: Bài không yêu cầu thứ tự cụ thể → chỉ cần phần tử và số lượng đúng / **Order**: result can be in any order — clarify with interviewer

## Solutions

{% raw %}
/\*\*

- Solution 1: Hash Map — Optimal for unsorted input
- Time: O(n + m) | Space: O(min(n, m))
  \*/
  function intersect(nums1: number[], nums2: number[]): number[] {
  // Use smaller array for map to minimize space
  if (nums1.length > nums2.length) return intersect(nums2, nums1);

const freq = new Map<number, number>();
for (const n of nums1) freq.set(n, (freq.get(n) ?? 0) + 1);

const result: number[] = [];
for (const n of nums2) {
const count = freq.get(n) ?? 0;
if (count > 0) {
result.push(n);
freq.set(n, count - 1);
}
}

return result;
}

/\*\*

- Solution 2: Sort + Two Pointers — O(1) extra space (if mutation allowed)
- Time: O(n log n + m log m) | Space: O(1)
  \*/
  function intersectSort(nums1: number[], nums2: number[]): number[] {
  nums1.sort((a, b) => a - b);
  nums2.sort((a, b) => a - b);

const result: number[] = [];
let i = 0, j = 0;

while (i < nums1.length && j < nums2.length) {
if (nums1[i] === nums2[j]) { result.push(nums1[i]); i++; j++; }
else if (nums1[i] < nums2[j]) { i++; }
else { j++; }
}

return result;
}

// Inline tests
console.log(JSON.stringify(intersect([1,2,2,1],[2,2]).sort()) === '[2,2]'); // true
console.log(JSON.stringify(intersect([4,9,5],[9,4,9,8,4]).sort()) === '[4,9]'); // true
console.log(JSON.stringify(intersect([1,2,3],[4,5,6])) === '[]'); // true
console.log(JSON.stringify(intersect([1,1,1],[1,1]).sort()) === '[1,1]'); // true
{% endraw %}

## 🔗 Related Problems

| Problem                                                      | Relationship                                                             |
| ------------------------------------------------------------ | ------------------------------------------------------------------------ |
| [#05 Contains Duplicate](05-contains-duplicate.md)           | Frequency detection — same Map/Set tooling                               |
| [#04 Two Sum](04-two-sum.md)                                 | Hash map lookup pattern — building map on one array, querying with other |
| [#06 Single Number](06-single-number.md)                     | Complement: what if we want the element NOT in common                    |
| [#29 Top K Frequent Elements](29-top-k-frequent-elements.md) | Frequency map extended to ranking                                        |
| [#12 3Sum](12-3sum.md)                                       | Two-pointer on sorted arrays taken further                               |
