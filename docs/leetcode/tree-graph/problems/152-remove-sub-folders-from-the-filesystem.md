---
layout: page
title: "Remove Sub-Folders from the Filesystem"
difficulty: Medium
category: Tree-Graph
tags: [Array, String, Depth-First Search, Trie]
leetcode_url: "https://leetcode.com/problems/remove-sub-folders-from-the-filesystem"
---

# Remove Sub-Folders from the Filesystem / Xóa Thư Mục Con Khỏi Hệ Thống File

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sort + Prefix Check / Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system) | [Implement Trie](https://leetcode.com/problems/implement-trie-prefix-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy (VI):** Sắp xếp thư mục theo alphabet. Nếu folder hiện tại bắt đầu bằng `prev + "/"` → nó là subfolder, bỏ qua. Ngược lại, thêm vào kết quả và cập nhật `prev`.

**Analogy (EN):** Sort lexicographically. A folder is a sub-folder of another iff it starts with `parent + "/"`. After sorting, each folder's parent (if any) will immediately precede it.

```
Input: ["/a","/a/b","/c/d","/c/d/e","/c/f"]
Sorted: ["/a", "/a/b", "/c/d", "/c/d/e", "/c/f"]

"/a"    → new root, result=["/a"],          prev="/a"
"/a/b"  → starts with "/a/" → subfolder, skip
"/c/d"  → new root, result=["/a","/c/d"],   prev="/c/d"
"/c/d/e"→ starts with "/c/d/" → skip
"/c/f"  → does NOT start with "/c/d/", new root → add
```

---

## 📝 Interview Tips

1. **Key insight / Mấu chốt**: Sau khi sort, sub-folder luôn xuất hiện ngay sau parent của nó / After sort, a sub-folder always follows its parent immediately
2. **Prefix trick / Mẹo prefix**: Phải check `prev + "/"` chứ không phải `prev` alone — "/ab" không phải sub-folder của "/a" / Must append "/" to avoid false matches like "/ab" under "/a"
3. **Sort complexity / Độ phức tạp sort**: O(N·L·log N) với L là độ dài trung bình / O(N·L·logN) for sort step
4. **Trie alt / Dùng Trie**: Trie hiệu quả hơn nếu query nhiều lần / Trie is better for repeated prefix queries
5. **Edge case / Biên**: Input đã sorted? → solution vẫn đúng / Algorithm works even if pre-sorted
6. **Follow-up**: "Nếu muốn biết folder nào là sub-folder?" → Trie approach tracks this naturally

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Prefix Check
 * Time: O(N·L·log N) — sort dominates; L = avg folder length
 * Space: O(N·L) — output array
 *
 * Sort rồi duyệt tuyến tính: skip nếu bắt đầu bằng prev + "/".
 */
function removeSubfolders(folder: string[]): string[] {
  folder.sort(); // lexicographic sort
  const result: string[] = [];
  let prev = "";

  for (const f of folder) {
    // f is NOT a sub-folder if it doesn't start with prev + "/"
    if (prev === "" || !f.startsWith(prev + "/")) {
      result.push(f);
      prev = f;
    }
    // else: f starts with prev + "/" → subfolder, skip
  }
  return result;
}

/**
 * Solution 2: Trie
 * Time: O(N·L) — insert + search each folder
 * Space: O(N·L) — trie nodes
 *
 * Build trie splitting on '/'. Mark end-of-folder nodes.
 * During DFS: if we hit an end node, stop (all descendants are sub-folders).
 */
function removeSubfolderssTrie(folder: string[]): string[] {
  interface TrieNode {
    children: Map<string, TrieNode>;
    isEnd: boolean;
  }
  const newNode = (): TrieNode => ({ children: new Map(), isEnd: false });
  const root = newNode();

  // Insert all folders into trie
  for (const f of folder) {
    const parts = f.split("/").filter((p) => p !== ""); // split and remove empty ""
    let node = root;
    for (const part of parts) {
      if (!node.children.has(part)) node.children.set(part, newNode());
      node = node.children.get(part)!;
    }
    node.isEnd = true;
  }

  // DFS to collect root folders (stop when isEnd is true)
  const result: string[] = [];
  function dfs(node: TrieNode, path: string): void {
    if (node.isEnd) {
      result.push(path);
      return; // skip all sub-folders below this node
    }
    for (const [part, child] of node.children) {
      dfs(child, path + "/" + part);
    }
  }
  dfs(root, "");
  return result;
}

// === Test Cases ===
console.log(removeSubfolders(["/a", "/a/b", "/c/d", "/c/d/e", "/c/f"]));
// ["/a","/c/d","/c/f"]

console.log(removeSubfolders(["/a", "/a/b/c", "/a/b/d"]));
// ["/a"]

console.log(removeSubfolders(["/a/b/c", "/a/b/ca", "/a/b/d"]));
// ["/a/b/c","/a/b/ca","/a/b/d"]  ← "/a/b/ca" is NOT sub of "/a/b/c"

console.log(removeSubfolderssTrie(["/a", "/a/b", "/c/d", "/c/d/e", "/c/f"]));
// ["/a","/c/d","/c/f"] (order may vary)
```

---

## 🔗 Related Problems

| Problem                                                                              | Pattern     | Difficulty |
| ------------------------------------------------------------------------------------ | ----------- | ---------- |
| [Implement Trie](https://leetcode.com/problems/implement-trie-prefix-tree)           | Trie        | 🟡 Medium  |
| [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system) | Trie        | 🟡 Medium  |
| [Replace Words](https://leetcode.com/problems/replace-words)                         | Trie Prefix | 🟡 Medium  |
| [Concatenated Words](https://leetcode.com/problems/concatenated-words)               | Trie + DFS  | 🔴 Hard    |
