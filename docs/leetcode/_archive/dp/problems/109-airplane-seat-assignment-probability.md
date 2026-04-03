---
layout: page
title: "Airplane Seat Assignment Probability"
difficulty: Medium
category: Dynamic Programming
tags: [Math, Dynamic Programming, Brainteaser, Probability and Statistics]
leetcode_url: "https://leetcode.com/problems/airplane-seat-assignment-probability"
---

# Airplane Seat Assignment Probability / Xác Suất Chỗ Ngồi Trên Máy Bay

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Math / Probability Brainteaser
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** 100 người lên máy bay — người đầu tiên mất vé nên ngồi chỗ ngẫu nhiên. Mỗi người sau ngồi đúng chỗ nếu được, hoặc lại chọn ngẫu nhiên. Bạn có ngồi đúng chỗ không? Câu trả lời luôn là 50% (ngoại trừ n=1).

**Pattern Recognition:**

- Signal: "recursive probability with base cases 1/2" → Mathematical closed-form
- For n=1: trivially 1.0; for n≥2: always 0.5 by symmetry argument
- Can prove by induction: P(n) = 1/n + (n-2)/n \* P(n-1) → always 0.5

**Visual:**

```
n=3: P(3rd gets seat 3)
  1st sits in seat 1 (prob 1/3) → ✓ 3rd gets seat 3
  1st sits in seat 3 (prob 1/3) → ✗ 3rd loses seat 3
  1st sits in seat 2 (prob 1/3) → 2nd forced random → reduces to P(2) = 1/2
  P(3) = 1/3 + 0 + 1/3 * 1/2 + ... = 1/2 ✓
```

## Problem Description

`n` passengers board an airplane with `n` seats. Passenger 1 picks a random seat. Each subsequent passenger sits in their own seat if available, else picks a random remaining seat. What is the probability that passenger `n` gets seat `n`?

- Example 1: `n = 1` → `1.0`
- Example 2: `n = 2` → `0.5`
- Constraints: `1 ≤ n ≤ 10^9`

## 📝 Interview Tips

1. **Clarify**: Passenger 1 picks completely at random? / Có, ngẫu nhiên đều trong các ghế còn trống
2. **Approach**: Nhận ra quy luật bằng DP nhỏ, sau đó đưa ra công thức đóng / Spot the pattern with small DP, then closed-form
3. **Edge cases**: n=1 is special (only passenger = only seat = 100%); all n≥2 return 0.5
4. **Optimize**: O(1) — just check if n==1; mathematical proof by symmetry/induction
5. **Test**: Simulate for n=3,4,5 to confirm always 0.5
6. **Follow-up**: What's the expected number of passengers sitting in wrong seats?

## Solutions

```typescript
/** Solution 1: Mathematical closed-form O(1)
 * Time: O(1) | Space: O(1)
 * Proof: P(n) = 1/n*1 + 1/n*0 + (n-2)/n*P(n-1)
 *        P(2) = 1/2, and by induction P(n) = 1/2 for all n ≥ 2
 */
function nthPersonGetsNthSeat(n: number): number {
  return n === 1 ? 1.0 : 0.5;
}

/** Solution 2: DP to verify the pattern (works for small n)
 * Time: O(n) | Space: O(n)
 * dp[i] = probability that person i gets their correct seat in an i-person scenario
 */
function nthPersonGetsNthSeatDP(n: number): number {
  if (n === 1) return 1.0;

  // dp[i] = P(passenger i gets seat i | in sub-problem with i seats)
  // Recurrence: dp[i] = (1 + (i-2)*dp[i-1]) / i
  // Explanation: first person picks own seat (1/i → p=1), last seat (1/i → p=0),
  //              or one of (i-2) middle seats (each 1/i → reduces to dp[i-1])
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1.0;
  if (n >= 2) dp[2] = 0.5;

  for (let i = 3; i <= n; i++) {
    dp[i] = (1 + (i - 2) * dp[i - 1]) / i;
  }

  return dp[n];
}

/** Solution 3: Simulation for small n (verification)
 * Time: O(n^2 * trials) | Space: O(n)
 */
function simulateSeatProbability(n: number, trials: number = 100000): number {
  let success = 0;
  for (let t = 0; t < trials; t++) {
    const seats = new Array(n + 1).fill(true); // true = available
    let firstSeat = Math.floor(Math.random() * n) + 1;
    seats[firstSeat] = false;

    let nthGetsOwn = true;
    for (let p = 2; p <= n; p++) {
      if (p === n) {
        if (!seats[n]) {
          nthGetsOwn = false;
        }
        break;
      }
      if (seats[p]) {
        seats[p] = false; // sits in own seat
      } else {
        // Pick random available seat
        const available = [];
        for (let s = 1; s <= n; s++) if (seats[s]) available.push(s);
        const pick = available[Math.floor(Math.random() * available.length)];
        seats[pick] = false;
      }
    }
    if (nthGetsOwn) success++;
  }
  return success / trials;
}

// Tests
console.log(nthPersonGetsNthSeat(1)); // 1
console.log(nthPersonGetsNthSeat(2)); // 0.5
console.log(nthPersonGetsNthSeat(1000000000)); // 0.5
console.log(nthPersonGetsNthSeatDP(1)); // 1
console.log(nthPersonGetsNthSeatDP(5)); // 0.5
// Approximate: console.log(simulateSeatProbability(5)); // ~0.5
```

## 🔗 Related Problems

| Problem                                                                                            | Relationship                 |
| -------------------------------------------------------------------------------------------------- | ---------------------------- |
| [Toss Strange Coins](https://leetcode.com/problems/toss-strange-coins)                             | Probability DP               |
| [Soup Servings](https://leetcode.com/problems/soup-servings)                                       | Expected value / probability |
| [Construct the Longest New String](https://leetcode.com/problems/construct-the-longest-new-string) | Combinatorial counting       |
