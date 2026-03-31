---
layout: page
title: "Create Maximum Number"
difficulty: Hard
category: Array
tags: [Array, Two Pointers, Stack, Greedy, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/create-maximum-number"
---

# Create Maximum Number / Tạo Số Lớn Nhất

🔴 Hard | Array · Two Pointers · Stack · Greedy · Monotonic Stack | LeetCode #321

## 🧠 Intuition / Tư Duy

**Vietnamese:** Chia nhỏ bài toán: chọn `i` chữ số từ mảng 1 và `k-i` chữ số từ mảng 2 (giữ nguyên thứ tự). Với mỗi phân chia `i` từ 0 đến k, dùng monotonic stack để chọn số lớn nhất từ mỗi mảng, rồi merge hai dãy đã chọn.

```
nums1=[3,4,6,5], nums2=[9,1,2,5,8,3], k=5

Try i=0: pick 0 from nums1, 5 from nums2
  max from nums2(5)=[9,8,5,3,2] → merge=[9,8,5,3,2]

Try i=1: pick 1 from nums1=[6], 4 from nums2=[9,8,3,2]
  merge([6],[9,8,3,2]) → [9,8,6,3,2]

Try i=2: pick 2 from nums1=[6,5], 3 from nums2=[9,8,3]
  merge([6,5],[9,8,3]) → [9,8,6,5,3]  ← maximum!

Answer: [9,8,6,5,3]
```

## Problem Description

Given two arrays `nums1` (length m) and `nums2` (length n), and integer `k` (k ≤ m+n), create the **maximum number** of length `k` by picking digits from both arrays while preserving their relative order. Return as an array.

Three sub-problems: (1) pick best i digits from one array using monotonic stack, (2) merge two arrays to form maximum, (3) try all splits i=0..k.

**Example 1:**

```
nums1=[3,4,6,5], nums2=[9,1,2,5,8,3], k=5
Output: [9,8,6,5,3]
```

**Example 2:**

```
nums1=[6,7], nums2=[6,0,4], k=5
Output: [6,7,6,0,4]
```

## 📝 Interview Tips

- **🔑 Decompose / Phân tách:** Split k into (i from nums1, k-i from nums2); try all valid splits — i from max(0,k-n) to min(k,m)
- **🏔️ Monotonic stack / Stack đơn điệu:** To pick best t digits from array: use decreasing monotonic stack, can remove at most (n-t) elements
- **🔀 Merge for maximum / Merge để max:** When comparing two sequences during merge, compare lexicographically from current positions
- **⚠️ Merge comparison / So sánh khi merge:** Greedy pick larger head; on tie, look further ahead to break tie correctly
- **📊 Complexity / Độ phức tạp:** O(k(m+n)) — k splits × O(m+n) for stack + merge
- **🌟 Tricky part / Phần khó:** The merge step: when `a[i] === b[j]`, must compare suffixes `a[i..]` vs `b[j..]` lexicographically

## Solutions

```typescript
/**
 * Helper: extract max t digits from arr preserving order
 * Uses monotonic decreasing stack
 */
function maxSubsequence(arr: number[], t: number): number[] {
  const drop = arr.length - t;
  const stack: number[] = [];
  let dropped = 0;

  for (const n of arr) {
    while (dropped < drop && stack.length > 0 && stack[stack.length - 1] < n) {
      stack.pop();
      dropped++;
    }
    stack.push(n);
  }

  return stack.slice(0, t);
}

/**
 * Helper: merge two arrays to form maximum number
 */
function merge(a: number[], b: number[]): number[] {
  const result: number[] = [];
  let i = 0,
    j = 0;

  while (i < a.length && j < b.length) {
    // Compare suffixes for correct greedy choice on tie
    let ai = i,
      bj = j;
    let pick = 0; // 0=equal, 1=a wins, -1=b wins
    while (ai < a.length && bj < b.length) {
      if (a[ai] > b[bj]) {
        pick = 1;
        break;
      }
      if (a[ai] < b[bj]) {
        pick = -1;
        break;
      }
      ai++;
      bj++;
    }
    if (pick === 0) pick = a.length - i >= b.length - j ? 1 : -1;

    if (pick >= 0) result.push(a[i++]);
    else result.push(b[j++]);
  }

  while (i < a.length) result.push(a[i++]);
  while (j < b.length) result.push(b[j++]);
  return result;
}

/**
 * Main solution: try all splits
 * Time: O(k*(m+n))
 * Space: O(m+n)
 */
function maxNumber(nums1: number[], nums2: number[], k: number): number[] {
  const m = nums1.length,
    n = nums2.length;
  let best: number[] = [];

  for (let i = Math.max(0, k - n); i <= Math.min(k, m); i++) {
    const sub1 = maxSubsequence(nums1, i);
    const sub2 = maxSubsequence(nums2, k - i);
    const candidate = merge(sub1, sub2);

    // Compare lexicographically
    let better = false;
    for (let x = 0; x < k; x++) {
      if (candidate[x] > (best[x] ?? -1)) {
        better = true;
        break;
      }
      if (candidate[x] < (best[x] ?? -1)) break;
    }
    if (best.length === 0 || better) best = candidate;
  }

  return best;
}

console.log(maxNumber([3, 4, 6, 5], [9, 1, 2, 5, 8, 3], 5)); // [9,8,6,5,3]
console.log(maxNumber([6, 7], [6, 0, 4], 5)); // [6,7,6,0,4]
console.log(maxNumber([3, 9], [8, 9], 3)); // [9,8,9]
```

## 🔗 Related Problems

| Problem                                                                                     | Difficulty | Pattern         |
| ------------------------------------------------------------------------------------------- | ---------- | --------------- |
| [Remove K Digits](https://leetcode.com/problems/remove-k-digits/)                           | 🟡 Medium  | Monotonic Stack |
| [Largest Number](https://leetcode.com/problems/largest-number/)                             | 🟡 Medium  | Greedy, Sort    |
| [Largest Merge Of Two Strings](https://leetcode.com/problems/largest-merge-of-two-strings/) | 🟡 Medium  | Greedy          |
| [Monotone Increasing Digits](https://leetcode.com/problems/monotone-increasing-digits/)     | 🟡 Medium  | Greedy          |
