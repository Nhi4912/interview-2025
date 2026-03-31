---
layout: page
title: "Distribute Candies"
difficulty: Easy
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/distribute-candies"
---

# Distribute Candies / Phân Phối Kẹo

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map (Unique Count)
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence) | [Unique Number of Occurrences](https://leetcode.com/problems/unique-number-of-occurrences)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như chia đồ chơi cho em gái — mỗi lần chỉ chọn một loại mới, em được chọn n/2 lần. Câu hỏi: em gái có thể trải nghiệm tối đa bao nhiêu loại kẹo khác nhau? Bị giới hạn bởi (số loại kẹo tồn tại) VÀ (số lượt được chọn = n/2).

**Pattern Recognition:**

- Alice gets exactly n/2 candies (n is always even)
- Maximize unique candy types Alice receives
- Answer = min(uniqueTypes, n/2)
- Can't get more types than available; can't get more than her quota

**Visual — Set + min:**

```
candyType = [1,1,2,2,3,3]
n = 6, quota = n/2 = 3
uniqueTypes = {1,2,3} → size = 3

ans = min(3, 3) = 3 ✅

candyType = [1,1,2,3]
n = 4, quota = 2
uniqueTypes = {1,2,3} → size = 3

ans = min(3, 2) = 2 ✅  (Alice can only pick 2 out of 3 types)

candyType = [6,6,6,6]
n = 4, quota = 2
uniqueTypes = {6} → size = 1

ans = min(1, 2) = 1 ✅  (only one type exists)
```

---

## Problem Description

Alice has `n` candies of various types (`n` is always even). She must give her brother exactly `n/2` candies and keep the rest. Return the **maximum number of different candy types** Alice can keep. ([LeetCode 575](https://leetcode.com/problems/distribute-candies))

Difficulty: Easy | Acceptance: 69.6%

```
Example 1: candyType=[1,1,2,2,3,3] → 3  (quota=3, unique=3 → min=3)
Example 2: candyType=[1,1,2,3]     → 2  (quota=2, unique=3 → min=2)
Example 3: candyType=[6,6,6,6]     → 1  (quota=2, unique=1 → min=1)
```

Constraints:

- `2 <= n <= 10^4` (n is always even)
- `-10^5 <= candyType[i] <= 10^5`

---

## 📝 Interview Tips

1. **Core insight**: "Đáp án = min(số loại unique, n/2)" / Answer = min(distinct types, quota) — this is the key formula
2. **Why min?**: "Không thể có nhiều loại hơn loại tồn tại; không thể có nhiều hơn quota" / Can't have more types than exist; can't pick more than quota
3. **Set is enough**: "Chỉ cần biết số loại unique, không cần count → Set là đủ" / Only need count of distinct types → Set suffices, no need for Map
4. **Greedy**: "Luôn chọn loại mới → tối đa hóa diversity" / Greedy: always pick new type if available
5. **Edge case**: "Tất cả cùng loại → ans=1; tất cả khác nhau → ans=n/2" / All same → 1; all unique → n/2
6. **Follow-up**: "Nếu phân phối không đều (một người m, người kia n-m)? → min(unique, m)" / Uneven split → min(unique, smaller share)

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — sort and count distinct
 * Time: O(n log n) — sort then linear scan
 * Space: O(1) — in-place sort
 */
function distributeCanadiesBrute(candyType: number[]): number {
  const sorted = [...candyType].sort((a, b) => a - b);
  let uniqueCount = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1]) uniqueCount++;
  }
  return Math.min(uniqueCount, candyType.length / 2);
}

/**
 * Solution 2: Hash Set (optimal)
 * Time: O(n) — single pass to build set
 * Space: O(k) — k unique candy types
 */
function distributeCandies(candyType: number[]): number {
  const uniqueTypes = new Set(candyType).size;
  const quota = candyType.length / 2;
  return Math.min(uniqueTypes, quota);
}

/**
 * Solution 3: Early exit — if unique types reaches quota, stop
 * Time: O(n) worst case, often faster | Space: O(k)
 */
function distributeCandiesEarlyExit(candyType: number[]): number {
  const quota = candyType.length / 2;
  const seen = new Set<number>();
  for (const t of candyType) {
    seen.add(t);
    if (seen.size === quota) return quota; // can't do better
  }
  return seen.size; // fewer unique types than quota
}

// === Test Cases ===
console.log(distributeCandies([1, 1, 2, 2, 3, 3])); // 3
console.log(distributeCandies([1, 1, 2, 3])); // 2
console.log(distributeCandies([6, 6, 6, 6])); // 1
console.log(distributeCandies([1, 2])); // 1
console.log(distributeCandies([1, 2, 3, 4])); // 2
```

---

## 🔗 Related Problems

- [Unique Number of Occurrences](https://leetcode.com/problems/unique-number-of-occurrences) — counting with Set
- [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence) — Set for O(1) lookup
- [Find Common Characters](https://leetcode.com/problems/find-common-characters) — frequency counting
- [Majority Element](https://leetcode.com/problems/majority-element) — frequency analysis
- [Distribute Candies — LeetCode](https://leetcode.com/problems/distribute-candies) — problem page
