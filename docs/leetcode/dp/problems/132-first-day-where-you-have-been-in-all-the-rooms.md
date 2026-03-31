---
layout: page
title: "First Day Where You Have Been in All the Rooms"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/first-day-where-you-have-been-in-all-the-rooms"
---

# First Day Where You Have Been in All the Rooms / Ngày Đầu Tiên Thăm Tất Cả Phòng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 | **Company tags**: Google, Uber

## 🧠 Intuition / Tư Duy

**Analogy:** Như hành trình mê cung với quy tắc — lần đầu vào phòng i thì quay lại nextVisit[i], lần thứ hai thì tiến lên phòng i+1. Bạn tính ngày đầu tiên đặt chân vào phòng n-1 bằng cách suy ra từ ngày đặt chân vào các phòng trước.

**Pattern Recognition:**

- "Simulate revisiting rooms with alternating rules" → DP on first-visit day per room
- dp[i] = day of first visit to room i; depends on dp[i-1] and dp[nextVisit[i-1]]
- Cost to loop back from room i-1 to nextVisit[i-1] and return = dp[i-1] - dp[nextVisit[i-1]]

**Visual:**

```
nextVisit = [0, 0, 2]   n=3
dp[0] = 0  (start here on day 0)
dp[1]: from room 0 (1st visit, day 0) → go to nextVisit[0]=0 (day 1)
       from room 0 (2nd visit, day 1) → go to room 1 (day 2)
       dp[1] = 2 * dp[0] - dp[nextVisit[0]] + 2 = 0 - 0 + 2 = 2
dp[2]: dp[2] = 2 * dp[1] - dp[nextVisit[1]] + 2 = 4 - 0 + 2 = 6  answer=6
```

## Problem Description

There are `n` rooms (0 to n-1). On the 1st visit to room `i`: go to `nextVisit[i]`. On the 2nd visit: go to room `i+1`. Starting at room 0 on day 0, return the day (0-indexed) of first visiting room `n-1`. Return modulo 10⁹+7.

Examples: nextVisit=[0,0] → 2; nextVisit=[0,0,2] → 6.

## 📝 Interview Tips

1. **Clarify**: Ngày đầu vào phòng n-1, không phải tất cả phòng / want the day of first-time entry into room n-1.
2. **Approach**: Recurrence: dp[i] = 2\*dp[i-1] - dp[nextVisit[i-1]] + 2 (modular arithmetic, add MOD before %).
3. **Edge cases**: n=1 → already in room 0 on day 0 → return 0; nextVisit[i]=i → quay lại chính phòng đó, tăng thêm 2 ngày.
4. **Optimize**: Chỉ cần mảng dp 1D — O(n) space là đủ / O(n) space suffices; can't reduce further (need all prev dp values).
5. **Follow-up**: Nếu có k loại quy tắc khác nhau → mở rộng DP state theo số lần thăm.
6. **Complexity**: Time O(n), Space O(n).

## Solutions

```typescript
/** Solution 1: DP with recurrence
 * dp[i] = 2*dp[i-1] - dp[nextVisit[i-1]] + 2  (mod MOD)
 * Time: O(n) | Space: O(n)
 * Derivation:
 *   From room i-1 (1st visit, day dp[i-1]):
 *     → go to nextVisit[i-1] (1 day), need to reach room i-1 again (2nd visit)
 *     → cost to go from nextVisit[i-1] back to i-1 = dp[i-1] - dp[nextVisit[i-1]] days
 *     → then +1 to move from i-1 to i
 */
function firstDayBeenInAllRooms(nextVisit: number[]): number {
  const MOD = 1_000_000_007;
  const n = nextVisit.length;
  const dp = new Array<number>(n).fill(0);
  for (let i = 1; i < n; i++) {
    // Add MOD before modulo to handle potential negative from subtraction
    dp[i] = (((2 * dp[i - 1]) % MOD) - dp[nextVisit[i - 1]] + 2 + MOD) % MOD;
  }
  return dp[n - 1];
}

/** Solution 2: Simulation (too slow for large n, good for understanding)
 * Time: O(2^n) worst case | Space: O(n)
 */
function firstDayBeenInAllRoomsSim(nextVisit: number[]): number {
  const MOD = 1_000_000_007;
  const n = nextVisit.length;
  const visitCount = new Array<number>(n).fill(0);
  let room = 0,
    day = 0;
  // Simulate until we first reach room n-1
  while (room < n - 1) {
    visitCount[room]++;
    room = visitCount[room] % 2 === 1 ? nextVisit[room] : room + 1;
    day = (day + 1) % MOD;
  }
  return day;
}

// Tests
console.log(firstDayBeenInAllRooms([0, 0])); // 2
console.log(firstDayBeenInAllRooms([0, 0, 2])); // 6
console.log(firstDayBeenInAllRooms([0, 0, 0])); // 6
console.log(firstDayBeenInAllRoomsSim([0, 0])); // 2
console.log(firstDayBeenInAllRoomsSim([0, 0, 2])); // 6
console.log(firstDayBeenInAllRooms([0])); // 0
```

## 🔗 Related Problems

| Problem                                                                                    | Relationship                                  |
| ------------------------------------------------------------------------------------------ | --------------------------------------------- |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii)                                 | DP on positions with forward transitions      |
| [Student Attendance Record II](https://leetcode.com/problems/student-attendance-record-ii) | Count sequences with complex transition rules |
| [Knight Dialer](https://leetcode.com/problems/knight-dialer)                               | Count paths via state-based transitions       |
