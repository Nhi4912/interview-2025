---
layout: page
title: "Minimum Number of Days to Make m Bouquets"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets"
---

# Minimum Number of Days to Make m Bouquets / Số Ngày Tối Thiểu Để Làm m Bó Hoa

> **Track**: Sorting-Searching | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search on Answer
> **Frequency**: ★★★ Common — classic "binary search on answer" template
> **See also**: [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) | [Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn muốn biết: "Nếu đợi đúng d ngày, tôi có đủ hoa để làm m bó không?" Câu trả lời là một hàm đơn điệu: nếu d ngày đủ thì d+1 ngày cũng đủ. Đây chính là tín hiệu để dùng binary search trên miền kết quả [1, max(bloomDay)], thay vì duyệt từng ngày.

**Pattern Recognition:**

- Signal: "minimum days/speed/weight" + "feasibility check is monotone" → **Binary Search on Answer**
- Bài này thuộc dạng binary search trên kết quả — kiểm tra tính khả thi cho từng giá trị mid
- Key insight: Hàm `canMake(day)` là monotone → binary search thay vì linear scan

**Visual — Binary search on days:**

```
bloomDay=[1,10,3,10,2], m=3, k=1
Days range: [1..10]

mid=5: flowers bloomed = [1, _, 3, _, 2] → bouquets = 3 ≥ m ✓ → try fewer: hi=5
mid=2: flowers bloomed = [1, _, _, _, 2] → bouquets = 2 < m  ✗ → need more: lo=3
mid=3: flowers bloomed = [1, _, 3, _, 2] → bouquets = 3 ≥ m ✓ → try fewer: hi=3
lo=hi=3 → answer = 3
```

---

## Problem Description

You have `n` flowers blooming on day `bloomDay[i]`. To make one bouquet you need `k` **adjacent** bloomed flowers. Return the **minimum number of days** to make `m` bouquets, or -1 if impossible. ([LeetCode](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets))

```
Example 1: bloomDay=[1,10,3,10,2], m=3, k=1  → 3
Example 2: bloomDay=[1,10,3,10,2], m=3, k=2  → -1
Example 3: bloomDay=[7,7,7,7,12,7,7],m=2,k=3 → 12
```

Constraints: `bloomDay.length == n`, `1 <= n, m*k <= 10^9`, `1 <= bloomDay[i] <= 10^9`

---

## 📝 Interview Tips

1. **Check m\*k > n early → return -1** — _Nếu cần nhiều hoa hơn tổng số hoa, không thể làm được_
2. **Binary search range: [1, max(bloomDay)]** — _Ngày tối thiểu là 1, tối đa là ngày nở hoa muộn nhất_
3. **Feasibility check: count consecutive bloomed groups** — _Đếm số nhóm k hoa liên tiếp đã nở sau mid ngày_
4. **Monotone property: if mid works, mid+1 also works** — _Tính đơn điệu đảm bảo binary search đúng_
5. **Reset consecutive counter when flower not bloomed** — _Reset counter khi gặp hoa chưa nở_
6. **Time O(n log D), Space O(1)** — _n phần tử × log(max day) bước binary search_

---

## Solutions

```typescript
/** Solution 1: Linear scan O(n * maxDay) @complexity Time: O(n·D) | Space: O(1) */
function minDaysLinear(bloomDay: number[], m: number, k: number): number {
  const maxDay = Math.max(...bloomDay);
  for (let day = 1; day <= maxDay; day++) {
    let bouquets = 0,
      consecutive = 0;
    for (const d of bloomDay) {
      if (d <= day) {
        if (++consecutive === k) {
          bouquets++;
          consecutive = 0;
        }
      } else {
        consecutive = 0;
      }
    }
    if (bouquets >= m) return day;
  }
  return -1;
}

/** Solution 2: Binary Search on Answer @complexity Time: O(n log D) | Space: O(1) */
function minDays(bloomDay: number[], m: number, k: number): number {
  const n = bloomDay.length;
  if (m * k > n) return -1; // impossible

  const canMake = (day: number): boolean => {
    let bouquets = 0,
      consecutive = 0;
    for (const d of bloomDay) {
      if (d <= day) {
        if (++consecutive === k) {
          bouquets++;
          consecutive = 0;
        }
      } else {
        consecutive = 0;
      }
    }
    return bouquets >= m;
  };

  let lo = 1,
    hi = Math.max(...bloomDay);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (canMake(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// === Test Cases ===
console.log(minDays([1, 10, 3, 10, 2], 3, 1)); // 3
console.log(minDays([1, 10, 3, 10, 2], 3, 2)); // -1
console.log(minDays([7, 7, 7, 7, 12, 7, 7], 2, 3)); // 12
```

---

## 🔗 Related Problems

| #   | Problem                                                                                             | Difficulty | Pattern                 |
| --- | --------------------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| 1   | [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)                           | Medium     | Binary Search on Answer |
| 2   | [Capacity to Ship Packages](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) | Medium     | Binary Search on Answer |
| 3   | [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/)                   | Hard       | Binary Search           |
| 4   | [Magnetic Force Between Two Balls](https://leetcode.com/problems/magnetic-force-between-two-balls/) | Medium     | Binary Search on Answer |
