---
layout: page
title: "Delete Duplicate Folders in System"
difficulty: Hard
category: String
tags: [Array, Hash Table, String, Trie, Hash Function]
leetcode_url: "https://leetcode.com/problems/delete-duplicate-folders-in-system"
---

# Delete Duplicate Folders in System / Xóa Thư Mục Trùng Lặp Trong Hệ Thống

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) | [Word Break II](https://leetcode.com/problems/word-break-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống quét virus trùng lặp trên máy tính — hai thư mục "trùng" nếu cây con của chúng giống hệt nhau. Serialize mỗi cây con thành chuỗi duy nhất, nếu hai node có cùng chuỗi → đánh dấu xóa cả cây con đó.

**Pattern Recognition:**

- Signal: "duplicate subtrees" + "file system" → **Trie + Subtree Serialization**
- Key insight: Build trie từ paths. Post-order serialize mỗi node: `"(child1_name{child1_serial}child2_name{child2_serial})"`. Dùng hashmap đếm tần suất. Nếu count > 1 → đánh dấu xóa.
- Leaf nodes không bị xóa (chỉ xóa nodes với children trùng nhau).

**Visual:**

```
Paths: [a],[a,b],[a,c],[d],[d,a],[d,a,b],[d,a,c]
Trie:
  root
  ├─ a
  │  ├─ b  serial: "(b{})"  → "(b{})"
  │  └─ c  serial: "(c{})"  → "(c{})"
  └─ d
     └─ a
        ├─ b  same as above
        └─ c

a's serial: "{b()c()}"
d/a's serial: "{b()c()}"  ← SAME! → both "a" under root and "a" under "d" marked DELETE
Remaining: root → [d]  only
```

---

## Problem Description

Given a list of folder paths in a file system, delete all folders (and their subfolders) where **two or more** folders have identical non-empty subfolder structures. Return all remaining folder paths. ([LeetCode](https://leetcode.com/problems/delete-duplicate-folders-in-system))

Difficulty: Hard | Acceptance: ~61%

```
Example 1: paths = [["a"],["c"],["d"],["a","b"],["c","b"],["d","a"]]
  → [["d"],["d","a"]]
  "a" and "c" both have child "b" → deleted; "d/a" has no children → kept

Example 2: paths = [["a"],["c"],["a","b"],["c","b"],["a","b","x"],["a","b","x","y"],["w"],["w","y"]]
  → [["c"],["c","b"],["a"],["a","b"]]
```

Constraints:

- `1 <= paths.length <= 2 * 10^4`
- `1 <= paths[i].length <= 500`
- `1 <= paths[i][j].length <= 10`
- All paths are unique, lowercase letters

---

## 📝 Interview Tips

1. **Clarify**: "Leaf nodes không bị xóa? Chỉ xóa khi có subtree trùng không?" / Only delete if subtree structure (not just name) is duplicated.
2. **Approach**: "Build trie, serialize subtrees post-order, count frequencies" / Key 3-step algorithm.
3. **Serialization**: "Serialize theo thứ tự alphabet tên con để đảm bảo canonical form" / Sort children by name for canonical serialization.
4. **Delete**: "Khi mark xóa, không thu thập paths từ node đó trở xuống" / Skip entire subtree when collecting remaining paths.
5. **Edge cases**: "Leaf nodes never deleted (empty children serial = empty string)" / Leaves = empty serial, won't appear in count > 1.
6. **Follow-up**: "Có thể optimize space bằng hashing string thay vì lưu toàn bộ serial?" / Hash subtree serials to reduce memory.

---

## Solutions

```typescript
/**
 * Solution 1: Trie + Post-order Serialization (canonical)
 * Time: O(N · L · log L) — N paths, L average depth, sorting children alphabetically
 * Space: O(N · L) — trie storage
 */
interface TrieNode {
  children: Map<string, TrieNode>;
  serial: string;
  deleted: boolean;
}

function deleteDuplicateFolder(paths: string[][]): string[][] {
  // Step 1: Build trie
  const root: TrieNode = { children: new Map(), serial: "", deleted: false };

  for (const path of paths) {
    let node = root;
    for (const folder of path) {
      if (!node.children.has(folder)) {
        node.children.set(folder, { children: new Map(), serial: "", deleted: false });
      }
      node = node.children.get(folder)!;
    }
  }

  // Step 2: Post-order serialize each subtree, count occurrences
  const serialCount = new Map<string, number>();

  function serialize(node: TrieNode): string {
    if (node.children.size === 0) return "";

    // Sort children for canonical order
    const parts: string[] = [];
    for (const [name, child] of [...node.children.entries()].sort((a, b) =>
      a[0].localeCompare(b[0]),
    )) {
      parts.push(name + "(" + serialize(child) + ")");
    }

    const s = parts.join("");
    node.serial = s;
    serialCount.set(s, (serialCount.get(s) ?? 0) + 1);
    return s;
  }

  serialize(root);

  // Step 3: Mark nodes with duplicate serials for deletion
  function markDeleted(node: TrieNode): void {
    for (const child of node.children.values()) {
      if (child.serial !== "" && (serialCount.get(child.serial) ?? 0) > 1) {
        child.deleted = true;
      } else {
        markDeleted(child);
      }
    }
  }

  markDeleted(root);

  // Step 4: Collect remaining paths (DFS, skip deleted subtrees)
  const result: string[][] = [];

  function collect(node: TrieNode, currentPath: string[]): void {
    for (const [name, child] of node.children) {
      if (!child.deleted) {
        currentPath.push(name);
        result.push([...currentPath]);
        collect(child, currentPath);
        currentPath.pop();
      }
    }
  }

  collect(root, []);
  return result;
}

// === Test Cases ===
console.log(deleteDuplicateFolder([["a"], ["c"], ["d"], ["a", "b"], ["c", "b"], ["d", "a"]]));
// [["d"],["d","a"]]

console.log(
  deleteDuplicateFolder([
    ["a"],
    ["c"],
    ["a", "b"],
    ["c", "b"],
    ["a", "b", "x"],
    ["a", "b", "x", "y"],
    ["w"],
    ["w", "y"],
  ]),
);
// [["c"],["c","b"]] or [["a"],["a","b"]] — order may vary

console.log(deleteDuplicateFolder([["a", "b"], ["c", "d"], ["c"]]));
// [["c"],["c","d"]] — "a/b" has no sibling duplicate, "c/d" lone child ≠ duplicate

console.log(deleteDuplicateFolder([["a"]]));
// [["a"]] — single path, no duplicates

/**
 * Solution 2: Same algorithm — using object instead of class for TrieNode
 * Time: O(N · L · log L), Space: O(N · L)
 * Shows alternative Map-free implementation for interview clarity
 */
function deleteDuplicateFolderV2(paths: string[][]): string[][] {
  // Build trie using plain objects
  type Node = { [child: string]: Node };
  const root: Node = {};

  for (const path of paths) {
    let cur: Node = root;
    for (const f of path) {
      if (!cur[f]) cur[f] = {};
      cur = cur[f];
    }
  }

  // Serialize + count
  const count = new Map<string, number>();
  const serialOf = new Map<object, string>();

  function ser(node: Node): string {
    const keys = Object.keys(node).sort();
    if (keys.length === 0) return "";
    const s = keys.map((k) => k + "{" + ser(node[k]) + "}").join("");
    serialOf.set(node, s);
    count.set(s, (count.get(s) ?? 0) + 1);
    return s;
  }
  ser(root);

  // Collect non-deleted paths
  const res: string[][] = [];
  function dfs(node: Node, path: string[]): void {
    for (const name of Object.keys(node).sort()) {
      const child = node[name];
      const s = serialOf.get(child) ?? "";
      if (s !== "" && (count.get(s) ?? 0) > 1) continue; // duplicate subtree
      path.push(name);
      res.push([...path]);
      dfs(child, path);
      path.pop();
    }
  }
  dfs(root, []);
  return res;
}

// Solution 2 Tests
console.log(deleteDuplicateFolderV2([["a"], ["c"], ["d"], ["a", "b"], ["c", "b"], ["d", "a"]]));
// [["d"],["d","a"]]
console.log(deleteDuplicateFolderV2([["a"]])); // [["a"]]
```

---

## 🔗 Related Problems

| Problem                                                                                                      | Pattern            | Difficulty |
| ------------------------------------------------------------------------------------------------------------ | ------------------ | ---------- |
| [Find Duplicate Subtrees](https://leetcode.com/problems/find-duplicate-subtrees)                             | Tree Serialization | Medium     |
| [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree) | Tree Serialization | Hard       |
| [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree)                     | Trie               | Medium     |
| [Word Break II](https://leetcode.com/problems/word-break-ii)                                                 | Trie + DFS         | Hard       |
