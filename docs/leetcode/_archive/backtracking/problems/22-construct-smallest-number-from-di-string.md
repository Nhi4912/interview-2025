---
layout: page
title: "Construct Smallest Number From DI String"
difficulty: Medium
category: Backtracking
tags: [String, Backtracking, Stack, Greedy]
leetcode_url: "https://leetcode.com/problems/construct-smallest-number-from-di-string"
---

# Construct Smallest Number From DI String / Xây Dựng Số Nhỏ Nhất Từ Chuỗi DI

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack / Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Remove K Digits](https://leetcode.com/problems/remove-k-digits) | [Next Permutation](https://leetcode.com/problems/next-permutation)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống xếp hàng — khi gặp 'D' (decrease) bạn biết phải "hoãn" việc đặt số lại. Dùng stack để tích lũy rồi xả ra theo thứ tự ngược khi gặp 'I' hoặc kết thúc.

**Pattern Recognition:**

- Signal: "smallest permutation matching pattern" → **Monotonic Stack / Greedy**
- Mỗi 'D' liên tiếp tạo thành một "run" cần reverse
- Key insight: push 1..n vào stack, khi gặp 'I' (hoặc cuối) thì pop hết vào result

**Visual — Stack simulation for "IDID":**

```
Pattern: I D I D
Digits:  1 2 3 4 5

Step 0: push 1
  'I': pop → result = [1]
Step 1: push 2
  'D': keep
Step 2: push 3
  'I': pop all → result = [1, 3, 2]
Step 3: push 4
  'D': keep
End:    push 5, pop all → result = [1, 3, 2, 5, 4]
Output: "13254"
```

---

## Problem Description

Given a string `pattern` of 'I' (increasing) and 'D' (decreasing) of length `n`, return the lexicographically smallest string of digits `1` to `n+1` (each used exactly once) such that consecutive pairs follow the pattern. ([LeetCode 2375](https://leetcode.com/problems/construct-smallest-number-from-di-string))

**Example 1:** `pattern = "IIIDIDDD"` → `"123549876"`
**Example 2:** `pattern = "DDD"` → `"4321"`

Constraints: `1 <= pattern.length <= 8`, pattern contains only 'I' and 'D'

---

## 📝 Interview Tips

1. **Clarify**: "Digit 1-9 hay 1-(n+1)? Có dùng số lặp không?" / Digits 1 to n+1, each used exactly once
2. **Stack key**: "'D' liên tiếp → số cần giảm dần → reverse → dùng stack" / Consecutive 'D's require reversing a segment
3. **Greedy**: "Luôn push số nhỏ nhất có thể, defer quyết định khi gặp 'D'" / Defer placement during 'D' runs
4. **Backtracking alt**: "Có thể dùng backtracking nhưng stack là O(n)" / Stack approach is optimal O(n)
5. **Edge cases**: "All 'I' → "123...n+1", all 'D' → "n+1...21"" / All increasing or decreasing

---

## Solutions

```typescript
/**
 * Solution 1: Stack-based greedy (optimal)
 * Time: O(n) — single pass
 * Space: O(n) — stack storage
 */
function smallestNumber(pattern: string): string {
  const n = pattern.length;
  const stack: number[] = [];
  const result: number[] = [];

  for (let i = 0; i <= n; i++) {
    stack.push(i + 1); // push next digit (1-indexed)
    // Pop stack whenever we hit 'I' or end of pattern
    if (i === n || pattern[i] === "I") {
      while (stack.length > 0) {
        result.push(stack.pop()!);
      }
    }
  }

  return result.join("");
}

/**
 * Solution 2: Backtracking (explicit, for interview explanation)
 * Time: O(n!) — worst case, but pruned heavily
 * Space: O(n) — recursion + path
 */
function smallestNumberBacktrack(pattern: string): string {
  const n = pattern.length;
  const used = new Array(n + 2).fill(false);
  let result = "";

  function backtrack(pos: number, path: number[]): boolean {
    if (pos === n + 1) {
      result = path.join("");
      return true;
    }
    for (let digit = 1; digit <= n + 1; digit++) {
      if (used[digit]) continue;
      if (path.length > 0) {
        const prev = path[path.length - 1];
        if (pattern[pos - 1] === "I" && digit <= prev) continue;
        if (pattern[pos - 1] === "D" && digit >= prev) continue;
      }
      used[digit] = true;
      path.push(digit);
      if (backtrack(pos + 1, path)) return true; // take first valid (smallest)
      path.pop();
      used[digit] = false;
    }
    return false;
  }

  backtrack(0, []);
  return result;
}

// === Test Cases ===
console.log(smallestNumber("IIIDIDDD")); // "123549876"
console.log(smallestNumber("DDD")); // "4321"
console.log(smallestNumber("I")); // "12"
console.log(smallestNumber("D")); // "21"
console.log(smallestNumberBacktrack("IIIDIDDD")); // "123549876"
```

---

## 🔗 Related Problems

- [Remove K Digits](https://leetcode.com/problems/remove-k-digits) — monotonic stack for smallest number
- [Next Permutation](https://leetcode.com/problems/next-permutation) — manipulating digit order
- [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters) — stack-based lexicographic greedy
- [Find the Most Competitive Subsequence](https://leetcode.com/problems/find-the-most-competitive-subsequence) — monotonic stack
- [Construct Smallest Number From DI String — LeetCode](https://leetcode.com/problems/construct-smallest-number-from-di-string) — problem page
