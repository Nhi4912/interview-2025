---
layout: page
title: "Maximum Total Importance of Roads"
difficulty: Medium
category: Tree-Graph
tags: [Greedy, Graph, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/maximum-total-importance-of-roads"
---

# Maximum Total Importance of Roads / Tổng Tầm Quan Trọng Tối Đa Của Các Con Đường

---

## 🧠 Intuition / Tư Duy

**Analogy:** > Bạn đặt giá trị 1..n cho n thành phố. Tầm quan trọng của một con đường = tổng giá trị 2 đầu. Để tối đa tổng tầm quan trọng, hãy gán giá trị **cao nhất cho thành phố có nhiều con đường nhất** (degree cao nhất).

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximum Total Importance of Roads example:**

```
n=5, roads: 0-1, 1-2, 2-3, 0-2, 1-3, 2-4
Degrees: 0→2, 1→3, 2→4, 3→2, 4→1
Sorted by degree: 2(4), 1(3), 0(2), 3(2), 4(1)
Assign values:    2→5,  1→4,  0→3,  3→2,  4→1

Importance = 3+4 + 4+5 + 5+2 + 3+5 + 4+2 + 5+1 = 43
```

---

## Problem Description

Given `n` cities and `roads` array of `[a, b]` pairs. Assign each city a **unique** value from 1 to n. The importance of a road `[a, b]` = value[a] + value[b]. Maximize the **total importance** of all roads.

---

## 📝 Interview Tips

1. **Greedy insight** — city with degree `d` contributes its value `d` times to the total
2. **Sort by degree** — assign highest values to highest-degree nodes
3. **Total formula** — sum over all nodes: `value[node] × degree[node]`
4. **No need to track assignment** — just multiply sorted values × sorted degrees
5. **Time complexity** — O(n log n) for sort + O(E) for degree counting
6. **Why greedy works** — maximizing `Σ value[i] × degree[i]` = rearrangement inequality (pair largest with largest)

---

## Solutions

```typescript
function maximumImportance(n: number, roads: number[][]): number {
  const degree = new Array(n).fill(0);
  for (const [a, b] of roads) {
    degree[a]++;
    degree[b]++;
  }

  // Sort degrees ascending; assign values 1, 2, ..., n in order
  degree.sort((a, b) => a - b);

  let total = 0;
  for (let i = 0; i < n; i++) {
    total += (i + 1) * degree[i]; // value = i+1, degree = degree[i]
  }
  return total;
}

console.log(
  maximumImportance(5, [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 2],
    [1, 3],
    [2, 4],
  ]),
); // 43
console.log(
  maximumImportance(5, [
    [0, 3],
    [2, 4],
    [1, 3],
  ]),
); // 20

function maximumImportanceVerbose(n: number, roads: number[][]): number {
  // Count connections per city
  const degree = new Array(n).fill(0);
  for (const [a, b] of roads) {
    degree[a]++;
    degree[b]++;
  }

  // Create list of (city, degree) pairs, sort by degree desc
  const ranked = degree.map((d, i) => ({ city: i, degree: d })).sort((a, b) => b.degree - a.degree);

  // Assign values n down to 1 (highest value to highest degree)
  const value = new Array(n);
  for (let i = 0; i < n; i++) {
    value[ranked[i].city] = n - i; // n, n-1, ..., 1
  }

  // Calculate total importance
  let total = 0;
  for (const [a, b] of roads) {
    total += value[a] + value[b];
  }
  return total;
}

console.log(
  maximumImportanceVerbose(5, [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 2],
    [1, 3],
    [2, 4],
  ]),
); // 43

function maximumImportanceCompact(n: number, roads: number[][]): number {
  const deg = new Array(n).fill(0);
  roads.forEach(([a, b]) => {
    deg[a]++;
    deg[b]++;
  });
  return deg.sort((a, b) => a - b).reduce((sum, d, i) => sum + d * (i + 1), 0);
}

console.log(
  maximumImportanceCompact(5, [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 2],
    [1, 3],
    [2, 4],
  ]),
); // 43
console.log(
  maximumImportanceCompact(5, [
    [0, 3],
    [2, 4],
    [1, 3],
  ]),
); // 20
```

---

## 🔗 Related Problems

| #    | Problem                                 | Difficulty | Tags          |
| ---- | --------------------------------------- | ---------- | ------------- |
| 2285 | Maximum Total Importance (this)         | Medium     | Greedy, Graph |
| 1615 | Maximal Network Rank                    | Medium     | Graph         |
| 1557 | Minimum Number of Vertices              | Medium     | Graph         |
| 1976 | Number of Ways to Arrive at Destination | Medium     | Graph, DP     |
