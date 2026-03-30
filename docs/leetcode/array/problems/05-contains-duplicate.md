---
layout: page
title: "Contains Duplicate"
difficulty: Easy
category: Array
tags: [Array, Hash Table, Sorting]
leetcode_url: "https://leetcode.com/problems/contains-duplicate/"
---

# Contains Duplicate / Kiểm Tra Phần Tử Trùng Lặp

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Set  
> **Frequency**: 📘 Tier 3 — Screening question, tests basic hash set usage  
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Single Number](06-single-number.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Bạn kiểm tra danh sách khách mời: dùng một cuốn sổ ghi lại tên đã thấy. Mỗi lần đọc tên mới — tra sổ trước, nếu đã có → trùng! Nếu chưa → ghi vào. Không cần xem hết danh sách nếu tìm được trùng sớm.

- **Pattern Recognition:**
  - "Any value appears at least twice?" → **Hash Set** (O(1) lookup, early exit)
  - Nếu cho phép sort mảng → so sánh `nums[i] === nums[i-1]` (O(1) space, O(n log n) time)
  - `new Set(nums).size !== nums.length` — one-liner but traverses full array, no early exit

- **Visual — Hash Set Walk:**

```
nums = [1, 2, 3, 1]
        ↓
seen = {}
i=0: seen.has(1)? No  → seen={1}
i=1: seen.has(2)? No  → seen={1,2}
i=2: seen.has(3)? No  → seen={1,2,3}
i=3: seen.has(1)? YES → return true ✓

nums = [1, 2, 3, 4]  → never hit, return false
```

## Problem Description

Given integer array `nums`, return `true` if any value appears **at least twice**, `false` if all elements are distinct.

```
Input:  [1, 2, 3, 1]                  → true   (1 appears twice)
Input:  [1, 2, 3, 4]                  → false  (all distinct)
Input:  [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] → true
```

## 📝 Interview Tips

1. **Tại sao Set thay vì Map?**: Chỉ cần biết đã thấy hay chưa, không cần đếm → Set đủ / **Set vs Map**: no counting needed — Set membership is sufficient
2. **Early exit**: Dừng ngay khi tìm thấy trùng, không cần duyệt hết / **Optimization**: return `true` immediately on first duplicate found
3. **Sort trade-off**: Sorting O(n log n) dùng O(1) extra space; Set O(n) time dùng O(n) space — nêu cả hai / **Trade-off**: sorting avoids extra space but modifies input; ask if mutation is allowed
4. **One-liner trap**: `new Set(nums).size !== nums.length` đúng nhưng không early exit / **Interview note**: one-liner is less optimal — no short-circuit
5. **Edge cases**: mảng rỗng → false; 1 phần tử → false; toàn giống nhau → true
6. **Follow-up**: "Within distance k?" → sliding window Set (Contains Duplicate II)

## Solutions

{% raw %}
/\*\*

- Solution 1: Hash Set — Optimal (with early exit)
- Time: O(n) | Space: O(n)
  \*/
  function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();

for (const num of nums) {
if (seen.has(num)) return true;
seen.add(num);
}

return false;
}

/\*\*

- Solution 2: Sort + Adjacent Compare — O(1) extra space
- Time: O(n log n) | Space: O(1) (modifies input)
  \*/
  function containsDuplicateSort(nums: number[]): boolean {
  nums.sort((a, b) => a - b);

for (let i = 1; i < nums.length; i++) {
if (nums[i] === nums[i - 1]) return true;
}

return false;
}

// Inline tests
console.log(containsDuplicate([1, 2, 3, 1]) === true); // true
console.log(containsDuplicate([1, 2, 3, 4]) === false); // true
console.log(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]) === true); // true
console.log(containsDuplicate([]) === false); // true
{% endraw %}

## 🔗 Related Problems

| Problem                                                                  | Relationship                                        |
| ------------------------------------------------------------------------ | --------------------------------------------------- |
| [#06 Single Number](06-single-number.md)                                 | Related frequency/uniqueness problem — XOR approach |
| [#07 Intersection of Two Arrays II](07-intersection-of-two-arrays-ii.md) | Hash map frequency counting pattern                 |
| [#04 Two Sum](04-two-sum.md)                                             | Hash table lookup pattern — same O(n) space idea    |
| [#29 Top K Frequent Elements](29-top-k-frequent-elements.md)             | Frequency counting with hash map extension          |
