---
layout: page
title: "Merge Sorted Array"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Two Pointers, Sorting]
leetcode_url: "https://leetcode.com/problems/merge-sorted-array/"
---

# Merge Sorted Array / Ghép Hai Mảng Đã Sắp Xếp

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers (from end)
> **Frequency**: ⭐ Tier 2 — Gặp ~60% interviews, kinh điển về in-place merge
> **See also**: [Find K Largest](./02-find-k-largest-elements.md) | [Median of Two Sorted Arrays](./04-median-of-two-sorted-arrays.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai hàng người đứng xếp theo chiều cao, bạn cần nhập họ vào một hàng duy nhất. Thay vì chen từ đầu (sẽ đẩy người khác), bạn đứng ở cuối — lấy người cao nhất trong hai hàng đặt vào vị trí cuối cùng. Cứ như vậy lui dần về trước, không ai bị chen.

**Pattern Recognition:**

- Signal: "merge two sorted arrays in-place", extra space at tail of nums1 → **Two Pointers from end**
- Điền từ cuối tránh ghi đè phần tử chưa xử lý của nums1
- Nếu nums2 còn dư sau vòng lặp, copy thẳng vào — nums1 phần còn lại đã đúng vị trí

**Visual — nums1=[1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3:**

```
p1=2(val=3)  p2=2(val=6)  p=5
  [1,2,3,0,0,0]  +  [2,5,6]

Step 1: 3 < 6 → nums1[5]=6,  p2=1, p=4   → [1,2,3,0,0,6]
Step 2: 3 < 5 → nums1[4]=5,  p2=0, p=3   → [1,2,3,0,5,6]
Step 3: 3 > 2 → nums1[3]=3,  p1=1, p=2   → [1,2,3,3,5,6]
Step 4: 2 = 2 → nums1[2]=2,  p2=-1,p=1   → [1,2,2,3,5,6] ✅ done
```

---

## Problem Description

Given two sorted arrays `nums1` (size m+n, last n slots are 0) and `nums2` (size n), merge nums2 into nums1 **in-place** in sorted order.

```
Example 1: nums1=[1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3  → [1,2,2,3,5,6]
Example 2: nums1=[1], m=1, nums2=[], n=0                  → [1]
Example 3: nums1=[0], m=0, nums2=[1], n=1                 → [1]
```

---

## 📝 Interview Tips

1. **Hỏi ngay**: "Có thể dùng extra space không?" → Interviewer muốn nghe O(1)
2. **Tại sao từ cuối?** Vì nums1 có n slot trống ở cuối — điền từ sau tránh overwrite
3. **Đừng quên**: sau vòng lặp chính, nếu p2 >= 0 thì copy nums2[0..p2] vào nums1
4. **Nếu p1 còn dư**: không cần làm gì — chúng đã ở đúng chỗ trong nums1
5. **Hỏi follow-up**: "k mảng đã sắp thì sao?" → merge từng đôi, hoặc dùng min-heap
6. **Complexity**: Time O(m+n), Space O(1) — tối ưu không thể cải thiện hơn

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Concat + Sort
 * Time O((m+n) log(m+n)), Space O(1) amortized
 */
function mergeBrute(nums1: number[], m: number, nums2: number[], n: number): void {
  for (let i = 0; i < n; i++) nums1[m + i] = nums2[i];
  nums1.sort((a, b) => a - b);
}

/**
 * Solution 2: Two Pointers from End (Optimal)
 * Time O(m+n), Space O(1)
 *
 * Key insight: fill nums1 from the back to avoid overwriting
 * unprocessed elements.
 */
function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  let p1 = m - 1; // pointer for nums1 active elements
  let p2 = n - 1; // pointer for nums2
  let p = m + n - 1; // write pointer (tail of nums1)

  while (p1 >= 0 && p2 >= 0) {
    if (nums1[p1] > nums2[p2]) {
      nums1[p--] = nums1[p1--];
    } else {
      nums1[p--] = nums2[p2--];
    }
  }

  // Any remaining nums2 elements (nums1 leftovers are already in place)
  while (p2 >= 0) {
    nums1[p--] = nums2[p2--];
  }
}

// --- Quick inline tests ---
const t1 = [1, 2, 3, 0, 0, 0];
merge(t1, 3, [2, 5, 6], 3);
console.log(JSON.stringify(t1) === "[1,2,2,3,5,6]"); // true
const t2 = [1];
merge(t2, 1, [], 0);
console.log(JSON.stringify(t2) === "[1]"); // true
const t3 = [0];
merge(t3, 0, [1], 1);
console.log(JSON.stringify(t3) === "[1]"); // true
const t4 = [4, 5, 6, 0, 0, 0];
merge(t4, 3, [1, 2, 3], 3);
console.log(JSON.stringify(t4) === "[1,2,3,4,5,6]"); // true
```

---

## 🔗 Related Problems

| Problem                                                                                      | Relationship                               |
| -------------------------------------------------------------------------------------------- | ------------------------------------------ |
| [88. Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/)                  | This problem                               |
| [21. Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/)          | Same idea, linked list instead of array    |
| [4. Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) | Hard version — find median without merging |
| [23. Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)              | Extension to k arrays using heap           |
| [977. Squares of a Sorted Array](https://leetcode.com/problems/squares-of-a-sorted-array/)   | Two pointers from ends, same pattern       |
