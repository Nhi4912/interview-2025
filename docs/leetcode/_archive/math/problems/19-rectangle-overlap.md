---
layout: page
title: "Rectangle Overlap"
difficulty: Easy
category: Math
tags: [Math, Geometry]
leetcode_url: "https://leetcode.com/problems/rectangle-overlap"
---

# Rectangle Overlap / Kiểm Tra Hai Hình Chữ Nhật Giao Nhau

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math / Geometry
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line) | [Rectangle Area](https://leetcode.com/problems/rectangle-area)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hai tờ giấy trên bàn giao nhau khi và chỉ khi hình chiếu của chúng lên cả hai trục đều giao nhau. Nếu một tờ hoàn toàn bên trái/phải/trên/dưới tờ kia thì không giao.

**Pattern Recognition:**

- Signal: "axis-aligned rectangles" + "do they overlap?" → **Interval overlap on both axes**
- NOT overlap = tách biệt theo x OR tách biệt theo y
- Overlap = chiều rộng giao > 0 VÀ chiều cao giao > 0

**Visual — Overlap Check:**

```
rec1 = [x1,y1,x2,y2]   rec2 = [a1,b1,a2,b2]

X-overlap:  max(x1,a1) < min(x2,a2)   ← strictly less (area > 0)
Y-overlap:  max(y1,b1) < min(y2,b2)

No X-overlap cases:  |--rec1--|  |--rec2--|   or   |--rec2--|  |--rec1--|
                     x2 ≤ a1                        a2 ≤ x1
```

---

## Problem Description

Given two axis-aligned rectangles `rec1 = [x1,y1,x2,y2]` and `rec2 = [x1,y1,x2,y2]` (bottom-left and top-right corners), return `true` if they overlap (share positive area). ([LeetCode #836](https://leetcode.com/problems/rectangle-overlap))

Difficulty: Easy | Acceptance: 45.7%

- **Example 1**: `rec1=[0,0,2,2]`, `rec2=[1,1,3,3]` → `true`
- **Example 2**: `rec1=[0,0,1,1]`, `rec2=[1,0,2,1]` → `false` (touching edges, no area)
- **Example 3**: `rec1=[0,0,1,1]`, `rec2=[2,2,3,3]` → `false`

Constraints:

- `rect[i]` are integers in `[-10⁹, 10⁹]`
- `rect[0] < rect[2]`, `rect[1] < rect[3]` guaranteed

---

## 📝 Interview Tips

1. **Clarify**: "Touching edges (zero area) có tính là overlap không?" / Touching at edge = no positive area = false
2. **Complement trick**: "Dễ hơn khi xét khi nào KHÔNG overlap, rồi negate" / Check non-overlap conditions, then negate
3. **Non-overlap**: "rec1 hoàn toàn bên trái/phải/trên/dưới rec2 → 4 conditions" / Four separation cases
4. **One-liner**: "Dùng interval intersection: overlap iff max(lefts) < min(rights) on both axes" / Compact formula
5. **Edge cases**: "Zero-area rectangle không thể overlap với bất kỳ rect nào" / Guaranteed non-zero by constraints

---

## Solutions

```typescript
/**
 * Solution 1: Check Non-Overlap (Complement)
 * Time: O(1) — constant comparisons
 * Space: O(1)
 *
 * NOT overlap when rec1 is entirely left/right/above/below rec2
 */
function isRectangleOverlapComplement(rec1: number[], rec2: number[]): boolean {
  const [x1, y1, x2, y2] = rec1;
  const [a1, b1, a2, b2] = rec2;
  // Separated horizontally or vertically → no overlap
  const separated = x2 <= a1 || a2 <= x1 || y2 <= b1 || b2 <= y1;
  return !separated;
}

/**
 * Solution 2: Interval Intersection Formula — Optimal
 * Time: O(1) — four comparisons
 * Space: O(1)
 *
 * Overlap iff projections on BOTH axes have positive length:
 *   X: max(x1,a1) < min(x2,a2)
 *   Y: max(y1,b1) < min(y2,b2)
 */
function isRectangleOverlap(rec1: number[], rec2: number[]): boolean {
  return (
    Math.max(rec1[0], rec2[0]) < Math.min(rec1[2], rec2[2]) &&
    Math.max(rec1[1], rec2[1]) < Math.min(rec1[3], rec2[3])
  );
}

// === Test Cases ===
console.log(isRectangleOverlap([0, 0, 2, 2], [1, 1, 3, 3])); // true
console.log(isRectangleOverlap([0, 0, 1, 1], [1, 0, 2, 1])); // false (touching edge)
console.log(isRectangleOverlap([0, 0, 1, 1], [2, 2, 3, 3])); // false (disjoint)
console.log(isRectangleOverlap([0, 0, 3, 3], [1, 1, 2, 2])); // true  (rec2 inside rec1)
console.log(isRectangleOverlapComplement([0, 0, 2, 2], [1, 1, 3, 3])); // true
```

---

## 🔗 Related Problems

- [Rectangle Area](https://leetcode.com/problems/rectangle-area) — compute total area of two rectangles (uses same overlap logic)
- [Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line) — geometry with coordinates
- [Minimum Area Rectangle](https://leetcode.com/problems/minimum-area-rectangle) — axis-aligned geometry
- [Count Squares](https://leetcode.com/problems/count-square-submatrices-with-all-ones) — rectangle counting in grids
- [Maximum Number of Visible Points](https://leetcode.com/problems/maximum-number-of-visible-points) — angle-based geometry
