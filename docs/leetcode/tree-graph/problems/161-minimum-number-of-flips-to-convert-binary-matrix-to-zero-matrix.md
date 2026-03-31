---
layout: page
title: "Minimum Number of Flips to Convert Binary Matrix to Zero Matrix"
difficulty: Hard
category: Tree-Graph
tags: [Array, Hash Table, Bit Manipulation, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-flips-to-convert-binary-matrix-to-zero-matrix"
---

# Minimum Number of Flips to Convert Binary Matrix to Zero Matrix / Số lần lật tối thiểu để chuyển ma trận nhị phân thành ma trận 0

🔴 Hard | BFS | Bitmask State

---

## 🧠 Intuition

**Vietnamese:** Mỗi trạng thái ma trận có thể biểu diễn bằng một số nguyên (bitmask). BFS trên không gian trạng thái — mỗi bước là 1 lần lật một ô (ô đó và 4 hàng xóm bị đảo ngược).

**English:** Encode the entire matrix as a single bitmask integer. BFS explores all reachable states level-by-level; each step flips cell (r,c) and its 4 neighbors. The goal state is `0`.

```
Matrix [[0,0],[0,1]] → bitmask = 0b0001 = 1
Flip (1,1): toggle (1,1),(0,1),(1,0) → 0b0110 = 6
Flip (0,1): toggle (0,1),(0,0),(1,1) → 0b0000 = 0  ← done in 2 steps
```

---

## 📝 Interview Tips

- 🔑 **Key insight / Nhận xét chính:** The matrix has at most 3×3 = 9 cells → at most 2^9 = 512 states — BFS is feasible.
- 📊 **State encoding / Mã hóa trạng thái:** `state = sum(mat[r][c] << (r*cols+c))` turns the matrix into an int.
- ⚡ **Flip mask / Mặt nạ lật:** Precompute flip masks for each cell (self + neighbors); XOR with state to get next state.
- 🎯 **BFS guarantees minimum / BFS đảm bảo tối thiểu:** First time we reach state 0 is the shortest path.
- 🧩 **Edge case / Trường hợp đặc biệt:** If initial state is already 0, return 0 immediately.
- 📏 **Complexity / Độ phức tạp:** O(2^(m*n) × m*n) time — feasible only for small m,n (≤3).

---

## Solutions

### Solution 1 — BFS on Bitmask State (Optimal)

```typescript
/**
 * Encode matrix as bitmask; BFS until we reach state 0.
 * Each move XORs a precomputed flip-mask for one cell.
 *
 * Time:  O(2^(m*n) * m*n)
 * Space: O(2^(m*n))
 */
function minFlips(mat: number[][]): number {
  const rows = mat.length;
  const cols = mat[0].length;
  const total = rows * cols;

  // Build flip masks: flipping cell i toggles i and its 4 neighbors
  const flipMask: number[] = new Array(total).fill(0);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      flipMask[idx] |= 1 << idx;
      if (r > 0) flipMask[idx] |= 1 << ((r - 1) * cols + c);
      if (r < rows - 1) flipMask[idx] |= 1 << ((r + 1) * cols + c);
      if (c > 0) flipMask[idx] |= 1 << (r * cols + c - 1);
      if (c < cols - 1) flipMask[idx] |= 1 << (r * cols + c + 1);
    }
  }

  // Encode initial state
  let init = 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) if (mat[r][c]) init |= 1 << (r * cols + c);

  if (init === 0) return 0;

  const visited = new Set<number>([init]);
  let queue: number[] = [init];
  let steps = 0;

  while (queue.length > 0) {
    steps++;
    const next: number[] = [];
    for (const state of queue) {
      for (let i = 0; i < total; i++) {
        const ns = state ^ flipMask[i];
        if (ns === 0) return steps;
        if (!visited.has(ns)) {
          visited.add(ns);
          next.push(ns);
        }
      }
    }
    queue = next;
  }
  return -1;
}

console.log(
  minFlips([
    [0, 0],
    [0, 1],
  ]),
); // 3
console.log(minFlips([[0]])); // 0
console.log(
  minFlips([
    [1, 0, 0],
    [1, 0, 0],
  ]),
); // -1
```

---

## 🔗 Related Problems

| #    | Problem                          | Difficulty | Pattern       |
| ---- | -------------------------------- | ---------- | ------------- |
| 847  | Shortest Path Visiting All Nodes | Hard       | BFS + Bitmask |
| 864  | Shortest Path to Get All Keys    | Hard       | BFS + State   |
| 1284 | Minimum Number of Flips (this)   | Hard       | BFS + Bitmask |
