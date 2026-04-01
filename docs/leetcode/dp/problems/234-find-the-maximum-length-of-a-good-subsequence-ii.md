---
layout: page
title: "Find the Maximum Length of a Good Subsequence II"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Hash Table, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/find-the-maximum-length-of-a-good-subsequence-ii"
---

# Find the Maximum Length of a Good Subsequence II / Tìm Độ Dài Lớn Nhất Của Dãy Con Tốt II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming + HashMap Optimization
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Longest String Chain](https://leetcode.com/problems/longest-string-chain) | [Word Break II](https://leetcode.com/problems/word-break-ii)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Giống như Part I nhưng k có thể lên đến n-1 (hàng nghìn), không thể làm brute force O(n²k) nữa. Tưởng tượng bạn có một "bảng thành tích" cho mỗi giá trị và mỗi mức chuyển tiếp — khi thêm một phần tử mới, bạn chỉ cần tra bảng tốt nhất cho "cùng giá trị" và "giá trị khác" thay vì quét lại toàn bộ.

**Pattern Recognition:**

- Signal: same as Part I but k ≤ n-1 (up to 5000) → **O(nk) DP with per-value & global tracking**
- Key insight: For "same value" transitions, maintain `bestSameVal[v][j]` = max dp ending at value `v` with `j` transitions. For "different value" transitions, maintain top-2 global maxima per `j` to avoid same-value contamination.

**Visual — Optimization over Part I:**

```
Part I (k≤25):  O(n²k) = 500²×25 = 6M   ✓ OK
Part II (k≤n):  O(n²k) = 5000²×5000 = 125B  ✗ TLE!

Optimization: For each (i, j), precompute:
  sameVal[j]  = best dp[p][j]  where nums[p] == nums[i]  → O(1) lookup
  diffVal1[j] = best dp[p][j-1] where nums[p] != nums[i] → top-2 approach

Total: O(n×k) transitions each O(1) = O(nk) overall
```

---

## 📝 Problem Description

A "good subsequence" has at most `k` transitions (adjacent elements that differ). Find max length. Same as Part I but `k` can be up to `n-1`.

- **Example 1:** `nums=[1,2,1,1,3], k=2` → `4` (same as Part I)
- **Example 2:** `nums=[1,2,3,1,2,3], k=2` → `5`
- **Constraints:** `1 ≤ n ≤ 5000`, `1 ≤ nums[i] ≤ 10^9`, `0 ≤ k ≤ n-1`

---

## 🎯 Interview Tips

1. **Why Part II is harder** / Tại sao khó hơn: k ≤ n-1 ≈ 5000, O(n²k) = O(n³) → TLE với n=5000
2. **Key optimization** / Tối ưu hóa chính: với mỗi j, duy trì max dp[\*][j] theo từng giá trị (HashMap) và top-2 global max
3. **Top-2 trick** / Mẹo top-2: cần 2 giá trị best khác nhau vì khi tra "khác giá trị", best đơn lẻ có thể cùng giá trị với i
4. **Memory** / Bộ nhớ: O(nk) có thể lớn với n=k=5000 → cần optimize xuống O(nk) với Map
5. **Coordinate compress** / Nén tọa độ: nums[i] lên đến 10^9, cần dùng Map thay vì array
6. **Build incrementally** / Xây dần: cập nhật bảng lookup sau khi tính dp[i][*] để tránh dùng nums[i] làm predecessor của chính nó

---

## 💡 Solutions

### Approach 1: O(n²k) DP — Correct but TLE for large k

/\*_ @complexity Time: O(n²k) | Space: O(nk) _/

```typescript
function maximumLengthIISlow(nums: number[], k: number): number {
  const n = nums.length;
  const dp: number[][] = Array.from({ length: n }, () => new Array(k + 1).fill(1));
  let res = 1;
  for (let i = 1; i < n; i++) {
    for (let p = 0; p < i; p++) {
      for (let j = 0; j <= k; j++) {
        if (nums[p] === nums[i]) {
          dp[i][j] = Math.max(dp[i][j], dp[p][j] + 1);
        } else if (j > 0) {
          dp[i][j] = Math.max(dp[i][j], dp[p][j - 1] + 1);
        }
      }
    }
    for (let j = 0; j <= k; j++) res = Math.max(res, dp[i][j]);
  }
  return res;
}
```

### Approach 2: O(nk) with HashMap + Top-2 Tracking — Optimal

/\*_ @complexity Time: O(nk) | Space: O(nk) _/

```typescript
function maximumLengthII(nums: number[], k: number): number {
  const n = nums.length;
  const dp: number[][] = Array.from({ length: n }, () => new Array(k + 1).fill(1));

  // bestByVal[v][j] = max dp value among all indices with nums[*] == v, for transition count j
  const bestByVal = new Map<number, number[]>();
  // top2[j] = [{ val, best }, { val, best }] — top 2 dp values across all indices for count j
  // (two entries so we can pick "best from different value")
  const top2: Array<[{ v: number; best: number }, { v: number; best: number }]> = Array.from(
    { length: k + 1 },
    () => [
      { v: -1, best: 0 },
      { v: -1, best: 0 },
    ],
  );

  let res = 1;

  for (let i = 0; i < n; i++) {
    const v = nums[i];
    if (!bestByVal.has(v)) bestByVal.set(v, new Array(k + 1).fill(0));

    for (let j = 0; j <= k; j++) {
      // Same-value transition: extend from bestByVal[v][j]
      dp[i][j] = Math.max(dp[i][j], (bestByVal.get(v)![j] ?? 0) + 1);
      // Different-value transition: extend from best among other values (j-1 transitions)
      if (j > 0) {
        const [first, second] = top2[j - 1];
        const globalBest = first.v !== v ? first.best : second.best;
        if (globalBest > 0) dp[i][j] = Math.max(dp[i][j], globalBest + 1);
      }
      res = Math.max(res, dp[i][j]);
    }

    // Update bestByVal and top2 AFTER computing dp[i][*]
    for (let j = 0; j <= k; j++) {
      bestByVal.get(v)![j] = Math.max(bestByVal.get(v)![j], dp[i][j]);
      const [first, second] = top2[j];
      if (dp[i][j] >= first.best) {
        top2[j] = [{ v, best: dp[i][j] }, first.v !== v ? first : second];
      } else if (v !== first.v && dp[i][j] > second.best) {
        top2[j][1] = { v, best: dp[i][j] };
      }
    }
  }
  return res;
}
```

---

## 🧪 Test Cases

```typescript
console.log(maximumLengthII([1, 2, 1, 1, 3], 2)); // → 4
console.log(maximumLengthII([1, 2, 3, 1, 2, 3], 2)); // → 5
console.log(maximumLengthII([1, 1, 1, 1], 0)); // → 4 (all same)
console.log(maximumLengthII([1, 2, 3], 2)); // → 3 (all different, 2 transitions)
console.log(maximumLengthII([1, 2, 1, 2, 1], 1)); // → 4
```

---

## Related Problems

| Problem                                                                                                                          | Difficulty | Pattern            |
| -------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Find the Maximum Length of a Good Subsequence I](https://leetcode.com/problems/find-the-maximum-length-of-a-good-subsequence-i) | Medium     | DP O(n²k)          |
| [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence)                                   | Medium     | DP + Binary Search |
| [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence)                                           | Medium     | 2D DP              |
