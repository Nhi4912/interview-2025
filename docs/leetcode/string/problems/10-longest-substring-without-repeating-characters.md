---
layout: page
title: "Longest Substring Without Repeating Characters"
difficulty: Medium
category: String
tags: [String, Hash Table, Sliding Window]
leetcode_url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
---

# Longest Substring Without Repeating Characters / Chuỗi Con Dài Nhất Không Lặp Ký Tự

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 🔥 Tier 1 — bài sliding window kinh điển, hỏi ở hầu hết mọi vòng phỏng vấn
> **See also**: [Find All Anagrams](./19-find-all-anagrams-in-string.md) | [Minimum Window Substring](./15-minimum-window-substring.md) | [Sliding Window Maximum](./17-sliding-window-maximum.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang nhìn qua một cửa sổ trượt trên một tờ giấy có chữ. Cửa sổ chỉ cho phép nhìn các ký tự không trùng nhau. Khi ký tự trùng xuất hiện ở cạnh phải, bạn trượt cạnh trái sang phải cho đến khi ký tự trùng đó bị đẩy ra. Ghi lại kích thước cửa sổ lớn nhất đạt được.

**Pattern Recognition:**

- Signal: "longest substring / chuỗi con dài nhất" + "without repeating / không lặp" → **Sliding Window + Hash Map**
- Map lưu vị trí cuối cùng của mỗi ký tự → khi gặp trùng, nhảy `left` thẳng đến sau vị trí đó
- Không lùi `left`: `left = Math.max(left, map.get(ch)! + 1)` — tránh thu hẹp cửa sổ về phía trước

**Visual — "abcabcbb":**

```
right=0(a): map={a:0}, window=[a],   len=1, max=1
right=1(b): map={b:1}, window=[ab],  len=2, max=2
right=2(c): map={c:2}, window=[abc], len=3, max=3
right=3(a): a at 0 → left=max(0,1)=1
            map={a:3},  window=[bca], len=3, max=3
right=4(b): b at 1 → left=max(1,2)=2
            map={b:4},  window=[cab], len=3, max=3
right=5(c): c at 2 → left=max(2,3)=3
            map={c:5},  window=[abc], len=3, max=3
right=6(b): b at 4 → left=max(3,5)=5
            map={b:6},  window=[cb],  len=2, max=3
right=7(b): b at 6 → left=max(5,7)=7
            map={b:7},  window=[b],   len=1, max=3

Answer: 3
```

---

## Problem Description

Given a string `s`, find the length of the longest substring that contains no repeating characters.

```
Example 1: "abcabcbb" → 3  (substring "abc")
Example 2: "bbbbb"    → 1  (substring "b")
Example 3: "pwwkew"   → 3  (substring "wke")
```

Constraints:

- `0 <= s.length <= 5 * 10^4`
- `s` consists of English letters, digits, symbols, and spaces

---

## 📝 Interview Tips

1. **Clarify**: Is the charset ASCII only or Unicode? / Chỉ ASCII hay cả Unicode (emoji, etc.)?
2. **Brute force**: Try all O(n²) substrings, check each with a Set — O(n²) time / Duyệt tất cả cặp i,j
3. **Optimize**: Sliding window + Map stores last-seen index, jump `left` directly — O(n) / Nhảy thẳng, không lùi từng bước
4. **Edge cases**: Empty string returns 0; all same chars returns 1 / Chuỗi rỗng, toàn ký tự giống nhau
5. **Follow-up**: Return the actual substring, not just its length / Trả về chuỗi con, không chỉ độ dài

---

## Solutions

```typescript

/**

- Solution 1: Brute Force — check every substring
- Time: O(n²) — n starting positions, up to n characters each
- Space: O(min(n, m)) — Set holds current window chars (m = charset size)
  */
  function lengthOfLongestSubstringBrute(s: string): number {
  let max = 0;
  for (let i = 0; i < s.length; i++) {
  const seen = new Set<string>();
  for (let j = i; j < s.length; j++) {
  if (seen.has(s[j])) break;
  seen.add(s[j]);
  max = Math.max(max, j - i + 1);
  }
  }
  return max;
  }

/**

- Solution 2: Sliding Window with Map (Optimal)
- Time: O(n) — each character processed at most twice (added, then removed)
- Space: O(min(n, m)) — Map holds at most charset-size entries
  */
  function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>();
  let max = 0;
  let left = 0;

for (let right = 0; right < s.length; right++) {
const ch = s[right];
if (lastSeen.has(ch)) {
// Jump left past the previous occurrence; never move left backwards
left = Math.max(left, lastSeen.get(ch)! + 1);
}
lastSeen.set(ch, right);
max = Math.max(max, right - left + 1);
}

return max;
}

// === Test Cases ===
console.log(lengthOfLongestSubstring("abcabcbb")); // 3
console.log(lengthOfLongestSubstring("bbbbb")); // 1
console.log(lengthOfLongestSubstring("pwwkew")); // 3
console.log(lengthOfLongestSubstring("")); // 0

```

---

## 🔗 Related Problems

- [Find All Anagrams in a String](./19-find-all-anagrams-in-string.md) — sliding window với fixed-size window
- [Minimum Window Substring](./15-minimum-window-substring.md) — sliding window nâng cao với điều kiện phức tạp hơn
- [Sliding Window Maximum](./17-sliding-window-maximum.md) — sliding window kết hợp với deque
