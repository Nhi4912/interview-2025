---
layout: page
title: "Add Bold Tag in String"
difficulty: Medium
category: String
tags: [Array, Hash Table, String, Trie, String Matching]
leetcode_url: "https://leetcode.com/problems/add-bold-tag-in-string"
---

# Add Bold Tag in String / Thêm Thẻ Bold Vào Chuỗi

🟡 Medium | Array, Hash Table, String, Trie, String Matching

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Giống như dùng bút dạ quang nhiều màu trên văn bản — mỗi từ trong `words` đánh dấu một vùng. Sau khi tô hết, gộp các vùng chồng lặp, rồi bọc bằng thẻ `<b>`.

```
s = "abcxyz123"  words = ["abc","123"]

Mark:  a b c x y z 1 2 3
bold:  1 1 1 0 0 0 1 1 1

Merge → [0,3) and [6,9)
Result: "<b>abc</b>xyz<b>123</b>"
```

## Problem Description

Given a string `s` and an array of strings `words`, add `<b>` and `</b>` tags around each substring of `s` that is a substring equal to any word in `words`. Overlapping or adjacent bold ranges should be merged into one bold tag.

- **Example 1:** `s = "abcxyz123"`, `words = ["abc","123"]` → `"<b>abc</b>xyz<b>123</b>"`
- **Example 2:** `s = "aaabbcc"`, `words = ["aaa","aab","bc"]` → `"<b>aaabbc</b>c"`

## 📝 Interview Tips

- **🇻🇳 Mảng bold boolean** — đánh dấu từng ký tự / Boolean bold array marks each character
- **🇻🇳 Tìm kiếm tất cả occurrences** — indexOf trong vòng lặp / Find all occurrences with indexOf loop
- **🇻🇳 Gộp vùng** — bold[i] || bold[i] đã được set bởi nhiều từ / Ranges auto-merge via boolean OR
- **🇻🇳 Xây dựng kết quả** — duyệt mảng bold, mở/đóng thẻ khi chuyển trạng thái / Build result by detecting state transitions
- **🇻🇳 Trie approach** — nhanh hơn khi `words` lớn, O(n \* maxWordLen) / Trie is faster for large word sets
- **🇻🇳 Edge case** → từ xuất hiện nhiều lần, từ lồng nhau / Multiple occurrences, nested words

## Solutions

### Solution 1: Boolean Array + Merge (Optimal for Interviews)

```typescript
/**
 * Mark bold positions with boolean array, then build result
 * Time: O(n * m * L)  Space: O(n)
 * n = s.length, m = words.length, L = avg word length
 */
function addBoldTag(s: string, words: string[]): string {
  const n = s.length;
  const bold = new Array(n).fill(false);

  // Mark all positions covered by any word
  for (const word of words) {
    const wLen = word.length;
    let idx = s.indexOf(word);
    while (idx !== -1) {
      for (let i = idx; i < idx + wLen; i++) {
        bold[i] = true;
      }
      idx = s.indexOf(word, idx + 1);
    }
  }

  // Build result with tags
  let result = "";
  for (let i = 0; i < n; i++) {
    if (bold[i] && (i === 0 || !bold[i - 1])) {
      result += "<b>";
    }
    result += s[i];
    if (bold[i] && (i === n - 1 || !bold[i + 1])) {
      result += "</b>";
    }
  }

  return result;
}

// Test cases
console.log(addBoldTag("abcxyz123", ["abc", "123"]));
// "<b>abc</b>xyz<b>123</b>"

console.log(addBoldTag("aaabbcc", ["aaa", "aab", "bc"]));
// "<b>aaabbc</b>c"

console.log(addBoldTag("aaabbcc", ["aab", "bc"]));
// "aa<b>abbc</b>c"

console.log(addBoldTag("abc", ["a", "b", "c"]));
// "<b>abc</b>"
```

### Solution 2: Interval Merging + Bold Array

```typescript
/**
 * Collect intervals, merge overlapping ones, then apply tags
 * Time: O(n * m * L + n log n)  Space: O(n)
 */
function addBoldTagV2(s: string, words: string[]): string {
  const intervals: [number, number][] = [];

  for (const word of words) {
    let idx = s.indexOf(word);
    while (idx !== -1) {
      intervals.push([idx, idx + word.length - 1]);
      idx = s.indexOf(word, idx + 1);
    }
  }

  // Sort and merge intervals
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const [start, end] of intervals) {
    if (merged.length > 0 && start <= merged[merged.length - 1][1] + 1) {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], end);
    } else {
      merged.push([start, end]);
    }
  }

  // Build result from merged intervals
  let result = "";
  let prev = 0;
  for (const [start, end] of merged) {
    result += s.slice(prev, start) + "<b>" + s.slice(start, end + 1) + "</b>";
    prev = end + 1;
  }
  result += s.slice(prev);

  return result;
}

// Test cases
console.log(addBoldTagV2("abcxyz123", ["abc", "123"]));
// "<b>abc</b>xyz<b>123</b>"

console.log(addBoldTagV2("aaabbcc", ["aaa", "aab", "bc"]));
// "<b>aaabbc</b>c"
```

### Solution 3: Max-End Sweep with Single Pass

```typescript
/**
 * Track max bold end position as we sweep
 * Time: O(n * m * L)  Space: O(n)
 */
function addBoldTagV3(s: string, words: string[]): string {
  const n = s.length;
  const bold = new Array(n).fill(false);

  for (let i = 0; i < n; i++) {
    for (const word of words) {
      if (s.startsWith(word, i)) {
        for (let j = i; j < i + word.length; j++) {
          bold[j] = true;
        }
      }
    }
  }

  const parts: string[] = [];
  let i = 0;
  while (i < n) {
    if (!bold[i]) {
      let j = i;
      while (j < n && !bold[j]) j++;
      parts.push(s.slice(i, j));
      i = j;
    } else {
      let j = i;
      while (j < n && bold[j]) j++;
      parts.push("<b>" + s.slice(i, j) + "</b>");
      i = j;
    }
  }

  return parts.join("");
}

// Test cases
console.log(addBoldTagV3("abcxyz123", ["abc", "123"]));
// "<b>abc</b>xyz<b>123</b>"
```

## 🔗 Related Problems

| Problem                                                                     | Difficulty | Similarity                      |
| --------------------------------------------------------------------------- | ---------- | ------------------------------- |
| [Tag Validator](https://leetcode.com/problems/tag-validator/)               | 🔴 Hard    | HTML tag parsing                |
| [Merge Intervals](https://leetcode.com/problems/merge-intervals/)           | 🟡 Medium  | Interval merging                |
| [Multi Search](https://leetcode.com/problems/multi-search-lcci/)            | 🟡 Medium  | Multiple pattern search         |
| [Bold Words in String](https://leetcode.com/problems/bold-words-in-string/) | 🟡 Medium  | Exact duplicate of this problem |
