---
layout: page
title: "Water and Jug Problem"
difficulty: Medium
category: Tree-Graph
tags: [Math, Depth-First Search, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/water-and-jug-problem"
---

# Water and Jug Problem / Bài Toán Đong Nước

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Math (Bézout's Identity) / BFS

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI**: Bài toán kinh điển về số học! Định lý Bézout: mọi số đạt được từ các phép cộng/trừ bội số của x và y đều là bội số của `gcd(x, y)`. Vậy ta có thể đong được `z` lít khi và chỉ khi `z` chia hết cho `gcd(x, y)` VÀ `z ≤ x + y`.

**EN**: Bézout's identity: any integer representable as `ax + by` is a multiple of `gcd(x, y)`. So z is achievable iff `z % gcd(x, y) === 0` and `z <= x + y`.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Water and Jug Problem example:**

```
x=3, y=5, z=4:
gcd(3,5) = 1 → z=4 divisible by 1 ✓
z=4 ≤ 3+5=8 ✓  → true

Proof: 3*(-1) + 5*(1) = 2... 3*3 + 5*(-1) = 4 ✓

BFS states: (jug_x, jug_y) current water amounts
Start: (0,0)  Goal: x==z or y==z or x+y==z
```

---

## Problem Description

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Math (Bézout's Identity) / BFS

---

## 📝 Interview Tips

- 🇻🇳 Giải pháp O(1): `z % gcd(x,y) === 0 && z <= x + y` — luôn ưu tiên giải thích toán học.
- 🇬🇧 O(1) math solution: `z % gcd(x,y) === 0 && z <= x + y` — explain Bézout to impress.
- 🇻🇳 BFS giải thích trực quan: mỗi trạng thái là `(lượng nước trong x, lượng nước trong y)`.
- 🇬🇧 BFS for intuition: state is `(water_in_x, water_in_y)`, 6 transitions per state.
- 🇻🇳 6 hành động: đổ đầy x, đổ đầy y, đổ hết x, đổ hết y, rót x→y, rót y→x.
- 🇬🇧 6 operations: fill x, fill y, empty x, empty y, pour x→y, pour y→x.

---

## Solutions

```typescript
// ─── Solution 1: Math — Bézout's Identity O(log(min(x,y))) ───
// Time: O(log(min(x,y)))  Space: O(1)
function canMeasureWater(x: number, y: number, z: number): boolean {
  if (z > x + y) return false;
  if (z === 0) return true;
  if (x === 0) return z === y;
  if (y === 0) return z === x;
  return z % gcd(x, y) === 0;
}

function gcd(a: number, b: number): number {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

// ─── Solution 2: BFS — enumerate all reachable states ───
// Time: O(x*y)  Space: O(x*y)
function canMeasureWaterBFS(x: number, y: number, z: number): boolean {
  if (z > x + y) return false;
  if (z === 0) return true;

  const visited = new Set<number>();
  const encode = (a: number, b: number) => a * (y + 1) + b;
  const queue: [number, number][] = [[0, 0]];
  visited.add(encode(0, 0));

  while (queue.length) {
    const [a, b] = queue.shift()!;
    if (a === z || b === z || a + b === z) return true;

    const next: [number, number][] = [
      [x, b], // fill jug x
      [a, y], // fill jug y
      [0, b], // empty jug x
      [a, 0], // empty jug y
      // pour x → y
      [Math.max(0, a - (y - b)), Math.min(y, a + b)],
      // pour y → x
      [Math.min(x, a + b), Math.max(0, b - (x - a))],
    ];

    for (const [na, nb] of next) {
      const key = encode(na, nb);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push([na, nb]);
      }
    }
  }
  return false;
}

// ─── Solution 3: DFS iterative ───
// Time: O(x*y)  Space: O(x*y)
function canMeasureWaterDFS(x: number, y: number, z: number): boolean {
  if (z > x + y) return false;
  if (z === 0) return true;
  const seen = new Set<number>();
  const encode = (a: number, b: number) => a * (y + 1) + b;
  const stack: [number, number][] = [[0, 0]];
  seen.add(encode(0, 0));
  while (stack.length) {
    const [a, b] = stack.pop()!;
    if (a === z || b === z || a + b === z) return true;
    const moves: [number, number][] = [
      [x, b],
      [a, y],
      [0, b],
      [a, 0],
      [Math.max(0, a - (y - b)), Math.min(y, a + b)],
      [Math.min(x, a + b), Math.max(0, b - (x - a))],
    ];
    for (const [na, nb] of moves) {
      const key = encode(na, nb);
      if (!seen.has(key)) {
        seen.add(key);
        stack.push([na, nb]);
      }
    }
  }
  return false;
}

// Tests
console.log(canMeasureWater(3, 5, 4)); // true
console.log(canMeasureWater(2, 6, 5)); // false
console.log(canMeasureWater(1, 2, 3)); // true
console.log(canMeasureWaterBFS(3, 5, 4)); // true
console.log(canMeasureWaterBFS(2, 6, 5)); // false
```

---

## 🔗 Related Problems

| #    | Title                 | Difficulty | Pattern              |
| ---- | --------------------- | ---------- | -------------------- |
| 365  | Water and Jug Problem | 🟡 Medium  | Math / BFS           |
| 263  | Ugly Number           | 🟢 Easy    | Math                 |
| 1201 | Ugly Number III       | 🟡 Medium  | Math + Binary Search |
| 858  | Mirror Reflection     | 🟡 Medium  | Math / GCD           |
