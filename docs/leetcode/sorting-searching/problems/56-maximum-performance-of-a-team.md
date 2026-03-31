---
layout: page
title: "Maximum Performance of a Team"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Greedy, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/maximum-performance-of-a-team"
---

# Maximum Performance of a Team / Hiệu Suất Tối Đa của Đội

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Sort + Min-Heap
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn chọn đội kỹ sư tối đa k người. Hiệu suất = (tổng speed) × (efficiency thấp nhất). Thay vì thử mọi tổ hợp, hãy **sắp xếp theo efficiency giảm dần** — khi duyệt đến engineer thứ i, efficiency của họ chính là min efficiency của đội hiện tại.

**Pattern Recognition:**

- Signal: "choose at most k" + "bottleneck × sum" → **Sort one dimension + Min-Heap cho dimension kia**
- Sort by efficiency desc → engineer hiện tại luôn là min efficiency
- Min-heap size k → track k speeds cao nhất (loại thấp nhất khi heap > k)

**Visual — Sort by efficiency, slide min-heap:**

```
n=6, speed=[2,10,3,1,5,8], efficiency=[5,4,3,9,7,2], k=2

Engineers sorted by efficiency desc:
  [eff=9,spd=1], [eff=7,spd=5], [eff=5,spd=2],
  [eff=4,spd=10],[eff=3,spd=3], [eff=2,spd=8]

Step eff=9: heap=[1],        sum=1,  perf=1×9=9
Step eff=7: heap=[1,5],      sum=6,  perf=6×7=42   ← max!
Step eff=5: heap=[2,5],      sum=7,  perf=7×5=35   (evict 1)
Step eff=4: heap=[5,10],     sum=15, perf=15×4=60  ← new max!
...
Answer = 60  ✅
```

---

## Problem Description

Cho `n` kỹ sư với `speed[i]` và `efficiency[i]`. Chọn **tối đa k** kỹ sư để tối đa hóa hiệu suất = `(tổng speed) × (efficiency nhỏ nhất)`. Trả về kết quả `mod 10⁹+7`. ([LeetCode 1383](https://leetcode.com/problems/maximum-performance-of-a-team))

- Example 1: `n=6, speed=[2,10,3,1,5,8], efficiency=[5,4,3,9,7,2], k=2` → `60`
- Example 2: `n=6, speed=[2,10,3,1,5,8], efficiency=[5,4,3,9,7,2], k=3` → `68`
- Example 3: `n=6, speed=[2,10,3,1,5,8], efficiency=[5,4,3,9,7,2], k=4` → `72`

Constraints: `1 ≤ k ≤ n ≤ 10⁵`, `speed[i], efficiency[i] ≤ 10⁸`

---

## 📝 Interview Tips

1. **Clarify**: "Tối đa k hay chính xác k kỹ sư?" / At most k (can choose fewer)
2. **Brute force**: "Thử mọi subset C(n,k) × O(k) → quá chậm với n=10⁵" / All subsets infeasible
3. **Key insight**: "Fix min-efficiency → sort desc, duyệt từng engineer là min" / Sort + iterate trick
4. **Heap role**: "Min-heap giữ k speed lớn nhất; khi vượt k, pop speed nhỏ nhất" / Maintain top-k speeds
5. **Overflow**: "speedSum × eff có thể lên 10¹⁸ > Number.MAX_SAFE_INTEGER → dùng BigInt" / Use BigInt for multiplication
6. **Edge**: "k=1 → chọn engineer có max(speed × efficiency)" / k=1 is a valid special case

---

## Solutions

```typescript
// Compact min-heap for number values
class MinHeap {
  private h: number[] = [];
  push(v: number) {
    this.h.push(v);
    let i = this.h.length - 1;
    while (i > 0 && this.h[(i - 1) >> 1] > this.h[i]) {
      const p = (i - 1) >> 1;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
      i = p;
    }
  }
  pop(): number {
    const top = this.h[0],
      last = this.h.pop()!;
    if (this.h.length) {
      this.h[0] = last;
      let i = 0;
      while (true) {
        let j = 2 * i + 1;
        if (j + 1 < this.h.length && this.h[j + 1] < this.h[j]) j++;
        if (j >= this.h.length || this.h[i] <= this.h[j]) break;
        [this.h[i], this.h[j]] = [this.h[j], this.h[i]];
        i = j;
      }
    }
    return top;
  }
  size(): number {
    return this.h.length;
  }
}

/**
 * Solution 1: Brute Force — try all pairs/triples
 * Time: O(n² log n) — all pairs for k=2, sort each; O(n^k) general
 * Space: O(n) — storing engineer pairs
 */
function maximumPerformanceBruteForce(
  n: number,
  speed: number[],
  efficiency: number[],
  k: number,
): number {
  const MOD = 1_000_000_007n;
  const eng = efficiency.map((e, i) => [e, speed[i]]);
  eng.sort((a, b) => b[0] - a[0]);
  let maxPerf = 0n;
  // Try every engineer as the minimum efficiency
  for (let i = 0; i < n; i++) {
    const minEff = eng[i][0];
    const speeds = eng
      .slice(0, i + 1)
      .map((e) => e[1])
      .sort((a, b) => b - a)
      .slice(0, k);
    const sumSpd = speeds.reduce((s, v) => s + v, 0);
    const perf = BigInt(sumSpd) * BigInt(minEff);
    if (perf > maxPerf) maxPerf = perf;
  }
  return Number(maxPerf % MOD);
}

/**
 * Solution 2: Sort by Efficiency Desc + Min-Heap (Optimal)
 * Time: O(n log k) — sort O(n log n), min-heap push/pop O(log k) per engineer
 * Space: O(k) — heap stores at most k speeds
 */
function maximumPerformanceOfATeam(
  n: number,
  speed: number[],
  efficiency: number[],
  k: number,
): number {
  const MOD = 1_000_000_007n;
  // Sort engineers by efficiency descending
  const engineers = efficiency.map((e, i) => [e, speed[i]] as [number, number]);
  engineers.sort((a, b) => b[0] - a[0]);

  const heap = new MinHeap(); // Min-heap tracks the k highest speeds
  let speedSum = 0;
  let maxPerf = 0n;

  for (const [eff, spd] of engineers) {
    heap.push(spd);
    speedSum += spd;
    // If we have more than k engineers, evict the slowest
    if (heap.size() > k) speedSum -= heap.pop();
    // Current engineer is the minimum efficiency in any valid team including them
    const perf = BigInt(speedSum) * BigInt(eff);
    if (perf > maxPerf) maxPerf = perf;
  }

  return Number(maxPerf % MOD);
}

// === Test Cases ===
console.log(maximumPerformanceOfATeam(6, [2, 10, 3, 1, 5, 8], [5, 4, 3, 9, 7, 2], 2)); // 60
console.log(maximumPerformanceOfATeam(6, [2, 10, 3, 1, 5, 8], [5, 4, 3, 9, 7, 2], 3)); // 68
console.log(maximumPerformanceOfATeam(6, [2, 10, 3, 1, 5, 8], [5, 4, 3, 9, 7, 2], 4)); // 72
console.log(maximumPerformanceOfATeam(1, [7], [3], 1)); // 21
```

---

## 🔗 Related Problems

- [IPO](https://leetcode.com/problems/ipo) — sort + max-heap greedy to maximize capital
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — heap-based greedy scheduling
- [Maximum Number of Events That Can Be Attended](https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended) — sort + heap event selection
- [Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists) — heap over sorted candidates
- [Maximum Performance of a Team — LeetCode](https://leetcode.com/problems/maximum-performance-of-a-team) — problem page
