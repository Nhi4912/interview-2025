---
layout: page
title: "Two Sum"
difficulty: Easy
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/two-sum/"
leetcode_number: 1
pattern: "Hash Map"
frequency_tier: 1
companies: [Google, Amazon, Meta, Microsoft, Apple]
target_time_minutes: 10
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Two Sum / Tổng Hai Số

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map
> **Frequency**: 🔥 Tier 1 — Gặp >90% interviews | **Target**: ⏱️ 10 min
> **Companies**: Google, Amazon, Meta, Microsoft, Apple
> **See also**: [3Sum](./12-3sum.md) | [Two Sum II](./28-two-pointers-sorted.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có danh sách giá sản phẩm và cần tìm 2 sản phẩm có tổng giá đúng bằng budget. Cách ngu nhất: so sánh từng cặp (O(n²)). Cách thông minh: ghi nhớ "mình cần thêm bao nhiêu" vào sổ tay (HashMap) → khi gặp đúng số cần → xong.

**Pattern Recognition:**

- Signal: "two numbers that sum to target" → **Hash Map lookup**
- Key insight: thay vì tìm cặp (a, b) sao cho a+b=target, ta tìm complement = target - a
- Nếu array đã sorted → dùng **Two Pointers** (O(1) space). Nếu chưa sorted → **Hash Map** (O(n) time)

**Visual — nums = [2, 7, 11, 15], target = 9:**

```
Step 1: num=2, complement=9-2=7, map={} → 7 not in map → store {2:0}
Step 2: num=7, complement=9-7=2, map={2:0} → 2 IS in map! → return [0, 1] ✅

Map acts as "wish list": "I need 7" → later find 7 → match!
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                  |
| ---------------- | --------------------------------------------------------- |
| **When you see** | "find two numbers", "complement", "pair that sums to"     |
| **Think**        | Hash Map — store complement, check on each iteration      |
| **Template**     | `map.set(target - nums[i], i)` → check `map.has(nums[i])` |
| **Time target**  | ⏱️ 10 min (Easy)                                          |

> 💡 **Memory hook / Móc nhớ:** "HashMap = sổ wish list — ghi những gì cần tìm, khi gặp thì match!"

---

## Problem Description

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. Each input has exactly one solution, and you may not use the same element twice.

```
Example 1: nums = [2,7,11,15], target = 9 → [0,1]
Example 2: nums = [3,2,4], target = 6 → [1,2]
Example 3: nums = [3,3], target = 6 → [0,1]
```

Constraints:

- `2 <= nums.length <= 10^4`
- `-10^9 <= nums[i] <= 10^9`

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "Let me make sure I understand. We have an array of integers and a target sum.
> We need to find the indices of two numbers that add up to the target.
> Clarification: Can there be duplicate values? Is there always exactly one solution?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "My first thought is checking every pair — that's O(n²).
> But I notice for each number, I just need its complement: target - num.
> I'll use a Hash Map to store seen values and check complements in O(1).
> This gives O(n) time, O(n) space. Should I go ahead?"

### Step 3 — Implement / Viết Code (3-5 min)

> "I'll iterate through the array once.
> For each number, check if its complement exists in the map.
> If found, return both indices. Otherwise, store current number and index."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Let me trace through: nums=[2,7,11,15], target=9.
> i=0: num=2, need 7, map empty → store {2:0}.
> i=1: num=7, need 2, map has 2 at index 0 → return [0,1]. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(n) — one pass through array. Space: O(n) — hash map stores at most n entries.
> Edge cases: duplicate values [3,3], negative numbers, single valid pair.
> This is optimal for unsorted input. If sorted, Two Pointers gives O(1) space."

---

## 📝 Interview Tips

1. **Clarify**: "Is the array sorted?" → if yes, Two Pointers O(1) space / Nếu sorted thì dùng Two Pointers
2. **Approach**: "I'll use a hash map to store complements" — say before coding / Nói approach trước khi code
3. **Single-pass**: Check complement first, then store → avoids using same element twice / Kiểm tra trước, lưu sau
4. **Edge cases**: Duplicate values `[3,3]`, negative numbers, target = 0 / Giá trị trùng, số âm
5. **Follow-up**: "Can you do it in one pass?" → Yes, check-then-store / Có, kiểm tra rồi lưu trong cùng loop

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                | Why Wrong / Tại sao sai                                                                   | Fix / Cách sửa                                  |
| --- | -------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 1   | Store first, check later         | May match element with itself: `map.set(nums[i])` then `map.has(complement)` returns self | Check complement BEFORE storing current element |
| 2   | Return values instead of indices | Problem asks for indices, not the numbers themselves                                      | Store index in map: `map.set(nums[i], i)`       |
| 3   | Jump straight to coding          | Interviewer wants to hear your thought process first                                      | Explain brute force → optimize → then code      |

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Nested Loops
 * Time: O(n²) — check every pair
 * Space: O(1) — no extra memory
 */
function twoSumBrute(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}

/**
 * Solution 2: Hash Map — One Pass (Optimal)
 * Time: O(n) — single iteration, O(1) map lookup
 * Space: O(n) — hash map stores at most n elements
 */
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }

  return [];
}

// === Test Cases ===
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6)); // [1, 2]
console.log(twoSum([3, 3], 6)); // [0, 1]
```

---

## 🔗 Related Problems

- [3Sum](./12-3sum.md) — extend to three numbers using sort + two pointers
- [Two Sum II](./28-two-pointers-sorted.md) — sorted input, O(1) space with two pointers
- [Two Sum IV – BST](https://leetcode.com/problems/two-sum-iv-input-is-a-bst/) — DFS + Hash Set on tree
- [4Sum](https://leetcode.com/problems/4sum/) — generalization to four numbers

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 10 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
