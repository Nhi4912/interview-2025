---
layout: page
title: "Find the Town Judge"
difficulty: Easy
category: Tree-Graph
tags: [Array, Hash Table, Graph]
leetcode_url: "https://leetcode.com/problems/find-the-town-judge"
---

# Find the Town Judge / Tìm Quan Toà Thị Trấn

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Graph (In/Out Degree)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Quan toà được mọi người tin tưởng (n-1 người tin tưởng anh ta) nhưng anh ta không tin tưởng ai cả. Trong đồ thị có hướng, đây là node có **in-degree = n-1** và **out-degree = 0**. Chỉ cần đếm: mỗi lần `a trusts b` thì `out[a]++` và `in[b]++`.

**Pattern Recognition:**

- "Someone trusted by everyone, trusts nobody" → in-degree n-1, out-degree 0
- Single-pass count with two arrays (or one net-degree array)
- `netDegree[i] = in[i] - out[i]` → judge has net-degree = n-1

**Visual:**

```
n=4, trust=[[1,3],[1,4],[2,3],[2,4],[4,3]]

  1 → 3 (1 trusts 3)
  1 → 4 (1 trusts 4)
  2 → 3 (2 trusts 3)
  2 → 4 (2 trusts 4)
  4 → 3 (4 trusts 3)

in-degree:  [_, 0, 0, 3, 2]
out-degree: [_, 2, 2, 0, 1]
net-degree: [_, -2, -2, 3, 1]

Node 3: net = 3 = n-1 = 3 ✅ → Judge is 3
```

## Problem Description

In a town of `n` people (labeled 1 to n), the town judge (if exists): (1) trusts nobody, (2) is trusted by everyone else. Given `trust[i] = [ai, bi]` meaning "ai trusts bi", find the judge or return -1.

**Example 1:** `n=2, trust=[[1,2]]` → `2`
**Example 2:** `n=3, trust=[[1,3],[2,3]]` → `3`
**Example 3:** `n=3, trust=[[1,3],[2,3],[3,1]]` → `-1`

**Constraints:** `1 <= n <= 1000`, `0 <= trust.length <= 10^4`, no duplicate trust pairs, `ai != bi`.

## 📝 Interview Tips

1. **Clarify**: Chỉ có tối đa 1 quan toà? (Có, nhiều nhất 1) / At most one judge exists per problem definition.
2. **Approach**: Dùng net-degree `in - out` — quan toà có net = n-1 / Use net-degree = in-degree minus out-degree.
3. **Edge cases**: n=1, trust=[] → người đó là quan toà (in=0=n-1=0) / n=1 with no trust → that person is the judge.
4. **Optimize**: Một mảng net-degree là đủ, O(E) time, O(V) space / Single array O(E+V) is optimal.
5. **Test**: Không ai tin tưởng nhau → -1; tất cả tin A nhưng A cũng tin 1 người → -1 / All trust A but A trusts someone → not a judge.
6. **Follow-up**: Nếu có nhiều "judge candidates"? Hoặc cần judge tin tưởng ít nhất k người? / What if judge can trust up to k people?

## Solutions

```typescript
/** Solution 1: Net Degree Array (Optimal)
 * Time: O(E) | Space: O(V)
 * net[i] = in-degree[i] - out-degree[i]; judge has net = n-1
 */
function findJudge(n: number, trust: number[][]): number {
  const net = new Array(n + 1).fill(0); // 1-indexed
  for (const [a, b] of trust) {
    net[a]--; // a trusts someone → out-degree
    net[b]++; // b is trusted → in-degree
  }
  for (let i = 1; i <= n; i++) {
    if (net[i] === n - 1) return i;
  }
  return -1;
}

/** Solution 2: Separate in/out degree arrays
 * Time: O(E) | Space: O(V)
 */
function findJudge2(n: number, trust: number[][]): number {
  const inDeg = new Array(n + 1).fill(0);
  const outDeg = new Array(n + 1).fill(0);
  for (const [a, b] of trust) {
    outDeg[a]++;
    inDeg[b]++;
  }
  for (let i = 1; i <= n; i++) {
    if (inDeg[i] === n - 1 && outDeg[i] === 0) return i;
  }
  return -1;
}

/** Solution 3: HashSet approach (brute force, clearer logic)
 * Time: O(E + V) | Space: O(V)
 */
function findJudge3(n: number, trust: number[][]): number {
  const trusts = new Set<number>(); // people who trust someone
  const trustedBy = new Map<number, number>(); // person → how many trust them

  for (const [a, b] of trust) {
    trusts.add(a);
    trustedBy.set(b, (trustedBy.get(b) ?? 0) + 1);
  }

  for (let i = 1; i <= n; i++) {
    if (!trusts.has(i) && (trustedBy.get(i) ?? 0) === n - 1) return i;
  }
  return -1;
}

// Test cases
console.log(findJudge(2, [[1, 2]])); // 2
console.log(
  findJudge(3, [
    [1, 3],
    [2, 3],
  ]),
); // 3
console.log(
  findJudge(3, [
    [1, 3],
    [2, 3],
    [3, 1],
  ]),
); // -1
console.log(findJudge(1, [])); // 1

console.log(
  findJudge2(3, [
    [1, 3],
    [2, 3],
  ]),
); // 3
console.log(
  findJudge3(3, [
    [1, 3],
    [2, 3],
  ]),
); // 3
```

## 🔗 Related Problems

| Problem                                                                | Relationship                                          |
| ---------------------------------------------------------------------- | ----------------------------------------------------- |
| [Find the Celebrity](https://leetcode.com/problems/find-the-celebrity) | Same concept: celebrity = trusted by all, trusts none |
| [Course Schedule](https://leetcode.com/problems/course-schedule)       | In-degree / topo sort on directed graph               |
| [Destination City](https://leetcode.com/problems/destination-city)     | Out-degree=0 node detection                           |
