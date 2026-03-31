---
layout: page
title: "Trapping Rain Water"
difficulty: Hard
category: Array
tags: [Array, Two Pointers, Stack, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/trapping-rain-water/"
---

# Trapping Rain Water / Bẫy Nước Mưa

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Two Pointers / Stack
> **Frequency**: 🔥 Tier 1 — Câu hỏi Hard kinh điển nhất, gần như bắt buộc ở FAANG onsite
> **See also**: [Container With Most Water](./18-container-with-most-water.md) | [Daily Temperatures](../../others/problems/11-daily-temperatures.md) | [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Dãy núi sau cơn mưa — nước đọng lại ở các thung lũng. Lượng nước tại vị trí `i` bị giới hạn bởi bức tường cao nhất bên trái VÀ bức tường cao nhất bên phải. Nước đọng = `min(leftMax, rightMax) - height[i]` (nếu dương).

**Pattern Recognition:**

- Signal: "trapped water / elevation map" → **Two Pointers hoặc Precompute prefix max**
- Key formula: `water[i] = max(0, min(leftMax[i], rightMax[i]) - height[i])`
- Two Pointers: xử lý phía có `max` nhỏ hơn trước — nước tại đó đã được xác định chắc chắn

**Visual — water at each position for [0,1,0,2,1,0,1,3,2,1,2,1]:**

```
index:    0  1  2  3  4  5  6  7  8  9 10 11
height:   0  1  0  2  1  0  1  3  2  1  2  1
leftMax:  0  1  1  2  2  2  2  3  3  3  3  3
rightMax: 3  3  3  3  3  3  3  3  2  2  2  1
water:    0  0  1  0  1  2  1  0  0  1  0  0  → total = 6
                ↑        ↑  ↑           ↑
           min(1,3)-0  min(2,3)-0  min(3,2)-1
```

---

## Problem Description

Given `n` non-negative integers representing an elevation map (each bar width = 1), compute how much water it can trap after raining.

```
Example 1: height = [0,1,0,2,1,0,1,3,2,1,2,1] → 6
Example 2: height = [4,2,0,3,2,5]              → 9
```

Constraints:

- `n == height.length`, `1 <= n <= 2×10^4`, `0 <= height[i] <= 3×10^4`

---

## 📝 Interview Tips

1. **Clarify**: "Chiều rộng mỗi cột có phải là 1 không?" — Is each bar width exactly 1? (Yes)
2. **Brute force**: Với mỗi vị trí, quét trái và phải tìm max → O(n²) / O(1)
3. **Optimize**: DP precompute leftMax/rightMax arrays → O(n) / O(n); Two Pointers → O(n) / O(1)
4. **Edge cases**: `n < 3` → 0 nước; mảng tăng dần / giảm dần → 0 nước; tất cả bằng nhau → 0
5. **Follow-up**: "Bài 2D (volume of water in 3D terrain)?" → BFS từ biên với min-heap (LeetCode #407)

---

## Solutions

```typescript

/**

- Solution 1: Brute Force — scan left/right for each position
- Time: O(n²) — for each of n positions, scan O(n) in each direction
- Space: O(1)
  */
  function trapBrute(height: number[]): number {
  let total = 0;

for (let i = 1; i < height.length - 1; i++) {
let leftMax = 0;
for (let j = 0; j < i; j++) leftMax = Math.max(leftMax, height[j]);

    let rightMax = 0;
    for (let j = i + 1; j < height.length; j++) rightMax = Math.max(rightMax, height[j]);

    total += Math.max(0, Math.min(leftMax, rightMax) - height[i]);

}

return total;
}

/**

- Solution 2: DP — precompute leftMax and rightMax arrays
- Time: O(n) — three linear passes
- Space: O(n) — two auxiliary arrays
-
- Good stepping stone: easy to explain before jumping to two pointers.
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

- Solution 3: Two Pointers (Optimal — O(1) space)
- Time: O(n) — single pass
- Space: O(1)
-
- Key insight: if height[left] < height[right], we know leftMax < rightMax
- so water at left = leftMax - height[left] (rightMax doesn't matter, it's ≥ leftMax).
- Process whichever side has the smaller running max.
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
leftMax = height[left]; // new left max, no water here
} else {
total += leftMax - height[left]; // water trapped
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
console.log(trap([1, 0, 1])); // 1

```

---

## 🔗 Related Problems

- [Container With Most Water](./18-container-with-most-water.md) — cùng Two Pointers nhưng chỉ 2 cột, đơn giản hơn
- [Daily Temperatures](../../others/problems/11-daily-temperatures.md) — Monotonic Stack tìm phần tử lớn hơn tiếp theo
- [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) — Stack-based, bài Hard tương tự về histogram
