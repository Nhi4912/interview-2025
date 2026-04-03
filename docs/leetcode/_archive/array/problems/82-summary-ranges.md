---
layout: page
title: "Summary Ranges"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/summary-ranges"
---

# Summary Ranges / Tóm Tắt Dãy Số Liên Tiếp

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Array
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Missing Ranges](https://leetcode.com/problems/missing-ranges) | [Data Stream as Disjoint Intervals](https://leetcode.com/problems/data-stream-as-disjoint-intervals)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống gộp các toa tàu liên tiếp thành một đoạn: `[1,2,3,5,6]` → toa 1-2-3 liên tiếp → gộp thành "1->3", toa 5-6 liên tiếp → "5->6". Dùng hai con trỏ: `start` đánh dấu đầu đoạn hiện tại.

```
nums = [0, 1, 2, 4, 5, 7]
         ^start
  i=1: nums[1]=1 == nums[0]+1=1 ✓ extend
  i=2: nums[2]=2 == nums[1]+1=2 ✓ extend
  i=3: nums[3]=4 != nums[2]+1=3 ✗ → push "0->2", start=i=3
  i=4: nums[4]=5 == nums[3]+1=5 ✓ extend
  i=5: nums[5]=7 != nums[4]+1=6 ✗ → push "4->5", start=i=5
end:  push "7"   → result = ["0->2", "4->5", "7"]
```

---

## Problem Description

Given a sorted unique integer array `nums`, return the **smallest sorted list of ranges** that cover all the numbers exactly. Each range `[a,b]` is formatted as `"a->b"` if `a != b`, or just `"a"` if `a == b`.

- Example 1: `nums = [0,1,2,4,5,7]` → `["0->2","4->5","7"]`
- Example 2: `nums = [0,2,3,4,6,8,9]` → `["0","2->4","6","8->9"]`

Constraints: `0 <= nums.length <= 20`, `-2^31 <= nums[i] <= 2^31-1`, all values unique and sorted in ascending order.

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "Array đã được sort và không có trùng lặp?" / Confirm sorted + unique — simplifies range detection to a simple gap check.
2. **Two-pointer / Hai con trỏ**: "Dùng `start` và `i` — khi `nums[i] != nums[i-1]+1` thì đóng range" / Track range start; close when consecutive property breaks.
3. **Format / Định dạng**: "Khi `start == end` chỉ in một số, không cần `->`" / Single-element range omits the arrow.
4. **Edge case / Trường hợp đặc biệt**: "Mảng rỗng → `[]`, mảng 1 phần tử → `[\"n\"]`" / Empty array returns empty list; single element is its own range.
5. **Overflow / Tràn số**: "Dùng `nums[i] - nums[i-1] !== 1` thay vì `nums[i-1] + 1 === nums[i]` để tránh overflow 32-bit" / Subtraction is safer near INT_MAX.
6. **Complexity / Độ phức tạp**: "O(n) time, O(1) extra space ngoài output" / Single scan — each element examined once.

---

## Solutions

```typescript
/**
 * Solution 1: Single Pass with inner while loop
 * Time: O(n) — each element visited exactly once
 * Space: O(1) — output array excluded from space analysis
 */
function summaryRanges(nums: number[]): string[] {
  const result: string[] = [];
  let i = 0;

  while (i < nums.length) {
    const start = nums[i];
    while (i + 1 < nums.length && nums[i + 1] === nums[i] + 1) {
      i++;
    }
    result.push(start === nums[i] ? `${start}` : `${start}->${nums[i]}`);
    i++;
  }

  return result;
}

/**
 * Solution 2: For loop with explicit range close
 * Time: O(n) — identical single pass
 * Space: O(1) — output only
 */
function summaryRangesAlt(nums: number[]): string[] {
  const result: string[] = [];
  const n = nums.length;

  for (let i = 0; i < n; ) {
    const lo = nums[i];
    while (i + 1 < n && nums[i + 1] - nums[i] === 1) i++;
    const hi = nums[i];
    result.push(lo === hi ? String(lo) : `${lo}->${hi}`);
    i++;
  }

  return result;
}

// === Test Cases ===
console.log(summaryRanges([0, 1, 2, 4, 5, 7])); // ["0->2","4->5","7"]
console.log(summaryRanges([0, 2, 3, 4, 6, 8, 9])); // ["0","2->4","6","8->9"]
console.log(summaryRanges([])); // []
console.log(summaryRanges([-1])); // ["-1"]
console.log(summaryRanges([-3, -2, -1, 0, 1])); // ["-3->1"]
console.log(summaryRanges([1, 3, 5, 7])); // ["1","3","5","7"] (no consecutive)
console.log(summaryRangesAlt([0, 1, 2, 4, 5, 7])); // ["0->2","4->5","7"]
```

---

## 🔗 Related Problems

| Problem                                                                                              | Pattern                    | Difficulty |
| ---------------------------------------------------------------------------------------------------- | -------------------------- | ---------- |
| [Missing Ranges](https://leetcode.com/problems/missing-ranges)                                       | Range generation from gaps | 🟢 Easy    |
| [Merge Intervals](https://leetcode.com/problems/merge-intervals)                                     | Interval merging           | 🟡 Medium  |
| [Data Stream as Disjoint Intervals](https://leetcode.com/problems/data-stream-as-disjoint-intervals) | Dynamic interval tree      | 🔴 Hard    |
| [Partition Labels](https://leetcode.com/problems/partition-labels)                                   | Two-pointer range tracking | 🟡 Medium  |
