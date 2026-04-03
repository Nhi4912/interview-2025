---
layout: page
title: "Longest Substring Without Repeating Characters"
difficulty: Medium
category: String
tags: [String, Hash Table, Sliding Window]
leetcode_url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
leetcode_number: 3
pattern: "Sliding Window"
frequency_tier: 1
companies: [Google, Amazon, Meta, Microsoft]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Longest Substring Without Repeating Characters / Chuỗi Con Dài Nhất Không Lặp Ký Tự

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 🔥 Tier 1 — bài sliding window kinh điển, hỏi ở hầu hết mọi vòng phỏng vấn
> **Target**: ⏱️ 20 min | **Companies**: Google, Amazon, Meta, Microsoft
> **See also**: [Find All Anagrams](./19-find-all-anagrams-in-string.md) | [Minimum Window Substring](./15-minimum-window-substring.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn nhìn qua cửa sổ trượt trên tờ giấy có chữ. Cửa sổ chỉ cho phép ký tự không trùng. Khi ký tự trùng xuất hiện bên phải, trượt cạnh trái sang đến khi loại bỏ ký tự trùng. Ghi lại kích thước lớn nhất.

**Pattern Recognition:**

- Signal: "longest substring" + "without repeating" → **Sliding Window + Hash Map**
- Map lưu vị trí cuối cùng mỗi ký tự → khi gặp trùng, nhảy `left` đến sau vị trí đó
- Key trick: `left = Math.max(left, map.get(ch)! + 1)` — không bao giờ lùi left

**Visual — "abcabcbb":**

```
right=0(a): map={a:0}, window=[a],   max=1
right=1(b): map={b:1}, window=[ab],  max=2
right=2(c): map={c:2}, window=[abc], max=3
right=3(a): a@0 → left=1, window=[bca], max=3
right=4(b): b@1 → left=2, window=[cab], max=3
right=5(c): c@2 → left=3, window=[abc], max=3
right=6(b): b@4 → left=5, window=[cb],  max=3
right=7(b): b@6 → left=7, window=[b],   max=3
Answer: 3
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                                  |
| ---------------- | ------------------------------------------------------------------------- |
| **When you see** | "longest substring", "no repeating", "unique characters window"           |
| **Think**        | Sliding Window — expand right, shrink left on duplicate                   |
| **Template**     | `left=0; for(right) { left=max(left, map.get(ch)+1); map.set(ch,right) }` |
| **Time target**  | ⏱️ 20 min (Medium)                                                        |

> 💡 **Memory hook / Móc nhớ:** "Cửa sổ mở phải, đóng trái — gặp trùng thì nhảy left, không bao giờ lùi!"

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

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "Let me make sure I understand. We have a string.
> We need the length of the longest substring with all unique characters.
> Clarification: ASCII only or Unicode? Do we need the substring itself or just the length?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "Brute force: check all O(n²) substrings with a Set — O(n²) time.
> But I notice we can use a sliding window: expand right, and when we hit a duplicate,
> jump left past the previous occurrence using a Map. That's O(n) time, O(min(n,m)) space."

### Step 3 — Implement / Viết Code (5-7 min)

> "I'll maintain a Map of character→last-seen-index and a left pointer.
> For each right character: if seen before, update left = max(left, lastSeen+1).
> Update map and track max window size."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace: 'abcabcbb'. left=0.
> right=0(a): map={a:0}, max=1. right=1(b): max=2. right=2(c): max=3.
> right=3(a): a seen at 0, left=1, max=3.
> right=6(b): b seen at 4, left=5, max=3. Final: 3. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(n) — one pass, each char visited once. Space: O(min(n,m)) — map of charset.
> Edge cases: empty string → 0, all same chars → 1, all unique → n.
> Key insight: left never moves backward, ensuring O(n) total."

---

## 📝 Interview Tips

1. **Clarify**: ASCII or Unicode charset? / Chỉ ASCII hay cả Unicode?
2. **Brute force**: All O(n²) substrings + Set check — O(n²) / Duyệt tất cả cặp i,j
3. **Optimize**: Sliding window + Map for jump — O(n) / Nhảy thẳng, không lùi từng bước
4. **Edge cases**: Empty string → 0; all same chars → 1 / Chuỗi rỗng, toàn ký tự giống
5. **Follow-up**: Return actual substring, not just length / Trả về chuỗi con thay vì độ dài

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                  | Why Wrong / Tại sao sai                                  | Fix / Cách sửa                                 |
| --- | ---------------------------------- | -------------------------------------------------------- | ---------------------------------------------- |
| 1   | Move left one step at a time       | O(n²) worst case — e.g., "abcabc" backtracks left slowly | Jump: `left = max(left, map.get(ch)+1)`        |
| 2   | Forget `Math.max(left, ...)` guard | Left can go backward if old index < current left         | Always use max to prevent left from retreating |
| 3   | Use Set instead of Map             | Set tracks existence but not position — can't jump left  | Map stores index for O(1) jump                 |

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Check Every Substring
 * Time: O(n²) — n starting positions, up to n chars each
 * Space: O(min(n, m)) — Set holds current window chars
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
 * Solution 2: Sliding Window with Map (Optimal)
 * Time: O(n) — each character processed at most twice
 * Space: O(min(n, m)) — Map holds at most charset-size entries
 */
function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>();
  let max = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (lastSeen.has(ch)) {
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
- [Minimum Window Substring](./15-minimum-window-substring.md) — sliding window nâng cao
- [Sliding Window Maximum](./17-sliding-window-maximum.md) — sliding window + deque
- [Substring with Concatenation](https://leetcode.com/problems/substring-with-concatenation-of-all-words/) — sliding window + HashMap

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 20 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
