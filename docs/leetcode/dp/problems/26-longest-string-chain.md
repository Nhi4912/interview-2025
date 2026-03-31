---
layout: page
title: "Longest String Chain"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Hash Table, Two Pointers, String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/longest-string-chain"
---

# Longest String Chain / Chuỗi Từ Dài Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming + Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 9 companies
> **See also**: [Maximum Total Damage With Spell Casting](https://leetcode.com/problems/maximum-total-damage-with-spell-casting) | [Number of Matching Subsequences](https://leetcode.com/problems/number-of-matching-subsequences)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang xây một chuỗi từ điển — bắt đầu từ từ ngắn nhất, mỗi bước thêm đúng một chữ cái vào bất kỳ vị trí nào để tạo từ mới hợp lệ. Giống như học từ vựng: "a" → "ab" → "abc" → "abcd". Mỗi từ dài hơn "kế thừa" độ dài chuỗi từ từ ngắn hơn nó một chữ.

**Pattern Recognition:**

- Signal: "words of different lengths" + "predecessor/successor relationship" → **DP on sorted words**
- Sort words by length, then for each word try all predecessors by removing one character
- Key insight: dp[word] = độ dài chuỗi dài nhất kết thúc tại `word`

**Visual — words = ["a","b","ba","bca","bda","bdca"]:**

```
Sort by length: ["a","b","ba","bca","bda","bdca"]

dp["a"]    = 1
dp["b"]    = 1
dp["ba"]   = dp["a"]+1 = 2  (remove 'b' → "a" ✅)
            dp["b"]+1 = 2  (remove 'a' → "b" ✅) → max = 2
dp["bca"]  = dp["ba"]+1 = 3 (remove 'c' → "ba" ✅)
dp["bda"]  = dp["ba"]+1 = 3 (remove 'd' → "ba" ✅)
dp["bdca"] = dp["bda"]+1 = 4 (remove 'c' → "bda" ✅)

Answer: max(dp.values()) = 4
```

---

## Problem Description

Given a list of words, find the longest string chain. A word A is a predecessor of word B if you can insert exactly one letter anywhere in A to make it equal to B. Return the length of the longest possible word chain. ([LeetCode 1048](https://leetcode.com/problems/longest-string-chain))

Difficulty: Medium | Acceptance: 62.0%

- **Example 1**: words = ["a","b","ba","bca","bda","bdca"] → **4** ("a"→"ba"→"bda"→"bdca")
- **Example 2**: words = ["xbc","pcxbcf","xb","cxbc","pcxbc"] → **5**

Constraints:

- `1 <= words.length <= 1000`
- `1 <= words[i].length <= 16`
- All words consist of lowercase English letters

---

## 📝 Interview Tips

1. **Clarify**: "Có cần giữ thứ tự không? Có thể chèn ký tự ở bất kỳ vị trí?" / Can we insert anywhere? Order preserved?
2. **Brute force**: "Thử mọi cặp từ O(N²×L)" → sort + DP + Hash Map O(N×L²)
3. **Key insight**: "Sort by length, check all L predecessors by removing each char" / Remove 1 char at each position
4. **State**: "dp[word] = độ dài chuỗi dài nhất ending ở word" / Longest chain ending at this word
5. **Transition**: "dp[word] = max(dp[pred] + 1) for all valid predecessors" / Try all L deletions
6. **Edge cases**: "Single word → 1, no chain possible → 1" / Min answer is always 1

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Check all pairs
 * Time: O(N² × L) — compare every pair of words
 * Space: O(1) — ignoring sort
 */
function longestStringChainBruteForce(words: string[]): number {
  words.sort((a, b) => a.length - b.length);

  function isPredecessor(shorter: string, longer: string): boolean {
    if (longer.length - shorter.length !== 1) return false;
    for (let i = 0; i < longer.length; i++) {
      if (longer.slice(0, i) + longer.slice(i + 1) === shorter) return true;
    }
    return false;
  }

  const dp = new Array(words.length).fill(1);
  let best = 1;
  for (let i = 1; i < words.length; i++) {
    for (let j = 0; j < i; j++) {
      if (isPredecessor(words[j], words[i])) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    best = Math.max(best, dp[i]);
  }
  return best;
}

/**
 * Solution 2: DP + Hash Map (Optimal)
 * Time: O(N × L²) — N words, L chars each, L deletions each O(L) string slice
 * Space: O(N × L) — hash map stores all words
 */
function longestStringChain(words: string[]): number {
  // Sort by word length so predecessors are always processed first
  words.sort((a, b) => a.length - b.length);

  const dp = new Map<string, number>();
  let best = 1;

  for (const word of words) {
    let chainLen = 1;
    // Try removing each character to find valid predecessor
    for (let i = 0; i < word.length; i++) {
      const pred = word.slice(0, i) + word.slice(i + 1);
      const predLen = dp.get(pred) ?? 0;
      chainLen = Math.max(chainLen, predLen + 1);
    }
    dp.set(word, chainLen);
    best = Math.max(best, chainLen);
  }

  return best;
}

// === Test Cases ===
console.log(longestStringChain(["a", "b", "ba", "bca", "bda", "bdca"])); // 4
console.log(longestStringChain(["xbc", "pcxbcf", "xb", "cxbc", "pcxbc"])); // 5
console.log(longestStringChain(["abcd", "dbqca"])); // 1
console.log(longestStringChain(["a"])); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                                          | Difficulty | Pattern               |
| ---------------------------------------------------------------------------------------------------------------- | ---------- | --------------------- |
| [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence)                   | 🟡 Medium  | DP on sorted sequence |
| [Number of Matching Subsequences](https://leetcode.com/problems/number-of-matching-subsequences)                 | 🟡 Medium  | String matching       |
| [Maximum Total Damage With Spell Casting](https://leetcode.com/problems/maximum-total-damage-with-spell-casting) | 🟡 Medium  | DP                    |
| [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence)                           | 🟡 Medium  | String DP             |
| [Word Break](https://leetcode.com/problems/word-break)                                                           | 🟡 Medium  | DP + Hash Set         |
