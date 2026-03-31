---
layout: page
title: "Score of Parentheses"
difficulty: Medium
category: String
tags: [String, Stack]
leetcode_url: "https://leetcode.com/problems/score-of-parentheses"
---

# Score of Parentheses / Điểm Số Của Dấu Ngoặc

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack / Bit Counting
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Ví dụ thực tế:** Giống như hệ thống điểm thưởng theo cấp bậc — mỗi cặp ngoặc sâu hơn thì được nhân đôi. Ví dụ: nhân viên thường được 1 điểm, nhân viên có thể quản lý trên quản lý được nhân đôi rồi nhân đôi nữa. Stack giúp theo dõi "level" đang ở đâu.

**Pattern Recognition:**

- `"()" = 1`, `"(A)" = 2*A`, `"AB" = A+B` → Stack accumulates score per level
- Khi gặp `(` → push 0 (new level); khi gặp `)` → pop, nếu = 0 thì +1 (leaf), else × 2 rồi cộng vào level trên
- Alt: bit-counting insight: each `()` contributes `2^depth` to total

**Visual:**

```
s = "(()(()))"

stack = [0]
'(' → push 0 → stack=[0,0]
'(' → push 0 → stack=[0,0,0]
')' → pop v=0 → leaf → top += 1 → stack=[0,0,1]
'(' → push 0 → stack=[0,0,1,0]
'(' → push 0 → stack=[0,0,1,0,0]
')' → pop v=0 → leaf → top+=1 → stack=[0,0,1,0,1]
')' → pop v=1 → *2=2  → top+=2 → stack=[0,0,1,2]
                        merged = 1+2=3 → stack=[0,0,3]
')' → pop v=3 → *2=6  → top+=6 → stack=[0,6]
')' → pop v=6 → *2=12 → top+=12→ stack=[12]

Hmm let me recalc: "(()(()))"
( → [0,0]
( → [0,0,0]
) → pop 0, leaf: [0,0+1]=[0,1]
( → [0,1,0]
( → [0,1,0,0]
) → pop 0, leaf: [0,1,0+1]=[0,1,1]
) → pop 1, *2=2: [0,1+2]=[0,3]
) → pop 3, *2=6: [0+6]=[6]

Result = 6 ✅
```

## Problem Description

Given a balanced parentheses string `s`, compute its score: `"()"` = 1; `"AB"` = score(A)+score(B); `"(A)"` = 2×score(A).

Examples: `"()"` → 1 | `"(())"` → 2 | `"()()"` → 2 | `"(()(()))"` → 6.

## 📝 Interview Tips

1. **Clarify**: Chuỗi đã balanced chắc chắn chưa? / Always balanced, guaranteed by constraints
2. **Approach**: Stack: push 0 for `(`, on `)` pop and double/leaf to update top / Stack of accumulated scores
3. **Edge cases**: `"()"` → 1 (simplest); deeply nested → powers of 2 / Leaf `()` = 1
4. **Optimize**: Bit insight: each `()` at depth d contributes 2^d / O(1) space possible
5. **Follow-up**: Nếu chuỗi rất dài? → Bit approach O(1) space / Depth counter replaces stack
6. **Complexity**: Stack: O(n) time, O(n) space; Bit: O(n) time, O(1) space

## Solutions

```typescript
/** Solution 1: Stack (Intuitive)
 * Time: O(n) | Space: O(n)
 */
function scoreOfParentheses(s: string): number {
  const stack: number[] = [0]; // start with score 0 at bottom

  for (const ch of s) {
    if (ch === "(") {
      stack.push(0); // open new scope
    } else {
      const v = stack.pop()!;
      const top = stack.pop()!;
      // if v=0 it's a "()" leaf = 1, else it's "(A)" = 2*v
      stack.push(top + (v === 0 ? 1 : 2 * v));
    }
  }

  return stack[0];
}

/** Solution 2: Bit Counting / Depth Insight (O(1) Space)
 * Time: O(n) | Space: O(1)
 * Each "()" at depth d contributes 2^d to the total
 */
function scoreOfParenthesesBit(s: string): number {
  let score = 0;
  let depth = 0;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      depth++;
    } else {
      depth--;
      // If previous char is '(', this is a leaf "()"
      if (s[i - 1] === "(") {
        score += 1 << depth; // 2^depth
      }
    }
  }

  return score;
}

/** Solution 3: Recursive (for clarity)
 * Time: O(n) | Space: O(n) stack frames
 */
function scoreOfParenthesesRec(s: string): number {
  let pos = 0;

  function parse(): number {
    let score = 0;
    while (pos < s.length && s[pos] !== ")") {
      if (s[pos] === "(") {
        pos++; // skip '('
        const inner = parse();
        pos++; // skip ')'
        score += inner === 0 ? 1 : 2 * inner;
      }
    }
    return score;
  }

  return parse();
}

// Tests
console.log(scoreOfParentheses("()")); // 1
console.log(scoreOfParentheses("(())")); // 2
console.log(scoreOfParentheses("()()")); // 2
console.log(scoreOfParentheses("(()(()))")); // 6
console.log(scoreOfParenthesesBit("(()(()))")); // 6
console.log(scoreOfParenthesesRec("()()")); // 2
```

## 🔗 Related Problems

| Problem                                                                                                      | Relationship                         |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| [Valid Parentheses](https://leetcode.com/problems/valid-parentheses)                                         | Stack-based parentheses matching     |
| [Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses)                         | Stack tracking parentheses structure |
| [Minimum Add to Make Parentheses Valid](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid) | Counting unmatched parentheses       |
