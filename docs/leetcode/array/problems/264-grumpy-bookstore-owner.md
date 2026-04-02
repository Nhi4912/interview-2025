---
layout: page
title: "Grumpy Bookstore Owner"
difficulty: Medium
category: Array
tags: [Array, Sliding Window]
leetcode_url: "https://leetcode.com/problems/grumpy-bookstore-owner"
---

# Grumpy Bookstore Owner / Chủ Hiệu Sách Cáu Kỉnh

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📙 Tier 2 — Gặp ở 3+ companies
> **See also**: [Maximum Sum of Almost Unique Subarray](https://leetcode.com/problems/maximum-sum-of-almost-unique-subarray) | [Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i)

---

## Vietnamese Analogy (Ví dụ thực tế)

Chủ hiệu sách có tính cáu kỉnh — khi ông ta khó chịu, khách hàng bỏ đi không mua. Ông ta có một bí kíp đặc biệt dùng được đúng `k` phút liên tiếp để kiềm chế bản thân. Bài toán: chọn khoảng thời gian `k` phút nào để ông dùng bí kíp sao cho tổng số khách hàng hài lòng là nhiều nhất. Khách đã hài lòng (lúc ông không cáu) vẫn đến bất kể bí kíp. Chỉ những phút ông đang cáu mới cần bí kíp!

## Visual (Minh họa trực quan)

```
customers = [1,0,1,2,1,1,7,5], grumpy = [0,1,0,1,0,1,0,1], k = 3

Base (grumpy=0): idx 0,2,4,6 → 1+1+1+7 = 10

Sliding window of size k=3 over grumpy=1 minutes:
Window [0..2]: grumpy[1]=1 → gain=0      total=10+0=10
Window [1..3]: grumpy[1,3]=1,1 → gain=0+2=2  total=12
Window [2..4]: grumpy[3]=1 → gain=2      total=12
Window [3..5]: grumpy[3,5]=1,1 → gain=2+1=3  total=13
Window [4..6]: grumpy[5]=1 → gain=1      total=11
Window [5..7]: grumpy[5,7]=1,1 → gain=1+5=6  total=16 ← MAX ✓
```

## Problem (Bài toán)

A bookstore owner has customers arriving each minute. `grumpy[i]=1` means the owner is grumpy that minute (customers lost). The owner can use a secret technique for `k` consecutive minutes to suppress grumpiness. Return the **maximum total satisfied customers**.

**Example 1:** `customers=[1,0,1,2,1,1,7,5]`, `grumpy=[0,1,0,1,0,1,0,1]`, `k=3` → `16`
**Example 2:** `customers=[1]`, `grumpy=[0]`, `k=1` → `1`

**Constraints:** `1 ≤ customers.length ≤ 2×10^4`, `0 ≤ customers[i] ≤ 1000`, `grumpy[i] ∈ {0,1}`, `1 ≤ k ≤ customers.length`

## Tips (Mẹo phỏng vấn)

- **Decompose the problem** / Phân tách: Base (lúc không cáu) + Extra (cáu nhưng dùng bí kíp trong window k)
- **Fixed-size sliding window** / Cửa sổ trượt kích thước cố định: Tìm max extra trong window k
- **Only count grumpy=1** / Chỉ đếm khi cáu: `extra += customers[i] * grumpy[i]` trong window
- **Slide formula** / Công thức trượt: `extra += customers[r] * grumpy[r] - customers[r-k] * grumpy[r-k]`
- **Why add base separately** / Tại sao tách base: Tránh đếm trùng khách đã hài lòng vào extra
- **Brute O(n²)** / Brute force: Thử mọi window bắt đầu từ 0..n-k → vẫn chấp nhận được với n≤2×10^4

## Solution 1 - Brute Force (O(n·k))

```typescript
/**
 * @complexity Time: O(n·k) | Space: O(1)
 * Try every k-window position and compute total satisfied customers
 */
function maxSatisfiedBrute(customers: number[], grumpy: number[], k: number): number {
  const n = customers.length;
  const base = customers.reduce((s, c, i) => s + (grumpy[i] === 0 ? c : 0), 0);
  let maxExtra = 0;

  for (let start = 0; start <= n - k; start++) {
    let extra = 0;
    for (let j = start; j < start + k; j++) {
      extra += customers[j] * grumpy[j];
    }
    maxExtra = Math.max(maxExtra, extra);
  }
  return base + maxExtra;
}
```

## Solution 2 - Sliding Window (Optimal O(n))

```typescript
/**
 * @complexity Time: O(n) | Space: O(1)
 * Fixed-size sliding window over grumpy minutes to maximize extra gain
 */
function maxSatisfied(customers: number[], grumpy: number[], k: number): number {
  const n = customers.length;

  // Base: customers satisfied when owner is NOT grumpy
  let base = 0;
  for (let i = 0; i < n; i++) {
    if (grumpy[i] === 0) base += customers[i];
  }

  // Initial window [0..k-1]: extra customers we can save
  let windowExtra = 0;
  for (let i = 0; i < k; i++) {
    windowExtra += customers[i] * grumpy[i];
  }

  let maxExtra = windowExtra;

  // Slide window right
  for (let r = k; r < n; r++) {
    windowExtra += customers[r] * grumpy[r];
    windowExtra -= customers[r - k] * grumpy[r - k];
    maxExtra = Math.max(maxExtra, windowExtra);
  }

  return base + maxExtra;
}
```

## Test Cases

```typescript
console.log(maxSatisfied([1, 0, 1, 2, 1, 1, 7, 5], [0, 1, 0, 1, 0, 1, 0, 1], 3)); // → 16
console.log(maxSatisfied([1], [0], 1)); // → 1
console.log(maxSatisfied([4, 10, 10], [1, 1, 0], 2)); // → 24
console.log(maxSatisfiedBrute([1, 0, 1, 2, 1, 1, 7, 5], [0, 1, 0, 1, 0, 1, 0, 1], 3)); // → 16
```

## Related Problems

| Problem                               | Difficulty | Link                                                                           |
| ------------------------------------- | ---------- | ------------------------------------------------------------------------------ |
| Maximum Average Subarray I            | Easy       | [LC 643](https://leetcode.com/problems/maximum-average-subarray-i)             |
| Sliding Window Maximum                | Hard       | [LC 239](https://leetcode.com/problems/sliding-window-maximum)                 |
| Maximum Sum of Almost Unique Subarray | Medium     | [LC 2841](https://leetcode.com/problems/maximum-sum-of-almost-unique-subarray) |
