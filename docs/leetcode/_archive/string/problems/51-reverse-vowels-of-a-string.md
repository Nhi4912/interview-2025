---
layout: page
title: "Reverse Vowels of a String"
difficulty: Easy
category: String
tags: [Two Pointers, String]
leetcode_url: "https://leetcode.com/problems/reverse-vowels-of-a-string"
---

# Reverse Vowels of a String / Đảo Ngược Các Nguyên Âm

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Reverse String](https://leetcode.com/problems/reverse-string) | [String Compression](https://leetcode.com/problems/string-compression)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống trò chơi "đổi chỗ" ở lớp học — chỉ những học sinh đặc biệt (nguyên âm) mới được đổi chỗ nhau, còn lại ngồi yên. Thầy giáo đứng ở hai đầu dãy bàn, tiến vào giữa, hễ thấy 2 học sinh đặc biệt ở hai đầu thì cho đổi chỗ ngay!

**Pattern Recognition:**

- Signal: "swap elements in-place matching a condition from both ends" → **Two Pointers**
- Left pointer tìm nguyên âm từ trái; right pointer tìm nguyên âm từ phải
- Khi cả hai đều trỏ vào nguyên âm → swap và di chuyển cả hai vào
- Key insight: không cần sort hay extra space — O(n) one pass

**Visual — s = "hello":**

```
  h  e  l  l  o
  L              R   → h not vowel → L++
     L           R   → e is vowel, o is vowel → SWAP
  h  o  l  l  e      L=2, R=3
        L     R      → l not vowel → L++
           L  R      → l not vowel → L++
              L≥R    → STOP

Result: "holle" ✅
```

---

## Problem Description

Given a string `s`, reverse **only the vowels** (a, e, i, o, u, both lowercase and uppercase) and return the result. All other characters stay in place.

**Example 1:**

```
Input:  s="hello"
Output: "holle"
Explanation: Vowels are 'e'(idx 1) and 'o'(idx 4) → swap → "holle"
```

**Example 2:**

```
Input:  s="leetcode"
Output: "leotcede"
Explanation: Vowels e,e,o,e at positions 1,2,5,7 → reverse → e,o,e,e
```

**Constraints:** `1 ≤ s.length ≤ 3×10⁵`, `s` consists of printable ASCII characters

---

## 📝 Interview Tips

1. **Clarify**: "Cả chữ hoa lẫn chữ thường đều là nguyên âm không? (A,E,I,O,U + a,e,i,o,u)" / Confirm both upper and lowercase vowels count
2. **Brute force**: "Extract vowels, reverse list, re-insert → O(n) but 3 passes" / Collect vowels → reverse → refill — clear but not in-place
3. **Two pointers**: "L từ trái, R từ phải, skip non-vowels, swap khi cả hai là nguyên âm" / L/R skip non-vowels, swap on both vowels
4. **Set lookup**: "Dùng Set<string> cho vowels để O(1) check" / Use Set for O(1) vowel membership check
5. **Edge cases**: "String không có nguyên âm → không thay đổi; 1 ký tự → return as-is" / No vowels or single char → unchanged
6. **Follow-up**: "Làm ngược lại — reverse consonants only?" / What if you reversed consonants instead?

---

## Solutions

```typescript
/**
 * Solution 1: Extract-Reverse-Refill
 * Time: O(n) — three passes: collect, reverse, rebuild
 * Space: O(n) — vowels array + result array
 */
function reverseVowelsBrute(s: string): string {
  const VOWELS = new Set("aeiouAEIOU");
  const arr = s.split("");
  const vowels = arr.filter((c) => VOWELS.has(c)).reverse();
  let vi = 0;
  return arr.map((c) => (VOWELS.has(c) ? vowels[vi++] : c)).join("");
}

/**
 * Solution 2: Two Pointers (In-Place on char array)
 * Time: O(n) — each character visited at most once
 * Space: O(n) — char array (strings are immutable in JS)
 *
 * Algorithm:
 * - L starts at 0, R starts at n-1
 * - Advance L while not a vowel
 * - Retreat R while not a vowel
 * - If L < R: swap arr[L] and arr[R], then L++, R--
 * - Repeat until L >= R
 */
function reverseVowels(s: string): string {
  const VOWELS = new Set("aeiouAEIOU");
  const arr = s.split("");
  let l = 0,
    r = arr.length - 1;

  while (l < r) {
    // Advance left pointer to next vowel
    while (l < r && !VOWELS.has(arr[l])) l++;
    // Retreat right pointer to next vowel
    while (l < r && !VOWELS.has(arr[r])) r--;
    // Swap the two vowels
    if (l < r) {
      [arr[l], arr[r]] = [arr[r], arr[l]];
      l++;
      r--;
    }
  }
  return arr.join("");
}

/**
 * Solution 3: Regex-based (concise, interview bonus)
 * Time: O(n) — regex scan + replace
 * Space: O(n) — regex match array
 */
function reverseVowelsRegex(s: string): string {
  const vowelMatches = s.match(/[aeiouAEIOU]/g) ?? [];
  let vi = vowelMatches.length - 1;
  return s.replace(/[aeiouAEIOU]/g, () => vowelMatches[vi--]);
}

// === Test Cases ===
console.log(reverseVowels("hello")); // "holle"
console.log(reverseVowels("leetcode")); // "leotcede"
console.log(reverseVowels("aA")); // "Aa"
console.log(reverseVowels("xyz")); // "xyz" (no vowels)
console.log(reverseVowels("a")); // "a"

// Verify all solutions match
const tests = ["hello", "leetcode", "aA", "xyz", "a", "AEIOU"];
for (const t of tests) {
  const [b, tp, r] = [reverseVowelsBrute(t), reverseVowels(t), reverseVowelsRegex(t)];
  console.assert(b === tp && tp === r, `Mismatch on "${t}": ${b} vs ${tp} vs ${r}`);
}
console.log("All solutions agree ✅");
```

---

## 🔗 Related Problems

| Problem                                                                                      | Pattern              | Difficulty |
| -------------------------------------------------------------------------------------------- | -------------------- | ---------- |
| [Reverse String](https://leetcode.com/problems/reverse-string)                               | Two Pointers         | Easy       |
| [Valid Palindrome](https://leetcode.com/problems/valid-palindrome)                           | Two Pointers         | Easy       |
| [String Compression](https://leetcode.com/problems/string-compression)                       | Two Pointers         | Medium     |
| [Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string)         | Two Pointers / Stack | Medium     |
| [Reverse Words in a String III](https://leetcode.com/problems/reverse-words-in-a-string-iii) | Two Pointers         | Easy       |
