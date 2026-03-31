---
layout: page
title: "Minimum Time Difference"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Math, String, Sorting]
leetcode_url: "https://leetcode.com/problems/minimum-time-difference"
---

# Minimum Time Difference / Hiệu Thời Gian Tối Thiểu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Minimize Rounding Error to Meet Target](https://leetcode.com/problems/minimize-rounding-error-to-meet-target) | [Largest Number](https://leetcode.com/problems/largest-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng đồng hồ tròn — khoảng cách giữa hai điểm trên vòng tròn có thể đi theo chiều kim đồng hồ hoặc ngược chiều. Khoảng cách nhỏ nhất là `min(diff, 1440 - diff)` trong đó 1440 = 24×60 phút. Sắp xếp rồi kiểm tra từng cặp kề nhau + cặp vòng tròn.

**Pattern Recognition:**

- Convert "HH:MM" → phút (0..1439)
- Sort, kiểm tra consecutive differences
- Đừng quên **wrap-around**: khoảng cách từ phần tử cuối trở lại phần tử đầu

**Visual — timePoints=["23:59","00:00"]:**

```
Convert: [1439, 0]
Sort:    [0, 1439]
Consecutive: 1439 - 0 = 1439
Wrap-around: 1440 - 1439 = 1 ← minimum!
Result: 1 ✅

Pigeonhole: nếu n > 1440 → luôn có duplicate → return 0
```

---

## Problem Description

Given a list of 24-hour clock time strings `timePoints` in "HH:MM" format, return the **minimum difference** in minutes between any two time points (the clock is circular — 00:00 and 23:59 are 1 minute apart).

- Example 1: `timePoints = ["23:59","00:00"]` → `1`
- Example 2: `timePoints = ["00:00","23:59","00:00"]` → `0`

---

## 📝 Interview Tips

1. **Pigeonhole**: "Nếu n > 1440 thì chắc chắn có duplicate → return 0 ngay" / n > 1440 → duplicate exists → return 0
2. **Convert first**: "Convert sang minutes trước: HH\*60 + MM" / Convert to minutes then sort
3. **Wrap-around**: "Không quên khoảng cách từ timePoints[last] đến timePoints[0] qua 00:00" / Check circular gap
4. **Formula**: "gap circular = 1440 - (last - first)" / Circular gap = 1440 - (sorted[n-1] - sorted[0])
5. **Edge case**: "Hai thời điểm giống nhau → diff = 0; một phần tử → không có ý nghĩa" / Same times → 0
6. **Follow-up**: "Mở rộng cho n ngày (> 24h)?" / What if time spans multiple days?

---

## Solutions

```typescript
/**
 * Solution 1: Convert to minutes + Sort + Check consecutive + wrap-around
 * Time: O(n log n) — sorting
 * Space: O(n) — minutes array
 */
function findMinDifference(timePoints: string[]): number {
  // Pigeonhole optimization
  if (timePoints.length > 1440) return 0;

  const minutes = timePoints.map((tp) => {
    const [hh, mm] = tp.split(":").map(Number);
    return hh * 60 + mm;
  });

  minutes.sort((a, b) => a - b);

  let minDiff = Infinity;
  // Check consecutive pairs
  for (let i = 1; i < minutes.length; i++) {
    minDiff = Math.min(minDiff, minutes[i] - minutes[i - 1]);
  }
  // Check wrap-around (circular)
  const circular = 1440 - minutes[minutes.length - 1] + minutes[0];
  minDiff = Math.min(minDiff, circular);

  return minDiff;
}

/**
 * Solution 2: Bucket sort (O(1440) space) — O(n) time
 * Time: O(n + 1440) = O(n)
 * Space: O(1440) = O(1) — fixed size bucket
 */
function findMinDifference2(timePoints: string[]): number {
  const TOTAL = 1440;
  const seen = new Array<boolean>(TOTAL).fill(false);

  for (const tp of timePoints) {
    const [hh, mm] = tp.split(":").map(Number);
    const t = hh * 60 + mm;
    if (seen[t]) return 0; // duplicate
    seen[t] = true;
  }

  let minDiff = TOTAL;
  let prev = -1,
    first = -1;

  for (let t = 0; t < TOTAL; t++) {
    if (!seen[t]) continue;
    if (first === -1) {
      first = t;
    } else minDiff = Math.min(minDiff, t - prev);
    prev = t;
  }
  // Wrap-around
  if (first !== -1 && prev !== -1) minDiff = Math.min(minDiff, TOTAL - prev + first);

  return minDiff;
}

// === Test Cases ===
console.log(findMinDifference(["23:59", "00:00"])); // 1
console.log(findMinDifference(["00:00", "23:59", "00:00"])); // 0
console.log(findMinDifference(["05:31", "22:08", "00:35"])); // 147
console.log(findMinDifference2(["23:59", "00:00"])); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                  | Pattern                | Difficulty |
| ---------------------------------------------------------------------------------------- | ---------------------- | ---------- |
| [Largest Number](https://leetcode.com/problems/largest-number)                           | Custom Comparator Sort | Medium     |
| [Missing Ranges](https://leetcode.com/problems/missing-ranges)                           | Linear Scan            | Easy       |
| [Next Permutation](https://leetcode.com/problems/next-permutation)                       | Array Manipulation     | Medium     |
| [Minimum Absolute Difference](https://leetcode.com/problems/minimum-absolute-difference) | Sort + Adjacent Diff   | Easy       |
