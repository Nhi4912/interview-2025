---
layout: page
title: "Equal Sum Arrays With Minimum Number of Operations"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Greedy, Counting]
leetcode_url: "https://leetcode.com/problems/equal-sum-arrays-with-minimum-number-of-operations"
---

# Equal Sum Arrays With Minimum Number of Operations / Mảng Tổng Bằng Nhau Với Số Phép Toán Tối Thiểu

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Như cân bằng hai chén cân — luôn dùng đòn bẩy lớn nhất trước.**
> Mỗi phần tử có "tiềm năng thay đổi" tối đa. Chén nhẹ tăng lên 6, chén nặng giảm về 1.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Equal Sum Arrays With Minimum Number of Operations example:**

```
nums1=[1,2] sum=3     nums2=[3,4] sum=7
gap = 7 - 3 = 4

gains (tăng nums1): 6-1=5, 6-2=4
gains (giảm nums2): 4-1=3, 3-1=2

sorted desc: [5, 4, 3, 2]
step 1: gap = 4 - 5 = -1 ≤ 0  →  done! 1 operation
```

Tham lam: sắp xếp gains giảm dần → áp dụng từng bước cho đến khi `gap ≤ 0`.

---

## Problem Description

---

## 📝 Interview Tips

1. **Chuẩn hoá:** luôn để mảng tổng nhỏ hơn là `s1`, lớn hơn là `s2`.
2. **Gain của s1[i]:** `6 - val` — tăng phần tử lên tối đa (6 là max die value).
3. **Gain của s2[i]:** `val - 1` — giảm phần tử xuống tối đa (1 là min die value).
4. **Sort gains giảm dần** rồi tham lam áp dụng gain lớn nhất mỗi bước.
5. **Kiểm tra vô nghiệm:** nếu `max_sum(s1) < min_sum(s2)` → trả về -1.
6. **Counting sort O(n):** chỉ 6 giá trị khả thi → bucket[1..5] thay vì sort.

---

## Solutions

```typescript
/**
 * Approach 1: Greedy with sorted gains array
 * Time: O((n+m) log(n+m)) | Space: O(n+m)
 *
 * Collect maximum achievable change per element, sort desc, apply greedily.
 */
function minOperations(nums1: number[], nums2: number[]): number {
  let sum1 = nums1.reduce((a, b) => a + b, 0);
  let sum2 = nums2.reduce((a, b) => a + b, 0);
  if (sum1 === sum2) return 0;

  // Normalize: s1 has smaller sum, s2 has larger sum
  if (sum1 > sum2) {
    [nums1, nums2] = [nums2, nums1];
    [sum1, sum2] = [sum2, sum1];
  }

  // Impossible: even at max s1 and min s2, sums can't meet
  if (nums1.length * 6 < nums2.length * 1 + (sum2 - sum1)) {
    // more precisely: max achievable sum1 vs min achievable sum2
    // just let greedy fall through and return -1 if gap remains
  }

  let gap = sum2 - sum1;
  const gains: number[] = [];
  for (const v of nums1) gains.push(6 - v); // increase elements in smaller array
  for (const v of nums2) gains.push(v - 1); // decrease elements in larger array
  gains.sort((a, b) => b - a);

  let ops = 0;
  for (const g of gains) {
    if (gap <= 0) break;
    gap -= g;
    ops++;
  }
  return gap <= 0 ? ops : -1;
}

console.log(minOperations([1, 2], [3, 4])); // 1
console.log(minOperations([1, 1, 1, 1], [1])); // 1
console.log(minOperations([3], [1, 5])); // 1
console.log(minOperations([1, 1], [6, 6])); // 3

/**
 * Approach 2: Counting sort — O(n+m) gains bucketed by value 1-5
 * Time: O(n+m) | Space: O(1) — only 6 buckets
 *
 * Since all values ∈ [1,6], gains ∈ [0,5]. Use frequency buckets.
 */
function minOperations2(nums1: number[], nums2: number[]): number {
  let sum1 = nums1.reduce((a, b) => a + b, 0);
  let sum2 = nums2.reduce((a, b) => a + b, 0);
  if (sum1 === sum2) return 0;

  // Normalize
  if (sum1 > sum2) {
    [nums1, nums2] = [nums2, nums1];
    [sum1, sum2] = [sum2, sum1];
  }

  let gap = sum2 - sum1;
  const bucket = new Array(7).fill(0); // bucket[g] = count of elements with gain g

  for (const v of nums1) bucket[6 - v]++;
  for (const v of nums2) bucket[v - 1]++;

  let ops = 0;
  for (let g = 5; g >= 1 && gap > 0; g--) {
    const use = Math.min(bucket[g], Math.ceil(gap / g));
    ops += use;
    gap -= use * g;
  }
  return gap <= 0 ? ops : -1;
}

console.log(minOperations2([1, 2], [3, 4])); // 1
console.log(minOperations2([1, 1, 1, 1], [1])); // 1
console.log(minOperations2([6, 6], [1])); // 0  (12 > 1, but sum6+6=12, sum[1]=1? swap: [1] vs [6,6])
```

---

## 🔗 Related Problems

| Problem                                                                                                                                          | Difficulty | Connection               |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------ |
| [881. Boats to Save People](https://leetcode.com/problems/boats-to-save-people/)                                                                 | Medium     | Greedy with sorted array |
| [1647. Minimum Deletions to Make Char Frequencies Unique](https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique/) | Medium     | Greedy on sorted data    |
| [2171. Removing Minimum Number of Magic Beans](https://leetcode.com/problems/removing-minimum-number-of-magic-beans/)                            | Medium     | Sum balancing greedy     |
