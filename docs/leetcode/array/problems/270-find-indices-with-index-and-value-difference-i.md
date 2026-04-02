---
layout: page
title: "Find Indices With Index and Value Difference I"
difficulty: Easy
category: Array
tags: [Array, Two Pointers]
leetcode_url: "https://leetcode.com/problems/find-indices-with-index-and-value-difference-i"
---

# Find Indices With Index and Value Difference I / Tìm Hai Chỉ Số Thỏa Điều Kiện

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers / Sliding Min-Max
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Find Indices With Index and Value Difference II](https://leetcode.com/problems/find-indices-with-index-and-value-difference-ii) | [Find Two Non-overlapping Sub-arrays Each With Target Sum](https://leetcode.com/problems/find-two-non-overlapping-sub-arrays-each-with-target-sum)

---

## Vietnamese Analogy (Ví dụ thực tế)

Hãy tưởng tượng bạn đang tìm hai ngày trong lịch (i và j) thỏa: hai ngày cách nhau ít nhất `indexDifference` ngày VÀ nhiệt độ chênh lệch ít nhất `valueDifference` độ. Brute force kiểm tra mọi cặp ngày là O(n²). Tối ưu hơn: với mỗi j, ta chỉ cần biết nhiệt độ thấp nhất và cao nhất trong các ngày [0..j-indexDifference] — duy trì hai biến này khi j tăng dần là đủ.

## Visual (Minh họa trực quan)

```
nums=[5,1,4,1], indexDifference=2, valueDifference=4

Brute force — try all pairs (i,j) with |i-j|≥2:
  (i=0,j=2): |0-2|=2≥2 ✓, |5-4|=1 ✗
  (i=0,j=3): |0-3|=3≥2 ✓, |5-1|=4≥4 ✓ → [0,3]

Optimal — for each j, keep min/max in [0..j-indexDifference]:
  j=2: window=[0..0]={5}, min=5,max=5
    |5-nums[2]|=|5-4|=1 < 4  and  |5-4|=1 < 4 → no
  j=3: window=[0..1]={5,1}, min=1@1, max=5@0
    |5-nums[3]|=|5-1|=4 ≥ 4 → [maxIdx=0, j=3] ✓
```

## Problem (Bài toán)

Given `nums`, `indexDifference`, `valueDifference`, find indices `i` and `j` such that `|i-j| >= indexDifference` AND `|nums[i]-nums[j]| >= valueDifference`. Return `[-1,-1]` if none exist.

**Example 1:** `nums=[5,1,4,1]`, `indexDiff=2`, `valueDiff=4` → `[0,3]`
**Example 2:** `nums=[2,1]`, `indexDiff=0`, `valueDiff=0` → `[0,0]`
**Example 3:** `nums=[1,2,3]`, `indexDiff=2`, `valueDiff=4` → `[-1,-1]`

**Constraints:** `2 ≤ nums.length ≤ 100`, `0 ≤ indexDifference ≤ 50`, `0 ≤ valueDifference ≤ 50`

## Tips (Mẹo phỏng vấn)

- **Brute O(n²) is fine here** / Brute force chấp nhận: n≤100 → O(n²)=10000 phép — đủ nhanh
- **Optimal O(n) with min/max tracking** / Tối ưu O(n): Với mỗi j, track min và max index trong `[0..j-indexDiff]`
- **Check both min and max** / Kiểm tra cả min lẫn max: `|nums[j]-min|≥val` HOẶC `|nums[j]-max|≥val`
- **j >= indexDifference to start** / j phải đủ lớn: Window bắt đầu tồn tại khi `j >= indexDifference`
- **Part II follow-up** / Mở rộng: Find Indices II cùng bài nhưng n≤10^5 → bắt buộc O(n)
- **Return any valid pair** / Trả bất kỳ cặp hợp lệ: Không cần tối ưu, chỉ cần tìm một cặp

## Solution 1 - Brute Force (O(n²))

```typescript
/**
 * @complexity Time: O(n²) | Space: O(1)
 * Check all pairs with |i-j| >= indexDifference
 */
function findIndicesBrute(
  nums: number[],
  indexDifference: number,
  valueDifference: number,
): number[] {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (Math.abs(i - j) >= indexDifference && Math.abs(nums[i] - nums[j]) >= valueDifference) {
        return [i, j];
      }
    }
  }
  return [-1, -1];
}
```

## Solution 2 - Sliding Min/Max Tracking (Optimal O(n))

```typescript
/**
 * @complexity Time: O(n) | Space: O(1)
 * For each j, maintain min/max indices in [0..j-indexDiff]
 * Check if nums[j] differs enough from either the min or max
 */
function findIndices(nums: number[], indexDifference: number, valueDifference: number): number[] {
  let minIdx = 0,
    maxIdx = 0;

  for (let j = indexDifference; j < nums.length; j++) {
    const i = j - indexDifference;
    // Update min/max for window [0..i]
    if (nums[i] < nums[minIdx]) minIdx = i;
    if (nums[i] > nums[maxIdx]) maxIdx = i;

    // Check if nums[j] differs enough from current min or max
    if (Math.abs(nums[j] - nums[minIdx]) >= valueDifference) return [minIdx, j];
    if (Math.abs(nums[j] - nums[maxIdx]) >= valueDifference) return [maxIdx, j];
  }
  return [-1, -1];
}
```

## Solution 3 - Two-Pointer Forward Scan

```typescript
/**
 * @complexity Time: O(n) | Space: O(1)
 * Scan j from indexDifference to n; look back at position j-indexDifference
 */
function findIndicesForward(
  nums: number[],
  indexDifference: number,
  valueDifference: number,
): number[] {
  // Candidate i is always j - indexDifference (minimum distance)
  // We track best i seen so far (max or min value)
  let bestMinI = 0,
    bestMaxI = 0;

  for (let j = indexDifference; j < nums.length; j++) {
    const candidateI = j - indexDifference;
    if (nums[candidateI] <= nums[bestMinI]) bestMinI = candidateI;
    if (nums[candidateI] >= nums[bestMaxI]) bestMaxI = candidateI;

    if (nums[j] - nums[bestMinI] >= valueDifference) return [bestMinI, j];
    if (nums[bestMaxI] - nums[j] >= valueDifference) return [bestMaxI, j];
  }
  return [-1, -1];
}
```

## Test Cases

```typescript
console.log(findIndices([5, 1, 4, 1], 2, 4)); // → [0,3]
console.log(findIndices([2, 1], 0, 0)); // → [0,0]
console.log(findIndices([1, 2, 3], 2, 4)); // → [-1,-1]
console.log(findIndices([0, 2, 2, 0], 2, 0)); // → [0,2]
console.log(findIndicesBrute([5, 1, 4, 1], 2, 4)); // → [0,3]
```

## Related Problems

| Problem                                         | Difficulty | Link                                                                                     |
| ----------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------- |
| Find Indices With Index and Value Difference II | Medium     | [LC 2905](https://leetcode.com/problems/find-indices-with-index-and-value-difference-ii) |
| Two Sum Less Than K                             | Easy       | [LC 1099](https://leetcode.com/problems/two-sum-less-than-k)                             |
| Minimum Absolute Difference                     | Easy       | [LC 1200](https://leetcode.com/problems/minimum-absolute-difference)                     |
