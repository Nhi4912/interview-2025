---
layout: page
title: "Reorganize String"
difficulty: Medium
category: Sorting-Searching
tags: [Hash Table, String, Greedy, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/reorganize-string"
---

# Reorganize String / Sắp Xếp Lại Chuỗi Không Có Ký Tự Liền Kề

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Counting
> **Frequency**: 📘 Tier 3 — Gặp ở 20+ companies
> **See also**: [Task Scheduler](https://leetcode.com/problems/task-scheduler) | [Rearrange String k Distance Apart](https://leetcode.com/problems/rearrange-string-k-distance-apart)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Sắp ghế ngồi cho học sinh: nhóm đông nhất cần ngồi xen kẽ nhóm khác. Đặt nhóm đông nhất vào các vị trí chẵn (0, 2, 4…), rồi điền các nhóm còn lại vào vị trí lẻ.

**Pattern Recognition:**

- Signal: "no two adjacent same char" → **Greedy đặt ký tự phổ biến nhất trước**
- Impossible nếu `maxFreq > ceil(n / 2)` — ký tự chiếm quá nhiều chỗ
- Hai cách: (1) Sort by freq + interleave; (2) Max-heap greedily pick next

**Visual — `s="aab"` (freq: a=2, b=1, n=3):**

```
Sort by freq: ['a'×2, 'b'×1]
Positions:    [0, 1, 2]

Place 'a' at even indices: result[0]='a', result[2]='a'
Place 'b' at odd  indices: result[1]='b'

Result: "aba" ✅

Impossible case: "aaab" → maxFreq(a)=3 > ceil(4/2)=2 → return ""
```

---

## Problem Description

Given a string `s`, rearrange its characters so that no two adjacent characters are the same. Return any valid rearrangement, or `""` if impossible. ([LeetCode 767](https://leetcode.com/problems/reorganize-string))

**Example 1:** `s="aab"` → `"aba"`
**Example 2:** `s="aaab"` → `""` (impossible: 'a' appears 3 times in length 4)

**Constraints:** `1 ≤ s.length ≤ 500`, lowercase English letters only

---

## 📝 Interview Tips

1. **Clarify**: "Nhiều đáp án hợp lệ → trả bất kỳ đáp án nào" / Multiple valid answers; return any one
2. **Feasibility**: "Bài không thể giải khi `maxFreq > ⌈n/2⌉`" / Impossible when most-frequent char > half
3. **Even/odd trick**: "Đặt ký tự phổ biến nhất vào chỉ số chẵn trước, rồi lẻ — đảm bảo không liền kề" / Place most frequent at even indices guarantees non-adjacent
4. **Heap approach**: "Max-heap: mỗi bước lấy ký tự phổ biến nhất, nếu trùng với trước → lấy cái phổ biến thứ hai" / Greedy with heap: always pick most frequent that isn't same as previous
5. **Edge cases**: "s.length=1 → luôn hợp lệ; tất cả cùng ký tự và n>1 → rỗng" / Single char always valid; all-same and n>1 impossible
6. **Follow-up**: "Nếu k khoảng cách thay vì 1 → heap + cooldown queue" / k-distance variant uses heap + cooldown window

---

## Solutions

```typescript
/**
 * Solution 1: Sort by Frequency + Place at Even/Odd Indices
 * Count frequencies. If maxFreq > ceil(n/2), impossible.
 * Otherwise sort chars by frequency descending, fill even indices first then odd.
 * Time: O(n + 26 log 26) = O(n) — count + sort 26 chars + fill
 * Space: O(n) — result array
 */
function reorganizeString(s: string): string {
  const freq = new Array(26).fill(0);
  for (const c of s) freq[c.charCodeAt(0) - 97]++;

  // Check feasibility
  const maxFreq = Math.max(...freq);
  if (maxFreq > Math.ceil(s.length / 2)) return "";

  // Sort chars by frequency descending
  const sorted = freq
    .map((f, i) => [f, i] as [number, number])
    .filter(([f]) => f > 0)
    .sort((a, b) => b[0] - a[0]);

  const res = new Array(s.length).fill("");
  let pos = 0; // current fill position (even first, then odd)

  for (const [count, charIdx] of sorted) {
    const ch = String.fromCharCode(charIdx + 97);
    for (let i = 0; i < count; i++) {
      if (pos >= s.length) pos = 1; // switch to odd positions
      res[pos] = ch;
      pos += 2;
    }
  }

  return res.join("");
}

/**
 * Solution 2: Max-Heap Greedy
 * Always pick the most frequent character that differs from the previous.
 * If top of heap matches previous, use second-most frequent temporarily.
 * Simulated with array-based manual heap for clarity.
 * Time: O(n log 26) = O(n) — n steps × O(log 26) heap ops
 * Space: O(26) = O(1) — heap has at most 26 entries
 */
function reorganizeStringHeap(s: string): string {
  const freq = new Array(26).fill(0);
  for (const c of s) freq[c.charCodeAt(0) - 97]++;

  // Max-heap: [frequency, charCode]
  const heap: [number, number][] = [];
  for (let i = 0; i < 26; i++) {
    if (freq[i] > 0) heap.push([freq[i], i]);
  }
  heap.sort((a, b) => b[0] - a[0]); // initial sort (small heap, O(26 log 26))

  const result: string[] = [];
  while (heap.length > 0) {
    const [f1, c1] = heap.shift()!;
    if (result.length === 0 || result[result.length - 1] !== String.fromCharCode(c1 + 97)) {
      result.push(String.fromCharCode(c1 + 97));
      if (f1 > 1) {
        heap.push([f1 - 1, c1]);
        heap.sort((a, b) => b[0] - a[0]);
      }
    } else {
      // Can't use c1 right now — need the next most frequent
      if (heap.length === 0) return ""; // impossible
      const [f2, c2] = heap.shift()!;
      result.push(String.fromCharCode(c2 + 97));
      if (f2 > 1) heap.push([f2 - 1, c2]);
      heap.push([f1, c1]); // put c1 back
      heap.sort((a, b) => b[0] - a[0]);
    }
  }

  return result.join("");
}

// === Test Cases ===
console.log(reorganizeString("aab")); // "aba"
console.log(reorganizeString("aaab")); // ""
console.log(reorganizeString("a")); // "a"
console.log(reorganizeString("aabb")); // "abab" or "baba"
console.log(reorganizeStringHeap("aab")); // "aba"
console.log(reorganizeStringHeap("aaab")); // ""
```

---

## 🔗 Related Problems

| Problem                                                                                                | Pattern               | Difficulty |
| ------------------------------------------------------------------------------------------------------ | --------------------- | ---------- |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                                         | Greedy + cooldown     | 🟡 Medium  |
| [Rearrange String k Distance Apart](https://leetcode.com/problems/rearrange-string-k-distance-apart)   | Heap + cooldown queue | 🔴 Hard    |
| [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency)             | Sort by freq          | 🟡 Medium  |
| [Construct String With Repeat Limit](https://leetcode.com/problems/construct-string-with-repeat-limit) | Heap + limit          | 🟡 Medium  |
