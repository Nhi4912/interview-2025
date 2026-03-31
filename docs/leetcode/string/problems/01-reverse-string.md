---
layout: page
title: "Reverse String"
difficulty: Easy
category: String
tags: [String, Two Pointers]
leetcode_url: "https://leetcode.com/problems/reverse-string/"
---

# Reverse String / Đảo Ngược Chuỗi

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Warm-up classic, common in phone screens
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Reverse Integer](./02-reverse-integer.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng bạn lật ngược một xấp bài: cầm lá trên cùng và lá dưới cùng, đổi chỗ nhau, rồi tiến vào giữa. Không cần lá bài nào làm trung gian — chỉ hai tay và làm đến khi hai tay chạm nhau là xong.
- **Pattern Recognition:**
  - "In-place" + array + "O(1) extra memory" → Two Pointers thu hẹp từ hai đầu
  - Cần hoán đổi phần tử đối xứng → `left++`, `right--` đồng thời
  - Nếu bị cám dỗ dùng `.reverse()` hoặc stack → vi phạm ràng buộc O(1) space
- **Visual — Reverse `["h","e","l","l","o"]`:**

```
Initial: [ h   e   l   l   o ]
           ↑               ↑
          L=0             R=4    swap h ↔ o

Step 1:  [ o   e   l   l   h ]
               ↑       ↑
              L=1     R=3        swap e ↔ l

Step 2:  [ o   l   l   e   h ]
                   ↑↑
                  L=R=2          L >= R → stop ✓
```

## Problem Description

Write a function that reverses a character array **in-place** using O(1) extra memory.

```
Input:  s = ["h","e","l","l","o"]     → Output: ["o","l","l","e","h"]
Input:  s = ["H","a","n","n","a","h"] → Output: ["h","a","n","n","a","H"]
Input:  s = ["a"]                     → Output: ["a"]
```

## 📝 Interview Tips

1. **Clarify "in-place"** / Xác nhận không được tạo mảng mới — chỉ swap tại chỗ.
2. **O(1) space rules out recursion** / Đệ quy tốn O(n) call stack — vi phạm ràng buộc.
3. **Destructuring swap is idiomatic TypeScript** / `[a, b] = [b, a]` — gọn, không cần biến `temp`.
4. **Edge cases are auto-handled** / Mảng rỗng hoặc 1 phần tử: điều kiện `left < right` tự bỏ qua.
5. **Only traverse n/2 steps** / Chỉ duyệt n/2 lần — nếu interviewer hỏi, đây là điểm nhấn tối ưu.

## Solutions

```typescript
/**

- Solution 1 — Brute: Built-in reverse (not in-place in spirit, but modifies array)
- Time: O(n) Space: O(1) — acceptable but trivial; interviewer usually wants Solution 2
  */
  function reverseStringBuiltin(s: string[]): void {
  s.reverse();
  }

/**

- Solution 2 — Optimal: Two Pointers
- Time: O(n) Space: O(1)
- Swap from both ends, converge to center.
  */
  function reverseString(s: string[]): void {
  let left = 0;
  let right = s.length - 1;

while (left < right) {
[s[left], s[right]] = [s[right], s[left]];
left++;
right--;
}
}

// Inline tests
const t1 = ["h", "e", "l", "l", "o"];
reverseString(t1);
console.assert(t1.join("") === "olleh", "basic: expected olleh");

const t2 = ["H", "a", "n", "n", "a", "h"];
reverseString(t2);
console.assert(t2[0] === "h" && t2[5] === "H", "palindrome: first/last should swap");

const t3 = ["a"];
reverseString(t3);
console.assert(t3[0] === "a", "single char: should stay unchanged");

const t4: string[] = [];
reverseString(t4);
console.assert(t4.length === 0, "empty: should remain empty");
```

## 🔗 Related Problems

- [541. Reverse String II](https://leetcode.com/problems/reverse-string-ii/) — reverse k characters every 2k blocks
- [151. Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string/) — reverse at word level, not character
- [125. Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) — two-pointer converge pattern reused
- [02. Reverse Integer](./02-reverse-integer.md) — reversal at digit level with overflow check
