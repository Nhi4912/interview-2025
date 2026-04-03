---
layout: page
title: "Get Equal Substrings Within Budget"
difficulty: Medium
category: Sorting-Searching
tags: [String, Binary Search, Sliding Window, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/get-equal-substrings-within-budget"
---

# Get Equal Substrings Within Budget / Chuỗi Con Tương Đương Trong Ngân Sách

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Maximize the Confusion of an Exam](https://leetcode.com/problems/maximize-the-confusion-of-an-exam) | [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như mua quà tặng trong ngân sách — mỗi ký tự cần "chi phí" `|s[i]-t[i]|` để chuyển đổi. Cửa sổ trượt tối đa hóa số ký tự mua được mà không vượt quá ngân sách `maxCost`.

**Pattern Recognition:**

- Signal: "max length substring with constraint sum <= maxCost" → Sliding Window variable-size
- Key insight: cost[i] = |s[i]-t[i]|; maximize window where sum(cost[l..r]) <= maxCost

**Visual — Get Equal Substrings example:**

```
s = "abcd", t = "bcdf", maxCost = 3
cost = [|a-b|, |b-c|, |c-d|, |d-f|] = [1, 1, 1, 2]

Sliding window:
  l=0,r=0: sum=1 ≤ 3 ✓  window=1
  l=0,r=1: sum=2 ≤ 3 ✓  window=2
  l=0,r=2: sum=3 ≤ 3 ✓  window=3
  l=0,r=3: sum=5 > 3 ✗ → shrink: l=1, sum=4 > 3 → l=2, sum=3 ✓ window=2

maxWindow = 3
```

---

## Problem Description

You are given two strings `s` and `t` of equal length and an integer `maxCost`. The cost of changing `s[i]` to `t[i]` is `|s[i] - t[i]|`. Return the **maximum length** of a substring of `s` that can be changed to the corresponding substring of `t` with a total cost ≤ `maxCost`.

Difficulty: Medium | Acceptance: 59.0%

```
Example 1:
  Input:  s = "abcd", t = "bcdf", maxCost = 3
  Output: 3

Example 2:
  Input:  s = "abcd", t = "cdef", maxCost = 3
  Output: 1

Example 3:
  Input:  s = "abcd", t = "acde", maxCost = 0
  Output: 1
```

Constraints:

- `1 <= s.length <= 10^5`
- `t.length == s.length`
- `0 <= maxCost <= 10^6`
- `s` and `t` consist of lowercase English letters

---

## 📝 Interview Tips

1. **Clarify**: "Cost là |s[i]-t[i]| về ASCII, không phải về alphabet distance?" / Cost is absolute ASCII difference.
2. **Pre-compute costs**: "Tính mảng cost[] trước cho rõ ràng" / Pre-compute cost array for clarity.
3. **Sliding window pattern**: "Expand right, shrink left khi sum > maxCost" / Classic variable-window: expand right, shrink left on violation.
4. **No reset needed**: "Left chỉ tăng, không reset về 0 — O(n) tổng cộng" / Left pointer only moves forward → O(n) total.
5. **Edge cases**: "maxCost=0 → chỉ vị trí s[i]==t[i]; maxCost rất lớn → cả chuỗi" / maxCost=0 means only positions where s[i]==t[i].
6. **Follow-up**: "Prefix sum + binary search cũng hoạt động O(n log n)" / Prefix sum + binary search is an alternative O(n log n) approach.

---

## Solutions

```typescript
/**
 * Solution 1: Sliding Window (variable size)
 * Time: O(n) — each index visited at most twice
 * Space: O(n) — cost array (can be O(1) if computed inline)
 */
function equalSubstring(s: string, t: string, maxCost: number): number {
  const n = s.length;
  const cost = Array.from({ length: n }, (_, i) => Math.abs(s.charCodeAt(i) - t.charCodeAt(i)));

  let left = 0,
    currCost = 0,
    maxLen = 0;
  for (let right = 0; right < n; right++) {
    currCost += cost[right];
    while (currCost > maxCost) {
      currCost -= cost[left];
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}

/**
 * Solution 2: Sliding Window inline (no cost array)
 * Time: O(n)
 * Space: O(1)
 */
function equalSubstringO1Space(s: string, t: string, maxCost: number): number {
  let left = 0,
    currCost = 0,
    maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    currCost += Math.abs(s.charCodeAt(right) - t.charCodeAt(right));
    while (currCost > maxCost) {
      currCost -= Math.abs(s.charCodeAt(left) - t.charCodeAt(left));
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}

/**
 * Solution 3: Prefix Sum + Binary Search
 * Time: O(n log n)
 * Space: O(n)
 */
function equalSubstringBinSearch(s: string, t: string, maxCost: number): number {
  const n = s.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + Math.abs(s.charCodeAt(i) - t.charCodeAt(i));
  }

  let maxLen = 0;
  for (let right = 1; right <= n; right++) {
    // Binary search for leftmost l such that prefix[right] - prefix[l] <= maxCost
    let lo = 0,
      hi = right;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (prefix[right] - prefix[mid] <= maxCost) hi = mid;
      else lo = mid + 1;
    }
    maxLen = Math.max(maxLen, right - lo);
  }
  return maxLen;
}

// === Test Cases ===
console.log(equalSubstring("abcd", "bcdf", 3)); // 3
console.log(equalSubstring("abcd", "cdef", 3)); // 1
console.log(equalSubstring("abcd", "acde", 0)); // 1
console.log(equalSubstringO1Space("abcd", "bcdf", 3)); // 3
console.log(equalSubstringBinSearch("abcd", "bcdf", 3)); // 3
```

---

## 🔗 Related Problems

- [Maximize the Confusion of an Exam](https://leetcode.com/problems/maximize-the-confusion-of-an-exam) — sliding window with replacement budget
- [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii) — sliding window with k flips
- [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum) — min window with sum constraint
- [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k) — sliding window count
- [Get Equal Substrings Within Budget — LeetCode](https://leetcode.com/problems/get-equal-substrings-within-budget) — problem page
