---
layout: page
title: "Dota2 Senate"
difficulty: Medium
category: String
tags: [String, Greedy, Queue]
leetcode_url: "https://leetcode.com/problems/dota2-senate"
---

# Dota2 Senate / Thượng Viện Dota2

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Stamping The Sequence](https://leetcode.com/problems/stamping-the-sequence) | [Wildcard Matching](https://leetcode.com/problems/wildcard-matching)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Hãy nghĩ đến cuộc bỏ phiếu trong Quốc hội, nơi hai phe Radiant (R) và Dire (D) đấu nhau. Mỗi thượng nghị sĩ theo lượt — người đến trước được cấm người kế tiếp của phe đối lập. Dùng hai hàng đợi chỉ số: ai có chỉ số nhỏ hơn (đến trước) sẽ "vô hiệu hóa" đối thủ và xếp hàng lại với chỉ số tăng thêm n (lượt tiếp theo trong vòng sau).

**Pattern Recognition:**

- Signal: "two competing parties taking turns" + "earliest acts first" → **Greedy + Two Queues**
- Key insight: Dùng hai queue chỉ số R và D. Lần lượt lấy chỉ số nhỏ nhất từ mỗi queue. Ai nhỏ hơn (thứ tự trước) thì thắng — push lại với index+n. Ai thắng là loại đối thủ ra. Tiếp tục đến khi một queue rỗng.

**Visual — senate = "RRDDD":**

```
R queue: [0, 1]   (indices of R senators)
D queue: [2, 3, 4] (indices of D senators)

Round 1: R[0]=0 vs D[0]=2 → 0 < 2 → R wins, R re-queues as 0+5=5
  R queue: [1, 5]   D queue: [3, 4]

Round 2: R[0]=1 vs D[0]=3 → 1 < 3 → R wins, re-queues as 1+5=6
  R queue: [5, 6]   D queue: [4]

Round 3: R[0]=5 vs D[0]=4 → 4 < 5 → D wins, re-queues as 4+5=9
  R queue: [6]   D queue: [9]

Round 4: R[0]=6 vs D[0]=9 → 6 < 9 → R wins!
  D queue empty → "Radiant" wins!
```

---

## 📝 Problem Description

In Dota2, `n` senators from parties "Radiant" (R) and "Dire" (D) vote in rounds. Each senator can ban one senator of the opposite party per round (the next one in order). Continue until only one party remains. Return the winning party's name.

- **Example 1:** senate="RRDDD" → `"Radiant"`
- **Example 2:** senate="RDD" → `"Dire"`

Constraints: `1 ≤ n ≤ 10^4`, contains only 'R' and 'D'.

---

## 🎯 Interview Tips

1. **Greedy: earliest wins** / Tham lam: sớm hơn thắng: Senator with smaller index always defeats the next opponent.
2. **Two queues** / Hai hàng đợi: One per party storing indices — dequeue smallest, compare, winner re-enqueues.
3. **Re-queue with +n** / Xếp hàng lại với +n: Adding n simulates the senator moving to the next round.
4. **Why +n works** / Tại sao +n đúng: Preserves relative ordering; senators rotate in cycles of n.
5. **Termination** / Điều kiện dừng: Loop until one queue becomes empty.
6. **Edge: all one party** / Một phe hoàn toàn: If all R or all D, that party wins immediately (loop handles it).

---

## 💡 Solutions

### Approach 1: Simulation — Track Banned Senators

/\*_ @complexity Time: O(n²) | Space: O(n) _/

```typescript
function predictPartyVictoryBrute(senate: string): string {
  let arr = senate.split("");
  while (true) {
    let rBanned = 0,
      dBanned = 0;
    const next: string[] = [];
    for (const s of arr) {
      if (s === "R") {
        if (dBanned > 0) dBanned--;
        else {
          next.push("R");
          rBanned++;
        }
      } else {
        if (rBanned > 0) rBanned--;
        else {
          next.push("D");
          dBanned++;
        }
      }
    }
    arr = next;
    if (!arr.includes("R")) return "Dire";
    if (!arr.includes("D")) return "Radiant";
  }
}
```

### Approach 2: Two Queues — Greedy O(n)

/\*_ @complexity Time: O(n) | Space: O(n) _/

```typescript
function predictPartyVictory(senate: string): string {
  const n = senate.length;
  const rQueue: number[] = [];
  const dQueue: number[] = [];

  for (let i = 0; i < n; i++) {
    if (senate[i] === "R") rQueue.push(i);
    else dQueue.push(i);
  }

  while (rQueue.length > 0 && dQueue.length > 0) {
    const rIdx = rQueue.shift()!;
    const dIdx = dQueue.shift()!;

    if (rIdx < dIdx) {
      // R senator acts first: bans D, then R re-queues for next round
      rQueue.push(rIdx + n);
    } else {
      // D senator acts first: bans R, then D re-queues for next round
      dQueue.push(dIdx + n);
    }
  }

  return rQueue.length > 0 ? "Radiant" : "Dire";
}
```

---

## 🧪 Test Cases

```typescript
console.log(predictPartyVictory("RRDDD")); // → "Radiant"
console.log(predictPartyVictory("RDD")); // → "Dire"
console.log(predictPartyVictory("R")); // → "Radiant"
console.log(predictPartyVictory("D")); // → "Dire"
console.log(predictPartyVictory("RDRD")); // → "Radiant"
```

---

## 🔗 Related Problems

| Problem                                                              | Difficulty | Pattern         |
| -------------------------------------------------------------------- | ---------- | --------------- |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)       | Medium     | Greedy / Queue  |
| [Largest Number](https://leetcode.com/problems/largest-number)       | Medium     | Greedy          |
| [Remove K Digits](https://leetcode.com/problems/remove-k-digits)     | Medium     | Monotonic Stack |
| [Advantage Shuffle](https://leetcode.com/problems/advantage-shuffle) | Medium     | Greedy          |
