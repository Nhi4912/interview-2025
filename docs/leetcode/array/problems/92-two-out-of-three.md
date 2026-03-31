---
layout: page
title: "Two Out of Three"
difficulty: Easy
category: Array
tags: [Array, Hash Table, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/two-out-of-three"
---

# Two Out of Three / Xuất Hiện Trong Ít Nhất Hai Mảng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Table
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Missing Number](https://leetcode.com/problems/missing-number) | [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống bầu cử — một ứng viên đạt "đa số" nếu được ít nhất 2/3 nhóm cử tri ủng hộ. Ta đánh dấu mỗi số xuất hiện trong mảng nào, rồi đếm xem có ≥ 2 "phiếu" không.

**Visual:**

```
nums1=[1,1,3,2], nums2=[2,3], nums3=[3]

sets:  s1={1,3,2}  s2={2,3}  s3={3}

value 1: in s1 only      → count=1 ✗
value 2: in s1 + s2      → count=2 ✓
value 3: in s1+s2+s3     → count=3 ✓

Result: [2, 3]
```

---

## Problem Description

Given three integer arrays `nums1`, `nums2`, and `nums3`, return a distinct array of all values that are present in **at least two** of the three arrays. The result may be in any order.

- Example 1: `nums1=[1,1,3,2], nums2=[2,3], nums3=[3]` → `[3,2]`
- Example 2: `nums1=[3,1], nums2=[2,3], nums3=[1,2]` → `[3,2,1]`

**Constraints:** `1 <= nums1.length, nums2.length, nums3.length <= 100`, `1 <= nums[i] <= 100`

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Kết quả có cần sorted không? Có thể có duplicate trong mỗi mảng không?" / Order irrelevant, duplicates within array are deduplicated first.
2. **Key step**: "Convert mỗi array sang Set trước để loại duplicate" / Use Set per array before counting.
3. **Hash map approach**: "Map từ value → số mảng chứa nó" / Map<value, count> across 3 sets.
4. **Bit trick**: "Dùng bitmask: bit 0 = array1, bit 1 = array2, bit 2 = array3" / OR bits, check popcount >= 2.
5. **Edge case**: "Giá trị chỉ xuất hiện nhiều lần trong cùng một mảng" / De-duplicate per array first.
6. **Complexity**: "O(n1+n2+n3) time, O(n) space với Set/Map" / Linear time and space.

---

## Solutions

```typescript
/**
 * Solution 1: Hash Map Count
 * Time: O(n1 + n2 + n3) — iterate all three arrays
 * Space: O(n1 + n2 + n3) — store unique values per set
 */
function twoOutOfThreeMap(nums1: number[], nums2: number[], nums3: number[]): number[] {
  const count = new Map<number, number>();

  for (const arr of [nums1, nums2, nums3]) {
    // Use Set to deduplicate within each array
    for (const n of new Set(arr)) {
      count.set(n, (count.get(n) ?? 0) + 1);
    }
  }

  const result: number[] = [];
  for (const [val, cnt] of count) {
    if (cnt >= 2) result.push(val);
  }
  return result;
}

console.log(twoOutOfThreeMap([1, 1, 3, 2], [2, 3], [3])); // [3, 2]
console.log(twoOutOfThreeMap([3, 1], [2, 3], [1, 2])); // [3, 2, 1]
console.log(twoOutOfThreeMap([1, 2, 2], [4, 3, 3], [5])); // []

/**
 * Solution 2: Bitmask Trick
 * Time: O(n1 + n2 + n3)
 * Space: O(max_value) — array indexed by value (works since vals <= 100)
 *
 * Each value gets a bitmask: bit i set if present in array i+1.
 * If popcount(mask) >= 2, include in result.
 */
function twoOutOfThree(nums1: number[], nums2: number[], nums3: number[]): number[] {
  const mask = new Array(101).fill(0);

  for (const n of new Set(nums1)) mask[n] |= 1; // bit 0
  for (const n of new Set(nums2)) mask[n] |= 2; // bit 1
  for (const n of new Set(nums3)) mask[n] |= 4; // bit 2

  const result: number[] = [];
  for (let v = 1; v <= 100; v++) {
    // At least 2 bits set ↔ value >= 3 and not power of 2, or mask & (mask-1) != 0
    const m = mask[v];
    if (m !== 0 && (m & (m - 1)) !== 0) result.push(v);
    // Alternatively: popcount(m) >= 2
    // (m has >= 2 bits set) iff m is not 0, 1, 2, or 4
  }
  return result;
}

console.log(twoOutOfThree([1, 1, 3, 2], [2, 3], [3])); // [2, 3]
console.log(twoOutOfThree([3, 1], [2, 3], [1, 2])); // [1, 2, 3]
```

---

## 🔗 Related Problems

| Problem                                                                                                        | Pattern          | Difficulty |
| -------------------------------------------------------------------------------------------------------------- | ---------------- | ---------- |
| [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays)                         | Hash Set         | Easy       |
| [Intersection of Two Arrays II](https://leetcode.com/problems/intersection-of-two-arrays-ii)                   | Hash Map         | Easy       |
| [Missing Number](https://leetcode.com/problems/missing-number)                                                 | Bit XOR          | Easy       |
| [Minimum Operations to Collect Elements](https://leetcode.com/problems/minimum-operations-to-collect-elements) | Bit Manipulation | Easy       |
