---
layout: page
title: "Generate Parentheses"
difficulty: Medium
category: Backtracking
tags: [String, Dynamic Programming, Backtracking]
leetcode_url: "https://leetcode.com/problems/generate-parentheses/"
---

# Generate Parentheses / Tạo Dấu Ngoặc Hợp Lệ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking
> **Frequency**: ⭐ Tier 2 — Gặp ~55% interviews vòng mid-level
> **See also**: [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) | [Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như viết một câu văn phải đúng ngữ pháp — mở ngoặc trước, đóng ngoặc sau, và số lần đóng không được vượt quá số lần mở. Thay vì viết tất cả mọi thứ rồi lọc (brute force), backtracking giúp bạn "không viết sai ngay từ đầu" — mỗi bước chỉ thêm ký tự hợp lệ, cắt nhánh sai ngay tại chỗ.

**Pattern Recognition:**

- Signal: "generate all valid combinations" → **Backtracking với pruning condition**
- Chỉ thêm `(` khi `open < n`; chỉ thêm `)` khi `close < open`
- Không cần filter sau — chỉ có valid strings mới đến được base case

**Visual — Backtracking Tree (n=2):**

```
backtrack("", open=0, close=0)
├── add "(" → ("(", 1, 0)
│   ├── add "(" → ("((", 2, 0)
│   │   └── add ")" → ("(()", 2, 1)
│   │       └── add ")" → "(())" push ✅
│   └── add ")" → ("()", 1, 1)
│       └── add "(" → ("()(", 2, 1)
│           └── add ")" → "()()" push ✅
Result: ["(())", "()()"]
```

---

## Problem Description

Given `n` pairs of parentheses, generate all combinations of well-formed (valid) parentheses.

```
Example 1: n = 1  → ["()"]
Example 2: n = 2  → ["(())", "()()"]
Example 3: n = 3  → ["((()))", "(()())", "(())()", "()(())", "()()()"]
```

Constraints:

- 1 <= n <= 8

---

## 📝 Interview Tips

1. **Clarify**: Is there a required ordering in the output? (LeetCode accepts any valid order.) / Có yêu cầu thứ tự output không?
2. **Brute force**: Generate all 2^(2n) binary strings of `(` and `)`, then validate each → O(2^2n × n) / Sinh tất cả rồi lọc — rất chậm
3. **Approach**: "Backtracking with two counters — open and close. Add `(` only if open < n, add `)` only if close < open. This prunes invalid branches early." / Backtracking với pruning, không cần filter sau
4. **Complexity**: The number of valid strings is Catalan(n) ≈ 4^n / √n. Total time is O(4^n / √n × n) — dominated by the output size / Độ phức tạp theo số Catalan
5. **Edge cases**: n=1 always gives `["()"]`; every valid string has exactly n `(`s and n `)`s / n=1 cho kết quả đơn giản, kiểm tra trước

---

## Solutions

{% raw %}

/\*\*

- Solution 1: Brute Force — Generate All, Filter Valid
- Time: O(2^2n × n) — 2^2n strings generated, O(n) validation each
- Space: O(2^2n × n) — all strings stored before filtering
  \*/
  function generateParenthesisBrute(n: number): string[] {
  const result: string[] = [];

function generate(current: string): void {
if (current.length === 2 \* n) {
// Validate by tracking balance; reject if balance ever goes negative
let balance = 0;
for (const ch of current) {
balance += ch === '(' ? 1 : -1;
if (balance < 0) return;
}
if (balance === 0) result.push(current);
return;
}
generate(current + '(');
generate(current + ')');
}

generate('');
return result;
}

/\*\*

- Solution 2: Backtracking with Pruning (Optimal)
- Time: O(4^n / √n) — Catalan number of valid strings, each of length 2n
- Space: O(n) — recursion stack depth is 2n at most
  \*/
  function generateParenthesis(n: number): string[] {
  const result: string[] = [];

function backtrack(current: string, open: number, close: number): void {
if (current.length === 2 \* n) {
result.push(current);
return;
}
// Only add '(' if we haven't used all n opens yet
if (open < n) backtrack(current + '(', open + 1, close);
// Only add ')' if there's an unmatched '(' waiting
if (close < open) backtrack(current + ')', open, close + 1);
}

backtrack('', 0, 0);
return result;
}

// === Test Cases ===
console.log(generateParenthesis(1)); // ["()"] ✅
console.log(generateParenthesis(2)); // ["(())", "()()"] ✅
console.log(generateParenthesis(3).length); // 5 ✅
console.log(generateParenthesisBrute(2)); // ["(())", "()()"] ✅

{% endraw %}

---

## 🔗 Related Problems

- [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) — prerequisite: validate a parentheses string
- [Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) — same backtracking structure
- [Permutations](https://leetcode.com/problems/permutations/) — backtracking template for generating all arrangements
- [Combination Sum](https://leetcode.com/problems/combination-sum/) — backtracking with pruning on sum constraint
