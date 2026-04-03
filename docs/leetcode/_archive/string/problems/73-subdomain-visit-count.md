---
layout: page
title: "Subdomain Visit Count"
difficulty: Medium
category: String
tags: [Array, Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/subdomain-visit-count"
---

# Subdomain Visit Count / Đếm Lượt Truy Cập Subdomain

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống đếm lượt xem trang web — mỗi lượt vào `discuss.leetcode.com` cũng tính cho `leetcode.com` và `com`. Tách domain theo dấu `.`, cộng dồn count cho tất cả suffixes.

**Pattern Recognition:**

- Parse "count domain" → tách thành count và domain
- Với mỗi domain, tìm tất cả suffix subdomains (split by '.', take suffix slices)
- Dùng Map để cộng dồn count

```
cpdomains = ["9001 discuss.leetcode.com"]

count=9001, domain="discuss.leetcode.com"
suffixes:
  "discuss.leetcode.com" → +9001
  "leetcode.com"         → +9001
  "com"                  → +9001

cpdomains = ["900 google.mail.com", "50 yahoo.com"]
→ "google.mail.com": 900
→ "mail.com": 900
→ "com": 900+50=950
→ "yahoo.com": 50

Output: ["900 google.mail.com","900 mail.com","950 com","50 yahoo.com"]
```

---

## Problem Description

A **count-paired domain** like `"9001 discuss.leetcode.com"` means `discuss.leetcode.com` was visited 9001 times. Return the visit count for every subdomain (including parent domains).

**Examples:**

- `["9001 discuss.leetcode.com"]` → `["9001 discuss.leetcode.com","9001 leetcode.com","9001 com"]`
- `["900 google.mail.com","50 yahoo.com","1 intel.mail.com","5 wiki.org"]` → counts for all subdomains

**Constraints:** `1 ≤ cpdomains.length ≤ 100`, `1 ≤ count ≤ 10^4`

---

## 📝 Interview Tips

- 🇻🇳 Tách `" "` để lấy count và domain, tách `"."` để lấy các subdomain levels
- 🇺🇸 For domain `a.b.c`, subdomains are `a.b.c`, `b.c`, `c` — use `indexOf('.')` loop
- 🇻🇳 Map key là domain string, value là tổng count — đơn giản
- 🇺🇸 Build result: `map.entries()` → format as `"count domain"`
- 🇻🇳 Không cần sort — output order doesn't matter
- 🇺🇸 Alternative: split by '.' and rejoin from each index to end

---

## Solutions

### Solution 1 — String Split Approach

```typescript
/**
 * Parse each entry, generate all suffix subdomains, accumulate counts
 * Time: O(N * L) — N entries, L = max domain length
 * Space: O(N * L) — hash map entries
 */
function subdomainVisits(cpdomains: string[]): string[] {
  const counts = new Map<string, number>();

  for (const entry of cpdomains) {
    const spaceIdx = entry.indexOf(" ");
    const count = parseInt(entry.slice(0, spaceIdx));
    const domain = entry.slice(spaceIdx + 1);

    // Add count to domain and all its parent domains
    counts.set(domain, (counts.get(domain) ?? 0) + count);

    let dotIdx = domain.indexOf(".");
    while (dotIdx !== -1) {
      const sub = domain.slice(dotIdx + 1);
      counts.set(sub, (counts.get(sub) ?? 0) + count);
      dotIdx = domain.indexOf(".", dotIdx + 1);
    }
  }

  return Array.from(counts.entries()).map(([d, c]) => `${c} ${d}`);
}
```

### Solution 2 — Split by '.' + Rejoin (Cleaner)

```typescript
/**
 * Split domain by '.', rejoin from each index to generate all subdomains
 * Time: O(N * L), Space: O(N * L)
 */
function subdomainVisits2(cpdomains: string[]): string[] {
  const counts = new Map<string, number>();

  for (const entry of cpdomains) {
    const [countStr, domain] = entry.split(" ");
    const count = parseInt(countStr);
    const parts = domain.split(".");

    // Generate all suffix subdomains
    for (let i = 0; i < parts.length; i++) {
      const sub = parts.slice(i).join(".");
      counts.set(sub, (counts.get(sub) ?? 0) + count);
    }
  }

  return Array.from(counts.entries()).map(([d, c]) => `${c} ${d}`);
}

// Test cases
console.log(subdomainVisits(["9001 discuss.leetcode.com"]));
// ["9001 discuss.leetcode.com","9001 leetcode.com","9001 com"]

console.log(
  subdomainVisits(["900 google.mail.com", "50 yahoo.com", "1 intel.mail.com", "5 wiki.org"]),
);
// ["901 mail.com","50 yahoo.com","900 google.mail.com","5 wiki.org","951 com","1 intel.mail.com","5 org"]

console.log(subdomainVisits2(["9001 discuss.leetcode.com"]));
// same output as above
```

---

## 🔗 Related Problems

- [49 - Group Anagrams](https://leetcode.com/problems/group-anagrams/) — group by computed key
- [347 - Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) — frequency map + sort
- [692 - Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words/) — freq map with string keys
- [1436 - Destination City](https://leetcode.com/problems/destination-city/) — set/map string lookup
