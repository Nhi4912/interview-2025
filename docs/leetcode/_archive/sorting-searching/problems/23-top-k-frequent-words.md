---
layout: page
title: "Top K Frequent Words"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, String, Trie, Sorting]
leetcode_url: "https://leetcode.com/problems/top-k-frequent-words"
---

# Top K Frequent Words / K Từ Xuất Hiện Nhiều Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Heap / Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 11 companies
> **See also**: [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency) | [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Giống bình chọn nhạc hội — đếm phiếu bầu từng bài, lấy k bài có nhiều phiếu nhất. Nếu bằng phiếu thì xếp theo abc. HashMap đếm, sort/heap chọn top-k.

**Pattern Recognition:** Đếm tần suất → top-k với tie-break → HashMap + sort hoặc min-heap kích thước k.

```
words = ["the","day","is","good","day","is","is"]
freq : { the:1, day:2, is:3, good:1 }
k = 2
sort by (-freq, alpha): ["is"(3), "day"(2), ...]
result: ["is", "day"]
```

---

## 📋 Problem / Bài Toán

Given an array of strings `words` and integer `k`, return the `k` most frequent words sorted by frequency (descending). If two words have the same frequency, sort them **lexicographically** (ascending).

- `words=["i","love","leetcode","i","love","coding"], k=2` → `["i","love"]`
- `words=["the","day","is","good","day","is","is","a"],  k=4` → `["is","day","a","good"]`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Dual sort key**: Sort by `(-freq, word)` — âm tần suất để desc, từ để lexicographic asc.
- 🔑 **Nhận biết**: "Top-k" + "tần suất" → HashMap đếm + sort hoặc heap; k nhỏ → heap tiết kiệm hơn.
- ⚡ **Min-heap O(n log k)**: Giữ heap kích thước k — chỉ xử lý k phần tử, tốt khi k << n.
- ⚡ **Bucket sort O(n)**: Tạo bucket theo freq, duyệt từ cao xuống — tránh hoàn toàn việc sort.
- 🚨 **Tie-break**: Luôn hỏi interviewer về tie-break; bài này dùng lexicographic order.
- 💡 **Follow-up**: "Streaming data?" → dùng min-heap liên tục cập nhật thay vì sort toàn bộ.

---

## Solutions

### Solution 1 — HashMap + Sort · O(n log n) time · O(n) space

```typescript
/**
 * Count frequencies, then sort with custom comparator (desc freq, asc lex).
 * Time: O(n log n) | Space: O(n)
 */
function topKFrequent_sort(words: string[], k: number): string[] {
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
  return [...freq.keys()]
    .sort((a, b) => {
      const diff = (freq.get(b) ?? 0) - (freq.get(a) ?? 0);
      return diff !== 0 ? diff : a.localeCompare(b);
    })
    .slice(0, k);
}

console.log(topKFrequent_sort(["i", "love", "leetcode", "i", "love", "coding"], 2)); // ["i","love"]
console.log(topKFrequent_sort(["the", "day", "is", "good", "day", "is", "is", "a"], 4)); // ["is","day","a","good"]
```

### Solution 2 — HashMap + Min-Heap (size k) · O(n log k) time · O(n) space

```typescript
/**
 * Maintain a min-heap of size k. Heap ordered by (freq asc, lex desc)
 * so the "worst" candidate sits at top and can be evicted easily.
 * Time: O(n log k) | Space: O(n)
 */
function topKFrequent_heap(words: string[], k: number): string[] {
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);

  // Simulate min-heap with sorted array (acceptable for interview)
  const heap: string[] = [];
  for (const word of freq.keys()) {
    heap.push(word);
    // keep sorted: worst element (lowest freq, highest lex) at end for O(1) removal
    heap.sort((a, b) => {
      const diff = (freq.get(a) ?? 0) - (freq.get(b) ?? 0);
      return diff !== 0 ? diff : b.localeCompare(a);
    });
    if (heap.length > k) heap.shift(); // remove worst
  }
  // heap now has k best; sort for output order
  return heap.sort((a, b) => {
    const diff = (freq.get(b) ?? 0) - (freq.get(a) ?? 0);
    return diff !== 0 ? diff : a.localeCompare(b);
  });
}

console.log(topKFrequent_heap(["i", "love", "leetcode", "i", "love", "coding"], 2)); // ["i","love"]
console.log(topKFrequent_heap(["the", "day", "is", "good", "day", "is", "is", "a"], 4)); // ["is","day","a","good"]
```

### Solution 3 — Bucket Sort · O(n) time · O(n) space

```typescript
/**
 * Bucket by frequency (index = freq), collect from high to low.
 * Within same freq, sort lexicographically.
 * Time: O(n) | Space: O(n)
 */
function topKFrequent(words: string[], k: number): string[] {
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);

  const buckets: string[][] = Array.from({ length: words.length + 1 }, () => []);
  for (const [word, f] of freq) buckets[f].push(word);

  const result: string[] = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    if (buckets[i].length) {
      buckets[i].sort(); // lexicographic within same freq
      for (const w of buckets[i]) {
        if (result.length < k) result.push(w);
      }
    }
  }
  return result;
}

console.log(topKFrequent(["i", "love", "leetcode", "i", "love", "coding"], 2)); // ["i","love"]
console.log(topKFrequent(["the", "day", "is", "good", "day", "is", "is", "a"], 4)); // ["is","day","a","good"]
console.log(topKFrequent(["a"], 1)); // ["a"]
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                          | Difficulty | Pattern            |
| ------------------------------------------------------------------------------------------------ | ---------- | ------------------ |
| [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements)                 | 🟡 Medium  | Bucket Sort / Heap |
| [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency)       | 🟡 Medium  | Bucket Sort        |
| [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin)           | 🟡 Medium  | Heap               |
| [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) | 🟡 Medium  | Heap / Quickselect |
