---
layout: page
title: "Maximum Tastiness of Candy Basket"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-tastiness-of-candy-basket"
---

# Maximum Tastiness of Candy Basket / Độ Ngon Tối Đa Của Giỏ Kẹo

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search on Answer
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Magnetic Force Between Two Balls](https://leetcode.com/problems/magnetic-force-between-two-balls) | [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn muốn chọn k loại kẹo sao cho kẹo rẻ nhất và đắt nhất trong rổ chênh lệch _tối thiểu_ là d. Thay vì tìm d trực tiếp, ta binary search trên d: "Liệu ta có thể chọn được k kẹo với mọi cặp giá chênh ít nhất d không?" Greedy kiểm tra bằng cách sort và chọn tham lam.

```
price = [13,5,1,8,21,2], k = 3
Sort: [1, 2, 5, 8, 13, 21]

Binary search on d in [0, (21-1)//(3-1)] = [0, 10]

Check d=5: pick 1 → next ≥ 6 → pick 8 → next ≥ 13 → pick 13 ✓ (3 picked)
Check d=8: pick 1 → next ≥ 9 → pick 13 → next ≥ 21 → pick 21 ✓ (3 picked)
Check d=11: pick 1 → next ≥ 12 → pick 13 → next ≥ 24 → none ✗

Answer: 8
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Binary search on answer** — khi answer là monotone (feasible cho d nhỏ → feasible cho d lớn hơn chưa chắc), search trên khoảng / binary search works when feasibility is monotone
- 🇻🇳 **Greedy feasibility check** — sort rồi greedy chọn phần tử đầu tiên thỏa mãn khoảng cách / greedy: pick first valid element at each step
- 🇻🇳 **Search range** — lo=0, hi=(max-min)/(k-1) vì tối đa có k-1 khoảng / search range is [0, (max-min)/(k-1)]
- 🇻🇳 **"Minimum of maximum gap"** — dạng bài tìm min-gap lớn nhất, pattern phổ biến / maximize-minimum-gap is a classic binary search pattern
- 🇻🇳 **k=1 edge case** — một kẹo thì tastiness = 0 (không có cặp) / k=1 means no pair, tastiness = 0
- 🇻🇳 **Greedy O(n) mỗi check** — tổng O(n log(max)) / each feasibility check is O(n), total O(n log(max))

---

## Solutions

### Solution 1: Binary Search on Tastiness — O(n log n + n log(max))

```typescript
/**
 * Binary search on minimum gap d, greedy feasibility check
 * Time: O(n log n + n log(maxVal))  Space: O(1)
 */
function maximumTastiness(price: number[], k: number): number {
  price.sort((a, b) => a - b);
  const n = price.length;

  function canAchieve(minGap: number): boolean {
    let count = 1;
    let last = price[0];
    for (let i = 1; i < n; i++) {
      if (price[i] - last >= minGap) {
        count++;
        last = price[i];
        if (count >= k) return true;
      }
    }
    return count >= k;
  }

  let lo = 0,
    hi = price[n - 1] - price[0];
  // If k=1, no pairs, tastiness = 0
  if (k === 1) return 0;

  let ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (canAchieve(mid)) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
}

console.log(maximumTastiness([13, 5, 1, 8, 21, 2], 3)); // 8
console.log(maximumTastiness([1, 3, 1], 2)); // 2
console.log(maximumTastiness([7, 7, 7, 7], 2)); // 0
```

### Solution 2: Binary Search with Tighter Bounds — O(n log n + n log((max-min)/(k-1)))

```typescript
/**
 * Tighter upper bound: (max-min)/(k-1) since k-1 gaps among k items
 * Time: O(n log n + n log((max-min)/(k-1)))  Space: O(1)
 */
function maximumTastiness2(price: number[], k: number): number {
  if (k === 1) return 0;
  price.sort((a, b) => a - b);
  const n = price.length;

  function feasible(gap: number): boolean {
    let chosen = 1,
      prev = price[0];
    for (let i = 1; i < n && chosen < k; i++) {
      if (price[i] - prev >= gap) {
        chosen++;
        prev = price[i];
      }
    }
    return chosen >= k;
  }

  let lo = 0,
    hi = Math.floor((price[n - 1] - price[0]) / (k - 1));
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1; // upper mid to avoid infinite loop
    if (feasible(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

console.log(maximumTastiness2([13, 5, 1, 8, 21, 2], 3)); // 8
console.log(maximumTastiness2([1, 3, 1], 2)); // 2
console.log(maximumTastiness2([7, 7, 7, 7], 2)); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                                    | Difficulty | Pattern                 |
| ---------------------------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| [Magnetic Force Between Two Balls](https://leetcode.com/problems/magnetic-force-between-two-balls)         | 🟡 Medium  | Binary Search on Answer |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)                                   | 🟡 Medium  | Binary Search on Answer |
| [Minimize Max Distance to Gas Station](https://leetcode.com/problems/minimize-max-distance-to-gas-station) | 🔴 Hard    | Binary Search on Answer |
| [Capacity To Ship Packages](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days)         | 🟡 Medium  | Binary Search on Answer |
