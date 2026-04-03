---
layout: page
title: "Adding Two Negabinary Numbers"
difficulty: Medium
category: Array
tags: [Array, Math]
leetcode_url: "https://leetcode.com/problems/adding-two-negabinary-numbers"
---

# Adding Two Negabinary Numbers / Cộng Hai Số Hệ Nhị Phân Âm

> **Difficulty**: 🟡 Medium | **Category**: Array | **Pattern**: Math / Bit Carry Manipulation

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Giống như cộng số nhị phân bình thường nhưng giá trị vị trí xen kẽ âm dương — khi nhớ (carry) âm hoặc dương thì cần điều chỉnh đặc biệt khác với hệ nhị phân thông thường.

**Pattern Recognition:**

- Base -2 carry rule: `carry = -Math.floor(sum / 2)` for non-standard base
- Digit = `((sum % 2) + 2) % 2` to handle negative modulo
- Process from LSB to MSB, strip leading zeros

**Visual:**

```
arr1 = [1,1,1,1,1]  = 1+(-2)+4+(-8)+16 = 11
arr2 = [1,0,1]      = 1+0+4 = 5
Sum  = 16 in base -2

Step  sum  digit  carry
  0:  1+1=2  → 0   carry=-1
  1:  1+0-1=0 → 0  carry=0
  2:  1+1=2  → 0   carry=-1
  3:  1+0-1=0 → 0  carry=0
  4:  1+0=1  → 1   carry=0
Result: [0,0,0,0,1] → [1,0,0,0,0] reversed = 10000
```

## Problem Description

Given two negabinary (base -2) numbers as arrays (MSB first), return their sum as a negabinary array. In base -2, the k-th position has value `(-2)^k`. No leading zeros (except result is `[0]`).

**Example 1:** `arr1=[1,1,1]`, `arr2=[1,0,1]` → `[1,0,0,0,0]`
**Example 2:** `arr1=[0]`, `arr2=[0]` → `[0]`

**Constraints:** `1 ≤ arr1.length, arr2.length ≤ 1000`, values are 0 or 1

## 📝 Interview Tips

1. **Clarify**: Is input MSB or LSB first? (MSB — reverse before processing)
2. **Approach**: Digit-by-digit from LSB; carry = -floor((a+b+carry)/2)
3. **Edge cases**: Carry propagates past both arrays' lengths, result = [0]
4. **Optimize**: Already O(n); trim leading zeros at the end
5. **Follow-up**: What about base -3 or arbitrary negative base?
6. **Complexity**: Time O(max(m,n)), Space O(max(m,n))

## Solutions

```typescript
// Solution 1: Digit-by-digit with carry — Time: O(max(m,n)) | Space: O(max(m,n))
function addNegabinary(arr1: number[], arr2: number[]): number[] {
  let i = arr1.length - 1;
  let j = arr2.length - 1;
  let carry = 0;
  const result: number[] = [];

  while (i >= 0 || j >= 0 || carry !== 0) {
    const a = i >= 0 ? arr1[i--] : 0;
    const b = j >= 0 ? arr2[j--] : 0;
    const sum = a + b + carry;

    // In base -2: digit = sum mod 2 (always 0 or 1)
    // carry for next position: -floor(sum / 2)
    const digit = ((sum % 2) + 2) % 2; // handle negative mod
    carry = -Math.floor(sum / 2);
    result.push(digit);
  }

  // Remove trailing zeros (which are leading zeros in reversed array)
  while (result.length > 1 && result[result.length - 1] === 0) {
    result.pop();
  }

  return result.reverse();
}

// Solution 2: Explicit carry normalization — Time: O(max(m,n)) | Space: O(max(m,n))
function addNegabinary2(arr1: number[], arr2: number[]): number[] {
  const a = [...arr1].reverse();
  const b = [...arr2].reverse();
  const len = Math.max(a.length, b.length) + 2;
  const res: number[] = [];
  let carry = 0;

  for (let k = 0; k < len || carry !== 0; k++) {
    const x = (a[k] ?? 0) + (b[k] ?? 0) + carry;
    res.push(((x % 2) + 2) % 2);
    carry = -(x - res[res.length - 1]) / 2;
  }

  // Trim leading zeros
  while (res.length > 1 && res[res.length - 1] === 0) res.pop();
  return res.reverse();
}

// Tests
console.log(addNegabinary([1, 1, 1, 1, 1], [1, 0, 1])); // [1,0,0,0,0]
console.log(addNegabinary([0], [0])); // [0]
console.log(addNegabinary([0], [1])); // [1]
console.log(addNegabinary2([1, 1, 1], [1, 0, 1])); // [1,0,0,0,0]
console.log(addNegabinary2([1], [1])); // [1,1,0]
```

## 🔗 Related Problems

| Problem                                                                                                       | Relationship                        |
| ------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [Add Binary (LeetCode 67)](https://leetcode.com/problems/add-binary/)                                         | Binary addition, same carry pattern |
| [Add to Array-Form of Integer (LeetCode 989)](https://leetcode.com/problems/add-to-array-form-of-integer/)    | Array-based addition with carry     |
| [Complement of Base 10 Integer (LeetCode 1009)](https://leetcode.com/problems/complement-of-base-10-integer/) | Bit manipulation on numeric bases   |
