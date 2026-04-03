---
layout: page
title: "Type of Triangle"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Math, Sorting]
leetcode_url: "https://leetcode.com/problems/type-of-triangle"
---

# Type of Triangle / Loại Tam Giác

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Missing Number](https://leetcode.com/problems/missing-number) | [Maximum Product of Three Numbers](https://leetcode.com/problems/maximum-product-of-three-numbers)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như kiểm tra ba thanh gỗ có ghép thành tam giác không — sắp xếp ba cạnh rồi kiểm tra điều kiện tam giác (cạnh ngắn nhất + cạnh giữa > cạnh dài nhất) và tính vuông, cân, đều.

**Pattern Recognition:**

- Signal: ba số + phân loại hình học → sort + so sánh
- Key insight: sau khi sort `a<=b<=c`: valid nếu `a+b>c`; equilateral nếu `a==c`; isosceles nếu `a==b||b==c`; right nếu `a²+b²==c²`

**Visual — Type of Triangle example:**

```
nums = [3, 4, 5]
Sort: a=3, b=4, c=5

Step 1: valid? a+b > c → 3+4=7 > 5 ✓
Step 2: equilateral? a==c → 3≠5 ✗
Step 3: right? a²+b²==c² → 9+16=25==25 ✓ → "right"

nums = [3, 3, 3]
Sort: a=b=c=3
Step 1: valid? 3+3>3 ✓
Step 2: equilateral? 3==3 ✓ → "equilateral"

nums = [1, 1, 3]
Sort: a=1, b=1, c=3
Step 1: valid? 1+1=2 > 3? ✗ → "none"
```

---

## Problem Description

Given an integer array `nums` of length 3, return the **type of triangle** that can be formed from these three sides. Return one of: `"equilateral"`, `"isosceles"`, `"scalene"`, or `"none"` if no valid triangle.

- **Equilateral**: all three sides equal
- **Isosceles**: exactly two sides equal
- **Scalene**: all three sides different

Difficulty: Easy | Acceptance: 44.8%

```
Example 1:
  Input:  nums = [3,3,3]
  Output: "equilateral"

Example 2:
  Input:  nums = [3,4,5]
  Output: "scalene"

Example 3:
  Input:  nums = [1,1,3]
  Output: "none"

Example 4:
  Input:  nums = [5,5,3]
  Output: "isosceles"
```

Constraints:

- `nums.length == 3`
- `1 <= nums[i] <= 100`

---

## 📝 Interview Tips

1. **Clarify**: "Tam giác phải có diện tích > 0 không? Tức là a+b>c (nghiêm ngặt)?" / Confirm strict inequality: a+b > c, not >=.
2. **Sort first**: "Sắp xếp để luôn có a<=b<=c, chỉ cần kiểm tra a+b>c" / Sort so only one triangle inequality needs checking.
3. **Order of checks**: "Kiểm tra equilateral trước, rồi isosceles, rồi scalene" / Check equilateral first, then isosceles, else scalene.
4. **Right triangle note**: "Bài này không hỏi right triangle, nhưng phỏng vấn có thể hỏi thêm" / Problem doesn't ask for right triangle, but interviewer might ask as follow-up.
5. **Edge cases**: "Cạnh = 0? Constraints bảo >=1. Tràn số? 100\*100=10000 an toàn với int" / Min side=1 per constraints; no overflow risk.
6. **Follow-up**: "Nếu n cạnh thay vì 3? Cần sort + check n-gon validity differently" / For n sides, validity check changes.

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Classify
 * Time: O(1) — fixed 3 elements
 * Space: O(1) — constant space
 */
function triangleType(nums: number[]): string {
  nums.sort((a, b) => a - b);
  const [a, b, c] = nums;

  // Triangle validity: sum of two smaller sides > largest side
  if (a + b <= c) return "none";

  if (a === c) return "equilateral";
  if (a === b || b === c) return "isosceles";
  return "scalene";
}

/**
 * Solution 2: Without sorting (manually handle all cases)
 * Time: O(1)
 * Space: O(1)
 */
function triangleTypeNoSort(nums: number[]): string {
  const [x, y, z] = nums;

  // Check all three triangle inequalities
  if (x + y <= z || x + z <= y || y + z <= x) return "none";

  const distinct = new Set([x, y, z]).size;
  if (distinct === 1) return "equilateral";
  if (distinct === 2) return "isosceles";
  return "scalene";
}

/**
 * Solution 3: Extended — also identify right triangle
 * Time: O(1)
 * Space: O(1)
 */
function triangleTypeExtended(nums: number[]): string {
  nums.sort((a, b) => a - b);
  const [a, b, c] = nums;

  if (a + b <= c) return "none";

  const isRight = a * a + b * b === c * c;
  if (a === c) return "equilateral";
  if (a === b || b === c) return isRight ? "right isosceles" : "isosceles";
  return isRight ? "right scalene" : "scalene";
}

// === Test Cases ===
console.log(triangleType([3, 3, 3])); // "equilateral"
console.log(triangleType([3, 4, 5])); // "scalene"
console.log(triangleType([1, 1, 3])); // "none"
console.log(triangleType([5, 5, 3])); // "isosceles"
console.log(triangleTypeNoSort([3, 3, 3])); // "equilateral"
console.log(triangleTypeNoSort([5, 3, 5])); // "isosceles"
console.log(triangleTypeExtended([3, 4, 5])); // "right scalene"
```

---

## 🔗 Related Problems

- [Maximum Product of Three Numbers](https://leetcode.com/problems/maximum-product-of-three-numbers) — sort + pick extremes
- [Largest Perimeter Triangle](https://leetcode.com/problems/largest-perimeter-triangle) — sort + triangle inequality
- [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin) — sort by distance
- [Valid Triangle Number](https://leetcode.com/problems/valid-triangle-number) — count valid triangles from array
- [Type of Triangle — LeetCode](https://leetcode.com/problems/type-of-triangle) — problem page
