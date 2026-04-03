---
layout: page
title: "Least Number of Unique Integers after K Removals"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Greedy, Sorting, Counting]
leetcode_url: "https://leetcode.com/problems/least-number-of-unique-integers-after-k-removals"
---

# Least Number of Unique Integers after K Removals / Ít Số Nguyên Duy Nhất Nhất Sau K Lần Xóa

> **Difficulty**: 🟡 Medium | **Category**: Sorting-Searching | **Pattern**: Greedy + Frequency Sort

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Như dọn kệ sách — để giảm số loại sách nhiều nhất với ít công nhất, hãy loại bỏ hoàn toàn loại sách có ít cuốn nhất trước.

**Pattern Recognition:**

- Remove fewest elements → eliminate types with lowest frequency first → **Greedy**
- Count frequencies, sort by count ascending → remove whole groups greedily
- Stop when k runs out mid-group

**Visual:**

```
arr=[4,3,1,1,3,3,2], k=3
Freq: {4:1, 2:1, 1:2, 3:3}
Sort by freq: [1,1,2,3]  (counts: 1,1,2,3)

k=3: remove all 4s (freq=1) → k=2, uniques=3
     remove all 2s (freq=1) → k=1, uniques=2
     remove 1 of 1s (freq=2) → k=-1, stop!
Remaining uniques = 2
```

## Problem Description

Given an integer array `arr` and integer `k`, remove exactly `k` elements from the array (any elements you choose). Return the minimum number of **unique integers** remaining after removals.

**Example:**

- arr=[5,5,4], k=1 → 1 (remove one 5, leaving [5,4] or remove 4 leaving [5,5])
- arr=[4,3,1,1,3,3,2], k=3 → 2

**Constraints:** 1 ≤ arr.length ≤ 10⁵, 1 ≤ arr[i] ≤ 10⁹, 0 ≤ k ≤ arr.length

## 📝 Interview Tips

1. **Clarify**: Can we remove the same element multiple times? (each removal is one occurrence)
2. **Approach**: Count frequencies, sort ascending, greedily remove lowest-frequency types first
3. **Edge cases**: k=0 (return all unique count), k=arr.length (return 0), all elements same
4. **Optimize**: Bucket sort possible since max freq ≤ n — reduces to O(n)
5. **Follow-up**: What if we want to maximize unique integers instead?
6. **Complexity**: Time O(n log n), Space O(n)

## Solutions

```typescript
// Solution 1: Greedy + Sort by Frequency — Time: O(n log n) | Space: O(n)
function findLeastNumOfUniqueInts(arr: number[], k: number): number {
  const freq = new Map<number, number>();
  for (const num of arr) {
    freq.set(num, (freq.get(num) ?? 0) + 1);
  }

  // Sort frequencies ascending: eliminate cheapest types first
  const counts = [...freq.values()].sort((a, b) => a - b);
  let remaining = counts.length;

  for (const cnt of counts) {
    if (k >= cnt) {
      k -= cnt;
      remaining--;
    } else {
      break; // can't fully eliminate this type
    }
  }

  return remaining;
}

// Solution 2: Bucket Sort — Time: O(n) | Space: O(n)
function findLeastNumOfUniqueInts2(arr: number[], k: number): number {
  const freq = new Map<number, number>();
  for (const num of arr) {
    freq.set(num, (freq.get(num) ?? 0) + 1);
  }

  // Bucket: bucket[i] = number of unique integers with frequency i
  const n = arr.length;
  const bucket = new Array(n + 1).fill(0);
  for (const cnt of freq.values()) {
    bucket[cnt]++;
  }

  let remaining = freq.size;
  for (let f = 1; f <= n && k > 0; f++) {
    // How many complete eliminations can we do at this frequency?
    const canRemove = Math.min(Math.floor(k / f), bucket[f]);
    remaining -= canRemove;
    k -= canRemove * f;
  }

  return remaining;
}

// Solution 3: Brute Force sort entries — Time: O(n log n) | Space: O(n)
function findLeastNumOfUniqueInts3(arr: number[], k: number): number {
  const freq = new Map<number, number>();
  for (const num of arr) freq.set(num, (freq.get(num) ?? 0) + 1);

  const entries = [...freq.entries()].sort((a, b) => a[1] - b[1]);
  for (const [, cnt] of entries) {
    if (k >= cnt) {
      k -= cnt;
      freq.delete(entries[0][0]); // just decrement count
    } else break;
  }
  // Return how many are not fully eliminated
  let result = 0;
  for (let i = 0; i < entries.length; i++) {
    if (k >= entries[i][1]) {
      k -= entries[i][1];
    } else result++;
  }
  return result;
}

// Tests
console.log(findLeastNumOfUniqueInts([5, 5, 4], 1)); // 1
console.log(findLeastNumOfUniqueInts([4, 3, 1, 1, 3, 3, 2], 3)); // 2
console.log(findLeastNumOfUniqueInts([1], 1)); // 0
console.log(findLeastNumOfUniqueInts([1, 2, 3, 4, 5], 0)); // 5
console.log(findLeastNumOfUniqueInts([2, 1, 1, 3, 3, 3], 3)); // 1
```

## 🔗 Related Problems

| Problem                                                                                    | Relationship              |
| ------------------------------------------------------------------------------------------ | ------------------------- |
| [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements)           | Frequency counting + sort |
| [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency) | Frequency-based ordering  |
| [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters)         | Greedy removal strategy   |
