---
layout: page
title: "Maximum Number of Integers to Choose From a Range II"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-integers-to-choose-from-a-range-ii"
---

# Maximum Number of Integers to Choose From a Range II / Số Nguyên Tối Đa Có Thể Chọn Từ Một Khoảng II

> **Track**: Sorting-Searching | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search on Answer
> **Frequency**: ★★☆ Occasional — harder version of Range I, needs binary search for large constraints
> **See also**: [Maximum Number of Integers to Choose From a Range I](https://leetcode.com/problems/maximum-number-of-integers-to-choose-from-a-range-i/) | [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Vẫn là bài toán mua sắm với ngân sách — nhưng lần này phạm vi n lên đến 10^9, nên không thể duyệt từ 1 đến n được nữa. Thay vào đó, ta binary search trên số lượng k: "Nếu chọn k số, tổng nhỏ nhất có thể là bao nhiêu?" Tổng nhỏ nhất khi chọn k số hợp lệ đầu tiên (bỏ qua banned). Nếu tổng này ≤ maxSum, ta có thể chọn được k số.

**Pattern Recognition:**

- Signal: "n up to 10^9" + "maximize count with sum ≤ maxSum" → **Binary Search on count**
- Bài này thuộc dạng binary search trên kết quả (số lượng k), kiểm tra tính khả thi
- Key insight: Hàm `minSumForK(k)` là đơn điệu tăng → binary search tìm k lớn nhất thoả mãn ≤ maxSum

**Visual — Binary search on count:**

```
banned=[1,4,6], n=6, maxSum=10
Valid numbers (sorted): [2,3,5] (not banned, ≤ n=6)

Binary search count in [0..3]:
mid=1: pick [2], sum=2 ≤ 10 ✓ → try more: lo=2
mid=2: pick [2,3], sum=5 ≤ 10 ✓ → try more: lo=3
mid=3: pick [2,3,5], sum=10 ≤ 10 ✓ → try more: lo=4
lo=4 > hi=3 → answer = 3
```

---

## Problem Description

Same as Range I but with larger constraints: `1 <= n <= 10^9`, `1 <= maxSum <= 10^15`. Choose integers from `[1, n]` (not in `banned`), distinct, sum ≤ `maxSum`. Return **maximum count**. ([LeetCode](https://leetcode.com/problems/maximum-number-of-integers-to-choose-from-a-range-ii))

```
Example 1: banned=[1,4,6], n=6, maxSum=10 → 3
Example 2: banned=[4,3,5,6], n=7, maxSum=50 → 7
```

Constraints: `1 <= banned.length <= 10^5`, `1 <= n <= 10^9`, `1 <= maxSum <= 10^15`

---

## 📝 Interview Tips

1. **n too large for linear scan → binary search on count** — _n lên đến 10^9, cần binary search thay vì duyệt_
2. **Sort banned, find how many valid numbers in [1..k]** — _Số hợp lệ trong [1..k] = k - countBanned(1..k)_
3. **Sum of first k valid numbers = arithmetic sum minus banned** — _Tính tổng k số đầu hợp lệ bằng công thức_
4. **Binary search: find max k where minSum(k) ≤ maxSum** — _k là đơn điệu: minSum tăng khi k tăng_
5. **Use prefix sum on sorted banned for fast range count** — _Đếm banned trong [1..k] bằng binary search trên banned sorted_
6. **Time O(b log b + log(n)), Space O(b)** — _Sort banned O(b log b), binary search O(log n) mỗi lần check_

---

## Solutions

```typescript
/** Solution 1: Binary Search on count @complexity Time: O(b log b + log(n) * log(b)) | Space: O(b) */
function maxCountII(banned: number[], n: number, maxSum: number): number {
  const sortedBanned = [...new Set(banned)].sort((a, b) => a - b).filter((x) => x <= n);
  const b = sortedBanned.length;

  // Count how many banned numbers are in [1, k]
  const countBannedUpTo = (k: number): number => {
    let lo = 0,
      hi = b;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sortedBanned[mid] <= k) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  // Minimum sum to pick exactly k valid numbers: sum of k smallest valid numbers in [1..n]
  // Valid count in [1..k] = k - countBannedUpTo(k)
  // Sum of [1..k] = k*(k+1)/2, then subtract sum of banned in [1..k]
  const bannedPrefixSum: number[] = new Array(b + 1).fill(0);
  for (let i = 0; i < b; i++) bannedPrefixSum[i + 1] = bannedPrefixSum[i] + sortedBanned[i];

  const sumBannedUpTo = (k: number): number => {
    const idx = countBannedUpTo(k);
    return bannedPrefixSum[idx];
  };

  // For count=k valid numbers, we need to pick from [1..?] until we have k valid ones
  // The (k)-th valid number is at position k + countBannedUpTo(that position)
  // Binary search for upper bound of k valid numbers
  const canPickK = (k: number): boolean => {
    if (k === 0) return true;
    // Find the actual value of the k-th valid number using binary search
    let lo = 1,
      hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const validCount = mid - countBannedUpTo(mid);
      if (validCount >= k) hi = mid;
      else lo = mid + 1;
    }
    // lo = value of k-th valid number
    const kthValid = lo;
    const validCount = kthValid - countBannedUpTo(kthValid);
    if (validCount < k) return false;
    // Sum = sum[1..kthValid] - sum of banned in [1..kthValid]
    const totalSum = (kthValid * (kthValid + 1)) / 2 - sumBannedUpTo(kthValid);
    return totalSum <= maxSum;
  };

  // Binary search on the answer count
  let lo = 0,
    hi = Math.min(n - b, 10 ** 9);
  // Upper bound: at most n - banned count valid numbers
  const maxValid = n - b;
  hi = maxValid;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (canPickK(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/** Solution 2: Direct greedy using sorted banned as gaps @complexity Time: O(b log b) | Space: O(b) */
function maxCountIIDirect(banned: number[], n: number, maxSum: number): number {
  const bannedSet = [...new Set(banned)].filter((x) => x <= n).sort((a, b) => a - b);
  let count = 0,
    sum = 0,
    prev = 0;

  for (const b of bannedSet) {
    // Fill gap (prev, b) with valid numbers
    for (let v = prev + 1; v < b; v++) {
      if (sum + v > maxSum) return count;
      sum += v;
      count++;
    }
    prev = b;
  }
  // Fill gap (prev, n]
  for (let v = prev + 1; v <= n; v++) {
    if (sum + v > maxSum) return count;
    sum += v;
    count++;
  }
  return count;
}

// === Test Cases ===
console.log(maxCountII([1, 4, 6], 6, 10)); // 3
console.log(maxCountII([4, 3, 5, 6], 7, 50)); // 7
console.log(maxCountII([], 5, 15)); // 5
```

---

## 🔗 Related Problems

| #   | Problem                                                                                                                                   | Difficulty | Pattern                 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| 1   | [Maximum Number of Integers to Choose From a Range I](https://leetcode.com/problems/maximum-number-of-integers-to-choose-from-a-range-i/) | Medium     | Greedy                  |
| 2   | [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)                                                                 | Medium     | Binary Search on Answer |
| 3   | [Find the Maximum Sum of Node Values](https://leetcode.com/problems/find-the-maximum-sum-of-node-values/)                                 | Hard       | Greedy                  |
| 4   | [Minimum Number of Days to Make m Bouquets](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/)                     | Medium     | Binary Search           |
