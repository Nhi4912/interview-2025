---
layout: page
title: "Brightest Position on Street"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Sorting, Prefix Sum, Ordered Set]
leetcode_url: "https://leetcode.com/problems/brightest-position-on-street"
---

# Brightest Position on Street / Vị Trí Sáng Nhất Trên Đường Phố

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom) | [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Mỗi đèn đường chiếu sáng một đoạn `[position - range, position + range]`. Muốn tìm điểm được nhiều đèn chiếu nhất — dùng kỹ thuật **difference array** (quét dòng): đánh dấu +1 tại điểm bắt đầu, -1 sau điểm kết thúc, rồi tính prefix sum.

**Pattern Recognition:**

- "Intervals with overlap count" → Difference array / Line sweep
- Sort events by coordinate, sweep left to right, track running sum
- Max running sum position = answer

**Visual — lights = [[-3,2],[1,2]], position=-2,−1,0,1,2,3:**

```
Lamp 1: [-3+2=-1,  -3-2=-5+..., wait] → range [-3-2, -3+2] = [-5, -1]
Lamp 2: [1-2, 1+2] = [-1, 3]

Diff array: +1 at -5, -1 at 0  (lamp1 ends at -1, so -1 at -1+1=0)
            +1 at -1, -1 at 4  (lamp2 ends at 3, so -1 at 3+1=4)

Prefix:  pos -5: 1, -1: 2 (both lamps), 0: 1, 4: 0
Brightest = -1 (brightness=2) ✅
```

---

## Problem Description

A street is lit by lamps, each described as `[position, range]`, illuminating `[position-range, position+range]`. Find the **smallest** position with the **maximum brightness** (number of overlapping lamp ranges).

- Example 1: `lights = [[-3,2],[1,2]]` → `-1`
- Example 2: `lights = [[1,0],[0,1]]` → `1`

---

## 📝 Interview Tips

1. **Clarify**: "Nếu nhiều vị trí cùng độ sáng tối đa, lấy nhỏ nhất?" / Smallest position among max brightness?
2. **Difference array**: "+1 tại start, -1 tại end+1" / +1 at interval start, -1 at end+1
3. **Coordinate compression**: "Sắp xếp events, không cần mảng liên tục" / Sort events, no need for dense array
4. **Running sum**: "Quét events theo tọa độ, track running brightness" / Sweep events, track running sum
5. **Edge case**: "Không có đèn → position 0, brightness 0" / No lights → 0 position
6. **Follow-up**: "Nếu query nhiều positions?" / Multiple queries on same lights?

---

## Solutions

```typescript
/**
 * Solution 1: Difference Array + Sorting (Line Sweep)
 * Time: O(n log n) — sort events
 * Space: O(n) — events array
 */
function brightestPosition(lights: number[][]): number {
  // Build events: [coordinate, delta]
  const events: [number, number][] = [];
  for (const [pos, range] of lights) {
    events.push([pos - range, 1]); // lamp turns on
    events.push([pos + range + 1, -1]); // lamp turns off
  }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  let brightness = 0,
    maxBrightness = 0;
  let bestPos = 0,
    running = 0;

  for (const [coord, delta] of events) {
    running += delta;
    if (running > maxBrightness) {
      maxBrightness = running;
      bestPos = coord;
    }
    brightness = running;
  }
  return bestPos;
}

/**
 * Solution 2: TreeMap simulation — group events by position
 * Time: O(n log n)
 * Space: O(n)
 */
function brightestPosition2(lights: number[][]): number {
  const diff = new Map<number, number>();
  for (const [pos, range] of lights) {
    const lo = pos - range,
      hi = pos + range;
    diff.set(lo, (diff.get(lo) ?? 0) + 1);
    diff.set(hi + 1, (diff.get(hi + 1) ?? 0) - 1);
  }

  const coords = [...diff.keys()].sort((a, b) => a - b);
  let running = 0,
    maxB = 0,
    bestPos = 0;
  for (const c of coords) {
    running += diff.get(c)!;
    if (running > maxB) {
      maxB = running;
      bestPos = c;
    }
  }
  return bestPos;
}

// === Test Cases ===
console.log(
  brightestPosition([
    [-3, 2],
    [1, 2],
  ]),
); // -1
console.log(
  brightestPosition([
    [1, 0],
    [0, 1],
  ]),
); // 1
console.log(brightestPosition([[0, 1]])); // -1 (leftmost of bright range)
console.log(
  brightestPosition2([
    [-3, 2],
    [1, 2],
  ]),
); // -1
```

---

## 🔗 Related Problems

| Problem                                                                                                        | Pattern                    | Difficulty |
| -------------------------------------------------------------------------------------------------------------- | -------------------------- | ---------- |
| [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom)               | Prefix Sum + Binary Search | Hard       |
| [My Calendar III](https://leetcode.com/problems/my-calendar-iii)                                               | Difference Array           | Hard       |
| [Minimum Interval to Include Each Query](https://leetcode.com/problems/minimum-interval-to-include-each-query) | Sorting + Heap             | Hard       |
| [Count of Range Sum](https://leetcode.com/problems/count-of-range-sum)                                         | Prefix Sum                 | Hard       |
