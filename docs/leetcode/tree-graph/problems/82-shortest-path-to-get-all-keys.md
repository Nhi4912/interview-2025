---
layout: page
title: "Shortest Path to Get All Keys"
difficulty: Hard
category: Tree-Graph
tags: [Array, Bit Manipulation, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/shortest-path-to-get-all-keys"
---

# Shortest Path to Get All Keys / Đường Đi Ngắn Nhất Để Lấy Tất Cả Chìa Khóa

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: BFS + Bitmask State
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Minimum Number of Flips to Convert Binary Matrix to Zero Matrix](https://leetcode.com/problems/minimum-number-of-flips-to-convert-binary-matrix-to-zero-matrix) | [Rotting Oranges](https://leetcode.com/problems/rotting-oranges)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như người thám tử cầm chùm chìa khóa đi qua mê cung — trạng thái không chỉ là vị trí mà còn là **bộ chìa khóa đang cầm**. Hai lần đến cùng ô nhưng cầm chìa khóa khác nhau là hai trạng thái khác nhau.

**Pattern Recognition:**

- Signal: "shortest path" + "collect items that change state" → **BFS + Bitmask**
- State = `(row, col, keysMask)` — bitmask encode các chìa đã có
- Key insight: visited cần include keysMask, không chỉ position

**Visual — BFS with Bitmask:**

```
Grid:  "@.a.#"   Keys: a(bit0), b(bit1)
       "###.."   All keys = 0b11 = 3
       "b.LB."

State: (r, c, keys)
Start: (0,0, 0b00)
Pick 'a' at (0,2): state → (0,2, 0b01)
Reach lock 'B' with key 'b': need bit1 set
Reach lock 'L' with key not in mask → blocked
Goal: keys == allKeysMask (0b11)
```

---

## Problem Description

Given a grid containing `@` (start), `.` (empty), `#` (wall), lowercase keys `a-f`, uppercase locks `A-F`. Find the shortest path to collect all keys. ([LeetCode #864](https://leetcode.com/problems/shortest-path-to-get-all-keys))

You need the key `k` to pass through lock `K`. Return minimum steps to collect all keys, or `-1` if impossible.

**Example 1:** `["@.a.#","###.#","b.AB."]` → `8`
**Example 2:** `["@..aA","..B#.","....b"]` → `6`

---

## 📝 Interview Tips

1. **Clarify**: "Số lượng keys tối đa là 6 (a-f) — bitmask fit trong int" / Max 6 keys fits in a bitmask
2. **State design**: "State = (row, col, keysMask) — không thể chỉ visited by position" / Position alone is insufficient
3. **Bitmask ops**: "`key - 'a'` cho index; `mask | (1 << idx)` để thêm key; `mask & (1 << idx)` để check lock" / Bitmask operations
4. **All keys mask**: "Đếm keys trong grid trước để biết target mask" / Precompute allKeys mask from grid
5. **Edge cases**: "Không có keys → 0 bước; locked door chặn mọi đường → -1" / No keys = 0, unreachable = -1
6. **Complexity**: "O(R×C×2^K) states × 4 directions" / State space with bitmask

---

## Solutions

```typescript
/**
 * Solution: BFS with Bitmask State
 * Time: O(R * C * 2^K) where K = number of keys (max 6)
 * Space: O(R * C * 2^K) — visited set
 */
function shortestPathAllKeys(grid: string[]): number {
  const rows = grid.length,
    cols = grid[0].length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  let startR = 0,
    startC = 0,
    allKeys = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ch = grid[r][c];
      if (ch === "@") {
        startR = r;
        startC = c;
      } else if (ch >= "a" && ch <= "f") allKeys |= 1 << (ch.charCodeAt(0) - 97);
    }
  }

  // Queue: [row, col, keysMask, steps]
  const queue: [number, number, number, number][] = [[startR, startC, 0, 0]];
  const visited = new Set<string>([`${startR},${startC},0`]);

  while (queue.length > 0) {
    const [r, c, keys, steps] = queue.shift()!;
    if (keys === allKeys) return steps;

    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const cell = grid[nr][nc];
      if (cell === "#") continue;

      let newKeys = keys;
      // Lock: need corresponding key
      if (cell >= "A" && cell <= "F") {
        if (!(keys & (1 << (cell.charCodeAt(0) - 65)))) continue;
      }
      // Key: pick it up
      if (cell >= "a" && cell <= "f") {
        newKeys |= 1 << (cell.charCodeAt(0) - 97);
      }

      const stateKey = `${nr},${nc},${newKeys}`;
      if (!visited.has(stateKey)) {
        visited.add(stateKey);
        queue.push([nr, nc, newKeys, steps + 1]);
      }
    }
  }

  return -1;
}

// === Test Cases ===
console.log(shortestPathAllKeys(["@.a.#", "###.#", "b.AB."])); // 8
console.log(shortestPathAllKeys(["@..aA", "..B#.", "....b"])); // 6
console.log(shortestPathAllKeys(["@"])); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                                                                                          | Difficulty | Pattern       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix)                                                                   | 🟡 Medium  | BFS grid      |
| [Minimum Number of Flips to Convert Binary Matrix to Zero Matrix](https://leetcode.com/problems/minimum-number-of-flips-to-convert-binary-matrix-to-zero-matrix) | 🔴 Hard    | BFS + bitmask |
| [The Maze](https://leetcode.com/problems/the-maze)                                                                                                               | 🟡 Medium  | BFS/DFS grid  |
| [Word Ladder](https://leetcode.com/problems/word-ladder)                                                                                                         | 🔴 Hard    | BFS state     |
