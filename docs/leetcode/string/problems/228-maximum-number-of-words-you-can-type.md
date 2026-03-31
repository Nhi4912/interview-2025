---
layout: page
title: "Maximum Number of Words You Can Type"
difficulty: Easy
category: String
tags: [Hash Table, String]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-words-you-can-type"
---

# Maximum Number of Words You Can Type / Số Từ Tối Đa Bạn Có Thể Gõ

## Tóm tắt bằng tiếng Việt

Bàn phím bị hỏng một số phím. Cho chuỗi `text` (gồm nhiều từ cách nhau bởi dấu cách) và chuỗi `brokenLetters` (các phím hỏng). Đếm số từ có thể gõ được, tức là không chứa bất kỳ ký tự nào trong `brokenLetters`.

**Ví dụ:** `text = "hello world"`, `brokenLetters = "ad"` → `"hello"` ✓ (không có `a,d`), `"world"` ✓ → kết quả `2`.

## Tương tự thực tế

> Như kiểm tra kho hàng: bạn có danh sách nguyên liệu hỏng. Với mỗi món ăn (từ), nếu cần bất kỳ nguyên liệu hỏng nào thì không làm được. Đếm số món có thể làm.

## Minh họa ASCII

```
text = "leet code"
brokenLetters = "lt"

Broken set: {l, t}

"leet": 'l' → ✗ BROKEN → can't type
"code": 'c' ✓, 'o' ✓, 'd' ✓, 'e' ✓ → CAN TYPE

Answer = 1

text = "hello world"
brokenLetters = "ad"
Broken: {a, d}
"hello": h✓e✓l✓l✓o✓ → COUNT
"world": w✓o✓r✓l✓d✗ → SKIP
Answer = 1 (not 2!)
```

## Mô tả bài toán

- Cho `text` và `brokenLetters`.
- Trả về số từ trong `text` không chứa ký tự nào trong `brokenLetters`.

**Constraints:** `1 <= text.length <= 10^4`, `0 <= brokenLetters.length <= 26`.

## Tips phỏng vấn

1. **Set cho O(1) lookup** — tạo `Set` từ `brokenLetters` để check nhanh.
2. **Split text** — `text.split(' ')` để lấy từng từ.
3. **every()** — `word.split('').every(ch => !broken.has(ch))`.
4. **Early exit** — khi gặp ký tự hỏng trong từ, dừng kiểm tra từ đó ngay.
5. **Empty brokenLetters** — mọi từ đều gõ được.
6. **Case sensitivity** — bài này chỉ lowercase, không cần lo hoa/thường.

## Giải pháp

### Giải pháp 1: Set + every (Ngắn gọn)

```typescript
function canBeTypedWords(text: string, brokenLetters: string): number {
  const broken = new Set(brokenLetters.split(""));

  return text.split(" ").filter((word) => word.split("").every((ch) => !broken.has(ch))).length;
}

// Test cases
console.log(canBeTypedWords("hello world", "ad")); // 1
console.log(canBeTypedWords("leet code", "lt")); // 1
console.log(canBeTypedWords("leet code", "e")); // 0
console.log(canBeTypedWords("hello world", "")); // 2
console.log(canBeTypedWords("a b c", "b")); // 2
```

### Giải pháp 2: For Loop với early exit (Tối ưu)

```typescript
function canBeTypedWordsLoop(text: string, brokenLetters: string): number {
  const broken = new Set(brokenLetters);
  const words = text.split(" ");
  let count = 0;

  for (const word of words) {
    let canType = true;
    for (const ch of word) {
      if (broken.has(ch)) {
        canType = false;
        break; // early exit for this word
      }
    }
    if (canType) count++;
  }

  return count;
}

console.log(canBeTypedWordsLoop("hello world", "ad")); // 1
console.log(canBeTypedWordsLoop("leet code", "lt")); // 1
console.log(canBeTypedWordsLoop("leet code", "e")); // 0
console.log(canBeTypedWordsLoop("hello world", "")); // 2
```

### Giải pháp 3: Regex approach

```typescript
function canBeTypedWordsRegex(text: string, brokenLetters: string): number {
  if (brokenLetters.length === 0) {
    return text.split(" ").length;
  }

  // Escape special regex characters in brokenLetters
  const escaped = brokenLetters.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`[${escaped}]`);

  return text.split(" ").filter((word) => !pattern.test(word)).length;
}

console.log(canBeTypedWordsRegex("hello world", "ad")); // 1
console.log(canBeTypedWordsRegex("leet code", "lt")); // 1
console.log(canBeTypedWordsRegex("hello world", "")); // 2
```

## Bảng so sánh

| Giải pháp   | Thời gian | Không gian | Ghi chú               |
| ----------- | --------- | ---------- | --------------------- |
| Set + every | O(n·m)    | O(k)       | Ngắn gọn, functional  |
| For Loop    | O(n·m)    | O(k)       | Early exit, rõ ràng   |
| Regex       | O(n·m)    | O(k)       | Linh hoạt với pattern |

n = text length, m = avg word length, k = brokenLetters length

## Bài liên quan

| #    | Tên                              | Độ khó | Tags       |
| ---- | -------------------------------- | ------ | ---------- |
| 859  | Buddy Strings                    | Easy   | Hash Table |
| 1832 | Check if the Sentence Is Pangram | Easy   | Hash Table |
| 2264 | Largest 3-Same-Digit Number      | Easy   | String     |
