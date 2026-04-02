---
layout: page
title: "Contiguous Array"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/contiguous-array"
---

# Contiguous Array / Mảng Liên Tiếp Cân Bằng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum + Hash Map
> **Frequency**: 📙 Tier 2 — Gặp ở 5+ companies (Facebook, Amazon, Google)
> **See also**: [Maximum Size Subarray Sum Equals k](https://leetcode.com/problems/maximum-size-subarray-sum-equals-k) | [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang đếm số lần đội nhà thắng (1) và thua (0) trong một mùa giải. Bạn muốn tìm chuỗi trận dài nhất mà số thắng bằng số thua. Thủ thuật: đổi thua (0) thành -1, lúc đó bài toán trở thành "tìm mảng con dài nhất có tổng = 0". Nếu prefix sum tại vị trí i và j bằng nhau, mảng con từ i+1 đến j có tổng 0 → ta tìm thấy chuỗi cân bằng!

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Contiguous Array example:**

```
nums  = [0, 1, 0, 0, 1, 1, 0]
trans = [-1, 1,-1,-1, 1, 1,-1]  (0→-1, 1→1)

index:   -1   0   1   2   3   4   5   6
prefix:   0  -1   0  -1  -2  -1   0  -1

prefixMap: { 0: -1 }
i=0: prefix=-1 → map={0:-1, -1:0}
i=1: prefix=0  → 0 in map at -1 → len=1-(-1)=2 → maxLen=2
i=2: prefix=-1 → -1 in map at 0 → len=2-0=2 → maxLen=2
i=3: prefix=-2 → map={..., -2:3}
i=4: prefix=-1 → -1 in map at 0 → len=4-0=4 → maxLen=4
i=5: prefix=0  → 0 in map at -1 → len=5-(-1)=6 → maxLen=6 ✓
i=6: prefix=-1 → -1 in map at 0 → len=6-0=6 → maxLen=6
```

---

## Problem Description

Given a binary array `nums`, return the maximum length of a contiguous subarray with equal number of `0`s and `1`s.

**Example 1:** `nums = [0,1]` → `2`
**Example 2:** `nums = [0,1,0]` → `2`
**Example 3:** `nums = [0,1,0,0,1,1,0]` → `6`

**Constraints:** `1 ≤ nums.length ≤ 10^5`, `nums[i] ∈ {0, 1}`

---

## 📝 Interview Tips

- **Transform 0 → -1** / Biến đổi: Bài "số 0 bằng số 1" → "tổng mảng con = 0" — classic trick
- **Prefix sum + hashmap** / Prefix sum + bảng băm: Lưu lần đầu tiên gặp mỗi prefix sum → O(n) time
- **Initialize map[0] = -1** / Khởi tạo: Map phải có `{0: -1}` để xử lý trường hợp prefix sum = 0 từ đầu
- **Length formula** / Công thức độ dài: Nếu `prefix[i] == prefix[j]` thì `length = i - j`
- **Don't overwrite** / Không ghi đè: Chỉ lưu lần ĐẦU TIÊN gặp mỗi prefix sum để tối đa hóa độ dài
- **Related pattern** / Pattern liên quan: Giống hệt "Max Size Subarray Sum = k" với k=0

---

## Solutions

```typescript
/**
 * @complexity Time: O(n²) | Space: O(1)
 * Check every subarray, count 0s and 1s
 */
function findMaxLengthBrute(nums: number[]): number {
  let maxLen = 0;
  for (let i = 0; i < nums.length; i++) {
    let zeros = 0,
      ones = 0;
    for (let j = i; j < nums.length; j++) {
      if (nums[j] === 0) zeros++;
      else ones++;
      if (zeros === ones) maxLen = Math.max(maxLen, j - i + 1);
    }
  }
  return maxLen;
}

/**
 * @complexity Time: O(n) | Space: O(n)
 * Transform 0→-1, find longest subarray with sum=0 using prefix sum map
 */
function findMaxLength(nums: number[]): number {
  const firstSeen = new Map<number, number>();
  firstSeen.set(0, -1); // prefix sum 0 before array starts
  let prefix = 0,
    maxLen = 0;

  for (let i = 0; i < nums.length; i++) {
    prefix += nums[i] === 1 ? 1 : -1;
    if (firstSeen.has(prefix)) {
      maxLen = Math.max(maxLen, i - firstSeen.get(prefix)!);
    } else {
      firstSeen.set(prefix, i); // only store first occurrence
    }
  }
  return maxLen;
}

// === Test Cases ===
console.log(findMaxLength([0, 1])); // → 2
console.log(findMaxLength([0, 1, 0])); // → 2
console.log(findMaxLength([0, 1, 0, 0, 1, 1, 0])); // → 6
console.log(findMaxLength([0, 0, 0, 0])); // → 0
console.log(findMaxLength([0, 1, 1, 0, 1, 1, 1, 0])); // → 4
console.log(findMaxLengthBrute([0, 1, 0, 0, 1, 1, 0])); // → 6
```

---

## 🔗 Related Problems

| Problem                            | Difficulty | Link                                                                       |
| ---------------------------------- | ---------- | -------------------------------------------------------------------------- |
| Maximum Size Subarray Sum Equals k | Medium     | [LC 325](https://leetcode.com/problems/maximum-size-subarray-sum-equals-k) |
| Subarray Sum Equals K              | Medium     | [LC 560](https://leetcode.com/problems/subarray-sum-equals-k)              |
| Binary Subarrays With Sum          | Medium     | [LC 930](https://leetcode.com/problems/binary-subarrays-with-sum)          |
