---
layout: page
title: "Largest 3-Same-Digit Number in String"
difficulty: Easy
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/largest-3-same-digit-number-in-string"
---

# Largest 3-Same-Digit Number in String / Số 3 Chữ Số Giống Nhau Lớn Nhất Trong Chuỗi

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Linear Scan / Sliding Window
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Ví dụ thực tế:** Giống như đọc số trên biển số xe — bạn đang tìm biển có 3 chữ số liên tiếp giống nhau (như 888, 777...) và muốn tìm biển có số lớn nhất. Chỉ cần quét từ trái sang phải với cửa sổ 3 ký tự.

**Pattern Recognition:**

- Fixed window size 3 → check every consecutive triple in string
- "Good integer" = 3 identical digits → `s[i] === s[i+1] === s[i+2]`
- Muốn largest → so sánh lexicographically (digits → larger = bigger value)

**Visual:**

```
num = "6777133339"

i=0: "677" → 6≠7 → skip
i=1: "777" → 7==7==7 → ✓ candidate: "777"
i=2: "771" → 7≠1 → skip
i=3: "713" → skip
i=4: "133" → 1≠3 → skip
i=5: "333" → 3==3==3 → ✓ candidate: "333"
i=6: "333" → ✓ candidate: "333" (duplicate)
i=7: "339" → skip

Candidates: {"777", "333"}
Largest = "777" ✅

num = "2300019"
i=0: "230" → skip ... no triple found → return ""
```

## Problem Description

A **good integer** is a string of exactly 3 identical digits. Given a string `num`, find the **largest** good integer that is a substring of `num`. Return it, or `""` if none exists.

Examples: `"6777133339"` → `"777"` | `"2300019"` → `""` | `"42352338"` → `"333"`.

## 📝 Interview Tips

1. **Clarify**: Substring phải liên tiếp không? "Good" có thể overlap không? / Contiguous, overlaps are fine
2. **Approach**: Slide window of 3, check equality, track max / Single pass O(n)
3. **Edge cases**: No triple in string → return `""`; all same digit → return that digit × 3
4. **Optimize**: Already O(n) — check `s[i]===s[i+1]===s[i+2]` / Optimal single scan
5. **Follow-up**: Nếu k digits thay vì 3? → Generalize window size / Easy extension
6. **Complexity**: O(n) time, O(1) space / Optimal

## Solutions

```typescript
/** Solution 1: Linear Scan (Optimal)
 * Time: O(n) | Space: O(1)
 */
function largestGoodInteger(num: string): string {
  let result = "";

  for (let i = 0; i <= num.length - 3; i++) {
    if (num[i] === num[i + 1] && num[i + 1] === num[i + 2]) {
      const candidate = num.slice(i, i + 3);
      if (candidate > result) result = candidate;
    }
  }

  return result;
}

/** Solution 2: Collect all + find max
 * Time: O(n) | Space: O(n)
 */
function largestGoodIntegerCollect(num: string): string {
  const goods: string[] = [];

  for (let i = 0; i <= num.length - 3; i++) {
    if (num[i] === num[i + 1] && num[i + 1] === num[i + 2]) {
      goods.push(num[i].repeat(3));
    }
  }

  if (goods.length === 0) return "";
  return goods.reduce((max, cur) => (cur > max ? cur : max), "");
}

/** Solution 3: Regex-based
 * Time: O(n) | Space: O(n)
 */
function largestGoodIntegerRegex(num: string): string {
  const matches = num.match(/(\d)\1\1/g);
  if (!matches) return "";
  return matches.reduce((max, cur) => (cur > max ? cur : max), "");
}

// Tests
console.log(largestGoodInteger("6777133339")); // "777"
console.log(largestGoodInteger("2300019")); // ""
console.log(largestGoodInteger("42352338")); // "333"
console.log(largestGoodInteger("000")); // "000"
console.log(largestGoodIntegerCollect("6777133339")); // "777"
console.log(largestGoodIntegerRegex("42352338")); // "333"
```

## 🔗 Related Problems

| Problem                                                                                                                                      | Relationship                      |
| -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| [Count Substrings with K Frequency Characters](https://leetcode.com/problems/count-substrings-with-k-frequency-characters-i)                 | Substring frequency conditions    |
| [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters)               | Sliding window on characters      |
| [Check if a String Contains All Binary Codes of Size K](https://leetcode.com/problems/check-if-a-string-contains-all-binary-codes-of-size-k) | Fixed-size window substring check |
