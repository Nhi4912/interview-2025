---
layout: page
title: "Double Modular Exponentiation"
difficulty: Medium
category: Array
tags: [Array, Math, Simulation]
leetcode_url: "https://leetcode.com/problems/double-modular-exponentiation"
---

# Double Modular Exponentiation / Lũy Thừa Mô-đun Kép

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Tiếng Việt:** Với mỗi biến [a, b, c, m], tính (a^b % 10)^c % m bằng cách áp dụng mô-đun hai lần. Dùng fast modular exponentiation để tránh tràn số. Kiểm tra kết quả có bằng target không.

**English:** For each [a, b, c, m] in variables, compute (a^b % 10)^c % m using fast modpow. Two levels of modular exponentiation — hence "double". Return indices where result equals target.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Double Modular Exponentiation example:**

```
variables = [[2,3,3,10],[3,3,3,1],[6,1,1,4]]  target=2

i=0: base = 2^3 % 10 = 8, result = 8^3 % 10 = 512 % 10 = 2 ✓
i=1: base = 3^3 % 10 = 7, result = 7^3 % 1 = 0  ✗
i=2: base = 6^1 % 10 = 6, result = 6^1 % 4 = 2  ✓

Answer: [0, 2]
```

---

## Problem Description

| Problem                                                                         | Difficulty | Pattern                |
| ------------------------------------------------------------------------------- | ---------- | ---------------------- |
| [Pow(x, n)](https://leetcode.com/problems/powx-n/)                              | 🟡 Medium  | Fast Exponentiation    |
| [Super Pow](https://leetcode.com/problems/super-pow/)                           | 🟡 Medium  | Modular Exponentiation |
| [Find the Pivot Integer](https://leetcode.com/problems/find-the-pivot-integer/) | 🟢 Easy    | Math                   |

---

## 📝 Interview Tips

- 🔑 **EN:** Use fast modular exponentiation (binary exponentiation) for large powers | **VI:** Dùng lũy thừa mô-đun nhanh (bình phương liên tiếp) cho số mũ lớn
- 🔑 **EN:** First mod is always 10 (last digit); second mod is m | **VI:** Mô-đun đầu tiên luôn là 10 (chữ số cuối); mô-đun thứ hai là m
- 🔑 **EN:** modpow(base, exp, mod): handles base=0 and mod=1 edge cases | **VI:** modpow xử lý trường hợp biên base=0 và mod=1
- 🔑 **EN:** Intermediate result after step 1 is in [0,9] — small enough to use directly | **VI:** Kết quả trung gian sau bước 1 thuộc [0,9] — đủ nhỏ để dùng trực tiếp
- 🔑 **EN:** Collect indices (not values) where final result equals target | **VI:** Thu thập chỉ số (không phải giá trị) khi kết quả cuối bằng target
- 🔑 **EN:** O(n log maxExp) total time | **VI:** Tổng thời gian O(n log maxExp)

---

## Solutions

```typescript
/**
 * Double Modular Exponentiation
 * Time: O(n * log(max(b,c))) — modpow per variable
 * Space: O(1) extra (O(k) for result)
 */
function getGoodIndices(variables: number[][], target: number): number[] {
  const modpow = (base: number, exp: number, mod: number): number => {
    if (mod === 1) return 0;
    let result = 1;
    base %= mod;
    while (exp > 0) {
      if (exp & 1) result = (result * base) % mod;
      base = (base * base) % mod;
      exp >>= 1;
    }
    return result;
  };

  const goodIndices: number[] = [];

  for (let i = 0; i < variables.length; i++) {
    const [a, b, c, m] = variables[i];
    // Step 1: compute a^b % 10 (last digit of a^b)
    const inner = modpow(a, b, 10);
    // Step 2: compute inner^c % m
    const result = modpow(inner, c, m);
    if (result === target) goodIndices.push(i);
  }

  return goodIndices;
}

console.log(
  getGoodIndices(
    [
      [2, 3, 3, 10],
      [3, 3, 3, 1],
      [6, 1, 1, 4],
    ],
    2,
  ),
); // [0,2]
console.log(getGoodIndices([[39, 3, 1000, 1000]], 17)); // []
console.log(getGoodIndices([[1, 1, 1, 2]], 1)); // [0]

/**
 * Same logic, explicit iterative loop style
 * Time: O(n log maxExp) | Space: O(1)
 */
function getGoodIndices2(variables: number[][], target: number): number[] {
  function modExp(b: number, e: number, m: number): number {
    if (m === 1) return 0;
    let res = 1;
    b = b % m;
    for (; e > 0; e = Math.floor(e / 2)) {
      if (e % 2 === 1) res = (res * b) % m;
      b = (b * b) % m;
    }
    return res;
  }

  return variables
    .map(([a, b, c, m], i) => ({ i, val: modExp(modExp(a, b, 10), c, m) }))
    .filter(({ val }) => val === target)
    .map(({ i }) => i);
}

console.log(
  getGoodIndices2(
    [
      [2, 3, 3, 10],
      [3, 3, 3, 1],
      [6, 1, 1, 4],
    ],
    2,
  ),
); // [0,2]

/**
 * Use BigInt for guaranteed overflow safety
 * Time: O(n log maxExp) | Space: O(1)
 */
function getGoodIndices3(variables: number[][], target: number): number[] {
  const modpow = (base: bigint, exp: bigint, mod: bigint): bigint => {
    if (mod === 1n) return 0n;
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
      if (exp & 1n) result = (result * base) % mod;
      base = (base * base) % mod;
      exp >>= 1n;
    }
    return result;
  };

  const result: number[] = [];
  for (let i = 0; i < variables.length; i++) {
    const [a, b, c, m] = variables[i].map(BigInt);
    const inner = modpow(a, b, 10n);
    const val = modpow(inner, c, m);
    if (Number(val) === target) result.push(i);
  }
  return result;
}

console.log(
  getGoodIndices3(
    [
      [2, 3, 3, 10],
      [3, 3, 3, 1],
      [6, 1, 1, 4],
    ],
    2,
  ),
); // [0,2]
```

---

## 🔗 Related Problems

| Problem                                                                         | Difficulty | Pattern                |
| ------------------------------------------------------------------------------- | ---------- | ---------------------- |
| [Pow(x, n)](https://leetcode.com/problems/powx-n/)                              | 🟡 Medium  | Fast Exponentiation    |
| [Super Pow](https://leetcode.com/problems/super-pow/)                           | 🟡 Medium  | Modular Exponentiation |
| [Find the Pivot Integer](https://leetcode.com/problems/find-the-pivot-integer/) | 🟢 Easy    | Math                   |
