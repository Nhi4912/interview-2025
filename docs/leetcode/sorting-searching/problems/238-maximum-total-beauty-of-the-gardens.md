---
layout: page
title: "Maximum Total Beauty of the Gardens"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-total-beauty-of-the-gardens"
---

# Maximum Total Beauty of the Gardens / Maximum Total Beauty of the Gardens

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element) | [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal)

---

## 🧠 Intuition / Tư Duy

**Analogy / Gốc nhìn:** Như chia ngân sách khu vườn — một số vườn "đạt chuẩn" kiếm `full` điểm, còn lại kiếm `partial × min`. Enumerate j vườn đạt chuẩn, tối ưu phần còn lại bằng binary search.

**Pattern Recognition:**

- Keyword: "full gardens + min incomplete" → **Enumerate j + Binary Search**
- Sort ascending → rightmost j gardens cheapest to fill (smallest deficit)
- Prefix sum + binary search → O(log n) optimal min per j

**Visual — Enumerate Full Gardens:**

```
flowers=[1,1,1,3] sorted, target=6, full=12, partial=1, newFlowers=7
fillCost: [0, 3, 8, ...]   (cost to make rightmost j full)
j=0: rem=7 → max-min of [1,1,1,3] = 3 (cost 6≤7) → beauty=0+3=3
j=1: rem=4 → max-min of [1,1,1]   = 2 (cost 3≤4) → beauty=12+2=14 ✓
j=2: fillCost=8 > 7 → break
```

---

## Problem Description

Cho `flowers[i]`, `newFlowers` hoa để thêm, `target`, điểm `full` mỗi vườn đạt chuẩn (≥ target), điểm `partial × min(incomplete)` cho vườn chưa đạt. **Maximize tổng điểm.**

**Example 1:** `flowers=[1,3,1,1], newFlowers=7, target=6, full=12, partial=1` → `14`
**Example 2:** `flowers=[2,4,5,3], newFlowers=10, target=5, full=5, partial=3` → `30`
**Example 3:** `flowers=[1,1], newFlowers=0, target=2, full=4, partial=1` → `2`

## Constraints: `1 ≤ n ≤ 1e5`, `0 ≤ flowers[i] ≤ 1e5`, `1 ≤ newFlowers ≤ 1e10`

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "newFlowers có thể = 1e10. Output overflow?" / newFlowers up to 1e10 — safe in JS number for sums ≤ 1e15
2. **Brute Force**: "Enumerate tất cả phân phối → exponential" / Full enumeration is infeasible
3. **Key Reduction**: "j vườn full nên là j vườn flowers cao nhất (deficit nhỏ nhất)" / Take rightmost j after sort to minimize fill cost
4. **Inner Optimize**: "Với j cố định, max-min = water-fill via binary search + prefix sum" / Binary search on achievable min using sorted prefix
5. **Cap at target−1**: "Min của incomplete phải < target (else nó là full)" / Clamp achievable min to target−1
6. **Early Break**: "fillCost tăng đơn điệu → break khi vượt newFlowers" / fillCost non-decreasing — safe to break

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Prefix Sum + Binary Search per j
 * @time O(n log n) — sort + n × O(log n) binary searches
 * @space O(n) — prefix sums
 *
 * Enumerate j = #full gardens (rightmost j in sorted array).
 * Binary search for max achievable min in incomplete [0..n-j-1].
 */
function maximumBeauty(
  flowers: number[],
  newFlowers: number,
  target: number,
  full: number,
  partial: number,
): number {
  const n = flowers.length;
  flowers.sort((a, b) => a - b);
  const pre = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) pre[i + 1] = pre[i] + flowers[i];

  // Cumulative fill cost: make rightmost j gardens reach target
  const fillCost: number[] = [0];
  for (let j = 1; j <= n; j++) fillCost[j] = fillCost[j - 1] + Math.max(0, target - flowers[n - j]);

  // Skip j < autoFull (gardens already ≥ target are free)
  let autoFull = 0;
  for (let i = n - 1; i >= 0 && flowers[i] >= target; i--) autoFull++;

  let ans = 0;
  for (let j = autoFull; j <= n; j++) {
    if (fillCost[j] > newFlowers) break;
    const rem = newFlowers - fillCost[j];
    const incomplete = n - j;
    if (incomplete === 0) {
      ans = Math.max(ans, j * full);
      break;
    }

    // Binary search: max lo in [flowers[0], target-1] s.t. water-fill cost ≤ rem
    let lo = flowers[0],
      hi = target - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      // Count elements in [0..incomplete-1] below mid (need incrementing)
      let l = 0,
        r = incomplete;
      while (l < r) {
        const m = (l + r) >> 1;
        flowers[m] < mid ? (l = m + 1) : (r = m);
      }
      mid * l - pre[l] <= rem ? (lo = mid) : (hi = mid - 1);
    }
    ans = Math.max(ans, j * full + lo * partial);
  }
  return ans;
}

/**
 * Solution 2: Same enumeration, linear scan for min (correct, TLE on large inputs)
 * @time O(n × target) — linear lo-search replaces binary search; correct for small inputs
 * @space O(n)
 */
function maximumBeautyBrute(
  flowers: number[], newFlowers: number,
  target: number, full: number, partial: number
): number {
  const n = flowers.length;
  flowers.sort((a, b) => a - b);
  const pre = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) pre[i + 1] = pre[i] + flowers[i];
  const fillCost = [0];
  for (let j = 1; j <= n; j++)
    fillCost[j] = fillCost[j - 1] + Math.max(0, target - flowers[n - j]);

  let ans = 0;
  for (let j = 0; j <= n; j++) {
    if (fillCost[j] > newFlowers) break;
    const rem = newFlowers - fillCost[j];
    if (j === n) { ans = Math.max(ans, n * full); break; }
    const incomplete = n - j;
    // Linear search downward for max achievable min
    let bestMin = flowers[0];
    for (let lo = target - 1; lo >= flowers[0]; lo--) {
      let l = 0, r = incomplete;
      while (l < r) { const m = (l + r) >> 1; flowers[m] < lo ? (l = m + 1) : (r = m); }
      if (lo * l - pre[l] <= rem) { bestMin = lo; break; }
    }
    ans = Math.max(ans, j * full + bestMin * partial);
  }
  return ans;
}
    // Greedily water-fill incomplete: check if we can raise all to target-1
    let cost = 0,
      minVal = flowers[0];
    for (let i = 0; i < n - j; i++) cost += Math.max(0, target - 1 - flowers[i]);
    if (cost <= rem) minVal = target - 1;
    ans = Math.max(ans, j * full + minVal * partial);
  }
  return ans;
}

// === Test Cases ===
console.log(maximumBeauty([1, 3, 1, 1], 7, 6, 12, 1)); // 14
console.log(maximumBeauty([2, 4, 5, 3], 10, 5, 5, 3)); // 30
console.log(maximumBeauty([1, 1], 0, 2, 4, 1)); // 2
console.log(maximumBeautyBrute([1, 3, 1, 1], 7, 6, 12, 1)); // 14
```

---

## 🔗 Related Problems

- [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element) — sliding window water-fill on sorted array
- [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal) — prefix sum + binary search for optimal level
- [Most Profit Assigning Work](https://leetcode.com/problems/most-profit-assigning-work) — sort + greedy two-pointer assignment
- [Maximum Ice Cream Bars](https://leetcode.com/problems/maximum-ice-cream-bars) — sort + greedy budget allocation
