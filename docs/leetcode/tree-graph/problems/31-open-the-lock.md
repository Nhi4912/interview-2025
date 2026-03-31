---
layout: page
title: "Open the Lock"
difficulty: Medium
category: Tree-Graph
tags: [Array, Hash Table, String, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/open-the-lock"
---

# Open the Lock / Mở Khóa

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS (Unweighted Shortest Path)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như bạn đang chơi trò chơi Rubik mini — bạn có một ổ khóa 4 số, mỗi bước chỉ được xoay một bánh số lên hoặc xuống 1. Mục tiêu là mở khóa với ít bước nhất, nhưng có những tổ hợp "chết" không được bước vào. BFS đảm bảo bạn tìm được đường ngắn nhất vì nó khám phá từng "tầng xa" một cách đều đặn.

**Pattern Recognition:**

- Signal: "minimum moves/steps" + "unweighted state space" → **BFS**
- Mỗi trạng thái ổ khóa = 1 node; mỗi lần xoay = 1 edge có độ dài 1
- Key insight: Treat lock combinations as graph nodes; BFS from "0000" guarantees minimum turns

**Visual — BFS on lock state space:**

```
Start: "0000"  deadends: {"0201","0101","0102","1212","2002"}  target: "0202"

Level 0: {"0000"}
Level 1: {"1000","9000","0100","0900","0010","0090","0001","0009"}
Level 2: (expand each, skip deadends & visited)
         ...eventually reach "0202" at some level

Each state has exactly 8 neighbors (4 wheels × 2 directions):
  "0000" → "1000","9000","0100","0900","0010","0090","0001","0009"
  (wrap: 0-1 = 9, 9+1 = 0)

Answer = BFS level when target is first dequeued = 6
```

---

## Problem Description

You have a lock with 4 circular wheels, each displaying digits 0-9. The wheels start at `"0000"`. You are given a list of `deadends` — combinations that will lock the lock permanently. Given a `target` combination, return the **minimum number of turns** to reach it, or `-1` if impossible.

**Example 1:**

- Input: `deadends = ["0201","0101","0102","1212","2002"]`, `target = "0202"` → Output: `6`

**Example 2:**

- Input: `deadends = ["8888"]`, `target = "0009"` → Output: `1`

**Constraints:**

- `1 <= deadends.length <= 500`
- `deadends[i].length == 4`, `target.length == 4`
- `target` will not be in `deadends`

---

## 📝 Interview Tips

1. **Clarify**: "Nếu '0000' nằm trong deadends thì sao?" / What if "0000" is in deadends — return -1 immediately
2. **Brute force**: "DFS với backtracking — nhưng có thể vô hạn loop" / DFS with backtracking, but risks infinite loops without visited tracking
3. **BFS**: "BFS đảm bảo shortest path; dùng Set để đánh dấu visited và deadends" / BFS guarantees shortest; use Set for O(1) lookups
4. **Optimize**: "Bidirectional BFS giảm search space từ O(10^4) xuống O(2×10^2)" / Bidirectional BFS cuts search space significantly
5. **Edge cases**: "target = '0000', deadends chứa '0000', không có đường đến target" / target equals start, start is dead, no path exists
6. **Complexity**: "O(10^4 × 8) = O(80000) states — fully feasible" / Total states is 10^4, each with 8 neighbors

---

## Solutions

```typescript
/**
 * Solution 1: BFS — Single Direction
 * Time: O(D² × A^N + D) where A=10 digits, N=4 wheels → O(10^4)
 * Space: O(A^N) = O(10000) for visited set
 */
function openTheLock(deadends: string[], target: string): number {
  const dead = new Set(deadends);
  const start = "0000";
  if (dead.has(start)) return -1;
  if (start === target) return 0;

  const visited = new Set<string>([start]);
  const queue: string[] = [start];
  let turns = 0;

  while (queue.length > 0) {
    turns++;
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const curr = queue.shift()!;
      // Try all 8 neighbors: 4 wheels × 2 directions
      for (let w = 0; w < 4; w++) {
        for (const delta of [1, -1]) {
          const digit = (parseInt(curr[w]) + delta + 10) % 10;
          const next = curr.slice(0, w) + digit + curr.slice(w + 1);
          if (next === target) return turns;
          if (!visited.has(next) && !dead.has(next)) {
            visited.add(next);
            queue.push(next);
          }
        }
      }
    }
  }
  return -1;
}

/**
 * Solution 2: Bidirectional BFS (faster in practice)
 * Time: O(A^(N/2)) per side — dramatically reduces explored nodes
 * Space: O(A^N) worst case for visited sets
 *
 * Idea: Expand from both "0000" and target simultaneously;
 * stop when the two frontiers meet.
 */
function openTheLockBidir(deadends: string[], target: string): number {
  const dead = new Set(deadends);
  const start = "0000";
  if (dead.has(start)) return -1;
  if (start === target) return 0;

  let front = new Set<string>([start]);
  let back = new Set<string>([target]);
  const visitedFront = new Set<string>([start]);
  const visitedBack = new Set<string>([target]);
  let turns = 0;

  function neighbors(state: string): string[] {
    const res: string[] = [];
    for (let w = 0; w < 4; w++) {
      for (const d of [1, -1]) {
        const digit = (parseInt(state[w]) + d + 10) % 10;
        res.push(state.slice(0, w) + digit + state.slice(w + 1));
      }
    }
    return res;
  }

  while (front.size > 0 && back.size > 0) {
    turns++;
    // Always expand the smaller frontier
    if (front.size > back.size)
      [front, back, visitedFront, visitedBack] = [back, front, visitedBack, visitedFront];

    const nextFront = new Set<string>();
    for (const curr of front) {
      for (const nb of neighbors(curr)) {
        if (back.has(nb)) return turns;
        if (!visitedFront.has(nb) && !dead.has(nb)) {
          visitedFront.add(nb);
          nextFront.add(nb);
        }
      }
    }
    front = nextFront;
  }
  return -1;
}

// === Test Cases ===
console.log(openTheLock(["0201", "0101", "0102", "1212", "2002"], "0202")); // 6
console.log(openTheLock(["8888"], "0009")); // 1
console.log(openTheLock(["0000"], "8888")); // -1
console.log(openTheLockBidir(["0201", "0101", "0102", "1212", "2002"], "0202")); // 6
```

---

## 🔗 Related Problems

| Problem                                                                            | Pattern             | Difficulty |
| ---------------------------------------------------------------------------------- | ------------------- | ---------- |
| [Word Ladder](https://leetcode.com/problems/word-ladder)                           | BFS on strings      | Hard       |
| [Minimum Genetic Mutation](https://leetcode.com/problems/minimum-genetic-mutation) | BFS on states       | Medium     |
| [Sliding Puzzle](https://leetcode.com/problems/sliding-puzzle)                     | BFS on board states | Hard       |
| [Jump Game IV](https://leetcode.com/problems/jump-game-iv)                         | BFS shortest path   | Hard       |
| [Accounts Merge](https://leetcode.com/problems/accounts-merge)                     | Union Find / BFS    | Medium     |
