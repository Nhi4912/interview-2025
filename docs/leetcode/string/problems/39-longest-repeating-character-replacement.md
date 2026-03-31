---
layout: page
title: "Longest Repeating Character Replacement"
difficulty: Medium
category: String
tags: [Hash Table, String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/longest-repeating-character-replacement"
---

# Longest Repeating Character Replacement / Thay Thế Ký Tự Để Chuỗi Đồng Nhất Dài Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📗 Tier 2 — Gặp ở 30+ companies (Google, Amazon, Meta)
> **See also**: [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters) | [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Cửa sổ trượt như khung nhìn di chuyển dọc chuỗi. Trong khung, ta cho phép thay tối đa `k` ký tự. Khung hợp lệ khi: `độ dài khung − tần suất ký tự nhiều nhất ≤ k`.

**Pattern Recognition:**

- Signal: "longest substring" + "at most k changes" → **Sliding Window**
- Điều kiện: `(r - l + 1) - maxFreq ≤ k` — số ký tự cần thay ≤ k
- `maxFreq` chỉ tăng (monotone trick) — window nhỏ hơn không thể cho kết quả tốt hơn

**Visual — `s="AABABBA", k=1`:**

```
A  A  B  A  B  B  A
L                    R  (expand right)

Window "AABAB": maxFreq(A)=3, len=5, replace=2 > k=1 → shrink L
Window "ABAB":  maxFreq(A)=2, len=4, replace=2 > k=1 → shrink L
Window "BABB":  maxFreq(B)=3, len=4, replace=1 = k   → valid ✅ ans=4
Window "ABBA":  maxFreq(B)=2, len=4, replace=2 > k=1 → shrink
Window "BBA":   maxFreq(B)=2, len=3, replace=1 = k   → valid, ans still 4
```

---

## Problem Description

Given a string `s` of uppercase letters and integer `k`, you may replace any character at most `k` times total. Return the length of the longest substring containing the same letter achievable after replacements. ([LeetCode 424](https://leetcode.com/problems/longest-repeating-character-replacement))

**Example 1:** `s="ABAB", k=2` → `4` (replace both B's → "AAAA")
**Example 2:** `s="AABABBA", k=1` → `4` ("AABA"→replace B→"AAAA")

**Constraints:** `1 ≤ s.length ≤ 10⁵`, uppercase English letters only, `0 ≤ k ≤ s.length`

---

## 📝 Interview Tips

1. **Clarify**: "Chỉ uppercase? k=0 cho kết quả gì?" / Only uppercase? What does k=0 mean? (longest run of same char)
2. **Key formula**: "`len - maxFreq ≤ k` là điều kiện cửa sổ hợp lệ" / The core invariant to maintain
3. **Monotone trick**: "maxFreq chỉ tăng — khi shrink không giảm maxFreq, cửa sổ giữ nguyên size" / maxFreq never decreases, window slides at fixed size
4. **Brute force**: "Thử mọi substring O(n²), mỗi lần tính freq O(26)" / Try all substrings O(n²)
5. **Edge cases**: "k=0 → longest run; k≥n → whole string; single character → n" / k=0 finds run, k≥n returns n
6. **Follow-up**: "Lowercase + uppercase → same logic with 52 buckets" / Works for any alphabet

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — all substrings
 * For each (l, r) pair, compute max frequency and check replacement count.
 * Time: O(n² × 26) ≈ O(n²) — n² substrings × O(26) max-freq lookup
 * Space: O(26) = O(1) — frequency map for 26 letters
 */
function characterReplacementBrute(s: string, k: number): number {
  let best = 0;
  for (let l = 0; l < s.length; l++) {
    const freq = new Array(26).fill(0);
    let maxF = 0;
    for (let r = l; r < s.length; r++) {
      freq[s.charCodeAt(r) - 65]++;
      maxF = Math.max(maxF, freq[s.charCodeAt(r) - 65]);
      if (r - l + 1 - maxF <= k) best = Math.max(best, r - l + 1);
    }
  }
  return best;
}

/**
 * Solution 2: Sliding Window with maxFreq monotone trick (Optimal)
 * Expand right pointer, track max frequency char in window.
 * maxFreq only increases (monotone) — when window is invalid, slide left by 1.
 * This means window size never shrinks, guaranteeing O(n) total moves.
 * Time: O(n) — each char enters and leaves window at most once
 * Space: O(26) = O(1) — fixed alphabet frequency array
 */
function characterReplacement(s: string, k: number): number {
  const freq = new Array(26).fill(0);
  const A = 65; // 'A'.charCodeAt(0)
  let l = 0;
  let maxFreq = 0; // monotone: tracks the best max frequency seen
  let best = 0;

  for (let r = 0; r < s.length; r++) {
    const ri = s.charCodeAt(r) - A;
    freq[ri]++;
    maxFreq = Math.max(maxFreq, freq[ri]);

    // If more than k replacements needed, slide window right (shrink from left)
    if (r - l + 1 - maxFreq > k) {
      freq[s.charCodeAt(l) - A]--;
      l++;
    }

    best = Math.max(best, r - l + 1);
  }

  return best;
}

// === Test Cases ===
console.log(characterReplacement("ABAB", 2)); // 4
console.log(characterReplacement("AABABBA", 1)); // 4
console.log(characterReplacement("AAAA", 0)); // 4
console.log(characterReplacement("ABCDE", 1)); // 2
console.log(characterReplacement("A", 0)); // 1
console.log(characterReplacementBrute("ABAB", 2)); // 4
console.log(characterReplacementBrute("AABABBA", 1)); // 4
```

---

## 🔗 Related Problems

| Problem                                                                                                                        | Pattern                  | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------------ | ------------------------ | ---------- |
| [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters) | Sliding window           | 🟡 Medium  |
| [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii)                                             | Sliding window + k flips | 🟡 Medium  |
| [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring)                                             | Sliding window minimum   | 🔴 Hard    |
| [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element)                 | Same window formula      | 🟡 Medium  |
