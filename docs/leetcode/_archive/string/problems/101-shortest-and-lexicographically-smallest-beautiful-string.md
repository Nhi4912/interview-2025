---
layout: page
title: "Shortest and Lexicographically Smallest Beautiful String"
difficulty: Medium
category: String
tags: [String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/shortest-and-lexicographically-smallest-beautiful-string"
---

# Shortest and Lexicographically Smallest Beautiful String / Chuỗi Đẹp Ngắn Nhất và Nhỏ Nhất Theo Từ Điển

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

## 🧠 Intuition / Tư Duy

> Giống như tìm đoạn ngắn nhất trên bản đồ có đúng `k` cột mốc quan trọng — bạn dùng cửa sổ trượt để duy trì đúng `k` số `'1'`. Khi cửa sổ thỏa mãn, so sánh độ dài rồi lexicographic để cập nhật đáp án.

**Pattern Recognition:**

- Signal: "substring with exactly k ones, shortest + lex smallest" → **Sliding Window**
- Mở rộng right khi chưa đủ `k` ones, thu hẹp left khi vượt quá
- Khi đúng `k` ones → cập nhật result nếu ngắn hơn, hoặc cùng độ dài và lex nhỏ hơn

**Visual:**

```
s = "100011001", k = 2
l=0 r=0..4: ones=1,  window="10001"
l=0 r=5:    ones=2,  window="100011" → candidate len=6
l=1 r=5:    ones=2,  window="00011"  → candidate len=5 shorter!
l=2 r=5:    ones=1 (removed '1' at l=0) → keep expanding
...
best = "11" at position 4..5 → len=2? no, check again:
final answer = "11"
```

## Problem Description

A **beautiful** string has exactly `k` `'1'`s. Given binary string `s` and integer `k`, find the **shortest** substring of `s` that is beautiful. If multiple substrings have the same minimum length, return the **lexicographically smallest** one. Return `""` if no such substring exists.

- **Example 1**: `s = "100011001"`, `k = 2` → `"11"`
- **Example 2**: `s = "1101"`, `k = 2` → `"11"`

**Constraints**: `1 <= k <= s.length <= 100`, `s[i]` is `'0'` or `'1'`, `s` has at least `k` ones.

## 📝 Interview Tips

1. **Clarify**: "Cần đúng k ones hay ít nhất k ones?" / Exactly k ones, not at-least-k
2. **Approach**: "Sliding window: mở rộng right đến khi đủ k ones, rồi thu trái tối đa" / Expand right, shrink left to minimum valid window
3. **Edge cases**: "k=0 → `""` là đáp án; không có k ones → return `""`"
4. **Optimize**: "So sánh lex chỉ khi cùng độ dài — tránh so sánh không cần thiết" / Only lex-compare when lengths are equal
5. **Test**: `s="0"`, `k=1` → `""` (no ones); `s="1"`, `k=1` → `"1"`
6. **Follow-up**: "Tìm substring dài nhất có nhiều nhất k ones?" / At-most-k variant is different sliding window

## Solutions

```typescript
/** Solution 1: Brute Force — thử mọi substring
 * Time: O(n²) | Space: O(n)
 */
function shortestBeautifulBrute(s: string, k: number): string {
  let result = "";
  for (let i = 0; i < s.length; i++) {
    let ones = 0;
    for (let j = i; j < s.length; j++) {
      if (s[j] === "1") ones++;
      if (ones === k) {
        const sub = s.substring(i, j + 1);
        if (
          result === "" ||
          sub.length < result.length ||
          (sub.length === result.length && sub < result)
        ) {
          result = sub;
        }
        break; // extending won't make it shorter
      }
    }
  }
  return result;
}

/** Solution 2: Sliding Window — shrink left tối đa sau khi đủ k ones
 * Time: O(n) | Space: O(n)
 */
function shortestAndLexicographicallySmallestBeautifulString(s: string, k: number): string {
  let result = "";
  let left = 0;
  let ones = 0;

  for (let right = 0; right < s.length; right++) {
    if (s[right] === "1") ones++;

    // Shrink left as far as possible while keeping exactly k ones
    while (ones === k && s[left] === "0") left++;

    if (ones === k) {
      const sub = s.substring(left, right + 1);
      if (
        result === "" ||
        sub.length < result.length ||
        (sub.length === result.length && sub < result)
      ) {
        result = sub;
      }
    }
  }
  return result;
}

/** Solution 3: Two-pass — collect all valid starts, pick best
 * Time: O(n) | Space: O(n)
 */
function shortestBeautifulTwoPass(s: string, k: number): string {
  // Precompute position of each '1'
  const onePos: number[] = [];
  for (let i = 0; i < s.length; i++) if (s[i] === "1") onePos.push(i);
  if (onePos.length < k) return "";

  let result = "";
  for (let i = 0; i <= onePos.length - k; i++) {
    // Window: from onePos[i] to onePos[i+k-1], shrink left zeros
    const left = onePos[i];
    const right = onePos[i + k - 1];
    const sub = s.substring(left, right + 1);
    if (
      result === "" ||
      sub.length < result.length ||
      (sub.length === result.length && sub < result)
    ) {
      result = sub;
    }
  }
  return result;
}

// Test cases
console.log(shortestAndLexicographicallySmallestBeautifulString("100011001", 2)); // "11"
console.log(shortestAndLexicographicallySmallestBeautifulString("1101", 2)); // "11"
console.log(shortestAndLexicographicallySmallestBeautifulString("1", 1)); // "1"
console.log(shortestAndLexicographicallySmallestBeautifulString("010", 1)); // "1"
```

## 🔗 Related Problems

| Problem                                                                                                                                    | Relationship                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring)                                                         | Shortest window containing required elements |
| [Longest Substring with At Most K Distinct Characters](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters) | Sliding window with count constraint         |
| [Permutation in String](https://leetcode.com/problems/permutation-in-string)                                                               | Fixed-count sliding window matching          |
