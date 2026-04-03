---
layout: page
title: "Exclusive Time of Functions"
difficulty: Medium
category: Array
tags: [Array, Stack]
leetcode_url: "https://leetcode.com/problems/exclusive-time-of-functions"
---

# Exclusive Time of Functions / Thời Gian Riêng Của Hàm

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack (Call Stack Simulation)
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống CPU call stack — khi hàm A gọi hàm B, A bị tạm dừng. Khi B kết thúc, A tiếp tục. Dùng stack mô phỏng đúng hành vi này: thời gian của hàm trên top stack bị dừng khi có hàm mới start, và được cộng lại khi hàm đó end.

**Pattern Recognition:**

- Signal: "nested function calls with timestamps" → **Stack** (call stack simulation)
- Khi `start`: cộng thời gian cho hàm hiện tại, push hàm mới, cập nhật prevTime
- Khi `end`: cộng thời gian (ts - prevTime + 1) cho hàm hiện tại, pop, cập nhật prevTime = ts+1

**Visual — Stack Simulation:**

```
logs: "0:start:0","1:start:2","1:end:5","0:end:6"

t=0: start fn0 → stack=[0], prevTime=0
t=2: start fn1 → time[0]+=2-0=2, stack=[0,1], prevTime=2
t=5: end fn1  → time[1]+=5-2+1=4, stack=[0], prevTime=6
t=6: end fn0  → time[0]+=6-6+1=1, stack=[], prevTime=7

Result: time[0]=3, time[1]=4 ✅
```

---

## Problem Description

Given `n` functions (0 to n-1) and logs in format `"id:start/end:timestamp"`, compute the **exclusive time** (time spent in function excluding called sub-functions) for each function. ([LeetCode](https://leetcode.com/problems/exclusive-time-of-functions))

Difficulty: Medium | Acceptance: 64.8%

- Example 1: `n=2, logs=["0:start:0","1:start:2","1:end:5","0:end:6"]` → `[3,4]`
- Example 2: `n=1, logs=["0:start:0","0:start:2","0:end:5","0:end:6"]` → `[8]`

Constraints: `1 ≤ n ≤ 100`, `1 ≤ logs.length ≤ 500`, timestamps are integers `0 ≤ ts ≤ 10^9`

---

## 📝 Interview Tips

1. **Clarify**: "Timestamp là đơn vị thời gian, 'end:5' nghĩa là chiếm hết unit 5" / end:t means the function occupies time unit t (inclusive)
2. **Stack role**: "Stack giữ call stack hiện tại — top là hàm đang chạy" / Stack = current call stack, top = currently running function
3. **On start**: "Cộng (ts - prevTime) cho hàm đang chạy (top), push hàm mới" / On start: credit elapsed time to current function, push new
4. **On end**: "Cộng (ts - prevTime + 1) cho hàm hiện tại (vì end là inclusive), pop, prevTime = ts+1" / On end: +1 because end timestamp is inclusive
5. **prevTime**: "prevTime theo dõi thời điểm bắt đầu của đoạn thời gian hiện tại" / prevTime = start of current unaccounted time segment
6. **Edge cases**: "Hàm gọi chính nó (recursive), nhiều lần gọi cùng id" / Recursive calls, multiple calls to same function

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — track time for each unit (TLE for large ts)
 * Time: O(max_timestamp) — simulate each time unit
 * Space: O(n + max_call_depth) — time array + stack
 */
function exclusiveTimeOfFunctionsBrute(n: number, logs: string[]): number[] {
  const time = new Array(n).fill(0);
  const stack: number[] = [];
  let prev = 0;

  for (const log of logs) {
    const parts = log.split(":");
    const id = parseInt(parts[0]);
    const type = parts[1];
    const ts = parseInt(parts[2]);

    if (type === "start") {
      if (stack.length) time[stack[stack.length - 1]] += ts - prev;
      stack.push(id);
      prev = ts;
    } else {
      time[stack.pop()!] += ts - prev + 1;
      prev = ts + 1;
    }
  }
  return time;
}

/**
 * Solution 2: Stack Simulation (optimal — same complexity but clearer)
 * Time: O(L) — L = number of log entries
 * Space: O(n + d) — n for result, d = max call stack depth
 *
 * prevTime tracks start of current unaccounted time segment.
 * On start: accumulate to top-of-stack function, push new function.
 * On end: accumulate to current function (inclusive +1), pop, advance prevTime.
 */
function exclusiveTimeOfFunctions(n: number, logs: string[]): number[] {
  const time = new Array(n).fill(0);
  const stack: number[] = []; // current call stack (function ids)
  let prevTime = 0; // timestamp where current segment started

  for (const log of logs) {
    const [idStr, type, tsStr] = log.split(":");
    const id = parseInt(idStr);
    const ts = parseInt(tsStr);

    if (type === "start") {
      // Credit elapsed time to currently running function (top of stack)
      if (stack.length > 0) {
        time[stack[stack.length - 1]] += ts - prevTime;
      }
      stack.push(id);
      prevTime = ts;
    } else {
      // 'end': this function occupied [prevTime, ts] inclusive
      time[stack.pop()!] += ts - prevTime + 1;
      prevTime = ts + 1; // next segment starts after ts
    }
  }

  return time;
}

// === Test Cases ===
console.log(exclusiveTimeOfFunctions(2, ["0:start:0", "1:start:2", "1:end:5", "0:end:6"]));
// [3, 4]
console.log(exclusiveTimeOfFunctions(1, ["0:start:0", "0:start:2", "0:end:5", "0:end:6"]));
// [8]
console.log(exclusiveTimeOfFunctions(2, ["0:start:0", "0:end:0", "1:start:1", "1:end:1"]));
// [1, 1]
console.log(exclusiveTimeOfFunctions(1, ["0:start:0", "0:end:5"]));
// [6]
```

---

## 🔗 Related Problems

- [Asteroid Collision](https://leetcode.com/problems/asteroid-collision) — stack-based collision simulation
- [Flatten Nested List Iterator](https://leetcode.com/problems/flatten-nested-list-iterator) — stack for nested structure traversal
- [Basic Calculator](https://leetcode.com/problems/basic-calculator) — stack for parsing nested expressions
- [Minimum Add to Make Parentheses Valid](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid) — matching brackets with stack
- [Decode String](https://leetcode.com/problems/decode-string) — stack for nested decode operations
