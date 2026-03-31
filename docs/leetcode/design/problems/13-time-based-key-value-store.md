---
layout: page
title: "Time Based Key-Value Store"
difficulty: Medium
category: Design
tags: [Hash Table, String, Binary Search, Design]
leetcode_url: "https://leetcode.com/problems/time-based-key-value-store"
---

# Time Based Key-Value Store / Time Based Key-Value Store

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: ⭐ Tier 2 — Gặp ở 21+ companies
> **See also**: [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree) | [Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng tìm một trang trong từ điển — bạn mở giữa, xem số trang, rồi chọn nửa phù hợp. Mỗi lần giảm một nửa phạm vi tìm kiếm.

**Pattern Recognition:**

- Signal: "sorted" + "find target/position" → **Binary Search**
- Bài này thuộc dạng Binary Search — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Time Based Key-Value Store example:**

```
[1, 3, 5, 7, 9, 11, 13]
 L        M            R

Step 1: mid = (L+R)/2, check condition
Step 2: condition true → move L = mid+1 (or R = mid-1)
Step N: L meets R → answer found ✅
```

---

## Problem Description

Time Based Key-Value Store. ([LeetCode](https://leetcode.com/problems/time-based-key-value-store))

Difficulty: Medium | Acceptance: 49.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/time-based-key-value-store) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Input đã sorted? Cần tìm vị trí chính xác hay boundary?" / Is input sorted? Exact match or boundary?
2. **Brute force**: "Linear scan O(n)" → optimize with binary search O(log n) / Start linear, suggest binary
3. **Optimize**: "Chú ý lo/hi boundary: lo <= hi hay lo < hi? mid±1 hay mid?" / Watch boundary conditions carefully
4. **Edge cases**: "Mảng rỗng, một phần tử, target không tồn tại, overflow mid" / Empty, single, not found, overflow

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function timeBasedKeyValueStoreBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Binary Search
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function timeBasedKeyValueStore(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Binary Search
  // Hint: Define search space, determine which half to discard
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(timeBasedKeyValueStore(/* example 1 */)); // expected
// console.log(timeBasedKeyValueStore(/* example 2 */)); // expected
// console.log(timeBasedKeyValueStore(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree) — same pattern: Trie
- [Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system) — same pattern: Trie
- [Snapshot Array](https://leetcode.com/problems/snapshot-array) — same pattern: Binary Search
- [Design Excel Sum Formula](https://leetcode.com/problems/design-excel-sum-formula) — same pattern: Topological Sort
- [Time Based Key-Value Store — LeetCode](https://leetcode.com/problems/time-based-key-value-store) — problem page
