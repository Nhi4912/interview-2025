---
layout: page
title: "Queens That Can Attack the King"
difficulty: Medium
category: Array
tags: [Array, Matrix, Simulation]
leetcode_url: "https://leetcode.com/problems/queens-that-can-attack-the-king"
---

# Queens That Can Attack the King / Hậu Có Thể Tấn Công Vua

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Matrix / Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Spiral Matrix](https://leetcode.com/problems/spiral-matrix) | [Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Hãy tưởng tượng Vua đứng giữa căn phòng có 8 cánh cửa (8 hướng). Mỗi cánh cửa chỉ có 1 kẻ địch gần nhất mới nguy hiểm — kẻ đứng sau bị che khuất. Từ vị trí vua, nhìn ra theo 8 hướng rồi dừng lại ngay khi gặp hậu đầu tiên.

**Pattern Recognition:**

- Signal: "8 directions from king", "first queen in line-of-sight" → **8-Direction Scan from Source**
- Key insight: đặt queens vào HashSet, scan từ vua ra 8 hướng, lấy hậu đầu tiên gặp được trong mỗi hướng

**Visual — queens=[[0,1],[1,0],[4,0]], king=[0,0]:**

```
  0   1   2   3   4   5   6   7
0[K] [Q]  .   .   .   .   .   .
1[Q]  .   .   .   .   .   .   .
2 .   .   .   .   .   .   .   .

Scan 8 directions from K(0,0):
→ (0,1)=Q ✓  ↓ (1,0)=Q ✓  ↘ (1,1) empty...
↑ OOB  ← OOB  ↗ OOB  ↙ OOB  ↖ OOB

Result: [[1,0],[0,1]]
```

---

## 📝 Problem Description

On an 8×8 chessboard, given queen positions and king position. A queen attacks the king if they share a row/column/diagonal with no queen in between. Return all queens that can attack the king.

**Example 1:** `queens=[[0,1],[1,0],[4,0]], king=[0,0]` → `[[1,0],[0,1]]`
**Example 2:** `queens=[[0,0],[1,1],[2,2],[3,4],[3,5],[4,4],[4,5]], king=[3,3]` → `[[2,2],[3,4],[4,4]]`

**Constraints:** `1 ≤ queens.length ≤ 63`, all positions distinct, king not in queens

---

## 🎯 Interview Tips

1. **HashSet O(1) lookup** / Set tra cứu O(1): lưu queens dạng `"r,c"` string để check nhanh
2. **Scan from king outward** / Quét từ vua ra: 8 hướng, break ngay khi gặp hậu đầu tiên
3. **8 direction vectors** / 8 vector hướng: `[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]`
4. **First blocker** / Hậu đầu tiên mới nguy hiểm: break ngay — queens sau bị che khuất
5. **Boundary check** / Kiểm tra biên: `r∈[0,7]` và `c∈[0,7]`
6. **Board is 8×8** / Bàn cờ 8×8: tối đa 7 bước mỗi hướng → O(56) = O(1) thực sự

---

## 💡 Solutions

### Approach 1: Brute Force — Check Each Queen

/\*_ @complexity Time: O(Q²) | Space: O(Q) _/

```typescript
function queensAttackBrute(queens: number[][], king: number[]): number[][] {
  const qs = new Set(queens.map((q) => `${q[0]},${q[1]}`));
  const res: number[][] = [];
  for (const [qr, qc] of queens) {
    const dr = Math.sign(king[0] - qr),
      dc = Math.sign(king[1] - qc);
    if (dr === 0 && dc === 0) continue;
    if (qr !== king[0] && qc !== king[1] && Math.abs(qr - king[0]) !== Math.abs(qc - king[1]))
      continue;
    let r = qr + dr,
      c = qc + dc,
      blocked = false;
    while (r !== king[0] || c !== king[1]) {
      if (qs.has(`${r},${c}`)) {
        blocked = true;
        break;
      }
      r += dr;
      c += dc;
    }
    if (!blocked) res.push([qr, qc]);
  }
  return res;
}
```

### Approach 2: 8-Direction Scan from King — Optimal

/\*_ @complexity Time: O(8 × 8) = O(1) | Space: O(Q) _/

```typescript
function queensAttackTheKing(queens: number[][], king: number[]): number[][] {
  const qs = new Set(queens.map((q) => `${q[0]},${q[1]}`));
  const res: number[][] = [];
  const dirs = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  for (const [dr, dc] of dirs) {
    let r = king[0] + dr,
      c = king[1] + dc;
    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (qs.has(`${r},${c}`)) {
        res.push([r, c]);
        break;
      }
      r += dr;
      c += dc;
    }
  }
  return res;
}
```

---

## 🧪 Test Cases

```typescript
const q1 = [
  [0, 1],
  [1, 0],
  [4, 0],
];
console.log(queensAttackTheKing(q1, [0, 0])); // → [[1,0],[0,1]]

const q2 = [
  [0, 0],
  [1, 1],
  [2, 2],
  [3, 4],
  [3, 5],
  [4, 4],
  [4, 5],
];
console.log(queensAttackTheKing(q2, [3, 3])); // → [[2,2],[3,4],[4,4]]

console.log(queensAttackTheKing([[5, 6]], [3, 4])); // → [[5,6]] diagonal
console.log(queensAttackBrute(q1, [0, 0])); // → [[0,1],[1,0]]
```

---

## Related Problems

| Problem                                                                                          | Difficulty | Pattern          |
| ------------------------------------------------------------------------------------------------ | ---------- | ---------------- |
| [Available Captures for Rook](https://leetcode.com/problems/available-captures-for-rook)         | Easy       | Matrix Scan      |
| [Spiral Matrix](https://leetcode.com/problems/spiral-matrix)                                     | Medium     | Matrix Traversal |
| [Number of Laser Beams in a Bank](https://leetcode.com/problems/number-of-laser-beams-in-a-bank) | Medium     | Matrix Row       |
