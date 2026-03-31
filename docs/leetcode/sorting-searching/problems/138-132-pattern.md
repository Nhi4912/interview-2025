---
layout: page
title: "132 Pattern"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Stack, Monotonic Stack, Ordered Set]
leetcode_url: "https://leetcode.com/problems/132-pattern"
---

# 132 Pattern / Mẫu 132

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Monotonic Stack

## 🧠 Intuition / Trực Giác

**Vietnamese analogy**: Tìm ba chỉ số i < j < k sao cho `nums[i] < nums[k] < nums[j]` (mẫu "1-3-2"). Đi từ phải sang trái: dùng stack đơn điệu để theo dõi ứng viên "3" (nums[j]), khi pop ra được giá trị lớn hơn min hiện tại ta giữ lại làm "2" (nums[k]). Nếu tìm được "1" < "2" thì thành công.

```
nums = [3, 1, 4, 2]   ← answer: 1 < 2 < 4

Scan right-to-left:
  i=3: stack=[], push 2.  stack=[2], k_max=-Inf
  i=2: 4 > 2 → pop 2, k_max=2. push 4. stack=[4], k_max=2
  i=1: nums[1]=1 < k_max=2 → FOUND 132 pattern! return true
  Pattern: nums[1]=1 (1) < nums[3]=2 (2) < nums[2]=4 (3) ✅
```

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Right-to-left scan** / Quét từ phải sang trái: stack giữ ứng viên "3", pop cho ứng viên "2"
- 🔑 **Monotonic stack** / Stack giảm dần: khi gặp phần tử lớn hơn đỉnh stack thì pop
- 🔑 **k_max tracks "2"** / `k_max` = max giá trị đã pop = ứng viên tốt nhất cho nums[k]
- 🔑 **Early exit** / Nếu `nums[i] < k_max` → tìm thấy "1", trả về true ngay
- 🔑 **Brute force** / O(n³) 3 vòng lồng nhau → O(n²) 2 vòng → O(n) monotonic stack
- 🔑 **Edge** / Mảng < 3 phần tử → false; mảng tăng dần → false (k_max luôn = -Inf)

## Solutions

```typescript
// ─── Solution 1: Brute Force — O(n³) ───
function find132patternBrute(nums: number[]): boolean {
  const n = nums.length;
  for (let i = 0; i < n - 2; i++)
    for (let j = i + 1; j < n - 1; j++)
      for (let k = j + 1; k < n; k++) if (nums[i] < nums[k] && nums[k] < nums[j]) return true;
  return false;
}

console.log(find132patternBrute([1, 2, 3, 4])); // false
console.log(find132patternBrute([3, 1, 4, 2])); // true
console.log(find132patternBrute([-1, 3, 2, 0])); // true

// ─── Solution 2: O(n²) — track min prefix ───
function find132patternN2(nums: number[]): boolean {
  const n = nums.length;
  let minLeft = nums[0];
  for (let j = 1; j < n - 1; j++) {
    for (let k = j + 1; k < n; k++) {
      if (minLeft < nums[k] && nums[k] < nums[j]) return true;
    }
    minLeft = Math.min(minLeft, nums[j]);
  }
  return false;
}

// ─── Solution 3: Monotonic Stack — O(n) ───
function find132pattern(nums: number[]): boolean {
  const n = nums.length;
  const stack: number[] = []; // decreasing stack, holds "3" candidates
  let kMax = -Infinity; // best "2" candidate (max popped value)

  // Scan right → left
  for (let i = n - 1; i >= 0; i--) {
    // nums[i] is our "1" candidate
    if (nums[i] < kMax) return true;

    // Pop smaller elements — they become better "2" candidates
    while (stack.length && stack[stack.length - 1] < nums[i]) {
      kMax = Math.max(kMax, stack.pop()!);
    }
    stack.push(nums[i]);
  }
  return false;
}

console.log(find132pattern([1, 2, 3, 4])); // false
console.log(find132pattern([3, 1, 4, 2])); // true
console.log(find132pattern([-1, 3, 2, 0])); // true
console.log(find132pattern([1, 0, 1, -4, -3])); // false
```

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem                        | Pattern         |
| --- | ------------------------------ | --------------- |
| 456 | 132 Pattern                    | This problem    |
| 84  | Largest Rectangle in Histogram | Monotonic Stack |
| 85  | Maximal Rectangle              | Monotonic Stack |
| 901 | Online Stock Span              | Monotonic Stack |
