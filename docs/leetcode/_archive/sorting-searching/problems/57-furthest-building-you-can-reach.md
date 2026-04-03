---
layout: page
title: "Furthest Building You Can Reach"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/furthest-building-you-can-reach"
---

# Furthest Building You Can Reach / Tòa Nhà Xa Nhất Bạn Có Thể Đến

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Min-Heap
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có t thang leo và B viên gạch. Khi leo lên, hãy **dùng thang cho mọi bước** trước. Nếu đã dùng quá nhiều thang, hoán đổi thang ở bước nhỏ nhất thành gạch. Min-heap giúp biết bước nào nhỏ nhất đang dùng thang.

**Pattern Recognition:**

- Signal: "limited resources" + "maximize reach" → **Greedy + Min-Heap**
- Greedy: dùng thang cho **t bước leo lớn nhất** đã gặp, còn lại dùng gạch
- Key insight: Min-heap track t climbs đang dùng thang; khi vượt t, swap nhỏ nhất sang gạch

**Visual — Heap tracks ladder-climbs, swap to bricks:**

```
heights=[4,2,7,6,9,14,12], bricks=5, ladders=1

Step 0→1: diff=0, skip
Step 1→2: diff=5, heap=[5], ladders used=1 ✅
Step 2→3: diff=0, skip
Step 3→4: diff=3, heap=[3,5], size>ladders=1
           → pop min=3, bricks+=3 (bricks left=2), heap=[5]
Step 4→5: diff=5, heap=[5,5], size>ladders=1
           → pop min=5, bricks+=5=7>5 ❌ can't proceed
Result: index 4  ✅
```

---

## Problem Description

Cho mảng `heights`, số viên gạch `bricks`, và số thang `ladders`. Di chuyển từ building 0, khi sang building cao hơn cần diff gạch hoặc 1 thang. Trả về index building xa nhất có thể đến. ([LeetCode 1642](https://leetcode.com/problems/furthest-building-you-can-reach))

- Example 1: `heights=[4,2,7,6,9,14,12], bricks=5, ladders=1` → `4`
- Example 2: `heights=[4,12,2,7,3,18,20,3,19], bricks=10, ladders=2` → `7`
- Example 3: `heights=[14,3,19,3], bricks=17, ladders=0` → `3`

Constraints: `1 ≤ heights.length ≤ 10⁵`, `0 ≤ bricks ≤ 10⁹`, `0 ≤ ladders ≤ heights.length`

---

## 📝 Interview Tips

1. **Clarify**: "Thang có thể dùng cho bất kỳ bước leo nào?" / Ladders can cover any positive height diff
2. **Greedy insight**: "Thang nên dùng cho bước leo LỚN NHẤT — không nên lãng phí thang cho bước nhỏ" / Ladders for biggest climbs
3. **Min-heap**: "Heap size t → track t climbs đang dùng thang; khi heap.size()>t → swap nhỏ nhất sang gạch" / Heap maintains top-t climbs
4. **Termination**: "Nếu gạch không đủ sau swap → không đến được building tiếp theo → return i" / Return current index on brick shortage
5. **Edge case**: "Xuống dốc (diff <= 0) → không cần gì cả" / Downhill or same height costs nothing
6. **Time complexity**: "O(n log t) — n bước, mỗi bước heap push/pop O(log t)" / n steps, O(log t) per heap op

---

## Solutions

```typescript
// Compact min-heap
class MinHeap {
  private h: number[] = [];
  push(v: number) {
    this.h.push(v);
    let i = this.h.length - 1;
    while (i > 0 && this.h[(i - 1) >> 1] > this.h[i]) {
      const p = (i - 1) >> 1;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
      i = p;
    }
  }
  pop(): number {
    const top = this.h[0],
      last = this.h.pop()!;
    if (this.h.length) {
      this.h[0] = last;
      let i = 0;
      while (true) {
        let j = 2 * i + 1;
        if (j + 1 < this.h.length && this.h[j + 1] < this.h[j]) j++;
        if (j >= this.h.length || this.h[i] <= this.h[j]) break;
        [this.h[i], this.h[j]] = [this.h[j], this.h[i]];
        i = j;
      }
    }
    return top;
  }
  peek(): number {
    return this.h[0];
  }
  size(): number {
    return this.h.length;
  }
}

/**
 * Solution 1: Brute Force — try greedy with bricks first
 * Time: O(n × ladders) — for each step, linear scan of climbs
 * Space: O(n) — storing all climbs
 */
function furthestBuildingBruteForce(heights: number[], bricks: number, ladders: number): number {
  const climbs: number[] = [];
  let bricksLeft = bricks;
  for (let i = 0; i < heights.length - 1; i++) {
    const diff = heights[i + 1] - heights[i];
    if (diff <= 0) continue;
    climbs.push(diff);
    // Use ladders for the `ladders` largest climbs so far
    const sorted = [...climbs].sort((a, b) => b - a);
    const bricksNeeded = sorted.slice(ladders).reduce((s, v) => s + v, 0);
    if (bricksNeeded > bricks) return i;
    bricksLeft = bricks - bricksNeeded;
  }
  return heights.length - 1;
}

/**
 * Solution 2: Greedy + Min-Heap (Optimal)
 * Time: O(n log t) — n steps, heap push/pop O(log t) where t = ladders
 * Space: O(t) — heap stores at most t+1 climbs
 */
function furthestBuildingYouCanReach(heights: number[], bricks: number, ladders: number): number {
  const heap = new MinHeap(); // Stores climbs currently covered by a ladder
  let bricksUsed = 0;

  for (let i = 0; i < heights.length - 1; i++) {
    const diff = heights[i + 1] - heights[i];
    if (diff <= 0) continue; // Going down or flat — free

    heap.push(diff); // Tentatively assign a ladder to this climb

    if (heap.size() > ladders) {
      // We've used more than `ladders` ladders — swap the smallest climb to bricks
      bricksUsed += heap.pop(); // The smallest ladder-climb becomes a brick-climb
      if (bricksUsed > bricks) return i; // Not enough bricks — stop here
    }
  }

  return heights.length - 1; // Successfully reached the last building
}

// === Test Cases ===
console.log(furthestBuildingYouCanReach([4, 2, 7, 6, 9, 14, 12], 5, 1)); // 4
console.log(furthestBuildingYouCanReach([4, 12, 2, 7, 3, 18, 20, 3, 19], 10, 2)); // 7
console.log(furthestBuildingYouCanReach([14, 3, 19, 3], 17, 0)); // 3
console.log(furthestBuildingYouCanReach([1, 2], 0, 0)); // 0
```

---

## 🔗 Related Problems

- [IPO](https://leetcode.com/problems/ipo) — greedily pick best available option with constraints
- [Minimum Number of Refueling Stops](https://leetcode.com/problems/minimum-number-of-refueling-stops) — greedy + heap for resource usage
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — heap-based greedy scheduling
- [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water) — height array traversal with two-pointer
- [Furthest Building You Can Reach — LeetCode](https://leetcode.com/problems/furthest-building-you-can-reach) — problem page
