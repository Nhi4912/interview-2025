---
layout: page
title: "Bus Routes"
difficulty: Hard
category: Tree-Graph
tags: [Array, Hash Table, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/bus-routes"
---

# Bus Routes / Tuyến Xe Buýt

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: BFS on Routes (not stops)
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Open the Lock](https://leetcode.com/problems/open-the-lock) | [Word Ladder](https://leetcode.com/problems/word-ladder)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bạn đi du lịch bằng tàu hỏa — không cần đếm số ga, chỉ cần đếm số lần đổi tàu. Bí quyết: thay vì BFS trên từng trạm, hãy BFS trên từng **tuyến xe** — khi bước lên một tuyến, bạn có thể đến tất cả trạm trên tuyến đó miễn phí mà không tốn thêm lần đổi xe!

**Pattern Recognition:**

- Signal: "min transfers/hops in network" → **BFS level-by-level**
- Sai lầm phổ biến: BFS trên trạm (stops) → TLE vì mỗi edge có cost khác nhau
- Key insight: BFS trên **routes** (tuyến xe) — mỗi bước = 1 lần lên xe, tất cả trạm trong route được khám phá free
- Build: `stop → [routes]` map để từ trạm tìm tất cả tuyến xe đi qua

**Visual — routes=[[1,2,7],[3,6,7]], source=1, target=6:**

```
Stop→Routes map:
  1 → [route 0]
  2 → [route 0]
  7 → [route 0, route 1]
  3 → [route 1]
  6 → [route 1]

BFS (on stops, but route-aware):
Level 1 (1 bus):
  Start at stop 1
  → Board route 0 → reach stops {1,2,7}
  → At stop 7: board route 1 → reach stop 6 = TARGET ✅
  → Answer: 2 buses

Key: visiting a route unlocks ALL its stops at once
```

---

## Problem Description

You are given an array of `routes` where `routes[i]` is a list of stops on bus line `i`. You start at stop `source` and want to reach stop `target`. You can board any bus at any stop it serves. Return the **minimum number of buses** you must take to travel from source to target, or `-1` if impossible.

**Example 1:**

```
Input:  routes=[[1,2,7],[3,6,7]], source=1, target=6
Output: 2
Explanation: Bus 0 (1→7), then Bus 1 (7→6). Takes 2 buses.
```

**Example 2:**

```
Input:  routes=[[7,12],[4,5,15],[6],[15,19],[9,12,13]], source=15, target=12
Output: -1
```

**Constraints:** `1 ≤ routes.length ≤ 500`, `1 ≤ routes[i].length ≤ 10⁵`, `0 ≤ source, target, routes[i][j] ≤ 10⁶`, all stops in `routes[i]` are distinct

---

## 📝 Interview Tips

1. **Clarify**: "Source = target → return 0 ngay" / If source equals target return 0 immediately
2. **Key insight**: "BFS trên routes, không phải stops — mỗi bước = 1 lần đổi xe" / BFS on bus lines, not stops — each level = 1 bus ride
3. **Build map**: "Dùng HashMap: stop → list of route indices để nhanh chóng tìm routes từ stop" / HashMap stop→routes for O(1) route lookup
4. **Visited**: "Cần visited cả stops VÀ routes để tránh loop" / Track both visited stops and visited routes
5. **Edge cases**: "source == target: return 0; source/target không tồn tại trong bất kỳ route nào: return -1" / Same stop or unreachable
6. **Follow-up**: "Nếu có chi phí đi từng trạm → Dijkstra thay BFS" / Add per-stop costs → use Dijkstra instead

---

## Solutions

```typescript
/**
 * Solution 1: BFS on Stops (Naive — may TLE on large inputs)
 * Time: O(Σ|route_i|²) — for each stop, scan all routes; for each route scan all stops
 * Space: O(Σ|route_i|) — adjacency structure
 */
function numBusesToDestinationNaive(routes: number[][], source: number, target: number): number {
  if (source === target) return 0;
  // Build stop→stops adjacency (all stops reachable via same route)
  const adj = new Map<number, Set<number>>();
  for (const route of routes) {
    for (const s of route) {
      if (!adj.has(s)) adj.set(s, new Set());
      for (const t of route) if (t !== s) adj.get(s)!.add(t);
    }
  }
  const visited = new Set([source]);
  const queue: number[] = [source];
  let buses = 0;
  while (queue.length) {
    buses++;
    const sz = queue.length;
    for (let i = 0; i < sz; i++) {
      const stop = queue.shift()!;
      for (const next of adj.get(stop) ?? []) {
        if (next === target) return buses;
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
  }
  return -1;
}

/**
 * Solution 2: BFS on Routes (Optimal)
 * Time: O(Σ|route_i|) — each stop and route visited at most once
 * Space: O(Σ|route_i|) — stop→routes map
 *
 * Algorithm:
 * 1. Build stopToRoutes map
 * 2. BFS: start from source stop, explore routes → unlock all stops on each route
 * 3. Each BFS level = 1 additional bus taken
 */
function numBusesToDestination(routes: number[][], source: number, target: number): number {
  if (source === target) return 0;

  // Build stop → route indices map
  const stopToRoutes = new Map<number, number[]>();
  for (let i = 0; i < routes.length; i++) {
    for (const stop of routes[i]) {
      if (!stopToRoutes.has(stop)) stopToRoutes.set(stop, []);
      stopToRoutes.get(stop)!.push(i);
    }
  }

  const visitedStops = new Set<number>([source]);
  const visitedRoutes = new Set<number>();
  let queue: number[] = [source];
  let buses = 0;

  while (queue.length > 0) {
    buses++;
    const nextStops: number[] = [];

    for (const stop of queue) {
      for (const routeIdx of stopToRoutes.get(stop) ?? []) {
        if (visitedRoutes.has(routeIdx)) continue;
        visitedRoutes.add(routeIdx);

        for (const nextStop of routes[routeIdx]) {
          if (nextStop === target) return buses;
          if (!visitedStops.has(nextStop)) {
            visitedStops.add(nextStop);
            nextStops.push(nextStop);
          }
        }
      }
    }
    queue = nextStops;
  }
  return -1;
}

// === Test Cases ===
console.log(
  numBusesToDestination(
    [
      [1, 2, 7],
      [3, 6, 7],
    ],
    1,
    6,
  ),
); // 2
console.log(numBusesToDestination([[7, 12], [4, 5, 15], [6], [15, 19], [9, 12, 13]], 15, 12)); // -1
console.log(numBusesToDestination([[1, 2]], 1, 2)); // 1
console.log(numBusesToDestination([[1]], 1, 1)); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                                                      | Pattern                  | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ---------- |
| [Open the Lock](https://leetcode.com/problems/open-the-lock)                                                                 | BFS State Space          | Medium     |
| [Word Ladder](https://leetcode.com/problems/word-ladder)                                                                     | BFS on Transformed Graph | Hard       |
| [Minimum Number of Vertices to Reach All Nodes](https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes) | Graph                    | Medium     |
| [Employee Importance](https://leetcode.com/problems/employee-importance)                                                     | BFS / DFS                | Medium     |
| [Accounts Merge](https://leetcode.com/problems/accounts-merge)                                                               | Union Find               | Medium     |
