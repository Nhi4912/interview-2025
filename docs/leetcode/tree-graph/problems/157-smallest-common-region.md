---
layout: page
title: "Smallest Common Region"
difficulty: Medium
category: Tree-Graph
tags: [Array, Hash Table, String, Tree, Depth-First Search]
leetcode_url: "https://leetcode.com/problems/smallest-common-region"
---

# Smallest Common Region / Vùng Chung Nhỏ Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: LCA (Lowest Common Ancestor)
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) | [Accounts Merge](https://leetcode.com/problems/accounts-merge)

---

## 🧠 Intuition / Tư Duy

**Analogy (VI):** Bài toán này là LCA (Lowest Common Ancestor) trên cây không nhị phân. Build map `child→parent` từ danh sách regions. Lấy tổ tiên của region1, rồi đi từ region2 lên cho đến khi gặp tổ tiên chung.

**Analogy (EN):** This is LCA on an N-ary tree represented as lists. Build a `child→parent` map. Collect all ancestors of `region1` in a Set. Walk up from `region2` until hitting an ancestor in that Set.

```
regions: [["Earth","NA","SA"],["NA","US","MX"],["SA","BR","AR"]]
region1="US", region2="BR"

Parent map: NA→Earth, SA→Earth, US→NA, MX→NA, BR→SA, AR→SA

Ancestors of "US": US → NA → Earth → {US, NA, Earth}
Walk from "BR": BR → SA → Earth... first hit in set = ?
  BR not in set, SA not in set, Earth in set → "Earth"?
  Wait: NA is in set! So SA→... Let's check SA: SA not in set.
  Earth is first hit → answer = "Earth"

Actually: walk from "BR": BR, SA, Earth
  "SA" not in ancestors of US
  "Earth" IS in ancestors of US → return "Earth"
  Correct for continent-level
```

---

## 📝 Interview Tips

1. **Parent map / Map cha**: Build `child→parent` bằng cách duyệt từng row — phần tử đầu là parent của tất cả phần tử còn lại / First element of each row is parent of rest
2. **LCA pattern / Nhận dạng LCA**: "Common ancestor" → LCA — chuẩn bị ancestor set của một node, walk up từ node kia
3. **Set for O(1) lookup**: Collect path từ region1 đến root vào Set, walk region2 đến root → O(depth) / Collect one ancestor path as Set, then walk other path
4. **N-ary tree / Cây N nhánh**: Không phải binary tree nhưng LCA logic vẫn giống / Same LCA logic, just N-ary instead of binary
5. **Edge case / Biên**: region1 hoặc region2 có thể là tổ tiên của cái kia / One region may be ancestor of the other — Set approach handles this
6. **Follow-up**: "Nếu cần LCA của nhiều nodes?" → intersect all ancestor sets

---

## Solutions

```typescript
/**
 * Solution 1: Parent Map + Ancestor Set
 * Time: O(N·L + D) — N rows, L cols per row, D = depth for ancestor walks
 * Space: O(N) — parent map + ancestor set
 *
 * Build parent map. Collect ancestors of region1 in Set.
 * Walk from region2 up until we hit the set.
 */
function findSmallestRegion(regions: string[][], region1: string, region2: string): string {
  const parent = new Map<string, string>();

  // Build parent map: row[0] is parent of row[1..n]
  for (const row of regions) {
    for (let i = 1; i < row.length; i++) {
      parent.set(row[i], row[0]);
    }
  }

  // Collect all ancestors of region1 (including itself) into a Set
  const ancestors = new Set<string>();
  let cur: string | undefined = region1;
  while (cur !== undefined) {
    ancestors.add(cur);
    cur = parent.get(cur);
  }

  // Walk up from region2 until hitting an ancestor of region1
  let node: string | undefined = region2;
  while (node !== undefined) {
    if (ancestors.has(node)) return node;
    node = parent.get(node);
  }

  return ""; // should not reach here per problem guarantees
}

/**
 * Solution 2: Two Pointer (walk both paths simultaneously)
 * Time: O(N·L + D) — same complexity
 * Space: O(D) — two ancestor arrays
 *
 * Collect full ancestor paths for both regions. Find last common element.
 * Similar to finding intersection of two linked lists.
 */
function findSmallestRegionV2(regions: string[][], region1: string, region2: string): string {
  const parent = new Map<string, string>();
  for (const row of regions) {
    for (let i = 1; i < row.length; i++) parent.set(row[i], row[0]);
  }

  // Build ancestor paths (root first)
  function getPath(region: string): string[] {
    const path: string[] = [];
    let cur: string | undefined = region;
    while (cur !== undefined) {
      path.push(cur);
      cur = parent.get(cur);
    }
    return path.reverse(); // root first
  }

  const path1 = getPath(region1);
  const path2 = getPath(region2);
  let i = 0;
  // Both paths share the same root; find divergence point
  while (i < path1.length && i < path2.length && path1[i] === path2[i]) i++;
  // LCA is at index i-1
  return path1[i - 1];
}

// === Test Cases ===
const regions = [
  ["Earth", "NA", "SA"],
  ["NA", "US", "MX"],
  ["SA", "BR", "AR"],
  ["US", "NY", "LA"],
];
console.log(findSmallestRegion(regions, "US", "BR")); // "NA" — wrong let me trace
// Actually: ancestors(US) = {US, NA, Earth}; walk BR→SA→Earth. SA not in set, Earth in set → "Earth"
// Hmm, let me re-check. The correct answer for US and BR should be Earth since they're in NA and SA.
console.log(findSmallestRegion(regions, "NY", "LA")); // "US"
console.log(findSmallestRegion(regions, "NY", "AR")); // "Earth"
console.log(
  findSmallestRegion(
    [
      ["Earth", "NA", "SA"],
      ["NA", "US"],
      ["SA", "BR"],
    ],
    "US",
    "BR",
  ),
); // "Earth"

console.log(findSmallestRegionV2(regions, "NY", "LA")); // "US"
console.log(findSmallestRegionV2(regions, "NY", "AR")); // "Earth"
```

---

## 🔗 Related Problems

| Problem                                                                                                                                                | Pattern    | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------- |
| [LCA of Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree)                                                            | LCA        | 🟡 Medium  |
| [LCA of Deepest Leaves](https://leetcode.com/problems/lowest-common-ancestor-of-deepest-leaves)                                                        | DFS LCA    | 🟡 Medium  |
| [Accounts Merge](https://leetcode.com/problems/accounts-merge)                                                                                         | Union Find | 🟡 Medium  |
| [Step-By-Step Directions From a Binary Tree Node to Another](https://leetcode.com/problems/step-by-step-directions-from-a-binary-tree-node-to-another) | LCA + Path | 🟡 Medium  |
