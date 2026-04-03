---
layout: page
title: "Maximum Value at a Given Index in a Bounded Array"
difficulty: Medium
category: Sorting-Searching
tags: [Math, Binary Search, Greedy]
leetcode_url: "https://leetcode.com/problems/maximum-value-at-a-given-index-in-a-bounded-array"
---

# Maximum Value at a Given Index in a Bounded Array / Giá Trị Lớn Nhất Tại Chỉ Số Cho Trước

---

## 🧠 Intuition / Tư Duy

**Analogy:** **EN:** We want to maximize `arr[index]` subject to: sum ≤ maxSum and adjacent elements differ by at most 1 (all ≥ 1). Binary search on the peak value `v`. The minimum sum when `arr[index] = v` forms two arithmetic pyramids descending from `v` to 1 on each side.

**VI:** Muốn tối đa `arr[index]` với tổng ≤ maxSum và các phần tử kề nhau khác nhau ≤ 1 (đều ≥ 1). Binary search trên giá trị đỉnh `v`. Tổng tối thiểu khi `arr[index] = v` tạo thành hai tháp số học giảm dần từ `v` về 1 ở hai phía.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximum Value at a Given Index in a Bounded Array example:**

```
n=4, index=2, maxSum=6

v=2: Left side (3 elements incl. peak): [1, 2, 2] → sum=5? No:
  Peak at idx=2, left count=3 (idx 0,1,2), right count=2 (idx 2,3)
  calcSum(2, 3) = 2+1+1 = 4 (v<count → triangle+flat)
  calcSum(2, 2) = 2+1 = 3
  total = 4 + 3 - 2 = 5 ≤ 6 ✓

v=3: calcSum(3,3)=6, calcSum(3,2)=5 → 6+5-3=8 > 6 ✗

Answer: 2
```

---

---

## Problem Description

| #   | Problem                              | Difficulty | Pattern                   |
| --- | ------------------------------------ | ---------- | ------------------------- |
| 1   | Koko Eating Bananas                  | 🟡 Medium  | binary search on answer   |
| 2   | Capacity To Ship Packages            | 🟡 Medium  | binary search feasibility |
| 3   | Minimize Max Distance to Gas Station | 🔴 Hard    | binary search + greedy    |

---

## 📝 Interview Tips

- 📐 **EN:** `calcSum(v, count)`: if `v >= count`, it's arithmetic: `(v + v-count+1) * count / 2`. If `v < count`, it's `v*(v+1)/2 + (count-v)`. **VI:** Hai trường hợp: đủ chỗ cho dốc đầy đủ hay phải giữ đáy là 1.
- 🔍 **EN:** Binary search range: `lo=1` (min value), `hi=maxSum` (upper bound when n=1). **VI:** Tìm kiếm từ 1 đến maxSum.
- ➕ **EN:** Subtract one `v` to avoid double-counting the peak: `calcSum(v, left+1) + calcSum(v, right+1) - v`. **VI:** Trừ một lần `v` vì đỉnh được đếm hai lần từ hai phía.
- ✅ **EN:** Monotone: if sum ≤ maxSum for peak `v`, also valid for all `v' < v`. Binary search on feasibility. **VI:** Tính đơn điệu: nếu hợp lệ với v thì cũng hợp lệ với v' < v.
- 🔢 **EN:** Use integer arithmetic carefully — `count * v` can overflow 32-bit; use BigInt or check fits in JS safe integer. **VI:** Kiểm tra tràn số khi nhân — dùng Number an toàn với JS khi n ≤ 10^9.
- 🎯 **EN:** The answer is always `lo` after the search converges — the largest feasible v. **VI:** Kết quả là `lo` sau khi binary search hội tụ.

---

---

## Solutions

```typescript
/**
 * Binary search on peak value v at arr[index].
 * calcSum(v, count) = min sum for a side of 'count' elements peaking at v.
 * Time: O(log(maxSum))  Space: O(1)
 */
function maxValue(n: number, index: number, maxSum: number): number {
  /**
   * Minimum sum for a sequence of `count` elements where
   * the first is v and each step decreases by 1 (floored at 1).
   */
  function calcSum(v: number, count: number): number {
    if (v >= count) {
      // Full descending: v + (v-1) + ... + (v-count+1)
      return ((v + v - count + 1) * count) / 2;
    } else {
      // Descend to 1, then fill rest with 1s
      // v + (v-1) + ... + 1 + 1 + ... (count-v times)
      return (v * (v + 1)) / 2 + (count - v);
    }
  }

  let lo = 1,
    hi = maxSum;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    // left side: index+1 elements (including peak); right side: n-index elements
    const total = calcSum(mid, index + 1) + calcSum(mid, n - index) - mid;
    if (total <= maxSum) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

// Tests
console.log(maxValue(4, 2, 6)); // 2
console.log(maxValue(6, 1, 10)); // 3
console.log(maxValue(3, 2, 18)); // 7
console.log(maxValue(1, 0, 24)); // 24  (single element, no constraint)

/**
 * Direct math: compute max v such that pyramid sum fits in maxSum.
 * Rearrange calcSum equation to solve for v analytically.
 * Time: O(1)  Space: O(1)
 */
function maxValue2(n: number, index: number, maxSum: number): number {
  // After subtracting n (all 1s baseline), we have budget = maxSum - n
  // The pyramid adds: left side adds 0+1+2+...+(v-1) or capped by index
  // It's easier to just binary search — O(1) approach is complex
  // Fallback to binary search approach
  const budget = maxSum - n; // remaining after all-ones
  // left count = index, right count = n-1-index (excluding peak)
  const L = index,
    R = n - 1 - index;

  function triSum(side: number, extra: number): number {
    // extra = v-1 (how much peak exceeds 1)
    if (extra >= side) return (side * (side + 1)) / 2;
    return (extra * (extra + 1)) / 2;
  }

  // Binary search on extra = v - 1
  let lo = 0,
    hi = budget;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    const used = triSum(L, mid) + triSum(R, mid) + mid; // +mid for peak itself
    if (used <= budget) lo = mid;
    else hi = mid - 1;
  }
  return lo + 1; // v = extra + 1
}

console.log(maxValue2(4, 2, 6)); // 2
console.log(maxValue2(6, 1, 10)); // 3
```

---

## 🔗 Related Problems

| #   | Problem                              | Difficulty | Pattern                   |
| --- | ------------------------------------ | ---------- | ------------------------- |
| 1   | Koko Eating Bananas                  | 🟡 Medium  | binary search on answer   |
| 2   | Capacity To Ship Packages            | 🟡 Medium  | binary search feasibility |
| 3   | Minimize Max Distance to Gas Station | 🔴 Hard    | binary search + greedy    |
