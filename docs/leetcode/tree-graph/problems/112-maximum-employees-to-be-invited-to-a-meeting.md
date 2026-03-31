---
layout: page
title: "Maximum Employees to Be Invited to a Meeting"
difficulty: Hard
category: Tree-Graph
tags: [Depth-First Search, Graph, Topological Sort]
leetcode_url: "https://leetcode.com/problems/maximum-employees-to-be-invited-to-a-meeting"
---

# Maximum Employees to Be Invited to a Meeting / Số Nhân Viên Tối Đa Được Mời Dự Họp

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Topological Sort + Functional Graph
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Course Schedule](https://leetcode.com/problems/course-schedule) | [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng một vòng tròn ngồi họp — mỗi người chỉ muốn ngồi cạnh đúng một người bạn thân. Đây là **functional graph**: mỗi node có đúng 1 cạnh ra, nên luôn có cycle. Có 2 trường hợp: mời trọn 1 vòng lớn (cycle ≥ 3), hoặc ghép nhiều cặp đôi (2-cycle) mỗi cặp kéo thêm "đuôi" dài nhất của chúng.

**Pattern Recognition:**

- Signal: mỗi node có đúng 1 outgoing edge → **Functional Graph + Kahn's Topological Sort**
- Dùng Kahn's để bóc các chain nodes (indegree = 0), tính depth trước khi tìm cycle
- Case 1: cycle ≥ 3 → chỉ mời cycle đó (không thể kéo chain vào)
- Case 2: cycle = 2 → mời cả chain đi vào mỗi đầu + nhiều cặp 2-cycle cộng lại được

**Visual — Functional Graph Cycles:**

```
favorite = [2, 2, 1, 2]  (0→2, 1→2, 2→1, 3→2)

    0           3
     \         /
      2  ←→  1       ← 2-cycle between {1,2}
      (indegree[2]=3)

Phase 1 (Kahn's): remove 0, 3 (indegree=0)
  depth[2] = max(depth[2], depth[0]+1) = 2
  depth[2] = max(2, depth[3]+1) = 2  (still 2)

Phase 2 (cycles): node 1 and 2 still have indegree > 0
  Trace: 1→2→1 → cycle length 2
  sumTwoCycles += depth[1] + depth[2] = 1 + 2 = 3
  Answer = max(bigCycle=0, sumTwoCycles=3) = 3 ✓
```

---

## Problem Description

Given `n` employees (0-indexed) and `favorite[i]` = the employee that employee `i` wants to sit next to at a **round table**. Each must sit directly next to their favorite. Return the **maximum number of employees** that can be invited.

- `2 ≤ n ≤ 10^5`, `0 ≤ favorite[i] ≤ n-1`, `favorite[i] != i`

```
Example 1: favorite=[2,2,1,2] → 3  (seat employees 0,2,1 in chain)
Example 2: favorite=[1,2,0]   → 3  (cycle 0→1→2→0, all 3)
Example 3: favorite=[3,0,1,4,1] → 4  (2-cycle {1,4} + chains {0},{3})
```

---

## 📝 Interview Tips

1. **Nhận dạng functional graph** — Mỗi node có đúng 1 out-edge → luôn có cycle; dùng Kahn's để tách chain / _One out-edge per node → functional graph always has cycles; Kahn's peels chains_
2. **Phân loại 2 cases** — Cycle ≥ 3 và 2-cycle xử lý hoàn toàn khác nhau / _Cycle ≥ 3 vs 2-cycle are fundamentally different — handle separately_
3. **Chain depth** — Trong Kahn's, khi remove node `u` → `depth[favorite[u]] = max(depth[favorite[u]], depth[u]+1)` / _When peeling node u, propagate depth into next node_
4. **2-cycle sum** — Nhiều cặp 2-cycle có thể cộng lại vì ở bàn tròn chúng ngồi thẳng giữa 2 nút / _Multiple 2-cycles stack because they form linear segments in circular seating_
5. **Cycle detection** — Sau Kahn's, nodes với indegree > 0 còn lại đều nằm trong cycle / _After Kahn's, remaining nodes with indegree > 0 are all in cycles_
6. **Complexity** — O(n) time và space — hoàn toàn tuyến tính / _O(n) time and space — fully linear_

---

## Solutions

```typescript
/**
 * Solution 1: Topological Sort (Kahn's) + Cycle Classification
 * Time: O(n) — each node processed once
 * Space: O(n) — indegree, depth, queue arrays
 *
 * Key insight: functional graph → exactly one cycle per component.
 * Case 1: cycle ≥ 3 → take the entire cycle.
 * Case 2: cycle = 2 → take both nodes + their incoming chain lengths.
 *         Multiple 2-cycles can all fit at the same round table.
 */
function maximumInvitations(favorite: number[]): number {
  const n = favorite.length;
  const indegree = new Array(n).fill(0);
  for (let i = 0; i < n; i++) indegree[favorite[i]]++;

  // Phase 1: Kahn's — peel nodes with indegree 0, propagate chain depths
  const depth = new Array(n).fill(1); // depth[i] = max chain into i
  const queue: number[] = [];
  for (let i = 0; i < n; i++) if (indegree[i] === 0) queue.push(i);

  while (queue.length > 0) {
    const node = queue.shift()!;
    const next = favorite[node];
    depth[next] = Math.max(depth[next], depth[node] + 1);
    if (--indegree[next] === 0) queue.push(next);
  }

  // Phase 2: remaining nodes (indegree > 0) are in cycles
  let maxSingleCycle = 0; // best length-≥3 cycle
  let sumTwoCycles = 0; // sum over all 2-cycles (with chains)

  for (let i = 0; i < n; i++) {
    if (indegree[i] === 0) continue;
    // Trace the full cycle from node i
    let cycleLen = 0;
    let cur = i;
    while (indegree[cur] > 0) {
      indegree[cur] = 0; // mark visited
      cycleLen++;
      cur = favorite[cur];
    }
    if (cycleLen === 2) {
      // 2-cycle: extend with deepest chains from each endpoint
      sumTwoCycles += depth[i] + depth[favorite[i]];
    } else {
      maxSingleCycle = Math.max(maxSingleCycle, cycleLen);
    }
  }

  return Math.max(maxSingleCycle, sumTwoCycles);
}

// === Test Cases ===
console.log(maximumInvitations([2, 2, 1, 2])); // 3
console.log(maximumInvitations([1, 2, 0])); // 3 — one 3-cycle
console.log(maximumInvitations([3, 0, 1, 4, 1])); // 4 — two 2-cycles with chains
console.log(maximumInvitations([1, 0, 3, 2])); // 4 — two separate 2-cycles
console.log(maximumInvitations([2, 0, 1, 4, 3])); // 4 — 3-cycle {0,1,2} + 2-cycle {3,4} → max(3,4)=4
```

---

## 🔗 Related Problems

| Problem                                                                                                                          | Pattern                          | Difficulty |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ---------- |
| [Course Schedule](https://leetcode.com/problems/course-schedule)                                                                 | Topological Sort                 | Medium     |
| [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix)                         | Topological Sort / DFS           | Hard       |
| [Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees)                                                       | Topological Sort (leaf trimming) | Medium     |
| [Longest Path With Different Adjacent Characters](https://leetcode.com/problems/longest-path-with-different-adjacent-characters) | DFS on Tree                      | Hard       |
