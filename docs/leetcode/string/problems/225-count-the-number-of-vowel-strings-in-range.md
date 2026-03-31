---
layout: page
title: "Count the Number of Vowel Strings in Range"
difficulty: Easy
category: String
tags: [Array, String, Counting]
leetcode_url: "https://leetcode.com/problems/count-the-number-of-vowel-strings-in-range"
---

# Count the Number of Vowel Strings in Range / Đếm Số Chuỗi Nguyên Âm Trong Phạm Vi

## Tóm tắt bằng tiếng Việt

Cho mảng `words` và hai chỉ số `left`, `right`. Đếm số chuỗi trong `words[left..right]` mà vừa bắt đầu vừa kết thúc bằng nguyên âm (`a, e, i, o, u`).

**Ví dụ:** `words = ["are","amy","u"]`, `left = 0`, `right = 2` → `"are"` (a...e ✓), `"amy"` (a...y ✗), `"u"` (u...u ✓) → kết quả `2`.

## Tương tự thực tế

> Như kiểm tra danh sách sinh viên: chỉ đếm những em có họ và tên đều bắt đầu bằng nguyên âm. Chỉ xét trong khoảng từ vị trí `left` đến `right`.

## Minh họa ASCII

```
words = ["are", "amy", "u", "omit", "hello"]
          a..e   a..y   u    o..t   h..o
          ✓ ✓    ✓ ✗    ✓ ✓  ✓ ✗    ✗ ✗

left=0, right=4
Count vowel-start AND vowel-end:
"are" → 'a' ✓ and 'e' ✓ → COUNT
"amy" → 'a' ✓ but 'y' ✗ → skip
"u"   → 'u' ✓ and 'u' ✓ → COUNT
"omit"→ 'o' ✓ but 't' ✗ → skip
"hello"→'h' ✗           → skip
Answer = 2
```

## Mô tả bài toán

- Cho `words` mảng chuỗi và `left`, `right` chỉ số.
- Trả về số chuỗi `words[i]` với `left <= i <= right` mà bắt đầu **và** kết thúc bằng nguyên âm.

**Constraints:** `1 <= words.length <= 1000`, `1 <= words[i].length <= 10`, `0 <= left <= right < words.length`.

## Tips phỏng vấn

1. **Vowel set** — dùng `Set` hoặc string `.includes()` để check nguyên âm.
2. **Check cả 2 đầu** — `isVowel(first) && isVowel(last)`.
3. **Single char** — nếu chuỗi có 1 ký tự, `first === last`, chỉ cần check 1 lần.
4. **Slice trước** — `words.slice(left, right+1)` rồi filter cũng được.
5. **For loop vs filter** — for loop tiết kiệm memory hơn khi array lớn.
6. **Phân biệt nguyên âm** — chỉ `a, e, i, o, u` (không bao gồm `y`).

## Giải pháp

### Giải pháp 1: For Loop với Helper Function

```typescript
function vowelStrings(words: string[], left: number, right: number): number {
  const vowels = new Set(["a", "e", "i", "o", "u"]);

  const isVowel = (ch: string): boolean => vowels.has(ch);

  let count = 0;
  for (let i = left; i <= right; i++) {
    const word = words[i];
    if (isVowel(word[0]) && isVowel(word[word.length - 1])) {
      count++;
    }
  }
  return count;
}

// Test cases
console.log(vowelStrings(["are", "amy", "u"], 0, 2)); // 2
console.log(vowelStrings(["hey", "aeo", "mu", "ooo", "artsy"], 0, 4)); // 2
console.log(vowelStrings(["e", "o", "u"], 0, 2)); // 3
console.log(vowelStrings(["apple", "orange", "banana"], 0, 2)); // 2
console.log(vowelStrings(["abc"], 0, 0)); // 0
```

### Giải pháp 2: filter + reduce (Functional style)

```typescript
function vowelStringsFunc(words: string[], left: number, right: number): number {
  const VOWELS = "aeiou";

  return words
    .slice(left, right + 1)
    .filter((w) => VOWELS.includes(w[0]) && VOWELS.includes(w[w.length - 1])).length;
}

console.log(vowelStringsFunc(["are", "amy", "u"], 0, 2)); // 2
console.log(vowelStringsFunc(["hey", "aeo", "mu", "ooo", "artsy"], 0, 4)); // 2
console.log(vowelStringsFunc(["e", "o", "u"], 0, 2)); // 3
```

### Giải pháp 3: Regex approach

```typescript
function vowelStringsRegex(words: string[], left: number, right: number): number {
  // Word must start and end with a vowel
  const pattern = /^[aeiou].*[aeiou]$|^[aeiou]$/;
  let count = 0;
  for (let i = left; i <= right; i++) {
    if (pattern.test(words[i])) count++;
  }
  return count;
}

console.log(vowelStringsRegex(["are", "amy", "u"], 0, 2)); // 2
console.log(vowelStringsRegex(["e", "o", "u"], 0, 2)); // 3
console.log(vowelStringsRegex(["abc"], 0, 0)); // 0
```

## Bảng so sánh

| Giải pháp      | Thời gian | Không gian | Ghi chú                  |
| -------------- | --------- | ---------- | ------------------------ |
| For Loop       | O(n)      | O(1)       | Tối ưu nhất              |
| filter + slice | O(n)      | O(n)       | Functional, tạo mảng mới |
| Regex          | O(n·m)    | O(1)       | m = word length          |

## Bài liên quan

| #    | Tên                                        | Độ khó | Tags   |
| ---- | ------------------------------------------ | ------ | ------ |
| 1119 | Remove Vowels from a String                | Easy   | String |
| 2586 | Count the Number of Vowel Strings in Range | Easy   | Array  |
| 1704 | Determine if String Halves Are Alike       | Easy   | String |
