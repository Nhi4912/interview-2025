---
layout: page
title: "Maximize Greatness of an Array"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/maximize-greatness-of-an-array"
---

# Maximize Greatness of an Array / Tối Đa Hóa Sự Vĩ Đại Của Mảng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Boats to Save People](https://leetcode.com/problems/boats-to-save-people) | [Maximum Number of Tasks You Can Assign](https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như trò chơi ghép cặp — bạn có một bộ bài, muốn ghép càng nhiều cặp (thấp, cao) càng tốt. Chiến lược tham lam: dùng quân bài nhỏ nhất thắng được để đánh bại quân bài lớn nhỏ nhất của đối thủ.

**Pattern Recognition:**

- "Permutation" + "maximize count of perm[i] > nums[i]" → Greedy sort + two pointers
- Sort, dùng pointer `j` bắt đầu từ đầu (giá trị nhỏ nhất chưa gán)
- Với mỗi `nums[i]`, nếu `nums[j] < nums[i]` thì cặp được → `j++, count++`

**Visual — nums = [1, 3, 5, 2, 1, 3, 1]:**

```
Sorted: [1, 1, 1, 2, 3, 3, 5]
         j

i=0: nums[0]=1, j→ can we beat with nums[j]=1? No (not strictly >)
     → skip, try nums[1]=1 for j=0...

Use two-pointer: j tracks "to be beaten", i tracks "beater"
j=0, i=0: 1 > 1? No → move i
j=0, i=1: 1 > 1? No → move i
j=0, i=2: 1 > 1? No → move i
j=0, i=3: 2 > 1? Yes → match! count=1, j=1, i=4
j=1, i=4: 3 > 1? Yes → match! count=2, j=2, i=5
j=2, i=5: 3 > 1? Yes → match! count=3, j=3, i=6
j=3, i=6: 5 > 2? Yes → match! count=4 ✅
```

---

## Problem Description

Given an array `nums`, rearrange it into a permutation `perm` to **maximize** the number of indices `i` where `perm[i] > nums[i]`. Return this maximum count (the "greatness").

- Example 1: `nums = [1,3,5,2,1,3,1]` → `4`
- Example 2: `nums = [1,2,3,4]` → `3`

---

## 📝 Interview Tips

1. **Clarify**: "Có phải đây là permutation của chính mảng đó không?" / Is perm a permutation of the same array?
2. **Greedy insight**: "Dùng phần tử nhỏ nhất có thể để đánh bại target nhỏ nhất" / Use smallest possible value to beat smallest target
3. **Two pointers**: "Sort → pointer `j` là candidate, pointer `i` là target" / j=candidates, i=targets after sort
4. **Duplicates**: "Giá trị bằng nhau không tạo greatness, cần strictly greater" / Equal values don't count
5. **Edge case**: "Tất cả giống nhau → greatness = 0" / All same values → 0
6. **Follow-up**: "Nếu cho phép perm[i] >= nums[i]?" / What if ≥ instead of >?

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Two Pointers (Greedy)
 * Time: O(n log n) — sorting dominates
 * Space: O(n) — sorted copy (or O(log n) if in-place sort)
 */
function maximizeGreatness(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  let j = 0,
    count = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] > sorted[j]) {
      count++;
      j++;
    }
  }
  return count;
}

/**
 * Solution 2: Frequency map approach
 * Count how many elements appear more than once — those extras can't be "beaten"
 * greatness = n - maxFrequency (since elements with max freq can't all be matched)
 * Time: O(n log n)
 * Space: O(n)
 */
function maximizeGreatness2(nums: number[]): number {
  const freq = new Map<number, number>();
  for (const x of nums) freq.set(x, (freq.get(x) ?? 0) + 1);
  const maxFreq = Math.max(...freq.values());
  return nums.length - maxFreq;
}

// === Test Cases ===
console.log(maximizeGreatness([1, 3, 5, 2, 1, 3, 1])); // 4
console.log(maximizeGreatness([1, 2, 3, 4])); // 3
console.log(maximizeGreatness([1, 1, 1, 1])); // 0
console.log(maximizeGreatness2([1, 3, 5, 2, 1, 3, 1])); // 4
```

---

## 🔗 Related Problems

| Problem                                                                                | Pattern                | Difficulty |
| -------------------------------------------------------------------------------------- | ---------------------- | ---------- |
| [Boats to Save People](https://leetcode.com/problems/boats-to-save-people)             | Greedy + Two Pointers  | Medium     |
| [Assign Cookies](https://leetcode.com/problems/assign-cookies)                         | Greedy + Two Pointers  | Easy       |
| [Most Profit Assigning Work](https://leetcode.com/problems/most-profit-assigning-work) | Sorting + Two Pointers | Medium     |
| [Advantage Shuffle](https://leetcode.com/problems/advantage-shuffle)                   | Greedy Matching        | Medium     |
