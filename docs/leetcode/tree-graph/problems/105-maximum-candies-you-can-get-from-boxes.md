---
layout: page
title: "Maximum Candies You Can Get from Boxes"
difficulty: Hard
category: Tree-Graph
tags: [Array, Breadth-First Search, Graph]
leetcode_url: "https://leetcode.com/problems/maximum-candies-you-can-get-from-boxes"
---

# Maximum Candies You Can Get from Boxes / Lấy Tối Đa Kẹo Từ Các Hộp

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Giống mở rương kho báu — mỗi rương có thể chứa chìa khóa cho rương khác và cũng chứa các rương khác bên trong. Bạn chỉ mở được rương khi bạn có chìa khóa VÀ đang nắm giữ nó. BFS xử lý trường hợp "mở hộp A → nhận chìa khóa B → mở hộp B" theo thứ tự tự nhiên.

**Pattern Recognition:**

- "Open box → get keys + boxes" → BFS where new items feed back into queue
- Two conditions to open: `status[box]=1` (open) AND you possess it
- Pending sets: boxes we have but no key, keys we have but no box

**Visual:**

```
status=[1,0,1,0], candies=[7,5,4,100], keys=[[],[],[1],[]], containsBoxes=[[1,2],[3],[],[]]
initialBoxes=[0]

Have box 0, status=1 → open:
  candies += 7, get boxes [1,2], no keys
  Queue: check box1 (no key→pending), check box2 (status=1→open!)
Open box 2: candies += 4, get key[1], no new boxes
  Now have key1 → box1 is in pending → open box1!
Open box 1: candies += 5, get box[3], no keys
  Box 3: no key → pending
Total: 7+4+5 = 16 ✅
```

## Problem Description

You have `n` boxes. Each box `i` has: `status[i]` (1=open, 0=locked), `candies[i]`, `keys[i]` (unlocks other boxes), `containsBoxes[i]` (boxes inside). Starting with `initialBoxes`, collect max candies by opening all reachable boxes. A locked box can be opened once you find its key.

**Example 1:** `status=[1,0,1,0], candies=[7,5,4,100], keys=[[],[],[1],[]], containsBoxes=[[1,2],[3],[],[]], initialBoxes=[0]` → `16`
**Example 2:** `status=[1,0,0,0,0,0], candies=[1,1,1,1,1,1], keys=[[1,2,3,4,5],[],[],[],[],[]], containsBoxes=[[1,2,3,4,5],[],[],[],[],[]], initialBoxes=[0]` → `6`

**Constraints:** `1 <= n <= 1000`, all arrays have valid indices.

## 📝 Interview Tips

1. **Clarify**: Hộp trong hộp là nested boxes. Chìa khóa mở hộp khác (không phải hộp hiện tại) / Boxes inside boxes are independent from keys.
2. **Approach**: BFS với 2 "pending" sets: hộp đang có nhưng chưa có chìa, và chìa khóa đang có nhưng chưa có hộp / BFS with pending-boxes and pending-keys sets.
3. **Edge cases**: Hộp có status=1 không cần chìa. Hộp status=0 cần chìa dù đang trong tay / Open boxes need no key, locked ones do.
4. **Optimize**: HashSet cho `hasKey` và `hasBox` để check O(1) / Use sets for O(1) key/box lookup.
5. **Test**: Hộp chứa chính nó → vòng lặp (đã visited) / Circular containment handled by visited set.
6. **Follow-up**: Nếu mỗi chìa khóa có thể dùng nhiều lần? (không thay đổi logic) / Keys are already reusable in this problem.

## Solutions

```typescript
/** Solution 1: BFS with pending sets
 * Time: O(n + total keys + total boxes) | Space: O(n)
 */
function maxCandies(
  status: number[],
  candies: number[],
  keys: number[][],
  containsBoxes: number[][],
  initialBoxes: number[],
): number {
  const hasKey = new Set<number>();
  const hasBox = new Set<number>();
  const opened = new Set<number>();
  let total = 0;
  const queue: number[] = [];

  // Initialize with open initial boxes
  for (const box of initialBoxes) {
    hasBox.add(box);
    if (status[box] === 1) {
      queue.push(box);
      opened.add(box);
    }
  }

  while (queue.length > 0) {
    const box = queue.shift()!;
    total += candies[box];

    // Collect keys from this box
    for (const key of keys[box]) {
      hasKey.add(key);
      // If we have the box but couldn't open → open now
      if (hasBox.has(key) && !opened.has(key)) {
        opened.add(key);
        queue.push(key);
      }
    }

    // Collect boxes inside this box
    for (const innerBox of containsBoxes[box]) {
      hasBox.add(innerBox);
      // Open if we have key or it's already open
      if (!opened.has(innerBox) && (status[innerBox] === 1 || hasKey.has(innerBox))) {
        opened.add(innerBox);
        queue.push(innerBox);
      }
    }
  }

  return total;
}

/** Solution 2: DFS iterative with explicit stack
 * Time: O(n) | Space: O(n)
 */
function maxCandiesStack(
  status: number[],
  candies: number[],
  keys: number[][],
  containsBoxes: number[][],
  initialBoxes: number[],
): number {
  const ownedKeys = new Set<number>(initialBoxes.filter((b) => status[b] === 1));
  // Treat status=1 boxes as if we have their keys
  for (const b of initialBoxes) if (status[b] === 1) ownedKeys.add(b);

  const pendingBoxes = new Set<number>();
  const processable: number[] = [];
  let total = 0;

  function tryOpen(box: number): void {
    if (status[box] === 1 || ownedKeys.has(box)) {
      processable.push(box);
    } else {
      pendingBoxes.add(box);
    }
  }

  for (const b of initialBoxes) tryOpen(b);

  const visited = new Set<number>();
  while (processable.length > 0) {
    const box = processable.pop()!;
    if (visited.has(box)) continue;
    visited.add(box);
    total += candies[box];
    for (const key of keys[box]) {
      ownedKeys.add(key);
      if (pendingBoxes.has(key)) {
        pendingBoxes.delete(key);
        processable.push(key);
      }
    }
    for (const inner of containsBoxes[box]) {
      tryOpen(inner);
    }
  }
  return total;
}

// Test cases
console.log(
  maxCandies([1, 0, 1, 0], [7, 5, 4, 100], [[], [], [1], []], [[1, 2], [3], [], []], [0]),
); // 16

console.log(
  maxCandies(
    [1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1],
    [[1, 2, 3, 4, 5], [], [], [], [], []],
    [[1, 2, 3, 4, 5], [], [], [], [], []],
    [0],
  ),
); // 6

console.log(
  maxCandiesStack([1, 0, 1, 0], [7, 5, 4, 100], [[], [], [1], []], [[1, 2], [3], [], []], [0]),
); // 16
```

## 🔗 Related Problems

| Problem                                                                | Relationship                              |
| ---------------------------------------------------------------------- | ----------------------------------------- |
| [Keys and Rooms](https://leetcode.com/problems/keys-and-rooms)         | BFS/DFS với keys mở rooms — cùng paradigm |
| [Open the Lock](https://leetcode.com/problems/open-the-lock)           | BFS state exploration                     |
| [Surrounded Regions](https://leetcode.com/problems/surrounded-regions) | BFS flood-fill reachability               |
