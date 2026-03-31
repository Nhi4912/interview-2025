---
layout: page
title: "Check If It Is a Good Array"
difficulty: Hard
category: Array
tags: [Array, Math, Number Theory]
leetcode_url: "https://leetcode.com/problems/check-if-it-is-a-good-array"
---

# Check If It Is a Good Array / Kiểm Tra Mảng Tốt

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Math (Bézout's Identity / GCD)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bài toán tiền xu — với đồng 6 và 10 xu, bạn không thể trả đúng 1 xu (GCD=2). Nhưng với đồng 3 và 5 xu (GCD=1), bạn có thể trả bất kỳ số tiền nào đủ lớn. Đây là định lý Bézout: ax+by=1 có nghiệm nguyên ⟺ gcd(a,b)=1.

**Pattern Recognition:**

- Signal: "select subarray", "multiply elements", "make all 1s" → **GCD / Bézout's theorem**
- Có thể chọn bất kỳ tập indices, nhân hệ số nguyên → linear combination của các elements
- Key insight: GCD của toàn mảng == 1 ⟺ tồn tại cách tạo ra số 1 → toàn mảng thành 1

**Visual — nums=[12,5,7,23]:**

```
gcd(12,5) = gcd(5,2) = gcd(2,1) = 1 → stop early!

By Bézout: 5*5 - 2*12 = 25-24 = 1 ✅
Once we can make 1, multiply by any value to make the whole array 1.
Answer = true ✅

nums=[8,4,6]: gcd=2 ≠ 1 → impossible → false
```

---

## Problem Description

An array `nums` is **good** if you can select indices and assign integer multipliers such that the resulting linear combination equals `1`. By Bézout's identity, this is possible if and only if `gcd(nums) == 1`.

- Example 1: `nums=[12,5,7,23]` → `true` (gcd=1)
- Example 2: `nums=[29,6,10]` → `true` (gcd=1)
- Example 3: `nums=[8,4,6]` → `false` (gcd=2)

Constraints: `1 <= nums.length <= 10^5`, `1 <= nums[i] <= 10^9`

---

## 📝 Interview Tips

1. **Clarify**: "Có thể chọn bất kỳ tập con indices, hệ số là số nguyên bất kỳ (kể cả âm)" / Any subset, any integer multipliers
2. **Key theorem**: "Bézout: tổ hợp tuyến tính nguyên của {a1,...,ak} = gcd(a1,...,ak)" / Linear integer combinations equal the GCD
3. **Therefore**: "Mảng tốt ⟺ GCD của toàn mảng = 1" / Good array iff gcd(all elements) == 1
4. **GCD trick**: "Dừng sớm nếu running gcd = 1 — phần còn lại không ảnh hưởng" / Short-circuit when gcd reaches 1
5. **Why hard**: "Phần khó là nhận ra định lý Bézout, code chỉ là gcd()" / The insight is the hard part; code is trivial
6. **Follow-up**: "Nếu cần tìm tập con nhỏ nhất?" / Find minimum subset — NP-hard in general; use greedy on sorted primes

---

## Solutions

```typescript
/**
 * Helper: Euclidean GCD
 */
function gcd(a: number, b: number): number {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

/**
 * Solution 1: Compute GCD of entire array
 * Time: O(n log(max)) — n gcd operations, each O(log max)
 * Space: O(1)
 *
 * By Bézout's Identity: integer linear combinations of a set of integers
 * can produce any multiple of their GCD, and only those.
 * Array is "good" (can produce 1) iff gcd(nums) == 1.
 */
function isGoodArray(nums: number[]): boolean {
  let g = nums[0];
  for (let i = 1; i < nums.length; i++) {
    g = gcd(g, nums[i]);
    if (g === 1) return true; // early exit — gcd can only decrease
  }
  return g === 1;
}

/**
 * Solution 2: Functional reduce
 * Time: O(n log(max))
 * Space: O(1)
 */
function isGoodArrayReduce(nums: number[]): boolean {
  return nums.reduce((g, x) => gcd(g, x), 0) === 1;
}

// === Test Cases ===
console.log(isGoodArray([12, 5, 7, 23])); // true  (gcd=1)
console.log(isGoodArray([29, 6, 10])); // true  (gcd=1)
console.log(isGoodArray([8, 4, 6])); // false (gcd=2)
console.log(isGoodArray([2, 4, 6, 8])); // false (gcd=2)
console.log(isGoodArray([1])); // true  (gcd=1)
```

---

## 🔗 Related Problems

- [Number of Different Subsequences GCDs](https://leetcode.com/problems/number-of-different-subsequences-gcds) — count distinct GCDs of subsequences
- [Find Greatest Common Divisor of Array](https://leetcode.com/problems/find-greatest-common-divisor-of-array) — compute GCD of min/max
- [Minimize Length of Array Using Operations](https://leetcode.com/problems/minimize-length-of-array-using-operations) — GCD-based array reduction
- [Prime In Diagonal](https://leetcode.com/problems/prime-in-diagonal) — number theory on matrix
