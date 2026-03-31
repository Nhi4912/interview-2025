---
layout: page
title: "Find the Winner of the Circular Game"
difficulty: Medium
category: Array
tags: [Array, Math, Recursion, Queue, Simulation]
leetcode_url: "https://leetcode.com/problems/find-the-winner-of-the-circular-game"
---

# Find the Winner of the Circular Game / Tìm Người Thắng Trò Chơi Vòng Tròn

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Queue / Josephus Problem
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Predict the Winner](https://leetcode.com/problems/predict-the-winner) | [Time Needed to Buy Tickets](https://leetcode.com/problems/time-needed-to-buy-tickets)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống trò chơi "bắt vịt" ở hội làng — trẻ em đứng thành vòng tròn, đếm đến số k thì người đó bị loại. Vòng lại từ người tiếp theo, đếm tiếp. Đây chính là bài toán Josephus nổi tiếng từ thế kỷ 1!

**Pattern Recognition:**

- Signal: "vòng tròn + đếm + loại dần" → **Simulation với Queue** hoặc **Josephus math**
- Brute force: dùng mảng/queue, mô phỏng từng bước loại người → O(n·k)
- Optimal: Josephus recurrence — `f(n,k) = (f(n-1,k) + k) % n` → O(n)
- Key insight: sau khi loại 1 người, bài toán trở thành sub-problem với n-1 người, index dịch chuyển đi k

**Visual — n=6, k=2:**

```
Round 1: [1,2,3,4,5,6] → đếm 2 → loại 2 → [3,4,5,6,1]
Round 2: [3,4,5,6,1]   → đếm 2 → loại 4 → [5,6,1,3]
Round 3: [5,6,1,3]     → đếm 2 → loại 6 → [1,3,5]
Round 4: [1,3,5]       → đếm 2 → loại 3 → [5,1]
Round 5: [5,1]         → đếm 2 → loại 1 → [5]
Winner = 3!   ← Josephus(6,2) = 3 ✅

Josephus recurrence (0-indexed):
f(1) = 0
f(i) = (f(i-1) + k) % i
f(2) = (0+2)%2 = 0
f(3) = (0+2)%3 = 2
f(4) = (2+2)%4 = 0
f(5) = (0+2)%5 = 2
f(6) = (2+2)%6 = 4 → 1-indexed: 5 ✅
```

---

## Problem Description

There are `n` friends sitting in a circle, numbered 1 to n clockwise. Starting at friend 1, count **k** friends clockwise (including the starting one), the last counted friend **leaves the circle**. Repeat until one person remains. Return the winner's number.

**Example 1:**

```
Input:  n=5, k=2
Output: 3
Explanation: 2→4→1→5→3, last remaining is 3.
```

**Example 2:**

```
Input:  n=6, k=5
Output: 1
Explanation: 5→4→6→2→3→1, winner is 1.
```

**Constraints:** `1 ≤ k ≤ n ≤ 500`

---

## 📝 Interview Tips

1. **Clarify**: "Đếm theo chiều kim đồng hồ, bắt đầu từ 1, vòng tròn — đúng không?" / Confirm clockwise, 1-indexed, circular direction
2. **Brute force**: "Dùng queue: dequeue k-1 lần rồi bỏ k-th → O(n·k)" / Simulate with queue, rotate k-1 then remove
3. **Optimize**: "Bài toán Josephus — tính recurrence trong O(n)" / Josephus formula O(n), no extra memory
4. **Josephus formula**: "f(1)=0; f(i)=(f(i-1)+k)%i — rồi +1 để về 1-indexed" / Base f(1)=0, build up to n
5. **Edge cases**: "n=1 → trả về 1 ngay; k=1 → winner là n" / n=1 returns 1, k=1 always last person
6. **Follow-up**: "Nếu k > n? Vẫn hoạt động vì modulo xử lý được" / k > n still works due to modular arithmetic

---

## Solutions

```typescript
/**
 * Solution 1: Queue Simulation
 * Time: O(n·k) — rotate queue n-1 times, each rotation k steps
 * Space: O(n) — queue stores all n people
 */
function findTheWinnerSimulation(n: number, k: number): number {
  const queue: number[] = Array.from({ length: n }, (_, i) => i + 1);
  while (queue.length > 1) {
    // Rotate k-1 times to bring the k-th person to front, then remove
    for (let i = 0; i < k - 1; i++) {
      queue.push(queue.shift()!);
    }
    queue.shift(); // remove the k-th person
  }
  return queue[0];
}

/**
 * Solution 2: Josephus Math (Recurrence)
 * Time: O(n) — iterate from 2 to n
 * Space: O(1) — single variable
 *
 * f(1, k) = 0  (0-indexed: only one person, position 0)
 * f(i, k) = (f(i-1, k) + k) % i
 * Answer = f(n, k) + 1  (convert back to 1-indexed)
 */
function findTheWinner(n: number, k: number): number {
  let pos = 0; // winner's 0-indexed position for circle of 1 person
  for (let i = 2; i <= n; i++) {
    // When circle grows from i-1 to i people, shift position by k
    pos = (pos + k) % i;
  }
  return pos + 1; // convert to 1-indexed
}

// === Test Cases ===
console.log(findTheWinner(5, 2)); // 3
console.log(findTheWinner(6, 5)); // 1
console.log(findTheWinner(1, 1)); // 1
console.log(findTheWinner(6, 2)); // 5

// Verify both approaches match
for (let n = 1; n <= 8; n++) {
  for (let k = 1; k <= 4; k++) {
    const sim = findTheWinnerSimulation(n, k);
    const math = findTheWinner(n, k);
    console.assert(sim === math, `n=${n},k=${k}: sim=${sim} math=${math}`);
  }
}
console.log("All assertions passed ✅");
```

---

## 🔗 Related Problems

| Problem                                                                                                | Pattern             | Difficulty |
| ------------------------------------------------------------------------------------------------------ | ------------------- | ---------- |
| [Predict the Winner](https://leetcode.com/problems/predict-the-winner)                                 | Dynamic Programming | Medium     |
| [Time Needed to Buy Tickets](https://leetcode.com/problems/time-needed-to-buy-tickets)                 | Queue Simulation    | Easy       |
| [Design Circular Queue](https://leetcode.com/problems/design-circular-queue)                           | Queue Design        | Medium     |
| [Number of People Aware of a Secret](https://leetcode.com/problems/number-of-people-aware-of-a-secret) | Queue / DP          | Medium     |
| [Dota2 Senate](https://leetcode.com/problems/dota2-senate)                                             | Greedy + Queue      | Medium     |
