---
layout: page
title: "Remove All Adjacent Duplicates In String"
difficulty: Easy
category: String
tags: [String, Stack]
leetcode_url: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string"
---

# Remove All Adjacent Duplicates In String / Xóa Tất Cả Ký Tự Trùng Lặp Liền Kề

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Zuma Game](https://leetcode.com/problems/zuma-game) | [Remove All Adjacent Duplicates in String II](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chơi trò xếp gạch — nếu gạch mới giống gạch trên cùng của chồng, cả hai biến mất. Nếu không, xếp lên trên. Kết quả là những gì còn lại trong chồng.

**Pattern Recognition:**

- Signal: "remove adjacent pairs" + "repeat until stable" → **Stack (simulate collapse)**
- So sánh ký tự hiện tại với đỉnh stack; nếu bằng → pop (xóa cặp); nếu khác → push
- Key insight: stack tự động xử lý chuỗi phản ứng dây chuyền (chain reactions)

**Visual — s="abbaca":**

```
i=0 'a': stack=[]   → push     stack=[a]
i=1 'b': top=a≠b   → push     stack=[a,b]
i=2 'b': top=b==b  → pop      stack=[a]
i=3 'a': top=a==a  → pop      stack=[]
i=4 'c': stack=[]  → push     stack=[c]
i=5 'a': top=c≠a  → push     stack=[c,a]

Result: "ca" ✅
```

---

## Problem Description

Given string `s`, repeatedly remove all adjacent duplicate character pairs until no more can be removed. Return the final string.

```
Example 1: s="abbaca"   → "ca"
Example 2: s="azxxzy"   → "ay"
Example 3: s="aabbcc"   → ""  (all pairs removed)
```

Constraints: `1 <= s.length <= 10^5`, `s` consists of lowercase letters.

---

## 📝 Interview Tips

1. **Clarify**: "Xóa cặp liền kề cho đến khi không còn cặp nào? Chuỗi rỗng có thể?" / Remove pairs repeatedly until stable? Empty result possible?
2. **Brute force**: "Lặp scan và replace cho đến stable" → O(n²) / Repeat scan-and-replace until no change
3. **Optimize**: "Stack — O(n) vì mỗi ký tự push/pop nhiều nhất một lần" / Stack handles chain reactions in O(n)
4. **Edge cases**: "Không có cặp nào → trả nguyên, toàn cặp → \"\"" / No pairs, all pairs removed
5. **Follow-up**: "Remove k adjacent duplicates (variant II) — track count thay vì chỉ char" / Track (char, count) pairs for k-duplicates
6. **String vs Array**: "Stack dùng array, join cuối → hiệu quả hơn concat string liên tục" / Array.join is O(n), string concat in loop is O(n²)

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — repeat replace until stable
 * Time: O(n^2) — each pass is O(n), up to O(n) passes
 * Space: O(n)
 */
function removeDuplicatesBrute(s: string): string {
  let prev = "";
  while (prev !== s) {
    prev = s;
    s = s.replace(/(.)\1/g, "");
  }
  return s;
}

/**
 * Solution 2: Stack (Optimal)
 * Time: O(n) — each character pushed and popped at most once
 * Space: O(n) — stack stores up to n characters
 */
function removeDuplicates(s: string): string {
  const stack: string[] = [];

  for (const c of s) {
    if (stack.length > 0 && stack[stack.length - 1] === c) {
      stack.pop(); // adjacent duplicate — remove the pair
    } else {
      stack.push(c);
    }
  }

  return stack.join("");
}

/**
 * Solution 3: In-place with write pointer (avoids extra array)
 * Time: O(n) — single pass
 * Space: O(n) — result array (same as stack, but emphasizes pointer style)
 */
function removeDuplicatesInPlace(s: string): string {
  const arr = s.split("");
  let write = 0; // write pointer acts as stack top

  for (let read = 0; read < arr.length; read++) {
    if (write > 0 && arr[write - 1] === arr[read]) {
      write--; // pop
    } else {
      arr[write++] = arr[read]; // push
    }
  }

  return arr.slice(0, write).join("");
}

// === Test Cases ===
console.log(removeDuplicates("abbaca")); // "ca"
console.log(removeDuplicates("azxxzy")); // "ay"
console.log(removeDuplicates("aabbcc")); // ""
console.log(removeDuplicates("abcd")); // "abcd"  — no pairs
```

---

## 🔗 Related Problems

- [Remove All Adjacent Duplicates in String II](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii) — remove k adjacent, track (char, count) pairs
- [Decode String](https://leetcode.com/problems/decode-string) — stack for nested bracket expansion
- [Backspace String Compare](https://leetcode.com/problems/backspace-string-compare) — stack simulation with '#' as backspace
- [Crawler Log Folder](https://leetcode.com/problems/crawler-log-folder) — similar stack-based depth tracking
