---
layout: page
title: "Sort Array by Increasing Frequency"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Hash Table, Sorting]
leetcode_url: "https://leetcode.com/problems/sort-array-by-increasing-frequency"
---

# Sort Array by Increasing Frequency / Sắp Xếp Mảng Theo Tần Số Tăng Dần

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Majority Element](https://leetcode.com/problems/majority-element) | [Missing Number](https://leetcode.com/problems/missing-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Sắp xếp học sinh theo số lần vắng mặt tăng dần — ai vắng ít nhất lên đầu; nếu hai người vắng số lần bằng nhau, người điểm cao hơn lên trước (giá trị lớn hơn).

**Pattern Recognition:**

- Signal: "sort by custom criterion" + "frequency" → **HashMap + custom sort**
- Build frequency map, then sort with 2-level comparator
- Key insight: tiebreak = giá trị lớn hơn đứng trước (decreasing value)

**Visual — nums = [1,1,2,2,2,3]:**

```
Step 1 - Count freq: {1:2, 2:3, 3:1}

Step 2 - Sort by (freq ASC, val DESC):
  3 → freq=1  ← smallest freq, goes first
  1 → freq=2
  2 → freq=3  ← largest freq, goes last

Result: [3, 1, 1, 2, 2, 2] ✅
```

---

## Problem Description

Cho mảng số nguyên `nums`, sắp xếp theo **tần số tăng dần**. Nếu nhiều phần tử có cùng tần số, sắp xếp theo **giá trị giảm dần**. ([LeetCode](https://leetcode.com/problems/sort-array-by-increasing-frequency))

Difficulty: Easy | Acceptance: 80.3%

- `nums = [1,1,2,2,2,3]` → `[3,1,1,2,2,2]`
- `nums = [2,3,1,3,2]` → `[1,3,3,2,2]`
- `nums = [-1,1,-6,4,5,-6,1,4,1]` → `[5,-1,4,4,-6,-6,1,1,1]`

Constraints: `1 <= nums.length <= 100`, `-100 <= nums[i] <= 100`

---

## 📝 Interview Tips

1. **Clarify**: "Tiebreak là giá trị giảm dần hay tăng dần?" / Decreasing value when frequency ties
2. **Approach**: "HashMap đếm freq + custom sort — O(n log n)" / Build freq map then sort
3. **Comparator**: "Ưu tiên freq tăng dần; nếu bằng nhau, giá trị giảm dần" / freq ASC, then value DESC
4. **Edge cases**: "Tất cả unique → sort giảm dần theo value; tất cả bằng nhau → không đổi" / All unique → sort desc
5. **Stability**: "JavaScript sort không cần stable ở đây vì comparator xác định rõ thứ tự" / Fully defined comparator
6. **Follow-up**: "Top K frequent elements → heap, không cần sort toàn bộ" / Partial sort with heap

---

## Solutions

```typescript
/**
 * Solution 1: HashMap + Custom Sort
 * Time: O(n log n) — sorting dominates
 * Space: O(n) — frequency map + sorted copy
 */
function frequencySort(nums: number[]): number[] {
  // Build frequency map
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

  // Sort: primary = frequency ascending, secondary = value descending
  return nums.slice().sort((a, b) => {
    const fa = freq.get(a)!,
      fb = freq.get(b)!;
    if (fa !== fb) return fa - fb; // fewer occurrences first
    return b - a; // higher value first on tie
  });
}

/**
 * Solution 2: Bucket Sort by Frequency
 * Time: O(n + k) where k = max frequency — for small range inputs
 * Space: O(n + k) — buckets
 */
function frequencySortBucket(nums: number[]): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

  // Bucket: index = frequency, value = array of numbers with that freq (sorted desc)
  const maxFreq = Math.max(...freq.values());
  const buckets: number[][] = Array.from({ length: maxFreq + 1 }, () => []);

  for (const [val, cnt] of freq.entries()) {
    buckets[cnt].push(val);
  }

  const result: number[] = [];
  for (let f = 1; f <= maxFreq; f++) {
    if (buckets[f].length === 0) continue;
    buckets[f].sort((a, b) => b - a); // descending value for same frequency
    for (const v of buckets[f]) {
      for (let i = 0; i < f; i++) result.push(v);
    }
  }
  return result;
}

// === Test Cases ===
console.log(frequencySort([1, 1, 2, 2, 2, 3]));
// [3, 1, 1, 2, 2, 2]
console.log(frequencySort([2, 3, 1, 3, 2]));
// [1, 3, 3, 2, 2]
console.log(frequencySort([-1, 1, -6, 4, 5, -6, 1, 4, 1]));
// [5, -1, 4, 4, -6, -6, 1, 1, 1]
console.log(frequencySortBucket([1, 1, 2, 2, 2, 3]));
// [3, 1, 1, 2, 2, 2]
```

---

## 🔗 Related Problems

- [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements) — frequency + heap for top-k
- [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency) — same pattern for strings
- [Majority Element](https://leetcode.com/problems/majority-element) — frequency counting
- [Custom Sort String](https://leetcode.com/problems/custom-sort-string) — custom sort comparator
- [Sort Array by Increasing Frequency — LeetCode](https://leetcode.com/problems/sort-array-by-increasing-frequency) — problem page
