---
layout: page
title: "Check if Binary String Has at Most One Segment of Ones"
difficulty: Easy
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/check-if-binary-string-has-at-most-one-segment-of-ones"
---

# Check if Binary String Has at Most One Segment of Ones / Kiểm Tra Chuỗi Nhị Phân Có Nhiều Nhất Một Đoạn 1

🟢 Easy | 🏷️ String

## 🧠 Intuition

**VI:** Nếu chuỗi có **nhiều hơn một đoạn 1**, nghĩa là có ít nhất một '0' xuất hiện **sau** một '1'. Khi đó sẽ tồn tại mẫu `"10"` trong chuỗi — nghĩa là sau đoạn 1 đầu tiên có '0', và sau đó lại có '1'. Điều kiện đủ và cần: không chứa `"01"` (sau khi đã có đoạn 1 rồi gặp 0, rồi lại gặp 1).

**EN:** The string starts with '1' (guaranteed). A second segment of ones exists iff there's a '0' followed later by a '1' — i.e., the pattern `"01"` exists.

```
"1101"  → contains "01" → TWO segments → false
 11 0 1
    ^^ found "01" pattern!

"111"   → no "01" → ONE segment → true
"1100"  → no "01" after 0s → true (just trailing zeros)
"10101" → "01" at index 1 → false
```

## 📝 Interview Tips

- 🇻🇳 **Trick ngắn gọn:** `!s.includes("01")` — đủ để giải quyết toàn bộ bài toán
- 🇬🇧 **Key insight:** string always starts with '1', so "01" means a new segment started after a gap
- 🇻🇳 **Tại sao không phải "10"?** `"10"` chỉ kết thúc đoạn, `"01"` mới là bắt đầu đoạn mới
- 🇬🇧 **Why not check "10"?** "10" ends a segment; "01" begins a NEW one after a zero gap
- 🇻🇳 **Cách khác:** đếm số đoạn `1` bằng cách đếm transitions `0→1`
- 🇬🇧 **Alternative:** count `0→1` transitions; at most one means answer is true

## Solutions

### Solution 1: Check for "01" substring

```typescript
/**
 * If "01" exists, a second block of ones started after zeros.
 * Time: O(n) | Space: O(1)
 */
function checkOnesSegment(s: string): boolean {
  return !s.includes("01");
}

console.log(checkOnesSegment("1001")); // false — "01" found
console.log(checkOnesSegment("110")); // true  — no "01"
console.log(checkOnesSegment("1")); // true
console.log(checkOnesSegment("10101")); // false
console.log(checkOnesSegment("11100")); // true
```

### Solution 2: Count 0→1 transitions

```typescript
/**
 * Count the number of times we go from '0' to '1'.
 * At most one such transition means at most one segment.
 * Time: O(n) | Space: O(1)
 */
function checkOnesSegment2(s: string): boolean {
  let transitions = 0;
  for (let i = 1; i < s.length; i++) {
    if (s[i - 1] === "0" && s[i] === "1") {
      transitions++;
    }
  }
  return transitions === 0;
}

console.log(checkOnesSegment2("1001")); // false (one 0→1 at index 3)
console.log(checkOnesSegment2("110")); // true  (no 0→1)
console.log(checkOnesSegment2("10101")); // false (two 0→1 transitions)
```

### Solution 3: Regex segment count

```typescript
/**
 * Split by '0+' and count non-empty '1' segments.
 * Time: O(n) | Space: O(n)
 */
function checkOnesSegment3(s: string): boolean {
  const segments = s.split(/0+/).filter((seg) => seg.length > 0);
  return segments.length <= 1;
}

console.log(checkOnesSegment3("1001")); // false (2 segments)
console.log(checkOnesSegment3("1110000")); // true  (1 segment)
console.log(checkOnesSegment3("0")); // true  (0 segments)
```

## 🔗 Related Problems

| #    | Problem                                                | Difficulty | Key Idea                |
| ---- | ------------------------------------------------------ | ---------- | ----------------------- |
| 1784 | Check if Binary String Has at Most One Segment of Ones | 🟢 Easy    | This problem            |
| 1869 | Longer Contiguous Segments of Ones                     | 🟢 Easy    | Compare segment lengths |
| 926  | Flip String to Monotone Increasing                     | 🟡 Medium  | Segment transitions DP  |
