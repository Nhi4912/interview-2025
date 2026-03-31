---
layout: page
title: "Split Array with Equal Sum"
difficulty: Hard
category: Array
tags: [Array, Hash Table, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/split-array-with-equal-sum"
---

# Split Array with Equal Sum / Chia Mảng Thành 4 Phần Bằng Nhau

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Prefix Sum + Hash Set

---

## 🧠 Intuition / Trực Giác

**VI:** Cần 3 dấu tách (i, j, k) chia mảng thành 4 phần không giao nhau có tổng bằng nhau. Dùng prefix sum: cố định j (dấu giữa), thu thập tất cả tổng phần 1 hợp lệ vào Set, rồi kiểm tra tổng phần 3 có trong Set không.

**EN:** Need 3 separators (i, j, k) splitting array into 4 non-overlapping parts with equal sum. Fix middle separator `j`, collect all valid left sums (sum of part 1) into a Set, then check if right sums (sum of part 3) appear in that Set.

```
nums=[1,2,1,2,1,2,1,2,1]
Separators at i, j, k (elements AT separators excluded):
Part1 = sum(0..i-1), Part2 = sum(i+1..j-1)
Part3 = sum(j+1..k-1), Part4 = sum(k+1..n-1)

Fix j=4: collect valid sums for left half (i in 1..j-1)
  For i=1: part1=1, part2=sum(2..3)=1+2=3 → equal? no
  For i=3: part1=1+2+1=4, part2=sum(4..3)=0... iterate

Key: prefix[j] used to compute both parts quickly.
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔴 **EN:** Fix the middle separator j, then use a Set of valid left sums found while sweeping i.
  **VI:** Cố định j ở giữa, dùng Set chứa tổng trái hợp lệ khi duyệt i.
- 🔴 **EN:** Valid i for fixed j: 1 ≤ i ≤ j-2 (need space for part1 and part2).
  **VI:** i hợp lệ với j cố định: 1 ≤ i ≤ j-2 (cần chỗ cho part1 và part2).
- 🔴 **EN:** Valid k for fixed j: j+2 ≤ k ≤ n-2 (need space for part3 and part4).
  **VI:** k hợp lệ với j cố định: j+2 ≤ k ≤ n-2.
- 🔴 **EN:** Build prefix sums upfront for O(1) range sum queries.
  **VI:** Xây prefix sum trước để truy vấn tổng đoạn O(1).
- 🔴 **EN:** For each j: populate Set with valid part1==part2 sums, then check part3==part4.
  **VI:** Với mỗi j: nạp Set bằng tổng part1==part2, rồi kiểm tra part3==part4.
- 🔴 **EN:** Time O(n²), Space O(n) — good enough for n ≤ 2000.
  **VI:** Thời gian O(n²), Không gian O(n) — đủ tốt cho n ≤ 2000.

---

## Solutions / Giải Pháp

### Solution 1: Brute Force — O(n³) Time, O(1) Space

```typescript
function splitArray_brute(nums: number[]): boolean {
  const n = nums.length;
  if (n < 7) return false;
  const prefix = [0];
  for (const x of nums) prefix.push(prefix[prefix.length - 1] + x);
  const rangeSum = (l: number, r: number) => prefix[r + 1] - prefix[l];

  for (let i = 1; i < n - 5; i++) {
    for (let j = i + 2; j < n - 3; j++) {
      for (let k = j + 2; k < n - 1; k++) {
        const p1 = rangeSum(0, i - 1);
        const p2 = rangeSum(i + 1, j - 1);
        const p3 = rangeSum(j + 1, k - 1);
        const p4 = rangeSum(k + 1, n - 1);
        if (p1 === p2 && p2 === p3 && p3 === p4) return true;
      }
    }
  }
  return false;
}

console.log(splitArray_brute([1, 2, 1, 2, 1, 2, 1, 2, 1])); // true
console.log(splitArray_brute([1, 2, 1, 2, 1, 2, 1])); // false
```

### Solution 2: Prefix Sum + Hash Set — O(n²) Time, O(n) Space ✅ Optimal

```typescript
function splitArray(nums: number[]): boolean {
  const n = nums.length;
  if (n < 7) return false;

  // Build prefix sums
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  const rangeSum = (l: number, r: number) => prefix[r + 1] - prefix[l];

  // Fix middle separator j
  for (let j = 3; j < n - 3; j++) {
    // Collect all valid part1 sums for separators i in [1, j-2]
    const validLeftSums = new Set<number>();
    for (let i = 1; i <= j - 2; i++) {
      const part1 = rangeSum(0, i - 1);
      const part2 = rangeSum(i + 1, j - 1);
      if (part1 === part2) validLeftSums.add(part1);
    }
    // Check right side: separators k in [j+2, n-2]
    for (let k = j + 2; k <= n - 2; k++) {
      const part3 = rangeSum(j + 1, k - 1);
      const part4 = rangeSum(k + 1, n - 1);
      if (part3 === part4 && validLeftSums.has(part3)) return true;
    }
  }
  return false;
}

// Test cases
console.log(splitArray([1, 2, 1, 2, 1, 2, 1, 2, 1])); // Expected: true
console.log(splitArray([1, 2, 1, 2, 1, 2, 1])); // Expected: false
console.log(splitArray([0, 0, 0, 0, 0, 0, 0])); // Expected: true
console.log(splitArray([3, 0, 2, 3])); // Expected: false (too short)
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                  | Difficulty | Pattern                    |
| ---- | ---------------------------------------- | ---------- | -------------------------- |
| 548  | Split Array with Equal Sum               | 🔴 Hard    | Prefix Sum                 |
| 2270 | Number of Ways to Split Array            | 🟡 Medium  | Prefix Sum                 |
| 1712 | Ways to Split Array Into Three Subarrays | 🔴 Hard    | Prefix Sum + Binary Search |
