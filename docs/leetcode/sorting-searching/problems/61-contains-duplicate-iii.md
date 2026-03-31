---
layout: page
title: "Contains Duplicate III"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Sliding Window, Sorting, Bucket Sort, Ordered Set]
leetcode_url: "https://leetcode.com/problems/contains-duplicate-iii"
---

# Contains Duplicate III / Chứa Phần Tử Trùng III

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Sliding Window + Bucket Sort
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Chia các số vào "xô" (bucket) kích thước `valueDiff+1`. Hai số trong cùng xô chắc chắn có hiệu <= valueDiff. Hai số ở xô kề nhau chỉ cần kiểm tra thêm. Mỗi bucket chỉ chứa tối đa 1 số (trong window indexDiff), vì 2 số trong cùng xô đã là đáp án!

**Pattern Recognition:**

- Signal: "index diff ≤ k" + "value diff ≤ t" → **Sliding Window + Bucket Sort**
- Bucket size = valueDiff + 1 → same bucket = guaranteed within valueDiff
- Key insight: chỉ cần check bucket `b`, `b-1`, `b+1` — không cần sorted set

**Visual — Bucket sort with sliding window:**

```
nums=[1,5,9,1,5,9], indexDiff=2, valueDiff=3  (bucketSize=4)

Bucket ranges: [-4..-1]=B-1, [0..3]=B0, [4..7]=B1, [8..11]=B2

i=0: val=1, bucket=0 → B0={1}
i=1: val=5, bucket=1 → B1={5}  (adjacent B0: |5-1|=4 > 3 ✗)
i=2: val=9, bucket=2 → B2={9}  (adjacent B1: |9-5|=4 > 3 ✗)
i=3: val=1, bucket=0 → B0 already has 1! → return TRUE ✅
  (remove nums[0]=1 from B0 if no match before adding... but match found first)
```

---

## Problem Description

Cho mảng `nums`, số nguyên `indexDiff`, và `valueDiff`. Tìm xem có tồn tại `i ≠ j` sao cho `|i-j| ≤ indexDiff` và `|nums[i]-nums[j]| ≤ valueDiff` không. ([LeetCode 220](https://leetcode.com/problems/contains-duplicate-iii))

- Example 1: `nums=[1,2,3,1], indexDiff=3, valueDiff=0` → `true` (i=0,j=3)
- Example 2: `nums=[1,5,9,1,5,9], indexDiff=2, valueDiff=3` → `false`
- Example 3: `nums=[1,2,3,1], indexDiff=1, valueDiff=2` → `true`

Constraints: `2 ≤ nums.length ≤ 2×10⁴`, `−2³¹ ≤ nums[i] ≤ 2³¹ − 1`

---

## 📝 Interview Tips

1. **Clarify**: "indexDiff và valueDiff có thể bằng 0 không?" / Confirm non-negative constraints (valueDiff ≥ 0)
2. **Brute force**: "Với mỗi i, kiểm tra j từ i+1 đến i+indexDiff O(n×k)" / Check all pairs within window
3. **Bucket key insight**: "bucketSize = valueDiff+1 → 2 số cùng bucket có hiệu < bucketSize" / Same bucket guarantees solution
4. **Adjacent buckets**: "Chỉ check 3 bucket: b, b-1, b+1 — không cần duyệt thêm" / Only 3 buckets to check
5. **Window maintenance**: "Sau indexDiff bước, xóa phần tử cũ khỏi bucket để giữ window size" / Delete from bucket when out of window
6. **Negative numbers**: "Cần hàm getBucket đặc biệt cho số âm để bucket liên tục" / Special floor division for negatives

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — check all pairs within indexDiff window
 * Time: O(n × indexDiff) — for each element, scan up to indexDiff neighbors
 * Space: O(1) — no extra space
 */
function containsDuplicateIiiBruteForce(
  nums: number[],
  indexDiff: number,
  valueDiff: number,
): boolean {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j <= Math.min(nums.length - 1, i + indexDiff); j++) {
      if (Math.abs(nums[i] - nums[j]) <= valueDiff) return true;
    }
  }
  return false;
}

/**
 * Solution 2: Sliding Window + Bucket Sort (Optimal)
 * Time: O(n) — single pass, O(1) per element (3 bucket lookups + 1 insert + 1 delete)
 * Space: O(min(n, indexDiff)) — at most indexDiff+1 buckets active at once
 */
function containsDuplicateIii(nums: number[], indexDiff: number, valueDiff: number): boolean {
  const w = valueDiff + 1; // Bucket size: each bucket covers w consecutive values

  // Floor division that works correctly for negative numbers
  // Ensures buckets cover [id*w, (id+1)*w - 1] for all integers
  function getBucket(v: number): number {
    return v >= 0 ? Math.floor(v / w) : Math.floor((v + 1) / w) - 1;
  }

  const buckets = new Map<number, number>(); // bucketId → stored value (at most 1 per bucket)

  for (let i = 0; i < nums.length; i++) {
    const b = getBucket(nums[i]);

    // Same bucket: two values differ by < w = valueDiff + 1 ≤ valueDiff ✓
    if (buckets.has(b)) return true;

    // Adjacent buckets: values may differ by up to 2w-1, need explicit check
    if (buckets.has(b - 1) && Math.abs(buckets.get(b - 1)! - nums[i]) <= valueDiff) return true;
    if (buckets.has(b + 1) && Math.abs(buckets.get(b + 1)! - nums[i]) <= valueDiff) return true;

    buckets.set(b, nums[i]);

    // Evict element leaving the indexDiff window
    if (i >= indexDiff) {
      buckets.delete(getBucket(nums[i - indexDiff]));
    }
  }

  return false;
}

// === Test Cases ===
console.log(containsDuplicateIii([1, 2, 3, 1], 3, 0)); // true
console.log(containsDuplicateIii([1, 5, 9, 1, 5, 9], 2, 3)); // false
console.log(containsDuplicateIii([1, 2, 3, 1], 1, 2)); // true
console.log(containsDuplicateIii([-3, 3], 2, 4)); // false (|-3-3|=6 > 4)
```

---

## 🔗 Related Problems

- [Contains Duplicate II](https://leetcode.com/problems/contains-duplicate-ii) — same but only indexDiff constraint (valueDiff=0)
- [Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit) — value range constraint in window
- [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom) — range overlap counting
- [Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists) — value-range sliding window
- [Contains Duplicate III — LeetCode](https://leetcode.com/problems/contains-duplicate-iii) — problem page
