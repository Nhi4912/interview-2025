---
layout: page
title: "Three Equal Parts"
difficulty: Hard
category: Array
tags: [Array, Math]
leetcode_url: "https://leetcode.com/problems/three-equal-parts"
---

# Three Equal Parts / Ba Phần Bằng Nhau

> **Difficulty**: 🔴 Hard | **Category**: Array | **Pattern**: Binary Pattern Matching / Pointer Alignment

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Chia một chuỗi nhị phân dài thành ba đoạn sao cho giá trị nhị phân của cả ba đoạn bằng nhau — như chia đều một con tem bưu chính cắt thành ba phần có cùng mẫu hoa văn.

**Pattern Recognition:**

- Count total 1s; must be divisible by 3 (each part gets equal count)
- Align the trailing zeros pattern — they must match across all 3 parts
- Find positions of the k-th, 2k-th, 3k-th 1-bit in the array

**Visual:**

```
arr = [1,0,1,0,1]
ones = 3, each part gets 1 one

Part1 starts at index of 1st one: i=0
Part2 starts at index of 2nd one: i=2
Part3 starts at index of 3rd one: i=4

Verify suffix match from each start:
Part1: arr[0..1] = [1,0]
Part2: arr[2..3] = [1,0]
Part3: arr[4..4] = [1]
Trailing zeros of Part3 = 0, so Part1=[1], Part2=[1], Part3=[1] match!
Answer: [1, 4]
```

## Problem Description

Given a binary array `arr`, partition into three non-empty parts `arr[0..i]`, `arr[i+1..j]`, `arr[j+1..n-1]` such that the binary representations of all three parts are equal. Return `[i, j+1]` or `[-1, -1]` if impossible.

**Example 1:** `[1,0,1,0,1]` → `[0, 3]`
**Example 2:** `[1,1,0,1,1]` → `[-1, -1]`

**Constraints:** `3 ≤ arr.length ≤ 3×10^4`, values are 0 or 1

## 📝 Interview Tips

1. **Clarify**: Can we have leading zeros in a part? (Yes, they don't affect binary value)
2. **Approach**: Count 1s → find start positions → align trailing zeros
3. **Edge cases**: All zeros (answer is [0, 2] or similar), exactly 3 ones
4. **Optimize**: O(n) by finding the k-th one positions directly
5. **Follow-up**: What if it's base-10 instead of binary?
6. **Complexity**: Time O(n), Space O(1)

## Solutions

```typescript
// Solution 1: Trailing zero alignment — Time: O(n) | Space: O(1)
function threeEqualParts(arr: number[]): number[] {
  const n = arr.length;
  const ones = arr.reduce((s, v) => s + v, 0);

  if (ones === 0) return [0, 2]; // all zeros
  if (ones % 3 !== 0) return [-1, -1];

  const k = ones / 3;

  // Find start indices of 1st, 2nd, 3rd groups of k ones
  let count = 0;
  let i1 = -1,
    i2 = -1,
    i3 = -1;
  for (let i = 0; i < n; i++) {
    if (arr[i] === 1) {
      count++;
      if (count === 1) i1 = i;
      if (count === k + 1) i2 = i;
      if (count === 2 * k + 1) i3 = i;
    }
  }

  // Match characters from each start simultaneously
  while (i3 < n && arr[i1] === arr[i2] && arr[i2] === arr[i3]) {
    i1++;
    i2++;
    i3++;
  }

  if (i3 === n) {
    return [i1 - 1, i2];
  }

  return [-1, -1];
}

// Solution 2: Explicit suffix zeros count — Time: O(n) | Space: O(1)
function threeEqualParts2(arr: number[]): number[] {
  const n = arr.length;
  const totalOnes = arr.filter((x) => x === 1).length;

  if (totalOnes === 0) return [0, 2];
  if (totalOnes % 3 !== 0) return [-1, -1];

  const perPart = totalOnes / 3;

  // Find index of the (pos)-th 1-bit (1-indexed)
  function findKthOne(k: number): number {
    let cnt = 0;
    for (let i = 0; i < n; i++) {
      if (arr[i] === 1) {
        cnt++;
        if (cnt === k) return i;
      }
    }
    return -1;
  }

  let p1 = findKthOne(1);
  let p2 = findKthOne(perPart + 1);
  let p3 = findKthOne(2 * perPart + 1);

  while (p3 < n) {
    if (arr[p1] !== arr[p2] || arr[p2] !== arr[p3]) return [-1, -1];
    p1++;
    p2++;
    p3++;
  }

  return [p1 - 1, p2];
}

// Tests
console.log(threeEqualParts([1, 0, 1, 0, 1])); // [0, 3]
console.log(threeEqualParts([1, 1, 0, 1, 1])); // [-1, -1]
console.log(threeEqualParts([0, 0, 0])); // [0, 2]
console.log(threeEqualParts2([1, 0, 1, 0, 1])); // [0, 3]
console.log(threeEqualParts2([0, 0, 0, 0, 0])); // [0, 2] or similar valid split
```

## 🔗 Related Problems

| Problem                                                                                                   | Relationship                         |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [Split Array with Equal Sum (LeetCode 548)](https://leetcode.com/problems/split-array-with-equal-sum/)    | Partition array into equal-sum parts |
| [Equal Tree Partition (LeetCode 663)](https://leetcode.com/problems/equal-tree-partition/)                | Partition structure for equality     |
| [Find if Array Can Be Sorted (LeetCode 3011)](https://leetcode.com/problems/find-if-array-can-be-sorted/) | Binary property partition            |
