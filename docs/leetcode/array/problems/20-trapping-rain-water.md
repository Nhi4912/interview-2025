---
layout: page
title: "Trapping Rain Water"
difficulty: Hard
category: Array
tags: [Array, Two Pointers, Stack, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/trapping-rain-water/"
leetcode_number: 42
pattern: "Two Pointers"
frequency_tier: 1
companies: [Amazon, Google, Meta, Microsoft, Goldman Sachs]
target_time_minutes: 35
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Trapping Rain Water / Bẫy Nước Mưa

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Two Pointers / DP
> **Frequency**: 🔥 Tier 1 — Câu hỏi Hard kinh điển nhất, gần như bắt buộc ở FAANG onsite
> **Target**: ⏱️ 35 min | **Companies**: Amazon, Google, Meta, Microsoft, Goldman Sachs
> **See also**: [Container With Most Water](./18-container-with-most-water.md) | [Daily Temperatures](../../stack-queue/problems/11-daily-temperatures.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Dãy núi sau cơn mưa — nước đọng ở các thung lũng. Lượng nước tại vị trí `i` bị giới hạn bởi bức tường cao nhất bên trái VÀ bên phải. Nước đọng = `min(leftMax, rightMax) - height[i]`.

**Pattern Recognition:**

- Signal: "trapped water / elevation map" → **Two Pointers hoặc Precompute prefix max**
- Key formula: `water[i] = max(0, min(leftMax[i], rightMax[i]) - height[i])`
- Two Pointers: xử lý phía có `max` nhỏ hơn trước — nước tại đó đã xác định chắc chắn

**Visual — [0,1,0,2,1,0,1,3,2,1,2,1]:**

```
index:    0  1  2  3  4  5  6  7  8  9 10 11
height:   0  1  0  2  1  0  1  3  2  1  2  1
leftMax:  0  1  1  2  2  2  2  3  3  3  3  3
rightMax: 3  3  3  3  3  3  3  3  2  2  2  1
water:    0  0  1  0  1  2  1  0  0  1  0  0  → total = 6
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                          |
| ---------------- | ----------------------------------------------------------------- |
| **When you see** | "trapped water", "elevation map", "rain water between bars"       |
| **Think**        | Two Pointers — process whichever side has smaller running max     |
| **Template**     | `if h[l]<h[r]: water+=lMax-h[l], l++ else: water+=rMax-h[r], r--` |
| **Time target**  | ⏱️ 35 min (Hard)                                                  |

> 💡 **Memory hook / Móc nhớ:** "Nước bị giữ bởi bức tường thấp hơn — xử lý bên thấp trước!"

---

## Problem Description

Given `n` non-negative integers representing an elevation map (bar width = 1), compute how much water it can trap after raining.

```
Example 1: height = [0,1,0,2,1,0,1,3,2,1,2,1] → 6
Example 2: height = [4,2,0,3,2,5]              → 9
```

Constraints:

- `n == height.length`, `1 <= n <= 2×10^4`, `0 <= height[i] <= 3×10^4`

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "We have an elevation map as an array. Each bar has width 1.
> We need the total water trapped between bars after rain.
> Clarification: Water at position i = min(leftMax, rightMax) - height[i], if positive?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "Brute force: for each position scan left/right for max — O(n²).
> Optimize 1: precompute leftMax[] and rightMax[] arrays — O(n) time, O(n) space.
> Optimize 2: Two Pointers — process the side with smaller max first.
> If h[left] < h[right], leftMax is the bottleneck → water at left is determined.
> O(n) time, O(1) space. Should I start with DP then optimize?"

### Step 3 — Implement / Viết Code (8-12 min)

> "I'll implement Two Pointers: left=0, right=n-1, leftMax=0, rightMax=0.
> While left < right: if h[left] < h[right], update leftMax, add water at left, move left.
> Otherwise, same logic for right side."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace [0,1,0,2,1,0,1,3,2,1,2,1]:
> L=0(0)<R=11(1): lMax=0, water+=0, L++. L=1(1)<R=11(1): equal, go right.
> ... total accumulates to 6. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(n) — single pass. Space: O(1) — four variables.
> Edge cases: n < 3 → 0; monotonic array → 0; all equal → 0.
> Follow-up: 2D version (LC #407) uses BFS + min-heap from boundary."

---

## 📝 Interview Tips

1. **Clarify**: Each bar width is 1? (Yes) / Chiều rộng mỗi cột có phải 1?
2. **Brute force**: Scan left/right for each position → O(n²) / Quét trái phải mỗi vị trí
3. **Optimize**: DP precompute → O(n)/O(n); Two Pointers → O(n)/O(1)
4. **Edge cases**: `n < 3` → 0; monotonic → 0; all equal → 0
5. **Follow-up**: 2D version (LC #407)? → BFS from boundary with min-heap

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                      | Why Wrong / Tại sao sai                                            | Fix / Cách sửa                             |
| --- | -------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------ |
| 1   | Confuse with Container With Most Water | Container = area between 2 lines; Trapping = sum at every position | Use per-position formula: min(lMax,rMax)-h |
| 2   | Forget to check water ≥ 0              | min(lMax,rMax) - h[i] can be negative at peaks                     | `Math.max(0, min(lMax,rMax) - h[i])`       |
| 3   | Process wrong side in Two Pointers     | Must process the side with smaller max first                       | `if h[l] < h[r]` → process left            |

---

## Solutions

```typescript
/**
 * Solution 1: DP — precompute leftMax and rightMax arrays
 * Time: O(n) — three linear passes
 * Space: O(n) — two auxiliary arrays
 */
function trapDP(height: number[]): number {
  const n = height.length;
  const leftMax = new Array(n);
  const rightMax = new Array(n);

  leftMax[0] = height[0];
  for (let i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i - 1], height[i]);

  rightMax[n - 1] = height[n - 1];
  for (let i = n - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], height[i]);

  let total = 0;
  for (let i = 0; i < n; i++) {
    total += Math.max(0, Math.min(leftMax[i], rightMax[i]) - height[i]);
  }
  return total;
}

/**
 * Solution 2: Two Pointers (Optimal)
 * Time: O(n) — single pass
 * Space: O(1) — four variables
 *
 * Key: if h[left] < h[right], leftMax ≤ rightMax, so water at left is determined.
 */
function trap(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let total = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        total += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        total += rightMax - height[right];
      }
      right--;
    }
  }

  return total;
}

// === Test Cases ===
console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])); // 6
console.log(trap([4, 2, 0, 3, 2, 5])); // 9
console.log(trap([3, 0, 2, 0, 4])); // 7
```

---

## 🔗 Related Problems

- [Container With Most Water](./18-container-with-most-water.md) — Two Pointers nhưng chỉ 2 cột
- [Daily Temperatures](../../stack-queue/problems/11-daily-temperatures.md) — Monotonic Stack
- [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) — Stack-based Hard

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 35 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
