---
layout: page
title: "Fibonacci Number"
difficulty: Easy
category: Dynamic Programming
tags: [Math, Dynamic Programming, Recursion, Memoization]
leetcode_url: "https://leetcode.com/problems/fibonacci-number"
---

# Fibonacci Number / Số Fibonacci

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 10 companies
> **See also**: [N-th Tribonacci Number](https://leetcode.com/problems/n-th-tribonacci-number) | [Climbing Stairs](https://leetcode.com/problems/climbing-stairs)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Như xếp gạch xây tường — mỗi viên gạch thứ n cần 2 viên bên dưới (n-1 và n-2). Bài toán nhỏ hơn đã được giải trước, ta dùng lại kết quả đó — đó là bản chất của **Dynamic Programming**.

**Pattern Recognition:** Overlapping subproblems + optimal substructure → DP. F(n) = F(n-1) + F(n-2) chỉ phụ thuộc 2 giá trị trước → tối ưu bằng 2 biến.

```
Recursive tree (overlapping):          DP table (reuse):
        F(5)                           n:  0  1  2  3  4  5
       /    \                          F:  0  1  1  2  3  5
    F(4)   F(3)                        ↑ build bottom-up, O(n) time O(n) space
    / \    / \
  F(3)F(2)F(2)F(1)  ← F(3),F(2) repeat!   Two vars → O(1) space
```

---

## 📋 Problem / Bài Toán

The Fibonacci numbers form the sequence: `F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)`. Given `n`, return `F(n)`.

- `F(2) = 1`, `F(3) = 2`, `F(4) = 3`, `F(10) = 55`, `F(30) = 832040`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Classic DP intro**: Bài này là template cho DP — recursion → memoization → bottom-up → space optimization.
- 🔑 **Nhận biết**: "F(n) phụ thuộc F(n-1), F(n-2)" → chỉ cần 2 biến, không cần mảng.
- ⚡ **Pure recursion O(2^n)**: Mỗi F(n) gọi 2 lần → exponential; tệ nhất, dùng để giải thích vấn đề.
- ⚡ **Memo/DP O(n)**: Lưu kết quả đã tính → mỗi subproblem giải 1 lần.
- ⚡ **Two-var O(1) space**: `prev, curr = curr, prev+curr` — tối ưu nhất cho interview.
- 🚨 **Base cases**: `n===0 → 0`, `n===1 → 1` — luôn handle trước khi loop/recurse.

---

## Solutions

### Solution 1 — Pure Recursion · O(2ⁿ) time · O(n) space (stack)

```typescript
/**
 * Direct recursive definition. Exponential — shows the problem clearly
 * but impractical for large n. Good for explaining overlapping subproblems.
 * Time: O(2^n) | Space: O(n) call stack
 */
function fib_recursive(n: number): number {
  if (n <= 1) return n;
  return fib_recursive(n - 1) + fib_recursive(n - 2);
}

console.log(fib_recursive(0)); // 0
console.log(fib_recursive(1)); // 1
console.log(fib_recursive(10)); // 55
```

### Solution 2 — Memoization (Top-Down DP) · O(n) time · O(n) space

```typescript
/**
 * Cache computed values to avoid redundant calls.
 * Converts exponential to linear by memoizing each subproblem.
 * Time: O(n) | Space: O(n)
 */
function fib_memo(n: number): number {
  const memo = new Map<number, number>();
  function dp(k: number): number {
    if (k <= 1) return k;
    if (memo.has(k)) return memo.get(k)!;
    const val = dp(k - 1) + dp(k - 2);
    memo.set(k, val);
    return val;
  }
  return dp(n);
}

console.log(fib_memo(10)); // 55
console.log(fib_memo(30)); // 832040
```

### Solution 3 — Two Variables (Bottom-Up DP) · O(n) time · O(1) space

```typescript
/**
 * Best solution: only need previous two values — no array needed.
 * Iteratively build up from base cases F(0)=0, F(1)=1.
 * Time: O(n) | Space: O(1)
 */
function fib(n: number): number {
  if (n <= 1) return n;
  let prev = 0,
    curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}

console.log(fib(0)); // 0
console.log(fib(1)); // 1
console.log(fib(2)); // 1
console.log(fib(10)); // 55
console.log(fib(30)); // 832040
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                            | Difficulty | Pattern                |
| ---------------------------------------------------------------------------------- | ---------- | ---------------------- |
| [Climbing Stairs](https://leetcode.com/problems/climbing-stairs)                   | 🟢 Easy    | DP (Fibonacci variant) |
| [N-th Tribonacci Number](https://leetcode.com/problems/n-th-tribonacci-number)     | 🟢 Easy    | DP (3-way Fibonacci)   |
| [House Robber](https://leetcode.com/problems/house-robber)                         | 🟡 Medium  | DP                     |
| [Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs) | 🟢 Easy    | DP                     |
