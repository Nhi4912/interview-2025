---
layout: page
title: "Longest Consecutive Sequence"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Union Find]
leetcode_url: "https://leetcode.com/problems/longest-consecutive-sequence"
---

# Longest Consecutive Sequence / Dãy Liên Tiếp Dài Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: HashSet + Sequence Start Detection
> **Frequency**: ⭐ Tier 2 — Gặp ở 30+ companies
> **See also**: [Missing Number](https://leetcode.com/problems/missing-number) | [Find All Numbers Disappeared in an Array](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array)

---

## 🧠 Intuition / Tư Duy

- **Analogy:** Tưởng tượng một con đường có các ngôi nhà đánh số. Bạn chỉ muốn tìm con phố **bắt đầu mới** (không có nhà số liền trước), rồi đếm dài bao nhiêu. Nếu nhà số 5 có nhà số 4 trước đó thì bỏ qua — nhà 4 sẽ tự đếm cả đoạn đó rồi.

- **Pattern Recognition:**
  - Signal: "unsorted array" + "find longest run" + O(n) → **HashSet + only start from sequence beginning**
  - Chỉ bắt đầu đếm từ `num` nếu `num - 1` **không** có trong set (tránh đếm lại)
  - Mỗi số được thêm vào set O(1), duyệt O(1) per number → tổng O(n)

- **Visual — nums = [100, 4, 200, 1, 3, 2]:**

```
Set = {100, 4, 200, 1, 3, 2}

Candidates (num-1 not in set = sequence starters):
  100: 99 not in set → START → 100,101? No → length=1
  4:   3 in set     → SKIP (middle of sequence)
  200: 199 not in set → START → 200,201? No → length=1
  1:   0 not in set  → START → 1→2→3→4→5? 5 not in set
                             length=4  ✓  (1,2,3,4)
  3:   2 in set     → SKIP
  2:   1 in set     → SKIP

Max = 4 ✓
```

---

## Problem Description

Given an unsorted array of integers `nums`, return the length of the **longest consecutive elements sequence**.
Must run in O(n) time.

```
Input:  [100,4,200,1,3,2]  → 4   (sequence: 1,2,3,4)
Input:  [0,3,7,2,5,8,4,6,0,1] → 9  (sequence: 0..8)
Input:  []                  → 0
```

Constraints: `0 ≤ nums.length ≤ 10^5`, `-10^9 ≤ nums[i] ≤ 10^9`.

---

## 📝 Interview Tips

1. **Key insight: chỉ start từ đầu chuỗi**: Nếu `num-1` tồn tại → `num` là giữa chuỗi, bỏ qua / **Only start from beginnings**: if `num-1` exists, skip — saves duplicate work
2. **HashSet tra cứu O(1)**: Đưa tất cả vào set trước, rồi duyệt / **Preload set**: put all numbers in set first, then iterate
3. **Sort O(n log n) cũng được nhưng không optimal**: Đề yêu cầu O(n) / **Sort approach fails O(n) requirement**: mention it but use HashSet
4. **Duplicate numbers**: Set tự loại bỏ duplicate — không ảnh hưởng kết quả / **Duplicates**: Set handles them automatically
5. **Union Find variant**: Cũng hợp lệ nhưng phức tạp hơn HashSet / **Union Find**: valid but overly complex for this problem

---

## Solutions

```typescript
/**
 * Solution 1: Sort (Brute Force)
 * Time: O(n log n) | Space: O(1)
 */
function longestConsecutiveBrute(nums: number[]): number {
  if (nums.length === 0) return 0;
  nums.sort((a, b) => a - b);
  let best = 1,
    curr = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1]) continue; // skip duplicates
    if (nums[i] === nums[i - 1] + 1) curr++;
    else curr = 1;
    best = Math.max(best, curr);
  }
  return best;
}

/**
 * Solution 2: HashSet + Sequence Start Detection (Optimal)
 * Time: O(n) | Space: O(n)
 */
function longestConsecutive(nums: number[]): number {
  const set = new Set(nums);
  let best = 0;

  for (const num of set) {
    // Only start counting from sequence beginnings
    if (!set.has(num - 1)) {
      let curr = num;
      let length = 1;
      while (set.has(curr + 1)) {
        curr++;
        length++;
      }
      best = Math.max(best, length);
    }
  }
  return best;
}

// === Test Cases ===
console.log(longestConsecutive([100, 4, 200, 1, 3, 2])); // 4
console.log(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])); // 9
console.log(longestConsecutive([])); // 0
console.log(longestConsecutive([1, 2, 0, 1])); // 3
console.log(longestConsecutive([9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6])); // 7
```

---

## 🔗 Related Problems

| Problem                                                                                                            | Relationship                                    |
| ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| [Missing Number](https://leetcode.com/problems/missing-number)                                                     | Find gap in consecutive range [0..n]            |
| [Find All Numbers Disappeared in an Array](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array) | Find all missing in [1..n] range                |
| [Longest Arithmetic Subsequence](https://leetcode.com/problems/longest-arithmetic-subsequence)                     | Generalization: consecutive with arbitrary step |
| [Number of Atoms](https://leetcode.com/problems/number-of-atoms)                                                   | HashSet grouping with accumulation logic        |
