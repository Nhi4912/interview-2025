---
layout: page
title: "Minimum Levels to Gain More Points"
difficulty: Medium
category: Array
tags: [Array, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/minimum-levels-to-gain-more-points"
---

# Minimum Levels to Gain More Points / Số Màn Tối Thiểu Để Đạt Nhiều Điểm Hơn

> **Difficulty**: 🟡 Medium | **Category**: Array | **Pattern**: Prefix Sum / Partition

## 🧠 Intuition / Tư Duy

**Như chia bánh giữa hai người**: Bob muốn phần đầu mảng, Alice muốn phần còn lại. Bài toán là tìm điểm cắt tối thiểu sao cho điểm Bob > điểm Alice.

**Pattern Recognition:**

- Tính tổng điểm toàn bộ → prefix sum cho Bob, suffix = total - prefix cho Alice
- Điểm: possible level (=1) → +1, impossible level (=0) → -1
- Duyệt từ trái qua phải, check điều kiện sau mỗi bước thêm level

**Visual:**

```
possible = [1,0,1,0], mapping: 1→+1, 0→-1
Total score = (+1)+(-1)+(+1)+(-1) = 0
Bob takes i levels, Alice takes rest:
i=1: Bob=+1, Alice=-1 → 1 > -1 ✓ → answer = 1
```

## Problem Description

Mảng `possible[i]` = 1 nếu level i có thể hoàn thành, = 0 nếu không. Điểm: hoàn thành được +1, không hoàn thành -1. Bob chơi `i` màn đầu, Alice chơi còn lại. Tìm **số màn tối thiểu** để điểm Bob > Alice. Nếu không thể → trả về `-1`.

**Example 1:** `possible = [1,0,1,0]` → `1`
**Example 2:** `possible = [1,1,1,1,1]` → `3`

**Constraints:** `2 ≤ possible.length ≤ 10^5`, `possible[i] ∈ {0,1}`

## 📝 Interview Tips

1. **Tính tổng trước**: total score = sum(score[i]) với score[i] = possible[i] ? 1 : -1
2. **Không cần mảng prefix**: chỉ cần biến chạy `bobScore`
3. **Alice score = total - bobScore** sau mỗi bước
4. **Check sau mỗi level** từ 1 đến n-1 (Alice phải có ít nhất 1 level)
5. **Return -1 nếu không tìm được** điểm cắt thỏa mãn
6. **Chú ý**: Bob phải hoàn thành ít nhất 1 level, Alice cũng ít nhất 1 level

## Solutions

```typescript
// Solution 1: Prefix sum running — O(n) time, O(1) space
function minimumLevels(possible: number[]): number {
  const n = possible.length;
  const score = (v: number) => (v === 1 ? 1 : -1);

  // Calculate total score
  let total = 0;
  for (const p of possible) total += score(p);

  // Bob accumulates from left; Alice = total - bob
  let bobScore = 0;
  for (let i = 0; i < n - 1; i++) {
    // Alice must have at least 1 level
    bobScore += score(possible[i]);
    const aliceScore = total - bobScore;
    if (bobScore > aliceScore) return i + 1; // i+1 levels for Bob
  }
  return -1;
}

// Solution 2: Precompute prefix array — O(n) time and space (clearer for interviews)
function minimumLevelsV2(possible: number[]): number {
  const n = possible.length;
  const scores = possible.map((p) => (p === 1 ? 1 : -1));
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + scores[i];

  const total = prefix[n];
  for (let i = 1; i < n; i++) {
    // Bob takes i levels, Alice takes n-i
    const bobScore = prefix[i];
    const aliceScore = total - bobScore;
    if (bobScore > aliceScore) return i;
  }
  return -1;
}

// Tests
console.log(minimumLevels([1, 0, 1, 0])); // 1
console.log(minimumLevels([1, 1, 1, 1, 1])); // 3
console.log(minimumLevels([0, 0])); // -1
console.log(minimumLevelsV2([1, 0, 1, 0])); // 1
console.log(minimumLevelsV2([1, 1, 1, 1, 1])); // 3
```

## 🔗 Related Problems

| Problem                                              | Relationship                         |
| ---------------------------------------------------- | ------------------------------------ |
| 724 - Find Pivot Index                               | Partition array by prefix/suffix sum |
| 1991 - Find the Middle Index in Array                | Same partition concept               |
| 2256 - Minimum Average Difference                    | Prefix sum with comparison           |
| 1685 - Sum of Absolute Differences in a Sorted Array | Prefix/suffix split                  |
