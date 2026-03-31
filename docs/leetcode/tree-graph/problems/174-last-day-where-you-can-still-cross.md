---
layout: page
title: "Last Day Where You Can Still Cross"
difficulty: Hard
category: Tree-Graph
tags: [Array, Binary Search, Depth-First Search, Breadth-First Search, Union Find]
leetcode_url: "https://leetcode.com/problems/last-day-where-you-can-still-cross"
---

# Last Day Where You Can Still Cross / Ngày Cuối Cùng Có Thể Băng Qua

🔴 Hard | Binary Search + BFS / Union-Find Reversed | [LeetCode 2258](https://leetcode.com/problems/last-day-where-you-can-still-cross)

---

## 🧠 Intuition / Trực giác

**Vietnamese:** Mỗi ngày một ô đất biến thành nước — ta cần tìm ngày cuối cùng vẫn có thể đi từ hàng đầu xuống hàng cuối (chỉ đi trên đất liền). Có hai cách: (1) Binary search + BFS kiểm tra ngày mid; (2) Đảo ngược thời gian — thêm ô từ ngày cuối → đầu, dùng Union-Find để biết khi nào top-row nối được với bottom-row.

```
Day 1: . . . .    Day 2: . X . .    Day 3: . X . .
       . . . .           . . . .           . X . .
       . . . .           . . . .           . . . .
Cross? YES (row0→row2)   YES              NO (blocked)
Binary search: lo=1, hi=3 → answer=2
```

---

## 📝 Interview Tips / Gợi ý phỏng vấn

- 🔑 **EN:** Binary search on day — monotone property: if cross on day d, also on d-1 | **VI:** Tính đơn điệu — qua được ngày d thì ngày d-1 cũng qua được
- 🔑 **EN:** BFS check: start from top row (land cells), try to reach bottom row | **VI:** BFS từ hàng trên xuống hàng dưới
- 🔑 **EN:** Union-Find approach: process days in reverse, add cells → connect to virtual TOP/BOT nodes | **VI:** Đảo chiều thời gian + Union-Find với node ảo TOP và BOT
- 🔑 **EN:** 4-directional connectivity (not 8-directional) for crossing | **VI:** Kết nối 4 chiều
- 🔑 **EN:** UF approach is O(row×col×α) vs BFS O(row×col×log(row×col)) | **VI:** UF nhanh hơn BFS tổng thể
- 🔑 **EN:** Virtual nodes TOP (index row*col) and BOT (index row*col+1) simplify UF | **VI:** Node ảo TOP và BOT đơn giản hoá kiểm tra kết nối

---

## 💡 Solutions / Giải pháp

```typescript
/**
 * Binary Search + BFS
 * Time: O(row*col * log(row*col))
 * Space: O(row*col)
 */
function latestDayToCross(row: number, col: number, cells: number[][]): number {
  const canCross = (day: number): boolean => {
    // Build grid up to this day (flooded cells)
    const flooded = new Set<number>();
    for (let i = 0; i < day; i++) flooded.add((cells[i][0] - 1) * col + (cells[i][1] - 1));

    const queue: [number, number][] = [];
    for (let c = 0; c < col; c++) {
      if (!flooded.has(c)) queue.push([0, c]); // top row land cells
    }

    const visited = new Set<number>(queue.map(([r, c]) => r * col + c));
    const dirs = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      if (r === row - 1) return true; // reached bottom row

      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        const key = nr * col + nc;
        if (nr >= 0 && nr < row && nc >= 0 && nc < col && !flooded.has(key) && !visited.has(key)) {
          visited.add(key);
          queue.push([nr, nc]);
        }
      }
    }
    return false;
  };

  let lo = 1,
    hi = row * col,
    ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (canCross(mid)) {
      ans = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return ans;
}

console.log(
  latestDayToCross(2, 2, [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2],
  ]),
); // 2
console.log(
  latestDayToCross(2, 2, [
    [1, 1],
    [1, 2],
    [2, 1],
    [2, 2],
  ]),
); // 1
console.log(
  latestDayToCross(3, 3, [
    [1, 2],
    [2, 1],
    [3, 3],
    [2, 2],
    [1, 1],
    [1, 3],
    [2, 3],
    [3, 2],
    [3, 1],
  ]),
); // 3
```

```typescript
/**
 * Union-Find with Reversed Timeline (Optimal)
 * Time: O(row*col*α)  Space: O(row*col)
 */
function latestDayToCrossUF(row: number, col: number, cells: number[][]): number {
  const total = row * col;
  const TOP = total,
    BOT = total + 1;
  const parent = Array.from({ length: total + 2 }, (_, i) => i);
  const rank = new Array(total + 2).fill(0);

  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const union = (a: number, b: number): void => {
    const ra = find(a),
      rb = find(b);
    if (ra === rb) return;
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else {
      parent[rb] = ra;
      rank[ra]++;
    }
  };

  // Start with all cells flooded; process days in reverse (add land back)
  const isLand = new Array(total).fill(false);
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  for (let d = cells.length - 1; d >= 0; d--) {
    const r = cells[d][0] - 1,
      c = cells[d][1] - 1;
    const idx = r * col + c;
    isLand[idx] = true;

    // Connect to virtual nodes
    if (r === 0) union(idx, TOP);
    if (r === row - 1) union(idx, BOT);

    // Connect to adjacent land cells
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < row && nc >= 0 && nc < col && isLand[nr * col + nc])
        union(idx, nr * col + nc);
    }

    // Check if TOP and BOT are connected
    if (find(TOP) === find(BOT)) return d;
  }
  return 0;
}

console.log(
  latestDayToCrossUF(2, 2, [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2],
  ]),
); // 2
console.log(
  latestDayToCrossUF(3, 3, [
    [1, 2],
    [2, 1],
    [3, 3],
    [2, 2],
    [1, 1],
    [1, 3],
    [2, 3],
    [3, 2],
    [3, 1],
  ]),
); // 3
```

---

## 🔗 Related Problems / Bài liên quan

| Problem                                                                             | Difficulty | Key Idea                         |
| ----------------------------------------------------------------------------------- | ---------- | -------------------------------- |
| [Swim in Rising Water 778](https://leetcode.com/problems/swim-in-rising-water)      | Hard       | Binary search / Dijkstra on time |
| [Path With Min Effort 1631](https://leetcode.com/problems/path-with-minimum-effort) | Medium     | Binary search + BFS              |
| [Making a Large Island 827](https://leetcode.com/problems/making-a-large-island)    | Hard       | Union-Find on grid               |
| [Number of Islands II 305](https://leetcode.com/problems/number-of-islands-ii)      | Hard       | Online Union-Find                |
