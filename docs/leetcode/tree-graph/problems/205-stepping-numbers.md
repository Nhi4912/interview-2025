---
layout: page
title: "Stepping Numbers"
difficulty: Medium
category: Tree-Graph
tags: [Math, Backtracking, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/stepping-numbers"
---

## 1215. Stepping Numbers

### Số Bậc Thang | 🟡 Medium

---

## 🧠 Intuition

> **Vietnamese analogy:** Số bậc thang là số mà các chữ số cạnh nhau chênh lệch đúng 1 — như đi lên hoặc xuống từng bậc một. BFS/DFS từ các chữ số 1-9 để xây dựng tất cả số bậc thang trong khoảng.

```
Stepping numbers: 0,1,2,...,9,10,12,21,23,32,...,98

BFS from seed digit d:
  d=1: 1 → 10, 12 → 101, 121, 123, 210, 212 → ...
  d=2: 2 → 21, 23 → ...

Filter by [low, high] range.
```

---

## 📋 Problem Description

A **stepping number** is an integer where every two adjacent digits differ by exactly 1. Given two integers `low` and `high`, return all stepping numbers in `[low, high]` in **sorted** order.

**Example:**

- Input: `low = 0`, `high = 21`
- Output: `[0,1,2,3,4,5,6,7,8,9,10,12,21]`

**Constraints:** `0 <= low <= high <= 2 * 10^9`

---

## 📝 Interview Tips

- 🔑 **BFS:** seed with digits 0–9, extend by appending digit ± 1 to the last digit
- 🔑 Stop extending when number exceeds `high`
- 🔑 Treat `0` as a special case (only the single digit 0, no leading zeros from extension)
- ⚠️ From digit 0, only append 1 (can't append -1); from digit 9, only append 8
- ⚠️ Numbers with leading zeros (like 01) are invalid — skip extending 0
- 💡 BFS produces numbers in sorted order by digit count, so sort result at end

---

## 💡 Solutions

### Solution 1: BFS

```typescript
function countSteppingNumbers(low: number, high: number): number[] {
  const result: number[] = [];
  if (low === 0) result.push(0);

  const queue: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let qi = 0;

  while (qi < queue.length) {
    const num = queue[qi++];
    if (num > high) continue;
    if (num >= low) result.push(num);

    const lastDigit = num % 10;
    const next1 = num * 10 + (lastDigit - 1);
    const next2 = num * 10 + (lastDigit + 1);

    if (lastDigit > 0 && next1 <= high) queue.push(next1);
    if (lastDigit < 9 && next2 <= high) queue.push(next2);
  }

  return result.sort((a, b) => a - b);
}
```

### Solution 2: DFS / Backtracking

```typescript
function countSteppingNumbersDFS(low: number, high: number): number[] {
  const result: number[] = [];
  if (low === 0) result.push(0);

  function dfs(num: number): void {
    if (num > high) return;
    if (num >= low) result.push(num);

    const lastDigit = num % 10;
    if (lastDigit > 0) dfs(num * 10 + lastDigit - 1);
    if (lastDigit < 9) dfs(num * 10 + lastDigit + 1);
  }

  for (let d = 1; d <= 9; d++) dfs(d);

  return result.sort((a, b) => a - b);
}
```

### Solution 3: BFS with Level-by-Level Processing

```typescript
function countSteppingNumbersLevel(low: number, high: number): number[] {
  const result: number[] = [];
  if (low === 0) result.push(0);

  let queue: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  while (queue.length > 0) {
    const next: number[] = [];
    for (const num of queue) {
      if (num > high) continue;
      if (num >= low) result.push(num);

      const last = num % 10;
      const bigger = num * 10 + last + 1;
      const smaller = num * 10 + last - 1;

      if (last < 9 && bigger <= high) next.push(bigger);
      if (last > 0 && smaller <= high) next.push(smaller);
    }
    queue = next;
  }

  return result.sort((a, b) => a - b);
}
```

---

## 🔗 Related Problems

| #    | Problem                                   | Difficulty | Tags         |
| ---- | ----------------------------------------- | ---------- | ------------ |
| 200  | Number of Islands                         | 🟡 Medium  | BFS, DFS     |
| 90   | Subsets II                                | 🟡 Medium  | Backtracking |
| 967  | Numbers With Same Consecutive Differences | 🟡 Medium  | BFS, DFS     |
| 1539 | Kth Missing Positive Number               | 🟢 Easy    | Math         |
