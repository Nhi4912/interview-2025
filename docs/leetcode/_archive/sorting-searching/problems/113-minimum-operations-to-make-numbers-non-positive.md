---
layout: page
title: "Minimum Operations to Make Numbers Non-positive"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/minimum-operations-to-make-numbers-non-positive"
---

# Minimum Operations to Make Numbers Non-positive / Số Phép Toán Tối Thiểu Để Mảng Không Dương

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Search on Answer
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array) | [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bài toán "Koko ăn chuối" — ta không tính trực tiếp số thao tác, mà **đoán** số thao tác `k`, rồi kiểm tra tính khả thi. Binary search tìm `k` nhỏ nhất mà còn feasible.

**Pattern Recognition:**

- Signal: "minimum number of operations" + "monotone feasibility" → **Binary Search on Answer**
- Với `k` operations: mỗi phần tử `i` được giảm `k*y + c_i*(x-y)` (c_i lần được chọn riêng)
- Key insight: feasible nếu tổng `ceil((nums[i]-k*y)/(x-y))` ≤ k cho tất cả nums[i] > k\*y

**Visual — Binary search on k (operations count):**

```
k=0: [5, 3, 2, 1] → nums still positive → infeasible
k=1: check sum of ceil(...) ≤ 1?  → maybe not enough
k=2: check sum of ceil(...) ≤ 2?  → maybe feasible ✓

lo=0, hi=max(nums)
     mid → canFinish(mid)? → shrink range
     answer = leftmost feasible k
```

---

## Problem Description

Given array `nums` of positive integers and integers `x`, `y` (x > y ≥ 0). One operation: choose index `i`, decrease `nums[i]` by `x`, decrease **all other** elements by `y`. Return **minimum operations** to make all elements ≤ 0. ([LeetCode 2702](https://leetcode.com/problems/minimum-operations-to-make-numbers-non-positive))

Difficulty: Hard | Acceptance: 42.2%

```
Example 1: nums=[3,4,1,7,6], x=4, y=2  → 3
  (3 ops: choose idx3, idx4, idx3 — element 7 reduced 4+4+2=10, others ≥6)
Example 2: nums=[1,2,3], x=1, y=1      → 3
  (each op reduces everyone by 1, need 3 ops for max=3)
```

Constraints: `1 ≤ n ≤ 10^5`, `1 ≤ y < x ≤ 10^9`, `1 ≤ nums[i] ≤ 10^9`

---

## 📝 Interview Tips

1. **Monotonicity / Đơn điệu**: "Nếu k ops là feasible thì k+1 cũng feasible" → Binary search được
2. **Feasibility check / Kiểm tra**: Với k ops, element i cần được chọn riêng c_i = max(0, ceil((nums[i]-k\*y)/(x-y))) lần
3. **Overflow / Tràn số**: Dùng BigInt hoặc cẩn thận với k\*y khi nums[i] và y đều lớn
4. **Boundary / Biên**: lo=0, hi=max(nums) (worst case: giảm từng 1 đơn vị nếu y=0)
5. **x == y case**: Tất cả giảm đều nhau → cần max(nums)/x ops (ceil)
6. **Complexity / Độ phức tạp**: O(n log(max(nums))) — log factor từ binary search

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — simulate increasing k until all ≤ 0
 * Time: O(n * max(nums))  Space: O(1)
 * Only feasible for very small inputs
 */
function minOperationsBrute(nums: number[], x: number, y: number): number {
  let k = 0;
  while (true) {
    k++;
    // Try: can k operations make all non-positive?
    // Each element i needs to be chosen c_i times; sum(c_i) <= k
    let need = 0;
    let feasible = true;
    for (const v of nums) {
      const remaining = v - k * y;
      if (remaining > 0) {
        need += Math.ceil(remaining / (x - y));
        if (need > k) {
          feasible = false;
          break;
        }
      }
    }
    if (feasible) return k;
    if (k > 2e6) return -1; // guard for brute force
  }
}

/**
 * Solution 2: Binary Search on Answer (Optimal)
 * Time: O(n log(max(nums)))  Space: O(1)
 *
 * With k operations total:
 *   - Each element decreases by k*y (from operations it is NOT chosen)
 *     plus extra (x-y) for each operation it IS chosen.
 *   - For nums[i] to become ≤ 0: need c_i ≥ ceil((nums[i] - k*y) / (x-y))
 *     (when nums[i] > k*y; otherwise 0 extra ops needed)
 *   - Feasible iff sum of c_i ≤ k
 */
function minOperations(nums: number[], x: number, y: number): number {
  const canFinish = (k: number): boolean => {
    let need = 0;
    const base = k * y; // reduction from not being chosen
    for (const v of nums) {
      if (v > base) {
        need += Math.ceil((v - base) / (x - y));
        if (need > k) return false; // early exit
      }
    }
    return true;
  };

  let lo = 0,
    hi = Math.max(...nums);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (canFinish(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// === Tests ===
console.log(minOperations([3, 4, 1, 7, 6], 4, 2)); // 3
console.log(minOperations([1, 2, 3], 1, 1)); // 3
console.log(minOperations([10], 3, 1)); // 4 (10-3-3-3-1=0 after 4 ops)
console.log(minOperations([1], 10, 5)); // 1
console.log(minOperationsBrute([3, 4, 1, 7, 6], 4, 2)); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                                                | Relationship                                      |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| [2702. Minimum Operations to Make Numbers Non-Positive](https://leetcode.com/problems/minimum-operations-to-make-numbers-non-positive) | This problem                                      |
| [875. Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)                                                          | Binary search on answer, same feasibility pattern |
| [1870. Minimum Speed to Arrive on Time](https://leetcode.com/problems/minimum-speed-to-arrive-on-time)                                 | Binary search on answer                           |
| [2226. Maximum Candies Allocated to K Children](https://leetcode.com/problems/maximum-candies-allocated-to-k-children)                 | Binary search feasibility check                   |
| [410. Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum)                                                  | Binary search on answer                           |
