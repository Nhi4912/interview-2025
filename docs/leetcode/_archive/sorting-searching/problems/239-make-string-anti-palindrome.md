---
layout: page
title: "Make String Anti-palindrome"
difficulty: Hard
category: Sorting-Searching
tags: [String, Greedy, Sorting, Counting Sort]
leetcode_url: "https://leetcode.com/problems/make-string-anti-palindrome"
---

# Make String Anti-palindrome / Xây Dựng Chuỗi Phản Đối Xứng

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Greedy + Sorting
> **Frequency**: 📙 Tier 2 — Gặp ở Amazon, Google
> **See also**: [Reorganize String](https://leetcode.com/problems/reorganize-string) | [Minimum Deletions to Make Character Frequencies Unique](https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng sắp xếp chỗ ngồi: mỗi cặp ghế đối diện (i và n-1-i) không được cùng "màu áo". Sắp xếp tất cả theo thứ tự tên trước, sau đó chỉ hoán đổi những cặp vi phạm với người khác ở phía sau — đảm bảo kết quả là nhỏ nhất theo từ điển.

**Pattern Recognition:**

- Impossibility check: nếu 1 ký tự có count > n/2 → không thể thỏa mãn
- Sort trước → cơ sở lex-smallest; chỉ sửa những cặp mirror bị xung đột
- Hai con trỏ: `i` quét từ 0..n/2, `j` tìm target hoán đổi ở nửa phải

**Visual — s = "aabbc" (n=6 ví dụ) và s = "aaaa" (impossible):**

```
s = "aabb" → sorted = "aabb"
Pairs: i=0 → chars[0]='a', chars[3]='b' → 'a'≠'b' ✅
       i=1 → chars[1]='a', chars[2]='b' → 'a'≠'b' ✅
Result: "aabb"

s = "aaaa" → count('a')=4 > n/2=2 → return "-1"

s = "abca" → sorted = "aabc"
Pairs: i=0 → 'a' vs 'c' ✅   i=1 → 'a' vs 'b' ✅
Result: "aabc"
```

---

## Problem Description

Given string `s` of even length `n`, rearrange its characters to make it **anti-palindrome**: no index `i` satisfies `s[i] == s[n-1-i]`. Return the **lexicographically smallest** valid arrangement, or `"-1"` if impossible.

- Example 1: `s = "abca"` → `"aabc"` (pairs: a≠c, a≠b ✅)
- Example 2: `s = "aaaa"` → `"-1"` (count('a')=4 > n/2=2, impossible)
- Example 3: `s = "abcdef"` → `"abcdef"` (all mirror pairs already differ)

**Constraints:** `2 ≤ n ≤ 10^5`, `n` is even, `s` has only lowercase English letters.

---

## 📝 Interview Tips

1. **Impossibility check**: "Nếu bất kỳ ký tự nào xuất hiện > n/2 lần → return '-1' ngay" / Any char with count > n/2 makes it impossible
2. **Greedy key**: "Sắp xếp trước để đảm bảo kết quả nhỏ nhất theo từ điển, rồi chỉ sửa xung đột" / Sort to get lex-smallest base, only fix conflicts
3. **Swap target**: "Khi s[i]==s[n-1-i], tìm ký tự khác ở vị trí j > i (nửa sau) để hoán đổi" / Swap conflicting mirror with next different char in right half
4. **Two-pointer**: "j bắt đầu từ n/2, chỉ tiến về phía trước — không quay lại" / j starts at n/2, only moves forward — amortized O(n)
5. **Edge case**: "Chuỗi 2 ký tự giống nhau 'aa' → '-1'; 2 ký tự khác nhau 'ab' → 'ab'" / "aa"→"-1", "ab"→"ab"
6. **Follow-up**: "Đếm số swap tối thiểu để tạo anti-palindrome từ chuỗi ban đầu?" / Count minimum swaps to achieve anti-palindrome from original string?

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Greedy Two-Pointer Fix
 * Time: O(n log n) — sort dominates; greedy pass is O(n) amortized
 * Space: O(n) — char array
 */
function makeAntiPalindrome(s: string): string {
  const n = s.length;
  const chars = s.split("").sort();

  // Impossibility: any character appears more than n/2 times
  const freq = new Array(26).fill(0);
  for (const c of chars) freq[c.charCodeAt(0) - 97]++;
  if (freq.some((f) => f > n / 2)) return "-1";

  // Fix mirror conflicts: scan left half, swap right mirror if equal
  let j = Math.floor(n / 2); // tracks swap target in right half
  for (let i = 0; i < n / 2; i++) {
    if (chars[i] === chars[n - 1 - i]) {
      // Find next char in right half that differs from chars[i]
      while (j < n - 1 - i && chars[j] === chars[i]) j++;
      [chars[n - 1 - i], chars[j]] = [chars[j], chars[n - 1 - i]];
      j++;
    }
  }
  return chars.join("");
}

/**
 * Solution 2: Counting Sort + Linear Fix (O(n) total)
 * Time: O(n + 26) = O(n) — counting sort + linear placement
 * Space: O(n + 26)
 */
function makeAntiPalindromeCount(s: string): string {
  const n = s.length;
  const freq = new Array(26).fill(0);
  for (const c of s) freq[c.charCodeAt(0) - 97]++;
  if (freq.some((f) => f > n / 2)) return "-1";

  // Reconstruct sorted char array from frequency counts
  const sorted: number[] = [];
  for (let c = 0; c < 26; c++) {
    for (let k = 0; k < freq[c]; k++) sorted.push(c);
  }

  const res = [...sorted];
  let j = n / 2;
  for (let i = 0; i < n / 2; i++) {
    if (res[i] === res[n - 1 - i]) {
      while (j < n - 1 - i && res[j] === res[i]) j++;
      [res[n - 1 - i], res[j]] = [res[j], res[n - 1 - i]];
      j++;
    }
  }
  return res.map((c) => String.fromCharCode(97 + c)).join("");
}

// === Test Cases ===
console.log(makeAntiPalindrome("abca")); // "aabc"
console.log(makeAntiPalindrome("aaaa")); // "-1"
console.log(makeAntiPalindrome("abcdef")); // "abcdef"
console.log(makeAntiPalindrome("aabb")); // "aabb"
console.log(makeAntiPalindromeCount("abca")); // "aabc"
console.log(makeAntiPalindromeCount("aaaa")); // "-1"
```

---

## 🔗 Related Problems

| Problem                                                                                                                                        | Pattern         | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------- |
| [Reorganize String](https://leetcode.com/problems/reorganize-string)                                                                           | Greedy + Heap   | Medium     |
| [Minimum Deletions to Make Character Frequencies Unique](https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique) | Greedy + Sort   | Medium     |
| [Rearrange String k Distance Apart](https://leetcode.com/problems/rearrange-string-k-distance-apart)                                           | Greedy + Heap   | Hard       |
| [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency)                                                     | Bucket Sort     | Medium     |
| [Palindrome Partitioning II](https://leetcode.com/problems/palindrome-partitioning-ii)                                                         | DP + Palindrome | Hard       |
