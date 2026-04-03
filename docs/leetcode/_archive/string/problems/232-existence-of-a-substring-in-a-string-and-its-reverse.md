---
layout: page
title: "Existence of a Substring in a String and Its Reverse"
difficulty: Easy
category: String
tags: [Hash Table, String]
leetcode_url: "https://leetcode.com/problems/existence-of-a-substring-in-a-string-and-its-reverse"
---

# Existence of a Substring in a String and Its Reverse / Sự Tồn Tại Chuỗi Con Trong Chuỗi Và Bản Đảo Ngược

---

## 🧠 Intuition / Tư Duy

**Analogy:** Cho chuỗi `s`, kiểm tra xem có tồn tại một chuỗi con độ dài 2 nào đó mà xuất hiện trong cả `s` **và** chuỗi đảo ngược của `s` không.

**Ví dụ:** `s = "leetcode"` → "le" xuất hiện trong `s` và "el" xuất hiện trong reverse("leetcode") = "edocteel" → không. Nhưng "ee" xuất hiện trong cả hai → `true`.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Existence of a Substring in a String and Its Reverse example:**

```
s = "leetcode"
rev = "edocteel"

Length-2 substrings of s:
"le", "ee", "et", "tc", "co", "od", "de"

Length-2 substrings of rev:
"ed", "do", "oc", "ct", "te", "ee", "el"

Intersection: "ee" ∈ both → return true

s = "abcba"
rev = "abcba" (palindrome!)
s[0..1]="ab" → in rev? yes at position 0 → true immediately
```

---

## Problem Description

- Kiểm tra xem có chuỗi con độ dài 2 nào đó tồn tại trong cả `s` và `reverse(s)` không.
- Trả về `true` nếu có, `false` nếu không.

**Constraints:** `1 <= s.length <= 100`, chỉ chứa chữ thường.

---

## 📝 Interview Tips

1. **Chỉ xét độ dài 2** — chuỗi con cần tìm có đúng 2 ký tự.
2. **Set substrings** — tạo Set tất cả substring-2 của `s`, rồi check từng substring-2 của `reverse(s)`.
3. **Tương đương** — `s[i..i+1]` xuất hiện trong `reverse(s)` ↔ `s[i+1]s[i]` xuất hiện trong `s`.
4. **Insight** — `"ab"` ∈ s và `"ab"` ∈ reverse(s) ↔ `"ab"` ∈ s và `"ba"` ∈ s.
5. **Early exit** — dừng ngay khi tìm được cặp đầu tiên.
6. **Palindrome** — mọi palindrome đều return true (trừ length 1).

---

## Solutions

```typescript
function isSubstringPresent(s: string): boolean {
  // A length-2 substring exists in both s and reverse(s)
  // ↔ "ab" ∈ s and "ba" ∈ s (because reverse(s) contains "ab" ↔ s contains "ba")
  const pairs = new Set<string>();

  for (let i = 0; i < s.length - 1; i++) {
    pairs.add(s[i] + s[i + 1]);
  }

  // Check if any reversed pair also exists in s
  for (const pair of pairs) {
    const reversed = pair[1] + pair[0];
    if (pairs.has(reversed)) return true;
  }

  return false;
}

// Test cases
console.log(isSubstringPresent("leetcode")); // true ("ee" → rev "ee")
console.log(isSubstringPresent("abcba")); // true ("ab" and "ba" both in s)
console.log(isSubstringPresent("abcd")); // false
console.log(isSubstringPresent("aa")); // true ("aa" reversed is "aa")
console.log(isSubstringPresent("a")); // false (length 1, no pairs)

function isSubstringPresentDirect(s: string): boolean {
  const rev = s.split("").reverse().join("");

  // Check every length-2 substring of s against rev
  for (let i = 0; i < s.length - 1; i++) {
    const sub = s.slice(i, i + 2);
    if (rev.includes(sub)) return true;
  }

  return false;
}

console.log(isSubstringPresentDirect("leetcode")); // true
console.log(isSubstringPresentDirect("abcba")); // true
console.log(isSubstringPresentDirect("abcd")); // false
console.log(isSubstringPresentDirect("aa")); // true

function isSubstringPresentMatrix(s: string): boolean {
  // Track which [a][b] pairs appear in s
  // seen[i][j] = true if s contains char(i)+char(j)
  const seen: boolean[][] = Array.from({ length: 26 }, () => new Array(26).fill(false));

  for (let k = 0; k < s.length - 1; k++) {
    const i = s.charCodeAt(k) - 97;
    const j = s.charCodeAt(k + 1) - 97;
    seen[i][j] = true;
    // Check if the reverse (j, i) was already seen
    if (seen[j][i]) return true;
  }

  return false;
}

console.log(isSubstringPresentMatrix("leetcode")); // true
console.log(isSubstringPresentMatrix("abcba")); // true
console.log(isSubstringPresentMatrix("abcd")); // false
console.log(isSubstringPresentMatrix("aa")); // true

// Verify all three approaches agree
const testCases = ["leetcode", "abcba", "abcd", "aa", "a", "aab", "zyxw"];
for (const tc of testCases) {
  const r1 = isSubstringPresent(tc);
  const r2 = isSubstringPresentDirect(tc);
  const r3 = isSubstringPresentMatrix(tc);
  if (r1 !== r2 || r2 !== r3) {
    console.error(`Mismatch for "${tc}": ${r1}, ${r2}, ${r3}`);
  }
}
console.log("All approaches agree ✓");
```

---

## 🔗 Related Problems

| Giải pháp      | Thời gian | Không gian | Ghi chú                    |
| -------------- | --------- | ---------- | -------------------------- |
| Set approach   | O(n)      | O(n)       | 2 passes, elegant          |
| Direct reverse | O(n²)     | O(n)       | Simple, includes() is O(n) |
| Matrix         | O(n)      | O(1)       | 26×26 fixed space, 1 pass  |
