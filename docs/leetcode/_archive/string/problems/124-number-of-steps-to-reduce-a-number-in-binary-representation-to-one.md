---
layout: page
title: "Number of Steps to Reduce a Number in Binary Representation to One"
difficulty: Medium
category: String
tags: [String, Bit Manipulation, Simulation]
leetcode_url: "https://leetcode.com/problems/number-of-steps-to-reduce-a-number-in-binary-representation-to-one"
---

# Number of Steps to Reduce a Binary Number to One / Rút Gọn Số Nhị Phân Về 1

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bit Manipulation / Simulation
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Ví dụ thực tế:** Giống như bạn đang trả góp một khoản nợ bằng tiền lẻ — nếu số lẻ (dư đồng bạc) thì làm tròn lên (+1), nếu chẵn thì chia đôi. Mỗi thao tác tốn 1 bước; bạn đếm bao nhiêu bước để về "1 đồng".

**Pattern Recognition:**

- `"binary string" + "even/odd rules"` → Simulate bit-by-bit từ phải sang trái
- Bit cuối = 0 → chia 2 (shift right, cost 1); Bit cuối = 1 → +1 rồi chia 2 (cost 2, sinh carry)
- Theo dõi `carry` thay vì thực sự cộng → O(n) time, O(1) space

**Visual:**

```
s = "1101"  (= 13 decimal)

i=3: bit '1' + carry 0 = 1 (odd)  → add+divide: +2 steps, carry=1
i=2: bit '0' + carry 1 = 1 (odd)  → add+divide: +2 steps, carry=1
i=1: bit '1' + carry 1 = 2 (even) → divide:      +1 step,  carry=1
Final carry at pos 0 → +1 step

Total = 2+2+1+1 = 6 ✅
```

## Problem Description

Given binary string `s` (no leading zeros), repeatedly apply: if number is **even** → divide by 2; if **odd** → add 1. Return the number of steps to reach `1`.

Examples: `"1101"` → 6 | `"10"` → 1 | `"1"` → 0 | `"1111"` → 5.

## 📝 Interview Tips

1. **Clarify**: Chuỗi đầu vào có leading zeros không? / Always valid binary, no leading zeros
2. **Approach**: Xử lý từ phải sang trái với carry / Right-to-left with carry avoids string mutation
3. **Edge cases**: `"1"` returns 0 immediately; single char / Check length = 1 first
4. **Optimize**: Carry track thay vì BigInt / Avoid BigInt if possible, track carry only
5. **Follow-up**: Nếu số rất lớn? BigInt simulation vẫn chạy được / BigInt handles huge numbers
6. **Complexity**: O(n) time, O(1) space for carry approach / Optimal solution

## Solutions

```typescript
/** Solution 1: Right-to-Left with Carry (Optimal)
 * Time: O(n) | Space: O(1)
 */
function numSteps(s: string): number {
  let steps = 0;
  let carry = 0;
  for (let i = s.length - 1; i > 0; i--) {
    const bit = parseInt(s[i]) + carry;
    if (bit % 2 === 1) {
      // Odd after carry: need add (produce carry) + divide = 2 steps
      steps += 2;
      carry = 1;
    } else {
      // Even after carry: just divide = 1 step
      steps += 1;
    }
  }
  // If leading '1' plus carry overflows, one more step
  return steps + carry;
}

/** Solution 2: BigInt Simulation (Brute Force, clear intent)
 * Time: O(n^2) worst case | Space: O(n)
 */
function numStepsBigInt(s: string): number {
  let num = BigInt("0b" + s);
  let steps = 0;
  while (num !== 1n) {
    if (num % 2n === 0n) num /= 2n;
    else num += 1n;
    steps++;
  }
  return steps;
}

/** Solution 3: Count Pattern (Observation-based)
 * Time: O(n) | Space: O(1)
 * Count zeros = 1 step each; ones (except leading) = 2 steps each + carry handling
 */
function numStepsCount(s: string): number {
  let steps = 0;
  let carry = 0;
  for (let i = s.length - 1; i > 0; i--) {
    const cur = parseInt(s[i]) + carry;
    carry = cur >= 2 ? 1 : cur >= 1 ? 1 : 0;
    steps += cur >= 1 ? 2 : 1;
  }
  return steps + carry;
}

// Tests
console.log(numSteps("1101")); // 6
console.log(numSteps("10")); // 1
console.log(numSteps("1")); // 0
console.log(numSteps("1111")); // 5
console.log(numStepsBigInt("1101")); // 6
console.log(numStepsCount("1111")); // 5
```

## 🔗 Related Problems

| Problem                                                            | Relationship                                  |
| ------------------------------------------------------------------ | --------------------------------------------- |
| [Add Binary](https://leetcode.com/problems/add-binary)             | Binary string addition with carry propagation |
| [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits) | Counting bits, Hamming weight                 |
| [Counting Bits](https://leetcode.com/problems/counting-bits)       | DP on binary representation                   |
