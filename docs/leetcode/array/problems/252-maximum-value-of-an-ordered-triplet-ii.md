---
layout: page
title: "Maximum Value of an Ordered Triplet II"
difficulty: Medium
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/maximum-value-of-an-ordered-triplet-ii"
---

# Maximum Value of an Ordered Triplet II / Giá Trị Lớn Nhất Của Bộ Ba Có Thứ Tự II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Array
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Spiral Matrix](https://leetcode.com/problems/spiral-matrix) | [First Missing Positive](https://leetcode.com/problems/first-missing-positive)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Hãy tưởng tượng bạn đang chọn 3 thời điểm để giao dịch chứng khoán: mua ở đỉnh cao nhất (i), bán ở giá thấp nhất (j), rồi nhân với hệ số k sau đó. Chiến lược: duyệt từ trái sang, lưu lại giá trị max tại i và chênh lệch max (nums[i]-nums[j]) — khi đến k thì nhân ngay.

**Pattern Recognition:**

- Signal: `(nums[i]-nums[j])*nums[k]`, `i<j<k`, maximize → **Prefix Max + Running Max Diff**
- Key insight: duyệt k từ trái sang phải; tại mỗi k, `maxDiff = max(nums[i]-nums[j])` với `i<j<k`; kết quả = `maxDiff * nums[k]`

**Visual — nums=[1,10,3,4,19]:**

```
  i:  0   1   2   3   4
val:  1  10   3   4  19

k=2: maxI=max(1,10)=10, maxDiff=max(0,10-3)=7 → ans=7*3=21
k=3: maxI=10, maxDiff=max(7,10-4)=7 → ans=max(21,7*4)=28
k=4: maxI=10, maxDiff=max(7,10-19<0)=7 → ans=max(28,7*19)=133

Final answer = 133 (i=1,j=2,k=4: (10-3)*19=133)
```

---

## 📝 Problem Description

Given a 0-indexed integer array `nums`. Return the maximum value of `(nums[i]-nums[j])*nums[k]` for all `0 ≤ i < j < k < n`. Return `0` if no valid triplet exists.

**Example 1:** `nums=[12,6,1,2,7]` → `77` (i=0,j=2,k=4: (12-1)*7)
**Example 2:** `nums=[1,10,3,4,19]` → `133` (i=1,j=2,k=4: (10-3)*19)

**Constraints:** `3 ≤ nums.length ≤ 10^5`, `1 ≤ nums[i] ≤ 10^6`

---

## 🎯 Interview Tips

1. **Decompose formula** / Phân tích công thức: `(a-b)*c` → track `maxA`, `maxA-b`, rồi `(maxA-b)*c`
2. **Left-to-right sweep** / Quét trái sang phải: tại mỗi vị trí k, cập nhật theo thứ tự: ans → maxDiff → maxI
3. **Order matters** / Thứ tự quan trọng: cập nhật ans trước, rồi maxDiff, rồi maxI — tránh dùng nums[k] cùng lúc làm nums[i]
4. **Return 0 if negative** / Trả 0 nếu âm: dùng `Math.max(0, ans)` hoặc khởi tạo ans=0
5. **Brute O(n³)** / Brute force O(n³): với n ≤ 100 ok, nhưng bài II là n=10^5 → cần O(n)
6. **Follow-up** / Mở rộng: nếu cần `(i-j)*k` thì logic hoàn toàn đối xứng

---

## 💡 Solutions

### Approach 1: Brute Force — Three Nested Loops

/\*_ @complexity Time: O(n³) | Space: O(1) _/

```typescript
function maxTripletBrute(nums: number[]): number {
  let ans = 0;
  const n = nums.length;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      for (let k = j + 1; k < n; k++) ans = Math.max(ans, (nums[i] - nums[j]) * nums[k]);
  return ans;
}
```

### Approach 2: One-Pass with Prefix Tracking — Optimal

/\*_ @complexity Time: O(n) | Space: O(1) _/

```typescript
function maximumTripletValue(nums: number[]): number {
  let ans = 0;
  let maxI = 0; // max nums[i] seen so far (i < j)
  let maxDiff = 0; // max (nums[i] - nums[j]) seen so far (i < j < k)

  for (const num of nums) {
    // num acts as nums[k]: update answer
    ans = Math.max(ans, maxDiff * num);
    // num acts as nums[j]: update maxDiff using best nums[i] so far
    maxDiff = Math.max(maxDiff, maxI - num);
    // num acts as nums[i]: update maxI for future j,k
    maxI = Math.max(maxI, num);
  }
  return ans;
}
```

---

## 🧪 Test Cases

```typescript
console.log(maximumTripletValue([12, 6, 1, 2, 7])); // → 77
console.log(maximumTripletValue([1, 10, 3, 4, 19])); // → 133
console.log(maximumTripletValue([1, 2, 3])); // → 0 (all increasing → (a-b)<0)
console.log(maximumTripletValue([5, 5, 5])); // → 0
console.log(maxTripletBrute([12, 6, 1, 2, 7])); // → 77
```

---

## Related Problems

| Problem                                                                                                      | Difficulty | Pattern            |
| ------------------------------------------------------------------------------------------------------------ | ---------- | ------------------ |
| [Maximum Value of an Ordered Triplet I](https://leetcode.com/problems/maximum-value-of-an-ordered-triplet-i) | Easy       | Prefix Tracking    |
| [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock)             | Easy       | Prefix Min/Max     |
| [Maximum Subarray](https://leetcode.com/problems/maximum-subarray)                                           | Medium     | Kadane's Algorithm |
