---
layout: page
title: "N-Repeated Element in Size 2N Array"
difficulty: Easy
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/n-repeated-element-in-size-2n-array"
---

# N-Repeated Element in Size 2N Array / Phần Tử Lặp N Lần Trong Mảng Kích Thước 2N

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map / Pigeonhole

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Mảng kích thước `2n` chứa `n+1` giá trị phân biệt, trong đó 1 giá trị lặp `n` lần và n giá trị còn lại xuất hiện 1 lần. Bằng nguyên lý pigeonhole, phần tử lặp phải xuất hiện trong mỗi 3 phần tử liên tiếp. Kiểm tra `arr[i] == arr[i+1]` hoặc `arr[i] == arr[i+2]` là đủ!

**EN:** Array of size `2n` with `n+1` distinct values, one repeated `n` times. By pigeonhole, the repeated element must appear among any 3 consecutive elements. Checking `arr[i]==arr[i+1]` or `arr[i]==arr[i+2]` catches all cases!

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — N-Repeated Element in Size 2N Array example:**

```
n=4, arr=[5,1,5,2,5,3,5,4]  (size=8=2*4)
Repeated element: 5 (appears 4 times)

Pigeonhole: every 3 consecutive must contain 5
Check pairs gap-1: [5,1],[1,5],[5,2],... → 5==5 at i=0,i+2=2 ✓
Check pairs gap-2: [5,5],[1,2],[5,3],... → arr[0]==arr[2] ✓
```

---

---

## Problem Description

| #   | Problem                   | Difficulty | Pattern            |
| --- | ------------------------- | ---------- | ------------------ |
| 169 | Majority Element          | 🟢 Easy    | Boyer-Moore / Hash |
| 287 | Find the Duplicate Number | 🟡 Medium  | Floyd's Cycle      |
| 136 | Single Number             | 🟢 Easy    | XOR                |

---

## 📝 Interview Tips

- 🟢 **EN:** HashSet approach: first duplicate found is the answer — O(n) time, O(n) space.
  **VI:** Dùng HashSet: phần tử trùng đầu tiên là đáp án — O(n) thời gian, O(n) không gian.
- 🟢 **EN:** Pigeonhole O(1) space: check arr[i]==arr[i+1] OR arr[i]==arr[i+2] for all i.
  **VI:** Pigeonhole O(1) không gian: kiểm tra arr[i]==arr[i+1] HOẶC arr[i]==arr[i+2].
- 🟢 **EN:** The pigeonhole trick: if element appears n times in 2n slots, within any window of 3 it must appear at least once with a match.
  **VI:** Mẹo pigeonhole: n lần trong 2n vị trí → trong cửa sổ 3 phần tử bất kỳ phải có match.
- 🟢 **EN:** Edge case: arr[n-2] == arr[n] wraps around — handle last pair separately if needed.
  **VI:** Edge case: phần tử cuối — kiểm tra arr[n-2]==arr[n] ở cuối mảng.
- 🟢 **EN:** Sorting approach: sort then check arr[i]==arr[i+1] — O(n log n) but simple.
  **VI:** Sắp xếp: sort rồi kiểm tra arr[i]==arr[i+1] — O(n log n) nhưng đơn giản.
- 🟢 **EN:** For interview: state HashSet first, then mention pigeonhole as O(1) space bonus.
  **VI:** Trong phỏng vấn: đề xuất HashSet trước, rồi đề cập pigeonhole như bonus.

---

---

## Solutions

```typescript
function repeatedNTimes_hash(nums: number[]): number {
  const seen = new Set<number>();
  for (const n of nums) {
    if (seen.has(n)) return n;
    seen.add(n);
  }
  return -1; // unreachable per problem guarantee
}

console.log(repeatedNTimes_hash([1, 2, 3, 3])); // 3
console.log(repeatedNTimes_hash([2, 1, 2, 5, 3, 2])); // 2
console.log(repeatedNTimes_hash([5, 1, 5, 2, 5, 3, 5, 4])); // 5

function repeatedNTimes(nums: number[]): number {
  const n = nums.length;
  // By pigeonhole, the repeated element appears at distance 1 or 2 somewhere
  for (let i = 0; i < n - 1; i++) {
    if (nums[i] === nums[i + 1]) return nums[i];
    if (i + 2 < n && nums[i] === nums[i + 2]) return nums[i];
  }
  // Last resort: last element equals second-to-last (already checked) or first
  return nums[0] === nums[n - 2] ? nums[0] : nums[n - 1];
}

// Test cases
console.log(repeatedNTimes([1, 2, 3, 3])); // Expected: 3
console.log(repeatedNTimes([2, 1, 2, 5, 3, 2])); // Expected: 2
console.log(repeatedNTimes([5, 1, 5, 2, 5, 3, 5, 4])); // Expected: 5
console.log(repeatedNTimes([9, 5, 6, 9])); // Expected: 9

function repeatedNTimes_sort(nums: number[]): number {
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === nums[i + 1]) return nums[i];
  }
  return -1;
}

console.log(repeatedNTimes_sort([1, 2, 3, 3])); // 3
```

---

## 🔗 Related Problems

| #   | Problem                   | Difficulty | Pattern            |
| --- | ------------------------- | ---------- | ------------------ |
| 169 | Majority Element          | 🟢 Easy    | Boyer-Moore / Hash |
| 287 | Find the Duplicate Number | 🟡 Medium  | Floyd's Cycle      |
| 136 | Single Number             | 🟢 Easy    | XOR                |
