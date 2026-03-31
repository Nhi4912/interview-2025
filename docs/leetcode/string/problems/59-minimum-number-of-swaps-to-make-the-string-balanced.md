---
layout: page
title: "Minimum Number of Swaps to Make the String Balanced"
difficulty: Medium
category: String
tags: [Two Pointers, String, Stack, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced"
---

# Minimum Number of Swaps to Make the String Balanced / Số Lần Hoán Đổi Tối Thiểu Để Cân Bằng Chuỗi

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy / Stack Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Valid Parentheses](https://leetcode.com/problems/valid-parentheses) | [Minimum Add to Make Parentheses Valid](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống cân đối dấu ngoặc — mỗi `]` thừa cần một `[` từ phía sau để hoán đổi. Mỗi lần hoán đổi sửa được 2 dấu ngoặc mất cân bằng, nên số lần = `ceil(unmatched / 2)`.

**Pattern Recognition:**

- Signal: "balanced brackets" + "minimum swaps" → **Greedy: count unmatched `]`**
- Dùng stack hoặc counter để đếm `[` thừa; khi gặp `]` mà stack rỗng → unmatched++
- Key insight: `ceil(unmatched_close / 2)` vì mỗi swap sửa một `]` thừa và một `[` thừa đồng thời

**Visual — s="][]":**

```
i=0 ']': stack=[] → unmatched=1
i=1 '[': stack=['[']
i=2 '[': stack=['[','[']
i=3 ']': stack.pop → stack=['[']

unmatched=1 → swaps = ceil(1/2) = 1
Swap s[0] and s[2]: "[[]]" ✅
```

---

## Problem Description

Given string `s` of `[` and `]` only (even length, equal counts of each), return the minimum number of swaps to make `s` balanced. A swap exchanges any two characters.

```
Example 1: s="]["      → 1  (swap → "[]")
Example 2: s="]]][[["  → 2
Example 3: s="[]"      → 0  (already balanced)
```

Constraints: `2 <= s.length <= 10^6`, `s.length` is even, equal `[` and `]` counts.

---

## 📝 Interview Tips

1. **Clarify**: "Input đảm bảo số `[` = số `]`? Độ dài luôn chẵn?" / Equal bracket counts guaranteed, even length?
2. **Brute force**: "Simulate stack, collect unmatched positions, pair them" → O(n) nhưng phức tạp hơn / Stack collect then pair
3. **Greedy insight**: "Đếm `]` thừa (open=0 khi gặp `]`), mỗi swap sửa 2 → ceil(count/2)" / Count-and-halve
4. **Edge cases**: "Chuỗi đã balanced → 0, `][` → 1, `]][[` → 1" / Already balanced, minimal cases
5. **Follow-up**: "Minimum insertions để balanced? → khác bài — thêm ký tự thay vì swap" / Insertions vs swaps
6. **Complexity**: "O(n) time, O(1) space — chỉ cần một biến đếm" / Single counter, no stack needed

---

## Solutions

```typescript
/**
 * Solution 1: Stack simulation
 * Time: O(n) — single pass
 * Space: O(n) — stack
 */
function minSwapsStack(s: string): number {
  const stack: string[] = [];
  let unmatched = 0;

  for (const c of s) {
    if (c === "[") {
      stack.push(c);
    } else {
      if (stack.length > 0) {
        stack.pop(); // matched
      } else {
        unmatched++; // extra ']' with no matching '['
      }
    }
  }

  return Math.ceil(unmatched / 2);
}

/**
 * Solution 2: Greedy counter (O(1) space)
 * Time: O(n) — single pass
 * Space: O(1) — just two integers
 */
function minSwaps(s: string): number {
  let open = 0; // count of unmatched '['
  let unmatched = 0; // count of unmatched ']'

  for (const c of s) {
    if (c === "[") {
      open++;
    } else {
      if (open > 0) {
        open--; // consume a '['
      } else {
        unmatched++; // extra ']'
      }
    }
  }

  // Each swap fixes one unmatched ']' and one unmatched '['
  return Math.ceil(unmatched / 2);
}

// === Test Cases ===
console.log(minSwaps("][")); // 1
console.log(minSwaps("]]][[[")); // 2
console.log(minSwaps("[]")); // 0
console.log(minSwaps("]][[")); // 1
```

---

## 🔗 Related Problems

- [Valid Parentheses](https://leetcode.com/problems/valid-parentheses) — stack-based bracket matching foundation
- [Minimum Add to Make Parentheses Valid](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid) — insertions instead of swaps
- [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters) — greedy with stack
- [Score of Parentheses](https://leetcode.com/problems/score-of-parentheses) — bracket value computation with stack
