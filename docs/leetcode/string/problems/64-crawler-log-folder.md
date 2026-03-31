---
layout: page
title: "Crawler Log Folder"
difficulty: Easy
category: String
tags: [Array, String, Stack]
leetcode_url: "https://leetcode.com/problems/crawler-log-folder"
---

# Crawler Log Folder / Thư Mục Log Của Trình Thu Thập

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Stack / Counter
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Simplify Path](https://leetcode.com/problems/simplify-path) | [Decode String](https://leetcode.com/problems/decode-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống điều hướng thư mục trong terminal — `cd folder` đi sâu vào, `cd ..` lùi một bước, `cd ./` đứng yên. Chỉ cần theo dõi độ sâu hiện tại (depth counter).

**Pattern Recognition:**

- Signal: "navigate file system" + "minimum steps to root" → **Depth counter (không cần Stack thực)**
- Ba loại lệnh: `"../"` giảm depth (nếu > 0), `"./"` không đổi, `"xxx/"` tăng depth
- Key insight: kết quả chính là giá trị depth cuối cùng

**Visual — logs=["d1/","d2/","../","d21/","./"]:**

```
Start: depth=0

"d1/"  → depth=1   (enter d1)
"d2/"  → depth=2   (enter d2)
"../"  → depth=1   (back to d1)
"d21/" → depth=2   (enter d21)
"./"   → depth=2   (stay in d21)

Min ops to return to root = depth = 2 ✅
```

---

## Problem Description

Given a list of filesystem log operations, find the minimum number of operations to go back to the root folder. `"../"` goes up one level (min depth 0), `"./"` stays, `"xxx/"` goes into subfolder `xxx`.

```
Example 1: logs=["d1/","d2/","../","d21/","./"]  → 2
Example 2: logs=["d1/","d2/","./","d3/","../","d31/"]  → 3
Example 3: logs=["d1/","../","../","../"]  → 0  (can't go above root)
```

Constraints: `1 <= logs.length <= 10^3`, each log is a valid folder operation string.

---

## 📝 Interview Tips

1. **Clarify**: "Không thể lên trên root (depth không âm)? Kết quả là depth hiện tại?" / Can't go above root, result = current depth?
2. **Brute force**: "Dùng stack thực sự lưu tên folder" — sau đó trả về `stack.length` / Use actual stack of folder names
3. **Optimize**: "Không cần lưu tên folder, chỉ cần depth counter" / Counter suffices, O(n) time O(1) space
4. **Edge cases**: "Toàn `\"../\"` → 0, toàn `\"d/\"` → n, toàn `\"./\"` → 0" / All up, all down, all stay
5. **Follow-up**: "Simplify Path (LC 71) — tương tự nhưng cần trả về path string thực" / Simplify Path returns the path string
6. **String match**: "`=== \"../\"`" vs `startsWith` — với format cố định, `===` an toàn hơn / Fixed format means === is safe

---

## Solutions

```typescript
/**
 * Solution 1: Stack with folder names
 * Time: O(n) — process each log once
 * Space: O(n) — stack stores folder names
 */
function minOperationsStack(logs: string[]): number {
  const stack: string[] = [];

  for (const log of logs) {
    if (log === "../") {
      if (stack.length > 0) stack.pop();
    } else if (log !== "./") {
      stack.push(log);
    }
  }

  return stack.length;
}

/**
 * Solution 2: Depth Counter (Optimal)
 * Time: O(n) — single pass
 * Space: O(1) — only one integer
 */
function minOperations(logs: string[]): number {
  let depth = 0;

  for (const log of logs) {
    if (log === "../") {
      depth = Math.max(0, depth - 1); // can't go above root
    } else if (log !== "./") {
      depth++; // enter subfolder
    }
    // './' → no change
  }

  return depth;
}

// === Test Cases ===
console.log(minOperations(["d1/", "d2/", "../", "d21/", "./"])); // 2
console.log(minOperations(["d1/", "d2/", "./", "d3/", "../", "d31/"])); // 3
console.log(minOperations(["d1/", "../", "../", "../"])); // 0
console.log(minOperations(["./", "./", "./"])); // 0  — all stay
```

---

## 🔗 Related Problems

- [Simplify Path](https://leetcode.com/problems/simplify-path) — same navigation logic, returns canonical path string
- [Decode String](https://leetcode.com/problems/decode-string) — stack for nested structure processing
- [Remove All Adjacent Duplicates In String](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string) — stack pop/push pattern
- [Valid Parentheses](https://leetcode.com/problems/valid-parentheses) — stack for matching/nesting
