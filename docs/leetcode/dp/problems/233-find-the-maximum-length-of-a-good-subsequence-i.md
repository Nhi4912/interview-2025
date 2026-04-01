---
layout: page
title: "Find the Maximum Length of a Good Subsequence I"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Hash Table, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/find-the-maximum-length-of-a-good-subsequence-i"
---

# Find the Maximum Length of a Good Subsequence I / Tìm Độ Dài Lớn Nhất Của Dãy Con Tốt I

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Longest String Chain](https://leetcode.com/problems/longest-string-chain) | [Word Break II](https://leetcode.com/problems/word-break-ii)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Như xâu một chuỗi hạt nhiều màu — bạn được phép thay đổi màu tối đa k lần (từ đỏ sang xanh, từ xanh sang vàng v.v.). Mỗi hạt mới hỏi: "Nếu tôi cùng màu với hạt trước, tôi kéo dài chuỗi mà không tốn lần đổi. Nếu khác màu, tôi cần dùng thêm 1 lần đổi trong giới hạn k cho phép không?"

**Pattern Recognition:**

- Signal: longest subsequence with at most k "transitions" (adjacent different values) → **2D DP: index × transitions used**
- Key insight: `dp[i][j]` = max length of good subsequence ending at index `i` using exactly `j` transitions. Transition from `p < i`: if `nums[p] == nums[i]`, no new transition (same j); else use one transition (j-1 → j).

**Visual — nums=[1,2,1,1,3], k=2 example:**

```
dp[i][j] = max length ending at i with j transitions used

i=0(1): dp[0][0..2] = 1  (single element, 0 transitions)
i=1(2): j=0: nums[1]=2 vs prev 1: diff → skip (need j≥1)
         j=1: from dp[0][0]+1 = 2 (1 transition used)
i=2(1): j=0: from dp[0][0]+1=2 (same value 1→1)
         j=1: from dp[1][0]+1=2 or dp[0][0]+... = best=3
i=3(1): j=0: from dp[2][0]+1=3 or dp[0][0]+1=2 → 3
         j=1: dp[2][0]+1=3, dp[1][0]+1=... → 3 or 4
i=4(3): j=2: best from all prior with 1 transition → 4+1=5? No
              [1,2,1,1] len=4 has 2 transitions already → adding 3 would be 3 transitions > k
Answer: 4  (subsequence [1,2,1,1])
```

---

## 📝 Problem Description

A "good subsequence" of `nums` has at most `k` indices where `nums[sub[i]] ≠ nums[sub[i+1]]`. Find the maximum length of any good subsequence.

- **Example 1:** `nums=[1,2,1,1,3], k=2` → `4` (subsequence `[1,2,1,1]` has 2 transitions)
- **Example 2:** `nums=[1,2,3,4,5,1], k=0` → `2` (best with 0 transitions: two 1s)
- **Constraints:** `1 ≤ nums.length ≤ 500`, `1 ≤ nums[i] ≤ 10^9`, `0 ≤ k ≤ min(n-1, 25)`

---

## 🎯 Interview Tips

1. **2D state** / Trạng thái 2D: `dp[i][j]` = độ dài tốt nhất kết thúc tại i dùng đúng j lần chuyển tiếp — nhưng "đúng j" hay "tối đa j"?
2. **Transition logic** / Logic chuyển tiếp: same value → free; different value → costs 1 transition (need j≥1)
3. **Inner loop direction** / Hướng vòng lặp trong: không tối ưu được xuống O(nk) đơn giản vì k nhỏ (≤25)
4. **k is small** / k nhỏ: với k ≤ 25, O(n²k) = O(500²×25) ≈ 6M operations — chấp nhận được
5. **Output** / Đầu ra: single element luôn hợp lệ (0 transitions), answer ≥ 1
6. **vs Part II** / So với Phần II: k ≤ 25 cho phép brute force; Part II có k ≤ n-1 cần tối ưu hơn

---

## 💡 Solutions

### Approach 1: O(n²k) DP — Direct State

/\*_ @complexity Time: O(n²k) | Space: O(nk) _/

```typescript
function maximumLengthI(nums: number[], k: number): number {
  const n = nums.length;
  // dp[i][j] = max good-subseq length ending at index i with exactly j transitions
  const dp: number[][] = Array.from({ length: n }, () => new Array(k + 1).fill(1));
  let res = 1;

  for (let i = 1; i < n; i++) {
    for (let j = 0; j <= k; j++) {
      for (let p = 0; p < i; p++) {
        if (nums[p] === nums[i]) {
          // Same value: extend with no new transition
          dp[i][j] = Math.max(dp[i][j], dp[p][j] + 1);
        } else if (j > 0) {
          // Different value: uses one transition slot
          dp[i][j] = Math.max(dp[i][j], dp[p][j - 1] + 1);
        }
      }
      res = Math.max(res, dp[i][j]);
    }
  }
  return res;
}
```

### Approach 2: Optimized with Per-Value Best Tracking

/\*_ @complexity Time: O(n²k) | Space: O(nk) — same worst case, faster in practice _/

```typescript
function maximumLength(nums: number[], k: number): number {
  const n = nums.length;
  const dp: number[][] = Array.from({ length: n }, () => new Array(k + 1).fill(1));
  // best[j] = max dp[*][j] so far (for "different value" transitions)
  // bestByVal[v][j] = max dp[*][j] where nums[*] == v (for "same value" continuations)
  const bestByVal = new Map<number, number[]>();
  let res = 1;

  for (let i = 0; i < n; i++) {
    const v = nums[i];
    if (!bestByVal.has(v)) bestByVal.set(v, new Array(k + 1).fill(0));
    for (let j = 0; j <= k; j++) {
      // Extend from same-value best
      dp[i][j] = Math.max(dp[i][j], (bestByVal.get(v)![j] ?? 0) + 1);
    }
    // We still need the "different value" path; use the O(n²k) scan for correctness
    for (let p = 0; p < i; p++) {
      for (let j = 1; j <= k; j++) {
        if (nums[p] !== v) {
          dp[i][j] = Math.max(dp[i][j], dp[p][j - 1] + 1);
        }
      }
    }
    // Update bestByVal for future indices
    for (let j = 0; j <= k; j++) {
      bestByVal.get(v)![j] = Math.max(bestByVal.get(v)![j], dp[i][j]);
      res = Math.max(res, dp[i][j]);
    }
  }
  return res;
}
```

---

## 🧪 Test Cases

```typescript
console.log(maximumLength([1, 2, 1, 1, 3], 2)); // → 4
console.log(maximumLength([1, 2, 3, 4, 5, 1], 0)); // → 2 (two 1s)
console.log(maximumLength([1, 1, 1], 0)); // → 3 (all same)
console.log(maximumLength([1, 2], 1)); // → 2 ([1,2] has 1 transition)
console.log(maximumLength([1, 2, 3], 0)); // → 1 (no transitions allowed)
```

---

## Related Problems

| Problem                                                                                                                            | Difficulty | Pattern                   |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------- |
| [Find the Maximum Length of a Good Subsequence II](https://leetcode.com/problems/find-the-maximum-length-of-a-good-subsequence-ii) | Hard       | DP + HashMap Optimization |
| [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence)                                     | Medium     | DP / Binary Search        |
| [Delete and Earn](https://leetcode.com/problems/delete-and-earn)                                                                   | Medium     | DP                        |
