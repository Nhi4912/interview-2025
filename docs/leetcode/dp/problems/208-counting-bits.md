---
layout: page
title: "Counting Bits"
difficulty: Easy
category: Dynamic Programming
tags: [Dynamic Programming, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/counting-bits"
---

# Counting Bits / Đếm Bit 1

## Tương tự thực tế (Vietnamese Analogy)

> Đếm số bit 1 trong biểu diễn nhị phân của mỗi số từ 0 đến n.  
> Mẹo: i >> 1 chính là i chia 2 (bỏ bit cuối). Số bit 1 của i = số bit 1 của (i>>1) + bit cuối của i.

## ASCII Visualization

```
i:    0   1   2   3   4   5   6   7
bin:  0  01  10  11 100 101 110 111
bits: 0   1   1   2   1   2   2   3

dp[4] = dp[4>>1] + (4&1) = dp[2] + 0 = 1 + 0 = 1  ✓
dp[5] = dp[5>>1] + (5&1) = dp[2] + 1 = 1 + 1 = 2  ✓
dp[7] = dp[7>>1] + (7&1) = dp[3] + 1 = 2 + 1 = 3  ✓
```

## Problem

Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (0 ≤ i ≤ n),
`ans[i]` is the **number of 1's** in the binary representation of `i`.

**Example:** `n = 5` → `[0, 1, 1, 2, 1, 2]`

**Constraints:** `0 <= n <= 10^5`

## Interview Tips

1. **Key recurrence** — `dp[i] = dp[i >> 1] + (i & 1)`: shift right drops last bit, add that last bit back.
2. **Alternative** — `dp[i] = dp[i & (i-1)] + 1`: `i & (i-1)` clears the lowest set bit.
3. **Why O(n)?** — Each value computed in O(1) from a previously computed value.
4. **Bit trick** — `Integer.bitCount()` / `popcount()` exists but O(log n) per call = O(n log n) total.
5. **Space** — O(n) for output array; no extra space needed.
6. **Follow-up** — Can you do it in O(n) time without built-in popcount? Yes — both DP approaches above.

## Solutions

### Solution 1: DP with Right Shift — O(n) time, O(n) space

```typescript
function countBits(n: number): number[] {
  const dp = new Array<number>(n + 1).fill(0);
  // dp[0] = 0 (base case)
  for (let i = 1; i <= n; i++) {
    // i >> 1: all bits except last; (i & 1): value of last bit
    dp[i] = dp[i >> 1] + (i & 1);
  }
  return dp;
}

console.log(countBits(2)); // [0, 1, 1]
console.log(countBits(5)); // [0, 1, 1, 2, 1, 2]
console.log(countBits(0)); // [0]
console.log(countBits(8)); // [0,1,1,2,1,2,2,3,1]
```

### Solution 2: DP with Last Set Bit — O(n) time, O(n) space

```typescript
function countBitsV2(n: number): number[] {
  const dp = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    // i & (i-1) clears the lowest set bit of i
    dp[i] = dp[i & (i - 1)] + 1;
  }
  return dp;
}

console.log(countBitsV2(5)); // [0, 1, 1, 2, 1, 2]
console.log(countBitsV2(7)); // [0, 1, 1, 2, 1, 2, 2, 3]
```

### Solution 3: Highest Power of 2 Approach — O(n) time

```typescript
function countBitsV3(n: number): number[] {
  // Every number i = highest_power_of_2 + remainder
  // dp[i] = dp[remainder] + 1; remainder = i - highest_power_of_2
  const dp = new Array<number>(n + 1).fill(0);
  let highBit = 0;
  for (let i = 1; i <= n; i++) {
    // When i is a power of 2, update highBit
    if ((i & (i - 1)) === 0) highBit = i;
    dp[i] = dp[i - highBit] + 1;
  }
  return dp;
}

// Verify all three solutions agree
const a = countBits(10);
const b = countBitsV2(10);
const c = countBitsV3(10);
console.log(JSON.stringify(a) === JSON.stringify(b)); // true
console.log(JSON.stringify(a) === JSON.stringify(c)); // true
console.log(a); // [0,1,1,2,1,2,2,3,1,2,2]
```

## Related Problems

| Problem                                                                                                                         | Difficulty | Key Concept      |
| ------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/)                                                             | Easy       | Bit manipulation |
| [Reverse Bits](https://leetcode.com/problems/reverse-bits/)                                                                     | Easy       | Bit manipulation |
| [Non-negative Integers without Consecutive Ones](https://leetcode.com/problems/non-negative-integers-without-consecutive-ones/) | Hard       | DP on bits       |
