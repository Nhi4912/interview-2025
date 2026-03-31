---
layout: page
title: "Keys and Rooms"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Graph]
leetcode_url: "https://leetcode.com/problems/keys-and-rooms"
---

# Keys and Rooms / Chìa Khóa và Phòng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS/BFS Graph Traversal
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Course Schedule](https://leetcode.com/problems/course-schedule) | [Evaluate Division](https://leetcode.com/problems/evaluate-division)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như trò chơi phiêu lưu — bạn bắt đầu ở phòng 0 (không khóa). Mỗi phòng chứa các chìa khóa mở phòng khác. Hỏi: bạn có thể vào được tất cả các phòng không? Đây là bài toán kiểm tra tính liên thông của đồ thị có hướng.

**Pattern Recognition:**

- Signal: "can visit all nodes" + "start from node 0" → **DFS/BFS reachability**
- Khởi đầu từ room 0, dùng DFS/BFS theo các chìa khóa tìm được
- Cuối cùng kiểm tra `visited.size === n`

**Visual:**

```
rooms = [[1],[2],[3],[]]
Room 0: keys=[1]  →  Room 1: keys=[2]  →  Room 2: keys=[3]  →  Room 3: keys=[]
  Start here          Unlocked by 1        Unlocked by 2        Unlocked by 3
visited: {0,1,2,3} == 4 rooms → true ✓

rooms = [[1,3],[3,0,1],[2],[0]]
Start: room 0, get key 1 and 3
DFS: room 1 → room 3 → room 0 (visited)
Never reach room 2 → false ✗
```

---

## Problem Description

There are `n` rooms labeled `0` to `n-1`. All rooms are locked except room 0. Each room `i` contains a list of keys `rooms[i]` that unlock other rooms. Return `true` if you can visit all rooms, otherwise return `false`.

**Example 1:** `rooms = [[1],[2],[3],[]]` → `true` (0→1→2→3)
**Example 2:** `rooms = [[1,3],[3,0,1],[2],[0]]` → `false` (room 2 unreachable)

Constraints: `2 <= n <= 1000`, `0 <= rooms[i].length <= 1000`, all values in `rooms[i]` are unique.

---

## 📝 Interview Tips

1. **Clarify**: "Room 0 luôn mở? Chìa khóa có thể trùng không?" / Room 0 always unlocked; keys may be duplicated
2. **Model**: "Bài này là graph reachability — phòng là node, chìa là directed edge" / Rooms = nodes, keys = directed edges
3. **DFS vs BFS**: "Cả hai đều O(N+K) — DFS ngắn hơn với recursion" / Both work; DFS simpler to write
4. **Edge cases**: "n=1 → chỉ có room 0, trả về true luôn" / Single room: trivially true
5. **Visited**: "Dùng Set hoặc boolean array, không dùng lại key đã thăm" / Track visited to avoid infinite loops
6. **Follow-up**: "Tìm số phòng tối thiểu cần thêm chìa để vào hết?" / Count unreachable rooms and find minimum keys to add

---

## Solutions

```typescript
/**
 * Solution 1: DFS with recursion
 * Time: O(N + K) — N rooms, K total keys
 * Space: O(N) — visited set + recursion stack
 */
function canVisitAllRoomsDFS(rooms: number[][]): boolean {
  const visited = new Set<number>();

  function dfs(room: number): void {
    if (visited.has(room)) return;
    visited.add(room);
    for (const key of rooms[room]) dfs(key);
  }

  dfs(0);
  return visited.size === rooms.length;
}

/**
 * Solution 2: BFS (iterative — safer for large inputs, no stack overflow)
 * Time: O(N + K) — N rooms, K total keys
 * Space: O(N) — visited set + queue
 */
function canVisitAllRooms(rooms: number[][]): boolean {
  const n = rooms.length;
  const visited = new Set<number>([0]);
  const queue = [0];

  while (queue.length > 0) {
    const room = queue.shift()!;
    for (const key of rooms[room]) {
      if (!visited.has(key)) {
        visited.add(key);
        queue.push(key);
      }
    }
  }
  return visited.size === n;
}

// === Test Cases ===
console.log(canVisitAllRooms([[1], [2], [3], []])); // true
console.log(canVisitAllRooms([[1, 3], [3, 0, 1], [2], [0]])); // false
console.log(canVisitAllRooms([[]])); // true (only room 0, always accessible)
console.log(canVisitAllRooms([[1], []])); // true
```

---

## 🔗 Related Problems

| Problem                                                                                          | Pattern             | Difficulty |
| ------------------------------------------------------------------------------------------------ | ------------------- | ---------- |
| [Course Schedule](https://leetcode.com/problems/course-schedule)                                 | Topological Sort    | 🟡 Medium  |
| [Number of Provinces](https://leetcode.com/problems/number-of-provinces)                         | DFS components      | 🟡 Medium  |
| [Clone Graph](https://leetcode.com/problems/clone-graph)                                         | BFS graph traversal | 🟡 Medium  |
| [Evaluate Division](https://leetcode.com/problems/evaluate-division)                             | BFS weighted graph  | 🟡 Medium  |
| [All Paths From Source to Target](https://leetcode.com/problems/all-paths-from-source-to-target) | DFS all paths       | 🟡 Medium  |
