---
layout: page
title: "Sort Colors"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Sorting]
leetcode_url: "https://leetcode.com/problems/sort-colors/"
---

# Sort Colors / Sắp Xếp Màu Sắc

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dutch National Flag (3-way partition)
> **Frequency**: ⭐ Tier 2 — Dutch Flag pattern xuất hiện nhiều trong partition / 3-way split
> **See also**: [Merge Sorted Array](./01-merge-sorted-array.md) | [Search in Rotated Array](./03-search-in-rotated-sorted-array.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang sắp xếp bi thủy tinh màu đỏ (0), trắng (1), xanh (2) vào ba nhóm chỉ bằng một lần duyệt. Bạn dùng ba "lằn ranh": tất cả bên trái `low` là đỏ đã sắp, tất cả bên phải `high` là xanh đã sắp, vùng giữa `mid↔high` chưa xét. Cứ xem bi tại `mid`: đỏ thì trao đổi với `low`; xanh thì trao đổi với `high`; trắng thì giữ nguyên.

**Pattern Recognition:**

- Signal: sort 3 categories in-place, 1 pass → **Dutch National Flag** (Dijkstra)
- 3 pointers: `low` (0-boundary), `mid` (current), `high` (2-boundary)
- Invariant: `nums[0..low-1]=0`, `nums[low..mid-1]=1`, `nums[high+1..n-1]=2`
- Khi swap với `high`: không tăng `mid` vì chưa biết phần tử vừa swap về

**Visual — nums=[2,0,2,1,1,0]:**

```
Initial: [2,0,2,1,1,0]  low=0, mid=0, high=5

mid=0: nums[0]=2 → swap(mid,high) → [0,0,2,1,1,2]  high=4
mid=0: nums[0]=0 → swap(low,mid) → [0,0,2,1,1,2]   low=1,mid=1
mid=1: nums[1]=0 → swap(low,mid) → [0,0,2,1,1,2]   low=2,mid=2
mid=2: nums[2]=2 → swap(mid,high)→ [0,0,1,1,2,2]   high=3
mid=2: nums[2]=1 → mid++         → mid=3
mid=3: nums[3]=1 → mid++         → mid=4 > high=3  ✅ done
Result: [0,0,1,1,2,2]
```

---

## Problem Description

Given array `nums` of 0s (red), 1s (white), 2s (blue), sort **in-place** without using library sort. Objects of same color must be adjacent in order: red, white, blue.

```
Example 1: nums=[2,0,2,1,1,0]  → [0,0,1,1,2,2]
Example 2: nums=[2,0,1]        → [0,1,2]
Example 3: nums=[1]            → [1]
```

Constraints: `1 <= n <= 300`, `nums[i]` ∈ {0,1,2}

---

## 📝 Interview Tips

1. **Counting Sort** là brute force hợp lệ (2 passes), nhưng interviewer muốn nghe **1 pass in-place**
2. **Tại sao không tăng `mid` khi swap với `high`?** Phần tử từ `high` về chưa được xét — có thể là 0 cần swap tiếp
3. **Tại sao tăng `mid` khi swap với `low`?** `low` chỉ chứa 0 hoặc 1 đã xét — an toàn để tiến
4. **Invariant** quan trọng: nói được 3 vùng và bất biến → interviewer rất ấn tượng
5. **Follow-up**: "4 màu thì sao?" → 2 lần Dutch Flag, hoặc counting sort O(n)
6. **Đặt tên rõ ràng**: gọi `low`, `mid`, `high` thay vì `i`, `j`, `k` để code tự giải thích

---

## Solutions

```typescript
/**
 * Solution 1: Counting Sort (2 passes)
 * Time O(n), Space O(1) — simple but two passes
 */
function sortColorsCounting(nums: number[]): void {
  const count = [0, 0, 0];
  for (const n of nums) count[n]++;
  let i = 0;
  for (let color = 0; color <= 2; color++) {
    for (let j = 0; j < count[color]; j++) nums[i++] = color;
  }
}

/**
 * Solution 2: Dutch National Flag — 1 pass in-place (Optimal)
 * Time O(n), Space O(1)
 *
 * Invariant at each step:
 *   nums[0..low-1] = 0 (red, finalized)
 *   nums[low..mid-1] = 1 (white, finalized)
 *   nums[mid..high] = ? (unprocessed)
 *   nums[high+1..n-1] = 2 (blue, finalized)
 */
function sortColors(nums: number[]): void {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++; // nums[low] was 1 (already seen), safe to advance
    } else if (nums[mid] === 1) {
      mid++; // already in correct zone
    } else {
      // nums[mid] === 2
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--; // DON'T advance mid — swapped element is unseen
    }
  }
}

// --- Quick inline tests ---
const a1 = [2, 0, 2, 1, 1, 0];
sortColors(a1);
console.log(JSON.stringify(a1) === "[0,0,1,1,2,2]"); // true
const a2 = [2, 0, 1];
sortColors(a2);
console.log(JSON.stringify(a2) === "[0,1,2]"); // true
const a3 = [1];
sortColors(a3);
console.log(JSON.stringify(a3) === "[1]"); // true
const a4 = [0, 0, 0];
sortColors(a4);
console.log(JSON.stringify(a4) === "[0,0,0]"); // true
```

---

## 🔗 Related Problems

| Problem                                                                                      | Relationship                          |
| -------------------------------------------------------------------------------------------- | ------------------------------------- |
| [75. Sort Colors](https://leetcode.com/problems/sort-colors/)                                | This problem                          |
| [283. Move Zeroes](https://leetcode.com/problems/move-zeroes/)                               | 2-way partition, simpler Dutch Flag   |
| [905. Sort Array By Parity](https://leetcode.com/problems/sort-array-by-parity/)             | 2-way partition (even/odd)            |
| [215. Kth Largest Element](https://leetcode.com/problems/kth-largest-element-in-an-array/)   | QuickSelect uses same partition logic |
| [4. Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) | Hard follow-up on partition concepts  |
