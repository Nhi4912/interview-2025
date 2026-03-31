---
layout: page
title: "Unique Substrings in Wraparound String"
difficulty: Medium
category: Dynamic Programming
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/unique-substrings-in-wraparound-string"
---

# Unique Substrings in Wraparound String / Chuỗi Con Duy Nhất Trong Chuỗi Quay Vòng

🟡 Medium | DP on Characters | LeetCode 467

## 🧠 Intuition / Tư Duy

**Tiếng Việt:** Chuỗi vô hạn `s = "...abcdefghijklmnopqrstuvwxyz..."` quay vòng. Cho chuỗi `p`, đếm số chuỗi con duy nhất của `p` cũng là chuỗi con của `s`. Chìa khoá: một chuỗi con hợp lệ phải là chuỗi liên tiếp trong bảng chữ cái quay vòng. `dp[c]` = độ dài tối đa của chuỗi con hợp lệ kết thúc bằng ký tự c.

```
p = "zab"
s = "...xyzabc..."

Valid substrings: "z","a","b","za","ab","zab" → 6
But "b" from 3rd position = same as earlier "b" → count unique!

dp['z']=1, dp['a']=2 (za), dp['b']=3 (zab)
Answer = sum of dp values = 1+2+3 = 6
```

## Problem Description

`s` is an infinite wraparound string of `"abcdefghijklmnopqrstuvwxyz"` repeated. Given string `p`, return the number of **unique** non-empty substrings of `p` that are also substrings of `s`.

**Example 1:**

- Input: `p = "a"`
- Output: `1`

**Example 2:**

- Input: `p = "cac"`
- Output: `2` — only "a" and "c" are valid substrings of s

**Example 3:**

- Input: `p = "zab"`
- Output: `6` — "z","a","b","za","ab","zab"

## 📝 Interview Tips

- 🎯 **Key insight / Chìa khoá:** A substring of p is valid iff it's a consecutive sequence in the alphabet (circular). Track max length of valid run ending at each character
- 📊 **Counting trick / Mẹo đếm:** If dp[c] = k, it contributes k unique substrings (all lengths 1..k ending at c)
- 🔢 **Transition / Công thức:** If `p[i]` follows `p[i-1]` in circular alphabet, extend run; else reset to 1
- ⚡ **Complexity / Độ phức tạp:** O(n) time, O(26) space
- 🚫 **Duplicate counting / Tránh đếm trùng:** Only keep max length per ending character — duplicates are automatically excluded
- 💡 **Circular check / Kiểm tra vòng:** `(p[i].charCodeAt(0) - p[i-1].charCodeAt(0) + 26) % 26 === 1`

## Solutions

```typescript
/**
 * Approach 1: DP with per-character max length
 * Time: O(n)
 * Space: O(26) = O(1)
 *
 * dp[c] = max length of valid substring in p that ends with character c
 * For each position i, if p[i] extends the run from p[i-1], curLen++, else curLen=1
 * Update dp[p[i]] = max(dp[p[i]], curLen)
 * Answer = sum of all dp[c]
 */
function findSubstringInWraproundString(p: string): number {
  const dp = new Array(26).fill(0);
  let curLen = 0;

  for (let i = 0; i < p.length; i++) {
    const ci = p.charCodeAt(i) - 97; // 'a'=0
    if (i > 0) {
      const prev = p.charCodeAt(i - 1) - 97;
      // Check if current follows previous in circular alphabet
      if ((ci - prev + 26) % 26 === 1) {
        curLen++;
      } else {
        curLen = 1;
      }
    } else {
      curLen = 1;
    }
    dp[ci] = Math.max(dp[ci], curLen);
  }

  return dp.reduce((a, b) => a + b, 0);
}

console.log(findSubstringInWraproundString("a")); // 1
console.log(findSubstringInWraproundString("cac")); // 2
console.log(findSubstringInWraproundString("zab")); // 6
console.log(findSubstringInWraproundString("abcde")); // 15 (1+2+3+4+5)
```

```typescript
/**
 * Approach 2: Same logic with explicit run tracking
 * Time: O(n)
 * Space: O(26)
 */
function findSubstringInWraproundString2(p: string): number {
  if (!p.length) return 0;

  const maxLen = new Map<string, number>();
  let run = 1;

  // Initialize first character
  const first = p[0];
  maxLen.set(first, 1);

  for (let i = 1; i < p.length; i++) {
    const cur = p[i];
    const prev = p[i - 1];

    // 'a' follows 'z' (circular), otherwise must be consecutive
    const isConsec = cur.charCodeAt(0) - prev.charCodeAt(0) === 1 || (prev === "z" && cur === "a");

    run = isConsec ? run + 1 : 1;
    maxLen.set(cur, Math.max(maxLen.get(cur) ?? 0, run));
  }

  let total = 0;
  for (const v of maxLen.values()) total += v;
  return total;
}

console.log(findSubstringInWraproundString2("a")); // 1
console.log(findSubstringInWraproundString2("zab")); // 6
console.log(findSubstringInWraproundString2("cac")); // 2
```

```typescript
/**
 * Approach 3: Build unique set for small inputs (for understanding)
 * Time: O(n²) — only for verification/small inputs
 * Space: O(n²)
 */
function findSubstringInWraproundString3(p: string): number {
  const isValidSubstring = (sub: string): boolean => {
    for (let i = 1; i < sub.length; i++) {
      const diff = (sub.charCodeAt(i) - sub.charCodeAt(i - 1) + 26) % 26;
      if (diff !== 1) return false;
    }
    return true;
  };

  const unique = new Set<string>();
  for (let i = 0; i < p.length; i++) {
    for (let j = i + 1; j <= p.length; j++) {
      const sub = p.slice(i, j);
      if (isValidSubstring(sub)) unique.add(sub);
    }
  }
  return unique.size;
}

// Verify against O(n) solution for small cases
console.log(findSubstringInWraproundString3("zab")); // 6
console.log(findSubstringInWraproundString3("cac")); // 2
```

## 🔗 Related Problems

| Problem                                                                                                             | Difficulty | Key Concept       |
| ------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------- |
| [Distinct Subsequences](https://leetcode.com/problems/distinct-subsequences/)                                       | 🔴 Hard    | String DP         |
| [Count Different Palindromic Subsequences](https://leetcode.com/problems/count-different-palindromic-subsequences/) | 🔴 Hard    | String DP + Count |
| [Longest Common Subarray](https://leetcode.com/problems/maximum-length-of-repeated-subarray/)                       | 🟡 Medium  | String DP         |
| [Number of Distinct Substrings](https://leetcode.com/problems/number-of-distinct-substrings-in-a-string/)           | 🟡 Medium  | Suffix Array / DP |
