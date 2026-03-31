---
layout: page
title: "Extra Characters in a String"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Hash Table, String, Dynamic Programming, Trie]
leetcode_url: "https://leetcode.com/problems/extra-characters-in-a-string"
---

# Extra Characters in a String / Extra Characters in a String

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Word Break II](https://leetcode.com/problems/word-break-ii) | [Number of Matching Subsequences](https://leetcode.com/problems/number-of-matching-subsequences)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống người thợ may đang đặt các mảnh vải khớp nhau — nếu không tìm được từ nào khớp tại vị trí hiện tại, ký tự đó bị bỏ thừa như vải vụn. DP giúp ta tối thiểu số vải vụn.

**Visual — DP over string "leetscode", dict=["leet","code","leetcode"]:**

```
s = "l e e t s c o d e"
     0 1 2 3 4 5 6 7 8

dp[i] = min extra chars to handle s[0..i-1]
dp[0] = 0  (empty prefix)

i=1: no dict match ending at 0 → dp[1] = dp[0]+1 = 1
i=2: no match → dp[2] = dp[1]+1 = 2
i=3: no match → dp[3] = dp[2]+1 = 3
i=4: "leet" matches s[0..3] → dp[4] = min(dp[3]+1, dp[0]) = 0
i=5: no match → dp[5] = dp[4]+1 = 1
...
i=9: "code" matches s[5..8] → dp[9] = min(dp[8]+1, dp[5]) = 1

Answer: dp[9] = 1  (the 's' at index 4 is extra)
```

---

## Problem Description

Given a 0-indexed string `s` and a dictionary of words `dictionary`, return the minimum number of extra characters left over if you break `s` optimally into words from the dictionary. ([LeetCode](https://leetcode.com/problems/extra-characters-in-a-string))

Difficulty: Medium | Acceptance: 57.1%

**Example 1:**

```
Input: s = "leetscode", dictionary = ["leet","code","leetcode"]
Output: 1
Explanation: Break s as "" + "leet" + "s" + "code". The "s" is left over.
```

**Example 2:**

```
Input: s = "sayhelloworld", dictionary = ["hello","world"]
Output: 3
Explanation: "say" = 3 extra characters.
```

Constraints:

- `1 <= s.length <= 50`
- `1 <= dictionary.length <= 50`
- `1 <= dictionary[i].length <= 50`

---

## 📝 Interview Tips

1. **Clarify**: "Có phải tìm cách chia chuỗi sao cho số ký tự thừa ít nhất không?" / Confirm we minimize leftover chars, not maximize matched chars.
2. **Brute force**: "DP[i] = min extra chars in s[0..i-1], thử mọi từ kết thúc tại i" / Try all dictionary words ending at position i.
3. **Trie optimization**: "Dùng Trie để traverse từ vị trí i về trước, tránh string slicing O(L) lặp lại" / Trie avoids repeated substring hashing.
4. **Transition**: "dp[i] = dp[i-1]+1 (bỏ ký tự s[i-1]) hoặc dp[j] nếu s[j..i-1] là từ trong dict" / Base case: skip char costs +1.
5. **Edge cases**: "Dictionary rỗng → mọi ký tự đều thừa, return len(s)" / Empty dict returns s.length.
6. **Follow-up**: "Nếu chuỗi rất dài (10^5)? Trie + DP vẫn hiệu quả O(n·L) với L là max word len" / Trie scales well.

---

## Solutions

```typescript
/**
 * Solution 1: DP with HashSet
 * Time: O(n^2 * L) where L = average word length for hashing
 * Space: O(n + total dict chars)
 */
function minExtraCharBrute(s: string, dictionary: string[]): number {
  const n = s.length;
  const wordSet = new Set(dictionary);
  // dp[i] = min extra chars for s[0..i-1]
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= n; i++) {
    // Option 1: treat s[i-1] as extra character
    dp[i] = dp[i - 1] + 1;
    // Option 2: find a dictionary word ending at i
    for (let j = 0; j < i; j++) {
      const word = s.slice(j, i);
      if (wordSet.has(word)) {
        dp[i] = Math.min(dp[i], dp[j]);
      }
    }
  }

  return dp[n];
}

/**
 * Solution 2: DP with Trie (optimal)
 * Time: O(n^2 + D*L) — n^2 DP transitions, D*L to build trie
 * Space: O(D*L + n) — trie nodes + dp array
 */
interface TrieNode {
  children: Map<string, TrieNode>;
  isEnd: boolean;
}

function minExtraChar(s: string, dictionary: string[]): number {
  // Build Trie
  const root: TrieNode = { children: new Map(), isEnd: false };
  for (const word of dictionary) {
    let node = root;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, { children: new Map(), isEnd: false });
      }
      node = node.children.get(ch)!;
    }
    node.isEnd = true;
  }

  const n = s.length;
  const dp = new Array(n + 1).fill(0);
  // dp[i] = min extra chars for s[0..i-1]
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i - 1] + 1; // skip character s[i-1]
    // walk Trie backward from i-1 to 0
    let node = root;
    for (let j = i - 1; j >= 0; j--) {
      const ch = s[j];
      if (!node.children.has(ch)) break;
      node = node.children.get(ch)!;
      if (node.isEnd) {
        dp[i] = Math.min(dp[i], dp[j]);
      }
    }
  }

  return dp[n];
}

// === Test Cases ===
console.log(minExtraChar("leetscode", ["leet", "code", "leetcode"])); // 1
console.log(minExtraChar("sayhelloworld", ["hello", "world"])); // 3
console.log(minExtraChar("abc", ["a", "b", "c"])); // 0
console.log(minExtraChar("xyz", [])); // 3
```

---

## 🔗 Related Problems

- [Word Break II](https://leetcode.com/problems/word-break-ii) — same pattern: DP + Trie
- [Number of Matching Subsequences](https://leetcode.com/problems/number-of-matching-subsequences) — same pattern: Trie
- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Longest String Chain](https://leetcode.com/problems/longest-string-chain) — same pattern: DP on strings
- [Extra Characters in a String — LeetCode](https://leetcode.com/problems/extra-characters-in-a-string) — problem page
