---
layout: page
title: "Longest Well-Performing Interval"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Stack, Monotonic Stack, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/longest-well-performing-interval"
---

# Longest Well-Performing Interval / Khoảng Thời Gian Làm Việc Tốt Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum + Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k) | [Contiguous Array](https://leetcode.com/problems/contiguous-array)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống người đi bộ trên đường dốc — mỗi ngày "mệt" (+1) hay "nhẹ nhàng" (-1). Ta tìm đoạn đường dài nhất mà tổng điểm dương (nhiều ngày mệt hơn nhẹ). Dùng prefix sum để biến bài toán "đếm ngày" thành bài toán "tìm chỉ số sớm nhất".

**Pattern Recognition:**

- Convert hours → score: +1 if > 8, else -1
- "Well-performing" means prefix[j] - prefix[i] > 0, i.e. prefix[j] > prefix[i]
- Key insight: if prefix[i] > 0, answer candidate = i+1; else find earliest j where prefix[j] == prefix[i]-1

**Visual — Prefix Sum approach:**

```
hours = [9,9,6,0,6,6,9]
score:  [+1,+1,-1,-1,-1,-1,+1]
prefix: [0, 1, 2, 1, 0,-1,-2,-1]
         ^  ^  ^  ^  ^  ^  ^  ^
         i=0 1  2  3  4  5  6  7

i=4: prefix=0 → find earliest j where prefix[j]=-1 → j=5 → length=4-5=-1? wrong
Actually: when prefix[i]<=0, find EARLIEST index j where prefix[j]==prefix[i]-1
  prefix[6]=-2, look for -3: not found
  prefix[5]=-1, look for -2: not found
  prefix[4]=0,  look for -1: found at j=6 → length = 6-4=2? Hmm

Correct: hours=[9,9,6,0,6,6,9], answer=3
prefix: 0,1,2,1,0,-1,-2,-1
i=7: prefix=-1, look for prefix=-2 → j=6 → length=7-6=1
i=6: prefix=-2, look for prefix=-3 → not found
i=5: prefix=-1 already stored earliest
i=2: prefix=2 > 0 → answer = max(ans, 2) = 2
i=3: prefix=1 > 0 → answer = max(ans, 3) = 3 ✅
```

---

## Problem Description

Given an array `hours` representing hours worked each day, a day is **tiring** if `hours[i] > 8`. A **well-performing interval** is one where the number of tiring days is strictly greater than non-tiring days. Return the length of the longest well-performing interval. ([LeetCode 1124](https://leetcode.com/problems/longest-well-performing-interval))

Difficulty: Medium | Acceptance: 35.9%

```
Example 1: hours = [9,9,6,0,6,6,9] → 3
  Days 0,1,6 are tiring (+1), days 2,3,4,5 are not (-1)
  Best interval: [0..2] has score=1 > 0 → length 3

Example 2: hours = [6,6,6] → 0
  No tiring days at all → no valid interval
```

Constraints:

- `1 <= hours.length <= 10^4`
- `0 <= hours[i] <= 16`

---

## 📝 Interview Tips

1. **Clarify**: "Ngưỡng là > 8 hay >= 8?" / Confirm threshold: strictly greater than 8
2. **Transform**: "Đổi bài sang +1/-1 rồi dùng prefix sum" / Map to +1/-1 scores to use prefix sum
3. **Key insight**: "prefix[j] > 0 → cả đoạn [0..j] đều hợp lệ" / If prefix > 0 the whole prefix is valid
4. **Hash map trick**: "Lưu lần đầu gặp mỗi prefix sum" / Store FIRST occurrence of each prefix sum for max length
5. **When prefix <= 0**: "Tìm j sớm nhất mà prefix[j] == prefix[i]-1" / Look for earliest index with prefix one less
6. **Follow-up**: "Nếu cần đếm số lượng interval? Prefix sum + Two Sum pattern" / Count intervals → prefix + hash

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — check all subarrays
 * Time: O(n²) — two nested loops
 * Space: O(1) — no extra storage
 */
function longestWellPerformingIntervalBrute(hours: number[]): number {
  let ans = 0;
  for (let i = 0; i < hours.length; i++) {
    let score = 0;
    for (let j = i; j < hours.length; j++) {
      score += hours[j] > 8 ? 1 : -1;
      if (score > 0) ans = Math.max(ans, j - i + 1);
    }
  }
  return ans;
}

/**
 * Solution 2: Prefix Sum + Hash Map (optimal)
 * Time: O(n) — single pass
 * Space: O(n) — hash map stores first occurrence of each prefix sum
 *
 * Key insight:
 *   - If prefix[i] > 0: the whole subarray [0..i-1] is valid → candidate = i
 *   - If prefix[i] <= 0: find earliest j where prefix[j] == prefix[i]-1
 *     Then [j..i-1] is a well-performing interval of length i-j
 */
function longestWellPerformingInterval(hours: number[]): number {
  const firstSeen = new Map<number, number>();
  firstSeen.set(0, 0); // prefix sum 0 at index 0 (before any element)
  let prefix = 0;
  let ans = 0;

  for (let i = 0; i < hours.length; i++) {
    prefix += hours[i] > 8 ? 1 : -1;

    if (prefix > 0) {
      // Entire [0..i] is well-performing
      ans = Math.max(ans, i + 1);
    } else {
      // Find earliest index where prefix was (prefix - 1)
      // If such index j exists, subarray [j..i] has sum = prefix - (prefix-1) = 1 > 0
      const target = prefix - 1;
      if (firstSeen.has(target)) {
        ans = Math.max(ans, i + 1 - firstSeen.get(target)!);
      }
    }

    // Only record FIRST occurrence for maximum length
    if (!firstSeen.has(prefix)) {
      firstSeen.set(prefix, i + 1);
    }
  }

  return ans;
}

// === Test Cases ===
console.log(longestWellPerformingInterval([9, 9, 6, 0, 6, 6, 9])); // 3
console.log(longestWellPerformingInterval([6, 6, 6])); // 0
console.log(longestWellPerformingInterval([9])); // 1
console.log(longestWellPerformingInterval([6])); // 0
console.log(longestWellPerformingInterval([9, 6, 9])); // 3
```

---

## 🔗 Related Problems

- [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k) — same pattern: Prefix Sum + Hash Map
- [Contiguous Array](https://leetcode.com/problems/contiguous-array) — same pattern: Prefix Sum, equal 0s and 1s
- [Next Greater Element I](https://leetcode.com/problems/next-greater-element-i) — related: Monotonic Stack
- [Longest Well-Performing Interval — LeetCode](https://leetcode.com/problems/longest-well-performing-interval) — problem page
