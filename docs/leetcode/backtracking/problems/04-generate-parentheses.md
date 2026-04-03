---
layout: page
title: "Generate Parentheses"
difficulty: Medium
category: Backtracking
tags: [String, Dynamic Programming, Backtracking]
leetcode_url: "https://leetcode.com/problems/generate-parentheses/"
leetcode_number: 22
pattern: "Backtracking with Constraints"
frequency_tier: 2
companies: [Google, Amazon, Bloomberg, Microsoft]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
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

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                                        |
| ---------------- | ------------------------------------------------------------------------------- |
| **When you see** | "generate all valid combinations", "well-formed parentheses"                    |
| **Think**        | Backtracking — add `(` only if `open < n`, add `)` only if `close < open`      |
| **Template**     | `if open < n: recurse(open+1, close, cur+"("); if close < open: recurse(...)` |
| **Time target**  | ⏱️ 20 min (Medium)                                                              |

> 💡 **Memory hook / Móc nhớ:** "2 điều kiện: open < n mới thêm `(`; close < open mới thêm `)` — không filter, không sai!"

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

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1 min)

> "We need all valid combinations of n pairs of parentheses. Output order doesn't matter. n is at most 8 so output size is manageable."

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "Brute force: generate all 2^(2n) strings then validate — wasteful. Better: backtracking with early pruning. Two rules: only add `(` if we haven't used all n opens; only add `)` if there's an unmatched `(`. This guarantees every completed string is valid — no post-filtering needed. Time is O(4^n/√n) — the Catalan number."

### Step 3 — Implement / Viết Code (5 min)

> "I'll write a recursive backtrack(current, open, close). Base case: current.length === 2n, push to result. Then try adding `(` if open < n, and `)` if close < open."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "For n=2: start empty. Add `(` → open=1. Add `(` → open=2. Now can only add `)` → `(()`. Add `)` → close=2 — done: `(())`. Backtrack and try `)` earlier gives `()()`. Two results match expected."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time O(4^n/√n) — Catalan number of valid strings, each length 2n. Space O(n) recursion depth. Edge case: n=1 gives exactly `[\"()\"]`."

---

## 📝 Interview Tips

1. **Clarify**: Is there a required ordering in the output? (LeetCode accepts any valid order.) / Có yêu cầu thứ tự output không?
2. **Brute force**: Generate all 2^(2n) binary strings of `(` and `)`, then validate each → O(2^2n × n) / Sinh tất cả rồi lọc — rất chậm
3. **Approach**: "Backtracking with two counters — open and close. Add `(` only if open < n, add `)` only if close < open. This prunes invalid branches early." / Backtracking với pruning, không cần filter sau
4. **Complexity**: The number of valid strings is Catalan(n) ≈ 4^n / √n. Total time is O(4^n / √n × n) — dominated by the output size / Độ phức tạp theo số Catalan
5. **Edge cases**: n=1 always gives `["()"]`; every valid string has exactly n `(`s and n `)`s / n=1 cho kết quả đơn giản, kiểm tra trước

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                                    | Why Wrong / Tại sao sai                                     | Fix / Cách sửa                                        |
| --- | ---------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------- |
| 1   | Generate all 2^(2n) strings then filter              | Exponential waste — most strings are invalid                | Use backtracking constraints to prune invalid branches |
| 2   | Add `)` whenever `close < n` instead of `close < open` | Generates strings like `))((` — not well-formed           | Condition: `close < open` ensures matching pairs       |
| 3   | Forget to check `open < n` before adding `(`        | May add more `(` than allowed by n                          | Guard: only add `(` when `open < n`                   |

---

## Solutions

```typescript

/**

- Solution 1: Brute Force — Generate All, Filter Valid
- Time: O(2^2n × n) — 2^2n strings generated, O(n) validation each
- Space: O(2^2n × n) — all strings stored before filtering
  */
  function generateParenthesisBrute(n: number): string[] {
  const result: string[] = [];

function generate(current: string): void {
if (current.length === 2 * n) {
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

/**

- Solution 2: Backtracking with Pruning (Optimal)
- Time: O(4^n / √n) — Catalan number of valid strings, each of length 2n
- Space: O(n) — recursion stack depth is 2n at most
  */
  function generateParenthesis(n: number): string[] {
  const result: string[] = [];

function backtrack(current: string, open: number, close: number): void {
if (current.length === 2 * n) {
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

```

---

## 🔗 Related Problems

- [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) — prerequisite: validate a parentheses string
- [Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) — same backtracking structure
- [Permutations](https://leetcode.com/problems/permutations/) — backtracking template for generating all arrangements
- [Combination Sum](https://leetcode.com/problems/combination-sum/) — backtracking with pruning on sum constraint

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | ___ min (target: 20 min)                 |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
