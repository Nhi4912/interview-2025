---
layout: page
title: "Number of Wonderful Substrings"
difficulty: Medium
category: String
tags: [Hash Table, String, Bit Manipulation, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/number-of-wonderful-substrings"
---

# Number of Wonderful Substrings / Số Chuỗi Con Kỳ Diệu

🟡 Medium | 🏷️ Hash Table, String, Bit Manipulation, Prefix Sum

## 🧠 Intuition

**VI:** Chuỗi "kỳ diệu" có **tối đa 1 ký tự với tần số lẻ**. Dùng **bitmask XOR prefix**: bit thứ `i` = 1 nếu ký tự `'a'+i` xuất hiện số lẻ lần. Chuỗi con `[i+1..j]` kỳ diệu khi `prefix[j] XOR prefix[i]` có 0 hoặc 1 bit được set. Đếm các cặp prefix trước đó có mask phù hợp.

**EN:** Track parity of each char's frequency with a 10-bit mask (bits a–j). A substring is wonderful if its XOR has at most 1 bit set. For prefix at index j, count prior prefixes with mask `== prefix[j]` (0 bits differ) or `prefix[j] ^ (1<<k)` (exactly 1 bit differs).

```
word = "aba"
Prefixes:  ""   "a"  "ab"  "aba"
Mask:      00  01   11    00
                           ^same as prefix 0 → substring "aba" is wonderful
           pairs with 0-bit diff: (0,3) → "aba" ✅
           pairs with 1-bit diff: (0,1),(1,2),(2,3) check...
```

## 📝 Interview Tips

- 🇻🇳 **10 ký tự:** chỉ `a-j` — cần 10 bit, tổng 1024 trạng thái mask
- 🇬🇧 **10-bit space:** only 'a' to 'j' — 2^10 = 1024 possible prefix masks
- 🇻🇳 **XOR prefix:** `prefix[j] XOR prefix[i]` = mask của chuỗi con `[i+1..j]`
- 🇬🇧 **XOR trick:** substring parity = XOR of two prefixes; count matching prefixes
- 🇻🇳 **0 bit lẻ:** tìm prefix trước đó có cùng mask → `count[mask]`
- 🇻🇳 **1 bit lẻ:** flip từng bit trong 10 bit → cộng thêm `count[mask ^ (1<<k)]` với k=0..9
- 🇬🇧 **O(10n) time:** for each position check 11 masks (current + 10 single-bit flips)

## Solutions

### Solution 1: Bitmask prefix XOR with count array

```typescript
/**
 * Count prefix XOR masks, for each position check 11 candidate masks.
 * Time: O(10 * n) = O(n) | Space: O(2^10) = O(1)
 */
function wonderfulSubstrings(word: string): number {
  const count = new Array(1 << 10).fill(0);
  count[0] = 1; // empty prefix
  let mask = 0;
  let result = 0;

  for (const ch of word) {
    mask ^= 1 << (ch.charCodeAt(0) - 97);

    // Case 1: all characters have even frequency (0 odd-freq chars)
    result += count[mask];

    // Case 2: exactly 1 character has odd frequency
    for (let k = 0; k < 10; k++) {
      result += count[mask ^ (1 << k)];
    }

    count[mask]++;
  }
  return result;
}

console.log(wonderfulSubstrings("aba")); // 4
console.log(wonderfulSubstrings("aabb")); // 9
console.log(wonderfulSubstrings("he")); // 2
console.log(wonderfulSubstrings("abcd")); // 4 (each single char)
```

### Solution 2: Same with explicit mask tracking

```typescript
/**
 * Equivalent approach with more verbose comments for clarity.
 * Time: O(10n) | Space: O(1024)
 */
function wonderfulSubstrings2(word: string): number {
  const freq = new Map<number, number>([[0, 1]]);
  let prefixMask = 0;
  let ans = 0;

  for (const c of word) {
    prefixMask ^= 1 << (c.charCodeAt(0) - 97);

    // All-even: prefix[j] == prefix[i]
    ans += freq.get(prefixMask) ?? 0;

    // Exactly-one-odd: prefix[j] ^ (1<<k) == prefix[i]
    for (let bit = 0; bit < 10; bit++) {
      ans += freq.get(prefixMask ^ (1 << bit)) ?? 0;
    }

    freq.set(prefixMask, (freq.get(prefixMask) ?? 0) + 1);
  }
  return ans;
}

console.log(wonderfulSubstrings2("aba")); // 4
console.log(wonderfulSubstrings2("aabb")); // 9
```

### Solution 3: Counting directly with prefix sum pattern

```typescript
/**
 * Highlight the prefix-sum analogy clearly.
 * For prefix mask at j: wonderful substrings ending at j =
 *   count of i < j where mask[i..j] has ≤ 1 set bit.
 * Time: O(10n) | Space: O(1024)
 */
function wonderfulSubstrings3(word: string): number {
  const seen = new Int32Array(1024);
  seen[0] = 1;
  let cur = 0,
    res = 0;
  for (const c of word) {
    cur ^= 1 << (c.charCodeAt(0) - 97);
    res += seen[cur]; // 0 odd-freq chars
    for (let b = 0; b < 10; b++) res += seen[cur ^ (1 << b)]; // 1 odd-freq char
    seen[cur]++;
  }
  return res;
}

console.log(wonderfulSubstrings3("aba")); // 4
console.log(wonderfulSubstrings3("aabb")); // 9
```

## 🔗 Related Problems

| #    | Problem                                                     | Difficulty | Key Idea              |
| ---- | ----------------------------------------------------------- | ---------- | --------------------- |
| 1371 | Find the Longest Substring Containing Vowels in Even Counts | 🟡 Medium  | Bitmask prefix XOR    |
| 1542 | Find Longest Awesome Substring                              | 🔴 Hard    | Same bitmask pattern  |
| 560  | Subarray Sum Equals K                                       | 🟡 Medium  | Prefix sum + hash map |
