---
layout: page
title: "Longest Arithmetic Subsequence"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Hash Table, Binary Search, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/longest-arithmetic-subsequence"
---

# Longest Arithmetic Subsequence / Dãy Con Cấp Số Cộng Dài Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming + Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Maximum Total Damage With Spell Casting](https://leetcode.com/problems/maximum-total-damage-with-spell-casting) | [Number of Matching Subsequences](https://leetcode.com/problems/number-of-matching-subsequences)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Như chọn học sinh xếp hàng sao cho chiều cao chênh đều nhau — mỗi học sinh chỉ hỏi "tôi có thể đứng sau bạn không?" tức là chiều cao của tôi trừ chiều cao bạn có bằng khoảng cách mà bạn đang theo không? Mỗi vị trí lưu lại độ dài dãy tốt nhất ứng với từng bước nhảy (difference) kết thúc tại đó.

**Pattern Recognition:**

- Signal: longest subsequence with **constant difference** → **DP with HashMap per index**
- Key insight: `dp[i]` is a Map where `dp[i][diff]` = length of longest arithmetic subsequence ending at `i` with common difference `diff`. Transition: `dp[i][diff] = dp[j][diff] + 1` for all `j < i`.

**Visual — nums=[3,6,9,12] example:**

```
i=0 (val=3):  dp[0] = {}                        (no previous)
i=1 (val=6):  diff=6-3=3 → dp[1][3]=dp[0][3]+1=2
i=2 (val=9):  diff=9-3=6 → dp[2][6]=2
              diff=9-6=3 → dp[2][3]=dp[1][3]+1=3
i=3 (val=12): diff=12-3=9 → dp[3][9]=2
              diff=12-6=6 → dp[3][6]=dp[2][6]+1=... wait dp[2][6]=2 → 3
              diff=12-9=3 → dp[3][3]=dp[2][3]+1=4

Answer: max = 4  ✓  (sequence [3,6,9,12] with diff=3)
```

---

## 📝 Problem Description

Given an array `nums`, return the length of the longest arithmetic subsequence. A subsequence keeps relative order; a sequence is arithmetic if consecutive differences are equal.

- **Example 1:** `nums=[3,6,9,12]` → `4` (all, diff=3)
- **Example 2:** `nums=[9,4,7,2,10]` → `3` (`[4,7,10]` with diff=3)
- **Constraints:** `2 ≤ nums.length ≤ 1000`, `0 ≤ nums[i] ≤ 500`

---

## 🎯 Interview Tips

1. **State design** / Thiết kế trạng thái: `dp[i][diff]` = độ dài dãy kết thúc tại i với bước nhảy diff — dùng Map lồng trong mảng
2. **Minimum length** / Độ dài tối thiểu: mọi cặp 2 phần tử đã là dãy cấp số cộng → khởi tạo `dp[i][diff] = 1` (trước khi thêm j)
3. **Time complexity** / Độ phức tạp: O(n²) thời gian, O(n × unique_diffs) không gian; với n=1000 là chấp nhận được
4. **Negative diffs** / Bước âm: diff có thể âm, dùng Map<number, number> không phải mảng
5. **Output** / Đầu ra: track global max trong quá trình, min result = 2 (any 2-element sequence)
6. **Compare LIS** / So sánh LIS: Longest Increasing Subsequence tương tự nhưng chỉ yêu cầu tăng, không yêu cầu đều

---

## 💡 Solutions

### Approach 1: Brute Force O(n³) — Check All Pairs as Starting Points

/\*_ @complexity Time: O(n³) | Space: O(1) _/

```typescript
function longestArithSeqLengthBrute(nums: number[]): number {
  const n = nums.length;
  let res = 2;
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const diff = nums[j] - nums[i];
      let len = 2,
        last = nums[j];
      for (let k = j + 1; k < n; k++) {
        if (nums[k] - last === diff) {
          len++;
          last = nums[k];
        }
      }
      res = Math.max(res, len);
    }
  }
  return res;
}
```

### Approach 2: DP with HashMap per Index — Optimal

/\*_ @complexity Time: O(n²) | Space: O(n × d) where d = distinct differences _/

```typescript
function longestArithSeqLength(nums: number[]): number {
  const n = nums.length;
  // dp[i] maps difference → length of longest AP ending at index i
  const dp: Map<number, number>[] = Array.from({ length: n }, () => new Map());
  let res = 2;

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      const diff = nums[i] - nums[j];
      // dp[j][diff] = length of AP ending at j with this diff (default 1 if not seen)
      const prev = dp[j].get(diff) ?? 1;
      const newLen = prev + 1;
      // Keep the max length for this diff at position i
      dp[i].set(diff, Math.max(dp[i].get(diff) ?? 2, newLen));
      res = Math.max(res, dp[i].get(diff)!);
    }
  }

  return res;
}
```

---

## 🧪 Test Cases

```typescript
console.log(longestArithSeqLength([3, 6, 9, 12])); // → 4 (diff=3)
console.log(longestArithSeqLength([9, 4, 7, 2, 10])); // → 3 ([4,7,10] diff=3)
console.log(longestArithSeqLength([20, 1, 15, 3, 10, 5, 8])); // → 4 ([20,15,10,5] diff=-5)
console.log(longestArithSeqLength([1, 2])); // → 2 (any 2 elements)
console.log(longestArithSeqLength([0, 0, 0, 0])); // → 4 (all same, diff=0)
```

---

## Related Problems

| Problem                                                                                                                                | Difficulty | Pattern            |
| -------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence)                                         | Medium     | DP / Patience Sort |
| [Arithmetic Slices II - Subsequence](https://leetcode.com/problems/arithmetic-slices-ii-subsequence)                                   | Hard       | DP + HashMap       |
| [Longest Arithmetic Subsequence of Given Difference](https://leetcode.com/problems/longest-arithmetic-subsequence-of-given-difference) | Medium     | DP + HashMap       |
