---
layout: page
title: "Minimum Swaps to Make Strings Equal"
difficulty: Medium
category: String
tags: [Math, String, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-swaps-to-make-strings-equal"
---

# Minimum Swaps to Make Strings Equal / Hoán Đổi Tối Thiểu Để Hai Chuỗi Bằng Nhau

> **Difficulty**: 🟡 Medium | **Category**: String | **Pattern**: Math + Greedy

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như hai hàng người cầm bảng 'x' hoặc 'y' — bạn chỉ cần đếm chỗ hai người cầm khác bảng nhau, rồi hoán đổi từng cặp một cách thông minh.

**Pattern Recognition:**

- Count of mismatches of type (x,y) and (y,x) → drives solution
- Pairs of same mismatch type cancel with 1 swap; mixed pairs need 2 swaps
- If total mismatches odd → impossible (-1)

**Visual:**

```
s1 = "xx"    s2 = "yy"
pos 0: (x,y) → xy_count=1
pos 1: (x,y) → xy_count=2

xy=2, yx=0  → 2/2 + 0/2 = 1 swap

s1 = "xy"    s2 = "yx"
pos 0: (x,y) → xy=1
pos 1: (y,x) → yx=1
xy=1, yx=1  → 0 + 0 + 2 (cross pair) = 2 swaps
```

## Problem Description

You have two strings `s1` and `s2` of equal length consisting only of `'x'` and `'y'`. In one swap you can choose two indices and swap the chars at those positions across either string. Return the minimum number of swaps to make `s1 == s2`, or `-1` if impossible.

**Example 1:** `s1="xx", s2="yy"` → `1` (swap s1[0] with s2[0])
**Example 2:** `s1="xy", s2="yx"` → `2`

**Constraints:** `1 <= s1.length <= 1000`, strings only contain `'x'` and `'y'`

## 📝 Interview Tips

1. **Clarify**: Can strings already be equal? (return 0)
2. **Approach**: Count mismatched-pair types; identical-type pairs resolved in 1 swap, cross-type pairs need 2
3. **Edge cases**: Odd total mismatches → -1 (impossible)
4. **Optimize**: O(n) single pass, O(1) space
5. **Follow-up**: What if more than 2 characters? (generalise counting)
6. **Complexity**: Time O(n), Space O(1)

## Solutions

```typescript
// Solution 1: Count Mismatches (Greedy Math) — Time: O(n) | Space: O(1)
function minimumSwap(s1: string, s2: string): number {
  let xy = 0; // s1[i]='x', s2[i]='y'
  let yx = 0; // s1[i]='y', s2[i]='x'

  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) {
      if (s1[i] === "x") xy++;
      else yx++;
    }
  }

  // If total mismatches is odd → impossible
  if ((xy + yx) % 2 !== 0) return -1;

  // Each pair of same type resolves in 1 swap
  // One xy + one yx cross-pair resolves in 2 swaps
  return Math.floor(xy / 2) + Math.floor(yx / 2) + (xy % 2) * 2;
}

// Solution 2: Simulation (Brute Force for small n) — Time: O(n^3) | Space: O(n)
function minimumSwapBrute(s1: string, s2: string): number {
  const arr1 = s1.split("");
  const arr2 = s2.split("");
  let swaps = 0;
  const n = arr1.length;

  // Collect mismatch positions
  const mismatches: number[] = [];
  for (let i = 0; i < n; i++) {
    if (arr1[i] !== arr2[i]) mismatches.push(i);
  }

  if (mismatches.length % 2 !== 0) return -1;

  let i = 0;
  while (i < mismatches.length) {
    const pos = mismatches[i];
    if (arr1[pos] === arr2[pos]) {
      i++;
      continue;
    }

    if (i + 1 < mismatches.length) {
      const pos2 = mismatches[i + 1];
      if (arr1[pos] === arr1[pos2] && arr2[pos] === arr2[pos2]) {
        // Same type pair → 1 swap
        [arr1[pos], arr2[pos]] = [arr2[pos], arr1[pos]];
        swaps++;
        i += 2;
      } else {
        // Cross pair → 2 swaps
        [arr1[pos], arr2[pos]] = [arr2[pos], arr1[pos]];
        swaps++;
        [arr1[pos2], arr2[pos2]] = [arr2[pos2], arr1[pos2]];
        swaps++;
        i += 2;
      }
    } else {
      return -1;
    }
  }
  return swaps;
}

// Tests
console.log(minimumSwap("xx", "yy")); // 1
console.log(minimumSwap("xy", "yx")); // 2
console.log(minimumSwap("xx", "xy")); // -1
console.log(minimumSwap("xxyy", "yyxx")); // 2
console.log(minimumSwap("", "")); // 0
```

## 🔗 Related Problems

| Problem                                                                                                             | Relationship                   |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| [Minimum Number of Moves to Seat Everyone](https://leetcode.com/problems/minimum-number-of-moves-to-seat-everyone/) | Greedy counting of mismatches  |
| [Couples Holding Hands](https://leetcode.com/problems/couples-holding-hands/)                                       | Minimum swaps to pair elements |
| [Minimum Swaps to Group All 1's Together](https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together/)    | Sliding window + swap counting |
