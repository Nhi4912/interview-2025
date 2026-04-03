---
layout: page
title: "Number of Longest Increasing Subsequence"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Binary Indexed Tree, Segment Tree]
leetcode_url: "https://leetcode.com/problems/number-of-longest-increasing-subsequence"
---

# Number of Longest Increasing Subsequence / Số Lượng Dãy Con Tăng Dần Dài Nhất

> **Difficulty**: 🟡 Medium | **Category**: Dynamic Programming | **Pattern**: LIS + Count DP

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Đếm số lượng "con đường leo núi" dài nhất trong dãy núi: mỗi đỉnh phải cao hơn đỉnh trước, và ta đếm tất cả con đường có cùng độ dài tối đa.

**Pattern Recognition:**

- LIS length → standard O(n²) DP, but track counts alongside lengths
- At each element: if extending max LIS → add count; if matching max → accumulate counts
- Two parallel arrays: `len[i]` (LIS ending at i) and `cnt[i]` (ways to achieve len[i])

**Visual (nums = [1,3,5,4,7]):**

```
i=0 val=1: len=1  cnt=1
i=1 val=3: prev 1<3 → len=2  cnt=1
i=2 val=5: prev 3<5 → len=3  cnt=1
i=3 val=4: prev 3<4 → len=3  cnt=1
i=4 val=7: prev 5<7 → len=4 cnt=1
           prev 4<7 → len=4 cnt=1  →same len→ cnt=1+1=2

maxLen=4, answer = cnt where len==4 → 2
```

## Problem Description

Given an integer array `nums`, return the **number of longest increasing subsequences**. Two subsequences are different if they use different indices even if values are equal.

**Example 1:** `nums = [1,3,5,4,7]` → `2` (paths: 1→3→5→7 and 1→3→4→7)
**Example 2:** `nums = [2,2,2,2,2]` → `5` (each single element is LIS of length 1)

**Constraints:** `1 <= nums.length <= 2000`, `-10^6 <= nums[i] <= 10^6`

## 📝 Interview Tips

1. **Clarify**: Are elements unique? No — handle equal values (strictly increasing).
2. **Approach**: O(n²) DP with two arrays: length and count. Update count when matching max.
3. **Edge cases**: All same elements → each single element is an LIS of length 1.
4. **Optimize**: O(n log n) with segment/BIT trees storing (maxLen, count) per value.
5. **Follow-up**: What if non-decreasing? Change `<` to `<=` in comparisons.
6. **Complexity**: O(n²) time, O(n) space (standard); O(n log n) with segment tree.

## Solutions

```typescript
// Solution 1: O(n²) DP with count tracking — Time: O(n²) | Space: O(n)
function findNumberOfLIS(nums: number[]): number {
  const n = nums.length;
  if (n === 0) return 0;

  const len = new Array(n).fill(1); // LIS length ending at i
  const cnt = new Array(n).fill(1); // number of LIS ending at i

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        if (len[j] + 1 > len[i]) {
          len[i] = len[j] + 1;
          cnt[i] = cnt[j];
        } else if (len[j] + 1 === len[i]) {
          cnt[i] += cnt[j];
        }
      }
    }
  }

  const maxLen = Math.max(...len);
  let result = 0;
  for (let i = 0; i < n; i++) {
    if (len[i] === maxLen) result += cnt[i];
  }
  return result;
}

// Solution 2: Optimized with early grouping — Time: O(n²) | Space: O(n)
function findNumberOfLIS2(nums: number[]): number {
  const n = nums.length;
  const len = new Array(n).fill(1);
  const cnt = new Array(n).fill(1);
  let maxLen = 1;

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] >= nums[i]) continue;
      if (len[j] + 1 > len[i]) {
        len[i] = len[j] + 1;
        cnt[i] = cnt[j];
      } else if (len[j] + 1 === len[i]) {
        cnt[i] += cnt[j];
      }
    }
    maxLen = Math.max(maxLen, len[i]);
  }

  return nums.reduce((acc, _, i) => (len[i] === maxLen ? acc + cnt[i] : acc), 0);
}

// Tests
console.log(findNumberOfLIS([1, 3, 5, 4, 7])); // 2
console.log(findNumberOfLIS([2, 2, 2, 2, 2])); // 5
console.log(findNumberOfLIS([1, 2, 4, 3, 5, 4, 7, 2])); // 3
console.log(findNumberOfLIS([1])); // 1
console.log(findNumberOfLIS([1, 3, 2])); // 2
```

## 🔗 Related Problems

| Problem                                                                                         | Relationship                                |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) | Find length; this counts all such sequences |
| [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/)         | Similar count + length parallel DP          |
| [Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/)                 | 2D LIS variant                              |
