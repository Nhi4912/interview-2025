---
layout: page
title: "Remove Duplicates from Sorted Array II"
difficulty: Medium
category: Array
tags: [Array, Two Pointers]
leetcode_url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/"
---

# Remove Duplicates from Sorted Array II / Xóa Trùng Lặp Khỏi Mảng Đã Sắp Xếp II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers (Read/Write)
> **Frequency**: 📘 Tier 3 — In-place array modification, hay gặp ở screening rounds
> **See also**: [Remove Duplicates I](./01-remove-duplicates-from-sorted-array.md) | [Move Zeroes](./09-move-zeroes.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn là biên tập viên được phép giữ tối đa 2 bản sao mỗi chương sách. Con trỏ `read` duyệt từng trang; con trỏ `write` chỉ chép sang khi chương đó chưa xuất hiện đủ 2 lần.

**Pattern Recognition:**

- Signal: "in-place", "at most k duplicates", sorted array → **Read/Write two pointers**
- Key insight: `nums[read]` hợp lệ khi `nums[read] !== nums[write - 2]`
  - Nếu khác: chắc chắn là phần tử mới hoặc lần xuất hiện ≤ 2
  - Nếu giống: lần thứ 3+ → bỏ qua
- Generalize: "at most k" → check `nums[read] !== nums[write - k]` (thay `2` bằng `k`)

**Visual:**

```
nums = [1, 1, 1, 2, 2, 3]
write = 2   (first 2 always valid)

read=2: nums[2]=1 === nums[write-2]=nums[0]=1 → SKIP
read=3: nums[3]=2 !== nums[write-2]=nums[1]=1 → WRITE  write=3
read=4: nums[4]=2 !== nums[write-2]=nums[2]=1 → WRITE  write=4
read=5: nums[5]=3 !== nums[write-2]=nums[2]=2 → WRITE  write=5

Result array: [1, 1, 2, 2, 3, _],  k = 5
```

---

## Problem Description

**LeetCode #80.** Given sorted array `nums`, remove duplicates in-place so each element appears **at most twice**. Return `k` (new length). Do NOT allocate extra arrays — O(1) extra space only.

```
Example 1: nums = [1,1,1,2,2,3]       →  k=5, nums=[1,1,2,2,3,_]
Example 2: nums = [0,0,1,1,1,1,2,3,3] →  k=7, nums=[0,0,1,1,2,3,3,_,_]
```

Constraints: `1 <= nums.length <= 3×10^4`, `-10^4 <= nums[i] <= 10^4`, sorted non-decreasing

---

## 📝 Interview Tips

1. **Clarify**: "At most 2, hay exactly 2?" — At most 2 (unique elements appear once, still valid)
2. **Key insight**: Không cần đếm tường minh — so sánh `nums[read]` với `nums[write-2]` là đủ, nhờ mảng đã sắp xếp
3. **Generalize ngay**: "at most k?" → thay `write - 2` bằng `write - k`, không cần code khác
4. **First k elements always valid**: Nên bắt đầu `write = 2`, `read = 2` — bỏ qua edge case đầu
5. **Sorted requirement**: Pattern này CHỈ hoạt động với mảng đã sắp xếp (duplicates nằm liền nhau)
6. **Return `write`**: Không phải `write - 1` hay `write + 1` — `write` là số phần tử đã ghi

---

## Solutions

```typescript
/**

- Solution 1: Two Pointers — compare with write-2 (Optimal)
-
- Core invariant: nums[0..write-1] always has at most 2 of each element.
- nums[read] is valid iff it differs from nums[write-2] (the 2nd-to-last written).
- Because array is sorted, identical values are adjacent — this check is sufficient.
-
- Time: O(n), Space: O(1)
  */
  function removeDuplicates(nums: number[]): number {
  if (nums.length <= 2) return nums.length;

let write = 2; // first two elements always valid

for (let read = 2; read < nums.length; read++) {
if (nums[read] !== nums[write - 2]) {
nums[write] = nums[read];
write++;
}
}

return write;
}

/**

- Solution 2: Generalized — at most k duplicates
-
- Same pattern, k is parameterized.
- k=1 → equivalent to LC #26 (remove all duplicates)
- k=2 → this problem
- k=3 → keep at most 3 of each
-
- Time: O(n), Space: O(1)
  */
  function removeDuplicatesK(nums: number[], k: number): number {
  if (nums.length <= k) return nums.length;

let write = k;

for (let read = k; read < nums.length; read++) {
if (nums[read] !== nums[write - k]) {
nums[write++] = nums[read];
}
}

return write;
}

// === Test Cases ===
const a = [1, 1, 1, 2, 2, 3];
console.log(removeDuplicates(a), a.slice(0, 5)); // 5 [1,1,2,2,3]

const b = [0, 0, 1, 1, 1, 1, 2, 3, 3];
console.log(removeDuplicates(b), b.slice(0, 7)); // 7 [0,0,1,1,2,3,3]

// Generalized: k=1 should behave like LC #26
const c = [1, 1, 1, 2, 2, 3];
console.log(removeDuplicatesK(c, 1)); // 3
console.log(c.slice(0, 3)); // [1,2,3]
```

---

## 🔗 Related Problems

- [Remove Duplicates I (LC 26)](./01-remove-duplicates-from-sorted-array.md) — at most 1 duplicate; k=1 version of this
- [Move Zeroes (LC 283)](./09-move-zeroes.md) — same read/write pointer pattern, different keep condition
- [Remove Element (LC 27)](https://leetcode.com/problems/remove-element/) — remove a specific value in-place
- [Remove Duplicates from Sorted List II (LC 82)](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/) — linked list variant
