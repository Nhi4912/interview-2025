---
layout: page
title: "Largest Plus Sign"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/largest-plus-sign"
---

# Largest Plus Sign / Dấu Cộng Lớn Nhất

🟡 Medium | Dynamic Programming · Matrix

---

## 🧠 Intuition

**EN:** For each cell, the arm length of a plus sign is limited by the shortest arm in any of the 4 directions. Precompute consecutive 1s in each direction: `up[i][j]`, `down[i][j]`, `left[i][j]`, `right[i][j]`. The order of the plus at `(i,j)` = `min(up, down, left, right)`.

**VI:** Với mỗi ô, cánh tay của dấu cộng bị giới hạn bởi cánh tay ngắn nhất trong 4 hướng. Tính trước số ô liên tiếp bằng 1 theo mỗi hướng: `up`, `down`, `left`, `right`. Bậc dấu cộng tại (i,j) = `min(up, down, left, right)`.

```
n=5, mines={(4,2)}
Grid (1=active, 0=mine):
1 1 1 1 1
1 1 1 1 1
1 1 1 1 1
1 1 1 1 1
1 1 0 1 1

left[i][j]:  up[i][j]:  right[i][j]:  down[i][j]:
1 2 3 4 5   1 2 3 4 5   5 4 3 2 1    5 5 4 5 5  (approx)
...

order(i,j) = min(left,right,up,down) → max order = 2
```

---

## 📝 Interview Tips

- 🔑 **EN:** 4-pass DP: compute consecutive 1s in left, right, up, down directions separately. **VI:** DP 4 lần: tính số ô liên tiếp bằng 1 theo hướng trái, phải, trên, xuống riêng biệt.
- 🔑 **EN:** For a mine cell: all 4 arm arrays are 0. For others: `left[i][j] = left[i][j-1] + 1`. **VI:** Ô mìn: cả 4 mảng = 0. Ô khác: left[i][j] = left[i][j-1] + 1.
- 🔑 **EN:** Answer = `max over all (i,j) of min(up[i][j], down[i][j], left[i][j], right[i][j])`. **VI:** Kết quả = max qua mọi (i,j) của min(up, down, left, right).
- 🔑 **EN:** Use a Set for mine positions for O(1) lookup. **VI:** Dùng Set để kiểm tra ô mìn trong O(1).
- 🔑 **EN:** All 4 directions need separate passes; can merge up/left (top-left to bottom-right) and down/right (bottom-right to top-left). **VI:** Có thể gộp up+left và down+right thành 2 lần duyệt thay vì 4.
- 🔑 **EN:** Edge case: `n=1` with no mines → answer is 1. **VI:** Trường hợp biên: n=1, không có mìn → kết quả là 1.

---

## 💡 Solutions

```typescript
/**
 * 4-directional DP: precompute arm lengths
 * Time: O(n^2)  Space: O(n^2)
 */
function orderOfLargestPlusSign(n: number, mines: number[][]): number {
  const mineSet = new Set<number>(mines.map(([r, c]) => r * n + c));

  const isAlive = (r: number, c: number) => !mineSet.has(r * n + c);

  // Precompute 4 directional consecutive counts
  const left = Array.from({ length: n }, () => new Array(n).fill(0));
  const right = Array.from({ length: n }, () => new Array(n).fill(0));
  const up = Array.from({ length: n }, () => new Array(n).fill(0));
  const down = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (isAlive(i, j)) left[i][j] = j === 0 ? 1 : left[i][j - 1] + 1;
    }
    for (let j = n - 1; j >= 0; j--) {
      if (isAlive(i, j)) right[i][j] = j === n - 1 ? 1 : right[i][j + 1] + 1;
    }
  }
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      if (isAlive(i, j)) up[i][j] = i === 0 ? 1 : up[i - 1][j] + 1;
    }
    for (let i = n - 1; i >= 0; i--) {
      if (isAlive(i, j)) down[i][j] = i === n - 1 ? 1 : down[i + 1][j] + 1;
    }
  }

  let ans = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (isAlive(i, j)) {
        ans = Math.max(ans, Math.min(left[i][j], right[i][j], up[i][j], down[i][j]));
      }
    }
  }
  return ans;
}

/**
 * 2-pass optimized: combine directions
 * Time: O(n^2)  Space: O(n^2)
 */
function orderOfLargestPlusSignV2(n: number, mines: number[][]): number {
  const mineSet = new Set<number>(mines.map(([r, c]) => r * n + c));
  const dp = Array.from({ length: n }, () => new Array(n).fill(n));
  // Mark mines
  for (const [r, c] of mines) dp[r][c] = 0;

  for (let i = 0; i < n; i++) {
    // Left pass
    let cnt = 0;
    for (let j = 0; j < n; j++) {
      cnt = mineSet.has(i * n + j) ? 0 : cnt + 1;
      dp[i][j] = Math.min(dp[i][j], cnt);
    }
    // Right pass
    cnt = 0;
    for (let j = n - 1; j >= 0; j--) {
      cnt = mineSet.has(i * n + j) ? 0 : cnt + 1;
      dp[i][j] = Math.min(dp[i][j], cnt);
    }
  }
  for (let j = 0; j < n; j++) {
    // Up pass
    let cnt = 0;
    for (let i = 0; i < n; i++) {
      cnt = mineSet.has(i * n + j) ? 0 : cnt + 1;
      dp[i][j] = Math.min(dp[i][j], cnt);
    }
    // Down pass
    cnt = 0;
    for (let i = n - 1; i >= 0; i--) {
      cnt = mineSet.has(i * n + j) ? 0 : cnt + 1;
      dp[i][j] = Math.min(dp[i][j], cnt);
    }
  }

  return Math.max(...dp.flat());
}

// Tests
console.log(orderOfLargestPlusSign(5, [[4, 2]])); // 2
console.log(orderOfLargestPlusSign(1, [[0, 0]])); // 0
console.log(orderOfLargestPlusSignV2(5, [[4, 2]])); // 2
console.log(orderOfLargestPlusSignV2(2, [])); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                           | Difficulty | Pattern      |
| ------------------------------------------------------------------------------------------------- | ---------- | ------------ |
| [Maximal Square](https://leetcode.com/problems/maximal-square/)                                   | 🟡 Medium  | Grid DP      |
| [Count Submatrices With All Ones](https://leetcode.com/problems/count-submatrices-with-all-ones/) | 🟡 Medium  | Grid DP      |
| [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle/)                             | 🔴 Hard    | Stack + Grid |
