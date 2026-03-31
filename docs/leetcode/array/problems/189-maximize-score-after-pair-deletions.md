---
layout: page
title: "Maximize Score After Pair Deletions"
difficulty: Medium
category: Array
tags: [Array, Greedy]
leetcode_url: "https://leetcode.com/problems/maximize-score-after-pair-deletions"
---

# Maximize Score After Pair Deletions / Tối Đa Điểm Sau Xóa Cặp

🟡 Medium | Array · Greedy

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Bạn có hai mảng nums1 và nums2 bằng nhau. Mỗi lần xoá, bạn phải xoá cùng chỉ số i từ cả hai mảng (xoá một cặp). Điểm số = tổng phần tử còn lại trong mảng lớn hơn. Để **tối đa** điểm, hãy xoá cặp có **tổng nhỏ nhất** — vì đó là thiệt hại ít nhất.

```
nums1 = [2,4,3], nums2 = [5,1,6]
Pairs: (2,5)=7  (4,1)=5  (3,6)=9
Must delete ONE pair (keep n-1 pairs):
  Delete (4,1): remaining sum = (2+3)+(5+6) = 5+11 = 16 ← best
  Delete (2,5): remaining = (4+3)+(1+6) = 7+7 = 14
  Delete (3,6): remaining = (2+4)+(5+1) = 6+6 = 12
```

## Problem Description

Given two integer arrays `nums1` and `nums2` of equal length `n`, you must perform exactly `n-1` pair deletions (removing same-index elements from both arrays simultaneously). After deletions only one pair remains. The score is `max(nums1[remaining], nums2[remaining])`. Maximize this score.

- **Example 1**: `nums1 = [2,4,3], nums2 = [5,1,6]` → `6` (keep pair at index 2)
- **Example 2**: `nums1 = [1,2], nums2 = [3,4]` → `4` (keep max of last pair)

## 📝 Interview Tips

- 💡 **Greedy insight / Tư duy tham lam**: Keep the pair with the maximum individual element, delete all others / giữ cặp có phần tử lớn nhất
- 🔍 **Reduction / Rút gọn**: max score = max over all i of max(nums1[i], nums2[i]) / điểm tối đa = max của max(nums1[i], nums2[i]) với mọi i
- ⚠️ **Pair constraint / Ràng buộc cặp**: You can only remove same-index pairs together / chỉ xoá cùng chỉ số
- 🧮 **O(n) solution / Giải O(n)**: Single pass finding max individual element across both arrays / một lượt tìm max
- 📊 **Corner case / Trường hợp biên**: n=1 → no deletions needed, return max of the only pair / n=1 trả max của cặp duy nhất
- 🎯 **Key realization / Nhận thấy chính**: We keep exactly one pair — pick the pair whose max is globally largest / chỉ giữ một cặp tốt nhất

## Solutions

### Solution 1: Greedy — Keep Best Pair (Optimal)

```typescript
/**
 * Maximize score by keeping the pair with the largest single element
 * Time: O(n) | Space: O(1)
 */
function maximizeScore(nums1: number[], nums2: number[]): number {
  let ans = 0;
  for (let i = 0; i < nums1.length; i++) {
    ans = Math.max(ans, nums1[i], nums2[i]);
  }
  return ans;
}

// Tests
console.log(maximizeScore([2, 4, 3], [5, 1, 6])); // 6
console.log(maximizeScore([1, 2], [3, 4])); // 4
console.log(maximizeScore([10], [3])); // 10
console.log(maximizeScore([1, 1, 1], [1, 1, 2])); // 2
```

### Solution 2: Sort Pairs by Min, Keep Max (Alternative Framing)

```typescript
/**
 * Sort pairs by their minimum value, delete worst pairs first
 * Time: O(n log n) | Space: O(n)
 */
function maximizeScoreSort(nums1: number[], nums2: number[]): number {
  const n = nums1.length;
  // Each pair: [min(a,b), max(a,b)]
  const pairs = Array.from({ length: n }, (_, i) => [
    Math.min(nums1[i], nums2[i]),
    Math.max(nums1[i], nums2[i]),
  ]);
  // Sort by min ascending (worst pairs first to delete)
  pairs.sort((a, b) => a[0] - b[0]);
  // Keep the last pair (best max), score = its max element
  return pairs[n - 1][1];
}

// Tests
console.log(maximizeScoreSort([2, 4, 3], [5, 1, 6])); // 6
console.log(maximizeScoreSort([1, 2], [3, 4])); // 4
```

### Solution 3: Explicit — Find Max Across Both Arrays

```typescript
/**
 * Explicit single-pass maximum across both arrays
 * Time: O(n) | Space: O(1)
 */
function maximizeScoreExplicit(nums1: number[], nums2: number[]): number {
  const combined = [...nums1, ...nums2];
  return Math.max(...combined);
}

// Tests
console.log(maximizeScoreExplicit([2, 4, 3], [5, 1, 6])); // 6
console.log(maximizeScoreExplicit([1, 2], [3, 4])); // 4
console.log(maximizeScoreExplicit([7, 2], [3, 9])); // 9
```

## 🔗 Related Problems

| #    | Problem                            | Difficulty | Tags                 |
| ---- | ---------------------------------- | ---------- | -------------------- |
| 11   | Container With Most Water          | Medium     | Greedy, Two Pointers |
| 455  | Assign Cookies                     | Easy       | Greedy               |
| 561  | Array Partition                    | Easy       | Greedy, Sorting      |
| 1877 | Minimize Maximum Pair Sum in Array | Medium     | Greedy, Sorting      |
