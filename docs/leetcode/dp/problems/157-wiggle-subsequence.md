---
layout: page
title: "Wiggle Subsequence"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Greedy]
leetcode_url: "https://leetcode.com/problems/wiggle-subsequence"
---

# Wiggle Subsequence / Dãy Con Lắc

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Như đếm đỉnh và đáy của đồ thị — mỗi khi hướng thay đổi (tăng → giảm hoặc ngược lại) ta thêm một phần tử. Greedy: luôn giữ đỉnh/đáy gần nhất.

```
nums = [1, 7, 4, 9, 2, 5]
        ↑  ↑  ↓  ↑  ↓  ↑   (arrows show change)
        1  7     9     5    ← keep peaks and valleys
up=1  → up=2 at 7 (7>1)
up=2  → down=3 at 4 (4<7)   down = up + 1 = 3
down=3→ up=4 at 9 (9>4)    up = down + 1 = 4
up=4  → down=5 at 2 (2<9)  down = up + 1 = 5
down=5→ up=6 at 5 (5>2)    up = down + 1 = 6

Answer = max(up, down) = 6
```

**Key insight:** Track `up` = length of longest wiggle ending with an upswing, `down` = ending with downswing. Update greedily: `nums[i] > nums[i-1]` → `up = down + 1`; `nums[i] < nums[i-1]` → `down = up + 1`.

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Greedy works**: Each local peak/valley can always be included — no benefit in skipping / mỗi đỉnh/đáy đều nên giữ
- 🔑 **Two variables**: `up` = longest wiggle ending ↑, `down` = ending ↓ / chỉ cần 2 biến
- 🔑 **Equal elements**: Skip (no update when `nums[i] == nums[i-1]`) / bỏ qua khi bằng nhau
- 🔑 **DP approach**: O(n²) also works: `dp[i][0/1]` = longest wiggle ending at i going up/down / DP O(n²) cũng đúng
- 🔑 **Init**: `up = down = 1` (single element is trivially a wiggle of length 1) / khởi tạo 1
- 🔑 **Answer**: `max(up, down)` / lấy max của hai chiều

---

## Solutions / Giải Pháp

### Solution 1: Greedy O(n) time, O(1) space

```typescript
/**
 * Wiggle Subsequence — Greedy
 *
 * Maintain two counters:
 *   up   = length of longest wiggle subsequence ending with an upswing (prev < curr)
 *   down = length of longest wiggle subsequence ending with a downswing (prev > curr)
 *
 * At each element:
 *   nums[i] > nums[i-1] → up = down + 1 (extend a downswing with an upswing)
 *   nums[i] < nums[i-1] → down = up + 1 (extend an upswing with a downswing)
 *   equal → no change
 *
 * Time:  O(n)
 * Space: O(1)
 */
function wiggleMaxLength(nums: number[]): number {
  if (nums.length <= 1) return nums.length;
  let up = 1,
    down = 1;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      up = down + 1;
    } else if (nums[i] < nums[i - 1]) {
      down = up + 1;
    }
    // Equal: no update
  }

  return Math.max(up, down);
}

console.log(wiggleMaxLength([1, 7, 4, 9, 2, 5])); // 6
console.log(wiggleMaxLength([1, 17, 5, 10, 13, 15, 10, 5, 16, 8])); // 7
console.log(wiggleMaxLength([1, 2, 3, 4, 5, 6, 7, 8, 9])); // 2 (monotone: only first and last)
console.log(wiggleMaxLength([1])); // 1
console.log(wiggleMaxLength([3, 3, 3, 2, 5])); // 3
```

### Solution 2: DP O(n) time, O(n) space

```typescript
/**
 * Wiggle Subsequence — DP with Arrays
 *
 * dp[i][0] = length of longest wiggle ending at i going UP (nums[i] > nums[i-1])
 * dp[i][1] = length of longest wiggle ending at i going DOWN (nums[i] < nums[i-1])
 *
 * Transition (O(n²) naive → optimized to O(n) using greedy observation):
 *   dp[i][0] = max over j<i where nums[j]<nums[i]: dp[j][1] + 1
 *   dp[i][1] = max over j<i where nums[j]>nums[i]: dp[j][0] + 1
 *
 * Greedy insight: we only need the most recent up/down, so O(n) via rolling.
 *
 * Time:  O(n)
 * Space: O(n) shown here (can be O(1))
 */
function wiggleMaxLengthDP(nums: number[]): number {
  const n = nums.length;
  if (n <= 1) return n;

  // dpUp[i] = longest wiggle ending at i, last direction was up
  // dpDn[i] = longest wiggle ending at i, last direction was down
  const dpUp = new Array(n).fill(1);
  const dpDn = new Array(n).fill(1);

  for (let i = 1; i < n; i++) {
    if (nums[i] > nums[i - 1]) {
      dpUp[i] = dpDn[i - 1] + 1;
      dpDn[i] = dpDn[i - 1]; // can't extend down here
    } else if (nums[i] < nums[i - 1]) {
      dpDn[i] = dpUp[i - 1] + 1;
      dpUp[i] = dpUp[i - 1]; // can't extend up here
    } else {
      dpUp[i] = dpUp[i - 1];
      dpDn[i] = dpDn[i - 1];
    }
  }

  return Math.max(dpUp[n - 1], dpDn[n - 1]);
}

console.log(wiggleMaxLengthDP([1, 7, 4, 9, 2, 5])); // 6
console.log(wiggleMaxLengthDP([1, 17, 5, 10, 13, 15, 10, 5, 16, 8])); // 7
console.log(wiggleMaxLengthDP([0, 0])); // 1
```

### Solution 3: Peak-Valley Count (O(n) intuitive)

```typescript
/**
 * Wiggle Subsequence — Count Peaks and Valleys
 *
 * Every local peak (higher than neighbors) and valley (lower than neighbors)
 * contributes one element. Start with 1 for the first element.
 *
 * Time:  O(n)
 * Space: O(1)
 */
function wiggleMaxLengthPeakValley(nums: number[]): number {
  if (nums.length <= 1) return nums.length;
  let count = 1;
  let prevDiff = 0;

  for (let i = 1; i < nums.length; i++) {
    const diff = nums[i] - nums[i - 1];
    // Count this as a wiggle point if direction changed
    if ((diff > 0 && prevDiff <= 0) || (diff < 0 && prevDiff >= 0)) {
      count++;
      prevDiff = diff;
    }
  }

  return count;
}

console.log(wiggleMaxLengthPeakValley([1, 7, 4, 9, 2, 5])); // 6
console.log(wiggleMaxLengthPeakValley([1, 2, 3, 4, 5])); // 2
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                                | Difficulty | Pattern     |
| ------------------------------------------------------------------------------------------------------ | ---------- | ----------- |
| [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence)         | 🟡 Medium  | DP          |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii)                                             | 🟡 Medium  | Greedy      |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals)                   | 🟡 Medium  | Greedy      |
| [Number of Ways to Select Buildings](https://leetcode.com/problems/number-of-ways-to-select-buildings) | 🟡 Medium  | DP Counting |
