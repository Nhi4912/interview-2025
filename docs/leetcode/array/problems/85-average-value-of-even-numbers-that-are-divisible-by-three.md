---
layout: page
title: "Average Value of Even Numbers That Are Divisible by Three"
difficulty: Easy
category: Array
tags: [Array, Math]
leetcode_url: "https://leetcode.com/problems/average-value-of-even-numbers-that-are-divisible-by-three"
---

# Average Value of Even Numbers That Are Divisible by Three / Giá Trị Trung Bình Của Số Chẵn Chia Hết Cho Ba

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Find Numbers with Even Number of Digits](https://leetcode.com/problems/find-numbers-with-even-number-of-digits) | [Count Odd Numbers in an Interval Range](https://leetcode.com/problems/count-odd-numbers-in-an-interval-range)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bộ lọc cà phê — chỉ lấy những hạt thỏa mãn cả hai điều kiện: chẵn VÀ chia hết cho 3. Số chẵn chia hết cho 3 ↔ chia hết cho 6 (LCM của 2 và 3 là 6).

```
nums = [1, 3, 6, 10, 12, 15]
Check each number mod 6:
  1  → 1%6 = 1 ✗
  3  → 3%6 = 3 ✗
  6  → 6%6 = 0 ✓  sum+=6,  count=1
  10 → 10%6= 4 ✗
  12 → 12%6= 0 ✓  sum+=12, count=2
  15 → 15%6= 3 ✗
Average = floor(18 / 2) = 9
```

---

## Problem Description

Given an integer array `nums`, return the **average value** (truncated toward zero) of all numbers that are **even** and **divisible by 3**. If no such numbers exist, return `0`.

- Example 1: `nums = [1,3,6,10,12,15]` → `9` (qualifying: [6,12], avg = floor(18/2) = 9)
- Example 2: `nums = [1,2,4,7,10]` → `0` (no numbers divisible by 6)

Constraints: `1 <= nums.length <= 1000`, `1 <= nums[i] <= 1000`

---

## 📝 Interview Tips

1. **Key insight / Chìa khóa**: "Chẵn VÀ chia hết 3 ↔ chia hết 6 — gộp hai điều kiện thành một phép kiểm tra" / `n % 6 === 0` is equivalent to both conditions simultaneously.
2. **Clarify / Làm rõ**: "Trung bình làm tròn xuống (truncate về 0)?" / Confirm integer truncation — `Math.floor` works for positive numbers.
3. **Zero guard / Tránh chia 0**: "Khi không có số nào thỏa mãn → trả về 0, không chia cho 0" / Always check `count > 0` before dividing.
4. **Simplify / Đơn giản hóa**: "Thay vì lọc rồi tính, cộng dồn và đếm trực tiếp trong một vòng lặp" / Accumulate sum + count in one pass, no extra array needed.
5. **Complexity / Độ phức tạp**: "O(n) time, O(1) space — không cần mảng phụ" / Single pass through input, constant extra space.
6. **Follow-up / Câu hỏi tiếp theo**: "Nếu điều kiện thay đổi: chia hết k? Hoặc chia dư r?" / Parameterize by passing the divisor; remainder `r` just changes the filter condition.

---

## Solutions

```typescript
/**
 * Solution 1: Filter then average (clearest intent, easier to read)
 * Time: O(n) — one filter pass + reduce
 * Space: O(k) — k qualifying numbers stored in array
 */
function averageValue(nums: number[]): number {
  const qualifying = nums.filter((n) => n % 6 === 0);
  if (qualifying.length === 0) return 0;
  const sum = qualifying.reduce((acc, n) => acc + n, 0);
  return Math.floor(sum / qualifying.length);
}

/**
 * Solution 2: Single pass accumulate (optimal, no extra array)
 * Time: O(n) — single pass through nums
 * Space: O(1) — just two integer variables
 */
function averageValueOptimal(nums: number[]): number {
  let sum = 0,
    count = 0;
  for (const n of nums) {
    if (n % 6 === 0) {
      sum += n;
      count++;
    }
  }
  return count === 0 ? 0 : Math.floor(sum / count);
}

/**
 * Solution 3: Functional reduce (one-liner style)
 * Time: O(n) — reduce with accumulator
 * Space: O(1) — accumulator object only
 */
function averageValueReduce(nums: number[]): number {
  const { sum, count } = nums.reduce(
    (acc, n) => (n % 6 === 0 ? { sum: acc.sum + n, count: acc.count + 1 } : acc),
    { sum: 0, count: 0 },
  );
  return count === 0 ? 0 : Math.floor(sum / count);
}

// === Test Cases ===
console.log(averageValue([1, 3, 6, 10, 12, 15])); // 9
console.log(averageValue([1, 2, 4, 7, 10])); // 0
console.log(averageValueOptimal([6, 12, 18])); // 12
console.log(averageValueOptimal([1, 1, 1])); // 0
console.log(averageValueReduce([6, 6, 6])); // 6
```

---

## 🔗 Related Problems

| Problem                                                                                                                                          | Pattern             | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- | ---------- |
| [Count Odd Numbers in an Interval Range](https://leetcode.com/problems/count-odd-numbers-in-an-interval-range)                                   | Math divisibility   | 🟢 Easy    |
| [Find Numbers with Even Number of Digits](https://leetcode.com/problems/find-numbers-with-even-number-of-digits)                                 | Filter + count      | 🟢 Easy    |
| [Sum of Unique Elements](https://leetcode.com/problems/sum-of-unique-elements)                                                                   | Filter + aggregate  | 🟢 Easy    |
| [Average Salary Excluding the Minimum and Maximum Salary](https://leetcode.com/problems/average-salary-excluding-the-minimum-and-maximum-salary) | Conditional average | 🟢 Easy    |
