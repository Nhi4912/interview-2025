---
layout: page
title: "Maximum Nesting Depth of the Parentheses"
difficulty: Easy
category: String
tags: [String, Stack]
leetcode_url: "https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses"
---

# Maximum Nesting Depth of the Parentheses / Độ Sâu Lồng Nhau Lớn Nhất

🟢 Easy

## 🧠 Intuition

> **Phép so sánh:** Giống đếm tầng của tòa nhà — mỗi `(` bước lên một tầng, mỗi `)` bước xuống. Câu hỏi: bạn lên cao nhất tầng mấy?

```
s = "(1+(2*3)+((8)/4))+1"
      (           → depth=1, max=1
       1+(         → depth=2, max=2
          2*3)+    → depth=1
               ((  → depth=3, max=3
                 8)/4))+1
Result: max depth = 3
```

## Problem Description

A string is a **valid parenthesization** if it is balanced. The **nesting depth** is the maximum number of nested open parentheses. Given a VPS string `s`, return its nesting depth.

**Example 1:** `"(1+(2*3)+((8)/4))+1"` → `3`

**Example 2:** `"(1)+((2))+(((3)))"` → `3`

**Constraints:** `1 <= s.length <= 100`, s is a valid parenthesized expression

## 📝 Interview Tips

- **No actual stack needed:** Just a counter — increment on `(`, decrement on `)`, track max
- **Stack simulation:** Push on `(`, pop on `)`, max depth = max stack size seen
- **Valid input guarantee:** No need to check underflow — never more `)` than `(`
- **One pass:** O(n) single scan, O(1) extra space (counter only)
- **Pattern:** This is the "depth tracking" variant of balanced parentheses — simpler than validity check
- **Follow-up:** LeetCode 1111 asks how to split parentheses for min max-depth — uses same depth counter

## Solutions

### Solution 1: Counter (optimal) — O(n) time, O(1) space

```typescript
function maxDepth(s: string): number {
  let depth = 0;
  let maxD = 0;

  for (const ch of s) {
    if (ch === "(") {
      depth++;
      maxD = Math.max(maxD, depth);
    } else if (ch === ")") {
      depth--;
    }
  }

  return maxD;
}
```

### Solution 2: Stack simulation — O(n) time, O(n) space

```typescript
function maxDepth(s: string): number {
  const stack: string[] = [];
  let maxD = 0;

  for (const ch of s) {
    if (ch === "(") {
      stack.push(ch);
      maxD = Math.max(maxD, stack.length);
    } else if (ch === ")") {
      stack.pop();
    }
  }

  return maxD;
}
```

### Solution 3: Functional reduce — O(n) time, O(1) space

```typescript
function maxDepth(s: string): number {
  const { max } = s.split("").reduce(
    ({ depth, max }, ch) => {
      if (ch === "(") return { depth: depth + 1, max: Math.max(max, depth + 1) };
      if (ch === ")") return { depth: depth - 1, max };
      return { depth, max };
    },
    { depth: 0, max: 0 },
  );
  return max;
}
```

## 🔗 Related Problems

| #    | Problem                                        | Difficulty | Tags          |
| ---- | ---------------------------------------------- | ---------- | ------------- |
| 20   | Valid Parentheses                              | Easy       | Stack         |
| 1111 | Maximum Nesting Depth of Two Valid Parentheses | Medium     | Stack, Greedy |
| 856  | Score of Parentheses                           | Medium     | Stack         |
| 301  | Remove Invalid Parentheses                     | Hard       | BFS           |
