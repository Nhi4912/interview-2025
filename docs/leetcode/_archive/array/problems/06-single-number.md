---
layout: page
title: "Single Number"
difficulty: Easy
category: Array
tags: [Array, Bit Manipulation, Hash Table]
leetcode_url: "https://leetcode.com/problems/single-number/"
---

# Single Number / Tìm Số Đơn Lẻ

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Bit Manipulation (XOR)  
> **Frequency**: 📗 Tier 2 — Bit manipulation favorite, tests XOR insight  
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Contains Duplicate](05-contains-duplicate.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Bạn có một hộp bài, mỗi lá bài đều có một lá đôi — trừ một lá duy nhất. Bài XOR giống như ghép đôi: mỗi cặp giống nhau tự triệt tiêu nhau (`a ^ a = 0`), số còn lại chính là số đơn lẻ (`0 ^ x = x`). Không cần nhớ cặp nào — chỉ cần XOR tất cả.

- **Pattern Recognition:**
  - "Appears twice except one" + O(1) space constraint → **XOR** (pairs cancel, single survives)
  - `a ^ a = 0` và `a ^ 0 = a` và XOR có tính giao hoán → thứ tự không quan trọng
  - Nếu không có O(1) space constraint → Set (toggle thêm/xóa) hoặc Map (đếm tần suất)

- **Visual — XOR Cancellation:**

```
nums = [4, 1, 2, 1, 2]

Step: 0 ^ 4 = 4
      4 ^ 1 = 5
      5 ^ 2 = 7
      7 ^ 1 = 6   (1^1 = 0, cancels)
      6 ^ 2 = 4   (2^2 = 0, cancels)

Result = 4  ✓

Why it works:
  1 ^ 1 ^ 2 ^ 2 ^ 4
= (1^1) ^ (2^2) ^ 4
=   0   ^   0   ^ 4
= 4
```

## Problem Description

Given a **non-empty** array where every element appears **twice** except for one, find the single element. Must be O(n) time and O(1) space.

```
Input:  [2, 2, 1]       → 1
Input:  [4, 1, 2, 1, 2] → 4
Input:  [1]             → 1
```

## 📝 Interview Tips

1. **Giải thích XOR**: `a^a=0`, `a^0=a`, XOR có giao hoán và kết hợp → các cặp triệt tiêu / **Explain XOR**: same bits cancel (`a^a=0`), zero is identity (`0^x=x`)
2. **Tại sao không dùng Set?**: Set/Map dùng O(n) space — bài yêu cầu O(1) / **Why not Set**: violates O(1) space constraint — XOR is the elegant solution
3. **Set approach vẫn hợp lệ nếu không ràng buộc space**: Toggle — thêm nếu chưa có, xóa nếu đã có / **Set toggle** is valid without space constraint — worth mentioning as alternative
4. **Math approach**: `2×sum(unique) - sum(all)` cũng O(n) time nhưng có thể overflow / **Math trick**: `2*uniqueSum - totalSum` but risks integer overflow
5. **Edge case duy nhất**: Single element `[x]` → returns `x` (XOR with 0 = x)
6. **Follow-up**: "Every element appears 3 times except one?" → bit count mod 3 per bit position (Single Number II)

## Solutions

```typescript
/**

- Solution 1: XOR — Optimal
- Time: O(n) | Space: O(1)
- Key insight: a^a=0, 0^a=a → pairs cancel, single survives
  */
  function singleNumber(nums: number[]): number {
  let result = 0;

for (const num of nums) {
result ^= num;
}

return result;
}

/**

- Solution 2: Set Toggle — Brute Force (O(n) space, no early exit)
- Time: O(n) | Space: O(n)
- Good to mention as alternative when space constraint is relaxed
  */
  function singleNumberSet(nums: number[]): number {
  const seen = new Set<number>();

for (const num of nums) {
if (seen.has(num)) seen.delete(num);
else seen.add(num);
}

return seen.values().next().value;
}

// Inline tests
console.log(singleNumber([2, 2, 1]) === 1); // true
console.log(singleNumber([4, 1, 2, 1, 2]) === 4); // true
console.log(singleNumber([1]) === 1); // true
console.log(singleNumber([-1, -1, -2]) === -2); // true
```

## 🔗 Related Problems

| Problem                                                                  | Relationship                                                        |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| [#05 Contains Duplicate](05-contains-duplicate.md)                       | Sibling uniqueness problem — Set vs XOR approaches                  |
| [#04 Two Sum](04-two-sum.md)                                             | Hash table lookup — the O(n) space alternative this problem avoids  |
| [#09 Move Zeroes](09-move-zeroes.md)                                     | Array traversal with single-pass state                              |
| [#07 Intersection of Two Arrays II](07-intersection-of-two-arrays-ii.md) | Frequency counting complement — what happens when frequency matters |
