---
layout: page
title: "Valid Triangle Number"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/valid-triangle-number"
---

# Valid Triangle Number / Số Tam Giác Hợp Lệ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Giống chọn 3 thanh gỗ làm tam giác:** chỉ cần kiểm tra 2 cạnh nhỏ nhất cộng lại phải lớn hơn cạnh lớn nhất. Sau khi sort, fix cạnh lớn nhất và dùng hai con trỏ để đếm nhanh.

**Pattern Recognition:**

- Signal: "sort + count valid triplets + triangle inequality" → **Sort + Two Pointers**
- Sau khi sort `a ≤ b ≤ c`: chỉ cần `a + b > c` (hai điều kiện kia tự thỏa)
- Fix `c` (largest), dùng L/R để đếm tất cả pairs (L, R) thỏa mãn

**Visual:**

```
nums = [2, 2, 3, 4] (sorted)
Fix k=3 (val=4):
  L=0(2), R=2(3): 2+3=5>4 → count += R-L = 2, pairs:(0,2),(1,2) → R--
  L=0(2), R=1(2): 2+2=4 not >4 → L++
  L=1 == R=1 → stop. Count for k=3: 2

Fix k=2 (val=3):
  L=0(2), R=1(2): 2+2=4>3 → count += 1 → total=3
Result: 3 ✅
```

## Problem Description

Given an integer array `nums`, return the number of triplets `(i,j,k)` with `i<j<k` such that `nums[i]`, `nums[j]`, `nums[k]` can form a valid triangle (sum of any two sides > third side).

- Example 1: `[2,2,3,4]` → `3` (triplets: (2,3,4),(2,3,4),(2,2,3))
- Example 2: `[4,2,3,4]` → `4`

## 📝 Interview Tips

1. **Clarify**: Có số 0 trong array không? / Can nums contain zeros? (a=0 can never be a side)
2. **Approach**: Sort trước, fix cạnh lớn nhất, two pointers cho hai cạnh còn lại / Sort, fix largest, two-pointer remaining
3. **Edge cases**: Mảng ≤ 2 phần tử → 0 / Arrays with fewer than 3 elements return 0
4. **Optimize**: O(n³) → O(n²) nhờ sort + two pointers / Brute O(n³), optimized O(n²) with two-ptr
5. **Follow-up**: Liệt kê các bộ ba? / Enumerate all valid triplets? → same but collect indices
6. **Complexity**: Time O(n²), Space O(log n) for sort stack / O(n²) time, O(1) extra space

## Solutions

```typescript
/** Solution 1: Brute Force – Check All Triplets
 * Time: O(n³) | Space: O(1)
 */
function triangleNumberBrute(nums: number[]): number {
  const n = nums.length;
  let count = 0;
  for (let i = 0; i < n - 2; i++)
    for (let j = i + 1; j < n - 1; j++)
      for (let k = j + 1; k < n; k++) {
        const [a, b, c] = [nums[i], nums[j], nums[k]];
        if (a + b > c && a + c > b && b + c > a) count++;
      }
  return count;
}

/** Solution 2: Sort + Two Pointers
 * Time: O(n²) | Space: O(log n)
 */
function triangleNumber(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  let count = 0;

  // Fix k as the largest side index
  for (let k = n - 1; k >= 2; k--) {
    let l = 0,
      r = k - 1;
    while (l < r) {
      if (nums[l] + nums[r] > nums[k]) {
        // All pairs (l, l+1, ..., r-1) with r also valid
        count += r - l;
        r--;
      } else {
        l++;
      }
    }
  }
  return count;
}

/** Solution 3: Sort + Binary Search
 * Time: O(n² log n) | Space: O(log n)
 */
function triangleNumberBS(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  let count = 0;

  for (let i = 0; i < n - 2; i++) {
    for (let j = i + 1; j < n - 1; j++) {
      // Binary search: find largest k where nums[k] < nums[i] + nums[j]
      const target = nums[i] + nums[j];
      let lo = j + 1,
        hi = n - 1,
        pos = j;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] < target) {
          pos = mid;
          lo = mid + 1;
        } else hi = mid - 1;
      }
      count += pos - j;
    }
  }
  return count;
}

// Tests
console.log(triangleNumber([2, 2, 3, 4])); // 3
console.log(triangleNumber([4, 2, 3, 4])); // 4
console.log(triangleNumber([0, 1, 0])); // 0
console.log(triangleNumber([1, 1, 1, 1])); // 4
console.log(triangleNumberBrute([2, 2, 3, 4])); // 3
console.log(triangleNumberBS([2, 2, 3, 4])); // 3
```

## 🔗 Related Problems

| Problem                                                                                | Relationship                         |
| -------------------------------------------------------------------------------------- | ------------------------------------ |
| [3Sum](https://leetcode.com/problems/3sum)                                             | Sort + two pointers for triplets     |
| [3Sum Smaller](https://leetcode.com/problems/3sum-smaller)                             | Same structure, count pairs < target |
| [Most Profit Assigning Work](https://leetcode.com/problems/most-profit-assigning-work) | Sort + two-pointer matching          |
