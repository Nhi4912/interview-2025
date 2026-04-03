---
layout: page
title: "Flip String to Monotone Increasing"
difficulty: Medium
category: Dynamic Programming
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/flip-string-to-monotone-increasing"
---

# Flip String to Monotone Increasing / Lật Chuỗi Thành Đơn Điệu Tăng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Linear DP / Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Như sắp xếp hàng — bạn muốn tất cả số 0 đứng trước số 1. Tại mỗi vị trí chia, chi phí = số 1 bên trái (phải lật thành 0) + số 0 bên phải (phải lật thành 1).

**Pattern Recognition:**

- Signal: "minimum flips to create monotone string" → DP or prefix sum scan
- Try every split point: left all-0s, right all-1s
- `cost(split at i) = ones_in_prefix[i] + zeros_in_suffix[i+1]`

**Visual:**

```
s = "00110"
Split at -1: flip all to 1s → 0 ones + 2 zeros = 2 flips
Split at  0: [0][0110] → 0 + 1 = 1 flip ✓  (flip one '1')
Split at  1: [00][110] → 0 + 1 = 1 flip ✓
Split at  2: [001][10] → 1 + 1 = 2 flips
→ answer = 1
```

## Problem Description

A binary string is **monotone increasing** if it consists of some `0`s followed by some `1`s. Given binary string `s`, return the minimum number of flips to make it monotone increasing.

- Example 1: `s = "00110"` → `1` (flip position 2 or 3)
- Example 2: `s = "010110"` → `2`
- Constraints: `1 ≤ s.length ≤ 10^5`, `s[i] ∈ {'0','1'}`

## 📝 Interview Tips

1. **Clarify**: Flip có nghĩa là đổi 0↔1? / Flip means change 0 to 1 or 1 to 0?
2. **Approach**: Quét qua tất cả điểm chia; dùng biến đếm tích lũy / O(n) scan with running counters
3. **Edge cases**: All 0s → 0 flips; all 1s → 0 flips; length 1 → 0 flips
4. **Optimize**: O(n) single pass — track `ones` (left) and `zeros` (right) simultaneously
5. **Test**: "010" → 1; "11011" → 1; "0" → 0
6. **Follow-up**: What if we can flip at most k characters?

## Solutions

```typescript
/** Solution 1: Single-pass O(n) with running counters
 * Time: O(n) | Space: O(1)
 * Key insight: scan left→right, maintain ones_seen & zeros_remaining
 */
function minFlipsMonoIncr(s: string): number {
  let ones = 0;
  let zeros = 0;
  for (const c of s) if (c === "0") zeros++;

  // Split at -1: everything to the right, flip all 0s to 1s
  let res = zeros;

  for (const c of s) {
    if (c === "0") zeros--;
    else ones++;
    // cost at this split: ones in left + zeros in right
    res = Math.min(res, ones + zeros);
  }

  return res;
}

/** Solution 2: Classic DP — dp[0] = cost to end with 0, dp[1] = cost to end with 1
 * Time: O(n) | Space: O(1)
 * dp[i][0] = min flips for s[0..i] all-0s
 * dp[i][1] = min flips for s[0..i] monotone-increasing ending ≥ 1
 */
function minFlipsMonoIncr2(s: string): number {
  let dp0 = 0; // cost to make everything 0 so far
  let dp1 = 0; // cost to make it monotone (can end with 0 or 1)

  for (const c of s) {
    const isOne = c === "1" ? 1 : 0;
    const newDp0 = dp0 + isOne; // flip '1' to '0'
    const newDp1 = Math.min(dp0, dp1) + (1 - isOne); // flip '0' to '1'
    dp0 = newDp0;
    dp1 = newDp1;
  }

  return Math.min(dp0, dp1);
}

/** Solution 3: Prefix sums for intuition clarity
 * Time: O(n) | Space: O(n)
 */
function minFlipsMonoIncr3(s: string): number {
  const n = s.length;
  const prefixOnes = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefixOnes[i + 1] = prefixOnes[i] + (s[i] === "1" ? 1 : 0);
  }
  const totalOnes = prefixOnes[n];
  let res = Infinity;
  for (let i = 0; i <= n; i++) {
    const onesInLeft = prefixOnes[i]; // flip to 0
    const zerosInRight = n - i - (totalOnes - prefixOnes[i]); // flip to 1
    res = Math.min(res, onesInLeft + zerosInRight);
  }
  return res;
}

// Tests
console.log(minFlipsMonoIncr("00110")); // 1
console.log(minFlipsMonoIncr("010110")); // 2
console.log(minFlipsMonoIncr("11011")); // 1
console.log(minFlipsMonoIncr2("00110")); // 1
console.log(minFlipsMonoIncr3("010110")); // 2
```

## 🔗 Related Problems

| Problem                                                                                          | Relationship             |
| ------------------------------------------------------------------------------------------------ | ------------------------ |
| [Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses)             | Linear DP on string      |
| [Wildcard Matching](https://leetcode.com/problems/wildcard-matching)                             | String DP                |
| [Minimum Cost for Cutting Cake I](https://leetcode.com/problems/minimum-cost-for-cutting-cake-i) | Split-point optimization |
