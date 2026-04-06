---
layout: page
title: "Math Problems"
category: Math
description: "Curated Math problems for interview preparation"
total_problems: 11
---

# Math Problems / Bài Toán Toán Học

> **Track**: Interview Prep | **Problems**: 11 curated
> **See also**: [Master Tracker](../00-master-tracker.md) | [Study Guide](../00-study-guide.md)

## 📋 Problem List / Danh Sách Bài Toán

| #   | Problem                                                                                                                                | Difficulty | Pattern                     | Target | v2.0 |
| --- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------- | ------ | ---- |
| 1   | [9. Palindrome Number](https://leetcode.com/problems/palindrome-number/) — Số đối xứng                                                 | 🟢 Easy    | Reverse Half                | 10 min | ⬜   |
| 2   | [202. Happy Number](https://leetcode.com/problems/happy-number/) — Số hạnh phúc                                                        | 🟢 Easy    | Floyd Cycle Detection       | 10 min | ⬜   |
| 3   | [326. Power of Three](https://leetcode.com/problems/power-of-three/) — Lũy thừa 3                                                      | 🟢 Easy    | Log / Max Divisor           | 10 min | ⬜   |
| 4   | [69. Sqrt(x)](https://leetcode.com/problems/sqrtx/) — Căn bậc hai nguyên                                                               | 🟢 Easy    | Binary Search / Newton      | 15 min | ⬜   |
| 5   | [7. Reverse Integer](https://leetcode.com/problems/reverse-integer/) — Đảo ngược số nguyên                                             | 🟡 Medium  | Digit Extraction + Overflow | 15 min | ⬜   |
| 6   | [50. Pow(x, n)](https://leetcode.com/problems/powx-n/) — Lũy thừa nhanh                                                                | 🟡 Medium  | Fast Exponentiation         | 20 min | ⬜   |
| 7   | [204. Count Primes](https://leetcode.com/problems/count-primes/) — Đếm số nguyên tố                                                    | 🟡 Medium  | Sieve of Eratosthenes       | 20 min | ⬜   |
| 8   | [43. Multiply Strings](https://leetcode.com/problems/multiply-strings/) — Nhân hai chuỗi số lớn                                        | 🟡 Medium  | Grade School Multiplication | 25 min | ⬜   |
| 9   | [372. Super Pow](https://leetcode.com/problems/super-pow/) — Lũy thừa siêu lớn mod 1337                                                | 🟡 Medium  | Modular Exponentiation      | 25 min | ⬜   |
| 10  | [166. Fraction to Recurring Decimal](https://leetcode.com/problems/fraction-to-recurring-decimal/) — Phân số thành thập phân tuần hoàn | 🟡 Medium  | Long Division + Hash Map    | 30 min | ⬜   |
| 11  | [149. Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line/) — Điểm tối đa cùng đường thẳng                        | 🔴 Hard    | GCD + Slope Hash Map        | 35 min | ⬜   |

### Legend / Chú thích

- ✅ v2.0 migrated (Tier 1) | ⬜ v1.0 format (pending upgrade)
- 🟢 Easy | 🟡 Medium | 🔴 Hard

---

## 📊 Patterns Covered / Các Kỹ Thuật

- **Reverse Half** _(Đảo Nửa Sau)_: Palindrome Number — đảo nửa sau rồi so sánh, không cần chuyển string
- **Floyd Cycle Detection** _(Phát Hiện Chu Kỳ Floyd)_: Happy Number — vòng lặp số = có chu kỳ, dùng slow/fast pointer
- **Binary Search on Answer** _(Tìm Nhị Phân Trên Đáp Án)_: Sqrt(x) — tìm nhị phân trong `[0, x]`
- **Fast Exponentiation** _(Lũy Thừa Nhanh)_: Pow(x,n), Super Pow — chia đôi số mũ O(log n)
- **Digit Extraction** _(Tách Chữ Số)_: Reverse Integer — `digit = n % 10`, xử lý overflow 32-bit
- **Sieve of Eratosthenes** _(Sàng Nguyên Tố)_: Count Primes — đánh dấu bội số, O(n log log n)
- **Grade School Mult** _(Nhân Từng Chữ Số)_: Multiply Strings — `result[i+j] += d1 * d2`
- **Modular Arithmetic** _(Số Học Modular)_: Super Pow — `(a*b) % m = ((a%m)*(b%m)) % m`
- **Long Division + Hash** _(Chia Dài + Bảng Băm)_: Fraction to Recurring Decimal — lưu dư số để phát hiện lặp
- **GCD + Slope Map** _(GCD + Bảng Dốc)_: Max Points on a Line — chuẩn hóa hệ số góc bằng GCD

---

## 🗺️ Study Order / Thứ Tự Học

**Tuần 1 — Kiến thức cơ bản (Fundamentals):**

1. #202 Happy Number → Floyd cycle, áp dụng tư duy linked list vào số học
2. #9 Palindrome Number → xử lý số không chuyển string
3. #326 Power of Three → so sánh các cách kiểm tra lũy thừa
4. #69 Sqrt(x) → binary search trên kết quả

**Tuần 2 — Kỹ thuật trung cấp (Intermediate Techniques):**

5. #7 Reverse Integer → tách chữ số + xử lý overflow 32-bit
6. #50 Pow(x, n) → fast exponentiation O(log n)
7. #204 Count Primes → Sieve of Eratosthenes kinh điển

**Tuần 3 — Nâng cao (Advanced):**

8. #43 Multiply Strings → nhân số lớn không dùng BigInteger
9. #372 Super Pow → modular exponentiation + chia để trị
10. #166 Fraction to Recurring Decimal → long division + HashMap phát hiện chu kỳ
11. #149 Max Points on a Line → GCD chuẩn hóa hệ số góc, bài khó nhất nhóm

---

## 💡 Key Insights / Điểm Mấu Chốt

| Concept        | Formula / Trick                                                                    |
| -------------- | ---------------------------------------------------------------------------------- |
| Fast Power     | `pow(x, n) = pow(x*x, n/2)` nếu n chẵn; `x * pow(x, n-1)` nếu n lẻ                 |
| Modular Mult   | `(a * b) % m = ((a % m) * (b % m)) % m`                                            |
| GCD (Euclid)   | `gcd(a, b) = gcd(b, a % b)` — dùng để chuẩn hóa hệ số góc                          |
| Overflow check | Trước khi `result = result*10 + digit`, kiểm tra `result > (INT_MAX - digit) / 10` |
| Sieve bound    | Chỉ cần đánh dấu từ `p*p` (không phải từ `2*p`) — tối ưu đáng kể                   |
| Happy Number   | Tổng bình phương chữ số: nếu `n=1` → hạnh phúc; nếu vào vòng lặp → không hạnh phúc |

> **Số nguyên tố cần nhớ**: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37 _(hay gặp trong bài mod)_
