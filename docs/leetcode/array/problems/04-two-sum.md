---
layout: page
title: "Two Sum"
difficulty: Easy
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/two-sum/"
---

# Two Sum / Tổng Hai Số

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map
> **Frequency**: 🔥 Tier 1 — Gặp >70% interviews
> **See also**: [3Sum](./12-3sum.md) | [Two Sum II](./28-two-pointers-sorted.md) | [Two Sum IV](../../tree/problems/two-sum-iv.md)

---

## 🧠 Intuition / Tư Duy

**Analogy / Liên tưởng:** Bạn có danh sách giá sản phẩm và cần tìm 2 sản phẩm có tổng giá đúng bằng budget. Cách ngu nhất: so sánh từng cặp (O(n²)). Cách thông minh: ghi nhớ "mình cần thêm bao nhiêu" vào sổ tay (HashMap) → khi gặp đúng số cần → xong.

**Pattern Recognition / Nhận dạng:**

- Signal: "two numbers that sum to target" → **Hash Map lookup**
- Key insight: thay vì tìm cặp (a, b) sao cho a+b=target, ta tìm complement = target - a
- Nếu array đã sorted → dùng **Two Pointers** (O(1) space). Nếu chưa sorted → **Hash Map** (O(n) time)

**Visual / Trực quan:**

```
nums = [2, 7, 11, 15], target = 9

Step 1: num=2, complement=9-2=7, map={} → 7 not in map → store {2:0}
Step 2: num=7, complement=9-7=2, map={2:0} → 2 IS in map! → return [0, 1] ✅

Map acts as "wish list": "I need 7" → later find 7 → match!
```

---

## Problem Description

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.

```
Example 1: nums = [2,7,11,15], target = 9 → [0,1]
Example 2: nums = [3,2,4], target = 6 → [1,2]
Example 3: nums = [3,3], target = 6 → [0,1]
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **Hỏi constraints trước** — "Is the array sorted?" → nếu sorted, Two Pointers O(1) space thay vì HashMap O(n) space
2. **Nói approach trước khi code** — "I'll use a hash map to store complements while iterating"
3. **Single-pass insight** — check complement first, then store; tránh dùng cùng element hai lần
4. **Edge cases** — duplicate values `[3,3]`, negative numbers, target = 0
5. **Follow-up thường gặp** — "Can you do it in one pass?" → Yes, check-then-store trong cùng loop
6. **Biến thể** — 3Sum (fix one, two-pointer rest), Two Sum II (sorted → two pointers), Two Sum IV (BST)

---

## Solutions

```typescript
// Solution 1: Hash Map — O(n) time, O(n) space ← OPTIMAL for unsorted
function twoSum(nums: number[], target: number): number[] {
const map = new Map<number, number>(); // complement → index

for (let i = 0; i < nums.length; i++) {
const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }

    map.set(nums[i], i);

}

return [];
}

// Solution 2: Brute Force — O(n²) time, O(1) space ← mention only, never submit
function twoSumBrute(nums: number[], target: number): number[] {
for (let i = 0; i < nums.length; i++) {
for (let j = i + 1; j < nums.length; j++) {
if (nums[i] + nums[j] === target) return [i, j];
}
}
return [];
}
```

---

## 🔗 Related Problems

| #   | Problem                                                                                               | Difficulty | Pattern             |
| --- | ----------------------------------------------------------------------------------------------------- | ---------- | ------------------- |
| 167 | [Two Sum II – Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) | 🟢 Easy    | Two Pointers        |
| 15  | [3Sum](https://leetcode.com/problems/3sum/)                                                           | 🟡 Medium  | Sort + Two Pointers |
| 653 | [Two Sum IV – Input is a BST](https://leetcode.com/problems/two-sum-iv-input-is-a-bst/)               | 🟢 Easy    | DFS + Hash Set      |
| 18  | [4Sum](https://leetcode.com/problems/4sum/)                                                           | 🟡 Medium  | Sort + Two Pointers |
