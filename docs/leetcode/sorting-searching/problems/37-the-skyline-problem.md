---
layout: page
title: "The Skyline Problem"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Divide and Conquer, Binary Indexed Tree, Segment Tree, Line Sweep]
leetcode_url: "https://leetcode.com/problems/the-skyline-problem"
---

# The Skyline Problem / Bài Toán Đường Chân Trời

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Line Sweep + Max Heap
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Create Sorted Array through Instructions](https://leetcode.com/problems/create-sorted-array-through-instructions) | [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đứng trước thành phố và chụp ảnh bầu trời — bạn thấy các tòa nhà gối nhau tạo thành "đường viền" phía trên. Bài toán yêu cầu tìm các điểm mà độ cao thay đổi, giống như xác định các "góc ngoặt" của bóng thành phố trên bầu trời.

**Pattern Recognition:**

- Signal: "buildings overlap" + "critical points where height changes" → **Line Sweep**
- Tại mỗi x-coordinate, height = max của tất cả buildings đang "active"
- Key insight: biến mỗi building thành 2 events (enter, exit), quét từ trái→phải, dùng max-heap để track active heights

**Visual — buildings = [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]:**

```
Event points sorted:
x=2:  enter h=10  → active={10}     → maxH=10  → keypoint (2,10)
x=3:  enter h=15  → active={10,15}  → maxH=15  → keypoint (3,15)
x=5:  enter h=12  → active={10,15,12}→maxH=15  (no change)
x=7:  exit  h=15  → active={10,12}  → maxH=12  → keypoint (7,12)
x=9:  exit  h=10  → active={12}     → maxH=12  (no change)
x=12: exit  h=12  → active={}       → maxH=0   → keypoint (12,0)
x=15: enter h=10  → active={10}     → maxH=10  → keypoint (15,10)
x=19: enter h=8   → active={10,8}   → maxH=10  (no change)
x=20: exit  h=10  → active={8}      → maxH=8   → keypoint (20,8)
x=24: exit  h=8   → active={}       → maxH=0   → keypoint (24,0)

Result: [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]] ✅
```

---

## Problem Description

Given a list of buildings `[left, right, height]`, return the **skyline** as a list of `[x, height]` key points where the silhouette changes. The last key point must always have height 0.

**Example 1:**

```
Input:  [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]
Output: [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]
```

**Example 2:**

```
Input:  [[0,2,3],[2,5,3]]
Output: [[0,3],[5,0]]
Explanation: Adjacent buildings of same height merge seamlessly.
```

**Constraints:** `1 ≤ buildings.length ≤ 10⁴`, `0 ≤ lᵢ < rᵢ ≤ 2³¹−1`, `1 ≤ hᵢ ≤ 2³¹−1`

---

## 📝 Interview Tips

1. **Clarify**: "Buildings có thể overlap không? Heights có thể bằng nhau không?" / Can buildings overlap? Same height adjacent buildings should merge
2. **Events**: "Mỗi building → 2 events: enter(l, -h) và exit(r, h). Sort by x, ties handled carefully" / Convert to events, sort x then by height
3. **Tie-breaking**: "Cùng x: enter trước exit; enter cao hơn trước; exit thấp hơn trước" / Same x: enter before exit; taller enter first; shorter exit first
4. **Edge cases**: "Buildings sát nhau cùng height → không tạo keypoint" / Adjacent same-height → no duplicate keypoint
5. **Max-heap removal**: "Lazy deletion: heap chứa cả heights cũ, peek trước khi dùng" / Use lazy deletion for heap removals
6. **Follow-up**: "Nếu buildings là stream → online algorithm với sorted set?" / For streaming, use a sorted multiset

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Coordinate Compression
 * Time: O(n·maxX) — mark height at each x, impractical for large coords
 * Space: O(maxX) — height array
 */
function getSkylineBrute(buildings: number[][]): number[][] {
  if (!buildings.length) return [];
  let maxX = 0;
  for (const b of buildings) maxX = Math.max(maxX, b[1]);
  const heights = new Array(maxX + 1).fill(0);
  for (const [l, r, h] of buildings) {
    for (let x = l; x < r; x++) heights[x] = Math.max(heights[x], h);
  }
  const result: number[][] = [];
  for (let x = 0; x <= maxX; x++) {
    if (x === 0 || heights[x] !== heights[x - 1]) result.push([x, heights[x]]);
  }
  return result;
}

/**
 * Solution 2: Line Sweep + Active Heights Map
 * Time: O(n² worst case) — finding max of active heights; O(n log n) with real heap
 * Space: O(n) — active heights map
 *
 * Key insight:
 * 1. Create events: (x, -h) for building start, (x, +h) for building end
 * 2. Sort events: by x, then by height value (negatives first = enters first)
 * 3. Maintain multiset of active heights; record keypoint when maxH changes
 */
function getSkyline(buildings: number[][]): number[][] {
  // Create sorted events
  const events: [number, number][] = [];
  for (const [l, r, h] of buildings) {
    events.push([l, -h]); // enter: negative height (sorts before exits)
    events.push([r, h]); // exit: positive height
  }
  // Sort: by x asc, then by h asc (enters with big -h come first; exits with small h come first)
  events.sort(([x1, h1], [x2, h2]) => (x1 !== x2 ? x1 - x2 : h1 - h2));

  // Active heights as multiset (count map) + ground level
  const active = new Map<number, number>([[0, 1]]);

  const addHeight = (h: number) => active.set(h, (active.get(h) ?? 0) + 1);
  const removeHeight = (h: number) => {
    const cnt = active.get(h)! - 1;
    cnt <= 0 ? active.delete(h) : active.set(h, cnt);
  };
  const maxHeight = () => Math.max(...active.keys());

  const result: number[][] = [];
  let prevMax = 0;

  for (const [x, h] of events) {
    if (h < 0) addHeight(-h);
    else removeHeight(h);
    const curMax = maxHeight();
    if (curMax !== prevMax) {
      result.push([x, curMax]);
      prevMax = curMax;
    }
  }
  return result;
}

// === Test Cases ===
console.log(
  JSON.stringify(
    getSkyline([
      [2, 9, 10],
      [3, 7, 15],
      [5, 12, 12],
      [15, 20, 10],
      [19, 24, 8],
    ]),
  ),
);
// [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]
console.log(
  JSON.stringify(
    getSkyline([
      [0, 2, 3],
      [2, 5, 3],
    ]),
  ),
);
// [[0,3],[5,0]]
console.log(JSON.stringify(getSkyline([[1, 2, 1]])));
// [[1,1],[2,0]]
```

---

## 🔗 Related Problems

| Problem                                                                                                            | Pattern             | Difficulty |
| ------------------------------------------------------------------------------------------------------------------ | ------------------- | ---------- |
| [Create Sorted Array through Instructions](https://leetcode.com/problems/create-sorted-array-through-instructions) | BIT / Merge Sort    | Hard       |
| [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self)           | Merge Sort / BIT    | Hard       |
| [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii)                                                 | Line Sweep / Heap   | Medium     |
| [Employee Free Time](https://leetcode.com/problems/employee-free-time)                                             | Line Sweep          | Hard       |
| [Rectangle Area II](https://leetcode.com/problems/rectangle-area-ii)                                               | Coordinate Compress | Hard       |
