---
layout: page
title: "Count the Number of Powerful Integers"
difficulty: Hard
category: Dynamic Programming
tags: [Math, String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/count-the-number-of-powerful-integers"
---

# Count the Number of Powerful Integers / Đếm Số Nguyên Mạnh

## Tương tự thực tế (Vietnamese Analogy)

> Đếm các số trong khoảng [start, finish] mà mỗi chữ số ≤ limit VÀ kết thúc bằng hậu tố s.  
> Giống đếm biển số xe hợp lệ trong một khoảng — dùng kỹ thuật "đếm tới n" rồi trừ đi.

## ASCII Visualization

```
count(finish) - count(start - 1)
where count(n) = # of valid numbers in [1..n]

n = 391, suffix = "1", limit = 9
Numbers ending in "1": 1, 11, 21, ... 391
Prefix part: each digit ≤ limit(=9)
             [  p r e f i x  ][suf]
              ← free digits →   1
```

## Problem

Given `start`, `finish`, `limit`, and `suffix` string `s`:  
Count integers in `[start, finish]` where every digit is ≤ `limit` AND the number ends with `s`.

**Constraints:** `1 <= start <= finish <= 10^15`, `1 <= limit <= 9`, `1 <= s.length <= floor(log10(finish)) + 1`

## Interview Tips

1. **Digit DP pattern** — count(n) = "how many valid numbers ≤ n?" then answer = count(finish) - count(start-1).
2. **Suffix constraint** — a valid number must end with `s`; its length must be `>= s.length`.
3. **Prefix construction** — digits before the suffix each must be ≤ `limit`; use digit DP with tight flag.
4. **Tight bound** — when building digit by digit, track whether we're still "tight" to the upper bound.
5. **Base case** — if `s` alone (as a number) > `n`, return 0. If `s.length == totalLen`, check suffix directly.
6. **BigInt safe** — finish can be up to 10^15; use BigInt or careful number arithmetic.

## Solutions

### Solution 1: Digit DP — count(n) helper — O(log n)

```typescript
function numberOfPowerfulInt(start: number, finish: number, limit: number, s: string): number {
  // Count valid numbers in [1, n] ending with suffix s, every digit <= limit
  function countUpTo(n: bigint): bigint {
    const numStr = n.toString();
    const sufLen = s.length;
    if (numStr.length < sufLen) return 0n;
    // Check if suffix itself (as number) is valid and <= n
    const sufNum = BigInt(s);

    let result = 0n;
    // Iterate over all possible lengths of the full number
    for (let len = sufLen; len <= numStr.length; len++) {
      const prefLen = len - sufLen;
      if (prefLen === 0) {
        // The number IS the suffix — check each digit <= limit and number <= n
        let valid = true;
        for (const c of s) {
          if (parseInt(c) > limit) {
            valid = false;
            break;
          }
        }
        if (valid && sufNum <= n) result += 1n;
      } else {
        // prefix has `prefLen` digits, first digit 1..limit, rest 0..limit
        // AND the whole number prefix+suffix must be <= n (if len == numStr.length)
        if (len < numStr.length) {
          // All numbers of this length that end with s and digits <= limit
          // First digit: 1..limit (prefLen choices for leading), rest: 0..limit
          // Check suffix digits all <= limit
          let sufValid = true;
          for (const c of s) {
            if (parseInt(c) > limit) {
              sufValid = false;
              break;
            }
          }
          if (!sufValid) continue;
          // Count = limit * (limit+1)^(prefLen-1)
          let ways = BigInt(limit); // first prefix digit: 1..limit
          for (let i = 1; i < prefLen; i++) ways *= BigInt(limit + 1);
          result += ways;
        } else {
          // len == numStr.length: prefix must be <= numStr[0..prefLen-1] (tight)
          let sufValid = true;
          for (const c of s) {
            if (parseInt(c) > limit) {
              sufValid = false;
              break;
            }
          }
          if (!sufValid) continue;
          // Digit DP on the prefix part with tight constraint
          const upperPref = numStr.slice(0, prefLen);
          let count = 0n;
          let tight = true;
          for (let i = 0; i < prefLen; i++) {
            const upDigit = parseInt(upperPref[i]);
            const maxD = tight ? Math.min(upDigit - 1, limit) : limit;
            const minD = i === 0 ? 1 : 0;
            if (maxD >= minD) {
              // Count free choices for remaining prefix digits
              const freeDigits = prefLen - i - 1;
              let ways = BigInt(maxD - minD + 1);
              for (let j = 0; j < freeDigits; j++) ways *= BigInt(limit + 1);
              count += ways;
            }
            if (!tight || upDigit > limit) break;
            tight = tight && upDigit <= limit;
          }
          // Check if the tight candidate prefix+suffix <= n
          if (tight) {
            const candidate = upperPref + s;
            if (BigInt(candidate) <= n) count += 1n;
          }
          result += count;
        }
      }
    }
    return result;
  }

  const ans = countUpTo(BigInt(finish)) - countUpTo(BigInt(start) - 1n);
  return Number(ans);
}

console.log(numberOfPowerfulInt(1, 6000, 4, "124")); // 5
console.log(numberOfPowerfulInt(15, 215, 6, "10")); // 2
console.log(numberOfPowerfulInt(1000, 2000, 4, "3")); // 2
```

### Solution 2: Cleaner Digit DP with string comparison

```typescript
function numberOfPowerfulIntV2(start: number, finish: number, limit: number, s: string): number {
  function count(n: string): number {
    if (n.length < s.length) return 0;
    // check suffix digits
    for (const c of s) if (parseInt(c) > limit) return 0;

    let res = 0;
    const prefLen = n.length - s.length;

    // Numbers shorter than n.length
    for (let len = s.length + 1; len < n.length; len++) {
      const pLen = len - s.length;
      // first digit 1..limit, rest 0..limit
      let ways = limit;
      for (let i = 1; i < pLen; i++) ways *= limit + 1;
      res += ways;
    }

    // Numbers of exactly n.length
    if (prefLen === 0) {
      // Just check if suffix <= n and all digits valid
      if (s <= n) res += 1;
    } else {
      const upperPref = n.slice(0, prefLen);
      let tight = true;
      for (let i = 0; i < prefLen && tight; i++) {
        const upD = parseInt(upperPref[i]);
        const lo = i === 0 ? 1 : 0;
        const hi = Math.min(upD - 1, limit);
        if (hi >= lo) {
          let ways = hi - lo + 1;
          for (let j = i + 1; j < prefLen; j++) ways *= limit + 1;
          res += ways;
        }
        if (upD > limit) {
          tight = false;
          break;
        }
      }
      if (tight && upperPref + s <= n) res += 1;
    }
    return res;
  }

  return count(finish.toString()) - count((start - 1).toString());
}

console.log(numberOfPowerfulIntV2(1, 6000, 4, "124")); // 5
console.log(numberOfPowerfulIntV2(15, 215, 6, "10")); // 2
```

## Related Problems

| Problem                                                                                                                         | Difficulty | Key Concept |
| ------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| [Count of Integers](https://leetcode.com/problems/count-of-integers/)                                                           | Hard       | Digit DP    |
| [Non-negative Integers without Consecutive Ones](https://leetcode.com/problems/non-negative-integers-without-consecutive-ones/) | Hard       | Digit DP    |
| [Numbers With Repeated Digits](https://leetcode.com/problems/numbers-with-repeated-digits/)                                     | Hard       | Digit DP    |
