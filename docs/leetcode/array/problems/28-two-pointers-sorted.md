---
layout: page
title: "Two Pointers on Sorted Array"
difficulty: Easy
category: Array
tags: [Array, Two Pointers, Sorting]
leetcode_url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/"
---

# Two Pointers (Sorted Array) / Hai Con Trỏ Trên Mảng Đã Sắp Xếp

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers (Opposite Ends)
> **Frequency**: 📘 Tier 3 — Template nền tảng; building block của 3Sum, 4Sum, Container Water
> **See also**: [3Sum](./12-3sum.md) | [3Sum Closest](./24-three-sum-closest.md) | [Sliding Window Fixed](./27-sliding-window-fixed.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hai người đứng ở hai đầu hàng số đã sắp xếp, nhìn vào nhau. Nếu tổng hiện tại nhỏ quá → người trái tiến vào (tăng giá trị); nếu lớn quá → người phải tiến vào (giảm giá trị). Không thể cả hai đi cùng chiều — mỗi bước loại bỏ hoàn toàn một hướng tìm kiếm.

**Pattern Recognition:**

- Signal: **sorted array** + "tìm cặp/bộ phần tử" thỏa điều kiện về tổng/hiệu → **Two Pointers (opposite ends)**
- Tại sao O(n) thay vì O(n²)? Mỗi bước ta loại một cột/hàng toàn bộ trong ma trận tổng ảo
- Decision rule: `sum < target → left++` (cần giá trị lớn hơn), `sum > target → right--` (cần nhỏ hơn)

**Visual — Two Sum II on [2, 7, 11, 15], target=9:**

```
  L                        R
  2    7    11   15

  sum = 2+15 = 17 > 9  →  R--

  L              R
  2    7    11   15

  sum = 2+11 = 13 > 9  →  R--

  L    R
  2    7    11   15

  sum = 2+7  =  9 == 9  ✓  →  return [1, 2]  (1-indexed)
```

---

## Problem Description

**Template Problem (LC 167 — Two Sum II):** Given a **sorted** array, find two distinct elements summing to `target`. Return 1-indexed positions. O(1) extra space required.

```
Example 1: numbers = [2,7,11,15], target = 9   →  [1,2]
Example 2: numbers = [2,3,4],     target = 6   →  [1,3]
Example 3: numbers = [-1,0],      target = -1  →  [1,2]
```

Constraints: `2 <= n <= 3×10^4`, sorted ascending, exactly one valid answer, must use O(1) space

---

## 📝 Interview Tips

1. **Verify sorted first**: "Two pointers chỉ đúng khi mảng đã sắp xếp — xác nhận với interviewer trước khi code"
2. **Nếu chưa sorted**: Sort O(n log n) + two pointers O(n) → overall O(n log n), vẫn tốt hơn brute force O(n²)
3. **Không cần skip duplicates**: Bài này đảm bảo exactly one answer, không cần dedup
4. **Binary search alternative**: Với mỗi `i`, binary search `target - nums[i]` → O(n log n) / O(1) — tệ hơn two pointers
5. **Edge case — same elements**: `[3,3]`, target=6 → `left=0, right=1`, `3+3=6` → works vì `left < right`
6. **Extension pattern**: 3Sum = fix one + two pointers; 4Sum = fix two + two pointers — luôn mention điều này

---

## Solutions

{% raw %}
/\*\*

- Solution 1: Two Pointers (Optimal) ✅ Recommended
-
- Place one pointer at start (L), one at end (R).
- Converge based on comparison: too small → L++, too large → R--.
- Guaranteed to find answer (problem guarantees exactly one solution).
-
- Time: O(n) — each pointer moves at most n steps total
- Space: O(1) — two pointer variables only
  \*/
  function twoSumSorted(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

while (left < right) {
const sum = numbers[left] + numbers[right];
if (sum === target) return [left + 1, right + 1]; // 1-indexed
else if (sum < target) left++; // need larger value — advance left
else right--; // need smaller value — retreat right
}

return []; // unreachable: problem guarantees exactly one solution
}

/\*\*

- Solution 2: Binary Search (for contrast)
-
- For each element, binary search for its complement.
- O(n log n) vs O(n) two pointers — useful if sorted constraint is removed later.
-
- Time: O(n log n), Space: O(1)
  \*/
  function twoSumBinarySearch(numbers: number[], target: number): number[] {
  for (let i = 0; i < numbers.length; i++) {
  const complement = target - numbers[i];
  let lo = i + 1, hi = numbers.length - 1;
  while (lo <= hi) {
  const mid = (lo + hi) >> 1;
  if (numbers[mid] === complement) return [i + 1, mid + 1];
  else if (numbers[mid] < complement) lo = mid + 1;
  else hi = mid - 1;
  }
  }
  return [];
  }

// === Universal Two-Pointer Template ===
// function twoPointer(sortedArr, target):
// left = 0, right = n - 1
// while left < right:
// current = sortedArr[left] + sortedArr[right]
// if current == target: record / return answer
// elif current < target: left++ // increase sum
// else: right-- // decrease sum
//
// Applies to: Two Sum II, 3Sum, 4Sum, Container With Most Water, Valid Palindrome

// === Test Cases ===
console.log(twoSumSorted([2, 7, 11, 15], 9)); // [1, 2]
console.log(twoSumSorted([2, 3, 4], 6)); // [1, 3]
console.log(twoSumSorted([-1, 0], -1)); // [1, 2]
console.log(twoSumSorted([3, 3], 6)); // [1, 2]
{% endraw %}

---

## 🔗 Related Problems

- [Two Sum II (LC 167)](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) — direct application of this template
- [3Sum (LC 15)](./12-3sum.md) — fix one element, two-pointer the rest for triplets
- [3Sum Closest (LC 16)](./24-three-sum-closest.md) — minimize `|sum - target|` instead of exact match
- [Container With Most Water (LC 11)](./18-container-with-most-water.md) — two pointers maximize area between bars
- [Valid Palindrome (LC 125)](https://leetcode.com/problems/valid-palindrome/) — two pointers checking chars from both ends
