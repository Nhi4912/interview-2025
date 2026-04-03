---
layout: page
title: "Largest Palindromic Number"
difficulty: Medium
category: String
tags: [Hash Table, String, Greedy, Counting]
leetcode_url: "https://leetcode.com/problems/largest-palindromic-number"
---

# Largest Palindromic Number / Số Palindrome Lớn Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Digit Counting
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Longest Palindrome](https://leetcode.com/problems/longest-palindrome) | [Largest Number](https://leetcode.com/problems/largest-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống xây tòa nhà đối xứng — ta đặt chữ số lớn nhất ra ngoài cùng, giảm dần vào giữa, và chỉ có thể đặt một chữ số lẻ ở trung tâm. Tham lam: luôn ưu tiên chữ số lớn hơn ở vị trí ngoài cùng.

**Pattern Recognition:**

- Signal: "construct largest palindrome from digit pool" → **Greedy + frequency counting**
- Key insight: Lấy pairs từ 9→0 (lớn nhất trước), ghép half + optional center + reverse(half). Tránh leading zeros.

**Visual — Build palindrome:**

```
num = "444947137"
freq: 1→1, 3→1, 4→3, 7→2, 9→1

Greedy (digit 9→0):
  9: count=1, pairs=0 → potential center='9'
  7: count=2, pairs=1 → half="7"
  4: count=3, pairs=1 → half="74", center='4' (overwrite to bigger odd)
  3: count=1, pairs=0 → center stays '4'
  1: count=1, pairs=0 → center stays '4'

half = "74"
palindrome = "74" + "4" + "47" = "74447" ✅

Edge: all same digit e.g. "000" → "0" (no leading zeros unless single digit)
```

---

## Problem Description

Given a string `num` of digits, return the **largest palindromic** integer (as a string) using a subset of `num`'s digits. The result must not have leading zeros (unless the answer is `"0"`). ([LeetCode 2384](https://leetcode.com/problems/largest-palindromic-number))

**Example 1:** `num = "444947137"` → `"7449447"`
**Example 2:** `num = "00009"` → `"9"`

Constraints: `1 <= num.length <= 10^5`, `num` consists of digits only

---

## 📝 Interview Tips

1. **Clarify**: "Kết quả có thể là một chữ số không?" / Single digit is valid; "0" is valid if no other choice
2. **Brute force**: "Không có brute force thực tế — bài này fundamentally cần greedy construction" / Direct greedy is the right approach
3. **Greedy order**: "Xử lý từ chữ số 9 xuống 0 để đảm bảo số lớn ở ngoài cùng" / Process 9→0 for largest outer digits
4. **Edge cases**: "Tất cả là 0 → '0'; leading zero nếu half bắt đầu bằng 0 → xây thêm ngoài cùng" / Strip leading zeros from half
5. **Follow-up**: "Nếu cần palindrome nhỏ nhất?" → xử lý từ 0→9, cẩn thận leading zeros
6. **Complexity**: "O(n) time — đếm tần suất O(n), build O(10) → total O(n)" / O(n) linear

---

## Solutions

```typescript
/**
 * Solution 1: Greedy digit counting (9 → 0)
 * Time: O(n) — count digits O(n), build result O(10 + result length)
 * Space: O(n) — result string
 */
function largestPalindromic(num: string): string {
  const freq = new Array(10).fill(0);
  for (const c of num) freq[Number(c)]++;

  let half = "";
  let center = "";

  // Build half from largest digit down
  for (let d = 9; d >= 0; d--) {
    const pairs = Math.floor(freq[d] / 2);
    half += String(d).repeat(pairs);
    // Track largest odd-count digit for center
    if (freq[d] % 2 === 1 && (center === "" || d > Number(center))) {
      center = String(d);
    }
  }

  // Remove leading zeros from half (except if half is empty)
  // Note: half is already sorted 9→0, so leading zeros only happen if half = "000..."
  // We strip only if it would create leading zero in final number
  const trimmedHalf = half.replace(/^0+/, "");

  if (trimmedHalf === "" && center === "") return "0";

  // If after trimming half is all zeros, the palindrome is center or "0"
  const effectiveHalf = trimmedHalf.length === 0 && half.length > 0 ? "" : trimmedHalf;

  if (effectiveHalf === "" && half.length > 0) {
    // All pairs were zeros
    return center !== "" ? center : "0";
  }

  const rev = effectiveHalf.split("").reverse().join("");
  return effectiveHalf + center + rev;
}

/**
 * Solution 2: Cleaner version handling edge cases explicitly
 * Time: O(n), Space: O(n)
 */
function largestPalindromicClean(num: string): string {
  const freq = new Array(10).fill(0);
  for (const c of num) freq[Number(c)]++;

  const halfParts: string[] = [];
  let center = "";

  for (let d = 9; d >= 0; d--) {
    halfParts.push(String(d).repeat(Math.floor(freq[d] / 2)));
    if (freq[d] % 2 === 1 && center < String(d)) center = String(d);
  }

  let half = halfParts.join("").replace(/^0+/, "");
  if (half === "") return center !== "" ? center : "0";

  return half + center + half.split("").reverse().join("");
}

// === Test Cases ===
console.log(largestPalindromic("444947137")); // → "7449447"
console.log(largestPalindromic("00009")); // → "9"
console.log(largestPalindromic("00")); // → "0"
console.log(largestPalindromicClean("444947137")); // → "7449447"
```
