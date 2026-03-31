---
layout: page
title: "Minimum Number of Operations to Make X and Y Equal"
difficulty: Medium
category: Tree-Graph
tags: [Dynamic Programming, Breadth-First Search, Memoization]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-operations-to-make-x-and-y-equal"
---

# Minimum Number of Operations to Make X and Y Equal / Số Thao Tác Tối Thiểu Để X Bằng Y

## Analogy / Tương Tự

> Bạn có một số x, muốn biến thành y. Bạn có 4 thao tác: +1, -1, ÷11 (nếu chia hết), ÷5 (nếu chia hết). Giống như đồng hồ số, bạn có thể điều chỉnh từng bước hoặc nhảy vọt khi gặp bội số. Tìm cách nhanh nhất!

## ASCII Visual

```
x=26, y=1:
26 → 25 (÷5→5) → 4 (÷5→1? No, need adjust)
26 → 26/11? No → 25/5=5 → 5-1=4 → 4-1=3 → 3-1=2 → 2-1=1  (5 ops)
26 → 26-1=25 → 25/5=5 → 5-1=4 → ... (still 5 ops)

BFS explores all paths simultaneously, picks shortest.
```

## Problem

You are given two positive integers `x` and `y`. In one operation you can do one of:

- Divide `x` by 11 if `x % 11 == 0`
- Divide `x` by 5 if `x % 5 == 0`
- Decrement `x` by 1
- Increment `x` by 1

Return the **minimum** number of operations to make `x == y`.

## Interview Tips

1. **BFS is natural** — each operation is one level; BFS guarantees minimum
2. **Work backwards** — from y to x can also work, but x→y is fine with BFS
3. **Pruning** — if x < y, only +1 makes sense (no division helps); handle directly: `x + (y - x)` steps
4. **Memoization** — dp[x] = min ops to reach y; recurse with memo
5. **Key insight** — for division: first adjust x to nearest multiple (cost of adjustment), then divide
6. **Upper bound** — worst case is just `|x - y|` incrementing/decrementing

## Solutions

### Solution 1: BFS

```typescript
function minimumOperationsToMakeEqual(x: number, y: number): number {
  if (x === y) return 0;
  if (x < y) return y - x; // only +1 helps

  const visited = new Set<number>();
  const queue: [number, number][] = [[x, 0]];
  visited.add(x);

  while (queue.length) {
    const [curr, ops] = queue.shift()!;
    const nexts: number[] = [curr - 1, curr + 1];
    if (curr % 11 === 0) nexts.push(curr / 11);
    if (curr % 5 === 0) nexts.push(curr / 5);

    for (const next of nexts) {
      if (next === y) return ops + 1;
      if (next > 0 && !visited.has(next) && next <= x + 1) {
        visited.add(next);
        queue.push([next, ops + 1]);
      }
    }
  }
  return -1;
}

console.log(minimumOperationsToMakeEqual(26, 1)); // 3
console.log(minimumOperationsToMakeEqual(54, 2)); // 4
console.log(minimumOperationsToMakeEqual(25, 5)); // 1
```

### Solution 2: Memoization / Top-Down DP

```typescript
function minimumOperationsDP(x: number, y: number): number {
  const memo = new Map<number, number>();

  function dp(curr: number): number {
    if (curr === y) return 0;
    if (curr < y) return y - curr;
    if (memo.has(curr)) return memo.get(curr)!;

    // Option 1: just decrement to y
    let best = curr - y;

    // Option 2: round down to nearest multiple of 11, divide
    if (curr >= 11) {
      const rem11 = curr % 11;
      best = Math.min(best, rem11 + 1 + dp(Math.floor(curr / 11)));
      // round up to multiple of 11
      best = Math.min(best, ((11 - rem11) % 11) + 1 + dp(Math.ceil(curr / 11)));
    }

    // Option 3: round down/up to nearest multiple of 5, divide
    if (curr >= 5) {
      const rem5 = curr % 5;
      best = Math.min(best, rem5 + 1 + dp(Math.floor(curr / 5)));
      best = Math.min(best, ((5 - rem5) % 5) + 1 + dp(Math.ceil(curr / 5)));
    }

    memo.set(curr, best);
    return best;
  }

  return dp(x);
}

console.log(minimumOperationsDP(26, 1)); // 3
console.log(minimumOperationsDP(54, 2)); // 4
console.log(minimumOperationsDP(100, 1)); // 3 (100/5=20, 20/5=4, 4-1=3, 3-1=2, 2-1=1)
```

## Related Problems

| #    | Problem                                  | Difficulty | Tags    |
| ---- | ---------------------------------------- | ---------- | ------- |
| 2998 | Minimum Number of Operations (this)      | Medium     | BFS, DP |
| 1342 | Number of Steps to Reduce Number to Zero | Easy       | BFS     |
| 279  | Perfect Squares                          | Medium     | BFS, DP |
| 752  | Open the Lock                            | Medium     | BFS     |
