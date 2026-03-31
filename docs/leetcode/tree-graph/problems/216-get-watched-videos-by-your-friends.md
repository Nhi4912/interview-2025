---
layout: page
title: "Get Watched Videos by Your Friends"
difficulty: Medium
category: Tree-Graph
tags: [Array, Hash Table, Breadth-First Search, Graph, Sorting]
leetcode_url: "https://leetcode.com/problems/get-watched-videos-by-your-friends"
---

# Get Watched Videos by Your Friends / Lấy Video Được Xem Bởi Bạn Bè Của Bạn

## Analogy / Tương Tự

> Mạng xã hội: bạn là người số `id`. Bạn muốn biết người ở **cách bạn đúng k bậc kết nối** đã xem video gì. Đếm tần số video, sắp xếp theo tần số tăng dần, cùng tần số thì theo thứ tự chữ cái.

## ASCII Visual

```
Friends graph:        k=2 from id=0:
0 — 1 — 3            Level 0: {0}
|   |                Level 1: {1, 2}  (friends of 0)
2 — 4                Level 2: {3, 4}  (friends of 1,2 not yet visited)

Videos watched by friends at level 2:
  Person 3: ["A","B"]
  Person 4: ["B","C"]
Count: A=1, B=2, C=1 → sort: A(1), C(1), B(2)
```

## Problem

Given `watchedVideos` (each person's watched videos), `friends` graph, `id` (your node), and `k`. Return all videos watched by people exactly `k` levels away from `id`, sorted by watch frequency ascending, then alphabetically.

## Interview Tips

1. **BFS for exactly k levels** — don't go further or return earlier
2. **Visited set** — prevent revisiting nodes (including `id` itself)
3. **Collect level-k nodes** — only after BFS completes k expansions
4. **Frequency map** — count video occurrences across all level-k people
5. **Custom sort** — primary: frequency ascending; secondary: alphabetical
6. **Edge case** — if k=0, return person `id`'s own videos sorted

## Solutions

### Solution 1: BFS Level-by-Level

```typescript
function watchedVideosByFriends(
  watchedVideos: string[][],
  friends: number[][],
  id: number,
  k: number,
): string[] {
  const visited = new Set<number>([id]);
  let currentLevel: number[] = [id];

  // BFS exactly k steps
  for (let step = 0; step < k; step++) {
    const nextLevel: number[] = [];
    for (const person of currentLevel) {
      for (const friend of friends[person]) {
        if (!visited.has(friend)) {
          visited.add(friend);
          nextLevel.push(friend);
        }
      }
    }
    currentLevel = nextLevel;
    if (currentLevel.length === 0) break;
  }

  // Count video frequencies among people at distance k
  const freq = new Map<string, number>();
  for (const person of currentLevel) {
    for (const video of watchedVideos[person]) {
      freq.set(video, (freq.get(video) ?? 0) + 1);
    }
  }

  // Sort: ascending frequency, then alphabetical
  return [...freq.keys()].sort((a, b) => {
    const diff = freq.get(a)! - freq.get(b)!;
    return diff !== 0 ? diff : a.localeCompare(b);
  });
}

// Tests
const watched = [["A", "B"], ["C"], ["B", "C"], ["D"]];
const friends = [
  [1, 2],
  [0, 3],
  [0, 3],
  [1, 2],
];
console.log(watchedVideosByFriends(watched, friends, 0, 1)); // ["B","C"]
console.log(watchedVideosByFriends(watched, friends, 0, 2)); // ["D"]
```

### Solution 2: BFS with Queue and Distance Map

```typescript
function watchedVideosByFriendsV2(
  watchedVideos: string[][],
  friends: number[][],
  id: number,
  k: number,
): string[] {
  const dist = new Map<number, number>([[id, 0]]);
  const queue: number[] = [id];
  const levelK: number[] = [];

  while (queue.length) {
    const person = queue.shift()!;
    const d = dist.get(person)!;
    if (d === k) {
      levelK.push(person);
      continue;
    }
    if (d > k) continue;

    for (const friend of friends[person]) {
      if (!dist.has(friend)) {
        dist.set(friend, d + 1);
        queue.push(friend);
      }
    }
  }

  const freq = new Map<string, number>();
  for (const person of levelK) {
    for (const video of watchedVideos[person]) {
      freq.set(video, (freq.get(video) ?? 0) + 1);
    }
  }

  return [...freq.entries()]
    .sort(([a, fa], [b, fb]) => (fa !== fb ? fa - fb : a.localeCompare(b)))
    .map(([v]) => v);
}

console.log(watchedVideosByFriendsV2(watched, friends, 0, 1)); // ["B","C"]
console.log(
  watchedVideosByFriendsV2(
    [
      ["A", "B"],
      ["C", "D"],
      ["B", "C"],
    ],
    [[1, 2], [0], [0]],
    0,
    1,
  ),
); // ["B","C","D"] (sorted by freq then alpha)
```

## Related Problems

| #    | Problem                               | Difficulty | Tags       |
| ---- | ------------------------------------- | ---------- | ---------- |
| 1311 | Get Watched Videos (this)             | Medium     | BFS, Graph |
| 1129 | Shortest Path with Alternating Colors | Medium     | BFS        |
| 994  | Rotting Oranges                       | Medium     | BFS        |
| 863  | All Nodes Distance K in Binary Tree   | Medium     | BFS, Tree  |
