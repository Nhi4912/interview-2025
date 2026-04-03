---
layout: page
title: "Search Suggestions System"
difficulty: Medium
category: Sorting-Searching
tags: [Array, String, Binary Search, Trie, Sorting]
leetcode_url: "https://leetcode.com/problems/search-suggestions-system"
---

# Search Suggestions System / Hệ Thống Gợi Ý Tìm Kiếm

> **Track**: Sorting & Searching | **Difficulty**: 🟡 Medium | **Pattern**: Sort + Binary Search / Trie
> **Frequency**: 📗 Tier 2 — Gặp ở 20+ companies (Amazon, Google, Microsoft)
> **See also**: [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree) | [Design Search Autocomplete System](https://leetcode.com/problems/design-search-autocomplete-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống thanh tìm kiếm Google — mỗi lần bạn gõ thêm một ký tự, hệ thống gợi ý 3 sản phẩm khớp prefix. Nếu sort sản phẩm theo từ điển trước, những sản phẩm có cùng prefix sẽ liền kề nhau — dùng binary search tìm vị trí bắt đầu, rồi lấy tối đa 3 phần tử tiếp theo.

**Pattern Recognition:**

- Signal: "prefix matching", "top-3 lexicographic suggestions" → **Sort + Binary Search** or **Trie**
- Sort products → for each prefix, `bisect_left` tìm first product ≥ prefix
- Check if candidate starts with prefix, take up to 3

**Visual — products=["mobile","moneypot","monitor","mouse","mousepad"], searchWord="mouse":**

```
Sorted: ["mobile","moneypot","monitor","mouse","mousepad"]

prefix="m":     all 5 match → ["mobile","moneypot","monitor"]
prefix="mo":    all 5 match → ["mobile","moneypot","monitor"]
prefix="mou":   ["mouse","mousepad"] → only 2
prefix="mous":  ["mouse","mousepad"]
prefix="mouse": ["mouse","mousepad"]
```

---

## Problem Description

Given an array of `products` and a `searchWord`, design a system that suggests at most 3 product names from `products` after each character of `searchWord` is typed. Suggested products should have a common prefix with `searchWord`. If more than 3 products exist with a common prefix, return the 3 lexicographically minimum products.

```
Example 1: products=["mobile","moneypot","monitor","mouse","mousepad"], searchWord="mouse"
  → [["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],
     ["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]
Example 2: products=["havana"], searchWord="havana" → [["havana"],["havana"],["havana"],["havana"],["havana"],["havana"]]
```

Constraints: `1 <= products.length <= 1000`, `1 <= searchWord.length <= 1000`

---

## 📝 Interview Tips

1. **Clarify**: "Kết quả phải lexicographic nhỏ nhất 3 hay bất kỳ 3?" / Must be lex min 3 — sort first.
2. **Sort once**: Sort `products` → prefix candidates are always contiguous → no need to re-sort.
3. **Binary Search**: Dùng `startsWith` check sau bisect — tránh so sánh ký tự thủ công.
4. **Trie**: Build-time O(total chars), query O(prefix + 3) — better for many repeated queries.
5. **Edge**: Empty products, no match → return empty array for that prefix.
6. **Two-pointer**: After sort, maintain lo/hi pointer per prefix step — avoid O(log n) each time.

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Filter per prefix
 * Time: O(n*m*L) — m prefix lengths, filter n products each, compare L chars
 * Space: O(n*L) — sort in-place + result storage
 */
function suggestedProducts1(products: string[], searchWord: string): string[][] {
  products.sort();
  const result: string[][] = [];

  for (let i = 1; i <= searchWord.length; i++) {
    const prefix = searchWord.slice(0, i);
    const matches = products.filter((p) => p.startsWith(prefix)).slice(0, 3);
    result.push(matches);
  }
  return result;
}

/**
 * Solution 2: Sort + Binary Search (Optimal for typical input)
 * Time: O(n log n + m * log n) — sort once + binary search per prefix
 * Space: O(n) — sorted products + result
 *
 * After sorting, binary search for first product >= prefix.
 * Then check up to 3 products starting at that position.
 */
function suggestedProducts(products: string[], searchWord: string): string[][] {
  products.sort();
  const result: string[][] = [];

  // Lower bound: first index where products[i] >= prefix
  function lowerBound(prefix: string): number {
    let lo = 0,
      hi = products.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (products[mid] < prefix) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  for (let i = 1; i <= searchWord.length; i++) {
    const prefix = searchWord.slice(0, i);
    const start = lowerBound(prefix);
    const batch: string[] = [];
    for (let j = start; j < Math.min(start + 3, products.length); j++) {
      if (products[j].startsWith(prefix)) batch.push(products[j]);
    }
    result.push(batch);
  }
  return result;
}

/**
 * Solution 3: Trie with DFS collection
 * Time: O(n*L) build + O(m*L + m*3) query (L = avg word length)
 * Space: O(n*L) — trie storage
 *
 * Trie stores sorted words at each node for fast prefix retrieval.
 */
interface TrieNode {
  children: Map<string, TrieNode>;
  words: string[];
}

function suggestedProductsTrie(products: string[], searchWord: string): string[][] {
  products.sort();
  const root: TrieNode = { children: new Map(), words: [] };

  // Build trie
  for (const product of products) {
    let node = root;
    for (const ch of product) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), words: [] });
      node = node.children.get(ch)!;
      if (node.words.length < 3) node.words.push(product);
    }
  }

  // Query: traverse trie following searchWord prefix
  const result: string[][] = [];
  let node: TrieNode | undefined = root;
  for (let i = 0; i < searchWord.length; i++) {
    node = node?.children.get(searchWord[i]);
    result.push(node ? node.words : []);
  }
  return result;
}

// === Test Cases ===
const p1 = ["mobile", "moneypot", "monitor", "mouse", "mousepad"];
console.log(JSON.stringify(suggestedProducts(p1, "mouse")));
// [["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],
//  ["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]

console.log(JSON.stringify(suggestedProducts(["havana"], "havana")));
// [["havana"],["havana"],["havana"],["havana"],["havana"],["havana"]]

console.log(JSON.stringify(suggestedProductsTrie(p1, "mouse")));
// same as above
```

---

## 🔗 Related Problems

| Problem                                                                                                                      | Relationship                            |
| ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [1268. Search Suggestions System](https://leetcode.com/problems/search-suggestions-system/)                                  | This problem                            |
| [208. Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)                               | Foundation trie data structure          |
| [642. Design Search Autocomplete System](https://leetcode.com/problems/design-search-autocomplete-system/)                   | Extended version with frequency ranking |
| [14. Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix/)                                            | Prefix string comparison                |
| [211. Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/) | Trie with wildcard search               |
