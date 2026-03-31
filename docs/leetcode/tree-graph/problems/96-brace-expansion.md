---
layout: page
title: "Brace Expansion"
difficulty: Medium
category: Tree-Graph
tags: [String, Backtracking, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/brace-expansion"
---

# Brace Expansion / Mở Rộng Dấu Ngoặc

> **Difficulty**: 🟡 Medium | **Category**: Tree-Graph | **Pattern**: Backtracking / BFS Enumeration

## 🧠 Intuition / Tư Duy

**Như chọn trang phục mỗi ngày** — bạn có thể mặc {áo đỏ, áo xanh} với {quần đen, quần trắng}, tổng có 2×2=4 bộ. Mỗi dấu `{a,b,c}` là một lựa chọn tại một vị trí, kết hợp tất cả các vị trí theo thứ tự lexicographic.

**Pattern Recognition:**

- `{options}` tại mỗi vị trí → lựa chọn → backtracking/BFS
- Kết hợp từng vị trí theo thứ tự → Cartesian product
- Kết quả cần sort lexicographically → sort options trước khi backtrack

**Visual:**

```
s = "{a,b}c{d,e}f"
Parse groups: [{a,b}, [c], {d,e}, [f]]
Backtrack:
  pick 'a' → pick 'c' → pick 'd' → pick 'f' → "acdf"
  pick 'a' → pick 'c' → pick 'e' → pick 'f' → "acef"
  pick 'b' → pick 'c' → pick 'd' → pick 'f' → "bcdf"
  pick 'b' → pick 'c' → pick 'e' → pick 'f' → "bcef"
```

## Problem Description

Given a string `s` representing an expression, expand it to return all words the expression can represent in lexicographical order. A single letter means only that letter; `{a,b,c}` means one of `a`, `b`, `c`.

**Example 1:** `"{a,b}c{d,e}f"` → `["acdf","acef","bcdf","bcef"]`
**Example 2:** `"{{a,z},a{b,c},{ac,z}}"` → not this form; input is simpler

**Constraints:** 1 ≤ s.length ≤ 50, lowercase letters only, groups separated by commas

## 📝 Interview Tips

1. **Clarify**: Is the expression always well-formed? Yes. Can groups be nested? No, only one level deep.
2. **Approach**: Parse string into groups (each group is a sorted set of chars or single char). Then backtrack to enumerate all combinations.
3. **Edge cases**: Single letter outside braces (group of 1). Empty string inside braces (problem guarantees valid input).
4. **Optimize**: BFS with queue of partial strings works too. Backtracking with char array is most efficient.
5. **Follow-up**: What if groups can be nested (full brace expansion)? Need recursive parser.
6. **Complexity**: O(∏|group_i| · n) for generation, O(n·log(n)) for sorting where n = # of results.

## Solutions

```typescript
// Solution 1: Backtracking
// Time: O(∏|groups| * n) | Space: O(n * ∏|groups|)
function expand(s: string): string[] {
  // Parse into groups
  const groups: string[][] = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === "{") {
      const j = s.indexOf("}", i);
      const options = s
        .slice(i + 1, j)
        .split(",")
        .sort();
      groups.push(options);
      i = j + 1;
    } else {
      groups.push([s[i]]);
      i++;
    }
  }

  const result: string[] = [];

  function backtrack(idx: number, current: string): void {
    if (idx === groups.length) {
      result.push(current);
      return;
    }
    for (const ch of groups[idx]) {
      backtrack(idx + 1, current + ch);
    }
  }

  backtrack(0, "");
  return result; // Already lexicographic because groups are sorted
}

// Solution 2: BFS level by level
// Time: O(∏|groups| * n) | Space: O(∏|groups| * n)
function expand2(s: string): string[] {
  // Parse groups
  const groups: string[][] = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === "{") {
      const j = s.indexOf("}", i);
      groups.push(
        s
          .slice(i + 1, j)
          .split(",")
          .sort(),
      );
      i = j + 1;
    } else {
      groups.push([s[i]]);
      i++;
    }
  }

  let queue: string[] = [""];
  for (const group of groups) {
    const next: string[] = [];
    for (const prefix of queue) {
      for (const ch of group) {
        next.push(prefix + ch);
      }
    }
    queue = next;
  }

  return queue.sort();
}

// Solution 3: Iterative with reduce
// Time: O(∏|groups| * n) | Space: O(∏|groups| * n)
function expand3(s: string): string[] {
  const groups: string[][] = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === "{") {
      const end = s.indexOf("}", i);
      groups.push(
        s
          .slice(i + 1, end)
          .split(",")
          .sort(),
      );
      i = end + 1;
    } else {
      groups.push([s[i]]);
      i++;
    }
  }

  return groups
    .reduce<string[]>((acc, group) => acc.flatMap((prefix) => group.map((ch) => prefix + ch)), [""])
    .sort();
}

// Tests
console.log(expand("{a,b}c{d,e}f")); // ["acdf","acef","bcdf","bcef"]
console.log(expand("{a,b,c}")); // ["a","b","c"]
console.log(expand2("a{b,c}")); // ["ab","ac"]
console.log(expand3("{a,b}{c,d}{e,f}")); // ["ace","acf","ade","adf","bce","bcf","bde","bdf"]
console.log(expand("abc")); // ["abc"]
```

## 🔗 Related Problems

| Problem                                                                                                       | Relationship                         |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) | Same Cartesian product pattern       |
| [Permutations](https://leetcode.com/problems/permutations/)                                                   | Backtracking enumeration             |
| [Generate Parentheses](https://leetcode.com/problems/generate-parentheses/)                                   | String backtracking with constraints |
