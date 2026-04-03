---
layout: page
title: "Add Binary"
difficulty: Easy
category: String
tags: [Math, String, Bit Manipulation, Simulation]
leetcode_url: "https://leetcode.com/problems/add-binary"
---

# Add Binary / Cộng Hai Số Nhị Phân

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: String Simulation / Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 11 companies
> **See also**: [Multiply Strings](https://leetcode.com/problems/multiply-strings) | [Add Strings](https://leetcode.com/problems/add-strings)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như bạn học cộng số nhị phân ở trường — làm từ phải sang trái, cộng từng bit kèm carry. Bit kết quả là `(a + b + carry) % 2`, carry mới là `Math.floor((a + b + carry) / 2)`.

**Pattern:** Simulate right-to-left with carry — cùng pattern với Add Strings, Add Two Numbers (linked list).

```
  a = "1 1"        b = "1"
index  1 0   index    0

Step i=0: 1 + 1 + carry=0 = 2 → bit=0, carry=1
Step i=1: 1 + 0 + carry=1 = 2 → bit=0, carry=1
Step i=2: 0 + 0 + carry=1 = 1 → bit=1, carry=0

Result (reversed): "100" ✅
```

---

Cho hai chuỗi nhị phân `a` và `b`, trả về **tổng** của chúng dưới dạng chuỗi nhị phân.

- `a = "11", b = "1"` → `"100"` (3 + 1 = 4)
- `a = "1010", b = "1011"` → `"10101"` (10 + 11 = 21)

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Duyệt từ phải sang trái**: xử lý từng cặp bit cùng carry, giống cộng thủ công
- 🇺🇸 **Out-of-bounds safety**: use `i >= 0 ? +a[i] : 0` to default missing digits to 0
- 🇻🇳 **Carry sau vòng lặp**: nếu `carry > 0` sau khi xong, thêm `'1'` vào đầu kết quả
- 🇺🇸 **BigInt one-liner**: `(BigInt('0b'+a) + BigInt('0b'+b)).toString(2)` — mention but explain tradeoffs
- 🇻🇳 **Không dùng parseInt**: `parseInt('1010', 2)` mất độ chính xác khi chuỗi dài
- 🇺🇸 **Build result**: push bits into array → reverse → join (avoids O(n²) string concat)

---

## Solutions

### Solution 1: Right-to-Left with Carry — O(max(n,m)) time, O(max(n,m)) space ✅ Optimal

```typescript
/**
 * Simulate binary addition from right to left, tracking carry
 * Time: O(max(n, m)) | Space: O(max(n, m)) for result array
 */
function addBinary(a: string, b: string): string {
  const result: string[] = [];
  let i = a.length - 1;
  let j = b.length - 1;
  let carry = 0;

  while (i >= 0 || j >= 0 || carry > 0) {
    const bitA = i >= 0 ? +a[i--] : 0; // +string coerces "0"/"1" to number
    const bitB = j >= 0 ? +b[j--] : 0;
    const total = bitA + bitB + carry;

    result.push(String(total % 2)); // current bit
    carry = Math.floor(total / 2); // carry to next position
  }

  return result.reverse().join(""); // built backwards, reverse to get final answer
}

// Tests
console.log(addBinary("11", "1")); // "100"
console.log(addBinary("1010", "1011")); // "10101"
console.log(addBinary("0", "0")); // "0"
console.log(addBinary("1", "111")); // "1000"
console.log(addBinary("1111", "1111")); // "11110"
```

### Solution 2: BigInt One-liner — O(n) time, O(1) space

```typescript
/**
 * Use BigInt to parse binary strings — clean but relies on JS built-ins
 * Note: only safe because BigInt handles arbitrarily large numbers
 * Time: O(n) | Space: O(1) extra (BigInt overhead aside)
 */
function addBinaryBigInt(a: string, b: string): string {
  return (BigInt("0b" + a) + BigInt("0b" + b)).toString(2);
}

// Tests
console.log(addBinaryBigInt("11", "1")); // "100"
console.log(addBinaryBigInt("1010", "1011")); // "10101"
console.log(addBinaryBigInt("0", "0")); // "0"
```

> **When to use BigInt?** Only safe for inputs that are valid binary strings without leading zeros
> in a JS environment. For very large inputs (10⁴ digits), the manual simulation in Solution 1 is
> preferred — BigInt parsing is O(n) but carries runtime overhead. In interviews, mention BigInt
> exists, show Solution 1 first to demonstrate understanding of the carry algorithm.

### Carry Logic Quick Reference

```
a  b  carry | sum | bit | next carry
0  0    0   |  0  |  0  |     0
0  1    0   |  1  |  1  |     0
1  1    0   |  2  |  0  |     1
1  1    1   |  3  |  1  |     1
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                            | Difficulty | Pattern                         |
| ------------------------------------------------------------------ | ---------- | ------------------------------- |
| [Add Strings](https://leetcode.com/problems/add-strings)           | 🟢 Easy    | Same carry simulation, base-10  |
| [Multiply Strings](https://leetcode.com/problems/multiply-strings) | 🟡 Medium  | Extend carry to multiplication  |
| [Add Two Numbers](https://leetcode.com/problems/add-two-numbers)   | 🟡 Medium  | Same carry logic on linked list |
