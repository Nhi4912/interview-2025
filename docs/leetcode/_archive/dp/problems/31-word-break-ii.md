---
layout: page
title: "Word Break II"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Hash Table, String, Dynamic Programming, Backtracking]
leetcode_url: "https://leetcode.com/problems/word-break-ii"
---

# Word Break II / Tách Từ II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: DFS + Memoization (Backtracking + DP)
> **Frequency**: 📘 Tier 3 — Gặp ở 9 companies
> **See also**: [Word Break](https://leetcode.com/problems/word-break) | [Concatenated Words](https://leetcode.com/problems/concatenated-words)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang đọc một dải băng chữ liên tục không có khoảng trắng: "catsanddog". Bạn thử đọc từng từ từ đầu — "cat" ✅ → tiếp tục từ "sanddog" → "sand" ✅ → "dog" ✅. Giống như phân tích câu trong tiếng Anh: thử tất cả cách tách, ghi nhớ kết quả từng vị trí để tránh tính lại.

**Pattern Recognition:**

- Signal: "enumerate all sentences from string + dictionary" → **DFS + Memoization**
- memo[i] = all valid sentences starting at index i
- Key insight: mỗi vị trí i chỉ cần tính một lần, tái sử dụng kết quả

**Visual — s = "catsanddog", wordDict = ["cat","cats","and","sand","dog"]:**

```
dfs(0):
  "cat"  ✅ → dfs(3): "sand"✅ → dfs(7): "dog"✅ → dfs(10): "" → ["dog"]
                               → ["sand dog"]
             "and" ✅ → dfs(6): "dog"✅ → ["and dog"]
                               → ["and dog"]
             → ["sand dog", "and dog"]  → ["cat sand dog", "cat and dog"]
  "cats" ✅ → dfs(4): "and"✅ → dfs(7): "dog"✅ → ["cats and dog"]

Answer: ["cats and dog", "cat sand dog", "cat and dog"]
```

---

## Problem Description

Given a string `s` and a dictionary `wordDict`, add spaces to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in any order. ([LeetCode 140](https://leetcode.com/problems/word-break-ii))

Difficulty: Hard | Acceptance: 53.6%

- **Example 1**: s = "catsanddog", wordDict = ["cat","cats","and","sand","dog"] → `["cats and dog","cat sand dog"]`
- **Example 2**: s = "pineapplepenapple", wordDict = ["apple","pen","applepen","pine","pineapple"] → `["pine apple pen apple","pineapple pen apple","pine applepen apple"]`

Constraints:

- `1 <= s.length <= 20`
- `1 <= wordDict.length <= 1000`
- All strings are lowercase English letters

---

## 📝 Interview Tips

1. **Clarify**: "Kết quả có cần sort không? Có từ trùng trong dict không?" / Result order? Duplicate words?
2. **Brute force**: "Pure backtracking — không memo → exponential O(2^n)" / Without memo, may TLE
3. **Memoization key**: "memo[i] = list of sentences from s[i..end]" / Cache by starting index
4. **Word lookup**: "Dùng Set<string> để O(1) lookup thay vì O(n)" / HashSet for O(1) dictionary lookup
5. **Combine**: "Nối kết quả: word + ' ' + each sentence from rest" / Concatenate carefully
6. **Edge**: "s không thể tách được → return []" / Return empty array if no valid split

---

## Solutions

```typescript
/**
 * Solution 1: Pure Backtracking (no memo)
 * Time: O(2^n × n) — exponential without memo
 * Space: O(n) — recursion stack
 */
function wordBreakIIBacktrack(s: string, wordDict: string[]): string[] {
  const wordSet = new Set(wordDict);
  const results: string[] = [];

  function backtrack(start: number, path: string[]): void {
    if (start === s.length) {
      results.push(path.join(" "));
      return;
    }
    for (let end = start + 1; end <= s.length; end++) {
      const word = s.slice(start, end);
      if (wordSet.has(word)) {
        path.push(word);
        backtrack(end, path);
        path.pop();
      }
    }
  }

  backtrack(0, []);
  return results;
}

/**
 * Solution 2: DFS + Memoization (Optimal)
 * Time: O(n² × 2^n) — n² to build substrings, 2^n for output in worst case
 * Space: O(n × 2^n) — memo stores all sentences per position
 */
function wordBreakII(s: string, wordDict: string[]): string[] {
  const wordSet = new Set(wordDict);
  // memo[i] = all valid sentences constructable from s[i..end]
  const memo = new Map<number, string[]>();

  function dfs(start: number): string[] {
    if (memo.has(start)) return memo.get(start)!;
    if (start === s.length) return [""]; // base: empty string at end

    const sentences: string[] = [];
    for (let end = start + 1; end <= s.length; end++) {
      const word = s.slice(start, end);
      if (wordSet.has(word)) {
        const rest = dfs(end);
        for (const sentence of rest) {
          // Join: if sentence is empty (last word), no space needed
          sentences.push(sentence === "" ? word : `${word} ${sentence}`);
        }
      }
    }

    memo.set(start, sentences);
    return sentences;
  }

  return dfs(0);
}

// === Test Cases ===
console.log(wordBreakII("catsanddog", ["cat", "cats", "and", "sand", "dog"]));
// ["cat sand dog","cat and dog","cats and dog"] (order may vary)

console.log(wordBreakII("pineapplepenapple", ["apple", "pen", "applepen", "pine", "pineapple"]));
// ["pine apple pen apple","pine applepen apple","pineapple pen apple"]

console.log(wordBreakII("catsandog", ["cats", "cat", "san", "sand", "and", "dog"]));
// ["cat sand og"... no, only valid splits]

console.log(wordBreakII("a", ["b"])); // []
```
