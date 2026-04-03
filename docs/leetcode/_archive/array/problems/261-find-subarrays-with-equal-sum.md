---
layout: page
title: "Find Subarrays With Equal Sum"
difficulty: Easy
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/find-subarrays-with-equal-sum"
---

# Find Subarrays With Equal Sum / Tìm Hai Mảng Con Có Tổng Bằng Nhau

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Table / Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Two Sum](https://leetcode.com/problems/two-sum) | [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn đang kiểm tra biên lai mua hàng. Mỗi "hóa đơn" là tổng của 2 mặt hàng liên tiếp. Nếu hai hóa đơn ở hai vị trí khác nhau có cùng tổng tiền, bạn tìm thấy "trùng hợp đáng ngờ". Thay vì so sánh từng cặp hóa đơn (O(n²)), ta chỉ cần lưu tất cả tổng đã thấy vào một tập hợp — nếu tổng mới đã có trong tập → ngay lập tức trả về `true`.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Find Subarrays With Equal Sum example:**

```
nums = [4, 2, 4, 5, 2, 4]
        ^--^                 sum(0..1) = 4+2 = 6  → seen={6}
           ^--^              sum(1..2) = 2+4 = 6  → 6 in seen! → true ✓

Tại sao không cần kiểm tra xa hơn:
  Non-overlapping requirement: pairs can share AT MOST one element
  BUT same-sum subarrays of length 2 at different starts are always non-overlapping
  if start1 < start1+1 < start2 < start2+1 (consecutive, non-overlapping)
  Actually: i and i+1 can overlap with i+1 and i+2 at position i+1
  Problem just asks for two subarrays of length 2 with equal sum (can be adjacent)
```

---

## Problem Description

Given a 0-indexed integer array `nums`, determine if there exist **two subarrays of length 2** with equal sum. The subarrays must begin at different indices.

**Example 1:** `nums = [4,2,4,5,2,4]` → `true` (subarrays `[4,2]` and `[2,4]` both sum to 6)
**Example 2:** `nums = [1,2,3,4,5]` → `false`
**Example 3:** `nums = [0,0,0]` → `true`

**Constraints:** `2 ≤ nums.length ≤ 1000`, `-10^9 ≤ nums[i] ≤ 10^9`

---

## 📝 Interview Tips

- **Set for O(1) lookup** / Set cho O(1): Lưu tổng đã thấy → kiểm tra O(1) mỗi bước thay vì so sánh O(n)
- **Subarrays of length 2** / Mảng con dài 2: Chỉ cần `nums[i] + nums[i+1]` — không cần sliding window phức tạp
- **Overlap OK** / Chồng lấp không sao: Đề chỉ yêu cầu bắt đầu khác index — `[0..1]` và `[1..2]` hợp lệ
- **Early return** / Trả sớm: Ngay khi tìm thấy trùng → trả `true` ngay, không duyệt hết
- **Brute O(n²)** / Brute force: So sánh mọi cặp `(i,j)` thỏa `i ≠ j` — dễ code nhưng chậm hơn
- **Edge case** / Trường hợp đặc biệt: `[0,0,0]` → cả 3 tổng đều = 0 → true ngay ở bước 2

---

## Solutions

```typescript
/**
 * @complexity Time: O(n²) | Space: O(1)
 * Compare every pair of length-2 subarrays
 */
function findSubarraysWithEqualSumBrute(nums: number[]): boolean {
  const n = nums.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n - 1; j++) {
      if (nums[i] + nums[i + 1] === nums[j] + nums[j + 1]) return true;
    }
  }
  return false;
}

/**
 * @complexity Time: O(n) | Space: O(n)
 * Store each pair sum in a set; return true if duplicate found
 */
function findSubarraysWithEqualSum(nums: number[]): boolean {
  const seen = new Set<number>();
  for (let i = 0; i < nums.length - 1; i++) {
    const sum = nums[i] + nums[i + 1];
    if (seen.has(sum)) return true;
    seen.add(sum);
  }
  return false;
}

/**
 * @complexity Time: O(n) | Space: O(n)
 * Map sum → first index; also returns which indices were equal
 */
function findSubarraysWithEqualSumDetailed(nums: number[]): [number, number] | null {
  const firstSeen = new Map<number, number>();
  for (let i = 0; i < nums.length - 1; i++) {
    const sum = nums[i] + nums[i + 1];
    if (firstSeen.has(sum)) return [firstSeen.get(sum)!, i];
    firstSeen.set(sum, i);
  }
  return null;
}

// === Test Cases ===
console.log(findSubarraysWithEqualSum([4, 2, 4, 5, 2, 4])); // → true
console.log(findSubarraysWithEqualSum([1, 2, 3, 4, 5])); // → false
console.log(findSubarraysWithEqualSum([0, 0, 0])); // → true
console.log(findSubarraysWithEqualSum([1, 1])); // → false (only one pair)
console.log(findSubarraysWithEqualSumBrute([4, 2, 4, 5, 2, 4])); // → true
```

---

## 🔗 Related Problems

| Problem                                  | Difficulty | Link                                                                             |
| ---------------------------------------- | ---------- | -------------------------------------------------------------------------------- |
| Two Sum                                  | Easy       | [LC 1](https://leetcode.com/problems/two-sum)                                    |
| Subarray Sum Equals K                    | Medium     | [LC 560](https://leetcode.com/problems/subarray-sum-equals-k)                    |
| Number of Subarrays with Bounded Maximum | Medium     | [LC 795](https://leetcode.com/problems/number-of-subarrays-with-bounded-maximum) |
