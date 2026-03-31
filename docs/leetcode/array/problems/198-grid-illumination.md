---
layout: page
title: "Grid Illumination"
difficulty: Hard
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/grid-illumination"
---

# Grid Illumination / Chiếu Sáng Lưới

🔴 Hard | Array · Hash Table

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Mỗi bóng đèn chiếu sáng toàn bộ hàng, cột, và hai đường chéo qua nó. Khi hỏi điểm (r, c), kiểm tra xem có đèn nào chiếu sáng nó không (cùng hàng, cột, hoặc đường chéo). Sau đó tắt tất cả đèn trong ô 3×3 quanh (r, c).

```
n=5, lamps=[(0,0),(4,4)]
Query (2,2):
  Row 2? No lamp. Col 2? No lamp.
  Diag (r-c)? 0-0=0, 4-4=0 → diag=0 → illuminated! ✓
  Answer: 1
  Turn off 3×3 around (2,2): remove lamp (2,2) if exists, check neighbors
```

## Problem Description

Given `n×n` grid, place lamps at positions in `lamps[]`. Each lamp illuminates its **row**, **column**, and both **diagonals**. For each query `(r,c)`: answer 1 if illuminated, 0 otherwise, then turn off all lamps in the 3×3 area around `(r,c)`.

- **Example 1**: `n=5, lamps=[[0,0],[4,4]], queries=[[1,1],[1,0]]` → `[1,0]`
- **Example 2**: `n=5, lamps=[[0,0],[0,4]], queries=[[0,4],[0,1],[1,4]]` → `[1,1,0]`

## 📝 Interview Tips

- 💡 **4 hash maps / 4 bảng băm**: Track row, col, diagonal (r-c), anti-diagonal (r+c) lamp counts / theo dõi số đèn mỗi hàng/cột/đường chéo
- 🔍 **Diagonal keys / Khóa đường chéo**: Main diag = r-c (constant), anti diag = r+c (constant) / đường chéo chính = r-c, phụ = r+c
- ⚠️ **Lamp dedup / Loại trùng**: Same lamp position may appear twice in input — use a Set / vị trí đèn có thể trùng, dùng Set
- 🧮 **O(L + Q×9) / Độ phức tạp**: L lamps + Q queries × 9 neighbors / L đèn + Q truy vấn × 9 ô xung quanh
- 📊 **Turn-off check / Kiểm tra tắt đèn**: When turning off, verify lamp actually existed (is in lamp set) / kiểm tra đèn có tồn tại không trước khi tắt
- 🎯 **Large n / n lớn**: n up to 1e9 — can't use 2D array, must use hash maps / n đến 1e9, phải dùng hash map

## Solutions

### Solution 1: Four Hash Maps (Optimal)

```typescript
/**
 * Track illumination via row/col/diag/antiDiag lamp count maps
 * Time: O(L + Q) | Space: O(L)
 * L = number of lamps, Q = number of queries
 */
function gridIllumination(n: number, lamps: number[][], queries: number[][]): number[] {
  const rowMap = new Map<number, number>();
  const colMap = new Map<number, number>();
  const diagMap = new Map<number, number>(); // r - c
  const antiMap = new Map<number, number>(); // r + c
  const lampSet = new Set<string>();

  const inc = (map: Map<number, number>, key: number) => map.set(key, (map.get(key) ?? 0) + 1);
  const dec = (map: Map<number, number>, key: number) => {
    const v = (map.get(key) ?? 0) - 1;
    if (v <= 0) map.delete(key);
    else map.set(key, v);
  };

  // Add all lamps (deduplicate)
  for (const [r, c] of lamps) {
    const key = `${r},${c}`;
    if (!lampSet.has(key)) {
      lampSet.add(key);
      inc(rowMap, r);
      inc(colMap, c);
      inc(diagMap, r - c);
      inc(antiMap, r + c);
    }
  }

  const result: number[] = [];

  for (const [qr, qc] of queries) {
    // Check if (qr,qc) is illuminated
    const lit =
      (rowMap.get(qr) ?? 0) > 0 ||
      (colMap.get(qc) ?? 0) > 0 ||
      (diagMap.get(qr - qc) ?? 0) > 0 ||
      (antiMap.get(qr + qc) ?? 0) > 0;
    result.push(lit ? 1 : 0);

    // Turn off all lamps in 3×3 neighborhood
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = qr + dr,
          nc = qc + dc;
        if (nr < 0 || nr >= n || nc < 0 || nc >= n) continue;
        const key = `${nr},${nc}`;
        if (lampSet.has(key)) {
          lampSet.delete(key);
          dec(rowMap, nr);
          dec(colMap, nc);
          dec(diagMap, nr - nc);
          dec(antiMap, nr + nc);
        }
      }
    }
  }
  return result;
}

// Tests
console.log(
  gridIllumination(
    5,
    [
      [0, 0],
      [4, 4],
    ],
    [
      [1, 1],
      [1, 0],
    ],
  ),
); // [1,0]
console.log(
  gridIllumination(
    5,
    [
      [0, 0],
      [0, 4],
    ],
    [
      [0, 4],
      [0, 1],
      [1, 4],
    ],
  ),
); // [1,1,0]
console.log(gridIllumination(1, [[0, 0]], [[0, 0]])); // [1]
```

### Solution 2: Using Map with numeric keys (faster hashing)

```typescript
/**
 * Encode lamp position as single number to avoid string keys
 * Time: O(L + Q) | Space: O(L)
 */
function gridIlluminationFast(n: number, lamps: number[][], queries: number[][]): number[] {
  const rowCnt = new Map<number, number>();
  const colCnt = new Map<number, number>();
  const diagCnt = new Map<number, number>();
  const antiCnt = new Map<number, number>();
  const active = new Set<number>(); // encode as r*100001 + c (n ≤ 1e9, so use BigInt-safe encoding)

  const encode = (r: number, c: number) => r * 100001 + c;
  const add = (m: Map<number, number>, k: number) => m.set(k, (m.get(k) ?? 0) + 1);
  const sub = (m: Map<number, number>, k: number) => {
    const v = (m.get(k) ?? 1) - 1;
    v > 0 ? m.set(k, v) : m.delete(k);
  };

  for (const [r, c] of lamps) {
    const code = encode(r, c);
    if (!active.has(code)) {
      active.add(code);
      add(rowCnt, r);
      add(colCnt, c);
      add(diagCnt, r - c);
      add(antiCnt, r + c);
    }
  }

  return queries.map(([qr, qc]) => {
    const lit =
      (rowCnt.get(qr) ?? 0) > 0 ||
      (colCnt.get(qc) ?? 0) > 0 ||
      (diagCnt.get(qr - qc) ?? 0) > 0 ||
      (antiCnt.get(qr + qc) ?? 0) > 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = qr + dr,
          nc = qc + dc;
        if (nr < 0 || nr >= n || nc < 0 || nc >= n) continue;
        const code = encode(nr, nc);
        if (active.has(code)) {
          active.delete(code);
          sub(rowCnt, nr);
          sub(colCnt, nc);
          sub(diagCnt, nr - nc);
          sub(antiCnt, nr + nc);
        }
      }
    }
    return lit ? 1 : 0;
  });
}

// Tests
console.log(
  gridIlluminationFast(
    5,
    [
      [0, 0],
      [4, 4],
    ],
    [
      [1, 1],
      [1, 0],
    ],
  ),
); // [1,0]
console.log(
  gridIlluminationFast(
    5,
    [
      [0, 0],
      [0, 4],
    ],
    [
      [0, 4],
      [0, 1],
      [1, 4],
    ],
  ),
); // [1,1,0]
```

## 🔗 Related Problems

| #    | Problem                           | Difficulty | Tags          |
| ---- | --------------------------------- | ---------- | ------------- |
| 51   | N-Queens                          | Hard       | Backtracking  |
| 52   | N-Queens II                       | Hard       | Backtracking  |
| 1001 | Grid Illumination                 | Hard       | Hash Table    |
| 2257 | Count Unguarded Cells in the Grid | Medium     | Array, Matrix |
