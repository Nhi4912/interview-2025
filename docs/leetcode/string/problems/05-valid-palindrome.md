---
layout: page
title: "Valid Palindrome"
difficulty: Easy
category: String
tags: [String, Two Pointers]
leetcode_url: "https://leetcode.com/problems/valid-palindrome/"
---

# Valid Palindrome / Kiểm Tra Chuỗi Đối Xứng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers
> **Frequency**: 🔥 Tier 1 — câu hỏi warm-up phổ biến nhất trong phone screen
> **See also**: [Valid Palindrome II](./16-valid-palindrome-ii.md) | [Two Sum](../../array/problems/04-two-sum.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đọc một câu khắc trên đá — bỏ qua dấu câu và khoảng trắng, chỉ giữ lại chữ cái và số. Một người đứng ở đầu câu và một người đứng ở cuối cùng bước lại gặp nhau ở giữa, so sánh từng cặp ký tự. Nếu mọi cặp đều khớp nhau thì câu đó là palindrome.

**Pattern Recognition:**

- Signal: "reads the same forward and backward / đọc xuôi đọc ngược" → **Two Pointers from both ends**
- Bỏ qua ký tự không phải alphanumeric bằng cách tiến con trỏ vào trong
- So sánh case-insensitive: `s[left].toLowerCase() === s[right].toLowerCase()`

**Visual — Check "A man, a plan, a canal: Panama":**

```
After ignoring non-alphanumeric:
  a  m  a  n  a  p  l  a  n  a  c  a  n  a  l  p  a  n  a  m  a
  L                                                             R

Round 1: s[L]='a' vs s[R]='a' ✓  →  L++, R--
Round 2: s[L]='m' vs s[R]='m' ✓  →  L++, R--
Round 3: s[L]='a' vs s[R]='a' ✓  →  L++, R--
Round 4: s[L]='n' vs s[R]='n' ✓  →  L++, R--
...
L meets R  →  return true
```

---

## Problem Description

A phrase is a palindrome if, after converting all uppercase to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.

```
Example 1: "A man, a plan, a canal: Panama" → true
Example 2: "race a car"                     → false
Example 3: " "                              → true  (empty after filtering)
```

Constraints:

- `1 <= s.length <= 2 * 10^5`
- `s` consists only of printable ASCII characters

---

## 📝 Interview Tips

1. **Clarify**: What counts as alphanumeric? Are digits included? / Số có tính không? Chỉ a-z hay cả 0-9?
2. **Brute force**: Filter string, reverse, compare — O(n) time, O(n) space / Lọc rồi so với chuỗi đảo ngược
3. **Optimize**: Two pointers in-place, no new string — O(n) time, O(1) space / Hai con trỏ, không tốn bộ nhớ thêm
4. **Edge cases**: All spaces or symbols → empty after filter → true / Chuỗi chỉ có dấu câu trả về true
5. **Follow-up**: What if you can delete at most 1 character? (LC 680) / Xóa tối đa 1 ký tự vẫn palindrome?

---

## Solutions

{% raw %}

/\*\*

- Solution 1: Filter + Reverse (Brute Force)
- Time: O(n) — one filter pass + one reverse pass
- Space: O(n) — allocates a new cleaned string
  \*/
  function isPalindromeBrute(s: string): boolean {
  const cleaned = s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  return cleaned === cleaned.split("").reverse().join("");
  }

/\*\*

- Solution 2: Two Pointers (Optimal)
- Time: O(n) — single pass, each character visited at most once
- Space: O(1) — only two pointer indices, no extra string
  \*/
  function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;

const isAlnum = (c: string): boolean => /[a-zA-Z0-9]/.test(c);

while (left < right) {
while (left < right && !isAlnum(s[left])) left++;
while (left < right && !isAlnum(s[right])) right--;

    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;

    left++;
    right--;

}

return true;
}

// === Test Cases ===
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("race a car")); // false
console.log(isPalindrome(" ")); // true

{% endraw %}

---

## 🔗 Related Problems

- [Valid Palindrome II](./16-valid-palindrome-ii.md) — mở rộng: được xóa tối đa 1 ký tự
- [Two Sum](../../array/problems/04-two-sum.md) — cùng pattern two pointers trên sorted input
