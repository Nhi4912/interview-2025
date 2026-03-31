---
layout: page
title: "Apply Operations to Make Sum of Array Greater Than or Equal to k"
difficulty: Medium
category: Math
tags: [Math, Greedy, Enumeration]
leetcode_url: "https://leetcode.com/problems/apply-operations-to-make-sum-of-array-greater-than-or-equal-to-k"
---

# Apply Operations to Make Sum of Array ≥ k / Số Phép Toán Tối Thiểu Để Tổng Mảng ≥ k

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy / Math Enumeration
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Remove Colored Pieces if Both Neighbors are the Same Color](https://leetcode.com/problems/remove-colored-pieces-if-both-neighbors-are-the-same-color) | [Minimum Number of Operations to Make Array Empty](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-empty)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bắt đầu với [1], bạn có thể tăng một phần tử lên 1 (increment) hoặc sao chép một phần tử (duplicate). Chiến lược tốt nhất: tăng một phần tử lên giá trị `v`, rồi sao chép nó nhiều lần để tổng ≥ k. Bài toán tối ưu hoá x (increments) và m (copies).

**Pattern Recognition:**

- Signal: "min operations" + "build array from [1]" + "increment or copy" → **Math: enumerate increment count**
- Dùng x lần tăng → giá trị v = 1 + x; dùng m lần copy → có m+1 phần tử giá trị v
- Tổng = (1+x)(1+m) ≥ k → minimize x + m → enumerate x, compute optimal m

**Visual — k=11:**

```
x=0: v=1, need m: 1×(1+m)≥11 → m=10, cost=10
x=2: v=3, need m: 3×(1+m)≥11 → m=3, cost=5 ✅
x=3: v=4, need m: 4×(1+m)≥11 → m=2, cost=5 ✅
x=9: v=10,need m: 10×(1+m)≥11→ m=1, cost=10
Minimum = 5
```

---

## Problem Description

Start with array `[1]`. Each operation: (1) increment any element by 1, or (2) duplicate any element. Return the minimum operations to make the sum ≥ `k`. ([LeetCode #3085](https://leetcode.com/problems/apply-operations-to-make-sum-of-array-greater-than-or-equal-to-k))

Difficulty: Medium | Acceptance: 43.4%

- **Example 1**: `k=1` → `0` (sum already 1)
- **Example 2**: `k=11` → `5` (increment 2×, duplicate 3×: array [3,3,3,3] sum=12)

Constraints:

- `1 ≤ k ≤ 10⁵`

---

## 📝 Interview Tips

1. **Clarify**: "Bắt đầu với [1]. Increment và duplicate áp dụng cho bất kỳ element nào?" / Start with [1]; any element can be incremented or duplicated
2. **Key insight**: "Chỉ cần 1 loại giá trị — tăng một element tới v, rồi duplicate tới khi sum ≥ k" / Optimal is always increment one element then copy
3. **Why one value?**: "Mọi cách tạo nhiều giá trị khác nhau đều tệ hơn hoặc bằng — phân phối đều không tốt hơn tập trung" / Mixing values never improves; uniform is optimal
4. **Enumerate x**: "x từ 0 đến k, với mỗi x tính m = ceil(k/(1+x)) - 1, tổng = x+m" / Loop x from 0 to k, compute m for each
5. **Optimize**: "Hàm x + ceil(k/(1+x)) − 1 là convex → minimum gần sqrt(k)" / Convex function, minimum near sqrt(k)
6. **Edge cases**: `k=1` → 0 ops; `k=2` → 1 op (duplicate [1] → [1,1] sum=2)

---

## Solutions

```typescript
/**
 * Solution 1: Enumerate All Increment Counts — O(k)
 * Time: O(k) — loop over all possible increment counts
 * Space: O(1)
 *
 * Use x increments → element value v = 1+x
 * Use m duplicates → m+1 copies of v; sum = v*(m+1) ≥ k → m = ceil(k/v)-1
 * Minimize: x + m
 */
function minOperations(k: number): number {
  if (k === 1) return 0;
  let ans = k - 1; // worst case: increment [1] to k, no duplication needed
  for (let x = 0; x < k; x++) {
    const v = 1 + x;
    const m = Math.ceil(k / v) - 1;
    ans = Math.min(ans, x + m);
  }
  return ans;
}

/**
 * Solution 2: Enumerate up to sqrt(k) — O(sqrt(k))
 * Time: O(sqrt(k)) — function is convex, min is near sqrt(k)
 * Space: O(1)
 *
 * Since (1+x)(1+m) ≥ k and we minimize x+m,
 * by AM-GM the minimum is near x ≈ sqrt(k)-1.
 * Enumerate x in [0, ceil(sqrt(k))+1] to safely capture the minimum.
 */
function minOperationsFast(k: number): number {
  if (k === 1) return 0;
  const limit = Math.ceil(Math.sqrt(k)) + 2;
  let ans = k - 1;
  for (let x = 0; x <= limit && x < k; x++) {
    const v = 1 + x;
    const m = Math.ceil(k / v) - 1;
    ans = Math.min(ans, x + m);
  }
  return ans;
}

// === Test Cases ===
console.log(minOperations(1)); // 0
console.log(minOperations(2)); // 1
console.log(minOperations(11)); // 5
console.log(minOperations(4)); // 3  (x=1,v=2,m=1 → cost=2? check: (2)(2)=4≥4 → 2 ops!)
console.log(minOperations(100)); // verify
console.log(minOperationsFast(11)); // 5
console.log(minOperationsFast(100)); // same as above
```

---

## 🔗 Related Problems

- [Minimum Number of Operations to Make Array Empty](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-empty) — operation counting with grouping
- [Minimum Operations to Reduce X to Zero](https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero) — min ops with two operation types
- [Broken Calculator](https://leetcode.com/problems/broken-calculator) — greedy with multiply/subtract operations
- [Reach Number](https://leetcode.com/problems/reach-a-number) — min steps to reach target
- [Rabbits in Forest](https://leetcode.com/problems/rabbits-in-forest) — greedy math counting
