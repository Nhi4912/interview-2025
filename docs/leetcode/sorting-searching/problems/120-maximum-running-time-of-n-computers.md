---
layout: page
title: "Maximum Running Time of N Computers"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-running-time-of-n-computers"
---

# Maximum Running Time of N Computers / Maximum Running Time of N Computers

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element) | [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng tìm một trang trong từ điển — bạn mở giữa, xem số trang, rồi chọn nửa phù hợp. Mỗi lần giảm một nửa phạm vi tìm kiếm.

**Pattern Recognition:**

- Signal: "sorted" + "find target/position" → **Binary Search**
- Bài này thuộc dạng Binary Search — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Running Time of N Computers example:**

```
[1, 3, 5, 7, 9, 11, 13]
 L        M            R

Step 1: mid = (L+R)/2, check condition
Step 2: condition true → move L = mid+1 (or R = mid-1)
Step N: L meets R → answer found ✅
```

---

## Problem Description

Maximum Running Time of N Computers. ([LeetCode](https://leetcode.com/problems/maximum-running-time-of-n-computers))

Difficulty: Hard | Acceptance: 49.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-running-time-of-n-computers) for full constraints

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
function maximumRunningTimeOfNComputersBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Binary Search
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumRunningTimeOfNComputers(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Binary Search
  // Hint: Define search space, determine which half to discard
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumRunningTimeOfNComputers(/* example 1 */)); // expected
// console.log(maximumRunningTimeOfNComputers(/* example 2 */)); // expected
// console.log(maximumRunningTimeOfNComputers(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element) — same pattern: Sliding Window
- [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal) — same pattern: Prefix Sum
- [Maximum Number of Tasks You Can Assign](https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign) — same pattern: Monotonic Queue
- [Minimize the Maximum Difference of Pairs](https://leetcode.com/problems/minimize-the-maximum-difference-of-pairs) — same pattern: Dynamic Programming
- [Maximum Running Time of N Computers — LeetCode](https://leetcode.com/problems/maximum-running-time-of-n-computers) — problem page
