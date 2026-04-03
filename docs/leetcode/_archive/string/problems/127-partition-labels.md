---
layout: page
title: "Partition Labels"
difficulty: Medium
category: String
tags: [Hash Table, Two Pointers, String, Greedy]
leetcode_url: "https://leetcode.com/problems/partition-labels"
---

# Partition Labels / Phân Vùng Nhãn

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Last Occurrence Map
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Ví dụ thực tế:** Bạn đang chia hành lý cho nhiều xe — mỗi loại đồ vật (mỗi chữ cái) chỉ được ở trên một xe. Bạn phải xác định xe chở tới ít nhất là chỗ cuối cùng xuất hiện của mọi đồ vật trong xe đó. Greedy: kéo dài partition cho đến khi tất cả ký tự trong vùng đã "kín".

**Pattern Recognition:**

- `"each letter appears in at most one part"` → Last occurrence map + greedy extend
- Duy trì `end` = furthest last occurrence trong partition hiện tại
- Khi `i == end` → kết thúc partition hiện tại, bắt đầu cái mới

**Visual:**

```
s = "ababcbacadefegdehijhklij"
Last occurrence: a=8,b=5,c=7,d=14,e=15,f=11,g=13,h=19,i=22,j=23,k=20,l=21

i=0 'a': end=max(0,8)=8
i=1 'b': end=max(8,5)=8
...
i=8 'a': end=8 → i==end → PARTITION [0..8], size=9

i=9  'd': end=14
i=10 'e': end=15
...
i=15 'e': end=15 → i==end → PARTITION [9..15], size=7

i=16 'h': end=19 ...
i=23 'j': end=23 → PARTITION [16..23], size=8

Result: [9, 7, 8]
```

## Problem Description

Given string `s`, partition it into as many parts as possible so that **each letter appears in at most one part**. Return a list of the sizes of these parts.

Examples: `"ababcbacadefegdehijhklij"` → `[9,7,8]` | `"eccbbbbdec"` → `[10]`.

## 📝 Interview Tips

1. **Clarify**: Partition phải liền nhau không? / Yes, partitions must be contiguous substrings
2. **Approach**: Last occurrence map → greedy extend end pointer / Two-pass: build map, then scan
3. **Edge cases**: Single character → [1]; all same char → [n] / Handle single-char strings
4. **Optimize**: One HashMap pass + one scan pass = O(n) / Already optimal after map build
5. **Follow-up**: Nếu cần trả về strings thay vì lengths? / Slice using start+size
6. **Complexity**: O(n) time, O(1) space (26 letters fixed) / Fixed alphabet = O(1) space

## Solutions

```typescript
/** Solution 1: Last Occurrence + Greedy Extend (Optimal)
 * Time: O(n) | Space: O(1) — 26 letters at most
 */
function partitionLabels(s: string): number[] {
  // Step 1: record last occurrence of each character
  const last: Record<string, number> = {};
  for (let i = 0; i < s.length; i++) {
    last[s[i]] = i;
  }

  const result: number[] = [];
  let start = 0;
  let end = 0;

  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last[s[i]]); // extend partition to cover s[i]'s last occurrence
    if (i === end) {
      result.push(end - start + 1);
      start = i + 1;
    }
  }

  return result;
}

/** Solution 2: Interval Merge Approach
 * Time: O(n) | Space: O(26) = O(1)
 * Build [first, last] intervals for each char, merge overlapping intervals
 */
function partitionLabelsIntervals(s: string): number[] {
  const first: number[] = new Array(26).fill(-1);
  const lastArr: number[] = new Array(26).fill(-1);

  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i) - 97;
    if (first[c] === -1) first[c] = i;
    lastArr[c] = i;
  }

  // Collect intervals that actually appear
  const intervals: [number, number][] = [];
  for (let c = 0; c < 26; c++) {
    if (first[c] !== -1) intervals.push([first[c], lastArr[c]]);
  }
  intervals.sort((a, b) => a[0] - b[0]);

  const result: number[] = [];
  let curStart = intervals[0][0];
  let curEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] <= curEnd) {
      curEnd = Math.max(curEnd, intervals[i][1]);
    } else {
      result.push(curEnd - curStart + 1);
      curStart = intervals[i][0];
      curEnd = intervals[i][1];
    }
  }
  result.push(curEnd - curStart + 1);
  return result;
}

// Tests
console.log(partitionLabels("ababcbacadefegdehijhklij")); // [9, 7, 8]
console.log(partitionLabels("eccbbbbdec")); // [10]
console.log(partitionLabels("a")); // [1]
console.log(partitionLabels("ab")); // [1, 1]
console.log(partitionLabelsIntervals("ababcbacadefegdehijhklij")); // [9, 7, 8]
```

## 🔗 Related Problems

| Problem                                                                              | Relationship                       |
| ------------------------------------------------------------------------------------ | ---------------------------------- |
| [Merge Intervals](https://leetcode.com/problems/merge-intervals)                     | Same interval-merge strategy       |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals) | Greedy on interval endpoints       |
| [Hand of Straights](https://leetcode.com/problems/hand-of-straights)                 | Greedy grouping by last occurrence |
