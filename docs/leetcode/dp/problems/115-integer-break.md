---
layout: page
title: "Integer Break"
difficulty: Medium
category: Dynamic Programming
tags: [Math, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/integer-break"
---

# Integer Break / Chia Số Nguyên — Tối Đa Hoá Tích

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DP / Math (Greedy)
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees) | [Fibonacci Number](https://leetcode.com/problems/fibonacci-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như cắt dây thừng — bạn cắt `n` mét dây thành nhiều đoạn, tích chiều dài các đoạn lớn nhất khi dùng các đoạn dài 3 (do 3×3 > 2×2×2 > ...). Đây là bài toán có lời giải toán học tối ưu!

**Pattern Recognition:**

- DP: `dp[i]` = tích lớn nhất khi chia `i` thành ≥ 2 phần → O(n²)
- Math: luôn dùng 3s, trừ khi dư 1 (dùng 2+2 thay vì 3+1) → O(log n) hoặc O(1)

```
Tại sao số 3 là "ma thuật"?
  Xét chia x thành 2 phần bằng nhau: (x/2)² tối đa khi x=2
  2×2×2 = 8 vs 3×3 = 9 (với n=6)
  → Đoạn dài 3 > đoạn dài 2 về mặt hiệu quả

n=10: 3+3+4 → 3×3×4=36  (dư 1 → thêm vào 3 thành 4=2×2)
      3+3+2+2 → 36 ✓ cũng được
```

---

## Problem Description / Mô Tả Bài Toán

Cho số nguyên `n` (2 ≤ n ≤ 58), chia thành **ít nhất 2 số nguyên dương** (tổng = n). Trả về **tích lớn nhất** có thể.

**Example 1:** `n=2` → `1` (1×1)
**Example 2:** `n=10` → `36` (3×3×4)

**Constraints:** `2 ≤ n ≤ 58`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Key math insight: never use 1 (1 never helps), prefer 3s, use 2s for remainder.
   **VI:** Nhận thức toán: không bao giờ dùng 1, ưu tiên 3, dùng 2 cho phần dư.

2. **EN:** If n%3==1: use one less 3 and two extra 2s (3+1 = 4 → 2+2, product: 3 vs 4).
   **VI:** Nếu n%3==1: bỏ một 3, thêm hai 2 vào (tích: 3×1=3 < 2×2=4).

3. **EN:** DP transition: dp[i] = max(j*(i-j), j*dp[i-j]) for j in 1..i-1.
   **VI:** DP transition: dp[i] = max(j*(i-j), j*dp[i-j]) với j từ 1 đến i-1.

4. **EN:** Math solution O(1) is impressive in interviews but explain the proof.
   **VI:** Giải toán O(1) gây ấn tượng nhưng phải giải thích được.

5. **EN:** Base cases: dp[1]=1, dp[2]=1 (can only split into 1+1), dp[3]=2 (1+2).
   **VI:** Trường hợp cơ sở: dp[1]=1, dp[2]=1, dp[3]=2.

6. **EN:** The constraint n ≤ 58 fits in a 32-bit integer (max product ~1.5×10¹⁷ for n=58 needs BigInt).
   **VI:** n ≤ 58 vừa 32-bit int (tích lớn nhất ở n=58 cần BigInt thực sự).

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: DP — O(n²) ──────────────────────────────────────────────────
// dp[i] = max product when breaking integer i into at least 2 parts
// For each split point j: either keep j as-is (j*(i-j)) or further break i-j (j*dp[i-j])
function integerBreak_dp(n: number): number {
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    for (let j = 1; j < i; j++) {
      // j*(i-j): split into exactly 2 parts: j and (i-j)
      // j*dp[i-j]: split j off, then recursively break (i-j)
      dp[i] = Math.max(dp[i], j * (i - j), j * dp[i - j]);
    }
  }
  return dp[n];
}

// ─── Solution 2: Math / Greedy — O(log n) ────────────────────────────────────
// Proof: for x≥5, x < (x-3)*3; so always cut 3s.
// Exception: remainder 1 → replace last 3+1 with 2+2 (product 4>3).
function integerBreak(n: number): number {
  if (n === 2) return 1;
  if (n === 3) return 2;

  let product = 1;
  while (n > 4) {
    product *= 3;
    n -= 3;
  }
  // n is now 2, 3, or 4 — multiply remaining directly
  return product * n;
}

// ─── Solution 3: Pure Math — O(1) ────────────────────────────────────────────
function integerBreak_math(n: number): number {
  if (n === 2) return 1;
  if (n === 3) return 2;

  const remainder = n % 3;
  const threes = Math.floor(n / 3);

  if (remainder === 0) return Math.pow(3, threes);
  if (remainder === 1) return Math.pow(3, threes - 1) * 4; // replace 3+1 with 2+2
  return Math.pow(3, threes) * 2; // remainder 2, just multiply by 2
}

// ─── Tests ────────────────────────────────────────────────────────────────────
console.log(integerBreak(2)); // 1
console.log(integerBreak(10)); // 36  (3×3×4)
console.log(integerBreak(58)); // 1549681956
console.log(integerBreak_dp(10)); // 36
console.log(integerBreak_math(10)); // 36
console.log(integerBreak_math(12)); // 81  (3×3×3×3)
console.log(integerBreak_math(4)); // 4   (2×2)
```

---

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem                                                                                | Difficulty | Pattern   |
| --- | -------------------------------------------------------------------------------------- | ---------- | --------- |
| 279 | [Perfect Squares](https://leetcode.com/problems/perfect-squares)                       | 🟡 Medium  | DP / Math |
| 96  | [Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees) | 🟡 Medium  | DP        |
| 509 | [Fibonacci Number](https://leetcode.com/problems/fibonacci-number)                     | 🟢 Easy    | DP / Math |
