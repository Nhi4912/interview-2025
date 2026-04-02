---
layout: page
title: "Build Binary Expression Tree From Infix Expression"
difficulty: Hard
category: Tree-Graph
tags: [String, Stack, Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/build-binary-expression-tree-from-infix-expression"
---

# Build Binary Expression Tree From Infix Expression / Xây Dựng Cây Biểu Thức Từ Biểu Thức Infix

> **Track**: Tree-Graph | **Difficulty**: 🔴 Hard | **Pattern**: Stack — Shunting-Yard Tree Builder
> **Frequency**: 📘 Tier 3 — Gặp ở Google, Amazon (expression parsing)
> **See also**: [224 Basic Calculator](https://leetcode.com/problems/basic-calculator) | [150 Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng bạn là thư ký ghi biên bản cuộc họp ban lãnh đạo. Mỗi số thì ghi ngay vào sổ (stack node). Mỗi phép tính thì xét ưu tiên: nếu sếp cũ (operator trên stack) có quyền ưu tiên cao hơn sếp mới, sếp cũ "ký kết" ngay (pop và tạo nhánh cây) trước khi sếp mới vào. Dấu ngoặc là "phòng họp riêng" — tất cả trong ngoặc được giải quyết trước. Kết quả cuối cùng: cây nhị phân mà in-order traversal cho ra biểu thức ban đầu.

**Pattern Recognition:**

- Signal: "infix expression → binary tree, respecting precedence and parentheses" → **Shunting-Yard with two stacks**
- Bài này thuộc dạng parse biểu thức thành cây với ưu tiên toán tử
- Key insight: hai stack — `nodes` (lưu TreeNode) và `ops` (lưu operator char); khi gặp op có ưu tiên ≤ op đỉnh stack → pop và kết hợp 2 node + op thành cây con

**Visual — Shunting-yard tree building:**

```
Input: "3*4-2*5"

Process char by char:
  '3': push node(3)          nodes:[3]         ops:[]
  '*': push '*'              nodes:[3]         ops:[*]
  '4': push node(4)          nodes:[3,4]       ops:[*]
  '-': prec('-')=1 ≤ prec('*')=2
       → pop '*', pop 4,3, push node(*,3,4)    nodes:[(*,3,4)]   ops:[]
       → push '-'            nodes:[(*,3,4)]   ops:[-]
  '2': push node(2)          nodes:[(*,3,4),2] ops:[-]
  '*': prec('*')=2 > prec('-')=1 → push '*'   nodes:[(*,3,4),2] ops:[-,*]
  '5': push node(5)          nodes:[(*,3,4),2,5] ops:[-,*]
  end: pop '*', make (*,2,5) nodes:[(*,3,4),(*,2,5)] ops:[-]
       pop '-', make (-,(*,3,4),(*,2,5)) ← root!

Result tree:
        -
       / \
      *   *
     /\   /\
    3  4 2  5
```

---

## Problem Description

Given a string `s` representing a valid infix expression with single-digit numbers and operators `+`, `-`, `*`, `/`, and parentheses `()`, build and return the binary expression tree. The tree's in-order traversal (without parentheses) yields the original expression. ([LeetCode](https://leetcode.com/problems/build-binary-expression-tree-from-infix-expression))

```
Example 1: s="3*4-2*5" → tree with root '-', left=(*,3,4), right=(*,2,5)
Example 2: s="2-3/(5*2)+1" → appropriate expression tree
```

Constraints: 1 ≤ s.length ≤ 100; s contains digits 0-9, operators +,-,\*,/, and parentheses; valid expression.

---

## 📝 Interview Tips

1. **Two stacks: one for nodes (operands), one for operators** — _Hai stack: một cho node (toán hạng), một cho operator (phép toán)_
2. **Precedence: \* and / are 2, + and - are 1; ( is 0 (barrier)** — _Ưu tiên: \*/=2, +-=1, (=0 (rào cản)_
3. **When pushing operator: pop and combine while top has >= precedence** — _Khi đẩy op mới: pop và gộp khi op trên stack có ưu tiên >=_
4. **On ')': pop all until '(', then discard '('** — _Khi gặp ')': pop tất cả đến '(', rồi bỏ '('_
5. **Each combine: pop 2 nodes (right then left), create parent with operator** — _Mỗi lần gộp: pop 2 node (phải trước trái), tạo nút cha với operator_
6. **At end: flush remaining ops from stack** — _Cuối: đẩy hết ops còn lại trong stack để hoàn thành cây_

---

## Solutions

```typescript
class ExprNode {
  val: string;
  left: ExprNode | null;
  right: ExprNode | null;
  constructor(val: string, left: ExprNode | null = null, right: ExprNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/** Solution 1: Shunting-Yard algorithm with two stacks
 * @complexity Time: O(n) | Space: O(n) */
function expTree(s: string): ExprNode | null {
  const prec: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, "(": 0 };

  const nodes: ExprNode[] = [];
  const ops: string[] = [];

  function combine(): void {
    const op = ops.pop()!;
    const right = nodes.pop()!;
    const left = nodes.pop()!;
    nodes.push(new ExprNode(op, left, right));
  }

  for (const ch of s) {
    if (ch >= "0" && ch <= "9") {
      nodes.push(new ExprNode(ch));
    } else if (ch === "(") {
      ops.push("(");
    } else if (ch === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") combine();
      ops.pop(); // discard '('
    } else {
      // operator: pop higher or equal precedence first
      while (ops.length && prec[ops[ops.length - 1]] >= prec[ch]) combine();
      ops.push(ch);
    }
  }

  // flush remaining operators
  while (ops.length) combine();

  return nodes[0] ?? null;
}

/** Solution 2: Recursive descent parser
 * @complexity Time: O(n) | Space: O(n) */
function expTree2(s: string): ExprNode | null {
  let pos = 0;

  function parseExpr(): ExprNode {
    let left = parseTerm();
    while (pos < s.length && (s[pos] === "+" || s[pos] === "-")) {
      const op = s[pos++];
      const right = parseTerm();
      left = new ExprNode(op, left, right);
    }
    return left;
  }

  function parseTerm(): ExprNode {
    let left = parseFactor();
    while (pos < s.length && (s[pos] === "*" || s[pos] === "/")) {
      const op = s[pos++];
      const right = parseFactor();
      left = new ExprNode(op, left, right);
    }
    return left;
  }

  function parseFactor(): ExprNode {
    if (s[pos] === "(") {
      pos++; // consume '('
      const node = parseExpr();
      pos++; // consume ')'
      return node;
    }
    return new ExprNode(s[pos++]);
  }

  return parseExpr();
}

function inorder(node: ExprNode | null): string {
  if (!node) return "";
  if (!node.left && !node.right) return node.val;
  return `(${inorder(node.left)}${node.val}${inorder(node.right)})`;
}

// === Test Cases ===
const t1 = expTree("3*4-2*5");
console.log(t1?.val); // '-'
console.log(inorder(t1)); // ((3*4)-(2*5))

const t2 = expTree("2-3/(5*2)+1");
console.log(inorder(t2)); // should represent same expression

const t3 = expTree2("3*4-2*5");
console.log(inorder(t3)); // ((3*4)-(2*5))
```

---

## 🔗 Related Problems

| #    | Problem                          | Difficulty | Pattern               |
| ---- | -------------------------------- | ---------- | --------------------- |
| 224  | Basic Calculator                 | Hard       | Stack — Infix Eval    |
| 150  | Evaluate Reverse Polish Notation | Medium     | Stack                 |
| 227  | Basic Calculator II              | Medium     | Stack — Shunting-yard |
| 1628 | Design an Expression Tree        | Medium     | Design + Stack        |
