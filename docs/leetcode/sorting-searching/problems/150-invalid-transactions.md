---
layout: page
title: "Invalid Transactions"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, String, Sorting]
leetcode_url: "https://leetcode.com/problems/invalid-transactions"
---

# Invalid Transactions / Giao Dịch Không Hợp Lệ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: HashMap + Brute Force
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) | [Longest String Chain](https://leetcode.com/problems/longest-string-chain)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Ngân hàng kiểm tra gian lận: một giao dịch bị đánh dấu không hợp lệ nếu (1) số tiền > $1000, hoặc (2) cùng tên người nhưng thành phố khác trong vòng 60 phút. Nhóm giao dịch theo tên, rồi kiểm tra từng cặp.

```
transactions = ["alice,20,800,mtv","alice,50,100,beijing"]

Group by name: alice → [(20,800,"mtv"), (50,100,"beijing")]

Check alice[0] (20,800,mtv):
  - amount 800 ≤ 1000 ✓
  - vs alice[1]: |50-20|=30 ≤ 60, cities differ (mtv≠beijing) → INVALID ✗

Check alice[1] (50,100,beijing):
  - amount 100 ≤ 1000 ✓
  - vs alice[0]: |20-50|=30 ≤ 60, cities differ → INVALID ✗

Result: both transactions invalid
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Parse trước, check sau** — tách chuỗi thành struct rồi mới logic / parse to struct first, then apply rules cleanly
- 🇻🇳 **Hai điều kiện độc lập** — amount > 1000 OR cross-city trong 60 phút / two independent invalidity conditions
- 🇻🇳 **Group by name** — HashMap<name, list> để chỉ so sánh cùng tên / group by name to avoid comparing different people
- 🇻🇳 **O(n²) per group là OK** — tên thường ít giao dịch, tổng là O(n²) worst case nhưng thực tế nhanh / O(n²) acceptable given typical data
- 🇻🇳 **Mark, don't remove** — đánh dấu invalid rồi collect cuối, tránh concurrent modification / use a flag set instead of removing during iteration
- 🇻🇳 **Return original strings** — đề yêu cầu trả về string gốc, không phải index / return original transaction strings

---

## Solutions

### Solution 1: HashMap Group + Brute Force Check — O(n²)

```typescript
/**
 * Group by name, check each transaction against group members
 * Time: O(n²)  Space: O(n)
 */
function invalidTransactions(transactions: string[]): string[] {
  interface Tx {
    name: string;
    time: number;
    amount: number;
    city: string;
    idx: number;
  }

  const parsed: Tx[] = transactions.map((t, idx) => {
    const [name, time, amount, city] = t.split(",");
    return { name, time: +time, amount: +amount, city, idx };
  });

  // Group by name
  const byName = new Map<string, Tx[]>();
  for (const tx of parsed) {
    if (!byName.has(tx.name)) byName.set(tx.name, []);
    byName.get(tx.name)!.push(tx);
  }

  const invalid = new Set<number>();

  for (const tx of parsed) {
    // Rule 1: amount > 1000
    if (tx.amount > 1000) {
      invalid.add(tx.idx);
      continue;
    }
    // Rule 2: same name, different city, within 60 minutes
    for (const other of byName.get(tx.name)!) {
      if (other.idx !== tx.idx && Math.abs(other.time - tx.time) <= 60 && other.city !== tx.city) {
        invalid.add(tx.idx);
        break;
      }
    }
  }

  return [...invalid].sort((a, b) => a - b).map((i) => transactions[i]);
}

console.log(invalidTransactions(["alice,20,800,mtv", "alice,50,100,beijing"]));
// ["alice,20,800,mtv","alice,50,100,beijing"]
console.log(invalidTransactions(["alice,20,800,mtv", "alice,50,1200,mtv"]));
// ["alice,50,1200,mtv"]
console.log(invalidTransactions(["alice,20,800,mtv", "bob,50,1200,mtv"]));
// ["bob,50,1200,mtv"]
```

### Solution 2: Sort by Time + Sliding Window per Name — O(n log n)

```typescript
/**
 * Sort each name's transactions by time, then sliding window for cross-city check
 * Time: O(n log n)  Space: O(n)
 */
function invalidTransactions2(transactions: string[]): string[] {
  interface Tx {
    name: string;
    time: number;
    amount: number;
    city: string;
    orig: string;
  }

  const parsed: Tx[] = transactions.map((t) => {
    const [name, time, amount, city] = t.split(",");
    return { name, time: +time, amount: +amount, city, orig: t };
  });

  const invalid = new Set<string>();

  // Group by name
  const byName = new Map<string, Tx[]>();
  for (const tx of parsed) {
    if (!byName.has(tx.name)) byName.set(tx.name, []);
    byName.get(tx.name)!.push(tx);
  }

  for (const [, group] of byName) {
    group.sort((a, b) => a.time - b.time);
    for (let i = 0; i < group.length; i++) {
      if (group[i].amount > 1000) {
        invalid.add(group[i].orig);
      }
      // Check window [i+1..] within 60 min
      for (let j = i + 1; j < group.length && group[j].time - group[i].time <= 60; j++) {
        if (group[i].city !== group[j].city) {
          invalid.add(group[i].orig);
          invalid.add(group[j].orig);
        }
      }
    }
  }

  // Preserve original order
  return parsed.filter((tx) => invalid.has(tx.orig)).map((tx) => tx.orig);
}

console.log(invalidTransactions2(["alice,20,800,mtv", "alice,50,100,beijing"]));
// ["alice,20,800,mtv","alice,50,100,beijing"]
console.log(invalidTransactions2(["alice,20,800,mtv", "alice,50,1200,mtv"]));
// ["alice,50,1200,mtv"]
```

---

## 🔗 Related Problems

| Problem                                                                                          | Difficulty | Pattern          |
| ------------------------------------------------------------------------------------------------ | ---------- | ---------------- |
| [Group Anagrams](https://leetcode.com/problems/group-anagrams)                                   | 🟡 Medium  | HashMap Grouping |
| [Find All Duplicates in an Array](https://leetcode.com/problems/find-all-duplicates-in-an-array) | 🟡 Medium  | HashMap          |
| [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words)                       | 🟡 Medium  | HashMap + Sort   |
| [Merge Intervals](https://leetcode.com/problems/merge-intervals)                                 | 🟡 Medium  | Sort + Intervals |
