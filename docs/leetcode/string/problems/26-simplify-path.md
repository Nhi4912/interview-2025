---
layout: page
title: "Simplify Path"
difficulty: Medium
category: String
tags: [String, Stack]
leetcode_url: "https://leetcode.com/problems/simplify-path"
---

# Simplify Path / Đơn Giản Hóa Đường Dẫn

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack
> **Frequency**: ⭐ Tier 2 — Gặp ở 22+ companies

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Giống như điều hướng trong cửa sổ File Explorer — khi bạn click vào một thư mục, nó được đẩy vào "breadcrumb". Khi bạn click `..` (quay lại), thư mục cuối bị gỡ ra. Đường dẫn cuối cùng là danh sách thư mục còn lại trong stack.

**Pattern Recognition:**

- Signal: "navigate directories" + "resolve .." → **Stack**
- Split path bởi `/`, xử lý từng component:
  - Bỏ qua: empty string, `.`
  - Pop stack: `..` (nếu stack không rỗng)
  - Push vào stack: tên thư mục hợp lệ khác
- Kết quả: `'/' + stack.join('/')`

**Visual — path = "/home//foo/../bar/":**

```
Split by '/': ["", "home", "", "foo", "..", "bar", ""]

Component  Action         Stack
""      → skip          []
"home"  → push          ["home"]
""      → skip          ["home"]
"foo"   → push          ["home", "foo"]
".."    → pop           ["home"]
"bar"   → push          ["home", "bar"]
""      → skip          ["home", "bar"]

Result: "/" + "home/bar" = "/home/bar" ✅
```

---

## Problem Description

Cho Unix-style absolute path, chuyển đổi thành canonical path. Canonical path: bắt đầu bằng `/`, không có trailing slash, không có `.` hay `..`, không có double slashes. ([LeetCode 71](https://leetcode.com/problems/simplify-path))

Difficulty: Medium | Acceptance: 47.9%

```
Example 1: "/home/"          → "/home"
Example 2: "/../"            → "/"   (không thể vượt ra ngoài root)
Example 3: "/home//foo/"     → "/home/foo"
Example 4: "/a/./b/../../c/" → "/c"
```

Constraints:

- `1 <= path.length <= 3000`
- `path` chứa chữ cái, `.`, `/`, `_`, chữ số
- `path` bắt đầu bằng `/`

---

## 📝 Interview Tips

1. **Clarify**: "Path có chứa ký tự đặc biệt nào ngoài `.` và `..`?" / Any special components beyond `.` and `..`?
2. **Split trick**: `path.split('/')` sinh ra empty strings khi có `//` hoặc trailing `/` — phải filter" / Split creates empty strings — must handle them
3. **Root edge**: "`..` ở root không làm gì (stack rỗng, không pop)" / `..` at root is a no-op
4. **Reconstruct**: "Join với `'/'` và thêm leading `/`" / Join with `/` and prepend `/`
5. **Edge case**: `"/"` → split → `["", ""]` → stack rỗng → return `"/"` / Root path gives empty stack
6. **Follow-up**: "Nếu path là relative (không bắt đầu bằng `/`)?" / What if path is relative?

---

## Solutions

```typescript
/**
 * Solution 1: Split and Process  ← OPTIMAL (also the natural approach)
 * Name: Stack-based Path Resolution
 * Time: O(n) — split + single pass
 * Space: O(n) — stack holds at most n/2 components
 */
function simplifyPath(path: string): string {
  const stack: string[] = [];

  for (const part of path.split("/")) {
    if (part === "" || part === ".") {
      // Skip empty (from // or trailing /) and current-dir marker
      continue;
    } else if (part === "..") {
      // Go up one directory — pop if possible
      if (stack.length > 0) stack.pop();
    } else {
      // Valid directory name — push
      stack.push(part);
    }
  }

  return "/" + stack.join("/");
}

/**
 * Solution 2: Manual Parsing (without split)
 * Name: Index-based Parsing
 * Time: O(n)
 * Space: O(n)
 */
function simplifyPathManual(path: string): string {
  const stack: string[] = [];
  let i = 0;
  const n = path.length;

  while (i < n) {
    // Skip slashes
    while (i < n && path[i] === "/") i++;
    // Read component
    let start = i;
    while (i < n && path[i] !== "/") i++;
    const part = path.slice(start, i);

    if (part === "" || part === ".") continue;
    else if (part === "..") {
      if (stack.length > 0) stack.pop();
    } else stack.push(part);
  }

  return "/" + stack.join("/");
}

// === Test Cases ===
console.log(simplifyPath("/home/")); // "/home"
console.log(simplifyPath("/../")); // "/"
console.log(simplifyPath("/home//foo/")); // "/home/foo"
console.log(simplifyPath("/a/./b/../../c/")); // "/c"
console.log(simplifyPath("/")); // "/"
console.log(simplifyPath("/a/b/c/../..")); // "/a"
```

---

## 🔗 Related Problems

| Problem                                                                                    | Relationship                          |
| ------------------------------------------------------------------------------------------ | ------------------------------------- |
| [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii)                   | Stack-based string processing         |
| [Decode String](https://leetcode.com/problems/decode-string)                               | Stack for nested structure            |
| [Mini Parser](https://leetcode.com/problems/mini-parser)                                   | Stack for nested parsing              |
| [Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system) | Full file system with path resolution |
| [Basic Calculator](https://leetcode.com/problems/basic-calculator)                         | Stack for expression evaluation       |
