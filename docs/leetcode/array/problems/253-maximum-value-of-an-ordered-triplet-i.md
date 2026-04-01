---
layout: page
title: "Maximum Value of an Ordered Triplet I"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/maximum-value-of-an-ordered-triplet-i"
---

# Maximum Value of an Ordered Triplet I / Giá Trị Lớn Nhất Của Bộ Ba Có Thứ Tự I

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Array
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Spiral Matrix](https://leetcode.com/problems/spiral-matrix) | [First Missing Positive](https://leetcode.com/problems/first-missing-positive)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Tưởng tượng bạn chọn 3 bạn học: bạn "cao nhất" (i), bạn "thấp nhất" (j) và bạn "nặng nhất" (k). Hiệu chiều cao (i-j) nhân với cân nặng (k) — tìm bộ ba tối đa. Với n ≤ 100, brute force 3 vòng lặp chạy dưới 1 triệu phép tính — hoàn toàn hợp lệ!

**Pattern Recognition:**

- Signal: `(nums[i]-nums[j])*nums[k]`, small `n` (≤100) → **Brute Force O(n³)** or **O(n) prefix tracking**
- Key insight: với version I (n nhỏ), O(n³) đủ; cần hiểu O(n) để trả lời follow-up

**Visual — nums=[12,6,1,2,7]:**

```
All valid triplets (i<j<k):
(0,1,2): (12-6)*1=6    (0,1,3): (12-6)*2=12   (0,1,4): (12-6)*7=42
(0,2,3): (12-1)*2=22   (0,2,4): (12-1)*7=77 ← MAX
(0,3,4): (12-2)*7=70   (1,2,3): (6-1)*2=10   ...

Best: i=0,j=2,k=4 → (12-1)*7 = 77
```

---

## 📝 Problem Description

Given a 0-indexed integer array `nums`. Return the maximum value of `(nums[i]-nums[j])*nums[k]` for all `0 ≤ i < j < k < n`. Return `0` if the maximum value is negative.

**Example 1:** `nums=[12,6,1,2,7]` → `77`
**Example 2:** `nums=[1,10,3,4,19]` → `133`

**Constraints:** `3 ≤ nums.length ≤ 100`, `1 ≤ nums[i] ≤ 10^6`

---

## 🎯 Interview Tips

1. **n ≤ 100 → O(n³) ok** / n nhỏ cho phép brute force: 100³ = 1M phép tính, đủ nhanh
2. **Return 0 if negative** / Trả 0 nếu kết quả âm: vì `(a-b)` có thể âm khi `a < b`
3. **Mention O(n) upgrade** / Đề xuất tối ưu: O(n) dùng prefix max + max diff giống version II
4. **Triplet order** / Thứ tự bộ ba: `i < j < k` nghiêm ngặt — không cho phép bằng nhau
5. **Edge case** / Trường hợp đặc biệt: mảng tăng dần → tất cả `(a-b) ≤ 0` → trả về 0
6. **Formula trick** / Mẹo công thức: cần `(a-b) > 0` và `c > 0` thì tích mới dương

---

## 💡 Solutions

### Approach 1: Three Nested Loops — Brute Force

/\*_ @complexity Time: O(n³) | Space: O(1) _/

```typescript
function maximumTripletValueI(nums: number[]): number {
  let ans = 0;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        ans = Math.max(ans, (nums[i] - nums[j]) * nums[k]);
      }
    }
  }
  return ans;
}
```

### Approach 2: One-Pass Prefix Tracking — Optimal O(n)

/\*_ @complexity Time: O(n) | Space: O(1) _/

```typescript
function maximumTripletValueIOpt(nums: number[]): number {
  let ans = 0;
  let maxI = 0; // max nums[i] seen so far
  let maxDiff = 0; // max (nums[i] - nums[j]) seen so far

  for (const num of nums) {
    ans = Math.max(ans, maxDiff * num); // use num as nums[k]
    maxDiff = Math.max(maxDiff, maxI - num); // use num as nums[j]
    maxI = Math.max(maxI, num); // use num as nums[i]
  }
  return ans;
}
```

---

## 🧪 Test Cases

```typescript
console.log(maximumTripletValueI([12, 6, 1, 2, 7])); // → 77
console.log(maximumTripletValueI([1, 10, 3, 4, 19])); // → 133
console.log(maximumTripletValueI([1, 2, 3])); // → 0 (all pairs a<b)
console.log(maximumTripletValueI([10, 1, 5])); // → 45 (i=0,j=1,k=2: 9*5)
console.log(maximumTripletValueIOpt([12, 6, 1, 2, 7])); // → 77
```

---

## Related Problems

| Problem                                                                                                        | Difficulty | Pattern         |
| -------------------------------------------------------------------------------------------------------------- | ---------- | --------------- |
| [Maximum Value of an Ordered Triplet II](https://leetcode.com/problems/maximum-value-of-an-ordered-triplet-ii) | Medium     | Prefix Tracking |
| [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock)               | Easy       | Prefix Min      |
| [3Sum](https://leetcode.com/problems/3sum)                                                                     | Medium     | Two Pointers    |
