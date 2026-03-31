---
layout: page
title: "Minimum Window Substring"
difficulty: Hard
category: String
tags: [String, Hash Table, Sliding Window, Two Pointers]
leetcode_url: "https://leetcode.com/problems/minimum-window-substring/"
---

# Minimum Window Substring / Cửa Sổ Nhỏ Nhất Chứa Chuỗi T

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Sliding Window + Frequency Map
> **Frequency**: 📕 Tier 1 — Classic FAANG hard; appears at Google, Meta, Amazon, Microsoft
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Valid Palindrome II](16-valid-palindrome-ii.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Giống như tìm đoạn hàng rào ngắn nhất có đủ tất cả các loại gỗ cần thiết — bạn kéo dài cửa sổ về bên phải cho đến khi đủ loại gỗ, rồi co lại từ bên trái để tìm đoạn ngắn nhất có thể, rồi lại kéo dài tiếp. Lặp lại cho đến hết.

- **Pattern Recognition:**
  - Tìm substring ngắn nhất chứa tất cả ký tự của `t` → **Sliding Window** mở rộng + thu hẹp
  - Cần đếm tần suất ký tự → **HashMap** (hoặc mảng ASCII 128 phần tử)
  - Biến `formed` theo dõi số ký tự đã đủ số lần → tránh lặp lại bảng `tCount` mỗi bước

- **Visual — s="ADOBECODEBANC", t="ABC":**

  ```
  need = {A:1, B:1, C:1}, required = 3

  Expand right → find first valid window:
  r=0  'A' formed=1
  r=3  'B' formed=2
  r=5  'C' formed=3 ✓  window="ADOBEC" (len=6)

  Shrink left (keep valid):
  l=0  remove 'A' → formed=2, stop
  → record minWindow = "ADOBEC"

  Continue expand:
  r=9  'B' → formed=2 (already have A at l=0... wait, l=1 now)
  r=10 'A' → formed=3 ✓  window="DOBECODEBA" → shrink
  ...  shrink until l=6 → "ODEBA" still valid? No.
  ...  eventually: window = "BANC" (len=4) ← new minimum

  Result: "BANC"
  ```

## Problem Description

Given strings `s` and `t`, return the **minimum window substring** of `s` containing every character in `t` (including duplicates). Return `""` if no such window exists.

```
Input: s="ADOBECODEBANC", t="ABC"  → Output: "BANC"
Input: s="a",             t="a"   → Output: "a"
Input: s="a",             t="aa"  → Output: ""
```

## 📝 Interview Tips

1. **Two-phase loop / Vòng lặp hai pha**: Expand right to satisfy all requirements, then shrink left to minimize — this is the core insight to state up front.
2. **`formed` counter avoids full map scan / Biến `formed` tránh quét toàn bảng**: Increment `formed` only when a char's window count hits its required count; decrement when it drops below. O(1) validity check.
3. **HashMap vs Array / HashMap hay mảng**: For ASCII-only input, a `number[128]` array beats HashMap by constant factor — mention this as optimization.
4. **Duplicate chars in t / Ký tự lặp trong t**: `t="AA"` requires 2 A's in window. Bug magnet — `formed` only increments when `window[char] === tCount[char]`, not on every occurrence.
5. **Follow-up: O(m+n) filter / Thu nhỏ bài toán**: Pre-filter `s` to only positions of chars that appear in `t`. Reduces sliding window size when `|t| << |s|`.
6. **Complexity / Độ phức tạp**: O(m+n) time — each char in `s` is added and removed at most once. Space O(m+n) worst case for both maps.

## Solutions

```typescript
/**

- Minimum Window Substring
- https://leetcode.com/problems/minimum-window-substring/
  */

/**

- Solution 1: Sliding Window with HashMap (Clear & Standard)
- Expand right pointer; shrink left when window satisfies t.
- Time O(m+n) | Space O(m+n)
  */
  function minWindow(s: string, t: string): string {
  if (s.length < t.length) return "";

const tCount = new Map<string, number>();
for (const ch of t) tCount.set(ch, (tCount.get(ch) || 0) + 1);

const required = tCount.size;
let formed = 0;
const windowCount = new Map<string, number>();
let left = 0;
let minLen = Infinity;
let minStart = 0;

for (let right = 0; right < s.length; right++) {
const ch = s[right];
windowCount.set(ch, (windowCount.get(ch) || 0) + 1);

    if (tCount.has(ch) && windowCount.get(ch) === tCount.get(ch)) {
      formed++;
    }

    while (formed === required && left <= right) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minStart = left;
      }
      const leftCh = s[left++];
      windowCount.set(leftCh, windowCount.get(leftCh)! - 1);
      if (tCount.has(leftCh) && windowCount.get(leftCh)! < tCount.get(leftCh)!) {
        formed--;
      }
    }

}

return minLen === Infinity ? "" : s.substring(minStart, minStart + minLen);
}

/**

- Solution 2: Sliding Window with ASCII Array (Optimized Space)
- Replace HashMap with fixed-size number[128] for O(1) lookups.
- Time O(m+n) | Space O(1) — array size is constant
  */
  function minWindowArray(s: string, t: string): string {
  if (s.length < t.length) return "";

const tCount = new Array(128).fill(0);
const winCount = new Array(128).fill(0);
let required = 0;

for (const ch of t) {
if (tCount[ch.charCodeAt(0)] === 0) required++;
tCount[ch.charCodeAt(0)]++;
}

let formed = 0;
let left = 0;
let minLen = Infinity;
let minStart = 0;

for (let right = 0; right < s.length; right++) {
const code = s.charCodeAt(right);
winCount[code]++;
if (tCount[code] > 0 && winCount[code] === tCount[code]) formed++;

    while (formed === required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minStart = left;
      }
      const lCode = s.charCodeAt(left++);
      winCount[lCode]--;
      if (tCount[lCode] > 0 && winCount[lCode] < tCount[lCode]) formed--;
    }

}

return minLen === Infinity ? "" : s.substring(minStart, minStart + minLen);
}

// Inline tests
console.log(minWindow("ADOBECODEBANC", "ABC")); // "BANC"
console.log(minWindow("a", "a")); // "a"
console.log(minWindowArray("a", "aa")); // ""
console.log(minWindowArray("bba", "ab")); // "ba"
```

## 🔗 Related Problems

- [3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) — Sliding window foundation
- [438. Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/) — Fixed-size window variant
- [567. Permutation in String](https://leetcode.com/problems/permutation-in-string/) — Same pattern, fixed window size
- [30. Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words/) — Harder extension with word-level sliding window
- [209. Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/) — Numeric version of the same shrink/expand pattern
