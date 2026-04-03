---
layout: page
title: "Combination Sum IV"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/combination-sum-iv"
---

# Combination Sum IV / Tổng Kết Hợp IV

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Maximal Square](https://leetcode.com/problems/maximal-square)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Như đếm số cách đi từ nhà đến chợ khi có thể đi bộ 1, 2, hoặc 3 bước mỗi lần. Để đến bước thứ n, bạn có thể từ bước n-1, n-2, hoặc n-3 bước tới. Tổng số cách đến n = tổng số cách đến các bước trước đó. Đây là bài toán leo cầu thang nhưng tổng quát hơn!

**Pattern Recognition:**

- Signal: count **ordered** combinations summing to target → **unbounded knapsack / climbing stairs DP**
- Key insight: `dp[i]` = number of ways to reach sum `i`. For each `num` in `nums`, if `i >= num`, add `dp[i - num]`. ORDER matters (1+2 ≠ 2+1), so we loop target in outer loop.

**Visual — nums=[1,2,3], target=4 example:**

```
dp[0]=1 (base: empty combination)
dp[1]: from dp[0] using 1       → dp[1]=1       {[1]}
dp[2]: dp[1]+dp[0] (use 1,2)    → dp[2]=2       {[1,1],[2]}
dp[3]: dp[2]+dp[1]+dp[0]        → dp[3]=4       {[1,1,1],[1,2],[2,1],[3]}
dp[4]: dp[3]+dp[2]+dp[1]        → dp[4]=7

7 ordered combinations: [1,1,1,1][1,1,2][1,2,1][1,3][2,1,1][2,2][3,1]
```

---

## 📝 Problem Description

Given an array `nums` of **distinct** positive integers and a positive integer `target`, return the number of possible ordered combinations that add up to `target`.

- **Example 1:** `nums=[1,2,3], target=4` → `7`
- **Example 2:** `nums=[9], target=3` → `0`
- **Constraints:** `1 ≤ nums.length ≤ 200`, `1 ≤ nums[i] ≤ 1000`, `1 ≤ target ≤ 1000`, all nums are distinct

---

## 🎯 Interview Tips

1. **Order matters** / Thứ tự quan trọng: 1+2 và 2+1 được tính là 2 cách khác nhau — đây là "ordered" combination
2. **Loop order** / Thứ tự vòng lặp: để đếm thứ tự, đặt vòng `target` ở ngoài, `nums` ở trong (ngược với 0/1 knapsack)
3. **Brute force** / Vũ lực: đệ quy O(n^target), memoize để xuống O(n × target)
4. **Compare with Coin Change** / So sánh với Coin Change: đó đếm cách không quan tâm thứ tự, đây có thứ tự
5. **Overflow** / Tràn số: đề note không cần mod, nhưng thực tế nên dùng BigInt nếu cần
6. **Follow-up** / Biến thể: nếu nums có số âm thì bài sẽ có vô hạn kết quả (cycle trong DP)

---

## 💡 Solutions

### Approach 1: Recursive + Memoization (Top-Down)

/\*_ @complexity Time: O(target × n) | Space: O(target) _/

```typescript
function combinationSum4Memo(nums: number[], target: number): number {
  const memo = new Array(target + 1).fill(-1);

  function dfs(remaining: number): number {
    if (remaining === 0) return 1;
    if (remaining < 0) return 0;
    if (memo[remaining] !== -1) return memo[remaining];
    let ways = 0;
    for (const num of nums) {
      if (remaining >= num) ways += dfs(remaining - num);
    }
    memo[remaining] = ways;
    return ways;
  }

  return dfs(target);
}
```

### Approach 2: Bottom-Up DP — Optimal

/\*_ @complexity Time: O(target × n) | Space: O(target) _/

```typescript
function combinationSum4(nums: number[], target: number): number {
  // dp[i] = number of ordered combinations summing to i
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1; // base: one way to make sum 0 (empty combination)

  for (let i = 1; i <= target; i++) {
    for (const num of nums) {
      if (i >= num) {
        dp[i] += dp[i - num];
      }
    }
  }
  return dp[target];
}
```

### Approach 3: With Overflow Guard (if counts can be huge)

/\*_ @complexity Time: O(target × n) | Space: O(target) _/

```typescript
function combinationSum4Safe(nums: number[], target: number): number {
  const MOD = 2 ** 31; // guard against JS number limits
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1;

  for (let i = 1; i <= target; i++) {
    for (const num of nums) {
      if (i >= num && dp[i - num] > 0) {
        dp[i] = (dp[i] + dp[i - num]) % MOD;
      }
    }
  }
  return dp[target];
}
```

---

## 🧪 Test Cases

```typescript
console.log(combinationSum4([1, 2, 3], 4)); // → 7
console.log(combinationSum4([9], 3)); // → 0 (9 > 3, impossible)
console.log(combinationSum4([1], 1)); // → 1
console.log(combinationSum4([1, 2], 3)); // → 3  ([1,1,1],[1,2],[2,1])
console.log(combinationSum4([3, 1, 2], 4)); // → 7  (same as example 1, order of nums doesn't matter)
```

---

## Related Problems

| Problem                                                          | Difficulty | Pattern               |
| ---------------------------------------------------------------- | ---------- | --------------------- |
| [Coin Change](https://leetcode.com/problems/coin-change)         | Medium     | DP Unbounded Knapsack |
| [Coin Change II](https://leetcode.com/problems/coin-change-ii)   | Medium     | DP (unordered)        |
| [Climbing Stairs](https://leetcode.com/problems/climbing-stairs) | Easy       | DP Linear             |
| [Word Break](https://leetcode.com/problems/word-break)           | Medium     | DP + Hash Set         |
