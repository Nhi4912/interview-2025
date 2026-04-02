---
layout: page
title: "Monotonic Array"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/monotonic-array"
---

# Monotonic Array / Mảng Đơn Điệu

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Array Traversal
> **Frequency**: 📙 Tier 2 — Gặp ở 3+ companies
> **See also**: [Non-decreasing Array](https://leetcode.com/problems/non-decreasing-array) | [Check if Array Is Sorted and Rotated](https://leetcode.com/problems/check-if-array-is-sorted-and-rotated)

---

## Vietnamese Analogy (Ví dụ thực tế)

Hãy tưởng tượng giá cổ phiếu theo thời gian. Mảng "đơn điệu" nghĩa là giá chỉ tăng dần HOẶC chỉ giảm dần — không bao giờ đổi chiều. Như một con dốc: hoặc chỉ lên, hoặc chỉ xuống, không có điểm quay đầu. Bài kiểm tra chỉ cần một lần đi qua dãy số và xem có cả "tăng" lẫn "giảm" trong cùng dãy không.

## Visual (Minh họa trực quan)

```
[1, 2, 2, 3]   → ↑↑= → monotone increasing ✓
                  (no strict decrease ever)

[6, 5, 4, 4]   → ↓↓= → monotone decreasing ✓
                  (no strict increase ever)

[1, 3, 2]      → ↑↓ → NOT monotonic ✗
                  (has both increase and decrease)

Algorithm: track if we ever see a[i]>a[i-1] AND a[i]<a[i-1]
           if both happen → not monotonic
```

## Problem (Bài toán)

An array is **monotonic** if it is either entirely non-increasing or non-decreasing. Given an integer array `nums`, return `true` if the array is monotonic.

**Example 1:** `nums = [1,2,2,3]` → `true`
**Example 2:** `nums = [6,5,4,4]` → `true`
**Example 3:** `nums = [1,3,2]` → `false`

**Constraints:** `1 ≤ nums.length ≤ 10^5`, `-10^5 ≤ nums[i] ≤ 10^5`

## Tips (Mẹo phỏng vấn)

- **Two flags approach** / Hai cờ: Track `hasIncrease` và `hasDecrease` — nếu cả hai đều true → false
- **Early exit** / Thoát sớm: Ngay khi cả hai cờ đều true có thể return false ngay
- **Equals OK** / Bằng nhau: `a[i] === a[i+1]` không vi phạm — non-increasing cho phép equal
- **Two-pass alternative** / Hai lần duyệt: Kiểm tra riêng "tất cả ≤" và "tất cả ≥" — rõ ràng hơn
- **Edge case** / Trường hợp đặc biệt: Mảng 1 phần tử hoặc tất cả bằng nhau → always true
- **Strict vs non-strict** / Nghiêm ngặt vs không: "Non-decreasing" = a[i] ≤ a[i+1], cho phép equal

## Solution 1 - Two-pass Check (Clear O(n))

```typescript
/**
 * @complexity Time: O(n) | Space: O(1)
 * Check separately: is it non-decreasing? is it non-increasing?
 */
function isMonotonicTwoPass(nums: number[]): boolean {
  const isNonDecreasing = nums.every((v, i) => i === 0 || nums[i - 1] <= v);
  const isNonIncreasing = nums.every((v, i) => i === 0 || nums[i - 1] >= v);
  return isNonDecreasing || isNonIncreasing;
}
```

## Solution 2 - Single Pass with Flags (Optimal O(n))

```typescript
/**
 * @complexity Time: O(n) | Space: O(1)
 * Track whether we've seen an increase or decrease; both = not monotonic
 */
function isMonotonic(nums: number[]): boolean {
  let hasInc = false,
    hasDec = false;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) hasInc = true;
    else if (nums[i] < nums[i - 1]) hasDec = true;
    if (hasInc && hasDec) return false;
  }
  return true;
}
```

## Solution 3 - Direction Detection (Concise)

```typescript
/**
 * @complexity Time: O(n) | Space: O(1)
 * Determine direction from first unequal pair, then verify
 */
function isMonotonicDirection(nums: number[]): boolean {
  let dir = 0; // 0=unknown, 1=increasing, -1=decreasing

  for (let i = 1; i < nums.length; i++) {
    const diff = nums[i] - nums[i - 1];
    if (diff === 0) continue;
    const step = diff > 0 ? 1 : -1;
    if (dir === 0) dir = step;
    else if (dir !== step) return false;
  }
  return true;
}
```

## Test Cases

```typescript
console.log(isMonotonic([1, 2, 2, 3])); // → true
console.log(isMonotonic([6, 5, 4, 4])); // → true
console.log(isMonotonic([1, 3, 2])); // → false
console.log(isMonotonic([1])); // → true (single)
console.log(isMonotonic([1, 1, 1])); // → true (all equal)
console.log(isMonotonicTwoPass([1, 2, 2, 3])); // → true
console.log(isMonotonicDirection([6, 5, 4, 4])); // → true
```

## Related Problems

| Problem                                   | Difficulty | Link                                                                              |
| ----------------------------------------- | ---------- | --------------------------------------------------------------------------------- |
| Non-decreasing Array                      | Medium     | [LC 665](https://leetcode.com/problems/non-decreasing-array)                      |
| Check if Array Is Sorted and Rotated      | Easy       | [LC 1752](https://leetcode.com/problems/check-if-array-is-sorted-and-rotated)     |
| Longest Continuous Increasing Subsequence | Easy       | [LC 674](https://leetcode.com/problems/longest-continuous-increasing-subsequence) |
