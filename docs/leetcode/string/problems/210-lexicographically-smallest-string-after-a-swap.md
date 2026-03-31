---
layout: page
title: "Lexicographically Smallest String After a Swap"
difficulty: Easy
category: String
tags: [String, Greedy]
leetcode_url: "https://leetcode.com/problems/lexicographically-smallest-string-after-a-swap"
---

# Lexicographically Smallest String After a Swap / Chuỗi Nhỏ Nhất Về Mặt Từ Điển Sau Một Lần Hoán Đổi

> **Difficulty**: 🟢 Easy | **Category**: String | **Pattern**: Greedy

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như sắp xếp số nhà trên phố — tìm vị trí đầu tiên mà số nhà lớn hơn số nhà kế tiếp và cùng chẵn/lẻ, thì hoán đổi để giảm nhỏ nhất.

**Pattern Recognition:**

- "Lexicographically smallest" → greedy: find leftmost position to improve
- Adjacent swap with same parity constraint limits options
- First improvement found → apply and stop

**Visual:**

```
s = "4 5 3 2"
       ↑
pos 1: s[1]=5, s[2]=3, same parity (odd)? 5%2=1, 3%2=1 ✓, 5>3 → swap!
result: "4 3 5 2"

s = "1 3 5 7"
pos 0: 1<3 → no improvement
pos 1: 3<5 → no improvement
pos 2: 5<7 → no improvement
→ no swap, return original
```

## Problem Description

Given a numeric string `s`, you may perform **at most one swap** of two adjacent digits that have the **same parity** (both odd or both even). Return the lexicographically smallest string possible.

**Example 1:** `s = "45320"` → `"43520"` (swap index 1 and 2: '5' and '3', both odd)
**Example 2:** `s = "001"` → `"001"` (no beneficial same-parity adjacent swap)

**Constraints:** `2 <= s.length <= 100`, `s` consists of digits only, no leading zeros except `s="0"`

## 📝 Interview Tips

1. **Clarify**: At most one swap — can also choose to skip if no improvement exists
2. **Approach**: Scan left to right; find first adjacent pair where left > right and same parity → swap
3. **Edge cases**: Already sorted; all digits different parity; single possible swap
4. **Optimize**: Single O(n) scan suffices
5. **Follow-up**: What if you can swap any two same-parity digits (not just adjacent)?
6. **Complexity**: Time O(n), Space O(n) for string conversion

## Solutions

```typescript
// Solution 1: Greedy First-Improvement Scan — Time: O(n) | Space: O(n)
function getSmallestString(s: string): string {
  const arr = s.split("");
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    const a = parseInt(arr[i]);
    const b = parseInt(arr[i + 1]);
    // Same parity and left digit is larger → swap for improvement
    if (a % 2 === b % 2 && a > b) {
      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      return arr.join("");
    }
  }

  return s; // No beneficial swap found
}

// Solution 2: Explicit Comparison — Time: O(n) | Space: O(n)
function getSmallestString2(s: string): string {
  for (let i = 0; i < s.length - 1; i++) {
    const d1 = s.charCodeAt(i) - 48;
    const d2 = s.charCodeAt(i + 1) - 48;

    if ((d1 & 1) === (d2 & 1) && d1 > d2) {
      // Swap using string slicing
      return s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2);
    }
  }
  return s;
}

// Solution 3: Generate All & Pick Min (Brute Force) — Time: O(n^2) | Space: O(n)
function getSmallestString3(s: string): string {
  let result = s;

  for (let i = 0; i < s.length - 1; i++) {
    const d1 = parseInt(s[i]);
    const d2 = parseInt(s[i + 1]);

    if (d1 % 2 === d2 % 2) {
      const swapped = s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2);
      if (swapped < result) result = swapped;
    }
  }

  return result;
}

// Tests
console.log(getSmallestString("45320")); // "43520"
console.log(getSmallestString("001")); // "001"
console.log(getSmallestString("28")); // "28" (both even but 2<8, no improvement)
console.log(getSmallestString("82")); // "28"
console.log(getSmallestString("1234")); // "1234" (no same-parity adjacent improvement)
```

## 🔗 Related Problems

| Problem                                                                                                                     | Relationship                         |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [Largest Number After Digit Swaps by Parity](https://leetcode.com/problems/largest-number-after-digit-swaps-by-parity/)     | Same parity swap, maximize instead   |
| [Minimum Adjacent Swaps to Make a Valid Array](https://leetcode.com/problems/minimum-adjacent-swaps-to-make-a-valid-array/) | Adjacent swap greedy                 |
| [Orderly Queue](https://leetcode.com/problems/orderly-queue/)                                                               | Lexicographic optimization via swaps |
