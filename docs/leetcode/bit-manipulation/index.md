---
layout: page
title: "Bit Manipulation Problems"
category: Bit Manipulation
description: "Curated Bit Manipulation problems for interview preparation"
total_problems: 11
---

# Bit Manipulation Problems / Bài Toán Thao Tác Bit

> **Track**: Interview Prep | **Problems**: 11 curated
> **See also**: [Master Tracker](../00-master-tracker.md) | [Study Guide](../00-study-guide.md)

## 📋 Problem List / Danh Sách Bài Toán

| #   | Problem                                                                                                              | Difficulty | Pattern                  | Target | v2.0 |
| --- | -------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------ | ------ | ---- |
| 1   | [136. Single Number](https://leetcode.com/problems/single-number/) — Tìm số không lặp                                | 🟢 Easy    | XOR Trick                | 10 min | ⬜   |
| 2   | [191. Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) — Đếm bit 1 (Hamming Weight)                | 🟢 Easy    | Bit Count (`n & n-1`)    | 10 min | ⬜   |
| 3   | [338. Counting Bits](https://leetcode.com/problems/counting-bits/) — Đếm bit 1 cho mảng 0..n                         | 🟢 Easy    | DP + Bit Shift           | 10 min | ⬜   |
| 4   | [268. Missing Number](https://leetcode.com/problems/missing-number/) — Tìm số bị thiếu                               | 🟢 Easy    | XOR / Gauss Sum          | 10 min | ⬜   |
| 5   | [231. Power of Two](https://leetcode.com/problems/power-of-two/) — Kiểm tra lũy thừa 2                               | 🟢 Easy    | Bit Check (`n & n-1`)    | 10 min | ⬜   |
| 6   | [190. Reverse Bits](https://leetcode.com/problems/reverse-bits/) — Đảo ngược các bit                                 | 🟢 Easy    | Bit Shifting             | 15 min | ⬜   |
| 7   | [371. Sum of Two Integers](https://leetcode.com/problems/sum-of-two-integers/) — Tổng hai số không dùng `+`          | 🟡 Medium  | Bit Arithmetic (AND/XOR) | 20 min | ⬜   |
| 8   | [78. Subsets](https://leetcode.com/problems/subsets/) — Sinh tất cả tập con                                          | 🟡 Medium  | Bitmask Enumeration      | 20 min | ⬜   |
| 9   | [201. Bitwise AND of Numbers Range](https://leetcode.com/problems/bitwise-and-of-numbers-range/) — AND cả dãy số     | 🟡 Medium  | Common Prefix Shift      | 20 min | ⬜   |
| 10  | [260. Single Number III](https://leetcode.com/problems/single-number-iii/) — Tìm hai số không lặp                    | 🟡 Medium  | XOR Partitioning         | 25 min | ⬜   |
| 11  | [318. Maximum Product of Word Lengths](https://leetcode.com/problems/maximum-product-of-word-lengths/) — Tích độ dài | 🟡 Medium  | Bitmask (26-bit alpha)   | 25 min | ⬜   |

### Legend / Chú thích

- ✅ v2.0 migrated (Tier 1) | ⬜ v1.0 format (pending upgrade)
- 🟢 Easy | 🟡 Medium | 🔴 Hard

---

## 📊 Patterns Covered / Các Kỹ Thuật

- **XOR Trick** _(Mẹo XOR)_: Single Number, Missing Number, Single Number III — XOR của hai giá trị bằng nhau = 0
- **Bit Count** _(Đếm Bit)_: Number of 1 Bits, Counting Bits — dùng `n & (n-1)` xóa bit thấp nhất
- **Bit Check** _(Kiểm Tra Bit)_: Power of Two — `n > 0 && (n & n-1) == 0` khi chỉ có 1 bit
- **Bit Shifting** _(Dịch Bit)_: Reverse Bits — shift từng bit sang phải/trái
- **Bit Arithmetic** _(Tính Toán Bit)_: Sum of Two Integers — cộng không dùng toán tử số học
- **Bitmask** _(Mặt Nạ Bit)_: Subsets, Maximum Product of Word Lengths — biểu diễn tập hợp bằng bit
- **Common Prefix** _(Tiền Tố Chung)_: Bitwise AND of Numbers Range — tìm prefix chung bằng shift

---

## 🗺️ Study Order / Thứ Tự Học

**Tuần 1 — Nền tảng (Foundation):**

1. #268 Missing Number → hiểu XOR cơ bản
2. #136 Single Number → áp dụng XOR thực tế
3. #191 Number of 1 Bits → làm quen `n & (n-1)`
4. #231 Power of Two → bit check một dòng

**Tuần 2 — Trung cấp (Intermediate):**

5. #338 Counting Bits → kết hợp DP + bit
6. #190 Reverse Bits → luyện thao tác shift
7. #371 Sum of Two Integers → bit arithmetic
8. #78 Subsets → bitmask enumeration

**Tuần 3 — Nâng cao (Advanced):**

9. #201 Bitwise AND of Numbers Range → common prefix
10. #260 Single Number III → XOR phân chia
11. #318 Maximum Product of Word Lengths → bitmask encoding

---

## 💡 Key Insights / Điểm Mấu Chốt

| Trick            | Code                  | Use Case            |
| ---------------- | --------------------- | ------------------- |
| XOR cancel       | `a ^ a = 0`           | Tìm số không lặp    |
| Clear lowest bit | `n & (n-1)`           | Đếm số bit 1        |
| Keep lowest bit  | `n & (-n)`            | Tìm bit thấp nhất   |
| Power of 2 check | `n > 0 && !(n & n-1)` | Kiểm tra lũy thừa 2 |
| Test bit k       | `(n >> k) & 1`        | Đọc giá trị bit k   |
| Set bit k        | `n \| (1 << k)`       | Bật bit k           |
| Clear bit k      | `n & ~(1 << k)`       | Tắt bit k           |
