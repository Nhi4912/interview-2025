---
layout: page
title: "Valid Parentheses"
difficulty: Easy
category: Stack-Queue
tags: [Stack, String, Hash Table]
leetcode_url: "https://leetcode.com/problems/valid-parentheses/"
leetcode_number: 20
pattern: "Stack"
frequency_tier: 1
companies: [Amazon, Google, Meta, Microsoft, Bloomberg]
target_time_minutes: 10
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Valid Parentheses / Ngoặc Hợp Lệ

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Stack
> **Frequency**: 🔥 Tier 1 — Gặp >90% interviews | **Target**: ⏱️ 10 min
> **Companies**: Amazon, Google, Meta, Microsoft, Bloomberg
> **See also**: [Daily Temperatures](./11-daily-temperatures.md) | [Min Stack](../../design/problems/01-min-stack.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như xếp đĩa trong nhà bếp: mỗi lần mở ngoặc `(`, `{`, `[` bạn đặt một cái đĩa lên. Khi gặp ngoặc đóng, bạn lấy đĩa trên cùng ra kiểm tra — nếu khớp thì bỏ đi, không khớp thì đống đĩa bị xáo trộn. Cuối cùng, đống phải trống.

**Pattern Recognition:**

- Signal: "matching pairs", "last opened first closed", bracket validation → **Stack (LIFO)**
- Ngoặc mở → push lên stack; ngoặc đóng → pop và kiểm tra khớp
- Kết thúc: stack rỗng ↔ hợp lệ

**Visual — s = "{[()]}":**

```
Char:  {   [   (   )   ]   }
Stack: {  {[  {[(  {[  {  (empty)
              push  pop   pop  pop
              (     (✓    [✓   {✓
Result: stack empty → true ✅
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                                    |
| ---------------- | --------------------------------------------------------------------------- |
| **When you see** | "valid brackets", "matching parentheses", "nested pairs"                    |
| **Think**        | Stack — push open, pop & match on close                                     |
| **Template**     | `if (open) stack.push(c); else if (stack.pop() !== match[c]) return false;` |
| **Time target**  | ⏱️ 10 min (Easy)                                                            |

> 💡 **Memory hook / Móc nhớ:** "Stack = chồng đĩa — đĩa cuối đặt lên phải lấy ra trước!"

---

## Problem Description

Given a string `s` containing only `(`, `)`, `{`, `}`, `[`, `]`, determine if the input string is valid. Open brackets must be closed by the same type in the correct order.

```
Example 1: "()"       → true
Example 2: "()[]{}"   → true
Example 3: "(]"       → false
```

Constraints:

- `1 <= s.length <= 10^4`
- `s` consists of brackets only

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1 min)

> "We have a string of brackets only. We need to check if every open bracket
> has a matching close bracket of the same type, in the correct nesting order.
> Clarification: Only bracket characters, no letters or digits?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2 min)

> "A brute force approach would be repeatedly removing innermost pairs — O(n²).
> But I notice 'last opened must be first closed' — that's LIFO, which means Stack.
> I'll push open brackets and pop on close brackets to verify matching.
> O(n) time, O(n) space. Should I proceed?"

### Step 3 — Implement / Viết Code (3-5 min)

> "I'll create a map of closing→opening bracket pairs.
> Iterate through each character: if opening, push to stack.
> If closing, pop from stack and check it matches. Return stack.length === 0 at end."

### Step 4 — Review / Kiểm Tra (1 min)

> "Trace '{[()]}': push {, push [, push (, see ) → pop ( matches ✓,
> > see ] → pop [ matches ✓, see } → pop { matches ✓, stack empty → true."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(n) — one pass. Space: O(n) — stack holds at most n/2 open brackets.
> Edge cases: empty string → true, odd length → always false, ')' first → false.
> This is optimal — we must examine each character at least once."

---

## 📝 Interview Tips

1. **Clarify**: Only bracket characters? No letters? / Chuỗi chỉ chứa ngoặc, không ký tự khác?
2. **Quick win**: Odd length → immediately return false / Độ dài lẻ → trả false ngay
3. **Approach**: Use map for bracket pairs, cleaner than if-else chain / Dùng map thay vì if-else
4. **Edge cases**: Empty string → true; starts with `)` → false / Chuỗi rỗng, bắt đầu bằng ngoặc đóng
5. **Follow-up**: Generate all valid combos? → LC 22; longest valid? → LC 32 / Sinh tất cả ngoặc hợp lệ

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                  | Why Wrong / Tại sao sai                                        | Fix / Cách sửa                               |
| --- | ---------------------------------- | -------------------------------------------------------------- | -------------------------------------------- |
| 1   | Only count open/close brackets     | `"(]"` has equal counts but is invalid — order and type matter | Use stack to verify matching order and type  |
| 2   | Forget to check stack empty at end | `"(()"` — all closes match but one open remains                | Return `stack.length === 0`, not just `true` |
| 3   | Pop from empty stack               | `")"` as first char → runtime error or wrong result            | Check stack not empty before popping         |

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Regex Pair Removal
 * Time: O(n²) — repeatedly scan and remove innermost pairs
 * Space: O(n) — string copy at each pass
 */
function isValidBrute(s: string): boolean {
  let prev = "";
  let current = s;
  while (prev !== current) {
    prev = current;
    current = current.replace(/\(\)|\[\]|\{\}/g, "");
  }
  return current.length === 0;
}

/**
 * Solution 2: Stack (Optimal)
 * Time: O(n) — single pass through each character
 * Space: O(n) — stack holds at most n/2 open brackets
 */
function isValid(s: string): boolean {
  const stack: string[] = [];
  const matchMap: Record<string, string> = {
    ")": "(",
    "]": "[",
    "}": "{",
  };

  for (const char of s) {
    if (!(char in matchMap)) {
      stack.push(char);
    } else {
      if (stack.pop() !== matchMap[char]) return false;
    }
  }

  return stack.length === 0;
}

// === Test Cases ===
console.log(isValid("()")); // true
console.log(isValid("()[]{}")); // true
console.log(isValid("(]")); // false
console.log(isValid("{[()]}")); // true
```

---

## 🔗 Related Problems

- [Daily Temperatures](./11-daily-temperatures.md) — monotonic stack pattern
- [Min Stack](../../design/problems/01-min-stack.md) — stack design with O(1) min
- [Generate Parentheses](https://leetcode.com/problems/generate-parentheses/) — backtracking to generate valid strings
- [Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses/) — harder DP/stack variant

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 10 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
