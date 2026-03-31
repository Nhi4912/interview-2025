---
layout: page
title: "Lexicographically Smallest String After Applying Operations"
difficulty: Medium
category: Tree-Graph
tags: [String, Depth-First Search, Breadth-First Search, Enumeration]
leetcode_url: "https://leetcode.com/problems/lexicographically-smallest-string-after-applying-operations"
---

# Lexicographically Smallest String After Applying Operations / Chuỗi Nhỏ Nhất Từ Điển

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS over state space
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Evaluate Division](https://leetcode.com/problems/evaluate-division) | [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như mặt đồng hồ quay tay — xoay kim và bấm nút cộng, chỉ có hữu hạn trạng thái có thể xuất hiện. BFS liệt kê tất cả chuỗi reachable và chọn nhỏ nhất theo từ điển.

**Visual — BFS enumerates all reachable strings:**

```
s="5525", a=9, b=2
Op1 (add a=9 to odd indices): "5525"→ odd idx 1,3: '5'+9=14%10=4, '5'+9=4 → "5424"
Op2 (right rotate by b=2): "5525" → last 2 chars move to front → "25" + "55" = "2555"

BFS explores all combinations:
"5525" → add → "5424" → add → "5323" → ...
      → rotate → "2555" → add → "2454" → ...
State space is finite (bounded by rotation period × add period)
Pick lexicographic minimum across all visited strings.
```

---

## Problem Description

Given a string `s` of even length consisting of digits `'0'–'9'`, and integers `a`, `b`. You can apply two operations any number of times in any order: (1) Add `a` to **all odd-indexed** characters mod 10. (2) **Right rotate** string by `b` positions. Return the lexicographically smallest string reachable. ([LeetCode 1625](https://leetcode.com/problems/lexicographically-smallest-string-after-applying-operations))

**Example 1:** s="5525", a=9, b=2 → **"2050"**
**Example 2:** s="74", a=5, b=1 → **"24"**
**Example 3:** s="0011", a=4, b=2 → **"0011"**

**Constraints:** 2 ≤ s.length ≤ 100 (even), 1 ≤ a ≤ 9, 1 ≤ b ≤ s.length.

---

## 📝 Interview Tips

1. **State space finite**: Rotate có len/gcd(len,b) trạng thái; add có 10/gcd(10,a) giá trị / Bounded by LCM.
2. **BFS vs DFS**: BFS tự nhiên hơn vì không cần backtrack; visited set ngăn lặp vô hạn / DFS with memo also works.
3. **Rotate formula**: Right rotate b positions = last b chars move to front / `s.slice(-b) + s.slice(0,-b)`.
4. **Add formula**: Chỉ index lẻ (0-indexed) thay đổi; `(digit + a) % 10` / Even indices unchanged.
5. **Edge case**: b = s.length → rotate = identity; a = 10 → impossible per constraints.
6. **Follow-up**: "Nếu s.length lớn hơn?" / For large s, state space can be huge; need smarter approach.

---

## Solutions

```typescript
/**
 * Solution 1: DFS with memoization (explore all reachable states)
 * Time: O(S · n) where S = #reachable strings, n = string length
 * Space: O(S · n) for visited set
 */
function findLexSmallestStringDFS(s: string, a: number, b: number): string {
  const visited = new Set<string>();
  let result = s;

  const dfs = (curr: string): void => {
    if (visited.has(curr)) return;
    visited.add(curr);
    if (curr < result) result = curr;

    // Op1: add a to odd-indexed digits
    const added = curr
      .split("")
      .map((c, i) =>
        i % 2 === 1 ? String.fromCharCode(((c.charCodeAt(0) - 48 + a) % 10) + 48) : c,
      )
      .join("");
    dfs(added);

    // Op2: right rotate by b
    const rotated = curr.slice(-b) + curr.slice(0, curr.length - b);
    dfs(rotated);
  };

  dfs(s);
  return result;
}

/**
 * Solution 2: BFS over string states (breadth-first = natural for "find minimum")
 * Time: O(S · n) — each unique string processed once; S bounded by rotation × add periods
 * Space: O(S · n)
 */
function findLexSmallestString(s: string, a: number, b: number): string {
  const visited = new Set<string>([s]);
  const queue: string[] = [s];
  let result = s;
  let head = 0;

  while (head < queue.length) {
    const curr = queue[head++];
    if (curr < result) result = curr;

    // Operation 1: add `a` to all odd-indexed characters (mod 10)
    const addOp = curr
      .split("")
      .map((c, i) => {
        if (i % 2 === 0) return c;
        return String.fromCharCode(((c.charCodeAt(0) - 48 + a) % 10) + 48);
      })
      .join("");

    // Operation 2: right rotate by b positions
    const rotateOp = curr.slice(-b) + curr.slice(0, curr.length - b);

    for (const next of [addOp, rotateOp]) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }

  return result;
}

// === Test Cases ===
console.log(findLexSmallestString("5525", 9, 2)); // "2050"
console.log(findLexSmallestString("74", 5, 1)); // "24"
console.log(findLexSmallestString("0011", 4, 2)); // "0011"
console.log(findLexSmallestString("43987654", 7, 3)); // explore...
```

---

## 🔗 Related Problems

| Problem                                                                                                                                   | Pattern              | Difficulty |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ---------- |
| [Open the Lock](https://leetcode.com/problems/open-the-lock)                                                                              | BFS on string states | Medium     |
| [Word Ladder](https://leetcode.com/problems/word-ladder)                                                                                  | BFS on states        | Hard       |
| [Minimum Number of Operations to Make String Sorted](https://leetcode.com/problems/minimum-number-of-operations-to-make-string-sorted)    | State enumeration    | Hard       |
| [Web Crawler](https://leetcode.com/problems/web-crawler)                                                                                  | BFS                  | Medium     |
| [Lexicographically Smallest String — LeetCode](https://leetcode.com/problems/lexicographically-smallest-string-after-applying-operations) | —                    | Medium     |
