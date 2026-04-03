---
layout: page
title: "Frog Jump"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/frog-jump"
---

# Frog Jump / Ếch Nhảy Qua Sông

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: DP with HashMap
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Jump Game III](https://leetcode.com/problems/jump-game-iii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như ếch nhảy qua sông trên các hòn đá — mỗi đá nhớ tập hợp "bước nhảy" có thể tới được. Từ bước k, bước tiếp có thể là k-1, k, hoặc k+1.

**Pattern Recognition:**

- Signal: "reach last stone" + "jump size varies by ±1" → **DP with HashMap of reachable jumps**
- `map[stone]` = set of jump sizes that can reach this stone
- Key insight: Với mỗi stone, propagate {k-1, k, k+1} sang stones tiếp theo

**Visual — stones=[0,1,3,5,6,8,12,17]:**

```
stone 0:  reachable with jumps = {0}  (start)
stone 1:  from 0 jump 1 → jumps={1}
stone 3:  from 1 jump 2 → jumps={2}
stone 5:  from 3 jump 2 → can try 1,2,3 → land on 3+2=5 ✓ jumps={2}
stone 6:  from 5 jump 1 → jumps={1}; from 3 try jump 3 → 3+3=6 ✓ jumps={1,3}
stone 8:  from 6 try 1,2,3: 6+2=8✓ from jump1→{2}; 6+3=9?no; from jump3→{2,4}
stone 12: from 8 jump 4 → 8+4=12 ✓
stone 17: from 12 try 3,4,5 → 12+5=17 ✓  REACHED!
```

---

## Problem Description

A frog starts at stone 0 (position 0) and wants to reach the last stone. At stone with jump size `k`, the frog can jump to position `+k-1`, `+k`, or `+k+1`. The first jump must be exactly 1. Return true if the frog can reach the last stone. ([LeetCode 403](https://leetcode.com/problems/frog-jump))

- Example 1: `[0,1,3,5,6,8,12,17]` → `true`
- Example 2: `[0,1,2,3,4,8,9,11]` → `false`

Constraints: `2 ≤ stones.length ≤ 2000`, `0 ≤ stones[i] ≤ 2^31 - 1`

---

## 📝 Interview Tips

1. **Clarify**: "Bước nhảy đầu tiên phải là 1 — stones[1] phải là 1" / First jump must be exactly 1
2. **Brute force**: "BFS/DFS thử mọi jump size — exponential states" / Too slow without memoization
3. **State**: "Map mỗi stone position → Set các jump sizes có thể tới" / HashMap stone → Set<jumpSize>
4. **Transition**: "Từ stone s với jump k, thêm k-1,k,k+1 vào map[s+k-1], map[s+k], map[s+k+1] nếu là stone" / Propagate forward
5. **Pruning**: "k=0 không hợp lệ — bỏ qua" / Skip jump size 0
6. **Complexity**: "O(n²) time — mỗi stone có thể có O(n) jump sizes" / Each stone's set bounded by index

---

## Solutions

```typescript
/**
 * Solution 1: BFS + HashSet (conceptually clear)
 * Time: O(n²)
 * Space: O(n²)
 */
function canCrossBFS(stones: number[]): boolean {
  const stoneSet = new Set(stones);
  const last = stones[stones.length - 1];
  // State: (position, jumpSize)
  const visited = new Set<string>();
  const queue: [number, number][] = [[0, 0]];

  while (queue.length > 0) {
    const [pos, k] = queue.shift()!;
    for (const next of [k - 1, k, k + 1]) {
      if (next <= 0) continue;
      const nextPos = pos + next;
      if (nextPos === last) return true;
      const key = `${nextPos},${next}`;
      if (stoneSet.has(nextPos) && !visited.has(key)) {
        visited.add(key);
        queue.push([nextPos, next]);
      }
    }
  }
  return false;
}

/**
 * Solution 2: DP with HashMap — map[stone] = Set of reachable jump sizes
 * Time: O(n²)
 * Space: O(n²)
 */
function canCross(stones: number[]): boolean {
  const map = new Map<number, Set<number>>();
  for (const s of stones) map.set(s, new Set());
  map.get(0)!.add(0); // start at stone 0 with jump=0 (first jump must be 1)

  for (const stone of stones) {
    for (const k of map.get(stone)!) {
      for (const next of [k - 1, k, k + 1]) {
        if (next <= 0) continue; // can't jump 0 or negative
        const target = stone + next;
        if (map.has(target)) {
          map.get(target)!.add(next);
        }
      }
    }
  }

  return map.get(stones[stones.length - 1])!.size > 0;
}

// === Test Cases ===
console.log(canCross([0, 1, 3, 5, 6, 8, 12, 17])); // true
console.log(canCross([0, 1, 2, 3, 4, 8, 9, 11])); // false
console.log(canCross([0, 1])); // true
console.log(canCross([0, 2])); // false (first jump must be 1)
```

---

## 🔗 Related Problems

- [Jump Game](https://leetcode.com/problems/jump-game) — reachability với fixed jump range
- [Jump Game II](https://leetcode.com/problems/jump-game-ii) — min jumps greedy/DP
- [Jump Game III](https://leetcode.com/problems/jump-game-iii) — jump với index offsets
- [Jump Game VII](https://leetcode.com/problems/jump-game-vii) — sliding window reachability
- [Minimum Number of Visited Cells in a Grid](https://leetcode.com/problems/minimum-number-of-visited-cells-in-a-grid) — 2D variant
