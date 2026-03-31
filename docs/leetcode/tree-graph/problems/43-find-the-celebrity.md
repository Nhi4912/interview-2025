---
layout: page
title: "Find the Celebrity"
difficulty: Medium
category: Tree-Graph
tags: [Two Pointers, Graph, Interactive]
leetcode_url: "https://leetcode.com/problems/find-the-celebrity"
---

# Find the Celebrity / Tìm Người Nổi Tiếng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Elimination / Graph
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Find the Town Judge](https://leetcode.com/problems/find-the-town-judge) | [Course Schedule](https://leetcode.com/problems/course-schedule)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Trong một bữa tiệc, người nổi tiếng là người MỌI NGƯỜI đều biết nhưng họ không biết ai. Thay vì hỏi từng cặp O(n²), ta dùng kỹ thuật loại bỏ: nếu A biết B thì A không thể là celeb; nếu A không biết B thì B không thể là celeb.

**Pattern Recognition:**

- Signal: "find unique element satisfying ALL/NONE property" + "API calls expensive" → **Elimination pointer**
- Mỗi lần gọi `knows(a, b)` loại 1 ứng viên → chỉ cần n-1 lần tìm candidate
- Key insight: hai bước — (1) tìm candidate O(n), (2) verify O(n)

**Visual — Loại bỏ candidate:**

```
n=4: candidates 0,1,2,3
knows(0,1)=true  → 0 bị loại (celeb không biết ai), candidate=1
knows(1,2)=false → 2 bị loại (celeb phải được mọi người biết), candidate=1
knows(1,3)=true  → 1 bị loại, candidate=3

Verify candidate=3:
  knows(3,0)? NO ✓   knows(0,3)? YES ✓
  knows(3,1)? NO ✓   knows(1,3)? YES ✓
  knows(3,2)? NO ✓   knows(2,3)? YES ✓
→ Celebrity = 3 ✅
```

---

## Problem Description

Trong một bữa tiệc có `n` người (0 đến n-1), có tối đa 1 "celebrity" — người mà TẤT CẢ người khác biết, nhưng celebrity không biết bất kỳ ai. Dùng API `knows(a, b)` trả về true nếu a biết b. Tìm celebrity hoặc trả về -1. ([LeetCode](https://leetcode.com/problems/find-the-celebrity))

**Example 1:** `n=2`, knows = [[1,1],[0,1]] → Output: `1` (người 1 được cả 0 biết, 1 không biết 0)

**Example 2:** `n=2`, knows = [[1,0],[1,1]] → Output: `-1` (không ai thoả mãn)

Constraints: `2 <= n <= 100`, `knows(a,b)` costs O(1), minimize API calls

---

## 📝 Interview Tips

1. **Clarify**: "Có đúng 1 celebrity hay có thể không có?" / Exactly one or possibly none? Always verify candidate
2. **Brute force**: "O(n²) — check mọi cặp" → eliminate O(n) tìm candidate + O(n) verify / Nested loops vs two-pass linear
3. **Key insight**: "Một lần gọi knows(a,b) loại được 1 trong 2 người" / Each API call eliminates one candidate immediately
4. **Verify step**: "Tìm candidate chưa đủ — phải verify đầy đủ" / Finding candidate ≠ done; always run full verification pass
5. **Edge cases**: "n=2, không ai là celebrity, mọi người biết nhau" / n=2 min case, no celebrity exists, all mutual
6. **Follow-up**: "Nếu có nhiều celebrity?" / What if multiple celebrities? → same structure, check each

---

## Solutions

```typescript
// Simulated knows API for testing
function makeKnows(matrix: number[][]): (a: number, b: number) => boolean {
  return (a, b) => matrix[a][b] === 1;
}

/**
 * Solution 1: Brute Force — check every pair
 * Time: O(n²) — n² API calls
 * Space: O(n) — in/out-degree arrays
 */
function findCelebrityBrute(knows: (a: number, b: number) => boolean, n: number): number {
  const inDegree = new Array(n).fill(0);
  const outDegree = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && knows(i, j)) {
        outDegree[i]++;
        inDegree[j]++;
      }
    }
  }
  for (let i = 0; i < n; i++) if (inDegree[i] === n - 1 && outDegree[i] === 0) return i;
  return -1;
}

/**
 * Solution 2: Optimal — Elimination + Verify (2 passes, O(n) calls)
 * Time: O(n) — at most 3n API calls
 * Space: O(1)
 */
function findCelebrity(knows: (a: number, b: number) => boolean, n: number): number {
  // Pass 1: find candidate via elimination
  let candidate = 0;
  for (let i = 1; i < n; i++) {
    // If candidate knows i → candidate can't be celeb, try i
    if (knows(candidate, i)) candidate = i;
    // else i can't be celeb (candidate doesn't know i)
  }

  // Pass 2: verify candidate
  for (let i = 0; i < n; i++) {
    if (i === candidate) continue;
    // Celebrity must: not know anyone, and be known by everyone
    if (knows(candidate, i) || !knows(i, candidate)) return -1;
  }
  return candidate;
}

// === Test Cases ===
const k1 = makeKnows([
  [1, 1],
  [0, 1],
]);
console.log(findCelebrity(k1, 2)); // 1

const k2 = makeKnows([
  [1, 0],
  [1, 1],
]);
console.log(findCelebrity(k2, 2)); // -1

const k3 = makeKnows([
  [1, 0, 1],
  [1, 1, 1],
  [0, 0, 1],
]);
console.log(findCelebrity(k3, 3)); // 2

const k4 = makeKnows([
  [1, 1, 0],
  [0, 1, 0],
  [1, 1, 1],
]);
console.log(findCelebrity(k4, 3)); // 1
```

---

## 🔗 Related Problems

- [Find the Town Judge](https://leetcode.com/problems/find-the-town-judge) — phiên bản dễ hơn, dùng in/out-degree
- [Course Schedule](https://leetcode.com/problems/course-schedule) — graph dependency, topological sort
- [Number of Provinces](https://leetcode.com/problems/number-of-provinces) — graph connectivity với adjacency matrix
- [Who Has the Most Points](https://leetcode.com/problems/find-the-celebrity) — problem page
