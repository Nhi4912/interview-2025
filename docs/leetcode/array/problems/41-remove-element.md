---
layout: page
title: "Remove Element"
difficulty: Easy
category: Array
tags: [Array, Two Pointers]
leetcode_url: "https://leetcode.com/problems/remove-element"
---

# Remove Element / Xóa Phần Tử

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 10 companies
> **See also**: [Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array) | [Move Zeroes](https://leetcode.com/problems/move-zeroes)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Tưởng tượng hàng người xếp hàng, bạn cần loại bỏ những người mặc áo đỏ. Dùng con trỏ `k` chỉ đến vị trí tiếp theo cho người "không đỏ". Mỗi lần gặp người không đỏ, cho họ vào vị trí `k` và tăng `k`.

**Pattern Recognition:** "Remove in-place without extra space" → Two Pointers: slow pointer (write head) + fast pointer (read head).

```
nums = [3, 2, 2, 3],  val = 3
k=0  i=0: nums[0]=3 → skip
k=0  i=1: nums[1]=2 → nums[0]=2, k=1
k=1  i=2: nums[2]=2 → nums[1]=2, k=2
k=2  i=3: nums[3]=3 → skip
Result: nums[:2] = [2,2],  return k=2
```

---

## 📋 Problem / Bài Toán

Given array `nums` and value `val`, remove all occurrences of `val` **in-place** and return the new length `k`. The first `k` elements of `nums` should contain the non-val elements (order doesn't matter).

- `nums=[3,2,2,3], val=3` → `k=2`, nums=`[2,2,_,_]`
- `nums=[0,1,2,2,3,0,4,2], val=2` → `k=5`, nums=`[0,1,4,0,3,_,_,_]`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Write-pointer pattern**: `k` là số phần tử hợp lệ đã ghi; mỗi lần gặp non-val, `nums[k++] = nums[i]`.
- 🔑 **Nhận biết**: "In-place removal" + "return new length" → two pointers slow/fast là chuẩn.
- ⚡ **Swap-with-end variant**: Khi gặp `val`, swap với cuối mảng và giảm right pointer — ít ghi hơn khi val ít.
- ⚡ **Order matters?**: Bài này không yêu cầu giữ order → swap-with-end tốt hơn; nếu cần order → dùng write pointer.
- 🚨 **Don't return array**: LeetCode đo result qua `k` và `nums[0..k-1]`, không phải array mới.
- 💡 **Generalize**: Pattern này dùng cho Remove Duplicates, Move Zeroes — nhận biết "write head" pattern.

---

## Solutions

### Solution 1 — Two Pointers (Left Write Head) · O(n) time · O(1) space

```typescript
/**
 * k = write pointer (count of valid elements).
 * For each element != val, write it at position k and advance k.
 * Time: O(n) | Space: O(1)
 */
function removeElement_writeHead(nums: number[], val: number): number {
  let k = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      nums[k++] = nums[i];
    }
  }
  return k;
}

const a1 = [3, 2, 2, 3];
console.log(removeElement_writeHead(a1, 3), a1.slice(0, 2)); // 2 [2,2]

const a2 = [0, 1, 2, 2, 3, 0, 4, 2];
console.log(removeElement_writeHead(a2, 2), a2.slice(0, 5)); // 5 [0,1,3,0,4]
```

### Solution 2 — Swap with End (Fewer Writes) · O(n) time · O(1) space

```typescript
/**
 * When nums[i]==val, swap it with the last element and shrink array size.
 * Avoids copying non-val elements; better when val is rare.
 * Time: O(n) | Space: O(1)
 */
function removeElement(nums: number[], val: number): number {
  let i = 0,
    right = nums.length;
  while (i < right) {
    if (nums[i] === val) {
      nums[i] = nums[right - 1]; // overwrite with last element
      right--; // shrink logical size
    } else {
      i++;
    }
  }
  return right;
}

const b1 = [3, 2, 2, 3];
console.log(removeElement(b1, 3)); // 2

const b2 = [0, 1, 2, 2, 3, 0, 4, 2];
console.log(removeElement(b2, 2)); // 5

const b3: number[] = [];
console.log(removeElement(b3, 1)); // 0

const b4 = [4, 4, 4];
console.log(removeElement(b4, 4)); // 0
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                                        | Difficulty | Pattern      |
| -------------------------------------------------------------------------------------------------------------- | ---------- | ------------ |
| [Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array)       | 🟢 Easy    | Two Pointers |
| [Move Zeroes](https://leetcode.com/problems/move-zeroes)                                                       | 🟢 Easy    | Two Pointers |
| [Remove Duplicates from Sorted Array II](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii) | 🟡 Medium  | Two Pointers |
| [Sort Colors](https://leetcode.com/problems/sort-colors)                                                       | 🟡 Medium  | Two Pointers |
