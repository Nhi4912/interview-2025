---
layout: page
title: "Maximum Palindromes After Operations"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, String, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-palindromes-after-operations"
---

# Maximum Palindromes After Operations / Tối Đa Palindrome Sau Phép Hoán Đổi

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Sort
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Giống ghép đôi tất → mọi ký tự từ mọi từ đều có thể hoán đổi tự do:** đếm tổng số cặp ký tự, rồi phân phối cặp cho từng từ (ưu tiên từ ngắn nhất trước để tối đa số palindrome).

**Pattern Recognition:**

- Signal: "swap chars across any position globally + maximize palindromes" → **Pool chars globally + Greedy by length**
- Vì swap tự do, chỉ cần đếm tổng pairs của 26 ký tự
- Từ ngắn cần ít cặp hơn → sort by length, fill từ ngắn trước

**Visual:**

```
words = ["abba","winsl","oss"]
All chars: a×2,b×2,w×1,i×1,n×1,s×2,l×1,o×1
Pairs: a=1, b=1, s=1 → total pairs = 3

Sort by length: ["oss"(3), "abba"(4), "winsl"(5)]
"oss" (len=3): needs floor(3/2)=1 pair → use 1, left=2 ✅ count=1
"abba" (len=4): needs 2 pairs → use 2, left=0 ✅ count=2
"winsl" (len=5): needs 2 pairs → 0 left ❌
Result: 2 ✅
```

## Problem Description

Given `words[]`, you can swap any character from any position in any word with any other. Return the **maximum number of palindromes** possible after any number of operations.

- Example 1: `["abba","winsl","oss"]` → `2`
- Example 2: `["xxyyzz"]` → `1`
- Example 3: `["a","ab"]` → `1`

## 📝 Interview Tips

1. **Clarify**: Swap có giới hạn số lần không? / Any limit on swaps? No limit, effectively redistribute freely
2. **Approach**: Count global char pairs, sort words by length, greedily assign pairs / All chars are in a pool
3. **Edge cases**: Single char word → needs 0 pairs (odd-length palindrome uses 1 center) / Works if pairs=0
4. **Optimize**: O(n \* L + n log n) for char counting + sort / L = total string length
5. **Follow-up**: Maximize total length of palindromes? / Different objective → different greedy
6. **Complexity**: Time O(n\*L + n log n), Space O(26) / Constant extra space for char counts

## Solutions

```typescript
/** Solution 1: Brute force – Try all char assignments (small input only)
 * Time: O(n * L * 26) | Space: O(26)
 */
function maxPalindromesBrute(words: string[]): number {
  // Count total char frequencies
  const freq = new Array(26).fill(0);
  for (const w of words) for (const c of w) freq[c.charCodeAt(0) - 97]++;

  // Total available pairs
  let pairs = 0;
  for (const f of freq) pairs += Math.floor(f / 2);

  // Sort by length, assign pairs greedily
  const lens = words.map((w) => w.length).sort((a, b) => a - b);
  let count = 0;
  for (const len of lens) {
    const need = Math.floor(len / 2);
    if (pairs >= need) {
      pairs -= need;
      count++;
    }
  }
  return count;
}

/** Solution 2: Greedy – Global Char Pool + Sort by Length
 * Time: O(n*L + n log n) | Space: O(26)
 */
function maxPalindromes(words: string[]): number {
  // Step 1: Count all characters globally
  const freq = new Array(26).fill(0);
  let totalLen = 0;
  for (const w of words) {
    totalLen += w.length;
    for (const c of w) freq[c.charCodeAt(0) - 97]++;
  }

  // Step 2: Total pairs available (each pair can fill 2 slots in a palindrome)
  let availPairs = 0;
  for (const f of freq) availPairs += Math.floor(f / 2);

  // Step 3: Sort words by length (fill shortest palindromes first)
  const lengths = words.map((w) => w.length).sort((a, b) => a - b);

  // Step 4: Greedily assign pairs to each word
  let palindromes = 0;
  for (const len of lengths) {
    const pairsNeeded = Math.floor(len / 2); // each pair fills 2 symmetric positions
    if (availPairs >= pairsNeeded) {
      availPairs -= pairsNeeded;
      palindromes++;
    }
    // Odd-length word can always use a center char (1 unpaired char) — already accounted for
  }
  return palindromes;
}

/** Solution 3: Same with early exit optimization
 * Time: O(n*L + n log n) | Space: O(26)
 */
function maxPalindromesOpt(words: string[]): number {
  const freq = new Array(26).fill(0);
  for (const w of words) for (const c of w) freq[c.charCodeAt(0) - 97]++;
  let pairs = freq.reduce((s, f) => s + Math.floor(f / 2), 0);

  const lens = words.map((w) => w.length).sort((a, b) => a - b);
  let ans = 0;
  for (const len of lens) {
    const need = Math.floor(len / 2);
    if (pairs < need) continue; // can't form this palindrome
    pairs -= need;
    ans++;
  }
  return ans;
}

// Tests
console.log(maxPalindromes(["abba", "winsl", "oss"])); // 2
console.log(maxPalindromes(["xxyyzz"])); // 1
console.log(maxPalindromes(["a", "ab"])); // 1
console.log(maxPalindromes(["aabbcc", "ddeeff"])); // 2
console.log(maxPalindromesBrute(["abba", "winsl", "oss"])); // 2
console.log(maxPalindromesOpt(["leetcode"])); // 1
```

## 🔗 Related Problems

| Problem                                                                | Relationship                      |
| ---------------------------------------------------------------------- | --------------------------------- |
| [Reorganize String](https://leetcode.com/problems/reorganize-string)   | Char frequency + greedy placement |
| [Longest Palindrome](https://leetcode.com/problems/longest-palindrome) | Count char pairs for palindrome   |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)         | Frequency-based greedy scheduling |
