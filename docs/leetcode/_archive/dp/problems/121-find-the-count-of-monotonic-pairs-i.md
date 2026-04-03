---
layout: page
title: "Find the Count of Monotonic Pairs I"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Math, Dynamic Programming, Combinatorics, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/find-the-count-of-monotonic-pairs-i"
---

# Find the Count of Monotonic Pairs I / Đếm Số Cặp Đơn Điệu

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: DP + Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Find the Count of Monotonic Pairs II](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-ii) | [Number of Sub-arrays With Odd Sum](https://leetcode.com/problems/number-of-sub-arrays-with-odd-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như đếm cách chia tiền — mỗi vị trí `i` chia `nums[i]` thành `arr1[i] + arr2[i]`, nhưng phần `arr1` phải tăng không giảm và `arr2` phải giảm không tăng. DP theo từng vị trí, Prefix Sum để cộng nhanh.

**Pattern Recognition:**

- State: `dp[i][v]` = số cặp hợp lệ đến index `i` với `arr1[i] = v`
- Transition: `dp[i][v] = sum(dp[i-1][v'])` với `v' ≤ v` và `arr2[i-1] ≥ arr2[i]`
  - arr2 constraint: `(nums[i-1]-v') ≥ (nums[i]-v)` → `v' ≤ v + nums[i-1] - nums[i]`
- Combined: `v' ≤ min(v, v + nums[i-1]-nums[i])` = `v - max(0, diff)` where `diff = nums[i]-nums[i-1]`

```
nums = [2, 3, 2]

i=0: dp[0..2] = [1, 1, 1]       (v∈[0,nums[0]])
i=1, diff=1: dp[v] = prefix[v-1] (v' ≤ v-1 since diff=1>0)
  v=0: maxPrev=-1 → 0; v=1: prefix[0]=1; v=2: prefix[1]=2; v=3: prefix[2]=3
i=2, diff=-1: dp[v] = prefix[v]  (v' ≤ v since diff≤0)
  v=0: prefix[0]=0; v=1: prefix[1]=1; v=2: prefix[2]=3
Answer = 0+1+3 = 4  (mod 1e9+7)
```

---

## Problem Description / Mô Tả Bài Toán

Cho mảng `nums`. Đếm cặp (arr1, arr2) thỏa mãn:

- `arr1[i] + arr2[i] = nums[i]` với mọi `i`, `0 ≤ arr1[i] ≤ nums[i]`
- `arr1` không giảm (non-decreasing)
- `arr2` không tăng (non-increasing)

Kết quả modulo 10⁹+7.

**Example 1:** `nums=[2,3,2]` → `4`
**Example 2:** `nums=[5,5,5,5]` → `126`

**Constraints:** `1 ≤ nums.length ≤ 2000`, `1 ≤ nums[i] ≤ 50`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Key reduction: arr2[i] = nums[i]-arr1[i], so only tracking arr1[i] is enough.
   **VI:** Nhận xét: arr2[i] = nums[i]-arr1[i], chỉ cần theo dõi arr1[i].

2. **EN:** Constraint combined: v' ≤ v - max(0, nums[i] - nums[i-1]). Derive this algebraically.
   **VI:** Ràng buộc gộp: v' ≤ v - max(0, diff). Chứng minh bằng đại số.

3. **EN:** Use prefix sum on dp[i-1] to compute dp[i][v] = prefix[min(maxPrev, nums[i-1])+1] in O(1).
   **VI:** Dùng prefix sum trên dp[i-1] để tính dp[i][v] trong O(1).

4. **EN:** Total complexity: O(n × max(nums)) — n ≤ 2000, max(nums) ≤ 50 → 10⁵ operations.
   **VI:** Tổng O(n × max(nums)) = O(100000) — rất nhanh.

5. **EN:** Brute force enumerates all arr1 arrays in O(Π(nums[i]+1)) — exponential, not feasible.
   **VI:** Brute force duyệt tất cả arr1 theo O(Π(nums[i]+1)) — hàm mũ, không khả thi.

6. **EN:** For single element: answer = nums[0] + 1 (choose v from 0 to nums[0]).
   **VI:** Một phần tử: đáp án = nums[0] + 1 (chọn v từ 0 đến nums[0]).

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: Brute Force (small inputs only) — O(Π(nums[i]+1)) ───────────
function countOfPairs_brute(nums: number[]): number {
  const MOD = 1_000_000_007;
  const n = nums.length;
  let count = 0;

  function backtrack(idx: number, arr1: number[], arr2: number[]): void {
    if (idx === n) {
      count = (count + 1) % MOD;
      return;
    }
    const maxV = nums[idx];
    for (let v = 0; v <= maxV; v++) {
      // Check constraints against previous
      if (idx > 0 && (v < arr1[idx - 1] || nums[idx] - v > arr2[idx - 1])) continue;
      arr1.push(v);
      arr2.push(nums[idx] - v);
      backtrack(idx + 1, arr1, arr2);
      arr1.pop();
      arr2.pop();
    }
  }

  backtrack(0, [], []);
  return count;
}

// ─── Solution 2: DP + Prefix Sum — O(n × max(nums)) ─────────────────────────
// dp[v] = number of valid pairs up to current index where arr1[current] = v
// Use prefix sum to efficiently compute sum of dp[0..maxPrev]
function countOfPairs(nums: number[]): number {
  const MOD = 1_000_000_007;
  const n = nums.length;
  const MAX_VAL = 50;

  // Initialize dp for index 0: dp[v]=1 for v in [0, nums[0]]
  let dp = new Array(MAX_VAL + 1).fill(0);
  for (let v = 0; v <= nums[0]; v++) dp[v] = 1;

  for (let i = 1; i < n; i++) {
    // Build prefix sum of previous dp
    const prefix = new Array(MAX_VAL + 2).fill(0);
    for (let v = 0; v <= MAX_VAL; v++) {
      prefix[v + 1] = (prefix[v] + dp[v]) % MOD;
    }

    const ndp = new Array(MAX_VAL + 1).fill(0);
    const diff = nums[i] - nums[i - 1];

    for (let v = 0; v <= nums[i]; v++) {
      // maxPrev = v - max(0, diff) derived from:
      //   arr1 non-decreasing: v' ≤ v
      //   arr2 non-increasing: (nums[i-1]-v') ≥ (nums[i]-v) → v' ≤ v - diff
      const maxPrev = v - Math.max(0, diff);
      if (maxPrev < 0) continue;
      const clampedMax = Math.min(maxPrev, nums[i - 1]);
      ndp[v] = prefix[clampedMax + 1]; // prefix sum up to and including clampedMax
    }

    dp = ndp;
  }

  let ans = 0;
  for (let v = 0; v <= nums[n - 1]; v++) {
    ans = (ans + dp[v]) % MOD;
  }
  return ans;
}

// ─── Tests ────────────────────────────────────────────────────────────────────
console.log(countOfPairs([2, 3, 2])); // 4
console.log(countOfPairs([5, 5, 5, 5])); // 126
console.log(countOfPairs([1])); // 2
console.log(countOfPairs([1, 2])); // 2 (v0∈[0,1], v1∈[v0,2] with arr2 non-increasing)
console.log(countOfPairs_brute([2, 3, 2])); // 4
console.log(countOfPairs_brute([5, 5, 5, 5])); // 126
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                                              | Difficulty | Pattern              |
| ---- | -------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------- |
| 3251 | [Find the Count of Monotonic Pairs II](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-ii)           | 🔴 Hard    | DP + Prefix Sum      |
| 562  | [Longest Line of Consecutive One in Matrix](https://leetcode.com/problems/longest-line-of-consecutive-one-in-matrix) | 🟡 Medium  | DP                   |
| 975  | [Odd Even Jump](https://leetcode.com/problems/odd-even-jump)                                                         | 🔴 Hard    | DP + Monotonic Stack |
