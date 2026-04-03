---
layout: page
title: "2 Keys Keyboard"
difficulty: Medium
category: Dynamic Programming
tags: [Math, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/2-keys-keyboard"
---

# 2 Keys Keyboard / 2 Keys Keyboard

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees) | [Fibonacci Number](https://leetcode.com/problems/fibonacci-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhân bản tế bào — mỗi lần Copy-All ta nhân đôi (hoặc nhân k lần), rồi Paste nhiều lần. Số thao tác tối thiểu = tổng các ước nguyên tố của n (ví dụ n=12=2×2×3 → 2+2+3=7 thao tác).

**Visual — n=6:**

```
n=6, target: 'AAAAAA'

Option 1: CopyAll(1A) → Paste → Paste(2A) → CopyAll → Paste → Paste → Paste(6A)
          1 + 2 + 3 = 6 operations (wrong count)

Better:   Start with 'A'
  CopyAll(1) + Paste = 2A  → 2 ops
  CopyAll(2) + Paste = 4A  → 2 ops
  ... doesn't reach 6 cleanly

Best:     'A' → CopyAll + Paste + Paste = 'AAA' (3 ops)
          'AAA' → CopyAll + Paste = 'AAAAAA' (2 ops)
          Total = 5 ops

n=6=2×3 → sum of prime factors = 2+3 = 5 ✓
n=9=3×3 → sum = 3+3 = 6
n=prime → answer = n itself (only way: copy 1, paste n-1 times)
```

---

## Problem Description

Start with one `'A'` on a blank notepad. You can perform two operations: **Copy All** (copies everything on screen) and **Paste** (pastes clipboard). Return the **minimum number of operations** to get exactly `n` `'A'`s. ([LeetCode](https://leetcode.com/problems/2-keys-keyboard))

Difficulty: Medium | Acceptance: 59.1%

**Example 1:**

```
Input: n = 3
Output: 3
Explanation: Copy All (1A), Paste (2A), Paste (3A) = 3 operations.
```

**Example 2:**

```
Input: n = 1
Output: 0
Explanation: Already have 1 'A', no operations needed.
```

Constraints:

- `1 <= n <= 1000`

---

## 📝 Interview Tips

1. **Math insight**: "Số thao tác = tổng các ước nguyên tố của n. n=12=2×2×3 → 2+2+3=7" / Sum of prime factors is the key insight.
2. **DP approach**: "dp[i] = min operations to get i A's. dp[i] = min(dp[j] + i/j) cho mọi j chia hết i" / For each factor j of i, cost = dp[j] + (i/j).
3. **Why prime factors?**: "Mỗi lần copy-paste j lần = j operations, tương ứng một nhân tử nguyên tố" / Each copy+pastes cycle corresponds to one prime factor.
4. **Greedy**: "Luôn copy ở điểm tốt nhất (khi screen count là ước của n)" / Copy when current count divides target.
5. **Edge cases**: "n=1 → 0 ops, n=prime p → p ops (copy + paste p-1 times)" / Prime n requires n operations.
6. **Follow-up**: "3 Keys (Copy, Paste, Cut)? Thêm state cho clipboard" / Adding cut/delete complicates the state space.

---

## Solutions

```typescript
/**
 * Solution 1: DP bottom-up
 * Time: O(n²) — for each i, check all divisors j
 * Space: O(n)
 */
function minStepsDP(n: number): number {
  if (n === 1) return 0;
  const dp = new Array(n + 1).fill(Infinity);
  dp[1] = 0;

  for (let i = 2; i <= n; i++) {
    for (let j = 1; j < i; j++) {
      if (i % j === 0) {
        // From j A's: Copy All (1 op) + Paste (i/j - 1) times
        dp[i] = Math.min(dp[i], dp[j] + i / j);
      }
    }
  }

  return dp[n];
}

/**
 * Solution 2: Prime factorization (math insight)
 * Time: O(√n) — trial division
 * Space: O(1)
 *
 * Observation: optimal strategy = decompose n into prime factors p1 × p2 × ...
 * Each prime factor p costs p operations (1 copy-all + p-1 pastes)
 * Total = sum of all prime factors (with repetition)
 */
function minSteps(n: number): number {
  let ans = 0;
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) {
      ans += d;
      n = Math.floor(n / d);
    }
    d++;
  }
  if (n > 1) ans += n; // n itself is prime
  return ans;
}

// === Test Cases ===
console.log(minSteps(1)); // 0
console.log(minSteps(2)); // 2
console.log(minSteps(3)); // 3
console.log(minSteps(6)); // 5 (2+3)
console.log(minSteps(9)); // 6 (3+3)
console.log(minSteps(12)); // 7 (2+2+3)
console.log(minSteps(1000)); // 21 (2+2+2+5+5+5)
```
