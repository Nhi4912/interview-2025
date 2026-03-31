---
layout: page
title: "Largest Number"
difficulty: Medium
category: Sorting-Searching
tags: [Array, String, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/largest-number"
---

# Largest Number / Số Lớn Nhất Từ Ghép

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Custom Sort Comparator (Greedy)
> **Frequency**: 📘 Tier 3 — Gặp ở 17 companies
> **See also**: [Smallest Number in Infinite Set](https://leetcode.com/problems/smallest-number-in-infinite-set) | [Reorder Data in Log Files](https://leetcode.com/problems/reorder-data-in-log-files)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Tưởng tượng bạn đang xếp các tấm bảng số để ghép thành số lớn nhất. Có hai tấm "9" và "34" — bạn đặt "9" trước vì "934" > "349". Quy tắc so sánh: với hai số a và b, đặt a trước nếu ghép `a+b` > `b+a` (so sánh như chuỗi). Đây là thứ tự sắp xếp tham lam (greedy).

**Pattern Recognition:**

- Signal: "arrange numbers to form largest value" → **Custom Sort Comparator**
- So sánh a và b: `(String(a)+String(b)) vs (String(b)+String(a))`
- Nếu `ab > ba` → a đứng trước. Tính chất transitive → sort works!
- Edge case: tất cả đều là 0 → kết quả là "0" (không phải "00000")

**Visual — nums = [3, 30, 34, 5, 9]:**

```
Compare pairs (as strings):
9  vs 34: "934" vs "349" → 9  > 34  → 9  first
9  vs 5:  "95"  vs "59"  → 9  > 5   → 9  first
5  vs 34: "534" vs "345" → 5  > 34  → 5  first
34 vs 3:  "343" vs "334" → 34 > 3   → 34 first
34 vs 30: "3430" vs "3034" → 34 > 30 → 34 first
3  vs 30: "330" vs "303" → 3  > 30  → 3  first

Sorted: [9, 5, 34, 3, 30]
Result: "9" + "5" + "34" + "3" + "30" = "9534330" ✅
```

---

## Problem Description

Given a list of non-negative integers `nums`, arrange them such that they form the largest number and return it as a string. Since the result may be very large, return it as a **string**. ([LeetCode 179](https://leetcode.com/problems/largest-number))

```
Input: nums = [10, 2]       → Output: "210"
Input: nums = [3, 30, 34, 5, 9] → Output: "9534330"
Input: nums = [0, 0]        → Output: "0"
```

Constraints: `1 <= nums.length <= 100`, `0 <= nums[i] <= 10⁹`

---

## 📝 Interview Tips

1. **Clarify**: "Số rất lớn nên trả về string, không phải number / Very large output — return string, not number"
2. **Key insight**: "Không sort theo giá trị số — sort theo ghép chuỗi: so sánh `a+b` vs `b+a`" / Sort by concatenation comparison, not numeric value
3. **Correctness proof**: "So sánh này transitive → valid comparator → sort works" / Transitivity makes it a valid total order
4. **All zeros**: "Nếu tất cả là 0, tránh trả về '000' → return '0'" / Guard: if first element is '0', entire result is '0'
5. **TypeScript sort**: "`.sort()` mặc định so sánh string, cần callback explicit" / Default `.sort()` may give wrong results, always provide comparator
6. **Follow-up**: "Sắp xếp để tạo số NHỎ nhất? → đổi thứ tự comparator" / Smallest number: flip comparator

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Try all permutations
 * Name: Permutation Brute Force
 * Time: O(n! * n) — generate all permutations, join each
 * Space: O(n!) — store all permutations
 */
function largestNumberBrute(nums: number[]): string {
  const strs = nums.map(String);
  let best = "0";

  function permute(arr: string[], start: number): void {
    if (start === arr.length) {
      const candidate = arr.join("");
      if (BigInt(candidate) > BigInt(best)) best = candidate;
      return;
    }
    for (let i = start; i < arr.length; i++) {
      [arr[start], arr[i]] = [arr[i], arr[start]];
      permute(arr, start + 1);
      [arr[start], arr[i]] = [arr[i], arr[start]];
    }
  }
  permute(strs, 0);
  return best;
}

/**
 * Solution 2: Custom Sort Comparator (Optimal)
 * Name: Custom Sort by Concatenation
 * Time: O(n log n * k) — sort with string comparisons (k = avg digit length)
 * Space: O(n) — string array
 */
function largestNumber(nums: number[]): string {
  const strs = nums.map(String);

  strs.sort((a, b) => {
    const ab = a + b;
    const ba = b + a;
    if (ab > ba) return -1; // a should come first
    if (ab < ba) return 1;
    return 0;
  });

  // Edge case: all zeros (e.g. [0, 0, 0])
  if (strs[0] === "0") return "0";

  return strs.join("");
}

/**
 * Solution 3: Custom Sort using numeric comparison
 * Name: Custom Sort Numeric
 * Time: O(n log n * k)
 * Space: O(n)
 */
function largestNumberNumeric(nums: number[]): string {
  nums.sort((a, b) => {
    const ab = Number(`${a}${b}`);
    const ba = Number(`${b}${a}`);
    return ba - ab; // descending: larger concatenation first
  });

  if (nums[0] === 0) return "0";
  return nums.join("");
  // Note: use string comparison for very large numbers to avoid float precision
}

// === Test Cases ===
console.log(largestNumber([10, 2])); // "210"
console.log(largestNumber([3, 30, 34, 5, 9])); // "9534330"
console.log(largestNumber([0, 0])); // "0"
console.log(largestNumber([1])); // "1"
console.log(largestNumber([432, 43243])); // "43243432"
console.log(largestNumber([999999998, 999999997, 999999999])); // "999999999999999998999999997"
```

---

## 🔗 Related Problems

| Problem | Relationship |
|---|---|
| [Smallest Value After Replacing With Sum of Prime Factors](https://leetcode.com/problems/smallest-value-after-replacing-with-sum-of-prime-factors) | Greedy number manipulation |
| [Maximum Swap](https://leetcode.com/problems/maximum-swap) | Greedy: swap one pair of digits to maximize number |
| [Non-decreasing Array](https://leetcode.com/problems/non-decreasing-array) | Greedy ordering decision at each element |
| [Reorder Data in Log Files](https://leetcode.com/problems/reorder-data-in-log-files) | Custom sort comparator on strings |
| [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency) | Custom sort — sort by computed metric, not value |
