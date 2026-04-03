---
layout: page
title: "Find The Original Array of Prefix Xor"
difficulty: Medium
category: Array
tags: [Array, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/find-the-original-array-of-prefix-xor"
---

# Find The Original Array of Prefix Xor / Tìm Mảng Gốc Từ Mảng XOR Tiền Tố

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Single Number](https://leetcode.com/problems/single-number) | [XOR Queries of a Subarray](https://leetcode.com/problems/xor-queries-of-a-subarray)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống mã hóa / giải mã — nếu bạn biết cách "cộng" (XOR) để tạo ra mảng tiền tố, thì "trừ" (XOR lại) sẽ cho bạn mảng gốc. XOR là phép toán tự nghịch: `a XOR a = 0`, `a XOR 0 = a`.

```
Tạo prefix XOR (forward):      Khôi phục arr (backward):
arr = [5, 7, 2, 3, 2]          pref = [5, 2, 0, 3, 1]
pref[0] = 5                    arr[0] = pref[0]          = 5
pref[1] = 5^7 = 2              arr[1] = pref[1]^pref[0]  = 2^5  = 7
pref[2] = 2^2 = 0              arr[2] = pref[2]^pref[1]  = 0^2  = 2
pref[3] = 0^3 = 3              arr[3] = pref[3]^pref[2]  = 3^0  = 3
pref[4] = 3^2 = 1              arr[4] = pref[4]^pref[3]  = 1^3  = 2
```

---

## Problem Description

Given an integer array `pref` of size `n`, find and return the array `arr` of size `n` such that `pref[i] = arr[0] XOR arr[1] XOR ... XOR arr[i]`. It is guaranteed a valid answer always exists.

- Example 1: `pref = [5,2,0,3,1]` → `[5,7,2,3,2]`
- Example 2: `pref = [13]` → `[13]`

Constraints: `1 <= pref.length <= 10^5`, `0 <= pref[i] <= 10^6`

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "XOR prefix có nghĩa là `pref[i] = arr[0]^...^arr[i]`?" / Confirm the prefix XOR definition before coding.
2. **Key insight / Chìa khóa**: "XOR là tự nghịch: `pref[i] XOR pref[i-1]` cho ra `arr[i]`" / `a^a=0` so XOR-ing adjacent prefix values recovers the original.
3. **Base case / Trường hợp cơ sở**: "`arr[0] = pref[0]` — xử lý riêng trước vòng lặp" / Index 0 is always the same as `pref[0]` since there's no previous element.
4. **Edge case / Trường hợp đặc biệt**: "Mảng 1 phần tử: trả về `[pref[0]]`" / Single-element array is trivially `[pref[0]]`.
5. **Complexity / Độ phức tạp**: "O(n) time, O(n) space cho output — tối ưu, không thể làm tốt hơn" / Must visit every element at least once; output array is required.
6. **Follow-up / Câu hỏi tiếp theo**: "Nếu cho `arr`, tính `pref` như thế nào? O(n) running XOR" / Forward: running XOR scan. Inverse problem is symmetric — same complexity.

---

## Solutions

```typescript
/**
 * Solution 1: Single Pass with index arithmetic
 * Time: O(n) — one pass through pref array
 * Space: O(n) — output array of same size
 */
function findArray(pref: number[]): number[] {
  const arr: number[] = [pref[0]];
  for (let i = 1; i < pref.length; i++) {
    arr.push(pref[i] ^ pref[i - 1]);
  }
  return arr;
}

/**
 * Solution 2: Functional style with Array.map
 * Time: O(n) — map creates one new array
 * Space: O(n) — output array
 */
function findArrayMap(pref: number[]): number[] {
  return pref.map((val, i) => (i === 0 ? val : val ^ pref[i - 1]));
}

/**
 * Solution 3: In-place mutation (modifies pref — only if mutation is allowed)
 * Time: O(n) — single right-to-left pass
 * Space: O(1) — modifies input in place
 */
function findArrayInPlace(pref: number[]): number[] {
  for (let i = pref.length - 1; i > 0; i--) {
    pref[i] ^= pref[i - 1];
  }
  return pref;
}

// === Test Cases ===
console.log(findArray([5, 2, 0, 3, 1])); // [5, 7, 2, 3, 2]
console.log(findArray([13])); // [13]
console.log(findArray([0])); // [0]
console.log(findArray([1, 1])); // [1, 0]   (1 XOR 1 = 0)
console.log(findArrayMap([5, 2, 0, 3, 1])); // [5, 7, 2, 3, 2]
console.log(findArrayInPlace([5, 2, 0, 3, 1])); // [5, 7, 2, 3, 2]

// Verify round-trip: apply prefix XOR to result → should get back original pref
function prefixXor(arr: number[]): number[] {
  const pref = [arr[0]];
  for (let i = 1; i < arr.length; i++) pref.push(pref[i - 1] ^ arr[i]);
  return pref;
}
const original = [5, 2, 0, 3, 1];
const recovered = findArray(original);
console.log(JSON.stringify(prefixXor(recovered)) === JSON.stringify(original)); // true
```

---

## 🔗 Related Problems

| Problem                                                                              | Pattern                | Difficulty |
| ------------------------------------------------------------------------------------ | ---------------------- | ---------- |
| [Single Number](https://leetcode.com/problems/single-number)                         | XOR cancellation       | 🟢 Easy    |
| [Single Number II](https://leetcode.com/problems/single-number-ii)                   | Bit counting mod 3     | 🟡 Medium  |
| [Missing Number](https://leetcode.com/problems/missing-number)                       | XOR with index         | 🟢 Easy    |
| [XOR Queries of a Subarray](https://leetcode.com/problems/xor-queries-of-a-subarray) | Prefix XOR range query | 🟡 Medium  |
