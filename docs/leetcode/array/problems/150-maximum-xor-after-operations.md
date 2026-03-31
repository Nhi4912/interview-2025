---
layout: page
title: "Maximum XOR After Operations"
difficulty: Medium
category: Array
tags: [Array, Math, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/maximum-xor-after-operations"
---

# Maximum XOR After Operations / XOR Tối Đa Sau Các Phép Toán

**Difficulty:** Medium | **Category:** Array, Bit Manipulation | **LeetCode:** [2317](https://leetcode.com/problems/maximum-xor-after-operations)

## 🧠 Intuition

> **Mỗi bít là một chiếc đèn độc lập — ta muốn bật tất cả.**
> Phép AND cho phép xoá bít (không thể thêm). XOR kết quả tối đa khi mỗi bít bật ở đúng 1 vị trí.

```
nums = [3, 2, 4, 6]
       011, 010, 100, 110

OR = 111 = 7  ← tất cả bits có thể đạt được
XOR = nums[0] ^ nums[1] ^ nums[2] ^ nums[3] = 3^2^4^6 = 1 (mặc định)

Nhưng: ta có thể AND nums[i] với bất kỳ x → clear bít dư thừa
Goal: dùng AND để làm mỗi bit chỉ xuất hiện ở 1 phần tử → XOR = OR
```

Vì `nums[i] = nums[i] AND x` chỉ có thể **xoá bít**, nên tập hợp bit có thể đạt được là OR của tất cả. Đáp án = `OR(nums)`.

## 📝 Tips

1. **Phép AND không thể tạo bít mới** — chỉ có thể xoá bít đang có.
2. **XOR tối đa khi** mỗi bít bật ở đúng số lẻ phần tử (preferably chỉ 1).
3. **OR của mảng** = tập hợp tất cả bít khả dụng = upper bound của XOR.
4. Upper bound này **luôn đạt được**: AND các phần tử khác để chỉ 1 phần tử giữ mỗi bít.
5. Không cần simulate — chỉ cần `reduce((a, b) => a | b, 0)`.
6. Đây là bài "insight" — một khi hiểu tại sao OR = answer, code chỉ 1 dòng.

## 💡 Solutions

```typescript
/**
 * Approach 1: Direct insight — answer is OR of all nums
 * Time: O(n) | Space: O(1)
 *
 * Operation: nums[i] = nums[i] AND x (any x). AND can only clear bits.
 * Each bit in OR(nums) can be isolated to exactly one element → XOR = OR.
 */
function maximumXOR(nums: number[]): number {
  return nums.reduce((acc, n) => acc | n, 0);
}

console.log(maximumXOR([3, 2, 4, 6])); // 7  (011|010|100|110 = 111)
console.log(maximumXOR([1, 2, 3])); // 3  (01|10|11 = 11)
console.log(maximumXOR([0])); // 0
console.log(maximumXOR([5, 4])); // 5  (101|100 = 101)
```

```typescript
/**
 * Approach 2: Bit-by-bit OR loop (explicit, shows thinking)
 * Time: O(n * 30) | Space: O(1)
 *
 * For each of 30 bits: if ANY number has it, it's achievable in XOR.
 * AND-zero all other elements at that bit position → that bit contributes 1 to XOR.
 */
function maximumXOR2(nums: number[]): number {
  let result = 0;
  for (let bit = 0; bit < 30; bit++) {
    for (const n of nums) {
      if (n & (1 << bit)) {
        result |= 1 << bit; // this bit is achievable
        break;
      }
    }
  }
  return result;
}

console.log(maximumXOR2([3, 2, 4, 6])); // 7
console.log(maximumXOR2([1, 2, 3])); // 3
console.log(maximumXOR2([8, 4, 2, 1])); // 15 (all bits distinct, OR=1111)
```

```typescript
/**
 * Approach 3: Iterative OR (loop alternative to reduce)
 * Time: O(n) | Space: O(1)
 */
function maximumXOR3(nums: number[]): number {
  let ans = 0;
  for (const n of nums) ans |= n;
  return ans;
}

console.log(maximumXOR3([3, 2, 4, 6])); // 7
console.log(maximumXOR3([0, 0, 0])); // 0
console.log(maximumXOR3([7])); // 7  (single element)
```

## 🔗 Related

| Problem                                                                                                                                                                       | Difficulty | Connection               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------ |
| [421. Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/)                                                          | Medium     | Maximizing XOR           |
| [2654. Minimum Number of Operations to Make All Array Elements Equal to 1](https://leetcode.com/problems/minimum-number-of-operations-to-make-all-array-elements-equal-to-1/) | Medium     | Bit manipulation insight |
| [1835. Find XOR Sum of All Pairs Bitwise AND](https://leetcode.com/problems/find-xor-sum-of-all-pairs-bitwise-and/)                                                           | Hard       | XOR + AND interaction    |
