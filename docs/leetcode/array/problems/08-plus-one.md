---
layout: page
title: "Plus One"
difficulty: Easy
category: Array
tags: [Array, Math]
leetcode_url: "https://leetcode.com/problems/plus-one/"
---

# Plus One / Cộng Một Vào Số Biểu Diễn Dạng Mảng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Carry Propagation
> **Frequency**: 📘 Tier 3 — Warm-up phổ biến, thỉnh thoảng xuất hiện ở phone screen
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Add Binary #67](https://leetcode.com/problems/add-binary/)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy nghĩ đến việc cộng 1 bằng tay trên bảng. Bạn bắt đầu từ chữ số cuối (hàng đơn vị): nếu nhỏ hơn 9 thì tăng lên và dừng. Nếu là 9 thì đổi thành 0 rồi "nhớ 1" sang trái. Trường hợp toàn bộ đều là 9 — bạn cần thêm chữ số 1 ở đầu, đây là edge case duy nhất cần thêm bộ nhớ.

- **Pattern Recognition:**
  - Digit cuối < 9 → tăng lên, **return ngay** (early exit) — O(1) trong trường hợp thường gặp
  - Digit cuối = 9 → set về 0, carry tiếp tục sang trái → lặp lại
  - Vòng lặp kết thúc (tất cả là 9) → `[1, ...digits]` — tạo mảng mới dài hơn 1

- **Visual — Carry Propagation:**

  ```
  [1, 2, 9]  cộng 1
              ↑ i=2: 9→0, carry  → [1, 2, 0]
          ↑   i=1: 2<9, +1, return → [1, 3, 0] ✅

  [9, 9, 9]  cộng 1
              ↑ i=2: 9→0, carry  → [9, 9, 0]
          ↑   i=1: 9→0, carry    → [9, 0, 0]
      ↑       i=0: 9→0, carry    → [0, 0, 0]
  loop ends → prepend 1          → [1, 0, 0, 0] ✅
  ```

## Problem Description

Cho mảng `digits` biểu diễn một số nguyên lớn (từ trái sang phải là từ cao đến thấp, không có số 0 đứng đầu). Tăng số đó lên 1 và trả về mảng kết quả.

| Input     | Output      | Ghi chú                        |
| --------- | ----------- | ------------------------------ |
| `[1,2,3]` | `[1,2,4]`   | Không có carry                 |
| `[1,9,9]` | `[2,0,0]`   | Carry một phần                 |
| `[9,9,9]` | `[1,0,0,0]` | Carry toàn bộ, mảng dài thêm 1 |

## 📝 Interview Tips

- 🇻🇳 Hỏi ngay: input có thể rỗng không? / 🇬🇧 _Clarify: can input array be empty? (LeetCode guarantees ≥ 1)_
- 🇻🇳 Edge case quan trọng nhất: `[9,9,...,9]` → kết quả dài hơn 1 chữ số / 🇬🇧 _All-nines is the only case that grows the array length_
- 🇻🇳 Solution 1 **in-place** — chỉ tạo mảng mới khi tất cả là 9 / 🇬🇧 _Solution 1 is O(1) space for the common case_
- 🇻🇳 `BigInt` gọn nhưng interviewer thường cấm dùng built-in conversion / 🇬🇧 _BigInt is elegant but often disallowed; prefer Solution 1_
- 🇻🇳 **Return early** là chìa khóa tối ưu — không cần duyệt hết nếu không có carry / 🇬🇧 _Early return makes average case O(1) — most numbers don't end in 9_
- 🇻🇳 Đừng nhầm lẫn: bài này không yêu cầu **sort** hay **two pointers** / 🇬🇧 _Pure carry scan — no sorting or pointer tricks needed_

## Solutions

{% raw %}
/\*\*

- Solution 1: Carry Scan — Optimal (in-place)
- Duyệt từ cuối: tăng digit nếu < 9 rồi return ngay; ngược lại set = 0 và tiếp tục carry.
-
- @time O(n) worst-case (all 9s) | O(1) average (early return on first non-9)
- @space O(1) in-place — allocates new array only when all digits are 9
  \*/
  function plusOne(digits: number[]): number[] {
  for (let i = digits.length - 1; i >= 0; i--) {
  if (digits[i] < 9) {
  digits[i]++;
  return digits; // no carry left — done immediately
  }
  digits[i] = 0; // was 9 → set to 0, carry propagates left
  }
  return [1, ...digits]; // all digits were 9 → prepend leading 1
  }

// plusOne([1,2,3]) → [1,2,4] (no carry)
// plusOne([9]) → [1,0] (single digit overflow)
// plusOne([9,9,9]) → [1,0,0,0] (all-nines edge case)
// plusOne([1,0,9]) → [1,1,0] (carry stops mid-array)

/\*\*

- Solution 2: BigInt Conversion — Concise (tránh trong interview nếu không hỏi)
- Join → BigInt → +1n → toString → split → map. Ít code hơn nhưng dùng built-in.
-
- @time O(n) — join + parse + split are all linear
- @space O(n) — creates intermediate string and new array
  \*/
  function plusOneBigInt(digits: number[]): number[] {
  return (BigInt(digits.join("")) + 1n).toString().split("").map(Number);
  }

// plusOneBigInt([1,2,3]) → [1,2,4]
// plusOneBigInt([9,9]) → [1,0,0]
// plusOneBigInt([0]) → [1]
{% endraw %}

## 🔗 Related Problems

- [67. Add Binary](https://leetcode.com/problems/add-binary/) — cộng hai chuỗi nhị phân; cùng carry propagation
- [2. Add Two Numbers](https://leetcode.com/problems/add-two-numbers/) — carry qua linked list; cùng kỹ thuật nhớ
- [989. Add to Array-Form of Integer](https://leetcode.com/problems/add-to-array-form-of-integer/) — tổng quát hoá Plus One: cộng K bất kỳ vào mảng
- [415. Add Strings](https://leetcode.com/problems/add-strings/) — cộng hai số lớn dạng chuỗi
