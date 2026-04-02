---
layout: page
title: "Maximum Square Area by Removing Fences From a Field"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Enumeration]
leetcode_url: "https://leetcode.com/problems/maximum-square-area-by-removing-fences-from-a-field"
---

# Maximum Square Area by Removing Fences From a Field / Diện Tích Hình Vuông Lớn Nhất Sau Khi Bỏ Hàng Rào

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Phép so sánh tiếng Việt:** Bạn có một cánh đồng được chia bởi các hàng rào ngang và dọc. Bạn có thể bỏ hàng rào đi (nhưng phải giữ biên). Mục tiêu: tạo ra ô vuông lớn nhất. Bí quyết: liệt kê tất cả "khoảng cách hàng rào" theo chiều ngang và dọc, tìm khoảng cách chung — đó chính là cạnh hình vuông.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximum Square Area by Removing Fences From a Field example:**

```
m=4, n=4, hFences=[2], vFences=[2]
Hàng rào ngang: [0, 2, 4-1=3] → khoảng cách: {2,3,1}
                  thực ra: boundaries = [0] + hFences + [m-1] = [0,2,3]
Hàng rào dọc:   [0] + vFences + [n-1] = [0,2,3]

Khoảng cách ngang: 2-0=2, 3-0=3, 3-2=1
Khoảng cách dọc:   2-0=2, 3-0=3, 3-2=1

Giao: {1,2,3}  → max = 3 → area = 3*3 = 9
```

---

## Problem Description

---

## 📝 Interview Tips

1. **Thêm biên**: Nhớ thêm `0` và `m-1` (hoặc `n-1`) vào danh sách hàng rào trước khi tính khoảng cách.
2. **Khoảng cách, không phải tọa độ**: Enumerate tất cả pair (i, j) với i < j, khoảng cách = fences[j] - fences[i].
3. **Hash Set cho intersection**: Lưu tất cả khoảng cách theo một chiều vào Set, kiểm tra chiều kia.
4. **Sort trước**: Sau khi thêm biên, sort array để duyệt cặp có thứ tự.
5. **MOD 1e9+7**: Kết quả có thể rất lớn. Áp dụng modulo khi trả về.
6. **Trả về -1 nếu không tìm được**: Nếu không có khoảng cách chung → return -1.

---

## Solutions

```typescript
/**
 * Approach 1: Enumerate all gaps, find intersection
 * Time: O(H² + V²)  Space: O(H² + V²)
 * H = hFences.length + 2, V = vFences.length + 2
 */
function maximizeSquareArea(m: number, n: number, hFences: number[], vFences: number[]): number {
  const MOD = 1_000_000_007n;

  function allGaps(fences: number[], maxBound: number): Set<number> {
    const sorted = [0, ...fences, maxBound - 1].sort((a, b) => a - b);
    const gaps = new Set<number>();
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        gaps.add(sorted[j] - sorted[i]);
      }
    }
    return gaps;
  }

  const hGaps = allGaps(hFences, m);
  const vGaps = allGaps(vFences, n);

  let maxSide = -1;
  for (const gap of hGaps) {
    if (vGaps.has(gap)) {
      maxSide = Math.max(maxSide, gap);
    }
  }

  if (maxSide === -1) return -1;

  return Number((BigInt(maxSide) * BigInt(maxSide)) % MOD);
}

// Tests
console.log(maximizeSquareArea(4, 3, [2], [2])); // 4
console.log(maximizeSquareArea(6, 7, [2], [4])); // -1 (no common gap)
console.log(maximizeSquareArea(3, 3, [], [])); // 4

/**
 * Approach 2: Tối ưu — dùng sorted array, chỉ track max common gap
 * Time: O(H² + V² + H²logH)  Space: O(H + V)
 *
 * Thay vì lưu toàn bộ gaps, chỉ cần check intersection
 */
function maximizeSquareAreaOpt(m: number, n: number, hFences: number[], vFences: number[]): number {
  const MOD = 1_000_000_007n;

  function getGapSet(fences: number[], limit: number): Set<number> {
    const sorted = [0, ...fences, limit - 1].sort((a, b) => a - b);
    const set = new Set<number>();
    const len = sorted.length;
    for (let i = 0; i < len - 1; i++) {
      for (let j = i + 1; j < len; j++) {
        set.add(sorted[j] - sorted[i]);
      }
    }
    return set;
  }

  const hSet = getGapSet(hFences, m);
  const vSet = getGapSet(vFences, n);

  // Chỉ iterate qua set nhỏ hơn để tối ưu
  const [smallSet, largeSet] = hSet.size <= vSet.size ? [hSet, vSet] : [vSet, hSet];

  let maxSide = -1;
  for (const gap of smallSet) {
    if (largeSet.has(gap) && gap > maxSide) {
      maxSide = gap;
    }
  }

  if (maxSide === -1) return -1;
  return Number((BigInt(maxSide) * BigInt(maxSide)) % MOD);
}

// Tests
console.log(maximizeSquareAreaOpt(4, 3, [2], [2])); // 4
console.log(maximizeSquareAreaOpt(6, 7, [2], [4])); // -1
console.log(maximizeSquareAreaOpt(100, 100, [50], [50])); // 2500 (50*50 mod 1e9+7)

/**
 * Approach 3: Tách biệt logic, thêm comment tường minh
 * Time: O(H² + V²)  Space: O(H² + V²)
 */
function maximizeSquareAreaClear(
  m: number,
  n: number,
  hFences: number[],
  vFences: number[],
): number {
  const MOD = 1_000_000_007n;

  /** Tính tất cả khoảng cách có thể giữa các cặp hàng rào */
  function computeGaps(fences: number[], boundary: number): Set<number> {
    // Thêm biên vào: ô đầu tiên = 0, ô cuối = boundary - 1
    const walls = [0, ...fences, boundary - 1].sort((a, b) => a - b);
    const gaps = new Set<number>();

    for (let i = 0; i < walls.length; i++) {
      for (let j = i + 1; j < walls.length; j++) {
        gaps.add(walls[j] - walls[i]); // gap = số ô giữa hai hàng rào
      }
    }
    return gaps;
  }

  const rowGaps = computeGaps(hFences, m); // khoảng ngang (chiều dọc grid)
  const colGaps = computeGaps(vFences, n); // khoảng dọc (chiều ngang grid)

  // Tìm khoảng cách lớn nhất xuất hiện ở cả hai chiều
  let best = -1;
  for (const gap of rowGaps) {
    if (colGaps.has(gap)) best = Math.max(best, gap);
  }

  if (best === -1) return -1;

  // Diện tích = cạnh^2, apply modulo
  const side = BigInt(best);
  return Number((side * side) % MOD);
}

// Tests
console.log(maximizeSquareAreaClear(4, 3, [2], [2])); // 4
console.log(maximizeSquareAreaClear(6, 7, [2], [4])); // -1
console.log(maximizeSquareAreaClear(3, 3, [], [])); // 4 (cạnh=2: 0→2)
console.log(maximizeSquareAreaClear(1000000000, 1000000000, [2], [2])); // 4
```

---

## 🔗 Related Problems

| Problem                                                                                                        | Difficulty | Pattern               |
| -------------------------------------------------------------------------------------------------------------- | ---------- | --------------------- |
| [Count Square Submatrices with All Ones](https://leetcode.com/problems/count-square-submatrices-with-all-ones) | Medium     | DP on 2D              |
| [Maximal Square](https://leetcode.com/problems/maximal-square)                                                 | Medium     | DP                    |
| [Minimum Area Rectangle](https://leetcode.com/problems/minimum-area-rectangle)                                 | Medium     | Hash Set, Enumeration |
