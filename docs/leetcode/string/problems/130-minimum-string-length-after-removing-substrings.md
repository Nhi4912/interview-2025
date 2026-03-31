---
layout: page
title: "Minimum String Length After Removing Substrings"
difficulty: Easy
category: String
tags: [String, Stack, Simulation]
leetcode_url: "https://leetcode.com/problems/minimum-string-length-after-removing-substrings"
---

# Minimum String Length After Removing Substrings / Độ Dài Chuỗi Tối Thiểu Sau Khi Xóa Substrings

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Stack / Simulation
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Ví dụ thực tế:** Giống như chơi trò xếp hình Tetris — mỗi khi xếp xong một hàng (xuất hiện "AB" hoặc "CD") thì hàng đó biến mất. Stack giúp ta nhìn vào ký tự vừa xếp và ký tự trước đó để phát hiện pair ngay lập tức.

**Pattern Recognition:**

- `"remove adjacent pairs repeatedly"` → Stack: push char, check top pair, pop nếu khớp
- Pairs cần xóa: `"AB"` và `"CD"` → top='A' và cur='B' → pop; top='C' và cur='D' → pop
- Kết quả = độ dài stack sau khi xử lý hết chuỗi

**Visual:**

```
s = "ABFCACDB"

i=0 'A': stack=[A]
i=1 'B': top='A' + cur='B' → match "AB" → pop → stack=[]
i=2 'F': stack=[F]
i=3 'C': stack=[F,C]
i=4 'A': stack=[F,C,A]
i=5 'C': top='A' ≠ pair → stack=[F,C,A,C]
i=6 'D': top='C' + cur='D' → match "CD" → pop → stack=[F,C,A]
i=7 'B': top='A' + cur='B' → match "AB" → pop → stack=[F,C]

Result length = 2 ✅
```

## Problem Description

Given string `s` of only uppercase letters, repeatedly remove occurrences of `"AB"` or `"CD"` (in any order). Return the **minimum possible length** of the resulting string.

Examples: `"ABFCACDB"` → 2 | `"ACBBD"` → 5 (no removable pairs) | `"ABCD"` → 0.

## 📝 Interview Tips

1. **Clarify**: Chỉ xóa "AB" và "CD" hay các cặp khác? / Only "AB" and "CD" exactly
2. **Approach**: Stack: push char; check if stack top + cur = "AB"/"CD" → pop / One pass with stack
3. **Edge cases**: Empty string → 0; no pairs at all → original length / Handle empty input
4. **Optimize**: Stack approach is already O(n) / No further optimization needed
5. **Follow-up**: Nếu có thêm cặp cần xóa? → Thêm vào bộ kiểm tra / Generalize with a Set of pairs
6. **Complexity**: O(n) time, O(n) space for stack / Linear in both

## Solutions

```typescript
/** Solution 1: Stack (Optimal)
 * Time: O(n) | Space: O(n)
 */
function minLength(s: string): number {
  const stack: string[] = [];

  for (const ch of s) {
    const top = stack[stack.length - 1];
    if ((top === "A" && ch === "B") || (top === "C" && ch === "D")) {
      stack.pop();
    } else {
      stack.push(ch);
    }
  }

  return stack.length;
}

/** Solution 2: Repeated String Replace (Brute Force)
 * Time: O(n^2) | Space: O(n)
 */
function minLengthBrute(s: string): number {
  let str = s;
  let prev = "";
  while (str !== prev) {
    prev = str;
    str = str.replace(/AB|CD/g, "");
  }
  return str.length;
}

/** Solution 3: Two-pointer / In-place Stack
 * Time: O(n) | Space: O(n)
 * Write-pointer acts as virtual stack top
 */
function minLengthInPlace(s: string): number {
  const arr = [...s];
  let write = 0;

  for (let read = 0; read < arr.length; read++) {
    arr[write] = arr[read];
    write++;
    if (write >= 2) {
      const pair = arr[write - 2] + arr[write - 1];
      if (pair === "AB" || pair === "CD") write -= 2;
    }
  }

  return write;
}

// Tests
console.log(minLength("ABFCACDB")); // 2
console.log(minLength("ACBBD")); // 5
console.log(minLength("ABCD")); // 0
console.log(minLength("")); // 0
console.log(minLengthBrute("ABFCACDB")); // 2
console.log(minLengthInPlace("ABCD")); // 0
```

## 🔗 Related Problems

| Problem                                                                                                            | Relationship                       |
| ------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| [Backspace String Compare](https://leetcode.com/problems/backspace-string-compare)                                 | Stack-based character removal      |
| [Remove All Adjacent Duplicates in String](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string) | Same stack pop pattern for pairs   |
| [Valid Parentheses](https://leetcode.com/problems/valid-parentheses)                                               | Stack matching open/close brackets |
