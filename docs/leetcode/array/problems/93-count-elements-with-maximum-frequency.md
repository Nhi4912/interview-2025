---
layout: page
title: "Count Elements With Maximum Frequency"
difficulty: Easy
category: Array
tags: [Array, Hash Table, Counting]
leetcode_url: "https://leetcode.com/problems/count-elements-with-maximum-frequency"
---

# Count Elements With Maximum Frequency / Đếm Phần Tử Có Tần Suất Lớn Nhất

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Majority Element](https://leetcode.com/problems/majority-element) | [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống kiểm phiếu bầu — đếm phiếu từng ứng viên, tìm người đạt số phiếu cao nhất, rồi cộng tổng phiếu của TẤT CẢ người đạt mức đó (có thể nhiều người cùng cao nhất).

**Visual:**

```
nums = [1, 2, 2, 3, 1, 4]
freq: {1:2, 2:2, 3:1, 4:1}
maxFreq = 2

Elements with freq==2: [1, 2]
Total = 2 + 2 = 4
```

---

## Problem Description

Given an array `nums`, return the **total frequencies** of elements with the maximum frequency. In other words: find the highest frequency `f`, then sum up the counts of all elements that appear exactly `f` times.

- Example 1: `nums = [1,2,2,3,1,4]` → `4` (both 1 and 2 appear twice: 2+2=4)
- Example 2: `nums = [1,2,3,4]` → `4` (all appear once: 1+1+1+1=4)

**Constraints:** `1 <= nums.length <= 100`, `1 <= nums[i] <= 100`

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Trả về tổng tần suất, không phải số phần tử distinct?" / Return sum of occurrences, not count of distinct values.
2. **Two-pass**: "Pass 1 đếm freq, pass 2 tính tổng cho maxFreq" / Build frequency map, then scan for max.
3. **One-pass trick**: "Cập nhật maxFreq và totalSum trong cùng một vòng lặp" / Maintain running max and total count together.
4. **Edge case**: "Tất cả phần tử giống nhau → freq=n, total=n" / All same: answer equals length.
5. **Edge case**: "Tất cả phần tử khác nhau → freq=1, total=n" / All unique: answer equals length.
6. **Complexity**: "O(n) time, O(n) space cho frequency map" / Linear time and space.

---

## Solutions

```typescript
/**
 * Solution 1: Two-Pass Hash Map
 * Time: O(n) — one pass to count, one pass over map entries
 * Space: O(n) — frequency map
 */
function countElementsWithMaxFreqTwoPass(nums: number[]): number {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

  let maxFreq = 0;
  for (const cnt of freq.values()) {
    if (cnt > maxFreq) maxFreq = cnt;
  }

  let total = 0;
  for (const cnt of freq.values()) {
    if (cnt === maxFreq) total += cnt;
  }
  return total;
}

console.log(countElementsWithMaxFreqTwoPass([1, 2, 2, 3, 1, 4])); // 4
console.log(countElementsWithMaxFreqTwoPass([1, 2, 3, 4])); // 4
console.log(countElementsWithMaxFreqTwoPass([3, 3, 3])); // 3

/**
 * Solution 2: One-Pass with Running Max
 * Time: O(n) — single pass
 * Space: O(n) — frequency map
 *
 * Maintain maxFreq and totalCount as we update frequencies:
 * - If new freq > maxFreq: reset total to new freq, update maxFreq
 * - If new freq == maxFreq: add to total
 */
function countElementsWithMaxFrequency(nums: number[]): number {
  const freq = new Map<number, number>();
  let maxFreq = 0;
  let total = 0;

  for (const n of nums) {
    const f = (freq.get(n) ?? 0) + 1;
    freq.set(n, f);

    if (f > maxFreq) {
      maxFreq = f;
      total = f; // reset: only this element holds the new max
    } else if (f === maxFreq) {
      total += f; // another element ties for max
    }
  }

  return total;
}

console.log(countElementsWithMaxFrequency([1, 2, 2, 3, 1, 4])); // 4
console.log(countElementsWithMaxFrequency([1, 2, 3, 4])); // 4
console.log(countElementsWithMaxFrequency([3, 3, 3])); // 3
console.log(countElementsWithMaxFrequency([1])); // 1
```

---

## 🔗 Related Problems

| Problem                                                                          | Pattern             | Difficulty |
| -------------------------------------------------------------------------------- | ------------------- | ---------- |
| [Majority Element](https://leetcode.com/problems/majority-element)               | Boyer-Moore Voting  | Easy       |
| [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements) | Bucket Sort / Heap  | Medium     |
| [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words)       | Heap + HashMap      | Medium     |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                   | Greedy + Freq Count | Medium     |
