---
layout: page
title: "Reformat Phone Number"
difficulty: Easy
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/reformat-phone-number"
---

# Reformat Phone Number / Định dạng lại số điện thoại

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: String Processing
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Text Justification](https://leetcode.com/problems/text-justification) | [Decode String](https://leetcode.com/problems/decode-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhân viên ngân hàng đếm tiền — bỏ hết tạp chất (dấu cách, gạch ngang), rồi bó thành từng bó 3 tờ. Nếu còn lẻ đúng 4 tờ cuối thì bó thành 2+2.

```
Input:  "1-23-45 6"
Clean:  "123456"         ← strip spaces & dashes
Groups: [123][456]       ← greedily 3 while len > 4
Output: "123-456"

Input:  "123 4-5678"
Clean:  "12345678"       ← 8 digits
Groups: [123][45][67][8] ← wait: 8>4 → [123], 5 left>4 → nope
        8>4 → [123], 5 left 5>4 → [456], 2 left → [78]
Output: "123-456-78"
```

---

## 📝 Interview Tips / Ghi Nhớ Khi Phỏng Vấn

- 🔑 **Strip first / Làm sạch trước**: Xóa dấu cách và dấu gạch trước khi nhóm
- 🔑 **Threshold 4 / Ngưỡng 4**: Chỉ nhóm 3 khi còn **hơn** 4 ký tự, không phải ≥ 4
- 🔑 **Last chunk 4 → 2+2 / Tách 2+2**: Đúng 4 còn lại → hai nhóm 2, không phải 1+3
- 🔑 **Join dash / Nối gạch ngang**: `groups.join("-")` xử lý không có dấu đầu/cuối
- 🔑 **Regex clean / Dùng regex**: `replace(/[ -]/g, "")` gọn hơn split/filter
- 🔑 **O(n) single pass / O(n) một lượt**: Làm sạch + nhóm là O(n) tổng

---

## Solutions

### Solution 1: Greedy Grouping (Optimal)

```typescript
/**
 * Strip spaces/dashes, then greedily take groups of 3.
 * If exactly 4 remain at the end, split into 2+2.
 *
 * Time:  O(n) — clean + group both linear
 * Space: O(n) — output string
 */
function reformatNumber(number: string): string {
  const digits = number.replace(/[ -]/g, "");
  const groups: string[] = [];
  let i = 0;

  // Take groups of 3 while more than 4 remain
  while (digits.length - i > 4) {
    groups.push(digits.slice(i, i + 3));
    i += 3;
  }

  const remaining = digits.length - i;
  if (remaining === 4) {
    groups.push(digits.slice(i, i + 2));
    groups.push(digits.slice(i + 2));
  } else {
    groups.push(digits.slice(i)); // 1, 2, or 3 left
  }

  return groups.join("-");
}

console.log(reformatNumber("1-23-45 6")); // "123-456"
console.log(reformatNumber("123 4-5678")); // "123-456-78"
console.log(reformatNumber("12")); // "12"
console.log(reformatNumber("--17-5 229 35-39475 ")); // "175-229-353-94-75"
```

### Solution 2: Mutating String (Concise)

```typescript
/**
 * Same greedy logic — mutates a local string variable for clarity.
 * Time:  O(n)
 * Space: O(n)
 */
function reformatNumber2(number: string): string {
  let s = number.replace(/[ -]/g, "");
  const res: string[] = [];

  while (s.length > 4) {
    res.push(s.slice(0, 3));
    s = s.slice(3);
  }

  if (s.length === 4) {
    res.push(s.slice(0, 2), s.slice(2));
  } else {
    res.push(s);
  }

  return res.join("-");
}

console.log(reformatNumber2("1-23-45 6")); // "123-456"
console.log(reformatNumber2("123 4-5678")); // "123-456-78"
```

### Solution 3: Functional One-liner (Interview Flex)

```typescript
/**
 * Filter digits, chunk by size, handle tail — all in a reduce.
 * Time:  O(n)
 * Space: O(n)
 */
function reformatNumber3(number: string): string {
  const d = [...number].filter((c) => c !== " " && c !== "-");
  const groups: string[] = [];
  let i = 0;
  while (i < d.length) {
    const remaining = d.length - i;
    const take = remaining > 4 ? 3 : remaining === 4 ? 2 : remaining;
    groups.push(d.slice(i, i + take).join(""));
    i += take;
  }
  return groups.join("-");
}

console.log(reformatNumber3("1-23-45 6")); // "123-456"
console.log(reformatNumber3("123 4-5678")); // "123-456-78"
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                      | Difficulty | Pattern             |
| ---- | -------------------------------------------------------------------------------------------- | ---------- | ------------------- |
| 68   | [Text Justification](https://leetcode.com/problems/text-justification)                       | 🔴 Hard    | String formatting   |
| 394  | [Decode String](https://leetcode.com/problems/decode-string)                                 | 🟡 Medium  | Stack               |
| 1108 | [Defanging an IP Address](https://leetcode.com/problems/defanging-an-ip-address)             | 🟢 Easy    | String replace      |
| 557  | [Reverse Words in a String III](https://leetcode.com/problems/reverse-words-in-a-string-iii) | 🟢 Easy    | String manipulation |
