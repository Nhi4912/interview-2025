---
layout: page
title: "Maximum Subarray Sum After One Operation"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/maximum-subarray-sum-after-one-operation"
---

# Maximum Subarray Sum After One Operation / Tổng Mảng Con Lớn Nhất Sau Một Phép Toán

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: State Machine DP
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Maximal Square](https://leetcode.com/problems/maximal-square)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Như kế toán được phép "phóng to" đúng một con số trong báo cáo tài chính (bình phương nó lên). Bạn muốn chọn dãy con liên tiếp mà tổng lớn nhất, với quyền đặc biệt bình phương đúng một phần tử. DP có 2 trạng thái: "chưa bình phương" và "đã bình phương đúng 1 lần".

**Pattern Recognition:**

- Signal: subarray sum + exactly one special operation → **State Machine DP** (2 states: used bonus / not used)
- Key insight: Track two states per element: `noSq[i]` = best subarray ending at i with no squaring; `withSq[i]` = best subarray ending at i with exactly one squaring done. Use Kadane's-style DP.

**Visual — nums=[2,-1,-4,-3] example:**

```
State: noSq | withSq

i=0 (2):
  noSq  = max(2, 2)         = 2     (fresh start or extend)
  withSq= max(2²=4, 2)      = 4     (square this element)
  res   = 4

i=1 (-1):
  noSq  = max(2-1=1, -1)    = 1     (extend or restart)
  withSq= max(4-1=3, 1+1=2, (-1)²=1) = 3  (extend withSq, or sq now)
  res   = 4

i=2 (-4):
  noSq  = max(1-4=-3, -4)   = -3
  withSq= max(3-4=-1, 1+16=17, 16)  = 17  (extend prev noSq, then sq -4!)
  res   = 17

i=3 (-3):
  noSq  = max(-3-3=-6, -3)  = -3
  withSq= max(17-3=14, -3+9=6, 9)   = 14
  res   = 17

Answer: 17  (subarray [2,-1,-4] with -4 squared → 2-1+16=17)
```

---

## 📝 Problem Description

You must replace exactly **one** element `nums[i]` with `nums[i]²`. Return the maximum possible subarray sum after this operation.

- **Example 1:** `nums=[2,-1,-4,-3]` → `17` (square -4: subarray [2,-1,16])
- **Example 2:** `nums=[1,-1,1,1,-1,-1,1]` → `4` (square any 1: take 4 ones)
- **Constraints:** `1 ≤ nums.length ≤ 10^5`, `-10^4 ≤ nums[i] ≤ 10^4`

---

## 🎯 Interview Tips

1. **Extend Kadane's** / Mở rộng Kadane: thay vì 1 biến, dùng 2 biến `noSq` và `withSq` — đây là state machine DP
2. **Transitions** / Chuyển trạng thái: `withSq` có 3 nguồn: (1) kéo dài withSq, (2) kéo dài noSq + bình phương nums[i], (3) bắt đầu mới với nums[i]²
3. **Must use exactly one** / Phải dùng đúng 1 lần: không thể trả về `noSq` — phải dùng `withSq` làm kết quả
4. **Negative squared** / Âm bình phương thành dương: nums[i] âm lớn → bình phương thành số dương rất lớn — đây thường là trường hợp tốt nhất
5. **Overflow** / Tràn số: nums[i] ≤ 10^4, nums[i]² ≤ 10^8, tổng ≤ n × 10^8 ≤ 10^13 — nên dùng số nguyên 64-bit
6. **Follow-up** / Biến thể: nếu được phép bình phương nhiều hơn 1 lần → DP với k trạng thái

---

## 💡 Solutions

### Approach 1: Brute Force O(n³) — Try All Subarrays and Square Positions

/\*_ @complexity Time: O(n³) | Space: O(1) _/

```typescript
function maxSumAfterOperationBrute(nums: number[]): number {
  const n = nums.length;
  let res = -Infinity;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Try squaring each element in [i..j]
      for (let sq = i; sq <= j; sq++) {
        let sum = 0;
        for (let t = i; t <= j; t++) sum += t === sq ? nums[t]**2 : nums[t];
        }
        res = Math.max(res, sum);
      }
    }
  }
  return res;
}
```

### Approach 2: State Machine DP — Optimal (Kadane's with 2 states)

/\*_ @complexity Time: O(n) | Space: O(1) _/

```typescript
function maxSumAfterOperation(nums: number[]): number {
  // noSq  = max subarray sum ending here, NO squaring used yet
  // withSq = max subarray sum ending here, exactly ONE squaring used
  let noSq = nums[0];
  let withSq = nums[0] * nums[0]; // square the first element
  let res = withSq;

  for (let i = 1; i < nums.length; i++) {
    const v = nums[i];
    const vSq = v * v;

    // Update withSq first (needs old noSq):
    // Option A: extend subarray that already used squaring
    // Option B: extend subarray without squaring, then square v now
    // Option C: start fresh subarray with just v²
    withSq = Math.max(withSq + v, noSq + vSq, vSq);

    // Update noSq (standard Kadane):
    noSq = Math.max(noSq + v, v);

    res = Math.max(res, withSq);
  }

  return res;
}
```

### Approach 3: Explicit 2D DP (clearer state transitions)

/\*_ @complexity Time: O(n) | Space: O(n) _/

```typescript
function maxSumAfterOperationClear(nums: number[]): number {
  const n = nums.length;
  // dp[i][0] = best subarray ending at i, no squaring
  // dp[i][1] = best subarray ending at i, exactly one squaring
  const dp0 = new Array(n),
    dp1 = new Array(n);
  dp0[0] = nums[0];
  dp1[0] = nums[0] ** 2;
  let res = dp1[0];

  for (let i = 1; i < n; i++) {
    const v = nums[i];
    dp0[i] = Math.max(dp0[i - 1] + v, v);
    dp1[i] = Math.max(dp1[i - 1] + v, dp0[i - 1] + v * v, v * v);
    res = Math.max(res, dp1[i]);
  }
  return res;
}
```

---

## 🧪 Test Cases

```typescript
console.log(maxSumAfterOperation([2, -1, -4, -3])); // → 17 ([2,-1,16])
console.log(maxSumAfterOperation([1, -1, 1, 1, -1, -1, 1])); // → 4
console.log(maxSumAfterOperation([-1])); // → 1
console.log(maxSumAfterOperation([3, 2, 1])); // → 12 (sq 3: [9,2,1])
console.log(maxSumAfterOperation([-5, -3, -1])); // → 25 (sq -5 alone)
```
---

## Related Problems

| Problem                                                                                                                      | Difficulty | Pattern            |
| ---------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Maximum Subarray](https://leetcode.com/problems/maximum-subarray)                                                           | Medium     | Kadane's DP        |
| [Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray)                                 | Medium     | Kadane's variant   |
| [Maximum Subarray Min-Product](https://leetcode.com/problems/maximum-subarray-min-product)                                   | Medium     | Stack + Prefix Sum |
| [Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown) | Medium     | State Machine DP   |
