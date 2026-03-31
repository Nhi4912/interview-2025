---
layout: page
title: "Maximum Erasure Value"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Sliding Window]
leetcode_url: "https://leetcode.com/problems/maximum-erasure-value"
---

# Maximum Erasure Value / Giá Trị Xóa Tối Đa

🟡 Medium | Tags: Array, Hash Table, Sliding Window

---

## 🧠 Intuition / Trực Giác

**VN:** Cửa sổ trượt – giữ cửa sổ không có phần tử trùng. Khi gặp phần tử đã tồn tại, thu hẹp cửa sổ từ trái cho đến khi không còn trùng nữa. Lưu tổng lớn nhất tìm được.

```
nums:  [4,  2,  4,  5,  6]
        L               R
step1: {4}  sum=4
step2: {4,2} sum=6
step3: gặp 4 → xóa trái → {2,4} sum=6
step4: {2,4,5} sum=11
step5: {2,4,5,6} sum=17  ← max
```

---

## 📝 Interview Tips

- 🇻🇳 Dùng HashSet để kiểm tra trùng lặp O(1) khi mở rộng cửa sổ.
- 🇺🇸 HashSet gives O(1) duplicate detection as we expand the window.
- 🇻🇳 Duy trì biến `sum` để tránh tính tổng lại từ đầu — không cần prefix sum.
- 🇺🇸 Maintain a running `sum` so we avoid recomputing on each step.
- 🇻🇳 Mỗi phần tử vào/ra cửa sổ đúng một lần nên tổng độ phức tạp O(n).
- 🇺🇸 Amortized O(n) — each element enters and exits the window at most once.

---

## 💡 Solutions

### Solution 1: Sliding Window + HashSet

```typescript
/**
 * Find max sum subarray with all unique elements.
 * Time: O(n) | Space: O(n)
 */
function maximumUniqueSubarray(nums: number[]): number {
  const seen = new Set<number>();
  let left = 0,
    sum = 0,
    maxSum = 0;

  for (let right = 0; right < nums.length; right++) {
    while (seen.has(nums[right])) {
      seen.delete(nums[left]);
      sum -= nums[left];
      left++;
    }
    seen.add(nums[right]);
    sum += nums[right];
    maxSum = Math.max(maxSum, sum);
  }

  return maxSum;
}

console.log(maximumUniqueSubarray([4, 2, 4, 5, 6])); // 17
console.log(maximumUniqueSubarray([5, 2, 1, 2, 5, 2, 1, 2, 5])); // 8
console.log(maximumUniqueSubarray([1])); // 1
```

### Solution 2: Sliding Window with Last-Index Map (Skip Ahead)

```typescript
/**
 * Track last occurrence index to jump left directly instead of stepping.
 * Time: O(n) | Space: O(n)
 */
function maximumUniqueSubarray2(nums: number[]): number {
  const lastIdx = new Map<number, number>();
  let left = 0,
    sum = 0,
    maxSum = 0;

  for (let right = 0; right < nums.length; right++) {
    const prev = lastIdx.get(nums[right]);
    if (prev !== undefined && prev >= left) {
      // Shrink window: subtract all elements from left up to prev
      for (let k = left; k <= prev; k++) sum -= nums[k];
      left = prev + 1;
    }
    lastIdx.set(nums[right], right);
    sum += nums[right];
    maxSum = Math.max(maxSum, sum);
  }

  return maxSum;
}

console.log(maximumUniqueSubarray2([4, 2, 4, 5, 6])); // 17
console.log(maximumUniqueSubarray2([5, 2, 1, 2, 5, 2, 1, 2, 5])); // 8
```

### Solution 3: Sliding Window with Frequency Array (bounded values)

```typescript
/**
 * Use fixed-size array instead of Set when values are bounded (1..10^4).
 * Time: O(n) | Space: O(U) where U = unique value range
 */
function maximumUniqueSubarray3(nums: number[]): number {
  const freq = new Uint16Array(100001);
  let left = 0,
    sum = 0,
    maxSum = 0;

  for (let right = 0; right < nums.length; right++) {
    while (freq[nums[right]] > 0) {
      freq[nums[left]]--;
      sum -= nums[left];
      left++;
    }
    freq[nums[right]]++;
    sum += nums[right];
    maxSum = Math.max(maxSum, sum);
  }

  return maxSum;
}

console.log(maximumUniqueSubarray3([4, 2, 4, 5, 6])); // 17
```

---

## 🔗 Related Problems

| Problem                                                                                                                           | Difficulty | Pattern        |
| --------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)   | 🟡 Medium  | Sliding Window |
| [Maximum Sum of Distinct Subarrays With Length K](https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/) | 🟡 Medium  | Sliding Window |
| [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k/)                                       | 🟡 Medium  | Sliding Window |
