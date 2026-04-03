---
layout: page
title: "Letter Combinations of a Phone Number"
difficulty: Medium
category: Backtracking
tags: [Hash Table, String, Backtracking]
leetcode_url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/"
leetcode_number: 17
pattern: "Backtracking with Phone Digit Map"
frequency_tier: 2
companies: [Amazon, Google, Meta, Bloomberg]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Letter Combinations of a Phone Number / Tổ Hợp Chữ Cái Từ Số Điện Thoại

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking
> **Frequency**: ⭐ Tier 2 — Gặp >40% interviews
> **See also**: [Combination Sum](./02-combination-sum.md) | [Permutations](./03-permutations.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Nhớ lại bàn phím T9 trên điện thoại cũ — khi bạn nhắn tin "23", phím 2 có thể là a/b/c và phím 3 có thể là d/e/f. Để liệt kê tất cả tin nhắn có thể, bạn chọn từng chữ cho phím 2 rồi thử tất cả chữ cho phím 3 — đây chính là backtracking: đi sâu từng nhánh, quay lui khi đến lá.

**Pattern Recognition:**

- Signal: "all possible combinations", "digits map to letters" → **Backtracking (build all valid paths)**
- Mỗi digit = một level trong cây quyết định; mỗi chữ cái = một nhánh
- Base case: `index === digits.length` → ta có 1 combination hoàn chỉnh → thêm vào result

**Visual — Backtracking tree cho digits = "23":**

```
                  ""
           /       |       \
          a        b        c         (digit '2')
        / | \    / | \    / | \
       d  e  f  d  e  f  d  e  f     (digit '3')

Kết quả: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Khi thấy | Nghĩ đến |
|---|---|
| **When you see** | Generate all combinations from digit mapping (phone keypad) |
| **Think** | Backtracking — for each digit, try all mapped letters; recurse on remaining digits |
| **Template** | `backtrack(index, current): if index===digits.length push result; for letter in map[digits[index]]: recurse(index+1, current+letter)` |
| **Time target** | ≤ 20 min — define map ~3 min, write backtrack ~7 min, handle edge cases + test ~10 min |

**Memory hook:** "Điện thoại = map digit → letters, backtrack qua từng chữ cái"

---

## Problem Description

Given a string containing digits 2–9, return all possible letter combinations the number could represent (like a phone keypad). Return the answer in any order.

```
Mapping: 2→abc  3→def  4→ghi  5→jkl  6→mno  7→pqrs  8→tuv  9→wxyz

Example 1: digits = "23" → ["ad","ae","af","bd","be","bf","cd","ce","cf"]
Example 2: digits = ""   → []
Example 3: digits = "2"  → ["a","b","c"]
```

Constraints:

- `0 <= digits.length <= 4`
- Each digit is in `['2', '9']`

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

> **U — Understand:** "I need to return every possible letter combination where each digit maps to its phone keypad letters. The digits are 2–9. What do I return for empty input? Any order acceptable for the output?"

> **M — Match:** "This is a classic backtracking problem. I'm building a decision tree where each level represents one digit, and each branch represents a letter choice for that digit. The depth of the tree equals digits.length, and the branching factor is 3 or 4 depending on the digit."

> **P — Plan:** "Define the digit-to-letters map. Handle empty input: return []. Write `backtrack(index, current)`: if index equals digits.length, push current to results. Otherwise, loop over each letter in `map[digits[index]]`, and recurse with `backtrack(index+1, current+letter)`."

> **I — Implement:** "`function backtrack(i, cur) { if (i === digits.length) { result.push(cur); return; } for (const letter of map[digits[i]]) backtrack(i+1, cur+letter); }` — call `backtrack(0, '')` and return result."

> **R/E — Review & Evaluate:** "Time O(4^n · n) — up to 4^n combinations, each of length n. Space O(n) recursion stack depth, plus O(4^n · n) for the output. Edge case: empty string — guard at the top with `if (!digits.length) return []`. Edge case: digit '7' or '9' maps to 4 letters, handled by the map automatically."

---

## 📝 Interview Tips

1. **Clarify**: Can input be empty? Does digit '1' appear? / Input có thể rỗng không? Có số '1' trong input không?
2. **Brute force**: Iterative — dùng array kết hợp từng digit vào các combination đang có. O(4^n · n) time, O(4^n) space (lưu toàn bộ kết quả trung gian).
3. **Optimize**: Backtracking — build chuỗi trực tiếp, không tạo intermediate arrays. Cùng asymptotic complexity nhưng sạch hơn và stack space chỉ O(n).
4. **Edge cases**: `digits = ""` → return `[]`; single digit → return its letters array.
5. **Follow-up**: Filter combinations chỉ giữ các từ hợp lệ trong từ điển → Trie + backtracking (Word Search II pattern).

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| Mistake | Why It Fails | Fix |
|---|---|---|
| Not handling empty input | `map[digits[0]]` is undefined, crashes on first iteration | Guard at function entry: `if (digits.length === 0) return []` before any recursion |
| Building combinations iteratively with nested loops | Works for fixed-length inputs but doesn't generalize — adding a 5th digit requires another nested loop | Use recursion/backtracking; depth is controlled by the index parameter, scales to any length |
| Forgetting that '0' and '1' have no letter mappings | Accessing `map['0']` or `map['1']` returns undefined, causing a runtime crash | Constraints say digits are 2–9, but always define the map only for 2–9 and add an explicit guard or skip for safety |

---

## Solutions

```typescript

/**

- Solution 1: Iterative BFS-style Expansion (Brute Force)
- Time: O(4^n · n) — up to 4^n combos, each n chars long
- Space: O(4^n) — stores all intermediate combinations
  */
  function letterCombinationsIterative(digits: string): string[] {
  if (digits.length === 0) return [];

const map: Record<string, string> = {
"2": "abc", "3": "def", "4": "ghi", "5": "jkl",
"6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
};

let result = [""];
for (const digit of digits) {
const next: string[] = [];
for (const combo of result) {
for (const letter of map[digit]) {
next.push(combo + letter);
}
}
result = next;
}
return result;
}

/**

- Solution 2: Backtracking (Optimal — interview standard)
- Time: O(4^n · n) — same asymptotic, avoids building intermediate arrays
- Space: O(n) — recursion depth equals digits.length
  */
  function letterCombinations(digits: string): string[] {
  if (digits.length === 0) return [];

const map: Record<string, string> = {
"2": "abc", "3": "def", "4": "ghi", "5": "jkl",
"6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
};

const result: string[] = [];

function backtrack(index: number, current: string): void {
if (index === digits.length) {
result.push(current);
return;
}
for (const letter of map[digits[index]]) {
backtrack(index + 1, current + letter);
}
}

backtrack(0, "");
return result;
}

// === Test Cases ===
console.log(letterCombinations("23")); // ["ad","ae","af","bd","be","bf","cd","ce","cf"]
console.log(letterCombinations("")); // []
console.log(letterCombinations("2")); // ["a","b","c"]
console.log(letterCombinations("9")); // ["w","x","y","z"]

```

---

## 🔗 Related Problems

- [Combination Sum](./02-combination-sum.md) — backtracking with element reuse
- [Permutations](./03-permutations.md) — backtracking, all orderings of elements
- [Generate Parentheses](https://leetcode.com/problems/generate-parentheses/) — backtracking with validity constraint
- [Word Search](https://leetcode.com/problems/word-search/) — backtracking on 2D grid

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric | Target | Your Result |
|---|---|---|
| Time to solve | ≤ 20 min | _____ min |
| Got optimal on first try | Yes | ☐ Yes ☐ No |
| Explained clearly | Yes | ☐ Yes ☐ No |
| Handled all edge cases | Yes | ☐ Yes ☐ No |

**SRS Schedule:** After solving — review in 1 day → 3 days → 7 days → 14 days → 30 days.

### Review Log

| Date | Time Taken | Notes |
|---|---|---|
| | | |
