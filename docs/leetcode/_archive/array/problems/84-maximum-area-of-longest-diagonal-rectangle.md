---
layout: page
title: "Maximum Area of Longest Diagonal Rectangle"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/maximum-area-of-longest-diagonal-rectangle"
---

# Maximum Area of Longest Diagonal Rectangle / Diện Tích Lớn Nhất Của Hình Chữ Nhật Có Đường Chéo Dài Nhất

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Array
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) | [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chọn tấm kính lớn nhất từ kho — đường chéo dài nhất (Pythagoras: `l²+w²`) quyết định "kích thước", nhưng nếu hai tấm có đường chéo bằng nhau thì chọn tấm có diện tích `l×w` lớn hơn.

```
dims = [[9,3],[8,6]]
Diagonal² of [9,3] = 81+9  = 90
Diagonal² of [8,6] = 64+36 = 100 ← longer diagonal
Area = 8×6 = 48

dims = [[3,4],[4,3]]
Diagonal² = 25 = 25 (tie!)
Area [3,4] = 12, Area [4,3] = 12 → either, pick max = 12
```

---

## Problem Description

Given a 2D array `dimensions` where `dimensions[i] = [length, width]`, return the **area** of the rectangle that has the **longest diagonal**. If multiple rectangles share the longest diagonal, return the one with the **largest area**.

- Example 1: `dimensions = [[9,3],[8,6]]` → `48` (diag² 90 vs 100 — [8,6] wins, area=48)
- Example 2: `dimensions = [[3,4],[4,3]]` → `12` (same diag, same area=12)

Constraints: `1 <= dimensions.length <= 100`, `1 <= length, width <= 10^4`

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "Nếu hai hình chữ nhật có đường chéo bằng nhau thì chọn cái nào?" / Pick larger area on tie — confirm this rule.
2. **Key insight / Chìa khóa**: "Không cần căn bậc hai — so sánh `l²+w²` trực tiếp là đủ" / Compare diagonal² to avoid floating-point issues.
3. **Tie-breaking / Xử lý hòa**: "Dùng tuple `(diag², area)` và so sánh theo cặp" / Track best as `(maxDiagSq, maxArea)` and update both on ties.
4. **Edge case / Trường hợp đặc biệt**: "Mảng 1 phần tử: trả về diện tích của nó" / Single rectangle is always the winner.
5. **Complexity / Độ phức tạp**: "O(n) time, O(1) space — một lần duyệt" / Simple linear scan.
6. **Follow-up / Câu hỏi tiếp theo**: "Nếu cần trả về cả chiều dài và chiều rộng?" / Return the full `[l, w]` pair instead of just area.

---

## Solutions

```typescript
/**
 * Solution 1: Single Pass tracking (maxDiagSq, maxArea)
 * Time: O(n) — one pass through dimensions
 * Space: O(1) — two variables only
 */
function areaOfMaxDiagonal(dimensions: number[][]): number {
  let maxDiagSq = 0;
  let maxArea = 0;

  for (const [l, w] of dimensions) {
    const diagSq = l * l + w * w;
    const area = l * w;

    if (diagSq > maxDiagSq) {
      maxDiagSq = diagSq;
      maxArea = area;
    } else if (diagSq === maxDiagSq) {
      maxArea = Math.max(maxArea, area);
    }
  }

  return maxArea;
}

/**
 * Solution 2: Sort-based approach (more readable, slightly slower)
 * Time: O(n log n) — sorting by diagonal then area
 * Space: O(n) — sorted copy
 */
function areaOfMaxDiagonalSort(dimensions: number[][]): number {
  const sorted = [...dimensions].sort((a, b) => {
    const diagDiff = b[0] * b[0] + b[1] * b[1] - (a[0] * a[0] + a[1] * a[1]);
    return diagDiff !== 0 ? diagDiff : b[0] * b[1] - a[0] * a[1];
  });
  return sorted[0][0] * sorted[0][1];
}

// === Test Cases ===
console.log(
  areaOfMaxDiagonal([
    [9, 3],
    [8, 6],
  ]),
); // 48
console.log(
  areaOfMaxDiagonal([
    [3, 4],
    [4, 3],
  ]),
); // 12
console.log(
  areaOfMaxDiagonal([
    [4, 10],
    [4, 9],
    [9, 3],
    [6, 4],
  ]),
); // 40
console.log(
  areaOfMaxDiagonalSort([
    [9, 3],
    [8, 6],
  ]),
); // 48
```

---

## 🔗 Related Problems

| Problem                                                                                        | Pattern          | Difficulty |
| ---------------------------------------------------------------------------------------------- | ---------------- | ---------- |
| [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) | Stack + area     | 🔴 Hard    |
| [Maximal Square](https://leetcode.com/problems/maximal-square)                                 | DP on matrix     | 🟡 Medium  |
| [Container With Most Water](https://leetcode.com/problems/container-with-most-water)           | Two-pointer area | 🟡 Medium  |
| [Rectangle Area](https://leetcode.com/problems/rectangle-area)                                 | Geometry math    | 🟡 Medium  |
