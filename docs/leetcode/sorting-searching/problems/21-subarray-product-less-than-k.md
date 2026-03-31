---
layout: page
title: "Subarray Product Less Than K"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Sliding Window, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/subarray-product-less-than-k"
---

# Subarray Product Less Than K / Số Mảng Con Có Tích Nhỏ Hơn K

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 11 companies
> **See also**: [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum) | [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như khung cửa sổ trượt qua dãy nhà — mở rộng phải khi tích vẫn < k, thu hẹp trái khi tích ≥ k. Mỗi khi cửa sổ hợp lệ (tích < k), số mảng con mới được thêm vào đúng bằng kích thước cửa sổ hiện tại.

**Pattern:** Sliding window — `right - left + 1` là số mảng con kết thúc tại `right` và tích < k.

```
nums = [10, 5, 2, 6], k = 100

r=0: prod=10 < 100 → count += 1 (window [10])
r=1: prod=50 < 100 → count += 2 (window [10,5] → subarrays: [10,5],[5])
r=2: prod=100 ≥ 100 → shrink: l++, prod=10
      prod=10 < 100 → count += 2 (window [5,2] → [5,2],[2])
r=3: prod=60 < 100 → count += 3 (window [5,2,6] → [5,2,6],[2,6],[6])

Total = 1+2+2+3 = 8 ✅
```

---

Cho mảng số nguyên dương `nums` và số nguyên `k`, đếm số **mảng con liên tiếp** có **tích của tất cả phần tử nhỏ hơn `k`** (nghiêm ngặt).

- `nums = [10,5,2,6], k = 100` → `8`
- `nums = [1,2,3], k = 0` → `0`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Key insight**: cửa sổ `[left..right]` hợp lệ → thêm `right - left + 1` mảng con mới
- 🇺🇸 **Why that count?** All subarrays ending at `right` with start in `[left..right]` are valid
- 🇻🇳 **Shrink khi tích ≥ k**: chia dần cho `nums[left++]` để thu nhỏ cửa sổ
- 🇺🇸 **Edge case**: if `k <= 1`, no positive-integer product can be < 1 → return 0 immediately
- 🇻🇳 **Khác với Minimum Size Subarray Sum**: đó tìm độ dài tối thiểu; đây đếm số lượng
- 🇺🇸 **Overflow**: products can be large but since we shrink when >= k, product stays bounded

---

## Solutions

### Solution 1: Brute Force — O(n²) time, O(1) space

```typescript
/**
 * Check every subarray — count those whose product is < k
 * Time: O(n²) | Space: O(1)
 */
function numSubarrayProductLessThanKBrute(nums: number[], k: number): number {
  if (k <= 1) return 0;
  let count = 0;

  for (let left = 0; left < nums.length; left++) {
    let prod = 1;
    for (let right = left; right < nums.length; right++) {
      prod *= nums[right];
      if (prod < k) count++;
      else break; // all further extensions will only grow product
    }
  }

  return count;
}

// Tests
console.log(numSubarrayProductLessThanKBrute([10, 5, 2, 6], 100)); // 8
console.log(numSubarrayProductLessThanKBrute([1, 2, 3], 0)); // 0
console.log(numSubarrayProductLessThanKBrute([1, 1, 1], 2)); // 6
```

### Solution 2: Sliding Window — O(n) time, O(1) space ✅ Optimal

```typescript
/**
 * Maintain a window [left..right] with product < k.
 * For each valid right, all subarrays ending at right = (right - left + 1).
 * Time: O(n) | Space: O(1)
 */
function numSubarrayProductLessThanK(nums: number[], k: number): number {
  if (k <= 1) return 0; // no positive-integer product can be strictly < 1

  let count = 0;
  let prod = 1;
  let left = 0;

  for (let right = 0; right < nums.length; right++) {
    prod *= nums[right]; // expand window to the right

    // Shrink from the left until product < k again
    while (prod >= k) {
      prod /= nums[left++];
    }

    // All subarrays ending at 'right' with start in [left..right] are valid
    count += right - left + 1;
  }

  return count;
}

// Tests
console.log(numSubarrayProductLessThanK([10, 5, 2, 6], 100)); // 8
console.log(numSubarrayProductLessThanK([1, 2, 3], 0)); // 0
console.log(numSubarrayProductLessThanK([1, 1, 1], 2)); // 6
console.log(numSubarrayProductLessThanK([1, 2, 3], 6)); // 4
console.log(numSubarrayProductLessThanK([10], 10)); // 0
console.log(numSubarrayProductLessThanK([10], 11)); // 1
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                                                              | Difficulty | Pattern                     |
| ------------------------------------------------------------------------------------------------------------------------------------ | ---------- | --------------------------- |
| [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum)                                                 | 🟡 Medium  | Sliding window (min length) |
| [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii)                                                   | 🟡 Medium  | Sliding window (max length) |
| [Longest Subarray of 1s After Deleting One Element](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element) | 🟡 Medium  | Sliding window variant      |
