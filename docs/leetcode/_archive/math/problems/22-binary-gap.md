---
layout: page
title: "Binary Gap"
difficulty: Easy
category: Math
tags: [Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/binary-gap"
---

# Binary Gap / Khoảng Cách Bit Nhị Phân

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Bit Manipulation / One Pass
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Missing Number](https://leetcode.com/problems/missing-number) | [Add Binary](https://leetcode.com/problems/add-binary)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như đọc biển hiệu trên đường — ghi nhớ vị trí biển vừa qua, khi thấy biển tiếp theo thì tính khoảng cách. Lưu `lastOne` (vị trí bit 1 vừa gặp), cập nhật khi gặp bit 1 mới.

**Pattern Recognition:**

- Signal: "binary representation" + "distance between 1-bits" → **Bit scan + track last position**
- Dùng bitwise AND với 1 (`n & 1`) để đọc bit thấp nhất, sau đó right-shift
- Key insight: không cần convert sang string — scan từ LSB với `n & 1` và `n >>= 1`

**Visual — n = 22 (binary: 10110):**

```
n = 22 = 1 0 1 1 0
pos:     4 3 2 1 0  (reading right to left via shifts)

Scan: pos=1 → 1st '1' at pos=1 (lastOne=1)
      pos=2 → '1' at pos=2, gap=2-1=1, lastOne=2
      pos=4 → '1' at pos=4, gap=4-2=2, lastOne=4
MaxGap = 2 ✅
```

---

## Problem Description

Given a positive integer `n`, find and return the **longest distance** between any two consecutive 1-bits in the binary representation. Return `0` if there is only one 1-bit. ([LeetCode #868](https://leetcode.com/problems/binary-gap))

Difficulty: Easy | Acceptance: 64.7%

- **Example 1**: `n=22` (binary `10110`) → `2` (positions 1,2,4 → gaps 1,2 → max=2)
- **Example 2**: `n=8` (binary `1000`) → `0` (only one 1-bit)
- **Example 3**: `n=5` (binary `101`) → `2`

Constraints:

- `1 ≤ n ≤ 10⁹`

---

## 📝 Interview Tips

1. **Clarify**: "Consecutive 1-bits nghĩa là không có 1-bit nào khác giữa chúng không?" / Consecutive = adjacent 1s in the list of all 1 positions (not necessarily adjacent in binary)
2. **Brute force**: "Convert sang binary string, tìm vị trí các '1', tính max diff" / String conversion + index tracking
3. **Optimize**: "Scan trực tiếp bằng bit shift — không cần string" / Direct bit scanning with shift
4. **Track lastOne**: "Lưu vị trí bit 1 vừa gặp, update max khi gặp 1 mới" / Track last seen 1-position, update on each new 1
5. **Edge cases**: "Chỉ 1 bit '1' → trả về 0; số 1 (binary: 1) → 0" / Single 1-bit returns 0

---

## Solutions

```typescript
/**
 * Solution 1: String Conversion
 * Time: O(log n) — binary string has log2(n) characters
 * Space: O(log n) — string storage
 */
function binaryGapString(n: number): string | number {
  const bits = n.toString(2);
  let maxGap = 0,
    lastIdx = -1;
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === "1") {
      if (lastIdx !== -1) maxGap = Math.max(maxGap, i - lastIdx);
      lastIdx = i;
    }
  }
  return maxGap;
}

/**
 * Solution 2: Bit Scan (Right to Left) — Optimal
 * Time: O(log n) — at most 30 iterations for n ≤ 10^9
 * Space: O(1) — only scalar variables
 *
 * Scan LSB to MSB: check bit with (n & 1), shift right with (n >>= 1)
 */
function binaryGap(n: number): number {
  let maxGap = 0;
  let lastOne = -1; // position of last seen '1' bit
  let pos = 0;
  while (n > 0) {
    if (n & 1) {
      if (lastOne !== -1) maxGap = Math.max(maxGap, pos - lastOne);
      lastOne = pos;
    }
    n >>>= 1; // unsigned right shift (safe for 32-bit)
    pos++;
  }
  return maxGap;
}

// === Test Cases ===
console.log(binaryGap(22)); // 2  (10110: positions 1,2,4 → gaps 1,2)
console.log(binaryGap(8)); // 0  (1000: only one 1-bit)
console.log(binaryGap(5)); // 2  (101: positions 0,2 → gap 2)
console.log(binaryGap(6)); // 1  (110: positions 1,2 → gap 1)
console.log(binaryGap(1)); // 0  (single 1-bit)
console.log(binaryGapString(22)); // 2
```

---

## 🔗 Related Problems

- [Add Binary](https://leetcode.com/problems/add-binary) — binary string arithmetic
- [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits) — count set bits with bit scanning
- [Missing Number](https://leetcode.com/problems/missing-number) — XOR bit trick
- [Divide Two Integers](https://leetcode.com/problems/divide-two-integers) — bit shifting arithmetic
- [Counting Bits](https://leetcode.com/problems/counting-bits) — bit patterns across a range
