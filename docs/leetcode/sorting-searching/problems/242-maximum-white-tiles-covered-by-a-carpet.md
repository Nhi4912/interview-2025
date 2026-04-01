---
layout: page
title: "Maximum White Tiles Covered by a Carpet"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Greedy, Sliding Window, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-white-tiles-covered-by-a-carpet"
---

# Maximum White Tiles Covered by a Carpet / Số Ô Trắng Tối Đa Được Phủ Bởi Tấm Thảm

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sort + Prefix Sum + Binary Search
> **Frequency**: 📗 Tier 1 — Gặp ở Amazon, Google, Meta
> **See also**: [Minimum Number of Taps to Open to Water a Garden](https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden) | [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đặt một tấm bìa cứng dài `carpetLen` lên một dải ô đen-trắng. Mấu chốt: cạnh trái của thảm nên **căn thẳng với cạnh trái của một interval** (dịch thêm chỉ tốt bằng hoặc tệ hơn).

**Pattern Recognition:**

- Greedy: chỉ cần thử n vị trí — left edge của thảm căn với `tiles[i][0]`
- Sort intervals → build prefix sum → binary search endpoint của thảm
- Partial coverage: interval cuối có thể chỉ bị phủ một phần

**Visual — tiles=[[1,5],[10,11],[12,18],[20,25],[30,32]], carpetLen=10:**

```
Sorted: [1,5] [10,11] [12,18] [20,25] [30,32]
Prefix: [0,    5,      7,      14,     20,    23]

Carpet at 10 → end=19: covers [10,11]+[12,18] = 2+7 = 9 ✅
Carpet at  1 → end=10: covers [1,5]+partial[10] = 5+1 = 6
Best: 9
```

---

## Problem Description

Given `tiles[i] = [li, ri]` (disjoint white tile intervals) and `carpetLen`, place a carpet of length `carpetLen` to **maximize** covered white tiles. Return the maximum count.

- Example 1: `tiles=[[1,5],[10,11],[12,18],[20,25],[30,32]], carpetLen=10` → `9`
- Example 2: `tiles=[[10,11],[1,1]], carpetLen=2` → `2`
- Example 3: `tiles=[[1,10]], carpetLen=5` → `5`

**Constraints:** `1 ≤ tiles.length ≤ 5×10^4`, tiles are disjoint, `1 ≤ carpetLen ≤ 10^9`.

---

## 📝 Interview Tips

1. **Greedy key**: "Cạnh trái thảm luôn nên căn với l[i] — chỉ cần thử n vị trí thay vì vô hạn" / Left edge of carpet aligns with some l[i]; only n positions need to be tried
2. **Sort first**: "Sắp xếp intervals theo l[i] → prefix sum dễ tính, binary search dễ áp dụng" / Sort by left endpoint to compute prefix sums and binary search
3. **Binary search target**: "Tìm interval đầu tiên có l[j] > carpetEnd = l[i] + carpetLen - 1" / Find first interval starting after carpet's right edge
4. **Partial coverage**: "Interval j-1 có thể vượt qua carpetEnd → trừ phần dư tiles[j-1][1] - carpetEnd" / Last reached interval may extend beyond carpet; subtract the overcount
5. **Edge case**: "carpetLen phủ toàn bộ → return tổng tất cả tile; 1 interval → min(carpetLen, width)" / Very long carpet covers all tiles; single interval: min(carpetLen, width)
6. **Follow-up**: "Nếu đặt nhiều tấm thảm không chồng nhau?" / What if placing multiple non-overlapping carpets?

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Prefix Sum + Binary Search
 * Time: O(n log n) — sort + n binary searches each O(log n)
 * Space: O(n) — prefix sum array
 */
function maximumWhiteTiles(tiles: number[][], carpetLen: number): number {
  tiles.sort((a, b) => a[0] - b[0]);
  const n = tiles.length;

  // prefix[i] = total white tiles in tiles[0..i-1]
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + (tiles[i][1] - tiles[i][0] + 1);
  }

  // Binary search: find first interval index where tiles[j][0] > target
  const firstAfter = (target: number): number => {
    let lo = 0,
      hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tiles[mid][0] > target) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  };

  let ans = 0;
  for (let i = 0; i < n; i++) {
    const carpetEnd = tiles[i][0] + carpetLen - 1;
    const j = firstAfter(carpetEnd); // first interval fully beyond carpet
    let covered = prefix[j] - prefix[i]; // all fully covered intervals
    // Subtract overcount if interval j-1 extends past carpetEnd
    if (j > 0 && tiles[j - 1][1] > carpetEnd) {
      covered -= tiles[j - 1][1] - carpetEnd;
    }
    ans = Math.max(ans, covered);
  }
  return ans;
}

/**
 * Solution 2: Sort + Two-Pointer Sliding Window
 * Time: O(n log n) — sort + O(n) two-pointer pass
 * Space: O(1) extra
 */
function maximumWhiteTilesSW(tiles: number[][], carpetLen: number): number {
  tiles.sort((a, b) => a[0] - b[0]);
  const n = tiles.length;
  let ans = 0;
  let windowSum = 0;
  let r = 0;
  for (let i = 0; i < n; i++) {
    const carpetEnd = tiles[i][0] + carpetLen - 1;
    // Expand right: include all intervals fully within carpet
    while (r < n && tiles[r][1] <= carpetEnd) {
      windowSum += tiles[r][1] - tiles[r][0] + 1;
      r++;
    }
    // Partial coverage: interval r starts within carpet but ends beyond
    const partial = r < n && tiles[r][0] <= carpetEnd ? carpetEnd - tiles[r][0] + 1 : 0;
    ans = Math.max(ans, windowSum + partial);
    // Slide left: remove interval i from window
    if (r > i) {
      windowSum -= tiles[i][1] - tiles[i][0] + 1;
    } else {
      r = i + 1; // r was still at i, advance both
    }
  }
  return ans;
}

// === Test Cases ===
const t1 = [
  [1, 5],
  [10, 11],
  [12, 18],
  [20, 25],
  [30, 32],
];
console.log(maximumWhiteTiles(t1, 10)); // 9
console.log(
  maximumWhiteTiles(
    [
      [10, 11],
      [1, 1],
    ],
    2,
  ),
); // 2
console.log(maximumWhiteTiles([[1, 10]], 5)); // 5
console.log(maximumWhiteTilesSW(t1, 10)); // 9
console.log(
  maximumWhiteTilesSW(
    [
      [10, 11],
      [1, 1],
    ],
    2,
  ),
); // 2
```

---

## 🔗 Related Problems

| Problem                                                                                                                            | Pattern                    | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ---------- |
| [Minimum Number of Taps to Open to Water a Garden](https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden) | Greedy + Sort              | Hard       |
| [Jump Game VII](https://leetcode.com/problems/jump-game-vii)                                                                       | Sliding Window + Prefix    | Medium     |
| [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element)                     | Sliding Window             | Medium     |
| [Apply Operations to Maximize Frequency Score](https://leetcode.com/problems/apply-operations-to-maximize-frequency-score)         | Binary Search + Prefix     | Hard       |
| [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal)                                 | Binary Search + Prefix Sum | Hard       |
