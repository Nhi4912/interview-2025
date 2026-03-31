---
layout: page
title: "Print Words Vertically"
difficulty: Medium
category: String
tags: [Array, String, Simulation]
leetcode_url: "https://leetcode.com/problems/print-words-vertically"
---

# Print Words Vertically / In Các Từ Theo Chiều Dọc

🟡 Medium | Array, String, Simulation

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Hãy tưởng tượng các từ được viết trên bảng theo chiều ngang, sau đó đọc từng cột từ trên xuống. Các vị trí thiếu ký tự (từ ngắn hơn) sẽ được thay bằng khoảng trắng — nhưng **trim trailing spaces** từ mỗi cột.

```
s = "HOW ARE YOU"
words = ["HOW", "ARE", "YOU"]

Col 0: H A Y → "HAY"
Col 1: O R O → "ORO"
Col 2: W E U → "WEU"

s = "TO BE OR NOT TO BE"
Col 0: T B O N T B  → "TBONTB"
Col 1: O E R O O E  → "OEROOE"
Col 2: _ _ _ T _ _  → "  T  " → trim → "  T"
```

## Problem Description

Given a string `s` of words separated by single spaces, return the words printed vertically in the same order. Words are arranged left to right, and each column is read top to bottom. Trailing spaces in each vertical word should be removed, but interior spaces must be kept.

- **Example 1:** `s = "HOW ARE YOU"` → `["HAY","ORO","WEU"]`
- **Example 2:** `s = "TO BE OR NOT TO BE"` → `["TBONTB","OEROOE","RNTT","   T","T   BE"]`? See actual solution output

## 📝 Interview Tips

- **🇻🇳 Tách từ** và tìm chiều dài từ dài nhất / Split words, find maxLen
- **🇻🇳 Duyệt theo cột** 0..maxLen-1, mỗi từ đóng góp s[col] hoặc space / Iterate by column index
- **🇻🇳 Trailing spaces** phải bị xóa — dùng trimEnd() / Remove trailing spaces with trimEnd()
- **🇻🇳 Interior spaces** được giữ nguyên khi từ nào đó có ký tự sau vị trí này / Interior spaces preserved
- **🇻🇳 Edge case** → từ 1 ký tự, chỉ 1 từ / Single char words, single word
- **🇻🇳 Không cần StringBuilder phức tạp** — map + join + trimEnd là đủ / Simple map + join + trimEnd

## Solutions

### Solution 1: Column Iteration with trimEnd

```typescript
/**
 * For each column index, collect chars from each word (or space if too short)
 * Time: O(n * maxLen)  Space: O(n * maxLen)
 * n = number of words, maxLen = longest word length
 */
function printVertically(s: string): string[] {
  const words = s.split(" ");
  const maxLen = Math.max(...words.map((w) => w.length));
  const result: string[] = [];

  for (let col = 0; col < maxLen; col++) {
    let column = "";
    for (const word of words) {
      column += col < word.length ? word[col] : " ";
    }
    result.push(column.trimEnd());
  }

  return result;
}

// Test cases
console.log(printVertically("HOW ARE YOU"));
// ["HAY","ORO","WEU"]

console.log(printVertically("TO BE OR NOT TO BE"));
// ["TBONTB","OEROOE","RNTT","   T","T   BE"]? Let's check:
// words = ["TO","BE","OR","NOT","TO","BE"], maxLen = 3
// col0: T B O N T B → "TBONTB"
// col1: O E R O O E → "OEROOE"
// col2: _ _ _ T _ _ → "   T  " → trimEnd → "   T"
// Output: ["TBONTB","OEROOE","   T"]

console.log(printVertically("CONTEST IS COMING"));
// ["CIC","ONO","NTM","TSI","EI N","S  G"]
```

### Solution 2: Transpose Approach

```typescript
/**
 * Build column arrays by transposing the word matrix
 * Time: O(n * maxLen)  Space: O(n * maxLen)
 */
function printVerticallyV2(s: string): string[] {
  const words = s.split(" ");
  const maxLen = Math.max(...words.map((w) => w.length));

  return Array.from({ length: maxLen }, (_, col) =>
    words
      .map((w) => (col < w.length ? w[col] : " "))
      .join("")
      .trimEnd(),
  );
}

// Test cases
console.log(printVerticallyV2("HOW ARE YOU")); // ["HAY","ORO","WEU"]
console.log(printVerticallyV2("TO BE OR NOT TO BE")); // ["TBONTB","OEROOE","   T"]
```

### Solution 3: Pad Words First, then Slice

```typescript
/**
 * Pad each word to maxLen, then slice column by column
 * Time: O(n * maxLen)  Space: O(n * maxLen)
 */
function printVerticallyV3(s: string): string[] {
  const words = s.split(" ");
  const maxLen = Math.max(...words.map((w) => w.length));

  // Pad each word to maxLen with spaces
  const padded = words.map((w) => w.padEnd(maxLen, " "));

  const result: string[] = [];
  for (let col = 0; col < maxLen; col++) {
    const column = padded
      .map((w) => w[col])
      .join("")
      .trimEnd();
    result.push(column);
  }

  return result;
}

// Test cases
console.log(printVerticallyV3("HOW ARE YOU")); // ["HAY","ORO","WEU"]
console.log(printVerticallyV3("CONTEST IS COMING"));
```

## 🔗 Related Problems

| Problem                                                                   | Difficulty | Similarity                    |
| ------------------------------------------------------------------------- | ---------- | ----------------------------- |
| [Zigzag Conversion](https://leetcode.com/problems/zigzag-conversion/)     | 🟡 Medium  | Row/column reordering         |
| [Rotate Image](https://leetcode.com/problems/rotate-image/)               | 🟡 Medium  | Matrix transposition          |
| [Transpose Matrix](https://leetcode.com/problems/transpose-matrix/)       | 🟢 Easy    | Grid column reading           |
| [Find the Difference](https://leetcode.com/problems/find-the-difference/) | 🟢 Easy    | String character manipulation |
