---
layout: page
title: "Single Element in a Sorted Array"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/single-element-in-a-sorted-array"
---

# Single Element in a Sorted Array / Phần Tử Đơn Trong Mảng Đã Sắp Xếp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 11 companies
> **See also**: [Find First and Last Position](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array) | [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Tưởng tượng mỗi số trong mảng đi theo cặp đôi. Trước phần tử đơn, mỗi cặp bắt đầu tại **index chẵn**. Sau phần tử đơn, cặp bắt đầu tại **index lẻ** — giống như đoàn tàu bị trật bánh từ một toa nào đó. Binary search tìm điểm trật bánh đó.

**Pattern Recognition:** Tìm boundary trong sorted array → Binary search on index property.

```
Index: 0  1  2  3  4  5  6  7  8
Value: 1  1  3  3  4  8  8  9  9
                    ↑
              single=4 at idx 4

Before idx 4: pair starts at EVEN  → nums[even] == nums[even+1]
After  idx 4: pair starts at ODD   → pattern broken
Binary search zeros in on this flip point.
```

---

## 📋 Problem / Bài Toán

Given a **sorted** array where every element appears **exactly twice** except one element that appears once, return the single element. Must run in O(log n) time and O(1) space.

- `nums = [1,1,2,3,3,4,4,8,8]` → `2`
- `nums = [3,3,7,7,10,11,11]` → `10`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Index parity key**: Before single, `nums[even] == nums[even+1]`. After single, that rule breaks — binary search this boundary.
- 🔑 **Nhận biết**: Hỏi "sorted" + "find one different" + O(log n) → luôn là Binary Search on property.
- ⚡ **XOR shortcut**: `a^a=0`, XOR toàn bộ ra phần tử đơn — code 1 dòng nhưng O(n), dùng khi không yêu cầu O(log n).
- ⚡ **Mid alignment**: Luôn làm `mid` chẵn (`mid -= mid%2`) trước khi so sánh để đảm bảo so cặp đúng.
- 🚨 **Edge case**: Mảng 1 phần tử → trả về `nums[0]` ngay; phần tử đơn ở đầu/cuối.
- 💡 **Communicate**: Giải thích "I binary search on even/odd pair alignment" để interviewer thấy bạn hiểu sâu.

---

## Solutions

### Solution 1 — XOR All Elements · O(n) time · O(1) space

```typescript
/**
 * XOR all elements: duplicate pairs cancel (a^a=0), single survives.
 * Simple but O(n) — use when log n not required.
 * Time: O(n) | Space: O(1)
 */
function singleNonDuplicate_xor(nums: number[]): number {
  let result = 0;
  for (const n of nums) result ^= n;
  return result;
}

console.log(singleNonDuplicate_xor([1, 1, 2, 3, 3, 4, 4, 8, 8])); // 2
console.log(singleNonDuplicate_xor([3, 3, 7, 7, 10, 11, 11])); // 10
console.log(singleNonDuplicate_xor([1])); // 1
```

### Solution 2 — Binary Search on Pair Alignment · O(log n) time · O(1) space

```typescript
/**
 * Key insight: make mid even, then check if nums[mid]==nums[mid+1].
 * If yes → pair intact, single is to the right (lo = mid+2).
 * If no  → pair broken, single is here or left  (hi = mid).
 * Time: O(log n) | Space: O(1)
 */
function singleNonDuplicate(nums: number[]): number {
  let lo = 0,
    hi = nums.length - 1;
  while (lo < hi) {
    let mid = lo + ((hi - lo) >> 1);
    if (mid % 2 === 1) mid--; // align to even index
    if (nums[mid] === nums[mid + 1]) {
      lo = mid + 2; // pair intact → single is further right
    } else {
      hi = mid; // pair broken → single is here or left
    }
  }
  return nums[lo];
}

console.log(singleNonDuplicate([1, 1, 2, 3, 3, 4, 4, 8, 8])); // 2
console.log(singleNonDuplicate([3, 3, 7, 7, 10, 11, 11])); // 10
console.log(singleNonDuplicate([1])); // 1
console.log(singleNonDuplicate([1, 1, 2])); // 2
console.log(singleNonDuplicate([1, 2, 2])); // 1
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                                               | Difficulty | Pattern                 |
| --------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| [Find First and Last Position](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array) | 🟡 Medium  | Binary Search           |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)                                              | 🟡 Medium  | Binary Search on Answer |
| [Find Peak Element](https://leetcode.com/problems/find-peak-element)                                                  | 🟡 Medium  | Binary Search           |
| [Single Number](https://leetcode.com/problems/single-number)                                                          | 🟢 Easy    | XOR                     |
