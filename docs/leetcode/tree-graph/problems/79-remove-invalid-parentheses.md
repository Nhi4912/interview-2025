---
layout: page
title: "Remove Invalid Parentheses"
difficulty: Hard
category: Tree-Graph
tags: [String, Backtracking, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/remove-invalid-parentheses"
---

# Remove Invalid Parentheses / Xóa Ngoặc Không Hợp Lệ

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: BFS / Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Word Ladder II](https://leetcode.com/problems/word-ladder-ii) | [Brace Expansion](https://leetcode.com/problems/brace-expansion)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như chỉnh sửa bản thảo — bạn xóa ít ký tự nhất có thể để câu đúng ngữ pháp. BFS đảm bảo bạn luôn tìm được giải pháp ở "độ sâu" nhỏ nhất (xóa ít nhất).

**Pattern Recognition:**

- Signal: "remove minimum" + "all valid results" → **BFS tầng-by-tầng** (tìm min removals trước)
- Tầng BFS = số ký tự bị xóa; dừng lại khi tìm được kết quả hợp lệ ở tầng hiện tại
- Key insight: đếm số `(` thừa và `)` thừa trước để bound số lần xóa

**Visual — BFS by removal count:**

```
Input: "()())()"
Level 0 (remove 0):  "()())()"  → invalid
Level 1 (remove 1):  "()()()", "(())()", "()()()"  → check each
                       ✅ valid  ✅ valid   (duplicate filtered)
Stop at level 1 → answer found
```

---

## Problem Description

Given a string `s` containing parentheses and letters, remove the minimum number of invalid parentheses to make the string valid. ([LeetCode #301](https://leetcode.com/problems/remove-invalid-parentheses))

Return all unique results. The order of results does not matter. A valid string has balanced parentheses.

**Example 1:** `s = "()())()"` → `["()()()", "(())()"]`
**Example 2:** `s = "(a)())()"` → `["(a)()()", "(a())()"]`
**Example 3:** `s = ")("` → `[""]`

---

## 📝 Interview Tips

1. **Clarify**: "Có ký tự chữ cái không? Có thể xóa chúng không?" / Are there letters? Can we remove letters or only parens?
2. **BFS approach**: "BFS đảm bảo minimum removals — dừng khi tìm thấy valid ở level hiện tại" / BFS guarantees minimum by stopping at first valid level
3. **Visited set**: "Dùng Set để tránh xử lý string trùng lặp" / Use Set to deduplicate intermediate strings
4. **Backtracking**: "Đếm leftExtra và rightExtra trước, rồi DFS chỉ xóa đúng số đó" / Count mismatches first, DFS remove exactly that many
5. **Edge cases**: "String rỗng → `[""]`; string toàn chữ → `[s]`" / Empty string, all letters
6. **Pruning**: "Nếu `)` thừa xuất hiện → cắt sớm nhánh đó trong DFS" / Prune when running open count goes negative

---

## Solutions

```typescript
/**
 * Solution 1: BFS — guarantees minimum removals
 * Time: O(N * 2^N) — worst case generate all subsets
 * Space: O(2^N) — visited set
 */
function removeInvalidParenthesesBFS(s: string): string[] {
  const isValid = (str: string): boolean => {
    let count = 0;
    for (const c of str) {
      if (c === "(") count++;
      else if (c === ")") {
        if (--count < 0) return false;
      }
    }
    return count === 0;
  };

  const result: string[] = [];
  const visited = new Set<string>([s]);
  let queue: string[] = [s];
  let found = false;

  while (queue.length > 0 && !found) {
    const next: string[] = [];
    for (const curr of queue) {
      if (isValid(curr)) {
        result.push(curr);
        found = true;
        continue;
      }
      if (found) continue;
      for (let i = 0; i < curr.length; i++) {
        if (curr[i] !== "(" && curr[i] !== ")") continue;
        const candidate = curr.slice(0, i) + curr.slice(i + 1);
        if (!visited.has(candidate)) {
          visited.add(candidate);
          next.push(candidate);
        }
      }
    }
    queue = next;
  }

  return result.length ? result : [""];
}

/**
 * Solution 2: Backtracking with mismatch counting (faster in practice)
 * Time: O(2^N) — prune aggressively
 * Space: O(N) — recursion stack
 */
function removeInvalidParentheses(s: string): string[] {
  // Count excess left and right parens to remove
  let leftRemove = 0,
    rightRemove = 0;
  for (const c of s) {
    if (c === "(") leftRemove++;
    else if (c === ")") {
      if (leftRemove > 0) leftRemove--;
      else rightRemove++;
    }
  }

  const result = new Set<string>();

  function dfs(idx: number, open: number, lRem: number, rRem: number, path: string): void {
    if (idx === s.length) {
      if (lRem === 0 && rRem === 0 && open === 0) result.add(path);
      return;
    }
    const c = s[idx];
    // Option 1: skip (remove) current char if it's a paren and we have budget
    if (c === "(" && lRem > 0) dfs(idx + 1, open, lRem - 1, rRem, path);
    if (c === ")" && rRem > 0) dfs(idx + 1, open, lRem, rRem - 1, path);
    // Option 2: keep current char
    if (c !== "(" && c !== ")") {
      dfs(idx + 1, open, lRem, rRem, path + c);
    } else if (c === "(") {
      dfs(idx + 1, open + 1, lRem, rRem, path + c);
    } else if (open > 0) {
      // c === ')' and open > 0
      dfs(idx + 1, open - 1, lRem, rRem, path + c);
    }
  }

  dfs(0, 0, leftRemove, rightRemove, "");
  return [...result];
}

// === Test Cases ===
console.log(removeInvalidParentheses("()())()")); // ["()()()", "(())()"]
console.log(removeInvalidParentheses("(a)())()")); // ["(a)()()", "(a())()"]
console.log(removeInvalidParentheses(")(")); // [""]
console.log(removeInvalidParenthesesBFS("()())()")); // ["()()()", "(())()"]
```

---

## 🔗 Related Problems

| Problem                                                                                                            | Difficulty | Pattern         |
| ------------------------------------------------------------------------------------------------------------------ | ---------- | --------------- |
| [Valid Parentheses](https://leetcode.com/problems/valid-parentheses)                                               | 🟢 Easy    | Stack           |
| [Generate Parentheses](https://leetcode.com/problems/generate-parentheses)                                         | 🟡 Medium  | Backtracking    |
| [Minimum Remove to Make Valid Parentheses](https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses) | 🟡 Medium  | Stack + greedy  |
| [Word Ladder II](https://leetcode.com/problems/word-ladder-ii)                                                     | 🔴 Hard    | BFS + backtrack |
