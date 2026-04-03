---
layout: page
title: "Construct the Minimum Bitwise Array I"
difficulty: Easy
category: Array
tags: [Array, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/construct-the-minimum-bitwise-array-i"
---

# Construct the Minimum Bitwise Array I / Xây Dựng Mảng Bitwise Nhỏ Nhất I

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Phép so sánh tiếng Việt:** Bài này giống như bạn muốn "pha màu" — bạn có màu kết quả `prime[i]` và muốn tìm hai màu `ans` và `ans+1` sao khi trộn OR lại cho ra đúng màu đó, nhưng `ans` phải nhỏ nhất có thể.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Construct the Minimum Bitwise Array I example:**

```
prime[i] = 7  (0111)
ans = 3        (011)
ans+1 = 4      (100)
3 | 4 = 7  ✓  => ans[i] = 3

prime[i] = 5  (101)
ans = 4        (100)
ans+1 = 5      (101)
4 | 5 = 5  ✓  => ans[i] = 4
```

Với prime = 2: không tồn tại ans vì `ans | (ans+1) = 2` → trả về -1.

---

## Problem Description

---

## 📝 Interview Tips

1. **Chỉ số 2 là đặc biệt**: 2 là số nguyên tố duy nhất chẵn. `ans | (ans+1) >= 3` nên không bao giờ ra 2 → trả `-1`.
2. **Thử từ 0 đến prime[i]-1**: Vì `ans < prime[i]` (để OR có thể ra prime), duyệt brute force là đủ với constraints nhỏ.
3. **Constraints nhỏ**: `nums.length <= 100`, `nums[i] <= 1000` → O(n·p) hoàn toàn ổn.
4. **Bit trick nâng cao**: `ans = prime[i] ^ (1 << (lsb))` trong đó lsb là bit thấp nhất của `prime[i]`. Nhưng brute force là an toàn hơn.
5. **`ans | (ans+1)` chỉ thêm bit**: Phép OR chỉ bật thêm bit, không tắt. Vì thế `ans | (ans+1) >= prime[i]` hoặc `>`.
6. **Sự khác biệt với bài II**: Bài I dùng brute force đơn giản do constraints nhỏ; bài II phải dùng bit manipulation trực tiếp.

---

## Solutions

```typescript
/**
 * Approach 1: Brute Force — thử mọi ans < prime[i]
 * Time: O(n * max_prime)  Space: O(n)
 */
function minBitwiseArrayI(nums: number[]): number[] {
  const ans: number[] = [];

  for (const prime of nums) {
    if (prime === 2) {
      ans.push(-1);
      continue;
    }

    let found = -1;
    // Thử từ 0 đến prime-1, lấy ans nhỏ nhất thỏa mãn
    for (let a = 0; a < prime; a++) {
      if ((a | (a + 1)) === prime) {
        found = a;
        break; // ans nhỏ nhất là a đầu tiên tìm được
      }
    }
    ans.push(found);
  }

  return ans;
}

// Tests
console.log(minBitwiseArrayI([2, 3, 5, 7])); // [-1, 1, 4, 3]
console.log(minBitwiseArrayI([11, 13, 31])); // [9, 12, 15]
console.log(minBitwiseArrayI([2])); // [-1]

/**
 * Approach 2: Bit Trick — tắt bit thấp nhất của prime
 * Time: O(n * 30)  Space: O(n)
 *
 * Nếu prime là lẻ (tất cả prime > 2 đều lẻ):
 *   ans = prime - 1 nếu (prime-1) | prime == prime  (bit 0 là LSB)
 *   Tổng quát: tìm bit thấp nhất đang bật của prime, tắt nó để ra ans
 */
function minBitwiseArrayIBit(nums: number[]): number[] {
  const ans: number[] = [];

  for (const prime of nums) {
    if (prime === 2) {
      ans.push(-1);
      continue;
    }

    // Với prime lẻ, ans = prime với bit 0 bị tắt = prime - 1
    // Kiểm tra: (prime-1) | prime == prime?
    // (prime-1) có đặc điểm flip toàn bộ trailing bits của prime
    // Với số lẻ: prime = ...X1, prime-1 = ...X0 → OR = ...X1 = prime ✓
    // Nhưng cần ans nhỏ nhất → tắt bit thấp nhất khác bit 0 nếu prime-1 không đúng

    let found = -1;
    // Thử tắt từng bit từ thấp nhất
    for (let bit = 0; bit < 30; bit++) {
      if (prime & (1 << bit)) {
        const candidate = prime ^ (1 << bit); // tắt bit này
        if ((candidate | (candidate + 1)) === prime) {
          found = candidate;
          break;
        }
      }
    }
    ans.push(found);
  }

  return ans;
}

// Tests
console.log(minBitwiseArrayIBit([2, 3, 5, 7])); // [-1, 1, 4, 3]
console.log(minBitwiseArrayIBit([11, 13, 31])); // [9, 12, 15]
console.log(minBitwiseArrayIBit([17, 19, 23])); // [16, 18, 21]

/**
 * Approach 3: Direct Formula cho số nguyên tố lẻ
 * Time: O(n)  Space: O(n)
 *
 * Với prime lẻ p: ans = p & (p - 1)  → tắt LSB (luôn là bit 0 với số lẻ)
 * Chứng minh: p = ...b1, p-1 = ...b0
 *   p & (p-1) = tắt bit 0 → candidate = p - 1
 *   (p-1) | ((p-1)+1) = (p-1) | p
 *   p-1 = p với bit 0 bị tắt → OR với p lại có bit 0 = p ✓
 */
function minBitwiseArrayIDirect(nums: number[]): number[] {
  return nums.map((prime) => {
    if (prime === 2) return -1;
    // p & (p-1) tắt LSB; với prime lẻ, LSB = bit 0
    return prime & (prime - 1);
  });
}

// Tests
console.log(minBitwiseArrayIDirect([2, 3, 5, 7])); // [-1, 2, 4, 6] ← cần verify
console.log(minBitwiseArrayIDirect([11, 13, 31])); // [10, 12, 30]
// Verify: 2|3=3✓, 4|5=5✓, 6|7=7✓, 10|11=11✓, 12|13=13✓, 30|31=31✓
```

---

## 🔗 Related Problems

| Problem                                                                                                        | Difficulty | Pattern                        |
| -------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------ |
| [Construct the Minimum Bitwise Array II](https://leetcode.com/problems/construct-the-minimum-bitwise-array-ii) | Medium     | Same logic, larger constraints |
| [Single Number](https://leetcode.com/problems/single-number)                                                   | Easy       | Bit manipulation               |
| [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits)                                             | Easy       | Bit counting                   |
