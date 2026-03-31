---
layout: page
title: "Make The String Great"
difficulty: Easy
category: String
tags: [String, Stack]
leetcode_url: "https://leetcode.com/problems/make-the-string-great"
---

# Make The String Great / Làm Cho Chuỗi Trở Nên Tuyệt Vời

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Stack (Greedy Removal)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> Giống như chơi trò xếp bài — khi bạn đặt một lá bài, nếu nó "khử" lá bài trên cùng (cùng mặt nhưng khác màu), cả hai đều biến mất. Bạn tiếp tục cho đến khi không còn cặp nào có thể khử nhau.

**Pattern Recognition:**

- Signal: "remove adjacent conflicting pairs" → **Stack**
- Cặp xấu: hai ký tự kề nhau, cùng chữ nhưng khác hoa/thường (ví dụ `'a'` và `'A'`)
- Stack: push ký tự hiện tại; nếu đỉnh stack là "đối lập" → pop thay vì push

**Visual:**

```
s = "leEeetcode"
stack:
  'l' → ['l']
  'e' → ['l','e']
  'E' → top='e', 'E'.lower()='e' → CONFLICT → pop → ['l']
  'e' → ['l','e']
  'e' → ['l','e','e']
  't' → ['l','e','e','t']
  'c' → ['l','e','e','t','c']
  'o','d','e' → ['l','e','e','t','c','o','d','e']
result = "leetcode"
```

## Problem Description

A string is **great** if there are no two adjacent characters `s[i]` and `s[i+1]` that are the same letter in different cases. Remove all such bad pairs repeatedly until no more exist. Return the final great string (could be empty).

- **Example 1**: `s = "leEeetcode"` → `"leetcode"`
- **Example 2**: `s = "abBAcC"` → `""`

**Constraints**: `1 <= s.length <= 100`, `s` contains only English letters.

## 📝 Interview Tips

1. **Clarify**: "Cặp xấu là cùng chữ cái nhưng khác hoa/thường? Chỉ xét kề nhau?" / Same letter, different case, must be adjacent
2. **Approach**: "Dùng stack: nếu đỉnh là 'đối lập' của ký tự hiện tại → pop, ngược lại push" / Stack pop on conflict, push otherwise
3. **Edge cases**: "Chuỗi rỗng → `""`; không có cặp xấu → return s; tất cả đều khử → `""`"
4. **Optimize**: "Stack O(n) time và space — tối ưu cho greedy removal" / One pass with stack is optimal
5. **Test**: `"Aa"` → `""`, `"aA"` → `""`, `"aab"` → `"aab"` (no conflict)
6. **Follow-up**: "Nếu cặp xấu có thể không kề nhau?" / Would need different approach (DP/recursion)

## Solutions

```typescript
/** Solution 1: Brute Force — lặp đi lặp lại cho đến khi không còn thay đổi
 * Time: O(n²) | Space: O(n)
 */
function makeGreatBrute(s: string): string {
  let prev = "";
  let curr = s;
  while (curr !== prev) {
    prev = curr;
    for (let i = 0; i < curr.length - 1; i++) {
      const a = curr[i],
        b = curr[i + 1];
      if (a !== b && a.toLowerCase() === b.toLowerCase()) {
        curr = curr.slice(0, i) + curr.slice(i + 2);
        break;
      }
    }
  }
  return curr;
}

/** Solution 2: Stack — một lần duyệt O(n)
 * Time: O(n) | Space: O(n)
 */
function makeGreat(s: string): string {
  const stack: string[] = [];
  for (const c of s) {
    if (
      stack.length > 0 &&
      stack[stack.length - 1] !== c &&
      stack[stack.length - 1].toLowerCase() === c.toLowerCase()
    ) {
      stack.pop(); // remove conflicting pair
    } else {
      stack.push(c);
    }
  }
  return stack.join("");
}

/** Solution 3: Recursive — xử lý từng cặp bằng đệ quy
 * Time: O(n²) worst | Space: O(n)
 */
function makeGreatRecursive(s: string): string {
  for (let i = 0; i < s.length - 1; i++) {
    if (s[i] !== s[i + 1] && s[i].toLowerCase() === s[i + 1].toLowerCase()) {
      return makeGreatRecursive(s.slice(0, i) + s.slice(i + 2));
    }
  }
  return s;
}

// Test cases
console.log(makeGreat("leEeetcode")); // "leetcode"
console.log(makeGreat("abBAcC")); // ""
console.log(makeGreat("s")); // "s"
console.log(makeGreat("Aa")); // ""
console.log(makeGreat("aab")); // "aab"
```

## 🔗 Related Problems

| Problem                                                                                                                  | Relationship                                     |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| [Remove All Adjacent Duplicates in String](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string)       | Same stack pattern, different conflict condition |
| [Remove All Adjacent Duplicates in String II](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii) | Stack with k-duplicate removal                   |
| [Decode String](https://leetcode.com/problems/decode-string)                                                             | Stack for nested string operations               |
