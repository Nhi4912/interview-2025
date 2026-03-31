---
layout: page
title: "Number of Different Subsequences GCDs"
difficulty: Hard
category: Array
tags: [Array, Math, Counting, Number Theory]
leetcode_url: "https://leetcode.com/problems/number-of-different-subsequences-gcds"
---

# Number of Different Subsequences GCDs / Số GCD Khác Nhau Của Các Dãy Con

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Number Theory / GCD Enumeration

---

## 🧠 Intuition / Trực Giác

**VI:** Thay vì liệt kê tất cả dãy con (2^n), ta dùng tính chất số học: GCD của một dãy con bằng `g` khi và chỉ khi GCD của tất cả bội số của `g` có trong mảng bằng đúng `g`. Với mỗi ứng viên `g` từ 1 đến max(nums), tính GCD tích lũy của các phần tử trong nums là bội của `g`. Nếu kết quả bằng `g` thì `g` là một GCD hợp lệ.

**EN:** Instead of enumerating all 2^n subsequences, use number theory: GCD `g` is achievable iff the GCD of all multiples of `g` present in the array equals exactly `g`. For each candidate `g` (1 to max), accumulate GCD of all array elements divisible by g. If result == g, count it.

```
nums = [6, 10, 3]
max = 10

g=1: multiples in nums: 6,10,3 → gcd(6,10,3)=1 ✓ (g==1)
g=2: multiples in nums: 6,10  → gcd(6,10)=2   ✓ (g==2)
g=3: multiples in nums: 6,3   → gcd(6,3)=3    ✓ (g==3)
g=5: multiples in nums: 10    → gcd(10)=10    ✗ (g≠10)
g=6: multiples in nums: 6     → gcd(6)=6      ✓ (g==6)
g=10: multiples in nums: 10   → gcd(10)=10    ✓ (g==10)
Answer = 5 (g=1,2,3,6,10)
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔴 **EN:** Key insight: don't enumerate subsequences. Instead enumerate possible GCD values.
  **VI:** Thấu hiểu then chốt: không liệt kê dãy con, mà liệt kê các giá trị GCD có thể.
- 🔴 **EN:** For each g from 1 to maxVal, iterate over multiples g, 2g, 3g... (harmonic series).
  **VI:** Với mỗi g từ 1 đến maxVal, duyệt các bội g, 2g, 3g... (chuỗi điều hòa).
- 🔴 **EN:** Total iterations = maxVal*(1 + 1/2 + 1/3 + ... + 1/maxVal) = O(maxVal * log maxVal).
  **VI:** Tổng iterations = O(maxVal \* log maxVal) — chuỗi điều hòa.
- 🔴 **EN:** Use a lookup set/array for O(1) membership check of nums elements.
  **VI:** Dùng set/mảng tra cứu O(1) cho các phần tử của nums.
- 🔴 **EN:** GCD accumulation: `gcd(current, x)` — running gcd over all matching multiples.
  **VI:** Tích lũy GCD: `gcd(current, x)` — chạy gcd qua tất cả bội phù hợp.
- 🔴 **EN:** Time O(maxVal _ log maxVal), Space O(maxVal) — this is the intended solution.
  **VI:** Thời gian O(maxVal _ log maxVal), Không gian O(maxVal) — đây là giải pháp chính thức.

---

## Solutions / Giải Pháp

### Solution 1: GCD Enumeration — O(maxVal \* log maxVal) ✅ Optimal

```typescript
function countDifferentSubsequenceGCDs(nums: number[]): number {
  const maxVal = Math.max(...nums);

  // Mark which values are present in nums
  const present = new Uint8Array(maxVal + 1);
  for (const x of nums) present[x] = 1;

  // Helper: Euclidean GCD
  function gcd(a: number, b: number): number {
    while (b) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  let count = 0;
  // For each candidate GCD value g
  for (let g = 1; g <= maxVal; g++) {
    let currentGcd = 0;
    // Enumerate multiples of g present in nums
    for (let multiple = g; multiple <= maxVal; multiple += g) {
      if (present[multiple]) {
        currentGcd = gcd(currentGcd, multiple);
        if (currentGcd === g) break; // Can't get lower than g
      }
    }
    if (currentGcd === g) count++;
  }
  return count;
}

// Test cases
console.log(countDifferentSubsequenceGCDs([6, 10, 3])); // Expected: 5
console.log(countDifferentSubsequenceGCDs([5, 15, 40, 5, 6])); // Expected: 7
console.log(countDifferentSubsequenceGCDs([1])); // Expected: 1
console.log(countDifferentSubsequenceGCDs([2, 4])); // Expected: 2 (gcd=2, gcd=4)
```

### Solution 2: Same Approach, Cleaner GCD Helper — O(maxVal \* log maxVal)

```typescript
function countDifferentSubsequenceGCDs_v2(nums: number[]): number {
  const MAX = Math.max(...nums);
  const inNums = new Set(nums);

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

  let ans = 0;
  for (let g = 1; g <= MAX; g++) {
    let g_acc = 0;
    for (let m = g; m <= MAX; m += g) {
      if (inNums.has(m)) g_acc = gcd(g_acc, m);
    }
    if (g_acc === g) ans++;
  }
  return ans;
}

console.log(countDifferentSubsequenceGCDs_v2([6, 10, 3])); // 5
console.log(countDifferentSubsequenceGCDs_v2([5, 15, 40, 5, 6])); // 7
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                               | Difficulty | Pattern             |
| ---- | ------------------------------------- | ---------- | ------------------- |
| 2183 | Count Array Pairs Divisible by K      | 🔴 Hard    | GCD / Number Theory |
| 1979 | Find Greatest Common Divisor of Array | 🟢 Easy    | GCD                 |
| 858  | Mirror Reflection                     | 🟡 Medium  | Number Theory / LCM |
