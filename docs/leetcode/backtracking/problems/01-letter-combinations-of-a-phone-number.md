---
layout: page
title: "Letter Combinations of a Phone Number"
difficulty: Medium
category: Backtracking
tags: [Hash Table, String, Backtracking]
leetcode_url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/"
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

## 📝 Interview Tips

1. **Clarify**: Can input be empty? Does digit '1' appear? / Input có thể rỗng không? Có số '1' trong input không?
2. **Brute force**: Iterative — dùng array kết hợp từng digit vào các combination đang có. O(4^n · n) time, O(4^n) space (lưu toàn bộ kết quả trung gian).
3. **Optimize**: Backtracking — build chuỗi trực tiếp, không tạo intermediate arrays. Cùng asymptotic complexity nhưng sạch hơn và stack space chỉ O(n).
4. **Edge cases**: `digits = ""` → return `[]`; single digit → return its letters array.
5. **Follow-up**: Filter combinations chỉ giữ các từ hợp lệ trong từ điển → Trie + backtracking (Word Search II pattern).

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
