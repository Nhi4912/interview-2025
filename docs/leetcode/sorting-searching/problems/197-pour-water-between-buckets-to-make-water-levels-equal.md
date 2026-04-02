---
layout: page
title: "Pour Water Between Buckets to Make Water Levels Equal"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/pour-water-between-buckets-to-make-water-levels-equal"
---

# Pour Water Between Buckets to Make Water Levels Equal / Cân Bằng Mực Nước Giữa Các Xô

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Hình ảnh:** Bạn có nhiều xô nước. Khi đổ từ xô đầy sang xô cạn, một phần nước bị hao hụt. Hỏi mực nước cuối cùng **cao nhất** có thể đạt được khi tất cả xô bằng nhau?

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Pour Water Between Buckets to Make Water Levels Equal example:**

```
buckets = [1, 2, 7],  loss = 80%
Try level t = 3:
  bucket[0]=1 < 3: cần thêm 2 đơn vị
  bucket[1]=2 < 3: cần thêm 1 đơn vị  → total needed = 3
  bucket[2]=7 > 3: cung cấp (7-3)*(1-0.8) = 0.8 đơn vị → total provided = 0.8
  0.8 < 3 → t=3 impossible

Try t = 2:
  needed = 1+0 = 1,  provided = (7-2)*0.2 = 1.0
  1.0 >= 1 → t=2 feasible ✓
```

**Chiến lược:** Binary search trên mực nước target `t`. Kiểm tra feasibility: `sum(excess*(1-loss/100)) >= sum(deficit)`.

---

## Problem Description

Given `buckets[i]` (water in each bucket) and `loss` (% lost when transferring), find the **maximum equal water level** achievable. Water can only be transferred from fuller to emptier buckets with `loss%` wasted.

**Example 1:** `buckets=[1,2,7]`, `loss=80` → `1.00000`
**Example 2:** `buckets=[2,4,6]`, `loss=50` → `3.50000`

**Constraints:** `1 ≤ buckets.length ≤ 10^5`, `0 ≤ buckets[i] ≤ 10^5`, `0 ≤ loss ≤ 99`

---

## 📝 Interview Tips

- **Clarify:** Is the answer always achievable? (Yes — level 0 always works as lower bound)
- **Binary search on what?** The answer itself — the final equal water level `t`
- **Monotonicity:** If level `t` is feasible, any `t' < t` is also feasible → classic binary search condition
- **Feasibility check:** `Σ(max(buckets[i]-t, 0) * (1-loss/100)) >= Σ(max(t-buckets[i], 0))`
- **Precision:** Use floating-point binary search with ~50 iterations for `1e-5` accuracy
- **Edge case:** All buckets already equal → answer = that equal level; `loss=0` → level = average

---

## Solutions

```typescript
function equalizeWater(buckets: number[], loss: number): number {
  const efficiency = 1 - loss / 100;

  // Check if we can achieve water level `t` for all buckets
  const canAchieve = (t: number): boolean => {
    let provided = 0;
    let needed = 0;
    for (const b of buckets) {
      if (b > t) provided += (b - t) * efficiency;
      else needed += t - b;
    }
    return provided >= needed - 1e-9;
  };

  // Binary search: answer in [0, max(buckets)]
  let lo = 0;
  let hi = Math.max(...buckets);

  for (let iter = 0; iter < 100; iter++) {
    const mid = (lo + hi) / 2;
    if (canAchieve(mid)) lo = mid;
    else hi = mid;
  }

  return lo;
}

function equalizeWaterPrecise(buckets: number[], loss: number): number {
  const keep = 1 - loss / 100; // fraction kept after transfer

  const feasible = (level: number): boolean => {
    let surplus = 0; // water available to give (after loss)
    let deficit = 0; // water needed by low buckets
    for (const b of buckets) {
      if (b > level) surplus += (b - level) * keep;
      else deficit += level - b;
    }
    return surplus + 1e-9 >= deficit;
  };

  let lo = 0;
  let hi = Math.max(...buckets);
  // 50 iterations gives precision of (hi-lo) / 2^50 ≈ 1e-13
  for (let i = 0; i < 50; i++) {
    const mid = lo + (hi - lo) / 2;
    feasible(mid) ? (lo = mid) : (hi = mid);
  }

  return Math.round(lo * 1e5) / 1e5; // round to 5 decimal places
}

function equalizeWaterSort(buckets: number[], loss: number): number {
  // Sort buckets ascending; binary search on sorted position
  const sorted = [...buckets].sort((a, b) => a - b);
  const n = sorted.length;
  const keep = 1 - loss / 100;

  // Prefix sums for efficient range sum
  const prefix = [0];
  for (const b of sorted) prefix.push(prefix[prefix.length - 1] + b);

  const feasible = (t: number): boolean => {
    // Find split point: sorted[0..k-1] < t <= sorted[k..n-1]
    let lo = 0,
      hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      sorted[mid] < t ? (lo = mid + 1) : (hi = mid);
    }
    const k = lo; // k buckets need water
    const deficit = k * t - prefix[k];
    const excess = prefix[n] - prefix[k] - (n - k) * t;
    return excess * keep + 1e-9 >= deficit;
  };

  let lo = 0,
    hi = sorted[n - 1];
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    feasible(mid) ? (lo = mid) : (hi = mid);
  }
  return lo;
}
```

---

## 🔗 Related Problems

| Problem                                                                                                               | Similarity                                     |
| --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)                                             | Binary search on answer with feasibility check |
| [Minimum Number of Days to Make m Bouquets](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/) | Binary search on monotone condition            |
| [Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)     | Binary search on capacity                      |
| [Minimize Maximum of Array](https://leetcode.com/problems/minimize-maximum-of-array/)                                 | Binary search on target value                  |
