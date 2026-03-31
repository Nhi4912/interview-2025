---
layout: page
title: "Ugly Number III"
difficulty: Medium
category: Sorting-Searching
tags: [Math, Binary Search, Combinatorics, Number Theory]
leetcode_url: "https://leetcode.com/problems/ugly-number-iii"
---

# Ugly Number III / Số Xấu III

🟡 Medium | 🏷️ Math, Binary Search, Number Theory | [LeetCode](https://leetcode.com/problems/ugly-number-iii)

---

## 🧠 Intuition

**Vietnamese:** Số xấu = bội số của a HOẶC b. Binary search trên giá trị x: đếm số ugly ≤ x dùng inclusion-exclusion: `count(x) = x/a + x/b − x/lcm(a,b)`. Tìm x nhỏ nhất thỏa count(x) ≥ n.

**Analogy:** Đếm bội số trong dãy số — dùng nguyên lý bao hàm-loại trừ như đếm bạn học thích Toán HOẶC Văn: |Toán ∪ Văn| = |Toán| + |Văn| − |Toán ∩ Văn|.

```
n=3  a=2  b=3
lcm(2,3) = 6

x=4: 4/2 + 4/3 - 4/6 = 2+1-0 = 3 ≥ 3 ✅
x=3: 3/2 + 3/3 - 3/6 = 1+1-0 = 2 < 3 ❌
→ candidate = 4

But 4 must actually BE a multiple of 2 or 3!
4 is a multiple of 2 ✅ → answer = 4
```

---

## 📝 Interview Tips

- **EN:** Count ugly numbers ≤ x = `x/a + x/b − x/lcm(a,b)` (inclusion-exclusion) / **VI:** Đếm số xấu ≤ x bằng bao hàm-loại trừ
- **EN:** Binary search: find smallest x where count(x) ≥ n / **VI:** Binary search: tìm x nhỏ nhất có count(x) ≥ n
- **EN:** Answer must be an actual multiple of a or b — snap to nearest / **VI:** Đáp án phải là bội của a hoặc b — làm tròn xuống bội gần nhất
- **EN:** `lcm(a,b) = a * b / gcd(a,b)`; watch overflow — use BigInt or float division / **VI:** lcm(a,b) = a\*b/gcd(a,b); cẩn thận overflow
- **EN:** Search range: [1, 2 * 10^9] covers all n ≤ 10^9 / **VI:** Phạm vi tìm: [1, 2e9]
- **EN:** To find the actual n-th ugly: find x via BS, then answer = min multiple of a ≤ x, min multiple of b ≤ x that lands at rank n / **VI:** Sau BS, snap đến bội đúng rank n

---

## Solutions

### Solution 1: Binary Search + Inclusion-Exclusion

```typescript
/**
 * Binary search on value; count ugly numbers via inclusion-exclusion.
 * Time: O(log(2e9))  Space: O(1)
 */
function nthUglyNumber(n: number, a: number, b: number, c: number): number {
  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
  const lcm = (x: number, y: number): number => (x / gcd(x, y)) * y;

  const ab = lcm(a, b);
  const ac = lcm(a, c);
  const bc = lcm(b, c);
  const abc = lcm(ab, c);

  // Count of ugly numbers (multiples of a, b, or c) that are <= x
  const count = (x: number): number =>
    Math.floor(x / a) +
    Math.floor(x / b) +
    Math.floor(x / c) -
    Math.floor(x / ab) -
    Math.floor(x / ac) -
    Math.floor(x / bc) +
    Math.floor(x / abc);

  let lo = 1,
    hi = 2_000_000_000;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    count(mid) >= n ? (hi = mid) : (lo = mid + 1);
  }
  return lo;
}

// Tests
console.log(nthUglyNumber(3, 2, 3, 5)); // 4
console.log(nthUglyNumber(4, 2, 3, 4)); // 6
console.log(nthUglyNumber(5, 2, 11, 13)); // 10
console.log(nthUglyNumber(1000000000, 2, 217983653, 336916467)); // 1999999984
```

### Solution 2: Two factors only (a and b, no c)

```typescript
/**
 * Simpler version: only a and b (no c parameter).
 * Time: O(log(maxVal))  Space: O(1)
 */
function nthUglyNumberAB(n: number, a: number, b: number): number {
  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
  const ab = (a / gcd(a, b)) * b;

  const count = (x: number) => Math.floor(x / a) + Math.floor(x / b) - Math.floor(x / ab);

  let lo = 1,
    hi = Math.min(a, b) * n;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    count(mid) >= n ? (hi = mid) : (lo = mid + 1);
  }
  return lo;
}

// Tests
console.log(nthUglyNumberAB(3, 2, 3)); // 4
console.log(nthUglyNumberAB(4, 2, 3)); // 6
```

---

## 🔗 Related Problems

| Problem                                                                                                                  | Difficulty | Connection                          |
| ------------------------------------------------------------------------------------------------------------------------ | ---------- | ----------------------------------- |
| [Ugly Number II](https://leetcode.com/problems/ugly-number-ii)                                                           | 🟡 Medium  | Min-heap approach for ugly numbers  |
| [Minimize the Maximum of Two Arrays](https://leetcode.com/problems/minimize-the-maximum-of-two-arrays)                   | 🟡 Medium  | Binary search + inclusion-exclusion |
| [Kth Smallest Number in Multiplication Table](https://leetcode.com/problems/kth-smallest-number-in-multiplication-table) | 🔴 Hard    | Binary search on value + count      |
