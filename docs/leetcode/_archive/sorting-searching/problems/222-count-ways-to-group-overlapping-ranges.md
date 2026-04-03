---
layout: page
title: "Count Ways to Group Overlapping Ranges"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Sorting]
leetcode_url: "https://leetcode.com/problems/count-ways-to-group-overlapping-ranges"
---

# Count Ways to Group Overlapping Ranges / Đếm Cách Nhóm Phạm Vi Chồng Lấp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) | [4Sum](https://leetcode.com/problems/4sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy nghĩ về những đoạn đường xe buýt — xe nào có lộ trình chồng lên nhau phải cùng một chuyến (cùng nhóm). Sau khi sắp xếp theo điểm bắt đầu, ta quét và gộp các đoạn chồng nhau thành một component liên thông.

**Pattern Recognition:**

- Signal: "overlapping ranges" + "group together" → sort + merge intervals → đếm components
- Key insight: số cách chia thành 2 nhóm = 2^(số connected components) mod 10^9+7

**Visual — Count Ways to Group Overlapping Ranges example:**

```
ranges = [[6,10],[5,15],[1,2],[3,10],[10,20]]

Sort by start: [[1,2],[3,10],[5,15],[6,10],[10,20]]

Merge scan (track maxEnd):
  [1,2]   → maxEnd=2  (new component, count=1)
  [3,10]  → 3>2 → new component! count=2, maxEnd=10
  [5,15]  → 5<=10 → same component, maxEnd=15
  [6,10]  → 6<=15 → same component, maxEnd=15
  [10,20] → 10<=15 → same component, maxEnd=20

Components = 2
Answer = 2^2 = 4
```

---

## Problem Description

You are given a 2D integer array `ranges` where `ranges[i] = [starti, endi]`. You need to split these ranges into **two** (possibly empty) groups such that overlapping ranges are in the **same** group. Two ranges overlap if they share at least one integer. Return the number of ways to split, modulo `10^9 + 7`.

Difficulty: Medium | Acceptance: 38.1%

```
Example 1:
  Input:  ranges = [[6,10],[5,15],[1,2],[3,10],[10,20]]
  Output: 4

Example 2:
  Input:  ranges = [[1,3],[10,20],[2,5],[4,8]]
  Output: 4
```

Constraints:

- `1 <= ranges.length <= 10^5`
- `0 <= starti <= endi <= 10^9`

---

## 📝 Interview Tips

1. **Clarify**: "Hai đoạn chia sẻ ít nhất 1 số nguyên là chồng nhau?" / Confirm overlap means sharing at least one integer (touching endpoints count).
2. **Sort insight**: "Sắp xếp theo start, rồi đếm số connected components" / Sort by start, merge intervals, count disjoint groups.
3. **Formula**: "Mỗi component có thể đi vào nhóm A hoặc nhóm B → 2^C cách" / Each component independently goes to group 1 or 2 → 2^C.
4. **Modulo**: "10^9+7 là số nguyên tố → dùng modular exponentiation" / MOD = 10^9+7; use fast power for 2^C mod MOD.
5. **Edge cases**: "Chỉ 1 range → 2 cách; tất cả chồng nhau → 2 cách" / One range → 2; all overlapping → 2.
6. **Follow-up**: "Chia thành k nhóm? Câu trả lời là k^C" / For k groups, answer is k^C mod MOD.

---

## Solutions

```typescript
const MOD = 1_000_000_007n;

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = 1n;
  base %= mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    exp >>= 1n;
  }
  return result;
}

/**
 * Solution 1: Sort + Merge Interval Component Count
 * Time: O(n log n) — sorting dominates
 * Space: O(1) — constant extra space after sort
 */
function countWays(ranges: number[][]): number {
  // Sort by start
  ranges.sort((a, b) => a[0] - b[0]);

  let components = 0;
  let maxEnd = -1;

  for (const [start, end] of ranges) {
    if (start > maxEnd) {
      // New disjoint component
      components++;
    }
    maxEnd = Math.max(maxEnd, end);
  }

  // Each component can go into group 1 or group 2: 2^components ways
  return Number(modPow(2n, BigInt(components), MOD));
}

/**
 * Solution 2: Union-Find (explicit component counting)
 * Time: O(n log n + n α(n)) — sort + union-find
 * Space: O(n) — parent array
 */
function countWaysUF(ranges: number[][]): number {
  const n = ranges.length;
  ranges.sort((a, b) => a[0] - b[0]);

  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const union = (x: number, y: number) => {
    parent[find(x)] = find(y);
  };

  let maxEnd = ranges[0][1];
  for (let i = 1; i < n; i++) {
    if (ranges[i][0] <= maxEnd) {
      union(i, i - 1);
    }
    maxEnd = Math.max(maxEnd, ranges[i][1]);
  }

  const roots = new Set(Array.from({ length: n }, (_, i) => find(i)));
  const components = roots.size;
  return Number(modPow(2n, BigInt(components), MOD));
}

// === Test Cases ===
console.log(
  countWays([
    [6, 10],
    [5, 15],
    [1, 2],
    [3, 10],
    [10, 20],
  ]),
); // 4
console.log(
  countWays([
    [1, 3],
    [10, 20],
    [2, 5],
    [4, 8],
  ]),
); // 4
console.log(countWays([[1, 5]])); // 2
console.log(
  countWaysUF([
    [6, 10],
    [5, 15],
    [1, 2],
    [3, 10],
    [10, 20],
  ]),
); // 4
```

---

## 🔗 Related Problems

- [Merge Intervals](https://leetcode.com/problems/merge-intervals) — same merge-interval technique
- [Number of Islands](https://leetcode.com/problems/number-of-islands) — count connected components
- [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling) — interval DP
- [4Sum](https://leetcode.com/problems/4sum) — sort then two pointers
- [Count Ways to Group Overlapping Ranges — LeetCode](https://leetcode.com/problems/count-ways-to-group-overlapping-ranges) — problem page
