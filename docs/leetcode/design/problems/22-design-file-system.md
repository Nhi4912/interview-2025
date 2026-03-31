---
layout: page
title: "Design File System"
difficulty: Medium
category: Design
tags: [Hash Table, String, Design, Trie]
leetcode_url: "https://leetcode.com/problems/design-file-system"
---

# Design File System / Thiết Kế Hệ Thống File

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Trie / HashMap
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree) | [Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống hệ thống thư mục trên máy tính — đường dẫn `/a/b/c` phải tạo từng cấp theo thứ tự. Không thể tạo `/a/b/c` nếu `/a/b` chưa tồn tại.

**Pattern Recognition:**

- Signal: "hierarchical paths" + "prefix validation" → **Trie hoặc HashMap**
- Key insight: split path bằng `/`, kiểm tra parent tồn tại trước khi tạo leaf
- HashMap approach: lưu `"/a/b" → value`; kiểm tra parent = `path.lastIndexOf('/')` substring

**Visual — createPath("/leet/code", 1):**

```
Step 1: split → ["leet", "code"]
Step 2: parent = "/leet"  → must exist in map
Step 3: "/leet/code" not in map? → OK to create
         map["/leet/code"] = 1  ✅

createPath("/leet/code", 2) → false  (already exists)
createPath("/c/d", 1)       → false  (parent "/c" not in map)

get("/leet/code") → 1
get("/leet")      → 1  (from createPath("/leet", 1) earlier)
```

---

## Problem Description

Implement a file system that creates paths and stores integer values. ([LeetCode #1166](https://leetcode.com/problems/design-file-system))

Difficulty: Medium | Acceptance: 64.1%

- `createPath(path, value)` → `true` if path is newly created; `false` if path already exists or parent doesn't exist
- `get(path)` → stored value, or `-1` if path doesn't exist

Paths are absolute (start with `/`), components contain only lowercase letters/digits, no trailing slash.

**Example:**

```
createPath("/leet", 1)       → true
createPath("/leet/code", 2)  → true
get("/leet")                 → 1
get("/leet/code")            → 2
createPath("/c/d", 1)        → false  (parent "/c" absent)
get("/c")                    → -1
```

Constraints: `2 ≤ path.length ≤ 100`, `1 ≤ value ≤ 10^9`, up to `10^4` calls

---

## 📝 Interview Tips

1. **Clarify**: "Path có trailing slash không? Parent phải tồn tại không?" / No trailing slash; parent must exist
2. **Root path**: "Root `/` luôn tồn tại — cần pre-populate map với `{'/': -1}`" / Pre-seed root to simplify parent lookup
3. **Parent extraction**: "`path.substring(0, path.lastIndexOf('/'))` → parent; dùng `||` cho root" / One-liner parent extraction
4. **Create vs get**: "createPath fail nếu path đã tồn tại HOẶC parent chưa tồn tại" / Two failure conditions
5. **Trie vs HashMap**: "HashMap đơn giản hơn, đủ dùng; Trie tốt khi cần prefix traversal" / HashMap is simpler and sufficient here
6. **Follow-up**: "Cần list files trong folder? → Trie hoặc lưu children set" / Directory listing needs Trie or children map

---

## Solutions

```typescript
/**
 * Solution 1: HashMap with parent-path validation (Optimal)
 * Time: O(L) per operation — L = path length for split/join
 * Space: O(N*L) — N paths each of length L
 */
class FileSystem {
  private map: Map<string, number>;

  constructor() {
    // Pre-seed root so parent check works uniformly
    this.map = new Map([["/", -1]]);
  }

  createPath(path: string, value: number): boolean {
    if (this.map.has(path)) return false; // already exists

    // Find parent: everything before the last "/"
    const lastSlash = path.lastIndexOf("/");
    const parent = lastSlash === 0 ? "/" : path.substring(0, lastSlash);

    if (!this.map.has(parent)) return false; // parent missing

    this.map.set(path, value);
    return true;
  }

  get(path: string): number {
    return this.map.get(path) ?? -1;
  }
}

// === Test Cases ===
const fs1 = new FileSystem();
console.log(fs1.createPath("/leet", 1)); // true
console.log(fs1.createPath("/leet/code", 2)); // true
console.log(fs1.get("/leet")); // 1
console.log(fs1.get("/leet/code")); // 2
console.log(fs1.createPath("/c/d", 1)); // false (parent "/c" absent)
console.log(fs1.get("/c")); // -1

/**
 * Solution 2: Trie-based approach
 * Time: O(L) per operation  — traverse trie node by node
 * Space: O(N*L) — same asymptotically, but each node is an object
 */
interface TrieNode {
  children: Map<string, TrieNode>;
  value: number;
}

class FileSystem2 {
  private root: TrieNode = { children: new Map(), value: -1 };

  createPath(path: string, value: number): boolean {
    const parts = path.split("/").filter(Boolean); // remove empty strings
    let node = this.root;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!node.children.has(part)) return false; // parent missing
      node = node.children.get(part)!;
    }

    const leaf = parts[parts.length - 1];
    if (node.children.has(leaf)) return false; // already exists

    node.children.set(leaf, { children: new Map(), value });
    return true;
  }

  get(path: string): number {
    const parts = path.split("/").filter(Boolean);
    let node = this.root;
    for (const part of parts) {
      if (!node.children.has(part)) return -1;
      node = node.children.get(part)!;
    }
    return node.value;
  }
}

const fs2 = new FileSystem2();
console.log(fs2.createPath("/a", 1)); // true
console.log(fs2.createPath("/a/b", 2)); // true
console.log(fs2.get("/a/b")); // 2
console.log(fs2.createPath("/a/b", 3)); // false (already exists)
```

---

## 🔗 Related Problems

- [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree) — core Trie operations
- [Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system) — full filesystem with ls/mkdir/addContent
- [Map Sum Pairs](https://leetcode.com/problems/map-sum-pairs) — Trie with aggregation
- [Implement Trie II (Prefix Tree)](https://leetcode.com/problems/implement-trie-ii-prefix-tree) — Trie with count tracking
- [Design File System — LeetCode](https://leetcode.com/problems/design-file-system) — problem page
