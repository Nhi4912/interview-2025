---
layout: page
title: "Design In-Memory File System"
difficulty: Hard
category: Design
tags: [Hash Table, String, Design, Trie, Sorting]
leetcode_url: "https://leetcode.com/problems/design-in-memory-file-system"
---

# Design In-Memory File System / Thiết Kế Hệ Thống File Trong Bộ Nhớ

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 9 companies
> **See also**: [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree) | [Design File System](https://leetcode.com/problems/design-file-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống cây thư mục thực sự — mỗi node là một thư mục hoặc file. Node có hai kiểu con: `children` (subdirectories) và `content` (nếu là file). Duyệt path bằng cách split `/`.

**Pattern Recognition:**

- Hierarchical path lookup → **Trie** (each path segment = one node)
- `ls` = list children or return `[filename]`; `mkdir` = create nodes; `addContent` = set file content

```
mkdir("/a/b/c")    mkdir("/a/b/d")    addContent("/a/b/c/f","hello")
root
└── a
    └── b
        ├── c (file: "hello")
        │   └── f (content="hello")
        └── d
ls("/a/b") → ["c","d"]
ls("/a/b/c/f") → ["f"]
readContent("/a/b/c/f") → "hello"
```

---

## Problem Description

Implement an in-memory file system with four operations:

- `ls(path)` — if path is a file, return `[filename]`; if directory, return sorted list of names
- `mkdir(path)` — create directory (and all parents)
- `addContentToFile(filePath, content)` — create file or append content
- `readContentFromFile(filePath)` — return file's full content

**Example:**

```
ls("/")             → []
mkdir("/a/b/c")
addContentToFile("/a/b/c/d", "hello")
ls("/")             → ["a"]
readContentFromFile("/a/b/c/d") → "hello"
```

**Constraints:** `1 ≤ path.length ≤ 100`, `1 ≤ content.length ≤ 50`, at most 300 calls

---

## 📝 Interview Tips

- 🇻🇳 **Phân biệt file vs directory**: node có `content !== null` thì là file
- 🇬🇧 Distinguish file vs directory: a node with non-null `content` is a file; otherwise a dir
- 🇻🇳 `ls` trên file trả về `[tên file]`, trên thư mục trả về sorted children
- 🇬🇧 `ls` on a file returns `[filename]`; on a directory returns sorted list of child names
- 🇻🇳 `addContentToFile` phải tạo cả intermediate directories nếu chưa có
- 🇬🇧 `addContentToFile` auto-creates all parent directories (same as `mkdir -p`)
- 🇻🇳 Split path bằng `/`, bỏ phần tử rỗng đầu tiên (`"".split("/")[0] === ""`)
- 🇬🇧 `path.split("/").filter(Boolean)` gives clean path segments

---

## Solutions

### Solution 1: Trie Node Implementation

```typescript
/**
 * In-memory file system using a Trie structure
 * Time: ls/mkdir/addContent/readContent all O(L) where L = path depth
 * Space: O(total content + total path nodes)
 */
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  content: string | null = null; // null = directory, string = file
}

class FileSystem {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  private traverse(path: string): TrieNode {
    const parts = path.split("/").filter(Boolean);
    let node = this.root;
    for (const part of parts) {
      if (!node.children.has(part)) {
        node.children.set(part, new TrieNode());
      }
      node = node.children.get(part)!;
    }
    return node;
  }

  ls(path: string): string[] {
    const node = this.traverse(path);
    // If it's a file, return just the filename
    if (node.content !== null) {
      const parts = path.split("/").filter(Boolean);
      return [parts[parts.length - 1]];
    }
    // Directory: return sorted child names
    return [...node.children.keys()].sort();
  }

  mkdir(path: string): void {
    this.traverse(path); // creates nodes along the way
  }

  addContentToFile(filePath: string, content: string): void {
    const node = this.traverse(filePath);
    node.content = (node.content ?? "") + content;
  }

  readContentFromFile(filePath: string): string {
    return this.traverse(filePath).content ?? "";
  }
}

// Test
const fs = new FileSystem();
console.log(fs.ls("/")); // []
fs.mkdir("/a/b/c");
fs.addContentToFile("/a/b/c/d", "hello");
console.log(fs.ls("/")); // ['a']
console.log(fs.readContentFromFile("/a/b/c/d")); // 'hello'
fs.addContentToFile("/a/b/c/d", " world");
console.log(fs.readContentFromFile("/a/b/c/d")); // 'hello world'
console.log(fs.ls("/a/b/c")); // ['d']
console.log(fs.ls("/a/b/c/d")); // ['d']
```

---

## 🔗 Related Problems

- [588. Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system) ← this
- [208. Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree) — foundational Trie
- [1166. Design File System](https://leetcode.com/problems/design-file-system) — simpler path mapping
- [745. Prefix and Suffix Search](https://leetcode.com/problems/prefix-and-suffix-search) — Trie variant
- [642. Design Search Autocomplete System](https://leetcode.com/problems/design-search-autocomplete-system) — Trie + ranking
