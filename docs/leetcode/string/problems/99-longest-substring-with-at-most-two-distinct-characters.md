---
layout: page
title: "Longest Substring with At Most Two Distinct Characters"
difficulty: Medium
category: String
tags: [Hash Table, String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters"
---

# Longest Substring with At Most Two Distinct Characters / Chuỗi Con Dài Nhất Với Tối Đa Hai Ký Tự Phân Biệt

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words) | [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống cửa sổ trượt trên bảng ký tự — mở rộng sang phải khi window còn hợp lệ (≤2 ký tự phân biệt), thu hẹp từ trái khi vi phạm. Luôn cập nhật kết quả sau mỗi bước.

```
s = "eceba"

L=0  R=0: {e:1}           len=1
L=0  R=1: {e:1,c:1}       len=2
L=0  R=2: {e:2,c:1}       len=3
L=0  R=3: {e:2,c:1,b:1}   size=3! shrink:
  remove s[0]='e' → {e:1,c:1,b:1} still 3, keep shrinking
  remove s[1]='c' → {e:1,b:1}     size=2 ✓  L=2
L=2  R=3: {e:1,b:1}       len=2
L=2  R=4: {e:1,b:1,a:1}   size=3, shrink...

maxLen = 3 ("ece")
```

---

## Problem Description

Given a string `s`, return the length of the **longest substring** that contains **at most two distinct characters**.

**Example 1:** `s="eceba"` → `3` (substring `"ece"`)
**Example 2:** `s="ccaabbb"` → `5` (substring `"aabbb"`)

Constraints: `0 ≤ s.length ≤ 10^5`

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "At most 2, hay exactly 2?" / At most 2 (includes substrings with 1 distinct char)
2. **Generalize / Tổng quát hóa**: Bài này là special case của "at most K distinct" — code với K=2 để dễ mở rộng
3. **Brute force / Vét cạn**: O(n²) check all substrings — optimize to O(n) sliding window
4. **Key state / Trạng thái**: frequency map + window size; shrink when map.size > 2
5. **Edge cases / Trường hợp đặc biệt**: Empty string → 0; all same char → n; 1 char → 1
6. **Follow-up / Hỏi thêm**: "At most K distinct?" / Same code, change `2` to `k` (LeetCode 340)

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(n²) — check all substrings
 * Space: O(1) — fixed alphabet size
 */
function lengthOfLongestSubstringTwoDistinctBrute(s: string): number {
  let maxLen = 0;
  for (let i = 0; i < s.length; i++) {
    const seen = new Set<string>();
    for (let j = i; j < s.length; j++) {
      seen.add(s[j]);
      if (seen.size > 2) break;
      maxLen = Math.max(maxLen, j - i + 1);
    }
  }
  return maxLen;
}
console.log(lengthOfLongestSubstringTwoDistinctBrute("eceba")); // 3
console.log(lengthOfLongestSubstringTwoDistinctBrute("ccaabbb")); // 5

/**
 * Solution 2: Sliding Window with frequency map (Optimal)
 * Time: O(n) — each char added/removed at most once
 * Space: O(1) — at most 3 entries in map before shrinking
 */
function lengthOfLongestSubstringTwoDistinct(s: string): number {
  const freq = new Map<string, number>();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    freq.set(ch, (freq.get(ch) ?? 0) + 1);

    // Shrink window until at most 2 distinct characters
    while (freq.size > 2) {
      const leftChar = s[left];
      freq.set(leftChar, freq.get(leftChar)! - 1);
      if (freq.get(leftChar) === 0) freq.delete(leftChar);
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}

console.log(lengthOfLongestSubstringTwoDistinct("eceba")); // 3
console.log(lengthOfLongestSubstringTwoDistinct("ccaabbb")); // 5
console.log(lengthOfLongestSubstringTwoDistinct("")); // 0
console.log(lengthOfLongestSubstringTwoDistinct("a")); // 1
console.log(lengthOfLongestSubstringTwoDistinct("abcabcabc")); // 2
```

---

## 🔗 Related Problems

| Problem                                                                                                                                    | Pattern        | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------------------------ | -------------- | ---------- |
| [Longest Substring with At Most K Distinct Characters](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters) | Sliding Window | Medium     |
| [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters)             | Sliding Window | Medium     |
| [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement)                           | Sliding Window | Medium     |
| [Fruit Into Baskets](https://leetcode.com/problems/fruit-into-baskets)                                                                     | Sliding Window | Medium     |
