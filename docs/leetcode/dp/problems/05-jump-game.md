---
layout: page
title: "Jump Game"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Greedy]
leetcode_url: "https://leetcode.com/problems/jump-game/"
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

## 📝 Interview Tips

1. **Clarify**: Can array length be 1? Can nums[i] be 0? / Mảng có thể chỉ có 1 phần tử không? nums[i] = 0 có hợp lệ không?
2. **Brute force**: DP từ phải sang trái — đánh dấu `dp[i] = true` nếu nhảy được đến ô `dp[j] = true`. O(n²) time, O(n) space.
3. **Optimize**: Greedy — track `maxReachable`. Nếu `i > maxReachable` → return false. O(n) time, O(1) space.
4. **Edge cases**: `nums = [0]` → true (single element); `nums = [0, 1]` → false (can't move from index 0).
5. **Follow-up**: Jump Game II — số bước nhảy ít nhất để đến cuối (same greedy idea, track jump count and current level end).

---

## Solutions

{% raw %}

/\*\*

- Solution 1: DP Bottom-Up (Brute Force)
- Time: O(n²) — for each index, check all reachable positions
- Space: O(n) — dp array
  \*/
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

/\*\*

- Solution 2: Greedy — Track Max Reachable (Optimal)
- Time: O(n) — single left-to-right pass
- Space: O(1) — one variable
  \*/
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

{% endraw %}

---

## 🔗 Related Problems

- [Jump Game II](https://leetcode.com/problems/jump-game-ii/) — minimum jumps to reach end (greedy extension)
- [Jump Game III](https://leetcode.com/problems/jump-game-iii/) — bi-directional jump variant
- [Climbing Stairs](./02-climbing-stairs.md) — DP reachability prerequisite
- [Merge Intervals](../../array/problems/22-merge-intervals.md) — greedy + array scan pattern
