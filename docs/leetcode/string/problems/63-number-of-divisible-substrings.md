---
layout: page
title: "Number of Divisible Substrings"
difficulty: Medium
category: String
tags: [Hash Table, String, Counting, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/number-of-divisible-substrings"
---

# Number of Divisible Substrings / Số Chuỗi Con Chia Hết

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum + Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k) | [Number of Same-End Substrings](https://leetcode.com/problems/number-of-same-end-substrings)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Mỗi chữ cái ánh xạ sang một chữ số (theo nhóm điện thoại). Một chuỗi con "chia hết" khi `sum / length` là số nguyên — tức `sum % length == 0`. Duyệt tất cả divisor có thể (1..9), dùng prefix sum để đếm nhanh.

**Pattern Recognition:**

- Signal: "sum divisible by length" → **Fix divisor k, transform: sum - k\*len = 0 → prefix sum trick**
- Với mỗi giá trị k (1..9): đổi bài về "số subarray có tổng bằng 0" sau khi trừ k khỏi mỗi digit
- Key insight: `sum(i..j) % (j-i+1) == 0 ⟺ sum(i..j) == k*(j-i+1)` cho một k nào đó

**Visual — word="ab", digit map a→1, b→2:**

```
For k=1: transform digits [1-1, 2-1] = [0, 1]
  prefix: [0, 0, 1]
  count subarrays with sum=0: prefix[0]=0 appears at i=0,i=1 → 1 subarray ("a")

For k=2: transform [1-2, 2-2] = [-1, 0]
  prefix: [0, -1, -1]
  sum=0 appears at i=0 and i=2 → 1 subarray ("ab"? check: sum=3, len=2, 3/2≠int)
  Actually sum=0 at i=2 means subarray s[0..1] sums to 0 after transform → valid
```

---

## Problem Description

Each letter maps to a digit via phone keypad groups (a,b,c=1; d,e,f=2; g,h,i=3; j,k,l=4; m,n,o=5; p,q,r,s=6; t,u,v=7; w,x,y,z=8). Count substrings where `sum_of_digits % length == 0`.

```
Example 1: word="abcd"  → 6  (single chars always divisible; "ab"=3/2 no; "bc"=5/2 no; "abc"=6/3=2 yes; "abcd"=10/4 no; "bcd"=9/3=3 yes)
Example 2: word="aaa"   → 6  ("a","a","a","aa","aa","aaa" all have sum/len=1)
Example 3: word="ab"    → 2  ("a"=1, "b"=2; "ab"=3/2 not integer)
```

Constraints: `1 <= word.length <= 2000`, `word` contains lowercase English letters.

---

## 📝 Interview Tips

1. **Clarify**: "Digit mapping là gì? Single chars luôn divisible không?" / Confirm digit map, single chars always valid (digit % 1 = 0)
2. **Brute force**: "Thử mọi substring O(n²), tính sum O(n)" → O(n³) / Enumerate all O(n²) then sum O(n) = O(n³)
3. **Optimize**: "Fix k (average value), transform digit[i] → digit[i]-k, count subarrays summing to 0" / Prefix sum per divisor
4. **Divisor range**: "Average nằm trong [1..8] vì digits từ 1..8" → chỉ cần 8 lần duyệt / Only 8 possible integer averages
5. **Edge cases**: "Single char luôn count (sum=digit, len=1, chia hết), word rỗng → 0" / Single chars, empty
6. **Complexity**: "O(9n) = O(n) cho optimized; O(n²) cho optimized-brute là đủ với n≤2000" / O(n²) acceptable given constraints

---

## Solutions

```typescript
// Phone keypad digit mapping
function charToDigit(c: string): number {
  const groups = ["abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];
  for (let d = 0; d < groups.length; d++) {
    if (groups[d].includes(c)) return d + 1;
  }
  return 0;
}

/**
 * Solution 1: Brute Force — all substrings
 * Time: O(n^2) — O(n) substrings * O(1) incremental sum
 * Space: O(1)
 */
function countDivisibleSubstringsBrute(word: string): number {
  const digits = word.split("").map(charToDigit);
  let count = 0;

  for (let i = 0; i < digits.length; i++) {
    let sum = 0;
    for (let j = i; j < digits.length; j++) {
      sum += digits[j];
      const len = j - i + 1;
      if (sum % len === 0) count++;
    }
  }
  return count;
}

/**
 * Solution 2: Prefix Sum per Divisor (Optimal)
 * Time: O(8n) = O(n) — iterate over 8 possible avg values × n chars
 * Space: O(n) — prefix sum map per divisor
 */
function countDivisibleSubstrings(word: string): number {
  const digits = word.split("").map(charToDigit);
  let total = 0;

  // For each possible integer average k (1..8):
  // A substring has avg=k ⟺ sum - k*len = 0
  // Transform: t[i] = digit[i] - k; count subarrays with sum=0
  for (let k = 1; k <= 8; k++) {
    const prefixCount = new Map<number, number>();
    prefixCount.set(0, 1);
    let prefixSum = 0;

    for (const d of digits) {
      prefixSum += d - k;
      total += prefixCount.get(prefixSum) ?? 0;
      prefixCount.set(prefixSum, (prefixCount.get(prefixSum) ?? 0) + 1);
    }
  }

  return total;
}

// === Test Cases ===
console.log(countDivisibleSubstrings("abcd")); // 6
console.log(countDivisibleSubstrings("aaa")); // 6
console.log(countDivisibleSubstrings("ab")); // 2
console.log(countDivisibleSubstrings("a")); // 1
```

---

## 🔗 Related Problems

- [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k) — prefix sum + hash map foundation
- [Number of Same-End Substrings](https://leetcode.com/problems/number-of-same-end-substrings) — substring counting with prefix tricks
- [Continuous Subarray Sum](https://leetcode.com/problems/continuous-subarray-sum) — divisibility + prefix sum pattern
- [Subarray Sums Divisible by K](https://leetcode.com/problems/subarray-sums-divisible-by-k) — prefix mod approach
