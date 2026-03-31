---
layout: page
title: "Find the Length of the Longest Common Prefix"
difficulty: Medium
category: String
tags: [Array, Hash Table, String, Trie]
leetcode_url: "https://leetcode.com/problems/find-the-length-of-the-longest-common-prefix"
---

# Find the Length of the Longest Common Prefix / Tìm Độ Dài Tiền Tố Chung Dài Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) | [Word Break II](https://leetcode.com/problems/word-break-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như tra từ điển điện thoại — tất cả số bắt đầu bằng `084` đều được lưu trên cùng một nhánh cây. Để tìm tiền tố chung dài nhất giữa hai danh bạ, ta chỉ cần lưu tất cả tiền tố của danh bạ thứ nhất vào một bộ nhớ, rồi tra từng tiền tố của danh bạ thứ hai.

**Pattern Recognition:**

- Signal: "prefix search" + "two arrays" → **Hash Set of Prefixes**
- Lưu tất cả prefix của `arr1` vào HashSet, duyệt `arr2` kiểm tra từng prefix
- Key insight: Chuyển số nguyên → chuỗi, sinh prefix từ dài đến ngắn, so khớp

**Visual — Longest Common Prefix:**

```
arr1 = [1, 10, 100]  →  prefixes = {"1","10","100"}
arr2 = [1000, 10]

"1000" → check "1000"(❌), "100"(✅ len=3)
"10"   → check "10"  (✅ len=2)
                         ↑ max = 3

arr1 = [14, 3, 4]   →  prefixes = {"1","14","3","4"}
arr2 = [142, 323]

"142" → "142"(❌) "14"(✅ len=2)
"323" → "323"(❌) "32"(❌) "3"(✅ len=1)
                    ↑ max = 2
```

---

## Problem Description

Given two arrays of integers `arr1` and `arr2`, return the length of the longest common prefix among all pairs `(a, b)` where `a` is from `arr1` and `b` is from `arr2`. A common prefix is the leading digits shared when comparing string representations.

**Example 1:** `arr1 = [1,10,100]`, `arr2 = [1000,10]` → `3` (100 and 1000 share "100")
**Example 2:** `arr1 = [1,2,3]`, `arr2 = [4,4,4]` → `0` (no common prefix)

Constraints:

- `1 <= arr1.length, arr2.length <= 5 * 10^4`
- `1 <= arr1[i], arr2[i] <= 10^8`

---

## 📝 Interview Tips

1. **Clarify (VN)**: "Tiền tố tính trên chuỗi số hay giá trị số học?" / **EN**: Prefix is string-based — leading digits as characters
2. **Brute force (VN)**: "O(n·m·L): mọi cặp, so từng ký tự" / **EN**: Check every pair of strings and count matching leading chars
3. **Optimize (VN)**: "HashSet lưu mọi prefix của arr1 O(n·L), duyệt arr2 O(m·L)" / **EN**: Pre-store all prefixes of arr1, look up from arr2
4. **Trie approach (VN)**: "Trie cho phép reuse node giữa các prefix — tiết kiệm bộ nhớ" / **EN**: Trie avoids duplicate prefixes, more memory efficient
5. **Edge cases (VN)**: "Số giống nhau hoàn toàn → tiền tố = độ dài toàn bộ số đó" / **EN**: Identical numbers share full-length prefix
6. **Follow-up (VN)**: "Nếu arr1 thay đổi liên tục → dùng Trie để update online" / **EN**: Online updates → use a mutable Trie structure

---

## Solutions

```typescript
/**
 * Solution 1: Hash Set of all prefixes from arr1
 * Time: O((n + m) * L) — L = max digits ~9
 * Space: O(n * L) — store all prefixes of arr1
 */
function longestCommonPrefixHashSet(arr1: number[], arr2: number[]): number {
  const prefixSet = new Set<string>();

  // Store all prefixes of every number in arr1
  for (const num of arr1) {
    const s = String(num);
    for (let len = 1; len <= s.length; len++) {
      prefixSet.add(s.slice(0, len));
    }
  }

  let maxLen = 0;
  // For each number in arr2, check its prefixes longest-first
  for (const num of arr2) {
    const s = String(num);
    for (let len = s.length; len >= 1; len--) {
      if (prefixSet.has(s.slice(0, len))) {
        maxLen = Math.max(maxLen, len);
        break; // found longest match for this number
      }
    }
  }

  return maxLen;
}

/**
 * Solution 2: Trie-based approach
 * Time: O((n + m) * L) — insert all arr1, query all arr2
 * Space: O(n * L) — trie nodes
 */
function longestCommonPrefix(arr1: number[], arr2: number[]): number {
  // Build trie from arr1
  const trie: Record<string, object> = {};

  for (const num of arr1) {
    let node = trie;
    for (const ch of String(num)) {
      if (!node[ch]) node[ch] = {};
      node = node[ch] as Record<string, object>;
    }
  }

  let maxLen = 0;
  // Search each number from arr2 in the trie
  for (const num of arr2) {
    let node = trie;
    let depth = 0;
    for (const ch of String(num)) {
      if (!node[ch]) break;
      node = node[ch] as Record<string, object>;
      depth++;
    }
    maxLen = Math.max(maxLen, depth);
  }

  return maxLen;
}

// === Test Cases ===
console.log(longestCommonPrefix([1, 10, 100], [1000, 10])); // 3
console.log(longestCommonPrefix([1, 2, 3], [4, 4, 4])); // 0
console.log(longestCommonPrefix([14, 3, 4], [142, 323])); // 2
console.log(longestCommonPrefix([1], [1])); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                                                               | Pattern       | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------- |
| [Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix)                                                          | Trie / String | 🟢 Easy    |
| [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words)                                                            | Trie + Heap   | 🟡 Medium  |
| [Palindrome Pairs](https://leetcode.com/problems/palindrome-pairs)                                                                    | Trie          | 🔴 Hard    |
| [Shortest Uncommon Substring in an Array](https://leetcode.com/problems/shortest-uncommon-substring-in-an-array)                      | Trie          | 🟡 Medium  |
| [Find the Length of the Longest Common Prefix — LeetCode](https://leetcode.com/problems/find-the-length-of-the-longest-common-prefix) | Trie          | 🟡 Medium  |
