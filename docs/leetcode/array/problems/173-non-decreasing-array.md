---
layout: page
title: "Non-decreasing Array"
difficulty: Medium
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/non-decreasing-array"
---

# Non-decreasing Array / Mảng Không Giảm

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VN:** Cho phép sửa đúng một phần tử. Khi gặp `nums[i] > nums[i+1]`, có hai lựa chọn: hạ `nums[i]` xuống hoặc nâng `nums[i+1]` lên. Kiểm tra xem lựa chọn nào hợp lệ với phần tử trước đó.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Non-decreasing Array example:**

```
[3, 4, 2, 3]
       ↑ gặp 4 > 2, hai lựa chọn:
  A: hạ 4 → 2: [3, 2, 2, 3] → 3 > 2 ✗ không hợp lệ
  B: nâng 2 → 4: [3, 4, 4, 3] → tiếp tục kiểm tra
```

---

---

## Problem Description

| Problem                                                                                                                           | Difficulty | Pattern        |
| --------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| [Longest Non-Decreasing Subarray From Two Arrays](https://leetcode.com/problems/longest-non-decreasing-subarray-from-two-arrays/) | 🟡 Medium  | DP / Array     |
| [Maximum Sum of 3 Non-Overlapping Subarrays](https://leetcode.com/problems/maximum-sum-of-3-non-overlapping-subarrays/)           | 🔴 Hard    | Sliding Window |
| [Make Array Non-decreasing or Non-increasing](https://leetcode.com/problems/make-array-non-decreasing-or-non-increasing/)         | 🟡 Medium  | Greedy         |

---

## 📝 Interview Tips

- 🇻🇳 Khi `nums[i-1] > nums[i+1]`, ta buộc phải nâng `nums[i+1]` (không thể hạ `nums[i]`).
- 🇺🇸 If `nums[i-1] > nums[i+1]`, we must raise `nums[i+1]`, not lower `nums[i]`.
- 🇻🇳 Chỉ được sửa đúng một lần — dùng biến `count` để theo dõi.
- 🇺🇸 Use a `count` flag; return false on the second violation.
- 🇻🇳 Sửa in-place để phần kiểm tra tiếp theo dùng giá trị đã cập nhật.
- 🇺🇸 Mutate the array in-place so subsequent checks use updated values.

---

---

## Solutions

```typescript
/**
 * Allow at most one modification; check both removal options greedily.
 * Time: O(n) | Space: O(1)
 */
function checkPossibility(nums: number[]): boolean {
  let violations = 0;

  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] > nums[i + 1]) {
      violations++;
      if (violations > 1) return false;

      // Option A: lower nums[i] to nums[i+1] (safe if i==0 or nums[i-1] <= nums[i+1])
      // Option B: raise nums[i+1] to nums[i]
      if (i > 0 && nums[i - 1] > nums[i + 1]) {
        nums[i + 1] = nums[i]; // must raise right element
      } else {
        nums[i] = nums[i + 1]; // lower left element (safer default)
      }
    }
  }

  return true;
}

console.log(checkPossibility([4, 2, 3])); // true  (lower 4→2)
console.log(checkPossibility([4, 2, 1])); // false (two violations)
console.log(checkPossibility([3, 4, 2, 3])); // false
console.log(checkPossibility([5, 7, 1, 8])); // true  (raise 1→7)

/**
 * When a violation is found, try skipping index i or i+1 and verify the rest.
 * Time: O(n) | Space: O(1)
 */
function checkPossibility2(nums: number[]): boolean {
  const isNonDecreasing = (arr: number[], skip: number): boolean => {
    let prev = -Infinity;
    for (let i = 0; i < arr.length; i++) {
      if (i === skip) continue;
      if (arr[i] < prev) return false;
      prev = arr[i];
    }
    return true;
  };

  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] > nums[i + 1]) {
      // Try removing nums[i] OR nums[i+1]
      return isNonDecreasing(nums, i) || isNonDecreasing(nums, i + 1);
    }
  }

  return true; // already non-decreasing
}

console.log(checkPossibility2([4, 2, 3])); // true
console.log(checkPossibility2([4, 2, 1])); // false
console.log(checkPossibility2([3, 4, 2, 3])); // false
console.log(checkPossibility2([1, 5, 3])); // true
```

---

## 🔗 Related Problems

| Problem                                                                                                                           | Difficulty | Pattern        |
| --------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| [Longest Non-Decreasing Subarray From Two Arrays](https://leetcode.com/problems/longest-non-decreasing-subarray-from-two-arrays/) | 🟡 Medium  | DP / Array     |
| [Maximum Sum of 3 Non-Overlapping Subarrays](https://leetcode.com/problems/maximum-sum-of-3-non-overlapping-subarrays/)           | 🔴 Hard    | Sliding Window |
| [Make Array Non-decreasing or Non-increasing](https://leetcode.com/problems/make-array-non-decreasing-or-non-increasing/)         | 🟡 Medium  | Greedy         |
