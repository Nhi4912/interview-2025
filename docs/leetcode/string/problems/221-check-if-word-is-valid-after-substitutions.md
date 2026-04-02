---
layout: page
title: "Check If Word Is Valid After Substitutions"
difficulty: Medium
category: String
tags: [String, Stack]
leetcode_url: "https://leetcode.com/problems/check-if-word-is-valid-after-substitutions"
---

# Check If Word Is Valid After Substitutions / Kiểm Tra Từ Hợp Lệ Sau Các Thay Thế

---

## 🧠 Intuition / Tư Duy

**Analogy:** Một từ hợp lệ được tạo ra từ chuỗi rỗng bằng cách liên tục chèn "abc" vào bất kỳ vị trí nào. Kiểm tra xem chuỗi `s` có phải là từ hợp lệ không.

**Ví dụ:** "aabcbc" → hợp lệ vì "" → "abc" → "aabcbc" (chèn "abc" vào giữa "a" và "bc").

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Check If Word Is Valid After Substitutions example:**

```
s = "aabcbc"
Stack processing:
'a' → [a]
'a' → [a,a]
'b' → [a,a,b]
'c' → pop 'b','a' → [a]  ✓
'b' → [a,b]
'c' → pop 'b','a' → []   ✓
End: stack empty → VALID ✓

s = "abccba"
'a'→[a] 'b'→[a,b] 'c'→pop→[] 'c'→need b,a but empty → INVALID ✗
```

---

## Problem Description

- Từ hợp lệ được tạo bằng cách bắt đầu từ `""` và chèn `"abc"` vào bất kỳ vị trí nào bất kỳ số lần.
- Cho chuỗi `s`, trả về `true` nếu `s` là từ hợp lệ.

**Constraints:** `1 <= s.length <= 3 * 10^4`, chỉ chứa `'a'`, `'b'`, `'c'`.

---

## 📝 Interview Tips

1. **Stack là chìa khóa** — khi gặp `'c'` phải tìm `'b'` rồi `'a'` ngay bên dưới.
2. **Greedy pop** — gặp `'c'`, ngay lập tức kiểm tra 2 phần tử trên cùng stack.
3. **Độ dài chia hết 3** — nếu `s.length % 3 !== 0`, trả về `false` ngay.
4. **Edge case** — stack rỗng khi cần pop → invalid.
5. **Chỉ `'c'` mới trigger pop** — `'a'` và `'b'` luôn push vào stack.
6. **Stack cuối phải rỗng** — nếu còn phần tử, tức là chưa hoàn chỉnh.

---

## Solutions

```typescript
function isValid(s: string): boolean {
  // Quick check: length must be divisible by 3
  if (s.length % 3 !== 0) return false;

  const stack: string[] = [];

  for (const ch of s) {
    if (ch === "c") {
      // Must have 'b' then 'a' beneath
      if (stack.length < 2) return false;
      if (stack[stack.length - 1] !== "b") return false;
      if (stack[stack.length - 2] !== "a") return false;
      stack.pop();
      stack.pop();
    } else {
      stack.push(ch);
    }
  }

  return stack.length === 0;
}

// Test cases
console.log(isValid("aabcbc")); // true
console.log(isValid("abcabcababcc")); // true
console.log(isValid("aabccbc")); // false
console.log(isValid("cababc")); // false
console.log(isValid("abc")); // true
console.log(isValid("")); // true (empty is valid base)

function isValidRecursive(s: string): boolean {
  // Repeatedly remove "abc" until no more found or stuck
  let prev = s;
  while (prev.includes("abc")) {
    prev = prev.replace(/abc/g, "");
  }
  return prev.length === 0;
}

console.log(isValidRecursive("aabcbc")); // true
console.log(isValidRecursive("abcabcababcc")); // true
console.log(isValidRecursive("aabccbc")); // false

function isValidStrict(s: string): boolean {
  if (s.length % 3 !== 0) return false;

  const stack: number[] = []; // 0='a', 1='b'

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "a") {
      stack.push(0);
    } else if (ch === "b") {
      // 'b' must follow 'a'
      if (stack.length === 0 || stack[stack.length - 1] !== 0) return false;
      stack.push(1);
    } else if (ch === "c") {
      // 'c' must follow 'b' which follows 'a'
      if (stack.length < 2) return false;
      if (stack[stack.length - 1] !== 1) return false;
      if (stack[stack.length - 2] !== 0) return false;
      stack.pop();
      stack.pop();
    } else {
      return false; // invalid character
    }
  }

  return stack.length === 0;
}

console.log(isValidStrict("aabcbc")); // true
console.log(isValidStrict("cababc")); // false
```

---

## 🔗 Related Problems

| Giải pháp     | Thời gian | Không gian | Ghi chú                   |
| ------------- | --------- | ---------- | ------------------------- |
| Stack         | O(n)      | O(n)       | Tối ưu, 1 lần duyệt       |
| Regex replace | O(n²)     | O(n)       | Trực quan nhưng chậm      |
| Stack strict  | O(n)      | O(n)       | Kiểm tra thêm 'b' sau 'a' |
