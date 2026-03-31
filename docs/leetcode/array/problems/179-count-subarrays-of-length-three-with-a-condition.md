---
layout: page
title: "Count Subarrays of Length Three With a Condition"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/count-subarrays-of-length-three-with-a-condition"
---

# Count Subarrays of Length Three With a Condition / Đếm Mảng Con Độ Dài Ba Với Điều Kiện

🟢 Easy | Tags: Array

---

## 🧠 Intuition / Trực Giác

**VN:** Với mỗi bộ ba liên tiếp `[a, b, c]`, kiểm tra `a + c == b / 2`, tức là `2*(a + c) == b`. Nhân với 2 để tránh số thực dấu phẩy động.

```
nums = [1, 2, 1, 4, 1]
        a  b  c → 2*(1+1)=4 == 2 → NO

        2  1  4 → 2*(2+4)=12 ≠ 1 → NO

        1  4  1 → 2*(1+1)=4 == 4 → YES ✓
count = 1
```

---

## 📝 Interview Tips

- 🇻🇳 Dùng `2*(a+c) == b` thay vì `a+c == b/2` để tránh lỗi chia số nguyên.
- 🇺🇸 Use `2*(a+c) === b` to avoid integer division pitfalls.
- 🇻🇳 Chỉ cần một vòng lặp O(n); không cần cửa sổ trượt phức tạp.
- 🇺🇸 A single O(n) loop suffices — no complex sliding window needed.
- 🇻🇳 Chú ý dừng vòng lặp ở `nums.length - 2` để tránh out-of-bounds.
- 🇺🇸 Loop up to `length - 2` (inclusive) to avoid out-of-bounds access.

---

## 💡 Solutions

### Solution 1: Linear Scan

```typescript
/**
 * Check each triple (a, b, c): 2*(a+c) == b.
 * Time: O(n) | Space: O(1)
 */
function countSubarrays(nums: number[]): number {
  let count = 0;

  for (let i = 0; i < nums.length - 2; i++) {
    if (2 * (nums[i] + nums[i + 2]) === nums[i + 1]) {
      count++;
    }
  }

  return count;
}

console.log(countSubarrays([1, 2, 1, 4, 1])); // 1
console.log(countSubarrays([1, 1, 1])); // 0
console.log(countSubarrays([2, 4, 2, 8, 4])); // 2
console.log(countSubarrays([0, 0, 0])); // 1
```

### Solution 2: Destructured Sliding Window (Readable)

```typescript
/**
 * Use explicit variable names for the triple.
 * Time: O(n) | Space: O(1)
 */
function countSubarrays2(nums: number[]): number {
  let count = 0;

  for (let i = 1; i < nums.length - 1; i++) {
    const [left, mid, right] = [nums[i - 1], nums[i], nums[i + 1]];
    if (2 * (left + right) === mid) count++;
  }

  return count;
}

console.log(countSubarrays2([1, 2, 1, 4, 1])); // 1
console.log(countSubarrays2([1, 1, 1])); // 0
console.log(countSubarrays2([2, 4, 2, 8, 4])); // 2
```

### Solution 3: Functional (filter + map)

```typescript
/**
 * Functional style: build index array and filter.
 * Time: O(n) | Space: O(n) for index array
 */
function countSubarrays3(nums: number[]): number {
  return Array.from({ length: nums.length - 2 }, (_, i) => i).filter(
    (i) => 2 * (nums[i] + nums[i + 2]) === nums[i + 1],
  ).length;
}

console.log(countSubarrays3([1, 2, 1, 4, 1])); // 1
console.log(countSubarrays3([2, 4, 2, 8, 4])); // 2
```

---

## 🔗 Related Problems

| Problem                                                                                                                   | Difficulty | Pattern |
| ------------------------------------------------------------------------------------------------------------------------- | ---------- | ------- |
| [Number of Good Pairs](https://leetcode.com/problems/number-of-good-pairs/)                                               | 🟢 Easy    | Array   |
| [Count Equal and Divisible Pairs in an Array](https://leetcode.com/problems/count-equal-and-divisible-pairs-in-an-array/) | 🟢 Easy    | Array   |
| [Find the K-th Character in String Game I](https://leetcode.com/problems/find-the-k-th-character-in-string-game-i/)       | 🟢 Easy    | Array   |
