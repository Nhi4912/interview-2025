---
layout: page
title: "Lexicographically Smallest Palindrome"
difficulty: Easy
category: String
tags: [Two Pointers, String, Greedy]
leetcode_url: "https://leetcode.com/problems/lexicographically-smallest-palindrome"
---

# Lexicographically Smallest Palindrome / Palindrome Nhỏ Nhất Theo Thứ Tự Từ Điển

---

## 🧠 Intuition / Tư Duy

**Analogy:** Cho chuỗi `s`, bạn có thể thay thế bất kỳ ký tự nào bằng ký tự chữ thường bất kỳ. Tìm palindrome nhỏ nhất theo thứ tự từ điển mà có thể tạo ra.

**Ví dụ:** `s = "egcfe"` → cặp `(0,4): e,e` ok; `(1,3): g,f` → thay cả hai bằng `min('g','f')='f'` → `"efcfe"`.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Lexicographically Smallest Palindrome example:**

```
s = "egcfe"
     01234

Pairs: (0,4)='e','e' → same → keep 'e','e'
       (1,3)='g','f' → different → both = min('g','f')='f'
       (2) middle → keep 'c'

Result: "efcfe"

s = "abcd"
     0123

Pairs: (0,3)='a','d' → min='a' → 'a','a'
       (1,2)='b','c' → min='b' → 'b','b'

Result: "abba"
```

---

## Problem Description

- Thay thế bất kỳ ký tự nào (0 hoặc nhiều lần) để tạo palindrome.
- Trả về palindrome nhỏ nhất theo thứ tự từ điển.

**Constraints:** `1 <= s.length <= 1000`, chỉ chứa chữ thường.

---

## 📝 Interview Tips

1. **Greedy từ ngoài vào** — xử lý từng cặp đối xứng từ ngoài vào giữa.
2. **Nếu bằng nhau** — không cần thay, giữ nguyên.
3. **Nếu khác nhau** — thay cả hai bằng `min(s[i], s[n-1-i])` để nhỏ nhất.
4. **Ký tự giữa** — nếu n lẻ, ký tự ở giữa không cần thay đổi.
5. **Palindrome đảm bảo** — vì cả hai ký tự trong cặp đều được set bằng nhau.
6. **Không cần sort** — chỉ cần một lần duyệt O(n/2).

---

## Solutions

```typescript
function makeSmallestPalindrome(s: string): string {
  const arr = s.split("");
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    if (arr[left] !== arr[right]) {
      // Set both to the smaller character
      const smaller = arr[left] < arr[right] ? arr[left] : arr[right];
      arr[left] = smaller;
      arr[right] = smaller;
    }
    left++;
    right--;
  }

  return arr.join("");
}

// Test cases
console.log(makeSmallestPalindrome("egcfe")); // "efcfe"
console.log(makeSmallestPalindrome("abcd")); // "abba"
console.log(makeSmallestPalindrome("seven")); // "neven"
console.log(makeSmallestPalindrome("a")); // "a"
console.log(makeSmallestPalindrome("aa")); // "aa"
console.log(makeSmallestPalindrome("zzz")); // "zzz"

function makeSmallestPalindromeMap(s: string): string {
  const n = s.length;
  const arr = s.split("");

  for (let i = 0; i < Math.floor(n / 2); i++) {
    const j = n - 1 - i;
    const smaller = s[i] < s[j] ? s[i] : s[j];
    arr[i] = smaller;
    arr[j] = smaller;
  }
  // Middle character (if odd length) remains unchanged

  return arr.join("");
}

console.log(makeSmallestPalindromeMap("egcfe")); // "efcfe"
console.log(makeSmallestPalindromeMap("abcd")); // "abba"
console.log(makeSmallestPalindromeMap("seven")); // "neven"

function makeSmallestPalindromeFn(s: string): string {
  const n = s.length;

  return Array.from({ length: n }, (_, i) => {
    const j = n - 1 - i;
    // Use min char code for symmetry
    return String.fromCharCode(Math.min(s.charCodeAt(i), s.charCodeAt(j)));
  }).join("");
}

console.log(makeSmallestPalindromeFn("egcfe")); // "efcfe"
console.log(makeSmallestPalindromeFn("abcd")); // "abba"

// Verify it's a palindrome
function isPalindrome(s: string): boolean {
  const r = s.split("").reverse().join("");
  return s === r;
}
console.log(isPalindrome(makeSmallestPalindromeFn("egcfe"))); // true
console.log(isPalindrome(makeSmallestPalindromeFn("seven"))); // true
```

---

## 🔗 Related Problems

| Giải pháp    | Thời gian | Không gian | Ghi chú          |
| ------------ | --------- | ---------- | ---------------- |
| Two Pointers | O(n)      | O(n)       | Tối ưu, rõ ràng  |
| Array map    | O(n)      | O(n)       | Tương đương      |
| Functional   | O(n)      | O(n)       | Functional style |
