---
layout: page
title: "Sort Characters By Frequency"
difficulty: Medium
category: Sorting-Searching
tags: [Hash Table, String, Sorting, Heap (Priority Queue), Bucket Sort]
leetcode_url: "https://leetcode.com/problems/sort-characters-by-frequency"
---

# Sort Characters By Frequency / Sắp Xếp Ký Tự Theo Tần Suất

> **Difficulty**: 🟡 Medium | **Category**: Sorting-Searching | **Pattern**: Frequency Sort / Bucket Sort

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Như đếm số lần xuất hiện của từng chữ cái trong một bài thơ rồi viết lại — viết chữ xuất hiện nhiều nhất trước, lặp lại đúng số lần, sau đó đến chữ ít hơn.

**Pattern Recognition:**

- Count char frequency → sort by count descending → rebuild string → **Bucket/Heap Sort**
- Multiple solutions: HashMap + sort, bucket sort O(n), or max-heap
- Key: high-frequency chars cluster together in output

**Visual:**

```
s = "tree"
freq: {t:1, r:1, e:2}
Sort desc by freq: [(e,2),(t,1),(r,1)]
Build: "ee" + "t" + "r" = "eetr"  (or "eetr", "eetr" valid)

s = "cccaaa"
freq: {c:3, a:3}
Build: "cccaaa" or "aaaccc"  (both valid)
```

## Problem Description

Given string `s`, sort it so that characters with higher frequency appear before those with lower frequency. If two characters have same frequency, their order is arbitrary. Return the sorted string.

**Example:**

- s="tree" → "eert" or "eetr"
- s="cccaaa" → "aaaccc" or "cccaaa"
- s="Aabb" → "bbAa" or "bbaA"

**Constraints:** 1 ≤ s.length ≤ 5×10⁵, s consists of uppercase/lowercase letters and digits

## 📝 Interview Tips

1. **Clarify**: Does 'A' and 'a' count separately? (Yes, they are distinct characters)
2. **Approach**: Count with Map, sort entries by frequency desc, build result string
3. **Edge cases**: All same character, all distinct characters, mixed case
4. **Optimize**: Bucket sort O(n) since max frequency ≤ n
5. **Follow-up**: What if equal-frequency chars must maintain original relative order?
6. **Complexity**: Time O(n log n) with sort, O(n) with bucket; Space O(n)

## Solutions

```typescript
// Solution 1: HashMap + Sort — Time: O(n log n) | Space: O(n)
function frequencySort(s: string): string {
  const freq = new Map<string, number>();
  for (const c of s) freq.set(c, (freq.get(c) ?? 0) + 1);

  const entries = [...freq.entries()].sort((a, b) => b[1] - a[1]);

  let result = "";
  for (const [char, count] of entries) {
    result += char.repeat(count);
  }
  return result;
}

// Solution 2: Bucket Sort — Time: O(n) | Space: O(n)
function frequencySort2(s: string): string {
  const freq = new Map<string, number>();
  for (const c of s) freq.set(c, (freq.get(c) ?? 0) + 1);

  // Bucket[i] = list of chars with frequency i
  const buckets: string[][] = new Array(s.length + 1).fill(null).map(() => []);
  for (const [char, cnt] of freq) {
    buckets[cnt].push(char);
  }

  let result = "";
  for (let f = s.length; f >= 1; f--) {
    for (const char of buckets[f]) {
      result += char.repeat(f);
    }
  }
  return result;
}

// Solution 3: Max-Heap (simulated) — Time: O(n log k) | Space: O(n)
function frequencySort3(s: string): string {
  const freq = new Map<string, number>();
  for (const c of s) freq.set(c, (freq.get(c) ?? 0) + 1);

  // Sort descending by frequency (simulate max-heap with sort)
  const sorted = [...freq.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]); // stable tie-break
  });

  const parts: string[] = [];
  for (const [char, count] of sorted) {
    parts.push(char.repeat(count));
  }
  return parts.join("");
}

// Tests
console.log(frequencySort("tree")); // "eert" or "eetr"
console.log(frequencySort("cccaaa")); // "aaaccc" or "cccaaa"
console.log(frequencySort("Aabb")); // "bbAa" or "bbaA"
console.log(frequencySort("2a554442f42")); // "44444255a2f" or similar
console.log(frequencySort("a")); // "a"
```

## 🔗 Related Problems

| Problem                                                                                                           | Relationship                        |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements)                                  | Frequency counting + selection      |
| [Least Number of Unique Integers](https://leetcode.com/problems/least-number-of-unique-integers-after-k-removals) | Greedy on frequency counts          |
| [Reorganize String](https://leetcode.com/problems/reorganize-string)                                              | Frequency-based string construction |
