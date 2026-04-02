---
layout: page
title: "Maximum Size Subarray Sum Equals k"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/maximum-size-subarray-sum-equals-k"
---

# Maximum Size Subarray Sum Equals k / Mảng Con Dài Nhất Có Tổng Bằng k

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum + Hash Map
> **Frequency**: 📙 Tier 2 — Gặp ở 5+ companies (Facebook, LinkedIn, Amazon)
> **See also**: [Contiguous Array](https://leetcode.com/problems/contiguous-array) | [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k)

---

## Vietnamese Analogy (Ví dụ thực tế)

Hãy tưởng tượng bạn đang đi bộ trên đường thẳng, mỗi bước đi tăng hoặc giảm độ cao. Bạn muốn tìm đoạn đường dài nhất mà tổng thay đổi độ cao bằng đúng k mét. Thủ thuật: ghi lại tổng tích lũy (prefix sum) tại mỗi vị trí. Nếu tại vị trí j có prefix[j] = p, và trước đó tại vị trí i có prefix[i] = p - k, thì đoạn từ i+1 đến j có tổng đúng bằng k — và ta muốn i càng nhỏ càng tốt để đoạn dài nhất!

## Visual (Minh họa trực quan)

```
nums = [1, -1, 5, -2, 3], k = 3

index:   -1   0   1   2   3   4
prefix:   0   1   0   5   3   6

prefixMap: {0: -1}
i=0: prefix=1  → need 1-3=-2, not in map → map={0:-1, 1:0}
i=1: prefix=0  → need 0-3=-3, not in map → map={0:-1, 1:0}  (0 already in map)
i=2: prefix=5  → need 5-3=2,  not in map → map={..., 5:2}
i=3: prefix=3  → need 3-3=0,  0 in map at -1! → len=3-(-1)=4 ← maxLen=4
i=4: prefix=6  → need 6-3=3,  3 in map at 3! → len=4-3=1

Answer = 4 ✓ (subarray [1,-1,5,-2] = 3)
```

## Problem (Bài toán)

Given an integer array `nums` and an integer `k`, return the **maximum length** of a subarray that sums to `k`. Return `0` if no such subarray exists.

**Example 1:** `nums = [1,-1,5,-2,3]`, `k = 3` → `4`
**Example 2:** `nums = [-2,-1,2,1]`, `k = 1` → `2`

**Constraints:** `1 ≤ nums.length ≤ 2×10^5`, `-10^4 ≤ nums[i] ≤ 10^4`, `-10^9 ≤ k ≤ 10^9`

## Tips (Mẹo phỏng vấn)

- **Prefix sum trick** / Trick tổng tiền tố: `sum(i..j) = prefix[j] - prefix[i-1]` → tìm prefix[i-1] = prefix[j] - k
- **Store first occurrence** / Lưu lần đầu: Chỉ lưu index đầu tiên gặp mỗi prefix sum → tối đa hóa độ dài
- **Initialize map[0] = -1** / Khởi tạo: Để xử lý khi prefix sum bằng k từ đầu mảng
- **Don't overwrite** / Không ghi đè: Nếu prefix đã có trong map → bỏ qua (giữ index nhỏ hơn)
- **Negative numbers OK** / Số âm: Khác với sliding window (chỉ dùng cho số dương), prefix sum xử lý cả âm
- **Compare to #560** / So với bài 560: Bài 560 đếm số lượng, bài này tìm độ dài lớn nhất

## Solution 1 - Brute Force (O(n²))

```typescript
/**
 * @complexity Time: O(n²) | Space: O(1)
 * Check every subarray, find max length with sum=k
 */
function maxSubArrayLenBrute(nums: number[], k: number): number {
  const n = nums.length;
  let maxLen = 0;
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = i; j < n; j++) {
      sum += nums[j];
      if (sum === k) maxLen = Math.max(maxLen, j - i + 1);
    }
  }
  return maxLen;
}
```

## Solution 2 - Prefix Sum + Hash Map (Optimal O(n))

```typescript
/**
 * @complexity Time: O(n) | Space: O(n)
 * prefix[j] - prefix[i] = k → find earliest i where prefix[i] = prefix[j] - k
 */
function maxSubArrayLen(nums: number[], k: number): number {
  const firstSeen = new Map<number, number>();
  firstSeen.set(0, -1); // prefix sum 0 at index -1 (before array)
  let prefix = 0,
    maxLen = 0;

  for (let i = 0; i < nums.length; i++) {
    prefix += nums[i];
    const need = prefix - k;
    if (firstSeen.has(need)) {
      maxLen = Math.max(maxLen, i - firstSeen.get(need)!);
    }
    if (!firstSeen.has(prefix)) {
      firstSeen.set(prefix, i); // only store FIRST occurrence
    }
  }
  return maxLen;
}
```

## Test Cases

```typescript
console.log(maxSubArrayLen([1, -1, 5, -2, 3], 3)); // → 4
console.log(maxSubArrayLen([-2, -1, 2, 1], 1)); // → 2
console.log(maxSubArrayLen([1, 0, 0], 0)); // → 2 (subarray [0,0])
console.log(maxSubArrayLen([1], 1)); // → 1
console.log(maxSubArrayLen([1, 2, 3], 10)); // → 0
console.log(maxSubArrayLenBrute([1, -1, 5, -2, 3], 3)); // → 4
```

## Related Problems

| Problem                   | Difficulty | Link                                                              |
| ------------------------- | ---------- | ----------------------------------------------------------------- |
| Subarray Sum Equals K     | Medium     | [LC 560](https://leetcode.com/problems/subarray-sum-equals-k)     |
| Contiguous Array          | Medium     | [LC 525](https://leetcode.com/problems/contiguous-array)          |
| Minimum Size Subarray Sum | Medium     | [LC 209](https://leetcode.com/problems/minimum-size-subarray-sum) |
