---
layout: page
title: "Clear Digits"
difficulty: Easy
category: String
tags: [String, Stack, Simulation]
leetcode_url: "https://leetcode.com/problems/clear-digits"
---

# Clear Digits / Xóa Chữ Số

🟢 Easy | String, Stack, Simulation

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Giống như xóa từng con số trong văn bản — mỗi chữ số ăn ký tự liền bên trái gần nhất trong một cái stack (chồng đĩa): đặt đĩa vào, số xuất hiện thì lấy đĩa ra.

```
Input:  "cb34"
Stack:  [c] → [c,b] → [c] (3 pops b) → [] (4 pops c)
Output: ""

Input:  "abc"
Stack:  [a] → [a,b] → [a,b,c]
Output: "abc"
```

## Problem Description

You are given a string `s` consisting of lowercase letters and digits. Your task is to clear the string by repeatedly removing the **first digit** and the **closest non-digit character to its left**. Return the resulting string after all digits have been removed.

- **Example 1:** `s = "cb34"` → `"b"` is removed by `3`, `"c"` by `4` → `""`
- **Example 2:** `s = "abc"` → no digits → `"abc"`

## 📝 Interview Tips

- **🇻🇳 Stack thích hợp nhất** / Stack is the perfect data structure — O(n) single pass
- **🇻🇳 Digit gặp** → pop nếu stack không rỗng / If digit encountered → pop if stack non-empty
- **🇻🇳 Non-digit** → push lên stack / Non-digit → push onto stack
- **🇻🇳 Kết quả** = join tất cả phần tử còn lại / Result = join remaining elements
- **🇻🇳 Edge case** → chuỗi chỉ gồm số hoặc chỉ gồm chữ / Only digits or only letters
- **🇻🇳 Không cần xử lý lặp lại** — một lần duyệt là đủ / No need for repeated passes — single scan suffices

## Solutions

### Solution 1: Stack Simulation (Optimal)

```typescript
/**
 * Stack-based simulation
 * Time: O(n)  Space: O(n)
 */
function clearDigits(s: string): string {
  const stack: string[] = [];

  for (const ch of s) {
    if (ch >= "0" && ch <= "9") {
      // Digit removes the closest non-digit to its left
      if (stack.length > 0) stack.pop();
    } else {
      stack.push(ch);
    }
  }

  return stack.join("");
}

// Test cases
console.log(clearDigits("cb34")); // ""
console.log(clearDigits("abc")); // "abc"
console.log(clearDigits("a1b2c3")); // ""
console.log(clearDigits("ab1c2")); // "ac" → no, "a"
console.log(clearDigits("5abc")); // "abc" (digit with no left non-digit)
```

### Solution 2: Two-Pass with Index Marking

```typescript
/**
 * Mark characters to delete, then rebuild string
 * Time: O(n)  Space: O(n)
 */
function clearDigitsV2(s: string): string {
  const deleted = new Array(s.length).fill(false);
  const stack: number[] = []; // store indices of non-deleted non-digits

  for (let i = 0; i < s.length; i++) {
    if (s[i] >= "0" && s[i] <= "9") {
      deleted[i] = true;
      if (stack.length > 0) {
        deleted[stack.pop()!] = true;
      }
    } else {
      stack.push(i);
    }
  }

  return s
    .split("")
    .filter((_, i) => !deleted[i])
    .join("");
}

// Test cases
console.log(clearDigitsV2("cb34")); // ""
console.log(clearDigitsV2("abc")); // "abc"
console.log(clearDigitsV2("a1b2c3")); // ""
```

### Solution 3: Regex / Iterative Replace (Readable but Slow)

```typescript
/**
 * Iterative regex replacement — intuitive but O(n^2)
 * Time: O(n^2)  Space: O(n)
 */
function clearDigitsSlow(s: string): string {
  let result = s;
  while (/[a-z]\d/.test(result)) {
    result = result.replace(/[a-z]\d/, "");
  }
  // Handle leading digits with no letter to their left
  return result.replace(/\d/g, "");
}

// Test cases
console.log(clearDigitsSlow("cb34")); // ""
console.log(clearDigitsSlow("abc")); // "abc"
```

## 🔗 Related Problems

| Problem                                                                                                                           | Difficulty | Similarity          |
| --------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- |
| [Backspace String Compare](https://leetcode.com/problems/backspace-string-compare/)                                               | 🟢 Easy    | Stack simulation    |
| [Remove All Adjacent Duplicates](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/)                         | 🟢 Easy    | Stack pop pattern   |
| [Remove K Digits](https://leetcode.com/problems/remove-k-digits/)                                                                 | 🟡 Medium  | Greedy + Stack      |
| [Minimum String Length After Removing Substrings](https://leetcode.com/problems/minimum-string-length-after-removing-substrings/) | 🟢 Easy    | Stack-based removal |
