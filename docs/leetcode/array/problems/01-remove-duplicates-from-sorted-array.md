---
layout: page
title: "Remove Duplicates from Sorted Array"
difficulty: Easy
category: Array
tags: [Array, Two Pointers]
leetcode_url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/"
---

# Remove Duplicates from Sorted Array / Xóa Phần Tử Trùng Lặp Trong Mảng Đã Sắp Xếp

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers  
> **Frequency**: 📘 Tier 3 — Classic warm-up, common in screening rounds  
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Remove Duplicates II](26-remove-duplicates-from-sorted-array-ii.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Tưởng tượng bạn có một danh sách điểm danh đã sắp theo thứ tự ABC. Bạn đọc từ đầu và chỉ ghi tên mới vào sổ — nếu tên trùng với tên vừa ghi, bỏ qua. Con trỏ chậm giữ vị trí bút, con trỏ nhanh đọc từng dòng danh sách.

- **Pattern Recognition:**
  - Mảng đã **sắp xếp** + yêu cầu **in-place** → Two Pointers (slow writes, fast reads)
  - "Each unique element once" → slow pointer advances only when a new value is found
  - Trả về `k` (đếm), không xóa thật → ghi đè k phần tử đầu, phần còn lại không quan trọng

- **Visual — Two Pointers Walk:**

```
nums = [1, 1, 2, 3, 3, 4]
        s                    s=slow (write head)
           f                 f=fast (read head)

f=1: nums[1]=1 == nums[0]=1  → skip
f=2: nums[2]=2 ≠ nums[0]=1  → s++, nums[1]=2  → [1,2,2,3,3,4]  s=1
f=3: nums[3]=3 ≠ nums[1]=2  → s++, nums[2]=3  → [1,2,3,3,3,4]  s=2
f=4: nums[4]=3 == nums[2]=3  → skip
f=5: nums[5]=4 ≠ nums[2]=3  → s++, nums[3]=4  → [1,2,3,4,3,4]  s=3
return s+1 = 4  ✓
```

## Problem Description

Given a sorted array `nums`, remove duplicates **in-place** so each unique element appears exactly once. Return `k` — the number of unique elements. The first `k` elements of `nums` must hold the result.

```
Input:  [1, 1, 2]                  → k=2,  nums=[1,2,_]
Input:  [0,0,1,1,1,2,2,3,3,4]     → k=5,  nums=[0,1,2,3,4,_,_,_,_,_]
Input:  [1]                        → k=1,  nums=[1]
```

## 📝 Interview Tips

1. **Hỏi ngay**: "Mảng đã sắp xếp không?" → Yes: Two Pointers O(1) space / **Ask first**: "Is array sorted?" — yes unlocks O(1) space solution
2. **Edge cases / Trường hợp đặc biệt**: `[]` → return 0; one element → return 1; all same → return 1
3. **Sai lầm phổ biến**: Dùng `Set` hoặc `splice` — bài yêu cầu in-place, O(1) space / **Trap**: `new Set()` uses O(n) space — interviewers will catch it
4. **Đặt tên biến**: `slow`/`fast` hoặc `writeIdx`/`readIdx` giúp code tự giải thích / **Naming**: makes pointer roles immediately obvious
5. **Follow-up**: "Allow up to 2 duplicates?" → adjust condition to `nums[fast] !== nums[slow - 1]` (see #26)
6. **Xác nhận output**: Chỉ cần k phần tử đầu đúng, phần sau không cần quan tâm / **Output contract**: only first k elements matter, rest are irrelevant

## Solutions

```typescript
/**

- Solution 1: Two Pointers — Optimal
- Time: O(n) | Space: O(1)
  */
  function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;

let slow = 0; // last written unique position

for (let fast = 1; fast < nums.length; fast++) {
if (nums[fast] !== nums[slow]) {
slow++;
nums[slow] = nums[fast];
}
}

return slow + 1;
}

/**

- Solution 2: Set — Brute Force (O(n) space, interview contrast only)
- Time: O(n) | Space: O(n)
  */
  function removeDuplicatesBrute(nums: number[]): number {
  const unique = [...new Set(nums)];
  for (let i = 0; i < unique.length; i++) nums[i] = unique[i];
  return unique.length;
  }

// Inline tests
const a1 = [1, 1, 2]; console.log(removeDuplicates(a1) === 2); // true
const a2 = [0,0,1,1,1,2,2,3,3,4]; console.log(removeDuplicates(a2) === 5); // true
console.log(removeDuplicates([]) === 0); // true
console.log(removeDuplicates([1, 2, 3]) === 3); // true
```

## 🔗 Related Problems

| Problem                                                                  | Relationship                                                                     |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| [#26 Remove Duplicates II](26-remove-duplicates-from-sorted-array-ii.md) | Follow-up: allow up to 2 duplicates — same two-pointer trick, adjusted condition |
| [#09 Move Zeroes](09-move-zeroes.md)                                     | Identical slow/fast pointer pattern, write head skips zeroes                     |
| [#28 Two Pointers on Sorted](28-two-pointers-sorted.md)                  | General two-pointer template this problem exemplifies                            |
| [#03 Rotate Array](03-rotate-array.md)                                   | In-place array manipulation without extra space                                  |
