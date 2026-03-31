---
layout: page
title: "Falling Squares"
difficulty: Hard
category: Array
tags: [Array, Segment Tree, Ordered Set]
leetcode_url: "https://leetcode.com/problems/falling-squares"
---

# Falling Squares / Hình Vuông Rơi

🔴 Hard | 🏷️ Array, Segment Tree, Ordered Set | 🔗 [LeetCode](https://leetcode.com/problems/falling-squares)

## 🧠 Intuition / Trực Giác

**Tiếng Việt:** Mỗi hình vuông rơi xuống và chồng lên hình vuông cao nhất phía dưới vùng của nó. Với mỗi hình vuông mới, tìm chiều cao tối đa trong vùng [left, left+size) từ các hình vuông trước. Hình vuông mới có chiều cao = maxBelow + size.

**English:** Each square falls and lands on the tallest existing square intersecting its range. For square i: find max height in [left, left+size) from previously placed squares, then new height = maxBelow + size. Track global max after each drop.

```
positions = [[1,2],[2,2],[1,2]]

Square 1: [1,3) height=2. Global max=2
         |__|
  0  1  2  3  4

Square 2: [2,4) overlaps [1,3): maxBelow=2, height=4. Gmax=4
             |__|
         |__|
  0  1  2  3  4

Square 3: [1,3) overlaps both: maxBelow=4, height=6. Gmax=6
         |__|
         |__|
         |__|
Answer: [2, 4, 6]
```

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **EN:** Two squares overlap if left1 < right2 AND right1 > left2 | **VI:** Hai hình vuông chồng nhau nếu left1 < right2 VÀ right1 > left2
- 🔑 **EN:** O(n²) brute force is acceptable for n ≤ 1000 | **VI:** O(n²) vũ phu chấp nhận được khi n ≤ 1000
- 🔑 **EN:** For optimal: coordinate compress + lazy segment tree | **VI:** Để tối ưu: nén tọa độ + cây đoạn lười
- 🔑 **EN:** Track intervals with their landed height, not original position | **VI:** Lưu interval với chiều cao đã đặt, không phải vị trí ban đầu
- 🔑 **EN:** Global max must be recorded AFTER each square settles | **VI:** Max toàn cục phải được ghi lại SAU KHI mỗi hình vuông đặt xong
- 🔑 **EN:** right boundary = left + size (exclusive), so [left, left+size) | **VI:** Biên phải = left + size (không bao gồm), tức [left, left+size)

## Solutions

### Solution 1: Brute Force O(n²) — Simple & Clear

```typescript
/**
 * Falling Squares — brute force interval tracking
 * Time: O(n²) — check all previous intervals for each new square
 * Space: O(n) — store placed intervals
 */
function fallingSquares(positions: number[][]): number[] {
  // intervals[i] = [left, right, height] of placed square i
  const intervals: [number, number, number][] = [];
  const result: number[] = [];
  let globalMax = 0;

  for (const [left, size] of positions) {
    const right = left + size;
    let base = 0;

    // Find the max height among all overlapping placed squares
    for (const [l, r, h] of intervals) {
      if (l < right && r > left) {
        // overlap check
        base = Math.max(base, h);
      }
    }

    const newHeight = base + size;
    intervals.push([left, right, newHeight]);
    globalMax = Math.max(globalMax, newHeight);
    result.push(globalMax);
  }

  return result;
}

console.log(
  fallingSquares([
    [1, 2],
    [2, 2],
    [1, 2],
  ]),
); // [2,4,6]
console.log(
  fallingSquares([
    [100, 100],
    [200, 100],
  ]),
); // [100,100]
console.log(
  fallingSquares([
    [1, 5],
    [2, 2],
    [7, 5],
  ]),
); // [5,5,5]
```

### Solution 2: Coordinate Compression + Range Max (O(n² log n))

```typescript
/**
 * Coordinate compressed interval heights
 * Time: O(n² log n) | Space: O(n)
 * Cleaner extension path toward segment tree
 */
function fallingSquares2(positions: number[][]): number[] {
  // Collect all boundary points
  const coords = new Set<number>();
  for (const [l, s] of positions) {
    coords.add(l);
    coords.add(l + s);
  }
  const sorted = [...coords].sort((a, b) => a - b);
  const rank = new Map(sorted.map((v, i) => [v, i]));
  const heights = new Array(sorted.length).fill(0);

  const result: number[] = [];
  let globalMax = 0;

  for (const [left, size] of positions) {
    const right = left + size;
    const li = rank.get(left)!;
    const ri = rank.get(right)!;

    // Query max height in [li, ri)
    let base = 0;
    for (let i = li; i < ri; i++) base = Math.max(base, heights[i]);

    const newH = base + size;
    // Update heights in [li, ri)
    for (let i = li; i < ri; i++) heights[i] = newH;

    globalMax = Math.max(globalMax, newH);
    result.push(globalMax);
  }

  return result;
}

console.log(
  fallingSquares2([
    [1, 2],
    [2, 2],
    [1, 2],
  ]),
); // [2,4,6]
console.log(
  fallingSquares2([
    [100, 100],
    [200, 100],
  ]),
); // [100,100]
```

### Solution 3: Lazy Propagation Segment Tree (O(n log n))

```typescript
/**
 * Segment tree with lazy propagation for O(n log n)
 * Time: O(n log n) | Space: O(n)
 */
function fallingSquares3(positions: number[][]): number[] {
  const coords = [...new Set(positions.flatMap(([l, s]) => [l, l + s]))].sort((a, b) => a - b);
  const rank = new Map(coords.map((v, i) => [v, i]));
  const N = coords.length;
  const tree = new Array(4 * N).fill(0);
  const lazy = new Array(4 * N).fill(0);

  const push = (node: number) => {
    if (lazy[node] > 0) {
      tree[2 * node] = Math.max(tree[2 * node], lazy[node]);
      tree[2 * node + 1] = Math.max(tree[2 * node + 1], lazy[node]);
      lazy[2 * node] = Math.max(lazy[2 * node], lazy[node]);
      lazy[2 * node + 1] = Math.max(lazy[2 * node + 1], lazy[node]);
      lazy[node] = 0;
    }
  };

  const update = (node: number, start: number, end: number, l: number, r: number, val: number) => {
    if (r <= start || end <= l) return;
    if (l <= start && end <= r) {
      tree[node] = Math.max(tree[node], val);
      lazy[node] = Math.max(lazy[node], val);
      return;
    }
    push(node);
    const mid = (start + end) >> 1;
    update(2 * node, start, mid, l, r, val);
    update(2 * node + 1, mid, end, l, r, val);
    tree[node] = Math.max(tree[2 * node], tree[2 * node + 1]);
  };

  const query = (node: number, start: number, end: number, l: number, r: number): number => {
    if (r <= start || end <= l) return 0;
    if (l <= start && end <= r) return tree[node];
    push(node);
    const mid = (start + end) >> 1;
    return Math.max(query(2 * node, start, mid, l, r), query(2 * node + 1, mid, end, l, r));
  };

  const result: number[] = [];
  let gmax = 0;
  for (const [left, size] of positions) {
    const l = rank.get(left)!;
    const r = rank.get(left + size)!;
    const base = query(1, 0, N, l, r);
    const newH = base + size;
    update(1, 0, N, l, r, newH);
    gmax = Math.max(gmax, newH);
    result.push(gmax);
  }
  return result;
}

console.log(
  fallingSquares3([
    [1, 2],
    [2, 2],
    [1, 2],
  ]),
); // [2,4,6]
```

## 🔗 Related Problems

| Problem                                                                   | Difficulty | Pattern      |
| ------------------------------------------------------------------------- | ---------- | ------------ |
| [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem/) | 🔴 Hard    | Segment Tree |
| [Range Module](https://leetcode.com/problems/range-module/)               | 🔴 Hard    | Segment Tree |
| [My Calendar III](https://leetcode.com/problems/my-calendar-iii/)         | 🔴 Hard    | Segment Tree |
