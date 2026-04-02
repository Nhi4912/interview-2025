---
layout: page
title: "Non-negative Integers without Consecutive Ones"
difficulty: Hard
category: Dynamic Programming
tags: [Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/non-negative-integers-without-consecutive-ones"
---

# Non-negative Integers without Consecutive Ones / Số Không Có Hai Bit 1 Liên Tiếp

---

## 🧠 Intuition / Tư Duy

**Analogy:** > Đếm các số từ 0 đến n mà biểu diễn nhị phân không có hai bit 1 kề nhau.  
> Giống đếm cách xếp người trên ghế dài: không ai ngồi cạnh nhau (bit 1 = người ngồi).

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Non-negative Integers without Consecutive Ones example:**

```
n = 5 (binary = 101)

f(k,0) = # of k-bit numbers ending in 0 with no consecutive 1s
f(k,1) = # of k-bit numbers ending in 1 with no consecutive 1s

f(1,0)=1, f(1,1)=1
f(2,0)=2 (00,10), f(2,1)=1 (01)
f(3,0)=3 (000,010,100), f(3,1)=2 (001,101)

Process n=5 (binary "101") bit by bit:
  bit2=1: add f(2,0)=2 → so far count=2, prevBit=1
  bit1=0: prevBit=1, curr=0, OK, prevBit=0
  bit0=1: prevBit=0, curr=1, add f(0,0)=1 → count+=1=3, prevBit=1
  End: n itself "101" has no consecutive 1s → count+1=4
  Valid: 0,1,2,4,5 ... wait 5=101 ✓, result should be 5
  (0,1,2,4,5) = 5 numbers
```

---

## Problem Description

Given a positive integer `n`, return the count of numbers in the range `[0, n]` whose binary
representation does **not** contain consecutive ones.

**Constraints:** `1 <= n <= 10^9`

---

## 📝 Interview Tips

1. **Fibonacci-based DP** — let `f[k]` = count of k-bit strings with no consecutive 1s: `f[k] = f[k-1] + f[k-2]` (Fibonacci!).
2. **Digit DP approach** — scan bits from MSB to LSB; whenever we place a 1, add count of valid numbers below.
3. **Tight constraint** — track `prevBit` and `tight` flag; when a bit is 1, count all valid numbers with 0 in this position (lower).
4. **Zero is valid** — 0 has no consecutive 1s; include it.
5. **Check n itself** — after processing all bits, check if n itself is valid (no consecutive 1s).
6. **Precompute Fibonacci** — `ones[i]` and `zeros[i]` for up to 32 bits, then use them in the loop.

---

## Solutions

```typescript
function findIntegers(n: number): number {
  // Precompute: dp[i][0] = # i-bit numbers ending in 0 with no consecutive 1s
  //             dp[i][1] = # i-bit numbers ending in 1 with no consecutive 1s
  // dp[1][0]=1, dp[1][1]=1
  // dp[i][0] = dp[i-1][0] + dp[i-1][1]
  // dp[i][1] = dp[i-1][0]  (can only follow 0)
  const BITS = 32;
  const dp: number[][] = Array.from({ length: BITS + 1 }, () => [0, 0]);
  dp[1][0] = 1;
  dp[1][1] = 1;
  for (let i = 2; i <= BITS; i++) {
    dp[i][0] = dp[i - 1][0] + dp[i - 1][1];
    dp[i][1] = dp[i - 1][0];
  }

  let count = 0;
  let prevBit = 0;
  const bits = n.toString(2);
  const len = bits.length;

  for (let i = 0; i < len; i++) {
    const bit = parseInt(bits[i]);
    if (bit === 1) {
      // Count all numbers with a 0 here (remaining bits free, no consecutive 1s)
      const remaining = len - i - 1;
      count += dp[remaining + 1][0]; // place 0 at position i, remaining bits
      if (prevBit === 1) {
        // n has consecutive 1s → n itself invalid; stop
        return count;
      }
      prevBit = 1;
    } else {
      prevBit = 0;
    }
  }

  // n itself is valid
  return count + 1;
}

console.log(findIntegers(5)); // 5: [0,1,2,4,5]
console.log(findIntegers(1)); // 2: [0,1]
console.log(findIntegers(2)); // 3: [0,1,2]
console.log(findIntegers(3)); // 3: [0,1,2] (3=11 has consecutive 1s)
console.log(findIntegers(6)); // 5: [0,1,2,4,5] (6=110, 7=111 invalid)

function findIntegersV2(n: number): number {
  // Fibonacci sequence: fib[i] = count of valid i-bit strings
  // fib[1]=2 (0 or 1), fib[2]=3 (00,01,10)
  const fib: number[] = [0, 1, 2];
  for (let i = 3; i <= 33; i++) fib.push(fib[i - 1] + fib[i - 2]);

  // Process bits of n
  let result = 0,
    prevBit = 0;
  const bits = n.toString(2);
  const len = bits.length;

  for (let i = 0; i < len; i++) {
    if (bits[i] === "1") {
      // Add count of numbers with 0 at this position
      result += fib[len - i]; // fib[k] = count of k-bit valid numbers
      if (prevBit === 1) return result; // consecutive 1s in n
      prevBit = 1;
    } else {
      prevBit = 0;
    }
  }
  return result + 1; // include n itself
}

console.log(findIntegersV2(5)); // 5
console.log(findIntegersV2(1)); // 2
console.log(findIntegersV2(3)); // 3

function findIntegersBrute(n: number): number {
  let count = 0;
  for (let i = 0; i <= n; i++) {
    const b = i.toString(2);
    if (!b.includes("11")) count++;
  }
  return count;
}

// Verify
for (let n = 1; n <= 20; n++) {
  const a = findIntegers(n),
    b = findIntegersBrute(n);
  if (a !== b) console.log(`MISMATCH n=${n}: ${a} vs ${b}`);
}
console.log("All verified for n=1..20"); // All verified ✓
```

---

## 🔗 Related Problems

| Problem                                                                                               | Difficulty | Key Concept |
| ----------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| [Counting Bits](https://leetcode.com/problems/counting-bits/)                                         | Easy       | DP on bits  |
| [Count Numbers with Unique Digits](https://leetcode.com/problems/count-numbers-with-unique-digits/)   | Medium     | Digit DP    |
| [Numbers At Most N Given Digit Set](https://leetcode.com/problems/numbers-at-most-n-given-digit-set/) | Hard       | Digit DP    |
