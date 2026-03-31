---
layout: page
title: "Count of Smaller Numbers After Self"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Divide and Conquer, Binary Indexed Tree, Segment Tree]
leetcode_url: "https://leetcode.com/problems/count-of-smaller-numbers-after-self"
---

# Count of Smaller Numbers After Self / Đếm Số Nhỏ Hơn Phía Sau

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Indexed Tree (Fenwick Tree)
> **Frequency**: ⭐ Tier 1 — Kinh điển FAANG Hard, hay gặp ở Google, Amazon
> **See also**: [Count of Range Sum](https://leetcode.com/problems/count-of-range-sum) | [Reverse Pairs](https://leetcode.com/problems/reverse-pairs)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Đứng ở một cột trong hàng người theo chiều cao — muốn biết bao nhiêu người thấp hơn bạn đứng phía sau. BIT (Binary Indexed Tree) như một bảng đếm siêu nhanh: thêm một người vào bảng, truy vấn "bao nhiêu người thấp hơn X" trong O(log n). Duyệt từ phải sang trái: query trước, update sau.

**Pattern Recognition:**

- Signal: "count elements to the right smaller than current" → **BIT/Fenwick Tree** hoặc **Merge Sort**
- Coordinate compress values → map to [1..k] range cho BIT
- Duyệt từ phải sang trái: với nums[i], query BIT for sum[1..rank(nums[i])-1]

**Visual — nums=[5,2,6,1]:**

```
Compressed ranks: {1:1, 2:2, 5:3, 6:4}
Process right to left:

i=3, nums=1, rank=1: query(0)=0,  update(1) → result[3]=0, BIT={1:1}
i=2, nums=6, rank=4: query(3)=1,  update(4) → result[2]=1, BIT={1:1,4:1}
i=1, nums=2, rank=2: query(1)=1,  update(2) → result[1]=1, BIT={1:1,2:1,4:1}
i=0, nums=5, rank=3: query(2)=2,  update(3) → result[0]=2, BIT full

Output: [2,1,1,0] ✅
```

---

## Problem Description

Given integer array `nums`, return an array `counts` where `counts[i]` = the number of smaller elements to the right of `nums[i]`.

```
Example 1: nums=[5,2,6,1]  -> [2,1,1,0]
Example 2: nums=[-1]       -> [0]
Example 3: nums=[-1,-1]    -> [1,0]
```

---

## 📝 Interview Tips

1. **Coordinate Compression**: Values có thể âm/rất lớn → map sang [1..k] cho BIT
2. **BIT query(i)**: Trả về prefix sum [1..i] = số phần tử <= i đã insert
3. **Thứ tự**: Duyệt phải → trái, query TRƯỚC rồi update để không count chính mình
4. **Giải thích BIT**: "BIT là mảng tổng đoạn với bit manipulation để update/query O(log n)"
5. **Hỏi follow-up**: "Count larger elements?" → Cùng logic, query khác
6. **Complexity**: Time O(n log n), Space O(n) — tốt nhất có thể cho bài này

---

## Solutions

```typescript
/**
 * Solution 1: Binary Indexed Tree (Fenwick Tree) + Coordinate Compression
 * Time O(n log n), Space O(n)
 *
 * Coordinate compress to [1..k], process right-to-left.
 * For each element: query how many smaller already inserted, then insert.
 */
function countSmaller(nums: number[]): number[] {
  // Coordinate compression
  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  const rank = new Map<number, number>();
  sorted.forEach((v, i) => rank.set(v, i + 1));
  const m = sorted.length;

  // Binary Indexed Tree (1-indexed)
  const tree = new Array(m + 1).fill(0);

  function update(i: number): void {
    for (; i <= m; i += i & (-i)) tree[i]++;
  }

  function query(i: number): number {
    let sum = 0;
    for (; i > 0; i -= i & (-i)) sum += tree[i];
    return sum;
  }

  const n = nums.length;
  const result = new Array(n);

  for (let i = n - 1; i >= 0; i--) {
    const r = rank.get(nums[i])!;
    result[i] = query(r - 1); // count elements with rank < r (i.e., value < nums[i])
    update(r);
  }

  return result;
}

/**
 * Solution 2: Merge Sort (Divide & Conquer)
 * Time O(n log n), Space O(n)
 *
 * During merge, when right element is placed before left elements,
 * all remaining left elements have a "smaller on right" count increment.
 */
function countSmaller2(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(0);
  // indexed array for tracking original positions
  let indices = Array.from({ length: n }, (_, i) => i);

  function mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;
    const mid = arr.length >> 1;
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    const merged: number[] = [];
    let l = 0, r = 0;
    while (l < left.length && r < right.length) {
      if (nums[left[l]] <= nums[right[r]]) {
        result[left[l]] += r; // r right elements already placed are smaller
        merged.push(left[l++]);
      } else {
        merged.push(right[r++]);
      }
    }
    while (l < left.length) { result[left[l]] += r; merged.push(left[l++]); }
    while (r < right.length) merged.push(right[r++]);
    return merged;
  }

  mergeSort(indices);
  return result;
}

// --- Quick inline tests ---
console.log(JSON.stringify(countSmaller([5, 2, 6, 1])));  // [2,1,1,0]
console.log(JSON.stringify(countSmaller([-1])));           // [0]
console.log(JSON.stringify(countSmaller([-1, -1])));       // [1,0]
console.log(JSON.stringify(countSmaller([1, 2, 3])));      // [0,0,0]
console.log(JSON.stringify(countSmaller2([5, 2, 6, 1]))); // [2,1,1,0]
```

---

## 🔗 Related Problems

| Problem | Relationship |
| ------- | ------------ |
| [315. Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/) | This problem |
| [327. Count of Range Sum](https://leetcode.com/problems/count-of-range-sum/) | BIT / merge sort on range sums |
| [493. Reverse Pairs](https://leetcode.com/problems/reverse-pairs/) | Harder version: count pairs with ratio condition |
| [307. Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/) | Core BIT operations |
| [1649. Create Sorted Array through Instructions](https://leetcode.com/problems/create-sorted-array-through-instructions/) | BIT for insertion cost counting |
