---
layout: page
title: "Minimum Size Subarray in Infinite Array"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Sliding Window, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/minimum-size-subarray-in-infinite-array"
---

# Minimum Size Subarray in Infinite Array / Mảng Con Nhỏ Nhất Trong Mảng Vô Hạn

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window + Math
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum) | [Minimum Operations to Reduce X to Zero](https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng một vòng quay băng chuyền lặp đi lặp lại. Bạn cần "gom" đủ target kg hàng. Nếu mỗi vòng có S kg, bạn bỏ túi `floor(target/S)` vòng đầy, rồi chỉ cần tìm đoạn ngắn nhất trong **một vòng** tiếp theo đủ bù phần còn lại.

**Key Insight:**

- Gọi S = tổng toàn bộ `nums`. Mỗi lần lặp thêm đúng S vào tổng.
- `full = floor(target / S)` — số bản sao hoàn chỉnh bắt buộc phải lấy → đóng góp `full * n` phần tử.
- `rem = target % S` — phần dư cần tìm trong **nums ghép đôi** (2 lần) qua sliding window.
- Vì `rem < S`, cửa sổ đủ điều kiện luôn tồn tại trong `nums + nums`.

**Visual — nums = [2, 3, 1, 2, 4, 3], target = 7:**

```
Infinite: [2, 3, 1, 2, 4, 3 | 2, 3, 1, 2, 4, 3 | ...]
           ←── one copy ───→

S = 15, full = 0, rem = 7
Doubled for sliding window:
  [2, 3, 1, 2, 4, 3, 2, 3, 1, 2, 4, 3]
            l→    ←r
  Window [4, 3] = 7 ≥ 7  → len = 2  ✓  ← minimum!
  Window [3, 1, 2, 4] = 10 ≥ 7 → len = 4 (worse)

Answer = full * n + minLen = 0 * 6 + 2 = 2
```

---

## 📝 Interview Tips

1. **Clarify**: "Mảng vô hạn nghĩa là nums lặp lại mãi — cần xác nhận có số âm không?" / Confirm all nums are positive (needed for sliding window monotonicity).
2. **Brute force**: Tạo mảng lặp ~2× độ dài rồi dùng two-pointer O(n) — nhưng không scale khi target rất lớn.
3. **Math shortcut**: Bỏ `floor(target/S)` bản sao hoàn chỉnh, chỉ cần giải bài tử `rem` trên mảng ghép đôi.
4. **Doubled array trick**: `nums + nums` (2n phần tử) đủ để cover mọi cửa sổ bắt đầu từ bất kỳ index nào trong một bản sao.
5. **Edge case**: `rem === 0` → không cần sliding window, trả ngay `full * n`.
6. **Complexity**: O(n) time, O(n) space cho mảng ghép đôi — hoặc O(1) extra space với modular indexing.

---

## Solutions

```typescript
/**
 * Solution 1: Sliding Window on Doubled Array
 * Time: O(n)  — two pointers traverse doubled array once
 * Space: O(n) — doubled array allocation
 */
function minSizeSubarray(nums: number[], target: number): number {
  const n = nums.length;
  const S = nums.reduce((a, b) => a + b, 0);

  const fullCopies = Math.floor(target / S);
  const rem = target % S;

  // No remainder: exactly fullCopies complete loops
  if (rem === 0) return fullCopies * n;

  // Find minimum window in nums+nums with sum >= rem
  const doubled = [...nums, ...nums];
  let minLen = Infinity;
  let windowSum = 0;
  let left = 0;

  for (let right = 0; right < 2 * n; right++) {
    windowSum += doubled[right];
    // Shrink from left while window still satisfies condition
    while (windowSum >= rem) {
      minLen = Math.min(minLen, right - left + 1);
      windowSum -= doubled[left];
      left++;
    }
  }

  // minLen is always found because rem < S and doubled array covers all cyclic starts
  return fullCopies * n + minLen;
}

/**
 * Solution 2: Sliding Window with Modular Indexing (O(1) extra space)
 * Time: O(n)  — same two-pointer logic, no array allocation
 * Space: O(1)
 */
function minSizeSubarrayO1(nums: number[], target: number): number {
  const n = nums.length;
  const S = nums.reduce((a, b) => a + b, 0);

  const fullCopies = Math.floor(target / S);
  const rem = target % S;

  if (rem === 0) return fullCopies * n;

  let minLen = Infinity;
  let windowSum = 0;
  let left = 0;

  // Iterate 2n steps using modular index instead of building doubled array
  for (let right = 0; right < 2 * n; right++) {
    windowSum += nums[right % n];
    while (windowSum >= rem) {
      minLen = Math.min(minLen, right - left + 1);
      windowSum -= nums[left % n];
      left++;
    }
  }

  return fullCopies * n + minLen;
}

// === Test Cases ===
console.log(minSizeSubarray([2, 3, 1, 2, 4, 3], 7)); // 2  ([4,3])
console.log(minSizeSubarray([1, 2, 3], 5)); // 2  ([2,3])
console.log(minSizeSubarray([1, 1, 1, 1, 1], 5)); // 5  (one full copy)
console.log(minSizeSubarray([1, 1, 1, 1, 1], 10)); // 10 (two full copies)
console.log(minSizeSubarray([2, 3, 1, 2, 4, 3], 15)); // 6  (exactly one full copy, rem=0)
console.log(minSizeSubarray([2, 3, 1, 2, 4, 3], 16)); // 7  (one full copy + [2])

// Verify both solutions agree
console.log(minSizeSubarrayO1([2, 3, 1, 2, 4, 3], 7)); // 2
console.log(minSizeSubarrayO1([1, 2, 3], 5)); // 2
```

---

## 🔗 Related Problems

| Problem                                                                                                        | Pattern        | Difficulty |
| -------------------------------------------------------------------------------------------------------------- | -------------- | ---------- |
| [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum)                           | Sliding Window | 🟡 Medium  |
| [Count Number of Nice Subarrays](https://leetcode.com/problems/count-number-of-nice-subarrays)                 | Sliding Window | 🟡 Medium  |
| [Minimum Operations to Reduce X to Zero](https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero) | Sliding Window | 🟡 Medium  |
| [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k)                                   | Prefix Sum     | 🟡 Medium  |
| [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k)                     | Sliding Window | 🟡 Medium  |
