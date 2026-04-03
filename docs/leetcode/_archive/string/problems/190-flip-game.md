---
layout: page
title: "Flip Game"
difficulty: Easy
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/flip-game"
---

# Flip Game / Trò Chơi Lật

🟢 Easy | String

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Giống như tìm tất cả vị trí có hai dấu `+` liên tiếp trong xâu, rồi biến chúng thành `--`. Đây là bài toán tìm kiếm mẫu đơn giản.

```
currentState = "+++++"
Position 0: "++" → "--+++"
Position 1: "++" → "+--++"
Position 2: "++" → "++--+"
Position 3: "++" → "+++-−"

All possible states after one move:
["--+++", "+--++", "++--+", "+++-−"]
```

## Problem Description

You are playing a flip game. The string `currentState` contains only `'+'` and `'-'`. In one move, you flip two consecutive `"++"` into `"--"`. Return all **possible states** of the string after exactly one valid move. You may return the answer in any order.

- **Example 1:** `currentState = "++++"` → `["--++", "+--+", "++--"]`
- **Example 2:** `currentState = "+"` → `[]` (no `"++"` exists)

## 📝 Interview Tips

- **🇻🇳 Duyệt từng vị trí** — chỉ cần kiểm tra s[i] == '+' && s[i+1] == '+' / Scan each position
- **🇻🇳 Slice để tạo bản sao** — không thay đổi chuỗi gốc / Use slice to create copies
- **🇻🇳 Edge case** → chuỗi ngắn hơn 2 ký tự → trả về mảng rỗng / String shorter than 2 → empty array
- **🇻🇳 Thứ tự không quan trọng** — trả về theo bất kỳ thứ tự nào / Order doesn't matter
- **🇻🇳 Biến thể** — Flip Game II yêu cầu quyết định ai thắng (backtracking) / Flip Game II requires winner determination
- **🇻🇳 Template string** giúp code ngắn gọn / Template strings make code concise

## Solutions

### Solution 1: Linear Scan with Slice

```typescript
/**
 * Scan for "++" and create new string for each position
 * Time: O(n^2)  Space: O(n^2) — n possible moves, each string is O(n)
 */
function generatePossibleNextMoves(currentState: string): string[] {
  const result: string[] = [];

  for (let i = 0; i < currentState.length - 1; i++) {
    if (currentState[i] === "+" && currentState[i + 1] === "+") {
      result.push(currentState.slice(0, i) + "--" + currentState.slice(i + 2));
    }
  }

  return result;
}

// Test cases
console.log(generatePossibleNextMoves("++++")); // ["--++", "+--+", "++--"]
console.log(generatePossibleNextMoves("+")); // []
console.log(generatePossibleNextMoves("+-+")); // []
console.log(generatePossibleNextMoves("++--")); // ["----"]
```

### Solution 2: Array Split and Join

```typescript
/**
 * Convert to array for mutation clarity
 * Time: O(n^2)  Space: O(n^2)
 */
function generatePossibleNextMovesV2(currentState: string): string[] {
  const result: string[] = [];
  const chars = currentState.split("");

  for (let i = 0; i < chars.length - 1; i++) {
    if (chars[i] === "+" && chars[i + 1] === "+") {
      // Flip
      chars[i] = "-";
      chars[i + 1] = "-";
      result.push(chars.join(""));
      // Restore
      chars[i] = "+";
      chars[i + 1] = "+";
    }
  }

  return result;
}

// Test cases
console.log(generatePossibleNextMovesV2("++++")); // ["--++", "+--+", "++--"]
console.log(generatePossibleNextMovesV2("+-+-++")); // ["+-+---"]
```

### Solution 3: Regex-Based Search

```typescript
/**
 * Use regex to find all "++" occurrences, then replace each
 * Time: O(n^2)  Space: O(n^2)
 */
function generatePossibleNextMovesV3(currentState: string): string[] {
  const result: string[] = [];
  const regex = /\+\+/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(currentState)) !== null) {
    const idx = match.index;
    result.push(currentState.substring(0, idx) + "--" + currentState.substring(idx + 2));
    // Handle overlapping: "++" at i=0 and i=1 in "+++"
    regex.lastIndex = idx + 1;
  }

  return result;
}

// Test cases
console.log(generatePossibleNextMovesV3("++++")); // ["--++", "+--+", "++--"]
console.log(generatePossibleNextMovesV3("+++")); // ["--+", "+--"]
console.log(generatePossibleNextMovesV3("-++-")); // ["-+--"] wait, "--−-"
```

## 🔗 Related Problems

| Problem                                                                                                                       | Difficulty | Similarity                     |
| ----------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------ |
| [Flip Game II](https://leetcode.com/problems/flip-game-ii/)                                                                   | 🟡 Medium  | Same game, determine winner    |
| [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/)                                 | 🟡 Medium  | Sliding window pattern finding |
| [Remove All Adjacent Duplicates In String](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/)           | 🟢 Easy    | Adjacent pair manipulation     |
| [Count Substrings That Differ by One Character](https://leetcode.com/problems/count-substrings-that-differ-by-one-character/) | 🟡 Medium  | String position scanning       |
