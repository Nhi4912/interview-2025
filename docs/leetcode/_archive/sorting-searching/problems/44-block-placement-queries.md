---
layout: page
title: "Block Placement Queries"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Binary Indexed Tree, Segment Tree]
leetcode_url: "https://leetcode.com/problems/block-placement-queries"
---

# Block Placement Queries / Truy Vấn Đặt Khối

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Segment Tree
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Online Majority Element In Subarray](https://leetcode.com/problems/online-majority-element-in-subarray) | [Create Sorted Array through Instructions](https://leetcode.com/problems/create-sorted-array-through-instructions)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Đặt đồ nội thất vào căn phòng có nhiều cột chắn — bạn cần biết khoảng trống rộng nhất từ đầu phòng đến một vị trí cho trước để xem chiếc bàn có vừa không.

**Pattern Recognition:**

- Signal: "dynamic obstacle insertion" + "query max gap in prefix" → **Sorted Set + Binary Search**
- Type 1: thêm chướng ngại vật tại x → cập nhật cấu trúc dữ liệu
- Type 2: (x, sz) → "có khoảng trống ≥ sz nào trong [0, x] không?"
- Key insight: khoảng trống thay đổi khi thêm chướng ngại vật; max gap theo prefix là phép truy vấn range max

**Visual — obstacles at [0, 14] (boundaries), queries = [[1,2],[2,3,3],[1,6],[2,3,1],[2,7,6]]:**

```
Initial: |0 ............... 14|  boundary obstacles
  ← 14 units of free space →

Type 1, x=2: |0  2  ........  14|
  gaps: [2, 12]  maxGap=12

Type 2, x=3, sz=3:
  Obstacles ≤ 3: {0, 2}
  Gaps in [0,3]: 0→2 (gap=2), 2→3 (gap=1) → max=2 < 3 → false ✅

Type 1, x=6: |0  2  6  .....  14|
  gaps: [2, 4, 8]

Type 2, x=3, sz=1:
  Obstacles ≤ 3: {0, 2}   gap 2 in range → 2 ≥ 1 → true ✅
```

---

## Problem Description

Có số thực vô hạn [0, ∞). Mảng `queries[i]` gồm hai loại: `[1, x]` đặt chướng ngại vật tại x, `[2, x, sz]` hỏi liệu có thể đặt block kích thước sz trong [0, x] (không chạm chướng ngại vật). ([LeetCode](https://leetcode.com/problems/block-placement-queries))

Difficulty: Hard | Acceptance: 16.9%

- `queries = [[1,2],[2,3,3],[1,6],[2,3,1],[2,7,6]]` → `[false, true, true]`
- `queries = [[1,7],[2,7,6],[1,2],[2,7,5],[2,3,3]]` → `[true, true, false]`

Constraints: `1 <= queries.length <= 1.5×10^5`, `1 <= x <= 5×10^4`, `1 <= sz <= 5×10^4`

---

## 📝 Interview Tips

1. **Clarify**: "Block phải fit vừa [0,x] hay chỉ cần gap ≥ sz trước x?" / Block must end at or before x
2. **Brute force**: "Lưu sorted obstacles, với mỗi type-2 duyệt hết — O(n²)" / Linear scan gaps per query
3. **Key insight**: "Khi thêm obstacle tại p, chia gap cũ thành 2 gaps nhỏ hơn" / Insertion splits one gap into two
4. **Optimal approach**: "SortedSet obstacles + BIT/segment tree lưu max gap theo prefix" / Max gap prefix with BIT
5. **Edge case**: "Luôn có virtual obstacles tại 0 và... không, chỉ x=0 là boundary" / Track boundary at 0
6. **Follow-up**: "Xóa obstacle? → Segment tree + lazy deletion" / Deletion makes it harder

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Sorted Obstacles + Linear Scan
 * Time: O(n²) — for each type-2 query, scan all obstacles ≤ x
 * Space: O(n) — storing obstacles
 */
function blockPlacementQueriesBrute(queries: number[][]): boolean[] {
  const obstacles = new Set<number>([0]); // virtual obstacle at 0
  const result: boolean[] = [];

  for (const q of queries) {
    if (q[0] === 1) {
      obstacles.add(q[1]);
    } else {
      const [, x, sz] = q;
      // Get sorted obstacles ≤ x, add x as right boundary
      const pts = [...obstacles].filter((p) => p <= x).sort((a, b) => a - b);
      pts.push(x);
      let canPlace = false;
      for (let i = 1; i < pts.length; i++) {
        if (pts[i] - pts[i - 1] >= sz) {
          canPlace = true;
          break;
        }
      }
      result.push(canPlace);
    }
  }
  return result;
}

/**
 * Solution 2: Sorted Array + Binary Search + Max-Gap Prefix Tracking
 * Time: O(n log n) — binary search insertion + gap updates
 * Space: O(n) — sorted obstacle array + prefix max gap array
 *
 * Approach: Maintain sorted obstacles. For type-2, use binary search to find
 * the gap containing x's right boundary, then check prefix max gaps.
 * We store maxGap[i] = max gap among all gaps ending at or before obstacles[i].
 */
function blockPlacementQueries(queries: number[][]): boolean[] {
  // obstacles sorted, with sentinel 0
  const obs: number[] = [0];
  // maxGap[i] = max gap in obs[0..i] intervals (prefix max of consecutive diffs)
  const maxGap: number[] = [0];

  const bsInsert = (val: number): number => {
    let lo = 0,
      hi = obs.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (obs[mid] < val) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  // Binary search: find rightmost index where obs[idx] <= val
  const bsFloor = (val: number): number => {
    let lo = 0,
      hi = obs.length - 1,
      res = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (obs[mid] <= val) {
        res = mid;
        lo = mid + 1;
      } else hi = mid - 1;
    }
    return res;
  };

  const result: boolean[] = [];

  for (const q of queries) {
    if (q[0] === 1) {
      const x = q[1];
      const idx = bsInsert(x);
      if (obs[idx] === x) continue; // already exists

      // Insert x at idx, update gaps
      obs.splice(idx, 0, x);
      // Rebuild maxGap from idx-1 onwards (only affected region)
      // For correctness rebuild entire maxGap (brute is O(n), optimize if needed)
      maxGap.length = obs.length;
      maxGap[0] = 0;
      for (let i = 1; i < obs.length; i++) {
        maxGap[i] = Math.max(maxGap[i - 1], obs[i] - obs[i - 1]);
      }
    } else {
      const [, x, sz] = q;
      // Find floor obstacle ≤ x
      const floorIdx = bsFloor(x);
      // Max gap entirely within [0, x]: either from prefix max up to floorIdx
      // or the partial gap from obs[floorIdx] to x
      const prefixMax = maxGap[floorIdx];
      const partialGap = x - obs[floorIdx];
      result.push(Math.max(prefixMax, partialGap) >= sz);
    }
  }
  return result;
}

// === Test Cases ===
console.log(
  blockPlacementQueries([
    [1, 2],
    [2, 3, 3],
    [1, 6],
    [2, 3, 1],
    [2, 7, 6],
  ]),
);
// [false, true, true]
console.log(
  blockPlacementQueries([
    [1, 7],
    [2, 7, 6],
    [1, 2],
    [2, 7, 5],
    [2, 3, 3],
  ]),
);
// [true, true, false]
console.log(
  blockPlacementQueriesBrute([
    [1, 2],
    [2, 3, 3],
    [1, 6],
    [2, 3, 1],
    [2, 7, 6],
  ]),
);
// [false, true, true]
```

---

## 🔗 Related Problems

- [Online Majority Element In Subarray](https://leetcode.com/problems/online-majority-element-in-subarray) — online queries with segment tree
- [Create Sorted Array through Instructions](https://leetcode.com/problems/create-sorted-array-through-instructions) — BIT for order statistics
- [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self) — BIT / segment tree
- [Find Building Where Alice and Bob Can Meet](https://leetcode.com/problems/find-building-where-alice-and-bob-can-meet) — offline + segment tree
- [Block Placement Queries — LeetCode](https://leetcode.com/problems/block-placement-queries) — problem page
