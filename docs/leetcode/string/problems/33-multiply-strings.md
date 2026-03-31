---
layout: page
title: "Multiply Strings"
difficulty: Medium
category: String
tags: [Math, String, Simulation]
leetcode_url: "https://leetcode.com/problems/multiply-strings"
---

# Multiply Strings / Nhân Hai Số Dạng Chuỗi

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Simulation — Grade-School Multiplication
> **Frequency**: 📘 Tier 2 — Gặp ở Google, Facebook, Microsoft; test khả năng mô phỏng số học không dùng BigInt
> **See also**: [Add Strings](https://leetcode.com/problems/add-strings) | [Add Binary](https://leetcode.com/problems/add-binary)

## 🧠 Intuition / Tư Duy

- **Analogy:** Nhân tay như hồi học cấp 1 — lấy từng chữ số của số thứ 2 nhân với từng chữ số của số thứ 1, ghi kết quả có lùi cột sang trái tùy vị trí. Cuối cùng cộng tất cả hàng lại. Thay vì nhiều dòng trung gian, ta dùng mảng kết quả `pos[i+j]` và `pos[i+j+1]`.

- **Pattern Recognition:**
  - `num1[i] * num2[j]` → đóng góp vào vị trí `[i+j]` (carry) và `[i+j+1]` (digit)
  - Mảng `pos` kích thước `m+n` đủ chứa tích (số m-digit × n-digit ≤ (m+n) digits)
  - Xây kết quả từ phải sang trái, xử lý carry inline

- **Visual — `"123" × "456"`:**

  ```
       1  2  3
  ×    4  5  6
  -----------
       6 12 18   ← 3×[4,5,6]
     5 10 15     ← 2×[4,5,6], lùi 1
   4  8 12       ← 1×[4,5,6], lùi 2

  pos[i+j] += carry_part, pos[i+j+1] += digit_part
  Sau tổng hợp: [0,5,6,0,8,8] → "56088"
  ```

## Problem Description

Cho hai số không âm `num1` và `num2` dưới dạng chuỗi, trả về tích của chúng cũng dưới dạng chuỗi. **Không được dùng BigInt hay parseInt để chuyển đổi trực tiếp.**

| Input          | Output    | Giải thích        |
| -------------- | --------- | ----------------- |
| `"2", "3"`     | `"6"`     | 2 × 3 = 6         |
| `"123", "456"` | `"56088"` | 123 × 456 = 56088 |

## 📝 Interview Tips

- 🇻🇳 Không dùng `BigInt(num1) * BigInt(num2)` — interviewer muốn thấy bạn hiểu arithmetic / 🇬🇧 _Avoid BigInt conversion — the point is to implement grade-school multiplication manually_
- 🇻🇳 Edge case quan trọng: `"0" * anything = "0"` — kiểm tra đầu ra trước khi trả về / 🇬🇧 _Edge case: if either input is "0", result is "0" — handle before building result string_
- 🇻🇳 `num1[i] * num2[j]` ảnh hưởng đến 2 vị trí: `pos[i+j]` (chục) và `pos[i+j+1]` (đơn vị) / 🇬🇧 _Each digit product affects two positions: pos[i+j] gets carry, pos[i+j+1] gets digit_
- 🇻🇳 Bỏ leading zeros khi build string kết quả (dùng `skipLeadingZero` flag) / 🇬🇧 _Strip leading zeros from result string — start writing when first non-zero digit found_

## Solutions

```typescript
/**
 * Solution 1: Grade-School — Row by Row (Intuitive)
 * Nhân num1 với từng chữ số của num2, tích lũy vào mảng kết quả.
 * Xử lý carry sau khi tính xong tất cả tích riêng lẻ.
 *
 * @time O(n*m) — n = len(num1), m = len(num2)
 * @space O(n+m) — mảng kết quả tối đa n+m chữ số
 */
function multiply(num1: string, num2: string): string {
  if (num1 === "0" || num2 === "0") return "0";

  const m = num1.length;
  const n = num2.length;
  const pos = new Array(m + n).fill(0);

  // Duyệt từ phải sang trái cho cả hai số
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const product = (num1.charCodeAt(i) - 48) * (num2.charCodeAt(j) - 48);
      const p1 = i + j; // vị trí carry
      const p2 = i + j + 1; // vị trí digit

      const sum = product + pos[p2];
      pos[p2] = sum % 10;
      pos[p1] += Math.floor(sum / 10);
    }
  }

  // Build string, bỏ leading zeros
  let result = "";
  for (const digit of pos) {
    if (!(result === "" && digit === 0)) {
      result += digit;
    }
  }
  return result || "0";
}

console.log(multiply("2", "3")); // "6"
console.log(multiply("123", "456")); // "56088"
console.log(multiply("0", "456")); // "0"
console.log(multiply("999", "999")); // "998001"

/**
 * Solution 2: Position-Based — Direct Contribution
 * Tương đương Solution 1 nhưng viết compact hơn;
 * thêm explicit carry propagation pass cuối.
 *
 * @time O(n*m) — cùng độ phức tạp
 * @space O(n+m) — mảng pos
 */
function multiplyV2(num1: string, num2: string): string {
  if (num1 === "0" || num2 === "0") return "0";

  const m = num1.length;
  const n = num2.length;
  const pos = new Array(m + n).fill(0);

  for (let i = m - 1; i >= 0; i--) {
    const d1 = num1.charCodeAt(i) - 48;
    for (let j = n - 1; j >= 0; j--) {
      const d2 = num2.charCodeAt(j) - 48;
      pos[i + j + 1] += d1 * d2;
    }
  }

  // Xử lý carry từ phải sang trái
  for (let i = pos.length - 1; i > 0; i--) {
    pos[i - 1] += Math.floor(pos[i] / 10);
    pos[i] %= 10;
  }

  // Skip leading zeros và build result
  const start = pos[0] === 0 ? 1 : 0;
  return pos.slice(start).join("");
}

console.log(multiplyV2("2", "3")); // "6"
console.log(multiplyV2("123", "456")); // "56088"
console.log(multiplyV2("99", "99")); // "9801"
```

## 🔗 Related Problems

| Problem                                                             | Pattern                | Difficulty |
| ------------------------------------------------------------------- | ---------------------- | ---------- |
| [415. Add Strings](https://leetcode.com/problems/add-strings)       | String Simulation      | 🟢 Easy    |
| [67. Add Binary](https://leetcode.com/problems/add-binary)          | Bit String Addition    | 🟢 Easy    |
| [66. Plus One](https://leetcode.com/problems/plus-one)              | Array Arithmetic       | 🟢 Easy    |
| [2. Add Two Numbers](https://leetcode.com/problems/add-two-numbers) | Linked List Arithmetic | 🟡 Medium  |
