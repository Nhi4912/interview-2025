---
layout: page
title: "Time Needed to Buy Tickets"
difficulty: Easy
category: Array
tags: [Array, Queue, Simulation]
leetcode_url: "https://leetcode.com/problems/time-needed-to-buy-tickets"
---

# Time Needed to Buy Tickets / Thời Gian Cần Để Mua Vé

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Find the Winner of the Circular Game](https://leetcode.com/problems/find-the-winner-of-the-circular-game) | [Design Snake Game](https://leetcode.com/problems/design-snake-game)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống **hàng xếp mua vé** — mỗi người mua 1 vé rồi ra cuối hàng nếu còn cần mua thêm. Ta cần biết lúc người thứ `k` mua xong. **Math shortcut:** Không cần mô phỏng! Với mỗi vị trí `i`:

```
i ≤ k: đóng góp min(tickets[i], tickets[k]) vòng
i > k: đóng góp min(tickets[i], tickets[k] - 1) vòng
(vì k xong trước khi i được lượt tiếp theo)

tickets = [2,3,2], k=1
i=0(≤k): min(2,3)=2
i=1(=k): min(3,3)=3
i=2(>k): min(2,2)=2 → total=7
```

---

## Problem Description / Mô Tả Bài Toán

Hàng `n` người, người thứ `i` cần mua `tickets[i]` vé. Mỗi giây người đầu hàng mua 1 vé, ra sau nếu chưa đủ. Trả về thời gian người thứ `k` (0-indexed) mua xong.

- **Input:** `tickets=[2,3,2], k=2` → **Output:** `6`
- **Input:** `tickets=[5,1,1,1], k=0` → **Output:** `8`

**Constraints:** `1 <= n <= 100`, `1 <= tickets[i] <= 100`, `0 <= k < n`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Math O(n): for i≤k contribute min(t[i], t[k]); for i>k contribute min(t[i], t[k]-1). **VI:** Toán học O(n): i≤k góp min(t[i], t[k]); i>k góp min(t[i], t[k]-1).
2. **EN:** Simulation O(n × max_tickets) works but math is preferred. **VI:** Mô phỏng O(n × max) đúng nhưng toán học O(n) được ưu tiên.
3. **EN:** The -1 for i>k: person k finishes before position i gets one more turn. **VI:** -1 cho i>k vì k xong trước khi i được lượt tiếp.
4. **EN:** Simulation: use a deque storing [index, remaining], break when index===k and remaining hits 0. **VI:** Mô phỏng: dùng deque [index, remaining], dừng khi index===k và remaining=0.
5. **EN:** Edge: k=0 (first person) → sum min(t[i], t[0]) for all i. **VI:** k=0 → tổng min(t[i], t[0]).
6. **EN:** All tickets > 0 guaranteed, so answer is always positive. **VI:** Tất cả tickets > 0 nên đáp án luôn dương.

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: Math Formula  O(n) time, O(1) space ─────────────────────────
function timeRequiredToBuy(tickets: number[], k: number): number {
  let time = 0;
  for (let i = 0; i < tickets.length; i++) {
    if (i <= k) {
      time += Math.min(tickets[i], tickets[k]);
    } else {
      time += Math.min(tickets[i], tickets[k] - 1);
    }
  }
  return time;
}

// ─── Solution 2: Queue Simulation  O(n × max_tickets) time ───────────────────
function timeRequiredToBuySimulation(tickets: number[], k: number): number {
  const queue: Array<[number, number]> = tickets.map((t, i) => [i, t]);
  let time = 0;

  while (true) {
    const [idx, remaining] = queue.shift()!;
    time++;
    if (remaining === 1) {
      if (idx === k) return time; // person k just finished
      // else: they bought their last ticket, leave queue
    } else {
      queue.push([idx, remaining - 1]);
    }
  }
}

// ─── Tests ───────────────────────────────────────────────────────────────────
console.log(timeRequiredToBuy([2, 3, 2], 2)); // 6
console.log(timeRequiredToBuy([5, 1, 1, 1], 0)); // 8
console.log(timeRequiredToBuy([2, 3, 2], 1)); // 7
console.log(timeRequiredToBuySimulation([2, 3, 2], 2)); // 6
console.log(timeRequiredToBuySimulation([5, 1, 1, 1], 0)); // 8
```
