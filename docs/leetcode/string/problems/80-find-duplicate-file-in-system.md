---
layout: page
title: "Find Duplicate File in System"
difficulty: Medium
category: String
tags: [Array, Hash Table, String]
leetcode_url: "https://leetcode.com/problems/find-duplicate-file-in-system"
---

# Find Duplicate File in System / Tìm File Trùng Lặp Trong Hệ Thống

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map + String Parsing
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) | [Longest String Chain](https://leetcode.com/problems/longest-string-chain)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống kiểm tra file trùng nội dung trên ổ cứng — ta không so sánh từng đôi file mà nhóm file theo nội dung bằng hash map, sau đó lấy các nhóm có từ 2 file trở lên.

**Pattern Recognition:**

- Signal: "group by content" → **Hash Map** với key = nội dung, value = list đường dẫn
- Key insight: parse chuỗi `"root/dir file1.txt(content1) file2.txt(content2)"` → extract dir + filename + content

**Visual — String Parsing:**

```
"root/dir file1.txt(content1) file2.txt(content2)"
  ↓ split(" ")
  ["root/dir", "file1.txt(content1)", "file2.txt(content2)"]
  dir = "root/dir"
  file: "file1.txt(content1)"
    name    = "file1.txt"
    content = "content1"
    path    = "root/dir/file1.txt"

contentMap["content1"] → ["root/dir/file1.txt", ...]
```

---

## Problem Description

Given a list of directory paths (each encoding dir + files with content), find all groups of files that have the **same content**. Return groups with ≥ 2 files. ([LeetCode 609](https://leetcode.com/problems/find-duplicate-file-in-system))

**Example 1:** `["root/a 1.txt(abcd) 2.txt(efgh)","root/c 3.txt(abcd)","root/c/d 4.txt(efgh)"]` → `[["root/a/2.txt","root/c/d/4.txt"],["root/a/1.txt","root/c/3.txt"]]`
**Example 2:** `["root/a 1.txt(abcd)","root/c 3.txt(efgh)"]` → `[]`

Constraints: File content is non-empty; file names and directories contain alphanumeric characters only

---

## 📝 Interview Tips

1. **Clarify**: "Cùng tên file nhưng khác đường dẫn — có tính không?" / Same filename different path: yes, compare by content not name
2. **Brute force**: "So sánh từng đôi file O(n²·L) → quá chậm" / O(n²) pairwise comparison is slow
3. **Optimize**: "Group by content với hash map → O(n·L) total" / Hash map groups in one pass
4. **Edge cases**: "Chỉ có 1 file với content đó → không đưa vào kết quả" / Groups with < 2 files are excluded
5. **Follow-up (interview favorite)**: "Nếu file rất lớn?" → dùng hash của content (MD5/SHA) thay vì full content làm key
6. **Complexity**: "O(n·L) time and space — n paths, L average path length" / Linear in total chars

---

## Solutions

```typescript
/**
 * Solution 1: Hash Map grouping
 * Time: O(n · L) — parse each path entry of average length L
 * Space: O(n · L) — store all paths grouped by content
 */
function findDuplicate(paths: string[]): string[][] {
  const contentMap = new Map<string, string[]>();

  for (const path of paths) {
    const parts = path.split(" ");
    const dir = parts[0];

    for (let i = 1; i < parts.length; i++) {
      const parenIdx = parts[i].indexOf("(");
      const fileName = parts[i].slice(0, parenIdx);
      const content = parts[i].slice(parenIdx + 1, -1); // remove ( and )
      const fullPath = `${dir}/${fileName}`;

      if (!contentMap.has(content)) contentMap.set(content, []);
      contentMap.get(content)!.push(fullPath);
    }
  }

  const result: string[][] = [];
  for (const group of contentMap.values()) {
    if (group.length >= 2) result.push(group);
  }

  return result;
}

/**
 * Solution 2: Same approach with destructuring for clarity
 * Time: O(n · L)
 * Space: O(n · L)
 */
function findDuplicateClean(paths: string[]): string[][] {
  const map = new Map<string, string[]>();

  for (const entry of paths) {
    const [dir, ...files] = entry.split(" ");
    for (const file of files) {
      const match = file.match(/^(.+)\((.+)\)$/);
      if (!match) continue;
      const [, name, content] = match;
      const arr = map.get(content) ?? [];
      arr.push(`${dir}/${name}`);
      map.set(content, arr);
    }
  }

  return [...map.values()].filter((g) => g.length >= 2);
}

// === Test Cases ===
console.log(
  findDuplicate(["root/a 1.txt(abcd) 2.txt(efgh)", "root/c 3.txt(abcd)", "root/c/d 4.txt(efgh)"]),
);
// → [["root/a/1.txt","root/c/3.txt"],["root/a/2.txt","root/c/d/4.txt"]]

console.log(findDuplicate(["root/a 1.txt(abcd)", "root/c 3.txt(efgh)"]));
// → []
```

---

## 🔗 Related Problems

| Problem                                                                                            | Difficulty | Pattern              |
| -------------------------------------------------------------------------------------------------- | ---------- | -------------------- |
| [Group Anagrams](https://leetcode.com/problems/group-anagrams)                                     | 🟡 Medium  | Hash Map Grouping    |
| [Find All Duplicates in an Array](https://leetcode.com/problems/find-all-duplicates-in-an-array)   | 🟡 Medium  | Hash / Index Marking |
| [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words)                         | 🟡 Medium  | Hash Map + Sort      |
| [Subdomain Visit Count](https://leetcode.com/problems/subdomain-visit-count)                       | 🟡 Medium  | Hash Map             |
| [Directory Find Duplicate — LeetCode](https://leetcode.com/problems/find-duplicate-file-in-system) | 🟡 Medium  | String Parsing       |
