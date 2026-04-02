---
layout: page
title: "Maximum Number of Integers to Choose From a Range I"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Binary Search, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-integers-to-choose-from-a-range-i"
---

# Maximum Number of Integers to Choose From a Range I / Số Nguyên Tối Đa Có Thể Chọn Từ Một Khoảng I

> **Track**: Sorting-Searching | **Difficulty**: 🟡 Medium | **Pattern**: Greedy with HashSet
> **Frequency**: ★★★ Common — greedy chọn số nhỏ nhất hợp lệ
> **See also**: [Maximum Number of Integers to Choose From a Range II](https://leetcode.com/problems/maximum-number-of-integers-to-choose-from-a-range-ii/) | [Find the Longest Valid Obstacle Course](https://leetcode.com/problems/find-the-longest-valid-obstacle-course-at-each-position/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang mua đồ tại siêu thị với ngân sách maxSum. Các mặt hàng có giá từ 1 đến n, nhưng một số mặt hàng trong danh sách "banned" không được mua. Chiến lược tối ưu là mua các mặt hàng rẻ nhất trước (chọn từ 1 lên), bỏ qua những cái bị cấm, dừng lại khi hết tiền. Đây là greedy điển hình: chọn nhỏ nhất hợp lệ tối đa hoá số lượng.

**Pattern Recognition:**

- Signal: "choose from [1,n], exclude banned, maximize count with sum ≤ maxSum" → **Greedy: pick smallest valid**
- Bài này thuộc dạng greedy: sắp xếp và chọn tham lam số nhỏ nhất hợp lệ
- Key insight: Vì mọi phần tử > 0 và ta muốn tối đa số lượng, chọn từ 1 lên là tối ưu

**Visual — Greedy smallest-first:**

```
banned=[1,6,5], n=5, maxSum=6

Candidates (not banned, ≤ n): 2, 3, 4, 5

Pick 2: sum=2, count=1
Pick 3: sum=5, count=2
Pick 4: sum=9 > 6 → stop

Answer: 2
```

---

## Problem Description

Given integer array `banned`, integer `n`, and integer `maxSum`. Choose integers from `[1, n]` (not in `banned`) such that the chosen integers are **distinct** and their sum ≤ `maxSum`. Return the **maximum number** of integers you can choose. ([LeetCode](https://leetcode.com/problems/maximum-number-of-integers-to-choose-from-a-range-i))

```
Example 1: banned=[1,6,5], n=5, maxSum=6     → 2
Example 2: banned=[1,2,3,4,5,6,7], n=8, maxSum=1 → 0
```

Constraints: `1 <= banned.length <= 10^4`, `1 <= n <= 10^4`, `1 <= maxSum <= 10^9`

---

## 📝 Interview Tips

1. **Use a Set for O(1) banned lookup** — _Chuyển banned thành Set để kiểm tra O(1) thay vì O(n)_
2. **Greedy: iterate 1..n, skip banned** — _Duyệt từ 1 đến n, bỏ qua số bị cấm, cộng dần vào sum_
3. **Stop when adding next number exceeds maxSum** — _Dừng ngay khi thêm số tiếp theo vượt ngân sách_
4. **Constraints small (n ≤ 10^4): linear scan fine** — _n nhỏ nên O(n) đủ; bài II cần binary search_
5. **Count is answer, not the specific numbers** — _Chỉ cần đếm số lượng, không cần liệt kê các số đã chọn_
6. **Time O(n + b), Space O(b)** — _b = banned.length; set construction O(b), scan O(n)_

---

## Solutions

```typescript
/** Solution 1: Sort banned + two pointer @complexity Time: O(n + b log b) | Space: O(b) */
function maxCountBannedSort(banned: number[], n: number, maxSum: number): number {
  const bannedSet = new Set(banned);
  let count = 0,
    sum = 0;
  for (let i = 1; i <= n; i++) {
    if (bannedSet.has(i)) continue;
    if (sum + i > maxSum) break;
    sum += i;
    count++;
  }
  return count;
}

/** Solution 2: HashSet + greedy scan @complexity Time: O(n + b) | Space: O(b) */
function maxCount(banned: number[], n: number, maxSum: number): number {
  const bannedSet = new Set(banned);
  let count = 0,
    sum = 0;
  for (let i = 1; i <= n && sum + i <= maxSum; i++) {
    if (!bannedSet.has(i)) {
      sum += i;
      count++;
    }
  }
  return count;
}

/** Solution 3: Filter then greedy @complexity Time: O(n + b) | Space: O(n) */
function maxCountFilter(banned: number[], n: number, maxSum: number): number {
  const bannedSet = new Set(banned);
  let count = 0,
    sum = 0;
  for (let i = 1; i <= n; i++) {
    if (bannedSet.has(i)) continue;
    if (sum + i > maxSum) return count;
    sum += i;
    count++;
  }
  return count;
}

// === Test Cases ===
console.log(maxCount([1, 6, 5], 5, 6)); // 2
console.log(maxCount([1, 2, 3, 4, 5, 6, 7], 8, 1)); // 0
console.log(maxCount([], 10, 15)); // 5 (1+2+3+4+5=15)
```

---

## 🔗 Related Problems

| #   | Problem                                                                                                                                     | Difficulty | Pattern       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| 1   | [Maximum Number of Integers to Choose From a Range II](https://leetcode.com/problems/maximum-number-of-integers-to-choose-from-a-range-ii/) | Medium     | Binary Search |
| 2   | [Find the Maximum Sum of Node Values](https://leetcode.com/problems/find-the-maximum-sum-of-node-values/)                                   | Hard       | Greedy        |
| 3   | [Two Sum](https://leetcode.com/problems/two-sum/)                                                                                           | Easy       | Hash Table    |
| 4   | [Check if It Is a Straight Line](https://leetcode.com/problems/check-if-it-is-a-straight-line/)                                             | Easy       | Math          |
