---
layout: page
title: "Jump Game III"
difficulty: Medium
category: Tree-Graph
tags: [Array, Depth-First Search, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/jump-game-iii"
---

# Jump Game III / Trò Chơi Nhảy III

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Hãy tưởng tượng bạn đứng ở giữa hàng ghế trong rạp phim. Từ vị trí `i`, bạn chỉ có thể nhảy sang `i + arr[i]` hoặc `i - arr[i]`. Bạn cần tìm xem có thể đến được ghế có giá trị 0 hay không — đây là bài toán "reachability" kinh điển dùng BFS/DFS.

**Pattern Recognition:**

- "Can we reach a target?" on an unweighted graph → BFS or DFS
- State = current index, transitions = `i ± arr[i]`
- Mark visited to avoid infinite loops (cycles)

**Visual:**

```
arr = [4, 2, 3, 0, 3, 1, 2], start = 5

Index:  0  1  2  3  4  5  6
Value:  4  2  3  0  3  1  2

From 5: jump to 5+1=6 or 5-1=4
From 6: jump to 6+2=8(OOB) or 6-2=4
From 4: jump to 4+3=7(OOB) or 4-3=1
From 1: jump to 1+2=3 or 1-2=-1(OOB)
From 3: arr[3]=0 ✅ FOUND!
```

## Problem Description

Given an array `arr` of non-negative integers and a start index, you can jump from index `i` to `i + arr[i]` or `i - arr[i]`. Return `true` if you can reach any index with value `0`, otherwise `false`. Out-of-bounds jumps are invalid.

**Example 1:** `arr = [4,2,3,0,3,1,2], start = 5` → `true`
**Example 2:** `arr = [4,2,3,0,3,1,2], start = 0` → `true`
**Example 3:** `arr = [3,0,2,1,2], start = 2` → `false`

**Constraints:** `1 <= arr.length <= 5*10^4`, `0 <= arr[i] < arr.length`, `0 <= start < arr.length`

## 📝 Interview Tips

1. **Clarify**: Có thể quay lại vị trí đã thăm không? (Có, nhưng cần visited set để tránh vòng lặp) / Can we revisit? Yes, but track visited.
2. **Approach**: BFS cho shortest path, DFS cũng đủ vì chỉ cần reachability / BFS or DFS both work for simple reachability.
3. **Edge cases**: `arr[start] == 0` → true ngay lập tức; không thể thoát vòng lặp / If start is already 0, return true immediately.
4. **Optimize**: Đánh dấu visited bằng cách set `arr[i] = -1` (in-place) để tiết kiệm space / Mark visited in-place by negating.
5. **Test**: Thử graph có cycle — ví dụ `[1,1,1]` / Test cyclic graphs.
6. **Follow-up**: Nếu cần biết số bước ít nhất? → BFS với level tracking / Min steps? Use BFS with level count.

## Solutions

```typescript
/** Solution 1: BFS — level-order reachability
 * Time: O(n) | Space: O(n)
 */
function canReach(arr: number[], start: number): boolean {
  const n = arr.length;
  const visited = new Set<number>();
  const queue: number[] = [start];
  visited.add(start);

  while (queue.length > 0) {
    const i = queue.shift()!;
    if (arr[i] === 0) return true;
    for (const next of [i + arr[i], i - arr[i]]) {
      if (next >= 0 && next < n && !visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return false;
}

/** Solution 2: DFS recursive
 * Time: O(n) | Space: O(n)
 */
function canReachDFS(arr: number[], start: number): boolean {
  const n = arr.length;
  const visited = new Set<number>();

  function dfs(i: number): boolean {
    if (i < 0 || i >= n || visited.has(i)) return false;
    if (arr[i] === 0) return true;
    visited.add(i);
    return dfs(i + arr[i]) || dfs(i - arr[i]);
  }

  return dfs(start);
}

/** Solution 3: DFS in-place (O(1) extra space, mutates input)
 * Time: O(n) | Space: O(n) stack, O(1) extra
 */
function canReachInPlace(arr: number[], start: number): boolean {
  if (start < 0 || start >= arr.length || arr[start] < 0) return false;
  if (arr[start] === 0) return true;
  arr[start] = -arr[start]; // mark visited
  return (
    canReachInPlace(arr, start + Math.abs(arr[start])) ||
    canReachInPlace(arr, start - Math.abs(arr[start]))
  );
}

// Test cases
console.log(canReach([4, 2, 3, 0, 3, 1, 2], 5)); // true
console.log(canReach([4, 2, 3, 0, 3, 1, 2], 0)); // true
console.log(canReach([3, 0, 2, 1, 2], 2)); // false

console.log(canReachDFS([4, 2, 3, 0, 3, 1, 2], 5)); // true
console.log(canReachDFS([3, 0, 2, 1, 2], 2)); // false
```

## 🔗 Related Problems

| Problem                                                    | Relationship                     |
| ---------------------------------------------------------- | -------------------------------- |
| [Jump Game](https://leetcode.com/problems/jump-game)       | Same family, greedy reachability |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii) | Min jumps to end, BFS/greedy     |
| [Jump Game IV](https://leetcode.com/problems/jump-game-iv) | BFS with same-value jumps        |
