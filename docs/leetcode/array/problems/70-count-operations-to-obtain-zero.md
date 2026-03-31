---
layout: page
title: "Count Operations to Obtain Zero"
difficulty: Easy
category: Array
tags: [Math, Simulation]
leetcode_url: "https://leetcode.com/problems/count-operations-to-obtain-zero"
---

# Count Operations to Obtain Zero / Đếm Số Phép Toán Để Đưa Về Không

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math (Euclidean)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống trò chơi chia tiền — nếu bạn có nhiều hơn, bạn trả bớt cho người kia một lần. Nhưng nếu khoảng cách rất lớn, bạn có thể trả nhiều lần cùng một lúc bằng phép chia. Đây chính là thuật toán Euclid đếm bước.

**Pattern Recognition:**

- Signal: "repeatedly subtract smaller from larger", "until one reaches 0" → **Euclidean-style**
- Brute simulate O(max(num1,num2)), nhưng dùng floor division để jump nhiều bước
- Key insight: khi num1 >= num2, thay vì trừ từng lần, trừ `floor(num1/num2)` lần cùng lúc

**Visual — num1=2, num2=3:**

```
Step 1: num1(2) < num2(3) → num2 = 3-2 = 1,  ops=1
Step 2: num1(2) > num2(1) → num1 = 2-1 = 1,  ops=2
Step 3: num1(1) >= num2(1)→ num2 = 1-1 = 0,  ops=3
Answer = 3 ✅

Optimized (num1=10, num2=3):
floor(10/3)=3 ops → num1 = 10%3 = 1, ops=3
then num2(3) > num1(1): floor(3/1)=3 ops → num2=0, ops=6 ✅
```

---

## Problem Description

Given two non-negative integers `num1` and `num2`. In one operation, if `num1 >= num2`, do `num1 = num1 - num2`; otherwise do `num2 = num2 - num1`. Return the number of operations to make either number 0.

- Example 1: `num1=2, num2=3` → `3`
- Example 2: `num1=10, num2=10` → `1`

Constraints: `0 <= num1, num2 <= 10^5`

---

## 📝 Interview Tips

1. **Clarify**: "Nếu cả hai đều là 0 ngay từ đầu?" / If both are 0, return 0 — no operations needed
2. **Brute force**: "Simulate từng bước, O(max(a,b)) — chậm với số lớn" / Direct simulation is O(max)
3. **Optimize**: "Dùng floor division: num1 -= floor(num1/num2) \* num2 = num1 % num2" / Batch steps via modulo
4. **Edge cases**: "num1=0 hoặc num2=0 ngay đầu → return 0" / Zero input means already done
5. **Connection**: "Giống thuật toán GCD Euclid, nhưng đếm số bước" / This is essentially step-counting GCD
6. **Follow-up**: "Nếu num1, num2 lên đến 10^18?" / Large numbers → optimized modulo version is essential

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force Simulation
 * Time: O(max(num1, num2)) — one step at a time
 * Space: O(1)
 */
function countOperationsBrute(num1: number, num2: number): number {
  let ops = 0;
  while (num1 !== 0 && num2 !== 0) {
    if (num1 >= num2) num1 -= num2;
    else num2 -= num1;
    ops++;
  }
  return ops;
}

/**
 * Solution 2: Optimized — batch subtraction via floor division
 * Time: O(log(min(num1, num2))) — same as Euclidean GCD
 * Space: O(1)
 *
 * When num1 >= num2, we can do floor(num1/num2) subtractions at once.
 * num1 becomes num1 % num2; ops += floor(num1/num2)
 * (but if num1 % num2 == 0, we only need floor(num1/num2)-1 ops then stop)
 */
function countOperations(num1: number, num2: number): number {
  let ops = 0;
  while (num1 !== 0 && num2 !== 0) {
    if (num1 >= num2) {
      ops += Math.floor(num1 / num2);
      num1 = num1 % num2;
    } else {
      ops += Math.floor(num2 / num1);
      num2 = num2 % num1;
    }
  }
  return ops;
}

// === Test Cases ===
console.log(countOperations(2, 3)); // 3
console.log(countOperations(10, 10)); // 1
console.log(countOperations(0, 5)); // 0
console.log(countOperations(100, 3)); // 34 (brute: 34)
```

---

## 🔗 Related Problems

- [Add Binary](https://leetcode.com/problems/add-binary) — Math with binary numbers
- [Subtract the Product and Sum of Digits of an Integer](https://leetcode.com/problems/subtract-the-product-and-sum-of-digits-of-an-integer) — digit math
- [Greatest Common Divisor of Strings](https://leetcode.com/problems/greatest-common-divisor-of-strings) — uses GCD algorithm
- [Find Greatest Common Divisor of Array](https://leetcode.com/problems/find-greatest-common-divisor-of-array) — direct GCD application
