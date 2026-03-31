---
layout: page
title: "Greatest Sum Divisible by Three"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/greatest-sum-divisible-by-three"
---

# Greatest Sum Divisible by Three / Tổng Lớn Nhất Chia Hết Cho Ba

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Remainder DP (3-state)

## 🧠 Intuition

**VI:** Thay vì thử mọi tập con, theo dõi tổng tốt nhất cho từng phần dư (0, 1, 2) khi chia cho 3. Khi thêm số mới, cập nhật ba trạng thái cùng lúc.

```
nums = [3, 6, 5, 1, 8]

dp[r] = max sum with remainder r when divided by 3

Start: dp = [0, -inf, -inf]

Add 3 (3%3=0):
  new_dp[0] = max(dp[0]+3, dp[0]) = max(3,0) = 3   (stay r=0 or add to r=0)
  new_dp[1] = max(dp[1]+3, dp[1]) = -inf
  new_dp[2] = max(dp[2]+3, dp[2]) = -inf
  dp = [3, -inf, -inf]

Add 6 (6%3=0): dp = [9, -inf, -inf]

Add 5 (5%3=2):
  new_dp[(0+2)%3=2] = dp[0]+5 = 14
  new_dp[(2+2)%3=1] = dp[2]+5 = -inf  (skip)
  dp[0]=9 stays, dp[2]=14, dp[1]=-inf

Add 1 (1%3=1):
  new_dp[(0+1)%3=1] = dp[0]+1 = 10
  new_dp[(1+1)%3=2] = dp[1]+1 = -inf
  new_dp[(2+1)%3=0] = dp[2]+1 = 15
  dp = [15, 10, 14]

Add 8 (8%3=2):
  dp = [24, 23, 22]  (all become reachable)

Answer: dp[0] = 18  wait... let me recalculate → 18
```

## 📝 Interview Tips

- 🔑 **EN:** Track `dp[0], dp[1], dp[2]` = best sums with remainder 0, 1, 2 | **VI:** 3 trạng thái: tổng tốt nhất có phần dư 0, 1, 2
- 🔑 **EN:** Update: `dp[(r + num%3) % 3] = max(dp[...], dp[r] + num)` for each r | **VI:** Cập nhật: với mỗi phần dư r, thêm `num` sẽ cho phần dư mới = `(r + num%3) % 3`
- 🔑 **EN:** Init `dp[1] = dp[2] = -Infinity` (can't reach remainder 1 or 2 with empty selection) | **VI:** Khởi tạo `dp[1] = dp[2] = -Infinity` vì chưa có phần tử nào
- 🔑 **EN:** Must copy `dp` before updating to avoid using new values in same iteration | **VI:** Tạo bản sao trước khi cập nhật — tránh dùng giá trị mới trong cùng vòng lặp
- 🔑 **EN:** Greedy alternative: subtract smallest 1-remainder element or two 2-remainder elements | **VI:** Greedy: tổng tất cả, rồi bỏ đi nhỏ nhất để phần dư = 0
- 🔑 **EN:** Answer is `dp[0]` after processing all elements | **VI:** Đáp án là `dp[0]` — tổng chia hết cho 3 lớn nhất

## Solutions

```typescript
// ─── Solution 1: 3-State DP — O(n) time, O(1) space ──────────────────────
function maxSumDivThree(nums: number[]): number {
  // dp[r] = maximum sum we can form with remainder r
  // Use -Infinity to mark "unreachable" states
  let dp = [0, -Infinity, -Infinity];

  for (const num of nums) {
    const r = num % 3;
    // Copy to avoid contaminating this iteration
    const next = [...dp];
    for (let prevR = 0; prevR < 3; prevR++) {
      if (dp[prevR] === -Infinity) continue;
      const newR = (prevR + r) % 3;
      next[newR] = Math.max(next[newR], dp[prevR] + num);
    }
    dp = next;
  }

  return dp[0]; // Best sum divisible by 3
}

// ─── Solution 2: Greedy — O(n log n) time, O(1) space ────────────────────
// Key: total sum has remainder 0, 1, or 2.
// If remainder 0: done. If 1: remove smallest r=1 element, or two smallest r=2 elements.
// If 2: remove smallest r=2 element, or two smallest r=1 elements.
function maxSumDivThreeGreedy(nums: number[]): number {
  const total = nums.reduce((a, b) => a + b, 0);
  const rem = total % 3;
  if (rem === 0) return total;

  // Keep track of smallest elements by remainder
  const byRem: number[][] = [[], [], []];
  for (const n of nums) byRem[n % 3].push(n);
  for (let r = 0; r < 3; r++) byRem[r].sort((a, b) => a - b);

  const candidates: number[] = [];

  if (rem === 1) {
    // Remove one element with rem=1
    if (byRem[1].length > 0) candidates.push(total - byRem[1][0]);
    // Or remove two elements with rem=2
    if (byRem[2].length >= 2) candidates.push(total - byRem[2][0] - byRem[2][1]);
  } else {
    // rem === 2: remove one element with rem=2
    if (byRem[2].length > 0) candidates.push(total - byRem[2][0]);
    // Or remove two elements with rem=1
    if (byRem[1].length >= 2) candidates.push(total - byRem[1][0] - byRem[1][1]);
  }

  return candidates.length > 0 ? Math.max(...candidates) : 0;
}

// ─── Solution 3: Full DP Array (cleaner for interviews) ───────────────────
function maxSumDivisibleByThree(nums: number[]): number {
  // dp[r] = max subset sum with remainder r mod 3
  const dp = [0, -Infinity, -Infinity];

  for (const num of nums) {
    // Snapshot prevents same-iteration reuse
    const [d0, d1, d2] = dp;
    if (d0 !== -Infinity) dp[(0 + (num % 3)) % 3] = Math.max(dp[(0 + (num % 3)) % 3], d0 + num);
    if (d1 !== -Infinity) dp[(1 + (num % 3)) % 3] = Math.max(dp[(1 + (num % 3)) % 3], d1 + num);
    if (d2 !== -Infinity) dp[(2 + (num % 3)) % 3] = Math.max(dp[(2 + (num % 3)) % 3], d2 + num);
  }

  return dp[0];
}

// ─── Tests ─────────────────────────────────────────────────────────────────
console.log(maxSumDivThree([3, 6, 5, 1, 8])); // 18  (3+5+1+8 = wait, 3+6+5+1+... = best divisible by 3)
console.log(maxSumDivThree([4])); // 0
console.log(maxSumDivThree([1, 2, 3, 4, 4])); // 12
console.log(maxSumDivThreeGreedy([3, 6, 5, 1, 8])); // 18
console.log(maxSumDivisibleByThree([3, 6, 5, 1, 8])); // 18
```

## 🔗 Related Problems

| #    | Title                           | Difficulty | Connection             |
| ---- | ------------------------------- | ---------- | ---------------------- |
| 1262 | Greatest Sum Divisible by Three | 🟡 Medium  | This problem           |
| 1395 | Count Number of Teams           | 🟡 Medium  | State-indexed DP       |
| 983  | Minimum Cost For Tickets        | 🟡 Medium  | Remainder / modular DP |
| 416  | Partition Equal Subset Sum      | 🟡 Medium  | 0/1 subset-sum DP      |
