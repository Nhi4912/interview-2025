---
layout: page
title: "N-th Tribonacci Number"
difficulty: Easy
category: Dynamic Programming
tags: [Math, Dynamic Programming, Memoization]
leetcode_url: "https://leetcode.com/problems/n-th-tribonacci-number"
---

# N-th Tribonacci Number / Số Tribonacci Thứ N

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Linear DP (Rolling Variables)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Fibonacci Number](https://leetcode.com/problems/fibonacci-number) | [Climbing Stairs](https://leetcode.com/problems/climbing-stairs)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống Fibonacci nhưng có 3 bước — để lên bậc thứ n, bạn có thể đến từ bậc n-1, n-2, hoặc n-3. Đếm tổng số cách.

**Pattern Recognition:**

- Signal: "T(n) = T(n-1) + T(n-2) + T(n-3)" + fixed base cases → **Rolling 3-variable DP**
- T(0)=0, T(1)=1, T(2)=1, T(3)=2, T(4)=4, T(5)=7, ...
- Key insight: Chỉ cần 3 biến — không cần mảng

**Visual — Computing T(5):**

```
n:    0  1  2  3  4  5
T(n): 0  1  1  2  4  7

Step: a=0,b=1,c=1
  n=3: next=0+1+1=2  → a=1,b=1,c=2
  n=4: next=1+1+2=4  → a=1,b=2,c=4
  n=5: next=1+2+4=7  → a=2,b=4,c=7 → return c=7 ✓
```

---

## Problem Description

The Tribonacci sequence: T(0)=0, T(1)=1, T(2)=1, and for n≥3: T(n) = T(n-1) + T(n-2) + T(n-3). Given `n`, return T(n). ([LeetCode 1137](https://leetcode.com/problems/n-th-tribonacci-number))

- Example 1: `n=4` → `4` (sequence: 0,1,1,2,4)
- Example 2: `n=25` → `1389537`
- Example 3: `n=37` → `2082876103` (max constraint)

Constraints: `0 ≤ n ≤ 37`, answer fits in 32-bit integer

---

## 📝 Interview Tips

1. **Clarify**: "Base cases: T(0)=0, T(1)=1, T(2)=1 — nên viết ra ngay" / State all three base cases explicitly
2. **Recursion**: "Naive recursion O(3^n) — quá chậm" / Exponential without memoization
3. **Memo**: "Top-down với map/array — O(n) time, O(n) space" / Simple memoization
4. **Rolling**: "Chỉ cần 3 biến a,b,c — O(1) space" / Best approach: roll 3 variables
5. **Constraints**: "n≤37 — tất cả approaches đều pass" / Any approach works, rolling is cleanest
6. **Generalize**: "Nếu k-nacci: rolling array size k, shift left và thêm sum" / k-variable rolling for k-step Fibonacci

---

## Solutions

```typescript
/**
 * Solution 1: Memoization (Top-Down)
 * Time: O(n)
 * Space: O(n)
 */
function tribonacciMemo(n: number): number {
  const memo = new Map<number, number>([
    [0, 0],
    [1, 1],
    [2, 1],
  ]);

  function dp(k: number): number {
    if (memo.has(k)) return memo.get(k)!;
    const val = dp(k - 1) + dp(k - 2) + dp(k - 3);
    memo.set(k, val);
    return val;
  }

  return dp(n);
}

/**
 * Solution 2: Bottom-Up with rolling variables
 * Time: O(n)
 * Space: O(1)
 */
function tribonacci(n: number): number {
  if (n === 0) return 0;
  if (n <= 2) return 1;

  let a = 0,
    b = 1,
    c = 1; // T(0), T(1), T(2)
  for (let i = 3; i <= n; i++) {
    const next = a + b + c;
    a = b;
    b = c;
    c = next;
  }
  return c;
}

/**
 * Solution 3: Iterative with array (explicit DP table)
 * Time: O(n)
 * Space: O(n) — useful when you need to retrieve any T(k) later
 */
function tribonacciTable(n: number): number {
  if (n === 0) return 0;
  if (n <= 2) return 1;
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  dp[2] = 1;
  for (let i = 3; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2] + dp[i - 3];
  return dp[n];
}

// === Test Cases ===
console.log(tribonacci(0)); // 0
console.log(tribonacci(1)); // 1
console.log(tribonacci(4)); // 4
console.log(tribonacci(25)); // 1389537
```

---

## 🔗 Related Problems

- [Fibonacci Number](https://leetcode.com/problems/fibonacci-number) — F(n)=F(n-1)+F(n-2) — 2-variable DP
- [Climbing Stairs](https://leetcode.com/problems/climbing-stairs) — same as Fibonacci: 1 or 2 steps
- [Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs) — cost-weighted Fibonacci
- [N-th Tribonacci Number Variant](https://leetcode.com/problems/get-maximum-in-generated-array) — generated sequence DP
- [Decode Ways](https://leetcode.com/problems/decode-ways) — Fibonacci-style with constraints
