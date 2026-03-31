---
layout: page
title: "Gas Station"
difficulty: Medium
category: Array
tags: [Array, Greedy]
leetcode_url: "https://leetcode.com/problems/gas-station"
---

# Gas Station / Trạm Xăng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy Single Pass
> **Frequency**: 📘 Tier 3 — Gặp ở 16 companies (Amazon, Google)
> **See also**: [Jump Game](https://leetcode.com/problems/jump-game) | [Candy](https://leetcode.com/problems/candy)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống lái xe vòng quanh vòng tròn — nếu tổng xăng >= tổng chi phí thì chắc chắn có đáp án. Nếu tại điểm i xe hết xăng (tank < 0), thì không thể bắt đầu từ bất kỳ điểm nào trong [0, i] — reset điểm bắt đầu sang i+1.

**Pattern Recognition:**

- Signal: "circular array", "find starting point", "total >= 0 iff solution exists" → **Greedy**
- Key insight: nếu running sum < 0, tất cả điểm từ start tới i đều không dùng được → reset
- Tính tổng để check tính khả thi, đồng thời track điểm bắt đầu tốt nhất

**Visual — gas=[1,2,3,4,5], cost=[3,4,5,1,2]:**

```
diff = gas-cost: [-2, -2, -2, 3, 3]

totalTank tracks sum(diff) — if ≥ 0, solution exists
currTank  tracks running sum from current `start`

i=0: diff=-2, total=-2, curr=-2 < 0 → reset start=1, curr=0
i=1: diff=-2, total=-4, curr=-2 < 0 → reset start=2, curr=0
i=2: diff=-2, total=-6, curr=-2 < 0 → reset start=3, curr=0
i=3: diff=3,  total=-3, curr=3
i=4: diff=3,  total=0,  curr=6

totalTank=0 ≥ 0 → answer exists → return start=3 ✅
```

---

## Problem Description

There are `n` gas stations in a circle. At station `i` you gain `gas[i]` and spend `cost[i]` to travel to station `i+1`. Starting with empty tank, find the unique starting station index from which you can complete the circuit, or return `-1` if impossible.

```
Example 1: gas=[1,2,3,4,5], cost=[3,4,5,1,2]  → 3
Example 2: gas=[2,3,4],     cost=[3,4,3]       → -1
```

Constraints: `n == gas.length == cost.length`, `1 <= n <= 10^5`, `0 <= gas[i], cost[i] <= 10^4`

---

## 📝 Interview Tips

1. **Clarify**: "Đảm bảo chỉ có duy nhất 1 đáp án nếu tồn tại?" / Confirm unique answer if it exists.
2. **Brute force**: Thử từng điểm bắt đầu O(n²) — khi sum < 0 break, try next start.
3. **Greedy key**: "Nếu total(gas) >= total(cost) thì answer tồn tại" — chứng minh trước.
4. **Reset insight**: Nếu từ start tới i hết xăng, mọi điểm trong [start, i] đều fail — start = i+1.
5. **Proof**: Điểm start tốt nhất là điểm ngay sau đoạn "thâm hụt lớn nhất".
6. **Edge cases**: n=1 (gas[0]>=cost[0] → 0, else -1), tất cả bằng 0 → return 0.

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — try each starting station
 * Time: O(n²) — for each of n starts, simulate up to n steps
 * Space: O(1)
 */
function canCompleteCircuit1(gas: number[], cost: number[]): number {
  const n = gas.length;
  for (let start = 0; start < n; start++) {
    let tank = 0;
    let count = 0;
    let i = start;
    while (count < n) {
      tank += gas[i] - cost[i];
      if (tank < 0) break;
      i = (i + 1) % n;
      count++;
    }
    if (count === n) return start;
  }
  return -1;
}

/**
 * Solution 2: Greedy Single Pass
 * Time: O(n) — one traversal
 * Space: O(1)
 *
 * Two key observations:
 * 1. If total(gas) >= total(cost), a solution always exists (and is unique).
 * 2. If currTank < 0 after visiting station i, we cannot start from any
 *    station in [start..i] — reset start to i+1 and currTank to 0.
 *
 * At the end, if totalTank >= 0, `start` is the answer; else -1.
 */
function canCompleteCircuit(gas: number[], cost: number[]): number {
  let totalTank = 0;
  let currTank = 0;
  let start = 0;

  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i];
    totalTank += diff;
    currTank += diff;
    if (currTank < 0) {
      // Cannot reach i+1 from current start — reset
      start = i + 1;
      currTank = 0;
    }
  }

  return totalTank >= 0 ? start : -1;
}

// === Test Cases ===
console.log(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2])); // 3
console.log(canCompleteCircuit([2, 3, 4], [3, 4, 3])); // -1
console.log(canCompleteCircuit([5, 1, 2, 3, 4], [4, 4, 1, 5, 1])); // 4
console.log(canCompleteCircuit([1], [1])); // 0
console.log(canCompleteCircuit([0], [1])); // -1
console.log(canCompleteCircuit1([1, 2, 3, 4, 5], [3, 4, 5, 1, 2])); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                              | Relationship                    |
| ---------------------------------------------------------------------------------------------------- | ------------------------------- |
| [134. Gas Station](https://leetcode.com/problems/gas-station/)                                       | This problem                    |
| [55. Jump Game](https://leetcode.com/problems/jump-game/)                                            | Greedy — can you reach the end? |
| [45. Jump Game II](https://leetcode.com/problems/jump-game-ii/)                                      | Greedy — minimum jumps          |
| [135. Candy](https://leetcode.com/problems/candy/)                                                   | Greedy constraint satisfaction  |
| [406. Queue Reconstruction by Height](https://leetcode.com/problems/queue-reconstruction-by-height/) | Greedy with sorting             |
