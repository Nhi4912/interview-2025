---
layout: page
title: "Divide a String Into Groups of Size k"
difficulty: Easy
category: String
tags: [String, Simulation]
leetcode_url: "https://leetcode.com/problems/divide-a-string-into-groups-of-size-k"
---

# Divide a String Into Groups of Size k / Chia chuỗi thành các nhóm kích thước k

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Matrix / Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Text Justification](https://leetcode.com/problems/text-justification) | [Multiply Strings](https://leetcode.com/problems/multiply-strings)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống cắt bánh thành từng miếng bằng nhau — nếu chiếc bánh không chia hết, độn thêm kem (fill char) vào miếng cuối cho đủ. Sau đó slice đều nhau.

```
s = "abcdefghi", k = 3, fill = 'x'
len = 9, 9 % 3 = 0 → no padding needed
Groups: ["abc", "def", "ghi"]

s = "abcdefghij", k = 3, fill = 'x'
len = 10, 10 % 3 = 1 → pad with 2 'x' → "abcdefghijxx"
Groups: ["abc", "def", "ghi", "jxx"]

s = "a", k = 1, fill = 'z'
len = 1, 1 % 1 = 0 → no padding
Groups: ["a"]
```

---

## 📝 Interview Tips / Ghi Nhớ Khi Phỏng Vấn

- 🔑 **Pad to multiple of k / Đệm đến bội của k**: `need = (k - len % k) % k` ký tự đệm
- 🔑 **Modulo trick / Thủ thuật modulo**: `(k - len % k) % k` tránh đệm thừa khi đã chia hết
- 🔑 **Slice in steps of k / Cắt từng bước k**: `for i = 0; i < padded.length; i += k`
- 🔑 **fill is single char / fill là một ký tự**: Chỉ cần `fill.repeat(pad)`
- 🔑 **Result length = ceil(n/k) / Độ dài kết quả**: Luôn là `Math.ceil(n/k)` phần tử
- 🔑 **Immutable string / Chuỗi bất biến**: Dùng `+=` hay array rồi join đều được

---

## Solutions

### Solution 1: Pad + Slice (Clearest)

```typescript
/**
 * Pad s with fill char until length is multiple of k, then slice into groups.
 *
 * Time:  O(n) — padding + slicing both linear
 * Space: O(n) — output array
 */
function divideString(s: string, k: number, fill: string): string[] {
  const pad = (k - (s.length % k)) % k;
  const padded = s + fill.repeat(pad);
  const result: string[] = [];

  for (let i = 0; i < padded.length; i += k) {
    result.push(padded.slice(i, i + k));
  }

  return result;
}

console.log(divideString("abcdefghi", 3, "x")); // ["abc","def","ghi"]
console.log(divideString("abcdefghij", 3, "x")); // ["abc","def","ghi","jxx"]
console.log(divideString("a", 1, "z")); // ["a"]
console.log(divideString("ab", 4, "z")); // ["abzz"]
```

### Solution 2: Functional (Array.from)

```typescript
/**
 * Use Array.from to build groups directly — no explicit padding string.
 * Time:  O(n)
 * Space: O(n)
 */
function divideString2(s: string, k: number, fill: string): string[] {
  const n = s.length;
  const total = Math.ceil(n / k);
  return Array.from({ length: total }, (_, i) => {
    let group = s.slice(i * k, i * k + k);
    // Pad the last group if needed
    while (group.length < k) group += fill;
    return group;
  });
}

console.log(divideString2("abcdefghi", 3, "x")); // ["abc","def","ghi"]
console.log(divideString2("abcdefghij", 3, "x")); // ["abc","def","ghi","jxx"]
```

### Solution 3: match regex (Fun approach)

```typescript
/**
 * Pad then use regex to split into chunks of k.
 * Time:  O(n)
 * Space: O(n)
 */
function divideString3(s: string, k: number, fill: string): string[] {
  const pad = (k - (s.length % k)) % k;
  const padded = s + fill.repeat(pad);
  return padded.match(new RegExp(`.{${k}}`, "g"))!;
}

console.log(divideString3("abcdefghij", 3, "x")); // ["abc","def","ghi","jxx"]
console.log(divideString3("a", 1, "z")); // ["a"]
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                                      | Difficulty | Pattern         |
| ---- | ------------------------------------------------------------------------------------------------------------ | ---------- | --------------- |
| 68   | [Text Justification](https://leetcode.com/problems/text-justification)                                       | 🔴 Hard    | String chunking |
| 443  | [String Compression](https://leetcode.com/problems/string-compression)                                       | 🟡 Medium  | Two pointers    |
| 1446 | [Consecutive Characters](https://leetcode.com/problems/consecutive-characters)                               | 🟢 Easy    | Sliding window  |
| 2138 | [Divide a String Into Groups of Size k](https://leetcode.com/problems/divide-a-string-into-groups-of-size-k) | 🟢 Easy    | String chunking |
