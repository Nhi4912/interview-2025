---
layout: page
title: "Number of People Aware of a Secret"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming, Queue, Simulation]
leetcode_url: "https://leetcode.com/problems/number-of-people-aware-of-a-secret"
---

# Number of People Aware of a Secret / Số Người Biết Bí Mật

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Find the Winner of the Circular Game](https://leetcode.com/problems/find-the-winner-of-the-circular-game) | [Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như tin đồn lan truyền — người biết tin vào ngày i sẽ bắt đầu kể cho người khác sau `delay` ngày, nhưng sẽ quên đi sau `forget` ngày. Mỗi ngày có một "đợt" người mới biết tin, từ những người đang trong giai đoạn chia sẻ.

**Pattern Recognition:**

- Signal: "simulation over days" + "window of active sharers" → **DP + Prefix Sum**
- `dp[i]` = số người **lần đầu** biết vào ngày i
- Người biết vào ngày j chia sẻ từ ngày j+delay đến ngày j+forget-1

**Visual — dp[i] = sum of sharers in window:**

```
Day:    1   2   3   4   5   6   7   8
dp[1]=1 ───►share starts at 1+delay
             └──► share ends at 1+forget (exclusive)

dp[i] = sum( dp[j] for j in [i-forget+1, i-delay] )
Answer = sum( dp[j] for j in [n-forget+1, n] ) — still alive on day n
```

---

## Problem Description

On day 1, person 1 learns a message. Each person who learns on day i shares it starting day i+`delay` (inclusive) until day i+`forget` (exclusive, then forgets). Return the number of people who know the message on day `n`, modulo 10^9+7. ([LeetCode 2327](https://leetcode.com/problems/number-of-people-aware-of-a-secret))

**Example 1:** `n=6, delay=2, forget=4` → `5`

**Example 2:** `n=4, delay=1, forget=3` → `6`

Constraints: `2 <= n <= 1000`, `1 <= delay < forget <= n`

---

## 📝 Interview Tips

1. **Clarify**: "Ngày j chia sẻ trong khoảng [j+delay, j+forget), tức là j+forget là ngày quên" / Day j+forget is the forget day (exclusive end of sharing)
2. **State definition**: "dp[i] = người mới học ngày i; answer = tổng dp[j] với j còn nhớ vào ngày n" / dp[i] = new learners on day i
3. **Window**: "dp[i] phụ thuộc vào một sliding window j ∈ [i-forget+1, i-delay]" / Use sliding window for O(n) transition
4. **Prefix sum**: "Tính prefix sum của dp để query range sum trong O(1)" / Prefix sum makes each transition O(1)
5. **Answer**: "Chỉ đếm người còn nhớ vào ngày n, tức j ∈ [n-forget+1, n]" / Only count people who haven't forgotten by day n
6. **Edge cases**: "delay=1 và forget=n: mọi người đều chia sẻ nhưng chỉ quên vào ngày cuối" / Large window scenarios

---

## Solutions

```typescript
/**
 * Solution 1: Direct DP — O(n * forget) time
 * Time: O(n * forget) — nested loops for window sum
 * Space: O(n) — dp array
 */
function peopleAwareOfSecretDP(n: number, delay: number, forget: number): number {
  const MOD = 1_000_000_007;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    for (let j = Math.max(1, i - forget + 1); j <= i - delay; j++) {
      dp[i] = (dp[i] + dp[j]) % MOD;
    }
  }

  // Count people still alive on day n (learned on day j where j + forget > n)
  let ans = 0;
  for (let j = Math.max(1, n - forget + 1); j <= n; j++) {
    ans = (ans + dp[j]) % MOD;
  }
  return ans;
}

/**
 * Solution 2: DP + Prefix Sum — O(n) time
 * Time: O(n) — each dp[i] computed in O(1) using prefix sum
 * Space: O(n) — dp + prefix arrays
 */
function peopleAwareOfSecret(n: number, delay: number, forget: number): number {
  const MOD = 1_000_000_007;
  const dp = new Array(n + 1).fill(0);
  const prefix = new Array(n + 2).fill(0); // prefix[i] = sum dp[1..i]
  dp[1] = 1;
  prefix[1] = 1;

  for (let i = 2; i <= n; i++) {
    const hi = i - delay;       // latest sharer who reaches day i
    const lo = Math.max(1, i - forget + 1); // earliest still-alive sharer
    if (hi >= lo) {
      dp[i] = ((prefix[hi] - prefix[lo - 1]) % MOD + MOD) % MOD;
    }
    prefix[i] = (prefix[i - 1] + dp[i]) % MOD;
  }

  // People still alive: learned on day j where j + forget > n → j > n - forget
  const lo = Math.max(1, n - forget + 1);
  return ((prefix[n] - prefix[lo - 1]) % MOD + MOD) % MOD;
}

// === Test Cases ===
console.log(peopleAwareOfSecret(6, 2, 4));  // 5
console.log(peopleAwareOfSecret(4, 1, 3));  // 6
console.log(peopleAwareOfSecret(2, 1, 2));  // 1
```

---

## 🔗 Related Problems

| Problem | Difficulty | Pattern |
|---------|-----------|---------|
| [Time Needed to Rearrange a Binary String](https://leetcode.com/problems/time-needed-to-rearrange-a-binary-string) | 🟡 Medium | DP Simulation |
| [Cells in a Range on an Excel Sheet](https://leetcode.com/problems/cells-in-a-range-on-an-excel-sheet) | 🟢 Easy | Simulation |
| [Find the Winner of the Circular Game](https://leetcode.com/problems/find-the-winner-of-the-circular-game) | 🟡 Medium | Math / DP |
| [Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray) | 🟡 Medium | Sliding Window |
| [Count the Number of Ideal Arrays](https://leetcode.com/problems/count-the-number-of-ideal-arrays) | 🔴 Hard | DP + Math |
