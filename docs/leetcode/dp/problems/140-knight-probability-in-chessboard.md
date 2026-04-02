---
layout: page
title: "Knight Probability in Chessboard"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/knight-probability-in-chessboard"
---

# Knight Probability in Chessboard / Xác Suất Mã Lưu Trên Bàn Cờ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Forward DP / Probability Propagation

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Thay vì hỏi "con mã đến đây với xác suất bao nhiêu?", hãy lan truyền xác suất từ vị trí hiện tại ra 8 ô tiếp theo. Sau `k` bước, cộng tất cả xác suất còn trên bàn.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Knight Probability in Chessboard example:**

```
n=3 (3×3), k=2, r=0, c=0

Step 0:           Step 1:              Step 2 (partial):
1.000             0      0      0       ...
0      0      0   0      0    0.125
0      0      0   0    0.125   0

From (0,0), knight can reach (1,2) and (2,1) each with prob 1/8.
After k steps, sum all cells still on board.
```

---

## Problem Description

| #    | Title                                | Difficulty | Connection                                 |
| ---- | ------------------------------------ | ---------- | ------------------------------------------ |
| 576  | Out of Boundary Paths                | 🟡 Medium  | Same "probability leaks off grid" DP       |
| 935  | Knight Dialer                        | 🟡 Medium  | Knight moves on phone keypad — count paths |
| 688  | Knight Probability in Chessboard     | 🟡 Medium  | This problem                               |
| 1155 | Number of Dice Rolls With Target Sum | 🟡 Medium  | Forward probability DP over rolls          |

---

## 📝 Interview Tips

- 🔑 **EN:** Forward DP: spread probability from each cell to its 8 neighbors | **VI:** Lan truyền xuôi — mỗi ô đẩy xác suất sang 8 ô kế tiếp (chia 8)
- 🔑 **EN:** Each move has probability `1/8`; moves off-board contribute 0 | **VI:** Nếu ô kế tiếp ngoài bàn cờ → xác suất đó mất đi (not added)
- 🔑 **EN:** Use two 2D arrays (current, next) and swap — O(n²) space | **VI:** Dùng hai lớp (cur/nxt) và swap sau mỗi bước
- 🔑 **EN:** After k steps, answer = sum of all values in current layer | **VI:** Đáp án = tổng toàn bộ lớp hiện tại sau k bước
- 🔑 **EN:** Backward DP also works: `dp[step][r][c] = sum(dp[step-1][nr][nc])/8` | **VI:** Backward cũng được: gom xác suất từ 8 ô nguồn về
- 🔑 **EN:** Time O(k·n²), Space O(n²) — both directions equivalent | **VI:** Độ phức tạp O(k·n²) — cả hai hướng như nhau

---

## Solutions

```typescript
const KNIGHT_MOVES = [
  [-2, -1],
  [-2, 1],
  [-1, -2],
  [-1, 2],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1],
];

// ─── Solution 1: Forward DP (spread probability outward) ──────────────────
function knightProbabilityForward(n: number, k: number, row: number, column: number): number {
  // cur[r][c] = probability of being at (r,c) at current step
  let cur: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  cur[row][column] = 1.0;

  for (let step = 0; step < k; step++) {
    const nxt: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (cur[r][c] === 0) continue;
        for (const [dr, dc] of KNIGHT_MOVES) {
          const nr = r + dr,
            nc = c + dc;
          if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
            nxt[nr][nc] += cur[r][c] / 8;
          }
        }
      }
    }
    cur = nxt;
  }

  return cur.reduce((sum, row) => sum + row.reduce((s, v) => s + v, 0), 0);
}

// ─── Solution 2: Backward DP (gather from neighbors) ─────────────────────
function knightProbability(n: number, k: number, row: number, column: number): number {
  // dp[r][c] = prob that a knight started here k steps ago is now still on board
  // After each backward step: dp[r][c] = avg of dp[nr][nc] over valid moves
  let dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(1.0));

  for (let step = 0; step < k; step++) {
    const nxt: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        for (const [dr, dc] of KNIGHT_MOVES) {
          const nr = r + dr,
            nc = c + dc;
          if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
            nxt[r][c] += dp[nr][nc] / 8;
          }
        }
      }
    }
    dp = nxt;
  }

  return dp[row][column];
}

// ─── Tests ─────────────────────────────────────────────────────────────────
console.log(knightProbability(3, 2, 0, 0).toFixed(5)); // 0.06250
console.log(knightProbabilityForward(3, 2, 0, 0).toFixed(5)); // 0.06250
console.log(knightProbability(1, 0, 0, 0).toFixed(5)); // 1.00000
console.log(knightProbability(8, 30, 6, 4).toFixed(5)); // 0.00018 (approx)
```

---

## 🔗 Related Problems

| #    | Title                                | Difficulty | Connection                                 |
| ---- | ------------------------------------ | ---------- | ------------------------------------------ |
| 576  | Out of Boundary Paths                | 🟡 Medium  | Same "probability leaks off grid" DP       |
| 935  | Knight Dialer                        | 🟡 Medium  | Knight moves on phone keypad — count paths |
| 688  | Knight Probability in Chessboard     | 🟡 Medium  | This problem                               |
| 1155 | Number of Dice Rolls With Target Sum | 🟡 Medium  | Forward probability DP over rolls          |
