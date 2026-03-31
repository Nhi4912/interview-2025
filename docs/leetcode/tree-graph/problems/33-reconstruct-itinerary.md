---
layout: page
title: "Reconstruct Itinerary"
difficulty: Hard
category: Tree-Graph
tags: [Depth-First Search, Graph, Eulerian Circuit]
leetcode_url: "https://leetcode.com/problems/reconstruct-itinerary"
---

# Reconstruct Itinerary / Xây Dựng Lại Hành Trình

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Hierholzer's Algorithm (Eulerian Path)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như bạn phải dùng hết tất cả vé máy bay đã mua — mỗi vé chỉ dùng một lần, và bạn muốn hành trình xếp thứ tự từ điển nhỏ nhất. Nếu bạn đi vào một ngõ cụt, đừng bỏ nút đó — hãy thêm nó vào **đầu** kết quả (post-order insert), vì đó là điểm kết thúc của sub-path.

**Pattern Recognition:**

- Signal: "use every edge exactly once" + "find valid ordering" → **Eulerian Path (Hierholzer)**
- Sort neighbors lexicographically so smallest airport is always tried first
- Key insight: Post-order DFS — nodes added in reverse; destinations added when backtracking

**Visual — Hierholzer's DFS:**

```
tickets: [["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]

Adjacency (sorted): JFK→[ATL,SFO]  ATL→[JFK,SFO]  SFO→[ATL]

DFS from JFK:
  JFK → ATL → JFK → SFO → ATL → SFO → (no more neighbors)
                                         push SFO
                         ← backtrack, push ATL
              ← backtrack, push SFO
         ← backtrack, push JFK  ← wait, JFK has ATL left...

  Stack trace (push when no next neighbor):
    Visit JFK→ATL→JFK→SFO→ATL→SFO  push SFO
                          ATL done  push ATL
               SFO done             push SFO
          JFK done                  push JFK
    ATL still has SFO... wait, sorted order matters

Result built in reverse by stack: ["JFK","ATL","JFK","SFO","ATL","SFO"] ✓
```

---

## Problem Description

Given a list of airline `tickets` as `[from, to]` pairs, reconstruct the itinerary in order. All tickets must be used. The itinerary must begin with `"JFK"`. If there are multiple valid itineraries, return the one with the **smallest lexicographic order**.

**Example 1:**

- Input: `tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]` → Output: `["JFK","MUC","LHR","SFO","SJC"]`

**Example 2:**

- Input: `tickets = [["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]` → Output: `["JFK","ATL","JFK","SFO","ATL","SFO"]`

**Constraints:**

- `1 <= tickets.length <= 300`
- `tickets[i].length == 2`, each airport code is 3 uppercase English letters

---

## 📝 Interview Tips

1. **Clarify**: "Có đảm bảo luôn tồn tại valid itinerary không?" / Is a valid Eulerian path always guaranteed?
2. **Naive**: "Backtracking DFS — thử tất cả permutations O(E!) trong worst case" / Backtracking O(E!) is too slow
3. **Hierholzer**: "Post-order DFS — khi không còn neighbor, push vào stack; reverse là kết quả" / Post-order: push when stuck, reverse result
4. **Sort**: "Sort neighbors trước để đảm bảo lexicographic smallest khi DFS chọn đường" / Sort adjacency lists upfront for lexicographic guarantee
5. **Edge cases**: "Chỉ có 1 ticket, tất cả đi từ JFK, đồ thị không liên thông" / Single ticket, all from JFK, disconnected cases
6. **Complexity**: "O(E log E) cho sort; O(E) cho DFS — tổng O(E log E)" / O(E log E) for sort + O(E) DFS traversal

---

## Solutions

```typescript
/**
 * Solution 1: Backtracking DFS (brute force)
 * Time: O(E! / duplicates) — explores all orderings
 * Space: O(E) recursion stack
 * Only feasible for very small inputs
 */
function findItineraryBrute(tickets: string[][]): string[] {
  const adj: Map<string, string[]> = new Map();
  for (const [from, to] of tickets) {
    if (!adj.has(from)) adj.set(from, []);
    adj.get(from)!.push(to);
  }
  for (const [, dests] of adj) dests.sort();

  const result: string[] = [];
  const used = new Array(tickets.length).fill(false);

  function backtrack(curr: string): boolean {
    if (result.length === tickets.length + 1) return true;
    const dests = adj.get(curr) ?? [];
    for (let i = 0; i < dests.length; i++) {
      // find original ticket index (simplified)
      if (!used[i]) {
        used[i] = true;
        result.push(dests[i]);
        if (backtrack(dests[i])) return true;
        result.pop();
        used[i] = false;
      }
    }
    return false;
  }
  result.push("JFK");
  backtrack("JFK");
  return result;
}

/**
 * Solution 2: Hierholzer's Algorithm (iterative post-order DFS)
 * Time: O(E log E) — sorting adjacency lists
 * Space: O(E) for adjacency lists and result stack
 *
 * Key: when a node has no more outgoing edges, append it to result.
 * Reversing at end gives correct Eulerian path order.
 */
function findItinerary(tickets: string[][]): string[] {
  // Build adjacency list sorted in reverse (so pop() gives smallest)
  const adj: Map<string, string[]> = new Map();
  for (const [from, to] of tickets) {
    if (!adj.has(from)) adj.set(from, []);
    adj.get(from)!.push(to);
  }
  for (const [, dests] of adj) dests.sort((a, b) => b.localeCompare(a)); // reverse sort

  const result: string[] = [];
  const stack: string[] = ["JFK"];

  while (stack.length > 0) {
    const curr = stack[stack.length - 1];
    const dests = adj.get(curr);
    if (dests && dests.length > 0) {
      // Pick lexicographically smallest (last in reverse-sorted array)
      stack.push(dests.pop()!);
    } else {
      // No more destinations — this node goes into result
      result.push(stack.pop()!);
    }
  }

  return result.reverse();
}

// === Test Cases ===
console.log(
  findItinerary([
    ["MUC", "LHR"],
    ["JFK", "MUC"],
    ["SFO", "SJC"],
    ["LHR", "SFO"],
  ]),
);
// ["JFK","MUC","LHR","SFO","SJC"]

console.log(
  findItinerary([
    ["JFK", "SFO"],
    ["JFK", "ATL"],
    ["SFO", "ATL"],
    ["ATL", "JFK"],
    ["ATL", "SFO"],
  ]),
);
// ["JFK","ATL","JFK","SFO","ATL","SFO"]

console.log(
  findItinerary([
    ["JFK", "KUL"],
    ["JFK", "NRT"],
    ["NRT", "JFK"],
  ]),
);
// ["JFK","NRT","JFK","KUL"]
```

---

## 🔗 Related Problems

| Problem                                                                                          | Pattern              | Difficulty |
| ------------------------------------------------------------------------------------------------ | -------------------- | ---------- |
| [Valid Arrangement of Pairs](https://leetcode.com/problems/valid-arrangement-of-pairs)           | Eulerian Path        | Hard       |
| [Course Schedule II](https://leetcode.com/problems/course-schedule-ii)                           | Topological Sort DFS | Medium     |
| [Cracking the Safe](https://leetcode.com/problems/cracking-the-safe)                             | Eulerian Circuit     | Hard       |
| [All Paths From Source to Target](https://leetcode.com/problems/all-paths-from-source-to-target) | DFS                  | Medium     |
| [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops) | Graph Shortest Path  | Medium     |
