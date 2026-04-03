---
layout: page
title: "Accounts Merge"
difficulty: Medium
category: Tree-Graph
tags: [Array, Hash Table, String, Depth-First Search, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/accounts-merge"
---

# Accounts Merge / Gộp Tài Khoản

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Smallest String With Swaps](https://leetcode.com/problems/smallest-string-with-swaps) | [Similar String Groups](https://leetcode.com/problems/similar-string-groups)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bộ phận phát hiện gian lận ngân hàng — hai tài khoản cùng email → cùng chủ sở hữu → gộp lại. Union Find quản lý việc "ai cùng nhóm" cực kỳ hiệu quả, như ngân hàng dùng email chung để link tài khoản.

**Pattern Recognition:**

- Signal: "merge groups sharing a common element" + "connectivity" → **Union Find**
- Hai account share email → union chúng lại; email → account index mapping
- Key insight: Map `email → accountIndex`, union accounts sharing same email, then group by root

**Visual — Accounts Merge step-by-step:**

```
Input: [["John","a@j","b@j"], ["John","c@j"], ["John","b@j","c@j"]]

Step 1 — Map email → first owner:
  a@j→0, b@j→0, c@j→1

Step 2 — Process acc[2]: b@j seen at 0 → union(2,0)
                         c@j seen at 1 → union(2,1)
  parent: [0,0,0]  ← all same root

Step 3 — Group emails by root:
  root=0 → {a@j, b@j, c@j} → ["John","a@j","b@j","c@j"] sorted
```

---

## Problem Description

Given `accounts` where `accounts[i][0]` is a name and the rest are emails, merge accounts that share at least one email (they belong to the same person). Return merged accounts with emails sorted; each merged group has the name at index 0.

- Example 1: `[["John","a@j.com","b@j.com"],["John","b@j.com","c@j.com"]]` → `[["John","a@j.com","b@j.com","c@j.com"]]`
- Example 2: `[["Mary","m@m.com"],["John","j@j.com"]]` → no merge, both stay separate

Constraints: `1 <= accounts.length <= 1000`, `2 <= accounts[i].length <= 10`, valid email strings.

---

## 📝 Interview Tips

1. **Clarify**: "Hai account cùng tên nhưng không share email → vẫn là người khác nhau" / Same name but no shared email = different people, do NOT merge
2. **Brute force DFS**: "Build email adjacency graph, DFS để tìm connected components" / Build graph where accounts with shared emails are neighbors, DFS each component
3. **Union Find**: "Map email → owner index, union(account_i, owner) khi gặp email trùng" / Union accounts when same email seen, group emails by root
4. **Key step**: "Sort emails trong mỗi group và đặt tên vào đầu" / Sort emails within each merged group, prepend the name
5. **Edge cases**: "Account chỉ có 1 email (không bao giờ merge), account trùng hoàn toàn" / Single-email accounts never merge unless duplicate
6. **Follow-up**: "Millions of accounts? Distributed Union Find, shard by email domain" / Scale needs distributed partitioning

---

## Solutions

```typescript
/**
 * Solution 1: DFS on email graph — build adjacency by shared emails
 * Time: O(N*K*log(N*K)) — N accounts, K emails; sort dominates
 * Space: O(N*K) — adjacency list and visited set
 */
function accountsMergeDFS(accounts: string[][]): string[][] {
  const emailToAccounts = new Map<string, number[]>();
  for (let i = 0; i < accounts.length; i++) {
    for (let j = 1; j < accounts[i].length; j++) {
      const email = accounts[i][j];
      if (!emailToAccounts.has(email)) emailToAccounts.set(email, []);
      emailToAccounts.get(email)!.push(i);
    }
  }

  const visited = new Set<number>();
  const result: string[][] = [];

  function dfs(idx: number, emails: Set<string>): void {
    if (visited.has(idx)) return;
    visited.add(idx);
    for (let j = 1; j < accounts[idx].length; j++) {
      const email = accounts[idx][j];
      emails.add(email);
      for (const neighbor of emailToAccounts.get(email)!) dfs(neighbor, emails);
    }
  }

  for (let i = 0; i < accounts.length; i++) {
    if (!visited.has(i)) {
      const emails = new Set<string>();
      dfs(i, emails);
      result.push([accounts[i][0], ...[...emails].sort()]);
    }
  }
  return result;
}

/**
 * Solution 2: Union Find — optimal, nearly linear
 * Time: O(N*K*α(N)) ≈ O(N*K) with path compression
 * Space: O(N*K) — email→owner map + parent array
 */
function accountsMerge(accounts: string[][]): string[][] {
  const parent: number[] = Array.from({ length: accounts.length }, (_, i) => i);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(a: number, b: number): void {
    parent[find(a)] = find(b);
  }

  const emailToOwner = new Map<string, number>();
  for (let i = 0; i < accounts.length; i++) {
    for (let j = 1; j < accounts[i].length; j++) {
      const email = accounts[i][j];
      if (emailToOwner.has(email)) union(i, emailToOwner.get(email)!);
      else emailToOwner.set(email, i);
    }
  }

  const groups = new Map<number, Set<string>>();
  for (const [email, owner] of emailToOwner) {
    const root = find(owner);
    if (!groups.has(root)) groups.set(root, new Set());
    groups.get(root)!.add(email);
  }

  const result: string[][] = [];
  for (const [root, emails] of groups) {
    result.push([accounts[root][0], ...[...emails].sort()]);
  }
  return result;
}

// === Test Cases ===
console.log(
  accountsMerge([
    ["John", "a@j.com", "b@j.com"],
    ["John", "b@j.com", "c@j.com"],
    ["Mary", "m@m.com"],
  ]),
);
// [["John","a@j.com","b@j.com","c@j.com"],["Mary","m@m.com"]]
console.log(
  accountsMerge([
    ["Gabe", "Gabe0@m.co", "Gabe3@m.co"],
    ["Kevin", "Kevin3@m.co"],
  ]),
);
// No merge — each stays separate
console.log(accountsMerge([["A", "a@a.com"]]));
// [["A","a@a.com"]]
console.log(
  accountsMerge([
    ["A", "a@a.com"],
    ["A", "a@a.com"],
  ]),
);
// [["A","a@a.com"]] — duplicates merged
```

---

## 🔗 Related Problems

- [Smallest String With Swaps](https://leetcode.com/problems/smallest-string-with-swaps) — Union Find groups characters connected by swaps
- [Similar String Groups](https://leetcode.com/problems/similar-string-groups) — Union Find on similar string pairs
- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — weighted BFS/DFS on ratio graph
- [Minimize Malware Spread](https://leetcode.com/problems/minimize-malware-spread) — Union Find to find most influential node
