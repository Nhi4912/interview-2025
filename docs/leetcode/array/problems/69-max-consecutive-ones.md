---
layout: page
title: "Max Consecutive Ones"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/max-consecutive-ones"
---

# Max Consecutive Ones / Số Lượng Số 1 Liên Tiếp Nhiều Nhất

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Linear Scan
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đếm chuỗi thắng liên tiếp trong bóng đá — bạn đang đếm bao nhiêu trận thắng (1) liên tiếp trước khi thua (0). Mỗi khi thua, bộ đếm reset về 0. Kết quả là chuỗi thắng dài nhất.

**Pattern Recognition:**

- Signal: "binary array", "consecutive", "reset on 0" → **Linear Scan with counter**
- Chỉ cần một lần duyệt — track `current` streak, reset on 0, update `max`
- Key insight: không cần lưu lại vị trí, chỉ cần 2 biến: `cur` và `max`

**Visual — nums=[1,1,0,1,1,1]:**

```
idx:  0  1  2  3  4  5
val:  1  1  0  1  1  1
cur:  1  2  0  1  2  3
max:  1  2  2  2  2  3

Answer = 3 ✅
```

---

## Problem Description

Given a binary array `nums`, return the maximum number of consecutive `1`s in the array. The array only contains `0` and `1`.

- Example 1: `nums=[1,1,0,1,1,1]` → `3`
- Example 2: `nums=[1,0,1,1,0,1]` → `2`

Constraints: `1 <= nums.length <= 10^5`, `nums[i]` is `0` or `1`

---

## 📝 Interview Tips

1. **Clarify**: "Mảng có phần tử khác 0/1 không? Mảng rỗng?" / Only 0s and 1s; non-empty per constraints
2. **Brute force**: "Duyệt từng vị trí start, đếm streak — O(n²)" / O(n²) with nested loop for each start
3. **Optimize**: "Một lần duyệt, reset counter khi gặp 0 — O(n)" / Single pass with running counter
4. **Edge cases**: "Toàn 0 → return 0, toàn 1 → return n" / All zeros or all ones edge cases
5. **Variant**: "Max Consecutive Ones III cho phép flip k zeros" / Sliding window variant allows k flips
6. **Follow-up**: "Nếu được phép flip 1 số 0?" / Allow 1 flip → two-pointer sliding window

---

## Solutions

```typescript
/**
 * Solution 1: Linear Scan — running counter
 * Time: O(n) — single pass
 * Space: O(1) — two variables
 */
function findMaxConsecutiveOnes(nums: number[]): number {
  let max = 0,
    cur = 0;
  for (const n of nums) {
    cur = n === 1 ? cur + 1 : 0;
    max = Math.max(max, cur);
  }
  return max;
}

/**
 * Solution 2: Functional — split on 0s
 * Time: O(n) — single pass via split
 * Space: O(n) — segments array
 *
 * Fun alternative: join array, split on '0', find longest '1' segment
 */
function findMaxConsecutiveOnesFunctional(nums: number[]): number {
  return Math.max(
    0,
    ...nums
      .join("")
      .split("0")
      .map((s) => s.length),
  );
}

// === Test Cases ===
console.log(findMaxConsecutiveOnes([1, 1, 0, 1, 1, 1])); // 3
console.log(findMaxConsecutiveOnes([1, 0, 1, 1, 0, 1])); // 2
console.log(findMaxConsecutiveOnes([0, 0, 0])); // 0
console.log(findMaxConsecutiveOnes([1, 1, 1, 1])); // 4
```

---

## 🔗 Related Problems

- [Max Consecutive Ones II](https://leetcode.com/problems/max-consecutive-ones-ii) — allow flipping 1 zero (sliding window)
- [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii) — allow flipping k zeros (sliding window)
- [Longest Subarray of 1s After Deleting One Element](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element) — similar variant
- [Consecutive Characters](https://leetcode.com/problems/consecutive-characters) — same pattern for any character
