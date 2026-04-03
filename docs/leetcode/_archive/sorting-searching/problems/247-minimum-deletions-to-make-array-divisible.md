---
layout: page
title: "Minimum Deletions to Make Array Divisible"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Math, Sorting, Heap (Priority Queue), Number Theory]
leetcode_url: "https://leetcode.com/problems/minimum-deletions-to-make-array-divisible"
---

# minimum deletions to make array divisible

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn là quản lý kho nhạc, có một danh sách phí thuê nhạc (`nums`) và một danh sách hợp đồng
(`numsDivide`). Bạn muốn tìm mức phí nhỏ nhất mà tất cả hợp đồng đều là **bội số** của nó.
Thay vì kiểm tra từng cặp, bạn nhận ra rằng nếu `x` chia hết tất cả `numsDivide[i]`, thì
`x` phải chia hết **GCD** của tất cả `numsDivide`. Vậy chỉ cần tính 1 GCD rồi tìm phần tử
nhỏ nhất trong `nums` chia hết GCD đó. Số phần tử bị xóa = số phần tử nhỏ hơn nó.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
nums = [2, 3, 2, 4, 3],  numsDivide = [9, 6, 9, 3, 15]

Bước 1: Tính GCD của numsDivide
  GCD(9, 6) = 3
  GCD(3, 9) = 3
  GCD(3, 3) = 3
  GCD(3,15) = 3
  → g = 3

Bước 2: Sort nums = [2, 2, 3, 3, 4]

Bước 3: Duyệt từ nhỏ đến lớn:
  nums[0]=2: 3 % 2 ≠ 0 → skip (xóa)
  nums[1]=2: 3 % 2 ≠ 0 → skip (xóa)
  nums[2]=3: 3 % 3 = 0 ✓ → return 2

Output: 2  (xóa 2 phần tử trước khi gặp 3)
```

---

## Problem Description

| Problem                                                                                                             | Difficulty | Tags      |
| ------------------------------------------------------------------------------------------------------------------- | ---------- | --------- |
| [1979. Find Greatest Common Divisor of Array](https://leetcode.com/problems/find-greatest-common-divisor-of-array/) | Easy       | Math, GCD |
| [2183. Count Array Pairs Divisible by K](https://leetcode.com/problems/count-array-pairs-divisible-by-k/)           | Hard       | Math      |
| [858. Mirror Reflection](https://leetcode.com/problems/mirror-reflection/)                                          | Medium     | Math, GCD |
| [914. X of a Kind in a Deck of Cards](https://leetcode.com/problems/x-of-a-kind-in-a-deck-of-cards/)                | Easy       | Math, GCD |

---

## 📝 Interview Tips

1. **GCD reduces the problem** — Instead of checking divisibility against every element in numsDivide, compute their GCD once.
   _GCD thu gọn bài toán — Thay vì kiểm tra chia hết cho từng phần tử numsDivide, tính GCD một lần._

2. **Sort then linear scan** — After computing GCD, sort nums and scan from smallest: first element dividing GCD is the answer.
   _Sắp xếp rồi quét tuyến tính — Sau khi tính GCD, sort nums và quét từ nhỏ nhất: phần tử đầu tiên chia hết GCD là đáp án._

3. **Why GCD works** — If `x | a` and `x | b` then `x | gcd(a, b)`. So finding `x` that divides all numsDivide ↔ finding `x | gcd(numsDivide)`.
   _Tại sao GCD đúng — Nếu `x | a` và `x | b` thì `x | gcd(a, b)`. Vì vậy tìm `x` chia hết mọi numsDivide ↔ tìm `x | gcd(numsDivide)`._

4. **Return index, not value** — The answer is the count of elements before the valid one (i.e., its sorted index).
   _Trả về chỉ số, không phải giá trị — Đáp án là số phần tử trước phần tử hợp lệ (tức chỉ số sau khi sort)._

5. **Min-heap alternative** — Use a min-heap to pop elements one by one, counting until a divisor is found; same O(n log n) but cleaner.
   _Thay thế bằng min-heap — Dùng min-heap lấy từng phần tử, đếm cho đến khi tìm được ước; cùng O(n log n) nhưng rõ ràng hơn._

6. **Early termination** — If GCD itself is not in nums, we may still find a divisor of GCD; don't stop at the GCD value.
   _Dừng sớm — Nếu GCD không có trong nums, vẫn có thể tìm ước số của GCD; đừng dừng tại giá trị GCD._

---

## Solutions


---

## 🔗 Related Problems

| Problem                                                                                                             | Difficulty | Tags      |
| ------------------------------------------------------------------------------------------------------------------- | ---------- | --------- |
| [1979. Find Greatest Common Divisor of Array](https://leetcode.com/problems/find-greatest-common-divisor-of-array/) | Easy       | Math, GCD |
| [2183. Count Array Pairs Divisible by K](https://leetcode.com/problems/count-array-pairs-divisible-by-k/)           | Hard       | Math      |
| [858. Mirror Reflection](https://leetcode.com/problems/mirror-reflection/)                                          | Medium     | Math, GCD |
| [914. X of a Kind in a Deck of Cards](https://leetcode.com/problems/x-of-a-kind-in-a-deck-of-cards/)                | Easy       | Math, GCD |
