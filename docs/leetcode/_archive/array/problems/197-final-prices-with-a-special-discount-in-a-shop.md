---
layout: page
title: "Final Prices With a Special Discount in a Shop"
difficulty: Easy
category: Array
tags: [Array, Stack, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop"
---

# Final Prices With a Special Discount in a Shop / Giá Cuối Với Giảm Giá Đặc Biệt

🟢 Easy | Array · Stack · Monotonic Stack

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Mỗi sản phẩm có giảm giá bằng giá sản phẩm **đầu tiên** đứng sau nó mà có giá ≤ nó. Đây chính là bài toán "Next Smaller or Equal Element" — dùng monotonic stack để giải O(n).

```
prices = [8,4,6,2,3]
Stack (monotonic non-decreasing):
  i=0: push 0. stack=[0(8)]
  i=1: 4≤8 → pop 0, prices[0]-=4=4. push 1. stack=[1(4)]
  i=2: 6>4 → push 2. stack=[1(4),2(6)]
  i=3: 2≤6 → pop 2, prices[2]-=2=4; 2≤4 → pop 1, prices[1]-=2=2; push 3. stack=[3(2)]
  i=4: 3>2 → push 4. stack=[3(2),4(3)]
Final = [4, 2, 4, 2, 3]
```

## Problem Description

Given array `prices`, the **final price** of item `i` is `prices[i] - discount`, where discount = `prices[j]` for the smallest `j > i` with `prices[j] <= prices[i]` (or 0 if no such j).

- **Example 1**: `prices = [8,4,6,2,3]` → `[4,2,4,2,3]`
- **Example 2**: `prices = [1,2,3,4,5]` → `[1,2,3,4,5]` (no discounts, all increasing)

## 📝 Interview Tips

- 💡 **Monotonic stack pattern / Mẫu stack đơn điệu**: "Next smaller or equal" → push indices, pop when found / "phần tử nhỏ hơn tiếp theo" → stack chỉ số
- 🔍 **Stack stores indices / Stack lưu chỉ số**: Not values — so we can update original array / không phải giá trị
- ⚠️ **Equal counts / Bằng nhau tính**: Condition is `prices[j] <= prices[i]`, not strict less-than / điều kiện ≤ không phải <
- 🧮 **O(n) amortized / O(n) khấu hao**: Each element pushed/popped at most once / mỗi phần tử vào/ra stack nhiều nhất 1 lần
- 📊 **Brute force O(n²) / Lực lượng O(n²)**: Also acceptable given constraints n ≤ 500 / cũng chấp nhận được
- 🎯 **In-place update / Cập nhật tại chỗ**: Can copy prices first or update directly / sao chép rồi cập nhật

## Solutions

### Solution 1: Monotonic Stack (Optimal O(n))

```typescript
/**
 * Use monotonic stack to find next smaller-or-equal element
 * Time: O(n) | Space: O(n)
 */
function finalPrices(prices: number[]): number[] {
  const result = [...prices];
  const stack: number[] = []; // stores indices, monotone non-decreasing

  for (let i = 0; i < prices.length; i++) {
    // While top of stack has price >= current price, apply discount
    while (stack.length > 0 && prices[stack[stack.length - 1]] >= prices[i]) {
      const idx = stack.pop()!;
      result[idx] = prices[idx] - prices[i];
    }
    stack.push(i);
  }
  return result;
}

// Tests
console.log(finalPrices([8, 4, 6, 2, 3])); // [4,2,4,2,3]
console.log(finalPrices([1, 2, 3, 4, 5])); // [1,2,3,4,5]
console.log(finalPrices([10, 1, 1, 6])); // [9,0,1,6]
console.log(finalPrices([5])); // [5]
```

### Solution 2: Brute Force O(n²)

```typescript
/**
 * For each item, find the first cheaper-or-equal item ahead
 * Time: O(n^2) | Space: O(1)
 */
function finalPricesBrute(prices: number[]): number[] {
  return prices.map((price, i) => {
    for (let j = i + 1; j < prices.length; j++) {
      if (prices[j] <= price) return price - prices[j];
    }
    return price;
  });
}

// Tests
console.log(finalPricesBrute([8, 4, 6, 2, 3])); // [4,2,4,2,3]
console.log(finalPricesBrute([1, 2, 3, 4, 5])); // [1,2,3,4,5]
console.log(finalPricesBrute([10, 1, 1, 6])); // [9,0,1,6]
```

### Solution 3: Reverse scan (alternative)

```typescript
/**
 * Build result right-to-left using stack
 * Time: O(n) | Space: O(n)
 */
function finalPricesReverse(prices: number[]): number[] {
  const n = prices.length;
  const result = new Array(n);
  const stack: number[] = []; // monotone stack of values

  for (let i = n - 1; i >= 0; i--) {
    // Pop elements larger than current price (they can't be discounts for i)
    while (stack.length > 0 && stack[stack.length - 1] > prices[i]) {
      stack.pop();
    }
    result[i] = stack.length > 0 ? prices[i] - stack[stack.length - 1] : prices[i];
    stack.push(prices[i]);
  }
  return result;
}

// Tests
console.log(finalPricesReverse([8, 4, 6, 2, 3])); // [4,2,4,2,3]
console.log(finalPricesReverse([1, 2, 3, 4, 5])); // [1,2,3,4,5]
```

## 🔗 Related Problems

| #   | Problem                 | Difficulty | Tags                   |
| --- | ----------------------- | ---------- | ---------------------- |
| 496 | Next Greater Element I  | Easy       | Stack, Monotonic Stack |
| 503 | Next Greater Element II | Medium     | Stack, Monotonic Stack |
| 739 | Daily Temperatures      | Medium     | Stack, Monotonic Stack |
| 901 | Online Stock Span       | Medium     | Stack, Monotonic Stack |
