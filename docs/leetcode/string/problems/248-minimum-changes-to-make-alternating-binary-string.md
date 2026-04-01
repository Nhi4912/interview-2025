---
layout: page
title: "Minimum Changes To Make Alternating Binary String"
difficulty: Easy
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/minimum-changes-to-make-alternating-binary-string"
---

# Minimum Changes To Make Alternating Binary String / Số Thay Đổi Tối Thiểu Để Chuỗi Nhị Phân Xen Kẽ

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: String Processing
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Text Justification](https://leetcode.com/problems/text-justification) | [Decode String](https://leetcode.com/problems/decode-string)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Hãy nghĩ đến bàn cờ vua — ô trắng và ô đen xen kẽ nhau theo quy luật hoàn hảo. Một chuỗi nhị phân xen kẽ giống như hàng ô cờ: vị trí chẵn là một màu, vị trí lẻ là màu kia. Chỉ có hai mẫu hợp lệ: "010101..." và "101010...". Đếm số ô cần đổi màu cho mỗi mẫu rồi lấy cái nhỏ hơn.

**Pattern Recognition:**

- Signal: "alternating pattern" + "minimum changes" → **String Processing / Counting**
- Key insight: Chỉ có hai mẫu target. Đếm mismatches với "010101...". Mismatches với mẫu kia = n - count (vì mọi vị trí phải là một trong hai).

**Visual — s="0100":**

```
Pattern A: "0101"   Pattern B: "1010"
s =        "0100"   s =        "0100"

Compare:
  pos 0: s[0]='0' vs A[0]='0' ✓  vs B[0]='1' ✗
  pos 1: s[1]='1' vs A[1]='1' ✓  vs B[1]='0' ✗
  pos 2: s[2]='0' vs A[2]='0' ✓  vs B[2]='1' ✗
  pos 3: s[3]='0' vs A[3]='1' ✗  vs B[3]='0' ✓

mismatches_A = 1,  mismatches_B = 3
answer = min(1, 3) = 1
```

---

## 📝 Problem Description

Given binary string `s`, return the minimum number of character changes to make it alternating (no two adjacent characters are equal: "0101..." or "1010...").

- **Example 1:** s="0100" → `1` (change index 3 from '0' to '1': "0101")
- **Example 2:** s="10" → `0` (already alternating)

Constraints: `1 ≤ n ≤ 10^4`, string contains only '0' and '1'.

---

## 🎯 Interview Tips

1. **Only two targets** / Chỉ hai mẫu đích: "010101..." and "101010..." — no need to try others.
2. **Complement property** / Tính chất bổ sung: mismatches_B = n - mismatches_A, so only count one.
3. **Even index rule** / Quy tắc chỉ số chẵn: In pattern A, even positions = '0', odd = '1'. Check s[i] vs (i%2===0 ? '0' : '1').
4. **No sorting needed** / Không cần sắp xếp: Single O(n) pass is optimal.
5. **Edge: length 1** / Trường hợp dài 1: Always 0 changes (single char is trivially alternating).
6. **Return type** / Kiểu trả về: Integer count, not the resulting string.

---

## 💡 Solutions

### Approach 1: Count Both Patterns

/\*_ @complexity Time: O(n) | Space: O(1) _/

```typescript
function minOperationsBrute(s: string): number {
  let mismatchA = 0; // mismatches with "010101..."
  for (let i = 0; i < s.length; i++) {
    const expected = i % 2 === 0 ? "0" : "1";
    if (s[i] !== expected) mismatchA++;
  }
  const mismatchB = s.length - mismatchA; // mismatches with "101010..."
  return Math.min(mismatchA, mismatchB);
}
```

### Approach 2: Single Pass — Complement Trick (Optimal)

/\*_ @complexity Time: O(n) | Space: O(1) _/

```typescript
function minOperations(s: string): number {
  // Count how many positions don't match pattern "010101..."
  // Positions matching "101010..." = n - count (perfect complement)
  let countA = 0;
  for (let i = 0; i < s.length; i++) {
    // Pattern A: even index → '0', odd index → '1'
    if (Number(s[i]) !== i % 2) countA++;
  }
  // Return whichever pattern requires fewer changes
  return Math.min(countA, s.length - countA);
}
```

---

## 🧪 Test Cases

```typescript
console.log(minOperations("0100")); // → 1
console.log(minOperations("10")); // → 0
console.log(minOperations("1111")); // → 2
console.log(minOperations("0101")); // → 0
console.log(minOperations("1")); // → 0
```

---

## 🔗 Related Problems

| Problem                                                                                                                            | Difficulty | Pattern |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------- |
| [Minimum Swaps to Make Strings Equal](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-binary-string-alternating) | Medium     | String  |
| [Flip String to Monotone Increasing](https://leetcode.com/problems/flip-string-to-monotone-increasing)                             | Medium     | DP      |
| [Decode String](https://leetcode.com/problems/decode-string)                                                                       | Medium     | Stack   |
| [Check if Two String Arrays are Equivalent](https://leetcode.com/problems/check-if-two-string-arrays-are-equivalent)               | Easy       | String  |
