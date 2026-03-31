---
layout: page
title: "Reverse Prefix of Word"
difficulty: Easy
category: String
tags: [Two Pointers, String, Stack]
leetcode_url: "https://leetcode.com/problems/reverse-prefix-of-word"
---

# Reverse Prefix of Word / Đảo Ngược Tiền Tố Của Từ

## Tóm tắt bằng tiếng Việt

Cho chuỗi `word` và ký tự `ch`. Tìm vị trí đầu tiên của `ch` trong `word`, rồi đảo ngược phần từ đầu đến vị trí đó (inclusive). Nếu không tìm thấy `ch`, giữ nguyên `word`.

**Ví dụ:** `word = "abcdefd"`, `ch = 'd'` → vị trí `d` đầu tiên là 3 → đảo ngược `"abcd"` → `"dcba"` → kết quả `"dcbaefd"`.

## Tương tự thực tế

> Như lật một đoạn băng tải: tìm ô đầu tiên có nhãn `ch`, lật toàn bộ đoạn từ đầu đến ô đó. Các ô sau không bị ảnh hưởng.

## Minh họa ASCII

```
word = "abcdefd", ch = 'd'
         0123456

Step 1: Find first 'd' → index 3
Step 2: Reverse word[0..3] = "abcd" → "dcba"
Step 3: Concatenate "dcba" + "efd"

Before: a b c d e f d
                ↑ first 'd' at index 3
After:  d c b a e f d
```

## Mô tả bài toán

- Tìm chỉ số `i` của lần xuất hiện đầu tiên của `ch` trong `word`.
- Đảo ngược chuỗi con `word[0..i]`.
- Nếu `ch` không xuất hiện, trả về `word` không thay đổi.

**Constraints:** `1 <= word.length <= 250`, `word` và `ch` chỉ chứa chữ thường.

## Tips phỏng vấn

1. **indexOf** — dùng `indexOf(ch)` để tìm vị trí đầu tiên nhanh nhất.
2. **Slice + reverse** — `word.slice(0, i+1).split('').reverse().join('')`.
3. **Two pointers** — dùng 2 con trỏ đầu/cuối để đảo ngược tại chỗ (in-place nếu là array).
4. **Edge case** — `ch` không tồn tại → trả về nguyên `word`.
5. **ch ở đầu** — nếu `i = 0`, đảo ngược 1 ký tự = không thay đổi.
6. **String immutable** — trong JS, cần convert sang array để đảo ngược.

## Giải pháp

### Giải pháp 1: indexOf + Slice (Ngắn gọn)

```typescript
function reversePrefix(word: string, ch: string): string {
  const idx = word.indexOf(ch);
  if (idx === -1) return word;

  // Reverse prefix [0..idx] then append the rest
  const prefix = word
    .slice(0, idx + 1)
    .split("")
    .reverse()
    .join("");
  return prefix + word.slice(idx + 1);
}

// Test cases
console.log(reversePrefix("abcdefd", "d")); // "dcbaefd"
console.log(reversePrefix("xyxzxe", "z")); // "zxyxxe"
console.log(reversePrefix("abcd", "z")); // "abcd" (not found)
console.log(reversePrefix("a", "a")); // "a"
console.log(reversePrefix("abcdefd", "a")); // "abcdefd" (reverse single char)
```

### Giải pháp 2: Two Pointers (In-place trên Array)

```typescript
function reversePrefixTwoPtr(word: string, ch: string): string {
  const arr = word.split("");
  let right = -1;

  // Find first occurrence of ch
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === ch) {
      right = i;
      break;
    }
  }

  if (right === -1) return word;

  // Two pointer reverse
  let left = 0;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }

  return arr.join("");
}

console.log(reversePrefixTwoPtr("abcdefd", "d")); // "dcbaefd"
console.log(reversePrefixTwoPtr("xyxzxe", "z")); // "zxyxxe"
console.log(reversePrefixTwoPtr("abcd", "z")); // "abcd"
```

### Giải pháp 3: Stack

```typescript
function reversePrefixStack(word: string, ch: string): string {
  const idx = word.indexOf(ch);
  if (idx === -1) return word;

  // Use stack to reverse prefix
  const stack: string[] = [];
  for (let i = 0; i <= idx; i++) stack.push(word[i]);

  let result = "";
  while (stack.length > 0) result += stack.pop();
  result += word.slice(idx + 1);

  return result;
}

console.log(reversePrefixStack("abcdefd", "d")); // "dcbaefd"
console.log(reversePrefixStack("xyxzxe", "z")); // "zxyxxe"
```

## Bảng so sánh

| Giải pháp       | Thời gian | Không gian | Ghi chú        |
| --------------- | --------- | ---------- | -------------- |
| indexOf + slice | O(n)      | O(n)       | Ngắn gọn nhất  |
| Two Pointers    | O(n)      | O(n)       | In-place logic |
| Stack           | O(n)      | O(n)       | Trực quan      |

## Bài liên quan

| #   | Tên                  | Độ khó | Tags         |
| --- | -------------------- | ------ | ------------ |
| 344 | Reverse String       | Easy   | Two Pointers |
| 541 | Reverse String II    | Easy   | String       |
| 917 | Reverse Only Letters | Easy   | Two Pointers |
