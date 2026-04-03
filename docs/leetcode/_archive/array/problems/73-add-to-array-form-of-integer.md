---
layout: page
title: "Add to Array-Form of Integer"
difficulty: Easy
category: Array
tags: [Array, Math]
leetcode_url: "https://leetcode.com/problems/add-to-array-form-of-integer"
---

# Add to Array-Form of Integer / Cộng Số Nguyên Vào Dạng Mảng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math (Grade School Addition)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống phép cộng tay từ phải sang trái trên giấy — cộng từng chữ số từ cuối, mang nhớ (carry) sang bên trái. Khi hết mảng mà vẫn còn carry hoặc k > 0, tiếp tục thêm vào đầu.

**Pattern Recognition:**

- Signal: "array represents digits", "add integer" → **Elementary carry addition**
- Duyệt từ cuối mảng sang đầu, cộng k vào digit cuối, carry = floor(sum/10), digit = sum%10
- Key insight: thay vì convert BigInt, carry k từng bước trong vòng lặp

**Visual — num=[1,2,0,0], k=34:**

```
idx:  3   2   1   0
dig:  0   0   2   1
      +34

Step 1: 0+34=34 → digit=4, k=3  → [...,4]
Step 2: 0+3=3   → digit=3, k=0  → [...,3,4]
Step 3: 2+0=2   → digit=2, k=0  → [1,2,3,4]
Step 4: 1+0=1   → digit=1, k=0
Result: [1,2,3,4] ✅
```

---

## Problem Description

The **array-form** of an integer `num` is an array representing its digits from left to right. Given `num` (array-form) and integer `k`, return the array-form of `num + k`.

- Example 1: `num=[1,2,0,0], k=34` → `[1,2,3,4]`
- Example 2: `num=[2,7,4], k=181` → `[4,5,5]`
- Example 3: `num=[2,1,5], k=806` → `[1,0,2,1]`

Constraints: `1 <= num.length <= 10^4`, `0 <= num[i] <= 9`, `num[0] != 0`, `1 <= k <= 10^4`

---

## 📝 Interview Tips

1. **Clarify**: "k có thể lớn hơn 9 không? (yes) Digits có leading zeros không?" / k can be multi-digit; no leading zeros in num
2. **Approach**: "Không cần convert BigInt — dùng carry trick, add k vào từng step" / Carry k leftward through array
3. **Key trick**: "Mỗi bước: sum = num[i] + k; digit = sum%10; k = Math.floor(sum/10)" / k acts as carry
4. **Edge cases**: "k tạo ra digits mới bên trái — unshift hoặc prepend vào result" / Carry can extend array left
5. **Avoid overflow**: "Không join thành number vì có thể overflow — dùng digit-by-digit" / Work digit by digit
6. **Follow-up**: "Cộng hai mảng digits?" / Add Two Numbers (linked list) is the same concept

---

## Solutions

```typescript
/**
 * Solution 1: Carry Addition (right to left)
 * Time: O(max(n, log k)) — iterate array plus any carry digits
 * Space: O(max(n, log k)) — output array
 */
function addToArrayForm(num: number[], k: number): number[] {
  const result: number[] = [];
  let i = num.length - 1;

  while (i >= 0 || k > 0) {
    if (i >= 0) {
      k += num[i];
      i--;
    }
    result.push(k % 10);
    k = Math.floor(k / 10);
  }

  return result.reverse();
}

/**
 * Solution 2: BigInt conversion (concise, but less interview-friendly)
 * Time: O(n) — string conversion
 * Space: O(n) — string intermediate
 */
function addToArrayFormBigInt(num: number[], k: number): number[] {
  const sum = BigInt(num.join("")) + BigInt(k);
  return sum.toString().split("").map(Number);
}

// === Test Cases ===
console.log(addToArrayForm([1, 2, 0, 0], 34)); // [1,2,3,4]
console.log(addToArrayForm([2, 7, 4], 181)); // [4,5,5]
console.log(addToArrayForm([2, 1, 5], 806)); // [1,0,2,1]
console.log(addToArrayForm([9, 9, 9], 1)); // [1,0,0,0]
```

---

## 🔗 Related Problems

- [Add Binary](https://leetcode.com/problems/add-binary) — same carry addition for binary strings
- [Add Strings](https://leetcode.com/problems/add-strings) — add two string-represented numbers
- [Plus One](https://leetcode.com/problems/plus-one) — add 1 to digit array
- [Multiply Strings](https://leetcode.com/problems/multiply-strings) — extended digit-by-digit arithmetic
