---
layout: page
title: "Minimum Reverse Operations"
difficulty: Hard
category: Tree-Graph
tags: [Array, Breadth-First Search, Ordered Set]
leetcode_url: "https://leetcode.com/problems/minimum-reverse-operations"
---

# Minimum Reverse Operations / Đảo Ngược Tối Thiểu

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Rotting Oranges](https://leetcode.com/problems/rotting-oranges) | [Evaluate Division](https://leetcode.com/problems/evaluate-division)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như con tắc kè hoa trên thước kẻ — lật ngược đoạn dài k chứa vị trí hiện tại để nhảy sang ô mới. BFS tìm số bước ít nhất; Union-Find "next unvisited" loại bỏ ô đã thăm trong O(α(n)) thay vì O(n).

**Visual — reachable positions via window reversal:**

```
n=5, k=3, p=0, banned=[]
Positions: 0  1  2  3  4

From pos=0: windows of size 3 containing 0
  [0,1,2]: new_pos = 0+2-0 = 2  → dist[2]=1
  Only [0,1,2] is valid (l must satisfy 0 ≤ l ≤ pos ≤ l+k-1)

Formula: lo = 2*max(0,i-k+1)+k-1-i
         hi = 2*min(n-k,i)+k-1-i
         all j in [lo,hi] with same parity as lo

From 0: lo=2, hi=2  → reach pos 2
From 2: lo=1, hi=3  → reach pos 1,3 (parity=1)
From 1: lo=0, hi=2  (parity=0) → but 0,2 visited
From 3: lo=2, hi=4  → reach pos 4 (2 visited)

dist = [0,-1,1,2,3]
```

---

## Problem Description

You have `n` positions (0 to n−1) with `1` initially at position `p`. Some positions are **banned**. In one move, reverse any subarray of length exactly `k` that contains the current position of `1`. Return `ans[i]` = minimum moves to reach position `i` (−1 if unreachable). ([LeetCode 2612](https://leetcode.com/problems/minimum-reverse-operations))

**Example 1:** n=4, p=0, banned=[1,2], k=4 → [0,−1,−1,1]
**Example 2:** n=5, p=0, banned=[2,4], k=3 → [0,−1,−1,−1,−1]

**Constraints:** 1 ≤ n ≤ 10⁵, 0 ≤ k ≤ n, banned positions ≤ n.

---

## 📝 Interview Tips

1. **Key math**: new_pos = 2l+k−1−i khi lật cửa sổ [l, l+k−1] / Derive formula before coding.
2. **Parity insight**: lo và hi có cùng parity → chỉ cần duyệt một nửa / All reachable in one step share parity.
3. **Bottleneck**: BFS thông thường O(n·k); Union-Find skip O(α(n)) / "Next available" pointer is the key optimization.
4. **Union-Find trick**: parent[i]=i+2 khi đã thăm, find(i) nhảy qua visited / Same-parity path compression.
5. **Edge case**: Nếu p bị banned → không xảy ra per constraints; k=1 → chỉ đứng yên.
6. **Follow-up**: "Khi k thay đổi theo từng bước?" / Each step having different k changes state space significantly.

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force BFS — try all windows at each position
 * Time: O(n·k) — each position dequeued once, up to k transitions each
 * Space: O(n)
 */
function minReverseOperationsBrute(n: number, p: number, banned: number[], k: number): number[] {
  const bannedSet = new Set(banned);
  const dist = new Array(n).fill(-1);
  dist[p] = 0;
  const queue: number[] = [p];
  let head = 0;

  while (head < queue.length) {
    const pos = queue[head++];
    const lMin = Math.max(0, pos - k + 1);
    const lMax = Math.min(n - k, pos);
    for (let l = lMin; l <= lMax; l++) {
      const newPos = 2 * l + k - 1 - pos;
      if (dist[newPos] === -1 && !bannedSet.has(newPos)) {
        dist[newPos] = dist[pos] + 1;
        queue.push(newPos);
      }
    }
  }
  return dist;
}

/**
 * Solution 2: BFS + Union-Find "next unvisited same-parity"
 * Key: from pos i, reachable positions form contiguous range [lo,hi] with fixed parity.
 * Union-Find: parent[i] = i+2 when visited → find() jumps over visited nodes.
 * Time: O(n·α(n)) amortized — each position enqueued/removed exactly once
 * Space: O(n)
 */
function minReverseOperations(n: number, p: number, banned: number[], k: number): number[] {
  const bannedSet = new Set(banned);
  const dist = new Array(n).fill(-1);
  dist[p] = 0;

  // parent[i] = next unvisited position ≥ i with same parity as i
  const parent = Array.from({ length: n + 2 }, (_, i) => i);

  const find = (i: number): number => {
    let root = i;
    while (parent[root] !== root) root = parent[root];
    while (parent[i] !== root) {
      const nx = parent[i];
      parent[i] = root;
      i = nx;
    }
    return root;
  };

  const markVisited = (i: number) => {
    parent[i] = i + 2;
  };

  markVisited(p);
  for (const b of banned) markVisited(b);

  const queue: number[] = [p];
  let head = 0;

  while (head < queue.length) {
    const pos = queue[head++];
    const lMin = Math.max(0, pos - k + 1);
    const lMax = Math.min(n - k, pos);
    const lo = 2 * lMin + k - 1 - pos;
    const hi = 2 * lMax + k - 1 - pos;

    // All positions in [lo, hi] share parity; Union-Find skips visited ones
    for (let j = find(lo); j <= hi; j = find(j)) {
      dist[j] = dist[pos] + 1;
      queue.push(j);
      markVisited(j);
    }
  }

  return dist;
}

// === Test Cases ===
console.log(JSON.stringify(minReverseOperations(4, 0, [1, 2], 4))); // [0,-1,-1,1]
console.log(JSON.stringify(minReverseOperations(5, 0, [2, 4], 3))); // [0,-1,-1,-1,-1]
console.log(JSON.stringify(minReverseOperations(4, 2, [], 2))); // [-1,1,0,1]
console.log(JSON.stringify(minReverseOperations(1, 0, [], 1))); // [0]
```

---

## 🔗 Related Problems

| Problem                                                                                           | Pattern            | Difficulty |
| ------------------------------------------------------------------------------------------------- | ------------------ | ---------- |
| [Open the Lock](https://leetcode.com/problems/open-the-lock)                                      | BFS on states      | Medium     |
| [Rotting Oranges](https://leetcode.com/problems/rotting-oranges)                                  | Multi-source BFS   | Medium     |
| [Jump Game IV](https://leetcode.com/problems/jump-game-iv)                                        | BFS + skip-visited | Hard       |
| [Evaluate Division](https://leetcode.com/problems/evaluate-division)                              | BFS on graph       | Medium     |
| [Minimum Reverse Operations — LeetCode](https://leetcode.com/problems/minimum-reverse-operations) | —                  | Hard       |
