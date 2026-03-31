---
layout: page
title: "Sum of Square Numbers"
difficulty: Medium
category: Sorting-Searching
tags: [Math, Two Pointers, Binary Search]
leetcode_url: "https://leetcode.com/problems/sum-of-square-numbers"
---

# Sum of Square Numbers / Tổng Hai Số Bình Phương

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers / Math

## 🧠 Intuition / Trực Giác

**Vietnamese analogy**: Kiểm tra xem số `c` có thể viết là `a² + b²` với `a, b ≥ 0` không. Dùng hai con trỏ: `a=0` và `b=√c`. Nếu `a² + b² = c` → true; nếu nhỏ hơn tăng `a`; nếu lớn hơn giảm `b`.

```
c = 5
a=0, b=2: 0+4=4 < 5 → a++
a=1, b=2: 1+4=5 = 5 → return true ✅ (1²+2²=5)

c = 3
a=0, b=1: 0+1=1 < 3 → a++
a=1, b=1: 1+1=2 < 3 → a++
a=2 > b=1 → return false ✅
```

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Two pointers** / a=0, b=floor(√c): hội tụ vào giữa — O(√c) time
- 🔑 **Why √c?** / b² ≤ c nên b ≤ √c — đây là giới hạn trên chặt
- 🔑 **No overflow** / `a*a + b*b` với a,b ≤ √(2^31) ≈ 46340 — an toàn trong number
- 🔑 **Binary search variant** / Với mỗi a, binary search tìm b² = c - a² — O(√c log c)
- 🔑 **HashSet variant** / Tính mọi bình phương ≤ c vào set, kiểm tra (c - a²) ∈ set
- 🔑 **Edge c=0** / 0 = 0² + 0² → true

## Solutions

```typescript
// ─── Solution 1: Brute Force — O(√c × log c) ───
function judgeSquareSumBrute(c: number): boolean {
  for (let a = 0; a * a <= c; a++) {
    const rem = c - a * a;
    // Binary search for b² = rem
    let lo = 0,
      hi = rem;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const sq = mid * mid;
      if (sq === rem) return true;
      if (sq < rem) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return false;
}

console.log(judgeSquareSumBrute(5)); // true
console.log(judgeSquareSumBrute(3)); // false

// ─── Solution 2: Two Pointers — O(√c) ───
function judgeSquareSum(c: number): boolean {
  let a = 0;
  let b = Math.floor(Math.sqrt(c));

  while (a <= b) {
    const sum = a * a + b * b;
    if (sum === c) return true;
    if (sum < c) a++;
    else b--;
  }
  return false;
}

console.log(judgeSquareSum(0)); // true  (0²+0²)
console.log(judgeSquareSum(5)); // true  (1²+2²)
console.log(judgeSquareSum(3)); // false
console.log(judgeSquareSum(4)); // true  (0²+2²)
console.log(judgeSquareSum(2)); // true  (1²+1²)
console.log(judgeSquareSum(1)); // true  (0²+1²)

// ─── Solution 3: HashSet — O(√c) space ───
function judgeSquareSumSet(c: number): boolean {
  const squares = new Set<number>();
  for (let i = 0; i * i <= c; i++) squares.add(i * i);

  for (const sq of squares) {
    if (squares.has(c - sq)) return true;
  }
  return false;
}

console.log(judgeSquareSumSet(5)); // true
console.log(judgeSquareSumSet(3)); // false
console.log(judgeSquareSumSet(25)); // true (3²+4²)
```

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem               | Pattern                 |
| --- | --------------------- | ----------------------- |
| 633 | Sum of Square Numbers | This problem            |
| 367 | Valid Perfect Square  | Binary Search           |
| 1   | Two Sum               | Two Pointers / Hash Map |
| 202 | Happy Number          | Math / Floyd Cycle      |
