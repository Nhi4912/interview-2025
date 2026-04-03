---
layout: page
title: "Search in Rotated Sorted Array"
difficulty: Medium
category: Sorting/Searching
tags: [Array, Binary Search, Divide and Conquer]
leetcode_url: "https://leetcode.com/problems/search-in-rotated-sorted-array/"
leetcode_number: 33
pattern: "Modified Binary Search"
frequency_tier: 1
companies: [Meta, Amazon, Google, Microsoft, Bloomberg]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Search in Rotated Sorted Array / Tìm Kiếm Trong Mảng Đã Xoay

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Modified Binary Search
> **Frequency**: 🔥 Tier 1 — câu hỏi binary search phổ biến nhất, xuất hiện ở mọi công ty
> **Target**: ⏱️ 20 min | **Companies**: Meta, Amazon, Google, Microsoft, Bloomberg
> **See also**: [First Bad Version](./02-first-bad-version.md) | [Find Min in Rotated Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Danh bạ điện thoại bị xé từ trang giữa rồi đặt nửa sau lên trước. Hai nửa vẫn có thứ tự riêng. Mấu chốt: **ít nhất một nửa luôn sorted** — dùng nửa sorted đó để quyết định tìm ở đâu.

**Pattern Recognition:**

- Signal: "rotated sorted array", "O(log n)" → **Modified binary search, xác định nửa sorted**
- So sánh `nums[left]` vs `nums[mid]` để biết nửa nào liên tục
- Kiểm tra target có nằm trong range nửa sorted không

**Visual — Tìm target=0 trong [4,5,6,7,0,1,2]:**

```
left=0, right=6, mid=3 → nums[3]=7
nums[0]=4 <= nums[3]=7 → left half sorted [4,5,6,7]
target=0 not in [4..7) → search right: left=4

left=4, right=6, mid=5 → nums[5]=1
nums[4]=0 <= nums[5]=1 → left half sorted [0,1]
target=0 in [0..1) → search left: right=4

left=4, right=4, mid=4 → nums[4]=0 == target → return 4 ✓
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                                         |
| ---------------- | -------------------------------------------------------------------------------- |
| **When you see** | "rotated sorted array", "search in O(log n)", "pivot point"                      |
| **Think**        | Modified Binary Search — one half is always sorted, use it to decide direction   |
| **Template**     | `if (nums[left] <= nums[mid]) { /* left sorted */ } else { /* right sorted */ }` |
| **Time target**  | ⏱️ 20 min (Medium)                                                               |

> 💡 **Memory hook / Móc nhớ:** "Danh bạ bị xé — luôn có một nửa nguyên vẹn, dùng nửa đó để định hướng"

---

## Problem Description

An ascending array `nums` was rotated at some pivot. Given `nums` and `target`, return the index of `target` or `-1`. Must run in **O(log n)**.

```
Example 1: nums = [4,5,6,7,0,1,2], target = 0 → 4
Example 2: nums = [4,5,6,7,0,1,2], target = 3 → -1
Example 3: nums = [1],             target = 0 → -1
```

Constraints:

- 1 <= nums.length <= 5000; all values unique
- -10⁴ <= nums[i], target <= 10⁴

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "We have a sorted array that was rotated at some pivot.
> We need to find target in O(log n) — so binary search is required.
> Clarification: All elements are unique? Can the array be non-rotated?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "Standard binary search won't work directly because the array isn't fully sorted.
> But after rotation, at least one half [left..mid] or [mid..right] is always sorted.
> I'll check which half is sorted, then check if target is in that range. O(log n) time, O(1) space."

### Step 3 — Implement / Viết Code (5-7 min)

> "Binary search with left, right pointers.
> Compare nums[left] vs nums[mid] to find the sorted half.
> Check if target falls in the sorted range — narrow accordingly."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace: [4,5,6,7,0,1,2], target=0. mid=3→7. Left [4,5,6,7] sorted, 0 not in [4,7) → go right.
> mid=5→1. Left [0,1] sorted, 0 in [0,1) → go left. mid=4→0 = target. Return 4."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(log n) — halving each iteration. Space: O(1).
> Edge cases: single element; no rotation; target at pivot.
> Follow-up: duplicates → worst case O(n), see Search in Rotated Array II (#81)."

---

## 📝 Interview Tips

1. **Clarify**: "Can array be non-rotated?" / "Mảng có thể không bị xoay?" (yes — left half always sorted)
2. **Brute force**: Linear scan O(n) — mention only as baseline
3. **Optimize**: Modified binary search O(log n) — determine sorted half, check target range
4. **Edge cases**: single element; no rotation (fully sorted); target at rotation point
5. **Follow-up**: Duplicates → Search in Rotated Array II (#81), worst O(n)

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                                                      | Why Wrong / Tại sao sai                     | Fix / Cách sửa                                                  |
| --- | ---------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------- |
| 1   | Use `<` instead of `<=` in `nums[left] <= nums[mid]`                   | Fails when left == mid (2-element subarray) | Must use `<=` to correctly identify sorted half                 |
| 2   | Wrong range check: `target >= nums[left]` without `target < nums[mid]` | May send search to wrong half               | Check both bounds: `nums[left] <= target && target < nums[mid]` |
| 3   | Not handling non-rotated case                                          | Assumes array is always rotated             | `nums[left] <= nums[mid]` naturally handles non-rotated arrays  |

---

## Solutions

```typescript
/**
 * Solution 1: Linear Scan (Brute Force)
 * Time: O(n) — scan every element
 * Space: O(1)
 */
function searchLinear(nums: number[], target: number): number {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}

/**
 * Solution 2: Modified Binary Search (Optimal)
 * Time: O(log n) — halve search space each iteration
 * Space: O(1)
 */
function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;

    if (nums[left] <= nums[mid]) {
      // Left half is sorted
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right half is sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}

// === Test Cases ===
console.log(search([4, 5, 6, 7, 0, 1, 2], 0)); // 4
console.log(search([4, 5, 6, 7, 0, 1, 2], 3)); // -1
console.log(search([1], 0)); // -1
console.log(search([3, 1], 1)); // 1
console.log(search([1, 2, 3, 4, 5], 3)); // 2 (no rotation)
```

---

## 🔗 Related Problems

- [First Bad Version](./02-first-bad-version.md) — binary search with predicate
- [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) — find pivot
- [Search in Rotated Array II](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/) — with duplicates

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 20 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
