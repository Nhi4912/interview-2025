---
layout: page
title: "Maximum Strong Pair XOR I"
difficulty: Easy
category: String
tags: [Array, Hash Table, Bit Manipulation, Trie, Sliding Window]
leetcode_url: "https://leetcode.com/problems/maximum-strong-pair-xor-i"
---

# Maximum Strong Pair XOR I / XOR Cặp Mạnh Tối Đa I

> **Track**: String | **Difficulty**: 🟢 Easy | **Pattern**: Brute Force / Bit Manipulation
> **Frequency**: Low — bài nhập môn XOR, nắm trước khi học bài Hard (II)
> **See also**: [Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array) | [Maximum Strong Pair XOR II](https://leetcode.com/problems/maximum-strong-pair-xor-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn có đội bóng 50 người. Hai người tạo thành "cặp mạnh" nếu sự chênh lệch số áo của họ không vượt quá số áo nhỏ hơn — tức là không quá cách biệt nhau (|x-y| ≤ min(x,y)). Từ tất cả các cặp mạnh, bạn tìm cặp nào khi XOR số áo lại cho ra kết quả lớn nhất. Vì chỉ có 50 người, thử tất cả (50×50)/2 cặp là hoàn toàn ổn — đây chính là brute force O(n²).

**Pattern Recognition:**

- Signal: "|x-y| ≤ min(x,y)" → **Strong pair condition** → equivalent to: x ≤ y ≤ 2x (after sorting)
- Bài này thuộc dạng brute force trên mảng nhỏ (n ≤ 50), kiểm tra điều kiện cặp và maximize XOR
- Key insight: điều kiện |x-y| ≤ min(x,y) với x ≤ y tương đương y ≤ 2x — dễ kiểm tra sau khi sort

**Visual — nums = [1, 2, 3, 4, 5] example:**

```
Check all pairs (x, y) where x ≤ y, condition: y ≤ 2x

(1,2): 2≤2×1=2 ✓  XOR=3
(1,3): 3≤2×1=2 ✗
(2,3): 3≤2×2=4 ✓  XOR=1
(2,4): 4≤2×2=4 ✓  XOR=6
(3,4): 4≤2×3=6 ✓  XOR=7  ← max
(3,5): 5≤2×3=6 ✓  XOR=6
(4,5): 5≤2×4=8 ✓  XOR=1

Maximum XOR from valid pairs = 7  (pair 3,4)
```

---

## Problem Description

You are given an array `nums`. A pair `(x, y)` is called **strong** if `|x - y| <= min(x, y)`. Return the maximum XOR value of all strong pairs. ([LeetCode](https://leetcode.com/problems/maximum-strong-pair-xor-i))

```
Example 1: nums = [1, 2, 3, 4, 5]   → 7    (pair (3,4): 3 XOR 4 = 7)
Example 2: nums = [10, 100]          → 0    (|10-100|=90 > min(10,100)=10, no valid pair)
Example 3: nums = [5, 5]             → 0    (5 XOR 5 = 0, trivial but valid)
```

Constraints: `1 <= nums.length <= 50`, `1 <= nums[i] <= 100`.

---

## 📝 Interview Tips

1. **"Simplify |x-y| ≤ min(x,y)"** — _Với x ≤ y: điều kiện trở thành y-x ≤ x, tức y ≤ 2x — dễ check hơn sau khi sort._
2. **"Brute force O(n²) is fine for n≤50"** — _50×50=2500 phép XOR — hoàn toàn chấp nhận được, không cần trie._
3. **"A pair (x,x) is always valid — XOR=0"** — _Cặp giống nhau luôn là strong pair nhưng XOR=0, không ảnh hưởng max._
4. **"This is prep for Problem II (Hard)"** — _Cùng bài toán nhưng n lên tới 5×10^4, cần trie + sliding window._
5. **"XOR maximization: try to flip each bit from MSB"** — _Nguyên lý cơ bản của XOR trie — tại mỗi bit, ưu tiên chọn nhánh ngược để tạo bit 1._
6. **"Self-pairs (i=j) are valid — include i≤j in loop"** — _Đề bài cho phép x=y, vì thế loop nên bắt đầu j=i._

---

## Solutions

```typescript
/** Solution 1: Brute Force O(n²)  @complexity Time: O(n²) | Space: O(1) */
function maximumStrongPairXor(nums: number[]): number {
  let max = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i; j < nums.length; j++) {
      const x = nums[i],
        y = nums[j];
      // strong pair condition: |x-y| <= min(x,y)
      if (Math.abs(x - y) <= Math.min(x, y)) {
        max = Math.max(max, x ^ y);
      }
    }
  }
  return max;
}

/** Solution 2: Sort + equivalent condition  @complexity Time: O(n² + n log n) | Space: O(n) */
function maximumStrongPairXor2(nums: number[]): number {
  // After sorting x<=y: |x-y|<=min(x,y) ⟺ y-x<=x ⟺ y<=2x
  const sorted = [...nums].sort((a, b) => a - b);
  let max = 0;
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i; j < sorted.length; j++) {
      if (sorted[j] <= 2 * sorted[i]) {
        max = Math.max(max, sorted[i] ^ sorted[j]);
      } else {
        break; // sorted: no point checking further j
      }
    }
  }
  return max;
}

// === Test Cases ===
console.log(maximumStrongPairXor([1, 2, 3, 4, 5])); // 7
console.log(maximumStrongPairXor([10, 100])); // 0
console.log(maximumStrongPairXor([5, 5])); // 0
console.log(maximumStrongPairXor2([1, 2, 3, 4, 5])); // 7
console.log(maximumStrongPairXor([1])); // 0  (single element, pair with itself)
```

---

## 🔗 Related Problems

| #    | Problem                                | Difficulty | Pattern               |
| ---- | -------------------------------------- | ---------- | --------------------- |
| 421  | Maximum XOR of Two Numbers in an Array | Medium     | Trie                  |
| 136  | Single Number                          | Easy       | Bit Manipulation      |
| 260  | Single Number III                      | Medium     | Bit Manipulation      |
| 2935 | Maximum Strong Pair XOR II             | Hard       | Trie + Sliding Window |
