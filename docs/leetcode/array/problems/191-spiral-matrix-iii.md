---
layout: page
title: "Spiral Matrix III"
difficulty: Medium
category: Array
tags: [Array, Matrix, Simulation]
leetcode_url: "https://leetcode.com/problems/spiral-matrix-iii"
---

# Spiral Matrix III / Ma Trận Xoắn Ốc III

🟡 Medium | Array · Matrix · Simulation

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Tưởng tượng bạn đứng ở ô (r0, c0) và đi theo hình xoắn ốc theo chiều kim đồng hồ: phải → xuống → trái → lên, mỗi hướng đi thêm một bước sau mỗi hai lần rẽ. Thu thập tất cả ô nằm trong lưới.

```
Directions: E→S→W→N→E→...
Steps per direction grow: 1,1,2,2,3,3,4,4,...
     ↓ step increases every 2 turns

(r0,c0) → go E 1 step → go S 1 step
       → go W 2 steps → go N 2 steps
       → go E 3 steps → ...
```

## Problem Description

Given `rows x cols` grid and starting position `(r0, c0)`, walk clockwise in a spiral and return all cell coordinates in order of visit (skipping out-of-bounds cells).

- **Example 1**: `rows=1, cols=4, r0=0, c0=0` → `[[0,0],[0,1],[0,2],[0,3]]`
- **Example 2**: `rows=5, cols=6, r0=1, c0=4` → all 30 cells in spiral order from (1,4)

## 📝 Interview Tips

- 💡 **Direction cycle / Chu kỳ hướng**: E→S→W→N (dR=0,1,0,-1 / dC=1,0,-1,0) / hướng tuần hoàn
- 🔍 **Step pattern / Mẫu bước**: Steps go 1,1,2,2,3,3,... — increase by 1 every 2 turns / bước tăng sau mỗi 2 lần rẽ
- ⚠️ **Out-of-bounds / Ngoài lưới**: Continue walking even if out of bounds, only collect in-bounds cells / tiếp tục đi dù ra ngoài
- 🧮 **Termination / Dừng lại**: Stop when collected rows×cols cells / dừng khi đủ ô
- 📊 **Time O(max(r,c)²) / Độ phức tạp**: Spiral path can go far out of bounds / đường xoắn có thể ra ngoài nhiều
- 🎯 **Index check / Kiểm tra biên**: 0 ≤ r < rows && 0 ≤ c < cols / kiểm tra biên trước khi thu thập

## Solutions

### Solution 1: Simulation with Step Count

```typescript
/**
 * Walk spiral, collect in-bounds cells
 * Time: O(max(rows,cols)^2) | Space: O(rows*cols)
 */
function spiralMatrixIII(rows: number, cols: number, r0: number, c0: number): number[][] {
  const result: number[][] = [];
  // Directions: East, South, West, North
  const dr = [0, 1, 0, -1];
  const dc = [1, 0, -1, 0];

  let r = r0,
    c = c0;
  let dir = 0; // start going East
  let steps = 1; // current segment length
  const total = rows * cols;

  result.push([r, c]);

  while (result.length < total) {
    // Each step count is used twice (for two opposite directions)
    for (let turn = 0; turn < 2; turn++) {
      for (let s = 0; s < steps; s++) {
        r += dr[dir];
        c += dc[dir];
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          result.push([r, c]);
          if (result.length === total) return result;
        }
      }
      dir = (dir + 1) % 4;
    }
    steps++;
  }
  return result;
}

// Tests
console.log(spiralMatrixIII(1, 4, 0, 0));
// [[0,0],[0,1],[0,2],[0,3]]
console.log(spiralMatrixIII(5, 6, 1, 4).length); // 30
console.log(spiralMatrixIII(1, 1, 0, 0));
// [[0,0]]
```

### Solution 2: Layer-by-layer explicit spiral

```typescript
/**
 * Explicit direction array with step tracking
 * Time: O(max(rows,cols)^2) | Space: O(rows*cols)
 */
function spiralMatrixIIIv2(rows: number, cols: number, r0: number, c0: number): number[][] {
  const result: number[][] = [[r0, c0]];
  if (rows * cols === 1) return result;

  let r = r0,
    c = c0,
    dir = 0,
    steps = 1;
  const DR = [0, 1, 0, -1];
  const DC = [1, 0, -1, 0];

  while (result.length < rows * cols) {
    for (let repeat = 0; repeat < 2 && result.length < rows * cols; repeat++) {
      for (let i = 0; i < steps; i++) {
        r += DR[dir];
        c += DC[dir];
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          result.push([r, c]);
        }
      }
      dir = (dir + 1) % 4;
    }
    steps++;
  }
  return result;
}

// Tests
console.log(spiralMatrixIIIv2(1, 4, 0, 0));
// [[0,0],[0,1],[0,2],[0,3]]
console.log(spiralMatrixIIIv2(2, 2, 0, 0));
// [[0,0],[0,1],[1,1],[1,0]]
```

## 🔗 Related Problems

| #    | Problem           | Difficulty | Tags               |
| ---- | ----------------- | ---------- | ------------------ |
| 54   | Spiral Matrix     | Medium     | Matrix, Simulation |
| 59   | Spiral Matrix II  | Medium     | Matrix, Simulation |
| 885  | Spiral Matrix III | Medium     | Matrix, Simulation |
| 2326 | Spiral Matrix IV  | Medium     | Matrix, Simulation |
