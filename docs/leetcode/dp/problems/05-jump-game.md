---
layout: page
title: "Jump Game"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Greedy]
leetcode_url: "https://leetcode.com/problems/jump-game/"
leetcode_number: 55
pattern: "Greedy (Track Max Reachable Index)"
frequency_tier: 2
companies: [Amazon, Microsoft, Grab, Google]
target_time_minutes: 15
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Jump Game / Trò Chơi Nhảy

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: ⭐ Tier 2 — Gặp >40% interviews
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii/) | [Climbing Stairs](./02-climbing-stairs.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng bạn đang nhảy qua từng tảng đá trên sông để sang bờ. Mỗi tảng đá có con số ghi "bạn có thể nhảy tối đa bao nhiêu bước từ đây". Thay vì thử từng đường nhảy, bạn chỉ cần hỏi một câu: "Tính đến đây, mình có thể vươn tới bao xa?" — nếu con số đó không bao giờ bị tụt lại phía sau vị trí đang đứng, bạn sẽ sang được bờ.

**Pattern Recognition:**

- Signal: "maximum jump length", "can you reach the last index" → **Greedy (track max reachable)**
- Không cần biết chính xác nhảy bước nào — chỉ cần track vị trí xa nhất đang có thể đến
- Nếu `i > maxReachable` ở bất kỳ điểm nào, ta đang đứng ở ô không thể đến → return false ngay

**Visual — Greedy scan trên nums = [2,3,1,1,4]:**

```
index:  0  1  2  3  4
nums:  [2, 3, 1, 1, 4]

i=0: maxReachable = max(0, 0+2) = 2
i=1: maxReachable = max(2, 1+3) = 4
i=2: maxReachable = max(4, 2+1) = 4  →  4 >= last(4) ✅ return true
```

**Visual — Stuck case: nums = [3,2,1,0,4]:**

```
i=0: maxReachable = max(0, 0+3) = 3
i=1: maxReachable = max(3, 1+2) = 3
i=2: maxReachable = max(3, 2+1) = 3
i=3: maxReachable = max(3, 3+0) = 3
i=4: i(4) > maxReachable(3)  →  return false ❌
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Khi thấy | Nghĩ đến |
|---|---|
| **When you see** | Can you reach end from start, each position has max jump length |
| **Think** | Greedy — track `maxReach`; if `i > maxReach` you're stuck, cannot reach current position |
| **Template** | `maxReach = max(maxReach, i + nums[i]); if i > maxReach return false` |
| **Time target** | ≤ 15 min — greedy insight ~3 min, code ~5 min, trace examples ~7 min |

**Memory hook:** "maxReach = tầm với xa nhất — nếu vị trí hiện tại vượt qua tầm với, stuck!"

---

## Problem Description

Given an integer array `nums` where `nums[i]` is the maximum jump length at position `i`. Starting at index 0, return `true` if you can reach the last index, `false` otherwise.

```
Example 1: nums = [2,3,1,1,4] → true   (jump 0→1→4)
Example 2: nums = [3,2,1,0,4] → false  (always stuck at index 3)
Example 3: nums = [0]         → true   (already at last index)
```

Constraints:

- `1 <= nums.length <= 10^4`
- `0 <= nums[i] <= 10^5`

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

> **U — Understand:** "I start at index 0 and each element tells me the maximum number of steps I can jump forward. I need to return true if I can reach the last index via any sequence of jumps. Can array length be 1? Can all elements be 0?"

> **M — Match:** "My first instinct is DP, but this is actually a Greedy problem. Instead of tracking which exact path to take, I just need to track the farthest index I can reach at any point. If the current index ever exceeds my farthest reachable index, I'm stuck — return false."

> **P — Plan:** "Maintain `maxReach = 0`. Loop through each index i from 0 to n-1. First check: if `i > maxReach`, return false — I can't even be standing here. Then update `maxReach = max(maxReach, i + nums[i])`. If the loop completes without getting stuck, return true."

> **I — Implement:** "`let maxReach = 0; for (let i = 0; i < nums.length; i++) { if (i > maxReach) return false; maxReach = Math.max(maxReach, i + nums[i]); } return true;`"

> **R/E — Review & Evaluate:** "Time O(n) — single left-to-right pass. Space O(1) — one variable. Edge case: `[0]` — loop runs once, i=0 is not > maxReach=0, returns true. Edge case: `[0,1]` — at i=0, maxReach stays 0; at i=1, i(1) > maxReach(0) → false."

---

## 📝 Interview Tips

1. **Clarify**: Can array length be 1? Can nums[i] be 0? / Mảng có thể chỉ có 1 phần tử không? nums[i] = 0 có hợp lệ không?
2. **Brute force**: DP từ phải sang trái — đánh dấu `dp[i] = true` nếu nhảy được đến ô `dp[j] = true`. O(n²) time, O(n) space.
3. **Optimize**: Greedy — track `maxReachable`. Nếu `i > maxReachable` → return false. O(n) time, O(1) space.
4. **Edge cases**: `nums = [0]` → true (single element); `nums = [0, 1]` → false (can't move from index 0).
5. **Follow-up**: Jump Game II — số bước nhảy ít nhất để đến cuối (same greedy idea, track jump count and current level end).

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| Mistake | Why It Fails | Fix |
|---|---|---|
| Using DP O(n²) when greedy O(n) works | Correct but slower than necessary — will pass but signals missed insight | Recognize that we only need to track the max reachable index, not which specific jumps to take |
| Checking `nums[i] === 0` as the failure condition | Zeros don't always block — you might have enough reach from before to skip over them | Only fail when `i > maxReach`; a zero at position 3 is fine if `maxReach` is already 5 |
| Not updating `maxReach` at every step | Misses longer jumps from earlier positions — `maxReach` stays artificially low | Update `maxReach = max(maxReach, i + nums[i])` at every index i in the loop |

---

## Solutions

```typescript

/**

- Solution 1: DP Bottom-Up (Brute Force)
- Time: O(n²) — for each index, check all reachable positions
- Space: O(n) — dp array
  */
  function canJumpDP(nums: number[]): boolean {
  const n = nums.length;
  const dp = new Array(n).fill(false);
  dp[n - 1] = true; // last index is always reachable from itself

for (let i = n - 2; i >= 0; i--) {
for (let j = 1; j <= nums[i] && i + j < n; j++) {
if (dp[i + j]) {
dp[i] = true;
break;
}
}
}

return dp[0];
}

/**

- Solution 2: Greedy — Track Max Reachable (Optimal)
- Time: O(n) — single left-to-right pass
- Space: O(1) — one variable
  */
  function canJump(nums: number[]): boolean {
  let maxReachable = 0;

for (let i = 0; i < nums.length; i++) {
if (i > maxReachable) return false; // this position is unreachable
maxReachable = Math.max(maxReachable, i + nums[i]);
}

return true;
}

// === Test Cases ===
console.log(canJump([2, 3, 1, 1, 4])); // true
console.log(canJump([3, 2, 1, 0, 4])); // false
console.log(canJump([0])); // true
console.log(canJump([0, 1])); // false

```

---

## 🔗 Related Problems

- [Jump Game II](https://leetcode.com/problems/jump-game-ii/) — minimum jumps to reach end (greedy extension)
- [Jump Game III](https://leetcode.com/problems/jump-game-iii/) — bi-directional jump variant
- [Climbing Stairs](./02-climbing-stairs.md) — DP reachability prerequisite
- [Merge Intervals](../../array/problems/22-merge-intervals.md) — greedy + array scan pattern

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric | Target | Your Result |
|---|---|---|
| Time to solve | ≤ 15 min | _____ min |
| Got optimal on first try | Yes | ☐ Yes ☐ No |
| Explained clearly | Yes | ☐ Yes ☐ No |
| Handled all edge cases | Yes | ☐ Yes ☐ No |

**SRS Schedule:** After solving — review in 1 day → 3 days → 7 days → 14 days → 30 days.

### Review Log

| Date | Time Taken | Notes |
|---|---|---|
| | | |
