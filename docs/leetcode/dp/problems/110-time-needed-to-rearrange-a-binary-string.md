---
layout: page
title: "Time Needed to Rearrange a Binary String"
difficulty: Medium
category: Dynamic Programming
tags: [String, Dynamic Programming, Simulation]
leetcode_url: "https://leetcode.com/problems/time-needed-to-rearrange-a-binary-string"
---

# Time Needed to Rearrange a Binary String / Thời Gian Cần Thiết Để Sắp Xếp Lại Chuỗi Nhị Phân

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DP / Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Như bong bóng nổi lên trong nước — mỗi số 1 "nổi" sang trái qua các số 0. Nhiều số 1 không thể vượt qua nhau, nên số 1 thứ k phải chờ số 1 thứ (k-1) đi trước.

**Pattern Recognition:**

- Signal: "01 swaps simultaneously each second" → DP tracking time for each '1' to bubble left
- Each '1' must pass all '0's to its left; can't go faster than the '1' behind it
- `time[k] = max(zeros_before_k-th_one, time[k-1] + 1)`

**Visual:**

```
s = "0110100"  → s[0..6] = 0,1,1,0,1,0,0
1st '1' (pos 1): 1 zero to left → time = 1
2nd '1' (pos 2): 1 zero to left, but behind 1st '1' → max(1, 1+1) = 2
3rd '1' (pos 4): 2 zeros to left → max(2, 2+1) = 3
Answer: 3
```

## Problem Description

Each second, every occurrence of `"01"` in `s` is simultaneously replaced by `"10"`. Return the number of seconds until no more swaps are possible (string is sorted).

- Example 1: `s = "0110101"` → `4`
- Example 2: `s = "11100"` → `0`
- Constraints: `1 ≤ s.length ≤ 10^5`, `s[i] ∈ {'0','1'}`

## 📝 Interview Tips

1. **Clarify**: Tất cả swap xảy ra đồng thời mỗi giây? / All swaps happen simultaneously each second? (Yes)
2. **Approach**: DP — mỗi số 1 cần thời gian dựa trên số 0 bên trái và số 1 trước đó / track per-'1' bubble time
3. **Edge cases**: No '0's → 0 seconds; no '1's → 0; already sorted → 0
4. **Optimize**: Single O(n) pass with two counters: zeros seen and prevTime
5. **Test**: "0110100" → 3; "11100" → 0; "0001" → 3
6. **Follow-up**: What if we swap "10" → "01" instead (bubbling right)?

## Solutions

```typescript
/** Solution 1: DP with running counters — O(n)
 * Time: O(n) | Space: O(1)
 * For each '1', its time = max(zeros_seen, prevTime + 1)
 */
function secondsToRemoveOccurrences(s: string): number {
  let prevTime = 0;
  let zeros = 0;

  for (const c of s) {
    if (c === "0") {
      zeros++;
    } else if (zeros > 0) {
      // This '1' needs to bubble past 'zeros' zeros
      // But can't go before the previous '1' finishes (+1 gap needed)
      prevTime = Math.max(zeros, prevTime + 1);
    }
  }

  return prevTime;
}

/** Solution 2: Simulation — direct step-by-step (O(n * T))
 * Time: O(n * T) where T = answer | Space: O(n)
 * Good for understanding; correct but slower
 */
function secondsToRemoveOccurrences2(s: string): number {
  let arr = s.split("");
  let steps = 0;

  while (true) {
    const next = [...arr];
    let changed = false;

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === "0" && arr[i + 1] === "1") {
        next[i] = "1";
        next[i + 1] = "0";
        changed = true;
        i++; // skip next position (already processed pair)
      }
    }

    if (!changed) break;
    arr = next;
    steps++;
  }

  return steps;
}

/** Solution 3: Prefix-sum based calculation
 * Time: O(n) | Space: O(n)
 * For each '1' at position i, compute its final position = i - (zeros before it)
 * Then time = max over all '1's of how long it takes considering blocking
 */
function secondsToRemoveOccurrences3(s: string): number {
  const n = s.length;
  // Count zeros up to each position
  const prefixZeros = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefixZeros[i + 1] = prefixZeros[i] + (s[i] === "0" ? 1 : 0);
  }

  let res = 0;
  let prevTime = 0;
  for (let i = 0; i < n; i++) {
    if (s[i] === "1") {
      const zerosLeft = prefixZeros[i]; // zeros to the left of this '1'
      if (zerosLeft > 0) {
        prevTime = Math.max(zerosLeft, prevTime + 1);
        res = Math.max(res, prevTime);
      }
    }
  }

  return res;
}

// Tests
console.log(secondsToRemoveOccurrences("0110101")); // 4
console.log(secondsToRemoveOccurrences("11100")); // 0
console.log(secondsToRemoveOccurrences("0001")); // 3
console.log(secondsToRemoveOccurrences("0110100")); // 3
console.log(secondsToRemoveOccurrences2("0110101")); // 4
console.log(secondsToRemoveOccurrences3("0110101")); // 4
```

## 🔗 Related Problems

| Problem                                                                                                                                          | Relationship            |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| [Minimum Adjacent Swaps to Reach the Kth Smallest Number](https://leetcode.com/problems/minimum-adjacent-swaps-to-reach-the-kth-smallest-number) | Adjacent swap counting  |
| [Minimum Moves to Equal Array Elements](https://leetcode.com/problems/minimum-moves-to-equal-array-elements)                                     | Count-based movement DP |
| [Wildcard Matching](https://leetcode.com/problems/wildcard-matching)                                                                             | String DP               |
