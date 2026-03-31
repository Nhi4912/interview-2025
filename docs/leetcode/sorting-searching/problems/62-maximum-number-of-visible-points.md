---
layout: page
title: "Maximum Number of Visible Points"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Math, Geometry, Sliding Window, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-visible-points"
---

# Maximum Number of Visible Points / Số Điểm Nhìn Thấy Tối Đa

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Sliding Window on Sorted Angles
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn đứng ở một điểm, xoay camera với góc nhìn `angle` độ. Mỗi điểm xung quanh có một góc phương vị (azimuth). Câu hỏi là: có thể quay camera sao cho cửa sổ `angle` độ chứa **nhiều điểm nhất** không? → Sliding window trên các góc đã sort!

**Pattern Recognition:**

- Signal: "circular range" + "maximize points in arc" → **Sort angles + Sliding Window**
- Convert points to angles, sort; duplicate array (+360°) để xử lý circular wrap
- Key insight: đếm điểm tại location riêng (luôn nhìn thấy), dùng two-pointer trên sorted angles

**Visual — Angles on circle, sliding window finds max arc:**

```
observer at (0,0), angle=90°
Points: (2,2)→45°, (3,0)→0°, (2,-2)→-45°, (0,3)→90°

Sorted angles: [-45°, 0°, 45°, 90°]
Duplicate:     [-45°, 0°, 45°, 90°, 315°, 360°, 405°, 450°]
                ↑ L                    ↑ R  (span=360°>90°)

Window [0°..90°]: angles 0,45,90 → 3 points visible
Window [-45°..45°]: angles -45,0,45 → 3 points visible

Answer = 3 (+ any at-location points)  ✅
```

---

## Problem Description

Bạn ở `location`, có `angle` độ tầm nhìn (có thể xoay). Điểm ở cùng vị trí với bạn luôn nhìn thấy. Trả về số điểm tối đa có thể nhìn thấy cùng lúc. ([LeetCode 1610](https://leetcode.com/problems/maximum-number-of-visible-points))

- Example 1: `points=[[2,1],[2,2],[3,3]], angle=90, location=[1,1]` → `3`
- Example 2: `points=[[2,1],[2,2],[3,4],[1,1]], angle=90, location=[1,1]` → `4`
- Example 3: `points=[[1,0],[2,1]], angle=13, location=[1,1]` → `1`

Constraints: `1 ≤ points.length ≤ 10⁵`, `0 ≤ angle < 360`

---

## 📝 Interview Tips

1. **Clarify**: "Góc được đo theo hướng nào? Points tại location có được tính không?" / Points at same location always visible
2. **Convert**: "Dùng `atan2(dy, dx) * 180/π` → góc trong [-180°, 180°]" / atan2 converts relative coordinates to angle
3. **Circular wrap**: "Nhân đôi mảng góc: thêm `angles[i] + 360` để xử lý wrap-around" / Duplicate array handles 360° boundary
4. **Sliding window**: "two-pointer: expand right, shrink left khi `angles[R] - angles[L] > angle`" / Standard sliding window on sorted angles
5. **At-location**: "Điểm trùng vị trí → atan2(0,0) = 0 nhưng không có nghĩa → đếm riêng" / Points at observer location skipped from angles, added at end
6. **Floating point**: "So sánh góc bằng float — cần chú ý precision (cộng EPS nếu cần)" / Floating point angles may need epsilon tolerance

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — check all rotations for each pair
 * Time: O(n²) — for every pair of points, check if they fit within angle
 * Space: O(n) — angles array
 */
function visiblePointsBruteForce(points: number[][], angle: number, location: number[]): number {
  const [lx, ly] = location;
  const angles: number[] = [];
  let atLocation = 0;
  for (const [px, py] of points) {
    if (px === lx && py === ly) {
      atLocation++;
      continue;
    }
    angles.push((Math.atan2(py - ly, px - lx) * 180) / Math.PI);
  }
  if (angles.length === 0) return atLocation;

  let maxVisible = 0;
  for (let i = 0; i < angles.length; i++) {
    let count = 0;
    for (let j = 0; j < angles.length; j++) {
      let diff = angles[j] - angles[i];
      if (diff < 0) diff += 360;
      if (diff <= angle) count++;
    }
    maxVisible = Math.max(maxVisible, count);
  }
  return maxVisible + atLocation;
}

/**
 * Solution 2: Sort Angles + Sliding Window (Optimal)
 * Time: O(n log n) — sort angles, then single O(n) sliding window pass
 * Space: O(n) — angles array (doubled for wrap-around)
 */
function maximumNumberOfVisiblePoints(
  points: number[][],
  angle: number,
  location: number[],
): number {
  const [lx, ly] = location;
  const angles: number[] = [];
  let atLocation = 0;

  for (const [px, py] of points) {
    if (px === lx && py === ly) {
      atLocation++; // Always visible; skip angle computation (atan2(0,0) undefined)
      continue;
    }
    angles.push((Math.atan2(py - ly, px - lx) * 180) / Math.PI);
  }

  angles.sort((a, b) => a - b);

  // Duplicate the array with +360° offset to handle circular range crossing 180°/-180°
  const n = angles.length;
  for (let i = 0; i < n; i++) angles.push(angles[i] + 360);

  // Sliding window: find maximum number of angles fitting within [L, L + angle]
  let maxVisible = 0;
  let left = 0;
  for (let right = 0; right < angles.length; right++) {
    // Shrink window from left until the range fits within `angle` degrees
    while (angles[right] - angles[left] > angle) left++;
    maxVisible = Math.max(maxVisible, right - left + 1);
  }

  return maxVisible + atLocation;
}

// === Test Cases ===
console.log(
  maximumNumberOfVisiblePoints(
    [
      [2, 1],
      [2, 2],
      [3, 3],
    ],
    90,
    [1, 1],
  ),
); // 3
console.log(
  maximumNumberOfVisiblePoints(
    [
      [2, 1],
      [2, 2],
      [3, 4],
      [1, 1],
    ],
    90,
    [1, 1],
  ),
); // 4
console.log(
  maximumNumberOfVisiblePoints(
    [
      [1, 0],
      [2, 1],
    ],
    13,
    [1, 1],
  ),
); // 1
console.log(maximumNumberOfVisiblePoints([[0, 0]], 0, [0, 0])); // 1
```

---

## 🔗 Related Problems

- [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin) — geometry + heap on distances
- [Minimum Area Rectangle](https://leetcode.com/problems/minimum-area-rectangle) — geometry + sorting/hashing
- [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum) — sliding window on sorted values
- [Minimize Manhattan Distances](https://leetcode.com/problems/minimize-manhattan-distances) — geometry optimization
- [Maximum Number of Visible Points — LeetCode](https://leetcode.com/problems/maximum-number-of-visible-points) — problem page
