---
layout: page
title: "Maximum Length of Pair Chain"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-length-of-pair-chain"
---

# Maximum Length of Pair Chain / Độ Dài Lớn Nhất Của Chuỗi Cặp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy / DP
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals) | [Minimize the Maximum Difference of Pairs](https://leetcode.com/problems/minimize-the-maximum-difference-of-pairs)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Như xâu chuỗi trang sức — mỗi miếng trang sức có khoảng giá trị [a, b], và miếng tiếp theo phải bắt đầu từ giá trị **lớn hơn** (không bằng) b. Chiến lược tham lam: luôn chọn miếng kết thúc sớm nhất — tương tự bài lập lịch phòng họp.

**Pattern Recognition:**

- Signal: longest chain of non-overlapping pairs (strict: b_i < a_j) → **Greedy (sort by end) or DP**
- Key insight: Sort by second element (end of pair). Greedily pick each pair if its start > current chain's end. Each accepted pair leaves maximum room for future pairs.

**Visual — pairs=[[3,4],[1,2],[2,3]] example:**

```
Sorted by end: [1,2] [2,3] [3,4]

Greedy:
  Pick [1,2]: chain_end = 2, count = 1
  [2,3]: start=2, need > 2 → SKIP (2 is NOT strictly greater)
  [3,4]: start=3 > 2 ✓ → pick, chain_end = 4, count = 2

Answer: 2  ([1,2] then [3,4])

DP verification:
  dp[0]=1, dp[1]=1, dp[2]=max(dp[0]+1, 1)=2 (3>2)
```

---

## 📝 Problem Description

Given `n` pairs where `pairs[i] = [a, b]` with `a < b`, find the longest chain. A chain satisfies: for consecutive pairs `(c, d)` and `(e, f)`, we need `d < e` (strictly less than).

- **Example 1:** `pairs=[[1,2],[2,3],[3,4]]` → `2` (`[1,2]→[3,4]`)
- **Example 2:** `pairs=[[1,2],[7,8],[4,5]]` → `3` (`[1,2]→[4,5]→[7,8]`)
- **Constraints:** `1 ≤ n ≤ 1000`, `-1000 ≤ a < b ≤ 1000`

---

## 🎯 Interview Tips

1. **Sort by END** / Sắp theo giá trị kết thúc: bí quyết greedy — kết thúc sớm nhất → chừa nhiều chỗ hơn
2. **Strict inequality** / Bất đẳng thức nghiêm ngặt: `b_i < a_j` (NOT ≤) — khác với non-overlapping intervals
3. **Greedy vs DP** / Greedy vs DP: greedy O(n log n) tốt hơn DP O(n²); cả hai đều đúng
4. **DP state** / Trạng thái DP: `dp[i]` = độ dài chuỗi dài nhất kết thúc tại cặp i (sau khi sort)
5. **Similar to LIS** / Giống LIS: cấu trúc tương tự Longest Increasing Subsequence nhưng điều kiện nối là `pairs[j][1] < pairs[i][0]`
6. **O(n log n) DP** / DP O(n log n): có thể dùng binary search để tìm cặp cuối cùng tương thích, giống LIS patience sort

---

## 💡 Solutions

### Approach 1: DP — O(n²)

/\*_ @complexity Time: O(n²) | Space: O(n) _/

```typescript
function findLongestChainDP(pairs: number[][]): number {
  pairs.sort((a, b) => a[0] - b[0]); // sort by start
  const n = pairs.length;
  const dp = new Array(n).fill(1);

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      // pairs[j][1] < pairs[i][0]: strict, pair j ends before pair i starts
      if (pairs[j][1] < pairs[i][0]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  return Math.max(...dp);
}
```

### Approach 2: Greedy — Optimal O(n log n)

/\*_ @complexity Time: O(n log n) | Space: O(1) _/

```typescript
function findLongestChain(pairs: number[][]): number {
  // Sort by END value (second element)
  pairs.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let chainEnd = -Infinity; // end of last picked pair

  for (const [start, end] of pairs) {
    if (start > chainEnd) {
      // This pair starts strictly after the current chain ends → extend chain
      count++;
      chainEnd = end;
    }
    // Otherwise skip: this pair overlaps with (or touches) the current chain
  }

  return count;
}
```

---

## 🧪 Test Cases

```typescript
console.log(
  findLongestChain([
    [1, 2],
    [2, 3],
    [3, 4],
  ]),
); // → 2
console.log(
  findLongestChain([
    [1, 2],
    [7, 8],
    [4, 5],
  ]),
); // → 3
console.log(findLongestChain([[1, 2]])); // → 1
console.log(
  findLongestChain([
    [-10, -8],
    [8, 9],
    [-5, 0],
    [0, 1],
    [5, 6],
    [-3, 4],
  ]),
); // → 4
console.log(
  findLongestChain([
    [1, 100],
    [2, 3],
    [4, 5],
  ]),
); // → 2 ([2,3]→[4,5])
```

```

---

## Related Problems

| Problem                                                                                                                | Difficulty | Pattern            |
| ---------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals)                                   | Medium     | Greedy             |
| [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence)                         | Medium     | DP / Binary Search |
| [Maximum Length of Pair Chain](https://leetcode.com/problems/maximum-length-of-pair-chain)                             | Medium     | Greedy / DP        |
| [Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons) | Medium     | Greedy             |
```
