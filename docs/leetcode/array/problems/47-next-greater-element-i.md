---
layout: page
title: "Next Greater Element I"
difficulty: Easy
category: Array
tags: [Array, Hash Table, Stack, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/next-greater-element-i"
---

# Next Greater Element I / Phần Tử Lớn Hơn Tiếp Theo I

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Monotonic Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Longest Well-Performing Interval](https://leetcode.com/problems/longest-well-performing-interval) | [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đứng trong hàng chờ xem buổi hòa nhạc, mỗi người muốn biết người cao hơn đầu tiên đứng sau mình. Bạn dùng một cuốn sổ ghi những người đang "chờ tìm người cao hơn" — khi người mới đến cao hơn đầu sổ, bạn gạch ra người đó và ghi đáp án.

**Pattern Recognition:**

- Signal: "next greater element to the right" → **Monotonic Decreasing Stack**
- Process `nums2` with stack to precompute next-greater for all values
- Then answer queries from `nums1` using a HashMap in O(1)

**Visual — `nums2 = [1, 3, 4, 2]`:**

```
Process nums2 right-to-left (or left-to-right with pop):

i=0 val=1: stack=[]     → no greater → nge[1]=-1, push 1  stack=[1]
i=1 val=3: 3>1 pop 1    → nge[1]=3,  3>nothing → nge[3]=-1, push 3  stack=[3]
i=2 val=4: 4>3 pop 3    → nge[3]=4,  4>nothing → nge[4]=-1, push 4  stack=[4]
i=3 val=2: 2<4 → nge[2]=-1, push 2   stack=[4,2]

Map: {1:3, 3:4, 4:-1, 2:-1}
nums1=[4,1,2] → [−1, 3, −1] ✅
```

---

## Problem Description

Given two **distinct** integer arrays `nums1` (subset of `nums2`) and `nums2`, for each element in `nums1`, find the **next greater element** in `nums2` (the first element to its right in `nums2` that is larger). Return `-1` if none exists.

**Example 1:** `nums1 = [4,1,2], nums2 = [1,3,4,2]` → `[-1,3,-1]`

**Example 2:** `nums1 = [2,4], nums2 = [1,2,3,4]` → `[3,-1]`

Constraints:

- `1 <= nums1.length <= nums2.length <= 1000`
- All integers in `nums1` and `nums2` are unique
- All integers of `nums1` also appear in `nums2`

---

## 📝 Interview Tips

1. **Clarify**: "nums1 là subset của nums2, tất cả values unique?" / Confirm nums1 ⊆ nums2 and all values are distinct
2. **Brute force**: "Với mỗi num1[i], tìm trong nums2 rồi scan phải — O(m\*n)" / For each query, find position then scan right
3. **Optimize**: "Precompute next-greater cho toàn nums2 bằng monotonic stack — O(n+m)" / Precompute all NGE in one pass
4. **Stack direction**: "Dùng stack đơn điệu giảm — pop khi gặp phần tử lớn hơn" / Decreasing stack: pop when current > top
5. **Edge cases**: "Phần tử lớn nhất trong nums2 → -1; nums1 có 1 phần tử" / Largest element has no NGE
6. **Complexity**: "O(n) cho monotonic stack pass, O(m) để build kết quả" / Linear time overall

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — nested scan
 * Time: O(m * n) — for each nums1 element, find + scan in nums2
 * Space: O(n) — index map for nums2 lookup
 */
function nextGreaterElementBrute(nums1: number[], nums2: number[]): number[] {
  const indexMap = new Map<number, number>();
  nums2.forEach((v, i) => indexMap.set(v, i));

  return nums1.map((num) => {
    const start = indexMap.get(num)!;
    for (let j = start + 1; j < nums2.length; j++) {
      if (nums2[j] > num) return nums2[j];
    }
    return -1;
  });
}

/**
 * Solution 2: Optimized — Monotonic Decreasing Stack
 * Precompute next greater element for every value in nums2 in O(n),
 * then answer each nums1 query in O(1) via HashMap.
 * Time: O(n + m) — one pass for nums2, one pass for nums1
 * Space: O(n) — stack + result map
 */
function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
  const ngeMap = new Map<number, number>(); // value → next greater
  const stack: number[] = []; // monotonic decreasing (by value)

  for (const num of nums2) {
    // Current num is greater than top → top found its NGE
    while (stack.length > 0 && stack[stack.length - 1] < num) {
      ngeMap.set(stack.pop()!, num);
    }
    stack.push(num);
  }
  // Remaining in stack have no NGE
  while (stack.length > 0) {
    ngeMap.set(stack.pop()!, -1);
  }

  return nums1.map((num) => ngeMap.get(num) ?? -1);
}

// === Test Cases ===
console.log(nextGreaterElement([4, 1, 2], [1, 3, 4, 2])); // [-1,3,-1]
console.log(nextGreaterElement([2, 4], [1, 2, 3, 4])); // [3,-1]
console.log(nextGreaterElement([1, 3, 5, 2, 4], [6, 5, 4, 3, 2, 1, 7])); // [7,7,7,7,7]
console.log(nextGreaterElement([1], [1])); // [-1]
```
