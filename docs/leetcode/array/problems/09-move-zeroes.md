---
layout: page
title: "Move Zeroes"
difficulty: Easy
category: Array
tags: [Array, Two Pointers]
leetcode_url: "https://leetcode.com/problems/move-zeroes/"
---

# Move Zeroes / Dời Số 0 Về Cuối Mảng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers — Write Pointer
> **Frequency**: 📘 Tier 2 — Câu warm-up rất phổ biến; thường được dùng để kiểm tra tư duy in-place
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Remove Element #27](https://leetcode.com/problems/remove-element/)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng bạn đang nhặt các viên bi màu từ một hàng có xen kẽ các vị trí trống (số 0). Bạn dùng tay trái để chỉ vị trí "sẽ đặt viên bi tiếp theo" và tay phải để quét qua. Mỗi khi tay phải gặp viên bi (khác 0), chuyển nó sang vị trí tay trái đang giữ. Cuối cùng, lấp đầy phần còn lại bằng 0.

- **Pattern Recognition:**
  - Phải **giữ nguyên thứ tự** các phần tử khác 0 → không thể dùng sort hay swap tuỳ tiện
  - Cần di chuyển in-place → two pointers: `write` (vị trí ghi) và `read` (vị trí đọc)
  - Số lần ghi = số phần tử khác 0 → sau đó fill phần còn lại bằng 0

- **Visual — Write Pointer:**

  ```
  nums = [0, 1, 0, 3, 12]
  write=0  read scans →

  read=0: nums[0]=0  skip
  read=1: nums[1]=1  write: nums[0]=1  write→1   → [1, 1, 0, 3, 12]
  read=2: nums[2]=0  skip
  read=3: nums[3]=3  write: nums[1]=3  write→2   → [1, 3, 0, 3, 12]
  read=4: nums[4]=12 write: nums[2]=12 write→3   → [1, 3, 12, 3, 12]

  fill zeros from write=3 to end              → [1, 3, 12, 0, 0] ✅
  ```

## Problem Description

Cho mảng `nums`, dời tất cả số `0` về cuối, **giữ nguyên thứ tự** các phần tử khác 0. Thực hiện **in-place** (không tạo bản sao).

| Input          | Output         | Ghi chú                    |
| -------------- | -------------- | -------------------------- |
| `[0,1,0,3,12]` | `[1,3,12,0,0]` | Trường hợp cơ bản          |
| `[0]`          | `[0]`          | Mảng toàn 0                |
| `[1,2,3]`      | `[1,2,3]`      | Không có 0, không thay đổi |

## 📝 Interview Tips

- 🇻🇳 Hỏi: có cần tối thiểu hoá số lần ghi (write operations) không? / 🇬🇧 _Ask: is minimising write operations a constraint?_
- 🇻🇳 Solution 1 (write pointer) tối thiểu hoá writes; Solution 2 (swap) ít ghi hơn khi mảng hầu hết là số khác 0 / 🇬🇧 _Swap variant has fewer total writes when zeros are rare_
- 🇻🇳 **Không** được dùng array mới — đây là điều kiện in-place / 🇬🇧 _"Without making a copy" means no extra O(n) array_
- 🇻🇳 Thứ tự các phần tử khác 0 **phải được giữ nguyên** → không dùng sort / 🇬🇧 _Relative order must be preserved — sorting would break this_
- 🇻🇳 Kiểm tra edge case: mảng rỗng, toàn 0, không có 0 / 🇬🇧 _Cover: empty array, all-zeros, no-zeros_

## Solutions

```typescript
/**

- Solution 1: Write Pointer — Optimal (tối thiểu số lần ghi)
- Dùng `write` để ghi các phần tử khác 0 lên đầu, sau đó fill 0 vào phần còn lại.
- Mỗi phần tử được ghi tối đa 1 lần → tối ưu về write operations.
-
- @time O(n) — một lần duyệt để di chuyển, một lần để fill zeros
- @space O(1) — in-place hoàn toàn
  */
  function moveZeroes(nums: number[]): void {
  let write = 0;

// Pass 1: copy all non-zero elements to front
for (let i = 0; i < nums.length; i++) {
if (nums[i] !== 0) nums[write++] = nums[i];
}

// Pass 2: fill remaining positions with zero
while (write < nums.length) nums[write++] = 0;
}

// const a = [0,1,0,3,12]; moveZeroes(a); // a → [1,3,12,0,0]
// const b = [0]; moveZeroes(b); // b → [0]
// const c = [1,2,3]; moveZeroes(c); // c → [1,2,3]
// const d = [0,0,1]; moveZeroes(d); // d → [1,0,0]

/**

- Solution 2: Swap Variant — Minimal Total Operations
- Swap phần tử khác 0 với vị trí `slow`. Ít swap hơn khi phần lớn là khác 0
- vì không cần fill zeros ở cuối — zeros tự động "rơi xuống" qua swap.
-
- @time O(n) — một lần duyệt duy nhất
- @space O(1) — in-place hoàn toàn
  */
  function moveZeroesSwap(nums: number[]): void {
  let slow = 0;
  for (let fast = 0; fast < nums.length; fast++) {
  if (nums[fast] !== 0) {
  [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
  slow++;
  }
  }
  }

// const e = [0,1,0,3,12]; moveZeroesSwap(e); // e → [1,3,12,0,0]
// const f = [4,2,4,0,0]; moveZeroesSwap(f); // f → [4,2,4,0,0]
```

## 🔗 Related Problems

- [27. Remove Element](https://leetcode.com/problems/remove-element/) — cùng write pointer pattern, xoá phần tử cụ thể
- [26. Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) — write pointer trên mảng đã sort
- [283 follow-up: Sort Colors](https://leetcode.com/problems/sort-colors/) — 3-way partition (Dutch National Flag)
- [75. Sort Colors](https://leetcode.com/problems/sort-colors/) — mở rộng: phân loại 3 nhóm in-place
