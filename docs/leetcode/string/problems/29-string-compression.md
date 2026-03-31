---
layout: page
title: "String Compression"
difficulty: Medium
category: String
tags: [Two Pointers, String]
leetcode_url: "https://leetcode.com/problems/string-compression"
---

# String Compression / Nén Chuỗi Ký Tự

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers (Read + Write In-Place)
> **Frequency**: 📘 Tier 3 — Gặp ở 19 companies
> **See also**: [Encode and Decode Strings](https://leetcode.com/problems/encode-and-decode-strings) | [Count and Say](https://leetcode.com/problems/count-and-say)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Giống như điểm danh học sinh trong lớp. Giáo viên gọi "An, An, An" → ghi "An×3". Cô ấy đọc danh sách từ trái (con trỏ đọc), đồng thời ghi rút gọn vào vở (con trỏ ghi). Con trỏ ghi luôn đi chậm hơn hoặc bằng con trỏ đọc — đó là kỹ thuật two-pointer in-place.

**Pattern Recognition:**

- Signal: "in-place" + "process groups of consecutive chars" → **Read/Write Two Pointers**
- `read` pointer duyệt mảng gốc, đếm nhóm liên tiếp
- `write` pointer ghi kết quả nén vào chính mảng đó (không cần extra space)

**Visual — chars = ['a','a','b','b','c','c','c']:**

```
read=0, write=0
Step 1: group 'a' from i=0..1, count=2
  → chars[write++] = 'a'   (write=1)
  → count>1: write '2'     → chars[write++] = '2' (write=2)
  → read = 2

Step 2: group 'b' from i=2..3, count=2
  → chars[2]='b', write=3
  → chars[3]='2', write=4
  → read = 4

Step 3: group 'c' from i=4..6, count=3
  → chars[4]='c', write=5
  → chars[5]='3', write=6
  → read = 7

Result array: ['a','2','b','2','c','3', ...], return write=6 ✅
```

---

## Problem Description

Given an array of characters `chars`, compress it in-place using run-length encoding. Each group of consecutive repeating characters is replaced by the character followed by the count (if > 1). Return the new length. The algorithm must modify `chars` in-place with O(1) extra space. ([LeetCode 443](https://leetcode.com/problems/string-compression))

```
Input: ['a','a','b','b','c','c','c']  → Output: 6, chars=['a','2','b','2','c','3']
Input: ['a']                          → Output: 1, chars=['a']
Input: ['a','b','b','b','b','b','b','b','b','b','b','b','b']
       → Output: 4, chars=['a','b','1','2']
```

Constraints: `1 <= chars.length <= 2000`, only lowercase/uppercase letters or digits

---

## 📝 Interview Tips

1. **Clarify**: "In-place nghĩa là không dùng extra array — chỉ O(1) space / In-place: no extra array, O(1) space allowed"
2. **Two-pointer roles**: "read đọc nhóm kế tiếp, write ghi kết quả — write ≤ read luôn luôn" / write always behind read
3. **Count digits**: "Count ≥ 10 cần ghi nhiều ký tự số, ví dụ count=12 → '1','2'" / Multi-digit counts need splitting
4. **Edge case**: "Count=1 thì không ghi số, chỉ ghi ký tự / Skip writing count if count == 1"
5. **Return value**: "Trả về vị trí write cuối, không phải độ dài mảng gốc" / Return write pointer, not original length
6. **Follow-up**: "Nếu cần giải nén? → dùng StringBuilder, reverse process" / Decompression is reverse process

---

## Solutions

```typescript
/**
 * Solution 1: Extra Space (for conceptual clarity)
 * Name: Build then Copy
 * Time: O(n) — one pass to build, one to copy back
 * Space: O(n) — result array
 */
function stringCompressionExtra(chars: string[]): number {
  const result: string[] = [];
  let i = 0;
  while (i < chars.length) {
    const ch = chars[i];
    let count = 0;
    while (i < chars.length && chars[i] === ch) {
      i++;
      count++;
    }
    result.push(ch);
    if (count > 1) result.push(...count.toString().split(""));
  }
  for (let j = 0; j < result.length; j++) chars[j] = result[j];
  return result.length;
}

/**
 * Solution 2: In-Place Two Pointers (Optimal)
 * Name: Two Pointers In-Place
 * Time: O(n) — single pass
 * Space: O(1) — only pointer variables
 */
function compress(chars: string[]): number {
  let read = 0; // scans through the original array
  let write = 0; // writes compressed result back in-place

  while (read < chars.length) {
    const ch = chars[read];
    let count = 0;

    // count consecutive same characters
    while (read < chars.length && chars[read] === ch) {
      read++;
      count++;
    }

    // write the character
    chars[write++] = ch;

    // write the count only if > 1
    if (count > 1) {
      for (const digit of count.toString()) {
        chars[write++] = digit;
      }
    }
  }

  return write; // new length of compressed array
}

// === Test Cases ===
const t1 = ["a", "a", "b", "b", "c", "c", "c"];
console.log(compress(t1), t1.slice(0, 6).join("")); // 6, "a2b2c3"

const t2 = ["a"];
console.log(compress(t2), t2[0]); // 1, "a"

const t3 = ["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"];
console.log(compress(t3), t3.slice(0, 4).join("")); // 4, "ab12"

const t4 = ["a", "a", "a", "a", "a", "a", "a", "a", "a", "a"];
console.log(compress(t4), t4.slice(0, 3).join("")); // 3, "a10"
```

---

## 🔗 Related Problems

| Problem                                                                                                  | Relationship                                   |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [Count and Say](https://leetcode.com/problems/count-and-say)                                             | Same run-length encoding, returns new string   |
| [Decode String](https://leetcode.com/problems/decode-string)                                             | Reverse: expand compressed format              |
| [Run-Length Encoding](https://leetcode.com/problems/design-compressed-string-iterator)                   | Iterator over compressed RLE string            |
| [Reverse String](https://leetcode.com/problems/reverse-string)                                           | Same in-place two-pointer modification pattern |
| [Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array) | Same read/write pointer in-place technique     |
