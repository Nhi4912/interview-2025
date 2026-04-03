---
layout: page
title: "Number of Subarrays That Match a Pattern I"
difficulty: Medium
category: String
tags: [Array, Rolling Hash, String Matching, Hash Function]
leetcode_url: "https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-i"
---

# Number of Subarrays That Match a Pattern I / Số Mảng Con Khớp Với Mẫu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Pattern Matching on Encoded Array
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Number of Subarrays That Match a Pattern II](https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-ii) | [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tìm chuỗi nhịp điệu trong âm nhạc — trước tiên encode mỗi cặp phần tử liên tiếp thành ký hiệu (tăng/giảm/bằng), sau đó tìm pattern trong chuỗi đã encode.

**Pattern Recognition:**

- Signal: "count subarrays matching a pattern of comparisons" → **Encode then match**
- Key insight: encode `nums` thành `encoded[i] = sign(nums[i+1] - nums[i])`, rồi tìm `pattern` trong `encoded`

**Visual — Encode and match:**

```
nums    = [1,2,1,2,3,1,1,3]
pattern = [1,1]   (both increasing)

encoded: sign(2-1)=1, sign(1-2)=-1, sign(2-1)=1, sign(3-2)=1,
         sign(1-3)=-1, sign(1-1)=0, sign(3-1)=1
encoded = [1,-1,1,1,-1,0,1]

Find [1,1] in encoded:
i=0: [1,-1] ≠ [1,1]
i=2: [1,1]  = [1,1] ✅
i=5: [0,1]  ≠ [1,1]

count = 1
```

---

## Problem Description

Given a 0-indexed integer array `nums` of size `n` and a 0-indexed integer array `pattern` of size `m` (values: 1=increasing, -1=decreasing, 0=equal), count subarrays of length `m+1` that match the pattern. ([LeetCode 3034](https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-i))

**Example 1:** `nums=[1,2,1,2,3], pattern=[1,1]` → `2` (subarrays [1,2,3] appears at index 2 & [1,2,3])
**Example 2:** `nums=[1,4,4,1,3,5,5,3], pattern=[1,0,-1]` → `2`

Constraints: `2 <= nums.length <= 100`, `1 <= pattern.length < nums.length`

---

## 📝 Interview Tips

1. **Clarify**: "pattern[i]=1 nghĩa là tăng nghiêm ngặt? hay tăng không nghiêm ngặt?" / 1=strictly greater, 0=equal, -1=strictly less
2. **Brute force**: "O(n·m) — với mỗi vị trí i, kiểm tra m phần tử → OK vì n ≤ 100" / Brute force is fine here
3. **Optimize**: "Encode array O(n) rồi dùng KMP O(n+m) → tổng O(n+m)" / KMP after encoding for Pattern II
4. **Edge cases**: "nums.length = m+1 → chỉ một subarray cần check; tất cả bằng nhau + pattern=[0,0,...]" / Single window
5. **Follow-up**: "Pattern II có n,m up to 10^6 → cần KMP" / This variant (n≤100) allows brute force
6. **Complexity**: "O(n·m) brute — n=100, m<100 → ≤10000 ops → fast enough" / O(n·m) acceptable here

---

## Solutions

```typescript
/** Encode comparison: 1 if a>b, -1 if a<b, 0 if equal */
function cmp(a: number, b: number): number {
  return a > b ? 1 : a < b ? -1 : 0;
}

/**
 * Solution 1: Brute force O(n·m)
 * Time: O(n · m) — for each starting position check m comparisons
 * Space: O(1) extra
 */
function countMatchingSubarrays(nums: number[], pattern: number[]): number {
  const n = nums.length;
  const m = pattern.length;
  let count = 0;

  for (let i = 0; i <= n - m - 1; i++) {
    let match = true;
    for (let j = 0; j < m; j++) {
      if (cmp(nums[i + j + 1], nums[i + j]) !== pattern[j]) {
        match = false;
        break;
      }
    }
    if (match) count++;
  }

  return count;
}

/**
 * Solution 2: Encode then KMP (optimal for large n)
 * Time: O(n + m) — encode O(n), KMP search O(n+m)
 * Space: O(n + m) — encoded array + failure function
 */
function countMatchingSubarraysKMP(nums: number[], pattern: number[]): number {
  // Encode nums to comparison array
  const encoded: number[] = [];
  for (let i = 1; i < nums.length; i++) encoded.push(cmp(nums[i], nums[i - 1]));

  const m = pattern.length;
  // Build KMP failure function for pattern
  const fail = new Array(m).fill(0);
  for (let i = 1, j = 0; i < m; i++) {
    while (j > 0 && pattern[i] !== pattern[j]) j = fail[j - 1];
    if (pattern[i] === pattern[j]) j++;
    fail[i] = j;
  }

  // KMP search
  let count = 0;
  for (let i = 0, j = 0; i < encoded.length; i++) {
    while (j > 0 && encoded[i] !== pattern[j]) j = fail[j - 1];
    if (encoded[i] === pattern[j]) j++;
    if (j === m) {
      count++;
      j = fail[j - 1];
    }
  }

  return count;
}

// === Test Cases ===
console.log(countMatchingSubarrays([1, 2, 1, 2, 3], [1, 1])); // → 2
console.log(countMatchingSubarrays([1, 4, 4, 1, 3, 5, 5, 3], [1, 0, -1])); // → 2
console.log(countMatchingSubarraysKMP([1, 2, 1, 2, 3], [1, 1])); // → 2
```
