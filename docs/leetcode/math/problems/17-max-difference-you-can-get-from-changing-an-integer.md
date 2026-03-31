---
layout: page
title: "Max Difference You Can Get From Changing an Integer"
difficulty: Medium
category: Math
tags: [Math, Greedy]
leetcode_url: "https://leetcode.com/problems/max-difference-you-can-get-from-changing-an-integer"
---

# Max Difference You Can Get From Changing an Integer / Hiệu Lớn Nhất Khi Thay Một Chữ Số

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy (Digit Replacement)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Remove Colored Pieces if Both Neighbors are the Same Color](https://leetcode.com/problems/remove-colored-pieces-if-both-neighbors-are-the-same-color) | [Largest Number](https://leetcode.com/problems/largest-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như chỉnh âm lượng — để max thì vặn hết cỡ (thay tất cả một chữ số thành 9), để min thì vặn nhỏ nhất (thay thành 1 hoặc 0, nhưng không được leading zero).

**Pattern Recognition:**

- Signal: "maximize one version, minimize another" → **Greedy digit replacement**
- Maximize `a`: tìm chữ số đầu tiên ≠ 9, thay tất cả occurrences thành 9
- Minimize `b`: nếu chữ số đầu ≠ 1 → thay thành 1; nếu = 1 → tìm digit đầu tiên (≠ pos 0) không là 0 hoặc 1 → thay thành 0

**Visual — num = 123456:**

```
Maximize: first non-9 is '1' → replace all '1' with '9': 923456
Minimize: first digit '1' is already 1 →
          find first digit (pos>0) not '0'/'1': pos=1 has '2'
          replace all '2' with '0': 103456
Answer: 923456 - 103456 = 820000 ✅
```

---

## Problem Description

Given `num`, choose digit `d` and replacement `e`, replace all `d` with `e` to get `a`. Do the same independently to get `b`. Return max `a − b`. ([LeetCode #1432](https://leetcode.com/problems/max-difference-you-can-get-from-changing-an-integer))

Difficulty: Medium | Acceptance: 49.0%

- **Example 1**: `num = 555` → `a = 999`, `b = 111` → `888`
- **Example 2**: `num = 9` → `a = 9`, `b = 1` → `8`
- **Example 3**: `num = 123456` → `a = 923456`, `b = 103456` → `820000`

Constraints:

- `1 ≤ num ≤ 10⁸`

---

## 📝 Interview Tips

1. **Clarify**: "Sau khi thay, số có được bắt đầu bằng 0 không?" / Leading zeros are forbidden in the result
2. **Maximize**: "Tìm chữ số đầu tiên không phải 9, thay tất cả thành 9 — không lo leading zero vì 9 > 0" / First non-9 → replace with 9 globally
3. **Minimize case 1**: "Chữ số đầu ≠ 1 → thay nó thành 1 (tất cả occurrences)" / If first digit != 1, replace first digit globally with 1
4. **Minimize case 2**: "Chữ số đầu = 1 → tìm digit đầu tiên (từ pos 1) không phải 0 hay 1 → thay thành 0" / First digit = 1: find inner non-0/1 digit and replace with 0
5. **Edge case**: "num = 10: max=90 (1→9), min=10 (first digit=1, no inner non-0/1) → 80" / When first digit is 1 and no replaceable inner digit

---

## Solutions

```typescript
/**
 * Solution: Greedy Digit String Replacement
 * Time: O(d) — d = number of digits ≤ 9 for num ≤ 10^8
 * Space: O(d) — string representation of num
 */
function maxDiff(num: number): number {
  const s = num.toString();

  // --- Maximize: replace first non-9 digit globally with '9' ---
  let maxStr = s;
  for (const ch of s) {
    if (ch !== "9") {
      maxStr = s.split(ch).join("9");
      break;
    }
  }

  // --- Minimize: avoid leading zero ---
  let minStr = s;
  if (s[0] !== "1") {
    // Replace all occurrences of first digit with '1'
    minStr = s.split(s[0]).join("1");
  } else {
    // First digit is '1'; find first inner digit that's not '0' or '1'
    for (let i = 1; i < s.length; i++) {
      if (s[i] !== "0" && s[i] !== "1") {
        minStr = s.split(s[i]).join("0");
        break;
      }
    }
  }

  return parseInt(maxStr) - parseInt(minStr);
}

// === Test Cases ===
console.log(maxDiff(555)); // 888   (999 - 111)
console.log(maxDiff(9)); // 8     (9 - 1)
console.log(maxDiff(123456)); // 820000 (923456 - 103456)
console.log(maxDiff(10)); // 80    (90 - 10)
console.log(maxDiff(1)); // 8     (9 - 1)
console.log(maxDiff(99)); // 0     (already all 9s for max, 11 for min → 99 - 11 = 88)
```

---

## 🔗 Related Problems

- [Largest Number](https://leetcode.com/problems/largest-number) — greedy digit ordering
- [Remove Colored Pieces if Both Neighbors are the Same Color](https://leetcode.com/problems/remove-colored-pieces-if-both-neighbors-are-the-same-color) — greedy counting
- [Maximum Swap](https://leetcode.com/problems/maximum-swap) — maximize number by swapping one pair of digits
- [Next Greater Element III](https://leetcode.com/problems/next-greater-element-iii) — digit manipulation to get next permutation
- [Smallest String With A Given Numeric Value](https://leetcode.com/problems/smallest-string-with-a-given-numeric-value) — greedy digit assignment
