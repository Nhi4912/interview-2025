---
layout: page
title: "Number of Substrings With Fixed Ratio"
difficulty: Medium
category: String
tags: [Hash Table, Math, String, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/number-of-substrings-with-fixed-ratio"
---

# Number of Substrings With Fixed Ratio / Số Xâu Con Với Tỷ Lệ Cố Định

🟡 Medium

## 🧠 Intuition

> **Phép so sánh:** Giống đếm số cặp học sinh trong hàng có cùng điểm trung bình — bài toán quy về "tìm số cặp (i, j) với prefix[j] - prefix[i] = constant" — dùng hash map đếm.

```
s="0110011", num1=1, num2=2
Target: count(0)/count(1) = 1/2

Transform: for each char, running score = (char=='0' ? num2 : -num1)
 When score at j equals score at i (plus initial offset), substring [i+1..j] has ratio num1:num2

i:  0  1  2  3  4  5  6
s:  0  1  1  0  0  1  1
sc: 2 -1 -1  2  2 -1 -1  (0→+2, 1→-1, for num1=1,num2=2)
ps: 0  2  1  0  2  4  3  2  (prefix sums)

For each ps[j], count how many times ps[i]==ps[j] appeared before → add to answer
```

## Problem Description

Given binary string `s` and integers `num1`, `num2`, return the number of **non-empty** substrings where `count('0') / count('1') == num1 / num2`.

**Example 1:** `s="0110011"`, `num1=1`, `num2=2` → `4`

**Example 2:** `s="10101"`, `num1=3`, `num2=1` → `0`

**Constraints:** `1 <= s.length <= 10^4`, `1 <= num1, num2 <= 10^5`

## 📝 Interview Tips

- **Transform to prefix sum:** `count('0')/count('1') = num1/num2` ⟺ `count('0')*num2 - count('1')*num1 = 0`
- **Score per char:** Assign `+num2` for `'0'`, `-num1` for `'1'`; valid substring = prefix sum difference = 0
- **Hash map counts:** `seen[prefixSum]` = how many times this sum appeared → directly gives count of valid endings
- **Initialize:** `seen[0] = 1` to handle substrings starting from index 0
- **Complexity:** O(n) time, O(n) space
- **Interview insight:** This is the classic "subarray sum equals k" pattern dressed in ratio clothing

## Solutions

### Solution 1: Prefix sum + hash map — O(n) time, O(n) space

```typescript
function fixedRatio(s: string, num1: number, num2: number): number {
  // For substring [i..j]: count0*num2 == count1*num1
  // Assign score: '0' → +num2, '1' → -num1
  // Valid iff prefix[j+1] - prefix[i] == 0, i.e., prefix[j+1] == prefix[i]

  const seen = new Map<number, number>();
  seen.set(0, 1);

  let prefixScore = 0;
  let result = 0;

  for (const ch of s) {
    prefixScore += ch === "0" ? num2 : -num1;
    result += seen.get(prefixScore) ?? 0;
    seen.set(prefixScore, (seen.get(prefixScore) ?? 0) + 1);
  }

  return result;
}
```

### Solution 2: Brute force O(n²) — for reference/fallback

```typescript
function fixedRatio(s: string, num1: number, num2: number): number {
  const n = s.length;
  let count = 0;

  for (let i = 0; i < n; i++) {
    let zeros = 0,
      ones = 0;
    for (let j = i; j < n; j++) {
      if (s[j] === "0") zeros++;
      else ones++;
      // zeros/ones == num1/num2 ⟺ zeros*num2 == ones*num1
      if (zeros * num2 === ones * num1) count++;
    }
  }

  return count;
}
```

### Solution 3: GCD-reduced ratio — O(n) time, O(n) space

```typescript
function fixedRatio(s: string, num1: number, num2: number): number {
  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }
  const g = gcd(num1, num2);
  const r1 = num1 / g,
    r2 = num2 / g;
  // Each '0' contributes +r2, each '1' contributes -r1 to balance score
  const seen = new Map<number, number>([[0, 1]]);
  let ps = 0,
    ans = 0;

  for (const ch of s) {
    ps += ch === "0" ? r2 : -r1;
    ans += seen.get(ps) ?? 0;
    seen.set(ps, (seen.get(ps) ?? 0) + 1);
  }

  return ans;
}
```

## 🔗 Related Problems

| #    | Problem                               | Difficulty | Tags                   |
| ---- | ------------------------------------- | ---------- | ---------------------- |
| 560  | Subarray Sum Equals K                 | Medium     | Prefix Sum, Hash Table |
| 525  | Contiguous Array                      | Medium     | Prefix Sum, Hash Table |
| 1248 | Count Number of Nice Subarrays        | Medium     | Prefix Sum             |
| 2489 | Number of Substrings With Fixed Ratio | Medium     | Prefix Sum             |
