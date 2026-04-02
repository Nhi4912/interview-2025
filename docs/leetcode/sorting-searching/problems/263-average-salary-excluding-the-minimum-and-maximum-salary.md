---
layout: page
title: "Average Salary Excluding the Minimum and Maximum Salary"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Sorting]
leetcode_url: "https://leetcode.com/problems/average-salary-excluding-the-minimum-and-maximum-salary"
---

# Average Salary Excluding the Minimum and Maximum Salary / Lương Trung Bình Loại Trừ Min và Max

> **Track**: Sorting-Searching | **Difficulty**: 🟢 Easy | **Pattern**: Single Pass Min/Max/Sum
> **Frequency**: ★★☆ Common — câu warmup về xử lý mảng cơ bản
> **See also**: [Find the Difference](https://leetcode.com/problems/find-the-difference/) | [Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như cuộc thi thể dục dụng cụ ở Olympic — ban giám khảo gồm nhiều người, nhưng điểm số cao nhất và thấp nhất bị loại bỏ trước khi tính điểm trung bình. Cách đơn giản nhất: cộng hết lại, trừ đi điểm cao nhất và thấp nhất, chia cho số người còn lại.

**Pattern Recognition:**

- Signal: "exclude min and max" + "compute average" → **Single Pass or Sort**
- Bài này thuộc dạng single-pass với tracking min/max/sum
- Key insight: `average = (total - min - max) / (n - 2)` — không cần sort nếu dùng single pass

**Visual — Single pass example:**

```
salary = [4000, 3000, 1000, 2000]

Pass:
  min=4000, max=4000, sum=4000  (i=0)
  min=3000, max=4000, sum=7000  (i=1)
  min=1000, max=4000, sum=8000  (i=2)
  min=1000, max=4000, sum=10000 (i=3)

average = (10000 - 1000 - 4000) / (4-2) = 5000/2 = 2500.0
```

---

## Problem Description

Given integer array `salary` where `salary[i]` is the salary of the `i-th` employee, return the average salary of employees **excluding the minimum and maximum salary** (rounded to 5 decimal places is fine). ([LeetCode](https://leetcode.com/problems/average-salary-excluding-the-minimum-and-maximum-salary))

```
Example 1: salary=[4000,3000,1000,2000] → 2500.00000
Example 2: salary=[1000,2000,3000]      → 2000.00000
```

Constraints: `3 <= salary.length <= 100`, `1000 <= salary[i] <= 10^6`, all salaries are unique

---

## 📝 Interview Tips

1. **Single pass: track min, max, sum simultaneously** — _Một lần duyệt đủ để tính min, max và tổng_
2. **Formula: (sum - min - max) / (n - 2)** — _Đơn giản hoá thành một công thức duy nhất_
3. **Sort approach: sort, slice [1, n-1], average** — _Sắp xếp rồi bỏ phần tử đầu và cuối cũng hợp lệ_
4. **Return float (use / not integer division)** — _Chia phải trả về số thực, không làm tròn xuống_
5. **All salaries unique → guaranteed distinct min/max** — _Không cần lo trường hợp nhiều min/max bằng nhau_
6. **Time O(n), Space O(1)** — _Single pass, không cần bộ nhớ thêm_

---

## Solutions

```typescript
/** Solution 1: Sort approach @complexity Time: O(n log n) | Space: O(1) */
function averageSalarySort(salary: number[]): number {
  salary.sort((a, b) => a - b);
  const trimmed = salary.slice(1, salary.length - 1);
  return trimmed.reduce((s, v) => s + v, 0) / trimmed.length;
}

/** Solution 2: Single pass @complexity Time: O(n) | Space: O(1) */
function averageSalary(salary: number[]): number {
  let min = Infinity,
    max = -Infinity,
    sum = 0;
  for (const s of salary) {
    if (s < min) min = s;
    if (s > max) max = s;
    sum += s;
  }
  return (sum - min - max) / (salary.length - 2);
}

/** Solution 3: Reduce one-liner @complexity Time: O(n) | Space: O(1) */
function averageSalaryOneLiner(salary: number[]): number {
  const min = Math.min(...salary);
  const max = Math.max(...salary);
  return salary.reduce((s, v) => s + v, 0 - min - max) / (salary.length - 2);
}

// === Test Cases ===
console.log(averageSalary([4000, 3000, 1000, 2000])); // 2500
console.log(averageSalary([1000, 2000, 3000])); // 2000
console.log(averageSalary([6000, 5000, 4000, 3000, 2000, 1000])); // 3500
```

---

## 🔗 Related Problems

| #   | Problem                                                                                         | Difficulty | Pattern        |
| --- | ----------------------------------------------------------------------------------------------- | ---------- | -------------- |
| 1   | [Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/)         | Easy       | Sliding Window |
| 2   | [Find the Difference](https://leetcode.com/problems/find-the-difference/)                       | Easy       | XOR / Sum      |
| 3   | [Running Sum of 1d Array](https://leetcode.com/problems/running-sum-of-1d-array/)               | Easy       | Prefix Sum     |
| 4   | [Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/) | Medium     | Greedy / MST   |
