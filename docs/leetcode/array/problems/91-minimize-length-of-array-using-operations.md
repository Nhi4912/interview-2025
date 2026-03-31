---
layout: page
title: "Minimize Length of Array Using Operations"
difficulty: Medium
category: Array
tags: [Array, Math, Greedy, Number Theory]
leetcode_url: "https://leetcode.com/problems/minimize-length-of-array-using-operations"
---

# Minimize Length of Array Using Operations / Thu Gọn Độ Dài Mảng Bằng Phép Toán

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Number Theory
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Make K-Subarray Sums Equal](https://leetcode.com/problems/make-k-subarray-sums-equal) | [Check If It Is a Good Array](https://leetcode.com/problems/check-if-it-is-a-good-array)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống như chia bánh — nếu còn miếng bánh nào không chia đều được cho mảnh nhỏ nhất, bạn có thể tạo ra một mảnh còn nhỏ hơn từ phép chia dư, dùng nó để "xoá" tất cả.

**Key Insight:** Tìm giá trị nhỏ nhất `m = min(nums)`. Nếu có bất kỳ phần tử nào `nums[i] % m != 0`, ta có thể tạo ra phần tử < m và dùng nó thu gọn mảng về 1 phần tử. Ngược lại, chỉ giữ lại các bản sao của m.

```
nums = [2, 3, 4]:  min=2
  3 % 2 = 1 ≠ 0  →  có thể tạo giá trị < min
  → dùng 1 làm "chia chung", thu gọn tất cả → length = 1

nums = [2, 4, 8]:  min=2, all % 2 == 0
  → không thể tạo giá trị < 2
  → chỉ giữ count(2) = 1 → length = 1

nums = [2, 2, 4]:  min=2, all % 2 == 0
  → count(min=2) = 2 → length = 2
```

---

## Problem Description

Given a 0-indexed integer array `nums`, in one operation pick indices `i ≠ j` where `nums[i] % nums[j] != 0`, then set `nums[i] = nums[i] % nums[j]`. Return the **minimum possible length** of the array after any number of operations.

- Example 1: `nums = [1,4,3,1]` → `2` (min=1, all divisible by 1, count(1)=2)
- Example 2: `nums = [5,5,5,10,5]` → `4` (min=5, all divisible by 5, count(5)=4)

**Constraints:** `1 <= nums.length <= 10^5`, `1 <= nums[i] <= 10^9`

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Có thể thực hiện bao nhiêu phép? Phần tử có thể bị xoá không?" / Confirm unlimited ops, when elements reach min they stay.
2. **Key observation**: "Phần tử nhỏ nhất không thể bị thu nhỏ bởi bất kỳ phần tử nào" / Min element is irreducible.
3. **Branch**: "Chia hai trường hợp: tất cả chia hết cho min hay không" / Two cases on divisibility by min.
4. **Edge case**: "Mảng một phần tử — luôn trả về 1" / Single element always returns 1.
5. **Complexity**: "O(n) time, O(1) space — không cần sort" / Linear scan, constant space.
6. **Follow-up**: "Nếu cần GCD thực sự? Dùng Euclidean algorithm" / Use gcd() for exact GCD computation.

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force Counting
 * Time: O(n) — single pass to find min, second pass to count
 * Space: O(1) — no extra storage
 */
function minimizeLengthBrute(nums: number[]): number {
  const minVal = Math.min(...nums);
  // If any element is not divisible by minVal, we can create a smaller element
  for (const n of nums) {
    if (n % minVal !== 0) return 1;
  }
  // All divisible by min → can only keep copies of min
  return nums.filter((n) => n === minVal).length;
}

console.log(minimizeLengthBrute([1, 4, 3, 1])); // 2
console.log(minimizeLengthBrute([5, 5, 5, 10, 5])); // 4
console.log(minimizeLengthBrute([2, 3, 4])); // 1

/**
 * Solution 2: Optimized — Single Pass
 * Time: O(n) — one pass, no filter allocation
 * Space: O(1)
 *
 * Insight: if gcd(all) == min, answer = count(min). Else answer = 1.
 * Checking "any element not divisible by min" ≡ checking gcd < min.
 */
function minimizeLength(nums: number[]): number {
  let minVal = nums[0];
  for (const n of nums) if (n < minVal) minVal = n;

  let minCount = 0;
  let allDivisible = true;

  for (const n of nums) {
    if (n === minVal) minCount++;
    else if (n % minVal !== 0) {
      allDivisible = false;
      break; // early exit: can always reduce to 1
    }
  }

  return allDivisible ? minCount : 1;
}

console.log(minimizeLength([1, 4, 3, 1])); // 2
console.log(minimizeLength([5, 5, 5, 10, 5])); // 4
console.log(minimizeLength([2, 3, 4])); // 1
console.log(minimizeLength([6, 6, 6])); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                                                        | Pattern       | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------- |
| [Make K-Subarray Sums Equal](https://leetcode.com/problems/make-k-subarray-sums-equal)                                                         | Greedy + GCD  | Medium     |
| [Check If It Is a Good Array](https://leetcode.com/problems/check-if-it-is-a-good-array)                                                       | Number Theory | Hard       |
| [Rabbits in Forest](https://leetcode.com/problems/rabbits-in-forest)                                                                           | Greedy        | Medium     |
| [Smallest Missing Non-negative Integer After Operations](https://leetcode.com/problems/smallest-missing-non-negative-integer-after-operations) | Greedy        | Medium     |
