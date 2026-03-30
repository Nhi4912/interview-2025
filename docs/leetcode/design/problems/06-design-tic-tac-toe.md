---
layout: page
title: "Design Tic-Tac-Toe"
difficulty: Medium
category: Design
tags: [Design, Array, Matrix]
leetcode_url: "https://leetcode.com/problems/design-tic-tac-toe/"
---

# Design Tic-Tac-Toe / Thiết Kế Tic-Tac-Toe

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Counter Array Design
> **Frequency**: 📘 Tier 3
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese)**: Thay vì lưu toàn bộ bảng, hãy nghĩ như trọng tài đếm điểm: "Player 1 đã chiếm bao nhiêu ô ở hàng 2? Cột 0? Đường chéo chính?". Khi bất kỳ con số nào đạt `n`, người đó thắng. Không cần scan lại bảng.

**Pattern Recognition**: Cần kiểm tra thắng O(1) sau mỗi nước đi → đếm trên từng hàng/cột/đường chéo cho từng player thay vì quét O(n).

**ASCII Visual**:

```
n=3, track counts per player (1-indexed):
rows[p][row], cols[p][col], diag[p][0=main], diag[p][1=anti]

move(2,0,1): rows[1][2]++ → 1, cols[1][0]++ → 1
move(2,1,1): rows[1][2]++ → 2
move(2,2,1): rows[1][2]++ → 3 == n → Player 1 WINS!
```

## Problem Description

Design a Tic-Tac-Toe game on `n × n` board. `move(row, col, player)` returns `0` (no winner), `1` or `2` (winner).

**Example** (`n = 3`):

```
(0,0,1)→0  (0,2,2)→0  (2,2,1)→0  (1,1,2)→0
(2,0,1)→0  (1,0,2)→0  (2,1,1)→1   ← P1 fills row 2
```

**Constraints**: `2 ≤ n ≤ 100`, player ∈ {1, 2}, moves are always valid.

## 📝 Interview Tips

- **Key insight**: Không cần lưu bảng — đếm trên hàng/cột/đường chéo là đủ để phát hiện thắng trong O(1).
- **O(1) per move**: Keep per-player counts for each row, each column, and both diagonals — 4 arrays total.
- **Diagonal conditions**: Main diagonal when `row === col`; anti-diagonal when `row + col === n - 1`.
- **Two-player indexing**: Dùng `rows[player]` (player là 1 hoặc 2) tránh if/else, code gọn hơn.
- **Brute-force fallback**: Lưu toàn bộ bảng, scan hàng/cột sau mỗi move — O(n) per move, dễ code khi quên cách tối ưu.
- **Scale follow-up**: Distributed → hash move tới node chứa counter của hàng/cột đó.

## Solutions

{% raw %}
/\*\*

- Design Tic-Tac-Toe — LeetCode #348
-
- Solution 1 (Optimal): Counter arrays — O(1) per move, O(n) space
- Track row/col/diagonal counts per player; win when any count reaches n.
-
- rows[p][r] = how many cells player p owns in row r
- cols[p][c] = how many cells player p owns in col c
- diags[p][0] = main diagonal count for player p
- diags[p][1] = anti-diagonal count for player p
  \*/
  class TicTacToe {
  private n: number;
  private rows: number[][]; // [player 1|2][row index]
  private cols: number[][]; // [player 1|2][col index]
  private diags: number[][]; // [player 1|2][0=main, 1=anti]

constructor(n: number) {
this.n = n;
this.rows = [[], new Array(n).fill(0), new Array(n).fill(0)];
    this.cols  = [[], new Array(n).fill(0), new Array(n).fill(0)];
    this.diags = [[], [0, 0], [0, 0]];
}

/\*\*

- Place player's mark; return winner or 0.
- Đặt quân cờ; trả về người thắng hoặc 0.
  \*/
  move(row: number, col: number, player: number): number {
  this.rows[player][row]++;
  this.cols[player][col]++;
  if (row === col) this.diags[player][0]++;
  if (row + col === this.n - 1) this.diags[player][1]++;


    const n = this.n;
    if (
      this.rows[player][row]  === n ||
      this.cols[player][col]  === n ||
      this.diags[player][0]   === n ||
      this.diags[player][1]   === n
    ) return player;

    return 0;

}
}

// Inline tests — LeetCode example 1
const game = new TicTacToe(3);
console.assert(game.move(0, 0, 1) === 0);
console.assert(game.move(0, 2, 2) === 0);
console.assert(game.move(2, 2, 1) === 0);
console.assert(game.move(1, 1, 2) === 0);
console.assert(game.move(2, 0, 1) === 0);
console.assert(game.move(1, 0, 2) === 0);
console.assert(game.move(2, 1, 1) === 1, 'Player 1 wins row 2');

// Diagonal win
const g2 = new TicTacToe(3);
g2.move(0, 0, 1); g2.move(0, 1, 2);
g2.move(1, 1, 1); g2.move(0, 2, 2);
console.assert(g2.move(2, 2, 1) === 1, 'Player 1 wins main diagonal');
{% endraw %}

## 🔗 Related Problems

- [LC 36 — Valid Sudoku](https://leetcode.com/problems/valid-sudoku/) — same per-row/col counter pattern
- [LC 73 — Set Matrix Zeroes](https://leetcode.com/problems/set-matrix-zeroes/) — in-place matrix tracking
- [LC 208 — Implement Trie](https://leetcode.com/problems/implement-trie-prefix-tree/) — OOP design with arrays
- [LC 146 — LRU Cache](https://leetcode.com/problems/lru-cache/) — design with O(1) constraints
