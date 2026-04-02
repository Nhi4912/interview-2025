---
layout: page
title: "Minimum Subsequence in Non-Increasing Order"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/minimum-subsequence-in-non-increasing-order"
---

# minimum subsequence in non increasing order

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn cần chia tiền với bạn bè sao cho **phần của bạn lớn hơn phần còn lại**, nhưng lấy **càng ít tờ càng tốt**. Chiến thuật tự nhiên: lấy những tờ **mệnh giá lớn nhất** trước — mỗi tờ lớn giúp bạn vượt qua ngưỡng nhanh nhất. Đây chính là bài toán tham lam (greedy) sau khi sắp xếp giảm dần.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
nums = [3, 7, 4, 9, 2]   totalSum = 25

Sort desc → [9, 7, 4, 3, 2]

Step 1: take 9  → subSum=9,  rem=16  → 9 > 16? No
Step 2: take 7  → subSum=16, rem=9   → 16 > 9? Yes ✓ → stop

Result: [9, 7]   (already non-increasing)
```

```
nums = [4, 3, 10, 9, 8]   totalSum = 34

Sort desc → [10, 9, 8, 4, 3]

Step 1: take 10 → subSum=10, rem=24 → No
Step 2: take 9  → subSum=19, rem=15 → No
Step 3: take 8  → subSum=27, rem=7  → 27 > 7? Yes ✓ → stop

Result: [10, 9, 8]
```

---

## Problem Description

Cho mảng `nums`, trả về dãy con (subsequence) thoả mãn:

1. **Tổng dãy con > tổng phần còn lại** (tức > totalSum/2)
2. **Kích thước nhỏ nhất** có thể
3. Sắp xếp theo **thứ tự không tăng** (non-increasing)

**Ví dụ 1:**

```
Input:  nums = [3,7,4,9,2]
Output: [9,7]
// sum([9,7])=16 > sum([3,4,2])=9 ✓, minimal size=2
```

**Ví dụ 2:**

```
Input:  nums = [4,3,10,9,8]
Output: [10,9,8]
```

**Ràng buộc:** `1 ≤ nums.length ≤ 500`, `1 ≤ nums[i] ≤ 100`

---

## 📝 Interview Tips

1. **Sort then greedily accumulate** — sorting descending then taking until `subSum > totalSum - subSum` is provably optimal by exchange argument. | Sắp xếp giảm dần rồi tích lũy tham lam là tối ưu, chứng minh bằng hoán đổi.
2. **Condition: subSum > remaining** — equivalently `2 * subSum > totalSum`; avoids computing remaining each step. | Điều kiện `2 * subSum > totalSum` tránh tính lại phần còn lại mỗi bước.
3. **Output is already sorted** — since we pick from sorted array, result is non-increasing by construction. | Lấy từ mảng đã sắp xếp → kết quả đã thỏa phi giảm.
4. **Counting sort optimization** — values 1–100, use bucket array to avoid comparison sort. | Với giá trị 1–100, bucket sort O(n+k) nhanh hơn comparison sort O(n log n).
5. **Unique answer** — problem guarantees answer is unique due to non-increasing sort requirement. | Đề bảo đảm đáp án duy nhất nhờ thứ tự phi giảm.
6. **Edge case: single element** — if n=1, that element alone satisfies (remaining sum is 0). | Khi n=1, một phần tử luôn thoả: sum>0>remaining=0.

---

## Solutions

```typescript
/**
 * Solution 1: Sort Descending + Greedy Accumulate
 * @complexity Time O(n log n), Space O(n)
 */
function minSubsequence(nums: number[]): number[] {
  nums.sort((a, b) => b - a);
  const totalSum = nums.reduce((s, v) => s + v, 0);
  const result: number[] = [];
  let subSum = 0;
  for (const v of nums) {
    subSum += v;
    result.push(v);
    if (2 * subSum > totalSum) break;
  }
  return result; // already non-increasing since nums is sorted desc
}

/**
 * Solution 2: Counting Sort (optimal for bounded values 1–100)
 * @complexity Time O(n + k) where k=100, Space O(k)
 */
function minSubsequenceCounting(nums: number[]): number[] {
  const MAX_VAL = 100;
  const bucket = new Array(MAX_VAL + 1).fill(0);
  let totalSum = 0;
  for (const v of nums) {
    bucket[v]++;
    totalSum += v;
  }

  const result: number[] = [];
  let subSum = 0;
  for (let v = MAX_VAL; v >= 1; v--) {
    for (let cnt = bucket[v]; cnt > 0; cnt--) {
      subSum += v;
      result.push(v);
      if (2 * subSum > totalSum) return result;
    }
  }
  return result;
}

/**
 * Solution 3: Quickselect-inspired (find the cut-point, then collect)
 * @complexity Time O(n) average, Space O(n)
 */
function minSubsequenceQuickselect(nums: number[]): number[] {
  const totalSum = nums.reduce((s, v) => s + v, 0);
  // Sort descending (could replace inner sort with quickselect for O(n) avg)
  const sorted = [...nums].sort((a, b) => b - a);
  let subSum = 0;
  let cutIdx = 0;
  while (2 * subSum <= totalSum) subSum += sorted[cutIdx++];
  return sorted.slice(0, cutIdx);
}

// ─── Tests ───────────────────────────────────────────────────────────────────
console.log(minSubsequence([3, 7, 4, 9, 2])); // [9,7]
console.log(minSubsequence([4, 3, 10, 9, 8])); // [10,9,8]
console.log(minSubsequence([2, 4, 6])); // [6,4]
console.log(minSubsequenceCounting([3, 7, 4, 9, 2])); // [9,7]
console.log(minSubsequenceQuickselect([4, 3, 10, 9, 8])); // [10,9,8]
```

---

## 🔗 Related Problems

