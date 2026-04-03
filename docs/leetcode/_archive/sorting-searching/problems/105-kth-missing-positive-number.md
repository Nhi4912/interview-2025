---
layout: page
title: "Kth Missing Positive Number"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/kth-missing-positive-number"
---

# Kth Missing Positive Number / Số Dương Thứ K Bị Thiếu

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Tưởng tượng dãy số nguyên dương 1,2,3,4,... giống hàng chờ có đánh số. Một số người vắng mặt. Tại vị trí `i` trong mảng, số người **đáng lẽ** phải có là `i+1`, nhưng thực tế là `arr[i]`. Vậy số người vắng = `arr[i] - (i+1)`. Binary search trên khoảng cách này!

**Pattern Recognition:**

- Sorted array + find k-th missing → Binary search on "how many missing before index i"
- At index `i`: missing count = `arr[i] - (i+1)`
- Find smallest `i` where missing count ≥ k, then compute answer

**Visual:**

```
arr = [2, 3, 4, 7, 11], k = 5

Index:    0   1   2   3   4
arr[i]:   2   3   4   7  11
Missing: 2-1=1 3-2=1 4-3=1 7-4=3 11-5=6

Binary search for first i where arr[i]-(i+1) >= k=5:
  mid=2: missing=1 < 5 → lo=3
  mid=3: missing=3 < 5 → lo=4
  mid=4: missing=6 >= 5 → hi=3

lo=4, answer = lo + k = 4 + 5 = 9 ✅
```

## Problem Description

Given strictly increasing array `arr` of positive integers and integer `k`, return the **k-th missing positive integer** not in `arr`. Constraints: `1 ≤ arr.length ≤ 1000`, `1 ≤ arr[i] ≤ 1000`, `1 ≤ k ≤ 1000`.

**Example 1:** `arr = [2,3,4,7,11]`, `k = 5` → `9`
**Example 2:** `arr = [1,2,3,4]`, `k = 2` → `6`

## 📝 Interview Tips

1. **Clarify**: k-th missing là đếm từ 1 hay từ 0? Từ số dương 1 / Count from positive integer 1 upward
2. **Approach**: Linear scan O(n) dễ hiểu; binary search O(log n) là tối ưu / Linear is simpler; binary search for O(log n)
3. **Edge cases**: k lớn hơn tất cả gaps trong arr → answer = arr.last + remaining_k / k may exceed all gaps
4. **Optimize**: Key insight: missing count tại index i = arr[i] - i - 1 / missing(i) = arr[i] - i - 1
5. **Test**: `[1,2,3,4]`, k=2 → 6 (không có missing trong arr, answer = 4+2=6) / All present in arr
6. **Follow-up**: Nếu arr không sorted? → sort first O(n log n) / Unsorted: sort first

## Solutions

```typescript
/** Solution 1: Linear Scan — easy to explain
 * Time: O(n + k) | Space: O(1)
 */
function findKthPositive1(arr: number[], k: number): number {
  const set = new Set(arr);
  let missing = 0;
  let num = 0;
  while (missing < k) {
    num++;
    if (!set.has(num)) missing++;
  }
  return num;
}

/** Solution 2: Binary Search — optimal
 * Key: missing(i) = arr[i] - (i+1) = arr[i] - i - 1
 * Find smallest index where missing >= k → answer = lo + k
 * Time: O(log n) | Space: O(1)
 */
function findKthPositive2(arr: number[], k: number): number {
  let lo = 0,
    hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    // missing numbers before arr[mid]: arr[mid] - mid - 1
    if (arr[mid] - mid - 1 >= k) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  // lo is the first index where missing >= k
  // answer = lo + k (lo missing slots before index lo, plus k more)
  return lo + k;
}

/** Solution 3: Walk through arr tracking missing count
 * Time: O(n) | Space: O(1)
 */
function findKthPositive3(arr: number[], k: number): number {
  let missing = 0;
  let prev = 0;
  for (const num of arr) {
    const gap = num - prev - 1; // missing numbers between prev+1 and num-1
    if (missing + gap >= k) {
      return prev + (k - missing);
    }
    missing += gap;
    prev = num;
  }
  return prev + (k - missing);
}

// Test cases
console.log(findKthPositive1([2, 3, 4, 7, 11], 5)); // 9
console.log(findKthPositive2([2, 3, 4, 7, 11], 5)); // 9
console.log(findKthPositive3([2, 3, 4, 7, 11], 5)); // 9
console.log(findKthPositive2([1, 2, 3, 4], 2)); // 6
console.log(findKthPositive2([1, 3], 1)); // 2
```

## 🔗 Related Problems

| Problem                                                                                                                                          | Relationship                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| [Missing Number](https://leetcode.com/problems/missing-number)                                                                                   | Find single missing number in range [0,n]            |
| [Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array) | Binary search on sorted array with answer derivation |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)                                                                         | Binary search on answer space pattern                |
