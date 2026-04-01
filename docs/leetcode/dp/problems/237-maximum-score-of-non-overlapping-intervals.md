---
layout: page
title: "Maximum Score of Non-overlapping Intervals"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Binary Search, Dynamic Programming, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-score-of-non-overlapping-intervals"
---

# Maximum Score of Non-overlapping Intervals / Điểm Tối Đa Khoảng Không Chồng

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: DP + Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling) | [Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Như đăng ký 4 môn học không trùng lịch mà tổng GPA cao nhất — sắp theo giờ kết thúc, dùng DP chọn k môn tốt nhất không xung đột. Binary search tìm môn cuối cùng kết thúc trước khi môn mới bắt đầu.

**Pattern Recognition:**

- Signal: select exactly k non-overlapping intervals maximizing weight sum → **Sort + DP + Binary Search**
- Key insight: Sort by end. `dp[q][i]` = max weight choosing `q` intervals from first `i`. Binary search for last non-overlapping predecessor.

**Visual — intervals=[[1,3,2],[4,6,5],[2,5,3],[7,10,4]], k=2:**

```
Sorted by end: [1,3,2] [2,5,3] [4,6,5] [7,10,4]
                 i=1     i=2     i=3      i=4

dp[1][1]=2, dp[1][2]=3, dp[1][3]=5, dp[1][3]=5 (skip [2,5,3] since 5>5)
dp[2][3]: last end < 4 → i=1(end=3); dp[1][1]+w=2+5=7
dp[2][4]: last end < 7 → i=3(end=6); dp[1][3]+w=5+4=9

Answer: dp[2][4] = 9  ([4,6,5] + [7,10,4]) ✓
```

---

## 📝 Problem Description

Given `intervals[i] = [l, r, weight]`, select exactly `k=4` non-overlapping intervals (`r_i < l_j`). Return the maximum total weight.

- **Example 1:** `intervals=[[1,3,2],[4,6,5],[2,5,3],[7,10,4]], k=2` → `9`
- **Example 2:** `intervals=[[1,2,4],[3,4,3],[2,3,1],[5,6,2]], k=2` → `7`
- **Constraints:** `1 ≤ n ≤ 5×10^4`, `k = 4`

---

## 🎯 Interview Tips

1. **Sort by end** / Sắp theo end: chuẩn cho bài toán chọn khoảng không chồng
2. **Binary search** / Tìm nhị phân: tìm max index j sao cho `ends[j] < starts[i]` trong O(log n)
3. **k=4 fixed** / k=4 cố định: dp chỉ cần 5 hàng (0..4), tổng O(kn log n)
4. **Overlap check** / Kiểm tra chồng: hai khoảng chồng khi ends[j] >= starts[i]
5. **Reconstruct** / Khôi phục: dùng parent array nếu cần biết khoảng nào được chọn
6. **Edge case** / Biên: nếu không đủ k khoảng không chồng, trả về tổng tốt nhất có thể

---

## 💡 Solutions

### Approach 1: O(kn²) DP — No Binary Search

/\*_ @complexity Time: O(kn²) | Space: O(kn) _/

```typescript
function maximumWeightSlow(intervals: number[][], k: number): number {
  intervals.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  const n = intervals.length;
  const dp = Array.from({ length: k + 1 }, () => new Array(n).fill(0));
  for (let q = 1; q <= k; q++) {
    for (let i = 0; i < n; i++) {
      dp[q][i] = i > 0 ? dp[q][i - 1] : 0;
      for (let j = i - 1; j >= 0; j--) {
        if (intervals[j][1] < intervals[i][0]) {
          dp[q][i] = Math.max(dp[q][i], dp[q - 1][j] + intervals[i][2]);
          break;
        }
      }
      if (q === 1) dp[q][i] = Math.max(dp[q][i], intervals[i][2]);
    }
  }
  return dp[k][n - 1];
}
```

### Approach 2: O(kn log n) DP + Binary Search — Optimal

/\*_ @complexity Time: O(kn log n) | Space: O(kn) _/

```typescript
function maximumWeight(intervals: number[][], k = 4): number {
  intervals.sort((a, b) => (a[1] !== b[1] ? a[1] - b[1] : a[0] - b[0]));
  const n = intervals.length;
  const ends = intervals.map((v) => v[1]);

  function lastBefore(start: number): number {
    let lo = 0,
      hi = n - 1,
      res = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (ends[mid] < start) {
        res = mid;
        lo = mid + 1;
      } else hi = mid - 1;
    }
    return res;
  }

  const NEG = -Infinity;
  const dp = Array.from({ length: k + 1 }, () => new Array(n + 1).fill(NEG));
  for (let q = 0; q <= k; q++) dp[q][0] = 0;
  for (let i = 0; i <= n; i++) dp[0][i] = 0;

  for (let q = 1; q <= k; q++) {
    for (let i = 1; i <= n; i++) {
      const [l, , w] = intervals[i - 1];
      dp[q][i] = dp[q][i - 1]; // skip
      const prev = lastBefore(l);
      const base = dp[q - 1][prev + 1];
      if (base !== NEG) dp[q][i] = Math.max(dp[q][i], base + w);
    }
  }
  return Math.max(0, dp[k][n]);
}
```

---

## 🧪 Test Cases

```typescript
// prettier-ignore
const cases237 = [[[1,3,2],[4,6,5],[2,5,3],[7,10,4]],[[1,2,4],[3,4,3],[2,3,1],[5,6,2]]];
console.log(maximumWeight(cases237[0], 2)); // → 9
console.log(maximumWeight(cases237[1], 2)); // → 7
console.log(maximumWeight([[1,3,3]], 1));   // → 3
console.log(maximumWeight([[1,2,1],[3,4,2],[5,6,3],[7,8,4]], 4)); // → 10
```

---

## Related Problems

| Problem                                                                                            | Difficulty | Pattern            |
| -------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling) | Hard       | DP + Binary Search |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals)               | Medium     | Greedy             |
| [Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes)                     | Hard       | DP + Binary Search |
