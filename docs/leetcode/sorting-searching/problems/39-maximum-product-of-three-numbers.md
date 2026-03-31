---
layout: page
title: "Maximum Product of Three Numbers"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Math, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-product-of-three-numbers"
---

# Maximum Product of Three Numbers / Tích Lớn Nhất Của Ba Số

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Missing Number](https://leetcode.com/problems/missing-number) | [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Sau khi sắp xếp mảng số, câu trả lời chỉ nằm ở hai đầu — như chọn học sinh giỏi/yếu nhất trong lớp mà không cần xét cả trăm người ở giữa.

**Pattern Recognition:**

- Signal: "find max/min product" + "small fixed-k selection" → **Sorting + boundary check**
- Sau khi sort tăng dần: tích lớn nhất là `max(3 số cuối, 2 số đầu × số cuối)`
- Key insight: số âm × âm = dương, nên hai số nhỏ nhất (âm nhất) có thể tạo ra tích lớn

**Visual — nums = [-10, -10, 1, 3, 2] → sorted = [-10, -10, 1, 2, 3]:**

```
sorted: [-10, -10,  1,  2,  3]
         [0]  [1]  ..  [n-2] [n-1]

Case A: 3 số cuối   →  1 × 2 × 3 = 6
Case B: 2 đầu × cuối → (-10) × (-10) × 3 = 300  ✅ winner

Answer = max(Case A, Case B)
```

---

## Problem Description

Cho mảng số nguyên `nums`, trả về tích lớn nhất của **ba phần tử bất kỳ**. ([LeetCode](https://leetcode.com/problems/maximum-product-of-three-numbers))

Difficulty: Easy | Acceptance: 45.3%

- `nums = [1, 2, 3]` → `6` (1×2×3)
- `nums = [1, 2, 3, 4]` → `24` (2×3×4)
- `nums = [-100, -98, 1, 2, 3]` → `29400` ((-100)×(-98)×3)

Constraints: `3 <= nums.length <= 10^4`, `-1000 <= nums[i] <= 1000`

---

## 📝 Interview Tips

1. **Clarify**: "Mảng có thể chứa số âm không?" / Can array contain negative numbers?
2. **Brute force**: "Thử mọi bộ ba — O(n³)" / Try all triples, obvious O(n³)
3. **Key insight**: "Sort + chỉ xét 2 trường hợp biên — O(n log n)" / Two edge cases after sorting
4. **Optimize further**: "Không cần sort toàn bộ — dùng linear scan O(n)" / Track top-3 and bottom-2 in one pass
5. **Edge cases**: "Mảng đúng 3 phần tử → tích duy nhất" / Exactly 3 elements, only one triple
6. **Follow-up**: "Nếu cần tích k phần tử thay vì 3?" / Generalize to product of k numbers

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Try All Triples
 * Time: O(n³) — three nested loops
 * Space: O(1) — constant extra space
 */
function maximumProductBrute(nums: number[]): number {
  let max = -Infinity;
  const n = nums.length;
  for (let i = 0; i < n - 2; i++) {
    for (let j = i + 1; j < n - 1; j++) {
      for (let k = j + 1; k < n; k++) {
        max = Math.max(max, nums[i] * nums[j] * nums[k]);
      }
    }
  }
  return max;
}

/**
 * Solution 2: Sort + Two Cases
 * Time: O(n log n) — sorting dominates
 * Space: O(1) — sort in-place, no extra
 */
function maximumProduct(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  // Case A: three largest
  const caseA = nums[n - 1] * nums[n - 2] * nums[n - 3];
  // Case B: two smallest (most negative) × largest
  const caseB = nums[0] * nums[1] * nums[n - 1];
  return Math.max(caseA, caseB);
}

/**
 * Solution 3: Linear Scan — track top-3 max and bottom-2 min
 * Time: O(n) — single pass
 * Space: O(1) — five variables
 */
function maximumProductLinear(nums: number[]): number {
  let max1 = -Infinity,
    max2 = -Infinity,
    max3 = -Infinity;
  let min1 = Infinity,
    min2 = Infinity;
  for (const n of nums) {
    if (n > max1) {
      max3 = max2;
      max2 = max1;
      max1 = n;
    } else if (n > max2) {
      max3 = max2;
      max2 = n;
    } else if (n > max3) {
      max3 = n;
    }
    if (n < min1) {
      min2 = min1;
      min1 = n;
    } else if (n < min2) {
      min2 = n;
    }
  }
  return Math.max(max1 * max2 * max3, min1 * min2 * max1);
}

// === Test Cases ===
console.log(maximumProduct([1, 2, 3])); // 6
console.log(maximumProduct([1, 2, 3, 4])); // 24
console.log(maximumProduct([-10, -10, 1, 2, 3])); // 300
console.log(maximumProductLinear([-100, -98, 1, 2, 3])); // 29400
```

---

## 🔗 Related Problems

- [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray) — same idea: negative × negative may be max
- [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin) — top-k selection via sort
- [Largest Number](https://leetcode.com/problems/largest-number) — custom sort comparator
- [Best Meeting Point](https://leetcode.com/problems/best-meeting-point) — sort to find median
- [Maximum Product of Three Numbers — LeetCode](https://leetcode.com/problems/maximum-product-of-three-numbers) — problem page
