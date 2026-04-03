---
layout: page
title: "Special Array I"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/special-array-i"
---

# Special Array I / Mảng Đặc Biệt I

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Array Traversal
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Special Array II](https://leetcode.com/problems/special-array-ii) | [Check Array Formation Through Concatenation](https://leetcode.com/problems/check-array-formation-through-concatenation)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng một hàng đèn giao thông: đỏ (chẵn) và xanh (lẻ) phải xen kẽ nhau — không được có hai đèn cùng màu đứng cạnh nhau. Mảng được gọi là "đặc biệt" nếu mỗi cặp đèn liền kề luôn khác màu. Ta chỉ cần đi qua hàng đèn một lần và kiểm tra từng cặp kề nhau có đúng quy tắc không.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Special Array I example:**

```
nums = [2, 1, 4]
       E  O  E     E=Even, O=Odd

Pair (2,1): E-O → different parity ✓
Pair (1,4): O-E → different parity ✓
→ Special: true

nums = [4, 3, 1, 6]
       E  O  O  E

Pair (4,3): E-O ✓
Pair (3,1): O-O ✗ ← FAIL
→ Special: false

Key check: nums[i] % 2 !== nums[i+1] % 2
           ↔ (nums[i] + nums[i+1]) % 2 === 1
           ↔ nums[i] % 2 !== nums[i+1] % 2
```

---

## Problem Description

An array is **special** if every pair of its adjacent elements contains two numbers with different parity. Given an integer array `nums`, return `true` if it is special, `false` otherwise.

**Example 1:** `nums = [1]` → `true` (no adjacent pairs)
**Example 2:** `nums = [2,1,4]` → `true`
**Example 3:** `nums = [4,3,1,6]` → `false`

**Constraints:** `1 ≤ nums.length ≤ 100`, `1 ≤ nums[i] ≤ 100`

---

## 📝 Interview Tips

- **Parity check** / Kiểm tra tính chẵn lẻ: `nums[i] % 2 !== nums[i+1] % 2` là điều kiện cốt lõi
- **Single pass** / Một lần duyệt: O(n) với early exit khi tìm vi phạm đầu tiên
- **Bitwise shortcut** / Phím tắt bit: `(nums[i] & 1) !== (nums[i+1] & 1)` — nhanh hơn modulo
- **Edge case** / Trường hợp đặc biệt: Mảng 1 phần tử → always `true` (không có cặp kề)
- **Sum parity trick** / Mẹo tổng: `(a+b) % 2 === 1` ↔ a và b khác tính chẵn lẻ
- **Follow-up** / Mở rộng: Special Array II hỏi cho từng query range — cần prefix sum để O(1)/query

---

## Solutions

```typescript
/**
 * @complexity Time: O(n) | Space: O(1)
 * Check each adjacent pair has different parity
 */
function isArraySpecial(nums: number[]): boolean {
  for (let i = 0; i < nums.length - 1; i++) {
    if ((nums[i] & 1) === (nums[i + 1] & 1)) return false;
  }
  return true;
}

/**
 * @complexity Time: O(n) | Space: O(1)
 * Using Array.prototype.every for declarative style
 */
function isArraySpecialFunctional(nums: number[]): boolean {
  return nums.every((val, i) => i === nums.length - 1 || val % 2 !== nums[i + 1] % 2);
}

/**
 * @complexity Time: O(n) | Space: O(1)
 * XOR of adjacent elements is odd iff they have different parity
 */
function isArraySpecialXor(nums: number[]): boolean {
  for (let i = 0; i < nums.length - 1; i++) {
    // XOR is odd (bit 0 = 1) iff exactly one of them is odd
    if (((nums[i] ^ nums[i + 1]) & 1) === 0) return false;
  }
  return true;
}

// === Test Cases ===
console.log(isArraySpecial([1])); // → true (single element)
console.log(isArraySpecial([2, 1, 4])); // → true
console.log(isArraySpecial([4, 3, 1, 6])); // → false
console.log(isArraySpecial([2, 4, 6])); // → false (all even)
console.log(isArraySpecial([1, 3, 5])); // → false (all odd)
console.log(isArraySpecialFunctional([2, 1, 4])); // → true
```

---

## 🔗 Related Problems

| Problem                              | Difficulty | Link                                                                          |
| ------------------------------------ | ---------- | ----------------------------------------------------------------------------- |
| Special Array II                     | Medium     | [LC 3152](https://leetcode.com/problems/special-array-ii)                     |
| Check if Array Is Sorted and Rotated | Easy       | [LC 1752](https://leetcode.com/problems/check-if-array-is-sorted-and-rotated) |
| Monotonic Array                      | Easy       | [LC 896](https://leetcode.com/problems/monotonic-array)                       |
