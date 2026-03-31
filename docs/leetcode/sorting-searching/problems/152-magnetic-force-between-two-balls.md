---
layout: page
title: "Magnetic Force Between Two Balls"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/magnetic-force-between-two-balls"
---

# Magnetic Force Between Two Balls / Lực Từ Giữa Hai Bóng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search on Answer
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Maximum Tastiness of Candy Basket](https://leetcode.com/problems/maximum-tastiness-of-candy-basket) | [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có m viên bi nam châm cần đặt vào m trong n vị trí sao cho khoảng cách nhỏ nhất giữa hai bi bất kỳ là _lớn nhất có thể_. Tìm trực tiếp rất khó, nhưng binary search trên khoảng cách tối thiểu: "Với khoảng cách tối thiểu = mid, có thể đặt đủ m viên bi không?"

```
position = [1,2,3,4,7], m = 3
Sort: [1, 2, 3, 4, 7]

Binary search on force in [1, (7-1)/(3-1)] = [1, 3]

Check force=2: place at 1 → next ≥ 3 → place at 3 → next ≥ 5 → place at 7 ✓
Check force=3: place at 1 → next ≥ 4 → place at 4 → next ≥ 7 → place at 7 ✓
Check force=4: place at 1 → next ≥ 5 → place at 7 → next ≥ 11 → none ✗

Answer: 3
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **"Maximize minimum distance"** — classic binary search on answer pattern / tối đa hóa khoảng cách nhỏ nhất = binary search
- 🇻🇳 **Greedy placement** — luôn đặt bi vào vị trí hợp lệ sớm nhất (greedy optimal) / greedy: place ball at earliest valid position
- 🇻🇳 **Monotone property** — nếu force=d khả thi thì force=d-1 cũng khả thi / if d works, d-1 also works → binary search
- 🇻🇳 **Sort là bắt buộc** — vị trí không theo thứ tự thì greedy không đúng / positions must be sorted for greedy to work
- 🇻🇳 **Upper bound** — (max-min)/(m-1) là khoảng cách tối đa có thể đạt / (max-min)/(m-1) is theoretical upper bound
- 🇻🇳 **m=1** — chỉ một bi, khoảng cách = 0, nhưng theo definition force = 0 / single ball means no pair, force = 0

---

## Solutions

### Solution 1: Binary Search on Minimum Force — O(n log n + n log(max))

```typescript
/**
 * Binary search on minimum distance, greedy feasibility
 * Time: O(n log n + n log(max-min))  Space: O(1)
 */
function maxDistance(position: number[], m: number): number {
  position.sort((a, b) => a - b);
  const n = position.length;

  function canPlace(minDist: number): boolean {
    let count = 1;
    let last = position[0];
    for (let i = 1; i < n; i++) {
      if (position[i] - last >= minDist) {
        count++;
        last = position[i];
        if (count >= m) return true;
      }
    }
    return count >= m;
  }

  let lo = 1,
    hi = Math.floor((position[n - 1] - position[0]) / (m - 1));
  let ans = 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (canPlace(mid)) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
}

console.log(maxDistance([1, 2, 3, 4, 7], 3)); // 3
console.log(maxDistance([5, 4, 3, 2, 1, 1000000000], 2)); // 999999999
console.log(maxDistance([1, 2, 4, 8, 9], 4)); // 1
```

### Solution 2: Upper-mid Binary Search — O(n log n + n log((max-min)/(m-1)))

```typescript
/**
 * Alternative loop form using upper-mid to find last true value
 * Time: O(n log n + n log((max-min)/(m-1)))  Space: O(1)
 */
function maxDistance2(position: number[], m: number): number {
  if (m === 1) return 0;
  position.sort((a, b) => a - b);
  const n = position.length;

  const canPlace = (gap: number): boolean => {
    let placed = 1,
      prev = position[0];
    for (let i = 1; i < n; i++) {
      if (position[i] - prev >= gap) {
        placed++;
        prev = position[i];
      }
      if (placed === m) return true;
    }
    return false;
  };

  // Find last d where canPlace(d) is true
  let lo = 1,
    hi = Math.floor((position[n - 1] - position[0]) / (m - 1));
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo + 1) / 2); // upper mid
    if (canPlace(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

console.log(maxDistance2([1, 2, 3, 4, 7], 3)); // 3
console.log(maxDistance2([5, 4, 3, 2, 1, 1000000000], 2)); // 999999999
```

### Solution 3: Explicit Bounds with Comments — O(n log n + n log D)

```typescript
/**
 * Annotated version for interview clarity
 * Time: O(n log n + n log D) where D = (max-min)/(m-1)  Space: O(1)
 */
function maxDistance3(position: number[], m: number): number {
  position.sort((a, b) => a - b);
  const n = position.length;

  // Can we place m balls with minimum gap = gap?
  const check = (gap: number): boolean => {
    let balls = 1,
      last = position[0];
    for (let i = 1; i < n; i++) {
      if (position[i] - last >= gap) {
        balls++;
        last = position[i];
      }
    }
    return balls >= m;
  };

  // Binary search: largest gap where check is true
  let lo = 1,
    hi = position[n - 1] - position[0],
    ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (check(mid)) {
      ans = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return ans;
}

console.log(maxDistance3([1, 2, 3, 4, 7], 3)); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                              | Difficulty | Pattern                 |
| ---------------------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| [Maximum Tastiness of Candy Basket](https://leetcode.com/problems/maximum-tastiness-of-candy-basket) | 🟡 Medium  | Binary Search on Answer |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)                             | 🟡 Medium  | Binary Search on Answer |
| [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum)                     | 🔴 Hard    | Binary Search on Answer |
| [Aggressive Cows](https://www.spoj.com/problems/AGGRCOW/)                                            | Classic    | Binary Search on Answer |
