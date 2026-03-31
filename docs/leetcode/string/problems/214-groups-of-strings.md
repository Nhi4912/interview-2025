---
layout: page
title: "Groups of Strings"
difficulty: Hard
category: String
tags: [String, Bit Manipulation, Union Find]
leetcode_url: "https://leetcode.com/problems/groups-of-strings"
---

# Groups of Strings / Nhóm Các Chuỗi

> **Difficulty**: 🔴 Hard | **Category**: String | **Pattern**: Bitmask + Union Find

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như phân nhóm học sinh theo sở thích — hai học sinh thuộc cùng nhóm nếu có thể đổi, thêm, hoặc xóa một sở thích để trùng nhau. Dùng Union-Find để gộp nhóm dây chuyền.

**Pattern Recognition:**

- Each string → 26-bit bitmask (which letters present)
- Two strings connected if bitmask differs by 1 bit (add/remove) or swap (XOR = two bits)
- Union-Find to merge connected components, track group sizes

**Visual:**

```
words = ["a","b","ab","cde"]

"a"  → mask 00001
"b"  → mask 00010
"ab" → mask 00011
"cde"→ mask 11100

"a" and "b": XOR=00011 (2 bits) AND both have popcount 1 → same-length swap?
  No: same length replace: XOR has exactly 2 bits set, one in each mask
  "a"(1 bit) & "b"(1 bit): replace 'a'→'b', yes connected!

"ab"(2 bits) & "b"(1 bit): differ by 1 bit (remove 'a') → connected!

Groups: {a,b,ab} → size 3, {cde} → size 1
Answer: [2, 3]  (2 groups, largest has 3)
```

## Problem Description

Two strings are **connected** if one can be obtained from the other by exactly one of: add a char, delete a char, or replace a char. Return `[groupCount, maxGroupSize]` after grouping all connected strings (transitively).

**Example 1:** `["a","b","ab","cde"]` → `[2, 3]`
**Example 2:** `["a","ab","abc"]` → `[1, 3]`

**Constraints:** `1 <= words.length <= 2*10^4`, `1 <= words[i].length <= 26`, all words distinct, lowercase

## 📝 Interview Tips

1. **Clarify**: Connectivity is transitive — if A~B and B~C then all in same group
2. **Approach**: Bitmask each word (26 bits), for each word try all neighbors, union-find
3. **Edge cases**: Words with duplicate char sets (same bitmask) → union immediately
4. **Optimize**: Index masks in map; for each mask try all 26 bit-flips (add/remove) and all 26×26 swaps
5. **Follow-up**: What if strings can differ by k operations?
6. **Complexity**: Time O(n × 26²), Space O(n)

## Solutions

```typescript
// Solution 1: Bitmask + Union Find — Time: O(n*676) | Space: O(n)
function groupStrings(words: string[]): number[] {
  const n = words.length;
  const parent = Array.from({ length: n }, (_, i) => i);
  const size = new Array(n).fill(1);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(x: number, y: number): void {
    const px = find(x),
      py = find(y);
    if (px === py) return;
    if (size[px] < size[py]) {
      parent[px] = py;
      size[py] += size[px];
    } else {
      parent[py] = px;
      size[px] += size[py];
    }
  }

  // Convert each word to bitmask
  const masks: number[] = words.map((w) => {
    let mask = 0;
    for (const c of w) mask |= 1 << (c.charCodeAt(0) - 97);
    return mask;
  });

  // Map from mask to word index (first occurrence)
  const maskIndex = new Map<number, number>();

  for (let i = 0; i < n; i++) {
    const mask = masks[i];

    // Same mask → directly connected
    if (maskIndex.has(mask)) {
      union(i, maskIndex.get(mask)!);
    } else {
      maskIndex.set(mask, i);
    }

    // Try removing each set bit (delete a char)
    for (let b = 0; b < 26; b++) {
      if (mask & (1 << b)) {
        const newMask = mask ^ (1 << b);
        if (maskIndex.has(newMask)) union(i, maskIndex.get(newMask)!);
      }
    }

    // Try adding each unset bit (add a char)
    for (let b = 0; b < 26; b++) {
      if (!(mask & (1 << b))) {
        const newMask = mask | (1 << b);
        if (maskIndex.has(newMask)) union(i, maskIndex.get(newMask)!);
      }
    }

    // Try replacing: flip one set bit off and one unset bit on
    for (let b1 = 0; b1 < 26; b1++) {
      if (!(mask & (1 << b1))) continue; // b1 must be set (remove it)
      for (let b2 = 0; b2 < 26; b2++) {
        if (mask & (1 << b2)) continue; // b2 must be unset (add it)
        const newMask = (mask ^ (1 << b1)) | (1 << b2);
        if (maskIndex.has(newMask)) union(i, maskIndex.get(newMask)!);
      }
    }
  }

  // Count groups and max size
  const groupSizes = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    const root = find(i);
    groupSizes.set(root, (groupSizes.get(root) ?? 0) + 1);
  }

  let maxSize = 0;
  for (const sz of groupSizes.values()) maxSize = Math.max(maxSize, sz);
  return [groupSizes.size, maxSize];
}

// Tests
console.log(groupStrings(["a", "b", "ab", "cde"])); // [2, 3]
console.log(groupStrings(["a", "ab", "abc"])); // [1, 3]
console.log(groupStrings(["a"])); // [1, 1]
console.log(groupStrings(["abc", "bcd", "acef", "xyz", "az", "ba", "a", "z"])); // [2, 4]
```

## 🔗 Related Problems

| Problem                                                                       | Relationship                       |
| ----------------------------------------------------------------------------- | ---------------------------------- |
| [Number of Islands](https://leetcode.com/problems/number-of-islands/)         | Union Find connected components    |
| [Word Ladder](https://leetcode.com/problems/word-ladder/)                     | BFS on string edit distance graph  |
| [Similar String Groups](https://leetcode.com/problems/similar-string-groups/) | Grouping strings by transformation |
