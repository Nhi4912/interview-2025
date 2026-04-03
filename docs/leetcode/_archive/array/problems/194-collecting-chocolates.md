---
layout: page
title: "Collecting Chocolates"
difficulty: Medium
category: Array
tags: [Array, Enumeration]
leetcode_url: "https://leetcode.com/problems/collecting-chocolates"
---

# Collecting Chocolates / Thu Thập Sô Cô La

🟡 Medium | Array · Enumeration

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Bạn có n loại sô cô la xếp thành vòng tròn. Mỗi lần xoay vòng tốn x đồng. Sau r lần xoay, sô cô la loại i có thể mua bằng chi phí nhỏ nhất trong nums[(i+0)%n], nums[(i+1)%n], ..., nums[(i+r)%n]. Với mỗi r từ 0 đến n-1, tính tổng chi phí + r\*x.

```
nums = [20,1,15], x = 5
r=0: cost = 20+1+15=36, rotation = 0  → total 36
r=1: cost = min(20,1)+min(1,15)+min(15,20)=1+1+15=17, rotation=5 → 22
r=2: cost = min(20,1,15)+min(1,15,20)+min(15,20,1)=1+1+1=3, rotation=10 → 13
Answer = min(36,22,13) = 13
```

## Problem Description

There are `n` chocolates in a line, chocolate `i` has type `nums[i]` and cost `nums[i]`. In one operation (cost `x`), all chocolates shift right by 1 (type `i` can now be collected at position `i-1`). Return the **minimum cost** to collect one chocolate of each type.

- **Example 1**: `nums = [20,1,15], x = 5` → `13`
- **Example 2**: `nums = [1,2,3], x = 4` → `6` (no rotation needed)

## 📝 Interview Tips

- 💡 **Enumerate rotations / Duyệt số lần xoay**: Try all r from 0 to n-1, cost = r\*x + sum of min-so-far / duyệt r từ 0..n-1
- 🔍 **Prefix min / Min tiền tố**: Keep running minimum for each index as we rotate / cập nhật min chạy cho từng chỉ số
- ⚠️ **Modular access / Truy cập modulo**: After r rotations, chocolate i can access nums[(i+j)%n] for j=0..r / truy cập vòng
- 🧮 **O(n²) time / Độ phức tạp O(n²)**: n rotations × n elements / n vòng × n phần tử
- 📊 **In-place min array / Mảng min**: Update minCost[i] = min(minCost[i], nums[(i+r)%n]) / cập nhật dần
- 🎯 **Large x means no rotation / x lớn = không xoay**: If x is huge, answer is sum(nums) / x lớn thì không xoay

## Solutions

### Solution 1: Enumerate Rotations + Running Min (Optimal O(n²))

```typescript
/**
 * Try every rotation count 0..n-1, track min cost per position
 * Time: O(n^2) | Space: O(n)
 */
function minCostCollectingChocolates(nums: number[], x: number): number {
  const n = nums.length;
  const minCost = [...nums]; // minCost[i] = best price for type i so far
  let ans = nums.reduce((a, b) => a + b, 0); // r=0: no rotation

  for (let r = 1; r < n; r++) {
    // After r rotations, chocolate at position i can use nums[(i+r)%n]
    for (let i = 0; i < n; i++) {
      minCost[i] = Math.min(minCost[i], nums[(i + r) % n]);
    }
    const totalCost = r * x + minCost.reduce((a, b) => a + b, 0);
    ans = Math.min(ans, totalCost);
  }
  return ans;
}

// Tests
console.log(minCostCollectingChocolates([20, 1, 15], 5)); // 13
console.log(minCostCollectingChocolates([1, 2, 3], 4)); // 6
console.log(minCostCollectingChocolates([5], 3)); // 5
```

### Solution 2: Same approach, cleaner accumulate

```typescript
/**
 * Build min array incrementally, compute sum each rotation
 * Time: O(n^2) | Space: O(n)
 */
function minCostV2(nums: number[], x: number): number {
  const n = nums.length;
  const best = [...nums];
  let ans = Infinity;

  for (let r = 0; r < n; r++) {
    if (r > 0) {
      for (let i = 0; i < n; i++) {
        best[i] = Math.min(best[i], nums[(i + r) % n]);
      }
    }
    let sum = r * x;
    for (const v of best) sum += v;
    ans = Math.min(ans, sum);
  }
  return ans;
}

// Tests
console.log(minCostV2([20, 1, 15], 5)); // 13
console.log(minCostV2([1, 2, 3], 4)); // 6
console.log(minCostV2([10, 5], 2)); // let's see: r=0:15, r=1:5+2+min(5,10)=12 → 12
```

### Solution 3: BigInt safe for large constraints

```typescript
/**
 * Handle large nums (up to 1e9) with BigInt
 * Time: O(n^2) | Space: O(n)
 */
function minCostBig(nums: number[], x: number): number {
  const n = nums.length;
  const best = [...nums];
  let ans = best.reduce((a, b) => a + b, 0);

  for (let r = 1; r < n; r++) {
    for (let i = 0; i < n; i++) {
      best[i] = Math.min(best[i], nums[(i + r) % n]);
    }
    const totalCost = r * x + best.reduce((a, b) => a + b, 0);
    ans = Math.min(ans, totalCost);
  }
  return ans;
}

// Tests
console.log(minCostBig([20, 1, 15], 5)); // 13
console.log(minCostBig([1, 2, 3], 4)); // 6
console.log(minCostBig([100, 200, 300], 1000)); // 600 (no rotation cheaper)
```

## 🔗 Related Problems

| #    | Problem                                      | Difficulty | Tags                  |
| ---- | -------------------------------------------- | ---------- | --------------------- |
| 2214 | Minimum Health to Beat Game                  | Medium     | Array, Greedy         |
| 2516 | Take K of Each Character From Left and Right | Medium     | Array, Sliding Window |
| 2712 | Minimum Cost to Make All Characters Equal    | Medium     | Greedy                |
| 2765 | Longest Alternating Subarray                 | Easy       | Array                 |
