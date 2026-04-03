---
layout: page
title: "Smallest K-Length Subsequence With Occurrences of a Letter"
difficulty: Hard
category: String
tags: [String, Stack, Greedy, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/smallest-k-length-subsequence-with-occurrences-of-a-letter"
---

# Smallest K-Length Subsequence With Occurrences of a Letter / Dãy Con Nhỏ Nhất Độ Dài K Với Điều Kiện Ký Tự

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tương tự bài **"Remove Duplicate Letters"** nhưng thêm ràng buộc về ký tự bắt buộc.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Smallest K-Length Subsequence With Occurrences of a Letter example:**

```
s = "leet"  k = 3  letter = 'e'  repetition = 1

Monotonic stack (non-decreasing), pop when top > current:
  i=0 c='l'  stack=[]                 → push → ['l']
  i=1 c='e'  top='l'>'e', rem=3≥k-0=3 → pop → push → ['e']
  i=2 c='e'  top='e'<='e'             → push → ['e','e']
  i=3 c='t'  top='e'<='t'             → push → ['e','e','t']
Take first k=3 → "eet" ✓

Pop guard for letter: only pop top if
  stackLetters - 1 + lettersLeft >= repetition
```

**Three pop conditions (ALL must hold):**

1. `top > current` — greedy: smaller char is better
2. `stack.length - 1 + charsLeft >= k` — enough chars to reach length k
3. `top ≠ letter  OR  stackLetters - 1 + lettersLeft >= repetition` — letter quota safe

---

---

## Problem Description

| Problem                                                                                                                   | Difficulty | Pattern         |
| ------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------- |
| [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters/)                                       | 🟡 Medium  | Monotonic stack |
| [Smallest Subsequence of Distinct Characters](https://leetcode.com/problems/smallest-subsequence-of-distinct-characters/) | 🟡 Medium  | Monotonic stack |
| [Create Maximum Number](https://leetcode.com/problems/create-maximum-number/)                                             | 🔴 Hard    | Greedy + stack  |

---

## 📝 Interview Tips

- 🇻🇳 **Stack đơn điệu**: giữ chuỗi không giảm, pop khi gặp ký tự nhỏ hơn ở đỉnh
- 🇺🇸 **Monotonic stack**: maintain non-decreasing order, pop on smaller incoming char
- 🇻🇳 **Đếm lettersLeft trước**: cần biết còn bao nhiêu `letter` phía sau vị trí hiện tại
- 🇺🇸 **Pre-count lettersLeft**: need to know how many `letter` chars remain ahead
- 🇻🇳 **Guard khi pop letter**: không được pop ký tự bắt buộc nếu không còn đủ phía sau
- 🇺🇸 **Letter guard**: never pop the required letter if doing so drops below `repetition`
- 🇻🇳 **Luôn push, sau đó slice(0,k)**: stack có thể dài hơn k, lấy k phần tử đầu
- 🇺🇸 **Always push, slice at end**: stack may exceed k — take first k elements
- 🇻🇳 **charsLeft = n - i**: số ký tự từ vị trí i đến cuối (bao gồm i)
- 🇺🇸 **charsLeft = n - i**: characters remaining from index i to end inclusive
- 🇻🇳 **lettersLeft giảm sau push**: cập nhật sau khi đã qua vị trí i
- 🇺🇸 **Decrement lettersLeft after push**: update after position i is consumed

---

---

## Solutions

```typescript
/**
 * Greedy monotonic stack; guard letter pops with suffix letter count.
 * Time: O(n)  Space: O(n)
 */
function smallestSubsequence(s: string, k: number, letter: string, repetition: number): string {
  const n = s.length;
  // Count total occurrences of letter (suffix counts as we iterate)
  let lettersLeft = 0;
  for (const c of s) if (c === letter) lettersLeft++;

  const stack: string[] = [];
  let stackLetters = 0;

  for (let i = 0; i < n; i++) {
    const c = s[i];
    const charsLeft = n - i; // chars from i to end inclusive

    while (stack.length > 0) {
      const top = stack[stack.length - 1];
      if (top <= c) break; // monotonic guard
      if (stack.length - 1 + charsLeft < k) break; // not enough chars left
      if (top === letter && stackLetters - 1 + lettersLeft < repetition) break; // letter guard
      if (top === letter) stackLetters--;
      stack.pop();
    }

    stack.push(c);
    if (c === letter) {
      stackLetters++;
      lettersLeft--;
    }
  }

  return stack.slice(0, k).join("");
}

console.log(smallestSubsequence("leet", 3, "e", 1)); // "eet"
console.log(smallestSubsequence("leetcode", 4, "e", 2)); // "ecde"
console.log(smallestSubsequence("bb", 2, "b", 2)); // "bb"
console.log(smallestSubsequence("aabdaaabcd", 5, "a", 3)); // "aaabc"

/**
 * Pre-compute suffix letter counts for cleaner index access.
 * Time: O(n)  Space: O(n)
 */
function smallestSubsequence2(s: string, k: number, letter: string, repetition: number): string {
  const n = s.length;
  // suffix[i] = count of `letter` in s[i..n-1]
  const suffix = new Array(n + 1).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    suffix[i] = suffix[i + 1] + (s[i] === letter ? 1 : 0);
  }

  const stack: string[] = [];
  let stackLetters = 0;

  for (let i = 0; i < n; i++) {
    const c = s[i];

    while (stack.length > 0) {
      const top = stack[stack.length - 1];
      if (top <= c) break;
      if (stack.length - 1 + (n - i) < k) break;
      if (top === letter && stackLetters - 1 + suffix[i] < repetition) break;
      if (top === letter) stackLetters--;
      stack.pop();
    }

    stack.push(c);
    if (c === letter) stackLetters++;
  }

  return stack.slice(0, k).join("");
}

console.log(smallestSubsequence2("leet", 3, "e", 1)); // "eet"
console.log(smallestSubsequence2("bb", 2, "b", 2)); // "bb"
```

---

## 🔗 Related Problems

| Problem                                                                                                                   | Difficulty | Pattern         |
| ------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------- |
| [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters/)                                       | 🟡 Medium  | Monotonic stack |
| [Smallest Subsequence of Distinct Characters](https://leetcode.com/problems/smallest-subsequence-of-distinct-characters/) | 🟡 Medium  | Monotonic stack |
| [Create Maximum Number](https://leetcode.com/problems/create-maximum-number/)                                             | 🔴 Hard    | Greedy + stack  |
